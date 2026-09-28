import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, basename, relative } from 'node:path'

// Gather all source text
const srcDirs = ['src', 'scripts', 'public']
const srcFiles = []
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== 'dist') walk(p) }
    else srcFiles.push(p)
  }
}
// source code files only (exclude images themselves). Only site code counts as usage.
for (const dir of ['src']) walk(dir)
srcFiles.push('public/llms.txt', 'public/sitemap.xml', 'index.html')
const codeText = srcFiles.filter(f => !/\.(webp|png|jpg|jpeg|svg|ico)$/i.test(f))
  .map(f => { try { return readFileSync(f, 'utf8') } catch { return '' } }).join('\n')
const decodedCode = codeText.replace(/%20/g, ' ').replace(/%2F/gi, '/')

// All image files under public/images
const images = []
function walkImg(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walkImg(p)
    else if (/\.(webp|png|jpg|jpeg|svg|ico)$/i.test(e.name)) images.push(p)
  }
}
walkImg('public/images')

const unused = []
for (const img of images) {
  const base = basename(img)
  const rel = img.replace(/^public/, '')
  if (decodedCode.includes(base) || decodedCode.includes(rel)) continue
  unused.push(img)
}
console.log('total images:', images.length)
console.log('unused:', unused.length)
unused.forEach(u => console.log('  ', u, Math.round(statSync(u).size / 1024) + 'KB'))