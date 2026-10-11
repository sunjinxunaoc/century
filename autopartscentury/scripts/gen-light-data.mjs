import fs from 'node:fs'
import { subcategories } from '../src/data/products.js'

const nav = subcategories.map(s => ({ slug: s.slug, name: s.name, count: s.products.length }))
fs.writeFileSync(
  'src/data/nav.js',
  `export const navSubs = ${JSON.stringify(nav, null, 2)}\n`,
  'utf8',
)

const index = subcategories.flatMap(s =>
  s.products.map(p => ({
    slug: p.slug,
    name: p.name,
    sub: s.slug,
    subName: s.name,
    image: p.image,
    keywords: p.keywords || '',
    tagline: p.tagline || '',
  })),
)
fs.writeFileSync('public/search-index.json', JSON.stringify(index), 'utf8')
console.log(`nav.js: ${nav.length} subcategories, search-index.json: ${index.length} products`)
