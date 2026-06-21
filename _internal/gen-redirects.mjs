// Generate redirects for the WordPress→Astro cutover (Cloudflare Bulk Redirects CSV + _redirects).
//   • astro/public/_redirects      → WooCommerce/WP splat patterns only (≤100 dynamic limit)
//   • _internal/bulk-redirects.csv → old-URL → new-page 301s, BOTH trailing-slash + no-slash variants
//                                    (Cloudflare Bulk Redirects is slash-sensitive), for upload.
// Sources: migration manifest (195 migrated posts) + a curated map of old WP pages/sections not in
// the manifest (found via the Wayback Machine). Demo/theme/taxonomy junk is intentionally left to 404.
// Run: node _internal/gen-redirects.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE = 'https://thailandaddict.com';
const m = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/migration/manifest.json'), 'utf8'));
const posts = m.posts || [];

// valid targets = content slugs + public hub pages
const slugs = new Set();
for (const d of ['articles', 'roundups', 'reviews']) {
  const dir = path.join(ROOT, 'astro/src/content', d);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) slugs.add('/' + f.slice(0, -5));
}
const pub = path.join(ROOT, 'astro/public');
for (const f of fs.readdirSync(pub)) if (f.endsWith('.html')) slugs.add('/' + f.slice(0, -5));

const pathOf = u => { try { return new URL(u).pathname; } catch { return null; } };
const pairs = [];          // [sourcePath, targetPath]
let mapped = 0, bad = 0;

// 1) migration manifest posts
for (const p of posts) {
  const op = pathOf(p.oldUrl); if (!op) continue;
  let tgt = (p.status !== 'skip' && p.type !== 'demo') ? (p.redirectTo || '/') : '/';
  if (tgt !== '/' && !slugs.has(tgt)) { bad++; tgt = (p.city && p.city !== '-' && slugs.has('/city-' + p.city)) ? '/city-' + p.city : '/'; }
  pairs.push([op, tgt]); mapped++;
}

// 2) curated old WP pages/sections NOT in the manifest (Wayback). Junk/demo intentionally omitted → 404.
const EXTRA = {
  '/about-us': '/about',
  '/contact-us': '/contact', '/contact-us-2': '/contact', '/contact-new': '/contact',
  '/privacy-policy-2': '/privacy', '/terms-and-conditions': '/privacy', '/terms-of-service': '/privacy', '/tour-term-condition': '/privacy',
  '/bangkok': '/city-bangkok',
  '/central-thailand': '/region-central', '/eastern-thailand': '/region-east', '/isan-northeastern-thailand': '/region-isan',
  '/northern-thailand': '/region-north', '/southern-thailand': '/region-south', '/western-thailand': '/region-west',
  '/destinations': '/destinations', '/top-destination-thailand': '/destinations', '/top-destination': '/destinations',
  '/tips': '/plan-your-trip', '/travel-tips': '/plan-your-trip',
  '/top10-chiangmai-thailand-travel-food-hotels': '/city-chiang-mai',
  '/top-10-hotels-nakhon-ratchasima': '/city-nakhon-ratchasima',
  '/kg-house-kanchanaburi-hallstatt-austria': '/city-kanchanaburi',
  '/food': '/', '/news': '/', '/blog': '/', '/blogs': '/', '/tours': '/',
};
const extraBad = [];
for (const [src, tgt] of Object.entries(EXTRA)) {
  if (tgt !== '/' && !slugs.has(tgt)) { extraBad.push(src + '→' + tgt); continue; }
  pairs.push([src, tgt]);
}

// emit BOTH slash + no-slash source variants (Cloudflare Bulk Redirects is slash-sensitive)
const rows = [['source', 'target', 'status']];
const seen = new Set();
for (const [op, tgt] of pairs) {
  const noSlash = op.replace(/\/$/, '') || '/';
  const withSlash = noSlash === '/' ? '/' : noSlash + '/';
  for (const src of new Set([noSlash, withSlash])) {
    if (src === '/' ) continue;            // never redirect the homepage
    if (seen.has(src)) continue; seen.add(src);
    rows.push([BASE + src, BASE + tgt, '301']);
  }
}
fs.writeFileSync(path.join(ROOT, '_internal/bulk-redirects.csv'), rows.map(r => r.join(',')).join('\n') + '\n');

// _redirects: splat patterns only
const patterns = [
  '/product/* / 301', '/product-category/* / 301', '/cart / 301', '/checkout / 301',
  '/my-account/* / 301', '/shop / 301', '/tours/* / 301', '/tour/* / 301',
  '/deals/* / 301', '/destination/* / 301',
  '/main-demo/* / 301', '/tour-category/* / 301', '/tour-destination/* / 301', '/tour-month/* / 301',
];
const header = `# thailandaddict — _redirects (Cloudflare Workers Static Assets · ≤100 dynamic)
# Splat patterns for WooCommerce/WP/theme paths. Old-URL 301s (both slash variants) are in
# _internal/bulk-redirects.csv → Cloudflare Bulk Redirects. Regenerate: node _internal/gen-redirects.mjs
`;
fs.writeFileSync(path.join(pub, '_redirects'), header + patterns.join('\n') + '\n');

console.log(`bulk-redirects.csv: ${rows.length - 1} rows (${mapped} manifest + ${Object.keys(EXTRA).length - extraBad.length} extra, ×slash variants) · _redirects: ${patterns.length} patterns`);
if (extraBad.length) console.log('  ⚠ extra targets missing on disk (skipped):', extraBad.join(', '));
