/* The redirects in worker-redirects.js must be honest about the build:
     · every redirect SOURCE must no longer exist in astro/dist — a redirect
       that shadows a live page would take a working page off the site
     · every redirect TARGET must exist in astro/dist
     · every merged/removed slug in _internal/duplicate-reviews.json and every
       renamed slug in _internal/renamed-slugs.json must have an entry for each
       locale it was published in
     · astro/public/_redirects must stay within Cloudflare's 100-rule limit —
       the 2026-09-16 deploy was rejected outright for exceeding it (code
       100324) with 280 rules, which is why these redirects moved to the Worker

   worker.js answers these before falling through to assets; the map holds the
   clean path and the Worker strips a trailing .html, so one entry covers both
   URL shapes.
   Read-only. Run after the build, before deploying.
   Usage: node check-duplicate-redirects.mjs        (exit 1 = a check failed) */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const doc = JSON.parse(fs.readFileSync('_internal/duplicate-reviews.json', 'utf8'));
const renamedDoc = fs.existsSync('_internal/renamed-slugs.json')
  ? JSON.parse(fs.readFileSync('_internal/renamed-slugs.json', 'utf8'))
  : { renamed: [] };
const { MOVED_PAGES } = await import(pathToFileURL(`${ROOT}/worker-redirects.js`).href);
const page = (p) => {
  const rel = p.replace(/^\//, '').replace(/\.html$/, '');
  return fs.existsSync(`astro/dist/${rel}.html`) || fs.existsSync(`astro/dist/${rel}/index.html`);
};

let fail = 0, pass = 0;
const bad = (m) => { fail++; console.log('✗ ' + m); };
for (const [src, tgt] of Object.entries(MOVED_PAGES)) {
  if (src.endsWith('.html')) { bad(`${src}: stored with .html — the Worker strips it, so this entry can never match`); continue; }
  if (page(src)) { bad(`${src}: still exists in the build — the redirect would shadow a live page`); continue; }
  if (!page(tgt)) { bad(`${src} → ${tgt}: the target page is not in the build`); continue; }
  pass++;
}
const prefix = (loc) => (loc === 'th' ? '' : `/${loc}`);
let expected = 0;
const want = (loc, slug, what, target) => {
  expected++;
  const p = `${prefix(loc)}/${slug}`;
  const got = MOVED_PAGES[p];
  if (!got) { bad(`${what}: no redirect for ${p}`); return; }
  if (target && got !== target) { bad(`${what}: ${p} → ${got}, expected ${target}`); return; }
  pass++;
};
for (const g of doc.groups || []) for (const [slug, locs] of Object.entries(g.redirectLocales || {})) for (const loc of locs) want(loc, slug, g.hotel);
for (const r of doc.removed || []) for (const loc of r.locales || ['th']) want(loc, r.slug, 'removed hotel');
/* a renamed page still exists — so its target must be the NEW url, exactly */
for (const r of renamedDoc.renamed || []) for (const loc of r.locales || ['th']) want(loc, r.from, `renamed ${r.from}`, `${prefix(loc)}/${r.to}`);

/* the limit that rejected the 2026-09-16 deploy — every rule counts, not just splats */
const rules = fs.readFileSync('astro/public/_redirects', 'utf8').split('\n').filter((l) => l.trimStart().startsWith('/'));
if (rules.length > 100) bad(`astro/public/_redirects has ${rules.length} rules — Cloudflare rejects the deploy above 100`);
else pass++;

const nRenamed = (renamedDoc.renamed || []).reduce((n, r) => n + (r.locales || ['th']).length, 0);
console.log(`${Object.keys(MOVED_PAGES).length} redirect(s) in worker-redirects.js (${nRenamed} renamed) · ${expected} pages × locales · _redirects rules ${rules.length}/100 · checks passed ${pass}`);
console.log(fail ? `${fail} redirect check(s) failed` : 'all redirect checks passed');
process.exit(fail ? 1 : 0);
