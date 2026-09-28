import { readFileSync, writeFileSync } from 'node:fs'

const map = {
  'adhesive-stick-on-wheel-weights-guide': '/images/articles/adhesive-stick-on-wheel-weights-guide.webp',
  'stick-on-wheel-weights-fall-off': '/images/articles/stick-on-wheel-weights-fall-off.webp',
  'wheel-weight-tape-comparison': '/images/articles/wheel-weight-tape-comparison.webp',
  'adhesive-wheel-weight-sizes': '/images/articles/adhesive-wheel-weight-sizes.webp',
  'wheel-weight-manufacturers': '/images/articles/wheel-weight-manufacturers.webp',
  'wheel-weight-guide': '/images/articles/wheel-weight-guide.webp',
  'tyre-valve-guide': '/images/articles/tyre-valve-guide.webp',
  'tpms-maintenance': '/images/articles/tpms-maintenance.webp',
  'tyre-patch-vs-plug': '/images/articles/tyre-patch-vs-plug.webp',
  'seal-string-repair': '/images/articles/seal-string-repair.webp',
  'ordering-guide': '/images/articles/ordering-guide.webp',
  'us-vs-eu-style-tire-patch': '/images/articles/us-vs-eu-style-tire-patch.webp',
  'tr413-vs-tr414-tyre-valve': '/images/articles/tr413-vs-tr414-tyre-valve.webp',
  'fe-vs-pb-wheel-weights': '/images/articles/fe-vs-pb-wheel-weights.webp',
  'mushroom-plug-vs-seal-string': '/images/articles/mushroom-plug-vs-seal-string.webp',
}

let src = readFileSync('src/data/articles.js', 'utf8')
let count = 0
for (const [slug, img] of Object.entries(map)) {
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp("(\\n\\s+slug:\\s*'" + esc + "',\\s*\\n\\s+title:[\\s\\S]*?img:\\s*')([^']+)(')")
  if (re.test(src)) {
    src = src.replace(re, '$1' + img + '$3')
    count++
  } else {
    console.error('NOT FOUND:', slug)
  }
}
writeFileSync('src/data/articles.js', src)
console.log('updated', count, 'img paths')