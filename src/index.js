import { createServer } from './server/server.js'

const server = await createServer()
await server.start()
console.log(`Prototype running at ${server.info.uri}`)

process.on('SIGINT', async () => {
  await server.stop()
  process.exit(0)
})
