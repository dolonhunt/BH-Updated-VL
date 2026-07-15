# Phase 3 Optimization Plan

## Objectives
Implement Phase 3 optimization to resolve:
1. **Live Canvas Editing & Synchronization (R1)**: Prevent loss of manual edits on template/form changes, warn user before form field changes overwrite edits, avoid cursor jumping, and capture live HTML.
2. **Print, PDF, and DOC Download (R2)**: Run Print, PDF, and DOC downloads on the live edited HTML content from the iframe DOM instead of the backend-generated unpaginated state.
3. **Preview Canvas Zoom & Height (R3)**: Solve the iframe zoom overflow/whitespace bugs using a clean wrapper-scaling approach with dynamic content height calculations.

---

## Technical Design

### 1. State Management for Manual Edits
- Expose global `hasManualEdits` state in `src/lib/preview-store.ts`.
- Subscribes and setters:
  - `setHasManualEdits(value: boolean)`
  - `getHasManualEdits(): boolean`
  - `useHasManualEdits(): boolean`
- Inside `src/hooks/useEditorBridge.ts`:
  - Call `setHasManualEdits(true)` on `'input'` event and on editing/formatting commands (e.g. `execCommand`, `setFontSize`).
- Inside `src/hooks/useDocumentForm.ts`:
  - Intercept `setField` and `handleEmployeeChange`.
  - If `hasManualEdits` is `true`, prompt the user with `window.confirm`.
  - If confirmed, set `hasManualEdits` to `false` and apply changes. Otherwise, abort the change.

### 2. Live Content Extraction for Exports
- Pass `editor` object (containing the iframe ref) to `useDocumentPreview` or let handlers in `page.tsx`/`useDocumentPreview.ts` accept the iframe ref.
- Modify `useDocumentPreview.ts` callbacks:
  - Accept `iframeRef` as a parameter to the hook or handlers.
  - **Print**: Extract `documentElement.outerHTML` from the iframe document. Open a blank window, write the HTML, and call `print()` once loaded.
  - **Open in New Tab**: Extract `documentElement.outerHTML` from the iframe document, open a blank window, and write the HTML.
  - **PDF Download**: Extract `documentElement.innerHTML` (or clone the iframe document's body, remove `.no-print`/`.editable-hint` elements). Wrap it inside a temporary container with the iframe styles and send it to `html2pdf`.
  - **DOC Download**: Extract body inner HTML (cleaned of `.no-print`/`.editable-hint` elements), wrap with standard Word XML template, and trigger download.

### 3. Wrapper-Scaling and Height Calculation
- Add `iframeHeight` state to `useEditorBridge.ts`.
- Measure the iframe's content `scrollHeight` dynamically:
  - Trigger on iframe load, keyup/input, focusout (delayed by 100ms for pagination to run), and toolbar formatting commands.
- Modify `src/components/editor/DocumentCanvas.tsx`:
  - Change iframe `key` to `view` so it is not destroyed on every form change (only when switching views).
  - Use `useEffect` to apply `previewHtml` to `iframeRef.current.srcdoc` only when `previewHtml` actually changes (avoiding reloading the iframe on every parent render).
  - Implement wrapper container with:
    - Width: `794 * (zoomLevel / 100)px`
    - Height: `iframeHeight * (zoomLevel / 100)px`
  - Implement scaled iframe container with:
    - Width: `794px`
    - Height: `iframeHeight` px
    - Transform: `scale(zoomLevel / 100)`
    - TransformOrigin: `top left`

---

## Step-by-Step Milestones

| Milestone | Scope | Target Files | Status |
|---|---|---|---|
| **M1: Prep & Store** | Add manual edits state to preview store and wire to form changes warning | `src/lib/preview-store.ts`, `src/hooks/useDocumentForm.ts` | Planned |
| **M2: Live Editing Events**| Trigger manual edits flag inside useEditorBridge event listeners and formatting actions | `src/hooks/useEditorBridge.ts` | Planned |
| **M3: Live Exports & Print**| Unify and update Print, PDF, DOC, and Open in New Tab to use live iframe HTML | `src/hooks/useDocumentPreview.ts`, `src/app/page.tsx`, `src/components/layout/Header.tsx` | Planned |
| **M4: Zoom & Height** | Implement wrapper-scaling, dynamic height calculation, and separate srcdoc loading | `src/hooks/useEditorBridge.ts`, `src/components/editor/DocumentCanvas.tsx` | Planned |
| **M5: Verification** | Run build checks, typechecks, manual lint checks, and run Forensic Integrity Audit | Project-wide | Planned |
