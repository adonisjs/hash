/*
* @poppinss/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { Manager, DriverNodesList, ExtractDriversImpl, ExtractDefaultDriverImpl } from '@poppinss/manager'
import { HashConfigContract, HashDrivers, HashDriverContract } from './contracts'
import { Bcrypt } from './Drivers/Bcrypt'

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
> {
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
    return new Bcrypt(this.config.argon!)
  }

  public hash (value: string): ReturnType<DefaultDriver['hash']> {
    return this.driver().hash(value) as ReturnType<DefaultDriver['hash']>
  }

  public verify (hashedValue: string, plainValue: string): ReturnType<DefaultDriver['verify']> {
    return this.driver().verify(hashedValue, plainValue) as ReturnType<DefaultDriver['verify']>
  }
}

const config = {
  driver: 'bcrypt' as 'bcrypt',
  argon: {
    memory: 1,
    parallelism: 1,
    variant: 'id' as 'id',
    saltSize: 16,
    iterations: 2,
  },
}

const hash = new Hash({}, config)
