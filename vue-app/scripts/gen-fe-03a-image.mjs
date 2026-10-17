// Generate "Fe with Rounded Corners and Galvanized" adhesive wheel weight
// product images from customer reference screenshots.
// Method follows autopartscentury/scripts/gen-ecom-batch.mjs: gpt-image-2
// edits endpoint with a reference photo + e-commerce hero-shot prompt,
// then sharp composites the Century logo at the bottom-right corner.
// Run: node --env-file=.env scripts/gen-fe-03a-image.mjs
import { readFileSync, existsSync } from 'node:fs'
import sharp from 'sharp'

const KEY = process.env.YUNFEI_API_KEY
if (!KEY) { console.error('YUNFEI_API_KEY required (run with: node --env-file=.env <script>)'); process.exit(1) }

const LOGO = 'public/images/logo/logo-horizontal-transparent.png'
const OUT_DIR = 'public/images/products/Wheel Balancing Weights'

const STYLE = `Ignore and remove any noise, blur or background from the reference - photograph the strip only. Premium e-commerce hero shot: the single strip lying flat horizontally, centered, filling about 80% of the frame width, front face fully visible. Pure white seamless background with a very subtle light-gray gradient toward the bottom. Soft directional studio lighting from the upper left, gentle highlight on the metal surface and a soft shadow beneath the strip, plus a faint realistic mirror reflection of the strip on the glossy white surface below it. Hyper realistic true product shape with no distortion, sharp crisp detail, professional catalog photography, square composition. Do not add any other text, letters, logos or watermarks.`

const NEW_JOBS = [
  {
    ref: 'raw/roll-galv-spool-ref.webp',
    out: 'Fe-Adhesive-Wheel-Weight-Roll-Galvanized-Wide-Edge-5Gx1200.webp',
    prompt: `Keep this image EXACTLY as it is - same composition, black plastic spool reel, strip layout, blue tape, silver galvanized segments, white background, reflection and shadows. Change ONLY the stamped marking text on the segments: the marking currently reads "Fe 5g" and it must become exactly "Fe 5" - the letters "Fe" followed by the number "5" ONLY, delete the small "g" suffix completely. Keep the double marking on every segment (one near the top edge upside down, one near the bottom edge upright) with the same font, size and engraved style. Do not change anything else. Do not add any other text, letters, logos or watermarks.`,
  },
  {
    ref: 'raw/roll-coated-spool-ref.webp',
    out: 'Fe-Adhesive-Wheel-Weight-Roll-Coated-Wide-Edge-5Gx1000.webp',
    prompt: `Keep this image EXACTLY as it is - same composition, black plastic spool reel, strip layout, blue tape, matte gray coated segments, white background, reflection and shadows. Change ONLY the stamped marking text on the segments: the marking currently reads "Fe 5g" and it must become exactly "Fe 5" - the letters "Fe" followed by the number "5" ONLY, delete the small "g" suffix completely. Keep the double marking on every segment (one near the top edge upside down, one near the bottom edge upright) with the same font, size and engraved style. Do not change anything else. Do not add any other text, letters, logos or watermarks.`,
  },
  {
    ref: 'raw/pb-original-color-ref.png',
    out: 'Pb-Adhesive-Wheel-Weight-Original-Color.webp',
    prompt: `The attached image is the exact product to photograph: a single Pb (lead) adhesive wheel balancing weight strip - "Pb Original Color". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 cast lead segments, natural bare lead gray color with a slightly textured cast surface - NOT shiny, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). Marking detail: each segment carries one large embossed numeral with a small "g" - "10 g" on the four 10g segments and "5 g" on the four 5g segments, crisp raised letters. ${STYLE}`,
  },
  {
    ref: 'raw/pb-black-coating-ref.png',
    out: 'Pb-Adhesive-Wheel-Weight-Black-Coating.webp',
    prompt: `The attached image is the exact product to photograph: a single Pb (lead) adhesive wheel balancing weight strip - "Pb with Black Coating". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 segments with ROUNDED corners, matte BLACK coated (black epoxy powder coated) lead surface - a flat uniform deep black finish, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). Marking detail: each segment carries one large embossed numeral with a small "g" - "10 g" on the four 10g segments and "5 g" on the four 5g segments, crisp raised letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-right-angle-1-4oz-textfix-ref.webp',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Galvanized-1-4oz-x-12.webp',
    prompt: `Keep this image EXACTLY as it is - same 12-segment strip, sharp right-angle corners, silver galvanized surface, white background, reflection and shadows. Change ONLY the stamped marking text on the segments: the marking must read exactly "1/4OZ Fe" - the fraction "1/4" immediately followed by "OZ" with no space, then a space, then "Fe" - for example "1/4OZ Fe". Every segment carries this complete "1/4OZ Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright - with the same font, size and engraved style, identical on all 12 segments. Do not change anything else. Do not add any other text, letters, logos or watermarks.`,
  },
  {
    ref: 'raw/fe-right-angle-galvanized-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Galvanized.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Right-Angle Galvanized". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 rectangular segments with SHARP square right-angle corners - NOT rounded, SILVER galvanized zinc-plated steel surface, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). CRITICAL marking detail: each segment carries its stamped marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 10" or "Fe 5" reads correctly from both directions. Reproduce these double stamped markings exactly: "Fe 10" on the four 10g segments and "Fe 5" on the four 5g segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-right-angle-galvanized-5gx12-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Galvanized-5Gx12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Right-Angle Galvanized", 5g x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with SHARP square right-angle corners - NOT rounded, SILVER galvanized zinc-plated steel surface, every segment weighing 5g (12 x 5g = 60g total). CRITICAL marking detail: every segment carries its stamped "Fe 5" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 5" reads correctly from both directions. Reproduce these double stamped "Fe 5" markings exactly on all 12 segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-right-angle-gray-coating-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Gray-Coating.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Right Angle Gray Coating". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 rectangular segments with SHARP square right-angle corners - NOT rounded, matte GRAY coated (epoxy powder coated) steel surface - a flat uniform gray finish, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). CRITICAL marking detail: each segment carries its stamped marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 10" or "Fe 5" reads correctly from both directions. Reproduce these double stamped markings exactly: "Fe 10" on the four 10g segments and "Fe 5" on the four 5g segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-right-angle-gray-coating-5gx12-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Gray-Coating-5Gx12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Right Angle Gray Coating", 5g x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with SHARP square right-angle corners - NOT rounded, matte GRAY coated (epoxy powder coated) steel surface - a flat uniform gray finish, every segment weighing 5g (12 x 5g = 60g total). CRITICAL marking detail: every segment carries its stamped "Fe 5" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 5" reads correctly from both directions. Reproduce these double stamped "Fe 5" markings exactly on all 12 segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-right-angle-black-coating-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Black-Coating.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Right-Angle Black Coating". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 rectangular segments with SHARP square right-angle corners - NOT rounded, matte BLACK coated (black epoxy powder coated) steel surface - a flat uniform deep black finish, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). CRITICAL marking detail: each segment carries its stamped marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 10" or "Fe 5" reads correctly from both directions. Reproduce these double stamped markings exactly: "Fe 10" on the four 10g segments and "Fe 5" on the four 5g segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-right-angle-black-coating-5gx12-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Black-Coating-5Gx12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Right-Angle Black Coating", 5g x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with SHARP square right-angle corners - NOT rounded, matte BLACK coated (black epoxy powder coated) steel surface - a flat uniform deep black finish, every segment weighing 5g (12 x 5g = 60g total). CRITICAL marking detail: every segment carries its stamped "Fe 5" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 5" reads correctly from both directions. Reproduce these double stamped "Fe 5" markings exactly on all 12 segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-dacromet-right-angle-25gx8-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Dacromet-25Gx8.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Dacromet Right Angle", 25g x 8 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 identical rectangular segments with SHARP square right-angle corners - NOT rounded, matte GRAY Dacromet (zinc-aluminum flake) coated steel surface - a flat uniform matte gray finish (NOT shiny silver, NOT black), every segment weighing 25g (8 x 25g = 200g total). CRITICAL marking detail: every segment carries its stamped "Fe 25" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 25" reads correctly from both directions. Reproduce these double stamped "Fe 25" markings exactly on all 8 segments, crisp engraved letters. ${STYLE}`,
  },
]

const JOBS = [
  {
    ref: 'raw/fe-rounded-galvanized-ref2.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe with Rounded Corners and Galvanized". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). CRITICAL marking detail: each segment carries its stamped marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 10" or "Fe 5" reads correctly from both directions. Reproduce these double stamped markings exactly: "Fe 10" on the four 10g segments and "Fe 5" on the four 5g segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-gray-coating-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Gray-Coating.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe with Rounded Corners and Gray Coating". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 rectangular segments with ROUNDED corners, matte GRAY coated (epoxy powder coated) steel surface - NOT shiny silver, a flat uniform gray finish, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). CRITICAL marking detail: each segment carries its stamped marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 10" or "Fe 5" reads correctly from both directions. Reproduce these double stamped markings exactly: "Fe 10" on the four 10g segments and "Fe 5" on the four 5g segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-gray-coating-5gx12-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Gray-Coating-5Gx12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe with Rounded Corners and Gray Coating", 5g x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with ROUNDED corners, matte GRAY coated (epoxy powder coated) steel surface - NOT shiny silver, a flat uniform gray finish, every segment weighing 5g (12 x 5g = 60g total). CRITICAL marking detail: every segment carries its stamped "Fe 5" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 5" reads correctly from both directions. Reproduce these double stamped "Fe 5" markings exactly on all 12 segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-black-coating-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Black-Coating.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe with Rounded Corners and Black Coating". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 8 rectangular segments with ROUNDED corners, matte BLACK coated (black epoxy powder coated) steel surface - a flat uniform deep black finish, segments alternating 10g and 5g (four 10g + four 5g segments, 60g total). CRITICAL marking detail: each segment carries its stamped marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 10" or "Fe 5" reads correctly from both directions. Reproduce these double stamped markings exactly: "Fe 10" on the four 10g segments and "Fe 5" on the four 5g segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-black-coating-5gx12-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Black-Coating-5Gx12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe with Rounded Corners and Black Coating", 5g x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with ROUNDED corners, matte BLACK coated (black epoxy powder coated) steel surface - a flat uniform deep black finish, every segment weighing 5g (12 x 5g = 60g total). CRITICAL marking detail: every segment carries its stamped "Fe 5" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 5" reads correctly from both directions. Reproduce these double stamped "Fe 5" markings exactly on all 12 segments, crisp engraved letters. ${STYLE}`,
  },
  {
    ref: 'raw/fe-5gx12-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-5Gx12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe with Rounded Corners and Galvanized", 5g x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, every segment weighing 5g (12 x 5g = 60g total). CRITICAL marking detail: every segment carries its stamped "Fe 5" marking TWICE - once near the TOP edge and once near the BOTTOM edge, the top one upside-down and the bottom one upright, so "Fe 5" reads correctly from both directions. Reproduce these double stamped "Fe 5" markings exactly on all 12 segments, crisp engraved letters. ${STYLE}`,
  },
]

async function gen(refPath, prompt, extraRefs = []) {
  const fd = new FormData()
  fd.append('model', 'gpt-image-2')
  const refs = [refPath, ...extraRefs]
  for (const [i, r] of refs.entries()) {
    const ext = r.endsWith('.webp') ? 'webp' : 'png'
    fd.append('image', new Blob([readFileSync(r)], { type: ext === 'webp' ? 'image/webp' : 'image/png' }), `ref${i}.${ext}`)
  }
  fd.append('prompt', prompt)
  fd.append('size', '1024x1024')
  const res = await fetch('https://img.yunfei.best/v1/images/edits', { method: 'POST', headers: { 'Authorization': `Bearer ${KEY}` }, body: fd })
  const t = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${t.slice(0, 200)}`)
  const j = JSON.parse(t)
  if (j.data?.[0]?.b64_json) return Buffer.from(j.data[0].b64_json, 'base64')
  if (j.data?.[0]?.url) return Buffer.from(await (await fetch(j.data[0].url)).arrayBuffer())
  throw new Error('no image in response')
}

const OZ_JOBS = [
  {
    ref: 'raw/fe-ra-gray-1-4oz-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Right-Angle-Gray-Coating-1-4oz-x-12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe right angle gray coating", 1/4oz x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with SHARP square right-angle corners - NOT rounded, matte GRAY coated (epoxy powder coated) steel surface - a flat uniform gray finish, every segment weighing 1/4 oz (12 x 1/4oz = 3oz total). CRITICAL marking detail: ALL 12 segments must show the COMPLETE marking "1/4OZ Fe" (fraction "1/4" immediately followed by "OZ", then a space, then "Fe"), no segment may omit the "1/4" or the "Fe". Each segment carries the full "1/4OZ Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
  {
    ref: 'raw/fe-round-galv-1-4oz-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-1-4oz-x-12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe Galvanized Round Corner", 1/4oz x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, every segment weighing 1/4 oz (12 x 1/4oz = 3oz total). CRITICAL marking detail: ALL 12 segments must show the COMPLETE marking "1/4OZ Fe" (fraction "1/4" immediately followed by "OZ", then a space, then "Fe"), no segment may omit the "1/4" or the "Fe". Each segment carries the full "1/4OZ Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
  {
    ref: 'raw/fe-round-gray-1-4oz-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Gray-Coating-1-4oz-x-12.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe with rounded corners and gray coating", 1/4oz x 12 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 12 identical rectangular segments with ROUNDED corners, matte GRAY coated (epoxy powder coated) steel surface - a flat uniform gray finish, every segment weighing 1/4 oz (12 x 1/4oz = 3oz total). CRITICAL marking detail: ALL 12 segments must show the COMPLETE marking "1/4OZ Fe" (fraction "1/4" immediately followed by "OZ", then a space, then "Fe"), no segment may omit the "1/4" or the "Fe". Each segment carries the full "1/4OZ Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
  {
    ref: 'raw/fe-round-galv-1-2ozx6-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-1-2oz-x-6.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe Galvanized Round Corner", 1/2oz x 6 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 6 identical wider rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, every segment weighing 1/2 oz (6 x 1/2oz = 3oz total). CRITICAL marking detail: ALL 6 segments must show the COMPLETE marking "1/2OZ Fe" (fraction "1/2" immediately followed by "OZ", then a space, then "Fe"), no segment may omit the "1/2" or the "Fe". Each segment carries the full "1/2OZ Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
  {
    ref: 'raw/fe-round-gray-1-2ozx6-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Gray-Coating-1-2oz-x-6.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe with rounded corners and gray coating", 1/2oz x 6 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 6 identical wider rectangular segments with ROUNDED corners, matte GRAY coated (epoxy powder coated) steel surface - a flat uniform gray finish, every segment weighing 1/2 oz (6 x 1/2oz = 3oz total). CRITICAL marking detail: ALL 6 segments must show the COMPLETE marking "1/2OZ Fe" (fraction "1/2" immediately followed by "OZ", then a space, then "Fe"), no segment may omit the "1/2" or the "Fe". Each segment carries the full "1/2OZ Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
  {
    ref: 'raw/fe-round-galv-1ozx6-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-1oz-x-6.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe Galvanized Round Corner", 1oz x 6 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 6 identical wide rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, every segment weighing 1 oz (6 x 1oz = 6oz total). CRITICAL marking detail: ALL 6 segments must show the COMPLETE marking "1OZ 28Fe" (the number "1" immediately followed by "OZ", then a space, then "28Fe"), no segment may omit any part. Each segment carries the full "1OZ 28Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
  {
    ref: 'raw/fe-round-gray-1ozx6-ref.png',
    out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Gray-Coating-1oz-x-6.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip in the OZ series - "Fe with rounded corners and gray coating", 1oz x 6 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 6 identical wide rectangular segments with ROUNDED corners, matte GRAY coated (epoxy powder coated) steel surface - a flat uniform gray finish, every segment weighing 1 oz (6 x 1oz = 6oz total). CRITICAL marking detail: ALL 6 segments must show the COMPLETE marking "1OZ 28Fe" (the number "1" immediately followed by "OZ", then a space, then "28Fe"), no segment may omit any part. Each segment carries the full "1OZ 28Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`,
  },
]

const MARK = (wt, n) => `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Galvanized Round Corner", ${wt}g x ${n} version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of ${n} identical wide rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, every segment weighing ${wt}g. CRITICAL marking detail: every segment must show the COMPLETE marking "${wt} Fe" (the number "${wt}" then a space then "Fe"), no segment may omit any character. Each segment carries the full "${wt} Fe" marking TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}`

const G_JOBS = [
  { ref: 'raw/fe-round-galv-15gx6-ref.png', out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-15Gx6.webp',
    prompt: `The attached image is the exact product to photograph: a single Fe (steel) adhesive wheel balancing weight strip - "Fe Galvanized Round Corner", 15g x 6 version. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 6 identical wide rectangular segments with ROUNDED corners, SILVER galvanized zinc-plated steel surface, every segment weighing 15g. CRITICAL marking detail: every segment must show the COMPLETE marking "15" (the number only, no other letters) TWICE - once near the TOP edge rotated 180 degrees (upside-down) and once near the BOTTOM edge upright, all characters present. Crisp engraved letters, identical on every segment. ${STYLE}` },
  { ref: 'raw/fe-round-galv-20gx5-ref.png', out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-20Gx5.webp', prompt: MARK(20, 5) },
  { ref: 'raw/fe-round-galv-25gx4-ref.png', out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-25Gx4.webp', prompt: MARK(25, 4) },
  { ref: 'raw/fe-round-galv-30gx3-ref.png', out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-30Gx3.webp', prompt: MARK(30, 3) },
  { ref: 'raw/fe-round-galv-50gx3-ref.png', out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-50Gx3.webp', prompt: MARK(50, 3) },
  { ref: 'raw/fe-round-galv-100gx2-ref.png', out: 'Fe-Adhesive-Wheel-Weight-Rounded-Corners-Galvanized-100Gx2.webp', prompt: MARK(100, 2) },
]

const PB_G_JOBS = [
  { ref: 'raw/pb-50gx4-ref.png', out: 'Pb-Adhesive-Wheel-Weight-50Gx4.webp',
    prompt: `The attached image is the exact product to photograph: a single Pb (lead) adhesive wheel balancing weight strip - "Pb 50g x 4". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 4 identical rectangular segments of natural bare cast lead - dull medium gray with a slightly rough cast surface, NOT shiny, NOT galvanized steel. Each of the 4 segments carries ONE single centered stamped marking "50g" - the number "50" immediately followed by a lowercase letter "g" (for example "50g"), crisp embossed letters, identical on all 4 segments. Do not add any other characters or markings. ${STYLE}` },
  { ref: 'raw/pb-100gx2-ref.png', out: 'Pb-Adhesive-Wheel-Weight-100Gx2.webp',
    prompt: `The attached image is the exact product to photograph: a single Pb (lead) adhesive wheel balancing weight strip - "Pb 100g x 2". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a straight horizontal strip of 2 identical wide rectangular segments of natural bare cast lead - dull medium gray with a slightly rough cast surface, NOT shiny, NOT galvanized steel. Each of the 2 segments carries ONE single centered stamped marking "100g" - the number "100" immediately followed by a lowercase letter "g" (for example "100g"), crisp embossed letters, identical on both segments. Do not add any other characters or markings. ${STYLE}` },
]

const PB_CURVED_JOBS = [
  { ref: 'raw/pb-50g-curved-ref.png', out: 'Pb-Adhesive-Wheel-Weight-50G-Curved.webp',
    prompt: `The attached image is the exact product to photograph: a single Pb (lead) adhesive wheel balancing weight - "Pb 50g Curved", ONE thick segment. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: one thick cast lead block with a gently curved (banana-like) profile so it hugs the wheel rim, natural bare cast lead - dull medium gray with a slightly rough cast surface, NOT shiny, NOT galvanized steel. It carries ONE single centered stamped marking "50g" - the number "50" immediately followed by a lowercase letter "g", crisp embossed letters. Do not add any other characters or markings. ${STYLE}` },
  { ref: 'raw/pb-100gx2-curved-ref.png', out: 'Pb-Adhesive-Wheel-Weight-100Gx2-Curved.webp',
    prompt: `The attached image is the exact product to photograph: a single Pb (lead) adhesive wheel balancing weight strip - "Pb 100g x 2 Curved". Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference: a horizontal strip of 2 identical wide segments, each with a distinct ARC / curved profile (curved so it follows the wheel rim), natural bare cast lead - dull medium gray with a slightly rough cast surface, NOT shiny, NOT galvanized steel. Each of the 2 segments carries ONE single centered stamped marking "100g" - the number "100" immediately followed by a lowercase letter "g", crisp embossed letters, identical on both segments. Do not add any other characters or markings. Premium e-commerce hero shot: the single strip lying flat horizontally, centered, filling about 80% of the frame width, front face fully visible. Pure white seamless background with a very subtle light-gray gradient toward the bottom. Soft directional studio lighting from the upper left, gentle highlight on the metal surface and a soft shadow beneath the strip, plus a faint realistic mirror reflection of the strip on the glossy white surface below it. Hyper realistic true product shape with no distortion, sharp crisp detail, professional catalog photography, square composition. Do not add any other text, letters, logos or watermarks.` },
]

const PB_BATCH3_JOBS = [
  { ref: 'raw/pb-50gx4-block-ref.png', out: 'Pb-Adhesive-Wheel-Weight-50Gx4-Block.webp',
    prompt: `The attached image shows ONE segment of this product as a reference. Photograph the FULL product: a "Pb 50g x 4" lead adhesive wheel balancing weight - a straight horizontal strip of 4 identical square cast-lead segments sitting on a dark adhesive tape base, natural bare cast lead - dull medium gray with a slightly rough cast surface, NOT shiny, NOT galvanized steel. Marking detail on EACH segment: the text "50g" (the number "50" immediately followed by a lowercase letter "g") is stamped TWICE - once near the TOP-LEFT corner UPRIGHT and once near the BOTTOM-RIGHT corner ROTATED 180 DEGREES (upside-down). In addition, each segment carries two small triangular orientation marks - a small upward-pointing triangle near the top edge and a small downward-pointing triangle near the bottom edge, placed between the two "50g" markings. Crisp embossed letters, identical on all 4 segments. ${STYLE}` },
  { ref: 'raw/pb-100gx2-block-ref.png', out: 'Pb-Adhesive-Wheel-Weight-100Gx2-Block.webp',
    prompt: `The attached image shows ONE segment of this product as a reference. Photograph the FULL product: a "Pb 100g x 2" lead adhesive wheel balancing weight - a straight horizontal strip of 2 identical wide rectangular cast-lead segments sitting on a dark adhesive tape base, natural bare cast lead - dull medium gray with a slightly rough cast surface, NOT shiny, NOT galvanized steel. Marking detail on EACH segment: the text "100g" (the number "100" immediately followed by a lowercase letter "g") is stamped TWICE - once near the TOP-LEFT corner UPRIGHT and once near the BOTTOM-RIGHT corner ROTATED 180 DEGREES (upside-down). In addition, each segment carries two small triangular orientation marks - a small upward-pointing triangle near the top edge and a small downward-pointing triangle near the bottom edge, placed between the two "100g" markings. Crisp embossed letters, identical on both segments. ${STYLE}` },
  { ref: 'raw/pb-25gx4-strip-ref.png', out: 'Pb-Adhesive-Wheel-Weight-25Gx4-Strip.webp',
    prompt: `The attached image is the exact product to photograph: a "Pb 25g x 4" lead adhesive wheel balancing weight - a straight horizontal strip of 4 identical flat rectangular cast-lead segments on a dark adhesive tape base, natural bare cast lead - dull medium gray, NOT shiny, NOT galvanized steel. Marking detail on EACH segment: the number "25" is stamped once near the LOWER-LEFT corner UPRIGHT, and there is a small additional stamp near the UPPER-RIGHT corner (a small lowercase "h"-like mark), exactly as shown in the reference. Crisp embossed letters, identical on all 4 segments. ${STYLE}` },
  { ref: 'raw/pb-50gx4-strip-ref.png', out: 'Pb-Adhesive-Wheel-Weight-50Gx4-Strip.webp',
    prompt: `The attached image is the exact product to photograph: a "Pb 50g x 4" lead adhesive wheel balancing weight - a straight horizontal strip of 4 identical flat rectangular cast-lead segments on a dark adhesive tape base, natural bare cast lead - dull medium gray, NOT shiny, NOT galvanized steel. Marking detail on EACH segment: the number "50" is stamped once near the LOWER-LEFT corner UPRIGHT, and there is a small additional stamp near the UPPER-RIGHT corner (a small lowercase "h"-like mark), exactly as shown in the reference. Crisp embossed letters, identical on all 4 segments. ${STYLE}` },
]

const TAPE_BASE = (desc) => `The attached image is the exact product to photograph: a single piece of adhesive tape used as the backing for adhesive wheel balancing weights - a flat rectangular sheet of smooth matte adhesive tape. Strictly preserve its real proportions and flat rectangular shape exactly as shown in the reference. Appearance: ${desc} Do not add anything that is not in the reference. ${STYLE}`

const TAPE_JOBS = [
  { ref: 'raw/tape-blue-ref.png', out: 'Adhesive-Tape-Blue.webp',
    prompt: TAPE_BASE(`a solid uniform bright BLUE tape surface that exactly matches the blue shown in the reference, with NO printed text, logos or patterns - completely plain blue.`) },
  { ref: 'raw/tape-3m-ref.png', out: 'Adhesive-Tape-3M.webp',
    prompt: TAPE_BASE(`a solid RED / crimson tape surface that exactly matches the red shown in the reference, printed with the "3M" logo repeated, exactly as shown in the reference (keep the 3M wordmark markings and their positions).`) },
  { ref: 'raw/tape-white-ref.png', out: 'Adhesive-Tape-White.webp',
    prompt: TAPE_BASE(`a solid WHITE / off-white tape surface that exactly matches the color shown in the reference, with NO printed text, logos or patterns - completely plain white.`) },
  { ref: 'raw/tape-norton-ref.png', out: 'Adhesive-Tape-Norton.webp',
    prompt: TAPE_BASE(`a solid BLUE tape surface that exactly matches the blue shown in the reference, printed with the "NORTON" brand logo in a dark navy rectangle, exactly as shown in the reference (keep the NORTON markings and their positions).`) },
  { ref: 'raw/tape-kraft-ref.png', out: 'Adhesive-Tape-Kraft.webp',
    prompt: TAPE_BASE(`a solid KRAFT brown paper adhesive tape surface that exactly matches the kraft brown color shown in the reference, BUT completely PLAIN: remove ALL printed text, letters, Chinese characters, logos, snowflake graphics and patterns of any kind - the surface must be one clean uniform kraft brown paper color only.`) },
]

const CLIP_STYLE = `Premium e-commerce hero shot: the single wheel balancing weight centered, its front face fully visible, filling about 70% of the frame width. Pure white seamless background with a very subtle light-gray gradient toward the bottom. Soft directional studio lighting from the upper left, a gentle highlight on the metal surface and a soft shadow beneath, plus a faint realistic mirror reflection on the glossy white surface below. Hyper realistic true product shape with no distortion, sharp crisp detail, professional catalog photography, square composition. Do not add any other text, letters, logos or watermarks.`

const clipPrompt = (desc) => `The attached image is the exact product to photograph: one clip-on wheel balancing weight. Strictly preserve the product's real material, color, proportions and shape exactly as shown in the reference - the cast body together with its spring clip on top. ${desc} ${CLIP_STYLE}`

const CLIP_JOBS = [
  { ref: 'raw/fe-clip-steel-ref.png', out: 'Fe-Clip-On-Wheel-Weight-Steel-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized zinc-plated Fe (steel) weight body with a steel spring clip, for STEEL wheels. The body is stamped with "40" on the LEFT side and "Fe" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/fe-clip-alloy-ref.png', out: 'Fe-Clip-On-Wheel-Weight-Alloy-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized zinc-plated Fe (steel) weight body with a steel spring clip, for ALLOY wheels. The body is stamped with "40" on the LEFT side and "Fe" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/fe-clip-wide-steel-ref.png', out: 'Fe-Clip-On-Wheel-Weight-Wide-Steel-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized zinc-plated Fe (steel) weight with a WIDE flat body and a raised rectangular clip block on top, for STEEL wheels. The body is stamped with "40" on the LEFT side and "G" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/fe-clip-wide-alloy-ref.png', out: 'Fe-Clip-On-Wheel-Weight-Wide-Alloy-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized zinc-plated Fe (steel) weight with a WIDE flat body and a raised rectangular clip block on top, for ALLOY wheels. The body is stamped with "40" on the LEFT side and "G" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-clip-steel-ref.png', out: 'Pb-Clip-On-Wheel-Weight-Steel-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast LEAD (Pb) gray weight body with a clip, for STEEL wheels. The body is stamped with "40g" on the LEFT side and "40g" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-clip-alloy-ref.png', out: 'Pb-Clip-On-Wheel-Weight-Alloy-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast LEAD (Pb) gray weight body with a clip, for ALLOY wheels. The body is stamped with "40g" on the LEFT side and "40g" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-clip-oz-steel-ref.png', out: 'Pb-Clip-On-Wheel-Weight-OZ-Steel-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast LEAD (Pb) gray weight body with a clip, OZ series, for STEEL wheels. The body is stamped with "1.5" then "P" then "43g" left to right, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-clip-oz-alloy-ref.png', out: 'Pb-Clip-On-Wheel-Weight-OZ-Alloy-Wheel.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast LEAD (Pb) gray weight body with a clip, OZ series, for ALLOY wheels. The body is stamped with "1.5" then "AW" then "43g" left to right, crisp embossed letters, exactly as shown in the reference.`) },
]

const TRUCK_JOBS = [
  { ref: 'raw/fe-lt-hook-ref.png', out: 'Fe-Light-Truck-Hook-Type.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized Fe (steel) LIGHT TRUCK HOOK-TYPE clip-on wheel weight with a hook clip. The body is stamped with "100" on the LEFT side and "XT" on the RIGHT side, with two small round dimples in the middle, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-lt-hook-ref.png', out: 'Pb-Light-Truck-Hook-Type.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast LEAD (Pb) gray LIGHT TRUCK HOOK-TYPE clip-on wheel weight with a hook clip. The body is stamped with "100" on the LEFT side and "100" on the RIGHT side, crisp embossed numbers, exactly as shown in the reference.`) },
  { ref: 'raw/fe-lt-hook-825-ref.png', out: 'Fe-Light-Truck-Hook-Type-8-25.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized Fe (steel) LIGHT TRUCK HOOK-TYPE clip-on wheel weight with a hook clip (8.25 type). The body is stamped with "100" on the LEFT side and "XT" on the RIGHT side, with two small round dimples in the middle, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-truck-ref.png', out: 'Pb-Clip-On-Wheel-Weight-Truck.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast LEAD (Pb) gray TRUCK clip-on wheel weight with a wide clip on top. The body is stamped with "200g" on the LEFT side and "200g" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/fe-truck-galv-ref.png', out: 'Fe-Clip-On-Wheel-Weight-Truck-Galvanized.webp',
    prompt: clipPrompt(`Material and marking: a SILVER galvanized Fe (steel) TRUCK clip-on wheel weight with a clip on top. The body is stamped with "100" on the LEFT side and "XT" on the RIGHT side, with two small round dimples in the middle, and the clip is stamped "9.0", crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/pb-truck-coated-ref.png', out: 'Pb-Clip-On-Wheel-Weight-Truck-Coated.webp',
    prompt: clipPrompt(`Material and marking: a gray coated LEAD (Pb) TRUCK clip-on wheel weight with a clip on top. The body is stamped with "200g" on the LEFT side and a small oval brand stamp on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
  { ref: 'raw/fe-truck-dacromet-ref.png', out: 'Fe-Clip-On-Wheel-Weight-Truck-Dacromet.webp',
    prompt: clipPrompt(`Material and marking: a matte gray Dacromet-coated Fe (steel) TRUCK clip-on wheel weight with a clip on top (the surface is a flat matte light gray, NOT shiny silver). The body is stamped with "200" in the CENTER, crisp embossed numbers, exactly as shown in the reference.`) },
  { ref: 'raw/calibration-block-ref.png', out: 'Balance-Machine-Calibration-Block-100G.webp',
    prompt: clipPrompt(`Material and marking: a dull bare cast gray metal BALANCE MACHINE CALIBRATION BLOCK in the shape of a clip-on wheel weight with a clip on top. The body is stamped with "100g" on the LEFT side and "100g" on the RIGHT side, crisp embossed letters, exactly as shown in the reference.`) },
]

const logo = await sharp(LOGO).resize({ width: 400 }).png().toBuffer()

for (const job of [...JOBS, ...NEW_JOBS, ...OZ_JOBS, ...G_JOBS, ...PB_G_JOBS, ...PB_CURVED_JOBS, ...PB_BATCH3_JOBS, ...TAPE_JOBS, ...CLIP_JOBS, ...TRUCK_JOBS]) {
  const out = `${OUT_DIR}/${job.out}`
  if (existsSync(out)) { console.log('SKIP (exists, delete to regenerate):', out); continue }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[gen] ${job.out} (try ${attempt}) ...`)
      const img = await gen(job.ref, job.prompt, job.extraRefs || [])
      await sharp(img)
        .resize(1200, 1200, { fit: 'cover', position: 'attention' })
        .composite([{ input: logo, gravity: 'southeast', blend: 'over' }])
        .webp({ quality: 92 })
        .toFile(out)
      console.log('OK', out)
      break
    } catch (e) {
      console.error(`[gen] fail try ${attempt}:`, e.message)
      if (attempt === 3) console.error('[gen] GIVEUP', out)
      else await new Promise(r => setTimeout(r, 15000))
    }
  }
}
console.log('done')
