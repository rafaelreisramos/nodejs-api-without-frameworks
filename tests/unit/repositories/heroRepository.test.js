import test from 'node:test'
import assert from 'node:assert'

import { routes } from '../../../src/routes/heroRoute.js'
import { DEFAULT_HEADER } from '../../../src/util/util.js'
import HeroRepository from '../../../src/repositories/heroRepository.js'

const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

test('Hero repository - database test suite', async (t) => {
  await t.test('it should return all heroes from database', () => {
    const heroRepositoryMock = new HeroRepository({ file: 'file.txt' })
    const databaseMock = [
      {
        id: '1',
        name: 'hero_1',
        age: 1,
        power: 'power_1',
      },
      {
        id: '2',
        name: 'hero_2',
        age: 2,
        power: 'power_2',
      },
    ]

    heroRepositoryMock.find = () => databaseMock
    const heroes = heroRepositoryMock.find()
    assert.deepStrictEqual(heroes, databaseMock)
  })
})
