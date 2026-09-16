/* Evidence for the hotel pins street-audit-nostore.mjs flagged. Read-only.
   For each flagged row, the roads the review's own address names (the soi
   first, then the main road) are checked two independent ways:
     · Overpass: every named highway within 300 m of the pin — does one of them
       carry the address's road (same base name, same soi number), and how far
       from the pin does that road actually run?
     · Nominatim: the address's road searched inside a box ±0.05° around the
       pin (road objects with geometry, a numbered soi must carry the number)
       — how far is the pin from the nearest one found?
   plus the pin's OSM sub-district / district (Overpass is_in, admin 8 / 6).
     DROP-CANDIDATE (road)   no highway within 300 m carries the address's soi
                             or road, and Nominatim finds that road > 300 m away
     REVIEW (area)           no road evidence either way, and the pin lies in an
                             admin-8 area the address does not name
     keep (near road)        a highway carrying the address's road runs within
                             120 m of the pin — measured, not merely present
     keep (road far)         a highway carries the address's road but runs
                             farther off than that: adjacency, not evidence
     UNKNOWN (no data)       no admin polygon and no road either — nothing was
                             tested, which is not the same as nothing is wrong
     keep                    nothing decides
   Main roads are only used to KEEP a pin, never to drop it: a long road is
   split into many ways and the nearest one may not be among Nominatim's results.
   Usage: node street-evidence-hotels.mjs [--verdicts "SOI DIFFERS,LOCALITY DIFFERS,PART DIFFERS,road differs"] */
import fs from 'node:fs';
import path from 'node:path';

const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
const vi = process.argv.indexOf('--verdicts');
const VERDICTS = new Set((vi > 0 ? process.argv[vi + 1] : 'SOI DIFFERS,LOCALITY DIFFERS,PART DIFFERS,road differs').split(','));
const OUT = `${SP}street-evidence-hotels.json`;
const rows = JSON.parse(fs.readFileSync(`${SP}street-audit-nostore.json`, 'utf8')).filter((r) => VERDICTS.has(r.verdict));
const UA = { 'User-Agent': 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; pin accuracy audit)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* How close a matching road must run for its name to be evidence of position
   rather than of adjacency. 120 m is the figure already used on this project:
   Buddy Lodge was accepted onto its OSM element because that element lies 34 m
   from Khao San Road, and the pin dropped as Tints of Blue had its "matching"
   road 231 m away. In dense Bangkok a neighbouring soi is comfortably inside
   the 300 m search radius, so presence alone decides nothing. */
const NEAR_M = 120;

const thaiKey = (s) => String(s || '').replace(/[^\u0E00-\u0E7F]/g, '');
const latinKey = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\bkoh\b/g, 'ko').replace(/[^a-z]/g, '')
  .replace(/sri/g, 'si').replace(/th|ph|kh|ch|dh/g, (m) => m[0]).replace(/([aeiou])r(?=[^aeiou]|$)/g, '$1')
  .replace(/ue|eu/g, 'u').replace(/oe/g, 'o').replace(/ou|oo/g, 'u').replace(/ee/g, 'i')
  .replace(/y/g, 'i').replace(/[wv]/g, 'u').replace(/r/g, 'l').replace(/d/g, 't').replace(/j/g, 'c').replace(/(.)\1+/g, '$1');
const ROADW = /\b(road|rd|street|st|soi|alley|lane|thanon|trok|yaek|highway|hwy)\b\.?/gi;
const numsOf = (s) => [...String(s || '').matchAll(/\d+/g)].map((m) => m[0]);
/* a road as {base key, first number, soi?, query} */
function addressRoads(r) {
  const out = [];
  for (const m of `${r.addrTh} | ${r.addrEn}`.matchAll(/(?<!แขวง)(ซอย|ถนน|ซ\.|ถ\.|ตรอก)\s*([\u0E00-\u0E7F]+)\s*(\d+(?:\/\d+)?)?/g)) {
    const kind = m[1].startsWith('ซ') || m[1] === 'ตรอก' ? 'ซอย' : 'ถนน';
    out.push({ base: thaiKey(m[2]), num: m[3] ? m[3].split('/')[0] : null, soi: kind === 'ซอย' || !!m[3], q: `${kind}${m[2]}${m[3] ? ' ' + m[3] : ''}`, script: 'th' });
  }
  for (let seg of `${r.addrEn} | ${r.addrTh}`.split(/[|,]/)) {
    seg = seg.trim();
    if (!seg || /[\u0E00-\u0E7F]/.test(seg) || /^thanon\s+\D/i.test(seg)) continue;
    if (!(/\b(road|rd|street|soi|alley|lane|thanon|trok)\b/i.test(seg) || /^\d/.test(seg))) continue;
    const s = seg.replace(/^\s*\d+[\d/-]*\s+/, '').replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim();
    if (!/[a-z]{3}/i.test(s) || /^(moo|m\.)\b/i.test(s) || /\b(floor|building|room|tower|condo)\b/i.test(s)) continue;
    const n = numsOf(s);
    out.push({ base: latinKey(s.replace(/\d+(?:\/\d+)?/g, ' ').replace(ROADW, ' ')), num: n[0] || null, soi: /\b(soi|alley|lane|trok)\b/i.test(s) || n.length > 0, q: s, script: 'en' });
  }
  const seen = new Set();
  return out.filter((x) => x.base && !seen.has(`${x.script}:${x.base}:${x.num}`) && seen.add(`${x.script}:${x.base}:${x.num}`)).sort((a, b) => b.soi - a.soi);
}
/* does an OSM highway name carry this road? */
function carries(name, road) {
  if (!name) return false;
  const key = road.script === 'th' ? thaiKey(String(name).replace(/^(ซอย|ถนน|ตรอก)/, '')) : latinKey(String(name).replace(/\d+(?:\/\d+)?/g, ' ').replace(ROADW, ' '));
  if (!key || !(key === road.base || (Math.min(key.length, road.base.length) >= 5 && (key.includes(road.base) || road.base.includes(key))))) return false;
  if (!road.num) return true;
  return numsOf(name)[0] === road.num || numsOf(name).includes(road.num);
}
const toXY = (lat, lng, lat0) => [lng * 111320 * Math.cos(lat0 * Math.PI / 180), lat * 110574];
function distTo(pt, g) {
  const P = toXY(pt[0], pt[1], pt[0]);
  let best = Infinity;
  const line = (cs) => {
    if (cs.length === 1) { const A = toXY(cs[0][1], cs[0][0], pt[0]); best = Math.min(best, Math.hypot(P[0] - A[0], P[1] - A[1])); }
    for (let i = 0; i + 1 < cs.length; i++) {
      const A = toXY(cs[i][1], cs[i][0], pt[0]), B = toXY(cs[i + 1][1], cs[i + 1][0], pt[0]);
      const dx = B[0] - A[0], dy = B[1] - A[1];
      const t = Math.max(0, Math.min(1, ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy || 1)));
      best = Math.min(best, Math.hypot(P[0] - A[0] - t * dx, P[1] - A[1] - t * dy));
    }
  };
  if (!g) return Infinity;
  if (g.type === 'Point') line([g.coordinates]);
  else if (g.type === 'LineString') line(g.coordinates);
  else if (g.type === 'MultiLineString' || g.type === 'Polygon') g.coordinates.forEach(line);
  else if (g.type === 'MultiPolygon') g.coordinates.forEach((p) => p.forEach(line));
  return Math.round(best);
}

async function overpass(q) {
  for (const u of ['https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
    try {
      const r = await fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' }, signal: AbortSignal.timeout(180000) });
      if (!r.ok) continue;
      const j = await r.json();
      if (j.remark) continue;
      return j.elements;
    } catch { /* next mirror */ }
  }
  return null;
}

/* 1. Overpass: highways within 300 m + admin areas, 12 pins per query */
const near = new Map(), nearG = new Map(), admin = new Map();
for (let i = 0; i < rows.length; i += 12) {
  const part = rows.slice(i, i + 12);
  let q = '[out:json][timeout:180];';
  part.forEach((r, k) => {
    q += `make m label="h${i + k}";out;way["highway"]["name"](around:300,${r.lat},${r.lng});out tags geom;`;
    q += `make m label="a${i + k}";out;is_in(${r.lat},${r.lng})->.x${k};area.x${k}["boundary"="administrative"]["admin_level"~"^(6|8)$"];out tags;`;
  });
  const els = await overpass(q);
  if (!els) { console.log(`Overpass failed for rows ${i}–${i + part.length - 1}`); continue; }
  let cur = null;
  for (const e of els) {
    if (e.type === 'm') { cur = e.tags.label; (cur[0] === 'h' ? near : admin).set(Number(cur.slice(1)), []); if (cur[0] === 'h') nearG.set(Number(cur.slice(1)), []); continue; }
    const n = Number(cur.slice(1));
    (cur[0] === 'h' ? near : admin).get(n).push(e.tags || {});
    if (cur[0] === 'h') nearG.get(n).push(e.geometry || null);
  }
  console.log(`… Overpass ${Math.min(i + 12, rows.length)}/${rows.length}`);
  await sleep(2000);
}

/* 2. Nominatim: the address's roads, inside a box around the pin */
async function search(q, r) {
  const vb = `${r.lng - 0.05},${r.lat + 0.05},${r.lng + 0.05},${r.lat - 0.05}`;
  for (let t = 0; t < 3; t++) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&countrycodes=th&polygon_geojson=1&limit=10&viewbox=${vb}&bounded=1`, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (res.ok) return await res.json();
      if (res.status === 429) await sleep(30000);
    } catch { /* retry */ }
    await sleep(5000 * (t + 1));
  }
  return null;
}
/* The verdict rules, kept as one pure function so they can be replayed over
   saved rows and asserted on. Nothing here performs I/O. */
function decide({ L8, L6, inNamed8, inNamed6, hit, hitDist, found }) {
  if (L8.length && !inNamed8 && !inNamed6) return 'REVIEW (area)';
  if (hit && hitDist <= NEAR_M) return 'keep (near road)';
  if (found && found.d > 300) return 'DROP-CANDIDATE (road)';
  /* A far hit falls to its own label, never to a drop: `found` is computed only
     when there is no hit, so the DROP branch above cannot fire for these rows.
     That is deliberate - measuring a hit is allowed to weaken a keep, never to
     manufacture a drop. Re-testing far-hit rows through Nominatim would change
     which pins become drop candidates, so it is left to its own pass. */
  if (hit) return 'keep (road far)';
  /* Nothing was tested. Until 2026-09-17 this returned plain `keep`, which reads
     as "checked and fine" when it actually means "no sub-district polygon, no
     district polygon and no road either". That is how 36 rows of a 92-row
     locality audit reported keep while nothing had been asked of them. Islands
     and rural districts are where OSM most often lacks an admin-8 polygon, so
     this matters more as the audit moves off Bangkok. */
  if (!L8.length && !L6.length && !found) return 'UNKNOWN (no data)';
  return 'keep';
}

const out = [];
for (const [idx, r] of rows.entries()) {
  const roads = addressRoads(r);
  const hw = near.get(idx) || [], hg = nearG.get(idx) || [];
  /* A hit now carries its distance. Until 2026-09-16 it did not, so a road 20 m
     away and one 231 m away - across six lanes of Sukhumvit - scored identically,
     and "keep (near road)" read as evidence in both cases. The cause was the
     query: it asked for `out tags` only, so the geometry needed to measure with
     was never fetched. `out tags geom` costs 3.4x on a 4.5 KB payload (measured
     on one Bangkok pin: 4,499 -> 15,504 bytes), which is nothing at this scale.
     The first road in address order that matches at all still wins, exactly as
     before; among its matching ways the NEAREST is the one reported. */
  let hit = null, hitDist = null, hitName = null;
  for (const road of roads) {
    const ms = [];
    hw.forEach((t, p) => {
      if (!(carries(t.name, road) || carries(t['name:en'], road) || carries(t['name:th'], road))) return;
      const g = hg[p];
      ms.push({ d: g && g.length ? distTo([r.lat, r.lng], { type: 'LineString', coordinates: g.map((q) => [q.lon, q.lat]) }) : Infinity,
                name: t.name || t['name:th'] || t['name:en'] || '' });
    });
    if (ms.length) { ms.sort((a, b) => a.d - b.d); hit = road; hitDist = ms[0].d; hitName = ms[0].name; break; }
  }
  let found = null;
  if (!hit) {
    for (const road of roads.filter((x) => x.soi).slice(0, 2)) {
      const res = await search(road.q, r); await sleep(1100);
      const cands = (res || []).filter((x) => x.category === 'highway' && (!road.num || numsOf(x.name).includes(road.num)));
      for (const c of cands) {
        const d = distTo([r.lat, r.lng], c.geojson);
        if (!found || d < found.d) found = { d, name: c.name, osm: `${c.osm_type}/${c.osm_id}`, q: road.q };
      }
      if (found) break;
    }
  }
  const ad = admin.get(idx) || [];
  const L8 = ad.filter((t) => t.admin_level === '8').map((t) => [t['name:th'] || t.name, t['name:en']].filter(Boolean).join(' / '));
  const L6 = ad.filter((t) => t.admin_level === '6').map((t) => [t['name:th'] || t.name, t['name:en']].filter(Boolean).join(' / '));
  const addrText = `${r.addrTh} ${r.addrEn}`;
  const named = (label) => label.split(' / ').some((n) => {
    const bare = n.replace(/^(แขวง|เขต|ตำบล|อำเภอ)/, '').replace(/\s*(Subdistrict|Sub-district|District)$/i, '').trim();
    /* An address saying "Krabi" must match \u0E2D\u0E33\u0E40\u0E20\u0E2D\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E01\u0E23\u0E30\u0E1A\u0E35\u0E48 / Mueang Krabi:
       Thai capital districts are named \u0E40\u0E21\u0E37\u0E2D\u0E07<province> nationwide. Ko Phi Phi
       exposed this \u2014 its pin sits in Mueang Krabi while the address says only
       Krabi \u2014 but it is a naming rule, not an island rule, so it is applied to
       every province rather than to a list of islands. */
    const vars = [bare, bare.replace(/^(\u0E40\u0E21\u0E37\u0E2D\u0E07|Mueang|Muang)\s*/i, '')].filter(Boolean);
    return vars.some((v) => /[\u0E00-\u0E7F]/.test(v)
      ? addrText.includes(v)
      : String(addrText).split(/[|,]/).some((seg) => latinKey(seg) && latinKey(seg) === latinKey(v)));
  });
  const inNamed8 = L8.some(named), inNamed6 = L6.some(named);
  /* Order matters, and it was wrong until 2026-09-16. `if (hit)` came first, so
     a road carrying the address name within 300 m of the pin silently outranked
     everything else — including a pin sitting in an admin area the address does
     not name at EITHER level. Tints of Blue was kept that way: address Sukhumvit
     Soi 27 in Khlong Toei Nuea / Watthana, pin in แขวงคลองเตย / เขตคลองเตย, 16 m
     and 21 m from two Soi 18 hotels that sit at 0 m on their own OSM elements —
     and the "hit" was Soi 27 lying 231 m away, i.e. across Sukhumvit Road. That
     is adjacency, not evidence of position. The owner dropped that pin on five
     independent lines after asking for more evidence.

     So the two-level admin mismatch is tested FIRST: being in the wrong
     sub-district AND the wrong district is strong, while a road within 300 m is
     weak in dense Bangkok, where neighbouring sois are well inside that radius.
     REVIEW (area) also no longer requires `!found` — whether Nominatim happened
     to locate the road says nothing about which district the pin is in.
     REVIEW still means "a human looks", never an automatic drop. */
  const decision = decide({ L8, L6, inNamed8, inNamed6, hit, hitDist, found });
  out.push({ slug: r.slug, name: r.name, lat: r.lat, lng: r.lng, verdict: r.verdict, addr: (r.addrEn || r.addrTh).split(' | ')[0], roads: roads.map((x) => x.q), nearRoad: hit ? hit.q : null, hitDist, hitName, found, L8, L6, inNamed8, inNamed6, near: r.near, decision });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}
const ORDER = ['DROP-CANDIDATE (road)', 'REVIEW (area)', 'UNKNOWN (no data)', 'keep (road far)', 'keep', 'keep (near road)'];
console.log(`\n${out.length} flagged pins · ` + ORDER.map((d) => `${d} ${out.filter((x) => x.decision === d).length}`).join(' · '));
for (const d of ORDER.slice(0, 4)) {
  console.log(`\n=== ${d}`);
  for (const x of out.filter((y) => y.decision === d)) console.log(`${x.slug.replace(/^review-/, '')} [${x.verdict}] | addr: ${x.addr.slice(0, 70)}${x.found ? ` | ${x.found.q} → "${x.found.name}" ${x.found.d} m` : ''}${x.nearRoad ? ` | road "${x.hitName}" ${x.hitDist} m` : ''} | pin in ${[...x.L8, ...x.L6].join(' · ').slice(0, 80)}${x.near.length ? ' | NEAR another hotel' : ''}`);
}
