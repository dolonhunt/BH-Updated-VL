# Development Workflow

## How to Work on This Project

### 1. Check the Dashboard
Before starting work, open `docs/project-dashboard.html` in your browser. This shows:
- All tasks across 5 phases
- Current status (pending/in-progress/completed)
- Priority levels (P0/P1/P2)
- Progress bars per phase

**Click tasks to update status** — changes auto-save to localStorage.

### 2. Read the Relevant ADR
Before making architectural changes, check `docs/adr/` for existing decisions:
- ADR-001: Template engine (registry pattern)
- ADR-002: Editor approach (keep iframe, plan TipTap)
- ADR-003: Pagination (single reactive system)
- ADR-004: DOCX generation (true .docx binary)
- ADR-005: State management (React Query + Zustand)

If your change affects an ADR decision, update the ADR or create a new one.

### 3. Follow the Phase Plan
Work is organized into 5 phases. Focus on one phase at a time:

| Phase | Focus | Current Status |
|-------|-------|----------------|
| 1 | Document Engine Fixes | 🔵 Active — Start here |
| 2 | Template Standardization | ⚪ Pending |
| 3 | UX Improvements | ⚪ Pending |
| 4 | New Features | ⚪ Pending |
| 5 | Governance & Infra | 🔵 Active |

### 4. Start Coding

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests in watch mode
npx vitest

# Terminal 3: Database Studio (if needed)
npm run db:studio
```

### 5. Use the Logger
Import and use the structured logger:
```ts
import { log } from '@/shared/lib/logger';

// Good — structured, searchable
log.document.generated('payslip', 'EMP001');
log.employee.created('EMP042', 'John Doe');
log.export.pdf('appointment', 1200);

// Bad — unstructured console.log
console.log('document generated', 'payslip');
```

### 6. Document Your Changes
When completing a task:
1. Update the task in `docs/project-dashboard.html` (toggle status)
2. Add entry to `docs/changelog.md`
3. If architectural: update or create ADR in `docs/adr/`

## Code Style Guide

### File Organization
- One component per file
- Co-locate related files (form + validation + types)
- Use feature folders (`features/`) over type folders (`components/`)

### Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Utilities: `camelCase.ts`
- Types: `PascalCase` in `.ts` files or inline

### Imports
- Use `@/` alias for all internal imports
- No relative imports beyond `./` or `../`
- Group: React → third-party → internal → styles

### Component Pattern
```tsx
'use client'; // If using hooks/state

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';

interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [value, setValue] = useState('');
  
  return (
    <div className="p-4">
      <h2>{title}</h2>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => onSubmit(new FormData())}>Submit</Button>
    </div>
  );
}
```

## Quick Decision Matrix

| Decision Type | Action |
|--------------|--------|
| Which document type to work on? | Check dashboard — Phase 1 tasks first |
| How to implement pagination? | See ADR-003 |
| Should I add a new field? | Check template + form + mismatch rules |
| How to export a document? | See Phase 1.1-1.4 tasks |
| What state should I use? | React Query for server, Zustand for UI (ADR-005) |
| How to add a new document type? | Follow registry pattern (ADR-001) |
