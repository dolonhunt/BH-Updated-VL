'use client'

import { useState, useCallback, useEffect } from 'react'

export interface DocVersion {
  id: string
  docType: string
  label: string
  formData: Record<string, any>
  timestamp: number
  html?: string
}

const STORAGE_KEY = 'bh_hr_doc_versions'
const MAX_VERSIONS = 20

function loadVersions(): DocVersion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useDocVersioning() {
  const [versions, setVersions] = useState<DocVersion[]>(() => loadVersions())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions))
  }, [versions])

  const saveVersion = useCallback((docType: string, formData: Record<string, any>, label?: string) => {
    const newVersion: DocVersion = {
      id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      docType,
      label: label || `Snapshot ${new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`,
      formData: { ...formData },
      timestamp: Date.now(),
    }
    setVersions(prev => {
      const updated = [newVersion, ...prev]
      return updated.slice(0, MAX_VERSIONS)
    })
  }, [])

  const restoreVersion = useCallback((versionId: string): DocVersion | undefined => {
    return versions.find(v => v.id === versionId)
  }, [versions])

  const deleteVersion = useCallback((versionId: string) => {
    setVersions(prev => prev.filter(v => v.id !== versionId))
  }, [])

  const clearVersions = useCallback(() => {
    setVersions([])
  }, [])

  return { versions, saveVersion, restoreVersion, deleteVersion, clearVersions }
}
