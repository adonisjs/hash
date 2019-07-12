/*
* @poppinss/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BcryptConfigContract, BcryptContract } from '../contracts'
import * as bcrypt from '@phc/bcrypt'
import * as phc from '@phc/format'

/**
 * Generates and verifies hash using Bcrypt as underlying
 * algorigthm.
 */
export class Bcrypt implements BcryptContract {
  public ids: BcryptContract['ids'] = ['bcrypt']
  public params: BcryptContract['params'] = { rounds: 'r' }
  public version = 98

  constructor (private _config: BcryptConfigContract) {
  }

  /**
   * Returns hash for a given value
   */
  public hash (value: string): Promise<string> {
    return bcrypt.hash(value, this._config)
  }

  /**
   * Verify hash to know if two values are same.
   */
  public verify (hashedValue: string, plainValue: string): Promise<boolean> {
    return bcrypt.verify(hashedValue, plainValue)
  }

  /**
   * Returns a boolean telling if hash needs a rehash. Returns true when
   * one of the original params have been changed.
   */
  public needsReHash (value: string): boolean {
    const deserialized = phc.deserialize(value)
    if (deserialized.id !== 'bcrypt') {
      throw new Error('value is not a bcrypt hash')
    }

    if (this.version !== deserialized.version) {
      return true
    }

    return !!Object.keys(this.params).find((key) => {
      return deserialized.params[this.params[key]] !== this._config![key]
    })
  }
}
