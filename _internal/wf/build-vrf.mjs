#!/usr/bin/env node
// Build the deep-verify args file {prov, rests[]} from a finalized eat-ranking article.
// Feeds verify-resto-prov workflow (one skeptic agent per restaurant).
// Usage: node _internal/wf/build-vrf.mjs <city> "<prov display>" [outfile]
//   e.g. node _internal/wf/build-vrf.mjs lopburi "ลพบุรี (Lopburi)"  →  ~/ta-build-temp/vrf-lopburi.json
import fs from 'fs';
import os from 'os';
import path from 'path';

const [, , CITY, PROV] = process.argv;
if (!CITY || !PROV) { console.error('usage: build-vrf.mjs <city> "<prov display>" [outfile]'); process.exit(1); }
const ART = `astro/src/content/articles/top10-popular-restaurants-${CITY}.json`;
if (!fs.existsSync(ART)) { console.error('NO article:', ART); process.exit(2); }
const OUT = process.argv[5] || path.join(os.homedir(), 'ta-build-temp', `vrf-${CITY}.json`);

const a = JSON.parse(fs.readFileSync(ART, 'utf8'));
const rests = (a.blocks || []).filter(b => b.kind === 'restaurant').map(b => ({
  rank: b.rank,
  name: b.name,
  area: b.area,
  zone: b.zone || '',
  foodType: b.foodType || '',
  cuisine: b.cuisine || '',
  rating: (typeof b.rating === 'number') ? b.rating : null,
  ratingSrc: b.ratingSrc || null,
  ratingCount: (typeof b.ratingCount === 'number') ? b.ratingCount : null,
  igPost: b.igPost || null,
  fbPage: b.fbPage || null,
  mustOrder: Array.isArray(b.mustOrder) ? b.mustOrder : [],
}));
fs.writeFileSync(OUT, JSON.stringify({ prov: PROV, rests }, null, 0));
console.log(`[build-vrf] ${CITY}: ${rests.length} rests → ${OUT}`);
console.log(rests.map(r => `  #${r.rank} ${String(r.name).slice(0, 22).padEnd(23)} rate=${r.rating == null ? '-' : r.rating + (r.ratingSrc ? '/' + r.ratingSrc : '')} ig=${r.igPost || '-'} fb=${r.fbPage ? 'y' : '-'}`).join('\n'));
