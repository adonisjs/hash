/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HashDriverContract } from './types.js'

/**
 * Hash and verify values using a dedicated hash driver. The
 * abstract implementation must be extended by the
 * implementation drivers
 */
export abstract class Hash implements HashDriverContract {
  constructor() {}

  /**
   * Check if the value is a valid hash. This method just checks
   * for the formatting of the hash.
   */
  abstract isValidHash(value: string): boolean

  /**
   * Hash a plain text value
   *
   * ```ts
   * const hashedValue = await hash.make('password')
   * ```
   */
  abstract make(value: string): Promise<string>

  /**
   * Verify the plain text value against an existing hash
   *
   * ```ts
   * if (await hash.verify(hashedValues, plainText)) {
   *
   * }
   * ```
   */
  abstract verify(hashedValue: string, plainValue: string): Promise<boolean>

  /**
   * Find if the hash value needs a rehash or not. The rehash is
   * required when.
   *
   * ```ts
   * const isValid = await hash.verify(hashedValue, plainText)
   *
   * // Plain password is valid and hash needs a rehash
   * if (isValid && await needs.needsReHash(hashedValue)) {
   *   const newHashedValue = await hash.make(plainText)
   * }
   * ```
   */
  abstract needsReHash(hashedValue: string): boolean
}
