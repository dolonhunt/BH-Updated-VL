'use client'
import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAllEmployees, invalidateEmployeeCache } from '@/lib/use-employees'
import { saveEmployee, type Employee } from '@/lib/storage'
import { calculateGross, calculateNet, formatBDTShort } from '@/lib/calculations'
import { toast } from 'sonner'

interface EmployeeFormViewProps {
  employeeId: string | null
  onCancel: () => void
  onSaved: () => void
}

function generateNextId(employees: Employee[]): string {
  let maxNum = 0
  for (const emp of employees) {
    const match = emp.id.match(/^EMP(\d+)$/)
    if (match) {
      const num = parseInt(match[1], 10)
      if (num > maxNum) maxNum = num
    }
  }
  return `EMP${String(maxNum + 1).padStart(3, '0')}`
}

interface FormErrors {
  [key: string]: string
}

export function EmployeeFormView({ employeeId, onCancel, onSaved }: EmployeeFormViewProps) {
  const rawEmployees = useAllEmployees()
  const employees: Employee[] = Array.isArray(rawEmployees) ? rawEmployees : []
  const isEditing = !!employeeId

  const [form, setForm] = useState<Record<string, any>>({
    id: '',
    name: '',
    designation: '',
    department: '',
    ref_code: '',
    mobile: '',
    email: '',
    bank_account: '',
    bank_name: '',
    nid: '',
    joining_date: '',
    status: 'active',
    basic: 0,
    house_rent: 0,
    conveyance: 0,
    medical: 0,
    food_mobile: 0,
    cash: 0,
    tax: 0,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  // Load existing employee data for editing
  useEffect(() => {
    if (employeeId) {
      const emp = employees.find(e => e.id === employeeId)
      if (emp) {
        setForm({ ...emp })
      }
    } else {
      setForm(prev => ({ ...prev, id: generateNextId(employees) }))
    }
  }, [employeeId, employees])

  // Auto-calculate gross and net
  const gross = useMemo(() => calculateGross(form), [form])
  const net = useMemo(() => calculateNet(form), [form])

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const updateSalaryField = (field: string, rawValue: string) => {
    const num = parseFloat(rawValue)
    if (rawValue === '' || isNaN(num)) {
      updateField(field, 0)
    } else if (num < 0) {
      // Don't allow negative values
      updateField(field, 0)
    } else {
      updateField(field, num)
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name?.trim()) newErrors.name = 'Name is required'
    if (!form.designation?.trim()) newErrors.designation = 'Designation is required'
    if (!form.department?.trim()) newErrors.department = 'Department is required'
    if (!form.ref_code?.trim()) newErrors.ref_code = 'Reference code is required'
    if (!form.joining_date) newErrors.joining_date = 'Joining date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const emp: Employee = {
        id: form.id,
        name: form.name.trim(),
        designation: form.designation.trim(),
        department: form.department.trim(),
        ref_code: form.ref_code.trim(),
        mobile: form.mobile?.trim() || '',
        email: form.email?.trim() || '',
        bank_account: form.bank_account?.trim() || '',
        bank_name: form.bank_name?.trim() || '',
        nid: form.nid?.trim() || '',
        joining_date: form.joining_date,
        status: form.status || 'active',
        basic: Number(form.basic) || 0,
        house_rent: Number(form.house_rent) || 0,
        conveyance: Number(form.conveyance) || 0,
        medical: Number(form.medical) || 0,
        food_mobile: Number(form.food_mobile) || 0,
        cash: Number(form.cash) || 0,
        gross,
        tax: Number(form.tax) || 0,
        net,
      }
      await saveEmployee(emp)
      invalidateEmployeeCache()
      toast.success(isEditing ? 'Employee updated' : 'Employee saved')
      onSaved()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save employee:', err)
      toast.error(isEditing ? 'Failed to update employee' : 'Failed to save employee')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <span className="text-xs text-gray-400 font-mono">{form.id}</span>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Full name"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input
              id="designation"
              value={form.designation}
              onChange={e => updateField('designation', e.target.value)}
              placeholder="e.g. Editor"
            />
            {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={form.department}
              onChange={e => updateField('department', e.target.value)}
              placeholder="e.g. Editorial"
            />
            {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ref_code">Reference Code *</Label>
            <Input
              id="ref_code"
              value={form.ref_code}
              onChange={e => updateField('ref_code', e.target.value)}
              placeholder="e.g. TBH-46077"
            />
            {errors.ref_code && <p className="text-xs text-destructive">{errors.ref_code}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Banking */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Contact & Banking</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              value={form.mobile}
              onChange={e => updateField('mobile', e.target.value)}
              placeholder="Phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="Email address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_account">Bank Account</Label>
            <Input
              id="bank_account"
              value={form.bank_account}
              onChange={e => updateField('bank_account', e.target.value)}
              placeholder="Account number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              value={form.bank_name}
              onChange={e => updateField('bank_name', e.target.value)}
              placeholder="Bank name"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nid">NID</Label>
            <Input
              id="nid"
              value={form.nid}
              onChange={e => updateField('nid', e.target.value)}
              placeholder="National ID number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employment Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="joining_date">Joining Date *</Label>
            <Input
              id="joining_date"
              type="date"
              value={form.joining_date}
              onChange={e => updateField('joining_date', e.target.value)}
            />
            {errors.joining_date && <p className="text-xs text-destructive">{errors.joining_date}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={v => updateField('status', v)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Salary Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Salary Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            { key: 'basic', label: 'Basic' },
            { key: 'house_rent', label: 'House Rent' },
            { key: 'conveyance', label: 'Conveyance' },
            { key: 'medical', label: 'Medical' },
            { key: 'food_mobile', label: 'Food & Mobile' },
            { key: 'cash', label: 'Cash Payment' },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <div className="relative">
                <Input
                  id={key}
                  type="number"
                  min="0"
                  value={form[key] || ''}
                  onChange={e => updateSalaryField(key, e.target.value)}
                  placeholder="0"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  BDT
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Deductions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tax">Source Tax (AIT)</Label>
            <div className="relative">
              <Input
                id="tax"
                type="number"
                min="0"
                value={form.tax || ''}
                onChange={e => updateSalaryField('tax', e.target.value)}
                placeholder="0"
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                BDT
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Calculated Summary */}
      <Card className="border-2 border-brand-red">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Salary Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Gross Salary</span>
            <span className="font-mono font-medium">{formatBDTShort(gross)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Deductions</span>
            <span className="font-mono font-medium text-destructive">
              -{formatBDTShort(Number(form.tax) || 0)}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Net Salary</span>
            <span className="font-mono font-bold text-lg text-brand-red">
              {formatBDTShort(net)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 pb-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="text-white bg-brand-red hover:bg-brand-red/90"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Employee' : 'Save Employee'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
        </div>
      </div>
    </div>
  )
}
