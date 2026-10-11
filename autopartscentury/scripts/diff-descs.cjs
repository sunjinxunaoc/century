const fs = require('node:fs')

const FILE = 'src/data/products.js'
const MARKER = 'Factory-direct with bulk and OEM/ODM options.'

const extras = {
  'v3-18-1-swivel-valve': 'With its shorter 64 mm stem, the V3.18.1 is the choice when the valve seat sits close to the rim face. ',
  'v3-18-2-swivel-valve': 'The extended 81 mm stem of the V3.18.2 reaches valve seats set deeper in the disc, as found on larger tractor rear wheels. ',
  'v3-20-4-clamp-in-valve': 'Its 60 mm stem makes the V3-20-4 the compact option in the V3-20 series for standard truck and bus steel wheels. ',
  'v3-20-6-clamp-in-valve': 'With an 85 mm stem, the V3-20-6 is the long-reach variant in the V3-20 series, clearing deeper rim contours and wheel covers. ',
  'tr571c-clamp-in-valve': 'Its 62 mm reach suits standard single steel wheels on trucks and buses. ',
  'tr572c-clamp-in-valve': 'At 61 mm reach with the same 90 degree bend, the TR572C fits rim designs where clearance around the valve hole is tight. ',
  'tr573c-clamp-in-valve': 'The extended 77 mm reach of the TR573C clears deeper rim contours and inner dual-wheel positions on heavy trucks. ',
  '60ms-clamp-in-valve': 'The 60 mm overall length suits standard truck wheel boss depths. ',
  '40ms-clamp-in-valve': 'The shorter 40 mm body of the 40MS fits rims with limited valve boss depth. ',
  'tr621a-clamp-in-valve': 'The 75 mm stem of the TR621A reaches valve seats recessed in deeper agricultural implement rims. ',
  'tr623a-clamp-in-valve': 'At 57 mm stem length, the TR623A is the shorter-reach option in the TR62xA series for standard implement wheels. ',
  'trj650-03-valve': 'Its 79 mm stem length suits standard large-bore tractor wheel fittings. ',
  'trj657-03-valve': 'The 102 mm stem of the TRJ657-03 is the long-reach version, clearing deep-dish agricultural and off-road rims. ',
  'vc-8-valve-cap': 'The VC-8 is the standard dome profile of the series and the most-ordered plastic cap for general tire service. ',
  'vc-8sj-valve-cap': 'Compared with the standard VC-8 dome, the VC-8SJ offers an alternative profile in the same plastic series, giving buyers a second style option for private-label programs. ',
  'vt-valve-cap': 'The VT pairs a polished dome top with grooved grip bands for easy hand tightening. ',
  'fzt-valve-cap': 'The FZT combines a rounded dome with a straight-knurled grip and a smooth lower band. ',
  'dt-valve-cap': 'The DT uses a two-band knurled body with a low dome top, giving extra grip in greasy workshop conditions. ',
  'at-valve-cap': 'The AT combines a dome top with a hex shoulder, so it can be seated with a wrench as well as by hand. ',
  'ant-valve-cap': 'The ANT is a tall hex-body cap with a rounded crown, allowing wrench access along its full length. ',
  'apt-valve-cap': 'The APT has a flat-top hex profile that sits neatly against decorative wheel covers. ',
  'et-valve-cap': 'The ET is a full-hex, flat-top design - the most wrench-friendly cap in the range. ',
  '9001-valve-core': 'With a 3 kgf·cm installing torque, the 9001 is the standard-choice core for passenger car and light truck valve stems. ',
  '7001-valve-core': 'With a 4 kgf·cm installing torque, the 7001 is specified where a tighter core seat is required. ',
  '9002-valve-core': 'The red seal ring identifies it at a glance in the workshop, and the 3 kgf·cm installing torque matches standard passenger and light truck stems. ',
  '7002-valve-core': 'The red seal ring allows quick identification in the workshop, with a 4 kgf·cm installing torque for stems requiring a tighter seat. ',
  '6001-valve-core': 'It installs at 4 kgf·cm and is the standard-temperature core choice for large-bore agricultural and OTR valve stems. ',
  '8001-valve-core': 'It installs at 3 kgf·cm, matching large-bore stems specified to the lower torque standard. ',
  '6002-valve-core': 'The red seal ring allows quick identification, with a 4 kgf·cm installing torque for large-bore agricultural and OTR stems. ',
  '8002-valve-core': 'The red seal ring allows quick identification, with a 3 kgf·cm installing torque matching lower-torque large-bore stems. ',
}

let text = fs.readFileSync(FILE, 'utf8')
let done = 0
for (const [slug, sentence] of Object.entries(extras)) {
  const slugIdx = text.indexOf(`"slug": "${slug}"`)
  if (slugIdx < 0) { console.error('SLUG NOT FOUND:', slug); continue }
  const descIdx = text.indexOf('"desc": "', slugIdx)
  const markerIdx = text.indexOf(MARKER, descIdx)
  if (descIdx < 0 || markerIdx < 0) { console.error('DESC/MARKER NOT FOUND:', slug); continue }
  text = text.slice(0, markerIdx) + sentence + text.slice(markerIdx)
  done++
}
fs.writeFileSync(FILE, text, 'utf8')
console.log(`updated ${done}/${Object.keys(extras).length} descriptions`)
