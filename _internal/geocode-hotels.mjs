#!/usr/bin/env node
/* =============================================================================
   geocode-hotels.mjs — fill in the missing hotel coordinates
   Blueprint "Geo backfill = the planner's bottleneck", which names this exact
   artefact: a sidecar `_internal/hotel-coords.json` keyed by review slug.

   WHY THIS EXISTS
   ---------------
   377 of 2,401 hotel reviews carry lat/lng (15.7%). Every map the redesign
   promises — the province map, the roundup map, the planner board, near-me —
   is gated on that number, and the blueprint sets the bar itself: a cluster's
   map renders only when ≥60% of its POIs are geocoded, because "a map with 40%
   missing pins is worse than no map".

   Every one of the 2,024 without coordinates has streetAddress,
   addressLocality, mapAddr, name and cluster — 100%, measured. So this is a
   lookup job, not a data-entry job.

   SOURCE
   ------
   Nominatim, which is already how this project geocoded its 288 attractions:
   _internal/place-coords.json rows carry `"via":"nominatim"` and the `q` they
   were found with. Same method, same shape, so the two files stay comparable.

   Rate limit is 1 request/second, hard, with a real User-Agent — that is
   Nominatim's usage policy and this script does not offer a way to go faster.
   2,024 lookups is therefore a ~35 minute run. It is resumable: every accepted
   AND rejected result is written to the sidecar as it arrives, so an
   interruption costs one request, and a re-run asks only for what is missing.

   A WRONG PIN IS WORSE THAN NO PIN
   --------------------------------
   That is the whole reason this is not a ten-line fetch loop. Nominatim will
   happily return the centre of a province for an address it cannot resolve, or
   a same-named road in the wrong country. Both would put a hotel pin somewhere
   a reader can see is wrong, on a page whose entire claim is that the
   information is real. So every result is checked and can be REJECTED:

     1. inside Thailand's bounding box
     2. within MAX_KM of the province centroid the review's own cluster implies
     3. not suspiciously equal to that centroid (Nominatim's "I found the
        province, not the address" answer)

   Rejections are recorded with their reason rather than dropped, so the next
   pass can see what failed and why, and so the accept rate is a number rather
   than an impression.

   Usage:
     node _internal/geocode-hotels.mjs              # the whole backlog
     node _internal/geocode-hotels.mjs --limit 50   # a sample first
     node _internal/geocode-hotels.mjs --report     # no network; just the tally
     node _internal/geocode-hotels.mjs --apply      # write accepted coords into
                                                    # the review JSONs
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REVIEWS = path.join(ROOT, 'astro/src/content/reviews');
const SIDECAR = path.join(ROOT, '_internal/hotel-coords.json');
const PROV_COORDS = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/province-coords.json'), 'utf8'));

const argv = process.argv.slice(2);
const REPORT_ONLY = argv.includes('--report');
const APPLY = argv.includes('--apply');
const LIMIT = (() => { const i = argv.indexOf('--limit'); return i >= 0 ? Number(argv[i + 1]) : Infinity; })();

/* Sub-destinations that are not provinces. Twelve of them cover all 335 reviews
   whose cluster has no centroid — measured, not guessed. Without this, those
   reviews would have to be accepted unvalidated, which is the one thing this
   script exists to avoid. */
const CLUSTER_PROVINCE = {
  pattaya: 'chonburi', 'koh-larn': 'chonburi',
  huahin: 'prachuap-khiri-khan',
  'koh-chang': 'trat', 'koh-kood': 'trat', 'koh-mak': 'trat',
  'khao-yai': 'nakhon-ratchasima',
  samui: 'surat-thani', 'koh-phangan': 'surat-thani',
  pai: 'mae-hong-son',
  'koh-lipe': 'satun',
  'hat-yai': 'songkhla',
};

/* Thailand, generously. Betong in the south is 5.6°N; Mae Sai in the north is
   20.46°N; the western border runs to 97.34°E and the eastern to 105.64°E. */
const TH_BBOX = { minLat: 5.5, maxLat: 20.6, minLng: 97.2, maxLng: 105.8 };
/* A Thai province is large — Chiang Mai spans ~200 km — so this is a
   "not in the wrong province" test, not a precision test. */
const MAX_KM = 130;
/* Nominatim returning the province centroid to within a few hundred metres
   means it matched the province, not the hotel. */
const CENTROID_MIN_KM = 0.6;

const R = 6371;
const rad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const readJson = (f, dflt) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return dflt; } };

/* ── the backlog ────────────────────────────────────────────────────────── */
function backlog() {
  const out = [];
  for (const f of fs.readdirSync(REVIEWS).filter((x) => x.endsWith('.json'))) {
    const j = readJson(path.join(REVIEWS, f), null);
    if (!j) continue;
    const slug = f.replace(/\.json$/, '');
    if (j.lat && j.lng) continue;
    const prov = CLUSTER_PROVINCE[j.cluster] || j.cluster;
    out.push({
      slug, name: j.name, cluster: j.cluster, prov,
      centroid: PROV_COORDS[prov] || null,
      street: j.streetAddress || '', locality: j.addressLocality || '',
    });
  }
  return out;
}

/* Strip a Thai street address down to the road. Nominatim has the roads but
   almost never the house numbers, so "88 ถนนกันตัง ต.ทับเที่ยง อ.เมืองตรัง"
   finds nothing while "ถนนกันตัง" finds the right road in the right district.
   Measured on the first sample: this recovered 3 of 4 outright failures. */
function road(s) {
  let t = String(s || '').replace(/^[\d/\-\s]+/, '');                        // house number
  t = t.split(/,| ต\.| ตำบล| อ\.| อำเภอ| แขวง| เขต|\(/)[0].trim();          // keep the road
  return t;
}

/* Three queries per hotel, in descending precision. Each is scoped to the
   province, so a same-named place elsewhere cannot win.
     1. the hotel by name  → a POI pin, the hotel itself
     2. the full address   → occasionally hits a numbered building
     3. the road only      → a ROAD pin: right road, right district, not the
                             hotel's doorstep. Recorded as precision:'road' so
                             nothing downstream mistakes it for a survey point. */
function queriesFor(r) {
  const prov = r.locality || r.prov;
  const qs = [];
  if (r.name) qs.push({ q: `${r.name}, ${prov}, Thailand`, precision: 'poi' });
  if (r.street) qs.push({ q: `${r.street}, ${prov}, Thailand`, precision: 'poi' });
  const rd = road(r.street);
  if (rd && rd.length > 4) qs.push({ q: `${rd}, ${prov}, Thailand`, precision: 'road' });
  return qs;
}

function validate(r, hit) {
  const p = { lat: Number(hit.lat), lng: Number(hit.lon) };
  if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return { ok: false, why: 'non-numeric' };
  if (p.lat < TH_BBOX.minLat || p.lat > TH_BBOX.maxLat || p.lng < TH_BBOX.minLng || p.lng > TH_BBOX.maxLng)
    return { ok: false, why: 'outside Thailand' };
  if (!r.centroid) return { ok: false, why: `no centroid for cluster ${r.cluster}` };
  const d = km(p, r.centroid);
  if (d > MAX_KM) return { ok: false, why: `${Math.round(d)} km from ${r.prov}` };
  if (d < CENTROID_MIN_KM) return { ok: false, why: 'equals the province centroid' };
  return { ok: true, lat: p.lat, lng: p.lng, distKm: Math.round(d * 10) / 10 };
}

/* ── report ─────────────────────────────────────────────────────────────── */
const store = readJson(SIDECAR, {});
const todo = backlog().filter((r) => !store[r.slug]);

function tally() {
  const rows = Object.values(store);
  const ok = rows.filter((r) => r.lat && r.lng).length;
  const bad = rows.length - ok;
  const poi = rows.filter((r) => r.lat && r.precision === 'poi').length;
  const rd = rows.filter((r) => r.lat && r.precision === 'road').length;
  const reasons = {};
  for (const r of rows) if (!r.lat) reasons[r.why || '?'] = (reasons[r.why || '?'] || 0) + 1;
  const inline = backlog().length;
  console.log(`sidecar   ${rows.length} looked up · ${ok} accepted (${poi} on the building, ${rd} on the road) · ${bad} rejected`);
  console.log(`backlog   ${inline} reviews still without coordinates · ${todo.length} not yet looked up`);
  if (bad) { console.log('rejected, by reason:'); for (const [k, v] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`); }
}

if (REPORT_ONLY) { tally(); process.exit(0); }

/* ── apply: accepted coords into the review JSONs ───────────────────────── */
if (APPLY) {
  /* Every locale, not just TH. A hotel's position does not change by language,
     and the layouts read each locale's own JSON — so /en/review-x would have
     shown no map while /review-x did. Same slug, same two numbers. */
  const DIRS = ['reviews', 'reviews-en', 'reviews-zh', 'reviews-ru', 'reviews-ko',
    'reviews-ja', 'reviews-hi', 'reviews-he', 'reviews-ar']
    .map((d) => path.join(ROOT, 'astro/src/content', d))
    .filter((d) => fs.existsSync(d));

  let poi = 0, rd = 0;
  const per = {};
  for (const [slug, rec] of Object.entries(store)) {
    if (!(rec.lat && rec.lng)) continue;
    let touched = false;
    for (const dir of DIRS) {
      const f = path.join(dir, slug + '.json');
      if (!fs.existsSync(f)) continue;
      const raw = fs.readFileSync(f, 'utf8');
      let j; try { j = JSON.parse(raw); } catch { continue; }
      if (j.lat && j.lng) continue;
      j.lat = rec.lat; j.lng = rec.lng;
      /* 2-space indent and the file's own trailing-newline convention, so the
         diff is the two added lines and nothing else. These are authored
         content files; a reformat would bury the change in 600 lines of noise. */
      fs.writeFileSync(f, JSON.stringify(j, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
      const k = path.basename(dir);
      per[k] = (per[k] || 0) + 1;
      touched = true;
    }
    if (touched) { if (rec.precision === 'road') rd++; else poi++; }
  }
  const total = Object.values(per).reduce((a, b) => a + b, 0);
  console.log(`applied ${total} coordinate pair(s) across ${Object.keys(per).length} collection(s)`);
  for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(12)} ${v}`);
  console.log(`\n${poi} hotels pinned on the building · ${rd} on the road (right road and district, not the doorstep)`);
  console.log('Re-run gen-feeds + gen-near-me to fold these into feeds/hotels.json and near-me-index.json.');
  process.exit(0);
}

/* ── the run ────────────────────────────────────────────────────────────── */
const UA = 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; one-off hotel backfill)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastCall = 0;

async function nominatim(q) {
  const wait = 1100 - (Date.now() - lastCall);   /* 1 req/s, with headroom */
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
  const u = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=th&q=' + encodeURIComponent(q);
  const res = await fetch(u, { headers: { 'User-Agent': UA, 'Accept-Language': 'th,en' } });
  if (res.status === 429 || res.status === 503) throw Object.assign(new Error('rate limited'), { retry: true });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = await res.json();
  return Array.isArray(j) && j.length ? j[0] : null;
}

const work = todo.slice(0, LIMIT);
console.log(`geocode-hotels: ${work.length} of ${todo.length} to look up (1 req/s — about ${Math.ceil(work.length * 1.1 / 60)} min)\n`);

let ok = 0, rej = 0, i = 0;
for (const r of work) {
  i++;
  let rec = null;
  for (const { q, precision } of queriesFor(r)) {
    let hit;
    try { hit = await nominatim(q); }
    catch (e) {
      if (e.retry) { console.log('  rate limited — pausing 60s'); await sleep(60_000); try { hit = await nominatim(q); } catch { hit = null; } }
      else { rec = { why: 'error: ' + e.message, q }; break; }
    }
    if (!hit) { rec = { why: 'no match', q }; continue; }
    const v = validate(r, hit);
    if (v.ok) { rec = { lat: v.lat, lng: v.lng, prov: r.prov, via: 'nominatim', precision, q, distKm: v.distKm }; break; }
    rec = { why: v.why, q };
  }
  store[r.slug] = rec || { why: 'no query' };
  if (store[r.slug].lat) ok++; else rej++;
  /* Written every time, not at the end: a 35-minute run must never lose its
     work to one interruption. */
  fs.writeFileSync(SIDECAR, JSON.stringify(store, null, 1) + '\n');
  if (i % 25 === 0 || i === work.length)
    console.log(`  ${String(i).padStart(5)}/${work.length}  accepted ${ok}  rejected ${rej}   ${r.slug.slice(0, 46)}`);
}

console.log('');
tally();
console.log('\nNothing has been written into the review JSONs yet. Review the sidecar, then:');
console.log('  node _internal/geocode-hotels.mjs --apply');
