#!/usr/bin/env node
/* =============================================================================
   geocode-overpass.mjs — upgrade road-level pins to the actual building

   WHAT THIS IS FOR
   ----------------
   _internal/geocode-hotels.mjs asks Nominatim three questions per hotel, the
   last of which is "where is this road?". When only that one answers, it stores
   precision:'road' — honest bookkeeping, but it is the street's midpoint, and
   207 hotels ended up there. On a map that is a lie with a pin on it: five Hua
   Hin beachfront resorts stacked on one dot on Phetkasem Road, 500 m inland.
   _internal/qa/check-coords.mjs now refuses to ship those.

   Deleting them is correct but loses coverage. This script tries to EARN the
   coverage back instead, from the same ODbL database, asked a better question.

   WHY OVERPASS AND NOT MORE NOMINATIM
   -----------------------------------
   Nominatim searches the world and ranks. Overpass takes a bounding box and a
   tag filter and returns everything matching inside it — so instead of "find me
   a place called X" (which can answer with a prison in Nonthaburi) we ask
   "list every hotel within 9 km of this road", get 40 of them with their names,
   and do the matching HERE, where we can be strict about it and can see when
   two candidates are ambiguous.

   THE RULE THAT MATTERS
   ---------------------
   Nothing is accepted on proximity. A candidate is accepted only when its OSM
   name matches the hotel's name by token containment: every significant word of
   the shorter name must appear in the longer, and there must be at least two of
   them — or exactly one that no other building in the same area shares.
   "Significant" excludes hotel words (resort, spa, suites) and place names
   (sukhumvit, patong, hua hin, mae phim), which name a neighbourhood, not a
   hotel. The hotel's marketing h1 is never matched against, only its name: an
   h1 says what is NEARBY, which is the opposite of identifying.
   Proximity is then used only to REJECT — within MATCH_KM of the road we
   already trust, inside Thailand, right province, not a centroid. Two
   candidates more than 150 m apart are ambiguous and both are refused.

   Everything written carries via:'overpass' and the OSM element id, so any pin
   can be re-checked by a human against osm.org later.

   Usage:
     node _internal/geocode-overpass.mjs --report      probe, write nothing
     node _internal/geocode-overpass.mjs --apply       write store + content
     [--limit N]     only the first N clusters (for a quick look)
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REVIEWS = path.join(ROOT, 'astro/src/content/reviews');
const SIDECAR = path.join(ROOT, '_internal/hotel-coords.json');
const PROV_FILE = path.join(ROOT, '_internal/province-coords.json');

const APPLY = process.argv.includes('--apply');
const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i > 0 ? Number(process.argv[i + 1]) || 0 : 0; })();

const UA = 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; hotel coordinate upgrade)';
const ENDPOINT = 'https://overpass-api.de/api/interpreter';
const PAUSE_MS = 2000;          /* Overpass asks for restraint; ~70 queries total */
const PAD_DEG = 0.08;           /* ~9 km around the known-good road points */
const MATCH_KM = 10;            /* a road pin is right about the district, so the
                                   real building is a few km away at most. The one
                                   bad match of the first run moved 5.7 km. */
const AMBIGUOUS_M = 150;        /* two matches further apart than this = refuse both */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };

const R = 6371, rad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const dLa = rad(b.lat - a.lat), dLo = rad(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const PROV = readJson(PROV_FILE, {});
const CLUSTER_PROVINCE = {
  pattaya: 'chonburi', 'koh-larn': 'chonburi', samui: 'surat-thani',
  'koh-phangan': 'surat-thani', 'koh-tao': 'surat-thani', 'khao-sok': 'surat-thani',
  'koh-chang': 'trat', 'koh-kood': 'trat', 'koh-mak': 'trat',
  'koh-lipe': 'satun', 'hat-yai': 'songkhla', pai: 'mae-hong-son',
  'khao-yai': 'nakhon-ratchasima', huahin: 'prachuap-khiri-khan',
  railay: 'krabi', 'koh-lanta': 'krabi', 'koh-phi-phi': 'krabi',
  'koh-yao': 'phang-nga', 'khao-lak': 'phang-nga',
};

/* ── name matching ──────────────────────────────────────────────────────── */
/* Words that carry no identity. "Hotel Bangkok" must not match "Hotel Bangkok"
   on the strength of those two words alone, and our slugs append the cluster
   name to nearly everything, so cluster words are stripped too. */
const NOISE = new Set([
  'hotel', 'hotels', 'resort', 'resorts', 'spa', 'boutique', 'guesthouse', 'guest',
  'house', 'hostel', 'inn', 'lodge', 'villa', 'villas', 'suites', 'suite', 'residence',
  'residences', 'apartment', 'apartments', 'the', 'and', 'by', 'at', 'de', 'a', 'an',
  'thailand', 'thai', 'place', 'home', 'homestay', 'rooms', 'room', 'view', 'beach',
  'โรงแรม', 'รีสอร์ท', 'รีสอร์ต', 'เกสต์เฮ้าส์', 'โฮมสเตย์', 'ที่พัก',
]);

/* Place names are long, look distinctive, and identify nothing. The first run
   of this script accepted exactly one match — "Chateau de Sukhumvit" ≈ OSM
   "Sukhumvit Suites" — on the strength of the word "sukhumvit", which is a
   road that 2,751 Bangkok hotels sit on. Without this list, "Hua Hin Marriott"
   and "Hua Hin Grand" also match, on two words. */
const PLACE_NOISE = new Set([
  'bangkok', 'krungthep', 'sukhumvit', 'silom', 'sathorn', 'siam', 'ratchada',
  'phrom', 'phong', 'asok', 'nana', 'thonglor', 'ekkamai', 'ari', 'phayathai',
  'ratchathewi', 'pratunam', 'khaosan', 'rattanakosin', 'sathon', 'riverside',
  'chiang', 'mai', 'rai', 'nimman', 'nimmanhaemin', 'thapae', 'ping', 'santitham',
  'phuket', 'patong', 'kata', 'karon', 'kamala', 'bangtao', 'rawai', 'chalong',
  'krabi', 'aonang', 'nang', 'railay', 'lanta', 'phi', 'noppharat',
  'samui', 'chaweng', 'lamai', 'bophut', 'maenam', 'phangan', 'rin', 'tao', 'sairee',
  'pattaya', 'jomtien', 'naklua', 'wongamat', 'larn', 'chonburi', 'bangsaen',
  'hua', 'hin', 'huahin', 'cha', 'am', 'chaam', 'khaotakiab', 'prachuap',
  'koh', 'ko', 'ao', 'hat', 'laem', 'nai', 'mueang', 'muang', 'amphoe', 'tambon',
  'ayutthaya', 'sukhothai', 'kanchanaburi', 'pai', 'khaoyai', 'khao', 'yai',
  'isan', 'esan', 'udon', 'thani', 'khon', 'kaen', 'korat', 'nakhon', 'ratchasima',
  'songkhla', 'hatyai', 'trang', 'satun', 'lipe', 'ranong', 'chumphon', 'surat',
  'north', 'south', 'east', 'west', 'central', 'city', 'town', 'old', 'new',
  'grand', 'royal', 'gardens', 'garden', 'park', 'plaza', 'centre', 'center',
  'international', 'airport', 'station', 'market', 'night', 'river', 'lake', 'sea',
  'thai', 'siamese',
  /* Added after review of the first accepted batch: "AG Property Mae Phim"
     matched OSM "Mae Phim" — the beach, not the building — and "Pawnprathan
     Baan Rim Khong" matched "Baan Rim Khong Hotel", where every matched word
     means "house by the Mekong". Thai descriptive geography identifies a view,
     not an address. */
  'mae', 'phim', 'baan', 'ban', 'rim', 'khong', 'nam', 'doi', 'phu', 'wang',
  'walking', 'street', 'road', 'soi', 'le', 'la', 'el', 'du', 'des',
]);

function tokens(s, extraNoise) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   /* Méridien → Meridien: without this,
                                                           "méridien" split into "m" + "ridien" */
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, ' ')
    .split(' ')
    .filter((w) => w.length > 1 && !NOISE.has(w) && !PLACE_NOISE.has(w) && !(extraNoise && extraNoise.has(w)));
}

/* Token containment, deliberately asymmetric-friendly: OSM often has the short
   name ("Ping Nakara") where we have the long one ("Ping Nakara Boutique Hotel
   and Spa"), and the reverse also happens. Match on the SHORTER token set
   being wholly inside the longer. */
function nameMatch(a, b, extraNoise, rarity) {
  const A = tokens(a, extraNoise), B = tokens(b, extraNoise);
  if (!A.length || !B.length) return null;
  const [short, long] = A.length <= B.length ? [A, B] : [B, A];
  const set = new Set(long);
  const hit = short.filter((w) => set.has(w));
  if (hit.length !== short.length) return null;                 /* every word must be there */
  if (hit.length >= 2) return { how: `${hit.length} words: ${hit.join(' ')}` };
  /* TWO WORDS, NO EXCEPTIONS. Two attempts were made to let a single word
     through and both produced wrong pins:
       · "six characters or more" accepted Chateau de Sukhumvit ≈ Sukhumvit
         Suites — sukhumvit is a road.
       · "unique among the hotels in this box" accepted Chateau de Sukhumvit ≈
         Chateau de Bangkok, Hotel De Nara ≈ Nara Place, and Yellow Pillow
         Village ≈ La Pillow. Being the only "chateau" in the box does not make
         two different chateaux the same building; uniqueness in OSM is a fact
         about OSM's coverage, not about identity.
     `rarity` is still computed and passed, because knowing how common a word
     is in an area is useful when reading refusals — but it may not decide an
     acceptance. Recall is the cheap thing to lose here. */
  return null;
}

/* ── what needs upgrading ───────────────────────────────────────────────── */
const store = readJson(SIDECAR, {});

/* Positions shared by two or more DIFFERENT hotels are area/road fallbacks even
   when Nominatim called them 'poi' — two buildings cannot share a rooftop. */
const byPos = new Map();
for (const [slug, v] of Object.entries(store)) {
  if (!v || !Number.isFinite(v.lat)) continue;
  const k = `${v.lat.toFixed(5)},${v.lng.toFixed(5)}`;
  if (!byPos.has(k)) byPos.set(k, []);
  byPos.get(k).push(slug);
}
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9฀-๿]+/g, '');
const shared = new Set();
for (const [, slugs] of byPos) {
  if (slugs.length < 2) continue;
  const names = new Set(slugs.map((s) => norm(readJson(path.join(REVIEWS, s + '.json'), {}).name)));
  if (names.size < 2) continue;                     /* one hotel, several slugs — fine */
  for (const s of slugs) shared.add(s);
}

const todo = [];
for (const [slug, v] of Object.entries(store)) {
  if (!v || !Number.isFinite(v.lat)) continue;
  const needs = v.precision === 'road' || shared.has(slug);
  if (!needs) continue;
  const j = readJson(path.join(REVIEWS, slug + '.json'), null);
  if (!j || !j.name) continue;
  const cluster = j.cluster || v.prov;
  /* `name` ONLY — never `h1`. h1 is a marketing headline, and matching against
     it produced this script's three worst false positives in one run:
     "Ananya Lipe Resort" matched OSM "Walking Street Hostel" because the h1
     says "เดินไม่กี่ก้าวก็ถึง Walking Street". A headline describes what is
     nearby; that is the opposite of what identifies a building. */
  todo.push({
    slug, name: j.name, nameTh: typeof j.nameTh === 'string' ? j.nameTh : '', cluster,
    prov: PROV[cluster] ? cluster : CLUSTER_PROVINCE[cluster] || cluster,
    at: { lat: v.lat, lng: v.lng }, why: v.precision === 'road' ? 'road' : 'shared',
  });
}

/* One Overpass call per cluster, boxed around that cluster's own road points. */
const groups = new Map();
for (const r of todo) {
  if (!groups.has(r.cluster)) groups.set(r.cluster, []);
  groups.get(r.cluster).push(r);
}
const clusters = [...groups.keys()].sort();
const work = LIMIT ? clusters.slice(0, LIMIT) : clusters;

console.log(`${todo.length} hotel(s) to upgrade across ${clusters.length} cluster(s)`);
console.log(`  ${todo.filter((r) => r.why === 'road').length} road-level · ${todo.filter((r) => r.why === 'shared').length} sharing a position with a different hotel`);
console.log(`${work.length} cluster(s) this run · ${APPLY ? 'APPLY' : 'REPORT ONLY'}\n`);

/* ── the query ──────────────────────────────────────────────────────────── */
/* nwr = nodes, ways and relations. A hotel is a node in some places and a
   building outline in others; `out center` gives a point for all three. */
function overpassQL(bbox) {
  return `[out:json][timeout:60];
nwr["name"]["tourism"~"^(hotel|hostel|guest_house|motel|apartment|chalet|resort)$"](${bbox});
out center tags;
nwr["name"]["building"~"^(hotel|dormitory)$"](${bbox});
out center tags;`;
}

/* Overpass drops connections as well as returning 429/504 — the first full run
   died at cluster 41 of 73 on UND_ERR_CONNECT_TIMEOUT and took 40 clusters of
   work with it. So: catch the throw too, and back off the same way. */
async function fetchArea(bbox, attempt = 1) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'text/plain' },
      body: overpassQL(bbox),
      signal: AbortSignal.timeout(90_000),
    });
    if (res.status === 429 || res.status === 504 || res.status === 503) {
      if (attempt >= 4) return null;
      await sleep(10_000 * attempt);
      return fetchArea(bbox, attempt + 1);
    }
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    if (attempt >= 4) { console.log(`   (gave up after ${attempt} attempts: ${e.message})`); return null; }
    await sleep(10_000 * attempt);
    return fetchArea(bbox, attempt + 1);
  }
}

/* ── fetch ──────────────────────────────────────────────────────────────── */
/* The cache holds the RAW Overpass answer per cluster, not the verdicts.
   That matters: the matching rules needed four rounds of tightening before
   they stopped producing false positives, and with candidates cached each
   round costs a second instead of 25 minutes of re-querying. It also makes the
   run resumable, which it had to be — the first full pass died at cluster 41
   of 73 on a dropped connection and took the other 40 with it.
   Delete _internal/.overpass-cache.json to force a re-fetch. */
const CACHE = path.join(ROOT, '_internal/.overpass-cache.json');
const cache = readJson(CACHE, { version: 2, clusters: {} });
if (cache.version !== 2) { cache.version = 2; cache.clusters = {}; }

let queried = 0, cached = 0;
for (const cluster of work) {
  const rows = groups.get(cluster);
  if (cache.clusters[cluster]) { cached++; continue; }

  const lats = rows.map((r) => r.at.lat), lngs = rows.map((r) => r.at.lng);
  const bbox = [
    (Math.min(...lats) - PAD_DEG).toFixed(4), (Math.min(...lngs) - PAD_DEG).toFixed(4),
    (Math.max(...lats) + PAD_DEG).toFixed(4), (Math.max(...lngs) + PAD_DEG).toFixed(4),
  ].join(',');

  if (queried++) await sleep(PAUSE_MS);
  const j = await fetchArea(bbox);
  if (!j) { console.log(`!  ${cluster.padEnd(22)} Overpass gave nothing (${rows.length} hotel(s) skipped)`); continue; }

  /* One entry per (element, name) pair: OSM tags a hotel with `name`,
     `name:en` and `name:th`, and any of the three may be the one that matches
     what we call it. */
  const cands = [];
  for (const el of j.elements || []) {
    const lat = el.lat ?? el.center?.lat, lng = el.lon ?? el.center?.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const t = el.tags || {};
    for (const n of [t.name, t['name:en'], t['name:th'], t.alt_name, t.int_name]) {
      if (n) cands.push({ lat, lng, name: n, id: `${el.type}/${el.id}` });
    }
  }
  console.log(`   ${cluster.padEnd(22)} ${rows.length} to fix · ${cands.length} named accommodation POI(s) in box`);
  cache.clusters[cluster] = { cands, at: new Date().toISOString() };
  fs.writeFileSync(CACHE, JSON.stringify(cache) + '\n');
}
console.log(`\nfetched ${queried} cluster(s) · ${cached} read from cache\n`);

/* ── match ──────────────────────────────────────────────────────────────── */
const accepted = [];
const rejected = [];

for (const cluster of work) {
  const rows = groups.get(cluster);
  const entry = cache.clusters[cluster];
  if (!entry) { for (const r of rows) rejected.push({ ...r, why: 'Overpass returned nothing for this area' }); continue; }
  const cands = entry.cands;

  /* How many DIFFERENT buildings in this box carry each word. This is what
     makes a one-word match safe or unsafe: a word held by one building
     identifies it, a word held by forty is a road or a district. */
  const rarity = new Map();
  for (const [, group] of groupByOsmId(cands)) {
    const words = new Set();
    for (const c of group) for (const w of tokens(c.name)) words.add(w);
    for (const w of words) rarity.set(w, (rarity.get(w) || 0) + 1);
  }

  for (const r of rows) {
    /* The cluster's own words identify nothing here either: every hotel in the
       box is in that cluster. Derived rather than listed, so a new cluster is
       covered the day it is added. */
    const extraNoise = new Set(String(r.cluster || '').split('-').concat(String(r.prov || '').split('-')));
    const hits = [];
    let farAway = null;
    for (const c of cands) {
      for (const ours of [r.name, r.nameTh]) {
        if (!ours) continue;
        const m = nameMatch(ours, c.name, extraNoise, rarity);
        if (!m) continue;
        const d = km(r.at, c);
        if (d > MATCH_KM) { farAway = `match "${c.name}" is ${d.toFixed(0)} km from the road we know`; continue; }
        hits.push({ ...c, d, how: m.how });
        break;
      }
    }
    /* De-duplicate by OSM id: a hotel tagged with name + name:en matches twice. */
    const uniq = [...new Map(hits.map((h) => [h.id, h])).values()];
    if (!uniq.length) { rejected.push({ ...r, why: farAway || 'no name match in OSM' }); continue; }
    if (uniq.length > 1) {
      let spread = 0;
      for (const a of uniq) for (const b of uniq) spread = Math.max(spread, km(a, b) * 1000);
      if (spread > AMBIGUOUS_M) {
        rejected.push({ ...r, why: `${uniq.length} candidates ${spread.toFixed(0)} m apart — ambiguous, refused`,
          saw: uniq.map((h) => `${h.name} ${h.id}`).slice(0, 4) });
        continue;
      }
    }
    const best = uniq[0];
    /* The same rules check-coords.mjs applies, applied before writing rather
       than after: in Thailand, in the right province, not a centroid. */
    const pc = PROV[r.prov];
    if (best.lat < 5.55 || best.lat > 20.55 || best.lng < 97.30 || best.lng > 105.70) {
      rejected.push({ ...r, why: 'candidate is outside Thailand' }); continue;
    }
    if (pc && km(best, pc) < 0.025) { rejected.push({ ...r, why: 'lands exactly on the province centroid' }); continue; }
    accepted.push({ ...r, to: { lat: best.lat, lng: best.lng }, osm: best.id, osmName: best.name, how: best.how, moved: km(r.at, best) });
  }
}

function groupByOsmId(cands) {
  const m = new Map();
  for (const c of cands) {
    if (!m.has(c.id)) m.set(c.id, []);
    m.get(c.id).push(c);
  }
  return m;
}

/* ── report ─────────────────────────────────────────────────────────────── */
console.log('');
console.log('─'.repeat(78));
console.log(`ACCEPTED ${accepted.length} · REFUSED ${rejected.length}${cached ? ` · ${cached} cluster(s) from cache` : ''}`);
console.log('');
for (const a of accepted.slice(0, 30)) {
  console.log(`✓ ${a.slug}`);
  console.log(`    ${a.at.lat.toFixed(5)},${a.at.lng.toFixed(5)} → ${a.to.lat.toFixed(5)},${a.to.lng.toFixed(5)}  (moved ${(a.moved * 1000).toFixed(0)} m)`);
  console.log(`    "${a.name}" ≈ OSM "${a.osmName}" ${a.osm} · ${a.how}`);
}
if (accepted.length > 30) console.log(`  … ${accepted.length - 30} more`);

const byWhy = rejected.reduce((m, r) => ((m[r.why.replace(/\d+/g, 'N').replace(/".*?"/g, '"…"')] = (m[r.why.replace(/\d+/g, 'N').replace(/".*?"/g, '"…"')] || 0) + 1), m), {});
console.log('');
console.log('refusals by reason:');
for (const [k, n] of Object.entries(byWhy).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);
for (const r of rejected.filter((x) => x.saw).slice(0, 8)) {
  console.log(`  ? ${r.slug} "${r.name}"`);
  for (const c of r.saw) console.log(`      saw: ${c}`);
}

if (!APPLY) {
  console.log('');
  console.log('REPORT ONLY — nothing written. Re-run with --apply to commit these.');
  process.exit(0);
}

/* ── write ──────────────────────────────────────────────────────────────── */
/* The store first, so a crash between the two writes leaves the store ahead of
   the content rather than behind it — the content files are the ones a human
   reads, and a coordinate there with no provenance in the store is worse than
   provenance with no coordinate. */
for (const a of accepted) {
  store[a.slug] = {
    ...store[a.slug],
    lat: a.to.lat, lng: a.to.lng, prov: a.prov,
    via: 'overpass', precision: 'poi', osm: a.osm, osmName: a.osmName,
    q: `${a.name} @ ${a.osm}`,
    distKm: PROV[a.prov] ? Math.round(km(a.to, PROV[a.prov]) * 10) / 10 : undefined,
    wasPrecision: store[a.slug]?.precision || 'poi',
    wasLat: a.at.lat, wasLng: a.at.lng,
  };
}
/* indent 1, not 2 — that is how _internal/geocode-hotels.mjs writes this file.
   Writing 2 reformatted all 12,700 lines and buried the 19 records that
   actually changed in a diff nobody could read. */
fs.writeFileSync(SIDECAR, JSON.stringify(store, null, 1) + '\n');
console.log(`\nwrote ${accepted.length} upgraded record(s) to _internal/hotel-coords.json`);

/* Then every locale's copy of the review, preserving the file's own formatting
   convention (2-space indent, trailing newline) exactly as geocode-hotels does. */
const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];
const per = {};
for (const a of accepted) {
  for (const suffix of LOC) {
    const f = path.join(ROOT, `astro/src/content/reviews${suffix}`, a.slug + '.json');
    if (!fs.existsSync(f)) continue;
    const j = readJson(f, null);
    if (!j) continue;
    j.lat = Number(a.to.lat.toFixed(6));
    j.lng = Number(a.to.lng.toFixed(6));
    fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
    per[`reviews${suffix}`] = (per[`reviews${suffix}`] || 0) + 1;
  }
}
console.log('applied to content:');
for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
console.log('\nNow re-run: node _internal/gen-feeds.mjs  (review-coords.json feeds every map)');
console.log('Then:       node _internal/qa/check-coords.mjs');
