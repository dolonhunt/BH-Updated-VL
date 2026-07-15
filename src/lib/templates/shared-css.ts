/* Approved letterhead assets — base64 embedded for offline/PDF reliability */
import { LOGO_BASE64, FOOTER_PIN_BASE64 } from '@/lib/generated/assets'

// Fallback to remote URLs if base64 is unavailable (e.g., during development)
const LOGO_URL  = LOGO_BASE64 || 'https://i.postimg.cc/WzcZTHwj/Logo-nobg.png'
const PIN_URL   = FOOTER_PIN_BASE64 || 'https://i.postimg.cc/3NjvRFtr/Location-Pin.png'

export const SHARED_DOC_CSS = `
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Oswald:wght@700&display=swap'); — disabled: html2canvas chokes on lab() color in Google Fonts CSS. Fonts loaded by the app shell anyway. */

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-color:   #ece8e2;
  --text-color: #000000;
  --ui-border:  #DDD5C8;
  --page-w:     210mm;
  --page-h:     297mm;
  --header-h:   28mm;
  --footer-h:   30mm;
}

html, body {
  background: var(--bg-color);
  font-family: 'Cambria', 'Times New Roman', serif;
  font-size: 11px;
  color: var(--text-color);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ════════ A4 LETTERHEAD PAGE ════════ */
.page {
  width: var(--page-w);
  min-height: var(--page-h);
  background: #ffffff;
  margin: 40px auto;
  display: grid;
  grid-template-rows: auto 1fr auto;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0 8px 28px rgba(0,0,0,.14), 0 2px 5px rgba(0,0,0,.08);
  page-break-after: always;
  break-after: page;
  overflow: hidden;
}
.pg-body {
  min-height: inherit;
  overflow: hidden;
  position: relative;
  max-height: calc(var(--page-h) - var(--header-h) - var(--footer-h));
}
.pg-body.overflow-warning {
  background: linear-gradient(to bottom, transparent 95%, rgba(255,165,0,.08) 95%, rgba(255,165,0,.2) 100%);
}
.page:last-child {
  page-break-after: auto;
  break-after: auto;
}

/* First page breathing space removed — print always uses fixed header, screen uses top padding only when not manual-pages */
.page.page-first .pg-body {
  padding-top: 0;
}

/* Watermark */
.watermark {
  position: absolute; top:50%; left:50%;
  transform: translate(-50%,-50%) rotate(-42deg);
  font-size: 82px; color: rgba(0, 0, 0, 0.03); font-weight: 900;
  letter-spacing: 18px; text-transform: uppercase;
  pointer-events: none; z-index: 0; white-space: nowrap;
  font-family: 'Oswald', sans-serif;
  user-select: none;
}

/* ════════ HEADER ════════ */
.pg-header {
  position: relative; z-index: 1; flex-shrink: 0;
  width: 100%; padding-top: 11px;
  display: flex; flex-direction: column; align-items: center;
}
.pg-logo {
  display: block; height: 80px; width: auto; object-fit: contain;
}
.pg-rule-thick {
  display: block; width: 100%; height: 3px; background: #000000; border: none; margin-top: 10px;
}

/* ════════ BODY (content area) ════════ */
.pg-body {
  position: relative; z-index: 1;
  padding: 12mm 12.5mm;
  min-height: 0;
  font-family: 'Cambria', 'Times New Roman', serif;
  font-size: 11pt; color: #000000;
  line-height: 1.45;
  word-break: break-word;
  outline: none;
}

/* ════════ FOOTER ════════ */
.pg-foot-wrap {
  position: relative; z-index: 1; flex-shrink: 0;
  align-self: end;
}
.pg-num {
  text-align: center; font-size: 9px; color: #808080;
  padding: 4px 0 2px;
  font-family: 'Cambria', 'Times New Roman', serif;
}
.pg-rule-thin {
  display: block; width: 100%; height: 1px; background: #000000; border: none; margin-top: 0; margin-bottom: 7px;
}
.pg-footer {
  background: transparent; width: 100%;
  padding: 0 0 3.5mm;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
}
.pg-pin {
  display: block; width: 30px; height: 30px; margin-bottom: -4px; object-fit: contain;
}
.pg-foot-label {
  font-size: 11px; font-weight: 700; color: #000000;
  font-family: 'Poppins', sans-serif;
}
.pg-foot-addr {
  font-size: 11px; font-weight: 400; color: #000000;
  font-family: 'Poppins', sans-serif; line-height: 1.45;
}

/* ════════ PAGINATION SAFETY — avoid orphans / widows ════════ */
.cat-heading, .cat-note, .mp-title, .sum-title,
.wo-service-title, .wo-terms-title, .wo-completion-title,
.req-title, .cert-title, .annual-heading {
  break-after: avoid;
  page-break-after: avoid;
}
.sig-section, .wo-sig-section, .sig-area, .sign-area {
  break-inside: avoid;
  page-break-inside: avoid;
}
.req-table, .mp-table, .sum-table, .wo-service-table,
.salary-table, .breakdown-table, .emp-table {
  break-inside: avoid;
  page-break-inside: avoid;
}

/* ════════ DEFAULT TYPOGRAPHY CLASSES ════════ */
.meta-right { text-align: right; font-weight: bold; font-style: italic; margin-bottom: 12px; }
.ref-block { margin-bottom: 20px; }
.ref-line { font-size: 10.5pt; font-style: italic; color: #333333; margin-bottom: 2px; }
.date-line { font-weight: bold; }
.addr-block { margin-bottom: 20px; line-height: 1.5; }
.addr-block strong { font-weight: 700; }
.subject-line { font-weight: bold; margin-bottom: 20px; text-decoration: none; }
.salutation { font-weight: bold; margin-bottom: 15px; }
.body-paragraph { margin-bottom: 15px; text-align: justify; }
.closing { margin: 25px 0; }
.sign-area { margin-top: 30px; }
.sign-line { border-top: 1.5px solid #000000; width: 220px; padding-top: 6px; margin-top: 50px; }
.sign-name { font-weight: bold; }

/* ════════ DOCUMENT BODY STYLES ════════ */
.body {
  position: relative; z-index: 1;
  padding: 12mm 12.5mm;
  min-height: 0;
  font-family: 'Cambria', 'Times New Roman', serif;
  font-size: 11pt; color: #000000;
  line-height: 1.35;
  outline: none;
}

/* Shared document content styles */
.cert-title {
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 0.05em;
}
.ref-date {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 11px;
}
.cert-body {
  font-size: 11px;
  line-height: 1.85;
  text-align: justify;
  margin-bottom: 18px;
}
.cert-body .emp-name {
  font-weight: 700;
}
.detail-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 11px;
  line-height: 1.7;
}
.detail-row .label {
  width: 130px;
  font-weight: 700;
  flex-shrink: 0;
}
.detail-row .value {
  flex: 1;
}
.clearance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.5px;
  margin: 14px 0;
}
.clearance-row {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  border-bottom: 1px solid #ddd;
}
.clearance-header {
  background: #f5f5f5;
  font-weight: 700;
}
.clearance-dept, .clearance-status, .clearance-remarks {
  padding: 6px 8px;
  border-right: 1px solid #ddd;
}
.clearance-row > :last-child { border-right: none; }
.salary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10.5px;
  margin: 16px 0;
}
.salary-table thead tr {
  background: #333;
  color: #fff;
}
.salary-table thead th {
  padding: 6px 10px;
  text-align: left;
  font-weight: 700;
  border: 1px solid #222;
}
.salary-table thead th.right {
  text-align: right;
}
.salary-table tbody td {
  padding: 5px 10px;
  border: 1px solid #ddd;
  vertical-align: middle;
}
.salary-table tbody tr:nth-child(even) {
  background: #f5f5f5;
}
.salary-table td.right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.salary-table td.bold {
  font-weight: 700;
}
.salary-table .total-row {
  background: #e8e8e8;
}
.salary-table .total-row td {
  font-weight: 700;
  border-top: 2px solid #333;
}
.salary-table .net-row {
  background: #333;
  color: #fff;
}
.salary-table .net-row td {
  font-weight: 700;
  border-color: #222;
}
.annual-heading {
  font-size: 11px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 10px;
}
.annual-row {
  display: flex;
  margin-bottom: 5px;
  font-size: 11px;
  line-height: 1.7;
}
.annual-row .label {
  width: 260px;
  flex-shrink: 0;
}
.annual-row .colon {
  width: 20px;
  flex-shrink: 0;
}
.annual-row .value {
  flex: 1;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.annual-row.total-annual .label,
.annual-row.total-annual .value {
  font-weight: 700;
}
.annual-divider {
  border: none;
  border-top: 1px solid #999;
  margin: 8px 0;
}
.declaration {
  font-size: 11px;
  line-height: 1.75;
  text-align: justify;
  margin-top: 18px;
  margin-bottom: 20px;
}
.sig-section {
  margin-top: 30px;
}
.sig-block .sig-name {
  font-size: 11px;
  font-weight: 700;
  border-top: 1.5px solid #333;
  padding-top: 6px;
  display: inline-block;
}
.sig-block .sig-title {
  font-size: 10px;
  color: #000;
  line-height: 1.6;
}

/* Date / To-block / Subject styles for appointment */
.date {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 18px;
  text-align: right;
}
.to-block {
  margin-bottom: 16px;
  line-height: 1.7;
  font-size: 11px;
}
.to-block strong {
  font-weight: 700;
}
.subject {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 16px;
}
.salutation-doc {
  font-size: 11px;
  margin-bottom: 12px;
}
.body-text {
  font-size: 11px;
  line-height: 1.75;
  text-align: justify;
  margin-bottom: 14px;
}
.expect-list {
  font-size: 11px;
  line-height: 1.75;
  margin-bottom: 14px;
  padding-left: 20px;
}
.expect-list li {
  margin-bottom: 6px;
  list-style-type: disc;
}
.salary-text {
  font-size: 11px;
  line-height: 1.75;
  text-align: justify;
  margin-bottom: 14px;
}
.net-salary-note {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 16px;
}
.closing-text {
  font-size: 11px;
  line-height: 1.75;
  text-align: justify;
  margin-bottom: 20px;
}
.sig-block .sig-heading {
  font-size: 11px;
  font-weight: 700;
  color: #000;
  margin-bottom: 70px;
}
.sig-block .sig-date {
  font-size: 10px;
  color: #000;
  margin-top: 8px;
}

/* ════════ PRINT STYLES ════════ */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  html, body {
    background: #ffffff !important;
    width: var(--page-w);
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  /* ──── UNIFIED: Header/footer always fixed in print ──── */
  .pg-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #fff;
  }

  .pg-foot-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #fff;
  }

  .pg-body {
    padding-top: var(--header-h);
    padding-bottom: var(--footer-h);
  }

  /* Watermark on every printed page */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) rotate(-42deg);
  }

  /* Suppress CSS page counter — use script-generated page numbers */
  .pg-num {
    font-size: 0;
  }
  .pg-num::after {
    content: none;
  }

  /* ──── AUTO-PAGINATION MODE ──── */
  body:not(.manual-pages) .page {
    display: block;
    min-height: auto;
    overflow: visible;
    margin: 0;
    box-shadow: none;
    page-break-after: auto;
    break-after: auto;
  }

  body:not(.manual-pages) .pg-body {
    overflow: visible;
  }

  body:not(.manual-pages) .pg-body.overflow-warning {
    background: none;
  }

  /* ──── MANUAL-PAGES MODE ──── */
  body.manual-pages .page {
    margin: 0;
    box-shadow: none;
    page-break-after: always;
    break-after: page;
    min-height: var(--page-h);
    overflow: visible;
  }
  body.manual-pages .page:last-child {
    page-break-after: auto;
    break-after: auto;
  }

  /* Remove overflow warning in print — it's a screen-only visual aid */
  body.manual-pages .pg-body.overflow-warning {
    background: none;
  }
}

/* ════════ SCREEN-ONLY ════════ */
@media screen {
  .pg-body:focus { outline: none; }
}
`

/**
 * Inline JavaScript for auto-pagination on screen.
 *
 * Key features:
 * 1. Orphan prevention — headings stay with their following content
 * 2. Keep-together — signature sections never split across pages
 * 3. First-page breathing space — extra top padding on page 1
 * 4. Page numbers — centered above the footer underline
 * 5. Adds `manual-pages` class to body so print CSS works with split pages
 */
export const PAGINATION_SCRIPT = `
<script>
(function(){
  /* ──── Heading elements that must not be orphaned at page bottom ──── */
  /* Also includes .sum-wrap so that summary + signature stay together */
  var HEADING_SEL = '.cat-heading,.cat-note,.mp-title,.sum-title,.sum-wrap,'
    + '.wo-service-title,.wo-terms-title,.wo-completion-title,'
    + '.req-title,.cert-title,.annual-heading,.payslip-title,.payslip-subtitle';

  /* ──── Keep-together elements that must never be split ──── */
  var KEEP_TOGETHER_SEL = '.sig-section,.wo-sig-section,.sig-area,.sign-area';

  function isHeading(el){
    if(!el || !el.matches) return false;
    return el.matches(HEADING_SEL);
  }
  function isKeepTogether(el){
    if(!el || !el.matches) return false;
    return el.matches(KEEP_TOGETHER_SEL);
  }

  function measureH(el){
    var cs = getComputedStyle(el);
    return el.offsetHeight
      + (parseFloat(cs.marginTop) || 0)
      + (parseFloat(cs.marginBottom) || 0);
  }

  function autoPaginate(){
    var pages = document.querySelectorAll('.page');
    if(pages.length !== 1) return;

    var page = pages[0];
    var bodyEl = page.querySelector('.pg-body');
    if(!bodyEl) return;

    var headerEl = page.querySelector('.pg-header');
    var footerEl = page.querySelector('.pg-foot-wrap');
    if(!headerEl || !footerEl) return;

    /* A4 height in px at 96dpi */
    var PAGE_H = Math.round(297 * 3.7795275591);
    var headerH = headerEl.offsetHeight;
    var footerH = footerEl.offsetHeight;
    var bodyStyle = getComputedStyle(bodyEl);
    var padTop = parseFloat(bodyStyle.paddingTop) || 0;
    var padBot = parseFloat(bodyStyle.paddingBottom) || 0;
    var availableH = PAGE_H - headerH - footerH;

    /* Check if content fits on a single page */
    if(bodyEl.scrollHeight <= availableH + 2) return;

    /* Collect child elements */
    var children = [];
    for(var i = 0; i < bodyEl.children.length; i++){
      children.push(bodyEl.children[i]);
    }
    if(children.length === 0) return;

    /* ──── Build content groups ──── */
    /* A "group" is one or more children that must stay together on the same page.
       - Heading + its next non-heading sibling → 1 group
       - Keep-together element → 1 group
       - Everything else → 1 group per element */
    var groups = [];
    var idx = 0;
    while(idx < children.length){
      var child = children[idx];

      if(isHeading(child) && idx + 1 < children.length && !isHeading(children[idx + 1])){
        /* Group heading with its next content element (e.g. heading + table) */
        groups.push({ els: [child, children[idx + 1]], keepTogether: false });
        idx += 2;
      } else {
        /* Single element group — keep-together elements are marked */
        groups.push({ els: [child], keepTogether: isKeepTogether(child) });
        idx += 1;
      }
    }

    /* ──── Measure group heights ──── */
    for(var g = 0; g < groups.length; g++){
      var h = 0;
      for(var m = 0; m < groups[g].els.length; m++){
        h += measureH(groups[g].els[m]);
      }
      groups[g].height = h;
    }

    /* ──── Distribute groups into pages ──── */
    var pageGroups = [];   /* array of arrays of elements */
    var currentEls = [];
    var currentH = padTop + padBot; /* CSS .page-first already sets the breathing space padding */
    var isFirstPage = true;

    for(var g = 0; g < groups.length; g++){
      var grp = groups[g];
      var fitsOnCurrent = (currentH + grp.height <= availableH);
      var currentHasContent = currentEls.length > 0;

      if(!fitsOnCurrent && currentHasContent){
        /* Push current page and start new */
        pageGroups.push({ els: currentEls, isFirst: isFirstPage });
        currentEls = [];
        currentH = padTop + padBot;
        isFirstPage = false;
      }

      /* Add group elements */
      for(var m = 0; m < grp.els.length; m++){
        currentEls.push(grp.els[m]);
      }
      currentH += grp.height;
    }
    if(currentEls.length > 0){
      pageGroups.push({ els: currentEls, isFirst: isFirstPage });
    }

    if(pageGroups.length <= 1) return; /* fits on one page after all */

    /* ──── Rebuild DOM with split pages ──── */
    var headerHTML = headerEl.outerHTML;
    var pinImg = footerEl.querySelector('.pg-pin');
    var pinSrc = pinImg ? pinImg.getAttribute('src') : '';
    var footLabel = footerEl.querySelector('.pg-foot-label');
    var footAddr = footerEl.querySelector('.pg-foot-addr');
    var footLabelHTML = footLabel ? footLabel.outerHTML : '';
    var footAddrHTML = footAddr ? footAddr.outerHTML : '';

    function makeFooter(pageNum, totalPages){
      return '<div class="pg-foot-wrap">'
        + '<div class="pg-num">Page ' + pageNum + ' of ' + totalPages + '</div>'
        + '<hr class="pg-rule-thin"/>'
        + '<div class="pg-footer">'
        + (pinSrc ? '<img class="pg-pin" src="' + pinSrc + '" alt="pin"/>' : '')
        + footLabelHTML
        + footAddrHTML
        + '</div></div>';
    }

    /* Get watermark if exists */
    var watermark = page.querySelector('.watermark');
    var watermarkHTML = watermark ? watermark.outerHTML : '';

    /* Remove original page */
    var parent = page.parentNode;
    page.parentNode.removeChild(page);

    /* Create new pages */
    var totalPages = pageGroups.length;
    for(var p = 0; p < pageGroups.length; p++){
      var pgData = pageGroups[p];
      var div = document.createElement('div');
      div.className = 'page' + (pgData.isFirst ? ' page-first' : '');

      var innerHTML = '';
      if(watermark) innerHTML += watermark.outerHTML;
      innerHTML += headerHTML;
      innerHTML += '<div class="pg-body" contenteditable="true" spellcheck="true"></div>';
      innerHTML += makeFooter(p + 1, totalPages);

      div.innerHTML = innerHTML;
      var newBody = div.querySelector('.pg-body');

      for(var n = 0; n < pgData.els.length; n++){
        newBody.appendChild(pgData.els[n]);
      }

      parent.appendChild(div);
    }

    /* Check for overflow and add warning class */
    pages = document.querySelectorAll('.page');
    for(var p = 0; p < pages.length; p++){
      var pgBody = pages[p].querySelector('.pg-body');
      if(pgBody){
        /* Flag visually if content seems close to or exceeds bounds */
        var bodyH = pgBody.scrollHeight;
        var maxH = parseFloat(getComputedStyle(pgBody).maxHeight) || Infinity;
        if(bodyH > maxH){
          pgBody.classList.add('overflow-warning');
        }
      }
    }

    /* Note: manual-pages class NOT added — print CSS handles both modes uniformly */
  }

  /* Run after images and fonts are ready */
  function schedule(){
    if(document.readyState === 'complete'){
      setTimeout(autoPaginate, 500);
    } else {
      window.addEventListener('load', function(){ setTimeout(autoPaginate, 500); });
    }
  }
  schedule();

  /* Re-paginate when content changes (debounced) */
  var _paginateTimer = null;
  function debouncedPaginate(){
    if(_paginateTimer) clearTimeout(_paginateTimer);
    _paginateTimer = setTimeout(function(){
      /* Reset: merge all pages back into one, then re-paginate */
      var allPages = document.querySelectorAll('.page');
      if(allPages.length <= 1) { autoPaginate(); return; }

      /* Collect all body children from all pages */
      var allChildren = [];
      for(var p = 0; p < allPages.length; p++){
        var b = allPages[p].querySelector('.pg-body');
        if(b){
          for(var c = 0; c < b.children.length; c++){
            allChildren.push(b.children[c]);
          }
        }
      }

      /* Rebuild single page */
      var firstPage = allPages[0];
      var headerEl = firstPage.querySelector('.pg-header');
      var headerHTML = headerEl ? headerEl.outerHTML : '';
      var watermark = firstPage.querySelector('.watermark');
      var watermarkHTML = watermark ? watermark.outerHTML : '';

      /* Get footer info from first page */
      var footerEl = firstPage.querySelector('.pg-foot-wrap');
      var pinImg = footerEl ? footerEl.querySelector('.pg-pin') : null;
      var pinSrc = pinImg ? pinImg.getAttribute('src') : '';
      var footLabel = footerEl ? footerEl.querySelector('.pg-foot-label') : null;
      var footAddr = footerEl ? footerEl.querySelector('.pg-foot-addr') : null;
      var footLabelHTML = footLabel ? footLabel.outerHTML : '';
      var footAddrHTML = footAddr ? footAddr.outerHTML : '';

      /* Remove all pages */
      var parentNode = firstPage.parentNode;
      for(var p = allPages.length - 1; p >= 0; p--){
        allPages[p].parentNode.removeChild(allPages[p]);
      }

      /* Create single page */
      var div = document.createElement('div');
      div.className = 'page page-first';
      div.innerHTML = watermarkHTML
        + headerHTML
        + '<div class="pg-body" contenteditable="true" spellcheck="true"></div>'
        + '<div class="pg-foot-wrap">'
        + '<div class="pg-num">Page 1 of 1</div>'
        + '<hr class="pg-rule-thin"/>'
        + '<div class="pg-footer">'
        + (pinSrc ? '<img class="pg-pin" src="' + pinSrc + '" alt="pin"/>' : '')
        + footLabelHTML + footAddrHTML
        + '</div></div>';

      var newBody = div.querySelector('.pg-body');
      for(var c = 0; c < allChildren.length; c++){
        newBody.appendChild(allChildren[c]);
      }
      parentNode.appendChild(div);

      /* Re-run pagination */
      setTimeout(autoPaginate, 100);
    }, 800);
  }

  /* Watch for content changes in the editable area when focus is lost (blur) */
  document.addEventListener('focusout', function(e){
    if(e.target && e.target.classList && e.target.classList.contains('pg-body')){
      debouncedPaginate();
    }
  });
})();
</script>
`

export function HEADER_HTML(options: { 
  logo_scale?: number; 
  logo_alignment?: 'left' | 'center' | 'right';
  logoUrl?: string;
  pinUrl?: string;
} = {}): string {
  const scale = options.logo_scale !== undefined ? Number(options.logo_scale) : 1.0
  const alignment = options.logo_alignment || 'center'
  const alignSelf = alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center'
  const heightPx = 80 * scale
  const logoUrl = options.logoUrl || LOGO_URL
  const pinUrl = options.pinUrl || PIN_URL

  return `
  <div class="pg-header" style="align-items: ${alignSelf};">
    <img class="pg-logo" src="${logoUrl}" alt="logo" style="height: ${heightPx}px; align-self: ${alignSelf};"/>
    <hr class="pg-rule-thick"/>
  </div>
  `
}

export function FOOTER_HTML(pageNum?: number, totalPages?: number, options: { pinUrl?: string; address?: string } = {}): string {
  const pageDisplay = (pageNum && totalPages) ? `Page ${pageNum} of ${totalPages}` : ''
  const pinUrl = options.pinUrl || PIN_URL
  const address = options.address || 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212, Bangladesh.'

  return `
  <div class="pg-foot-wrap">
    <div class="pg-num">${pageDisplay}</div>
    <hr class="pg-rule-thin"/>
    <div class="pg-footer">
      <img class="pg-pin" src="${pinUrl}" alt="pin"/>
      <span class="pg-foot-label">OFFICE ADDRESS:</span>
      <span class="pg-foot-addr">${address}</span>
    </div>
  </div>
  `
}
