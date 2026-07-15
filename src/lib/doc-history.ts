export interface DocHistoryEntry {
  id: string
  docType: string
  employeeName: string
  employeeId: string
  label: string
  timestamp: number
  fileName: string
}

const HISTORY_KEY = 'bh_doc_history'
const MAX_ENTRIES = 50

export function getDocHistory(): DocHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addDocHistory(entry: DocHistoryEntry) {
  const history = getDocHistory()
  history.unshift(entry)
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function clearDocHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
