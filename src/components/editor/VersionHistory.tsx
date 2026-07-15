'use client'

import { Clock, RotateCcw, Trash2, History, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { DocVersion } from '@/hooks/useDocVersioning'

interface VersionHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  versions: DocVersion[]
  currentDocType: string
  onRestore: (version: DocVersion) => void
  onDelete: (versionId: string) => void
  onClearAll: () => void
}

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export function VersionHistory({
  open,
  onOpenChange,
  versions,
  currentDocType,
  onRestore,
  onDelete,
  onClearAll,
}: VersionHistoryProps) {
  const docVersions = versions.filter(v => v.docType === currentDocType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-4 h-4" /> Version History
          </DialogTitle>
          <DialogDescription>
            {docVersions.length > 0
              ? `${docVersions.length} snapshot${docVersions.length !== 1 ? 's' : ''} for this document type`
              : 'No snapshots saved yet'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto -mx-6 px-6">
          {docVersions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <History className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No version snapshots</p>
              <p className="text-xs mt-1">Use the Versions button in the header to save snapshots</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {docVersions.map(version => (
                <div
                  key={version.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{version.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-[11px] text-gray-400">{relativeTime(version.timestamp)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onRestore(version)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-50 text-blue-500"
                      title="Restore this version"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(version.id)}
                      className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-red-400"
                      title="Delete this version"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {docVersions.length > 0 && (
          <DialogFooter className="border-t border-gray-100 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Clear all version snapshots for this document type?')) {
                  onClearAll()
                }
              }}
              className="text-red-500 border-red-200 hover:bg-red-50 gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Clear All
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
