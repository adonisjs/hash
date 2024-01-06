/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Scrypt } from '../../src/drivers/scrypt.js'
import { PhcFormatter } from '../../src/phc_formatter.js'

test.group('argon | scrypt config', () => {
  test('validate block size property', async ({ assert }) => {
    assert.throws(
      () =>
        new Scrypt({
          blockSize: -1,
        }),
      'The "blockSize" option must be in the range (1 <= blockSize <= 4294967295)'
    )

    assert.throws(
      () =>
        new Scrypt({
          blockSize: 2 ** 32 + 1,
        }),
      'The "blockSize" option must be in the range (1 <= blockSize <= 4294967295)'
    )
  })

  test('validate cost property', async ({ assert }) => {
    assert.throws(
      () =>
        new Scrypt({
          cost: 1,
        }),
      'The "cost" option must be in the range (2 <= cost <= 4294967295)'
    )

    // assert.throws(
    //   () =>
    //     new Scrypt({
    //
    //       blockSize: 3,
    //     }),
    //   'The "blockSize" option must be in the range (1 <= blockSize <= 4294967295)'
    // )
  })

  test('validate parallelization property', async ({ assert }) => {
    assert.throws(
      () =>
        new Scrypt({
          parallelization: 0,
        }),
      'The "parallelization" option must be in the range (1 <= parallelization <= 134217727)'
    )
  })

  test('validate saltSize property', async ({ assert }) => {
    assert.throws(
      () =>
        new Scrypt({
          saltSize: 4,
        }),
      'The "saltSize" option must be in the range (8 <= saltSize <= 1024)'
    )

    assert.throws(
      () =>
        new Scrypt({
          saltSize: 4096,
        }),
      'The "saltSize" option must be in the range (8 <= saltSize <= 1024)'
    )
  })

  test('validate keyLength property', async ({ assert }) => {
    assert.throws(
      () =>
        new Scrypt({
          keyLength: 32,
        }),
      'The "keyLength" option must be in the range (64 <= keyLength <= 128)'
    )

    assert.throws(
      () =>
        new Scrypt({
          keyLength: 256,
        }),
      'The "keyLength" option must be in the range (64 <= keyLength <= 128)'
    )
  })
})

test.group('scrypt | hash', () => {
  test('hash value', async ({ assert }) => {
    const scrypt = new Scrypt({})

    const hashed = await scrypt.make('hello-world')
    const values = new PhcFormatter().deserialize(hashed)

    assert.equal(values.id, 'scrypt')
    assert.deepEqual(values.params, { n: 16384, r: 8, p: 1 })
    assert.lengthOf(values.salt, 16)
  })
})

test.group('scrypt | verify', () => {
  test('verify hash value', async ({ assert }) => {
    const scrypt = new Scrypt({})

    const hashed = await scrypt.make('hello-world')

    assert.isTrue(await scrypt.verify(hashed, 'hello-world'))
    assert.isFalse(await scrypt.verify(hashed, 'Romain'))
  })

  test('verify hash value hash using different config', async ({ assert }) => {
    const scrypt = new Scrypt({
      maxMemory: 128 * 16438 * 8,
    })
    const scrypt1 = new Scrypt({})

    const hashed = await scrypt.make('hello-world')
    assert.isTrue(await scrypt1.verify(hashed, 'hello-world'))
  })

  test('should verify a precomputed hash', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=16384,r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isTrue(await scrypt.verify(hash, 'password'))
  })

  test('fail when params are missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the identifier is unsupported', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$script$n=16384,r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the "n" parameter is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the "n" parameter is out of range', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=0,r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the "r" parameter is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=16384,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the "r" parameter is out of range', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=16384,r=-1,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the "p" parameter is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=16384,r=8$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail if the "p" parameter is out of range', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=16384,r=8,p=-1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail when salt is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$scrypt$n=16384,r=8,p=1'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail when salt is empty', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$scrypt$n=16384,r=8,p=1$$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail when hash is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$scrypt$n=16384,r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })

  test('fail when hash is empty', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$scrypt$n=16384,r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg$'

    const scrypt = new Scrypt({})
    assert.isFalse(await scrypt.verify(hash, 'password'))
  })
})

test.group('scrypt | needsRehash', () => {
  test('return true when cost is different', async ({ assert }) => {
    const scrypt = new Scrypt({
      cost: 16384,
    })

    const scrypt1 = new Scrypt({
      cost: 3304,
    })

    const hashed = await scrypt.make('hello-world')
    assert.isTrue(scrypt1.needsReHash(hashed))
    assert.isFalse(scrypt.needsReHash(hashed))
  })

  test('return true when block size is different', async ({ assert }) => {
    const scrypt = new Scrypt({
      blockSize: 8,
    })

    const scrypt1 = new Scrypt({
      blockSize: 4,
    })

    const hashed = await scrypt.make('hello-world')
    assert.isTrue(scrypt1.needsReHash(hashed))
    assert.isFalse(scrypt.needsReHash(hashed))
  })

  test('return true when parallelization is different', async ({ assert }) => {
    const scrypt = new Scrypt({
      parallelization: 2,
    })

    const scrypt1 = new Scrypt({
      parallelization: 1,
    })

    const hashed = await scrypt.make('hello-world')
    assert.isTrue(scrypt1.needsReHash(hashed))
    assert.isFalse(scrypt.needsReHash(hashed))
  })

  test('return true when params are missing', async ({ assert }) => {
    const scrypt = new Scrypt({
      cost: 16384,
    })

    const hash =
      '$scrypt$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    assert.isTrue(scrypt.needsReHash(hash))
  })

  test('throw error when value is not a valid phc string', async ({ assert }) => {
    const scrypt = new Scrypt({
      cost: 16384,
    })

    await assert.rejects(() => scrypt.needsReHash('foo'), 'pchstr must contain a $ as first char')
  })

  test('return true when not a valid scrypt identifier', async ({ assert }) => {
    const scrypt = new Scrypt({
      cost: 16384,
    })

    const hash = '$argon2id$v=98$r=10$Jtxi46WJ26OQ0khsYLLlnw$knXGfuRFsSjXdj88JydPOnUIglvm1S8'
    assert.isTrue(scrypt.needsReHash(hash))
  })
})

test.group('argon | isValidHash', () => {
  test('check if value formatted as a valid argon2 hash', ({ assert }) => {
    const hash =
      '$scrypt$n=16384,r=8,p=1$YhdCGu1G+vTC6F9oJZ16lg$IDWTbizFCq5n9YvPiy3YTPdUD12Nf1Iit8aQeGyWZdA9k9L8rKk9Ii5jQxSkV0MJyxr3/nzOHh+VTht0KFxiBA'

    const scrypt = new Scrypt({})

    assert.isTrue(scrypt.isValidHash(hash))
    assert.isFalse(scrypt.isValidHash('hello world'))
    assert.isFalse(scrypt.isValidHash(hash.replace('$n=16384', '')))
    assert.isFalse(scrypt.isValidHash(hash.replace('r=8', '')))
    assert.isFalse(scrypt.isValidHash(hash.replace('p=1', '')))
  })
})
