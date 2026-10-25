import { readFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const WW = 'public/images/products/Wheel Balancing Weights/'
const TP = 'public/images/products/TYRE PATCH/'
mkdirSync('public/images/articles', { recursive: true })

const STYLE = ' Photorealistic professional product photography, hyper realistic, accurate real product shapes with no distortion, sharp clean product edges, warm bright background with a soft gradient from light cream to warm amber and a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, wide horizontal banner, 1600x686. ABSOLUTELY NO logo, NO watermark, NO brand name, NO text, NO letters, NO numbers, NO labels, NO captions, NO text overlay anywhere in the image - keep the surface completely clean and empty.'

const LOGO = 'public/images/logo/logo-horizontal-transparent.png'

const jobs = [
  {
    slug: 'how-wheel-balancing-works',
    refs: [WW + 'Fe Adhensive Wheel Weight CTR-FE-01A.webp', WW + 'Fe clip on wheel weight for Alloy rims CTR-FE-04C.webp', WW + 'Balance-Machine-Calibration-Block-100G.webp'],
    text: 'A photorealistic studio product photo about wheel balancing: a neat scene showing BOTH types of balancing weights together - a strip of thin adhesive (stick-on) balancing weights exactly reproducing the shape of the first reference, and several curved clip-on balancing weights exactly reproducing the second reference, arranged on a clean bright studio surface beside a small calibration block like the third reference, as if demonstrating the products used to balance a wheel. Reproduce the exact strip shapes, clip profiles and coated metal finishes of the reference products.' + STYLE,
  },
  {
    slug: 'cold-patch-vs-hot-patch',
    refs: [TP + 'All-Purpose-Repair-Patch-universal-round--cold-patch-tyre-patch-repair001.webp', TP + 'bias-ply-tire-patch001.webp', TP + 'EU-Style-bias-ply-tire-patch.webp'],
    text: 'A photorealistic studio product photo about tyre repair patches: a side-by-side comparison of two kinds of rubber repair patches - on the left a round flexible cold patch exactly like the first reference with its protective backing partly visible, on the right a larger reinforced heavy-duty bias-ply patch like the second and third references with visible fabric backing, arranged on a clean bright surface with slight depth of field. Reproduce the exact round shape, flexible rubber texture and reinforced backing of the reference patches.' + STYLE,
  },
  {
    slug: 'import-tyre-repair-products-from-china',
    refs: ['public/images/factory.webp'],
    text: 'A photorealistic photo of a modern tyre products export factory scene: neat stacks of packed cartons and pallets in a bright clean warehouse, a worker in the background, conveying bulk export and international shipping readiness, warm bright lighting, professional industrial photography, wide horizontal banner. Do not show any readable text, logos or writing on the cartons.' + STYLE,
  },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.slug === only) : jobs

for (const job of list) {
  const parts = job.refs.filter(p => { try { readFileSync(p); return true } catch { return false } }).map(p => ({ type: 'image_url', image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` } }))
  const body = { model: 'gpt-image-2', messages: [{ role: 'user', content: [...parts, { type: 'text', text: job.text }] }] }
  console.log('[batch3] requesting', job.slug, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[batch3] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[batch3] no image for', job.slug); continue }
  const buf = Buffer.from(m, 'base64')
  const W = 1600, H = 686
  const logoWidth = Math.round(W * 0.30)
  const logo = await sharp(LOGO).resize(logoWidth, null, { fit: 'inside' }).png().toBuffer()
  const logoMeta = await sharp(logo).metadata()
  const logoH = logoMeta.height || Math.round(logoWidth * 0.30)
  const padX = Math.round(W * 0.04)
  const padBottom = Math.round(H * 0.05)
  await sharp(buf)
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: logo, left: padX, top: H - logoH - padBottom }])
    .webp({ quality: 86 })
    .toFile(`public/images/articles/${job.slug}.webp`)
  const out = readFileSync(`public/images/articles/${job.slug}.webp`)
  console.log('[batch3] OK', job.slug, Math.round(out.length / 1024) + 'KB')
}
