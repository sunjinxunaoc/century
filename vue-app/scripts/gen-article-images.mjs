import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import sharp from 'sharp'

const API = 'https://img.yunfei.best/v1/chat/completions'
const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const WW = 'public/images/products/Wheel Balancing Weights/'
const TV = 'public/images/products/tyre valves/'
const TS = 'public/images/products/tyre string/'
const TP = 'public/images/products/TYRE PATCH/'
const MP = 'public/images/products/Mushroom Patch Plug/'
const TM = 'public/images/products/tpms/'

// Shared style suffix: warm bright background matching site brand, photorealistic
const STYLE = ' Photorealistic professional product photography, hyper realistic, sharp industrial product shapes, no distortion, warm bright background with soft gradient from light cream to warm amber with a subtle orange brand accent glow #FF6B00, NOT black NOT dark navy, high-key studio lighting with soft shadows, clean composition, wide horizontal banner, 1920x640.'

const jobs = [
  {
    slug: 'clip-on-wheel-weights-guide',
    refs: [WW + 'FE--Clip-On-wheel-balancing-weight-For-Alloy-Rims-CTR-FE-01C.webp', WW + 'Pb-clip-on-wheel-weight-for-Truck-CTR-PB-03C.webp'],
    desc: 'An assortment of clip-on wheel balancing weights: hammered-steel clip-on weights with hooked lips for alloy rims and a heavier truck clip-on weight, several showing engraved weight markings like Fe 20 / Fe 45. Realistic stamped metal texture, lined up on a clean bright surface with shallow depth of field.',
  },
  {
    slug: 'clip-on-wheel-weight-profiles',
    refs: [WW + 'Fe clip on wheel weight for FN series car rims CTR-FE-02C.webp', WW + 'Fe clip on wheel weight for Alloy rims CTR-FE-04C.webp', WW + 'Fe-clip-on-wheel-weight-for-Steel-rims-CTR-FE-03C.webp'],
    desc: 'A row of clip-on wheel weights showing distinct clip profile shapes (different hook and lip profiles like FN, MC, EN styles), each with a different clip shape, engraved weight numbers, placed side by side so the profile differences are visible from a slightly elevated angle.',
  },
  {
    slug: 'clip-on-wheel-weights-durability',
    refs: [WW + 'FE--Clip-On-wheel-balancing-weight-For-Alloy-Rims-CTR-FE-01C.webp'],
    desc: 'A close-up of clip-on wheel balancing weights focusing on the zinc-plated coating surface and the metal clip hinge, some weights with a light rust-free shine, one showing a scratched coating for contrast, emphasizing coating quality and corrosion resistance.',
  },
  {
    slug: 'adhesive-stick-on-wheel-weights-guide',
    refs: ['C:/Users/86189/Desktop/粘贴式平衡块.jpg'],
    desc: 'A neat arrangement of self-adhesive wheel weight strips: flat segmented steel strips with blue adhesive tape backing visible on the back side of one strip, alternating 5g and 10g segments, several strips fanned on a clean bright surface, crisp product edges.',
  },
  {
    slug: 'stick-on-wheel-weights-fall-off',
    refs: ['C:/Users/86189/Desktop/粘贴式平衡块.jpg'],
    desc: 'A self-adhesive wheel weight strip being pressed onto the inner barrel of an alloy wheel rim with the blue tape liner half peeled, close-up of the adhesive bond, showing the correct mounting action, with a second strip lying beside on a clean surface.',
  },
  {
    slug: 'wheel-weight-tape-comparison',
    refs: ['C:/Users/86189/Desktop/粘贴式平衡块.jpg'],
    desc: 'Four adhesive wheel weight strips laid side by side, each showing a different adhesive tape color on the backing: red (3M style), blue (Norton style), blue generic, and white, clearly showing the liner colors so the tape types can be compared, strips flat and parallel.',
  },
  {
    slug: 'adhesive-wheel-weight-sizes',
    refs: ['C:/Users/86189/Desktop/粘贴式平衡块.jpg'],
    desc: 'Adhesive wheel weight strips in different sizes laid out like a size chart: short to long, 5g segments to 60g, measured appearance with a steel ruler next to them, neat grid-like layout on a clean bright surface.',
  },
  {
    slug: 'wheel-weight-manufacturers',
    refs: [WW + 'FE--Clip-On-wheel-balancing-weight-For-Alloy-Rims-CTR-FE-01C.webp', 'C:/Users/86189/Desktop/粘贴式平衡块.jpg'],
    desc: 'A factory-style wide shot: rows of cartons and bulk wheel weights (clip-on and adhesive strips) stacked on a warehouse bench, with a few individual clip-on weights and adhesive strips in the foreground, clean manufacturing atmosphere.',
  },
  {
    slug: 'wheel-weight-guide',
    refs: [WW + 'FE--Clip-On-wheel-balancing-weight-For-Alloy-Rims-CTR-FE-01C.webp', 'C:/Users/86189/Desktop/粘贴式平衡块.jpg'],
    desc: 'Two wheel weight types side by side for comparison: on the left hammered-steel clip-on wheel weights with hooked lips and engraved markings, on the right flat self-adhesive wheel weight strips with blue tape, arranged symmetrically on a clean bright surface, balanced composition.',
  },
  {
    slug: 'tyre-valve-guide',
    refs: [TV + '58ms-valve.webp', TV + 'tr413-tr414-valve-002.webp', TV + 'v3-20-4-v3-20-6-valve-stem002.webp', TV + 'tyre-valve-stem-Tr414-Tr412-Tr413-Tr415001.webp'],
    desc: 'An assortment of tyre valves: black rubber snap-in valves (TR413/TR414 style), brass clamp-in truck valves (V3-20-4/V3-20-6 style) and a metal 58MS bent bus valve, standing in a loose group on a clean bright surface, accurate realistic valve shapes.',
  },
  {
    slug: 'tpms-maintenance',
    refs: [TM + 'TPMS-1.webp', TM + 'TPMS-30.webp'],
    desc: 'TPMS valve stems with sensors: black snap-in TPMS valve stems with the small sensor body at the base, one stem upright and one lying beside it showing the valve core, on a clean bright workshop surface, realistic rubber and sensor shapes.',
  },
  {
    slug: 'tyre-patch-vs-plug',
    refs: [TP + 'radial-tire-patch.webp', MP + 'Mushroom-Tire-Repair-Patch-plug001.webp', TS + 'tire-seal-string001.webp'],
    desc: 'Three tyre repair products arranged for comparison: a round flat rubber tyre patch on the left, a black mushroom patch plug (rubber mushroom cap with stem) in the center, and a brown straight seal string on the right, all on a clean bright surface.',
  },
  {
    slug: 'seal-string-repair',
    refs: [TS + 'tire-seal-string001.webp', TS + 'tire-repair-strings-rubber-strips002.webp'],
    desc: 'Straight brown tyre repair seal strings (slender rubber sticks, laid parallel not coiled) next to a metal T-handle insertion tool and a rasp tool, on a clean bright surface, emergency repair kit feel.',
  },
  {
    slug: 'ordering-guide',
    refs: [],
    desc: 'A bright export-ready scene: neatly stacked product cartons and a small wooden pallet with a shipping crate, a shipping container texture in the blurred background, with a clipboard showing an order form in the foreground, clean warehouse logistics feel.',
  },
  {
    slug: 'us-vs-eu-style-tire-patch',
    refs: [TP + 'All-Purpose-Repair-Patch-Round-Patch.webp', TP + 'radial-tire-patch.webp', TP + 'EU-Style-bias-ply-tire-patch.webp'],
    desc: 'Two groups of tyre repair patches for comparison: on the left US-style round and square all-purpose patches, on the right EU-style rectangular radial patches with visible cord layers (ply), clearly separated into two piles on a clean bright surface.',
  },
  {
    slug: 'tr413-vs-tr414-tyre-valve',
    refs: [TV + 'tr413-tr414-valve-001.webp', TV + 'tr413-tr414-valve-002.webp'],
    desc: 'Two black rubber snap-in tyre valves (TR413 and TR414 style) standing upright side by side for direct comparison, showing their different stem lengths, with a small metal ruler at the base, on a clean bright surface.',
  },
  {
    slug: 'fe-vs-pb-wheel-weights',
    refs: [WW + 'Fe Adhensive Wheel Weight CTR-FE-01A.webp', WW + 'Pb-Adhensive-Wheel-Weight-CTR-PB-01A.webp'],
    desc: 'Steel and lead adhesive wheel weight strips side by side: a steel Fe strip (larger, lighter grey) on the left and a lead Pb strip (smaller, darker grey) on the right, showing the size difference for the same mass, with engraved weight markings visible.',
  },
  {
    slug: 'mushroom-plug-vs-seal-string',
    refs: [MP + 'Mushroom-Tire-Repair-Patch-plug001.webp', TS + 'tire-seal-string001.webp'],
    desc: 'A mushroom patch plug (black rubber mushroom cap with stem) on the left and a straight brown tyre seal string on the right, placed for direct comparison on a clean bright surface, both products realistic and clearly shaped.',
  },
]

const only = process.argv[2] // optional slug filter

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generate(job) {
  const refParts = job.refs.filter(existsSync).map(p => ({
    type: 'image_url',
    image_url: { url: `data:image/webp;base64,${readFileSync(p).toString('base64')}` },
  }))
  const isJpeg = job.refs.some(p => p.endsWith('.jpg'))
  // rebuild with correct mime per ref
  const parts = job.refs.filter(existsSync).map(p => ({
    type: 'image_url',
    image_url: { url: `data:image/${p.endsWith('.jpg') ? 'jpeg' : 'webp'};base64,${readFileSync(p).toString('base64')}` },
  }))

  const body = {
    model: 'gpt-image-2',
    messages: [{
      role: 'user',
      content: [...parts, { type: 'text', text: job.desc + STYLE }],
    }],
  }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) {
    console.error('[gen] HTTP', res.status, text.slice(0, 200))
    return false
  }
  let content = ''
  try { content = JSON.parse(text).choices?.[0]?.message?.content ?? '' } catch { content = text }
  const m = content.match(/!\[[^\]]*\]\(data:image\/[^;]+;base64,([^)]+)\)/)?.[1]
    || content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)/)?.[1]
  if (!m) { console.error('[gen] no image for', job.slug); return false }

  const buf = Buffer.from(m, 'base64')
  writeFileSync(`public/images/articles/${job.slug}-raw.png`, buf)
  await sharp(buf).resize(1600, 686, { fit: 'cover', position: 'attention' }).webp({ quality: 86 }).toFile(`public/images/articles/${job.slug}.webp`)
  const out = readFileSync(`public/images/articles/${job.slug}.webp`)
  console.log('[gen] OK', job.slug, Math.round(out.length / 1024) + 'KB')
  return true
}

import { mkdirSync } from 'node:fs'
mkdirSync('public/images/articles', { recursive: true })

const list = only ? jobs.filter(j => j.slug === only) : jobs
console.log(`[gen] generating ${list.length} images...`)
for (const j of list) {
  try { await generate(j) } catch (e) { console.error('[gen] error', j.slug, e.message) }
  await sleep(1500)
}
console.log('[gen] done')