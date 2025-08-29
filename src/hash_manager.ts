/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RuntimeException } from '@poppinss/utils/exception'

import debug from './debug.ts'
import { Hash } from './hash.ts'
import { Fake } from './drivers/fake.ts'
import type { HashDriverContract, ManagerDriverFactory } from './types.ts'

/**
 * HashManager implements the manager/builder pattern to create a use multiple
 * hashing algorithm without self managing hash instance.
 *
 * ```ts
 * const manager = new HashManager({
 *   default: 'argon',
 *   list: {
 *     argon: () => new ArgonDriver(),
 *     bcrypt: () => new BcryptDriver(),
 *   }
 * })
 * ```
 */
export class HashManager<KnownHashers extends Record<string, ManagerDriverFactory>>
  implements HashDriverContract
{
  /**
   * Fake hasher instance used for testing
   */
  /**
   * Fake hasher
   */
  #fakeHasher?: Hash

  /**
   * Cache of hasher instances to avoid recreating them
   */
  #hashersCache: Partial<Record<keyof KnownHashers, Hash>> = {}

  /**
   * Configuration object containing default hasher and list of available hashers
   */
  config: { default?: keyof KnownHashers; list: KnownHashers }

  constructor(config: { default?: keyof KnownHashers; list: KnownHashers }) {
    this.config = config
    debug('creating hash manager. config: %O', this.config)
  }

  /**
   * Use one of the registered hashers to hash values.
   *
   * ```ts
   * manager.use() // returns default hasher
   * manager.use('argon')
   * ```
   *
   * @param hasher - The name of the hasher to use, defaults to the configured default
   * @return Hash instance for the specified hasher
   */
  use<Hasher extends keyof KnownHashers>(hasher?: Hasher): Hash {
    let hasherToUse: keyof KnownHashers | undefined = hasher || this.config.default
    if (!hasherToUse) {
      throw new RuntimeException(
        'Cannot create hash instance. No default hasher is defined in the config'
      )
    }

    /**
     * Use fake hasher if exists
     */
    if (this.#fakeHasher) {
      return this.#fakeHasher
    }

    /**
     * Use cached copy if exists
     */
    const cachedHasher = this.#hashersCache[hasherToUse]
    if (cachedHasher) {
      debug('using hasher from cache. name: "%s"', hasherToUse)
      return cachedHasher
    }

    const driverFactory = this.config.list[hasherToUse]

    /**
     * Create a new instance of Hash class with the selected
     * driver and cache it
     */
    debug('creating hash driver. name: "%s"', hasherToUse)
    const hash = new Hash(driverFactory())
    this.#hashersCache[hasherToUse] = hash
    return hash
  }

  /**
   * Enable fake hash drivers to disable actual hashing for testing
   */
  fake(): void {
    debug('enabling fakes')

    if (!this.#fakeHasher) {
      this.#fakeHasher = new Hash(new Fake())
    }
  }

  /**
   * Restore normal hashing behavior by disabling fake mode
   */
  restore() {
    debug('restoring fakes')
    this.#fakeHasher = undefined
  }

  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash
   *
   * @param value - The value to check
   * @return True if the value is a valid hash format
   */
  isValidHash(value: string): boolean {
    return this.use().isValidHash(value)
  }

  /**
   * Hash plain text value using the default hasher
   *
   * @param value - The plain text value to hash
   * @return Promise resolving to the hashed value
   */
  make(value: string): Promise<string> {
    return this.use().make(value)
  }

  /**
   * Verify the plain text value against an existing hash
   *
   * @param hashedValue - The hashed value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise resolving to true if verification succeeds
   */
  verify(hashedValue: string, plainValue: string): Promise<boolean> {
    return this.use().verify(hashedValue, plainValue)
  }

  /**
   * Find if the hash value needs a rehash or not.
   *
   * @param hashedValue - The hashed value to check
   * @return True if the hash needs to be rehashed
   */
  needsReHash(hashedValue: string): boolean {
    return this.use().needsReHash(hashedValue)
  }

  /**
   * Assert the plain value passes the hash verification
   *
   * @param hashedValue - The hashed value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise that resolves if verification passes, throws if it fails
   */
  async assertEquals(hashedValue: string, plainValue: string): Promise<void> {
    return this.use().assertEquals(hashedValue, plainValue)
  }

  /**
   * Assert the plain value fails the hash verification
   *
   * @param hashedValue - The hashed value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise that resolves if verification fails, throws if it passes
   */
  async assertNotEquals(hashedValue: string, plainValue: string): Promise<void> {
    return this.use().assertNotEquals(hashedValue, plainValue)
  }
}
