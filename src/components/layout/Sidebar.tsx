'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard, UserPlus, List, Settings, FileText, ClipboardList,
  ShoppingCart, Receipt, DollarSign, Briefcase, Award, BadgeCheck,
  ChevronLeft, Menu, ScrollText, UserCheck, CreditCard,
  ShieldCheck, User, ChevronDown, TrendingUp, Code, Search
} from 'lucide-react'

export type View =
  | 'dashboard'
  | 'payslip'
  | 'salary_cert'
  | 'appointment'
  | 'experience'
  | 'employment_cert'
  | 'official_pad'
  | 'work_order'
  | 'purchase_order'
  | 'requisition'
  | 'offer_letter'
  | 'nda'
  | 'joining_report'
  | 'id_card_form'
  | 'personal_info_form'
  // Hiring & Onboarding
  | 'probation_confirmation'
  // Employment Proof
  | 'noc_letter'
  | 'bank_intro_letter'
  | 'embassy_letter'
  // Payroll & Compensation
  | 'salary_increment'
  | 'bonus_letter'
  | 'arrear_payment'
  // Disciplinary Actions
  | 'show_cause'
  | 'warning_letter'
  | 'suspension_letter'
  | 'termination_letter'
  // Separation
  | 'resignation_acceptance'
  | 'relieving_letter'
  | 'clearance_cert'
  | 'fnf_settlement'
  // Performance
  | 'promotion_letter'
  | 'pip_letter'
  | 'appreciation_letter'
  // Leave & Attendance
  | 'leave_approval'
  | 'lwp_notice'
  // Other views
  | 'employees'
  | 'employee_list'
  | 'hr_handbook'
  | 'leave_policy'
  | 'settings'
  | 'template_admin'

export type DocType =
  | 'payslip'
  | 'salary_cert'
  | 'appointment'
  | 'experience'
  | 'employment_cert'
  | 'official_pad'
  | 'work_order'
  | 'purchase_order'
  | 'requisition'
  | 'offer_letter'
  | 'nda'
  | 'joining_report'
  | 'id_card_form'
  | 'personal_info_form'
  | 'probation_confirmation'
  | 'noc_letter'
  | 'bank_intro_letter'
  | 'embassy_letter'
  | 'salary_increment'
  | 'bonus_letter'
  | 'arrear_payment'
  | 'show_cause'
  | 'warning_letter'
  | 'suspension_letter'
  | 'termination_letter'
  | 'resignation_acceptance'
  | 'relieving_letter'
  | 'clearance_cert'
  | 'fnf_settlement'
  | 'promotion_letter'
  | 'pip_letter'
  | 'appreciation_letter'
  | 'leave_approval'
  | 'lwp_notice'
  | 'hr_handbook'
  | 'leave_policy'

interface DocItem {
  key: DocType
  label: string
  desc: string
  icon: React.ReactNode
  comingSoon?: boolean
}

export interface Category {
  name: string
  icon: React.ReactNode
  items: DocItem[]
}

export const CATEGORIES: Category[] = [
  {
    name: 'Hiring & Onboarding',
    icon: <Briefcase className="w-4 h-4" />,
    items: [
      { key: 'offer_letter', label: 'Offer Letter', icon: <ScrollText className="w-4 h-4" />, desc: 'Job offer letter' },
      { key: 'appointment', label: 'Appointment Letter', icon: <Briefcase className="w-4 h-4" />, desc: 'Employment confirmation' },
      { key: 'joining_report', label: 'Joining Report', icon: <UserCheck className="w-4 h-4" />, desc: 'Employee joining confirmation' },
      { key: 'probation_confirmation', label: 'Probation Confirmation', icon: <BadgeCheck className="w-4 h-4" />, desc: 'Probation period completion' },
      { key: 'id_card_form', label: 'ID Card', icon: <CreditCard className="w-4 h-4" />, desc: 'Employee ID card request' },
    ],
  },
  {
    name: 'Employment Proof',
    icon: <BadgeCheck className="w-4 h-4" />,
    items: [
      { key: 'employment_cert', label: 'Employment Cert.', icon: <BadgeCheck className="w-4 h-4" />, desc: 'Employment verification' },
      { key: 'salary_cert', label: 'Salary Certificate', icon: <DollarSign className="w-4 h-4" />, desc: 'Salary verification letter' },
      { key: 'noc_letter', label: 'NOC Letter', icon: <FileText className="w-4 h-4" />, desc: 'No Objection Certificate' },
      { key: 'bank_intro_letter', label: 'Bank Introduction', icon: <CreditCard className="w-4 h-4" />, desc: 'Salary account opening letter' },
      { key: 'embassy_letter', label: 'Embassy Support', icon: <FileText className="w-4 h-4" />, desc: 'Visa / travel support letter' },
    ],
  },
  {
    name: 'Payroll & Compensation',
    icon: <Receipt className="w-4 h-4" />,
    items: [
      { key: 'payslip', label: 'Pay Slip', icon: <Receipt className="w-4 h-4" />, desc: 'Monthly salary breakdown' },
      { key: 'salary_increment', label: 'Salary Increment', icon: <TrendingUp className="w-4 h-4" />, desc: 'Compensation adjustment letter' },
      { key: 'bonus_letter', label: 'Bonus / Ex-Gratia', icon: <DollarSign className="w-4 h-4" />, desc: 'Performance bonus letter' },
      { key: 'arrear_payment', label: 'Arrear Payment', icon: <DollarSign className="w-4 h-4" />, desc: 'Retroactive payment notice' },
    ],
  },
  {
    name: 'Disciplinary Actions',
    icon: <ShieldCheck className="w-4 h-4" />,
    items: [
      { key: 'show_cause', label: 'Show Cause Notice', icon: <FileText className="w-4 h-4" />, desc: 'Explain misconduct notice' },
      { key: 'warning_letter', label: 'Warning Letter', icon: <FileText className="w-4 h-4" />, desc: 'Formal written reprimand' },
      { key: 'suspension_letter', label: 'Suspension Letter', icon: <FileText className="w-4 h-4" />, desc: 'Temporary removal notice' },
      { key: 'termination_letter', label: 'Termination Letter', icon: <FileText className="w-4 h-4" />, desc: 'Employment dismissal notice' },
    ],
  },
  {
    name: 'Separation',
    icon: <UserCheck className="w-4 h-4" />,
    items: [
      { key: 'resignation_acceptance', label: 'Resignation Acceptance', icon: <FileText className="w-4 h-4" />, desc: 'Resignation acknowledgment' },
      { key: 'experience', label: 'Experience Letter', icon: <Award className="w-4 h-4" />, desc: 'Work tenure certificate' },
      { key: 'relieving_letter', label: 'Relieving Letter', icon: <FileText className="w-4 h-4" />, desc: 'Official release confirmation' },
      { key: 'clearance_cert', label: 'Clearance Certificate', icon: <FileText className="w-4 h-4" />, desc: 'Asset return verification' },
      { key: 'fnf_settlement', label: 'F&F Settlement', icon: <DollarSign className="w-4 h-4" />, desc: 'Full & final financial closure' },
    ],
  },
  {
    name: 'Performance',
    icon: <Award className="w-4 h-4" />,
    items: [
      { key: 'promotion_letter', label: 'Promotion Letter', icon: <TrendingUp className="w-4 h-4" />, desc: 'Title/rank advancement' },
      { key: 'pip_letter', label: 'PIP Letter', icon: <FileText className="w-4 h-4" />, desc: 'Performance improvement plan' },
      { key: 'appreciation_letter', label: 'Appreciation Letter', icon: <Award className="w-4 h-4" />, desc: 'Formal recognition notice' },
    ],
  },
  {
    name: 'Leave & Attendance',
    icon: <FileText className="w-4 h-4" />,
    items: [
      { key: 'leave_approval', label: 'Leave Approval', icon: <FileText className="w-4 h-4" />, desc: 'Extended leave confirmation' },
      { key: 'lwp_notice', label: 'LWP Notice', icon: <FileText className="w-4 h-4" />, desc: 'Leave Without Pay notice' },
    ],
  },
  {
    name: 'HR Policies',
    icon: <FileText className="w-4 h-4" />,
    items: [
      { key: 'hr_handbook', label: 'HR Handbook', icon: <FileText className="w-4 h-4" />, desc: 'Company HR policies & procedures' },
      { key: 'leave_policy', label: 'Leave Policy', icon: <FileText className="w-4 h-4" />, desc: 'Leave types & application rules' },
    ],
  },
  {
    name: 'Custom Templates',
    icon: <FileText className="w-4 h-4" />,
    items: [
      { key: 'official_pad', label: 'Official Pad', icon: <FileText className="w-4 h-4" />, desc: 'Editable letterhead pad' },
      { key: 'work_order', label: 'Work Order', icon: <ClipboardList className="w-4 h-4" />, desc: 'Work assignment document' },
      { key: 'purchase_order', label: 'Purchase Order', icon: <ShoppingCart className="w-4 h-4" />, desc: 'Procurement order' },
      { key: 'requisition', label: 'Requisition', icon: <ShoppingCart className="w-4 h-4" />, desc: 'Office supplies request' },
      { key: 'personal_info_form', label: 'Personal Info', icon: <User className="w-4 h-4" />, desc: 'Employee personal info statement' },
      { key: 'nda', label: 'NDA', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Non-disclosure agreement' },
    ],
  },
]

export const FLAT_DOC_TYPES: DocItem[] = CATEGORIES.flatMap(c => c.items)

interface SidebarProps {
  expanded: boolean
  onToggle: () => void
  currentView: View
  setView: (view: View) => void
}

function NavButton({
  icon, label, active, expanded: navExpanded, onClick,
}: {
  icon: React.ReactNode
  label?: string
  active: boolean
  expanded: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center h-10 transition-all duration-200 ${
        active
          ? 'text-white bg-brand-red/12 border-l-[3px] border-l-brand-red'
          : 'text-slate-400 hover:text-slate-200 border-l-[3px] border-l-transparent'
      }`}
    >
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        <span className={active ? 'text-brand-red' : ''}>{icon}</span>
      </div>
      {navExpanded && label && (
        <span className="text-xs font-medium truncate whitespace-nowrap">{label}</span>
      )}
    </button>
  )
}

export function Sidebar({ expanded, onToggle, currentView, setView }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CATEGORIES.map(c => [c.name, true]))
  )

  const toggleCategory = (name: string) => {
    setOpenCategories(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return CATEGORIES
    return CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.filter(
        item => item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
      ),
    })).filter(cat => cat.items.length > 0)
  }, [searchQuery])

  const isSearching = searchQuery.trim().length > 0

  return (
    <motion.aside
      animate={{ width: expanded ? 256 : 64 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex-shrink-0 flex flex-col h-full bg-dark-navy text-slate-300 border-r border-slate-800 select-none overflow-hidden"
    >
      {/* Brand & Toggle */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-red">
            <span className="text-white font-extrabold text-base">B</span>
          </div>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="ml-3 min-w-0 overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-xs font-bold text-white leading-tight">Beyond Headlines</h1>
                <p className="text-[10px] text-slate-400 leading-tight">HR Document Gen</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
        >
          {expanded ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 h-full min-h-0 overflow-hidden">
        <div className="py-2 space-y-4">
          {/* Dashboard */}
          <div className="space-y-1">
            <NavButton
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
              active={currentView === 'dashboard'}
              expanded={expanded}
              onClick={() => setView('dashboard')}
            />
          </div>
          {/* HR Section */}
          <div>
            {expanded ? (
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">HR Management</span>
              </div>
            ) : (
              <div className="h-6" />
            )}
            <div className="space-y-1">
              <NavButton
                icon={<UserPlus className="w-4 h-4" />}
                label="Add / Edit Employee"
                active={currentView === 'employees'}
                expanded={expanded}
                onClick={() => setView('employees')}
              />
              <NavButton
                icon={<List className="w-4 h-4" />}
                label="Employee List"
                active={currentView === 'employee_list'}
                expanded={expanded}
                onClick={() => setView('employee_list')}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-white/10" />

          {/* Documents — Categories when expanded, flat icons when collapsed */}
          <div>
            {expanded && (
              <div className="px-4 py-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Documents</span>
              </div>
            )}
            {expanded && (
              <div className="px-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 text-xs bg-white/5 border border-white/10 rounded-md text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand-red/50 focus:ring-0"
                  />
                </div>
              </div>
            )}
            <div className="space-y-1">
              {expanded
                ? (isSearching ? filteredCategories : CATEGORIES).length > 0
                  ? (isSearching ? filteredCategories : CATEGORIES).map(cat => {
                      const isOpen = isSearching || openCategories[cat.name]
                      const activeInCat = cat.items.some(i => currentView === i.key)

                      return (
                        <div key={cat.name}>
                          <button
                            onClick={() => !isSearching && toggleCategory(cat.name)}
                            className={`relative w-full flex items-center h-9 transition-all duration-200 px-4 text-[11px] font-semibold uppercase tracking-wider ${
                              activeInCat ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="flex-shrink-0 mr-4">{cat.icon}</span>
                            <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{cat.name}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-0' : '-rotate-90'
                              }`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                {cat.items.map(item => (
                                  <button
                                    key={item.key}
                                    onClick={() => setView(item.key)}
                                    className={`relative w-full flex items-center h-9 pl-14 pr-4 transition-all duration-200 text-xs ${
                                      currentView === item.key
                                        ? 'text-white bg-brand-red/12 border-l-[3px] border-l-brand-red'
                                        : 'text-slate-400 hover:text-slate-200 border-l-[3px] border-l-transparent'
                                    }`}
                                  >
                                    <span className={`mr-3 flex-shrink-0 ${currentView === item.key ? 'text-brand-red' : ''}`}>
                                      {item.icon}
                                    </span>
                                    <span className="truncate whitespace-nowrap flex-1 text-left">{item.label}</span>
                                    {item.comingSoon && (
                                      <span className="text-[8px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ml-1">Soon</span>
                                    )}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })
                  : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-xs text-slate-500">No documents found</p>
                      </div>
                    )
                : FLAT_DOC_TYPES.map(doc => (
                    <NavButton
                      key={doc.key}
                      icon={doc.icon}
                      active={currentView === doc.key}
                      expanded={false}
                      onClick={() => setView(doc.key)}
                    />
                  ))
              }
            </div>
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-white/10" />

          {/* Settings */}
          <div className="space-y-1">
            <NavButton
              icon={<Code className="w-4 h-4" />}
              label="Template Admin"
              active={currentView === 'template_admin'}
              expanded={expanded}
              onClick={() => setView('template_admin')}
            />
            <NavButton
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
              active={currentView === 'settings'}
              expanded={expanded}
              onClick={() => setView('settings')}
            />
          </div>
        </div>
      </ScrollArea>
    </motion.aside>
  )
}
