#!/usr/bin/env node
/* =============================================================================
   audit-transit-claims.mjs — is "เดิน 5 นาทีถึง BTS อโศก" true?

   WHY
   ---
   3,511 roundup entries carry an `mrtTag`, and a large share of them make a
   checkable claim: a named BTS/MRT/ARL station and a walking time. Those are
   the most load-bearing sentences on the page — a reader picks a hotel because
   it is 5 minutes from the train — and they were written by hand, one at a
   time, from the hotel's own marketing copy.

   The failure mode is known and documented elsewhere: match the wrong station
   and the claim is wrong by an order of magnitude in whichever direction the
   error happens to fall. Overstating convenience ("5 minutes" when it is 15) is
   the one that costs the reader a booking they would not have made. That is
   what this sorts to the top.

   HOW
   ---
   Station positions come from OSM (ODbL, so storable), fetched once into
   _internal/transit-stations.json. Distance is straight-line, and the minutes
   are read against the industry convention of 80 m/minute — which is itself an
   approximation, not a measurement: it ignores that you cannot walk through a
   building. So a claim is only flagged when it is wrong by a factor, never by a
   minute or two, and the report says "check this", not "this is false".

   This is a REPORT, not a gate. The text is authored prose in nine languages;
   a build that fails on it would fail on a copy-edit. Fix what it finds, then
   re-run.

   Usage:  node _internal/qa/audit-transit-claims.mjs [--refresh] [--list]
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const STATIONS = path.join(ROOT, '_internal/transit-stations.json');
const REFRESH = process.argv.includes('--refresh');
const SHOW_ALL = process.argv.includes('--list');

const UA = 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; transit claim audit)';
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };

const R = 6371, rad = (d) => (d * Math.PI) / 180;
function metres(a, b) {
  const dLa = rad(b.lat - a.lat), dLo = rad(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * 1000;
}
/* The Japanese real-estate convention, used worldwide: 80 m per minute, always
   at least one minute. Straight-line, so it flatters every claim equally. */
const minutesFor = (m) => Math.max(1, Math.round(m / 80));

/* ── stations ───────────────────────────────────────────────────────────── */
async function fetchStations() {
  /* Greater Bangkok plus the BTS extensions into Samut Prakan and Nonthaburi. */
  const bbox = '13.45,100.25,14.20,100.95';
  const ql = `[out:json][timeout:90];
nwr["railway"~"^(station|halt)$"](${bbox});
out center tags;
nwr["public_transport"="station"]["train"="yes"](${bbox});
out center tags;`;
  /* Same mirror _internal/geocode-poi-overpass.mjs settled on, and for the same
      measured reason: overpass-api.de, kumi.systems and private.coffee all
      refuse TCP connections from this machine, and osm.ch is Switzerland only.
      See the ENDPOINTS note in that file before changing this. */
  const res = await fetch('https://maps.mail.ru/osm/tools/overpass/api/interpreter', {
    method: 'POST',
    headers: { 'User-Agent': UA, 'Content-Type': 'text/plain' },
    body: ql,
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
  const j = await res.json();
  const out = [];
  for (const el of j.elements || []) {
    const lat = el.lat ?? el.center?.lat, lng = el.lon ?? el.center?.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const t = el.tags || {};
    const names = [t.name, t['name:th'], t['name:en'], t.alt_name].filter(Boolean);
    if (!names.length) continue;
    out.push({ lat, lng, names, id: `${el.type}/${el.id}`, network: t.network || t.operator || '' });
  }
  return out;
}

let stations = readJson(STATIONS, null);
if (!stations || REFRESH) {
  console.log('fetching Bangkok rail stations from OSM …');
  stations = await fetchStations();
  fs.writeFileSync(STATIONS, JSON.stringify(stations, null, 2) + '\n');
  console.log(`wrote ${stations.length} station(s) to _internal/transit-stations.json`);
}

/* Station names in our prose are Thai and bare ("BTS อารีย์"); OSM has
   "อารีย์", "Ari", "สถานีอารีย์", "BTS Ari". Strip the decoration from both
   sides and compare what is left. */
const bare = (s) => String(s || '')
  .replace(/สถานี|รถไฟฟ้า|BTS|MRT|ARL|SRT|Airport Rail Link|Station/gi, '')
  .replace(/[^฀-๿a-zA-Z0-9]+/g, '')
  .toLowerCase();

const index = new Map();
for (const st of stations) for (const n of st.names) {
  const k = bare(n);
  if (!k || k.length < 2) continue;
  if (!index.has(k)) index.set(k, []);
  index.get(k).push(st);
}

/* ── the claims ─────────────────────────────────────────────────────────── */
const RC = readJson(path.join(ROOT, 'astro/src/data/review-coords.json'), {});
const wishSlug = (u) => String(u || '').replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+/, '').replace(/\.html$/, '').split('?')[0];

/* "เดิน 7 นาทีถึง BTS ห้าแยกลาดพร้าว" · "MRT สีลม" · "~200 ม." */
const CLAIM = /(?:เดิน\s*)?(\d+)\s*นาที(?:ถึง|จาก)?\s*(BTS|MRT|ARL|SRT|รถไฟฟ้า)?\s*([฀-๿][฀-๿\s]{1,24})/g;
const NEAR = /(?:BTS|MRT|ARL)\s+([฀-๿][฀-๿\s]{1,24}?)(?:\s+\d+\s*ม\.|\s*·|$)/g;

const rows = [];
let claims = 0, unknownStation = 0, noCoord = 0;
const dir = path.join(ROOT, 'astro/src/content/roundups');
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue;
  const j = readJson(path.join(dir, f), null);
  if (!j) continue;
  for (const e of j.entries || []) {
    const tag = String(e.mrtTag || '');
    if (!/BTS|MRT|ARL/.test(tag)) continue;
    const slug = wishSlug(e.reviewUrl);
    const c = RC[slug];
    for (const m of tag.matchAll(CLAIM)) {
      const mins = Number(m[1]);
      const name = m[3].trim();
      const k = bare(name);
      claims++;
      const hits = index.get(k) || [];
      if (!hits.length) { unknownStation++; rows.push({ kind: 'unknown-station', f: f.replace('.json', ''), name: e.name, tag, detail: `no OSM station named "${name}"` }); continue; }
      if (!c) { noCoord++; continue; }
      const at = { lat: c[0], lng: c[1] };
      const best = hits.reduce((a, b) => (metres(at, a) <= metres(at, b) ? a : b));
      const d = metres(at, best);
      const should = minutesFor(d);
      /* Only factors, never minutes. Overstated first: that is the claim that
         costs the reader something. */
      if (mins * 2 < should) {
        rows.push({ kind: 'overstated', f: f.replace('.json', ''), name: e.name, tag,
          detail: `claims ${mins} min to ${name}; it is ${Math.round(d)} m away ≈ ${should} min (${(should / mins).toFixed(1)}× )` });
      } else if (should * 2 < mins) {
        rows.push({ kind: 'conservative', f: f.replace('.json', ''), name: e.name, tag,
          detail: `claims ${mins} min to ${name}; it is only ${Math.round(d)} m away ≈ ${should} min` });
      }
    }
  }
}

/* ── report ─────────────────────────────────────────────────────────────── */
const by = rows.reduce((m, r) => ((m[r.kind] = (m[r.kind] || 0) + 1), m), {});
console.log('');
console.log(`${claims} checkable walking-time claim(s) · ${stations.length} OSM stations · ${noCoord} skipped (hotel has no coordinate)`);
console.log(Object.entries(by).map(([k, n]) => `${k} ${n}`).join(' · ') || 'nothing to flag');
console.log('');
const order = ['overstated', 'unknown-station', 'conservative'];
for (const kind of order) {
  const list = rows.filter((r) => r.kind === kind);
  if (!list.length) continue;
  console.log(`── ${kind} (${list.length}) ──`);
  for (const r of (SHOW_ALL ? list : list.slice(0, 12))) {
    console.log(`  ${r.f}  ·  ${r.name}`);
    console.log(`      ${r.detail}`);
  }
  if (!SHOW_ALL && list.length > 12) console.log(`  … ${list.length - 12} more (--list)`);
  console.log('');
}
console.log('Straight-line distances. A claim within a factor of 2 is not flagged —');
console.log('80 m/min is a convention, and you cannot walk through a building.');
