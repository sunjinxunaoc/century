import sharp from 'sharp'
import { readdirSync } from 'node:fs'

const dir = 'public/images/products/tpms'
const files = readdirSync(dir).filter(f => f.endsWith('.webp')).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))

for (const f of files) {
  const { data, info } = await sharp(`${dir}/${f}`).ensureAlpha().resize(300).raw().toBuffer({ resolveWithObject: true })
  const w = info.width, h = info.height
  function px(x, y) {
    const i = (y * w + x) * info.channels
    return `${data[i]},${data[i + 1]},${data[i + 2]}`
  }
  const colors = new Set()
  for (let y = 0; y < h; y += 10) for (let x = 0; x < w; x += 10) {
    colors.add(px(x, y))
  }
  console.log(f, '| corner:', px(2, 2), '| distinct-bg-samples:', colors.size)
}