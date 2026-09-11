import { writeFileSync, mkdirSync } from 'node:fs'
import { categories, PAGE_SIZE } from '../src/data/products.js'
import { articles } from '../src/data/articles.js'

const BASE = 'https://centurymanufacture.com'
const lastmod = new Date().toISOString().slice(0, 10)

const urls = [{ path: '/', priority: '1.0', freq: 'weekly' }]

function add(path, priority, freq = 'monthly') {
  urls.push({ path, priority, freq })
}

add('/about/', '0.7', 'weekly')
add('/products/', '0.8', 'weekly')
add('/news/', '0.8', 'weekly')
add('/contact/', '0.7', 'weekly')

for (const cat of categories) {
  add(`/products/${cat.slug}/`, '0.9', 'weekly')
  for (const sub of cat.subcategories || []) {
    add(`/products/${cat.slug}/${sub.slug}/`, '0.8', 'monthly')
    const totalPages = Math.ceil((sub.products || []).length / PAGE_SIZE)
    for (let page = 2; page <= totalPages; page++) {
      add(`/products/${cat.slug}/${sub.slug}/page/${page}/`, '0.8', 'monthly')
    }
    for (const p of sub.products || []) {
      add(`/products/${cat.slug}/${p.slug}/`, '0.8', 'monthly')
    }
  }
}
for (const a of articles) {
  add(`/news/${a.slug}/`, '0.7', 'monthly')
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `    <url>
        <loc>${BASE}${u.path}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${u.freq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`).join('\n')}
</urlset>
`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)

const llms = `# Century Auto Parts - Hebei Century Auto Parts Co., Ltd.
> Professional manufacturer of wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs since 2010.

Website: ${BASE}
Phone: +86 15633632668
Email: gracecenturyauto@gmail.com

## Pages
- Home: ${BASE}/
- About Us: ${BASE}/about/
- Products: ${BASE}/products/
- News: ${BASE}/news/
- Contact: ${BASE}/contact/

## Product Categories
${categories.map(c => `- ${c.name}: ${BASE}/products/${c.slug}/`).join('\n')}

## Subcategories & Products
${categories.map(c => {
  const subs = c.subcategories || []
  if (!subs.length) return `- ${c.name}: ${BASE}/products/${c.slug}/`
  return `- ${c.name}: ${BASE}/products/${c.slug}/\n${subs.map(s => {
    const products = s.products || []
    if (!products.length) return `  - ${s.name}: ${BASE}/products/${c.slug}/${s.slug}/`
    return `  - ${s.name}: ${BASE}/products/${c.slug}/${s.slug}/\n${products.map(p => `    - ${p.name}: ${BASE}/products/${c.slug}/${p.slug}/`).join('\n')}`
  }).join('\n')}`
}).join('\n')}

## News & Guides
${articles.map(a => `- ${a.title}: ${BASE}/news/${a.slug}/`).join('\n')}

## Preferred Pronouns
The company uses 'we' and 'our' when referring to itself.
`

writeFileSync(new URL('../public/llms.txt', import.meta.url), llms)
console.log(`Generated sitemap (${urls.length} URLs) and llms.txt (lastmod ${lastmod})`)
