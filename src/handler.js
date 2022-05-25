import { parse } from 'node:url'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { routes } from './routes/heroRoute.js'
import { DEFAULT_HEADER } from './util/util.js'
import { generateInstance } from './factories/heroFactory.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const filePath = join(currentDir, '../database', 'data.json')

const heroService = generateInstance({ filePath })
const heroRoutes = routes({ heroService })

const allRoutes = {
  ...heroRoutes,
  default: (_, response) => {
    response.writeHead(404, DEFAULT_HEADER)
    response.write(JSON.stringify({ error: 'not found' }))
    return response.end()
  },
}

const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
const UUID_LENGTH = 36

function handler(request, response) {
  const { url, method } = request
  const { pathname } = parse(url, true)

  let routePath = pathname
  const pos = pathname.search(UUID_REGEX)
  if (pos > 0) {
    const id = pathname.substring(pos, pos + UUID_LENGTH)
    request.id = id
    routePath = pathname.replace(`/${id}`, '')
  }
  const key = `${routePath}:${method.toLowerCase()}`

  const chosen = allRoutes[key] || allRoutes['default']
  return Promise.resolve(chosen(request, response)).catch(
    handlerError(response)
  )
}

function handlerError(response) {
  return (error) => {
    console.log('Something bas has happened', error.stack)
    response.writeHead(500, DEFAULT_HEADER)
    response.write(JSON.stringify({ error: 'internal server error' }))
    return response.end()
  }
}

export default handler
