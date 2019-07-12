/*
* @poppinss/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { Manager, DriverNodesList, ExtractDriversImpl, ExtractDefaultDriverImpl } from '@poppinss/manager'
import { HashConfigContract, HashDrivers, HashDriverContract, HashContract } from './contracts'
import { Bcrypt } from './Drivers/Bcrypt'
import { Argon } from './Drivers/Argon'

/**
 * The Hash module exposes the API to hash values using an underlying
 * Hash driver.
 */
export class Hash<
  Drivers extends DriverNodesList<HashDriverContract, any> = HashDrivers,
  Config extends HashConfigContract<Drivers> = HashConfigContract<Drivers>,
  DefaultDriver extends ExtractDefaultDriverImpl<Drivers, Config> = ExtractDefaultDriverImpl<Drivers, Config>
> extends Manager<
  HashDriverContract,
  ExtractDriversImpl<Drivers>,
  DefaultDriver
> implements HashContract<Drivers> {
  constructor (container, public config: Config) {
    super(container)
  }

  protected $cacheDrivers = true

  /**
   * Pulling the default driver name from the user config.
   */
  protected getDefaultDriverName (): HashConfigContract<Drivers>['driver'] {
    return this.config.driver
  }

  /**
   * Creating bcrypt driver. The manager will call this method anytime
   * someone will ask for the `bcrypt` driver.
   */
  protected createBcrypt () {
    return new Bcrypt(this.config.bcrypt!)
  }

  /**
   * Creating argon driver. The manager will call this method anytime
   * someone will ask for the `argon` driver.
   */
  protected createArgon () {
    return new Argon(this.config.argon!)
  }

  /**
   * Hash value using the default driver
   */
  public hash (value: string): ReturnType<DefaultDriver['hash']> {
    return this.driver().hash(value) as ReturnType<DefaultDriver['hash']>
  }

  /**
   * Verify value using the default driver
   */
  public verify (hashedValue: string, plainValue: string): ReturnType<DefaultDriver['verify']> {
    return this.driver().verify(hashedValue, plainValue) as ReturnType<DefaultDriver['verify']>
  }

  /**
   * Find if value needs to be re-hashed as per the default driver.
   */
  public needsReHash (hashedValue: string): ReturnType<DefaultDriver['needsReHash']> {
    return this.driver().needsReHash(hashedValue) as ReturnType<DefaultDriver['needsReHash']>
  }
}
