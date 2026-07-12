// Phase-3a A-tier budget-roundup quality gate (same checks as phase2-gate, honest Top-N allowed so no fixed count).
// Each roundup (TH+EN): schema-key parity vs gold, banned words, EN no-Thai-leak, TH/EN rank-name parity,
// every entry has a real reviewUrl (file exists) + real img (on disk) + correct affiliate URLs.
// Usage: node _internal/wf/phase3a-gate.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const RD = path.join(ROOT, 'astro/src/content/roundups');
const RDEN = path.join(ROOT, 'astro/src/content/roundups-en');
const RV = path.join(ROOT, 'astro/src/content/reviews');
const PUB = path.join(ROOT, 'astro/public');

const P3 = [
  'top10-budget-hotels-amnat-charoen',
  'top10-budget-hotels-ang-thong',
  'top10-budget-hotels-bueng-kan',
  'top10-budget-hotels-chachoengsao',
  'top10-budget-hotels-chai-nat',
  'top10-budget-hotels-chaiyaphum',
  'top10-budget-hotels-chumphon',
  'top10-budget-hotels-kalasin',
  'top10-budget-hotels-kamphaeng-phet',
  'top10-budget-hotels-lampang',
  'top10-budget-hotels-loei',
  'top10-budget-hotels-lopburi',
  'top10-budget-hotels-nakhon-pathom',
  'top10-budget-hotels-nakhon-phanom',
  'top10-budget-hotels-nakhon-sawan',
  'top10-budget-hotels-nakhon-si-thammarat',
  'top10-budget-hotels-narathiwat',
  'top10-budget-hotels-nong-bua-lamphu',
  'top10-budget-hotels-nong-khai',
  'top10-budget-hotels-nonthaburi',
  'top10-budget-hotels-pathum-thani',
  'top10-budget-hotels-pattani',
  'top10-budget-hotels-phatthalung',
  'top10-budget-hotels-phayao',
  'top10-budget-hotels-phichit',
  'top10-budget-hotels-phitsanulok',
  'top10-budget-hotels-phrae',
  'top10-budget-hotels-prachinburi',
  'top10-budget-hotels-roi-et',
  'top10-budget-hotels-sa-kaeo',
  'top10-budget-hotels-sakon-nakhon',
  'top10-budget-hotels-samut-prakan',
  'top10-budget-hotels-samut-sakhon',
  'top10-budget-hotels-samut-songkhram',
  'top10-budget-hotels-saraburi',
  'top10-budget-hotels-sing-buri',
  'top10-budget-hotels-sisaket',
  'top10-budget-hotels-songkhla',
  'top10-budget-hotels-suphan-buri',
  'top10-budget-hotels-surin',
  'top10-budget-hotels-tak',
  'top10-budget-hotels-trang',
  'top10-budget-hotels-udon-thani',
  'top10-budget-hotels-uthai-thani',
  'top10-budget-hotels-yala',
  'top10-budget-hotels-yasothon',
];
const BANNED = /ตอบโจทย์|โดดเด่น|ครบครัน|ระดับโลก|สุดยอด|อันซีน/g;
const THAI = /[฀-๿]/;
const BAHT = /฿/g;
const GOLDR = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(RD, 'top10-jomtien-beach-hotels-pattaya.json'), 'utf8'))));
const imgOnDisk = i => i && fs.existsSync(path.join(PUB, String(i).replace(/^\//, '')));

let totalFail = 0; const newImages = new Set();
for (const slug of P3) {
  const p = path.join(RD, slug + '.json');
  if (!fs.existsSync(p)) { console.log(`— ${slug}: not built yet`); continue; }
  const errs = [];
  let thNames = null;
  for (const [dir, lang] of [[RD, 'TH'], [RDEN, 'EN']]) {
    const fp = path.join(dir, slug + '.json');
    if (!fs.existsSync(fp)) { errs.push(`${lang} missing`); continue; }
    const raw = fs.readFileSync(fp, 'utf8'); let o;
    try { o = JSON.parse(raw); } catch { errs.push(`${lang} parse`); continue; }
    const missing = [...GOLDR].filter(k => !(k in o));
    if (missing.length) errs.push(`${lang} missKeys[${missing.slice(0, 4)}]`);
    if (BANNED.test(raw)) errs.push(`${lang} banned`);
    if (lang === 'EN' && (raw.replace(BAHT, '').match(new RegExp(THAI, 'g')) || []).length > 0) errs.push('EN thai-leak');
    const entries = o.entries || [];
    const names = entries.map(e => `${e.rank}:${e.name}`);
    if (lang === 'TH') { thNames = JSON.stringify(names); if (entries.length < 5) errs.push(`TH only ${entries.length} entries (<5)`); }
    else if (thNames !== null && JSON.stringify(names) !== thNames) errs.push('TH/EN rank-name mismatch');
    for (const e of entries) {
      const rvSlug = String(e.reviewUrl || '').replace(/^\/en\//, '').replace(/\.html$/, '');
      if (!rvSlug || !fs.existsSync(path.join(RV, rvSlug + '.json'))) errs.push(`${lang} entry ${e.name}: reviewUrl missing`);
      if (!imgOnDisk(e.img)) errs.push(`${lang} entry ${e.name}: img not on disk (${e.img})`);
      if (lang === 'TH') {
        if (e.agodaUrl && !/cid=1965862/.test(e.agodaUrl)) errs.push(`entry ${e.name}: agoda cid`);
        if (e.tripUrl && !/Allianceid=6861268/.test(e.tripUrl)) errs.push(`entry ${e.name}: trip alliance`);
        if (e.bookingUrl && !/^https?:\/\/\S+\.\S/.test(e.bookingUrl)) errs.push(`entry ${e.name}: booking url malformed`);
        if (e.img) newImages.add(String(e.img).replace(/^\//, ''));
      }
    }
  }
  console.log(`${errs.length ? '✗' : '✓'} ${slug}  (${(JSON.parse(fs.readFileSync(p, 'utf8')).entries || []).length} entries)${errs.length ? '  → ' + errs.slice(0, 6).join(' · ') : ''}`);
  if (errs.length) totalFail++;
}
console.log(`\n══ PHASE-4 GATE: ${totalFail ? `FAIL (${totalFail} roundups)` : 'PASS'} ══`);
const dataDir = path.join(ROOT, '_internal/phase1-data');
if (fs.existsSync(dataDir)) fs.writeFileSync(path.join(dataDir, 'phase4-images.txt'), [...newImages].filter(i => fs.existsSync(path.join(PUB, i))).join('\n'));
console.log(`${newImages.size} distinct entry images referenced (list → _internal/phase1-data/phase4-images.txt) — verify on R2 before deploy.`);
