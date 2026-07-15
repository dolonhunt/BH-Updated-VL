'use client'
import { useState } from 'react'
import { Search, Plus, Users, Pencil, Trash2, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAllEmployees, invalidateEmployeeCache } from '@/lib/use-employees'
import { deleteEmployee } from '@/lib/storage'
import { formatBDTShort } from '@/lib/calculations'

interface EmployeeListViewProps {
  onEdit: (id: string) => void
  onAddNew: () => void
  onViewDocs: (id: string) => void
}

export function EmployeeListView({ onEdit, onAddNew, onViewDocs }: EmployeeListViewProps) {
  const rawEmployees = useAllEmployees()
  const employees = Array.isArray(rawEmployees) ? rawEmployees : []
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase()
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.ref_code.toLowerCase().includes(q)
    )
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteEmployee(deleteTarget.id)
      invalidateEmployeeCache()
    } catch (err) {
      console.error('Failed to delete employee:', err)
    }
    setDeleteTarget(null)
  }

  // Empty state
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No employees yet</h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
          Add your first employee to start generating HR documents.
        </p>
        <Button
          onClick={onAddNew}
          className="text-white bg-brand-red hover:bg-brand-red/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Employee
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={onAddNew}
          className="text-white shrink-0 bg-brand-red hover:bg-brand-red/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Employee
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Designation</TableHead>
              <TableHead className="hidden lg:table-cell">Department</TableHead>
              <TableHead className="text-right">Net Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No employees match &quot;{search}&quot;
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono text-xs">{emp.id}</TableCell>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {emp.designation}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {emp.department}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatBDTShort(emp.net)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.status === 'active' ? 'default' : 'secondary'}
                      className={
                        emp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : ''
                      }
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(emp.id)}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDocs(emp.id)}
                        title="Documents"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget({ id: emp.id, name: emp.name })}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} employee{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
