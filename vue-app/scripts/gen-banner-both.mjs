import { writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

// Network: requests go through the local system proxy. Run with:
//   $env:HTTPS_PROXY='http://127.0.0.1:7892'; $env:HTTP_PROXY=$env:HTTPS_PROXY
//   node --use-env-proxy --env-file=.env scripts/gen-banner-both.mjs
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || ''
if (proxy) {
  console.log(`[banner:both] proxy: ${proxy}`)
  if (!process.execArgv.includes('--use-env-proxy')) {
    console.warn('[banner:both] HTTPS_PROXY is set but node was started without --use-env-proxy; fetch will go direct')
  }
} else {
  console.warn('[banner:both] no HTTPS_PROXY/HTTP_PROXY set; fetch will go direct')
}

// Draft output only. The shipped homepage banner is built by
// scripts/compose-home-hero-v2.py.
const OUT = 'public/images/hero-banner-warm-640-v2-ai-draft.webp'
const W = 1920
const H = 640
const MODELS = ['gpt-image-2', 'gpt-image-2.5']

// The Fe adhesive strip is NOT generated: AI models cannot reproduce its
// stamped lettering. The prompt reserves a blank back-left area; after this
// script finishes run:
//   python scripts/composite-banner-fe-strip.py
// to paste the real strip from the product-detail photo.

// Product-detail photos (real parts). The Fe adhesive strip is composited
// separately from its real photo so its stamped lettering stays exact.
const refs = [
  {
    path: 'public/images/products/Wheel Balancing Weights/Pb-Adhesive-Wheel-Weight-100Gx2-Block.webp',
    extract: { left: 40, top: 420, width: 1120, height: 190 },
  },
  {
    path: 'public/images/products/Wheel Balancing Weights/Fe-Clip-On-Wheel-Weight-Alloy-Wheel.webp',
    extract: { left: 30, top: 305, width: 1150, height: 360 },
  },
  {
    path: 'public/images/products/Wheel Balancing Weights/Pb-Clip-On-Wheel-Weight-Alloy-Wheel.webp',
    extract: { left: 40, top: 330, width: 1140, height: 350 },
  },
]

const prompt = `You are given three reference photographs of real products. Reproduce their shapes EXACTLY. These are real industrial parts, not stylized objects.

First reference: one Pb (lead) self-adhesive wheel weight block. It is TWO thick rectangular cast-lead slabs joined side by side into one block, with flat square faces and slightly rounded edges. The surface is matte, dull grey cast lead with a rough, slightly pitted texture - NOT shiny galvanized steel, NOT curved. Each slab is stamped "100g" with small triangle marks, and a thin black adhesive backing runs under the whole block. Do not add an "Fe" stamp, do not bend it, do not split it into more than two slabs.

Second reference: one Fe clip-on wheel balancing weight. It is a single solid curved steel bar, long and gently arched, with a concave lower edge and rounded ends. On top centre there is a FOLDED FLAT STEEL CLIP made of a flat sheet-steel strip folded into a squared staple-like bracket with a rectangular opening - flat and rectangular, never a cylinder, never a tube, never a hook. Two round rivets sit side by side on the front face, the number "40" is stamped on the left and "Fe" on the right. Do not change this silhouette or add hooks, loops or rollers.

Third reference: one Pb (lead) clip-on wheel balancing weight. It has the SAME curved-bar silhouette as the Fe clip-on - long, gently arched, concave lower edge, rounded ends, a folded flat staple-like steel clip on top, two round rivets on the face - but the body is cast lead: matte, dull grey, slightly rough and pitted, with NO "Fe" stamp. The face is stamped "40g" on both the left and right. Do not turn it into a cylinder or tube, do not add an "Fe" stamp.

Create a photorealistic wide website hero banner showing these three products on a warm cream-to-amber high-key studio surface. NEW LAYOUT - all products pulled toward the CENTRE of the frame, with generous empty space between them:
- The Pb lead block sits at about 40% of the frame width, in the lower part of the product band, slightly angled.
- ONE Fe clip-on weight sits at about 60% of the frame width, in the upper part of the product band.
- ONE Pb clip-on weight sits at about 80% of the frame width, in the lower part of the product band, clearly separated from the Fe clip-on.
- RESERVED BLANK AREA: the area from about 18% to 46% of the frame width, above the Pb block (the upper part of the product band), must be completely empty warm studio surface - no products, no shadows, no strip and no small parts. An Fe adhesive strip will be composited there later; do not draw any adhesive strip anywhere in the image.
- GAPS: leave at least 8% of the frame width between the reserved strip area and the Fe clip-on, at least 8% of the frame width between the Fe clip-on and the Pb clip-on, and at least 5% of the frame height between the Pb block and the reserved area. No products touching or overlapping.
The TOP 55% of the frame must be completely empty warm background - no products and no shadows there. Keep all products within the central 70% of the width (outer 15% empty on both sides), well away from the frame edges. Make each product large enough that the bright galvanized Fe and the matte dark cast lead are clearly distinguishable. Warm ivory/peach to coral and amber-orange (#FF6B00) background with golden highlights, soft studio light from the front-left, realistic soft contact shadows, shallow depth of field, hyper-real commercial product photography.

Do not redesign the products. Do not change their proportions, stampings or clip design. No wheels, hands, tools, packaging, extra text, logos or watermarks. 1920x640 ultra-wide composition.`

const refParts = await Promise.all(refs.map(async (ref) => {
  let img = sharp(ref.path).extract(ref.extract)
  if (ref.resize) img = img.resize({ width: ref.resize })
  const buf = await img.png().toBuffer()
  return {
    type: 'image_url',
    image_url: { url: `data:image/png;base64,${buf.toString('base64')}` },
  }
}))

function buildBody(model) {
  return {
    model,
    messages: [
      {
        role: 'user',
        content: [...refParts, { type: 'text', text: prompt }],
      },
    ],
  }
}

function extractImage(content) {
  if (Array.isArray(content)) {
    content = content.map((part) => (typeof part === 'string' ? part : part?.text ?? '')).join('\n')
  }
  if (typeof content !== 'string') return null
  return content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1]
    || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
    || null
}

async function requestImage(model) {
  console.log(`[banner:both] requesting ${model}...`)
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify(buildBody(model)),
    signal: AbortSignal.timeout(300000),
  })

  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 400)}`)

  let content
  try { content = JSON.parse(text).choices?.[0]?.message?.content ?? '' } catch { content = text }

  const b64 = extractImage(content)
  if (!b64) throw new Error(`no image in response: ${String(content).slice(0, 300)}`)
  return Buffer.from(b64, 'base64')
}

let buf = null
let usedModel = null
for (const model of MODELS) {
  try {
    buf = await requestImage(model)
    usedModel = model
    break
  } catch (err) {
    console.error(`[banner:both] ${model} failed: ${err.message}`)
  }
}
if (!buf || buf.length === 0) {
  console.error('[banner:both] could not generate an image; nothing was written')
  process.exit(1)
}

const rawPath = join(tmpdir(), `dsh-banner-balance-block-${Date.now()}.png`)
writeFileSync(rawPath, buf)
console.log('[banner:both] raw saved', rawPath, buf.length, 'bytes')

const srcMeta = await sharp(buf).metadata()
console.log(`[banner:both] source ${srcMeta.width}x${srcMeta.height} ${srcMeta.format} (${usedModel})`)

const webpBuf = await sharp(buf)
  .resize(W, H, { fit: 'cover', position: 'attention' })
  .webp({ quality: 90 })
  .toBuffer()

const outMeta = await sharp(webpBuf).metadata()
if (outMeta.width !== W || outMeta.height !== H) {
  console.error(`[banner:both] unexpected output size ${outMeta.width}x${outMeta.height}; aborting`)
  process.exit(1)
}

// Write the final buffer directly: rename/unlink of temp files under public/
// intermittently fails with EBUSY on Windows (AV/indexer holds the file).
writeFileSync(OUT, webpBuf)
const outBuf = readFileSync(OUT)
console.log(`[banner:both] saved ${OUT} ${outBuf.length} bytes ${Math.round(outBuf.length / 1024)}KB (${outMeta.format} ${outMeta.width}x${outMeta.height})`)
console.log('[banner:both] next: python scripts/composite-banner-fe-strip.py (paste the real Fe strip)')
