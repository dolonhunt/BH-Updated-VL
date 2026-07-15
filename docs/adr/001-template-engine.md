# ADR-001: Template Engine Architecture

**Status:** Proposed  
**Date:** 2026-06-23  
**Deciders:** Development Team  

## Context

The current template engine uses a `switch` statement in `src/lib/templates/index.ts` to dispatch to type-specific template functions. Adding a new document type requires:
1. Creating a new template file
2. Adding a new `case` in the switch
3. Adding the type to `validTypes` array in API route
4. Adding a new view entry in `page.tsx`

This is scattered, error-prone, and doesn't scale beyond ~15 document types. The system currently has 9 active types and 5 orphan templates (unreachable code) because registration is manual.

## Options

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Keep switch, add validation** | Add runtime checks, lint rules to enforce registration | Minimal change | Same problems, technical debt remains |
| **B. Registry pattern** | Object map `{ type: { render, form, icon, label } }`, self-registering modules | Clean, scalable, type-safe, easy discovery | Moderate refactor |
| **C. File-system routing** | Each doc type in its own folder, auto-discovered | Zero registration needed | Complex build config, harder to validate |

## Decision

**Option B: Registry Pattern**

Introduce a `templateRegistry` object where each document type registers itself:

```ts
// src/documents/templates/index.ts
export interface DocumentType {
  type: string;
  label: string;
  icon: LucideIcon;
  render: (data: any) => string;
  form: React.ComponentType<any>;
  validate?: (data: any) => string | null;
}

export const templateRegistry = new Map<string, DocumentType>();

export function registerDocumentType(doc: DocumentType) {
  templateRegistry.set(doc.type, doc);
}

// Each template file calls registerDocumentType at module load
```

Benefits:
- Adding a new type = one file, one registration call
- `renderDocument()` becomes a simple lookup: `templateRegistry.get(type)?.render(data)`
- Type-safe with generics
- Self-documenting: iterate registry for sidebar nav
- Can add metadata (description, category, icon) for UI

## Consequences

- **Positive:** Easy to add document types; single source of truth; type-safe; enables dynamic sidebar generation
- **Negative:** Requires refactoring existing 9 types + 5 orphans
- **Neutral:** Registry loaded at build time (no runtime cost)

## Implementation Notes

1. Migrate all 9 active types to registry pattern
2. Activate 5 orphan templates via registry
3. Update API route to validate against `Array.from(templateRegistry.keys())`
4. Update sidebar to iterate registry for navigation items
