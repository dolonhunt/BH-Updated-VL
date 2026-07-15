'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { MismatchField } from '@/lib/mismatch'

interface FormFieldProps {
  label: string
  type?: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  mismatch?: MismatchField
  suffix?: string
  className?: string
  error?: string
}

export function FormField({
  label, type = 'text', value, onChange, placeholder, readOnly = false, mismatch, suffix, className = '', error,
}: FormFieldProps) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <Label className="text-[11px] font-medium text-gray-500">{label}</Label>
      <div className="relative">
        <Input
          type={type}
          value={value === 0 && type === 'number' ? '' : value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={[
            'h-8 text-sm',
            readOnly ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-default focus-visible:ring-0' : '',
            mismatch ? 'border-amber-400 focus-visible:ring-amber-300' : '',
            error ? 'border-red-400 focus-visible:ring-red-300' : '',
            suffix ? 'pr-14' : '',
          ].join(' ')}
        />
        {error && (
          <span className="text-[10px] text-red-500 mt-0.5 block">{error}</span>
        )}
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
