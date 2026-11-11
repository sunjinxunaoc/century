// gen-catalog.mjs
// Builds the sales PDF catalogue from src/data/products.js, compresses product
// images with sharp, and renders with headless Chrome (via puppeteer-core).
//
// Table pagination is MEASUREMENT based: the HTML is rendered once in the
// browser, the real pixel height of every header / card grid / spec row is
// measured, and the rows are then sliced so nothing is ever clipped.
//
// Output            -> public/downloads/century-auto-parts-catalog-2026.pdf
// Preview (optional) -> .esbtmp/catalog/preview/p-*.png  (pass --preview)
//
// Usage:
//   npm run gen-catalog
//   npm run gen-catalog -- --preview

import { promises as fs } from 'node:fs'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { categories } from '../../src/data/products.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const APP_ROOT = resolve(__dirname, '../..')
const PUBLIC_DIR = join(APP_ROOT, 'public')
const OUT_PDF = join(PUBLIC_DIR, 'downloads', 'century-auto-parts-catalog-2026-v2.pdf')
const TMP_DIR = join(APP_ROOT, '.esbtmp', 'catalog')
const PREVIEW = process.argv.includes('--preview')

const IMG_MAX = 540
const JPEG_Q = 75
const MAX_CARDS = 6

// A4 usable content height in CSS px (297mm - 15mm top - 18mm bottom)
const PAGE_CONTENT_H = (297 - 15 - 18) * (96 / 25.4) // ≈ 997.8px
const GAP = { phMb: 9, cardMb: 9, titleMt: 12, tableMt: 6 }

// --- Image pipeline ---------------------------------------------------------
const origCache = new Map()
const builtCache = new Map()

async function resolveOriginal(urlPath) {
  if (!urlPath) return null
  if (origCache.has(urlPath)) return origCache.get(urlPath)
  const rel = urlPath.replace(/^\/+/, '').replace(/\/+/g, '/')
  let disk = join(PUBLIC_DIR, rel)
  if (!existsSync(disk)) disk = await searchInsensitive(rel)
  origCache.set(urlPath, disk)
  return disk
}

async function searchInsensitive(rel) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const target = norm(rel)
  const files = await walkImages(join(PUBLIC_DIR, 'images'))
  const hit = files.find((r) => norm(r) === target)
  return hit ? join(PUBLIC_DIR, 'images', hit) : null
}

async function walkImages(dir) {
  const out = []
  let entries
  try { entries = await fs.readdir(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walkImages(p)))
    else if (/\.(webp|png|jpg|jpeg)$/i.test(e.name)) out.push(p.slice(join(PUBLIC_DIR, 'images').length + 1).replace(/\\/g, '/'))
  }
  return out
}

async function compressedImage(urlPath) {
  if (!urlPath) return ''
  if (builtCache.has(urlPath)) return builtCache.get(urlPath)
  const orig = await resolveOriginal(urlPath)
  if (!orig) { builtCache.set(urlPath, ''); return '' }
  const key = 'img' + Math.abs([...urlPath].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7))
  const outPath = join(TMP_DIR, `${key}.jpg`)
  try {
    if (!existsSync(outPath)) {
      await sharp(orig)
        .rotate()
        .resize({ width: IMG_MAX, height: IMG_MAX, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: JPEG_Q, mozjpeg: true })
        .toFile(outPath)
    }
    const url = 'file:///' + outPath.replace(/\\/g, '/')
    builtCache.set(urlPath, url)
    return url
  } catch {
    builtCache.set(urlPath, '')
    return ''
  }
}

// --- Helpers ----------------------------------------------------------------
const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const countCat = (cat) => (cat.subcategories || []).reduce((a, s) => a + (s.products || []).length, 0)
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '')

// Merge every product's spec rows in a subcategory into one deduped list.
function rangeRows(sub, maxCols = 5) {
  const prods = (sub.products || []).filter((p) => p.spec && Array.isArray(p.spec.rows) && p.spec.rows.length)
  if (!prods.length) return null
  const headers = prods[0].spec.headers.slice(0, maxCols)
  const seen = new Set()
  const rows = []
  for (const p of prods) {
    for (const r of p.spec.rows) {
      const cells = headers.map((_, i) => (r[i] != null ? String(r[i]) : ''))
      const key = cells.join('\u0001')
      if (seen.has(key)) continue
      seen.add(key)
      rows.push(cells)
    }
  }
  return { headers, rows }
}

// Pick the spec row belonging to this product (series specs share one table).
function pickSpecRow(p) {
  const spec = p.spec && p.spec.rows && p.spec.rows.length ? p.spec : null
  if (!spec) return null
  if (spec.rows.length === 1) return spec.rows[0]
  const slug = slugify(p.slug || '')
  const name = slugify(p.name || '')
  const hit = spec.rows.find((r) => {
    const key = slugify(r[0] || '')
    return key && (slug.includes(key) || name.includes(key))
  })
  return hit || null
}

// --- HTML fragments ---------------------------------------------------------
function pageHeader(title, sub) {
  return `
  <div class="ph">
    <div class="ph-left">
      <div class="ph-title">${esc(title)}</div>
      ${sub ? `<div class="ph-sub">${esc(sub)}</div>` : ''}
    </div>
    <div class="ph-brand">CENTURY</div>
  </div>`
}

function cardHtml(p, img) {
  const spec = p.spec && p.spec.rows && p.spec.rows.length ? p.spec : null
  let kv = ''
  if (spec) {
    const row = pickSpecRow(p)
    if (row) {
      const heads = spec.headers.slice(0, 3)
      kv = heads.map((h, i) => `<div class="kv"><span>${esc(h)}</span><b>${esc(row[i] != null ? row[i] : '')}</b></div>`).join('')
    } else {
      kv = (p.features || []).slice(0, 3).map((f) => `<div class="kv"><span>${esc(f)}</span></div>`).join('')
    }
  }
  return `
    <div class="pcard">
      ${img ? `<div class="pimg"><img src="${img}" alt=""></div>` : `<div class="pimg noimg">${esc((p.name || '')[0])}</div>`}
      <div class="pn">${esc(p.name)}</div>
      <div class="ptag">${esc(p.tagline || '')}</div>
      <div class="pspec">${kv}</div>
    </div>`
}

function gridHtml(cards) {
  let out = ''
  for (let i = 0; i < cards.length; i += 3) out += `<div class="card-row">${cards.slice(i, i + 3).join('')}</div>`
  return out
}

function tableHtml(title, headers, rows) {
  const head = `<tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>`
  const body = rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i === 0 ? 'm' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')
  const rest = headers.length > 1 ? (76 / (headers.length - 1)).toFixed(2) : '76'
  const cols = `<colgroup><col style="width:24%">${headers.slice(1).map(() => `<col style="width:${rest}%">`).join('')}</colgroup>`
  return `<div class="table-title">${esc(title)}</div><table class="spec-table">${cols}<thead>${head}</thead><tbody>${body}</tbody></table>`
}

const pageWrap = (inner, cls = '') => `<div class="page ${cls}">${inner}</div>`

// --- Fixed pages ------------------------------------------------------------
function coverPage() {
  return pageWrap(`
    <div class="cover-top">
      <div class="cover-logo">CENTURY</div>
      <div class="cover-tag">AUTO PARTS CO., LTD.</div>
    </div>
    <div class="cover-mid">
      <div class="cover-title">PRODUCT<br/>CATALOG</div>
      <div class="cover-year">2026</div>
      <div class="cover-sub">Tyre Repair · Balancing · Valve Solutions</div>
      <div class="cover-line"></div>
      <div class="cover-stats">
        <div class="stat"><b>2010</b><span>Founded</span></div>
        <div class="stat"><b>6</b><span>Series</span></div>
        <div class="stat"><b>296</b><span>Models</span></div>
        <div class="stat"><b>40+</b><span>Export Countries</span></div>
      </div>
    </div>
    <div class="cover-foot">
      <div>centurymanufacture.com</div>
      <div>info@centurymanufacture.com</div>
      <div class="cover-ph">+86 156 3363 2668</div>
    </div>`, 'cover')
}

function tocPage() {
  let rows = ''
  categories.forEach((cat, i) => {
    const subs = (cat.subcategories || []).map((s) => s.name).join(' &nbsp;·&nbsp; ')
    rows += `
      <div class="toc-row">
        <div class="toc-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="toc-body"><div class="toc-name">${esc(cat.name)}</div><div class="toc-subs">${subs}</div></div>
        <div class="toc-count">${countCat(cat)} models</div>
      </div>`
  })
  return pageWrap(`
    ${pageHeader('Contents')}
    <div class="toc">${rows}</div>
    <div class="toc-company">
      Hebei Century Auto Parts Co., Ltd. is a professional manufacturer and exporter of tire repair
      products since 2010. We supply wheel balancing weights, tyre valves, TPMS, seal string,
      patches and mushroom plugs direct from the factory — with mixed-container and OEM/ODM support.
    </div>`)
}

async function categoryCover(cat) {
  const sub0 = (cat.subcategories || [])[0]
  const img = sub0 && sub0.image ? await compressedImage(sub0.image) : ''
  const thumbs = []
  for (const sub of cat.subcategories || []) {
    if (thumbs.length >= 5) break
    const p = (sub.products || [])[0]
    const src = (p && p.image) || sub.image
    if (!src) continue
    const u = await compressedImage(src)
    if (u) thumbs.push({ img: u, label: sub.name })
  }
  return pageWrap(`
    ${pageHeader(cat.name, cat.tagline)}
    <div class="cat-split">
      <div class="cat-left">
        <p class="cat-intro">${esc(cat.intro || '')}</p>
        <div class="cat-highlights">${(cat.highlights || []).map((x) => `<div class="hi"><span>✓</span>${esc(x)}</div>`).join('')}</div>
      </div>
      <div class="cat-right">${img ? `<img src="${img}">` : ''}<div class="cat-badge">${countCat(cat)} models</div></div>
    </div>
    <div class="cat-subs">${(cat.subcategories || []).map((s) => `<span class="chip">${esc(s.name)} <i>${(s.products || []).length}</i></span>`).join('')}</div>
    ${thumbs.length ? `<div class="cat-strip" style="grid-template-columns:repeat(${thumbs.length},1fr)">
      ${thumbs.map((t) => `<div class="thumb"><div class="thumb-img"><img src="${t.img}" alt=""></div><div class="thumb-cap">${esc(t.label)}</div></div>`).join('')}
    </div>` : ''}`, 'cat-cover')
}

function wholesalePage() {
  return pageWrap(`
    ${pageHeader('Wholesale & Trade Terms')}
    <div class="facts-row">
      <div class="fact"><b>Factory Direct</b><span>No middlemen — direct manufacturer pricing</span></div>
      <div class="fact"><b>Mixed Containers</b><span>Combine weights, valves &amp; patches in one shipment</span></div>
      <div class="fact"><b>OEM / ODM</b><span>Custom packaging &amp; private label available</span></div>
    </div>
    <div class="block-title">Trade Terms</div>
    <div class="trade-table">
      ${[
        ['MOQ', 'One carton per SKU; mixed-model orders welcome'],
        ['Payment', '30% T/T deposit, balance vs B/L copy; L/C at sight & Alibaba Trade Assurance'],
        ['Lead time', '15–25 days standard production'],
        ['Samples', 'Free samples from production batches; air freight on buyer account'],
        ['Shipping', 'Sea (FCL/LCL), air & express; world-wide'],
      ].map(([k, v]) => `<div class="trade-row"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}
    </div>
    <div class="block-title">Packaging &amp; Shipping</div>
    <div class="two-col">
      <div class="pb-box"><b>Packing options</b><p>Standard export cartons, retail-ready blister packs, or private-label boxes with your artwork. Inner poly bags and desiccant on request.</p></div>
      <div class="pb-box"><b>Consolidated shipping</b><p>Mix wheel weights, tyre valves, TPMS stems and repair patches in one 20ft / 40ft container to lower per-unit freight cost.</p></div>
    </div>
    <div class="block-title">Why Century</div>
    <div class="strength-grid">
      ${[['2010', 'Manufacturing since'], ['296', 'Product models'], ['6', 'Product series'], ['40+', 'Export countries']]
        .map(([n, l]) => `<div class="strength"><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}
    </div>`)
}

function contactPage() {
  return pageWrap(`
    ${pageHeader('Contact Us')}
    <div class="contact-hero">
      <div class="ch-title">Let's build your next order.</div>
      <div class="ch-sub">Send us your target models, quantities and destination — we reply within 24 hours with pricing and lead time.</div>
    </div>
    <div class="contact-grid">
      <div class="cbox"><b>Website</b><span>centurymanufacture.com</span></div>
      <div class="cbox"><b>Email</b><span>info@centurymanufacture.com</span></div>
      <div class="cbox"><b>Phone / WhatsApp</b><span>+86 156 3363 2668</span></div>
      <div class="cbox"><b>Company</b><span>Hebei Century Auto Parts Co., Ltd.</span></div>
    </div>
    <div class="block-title">What to include in your enquiry</div>
    <div class="req-list">
      ${[
        'Product models or series you are interested in (e.g. CTR-FE-01A, TR414, TPMS-5)',
        'Estimated order quantity and target packaging (carton / blister / private label)',
        'Destination country and preferred shipping method (sea / air / express)',
        'Any certification, marking or artwork requirements',
      ].map((x) => `<div class="req"><span>→</span>${esc(x)}</div>`).join('')}
    </div>
    <div class="contact-note">We welcome OEM/ODM projects and mixed-container orders. Request our full detailed catalogue with complete specifications and ask for a quotation today.</div>`, 'contact')
}

// --- Subcategory layout + measurement ---------------------------------------
async function prepareSubs() {
  const out = []
  let ci = 0
  for (const cat of categories) {
    ci++
    let si = 0
    for (const sub of cat.subcategories || []) {
      si++
      const cards = []
      for (const p of (sub.products || []).slice(0, MAX_CARDS)) {
        cards.push(cardHtml(p, await compressedImage(p.image)))
      }
      out.push({
        idx: `${ci}.${si}`,
        sub,
        headerHtml: pageHeader(`${ci}.${si} · ${sub.name}`, sub.desc || sub.seoTitle || ''),
        cardsHtml: gridHtml(cards),
        range: rangeRows(sub, 5),
      })
    }
  }
  return out
}

async function measure(browser, subs) {
  let probe = '<!DOCTYPE html><html><head><meta charset="utf-8">' + CSS +
    '<style>#probe{width:184mm;} .probe-sub{margin-bottom:40px;} .probe-cards .card-row:last-child{margin-bottom:0;}</style>' +
    '</head><body><div id="probe">'
  for (const s of subs) {
    probe += `<div class="probe-sub">${s.headerHtml}${s.cardsHtml ? `<div class="probe-cards">${s.cardsHtml}</div>` : '<div class="probe-cards"></div>'}${s.range ? tableHtml(`Full Range — ${s.sub.name}`, s.range.headers, s.range.rows) : ''}</div>`
  }
  probe += '</div></body></html>'

  const p = await browser.newPage()
  await p.setViewport({ width: 1200, height: 1600 })
  await p.setContent(probe, { waitUntil: 'networkidle0' })
  const res = await p.evaluate(() => [...document.querySelectorAll('.probe-sub')].map((el) => {
    const ph = el.querySelector('.ph')
    const cards = el.querySelector('.probe-cards')
    const title = el.querySelector('.table-title')
    const thead = el.querySelector('thead tr')
    const trs = [...el.querySelectorAll('tbody tr')]
    return {
      headerH: ph ? ph.getBoundingClientRect().height : 0,
      cardsH: cards ? cards.getBoundingClientRect().height : 0,
      titleH: title ? title.getBoundingClientRect().height : 0,
      theadH: thead ? thead.getBoundingClientRect().height : 0,
      rows: trs.map((t) => t.getBoundingClientRect().height),
    }
  }))
  await p.close()
  return res
}

function sliceRows(rowHeights, available) {
  const out = []
  let acc = 0
  for (const h of rowHeights) {
    if (acc + h > available && out.length) break
    // always place at least one row even if it alone is too tall
    out.push(h)
    acc += h
    if (acc > available) break
  }
  return out.length
}

async function subPages(s, m) {
  const pages = []
  const headerLine = s.sub.desc || s.sub.seoTitle || ''
  const head = pageHeader(`${s.idx} · ${s.sub.name}`, headerLine)
  const headCont = pageHeader(`${s.idx} · ${s.sub.name}`, 'continued')

  if (!s.range) {
    pages.push(pageWrap(`${head}${s.cardsHtml}`))
    return pages
  }

  const titleText = `Full Range — ${s.sub.name}`
  const rows = s.range.rows
  const rowH = m.rows

  // Height available for the table block on the card page
  const titleBlock = m.titleH + GAP.titleMt + GAP.tableMt + m.theadH
  let availCard = PAGE_CONTENT_H - m.headerH - GAP.phMb - (m.cardsH ? m.cardsH + GAP.cardMb : 0) - titleBlock
  // Only place a table on the card page if at least one full row fits.
  const n1 = (rowH.length && availCard >= rowH[0] + 4) ? sliceRows(rowH, availCard) : 0

  let cursor = 0
  if (n1 > 0) {
    const slice1 = rows.slice(0, n1)
    pages.push(pageWrap(`${head}${s.cardsHtml}${tableHtml(titleText, s.range.headers, slice1)}`))
    cursor = n1
  } else {
    pages.push(pageWrap(`${head}${s.cardsHtml}`))
  }

  // Continuation table pages
  const availCont = PAGE_CONTENT_H - m.headerH - GAP.phMb - titleBlock
  while (cursor < rows.length) {
    const count = Math.max(1, sliceRows(rowH.slice(cursor), availCont))
    const chunk = rows.slice(cursor, cursor + count)
    pages.push(pageWrap(`${headCont}${tableHtml(`${titleText} (continued)`, s.range.headers, chunk)}`))
    cursor += count
  }
  return pages
}

// --- boot -------------------------------------------------------------------
const mdMkdir = (d) => mkdirSync(d, { recursive: true })

function findChrome() {
  const c = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ]
  return c.find((x) => existsSync(x))
}

function footerHtml(n) {
  return `<div class="pf"><span>Hebei Century Auto Parts Co., Ltd. · Tyre Repair Products</span><span class="pf-num">${n}</span></div>`
}

async function run() {
  mdMkdir(TMP_DIR)
  const exe = findChrome()
  if (!exe) { console.error('Chrome/Edge not found.'); process.exit(1) }

  const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
  try {
    console.log('Preparing content & compressing images ...')
    const subs = await prepareSubs()

    console.log('Measuring layout for exact pagination ...')
    const measurements = await measure(browser, subs)

    console.log('Assembling pages ...')
    const pages = []
    pages.push({ html: coverPage(), footer: false })
    pages.push({ html: tocPage() })

    let ci = 0
    let k = 0
    for (const cat of categories) {
      ci++
      pages.push({ html: await categoryCover(cat) })
      for (const sub of cat.subcategories || []) {
        const s = subs[k]
        const m = measurements[k]
        k++
        for (const h of await subPages(s, m)) pages.push({ html: h })
      }
    }
    pages.push({ html: wholesalePage() })
    pages.push({ html: contactPage() })

    let body = ''
    let n = 0
    for (const p of pages) {
      n++
      let html = p.html
      if (p.footer !== false) {
        const idx = html.lastIndexOf('</div>')
        html = html.slice(0, idx) + footerHtml(n) + html.slice(idx)
      }
      body += html
    }
    const doc = '<!DOCTYPE html><html><head><meta charset="utf-8">' + CSS + '</head><body>' + body + '</body></html>'
    const tmpHtml = join(TMP_DIR, 'catalog.html')
    await fs.writeFile(tmpHtml, doc, 'utf8')
    console.log(`  ${n} pages`)

    const page = await browser.newPage()
    await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 400))

    mdMkdir(join(PUBLIC_DIR, 'downloads'))
    await page.pdf({ path: OUT_PDF, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })

    if (PREVIEW) {
      const pvDir = join(TMP_DIR, 'preview')
      await fs.rm(pvDir, { recursive: true, force: true }).catch(() => {})
      mdMkdir(pvDir)
      const els = await page.$$('.page')
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: join(pvDir, `p-${String(i + 1).padStart(2, '0')}.png`) })
      console.log('Preview PNGs ->', pvDir)
    }
  } finally {
    await browser.close()
  }

  const st = await fs.stat(OUT_PDF)
  console.log('Done:', OUT_PDF, `(${(st.size / 1024 / 1024).toFixed(2)} MB)`)
}

// --- CSS --------------------------------------------------------------------
const CSS = `<style>
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-family: 'Segoe UI', Arial, sans-serif; color: #1A1A2E; }
.page { width: 210mm; height: 297mm; padding: 15mm 13mm 18mm; page-break-after: always; position: relative; overflow: hidden; background: #fff; }
.page:last-child { page-break-after: auto; }
.pf { position: absolute; left: 13mm; right: 13mm; bottom: 7mm; display: flex; justify-content: space-between; font-size: 7pt; color: #aaa; border-top: 1px solid #eee; padding-top: 3mm; }
.pf-num { color: #FF6B00; font-weight: 700; }

.ph { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #FF6B00; padding-bottom: 6px; margin-bottom: 9px; }
.ph-title { font-size: 18pt; font-weight: 800; color: #1A1A2E; letter-spacing: 0.3px; }
.ph-sub { font-size: 8.5pt; color: #666; margin-top: 3px; line-height: 1.35; }
.ph-brand { font-size: 20pt; font-weight: 900; color: #FF6B00; letter-spacing: 1px; }

.cover { background: linear-gradient(160deg, #14142B 0%, #1A1A2E 55%, #22224a 100%); color: #fff; display: flex; flex-direction: column; justify-content: space-between; padding: 20mm 18mm; }
.cover-top { display: flex; align-items: baseline; gap: 12px; }
.cover-logo { font-size: 24pt; font-weight: 900; letter-spacing: 6px; color: #fff; }
.cover-tag { font-size: 10pt; letter-spacing: 3px; color: #FFB27A; }
.cover-title { font-size: 52pt; font-weight: 900; line-height: 1.0; letter-spacing: 1px; color: #fff; }
.cover-year { font-size: 22pt; font-weight: 800; color: #FF6B00; margin-top: 4px; }
.cover-sub { font-size: 12pt; letter-spacing: 1px; color: #d2d3e0; margin-top: 4px; }
.cover-line { width: 90px; height: 4px; background: #FF6B00; margin: 16px 0; }
.cover-stats { display: flex; gap: 26px; margin-top: 6px; }
.stat b { font-size: 22pt; color: #fff; display: block; }
.stat span { font-size: 7.5pt; color: #9a9bb0; text-transform: uppercase; letter-spacing: 1px; }
.cover-foot { font-size: 9pt; color: #c9cad8; line-height: 1.9; letter-spacing: 0.5px; }
.cover-ph { color: #FFB27A; font-weight: 700; }

.toc { margin-top: 4px; }
.toc-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #eee; }
.toc-num { font-size: 15pt; font-weight: 800; color: #FF6B00; width: 36px; }
.toc-name { font-size: 13pt; font-weight: 700; color: #1A1A2E; }
.toc-subs { font-size: 8.5pt; color: #888; margin-top: 2px; }
.toc-count { margin-left: auto; font-size: 8.5pt; color: #FF6B00; font-weight: 600; white-space: nowrap; }
.toc-company { margin-top: 22px; font-size: 9.5pt; color: #555; line-height: 1.7; background: #F6F2EC; padding: 14px 16px; border-left: 4px solid #FF6B00; }

.cat-cover { display: flex; flex-direction: column; }
.cat-split { display: flex; gap: 16px; margin-top: 8px; }
.cat-left { flex: 1.25; }
.cat-right { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg,#fbfbfb,#F6F2EC); border-radius: 10px; padding: 12px; min-height: 120mm; }
.cat-right img { max-width: 100%; max-height: 114mm; object-fit: contain; }
.cat-badge { position: absolute; top: 10px; right: 12px; background: #FF6B00; color: #fff; font-size: 8.5pt; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
.cat-intro { font-size: 10pt; color: #444; line-height: 1.7; }
.cat-highlights { display: flex; flex-direction: column; gap: 9px; margin-top: 16px; }
.hi { font-size: 9pt; color: #333; display: flex; gap: 8px; align-items: flex-start; line-height: 1.45; }
.hi span { color: #FF6B00; font-weight: 800; }
.cat-subs { margin-top: 20px; display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }
.chip { background: #1A1A2E; color: #fff; font-size: 8pt; padding: 8px 11px; border-radius: 6px; display: flex; justify-content: space-between; }
.chip i { font-style: normal; color: #FFB27A; font-weight: 700; }
.cat-strip { margin-top: 24px; display: grid; gap: 12px; border-top: 1px solid #eee; padding-top: 16px; }
.thumb { display: flex; flex-direction: column; }
.thumb-img { height: 46mm; background: linear-gradient(180deg,#fff,#F6F2EC); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #f0f0f0; }
.thumb-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
.thumb-cap { font-size: 7.5pt; color: #666; text-align: center; margin-top: 6px; line-height: 1.3; }

.card-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; margin-bottom: 9px; }
.pcard { border: 1px solid #eaeaea; border-radius: 8px; padding: 8px; background: #fff; }
.pimg { height: 42mm; background: linear-gradient(180deg,#fff,#F6F2EC); border-radius: 6px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pimg img { max-width: 100%; max-height: 100%; object-fit: contain; }
.noimg { font-size: 26pt; color: #ccc; }
.pn { font-size: 9.5pt; font-weight: 700; color: #1A1A2E; margin-top: 6px; }
.ptag { font-size: 7.4pt; color: #666; line-height: 1.35; margin-top: 3px; min-height: 3.2em; }
.pspec { display: grid; grid-template-columns: repeat(3,1fr); gap: 3px; margin-top: 5px; border-top: 1px solid #f0f0f0; padding-top: 5px; }
.kv { font-size: 6.8pt; }
.kv span { color: #999; display: block; }
.kv b { color: #333; font-weight: 600; }

.table-title { margin-top: 12px; font-size: 10.5pt; font-weight: 800; color: #1A1A2E; border-left: 4px solid #FF6B00; padding-left: 8px; }
.spec-table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 7.3pt; table-layout: fixed; }
.spec-table th { background: #1A1A2E; color: #fff; text-align: left; padding: 4px 6px; font-weight: 600; }
.spec-table td { border-bottom: 1px solid #eee; padding: 3.5px 6px; color: #333; word-break: break-word; }
.spec-table .m { font-weight: 600; color: #1A1A2E; }
.spec-table tbody tr:nth-child(even) td { background: #FAFAFA; }

.block-title { margin-top: 20px; font-size: 11pt; font-weight: 800; color: #1A1A2E; border-left: 4px solid #FF6B00; padding-left: 8px; }
.facts-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 8px; }
.fact { background: #F6F2EC; border-radius: 8px; padding: 12px; }
.fact b { display: block; color: #1A1A2E; font-size: 10pt; margin-bottom: 3px; }
.fact span { font-size: 8pt; color: #555; line-height: 1.5; }
.trade-table { margin-top: 6px; }
.trade-row { display: flex; gap: 14px; padding: 9px 0; border-bottom: 1px solid #eee; font-size: 9pt; }
.trade-row b { width: 100px; color: #1A1A2E; flex-shrink: 0; }
.trade-row span { color: #444; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
.pb-box { background: #FAFAFA; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
.pb-box b { display: block; font-size: 10pt; color: #1A1A2E; margin-bottom: 4px; }
.pb-box p { font-size: 8.5pt; color: #555; line-height: 1.55; }
.strength-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-top: 8px; }
.strength { background: #1A1A2E; border-radius: 8px; padding: 14px 12px; text-align: center; }
.strength b { display: block; font-size: 20pt; color: #FF6B00; }
.strength span { font-size: 7.5pt; color: #c9cad8; text-transform: uppercase; letter-spacing: 0.5px; }
.contact-hero { background: #1A1A2E; border-radius: 10px; padding: 20px 22px; margin-top: 6px; }
.ch-title { font-size: 20pt; font-weight: 800; color: #fff; }
.ch-sub { font-size: 9.5pt; color: #c9cad8; line-height: 1.6; margin-top: 6px; max-width: 150mm; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.cbox { border: 1px solid #e4e4e4; border-radius: 8px; padding: 14px; }
.cbox b { display: block; font-size: 8pt; color: #FF6B00; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
.cbox span { font-size: 11pt; font-weight: 600; color: #1A1A2E; }
.req-list { margin-top: 6px; }
.req { display: flex; gap: 9px; font-size: 9pt; color: #444; padding: 6px 0; line-height: 1.5; }
.req span { color: #FF6B00; font-weight: 800; }
.contact-note { margin-top: 16px; font-size: 9.5pt; color: #555; line-height: 1.7; background: #F6F2EC; padding: 14px; border-radius: 8px; }
</style>`

run().catch((e) => { console.error(e); process.exit(1) })
