/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import sinon from 'sinon'
import { test } from '@japa/runner'
import { Hash } from '../src/hash.js'
import { HashManager } from '../src/hash_manager.js'
import { HashDriverContract } from '../src/types.js'

test.group('Hash manager', () => {
  test('create hash instance from the manager', ({ assert, expectTypeOf }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
        bcrypt: {
          driver: 'bcrypt',
        },
        scrypt: {
          driver: 'scrypt',
        },
      },
    })

    expectTypeOf(manager.use)
      .parameter(0)
      .toEqualTypeOf<'argon' | 'scrypt' | 'bcrypt' | undefined>()

    expectTypeOf(manager.use('argon')).toEqualTypeOf<Hash>()
    expectTypeOf(manager.use('bcrypt')).toEqualTypeOf<Hash>()
    expectTypeOf(manager.use('scrypt')).toEqualTypeOf<Hash>()

    assert.instanceOf(manager.use('argon'), Hash)
    assert.instanceOf(manager.use('bcrypt'), Hash)
    assert.instanceOf(manager.use('scrypt'), Hash)
  })

  test('cache hash instance', ({ assert, expectTypeOf }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
        bcrypt: {
          driver: 'bcrypt',
        },
        scrypt: {
          driver: 'scrypt',
        },
      },
    })

    expectTypeOf(manager.use)
      .parameter(0)
      .toEqualTypeOf<'argon' | 'scrypt' | 'bcrypt' | undefined>()

    expectTypeOf(manager.use('argon')).toEqualTypeOf<Hash>()
    expectTypeOf(manager.use('bcrypt')).toEqualTypeOf<Hash>()
    expectTypeOf(manager.use('scrypt')).toEqualTypeOf<Hash>()

    assert.strictEqual(manager.use('argon'), manager.use('argon'))
    assert.strictEqual(manager.use('bcrypt'), manager.use('bcrypt'))
    assert.strictEqual(manager.use('scrypt'), manager.use('scrypt'))
  })

  test('use default hasher', ({ assert }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
        bcrypt: {
          driver: 'bcrypt',
        },
        scrypt: {
          driver: 'scrypt',
        },
      },
    })

    assert.strictEqual(manager.use(), manager.use('argon'))
    assert.notStrictEqual(manager.use(), manager.use('bcrypt'))
    assert.notStrictEqual(manager.use(), manager.use('scrypt'))
  })

  test('fail when default hasher is not configured', ({ assert }) => {
    const manager = new HashManager({
      list: {
        argon: {
          driver: 'argon2',
        },
        bcrypt: {
          driver: 'bcrypt',
        },
        scrypt: {
          driver: 'scrypt',
        },
      },
    })

    assert.throws(
      () => manager.use(),
      'Cannot create hash instance. No default hasher is defined in the config'
    )
  })

  test('fail when driver is unknown', ({ assert, expectTypeOf }) => {
    const manager = new HashManager({
      default: 'pdkf',
      list: {
        pdkf: {
          // @ts-expect-error
          driver: 'pdkf',
        },
      },
    })

    assert.throws(
      () => manager.use('pdkf'),
      'Unknown hash driver "pdkf". Make sure the driver is registered with HashManager'
    )

    // @ts-expect-error
    expectTypeOf(manager.use).parameters.toEqualTypeOf<['pdkf']>()
  })

  test('fake all hashers', async ({ assert }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
        bcrypt: {
          driver: 'bcrypt',
        },
        scrypt: {
          driver: 'scrypt',
        },
      },
    })

    manager.fake()
    assert.equal(await manager.use('argon').make('hello-world'), 'hello-world')
    assert.equal(await manager.use('bcrypt').make('hello-world'), 'hello-world')
    assert.equal(await manager.use('scrypt').make('hello-world'), 'hello-world')

    manager.restore()
    assert.notEqual(await manager.use('argon').make('hello-world'), 'hello-world')
    assert.notEqual(await manager.use('bcrypt').make('hello-world'), 'hello-world')
    assert.notEqual(await manager.use('scrypt').make('hello-world'), 'hello-world')
  })

  test('extend to add custom drivers', async ({ assert, cleanup }) => {
    const manager = new HashManager({
      default: 'passwords',
      list: {
        passwords: {
          // @ts-expect-error
          driver: 'md5',
        },
      },
    })

    class Md5 implements HashDriverContract {
      async make(value: string): Promise<string> {
        return value
      }

      async verify(hashedValue: string, plainValue: string): Promise<boolean> {
        return hashedValue === plainValue
      }

      isValidHash(value: string): boolean {
        return !!value
      }

      needsReHash(hashedValue: string): boolean {
        return !hashedValue
      }
    }
    const md5 = new Md5()
    const make = sinon.spy(md5, 'make')
    const verify = sinon.spy(md5, 'verify')
    const needsReHash = sinon.spy(md5, 'needsReHash')
    const isValidHash = sinon.spy(md5, 'isValidHash')

    cleanup(() => {
      make.restore()
      verify.restore()
      needsReHash.restore()
      isValidHash.restore()
    })

    // @ts-expect-error
    manager.extend('md5', () => md5)

    await manager.use('passwords').make('hello-world')
    assert.isTrue(make.calledOnce)
    assert.isTrue(make.calledWith('hello-world'))
    assert.equal(await make.returnValues[0], 'hello-world')

    await manager.use('passwords').verify('hello-world', 'hello-world')
    assert.isTrue(verify.calledOnce)
    assert.isTrue(verify.calledWith('hello-world', 'hello-world'))
    assert.equal(await verify.returnValues[0], true)

    manager.use('passwords').needsReHash('hello-world')
    assert.isTrue(needsReHash.calledOnce)
    assert.isTrue(needsReHash.calledWith('hello-world'))
    assert.equal(needsReHash.returnValues[0], false)

    manager.use('passwords').isValidHash('hello-world')
    assert.isTrue(isValidHash.calledOnce)
    assert.isTrue(isValidHash.calledWith('hello-world'))
    assert.equal(isValidHash.returnValues[0], true)
  })

  test('hash text using the default driver', async ({ assert }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
      },
    })

    const hashedValue = await manager.make('secret')
    assert.isTrue(manager.isValidHash(hashedValue))
  })

  test('verify hash using the default driver', async ({ assert }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
      },
    })

    const hashedValue = await manager.make('secret')
    assert.isTrue(await manager.verify(hashedValue, 'secret'))
  })

  test('check if hash needs to be rehashed using the default driver', async ({ assert }) => {
    const manager = new HashManager({
      default: 'argon',
      list: {
        argon: {
          driver: 'argon2',
        },
      },
    })

    const hashedValue = await manager.make('secret')
    assert.isFalse(manager.needsReHash(hashedValue))
  })
})
