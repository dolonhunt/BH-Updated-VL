'use client'
import { useState, useEffect } from 'react'
import { FileText, ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDocHistory, type DocHistoryEntry } from '@/lib/doc-history'
import type { Employee } from '@/lib/storage'
import type { View } from '@/components/layout/Sidebar'

interface EmployeeDocsViewProps {
  employee: Employee
  onBack: () => void
  onNavigateToDoc: (view: View) => void
}

export function EmployeeDocsView({ employee, onBack, onNavigateToDoc }: EmployeeDocsViewProps) {
  const [docs, setDocs] = useState<DocHistoryEntry[]>([])

  useEffect(() => {
    const all = getDocHistory()
    setDocs(all.filter(d => d.employeeId === employee.ref_code || d.employeeName === employee.name))
  }, [employee])

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">{employee.name}</h2>
            <p className="text-sm text-muted-foreground">
              {employee.designation} · {employee.department} · {employee.ref_code}
            </p>
          </div>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-base font-medium mb-1">No documents generated yet</h3>
            <p className="text-sm text-muted-foreground">
              Generate a document for this employee to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map(doc => (
              <div
                key={doc.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-4"
              >
                <FileText className="w-5 h-5 text-brand-bg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{doc.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.timestamp).toLocaleString()} · {doc.fileName}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToDoc(doc.docType as View)}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Regenerate
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
