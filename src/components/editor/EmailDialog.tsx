'use client'
import { useState } from 'react'
import { Mail, Send, Copy, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface EmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  docType: string
  employeeName?: string
  downloadUrl?: string
}

export function EmailDialog({ open, onOpenChange, docType, employeeName, downloadUrl }: EmailDialogProps) {
  const [to, setTo] = useState('')
  const dt = docType || ''
  const [subject, setSubject] = useState(`[BH HR] ${dt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}${employeeName ? ` - ${employeeName}` : ''}`)
  const [body, setBody] = useState(`Dear ${employeeName || 'Recipient'},\n\nPlease find attached your ${dt.replace(/_/g, ' ')} document.\n\n${downloadUrl ? `You can also download it here: ${downloadUrl}` : ''}\n\nRegards,\nBH HR`)
  const [copied, setCopied] = useState(false)

  const handleSend = () => {
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailto, '_blank')
    onOpenChange(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Send via Email
          </DialogTitle>
          <DialogDescription>
            Opens your default email app with a pre-filled message.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Recipient</Label>
            <Input
              placeholder="employee@company.com"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Subject</Label>
            <Input value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Message</Label>
            <Textarea
              rows={5}
              value={body}
              onChange={e => setBody(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" onClick={handleSend} disabled={!to.trim()}>
            <Send className="w-3.5 h-3.5 mr-1.5" /> Open in Email Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
