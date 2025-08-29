/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HashDriverContract } from '../types.ts'

/**
 * The fake implementation does not generate any hash and
 * performs verification using the plain text equality
 * check.
 *
 * The fake driver is useful for testing.
 */
export class Fake implements HashDriverContract {
  /**
   * Always returns true for any hash format check
   *
   * @param _ - The value to check (unused)
   * @return Always returns true
   */
  /**
   * Always returns true
   */
  isValidHash(_: string): boolean {
    return true
  }

  /**
   * Returns the value as it is without any actual hashing
   *
   * @param value - The plain text value
   * @return The same value without hashing
   */
  async make(value: string) {
    return value
  }

  /**
   * Checks the hash and the plain text value using
   * simple string equality check
   *
   * @param hashedValue - The "hashed" value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise resolving to true if values are equal
   */
  async verify(hashedValue: string, plainValue: string): Promise<boolean> {
    return hashedValue === plainValue
  }

  /**
   * Always returns false as fake hashes never need rehashing
   *
   * @param _ - The hash value (unused)
   * @return Always returns false
   */
  needsReHash(_: string): boolean {
    return false
  }
}
