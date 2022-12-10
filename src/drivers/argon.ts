/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type argon2 from 'argon2'
import { safeEqual } from '@poppinss/utils'

import { Hash } from '../hash.js'
import { PhcFormatter } from '../phc_formatter.js'
import {
  MAX_UINT24,
  MAX_UINT32,
  EnumValidator,
  RangeValidator,
  randomBytesAsync,
} from '../helpers.js'
import type { ArgonConfig, ArgonVariants } from '../types.js'

/**
 * Hash driver built on top of "argon2" hash algorigthm. Under the hood
 * we make use of the "argon2" npm package.
 *
 * The Argon implementation uses the PHC formatting for creating
 * and verifying hashes.
 *
 * ```ts
 * const argon = new Argon({})
 *
 * await argon.make('secret')
 * // $argon2id$v=19$t=3,m=4096,p=1$drxJBWzWahR5tMubp+a1Sw$L/Oh2uw6QKW77i/KQ8eGuOt3ui52hEmmKlu1KBVBxiM
 * ```
 */
export class Argon extends Hash {
  /**
   * Lazily loaded argon2 binding. Since it is a peer dependency
   * we cannot import it at top level
   */
  #binding?: typeof argon2

  /**
   * Config with defaults merged
   */
  #config: Required<ArgonConfig>

  /**
   * Formatter to serialize and deserialize phc string
   */
  #phcFormatter = new PhcFormatter<{ t: number; m: number; p: number }>()

  /**
   * Supported variants
   */
  #variants: { [K in ArgonVariants]: 0 | 1 | 2 } = {
    i: 0,
    d: 1,
    id: 2,
  }

  /**
   * A list of supported argon ids
   */
  #ids = ['argon2d', 'argon2i', 'argon2id']

  constructor(config: ArgonConfig) {
    super()

    this.#config = {
      version: 0x13,
      variant: 'id',
      iterations: 3,
      memory: 65536,
      parallelism: 4,
      saltSize: 16,
      hashLength: 32,
      ...config,
    }

    this.#validateConfig()
  }

  /**
   * Dynamically importing underlying binding
   */
  async #importBinding() {
    if (this.#binding) {
      return this.#binding
    }

    this.#binding = await import('argon2')
    return this.#binding
  }

  /**
   * Validate configuration options
   */
  #validateConfig() {
    RangeValidator.validate('iterations', this.#config.iterations, [2, MAX_UINT32])
    RangeValidator.validate('parallelism', this.#config.parallelism, [1, MAX_UINT24])
    RangeValidator.validate('memory', this.#config.memory, [
      8 * this.#config.parallelism,
      MAX_UINT32,
    ])

    EnumValidator.validate('variant', this.#config.variant, Object.keys(this.#variants))
    RangeValidator.validate('saltSize', this.#config.saltSize, [8, 1024])
    RangeValidator.validate('hashLength', this.#config.hashLength, [4, MAX_UINT32])
    EnumValidator.validate('version', this.#config.version, [0x10, 0x13])

    Object.freeze(this.#config)
  }

  /**
   * Validate phc hash string
   */
  #validatePhcString(phcString: string) {
    const phcNode = this.#phcFormatter.deserialize(phcString)

    /**
     * Old argon strings without version
     */
    if (!phcNode.version) {
      phcNode.version = 0x10
    }

    /**
     * Validate top level properties to exist
     */
    if (!phcNode.params) {
      throw new TypeError(`No "params" found in the phc string`)
    }
    if (!phcNode.salt) {
      throw new TypeError(`No "salt" found in the phc string`)
    }
    if (!phcNode.hash) {
      throw new TypeError(`No "hash" found in the phc string`)
    }
    RangeValidator.validate('salt.byteLength', phcNode.salt.byteLength, [8, 1024])
    RangeValidator.validate('hash.byteLength', phcNode.hash.byteLength, [4, MAX_UINT32])

    /**
     * Validate id
     */
    EnumValidator.validate('id', phcNode.id, this.#ids)

    /**
     * Validate variant and extract it
     */
    const variant = phcNode.id.split('argon2')[1] as ArgonVariants
    EnumValidator.validate('variant', variant, Object.keys(this.#variants))

    /**
     * Validate rest of the properties
     */
    EnumValidator.validate('version', phcNode.version, [0x10, 0x13])
    RangeValidator.validate('t', phcNode.params.t, [1, MAX_UINT32])
    RangeValidator.validate('p', phcNode.params.p, [1, MAX_UINT24])
    RangeValidator.validate('m', phcNode.params.m, [8 * phcNode.params.p, MAX_UINT32])

    return {
      id: phcNode.id,
      version: phcNode.version!,
      hash: phcNode.hash,
      salt: phcNode.salt,
      params: {
        t: phcNode.params.t,
        m: phcNode.params.m,
        p: phcNode.params.p,
      },
      variant: variant,
    }
  }

  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash.
   *
   * ```ts
   * argon.isValidHash('hello world') // false
   * argon.isValidHash('$argon2id$v=19$t=3,m=4096,p=1$drxJBWzWahR5tMubp+a1Sw$L/Oh2uw6QKW77i/KQ8eGuOt3ui52hEmmKlu1KBVBxiM')
   * ```
   */
  isValidHash(value: string): boolean {
    try {
      this.#validatePhcString(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Hash a plain text value
   *
   * ```ts
   * const hash = await argon.make('password')
   * ```
   */
  async make(value: string) {
    const driver = await this.#importBinding()
    const salt = await randomBytesAsync(this.#config.saltSize)

    /**
     * Generate hash
     */
    const hash = await driver.hash(value, {
      salt,
      version: this.#config.version,
      type: this.#variants[this.#config.variant],
      timeCost: this.#config.iterations,
      memoryCost: this.#config.memory,
      parallelism: this.#config.parallelism,
      hashLength: this.#config.hashLength,
      raw: true,
    })

    /**
     * Serialize hash
     */
    return this.#phcFormatter.serialize(salt, hash, {
      id: `argon2${this.#config.variant}`,
      version: this.#config.version,
      params: {
        t: this.#config.iterations,
        m: this.#config.memory,
        p: this.#config.parallelism,
      },
    })
  }

  /**
   * Verify the plain text value against an existing hash
   *
   * ```ts
   * if (await argon.verify(hash, plainText)) {
   *
   * }
   * ```
   */
  async verify(hashedValue: string, plainValue: string): Promise<boolean> {
    const driver = await this.#importBinding()

    try {
      /**
       * De-serialize hash and ensure all Phc string properties
       * to exist.
       */
      const phcNode = this.#validatePhcString(hashedValue)

      /**
       * Generate a new hash with the same properties
       * as the existing hash
       */
      const newHash = await driver.hash(plainValue, {
        salt: phcNode.salt,
        version: phcNode.version,
        type: this.#variants[phcNode.variant],
        timeCost: phcNode.params.t,
        memoryCost: phcNode.params.m,
        parallelism: phcNode.params.p,
        hashLength: phcNode.hash.byteLength,
        raw: true,
      })

      /**
       * Ensure both are equal
       */
      return safeEqual(newHash, phcNode.hash)
    } catch {
      return false
    }
  }

  /**
   * Find if the hash value needs a rehash or not. The rehash is
   * required when.
   *
   * 1. The argon2 version is changed
   * 2. Number of iterations are changed
   * 3. The memory value is changed
   * 4. The parellelism value is changed
   * 5. The argon variant is changed
   *
   * ```ts
   * const isValid = await argon.verify(hash, plainText)
   *
   * // Plain password is valid and hash needs a rehash
   * if (isValid && await argon.needsReHash(hash)) {
   *   const newHash = await argon.make(plainText)
   * }
   * ```
   */
  needsReHash(value: string): boolean {
    const phcNode = this.#phcFormatter.deserialize(value)
    if (!this.#ids.includes(phcNode.id)) {
      throw new TypeError('Value is not a valid argon hash')
    }

    /**
     * If config version is separate from hash version, then a
     * re-hash is needed
     */
    if (phcNode.version !== this.#config.version) {
      return true
    }

    /**
     * If config variant is not same as the hash variant, then a
     * re-hash is needed
     */
    if (phcNode.id !== `argon2${this.#config.variant}`) {
      return true
    }

    /**
     * Make sure all the encoded params are same as the config.
     * Otherwise a re-hash is needed
     */
    if (!phcNode.params) {
      return true
    }
    if (phcNode.params.m !== this.#config.memory) {
      return true
    }
    if (phcNode.params.t !== this.#config.iterations) {
      return true
    }
    if (phcNode.params.p !== this.#config.parallelism) {
      return true
    }

    return false
  }
}
