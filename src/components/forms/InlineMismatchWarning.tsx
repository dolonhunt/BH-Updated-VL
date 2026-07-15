'use client'
import type { MismatchField } from '@/lib/mismatch'

export function InlineMismatchWarning({ mismatch }: { mismatch?: MismatchField }) {
  if (!mismatch) return null
  return (
    <p className="text-[9px] text-amber-600 flex items-center gap-1 mt-0.5">
      ⚠ Differs from master data ({String(mismatch.masterValue)})
    </p>
  )
}
