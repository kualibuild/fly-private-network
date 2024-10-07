import process from 'node:process'
import http from 'node:http'
import events from 'node:events'
import crypto from 'node:crypto'

const { PORT = '8080' } = process.env
const port = parseInt(PORT, 10)

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write('ok-start\n')
  setTimeout(() => {
    res.end('ok-end\n')
  }, crypto.randomInt(5000) + 500)
})

server.keepAliveTimeout = 60000

await events.once(server.listen(port), `Listening on port ${port}`)
