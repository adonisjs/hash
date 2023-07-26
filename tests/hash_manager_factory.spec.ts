/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Hash } from '../index.js'
import { Bcrypt } from '../src/drivers/bcrypt.js'
import { Scrypt } from '../src/drivers/scrypt.js'
import { HashManagerFactory } from '../factories/hash_manager.js'

test.group('Hash manager factory', () => {
  test('create instance of hash manager using factory', async ({ assert, expectTypeOf }) => {
    const hash = new HashManagerFactory().create()

    assert.instanceOf(hash.use(), Hash)
    expectTypeOf(hash.use()).toMatchTypeOf<Hash>()

    const hashedValue = await hash.use().make('secret')
    assert.isTrue(await new Scrypt({}).verify(hashedValue, 'secret'))
  })

  test('create instance of hash manager with custom config', async ({ assert }) => {
    const hash = new HashManagerFactory()
      .merge({
        default: 'bcrypt',
        list: {
          bcrypt: () => new Bcrypt({}),
        },
      })
      .create()

    const hashedValue = await hash.use().make('secret')
    assert.isTrue(await new Bcrypt({}).verify(hashedValue, 'secret'))
  })
})
