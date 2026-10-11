import sharp from 'sharp'
import fs from 'node:fs'

const KEY = process.env.YUNFEI_API_KEY
const ITEMS = [
  {
    name: 'choosing-a-tyre-valves-manufacturer',
    refs: [
      'public/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp',
      'public/images/products/tyre-valves/v3-20-6-clamp-in-valve001.webp',
    ],
    prompt: `The attached images are real reference photos of black rubber snap-in tyre valves and brass clamp-in tyre valves. Create a professional B2B blog cover image (wide 3:2 landscape) for an article about choosing a tyre valves manufacturer. Scene: a bright modern factory quality-control desk with brass and rubber tyre valves arranged neatly in the foreground next to a digital caliper and a clipboard with a checklist, blurred factory production line with CNC machines in the background. Preserve the real look of the valves from the references. Clean bright lighting, professional industrial photography, no people, no text, no letters, no logos, no watermarks.`,
  },
  {
    name: 'tubeless-tire-valves-wholesale-guide',
    refs: [
      'public/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp',
      'public/images/products/tyre-valves/tr413-snap-in-valve001.webp',
      'public/images/products/tyre-valves/tr600hp-snap-in-valve001.webp',
    ],
    prompt: `The attached images are real reference photos of black rubber snap-in tyre valves of different lengths. Create a professional B2B blog cover image (wide 3:2 landscape) for an article about tubeless tire valves wholesale. Scene: a warehouse table covered with hundreds of black rubber snap-in tyre valves in clear polybags and kraft export cartons, several loose valves standing upright in the foreground in sharp focus showing their real shape from the references, more stacked cartons and a forklift softly blurred in the background. Clean bright warehouse lighting, professional logistics photography, no people, no text, no letters, no logos, no watermarks.`,
  },
  {
    name: 'auto-tire-valve-stems-bulk',
    refs: [
      'public/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp',
      'public/images/products/tyre-valves/tr416-clamp-in-valve001.webp',
      'public/images/products/tyre-valves/9001-valve-core001.webp',
    ],
    prompt: `The attached images are real reference photos of rubber snap-in tyre valves, brass clamp-in valve stems and small brass valve cores. Create a professional B2B blog cover image (wide 3:2 landscape) for an article about buying auto tire valve stems in bulk. Scene: a large quantity of mixed tyre valve stems — black rubber snap-in valves and shiny brass clamp-in valves — filling the frame in an organized grid on a dark gray inspection bench, one valve being measured by a digital caliper in the foreground, small brass valve cores in a transparent tray beside it. Preserve the real look of the products from the references. Bright even studio lighting, sharp crisp detail, professional quality-inspection photography, no people, no text, no letters, no logos, no watermarks.`,
  },
  {
    name: 'find-reliable-auto-tire-valve-stems-supplier',
    refs: [
      'public/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp',
      'public/images/products/tyre-valves/tr571-clamp-in-valve001.webp',
    ],
    prompt: `The attached images are real reference photos of rubber snap-in tyre valves and a long brass truck clamp-in valve. Create a professional B2B blog cover image (wide 3:2 landscape) for an article about finding a reliable auto tire valve stems supplier. Scene: a bright export warehouse with stacked cartons on pallets ready for loading into a shipping container, a few rubber and brass tyre valves displayed upright on a wooden table in the sharp foreground, container doors and daylight visible in the blurred background. Preserve the real look of the valves from the references. Clean professional logistics photography, no people, no text, no letters, no logos, no watermarks.`,
  },
]

async function gen(prompt, refs) {
  const fd = new FormData()
  fd.append('model', 'gpt-image-2')
  for (const [i, r] of refs.entries()) {
    const buf = fs.readFileSync(r)
    fd.append('image', new Blob([buf], { type: 'image/webp' }), `ref${i}.webp`)
  }
  fd.append('prompt', prompt)
  fd.append('size', '1536x1024')
  const res = await fetch('https://img.yunfei.best/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: fd })
  const t = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${t.slice(0, 200)}`)
  const j = JSON.parse(t)
  if (j.data?.[0]?.b64_json) return Buffer.from(j.data[0].b64_json, 'base64')
  if (j.data?.[0]?.url) return Buffer.from(await (await fetch(j.data[0].url)).arrayBuffer())
  throw new Error('no image in response')
}

fs.mkdirSync('public/images/news', { recursive: true })
for (const it of ITEMS) {
  const out = `public/images/news/${it.name}.webp`
  if (fs.existsSync(out)) { console.log('skip', out); continue }
  console.log(`[news] ${it.name} ...`)
  const img = await gen(it.prompt, it.refs)
  await sharp(img).resize(1200, 630, { fit: 'cover', position: 'attention' }).webp({ quality: 88 }).toFile(out)
  console.log('OK', out)
}
console.log('done')
