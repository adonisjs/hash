/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RuntimeException } from '@poppinss/utils'
import type { ManagerDriversConfig, HashManagerConfig } from './types.js'

/**
 * Define configuration for the hash manager
 */
export function defineConfig<KnownHashers extends Record<string, ManagerDriversConfig>>(
  config: HashManagerConfig<KnownHashers>
): HashManagerConfig<KnownHashers> {
  /**
   * List should always be provided
   */
  if (!config.list) {
    throw new RuntimeException('Missing "list" property in hash config')
  }

  /**
   * Default property should be provided when list
   * has one or more items
   */
  if (Object.keys(config.list).length && !config.default) {
    throw new RuntimeException(
      'Missing "default" property in hash config. Specify a default hasher'
    )
  }

  /**
   * The default hasher should be mentioned in the list
   */
  if (config.default && !config.list[config.default]) {
    throw new RuntimeException(
      `Missing "list.${String(config.default)}". It is referenced by the "default" property`
    )
  }

  return config
}
