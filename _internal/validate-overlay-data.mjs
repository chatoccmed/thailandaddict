// Validate _internal/overlay-data/*.json before generating overlay articles.
// Checks: JSON parse · fixed fields · zoneSlug resolves to a real area hub · quick/ intro/ hotels/ faq shape ·
// EN fields + shared hotel `name` are zero-Thai (฿ allowed) · no banned AI words/slang.
// Usage: node _internal/validate-overlay-data.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, '_internal/overlay-data');
const PUB = path.join(ROOT, 'astro/public');
const ART = path.join(ROOT, 'astro/src/content/articles');

const hubSet = new Set(fs.readdirSync(PUB).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)));
const artSet = new Set(fs.readdirSync(ART).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
const hasThai = s => /[ก-฿เ-๛]/.test(String(s).replace(/฿/g, ''));   // strip ฿ first; flag any other Thai block char
const BANNED = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'อ่ะ', 'ปะ', 'แหละ', 'ล่ะ'];

// EN-side fields (must be zero-Thai). `name` is shared by both locales so it's checked too.
const EN_TOP = ['cityEn', 'anchorEn', 'anchorShortEn', 'zoneEn', 'quickEn', 'introEn'];
const EN_HOTEL = ['name', 'distEn', 'bestForEn', 'whyEn'];
const EN_FAQ = ['qEn', 'aEn'];

const files = fs.readdirSync(DATA).filter(f => f.endsWith('.json') && !f.startsWith('_'));
let errs = 0, warns = 0;
const report = [];
for (const f of files.sort()) {
  const p = path.join(DATA, f);
  const E = m => { report.push(`  ✗ ${f}: ${m}`); errs++; };
  const W = m => { report.push(`  ⚠ ${f}: ${m}`); warns++; };
  let d;
  try { d = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { E(`JSON parse FAILED — ${e.message}`); continue; }

  // fixed fields
  if (`${d.slug}.json` !== f) E(`slug "${d.slug}" != filename`);
  if (!/^hotels-near-/.test(d.slug || '')) E(`slug must start hotels-near-`);
  if (d.city !== 'bangkok') E(`city != bangkok`);
  for (const k of ['cityTh', 'cityEn', 'anchorTh', 'anchorEn', 'anchorShortTh', 'anchorShortEn', 'group', 'zoneTh', 'zoneEn', 'zoneSlug', 'hero'])
    if (!d[k]) E(`missing fixed field ${k}`);
  if (!['medical', 'mice', 'airport'].includes(d.group)) E(`bad group "${d.group}"`);
  // link targets the engine will emit must resolve
  if (!hubSet.has(`area-bangkok-${d.zoneSlug}`)) E(`zoneSlug "${d.zoneSlug}" → area-bangkok-${d.zoneSlug}.html NOT FOUND`);
  if (!artSet.has(`where-to-stay-bangkok-${d.zoneSlug}`)) W(`no where-to-stay-bangkok-${d.zoneSlug} article (staycta link will be dropped)`);

  // quick/intro
  if (!/^<strong>คำตอบสั้น ๆ:<\/strong>/.test(d.quickTh || '')) W(`quickTh missing "<strong>คำตอบสั้น ๆ:</strong>" lead`);
  if (!/^<strong>Short answer:<\/strong>/.test(d.quickEn || '')) W(`quickEn missing "<strong>Short answer:</strong>" lead`);
  for (const k of ['quickTh', 'quickEn', 'introTh', 'introEn']) if (!d[k]) E(`missing ${k}`);

  // hotels
  if (!Array.isArray(d.hotels)) { E(`hotels not array`); }
  else {
    if (d.hotels.length < 6 || d.hotels.length > 8) W(`hotels=${d.hotels.length} (want 6-8)`);
    d.hotels.forEach((h, i) => {
      for (const k of ['name', 'star', 'priceFromTHB', 'distTh', 'distEn', 'bestForTh', 'bestForEn', 'whyTh', 'whyEn'])
        if (h[k] === undefined || h[k] === '') E(`hotel[${i}] "${h.name || '?'}" missing ${k}`);
      if (typeof h.star !== 'number' || h.star < 1 || h.star > 5) E(`hotel[${i}] bad star ${h.star}`);
      if (!/^[\d,]+$/.test(String(h.priceFromTHB))) E(`hotel[${i}] priceFromTHB "${h.priceFromTHB}" not digits+comma`);
      for (const k of EN_HOTEL) if (hasThai(h[k])) E(`hotel[${i}] EN field ${k} has Thai: "${h[k]}"`);
    });
  }

  // faq
  if (!Array.isArray(d.faq) || d.faq.length !== 3) E(`faq must be exactly 3 (got ${d.faq && d.faq.length})`);
  else d.faq.forEach((q, i) => {
    for (const k of ['qTh', 'aTh', 'qEn', 'aEn']) if (!q[k]) E(`faq[${i}] missing ${k}`);
    for (const k of EN_FAQ) if (hasThai(q[k])) E(`faq[${i}] EN ${k} has Thai`);
  });

  // EN top-level zero-Thai
  for (const k of EN_TOP) if (hasThai(d[k])) E(`EN field ${k} has Thai: "${d[k]}"`);

  // banned words anywhere
  const blob = JSON.stringify(d);
  for (const b of BANNED) if (blob.includes(b)) W(`contains banned word "${b}"`);
}

console.log(`overlay-data validation — ${files.length} files, ${errs} errors, ${warns} warnings`);
if (report.length) console.log(report.join('\n'));
console.log(errs === 0 ? '\n✅ ALL VALID (0 errors)' : `\n❌ ${errs} ERROR(S) — fix before generating`);
process.exit(errs ? 1 : 0);
