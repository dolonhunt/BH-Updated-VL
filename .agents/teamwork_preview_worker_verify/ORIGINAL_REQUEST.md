## 2026-06-17T19:08:42Z
You are the Build Verifier and Refactoring Optimizer (teamwork_preview_worker).
Your coordination files directory is: D:\OPEN Work-Space\BH HR APP DOCUGEN\.agents\teamwork_preview_worker_verify

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Please execute the following tasks:
1. Initialize your progress.md inside your coordination directory to track your status.
2. Read `src/app/page.tsx`. It is currently 272 lines, which is over the acceptance criteria limit of 200 lines. Refactor it further to reduce it strictly below 200 lines. (Hint: Extract the document action handlers like `handleDownloadPDF`, `handleDownloadDOC`, `handlePrint`, or the preview fetch `useEffect` logic into a custom hook in `src/hooks/` or a layout component).
3. Execute the full verification checks:
   - Run the build: `bun run build`
   - Run type checks: `npx tsc --noEmit`
   - Run lint checks: `bun run lint` (or `npm run lint`)
4. If there are any compilation, type, or lint errors introduced in this or previous phases, fix them in place. Make sure all changes are clean and preserve functional integrity.
5. Create your handoff.md inside your coordination directory detailing the exact commands run, the console outputs of the build/type/lint tools, the final line count of `src/app/page.tsx`, and confirming that all checks pass successfully.

Send a status update message to the Project Orchestrator (Conversation ID: e8e2753d-0c9d-4f56-9afd-a4fe9f4cb35b) when you begin and when you complete your task.
