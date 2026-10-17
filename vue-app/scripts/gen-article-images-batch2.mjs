import { readFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const WW = 'public/images/products/Wheel Balancing Weights/'
const TV = 'public/images/products/tyre valves/'
const TP = 'public/images/products/tpms/'
mkdirSync('public/images/articles', { recursive: true })

const STYLE = ' Photorealistic professional product photography, hyper realistic, accurate real product shapes with no distortion, sharp clean product edges, warm bright background with a soft gradient from light cream to warm amber and a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, wide horizontal banner, 1600x686.'

const jobs = [
  {
    slug: 'commercial-truck-valve-factory-china',
    refs: [TV + 'v3-20-4-v3-20-6-valve-stem002.webp', TV + 'tr570-tr571-tr572-tr573-tr574-valve-stem001.webp'],
    text: 'A photorealistic studio product photo of commercial truck tyre valves: several heavy-duty brass clamp-in truck valve stems (V3-20 series style) and black rubber truck snap-in valves (TR570 series style) standing in a neat group on a clean bright surface, showing brass metal fittings, hex nuts and robust stems clearly. Reproduce the exact shapes and brass color of the reference products.' + STYLE,
  },
  {
    slug: 'truck-wheel-weights',
    refs: [WW + 'Pb-clip-on-wheel-weight-for-Truck-CTR-PB-03C.webp', WW + 'Fe clip on wheel weight for Alloy rims CTR-FE-04C.webp'],
    text: 'A photorealistic studio product photo of heavy-duty truck wheel balancing weights: a row of large clip-on wheel weights ranging from small 50g up to a big 500g truck weight, grey cast lead and coated steel finishes, arranged left to right by size on a clean bright surface, showing the strong spring steel clips. Reproduce the exact clip shape and casting of the reference products.' + STYLE,
  },
  {
    slug: 'tpms-valve-buying-guide',
    refs: [TP + 'TPMS-1.webp', TP + 'TPMS-30.webp'],
    text: 'A photorealistic studio product photo of several TPMS tyre pressure sensor valve stems: black rubber snap-in stems with brass fittings and domed caps standing upright in a neat row on a clean bright surface, one stem shown with a small sensor head base, clearly showing EPDM rubber body and brass details.' + STYLE,
  },
  {
    slug: 'lead-wheel-weight-bans',
    refs: [WW + 'Pb--clip-on-balance-weight-for-steel-rims-CTR-PB-01C.webp', WW + 'Fe clip on wheel weight for FN series car rims CTR-FE-02C.webp'],
    text: 'A photorealistic studio product photo showing the material contrast of wheel balancing weights: on the left a cluster of GREY LEAD clip-on wheel weights with the same spring steel clip and curved profile as the first reference image, on the right coated silver STEEL clip-on wheel weights with the same shape as the second reference image, both arranged on a clean bright surface as a side-by-side comparison, slight depth of field. Reproduce the exact clip shape, bevels and casting of the reference products.' + STYLE,
  },
  {
    slug: 'wheel-weight-conversion-chart',
    refs: [WW + 'Steel-Adhensive-Wheel-Weight-CTR-FE-02A.webp', WW + 'Fe Adhensive Wheel Weight CTR-FE-01A.webp'],
    text: 'A photorealistic studio product photo of adhesive wheel weight strips laid out as an orderly measurement chart: several parallel strips of silver-coated adhesive balancing weights with visible 5 gram segments, one strip partly peeled, arranged top-down flat lay on a clean bright surface, precise and tidy like a technical size chart.' + STYLE,
  },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.slug === only) : jobs

for (const job of list) {
  const parts = job.refs.filter(p => { try { readFileSync(p); return true } catch { return false } }).map(p => ({ type: 'image_url', image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` } }))
  const body = { model: 'gpt-image-2', messages: [{ role: 'user', content: [...parts, { type: 'text', text: job.text }] }] }
  console.log('[batch2] requesting', job.slug, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[batch2] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[batch2] no image for', job.slug); continue }
  const buf = Buffer.from(m, 'base64')
  await sharp(buf).resize(1600, 686, { fit: 'cover', position: 'attention' }).webp({ quality: 86 }).toFile(`public/images/articles/${job.slug}.webp`)
  const out = readFileSync(`public/images/articles/${job.slug}.webp`)
  console.log('[batch2] OK', job.slug, Math.round(out.length / 1024) + 'KB')
}
