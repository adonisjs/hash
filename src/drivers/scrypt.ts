/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { safeEqual } from '@poppinss/utils'

import { PhcFormatter } from '../phc_formatter.js'
import type { ScryptConfig, HashDriverContract } from '../types.js'
import { randomBytesAsync, RangeValidator, scryptAsync, MAX_UINT32 } from '../helpers.js'

/**
 * Hash driver built on top of "scrypt" hash algorigthm. Under the hood
 * we make use of the Node.js crypto module
 *
 * The Scrypt implementation uses the PHC formatting for creating
 * and verifying hashes.
 *
 * ```ts
 * const scrypt = new Scrypt({})
 *
 * await scrypt.make('secret')
 * // $scrypt$n=16384,r=8,p=1$iILKD1gVSx6bqualYqyLBQ$DNzIISdmTQS6sFdQ1tJ3UCZ7Uun4uGHNjj0x8FHOqB0pf2LYsu9Xaj5MFhHg21qBz8l5q/oxpeV+ZkgTAj+OzQ
 * ```
 */
export class Scrypt implements HashDriverContract {
  /**
   * Config with defaults merged
   */
  #config: Required<ScryptConfig>

  /**
   * Formatter to serialize and deserialize phc string
   */
  #phcFormatter = new PhcFormatter<{
    n: number
    r: number
    p: number
  }>()

  constructor(config: ScryptConfig) {
    this.#config = {
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      keyLength: 64,
      maxMemory: 32 * 1024 * 1024,
      ...config,
    }

    this.#validateConfig()
  }

  /**
   * Validate config
   */
  #validateConfig() {
    RangeValidator.validate('blockSize', this.#config.blockSize, [1, MAX_UINT32])
    RangeValidator.validate('cost', this.#config.cost, [2, MAX_UINT32])
    RangeValidator.validate('parallelization', this.#config.parallelization, [
      1,
      Math.floor(((Math.pow(2, 32) - 1) * 32) / (128 * this.#config.blockSize)),
    ])

    RangeValidator.validate('saltSize', this.#config.saltSize, [8, 1024])
    RangeValidator.validate('keyLength', this.#config.keyLength, [64, 128])
    RangeValidator.validate('maxMemory', this.#config.maxMemory, [
      128 * this.#config.cost * this.#config.blockSize + 1,
      MAX_UINT32,
    ])

    Object.freeze(this.#config)
  }

  /**
   * Validate phc hash string
   */
  #validatePhcString(phcString: string) {
    const phcNode = this.#phcFormatter.deserialize(phcString)

    /**
     * Validate top level properties to exist
     */
    if (phcNode.id !== 'scrypt') {
      throw new TypeError(`Invalid "id" found in the phc string`)
    }
    if (!phcNode.params) {
      throw new TypeError(`No "params" found in the phc string`)
    }
    if (!phcNode.salt) {
      throw new TypeError(`No "salt" found in the phc string`)
    }
    if (!phcNode.hash) {
      throw new TypeError(`No "hash" found in the phc string`)
    }
    RangeValidator.validate('hash.byteLength', phcNode.hash.byteLength, [64, 128])
    RangeValidator.validate('salt.byteLength', phcNode.salt.byteLength, [8, 1024])

    /**
     * blockSize
     */
    RangeValidator.validate('r', phcNode.params.r, [1, MAX_UINT32])

    /**
     * Cost
     */
    RangeValidator.validate('n', phcNode.params.n, [1, MAX_UINT32])

    /**
     * Parallelization
     */
    RangeValidator.validate('p', phcNode.params.p, [
      1,
      Math.floor(((Math.pow(2, 32) - 1) * 32) / (128 * phcNode.params.r)),
    ])

    return {
      id: phcNode.id,
      hash: phcNode.hash,
      salt: phcNode.salt,
      params: {
        r: phcNode.params.r,
        n: phcNode.params.n,
        p: phcNode.params.p,
      },
    }
  }

  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash.
   *
   * ```ts
   * scrypt.isValidHash('hello world') // false
   * scrypt.isValidHash('$scrypt$n=16384,r=8,p=1$iILKD1gVSx6bqualYqyLBQ$DNzIISdmTQS6sFdQ1tJ3UCZ7Uun4uGHNjj0x8FHOqB0pf2LYsu9Xaj5MFhHg21qBz8l5q/oxpeV+ZkgTAj+OzQ')
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
   * const hash = await scrypt.make('password')
   * ```
   */
  async make(value: string) {
    const salt = await randomBytesAsync(this.#config.saltSize)

    /**
     * Generate hash
     */
    const hash = await scryptAsync(value, salt, this.#config.keyLength, {
      cost: this.#config.cost,
      blockSize: this.#config.blockSize,
      parallelization: this.#config.parallelization,
      maxmem: this.#config.maxMemory,
    })

    /**
     * Serialize hash
     */
    return this.#phcFormatter.serialize(salt, hash, {
      id: 'scrypt',
      params: {
        n: this.#config.cost,
        r: this.#config.blockSize,
        p: this.#config.parallelization,
      },
    })
  }

  /**
   * Verify the plain text value against an existing hash
   *
   * ```ts
   * if (await scrypt.verify(hash, plainText)) {
   *
   * }
   * ```
   */
  async verify(hashedValue: string, plainValue: string): Promise<boolean> {
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
      const newHash = await scryptAsync(plainValue, phcNode.salt, phcNode.hash.byteLength, {
        cost: phcNode.params.n,
        blockSize: phcNode.params.r,
        parallelization: phcNode.params.p,
        maxmem: this.#config.maxMemory,
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
   * 1. The cost value is changed
   * 2. The blockSize value is changed
   * 3. The parallelization value is changed
   *
   * ```ts
   * const isValid = await scrypt.verify(hash, plainText)
   *
   * // Plain password is valid and hash needs a rehash
   * if (isValid && await scrypt.needsReHash(hash)) {
   *   const newHash = await scrypt.make(plainText)
   * }
   * ```
   */
  needsReHash(value: string): boolean {
    const phcNode = this.#phcFormatter.deserialize(value)
    if (phcNode.id !== 'scrypt') {
      throw new TypeError('Value is not a valid scrypt hash')
    }

    /**
     * Make sure all the encoded params are same as the config.
     * Otherwise a re-hash is needed
     */
    if (!phcNode.params) {
      return true
    }
    if (phcNode.params.n !== this.#config.cost) {
      return true
    }
    if (phcNode.params.r !== this.#config.blockSize) {
      return true
    }
    if (phcNode.params.p !== this.#config.parallelization) {
      return true
    }

    return false
  }
}
