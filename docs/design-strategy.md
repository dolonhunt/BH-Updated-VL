# Design Strategy — BH HR APP DOCUGEN

> **Project**: Beyond Headlines HR Document Generator  
> **Version**: 1.0 — Post-Audit  
> **Date**: June 17, 2026  
> **Stack**: Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion · shadcn/ui · Prisma/SQLite  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System Architecture](#2-design-system-architecture)
3. [Color Palette](#3-color-palette)
4. [Typography Scale](#4-typography-scale)
5. [Spacing & Layout](#5-spacing--layout)
6. [Animation Strategy](#6-animation-strategy)
7. [Component Patterns](#7-component-patterns)
8. [Industry Best Practices Referenced](#8-industry-best-practices-referenced)
9. [Accessibility Considerations](#9-accessibility-considerations)

---

## 1. Design Philosophy

### Vision Statement

BH HR APP DOCUGEN is an **enterprise-grade internal SaaS tool** for generating, previewing, and exporting HR documents (letters, pay slips, certificates, purchase orders, requisitions). The design language must convey:

- **Professionalism** — This tool produces official legal and financial documents. The UI must project confidence and reliability.
- **Clarity** — HR personnel and administrative staff are the primary users. Every interaction should be self-explanatory without training.
- **Density without clutter** — The three-panel layout (sidebar → config form → live preview) demands efficient space usage. Information density is high, but visual noise must be low.
- **Brand alignment** — Beyond Headlines' brand identity (red `#FF2109`, dark navy `#0f172a`) must be present but restrained, used as accent rather than dominant palette.

### Design Principles

| Principle | Application |
|---|---|
| **Content-first** | The live document preview is the hero element. Form panels and sidebars are subordinate tools that serve the preview. |
| **Progressive disclosure** | Templates and quick-fill options surface first. Advanced fields (bank details, special instructions, signatures) follow in collapsible sections. |
| **Consistent affordances** | Every interactive element follows the same visual language: white card with subtle border for containers, brand-red for primary actions, dashed borders for "add" triggers. |
| **Minimal cognitive load** | One font family (DM Sans), one accent color, one card style, one button pattern. Repetition builds familiarity. |
| **Respect for the document** | The canvas area uses paper-like elevation (`shadow: 0 4px 24px rgba(0,0,0,0.12)`) on a cool gray background to simulate a physical document sitting on a desk. |

### Design Direction: "Modern HR Platform" Aesthetic

The UI follows the contemporary B2B SaaS aesthetic seen in modern HR platforms — a departure from the traditional "enterprise gray" look toward:

- Clean white backgrounds with ultra-subtle borders (`border-gray-100`)
- Minimal shadows (`shadow-xs`) that suggest depth without heaviness
- Rounded containers (`rounded-xl`) for a friendly, approachable feel
- Compact typography with uppercase section labels for scanability
- Pill-shaped badges and action buttons for a polished, modern touch
- Dark sidebar with brand accent for strong navigation anchoring

---

## 2. Design System Architecture

### Token Architecture

The design system is built on a three-layer token architecture:

```
┌──────────────────────────────────────────────────┐
│  Layer 3: Component Tokens (Tailwind Utilities)  │
│  bg-brand-red, bg-dark-navy, bg-bg-slate         │
│  text-brand-red, border-brand-red                 │
├──────────────────────────────────────────────────┤
│  Layer 2: Semantic Tokens (@theme inline)         │
│  --color-brand-red: var(--brand-red)              │
│  --color-dark-navy: var(--dark-navy)              │
│  --color-bg-slate: var(--bg-slate)                │
├──────────────────────────────────────────────────┤
│  Layer 1: Primitive Tokens (CSS Custom Props)     │
│  --brand-red: #FF2109                             │
│  --dark-navy: #0f172a                             │
│  --bg-slate: #f8fafc                              │
└──────────────────────────────────────────────────┘
```

### How It Works

1. **Primitive tokens** are defined as CSS custom properties in `:root` and `.dark` blocks within `globals.css`. These are the raw color values.

2. **Semantic tokens** are registered in Tailwind CSS v4's `@theme inline` block, which maps primitives to Tailwind-consumable `--color-*` variables. This is the Tailwind v4 way to extend the color palette without `tailwind.config.ts`.

3. **Component tokens** are the resulting Tailwind utility classes (`bg-brand-red`, `text-brand-red`, etc.) that developers use in JSX.

### File Locations

| File | Purpose |
|---|---|
| `src/app/globals.css` | Primitive + semantic token definitions, base styles |
| `@theme inline` block | Tailwind v4 token registration |
| `:root` / `.dark` blocks | Light/dark mode primitive values |
| `@layer base` block | Global element styles (body font, border defaults) |

### shadcn/ui Integration

shadcn/ui components consume the standard semantic tokens (`--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, etc.) through Tailwind classes. Our custom brand tokens (`--brand-red`, `--dark-navy`, `--bg-slate`) extend this system without conflicting.

The key semantic token mappings for shadcn/ui compatibility:

```css
/* Light mode */
--primary: oklch(0.205 0 0);        /* Near-black for primary actions */
--primary-foreground: oklch(0.985 0 0); /* White text on primary */
--muted: oklch(0.97 0 0);           /* Light gray for muted backgrounds */
--muted-foreground: oklch(0.556 0 0); /* Medium gray for muted text */
--destructive: oklch(0.577 0.245 27.325); /* Red for destructive actions */
--border: oklch(0.922 0 0);         /* Ultra-light border color */
```

---

## 3. Color Palette

### Brand Colors

| Token | Value | Tailwind Class | Usage |
|---|---|---|---|
| `--brand-red` | `#FF2109` | `bg-brand-red`, `text-brand-red` | Primary CTA buttons, active sidebar indicators, logo background, accent highlights |
| `--dark-navy` | `#0f172a` | `bg-dark-navy`, `text-dark-navy` | Sidebar background |
| `--bg-slate` | `#f8fafc` (light) / `#0f172a` (dark) | `bg-bg-slate` | App background, form panel background, canvas surround |

### Semantic Colors (shadcn/ui)

| Token | Light Value | Purpose |
|---|---|---|
| `--background` | `oklch(1 0 0)` (white) | Page background |
| `--foreground` | `oklch(0.145 0 0)` (near-black) | Primary text |
| `--card` | `oklch(1 0 0)` (white) | Card backgrounds |
| `--muted` | `oklch(0.97 0 0)` (gray-50) | Subdued backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` (gray-500) | Secondary/helper text |
| `--border` | `oklch(0.922 0 0)` (gray-200) | Borders and dividers |
| `--destructive` | `oklch(0.577 0.245 27.325)` (red) | Delete actions, error states |

### Functional Colors (Hardcoded Tailwind)

These colors are used directly from Tailwind's default palette for specific functional purposes:

| Color | Tailwind Classes | Usage |
|---|---|---|
| Gray scale | `text-gray-400`, `text-gray-500`, `text-gray-700`, `text-gray-800` | Form labels, helper text, headings, breadcrumbs |
| Slate scale | `text-slate-400`, `text-slate-500`, `text-slate-600`, `bg-slate-50`, `bg-slate-100` | Table headers, computed values, canvas backgrounds |
| Amber | `bg-amber-50`, `border-amber-200`, `text-amber-700`, `text-amber-800` | Tip/info cards |
| Green | `bg-green-500` | Active toggle switches |
| Red | `hover:text-red-500` | Delete button hover state |

### Color Usage Rules

1. **Brand red is accent-only** — Never use `bg-brand-red` for large surfaces. It is reserved for:
   - CTA buttons (document preview update)
   - Active sidebar indicators (left border + icon tint)
   - Logo mark background
   - Header document type icon tint

2. **Dark navy is sidebar-only** — The `bg-dark-navy` token is exclusively for the sidebar background. No other component should use this color.

3. **White is the primary surface** — All form cards, headers, and popover containers use pure white (`bg-white`).

4. **Gray-100 borders separate** — The ultra-subtle `border-gray-100` creates visual separation without harsh lines.

5. **No raw hex in JSX** — Every color reference must use either a Tailwind class or a CSS variable. The only exceptions are:
   - `rgba(255,33,9,0.12)` for active sidebar item backgrounds (opacity variant of brand red)
   - `rgba(0,0,0,0.12)` for document canvas paper shadow

---

## 4. Typography Scale

### Font Family

**Primary**: `'DM Sans', sans-serif` — Set globally in `@layer base` body rule.

DM Sans was chosen for its excellent readability at small sizes, clean geometric forms, and comprehensive weight range. It pairs well with both the document preview content and the dense form UI.

**Fallbacks**: Geist Sans (`--font-geist-sans`) registered as `--font-sans` for shadcn/ui component compatibility. Geist Mono (`--font-geist-mono`) available for monospace contexts (logo scale readout, computed values).

### Type Scale

The application uses a constrained type scale to maintain visual harmony:

| Token / Size | Pixel Equivalent | Weight | Usage |
|---|---|---|---|
| `text-[9px]` | 9px | `font-bold` | Extreme micro labels: sidebar section headers ("HR MANAGEMENT", "DOCUMENTS"), sidebar subtitle ("HR Document Gen") |
| `text-[10px]` | 10px | `font-medium` or `font-bold` | Form field labels, sub-category headers, item counters, status hints |
| `text-[11px]` | 11px | — | Template button text (compact buttons) |
| `text-xs` | 12px | `font-medium` or `font-semibold` or `font-bold` | Standard form labels, sidebar nav items, breadcrumbs, form input text, button labels, section headings |
| `text-sm` | 14px | `font-medium` or `font-semibold` | Body text, loading state labels, panel titles |
| `text-base` | 16px | `font-bold` or `font-extrabold` | Sidebar brand name, major headings |
| `text-lg` | 18px | `font-bold` | Loading screen app title |
| `text-2xl` | 24px | `font-extrabold` | Logo mark letter ("B") |

### Typography Patterns

**Section Headers** (inside form cards):
```
text-xs font-bold text-gray-700 uppercase tracking-widest
```

**Sub-Category Labels** (template groups):
```
text-[10px] text-gray-400 font-medium uppercase tracking-wider
```

**Form Field Labels**:
```
text-[10px] text-gray-400 uppercase
```
or
```
text-xs font-medium text-gray-500
```

**Sidebar Section Labels** (collapsed and expanded):
```
text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]
```

**Sidebar Nav Items**:
```
text-xs font-medium whitespace-nowrap
```

**Breadcrumb Text**:
```
text-xs text-gray-400  (path segment)
text-xs font-semibold text-gray-800  (active segment)
```

### Typography Rules

1. **Never invent new sizes** — Use only the sizes defined in the scale above. If a new context arises, map it to the nearest existing size.
2. **Uppercase demands tracking** — Any `uppercase` text must include either `tracking-wider`, `tracking-widest`, or `tracking-[0.15em]`.
3. **Weight conveys hierarchy** — `font-bold` for headers, `font-semibold` for active states, `font-medium` for labels, default weight for body text.
4. **Color conveys importance** — `text-gray-800` for primary content, `text-gray-700` for section headers, `text-gray-500` for labels, `text-gray-400` for hints and metadata.

---

## 5. Spacing & Layout

### Overall Layout Architecture

The application uses a full-height, three-column flex layout:

```
┌─────────────────────────────────────────────────────────┐
│  Header (h-14, flex-shrink-0, bg-white, border-b)       │
├────────┬──────────────┬─────────────────────────────────┤
│        │              │                                 │
│ Sidebar│  Config Form │  Document Canvas                │
│ 64/256 │  w-[320px]   │  flex-1                         │
│ px     │  flex-shrink-0│                                │
│        │              │                                 │
│ bg-    │  bg-bg-slate │  bg-slate-100                   │
│ dark-  │  border-r    │                                 │
│ navy   │  ScrollArea  │  overflow-auto                  │
│        │              │                                 │
├────────┴──────────────┴─────────────────────────────────┤
```

### Column Widths

| Column | Width | Behavior |
|---|---|---|
| Sidebar (collapsed) | `64px` | Fixed, icon-only mode |
| Sidebar (expanded) | `256px` (`w-64`) | Fixed, full labels visible |
| Config Form Panel | `320px` (`w-[320px]`) | Fixed, `flex-shrink-0`, scroll-independent |
| Document Canvas | `flex-1` | Fills remaining width, responsive |
| Document Paper | `(zoomLevel / 100) × 794px` | Calculated, centered with `mx-auto` |

### Header Dimensions

| Element | Height | Notes |
|---|---|---|
| Header bar | `h-14` (56px) | `flex-shrink-0`, does not compress |
| Preview header bar | `h-9` (36px) | Inside document canvas, above toolbar |
| Editor status bar | Auto | Inside document canvas, below paper |

### Spacing Scale

The spacing system aligns to Tailwind's default 4px base unit:

| Token | Value | Usage |
|---|---|---|
| `gap-1` | 4px | Tight icon groups |
| `gap-1.5` | 6px | Icon-text pairs, breadcrumb items, button icon spacing |
| `gap-2` | 8px | Form field gaps, grid gaps, button groups |
| `gap-2.5` | 10px | Header center badge padding |
| `gap-3` | 12px | Card internal section spacing, wider grid gaps |
| `gap-4` | 16px | Major section separators |
| `gap-5` | 20px | Loading screen element spacing |
| `p-2` | 8px | Textarea and input padding |
| `p-4` | 16px | Card padding, form panel padding |
| `p-6` | 24px | Canvas area padding, settings page padding |
| `px-3` | 12px | Badge horizontal padding |
| `px-4` | 16px | Header horizontal padding, sidebar section padding |
| `px-5` | 20px | Header outer padding |
| `space-y-1` | 4px | Within form field groups |
| `space-y-2` | 8px | Between form fields |
| `space-y-3` | 12px | Between card sections |
| `space-y-4` | 16px | Between form cards |

### Spacing Rules

1. **Card padding is always `p-4`** — No variation for form cards.
2. **Section gaps inside cards are `space-y-3`** — Between groups within a card.
3. **Card-to-card gap is `space-y-4`** — Between separate card containers in the form panel.
4. **Grid gaps are `gap-2` (tight) or `gap-3` (wide)** — For 2-column and 3-column form grids.
5. **Button heights are either `h-8` (compact) or `h-9` (CTA)** — No other button heights.

---

## 6. Animation Strategy

### Library: Framer Motion

Framer Motion was chosen for its React-native API, excellent performance characteristics, and `AnimatePresence` support for exit animations — something CSS transitions cannot handle.

### Animation Inventory

| Animation | Component | Framer API | Duration | Easing | Purpose |
|---|---|---|---|---|---|
| Sidebar width | `Sidebar.tsx` | `motion.aside animate={{ width }}` | `0.2s` | `easeInOut` | Smooth expand/collapse without layout reflow |
| Brand text reveal | `Sidebar.tsx` | `AnimatePresence` + `motion.div opacity, width` | `0.15s` | default (spring) | Fade-in label text when sidebar expands |
| Breadcrumb sync | `Header.tsx` | `motion.div animate={{ width }}` | `0.2s` | `easeInOut` | Keep header breadcrumb zone aligned with sidebar |
| Loading ping | `page.tsx` | CSS `animate-ping` | continuous | ease | Brand logo pulse during app initialization |
| Loading spin | `page.tsx` | CSS `animate-spin` | continuous | linear | Spinner during workspace loading |
| PDF loading spin | `Header.tsx` | CSS `animate-spin` | continuous | linear | Spinner during PDF generation |

### Animation Timing Guidelines

| Context | Duration | Rationale |
|---|---|---|
| Layout transitions (sidebar, header) | `200ms` | Fast enough to feel instant, slow enough to track visually |
| Content reveals (labels, badges) | `150ms` | Slightly faster than layout to avoid feeling sluggish |
| Micro-interactions (button hover, color change) | `150–200ms` via Tailwind `transition-colors duration-200` | Standard CSS transition, no Framer Motion needed |
| Continuous feedback (spinners, pulses) | Infinite | CSS animations for loading states |

### Easing Functions

| Easing | Usage |
|---|---|
| `easeInOut` | Layout transitions (sidebar width, header width) — natural deceleration on both ends |
| Spring (Framer default) | Content reveals — slight overshoot creates lively feel |
| `linear` | Spinners — constant rotation speed |
| `ease` | Ping animation — standard CSS easing |

### Animation Rules

1. **Layout animations use Framer Motion** — Any animation that changes the size or position of a layout-affecting element must use `motion.*` components to avoid forced reflows.
2. **Color/opacity transitions use CSS** — Hover states, focus states, and simple fades use Tailwind's `transition-*` utilities for better performance (GPU-composited).
3. **Exit animations require AnimatePresence** — Any element that unmounts (sidebar labels, overlays) must be wrapped in `AnimatePresence` to animate out before removal.
4. **Never animate height on content** — Use `width` and `opacity` for reveals. Height animations cause complex reflow calculations.
5. **Match connected animations** — The sidebar and header breadcrumb zone share identical `duration: 0.2, ease: 'easeInOut'` to move in lockstep.
6. **No decorative animations** — Every animation serves a functional purpose (spatial orientation, loading feedback, or transition smoothing). No parallax, no bouncing, no gratuitous motion.

---

## 7. Component Patterns

### 7.1 Sidebar Pattern

```
┌──────────────────────┐
│ [Logo] Brand  [◀/≡] │  ← Brand bar (h-14, border-b)
├──────────────────────┤
│ HR MANAGEMENT        │  ← Section header (uppercase, tracking)
│ ▌ 👤 Add/Edit       │  ← Nav item (h-10, active: brand-red left border)
│   📋 Employee List   │
├──────────────────────┤  ← Divider (border-t border-white/10)
│ DOCUMENTS            │
│   📝 Official Pad    │
│   📋 Work Order      │
│   🛒 Purchase Order  │
│   ... (9 items)      │
├──────────────────────┤
│   ⚙️ Settings        │
└──────────────────────┘
```

**Key patterns**:
- Dark background (`bg-dark-navy`) with light text (`text-slate-300`)
- Active items: `text-white` + `bg-[rgba(255,33,9,0.12)]` + `borderLeft: 3px solid var(--brand-red)`
- Inactive items: `text-slate-400 hover:text-slate-200`
- Icon column: Fixed `w-16` flex container, icons centered
- Labels hidden when collapsed, shown with `AnimatePresence` when expanded

### 7.2 Header Pattern

```
┌──────────────┬──────────────────┬────────────────────┐
│ Workspace ›  │  [📝 Official    │ [PDF] [DOC] [🖨️]  │
│ Official Pad │   Pad]           │ [⬗]               │
└──────────────┴──────────────────┴────────────────────┘
  ↑ Breadcrumb    ↑ Center badge     ↑ Action buttons
  (synced width)  (pill-shaped)      (rounded-full)
```

**Key patterns**:
- Fixed height `h-14` with `bg-white border-b border-gray-100 shadow-xs`
- Three-zone flex layout: left (breadcrumb), center (`flex-1`), right (actions)
- Breadcrumb zone width animated in sync with sidebar
- Center badge: `rounded-full bg-slate-50` with icon + label
- Action buttons: `rounded-full border border-gray-200 bg-white shadow-xs`

### 7.3 Config Panel Pattern

```
┌──────────────────────────────┐
│ QUICK TEMPLATES              │ ← Section header
│ [Service WOs]                │ ← Sub-category
│ [WO-01 BDCOM] [WO-02 BRAC]  │ ← Template buttons
├──────────────────────────────┤
│ ORDER INFO                   │
│ ┌──────────┬────────────┐    │ ← 2-column grid
│ │ Type  ▼  │ WO Number  │    │
│ │ Ref Code │ Priority ▼ │    │
│ └──────────┴────────────┘    │
├──────────────────────────────┤
│ VENDOR / SUPPLIER            │
│ Company Name: [___________]  │ ← FormField component
│ Contact:      [___________]  │
├──────────────────────────────┤
│ [Update Document Preview]    │ ← CTA (brand-red)
└──────────────────────────────┘
```

**Key patterns**:
- Each section is a white card: `bg-white rounded-xl p-4 shadow-xs border border-gray-100`
- Section headers: `text-xs font-bold text-gray-700 uppercase tracking-widest`
- Cards stacked with `space-y-4` gap
- Entire panel scrollable via `ScrollArea`
- CTA button always at bottom: `w-full bg-brand-red h-9`

### 7.4 Document Canvas Pattern

```
┌────────────────────────────────────────┐
│ 👁 Live Document  "Click to edit"  [⤢] │ ← Preview header (h-9)
├────────────────────────────────────────┤
│ [B][I][U][S] | [≡][≡][≡][≡] | [±] 55%│ ← EditorToolbar
├────────────────────────────────────────┤
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ ░░░░┌──────────────────────────┐░░░░░░│ ← bg-slate-100 canvas
│ ░░░░│                          │░░░░░░│
│ ░░░░│   [DOCUMENT PREVIEW]     │░░░░░░│ ← White paper (shadow-lg)
│ ░░░░│                          │░░░░░░│
│ ░░░░│                          │░░░░░░│ ← iframe with srcDoc
│ ░░░░│                          │░░░░░░│
│ ░░░░└──────────────────────────┘░░░░░░│
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
├────────────────────────────────────────┤
│ 📊 Words: 142  Chars: 891  Ready      │ ← EditorStatusBar
└────────────────────────────────────────┘
```

**Key patterns**:
- Gray canvas area: `bg-slate-100 p-6 overflow-auto`
- Paper container: `bg-white rounded-lg` with `boxShadow: '0 4px 24px rgba(0,0,0,0.12)'`
- Paper width calculated: `(zoomLevel / 100) × 794px` centered with `mx-auto`
- Iframe uses inverse scale: `width: 794 / (zoomLevel / 100)px` with `transform: scale(zoomLevel / 100)`
- Fullscreen mode: `fixed inset-0 z-50`

### 7.5 Form Card Pattern

Every form section follows this template:

```tsx
<div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-3">
  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
    Section Title
  </h3>
  <div className="space-y-2">
    <FormField label="Label" value={value} onChange={onChange} />
    {/* ... more fields */}
  </div>
</div>
```

### 7.6 Dialog / Modal Pattern

Modals use shadcn/ui `Dialog` components with:
- Overlay: `bg-black/50`
- Content: `bg-white rounded-xl p-6 max-w-md`
- Title: `text-lg font-bold`
- Description: `text-sm text-muted-foreground`
- Actions: right-aligned button group with `gap-2`

---

## 8. Industry Best Practices Referenced

### HR Platforms That Informed the Design Direction

| Platform | Design Elements Adopted |
|---|---|
| **BambooHR** | Clean white card-based layouts, sidebar navigation with section grouping, compact form styling with inline labels |
| **Gusto** | Friendly rounded corners (`rounded-xl`), warm yet professional color palette, step-by-step progressive disclosure patterns |
| **Rippling** | Dense information layouts that remain readable, dark sidebar navigation, status badges and pill-shaped indicators |
| **Deel** | Modern three-panel layout (nav → config → content), crisp typography hierarchy, minimalist form styling |
| **Freshteam** | Template quick-fill patterns, collapsible form sections, live preview panels |

### Document Generation Tools That Informed the Canvas

| Tool | Design Elements Adopted |
|---|---|
| **Google Docs** | Toolbar-above-canvas pattern, zoom controls integrated in toolbar, status bar with word/character counts |
| **Notion** | Clean inline editing with contentEditable, slash command patterns, minimal toolbar design |
| **Canva** | Side-panel configuration with live canvas preview, zoom slider, fullscreen toggle |
| **PandaDoc** | Document template filling with form fields on the left and preview on the right, PDF/DOC export buttons in header |

### Design System References

| System | Principles Adopted |
|---|---|
| **shadcn/ui** | Component composition patterns, CSS variable-based theming, accessible primitives (Radix UI) |
| **Tailwind UI** | Spacing and typography scale decisions, card layout patterns, button styling conventions |
| **Vercel Geist** | Font selection (Geist Sans/Mono as fallback), minimal elevation philosophy, dark mode token structure |
| **Material Design 3** | Semantic color roles (surface, on-surface, primary, on-primary), elevation hierarchy (3 levels) |

### Key Takeaways from Industry Analysis

1. **Three-panel layout is the standard** for document generation tools. Left nav → middle config → right preview.
2. **Dark sidebar with light main content** is the dominant pattern in B2B SaaS (Rippling, Linear, Vercel Dashboard).
3. **Template quick-fill** dramatically reduces time-to-first-document in HR tools.
4. **Live preview** is table-stakes — users expect WYSIWYG rendering without a "Generate" step.
5. **Export actions in the header** (not buried in menus) is the pattern from Google Docs and PandaDoc.

---

## 9. Accessibility Considerations

### Keyboard Navigation

| Context | Keyboard Support | Implementation |
|---|---|---|
| Sidebar navigation | `Tab` to reach items, `Enter`/`Space` to activate | Native `<button>` elements with `onClick` handlers |
| Form fields | `Tab` order follows visual layout | Native `<input>`, `<textarea>`, and shadcn `<Select>` (Radix) |
| Toolbar buttons | `Tab` to reach, `Enter`/`Space` to activate | Native `<button>` elements |
| Dialog modals | Focus trap, `Escape` to close | shadcn `Dialog` (Radix Dialog primitive) |
| Scroll areas | Native scroll, `ScrollArea` keyboard support | shadcn `ScrollArea` (Radix Scroll Area) |
| Slider controls | Arrow keys to adjust value | shadcn `Slider` (Radix Slider primitive) |

### Focus States

All interactive elements use Tailwind's outline ring system:

```css
* {
  @apply outline-ring/50;
}
```

This applies a consistent focus outline via `--ring` token (light mode: `oklch(0.708 0 0)`, a medium gray). The `ring/50` opacity ensures the focus indicator is visible but not overpowering.

### Color Contrast

| Element | Foreground | Background | Contrast Ratio | WCAG Level |
|---|---|---|---|---|
| Body text | `oklch(0.145 0 0)` (near-black) | White | ~18.5:1 | AAA |
| Gray-700 text | `text-gray-700` (~`#374151`) | White | ~9.3:1 | AAA |
| Gray-500 text | `text-gray-500` (~`#6b7280`) | White | ~5.9:1 | AA |
| Gray-400 text | `text-gray-400` (~`#9ca3af`) | White | ~3.5:1 | AA (large text only) |
| White text on brand-red | White | `#FF2109` | ~4.1:1 | AA |
| White text on dark-navy | White | `#0f172a` | ~16.8:1 | AAA |
| Slate-300 text on dark-navy | `text-slate-300` (~`#cbd5e1`) | `#0f172a` | ~10.2:1 | AAA |

### Known Accessibility Gaps

> [!WARNING]
> The following items should be addressed in future iterations:

1. **`text-gray-400` on white backgrounds**: Used for form labels and hints, this combination provides only ~3.5:1 contrast — below WCAG AA for normal text (requires 4.5:1). Consider upgrading to `text-gray-500` for better accessibility.

2. **Brand red on white for text**: `text-brand-red` (`#FF2109`) on white provides ~4.1:1 contrast — passes AA but not AAA. Acceptable for icons and accents, but avoid for long-form text.

3. **Sidebar `text-[9px]` labels**: At 9px, these labels are extremely small and may be difficult to read for users with low vision. They are uppercase with wide tracking which helps legibility, but the size should be monitored.

4. **No `aria-label` on icon-only buttons**: The sidebar's collapsed state shows icon-only buttons without text labels. These should include `aria-label` attributes or `title` attributes (currently partially implemented via `title` on some buttons).

5. **No `prefers-reduced-motion` support**: Framer Motion animations do not currently respect the user's `prefers-reduced-motion` media query. Add `useReducedMotion()` hook from Framer Motion to disable animations for users who prefer reduced motion.

6. **Iframe content accessibility**: The document preview iframe contains generated HTML that may not include proper heading hierarchy, ARIA landmarks, or alt text for images. Since this content is for preview/print purposes only, the impact is limited, but it should be considered.

### Recommended Future Improvements

1. Add `aria-label` to all icon-only buttons in collapsed sidebar
2. Implement `useReducedMotion()` to honor system preferences
3. Add skip-to-content link for keyboard users
4. Audit all `text-gray-400` label usages and upgrade to `text-gray-500` where feasible
5. Add focus-visible indicators differentiated from focus indicators
6. Test with screen readers (NVDA, VoiceOver) across all document generation workflows

---

*This design strategy is a living document. It should be updated as the design system evolves, new components are added, or accessibility improvements are implemented.*
