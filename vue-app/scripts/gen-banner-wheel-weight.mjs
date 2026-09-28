import { writeFileSync, readFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

// Use reference image as visual anchor. The prompt describes what we want outside the reference.
const refB64 = readFileSync('ref-b64.txt', 'utf8').trim()

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
          text: `Using the attached reference image as a guide for realistic product shapes, create a photorealistic hero banner of wheel balancing weights arranged on a dark metal workbench. The composition must feature BOTH types naturally intermingled together in one loose group - not separated into left/right clusters: (1) hammered-steel clip-on wheel balancing weights with hooked ends, each clearly stamped with engraved steel markings like "Fe 20" and "Fe 45" - crisp readable indentation text on the clip-on weights only; (2) flat self-adhesive wheel weight strips with their vivid BLUE adhesive tape backing clearly visible - one or two strips showing the peeled blue liner, and the adhesive strips must be completely plain with NO stamped text, NO Fe markings, NO numbers on the adhesive strips at all. Dark navy-blue industrial background with a small warm orange accent glow in brand #FF6B00, empty dark space at the top of the frame for website headline text overlay, soft studio key light, hyper realistic advertising quality photography, 1920x800 wide composition.`,
        },
      ],
    },
  ],
}

console.log('[banner:wheel-weight] requesting image with reference...')

const res = await fetch(API, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${KEY}`,
  },
  body: JSON.stringify(body),
})

const text = await res.text()
if (!res.ok) {
  console.error('[banner] HTTP', res.status, text.slice(0, 500))
  process.exit(1)
}

let content = ''
try {
  content = JSON.parse(text).choices?.[0]?.message?.content ?? ''
} catch (e) {
  content = text
}

const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1]
  || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]

if (!m) {
  console.error('[banner] no image in response:', content.slice(0, 300))
  process.exit(1)
}

const buf = Buffer.from(m, 'base64')
writeFileSync('public/images/hero-banner-wheel-weight-v4-raw.png', buf)
console.log('[banner] saved raw PNG', buf.length, 'bytes')

await sharp(buf)
  .resize(1920, 800, { fit: 'cover', position: 'attention' })
  .webp({ quality: 90 })
  .toFile('public/images/hero-banner-wheel-weight-v4.webp')
const outBuf = readFileSync('public/images/hero-banner-wheel-weight-v4.webp')
console.log('[banner] saved public/images/hero-banner-wheel-weight-v4.webp', outBuf.length, 'bytes', Math.round(outBuf.length / 1024) + 'KB')