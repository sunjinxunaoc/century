// Generates the TR161 article cover (1600x686) and product image (1200x1200)
// via the Yunfei image API, using the real product photo as reference.
// Usage (from vue-app):  node --env-file=.env scripts/gen-tr161-images.mjs [cover|product]
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) {
  console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)')
  process.exit(1)
}

const REF = 'public/images/products/tyre-valves/tr161-valve-stem001.webp'
const LOGO = 'public/images/logo/logo-horizontal-transparent.png'

const PRODUCT_STYLE =
  ' Clean e-commerce product photography, pure bright white seamless background, single product centered with generous empty space, soft even studio lighting, subtle natural shadow under the product, hyper realistic true product shape with no distortion, sharp detail, professional catalog photo, square composition. Keep any markings or engraving that appear on the actual product exactly as they are. Do not add any text, letters, logos or watermarks.'

const COVER_STYLE =
  ' Photorealistic professional product photography, hyper realistic, accurate real product shapes with no distortion, sharp clean product edges, warm bright background with a soft gradient from light cream to warm amber and a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, wide horizontal banner. ABSOLUTELY NO logo, NO watermark, NO brand name, NO text, NO letters, NO numbers, NO labels, NO captions, NO text overlay anywhere - keep the surface completely clean and empty.'

const JOBS = [
  {
    name: 'cover',
    out: 'public/images/articles/tr161-valve-stem.webp',
    size: [1600, 686],
    prompt:
      'Use the attached reference image as the exact product to photograph. A photorealistic wide studio group shot of three chrome TR161 clamp-in tyre valve stems (short chrome hex-topped metal bolt-in valve stems with two chrome hex nuts, a metal washer and two thick black rubber grommets at the base). The three stems stand CLOSE TOGETHER as a tight centred cluster, occupying only the middle 45% of the frame width, leaving wide clean empty gradient background on the left and right and clear empty space above the caps and below the bases, so every stem is COMPLETE and uncropped - this is a wide product shot, NOT a close-up. Reproduce the exact parts, proportions, chrome finish and black rubber grommets of the reference.' +
      COVER_STYLE,
  },
  {
    name: 'product',
    out: 'public/images/products/tyre-valves/tr161-valve-stem001.webp',
    size: [1200, 1200],
    prompt:
      'Use the attached reference image as the exact product to photograph. A single chrome-plated metal TR161 / VAMD161 clamp-in (bolt-in) tyre valve stem standing upright and centred: short hex top with a hex cap, chrome hex nut, metal washer, and two thick black rubber sealing grommets at the base, plus the small chrome spigot below the grommets. Reproduce the exact part order, proportions and chrome finish of the reference.' +
      PRODUCT_STYLE,
    logo: true,
  },
]

const only = process.argv[2]
const list = only ? JOBS.filter((j) => j.name === only) : JOBS

async function gen(prompt) {
  const refB64 = readFileSync(REF).toString('base64')
  const body = {
    model: 'gpt-image-2',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/webp;base64,${refB64}` } },
          { type: 'text', text: prompt },
        ],
      },
    ],
  }
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  })
  const t = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${t.slice(0, 200)}`)
  let content = ''
  try {
    content = JSON.parse(t).choices?.[0]?.message?.content ?? ''
  } catch {
    content = t
  }
  const b64 =
    content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1] ||
    content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!b64) throw new Error('no image in response')
  return Buffer.from(b64, 'base64')
}

for (const job of list) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[tr161] ${job.name} (try ${attempt}) ...`)
      const img = await gen(job.prompt)
      const [w, h] = job.size
      let pipe = sharp(img).resize(w, h, { fit: 'cover', position: 'attention' })
      if (job.logo) {
        const logo = await sharp(LOGO).resize({ width: 400 }).png().toBuffer()
        pipe = pipe.composite([{ input: logo, gravity: 'southeast', blend: 'over' }])
      }
      await pipe.webp({ quality: job.logo ? 92 : 86 }).toFile(job.out)
      console.log('[tr161] OK', job.out, Math.round(readFileSync(job.out).length / 1024) + 'KB')
      break
    } catch (e) {
      console.error(`[tr161] fail try ${attempt}:`, e.message)
      if (attempt === 3) process.exitCode = 1
      else await new Promise((r) => setTimeout(r, 10000))
    }
  }
}
