'use client'

import { useDocumentForm } from '@/hooks/useDocumentForm'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

interface OfficialPadFormData {
  watermark: boolean
  logo_scale: number
  logo_alignment: 'left' | 'center' | 'right'
}

const initialData: OfficialPadFormData = {
  watermark: true,
  logo_scale: 1.0,
  logo_alignment: 'center',
}

export function OfficialPadForm() {
  const {
    formData,
    setField,
    handleGenerate,
  } = useDocumentForm({
    docType: 'official_pad',
    initialData,
    mapEmployeeToForm: () => ({}),
    onCalculate: (data) => data,
  })

  return (
    <div className="space-y-4">
      {/* Letterhead Options */}
      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 space-y-4">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Letterhead Options
        </h3>

        {/* Watermark Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-gray-500">Watermark</Label>
          <button
            type="button"
            onClick={() => setField('watermark', !formData.watermark)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              formData.watermark ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                formData.watermark ? 'translate-x-4.5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <Separator />

        {/* Logo Alignment */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-500">Logo Alignment</Label>
          <Select
            value={formData.logo_alignment}
            onValueChange={(val) => setField('logo_alignment', val)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Logo Scale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-gray-500">Logo Scale</Label>
            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border">
              {Number(formData.logo_scale || 1.0).toFixed(1)}x
            </span>
          </div>
          <div className="py-2">
            <Slider
              value={[formData.logo_scale]}
              onValueChange={([val]) => setField('logo_scale', val)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="py-1 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Editor Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
        <h4 className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
          <span>💡</span> Editable Canvas
        </h4>
        <p className="text-xs text-amber-700 leading-relaxed">
          Click directly inside the document preview to type, edit, or paste your letter contents. The header and footer regions are protected and will remain intact.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-1.5">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Quick Guide</p>
        <p className="text-xs text-gray-600">• Click the white editor area to start typing</p>
        <p className="text-xs text-gray-600">• Formatting toolbar is available above</p>
        <p className="text-xs text-gray-600">• Use PDF/DOC buttons to export the result</p>
      </div>

      <Button
        type="button"
        onClick={handleGenerate}
        className="w-full text-white font-semibold h-9 bg-brand-red hover:bg-brand-red/90"
      >
        Update Document Preview
      </Button>
    </div>
  )
}
