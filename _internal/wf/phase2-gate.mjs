// Phase-2 audience-roundup quality gate. Same checks as phase1-gate but for the 6 audience slugs.
// Each roundup (TH+EN): schema-key parity vs gold, banned words, every entry has a real reviewUrl
// (file exists) + real img (on disk) + correct affiliate URL. Then EN twin: no raw Thai leak + parity.
// Usage: node _internal/wf/phase2-gate.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const RD = path.join(ROOT, 'astro/src/content/roundups');
const RDEN = path.join(ROOT, 'astro/src/content/roundups-en');
const RV = path.join(ROOT, 'astro/src/content/reviews');
const PUB = path.join(ROOT, 'astro/public');

const P2 = [
  'top10-honeymoon-hotels-phuket', 'top10-honeymoon-hotels-samui', 'top10-honeymoon-hotels-krabi',
  'top10-couples-hotels-chiang-mai', 'top10-family-hotels-huahin', 'top10-family-hotels-pattaya',
];
const BANNED = /ตอบโจทย์|โดดเด่น|ครบครัน|ระดับโลก|สุดยอด|อันซีน/g;
const THAI = /[฀-๿]/;
const BAHT = /฿/g;
const GOLDR = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(RD, 'top10-jomtien-beach-hotels-pattaya.json'), 'utf8'))));
const imgOnDisk = i => i && fs.existsSync(path.join(PUB, String(i).replace(/^\//, '')));

let totalFail = 0; const newImages = new Set();
for (const slug of P2) {
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
    if (lang === 'TH') thNames = JSON.stringify(names);
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
  console.log(`${errs.length ? '✗' : '✓'} ${slug}${errs.length ? '  → ' + errs.slice(0, 6).join(' · ') : ''}`);
  if (errs.length) totalFail++;
}

console.log(`\n══ PHASE-2 GATE: ${totalFail ? `FAIL (${totalFail} roundups)` : 'PASS'} ══`);
// images not on R2 yet (rare — audience roundups reuse existing on-R2 heroImgs, but flag any surprises)
const dataDir = path.join(ROOT, '_internal/phase1-data');
if (fs.existsSync(dataDir)) fs.writeFileSync(path.join(dataDir, 'phase2-images.txt'), [...newImages].filter(i => fs.existsSync(path.join(PUB, i))).join('\n'));
console.log(`${newImages.size} distinct entry images referenced (list → _internal/phase1-data/phase2-images.txt) — verify on R2 before deploy.`);
