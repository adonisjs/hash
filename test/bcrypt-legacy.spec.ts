/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import phc from '@phc/format'
import { BcryptLegacy } from '../src/Drivers/BcryptLegacy'

test.group('Bcrypt legacy mode', () => {
	test('hash value using defaults', async (assert) => {
		const bcrypt = new BcryptLegacy({ rounds: 10, driver: 'bcryptLegacy' })
		const hashed = await bcrypt.make('hello-world')
		const values = phc.deserialize(hashed)
		assert.equal(values.id, '2a')
	})

	test('verify hashed value', async (assert) => {
		const bcrypt = new BcryptLegacy({ rounds: 10, driver: 'bcryptLegacy' })
		const hashed = await bcrypt.make('hello-world')

		let matched = await bcrypt.verify(hashed, 'hello-world')
		assert.isTrue(matched)

		matched = await bcrypt.verify(hashed, 'hi-world')
		assert.isFalse(matched)
	})
})
