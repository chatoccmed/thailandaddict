/* After deploy: fetch sample pages from production and check each pin fix
   landed — old coordinate gone, new coordinate present where a pin moved.
   Read-only. Usage: node live-verify.mjs */
const SITE = 'https://thailandaddict.com';
const bust = `v=${Date.now()}`;

/* Review pages that carry a map image show the address as plain text and no
   coordinate at all, so a review page cannot prove a pin moved. Hotel pins
   ship in the near-me index and the feeds; hub maps embed window.__CMAP__. */
const checks = [
  { page: '/near-me-index.json', gone: ['13.75731', '7.88511', '13.16802', '19.38674', '13.91666'], present: ['19.39484', '13.91553'], label: 'near-me index (TH): removed hotel pins gone, moved hotels at the new point' },
  { page: '/en/near-me-index.json', gone: ['13.75731', '7.88511', '13.16802', '19.38674', '13.91666'], present: ['19.39484', '13.91553'], label: 'near-me index (EN): same' },
  { page: '/feeds/hotels.json', gone: ['13.7573106', '19.3867363', '13.9166582'], present: ['19.394842', '13.915534'], label: 'hotel feed: same' },
  { page: '/rayong-islands-compared', gone: ['12.552331'], present: ['12.5552407'], label: 'Koh Samet: moved onto the island' },
  { page: '/kwan-phayao-lake', gone: ['19.173993'], label: 'Kwan Phayao: lake-centre pin removed' },
  { page: '/city-chiang-mai', gone: ['"la":18.7999,"ln":98.96565'], noGonePins: true, label: 'Chiang Mai hub map (TH): no removed pin' },
  { page: '/zh/city-nonthaburi', gone: ['"la":13.91666'], noGonePins: true, label: 'zh Nonthaburi hub (re-localized): Novotel\'s road point gone' },
  { page: '/ar/city-kamphaeng-phet', noGonePins: true, label: 'ar Kamphaeng Phet hub (re-localized): no park-centre pins' },
  { page: '/ja/city-sakon-nakhon', noGonePins: true, label: 'ja Sakon Nakhon hub (re-localized): no lake-centre or road pins' },
  { page: '/review-the-quarter-ratchathewi-bangkok', gone: ['13.7573106'], label: 'The Quarter page still serves' },
  /* 2026-09-15: 38 attraction pins restored by exact OSM name */
  { page: '/city-khon-kaen', present: ['"la":16.56343'], noGonePins: true, label: 'Khon Kaen hub map (TH): Phra That Kham Kaen pinned' },
  { page: '/zh/city-khon-kaen', present: ['"la":16.56343'], noGonePins: true, label: 'zh Khon Kaen hub (re-localized): same pin' },
  { page: '/city-chonburi', present: ['"la":12.97279'], noGonePins: true, label: 'Chonburi hub map: Sanctuary of Truth pinned' },
  { page: '/feeds/attractions.json', present: ['14.041797'], label: 'attractions feed: Bridge over the River Kwai has its point' },
  { page: '/near-me-index.json', present: ['"la":14.041797'], label: 'near-me index: Bridge over the River Kwai included' },
];

/* every point removed or moved today, 5 dp, as hub maps store them */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
const k5 = (la, ln) => `${Number(la).toFixed(5)}|${Number(ln).toFixed(5)}`;
const GONE = new Set(JSON.parse(fs.readFileSync(`${ROOT}/_internal/pin-fixes.json`, 'utf8')).map((e) => { const [la, ln] = e.pos.split(',').map(Number); return k5(la, ln); }));
GONE.add(k5(13.7573106, 100.5205966));
const lumpini = JSON.parse(fs.readFileSync(`${ROOT}/_internal/place-coords.json`, 'utf8'))['https://thailandaddict.com/lumpini-park-guide'];
if (lumpini && lumpini.lat) GONE.delete(k5(lumpini.lat, lumpini.lng));
const gonePinsIn = (html) => {
  const i = html.indexOf('window.__CMAP__='); if (i < 0) return 0;
  try { return JSON.parse(html.slice(i + 16, html.indexOf(';</script>', i))).filter((p) => GONE.has(k5(p.la, p.ln))).length; } catch { return -1; }
};

let fails = 0;
for (const c of checks) {
  const url = `${SITE}${c.page}?${bust}`;
  let html = '', status = 0;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    status = r.status;
    html = await r.text();
  } catch (e) { console.log(`✗ ${c.label} — fetch failed: ${e.message}`); fails++; continue; }
  const stillThere = (c.gone || []).filter((s) => html.includes(s));
  const missing = (c.present || []).filter((s) => !html.includes(s));
  const goneShown = c.noGonePins ? gonePinsIn(html) : 0;
  const ok = status === 200 && !stillThere.length && !missing.length && goneShown === 0;
  if (!ok) fails++;
  console.log(`${ok ? '✓' : '✗'} ${c.label} — HTTP ${status}${stillThere.length ? ` · still contains ${stillThere.join(', ')}` : ''}${missing.length ? ` · missing ${missing.join(', ')}` : ''}${goneShown ? ` · map still shows ${goneShown} removed/moved point(s)` : ''}`);
}
console.log(fails ? `\n${fails} check(s) failed` : '\nall live checks passed');
process.exit(fails ? 1 : 0);
