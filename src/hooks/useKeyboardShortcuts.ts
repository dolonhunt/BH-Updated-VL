'use client'

import { useEffect } from 'react'

export interface KeyboardShortcutOptions {
  editor: { undo?: () => void; redo?: () => void }
  onGenerate?: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({
  editor,
  onGenerate,
  enabled = true,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    if (!enabled) return

    const down = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      const shift = e.shiftKey

      if (meta && !shift && e.key === 'Enter') {
        e.preventDefault()
        if (onGenerate) {
          onGenerate()
        } else {
          const btn = document.querySelector<HTMLButtonElement>('button[class*="bg-brand-red"]:not([disabled])')
          btn?.click()
        }
        return
      }

      if (meta && !shift && e.key === 'z') {
        e.preventDefault()
        editor.undo?.()
        return
      }

      if (meta && shift && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault()
        editor.redo?.()
        return
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [editor, onGenerate, enabled])
}
