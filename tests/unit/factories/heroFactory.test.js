import test from 'node:test'
import assert from 'node:assert'
import { generateInstance } from '../../../src/factories/heroFactory.js'
import HeroService from '../../../src/services/heroService.js'

test('Hero factories - factories test suite', async (t) => {
  await t.test('it should generate a heroService instance', () => {
    const generatedInstance = generateInstance({
      filePath: 'filePath',
    })
    assert.equal(generatedInstance instanceof HeroService, true)
  })
})
