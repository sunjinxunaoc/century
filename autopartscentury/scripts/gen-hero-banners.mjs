import sharp from 'sharp'
import fs from 'node:fs'

const KEY = process.env.YUNFEI_API_KEY
const BANNERS = [
  {
    name: 'hero-banner-valve-family',
    refs: [
      'public/images/products/tyre-valves/tr414-snap-in-tubeless-valve001.webp',
      'public/images/products/tyre-valves/tr418-snap-in-valve001.webp',
      'public/images/products/tyre-valves/tr416-clamp-in-valve001.webp',
      'public/images/products/tyre-valves/vc-8r-valve-cap001.webp',
      'public/images/products/tyre-valves/vc-8g-valve-cap001.webp',
    ],
    prompt: `The attached images are real reference photos of our products: black rubber snap-in tyre valves, brass clamp-in valve stems and colored plastic valve caps (red and green). Create a premium wide website hero banner for a tyre valve manufacturer. Composition: a rich, carefully arranged product family group of MANY different tyre valve products (about ten pieces: several black rubber snap-in valves standing upright in a row, several brass metal clamp-in valves lying at angles, and colored red/green/black plastic valve caps) occupying the right two-thirds of the frame. Products are photographed from a slightly farther distance so every single product is FULLY visible with its complete outline and silhouette clearly readable, with generous spacing between products and nothing cut off or cropped. Preserve the real materials and shapes from the reference photos: black rubber, polished brass, chrome, red and green plastic. No valve extension tubes in this scene. Background: dark charcoal industrial studio backdrop with a soft gradient from deep black on the left to faintly lighter graphite on the right, subtle soft spotlights from the upper right illuminating the products with gentle rim highlights and soft shadows. The left third of the banner must stay clean and empty (only the dark gradient) for website text overlay. All products positioned within the vertical middle band of the frame with some dark breathing space above and below. Hyper realistic, sharp crisp detail, professional industrial catalog photography, wide panoramic banner composition. Do not add any text, letters, logos or watermarks.`,
  },
  {
    name: 'hero-banner-heavy-duty',
    refs: [
      'public/images/products/tyre-valves/v3-20-6-clamp-in-valve001.webp',
      'public/images/products/tyre-valves/tr571-clamp-in-valve001.webp',
      'public/images/products/tyre-valves/trj650-03-valve001.webp',
      'public/images/products/tyre-valves/tr1075a-screw-on-valve001.webp',
    ],
    prompt: `The attached images are real reference photos of our products: brass truck clamp-in valve stems, a large-bore swivel tractor valve and a screw-on universal valve with steel plate base. Create a premium wide website hero banner for a heavy-duty tyre valve manufacturer. Composition: a rich lineup of MANY heavy-duty brass tyre valve products (about ten pieces: long straight brass clamp-in truck valves of different lengths standing upright, bent brass valves, a large-bore swivel valve, and screw-on valves with steel hexagonal plate bases) occupying the right two-thirds of the frame. Products are photographed from a slightly farther distance so every single product is FULLY visible with its complete outline and silhouette clearly readable, with generous spacing between products and nothing cut off or cropped. Preserve the real materials and shapes from the reference photos: polished brass, nickel silver, zinc-plated steel plate bases. No valve extension tubes in this scene. Background: dark charcoal industrial workshop backdrop with a gradient from deep black on the left to faintly lighter graphite on the right, dramatic soft spotlights from the upper right creating warm golden highlights along the brass bodies and soft shadows. The left third of the banner must stay clean and empty (only the dark gradient) for website text overlay. All products positioned within the vertical middle band of the frame with dark breathing space above and below. Hyper realistic, sharp crisp detail, professional industrial catalog photography, wide panoramic banner composition. Do not add any text, letters, logos or watermarks.`,
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

for (const b of BANNERS) {
  const out = `public/images/${b.name}.webp`
  if (fs.existsSync(out)) { console.log('skip', out); continue }
  console.log(`[hero] ${b.name} ...`)
  const img = await gen(b.prompt, b.refs)
  await sharp(img)
    .resize(1920, 640, { fit: 'cover', position: 'centre' })
    .webp({ quality: 90 })
    .toFile(out)
  console.log('OK', out)
}
console.log('done')
