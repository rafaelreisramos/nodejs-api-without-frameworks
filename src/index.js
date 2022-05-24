import http from 'node:http'
import handler from './handler.js'

const PORT = process.env.PORT || 3000

const server = http.createServer(handler)

server.listen(PORT, () => console.info(`Server is running at ${PORT}`))

export { server }
