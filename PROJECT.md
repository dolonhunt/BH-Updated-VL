# Project: BH HR APP DOCUGEN Phase 3 Optimization

## Architecture
- React frontend (Next.js 16 app router) managing document configuration and preview canvas.
- Zustand store managing document and application state.
- Interactive A4 canvas rendered in an iframe (`src/components/editor/DocumentCanvas.tsx`) showing live document preview.
- Rich text toolbar (`src/components/editor/EditorToolbar.tsx`) editing the iframe content.
- Export utilities converting the HTML preview into print/PDF/DOC formats.

## Code Layout
- `src/app/page.tsx`: Main dashboard and layout orchestrator.
- `src/components/editor/DocumentCanvas.tsx`: Iframe-based live editor canvas.
- `src/components/editor/EditorToolbar.tsx`: Formatting toolbar.
- `src/components/layout/Header.tsx`: Toolbar containing print/export actions.
- `src/lib/`: Custom hooks, state stores, and templates.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Discovery & Audit | Perform codebase analysis to identify precise files and logic for Phase 3 requirements. | None | IN_PROGRESS |
| 2 | Live Canvas Editing & Sync (R1) | Implement direct iframe content updates, focusout pagination, sync to state, and form field warning. | M1 | PLANNED |
| 3 | Print & Export Fixes (R2) | Update Print, New Tab, PDF, and DOC buttons in the header to run on live iframe HTML. | M2 | PLANNED |
| 4 | Zoom & Scaling (R3) | Implement transform-wrapper scaling of A4 canvas and auto-calculated height. | M1 | PLANNED |
| 5 | Hardening & Acceptance Testing | Final testing of all 9 document types, exports, zoom, and build checks. | M2, M3, M4 | PLANNED |

## Interface Contracts
### DocumentCanvas ↔ Form Views
- Form modification triggers template regeneration.
- If the document canvas is "dirty" (manually edited), warn the user before regenerating.

### DocumentCanvas ↔ Export/Header Actions
- Header actions read live HTML from the iframe DOM instead of the stale state.
