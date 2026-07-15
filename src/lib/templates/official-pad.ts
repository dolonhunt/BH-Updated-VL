import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, PAGINATION_SCRIPT } from './shared-css'

export function officialPadHTML(data: Record<string, any>): string {
  const watermarkDisplay = data.watermark !== false ? 'block' : 'none'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Beyond Headlines — Official Letterhead Pad</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    /* Screen-only editing hints */
    @media screen {
      .pg-body:focus {
        outline: none;
      }
      .pg-body:empty::before {
        content: 'Start typing your official letter content here...';
        color: #aaa;
        font-style: italic;
        pointer-events: none;
      }
      .editable-hint {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #111;
        color: #fff;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        z-index: 100;
        box-shadow: 0 4px 15px rgba(0,0,0,.3);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .editable-hint .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4ade80;
        animation: pulse-dot 1.5s ease-in-out infinite;
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    }
    @media print {
      .editable-hint, .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="page page-first">
  <!-- Optional Watermark -->
  <div class="watermark" id="watermark" style="display:${watermarkDisplay}">CONFIDENTIAL</div>

  <!-- Letterhead Header -->
  ${HEADER_HTML({ logo_scale: data.logo_scale, logo_alignment: data.logo_alignment })}

  <!-- Editable Area — blank for letterhead pad -->
  <div class="pg-body" contenteditable="true" spellcheck="true"></div>

  <!-- Letterhead Footer -->
  ${FOOTER_HTML(1, 1, { address: data.company_address })}
</div>

<div class="editable-hint no-print">
  <div class="dot"></div>
  Live Editing Active — Click on the document to type or paste content
</div>

${PAGINATION_SCRIPT}
</body>
</html>`
}
