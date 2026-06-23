// Auto-geocode attraction places → _internal/place-coords.json (sidecar, merged by gen-feeds).
// Accuracy gate: a result is accepted ONLY if it falls inside the place's PROVINCE bounding box (rejects wrong-province/country hits).
// Tries several name variants per place. Respects Nominatim policy (1 req/sec, descriptive User-Agent). Resumable (skips already-done).
// Usage: node _internal/geocode-places.mjs ["<provinceThai substring>"] [--limit=N]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ART = path.join(ROOT, 'astro/src/content/articles');
const SIDE = path.join(ROOT, '_internal/place-coords.json');
const BBOX = path.join(ROOT, '_internal/province-bbox.json');
const UA = 'thailandaddict-geocode/1.0 (+https://thailandaddict.com; chatmaliwan@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const GAP = 1200;

const args = process.argv.slice(2);
const provFilter = args.find(a => !a.startsWith('--')) || '';
const limit = +(((args.find(a => a.startsWith('--limit=')) || '').split('=')[1]) || 0);

const strip = s => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
async function nomi(q) {
  const u = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=th&q=' + encodeURIComponent(q);
  try { const r = await fetch(u, { headers: { 'User-Agent': UA } }); if (!r.ok) return null; const a = await r.json(); return a[0] || null; } catch { return null; }
}
const inBox = (lat, lng, bb) => lat >= bb[0] && lat <= bb[1] && lng >= bb[2] && lng <= bb[3]; // bb=[south,north,west,east]
const load = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return {}; } };

const side = load(SIDE), bbox = load(BBOX);

// gather attraction places in scope
const places = [];
for (const f of fs.readdirSync(ART).filter(f => f.endsWith('.json'))) {
  try {
    const a = JSON.parse(fs.readFileSync(path.join(ART, f), 'utf8'));
    if (a.type !== 'attraction') continue;
    const prov = a.crumbCity || '';
    if (provFilter && !prov.includes(provFilter)) continue;
    const h1 = strip(a.h1 || a.title || '');
    // skip non-single-place articles (listicles / routes / activities / multi-day plans) — not geocodable to one point
    if (/^(ที่เที่ยว|จุดเช็คอิน|จุดถ่ายรูป|เดินเมือง|เส้นทาง|รถม้า|ทริป|\d)/.test(h1) || /ครบในทริป|วันเดียว|\d ?วัน ?\d ?คืน|day-trip|itinerary|things-to-do|photo-spots/i.test(h1 + ' ' + a.slug)) continue;
    places.push({ url: 'https://thailandaddict.com/' + a.slug, slug: a.slug, h1, prov });
  } catch {}
}
const todo = places.filter(p => !side[p.url]).slice(0, limit || places.length);
console.log('attractions in scope:', places.length, '· to geocode (not yet done):', todo.length);

// province bounding boxes (geocode each province once, cache)
for (const pr of [...new Set(todo.map(p => p.prov).filter(Boolean))]) {
  if (bbox[pr]) continue;
  // query the PROVINCE admin area (not the city of the same name), then pad ~0.1deg (~11km) to tolerate bbox imprecision
  const q = /กรุงเทพ/.test(pr) ? pr + ', Thailand' : 'จังหวัด' + pr + ', Thailand';
  const r = await nomi(q); await sleep(GAP);
  if (r && r.boundingbox) { const b = r.boundingbox.map(Number); bbox[pr] = [b[0] - 0.1, b[1] + 0.1, b[2] - 0.1, b[3] + 0.1]; console.log('bbox', pr, '=', bbox[pr].map(x => x.toFixed(2)).join(',')); }
  else console.log('⚠️ no bbox for', pr, '(places there will skip the box-gate)');
}
fs.writeFileSync(BBOX, JSON.stringify(bbox));

function cleanName(h1, prov) {
  let s = h1.replace(prov, ' ');
  // cut at the first descriptor that starts a marketing tail
  s = s.replace(/(คู่มือ|ฉบับ|ที่ไหนดี|เที่ยวยังไง|ข้อควรรู้|รีวิว|อัปเดต|จุดเช็คอิน|พิกัด|วิธีไป|ครบ|ต้นกำเนิด|ต้มไข่|แช่น้ำ|เจดีย์|มณฑป|เส้นทาง|ไหว้พระ|เมืองเดียว|ถนนคนเดิน|ที่ยังมี|20\d\d).*$/u, '');
  return s.replace(/\s+/g, ' ').trim();
}
const firstWords = (s, n) => s.split(' ').slice(0, n).join(' ').trim();
const slugWords = slug => slug.replace(/-/g, ' ').replace(/\b(guide|plan|map|review|2\d\d\d)\b/gi, '').trim();

let ok = 0, miss = 0;
for (const p of todo) {
  const bb = bbox[p.prov];
  const cn = cleanName(p.h1, p.prov);
  const queries = [cn + ', ' + p.prov + ', Thailand', slugWords(p.slug) + ', ' + p.prov + ', Thailand', firstWords(p.h1, 2) + ', ' + p.prov + ', Thailand', firstWords(p.h1, 3) + ', ' + p.prov + ', Thailand'];
  let hit = null, used = '';
  for (const q of queries) {
    if (!q || q.replace(/[, ]/g, '').length < 4) continue;
    const r = await nomi(q); await sleep(GAP);
    if (r) { const lat = +r.lat, lng = +r.lon; if (!bb || inBox(lat, lng, bb)) { hit = { lat: +lat.toFixed(5), lng: +lng.toFixed(5) }; used = q; break; } }
  }
  if (hit) { side[p.url] = { ...hit, prov: p.prov, via: 'nominatim', q: used.slice(0, 70) }; ok++; if (ok <= 12) console.log('  ✓', p.h1.slice(0, 34), '→', hit.lat, hit.lng); }
  else { miss++; if (miss <= 6) console.log('  ✗ miss:', p.h1.slice(0, 40)); }
  if ((ok + miss) % 20 === 0) { fs.writeFileSync(SIDE, JSON.stringify(side)); console.log('… progress', ok + miss, '/', todo.length, '(ok', ok + ')'); }
}
fs.writeFileSync(SIDE, JSON.stringify(side));
console.log('\nDONE · geocoded', ok, '· missed', miss, '· coverage', todo.length ? Math.round(ok / todo.length * 100) + '%' : '—', '· sidecar total', Object.keys(side).length);
