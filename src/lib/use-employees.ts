import { useSyncExternalStore } from 'react'
import { type Employee } from './storage'

let cached: Employee[] | null = null
let fetchPromise: Promise<Employee[]> | null = null
let cacheVersion = 0
const listeners = new Set<() => void>()

const EMPTY_ARRAY: Employee[] = []

function getSnapshot(): Employee[] {
  if (cached === null) {
    if (!fetchPromise && typeof window !== 'undefined') {
      fetchPromise = fetch('/api/employees')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch employees')
          return res.json()
        })
        .then(data => {
          cached = Array.isArray(data) ? data : []
          return cached
        })
        .catch(err => {
          console.error(err)
          cached = []
          return cached
        })
        .finally(() => {
          fetchPromise = null
          listeners.forEach(l => l())
        })
    }
    return EMPTY_ARRAY
  }
  return cached
}

function getServerSnapshot(): Employee[] { return EMPTY_ARRAY }

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function invalidateEmployeeCache() {
  cached = null
  cacheVersion++
  listeners.forEach(l => l())
}

export function useAllEmployees(): Employee[] {
  // Access cacheVersion to ensure re-render when cache is invalidated
  void cacheVersion
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

