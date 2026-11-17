// Generates the two new article banner images via the Yunfei image API.
// Base prompt text is derived from the article content.
// Usage (from vue-app):  node --env-file=.env scripts/gen-article-images-wholesale-ai.mjs [slug]
// Requires YUNFEI_API_KEY in the environment or .env file.
import { readFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const TP = 'public/images/products/TYRE PATCH/'
mkdirSync('public/images/articles', { recursive: true })

const STYLE = ' Photorealistic professional product photography, hyper realistic, accurate real product shapes with no distortion, sharp clean product edges, warm bright background with a soft gradient from light cream to warm amber and a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, wide horizontal banner, 1600x686. ABSOLUTELY NO logo, NO watermark, NO brand name, NO text, NO letters, NO numbers, NO labels, NO captions, NO text overlay anywhere in the image - keep the surface completely clean and empty.'

const jobs = [
  {
    slug: 'tyre-patches-wholesale',
    refs: [
      TP + 'All-Purpose-Repair-Patch-universal-round--cold-patch-tyre-patch-repair001.webp',
      TP + 'EU-Style-bias-ply-tire-patch.webp',
      TP + 'Inner-Tire-Patch-Sunflower-Tire-Patch-Inner-Oval-Tire-Patch.webp',
    ],
    text: 'A photorealistic studio product photo about a wholesale assortment of tyre repair patches: a neat spread of many different sizes and shapes of rubber repair patches laid out together - small round patches, larger oval patches, and a reinforced bias-ply patch - arranged on a clean bright surface as if demonstrating a wholesale distributor assortment. Reproduce the exact round shapes, flexible rubber texture, protective backing and reinforced backing of the reference patches.' + STYLE,
  },
  {
    slug: 'cold-patch-vulcanizing',
    refs: [
      TP + 'radial-tire-patch.webp',
      TP + 'All-Purpose-Repair-Patch-universal-round--cold-patch-tyre-patch-repair001.webp',
    ],
    text: 'A photorealistic studio photo of the cold patch vulcanizing tyre repair process: a technician hands view showing the step of applying and pressing a flexible rubber cold patch onto a buffed inner liner with a roller, a buffer and a small can of self-vulcanizing cement nearby on a clean bright workshop surface. Reproduce the exact round shape and flexible rubber texture of the reference patch.' + STYLE,
  },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.slug === only) : jobs

for (const job of list) {
  const parts = job.refs.filter(p => { try { readFileSync(p); return true } catch { return false } }).map(p => ({ type: 'image_url', image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` } }))
  const body = { model: 'gpt-image-2', messages: [{ role: 'user', content: [...parts, { type: 'text', text: job.text }] }] }
  console.log('[ai] requesting', job.slug, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[ai] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[ai] no image for', job.slug); continue }
  const buf = Buffer.from(m, 'base64')

  // Composite the brand logo in the bottom-left, matching the site banner style.
  const W = 1600, H = 686
  const logo = await sharp('public/images/logo/logo-horizontal-transparent.png').resize(Math.round(W * 0.30), null, { fit: 'inside' }).png().toBuffer()
  const logoMeta = await sharp(logo).metadata()
  const logoH = logoMeta.height || Math.round(W * 0.30 * 0.30)
  const padX = Math.round(W * 0.04)
  const padBottom = Math.round(H * 0.05)

  await sharp(buf)
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: logo, left: padX, top: H - logoH - padBottom }])
    .webp({ quality: 86 })
    .toFile(`public/images/articles/${job.slug}.webp`)
  const out = readFileSync(`public/images/articles/${job.slug}.webp`)
  console.log('[ai] OK', job.slug, Math.round(out.length / 1024) + 'KB')
}
