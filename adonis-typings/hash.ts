/*
* @adonisjs/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

declare module '@ioc:Adonis/Core/Hash' {
  import { ManagerContract } from '@poppinss/manager'

  /**
   * Every driver must implement the Hash driver
   * contract
   */
  export interface HashDriverContract {
    ids: string[]
    params: {
      [key: string]: string,
    }

    /**
     * Hash plain text value using the default mapping
     */
    hash (value: string): Promise<string>

    /**
     * Check the hash against the current config to find it needs
     * to be re-hashed or not
     */
    needsReHash (hashedValue: string): boolean

    /**
     * Verify plain value against the hashed value to find if it's
     * valid or not
     */
    verify (hashedValue: string, plainValue: string): Promise<boolean>
  }

  /**
   * Shape of bcrypt config
   */
  export type BcryptConfigContract = {
    driver: 'bcrypt',
    rounds: number,
  }

  /**
   * Bcrypt driver contract
   */
  export interface BcryptContract extends HashDriverContract {
    ids: ['bcrypt']
    params: {
      rounds: 'r',
    }
  }

  /**
   * Shape of argon2 config
   */
  export type ArgonConfigContract = {
    driver: 'argon2',
    variant: 'd' | 'i' | 'id',
    iterations: number,
    memory: number,
    parallelism: number,
    saltSize: number,
  }

  /**
   * Argon2 driver contract
   */
  export interface ArgonContract extends HashDriverContract {
    ids: ['argon2d', 'argon2i', 'argon2id']
    params: {
      iterations: 't',
      memory: 'm',
      parallelism: 'p',
    }
  }

  /**
   * Default list of available drivers. One can you reference this type
   * to setup the `HashersList`.
   */
  export type HashDrivers = {
    bcrypt: {
      config: BcryptConfigContract,
      implementation: BcryptContract,
    },
    argon: {
      config: ArgonConfigContract,
      implementation: ArgonContract,
    },
  }

  /**
   * List of hash mappings used by the app. Using declaration merging, one
   * must extend this interface.
   *
   * MUST BE SET IN THE USER LAND.
   */
  export interface HashersList {
  }

  /**
   * Shape of config accepted by the Hash module.
   */
  export interface HashConfigContract {
    default: keyof HashersList,
    list: { [P in keyof HashersList]: HashersList[P]['config'] },
  }

  /**
   * Piggy back on the driver method when driver exists, otherwise fallback to `never`
   */
  export type DriverMethod<T, K extends keyof HashDriverContract> = T extends HashDriverContract
    ? HashDriverContract[K]
    : never

  /**
   * Hash mananger interface
   */
  export interface HashContract<
    DefaultDriver = HashersList[HashConfigContract['default']]['implementation']
  > extends ManagerContract<
    HashDriverContract,
    { [P in keyof HashersList]: HashersList[P]['implementation'] }
    > {
    /**
     * Hash plain text value using the default mapping
     */
    hash (value: string): ReturnType<DriverMethod<DefaultDriver, 'hash'>>

    /**
     * Verify plain value against the hashed value to find if it's
     * valid or not
     */
    verify (hashedValue: string, plainValue: string): ReturnType<DriverMethod<DefaultDriver, 'verify'>>

    /**
     * Check the hash against the current config to find it needs
     * to be re-hashed or not
     */
    needsReHash (hashedValue: string): ReturnType<DriverMethod<DefaultDriver, 'needsReHash'>>
  }

  const Hash: HashContract
  export default Hash
}
