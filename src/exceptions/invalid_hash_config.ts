/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@poppinss/utils'

/**
 * Exception raised when the hash config is invalid
 */
export class InvalidHashConfigException extends Exception {
  static code = 'E_INVALID_HASH_CONFIG'
  static status = 500
}
