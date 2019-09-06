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
import { Bcrypt } from '../src/Drivers/Bcrypt'
import { Argon } from '../src/Drivers/Argon'

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
  },
}

test.group('Hash', () => {
  test('hash value using the default driver', async (assert) => {
    const hash = new Hash({}, config as any)
    const hashedValue = await hash.hash('hello-world')
    assert.match(hashedValue, /^\$bcrypt/)
  })

  test('verify value using the default driver', async (assert) => {
    const hash = new Hash({}, config as any)
    const hashedValue = await hash.hash('hello-world')
    const isSame = await hash.verify(hashedValue, 'hello-world')
    assert.isTrue(isSame)
  })

  test('find if value needsReHash for the default driver', async (assert) => {
    const hash = new Hash({}, config as any)
    const hashedValue = await hash.hash('hello-world')
    const needsReHash = await hash.needsReHash(hashedValue)
    assert.isFalse(needsReHash)
  })

  test('create named driver', async (assert) => {
    const hash = new Hash({}, config as any)
    assert.instanceOf(hash.use('bcrypt'), Bcrypt)
    assert.instanceOf(hash.use('argon'), Argon)
  })

  test('create extended driver', async (assert) => {
    const hash = new Hash({}, Object.assign({}, config, {
      list: {
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
})
