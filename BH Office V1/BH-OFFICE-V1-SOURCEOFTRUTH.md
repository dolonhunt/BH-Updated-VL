# BH OFFICE V1 — SOURCE OF TRUTH

**Version:** 1.0  
**Date:** 2026-06-24  
**Status:** Phase 1 In Progress  
**Parent Project:** BH HR APP DOCUGEN (untouched, reference only)

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Current State Assessment](#2-current-state-assessment)
3. [Tech Stack](#3-tech-stack)
4. [Directory Structure](#4-directory-structure)
5. [Code Conventions](#5-code-conventions)
6. [Architecture Decision Records (ADRs)](#6-architecture-decision-records)
7. [Phase 1: Document Engine Foundation (In Progress)](#7-phase-1-document-engine-foundation)
8. [Phases 2-5 Overview](#8-phases-2-5-overview)
9. [Data Flow](#9-data-flow)
10. [Document Types Summary](#10-document-types-summary)
11. [Known Issues](#11-known-issues)
12. [Current Work Status](#12-current-work-status)
13. [Quick Decision Matrix](#13-quick-decision-matrix)
14. [How to Work on This Project](#14-how-to-work-on-this-project)

---

## 1. PROJECT OVERVIEW

**BH OFFICE V1** is a modernized rewrite/refactor of BH HR APP DOCUGEN — a professional HR document generation system for **The Beyond Headlines** media company (Bangladesh).

### What It Does
Generates 14 types of HR documents with live editable preview, multi-format export (PDF, DOCX, Print), employee CRUD, company branding, and template versioning.

### Goals
1. Reliable, overflow-free document rendering
2. Accurate print/PDF/DOCX output matching screen preview
3. Clean, standardized HR document templates with fixed official fields
4. Modern, interactive UX
5. Professional project governance (ADRs, logging, tests, dashboard)

---

## 2. CURRENT STATE ASSESSMENT

### What Works Well
- Live iframe editor with rich text, find/replace, versioning
- 9 functional document types with DB-backed employee data
- Multi-format export (PDF via html2pdf + Puppeteer, Print, New Tab)
- Template engine with auto-pagination and letterhead system
- Strong UI foundation (shadcn/ui + Radix + Tailwind v4)

### Critical Gaps (Phase 1 Targets)
| Gap | Severity | Fix Phase |
|-----|----------|-----------|
| PDF logo renders blank (cross-origin postimg.cc) | HIGH | 1.3 |
| DOCX generation broken (blob spoofing) | HIGH | 1.4 |
| No overflow protection in iframe | HIGH | 1.2 |
| App vs Print mismatch (JS pagination vs CSS) | HIGH | 1.1/1.5 |
| iframe height polled every 1000ms | MEDIUM | 1.6 |

---

## 3. TECH STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16 |
| **UI** | React + Tailwind CSS v4 + shadcn/ui | 19 / v4 |
| **Language** | TypeScript | 5 (strict) |
| **Database** | Prisma ORM → SQLite | 6 |
| **State (server)** | @tanstack/react-query | 5.82 |
| **State (client)** | Zustand | 5.0 |
| **Documents (HTML)** | Template literals | custom |
| **Documents (DOCX)** | docx library | 9.7 |
| **PDF (client)** | html2pdf.js | 0.14 |
| **PDF (server)** | Puppeteer | 25.1 |
| **Logging** | Custom structured logger | custom |

### Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--brand-red` | `#FF2109` | Primary actions, active nav |
| `--dark-navy` | `#0f172a` | Sidebar background |
| `--bg-slate` | `#f8fafc` | App background |
| `--radius` | `0.625rem` | Card/button corners |
| **Font (UI)** | DM Sans | All UI text |
| **Font (docs)** | Cambria | Document templates |

---

## 4. DIRECTORY STRUCTURE

```
BH Office V1/
├── BH-OFFICE-V1-SOURCEOFTRUTH.md   ← THIS FILE
├── docs/
│   ├── project-dashboard.html      Interactive tracker
│   ├── PROJECT_STATUS.md           Per-task status
│   ├── DIRECTORY_STRUCTURE.md      Folder layout guide
│   ├── DEVELOPMENT_WORKFLOW.md     Work process
│   └── adr/                        5 Architecture Decisions
│
├── src/
│   ├── features/                   Feature modules
│   │   ├── documents/hooks + components
│   │   ├── employees/hooks + components
│   │   └── settings/
│   ├── shared/                     Shared code
│   │   ├── components/layout + ui
│   │   ├── hooks/                  (useEditorBridge, useToast, useMobile)
│   │   ├── lib/                    (calculations, mismatch, logger, utils)
│   │   └── stores/                 (Zustand UI state)
│   ├── documents/                  Document rendering only
│   │   ├── templates/              (14 HTML generators)
│   │   └── docx-builders/          (14 DOCX builders)
│   ├── generated/                  Auto-generated assets
│   └── lib/                        Legacy (migrate to shared/)
│
├── tests/                          Test suite
├── scripts/                        Build scripts
├── prisma/                         Schema + seed
└── public/                         Static assets
```

---

## 5. CODE CONVENTIONS

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase.tsx | `EmployeeListView.tsx` |
| Hooks | camelCase.ts (use prefix) | `useDocumentForm.ts` |
| Utilities | camelCase.ts | `calculations.ts` |
| Templates | kebab-case.ts | `salary-cert.ts` |
| Tests | *.test.ts | `calculations.test.ts` |

### Import Order
1. React
2. Third-party
3. Internal (@/ imports)
4. Styles

### Logging Convention
```ts
import { log } from '@/shared/lib/logger';
log.document.generated('payslip', 'EMP001');
log.employee.created('EMP001', 'John Doe');
log.export.pdf('appointment', 1200);
```

---

## 6. ARCHITECTURE DECISION RECORDS (ADRs)

Located in `docs/adr/`. Summary:

| ADR | Decision |
|-----|----------|
| **001** | Template engine: Registry Pattern (Map<string, DocumentType>) |
| **002** | Editor: Keep iframe + execCommand (short term), plan TipTap (long term) |
| **003** | Pagination: Single reactive system (ResizeObserver) |
| **004** | DOCX: Use docx library for true .docx binary |
| **005** | State: React Query (server) + Zustand (client UI) |

---

## 7. PHASE 1: DOCUMENT ENGINE FOUNDATION (IN PROGRESS)

**Goal:** Reliable, overflow-free, print-accurate document rendering  
**Duration:** Weeks 1-3  
**Status:** 🔵 Code implementation started

### Task 1.1: Unify Pagination System
**Priority:** P0 | **Status:** In Progress
- Replace dual-mode pagination (JS DOM splitting + CSS page-break) with single reactive system
- Use `ResizeObserver` on `.pg-body` for reactive height tracking
- All documents use `.page { break-after: always }` CSS
- Remove `manual-pages` class switching
- Keep keep-together CSS classes for orphans/widows

### Task 1.2: Fix Overflow Handling
**Priority:** P0 | **Status:** Pending
- Add `overflow: hidden` + `max-height` constraints on `.page`
- Add visual "page overflow" indicator when content exceeds one page
- iframe container respects page boundaries

### Task 1.3: Fix PDF Image Rendering
**Priority:** P0 | **Status:** Pending
- Embed logo as base64 data URI (already in `generated/assets.ts`)
- Replace remote postimg.cc URL in templates with base64
- Use Puppeteer as primary PDF path (handles base64 correctly)
- Keep html2pdf.js as fallback

### Task 1.4: Wire Up Real DOCX Generation
**Priority:** P0 | **Status:** Pending
- Connect `docx-builder/` to `/api/generate-docx`
- Phase 1: Top 3 types — Payslip, Appointment, Salary Certificate
- Pass company config from DB
- Use `Packer.toBuffer()` → true `.docx` binary
- MIME type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Task 1.5: Standardize Print CSS
**Priority:** P1 | **Status:** Pending
- Unified `@media print` stylesheet
- Remove `manual-pages` dual-mode hack
- All documents: `.page { break-after: always }` + fixed header/footer
- Page numbers via JS (not CSS counters)

### Task 1.6: Replace iframe Height Polling
**Priority:** P1 | **Status:** Pending
- Remove `setInterval(updateIframeHeight, 1000)`
- Use `ResizeObserver` on `.pg-body`
- Reactive height updates on content change

---

## 8. PHASES 2-5 OVERVIEW

### Phase 2: Standardize HR Templates (Weeks 4-7)
- Field cleanup (remove dead fields)
- Unified letterhead system
- Standardize all 9 active templates
- Activate 5 orphan templates
- Template presets

### Phase 3: Enhanced UX (Weeks 8-10)
- Replace window.confirm() with snackbars
- Command palette (Cmd+K)
- Real-time validation
- Document history
- Keyboard shortcuts

### Phase 4: New Features (Weeks 11-12)
- Bulk operations
- Approval workflow
- Email integration
- Dashboard/Home page

### Phase 5: Governance (Weeks 13-14)
- 67% DONE (dirs, ADRs, logger, dashboard, tests ready)
- Remaining: Error tracking, full CI

---

## 9. DATA FLOW

```
Form Input → Debounce 400ms → setPreviewData() → preview-store
    → POST /api/document { type, data }
    → renderDocument() → enrichData() → template → HTML
    → iframe.srcdoc = HTML → Browser renders A4 preview
    → User edits (contenteditable)
    → Export: clone DOM → PDF / DOCX / Print / New Tab
```

---

## 10. DOCUMENT TYPES SUMMARY

| Type | Form | Template | Pagination | Employee | Mismatch |
|------|------|----------|------------|----------|----------|
| payslip | ✅ | ✅ | Auto | ✅ | 8 salary + designation |
| salary_cert | ✅ | ✅ | Auto | ✅ | 9 fields |
| appointment | ✅ | ✅ | Manual 2-page | ✅ | 10 fields |
| experience | ✅ | ✅ | Auto | ✅ | 3 fields |
| employment_cert | ✅ | ✅ | Auto | ✅ | 3 fields |
| official_pad | ✅ | ✅ | Auto | ❌ | None |
| work_order | ✅ | ✅ | Auto | ❌ | None |
| purchase_order | ✅ | ✅ | Auto | ❌ | None |
| requisition | ✅ | ✅ | Auto | ❌ | None |
| offer_letter | ❌ | ✅ | Auto | ❌ | Orphan |
| nda | ❌ | ✅ | Manual | ❌ | Orphan |
| joining_report | ❌ | ✅ | Auto | ❌ | Orphan |
| id_card_form | ❌ | ✅ | Auto | ❌ | Orphan |
| personal_info_form | ❌ | ✅ | Manual 2-page | ❌ | Orphan |

---

## 11. KNOWN ISSUES (TOP 5)

| # | Issue | Severity | Phase | Status |
|---|-------|----------|-------|--------|
| 1 | PDF logo blank (cross-origin) | HIGH | 1.3 | 🔧 In Progress |
| 2 | DOCX blob spoofing | HIGH | 1.4 | ⬜ Pending |
| 3 | No overflow protection | HIGH | 1.2 | ⬜ Pending |
| 4 | Pagination dual-mode divergence | HIGH | 1.1 | 🔧 In Progress |
| 5 | window.confirm() blocking | MEDIUM | 3.1 | ⬜ Pending |

---

## 12. CURRENT WORK STATUS

### Done
- [x] Complete codebase analysis
- [x] 5-phase plan with 36 tasks
- [x] 5 ADRs
- [x] Directory structure created
- [x] Structured logger (src/shared/lib/logger.ts)
- [x] Unit tests scaffolding (calculations + mismatch)
- [x] Integration test scaffolding
- [x] Interactive dashboard
- [x] Development workflow + directory guides

### In Progress
- [ ] Phase 1.1: Unify pagination system
- [ ] Phase 1.3: Fix PDF image rendering

### Not Started
- [ ] Phase 1.2, 1.4, 1.5, 1.6
- [ ] Phases 2, 3, 4, 5 (remaining tasks)

### Progress
```
Overall:  ████░░░░░░░░░░░░░░░░ 20%
Phase 1:  ████░░░░░░░░░░░░░░░░ 10%  (1.1 + 1.3 started)
Phase 5:  ██████████████░░░░░░ 80%  (infrastructure complete)
```

---

## 13. QUICK DECISION MATRIX

| Question | Answer |
|----------|--------|
| Starting point? | Phase 1.1 (pagination) or 1.3 (PDF logo) |
| How to add new field? | Form → Template → Mismatch rules (if needed) |
| State management? | React Query = server; Zustand = UI |
| Logger import? | `import { log } from '@/shared/lib/logger'` |
| How to track progress? | `docs/project-dashboard.html` (click tasks) |

---

## 14. HOW TO WORK ON THIS PROJECT

1. **Check dashboard:** Open `docs/project-dashboard.html`
2. **Read ADR:** Before architectural changes
3. **Write code:** Follow conventions in Section 5
4. **Use logger:** `import { log } from '@/shared/lib/logger'`
5. **Update status:** Click tasks in dashboard

---

## APPENDIX: PENDING DECISIONS

| # | Decision | Default |
|---|----------|---------|
| 1 | DOCX: true .docx or current .doc? | True .docx |
| 2 | Activate all 5 orphan templates? | Yes |
| 3 | Which Phase 4 features first? | Dashboard + Bulk ops |
| 4 | Folder migration: phased or one-time? | Phased |
| 5 | Testing: Playwright E2E or unit only? | Unit + integration first |

---

*Last updated: 2026-06-24 — Status: Phase 1 In Progress*
