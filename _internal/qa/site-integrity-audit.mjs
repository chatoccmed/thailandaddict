// Site-wide integrity audit over the BUILT site (astro/dist = what production serves).
//   node _internal/qa/site-integrity-audit.mjs [--r2]
// Checks:
//   1. internal links   — every internal href on every page resolves to a real dist file
//   2. images           — plain /images/<r2-only-dir>/ refs (would 404 — those dirs are excluded
//                         from the bundle) + [--r2] HEAD-checks every distinct r2.dev image URL
//   3. hreflang         — every declared alternate URL exists in dist
//   4. JSON-LD          — every <script type=application/ld+json> parses
//   5. sitemap          — every <loc> resolves to a dist file; counts dist pages missing from sitemap
// Writes _internal/qa/SITE-INTEGRITY-AUDIT.txt and prints a summary.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(ROOT, 'astro/dist');
const R2 = 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev';
const CHECK_R2 = process.argv.includes('--r2');
const R2_ONLY_DIRS = /^\/images\/(hotels|cm|food|gallery)\//;

if (!fs.existsSync(DIST)) { console.error('astro/dist missing — build first'); process.exit(1); }

// ---- collect the dist file set ----
const files = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : files.push(p); } })(DIST);
const rel = (p) => p.slice(DIST.length).split(path.sep).join('/');
const fileSet = new Set(files.map(rel));
const htmls = files.filter((f) => f.endsWith('.html'));
console.log(`dist: ${files.length} files · ${htmls.length} html pages`);

const exists = (urlPath) => {
  let p = urlPath;
  if (p === '' || p === '/') p = '/index.html';
  if (fileSet.has(p)) return true;
  if (!/\.[a-z0-9]+$/i.test(p)) {
    if (fileSet.has(p + '.html')) return true;
    if (fileSet.has(p.replace(/\/$/, '') + '/index.html')) return true;
    if (fileSet.has(p.replace(/\/$/, '') + '.html')) return true;
  }
  return false;
};

// worker-served dynamic routes that are NOT static dist files
const DYNAMIC = /^\/(api\/|t\/|go\/)/;

const brokenLinks = new Map();   // target -> [pages]
const badImgRefs = new Map();    // plain excluded-dir ref -> [pages]
const r2Imgs = new Set();        // distinct r2 image urls
const bundleImgs = new Map();    // /images/... bundle refs -> [pages]
const badHreflang = new Map();
const badJsonLd = [];
let pagesScanned = 0, totalLinks = 0;

const HREF_RE = /(?:href|src)="([^"#]+?)(?:#[^"]*)?"/g;
const SRCSET_RE = /srcset="([^"]+)"/g;
const LDJSON_RE = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
const HREFLANG_RE = /<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g;

for (const f of htmls) {
  const page = rel(f);
  const html = fs.readFileSync(f, 'utf8');
  const dir = path.posix.dirname(page);
  pagesScanned++;

  const addTarget = (raw) => {
    if (!raw || /^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(raw)) {
      if (/^https?:\/\/(www\.)?thailandaddict\.com/i.test(raw)) {
        const p = raw.replace(/^https?:\/\/(www\.)?thailandaddict\.com/i, '').split('?')[0].split('#')[0] || '/';
        if (!DYNAMIC.test(p) && !exists(p)) { (brokenLinks.get(p) || brokenLinks.set(p, []).get(p)).push(page); }
      } else if (raw.startsWith(R2)) { r2Imgs.add(raw.split('?')[0]); }
      return;
    }
    const clean = raw.split('?')[0];
    const p = clean.startsWith('/') ? clean : path.posix.normalize(path.posix.join(dir, clean));
    totalLinks++;
    if (/\.(jpe?g|png|webp|gif|svg|avif|ico|css|js|json|xml|txt|ics)$/i.test(p)) {
      if (R2_ONLY_DIRS.test(p)) { (badImgRefs.get(p) || badImgRefs.set(p, []).get(p)).push(page); }
      else if (/^\/images\//.test(p)) { (bundleImgs.get(p) || bundleImgs.set(p, []).get(p)).push(page); }
      else if (!exists(p)) { (brokenLinks.get(p) || brokenLinks.set(p, []).get(p)).push(page); }
      return;
    }
    if (DYNAMIC.test(p)) return;
    if (!exists(p)) { (brokenLinks.get(p) || brokenLinks.set(p, []).get(p)).push(page); }
  };

  let m;
  while ((m = HREF_RE.exec(html))) addTarget(m[1]);
  while ((m = SRCSET_RE.exec(html))) for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (u) addTarget(u); }
  while ((m = HREFLANG_RE.exec(html))) {
    const p = m[1].replace(/^https?:\/\/(www\.)?thailandaddict\.com/i, '').split('#')[0] || '/';
    if (!exists(p)) (badHreflang.get(p) || badHreflang.set(p, []).get(p)).push(page);
  }
  while ((m = LDJSON_RE.exec(html))) {
    try { JSON.parse(m[1]); } catch (e) { badJsonLd.push(page + ' :: ' + String(e.message).slice(0, 60)); }
  }
}

// bundle image existence
const missingBundleImgs = [...bundleImgs.entries()].filter(([p]) => !exists(p));

// sitemap
let sitemapMissing = [];
try {
  const xml = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1].replace(/^https?:\/\/[^/]+/, '') || '/');
  sitemapMissing = locs.filter((p) => !exists(p));
  console.log(`sitemap: ${locs.length} locs · missing in dist: ${sitemapMissing.length}`);
} catch { console.log('sitemap.xml not found in dist'); }

// R2 head-check
let r2Broken = [];
if (CHECK_R2) {
  const list = [...r2Imgs];
  console.log(`R2 image refs (distinct): ${list.length} — HEAD-checking…`);
  let done = 0;
  for (let i = 0; i < list.length; i += 30) {
    await Promise.all(list.slice(i, i + 30).map(async (u) => {
      try { const r = await fetch(u, { method: 'HEAD' }); if (!r.ok) r2Broken.push(`${r.status} ${u}`); }
      catch { r2Broken.push(`ERR ${u}`); }
      done++;
    }));
    if (done % 3000 < 30) console.log(`  …${done}/${list.length} (broken so far: ${r2Broken.length})`);
  }
}

// ---- report ----
const lines = [];
const section = (title, map, cap = 300) => {
  const entries = map instanceof Map ? [...map.entries()] : map;
  lines.push(`\n== ${title}: ${entries.length} ==`);
  for (const e of entries.slice(0, cap)) {
    if (Array.isArray(e) && Array.isArray(e[1])) lines.push(`  ${e[0]}  ← ${e[1].length} page(s), e.g. ${e[1][0]}`);
    else lines.push(`  ${e}`);
  }
  if (entries.length > cap) lines.push(`  …and ${entries.length - cap} more`);
};
lines.push(`SITE INTEGRITY AUDIT — ${new Date().toISOString()}`);
lines.push(`pages scanned: ${pagesScanned} · internal link refs: ${totalLinks} · distinct R2 imgs: ${r2Imgs.size}`);
section('BROKEN internal links', brokenLinks);
section('PLAIN refs to R2-only image dirs (404 on prod)', badImgRefs);
section('MISSING bundle images', missingBundleImgs);
section('BROKEN hreflang targets', badHreflang);
section('INVALID JSON-LD', badJsonLd);
section('SITEMAP locs missing from dist', sitemapMissing.map((s) => [s, ['sitemap']]));
if (CHECK_R2) section('R2 images broken (HEAD != 200)', r2Broken.map((s) => [s, ['r2']]));

fs.writeFileSync(path.join(ROOT, '_internal/qa/SITE-INTEGRITY-AUDIT.txt'), lines.join('\n') + '\n');
console.log(lines.slice(0, 8).join('\n'));
console.log(`\nTOTALS → brokenLinks:${brokenLinks.size} plainR2refs:${badImgRefs.size} missingBundleImgs:${missingBundleImgs.length} badHreflang:${badHreflang.size} badJsonLd:${badJsonLd.length} sitemapMissing:${sitemapMissing.length}${CHECK_R2 ? ' r2Broken:' + r2Broken.length : ''}`);
console.log('full report: _internal/qa/SITE-INTEGRITY-AUDIT.txt');
