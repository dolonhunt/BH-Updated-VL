'use client'

import { Eye, Maximize2, Minimize2 } from 'lucide-react'
import EditorToolbar from './EditorToolbar'
import VersionManager from './VersionManager'
import FindReplace from './FindReplace'
import EditorStatusBar from './EditorStatusBar'
import type { View } from '../layout/Sidebar'
import { FLAT_DOC_TYPES } from '../layout/Sidebar'

interface DocumentCanvasProps {
  view: View
  docOverrides: Record<string, any>
  setDocOverrides: (overrides: Record<string, any>) => void
  previewHtml: string
  zoomLevel: number
  setZoomLevel: (zoom: number) => void
  fullscreen: boolean
  setFullscreen: (full: boolean) => void
  findOpen: boolean
  setFindOpen: (open: boolean) => void
  editor: {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
    selectionState: any
    counts: { characters: number; words: number; charactersNoSpaces: number }
    isEditorReady: boolean
    toggleBold: () => void
    toggleItalic: () => void
    toggleUnderline: () => void
    toggleStrikethrough: () => void
    setAlignment: (align: 'left' | 'center' | 'right' | 'justify') => void
    toggleOrderedList: () => void
    toggleUnorderedList: () => void
    increaseFontSize: () => void
    decreaseFontSize: () => void
    setTextColor: (color: string) => void
    setHighlightColor: (color: string) => void
    undo: () => void
    redo: () => void
    clearFormatting: () => void
    insertHorizontalRule: () => void
    insertLink: (url: string) => void
    findInDocument: (query: string) => number
    replaceInDocument: (query: string, replacement: string, replaceAll?: boolean) => number
    clearFindHighlights: () => void
    handleIframeLoad: () => void
    iframeHeight: number
    setIframeHeight: (height: number) => void
    updateIframeHeight: () => void
  }
}

export function DocumentCanvas({
  view,
  docOverrides,
  setDocOverrides,
  previewHtml,
  zoomLevel,
  setZoomLevel,
  fullscreen,
  setFullscreen,
  findOpen,
  setFindOpen,
  editor,
}: DocumentCanvasProps) {
  const isDocView = FLAT_DOC_TYPES.some((d) => d.key === view)

  if (!isDocView) return null

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      } bg-slate-100`}
    >
      {/* ─── Preview Header Bar ─── */}
      <div className="h-9 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <Eye className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold text-gray-700">Live Document</span>
        </div>
        <span className="text-[10px] text-gray-400">
          {['official_pad', 'work_order', 'purchase_order', 'requisition'].includes(view)
            ? 'Click to edit content'
            : 'Updates as you type'}
        </span>

        {/* Version Manager */}
        <VersionManager
          docType={view}
          currentOverrides={docOverrides}
          onLoadVersion={setDocOverrides}
        />

        <div className="ml-auto flex items-center gap-1.5">
          {/* Fullscreen toggle */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ─── Rich Text Toolbar ─── */}
      <EditorToolbar
        selectionState={editor.selectionState}
        onToggleBold={editor.toggleBold}
        onToggleItalic={editor.toggleItalic}
        onToggleUnderline={editor.toggleUnderline}
        onToggleStrikethrough={editor.toggleStrikethrough}
        onSetAlignment={editor.setAlignment}
        onToggleOrderedList={editor.toggleOrderedList}
        onToggleUnorderedList={editor.toggleUnorderedList}
        onIncreaseFontSize={editor.increaseFontSize}
        onDecreaseFontSize={editor.decreaseFontSize}
        onSetTextColor={editor.setTextColor}
        onSetHighlightColor={editor.setHighlightColor}
        onUndo={editor.undo}
        onRedo={editor.redo}
        onClearFormatting={editor.clearFormatting}
        onInsertHR={editor.insertHorizontalRule}
        onInsertLink={editor.insertLink}
        onFindToggle={() => setFindOpen(!findOpen)}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        isEditorReady={editor.isEditorReady}
      />

      {/* ─── Find & Replace Overlay ─── */}
      {findOpen && (
        <div className="absolute top-[84px] right-4 z-10">
          <FindReplace
            onFind={editor.findInDocument}
            onReplace={editor.replaceInDocument}
            onClearHighlights={editor.clearFindHighlights}
            onClose={() => {
              setFindOpen(false)
              editor.clearFindHighlights()
            }}
          />
        </div>
      )}

      {/* ─── Document Canvas ─── */}
      <div className="flex-1 overflow-auto p-6 bg-slate-100 flex justify-center items-start">
        <div
          style={{
            width: `${794 * (zoomLevel / 100)}px`,
            height: `${editor.iframeHeight * (zoomLevel / 100)}px`,
            position: 'relative',
            overflow: 'hidden',
          }}
          className="shadow-lg rounded-lg bg-white origin-top"
        >
          {previewHtml ? (
            <iframe
              ref={editor.iframeRef}
              key={view}
              onLoad={editor.handleIframeLoad}
              srcDoc={previewHtml}
              className="border-0 absolute top-0 left-0"
              style={{
                width: '794px',
                height: `${editor.iframeHeight}px`,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
                overflow: 'hidden',
              }}
              scrolling="no"
              title="Document Editor"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-300 text-sm">
              Loading preview...
            </div>
          )}
        </div>
      </div>

      {/* ─── Status Bar ─── */}
      <EditorStatusBar
        counts={editor.counts}
        docType={view}
        isEditorReady={editor.isEditorReady}
      />
    </div>
  )
}
