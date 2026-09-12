#!/usr/bin/env node
/* =============================================================================
   drop-road-pins.mjs — remove the coordinates that are not positions

   Two kinds of entry in _internal/hotel-coords.json cannot honestly be a pin:

     precision:'road'     Nominatim only knew the street. The stored point is
                          the street's midpoint. Right district, wrong building.

     shared position      Two or more DIFFERENT hotels carrying identical
                          coordinates to five decimals. Two buildings cannot
                          share a rooftop point, so whatever answered was an
                          area, not an address. (One hotel under several slugs
                          is excluded — that is one building and is fine.)

   Both are LEFT IN THE STORE, with their provenance, because the store is a
   record of what was asked and what came back, and because keeping them stops
   the geocoder re-asking a question that has already been answered. What this
   script removes is the lat/lng from the CONTENT files, which is what the
   layouts and the maps read.

   Nothing is substituted. A review with no coordinate renders its address as a
   Google Maps link (ReviewLayout has done this since 2026-07-18), and the map
   gates — ≥60% geocoded per kind on a province hub, ≥3 pins and ≥60% on a
   roundup — simply decline to draw a map they cannot populate honestly.

   Run _internal/geocode-overpass.mjs --apply FIRST: it upgrades what it can to
   a real building, and those are no longer road-level by the time this runs.

   Usage:  node _internal/drop-road-pins.mjs [--apply]
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SIDECAR = path.join(ROOT, '_internal/hotel-coords.json');
const APPLY = process.argv.includes('--apply');
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];

const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const store = readJson(SIDECAR, {});
const reviewPath = (slug, suffix) => path.join(ROOT, `astro/src/content/reviews${suffix}`, slug + '.json');
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9฀-๿]+/g, '');

/* Positions held by two or more differently-named hotels. */
const byPos = new Map();
for (const [slug, v] of Object.entries(store)) {
  if (!v || !Number.isFinite(v.lat)) continue;
  const k = `${v.lat.toFixed(5)},${v.lng.toFixed(5)}`;
  if (!byPos.has(k)) byPos.set(k, []);
  byPos.get(k).push(slug);
}
const shared = new Map();      /* slug → why */
for (const [pos, slugs] of byPos) {
  if (slugs.length < 2) continue;
  const names = new Set(slugs.map((s) => norm(readJson(reviewPath(s, ''), {}).name)));
  if (names.size < 2) continue;
  for (const s of slugs) shared.set(s, `${names.size} different hotels share ${pos}`);
}

const targets = [];
for (const [slug, v] of Object.entries(store)) {
  if (!v || !Number.isFinite(v.lat)) continue;
  if (v.precision === 'road') targets.push({ slug, why: `road-only lookup: "${v.q}"` });
  else if (shared.has(slug)) targets.push({ slug, why: shared.get(slug) });
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
    if (APPLY) fs.writeFileSync(f, JSON.stringify(j, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
    per[`reviews${suffix}`] = (per[`reviews${suffix}`] || 0) + 1;
    hit++; files++;
  }
  if (!hit) missing++;
}

console.log(`${targets.length} hotel(s) cannot be pinned honestly`);
console.log(`  ${targets.filter((t) => t.why.startsWith('road')).length} road-only · ${targets.filter((t) => !t.why.startsWith('road')).length} sharing a position with a different hotel`);
console.log(`${files} content file(s) ${APPLY ? 'updated' : 'would be updated'}${missing ? ` · ${missing} already had no coordinate` : ''}`);
for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
if (!APPLY) {
  console.log('');
  for (const t of targets.slice(0, 15)) console.log(`  - ${t.slug}\n      ${t.why}`);
  if (targets.length > 15) console.log(`  … ${targets.length - 15} more`);
  console.log('\nDRY RUN — nothing written. Re-run with --apply.');
} else {
  console.log('\nNow: node _internal/gen-feeds.mjs   (rebuilds review-coords.json, which every map reads)');
  console.log('Then: node _internal/qa/check-coords.mjs');
}
