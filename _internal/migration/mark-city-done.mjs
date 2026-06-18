#!/usr/bin/env node
// Generic manifest marker. Usage: node _internal/migration/mark-city-done.mjs <markcfg.json>
// markcfg: {
//   doneDate, prov,
//   roundups:       { oldSlug: newRoundupSlug },   // ported hotel-roundups (reviewSlugs read from roundup entries)
//   singles:        { oldSlug: reviewSlug },        // single-feature → standalone review
//   articleRedirect:{ oldSlug: existingArticleSlug },// dedup → 301, no new file
//   articleNew:     { oldSlug: newArticleSlug }      // newly-written article
// }
// Verifies every target file exists before writing. Status-preserving for all other posts.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const RD = join(ROOT, 'astro/src/content/roundups');
const AD = join(ROOT, 'astro/src/content/articles');
const RVD = join(ROOT, 'astro/src/content/reviews');
const MF = join(HERE, 'manifest.json');

const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const DONE = cfg.doneDate || new Date().toISOString().slice(0, 10);
const PROV = cfg.prov || '';

const raw = JSON.parse(readFileSync(MF, 'utf8'));
const arr = Array.isArray(raw) ? raw : raw.posts;
const find = s => arr.find(x => x.oldSlug === s);
let done = 0; const miss = [];

for (const [oldSlug, newSlug] of Object.entries(cfg.roundups || {})) {
  const f = join(RD, newSlug + '.json');
  if (!existsSync(f)) { miss.push(`roundup file missing: ${newSlug}.json`); continue; }
  const p = find(oldSlug); if (!p) { miss.push(`oldSlug not found: ${oldSlug}`); continue; }
  const o = JSON.parse(readFileSync(f, 'utf8'));
  const revs = (o.entries || []).map(e => String(e.reviewUrl || '').replace(/\.html$/, ''));
  // sanity: every referenced review file must exist
  for (const r of revs) if (!existsSync(join(RVD, r + '.json'))) miss.push(`${newSlug}: review file missing: ${r}.json`);
  p.status = 'done'; p.newRoundupSlug = newSlug; p.reviewSlugs = revs;
  p.newUrls = [newSlug + '.html']; p.redirectTo = '/' + newSlug; p.doneDate = DONE;
  p.notes = `ported → ${newSlug} (${revs.length} reviews ≥2000w). TH only (EN later).`;
  done++;
}
for (const [oldSlug, revSlug] of Object.entries(cfg.singles || {})) {
  if (!existsSync(join(RVD, revSlug + '.json'))) { miss.push(`single review missing: ${revSlug}.json`); continue; }
  const p = find(oldSlug); if (!p) { miss.push(`oldSlug not found: ${oldSlug}`); continue; }
  p.status = 'done'; p.reviewSlugs = [revSlug];
  p.newUrls = [revSlug + '.html']; p.redirectTo = '/' + revSlug; p.doneDate = DONE;
  p.notes = `single-feature → standalone review ${revSlug} (≥2000w). TH only.`;
  done++;
}
for (const [oldSlug, target] of Object.entries(cfg.articleRedirect || {})) {
  if (!existsSync(join(AD, target + '.json'))) { miss.push(`redirect target missing: ${target}.json`); continue; }
  const p = find(oldSlug); if (!p) { miss.push(`oldSlug not found: ${oldSlug}`); continue; }
  p.status = 'done'; p.newUrls = [target + '.html']; p.redirectTo = '/' + target; p.doneDate = DONE;
  p.notes = `dedup: reuse existing article ${target} (topic already covered) → 301 redirect. no new file.`;
  done++;
}
for (const [oldSlug, target] of Object.entries(cfg.articleNew || {})) {
  if (!existsSync(join(AD, target + '.json'))) { miss.push(`new article missing: ${target}.json`); continue; }
  const p = find(oldSlug); if (!p) { miss.push(`oldSlug not found: ${oldSlug}`); continue; }
  p.status = 'done'; p.newUrls = [target + '.html']; p.redirectTo = '/' + target; p.doneDate = DONE;
  p.notes = `ported → new article ${target} (genuinely-new topic). TH only (EN later).`;
  done++;
}

if (miss.length) { console.error('BLOCKERS:\n  ' + miss.join('\n  ')); process.exit(1); }
writeFileSync(MF, JSON.stringify(raw, null, 2));
const c = {}; for (const p of arr) c[p.status] = (c[p.status] || 0) + 1;
console.log(`manifest updated: ${done} posts marked done (${PROV})`);
console.log('status now:', JSON.stringify(c));
