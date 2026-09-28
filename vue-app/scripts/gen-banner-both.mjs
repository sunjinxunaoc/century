import { writeFileSync, readFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const refs = [
  { path: 'C:/Users/86189/Desktop/粘贴式平衡块.jpg', mime: 'jpeg', label: 'Flat self-adhesive wheel weight strips with blue tape backing' },
  { path: 'public/images/products/Wheel Balancing Weights/FE--Clip-On-wheel-balancing-weight-For-Alloy-Rims-CTR-FE-01C.webp', mime: 'webp', label: 'Hammered-steel clip-on wheel balancing weights with hooked ends (Fe 20, Fe 45 style)' },
]

const refParts = refs.map(r => ({
  type: 'image_url',
  image_url: { url: `data:image/${r.mime};base64,${readFileSync(r.path).toString('base64')}` },
}))

const body = {
  model: 'gpt-image-2',
  messages: [
    {
      role: 'user',
      content: [
        ...refParts,
        {
          type: 'text',
          text: `Using the attached reference images as precise guides for real product shapes (adhesive wheel weight strip in the first image, clip-on wheel weight in the second), create a photorealistic studio hero banner for a tyre repair products manufacturer website. FOREGROUND: BOTH product types on a clean bright surface. (1) The self-adhesive wheel weight strips: use EXACTLY the look from the first reference - a flat steel strip with the adhesive tape backing fully applied, NOT peeled, NOT lifted, NOT showing any exposed bare metal. (2) The clip-on wheel balancing weight: use the exact shape from the second reference, hammered-steel clip-on, hooked lip, stamped with clear engraved markings like "Fe 20" with crisp embossed text. BACKGROUND: a warm, bright, luminous backdrop - soft warm gradient from a light cream/peach bottom to a warm coral and amber-orange ambience, matching brand color #FF6B00 with golden highlights, NOT black, NOT dark navy, NOT dark gray; airy studio high-key lighting with soft shadows, gentle lens flare, empty bright space at the top of the frame for website headline text overlay, shallow depth of field, soft key light, hyper realistic advertising photography, warm inviting e-commerce campaign aesthetic, 1920x800 wide composition.`,
        },
      ],
    },
  ],
}

console.log('[banner:both-refs] requesting image...')

const res = await fetch(API, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
  body: JSON.stringify(body),
})

const text = await res.text()
if (!res.ok) {
  console.error('[banner] HTTP', res.status, text.slice(0, 400))
  process.exit(1)
}

let content = ''
try { content = JSON.parse(text).choices?.[0]?.message?.content ?? '' } catch { content = text }

const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1]
  || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
if (!m) { console.error('[banner] no image:', content.slice(0, 300)); process.exit(1) }

const buf = Buffer.from(m, 'base64')
writeFileSync('public/images/hero-banner-warm-raw.png', buf)
console.log('[banner] saved raw PNG', buf.length, 'bytes')

await sharp(buf).resize(1920, 800, { fit: 'cover', position: 'attention' }).webp({ quality: 90 }).toFile('public/images/hero-banner-warm.webp')
const outBuf = readFileSync('public/images/hero-banner-warm.webp')
console.log('[banner] saved public/images/hero-banner-warm.webp', outBuf.length, 'bytes', Math.round(outBuf.length / 1024) + 'KB')