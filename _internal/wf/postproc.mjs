// Post-process + audit an EXPLICIT list of article slugs before build.
// Usage: node _internal/wf/postproc.mjs <slug> [<slug2> ...]   (slug = filename without .json)
// Scoped to the files passed in — NEVER scans a whole cluster (would touch pre-existing articles).
// - Un-escapes stray HTML entities in string values (&lt; &gt; &quot; &#39; then &amp;).
// - Strips misleading ratings: no review-count cited, OR perfect (>=4.9) with a tiny sample (<40).
// - Reports (does NOT auto-fix): banned AI words / slang, unbalanced <p>, Klook hrefs missing aid=121442,
//   staycta missing title/links. Edits in place for entity + rating fixes.
import fs from 'fs';
const ART = 'C:\\Users\\Imac\\Thailandaddict\\astro\\src\\content\\articles\\';
const slugs = process.argv.slice(2).map(s => s.replace(/\.json$/, ''));
if (!slugs.length) { console.error('need slug(s)'); process.exit(1); }

const BANNED = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'สุดยอด', 'อันซีน', 'ที่สุดในโลก'];
const SLANG = ['อ่ะ', 'ปะ', 'แหละ', 'ล่ะ'];

const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'").replace(/&amp;/g, '&');
function walkUnesc(o) {
  if (typeof o === 'string') return unesc(o);
  if (Array.isArray(o)) return o.map(walkUnesc);
  if (o && typeof o === 'object') { const r = {}; for (const k in o) r[k] = walkUnesc(o[k]); return r; }
  return o;
}
function collectStrings(o, acc) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach(x => collectStrings(x, acc));
  else if (o && typeof o === 'object') for (const k in o) collectStrings(o[k], acc);
  return acc;
}

const files = slugs.map(s => s + '.json');
let issues = 0;
for (const f of files) {
  if (!fs.existsSync(ART + f)) { console.log('  [MISS] file not found:', f); issues++; continue; }
  let j;
  try { j = JSON.parse(fs.readFileSync(ART + f, 'utf8')); } catch (e) { console.log('  [WARN] JSON.parse FAIL', f, e.message); issues++; continue; }
  let changed = false;

  // entity unescape
  const before = JSON.stringify(j);
  j = walkUnesc(j);
  if (JSON.stringify(j) !== before) { changed = true; console.log('  [fix] unescaped entities in', f); }

  // rank auto-fix — restaurant blocks REQUIRE a `rank` (schema); agents sometimes omit it on
  // compare cards → hard build failure ("blocks.N.rank Required"). Backfill sequentially.
  const cards = (j.blocks || []).filter(b => b.kind === 'restaurant');
  cards.forEach((c, i) => {
    if (c.rank === undefined || c.rank === null || c.rank === '') { c.rank = String(i + 1); changed = true; console.log(`  [fix] backfilled missing rank ${i + 1} in ${f}`); }
  });
  // rating strip
  for (const c of cards) {
    if (c.rating == null) continue;
    // coerce numeric-string rating → number (schema requires number; wave2 agents sometimes emit "4.6")
    if (typeof c.rating === 'string' && c.rating.trim() !== '' && !isNaN(Number(c.rating))) {
      c.rating = Number(c.rating); changed = true; console.log(`  [fix] coerced rating "${c.rating}" to number in ${f}`);
    }
    const src = String(c.ratingSrc || '');
    // Require an actual review/rating COUNT (a number immediately tied to รีวิว/reviews/ratings/เรตติ้ง/คน).
    // Do NOT match "อันดับ #1 จาก 9 สิ่งที่น่าทำ" (ranking, not a review count).
    const m = src.match(/(\d[\d,]*)\s*\+?\s*(รีวิว|reviews?|ratings?|เรตติ้ง|คน|ราย|รายการ)/i)
      || src.match(/จาก\s*(\d[\d,]*)\s*\+?\s*(รีวิว|reviews?|ratings?|เรตติ้ง|คน|ราย|รายการ)/i);
    const count = m ? parseInt(m[1].replace(/,/g, '')) : null;
    const r = Number(c.rating);
    let strip = false, why = '';
    if (!(r > 0 && r <= 5)) { strip = true; why = 'rating out of (0,5]'; }
    else if (count == null) { strip = true; why = 'no review count cited'; }
    else if (count < 10) { strip = true; why = `sample too small (${count} reviews)`; }
    else if (r >= 4.9 && count < 40) { strip = true; why = `perfect ${r} on tiny sample ${count}`; }
    if (strip) { console.log(`  [fix] STRIP rating #${c.rank} in ${f} — ${why} (src: ${src.slice(0, 60)})`); delete c.rating; delete c.ratingSrc; changed = true; }
  }

  // reports (no autofix)
  const strs = collectStrings(j, []);
  for (const b of BANNED) if (strs.some(s => s.includes(b))) { console.log(`  [WARN] banned word "${b}" in ${f}`); issues++; }
  for (const sl of SLANG) {
    const re = new RegExp('(^|[\\s"“”>(])' + sl + '($|[\\s"“”<).,!?])');
    if (strs.some(s => re.test(s))) { console.log(`  [WARN] possible slang "${sl}" in ${f}`); issues++; }
  }
  // entities left after unescape (double-escaped)
  if (strs.some(s => /&(lt|gt|amp|quot|#0?39);/.test(s))) { console.log(`  [WARN] entities remain in ${f}`); issues++; }
  // unbalanced <p>
  for (const s of strs) {
    const op = (s.match(/<p>/g) || []).length, cl = (s.match(/<\/p>/g) || []).length;
    if (op !== cl) { console.log(`  [WARN] unbalanced <p> (${op} open / ${cl} close) in ${f}: ${s.slice(0, 50)}`); issues++; break; }
  }
  // duplicate cards (same subject) in a ranking — agent sometimes writes the wrong subject twice
  const seenCard = {};
  for (const c of cards) {
    // Use the FULL mapHref (URL-encoded Thai queries share long prefixes → slicing caused false positives
    // e.g. ตลาดบ้านใหม่ vs ตลาดคลองสวน both start with the encoding of "ตลาด"). Full string = precise.
    const key = (c.mapHref || '') || (c.name || '').replace(/\s+/g, '').slice(0, 20);
    if (key && seenCard[key]) { console.log(`  [WARN] DUPLICATE card in ${f}: rank ${c.rank} "${(c.name || '').slice(0, 35)}" (same as rank ${seenCard[key]})`); issues++; }
    else if (key) seenCard[key] = c.rank;
  }
  // klook hrefs missing aid
  const badKlook = strs.filter(s => s.includes('klook.com') && !s.includes('aid=121442'));
  if (badKlook.length) { console.log(`  [WARN] ${badKlook.length} Klook href(s) missing aid=121442 in ${f}`); issues++; }
  // staycta shape
  for (const b of (j.blocks || [])) if (b.kind === 'staycta') {
    if (!b.title || !Array.isArray(b.links) || !b.links.length) { console.log(`  [WARN] staycta missing title/links in ${f}`); issues++; }
  }

  if (changed) fs.writeFileSync(ART + f, JSON.stringify(j, null, 1));
  console.log('checked', f, changed ? '(edited)' : '');
}
console.log('\nDONE. Warnings needing manual review:', issues);
