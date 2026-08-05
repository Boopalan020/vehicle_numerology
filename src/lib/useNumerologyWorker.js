import { useCallback, useEffect, useRef } from 'react'
import NumerologyWorker from './numerology.worker.js?worker'

// Drives numerology.worker.js from a component. Returns a single `calculate`
// function; each call gets its own request id so that if the user clicks
// Calculate again before a previous (large) range finishes, the stale
// request's chunks are silently dropped instead of racing the new one.
export function useNumerologyWorker() {
  const workerRef = useRef(null)
  const latestRequestId = useRef(0)
  const callbacksRef = useRef(new Map())

  useEffect(() => {
    const worker = new NumerologyWorker()
    worker.onmessage = (event) => {
      const { type, requestId, results, code } = event.data
      if (requestId !== latestRequestId.current) return // superseded by a newer request

      const callbacks = callbacksRef.current.get(requestId)
      if (!callbacks) return

      if (type === 'chunk') {
        callbacks.onChunk(results)
      } else if (type === 'done') {
        callbacks.onDone()
        callbacksRef.current.delete(requestId)
      } else if (type === 'error') {
        callbacks.onError(code)
        callbacksRef.current.delete(requestId)
      }
    }
    workerRef.current = worker
    return () => worker.terminate()
  }, [])

  const calculate = useCallback((series, from, to, { onChunk, onDone, onError }) => {
    const requestId = ++latestRequestId.current
    callbacksRef.current.set(requestId, { onChunk, onDone, onError })
    workerRef.current.postMessage({ series, from, to, requestId })
  }, [])

  return calculate
}
