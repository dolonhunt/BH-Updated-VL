'use client'

import { useRef, useState } from 'react'
import { Upload, RotateCcw, ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface LogoSettingsProps {
  currentLogo: string
  brandColor: string
  onSetLogo: (base64: string) => void
  onResetLogo: () => void
}

export function LogoSettings({ currentLogo, brandColor, onSetLogo, onResetLogo }: LogoSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!preview) {
      toast.error('Select an image first')
      return
    }
    onSetLogo(preview)
    setPreview('')
    toast.success('Logo updated successfully')
  }

  const handleReset = () => {
    onResetLogo()
    setPreview('')
    toast.success('Logo reset to default')
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Upload your company logo. It will be used across all document letterheads. Supported formats: PNG, JPG, WEBP.</p>

      {/* Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Upload Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFile}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP or SVG</p>
          </div>

          {preview && (
            <div className="flex items-center gap-4 pt-2">
              <div className="w-24 h-24 border rounded flex items-center justify-center bg-white p-1.5">
                <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="w-24 h-24 border rounded flex items-center justify-center p-1.5" style={{ backgroundColor: brandColor }}>
                <img src={preview} alt="Preview on brand" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Normal</p>
                <p>On brand color</p>
              </div>
            </div>
          )}

          {preview && (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSave}>
                <ImageIcon className="w-3.5 h-3.5 mr-1" /> Apply Logo
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setPreview('')}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Logo Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Current Logo</CardTitle>
        </CardHeader>
        <CardContent>
          {currentLogo ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border rounded flex items-center justify-center bg-white p-2">
                  <img src={currentLogo} alt="Current logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="w-32 h-32 border rounded flex items-center justify-center p-2" style={{ backgroundColor: brandColor }}>
                  <img src={currentLogo} alt="Current logo on brand" className="max-w-full max-h-full object-contain" />
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={handleReset} className="text-red-500 border-red-200 hover:bg-red-50">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset to Default
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Using default logo</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
