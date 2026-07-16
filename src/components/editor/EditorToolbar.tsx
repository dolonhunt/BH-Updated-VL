'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered,
  Undo2, Redo2, RemoveFormatting,
  Type, Minus, Link,
  Palette, Highlighter,
  ZoomIn, ZoomOut, Search,
  ChevronDown,
} from 'lucide-react'
import type { SelectionState } from '@/hooks/useEditorBridge'

interface EditorToolbarProps {
  selectionState: SelectionState
  onToggleBold: () => void
  onToggleItalic: () => void
  onToggleUnderline: () => void
  onToggleStrikethrough: () => void
  onSetAlignment: (align: 'left' | 'center' | 'right' | 'justify') => void
  onToggleOrderedList: () => void
  onToggleUnorderedList: () => void
  onIncreaseFontSize: () => void
  onDecreaseFontSize: () => void
  onSetTextColor: (color: string) => void
  onSetHighlightColor: (color: string) => void
  onUndo: () => void
  onRedo: () => void
  onClearFormatting: () => void
  onInsertHR: () => void
  onInsertLink: (url: string) => void
  onFindToggle: () => void
  zoomLevel: number
  onZoomChange: (level: number) => void
  isEditorReady: boolean
}

const TEXT_COLORS = [
  '#000000', '#333333', '#555555', '#888888', '#bbbbbb',
  '#dc2626', '#ea580c', '#d97706', '#65a30d', '#16a34a',
  '#0891b2', '#2563eb', '#7c3aed', '#c026d3', '#e11d48',
  '#ffffff',
]

const HIGHLIGHT_COLORS = [
  '#fef08a', '#fed7aa', '#fecaca', '#d9f99d', '#a7f3d0',
  '#bae6fd', '#c7d2fe', '#e9d5ff', '#fbcfe8', '#ffffff',
]

const FONT_SIZES = [
  { label: '8', value: 1 },
  { label: '9', value: 2 },
  { label: '11', value: 3 },
  { label: '14', value: 4 },
  { label: '18', value: 5 },
  { label: '24', value: 6 },
  { label: '36', value: 7 },
]

function ToolbarButton({
  active = false,
  disabled = false,
  onClick,
  tooltip,
  children,
  className = '',
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  tooltip: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            disabled={disabled}
            className={`
              w-7 h-7 flex items-center justify-center rounded transition-all duration-150
              ${active
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
              ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              ${className}
            `}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[11px] px-2 py-1">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function EditorToolbar({
  selectionState,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onToggleStrikethrough,
  onSetAlignment,
  onToggleOrderedList,
  onToggleUnorderedList,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onSetTextColor,
  onSetHighlightColor,
  onUndo,
  onRedo,
  onClearFormatting,
  onInsertHR,
  onInsertLink,
  onFindToggle,
  zoomLevel,
  onZoomChange,
  isEditorReady,
}: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [linkOpen, setLinkOpen] = useState(false)

  const handleInsertLink = useCallback(() => {
    if (linkUrl.trim()) {
      onInsertLink(linkUrl.trim())
      setLinkUrl('')
      setLinkOpen(false)
    }
  }, [linkUrl, onInsertLink])

  return (
    <div className="h-10 bg-white border-b border-gray-200 flex items-center px-2 gap-0.5 flex-shrink-0 overflow-x-auto scrollbar-none">
      {/* ─── Undo / Redo ─── */}
      <ToolbarButton onClick={onUndo} tooltip="Undo (Ctrl+Z)" disabled={!isEditorReady}>
        <Undo2 className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={onRedo} tooltip="Redo (Ctrl+Y)" disabled={!isEditorReady}>
        <Redo2 className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Text Formatting ─── */}
      <ToolbarButton
        onClick={onToggleBold}
        active={selectionState.bold}
        tooltip="Bold (Ctrl+B)"
        disabled={!isEditorReady}
      >
        <Bold className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={onToggleItalic}
        active={selectionState.italic}
        tooltip="Italic (Ctrl+I)"
        disabled={!isEditorReady}
      >
        <Italic className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={onToggleUnderline}
        active={selectionState.underline}
        tooltip="Underline (Ctrl+U)"
        disabled={!isEditorReady}
      >
        <Underline className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={onToggleStrikethrough}
        active={selectionState.strikethrough}
        tooltip="Strikethrough"
        disabled={!isEditorReady}
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Font Size ─── */}
      <ToolbarButton onClick={onDecreaseFontSize} tooltip="Decrease Font Size" disabled={!isEditorReady}>
        <ZoomOut className="w-3.5 h-3.5" />
      </ToolbarButton>

      {/* Font Size Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            disabled={!isEditorReady}
            className="h-7 px-2 flex items-center gap-1 rounded text-[11px] font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30"
          >
            <Type className="w-3 h-3" />
            <span>Size</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-1" align="start">
          {FONT_SIZES.map(size => (
            <button
              key={size.value}
              onClick={() => {
                const doc = (document.querySelector('iframe') as HTMLIFrameElement)?.contentDocument
                if (doc) doc.execCommand('fontSize', false, String(size.value))
              }}
              className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-100 rounded transition-colors"
            >
              <span style={{ fontSize: `${Math.min(size.value * 2 + 6, 24)}px` }}>{size.label}pt</span>
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <ToolbarButton onClick={onIncreaseFontSize} tooltip="Increase Font Size" disabled={!isEditorReady}>
        <ZoomIn className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Text Color ─── */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            disabled={!isEditorReady}
            className="w-7 h-7 flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-30"
            title="Text Color"
          >
            <Palette className="w-3.5 h-3.5 text-gray-600" />
            <div
              className="w-4 h-1 rounded-full mt-0.5"
              style={{ backgroundColor: selectionState.textColor || '#000000' }}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Text Color</p>
          <div className="grid grid-cols-5 gap-1">
            {TEXT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onSetTextColor(color)}
                className="w-7 h-7 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* ─── Highlight Color ─── */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            disabled={!isEditorReady}
            className="w-7 h-7 flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors disabled:opacity-30"
            title="Highlight Color"
          >
            <Highlighter className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Highlight</p>
          <div className="grid grid-cols-5 gap-1">
            {HIGHLIGHT_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onSetHighlightColor(color)}
                className="w-7 h-7 rounded border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Alignment ─── */}
      <ToolbarButton
        onClick={() => onSetAlignment('left')}
        active={selectionState.alignLeft}
        tooltip="Align Left"
        disabled={!isEditorReady}
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onSetAlignment('center')}
        active={selectionState.alignCenter}
        tooltip="Align Center"
        disabled={!isEditorReady}
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onSetAlignment('right')}
        active={selectionState.alignRight}
        tooltip="Align Right"
        disabled={!isEditorReady}
      >
        <AlignRight className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onSetAlignment('justify')}
        active={selectionState.alignJustify}
        tooltip="Justify"
        disabled={!isEditorReady}
      >
        <AlignJustify className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Lists ─── */}
      <ToolbarButton
        onClick={onToggleUnorderedList}
        active={selectionState.unorderedList}
        tooltip="Bullet List"
        disabled={!isEditorReady}
      >
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={onToggleOrderedList}
        active={selectionState.orderedList}
        tooltip="Numbered List"
        disabled={!isEditorReady}
      >
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Insert ─── */}
      <ToolbarButton onClick={onInsertHR} tooltip="Insert Horizontal Line" disabled={!isEditorReady}>
        <Minus className="w-3.5 h-3.5" />
      </ToolbarButton>

      {/* Link */}
      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={!isEditorReady}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-30"
            title="Insert Link"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Insert Link</p>
          <div className="flex gap-1.5">
            <input
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInsertLink()}
              placeholder="https://..."
              className="flex-1 h-7 px-2 text-[12px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <Button size="sm" className="h-7 text-[11px] px-3" onClick={handleInsertLink}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-5 mx-1" />

      {/* ─── Clear Formatting ─── */}
      <ToolbarButton onClick={onClearFormatting} tooltip="Clear Formatting" disabled={!isEditorReady}>
        <RemoveFormatting className="w-3.5 h-3.5" />
      </ToolbarButton>

      {/* ─── Find ─── */}
      <ToolbarButton onClick={onFindToggle} tooltip="Find & Replace (Ctrl+H)" disabled={!isEditorReady}>
        <Search className="w-3.5 h-3.5" />
      </ToolbarButton>

      {/* ─── Right side: Zoom controls ─── */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={() => onZoomChange(Math.max(25, zoomLevel - 10))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-[11px] font-bold"
        >
          −
        </button>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min={25}
            max={150}
            step={5}
            value={zoomLevel}
            onChange={e => onZoomChange(Number(e.target.value))}
            className="w-20 h-1 accent-gray-600 cursor-pointer"
          />
          <span className="text-[10px] text-gray-500 w-8 text-right">{zoomLevel}%</span>
        </div>
        <button
          onClick={() => onZoomChange(Math.min(150, zoomLevel + 10))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-[11px] font-bold"
        >
          +
        </button>
      </div>
    </div>
  )
}
