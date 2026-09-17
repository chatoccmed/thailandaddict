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

/* The OSM gate does NOT verify that the matched hotel is the right hotel, and
   assuming it did was a mistake. It asks whether a coordinate is a real place
   consistent with the address it was given - so when the feed hands back a
   DIFFERENT hotel of a similar name, the gate happily confirms that other
   hotel's position. BaanKong Hostel in Lamphun matched "OYO 75469 Baan Kong
   Hostel" in Khao Lak and passed at 7 m from a road, 1,087 km from Lamphun.
   Dusita Residence in Phetchabun matched a Bangkok hotel of exactly that name
   and passed at 55 m from a road, 298 km away.

   Identity is what the province test decides, and it is cheap: the review says
   which province it is in, so a candidate that lands outside it is a different
   hotel however well its coordinate validates. The limits are check-coords'
   own, because a gate that disagrees with the gate downstream is worse than no
   gate. */
const PROV_CENTRES = readJson(path.join(ROOT, '_internal/province-coords.json'), {});
const PROVINCE_KM = {
  kanchanaburi: 190, 'prachuap-khiri-khan': 180, 'chiang-mai': 200, tak: 180,
  'mae-hong-son': 180, 'surat-thani': 160, 'nakhon-ratchasima': 160,
  nan: 150, 'nakhon-si-thammarat': 150, ranong: 150,
  'chiang-rai': 140, 'ubon-ratchathani': 140, loei: 140,
};
const MAX_PROVINCE_KM = 130;
const kmBetween = (a, b) => {
  const R = 6371, rad = (d) => (d * Math.PI) / 180;
  const dLa = rad(b.lat - a.lat), dLo = rad(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
function wrongProvince(prov, lat, lng) {
  const c = PROV_CENTRES[prov];
  if (!c || !Number.isFinite(c.lat)) return null;         /* unknown province: cannot judge */
  const d = kmBetween({ lat, lng }, c), limit = PROVINCE_KM[prov] || MAX_PROVINCE_KM;
  return d > limit ? Math.round(d) + ' km from ' + prov + ' (limit ' + limit + ' km) — this is a different hotel of a similar name' : null;
}

const ALLOW = new Set(DISTRICT ? ['road', 'area', 'district'] : ['road', 'area']);
const counts = {};
const take = [];
const ownerReversals = [];
const rejectedProvince = [];
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
  /* Many of these hotels HAD a pin that was deleted on evidence - 41 of the
     first 241 did. Restoring them is usually right rather than wrong: those
     pins were deleted because Nominatim had answered with a road or the wrong
     building, and the Agoda point is a different source that has just passed
     the same gate. Craftsman Bangkok is the clearest case - the deleted pin sat
     7.3 km from its road in the wrong district, and the Agoda point lands 59 m
     from ซอยพหลโยธิน 13 inside the district its address names.
     The owner ruled on 2026-09-17, asked with Craftsman as the concrete case,
     that a validated coordinate from a different source DOES supersede an
     earlier deletion: the decision had been "this pin is wrong, remove it", not
     "this hotel may never have a pin". So restorations proceed - but one the
     owner decided personally is still named in the output rather than folded
     silently into a count, because a person should be able to see their own
     decision being revisited. */
  const prior = store[r.slug];
  const priorWhy = prior && typeof prior.why === 'string' ? prior.why : '';
  const wasDeleted = /pin deleted/i.test(priorWhy);
  const ownerDecided = wasDeleted && /owner decision/i.test(priorWhy);
  const provSlug = r.cluster || m.cluster || null;
  const wrong = provSlug ? wrongProvince(provSlug, Number(m.feed.lat), Number(m.feed.lng)) : null;
  if (wrong) { rejectedProvince.push({ slug: r.slug, ours: m.name, feed: m.feed.name, city: m.feed.city, why: wrong, tier: t.tier }); continue; }
  if (ownerReversals && ownerDecided) ownerReversals.push({ slug: r.slug, tier: t.tier, why: t.why });
  if (ALLOW.has(t.tier)) take.push({ r, m, tier: t.tier, why: t.why, wasDeleted, priorWhy });
}

/* One feed hotel cannot be two of our hotels. Both IMPACT Muang Thong Thani
   properties matched the same feed row and were written to the same point,
   which check-coords rejects as a duplicate position - correctly, since a
   position two venues share is a complex or a road, not either building.
   Neither can be preferred on the evidence, so both are dropped and listed. */
const byFeedId = new Map();
/* Seed with feed ids already used by an earlier run, or the clash is invisible
   whenever the two reviews are imported in different batches - which is exactly
   how the two IMPACT Muang Thong Thani properties ended up sharing a point:
   one arrived in round 1, the other in round 2, and a per-run check saw one
   of each. */
for (const [slug, v] of Object.entries(store)) {
  if (v && v.agodaId && Number.isFinite(v.lat)) byFeedId.set(String(v.agodaId), [{ r: { slug }, m: { feed: { id: v.agodaId, name: v.agodaName || '' } }, alreadyStored: true }]);
}
for (const t of take) {
  const id = String(t.m.feed.id);
  if (!byFeedId.has(id)) byFeedId.set(id, []);
  byFeedId.get(id).push(t);
}
const contested = [...byFeedId.values()].filter((g) => g.length > 1);
/* Only the new claimants are dropped. An entry already in the store was written
   by an earlier run and has passed check-coords where it stands; re-litigating
   it here would mean this run silently deleting a shipped pin. */
const contestedSlugs = new Set(contested.flat().filter((t) => !t.alreadyStored).map((t) => t.r.slug));
if (contestedSlugs.size) {
  const kept = take.filter((t) => !contestedSlugs.has(t.r.slug));
  take.length = 0; take.push(...kept);
}

console.log('evidence rows ' + ev.length + ' · tiers: ' + Object.keys(counts).map((k) => k + ' ' + counts[k]).join(' · '));
if (rejectedProvince.length) {
  console.log('  REJECTED, wrong province (a different hotel of a similar name): ' + rejectedProvince.length);
  for (const x of rejectedProvince) console.log('    ' + x.slug.replace(/^review-/, '').slice(0, 44).padEnd(44) + ' feed "' + String(x.feed).slice(0, 34) + '" in ' + x.city + ' — ' + x.why.slice(0, 46));
}
for (const g of contested) {
  console.log('  REJECTED, ' + g.length + ' reviews claim one feed hotel (' + String(g[0].m.feed.name).slice(0, 40) + '):');
  for (const t of g) console.log('    ' + t.r.slug.replace(/^review-/, ''));
}
if (alreadyPinned) console.log('  skipped, already pinned: ' + alreadyPinned);
if (gone) console.log('  skipped, review file gone: ' + gone);
if (noFeed) console.log('  skipped, no feed row: ' + noFeed);
const restoring = take.filter((t) => t.wasDeleted).length;
if (restoring) console.log('  of these, ' + restoring + ' restore a pin that had been deleted on evidence (a different, wrong coordinate)');
if (ownerReversals.length) {
  console.log('\n  REVERSING A DELETION THE OWNER DECIDED (approved 2026-09-17, named here so it stays visible):');
  for (const h of ownerReversals) console.log('    ' + h.slug.replace(/^review-/, '') + ' — validates ' + h.tier + ': ' + h.why.slice(0, 70));
}
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
  const prev = store[t.r.slug] || {};
  /* prov must be written. check-coords measures "wrong province" from the
     province's town centre with a per-province allowance (Kanchanaburi 190 km,
     because Sangkhlaburi really is that far out), but ONLY when the row names a
     province; without one it falls back to "within 130 km of SOME province
     centre", which is far weaker. The first run of this importer wrote no prov
     at all - street-evidence-hotels did not carry cluster through - so all 241
     pins skipped the real province check, and only Kingfisher House in
     Sangkhlaburi was remote enough to trip even the fallback. It was a correct
     pin failing a weak test, masking the fact that the strong test never ran. */
  const prov = t.r.cluster || t.m.cluster || null;
  /* A row that recorded "pin deleted ..." must not keep saying so while holding
     a live coordinate - that is a record contradicting itself. The deletion note
     moves to wasWhy, where the history stays readable, and why states plainly
     what replaced it. */
  const why = t.wasDeleted
    ? 'pin restored ' + new Date().toISOString().slice(0, 10) + ' from the Agoda feed, validated ' + t.tier + ': ' + t.why + ' — supersedes the deletion recorded in wasWhy, which removed a different and wrong coordinate'
    : prev.why;
  store[t.r.slug] = {
    ...prev,
    lat, lng,
    ...(prov ? { prov } : {}),
    via: 'agoda',
    precision: 'poi',
    agodaId: t.m.feed.id,
    agodaName: t.m.feed.name,
    q: t.m.name + ' @ agoda:' + t.m.feed.id + ' (' + t.m.tier + ') — validated ' + t.tier + ': ' + t.why,
    ...(t.wasDeleted ? { wasWhy: t.priorWhy, why } : (why === undefined ? {} : { why })),
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
