import { useSyncExternalStore } from 'react'

export interface PreviewData {
  docType: string
  formData: Record<string, any>
  isDirty?: boolean
  hasManualEdits?: boolean
}

let snapshot: PreviewData | null = null
const listeners = new Set<() => void>()

function emitChange() { listeners.forEach(l => l()) }

export function setPreviewData(
  docType: string,
  formData: Record<string, any>,
  isDirty: boolean = false,
  hasManualEdits: boolean = false
) {
  snapshot = { docType, formData, isDirty, hasManualEdits }
  emitChange()
}

export function setPreviewDirty(isDirty: boolean) {
  if (snapshot) {
    snapshot = { ...snapshot, isDirty }
    emitChange()
  }
}

export function setPreviewHasManualEdits(hasManualEdits: boolean) {
  if (snapshot) {
    snapshot = { ...snapshot, hasManualEdits, isDirty: hasManualEdits }
    emitChange()
  }
}

export function setHasManualEdits(value: boolean) {
  setPreviewHasManualEdits(value)
}

export function getHasManualEdits(): boolean {
  return snapshot?.hasManualEdits || false
}

export function useHasManualEdits(): boolean {
  const preview = usePreviewData()
  return preview?.hasManualEdits || false
}

export function clearPreviewData() {
  snapshot = null
  emitChange()
}

export function getPreviewData(): PreviewData | null { return snapshot }

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function getServerSnapshot(): PreviewData | null { return null }

export function usePreviewData(): PreviewData | null {
  return useSyncExternalStore(subscribe, getPreviewData, getServerSnapshot)
}
