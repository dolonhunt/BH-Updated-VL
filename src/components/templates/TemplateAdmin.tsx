'use client'

import { useState, useEffect, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { extractTemplateVars } from '@/lib/template-vars'
import { getAllTemplates } from '@/lib/templates'
import { TEMPLATES } from '@/lib/templates/template-registry'
import { Search, Copy, Check, FileCode, Tag, FolderOpen, Hash } from 'lucide-react'

export function TemplateAdmin() {
  const [templates, setTemplates] = useState<{ key: string; html: string }[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTemplates(getAllTemplates())
  }, [])

  const selectedTemplate = templates.find(t => t.key === selectedKey)
  const selectedMeta = selectedKey ? TEMPLATES.find(t => t.key === selectedKey) : null
  const selectedVars = selectedTemplate ? extractTemplateVars(selectedTemplate.html) : []

  const filtered = TEMPLATES.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.key.toLowerCase().includes(search.toLowerCase())
  )

  const handleCopy = useCallback(() => {
    if (!selectedTemplate) return
    navigator.clipboard.writeText(selectedTemplate.html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedTemplate])

  return (
    <div className="flex-1 flex overflow-hidden bg-bg-slate">
      {/* Left Panel — Template List */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-gray-100 bg-white">
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <div className="mt-2 text-[11px] text-gray-400 font-medium">
            {filtered.length} template{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-1">
            {filtered.map(t => {
              const isActive = t.key === selectedKey
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedKey(t.key)}
                  className={`w-full text-left px-3 py-2.5 transition-colors border-l-[3px] ${
                    isActive
                      ? 'bg-brand-red/8 border-l-brand-red'
                      : 'border-l-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium leading-tight ${isActive ? 'text-brand-red' : 'text-gray-800'}`}>
                    {t.label}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{t.key}</div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-8 text-center text-sm text-gray-400">
                No templates match your search
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel — Template Source */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedTemplate && selectedMeta ? (
          <>
            {/* Metadata Bar */}
            <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="font-mono text-xs">{selectedMeta.key}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FolderOpen className="w-4 h-4 text-gray-400" />
                <span>{selectedMeta.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Hash className="w-4 h-4 text-gray-400" />
                <span>{selectedVars.length} variable{selectedVars.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs gap-1.5"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Source</>
                  )}
                </Button>
              </div>
            </div>

            {/* Variable List */}
            {selectedVars.length > 0 && (
              <div className="flex items-center gap-1.5 px-6 py-2 border-b border-gray-100 bg-gray-50/50 flex-shrink-0 overflow-x-auto">
                <FileCode className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {selectedVars.map(v => (
                  <span
                    key={v.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-white border border-gray-200 text-gray-600 whitespace-nowrap"
                    title={`${v.name} — used ${v.count} time${v.count !== 1 ? 's' : ''}`}
                  >
                    {v.name}
                    <span className="text-[10px] text-gray-400">({v.count})</span>
                  </span>
                ))}
              </div>
            )}

            {/* HTML Source */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <pre className="text-xs leading-relaxed font-mono bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all">
                  <code>{selectedTemplate.html}</code>
                </pre>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FileCode className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Select a template to view its source</p>
              <p className="text-xs mt-1">Choose a template from the left panel</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
