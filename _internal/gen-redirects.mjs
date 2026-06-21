// Generate redirects for the WordPress→Astro cutover.
// Cloudflare Workers Static Assets _redirects allows only 100 "dynamic" rules, and the 195 old-post
// path→path redirects count against that — so we SPLIT:
//   • astro/public/_redirects        → only the WooCommerce/WP splat patterns (well under 100)
//   • _internal/bulk-redirects.csv   → the 195 old-post → new-page 301s, for Cloudflare Bulk Redirects
//                                      (Redirect Rules → Bulk Redirects → upload list) at domain cutover.
// The old-post redirects only matter once thailandaddict.com points at the Worker, so workers.dev is
// unaffected by keeping them out of _redirects.
// Run: node _internal/gen-redirects.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const BASE = 'https://thailandaddict.com';
const m = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/migration/manifest.json'), 'utf8'));
const posts = m.posts || [];

// Valid redirect targets = content slugs + public hub pages
const slugs = new Set();
for (const d of ['articles', 'roundups', 'reviews']) {
  const dir = path.join(ROOT, 'astro/src/content', d);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) slugs.add('/' + f.slice(0, -5));
}
const pub = path.join(ROOT, 'astro/public');
for (const f of fs.readdirSync(pub)) if (f.endsWith('.html')) slugs.add('/' + f.slice(0, -5));

const pathOf = u => { try { return new URL(u).pathname; } catch { return null; } };

// --- Bulk Redirects CSV (old WP post URLs → new pages) ---
const rows = [['source', 'target', 'status']];
let mapped = 0, bad = 0;
for (const p of posts) {
  const op = pathOf(p.oldUrl); if (!op) continue;
  let tgt = (p.status !== 'skip' && p.type !== 'demo') ? (p.redirectTo || '/') : '/';
  if (tgt !== '/' && !slugs.has(tgt)) { bad++; tgt = (p.city && p.city !== '-' && slugs.has('/city-' + p.city)) ? '/city-' + p.city : '/'; }
  rows.push([BASE + op, BASE + tgt, '301']);
  mapped++;
}
fs.writeFileSync(path.join(ROOT, '_internal/bulk-redirects.csv'), rows.map(r => r.join(',')).join('\n') + '\n');

// --- _redirects (splat patterns only — dynamic, must stay ≤100) ---
const patterns = [
  '/product/* / 301', '/product-category/* / 301', '/cart / 301', '/checkout / 301',
  '/my-account/* / 301', '/shop / 301', '/tours/* / 301', '/tour/* / 301',
  '/deals/* / 301', '/destination/* / 301',
];
const header = `# thailandaddict — _redirects (Cloudflare Workers Static Assets)
# Only WooCommerce/WordPress paths that no longer exist (splat rules; Cloudflare caps dynamic rules at 100).
# The 195 old-post → new-page 301s live in _internal/bulk-redirects.csv → load via Cloudflare
# Bulk Redirects at domain cutover (they only apply once thailandaddict.com points here).
# Regenerate: node _internal/gen-redirects.mjs
# www -> non-www : Cloudflare Redirect Rule (dashboard) · 404 : not_found_handling in wrangler.jsonc
`;
fs.writeFileSync(path.join(pub, '_redirects'), header + patterns.join('\n') + '\n');
console.log(`_redirects: ${patterns.length} splat rules · bulk-redirects.csv: ${mapped} old-post 301s (${bad} retargeted to hub/home)`);
