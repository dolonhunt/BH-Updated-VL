# ADR-005: State Management Strategy

**Status:** Proposed  
**Date:** 2026-06-23  
**Deciders:** Development Team  

## Context

The current app uses three independent `useSyncExternalStore`-based stores:
- `preview-store.ts` — document preview state (docType, formData, dirty flags)
- `use-employees.ts` — cached employee list with manual invalidation
- `use-company.ts` — cached company config with manual invalidation

Problems:
- **No caching strategy** — always fetches fresh data, no stale-while-revalidate
- **No devtools** — hard to debug state changes
- **Manual invalidation** — error-prone, easy to forget cache busting
- **No optimistic updates** — UI waits for server round-trip on every write
- **No loading/error states** — components must manage their own loading skeletons

The project already has `@tanstack/react-query` and `zustand` installed but unused.

## Options

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Keep custom stores** | Continue with `useSyncExternalStore` | Minimal change | Same problems, technical debt |
| **B. React Query only** | Use React Query for all state (server + client) | Powerful caching, devtools, optimistic updates | Overkill for pure UI state (sidebar, zoom) |
| **C. React Query + Zustand** | RQ for server state, Zustand for client UI state | Clean separation of concerns, best of both | Two libraries to learn |
| **D. Zustand only** | Use Zustand with persist middleware | Simple, lightweight | No caching, no stale-while-revalidate |

## Decision

**Option C: React Query (server state) + Zustand (client UI state)**

### React Query handles:
- Employee list (with auto-refetch, pagination, optimistic updates)
- Company config (cached, background refetch)
- Document history (if added in Phase 3)
- Any API-fetched data

### Zustand handles:
- Sidebar expanded/collapsed state
- Zoom level
- Current view/selection
- Editor state (if any)
- UI preferences

### Migration Path:
1. **Phase 1:** Add React Query provider to app. Migrate `use-employees.ts` and `use-company.ts` to React Query hooks.
2. **Phase 2:** Migrate `preview-store.ts` — preview data is ephemeral (per-document), might stay as Zustand or component state.
3. **Phase 3:** Add React Query devtools for debugging. Implement optimistic updates for employee CRUD.
4. **Phase 5:** Remove old `useSyncExternalStore` stores.

## Consequences

- **Positive:** Automatic caching, background refetch, devtools, optimistic updates, loading/error states built-in
- **Negative:** Learning curve for team; need to set up QueryClient provider; migrate existing stores
- **Neutral:** Zustand is minimal overhead for UI state; both libraries are already installed

## Implementation Notes

1. **Setup:** Add `QueryClientProvider` to root layout (`src/app/layout.tsx`)
2. **Employee hook:** `src/features/employees/hooks/useEmployees.ts`
   ```ts
   export function useEmployees() {
     return useQuery({ queryKey: ['employees'], queryKey: fetch('/api/employees') })
   }
   ```
3. **Company hook:** `src/features/documents/hooks/useCompany.ts`
   ```ts
   export function useCompany() {
     return useQuery({ queryKey: ['company'], queryKey: fetch('/api/company') })
   }
   ```
4. **Zustand stores:** `src/shared/stores/ui-store.ts`
   ```ts
   const useUIStore = create<UIState>((set) => ({
     sidebarExpanded: true,
     zoomLevel: 55,
     setSidebarExpanded: (v) => set({ sidebarExpanded: v }),
     setZoomLevel: (v) => set({ zoomLevel: v }),
   }))
   ```
5. **Remove:** `src/lib/use-employees.ts`, `src/lib/use-company.ts`, `src/lib/preview-store.ts` (after migration)
