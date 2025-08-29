/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// @ts-expect-error
import phc from '@phc/format'
import { type PhcNode } from './types.ts'

/**
 * Phc formatter is used to serialize a hash to a phc string and
 * deserialize it back to a PHC object.
 */
export class PhcFormatter<
  Params extends Record<string, string | number> = Record<string, string | number>,
> {
  /**
   * Serialize salt and hash with predefined options into a PHC string
   *
   * @param salt - The salt buffer
   * @param hash - The hash buffer
   * @param options - Serialization options including id, params, and version
   * @return The serialized PHC string
   */
  /**
   * Serialize salt and hash with predefined options.
   */
  serialize(
    salt: Buffer,
    hash: Buffer,
    options: { id: string; params?: Params; version?: number | string }
  ): string {
    return phc.serialize({
      id: options.id,
      version: options.version,
      params: options.params,
      salt,
      hash,
    })
  }

  /**
   * Deserialize a PHC string to an object
   *
   * @param phcString - The PHC string to deserialize
   * @return The deserialized PHC node object
   */
  deserialize(phcString: string): PhcNode<Params> {
    return phc.deserialize(phcString)
  }
}
