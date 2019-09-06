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
   * A list of default mappings. One must extend this interface to add
   * their own
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

  /**
   * Hash mananger interface
   */
  export interface HashContract extends ManagerContract<
    HashDriverContract,
    { [P in keyof HashList]: HashList[P]['implementation'] }
  > {
    hash (value: string): ReturnType<HashDriverContract['hash']>
    verify (hashedValue: string, plainValue: string): ReturnType<HashDriverContract['verify']>
    needsReHash (hashedValue: string): ReturnType<HashDriverContract['needsReHash']>
  }

  const Hash: HashContract
  export default Hash
}
