import { readFileSync, mkdirSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=../vue-app/.env <script>)'); process.exit(1) }

const REF = 'szd-images/TR412.jpg'
const LOGO = 'public/images/logo/logo-horizontal-transparent.png'
const OUT_DIR = 'output-ecom'
mkdirSync(OUT_DIR, { recursive: true })

const PROMPT = 'The first attached image is the exact product to photograph: a black rubber TR412 snap-in tyre valve stem with brass stem threads and a black plastic cap. The second attached image shows the exact composition and style to copy: the valve body lies diagonally with its round rubber base toward the upper left and the exposed shiny brass threaded stem pointing toward the lower right, and the black plastic cap stands upright beside the valve on the right. Pure bright white seamless background, soft even studio lighting, matte rubber texture, crisp brass detail, very subtle soft shadow, hyper realistic, true product shape with no distortion, professional catalog photography, square composition, generous white space around the product. Do not add any text, letters, logos or watermarks.'

const refBuf = readFileSync(REF)
const styleRes = await fetch('https://centurymanufacture.com/images/products/tyre%20valves/tr414-tyre-valve001.webp')
const styleBuf = Buffer.from(await styleRes.arrayBuffer())
const fd = new FormData()
fd.append('model', 'gpt-image-2')
fd.append('image', new Blob([refBuf], { type: 'image/jpeg' }), 'product.jpg')
fd.append('image', new Blob([styleBuf], { type: 'image/webp' }), 'style.webp')
fd.append('prompt', PROMPT)
fd.append('size', '1024x1024')

console.log('[gen] requesting e-commerce image for TR412 ...')
const res = await fetch('https://img.yunfei.best/v1/images/edits', { method: 'POST', headers: { 'Authorization': `Bearer ${KEY}` }, body: fd })
const t = await res.text()
if (!res.ok) { console.error('[gen] HTTP', res.status, t.slice(0, 300)); process.exit(1) }
const j = JSON.parse(t)
let img
if (j.data?.[0]?.b64_json) {
  img = Buffer.from(j.data[0].b64_json, 'base64')
} else if (j.data?.[0]?.url) {
  img = Buffer.from(await (await fetch(j.data[0].url)).arrayBuffer())
} else {
  console.error('[gen] no image in response', t.slice(0, 300)); process.exit(1)
}
const base = sharp(img).resize(1200, 1200, { fit: 'cover', position: 'attention' })

const logo = await sharp(LOGO).resize({ width: 260 }).png().toBuffer()
const out = `${OUT_DIR}/tr412-ecommerce-logo.webp`
await base
  .composite([{ input: logo, gravity: 'southeast', blend: 'over' }])
  .webp({ quality: 92 })
  .toFile(out)

console.log('[gen] OK', out)
