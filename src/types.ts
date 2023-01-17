/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The contract Hash drivers should adhere to
 */
export interface HashDriverContract {
  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash
   */
  isValidHash(value: string): boolean

  /**
   * Hash plain text value
   */
  make(value: string): Promise<string>

  /**
   * Verify the plain text value against an existing hash
   */
  verify(hashedValue: string, plainValue: string): Promise<boolean>

  /**
   * Find if the hash value needs a rehash or not.
   */
  needsReHash(hashedValue: string): boolean
}

/**
 * Shape of deserialized phc node
 */
export type PhcNode<
  Params extends Record<string, string | number> = Record<string, string | number>
> = {
  id: string
  salt: Buffer
  hash: Buffer
  version?: number
  params?: Params
}

/**
 * Available argon variants
 */
export type ArgonVariants = 'd' | 'i' | 'id'

/**
 * Shape of argon2 config
 */
export type ArgonConfig = {
  /**
   * The argon hash type to use.
   * https://github.com/ranisalt/node-argon2/wiki/Options#type
   *
   * Default is id
   */
  variant?: ArgonVariants

  /**
   * The argon2 version to use. The latest version is better.
   *
   * Default is 19
   */
  version?: 0x10 | 0x13

  /**
   * Iterations increases hash strength at the cost of time
   * required to compute.
   * https://github.com/ranisalt/node-argon2/wiki/Options#timecost
   *
   * Default is 3
   */
  iterations?: number

  /**
   * The amount of memory to be used by the hash function, in KiB
   * https://github.com/ranisalt/node-argon2/wiki/Options#memorycost.
   *
   * Default is 65536
   */
  memory?: number

  /**
   * The amount of threads to compute the hash on
   * https://github.com/ranisalt/node-argon2/wiki/Options#parallelism.
   *
   * Default is 4
   */
  parallelism?: number

  /**
   * The size (in bytes) for the auto generated hash salt.
   *
   * Default is 16
   */
  saltSize?: number

  /**
   * Maximum length for the raw hash in bytes. The serialized output will always
   * be longer than the raw hash.
   *
   * Default is 32
   */
  hashLength?: number
}

/**
 * Shape of bcrypt config
 */
export type BcryptConfig = {
  /**
   * The cost of processing the data
   * https://www.npmjs.com/package/bcrypt#a-note-on-rounds
   *
   * Default is 10
   */
  rounds?: number

  /**
   * The size (in bytes) for the auto generated hash salt.
   *
   * Default is 16
   */
  saltSize?: number

  /**
   * The bcrypt version to use. The latest version is better
   *
   * Default is 98
   */
  version?: 0x61 | 0x62
}

/**
 * Shape of scrypt config
 */
export type ScryptConfig = {
  /**
   * CPU/memory cost parameter. Must be a power of two greater than one.
   *
   * Default is 16384
   */
  cost?: number

  /**
   * Block size parameter.
   *
   * Default is 8
   */
  blockSize?: number

  /**
   * Parallelization parameter.
   *
   * Default is 1
   */
  parallelization?: number

  /**
   * Size of the salt.
   *
   * Default is 16
   */
  saltSize?: number

  /**
   * Memory upper bound.
   *
   * Default is 33554432
   */
  maxMemory?: number

  /**
   * Desired key length in bytes.
   *
   * Default is 64
   */
  keyLength?: number
}

/**
 * Factory function to return the driver implementation. The method
 * cannot be async, because the API that calls this method is not
 * async in first place.
 */
export type ManagerDriverFactory = () => HashDriverContract
