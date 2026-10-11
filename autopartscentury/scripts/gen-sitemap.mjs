import fs from 'fs'
import { subcategories, category } from '../src/data/products.js'
import { articles } from '../src/data/news.js'

const BASE = 'https://autopartscentury.com'
const today = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/products/', priority: '0.9', changefreq: 'weekly' },
  { loc: '/about/', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact/', priority: '0.8', changefreq: 'monthly' },
  { loc: '/news/', priority: '0.7', changefreq: 'weekly' },
]

for (const a of articles) {
  urls.push({ loc: `/news/${a.slug}/`, priority: '0.6', changefreq: 'monthly' })
}

for (const sub of subcategories) {
  urls.push({ loc: `/products/${sub.slug}/`, priority: '0.9', changefreq: 'weekly' })
  for (const p of sub.products) {
    urls.push({ loc: `/products/${sub.slug}/${p.slug}/`, priority: '0.8', changefreq: 'monthly' })
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

fs.writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)

const llms = `# Century AutoParts

> Tyre valve manufacturer since 2010 based in Cangzhou, Hebei, China. Rubber snap-in and brass clamp-in valve stems for passenger cars, light trucks, trucks, buses, motorcycles, agricultural machinery and off-road vehicles. OEM/ODM and bulk supply, exporting to 50+ countries.

## Products

${subcategories.map(s => `- [${s.name}](${BASE}/products/${s.slug}/): ${s.desc}`).join('\n')}

## Key Models

- Passenger car: TR412, TR413, TR414, TR415, TR414C (11.5mm / 15.8mm rim holes)
- Motorcycle: PVR40, PVR50, PVR60, PVR70 (45° / 90° bend)
- Truck & bus: V3-20-4, V3-20-6, 58MS, TR570-TR574, TR571C-TR573C, MS70-7 (brass clamp-in)
- Agricultural: TR618A, TRJ650-02/03 large bore swivel, TR1175A

## Contact

- Website: ${BASE}
- Email: info@centurymanufacture.com
- Phone/WhatsApp: +86 156 3363 2668
- Address: No.161, Qiantang Village, Qingyun Town, Yanshan County, Cangzhou City, Hebei Province, China

## Pages

- [Home](${BASE}/)
- [All Tyre Valves](${BASE}/products/)
- [News & Insights](${BASE}/news/)
${articles.map(a => `- [${a.title}](${BASE}/news/${a.slug}/)`).join('\n')}
- [About Us](${BASE}/about/)
- [Contact](${BASE}/contact/)
`

fs.writeFileSync(new URL('../public/llms.txt', import.meta.url), llms)

console.log(`sitemap.xml: ${urls.length} urls`)
console.log('llms.txt generated')
