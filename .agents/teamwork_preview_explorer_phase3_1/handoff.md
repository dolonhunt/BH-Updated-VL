# Phase 3 Exploration & Recommended Changes Report

This handoff report presents the findings, analysis, and precise changes recommended to implement Phase 3 requirements.

---

## 1. Observation

Detailed examination of the specified files was conducted. Below are the findings for each file:

### File 1: `src/lib/preview-store.ts` (Lines 1 to 43)
- **Current State**: The external store tracks `PreviewData` containing `docType`, `formData`, and an optional `isDirty` flag. 
- **Code Block**:
  ```typescript
  export interface PreviewData {
    docType: string
    formData: Record<string, any>
    isDirty?: boolean
  }
  ...
  export function setPreviewDirty(isDirty: boolean) {
    if (snapshot) {
      snapshot = { ...snapshot, isDirty }
      emitChange()
    }
  }
  ```
- **Needs**: Needs exposure of `hasManualEdits` state and its corresponding setter, similar to `isDirty`/`setPreviewDirty`, to track manual canvas modifications and prevent form synchronization overrides.

### File 2: `src/hooks/useDocumentForm.ts` (Lines 1 to 152)
- **Current State**: Uses the preview store's `isDirty` flag in `setField` and `handleEmployeeChange` to prompt user confirmation before discarding manual changes.
- **Code Block** (Lines 70-76, 84-91):
  ```typescript
  const setField = useCallback((key: string, value: any) => {
    if (preview?.isDirty) {
      const confirmDiscard = window.confirm(
        "Warning: You have made manual edits on the live canvas. Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setPreviewDirty(false)
    }
  ```
- **Needs**: Update from `preview?.isDirty` and `setPreviewDirty(false)` to `preview?.hasManualEdits` and `setPreviewHasManualEdits(false)`.

### File 3: `src/hooks/useEditorBridge.ts` (Lines 1 to 407)
- **Current State**: Tracks selection state, character counts, finds/replaces, and exposes `isDirty`/`setIsDirty` hooks which invoke `setPreviewDirty` from the preview store. Listeners inside `setupIframeListeners` only cover `selectionchange`, `input`, `keyup`, and `mouseup`.
- **Code Block** (Lines 60-65, 139-174):
  ```typescript
  const [isDirty, setIsDirtyInternal] = useState(false)
  const setIsDirty = useCallback((dirty: boolean) => {
    setIsDirtyInternal(dirty)
    setPreviewDirty(dirty)
  }, [])
  ```
- **Needs**:
  1. Transition to/incorporate `hasManualEdits` tracking (`hasManualEdits` state and `setHasManualEdits` setter).
  2. Implement `iframeHeight` state and a periodic/dynamic height measurement helper (`updateHeight`).
  3. Expand event listeners (`paste`, `cut`, `drop`) on the iframe document to flag manual edits on any clipboard or drag-and-drop actions.
  4. Ensure `handleIframeLoad` properly measures height and resets `hasManualEdits` upon template regeneration/reloads.

### File 4: `src/hooks/useDocumentPreview.ts` (Lines 1 to 168)
- **Current State**: Fetches document previews from the server and exposes handlers for PDF (`handleDownloadPDF`), Word (`handleDownloadDOC`), and printing (`handlePrint`) that only fall back to the static `previewHtml`.
- **Code Block** (Lines 48-147):
  ```typescript
  export function useDocumentPreview() { ... }
  ```
- **Needs**:
  1. Accept `iframeRef` as a parameter to the hook: `useDocumentPreview(iframeRef?: React.RefObject<HTMLIFrameElement | null>)`.
  2. Add a helper function `getCleanIframeHtml()` to extract `outerHTML` from the iframe, clean up any `.no-print` elements, strip `contenteditable` attributes, and replace `.editor-find-highlight` tags with plain text.
  3. Update `handleDownloadPDF`, `handleDownloadDOC`, and `handlePrint` to prioritize the cleaned iframe HTML to preserve manual live edits and avoid exporting UI decorations.

### File 5: `src/components/editor/DocumentCanvas.tsx` (Lines 1 to 219)
- **Current State**: Contains a local `iframeHeight` state and a 1-second interval to update it. The iframe renders via the `srcDoc={previewHtml}` prop and mounts/unmounts dynamically based on `key={view + JSON.stringify(docOverrides)}`.
- **Code Block** (Lines 63-82, 166-208):
  ```typescript
  const [iframeHeight, setIframeHeight] = useState(1123)
  useEffect(() => { ... interval to setIframeHeight ... })
  ...
  <iframe srcDoc={previewHtml} key={view + JSON.stringify(docOverrides)} ... />
  ```
- **Needs**:
  1. Remove local `iframeHeight` state and local measurement `useEffect`. Consume `editor.iframeHeight` from the editor bridge.
  2. Change key to `key={view}` so the iframe element is NOT unmounted and remounted during edits of the same document type.
  3. Add a dedicated `useEffect` to programmatically update `iframeRef.current.srcdoc = previewHtml` only when `previewHtml` changes, preventing React render/diffing reloads.
  4. Pass `editor.iframeHeight` to the canvas wrapper dimensions to correctly scale the viewport bounds.

### File 6: `src/components/layout/Header.tsx` (Lines 1 to 151)
- **Current State**: Purely presentational header buttons that execute callback functions passed as props (`onDownloadPDF`, `onDownloadDOC`, `onPrint`, `onOpenInNewTab`).
- **Needs**: No direct code changes required; all integration is handled by the parent components.

### File 7: `src/app/page.tsx` (Lines 1 to 201)
- **Current State**: Serves as the main container orchestrating the state of document forms, canvas, and header toolbar.
- **Code Block** (Lines 37-46, 95-108, 153-170):
  ```typescript
  const editor = useEditorBridge()
  const { ... } = useDocumentPreview()
  ...
  onDownloadPDF={() => handleDownloadPDF(editor.getFullHTMLContent())}
  ...
  ```
- **Needs**:
  1. Pass `editor.iframeRef` to `useDocumentPreview`.
  2. Simplify action callbacks in `Header` by delegating directly to hook helpers (including a new `handleOpenInNewTab` helper exposed by the preview hook).
  3. Intercept `setDocOverrides` to prompt a confirmation warning if the user attempts to load a saved version via `VersionManager` while manual edits exist.

---

## 2. Logic Chain

1. **R1 (Live Editing State Management)**: Exposing `hasManualEdits` in `preview-store.ts` allows any hook or component to query or reset the state. In `useDocumentForm.ts`, prompting when `preview?.hasManualEdits` is true protects manual canvas changes. By subscribing to `input`, `keyup`, `paste`, `cut`, and `drop` events in `useEditorBridge.ts`, all keyboard, clipboard, and drag actions are accurately detected, setting `hasManualEdits` to true.
2. **R2 (Clean Exports/Print)**: Retrieving the document content directly from the live `iframeRef` ensures that manual edits are exported, instead of just the original server-rendered HTML. Cloning the document element and executing `.remove()` on all `.no-print` classes and stripping `contenteditable` attributes strips out helper elements and text highlight overlays, resulting in clean PDF/DOC/Print outputs.
3. **R3 (Smooth Rendering and Scaling)**: Setting the `srcdoc` property dynamically inside a `useEffect` prevents React from reloading the iframe on unrelated wrapper/render updates (like selections or zoom changes). Elevating the `iframeHeight` state to the `useEditorBridge` hook simplifies state management, avoids duplicate intervals, and allows instant updates during input. Adjusting the wrapper's styles using `editor.iframeHeight` guarantees correct aspect ratios and scroll container bounds at all zoom levels.

---

## 3. Caveats

- **Browser Context**: The programmatic update `iframe.srcdoc = previewHtml` triggers a browser frame load event. The event handlers registered on `iframe.onLoad` will still execute as expected.
- **External stylesheets**: The clean HTML output assumes that the CSS layout rules are embedded or fully loaded within the iframe. This matches the current implementation of templates returning self-contained documents.
- **`html2pdf.js` imports**: Since `html2pdf.js` is imported dynamically inside `useDocumentPreview.ts`, care must be taken to ensure it loads correctly in client-side bundles without SSR issues.

---

## 4. Conclusion

Phase 3 requirements can be satisfied by modifying the five central files (`preview-store.ts`, `useDocumentForm.ts`, `useEditorBridge.ts`, `useDocumentPreview.ts`, `DocumentCanvas.tsx`) and integrating their hooks in `page.tsx`. Detailed instructions and before-to-after snippets for each file are proposed in Section 5.

---

## 5. Verification Method

### Recommended Code Changes (Diff/Snippets)

#### A. `src/lib/preview-store.ts`
Expose `hasManualEdits` state and its setter:
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
    snapshot = { ...snapshot, hasManualEdits }
    emitChange()
  }
}
```

#### B. `src/hooks/useDocumentForm.ts`
Update prompts to check `hasManualEdits`:
```typescript
// Replace imports on line 9:
import { setPreviewData, clearPreviewData, usePreviewData, setPreviewHasManualEdits } from '@/lib/preview-store'

// Replace lines 70-76:
  const setField = useCallback((key: string, value: any) => {
    if (preview?.hasManualEdits) {
      const confirmDiscard = window.confirm(
        "Warning: You have made manual edits on the live canvas. Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setPreviewHasManualEdits(false)
    }

// Replace lines 85-91:
  const handleEmployeeChange = useCallback((id: string) => {
    if (preview?.hasManualEdits) {
      const confirmDiscard = window.confirm(
        "Warning: Modifying the selected employee will regenerate the template and discard your manual changes. Do you want to proceed?"
      )
      if (!confirmDiscard) return
      setPreviewHasManualEdits(false)
    }
```

#### C. `src/hooks/useEditorBridge.ts`
Implement `hasManualEdits` and dynamic height calculation:
```typescript
// Replace imports on line 4:
import { setPreviewHasManualEdits } from '@/lib/preview-store'

// Replace bridge state and setup (lines 55-65):
export function useEditorBridge() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [selectionState, setSelectionState] = useState<SelectionState>(DEFAULT_SELECTION)
  const [counts, setCounts] = useState<EditorCounts>({ words: 0, characters: 0, charactersNoSpaces: 0 })
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [hasManualEdits, setHasManualEditsInternal] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(1123)

  const setHasManualEdits = useCallback((val: boolean) => {
    setHasManualEditsInternal(val)
    setPreviewHasManualEdits(val)
  }, [])

  const updateHeight = useCallback(() => {
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
    const interval = setInterval(updateHeight, 1000)
    return () => clearInterval(interval)
  }, [updateHeight])

// Update execCommand to flag manual edits:
  const execCommand = useCallback((command: string, value?: string) => {
    const doc = getDoc()
    if (!doc) return
    const body = getEditableBody()
    if (body) body.focus()
    doc.execCommand(command, false, value)
    setHasManualEdits(true)
    updateSelectionState()
    updateCounts()
    updateHeight()
  }, [getDoc, getEditableBody, updateSelectionState, updateCounts, updateHeight, setHasManualEdits])

// Update setupIframeListeners & cleanup:
  const setupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return

    doc.addEventListener('selectionchange', updateSelectionState)
    
    const handleInput = () => {
      setHasManualEdits(true)
      updateCounts()
      updateHeight()
    }
    doc.addEventListener('input', handleInput)
    doc.addEventListener('keyup', () => {
      updateSelectionState()
      updateCounts()
      updateHeight()
    })
    doc.addEventListener('mouseup', updateSelectionState)
    doc.addEventListener('paste', handleInput)
    doc.addEventListener('cut', handleInput)
    doc.addEventListener('drop', handleInput)

    setIsEditorReady(true)
    ;(doc as any)._handleInput = handleInput
  }, [getDoc, updateSelectionState, updateCounts, updateHeight, setHasManualEdits])

  const cleanupIframeListeners = useCallback(() => {
    const doc = getDoc()
    if (!doc) return
    doc.removeEventListener('selectionchange', updateSelectionState)
    if ((doc as any)._handleInput) {
      doc.removeEventListener('input', (doc as any)._handleInput)
      doc.removeEventListener('paste', (doc as any)._handleInput)
      doc.removeEventListener('cut', (doc as any)._handleInput)
      doc.removeEventListener('drop', (doc as any)._handleInput)
    } else {
      doc.removeEventListener('input', updateCounts)
    }
    setIsEditorReady(false)
  }, [getDoc, updateSelectionState, updateCounts])

  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      setupIframeListeners()
      updateCounts()
      updateHeight()
      setHasManualEdits(false)
    }, 200)
  }, [setupIframeListeners, updateCounts, updateHeight, setHasManualEdits])
```

#### D. `src/hooks/useDocumentPreview.ts`
Implement clean exports querying `iframeRef`:
```typescript
export function useDocumentPreview(iframeRef?: React.RefObject<HTMLIFrameElement | null>) {
  const preview = usePreviewData()
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const prevBlobRef = useRef<string>('')

  const getCleanIframeHtml = () => {
    const iframe = iframeRef?.current
    if (!iframe) return null
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return null
    
    const clone = doc.documentElement.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.no-print').forEach(el => el.remove())
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'))
    clone.querySelectorAll('.editor-find-highlight').forEach(el => el.replaceWith(el.textContent || ''))
    
    return '<!DOCTYPE html>\n' + clone.outerHTML
  }

  const handleDownloadPDF = async (customHtml?: string) => {
    const cleanHtml = getCleanIframeHtml()
    const htmlToUse = cleanHtml || customHtml || previewHtml
    ...
  }

  const handleDownloadDOC = (customHtml?: string) => {
    const cleanHtml = getCleanIframeHtml()
    const htmlToUse = cleanHtml || customHtml || previewHtml
    ...
  }

  const handlePrint = (customHtml?: string) => {
    const cleanHtml = getCleanIframeHtml()
    const htmlToUse = cleanHtml || customHtml || previewHtml
    ...
  }

  const handleOpenInNewTab = () => {
    const cleanHtml = getCleanIframeHtml()
    const htmlToUse = cleanHtml || previewHtml
    if (!htmlToUse) return
    const win = window.open('', '_blank')
    if (win) {
      win.document.open()
      win.document.write(htmlToUse)
      win.document.close()
    }
  }

  return {
    ...,
    handlePrint,
    handleOpenInNewTab,
  }
}
```

#### E. `src/components/editor/DocumentCanvas.tsx`
Programmatically update iframe `srcdoc` in `useEffect`, consume `editor.iframeHeight`:
```typescript
// Replace lines 63-82 with:
  useEffect(() => {
    const iframe = editor.iframeRef.current
    if (iframe && previewHtml) {
      iframe.srcdoc = previewHtml
    }
  }, [previewHtml, editor.iframeRef])

// Modify iframe jsx:
          {previewHtml ? (
            <iframe
              ref={editor.iframeRef}
              key={view}
              onLoad={() => {
                editor.handleIframeLoad()
              }}
              className="border-0 absolute top-0 left-0"
              style={{
                width: '794px',
                height: `${editor.iframeHeight}px`,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top left',
              }}
              title="Document Editor"
            />
          ) : ...
```

#### F. `src/app/page.tsx`
Update hook call, clean action methods, and intercept version load:
```typescript
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

  // In Header component registration:
      <Header
        sidebarExpanded={sidebarExpanded}
        view={view}
        pdfLoading={pdfLoading}
        previewSrc={previewSrc}
        onDownloadPDF={() => handleDownloadPDF()}
        onDownloadDOC={() => handleDownloadDOC()}
        onPrint={() => handlePrint()}
        onOpenInNewTab={() => handleOpenInNewTab()}
      />

  // In DocumentCanvas component registration:
              <DocumentCanvas
                view={view}
                docOverrides={preview?.formData || {}}
                setDocOverrides={(overrides) => {
                  if (editor.hasManualEdits) {
                    const confirmDiscard = window.confirm(
                      "Warning: You have made manual edits on the live canvas. Loading a saved version will discard your manual changes. Do you want to proceed?"
                    )
                    if (!confirmDiscard) return
                    editor.setHasManualEdits(false)
                  }
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
```

---

### Verification Commands

To independently verify these proposed changes after implementation:

1. **Syntax / Compilation Check**:
   Run TypeScript compiler checks to ensure that all hook signatures, props, interfaces, and state usages compile correctly without type issues:
   ```bash
   bun run tsc
   ```

2. **Linter Check**:
   Ensure that ESLint catches any unused variables or style issues:
   ```bash
   bun run lint
   ```

3. **Behavioral Invalidation Conditions**:
   - Verify that modifying a form field after making manual edits inside the iframe correctly shows the confirmation warning. If "Cancel" is clicked, the edit must remain; if "Proceed", the change propagates.
   - Verify that loading a template version from the `VersionManager` shows the confirmation warning when manual edits are present.
   - Verify that PDF/DOC exports and Print outputs preserve manual edits made in the canvas and contain no `.no-print` (e.g. status bar, controls) or visual editor decorations (e.g., spelling highlights, cursor indicators).
   - Verify that zooming in/out of the document canvas operates smoothly without iframe reloads or focus loss on the editor cursor.
