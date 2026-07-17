'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

/** Small uppercase section label used to group fields within a form. */
export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{children}</h4>
  )
}

/** Placeholder shown while the user is adding a brand-new employee. */
export function AddEmployeeFirstNotice() {
  return (
    <div className="text-center text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-200">
      Please add employee first
    </div>
  )
}

/** Success banner shown after a document has been generated. */
export function GeneratedBanner({ children }: { children: ReactNode }) {
  return (
    <div className="text-center text-xs text-emerald-600 font-medium p-3 bg-emerald-50 rounded-lg border border-emerald-200">
      {children}
    </div>
  )
}

/** Full-width brand-coloured primary action button used to trigger generation. */
export function PrimaryActionButton({
  onClick,
  children,
}: {
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
    >
      {children}
    </Button>
  )
}
