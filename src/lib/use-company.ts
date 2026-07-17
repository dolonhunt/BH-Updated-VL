import { useSyncExternalStore } from 'react'
import { toast } from 'sonner'
import { type CompanyConfig } from './storage'
import { authHeaders } from './api-client'

let cached: CompanyConfig | null = null
let fetchPromise: Promise<CompanyConfig> | null = null
const listeners = new Set<() => void>()

const DEFAULT_COMPANY: CompanyConfig = {
  name: '',
  address: '',
  phone: '',
  email: '',
  proprietor_name: '',
  proprietor_designation: '',
  brand_color: '#FF2109',
  logo_path: '/Logo-main.png'
}

function getSnapshot(): CompanyConfig {
  if (cached === null) {
    if (!fetchPromise && typeof window !== 'undefined') {
      fetchPromise = fetch('/api/company', { headers: authHeaders() })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch company config')
          return res.json()
        })
        .then(data => {
          cached = data && typeof data === 'object' ? data : DEFAULT_COMPANY
          return cached as CompanyConfig
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err)
          toast.error('Failed to load company settings. Using defaults.', { id: 'company-load-error' })
          cached = DEFAULT_COMPANY
          return cached as CompanyConfig
        })
        .finally(() => {
          fetchPromise = null
          listeners.forEach(l => l())
        })
    }
    return DEFAULT_COMPANY
  }
  return cached
}

const SERVER_SNAPSHOT: CompanyConfig = DEFAULT_COMPANY
function getServerSnapshot(): CompanyConfig { return SERVER_SNAPSHOT }

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function invalidateCompanyCache() {
  cached = null
  listeners.forEach(l => l())
}

export function useCompany(): CompanyConfig {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

