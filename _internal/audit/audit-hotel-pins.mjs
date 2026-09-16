/* Accuracy audit, read-only: every live hotel pin that was never read against
   its own review's address (everything except the 2026-09-15/16 --misses
   batches, which were) is reverse-geocoded (Nominatim zoom 14, Thai and
   English) and compared with the review's streetAddress / addressLocality /
   mapAddr:
     · agrees    the address names the pin's district, sub-district or town
                 (whole squashed name, or a distinctive word of it)
     · FLAG      it does not — printed with both, for a human to read
   Nominatim 1 request per 1.1 s, one job at a time. Progress is written to
   audit-hotel-pins.json after every row, so an interrupted run keeps what it
   has and a re-run skips the rows already done.
   Usage: node audit-hotel-pins.mjs */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
process.chdir(ROOT);
const OUT = `${SP}audit-hotel-pins.json`;
const rj = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };
const store = rj('_internal/hotel-coords.json', {});
const done = new Map(rj(OUT, []).map((r) => [r.slug, r]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const squash = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '');
const bare = (s) => String(s || '')
  .replace(/^(อำเภอ|เขต|แขวง|ตำบล|เทศบาล(นคร|เมือง|ตำบล)?|องค์การบริหารส่วนตำบล|จังหวัด|บ้าน|หมู่บ้าน)\s*/, '')
  .replace(/\s*(district|sub-?district|subdistrict|municipality|city|town|province)$/i, '')
  .replace(/^(amphoe|tambon|ban)\s+/i, '').trim();
const GENERIC = new Set(['ko', 'koh', 'ban', 'baan', 'tambon', 'amphoe', 'mueang', 'muang', 'district', 'subdistrict', 'sub', 'municipality',
  'city', 'town', 'province', 'road', 'soi', 'moo', 'beach', 'bay', 'hat', 'haad', 'ao', 'nai', 'tha', 'thailand', 'the', 'of', 'and', 'nakhon', 'si']);
const TH_AFFIX = /^(อำเภอ|เขต|แขวง|ตำบล|เทศบาล(นคร|เมือง|ตำบล)?|องค์การบริหารส่วนตำบล|จังหวัด|บ้าน|เกาะ|หาด)/;
const words = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .split(/[^a-z0-9\u0E00-\u0E7F]+/).map((w) => w.replace(TH_AFFIX, '')).filter((w) => w.length >= 4 && !GENERIC.has(w));

async function reverse(lat, lng, lang) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=14&addressdetails=1&accept-language=${lang}&lat=${lat}&lon=${lng}`,
        { headers: { 'User-Agent': 'thailandaddict-geocoder/1.0 (+https://thailandaddict.com; pin accuracy audit)' }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return (await r.json()).address || {};
    } catch { /* retry */ }
    await sleep(5000 * (i + 1));
  }
  return null;
}
const parts = (a) => [a.county, a.city_district, a.suburb, a.town, a.village, a.municipality, a.city, a.quarter, a.hamlet].filter(Boolean).map(bare).filter((x) => x.length > 2);

const rows = [];
for (const f of fs.readdirSync('astro/src/content/reviews')) {
  if (!f.endsWith('.json')) continue;
  const j = rj(`astro/src/content/reviews/${f}`, null);
  if (!j || !Number.isFinite(j.lat)) continue;
  const slug = f.replace(/\.json$/, '');
  const st = store[slug] || {};
  if (/named lodging inside/.test(st.q || '')) continue;
  rows.push({ slug, name: j.name, cluster: j.cluster, lat: j.lat, lng: j.lng, via: st.via || null, osm: st.osm || null,
    addr: [j.streetAddress, j.addressLocality, j.mapAddr].filter(Boolean).join(' | ') });
}
console.log(`${rows.length} pins to audit · ${[...done.keys()].length} already in ${OUT}`);
const out = [...done.values()];
let n = 0, flagged = out.filter((r) => r.flag).length;
for (const r of rows) {
  if (done.has(r.slug)) continue;
  const th = await reverse(r.lat, r.lng, 'th'); await sleep(1100);
  const en = await reverse(r.lat, r.lng, 'en'); await sleep(1100);
  if (!th || !en) { console.log(`!  ${r.slug}: no answer, left for a re-run`); continue; }
  const names = [...new Set([...parts(th), ...parts(en)])];
  const hay = squash(r.addr), addrWords = new Set(words(r.addr));
  const whole = names.some((x) => { const k = squash(x); return k.length > 2 && hay.includes(k); });
  const distinct = names.flatMap(words).some((w) => addrWords.has(w) || hay.includes(w));
  const flag = !(whole || distinct);
  const rec = { ...r, reverse: names.slice(0, 8), province: th.state || th.province || en.state || null, flag };
  out.push(rec);
  n++;
  if (flag) { flagged++; console.log(`⚑ ${r.slug} [${r.via || '?'}] pin in ${names.slice(0, 4).join(' / ')} (${rec.province || '?'})\n     address: ${r.addr.slice(0, 170)}`); }
  if (n % 25 === 0) { fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); console.log(`   … ${n} new rows audited · ${flagged} flagged so far`); }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`\naudited ${out.length} of ${rows.length} · flagged ${out.filter((r) => r.flag).length} → ${OUT}`);
