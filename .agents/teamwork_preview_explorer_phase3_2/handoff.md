# Handoff Report - Phase 3 Requirements Exploration

## 1. Observation
After conducting a read-only exploration of the codebase, we analyzed the 7 requested files and observed the following:

- **`src/lib/preview-store.ts`**:
  - Defines the `PreviewData` interface (lines 3-7) containing `docType`, `formData`, and `isDirty?`.
  - Exposes `setPreviewDirty` (lines 19-24) to flag unsaved edits, but lacks a dedicated `hasManualEdits` property.
  
- **`src/hooks/useDocumentForm.ts`**:
  - Uses `preview?.isDirty` in `setField` (lines 70-76) and `handleEmployeeChange` (lines 85-91) to warn the user that modifying fields will overwrite canvas changes.
  - Resets dirty state via `setPreviewDirty(false)`.

- **`src/hooks/useEditorBridge.ts`**:
  - Contains rich text editor state and functions.
  - Line 60-65 exposes `isDirty` state, calling `setPreviewDirty(dirty)` on changes.
  - In `setupIframeListeners` (lines 139-161), listeners for `selectionchange`, `input`, `keyup`, and `mouseup` are attached to the iframe document, but only `selectionchange` and `input` are cleaned up (lines 164-174), leading to potential event listener memory leaks.
  - Text formatting commands like `setFontSize` (lines 212-226), `increaseFontSize` (lines 228-233), and `decreaseFontSize` (lines 235-240) do not call `setIsDirty(true)` or update the height, meaning manual font scale changes are not recognized as manual edits.

- **`src/hooks/useDocumentPreview.ts`**:
  - Exposes `handleDownloadPDF`, `handleDownloadDOC`, and `handlePrint` (lines 48-147).
  - Currently takes an optional `customHtml` string or falls back to `previewHtml` (which is fetched from `/api/document` and lacks any user manual edits made on the canvas).
  - Does not query `iframeRef` directly, nor does it strip `.no-print` or search-highlight components before export/print.

- **`src/components/editor/DocumentCanvas.tsx`**:
  - Manages a local `iframeHeight` state and polls for heights inside a `useEffect` (lines 63-82).
  - The `iframe` element in JSX (lines 177-201) uses `key={view + JSON.stringify(docOverrides)}`. This causes the entire iframe element to completely unmount and remount every time form fields or overrides change, causing input focus loss and canvas reload issues.
  - Updates the content using the direct `srcDoc={previewHtml}` attribute.

- **`src/components/layout/Header.tsx`**:
  - Serves as the action bar. It accepts print/export callbacks and invokes them correctly without modifying the document state.

- **`src/app/page.tsx`**:
  - Initializes `editor` and `useDocumentPreview` (lines 37-46).
  - Forwards `editor.getFullHTMLContent()` inline to the `Header` callbacks (lines 95-108).

---

## 2. Logic Chain
- **Requirement 1 (R1)**: To cleanly distinguish between form state dirtiness and canvas manual edits, a dedicated `hasManualEdits` flag is required on the preview store. Exposing `setHasManualEdits` in `preview-store.ts` allows `useEditorBridge.ts` to flag manual changes when canvas actions occur. Consequently, `useDocumentForm.ts` must warn users and reset the state using this new flag. Adding `paste` and `cut` event listeners and ensuring proper cleanup prevents memory leaks.
- **Requirement 2 (R2)**: Export and print actions must contain the live canvas edits. Therefore, `useDocumentPreview` needs access to the editor's `iframeRef`. In `useDocumentPreview.ts`, a helper function `getLiveHtml()` should clone the iframe document, safely remove any `.no-print` or `[data-no-print]` elements and search highlights, strip `contenteditable` attributes, and output clean HTML to PDF, DOC, printing, or a new tab.
- **Requirement 3 (R3)**: Moving `iframeHeight` to `useEditorBridge.ts` centralizes iframe layout state. In `DocumentCanvas.tsx`, avoiding unmounting the iframe is achieved by replacing the dynamic key `key={view + JSON.stringify(docOverrides)}` with `key={view}` (so it only remounts on document type changes). Changing how content is updated by shifting the `srcdoc` updates into a `useEffect` ensures that React renders do not reset the iframe contents or trigger reload issues.

---

## 3. Caveats
- If the document stylesheet is large or has slow-loading assets (like remote images), height measurement might execute before the layout is fully rendered. Adding a periodic fallback interval (e.g., 1000ms) in `useEditorBridge.ts` ensures height is corrected dynamically.
- When cloning the iframe DOM inside `useDocumentPreview.ts` using `.cloneNode(true)`, we must handle search highlight elements (`.editor-find-highlight`) by replacing them with plain text nodes, or else the generated PDF/DOC will contain yellow background highlights.

---

## 4. Conclusion & Recommended Code Changes

### File 1: `src/lib/preview-store.ts`
Add `hasManualEdits` to `PreviewData` and expose `setHasManualEdits` to control manual edit alerts.

```typescript
// src/lib/preview-store.ts

export interface PreviewData {
  docType: string
  formData: Record<string, any>
  isDirty?: boolean
  hasManualEdits?: boolean // Add this field
}

// Modify existing functions:
export function setPreviewData(docType: string, formData: Record<string, any>, isDirty: boolean = false) {
  snapshot = { docType, formData, isDirty, hasManualEdits: isDirty }
  emitChange()
}

export function setPreviewDirty(isDirty: boolean) {
  if (snapshot) {
    snapshot = { ...snapshot, isDirty, hasManualEdits: isDirty }
    emitChange()
  }
}

// Add a new setter:
export function setHasManualEdits(hasManualEdits: boolean) {
  if (snapshot) {
    snapshot = { ...snapshot, hasManualEdits, isDirty: hasManualEdits }
    emitChange()
  }
}
```

### File 2: `src/hooks/useDocumentForm.ts`
Import `setHasManualEdits` and update form warning logic to check and reset `hasManualEdits`.

```typescript
// src/hooks/useDocumentForm.ts (around Line 9)
import { 
  setPreviewData, 
  clearPreviewData, 
  usePreviewData, 
  setPreviewDirty,
  setHasManualEdits // Import this
} from '@/lib/preview-store'

// (around Line 70)
  const setField = useCallback((key: string, value: any) => {
    if (preview?.hasManualEdits) { // Check hasManualEdits
      const confirmDiscard = window.confirm(
        "Warning: You have made manual edits on the live canvas. Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setHasManualEdits(false) // Reset manual edits flag
    }
    setFormData(prev => {
      const updated = { ...prev, [key]: value }
      const calculated = onCalculate(updated)
      return { ...updated, ...calculated }
    })
  }, [onCalculate, preview])

// (around Line 85)
  const handleEmployeeChange = useCallback((id: string) => {
    if (preview?.hasManualEdits) { // Check hasManualEdits
      const confirmDiscard = window.confirm(
        "Warning: Modifying the selected employee will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setHasManualEdits(false) // Reset manual edits flag
    }
    setSelectedEmployeeId(id)
    ...
```

### File 3: `src/hooks/useEditorBridge.ts`
Add `iframeHeight` state, hook up `setHasManualEdits`, expand listeners (`paste`, `cut`), fix the listener cleanup leaks, and trigger height updates during formatting commands.

```typescript
// src/hooks/useEditorBridge.ts
import { setPreviewDirty, setHasManualEdits } from '@/lib/preview-store' // Update imports

export function useEditorBridge() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [selectionState, setSelectionState] = useState<SelectionState>(DEFAULT_SELECTION)
  const [counts, setCounts] = useState<EditorCounts>({ words: 0, characters: 0, charactersNoSpaces: 0 })
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isDirty, setIsDirtyInternal] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(1123) // Add height state

  const setIsDirty = useCallback((dirty: boolean) => {
    setIsDirtyInternal(dirty)
    setHasManualEdits(dirty) // Set manual edits flag in store
  }, [])

  const updateHeight = useCallback(() => {
    try {
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
    } catch (err) {
      console.error('Failed to update height:', err)
    }
  }, [])

  // Callbacks for events to allow clean removal
  const handleKeyup = useCallback(() => {
    updateSelectionState()
    updateCounts()
    updateHeight()
  }, [updateSelectionState, updateCounts, updateHeight])

  const handleMouseup = useCallback(() => {
    updateSelectionState()
  }, [updateSelectionState])

  const handleInput = useCallback(() => {
    setIsDirty(true)
    updateCounts()
    updateHeight()
  }, [setIsDirty, updateCounts, updateHeight])

  // Set up event listeners on the iframe
  const setupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return

    doc.addEventListener('selectionchange', updateSelectionState)
    doc.addEventListener('input', handleInput)
    doc.addEventListener('keyup', handleKeyup)
    doc.addEventListener('mouseup', handleMouseup)
    doc.addEventListener('paste', handleInput)
    doc.addEventListener('cut', handleInput)

    // Store callbacks for proper cleanup
    ;(doc as any)._handleInput = handleInput
    ;(doc as any)._handleKeyup = handleKeyup
    ;(doc as any)._handleMouseup = handleMouseup

    setIsEditorReady(true)
  }, [getDoc, updateSelectionState, handleInput, handleKeyup, handleMouseup])

  // Clean up listeners fully (prevent memory leaks)
  const cleanupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.removeEventListener('selectionchange', updateSelectionState)
    if ((doc as any)._handleInput) {
      doc.removeEventListener('input', (doc as any)._handleInput)
      doc.removeEventListener('paste', (doc as any)._handleInput)
      doc.removeEventListener('cut', (doc as any)._handleInput)
    }
    if ((doc as any)._handleKeyup) {
      doc.removeEventListener('keyup', (doc as any)._handleKeyup)
    }
    if ((doc as any)._handleMouseup) {
      doc.removeEventListener('mouseup', (doc as any)._handleMouseup)
    }
    setIsEditorReady(false)
  }, [getDoc, updateSelectionState])

  // When iframe loads, set up listeners
  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setupIframeListeners()
      updateCounts()
      updateHeight()
      setIsDirty(false)
    }, 200)
  }, [setupIframeListeners, updateCounts, updateHeight])

  // Polling for height adjustments
  useEffect(() => {
    const interval = setInterval(updateHeight, 1000)
    return () => clearInterval(interval)
  }, [updateHeight])

  // Update execCommand to also updateHeight
  const execCommand = useCallback((command: string, value?: string) => {
    const doc = getDoc()
    if (!doc) return
    const body = getEditableBody()
    if (body) body.focus()
    doc.execCommand(command, false, value)
    setIsDirty(true)
    updateSelectionState()
    updateCounts()
    updateHeight()
  }, [getDoc, getEditableBody, updateSelectionState, updateCounts, setIsDirty, updateHeight])

  // Update Font Size commands to set dirty & update height
  const setFontSize = useCallback((size: number) => {
    const doc = getDoc()
    if (!doc) return
    const sel = doc.getSelection()
    if (!sel || sel.rangeCount === 0) return

    const range = sel.getRangeAt(0)
    const span = doc.createElement('span')
    span.style.fontSize = `${size}px`
    range.surroundContents(span)
    
    setIsDirty(true)
    updateSelectionState()
    updateHeight()
  }, [getDoc, updateSelectionState, setIsDirty, updateHeight])

  const increaseFontSize = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.execCommand('fontSize', false, '5')
    setIsDirty(true)
    updateSelectionState()
    updateHeight()
  }, [getDoc, updateSelectionState, setIsDirty, updateHeight])

  const decreaseFontSize = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.execCommand('fontSize', false, '2')
    setIsDirty(true)
    updateSelectionState()
    updateHeight()
  }, [getDoc, updateSelectionState, setIsDirty, updateHeight])

  const clearFormatting = useCallback(() => {
    execCommand('removeFormat')
    updateHeight()
  }, [execCommand, updateHeight])

  // Return statements include height and updates
  return {
    ...
    isDirty,
    setIsDirty,
    iframeHeight,
    updateHeight,
  }
}
```

### File 4: `src/hooks/useDocumentPreview.ts`
Modify the hook signature to accept `iframeRef` and dynamically build, clean, and output the live canvas contents for print/PDF/DOC.

```typescript
// src/hooks/useDocumentPreview.ts

export function useDocumentPreview(iframeRef?: React.RefObject<HTMLIFrameElement | null>) {
  const preview = usePreviewData()
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const prevBlobRef = useRef<string>('')

  // Helper to extract and sanitize HTML from iframe
  const getLiveHtml = (): string => {
    if (iframeRef?.current) {
      try {
        const iframe = iframeRef.current
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc) {
          // Clone the live DOM
          const clone = doc.documentElement.cloneNode(true) as HTMLElement
          
          // Remove elements with class 'no-print' or '[data-no-print]'
          clone.querySelectorAll('.no-print, [data-no-print]').forEach(el => el.remove())
          
          // Flatten search highlight highlights to plain text nodes
          clone.querySelectorAll('.editor-find-highlight').forEach(el => {
            const parent = el.parentNode
            if (parent) {
              parent.replaceChild(doc.createTextNode(el.textContent || ''), el)
              parent.normalize()
            }
          })
          
          // Strip contenteditable attribute
          clone.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable')
          })

          return '<!DOCTYPE html>\n' + clone.outerHTML
        }
      } catch (err) {
        console.error('Failed to get live HTML from iframe:', err)
      }
    }
    return previewHtml
  }

  // Update exports and print to use getLiveHtml()
  const handleDownloadPDF = async (customHtml?: string) => {
    const htmlToUse = customHtml || getLiveHtml()
    if (!preview || !htmlToUse) {
      toast.error('No document preview generated yet.')
      return
    }
    setPdfLoading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const container = document.createElement('div')
      container.innerHTML = htmlToUse
      const pageEl = container.querySelector('.page') || container.querySelector('.doc-wrapper') || container
      document.body.appendChild(container)

      const docLabel = preview.docType.replace('_', '-')
      const fileName = preview.formData.name 
        ? `${docLabel}-${preview.formData.name.replace(/\s+/g, '-')}`
        : `${docLabel}-${new Date().getTime()}`

      const opt = {
        margin: 0,
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as string[] }
      }

      await html2pdf().set(opt).from(pageEl as HTMLElement).save()
      document.body.removeChild(container)
      toast.success('PDF downloaded successfully')
    } catch (err) {
      console.error(err)
      toast.error('PDF generation failed.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleDownloadDOC = (customHtml?: string) => {
    const htmlToUse = customHtml || getLiveHtml()
    if (!preview || !htmlToUse) {
      toast.error('No document preview generated yet.')
      return
    }
    try {
      const wordHtml = htmlToUse.includes('<html') 
        ? htmlToUse 
        : `<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Document</title></head><body>${htmlToUse}</body></html>`
      const blob = new Blob([wordHtml], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      
      const docLabel = preview.docType.replace('_', '-')
      const fileName = preview.formData.name 
        ? `${docLabel}-${preview.formData.name.replace(/\s+/g, '-')}`
        : `${docLabel}-${new Date().getTime()}`

      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('DOC downloaded successfully')
    } catch (err) {
      console.error(err)
      toast.error('DOC generation failed.')
    }
  }

  const handlePrint = (customHtml?: string) => {
    const htmlToUse = customHtml || getLiveHtml()
    if (!htmlToUse) {
      toast.error('No document preview to print.')
      return
    }
    const printWin = window.open('', '_blank')
    if (printWin) {
      printWin.document.open()
      printWin.document.write(htmlToUse)
      printWin.document.close()
      
      const runPrint = () => {
        try {
          printWin.focus()
          printWin.print()
        } catch (err) {
          console.error('Auto print failed:', err)
        }
      }

      if (printWin.document.readyState === 'complete') {
        runPrint()
      } else {
        printWin.onload = runPrint
      }
    }
  }

  const handleOpenInNewTab = () => {
    const htmlToUse = getLiveHtml()
    if (!htmlToUse) return
    const win = window.open('', '_blank')
    if (win) {
      win.document.open()
      win.document.write(htmlToUse)
      win.document.close()
    }
  }

  return {
    preview,
    previewHtml,
    previewSrc,
    pdfLoading,
    handleDownloadPDF,
    handleDownloadDOC,
    handlePrint,
    handleOpenInNewTab, // Expose this callback
  }
}
```

### File 5: `src/components/editor/DocumentCanvas.tsx`
Remove local `iframeHeight` state/effects. Update `srcdoc` via `useEffect` and keep the iframe element mounted by replacing the dynamic key with `key={view}`.

```typescript
// src/components/editor/DocumentCanvas.tsx

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
  // Remove local iframeHeight state and measurement useEffect:
  // const [iframeHeight, setIframeHeight] = useState(1123)
  // useEffect(() => { ... })

  // Add useEffect to handle programmatically updating iframe srcdoc to avoid rendering reload cycles
  const lastLoadedHtmlRef = useRef('')

  useEffect(() => {
    const iframe = editor.iframeRef.current
    if (iframe && previewHtml && previewHtml !== lastLoadedHtmlRef.current) {
      iframe.srcdoc = previewHtml
      lastLoadedHtmlRef.current = previewHtml
    }
  }, [previewHtml, editor.iframeRef])

  ...
  return (
    ...
      {/* ─── Document Canvas ─── */}
      <div className="flex-1 overflow-auto p-6 bg-slate-100 flex justify-center items-start">
        <div
          style={{
            width: `${794 * (zoomLevel / 100)}px`,
            height: `${editor.iframeHeight * (zoomLevel / 100)}px`, // Use editor height state
            position: 'relative',
            overflow: 'hidden',
          }}
          className="shadow-lg rounded-lg bg-white origin-top"
        >
          {previewHtml ? (
            <iframe
              ref={editor.iframeRef}
              key={view} // Only remount when changing doc type, not on text changes!
              onLoad={() => {
                editor.handleIframeLoad()
              }}
              className="border-0 absolute top-0 left-0"
              style={{
                width: '794px',
                height: `${editor.iframeHeight}px`, // Use editor height state
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
              }}
              title="Document Editor"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-300 text-sm">
              Loading preview...
            </div>
          )}
        </div>
      </div>
  )
}
```

### File 6: `src/app/page.tsx`
Update `useDocumentPreview` to receive `editor.iframeRef` and delegate clean callbacks to `Header`.

```typescript
// src/app/page.tsx (around lines 37-46)
  const editor = useEditorBridge()
  const {
    preview,
    previewHtml,
    previewSrc,
    pdfLoading,
    handleDownloadPDF,
    handleDownloadDOC,
    handlePrint,
    handleOpenInNewTab, // Expose
  } = useDocumentPreview(editor.iframeRef) // Pass iframeRef here

// (around lines 90-109)
      {/* HEADER */}
      <Header
        sidebarExpanded={sidebarExpanded}
        view={view}
        pdfLoading={pdfLoading}
        previewSrc={previewSrc}
        onDownloadPDF={handleDownloadPDF} // Delegate directly
        onDownloadDOC={handleDownloadDOC} // Delegate directly
        onPrint={handlePrint}             // Delegate directly
        onOpenInNewTab={handleOpenInNewTab} // Delegate directly
      />
```

---

## 5. Verification Method

To independently verify these improvements after implementation:
1. **Interactive Manual Test**:
   - Select a document type (e.g., *Official Pad*).
   - Enter text into the sidebar form. Confirm the canvas updates without losing cursor/input focus.
   - Click inside the iframe document and manually edit a text block (e.g. type "Edited Content"). Verify that `preview.hasManualEdits` is set to `true`.
   - Now, attempt to modify a form field in the sidebar. Verify that a browser confirmation warning dialog pops up alerting you that your manual changes will be lost.
   - Click "Cancel". Confirm that the manual edits remain intact.
   - Modify the form field again, and click "OK". Confirm the canvas template regenerates and resets the warning flag.
2. **Export and Print Test**:
   - Manually modify text on the canvas.
   - Click the "PDF" or "Print" button.
   - Inspect the generated document. Verify that the manually modified text is correctly reflected in the PDF/print output, and that any find-replace highlights or contenteditable markers are cleaned up and absent.
3. **Responsive Zoom & Height Verification**:
   - Adjust the zoom percentage using the toolbar controls. Verify that the scale transform is applied and that the white document wrapper scales and clips correctly.
   - Add multiple lines inside the document to increase its length. Verify that the iframe's height expands dynamically to accommodate the text.
