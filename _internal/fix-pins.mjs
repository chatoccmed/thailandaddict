#!/usr/bin/env node
/* =============================================================================
   fix-pins.mjs — drop or move named pins, each one with its evidence on record

   The other two droppers act on rules the gate can evaluate by itself
   (road-level precision, two venues on one point). Some wrong pins can only be
   shown wrong with outside evidence — OSM geometry, a house-number sequence,
   what Nominatim actually matched — so they are listed in
   _internal/pin-fixes.json, one entry per pin, with that evidence:

     { "batch": "2026-09-14-area-centres", "action": "drop" | "move",
       "kind": "articles" | "reviews" | "place-coords",
       "slug": "...", "at": "(root)" | "blocks.N",
       "pos": "lat,lng",       the point being replaced — must still be there
       "to": "lat,lng",        move only
       "via": "overpass",      move only: what the new point came from
       "osm": "way/1", "rule": "...", "evidence": "...",
       "demote": "road" | "area"   reviews drop only, see below }

   Content ("articles", "reviews"): every locale twin that carries the SAME
   point at the same path is changed. A twin whose point differs is left alone —
   its blocks may be out of step, and it must not lose a different venue's pin.

   Stores — so the next geocoding run cannot quietly undo the fix:
     · a dropped place-coords row becomes a { why, q } miss record; the
       Nominatim attraction geocoder skips any slug that has a record.
     · a dropped hotel-coords row becomes a { why, q } miss record — or, with
       "demote", keeps its point with precision "road" / "area": geocode-hotels
       --apply writes only "poi" records into content, and geocode-overpass.mjs
       tries to upgrade road and area records to the actual building.
     · a moved pin's store row takes the new point, and keeps the old one
       under "was".

   Usage:  node _internal/fix-pins.mjs [--batch <id>] [--apply]
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const bi = process.argv.indexOf('--batch');
const BATCH = bi > 0 ? process.argv[bi + 1] : null;
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];
const LOG = path.join(ROOT, '_internal/pin-fixes.json');
const STORE_FILE = {
  reviews: path.join(ROOT, '_internal/hotel-coords.json'),
  'place-coords': path.join(ROOT, '_internal/place-coords.json'),
};

const entries = JSON.parse(fs.readFileSync(LOG, 'utf8')).filter((e) => !BATCH || e.batch === BATCH);
if (!entries.length) { console.error(BATCH ? `no entries in batch ${BATCH}` : 'pin-fixes.json is empty'); process.exit(1); }
for (const e of entries) {
  const bad = !['drop', 'move'].includes(e.action) || !e.pos
    || (e.action === 'move' && !String(e.to || '').split(',').map(Number).every(Number.isFinite));
  if (bad) { console.error(`malformed entry: ${JSON.stringify(e).slice(0, 160)}`); process.exit(1); }
}

const pair = (s) => String(s).split(',').map(Number);

/* Walk to a point by its recorded path — "(root)" or "blocks.N". */
function pointAt(doc, at) {
  if (at === '(root)') return doc;
  let o = doc;
  for (const seg of at.split('.')) {
    if (!o || typeof o !== 'object') return null;
    o = o[/^\d+$/.test(seg) ? Number(seg) : seg];
  }
  return o && typeof o === 'object' ? o : null;
}

/* 1e-4 (~11 m), as drop-shared-positions: twins may round differently. */
const samePoint = (o, lat, lng) => !!o && Number.isFinite(Number(o.lat))
  && Math.abs(Number(o.lat) - lat) < 1e-4 && Math.abs(Number(o.lng) - lng) < 1e-4;

/* Stores are edited in memory and written once each, at the end. */
const stores = {};
function store(kind) {
  if (!stores[kind]) {
    const raw = fs.readFileSync(STORE_FILE[kind], 'utf8');
    stores[kind] = { raw, doc: JSON.parse(raw), changed: 0 };
  }
  return stores[kind];
}
const whyOf = (e) => `${e.action === 'move' ? 'pin moved' : 'pin deleted'} ${String(e.batch).slice(0, 10)} [${e.rule}]: ${e.evidence}`;

function fixStoreRow(kind, key, e, lat, lng) {
  const s = store(kind);
  const rec = s.doc[key];
  /* 371 hotel pins entered content with their reviews and never had a store row
     (2026-09-16 audit). Moving one on evidence creates the row, so the new point
     has provenance and the old one is kept under "was". */
  /* …but only while the review still exists. A page merged into another (or
     taken down) leaves its pin-fix entry behind as a historical record, and
     minting a row for it would key a coordinate to a page nobody can open. That
     is not hypothetical: on 2026-09-16 the entry for review-ibis-bangkok-sathorn
     (merged into review-ibis-bangkok-sathorn-bangkok) created the ONLY orphan
     row in 2,132 — while the keeper already carried the corrected point. */
  if (!rec && kind === 'reviews' && e.action === 'move'
      && !fs.existsSync(path.join(ROOT, 'astro/src/content/reviews', `${key}.json`))) return false;
  if (!rec && kind === 'reviews' && e.action === 'move') {
    const [tlat, tlng] = pair(e.to);
    s.doc[key] = {
      lat: tlat, lng: tlng, ...(e.prov ? { prov: e.prov } : {}), via: e.via || null, precision: 'poi',
      ...(e.osm ? { osm: e.osm } : {}), ...(e.osmName ? { osmName: e.osmName } : {}),
      was: { lat, lng, via: null }, why: whyOf(e),
    };
    s.changed++;
    return true;
  }
  if (!samePoint(rec, lat, lng)) return false;
  /* A move whose store row is ALREADY on the target must not be rewritten. The
     rewrite below fills `was` from the current row, so re-applying an applied
     move replaces the original position with the moved one and the provenance
     is gone for good. review-old-city-wall-inn-chiang-mai lost its original
     `was` exactly that way, and then reported "2 pin(s) would change" on every
     dry run afterwards — noise that sent a later session hunting a change that
     did not exist. */
  if (e.action === 'move') { const [tl, tg] = pair(e.to); if (samePoint(rec, tl, tg)) return false; }
  if (e.action === 'move') {
    const [tlat, tlng] = pair(e.to);
    s.doc[key] = {
      ...rec, lat: tlat, lng: tlng, precision: 'poi', via: e.via || rec.via,
      ...(e.osm ? { osm: e.osm } : {}),
      was: { lat: rec.lat, lng: rec.lng, via: rec.via || null }, why: whyOf(e),
    };
  } else if (kind === 'reviews' && e.demote) {
    s.doc[key] = { ...rec, precision: e.demote, why: whyOf(e) };
  } else {
    s.doc[key] = { why: whyOf(e), q: rec.q || null, ...(rec.osm ? { osm: rec.osm } : {}) };
  }
  s.changed++;
  return true;
}

console.log(`${entries.length} pin fix(es) listed${BATCH ? ` in batch ${BATCH}` : ''}\n`);
const per = {};
const bump = (k) => { per[k] = (per[k] || 0) + 1; };
let changed = 0;
for (const e of entries) {
  const [plat, plng] = pair(e.pos);
  let hits = 0;
  const notes = [];

  if (e.kind === 'place-coords') {
    if (fixStoreRow('place-coords', `https://thailandaddict.com/${e.slug}`, e, plat, plng)) { hits++; bump('place-coords.json'); }
  } else {
    for (const suffix of LOC) {
      const f = path.join(ROOT, `astro/src/content/${e.kind}${suffix}`, e.slug + '.json');
      if (!fs.existsSync(f)) continue;
      const raw = fs.readFileSync(f, 'utf8');
      let doc; try { doc = JSON.parse(raw); } catch { continue; }
      const pt = pointAt(doc, e.at);
      if (!samePoint(pt, plat, plng)) continue;
      if (e.action === 'move') { const [tlat, tlng] = pair(e.to); pt.lat = tlat; pt.lng = tlng; }
      else { delete pt.lat; delete pt.lng; }
      if (APPLY) fs.writeFileSync(f, serializeLike(raw, doc).text);
      bump(e.kind + suffix);
      hits++;
    }
    if (e.kind === 'reviews' && e.at === '(root)' && fixStoreRow('reviews', e.slug, e, plat, plng)) {
      notes.push(e.action === 'move' ? 'store row moved' : e.demote ? `store row → precision ${e.demote}` : 'store row → miss record');
      bump('hotel-coords.json');
    }
  }
  changed += hits;
  const label = e.action === 'move' ? `→ ${e.to}` : '−';
  console.log(`  ${hits ? label : '·'} ${e.kind}/${e.slug} @ ${e.at}  [${e.rule}]  "${String(e.name || '').replace(/<[^>]+>/g, '').slice(0, 40)}"${hits ? `  ${hits} file(s)` : '  — nothing carries this point any more'}${notes.length ? ' · ' + notes.join(' · ') : ''}`);
}

for (const [kind, s] of Object.entries(stores)) {
  if (s.changed && APPLY) fs.writeFileSync(STORE_FILE[kind], serializeLike(s.raw, s.doc).text);
}

console.log(`\n${changed} pin(s) ${APPLY ? 'changed' : 'would change'}:`);
for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(18)} ${v}`);
if (!APPLY) console.log('\nDRY RUN — nothing written. Re-run with --apply.');
else console.log('\nNow: node _internal/gen-feeds.mjs && node _internal/gen-hubs.mjs && node _internal/qa/check-coords.mjs');
