'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar, View } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { DocumentCanvas } from '@/components/editor/DocumentCanvas'
import { EmployeeModule } from '@/components/employees/EmployeeModule'
import { SettingsForm } from '@/components/settings/SettingsForm'

import { FormRouter } from '@/components/forms/FormRouter'

import { setPreviewData } from '@/lib/preview-store'
import { useEditorBridge } from '@/hooks/useEditorBridge'
import { useDocumentPreview } from '@/hooks/useDocumentPreview'

import { Dashboard } from '@/components/dashboard/Dashboard'
import { TemplateAdmin } from '@/components/templates/TemplateAdmin'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { EmailDialog } from '@/components/editor/EmailDialog'
import { ComingSoonForm } from '@/components/forms/ComingSoonForm'

import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import { ConfirmDiscardProvider } from '@/lib/confirm-discard-context'
import { FormSkeleton } from '@/components/ui/skeleton-loader'
import { Loader2 } from 'lucide-react'
import { VersionHistory } from '@/components/editor/VersionHistory'
import { DocumentHistory } from '@/components/history/DocumentHistory'
import { BatchGenerator } from '@/components/batch/BatchGenerator'
import { useDocVersioning } from '@/hooks/useDocVersioning'

export default function Home() {
  const [view, setView] = useState<View>('dashboard')
  const [navHistory, setNavHistory] = useState<View[]>([])

  const navigateTo = useCallback((v: View) => {
    setNavHistory(prev => {
      if (v === view) return prev
      return [...prev, view]
    })
    setView(v)
  }, [view])

  const goHome = useCallback(() => {
    if (view !== 'dashboard') {
      setNavHistory(prev => [...prev, view])
      setView('dashboard')
    }
  }, [view])

  const navigateBack = useCallback(() => {
    setNavHistory(prev => {
      if (prev.length === 0) return prev
      const backView = prev[prev.length - 1]
      setView(backView)
      return prev.slice(0, -1)
    })
  }, [])

  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(55)
  const [findOpen, setFindOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false)
  const { versions, saveVersion, deleteVersion, clearVersions } = useDocVersioning()

  const editor = useEditorBridge()
  const {
    preview,
    previewHtml,
    previewSrc,
    pdfLoading,
    handleDownloadPDF,
    handleDownloadDOC,
    handleDownloadTXT,
    handlePrint,
    handleOpenInNewTab,
  } = useDocumentPreview(editor.iframeRef)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen(prev => !prev)
      }
      if (e.key === 'Escape' && commandOpen) {
        setCommandOpen(false)
        return
      }
      if (e.key === 'Escape' && !commandOpen && view !== 'dashboard') {
        e.preventDefault()
        goHome()
      }
      if (e.key === 'h' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        goHome()
      }
      if (e.key === 'Backspace' && (e.metaKey || e.ctrlKey) && navHistory.length > 0) {
        e.preventDefault()
        navigateBack()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandOpen, view, navHistory.length, goHome, navigateBack])

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-slate">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-brand-red">
              <span className="text-white font-extrabold text-2xl">B</span>
            </div>
            <div className="absolute -inset-2 rounded-xl animate-ping opacity-20 bg-brand-red"></div>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Beyond Headlines</h1>
            <p className="text-xs text-gray-400 mt-0.5">HR Document Generator</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Loading workspace...</span>
          </div>
          {/* Skeleton preview of layout */}
          <div className="mt-6 w-[800px] max-w-[90vw] h-64 rounded-xl border border-gray-100 overflow-hidden shadow-sm flex">
            <div className="w-16 bg-dark-navy flex-shrink-0" />
            <div className="w-[200px] bg-bg-slate border-r border-gray-100 flex-shrink-0">
              <FormSkeleton />
            </div>
            <div className="flex-1 bg-slate-100 p-4">
              <div className="h-full bg-white rounded-lg shadow-sm animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ALL_DOC_TYPES = [
    'payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert',
    'official_pad', 'work_order', 'purchase_order', 'requisition',
    'offer_letter', 'nda', 'joining_report', 'id_card_form', 'personal_info_form',
    'probation_confirmation', 'noc_letter', 'bank_intro_letter', 'embassy_letter',
    'salary_increment', 'bonus_letter', 'arrear_payment',
    'show_cause', 'warning_letter', 'suspension_letter', 'termination_letter',
    'resignation_acceptance', 'relieving_letter', 'clearance_cert', 'fnf_settlement',
    'promotion_letter', 'pip_letter', 'appreciation_letter',
    'leave_approval', 'lwp_notice',
    'hr_handbook', 'leave_policy',
  ] as const

  const isDocView = (ALL_DOC_TYPES as readonly string[]).includes(view)

  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans bg-bg-slate">
      {/* HEADER */}
      <Header
        sidebarExpanded={sidebarExpanded}
        view={view}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        pdfLoading={pdfLoading}
        onDownloadPDF={() => handleDownloadPDF()}
        onDownloadDOC={() => handleDownloadDOC()}
        onDownloadTXT={() => handleDownloadTXT()}
        onPrint={() => handlePrint()}
        onOpenInNewTab={() => handleOpenInNewTab()}
        onSendEmail={() => setEmailOpen(true)}
        onVersions={() => {
          if (isDocView && preview?.formData) {
            saveVersion(view, preview.formData)
          }
          setVersionHistoryOpen(true)
        }}
        onHome={goHome}
        onBack={navigateBack}
        canGoBack={navHistory.length > 0}
        onNavigate={navigateTo}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          currentView={view}
          setView={navigateTo}
        />

        {/* MAIN PANEL */}
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="flex-1 flex overflow-hidden"
            >
          <ErrorBoundary fallbackTitle="Document Editor">
            {isDocView && (
              <>
                {/* Form Config Panel */}
                <div className="w-[320px] flex-shrink-0 flex flex-col overflow-hidden border-r border-gray-100 bg-bg-slate">
                  <ConfirmDiscardProvider>
                    <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-4">
                      <FormRouter view={view} />
                      {!(ALL_DOC_TYPES as readonly string[]).includes(view) && (
                        <ComingSoonForm label={(view as string).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} />
                      )}
                    </div>
                  </div>
                  </ConfirmDiscardProvider>
                </div>

                {/* Live Canvas */}
                <DocumentCanvas
                  view={view}
                  docOverrides={preview?.formData || {}}
                  setDocOverrides={(overrides) => {
                    if (preview) {
                      setPreviewData(preview.docType, overrides)
                    }
                  }}
                  previewHtml={previewHtml}
                  zoomLevel={zoomLevel}
                  setZoomLevel={setZoomLevel}
                  fullscreen={fullscreen}
                  setFullscreen={setFullscreen}
                  findOpen={findOpen}
                  setFindOpen={setFindOpen}
                  editor={editor}
                />
              </>
            )}
          </ErrorBoundary>

          {/* DASHBOARD */}
          <ErrorBoundary fallbackTitle="Dashboard">
            {view === 'dashboard' && <div className="overflow-y-auto flex-1 min-h-0"><Dashboard onNavigate={navigateTo} /></div>}
          </ErrorBoundary>

          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onNavigate={navigateTo} />

          <EmailDialog
            open={emailOpen}
            onOpenChange={setEmailOpen}
            docType={view}
            employeeName={preview?.formData?.name}
            downloadUrl={previewSrc}
          />

          <VersionHistory
            open={versionHistoryOpen}
            onOpenChange={setVersionHistoryOpen}
            versions={versions}
            currentDocType={view}
            onRestore={(version) => {
              if (preview) {
                setPreviewData(preview.docType, version.formData)
              }
              setVersionHistoryOpen(false)
            }}
            onDelete={deleteVersion}
            onClearAll={clearVersions}
          />

          {/* TEMPLATE ADMIN */}
          <ErrorBoundary fallbackTitle="Template Admin">
            {view === 'template_admin' && <div className="overflow-y-auto flex-1 min-h-0"><TemplateAdmin /></div>}
          </ErrorBoundary>

          {/* HR MOD - Employees list & form */}
          <ErrorBoundary fallbackTitle="Employee Module">
            {view === 'employees' && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <EmployeeModule route="employees-add" onNavigate={navigateTo} />
              </div>
            )}

            {view === 'employee_list' && (
              <div className="flex-1 min-h-0 overflow-y-auto">
                <EmployeeModule route="employees-list" onNavigate={navigateTo} />
              </div>
            )}
          </ErrorBoundary>

          {/* DOCUMENT HISTORY */}
          <ErrorBoundary fallbackTitle="Document History">
            {view === 'doc_history' && <div className="overflow-y-auto flex-1 min-h-0"><DocumentHistory onNavigate={navigateTo} /></div>}
          </ErrorBoundary>

          {/* BATCH GENERATION */}
          <ErrorBoundary fallbackTitle="Batch Generator">
            {view === 'batch_generation' && <div className="overflow-y-auto flex-1 min-h-0"><BatchGenerator /></div>}
          </ErrorBoundary>

          {/* SETTINGS */}
          <ErrorBoundary fallbackTitle="Settings">
            {view === 'settings' && (
              <div className="flex-1 min-h-0 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                  <SettingsForm />
                </div>
              </div>
            )}
          </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
