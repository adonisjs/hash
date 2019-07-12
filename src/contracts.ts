/*
* @poppinss/hash
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { DriverNodesList, ExtractDriversConfig } from '@poppinss/manager'

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
 * A list of default hash drivers. Upon extending, do make
 * sure to extend the given type aswell.
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
 * Shape of config accepted by the Hash module
 */
export type HashConfigContract<
  DriversList extends DriverNodesList<any, any>,
> = {
  driver: keyof DriversList,
} & ExtractDriversConfig<DriversList>
