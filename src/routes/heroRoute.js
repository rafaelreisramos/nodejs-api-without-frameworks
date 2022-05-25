import { once } from 'node:events'

import Hero from '../entities/hero.js'
import { DEFAULT_HEADER } from '../util/util.js'

const routes = ({ heroService }) => ({
  '/heroes:get': async (request, response) => {
    const heroes = await heroService.find()
    response.writeHead(200, DEFAULT_HEADER)
    response.write(JSON.stringify({ results: heroes }))
    return response.end()
  },

  '/heroes:post': async (request, response) => {
    const data = await once(request, 'data')
    const item = JSON.parse(data)

    const { name } = item
    const hasHero = await heroService.findByName(name)
    if (hasHero) {
      response.writeHead(400, DEFAULT_HEADER)
      response.write(JSON.stringify({ error: 'Hero already exist' }))
      return response.end()
    }

    const hero = new Hero(item)
    const id = await heroService.create(hero)
    response.writeHead(201, DEFAULT_HEADER)
    response.write(
      JSON.stringify({
        id,
        success: 'Hero created with success',
      })
    )
    return response.end()
  },

  '/heroes:put': async (request, response) => {
    const { id } = request
    const data = await once(request, 'data')
    const item = JSON.parse(data)

    let hero = await heroService.findById(id)
    if (!hero) {
      response.writeHead(404, DEFAULT_HEADER)
      response.write(JSON.stringify({ error: 'Hero does not exist' }))
      return response.end()
    }

    hero = await heroService.update(id, item)
    response.writeHead(200, DEFAULT_HEADER)
    response.write(
      JSON.stringify({ hero, success: 'Hero updated with success' })
    )
    return response.end()
  },

  '/heroes:delete': async (request, response) => {
    const { id } = request

    const hero = await heroService.findById(id)
    if (!hero) {
      response.writeHead(404, DEFAULT_HEADER)
      response.write(JSON.stringify({ error: 'Hero does not exist' }))
      return response.end()
    }

    await heroService.delete(id)
    response.writeHead(204)
    return response.end()
  },
})

export { routes }
