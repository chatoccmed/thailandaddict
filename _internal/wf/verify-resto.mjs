#!/usr/bin/env node
// Verify a top10-popular-restaurants-<city> article end-to-end (data + disk + links + lint).
// Usage: node _internal/wf/verify-resto.mjs <city-slug>
import fs from 'fs';
const CITY = process.argv[2];
if (!CITY) { console.error('need <city-slug>'); process.exit(1); }
const ART = `astro/src/content/articles/top10-popular-restaurants-${CITY}.json`;
const RDIR = 'astro/src/content/roundups/';
const BAN = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'สุดยอด', 'อันซีน', 'ไม่ได้ไปกิน', 'ไม่ได้ไปนั่ง', 'ไม่เดาให้'];
const errs = [], warns = [];
const E = (m) => errs.push(m), W = (m) => warns.push(m);
const thaiLen = (h) => (String(h).replace(/<[^>]+>/g, '').match(/[฀-๿]/g) || []).length;
const imgOk = (webPath) => { try { return fs.statSync('astro/public' + webPath).size > 15000; } catch { return false; } };
const roundupOk = (href) => fs.existsSync(RDIR + String(href).replace(/\.html$/, '') + '.json');
const reviewOk = (href) => fs.existsSync('astro/src/content/reviews/' + String(href).replace(/\.html$/, '') + '.json');

if (!fs.existsSync(ART)) { console.error('NO article:', ART); process.exit(1); }
const a = JSON.parse(fs.readFileSync(ART, 'utf8'));
const restos = (a.blocks || []).filter(b => b.kind === 'restaurant');

// article-level
['title', 'metaDesc', 'keywords', 'h1', 'intro', 'image', 'heroImg', 'crumbCity', 'crumbCityHref'].forEach(k => { if (!a[k]) E(`article missing ${k}`); });
if (a.cluster !== CITY) E(`cluster=${a.cluster} ≠ ${CITY}`);
if (a.type !== 'eat-ranking') E(`type=${a.type}`);
if ((a.faq || []).length < 5) W(`faq=${(a.faq || []).length} (<5)`);
if (!a.rail || a.rail.length < 3) W(`rail=${(a.rail || []).length} (<3)`);
else a.rail.forEach((r, i) => { if (!roundupOk(r.href) && !reviewOk(r.href)) E(`rail[${i}] href not a real roundup/review: ${r.href}`); if (r.img && !imgOk(r.img)) W(`rail[${i}] img missing: ${r.img}`); });

// restaurants
if (restos.length !== 10) E(`restaurants=${restos.length} (need 10)`);
restos.forEach(b => {
  const id = `r${b.rank}(${(b.name || '').replace(/<[^>]+>/g, '').slice(0, 20)})`;
  const tl = thaiLen(b.descHtml);
  if (tl < 700) E(`${id} descHtml ${tl} Thai chars (<700)`);
  if (!b.img) W(`${id} no img (placeholder)`); else if (!imgOk(b.img)) E(`${id} img missing/small: ${b.img}`);
  (b.gallery || []).forEach((g, gi) => { if (!imgOk(g.src)) E(`${id} gallery[${gi}] missing: ${g.src}`); if (!g.credit) W(`${id} gallery[${gi}] no credit`); });
  if (b.img && !b.credit) E(`${id} img has no credit`);
  if (typeof b.rating !== 'number') W(`${id} no rating`);
  if (typeof b.ratingCount !== 'number') W(`${id} no ratingCount`);
  if (!b.zone) W(`${id} no zone`);
  if (!b.foodType) W(`${id} no foodType`);
  if (!b.bestFor) W(`${id} no bestFor`);
  if (!(b.mustOrder || []).length) W(`${id} no mustOrder`);
  if (b.stayHref && !roundupOk(b.stayHref)) E(`${id} stayHref not real roundup: ${b.stayHref}`);
});

// staycta + foodexp + localtips
const staycta = a.blocks.find(b => b.kind === 'staycta');
if (!staycta) W('no staycta block'); else (staycta.links || []).forEach((l, i) => { if (!roundupOk(l.href)) E(`staycta link[${i}] not real roundup: ${l.href}`); });
if (!a.blocks.some(b => b.kind === 'foodexp')) W('no foodexp block');
if (!a.blocks.some(b => b.kind === 'localtips')) W('no localtips block');

// lint (ban words + slang) across all text
const allText = JSON.stringify(a);
BAN.forEach(w => { const n = (allText.split(w).length - 1); if (n) E(`BAN word "${w}" ×${n}`); });
['อ่ะ', 'แหละ'].forEach(w => { const n = (allText.split(w).length - 1); if (n) W(`slang "${w}" ×${n}`); });

// gallery/rating coverage summary
const galTot = restos.reduce((s, b) => s + (b.gallery || []).length, 0);
const withImg = restos.filter(b => b.img).length, withRating = restos.filter(b => typeof b.rating === 'number').length;
console.log(`\n=== verify ${CITY} ===`);
console.log(`restos:${restos.length} · withImg:${withImg} · gallery:${galTot} (avg ${(galTot / restos.length).toFixed(1)}) · ratings:${withRating} · zones:${restos.filter(b => b.zone).length} · foodType:${restos.filter(b => b.foodType).length}`);
console.log(`blocks: ${a.blocks.map(b => b.kind).join(',')}`);
if (warns.length) console.log(`\nWARN (${warns.length}):\n  ` + warns.join('\n  '));
if (errs.length) { console.log(`\n❌ ERRORS (${errs.length}):\n  ` + errs.join('\n  ')); process.exit(1); }
console.log(`\n✅ PASS (errors=0, warns=${warns.length})`);
