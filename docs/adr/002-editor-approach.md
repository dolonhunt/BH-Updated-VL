# ADR-002: Document Editor Approach

**Status:** Proposed  
**Date:** 2026-06-23  
**Deciders:** Development Team  

## Context

The current editor uses an iframe with `contenteditable="true"` and `document.execCommand()` for formatting. This approach:
- **Works** for basic rich text (bold, italic, lists)
- **Is deprecated** — `execCommand` is not part of modern DOM standards
- **Has limitations** — fontSize maps to 1-7 (not point sizes), inconsistent cross-browser behavior
- **Requires polling** — iframe height measured every 1000ms via `setInterval`
- **Enables native print** — iframe isolation means `@media print` works naturally

Modern alternatives exist but would require significant reimplementation.

## Options

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Keep iframe + execCommand** | Maintain current approach, fix polling with ResizeObserver | Works today, native print, isolated styling | Deprecated API, limited formatting |
| **B. Migrate to TipTap** | Headless editor framework, ProseMirror under the hood | Modern, extensible, collaborative future | Requires reimplementing print/export, learning curve |
| **C. Migrate to Lexical** | Meta's editor framework | Modern, performant, good React support | Younger ecosystem, more migration work |
| **D. Hybrid iframe + modern inner editor** | Keep iframe shell, replace inner editor with TipTap | Best of both worlds | Complex integration, dual rendering paths |

## Decision

**Option A: Keep iframe + execCommand (short term), plan TipTap (long term)**

### Immediate (Phase 1-3)
- Keep the iframe architecture — it works and users are familiar
- Replace `execCommand` fontSize with custom `Range.surroundContents(span)` for precise sizing
- Replace height polling with `ResizeObserver`
- Fix find/replace to work reliably

### Future (Phase 4+)
- Evaluate TipTap for a v2 editor if richer editing is needed (tables, images, mentions)
- TipTap would replace the `.pg-body` contenteditable inside the existing iframe
- Print/export pipeline would remain the same (clone iframe DOM)

## Consequences

- **Positive:** No disruption to working system; fixes are incremental; native print preserved
- **Negative:** Living with deprecated API for now; eventual migration still needed
- **Neutral:** iframe bridge code (`useEditorBridge`) stays but gets cleaner

## Implementation Notes

1. **Phase 1:** Replace `setInterval` with `ResizeObserver` on `.pg-body`
2. **Phase 1:** Fix find/replace — use `TreeWalker` with boundary-safe wrapping
3. **Phase 2:** Replace `execCommand('fontSize')` with custom span-based sizing
4. **Phase 3:** Add proper selection tracking with `Selection` API
5. **Phase 4 (future):** Evaluate TipTap integration inside iframe
