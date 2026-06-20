#!/usr/bin/env node
// Build Workflow args for restaurants-roundup.js for a given province, using ONLY real hotel
// roundups that exist on disk (owner rule: ls roundups | grep <city>, use only what exists).
// Usage: node _internal/wf/build-resto-args.mjs <city-slug> ["ชื่อจังหวัดไทย"] ["regionKey"]
//   regionKey ∈ north|northeast|central|east|west|south  (default auto by lookup table)
// Prints the args JSON (pipe to a file or paste into the Workflow call).
import fs from 'fs';

const CITY = process.argv[2];
if (!CITY) { console.error('need <city-slug>'); process.exit(1); }

// province slug → { th, region, display?, hi? }  (display/hi only for special naming e.g. Bangkok)
const PROV = {
  'bangkok': { th: 'กรุงเทพมหานคร', region: 'central', display: 'กรุงเทพฯ', hi: 'กรุงเทพฯ' },
  'chiang-mai': { th: 'เชียงใหม่', region: 'north' },
  'chiang-rai': { th: 'เชียงราย', region: 'north' },
  'phuket': { th: 'ภูเก็ต', region: 'south' },
  'krabi': { th: 'กระบี่', region: 'south' },
  'chonburi': { th: 'ชลบุรี', region: 'east' },
  'rayong': { th: 'ระยอง', region: 'east' },
  'kanchanaburi': { th: 'กาญจนบุรี', region: 'west' },
  'ayutthaya': { th: 'พระนครศรีอยุธยา', region: 'central' },
  'nakhon-ratchasima': { th: 'นครราชสีมา', region: 'northeast' },
  'khon-kaen': { th: 'ขอนแก่น', region: 'northeast' },
  'udon-thani': { th: 'อุดรธานี', region: 'northeast' },
  'ubon-ratchathani': { th: 'อุบลราชธานี', region: 'northeast' },
  'surat-thani': { th: 'สุราษฎร์ธานี', region: 'south' },
  'songkhla': { th: 'สงขลา', region: 'south' },
  'nakhon-si-thammarat': { th: 'นครศรีธรรมราช', region: 'south' },
  'prachuap-khiri-khan': { th: 'ประจวบคีรีขันธ์', region: 'west' },
  'phetchaburi': { th: 'เพชรบุรี', region: 'west' },
  'phang-nga': { th: 'พังงา', region: 'south' },
  'trat': { th: 'ตราด', region: 'east' },
  'chanthaburi': { th: 'จันทบุรี', region: 'east' },
  'nan': { th: 'น่าน', region: 'north' },
  'lampang': { th: 'ลำปาง', region: 'north' },
  'sukhothai': { th: 'สุโขทัย', region: 'north' },
  'phitsanulok': { th: 'พิษณุโลก', region: 'north' },
  'loei': { th: 'เลย', region: 'northeast' },
  'buriram': { th: 'บุรีรัมย์', region: 'northeast' },
  'phetchabun': { th: 'เพชรบูรณ์', region: 'central' },
};
const REGION_HUB = { north:['ภาคเหนือ','region-north.html'], northeast:['ภาคอีสาน','region-isan.html'],
  central:['ภาคกลาง','region-central.html'], east:['ภาคตะวันออก','region-east.html'],
  west:['ภาคตะวันตก','region-west.html'], south:['ภาคใต้','region-south.html'] };

const meta = PROV[CITY] || {};
const provTh = process.argv[3] || meta.th || CITY;
const regionKey = process.argv[4] || meta.region || 'central';
const [regionLabel, regionHref] = REGION_HUB[regionKey] || REGION_HUB.central;

// find real roundups for this city
const RDIR = 'astro/src/content/roundups/';
const files = fs.readdirSync(RDIR).filter(f => f.endsWith('.json') && f.includes(CITY));
if (!files.length) { console.error(`NO hotel roundups for "${CITY}" — pick a province that has them first`); process.exit(2); }
const roundups = files.map(f => {
  const o = JSON.parse(fs.readFileSync(RDIR + f, 'utf8'));
  const title = (o.h1 || o.title || f).replace(/<[^>]+>/g, '').replace(/\s*\|.*$/, '').trim();
  return { slug: f.replace('.json', ''), title, n: (o.entries || []).length };
});
// stayDefault: prefer the broad "all/popular hotels" roundup
const pref = [`top10-hotels-${CITY}`, `top10-popular-hotels-${CITY}`, `top15-popular-hotels-${CITY}`, `top5-popular-hotels-${CITY}`];
const def = roundups.find(r => pref.includes(r.slug)) || roundups[0];
const stayDefault = { href: `${def.slug}.html`, label: `ที่พักทำเลดีใน${meta.display || provTh}` };
// stayCta links: up to 4 distinct roundups (default first), labels from their titles
const ctaPool = [def, ...roundups.filter(r => r.slug !== def.slug)].slice(0, 4);
const stayCta = {
  links: ctaPool.map(r => ({ label: `🏨 ${r.title}`, href: `${r.slug}.html`, note: r.n ? `${r.n} ที่พักคัดมาแล้ว` : 'คัดมาให้แล้ว' })),
  ctaLabel: `🔍 เช็คราคาที่พัก${meta.display || provTh} (Agoda)`,
  ctaHref: `https://www.agoda.com/th-th/city/${CITY}-th.html?cid=1965862`,
};

const out = {
  prov: provTh, city: CITY, slug: `top10-popular-restaurants-${CITY}`, today: '2026-06-20',
  ...(meta.display ? { display: meta.display } : {}),
  ...(meta.hi ? { hi: meta.hi } : {}),
  region: { label: regionLabel, href: regionHref },
  stayDefault, stayMap: [], stayCta,
};
console.error(`[build-resto-args] ${CITY}: ${roundups.length} roundups found · stayDefault=${def.slug} · stayCta links=${ctaPool.length}`);
console.log(JSON.stringify(out, null, 2));
