/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Fake } from '../../src/drivers/fake.js'

test.group('Fake', () => {
  test('hash value', async ({ assert }) => {
    const driver = new Fake()
    const hashed = await driver.make('hello-world')

    assert.equal(hashed, 'hello-world')
  })

  test('verify hashed value', async ({ assert }) => {
    const driver = new Fake()
    const hashed = await driver.make('hello-world')

    assert.isTrue(await driver.verify(hashed, 'hello-world'))
    assert.isFalse(await driver.verify(hashed, 'hi-world'))
  })

  test('always return true from "isValidHash"', async ({ assert }) => {
    const driver = new Fake()
    const hashed = await driver.make('hello-world')
    assert.isTrue(driver.isValidHash(hashed))
    assert.isTrue(driver.isValidHash('hi-world'))
  })

  test('always return true from "needsReHash"', async ({ assert }) => {
    const driver = new Fake()
    const hashed = await driver.make('hello-world')
    assert.isFalse(driver.needsReHash(hashed))
  })
})
