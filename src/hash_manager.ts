/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Hash } from './hash.js'
import { Argon } from './drivers/argon.js'
import { Bcrypt } from './drivers/bcrypt.js'
import { Scrypt } from './drivers/scrypt.js'

import type {
  HashDriverContract,
  HashManagerConfig,
  HashManagerDrivers,
  ManagerDriverFactory,
  ManagerDriversConfig,
} from './types.js'

import debug from './debug.js'
import { Fake } from './drivers/fake.js'
import { RuntimeException } from '@poppinss/utils'

/**
 * HashManager implements the manager/builder pattern to create a use multiple
 * hashing algorithm without self managing hash instance.
 *
 * ```ts
 * const manager = new HashManager({
 *   default: 'argon',
 *   list: {
 *     argon: {
 *       driver: 'argon2',
 *     },
 *     bcrypt: {
 *       driver: 'bcrypt',
 *     }
 *   }
 * })
 * ```
 */
export class HashManager<KnownHashers extends Record<string, ManagerDriversConfig>>
  implements HashDriverContract
{
  /**
   * Hash manager config with the list of hashers in
   * use
   */
  #config: HashManagerConfig<KnownHashers>

  /**
   * Fake hasher
   */
  #fakeHasher?: Hash

  /**
   * Cache of hashers
   */
  #hashersCache: Partial<Record<keyof HashManagerDrivers, Hash>> = {}

  /**
   * Drivers implementations. Cannot be async, since the "use"
   * method is not async
   */
  #drivers: { [Driver in keyof HashManagerDrivers]?: ManagerDriverFactory<Driver> } = {
    bcrypt: (config) => new Bcrypt(config),
    argon2: (config) => new Argon(config),
    scrypt: (config) => new Scrypt(config),
  }

  constructor(config: HashManagerConfig<KnownHashers>) {
    this.#config = config
    debug('creating hash manager. config: %O', this.#config)
  }

  /**
   * Creates an instance of a hash driver
   */
  #createDriver<Driver extends keyof HashManagerDrivers>(
    name: Driver,
    config: { driver: Driver } & HashManagerDrivers[Driver]['config']
  ): HashManagerDrivers[Driver]['implementation'] {
    /**
     * Ensure the driver exists
     */
    const driver = this.#drivers[name]
    if (!driver) {
      throw new Error(
        `Unknown hash driver "${name}". Make sure the driver is registered with HashManager`
      )
    }

    /**
     * Use cache or create an instance of the driver
     */
    return driver(config)
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

    const config = this.#config.list[hasherToUse]

    /**
     * Use cached copy if exists
     */
    const cachedHasher = this.#hashersCache[config.driver]
    if (cachedHasher) {
      debug('using hasher from cache. name: "%s"', hasherToUse)
      return cachedHasher
    }

    /**
     * Create a new instance of Hash class with the selected
     * driver and cache it
     */
    debug('creating hash driver. name: "%s", config: %O', hasherToUse, config)
    const hash = this.#createDriver(config.driver, config)
    this.#hashersCache[config.driver] = hash
    return hash
  }

  /**
   * Fake hash drivers to disable hashing values
   */
  fake(): void {
    debug('enabling fakes')

    if (!this.#fakeHasher) {
      this.#fakeHasher = new Fake()
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
   * Extend manager to add custom drivers. The driver typings must be
   * registered first (if using typescript).
   *
   * ```ts
   * manager.extend('bcrypt', (config) => {
   *   return new Bcrypt(config)
   * })
   * ```
   */
  extend<Driver extends keyof HashManagerDrivers>(
    driver: Driver,
    factory: ManagerDriverFactory<Driver>
  ) {
    /**
     * Using any because of this issue
     * https://github.com/microsoft/TypeScript/issues/13995
     */
    debug('adding custom driver %s', driver)
    this.#drivers[driver] = factory as any
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
}
