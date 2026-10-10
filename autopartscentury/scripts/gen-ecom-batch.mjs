import { readFileSync, mkdirSync, existsSync } from 'node:fs'
import sharp from 'sharp'

const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=../vue-app/.env <script>)'); process.exit(1) }

const LOGO = 'public/images/logo/logo-horizontal-transparent.png'
const OUT_DIR = 'output-ecom'
mkdirSync(OUT_DIR, { recursive: true })

const FILES = [
  ['cap-EP', 'szd-images/cap-EP.png', 'plastic black dome-shaped'],
  ['cap-VS-8SJ', 'szd-images/cap-VS-8SJ.png', 'plastic black'],
  ['cap-VS-8', 'szd-images/cap-VS-8B.png', 'plastic BLACK (same shape as the reference photo, but the cap body must be black, not blue)'],
  ['cap-VS-8R', 'szd-images/cap-VS-8R.png', 'plastic bright vivid RED colored (the cap body must be clearly red, NOT black)'],
  ['cap-VS-8G', 'szd-images/cap-VS-8G.png', 'plastic green'],
  ['cap-VS-8B', 'szd-images/cap-VS-8B.png', 'plastic blue'],
  ['cap-VT', 'szd-images/cap-VT.png', 'chrome silver metal'],
  ['cap-AT', 'szd-images/cap-AT.png', 'chrome silver metal hex'],
  ['cap-ANT', 'szd-images/cap-ANT.png', 'chrome silver metal hex'],
  ['cap-APT', 'szd-images/cap-APT.png', 'chrome silver metal hex'],
  ['cap-ET', 'szd-images/cap-ET.png', 'chrome silver metal hex'],
  ['cap-FT', 'szd-images/cap-FT.png', 'chrome silver metal knurled'],
  ['cap-FZT', 'szd-images/cap-FZT.png', 'chrome silver metal'],
  ['cap-CTT', 'szd-images/cap-CTT.png', 'brass gold metal slotted'],
  ['cap-CT', 'szd-images/cap-CT.png', 'chrome silver metal with a protruding core pin'],
  ['cap-DT', 'szd-images/cap-DT.png', 'chrome silver metal'],
  ['cap-GT', 'szd-images/cap-GT.png', 'chrome silver metal knurled'],
  ['cap-TST', 'szd-images/cap-TST.png', 'chrome silver metal tall'],
]

const FRONT_PROMPT = (m, d) => `The attached image is the exact product to photograph: a ${m.replace('cap-', '')} ${d} tyre valve cap, a small screw-on cap with a ribbed or knurled grip surface. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference; illustrate only ONE single cap. Ignore and remove any model name labels or text annotations that may appear in the reference image. Premium e-commerce hero shot: the single cap standing upright, slightly off-center to the left, and the product fills about 60% of the frame height. Pure white seamless background with a very subtle light-gray gradient toward the bottom. Soft directional studio lighting from the upper left creating a gentle highlight on the cap and a soft shadow to the lower right, plus a faint realistic mirror reflection of the product on the glossy surface beneath it. Hyper realistic true product shape with no distortion, sharp crisp detail, professional catalog photography, square composition. Do not add any text, letters, logos or watermarks.`

async function gen(prompt, imgs) {
  const fd = new FormData()
  fd.append('model', 'gpt-image-2')
  for (const [i, b] of imgs.entries()) {
    fd.append('image', new Blob([b.buf], { type: b.type }), `ref${i}.${b.type === 'image/webp' ? 'webp' : b.type === 'image/png' ? 'png' : 'jpg'}`)
  }
  fd.append('prompt', prompt)
  fd.append('size', '1024x1024')
  const res = await fetch('https://img.yunfei.best/v1/images/edits', { method: 'POST', headers: { 'Authorization': `Bearer ${KEY}` }, body: fd })
  const t = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${t.slice(0, 200)}`)
  const j = JSON.parse(t)
  if (j.data?.[0]?.b64_json) return Buffer.from(j.data[0].b64_json, 'base64')
  if (j.data?.[0]?.url) return Buffer.from(await (await fetch(j.data[0].url)).arrayBuffer())
  throw new Error('no image in response')
}

const logo = await sharp(LOGO).resize({ width: 400 }).png().toBuffer()

async function save(img, out) {
  await sharp(img)
    .resize(1200, 1200, { fit: 'cover', position: 'attention' })
    .composite([{ input: logo, gravity: 'southeast', blend: 'over' }])
    .webp({ quality: 92 })
    .toFile(out)
  console.log('OK', out)
}

for (const [m, refPath, d] of FILES) {
  if (!existsSync(refPath)) { console.error('MISSING', refPath); continue }
  const mime = refPath.endsWith('.png') ? 'image/png' : refPath.endsWith('.webp') ? 'image/webp' : 'image/jpeg'
  const ref = { buf: readFileSync(refPath), type: mime }
  const out = `${OUT_DIR}/${m.toLowerCase().replace(/\s+/g, '-')}-front-logo.webp`
  if (existsSync(out)) { console.log('SKIP', out); continue }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[gen] ${m} front (try ${attempt}) ...`)
      const img = await gen(FRONT_PROMPT(m, d), [ref])
      await save(img, out)
      break
    } catch (e) {
      console.error(`[gen] fail ${m} try ${attempt}:`, e.message)
      if (attempt === 3) console.error('[gen] GIVEUP', out)
      else await new Promise(r => setTimeout(r, 15000))
    }
  }
}
console.log('done')
