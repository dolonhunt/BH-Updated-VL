'use client'
import { useState } from 'react'
import { EmployeeListView } from './EmployeeListView'
import { EmployeeFormView } from './EmployeeFormView'
import { EmployeeDocsView } from './EmployeeDocsView'
import type { View } from '@/components/layout/Sidebar'
import { useAllEmployees } from '@/lib/use-employees'

type ModuleView = 'list' | 'form' | 'docs'

interface EmployeeModuleProps {
  route: string
  onNavigate?: (view: View) => void
}

export function EmployeeModule({ route, onNavigate }: EmployeeModuleProps) {
  const [view, setView] = useState<ModuleView>(route === 'employees-add' ? 'form' : 'list')
  const [editId, setEditId] = useState<string | null>(null)
  const [docsEmployeeId, setDocsEmployeeId] = useState<string | null>(null)

  const raw = useAllEmployees()
  const employees = Array.isArray(raw) ? raw : []

  const docsEmployee = docsEmployeeId ? employees.find(e => e.id === docsEmployeeId) || null : null

  const handleEdit = (id: string) => { setEditId(id); setView('form') }
  const handleAddNew = () => { setEditId(null); setView('form') }
  const handleCancel = () => { setView('list'); setEditId(null) }
  const handleSaved = () => { setView('list'); setEditId(null) }
  const handleViewDocs = (id: string) => { setDocsEmployeeId(id); setView('docs') }

  if (view === 'form') {
    return <EmployeeFormView employeeId={editId} onCancel={handleCancel} onSaved={handleSaved} />
  }

  if (view === 'docs' && docsEmployee) {
    return (
      <EmployeeDocsView
        employee={docsEmployee}
        onBack={() => setView('list')}
        onNavigateToDoc={(v) => onNavigate?.(v)}
      />
    )
  }

  return <EmployeeListView onEdit={handleEdit} onAddNew={handleAddNew} onViewDocs={handleViewDocs} />
}
