'use client'

import { useState, useEffect, useRef, RefObject } from 'react'
import { usePreviewData } from '@/lib/preview-store'
import { getSettingsSnapshot } from '@/lib/settings-store'
import { authHeaders } from '@/lib/api-client'
import { toast } from 'sonner'
import { addDocHistory } from '@/lib/doc-history'

const COMPLEX_DOC_TYPES: string[] = []

export function useDocumentPreview(iframeRef?: RefObject<HTMLIFrameElement | null>) {
  const preview = usePreviewData()
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const prevBlobRef = useRef<string>('')

  useEffect(() => {
    if (!preview) {
      setPreviewHtml('')
      setPreviewSrc('')
      return
    }

    const fetchPreview = async () => {
      try {
        const settings = getSettingsSnapshot()
        const signatory = settings.signatories.find(s => s.docTypes.length === 0 || s.docTypes.includes(preview.docType)) || settings.signatories[0]
        const lhConfig = settings.letterheads[preview.docType]
        const data = {
          ...preview.formData,
          _signatory_name: signatory?.name || '',
          _signatory_designation: signatory?.designation || '',
          _letterhead_config: lhConfig ? JSON.stringify(lhConfig) : undefined,
          _global_logo: settings.globalLogo || undefined,
          _global_header_style: settings.globalHeaderStyle,
          _global_footer_style: settings.globalFooterStyle,
        }
        // Clean undefined
        Object.keys(data).forEach(k => data[k] === undefined && delete data[k])

        const res = await fetch('/api/document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({
            type: preview.docType,
            data,
          }),
        })
        if (res.ok) {
          const html = await res.text()
          setPreviewHtml(html)
          const blob = new Blob([html], { type: 'text/html' })
          const url = URL.createObjectURL(blob)
          if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current)
          prevBlobRef.current = url
          setPreviewSrc(url)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch preview:', err)
      }
    }

    fetchPreview()
  }, [preview])

  const recordHistory = (docType: string, formData: any, fileName: string) => {
    addDocHistory({
      id: `${docType}-${Date.now()}`,
      docType,
      employeeName: formData?.name || 'N/A',
      employeeId: formData?.ref_code || '',
      label: docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      timestamp: Date.now(),
      fileName,
    })
  }

  const getLiveHtml = () => {
    if (!iframeRef || !iframeRef.current) return null
    const iframe = iframeRef.current
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return null

    const docElClone = doc.documentElement.cloneNode(true) as HTMLElement
    
    // Clean layout elements
    docElClone.querySelectorAll('.no-print, [data-no-print]').forEach(el => el.remove())
    docElClone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'))
    
    // Reset search highlight tags
    docElClone.querySelectorAll('.editor-find-highlight').forEach(el => {
      el.replaceWith(el.textContent || '')
    })

    // Sanitize CSS for html2canvas compatibility: strip @import rules and unsupported color functions
    docElClone.querySelectorAll('style').forEach(style => {
      style.textContent = style.textContent
        .replace(/@import[^;]+;/g, '')
        .replace(/color:\s*lab\([^;]+\)/gi, '')
        .replace(/background[^:]*:\s*lab\([^;]+\)/gi, '')
        .replace(/lab\([^)]+\)\s*;/g, 'inherit;')
    })

    return '<!DOCTYPE html>\n' + docElClone.outerHTML
  }

  const handleDownloadPDF = async () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!preview || !htmlToUse) {
      toast.error('No document preview generated yet.')
      return
    }
    setPdfLoading(true)
    try {
      const isComplex = COMPLEX_DOC_TYPES.includes(preview.docType)

      if (isComplex) {
        const res = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain', ...authHeaders() },
          body: htmlToUse,
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || errData.details || 'Server PDF failed')
        }
        const blob = await res.blob()
        const docLabel = preview.docType.replace('_', '-')
        const fileName = preview.formData.name
          ? `${docLabel}-${preview.formData.name.replace(/\s+/g, '-')}`
          : `${docLabel}-${new Date().getTime()}`
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('PDF downloaded successfully')
        if (preview) recordHistory(preview.docType, preview.formData, fileName)
      } else {
        const html2pdf = (await import('html2pdf.js')).default
        const container = document.createElement('div')
        container.innerHTML = htmlToUse
        const pageEl = container.querySelector('.page') || container.querySelector('.doc-wrapper') || container
        document.body.appendChild(container)

        const docLabel = preview.docType.replace('_', '-')
        const fileName = preview.formData.name 
          ? `${docLabel}-${preview.formData.name.replace(/\s+/g, '-')}`
          : `${docLabel}-${new Date().getTime()}`

        const opt = {
          margin: 0,
          filename: `${fileName}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as string[] }
        }

        await html2pdf().set(opt).from(pageEl as HTMLElement).save()
        document.body.removeChild(container)
        toast.success('PDF downloaded successfully')
        if (preview) recordHistory(preview.docType, preview.formData, fileName)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('PDF generation failed. Falling back to browser print (Ctrl+P) if needed.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleDownloadDOC = async () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!preview || !htmlToUse) {
      toast.error('No document preview generated yet.')
      return
    }
    setPdfLoading(true)
    try {
      const res = await fetch('/api/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', ...authHeaders() },
        body: htmlToUse,
      })
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'DOCX generation failed')
      }
      
      const blob = await res.blob()
      const docLabel = preview.docType.replace('_', '-')
      const fileName = preview.formData.name 
        ? `${docLabel}-${preview.formData.name.replace(/\s+/g, '-')}`
        : `${docLabel}-${new Date().getTime()}`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('DOCX downloaded successfully')
      if (preview) recordHistory(preview.docType, preview.formData, fileName)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('DOCX generation failed.')
    } finally {
      setPdfLoading(false)
    }
  }

  const handlePrint = () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!htmlToUse) {
      toast.error('No document preview to print.')
      return
    }
    const printWin = window.open('', '_blank')
    if (!printWin) {
      toast.error('Popup blocked. Please allow popups for this site.')
      return
    }
    printWin.document.open()
    printWin.document.write(htmlToUse)
    printWin.document.close()

    const runPrint = () => {
      try {
        printWin.focus()
        printWin.print()
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Auto print failed:', err)
      }
    }

    const waitForContent = () => {
      const imgs = Array.from(printWin.document.images)
      if (imgs.length === 0) {
        runPrint()
        return
      }
      let loaded = 0
      imgs.forEach((img) => {
        if (img.complete) {
          loaded++
        } else {
          img.onload = () => { loaded++; if (loaded === imgs.length) runPrint() }
          img.onerror = () => { loaded++; if (loaded === imgs.length) runPrint() }
        }
      })
      if (loaded === imgs.length) runPrint()
    }

    if (printWin.document.readyState === 'complete') {
      waitForContent()
    } else {
      printWin.onload = waitForContent
    }
  }

  const handleDownloadTXT = () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!preview || !htmlToUse) {
      toast.error('No document preview generated yet.')
      return
    }
    const text = htmlToUse
      .replace(/<style[^>]*>[^<]*<\/style>/gi, '')
      .replace(/<script[^>]*>[^<]*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\s*\n\s*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    const docLabel = preview.docType.replace('_', '-')
    const fileName = preview.formData.name
      ? `${docLabel}-${preview.formData.name.replace(/\s+/g, '-')}`
      : `${docLabel}-${new Date().getTime()}`

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('TXT downloaded successfully')
    if (preview) recordHistory(preview.docType, preview.formData, fileName)
  }

  const handleOpenInNewTab = () => {
    const liveHtml = getLiveHtml()
    const htmlToUse = liveHtml || previewHtml
    if (!htmlToUse) {
      toast.error('No document preview to open.')
      return
    }
    const win = window.open('', '_blank')
    if (win) {
      win.document.open()
      win.document.write(htmlToUse)
      win.document.close()
    }
  }

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (prevBlobRef.current) {
        URL.revokeObjectURL(prevBlobRef.current)
      }
    }
  }, [])

  return {
    preview,
    previewHtml,
    previewSrc,
    pdfLoading,
    handleDownloadPDF,
    handleDownloadDOC,
    handleDownloadTXT,
    handlePrint,
    handleOpenInNewTab,
  }
}
