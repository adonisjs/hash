/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { promisify } from 'node:util'
import { randomBytes, scrypt, type ScryptOptions } from 'node:crypto'

export const MAX_UINT32 = 2 ** 32 - 1
export const MAX_UINT24 = 2 ** 24 - 1

/**
 * Validates a number to be within a given range.
 */
export class RangeValidator {
  static validate(label: string, value: unknown, range: [number, number]) {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new TypeError(`The "${label}" option must be an integer`)
    }

    const [min, max] = range

    if (value < min || value > max) {
      throw new TypeError(
        `The "${label}" option must be in the range (${min} <= ${label} <= ${max})`
      )
    }
  }
}

/**
 * Validates a value to be one of the allowed values
 */
export class EnumValidator {
  static validate(label: string, value: unknown, allowedValues: any[]) {
    if (!allowedValues.includes(value)) {
      throw new TypeError(`The "${label}" option must be one of: ${allowedValues}`)
    }
  }
}

/**
 * Async function to generate random bytes
 */
export const randomBytesAsync = promisify(randomBytes)

/**
 * Async version of scrypt.
 */
export const scryptAsync = promisify<string, Buffer, number, ScryptOptions, Buffer>(scrypt)
