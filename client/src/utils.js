export function runForever(func) {
  const ac = new AbortController()
  async function run() {
    while (!ac.signal.aborted) {
      await func()
    }
  }
  const promise = run()
  return () => {
    ac.abort()
    return promise
  }
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
