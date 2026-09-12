#!/usr/bin/env node
/* =============================================================================
   check-coords.mjs — every coordinate that ships must be a real Thai place
   Phase 2 build gates · EXIT CODE 11

   WHY THIS EXISTS
   ---------------
   A wrong pin is worse than no pin. A missing map says "we don't know"; a map
   with a hotel dropped in the Gulf of Thailand says "we know, and we are
   wrong", and the reader has no way to tell which pins to distrust. Maps now
   ship on ~1,300 pages (province hubs, roundups, reviews), all driven by
   machine-written coordinate stores that no human reads end to end. That is
   exactly the kind of data that rots silently.

   Nine classes of defect. Every one of them has actually been found in this
   repo, most of them by the first run of this file:

     1  malformed          — a half-pair (lat, no lng) renders as 0, and a
                             string "13.7" is not a number to Leaflet.
     2  zero/null island   — 0,0 is what a failed parse looks like, and it is a
                             valid-looking float pair, so nothing downstream
                             notices.
     3  outside Thailand   — a geocoder that searched globally and ranked badly.
     4  swapped lat/lng    — the classic. In Thailand it is self-announcing:
                             lat≈100 can never be Thai, so rule 3 catches it —
                             but we name it explicitly so the fix is obvious
                             instead of the message being a puzzle.
     5  centroid stand-in  — a province centre used as a venue position. This is
                             guessing with extra steps. Found one: a Trat
                             chicken-rice shop sitting exactly on the Trat
                             province centre.
     6  wrong province     — the pin is in Thailand but not in the province the
                             page claims. Distance from the province's town
                             centre, with a per-province limit.
     7  twin drift         — an EN/zh/ru/... twin whose coordinates disagree
                             with the Thai source of truth. Same place, two
                             positions, and the reader sees whichever locale
                             they opened. 5,488 twins are cross-checked.
     8  derived-artifact   — astro/src/data/review-coords.json is generated from
        disagreement         the content JSON. If it disagrees, something wrote
                             one without the other and the map is stale.
     9  not a building     — two DIFFERENT hotels at one position, or a
                             coordinate that came from a road-only lookup. Both
                             mean the answer was an area, not an address. 238 of
                             those were shipping pins.

   PRINCIPLE
   ---------
   Reject, never substitute. When a coordinate cannot be verified the record
   ships without one and the page shows a Google Maps *link* to the address
   instead of a pin — the map gate (≥60% geocoded) then simply declines to
   render. Nothing in this repo may invent a position to fill a hole.

   Usage:  node _internal/qa/check-coords.mjs [--list] [--warnings]
           exit 0 = OK · exit 11 = a bad coordinate would ship
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SHOW_ALL = process.argv.includes('--list');
const SHOW_WARN = SHOW_ALL || process.argv.includes('--warnings');

/* Thailand's true extent, plus ~5 km of slack so a coastal resort on a sandbar
   or a border town is not a false positive:
     lat  5.61 Betong (Yala)        → 20.47 Mae Sai (Chiang Rai)
     lng 97.34 Mae Hong Son border  → 105.64 Khong Chiam (Ubon)
   Deliberately NOT widened to "Southeast Asia". A pin in Laos or Malaysia is a
   defect on a Thailand site even though it is only 30 km out.

   KNOWN LIMIT, measured: a box plus a radius cannot express a border. Vientiane
   (18.0, 102.6) passes both tests — it is inside the box and 25 km from the
   Nong Khai centre, because it genuinely is. Open sea IS caught (the Gulf is
   inside the box but far from every province centre). Closing the border gap
   needs point-in-polygon against Thailand's admin boundary (OSM relation
   2067731); until then the geocoders' own `countrycodes=th` is what keeps
   machine-written coordinates on the right side of the Mekong, and
   hand-entered ones in the border provinces are unguarded. */
const BBOX = { latMin: 5.55, latMax: 20.55, lngMin: 97.30, lngMax: 105.70 };

/* A venue AT a province centroid is the centroid wearing a venue's name. 25 m
   is "the same number, rounded" — not "nearby", which would condemn every
   hotel in every old town (see the note in checkPoint). */
const CENTROID_EQ_KM = 0.025;
/* Near a centroid AND only two decimals: hand-typed. Warned, not blocked. */
const CENTROID_SUSPECT_KM = 1.5;
/* "Wrong province" is measured as distance from the province's town centre,
   because a town centre is what _internal/province-coords.json holds. 130 km
   covers a typical Thai province with room to spare — but Thailand has a
   handful of very long ones where a correct coordinate legitimately sits
   further out, and a gate that cries wolf on correct data gets switched off.
   Every number below is the real capital-to-farthest-district distance rounded
   up to the next 10 km, and the two that this gate actually found on first run
   (Mon Bridge in Sangkhlaburi at 171 km, still Kanchanaburi; I-Talay in Bang
   Saphan at 164 km, still Prachuap Khiri Khan) are why the table exists.
   Islands are already handled by CLUSTER_PROVINCE below, not by widening. */
const MAX_PROVINCE_KM = 130;
const PROVINCE_KM = {
  kanchanaburi: 190,          /* Sangkhlaburi / Thong Pha Phum, up the Myanmar border */
  'prachuap-khiri-khan': 180, /* Hua Hin in the north, Bang Saphan Noi in the south */
  'chiang-mai': 200,          /* Mae Ai to Omkoi */
  tak: 180,                   /* Umphang, and Thi Lo Su beyond it */
  'mae-hong-son': 180,        /* Mae Sariang */
  'surat-thani': 160,         /* Koh Tao, 120 km offshore */
  'nakhon-ratchasima': 160,   /* the widest Isan province, east to west */
  nan: 150, 'nakhon-si-thammarat': 150, ranong: 150,
  'chiang-rai': 140, 'ubon-ratchathani': 140, loei: 140,
};

const R = 6371;
const rad = (d) => (d * Math.PI) / 180;
function km(a, b) {
  const dLa = rad(b.lat - a.lat), dLo = rad(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const inBox = (lat, lng) => lat >= BBOX.latMin && lat <= BBOX.latMax && lng >= BBOX.lngMin && lng <= BBOX.lngMax;
const jread = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };

const failures = [];   /* blocks the push */
const warnings = [];   /* printed, counted, does not block */
const fail = (kind, where, msg, fix) => failures.push({ kind, where, msg, fix });
const warn = (kind, where, msg) => warnings.push({ kind, where, msg });

/* ---------------------------------------------------------------------------
   The province centroids every other check is measured against. These ARE
   centroids — that is their job — so they are exempt from rule 4 and checked
   only for being inside Thailand.
   ------------------------------------------------------------------------ */
const PROV = jread(path.join(ROOT, '_internal/province-coords.json')) || {};
for (const [slug, c] of Object.entries(PROV)) {
  if (!Number.isFinite(c?.lat) || !Number.isFinite(c?.lng)) {
    fail('malformed', '_internal/province-coords.json', `${slug}: ${JSON.stringify(c)}`, 'a province centroid must be {lat,lng} numbers');
  } else if (!inBox(c.lat, c.lng)) {
    fail('outside-thailand', '_internal/province-coords.json', `${slug}: ${c.lat},${c.lng}`, 'centroid is not in Thailand');
  }
}

/* Sub-destinations are their own clusters but sit inside a parent province, so
   "wrong province" has to be measured against the parent's centroid. Kept
   identical in spirit to CLUSTER_PROVINCE in _internal/geocode-hotels.mjs. */
const CLUSTER_PROVINCE = {
  pattaya: 'chonburi', 'koh-larn': 'chonburi', samui: 'surat-thani',
  'koh-phangan': 'surat-thani', 'koh-tao': 'surat-thani', 'khao-sok': 'surat-thani',
  'koh-chang': 'trat', 'koh-kood': 'trat', 'koh-mak': 'trat',
  'koh-lipe': 'satun', 'hat-yai': 'songkhla', pai: 'mae-hong-son',
  'khao-yai': 'nakhon-ratchasima', huahin: 'prachuap-khiri-khan',
  railay: 'krabi', 'koh-lanta': 'krabi', 'koh-phi-phi': 'krabi',
  'koh-yao': 'phang-nga', 'khao-lak': 'phang-nga',
};
const centroidOf = (cluster) => PROV[cluster] || PROV[CLUSTER_PROVINCE[cluster]] || null;

/* Is this point within reach of ANY province centre? The fallback test for
   coordinates whose page names no single province. */
const PROV_LIST = Object.values(PROV).filter((c) => Number.isFinite(c?.lat));
function nearAnyProvince(lat, lng) {
  for (const c of PROV_LIST) if (km({ lat, lng }, c) <= MAX_PROVINCE_KM) return true;
  return false;
}

/* Thai province name → slug, read from _internal/province-data/, the same
   source _internal/geocode-hotels.mjs uses. place-coords.json stores the Thai
   name ("ปราจีนบุรี"), and without this the province check would quietly not
   run on any attraction. */
let THAI_SLUG = null;
function thaiToSlug(th) {
  if (!THAI_SLUG) {
    THAI_SLUG = {};
    const dir = path.join(ROOT, '_internal/province-data');
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.json')) continue;
        const j = jread(path.join(dir, f));
        if (j && j.th) THAI_SLUG[String(j.th).trim()] = f.replace(/\.json$/, '');
      }
    }
  }
  return THAI_SLUG[String(th || '').trim()] || null;
}

/* ---------------------------------------------------------------------------
   One coordinate, all seven rules. `cluster` may be null (then rule 5 is
   skipped rather than guessed at).
   ------------------------------------------------------------------------ */
function checkPoint({ lat, lng, id, where, cluster, allowCentroid }) {
  if (lat === undefined && lng === undefined) return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    fail('malformed', where, `${id}: lat=${JSON.stringify(lat)} lng=${JSON.stringify(lng)}`,
      'both must be finite numbers, or BOTH must be absent — a half-pair renders as 0');
    return false;
  }
  if (lat === 0 || lng === 0) {
    fail('null-island', where, `${id}: ${lat},${lng}`,
      'delete the coordinate — a failed lookup must leave the field absent, not 0');
    return false;
  }
  if (!inBox(lat, lng)) {
    /* Name the swap explicitly when swapping would fix it. */
    if (inBox(lng, lat)) {
      fail('swapped', where, `${id}: ${lat},${lng}`,
        `lat and lng are the wrong way round — should be ${lng},${lat}`);
    } else {
      fail('outside-thailand', where, `${id}: ${lat},${lng}`,
        `outside Thailand (lat ${BBOX.latMin}–${BBOX.latMax}, lng ${BBOX.lngMin}–${BBOX.lngMax})`);
    }
    return false;
  }
  if (!allowCentroid) {
    for (const [slug, c] of Object.entries(PROV)) {
      const d = km({ lat, lng }, c);
      /* IDENTICAL to a centroid, not merely near one. The first draft of this
         rule failed anything within 600 m and flagged 509 records — because
         these "centroids" are city centres, and city centres are exactly where
         real hotels and real temples are. Phra Pathom Chedi sits 43 m from the
         Nakhon Pathom value for the excellent reason that the value was set
         from the chedi. A substituted centroid is a COPY of the centroid, so
         copy-detection is the test that has no false positives. */
      if (d < CENTROID_EQ_KM) {
        fail('centroid-standin', where, `${id}: ${lat},${lng}`,
          `identical to the ${slug} province centroid (${(d * 1000).toFixed(0)} m) — a province centre is not a position. Delete the coordinate; the page will show a Maps link instead.`);
        return false;
      }
      /* Two decimals and near a centroid is the signature of someone typing a
         province centre in by hand. Worth a look, not worth blocking. */
      if (d < CENTROID_SUSPECT_KM && /^-?\d+(\.\d{1,2})?$/.test(String(lat)) && /^-?\d+(\.\d{1,2})?$/.test(String(lng))) {
        warn('low-precision-near-centroid', where, `${id}: ${lat},${lng} — ${(d * 1000).toFixed(0)} m from the ${slug} centroid, and only 2 dp`);
      }
    }
  }
  if (cluster) {
    const c = centroidOf(cluster);
    if (c) {
      const prov = PROV[cluster] ? cluster : CLUSTER_PROVINCE[cluster];
      const limit = PROVINCE_KM[prov] || MAX_PROVINCE_KM;
      const d = km({ lat, lng }, c);
      if (d > limit) {
        fail('wrong-province', where, `${id}: ${lat},${lng}`,
          `${d.toFixed(0)} km from ${cluster} (limit ${limit} km) — the pin is in the wrong province`);
        return false;
      }
    } else if (!nearAnyProvince(lat, lng)) {
      /* National-scope articles (cluster "thailand" — the Michelin and 50 Best
         roundups, 2,372 restaurant coordinates) have no single province to be
         measured against, and skipping them left the weakest test on the
         largest set. Thailand's bbox includes a lot of the Gulf, so "inside
         the box" does not mean "on land in a province". Requiring the point to
         be within MAX_PROVINCE_KM of SOME province centre is weaker than a
         named-province check but it is not nothing: it catches the open sea,
         and it is the strongest statement the data supports. */
      fail('nowhere-near-a-province', where, `${id}: ${lat},${lng}`,
        `inside Thailand's bounding box but more than ${MAX_PROVINCE_KM} km from every province centre — open sea, or a swapped digit`);
      return false;
    }
  } else if (!nearAnyProvince(lat, lng)) {
    fail('nowhere-near-a-province', where, `${id}: ${lat},${lng}`,
      `inside Thailand's bounding box but more than ${MAX_PROVINCE_KM} km from every province centre`);
    return false;
  }
  return true;
}

/* ── 1. the coordinate stores ───────────────────────────────────────────── */
const STORES = [
  { file: '_internal/hotel-coords.json', keyed: 'slug' },
  { file: '_internal/place-coords.json', keyed: 'url' },
  { file: '_internal/attraction-coords.json', keyed: 'url', optional: true },
];
let storeOk = 0, storeEmpty = 0;
for (const s of STORES) {
  const p = path.join(ROOT, s.file);
  if (!fs.existsSync(p)) { if (!s.optional) fail('missing-store', s.file, 'file not found', 'the geocoder writes this; do not delete it'); continue; }
  const j = jread(p);
  if (!j || typeof j !== 'object') { fail('malformed', s.file, 'not a JSON object', 'restore from git'); continue; }
  for (const [k, v] of Object.entries(j)) {
    /* A recorded miss is the CORRECT state for a place OSM does not know.
       These entries are the "reject, never substitute" rule working. */
    if (!v || (v.lat === undefined && v.lng === undefined) || v.lat === null) { storeEmpty++; continue; }
    const id = s.keyed === 'url' ? String(k).replace('https://thailandaddict.com/', '') : k;
    /* v.prov is a slug in hotel-coords.json and a THAI province NAME in
       place-coords.json, so the Thai names are translated rather than dropped —
       leaving them untranslated would silently skip the province check on all
       841 attractions, which is the half of the data with the weakest sourcing
       and therefore the half that most needs it. */
    const cluster = typeof v.prov === 'string'
      ? (/^[a-z-]+$/.test(v.prov) ? v.prov : thaiToSlug(v.prov))
      : null;
    if (checkPoint({ lat: v.lat, lng: v.lng, id, where: s.file, cluster })) storeOk++;
  }
}

/* ── 2. content JSON, every locale ──────────────────────────────────────── */
const LOCALES = ['', '-en', '-zh', '-ru', '-ko', '-ja', '-hi', '-he', '-ar'];
const CONTENT = path.join(ROOT, 'astro/src/content');

/* Thai source of truth, read first so the twins have something to drift from. */
const truth = new Map();   /* `${kind}:${slug}` → "lat,lng" */
const truthName = new Map();   /* same key → the venue name, for the duplicate-position test */
const key5 = (lat, lng) => `${lat.toFixed(5)},${lng.toFixed(5)}`;

let contentOk = 0, twinsChecked = 0;
for (const kind of ['reviews', 'articles', 'roundups']) {
  for (const suffix of LOCALES) {
    const dir = path.join(CONTENT, kind + suffix);
    if (!fs.existsSync(dir)) continue;
    const isTruth = suffix === '';
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json')) continue;
      const raw = fs.readFileSync(path.join(dir, f), 'utf8');
      if (!raw.includes('"lat"')) continue;
      const j = JSON.parse(raw);
      const slug = j.slug || f.replace(/\.json$/, '');
      const where = `astro/src/content/${kind}${suffix}`;
      const cluster = typeof j.cluster === 'string' ? j.cluster : null;

      /* Every {lat,lng} anywhere in the document — top-level on reviews,
         blocks[].{lat,lng} on restaurant-ranking articles. Walking instead of
         naming the paths is what stops a new block type shipping unchecked. */
      const points = [];
      (function walk(o, p) {
        if (!o || typeof o !== 'object') return;
        if ('lat' in o || 'lng' in o) points.push({ at: p || '(root)', lat: o.lat, lng: o.lng, name: o.name });
        for (const k of Object.keys(o)) walk(o[k], p ? `${p}.${k}` : k);
      })(j, '');

      for (const pt of points) {
        const id = pt.at === '(root)' ? slug : `${slug} › ${pt.name || pt.at}`;
        const good = checkPoint({ lat: pt.lat, lng: pt.lng, id, where, cluster });
        if (!good) continue;
        contentOk++;
        const tk = `${kind}:${slug}:${pt.at}`;
        if (isTruth) { truth.set(tk, key5(pt.lat, pt.lng)); truthName.set(tk, pt.name || j.name || slug); }
        else {
          const want = truth.get(tk);
          if (want) {
            twinsChecked++;
            const got = key5(pt.lat, pt.lng);
            /* 5 dp ≈ 1 m. Twins are copies, so any disagreement at all means
               one of them was edited alone. */
            if (want !== got) {
              fail('twin-drift', where, `${id}: ${got}`,
                `the Thai source says ${want} — same place, two positions. Copy the Thai value.`);
            }
          }
        }
      }
    }
  }
}

/* ── 3. the derived artifact the maps actually read ─────────────────────── */
const RC = path.join(ROOT, 'astro/src/data/review-coords.json');
let derivedOk = 0;
if (!fs.existsSync(RC)) {
  fail('missing-store', 'astro/src/data/review-coords.json', 'file not found',
    'run `node _internal/gen-feeds.mjs` — RoundupLayout imports this and the build fails without it');
} else {
  const j = jread(RC) || {};
  for (const [slug, v] of Object.entries(j)) {
    if (!Array.isArray(v) || v.length !== 2) {
      fail('malformed', 'astro/src/data/review-coords.json', `${slug}: ${JSON.stringify(v)}`, 'must be [lat, lng]');
      continue;
    }
    const [lat, lng] = v;
    if (!checkPoint({ lat, lng, id: slug, where: 'astro/src/data/review-coords.json', cluster: null })) continue;
    derivedOk++;
    /* It is generated from the content JSON, so it must agree with it.
       Compared at 4 dp (~11 m), not 5: gen-feeds rounds with toFixed and this
       gate rounds independently, and the two disagree on exact halves. Six
       records differ by one unit in the fifth decimal — one metre — which is
       rounding, not staleness. A stale artifact is wrong by streets. */
    const want = truth.get(`reviews:${slug}:(root)`);
    if (want) {
      const [wLat, wLng] = want.split(',').map(Number);
      /* Numeric tolerance, not rounded-string equality: rounding at any fixed
         precision has a boundary, and two records land exactly on it (one unit
         in the fifth decimal — one metre). A genuinely stale artifact is wrong
         by streets, so 2 m of slack costs nothing and removes the false alarm. */
      if (Math.abs(wLat - lat) > 2e-5 || Math.abs(wLng - lng) > 2e-5) {
        fail('derived-stale', 'astro/src/data/review-coords.json', `${slug}: ${key5(lat, lng)}`,
          `content says ${want} — re-run \`node _internal/gen-feeds.mjs\``);
      }
    }
  }
}

/* ── 4. two DIFFERENT hotels, one position ──────────────────────────────── */
/* Two buildings cannot share a rooftop point to one metre, so an identical
   position means the lookup answered with something that is not a building —
   a road, a soi, a district. That is the substitution this whole gate exists
   to refuse.
   The complication is that this repo knowingly carries the same hotel under
   more than one slug (8 pairs, listed in _internal/SESSION-END-2026-07-18.md,
   plus near-misses like chala-number-6 / chala-number6 / chalanumber6). Those
   SHOULD share a position — it is one building. So group by position, then
   collapse by name: only a group holding two or more genuinely different
   hotels is a defect. */
const norm = (s) => String(s || '').toLowerCase()
  .replace(/[^a-z0-9฀-๿]+/g, '')
  .replace(/^(the|hotel|resort)+/, '')
  .replace(/(hotel|resort|boutique|spa|house|and|thailand)/g, '');
const seen = new Map();
for (const [k, v] of truth) {
  if (!k.startsWith('reviews:') || !k.endsWith(':(root)')) continue;
  const slug = k.split(':')[1];
  if (!seen.has(v)) seen.set(v, []);
  seen.get(v).push({ slug, name: truthName.get(k) || slug });
}
/* Same building or different buildings? Exact normalized equality is not
   enough: "Mayflower Grande Hotel Chiang Mai (Nimman)" and "Mayflower Grande
   Hotel Chiang Mai" are one hotel under two slugs, and normalise to different
   strings. Three signals, any of which settles it:
     · identical normalized names
     · one normalized name or slug is a PREFIX of the other (the shape the known
       duplicate slugs take — see _internal/SESSION-END-2026-07-18.md)
     · both records name the same OSM element, which is proof, not inference
   Prefix and not substring on purpose: "Lee Gardens" and "Lee Gardens Plaza"
   are two real Hat Yai hotels sharing a brand, and if they ever share a
   coordinate that IS the defect this rule is looking for. */
const HC_OSM = (() => {
  const m = new Map();
  const j = jread(path.join(ROOT, '_internal/hotel-coords.json')) || {};
  for (const [slug, v] of Object.entries(j)) if (v && v.osm) m.set(slug, v.osm);
  return m;
})();
function sameBuilding(a, b) {
  const [na, nb] = [norm(a.name), norm(b.name)];
  if (na && nb && (na === nb || na.startsWith(nb) || nb.startsWith(na))) return true;
  if (a.slug.startsWith(b.slug) || b.slug.startsWith(a.slug)) return true;
  const [oa, ob] = [HC_OSM.get(a.slug), HC_OSM.get(b.slug)];
  return !!(oa && ob && oa === ob);
}
for (const [pos, rows] of seen) {
  if (rows.length < 2) continue;
  const distinct = [];
  for (const r of rows) if (!distinct.some((d) => sameBuilding(d, r))) distinct.push(r);
  if (distinct.length < 2) {
    if (SHOW_WARN) warn('same-hotel-many-slugs', 'astro/src/content/reviews', `${rows.map((r) => r.slug).join(' + ')} share ${pos} — one building, several slugs, so this is fine`);
    continue;
  }
  fail('duplicate-position', 'astro/src/content/reviews', `${distinct.length} different hotels all at ${pos}`,
    `${distinct.slice(0, 4).map((r) => r.slug).join(', ')}${distinct.length > 4 ? ', …' : ''} — this position is a road or an area, not a building. Delete it from all of them.`);
}

/* ── 5. a road is not an address ─────────────────────────────────────────── */
/* _internal/geocode-hotels.mjs records precision:'road' when only the street
   matched — right road, right district, not the doorstep. That is honest
   bookkeeping and worth keeping in the store, but it must not become a PIN:
   on a map a road-centre pin claims a doorstep it does not know, and stacks
   every hotel on that street into one dot. 207 such records exist. */
const hc = jread(path.join(ROOT, '_internal/hotel-coords.json')) || {};

for (const [slug, v] of Object.entries(hc)) {
  if (!v || v.precision !== 'road' || !Number.isFinite(v.lat)) continue;
  const shipped = truth.get(`reviews:${slug}:(root)`);
  if (!shipped) continue;
  const [sLat, sLng] = shipped.split(',').map(Number);
  if (km({ lat: sLat, lng: sLng }, { lat: v.lat, lng: v.lng }) < 0.05) {

    fail('road-level-pin', 'astro/src/content/reviews', `${slug}: ${shipped}`,
      `this came from a road-only lookup ("${v.q}") — it is the street's midpoint, not the hotel. Delete the coordinate; ReviewLayout falls back to a Maps link on the address.`);
  }
}

/* ── report ─────────────────────────────────────────────────────────────── */
console.log(`check-coords: ${storeOk} store · ${contentOk} content (${twinsChecked} twins cross-checked) · ${derivedOk} shipped map points`);
console.log(`              ${storeEmpty} recorded misses left WITHOUT a coordinate — correct: we do not invent positions`);

if (warnings.length) {
  const byKind = warnings.reduce((m, w) => ((m[w.kind] = (m[w.kind] || 0) + 1), m), {});
  console.log('');
  console.log(`  NOTE: ${warnings.length} warning(s) — ${Object.entries(byKind).map(([k, n]) => `${k} ${n}`).join(' · ')}`);
  for (const w of (SHOW_ALL ? warnings : warnings.slice(0, 12))) console.log(`    ${w.kind}  ${w.where}  ${w.msg}`);
  if (!SHOW_ALL && warnings.length > 12) console.log(`    … ${warnings.length - 12} more (--list)`);
}

if (failures.length) {
  const byKind = failures.reduce((m, f) => ((m[f.kind] = (m[f.kind] || 0) + 1), m), {});
  console.error('');
  console.error('─'.repeat(78));
  console.error(`FAIL: ${failures.length} bad coordinate(s) would ship — ${Object.entries(byKind).map(([k, n]) => `${k} ${n}`).join(' · ')}`);
  console.error('');
  for (const f of (SHOW_ALL ? failures : failures.slice(0, 40))) {
    console.error(`  [${f.kind}] ${f.where}`);
    console.error(`      ${f.msg}`);
    console.error(`      → ${f.fix}`);
  }
  if (!SHOW_ALL && failures.length > 40) console.error(`  … ${failures.length - 40} more (--list)`);
  console.error('─'.repeat(78));
  console.error('check-coords: a wrong pin is worse than no pin. Delete it or fix it — do NOT push.');
  process.exit(11);
}
console.log('check-coords: ALL PASS');
