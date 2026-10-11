import sharp from 'sharp'
import fs from 'node:fs'

const src = 'public/images/logo/logo-icon-transparent.png'
const out = 'public/images/logo/logo-icon-transparent-160.webp'
await sharp(src).resize(160, 160, { fit: 'inside' }).webp({ quality: 90 }).toFile(out)
const s = fs.statSync(out).size
console.log('logo webp:', out, (s / 1024).toFixed(1) + 'KB')
