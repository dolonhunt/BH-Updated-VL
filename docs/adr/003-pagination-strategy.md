# ADR-003: Pagination Strategy

**Status:** Proposed  
**Date:** 2026-06-23  
**Deciders:** Development Team  

## Context

The current pagination uses **two competing systems** that can diverge:

1. **JavaScript pagination** (`PAGINATION_SCRIPT` in `shared-css.ts`): Runs client-side in the browser. Measures content height, splits into `.page` divs, adds `manual-pages` class to body. ~260 lines of DOM manipulation.

2. **CSS print pagination** (`@media print`): Uses `position: fixed` headers/footers, CSS `counter(page)` for page numbers. Has two modes controlled by `body.manual-pages` class.

**Problems:**
- Screen and print can show different pagination (JS runs asynchronously, fonts may not be loaded)
- `PAGINATION_SCRIPT` is 260 lines of imperative DOM manipulation (hard to maintain)
- `counter(pages)` for "Page X of Y" works in Firefox but has limited Chrome support
- Appointment letter uses hardcoded 2-page HTML while others use auto-pagination
- No reactive updates — pagination only re-runs on `focusout` (800ms debounce)

## Options

| Option | Description | Pros | Cons |
|--------|-------------|------|-------|
| **A. Keep dual-mode, fix bugs** | Patch both systems, ensure they're in sync | Least change | Complexity remains, bugs will recur |
| **B. Single reactive system** | `ResizeObserver` on content, auto-create/remove `.page` divs, unified print CSS | Clean, reactive, single source of truth | Moderate refactor of PAGINATION_SCRIPT |
| **C. CSS-only pagination** | Let browser handle pagination via `@media print` + `break-after` | No JS needed | Less control over orphans/widows, no screen preview pagination |
| **D. Server-side pagination** | Calculate pages on server during render | Deterministic | Complex state sync, doesn't help print |

## Decision

**Option B: Single Reactive System**

Replace dual-mode with one unified approach:

```ts
// documents/hooks/usePagination.ts
function usePagination(containerRef, contentRef) {
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const contentHeight = contentRef.current.scrollHeight;
      const pageHeight = 1123; // A4 in px
      const pageCount = Math.ceil(contentHeight / pageHeight);
      setPages(Array.from({ length: pageCount }, (_, i) => i + 1));
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);
}
```

**Rules:**
1. All documents use the same `.page` CSS class with `break-after: always`
2. `@media print` uses simple `position: fixed` header/footer, no `manual-pages` class switching
3. Page numbers rendered in footer via JavaScript (not CSS counters)
4. `keep-together` CSS classes prevent orphaned headings/signatures
5. `ResizeObserver` triggers re-pagination on any content change

## Consequences

- **Positive:** Single source of truth; reactive; simpler CSS; no dual-mode hacks; works for both screen and print
- **Negative:** Requires rewriting PAGINATION_SCRIPT (~260 lines); need to test all 14 document types
- **Neutral:** Appointment letter's hardcoded 2-page HTML gets converted to reactive pagination

## Implementation Notes

1. Create `src/documents/hooks/usePagination.ts`
2. Replace `PAGINATION_SCRIPT` with hook-based pagination in iframe
3. Simplify `SHARED_DOC_CSS` — remove `manual-pages` dual-mode
4. Standardize all templates to use reactive pagination (including Appointment)
5. Keep-together selectors remain as CSS utility classes
