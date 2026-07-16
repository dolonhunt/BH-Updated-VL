'use client'
import { LayoutDashboard, UserPlus, List, Settings } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CATEGORIES, View } from './Sidebar'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (view: View) => void
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search documents, employees, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { onNavigate('dashboard'); onOpenChange(false) }}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => { onNavigate('employees'); onOpenChange(false) }}>
            <UserPlus className="w-4 h-4" /> Add Employee
          </CommandItem>
          <CommandItem onSelect={() => { onNavigate('employee_list'); onOpenChange(false) }}>
            <List className="w-4 h-4" /> Employee List
          </CommandItem>
          <CommandItem onSelect={() => { onNavigate('settings'); onOpenChange(false) }}>
            <Settings className="w-4 h-4" /> Settings
          </CommandItem>
        </CommandGroup>
        {CATEGORIES.map(cat => (
          <CommandGroup key={cat.name} heading={cat.name}>
            {cat.items.map(item => (
              <CommandItem
                key={item.key}
                onSelect={() => { onNavigate(item.key as View); onOpenChange(false) }}
              >
                <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
