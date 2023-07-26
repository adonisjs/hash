/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HashManager, Scrypt } from '../index.js'
import { ManagerDriverFactory } from '../src/types.js'

type Config<KnownHashers extends Record<string, ManagerDriverFactory>> = {
  default?: keyof KnownHashers
  list: KnownHashers
}

/**
 * Hash manager factory is used to create an instance of hash manager
 * for testing
 */
export class HashManagerFactory<
  KnownHashers extends Record<string, ManagerDriverFactory> = {
    scrypt: () => Scrypt
  },
> {
  /**
   * Config accepted by hash manager
   */
  readonly #config: Config<KnownHashers>

  constructor(config?: { default?: keyof KnownHashers; list: KnownHashers }) {
    this.#config =
      config ||
      ({
        default: 'scrypt',
        list: {
          scrypt: () => new Scrypt({}),
        },
      } as unknown as Config<KnownHashers>)
  }

  /**
   * Merge factory parameters
   */
  merge<Hashers extends Record<string, ManagerDriverFactory>>(
    config: Config<Hashers>
  ): HashManagerFactory<Hashers> {
    return new HashManagerFactory(config)
  }

  /**
   * Create hash manager instance
   */
  create() {
    return new HashManager<KnownHashers>(this.#config)
  }
}
