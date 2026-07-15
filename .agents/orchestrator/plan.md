# Project Plan: BH HR APP DOCUGEN UI/UX Optimization

## Architecture
The application is a Next.js 16 App Router application.
Key views and files:
- Monolithic Page: `src/app/page.tsx` contains state, sidebar, layout, and forms for document generation.
- Extracted Forms: `src/components/forms/` contains existing forms, but they are not fully integrated or are partially duplicated in `page.tsx`.
- Editor Components: `src/components/editor/` contains editor status bar, toolbar, find & replace, version manager.
- Employees Module: `src/components/employees/` contains employee views.
- Settings Form: `src/components/settings/SettingsForm.tsx` contains settings form.

## Milestones

| Milestone # | Name | Scope | Dependencies | Status |
|-------------|------|-------|--------------|--------|
| M1 | Audit & Discovery | Build baseline verification, detailed code & UI walkthrough, generate `docs/ui-audit-report.md` | None | PLANNED |
| M2 | Component Extraction | Extract layout, sidebar, header, preview canvas, and configs from `src/app/page.tsx` to `src/components/` and reduce `page.tsx` to <200 lines | M1 | PLANNED |
| M3 | Design Tokens & System | Establish CSS variables for colors, typography scale, spacing in global styles and tailwind config | M2 | PLANNED |
| M4 | UX & Visual Overhaul | Style sidebar with toggle-expand/collapse, refine headers, forms, tables, cards, dialogs (no hardcoded hex values in JSX) | M3 | PLANNED |
| M5 | Framer Motion Animations | Implement transitions, expand/collapse motion, skeleton loaders, entrance animations | M4 | PLANNED |
| M6 | Verification & Docs | Final E2E testing, build success, lint/type checks, write `docs/changelog.md` and `docs/design-strategy.md`, and run Forensic Audit | M5 | PLANNED |

## Interface Contracts
- Sidebar Navigation: Switches view states using the Zustand / React state defined in the home layout.
- Document Configuration: Individual configuration forms pass overrides and values to `buildDocData`.
- Preview Canvas: Iframe or div showing preview HTML from `/api/document`.

## Code Layout
- `src/components/layout/`: extracted Sidebar, Header, Page layout components.
- `src/components/document/`: extracted DocumentCanvas, document configuration forms.
- `src/components/forms/`: existing and refined form modules.
- `src/components/ui/`: UI components (shadcn/ui).
