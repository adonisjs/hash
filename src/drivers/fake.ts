/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Hash } from '../hash.js'

/**
 * The fake implementation does not generate any hash and
 * performs verification using the plain text equality
 * check.
 *
 * The fake driver is useful for testing.
 */
export class Fake extends Hash {
  /**
   * Always returns true
   */
  isValidHash(_: string): boolean {
    return true
  }

  /**
   * Returns the value as it is
   */
  async make(value: string) {
    return value
  }

  /**
   * Checks the hash and the plain text value using
   * equality check
   */
  async verify(hashedValue: string, plainValue: string): Promise<boolean> {
    return hashedValue === plainValue
  }

  /**
   * Always returns false
   */
  needsReHash(_: string): boolean {
    return false
  }
}
