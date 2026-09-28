import { writeFileSync, readFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

// Base reference = the image the user likes
const refB64 = Buffer.from(readFileSync('public/images/hero-banner-wheel-weight.webp')).toString('base64')

const angles = {
  a: {
    label: 'top-down-elevated',
    note: 'top-down elevated camera, about 35 degrees above, slightly down-tilting at the group, all clip-on wheel weights clearly visible from above, products arranged in a loose fan, empty dark space at top of frame for website text overlay',
    out: 'hero-banner-wheel-weight-angle-a.webp',
  },
  b: {
    label: 'lower-eye-level-left',
    note: 'lower eye-level camera near the workbench surface, viewed from slightly left of center, dramatic shallow depth of field with the near clip-on weight prominent and crisp in front, subjects arranged linearly, empty dark space at top of frame',
    out: 'hero-banner-wheel-weight-angle-b.webp',
  },
  c: {
    label: 'offset-45-right',
    note: '45-degree perspective from the right, slightly iso-view of the clip-on wheel weights as if looking from the upper-right corner, products grouped toward the middle, empty dark space at top of frame for website text overlay',
    out: 'hero-banner-wheel-weight-angle-c.webp',
  },
}

const angleKey = process.argv[2]
const angle = angles[angleKey]
if (!angle) {
  console.error('usage: node scripts/gen-banner-angle.mjs <a|b|c>')
  process.exit(1)
}

const body = {
  model: 'gpt-image-2',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${refB64}` },
        },
        {
          type: 'text',
          text: `Using this reference image for product shapes and industrial realism, regenerate the same subject but from a NEW camera angle: ${angle.note}. Same photorealistic studio photography style, dark navy-blue industrial background with small warm orange accent glow #FF6B00, hyper realistic macro product texture, advertising quality, 1920x800 wide composition.`,
        },
      ],
    },
  ],
}

console.log(`[angle:${angle.label}] requesting image...`)

const res = await fetch(API, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
  body: JSON.stringify(body),
})

const text = await res.text()
if (!res.ok) {
  console.error('[angle] HTTP', res.status, text.slice(0, 400))
  process.exit(1)
}

let content = ''
try { content = JSON.parse(text).choices?.[0]?.message?.content ?? '' } catch { content = text }

const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1]
  || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
if (!m) { console.error('[angle] no image:', content.slice(0, 300)); process.exit(1) }

const buf = Buffer.from(m, 'base64')
writeFileSync(`public/images/${angle.out.replace('.webp', '-raw.png')}`, buf)
await sharp(buf).resize(1920, 800, { fit: 'cover', position: 'attention' }).webp({ quality: 90 }).toFile(`public/images/${angle.out}`)
const outBuf = readFileSync(`public/images/${angle.out}`)
console.log('[angle] saved', angle.out, outBuf.length, 'bytes', Math.round(outBuf.length / 1024) + 'KB')