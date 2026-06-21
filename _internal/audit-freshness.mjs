// Freshness audit — scans every content JSON (articles/reviews/roundups, TH+EN) and reports:
//   1. broken internal links   — any `<slug>.html` href that is not a real content slug or a hub
//   2. broken images           — any /images/... path with no local file (heroes/cities are static;
//                                hotels/cm/food/gallery are R2-served → reported separately, not "broken")
//   3. stale years             — 2019–2025 in title/h1/metaDesc/ogTitle (likely should read 2026)
//   4. missing modifiedDate    — articles/reviews with no modifiedDate
// Read-only. Usage: node _internal/audit-freshness.mjs  [--years] [--links] [--images] [--dates]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const C = path.join(ROOT, 'astro', 'src', 'content');
const PUB = path.join(ROOT, 'astro', 'public');
const IMG = path.join(PUB, 'images');
const R2_DIRS = ['hotels', 'cm', 'food', 'gallery'];   // served from R2 (see .assetsignore) — not locally verifiable
const only = process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const lsJson = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.json')) : []);
const lsHtml = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.html')) : []);

// ---- valid internal targets: every content slug + every hub basename ----
const contentDirs = ['articles', 'reviews', 'roundups'];
const slugs = new Set();
for (const d of contentDirs) for (const f of lsJson(path.join(C, d))) slugs.add(f.slice(0, -5));
const hubs = new Set(lsHtml(PUB).map((f) => f.slice(0, -5)));
const validTarget = (base) => slugs.has(base) || hubs.has(base);

// ---- valid local images (recursive walk of public/images) ----
const localImg = new Set();
(function walk(dir, rel) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f), r = rel + '/' + f;
    if (fs.statSync(p).isDirectory()) walk(p, r);
    else localImg.add('/images' + r);
  }
})(IMG, '');

// ---- collectors ----
const brokenLinks = [], brokenImages = [], r2Images = new Set(), staleYears = [], noModified = [];
const linkKeys = new Set(['href', 'reviewUrl', 'crumbCityHref', 'regionHref', 'hubHref', 'hub', 'roundup']);
const imgKeys = new Set(['image', 'heroImg', 'img', 'ogImage', 'src']);
const isInternalHtml = (v) => typeof v === 'string' && /^[a-z0-9][a-z0-9-]*\.html$/.test(v);

function walkNode(o, onStr) {
  if (Array.isArray(o)) { o.forEach((x) => walkNode(x, onStr)); return; }
  if (o && typeof o === 'object') for (const k of Object.keys(o)) {
    const v = o[k];
    if (typeof v === 'string') onStr(k, v);
    else walkNode(v, onStr);
  }
}

function scan(file, kind) {
  const d = readJson(file); if (!d) return;
  const base = path.basename(file);
  if (want('links') || want('images')) walkNode(d, (k, v) => {
    if (want('links') && linkKeys.has(k) && isInternalHtml(v)) {
      if (!validTarget(v.slice(0, -5))) brokenLinks.push({ base, href: v });
    }
    if (want('images') && imgKeys.has(k) && /^\/?images\//.test(v)) {
      const norm = v.startsWith('/') ? v : '/' + v;
      const dir = norm.split('/')[2];
      if (localImg.has(norm)) return;
      if (R2_DIRS.includes(dir)) r2Images.add(dir);
      else brokenImages.push({ base, img: norm });
    }
  });
  if (want('years')) for (const f of ['title', 'h1', 'metaDesc', 'ogTitle']) {
    const m = String(d[f] || '').match(/\b(20(?:19|2[0-5]))\b/);
    if (m) staleYears.push({ base, field: f, year: m[1], text: String(d[f]).slice(0, 70) });
  }
  if (want('dates') && (kind === 'articles' || kind === 'reviews')) {
    if (!d.modifiedDate) noModified.push(base);
  }
}

for (const d of ['articles', 'articles-en', 'reviews', 'reviews-en', 'roundups', 'roundups-en'])
  for (const f of lsJson(path.join(C, d))) scan(path.join(C, d, f), d.replace(/-en$/, ''));

// ---- report ----
const cap = (a, n = 25) => a.slice(0, n);
console.log(`\nFRESHNESS AUDIT — ${slugs.size} content slugs, ${hubs.size} hubs, ${localImg.size} local images\n`);
if (want('links')) {
  console.log(`=== BROKEN INTERNAL LINKS: ${brokenLinks.length} ===`);
  const byHref = {}; for (const x of brokenLinks) (byHref[x.href] ??= []).push(x.base);
  for (const [href, files] of Object.entries(byHref).sort((a, b) => b[1].length - a[1].length))
    console.log(`  [${files.length}] ${href}  e.g. ${cap(files, 3).join(', ')}`);
  if (!brokenLinks.length) console.log('  (none)');
  console.log('');
}
if (want('images')) {
  console.log(`=== BROKEN IMAGES (local dirs only): ${brokenImages.length} ===`);
  const byImg = {}; for (const x of brokenImages) (byImg[x.img] ??= []).push(x.base);
  for (const [img, files] of cap(Object.entries(byImg).sort((a, b) => b[1].length - a[1].length), 40))
    console.log(`  [${files.length}] ${img}  e.g. ${cap(files, 2).join(', ')}`);
  if (!brokenImages.length) console.log('  (none)');
  console.log(`  (R2-served dirs referenced, not locally verifiable: ${[...r2Images].join(', ') || 'none'})\n`);
}
if (want('years')) {
  console.log(`=== STALE YEARS (2019–2025 in title/h1/metaDesc/ogTitle): ${staleYears.length} ===`);
  const byYear = {}; for (const x of staleYears) (byYear[x.year] ??= []).push(x);
  for (const [year, items] of Object.entries(byYear).sort()) {
    console.log(`  ${year}: ${items.length}`);
    for (const it of cap(items, 8)) console.log(`     ${it.base} [${it.field}] ${it.text}`);
  }
  if (!staleYears.length) console.log('  (none)');
  console.log('');
}
if (want('dates')) {
  console.log(`=== ARTICLES/REVIEWS with no modifiedDate in JSON: ${noModified.length} (informational) ===`);
  console.log(`  ArticleLayout defaults the "Last updated" date + JSON-LD dateModified to SITE_UPDATED`);
  console.log(`  when absent, so these still render a date; reviews carry it via ReviewLayout.`);
  console.log(`  e.g. ${cap(noModified, 6).join(', ')}\n`);
}
const totalBroken = brokenLinks.length + brokenImages.length;
console.log(`SUMMARY: ${brokenLinks.length} broken links, ${brokenImages.length} broken local images, ${staleYears.length} stale-year fields, ${noModified.length} missing modifiedDate.`);
process.exit(totalBroken ? 1 : 0);
