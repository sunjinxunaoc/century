import { writeFileSync } from 'node:fs'
import { categories, PAGE_SIZE } from '../src/data/products.js'
import { articles, hubTags, NEWS_PER_PAGE } from '../src/data/articles.js'
import esCategories from '../src/data/es/categories.js'

const BASE = 'https://centurymanufacture.com'
const lastmod = new Date().toISOString().slice(0, 10)

// Locale prefixes: English at the root, Spanish under /es.
const LOCALES = [
  { code: 'en', prefix: '' },
  { code: 'es', prefix: '/es' },
]

// Locale-independent paths, expanded per locale below.
const urls = [{ path: '/', priority: '1.0', freq: 'weekly' }]

function add(path, priority, freq = 'monthly', images = []) {
  urls.push({ path, priority, freq, images: images.filter(Boolean).slice(0, 4) })
}

add('/about/', '0.7', 'weekly')
add('/products/', '0.8', 'weekly')
add('/catalog/', '0.7', 'weekly')
add('/news/', '0.8', 'weekly')
add('/contact/', '0.7', 'weekly')
add('/privacy/', '0.3', 'yearly')

for (const cat of categories) {
  const catImages = [...new Set((cat.subcategories || []).flatMap(s => (s.products || []).map(p => p.image)).filter(Boolean))].slice(0, 3)
  add(`/products/${cat.slug}/`, '0.9', 'weekly', catImages)
  for (const sub of cat.subcategories || []) {
    const subImages = [...new Set((sub.products || []).map(p => p.image).filter(Boolean))].slice(0, 3)
    add(`/products/${cat.slug}/${sub.slug}/`, '0.8', 'monthly', subImages)
    const totalPages = Math.ceil((sub.products || []).length / PAGE_SIZE)
    for (let page = 2; page <= totalPages; page++) {
      add(`/products/${cat.slug}/${sub.slug}/page/${page}/`, '0.8', 'monthly')
    }
    for (const p of sub.products || []) {
      const imgs = [...(p.images || []), p.image]
      add(`/products/${cat.slug}/${p.slug}/`, '0.8', 'monthly', imgs)
    }
  }
}
for (const a of articles) {
  add(`/news/${a.slug}/`, '0.7', 'monthly', a.img ? [a.img] : [])
}
for (let page = 2; page <= Math.ceil(articles.length / NEWS_PER_PAGE); page++) {
  add(`/news/page/${page}/`, '0.5', 'weekly')
}
for (const t of hubTags) {
  add(`/news/tag/${t.slug}/`, '0.5', 'weekly')
}

const entries = []
for (const u of urls) {
  const alternates = LOCALES.map(l => ({ hreflang: l.code, href: `${BASE}${l.prefix}${u.path}` }))
  alternates.push({ hreflang: 'x-default', href: `${BASE}${u.path}` })
  for (const l of LOCALES) {
    entries.push({
      ...u,
      loc: `${BASE}${l.prefix}${u.path}`,
      alternates,
    })
  }
}

const hasImages = entries.some(u => u.images && u.images.length)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"${hasImages ? '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>
${entries.map(u => `    <url>
        <loc>${u.loc}</loc>${u.alternates.map(a => `
        <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`).join('')}
        <lastmod>${lastmod}</lastmod>
        <changefreq>${u.freq}</changefreq>
        <priority>${u.priority}</priority>${(u.images || []).map(img => `
        <image:image>
            <image:loc>${encodeURI(BASE + img)}</image:loc>
        </image:image>`).join('')}
    </url>`).join('\n')}
</urlset>
`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)

const esCatName = (slug) => (esCategories.categories[slug] && esCategories.categories[slug].name) || ''
const esSubName = (slug) => esCategories.subcategories[slug] || ''

const llms = `# Century Auto Parts - Hebei Century Auto Parts Co., Ltd.
> Professional manufacturer of wheel balancing weights, tyre valves, TPMS, tyre seal strings, tyre patches and mushroom patch plugs since 2010.

Website: ${BASE}
Phone: +86 15633632668
Email: info@centurymanufacture.com
Languages: English (${BASE}/), Spanish (${BASE}/es/)

## Pages
- Home: ${BASE}/
- About Us: ${BASE}/about/
- Products: ${BASE}/products/
- Catalog: ${BASE}/catalog/
- News: ${BASE}/news/
- Contact: ${BASE}/contact/

## Spanish Pages
- Inicio: ${BASE}/es/
- Nosotros: ${BASE}/es/about/
- Productos: ${BASE}/es/products/
- Catálogo: ${BASE}/es/catalog/
- Noticias: ${BASE}/es/news/
- Contacto: ${BASE}/es/contact/

## Product Categories
${categories.map(c => `- ${c.name}: ${BASE}/products/${c.slug}/`).join('\n')}

## Categorías (Español)
${categories.map(c => `- ${esCatName(c.slug) || c.name}: ${BASE}/es/products/${c.slug}/`).join('\n')}

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

## Topics
${hubTags.map(t => `- ${t.name} (${t.articles.length} articles): ${BASE}/news/tag/${t.slug}/`).join('\n')}

## Preferred Pronouns
The company uses 'we' and 'our' when referring to itself.
`

writeFileSync(new URL('../public/llms.txt', import.meta.url), llms)
console.log(`Generated sitemap (${entries.length} URLs, ${LOCALES.length} locales) and llms.txt (lastmod ${lastmod})`)
