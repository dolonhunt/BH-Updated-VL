'use client'

import { useState, useMemo } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { FLAT_DOC_TYPES } from '@/components/layout/Sidebar'
import type { LetterheadConfig } from '@/lib/settings-store'

interface LetterheadSettingsProps {
  letterheads: Record<string, LetterheadConfig>
  globalHeaderStyle: 'default' | 'minimal'
  globalFooterStyle: 'default' | 'minimal'
  onSetLetterhead: (docType: string, config: LetterheadConfig) => void
  onRemoveLetterhead: (docType: string) => void
  onSetGlobalHeaderStyle: (style: 'default' | 'minimal') => void
  onSetGlobalFooterStyle: (style: 'default' | 'minimal') => void
}

const DEFAULT_LETTERHEAD: LetterheadConfig = {
  headerEnabled: true,
  footerEnabled: true,
  headerStyle: 'default',
  footerStyle: 'default',
}

export function LetterheadSettings({
  letterheads,
  globalHeaderStyle,
  globalFooterStyle,
  onSetLetterhead,
  onRemoveLetterhead,
  onSetGlobalHeaderStyle,
  onSetGlobalFooterStyle,
}: LetterheadSettingsProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>('')
  const [config, setConfig] = useState<LetterheadConfig>({ ...DEFAULT_LETTERHEAD })

  const currentConfig = selectedDoc ? letterheads[selectedDoc] : null

  const handleSelect = (docType: string) => {
    setSelectedDoc(docType)
    setConfig(letterheads[docType] ? { ...letterheads[docType] } : { ...DEFAULT_LETTERHEAD })
  }

  const handleSave = () => {
    if (!selectedDoc) return
    onSetLetterhead(selectedDoc, { ...config })
    toast.success(`Letterhead saved for "${FLAT_DOC_TYPES.find(d => d.key === selectedDoc)?.label || selectedDoc}"`)
  }

  const handleReset = () => {
    if (!selectedDoc) return
    onRemoveLetterhead(selectedDoc)
    setConfig({ ...DEFAULT_LETTERHEAD })
    toast.success('Letterhead reset to global defaults')
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Customize header and footer per document type. Changes apply to the selected document only.</p>

      {/* Global defaults */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Global Defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Default Header Style</Label>
            <Select value={globalHeaderStyle} onValueChange={(v: 'default' | 'minimal') => onSetGlobalHeaderStyle(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default" className="text-xs">Full (Logo + Rule)</SelectItem>
                <SelectItem value="minimal" className="text-xs">Minimal (Rule only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Default Footer Style</Label>
            <Select value={globalFooterStyle} onValueChange={(v: 'default' | 'minimal') => onSetGlobalFooterStyle(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default" className="text-xs">Full (Address + Pin)</SelectItem>
                <SelectItem value="minimal" className="text-xs">Minimal (Page number only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Per-doc-type customization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Per-Document Override</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Select Document Type</Label>
            <Select value={selectedDoc} onValueChange={handleSelect}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Choose a document type..." />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {FLAT_DOC_TYPES.map(doc => (
                  <SelectItem key={doc.key} value={doc.key} className="text-xs">{doc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDoc && (
            <>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <Switch checked={config.headerEnabled} onCheckedChange={v => setConfig(p => ({ ...p, headerEnabled: v }))} />
                  <Label className="text-xs cursor-pointer">Show Header</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={config.footerEnabled} onCheckedChange={v => setConfig(p => ({ ...p, footerEnabled: v }))} />
                  <Label className="text-xs cursor-pointer">Show Footer</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Header Style</Label>
                  <Select value={config.headerStyle} onValueChange={(v: 'default' | 'minimal') => setConfig(p => ({ ...p, headerStyle: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default" className="text-xs">Full (Logo + Rule)</SelectItem>
                      <SelectItem value="minimal" className="text-xs">Minimal (Rule only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Footer Style</Label>
                  <Select value={config.footerStyle} onValueChange={(v: 'default' | 'minimal') => setConfig(p => ({ ...p, footerStyle: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default" className="text-xs">Full (Address + Pin)</SelectItem>
                      <SelectItem value="minimal" className="text-xs">Minimal (Page number only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Custom Footer Address (optional)</Label>
                <Input
                  value={config.footerAddress || ''}
                  onChange={e => setConfig(p => ({ ...p, footerAddress: e.target.value }))}
                  placeholder="Leave empty to use company address"
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" onClick={handleSave}>Save Override</Button>
                {currentConfig && (
                  <Button size="sm" variant="outline" onClick={handleReset} className="text-red-500 border-red-200 hover:bg-red-50">
                    Reset to Defaults
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Summary of active overrides */}
      {Object.keys(letterheads).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Overrides ({Object.keys(letterheads).length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(letterheads).map(([dt, lh]) => (
                <div key={dt} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-gray-50 text-xs">
                  <span className="text-muted-foreground">{FLAT_DOC_TYPES.find(d => d.key === dt)?.label || dt}</span>
                  <span className="text-[9px] text-muted-foreground">|</span>
                  <span className="text-[9px]">{lh.headerEnabled ? 'H' : 'h'}{lh.headerStyle === 'minimal' ? '↓' : '='}/{lh.footerEnabled ? 'F' : 'f'}{lh.footerStyle === 'minimal' ? '↓' : '='}</span>
                  <button onClick={() => { onRemoveLetterhead(dt); toast.success('Override removed') }} className="ml-0.5 text-red-300 hover:text-red-500">&times;</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
