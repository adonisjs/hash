/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { defineConfig } from '../src/define_config.js'

test.group('Define config', () => {
  test('define config for hash manager', async ({ assert }) => {
    const config = defineConfig({
      default: 'bcrypt',
      list: {
        bcrypt: {
          driver: 'bcrypt',
          rounds: 10,
        },
      },
    })

    assert.deepEqual(config, {
      default: 'bcrypt',
      list: {
        bcrypt: {
          driver: 'bcrypt',
          rounds: 10,
        },
      },
    })
  })

  test('fail when list is not defined', async ({ assert }) => {
    // @ts-expect-error
    assert.throws(() => defineConfig({}), 'Missing "list" property in hash config')
  })

  test('allow empty list', async ({ assert }) => {
    assert.deepEqual(defineConfig({ list: {} }), { list: {} })
  })

  test('fail when default property is not mentioned in the list', async ({ assert }) => {
    assert.throws(
      // @ts-expect-error
      () => defineConfig({ default: 'bcrypt', list: {} }),
      'Missing "list.bcrypt". It is referenced by the "default" property'
    )
  })

  test('fail when default property is not defined but list has hashers', async ({ assert }) => {
    assert.throws(
      () => defineConfig({ list: { bcrypt: { driver: 'bcrypt' } } }),
      'Missing "default" property in hash config. Specify a default hasher'
    )
  })
})
