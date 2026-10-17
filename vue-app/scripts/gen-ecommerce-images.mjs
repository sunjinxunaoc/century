import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const P = 'public/images/products/'
const OUT_DIR = 'public/images/ecommerce'
mkdirSync(OUT_DIR, { recursive: true })

const STYLE = ' Clean e-commerce product photography, pure bright white seamless background, single product centered with generous empty space, soft even studio lighting, subtle natural shadow under the product, hyper realistic true product shape with no distortion, sharp detail, professional catalog photo, square composition. Keep any markings, stamped numbers or engraving that appear on the actual product in the reference exactly as they are. Do not add any other text, letters, logos or watermarks that are not on the real product.'

const WW_MARKINGS = ' The weight must clearly show its stamped/engraved weight markings and numbers (for example 5, 10 or Fe 20 / Fe 45 markings) exactly as on the reference product, crisp and legible.'

const jobs = [
  { file: '01-fe-adhesive-wheel-weight', ref: P + 'Wheel Balancing Weights/Fe Adhensive Wheel Weight CTR-FE-01A.webp',
    text: 'A single Fe (steel) adhesive wheel weight strip with alternating 5g and 10g segments and blue self-adhesive tape backing, shown at a slight angle on the white background.' + WW_MARKINGS + STYLE },
  { file: '02-fe-clip-on-wheel-weight', ref: P + 'Wheel Balancing Weights/FE--Clip-On-wheel-balancing-weight-For-Alloy-Rims-CTR-FE-01C.webp',
    text: 'A single Fe (steel) clip-on wheel balancing weight with a hooked steel clip, standing upright on the white background.' + WW_MARKINGS + STYLE },
  { file: '03-pb-adhesive-wheel-weight', ref: P + 'Wheel Balancing Weights/Pb-Adhensive-Wheel-Weight-CTR-PB-01A.webp',
    text: 'A single Pb (lead) adhesive wheel weight strip with segmented weights and tape backing, shown from a three-quarter angle on the white background.' + WW_MARKINGS + STYLE },
  { file: '04-pb-clip-on-wheel-weight', ref: P + 'Wheel Balancing Weights/Pb--clip-on-balance-weight-for-steel-rims-CTR-PB-01C.webp',
    text: 'A single Pb (lead) clip-on wheel balancing weight with a steel clip for steel rims, standing on the white background.' + WW_MARKINGS + STYLE },
  { file: '05-tr414-tyre-valve', ref: P + 'tyre valves/tr414-tyre-valve001.webp',
    text: 'A single black rubber TR414 snap-in tyre valve stem with the valve core and a plastic cap, standing upright on the white background.' + STYLE },
  { file: '06-truck-brass-tyre-valve', ref: P + 'tyre valves/tr570-tr571-tr572-tr573-tr574-valve-stem001.webp',
    text: 'A single brass metal truck tyre valve stem (TR570/TR571/TR572 style) with a valve core, standing upright on the white background.' + STYLE },
  { file: '07-tpms-valve-stem', ref: P + 'tpms/TPMS-1.webp',
    text: 'A single black TPMS valve stem with its sensor body at the base and a valve cap, standing upright on the white background.' + STYLE },
  { file: '08-tyre-seal-string', ref: P + 'tyre string/tire-seal-string001.webp',
    text: 'A single straight brown rubber tyre seal string (a slender rubber strip) laid flat at a slight diagonal on the white background, not coiled.' + STYLE },
  { file: '09-radial-tyre-patch', ref: P + 'TYRE PATCH/radial-tire-patch.webp',
    text: 'A single flat round black rubber radial tyre repair patch shown face-up on the white background.' + STYLE },
  { file: '10-mushroom-patch-plug', ref: P + 'Mushroom Patch Plug/Mushroom-Tire-Repair-Patch-plug001.webp',
    text: 'A single blue mushroom tyre repair patch plug (glossy blue mushroom-shaped cap with a short black stem and a thin metal needle tip), lying on its side on the white background.' + STYLE },
]

const only = process.argv[2]
const list = only ? jobs.filter(j => j.file.includes(only)) : jobs

for (const job of list) {
  const refB64 = readFileSync(job.ref).toString('base64')
  const mime = job.ref.endsWith('.jpg') ? 'jpeg' : 'webp'
  const body = {
    model: 'gpt-image-2',
    messages: [{ role: 'user', content: [
      { type: 'image_url', image_url: { url: `data:image/${mime};base64,${refB64}` } },
      { type: 'text', text: 'Use the attached reference image as the exact product to photograph. ' + job.text },
    ] }],
  }
  console.log('[ecom] requesting', job.file, '...')
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` }, body: JSON.stringify(body) })
  const t = await res.text()
  if (!res.ok) { console.error('[ecom] HTTP', res.status, t.slice(0, 200)); continue }
  let content = ''
  try { content = JSON.parse(t).choices?.[0]?.message?.content ?? '' } catch { content = t }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[ecom] no image for', job.file); continue }
  const buf = Buffer.from(m, 'base64')
  await sharp(buf).resize(1200, 1200, { fit: 'cover', position: 'attention' }).webp({ quality: 92 }).toFile(`${OUT_DIR}/${job.file}.webp`)
  const out = readFileSync(`${OUT_DIR}/${job.file}.webp`)
  console.log('[ecom] OK', job.file, Math.round(out.length / 1024) + 'KB')
}