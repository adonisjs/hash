/*
* @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { Hash } from '../src/Hash'
import { Fake } from '../src/Drivers/Fake'
import { Argon } from '../src/Drivers/Argon'
import { Bcrypt } from '../src/Drivers/Bcrypt'

const config = {
  default: 'bcrypt' as const,
  list: {
    argon: {
      driver: 'argon2' as const,
      memory: 1,
      parallelism: 1,
      variant: 'id' as 'id',
      saltSize: 16,
      iterations: 2,
    },
    bcrypt: {
      driver: 'bcrypt' as const,
      rounds: 10,
    },
    fake: {
      driver: 'fake' as const,
    },
  },
}

test.group('Hash', () => {
  test('hash value using the default driver', async (assert) => {
    const hash = new Hash({}, config as any)
    const hashedValue = await hash.make('hello-world')
    assert.match(hashedValue, /^\$bcrypt/)
  })

  test('verify value using the default driver', async (assert) => {
    const hash = new Hash({}, config as any)
    const hashedValue = await hash.make('hello-world')
    const isSame = await hash.verify(hashedValue, 'hello-world')
    assert.isTrue(isSame)
  })

  test('find if value needsReHash for the default driver', async (assert) => {
    const hash = new Hash({}, config as any)
    const hashedValue = await hash.make('hello-world')
    const needsReHash = hash.needsReHash(hashedValue)
    assert.isFalse(needsReHash)
  })

  test('create named driver', async (assert) => {
    const hash = new Hash({}, config as any)
    assert.instanceOf(hash.use('bcrypt'), Bcrypt)
    assert.instanceOf(hash.use('argon'), Argon)
    assert.instanceOf(hash.use('fake'), Fake)
  })

  test('create extended driver', async (assert) => {
    const hash = new Hash({}, Object.assign({}, config, {
      list: {
        bcrypt: {},
        foo: {
          driver: 'my-algo',
        },
      },
    }) as any)
    class MyAlgo {
      public ids = []
      public params = {}

      public async hash (): Promise<string> {
        return 'foo'
      }

      public async make (): Promise<string> {
        return 'foo'
      }

      public async verify (): Promise<boolean> {
        return true
      }

      public needsReHash (): boolean {
        return true
      }
    }

    hash.extend('my-algo', () => {
      return new MyAlgo()
    })

    assert.instanceOf(hash.use('foo'), MyAlgo)
  })

  test('raise exception when default driver is missing', async (assert) => {
    const hash = () => new Hash({}, {} as any)
    assert.throw(
      hash,
      'Invalid "hash" config. Missing value for "default". Make sure set it inside "config/hash',
    )
  })

  test('raise exception when list is missing', async (assert) => {
    const hash = () => new Hash({}, { default: 'bcrypt' } as any)
    assert.throw(
      hash,
      'Invalid "hash" config. Missing value for "list". Make sure set it inside "config/hash',
    )
  })

  test('raise exception when default driver value is missing inside list', async (assert) => {
    const hash = () => new Hash({}, { default: 'bcrypt', list: {} } as any)
    assert.throw(
      hash,
      'Invalid "hash" config. "bcrypt" is not defined inside "list". Make sure set it inside "config/hash',
    )
  })
})
