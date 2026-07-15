# Run the build
Write-Output "=== BUN BUILD ===" > .\.agents\teamwork_preview_worker_verify\verify_output.log
bun run build >> .\.agents\teamwork_preview_worker_verify\verify_output.log 2>&1

# Run type checks
Write-Output "`n=== TSC TYPE CHECK ===" >> .\.agents\teamwork_preview_worker_verify\verify_output.log
bun x tsc --noEmit >> .\.agents\teamwork_preview_worker_verify\verify_output.log 2>&1

# Run lint checks
Write-Output "`n=== BUN LINT ===" >> .\.agents\teamwork_preview_worker_verify\verify_output.log
bun run lint >> .\.agents\teamwork_preview_worker_verify\verify_output.log 2>&1

Write-Output "`n=== VERIFICATION COMPLETE ===" >> .\.agents\teamwork_preview_worker_verify\verify_output.log
