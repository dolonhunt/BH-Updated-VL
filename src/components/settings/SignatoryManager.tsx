'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X, Star, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { SignatoryProfile } from '@/lib/settings-store'
import { FLAT_DOC_TYPES } from '@/components/layout/Sidebar'

interface SignatoryManagerProps {
  signatories: SignatoryProfile[]
  onAdd: (s: Omit<SignatoryProfile, 'id'>) => void
  onUpdate: (id: string, data: Partial<SignatoryProfile>) => void
  onDelete: (id: string) => void
}

export function SignatoryManager({ signatories, onAdd, onUpdate, onDelete }: SignatoryManagerProps) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', designation: '', department: '', isPrimary: false, docTypes: [] as string[] })

  const resetForm = () => setForm({ name: '', designation: '', department: '', isPrimary: false, docTypes: [] })

  const handleAdd = () => {
    if (!form.name.trim() || !form.designation.trim()) {
      toast.error('Name and designation are required')
      return
    }
    const isPrimary = signatories.length === 0 || form.isPrimary
    if (isPrimary) {
      signatories.forEach(s => onUpdate(s.id, { isPrimary: false }))
    }
    onAdd({ name: form.name.trim(), designation: form.designation.trim(), department: form.department.trim(), isPrimary, docTypes: form.docTypes })
    resetForm()
    setAdding(false)
    toast.success('Signatory added')
  }

  const handleUpdate = (id: string) => {
    if (!form.name.trim() || !form.designation.trim()) {
      toast.error('Name and designation are required')
      return
    }
    if (form.isPrimary) {
      signatories.forEach(s => onUpdate(s.id, { isPrimary: false }))
    }
    onUpdate(id, { name: form.name.trim(), designation: form.designation.trim(), department: form.department.trim(), isPrimary: form.isPrimary, docTypes: form.docTypes })
    setEditingId(null)
    resetForm()
    toast.success('Signatory updated')
  }

  const startEdit = (s: SignatoryProfile) => {
    setEditingId(s.id)
    setForm({ name: s.name, designation: s.designation, department: s.department, isPrimary: s.isPrimary, docTypes: [...s.docTypes] })
    setAdding(false)
  }

  const toggleDocType = (docType: string) => {
    setForm(prev => ({
      ...prev,
      docTypes: prev.docTypes.includes(docType)
        ? prev.docTypes.filter(d => d !== docType)
        : [...prev.docTypes, docType],
    }))
  }

  const editing = editingId || (adding ? 'new' : null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage signing authorities for documents. Assign signatories to specific document types or leave empty for all.</p>
        {!editing && (
          <Button size="sm" variant="outline" onClick={() => { setAdding(true); resetForm() }}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Signatory
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {editing && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" className="h-8 text-xs bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Designation *</Label>
                <Input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="e.g. HR Director" className="h-8 text-xs bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="e.g. HR" className="h-8 text-xs bg-white" />
              </div>
            </div>

            {/* Primary toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPrimary} onChange={e => setForm(p => ({ ...p, isPrimary: e.target.checked }))} className="rounded" />
                <span className="text-xs font-medium">Set as primary signatory</span>
              </label>
              <span className="text-[10px] text-muted-foreground">(Primary is used as fallback for all documents)</span>
            </div>

            {/* DocType assignment */}
            <div className="space-y-1.5">
              <Label className="text-xs">Assign to document types (leave empty for all)</Label>
              <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 border rounded bg-white">
                {FLAT_DOC_TYPES.map(doc => (
                  <button
                    key={doc.key}
                    type="button"
                    onClick={() => toggleDocType(doc.key)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      form.docTypes.includes(doc.key)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white text-muted-foreground border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>
              {form.docTypes.length > 0 && (
                <p className="text-[10px] text-muted-foreground">{form.docTypes.length} doc type(s) assigned</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button size="sm" onClick={adding ? handleAdd : () => editingId && handleUpdate(editingId)}>
                <Check className="w-3.5 h-3.5 mr-1" /> {adding ? 'Add' : 'Update'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setEditingId(null); resetForm() }}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signatory list */}
      {signatories.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">No signatories configured</p>
          <p className="text-xs mt-1">Add a signatory to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {signatories.map(s => (
            <Card key={s.id} className={`${s.isPrimary ? 'border-amber-200 bg-amber-50/30' : ''}`}>
              <CardContent className="p-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${s.isPrimary ? 'bg-amber-500' : 'bg-gray-400'}`}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                    {s.isPrimary && <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-amber-300 text-amber-700 bg-amber-50"><Star className="w-2.5 h-2.5 mr-0.5" />Primary</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.designation}{s.department ? `, ${s.department}` : ''}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {s.docTypes.length === 0 ? (
                      <span className="text-[9px] text-blue-500 font-medium">All document types</span>
                    ) : (
                      s.docTypes.slice(0, 6).map(dt => (
                        <Badge key={dt} variant="secondary" className="text-[9px] h-4 px-1.5">{dt.replace(/_/g, ' ')}</Badge>
                      ))
                    )}
                    {s.docTypes.length > 6 && (
                      <span className="text-[9px] text-muted-foreground">+{s.docTypes.length - 6} more</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(s)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-blue-50 text-blue-500" title="Edit"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => { onDelete(s.id); toast.success('Signatory deleted') }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-red-400" title="Delete"><Trash2 className="w-3 h-3" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
