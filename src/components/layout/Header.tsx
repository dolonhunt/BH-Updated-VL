'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  ChevronRight, Download, FileText, Printer, ExternalLink, Mail,
  Loader2, UserPlus, List, Settings, History, Home, ArrowLeft,
} from 'lucide-react'
import type { View } from './Sidebar'
import { FLAT_DOC_TYPES } from './Sidebar'

interface HeaderProps {
  sidebarExpanded: boolean
  view: View
  zoomLevel: number
  setZoomLevel: (zoom: number) => void
  pdfLoading: boolean
  onDownloadPDF: () => void
  onDownloadDOC: () => void
  onDownloadTXT: () => void
  onPrint: () => void
  onOpenInNewTab: () => void
  onSendEmail: () => void
  onVersions?: () => void
  onHome: () => void
  onBack: () => void
  canGoBack: boolean
  onNavigate: (v: View) => void
}

export function Header({
  sidebarExpanded,
  view,
  pdfLoading,
  onDownloadPDF,
  onDownloadDOC,
  onDownloadTXT,
  onPrint,
  onOpenInNewTab,
  onSendEmail,
  onVersions,
  setZoomLevel,
  onHome,
  onBack,
  canGoBack,
  onNavigate,
}: HeaderProps) {
  const isDocView = FLAT_DOC_TYPES.some((d) => d.key === view)
  const activeDocMeta = FLAT_DOC_TYPES.find((d) => d.key === view)

  const getViewLabel = (v: View): string => {
    if (v === 'dashboard') return 'Dashboard'
    if (v === 'employees') return 'Employee Form'
    if (v === 'employee_list') return 'Employee List'
    if (v === 'settings') return 'Settings'
    if (v === 'template_admin') return 'Template Admin'
    const meta = FLAT_DOC_TYPES.find(d => d.key === v)
    return meta?.label || v.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-gray-100 flex items-center px-5 gap-0 shadow-xs">
      {/* Left: Navigation + Breadcrumb */}
      <motion.div
        animate={{ width: sidebarExpanded ? 256 : 64 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="flex items-center gap-1 flex-shrink-0 overflow-hidden"
      >
        {/* Home button — always visible */}
        <button
          onClick={onHome}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0 transition-colors"
          title="Home (Escape)"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Back button */}
        {canGoBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 shrink-0 transition-colors"
            title="Go back (Ctrl+Backspace)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-xs ml-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            Workspace
          </button>
          {view !== 'dashboard' && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
              <span className="font-semibold text-gray-800 truncate max-w-[160px]">
                {getViewLabel(view)}
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Center: Document info with status badge */}
      <div className="flex-1 flex items-center justify-center gap-2.5">
        {isDocView && activeDocMeta && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50">
            <span className="text-brand-red shrink-0">{activeDocMeta.icon}</span>
            <span className="text-xs font-semibold text-gray-800">{activeDocMeta.label}</span>
          </div>
        )}
        {view === 'employees' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50">
            <UserPlus className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-xs font-semibold text-gray-800">Add / Edit Employee</span>
          </div>
        )}
        {view === 'employee_list' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50">
            <List className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-xs font-semibold text-gray-800">Employee Directory</span>
          </div>
        )}
        {view === 'settings' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50">
            <Settings className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-xs font-semibold text-gray-800">Company Settings</span>
          </div>
        )}
      </div>

      {/* Right: Zoom presets + Pill-shaped action buttons */}
      {isDocView && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onVersions}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-500 shadow-xs"
            title="Version History"
          >
            <History className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 mr-1">
            <button
              onClick={() => setZoomLevel(Math.round((window.innerWidth * 0.55) / 8.27))}
              className="h-7 min-w-7 px-2 text-[11px] font-semibold rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-400 shadow-xs"
              title="Fit Width (W)"
            >
              W
            </button>
            <button
              onClick={() => setZoomLevel(Math.round((window.innerHeight * 0.75) / 11.69))}
              className="h-7 min-w-7 px-2 text-[11px] font-semibold rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-400 shadow-xs"
              title="Fit Height (H)"
            >
              H
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="h-7 min-w-7 px-2 text-[11px] font-semibold rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-400 shadow-xs"
              title="100%"
            >
              1:1
            </button>
          </div>
          <Button
            onClick={onDownloadPDF}
            disabled={pdfLoading}
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs"
          >
            {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
          </Button>
          <Button
            onClick={onDownloadDOC}
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" /> DOC
          </Button>
          <Button
            onClick={onDownloadTXT}
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" /> TXT
          </Button>
          <Button
            onClick={onPrint}
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button
            onClick={onSendEmail}
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5 px-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </Button>
          <Button
            onClick={onOpenInNewTab}
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5 px-3 text-gray-500 rounded-full hover:bg-gray-50"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </header>
  )
}
