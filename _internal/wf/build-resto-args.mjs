#!/usr/bin/env node
// Build Workflow args for restaurants-roundup.js for a given province, using ONLY real hotel
// roundups that exist on disk (owner rule: ls roundups | grep <city>, use only what exists).
// Usage: node _internal/wf/build-resto-args.mjs <city-slug> ["ชื่อจังหวัดไทย"] ["regionKey"]
//   regionKey ∈ north|northeast|central|east|west|south  (default auto by lookup table)
// Prints the args JSON (pipe to a file or paste into the Workflow call).
import fs from 'fs';
const IMG_BASE = 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev';
const asset = p => !p ? '' : (/^https?:\/\//.test(p) ? p : IMG_BASE + (p.startsWith('/') ? p : '/' + p));

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
  // ── added 2026-06-24: complete all 77 provinces ──
  'lamphun': { th: 'ลำพูน', region: 'north' },
  'mae-hong-son': { th: 'แม่ฮ่องสอน', region: 'north' },
  'phayao': { th: 'พะเยา', region: 'north' },
  'phrae': { th: 'แพร่', region: 'north' },
  'uttaradit': { th: 'อุตรดิตถ์', region: 'north' },
  'tak': { th: 'ตาก', region: 'north' },
  'phichit': { th: 'พิจิตร', region: 'north' },
  'kamphaeng-phet': { th: 'กำแพงเพชร', region: 'north' },
  'nakhon-sawan': { th: 'นครสวรรค์', region: 'north' },
  'uthai-thani': { th: 'อุทัยธานี', region: 'north' },
  'surin': { th: 'สุรินทร์', region: 'northeast' },
  'sisaket': { th: 'ศรีสะเกษ', region: 'northeast' },
  'roi-et': { th: 'ร้อยเอ็ด', region: 'northeast' },
  'chaiyaphum': { th: 'ชัยภูมิ', region: 'northeast' },
  'maha-sarakham': { th: 'มหาสารคาม', region: 'northeast' },
  'nong-khai': { th: 'หนองคาย', region: 'northeast' },
  'nong-bua-lamphu': { th: 'หนองบัวลำภู', region: 'northeast' },
  'sakon-nakhon': { th: 'สกลนคร', region: 'northeast' },
  'nakhon-phanom': { th: 'นครพนม', region: 'northeast' },
  'mukdahan': { th: 'มุกดาหาร', region: 'northeast' },
  'kalasin': { th: 'กาฬสินธุ์', region: 'northeast' },
  'yasothon': { th: 'ยโสธร', region: 'northeast' },
  'amnat-charoen': { th: 'อำนาจเจริญ', region: 'northeast' },
  'bueng-kan': { th: 'บึงกาฬ', region: 'northeast' },
  'nonthaburi': { th: 'นนทบุรี', region: 'central' },
  'pathum-thani': { th: 'ปทุมธานี', region: 'central' },
  'samut-prakan': { th: 'สมุทรปราการ', region: 'central' },
  'samut-sakhon': { th: 'สมุทรสาคร', region: 'central' },
  'samut-songkhram': { th: 'สมุทรสงคราม', region: 'central' },
  'nakhon-pathom': { th: 'นครปฐม', region: 'central' },
  'nakhon-nayok': { th: 'นครนายก', region: 'central' },
  'ang-thong': { th: 'อ่างทอง', region: 'central' },
  'sing-buri': { th: 'สิงห์บุรี', region: 'central' },
  'chai-nat': { th: 'ชัยนาท', region: 'central' },
  'lopburi': { th: 'ลพบุรี', region: 'central' },
  'saraburi': { th: 'สระบุรี', region: 'central' },
  'suphan-buri': { th: 'สุพรรณบุรี', region: 'central' },
  'prachinburi': { th: 'ปราจีนบุรี', region: 'east' },
  'sa-kaeo': { th: 'สระแก้ว', region: 'east' },
  'chachoengsao': { th: 'ฉะเชิงเทรา', region: 'east' },
  'ratchaburi': { th: 'ราชบุรี', region: 'west' },
  'trang': { th: 'ตรัง', region: 'south' },
  'satun': { th: 'สตูล', region: 'south' },
  'phatthalung': { th: 'พัทลุง', region: 'south' },
  'chumphon': { th: 'ชุมพร', region: 'south' },
  'ranong': { th: 'ระนอง', region: 'south' },
  'pattani': { th: 'ปัตตานี', region: 'south' },
  'yala': { th: 'ยะลา', region: 'south' },
  'narathiwat': { th: 'นราธิวาส', region: 'south' },
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
  return { slug: f.replace('.json', ''), title, n: (o.entries || []).length, img: asset(o.heroImg || o.image || '') };
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

// rail (sticky hotel cards): the broad roundup + top single-hotel reviews (with R2 images) — aim 3-4 cards, every card with an img
const VDIR = 'astro/src/content/reviews/';
let reviews = [];
try {
  reviews = fs.readdirSync(VDIR).filter(f => f.endsWith('.json') && f.includes('-' + CITY + '.')).map(f => {
    const o = JSON.parse(fs.readFileSync(VDIR + f, 'utf8'));
    return { slug: f.replace('.json', ''), name: (o.name || '').replace(/<[^>]+>/g, '').trim(), score: +o.score || 0, img: asset(o.heroImg || o.image || ''), loc: (o.badgeLoc || o.addressLocality || '').replace(/^📍\s*/, '').trim(), price: o.priceRange || '' };
  }).filter(r => r.img && r.name);
} catch {}
reviews.sort((a, b) => b.score - a.score);
const rail = [{ title: def.title, href: `${def.slug}.html`, note: def.n ? `${def.n} โรงแรมคัดมาแล้ว` : 'รวมที่พักคัดแล้ว', img: def.img || (reviews[0] && reviews[0].img) || '' }];
reviews.slice(0, 3).forEach(r => rail.push({ title: r.name, href: `${r.slug}.html`, note: [r.loc, r.price].filter(Boolean).join(' · '), img: r.img }));
const related = [{ href: `city-${CITY}.html`, title: `🧭 เที่ยว${meta.display || provTh} — ที่พัก ที่กิน ที่เที่ยว` }, ...roundups.slice(0, 2).map(r => ({ href: `${r.slug}.html`, title: `🏨 ${r.title}` }))];

const out = {
  prov: provTh, city: CITY, slug: `top10-popular-restaurants-${CITY}`, today: '2026-06-20',
  ...(meta.display ? { display: meta.display } : {}),
  ...(meta.hi ? { hi: meta.hi } : {}),
  region: { label: regionLabel, href: regionHref },
  stayDefault, stayMap: [], stayCta, rail, related,
};
console.error(`[build-resto-args] ${CITY}: ${roundups.length} roundups · ${reviews.length} single reviews · rail=${rail.length} cards · stayCta links=${ctaPool.length}`);
console.log(JSON.stringify(out, null, 2));
