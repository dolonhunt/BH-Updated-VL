'use client'

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { MismatchField, MismatchAction } from '@/lib/mismatch'

interface MismatchModalProps {
  open: boolean
  onClose: () => void
  mismatches: MismatchField[]
  onAction: (action: MismatchAction) => void
}

export function MismatchModal({ open, onClose, mismatches, onAction }: MismatchModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-600">Data Mismatch Detected</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="mb-3">The following fields differ from the employee master record:</p>
              <div className="space-y-1.5 text-sm">
                {mismatches.map(m => (
                  <div key={m.key} className="flex justify-between bg-amber-50 px-3 py-1.5 rounded border border-amber-200">
                    <span className="font-medium text-gray-700">{m.label}</span>
                    <span className="text-amber-700">Form: {String(m.formValue)} → Master: {String(m.masterValue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onAction('use_master')} className="bg-blue-600 text-white hover:bg-blue-700">
            Use Master Data
          </AlertDialogAction>
          <AlertDialogAction onClick={() => onAction('update_and_generate')} className="bg-amber-600 text-white hover:bg-amber-700">
            Update Employee & Generate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
