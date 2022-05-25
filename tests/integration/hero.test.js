import test from 'node:test'
import assert from 'node:assert'
import { promisify } from 'node:util'

test('Hero Integration Test Suite', async (t) => {
  const testPort = 9009
  // that's bad practice because it mutates the environment
  process.env.PORT = testPort
  const { server } = await import('../../src/index.js')
  const testServerAddress = `http://localhost:${testPort}/heroes`

  await t.test('it should create a hero', async () => {
    const data = {
      name: 'Batman',
      age: 50,
      power: 'rich',
    }

    const request = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const result = await request.json()

    assert.strictEqual(request.headers.get('content-type'), 'application/json')
    assert.strictEqual(request.status, 201)
    assert.strictEqual(result.success, 'Hero created with success')
    assert.ok(result.id.length > 30, 'id should be a valid uuid')

    // cleanup database - must find another solution for this
    // test database?
    await fetch(`${testServerAddress}/${result.id}`, {
      method: 'DELETE',
    })
  })

  await t.test('it should get all heroes', async () => {
    const data = [
      {
        name: 'Flash',
        age: 50,
        power: 'speed',
      },
      {
        name: 'Ironman',
        age: 60,
        power: 'tech',
      },
    ]

    let postRequest = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data[0]),
    })
    const { id: firstId } = await postRequest.json()

    postRequest = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data[1]),
    })
    const { id: secondId } = await postRequest.json()

    const request = await fetch(testServerAddress)
    const result = await request.json()

    console.log(result.results)
    assert.strictEqual(request.headers.get('content-type'), 'application/json')
    assert.strictEqual(request.status, 200)
    assert.deepStrictEqual(result.results, [
      {
        id: firstId,
        name: 'Flash',
        age: 50,
        power: 'speed',
      },
      {
        id: secondId,
        name: 'Ironman',
        age: 60,
        power: 'tech',
      },
    ])
    assert.ok(result.results.length === 2)

    // cleanup database - must find another solution for this
    // test database?
    await fetch(`${testServerAddress}/${firstId}`, {
      method: 'DELETE',
    })
    await fetch(`${testServerAddress}/${secondId}`, {
      method: 'DELETE',
    })
  })

  await t.test('it should not create a hero if already exist', async () => {
    const data = {
      name: 'Batman',
      age: 50,
      power: 'rich',
    }

    const postRequest = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const { id } = await postRequest.json()

    const request = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const result = await request.json()

    assert.strictEqual(request.headers.get('content-type'), 'application/json')
    assert.strictEqual(request.status, 400)
    assert.strictEqual(result.error, 'Hero already exist')

    // cleanup database - must find another solution for this
    // test database?
    await fetch(`${testServerAddress}/${id}`, {
      method: 'DELETE',
    })
  })

  await t.test('it should update a hero', async () => {
    const data = {
      name: 'heroNameToBeUpdated',
      age: 50,
      power: 'heroPower',
    }

    const postRequest = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const { id } = await postRequest.json()

    const updateHero = {
      name: 'updatedHeroName',
    }
    const request = await fetch(`${testServerAddress}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateHero),
    })
    const result = await request.json()

    assert.strictEqual(request.headers.get('content-type'), 'application/json')
    assert.strictEqual(request.status, 200)
    assert.strictEqual(result.success, 'Hero updated with success')
    assert.deepStrictEqual(
      result.hero,
      {
        id,
        name: 'updatedHeroName',
        age: 50,
        power: 'heroPower',
      },
      'it should be equal to updated hero'
    )

    // cleanup database - must find another solution for this
    // test database?
    await fetch(`${testServerAddress}/${id}`, {
      method: 'DELETE',
    })
  })

  await t.test(
    'it should answer with 404 if hero was not found for update',
    async () => {
      const fakeId = 'cccccccc-aaaa-4444-aaaa-eeeeeeeeeeee'
      const updateHero = {
        name: 'updatedHeroName',
      }
      const request = await fetch(`${testServerAddress}/${fakeId}`, {
        method: 'PUT',
        body: JSON.stringify(updateHero),
      })
      const result = await request.json()

      assert.strictEqual(
        request.headers.get('content-type'),
        'application/json'
      )
      assert.strictEqual(request.status, 404)
      assert.strictEqual(result.error, 'Hero does not exist')
    }
  )

  await t.test('it should delete a hero', async () => {
    const data = {
      name: 'heroToDeleted',
      age: 50,
      power: 'heroPower',
    }

    const postRequest = await fetch(testServerAddress, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const { id } = await postRequest.json()

    const request = await fetch(`${testServerAddress}/${id}`, {
      method: 'DELETE',
    })

    assert.strictEqual(request.status, 204)
  })

  await t.test(
    'it should answer with 404 if hero was not found for delete',
    async () => {
      const fakeId = 'cccccccc-aaaa-4444-aaaa-eeeeeeeeeeee'
      const request = await fetch(`${testServerAddress}/${fakeId}`, {
        method: 'DELETE',
      })
      const result = await request.json()

      assert.strictEqual(
        request.headers.get('content-type'),
        'application/json'
      )
      assert.strictEqual(request.status, 404)
      assert.strictEqual(result.error, 'Hero does not exist')
    }
  )

  await t.test('it should answer with 404 if route not found', async () => {
    const request = await fetch(`${testServerAddress}/inexistent-route`)
    const result = await request.json()

    assert.strictEqual(request.headers.get('content-type'), 'application/json')
    assert.strictEqual(request.status, 404)
    assert.strictEqual(result.error, 'not found')
  })

  await promisify(server.close.bind(server))()
})
