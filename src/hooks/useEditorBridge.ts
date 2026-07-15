'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { setPreviewDirty, setPreviewHasManualEdits, usePreviewData } from '@/lib/preview-store'

/**
 * useEditorBridge — Communication bridge between React and the document iframe.
 *
 * Provides:
 * - Rich text formatting commands (execCommand via iframe)
 * - Selection state tracking (bold, italic, underline, alignment)
 * - Word/character count
 * - Find & replace
 * - Undo/redo
 */

export interface SelectionState {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  alignLeft: boolean
  alignCenter: boolean
  alignRight: boolean
  alignJustify: boolean
  orderedList: boolean
  unorderedList: boolean
  fontSize: string
  fontName: string
  textColor: string
}

const DEFAULT_SELECTION: SelectionState = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  alignLeft: true,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
  orderedList: false,
  unorderedList: false,
  fontSize: '11pt',
  fontName: 'Cambria',
  textColor: '#000000',
}

export interface EditorCounts {
  words: number
  characters: number
  charactersNoSpaces: number
}

export function useEditorBridge() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [selectionState, setSelectionState] = useState<SelectionState>(DEFAULT_SELECTION)
  const [counts, setCounts] = useState<EditorCounts>({ words: 0, characters: 0, charactersNoSpaces: 0 })
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isDirty, setIsDirtyInternal] = useState(false)
  const [hasManualEdits, setHasManualEditsInternal] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(1123)
  const preview = usePreviewData()

  // Sync state from preview store
  useEffect(() => {
    if (preview) {
      setHasManualEditsInternal(!!preview.hasManualEdits)
    }
  }, [preview?.hasManualEdits])

  const setHasManualEdits = useCallback((value: boolean) => {
    setHasManualEditsInternal(value)
    setPreviewHasManualEdits(value)
  }, [])

  const setIsDirty = useCallback((dirty: boolean) => {
    setIsDirtyInternal(dirty)
    setPreviewDirty(dirty)
    setPreviewHasManualEdits(dirty)
  }, [])

  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Dynamic iframe height measurement via ResizeObserver (replaces polling)
  const updateIframeHeight = useCallback(() => {
    const iframe = iframeRef.current
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc && doc.body) {
        const height = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight,
          1123
        )
        setIframeHeight(height)
      }
    }
  }, [])

  // Get the iframe's document (must be defined before setupResizeObserver)
  const getDoc = useCallback((): Document | null => {
    try {
      const iframe = iframeRef.current
      if (!iframe) return null
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      return doc || null
    } catch {
      return null
    }
  }, [])

  // Get the editable body element
  const getEditableBody = useCallback((): HTMLElement | null => {
    const doc = getDoc()
    if (!doc) return null
    return doc.querySelector('.pg-body[contenteditable="true"]') || doc.querySelector('.pg-body')
  }, [getDoc])

  const setupResizeObserver = useCallback(() => {
    const doc = getDoc()
    if (!doc) return

    // Clean up existing observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }

    const body = doc.querySelector('.pg-body') || doc.body
    if (!body) return

    resizeObserverRef.current = new ResizeObserver(() => {
      updateIframeHeight()
    })

    resizeObserverRef.current.observe(body)
    setIsEditorReady(true)
  }, [getDoc, updateIframeHeight])

  // Update selection state by querying the iframe's document
  const updateSelectionState = useCallback(() => {
    const doc = getDoc()
    if (!doc) return

    try {
      const newState: SelectionState = {
        bold: doc.queryCommandState('bold'),
        italic: doc.queryCommandState('italic'),
        underline: doc.queryCommandState('underline'),
        strikethrough: doc.queryCommandState('strikeThrough'),
        alignLeft: doc.queryCommandState('justifyLeft'),
        alignCenter: doc.queryCommandState('justifyCenter'),
        alignRight: doc.queryCommandState('justifyRight'),
        alignJustify: doc.queryCommandState('justifyFull'),
        orderedList: doc.queryCommandState('insertOrderedList'),
        unorderedList: doc.queryCommandState('insertUnorderedList'),
        fontSize: doc.queryCommandValue('fontSize') || '11pt',
        fontName: doc.queryCommandValue('fontName')?.replace(/['"]/g, '') || 'Cambria',
        textColor: doc.queryCommandValue('foreColor') || '#000000',
      }
      setSelectionState(newState)
    } catch {
      // queryCommandState can fail if no selection
    }
  }, [getDoc])

  // Update word/character counts
  const updateCounts = useCallback(() => {
    const body = getEditableBody()
    if (!body) return
    const text = body.innerText || body.textContent || ''
    const trimmed = text.trim()
    const words = trimmed ? trimmed.split(/\s+/).length : 0
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    setCounts({ words, characters, charactersNoSpaces })
  }, [getEditableBody])

  // Execute a command on the iframe's document
  const execCommand = useCallback((command: string, value?: string) => {
    const doc = getDoc()
    if (!doc) return
    // Focus the editable area first
    const body = getEditableBody()
    if (body) body.focus()
    doc.execCommand(command, false, value)
    setIsDirty(true)
    setHasManualEdits(true)
    updateSelectionState()
    updateCounts()
    updateIframeHeight()
  }, [getDoc, getEditableBody, updateSelectionState, updateCounts, setHasManualEdits, updateIframeHeight])

  // Clean up listeners
  const cleanupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    
    // Disconnect ResizeObserver
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
      resizeObserverRef.current = null
    }

    doc.removeEventListener('selectionchange', updateSelectionState)
    doc.removeEventListener('mouseup', updateSelectionState)
    if ((doc as any)._handleInput) {
      doc.removeEventListener('input', (doc as any)._handleInput)
      doc.removeEventListener('paste', (doc as any)._handleInput)
      doc.removeEventListener('cut', (doc as any)._handleInput)
      doc.removeEventListener('drop', (doc as any)._handleInput)
    }
    if ((doc as any)._handleFocusOut) {
      doc.removeEventListener('focusout', (doc as any)._handleFocusOut)
    }
    if ((doc as any)._handleKeyUp) {
      doc.removeEventListener('keyup', (doc as any)._handleKeyUp)
    }
    setIsEditorReady(false)
  }, [getDoc, updateSelectionState])

  // Set up event listeners on the iframe
  const setupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return

    cleanupIframeListeners()

    doc.addEventListener('selectionchange', updateSelectionState)
    
    const handleInput = () => {
      setIsDirty(true)
      setHasManualEdits(true)
      updateCounts()
      updateIframeHeight()
    }
    doc.addEventListener('input', handleInput)
    doc.addEventListener('paste', handleInput)
    doc.addEventListener('cut', handleInput)
    doc.addEventListener('drop', handleInput)
    ;(doc as any)._handleInput = handleInput

    const handleFocusOut = () => {
      setTimeout(updateIframeHeight, 100)
    }
    doc.addEventListener('focusout', handleFocusOut)
    ;(doc as any)._handleFocusOut = handleFocusOut

    const handleKeyUp = () => {
      updateSelectionState()
      updateCounts()
      updateIframeHeight()
    }
    doc.addEventListener('keyup', handleKeyUp)
    ;(doc as any)._handleKeyUp = handleKeyUp

    doc.addEventListener('mouseup', updateSelectionState)

    // Setup ResizeObserver for reactive height tracking (replaces 1000ms polling)
    setupResizeObserver()
  }, [getDoc, updateSelectionState, updateCounts, updateIframeHeight, cleanupIframeListeners, setHasManualEdits, setupResizeObserver])

  // When iframe loads, set up listeners
  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setupIframeListeners()
      updateCounts()
      updateIframeHeight()
      setIsDirty(false)
    }, 200)
  }, [setupIframeListeners, updateCounts, updateIframeHeight])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupIframeListeners()
    }
  }, [cleanupIframeListeners])

  // ─── FORMATTING COMMANDS ───

  const toggleBold = useCallback(() => execCommand('bold'), [execCommand])
  const toggleItalic = useCallback(() => execCommand('italic'), [execCommand])
  const toggleUnderline = useCallback(() => execCommand('underline'), [execCommand])
  const toggleStrikethrough = useCallback(() => execCommand('strikeThrough'), [execCommand])

  const setAlignment = useCallback((align: 'left' | 'center' | 'right' | 'justify') => {
    const cmd = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull',
    }[align]
    execCommand(cmd)
  }, [execCommand])

  const toggleOrderedList = useCallback(() => execCommand('insertOrderedList'), [execCommand])
  const toggleUnorderedList = useCallback(() => execCommand('insertUnorderedList'), [execCommand])

  const setFontSize = useCallback((size: number) => {
    // execCommand fontSize only accepts 1-7, so we use a workaround
    // We'll use CSS styling via formatBlock or insertHTML
    const doc = getDoc()
    if (!doc) return
    const sel = doc.getSelection()
    if (!sel || sel.rangeCount === 0) return

    // Use a span wrapper approach for precise font sizes
    const range = sel.getRangeAt(0)
    const span = doc.createElement('span')
    span.style.fontSize = `${size}px`
    range.surroundContents(span)
    setIsDirty(true)
    setHasManualEdits(true)
    updateSelectionState()
    updateIframeHeight()
  }, [getDoc, updateSelectionState, setHasManualEdits, updateIframeHeight])

  const increaseFontSize = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.execCommand('fontSize', false, '5') // size 5 is larger
    setIsDirty(true)
    setHasManualEdits(true)
    updateSelectionState()
    updateIframeHeight()
  }, [getDoc, updateSelectionState, setHasManualEdits, updateIframeHeight])

  const decreaseFontSize = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.execCommand('fontSize', false, '2') // size 2 is smaller
    setIsDirty(true)
    setHasManualEdits(true)
    updateSelectionState()
    updateIframeHeight()
  }, [getDoc, updateSelectionState, setHasManualEdits, updateIframeHeight])

  const setTextColor = useCallback((color: string) => {
    execCommand('foreColor', color)
  }, [execCommand])

  const setHighlightColor = useCallback((color: string) => {
    execCommand('hiliteColor', color)
  }, [execCommand])

  const undo = useCallback(() => execCommand('undo'), [execCommand])
  const redo = useCallback(() => execCommand('redo'), [execCommand])
  const clearFormatting = useCallback(() => execCommand('removeFormat'), [execCommand])

  const insertHorizontalRule = useCallback(() => execCommand('insertHorizontalRule'), [execCommand])
  const insertLink = useCallback((url: string) => {
    execCommand('createLink', url)
  }, [execCommand])

  // ─── FIND & REPLACE ───

  const findInDocument = useCallback((query: string): number => {
    const body = getEditableBody()
    if (!body || !query) return 0

    // Remove existing highlights
    body.querySelectorAll('.editor-find-highlight').forEach(el => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el)
        parent.normalize()
      }
    })

    if (!query) return 0

    let count = 0
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, null)
    const textNodes: Text[] = []
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text)
    }

    const lowerQuery = query.toLowerCase()
    for (const node of textNodes) {
      const text = node.textContent || ''
      const lowerText = text.toLowerCase()
      let index = lowerText.indexOf(lowerQuery)

      while (index !== -1) {
        const range = document.createRange()
        range.setStart(node, index)
        range.setEnd(node, index + query.length)

        const span = document.createElement('span')
        span.className = 'editor-find-highlight'
        span.style.backgroundColor = '#fef08a'
        span.style.border = '1px solid #facc15'
        span.style.borderRadius = '2px'
        try {
          range.surroundContents(span)
          count++
        } catch {
          // Skip if range crosses elements
        }

        // Move to next occurrence
        const remainingText = text.substring(index + query.length)
        const nextIndex = remainingText.toLowerCase().indexOf(lowerQuery)
        if (nextIndex === -1) break
        index = index + query.length + nextIndex
      }
    }

    return count
  }, [getEditableBody])

  const replaceInDocument = useCallback((query: string, replacement: string, replaceAll: boolean = false): number => {
    const body = getEditableBody()
    if (!body || !query) return 0

    let count = 0
    const highlights = body.querySelectorAll('.editor-find-highlight')

    for (const hl of Array.from(highlights)) {
      if (!replaceAll && count > 0) break
      const text = hl.textContent || ''
      if (text.toLowerCase() === query.toLowerCase()) {
        hl.replaceWith(document.createTextNode(replacement))
        count++
      }
    }

    if (count > 0) {
      setIsDirty(true)
      setHasManualEdits(true)
      updateIframeHeight()
    }
    updateCounts()
    return count
  }, [getEditableBody, updateCounts, setHasManualEdits, updateIframeHeight])

  const clearFindHighlights = useCallback(() => {
    const body = getEditableBody()
    if (!body) return
    body.querySelectorAll('.editor-find-highlight').forEach(el => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el)
        parent.normalize()
      }
    })
  }, [getEditableBody])

  // ─── GET CONTENT ───

  const getHTMLContent = useCallback((): string => {
    const body = getEditableBody()
    return body?.innerHTML || ''
  }, [getEditableBody])

  const getFullHTMLContent = useCallback((): string => {
    const doc = getDoc()
    if (!doc) return ''
    return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML
  }, [getDoc])

  const getTextContent = useCallback((): string => {
    const body = getEditableBody()
    return body?.innerText || body?.textContent || ''
  }, [getEditableBody])

  return {
    iframeRef,
    selectionState,
    counts,
    isEditorReady,
    handleIframeLoad,
    // Formatting
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    setAlignment,
    toggleOrderedList,
    toggleUnorderedList,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    setTextColor,
    setHighlightColor,
    undo,
    redo,
    clearFormatting,
    insertHorizontalRule,
    insertLink,
    // Find & Replace
    findInDocument,
    replaceInDocument,
    clearFindHighlights,
    // Content
    getHTMLContent,
    getFullHTMLContent,
    getTextContent,
    // Utilities
    updateSelectionState,
    updateCounts,
    // State
    isDirty,
    setIsDirty,
    hasManualEdits,
    setHasManualEdits,
    iframeHeight,
    setIframeHeight,
    updateIframeHeight,
  }
}
