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
			[key: string]: string
		}

		/**
		 * Hash plain text value using the default mapping
		 */
		hash(value: string): Promise<string>
		make(value: string): Promise<string>

		/**
		 * Check the hash against the current config to find it needs
		 * to be re-hashed or not
		 */
		needsReHash(hashedValue: string): boolean

		/**
		 * Verify plain value against the hashed value to find if it's
		 * valid or not
		 */
		verify(hashedValue: string, plainValue: string): Promise<boolean>
	}

	/**
	 * Shape of bcrypt config
	 */
	export type BcryptConfig = {
		driver: 'bcrypt'
		rounds: number
	}

	/**
	 * Bcrypt driver contract
	 */
	export interface BcryptContract extends HashDriverContract {
		ids: ['bcrypt']
		params: {
			rounds: 'r'
		}
	}

	/**
	 * Shape of argon2 config
	 */
	export type ArgonConfig = {
		driver: 'argon2'
		variant: 'd' | 'i' | 'id'
		iterations: number
		memory: number
		parallelism: number
		saltSize: number
	}

	/**
	 * Argon2 driver contract
	 */
	export interface ArgonContract extends HashDriverContract {
		ids: ['argon2d', 'argon2i', 'argon2id']
		params: {
			iterations: 't'
			memory: 'm'
			parallelism: 'p'
		}
	}

	export interface FakeContract extends HashDriverContract {
		ids: ['fake']
	}

	/**
	 * Default list of available drivers. One can you reference this type
	 * to setup the `HashersList`.
	 *
	 * We will remove this later. Make sure all stubs are not using this
	 * type.
	 */
	export type HashDrivers = {
		bcrypt: {
			config: BcryptConfig
			implementation: BcryptContract
		}
		argon: {
			config: ArgonConfig
			implementation: ArgonContract
		}
		fake: {
			config: undefined
			implementation: FakeContract
		}
	}

	/**
	 * List of hash mappings used by the app. Using declaration merging, one
	 * must extend this interface.
	 *
	 * MUST BE SET IN THE USER LAND.
	 */
	export interface HashersList {}

	/**
	 * Shape of config accepted by the Hash module.
	 */
	export interface HashConfig {
		default: keyof HashersList
		list: { [P in keyof HashersList]: HashersList[P]['config'] }
	}

	/**
	 * Hash mananger interface
	 */
	export interface HashContract
		extends ManagerContract<
			HashDriverContract,
			HashDriverContract,
			{ [P in keyof HashersList]: HashersList[P]['implementation'] }
		> {
		readonly isFaked: boolean

		/**
		 * Hash plain text value using the default mapping
		 */
		hash(value: string): ReturnType<HashDriverContract['hash']>
		make(value: string): ReturnType<HashDriverContract['make']>

		/**
		 * Fake/restore hash implementations
		 */
		fake(): void
		restore(): void

		/**
		 * Verify plain value against the hashed value to find if it's
		 * valid or not
		 */
		verify(hashedValue: string, plainValue: string): ReturnType<HashDriverContract['verify']>

		/**
		 * Check the hash against the current config to find it needs
		 * to be re-hashed or not
		 */
		needsReHash(hashedValue: string): ReturnType<HashDriverContract['needsReHash']>
	}

	const Hash: HashContract
	export default Hash
}
