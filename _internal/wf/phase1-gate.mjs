// Phase-1 mechanical quality gate — runs on whichever Phase-1 roundups exist on disk.
// Checks each roundup (TH+EN) for schema-key parity vs gold, banned words, and that every entry
// has a real reviewUrl (file exists), a real img (file on disk), and correct affiliate URL format.
// Then checks every NEW review the roundups reference. Lists new hotel images for R2 upload.
// Usage: node _internal/wf/phase1-gate.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const RD = path.join(ROOT, 'astro/src/content/roundups');
const RDEN = path.join(ROOT, 'astro/src/content/roundups-en');
const RV = path.join(ROOT, 'astro/src/content/reviews');
const RVEN = path.join(ROOT, 'astro/src/content/reviews-en');
const PUB = path.join(ROOT, 'astro/public');

const P1 = [
  'top7-kamala-beach-hotels-phuket', 'top10-patong-beach-hotels-phuket', 'top10-kata-karon-hotels-phuket',
  'top8-bang-tao-laguna-hotels-phuket', 'top8-rawai-nai-harn-hotels-phuket', 'top8-phuket-old-town-hotels',
  'top10-budget-hotels-phuket', 'top10-luxury-hotels-phuket',
  'top10-chaweng-beach-hotels-samui', 'top8-lamai-beach-hotels-samui', 'top8-bophut-fishermans-village-hotels-samui',
  'top7-maenam-choeng-mon-hotels-samui', 'top10-budget-hotels-samui', 'top10-luxury-hotels-samui',
  'top10-ao-nang-beach-hotels-krabi', 'top8-luxury-hotels-krabi',
  'top10-budget-hotels-bangkok', 'top10-luxury-hotels-bangkok',
];
const BANNED = /ตอบโจทย์|โดดเด่น|ครบครัน|ระดับโลก|สุดยอด|อันซีน/g;
const THAI = /[ก-๛]/g;
const GOLDR = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(RD, 'top10-jomtien-beach-hotels-pattaya.json'), 'utf8'))));
// optional per schema (conditional render) — older/reuse reviews may omit them, don't flag as missing.
// quickAnswerHtml/quickAnswerH2 = AEO answer block; ReviewLayout derives it from structured data when
// absent (see ReviewLayout.astro `quickAnswerHtml || _derivedQA`), so older reviews legitimately omit it.
const OPTIONAL_V = new Set(['prevHref', 'prevLabel', 'prevName', 'nextHref', 'nextLabel', 'nextName', 'faq', 'faqTitle', 'quickAnswerHtml', 'quickAnswerH2']);
const GOLDV = new Set([...Object.keys(JSON.parse(fs.readFileSync(path.join(RV, 'review-glam-habitat-phuket.json'), 'utf8')))].filter(k => !OPTIONAL_V.has(k)));
const imgOnDisk = i => i && fs.existsSync(path.join(PUB, String(i).replace(/^\//, '')));

let totalFail = 0; const newImages = new Set(); const newReviews = new Set();
for (const slug of P1) {
  const p = path.join(RD, slug + '.json');
  if (!fs.existsSync(p)) { console.log(`— ${slug}: not built yet`); continue; }
  const errs = [];
  for (const [dir, lang] of [[RD, 'TH'], [RDEN, 'EN']]) {
    const fp = path.join(dir, slug + '.json');
    if (!fs.existsSync(fp)) { errs.push(`${lang} missing`); continue; }
    const raw = fs.readFileSync(fp, 'utf8'); let o;
    try { o = JSON.parse(raw); } catch { errs.push(`${lang} parse`); continue; }
    const missing = [...GOLDR].filter(k => !(k in o));
    if (missing.length) errs.push(`${lang} missKeys[${missing.slice(0, 4)}]`);
    if (BANNED.test(raw)) errs.push(`${lang} banned`);
    const entries = o.entries || [];
    for (const e of entries) {
      const rvSlug = String(e.reviewUrl || '').replace(/\.html$/, '');
      if (!rvSlug || !fs.existsSync(path.join(RV, rvSlug + '.json'))) errs.push(`${lang} entry ${e.name}: reviewUrl missing`);
      if (!imgOnDisk(e.img)) errs.push(`${lang} entry ${e.name}: img not on disk (${e.img})`);
      if (lang === 'TH') {
        if (e.agodaUrl && !/cid=1965862/.test(e.agodaUrl)) errs.push(`entry ${e.name}: agoda cid`);
        // bookingUrl: booking.com is CJ-wrapped at build; a direct hotel-site URL is legit for non-OTA
        // luxury (e.g. Aman/Amanpuri book direct) per the domain-aware booking-button pattern. Only flag empties/non-URLs.
        if (e.bookingUrl && !/^https?:\/\/\S+\.\S/.test(e.bookingUrl)) errs.push(`entry ${e.name}: booking url malformed`);
        if (rvSlug) newReviews.add(rvSlug);
        if (e.img) newImages.add(String(e.img).replace(/^\//, ''));
      }
    }
  }
  console.log(`${errs.length ? '✗' : '✓'} ${slug}${errs.length ? '  → ' + errs.slice(0, 6).join(' · ') : ''}`);
  if (errs.length) totalFail++;
}

// check NEW reviews (those not already committed to git — i.e. created this phase). We check ALL referenced,
// flagging schema/banned/thai-leak issues regardless of new/old (old ones already passed, so failures = new).
console.log('\n── referenced reviews check ──');
let rvFail = 0;
for (const s of newReviews) {
  const errs = [];
  for (const [dir, lang] of [[RV, 'TH'], [RVEN, 'EN']]) {
    const fp = path.join(dir, s + '.json');
    if (!fs.existsSync(fp)) { errs.push(`${lang} missing`); continue; }
    const raw = fs.readFileSync(fp, 'utf8'); let o;
    try { o = JSON.parse(raw); } catch { errs.push(`${lang} parse`); continue; }
    const missing = [...GOLDV].filter(k => !(k in o));
    if (missing.length) errs.push(`${lang} missKeys[${missing.slice(0, 3)}]`);
    if (BANNED.test(raw)) errs.push(`${lang} banned`);
    if (lang === 'EN' && (raw.replace(/฿/g, '').match(THAI) || []).length > 0) errs.push('EN thai-leak');
    if (o.heroImg && !imgOnDisk(o.heroImg)) newImages.add(String(o.heroImg).replace(/^\//, ''));
  }
  if (errs.length) { console.log(`  ✗ ${s} → ${errs.join(' · ')}`); rvFail++; }
}
console.log(`  ${newReviews.size} reviews referenced · ${rvFail} with issues`);

console.log(`\n══ GATE: ${totalFail + rvFail ? `FAIL (${totalFail} roundups, ${rvFail} reviews)` : 'PASS'} ══`);
// images not yet on R2 CDN — write list for upload-r2-api.mjs
const localImages = [...newImages].filter(i => fs.existsSync(path.join(PUB, i)));
fs.writeFileSync(path.join(ROOT, '_internal/phase1-data/new-images.txt'), localImages.join('\n'));
console.log(`\n${localImages.length} local hotel images referenced (list → _internal/phase1-data/new-images.txt) — upload to R2 before deploy.`);
