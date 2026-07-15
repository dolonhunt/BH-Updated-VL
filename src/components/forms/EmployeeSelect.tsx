'use client'

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Employee } from '@/lib/storage'

interface EmployeeSelectProps {
  employees: Employee[]
  value: string
  onChange: (id: string) => void
  allowNew?: boolean
}

export function EmployeeSelect({ employees, value, onChange, allowNew = true }: EmployeeSelectProps) {
  return (
    <div className="space-y-0.5">
      <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
        Employee
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Select employee..." />
        </SelectTrigger>
        <SelectContent>
          {allowNew && <SelectItem value="__new__">+ New Employee</SelectItem>}
          {employees.map(emp => (
            <SelectItem key={emp.id} value={emp.id}>
              {emp.id} — {emp.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
