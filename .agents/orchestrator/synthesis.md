# Synthesis of Explorer Findings

## Consensus
There is 100% consensus between the Explorer subagents on the core causes of the bugs and the code updates required to implement Phase 3 optimization:

1. **R1: Live Canvas Editing & Synchronization**:
   - **Expose State**: Expose a `hasManualEdits` flag in `src/lib/preview-store.ts` along with `setPreviewHasManualEdits(value)`.
   - **Form Alerts**: Update `useDocumentForm.ts` to check `preview?.hasManualEdits` instead of `isDirty` when updating form fields or the selected employee. If true, display a browser warning/confirmation modal before proceeding.
   - **Edit Listeners**: Update `useEditorBridge.ts` to trigger `setHasManualEdits(true)` on `input`, `paste`, `cut`, `drop` events inside the iframe, as well as on formatting commands inside `execCommand` and `setFontSize`.
   
2. **R2: Live Exports & Print**:
   - **Direct DOM Query**: Pass `editor.iframeRef` into `useDocumentPreview`.
   - **Cleaning UI decorations**: Add a utility `getCleanIframeHtml()` to `useDocumentPreview.ts` that clones the iframe document element, removes `.no-print` elements, removes `contenteditable` attributes, and strips `.editor-find-highlight` tags by replacing them with plain text nodes.
   - **Update Export Handlers**: Update `handleDownloadPDF`, `handleDownloadDOC`, and `handlePrint` to consume `getCleanIframeHtml() || previewHtml`.
   - **External Links / New Tab**: Add `handleOpenInNewTab` in `useDocumentPreview.ts` which opens a blank tab and writes `getCleanIframeHtml() || previewHtml` into it using `win.document.open()/write()`.
   
3. **R3: Wrapper-Scaling & Height Calculations**:
   - **Elevate Height State**: Move `iframeHeight` state to `useEditorBridge.ts` and set up an interval / listeners to query `doc.body.scrollHeight` / `doc.documentElement.scrollHeight` dynamically.
   - **Stable iframe key**: In `DocumentCanvas.tsx`, change `key={view + JSON.stringify(docOverrides)}` to `key={view}` so the iframe DOM node is not destroyed on form changes.
   - **Prevent Flash Reloads**: Move `srcdoc` updating to a `useEffect` inside `DocumentCanvas.tsx` that sets `iframe.srcdoc = previewHtml` only when `previewHtml` actually changes, preventing React render updates from resetting the iframe.
   - **Outer Wrapper Dimensions**: Update the outer preview wrapper in `DocumentCanvas.tsx` to set absolute `width` and `height` dimensions scaled by the zoom level.

## Resolved Conflicts / Details
- **Programmatic iframe updating**: Explorer 3 suggested manually opening and writing content using `doc.open()`, `doc.write()`, and `doc.close()`, while Explorer 1 suggested updating `iframe.srcdoc = previewHtml`.
  - *Resolution*: Setting `iframe.srcdoc = previewHtml` in a `useEffect` is cleaner, leverages browser native parsing, is fully standard in modern React, and triggers the iframe's `onload` callback automatically. We will proceed with `iframe.srcdoc = previewHtml` to avoid browser compatibility issues with programmatic document writes.
- **Listeners Cleanup**: Ensure all anonymous functions added to the iframe document are correctly cleaned up in `cleanupIframeListeners` inside `useEditorBridge.ts`.

## Gaps
- None. The scope of changes covers all requirements from R1 to R3 and is fully specified with file paths and line numbers.
