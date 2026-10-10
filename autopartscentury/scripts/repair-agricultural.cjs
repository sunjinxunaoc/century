const fs = require('fs');
const p = 'src/data/products.js';
let s = fs.readFileSync(p, 'utf8');

// ---------- 1. fix 70ms-7 spec rows (currently TRSP2-only, wrong) ----------
const badRows = '"rows": [\n              ["TRSP2", "17", "—", "—", "Φ20.5 (.812\\")"]\n            ]';
const msRows = '"rows": [\n              ["70MS-7", "37", "28", "7°", "Φ9.7 (.390\\")"],\n              ["60MS", "60", "—", "—", "Φ9.7 (.390\\")"],\n              ["40MS", "40", "—", "—", "Φ9.7 (.390\\")"]\n            ]';
if (!s.includes(badRows)) throw new Error('70ms-7 bad rows not found');
s = s.replace(badRows, msRows);
console.log('1. fixed 70ms-7 spec rows');

// ---------- 2. cut the 5 V3 pages out of truck-bus-valves ----------
const v3Start = s.indexOf('        {\n          "slug": "v3-18-1-swivel-valve"');
if (v3Start < 0) throw new Error('v3 pages start not found');
const tbEnd = s.indexOf('      ]\n    },\n    {\n      "slug": "valve-extensions"', v3Start);
if (tbEnd < 0) throw new Error('truck-bus end not found');
let v3Block = s.slice(v3Start, tbEnd);
v3Block = v3Block.replace(/\s+$/, '');
s = s.slice(0, v3Start) + s.slice(tbEnd);
console.log('2. cut V3 pages,', v3Block.length, 'chars');

// ---------- helpers ----------
const J = JSON.stringify;
function renderProduct(pr) {
  let out = '        {\n';
  out += '          "slug": ' + J(pr.slug) + ',\n';
  out += '          "name": ' + J(pr.name) + ',\n';
  out += '          "image": ' + J(pr.image) + ',\n';
  out += '          "images": [\n' + pr.images.map(i => '            ' + J(i)).join(',\n') + '\n          ],\n';
  out += '          "seoTitle": ' + J(pr.seoTitle) + ',\n';
  out += '          "tagline": ' + J(pr.tagline) + ',\n';
  out += '          "desc": ' + J(pr.desc) + ',\n';
  out += '          "keywords": ' + J(pr.keywords) + ',\n';
  out += '          "features": [\n' + pr.features.map(f => '            ' + J(f)).join(',\n') + '\n          ],\n';
  out += '          "spec": {\n';
  out += '            "headers": [' + pr.spec.headers.map(h => J(h)).join(', ') + '],\n';
  out += '            "rows": [\n' + pr.spec.rows.map(r => '              [' + r.map(c => J(c)).join(', ') + ']').join(',\n') + '\n            ]\n';
  out += '          }\n        }';
  return out;
}

// ---------- 3. restore 60ms / 40ms pages after 70ms-7 ----------
const RH97 = 'Φ9.7 (.390")';
const MS_SPEC = {
  headers: ['ETRTO No.', 'A (mm)', 'B (mm)', 'β°', 'Rim Hole'],
  rows: [
    ['70MS-7', '37', '28', '7°', RH97],
    ['60MS', '60', '—', '—', RH97],
    ['40MS', '40', '—', '—', RH97],
  ],
};
const ms60 = {
  slug: '60ms-clamp-in-valve',
  name: '60MS Clamp-In Valve',
  image: '/images/products/tyre-valves/60ms-clamp-in-valve001.webp',
  images: ['/images/products/tyre-valves/60ms-clamp-in-valve001.webp', '/images/products/tyre-valves/60ms-clamp-in-valve002.webp'],
  seoTitle: '60MS Clamp-In Truck Valve | Nickel-Plated Straight, A=60mm, Φ9.7 Rim Hole',
  tagline: 'Nickel-plated straight clamp-in truck and bus tubeless valve, A=60mm, rim hole Φ9.7 (.390").',
  desc: 'The 60MS nickel-plated brass clamp-in tubeless tyre valve is designed for truck and bus steel rims, with an overall A dimension of 60mm, fitting the Φ9.7mm (.390") rim hole. Corrosion-resistant nickel-plated finish with hex nut and rubber grommet base, supplied complete with core and metal cap. Factory-direct with bulk and OEM/ODM options.',
  keywords: '60MS valve, 60MS clamp-in valve, nickel plated truck valve, bus valve, clamp-in valve, Φ9.7 rim hole valve',
  features: ['Nickel-plated brass construction', 'Straight stem, A=60mm', 'Rim hole Φ9.7mm (.390")', 'Hex nut & rubber grommet seal', 'Core & metal cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: MS_SPEC,
};
const ms40 = {
  slug: '40ms-clamp-in-valve',
  name: '40MS Clamp-In Valve',
  image: '/images/products/tyre-valves/40ms-clamp-in-valve001.webp',
  images: ['/images/products/tyre-valves/40ms-clamp-in-valve001.webp', '/images/products/tyre-valves/40ms-clamp-in-valve002.webp'],
  seoTitle: '40MS Clamp-In Truck Valve | Nickel-Plated Straight, A=40mm, Φ9.7 Rim Hole',
  tagline: 'Nickel-plated straight clamp-in truck and bus tubeless valve, A=40mm, rim hole Φ9.7 (.390").',
  desc: 'The 40MS nickel-plated brass clamp-in tubeless tyre valve is designed for truck and bus steel rims, with an overall A dimension of 40mm, fitting the Φ9.7mm (.390") rim hole. Corrosion-resistant nickel-plated finish with hex nut and rubber grommet base, supplied complete with core and metal cap. Factory-direct with bulk and OEM/ODM options.',
  keywords: '40MS valve, 40MS clamp-in valve, nickel plated truck valve, bus valve, clamp-in valve, Φ9.7 rim hole valve',
  features: ['Nickel-plated brass construction', 'Straight stem, A=40mm', 'Rim hole Φ9.7mm (.390")', 'Hex nut & rubber grommet seal', 'Core & metal cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: MS_SPEC,
};
const anchor70 = '"slug": "70ms-7-clamp-in-valve"';
const i70 = s.indexOf(anchor70);
if (i70 < 0) throw new Error('70ms-7 not found');
// find end of 70ms-7 product object: next '\n        },' followed by '\n      ]'
const endMark = '\n        }\n      ]';
const e70 = s.indexOf(endMark, i70);
if (e70 < 0) throw new Error('70ms-7 end not found');
s = s.slice(0, e70) + '\n        },\n' + renderProduct(ms60) + ',\n' + renderProduct(ms40) + s.slice(e70 + '\n        }'.length);
console.log('3. restored 60ms & 40ms pages');

// ---------- 4. rebuild agricultural subcategory ----------
const RH205 = 'Φ20.5 (.812")';
const RH157 = 'Φ15.7 (.625")';
const agriHeader = `    {
      "slug": "agricultural-tractors-off-road-valves",
      "name": "Agricultural & Off-Road",
      "seoTitle": "Agricultural & Off-Road Tyre Valves | Large Bore Swivel, Tractor Valves",
      "keywords": "agricultural valve, tractor tyre valve, off-road valve, large bore valve, swivel valve, TR618A, TRJ650, TR1175A, V3.18, V3.14, V3.12",
      "desc": "TR618A, TRJ650-02/03 and TR1175A heavy-duty valves for agricultural machinery and off-road vehicles.",
      "highlights": [
        "Heavy-duty tubeless valves for tractors and off-road machinery",
        "TR618A (5/8\\" hole, 90 PSI) and TRJ650 large-bore swivel type",
        "TR1175A with 86° bend and 20.5mm rim hole",
        "Brass/metal construction for harsh conditions"
      ],
      "faqs": [
        {
          "q": "Do these fit agricultural rims?",
          "a": "Yes. They are designed for tractor and off-road rims with rim holes from 5/8\\" (15.9mm) up to 20.5mm."
        },
        {
          "q": "What is a large-bore swivel valve?",
          "a": "The TRJ650 series has a swiveling, large-bore design that allows faster inflation and easy access on heavy machinery."
        }
      ],
      "products": [`;

const agriProducts = [];

agriProducts.push({
  slug: 'tr618a-tubeless-valve',
  name: 'TR618A Tubeless Valve',
  image: '/images/products/tyre-valves/tubeless-valve-tr618-tr618a-tire-valve-stem001.webp',
  images: ['/images/products/tyre-valves/tubeless-valve-tr618-tr618a-tire-valve-stem001.webp', '/images/products/tyre-valves/tubeless-valve-tr618-tr618a-tire-valve-stem002.webp'],
  seoTitle: 'TR618A Tubeless Valve | Agricultural & Off-Road, 5/8" Hole, 90 PSI',
  tagline: 'Tubeless tyre valve stem for agricultural and off-road vehicles. REF V5.01.1, 5/8" hole, 90 PSI.',
  desc: 'TR618A tubeless tyre valve stem designed for agricultural machinery and off-road vehicles.',
  keywords: 'TR618A, TR618A tubeless valve, agricultural valve, tractor tyre valve, tubeless valve stem',
  features: ['Tubeless design', '5/8 inch hole size', '90 PSI max inflation pressure', 'For agricultural and off-road vehicles'],
  spec: {
    headers: ['Model', 'Ref. No.', 'Eff. Length', 'Max Pressure (PSI)', 'Hole Size'],
    rows: [['TR618A', 'V5.01.1', 'Φ22.5 x 30', '90', '5/8 inch']],
  },
});

agriProducts.push({
  slug: 'trj650-02-03-large-bore-swivel-valve',
  name: 'TRJ650-02 TRJ650-03 Large Bore Swivel Valve',
  image: '/images/products/tyre-valves/Valves-Trj650-03-Trj651-03-Large-Bore-Swivel-Type001.webp',
  images: ['/images/products/tyre-valves/Valves-Trj650-03-Trj651-03-Large-Bore-Swivel-Type001.webp', '/images/products/tyre-valves/Valves-Trj650-03-Trj651-03-Large-Bore-Swivel-Type002.webp'],
  seoTitle: 'TRJ650-02 TRJ650-03 Large Bore Swivel Valve | 20.5mm Rim Hole',
  tagline: 'Large bore swivel type valve for tractors. REF V5.04.1, rim hole 20.5 mm, core 7002, cap VC6.',
  desc: 'TRJ650-02/TRJ650-03 large bore swivel type valve for tractors and agricultural machinery.',
  keywords: 'TRJ650-02, TRJ650-03, large bore swivel valve, tractor valve, agricultural valve',
  features: ['Large bore swivel type', '20.5 mm rim hole', 'Core 7002 & cap VC6', 'For tractors and agricultural machinery'],
  spec: {
    headers: ['Model', 'Ref. No.', 'Core', 'Cap', 'Rim Hole (mm)'],
    rows: [['TRJ650-02/03', 'V5.04.1', '7002', 'VC6', '20.5']],
  },
});

agriProducts.push({
  slug: 'tr1175a-tire-valve',
  name: 'TR1175A Tire Valve',
  image: '/images/products/tyre-valves/Tire-Valve-TR1175A.webp',
  images: ['/images/products/tyre-valves/Tire-Valve-TR1175A.webp'],
  seoTitle: 'TR1175A Tire Valve | Heavy-Duty Off-Road, 86° Bend, 20.5mm Rim Hole',
  tagline: 'Heavy-duty tire valve for off-road and agricultural vehicles. 86° bend, rim hole 20.5 mm.',
  desc: 'TR1175A heavy-duty tire valve designed for off-road vehicles and agricultural machinery.',
  keywords: 'TR1175A, TR1175A tire valve, off-road valve, agricultural valve, tractor tire valve',
  features: ['Heavy duty construction', '86° bent stem', '20.5 mm rim hole', 'Core 9002 #'],
  spec: {
    headers: ['Model', 'Ref. Length', 'Core', 'Rim Hole (mm)', 'Bent Degree'],
    rows: [['TR1175A', 'Φ22.5 x 24', '9002', '20.5', '86°']],
  },
});

agriProducts.push({
  slug: 'v3-18-series-swivel-valve',
  name: 'V3.18 Series Swivel Valve',
  image: '/images/products/tyre-valves/v3-18-series-swivel-valve001.webp',
  images: ['/images/products/tyre-valves/v3-18-series-swivel-valve001.webp', '/images/products/tyre-valves/v3-18-series-swivel-valve002.webp'],
  seoTitle: 'V3.18 Series Large Bore Swivel Valves | Φ31 Base, 146°/138°, Φ20.5 Rim Hole',
  tagline: 'Large-bore swivel type valves V3.18.1/2/4/5 for agricultural and off-road machinery, Φ31 base, rim hole Φ20.5 (.812").',
  desc: 'V3.18 series large-bore swivel type tyre valves for tractors, agricultural machinery and off-road vehicles. The swiveling large-bore design allows fast inflation and easy access on heavy equipment. Four length/angle combinations fit the Φ20.5mm (.812") rim hole. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'V3.18.1, V3.18.2, V3.18.4, V3.18.5, large bore swivel valve, tractor valve, agricultural valve',
  features: ['Large-bore swivel type, Φ31 base', 'Four length/angle combinations', 'Rim hole Φ20.5mm (.812")', 'Core & cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['ETRTO No.', 'Rel Length (D)', 'A (mm)', 'B (mm)', 'C (mm)', 'α/β°', 'Rim Hole'],
    rows: [
      ['V3.18.1', 'Φ31', '64', '24.5', '14.5', '146°', RH205],
      ['V3.18.2', 'Φ31', '81', '24.5', '14.5', '146°', RH205],
      ['V3.18.4', 'Φ31', '51', '37.5', '19.5', '138°', RH205],
      ['V3.18.5', 'Φ31', '68', '37.5', '19.5', '138°', RH205],
    ],
  },
});

agriProducts.push({
  slug: 'v3-14-v3-12-series-valve',
  name: 'V3.14 V3.12 Series Swivel Valve',
  image: '/images/products/tyre-valves/v3-14-v3-12-series-valve001.webp',
  images: ['/images/products/tyre-valves/v3-14-v3-12-series-valve001.webp', '/images/products/tyre-valves/v3-14-v3-12-series-valve002.webp'],
  seoTitle: 'V3.14 V3.12 Series Swivel Valves | Φ26 Base, Φ15.7 Rim Hole',
  tagline: 'Swivel type valves V3.14.1-3 and V3.12.1-4 for agricultural machinery, Φ26 base, rim hole Φ15.7 (.625").',
  desc: 'V3.14 and V3.12 series swivel type tyre valves for tractors and agricultural machinery. The Φ26mm swivel base fits the Φ15.7mm (.625") rim hole, with multiple length and angle options for different wheel layouts. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'V3.14.1, V3.14.2, V3.14.3, V3.12.1, V3.12.2, V3.12.3, V3.12.4, swivel valve, tractor valve, agricultural valve',
  features: ['Swivel type, Φ26 base', 'Multiple length & angle options', 'Rim hole Φ15.7mm (.625")', 'Core & cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['ETRTO No.', 'Rel Length (D)', 'A (mm)', 'α/β°', 'Rim Hole'],
    rows: [
      ['V3.14.1', 'Φ26', '26', '147°', RH157],
      ['V3.14.2', 'Φ26', '45', '147°', RH157],
      ['V3.14.3', 'Φ26', '37', '147°', RH157],
      ['V3.12.1', 'Φ26', '40', '—', RH157],
      ['V3.12.2', 'Φ26', '95', '—', RH157],
      ['V3.12.3', 'Φ26', '65', '—', RH157],
      ['V3.12.4', 'Φ26', '90', '—', RH157],
    ],
  },
});

agriProducts.push({
  slug: 'tr1075a-tr1274a-screw-on-universal-valve',
  name: 'TR1075A-TR1274A Screw-On Universal Valve',
  image: '/images/products/tyre-valves/tr1075a-tr1274a-screw-on-universal-valve001.webp',
  images: ['/images/products/tyre-valves/tr1075a-tr1274a-screw-on-universal-valve001.webp', '/images/products/tyre-valves/tr1075a-tr1274a-screw-on-universal-valve002.webp'],
  seoTitle: 'TR1075A-TR1274A Screw-On Universal Valves | Agricultural & Off-Road',
  tagline: 'Screw-on universal tyre valves TR1075A to TR1274A for agricultural machinery, effective lengths 50-141mm.',
  desc: 'TR1075A to TR1274A screw-on universal type tyre valves for tractors, agricultural machinery and off-road vehicles. Ten length options from 50mm to 141mm cover different rim layouts. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TR1075A, TR1175A, TR1274A, screw-on universal valve, tractor valve, agricultural valve',
  features: ['Screw-on universal type', 'Ten length options 50-141mm', 'For tractors & agricultural machinery', 'Core & cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['Model', 'Thread/Base (mm)', 'Eff. Length (mm)'],
    rows: [
      ['TR1075A', '22.5', '76'],
      ['TR1076A', '22.5', '86'],
      ['TR1077A', '22.5', '105'],
      ['TR1078A', '22.5', '127'],
      ['TR1175A', '22.5', '115'],
      ['TR1177A', '22.5', '95'],
      ['TR1178A', '22.5', '135'],
      ['TR1179A', '22.5', '141'],
      ['TR1227A', '22.5', '50'],
      ['TR1274A', '22.5', '60'],
    ],
  },
});

agriProducts.push({
  slug: 'trj1076b-trj1079b-large-bore-valve',
  name: 'TRJ1076B-TRJ1079B Large Bore Valve',
  image: '/images/products/tyre-valves/trj1076b-trj1079b-large-bore-valve001.webp',
  images: ['/images/products/tyre-valves/trj1076b-trj1079b-large-bore-valve001.webp', '/images/products/tyre-valves/trj1076b-trj1079b-large-bore-valve002.webp'],
  seoTitle: 'TRJ1076B-TRJ1079B Large Bore Valves | Φ31.5 Base, Agricultural',
  tagline: 'Large-bore tyre valves TRJ1075B-TRJ1079B for agricultural machinery, Φ31.5 base, lengths 59-133mm, bend 68°-90°.',
  desc: 'TRJ1075B to TRJ1079B large-bore tyre valves for tractors, agricultural machinery and off-road vehicles. The Φ31.5mm base with multiple length and bend angle options (68°-90°) covers different wheel layouts. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TRJ1076B, TRJ1076C, TRJ1075B, TRJ1078B, TRJ1079B, large bore valve, tractor valve, agricultural valve',
  features: ['Large-bore type, Φ31.5 base', 'Nine length/angle combinations', 'Bend angles 68°-90°', 'Core & cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['Model', 'Base Φ (mm)', 'A (mm)', 'B (mm)', 'β°'],
    rows: [
      ['TRJ1076B', '31.5', '32', '83', '86°'],
      ['TRJ1076C', '31.5', '42', '73', '90°'],
      ['TRJ1076D', '31.5', '59', '59', '90°'],
      ['TRJ1076E', '31.5', '39', '76', '68°'],
      ['TRJ1075B', '31.5', '36', '108', '82°'],
      ['TRJ1075C', '31.5', '39', '105', '88°'],
      ['TRJ1078B', '31.5', '39', '118', '82°'],
      ['TRJ1078C', '31.5', '39', '124', '90°'],
      ['TRJ1079B', '31.5', '39', '133', '88°'],
    ],
  },
});

agriProducts.push({
  slug: 'tr650-tubeless-valve',
  name: 'TR650 Tubeless Valve',
  image: '/images/products/tyre-valves/tr650-tubeless-valve001.webp',
  images: ['/images/products/tyre-valves/tr650-tubeless-valve001.webp', '/images/products/tyre-valves/tr650-tubeless-valve002.webp'],
  seoTitle: 'TR650 Tubeless Valve | Agricultural & Off-Road, 70/80/90mm',
  tagline: 'TR650 tubeless tyre valve for agricultural machinery, three length options 70/80/90mm, rim hole Φ22.5.',
  desc: 'TR650 tubeless tyre valve for tractors, agricultural machinery and off-road vehicles, available in 70mm, 80mm and 90mm effective lengths, fitting the Φ22.5mm rim hole. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TR650 valve, TR650 tubeless valve, agricultural valve, tractor valve, off-road valve',
  features: ['Tubeless design', 'Three length options 70/80/90mm', 'Rim hole Φ22.5mm', 'Core & cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['Model', 'Eff. Length (mm)', 'Base (mm)', 'Rim Hole'],
    rows: [
      ['TR650', '70', '27.5', 'Φ22.5'],
      ['TR650', '80', '27.5', 'Φ22.5'],
      ['TR650', '90', '27.5', 'Φ22.5'],
    ],
  },
});

agriProducts.push({
  slug: 'tr690-valve',
  name: 'TR690 Valve',
  image: '/images/products/tyre-valves/tr690-valve001.webp',
  images: ['/images/products/tyre-valves/tr690-valve001.webp', '/images/products/tyre-valves/tr690-valve002.webp'],
  seoTitle: 'TR690 Valve | Agricultural & Off-Road, 70/80/100mm',
  tagline: 'TR690 tyre valve for agricultural machinery, three size options 70/80/100mm, rim hole Φ22.5.',
  desc: 'TR690 tyre valve for tractors, agricultural machinery and off-road vehicles, available in 70mm, 80mm and 100mm lengths, fitting the Φ22.5mm rim hole. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TR690 valve, agricultural valve, tractor valve, off-road valve',
  features: ['Three size options 70/80/100mm', 'Rim hole Φ22.5mm', 'Heavy-duty construction', 'Core & cap included', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['Model', 'Eff. Length (mm)', 'Size', 'Rim Hole'],
    rows: [
      ['TR690', '70', 'Φ26 x 70', 'Φ22.5'],
      ['TR690', '80', 'Φ26 x 80', 'Φ22.5'],
      ['TR690', '100', 'Φ26 x 90', 'Φ22.5'],
    ],
  },
});

agriProducts.push({
  slug: 'trj302-trj690-swivel-valve',
  name: 'TRJ302 TRJ690 Swivel Valve',
  image: '/images/products/tyre-valves/trj302-trj690-swivel-valve001.webp',
  images: ['/images/products/tyre-valves/trj302-trj690-swivel-valve001.webp', '/images/products/tyre-valves/trj302-trj690-swivel-valve002.webp'],
  seoTitle: 'TRJ302 TRJ690 Swivel Valves | Large Bore, Agricultural & Off-Road',
  tagline: 'Large-bore swivel type valves TRJ302 and TRJ690 for agricultural machinery and off-road vehicles.',
  desc: 'TRJ302 and TRJ690 large-bore swivel type tyre valves for tractors, agricultural machinery and off-road vehicles. The swiveling bent stem allows fast inflation and easy access on heavy equipment. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TRJ302 valve, TRJ690 valve, large bore swivel valve, tractor valve, agricultural valve, off-road valve',
  features: ['Large-bore swivel type', 'Bent stem for easy access', 'Heavy-duty brass construction', 'For tractors & off-road machinery', 'Factory direct, OEM/ODM & bulk supply'],
  spec: {
    headers: ['Model', 'Type', 'Application'],
    rows: [
      ['TRJ302', 'Large-bore swivel', 'Agricultural / off-road'],
      ['TRJ690', 'Large-bore swivel', 'Agricultural / off-road'],
    ],
  },
});

// 8 TRJ pages (full series table per merge rule)
const TRJ_SPEC = {
  headers: ['TR No.', 'A (mm)', 'B (mm)', 'α°', 'Rim/Valve Hole'],
  rows: [
    ['TRJ650-03', '27', '79', '80°', RH205],
    ['TRJ651-03', '32', '119', '90°', RH205],
    ['TRJ652-03', '27', '140', '86°', RH205],
    ['TRJ653-03', '27', '64', '80°', RH205],
    ['TRJ654-03', '27', '79', '60°', RH205],
    ['TRJ655-03', '24', '79', '74°', RH205],
    ['TRJ656-03', '67', '94', '90°', RH205],
    ['TRJ657-03', '27', '102', '80°', RH205],
    ['TRJ658-03', '27', '140', '80°', RH205],
    ['TRJ659-03', '48', '89', '90°', RH205],
    ['TRJ660-03', '48', '222', '90°', RH205],
    ['TRJ669-03', '27', '64', '90°', RH205],
    ['TRJ670-03', '41', '—', '—', RH205],
    ['TRSP2', '17', '—', '—', RH205],
  ],
};

const trjPages = [
  ['trj650-03-valve', 'TRJ650-03 Large Bore Valve', 'TRJ650-03 Large Bore Valve | 80° Swivel, A27 B79, Φ20.5 Rim Hole', '80° bend, A=27mm and B=79mm', 'an 80°', 'A=27mm base height and B=79mm stem length', ['80° bent stem for easy access', 'A=27mm, B=79mm'], 'TRJ650-03 valve'],
  ['trj651-03-valve', 'TRJ651-03 Large Bore Valve', 'TRJ651-03 Large Bore Valve | 90° Swivel, A32 B119, Φ20.5 Rim Hole', '90° bend, A=32mm and B=119mm', 'a 90°', 'A=32mm base height and B=119mm stem length', ['90° bent stem for easy access', 'A=32mm, B=119mm'], 'TRJ651-03 valve'],
  ['trj652-03-valve', 'TRJ652-03 Large Bore Valve', 'TRJ652-03 Large Bore Valve | 86° Swivel, A27 B140, Φ20.5 Rim Hole', '86° bend, A=27mm and B=140mm', 'an 86°', 'A=27mm base height and B=140mm stem length', ['86° bent long stem for easy access', 'A=27mm, B=140mm'], 'TRJ652-03 valve'],
  ['trj653-03-valve', 'TRJ653-03 Large Bore Valve', 'TRJ653-03 Large Bore Valve | 80° Swivel, A27 B64, Φ20.5 Rim Hole', '80° bend, A=27mm and B=64mm', 'an 80°', 'A=27mm base height and B=64mm stem length', ['80° bent compact stem', 'A=27mm, B=64mm'], 'TRJ653-03 valve'],
  ['trj657-03-valve', 'TRJ657-03 Large Bore Valve', 'TRJ657-03 Large Bore Valve | 80° Swivel, A27 B102, Φ20.5 Rim Hole', '80° bend, A=27mm and B=102mm', 'an 80°', 'A=27mm base height and B=102mm stem length', ['80° bent stem for easy access', 'A=27mm, B=102mm'], 'TRJ657-03 valve'],
  ['trj660-03-valve', 'TRJ660-03 Large Bore Valve', 'TRJ660-03 Large Bore Valve | 90° Swivel Long Stem, A48 B222, Φ20.5 Rim Hole', '90° bend, A=48mm and B=222mm', 'a 90°', 'A=48mm base height and B=222mm stem length', ['90° bent extra-long stem', 'A=48mm, B=222mm'], 'TRJ660-03 valve'],
].map(([slug, name, seoTitle, taglineDims, angleWord, dims, feats, kw]) => ({
  slug,
  name,
  image: `/images/products/tyre-valves/${slug}001.webp`,
  images: [`/images/products/tyre-valves/${slug}001.webp`, `/images/products/tyre-valves/${slug}002.webp`],
  seoTitle,
  tagline: `Large-bore brass swivel tyre valve for agricultural and off-road machinery, ${taglineDims}, rim hole Φ20.5 (.812").`,
  desc: `The ${name.replace(' Large Bore Valve', '')} large-bore brass swivel tyre valve is designed for tractors, agricultural machinery and off-road vehicles, with ${angleWord} bent stem for fast inflation and easy access on heavy equipment. ${dims}, fitting the Φ20.5mm (.812") rim hole. Hexagonal base with rubber grommet seal. Factory-direct with bulk and OEM/ODM options.`,
  keywords: `${kw}, large bore valve, tractor valve, agricultural valve, off-road valve, swivel valve, Φ20.5 rim hole`,
  features: ['Large-bore brass swivel type', ...feats, 'Rim hole Φ20.5mm (.812")', 'Hexagonal base & rubber grommet seal', 'Factory direct, OEM/ODM & bulk supply'],
  spec: TRJ_SPEC,
}));

agriProducts.push(...trjPages);

agriProducts.push({
  slug: 'trj670-03-valve',
  name: 'TRJ670-03 Large Bore Valve',
  image: '/images/products/tyre-valves/trj670-03-valve001.webp',
  images: ['/images/products/tyre-valves/trj670-03-valve001.webp', '/images/products/tyre-valves/trj670-03-valve002.webp'],
  seoTitle: 'TRJ670-03 Large Bore Valve | Straight, A=41mm, Φ20.5 Rim Hole',
  tagline: 'Large-bore brass straight tyre valve for agricultural and off-road machinery, A=41mm, rim hole Φ20.5 (.812").',
  desc: 'The TRJ670-03 large-bore brass straight tyre valve is designed for tractors, agricultural machinery and off-road vehicles. A=41mm overall height, fitting the Φ20.5mm (.812") rim hole. Hexagonal base with rubber grommet seal and threaded metal stem. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TRJ670-03 valve, large bore valve, tractor valve, agricultural valve, off-road valve, Φ20.5 rim hole',
  features: ['Large-bore brass construction', 'Straight stem, A=41mm', 'Rim hole Φ20.5mm (.812")', 'Hexagonal base & rubber grommet seal', 'Factory direct, OEM/ODM & bulk supply'],
  spec: TRJ_SPEC,
});

agriProducts.push({
  slug: 'trsp2-valve-spud',
  name: 'TRSP2 Valve Spud',
  image: '/images/products/tyre-valves/trsp2-valve-spud001.webp',
  images: ['/images/products/tyre-valves/trsp2-valve-spud001.webp', '/images/products/tyre-valves/trsp2-valve-spud002.webp'],
  seoTitle: 'TRSP2 Valve Spud | Brass Hexagonal Base, A=17mm, Φ20.5 Rim Hole',
  tagline: 'Brass hexagonal tube valve spud with rubber grommet for large-bore agricultural valves, A=17mm, rim hole Φ20.5 (.812").',
  desc: 'The TRSP2 brass hexagonal valve spud is the base adapter for large-bore agricultural and off-road tyre valves, with a black rubber grommet seal. A=17mm overall height, fitting the Φ20.5mm (.812") rim hole. Factory-direct with bulk and OEM/ODM options.',
  keywords: 'TRSP2 spud, valve spud, large bore valve base, agricultural valve spud, Φ20.5 rim hole',
  features: ['Brass hexagonal base', 'Black rubber grommet seal', 'A=17mm overall height', 'Rim hole Φ20.5mm (.812")', 'For large-bore agricultural valves', 'Factory direct, OEM/ODM & bulk supply'],
  spec: TRJ_SPEC,
});

// ---------- 5. assemble: insert agricultural subcategory before valve-extensions ----------
const agriText = agriHeader + '\n' + agriProducts.map(renderProduct).join(',\n') + ',\n' + v3Block + '\n      ]\n    }';

const veAnchor = '      ]\n    },\n    {\n      "slug": "valve-extensions"';
const veIdx = s.indexOf(veAnchor);
if (veIdx < 0) throw new Error('valve-extensions anchor not found');
s = s.slice(0, veIdx) + '      ]\n    },\n' + agriText + ',\n    {\n      "slug": "valve-extensions"' + s.slice(veIdx + veAnchor.length);

fs.writeFileSync(p, s);
console.log('4. rebuilt agricultural subcategory with', agriProducts.length + 5, 'products');
