/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Hash } from '../src/hash.js'
import { Argon } from '../src/drivers/argon.js'

test.group('Hash', () => {
  test('hash text using a driver', async ({ assert }) => {
    const argon = new Argon({})
    const hash = new Hash(argon)

    const hashedValue = await hash.make('secret')
    assert.isTrue(hash.isValidHash(hashedValue))
  })

  test('verify hash using a driver', async ({ assert }) => {
    const argon = new Argon({})
    const hash = new Hash(argon)

    const hashedValue = await hash.make('secret')
    assert.isTrue(await hash.verify(hashedValue, 'secret'))
  })

  test('check if hash needs to be rehashed using a driver', async ({ assert }) => {
    const argon = new Argon({})
    const hash = new Hash(argon)

    const hashedValue = await hash.make('secret')
    assert.isFalse(hash.needsReHash(hashedValue))
  })
})
