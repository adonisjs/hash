/*
* @adonisjs/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

/// <reference path="../../adonis-typings/hash.ts" />

import { Manager } from '@poppinss/manager'
import { ManagerConfigValidator } from '@poppinss/utils'

import {
  HashConfig,
  HashersList,
  HashContract,
  HashDriverContract,
} from '@ioc:Adonis/Core/Hash'

/**
 * The Hash module exposes the API to hash values using an underlying
 * Hash driver.
 */
export class Hash <Config extends HashConfig> extends Manager<
  HashDriverContract,
  HashDriverContract,
  { [P in keyof HashersList]: HashersList[P]['implementation'] }
> implements HashContract {
  private fakeDriver: HashDriverContract | undefined

  /**
   * A boolean to know, if hash module is running in fake
   * mode or not
   */
  public get isFaked (): boolean {
    return !!this.fakeDriver
  }

  constructor (container: any, public config: Config) {
    super(container)
    this.validateConfig()
  }

  /**
   * Initiate faking hash calls. All methods invoked on the main hash
   * module and the underlying drivers will be faked using the
   * fake driver.
   *
   * To restore the fake. Run the `Hash.restore` method.
   */
  public fake () {
    this.fakeDriver = this.fakeDriver || this.createFake()
  }

  /**
   * Restore fake
   */
  public restore () {
    this.fakeDriver = undefined
  }

  /**
   * Validate config
   */
  private validateConfig () {
    const validator = new ManagerConfigValidator(this.config, 'hash', 'config/hash')
    validator.validateDefault('default')
    validator.validateList('list', 'default')
  }

  protected $cacheMappings = true

  /**
   * Pulling the default driver name from the user config.
   */
  protected getDefaultMappingName (): string {
    return this.config.default!
  }

  /**
   * Returns the config for a mapping
   */
  protected getMappingConfig (name: string): any {
    return this.config.list[name]
  }

  /**
   * Returns the driver name for a mapping
   */
  protected getMappingDriver (name: string): string | undefined {
    const config = this.getMappingConfig(name)
    return config ? config.driver : undefined
  }

  /**
   * Creating bcrypt driver. The manager will call this method anytime
   * someone will ask for the `bcrypt` driver.
   */
  protected createBcrypt (_: string, config: any) {
    const { Bcrypt } = require('../Drivers/Bcrypt')
    return new Bcrypt(config)
  }

  /**
   * Creating argon driver. The manager will call this method anytime
   * someone will ask for the `argon` driver.
   */
  protected createArgon2 (_: string, config: any) {
    const { Argon } = require('../Drivers/Argon')
    return new Argon(config)
  }

  /**
   * Creating fake driver. The manager will call this method anytime
   * someone will ask for the `fake` driver.
   */
  protected createFake () {
    const { Fake } = require('../Drivers/Fake')
    return new Fake()
  }

  /**
   * Alias for [[this.make]]
   */
  public hash (value: string): never | any {
    if (this.fakeDriver) {
      return this.fakeDriver.hash(value)
    }

    return (this.use() as HashDriverContract).hash(value)
  }

  /**
   * Hash value using the default driver
   */
  public make (value: string) {
    if (this.fakeDriver) {
      return this.fakeDriver.make(value)
    }

    return (this.use() as HashDriverContract).make(value)
  }

  /**
   * Verify value using the default driver
   */
  public verify (hashedValue: string, plainValue: string) {
    if (this.fakeDriver) {
      return this.fakeDriver.verify(hashedValue, plainValue)
    }

    return (this.use() as HashDriverContract).verify(hashedValue, plainValue)
  }

  /**
   * Find if value needs to be re-hashed as per the default driver.
   */
  public needsReHash (hashedValue: string) {
    if (this.fakeDriver) {
      return this.fakeDriver.needsReHash(hashedValue)
    }

    return (this.use() as HashDriverContract).needsReHash(hashedValue)
  }

  /**
   * Pull pre-configured driver instance
   */
  public use (name?: string) {
    if (this.fakeDriver) {
      return this.fakeDriver
    }

    return super.use(name as any)
  }
}
