/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="../../adonis-typings/hash.ts" />

import { PlainContract } from '@ioc:Adonis/Core/Hash'

/**
 * Generates and verifies hash using no algorigthm.
 */
export class Plain implements PlainContract {
  public ids: PlainContract['ids'] = ['plain']
  public params: { [key: string]: string }

  /**
   * Alias for [[this.make]]
   */
  public hash (value: string): Promise<string> {
    return Promise.resolve(value)
  }

  /**
   * Returns hash for a given value
   */
  public make (value: string) {
    return this.hash(value)
  }

  /**
   * Verify hash to know if two values are same.
   */
  public verify (hashedValue: string, plainValue: string): Promise<boolean> {
    return Promise.resolve(hashedValue === plainValue)
  }

  /**
   * Returns a boolean telling if hash needs a rehash. Returns true when
   * one of the original params have been changed.
   */
  public needsReHash (_value: string): boolean {
    return false
  }
}
