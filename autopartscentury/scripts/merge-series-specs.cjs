const fs = require('fs');
const p = 'src/data/products.js';
let s = fs.readFileSync(p, 'utf8');

const RH97 = 'Φ9.7 (.390")';
const RH16 = 'Φ16 (.625")';
const RH159 = 'Φ15.9 (.625")';
const RH205 = 'Φ20.5 (.812")';
const D = '—';

const GROUPS = {};

function add(slugs, headers, rows) {
  for (const slug of slugs) GROUPS[slug] = { headers, rows };
}

add(
  ['tr412-snap-in-valve','tr413-snap-in-valve','tr414-snap-in-tubeless-valve','tr414l-snap-in-valve','tr415-snap-in-valve','tr418-snap-in-valve','tr423-snap-in-valve','tr425-snap-in-valve','tr438-snap-in-valve'],
  ['Model','A (mm)','B (mm)','Rim Hole (mm)','Core','Max Pressure'],
  [
    ['TR412','22','34','11.5','9002#','65psi / 4.5bar'],
    ['TR413','32','42','11.5','9002#','65psi / 4.5bar'],
    ['TR414','38','48','11.5','9002#','65psi / 4.5bar'],
    ['TR414L','46','56.5','11.5','9002#','65psi / 4.5bar'],
    ['TR415','32','42','15.9','9002#','65psi / 4.5bar'],
    ['TR418','51','62','11.5','9002#','65psi / 4.5bar'],
    ['TR423','63','74','11.5','9002#','65psi / 4.5bar'],
    ['TR425','51','62','15.9','9002#','65psi / 4.5bar'],
    ['TR438','40.5','31','8.8','9002#','65psi / 4.5bar'],
  ]
);

add(
  ['tr600hp-snap-in-valve','tr602hp-snap-in-valve','tr801hp-snap-in-valve','tr802hp-snap-in-valve'],
  ['Model','A (mm)','B (mm)','Rim Hole (mm)','Type'],
  [
    ['TR600HP','32','44','11.5','High pressure snap-in'],
    ['TR602HP','51','63','11.5','High pressure snap-in'],
    ['TR801HP','33','48','15.9','High pressure snap-in'],
    ['TR802HP','51','66','15.9','High pressure snap-in'],
  ]
);

add(
  ['tr416-clamp-in-valve','tr416l-clamp-in-valve','tr416ss-clamp-in-valve'],
  ['Model','Type','Material','Application'],
  [
    ['TR416','Clamp-in','Metal + rubber grommet','Passenger car / light truck'],
    ['TR416L','Clamp-in, long','Metal + rubber grommet','Light truck / trailer'],
    ['TR416SS','Clamp-in, extra short','Metal + rubber grommet','Passenger car'],
  ]
);

add(
  ['tr525-valve-stem','ms525al-valve-stem','ms525l-valve-stem','ms525s-valve-stem'],
  ['Model','Type','Material','Application'],
  [
    ['TR525','Clamp-in','Metal + rubber grommet','Passenger car / light truck'],
    ['MS525AL','Clamp-in, long','Aluminum','Passenger car / light truck'],
    ['MS525L','Clamp-in, long','Metal + rubber grommet','Passenger car / light truck'],
    ['MS525S','Clamp-in, short','Metal + rubber grommet','Passenger car'],
  ]
);

add(
  ['vs-8-clamp-in-valve','vs-8-45-clamp-in-valve','vs-8-90-clamp-in-valve','vs-6-clamp-in-valve'],
  ['Model','Type','Material','Application'],
  [
    ['VS-8','Clamp-in, straight','Metal + rubber grommet','Passenger car'],
    ['VS-8-45','Clamp-in, 45° bend','Metal + rubber grommet','Passenger car'],
    ['VS-8-90','Clamp-in, 90° bend','Metal + rubber grommet','Passenger car'],
    ['VS-6','Clamp-in, straight','Metal + rubber grommet','Passenger car'],
  ]
);

add(
  ['pvr30-motorcycle-valve','pvr32-motorcycle-valve','pvr40-motorcycle-valve','pvr50-motorcycle-valve','pvr60-motorcycle-valve','pvr70-motorcycle-valve'],
  ['Model','Rim Hole (mm)','Bend','Max Pressure','Type / Finish'],
  [
    ['PVR30',D,'90°',D,'Tubeless'],
    ['PVR32',D,'90°',D,'Tubeless, black / blue / orange anodized'],
    ['PVR40','8.3 - 9','45° / 90°','65psi','Tubeless'],
    ['PVR50','9.5 - 10','45° / 90°','65psi','Tubeless'],
    ['PVR60','10 - 10.5','45° / 90°','65psi','Tubeless'],
    ['PVR70','11.5','45° / 90°','65psi','Tubeless'],
  ]
);

add(
  ['v3-20-6-clamp-in-valve','v3-20-11-clamp-in-valve','v3-20-1-clamp-in-valve','v3-20-4-tpms-clamp-in-valve','v3-20-4-clamp-in-valve','58ms-clamp-in-valve'],
  ['ETRTO No.','A (mm)','B (mm)','C (mm)','β°','Rim Hole'],
  [
    ['V3-20-1','41',D,D,D,RH97],
    ['V3-20-2','30','60',D,'17°',RH97],
    ['V3-20-3',D,'87',D,D,RH97],
    ['V3-20-4','25','60',D,'27°',RH97],
    ['V3-20-4 (TPMS)','25','60',D,'27°',RH97],
    ['V3-20-5','25','40',D,'27°',RH97],
    ['V3-20-6','25','85',D,'27°',RH97],
    ['V3-20-7','25','50',D,'27°',RH97],
    ['V3-20-8','29','85',D,'12°',RH97],
    ['V3-20-9','45','52',D,'12°',RH97],
    ['V3-20-10','50','25',D,'28°',RH97],
    ['V3-20-11','25','45','25','27°',RH97],
    ['V3-20-12','25','70',D,'27°',RH97],
    ['58MS','25','28',D,'45°',RH97],
    ['150MS-27','25','120',D,'27°',RH97],
  ]
);

add(
  ['tr500-clamp-in-valve','tr501-clamp-in-valve','tr571-clamp-in-valve','tr572-clamp-in-valve','tr573-clamp-in-valve','tr575-clamp-in-valve'],
  ['TR No.','A (mm)','Rim Hole'],
  [
    ['TR500','51',RH159],
    ['TR501','38',RH159],
    ['TR570','79.5',RH159],
    ['TR571','86',RH159],
    ['TR572','95',RH159],
    ['TR573','111',RH159],
    ['TR574','127',RH159],
    ['TR575','28.5',RH159],
  ]
);

add(
  ['tr570c-clamp-in-valve','tr571c-clamp-in-valve','tr572c-clamp-in-valve','tr573c-clamp-in-valve'],
  ['ETRTO No.','A (mm)','B (mm)','β°','Rim Hole'],
  [
    ['TR570C','33','51','90°',RH16],
    ['TR571C','34','62','90°',RH16],
    ['TR572C','34','61','90°',RH16],
    ['TR573C','34','77','90°',RH16],
  ]
);

const CORE_H = ['TR No.','Feature','Working Pressure kgf/cm² (lbf/in²)','Working Temperature Range','Installing Torque (kgf·cm)'];
const STD = 'Standard Type';
const HLT = 'High/Low Temperature Resistant';
const WP = '0-15 (0-212)';
const T1 = '-40~+100°C (-40~+212°F)';
const T2 = '-54~+150°C (-65~+302°F)';
add(
  ['9001-valve-core','9002-valve-core','7001-valve-core','7002-valve-core','6001-valve-core','6002-valve-core','8001-valve-core','8002-valve-core'],
  CORE_H,
  [
    ['9001',STD,WP,T1,'3'],
    ['9002',HLT,WP,T2,'3'],
    ['7001',STD,WP,T1,'4'],
    ['7002',HLT,WP,T2,'4'],
    ['6001',STD,WP,T1,'4'],
    ['6002',HLT,WP,T2,'4'],
    ['8001',STD,WP,T1,'3'],
    ['8002',HLT,WP,T2,'3'],
  ]
);

add(
  ['tr618-clamp-in-valve','tr618a-clamp-in-valve','tr618b-clamp-in-valve','tr621a-clamp-in-valve','tr622a-clamp-in-valve','tr623a-clamp-in-valve'],
  ['ETRTO No.','A (mm)','B (mm)','β°','Rim Hole'],
  [
    ['TR618','30',D,D,RH16],
    ['TR618A','36',D,D,RH16],
    ['TR618B','22.5',D,D,RH16],
    ['TR621A','39','75','65°',RH16],
    ['TR622A','44.5','115','90°',RH16],
    ['TR623A','39','57','65°',RH16],
  ]
);

add(
  ['70ms-7-clamp-in-valve','60ms-clamp-in-valve','40ms-clamp-in-valve'],
  ['ETRTO No.','A (mm)','B (mm)','β°','Rim Hole'],
  [
    ['70MS-7','37','28','7°',RH97],
    ['60MS','60',D,D,RH97],
    ['40MS','40',D,D,RH97],
  ]
);

add(
  ['trj650-03-valve','trj651-03-valve','trj652-03-valve','trj653-03-valve','trj657-03-valve','trj660-03-valve','trj670-03-valve','trsp2-valve-spud'],
  ['TR No.','A (mm)','B (mm)','α°','Rim/Valve Hole'],
  [
    ['TRJ650-03','27','79','80°',RH205],
    ['TRJ651-03','32','119','90°',RH205],
    ['TRJ652-03','27','140','86°',RH205],
    ['TRJ653-03','27','64','80°',RH205],
    ['TRJ654-03','27','79','60°',RH205],
    ['TRJ655-03','24','79','74°',RH205],
    ['TRJ656-03','67','94','90°',RH205],
    ['TRJ657-03','27','102','80°',RH205],
    ['TRJ658-03','27','140','80°',RH205],
    ['TRJ659-03','48','89','90°',RH205],
    ['TRJ660-03','48','222','90°',RH205],
    ['TRJ669-03','27','64','90°',RH205],
    ['TRJ670-03','41',D,D,RH205],
    ['TRSP2','17',D,D,RH205],
  ]
);

function findMatchingBrace(str, openIdx) {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = openIdx; i < str.length; i++) {
    const c = str[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  throw new Error('no matching brace');
}

function renderSpec(spec) {
  const H = spec.headers.map(h => JSON.stringify(h)).join(', ');
  const rows = spec.rows.map(r => '              [' + r.map(c => JSON.stringify(c)).join(', ') + ']').join(',\n');
  return '"spec": {\n            "headers": [' + H + '],\n            "rows": [\n' + rows + '\n            ]\n          }';
}

let count = 0;
for (const [slug, spec] of Object.entries(GROUPS)) {
  const slugIdx = s.indexOf('"slug": "' + slug + '"');
  if (slugIdx < 0) throw new Error('slug not found: ' + slug);
  const specIdx = s.indexOf('"spec":', slugIdx);
  const openIdx = s.indexOf('{', specIdx);
  const closeIdx = findMatchingBrace(s, openIdx);
  s = s.slice(0, specIdx) + renderSpec(spec) + s.slice(closeIdx + 1);
  count++;
}
fs.writeFileSync(p, s);
console.log('updated', count, 'product spec tables');
