/* Street-level address audit, read-only. Hotel review pins with NO store row
   were written by content pipelines and never geocoded or checked. The
   zoom-14 audit (audit-hotel-pins.mjs) passed a pin when ANY name agreed —
   the district, or even "Bangkok" — so a Sukhumvit Soi 27 hotel pinned on
   Soi 18 in Khlong Toei, and a Bang Rak hostel pinned across the river in
   Khlong San, both passed. Here every such pin is reverse-geocoded at zoom 18
   in Thai and English and compared with the review's own address (TH file +
   EN twin: streetAddress / addressLocality / mapAddr) as WHOLE parts,
   spelling-tolerant (Mueang = Muang, Talad = Talat, Sathorn = Sathon),
   province names ignored:
     · SOI DIFFERS        same base road, different soi numbers (a numbered
                          match beats a bare main-road match)
     · LOCALITY DIFFERS   the address names places and none of them is any of
                          the pin's sub-district / district / town names
     · PART DIFFERS       a place agrees, but the sub-district the address names
                          is not one of the pin's names: Thai แขวง/ตำบล, or in an
                          English address the part right before the part that
                          matched (not a beach/market/mall/village word)
     · road differs       different named roads, or the pin is on soi N of a
                          road the address names without a number (weak)
     · agrees (road) · agrees (locality) · undecided (address names nothing usable)
   "Thanon X" without a house number is a Bangkok sub-district (แขวงถนนพญาไท),
   not a road. Each row also lists other hotels pinned within 30 m under a
   different name (two hotels at one point: at least one pin is wrong).
   Reverse answers are cached in street-audit-reverse.json (keyed by slug and
   position), so the comparison re-runs after a rule change without asking
   Nominatim again. Nominatim 1 request per 1.1 s, one job at a time.
   Usage: node street-audit-nostore.mjs [--all] [--limit N] [--slugs a,b] [--no-fetch] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
process.chdir(ROOT);
const ALL = process.argv.includes('--all');
const NOFETCH = process.argv.includes('--no-fetch');
const li = process.argv.indexOf('--limit');
const LIMIT = li > 0 ? Number(process.argv[li + 1]) : Infinity;
const si = process.argv.indexOf('--slugs');
const SLUGS = si > 0 ? new Set(process.argv[si + 1].split(',')) : null;
const CACHE = `${SP}street-audit-reverse.json`;
const OUT = `${SP}street-audit-${SLUGS ? 'slugs' : ALL ? 'all' : 'nostore'}.json`;
const rj = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const store = rj('_internal/hotel-coords.json', {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const addrOf = (x) => [x.streetAddress, x.addressLocality, x.mapAddr].filter(Boolean).join(' | ');
const reviews = [];
for (const f of fs.readdirSync('astro/src/content/reviews')) {
  if (!f.endsWith('.json')) continue;
  const j = rj(`astro/src/content/reviews/${f}`, null);
  if (!j || !Number.isFinite(j.lat) || !Number.isFinite(j.lng)) continue;
  const slug = f.slice(0, -5);
  const en = rj(`astro/src/content/reviews-en/${f}`, null) || {};
  reviews.push({ slug, name: j.name, cluster: j.cluster, lat: j.lat, lng: j.lng, stored: !!(store[slug] && Number.isFinite(store[slug].lat)), addrTh: addrOf(j), addrEn: addrOf(en) });
}
const targets = reviews.filter((r) => (SLUGS ? SLUGS.has(r.slug) : ALL || !r.stored)).slice(0, LIMIT);

/* ---- name keys ---- */
const thaiKey = (s) => String(s || '').replace(/[^\u0E00-\u0E7F]/g, '');
const latinKey = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')
  .replace(/sri/g, 'si').replace(/th|ph|kh|ch|dh/g, (m) => m[0]).replace(/([aeiou])r(?=[^aeiou]|$)/g, '$1')
  .replace(/ue|eu/g, 'u').replace(/oe/g, 'o').replace(/ou|oo/g, 'u').replace(/ee/g, 'i')
  .replace(/y/g, 'i').replace(/[wv]/g, 'u').replace(/r/g, 'l').replace(/d/g, 't').replace(/j/g, 'c').replace(/(.)\1+/g, '$1');
const key = (s) => (/[\u0E00-\u0E7F]/.test(String(s || '')) ? thaiKey(s) : latinKey(s));
const bareName = (s) => String(s || '').trim()
  .replace(/^(แขวง|เขต|ตำบล|ต\.|อำเภอ|อ\.|จังหวัด|จ\.|เทศบาล(นคร|เมือง|ตำบล)?|องค์การบริหารส่วนตำบล|กิ่งอำเภอ)\s*/, '')
  .replace(/\s*\b(district|sub-?district|subdistrict|municipality|city|town|province)$/i, '')
  .replace(/^(amphoe|tambon|khet|khwaeng|khwang|changwat)\s+/i, '').trim();
const nums = (s) => {
  const out = [];
  for (const m of String(s || '').matchAll(/(\d+)(\/\d+)?(?:\s*[–-]\s*(\d+))?/g)) {
    out.push(m[1] + (m[2] || '')); if (m[2]) out.push(m[1]);
    if (m[3]) for (let n = Number(m[1]) + 1; n <= Number(m[3]) && n - Number(m[1]) < 20; n++) out.push(String(n));
  }
  return out;
};
const ROAD_WORDS = /\b(road|rd|street|st|soi|alley|lane|thanon|trok|highway|hwy|moo|m)\b\.?/gi;
const latinRoad = (seg) => {
  const s = String(seg).replace(/^\s*\d+[\d/-]*\s+/, '');
  return { base: latinKey(s.replace(/\d+(?:\/\d+)?/g, ' ').replace(ROAD_WORDS, ' ')), nums: nums(s), raw: String(seg).trim() };
};
const pinRoad = (s) => {
  if (!s) return null;
  if (/[\u0E00-\u0E7F]/.test(s)) {
    const m = String(s).match(/^(?:ถนน|ซอย|ตรอก|ซ\.|ถ\.)?\s*([\u0E00-\u0E7F]*)\s*(.*)$/);
    return { base: thaiKey(m[1]), nums: nums(m[2]), raw: s };
  }
  return latinRoad(s);
};

/* ---- the review's own address, as parts ---- */
function addressParts(...srcs) {
  const loc = [], roads = [];
  let ord = 0;
  for (const [src, text] of srcs.entries()) {
    const s = String(text || '');
    for (const m of s.matchAll(/(แขวง|ตำบล|ต\.)\s*([\u0E00-\u0E7F]+)/g)) loc.push({ k: thaiKey(m[2]), raw: m[0], lvl: 'sub', src, ord: ord++ });
    for (const m of s.matchAll(/(เขต|อำเภอ|อ\.)\s*([\u0E00-\u0E7F]+)/g)) loc.push({ k: thaiKey(m[2]), raw: m[0], lvl: 'dist', src, ord: ord++ });
    for (const m of s.matchAll(/(?<!แขวง)(ถนน|ถ\.|ซอย|ซ\.|ตรอก)\s*([\u0E00-\u0E7F]*)\s*((?:\d+(?:\/\d+)?)(?:\s*[–-]\s*\d+)?)?/g)) {
      const base = thaiKey(m[2]), ns = nums(m[3]);
      if (!base && !ns.length) continue;
      const prev = [...roads].reverse().find((r) => /[\u0E00-\u0E7F]/.test(r.raw) && r.base);
      roads.push({ base: base || (prev ? prev.base : ''), nums: ns, raw: m[0].trim() });
    }
    for (let seg of s.split(/[|,]/)) {
      seg = seg.trim();
      if (!seg || /[\u0E00-\u0E7F]/.test(seg)) continue;
      seg = seg.replace(/\b\d{5}\b/g, '').replace(/\bthailand\b/ig, '').trim();
      if (!seg || /^(moo|m\.)\s*\d+$/i.test(seg)) continue;
      if (/^thanon\s+\D/i.test(seg)) { loc.push({ k: latinKey(seg), raw: seg, lvl: '?', src, ord: ord++ }); continue; }
      if (/^\d/.test(seg) || /\b(road|rd|street|st|soi|alley|lane|thanon|trok|highway|hwy)\b/i.test(seg)) { const r = latinRoad(seg); if (r.base || r.nums.length) roads.push(r); continue; }
      const b = bareName(seg);
      if (b) loc.push({ k: latinKey(b), raw: seg, lvl: '?', src, ord: ord++ });
    }
  }
  return { loc: loc.filter((l) => l.k), roads };
}

/* ---- Nominatim ---- */
async function rev(lat, lng, lang) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=${lang}&lat=${lat}&lon=${lng}`,
        { headers: { 'User-Agent': 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; pin accuracy audit)' }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return (await r.json()).address || {};
      if (r.status === 429) await sleep(30000);
    } catch { /* retry */ }
    await sleep(5000 * (i + 1));
  }
  return null;
}
const cache = rj(CACHE, {});
const ck = (r) => `${r.slug}@${r.lat},${r.lng}`;
if (!NOFETCH) {
  let asked = 0;
  for (const r of targets) {
    if (cache[ck(r)]) continue;
    const th = await rev(r.lat, r.lng, 'th'); await sleep(1100);
    const en = await rev(r.lat, r.lng, 'en'); await sleep(1100);
    if (!th || !en) { console.log(`reverse failed: ${r.slug}`); continue; }
    cache[ck(r)] = { th, en };
    fs.writeFileSync(CACHE, JSON.stringify(cache));
    if (++asked % 50 === 0) console.log(`… asked ${asked}`);
  }
}

/* ---- comparison ---- */
const LOC_KEYS = ['suburb', 'quarter', 'village', 'town', 'hamlet', 'neighbourhood', 'city_district', 'county', 'municipality', 'city'];
const SUB_KEYS = ['suburb', 'quarter', 'village', 'town', 'hamlet'];
const NOT_ADMIN = /\b(beach|bay|hat|haad|ao|island|koh|ko|market|plaza|mall|square|tower|building|village|moo|near|opposite|pier|station|center|centre|hill|garden|park|lake|river|night|old town|walking)\b/i;
const pinParts = (a) => ({
  road: a.road || null,
  locs: LOC_KEYS.map((k) => (a[k] ? bareName(a[k]) : null)).filter(Boolean),
  subs: SUB_KEYS.map((k) => (a[k] ? bareName(a[k]) : null)).filter(Boolean),
  state: a.state || a.province || null,
});
function roadCompare(addrRoads, pins) {
  const A = addrRoads.filter((r) => r.base);
  const P = pins.filter((r) => r && r.base);
  if (!A.length || !P.length) return null;
  const found = [];
  for (const a of A) for (const p of P) {
    if (a.base !== p.base) continue;
    if (a.nums.length && p.nums.length) found.push(a.nums.some((n) => p.nums.includes(n)) ? { v: 'same', rank: 0, a: a.raw, p: p.raw } : { v: 'soi differs', rank: 1, a: a.raw, p: p.raw });
    else if (!p.nums.length) found.push({ v: 'same', rank: 2, a: a.raw, p: p.raw });
    else found.push({ v: 'soi unconfirmed', rank: 3, a: a.raw, p: p.raw });
  }
  if (!found.length) return { v: 'other', a: A.map((r) => r.raw).join(' / '), p: P.map((r) => r.raw).join(' / ') };
  const best = found.sort((x, y) => x.rank - y.rank)[0];
  return { v: best.v, a: best.a, p: best.p };
}
const meters = (a, b) => Math.round(Math.hypot((b.lng - a.lng) * 111320 * Math.cos(a.lat * Math.PI / 180), (b.lat - a.lat) * 110574));
const sameHotel = (a, b) => { const x = latinKey(a), y = latinKey(b); return x && y && (x === y || (Math.min(x.length, y.length) >= 5 && (x.includes(y) || y.includes(x)))); };

function evaluate(r, th, en) {
  const pt = pinParts(th), pe = pinParts(en);
  const ignore = new Set(['กรุงเทพมหานคร', 'กรุงเทพ', 'กทม', 'ประเทศไทย', latinKey('bangkok'), latinKey('krung thep maha nakhon'), latinKey('thailand'), key(bareName(pt.state)), key(bareName(pe.state))].filter(Boolean));
  const parts = addressParts(r.addrTh, r.addrEn);
  const addrLocs = parts.loc.filter((l) => !ignore.has(l.k));
  const pinKeys = new Set([...pt.locs, ...pe.locs].map(key).filter((k) => k && !ignore.has(k)));
  const pinHasSub = [...pt.subs, ...pe.subs].map(key).some((k) => k && !ignore.has(k));
  const thaiSubs = addrLocs.filter((l) => l.lvl === 'sub');
  const guessed = [];
  const bySrc = new Map();
  for (const l of addrLocs.filter((x) => x.lvl === '?').sort((a, b) => a.ord - b.ord)) (bySrc.get(l.src) || bySrc.set(l.src, []).get(l.src)).push(l);
  for (const list of bySrc.values()) for (let i = 0; i + 1 < list.length; i++) {
    if (!pinKeys.has(list[i].k) && pinKeys.has(list[i + 1].k) && !NOT_ADMIN.test(list[i].raw) && !guessed.some((g) => g.k === list[i].k)) guessed.push(list[i]);
  }
  let locV = null;
  if (addrLocs.length) {
    if (!addrLocs.some((l) => pinKeys.has(l.k))) locV = 'LOCALITY DIFFERS';
    else if (pinHasSub && (thaiSubs.length ? !thaiSubs.some((l) => pinKeys.has(l.k)) : guessed.length > 0)) locV = 'PART DIFFERS';
    else locV = 'agrees';
  }
  const road = roadCompare(parts.roads, [pinRoad(pt.road), pinRoad(pe.road)]);
  const verdict = road && road.v === 'soi differs' ? 'SOI DIFFERS'
    : locV === 'LOCALITY DIFFERS' ? 'LOCALITY DIFFERS'
    : locV === 'PART DIFFERS' ? 'PART DIFFERS'
    : road && (road.v === 'other' || road.v === 'soi unconfirmed') ? 'road differs'
    : road && road.v === 'same' ? 'agrees (road)'
    : locV === 'agrees' ? 'agrees (locality)' : 'undecided';
  const near = reviews.filter((o) => o.slug !== r.slug && meters(r, o) <= 30 && !sameHotel(r.name, o.name)).map((o) => `${o.slug} (${meters(r, o)} m)`);
  return { slug: r.slug, name: r.name, cluster: r.cluster, lat: r.lat, lng: r.lng, stored: r.stored, addrTh: r.addrTh, addrEn: r.addrEn,
    pinTh: { road: pt.road, locs: pt.locs, house: th.house_number || null }, pinEn: { road: pe.road, locs: pe.locs },
    addrLocs: addrLocs.map((l) => l.raw), subGuess: guessed.map((l) => l.raw), road, verdict, near };
}

/* Pins already investigated and deliberately KEPT (_internal/pin-keeps.json).
   pin-fixes.json records only drops and moves, so a keep left no trace and every
   later audit re-flagged the same pin — PASSA Hotel Bangkok was investigated
   twice on 2026-09-16 for exactly that reason. Decided rows stay IN the output
   file (dropping them would lose data) but carry `decided` and are left out of
   the verdict tallies, so a genuine new flag is not buried among settled ones.
   Only strong evidence belongs in that file; a provisional "keep (near road)"
   must stay re-flaggable — that same weak test would have kept the Tints of
   Blue pin, which was dropped on evidence the same day. */
const decided = new Map();
try {
  const doc = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/pin-keeps.json'), 'utf8'));
  for (const d of doc.decided || []) decided.set(d.slug, d);
} catch { /* no record yet — every row is undecided */ }
const audited = targets.filter((r) => cache[ck(r)]).map((r) => evaluate(r, cache[ck(r)].th, cache[ck(r)].en));
for (const r of audited) if (decided.has(r.slug)) r.decided = decided.get(r.slug).decided || true;
const rows = audited.filter((r) => !r.decided);
fs.writeFileSync(OUT, JSON.stringify(audited, null, 1));
const ORDER = ['SOI DIFFERS', 'LOCALITY DIFFERS', 'PART DIFFERS', 'road differs', 'agrees (road)', 'agrees (locality)', 'undecided'];
console.log(`\n${audited.length} of ${targets.length} pins audited (${SLUGS ? 'listed slugs' : ALL ? 'all hotel pins' : 'no store row'}) · ` + ORDER.map((v) => `${v} ${rows.filter((x) => x.verdict === v).length}`).join(' · '));
if (audited.length !== rows.length) console.log(`${audited.length - rows.length} pin(s) already decided in _internal/pin-keeps.json — still in ${OUT}, left out of the counts above`);
console.log(`with another hotel pinned within 30 m: ${rows.filter((x) => x.near.length).length} → ${OUT}`);
for (const v of ORDER.slice(0, 4)) {
  const list = rows.filter((x) => x.verdict === v);
  if (!list.length) continue;
  console.log(`\n=== ${v} (${list.length})`);
  for (const x of list) console.log(`${x.slug}\n   addr: ${(x.addrEn || x.addrTh).slice(0, 110)}\n   pin : ${[x.pinTh.road, ...x.pinTh.locs].filter(Boolean).join(' / ').slice(0, 70)} | ${[x.pinEn.road, ...x.pinEn.locs].filter(Boolean).join(' / ').slice(0, 70)}${x.road ? `\n   road: address "${x.road.a}" vs pin "${x.road.p}"` : ''}${x.subGuess.length ? `\n   sub : address "${x.subGuess.join(' / ')}"` : ''}${x.near.length ? `\n   near: ${x.near.join(', ')}` : ''}`);
}
