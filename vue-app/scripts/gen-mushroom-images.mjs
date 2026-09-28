import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const MP = 'public/images/products/Mushroom Patch Plug/'
const TS = 'public/images/products/tyre string/'
const TP = 'public/images/products/TYRE PATCH/'

const STYLE = ' Photorealistic professional product photography, hyper realistic, accurate real product shapes with no distortion, sharp clean product edges, warm bright background with a soft gradient from light cream to warm amber and a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, wide horizontal banner, 1600x686.'

const jobs = [
  {
    slug: 'mushroom-plug-vs-seal-string',
    refs: [MP + 'Mushroom-Tire-Repair-Patch-plug001.webp', MP + 'Mushroom-Tire-Repair-Patch-plug002.webp', TS + 'tire-seal-string001.webp'],
    text: 'A photorealistic studio product photo comparing two tyre repair products: on the LEFT a blue mushroom patch plug exactly matching the reference - a glossy blue mushroom-shaped rubber cap with a short black stem and a thin metal needle tip, lying on its side. On the RIGHT a straight brown rubber tyre seal string (a slender rubber stick) lying flat, NOT coiled. Both on a clean bright surface, simple balanced composition.' + STYLE,
  },
  {
    slug: 'tyre-patch-vs-plug',
    refs: [TP + 'radial-tire-patch.webp', MP + 'Mushroom-Tire-Repair-Patch-plug001.webp', TS + 'tire-seal-string001.webp'],
    text: 'A photorealistic studio product photo of three tyre repair products in a row on a clean bright surface: on the left a flat round black rubber tyre repair patch, in the centre a blue mushroom patch plug exactly matching the reference (glossy blue mushroom-shaped cap with a short black stem and metal needle tip, lying on its side), on the right a straight brown rubber seal string lying flat, not coiled.' + STYLE,
  },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.slug === only) : jobs

for (const job of list) {
  const parts = job.refs.map(p => ({ type: 'image_url', image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` } }))
  const body = { model: 'gpt-image-2', messages: [{ role: 'user', content: [...parts, { type: 'text', text: job.text }] }] }

  console.log('[mushroom] requesting', job.slug, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[mushroom] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[mushroom] no image for', job.slug); continue }
  const buf = Buffer.from(m, 'base64')
  await sharp(buf).resize(1600, 686, { fit: 'cover', position: 'attention' }).webp({ quality: 86 }).toFile(`public/images/articles/${job.slug}.webp`)
  const out = readFileSync(`public/images/articles/${job.slug}.webp`)
  console.log('[mushroom] OK', job.slug, Math.round(out.length / 1024) + 'KB')
}