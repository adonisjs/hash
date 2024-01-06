/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import bcryptDialect from 'bcrypt'

import { Bcrypt } from '../../src/drivers/bcrypt.js'
import { PhcFormatter } from '../../src/phc_formatter.js'

test.group('bcrypt | validate config', () => {
  test('validate rounds property', ({ assert }) => {
    assert.throws(
      () => new Bcrypt({ rounds: 1 }),
      'The "rounds" option must be in the range (4 <= rounds <= 31)'
    )
    assert.throws(
      () => new Bcrypt({ rounds: 32 }),
      'The "rounds" option must be in the range (4 <= rounds <= 31)'
    )
  })

  test('validate salt size property', ({ assert }) => {
    assert.throws(
      () => new Bcrypt({ saltSize: 4 }),
      'The "saltSize" option must be in the range (8 <= saltSize <= 1024)'
    )
    assert.throws(
      () => new Bcrypt({ saltSize: 4096 }),
      'The "saltSize" option must be in the range (8 <= saltSize <= 1024)'
    )
  })

  test('validate version property', ({ assert }) => {
    assert.throws(
      // @ts-expect-error
      () => new Bcrypt({ version: 92 }),
      'The "version" option must be one of: 97,98'
    )
  })
})

test.group('bcrypt | hash', () => {
  test('hash value and serialize as a phc string', async ({ assert }) => {
    const bcrypt = new Bcrypt({ rounds: 10 })
    const hashed = await bcrypt.make('hello-world')
    const values = new PhcFormatter().deserialize(hashed)

    assert.equal(values.id, 'bcrypt')
    assert.equal(values.version, 98)
    assert.deepEqual(values.params, { r: 10 })
    assert.lengthOf(values.salt, 16)
  })
})

test.group('bcrypt | verify', () => {
  test('verify hash value', async ({ assert }) => {
    const bcrypt = new Bcrypt({ rounds: 10 })
    const hash = await bcrypt.make('hello-world')

    assert.isTrue(await bcrypt.verify(hash, 'hello-world'))
  })

  test('verify with rounds less than 10', async ({ assert }) => {
    const bcrypt = new Bcrypt({ rounds: 9 })
    assert.isTrue(await bcrypt.verify(await bcrypt.make('hello-world'), 'hello-world'))
  })

  test('verify hash using different config', async ({ assert }) => {
    const bcrypt = new Bcrypt({ rounds: 10 })
    const bcrypt1 = new Bcrypt({ rounds: 8, saltSize: 32 })
    const hash = await bcrypt.make('hello-world')

    assert.isTrue(await bcrypt1.verify(hash, 'hello-world'))
  })

  test('verify bcrypt mcf hash', async ({ assert }) => {
    const bcrypt = new Bcrypt({ rounds: 10 })
    const hash = await bcryptDialect.hash('hello-world', 10)

    assert.isTrue(await bcrypt.verify(hash, 'hello-world'))
  })

  test('fail when mcf hash is invalid', async ({ assert }) => {
    const bcrypt = new Bcrypt({ rounds: 10 })
    const hash = await bcryptDialect.hash('hello-world', 10)

    assert.isFalse(await bcrypt.verify(hash, 'hi-world'))
  })

  test('verify a precomputed hash', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$r=10$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isTrue(await bcrypt.verify(hash, 'password'))
  })

  test('fail if the identifier is unsupported', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcript$v=98$r=10$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test('fail if the version is not supported', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=10$r=10$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test('fail if the param section is empty', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test("fail if the 'r' parameter is missing", async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$i=12$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test("fail if the 'r' parameter is out of range", async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$r=0$tAe1bhm5zoo0Sx7ZfrCd7w$0T4Cf8htpt/8FbjK+cErdaTh8T6ClYQ'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test('fail if salt is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$r=8'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test('fail if salt is empty', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$r=8$$'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test('fail if hash is missing', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$r=8$aM15713r3Xsvxbi31lqr1Q'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })

  test('fail if hash is empty', async ({ assert }) => {
    // Precomputed hash for "password"
    const hash = '$bcrypt$v=98$r=8$aM15713r3Xsvxbi31lqr1Q$'
    const bcrypt = new Bcrypt({ rounds: 10 })

    assert.isFalse(await bcrypt.verify(hash, 'password'))
  })
})

test.group('bcrypt | needsRehash', () => {
  test('return true when version is different', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      version: 98,
    })

    const hashed = await bcrypt.make('hello-world')
    assert.isTrue(bcrypt.needsReHash(hashed.replace('$v=98', '$v=97')))
  })

  test('return true rounds param is different', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      rounds: 10,
    })

    const bcrypt1 = new Bcrypt({
      rounds: 8,
    })

    const hashed = await bcrypt.make('hello-world')
    assert.isTrue(bcrypt1.needsReHash(hashed))
    assert.isFalse(bcrypt.needsReHash(hashed))
  })

  test('return true when params are missing', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      rounds: 10,
    })

    const hash = '$bcrypt$v=98$Jtxi46WJ26OQ0khsYLLlnw$knXGfuRFsSjXdj88JydPOnUIglvm1S8'
    assert.isTrue(bcrypt.needsReHash(hash))
  })

  test('return true when version is missing', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      rounds: 10,
    })

    const hash = '$bcrypt$r=10$Jtxi46WJ26OQ0khsYLLlnw$knXGfuRFsSjXdj88JydPOnUIglvm1S8'
    assert.isTrue(bcrypt.needsReHash(hash))
  })

  test('return true for bcrypt mcf hash', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      version: 98,
    })

    const hashed = await bcryptDialect.hash('hello-world', 10)
    assert.isTrue(bcrypt.needsReHash(hashed))
  })

  test('throw error when value is not a valid phc string', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      rounds: 10,
    })

    await assert.rejects(
      () => bcrypt.needsReHash('hello world'),
      'pchstr must contain a $ as first char'
    )
  })

  test('return true when not a valid bcrypt identifier', async ({ assert }) => {
    const bcrypt = new Bcrypt({
      rounds: 10,
    })

    const hash = '$argon2id$v=98$r=10$Jtxi46WJ26OQ0khsYLLlnw$knXGfuRFsSjXdj88JydPOnUIglvm1S8'
    assert.isTrue(bcrypt.needsReHash(hash))
  })
})

test.group('argon | isValidHash', () => {
  test('check if value formatted as a valid bcrypt hash', ({ assert }) => {
    const bcrypt = new Bcrypt({
      version: 98,
    })

    const hash = '$bcrypt$v=98$r=10$Jtxi46WJ26OQ0khsYLLlnw$knXGfuRFsSjXdj88JydPOnUIglvm1S8'

    assert.isTrue(bcrypt.isValidHash(hash))

    /**
     * Non versionized hashes are allowed
     */
    assert.isTrue(bcrypt.isValidHash(hash.replace('$v=98', '')))

    assert.isFalse(bcrypt.isValidHash('hello world'))
    assert.isFalse(bcrypt.isValidHash(hash.replace('$r=10', '')))
  })
})
