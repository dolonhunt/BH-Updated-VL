'use client'

import { useEffect } from 'react'
import { FileText } from 'lucide-react'
import { setPreviewData } from '@/lib/preview-store'

interface PolicyDocFormProps {
  docType: string
  label: string
  description: string
}

export function PolicyDocForm({ docType, label, description }: PolicyDocFormProps) {
  useEffect(() => {
    setPreviewData(docType, {})
  }, [docType])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-bg/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-brand-bg" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">{label}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground space-y-2">
        <p>This is a standardized company policy document. It will be generated with the current company information and approved signatories.</p>
        <p className="text-xs">The document preview will appear on the right. Use the toolbar above to export as PDF, DOCX, or print.</p>
      </div>
    </div>
  )
}
