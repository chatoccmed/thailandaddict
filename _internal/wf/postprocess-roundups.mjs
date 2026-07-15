// Post-process generated roundups: enforce data integrity + validate schema completeness.
// The writing agents produce prose; THIS script authoritatively overwrites every
// verified field (name/score/stars/img/agoda|booking|tripUrl/reviewUrl/priceBig/rooms)
// from the pool so no affiliate link or price can drift from the source review.
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve('.');
const POOLDIR = path.join(REPO, '_internal/wf/roundup-pools');
const OUTDIR = path.join(REPO, 'astro/src/content/roundups');

const SLUGS = [
  'top8-phi-phi-hotels-krabi',
];

const TOP_KEYS = ['slug','title','metaDesc','ogTitle','ogDesc','image','heroImg','heroEyebrow','h1','heroSub','heroStats','breadcrumb','breadcrumbSchema','navReviewLabel','navReviewHref','introH2','introHtml','mrtHtml','secLabel','toc','entries','compareTitle','compareCols','compareRows','adviceTitle','advice','noteHtml','faqTitle','faq'];
const ENTRY_KEYS = ['id','rank','rankColor','type','name','score','stars','revCount','img','mrtTag','priceBig','priceSub','rooms','agodaUrl','bookingUrl','tripUrl','reviewUrl','tags','addr','storyHtml','tipHtml','pros','cons','dividerText'];

const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
const mapRooms = rooms => Array.isArray(rooms) ? rooms.map(r => ({ type: r.type || r.name || '', price: r.price || '' })) : [];

let anyFail = false;
for (const slug of SLUGS) {
  const outPath = path.join(OUTDIR, slug + '.json');
  const poolPath = path.join(POOLDIR, slug + '.json');
  const issues = [];
  if (!fs.existsSync(outPath)) { console.log(`\n✗ ${slug}: FILE NOT WRITTEN`); anyFail = true; continue; }
  let r, pool;
  try { r = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch (e) { console.log(`\n✗ ${slug}: INVALID JSON — ${e.message}`); anyFail = true; continue; }
  pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
  const byUrl = new Map(pool.hotels.map(h => [norm(h.reviewUrl), h]));
  const byName = new Map(pool.hotels.map(h => [norm(h.name), h]));
  const usedUrls = new Set();

  // top-level key presence
  for (const k of TOP_KEYS) if (!(k in r)) issues.push('missing top key: ' + k);
  r.slug = slug; // enforce slug

  // entries: overwrite verified fields from pool
  if (!Array.isArray(r.entries)) { issues.push('entries not array'); }
  else {
    if (r.entries.length !== pool.count) issues.push(`entry count ${r.entries.length} != pool ${pool.count}`);
    r.entries.forEach((e, i) => {
      for (const k of ENTRY_KEYS) if (!(k in e)) issues.push(`entry[${i}] missing key: ${k}`);
      let h = byUrl.get(norm(e.reviewUrl)) || byName.get(norm(e.name));
      if (!h) { issues.push(`entry[${i}] "${e.name}" not in pool (possible hallucination)`); return; }
      usedUrls.add(norm(h.reviewUrl));
      // AUTHORITATIVE overwrite of verified fields
      e.name = h.name; e.score = String(h.score); e.stars = h.stars || e.stars || '';
      e.img = h.img; e.agodaUrl = h.agodaUrl; e.bookingUrl = h.bookingUrl; e.tripUrl = h.tripUrl;
      e.reviewUrl = h.reviewUrl; e.priceBig = h.priceBig || e.priceBig;
      e.rooms = mapRooms(h.rooms); if (!e.rooms.length) e.rooms = mapRooms(e.rooms);
      e.addr = h.addr || e.addr || '';
      e.id = 'h' + (i + 1); e.rank = String(i + 1);
    });
    // every pool hotel used?
    for (const h of pool.hotels) if (!usedUrls.has(norm(h.reviewUrl))) issues.push(`pool hotel "${h.name}" missing from entries`);
  }

  // rebuild toc from corrected entries; patch compareRows name/score/price by index
  if (Array.isArray(r.entries)) {
    r.toc = r.entries.map((e, i) => ({ n: String(i + 1), color: e.rankColor || '#06B6D4', name: e.name, price: e.priceBig }));
    if (Array.isArray(r.compareRows)) {
      r.compareRows.forEach((row, i) => { const e = r.entries[i]; if (e) { row.rank = String(i + 1); row.name = e.name; row.score = String(e.score); row.price = e.priceBig; } });
    }
    // heroImg/image = #1 hotel img
    if (r.entries[0]) { r.heroImg = r.entries[0].img; r.image = r.entries[0].img; }
  }

  // dark-pattern quick lint
  const blob = JSON.stringify(r);
  const AIWORDS = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก'];
  for (const w of AIWORDS) if (blob.includes(w)) issues.push('AI-word present: ' + w);
  const DARK = ['เหลือห้องเดียว', 'เหลือเพียง', 'รีบจอง', 'กำลังดูห้องนี้', 'เช็กราคาล่าสุดเมื่อ'];
  for (const w of DARK) if (blob.includes(w)) issues.push('dark-pattern phrase: ' + w);

  fs.writeFileSync(outPath, JSON.stringify(r, null, 2));
  if (issues.length) { anyFail = true; console.log(`\n✗ ${slug} (${r.entries?.length || 0} entries) — ${issues.length} issue(s):`); issues.slice(0, 20).forEach(x => console.log('   - ' + x)); }
  else console.log(`\n✓ ${slug} — ${r.entries.length} entries, verified data enforced, schema complete`);
}
console.log(anyFail ? '\n=== SOME ISSUES — review above ===' : '\n=== ALL 7 CLEAN ===');
process.exit(anyFail ? 1 : 0);
