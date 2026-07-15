## 2026-06-17T12:57:47Z
You are the Refactoring Worker (teamwork_preview_worker).
Your coordination files directory is: D:\OPEN Work-Space\BH HR APP DOCUGEN\.agents\teamwork_preview_worker_refactor

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Please execute the following milestones:

1. Storage Engine Database Integration:
   - Update `src/lib/use-employees.ts` and `src/lib/use-company.ts` to fetch asynchronously from the Next.js database API routes (`/api/employees` and `/api/company`) instead of using browser localStorage. Maintain a clean local memory cache and notify active component listeners so they re-render on cache invalidation.
   - Update `src/lib/storage.ts` to export async `saveEmployee` and `deleteEmployee` functions that make API fetch requests (PUT/POST/DELETE) to the Next.js database endpoints.
   - Refactor `src/hooks/useDocumentForm.ts` to use database-backed hooks and API updates for mismatches.

2. Extract Layout Components from monolithic page.tsx:
   - Create `src/components/layout/Sidebar.tsx` for sidebar navigation. Eliminate hover width resizing layout reflows: implement a toggle-expand/collapse mechanism using a fixed width (e.g. w-64 when expanded, w-16 when collapsed). Add styling using Tailwind utility classes and Framer Motion for expand/collapse transitions.
   - Create `src/components/layout/Header.tsx` for the breadcrumb and action buttons, keeping spacing aligned with the sidebar.
   - Create `src/components/editor/DocumentCanvas.tsx` for the preview pane, zoom control, and document toolbar widgets.

3. Extract Missing Document Forms:
   - Under `src/components/forms/`, create:
     * `OfficialPadForm.tsx` (handles Watermark, Logo scale, alignment overrides)
     * `WorkOrderForm.tsx` (handles vendors, custom fields, dynamic row addition for service details, totals calculation)
     * `PurchaseOrderForm.tsx` (handles procurement specifications, quotations, suppliers, payment details)
     * `RequisitionForm.tsx` (handles supplies categories and approval signatures)
   - Ensure these new forms are properly linked to `useDocumentForm`.

4. Refactor page.tsx:
   - Replace all inline UI blocks in `src/app/page.tsx` with your newly extracted components: Sidebar, Header, DocumentCanvas, EmployeeModule, SettingsForm, and the new document forms.
   - Shrink `src/app/page.tsx` to under 200 lines. Keep it clean and functional.

5. Visual Design Polish (Design System):
   - Review Tailwind CSS variable declarations and ensure all hardcoded color codes (such as brand red #FF2109, dark navy #0f172a, and background #f8fafc) are refactored to use standard Tailwind token classes or CSS variables in JSX.
   - Harmonize typography sizes by cleaning up arbitary pixel declarations (e.g., text-[9px] or text-[13px]) and standardizing onto a 5-6 size utility scale (xs, sm, base, lg, etc.).

6. Verification:
   - Run `bun run build` and `npx tsc --noEmit` and `bun run lint` to verify zero build/type/lint errors.
   - Confirm all 9 document views and edit capabilities continue to work flawlessly.

Please document all modifications in detail, including before/after descriptions, and write a handoff.md inside your coordination directory detailing your results and compilation checks. Send a status message to the Project Orchestrator (Conversation ID: e8e2753d-0c9d-4f56-9afd-a4fe9f4cb35b) when you begin and when you complete your task.
