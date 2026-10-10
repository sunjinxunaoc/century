const fs = require('fs')
const path = 'src/data/products.js'
let t = fs.readFileSync(path, 'utf8')

const CAPS = [
  ['EP', 'ep', 'Plastic', 'black dome-shaped'],
  ['VS-8SJ', 'vs-8sj', 'Plastic', 'black'],
  ['VS-8', 'vs-8', 'Plastic', 'black'],
  ['VS-8R', 'vs-8r', 'Plastic', 'red'],
  ['VS-8G', 'vs-8g', 'Plastic', 'green'],
  ['VS-8B', 'vs-8b', 'Plastic', 'blue'],
  ['VT', 'vt', 'Chrome metal', 'chrome'],
  ['AT', 'at', 'Chrome metal', 'chrome hex'],
  ['ANT', 'ant', 'Chrome metal', 'chrome hex'],
  ['APT', 'apt', 'Chrome metal', 'chrome hex'],
  ['ET', 'et', 'Chrome metal', 'chrome hex'],
  ['FT', 'ft', 'Chrome metal', 'chrome knurled'],
  ['FZT', 'fzt', 'Chrome metal', 'chrome'],
  ['CTT', 'ctt', 'Chrome metal', 'brass slotted'],
  ['CT', 'ct', 'Chrome metal', 'chrome with core pin'],
  ['DT', 'dt', 'Chrome metal', 'chrome'],
  ['GT', 'gt', 'Brass', 'knurled'],
  ['TST', 'tst', 'Chrome metal', 'chrome tall'],
]

const SPEC = {
  headers: ['Series', 'Material', 'Models'],
  rows: [
    ['Plastic dome', 'Plastic', 'EP, VS-8SJ, VS-8, VS-8R, VS-8G, VS-8B'],
    ['Chrome metal', 'Chromed metal', 'VT, AT, ANT, APT, ET, FT, FZT, CTT, CT, DT, TST'],
    ['Brass', 'Brass', 'GT'],
  ],
}

const esc = (s) => JSON.stringify(s)

const blocks = CAPS.map(([model, slugBase, material, look]) => {
  const slug = `${slugBase}-valve-cap`
  const name = `${model} Valve Cap`
  const img = `/images/products/tyre-valves/${slug}001.webp`
  const matLower = material === 'Plastic' ? 'plastic' : 'metal'
  return `        {
          "slug": ${esc(slug)},
          "name": ${esc(name)},
          "image": ${esc(img)},
          "images": [
            ${esc(img)}
          ],
          "seoTitle": ${esc(`${model} ${material} Valve Cap | Tyre Valve Dust Cap, 8V1 Thread`)},
          "tagline": ${esc(`${model} ${matLower} tyre valve cap, ${look} finish, standard 8V1 thread, dust and moisture protection.`)},
          "desc": ${esc(`${model} ${matLower} tyre valve cap with ${look} finish, fitting the standard 8V1 valve thread. Protects the valve core from dust, dirt and moisture on passenger cars, trucks, buses and agricultural vehicles. Part of our valve cap range covering plastic dome caps (EP, VS-8 series), chrome metal caps and brass caps. Factory-direct with bulk and OEM/ODM options.`)},
          "keywords": ${esc(`${model} valve cap, ${matLower} valve cap, tyre valve dust cap, 8V1 valve cap`)},
          "features": [
            ${esc(`${material} construction, ${look} finish`)},
            "Standard 8V1 thread fit",
            "Dust and moisture protection",
            "For car, truck, bus & agricultural valves",
            "Factory direct, OEM/ODM & bulk supply"
          ],
          "spec": {
            "headers": ["Series", "Material", "Models"],
            "rows": [
              ["Plastic dome", "Plastic", "EP, VS-8SJ, VS-8, VS-8R, VS-8G, VS-8B"],
              ["Chrome metal", "Chromed metal", "VT, AT, ANT, APT, ET, FT, FZT, CTT, CT, DT, TST"],
              ["Brass", "Brass", "GT"]
            ]
          }
        }`
})

const marker = '"slug": "tyre-valve-caps",'
const mi = t.indexOf(marker)
if (mi === -1) { console.error('anchor not found'); process.exit(1) }
const nl = t.lastIndexOf('\n        {', mi)
const insertAt = nl + 1
t = t.slice(0, insertAt) + blocks.join(',\n') + ',\n' + t.slice(insertAt)
fs.writeFileSync(path, t, 'utf8')
console.log('inserted', blocks.length, 'cap pages')
