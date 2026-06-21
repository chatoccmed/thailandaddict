// Generate astro/public/_redirects (301s) from the migration manifest + WP/WooCommerce cruft.
// Old WP URLs → new Astro pages, to preserve SEO on the WordPress→Astro cutover.
// Run: node _internal/gen-redirects.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
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
const lines = [], bad = [];
let n = 0;
for (const p of posts) {
  const op = pathOf(p.oldUrl); if (!op) continue;
  let tgt = (p.status !== 'skip' && p.type !== 'demo') ? (p.redirectTo || '/') : '/';
  if (tgt !== '/' && !slugs.has(tgt)) {
    bad.push(op + ' -> ' + tgt);
    tgt = (p.city && p.city !== '-' && slugs.has('/city-' + p.city)) ? '/city-' + p.city : '/';
  }
  const opNoSlash = op.replace(/\/$/, '');
  lines.push(op + ' ' + tgt + ' 301');
  if (opNoSlash !== op) lines.push(opNoSlash + ' ' + tgt + ' 301');
  n++;
}

// WordPress / WooCommerce paths that no longer exist → home (splat patterns, evaluated after exact matches)
const patterns = [
  '/product/* / 301', '/product-category/* / 301', '/cart / 301', '/checkout / 301',
  '/my-account/* / 301', '/shop / 301', '/tours/* / 301', '/tour/* / 301',
  '/deals/* / 301', '/destination/* / 301',
];

const header = `# thailandaddict — Redirects (Cloudflare Workers Static Assets)
# Generated from _internal/migration/manifest.json (195 migrated posts) + WooCommerce/WP cruft.
# Regenerate: node _internal/gen-redirects.mjs
# www -> non-www : Cloudflare Redirect Rule (dashboard) · 404 : not_found_handling in wrangler.jsonc
#
# --- WordPress/WooCommerce paths that no longer exist ---
${patterns.join('\n')}
#
# --- Old WP posts -> new pages (301, SEO-preserving) ---
`;
fs.writeFileSync(path.join(pub, '_redirects'), header + lines.join('\n') + '\n');
console.log(`_redirects written · ${n} posts mapped (${lines.length} exact rules + ${patterns.length} patterns) · bad targets: ${bad.length}`);
if (bad.length) console.log('  remapped:', bad.slice(0, 8).join(' | '));
