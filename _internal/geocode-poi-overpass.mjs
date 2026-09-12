#!/usr/bin/env node
/* =============================================================================
   geocode-poi-overpass.mjs — coordinates for restaurants and attractions

   WHY THIS EXISTS
   ---------------
   A province-hub map renders a layer only when that layer is ≥60% geocoded, and
   the layer holding everything back is EAT: 1,934 of 4,809 restaurant blocks
   have no coordinate, which puts almost every province at 45–51% — just under
   the line. Chiang Mai has 82 verified places and shows no map at all, because
   no single layer reaches 60%. The map coverage problem is not a hotels
   problem; it is this one.

   Nominatim was tried on these and answered badly: it searches the world and
   ranks, so "ก๋วยเตี๋ยวเรือป้าเล็ก" can come back as something in another
   province. The measured hit rate was about 1 in 8.

   HOW THIS ASKS INSTEAD
   ---------------------
   One Overpass request per batch of names, scoped to the cluster's own bounding
   box, with the names unioned into a single ANCHORED regex — ^(a|b|c)$. So the
   server does exact matching and returns only real answers, instead of the
   15,000 Bangkok restaurants that "amenity=restaurant in this box" would
   return, or the near-misses an unanchored pattern brings back.

   THE MATCHING RULE, AND WHY IT DIFFERS FROM THE HOTEL UPGRADER
   -------------------------------------------------------------
   _internal/geocode-overpass.mjs requires two identifying words, because a
   hotel name has several. These names do not: "วัดม่วง" is one word once the
   category word "วัด" is dropped, and a two-word rule refused all 65 places in
   the first probe of this script. So the rule here is EXACT name identity.
   That is not a weakening — it is stricter in the way that matters. The Ang
   Thong box genuinely contains วัดม่วง, วัดม่วงเจริญผล, วัดม่วงหวาน and
   โรงเรียนวัดม่วงเจริญผล, which is a school named after one of them. Only exact
   identity separates those four.

   Restaurant coordinates live in article blocks (blocks[].kind ===
   'restaurant'); attraction coordinates live in _internal/place-coords.json
   keyed by canonical URL, because that is how gen-feeds has read them since
   2026-07.

   Usage:
     node _internal/geocode-poi-overpass.mjs --report                restaurants
     node _internal/geocode-poi-overpass.mjs --attractions --report  attractions
     ... --apply    write · --limit N  only the first N clusters
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ARTICLES = path.join(ROOT, 'astro/src/content/articles');
const PLACE_COORDS = path.join(ROOT, '_internal/place-coords.json');
const PROV_FILE = path.join(ROOT, '_internal/province-coords.json');

const APPLY = process.argv.includes('--apply');
const ATTRACTIONS = process.argv.includes('--attractions');
const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i > 0 ? Number(process.argv[i + 1]) || 0 : 0; })();

const UA = 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; POI coordinate backfill)';
/* Three public mirrors of the same database, tried in order — rotating on
   failure spreads bulk load rather than hammering one host, which Overpass's
   usage policy asks for and enforces.
   Order is a measurement, not a preference. Measured on this machine,
   2026-09-12:
     maps.mail.ru      OK, 1.4–2.0 s, full planet          ← the only one working
     overpass-api.de   TCP connect timeout
     kumi.systems      TCP connect timeout
     private.coffee    TCP connect timeout
     osm.jp            expired TLS certificate
     osm.ch            OK and fast, but SWITZERLAND ONLY — it answers every
                       Thai query with 0 elements, which looks exactly like
                       "not in OSM" and silently zeroed a whole probe run
                       before that was spotted. Never put a regional instance
                       in this list.
   Three different hosts failing at the TCP layer while a fourth works is an
   ISP block, not a ban — this connection already blocks R2's S3 endpoint.
   Re-measure before reordering. */
const ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const PAUSE_MS = 6000;         /* bulk work, so well inside the usage policy */
const BOX_DEG = 0.45;          /* ~50 km around a province centre */
const MATCH_KM = 90;           /* inside the province, generously */
/* Two answers further apart than this = genuinely two places, refuse both.
   400 m, picked from the measured distribution of all 112 exact-name groups
   that hold more than one OSM element:
     0–200 m   46 groups — one place mapped twice (a node inside its own way,
                           a way plus the relation that contains it)
     200–400 m 13 groups — one compound mapped as adjacent parcels
     >2 km     35 groups — DIFFERENT places sharing a name. "วัดม่วง" has two
                           ways 45.7 km apart and "วัดช่องลม" two 83.6 km apart,
                           because those are among the commonest temple names in
                           Thailand. Averaging them would invent a location in a
                           rice field between two provinces.
   The previous 150 m refused 34 real matches, including Wat Muang's Great
   Buddha — one of the most-visited sites in the country. */
const AMBIGUOUS_M = 400;
const BATCH = 40;              /* names per request */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };

/* Read the file's own indent rather than assuming one. This repo uses BOTH:
   the article collections indent with 1 space, the review collections with 2,
   and the coordinate stores under _internal with 1. Writing the wrong one
   reformats every line, turning a two-line change into a 700-line diff nobody
   can review — which is exactly what happened to 464 article files before this
   function existed. */
function indentOf(raw, fallback = 2) {
  const m = String(raw).match(/^\{\r?\n( +)"/);
  return m ? m[1].length : fallback;
}

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
const centreOf = (c) => PROV[c] || PROV[CLUSTER_PROVINCE[c]] || null;

/* ── name identity ──────────────────────────────────────────────────────── */
const ident = (s) => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9฀-๿]+/g, '');

function nameMatch(ours, theirs) {
  const [A, B] = [ident(ours), ident(theirs)];
  if (!A || !B || A.length < 3) return null;
  if (A === B) return { how: `exact name: ${String(theirs).slice(0, 44)}` };
  return null;
}

/* Editorial names carry a tail: an em-dash pitch, a Thai อ./จ. address, a
   parenthetical alias. "วัดม่วง (หลวงพ่อใหญ่ …) — พระพุทธรูปนั่งที่ใหญ่ที่สุดในไทย"
   is one venue, one name and two pieces of copy. Offer every plausible reading
   and let exact identity decide which, if any, is real. */
function splitNames(s) {
  let t = String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  t = t.split(/\s*[—–|·]\s*/)[0].trim();
  const out = new Set([t]);
  const paren = t.match(/^(.+?)\s*[（(]\s*(.+?)\s*[）)]/);
  if (paren) { out.add(paren[1].trim()); out.add(paren[2].trim()); }
  out.add(t.replace(/\s*[（(].*$/, '').trim());
  out.add(t.replace(/\s+(?:อ\.|จ\.|ต\.|เขต|แขวง)\s*\S.*$/, '').trim());
  out.add(t.replace(/\s*,.*$/, '').trim());
  return [...out].filter((x) => x.length > 2);
}

/* Which of those variants is worth SENDING. The full editorial string is never
   what a mapper typed, and inside an anchored regex it returns nothing at all —
   that is how the second probe of this script scored 0 candidates where the
   first scored 44. */
const askable = (n) => n.length > 2 && n.length <= 60 && !/[（()）]|อ\.|จ\.|ต\.|,/.test(n);

/* Right name, right province, WRONG KIND OF BUSINESS.
   "Baan Tepa" is a two-Michelin-star restaurant in Bang Kapi. OSM also has a
   guesthouse called Baan Tepa in Rattanakosin, 17 km west, tagged
   tourism=hotel — an exact name match, in the right province, unambiguous, and
   completely wrong. Nothing in the geometry can tell those apart; only the kind
   of thing can.
   Our own blocks say which kind they are, cleanly: 3,013 carry cuisine /
   signature / mustOrder / spice / englishMenu, and the other 1,796 carry
   duration / pros / cons instead, with no overlap. So a block that is about
   food must match something that serves food. */
const FOOD_AMENITY = new Set(['restaurant', 'cafe', 'fast_food', 'bar', 'pub',
  'food_court', 'ice_cream', 'biergarten', 'bbq', 'marketplace', 'nightclub']);
const FOOD_SHOP = new Set(['bakery', 'confectionery', 'coffee', 'deli', 'seafood',
  'pastry', 'chocolate', 'tea', 'greengrocer', 'butcher', 'convenience', 'food',
  'supermarket', 'beverages', 'alcohol', 'farm', 'dairy', 'spices']);
const IS_FOOD_BLOCK = (b) => !!(b.cuisine || b.signature || b.mustOrder || b.spice
  || b.englishMenu || b.veg || b.halal);
const SERVES_FOOD = (t) => !!(t.cuisine || FOOD_AMENITY.has(t.amenity) || FOOD_SHOP.has(t.shop));

/* ── the backlog ────────────────────────────────────────────────────────── */
const THEME_GUIDE = /^(top10|best-|where-|how-|what-|when-|guide-)|-(guide|itinerary|plan)$/;

function restaurantBacklog() {
  const out = [];
  for (const f of fs.readdirSync(ARTICLES)) {
    if (!f.endsWith('.json')) continue;
    const a = readJson(path.join(ARTICLES, f), null);
    if (!a) continue;
    const blocks = Array.isArray(a.blocks) ? a.blocks : [];
    blocks.forEach((b, i) => {
      if (!b || b.kind !== 'restaurant' || !b.name) return;
      if (Number.isFinite(b.lat) && Number.isFinite(b.lng)) return;
      /* `kind:'restaurant'` is the layout's generic ranked-item block, and some
         of those items are not places at all — Ang Thong's list includes
         "รถทัวร์จากกรุงเทพฯ ไปอ่างทอง", which is a bus route. A venue block
         carries a map link; a how-to row does not. */
      if (!b.mapHref) return;
      const cluster = a.cluster || 'thailand';
      out.push({
        file: f, blockIndex: i, id: `${f.replace(/\.json$/, '')} › ${b.name}`,
        names: splitNames(b.name), cluster, food: IS_FOOD_BLOCK(b), rank: b.rank,
        prov: PROV[cluster] ? cluster : CLUSTER_PROVINCE[cluster] || cluster,
      });
    });
  }
  return out;
}

/* An attraction article has no address — only a slug and a headline whose
   LEADING words are the name and whose tail is the pitch. */
function attractionBacklog() {
  const have = readJson(PLACE_COORDS, {});
  const out = [];
  for (const f of fs.readdirSync(ARTICLES)) {
    if (!f.endsWith('.json')) continue;
    const a = readJson(path.join(ARTICLES, f), null);
    if (!a || a.type !== 'attraction') continue;
    const slug = a.slug || f.replace(/\.json$/, '');
    if (THEME_GUIDE.test(slug)) continue;
    if (Number.isFinite(a.lat) && Number.isFinite(a.lng)) continue;
    const rec = have[`https://thailandaddict.com/${slug}`];
    if (rec && rec.lat) continue;
    const h1 = String(a.h1 || a.title || '');
    const cluster = a.cluster || 'thailand';
    out.push({
      slug, id: slug,
      names: [...new Set([...splitNames(h1), slug.replace(/-/g, ' ')])],
      cluster, prov: PROV[cluster] ? cluster : CLUSTER_PROVINCE[cluster] || cluster,
    });
  }
  return out;
}

const todo = ATTRACTIONS ? attractionBacklog() : restaurantBacklog();
const groups = new Map();
for (const r of todo) {
  if (!groups.has(r.cluster)) groups.set(r.cluster, []);
  groups.get(r.cluster).push(r);
}
const clusters = [...groups.keys()].filter(centreOf).sort();
const skipped = [...groups.keys()].filter((c) => !centreOf(c));
const work = LIMIT ? clusters.slice(0, LIMIT) : clusters;

console.log(`${ATTRACTIONS ? 'attractions' : 'restaurants'}: ${todo.length} without a coordinate, across ${groups.size} cluster(s)`);
if (skipped.length) console.log(`  ${skipped.length} cluster(s) have no province centre to box, so cannot be asked: ${skipped.join(', ')}`);
console.log(`${work.length} cluster(s) this run · ${APPLY ? 'APPLY' : 'REPORT ONLY'}\n`);

/* ── the query ──────────────────────────────────────────────────────────── */
/* Tags are broad on purpose: a famous noodle shop can be amenity=restaurant,
   amenity=fast_food, or just shop=* with a name; a temple is amenity or
   historic; a waterfall is natural or waterway. */
const esc = (s) => String(s).replace(/[\\^$.|?*+()[\]{}"']/g, '\\$&');
/* `place` is deliberately absent. Thai villages and sub-districts are very
   often named after their temple, so asking for place=* and matching on an
   exact name would pin "วัดม่วง" on the VILLAGE of Wat Muang rather than the
   temple — a kilometre out and indistinguishable from a correct answer, since
   the name matches exactly and there is only one of them. */
const TAGS = ATTRACTIONS
  ? ['tourism', 'historic', 'natural', 'leisure', 'amenity', 'waterway', 'building']
  : ['amenity', 'shop', 'cuisine'];
/* Element types that carry a venue's name but are NOT the venue: the bus stop
   outside the temple, the islet named after the viewpoint, the protected-area
   relation whose centre is a kilometre of forest, the village named after its
   temple. Checked against the returned tags, which is why tags are cached.

   The order matters, and the first version of this got it backwards. It
   rejected anything carrying `landuse`, and `amenity=place_of_worship` +
   `landuse=religious` is precisely what a Thai temple looks like in OSM — so it
   threw away วัดป่าโมกวรวิหาร and วัดไชโยวรวิหาร, both correct. A venue tag
   therefore WINS: an element that is a venue stays a venue no matter what
   administrative tags sit alongside it. Only the handful of amenity values that
   are themselves the "named after" case are denied outright. */
const VENUE_DENY = new Set(['bus_station', 'bus_stop', 'school', 'college', 'parking',
  'parking_space', 'taxi', 'ferry_terminal', 'post_office', 'police', 'fuel']);
const IS_VENUE = (t) => !!(
  (t.amenity && !VENUE_DENY.has(t.amenity)) || t.tourism || t.historic
  || t.leisure || t.shop || t.natural || t.waterway || t.building);
const NOT_THE_VENUE = (t) => {
  if (t.amenity && VENUE_DENY.has(t.amenity)) return true;
  if (IS_VENUE(t)) return false;
  return !!(t.public_transport || t.highway || t.railway || t.aeroway
    || t.place || t.boundary || t.landuse);
};


/* EXACT EQUALITY, one statement per name per name-key. Not a regex.
   Two earlier shapes were measurably wrong:
     · one nwr[...] per TAG with a regex name — made Overpass repeat the same
       full regex scan 3–7× per request. 47 of 54 requests were refused and 50
       of 54 clusters came back empty.
     · one nwr[...] with a regex name and NO tag filter — one scan instead of
       seven, but an unindexed one: every named object in the box gets the regex
       applied, and Bangkok's box never finished at all.
   `["name"="X"]` is an index lookup, so 120 of them cost far less than one
   regex scan. It is case-sensitive, which costs nothing for Thai (no case) and
   is why name:en and name:th are asked for separately — OSM puts the Latin
   form in one of those about as often as in `name`.
   Type filtering moved to NOT_THE_VENUE, locally, against the cached tags. */
function overpassQL(bbox, names) {
  const stmts = [];
  for (const n of names) {
    const v = esc(n);
    for (const key of ['name', 'name:en', 'name:th', 'alt_name']) {
      stmts.push(`nwr["${key}"="${v}"](${bbox});`);
    }
  }
  return `[out:json][timeout:180];\n(\n${stmts.join('\n')}\n);\nout center tags;`;
}

/* Each attempt uses the next mirror, so three attempts means three different
   hosts before any waiting is repeated. */
async function fetchNames(bbox, names, attempt = 1) {
  const endpoint = ENDPOINTS[(attempt - 1) % ENDPOINTS.length];
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'User-Agent': UA, 'Content-Type': 'text/plain' },
      body: overpassQL(bbox, names),
      signal: AbortSignal.timeout(200_000),
    });
    if ([429, 503, 504].includes(res.status)) {
      if (attempt >= 6) { console.log(`   (refused by all mirrors: HTTP ${res.status})`); return null; }
      await sleep(8_000 * attempt);
      return fetchNames(bbox, names, attempt + 1);
    }
    if (!res.ok) {
      if (attempt >= 6) { console.log(`   (HTTP ${res.status} from ${new URL(endpoint).host})`); return null; }
      await sleep(4_000 * attempt);
      return fetchNames(bbox, names, attempt + 1);
    }
    return await res.json();
  } catch (e) {
    if (attempt >= 6) { console.log(`   (gave up after ${attempt} attempts across ${ENDPOINTS.length} mirrors: ${e.message})`); return null; }
    await sleep(8_000 * attempt);
    return fetchNames(bbox, names, attempt + 1);
  }
}

/* ── fetch, cached per cluster ──────────────────────────────────────────── */
const CACHE = path.join(ROOT, `_internal/.overpass-poi-${ATTRACTIONS ? 'attr' : 'eat'}-cache.json`);
const cache = readJson(CACHE, { version: 1, clusters: {} });

let queried = 0, cached = 0;
const unasked = [];   /* clusters whose requests failed — reported, never silently cached */
for (const cluster of work) {
  const rows = groups.get(cluster);
  if (cache.clusters[cluster]) { cached++; continue; }
  const c = centreOf(cluster);
  const bbox = [
    (c.lat - BOX_DEG).toFixed(3), (c.lng - BOX_DEG).toFixed(3),
    (c.lat + BOX_DEG).toFixed(3), (c.lng + BOX_DEG).toFixed(3),
  ].join(',');

  const allNames = [...new Set(rows.flatMap((r) => r.names).filter(askable))];
  const cands = [];
  let failed = 0, batches = 0;
  for (let i = 0; i < allNames.length; i += BATCH) {
    if (queried++) await sleep(PAUSE_MS);
    batches++;
    const j = await fetchNames(bbox, allNames.slice(i, i + BATCH));
    if (!j) { failed++; continue; }
    for (const el of j.elements || []) {
      const lat = el.lat ?? el.center?.lat, lng = el.lon ?? el.center?.lon;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const t = el.tags || {};
      /* Tags are cached so the "is this actually the venue?" filter can run
         locally, and be tightened later, without re-querying Overpass. */
      const keep = {};
      for (const k of ['amenity', 'tourism', 'historic', 'natural', 'leisure', 'shop',
        'waterway', 'building', 'place', 'public_transport', 'highway', 'railway',
        'aeroway', 'boundary', 'landuse', 'addr:district', 'addr:province', 'addr:city']) {
        if (t[k]) keep[k] = t[k];
      }
      for (const n of [t.name, t['name:en'], t['name:th'], t.alt_name, t.int_name]) {
        if (n) cands.push({ lat, lng, name: n, id: `${el.type}/${el.id}`, tags: keep });
      }
    }
  }
  console.log(`   ${cluster.padEnd(22)} ${String(rows.length).padStart(3)} to find · ${String(allNames.length).padStart(3)} name(s) asked · ${cands.length} candidate(s) back${failed ? `  ⚠ ${failed}/${batches} request(s) FAILED — not cached, re-run to retry` : ''}`);
  /* A cluster whose requests failed must NOT be cached. Caching it as empty
     would turn a transient Overpass outage into permanent zero coverage for
     that province, silently — and the run would report "done" having never
     asked. Overpass dropped several requests in the first full pass, so this
     is a real path, not a theoretical one. */
  if (failed) { unasked.push(cluster); continue; }
  cache.clusters[cluster] = { cands, at: new Date().toISOString() };
  fs.writeFileSync(CACHE, JSON.stringify(cache) + '\n');
}
console.log(`\nfetched ${queried} request(s) · ${cached} cluster(s) from cache`);
if (unasked.length) {
  console.log(`⚠ ${unasked.length} cluster(s) were NOT fully asked and are NOT cached — re-run this command to retry them:`);
  console.log(`   ${unasked.join(', ')}`);
}
console.log('');

/* ── match ──────────────────────────────────────────────────────────────── */
const accepted = [], rejected = [];
for (const cluster of work) {
  const rows = groups.get(cluster);
  const entry = cache.clusters[cluster];
  const centre = centreOf(cluster);
  if (!entry) { for (const r of rows) rejected.push({ ...r, why: 'no Overpass answer for this cluster' }); continue; }

  for (const r of rows) {
    const hits = [];
    let wrongType = null;
    for (const cand of entry.cands) {
      for (const ours of r.names) {
        const m = nameMatch(ours, cand.name);
        if (!m) continue;
        if (km(centre, cand) > MATCH_KM) continue;
        /* Right name, wrong thing. Tags are only present on caches built after
           this filter existed; an older cache entry has none, and then the name
           and the tag list asked for are all we have. */
        if (r.food && cand.tags && !SERVES_FOOD(cand.tags)) {
          wrongType = `"${cand.name}" ${cand.id} is tagged ${Object.entries(cand.tags).map(([k, v]) => `${k}=${v}`).join(' ')} — that does not serve food, and this block does`;
          continue;
        }
        if (cand.tags && NOT_THE_VENUE(cand.tags)) {
          wrongType = `"${cand.name}" ${cand.id} is tagged ${Object.entries(cand.tags).map(([k, v]) => `${k}=${v}`).join(' ')} — named after the venue, not the venue`;
          continue;
        }
        hits.push({ ...cand, how: m.how });
        break;
      }
    }
    const uniq = [...new Map(hits.map((h) => [h.id, h])).values()];
    if (!uniq.length) { rejected.push({ ...r, why: wrongType || 'no exact name match in OSM' }); continue; }
    /* PREFER A NODE. A node is a point somebody placed — the temple's main
       hall, the park headquarters, the waterfall itself. A way or relation
       returns `out center`, the centroid of its polygon, which for วัดม่วง is
       fine and for อุทยานแห่งชาติภูสระดอกบัว is 9 km of forest away from
       anywhere a visitor goes. Where OSM holds both for one place — 46 of the
       112 multi-element groups — the node is the better pin, and collapsing to
       it also removes the apparent ambiguity. */
    const nodes = uniq.filter((h) => h.id.startsWith('node/'));
    const pool = nodes.length ? nodes : uniq;
    if (pool.length > 1) {
      let spread = 0;
      for (const a of pool) for (const b of pool) spread = Math.max(spread, km(a, b) * 1000);
      if (spread > AMBIGUOUS_M) {
        rejected.push({ ...r, why: `${pool.length} places share this exact name, ${spread.toFixed(0)} m apart — ambiguous, refused`,
          saw: pool.map((h) => `${h.name} ${h.id}`).slice(0, 4) });
        continue;
      }
    }
    const best = pool[0];
    if (best.lat < 5.55 || best.lat > 20.55 || best.lng < 97.30 || best.lng > 105.70) {
      rejected.push({ ...r, why: 'candidate is outside Thailand' }); continue;
    }
    /* Never a province centre wearing a venue's name — the same 25 m identity
       test _internal/qa/check-coords.mjs applies at ship time. */
    if (Object.values(PROV).some((pc) => km(best, pc) < 0.025)) {
      rejected.push({ ...r, why: 'lands exactly on a province centroid' }); continue;
    }
    accepted.push({ ...r, to: { lat: best.lat, lng: best.lng }, osm: best.id, osmName: best.name, how: best.how });
  }
}

/* ── report ─────────────────────────────────────────────────────────────── */
console.log('─'.repeat(78));
console.log(`ACCEPTED ${accepted.length} · REFUSED ${rejected.length}`);
console.log('');
for (const a of accepted.slice(0, 40)) {
  console.log(`✓ ${a.id}`);
  console.log(`    ${a.to.lat.toFixed(5)},${a.to.lng.toFixed(5)}  ${a.osm} · ${a.how}`);
}
if (accepted.length > 40) console.log(`  … ${accepted.length - 40} more`);
const byWhy = rejected.reduce((m, r) => {
  const k = r.why.replace(/\d+/g, 'N').replace(/".*?"/g, '"…"');
  m[k] = (m[k] || 0) + 1; return m;
}, {});
console.log('\nrefusals by reason:');
for (const [k, n] of Object.entries(byWhy).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(5)}  ${k}`);
for (const r of rejected.filter((x) => x.saw).slice(0, 6)) {
  console.log(`  ? ${r.id}`);
  for (const c of r.saw) console.log(`      saw: ${c}`);
}

if (!APPLY) { console.log('\nREPORT ONLY — nothing written. Re-run with --apply.'); process.exit(0); }

/* ── write ──────────────────────────────────────────────────────────────── */
if (ATTRACTIONS) {
  const pcRaw = fs.existsSync(PLACE_COORDS) ? fs.readFileSync(PLACE_COORDS, 'utf8') : '';
  const store = readJson(PLACE_COORDS, {});
  for (const a of accepted) {
    store[`https://thailandaddict.com/${a.slug}`] = {
      lat: Number(a.to.lat.toFixed(6)), lng: Number(a.to.lng.toFixed(6)),
      prov: a.prov, via: 'overpass', precision: 'poi',
      osm: a.osm, osmName: a.osmName, q: `${a.names[0]} @ ${a.osm}`,
    };
  }
  /* indent 1 — the convention _internal/geocode-hotels.mjs writes this file
     with. Reformatting would bury the records that changed. */
  fs.writeFileSync(PLACE_COORDS, JSON.stringify(store, null, indentOf(pcRaw, 1)) + '\n');
  console.log(`\nwrote ${accepted.length} attraction coordinate(s) to _internal/place-coords.json`);
} else {
  /* Restaurant coordinates live inside the article, and every locale twin holds
     its own copy of the same blocks. Written by block INDEX, which is stable
     because the twins are structural translations of one source — and verified
     per file before writing, so a twin whose structure differs is skipped
     rather than guessed at. */
  const LOC = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];
  const per = {};
  let skipped = 0;
  const byFile = new Map();
  for (const a of accepted) {
    if (!byFile.has(a.file)) byFile.set(a.file, []);
    byFile.get(a.file).push(a);
  }
  for (const [file, list] of byFile) {
    for (const suffix of LOC) {
      const f = path.join(ROOT, `astro/src/content/articles${suffix}`, file);
      if (!fs.existsSync(f)) continue;
      const raw = fs.readFileSync(f, 'utf8');
      const j = readJson(f, null);
      if (!j || !Array.isArray(j.blocks)) continue;
      let touched = 0;
      for (const a of list) {
        const b = j.blocks[a.blockIndex];
        /* Index AND rank must both agree. 13 of 4,495 twin files are
           structurally out of step with their Thai source — a block added or
           removed on one side only — and in those files index i is a DIFFERENT
           venue. `kind` alone would not notice, because the neighbour is
           usually also a restaurant; `rank` is a stable per-article identifier
           and is not translated. Writing a coordinate onto the wrong venue in
           a language nobody on this team reads is exactly the kind of error
           that would never be found again. */
        if (!b || b.kind !== 'restaurant') continue;
        if (a.rank !== undefined && b.rank !== a.rank) { skipped++; continue; }
        if (Number.isFinite(b.lat) && Number.isFinite(b.lng)) continue;
        b.lat = Number(a.to.lat.toFixed(6));
        b.lng = Number(a.to.lng.toFixed(6));
        touched++;
      }
      if (!touched) continue;
      fs.writeFileSync(f, JSON.stringify(j, null, indentOf(raw)) + (raw.endsWith('\n') ? '\n' : ''));
      per[`articles${suffix}`] = (per[`articles${suffix}`] || 0) + touched;
    }
  }
  console.log('\napplied to content:');
  for (const [k, v] of Object.entries(per)) console.log(`  ${k.padEnd(14)} ${v}`);
}
console.log('\nNow: node _internal/gen-feeds.mjs && node _internal/gen-hubs.mjs');
console.log('Then: node _internal/qa/check-coords.mjs');
