'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { CATEGORIES } from '@/components/layout/Sidebar'
import { useAllEmployees } from '@/lib/use-employees'
import { authHeaders } from '@/lib/api-client'
import { addDocHistory } from '@/lib/doc-history'
import { toast } from 'sonner'
import {
  Loader2, CheckCircle, XCircle, Download, FileText, Layers, Users, FileType
} from 'lucide-react'

interface BatchResult {
  employeeId: string
  employeeName: string
  docType: string
  docLabel: string
  status: 'success' | 'error'
  error?: string
  html?: string
  pdfBlobUrl?: string
  fileName?: string
}

function docLabel(key: string): string {
  for (const cat of CATEGORIES) {
    const item = cat.items.find(i => i.key === key)
    if (item) return item.label
  }
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function BatchGenerator() {
  const employees = useAllEmployees()
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<BatchResult[]>([])
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [downloadLoading, setDownloadLoading] = useState<Record<string, boolean>>({})
  const pdfUrlsRef = useRef<string[]>([])

  const totalCombinations = selectedEmployees.length * selectedDocTypes.length

  useEffect(() => {
    return () => {
      pdfUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const toggleDocType = (key: string) => {
    setSelectedDocTypes(prev =>
      prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
    )
  }

  const selectAllEmployees = () => {
    setSelectedEmployees(employees.map(e => e.id))
  }

  const deselectAllEmployees = () => {
    setSelectedEmployees([])
  }

  const selectAllDocTypes = () => {
    const all = CATEGORIES.flatMap(c => c.items.map(i => i.key))
    setSelectedDocTypes(all)
  }

  const deselectAllDocTypes = () => {
    setSelectedDocTypes([])
  }

  const generateBatch = useCallback(async () => {
    if (totalCombinations === 0) return

    setGenerating(true)
    setResults([])
    setProgress({ current: 0, total: totalCombinations })

    const combos: Array<{ employeeId: string; employeeName: string; docType: string }> = []
    for (const empId of selectedEmployees) {
      const emp = employees.find(e => e.id === empId)
      const name = emp?.name || empId
      for (const dt of selectedDocTypes) {
        combos.push({ employeeId: empId, employeeName: name, docType: dt })
      }
    }

    const newResults: BatchResult[] = []
    let index = 0
    const queue = [...combos]

    const processNext = async () => {
      while (index < queue.length) {
        const i = index++
        const combo = queue[i]
        try {
          const docRes = await fetch('/api/document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify({
              docType: combo.docType,
              employeeId: combo.employeeId,
              version: 'final',
            }),
          })

          if (!docRes.ok) {
            const errData = await docRes.json().catch(() => ({}))
            throw new Error(errData.error || errData.details || `HTTP ${docRes.status}`)
          }

          const html = await docRes.text()

          const fileName = `${combo.docType.replace(/_/g, '-')}-${combo.employeeName.replace(/\s+/g, '-')}`

          const pdfRes = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain', ...authHeaders() },
            body: html,
          })

          let pdfBlobUrl = ''
          if (pdfRes.ok) {
            const pdfBlob = await pdfRes.blob()
            pdfBlobUrl = URL.createObjectURL(pdfBlob)
            pdfUrlsRef.current.push(pdfBlobUrl)
          }

          addDocHistory({
            id: `${combo.docType}-${combo.employeeId}-${Date.now()}`,
            docType: combo.docType,
            employeeName: combo.employeeName,
            employeeId: combo.employeeId,
            label: docLabel(combo.docType),
            timestamp: Date.now(),
            fileName,
          })

          newResults.push({
            employeeId: combo.employeeId,
            employeeName: combo.employeeName,
            docType: combo.docType,
            docLabel: docLabel(combo.docType),
            status: 'success',
            html,
            pdfBlobUrl,
            fileName,
          })
        } catch (err) {
          newResults.push({
            employeeId: combo.employeeId,
            employeeName: combo.employeeName,
            docType: combo.docType,
            docLabel: docLabel(combo.docType),
            status: 'error',
            error: err instanceof Error ? err.message : 'Unknown error',
          })
        }

        setProgress(prev => ({ ...prev, current: prev.current + 1 }))
      }
    }

    const workers = Array.from({ length: Math.min(3, queue.length) }, () => processNext())
    await Promise.allSettled(workers)

    setResults(newResults)
    setGenerating(false)

    const ok = newResults.filter(r => r.status === 'success').length
    const fail = newResults.filter(r => r.status === 'error').length
    if (fail > 0) {
      toast.error(`Generated ${ok} documents, ${fail} failed`)
    } else {
      toast.success(`Successfully generated ${ok} documents`)
    }
  }, [selectedEmployees, selectedDocTypes, employees, totalCombinations])

  const downloadPdf = async (result: BatchResult) => {
    if (!result.html) return
    const key = `${result.employeeId}-${result.docType}-pdf`
    setDownloadLoading(prev => ({ ...prev, [key]: true }))
    try {
      const res = result.pdfBlobUrl
        ? await fetch(result.pdfBlobUrl)
        : await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain', ...authHeaders() },
            body: result.html,
          })
      if (!res.ok) throw new Error('PDF download failed')
      const blob = await res.blob()
      const name = result.fileName || `${result.docType}-${result.employeeName}`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`${result.docLabel} — ${result.employeeName} PDF downloaded`)
    } catch (err) {
      toast.error(`Failed to download PDF for ${result.employeeName}`)
    } finally {
      setDownloadLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const downloadDocx = async (result: BatchResult) => {
    if (!result.html) return
    const key = `${result.employeeId}-${result.docType}-docx`
    setDownloadLoading(prev => ({ ...prev, [key]: true }))
    try {
      const res = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', ...authHeaders() },
        body: result.html,
      })
      if (!res.ok) throw new Error('DOCX generation failed')
      const blob = await res.blob()
      const name = result.fileName || `${result.docType}-${result.employeeName}`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`${result.docLabel} — ${result.employeeName} DOCX downloaded`)
    } catch (err) {
      toast.error(`Failed to download DOCX for ${result.employeeName}`)
    } finally {
      setDownloadLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const clearResults = () => {
    pdfUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    pdfUrlsRef.current = []
    setResults([])
    setProgress({ current: 0, total: 0 })
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-bg-slate">
      {/* Left: Employee Selection */}
      <div className="w-[320px] flex-shrink-0 flex flex-col overflow-hidden border-r border-gray-100 bg-bg-slate">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Employees</span>
            <span className="text-xs text-slate-400">({employees.length})</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={selectAllEmployees}>All</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={deselectAllEmployees}>None</Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {employees.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            ) : (
              employees.map(emp => {
                const checked = selectedEmployees.includes(emp.id)
                return (
                  <label
                    key={emp.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? 'border-brand-red/30 bg-brand-red/5'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => toggleEmployee(emp.id)}
                  >
                    <Checkbox checked={checked} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800 truncate">{emp.name}</div>
                      <div className="text-xs text-slate-400 truncate">
                        {emp.ref_code} &middot; {emp.department}
                      </div>
                    </div>
                  </label>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Center: Document Type Selection */}
      <div className="w-[320px] flex-shrink-0 flex flex-col overflow-hidden border-r border-gray-100 bg-bg-slate">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileType className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Document Types</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={selectAllDocTypes}>All</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={deselectAllDocTypes}>None</Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            {CATEGORIES.map(cat => {
              const catItems = cat.items
              const catChecked = catItems.every(i => selectedDocTypes.includes(i.key))
              const catPartial = !catChecked && catItems.some(i => selectedDocTypes.includes(i.key))
              return (
                <div key={cat.name}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Checkbox
                      checked={catChecked ? true : catPartial ? 'indeterminate' : false}
                      onCheckedChange={() => {
                        if (catChecked) {
                          setSelectedDocTypes(prev => prev.filter(d => !catItems.some(i => i.key === d)))
                        } else {
                          const keys = catItems.map(i => i.key)
                          setSelectedDocTypes(prev => {
                            const set = new Set(prev)
                            keys.forEach(k => set.add(k))
                            return Array.from(set)
                          })
                        }
                      }}
                    />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{cat.name}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {catItems.map(item => {
                      const checked = selectedDocTypes.includes(item.key)
                      return (
                        <label
                          key={item.key}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                            checked
                              ? 'bg-brand-red/5 text-slate-800'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                          onClick={() => toggleDocType(item.key)}
                        >
                          <Checkbox
                            checked={checked}
                            className="data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                          />
                          <span className="text-sm">{item.label}</span>
                          {item.comingSoon && (
                            <span className="text-[8px] font-semibold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full uppercase">Soon</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Results Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Summary bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-brand-red" />
            <span className="text-sm font-medium text-slate-700">
              {selectedEmployees.length} employees &times; {selectedDocTypes.length} doc types
            </span>
            {totalCombinations > 0 && (
              <span className="text-sm font-bold text-brand-red">
                = {totalCombinations} documents
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {results.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearResults} className="text-xs">
                Clear Results
              </Button>
            )}
            <Button
              size="sm"
              disabled={generating || totalCombinations === 0}
              onClick={generateBatch}
              className="bg-brand-red hover:bg-red-700 text-white text-xs px-4"
            >
              {generating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate All${totalCombinations > 0 ? ` (${totalCombinations})` : ''}`
              )}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {generating && (
          <div className="px-6 py-3 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">Progress</span>
              <span className="text-xs font-medium text-slate-600">
                {progress.current} / {progress.total}
              </span>
            </div>
            <Progress value={progress.total > 0 ? (progress.current / progress.total) * 100 : 0} className="h-2" />
          </div>
        )}

        {/* Results table */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {results.length === 0 && !generating && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Layers className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium">Select employees and document types, then generate</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-slate-50">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 text-slate-700">{result.employeeName}</td>
                        <td className="px-4 py-2.5 text-slate-600">{result.docLabel}</td>
                        <td className="px-4 py-2.5">
                          {result.status === 'success' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500" title={result.error}>
                              <XCircle className="w-3.5 h-3.5" />
                              Error
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {result.status === 'success' && (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1"
                                disabled={!!downloadLoading[`${result.employeeId}-${result.docType}-pdf`]}
                                onClick={() => downloadPdf(result)}
                              >
                                {downloadLoading[`${result.employeeId}-${result.docType}-pdf`] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Download className="w-3 h-3" />
                                )}
                                PDF
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1"
                                disabled={!!downloadLoading[`${result.employeeId}-${result.docType}-docx`]}
                                onClick={() => downloadDocx(result)}
                              >
                                {downloadLoading[`${result.employeeId}-${result.docType}-docx`] ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <FileText className="w-3 h-3" />
                                )}
                                DOCX
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {generating && results.length < progress.total && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
