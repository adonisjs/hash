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
    hash (value: string): Promise<string>
    needsReHash (hashedValue: string): boolean
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
   * List of hash mappings used by the app. Using declaration merging, one
   * must extend this interface
   */
  export interface HashList {
  }

  /**
   * Shape of config accepted by the Hash module
   */
  export interface HashConfigContract {
    default: keyof HashList,
    list: { [P in keyof HashList]: HashList[P]['config'] },
  }

  export type DriverMethod<T, K extends keyof HashDriverContract> = T extends HashDriverContract
    ? HashDriverContract[K]
    : never

  /**
   * Hash mananger interface
   */
  export interface HashContract<
    DefaultDriver = HashList[HashConfigContract['default']]['implementation']
  > extends ManagerContract<
    HashDriverContract,
    { [P in keyof HashList]: HashList[P]['implementation'] }
  > {
    hash (value: string): ReturnType<DriverMethod<DefaultDriver, 'hash'>>
    verify (hashedValue: string, plainValue: string): ReturnType<DriverMethod<DefaultDriver, 'verify'>>
    needsReHash (hashedValue: string): ReturnType<DriverMethod<DefaultDriver, 'needsReHash'>>
  }

  const Hash: HashContract
  export default Hash
}
