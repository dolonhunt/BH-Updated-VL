## 2026-06-22T19:13:34+06:00
You are the Worker agent for Phase 3 Optimization of BH HR APP DOCUGEN.
Your task is to implement the code modifications detailed in the explorer's handoff report located at:
`D:\OPEN Work-Space\BH HR APP DOCUGEN\.agents\teamwork_preview_explorer_phase3_3\handoff.md`

Please carefully read that file and apply the modifications to the following files:
1. `src/lib/preview-store.ts`
2. `src/hooks/useDocumentForm.ts`
3. `src/hooks/useEditorBridge.ts`
4. `src/hooks/useDocumentPreview.ts`
5. `src/app/page.tsx`
6. `src/components/editor/DocumentCanvas.tsx`

Ensure that:
- Formatting, typing, and scroll height calculations are correct.
- All manual edits inside the iframe DOM are correctly read for Print, Open in New Tab, PDF, and DOC download features.
- Warn the user if form fields or employee selects are modified after manual edits have been made.
- Dynamic height and zoom calculations are applied using the transform scale wrapper method with no inner iframe scrollbars.
- Key hooks/callbacks in the header use the live HTML content.

Verification:
- Run `npm run tsc` to verify TypeScript type checking passes.
- Run `npm run lint` to verify linting passes with zero errors.
- Run `npm run build` to verify the Next.js production build succeeds.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your working directory is `D:\OPEN Work-Space\BH HR APP DOCUGEN\.agents\teamwork_preview_worker_phase3_retry_2`. Report your progress in `progress.md` inside your directory and write a final `handoff.md` summarizing the changes and verification results.
