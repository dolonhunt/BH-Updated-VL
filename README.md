# BH HR APP DOCUGEN — README

> **Status:** Phase 1 Active — Document Engine Foundation  
> **Last Updated:** 2026-06-23  
> **Tech Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui + Prisma + SQLite

---

## 📋 Quick Links

| Resource | Path |
|----------|------|
| **Interactive Dashboard** | Open `docs/project-dashboard.html` in browser |
| **Project Status** | `docs/PROJECT_STATUS.md` |
| **Design Strategy** | `docs/design-strategy.md` |
| **UI Audit Report** | `docs/ui-audit-report.md` |
| **Changelog** | `docs/changelog.md` |
| **ADRs** | `docs/adr/` |
| **Original Request** | `ORIGINAL_REQUEST.md` |

---

## 🎯 What This App Does

BH HR APP DOCUGEN is a professional HR document generation system for **The Beyond Headlines** media company. It generates, edits, previews, and exports 14 types of HR documents with live editing, multi-format export, and company branding.

### Supported Documents (14 types)

| Category | Documents |
|----------|-----------|
| **Employee Letters** | Appointment Letter, Experience Certificate, Employment Certificate, Offer Letter |
| **Financial** | Pay Slip, Salary Certificate |
| **Procurement** | Work Order, Purchase Order, Requisition |
| **Official** | Official Letterhead Pad, NDA, Joining Report |
| **Forms** | ID Card Form, Personal Info Form |

### Key Features
- ✏️ **Live Editor** — Click any document to edit directly in the browser (contenteditable)
- 📄 **Multi-format Export** — PDF, DOCX, Print, New Tab
- 🎨 **Brand Customization** — Logo, colors, company info, letterhead
- 👥 **Employee Management** — Full CRUD with salary calculations, BDT formatting
- 🔄 **Template Versions** — Save/load template overrides per document type
- 🔍 **Find & Replace** — Search and replace across entire documents

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or Bun
- SQLite (included, database file at `../db/custom.db`)

### Installation

```bash
# Install dependencies
npm install

# Generate assets (base64 logos)
npm run generate-assets

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
# → http://localhost:3000
```

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Dev | `npm run dev` | Start dev server on port 3000 |
| Build | `npm run build` | Generate assets + Next.js build |
| Start | `npm run start` | Production server |
| Lint | `npm run lint` | ESLint |
| TypeScript | `npm run tsc` | Type check (no emit) |
| DB Push | `npm run db:push` | Push schema to SQLite |
| DB Seed | `npm run db:seed` | Seed default data |
| DB Studio | `npm run db:studio` | Open Prisma Studio |

---

## 📂 Project Structure

```
src/
├── app/                      # Next.js App Router pages + API routes
│   ├── api/                  # 11 API route handlers
│   │   ├── document/route.ts   # Core document rendering
│   │   ├── generate-pdf/       # PDF generation (Puppeteer)
│   │   ├── generate-docx/      # DOCX generation
│   │   ├── employees/          # Employee CRUD
│   │   └── company/            # Company config
│   ├── layout.tsx             # Root layout (fonts, Toaster)
│   ├── page.tsx               # Main app shell (SPA orchestrator)
│   └── globals.css            # Tailwind v4 + design tokens
│
├── features/                  # Feature-based organization
│   ├── documents/             # Document workspace
│   │   ├── hooks/             # useDocumentForm, useDocumentPreview
│   │   └── components/        # Editor, Toolbar, Canvas, FindReplace
│   ├── employees/             # Employee management
│   │   ├── components/        # EmployeeList, EmployeeForm
│   │   └── hooks/
│   └── settings/              # Company settings
│
├── shared/                    # Truly shared code
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (50+)
│   │   └── layout/            # Sidebar, Header
│   ├── hooks/                 # useEditorBridge, useToast, useMobile
│   ├── lib/                   # calculations, mismatch, utils, logger
│   └── stores/                # Global state (Zustand)
│
├── documents/                 # Document-specific code
│   ├── templates/             # 14 HTML template generators
│   │   ├── shared-css.ts      # Letterhead CSS + pagination JS
│   │   └── index.ts           # renderDocument() dispatcher
│   └── docx-builders/         # 14 DOCX builders (docx library)
│       └── shared.ts          # Shared header/footer/table helpers
│
├── lib/                       # Legacy shared
│   ├── db.ts                  # Prisma singleton
│   ├── use-employees.ts       # Employee store (to be migrated)
│   └── use-company.ts         # Company store (to be migrated)
│
└── generated/                 # Auto-generated assets.ts (base64 logos)

docs/
├── adr/                       # Architecture Decision Records (5 ADRs)
├── design-strategy.md         # Design system documentation
├── ui-audit-report.md         # UI/UX audit findings
├── changelog.md               # Development history
├── PROJECT_STATUS.md          # Detailed project status
└── project-dashboard.html     # Interactive visual dashboard

tests/
├── unit/                      # Unit tests
├── integration/               # Document pipeline tests
└── e2e/                       # Playwright E2E tests

prisma/
├── schema.prisma              # SQLite schema (2 models)
├── seed.ts                    # Seed data
└── migrations/                # Migration history
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 + Tailwind CSS v4 + shadcn/ui |
| **Database** | Prisma ORM → SQLite |
| **State** | React Query (server) + Zustand (client UI) |
| **Documents** | HTML templates (preview) + docx library (export) |
| **PDF** | Puppeteer (server) + html2pdf.js (client fallback) |
| **Rich Text** | iframe + contenteditable + execCommand |
| **Typography** | DM Sans (UI) + Cambria (documents) |

### Data Flow

```
User fills form
    ↓ (400ms debounce)
Preview Store updates
    ↓
POST /api/document { type, data }
    ↓
renderDocument() → enrichData() → template function → HTML string
    ↓
iframe srcdoc = HTML → Browser renders A4 preview
    ↓
User can click to edit (contenteditable)
    ↓
Export: clone iframe DOM → PDF (Puppeteer) or DOCX (docx library)
```

---

## 📊 Development Phases

| Phase | Name | Status | Duration |
|-------|------|--------|----------|
| 1 | Document Engine Foundation | 🔵 Active | Weeks 1-3 |
| 2 | Standardize HR Templates | ⚪ Pending | Weeks 4-7 |
| 3 | Enhanced UX & Interactions | ⚪ Pending | Weeks 8-10 |
| 4 | New Features | ⚪ Pending | Weeks 11-12 |
| 5 | Governance & Infrastructure | 🔵 Active | Weeks 13-14 |

**Total Tasks:** 36  
**Completed:** 0  
**In Progress:** 4

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|--------|-------|-------|
| `--brand-red` | `#FF2109` | Primary actions, active nav, highlights |
| `--dark-navy` | `#0f172a` | Sidebar background |
| `--bg-slate` | `#f8fafc` | App background |
| `--success` | `#10b981` | Success states |
| `--warning` | `#f59e0b` | Warnings |
| `--danger` | `#ef4444` | Destructive actions |

### Typography
| Size | Usage |
|------|-------|
| 10px | Form labels, sub-headers |
| 12px | Standard labels, inputs |
| 14px | Body text, panel titles |
| 16px | Major headings |
| 24px | Logo mark |

### Spacing
- Grid gaps: 8px, 12px, 16px
- Card padding: 16px
- Section gaps: 12px between cards, 16px between sections
- Button heights: 28px (compact), 32px (CTA)

---

## 👥 Team & Decision Making

### How We Work
1. **ADRs first** — Major decisions get an ADR in `docs/adr/`
2. **Dashboard for status** — Check `docs/project-dashboard.html` for real-time progress
3. **Feature flags** — No formal feature flag system yet; use ADRs for scope decisions
4. **Code review** — All changes reviewed before merge

### Key Decisions (ADRs)
| ID | Decision | Status |
|----|----------|--------|
| ADR-001 | Template engine: registry pattern | Proposed |
| ADR-002 | Editor: keep iframe, plan TipTap | Proposed |
| ADR-003 | Pagination: single reactive system | Proposed |
| ADR-004 | DOCX: use docx library | Proposed |
| ADR-005 | State: React Query + Zustand | Proposed |

---

## 🐛 Known Issues

| Issue | Severity | Phase |
|-------|----------|-------|
| PDF logo renders blank (cross-origin) | High | 1 |
| DOCX generation broken (blob spoofing) | High | 1 |
| No overflow protection in iframe | High | 1 |
| `window.confirm()` blocking dialogs | Medium | 3 |
| Dead form fields (probation_months, etc.) | Medium | 2 |
| 5 orphan templates unreachable | Medium | 2 |
| iframe height polling every 1s | Low | 1 |

---

## 📆 Roadmap

```
Week 1-2:   Phase 1 — Pagination fix, PDF logo fix, DOCX wiring
Week 3:     Phase 1 + Phase 5.1 — Print CSS + folder structure
Week 4-5:   Phase 2.1 + 2.2 — Field cleanup + unified letterhead
Week 6-7:   Phase 2.3 + 2.4 — Template standardization + orphans
Week 8:     Phase 3.1 + 3.3 — Confirm dialogs + validation
Week 9-10:  Phase 3.2 + 3.4 + 3.5 — Cmd+K, history, shortcuts
Week 11-12: Phase 4 — New features (TBD based on decisions)
Week 13-14: Phase 5 — Logging, ADRs, error tracking, tests
```

---

## 🤝 Contributing

1. Check `docs/project-dashboard.html` for current status
2. Read relevant ADR before making architectural changes
3. Follow existing code style (functional components, hooks, Tailwind classes)
4. Update `docs/PROJECT_STATUS.md` when completing tasks
5. Log significant events using `src/shared/lib/logger.ts`

---

*Built with ❤️ for The Beyond Headlines*
