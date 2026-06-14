#!/usr/bin/env node
// Mark CM food/travel batch done: 10 redirect to existing articles, 6 new article pages.
// Verifies each target article file exists before marking done.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const AD = join(ROOT, 'astro/src/content/articles');
const MF = join(HERE, 'manifest.json');
const DONE = '2026-06-14';

// oldSlug → existing article slug (reuse, redirect; no new file)
const REDIRECT = {
  'top10-dinner-restaurant-chiang-mai-2566-2023': 'chiang-mai-fine-dining',
  'top10-dinner-restaurant-chiang-mai': 'chiang-mai-fine-dining',
  'top-ten-nighttime-food-chiang-mai': 'chiang-mai-street-food',
  'walking-street-chiang-mai': 'chiang-mai-sunday-walking-street',
  'topten-restaurant-chiang-mai-food': 'chiang-mai-food-guide',
  'top10-nature-travel-chiang-mai': 'chiang-mai-nature-doi-plan',
  'top20-travel-place-chiang-mai-by-traveloka': 'chiang-mai-attractions',
  'top15-travel-place-chiang-mai-by-traveloka': 'chiang-mai-attractions',
  'topten-chiang-mai-check-in': 'chiang-mai-photo-spots-plan',
  'chaing-mai-travel-green-trip-3day-2night': 'chiang-mai-3d2n-itinerary',
};
// oldSlug → newly-written article slug
const NEW = {
  'top-10-khao-soi-at-chiang-mai': 'chiang-mai-khao-soi',
  'top-ten-restaurant-coffee-shop': 'chiang-mai-out-of-town-dining',
  'chiang-mai-road-trip-doi-angkhang': 'chiang-mai-doi-angkhang-road-trip',
  'top10-new-opening-travel-place-in-chiang-mai': 'chiang-mai-new-attractions',
  'top10-kid-travel-place-chiang-mai': 'chiang-mai-kid-attractions',
  'ev-road-trip-bangkok-to-chiang-mai': 'chiang-mai-ev-road-trip',
};

const raw = JSON.parse(readFileSync(MF, 'utf8'));
const arr = Array.isArray(raw) ? raw : raw.posts;
let done = 0, miss = [];
for (const [oldSlug, target] of Object.entries(REDIRECT)) {
  if (!existsSync(join(AD, target + '.json'))) { miss.push(`REDIRECT target missing: ${target}`); continue; }
  const p = arr.find(x => x.oldSlug === oldSlug);
  if (!p) { miss.push(`not found: ${oldSlug}`); continue; }
  p.status = 'done';
  p.newUrls = [target + '.html'];
  p.redirectTo = '/' + target;
  p.doneDate = DONE;
  p.notes = `dedup: reuse existing article ${target} (topic already covered) → 301 redirect. no new file.`;
  done++;
}
for (const [oldSlug, target] of Object.entries(NEW)) {
  if (!existsSync(join(AD, target + '.json'))) { miss.push(`NEW article missing: ${target}`); continue; }
  const p = arr.find(x => x.oldSlug === oldSlug);
  if (!p) { miss.push(`not found: ${oldSlug}`); continue; }
  p.status = 'done';
  p.newUrls = [target + '.html'];
  p.redirectTo = '/' + target;
  p.doneDate = DONE;
  p.notes = `ported → new article ${target} (genuinely-new topic). TH only (EN later).`;
  done++;
}
if (miss.length) { console.error('BLOCKERS:\n' + miss.join('\n')); process.exit(1); }
writeFileSync(MF, JSON.stringify(raw, null, 2));
console.log(`manifest updated: ${done}/16 CM food+travel posts marked done`);
const c = {}; for (const p of arr) c[p.status] = (c[p.status] || 0) + 1;
console.log('status now:', JSON.stringify(c));
