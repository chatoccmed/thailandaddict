/* The merge repointed 820 references, but that count came from the files it
   touched. This sweeps the WHOLE build instead: any href anywhere in astro/dist
   that still points at a merged, removed or RENAMED page's old URL is a link
   the reader would follow into a 301 — or, for a page never regenerated, into
   nothing.

   Sweeping the diff is not enough and that is not hypothetical: after the
   2026-09-16 merge, 35 links survived on activities-* hubs in seven locales
   because no build step regenerates those snapshots.

   A merged slug is a PREFIX of the page that kept it
   (review-akyra-manor-chiang-mai is inside review-akyra-manor-chiang-mai-chiang-mai),
   so every match needs a word boundary or the sweep reports the keeper as a hit.
   Read-only. Exit 1 = a stale link survives. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const doc = JSON.parse(fs.readFileSync('_internal/duplicate-reviews.json', 'utf8'));
const gone = new Set();
for (const g of doc.groups || []) for (const s of g.redirect) gone.add(s);
for (const r of doc.removed || []) gone.add(r.slug);
/* A renamed page's OLD slug is just as gone: the page still exists, but not at
   that URL. Same exposure as a merge — the reference survives wherever nothing
   regenerates it — so the sweep has to cover renames too. */
if (fs.existsSync('_internal/renamed-slugs.json')) {
  for (const r of JSON.parse(fs.readFileSync('_internal/renamed-slugs.json', 'utf8')).renamed || []) gone.add(r.from);
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* href to the slug, either URL shape, not followed by more slug characters */
const RE = new RegExp('href="[^"]*?/(' + [...gone].map(esc).join('|') + ')(\\.html)?(?![a-z0-9-])[^"]*"', 'g');

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(html|json)$/.test(e.name)) out.push(p);
  }
  return out;
};
const files = walk('astro/dist');
console.log(`${gone.size} merged/removed slug(s) · sweeping ${files.length} built file(s)\n`);

const hits = new Map();
let scanned = 0;
for (const f of files) {
  const body = fs.readFileSync(f, 'utf8');
  scanned++;
  let m;
  RE.lastIndex = 0;
  while ((m = RE.exec(body))) {
    const key = m[1];
    if (!hits.has(key)) hits.set(key, []);
    const list = hits.get(key);
    if (list.length < 4) list.push(`${f.replace(/\\/g, '/').replace('astro/dist', '')} → ${m[0].slice(6, -1)}`);
  }
}
if (hits.size) {
  for (const [slug, where] of hits) {
    console.log(`✗ ${slug} — still linked from:`);
    for (const w of where) console.log(`     ${w}`);
  }
  console.log(`\n${hits.size} merged page(s) still linked in the build`);
  process.exit(1);
}
console.log(`no stale links: ${scanned} files carry 0 links to the ${gone.size} merged/removed pages`);
