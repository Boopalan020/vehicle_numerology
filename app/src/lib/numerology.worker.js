// Runs the range calculation off the main thread (design doc §7). Pulls from
// iterateRange one number at a time and posts results back in chunks, so a
// large range (up to ~9,000 rows for 1000–9999) neither freezes the tab nor
// waits for the entire range to finish before the UI can show anything.
import { iterateRange } from './numerology.js'

const CHUNK_SIZE = 250

self.onmessage = (event) => {
  const { series, from, to, requestId } = event.data
  try {
    let chunk = []
    for (const result of iterateRange(series, from, to)) {
      chunk.push(result)
      if (chunk.length >= CHUNK_SIZE) {
        self.postMessage({ type: 'chunk', requestId, results: chunk })
        chunk = []
      }
    }
    if (chunk.length > 0) {
      self.postMessage({ type: 'chunk', requestId, results: chunk })
    }
    self.postMessage({ type: 'done', requestId })
  } catch (err) {
    self.postMessage({ type: 'error', requestId, code: err.message })
  }
}
