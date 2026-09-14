import { readFileSync } from 'node:fs'

const BASE = 'https://centurymanufacture.com'
const KEY = '3eb81eea08a74268ba4d6094012ff84f'
const KEY_LOCATION = `${BASE}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const BATCH = 100

function normalizeUrl(u) {
  if (/^https?:\/\//i.test(u)) return u
  return `${BASE}${u.startsWith('/') ? u : '/' + u}`
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'centurymanufacture.com',
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  })
  return res
}

async function main() {
  const args = process.argv.slice(2)
  let urls

  if (args.length) {
    urls = args.map(normalizeUrl)
  } else {
    const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
    urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  }

  if (!urls.length) {
    console.error('[indexnow] no URLs found. Run `npm run build` first, or pass URLs as args.')
    process.exit(1)
  }

  for (let i = 0; i < urls.length; i += BATCH) {
    const chunk = urls.slice(i, i + BATCH)
    const res = await submit(chunk)
    const text = await res.text()
    console.log(`[indexnow] submitted ${chunk.length} URLs -> HTTP ${res.status}${text ? ' ' + text : ''}`)
    if (!res.ok) {
      process.exitCode = 1
    }
  }
  console.log(`[indexnow] done. total ${urls.length} URLs.`)
}

main()
