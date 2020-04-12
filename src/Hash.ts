/*
* @adonisjs/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

/// <reference path="../adonis-typings/hash.ts" />

import { Manager } from '@poppinss/manager'
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
> implements HashContract<HashDriverContract> {
  constructor (container: any, public config: Config) {
    super(container)
  }

  protected $cacheMappings = true

  /**
   * Pulling the default driver name from the user config.
   */
  protected getDefaultMappingName (): string {
    return this.config.default
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
    const { Bcrypt } = require('./Drivers/Bcrypt')
    return new Bcrypt(config)
  }

  /**
   * Creating argon driver. The manager will call this method anytime
   * someone will ask for the `argon` driver.
   */
  protected createArgon2 (_: string, config: any) {
    const { Argon } = require('./Drivers/Argon')
    return new Argon(config)
  }

  /**
   * Hash value using the default driver
   */
  public hash (value: string): never | any {
    return (this.use() as HashDriverContract).hash(value)
  }

  /**
   * Verify value using the default driver
   */
  public verify (hashedValue: string, plainValue: string) {
    return (this.use() as HashDriverContract).verify(hashedValue, plainValue)
  }

  /**
   * Find if value needs to be re-hashed as per the default driver.
   */
  public needsReHash (hashedValue: string) {
    return (this.use() as HashDriverContract).needsReHash(hashedValue)
  }
}
