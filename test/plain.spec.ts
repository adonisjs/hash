/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { Plain } from '../src/Drivers/Plain'

test.group('Plain', () => {
  test('hash value', async (assert) => {
    const plain = new Plain()
    const hashed = await plain.make('hello-world')

    assert.equal(hashed, 'hello-world')
  })

  test('verify hashed value', async (assert) => {
    const plain = new Plain()
    const hashed = await plain.make('hello-world')

    let matched = await plain.verify(hashed, 'hello-world')
    assert.isTrue(matched)

    matched = await plain.verify(hashed, 'hi-world')
    assert.isFalse(matched)
  })
})
