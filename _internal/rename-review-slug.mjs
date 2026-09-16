#!/usr/bin/env node
/* =============================================================================
   rename-review-slug.mjs — give a review a different URL, keeping the page

   A rename is NOT a merge. The page goes on existing, so:
     · the content file moves to the new name in every locale it exists in
     · its own `slug` field follows
     · every reference to the old slug points at the new one
     · the old URL 301s to the new one, forever

   What this deliberately does NOT touch:
     · IMAGE filenames that contain the old slug. They are filenames, not
       references; renaming them would break the R2 objects they name.
     · dated audit/QA records (_internal/qa/qa-ledger.json,
       _internal/qa/verdicts-bangkok.json, _internal/wf/site-audit-report.json).
       Those say what was true on the day they ran. Rewriting them would
       falsify history, and nothing reads them to build the site.
     · generated output — near-me-index.json, search-index.json, feeds/*.json,
       review-coords.json, city-*.html. The prebuild rewrites all of these from
       the content files, so editing them by hand is churn the next build
       overwrites. Rebuild instead.

   What it DOES rewrite, besides the content files:
     · _internal/hotel-coords.json — a store keyed BY SLUG. A stale key would
       orphan the pin and silently drop it off the maps.
     · _internal/pin-fixes.json — the evidence record is keyed by slug too, and
       the live-verify checks read it. A stale slug there makes a passing check
       fail for a page that is perfectly fine (that happened twice on
       2026-09-16 after the duplicate merge).

   The old slug is matched on a word boundary: any slug is a prefix of a longer
   slug that extends it.

   Dry run by default. Usage:
     node _internal/rename-review-slug.mjs <old-slug> <new-slug> [--apply]
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const [OLD, NEW] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!OLD || !NEW) { console.log('usage: node _internal/rename-review-slug.mjs <old-slug> <new-slug> [--apply]'); process.exit(2); }

const LOCS = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const KINDS = ['reviews', 'roundups', 'articles'];
const dirOf = (loc, kind) => path.join(ROOT, 'astro/src/content', kind + (loc === 'th' ? '' : `-${loc}`));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = new RegExp(esc(OLD) + '(?![a-z0-9-])', 'g');
/* an image reference is a filename, not a link — leave those alone */
const IMAGEY = /\.(jpe?g|png|webp|avif|gif|svg)(?=["'?]|$)/i;

const moves = [], edits = [], skipped = [];

/* 1. the review file itself, per locale */
const locales = [];
for (const loc of LOCS) {
  const from = path.join(dirOf(loc, 'reviews'), `${OLD}.json`);
  if (!fs.existsSync(from)) continue;
  const to = path.join(dirOf(loc, 'reviews'), `${NEW}.json`);
  if (fs.existsSync(to)) { console.log(`✗ ${loc}: ${NEW}.json already exists — refusing to overwrite`); process.exit(1); }
  locales.push(loc);
  const raw = fs.readFileSync(from, 'utf8');
  const data = JSON.parse(raw);
  if (data.slug === OLD) data.slug = NEW;
  if (data.canonicalSlug === OLD) data.canonicalSlug = NEW;
  const out = serializeLike(raw, data).text;
  JSON.parse(out);
  moves.push({ loc, from, to, out });
}
if (!locales.length) { console.log(`✗ no review file named ${OLD}.json in any locale`); process.exit(1); }

/* 2. references in content, every locale and kind */
for (const loc of LOCS) for (const kind of KINDS) {
  const dir = dirOf(loc, kind);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json') || f === `${OLD}.json`) continue;
    const file = path.join(dir, f);
    const raw = fs.readFileSync(file, 'utf8');
    if (!RE.test(raw)) { RE.lastIndex = 0; continue; }
    RE.lastIndex = 0;
    const where = [];
    const rewrite = (o) => {
      if (typeof o === 'string') return IMAGEY.test(o) && o.includes(OLD) ? o : o.replace(RE, NEW);
      if (Array.isArray(o)) return o.map(rewrite);
      if (o && typeof o === 'object') { const n = {}; for (const k of Object.keys(o)) { const v = rewrite(o[k]); if (typeof o[k] === 'string' && v !== o[k]) where.push(`${k}`); n[k] = v; } return n; }
      return o;
    };
    const data = rewrite(JSON.parse(raw));
    const out = serializeLike(raw, data).text;
    JSON.parse(out);
    if (out === raw) { skipped.push(path.relative(ROOT, file)); continue; }
    edits.push({ file, out, where: [...new Set(where)] });
  }
}

/* 3. stores keyed by slug — a stale key orphans the pin */
const stores = [];
for (const rel of ['_internal/hotel-coords.json', '_internal/pin-fixes.json']) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, 'utf8');
  if (!RE.test(raw)) { RE.lastIndex = 0; continue; }
  RE.lastIndex = 0;
  const data = JSON.parse(raw);
  let n = 0;
  if (Array.isArray(data)) {
    for (const e of data) if (e && e.slug === OLD) { e.slug = NEW; n++; }
  } else {
    if (Object.prototype.hasOwnProperty.call(data, OLD)) {
      /* rebuild in place so the key keeps its position in the file */
      const rebuilt = {};
      for (const k of Object.keys(data)) rebuilt[k === OLD ? NEW : k] = data[k];
      for (const k of Object.keys(data)) delete data[k];
      Object.assign(data, rebuilt);
      n++;
    }
  }
  const out = serializeLike(raw, data).text;
  JSON.parse(out);
  stores.push({ file, out, n, rel });
}

console.log(`${APPLY ? 'applying' : 'dry run'} · ${OLD} → ${NEW}`);
console.log(`  review file moves: ${moves.length} (${locales.join(', ')})`);
for (const m of moves) console.log(`     ${m.loc}: ${path.basename(m.from)} → ${path.basename(m.to)}`);
console.log(`  content references rewritten: ${edits.length} file(s)`);
for (const e of edits) console.log(`     ${path.relative(ROOT, e.file).replace(/\\/g, '/')}  [${e.where.join(', ')}]`);
console.log(`  slug-keyed stores updated: ${stores.length}`);
for (const s of stores) console.log(`     ${s.rel} (${s.n} entr${s.n === 1 ? 'y' : 'ies'})`);
if (skipped.length) console.log(`  mentions left alone (image filenames): ${skipped.join(', ')}`);
console.log('  NOT touched: generated output (near-me/search index, feeds, review-coords, city-*.html) — rebuild regenerates them');
console.log('  NOT touched: dated audit records (qa-ledger, verdicts-*, site-audit-report) — they record what was true when they ran');

if (!APPLY) { console.log('\nDRY RUN — nothing written. Re-run with --apply.'); process.exit(0); }
for (const m of moves) { fs.writeFileSync(m.to, m.out); fs.rmSync(m.from); }
for (const e of edits) fs.writeFileSync(e.file, e.out);
for (const s of stores) fs.writeFileSync(s.file, s.out);
console.log(`\nwritten · ${moves.length} moved · ${edits.length} reference file(s) · ${stores.length} store(s)`);
console.log(`Next: add {"from":"${OLD}","to":"${NEW}","locales":${JSON.stringify(locales)}} to _internal/renamed-slugs.json,`);
console.log('then node _internal/gen-duplicate-redirects.mjs --apply, then rebuild.');
