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

  await t.todo('it should call /heroes:post route')
})
