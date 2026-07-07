// Classify image duplicates from site-audit-report.json into:
//  A) legit same-subject reuse (hotel photo on its own review/roundup/city pages)
//  B) REAL cross-subject duplicates (same photo for different places/provinces)
//  C) within-page repeats (>2×) — inspect what they are
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync('_internal/wf/site-audit-report.json', 'utf8'));

// province/city tokens for cluster inference from page slugs
const PROVINCES = ['bangkok','chiang-mai','chiang-rai','phuket','krabi','pattaya','chonburi','koh-samui','samui','surat-thani','hua-hin','huahin','prachuap','kanchanaburi','ayutthaya','rayong','trat','koh-chang','koh-kood','koh-lipe','koh-phangan','koh-tao','koh-samet','koh-lanta','phi-phi','phang-nga','khao-lak','pai','mae-hong-son','sukhothai','nakhon-ratchasima','khao-yai','buriram','udon-thani','ubon-ratchathani','khon-kaen','loei','nong-khai','sakon-nakhon','nakhon-phanom','mukdahan','roi-et','surin','sisaket','yasothon','amnat-charoen','bueng-kan','kalasin','maha-sarakham','chaiyaphum','nong-bua-lamphu','lampang','lamphun','phrae','nan','phayao','uttaradit','phitsanulok','phetchabun','phichit','kamphaeng-phet','tak','nakhon-sawan','uthai-thani','chai-nat','sing-buri','ang-thong','lopburi','saraburi','suphan-buri','nakhon-pathom','samut-sakhon','samut-songkhram','samut-prakan','nonthaburi','pathum-thani','nakhon-nayok','prachinburi','sa-kaeo','chachoengsao','chanthaburi','ranong','chumphon','nakhon-si-thammarat','phatthalung','songkhla','hat-yai','satun','trang','pattani','yala','narathiwat','betong','phetchaburi','ratchaburi','sing-buri','mae-sot'];
PROVINCES.sort((a, b) => b.length - a.length); // longest match first

function clusterOf(page) {
  const s = page.replace(/\.html$/, '');
  for (const p of PROVINCES) if (s.includes(p)) return p === 'huahin' ? 'hua-hin' : p === 'samui' ? 'koh-samui' : p;
  return null;
}
// hotel token from R2 filename: /images/hotels/<city>-<hoteltoken>-N.jpg
function r2Token(u) {
  const m = u.match(/\/images\/(hotels|attractions|food|activities)\/([a-z0-9-]+?)-\d+\.(jpg|webp|png)/);
  return m ? { kind: m[1], token: m[2] } : null;
}

const real = [];          // cross-subject dupes
let legit = 0;
for (const d of r.images.crossDupes.top) {
  const clusters = new Set(d.pages.map(clusterOf).filter(Boolean));
  const t = r2Token(d.img);
  if (t) {
    // R2 asset — same-subject if all pages' slugs relate to the token's city or contain part of the token
    const tokCity = clusterOf('/' + t.token);
    if (clusters.size <= 1) { legit++; continue; }                      // one cluster → same subject family
    if (tokCity && [...clusters].every(c => c === tokCity)) { legit++; continue; }
    real.push({ ...d, why: `R2 ${t.kind} asset spans clusters: ${[...clusters].join(',')}` });
  } else {
    // external (Wikimedia etc.)
    if (clusters.size > 1) real.push({ ...d, why: `photo spans provinces: ${[...clusters].slice(0, 5).join(',')}` });
    else legit++;
  }
}
console.log('cross-dupes analysed:', r.images.crossDupes.top.length, '(top slice) | legit same-subject:', legit, '| REAL cross-subject:', real.length);
for (const d of real.slice(0, 25)) {
  console.log('\n  IMG:', d.img.slice(0, 110));
  console.log('  why:', d.why, '| pages:', d.count);
  console.log('  on :', d.pages.slice(0, 5).join(', ').slice(0, 200));
}
fs.writeFileSync('_internal/wf/img-real-dupes.json', JSON.stringify(real, null, 1));

// C) within-page repeats — what are they? sample 8 pages
console.log('\n=== within-page >2× samples ===');
const entries = Object.entries(r.images.pageDupes.detail);
console.log('pages:', entries.length);
for (const [p, list] of entries.slice(0, 8)) console.log('  ' + p + ' → ' + list[0].slice(0, 130));
// histogram of repeat counts
const hist = {};
for (const [, list] of entries) for (const it of list) { const n = it.match(/×(\d+)$/)?.[1] || '?'; hist[n] = (hist[n] || 0) + 1; }
console.log('repeat histogram:', JSON.stringify(hist));
