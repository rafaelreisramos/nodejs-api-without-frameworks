import test from 'node:test'
import assert from 'node:assert'
import HeroService from '../../../src/services/heroService.js'

const callTracker = new assert.CallTracker()
process.on('exit', () => callTracker.verify())

test('Hero services - services test suite', async (t) => {
  await t.test('it should call heroRepository.find without any params', () => {
    const heroRepositoryStub = {
      find: callTracker.calls((item) => {
        assert.strictEqual(item, undefined)
      }),
    }

    const heroService = new HeroService({
      heroRepository: heroRepositoryStub,
    })
    heroService.find()
  })

  await t.test('it should call heroRepository.findById with an id', () => {
    const heroRepositoryStub = {
      findById: callTracker.calls((id) => {
        assert.strictEqual(id, 'id')
      }),
    }

    const heroService = new HeroService({
      heroRepository: heroRepositoryStub,
    })
    heroService.findById('id')
  })

  await t.test('it should call heroRepository.findByName with a name', () => {
    const heroRepositoryStub = {
      findByName: callTracker.calls((name) => {
        assert.strictEqual(name, 'name')
      }),
    }

    const heroService = new HeroService({
      heroRepository: heroRepositoryStub,
    })
    heroService.findByName('name')
  })

  await t.test('it should call heroRepository.create with data object', () => {
    const data = {
      name: 'name',
      age: 1,
      power: 'power',
    }

    const heroRepositoryStub = {
      create: callTracker.calls((data) => {
        assert.deepStrictEqual(data, {
          name: 'name',
          age: 1,
          power: 'power',
        })
      }),
    }

    const heroService = new HeroService({
      heroRepository: heroRepositoryStub,
    })
    heroService.create(data)
  })

  await t.test(
    'it should call heroRepository.update with an id and an update object',
    () => {
      const dataToUpdate = {
        name: 'updatedName',
        age: 10,
        power: 'updatedPower',
      }

      const heroRepositoryStub = {
        update: callTracker.calls((id, data) => {
          assert.strictEqual(id, 'id')
          assert.deepStrictEqual(data, {
            name: 'updatedName',
            age: 10,
            power: 'updatedPower',
          })
        }),
      }

      const heroService = new HeroService({
        heroRepository: heroRepositoryStub,
      })
      heroService.update('id', dataToUpdate)
    }
  )

  await t.test('it should call heroRepository.delete with an id', () => {
    const heroRepositoryStub = {
      delete: callTracker.calls((id) => {
        assert.strictEqual(id, 'id')
      }),
    }

    const heroService = new HeroService({
      heroRepository: heroRepositoryStub,
    })
    heroService.delete('id')
  })
})
