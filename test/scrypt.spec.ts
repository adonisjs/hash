/*
 * @adonisjs/hash
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import phc from '@phc/format'
import { Scrypt } from '../src/Drivers/Scrypt'

test.group('Scrypt', () => {
  test('hash value', async ({ assert }) => {
    const scrypt = new Scrypt({
      driver: 'scrypt',
      cost: 2048,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      maxMemory: 32 * 1024 * 1024,
      keyLength: 64,
    })

    const hashed = await scrypt.make('Romain Lanz')
    const values = phc.deserialize(hashed)

    assert.equal(values.id, 'scrypt')
    assert.deepEqual(values.params, { n: 2048, r: 8, p: 1 })
    assert.lengthOf(values.salt, 16)
  })

  test('verify hash value', async ({ assert }) => {
    const scrypt = new Scrypt({
      driver: 'scrypt',
      cost: 2048,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      maxMemory: 32 * 1024 * 1024,
      keyLength: 64,
    })

    const hashed = await scrypt.make('Romain Lanz')
    let matches = await scrypt.verify(hashed, 'Romain Lanz')
    assert.isTrue(matches)

    matches = await scrypt.verify(hashed, 'Romain')
    assert.isFalse(matches)
  })

  test('return true for needsRehash when one of the params is different', async ({ assert }) => {
    const scrypt = new Scrypt({
      driver: 'scrypt',
      cost: 2048,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      maxMemory: 32 * 1024 * 1024,
      keyLength: 64,
    })

    const scrypt2 = new Scrypt({
      driver: 'scrypt',
      cost: 2048,
      blockSize: 8,
      parallelization: 2,
      saltSize: 16,
      maxMemory: 32 * 1024 * 1024,
      keyLength: 64,
    })

    const hashed = await scrypt.make('Romain Lanz')
    assert.isTrue(scrypt2.needsReHash(hashed))
    assert.isFalse(scrypt.needsReHash(hashed))
  })

  test('return true for needsRehash when hash value is not formatted as a phc string', async ({
    assert,
  }) => {
    const hash =
      '46219dec36aeeb9587836be851a8147ce0837b1bef30b28400cf1decce027c937333a314068577835b6f44f34f75758b6de3161696fade65731f5548ea09d95e'
    const scrypt = new Scrypt({
      driver: 'scrypt',
      cost: 2048,
      blockSize: 8,
      parallelization: 1,
      saltSize: 16,
      maxMemory: 32 * 1024 * 1024,
      keyLength: 64,
    })

    assert.isTrue(scrypt.needsReHash(hash))
  })
})
