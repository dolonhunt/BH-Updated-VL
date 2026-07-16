'use client'
import { Construction } from 'lucide-react'

interface ComingSoonFormProps {
  label?: string
}

export function ComingSoonForm({ label }: ComingSoonFormProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="text-base font-semibold mb-1">{label || 'Coming Soon'}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        This document template is under development. Check back soon.
      </p>
    </div>
  )
}
