'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { saveEmployee } from '@/lib/storage'
import { useAllEmployees, invalidateEmployeeCache } from '@/lib/use-employees'
import type { Employee } from '@/lib/storage'
import { detectMismatches, applyFormToEmployee, DOC_MISMATCH_FIELDS } from '@/lib/mismatch'
import { useConfirmDiscard } from '@/lib/confirm-discard-context'
import type { MismatchAction } from '@/lib/mismatch'
import { setPreviewData, clearPreviewData, usePreviewData, setPreviewHasManualEdits } from '@/lib/preview-store'

interface UseDocumentFormOptions<T extends Record<string, any>> {
  docType: string
  initialData: T
  mapEmployeeToForm: (emp: Employee) => Partial<T>
  onCalculate: (data: T) => Partial<T>
  validate?: (data: T) => Record<string, string>
}

export function useDocumentForm<T extends Record<string, any>>(options: UseDocumentFormOptions<T>) {
  const { docType, initialData, mapEmployeeToForm, onCalculate, validate } = options

  const [formData, setFormData] = useState<T>(initialData)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [showMismatchModal, setShowMismatchModal] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { setConfirmDiscard } = useConfirmDiscard()

  const rawEmployees = useAllEmployees()
  const employees: Employee[] = Array.isArray(rawEmployees) ? rawEmployees : []

  // Debounced preview sync (400ms)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  const isNoEmployeeDoc = ['official_pad', 'work_order', 'purchase_order', 'requisition'].includes(docType)

  const preview = usePreviewData()

  // Sync state from preview store changes (e.g. version loads)
  useEffect(() => {
    if (preview && preview.docType === docType) {
      if (JSON.stringify(preview.formData) !== JSON.stringify(formData)) {
        setFormData(preview.formData as T)
      }
    }
  }, [preview, docType, formData])

  useEffect(() => {
    if (!isNoEmployeeDoc && (!selectedEmployeeId || selectedEmployeeId === '__new__')) {
      clearPreviewData()
      return
    }
    if (previewTimer.current) clearTimeout(previewTimer.current)
    if (isInitialMount.current) {
      isInitialMount.current = false
      setPreviewData(docType, formData)
    } else {
      previewTimer.current = setTimeout(() => {
        setPreviewData(docType, formData)
      }, 400)
    }
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current)
    }
  }, [formData, docType, selectedEmployeeId, isNoEmployeeDoc])

  const employee = useMemo((): Employee | null => {
    if (!selectedEmployeeId || selectedEmployeeId === '__new__') return null
    return employees.find(e => e.id === selectedEmployeeId) || null
  }, [selectedEmployeeId, employees])

  const mismatches = useMemo(() => {
    if (!selectedEmployeeId || selectedEmployeeId === '__new__' || !employee) return []
    return detectMismatches(docType, employee, formData)
  }, [formData, selectedEmployeeId, docType, employee])

  const proceedEmployeeChange = useCallback((id: string) => {
    setSelectedEmployeeId(id)
    setGenerated(false)
    if (!id || id === '__new__') {
      setFormData(initialData)
      return
    }
    const emp = employees.find(e => e.id === id)
    if (emp) {
      const mapped = mapEmployeeToForm(emp)
      setFormData(() => {
        const updated = { ...initialData, ...mapped }
        const calculated = onCalculate(updated)
        return { ...updated, ...calculated }
      })
    }
  }, [initialData, mapEmployeeToForm, onCalculate, employees])

  const handleEmployeeChange = useCallback((id: string) => {
    if (preview?.hasManualEdits) {
      setConfirmDiscard({
        message: 'Modifying the selected employee will regenerate the template and discard your manual changes. Do you want to proceed?',
        onConfirm: () => {
          setPreviewHasManualEdits(false)
          proceedEmployeeChange(id)
        },
      })
      return
    }
    proceedEmployeeChange(id)
  }, [preview, setConfirmDiscard, proceedEmployeeChange])

  const setField = useCallback((key: string, value: any) => {
    if (preview?.hasManualEdits) {
      setConfirmDiscard({
        message: 'Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?',
        onConfirm: () => {
          setPreviewHasManualEdits(false)
          setFormData(prev => {
            const updated = { ...prev, [key]: value }
            const calculated = onCalculate(updated)
            return { ...updated, ...calculated }
          })
        },
      })
      return
    }
    setFormData(prev => {
      const updated = { ...prev, [key]: value }
      const calculated = onCalculate(updated)
      return { ...updated, ...calculated }
    })
  }, [onCalculate, preview, setConfirmDiscard])

  const handleGenerate = useCallback(() => {
    if (validate) {
      const fieldErrors = validate(formData)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length > 0) return
    }
    if (selectedEmployeeId && selectedEmployeeId !== '__new__' && employee) {
      const current = detectMismatches(docType, employee, formData)
      if (current.length > 0) {
        setShowMismatchModal(true)
        return
      }
    }
    setPreviewData(docType, formData)
    setGenerated(true)
  }, [selectedEmployeeId, employee, docType, formData])

  const handleMismatchAction = useCallback(async (action: MismatchAction) => {
    setShowMismatchModal(false)
    if (action === 'cancel') return
    if (action === 'update_and_generate' && employee) {
      const mismatchKeys = DOC_MISMATCH_FIELDS[docType] || []
      const updated = applyFormToEmployee(employee, formData, mismatchKeys)
      try {
        await saveEmployee(updated)
        invalidateEmployeeCache()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to save employee mismatch update', err)
      }
    }
    setPreviewData(docType, formData)
    setGenerated(true)
  }, [employee, formData, docType])

  const resetForm = useCallback(() => {
    setSelectedEmployeeId('')
    setFormData(initialData)
    setGenerated(false)
    setErrors({})
  }, [initialData])

  return {
    formData, setFormData, setField,
    selectedEmployeeId, handleEmployeeChange,
    employees, employee,
    mismatches, showMismatchModal, setShowMismatchModal,
    handleGenerate, handleMismatchAction,
    generated, setGenerated, resetForm,
    errors, setErrors,
    isNewEmployee: selectedEmployeeId === '__new__',
  }
}
