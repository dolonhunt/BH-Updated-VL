'use client'

import { useCallback, useSyncExternalStore } from 'react'

export interface SignatoryProfile {
  id: string
  name: string
  designation: string
  department: string
  isPrimary: boolean
  docTypes: string[]
}

export interface LetterheadConfig {
  headerEnabled: boolean
  footerEnabled: boolean
  logoOverride?: string
  headerStyle: 'default' | 'minimal'
  footerAddress?: string
  footerStyle: 'default' | 'minimal'
}

export interface AppSettings {
  signatories: SignatoryProfile[]
  letterheads: Record<string, LetterheadConfig>
  globalLogo: string
  globalHeaderStyle: 'default' | 'minimal'
  globalFooterStyle: 'default' | 'minimal'
}

const STORAGE_KEY = 'bh_hr_app_settings'

const DEFAULTS: AppSettings = {
  signatories: [
    {
      id: 'default_primary',
      name: 'Saqib Ahmed',
      designation: 'Proprietor',
      department: 'Management',
      isPrimary: true,
      docTypes: [],
    },
  ],
  letterheads: {},
  globalLogo: '',
  globalHeaderStyle: 'default',
  globalFooterStyle: 'default',
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppSettings>
      return { ...DEFAULTS, ...parsed }
    }
  } catch { /* ignore */ }
  return { ...DEFAULTS }
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

let cachedSettings: AppSettings | null = null
const listeners = new Set<() => void>()

function getSnapshot(): AppSettings {
  if (!cachedSettings) cachedSettings = loadSettings()
  return cachedSettings
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function notify() {
  cachedSettings = null
  listeners.forEach(cb => cb())
}

export function useAppSettings() {
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULTS)

  const updateSettings = useCallback((updater: (prev: AppSettings) => AppSettings) => {
    const current = loadSettings()
    const next = updater(current)
    saveSettings(next)
    notify()
  }, [])

  const addSignatory = useCallback((s: Omit<SignatoryProfile, 'id'>) => {
    updateSettings(prev => ({
      ...prev,
      signatories: [...prev.signatories, { ...s, id: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 6)}` }],
    }))
  }, [updateSettings])

  const updateSignatory = useCallback((id: string, data: Partial<SignatoryProfile>) => {
    updateSettings(prev => ({
      ...prev,
      signatories: prev.signatories.map(s => s.id === id ? { ...s, ...data } : s),
    }))
  }, [updateSettings])

  const deleteSignatory = useCallback((id: string) => {
    updateSettings(prev => ({
      ...prev,
      signatories: prev.signatories.filter(s => s.id !== id),
    }))
  }, [updateSettings])

  const setLetterhead = useCallback((docType: string, config: LetterheadConfig) => {
    updateSettings(prev => ({
      ...prev,
      letterheads: { ...prev.letterheads, [docType]: config },
    }))
  }, [updateSettings])

  const removeLetterhead = useCallback((docType: string) => {
    updateSettings(prev => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [docType]: _unused, ...rest } = prev.letterheads
      return { ...prev, letterheads: rest }
    })
  }, [updateSettings])

  const setGlobalLogo = useCallback((logo: string) => {
    updateSettings(prev => ({ ...prev, globalLogo: logo }))
  }, [updateSettings])

  const setGlobalHeaderStyle = useCallback((style: 'default' | 'minimal') => {
    updateSettings(prev => ({ ...prev, globalHeaderStyle: style }))
  }, [updateSettings])

  const setGlobalFooterStyle = useCallback((style: 'default' | 'minimal') => {
    updateSettings(prev => ({ ...prev, globalFooterStyle: style }))
  }, [updateSettings])

  const getSignatoryForDocType = useCallback((docType: string): SignatoryProfile => {
    const match = settings.signatories.find(
      s => s.docTypes.length === 0 || s.docTypes.includes(docType)
    )
    return match || settings.signatories[0] || DEFAULTS.signatories[0]
  }, [settings])

  const getLetterheadForDocType = useCallback((docType: string): LetterheadConfig | undefined => {
    return settings.letterheads[docType]
  }, [settings])

  return {
    settings,
    addSignatory,
    updateSignatory,
    deleteSignatory,
    setLetterhead,
    removeLetterhead,
    setGlobalLogo,
    setGlobalHeaderStyle,
    setGlobalFooterStyle,
    getSignatoryForDocType,
    getLetterheadForDocType,
  }
}

export function getSettingsSnapshot(): AppSettings {
  return getSnapshot()
}
