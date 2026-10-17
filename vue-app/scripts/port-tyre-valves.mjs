// One-off migration: port the tyre-valves category from autopartscentury
// into vue-app's src/data/products.js, keeping the original image paths
// (/images/products/tyre-valves/). Copy the image folder alongside:
//   autopartscentury/public/images/products/tyre-valves ->
//   vue-app/public/images/products/tyre-valves
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const SRC = 'C:/Users/86189/Desktop/websit/autopartscentury/src/data/products.js'
const TMP = join(root, 'raw', '_apc-category.mjs')
const TMP_ORIG = join(root, 'raw', '_orig-category.mjs')
const TARGET = join(root, 'src', 'data', 'products.js')

copyFileSync(SRC, TMP)
const { category } = await import(pathToFileURL(TMP).href)

// Recover the site's original tyre-valves category from git HEAD so the
// original products (and their URLs) are preserved alongside the ported ones.
const origText = execSync('git show HEAD:vue-app/src/data/products.js', {
  cwd: join(root, '..'),
  maxBuffer: 64 * 1024 * 1024,
}).toString('utf8').replace(/\r\n/g, '\n')
const oStart = origText.indexOf("  {\n    slug: 'tyre-valves',")
const oEnd = origText.indexOf("  {\n    slug: 'tpms',")
if (oStart < 0 || oEnd < 0 || oEnd <= oStart) throw new Error(`orig markers not found: ${oStart} ${oEnd}`)
const origBlock = origText.slice(oStart, oEnd).replace(/,\s*$/, '')
writeFileSync(TMP_ORIG, `export const origCategory = ${origBlock}\n`)
const { origCategory } = await import(pathToFileURL(TMP_ORIG).href)

// Keep the site-optimised category-level SEO fields already in vue-app
const target0 = readFileSync(TARGET, 'utf8')
category.seoTitle = 'Tyre Valve Manufacturer China | Rubber Snap-In & Brass Valve Factory'
category.keywords = 'tyre valves, tyre valve, tyre valve dimensions, TR414, tubeless valve, snap-in valve, clamp-in valve, truck valve, motorcycle valve, tyre valves for sale, tyre valves price, tyre valve types, car tyre valves, metal tyre valves, tyre valve caps, tyre valve core, tyre valves replacement, commercial truck valve, truck valve factory china, tyre valve manufacturer, tyre valve factory, tyre valve manufacturer china, valve stem factory'

// Ported products whose slug collides with an original product get a new
// slug - the originals keep their URLs untouched.
const RENAME = {
  'tr618a-tubeless-valve': 'tr618-tr618a-tubeless-valve',
  'trj650-02-03-large-bore-swivel-valve': 'trj650-02-trj650-03-large-bore-swivel-valve',
}

// Representative card image for each subcategory
const SUB_IMAGES = {
  'passenger-car-light-truck-valves': '/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp',
  'motorcycle-bicycle-valves': '/images/products/tyre-valves/pvr32-motorcycle-valve001.webp',
  'truck-bus-valves': '/images/products/tyre-valves/tr571-clamp-in-valve001.webp',
  'agricultural-tractors-off-road-valves': '/images/products/tyre-valves/trj650-03-valve001.webp',
  'valve-extensions': '/images/products/tyre-valves/ex125p-valve-extension001.webp',
  'valve-accessories': '/images/products/tyre-valves/vc-8r-valve-cap001.webp',
}

let count = 0
let kept = 0
for (const sub of category.subcategories) {
  if (SUB_IMAGES[sub.slug]) sub.image = SUB_IMAGES[sub.slug]
  const origSub = (origCategory.subcategories || []).find(s => s.slug === sub.slug)
  const origProducts = origSub?.products || []
  for (const p of sub.products || []) {
    if (!p.images || !p.images.length) delete p.images
    if (origProducts.some(op => op.slug === p.slug)) {
      if (!RENAME[p.slug]) throw new Error(`slug collision needs a rename rule: ${p.slug}`)
      p.slug = RENAME[p.slug]
    }
    count++
  }
  if (origProducts.length) {
    sub.products = [...(sub.products || []), ...origProducts]
    kept += origProducts.length
  }
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}
function isIdent(k) {
  return /^[A-Za-z_$][\w$]*$/.test(k)
}
function toJs(v, ind) {
  const pad = '  '.repeat(ind)
  const padIn = '  '.repeat(ind + 1)
  if (typeof v === 'string') return `'${esc(v)}'`
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) {
    if (!v.length) return '[]'
    const primitive = v.every(x => typeof x === 'string' || typeof x === 'number')
    if (primitive) {
      const inline = `[${v.map(x => toJs(x, 0)).join(', ')}]`
      if (inline.length + pad.length <= 100) return inline
      return `[\n${v.map(x => `${padIn}${toJs(x, ind + 1)},`).join('\n')}\n${pad}]`
    }
    return `[\n${v.map(x => `${padIn}${toJs(x, ind + 1)},`).join('\n')}\n${pad}]`
  }
  const entries = Object.entries(v)
  const lines = entries.map(([k, val]) => `${padIn}${isIdent(k) ? k : `'${esc(k)}'`}: ${toJs(val, ind + 1)},`)
  return `{\n${lines.join('\n')}\n${pad}}`
}

const block = `${toJs(category, 1)},\n`

const startMarker = "{\n    slug: 'tyre-valves',"
const endMarker = "  {\n    slug: 'tpms',"
const start = target0.indexOf(startMarker)
const end = target0.indexOf(endMarker)
if (start < 0 || end < 0 || end <= start) throw new Error(`markers not found: start=${start} end=${end}`)

const out = target0.slice(0, start) + block + target0.slice(end)
writeFileSync(TARGET, out)
console.log(`ported ${count} products + kept ${kept} originals across ${category.subcategories.length} subcategories`)
