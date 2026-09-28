import { writeFileSync, readFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const refs = [
  'public/images/products/tyre valves/58ms-valve.webp',
  'public/images/products/tyre valves/tr413-tr414-valve-002.webp',
  'public/images/products/tyre valves/v3-20-4-v3-20-6-valve-stem002.webp',
  'public/images/products/tyre valves/tyre-valve-stem-Tr414-Tr412-Tr413-Tr415001.webp',
]

const refParts = refs.map(p => ({
  type: 'image_url',
  image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` },
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
          text: `Using the attached 4 reference images as precise guides for realistic tyre valve shapes (58ms metal bus valve, TR413 TR414 rubber snap-in valves, V3-20-4 and V3-20-6 brass clamp-in truck valves, and the full TR412-TR415 rubber valve series display), create a photorealistic studio hero banner for a tyre repair products manufacturer website with a SMALLER/SHORTER composition ratio so it appears wider than before - not a deep banner. Layout: a tight low horizontal line of realistic tyre valves with short vertical footprint, approximately the bottom 30-40% of the frame: on the left, brass V3-20-4 clamp-in truck valve stems and a metal 58ms angle valve; in the center, black rubber snap-in valve stems TR413, TR414 and TR415; additional black rubber valve stems scattered lying flat at the base; shallow depth of field. Keep all products accurate to the references with no shape distortion. Background: clean warm bright surface matching brand aesthetics - soft warm amber gradient backdrop with orange accent #FF6B00 toward its core, NOT black, NOT dark navy. Empty bright light space at the top of frame for website headline text overlay. Shallow depth of field, soft studio key light, hyper realistic advertising quality, 1920x640 wide cinematic composition.`,
        },
      ],
    },
  ],
}

console.log('[banner:tyre-valve] requesting image...')

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
writeFileSync('public/images/hero-banner-tyre-valve-raw.png', buf)
console.log('[banner] saved raw PNG', buf.length, 'bytes')

await sharp(buf).resize(1920, 640, { fit: 'cover', position: 'attention' }).webp({ quality: 90 }).toFile('public/images/hero-banner-tyre-valve.webp')
const outBuf = readFileSync('public/images/hero-banner-tyre-valve.webp')
console.log('[banner] saved public/images/hero-banner-tyre-valve.webp', outBuf.length, 'bytes', Math.round(outBuf.length / 1024) + 'KB')