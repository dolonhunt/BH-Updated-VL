'use client'
import { useState, useEffect } from 'react'
import { Users, FileText, UserPlus, List, LayoutDashboard, ArrowRight, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAllEmployees } from '@/lib/use-employees'
import { View, CATEGORIES } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { getDocHistory, type DocHistoryEntry } from '@/lib/doc-history'

interface DashboardProps {
  onNavigate: (view: View) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const raw = useAllEmployees()
  const employees = Array.isArray(raw) ? raw : []
  const employeeCount = employees.length
  const [recentDocs, setRecentDocs] = useState<DocHistoryEntry[]>([])

  useEffect(() => {
    setRecentDocs(getDocHistory().slice(0, 8))
    const handler = () => setRecentDocs(getDocHistory().slice(0, 8))
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const flatDocTypes = CATEGORIES.flatMap(cat => cat.items)
  const docTypeCount = flatDocTypes.length
  const todayCount = recentDocs.filter(d => {
    const dDate = new Date(d.timestamp)
    const now = new Date()
    return dDate.toDateString() === now.toDateString()
  }).length

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-brand-bg">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to BH HR DocuGen — generate HR documents in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="rounded-xl border bg-card p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-bg/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-bg" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employeeCount}</p>
              <p className="text-sm text-muted-foreground">Employees</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-xl border bg-card p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-bg/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-bg" />
            </div>
            <div>
              <p className="text-2xl font-bold">{docTypeCount}</p>
              <p className="text-sm text-muted-foreground">Document Types</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-xl border bg-card p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-bg/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-brand-bg" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayCount || '—'}</p>
              <p className="text-sm text-muted-foreground">Docs Generated Today</p>
            </div>
          </motion.div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onNavigate('employees')}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Employee
            </Button>
            <Button variant="outline" onClick={() => onNavigate('employee_list')}>
              <List className="w-4 h-4 mr-2" /> View Employees
            </Button>
          </div>
        </div>

        {recentDocs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Recent Documents</h2>
            <div className="space-y-2">
              {recentDocs.map(doc => (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onNavigate(doc.docType as View)}
                  className="w-full flex items-center gap-3 rounded-lg border bg-card p-3 text-left hover:bg-accent hover:border-brand-bg/30 transition-all group"
                >
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{doc.employeeName} · {new Date(doc.timestamp).toLocaleString()}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-3">Document Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {CATEGORIES.map(cat =>
              cat.items.map(item => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onNavigate(item.key as View)}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3 text-left hover:bg-accent hover:border-brand-bg/30 transition-all group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
