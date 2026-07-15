# BRIEFING — 2026-06-17T20:36:00+06:00

## Mission
Formulate a precise fix strategy for replacing hardcoded hex color `#FF2109` in JSX with standard Tailwind CSS variables/classes.

## 🔒 My Identity
- Archetype: teamwork_preview_explorer (Remediation Explorer 3)
- Roles: Read-only investigation, analysis, reporting
- Working directory: D:\OPEN Work-Space\BH HR APP DOCUGEN\.agents\teamwork_preview_explorer_fix_3
- Original parent: e8e2753d-0c9d-4f56-9afd-a4fe9f4cb35b
- Milestone: Fix hardcoded hex colors (#FF2109) in JSX forms

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- CODE_ONLY network mode: no external requests, only local code searches and views.

## Current Parent
- Conversation ID: e8e2753d-0c9d-4f56-9afd-a4fe9f4cb35b
- Updated: 2026-06-17T20:26:54+06:00

## Investigation State
- **Explored paths**:
  - `src/components/forms/AppointmentForm.tsx` (Lines 157, 165)
  - `src/components/forms/ExperienceForm.tsx` (Line 114)
  - `src/components/forms/EmploymentCertForm.tsx` (Line 109)
  - `src/components/forms/PaySlipForm.tsx` (Line 169)
  - `src/components/forms/SalaryCertForm.tsx` (Line 150)
  - `src/app/globals.css` (Tailwind v4 theme definition)
  - `tailwind.config.ts` (Tailwind config file)
  - `src/components/ui/button.tsx` (Button component interface)
- **Key findings**:
  - All 5 form files use inline style `style={{ background: '#FF2109' }}` for their action buttons.
  - `globals.css` defines `--brand-red: #FF2109;` in both `:root` and `.dark`.
  - `globals.css` contains `@theme inline { --color-brand-red: var(--brand-red); }` under Tailwind v4.
  - This setup allows standard class usage like `bg-brand-red` and hover variant `hover:bg-brand-red/90` or similar opacity/shade variants.
- **Unexplored areas**: None. The scope is fully explored and verified.

## Key Decisions Made
- Recommending replacing all `style={{ background: '#FF2109' }}` instances with the utility classes `bg-brand-red hover:bg-brand-red/90` inside the `className` attribute of the `<Button>` components.
- Verified that `tailwind-merge` (`cn` helper) will correctly override the default Button background class `bg-primary` with `bg-brand-red`.

## Artifact Index
- D:\OPEN Work-Space\BH HR APP DOCUGEN\.agents\teamwork_preview_explorer_fix_3\handoff.md — Analysis and recommendation report
