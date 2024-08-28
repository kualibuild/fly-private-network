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
