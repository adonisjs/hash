/*
 * @adonisjs/events
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { join } from 'path'
import { Registrar, Ioc } from '@adonisjs/fold'
import { Config } from '@adonisjs/config/build/standalone'

import { Hash } from '../src/Hash'

test.group('Hash Provider', () => {
	test('register hash provider', async (assert) => {
		const ioc = new Ioc()
		ioc.bind('Adonis/Core/Config', () => {
			return new Config({
				hash: {
					default: 'bcrypt',
					list: {
						bcrypt: {},
					},
				},
			})
		})

		const registrar = new Registrar(ioc, join(__dirname, '..'))
		await registrar.useProviders(['./providers/HashProvider']).registerAndBoot()

		assert.instanceOf(ioc.use('Adonis/Core/Hash'), Hash)
		assert.deepEqual(ioc.use('Adonis/Core/Hash'), ioc.use('Adonis/Core/Hash'))
	})

	test('raise error when config is missing', async (assert) => {
		const ioc = new Ioc()
		ioc.bind('Adonis/Core/Config', () => {
			return new Config({})
		})

		const registrar = new Registrar(ioc, join(__dirname, '..'))
		await registrar.useProviders(['./providers/HashProvider']).registerAndBoot()

		const fn = () => ioc.use('Adonis/Core/Hash')
		assert.throw(
			fn,
			'Invalid "hash" config. Missing value for "default". Make sure set it inside "config/hash"'
		)
	})
})
