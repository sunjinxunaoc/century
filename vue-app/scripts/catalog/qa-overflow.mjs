// Quick QA: verifies no .page overflows (would mean clipped content).
import puppeteer from 'puppeteer-core'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const APP_ROOT = resolve(__dirname, '../..')
const exe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const url = 'file:///' + join(APP_ROOT, '.esbtmp', 'catalog', 'catalog.html').replace(/\\/g, '/')

const browser = await puppeteer.launch({ executablePath: exe, headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 1600 })
await page.goto(url, { waitUntil: 'networkidle0' })
const res = await page.evaluate(() => [...document.querySelectorAll('.page')].map((el, i) => ({
  page: i + 1, over: el.scrollHeight - el.clientHeight, scroll: el.scrollHeight, client: el.clientHeight,
})))
await browser.close()
const bad = res.filter((r) => r.over > 1)
console.log('pages:', res.length)
if (bad.length) {
  console.log('OVERFLOWING PAGES:')
  for (const b of bad) console.log(`  p${b.page}: over ${b.over}px (scroll ${b.scroll} > client ${b.client})`)
} else {
  console.log('OK - no page overflows')
}
