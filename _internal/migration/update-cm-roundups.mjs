#!/usr/bin/env node
// Mark the Chiang Mai hotel-roundup batch done in the manifest. reviewSlugs are read
// from each roundup's entries[].reviewUrl (authoritative). Status-preserving for others.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const RD = join(ROOT, 'astro/src/content/roundups');
const MF = join(HERE, 'manifest.json');
const DONE = '2026-06-14';

// oldSlug → newRoundupSlug
const MAP = {
  'top5-nature-chiang-mai-hotel': 'top5-nature-hotels-chiang-mai',
  'top5-hotel-chiang-mai-we-travel-together': 'top5-popular-hotels-chiang-mai',
  'topten-hotels-chiangmai': 'top10-wualai-walking-street-hotels-chiang-mai',
  'top-ten-chiang-mai-hotels': 'top10-popular-hotels-chiang-mai',
  'top-ten-hotels-chiang-mai': 'top10-luxury-hotels-chiang-mai',
  'topten-chiang-mai-hotels': 'top10-nimman-budget-hotels-chiang-mai',
  'topten-hotels-chiang-mai': 'top10-nature-view-hotels-chiang-mai',
  'tipten-chiang-mai-boutique-hotels': 'top10-boutique-hotels-chiang-mai',
};
// single-feature posts → standalone review slug (no roundup)
const SINGLES = {
  'the-empress-premier-chiang-mai': 'review-theempresspremierchiangmai-chiang-mai',
  'chiang-mai-chala-number-6': 'review-chalanumber6-chiang-mai',
};

const reviewSlugsOf = (newSlug) => {
  const o = JSON.parse(readFileSync(join(RD, newSlug + '.json'), 'utf8'));
  return o.entries.map(e => e.reviewUrl.replace(/\.html$/, ''));
};

const raw = JSON.parse(readFileSync(MF, 'utf8'));
const arr = Array.isArray(raw) ? raw : raw.posts;
let updated = 0;
for (const [oldSlug, newSlug] of Object.entries(MAP)) {
  const p = arr.find(x => x.oldSlug === oldSlug);
  if (!p) { console.error('NOT FOUND', oldSlug); continue; }
  const revs = reviewSlugsOf(newSlug);
  p.status = 'done';
  p.newRoundupSlug = newSlug;
  p.reviewSlugs = revs;
  p.newUrls = [newSlug + '.html'];
  p.redirectTo = '/' + newSlug;
  p.doneDate = DONE;
  p.notes = `ported → ${newSlug} (${revs.length} reviews ≥2000w). TH only (EN later). dedup: hotels shared with province set / other CM roundups consolidate at URL-migration.`;
  updated++;
}
for (const [oldSlug, revSlug] of Object.entries(SINGLES)) {
  const p = arr.find(x => x.oldSlug === oldSlug);
  if (!p) { console.error('NOT FOUND', oldSlug); continue; }
  p.status = 'done';
  p.reviewSlugs = [revSlug];
  p.newUrls = [revSlug + '.html'];
  p.redirectTo = '/' + revSlug;
  p.doneDate = DONE;
  p.notes = `single-feature → standalone review ${revSlug} (≥2000w). TH only. slug to clean at URL-migration.`;
  updated++;
}
writeFileSync(MF, JSON.stringify(raw, null, 2));
console.log(`manifest updated: ${updated} CM hotel-roundup posts marked done`);
// quick status tally
const c = {}; for (const p of arr) c[p.status] = (c[p.status] || 0) + 1;
console.log('status now:', JSON.stringify(c));
