/*
 * @adonisjs/hash
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { PhcFormatter } from '../src/phc_formatter.js'

test.group('Phc formatter', () => {
  test('serialize salt and hash as a phc string', ({ assert }) => {
    const formatter = new PhcFormatter()

    const salt = 'iHSDPHzUhPzK7rCcJgOFfg'
    const hash =
      'J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g'

    const options = {
      id: 'argon2i',
      version: 19,
      params: {
        m: 120,
        t: 5000,
        p: 2,
      },
    }

    const output = formatter.serialize(
      Buffer.from(salt, 'base64'),
      Buffer.from(hash, 'base64'),
      options
    )

    assert.equal(output, `$argon2i$v=19$m=120,t=5000,p=2$${salt}$${hash}`)
  })

  test('serialize salt and hash as a phc string without params', ({ assert }) => {
    const formatter = new PhcFormatter()

    const salt = 'iHSDPHzUhPzK7rCcJgOFfg'
    const hash =
      'J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g'

    const options = {
      id: 'argon2i',
      version: 19,
    }

    const output = formatter.serialize(
      Buffer.from(salt, 'base64'),
      Buffer.from(hash, 'base64'),
      options
    )

    assert.equal(output, `$argon2i$v=19$${salt}$${hash}`)
  })

  test('serialize salt and hash as a phc string without version', ({ assert }) => {
    const formatter = new PhcFormatter()

    const salt = 'iHSDPHzUhPzK7rCcJgOFfg'
    const hash =
      'J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g'

    const options = {
      id: 'argon2i',
      params: {
        m: 120,
        t: 5000,
        p: 2,
      },
    }

    const output = formatter.serialize(
      Buffer.from(salt, 'base64'),
      Buffer.from(hash, 'base64'),
      options
    )
    assert.equal(output, `$argon2i$m=120,t=5000,p=2$${salt}$${hash}`)
  })

  test('deserialize phc string', ({ assert }) => {
    const formatter = new PhcFormatter()

    const salt = 'iHSDPHzUhPzK7rCcJgOFfg'
    const hash =
      'J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g'

    const options = {
      id: 'argon2i',
      version: 19,
      params: {
        m: 120,
        t: 5000,
        p: 2,
      },
    }

    const output = formatter.serialize(
      Buffer.from(salt, 'base64'),
      Buffer.from(hash, 'base64'),
      options
    )

    assert.deepEqual(formatter.deserialize(output), {
      id: 'argon2i',
      version: 19,
      params: {
        m: 120,
        t: 5000,
        p: 2,
      },
      salt: Buffer.from(salt, 'base64'),
      hash: Buffer.from(hash, 'base64'),
    })
  })

  test('deserialize phc string with version', ({ assert }) => {
    const formatter = new PhcFormatter()

    const salt = 'iHSDPHzUhPzK7rCcJgOFfg'
    const hash =
      'J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g'

    const options = {
      id: 'argon2i',
      params: {
        m: 120,
        t: 5000,
        p: 2,
      },
    }

    const output = formatter.serialize(
      Buffer.from(salt, 'base64'),
      Buffer.from(hash, 'base64'),
      options
    )

    assert.deepEqual(formatter.deserialize(output), {
      id: 'argon2i',
      params: {
        m: 120,
        t: 5000,
        p: 2,
      },
      salt: Buffer.from(salt, 'base64'),
      hash: Buffer.from(hash, 'base64'),
    })
  })

  test('deserialize phc string without params', ({ assert }) => {
    const formatter = new PhcFormatter()

    const salt = 'iHSDPHzUhPzK7rCcJgOFfg'
    const hash =
      'J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g'

    const options = { id: 'argon2i' }

    const output = formatter.serialize(
      Buffer.from(salt, 'base64'),
      Buffer.from(hash, 'base64'),
      options
    )

    assert.deepEqual(formatter.deserialize(output), {
      id: 'argon2i',
      salt: Buffer.from(salt, 'base64'),
      hash: Buffer.from(hash, 'base64'),
    })
  })

  test('raise error when phc string is not valid', ({ assert }) => {
    const formatter = new PhcFormatter()
    assert.throws(
      () => formatter.deserialize('hello world'),
      'pchstr must contain a $ as first char'
    )
  })
})
