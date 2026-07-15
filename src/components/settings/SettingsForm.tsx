'use client'
import { useState, useEffect } from 'react'
import { Check, Building2, Users, FileText, Image as ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useCompany, invalidateCompanyCache } from '@/lib/use-company'
import { saveCompany, type CompanyConfig } from '@/lib/storage'
import { useAppSettings } from '@/lib/settings-store'
import { toast } from 'sonner'
import { SignatoryManager } from './SignatoryManager'
import { LetterheadSettings } from './LetterheadSettings'
import { LogoSettings } from './LogoSettings'

const COLOR_PRESETS = [
  '#FF2109', '#E65100', '#2E7D32', '#1565C0',
  '#6A1B9A', '#C62828', '#00695C', '#F57F17',
]

export function SettingsForm() {
  const company = useCompany()
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [tab, setTab] = useState('general')

  const {
    settings,
    addSignatory,
    updateSignatory,
    deleteSignatory,
    setLetterhead,
    removeLetterhead,
    setGlobalLogo,
    setGlobalHeaderStyle,
    setGlobalFooterStyle,
  } = useAppSettings()

  const [form, setForm] = useState<CompanyConfig>({
    name: '',
    address: '',
    phone: '',
    email: '',
    proprietor_name: '',
    proprietor_designation: '',
    brand_color: '#FF2109',
    logo_path: '/Logo-main.png',
  })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted) setForm({ ...company })
  }, [mounted, company])

  const updateField = (field: keyof CompanyConfig, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.name?.trim()) { toast.error('Company name is required'); return }
    if (!form.proprietor_name?.trim()) { toast.error('Proprietor name is required'); return }
    if (!form.proprietor_designation?.trim()) { toast.error('Proprietor designation is required'); return }

    setSaving(true)
    try {
      await saveCompany(form)
      invalidateCompanyCache()
      setShowSaved(true)
      toast.success('General settings saved')
      setTimeout(() => setShowSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Settings</h2>
        {tab === 'general' && (
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="text-white text-xs"
            style={{ backgroundColor: form.brand_color || '#FF2109' }}
          >
            {saving ? 'Saving...' : showSaved ? '✓ Saved' : 'Save Settings'}
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0 gap-0">
          <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-2.5 text-xs gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="signatories" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-2.5 text-xs gap-1.5">
            <Users className="w-3.5 h-3.5" /> Signatories
          </TabsTrigger>
          <TabsTrigger value="letterhead" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-2.5 text-xs gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Letterhead
          </TabsTrigger>
          <TabsTrigger value="logo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-2.5 text-xs gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" /> Logo
          </TabsTrigger>
        </TabsList>

        {/* ─── General Tab ─── */}
        <TabsContent value="general" className="pt-4 space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input id="company_name" value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="Company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_phone">Phone</Label>
                <Input id="company_phone" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="Phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_email">Email</Label>
                <Input id="company_email" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="Email address" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="company_address">Address</Label>
                <Input id="company_address" value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="Company address" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Proprietor Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="proprietor_name">Proprietor Name *</Label>
                <Input id="proprietor_name" value={form.proprietor_name} onChange={e => updateField('proprietor_name', e.target.value)} placeholder="Proprietor name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proprietor_designation">Designation *</Label>
                <Input id="proprietor_designation" value={form.proprietor_designation} onChange={e => updateField('proprietor_designation', e.target.value)} placeholder="e.g. Proprietor" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Brand Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.brand_color} onChange={e => updateField('brand_color', e.target.value)} className="w-10 h-10 rounded border cursor-pointer shrink-0" />
                  <Input value={form.brand_color} onChange={e => updateField('brand_color', e.target.value)} placeholder="#FF2109" className="w-32 font-mono" />
                  <div className="w-10 h-10 rounded border shrink-0" style={{ backgroundColor: form.brand_color }} title={form.brand_color} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map(color => (
                    <button key={color} type="button" onClick={() => updateField('brand_color', color)}
                      className="w-9 h-9 rounded-md border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: color, borderColor: form.brand_color === color ? '#000' : 'transparent' }} title={color}>
                      {form.brand_color === color && <Check className="w-4 h-4 mx-auto text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Signatories Tab ─── */}
        <TabsContent value="signatories" className="pt-4">
          <SignatoryManager
            signatories={settings.signatories}
            onAdd={addSignatory}
            onUpdate={updateSignatory}
            onDelete={deleteSignatory}
          />
        </TabsContent>

        {/* ─── Letterhead Tab ─── */}
        <TabsContent value="letterhead" className="pt-4">
          <LetterheadSettings
            letterheads={settings.letterheads}
            globalHeaderStyle={settings.globalHeaderStyle}
            globalFooterStyle={settings.globalFooterStyle}
            onSetLetterhead={setLetterhead}
            onRemoveLetterhead={removeLetterhead}
            onSetGlobalHeaderStyle={setGlobalHeaderStyle}
            onSetGlobalFooterStyle={setGlobalFooterStyle}
          />
        </TabsContent>

        {/* ─── Logo Tab ─── */}
        <TabsContent value="logo" className="pt-4">
          <LogoSettings
            currentLogo={settings.globalLogo}
            brandColor={form.brand_color}
            onSetLogo={setGlobalLogo}
            onResetLogo={() => setGlobalLogo('')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
