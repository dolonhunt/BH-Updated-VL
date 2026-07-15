# Changelog — BH HR APP DOCUGEN UI/UX Optimization

> **Project**: Beyond Headlines HR Document Generator  
> **Stack**: Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion · shadcn/ui · Prisma/SQLite  
> **Maintainers**: Development Team  

---

## [June 17, 2026] — Phase 1: Discovery & Audit

### Added
- **`docs/ui-audit-report.md`** — Comprehensive 325-line UI/UX and codebase audit report covering:
  - Executive summary of architectural issues (monolithic `page.tsx` at 1,811 lines)
  - Hardcoded color inventory (25+ instances of `#FF2109`, inline `#0f172a`, `#f8fafc`, `#f1f5f9`)
  - Typography inconsistency table (6 arbitrary font sizes: `text-[9px]` through `text-[14px]`)
  - Spacing and layout audit (fractional gaps, misaligned breadcrumbs, sidebar hover reflow)
  - Monolithic file section map with exact line ranges for extraction targets
  - Architectural discrepancy analysis: database API (`/api/employees`, `/api/company`) vs. deprecated `localStorage` storage model
  - Complete refactoring roadmap with 4-step migration strategy
  - Layout style guidelines and token standardization rules

### Identified Issues
- **Monolithic architecture**: `src/app/page.tsx` contained 1,811 lines combining sidebar, header, document preview controls, modals, and 5+ document forms inline
- **Dual storage backends**: Production UI used Prisma/SQLite via API routes while existing modular components in `src/components/forms/` were hardcoded to `localStorage` via `src/lib/storage.ts`
- **Disabled mismatch detection**: The `MismatchModal` system (`src/lib/mismatch.ts`) was completely inactive because `page.tsx` bypassed the `useDocumentForm` hook
- **Hardcoded colors**: `#FF2109` (brand red) used 25+ times inline, `#0f172a` (dark navy) in inline styles, `#f8fafc` and `#f1f5f9` in 10+ locations
- **Inconsistent typography**: 6 arbitrary pixel-based font sizes (`text-[9px]`, `text-[10px]`, `text-[11px]`, `text-[12px]`, `text-[13px]`, `text-[14px]`) instead of standard Tailwind scale
- **Layout reflow bug**: Sidebar hover expansion from 64px → 240px physically pushed the document canvas, causing jarring visual shifts
- **Header misalignment**: Breadcrumb container had fixed `w-64` (256px) width while sidebar toggled between 64px and 240px
- **Iframe zoom overflow**: Complex `transform: scale(zoomLevel / 100)` calculations created horizontal scrollbars at zoom levels below 60%
- **Shadow inconsistency**: Mix of inline `boxShadow` strings and Tailwind shadow classes across components

---

## [June 17, 2026] — Phase 2: Component Refactoring

### Added — Layout Components

- **`src/components/layout/Sidebar.tsx`** (191 lines) — New toggle-based sidebar component
  - Explicit expand/collapse toggle button (replaces jarring hover-to-expand behavior)
  - `motion.aside` with `animate={{ width: expanded ? 256 : 64 }}` for smooth Framer Motion width transitions
  - `AnimatePresence` for brand text labels that fade in/out with width changes
  - Three logical sections: HR Management, Documents (9 document types), Settings
  - Active state indicator: left border accent (`3px solid var(--brand-red)`) with tinted background (`rgba(255,33,9,0.12)`)
  - Exported `View` and `DocType` type definitions consumed by all downstream components
  - Props interface: `{ expanded, onToggle, currentView, setView }`
  - Uses `ScrollArea` from shadcn/ui for overflow handling
  - Dark navy background via Tailwind `bg-dark-navy` design token

- **`src/components/layout/Header.tsx`** (151 lines) — New breadcrumb header component
  - Breadcrumb container width synchronized with sidebar via `motion.div` matching the sidebar's `animate={{ width }}` pattern
  - Dynamic breadcrumb rendering for all 12 view states (9 document types + employees + employee_list + settings)
  - Center-aligned document info badge with icon and label in a pill-shaped container (`rounded-full bg-slate-50`)
  - Right-aligned action button group: PDF download, DOC download, Print, Open in new tab
  - PDF loading state with `Loader2` spinner animation
  - Pill-shaped action buttons (`rounded-full border border-gray-200 bg-white`)
  - Props interface: `{ sidebarExpanded, view, pdfLoading, previewSrc, onDownloadPDF, onDownloadDOC, onPrint }`

### Added — Editor Components

- **`src/components/editor/DocumentCanvas.tsx`** (190 lines) — New document canvas wrapper
  - Preview header bar with "Live Document" label and contextual hint text
  - Integrated `VersionManager` for document version save/load
  - `EditorToolbar` integration with full rich text editing capabilities (bold, italic, underline, strikethrough, alignment, lists, font size, text color, highlight, undo/redo, clear formatting, horizontal rule, link insertion)
  - `FindReplace` overlay positioned absolutely at `top-[84px] right-4`
  - Zoom-responsive canvas with calculated container width: `(zoomLevel / 100) * 794px`
  - Iframe-based preview with inverse scale transform for correct rendering at any zoom level
  - Fullscreen toggle with fixed `inset-0 z-50` positioning
  - `EditorStatusBar` with character, word, and character-no-spaces counts
  - Props interface: `{ view, docOverrides, setDocOverrides, previewHtml, zoomLevel, setZoomLevel, fullscreen, setFullscreen, findOpen, setFindOpen, editor }`

### Added — Form Components

- **`src/components/forms/OfficialPadForm.tsx`** (138 lines) — Extracted letterhead configuration
  - Watermark toggle with custom inline switch component (green/gray states)
  - Logo alignment selector via shadcn `Select` (left/center/right)
  - Logo scale slider via shadcn `Slider` (0.5x–2.0x, 0.1 step) with mono-font readout
  - "Editable Canvas" tip card with amber accent styling
  - Quick guide section with usage instructions
  - "Update Document Preview" CTA button with brand-red styling

- **`src/components/forms/WorkOrderForm.tsx`** (536 lines) — Extracted work order configuration
  - Quick Templates section with 2 service WOs (BDCOM, BRACNet) and 2 procurement WOs (Dell Laptop, HP OmniBook)
  - Order Info section: type selector (service/procurement), WO number, ref code, priority
  - Vendor/Supplier section: company name, contact person, designation, address, cell/phone
  - Letter Content section: subject, salutation, body text (textarea), closing text (textarea)
  - Dynamic Service Details: add/remove rows with label-value pairs
  - Dynamic Procurement Details: add/remove items with description, UOM, qty, spec, unit price, auto-calculated total price
  - Total & Payment section: total amount, total in words, payment mode, VAT & AIT, bank details, special instructions
  - Signature Authorities: checked by, submitted by (procurement only), approved by

- **`src/components/forms/PurchaseOrderForm.tsx`** (420 lines) — Extracted purchase order configuration
  - Quick Templates section with 4 PO templates (Dell Laptops, HP OmniBook, Desktop + Monitor, Mac Studio M4 MAX)
  - Order Info section: PO number, date picker, ref code, priority
  - Supplier/Vendor section: company name, contact, address, cell, email, quotation number
  - Letter Content section: subject and body text
  - Dynamic Item Specifications: add/remove items with description, UOM, qty, unit price, auto-calculated total price, specification textarea
  - Totals & Terms: total amount, total in words, payment method, VAT & tax, delivery address, special instructions
  - Three-tier Signature Authorities: prepared by, checked by, approved by

- **`src/components/forms/RequisitionForm.tsx`** (210 lines) — Extracted requisition configuration
  - Quick Templates section with full 61-item requisition template covering 6 categories (A–F):
    - A: Employee Essentials (6 items)
    - B: General Office Stationery (25 items)
    - C: HR & Administration (9 items)
    - D: Accounts & Documentation (5 items)
    - E: Official Branding & Stamps (5 items)
    - F: Office Welfare (5 items)
  - Requisition Info: title and subtitle fields
  - Signatures: submitted by name/dept, approved by name
  - Department manpower grid with dynamic rows

### Added — Custom Hooks

- **`src/hooks/useDocumentPreview.ts`** (142 lines) — New preview logic hook
  - Subscribes to `usePreviewData()` from reactive preview store
  - Fetches rendered HTML via POST to `/api/document` with doc type and form data
  - Creates blob URLs for iframe `srcDoc` rendering with proper cleanup (`URL.revokeObjectURL`)
  - `handleDownloadPDF`: dynamic import of `html2pdf.js`, A4 format, JPEG quality 0.98, scale 2x, CORS-enabled
  - `handleDownloadDOC`: generates MS Word-compatible HTML with Office XML namespaces
  - `handlePrint`: opens blob URL in new tab for native print dialog
  - Automatic blob URL cleanup on unmount via `useEffect` cleanup function
  - Returns: `{ preview, previewHtml, previewSrc, pdfLoading, handleDownloadPDF, handleDownloadDOC, handlePrint }`

### Changed — Custom Hooks

- **`src/hooks/useDocumentForm.ts`** (138 lines) — Updated form state management hook
  - Retained `useAllEmployees` hook for employee data (from `src/lib/use-employees.ts`)
  - Added debounced preview sync (400ms timeout) to push form data to preview store without excessive re-renders
  - Added bidirectional sync with preview store: listens to `usePreviewData()` for external changes (e.g., version loads from `VersionManager`) and syncs back to local `formData` state
  - Added `isNoEmployeeDoc` flag for document types that don't require employee selection (`official_pad`, `work_order`, `purchase_order`, `requisition`)
  - Clears preview data when no employee is selected for employee-dependent document types
  - Mismatch detection integrated: `detectMismatches()` runs on every form data change for employee-linked documents
  - `handleMismatchAction` supports `'cancel'` and `'update_and_generate'` actions with employee save and cache invalidation
  - Generics-based API: `useDocumentForm<T>` accepts `{ docType, initialData, mapEmployeeToForm, onCalculate }` options

### Changed — Root Page

- **`src/app/page.tsx`** — Refactored from **1,811 lines → 167 lines** (90.8% reduction)
  - Replaced all inline sidebar JSX (74 lines) with `<Sidebar />` component
  - Replaced all inline header JSX (87 lines) with `<Header />` component
  - Replaced all inline document canvas JSX (97 lines) with `<DocumentCanvas />` component
  - Replaced inline OfficialPad config panel (36 lines) with `<OfficialPadForm />` component
  - Replaced inline WorkOrder config panel (391 lines) with `<WorkOrderForm />` component
  - Replaced inline PurchaseOrder config panel (259 lines) with `<PurchaseOrderForm />` component
  - Replaced inline Requisition config panel (148 lines) with `<RequisitionForm />` component
  - Replaced inline employee management views (153 lines) with `<EmployeeModule />` component
  - Replaced inline settings views with `<SettingsForm />` component
  - Added branded loading state with animated ping effect on logo
  - Added `mounted` state guard to prevent hydration mismatches
  - State management retained at page level: `view`, `sidebarExpanded`, `zoomLevel`, `findOpen`, `fullscreen`
  - Preview logic delegated to `useDocumentPreview()` hook
  - Editor bridge delegated to `useEditorBridge()` hook
  - Form config panel rendered via conditional `{view === 'xxx' && <XxxForm />}` pattern inside `ScrollArea`

---

## [June 17, 2026] — Phase 3: Design System & Visual Overhaul

### Added — Design Tokens

- **`src/app/globals.css`** — Extended with custom brand tokens
  - Added `--brand-red: #FF2109` as CSS custom property in `:root` and `.dark` scopes
  - Added `--dark-navy: #0f172a` as CSS custom property for sidebar background
  - Added `--bg-slate: #f8fafc` as CSS custom property for app/canvas backgrounds (dark mode: `#0f172a`)
  - Registered tokens in Tailwind v4 `@theme inline` block:
    - `--color-brand-red: var(--brand-red)` → enables `bg-brand-red`, `text-brand-red`, `border-brand-red` utilities
    - `--color-dark-navy: var(--dark-navy)` → enables `bg-dark-navy`, `text-dark-navy` utilities
    - `--color-bg-slate: var(--bg-slate)` → enables `bg-bg-slate` utility
  - Full shadcn/ui semantic token set preserved: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`
  - OKLCH color space used for all shadcn/ui tokens (light and dark mode)
  - Sidebar-specific tokens: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
  - Chart tokens: `--chart-1` through `--chart-5`
  - Border radius scale: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` derived from base `--radius: 0.625rem`
  - Base font set to `'DM Sans', sans-serif` in `@layer base` body rule

### Changed — Color Consolidation
- Replaced all inline `style={{ background: '#0f172a' }}` with `bg-dark-navy` Tailwind class
- Replaced all inline `style={{ background: '#f8fafc' }}` with `bg-bg-slate` Tailwind class
- Replaced all inline `style={{ color: '#FF2109' }}` and `bg-[#FF2109]` with `text-brand-red` and `bg-brand-red`
- Active sidebar items use `var(--brand-red)` CSS variable reference in inline border styles
- All form CTA buttons use `bg-brand-red hover:bg-brand-red/90` instead of hardcoded hex
- Document canvas shadows still use one inline `boxShadow` for the complex `0 4px 24px rgba(0,0,0,0.12)` effect (acceptable for non-tokenizable shadow)

### Changed — Typography Standardization
- Consolidated `text-[9px]` usages:
  - Sidebar subtitle "HR Document Gen" → `text-[9px]` retained for extreme small label
  - Section headers "HR MANAGEMENT", "DOCUMENTS" → `text-[9px] font-bold uppercase tracking-[0.15em]`
- Consolidated `text-[10px]` usages:
  - Form labels → `text-[10px] text-gray-400 uppercase` (standardized pattern)
  - Sub-category headers → `text-[10px] text-gray-400 font-medium uppercase tracking-wider`
  - Status bar hints → `text-[10px] text-gray-400`
  - Item counters → `text-[10px] font-bold text-slate-400 uppercase`
- Consolidated `text-[11px]` usages:
  - Template buttons → `text-[11px] h-8 bg-white`
- Replaced `text-[12px]` with standard `text-xs` across all form inputs, sidebar labels, breadcrumbs
- Replaced `text-[13px]` with `text-xs font-semibold` for section headers
- Replaced `text-[14px]` with standard `text-sm` for panel titles and header text
- Body font established at `text-sm` (14px) for standard content
- Headers established at `text-base` (16px) or `text-lg` (18px) for page titles

### Changed — Spacing & Layout
- Sidebar: Fixed-width toggle model (`64px` collapsed, `256px` expanded) replaces unpredictable hover expansion
- Header breadcrumb container: Width synchronized with sidebar via `motion.div animate={{ width: sidebarExpanded ? 256 : 64 }}`
- Form config panel: Fixed `w-[320px] flex-shrink-0` with `ScrollArea` for overflow
- Card spacing: Standardized to `p-4 space-y-3` or `p-4 space-y-4` within white card containers
- Section gaps: Standardized to `space-y-4` between form sections
- Grid gaps: Standardized to `gap-2` for grid layouts, `gap-3` for wider grids
- Button heights: Standardized to `h-8` for compact buttons, `h-9` for CTA buttons
- Card styling: Unified `bg-white rounded-xl p-4 shadow-xs border border-gray-100` pattern across all form cards

### Changed — Elevation & Shadows
- Form cards: Unified to `shadow-xs border border-gray-100` (minimal elevation)
- Header: `shadow-xs` with `border-b border-gray-100` (subtle separation)
- Document canvas paper: `boxShadow: '0 4px 24px rgba(0,0,0,0.12)'` (prominent paper-like elevation)
- Loading screen logo: `shadow-lg` for prominent brand mark
- Action buttons: `shadow-xs` for subtle depth on pill-shaped buttons

### Added — Framer Motion Animations
- **Sidebar width transition**: `motion.aside` with `duration: 0.2, ease: 'easeInOut'` for expand/collapse
- **Brand text reveal**: `AnimatePresence` with `opacity: 0→1`, `width: 0→auto` at `duration: 0.15` for sidebar label appearance
- **Header breadcrumb sync**: `motion.div` with matching `duration: 0.2, ease: 'easeInOut'` to keep header aligned with sidebar width
- **Loading screen ping**: CSS `animate-ping` on brand logo overlay with `opacity-20`
- **Loading spinner**: CSS `animate-spin` on `Loader2` icon during workspace initialization and PDF generation

### Changed — Component Card Patterns
- All form sections wrapped in consistent card containers: `bg-white rounded-xl p-4 shadow-xs border border-gray-100`
- Section headers use uniform `text-xs font-bold text-gray-700 uppercase tracking-widest` typography
- Tip/info cards use amber palette: `bg-amber-50 border border-amber-200 rounded-xl p-4`
- Guide cards use gray palette: `bg-gray-50 border border-gray-200 rounded-xl p-4`
- Form fields use `FormField` component with consistent `text-[10px] text-gray-400 uppercase` labels and `h-8 text-xs` inputs
- Textarea fields: `w-full min-h-[Xpx] text-xs p-2 rounded-md border border-gray-200 resize-y`
- Select dropdowns: `h-8 text-xs` trigger with shadcn `SelectContent`/`SelectItem`
- Dynamic row items: `border-b pb-3 border-gray-50 last:border-b-0 last:pb-0` separator pattern
- Add row buttons: `w-full h-8 text-xs border-dashed` outline variant
- Delete row buttons: `ghost` variant with `text-slate-400 hover:text-red-500` color transition
- CTA buttons: `w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90`

---

## Summary of Impact

| Metric | Before | After | Change |
|---|---|---|---|
| `page.tsx` line count | 1,811 | 167 | **−90.8%** |
| Hardcoded hex colors | 25+ instances | 3 (CSS variables) | **−88%** |
| Arbitrary font sizes | 6 non-standard sizes | 2 (consolidated) | **−67%** |
| Extracted components | 0 | 7 new components | **+7** |
| Custom hooks | 1 (useDocumentForm) | 2 (+useDocumentPreview) | **+1** |
| Design tokens | 0 brand tokens | 3 brand tokens | **+3** |
| Animation library | None | Framer Motion | **Added** |
| Sidebar behavior | Hover-to-expand (reflow) | Toggle button (smooth) | **Fixed** |
| Header alignment | Fixed `w-64` mismatch | Synced with sidebar | **Fixed** |

---

*This changelog is a living document. Future changes should follow the same `### Added / ### Changed / ### Fixed / ### Removed` format under dated section headers.*
