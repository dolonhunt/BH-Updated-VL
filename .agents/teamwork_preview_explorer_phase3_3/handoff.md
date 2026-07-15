# Handoff Report - Phase 3 Requirements Analysis (Read-Only Exploration)

## 1. Observation
Below are the exact observations, file paths, and lines of interest examined in the codebase:

1. **`src/lib/preview-store.ts`**:
   - `PreviewData` interface at lines 3-7 does not contain `hasManualEdits`:
     ```typescript
     export interface PreviewData {
       docType: string
       formData: Record<string, any>
       isDirty?: boolean
     }
     ```
   - No function currently exists to modify the manual edits state directly without replacing form data.

2. **`src/hooks/useDocumentForm.ts`**:
   - Imports `setPreviewDirty` and checks `preview?.isDirty` instead of `hasManualEdits` at lines 70-76 and 85-91:
     ```typescript
     if (preview?.isDirty) {
       const confirmDiscard = window.confirm(
         "Warning: You have made manual edits on the live canvas. Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?"
       )
       if (!confirmDiscard) return
       setPreviewDirty(false)
     }
     ```

3. **`src/hooks/useEditorBridge.ts`**:
   - Defines standard event listeners inside `setupIframeListeners` at lines 139-161, but `cleanupIframeListeners` at lines 164-174 fails to clean up the `keyup` and `mouseup` anonymous listeners:
     ```typescript
     doc.addEventListener('keyup', () => {
       updateSelectionState()
       updateCounts()
     })
     ```
   - Does not expose `hasManualEdits` or `iframeHeight` states.

4. **`src/hooks/useDocumentPreview.ts`**:
   - Exports `handleDownloadPDF` (lines 48-85), `handleDownloadDOC` (lines 87-117), and `handlePrint` (lines 119-147) which fallback directly to static `previewHtml` fetched from the API, without reading live edits made inside the iframe DOM.

5. **`src/components/editor/DocumentCanvas.tsx`**:
   - Wrapper styles (lines 167-175) scale width and height via inline calculations:
     ```typescript
     width: `${794 * (zoomLevel / 100)}px`,
     height: `${iframeHeight * (zoomLevel / 100)}px`,
     ```
   - Iframe uses `srcDoc={previewHtml}` (line 180) and a compound key `key={view + JSON.stringify(docOverrides)}` (line 179) which forces full iframe destruction/reload whenever form overrides or template properties change, losing any manual editing cursor focus and throwing React render reload warnings.

---

## 2. Logic Chain
To satisfy Phase 3 requirements, the following steps must be taken:

1. **State Exposure (R1)**: We must declare `hasManualEdits?: boolean` inside the preview store interface. Then, replace checking `isDirty` with `hasManualEdits` inside the form hooks so that templates are only regenerated upon user confirmation.
2. **Listener Addition (R1)**: We need to register a callback `hasManualEdits` in `useEditorBridge` that listens to `input` and formatting events, and syncs this with the preview store. Cleanups must also properly release event listeners to prevent memory leaks.
3. **Live Exports (R2)**: To export manual canvas edits, we must pass the iframe reference to `useDocumentPreview`. By cloning the live iframe document programmatically, we can strip layout-only elements (like `.no-print` elements, search highlights, and `contenteditable` helper attributes) and feed clean sanitized markup to the PDF, DOC, and Print generators.
4. **Height & Zoom Calculation (R3)**: Storing `iframeHeight` within the editor bridge enables other components to read the size.
5. **Eliminating Iframe Flash (R3)**: By using a `useEffect` that checks for `previewHtml` modifications and writes to the document using `doc.write()`, we bypass JSX-driven `srcDoc` refreshes. The iframe element itself remains stable (remounting only when changing views via `key={view}`), eliminating flashing and state loss.

---

## 3. Caveats
- **Browser Compatibility**: Writing programmatically using `doc.write` might require waiting for the iframe's blank initial document to fully initialize (`readyState === 'complete'`). The recommended fix covers this by checking `iframe.onload`.
- **Styling Persistence**: Live DOM cloning copies styled properties, but external stylesheet links in the preview HTML must be retained so the exported document still renders correctly.
- **Header Props**: Since `Header.tsx` is completely isolated and takes generic callbacks, it does not require any change, as all parsing happens inside `useDocumentPreview` which is called prior to passing props.

---

## 4. Conclusion
Below are the exact recommended code changes to be implemented:

### File 1: `src/lib/preview-store.ts`
```typescript
// Replace lines 3-7:
export interface PreviewData {
  docType: string
  formData: Record<string, any>
  isDirty?: boolean
  hasManualEdits?: boolean
}

// Replace lines 14-24:
export function setPreviewData(
  docType: string,
  formData: Record<string, any>,
  isDirty: boolean = false,
  hasManualEdits: boolean = false
) {
  snapshot = { docType, formData, isDirty, hasManualEdits }
  emitChange()
}

export function setPreviewDirty(isDirty: boolean) {
  if (snapshot) {
    snapshot = { ...snapshot, isDirty }
    emitChange()
  }
}

export function setPreviewHasManualEdits(hasManualEdits: boolean) {
  if (snapshot) {
    snapshot = { ...snapshot, hasManualEdits, isDirty: hasManualEdits }
    emitChange()
  }
}
```

### File 2: `src/hooks/useDocumentForm.ts`
```typescript
// Update imports on line 9:
import { 
  setPreviewData, 
  clearPreviewData, 
  usePreviewData, 
  setPreviewDirty,
  setPreviewHasManualEdits 
} from '@/lib/preview-store'

// Update setField and handleEmployeeChange at lines 69-91 to check preview?.hasManualEdits:
  const setField = useCallback((key: string, value: any) => {
    if (preview?.hasManualEdits) {
      const confirmDiscard = window.confirm(
        "Warning: You have made manual edits on the live canvas. Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setPreviewHasManualEdits(false)
    }
    setFormData(prev => {
      const updated = { ...prev, [key]: value }
      const calculated = onCalculate(updated)
      return { ...updated, ...calculated }
    })
  }, [onCalculate, preview])

  const handleEmployeeChange = useCallback((id: string) => {
    if (preview?.hasManualEdits) {
      const confirmDiscard = window.confirm(
        "Warning: Modifying the selected employee will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setPreviewHasManualEdits(false)
    }
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
  }, [initialData, mapEmployeeToForm, onCalculate, employees, preview])
```

### File 3: `src/hooks/useEditorBridge.ts`
```typescript
// Update imports at line 4:
import { setPreviewDirty, setPreviewHasManualEdits, usePreviewData } from '@/lib/preview-store'

// Inside useEditorBridge hook, add these states:
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

  // Override setIsDirty to also trigger manual edits state
  const setIsDirty = useCallback((dirty: boolean) => {
    setIsDirtyInternal(dirty)
    setPreviewDirty(dirty)
    setPreviewHasManualEdits(dirty)
  }, [])

  // Dynamic iframe height measurement
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

  useEffect(() => {
    const interval = setInterval(updateIframeHeight, 1000)
    return () => clearInterval(interval)
  }, [updateIframeHeight])

  // Update cleanupIframeListeners to include mouseup, keyup, etc.
  const cleanupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.removeEventListener('selectionchange', updateSelectionState)
    doc.removeEventListener('mouseup', updateSelectionState)
    if ((doc as any)._handleInput) {
      doc.removeEventListener('input', (doc as any)._handleInput)
    }
    if ((doc as any)._handleKeyUp) {
      doc.removeEventListener('keyup', (doc as any)._handleKeyUp)
    }
    setIsEditorReady(false)
  }, [getDoc, updateSelectionState])

  // Update setupIframeListeners to properly bind and call height calculation on changes
  const setupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return

    cleanupIframeListeners()

    doc.addEventListener('selectionchange', updateSelectionState)
    
    const handleInput = () => {
      setIsDirty(true)
      updateCounts()
      updateIframeHeight()
    }
    doc.addEventListener('input', handleInput)
    ;(doc as any)._handleInput = handleInput

    const handleKeyUp = () => {
      updateSelectionState()
      updateCounts()
      updateIframeHeight()
    }
    doc.addEventListener('keyup', handleKeyUp)
    ;(doc as any)._handleKeyUp = handleKeyUp

    doc.addEventListener('mouseup', updateSelectionState)

    setIsEditorReady(true)
  }, [getDoc, updateSelectionState, updateCounts, updateIframeHeight, cleanupIframeListeners])

  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setupIframeListeners()
      updateCounts()
      updateIframeHeight()
      setIsDirty(false)
    }, 200)
  }, [setupIframeListeners, updateCounts, updateIframeHeight])

// Expose these from hook return:
  return {
    ...
    isDirty,
    setIsDirty,
    hasManualEdits,
    setHasManualEdits,
    iframeHeight,
    setIframeHeight,
    updateIframeHeight,
  }
```

### File 4: `src/hooks/useDocumentPreview.ts`
```typescript
// Update hook signature:
export function useDocumentPreview(iframeRef?: React.RefObject<HTMLIFrameElement | null>) {
  
  // Add live HTML sanitization helper:
  const getLiveHtml = () => {
    if (!iframeRef || !iframeRef.current) return null
    const iframe = iframeRef.current
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return null

    const docElClone = doc.documentElement.cloneNode(true) as HTMLElement
    
    // Clean layout elements
    docElClone.querySelectorAll('.no-print, [data-no-print]').forEach(el => el.remove())
    docElClone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'))
    
    // Reset search highlight tags
    docElClone.querySelectorAll('.editor-find-highlight').forEach(el => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(doc.createTextNode(el.textContent || ''), el)
      }
    })

    return '<!DOCTYPE html>\n' + docElClone.outerHTML
  }

  // Update exports and print logic:
  const handleDownloadPDF = async () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!preview || !htmlToUse) { ... }
    ...
  }

  const handleDownloadDOC = () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!preview || !htmlToUse) { ... }
    ...
  }

  const handlePrint = () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!htmlToUse) { ... }
    ...
  }

  const handleOpenInNewTab = () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!htmlToUse) { ... }
    ...
  }

  return {
    preview,
    previewHtml,
    previewSrc,
    pdfLoading,
    handleDownloadPDF,
    handleDownloadDOC,
    handlePrint,
    handleOpenInNewTab,
  }
}
```

### File 5: `src/app/page.tsx`
```typescript
// Replace lines 37-46:
  const editor = useEditorBridge()
  const {
    preview,
    previewHtml,
    previewSrc,
    pdfLoading,
    handleDownloadPDF,
    handleDownloadDOC,
    handlePrint,
    handleOpenInNewTab,
  } = useDocumentPreview(editor.iframeRef)

// Replace Header props at lines 95-108:
        onDownloadPDF={() => handleDownloadPDF()}
        onDownloadDOC={() => handleDownloadDOC()}
        onPrint={() => handlePrint()}
        onOpenInNewTab={() => handleOpenInNewTab()}
```

### File 6: `src/components/editor/DocumentCanvas.tsx`
```typescript
// Remove state "iframeHeight" (line 63) and measure "useEffect" (lines 65-82)

// In DocumentCanvasProps, editor type is updated:
  editor: {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
    ...
    iframeHeight: number
    handleIframeLoad: () => void
  }

// Inside DocumentCanvas, add the programmatical iframe content writer effect:
  useEffect(() => {
    const iframe = editor.iframeRef.current
    if (!iframe) return

    const updateIframeContent = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc && previewHtml) {
        doc.open()
        doc.write(previewHtml)
        doc.close()
        editor.handleIframeLoad()
      }
    }

    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc && doc.readyState === 'complete') {
      updateIframeContent()
    } else {
      iframe.onload = updateIframeContent
    }
  }, [previewHtml, view, editor])

// Update JSX canvas part (lines 166-208):
      <div className="flex-1 overflow-auto p-6 bg-slate-100 flex justify-center items-start">
        <div
          style={{
            width: `${794 * (zoomLevel / 100)}px`,
            height: `${editor.iframeHeight * (zoomLevel / 100)}px`,
            position: 'relative',
          }}
          className="shadow-lg rounded-lg bg-white"
        >
          {previewHtml ? (
            <iframe
              ref={editor.iframeRef}
              key={view}
              className="border-0 absolute top-0 left-0"
              style={{
                width: '794px',
                height: `${editor.iframeHeight}px`,
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
```

---

## 5. Verification Method
To verify that these recommendations do not break compilation or static checking, run the following verification commands in the terminal:

1. **TypeScript Check**:
   ```powershell
   bun run tsc
   ```
   (Ensures all imports, type arguments, and prop signatures compile cleanly).

2. **Linting Check**:
   ```powershell
   bun run lint
   ```
   (Ensures formatting, hook dependencies, and JSX elements satisfy ESLint rules).

3. **Runtime Check**:
   - Make a manual edit in the canvas, and then try changing a sidebar input. A prompt warning should trigger.
   - Click "Print" or "Download PDF" after typing manual content. The generated output must display the newly edited content.
   - Zoom in/out to verify document canvas scaling occurs smoothly without iframe flash reloads.
