import process from 'node:process'
import http from 'node:http'
import events from 'node:events'
import crypto from 'node:crypto'
import timers from 'node:timers/promises'
import axios from 'axios'

const { PORT = '8080', FLYCAST_ORIGIN } = process.env
const port = parseInt(PORT, 10)
const PARALLEL_CALLS = 1000
const JITTER = 100
const DELAY = 1000

let errorCount = 0
let totalCount = 0

async function start() {
  while (true) {
    const promises = Array.from({ length: PARALLEL_CALLS }).map(async () => {
      await timers.setTimeout(crypto.randomInt(JITTER))
      await axios.get(FLYCAST_ORIGIN)
    })
    const results = await Promise.allSettled(promises)
    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason)
    errorCount += errors.length
    totalCount += results.length
    for (const error of errors) console.error(error)
    await timers.setTimeout(DELAY)
  }
}
start()

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  console.log('error:', errorCount, 'total:', totalCount)
  res.end('ok')
})

await events.once(server.listen(port), `Listening on port ${port}`)
