const BASE = 'https://autopartscentury.com'

async function check(path, opts = {}) {
  const started = Date.now()
  const res = await fetch(BASE + path, { redirect: 'manual', ...opts })
  const text = opts.head ? '' : await res.text()
  return { res, text, ms: Date.now() - started }
}

const out = []
const log = (k, v) => { out.push(`${k}: ${v}`) }

const bad = await check('/no-such-page-xyz', { head: true })
log('soft404 fixed (404 status)', bad.res.status === 404)

const slash = await check('/about', { head: true })
log('/about -> 301 /about/', slash.res.status === 301 && slash.res.headers.get('location') === BASE + '/about/')

const prod = await check('/products/truck-bus-valves/tr571-clamp-in-valve/')
log('product 200', prod.res.status === 200)
log('canonical ok', prod.text.includes(`rel="canonical" href="${BASE}/products/truck-bus-valves/tr571-clamp-in-valve/"`))
log('Product schema', prod.text.includes('"@type":"Product"'))
log('Product mpn', prod.text.includes('"mpn":"TR571"'))
log('BreadcrumbList', prod.text.includes('"BreadcrumbList"'))
log('FAQPage present (if faqs)', prod.text.includes('"FAQPage"'))
log('spec internal links', (prod.text.match(/text-brand underline/g) || []).length)

const cat = await check('/products/agricultural-tractors-off-road-valves/')
log('category CollectionPage', cat.text.includes('"CollectionPage"'))
log('category compare table', cat.text.includes('Size Comparison Table'))

const news = await check('/news/tubeless-tire-valves-wholesale-guide/')
log('news Article schema', news.text.includes('"@type":"Article"'))
log('news byline', news.text.includes('Engineering Team'))

const home = await check('/')
log('home single H1', (home.text.match(/<h1/g) || []).length === 1)
log('home hero fetchpriority', home.text.includes('fetchpriority="high"'))
log('home Organization', home.text.includes('"@type":"Organization"'))
log('brand Century AutoParts', home.text.includes('Century AutoParts'))
log('old brand gone', !home.text.includes('AutoParts Century'))

const sm = await check('/sitemap.xml')
log('sitemap 200 + 163 urls', sm.res.status === 200 && (sm.text.match(/<loc>/g) || []).length === 163)

const rb = await check('/robots.txt')
log('robots AI crawlers', rb.text.includes('GPTBot'))

const llms = await check('/llms.txt')
log('llms.txt brand', llms.text.startsWith('# Century AutoParts'))

console.log(out.join('\n'))
