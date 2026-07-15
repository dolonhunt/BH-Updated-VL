'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, ArrowDown, ArrowUp, Replace } from 'lucide-react'

interface FindReplaceProps {
  onFind: (query: string) => number
  onReplace: (query: string, replacement: string, replaceAll: boolean) => number
  onClearHighlights: () => void
  onClose: () => void
}

export default function FindReplace({
  onFind,
  onReplace,
  onClearHighlights,
  onClose,
}: FindReplaceProps) {
  const [query, setQuery] = useState('')
  const [replacement, setReplacement] = useState('')
  const [matchCount, setMatchCount] = useState(0)
  const [showReplace, setShowReplace] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleFind = useCallback(() => {
    if (!query.trim()) {
      onClearHighlights()
      setMatchCount(0)
      return
    }
    const count = onFind(query.trim())
    setMatchCount(count)
  }, [query, onFind, onClearHighlights])

  const handleReplaceOne = useCallback(() => {
    if (!query.trim()) return
    const count = onReplace(query.trim(), replacement, false)
    if (count > 0) {
      handleFind() // Re-find to update highlights
    }
  }, [query, replacement, onReplace, handleFind])

  const handleReplaceAll = useCallback(() => {
    if (!query.trim()) return
    const count = onReplace(query.trim(), replacement, true)
    setMatchCount(0)
  }, [query, replacement, onReplace])

  // Auto-find on query change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleFind()
      } else {
        onClearHighlights()
        setMatchCount(0)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, handleFind, onClearHighlights])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      onClearHighlights()
    }
  }, [onClearHighlights])

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-80 animate-in slide-in-from-top-1 duration-150">
      {/* Find Row */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFind()}
            placeholder="Find in document..."
            className="h-7 text-[11px] pl-7 pr-2"
          />
        </div>
        <span className="text-[10px] text-gray-400 min-w-[40px] text-center">
          {matchCount > 0 ? `${matchCount} found` : ''}
        </span>
        <button
          onClick={() => setShowReplace(!showReplace)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400"
          title="Toggle Replace"
        >
          <Replace className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Replace Row */}
      {showReplace && (
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex-1">
            <Input
              value={replacement}
              onChange={e => setReplacement(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReplaceOne()}
              placeholder="Replace with..."
              className="h-7 text-[11px]"
            />
          </div>
          <Button
            onClick={handleReplaceOne}
            disabled={!query.trim()}
            variant="outline"
            size="sm"
            className="h-7 text-[10px] px-2"
          >
            Replace
          </Button>
          <Button
            onClick={handleReplaceAll}
            disabled={!query.trim()}
            variant="outline"
            size="sm"
            className="h-7 text-[10px] px-2"
          >
            All
          </Button>
        </div>
      )}
    </div>
  )
}
