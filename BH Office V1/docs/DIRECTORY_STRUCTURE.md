# BH HR APP DOCUGEN — Directory Structure Reference

## New Structure (Target)

```
src/
├── features/                          # Feature-based modules (business logic)
│   ├── documents/
│   │   ├── hooks/
│   │   │   ├── useDocumentForm.ts     # Generic form state for all doc types
│   │   │   └── useDocumentPreview.ts  # Preview fetch + iframe management
│   │   └── components/
│   │       ├── EditorToolbar/         # Rich text formatting toolbar
│   │       ├── DocumentCanvas/        # Iframe A4 preview wrapper
│   │       ├── FindReplace/           # Find & replace overlay
│   │       └── VersionManager/        # Template versioning (localStorage)
│   │
│   ├── employees/
│   │   ├── components/
│   │   │   ├── EmployeeListView.tsx   # Searchable data table
│   │   │   └── EmployeeFormView.tsx   # Full CRUD form (5 sections)
│   │   └── hooks/
│   │       └── useEmployees.ts        # Employee data fetching
│   │
│   └── settings/
│       └── SettingsForm.tsx           # Company branding + config
│
├── shared/                            # Reusable across all features
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (50+)
│   │   └── layout/
│   │       ├── Sidebar.tsx            # Collapsible navigation
│   │       └── Header.tsx             # Breadcrumb + action bar
│   │
│   ├── hooks/                         # Shared React hooks
│   │   ├── useEditorBridge.ts         # iframe ↔ React communication
│   │   ├── useToast.ts                # Toast notifications
│   │   └── useMobile.ts               # Responsive breakpoint
│   │
│   ├── lib/                           # Shared utilities
│   │   ├── calculations.ts            # BDT format, gross/net, date ops
│   │   ├── mismatch.ts                # Mismatch detection logic
│   │   ├── logger.ts                  # Structured logging (Pino-style)
│   │   └── utils.ts                   # cn(), format helpers
│   │
│   └── stores/                        # Global client state (Zustand)
│       └── ui-store.ts                # Sidebar, zoom, view state
│
├── documents/                         # Document rendering only
│   ├── templates/                     # HTML template generators
│   │   ├── index.ts                   # renderDocument() dispatcher
│   │   │                              # (will become registry pattern)
│   │   ├── shared-css.ts              # Letterhead CSS + pagination JS
│   │   ├── payslip.ts
│   │   ├── salary-cert.ts
│   │   ├── appointment.ts
│   │   ├── experience.ts
│   │   ├── employment-cert.ts
│   │   ├── official-pad.ts
│   │   ├── work-order.ts
│   │   ├── purchase-order.ts
│   │   ├── requisition.ts
│   │   ├── offer-letter.ts            # Orphan → will be activated
│   │   ├── nda.ts                     # Orphan → will be activated
│   │   ├── joining-report.ts          # Orphan → will be activated
│   │   ├── id-card-form.ts            # Orphan → will be activated
│   │   └── personal-info-form.ts      # Orphan → will be activated
│   │
│   └── docx-builders/                 # True .docx generators (docx lib)
│       ├── shared.ts                  # Header, footer, table helpers
│       ├── payslip.ts
│       ├── salary-cert.ts
│       ├── appointment.ts
│       ├── experience.ts
│       ├── employment-cert.ts
│       ├── official-pad.ts
│       ├── work-order.ts
│       ├── purchase-order.ts
│       ├── requisition.ts
│       ├── offer-letter.ts            # To be built
│       ├── nda.ts                     # To be built
│       ├── joining-report.ts          # To be built
│       ├── id-card-form.ts            # To be built
│       └── personal-info-form.ts      # To be built
│
├── generated/                         # Auto-generated (DO NOT EDIT)
│   └── assets.ts                      # Base64-encoded logos
│
└── lib/                               # Legacy shared (migrate to shared/)
    ├── db.ts                          # Prisma singleton
    ├── preview-store.ts               # To be migrated to React Query
    ├── use-employees.ts               # To be migrated to React Query
    ├── use-company.ts                 # To be migrated to React Query
    └── storage.ts                     # File/blob handling
```

## Migration Path

### Phase 1 (Weeks 1-3): Foundation
1. Create new directories (✅ DONE)
2. Move files as they are refactored (not bulk move!)

### Phase 2-3 (Weeks 4-10): Feature Migration
As each feature is touched:
- Move `src/hooks/useDocumentForm.ts` → `src/features/documents/hooks/`
- Move `src/components/editor/*` → `src/features/documents/components/`
- Move `src/components/layout/*` → `src/shared/components/layout/`
- Move `src/lib/calculations.ts` → `src/shared/lib/`
- Move `src/lib/mismatch.ts` → `src/shared/lib/`

### Phase 4+ (Weeks 11+): Template & Builder Migration
- Move `src/lib/templates/` → `src/documents/templates/`
- Move `src/lib/docx-builder/` → `src/documents/docx-builders/`

### Rule: **Move files only when modifying them**
Don't bulk reorganize — move a file when you need to edit it. This prevents massive PRs and merge conflicts.

## Key Conventions

| Convention | Rule |
|------------|------|
| **Features** | `src/features/{name}/` — self-contained business domains |
| **Shared** | `src/shared/` — used by 2+ features |
| **Documents** | `src/documents/` — rendering/output only, no UI |
| **Lib** | `src/lib/` — legacy, gradually migrate out |
| **API routes** | Stay in `src/app/api/` (Next.js convention) |
| **Pages** | Stay in `src/app/` (Next.js App Router) |

---

*This structure separates concerns: features own their UI and logic, documents own rendering, shared is reusable. The `lib/` directory is a migration target, not a target for new code.*
