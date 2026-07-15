'use client'

import { FormField } from './FormField'
import { Separator } from '@/components/ui/separator'
import type { MismatchField } from '@/lib/mismatch'

interface SalaryFieldsProps {
  formData: Record<string, any>
  setField: (key: string, value: any) => void
  mismatches: MismatchField[]
  showCash?: boolean
  showBankTotal?: boolean
  showAnnual?: boolean
}

export function SalaryFields({ formData, setField, mismatches, showCash = true, showBankTotal = true, showAnnual = false }: SalaryFieldsProps) {
  const mm = (key: string) => mismatches.find(m => m.key === key)

  const numField = (key: string, label: string, readOnly = false) => (
    <FormField
      label={label} type="number" value={formData[key] ?? ''}
      onChange={v => setField(key, v === '' ? 0 : Number(v))}
      readOnly={readOnly} mismatch={mm(key)} suffix="BDT"
    />
  )

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earnings</h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {numField('basic', 'Basic Salary')}
        {numField('house_rent', 'House Rent')}
        {numField('conveyance', 'Conveyance')}
        {numField('medical', 'Medical Allowance')}
        {numField('food_mobile', 'Food & Mobile')}
        {showCash && numField('cash', 'Cash Payment')}
      </div>
      <Separator className="my-1" />
      {showBankTotal && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {numField('bank_total', 'Bank Total', true)}
          {numField('gross', 'Gross Salary', true)}
        </div>
      )}
      {!showBankTotal && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {numField('gross', 'Gross Salary', true)}
        </div>
      )}
      <Separator className="my-1" />
      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deductions</h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {numField('tax', 'Source Tax (AIT)')}
        {numField('net', 'Net Salary', true)}
      </div>
      {showAnnual && (
        <>
          <Separator className="my-1" />
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Annual</h4>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {numField('annual_gross', 'Annual Gross', true)}
            {numField('annual_net', 'Annual Net', true)}
          </div>
        </>
      )}
    </div>
  )
}
