/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { scrypt } from 'node:crypto'
import tsse from 'tsse'
import phc from '@phc/format'
import gensalt from '@kdf/salt'
import type { ScryptOptions } from 'node:crypto'
import type { ScryptConfig, ScryptContract } from '@ioc:Adonis/Core/Hash'

const kMaxUint24 = 16777215 // 2**24 - 1

const defaultConfig = Object.freeze({
  cost: 16384,
  blockSize: 8,
  parallelization: 1,
  saltSize: 16,
  keylen: 64,
  maxmem: 32 * 1024 * 1024,
})

function scryptAsync(
  password: string,
  salt: string,
  keylen: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (error, derivedKey) => {
      if (error) {
        reject(error)
      } else {
        resolve(derivedKey)
      }
    })
  })
}

/**
 * Hash driver built on top of scrypt hashing algorithm. The driver adheres
 * to `phc` string format.
 */
export class Scrypt implements ScryptContract {
  /**
   * A list of ids to find if hash belongs to this driver
   * or not.
   */
  public ids: ScryptContract['ids'] = ['scrypt']

  /**
   * A list of params encoded to the hash value.
   */
  public params: ScryptContract['params'] = {
    cost: 'n',
    blockSize: 'r',
    parallelization: 'p',
  }

  constructor(private readonly config: ScryptConfig) {
    // Cost Validation
    if (config.cost < 1 || config.cost % 2 !== 0) {
      throw new TypeError("The 'cost' option must be a power of 2 greater than 1")
    }

    // Parallelization validation
    if (config.parallelization < 1 || config.parallelization > kMaxUint24) {
      new TypeError(
        `The 'parallelism' option must be in the range (1 <= parallelism <= ${kMaxUint24})`
      )
    }

    // Memory Validation
    const maxmem = 128 * config.cost * config.blockSize
    if (config.maxmem > maxmem) {
      new TypeError(`The 'maxmem' option must be less than ${maxmem})`)
    }

    // Salt Size Validation
    if (config.saltSize < 16 || config.saltSize > 1024) {
      new TypeError("The 'saltSize' option must be in the range (8 <= saltSize <= 1024)")
    }

    // Key Length Validation
    if (config.keylen < 64 || config.keylen > 128) {
      new TypeError("The 'keylen' option must be in the range (64 <= keylen <= 128)")
    }

    this.config = Object.assign({}, defaultConfig, config)
  }

  /**
   * Hash a value using scrypt algorithm. The options can be used to override
   * default settings.
   */
  public async make(value: string) {
    const salt = await gensalt(this.config.saltSize)

    const derivedKey = await scryptAsync(value, salt, this.config.keylen, this.config)

    return phc.serialize({
      id: this.ids[0],
      params: {
        n: this.config.cost,
        r: this.config.blockSize,
        p: this.config.parallelization,
      },
      salt,
      hash: derivedKey,
    })
  }

  /**
   * Verifies the hash against a plain value to find if it's
   * a valid hash or not. The hash must be a valid `phc` string
   */
  public async verify(hashedValue: string, plainValue: string): Promise<boolean> {
    const deserializedHash = phc.deserialize(hashedValue)

    // Identifier Validation
    if (!this.ids.includes(deserializedHash.id)) {
      return Promise.reject(
        new TypeError(`Incompatible ${deserializedHash.id} identifier found in the hash`)
      )
    }

    // Parameters Existence Validation
    if (typeof deserializedHash.params !== 'object') {
      return Promise.reject(new TypeError('The param section cannot be empty'))
    }

    // Cost Validation
    if (
      typeof deserializedHash.params.n !== 'number' ||
      !Number.isInteger(deserializedHash.params.n)
    ) {
      return Promise.reject(new TypeError("The 'n' param must be an integer"))
    }

    // Block size Validation
    if (
      typeof deserializedHash.params.r !== 'number' ||
      !Number.isInteger(deserializedHash.params.r)
    ) {
      return Promise.reject(new TypeError("The 'r' param must be an integer"))
    }

    // Parallelization Validation
    if (
      typeof deserializedHash.params.p !== 'number' ||
      !Number.isInteger(deserializedHash.params.p)
    ) {
      return Promise.reject(new TypeError("The 'p' param must be an integer"))
    }

    // Salt Validation
    if (typeof deserializedHash.salt === 'undefined') {
      return Promise.reject(new TypeError('No salt found in the given string'))
    }

    // Hash Validation
    if (typeof deserializedHash.hash === 'undefined') {
      return Promise.reject(new TypeError('No hash found in the given string'))
    }

    const derivedKey = await scryptAsync(
      plainValue,
      deserializedHash.salt,
      deserializedHash.hash.length,
      {
        maxmem: this.config.maxmem,
        cost: deserializedHash.params.n,
        blockSize: deserializedHash.params.r,
        parallelization: deserializedHash.params.p,
      }
    )

    return tsse(deserializedHash.hash.toString('hex'), derivedKey.toString('hex'))
  }

  /**
   * Returns a boolean telling if hash needs a rehash. Returns true when
   * one of the original params have been changed.
   */
  public needsReHash(hashedValue: string): boolean {
    let deserializedHash: phc.ParsedHash

    try {
      deserializedHash = phc.deserialize(hashedValue)
    } catch (error) {
      return true
    }

    if (!this.ids.includes(deserializedHash.id)) {
      throw new Error('value is not a scrypt hash')
    }

    return Object.keys(this.params).some((key) => {
      return deserializedHash.params[this.params[key]] !== this.config![key]
    })
  }
}
