import { readFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const TV = 'public/images/products/tyre valves/'
mkdirSync('public/images/articles', { recursive: true })

const STYLE = ' Photorealistic professional product photography, hyper realistic, accurate real product shapes with no distortion, sharp clean product edges, warm bright background with a soft gradient from light cream to warm amber and a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, wide horizontal banner, 1600x686.'

const jobs = [
  {
    slug: 'tyre-valve-cores',
    refs: [TV + 'tr413-tr414-valve-002.webp', TV + 'tr570-tr571-tr572-tr573-tr574-valve-stem001.webp'],
    text: 'A photorealistic studio product photo of tyre valve cores: a small brass valve core (9002# type) shown next to black rubber tyre valve stems, one stem partially showing the core in place inside the stem, on a clean bright surface. Focus on the small brass core and the top of the valve stems.' + STYLE,
  },
  {
    slug: 'tyre-valve-caps',
    refs: [TV + 'tyre-valve-stem-Tr414-Tr412-Tr413-Tr415001.webp', TV + 'tr414-tyre-valve001.webp'],
    text: 'A photorealistic studio product photo of rubber tyre valve stems each fitted with a plastic dome dust cap, several stems standing upright in a row showing the caps clearly, on a clean bright surface.' + STYLE,
  },
  {
    slug: 'tyre-valve-sizes-dimensions',
    refs: [TV + 'Tr412-Tr413-Tr415-tr414-tire-valve-stem001.webp', TV + 'v3-20-4-v3-20-6-valve-stem002.webp'],
    text: 'A photorealistic studio product photo of different tyre valve sizes standing in a row for a size comparison: black rubber snap-in valves of different stem lengths (TR412, TR413, TR414 style) and a taller brass truck valve, arranged left to right on a clean bright surface, clearly showing the different lengths and shapes.' + STYLE,
  },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.slug === only) : jobs

for (const job of list) {
  const parts = job.refs.filter(p => { try { readFileSync(p); return true } catch { return false } }).map(p => ({ type: 'image_url', image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` } }))
  const body = { model: 'gpt-image-2', messages: [{ role: 'user', content: [...parts, { type: 'text', text: job.text }] }] }
  console.log('[new] requesting', job.slug, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[new] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[new] no image for', job.slug); continue }
  const buf = Buffer.from(m, 'base64')
  await sharp(buf).resize(1600, 686, { fit: 'cover', position: 'attention' }).webp({ quality: 86 }).toFile(`public/images/articles/${job.slug}.webp`)
  const out = readFileSync(`public/images/articles/${job.slug}.webp`)
  console.log('[new] OK', job.slug, Math.round(out.length / 1024) + 'KB')
}