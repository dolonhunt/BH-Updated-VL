'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Save, GitBranch, Trash2, Clock, Download, ChevronDown, FolderOpen,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export interface TemplateVersion {
  id: string
  name: string
  docType: string
  overrides: Record<string, any>
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'tbh_template_versions'

function loadVersions(): TemplateVersion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveVersions(versions: TemplateVersion[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(versions))
}

interface VersionManagerProps {
  docType: string
  currentOverrides: Record<string, any>
  onLoadVersion: (overrides: Record<string, any>) => void
}

export default function VersionManager({
  docType,
  currentOverrides,
  onLoadVersion,
}: VersionManagerProps) {
  const [versions, setVersions] = useState<TemplateVersion[]>(() => loadVersions())
  const [open, setOpen] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Filter versions for current doc type
  const docVersions = versions.filter(v => v.docType === docType)

  const handleSave = useCallback(() => {
    if (!saveName.trim()) return

    const existing = versions.find(
      v => v.docType === docType && v.name.toLowerCase() === saveName.trim().toLowerCase()
    )

    let updated: TemplateVersion[]
    if (existing) {
      // Update existing version
      updated = versions.map(v =>
        v.id === existing.id
          ? { ...v, overrides: { ...currentOverrides }, updatedAt: new Date().toISOString() }
          : v
      )
    } else {
      // Create new version
      const newVersion: TemplateVersion = {
        id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: saveName.trim(),
        docType,
        overrides: { ...currentOverrides },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      updated = [...versions, newVersion]
    }

    saveVersions(updated)
    setVersions(updated)
    setSaving(true)
    setTimeout(() => setSaving(false), 800)
    setSaveName('')
    toast({ title: 'Version Saved', description: `"${saveName.trim()}" saved successfully.` })
  }, [saveName, versions, docType, currentOverrides, toast])

  const handleLoad = useCallback((version: TemplateVersion) => {
    onLoadVersion(version.overrides)
    setOpen(false)
    toast({ title: 'Version Loaded', description: `"${version.name}" applied.` })
  }, [onLoadVersion, toast])

  const handleDelete = useCallback((id: string) => {
    const updated = versions.filter(v => v.id !== id)
    saveVersions(updated)
    setVersions(updated)
    toast({ title: 'Version Deleted', description: 'The template version has been removed.' })
  }, [versions, toast])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <GitBranch className="w-3.5 h-3.5" />
          <span>Versions</span>
          {docVersions.length > 0 && (
            <span className="ml-0.5 w-4 h-4 rounded-full bg-gray-200 text-[9px] font-bold flex items-center justify-center text-gray-600">
              {docVersions.length}
            </span>
          )}
          <ChevronDown className="w-2.5 h-2.5 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Save Section */}
        <div className="p-3 border-b border-gray-100">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Save Current as Version</p>
          <div className="flex gap-1.5">
            <Input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Version name..."
              className="h-7 text-[11px]"
            />
            <Button
              onClick={handleSave}
              disabled={!saveName.trim()}
              size="sm"
              className="h-7 text-[11px] gap-1 px-3"
            >
              {saving ? (
                <span className="text-green-600">✓ Saved</span>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Saved Versions */}
        <div className="max-h-64 overflow-y-auto">
          {docVersions.length === 0 ? (
            <div className="p-6 text-center">
              <FolderOpen className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-[11px] text-gray-400">No saved versions yet</p>
              <p className="text-[10px] text-gray-300">Save your current settings as a version</p>
            </div>
          ) : (
            <div className="py-1">
              {docVersions.map(version => (
                <div
                  key={version.id}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-[12px] font-medium text-gray-800 truncate">
                          {version.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 ml-[18px]">
                        <Clock className="w-2.5 h-2.5 text-gray-300" />
                        <span className="text-[9px] text-gray-400">
                          {formatDate(version.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleLoad(version)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-50 text-blue-500"
                        title="Load this version"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(version.id)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-red-400"
                        title="Delete this version"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
