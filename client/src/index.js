import process from 'node:process'
import http from 'node:http'
import events from 'node:events'
import crypto from 'node:crypto'
import axios from 'axios'
import { wait, runForever } from './utils.js'

const { PORT = '8080', FLYCAST_ORIGIN } = process.env
const port = parseInt(PORT, 10)

function createCaller(origin, { delay = 0, parallel = 1, jitter = 100 } = {}) {
  let errorCount = 0
  let totalCount = 0
  const stop = runForever(async () => {
    const promises = Array.from({ length: parallel }).map(async () => {
      const id = crypto.randomUUID()
      await wait(crypto.randomInt(jitter))
      await axios.get(origin, { headers: { 'X-Request-Id': id } })
    })
    const results = await Promise.allSettled(promises)
    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason)
    errorCount += errors.length
    totalCount += results.length
    for (const error of errors) console.error(error)
    await wait(delay)
  })
  return {
    get stats() {
      return { errorCount, totalCount }
    },
    stop
  }
}

const flycast = createCaller(FLYCAST_ORIGIN + '/flycast', {
  delay: 1000,
  parallel: 100
})

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  const status = {
    flycast: flycast.stats
  }
  console.log('error:', flycast.errorCount, 'total:', flycast.totalCount)
  res.end(JSON.stringify(status))
})

await events.once(server.listen(port), `Listening on port ${port}`)

async function stop() {
  await Promise.all([flycast.stop()])
  server.closeIdleConnections()
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve(null)
    })
  })
}

let called = false
function shutdown() {
  if (called) return
  called = true
  stop()
    .then(() => process.exit())
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
process.once('SIGUSR2', shutdown)
