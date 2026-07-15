# Phase 3 Optimization Investigation - Handoff Report

## 1. Observation

### Live Canvas Editing & Synchronization (R1)
- **Document Canvas Definition**:
  - Located in `src/components/editor/DocumentCanvas.tsx` (lines 50-218).
  - Iframe initialization is defined at lines 177-201:
    ```typescript
    <iframe
      ref={editor.iframeRef}
      key={view + JSON.stringify(docOverrides)}
      srcDoc={previewHtml}
      onLoad={() => {
        editor.handleIframeLoad()
        setTimeout(() => {
          const iframe = editor.iframeRef.current
          if (iframe) {
            const doc = iframe.contentDocument || iframe.contentWindow?.document
            if (doc && doc.body) {
              setIframeHeight(Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, 1123))
            }
          }
        }, 300)
      }}
      className="border-0 absolute top-0 left-0"
      style={{
        width: '794px',
        height: `${iframeHeight}px`,
        transform: `scale(${zoomLevel / 100})`,
        transformOrigin: 'top left',
      }}
      title="Document Editor"
    />
    ```
- **Iframe Event Listeners**:
  - Located in `src/hooks/useEditorBridge.ts` under `setupIframeListeners` (lines 191-218):
    ```typescript
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
    ```
- **Toolbar Formatting Commands**:
  - Located in `src/hooks/useEditorBridge.ts` lines 163-173, formatting toolbar edits use `doc.execCommand` on the iframe document after focusing its body:
    ```typescript
    const execCommand = useCallback((command: string, value?: string) => {
      const doc = getDoc()
      if (!doc) return
      const body = getEditableBody()
      if (body) body.focus()
      doc.execCommand(command, false, value)
      setIsDirty(true)
      updateSelectionState()
      updateCounts()
    }, [getDoc, getEditableBody, updateSelectionState, updateCounts])
    ```
- **Preview State Management**:
  - The preview store is a custom vanilla React store using `useSyncExternalStore` defined in `src/lib/preview-store.ts` (lines 1-56), which manages the `PreviewData` snapshot containing `docType`, `formData`, `isDirty`, and `hasManualEdits`.
  - The `useDocumentPreview` hook in `src/hooks/useDocumentPreview.ts` (lines 7-46) subscribes to this store. When `preview` changes, it sends a POST request to `/api/document` to fetch the updated HTML template, storing it in the `previewHtml` state.
- **Manual Edits Loss & Discard Warnings**:
  - In `src/hooks/useDocumentForm.ts` (lines 69-82), when updating form fields via `setField`:
    ```typescript
    const setField = useCallback((key: string, value: any) => {
      if (preview?.hasManualEdits) {
        const confirmDiscard = window.confirm(
          "Warning: You have made manual edits on the live canvas. Modifying form fields will regenerate the template and discard your manual changes. Do you want to proceed?"
        )
        if (!confirmDiscard) return
        setPreviewHasManualEdits(false)
      }
      setFormData(prev => { ... })
    })
    ```
  - If proceeded, the form data is saved, debounced by 400ms in `useEffect` (lines 45-57), which calls `setPreviewData(docType, formData)`. This resets `hasManualEdits` and `isDirty` back to `false` and triggers an iframe unmount/remount because the iframe key depends on `JSON.stringify(docOverrides)`.

---

### Print, PDF, and DOC Download (R2)
- **Export Buttons**:
  - Located in `src/components/layout/Header.tsx` (lines 115-146) as pill buttons:
    - **PDF**: `onClick={onDownloadPDF}`
    - **DOC**: `onClick={onDownloadDOC}`
    - **Print**: `onClick={onPrint}`
    - **Open in New Tab**: `onClick={onOpenInNewTab}`
- **DOM Access**:
  - Handlers mapped in `src/app/page.tsx` (lines 95-108) pass `editor.getFullHTMLContent()` to the export functions:
    ```typescript
    onDownloadPDF={() => handleDownloadPDF(editor.getFullHTMLContent())}
    onDownloadDOC={() => handleDownloadDOC(editor.getFullHTMLContent())}
    onPrint={() => handlePrint(editor.getFullHTMLContent())}
    onOpenInNewTab={() => {
      const html = editor.getFullHTMLContent()
      if (html) {
        const win = window.open('', '_blank')
        if (win) {
          win.document.open()
          win.document.write(html)
          win.document.close()
        }
      }
    }}
    ```
  - `getFullHTMLContent()` in `src/hooks/useEditorBridge.ts` (lines 401-405) queries the iframe directly:
    ```typescript
    const getFullHTMLContent = useCallback((): string => {
      const doc = getDoc()
      if (!doc) return ''
      return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML
    }, [getDoc])
    ```
- **PDF Generation Libraries**:
  - Client-side: `html2pdf.js` is loaded dynamically and executed in `useDocumentPreview.ts` (lines 48-85). It captures the HTML container as a canvas image using `html2canvas` and generates a PDF via `jsPDF`.
  - Server-side: A backend API route at `src/app/api/generate-pdf/route.ts` is fully implemented using `puppeteer` to render selectable vector-based PDFs from the posted HTML string.
- **DOC Generation Libraries**:
  - Client-side: Generates an `.doc` file in `useDocumentPreview.ts` (lines 87-117) by wrapping the HTML in MS Office XML namespaces and downloading as a Blob of type `application/msword`.
  - Server-side: A backend API route at `src/app/api/generate-docx/route.ts` cleans up CSS and returns a Word-compatible HTML document.
  - Native DOCX Builder: A structured builder using the `docx` library is present under `src/lib/docx-builder/` (e.g. `salary-cert.ts`, `appointment.ts`), but is currently not hooked up to any API endpoints.

---

### Zoom & Scaling (R3)
- **Zoom Slider Component**:
  - Located in `src/components/editor/EditorToolbar.tsx` (lines 409-417):
    ```typescript
    <input
      type="range"
      min={25}
      max={150}
      step={5}
      value={zoomLevel}
      onChange={e => onZoomChange(Number(e.target.value))}
      className="w-20 h-1 accent-gray-600 cursor-pointer"
    />
    ```
- **Zoom Level State and Application**:
  - Stored in `src/app/page.tsx` (line 32): `const [zoomLevel, setZoomLevel] = useState(55)`.
  - Applied in `DocumentCanvas.tsx` (lines 167-199) by setting the width and height of the wrapper box to the scaled size and scaling the iframe element using CSS transform:
    ```typescript
    style={{
      width: `${794 * (zoomLevel / 100)}px`,
      height: `${iframeHeight * (zoomLevel / 100)}px`,
      position: 'relative',
      overflow: 'hidden',
    }}
    ```
    and
    ```typescript
    style={{
      width: '794px',
      height: `${iframeHeight}px`,
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'top left',
    }}
    ```
- **Height Calculation and Overflow Layout**:
  - Layout is configured in `DocumentCanvas.tsx` line 166:
    `<div className="flex-1 overflow-auto p-6 bg-slate-100 flex justify-center items-start">`
    The parent container has `overflow-auto`, allowing scrolling when the scaled wrapper box exceeds container boundaries.
  - **Polling Redundancy**: Both `DocumentCanvas.tsx` (lines 65-82) and `useEditorBridge.ts` (lines 99-102) run separate 1-second `setInterval` polling loops to measure the iframe document height and update it.

---

## 2. Logic Chain

1. **R1 (Edit Loss) Explanation**:
   - *Observation*: The iframe React `key` is `view + JSON.stringify(docOverrides)`.
   - *Observation*: Form field updates change `docOverrides`, changing the `key`.
   - *Observation*: Changing the key forces React to unmount the iframe DOM and construct a new one.
   - *Observation*: The new iframe parses the fresh `srcDoc={previewHtml}` fetched from `/api/document`, which only contains server-side rendered content from the raw form fields.
   - *Reasoning*: Because the iframe unmounts/remounts and discards its previous DOM state on key changes, and because `/api/document` does not receive or merge manual HTML modifications, all manual edits are completely lost when form fields change.

2. **R2 (Export Quality) Explanation**:
   - *Observation*: `handleDownloadPDF` in `useDocumentPreview.ts` uses client-side `html2pdf.js`.
   - *Observation*: `html2pdf.js` uses `html2canvas` to render the DOM as a canvas image, then inserts it into `jsPDF`.
   - *Observation*: `/api/generate-pdf/route.ts` runs Puppeteer headless server-side to print background graphics and output vector-based PDFs.
   - *Reasoning*: The client-side method produces non-selectable, image-based, low-quality PDFs, whereas shifting PDF generation to `/api/generate-pdf` using the live HTML from `editor.getFullHTMLContent()` will result in high-quality, searchable vector PDFs.

3. **R3 (Redundant Polling) Explanation**:
   - *Observation*: Two separate `setInterval` polling intervals are set up in `DocumentCanvas.tsx` and `useEditorBridge.ts`, both measuring `scrollHeight` every 1000ms.
   - *Reasoning*: Running multiple polling loops causes redundant state transitions and CPU consumption. Replacing this polling with a reactive `ResizeObserver` inside the iframe will update the height instantly upon content change (e.g. typing) and consume zero resources when idle.

---

## 3. Caveats

- We did not modify any source code files (read-only investigation task).
- Shifting PDF/DOC exports to server-side APIs requires the client machine to successfully make HTTP POST requests to local Next.js API endpoints (`/api/generate-pdf`, `/api/generate-docx`), and assumes Puppeteer is correctly configured with local Chromium binaries (which is true, as `puppeteer` is in `package.json`).
- If we use direct DOM updates in R1 to prevent iframe unmounting, templates must be wrapped with appropriate data attribute identifiers (e.g., `data-field`).

---

## 4. Conclusion

- Current setup relies on recreating the iframe when form data changes, which completely destroys manual edits.
- Exports are client-side image-based wrappers rather than vector PDFs.
- Zoom utilizes a redundant 1s double-polling height measurement.

---

## 5. Proposed Implementation Plan

### R1: Live Canvas Editing & Bidirectional Sync
1. **Annotate HTML Templates**:
   - In `src/lib/templates/` files (e.g. `salary-cert.ts`, `payslip.ts`, `appointment.ts`, etc.), wrap each dynamic data-binding placeholder with a span identifier.
   - Example: `<span data-field="designation">${data.designation || ''}</span>`.
2. **Prevent Iframe Remounting**:
   - In `src/components/editor/DocumentCanvas.tsx`, change the iframe's React key from `key={view + JSON.stringify(docOverrides)}` to `key={view}`.
   - This ensures the iframe only remounts when changing the document type, not when form data changes.
3. **Form to Canvas Synchronization (Direct DOM Updates)**:
   - In `useEditorBridge.ts`, create a synchronization function `syncFormToCanvas(formData)`:
     - Get the iframe document via `getDoc()`.
     - Loop through `formData` keys. Find elements in the iframe matching `[data-field="${key}"]`.
     - Update their `textContent` (or `innerHTML` if structured) to the new form value.
     - Call form calculations to also update dependent/calculated fields (e.g. `total_gross`, `net_salary`) and update their corresponding DOM elements (e.g., elements with `data-field="total_gross"`).
   - Hook this function up to an effect in `DocumentCanvas.tsx` or `useEditorBridge.ts` triggered when `docOverrides` changes.
4. **Canvas to Form Synchronization**:
   - In `setupIframeListeners` in `useEditorBridge.ts`, add a listener for `input` / `blur` events on elements with `[data-field]`.
   - If the user types directly into a `[data-field]` element, extract its text content and call `setField(fieldName, textContent)` to sync the value back to the form state.
5. **Form Warnings Removal**:
   - Remove the `window.confirm` discard warning from `useDocumentForm.ts` (lines 69-82) since updating form fields will now perform direct DOM modifications inside the iframe and no longer unmount the canvas or discard manual edits!

### R2: Shift to High-Quality Vector Exports
1. **Server-Side PDF Integration**:
   - In `src/hooks/useDocumentPreview.ts`, rewrite `handleDownloadPDF` to perform an API call:
     ```typescript
     const res = await fetch('/api/generate-pdf', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ html: customHtml || previewHtml }),
     })
     if (res.ok) {
       const blob = await res.blob()
       const url = URL.createObjectURL(blob)
       const a = document.createElement('a')
       a.href = url
       a.download = `${fileName}.pdf`
       a.click()
       URL.revokeObjectURL(url)
     }
     ```
2. **Server-Side DOC Integration**:
   - In `src/hooks/useDocumentPreview.ts`, rewrite `handleDownloadDOC` to call the `/api/generate-docx` endpoint in a similar manner, or call the native docx builder API if real `.docx` is requested.

### R3: Optimize Zoom Responsive Heights
1. **Consolidate Double-Polling Loops**:
   - Remove the `setInterval` polling in `DocumentCanvas.tsx` (lines 65-82).
   - In `useEditorBridge.ts` (lines 99-102), replace the `setInterval(updateIframeHeight, 1000)` polling loop.
2. **Implement ResizeObserver**:
   - In `useEditorBridge.ts`'s `setupIframeListeners` function, instantiate a `ResizeObserver` targeting the iframe document's body:
     ```typescript
     const body = getEditableBody()
     if (body) {
       const resizeObserver = new ResizeObserver(() => {
         updateIframeHeight()
       })
       resizeObserver.observe(body)
       ;(doc as any)._resizeObserver = resizeObserver
     }
     ```
   - In `cleanupIframeListeners`, disconnect the observer:
     ```typescript
     if ((doc as any)._resizeObserver) {
       (doc as any)._resizeObserver.disconnect()
       delete (doc as any)._resizeObserver
     }
     ```
   - This updates the iframe height reactively and instantaneously on content adjustments with zero background idle CPU cost.

---

## 6. Verification Method

- **Compilation Verification**:
  - Execute `npm run tsc` or `bun run build` to verify that typescript builds correctly.
- **R1 Live Sync Verification**:
  - Open the editor, make a manual formatting edit (e.g. highlight a word or type an extra sentence in the canvas body).
  - Modify a form field (e.g. designation).
  - Verify that the designation updates in the iframe DOM, and the manual formatting/text edits remain perfectly preserved.
- **R2 Export Verification**:
  - Export a PDF of the document.
  - Open the PDF and verify that the text can be selected/highlighted, and zooming in doesn't cause pixelation (verifying vector rendering).
- **R3 Zoom Height Verification**:
  - Open the document editor. Type multiple new lines at the bottom of the canvas.
  - Verify that the height container expands immediately and smoothly (no 1-second delay).
  - Check developer console or performance profiler to verify that no `setInterval` callbacks are executed when the page is idle.
