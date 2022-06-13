import test from 'node:test'
import assert from 'node:assert'

import { routes } from '../../../src/routes/heroRoute.js'
import { DEFAULT_HEADER } from '../../../src/util/util.js'

const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

test('Hero routes - endpoints test suite', async (t) => {
  await t.test('it should call /heroes:get route', async () => {
    const databaseMock = [
      {
        id: 'heroId',
        name: 'heroName',
        age: 18,
        power: 'heroPower',
      },
    ]
    const heroServiceStub = {
      find: async () => databaseMock,
    }
    const request = {}
    const response = {
      writeHead: callTracker.calls((status, contentType) => {
        assert.strictEqual(status, 200)
        assert.deepStrictEqual(contentType, DEFAULT_HEADER)
      }),
      write: callTracker.calls((item) => {
        const expected = JSON.stringify({
          results: databaseMock,
        })
        assert.strictEqual(
          item,
          expected,
          'write should be called with the correct payload'
        )
      }),
      end: callTracker.calls((item) => {
        assert.strictEqual(
          item,
          undefined,
          'end should be called without params'
        )
      }),
    }

    const endpoints = routes({ heroService: heroServiceStub })
    await endpoints['/heroes:get'](request, response)
  })

  // t.todo('it should call /heroes:post route')
  // t.todo('it should call /heroes:put route')

  await t.test('it should call /heroes:delete route', async (t) => {
    await t.test(
      'it should return not found on call /heroes:delete with invalid id',
      async () => {
        const heroServiceStub = {
          findById: async (id) => null,
        }
        const request = { id: 'invalidId' }
        const response = {
          writeHead: callTracker.calls((status, contentType) => {
            assert.strictEqual(status, 404)
            assert.deepStrictEqual(contentType, DEFAULT_HEADER)
          }),
          write: callTracker.calls((item) => {
            const expected = JSON.stringify({ error: 'Hero does not exist' })
            assert.strictEqual(item, expected)
          }),
          end: callTracker.calls((item) => {
            assert.strictEqual(item, undefined)
          }),
        }

        const endpoints = routes({ heroService: heroServiceStub })
        await endpoints['/heroes:delete'](request, response)
      }
    )

    await t.test(
      'it should return no content on call /heroes:delete with success',
      async () => {
        const databaseMock = [
          {
            id: 'heroId',
            name: 'heroName',
            age: 18,
            power: 'heroPower',
          },
        ]
        const heroServiceStub = {
          findById: async (id) => databaseMock,
          delete: async (id) => {},
        }
        const request = { id: 'heroId' }
        const response = {
          writeHead: callTracker.calls((status) => {
            assert.strictEqual(status, 204)
          }),
          end: callTracker.calls((item) => {
            assert.strictEqual(item, undefined)
          }),
        }

        const endpoints = routes({ heroService: heroServiceStub })
        await endpoints['/heroes:delete'](request, response)
      }
    )
  })
})
