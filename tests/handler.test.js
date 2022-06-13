import test from 'node:test'
import assert from 'node:assert'

import handler from '../src/handler.js'
import { DEFAULT_HEADER } from '../src/util/util.js'

const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

test('Handler - routes', async (t) => {
  await t.test('it should return not found on inexistent route', async () => {
    const request = {
      url: '/url_not_found',
      method: 'GET',
    }
    const response = {
      writeHead: callTracker.calls((status, contentType) => {
        assert.strictEqual(status, 404)
        assert.deepStrictEqual(contentType, DEFAULT_HEADER)
      }),
      write: callTracker.calls((item) => {
        const expected = JSON.stringify({ error: 'not found' })
        assert.strictEqual(item, expected)
      }),
      end: callTracker.calls((params) => {
        assert.strictEqual(params, undefined)
      }),
    }

    await handler(request, response)
  })

  await t.test(
    'it should extract UUID from route path, add it to request',
    async () => {
      const request = {
        url: '/heroes/aceaa425-7769-4ad7-af6b-422d25f23be9',
        method: 'PUT',
        body: JSON.stringify({
          name: 'heroName',
          age: 1,
          power: 'heroPower',
        }),
      }

      // this should not be empty. Empty functions will mask handleError test in coverage
      const response = {
        writeHead: () => {},
        write: () => {},
        end: () => {},
      }

      await handler(request, response)
      assert.strictEqual(request.id, 'aceaa425-7769-4ad7-af6b-422d25f23be9')
    }
  )
})
