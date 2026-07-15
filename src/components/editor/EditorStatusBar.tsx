'use client'

import { FileText, Type, Hash, Save } from 'lucide-react'
import type { EditorCounts } from '@/hooks/useEditorBridge'

interface EditorStatusBarProps {
  counts: EditorCounts
  docType: string
  isEditorReady: boolean
  lastSaved?: string | null
}

export default function EditorStatusBar({
  counts,
  docType,
  isEditorReady,
  lastSaved,
}: EditorStatusBarProps) {
  return (
    <div className="h-6 bg-gray-50 border-t border-gray-200 flex items-center px-3 gap-4 flex-shrink-0">
      {/* Page Info */}
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
        <FileText className="w-3 h-3" />
        <span className="capitalize">{docType.replace(/_/g, ' ')}</span>
      </div>

      <div className="w-px h-3 bg-gray-200" />

      {/* Word Count */}
      <div className="flex items-center gap-1 text-[10px] text-gray-400">
        <Type className="w-3 h-3" />
        <span>{isEditorReady ? `${counts.words} words` : '—'}</span>
      </div>

      <div className="w-px h-3 bg-gray-200" />

      {/* Character Count */}
      <div className="flex items-center gap-1 text-[10px] text-gray-400">
        <Hash className="w-3 h-3" />
        <span>{isEditorReady ? `${counts.characters} chars` : '—'}</span>
      </div>

      {/* Right side: Auto-save indicator */}
      <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-400">
        {isEditorReady && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Editable</span>
          </div>
        )}
        {lastSaved && (
          <>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1">
              <Save className="w-2.5 h-2.5" />
              <span>Last saved {lastSaved}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
