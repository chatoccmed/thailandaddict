/* Turn validated Agoda feed coordinates into hotel pins.

   The feed is the owner's own Agoda partner content feed: 2.84M rows global,
   65,524 of them in Thailand, every one carrying a coordinate. It matters
   because 1,074 of our reviews had been asked of OSM and genuinely not found —
   OSM has no element for them — so no amount of re-geocoding would ever have
   pinned them.

   It is NOT imported on trust. Measured on 2026-09-17 against the 584 hotels
   where we already hold an OSM-verified pin AND the feed lists the same
   property (same name, same house number):

       median 46 m · 75th 141 m · 90th 591 m · 95th 1,179 m · worst 18.9 km
       within 50 m 52% · within 150 m 76% · within 500 m 88% · beyond 2 km 13

   So half are excellent and about one in eight is more than 500 m out. Pinning
   all of them would plant roughly 75 wrong pins, and this project's first rule
   is that a wrong pin is worse than no pin: a missing map says "we don't know",
   a wrong pin says "we know, and we are wrong", and the reader cannot tell
   which pins to distrust. The owner's decision on 2026-09-17 was therefore to
   validate every point before it ships.

   The validation is street-evidence-hotels.mjs run over the candidate
   coordinates: these hotels are absent from OSM, but THE ROADS THEY SIT ON ARE,
   and so are the admin boundaries. Tiers, strongest first:

     road      a highway carrying the address's own road runs within 120 m of
               the candidate — the same bar an existing pin must clear
     area      the candidate falls inside BOTH the sub-district and the district
               the address names
     district  district only. Rules out gross error (wrong province, kilometres
               off) but NOT the 500 m class, so it is opt-in via --district.
               It is the ONLY test available for most rural rows: just 27 of 108
               piloted addresses had a sub-district polygon in OSM at all, so
               refusing this tier rejects hotels for being untestable rather
               than for being wrong.

   precision is written as 'poi' deliberately. It is honest — the coordinate is
   a per-hotel point, not a road midpoint — and it is also load-bearing:
   drop-road-pins.mjs deletes any row whose precision is 'road' or 'area', and
   it runs as a normal part of the pipeline, so recording these as "area-level"
   would have had the next pipeline run silently delete every one of them.
   via:'agoda' keeps them separable from OSM-verified pins forever after.

   Usage: node _internal/import-agoda-coords.mjs --evidence <file> --matched <file>
                [--district] [--apply]
   Then:  gen-feeds → gen-hubs → check-coords, exactly as the geocoders require. */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const APPLY = process.argv.includes('--apply');
const DISTRICT = process.argv.includes('--district');
const EV = arg('--evidence'), MA = arg('--matched');
if (!EV || !MA) { console.error('need --evidence <file> and --matched <file>'); process.exit(2); }

const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const ev = readJson(EV, []), matched = readJson(MA, []);
const feedOf = new Map(matched.filter((m) => m.feed).map((m) => [m.slug, m]));
const SIDECAR = path.join(ROOT, '_internal/hotel-coords.json');
const store = readJson(SIDECAR, {});
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];

function tierOf(r) {
  if (r.decision === 'DROP-CANDIDATE (road)') {
    return { tier: 'reject', why: 'the address road is ' + (r.found ? r.found.d + ' m' : 'far') + ' from the candidate' };
  }
  if (r.hitDist != null && r.hitDist <= 120) {
    return { tier: 'road', why: 'road "' + r.hitName + '" runs ' + r.hitDist + ' m from the candidate' };
  }
  if (r.inNamed8 && r.inNamed6) {
    return { tier: 'area', why: 'candidate lies in ' + [...r.L8, ...r.L6].join(' · ') + ', both named by the address' };
  }
  if (r.L8 && r.L8.length && !r.inNamed8 && !r.inNamed6) {
    return { tier: 'reject', why: 'candidate lies in ' + [...r.L8, ...r.L6].join(' · ') + ', which the address names at neither level' };
  }
  if (r.inNamed6) {
    return { tier: 'district', why: 'candidate lies in ' + r.L6.join(' · ') + ', named by the address; OSM has no sub-district polygon here to test against' };
  }
  if (r.hitDist != null) {
    return { tier: 'reject', why: 'nearest matching road "' + r.hitName + '" is ' + r.hitDist + ' m away' };
  }
  return { tier: 'reject', why: 'no admin polygon and no road — nothing was tested' };
}

const ALLOW = new Set(DISTRICT ? ['road', 'area', 'district'] : ['road', 'area']);
const counts = {};
const take = [];
let alreadyPinned = 0, gone = 0, noFeed = 0;

for (const r of ev) {
  const t = tierOf(r);
  counts[t.tier] = (counts[t.tier] || 0) + 1;
  const m = feedOf.get(r.slug);
  if (!m) { noFeed++; continue; }
  /* Never overwrite an existing pin: this fills genuine gaps only. A pin may
     have appeared between the validation run and now. */
  const cur = readJson(path.join(ROOT, 'astro/src/content/reviews', r.slug + '.json'), null);
  if (!cur) { gone++; continue; }
  if (cur.lat != null && cur.lng != null) { alreadyPinned++; continue; }
  if (ALLOW.has(t.tier)) take.push({ r, m, tier: t.tier, why: t.why });
}

console.log('evidence rows ' + ev.length + ' · tiers: ' + Object.keys(counts).map((k) => k + ' ' + counts[k]).join(' · '));
if (alreadyPinned) console.log('  skipped, already pinned: ' + alreadyPinned);
if (gone) console.log('  skipped, review file gone: ' + gone);
if (noFeed) console.log('  skipped, no feed row: ' + noFeed);
console.log('would write ' + take.length + ' pin(s) [allowed: ' + [...ALLOW].join(', ') + (DISTRICT ? '' : ' — pass --district to widen') + ']');

if (!APPLY) {
  for (const t of take.slice(0, 12)) {
    console.log('   ' + t.tier.padEnd(9) + t.r.slug.replace(/^review-/, '').slice(0, 42).padEnd(42) + ' ' + t.why.slice(0, 66));
  }
  console.log('\ndry run — nothing written. Re-run with --apply');
  process.exit(0);
}

let locFiles = 0;
for (const t of take) {
  const lat = Number(Number(t.m.feed.lat).toFixed(6));
  const lng = Number(Number(t.m.feed.lng).toFixed(6));
  store[t.r.slug] = {
    ...(store[t.r.slug] || {}),
    lat, lng,
    ...(t.r.cluster ? { prov: t.r.cluster } : {}),
    via: 'agoda',
    precision: 'poi',
    agodaId: t.m.feed.id,
    agodaName: t.m.feed.name,
    q: t.m.name + ' @ agoda:' + t.m.feed.id + ' (' + t.m.tier + ') — validated ' + t.tier + ': ' + t.why,
  };
  for (const suffix of LOC) {
    const f = path.join(ROOT, 'astro/src/content/reviews' + suffix, t.r.slug + '.json');
    if (!fs.existsSync(f)) continue;
    const j = readJson(f, null);
    if (!j) continue;
    j.lat = lat;
    j.lng = lng;
    fs.writeFileSync(f, serializeLike(fs.readFileSync(f, 'utf8'), j).text);
    locFiles++;
  }
}
fs.writeFileSync(SIDECAR, serializeLike(fs.readFileSync(SIDECAR, 'utf8'), store).text);
console.log('\napplied ' + take.length + ' pin(s) · ' + locFiles + ' locale file(s) · store updated');
console.log('Now run: node _internal/gen-feeds.mjs && node _internal/gen-hubs.mjs && node _internal/qa/check-coords.mjs');
