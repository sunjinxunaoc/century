const fs = require('node:fs')

const FILE = 'src/data/products.js'
const buyerFaqs = [
  {
    q: 'What is your minimum order quantity (MOQ)?',
    a: 'MOQ is negotiable and depends on the model and packaging. Standard models can start from small trial orders - send us your target quantity for an exact quote.',
  },
  {
    q: 'How long is the lead time?',
    a: 'Standard models ship in 7-20 days depending on order volume. OEM/ODM orders with custom packaging may need a few extra days for artwork confirmation and sampling.',
  },
  {
    q: 'Do you support OEM / private label orders?',
    a: 'Yes. We offer OEM and ODM services including custom packaging, private labeling and branded cartons. Send your artwork and requirements for a fast quotation.',
  },
  {
    q: 'How do you ship export orders?',
    a: 'We ship worldwide by sea (FCL/LCL), air freight and express courier for samples. Export cartons and pallets follow your requirements, and we can work with your nominated forwarder.',
  },
]

let text = fs.readFileSync(FILE, 'utf8')
const block = buyerFaqs.map(f => `{\n        "q": "${f.q}",\n        "a": "${f.a}"\n      },`).join('\n      ')
const before = (text.match(/"faqs": \[/g) || []).length
text = text.replaceAll('"faqs": [', `"faqs": [\n      ${block}`)
fs.writeFileSync(FILE, text, 'utf8')
console.log(`inserted buyer FAQs into ${before} faq blocks`)
