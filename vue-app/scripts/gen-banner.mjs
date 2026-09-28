import { writeFileSync, readFileSync } from 'node:fs'
import { parse } from 'node:path'
import sharp from 'sharp'

import { bannerPrompt, bannerPromptMobile, getBannerVariantPrompt } from './gen-banner-prompt.js'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const mode = process.argv[2] // 'mobile' | 'desktop' | 'v1' | 'v2' | 'v3'

let prompt
let OUT
let RAW
let SIZE
if (mode === 'mobile') {
  prompt = bannerPromptMobile
  OUT = 'public/images/hero-banner-mobile.webp'
  RAW = 'public/images/hero-banner-mobile-raw.png'
  SIZE = { w: 800, h: 1200 }
} else if (mode && /^v[1-3]$/.test(mode)) {
  prompt = getBannerVariantPrompt(Number(mode.replace('v', '')))
  OUT = `public/images/hero-banner-${mode}.webp`
  RAW = `public/images/hero-banner-${mode}-raw.png`
  SIZE = { w: 1920, h: 800 }
} else {
  prompt = bannerPrompt
  OUT = 'public/images/hero-banner.webp'
  RAW = 'public/images/hero-banner-raw.png'
  SIZE = { w: 1920, h: 800 }
}

console.log(`[banner:${mode || 'desktop'}] requesting image...`)

const body = {
  model: 'gpt-image-2',
  messages: [{ role: 'user', content: prompt }],
}

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
  console.error('[banner] HTTP', res.status, text.slice(0, 400))
  process.exit(1)
}

let content = ''
try {
  content = JSON.parse(text).choices?.[0]?.message?.content ?? ''
} catch (e) {
  content = text
}

const m = content.match(/!\[image\]\(data:image\/[^;]+;base64,([^)]+)\)/)
if (!m) {
  const asData = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)
  if (asData) await saveBase64(asData[1])
  else {
    console.error('[banner] no image in response:', content.slice(0, 300))
    process.exit(1)
  }
} else {
  await saveBase64(m[1])
}

async function saveBase64(b64) {
  const buf = Buffer.from(b64, 'base64')
  writeFileSync(RAW, buf)
  console.log('[banner] saved raw PNG', buf.length, 'bytes')

  await sharp(buf)
    .resize(SIZE.w, SIZE.h, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toFile(OUT)
  const outBuf = readFileSync(OUT)
  console.log('[banner] saved', OUT, outBuf.length, 'bytes', Math.round(outBuf.length / 1024) + 'KB')
}