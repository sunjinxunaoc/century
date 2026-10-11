const fs = require('node:fs')
const read = p => fs.readFileSync(p, 'utf8')

const prod = read('dist/products/passenger-car-light-truck-valves/tr414-snap-in-tubeless-valve/index.html')
console.log('BreadcrumbList:', prod.includes('BreadcrumbList'))
console.log('mpn TR414:', prod.includes('"mpn":"TR414"'))
console.log('offers:', prod.includes('"offers"'))
console.log('spec model links:', (prod.match(/text-brand underline/g) || []).length)

const cat = read('dist/products/truck-bus-valves/index.html')
console.log('CollectionPage:', cat.includes('CollectionPage'))
console.log('ItemList:', cat.includes('ItemList'))

const news = read('dist/news/choosing-a-tyre-valves-manufacturer/index.html')
console.log('Article:', news.includes('"@type":"Article"'))

const home = read('dist/index.html')
console.log('FAQPage on home:', home.includes('FAQPage'))

const about = read('dist/about/index.html')
console.log('AboutPage:', about.includes('AboutPage'))
const contact = read('dist/contact/index.html')
console.log('ContactPage:', contact.includes('ContactPage'))

console.log('search-index.json:', fs.existsSync('dist/search-index.json'))

const faqPages = ['dist/products/motorcycle-bicycle-valves/index.html', 'dist/news/tubeless-tire-valves-wholesale-guide/index.html']
for (const f of faqPages) console.log(f.split('/').slice(-2)[0], 'FAQPage:', read(f).includes('FAQPage'))

// count pages with BreadcrumbList across a sample
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`])
const htmls = walk('dist').filter(f => f.endsWith('.html'))
let bc = 0, zeroLd = 0
for (const f of htmls) {
  const h = read(f)
  if (h.includes('BreadcrumbList')) bc++
  if (!h.includes('application/ld+json')) zeroLd++
}
console.log(`pages: ${htmls.length}, with BreadcrumbList: ${bc}, zero JSON-LD: ${zeroLd}`)
