const fs = require('node:fs')
const path = require('node:path')

const BASE = process.argv[2] || 'http://localhost:4173'
const OUT_DIR = path.join(__dirname, '..', 'autopartscentury-audit', 'crawl')

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
const stripTags = (s) => decode(s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())

function parsePage(html) {
  const pick = (re) => { const m = html.match(re); return m ? decode(m[1].trim()) : null }
  const title = pick(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const metaDesc = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) || pick(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i)
  const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  const robots = pick(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i)
  const ogTitle = pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([\s\S]*?)["']/i)
  const ogImage = pick(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => stripTags(m[1]))
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => stripTags(m[1]))
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1].trim())
  const jsonLdTypes = []
  for (const j of jsonLd) {
    try {
      const o = JSON.parse(j)
      const arr = Array.isArray(o) ? o : [o]
      for (const it of arr) jsonLdTypes.push(it['@type'] || (it['@graph'] ? it['@graph'].map(g => g['@type']).join('+') : '?'))
    } catch { jsonLdTypes.push('PARSE_ERROR') }
  }
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(tag => {
    const src = (tag[0].match(/src=["']([^"']+)["']/i) || [])[1] || ''
    const altM = tag[0].match(/alt=["']([\s\S]*?)["']/i)
    return { src, alt: altM ? decode(altM[1]) : null, hasAlt: /alt=["']/i.test(tag[0]) }
  })
  const links = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)].map(m => m[1])
  const bodyM = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const text = bodyM ? stripTags(bodyM[1]) : ''
  const words = text.split(/\s+/).filter(Boolean).length
  return { title, metaDesc, canonical, robots, ogTitle, ogImage, h1s, h2s, jsonLdTypes, jsonLdCount: jsonLd.length, images: imgs, internalLinks: links.filter(l => l.startsWith('/')).length, wordCount: words }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text()
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/^https?:\/\/[^/]+/, ''))
  console.log(`sitemap urls: ${urls.length}`)
  const results = []
  let i = 0
  for (const u of urls) {
    i++
    const started = Date.now()
    try {
      const res = await fetch(BASE + u)
      const html = await res.text()
      const parsed = parsePage(html)
      results.push({ url: u, status: res.status, ms: Date.now() - started, bytes: html.length, ...parsed })
      if (i % 20 === 0) console.log(`${i}/${urls.length}`)
    } catch (e) {
      results.push({ url: u, status: 0, error: String(e) })
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'pages.json'), JSON.stringify(results, null, 1))
  console.log('saved', results.length, 'pages to crawl/pages.json')
  const codes = {}
  for (const r of results) codes[r.status] = (codes[r.status] || 0) + 1
  console.log('status codes:', JSON.stringify(codes))
}
main()
