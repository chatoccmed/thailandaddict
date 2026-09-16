/* Second look at the hotel pins street-evidence-hotels.mjs could not settle,
   plus a search for each drop candidate's own hotel in OSM. Read-only.
   · RECHECK rows: the roads written by hand in Thai (the parser lost sois in
     parentheses and had no Thai form for English-only addresses) — is one of
     them a named highway within 300 m of the pin (Overpass), and how far is
     the nearest one Nominatim finds inside a box around the pin; plus the
     pin's admin areas.
   · every drop candidate and recheck row: the hotel's own name searched on
     Nominatim near the pin — a lodging element found there would make the fix
     a move, not a drop.
   Nominatim 1 request per 1.1 s; Overpass one query.
   Usage: node recheck-hotel-drops.mjs */
import fs from 'node:fs';
import path from 'node:path';

const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
const ev = JSON.parse(fs.readFileSync(SP + 'street-evidence-hotels.json', 'utf8'));
const bySlug = new Map(ev.map((r) => [r.slug, r]));
const RECHECK = {
  'review-la49-hotel-bangkok': ['ซอยทองหล่อ 13', 'ซอยสุขุมวิท 55 ซอย 13', 'ซอยพร้อมพักตร์'],
  'review-lyf-sukhumvit-8-bangkok': ['ซอยสุขุมวิท 8'],
  'review-praso-ratchada-bangkok': ['ซอยอยู่เจริญ', 'ถนนอโศก-ดินแดง'],
  'review-s-box-sukhumvit-hotel': ['ซอยสุขุมวิท 31'],
  'review-at-81-hotel-bangkapi-bangkok': ['ซอยรามคำแหง 81', 'ซอยนิยมยินดี'],
  'review-aunchaleena-grand-hotel-bangkok': ['ซอยลาดพร้าว 122', 'ซอยรามคำแหง 65'],
  'review-bangkok-cha-cha-suite-bangkok': ['ซอยโชคชัย 4 ซอย 27', 'ซอยโชคชัย 4'],
  'review-century-park-victory-monument-bangkok': ['ถนนราชปรารภ'],
  'review-cozy-at-9-hotel-and-kitchen-bangkok': ['ถนนริมคลองสามเสน'],
  'review-kiatthada-resort-bangkok': ['ถนนสุคนธสวัสดิ์'],
  'review-missoniya-kaset-bangkok': ['ถนนงามวงศ์วาน'],
  'review-pillow-b-hotel-ramkhamhaeng-bangkok': ['ซอยรามคำแหง 43/1'],
  'review-t3-residence-ladprao-bangkok': ['ซอยนาคนิวาส 20', 'ซอยนาคนิวาส'],
  'review-the-bedrooms-sukhumvit-on-nut-bangkok': ['ซอยสุขุมวิท 77', 'ถนนอ่อนนุช'],
  'review-the-president-chokchai-4-bangkok': ['ซอยโชคชัย 4 ซอย 60', 'ซอยโชคชัย 4'],
  'review-we-hotel-riverfront-bangkok': ['ซอยจรัญสนิทวงศ์ 96/2', 'ซอยจรัญสนิทวงศ์ 96'],
  'review-walton-suites-sukhumvit-bangkok': ['ซอยสุขุมวิท 49/11', 'ซอยสุขุมวิท 49 แยก 11', 'ซอยกลาง'],
  'review-sindhorn-kempinski-bangkok': ['ซอยต้นสน'],
};
const DROPS = ev.filter((r) => r.decision === 'DROP-CANDIDATE (road)').map((r) => r.slug)
  .concat(['review-ekanake-hostel-bangkok', 'review-unplugged-bangrak-charoen-krung-bangkok']);
const UA = { 'User-Agent': 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; pin accuracy audit)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
const norm = (s) => String(s || '').replace(/\s+/g, '').replace(/^(ถนน|ซอย)/, '');
const escapeRe = (s) => s.replace(/[.*+?^$()|[\]\\{}]/g, (c) => '\\' + c);
const matchName = (name, target) => {
  const n = norm(name), t = norm(target);
  return n === t || new RegExp('^' + escapeRe(t) + '(?![0-9/])').test(n);
};
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
async function nomi(q, r) {
  const vb = `${r.lng - 0.05},${r.lat + 0.05},${r.lng + 0.05},${r.lat - 0.05}`;
  for (let t = 0; t < 3; t++) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&countrycodes=th&polygon_geojson=1&limit=8&viewbox=${vb}&bounded=1`, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (res.ok) return await res.json();
      if (res.status === 429) await sleep(30000);
    } catch { /* retry */ }
    await sleep(5000 * (t + 1));
  }
  return [];
}

const out = { recheck: [], hotels: [] };
const slugs = Object.keys(RECHECK);
let q = '[out:json][timeout:180];';
slugs.forEach((s, k) => {
  const r = bySlug.get(s);
  q += `make m label="h${k}";out;way["highway"]["name"](around:300,${r.lat},${r.lng});out tags;`;
  q += `make m label="a${k}";out;is_in(${r.lat},${r.lng})->.x${k};area.x${k}["boundary"="administrative"]["admin_level"~"^(6|8)$"];out tags;`;
});
const els = await overpass(q);
const near = {}, adm = {};
if (els) {
  let cur = null;
  for (const e of els) {
    if (e.type === 'm') { cur = e.tags.label; (cur[0] === 'h' ? near : adm)[cur.slice(1)] = []; continue; }
    (cur[0] === 'h' ? near : adm)[cur.slice(1)].push(e.tags || {});
  }
} else console.log('Overpass failed');

console.log('=== RECHECK');
for (const [k, s] of slugs.entries()) {
  const r = bySlug.get(s);
  const names = (near[k] || []).flatMap((t) => [t.name, t['name:th']].filter(Boolean));
  const within = RECHECK[s].filter((v) => names.some((n) => matchName(n, v)));
  const found = [];
  for (const v of RECHECK[s]) {
    const res = await nomi(v, r); await sleep(1100);
    const hits = res.filter((x) => x.category === 'highway' && matchName(x.name, v)).map((x) => ({ n: x.name, d: distTo([r.lat, r.lng], x.geojson) })).sort((a, b) => a.d - b.d);
    if (hits.length) found.push({ v, d: hits[0].d });
  }
  const L = (adm[k] || []).map((t) => t['name:th'] || t.name);
  out.recheck.push({ slug: s, within, found, L, overpass: !!els });
  console.log(`${s.replace(/^review-/, '')} | addr: ${r.addr.slice(0, 58)} | within 300 m: ${within.join(', ') || 'none'} | found: ${found.map((x) => `${x.v} ${x.d} m`).join(' · ') || 'none'} | pin in ${L.join(' · ')}`);
}

console.log('\n=== the hotel itself in OSM');
for (const s of [...new Set([...DROPS, ...slugs])]) {
  const r = bySlug.get(s);
  if (!r) { console.log(`${s}: no evidence row`); continue; }
  const name = String(r.name).replace(/\(.*?\)/g, ' ').replace(/\s[–—-]\s.*$/, '').replace(/\s+/g, ' ').trim();
  const res = await nomi(name, r); await sleep(1100);
  const lodg = res.filter((x) => ['tourism', 'building', 'amenity'].includes(x.category) || /hotel|hostel|guest|apartment|motel/i.test(x.type || ''));
  out.hotels.push({ slug: s, q: name, found: lodg.map((x) => ({ name: x.name, cat: `${x.category}/${x.type}`, osm: `${x.osm_type}/${x.osm_id}`, d: distTo([r.lat, r.lng], x.geojson), lat: +x.lat, lng: +x.lon })) });
  if (lodg.length) console.log(`${s.replace(/^review-/, '')} | "${name}" → ${lodg.slice(0, 3).map((x) => `${x.name} [${x.category}/${x.type}] ${x.osm_type}/${x.osm_id} ${distTo([r.lat, r.lng], x.geojson)} m from pin`).join(' ; ')}`);
}
fs.writeFileSync(SP + 'recheck-hotel-drops.json', JSON.stringify(out, null, 1));
console.log(`done · hotels searched ${out.hotels.length} · with a lodging result ${out.hotels.filter((h) => h.found.length).length}`);
