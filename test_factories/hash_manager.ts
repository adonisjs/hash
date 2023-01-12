/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HashManager } from '../index.js'
import type { HashManagerConfig, ManagerDriversConfig } from '../src/types.js'

/**
 * Hash manager factory is used to create an instance of hash manager
 * for testing
 */
export class HashMangerFactory<
  KnownHashers extends Record<string, ManagerDriversConfig> = { scrypt: { driver: 'scrypt' } }
> {
  /**
   * Config accepted by hash manager
   */
  #config: HashManagerConfig<KnownHashers>

  constructor(config?: HashManagerConfig<KnownHashers>) {
    this.#config =
      config ||
      ({
        default: 'scrypt',
        list: {
          scrypt: {
            driver: 'scrypt',
          },
        },
      } as unknown as HashManagerConfig<KnownHashers>)
  }

  /**
   * Merge factory parameters
   */
  merge<Hashers extends Record<string, ManagerDriversConfig>>(options: {
    config: HashManagerConfig<Hashers>
  }): HashMangerFactory<Hashers> {
    return new HashMangerFactory(options.config)
  }

  /**
   * Create hash manager instance
   */
  create() {
    return new HashManager<KnownHashers>(this.#config)
  }
}
