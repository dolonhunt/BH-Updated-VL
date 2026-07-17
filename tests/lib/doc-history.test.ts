import { describe, it, expect, beforeEach } from 'vitest'
import {
  getDocHistory,
  addDocHistory,
  clearDocHistory,
  type DocHistoryEntry,
} from '@/lib/doc-history'

function makeEntry(overrides: Partial<DocHistoryEntry> = {}): DocHistoryEntry {
  return {
    id: 'id-1',
    docType: 'payslip',
    employeeName: 'John Doe',
    employeeId: 'EMP1',
    label: 'Pay Slip',
    timestamp: Date.now(),
    fileName: 'payslip.pdf',
    ...overrides,
  }
}

describe('doc-history', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty array when nothing is stored', () => {
    expect(getDocHistory()).toEqual([])
  })

  it('adds entries and returns them newest-first', () => {
    addDocHistory(makeEntry({ id: 'a' }))
    addDocHistory(makeEntry({ id: 'b' }))
    const history = getDocHistory()
    expect(history.map((e) => e.id)).toEqual(['b', 'a'])
  })

  it('caps the history at 50 entries', () => {
    for (let i = 0; i < 55; i++) {
      addDocHistory(makeEntry({ id: `id-${i}` }))
    }
    const history = getDocHistory()
    expect(history).toHaveLength(50)
    // newest entry retained, oldest dropped
    expect(history[0].id).toBe('id-54')
    expect(history.some((e) => e.id === 'id-0')).toBe(false)
  })

  it('clears the history', () => {
    addDocHistory(makeEntry())
    clearDocHistory()
    expect(getDocHistory()).toEqual([])
  })

  it('returns an empty array when stored JSON is corrupt', () => {
    localStorage.setItem('bh_doc_history', '{not valid json')
    expect(getDocHistory()).toEqual([])
  })
})
