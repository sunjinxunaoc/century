import { readFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

mkdirSync('public/images/logo', { recursive: true })

const jobs = [
  {
    name: 'logo-horizontal',
    w: 1200, h: 360,
    refs: ['public/images/logo/logo-icon.png'],
    text: 'Create a horizontal brand logo lockup using the ATTACHED horse head logo icon. Reproduce the attached orange horse head with tire-tread arc icon EXACTLY as-is on the LEFT side (same shape, same orange #FF6B00, flat vector style). On the RIGHT side next to the icon add the brand name "CENTURY" in uppercase modern sans-serif lettering, dark charcoal #2B2B2B, wide letter-spacing, strong and industrial; below it in much smaller orange #FF6B00 spaced letters "AUTO PARTS". Flat vector logo style, crisp edges, no gradients, no shadows, no photo elements, generous spacing between icon and text, vertically centered, solid pure white background, wide horizontal composition 1200x36' + '0.',
  },
  {
    name: 'logo-icon',
    w: 1024, h: 1024,
    text: 'Design a square logo ICON for an auto parts manufacturer brand: a minimalist geometric SILHOUETTE of a horse head in profile facing right, bold angular clean shapes suggesting speed and strength, vivid orange #FF6B00 fill, with a subtle circular tire/wheel arc wrapping the back of the head suggesting the wheel industry. Flat vector style, crisp edges, no gradients, no text, no shadow, centered with comfortable padding, solid pure white background, 1024x1024.',
  },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.name === only) : jobs

for (const job of list) {
  const parts = (job.refs || []).filter(p => { try { readFileSync(p); return true } catch { return false } }).map(p => ({ type: 'image_url', image_url: { url: `data:image/png;base64,${readFileSync(p).toString('base64')}` } }))
  const body = { model: 'gpt-image-2', messages: [{ role: 'user', content: [...parts, { type: 'text', text: job.text }] }] }
  console.log('[logo] requesting', job.name, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[logo] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[logo] no image for', job.name); continue }
  const buf = Buffer.from(m, 'base64')
  await sharp(buf).resize(job.w, job.h, { fit: 'cover', position: 'attention' }).png().toFile(`public/images/logo/${job.name}.png`)
  const out = readFileSync(`public/images/logo/${job.name}.png`)
  console.log('[logo] OK', job.name, Math.round(out.length / 1024) + 'KB')
}
