/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import argon2 from 'argon2'
import { test } from '@japa/runner'
import { Argon } from '../../src/drivers/argon.js'
import { PhcFormatter } from '../../src/phc_formatter.js'

test.group('argon | validate config', () => {
  test('validate iterations property', async ({ assert }) => {
    assert.throws(
      () =>
        new Argon({
          variant: 'id',
          iterations: 1,
          memory: 4096,
          parallelism: 1,
          saltSize: 16,
        }),
      'The "iterations" option must be in the range (2 <= iterations <= 4294967295)'
    )
  })

  test('validate memory property', async ({ assert }) => {
    assert.throws(
      () =>
        new Argon({
          variant: 'id',
          iterations: 3,
          memory: 4,
          parallelism: 1,
          saltSize: 16,
        }),
      'The "memory" option must be in the range (8 <= memory <= 4294967295)'
    )
  })

  test('validate parallelism property', async ({ assert }) => {
    assert.throws(
      () =>
        new Argon({
          variant: 'id',
          iterations: 3,
          memory: 4,
          parallelism: 0,
          saltSize: 16,
        }),
      'The "parallelism" option must be in the range (1 <= parallelism <= 16777215)'
    )
  })

  test('validate salt size property', async ({ assert }) => {
    assert.throws(
      () =>
        new Argon({
          variant: 'id',
          iterations: 3,
          memory: 10,
          parallelism: 1,
          saltSize: 4,
        }),
      'The "saltSize" option must be in the range (8 <= saltSize <= 1024)'
    )

    assert.throws(
      () =>
        new Argon({
          variant: 'id',
          iterations: 3,
          memory: 10,
          parallelism: 1,
          saltSize: 4096,
        }),
      'The "saltSize" option must be in the range (8 <= saltSize <= 1024)'
    )
  })

  test('validate variant property', async ({ assert }) => {
    assert.throws(
      () =>
        new Argon({
          // @ts-expect-error
          variant: 'foo',
          iterations: 3,
          memory: 10,
          parallelism: 1,
          saltSize: 8,
        }),
      'The "variant" option must be one of: i,d,id'
    )
  })

  test('validate version property', async ({ assert }) => {
    assert.throws(
      () =>
        new Argon({
          variant: 'id',
          // @ts-expect-error
          version: 1,
          iterations: 3,
          memory: 10,
          parallelism: 1,
          saltSize: 8,
        }),
      'The "version" option must be one of: 16,19'
    )
  })
})

test.group('argon | hash', () => {
  test('hash value and serialize to a phc string', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hashed = await argon.make('hello-world')
    const values = new PhcFormatter().deserialize(hashed)

    assert.properties(values, ['hash', 'salt'])
    assert.equal(values.id, 'argon2id')
    assert.equal(values.version, 19)
    assert.deepEqual(values.params, { t: 3, m: 4096, p: 1 })
    assert.lengthOf(values.salt, 16)
  })
})

test.group('argon | verify', () => {
  test('verify hash value', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hashed = await argon.make('hello-world')
    let matches = await argon.verify(hashed, 'hello-world')
    assert.isTrue(matches)
  })

  test('verify hash value hash using different config', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    const argon1 = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hashed = await argon.make('hello-world')
    let matches = await argon1.verify(hashed, 'hello-world')
    assert.isTrue(matches)
  })

  test('verify hash hashed using argon2 directly', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    const hashed = await argon2.hash('hello-world')
    let matches = await argon.verify(hashed, 'hello-world')
    assert.isTrue(matches)
  })

  test('validate argon strings with no version (old argon strings had no version)', async ({
    assert,
  }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      version: 19,
      saltSize: 16,
    })

    const hashed = await argon2.hash('hello-world', { version: 16 })

    let matches = await argon.verify(hashed.replace(/\$v=16/, ''), 'hello-world')
    assert.isTrue(matches)
  })

  test('should verify a precomputed hash', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash =
      '$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI'

    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      version: 19,
      saltSize: 16,
    })

    assert.isTrue(await argon.verify(hash, 'password'))
  })

  test('fail verification when value is formatted as phc string', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    const hashed = await argon2.hash('hello-world', { raw: true })
    let matches = await argon.verify(hashed.toString(), 'hello-world')
    assert.isFalse(matches)
  })

  test('fail when params section is empty', async ({ assert }) => {
    const wrong =
      '$argon2id$v=19$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI'

    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      version: 19,
      saltSize: 16,
    })

    assert.isFalse(await argon.verify(wrong, 'password'))
  })

  test('fail when hash params are tampered', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    const hashed = await argon.make('hello-world')

    assert.isFalse(await argon.verify(hashed.replace(/m=4096/, 'm=8'), 'hello-world'))
    assert.isFalse(await argon.verify(hashed.replace(/m=4096/, `m=${2 ** 32 + 4}`), 'hello-world'))

    assert.isFalse(await argon.verify(hashed.replace(/v=19/, 'v=22'), 'hello-world'))
    assert.isFalse(await argon.verify(hashed.replace(/v=19/, 'v=16'), 'hello-world'))

    assert.isFalse(await argon.verify(hashed.replace(/p=2/, 'p=1'), 'hello-world'))
    assert.isFalse(await argon.verify(hashed.replace(/p=2/, 'p=0'), 'hello-world'))

    assert.isFalse(await argon.verify(hashed.replace(/t=4/, 't=1'), 'hello-world'))

    assert.isFalse(await argon.verify(hashed.replace(/argon2id/, 'argon2i'), 'hello-world'))
    assert.isFalse(await argon.verify(hashed.replace(/argon2id/, 'argo'), 'hello-world'))
  })

  test('fail when salt is missing', async ({ assert }) => {
    const wrong = '$argon2id$v=19$m=4096,t=3,p=1'
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    assert.isFalse(await argon.verify(wrong, 'password'))
  })

  test('fail when salt is empty', async ({ assert }) => {
    const wrong = '$argon2id$v=19$m=4096,t=3,p=1$$'
    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    assert.isFalse(await argon.verify(wrong, 'password'))
  })

  test('fail when hash is missing', async ({ assert }) => {
    const wrong = '$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg'

    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    assert.isFalse(await argon.verify(wrong, 'password'))
  })

  test('fail when hash is empty', async ({ assert }) => {
    const wrong = '$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$'

    const argon = new Argon({
      variant: 'id',
      iterations: 4,
      memory: 4096,
      parallelism: 2,
      saltSize: 16,
    })

    assert.isFalse(await argon.verify(wrong, 'password'))
  })
})

test.group('argon | needsRehash', () => {
  test('return true when variant is different', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const argon1 = new Argon({
      variant: 'i',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hashed = await argon.make('hello-world')
    assert.isTrue(argon1.needsReHash(hashed))
    assert.isFalse(argon.needsReHash(hashed))
  })

  test('return true when version is different', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hashed = await argon.make('hello-world')
    assert.isTrue(argon.needsReHash(hashed.replace('$v=19', '$v=18')))
  })

  test('return true when all of the params are missing', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 2,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hash = '$argon2id$v=19$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI'
    assert.isTrue(argon.needsReHash(hash))
  })

  test('return true when one of the params are different', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hash =
      '$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI'

    assert.isFalse(argon.needsReHash(hash))
    assert.isTrue(argon.needsReHash(hash.replace('m=4096', 'm=1024')))
    assert.isTrue(argon.needsReHash(hash.replace('t=3', 't=2')))
    assert.isTrue(argon.needsReHash(hash.replace('p=1', 'p=2')))
  })

  test('throw error when value is not a valid phc string', async ({ assert }) => {
    const hash = await argon2.hash('hello-world', { raw: true })
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    await assert.rejects(
      () => argon.needsReHash(hash.toString()),
      'pchstr must contain a $ as first char'
    )
  })

  test('return true when not a valid argon identifier', async ({ assert }) => {
    const hash =
      '$bcrypt$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI'

    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    assert.isTrue(argon.needsReHash(hash))
  })

  test('return true when using argon2 directly', async ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hashed = await argon2.hash('hello-world')

    assert.isTrue(argon.needsReHash(hashed))
    assert.isFalse(argon2.needsRehash(hashed))
  })
})

test.group('argon | isValidHash', () => {
  test('check if value formatted as a valid argon2 hash', ({ assert }) => {
    const argon = new Argon({
      variant: 'id',
      iterations: 3,
      memory: 4096,
      parallelism: 1,
      saltSize: 16,
    })

    const hash =
      '$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI'

    assert.isTrue(argon.isValidHash(hash))
    /**
     * Non versionized hashes are allowed
     */
    assert.isTrue(argon.isValidHash(hash.replace('$v=19', '')))

    assert.isFalse(argon.isValidHash('hello world'))
    assert.isFalse(argon.isValidHash(hash.replace('$m=4096', '')))
    assert.isFalse(argon.isValidHash(hash.replace('p=1', '')))
  })
})
