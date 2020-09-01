/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 * and
 * (c) Evgeniy Ryumin <cmp08@ya.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/// <reference path="../../adonis-typings/hash.ts" />
import { BcryptLegacyContract, BcryptLegacyConfig } from '@ioc:Adonis/Core/Hash'
import bcrypt from 'bcryptjs'

/**
 * Hash plain values using [bcryptjs](https://www.npmjs.com/package/bcryptjs).
 */
export class BcryptLegacy implements BcryptLegacyContract {
	public config: BcryptLegacyConfig
	public ids: BcryptLegacyContract['ids'] = ['bcryptLegacy']
	public params: BcryptLegacyContract['params'] = { rounds: 'r' }
	public version = 98
	constructor(config: BcryptLegacyConfig) {
		this.config = config
	}

	public async hash(value: string) {
		process.emitWarning('DeprecationWarning', 'Hash.hash() is deprecated. Use Hash.make() instead')
		return this.make(value)
	}

	/**
	 * Hash plain value using bcrypt.
	 */
	public async make(value: string, config: BcryptLegacyConfig | null = null): Promise<string> {
		let rounds = 0

		/**
		 * In order to be back compatible, we have to accept strings and numbers
		 * as config rounds.
		 */
		if (typeof config === 'string' || typeof config === 'number') {
			rounds = Number(config)
		} else {
			rounds = config?.rounds || this.config.rounds || 10
		}

		return new Promise(function (resolve, reject) {
			bcrypt.hash(value, rounds, function (error, hash) {
				if (error) {
					return reject(error)
				}
				resolve(hash)
			})
		})
	}

	public needsReHash(hashedValue: string): boolean {
		if (hashedValue.startsWith('$2y')) {
			return true
		}
		return false
	}

	/**
	 * Verify an existing hash with the plain value. Though this
	 * method returns a promise, it never rejects the promise
	 * and this is just for the sake of simplicity, since
	 * bcrypt errors are not something that you can act
	 * upon.
	 */
	public verify(hash: string, value: string): Promise<boolean> {
		return new Promise(function (resolve) {
			bcrypt.compare(value, hash, function (error, response) {
				if (error) {
					return resolve(false)
				}
				resolve(response)
			})
		})
	}
}
