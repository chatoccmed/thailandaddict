// Generic Klook deep-link / rating upgrader for a province A1 (TH + EN twin).
// Only applies VERIFIED matches — a card is upgraded only if its TH name matches
// `re` AND the Klook slug was eyeballed to be the right product. Unverified cards
// keep their search-link (safe). Wrong deep links misdirect real buyers.
import fs from 'node:fs';
const ROOT = 'C:/Users/Imac/Thailandaddict/astro/src/content';
const APPLY = process.argv.includes('--write');
const province = process.argv[2];
const mapFile = process.argv[3];   // JSON: [{re, slug, rating?, ratingSrc?}]
if (!province || !mapFile) { console.log('usage: node upgrade-klook.mjs <province> <mapFile.json> [--write]'); process.exit(1); }

const deep = slug => `https://www.klook.com/th/activity/${slug.replace(/\/$/, '')}/?aid=121442`;
const UP = JSON.parse(fs.readFileSync(mapFile, 'utf8')).map(u => ({ ...u, re: new RegExp(u.re) }));

function patch(file) {
  const p = `${ROOT}/${file}`;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const cards = j.blocks.filter(b => b.kind === 'restaurant');
  const th = JSON.parse(fs.readFileSync(`${ROOT}/articles/top10-activities-${province}.json`, 'utf8'));
  const thCards = th.blocks.filter(b => b.kind === 'restaurant');
  const log = [];
  for (const u of UP) {
    const idx = thCards.findIndex(c => u.re.test(c.name));
    if (idx < 0) { log.push(`  ⚠️ ไม่พบ ${u.re}`); continue; }
    const c = cards[idx];
    c.bookHref = deep(u.slug);
    if (u.rating != null) { c.rating = u.rating; c.ratingSrc = u.ratingSrc || 'Klook'; }
    log.push(`  #${idx + 1} ${thCards[idx].name.slice(0, 28).padEnd(30)} → ${u.slug.slice(0, 34)}${u.rating != null ? '  ★' + u.rating : ''}`);
  }
  for (const c of cards) {
    if (c.rating != null && !(c.rating > 0 && c.rating <= 5)) throw new Error('rating นอกช่วง: ' + c.name);
    if (!/aid=121442/.test(c.bookHref)) throw new Error('bookHref ไม่มี aid: ' + c.name);
  }
  const out = JSON.stringify(j, null, 1); JSON.parse(out);
  if (APPLY) fs.writeFileSync(p, out);
  return log;
}
for (const f of [`articles/top10-activities-${province}.json`, `articles-en/top10-activities-${province}.json`]) {
  console.log(`=== ${f} ${APPLY ? '(เขียน)' : '(dry-run)'} ===`);
  patch(f).forEach(l => console.log(l));
}
console.log(APPLY ? '\n✅ อัปเดตแล้ว' : '\n(dry-run)');
