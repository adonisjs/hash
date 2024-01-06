/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RuntimeException } from '@poppinss/utils'

import debug from './debug.js'
import { Hash } from './hash.js'
import { Fake } from './drivers/fake.js'
import type { HashDriverContract, ManagerDriverFactory } from './types.js'

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
   * Hash manager config with the list of hashers in
   * use
   */
  #config: {
    default?: keyof KnownHashers
    list: KnownHashers
  }

  /**
   * Fake hasher
   */
  #fakeHasher?: Hash

  /**
   * Cache of hashers
   */
  #hashersCache: Partial<Record<keyof KnownHashers, Hash>> = {}

  constructor(config: { default?: keyof KnownHashers; list: KnownHashers }) {
    this.#config = config
    debug('creating hash manager. config: %O', this.#config)
  }

  /**
   * Use one of the registered hashers to hash values.
   *
   * ```ts
   * manager.use() // returns default hasher
   * manager.use('argon')
   * ```
   */
  use<Hasher extends keyof KnownHashers>(hasher?: Hasher): Hash {
    let hasherToUse: keyof KnownHashers | undefined = hasher || this.#config.default
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

    const driverFactory = this.#config.list[hasherToUse]

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
   * Fake hash drivers to disable hashing values
   */
  fake(): void {
    debug('enabling fakes')

    if (!this.#fakeHasher) {
      this.#fakeHasher = new Hash(new Fake())
    }
  }

  /**
   * Restore fake
   */
  restore() {
    debug('restoring fakes')
    this.#fakeHasher = undefined
  }

  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash
   */
  isValidHash(value: string): boolean {
    return this.use().isValidHash(value)
  }

  /**
   * Hash plain text value
   */
  make(value: string): Promise<string> {
    return this.use().make(value)
  }

  /**
   * Verify the plain text value against an existing hash
   */
  verify(hashedValue: string, plainValue: string): Promise<boolean> {
    return this.use().verify(hashedValue, plainValue)
  }

  /**
   * Find if the hash value needs a rehash or not.
   */
  needsReHash(hashedValue: string): boolean {
    return this.use().needsReHash(hashedValue)
  }

  /**
   * Assert the plain value passes the hash verification
   */
  async assertEquals(hashedValue: string, plainValue: string): Promise<void> {
    return this.use().assertEquals(hashedValue, plainValue)
  }

  /**
   * Assert the plain value fails the hash verification
   */
  async assertNotEquals(hashedValue: string, plainValue: string): Promise<void> {
    return this.use().assertNotEquals(hashedValue, plainValue)
  }
}
