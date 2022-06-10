import test from 'node:test'
import assert from 'node:assert'
import Hero from '../../../src/entities/hero.js'

const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/

test('Hero factories - factories test suite', async (t) => {
  await t.test('it should generate a hero instance', () => {
    const heroData = {
      name: 'heroName',
      age: 1,
      power: 'heroPower',
    }

    const hero = new Hero(heroData)
    const uuid = hero.id.match(UUID_REGEX)[0] // first element is a full match
    assert.equal(hero instanceof Hero, true)
    assert.strictEqual(uuid, hero.id)
    assert.strictEqual(hero.name, 'heroName')
    assert.strictEqual(hero.age, 1)
    assert.strictEqual(hero.power, 'heroPower')
  })
})
