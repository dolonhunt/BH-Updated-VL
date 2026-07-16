'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Trash2, Search, FileText, ArrowRight } from 'lucide-react'
import { getDocHistory, clearDocHistory, type DocHistoryEntry } from '@/lib/doc-history'
import { FLAT_DOC_TYPES } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { View } from '@/components/layout/Sidebar'

interface DocumentHistoryProps {
  onNavigate: (view: View) => void
}

function getLabel(docType: string): string {
  const found = FLAT_DOC_TYPES.find(d => d.key === docType)
  return found?.label ?? docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDateGroup(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekStart = new Date(today)
  weekStart.setDate(weekStart.getDate() - today.getDay())

  if (date >= today) return 'Today'
  if (date >= yesterday) return 'Yesterday'
  if (date >= weekStart) return 'This Week'
  return 'Earlier'
}

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier']

export function DocumentHistory({ onNavigate }: DocumentHistoryProps) {
  const [entries, setEntries] = useState<DocHistoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    setEntries(getDocHistory())
    const handler = () => setEntries(getDocHistory())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return entries
    return entries.filter(e =>
      getLabel(e.docType).toLowerCase().includes(q) ||
      e.employeeName.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  const grouped = useMemo(() => {
    const map: Record<string, DocHistoryEntry[]> = {}
    for (const entry of filtered) {
      const group = formatDateGroup(entry.timestamp)
      if (!map[group]) map[group] = []
      map[group].push(entry)
    }
    const result: [string, DocHistoryEntry[]][] = []
    for (const key of GROUP_ORDER) {
      if (map[key]) {
        map[key].sort((a, b) => b.timestamp - a.timestamp)
        result.push([key, map[key]])
      }
    }
    return result
  }, [filtered])

  const handleClear = () => {
    clearDocHistory()
    setEntries([])
    setConfirmClear(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-brand-bg">Document History</h1>
              <p className="text-muted-foreground mt-1">
                {entries.length === 0
                  ? 'No document history yet'
                  : `${entries.length} document${entries.length !== 1 ? 's' : ''} generated`
                }
              </p>
            </div>
            {entries.length > 0 && (
              <div>
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600 font-medium">Are you sure?</span>
                    <Button variant="destructive" size="sm" onClick={handleClear}>
                      Yes, Clear All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setConfirmClear(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmClear(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear History
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {entries.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by document type, employee name, or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-red/50 focus:ring-0"
            />
          </div>
        )}

        {/* Empty state - no history */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">No History Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Documents you generate will appear here for quick access.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => onNavigate('dashboard')}>
              Go to Dashboard
            </Button>
          </motion.div>
        )}

        {/* Empty state - no results */}
        {entries.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">No Results</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search query.
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="space-y-6">
            {grouped.map(([group, groupEntries]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {group}
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    ({groupEntries.length})
                  </span>
                </h3>
                <div className="space-y-2">
                  {groupEntries.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:bg-accent hover:border-brand-bg/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-bg/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-brand-bg" />
                      </div>
                      <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getLabel(entry.docType)}</p>
                          <p className="text-xs text-muted-foreground">Document Type</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">{entry.employeeName}</p>
                          <p className="text-xs text-muted-foreground">Employee Name</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{entry.employeeId}</p>
                          <p className="text-xs text-muted-foreground">Employee ID</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-700">
                            {new Date(entry.timestamp).toLocaleDateString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString(undefined, {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate(entry.docType as View)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-brand-bg hover:text-brand-bg hover:bg-brand-bg/10"
                      >
                        Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
