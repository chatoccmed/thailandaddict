// Generate homepage dynamic data from content: province map data (PROV, all 77, both locales)
// + hero stat numbers — injected into astro/public/index.html and astro/public/en/index.html.
// Run: node _internal/gen-home.mjs  (also wired as astro prebuild so it refreshes every build)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');

// region meta: display name (th/en) + pin colour
const REGION = {
  n:  { th: 'ภาคเหนือ',   en: 'North',   color: '#06B6D4' },
  ne: { th: 'อีสาน',      en: 'Isan',    color: '#FBBF24' },
  c:  { th: 'ภาคกลาง',    en: 'Central', color: '#FB7185' },
  e:  { th: 'ภาคตะวันออก', en: 'East',    color: '#10B981' },
  w:  { th: 'ภาคตะวันตก',  en: 'West',    color: '#A78BFA' },
  s:  { th: 'ภาคใต้',     en: 'South',   color: '#F97316' },
};

// [slug, region, lat, lng] — provincial capitals (popular destinations first, then by region)
const PV = [
  // ── popular first (TOPDEST) ──
  ['bangkok','c',13.75,100.50],['chiang-mai','n',18.79,98.98],['phuket','s',7.88,98.39],['krabi','s',8.09,98.91],
  ['chiang-rai','n',19.91,99.84],['chonburi','e',13.36,100.98],['surat-thani','s',9.14,99.33],['prachuap-khiri-khan','w',12.57,99.96],
  ['kanchanaburi','w',14.02,99.53],['ayutthaya','c',14.35,100.58],['rayong','e',12.68,101.28],['trat','e',12.24,102.51],
  ['phang-nga','s',8.45,98.53],['nan','n',18.78,100.77],['mae-hong-son','n',19.30,97.97],['sukhothai','n',17.01,99.82],
  ['nakhon-ratchasima','ne',14.97,102.10],['phetchabun','n',16.42,101.16],
  // ── north (rest) ──
  ['lamphun','n',18.58,99.01],['lampang','n',18.29,99.49],['phayao','n',19.17,99.90],['phrae','n',18.14,100.14],
  ['uttaradit','n',17.62,100.10],['phitsanulok','n',16.82,100.27],['tak','n',16.87,99.13],['kamphaeng-phet','n',16.48,99.52],
  ['phichit','n',16.44,100.35],['nakhon-sawan','n',15.70,100.14],['uthai-thani','n',15.38,100.02],
  // ── isan (rest) ──
  ['buriram','ne',14.99,103.10],['surin','ne',14.88,103.49],['sisaket','ne',15.12,104.32],['ubon-ratchathani','ne',15.24,104.85],
  ['yasothon','ne',15.79,104.15],['chaiyaphum','ne',15.81,102.03],['amnat-charoen','ne',15.86,104.63],['nong-bua-lamphu','ne',17.20,102.44],
  ['khon-kaen','ne',16.44,102.83],['udon-thani','ne',17.41,102.79],['loei','ne',17.49,101.73],['nong-khai','ne',17.88,102.74],
  ['maha-sarakham','ne',16.18,103.30],['roi-et','ne',16.05,103.65],['kalasin','ne',16.43,103.51],['sakon-nakhon','ne',17.16,104.15],
  ['nakhon-phanom','ne',17.39,104.78],['mukdahan','ne',16.54,104.72],['bueng-kan','ne',18.36,103.65],
  // ── central (rest) ──
  ['nonthaburi','c',13.86,100.51],['pathum-thani','c',14.02,100.53],['samut-prakan','c',13.60,100.60],['samut-sakhon','c',13.55,100.27],
  ['samut-songkhram','c',13.41,100.00],['nakhon-pathom','c',13.82,100.06],['ang-thong','c',14.59,100.45],['lopburi','c',14.80,100.65],
  ['sing-buri','c',14.89,100.40],['chai-nat','c',15.19,100.13],['saraburi','c',14.53,100.91],['suphan-buri','c',14.47,100.12],['nakhon-nayok','c',14.21,101.21],
  // ── east (rest) ──
  ['chanthaburi','e',12.61,102.10],['chachoengsao','e',13.69,101.07],['prachinburi','e',14.05,101.37],['sa-kaeo','e',13.81,102.07],
  // ── west (rest) ──
  ['ratchaburi','w',13.54,99.81],['phetchaburi','w',13.11,99.94],
  // ── south (rest) ──
  ['chumphon','s',10.49,99.18],['ranong','s',9.96,98.64],['nakhon-si-thammarat','s',8.43,99.96],['phatthalung','s',7.62,100.08],
  ['trang','s',7.56,99.61],['satun','s',6.62,100.07],['songkhla','s',7.20,100.60],['pattani','s',6.87,101.25],
  ['yala','s',6.54,101.28],['narathiwat','s',6.43,101.82],
];

// English city names (mirror gen-hubs.mjs EN_NAME — provinces)
const EN_NAME = {
  'amnat-charoen':'Amnat Charoen','ang-thong':'Ang Thong','ayutthaya':'Ayutthaya','bangkok':'Bangkok','bueng-kan':'Bueng Kan','buriram':'Buriram','chachoengsao':'Chachoengsao','chai-nat':'Chai Nat','chaiyaphum':'Chaiyaphum','chanthaburi':'Chanthaburi','chiang-mai':'Chiang Mai','chiang-rai':'Chiang Rai','chonburi':'Chonburi','chumphon':'Chumphon','kalasin':'Kalasin','kamphaeng-phet':'Kamphaeng Phet','kanchanaburi':'Kanchanaburi','khon-kaen':'Khon Kaen','krabi':'Krabi','lampang':'Lampang','lamphun':'Lamphun','loei':'Loei','lopburi':'Lopburi','mae-hong-son':'Mae Hong Son','maha-sarakham':'Maha Sarakham','mukdahan':'Mukdahan','nakhon-nayok':'Nakhon Nayok','nakhon-pathom':'Nakhon Pathom','nakhon-phanom':'Nakhon Phanom','nakhon-ratchasima':'Nakhon Ratchasima','nakhon-sawan':'Nakhon Sawan','nakhon-si-thammarat':'Nakhon Si Thammarat','nan':'Nan','narathiwat':'Narathiwat','nong-bua-lamphu':'Nong Bua Lamphu','nong-khai':'Nong Khai','nonthaburi':'Nonthaburi','pathum-thani':'Pathum Thani','pattani':'Pattani','phang-nga':'Phang Nga','phatthalung':'Phatthalung','phayao':'Phayao','phetchabun':'Phetchabun','phetchaburi':'Phetchaburi','phichit':'Phichit','phitsanulok':'Phitsanulok','phrae':'Phrae','phuket':'Phuket','prachinburi':'Prachinburi','prachuap-khiri-khan':'Prachuap Khiri Khan','ranong':'Ranong','ratchaburi':'Ratchaburi','rayong':'Rayong','roi-et':'Roi Et','sa-kaeo':'Sa Kaeo','sakon-nakhon':'Sakon Nakhon','samut-prakan':'Samut Prakan','samut-sakhon':'Samut Sakhon','samut-songkhram':'Samut Songkhram','saraburi':'Saraburi','satun':'Satun','sing-buri':'Sing Buri','sisaket':'Sisaket','songkhla':'Songkhla','sukhothai':'Sukhothai','suphan-buri':'Suphan Buri','surat-thani':'Surat Thani','surin':'Surin','tak':'Tak','trang':'Trang','trat':'Trat','ubon-ratchathani':'Ubon Ratchathani','udon-thani':'Udon Thani','uthai-thani':'Uthai Thani','uttaradit':'Uttaradit','yala':'Yala','yasothon':'Yasothon',
};
const thNameOf = slug => { // read Thai name from province-data
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/province-data', slug + '.json'), 'utf8')).th || slug; } catch { return slug; }
};
const taglineOf = (slug, loc) => {
  const dir = loc === 'en' ? 'province-data-en' : 'province-data';
  try { const t = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal', dir, slug + '.json'), 'utf8')).tagline; return (t || '').replace(/'/g, '’'); } catch { return ''; }
};

function buildPROV(loc) {
  return PV.map(([slug, r, lat, lng]) => {
    const n = loc === 'en' ? (EN_NAME[slug] || slug) : thNameOf(slug);
    const rn = loc === 'en' ? REGION[r].en : REGION[r].th;
    const t = taglineOf(slug, loc);
    return ` {s:'${slug}',n:'${n.replace(/'/g, "\\'")}',r:'${rn}',t:'${t.replace(/'/g, "\\'")}',lat:${lat},lng:${lng},c:'${REGION[r].color}'}`;
  }).join(',\n');
}

// ── stats from content ──
const C = p => fs.existsSync(path.join(ROOT, 'astro/src/content', p)) ? fs.readdirSync(path.join(ROOT, 'astro/src/content', p)).filter(f => f.endsWith('.json')) : [];
const reviews = C('reviews'), articles = C('articles'), roundups = C('roundups');
// provinces (of the 77) that have any content
const provSlugs = new Set(PV.map(p => p[0]));
const withContent = new Set();
for (const coll of [['reviews', reviews], ['articles', articles], ['roundups', roundups]]) {
  for (const f of coll[1]) { try { const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/content', coll[0], f), 'utf8')).cluster; if (provSlugs.has(c)) withContent.add(c); } catch {} }
}
const floorPlus = n => n >= 100 ? (Math.floor(n / 100) * 100).toLocaleString() + '+' : String(n);
const STATS = {
  provinces: String(withContent.size || provSlugs.size),
  reviews: floorPlus(reviews.length),
  articles: floorPlus(articles.length),
};

// ── activity / theme guides (best-*) → homepage cards, auto-derived from content each build so the
//    homepage surfaces new guides automatically (no hand-editing). EN reads the articles-en twin. ──
const esc = s => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\\/g, '').replace(/'/g, '’').replace(/\s+/g, ' ').trim();
function guideCards(loc) {
  const dir = path.join(ROOT, 'astro/src/content', loc === 'en' ? 'articles-en' : 'articles');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.startsWith('best-') && f.endsWith('.json') && f !== 'best-of-thailand-2026.json');
  // the 8 pure-activity guides first (most relevant to "เที่ยวตามกิจกรรม"), then the rest
  const ACT_FIRST = ['best-beaches', 'best-temples', 'best-national-parks', 'best-waterfalls', 'best-viewpoints', 'best-markets', 'best-caves', 'best-elephant'];
  const rank = f => { const i = ACT_FIRST.findIndex(p => f.startsWith(p)); return i < 0 ? 99 : i; };
  files.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
  const cards = [];
  for (const f of files) {
    try {
      const o = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!o.heroImg || !o.h1) continue;
      cards.push({ h: o.slug || f.slice(0, -5), img: o.heroImg, e: o.heroEmoji || '📍', ti: esc(o.h1), l: esc(o.eyebrow) });
    } catch {}
  }
  return cards;
}
// ACTS card = the .dest scroll card (emoji flag) · ARTS card = the .acard "Top Picks" grid (badge)
const actCard = c => `{h:'${c.h}',img:'${c.img}',e:'${c.e}',ti:'${c.ti}',l:'${c.l}'}`;
const GUIDE_BADGE = { th: 'ไกด์เที่ยว', en: 'Guide' };
const artCard = (c, big, loc) => `{${big ? 'big:1,' : ''}h:'${c.h}',img:'${c.img}',l:'${c.l}',ti:'${c.ti}',bd:'${GUIDE_BADGE[loc]}'}`;
const artsLiteral = loc => { const g = guideCards(loc); return '[\n' + g.slice(0, 5).map((c, i) => ' ' + artCard(c, i === 0, loc)).join(',\n') + '\n]'; };
const actsLiteral = loc => '[' + guideCards(loc).map(actCard).join(',') + ']';

// ── inject into a file ──
function inject(file, loc) {
  let h = fs.readFileSync(file, 'utf8');
  // 1) PROV block between markers
  const prov = `/*GEN:PROV*/\nvar PROV=[\n${buildPROV(loc)}\n];\n/*GEN:PROV-END*/`;
  h = h.replace(/\/\*GEN:PROV\*\/[\s\S]*?\/\*GEN:PROV-END\*\//, prov);
  // 2) stat numbers by data-stat
  for (const [k, v] of Object.entries(STATS)) {
    h = h.replace(new RegExp(`(<div class="n" data-stat="${k}">)[^<]*(</div>)`), `$1${v}$2`);
  }
  // 3) featured "Top Picks" (ARTS) + activity guides (ACTS) — auto-derived from the best-* guides
  if (/\/\*GEN:ARTS\*\//.test(h)) h = h.replace(/\/\*GEN:ARTS\*\/[\s\S]*?\/\*GEN:ARTS-END\*\//, `/*GEN:ARTS*/${artsLiteral(loc)}/*GEN:ARTS-END*/`);
  if (/\/\*GEN:ACTS\*\//.test(h)) h = h.replace(/\/\*GEN:ACTS\*\/[\s\S]*?\/\*GEN:ACTS-END\*\//, `/*GEN:ACTS*/${actsLiteral(loc)}/*GEN:ACTS-END*/`);
  fs.writeFileSync(file, h);
  console.log(`[${loc}] ${path.relative(ROOT, file)} · PROV ${PV.length} provinces · stats ${STATS.provinces}/${STATS.reviews}/${STATS.articles}`);
}

inject(path.join(PUB, 'index.html'), 'th');
inject(path.join(PUB, 'en/index.html'), 'en');
