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
     node _internal/geocode-overpass.mjs --misses [--out x.json] [--offline] [--apply]
                     hotels with NO point at all: list the named lodging inside
                     each cluster's OSM boundary and match names — see runMisses()
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REVIEWS = path.join(ROOT, 'astro/src/content/reviews');
const SIDECAR = path.join(ROOT, '_internal/hotel-coords.json');
const PROV_FILE = path.join(ROOT, '_internal/province-coords.json');

const APPLY = process.argv.includes('--apply');
const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i > 0 ? Number(process.argv[i + 1]) || 0 : 0; })();
const MISSES = process.argv.includes('--misses');
/* --offline (with --misses): match from the cached lodging lists, never the network */
const OFFLINE = process.argv.includes('--offline');
/* --out <file> (with --misses): every accepted and refused row, with the review's address */
const OUT = (() => { const i = process.argv.indexOf('--out'); return i > 0 ? process.argv[i + 1] : null; })();

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
  /* The 33 Bangkok district clusters, as in geocode-poi-overpass.mjs and
     check-coords.mjs — without them a district's hotels have no province. */
  ari: 'bangkok', bangna: 'bangkok', 'central-ladprao': 'bangkok',
  'charoen-krung': 'bangkok', chidlom: 'bangkok', chinatown: 'bangkok',
  'khao-san': 'bangkok', 'on-nut': 'bangkok', 'phrom-phong': 'bangkok',
  pinklao: 'bangkok', ploenchit: 'bangkok', rama9: 'bangkok',
  ramkhamhaeng: 'bangkok', ratchada: 'bangkok', ratchathewi: 'bangkok',
  riverside: 'bangkok', 'sai-tai': 'bangkok', samyan: 'bangkok',
  'saphan-taksin': 'bangkok', 'siam-pratunam': 'bangkok',
  'silom-sathorn': 'bangkok', srinakarin: 'bangkok', sukhumvit: 'bangkok',
  'talat-phlu': 'bangkok', 'thong-lo': 'bangkok', 'victory-monument': 'bangkok',
  bangkapi: 'bangkok', 'chaeng-watthana': 'bangkok', kaset: 'bangkok',
  ladprao: 'bangkok', 'bang-khen': 'bangkok', 'mochit-chatuchak': 'bangkok',
  'bang-sue': 'bangkok',
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
  /* Bang Saray is a sub-district of Sattahip: "U Pattaya (Bang Saray)"
     matched "Bang Saray Villa Hotel" on those two words alone (2026-09-15).
     The one-word spelling "bangsaray" stays significant — Baan Pimpisa
     Bangsaray and Kept Bangsaray are right on it plus their own name. */
  'bang', 'saray',
]);

/* "Bed & Breakfast" is a kind of lodging, not a name. As the only two words in
   common it pinned Si Phum Heritage Boutique Bed & Breakfast on "Riverside
   House Bed & Breakfast" and Lost and Found Bed and Breakfast on "The Bed &
   Breakfast" 2.5 km away (first --misses run, 2026-09-15). The PHRASE is
   dropped, not the words: making "bed" a noise word also refused Bed by Boat
   Hotel, which is exactly OSM's "BED BY BOAT Hotel & Apt". */
const LODGING_PHRASE = /\bbed\s*(?:&|and|n)\s*breakfast\b|\bb\s*&\s*b\b/gi;
function tokens(s, extraNoise) {
  return String(s || '').replace(LODGING_PHRASE, ' ')
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

/* SAME NAME — a second, stricter way in, used by --misses only.
   The word rule above ignores place words, so a hotel called one distinctive
   word plus a place ("Pimalai", "Hop Inn Phayao", "Coasta Bangsaen") can never
   reach two significant words, however exactly OSM spells it. This accepts the
   name itself instead: every word kept — place words and one-letter words
   included — except hotel, resort, spa, the, and, by, and the two sequences
   must be identical, with at least one word of four letters that is not a
   place.
   Measured first, 2026-09-15: a looser version that dropped the whole NOISE
   list collapsed different hotels into one word — "Mango Beach Resort Thailand"
   = "Mango Spa & Resort", "I Hotel Khonkaen" = "B&P Home Khonkaen", "Samet Inn"
   = "Samet Beach Resort", "S&G Hometel" = "The P Hometel". Keeping the words
   refuses all of those and still accepts "The Terminal Khon Kaen Hotel" =
   "The Terminal Hotel Khon Kaen", and settles "Soneva Kiri" against "Soneva
   Kiri Resort by Six Senses". */
const IDENTITY_DROP = new Set(['hotel', 'hotels', 'resort', 'resorts', 'spa', 'the', 'and', 'by']);
function nameWords(s) {
  return String(s || '').replace(LODGING_PHRASE, ' ').replace(/@/g, ' at ')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, ' ').split(' ')
    .filter((w) => w && !IDENTITY_DROP.has(w));
}
/* `own` — the hotel's OWN cluster and province words, dropped from both names
   before comparing (other places stay). Our review names append the location
   and OSM's do not: "Dusita Resort Kohkood" is OSM's "Dusita resort", "The
   Countryside Pai" is "Countryside Resort" (2026-09-15). The joined spellings
   ("kohkood") count as the cluster's words too. */
/* SPELLED APART — the same letters with the spaces, dots and a plural "s"
   in different places. "K.L. Boutique Hotel" is OSM's "KL Boutique Hotel"
   (addr:street ถนนมหาราช ซอย 2 — the review's own Maharaj Road Soi 2),
   "SriLanta Resort & Spa" is "Sri Lanta" (website srilanta.com), "Lazy Day The
   Resort" is "Lazyday Resort", "Paradise Pearl Bungalows" is "Paradise Pearl
   Bungalow", and "@" is "at" ("The Chill @ Krabi Hotel"). The words are joined
   and compared letter for letter, so nothing is dropped that sameName keeps:
   "Golden Hill" still differs from "Golden Hill Bungalows", and "Lee Gardens
   Plaza Hotel" from "Lee Garden Hotel". A joined name that is itself a place
   ("huahin") identifies nothing and is refused. */
function singular(w) {
  return w.length >= 5 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w;
}
function sameName(a, b, own) {
  const drop = own || new Set();
  const A = nameWords(a).filter((w) => !drop.has(w)), B = nameWords(b).filter((w) => !drop.has(w));
  if (!A.length || !B.length) return false;
  const significant = (w) => w.length >= 4 && !PLACE_NOISE.has(w) && !/^\d+$/.test(w);
  if (A.join(' ') === B.join(' ')) return A.some(significant) ? 'same name' : false;
  const joined = A.map(singular).join('');
  if (joined !== B.map(singular).join('') || PLACE_NOISE.has(joined)) return false;
  return A.some(significant) || B.some(significant) ? 'same name, spelled apart' : false;
}

/* ── what needs upgrading ───────────────────────────────────────────────── */
const store = readJson(SIDECAR, {});

/* --misses asks a different question; see runMisses() at the end of this file. */
if (MISSES) { await runMisses(); process.exit(0); }

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
  /* 'area' (a village, estate or district answered for the hotel) is as far from
     the doorstep as 'road', and is upgraded the same way. */
  const needs = v.precision === 'road' || v.precision === 'area' || shared.has(slug);
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
    at: { lat: v.lat, lng: v.lng }, why: v.precision === 'road' || v.precision === 'area' ? v.precision : 'shared',
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
console.log(`  ${todo.filter((r) => r.why === 'road').length} road-level · ${todo.filter((r) => r.why === 'area').length} area-level · ${todo.filter((r) => r.why === 'shared').length} sharing a position with a different hotel`);
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
fs.writeFileSync(SIDECAR, serializeLike(fs.readFileSync(SIDECAR, 'utf8'), store).text);
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
    fs.writeFileSync(f, serializeLike(fs.readFileSync(f, 'utf8'), j).text);
    per[`reviews${suffix}`] = (per[`reviews${suffix}`] || 0) + 1;
  }
}
console.log('applied to content:');
for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
console.log('\nNow re-run: node _internal/gen-feeds.mjs  (review-coords.json feeds every map)');
console.log('Then:       node _internal/qa/check-coords.mjs');

/* ── --misses: hotels with no point at all ──────────────────────────────── */
/* The default mode upgrades a road or area point by searching 9 km around it.
   A hotel Nominatim never placed has no point to search around, so nothing
   ever asked about it again: 1,118 reviews on 2026-09-15 — 618 with no
   answer, 378 answered only with a village or a house number, 79 with the
   province centre.
   Tested that day on six clusters (43 such hotels): listing every NAMED
   lodging inside the cluster's own OSM boundary (_internal/cluster-areas.json)
   and matching with this file's identity rules found 8, each agreeing with the
   review's own address — Classic Kameo in Ayutthaya, Pai Vieng Fah, six
   resorts on Koh Kood.
   With no road point to be near, the boundary is the only anchor, so on top
   of the name rules:
     · matches further apart than AMBIGUOUS_M refuse the hotel (Soneva Kiri:
       two nodes 377 m apart);
     · an OSM element already carrying a DIFFERENT hotel's pin is refused;
     · an element removed from this review on evidence (pin-fixes.json) is
       never put back;
     · every hotel with no pin ON THE PAGE is asked, whatever the store holds.
       Until 2026-09-16 a stored point excluded it: road/area rows were left to
       the default mode, which searches 9 km around a point that was wrong
       enough to delete and accepts two words only, and poi rows that commit
       991410af6 took off the page (a road midpoint, or a position shared by
       different hotels) were never asked again at all. Neither kind came back.
       Hua Hin Marriott, 107/1 Phetkasem Road, is OSM's "Hua Hin Marriott
       Resort & Spa" (addr:street ถนนเพชรเกษม); Crystal Hotel Hat Yai is the
       element whose website is crystalhotelhatyai.com. The stored point plays
       no part in the match — the boundary and OSM's element do — and is kept
       beside the new one as wasLat/wasLng.
   Every accepted row is read against the review's address before --apply;
   --out puts that address beside each match. */
async function runMisses() {
  const AREAS = readJson(path.join(ROOT, '_internal/cluster-areas.json'), { clusters: {} }).clusters || {};
  /* the same mirrors, order and one-job rule as geocode-poi-overpass.mjs */
  const MIRRORS = [
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];
  const removed = new Set(readJson(path.join(ROOT, '_internal/pin-fixes.json'), [])
    .filter((e) => e.action === 'drop' && e.kind === 'reviews' && e.osm).map((e) => `${e.slug}|${e.osm}`));
  const owner = new Map();
  for (const [slug, v] of Object.entries(store)) if (v && v.osm && Number.isFinite(v.lat)) owner.set(v.osm, slug);

  const scopeOf = (cluster) => {
    const e = AREAS[cluster] || AREAS[CLUSTER_PROVINCE[cluster]];
    if (!e) return null;
    const label = (e.from || []).map((f) => f.nameEn || f.name).join(' + ');
    if (Array.isArray(e.areas) && e.areas.length) {
      return { key: `area:${e.areas.join('+')}`, prefix: `(${e.areas.map((a) => `area(${a});`).join('')})->.a;`, filter: '(area.a)', label };
    }
    if (Array.isArray(e.bbox)) return { key: `bbox:${e.bbox.join(',')}`, prefix: '', filter: `(${e.bbox.join(',')})`, label: `${label}, bounding box` };
    return null;
  };

  /* A review that says what the hotel used to be called — "(เดิม Novotel)",
     "(formerly W Retreat Koh Samui)" — names something OSM may still carry,
     because mappers rarely retag a rebrand. A former name of one or two words
     is a brand, and stands in for the words before the hotel's own place word:
     "The Nouveau Chumphon Beach Resort and Golf" (เดิม Novotel) was "Novotel
     Chumphon Beach Resort and Golf". Former names then pass exactly the same
     rules as the name, and are labelled so the review can see which matched. */
  const formerNames = (j, cluster, prov) => {
    const text = [j.title, j.metaDesc, j.typeFull, j.h1, j.schemaDesc].map((v) => String(v || '')).join(' | ');
    const place = new Set([...String(cluster).split('-'), ...String(prov).split('-')].filter(Boolean));
    const out = new Set();
    for (const m of text.matchAll(/\((?:เดิม(?:ชื่อ)?|ชื่อเดิม|formerly)\s*(?:คือ\s*)?([^)]{2,60})\)/gi)) {
      const f = m[1].split(/[฀-๿]/)[0].replace(/[\s/·,;:–—-]+$/, '').trim();
      if (f.length < 3 || !/[A-Za-z]{2}/.test(f)) continue;
      out.add(f);
      const words = String(j.name).split(/\s+/);
      const at = words.findIndex((w) => place.has(w.toLowerCase().replace(/[^a-z]/g, '')));
      if (f.split(/\s+/).length <= 2 && at > 0) out.add(`${f} ${words.slice(at).join(' ')}`);
    }
    return [...out].filter((n) => n !== j.name);
  };

  const rows = [];
  for (const f of fs.readdirSync(REVIEWS)) {
    if (!f.endsWith('.json')) continue;
    const slug = f.replace(/\.json$/, '');
    const st = store[slug];
    const j = readJson(path.join(REVIEWS, f), null);
    if (!j || !j.name || Number.isFinite(j.lat)) continue;
    /* What the store holds for a hotel that has no pin on the page. */
    const had = !st || !Number.isFinite(st.lat) ? 'no point'
      : st.precision === 'road' || st.precision === 'area' ? `${st.precision} point` : 'point taken off the page';
    const cluster = j.cluster || '';
    const prov = PROV[cluster] ? cluster : CLUSTER_PROVINCE[cluster] || cluster;
    rows.push({
      slug, name: j.name, nameTh: typeof j.nameTh === 'string' ? j.nameTh : '', cluster, scope: scopeOf(cluster), prov,
      addr: [j.streetAddress, j.addressLocality, j.mapAddr].filter(Boolean).join(' | '), was: st ? st.why || null : null, had,
      former: formerNames(j, cluster, prov),
    });
  }
  const noScope = rows.filter((r) => !r.scope);
  const byScope = new Map();
  for (const r of rows) {
    if (!r.scope) continue;
    if (!byScope.has(r.scope.key)) byScope.set(r.scope.key, { scope: r.scope, rows: [] });
    byScope.get(r.scope.key).rows.push(r);
  }
  const hadTally = rows.reduce((m, r) => ((m[r.had] = (m[r.had] || 0) + 1), m), {});
  console.log(`--misses: ${rows.length} hotel review(s) with no pin on the page (${Object.entries(hadTally).map(([k, n]) => `${n} ${k}`).join(' · ')}) · ${byScope.size} area(s) to list`
    + `${noScope.length ? ` · ${noScope.length} in clusters with no area: ${[...new Set(noScope.map((r) => r.cluster))].join(', ')}` : ''}`);
  console.log(`${APPLY ? 'APPLY' : 'REPORT ONLY'}${OFFLINE ? ' · OFFLINE' : ''}\n`);

  const CACHE_FILE = path.join(ROOT, '_internal/.overpass-poi-hotel-cache.json');
  const cache = readJson(CACHE_FILE, { scopes: {} });
  const fetchQL = async (ql) => {
    for (let attempt = 1; attempt <= 6; attempt++) {
      const ep = MIRRORS[(attempt - 1) % MIRRORS.length];
      try {
        const res = await fetch(ep, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'text/plain' }, body: ql, signal: AbortSignal.timeout(200_000) });
        if (res.ok) {
          const j = await res.json();
          /* HTTP 200 with a runtime error in `remark` is a partial list, not the list */
          if (!(typeof j.remark === 'string' && /error|timed out|out of memory/i.test(j.remark))) return j;
        }
      } catch { /* try the next mirror */ }
      await sleep(8_000 * attempt);
    }
    return null;
  };
  let asked = 0, failed = 0;
  for (const [key, g] of byScope) {
    if (cache.scopes[key] || OFFLINE) continue;
    if (asked++) await sleep(6_000);
    const { prefix, filter } = g.scope;
    const j = await fetchQL(`[out:json][timeout:180];${prefix}(nwr["name"]["tourism"~"^(hotel|hostel|guest_house|motel|apartment|chalet|resort)$"]${filter};nwr["name"]["leisure"="resort"]${filter};nwr["name"]["building"~"^(hotel|dormitory)$"]${filter};);out center tags;`);
    if (!j) { failed++; console.log(`!  ${g.scope.label}: no complete answer from any mirror — not cached, re-run to retry`); continue; }
    const cands = [];
    for (const el of j.elements || []) {
      const lat = el.lat ?? el.center?.lat, lng = el.lon ?? el.center?.lon;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const t = el.tags || {};
      const kind = t.tourism || (t.leisure && `leisure=${t.leisure}`) || (t.building && `building=${t.building}`) || '';
      for (const n of [t.name, t['name:en'], t['name:th'], t.alt_name, t.int_name]) {
        if (n) cands.push({ lat, lng, name: n, id: `${el.type}/${el.id}`, kind });
      }
    }
    cache.scopes[key] = { cands, at: new Date().toISOString() };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache) + '\n');
    console.log(`   ${g.scope.label.slice(0, 44).padEnd(44)} ${String(g.rows.length).padStart(3)} hotel(s) · ${new Set(cands.map((c) => c.id)).size} named lodging element(s)`);
  }
  console.log(`\nlisted ${asked - failed} area(s) now${failed ? ` · ${failed} FAILED` : ''} · ${[...byScope.keys()].filter((k) => cache.scopes[k]).length} of ${byScope.size} available\n`);

  const accepted = [], refused = [];
  const reviewName = (slug) => readJson(path.join(REVIEWS, `${slug}.json`), {}).name || slug;
  for (const [key, g] of byScope) {
    const entry = cache.scopes[key];
    for (const r of g.rows) {
      if (!entry) { refused.push({ ...r, why: `${g.scope.label} not listed yet` }); continue; }
      const extraNoise = new Set(String(r.cluster || '').split('-').concat(String(r.prov || '').split('-')));
      const own = new Set([...extraNoise, String(r.cluster || '').replace(/-/g, ''), String(r.prov || '').replace(/-/g, '')].filter(Boolean));
      const hits = [], same = [];
      for (const c of entry.cands) {
        for (const [ours, label] of [[r.name, ''], [r.nameTh, ''], ...(r.former || []).map((n) => [n, `former name "${n}" · `])]) {
          if (!ours) continue;
          const same1 = sameName(ours, c.name, own);
          if (same1) same.push({ ...c, how: `${label}${same1}: ${String(c.name).slice(0, 44)}` });
          const m = nameMatch(ours, c.name, extraNoise);
          if (m) { hits.push({ ...c, how: `${label}${m.how}` }); break; }
        }
      }
      const spreadOf = (list) => { let s = 0; for (const a of list) for (const b of list) s = Math.max(s, km(a, b) * 1000); return s; };
      let uniq = [...new Map(hits.map((h) => [h.id, h])).values()];
      const sameUniq = [...new Map(same.map((h) => [h.id, h])).values()];
      /* The same name decides two cases the word rule cannot: no word match at
         all, and word matches that are ambiguous while exactly one place (or
         one place drawn twice) carries the hotel's own name. See sameName(). */
      if (!uniq.length && sameUniq.length) uniq = sameUniq;
      else if (uniq.length && spreadOf(uniq) > AMBIGUOUS_M && sameUniq.length && spreadOf(sameUniq) <= AMBIGUOUS_M) uniq = sameUniq;
      if (!uniq.length) { refused.push({ ...r, why: `no name match among the named lodging inside ${g.scope.label}` }); continue; }
      const spread = spreadOf(uniq);
      if (spread > AMBIGUOUS_M) {
        refused.push({ ...r, why: `${uniq.length} matches ${spread.toFixed(0)} m apart — ambiguous, refused`, saw: uniq.slice(0, 4).map((h) => `${h.name} ${h.id}`) });
        continue;
      }
      const best = uniq.find((h) => h.id.startsWith('node/')) || uniq[0];
      if (best.lat < 5.55 || best.lat > 20.55 || best.lng < 97.30 || best.lng > 105.70) { refused.push({ ...r, why: 'candidate is outside Thailand' }); continue; }
      const pc = PROV[r.prov];
      if (pc && km(best, pc) < 0.025) { refused.push({ ...r, why: 'lands exactly on the province centroid' }); continue; }
      if (removed.has(`${r.slug}|${best.id}`)) { refused.push({ ...r, why: `${best.id} was removed from this review on evidence — see _internal/pin-fixes.json` }); continue; }
      const held = owner.get(best.id);
      if (held && held !== r.slug && !nameMatch(r.name, reviewName(held), extraNoise)) {
        refused.push({ ...r, why: `${best.id} "${best.name}" already carries the pin of a different hotel, ${held}` });
        continue;
      }
      accepted.push({
        ...r, to: { lat: best.lat, lng: best.lng }, osm: best.id, osmName: best.name, kind: best.kind, how: best.how,
        also: uniq.length > 1 ? uniq.filter((h) => h.id !== best.id).map((h) => `${h.name} ${h.id} ${(km(best, h) * 1000).toFixed(0)} m`) : null,
        sameElementAs: held && held !== r.slug ? held : null,
      });
    }
  }

  console.log('─'.repeat(78));
  console.log(`ACCEPTED ${accepted.length} · REFUSED ${refused.length}\n`);
  for (const a of accepted) console.log(`✓ ${a.slug.padEnd(54)} "${a.name}" ≈ "${a.osmName}" ${a.osm} ${a.kind} · ${a.how}`);
  const tally = refused.reduce((acc, r) => { const k = r.why.replace(/\d+/g, 'N').replace(/".*?"/g, '"…"').replace(/ inside .*$/, ' inside <area>'); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
  console.log('\nrefusals by reason:');
  for (const [k, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(5)}  ${k}`);
  const strip = (r) => ({ slug: r.slug, cluster: r.cluster, name: r.name, nameTh: r.nameTh || null, addr: r.addr, area: r.scope ? r.scope.label : null, had: r.had });
  if (OUT) {
    fs.writeFileSync(OUT, JSON.stringify({
      accepted: accepted.map((a) => ({ ...strip(a), lat: a.to.lat, lng: a.to.lng, osm: a.osm, osmName: a.osmName, kind: a.kind, how: a.how, also: a.also, sameElementAs: a.sameElementAs })),
      refused: refused.map((r) => ({ ...strip(r), why: r.why, saw: r.saw || null })),
    }, null, 2) + '\n');
    console.log(`\nwrote ${OUT}`);
  }
  if (!APPLY) { console.log('\nREPORT ONLY — nothing written. Re-run with --apply.'); return; }

  for (const a of accepted) {
    const prev = store[a.slug] || {};
    const { why, q, ...rest } = prev;
    store[a.slug] = {
      ...rest, lat: a.to.lat, lng: a.to.lng, prov: a.prov,
      via: 'overpass', precision: 'poi', osm: a.osm, osmName: a.osmName,
      q: `${a.name} @ ${a.osm} (named lodging inside ${a.scope.label})`,
      distKm: PROV[a.prov] ? Math.round(km(a.to, PROV[a.prov]) * 10) / 10 : undefined,
      ...(why ? { wasWhy: why } : {}),
      /* a stored point that never reached the page is kept beside the new one */
      ...(Number.isFinite(prev.lat) ? { wasLat: prev.lat, wasLng: prev.lng, wasPrecision: prev.precision || 'poi' } : {}),
    };
  }
  fs.writeFileSync(SIDECAR, serializeLike(fs.readFileSync(SIDECAR, 'utf8'), store).text);
  console.log(`\nwrote ${accepted.length} record(s) to _internal/hotel-coords.json`);
  const LOCS = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];
  const per = {};
  for (const a of accepted) {
    for (const suffix of LOCS) {
      const f = path.join(ROOT, `astro/src/content/reviews${suffix}`, `${a.slug}.json`);
      if (!fs.existsSync(f)) continue;
      const j = readJson(f, null);
      if (!j) continue;
      j.lat = Number(a.to.lat.toFixed(6));
      j.lng = Number(a.to.lng.toFixed(6));
      fs.writeFileSync(f, serializeLike(fs.readFileSync(f, 'utf8'), j).text);
      per[`reviews${suffix}`] = (per[`reviews${suffix}`] || 0) + 1;
    }
  }
  console.log('applied to content:');
  for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
  console.log('\nNow: node astro/prebuild.mjs (feeds, hubs) · node _internal/qa/check-coords.mjs');
}
