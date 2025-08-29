/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { AssertionError } from 'node:assert'
import type { HashDriverContract } from './types.ts'

/**
 * Hash and verify values using a dedicated hash driver. The Hash
 * works as an adapter across different drivers.
 *
 * ```ts
 * const hash = new Hash(new Argon())
 * const hashedPassword = await hash.make('secret')
 *
 * const isValid = await hash.verify(hashedPassword, 'secret')
 * console.log(isValid)
 * ```
 */
export class Hash implements HashDriverContract {
  /**
   * The underlying hash driver implementation
   */
  #driver: HashDriverContract
  /**
   * Create a new Hash instance with the specified driver
   *
   * @param driver - The hash driver implementation to use
   */
  constructor(driver: HashDriverContract) {
    this.#driver = driver
  }

  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash
   *
   * @param value - The value to check
   * @return True if the value is a valid hash format
   */
  isValidHash(value: string): boolean {
    return this.#driver.isValidHash(value)
  }

  /**
   * Hash plain text value
   *
   * @param value - The plain text value to hash
   * @return Promise resolving to the hashed value
   */
  make(value: string): Promise<string> {
    return this.#driver.make(value)
  }

  /**
   * Verify the plain text value against an existing hash
   *
   * @param hashedValue - The hashed value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise resolving to true if verification succeeds
   */
  verify(hashedValue: string, plainValue: string): Promise<boolean> {
    return this.#driver.verify(hashedValue, plainValue)
  }

  /**
   * Find if the hash value needs a rehash or not.
   *
   * @param hashedValue - The hashed value to check
   * @return True if the hash needs to be rehashed
   */
  needsReHash(hashedValue: string): boolean {
    return this.#driver.needsReHash(hashedValue)
  }

  /**
   * Assert the plain value passes the hash verification
   *
   * @param hashedValue - The hashed value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise that resolves if verification passes, throws if it fails
   */
  async assertEquals(hashedValue: string, plainValue: string): Promise<void> {
    const isEqual = await this.#driver.verify(hashedValue, plainValue)
    if (!isEqual) {
      throw new AssertionError({
        message: `Expected "${plainValue}" to pass hash verification`,
        expected: true,
        actual: false,
        operator: 'strictEqual',
        stackStartFn: this.assertEquals,
      })
    }
  }

  /**
   * Assert the plain value fails the hash verification
   *
   * @param hashedValue - The hashed value to verify against
   * @param plainValue - The plain text value to verify
   * @return Promise that resolves if verification fails, throws if it passes
   */
  async assertNotEquals(hashedValue: string, plainValue: string): Promise<void> {
    const isEqual = await this.#driver.verify(hashedValue, plainValue)
    if (isEqual) {
      throw new AssertionError({
        message: `Expected "${plainValue}" to fail hash verification`,
        expected: false,
        actual: true,
        operator: 'strictEqual',
        stackStartFn: this.assertNotEquals,
      })
    }
  }
}
