#!/usr/bin/env node
/* =============================================================================
   drop-road-pins.mjs — remove the coordinates that are only a road

   _internal/geocode-hotels.mjs records precision:'road' when Nominatim only
   knew the street: the stored point is the street's midpoint — right district,
   wrong building. Those entries stay IN THE STORE, with their provenance,
   because the store is a record of what was asked and what came back, and it
   stops the geocoder re-asking. What this script removes is the lat/lng from
   the CONTENT files, which is what the layouts and the maps read.

   It no longer clears SHARED positions (two different hotels on one point).
   It used to, by exact name equality — weaker than check-coords.mjs's
   same-building test. It read "Mayflower Grande Hotel Chiang Mai (Nimman)" and
   "Mayflower Grande Hotel Chiang Mai" — one hotel under two slugs, on the same
   OSM node — as two hotels, and a re-run with --apply would have deleted four
   verified pins. Shared positions are cleared only by
   _internal/drop-shared-positions.mjs, which acts on the gate's own verdicts,
   so the repo has one definition of "same building".

   Nothing is substituted. A review with no coordinate renders its address as a
   Maps search link, and the map gates — ≥60% geocoded per kind on a province
   hub, ≥3 pins and ≥60% on a roundup — decline to draw a map they cannot
   populate honestly.

   Run _internal/geocode-overpass.mjs --apply FIRST: it upgrades what it can to
   a real building, and those are no longer road-level by the time this runs.

   Usage:  node _internal/drop-road-pins.mjs [--apply]
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SIDECAR = path.join(ROOT, '_internal/hotel-coords.json');
const APPLY = process.argv.includes('--apply');
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];

const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const store = readJson(SIDECAR, {});
const reviewPath = (slug, suffix) => path.join(ROOT, `astro/src/content/reviews${suffix}`, slug + '.json');

const targets = [];
for (const [slug, v] of Object.entries(store)) {
  if (!v || !Number.isFinite(v.lat)) continue;
  /* 'area' = a village, estate or district answered instead of the building. */
  if (v.precision === 'road' || v.precision === 'area') targets.push({ slug, why: `${v.precision}-level lookup: "${v.q}"` });
}

let files = 0, missing = 0;
const per = {};
for (const t of targets) {
  let hit = 0;
  for (const suffix of LOC) {
    const f = reviewPath(t.slug, suffix);
    if (!fs.existsSync(f)) continue;
    const raw = fs.readFileSync(f, 'utf8');
    const j = readJson(f, null);
    if (!j || (j.lat === undefined && j.lng === undefined)) continue;
    delete j.lat; delete j.lng;
    if (APPLY) fs.writeFileSync(f, serializeLike(raw, j).text);
    per[`reviews${suffix}`] = (per[`reviews${suffix}`] || 0) + 1;
    hit++; files++;
  }
  if (!hit) missing++;
}

console.log(`${targets.length} road-level hotel(s) cannot be pinned honestly`);
console.log(`${files} content file(s) ${APPLY ? 'updated' : 'would be updated'}${missing ? ` · ${missing} already had no coordinate` : ''}`);
for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
console.log('Shared positions are handled by _internal/drop-shared-positions.mjs.');
if (!APPLY) {
  console.log('');
  for (const t of targets.slice(0, 15)) console.log(`  - ${t.slug}\n      ${t.why}`);
  if (targets.length > 15) console.log(`  … ${targets.length - 15} more`);
  console.log('\nDRY RUN — nothing written. Re-run with --apply.');
} else {
  console.log('\nNow: node _internal/gen-feeds.mjs   (rebuilds review-coords.json, which every map reads)');
  console.log('Then: node _internal/qa/check-coords.mjs');
}
