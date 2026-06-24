#!/usr/bin/env node
// Splice a replacement restaurant object into an eat-ranking article at a given rank,
// mirroring the engine's restoBlock() assemble exactly:
//   - mapHref built from name+area+prov
//   - stayHref/stayLabel inherited from the block being replaced (else rank-1 block)
//   - IG shortcode / FB vanity-handle cleaning (drops un-embeddable social → undefined)
//   - CRITICAL: when rating is null/absent, rating/ratingCount/ratingSrc keys are DROPPED
//     (Astro schema is number-or-absent; a null rating breaks the build).
// After splicing, ALWAYS run finalize-resto.mjs then verify-resto.mjs.
// Usage: node _internal/wf/splice-resto.mjs <city> <rank> <replacement.json> [prov]
import fs from 'fs';

const [, , CITY, RANKS, REPLF, PROV_ARG] = process.argv;
const RANK = Number(RANKS);
if (!CITY || !RANK || !REPLF) { console.error('usage: splice-resto.mjs <city> <rank> <replacement.json> [prov]'); process.exit(1); }
const ART = `astro/src/content/articles/top10-popular-restaurants-${CITY}.json`;
if (!fs.existsSync(ART)) { console.error('NO article:', ART); process.exit(2); }
if (!fs.existsSync(REPLF)) { console.error('NO replacement file:', REPLF); process.exit(2); }

const a = JSON.parse(fs.readFileSync(ART, 'utf8'));
const w = JSON.parse(fs.readFileSync(REPLF, 'utf8'));
const blocks = a.blocks || [];
const idx = blocks.findIndex(b => b.kind === 'restaurant' && b.rank === RANK);
if (idx < 0) { console.error('no restaurant block at rank', RANK); process.exit(3); }
const old = blocks[idx];
const r1 = blocks.find(b => b.kind === 'restaurant' && b.rank === 1) || {};

const PROV = PROV_ARG || ((/จ\.([^ ]+)/.exec(old.area || '') || [])[1]) || '';
const cleanIg = (s) => { const v = String(s || '').trim().replace(/^.*\/p\//, '').replace(/\/.*$/, ''); return /^[A-Za-z0-9_-]{5,}$/.test(v) ? v : null; };
const cleanFb = (s) => { const v = String(s || '').trim().replace(/\?.*$/, ''); return (/^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+\/?$/.test(v) && !/profile\.php/.test(v) && !/\/p\//.test(v)) ? v : null; };
const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${w.name} ${w.area} ${PROV}`)}`;
const hasRating = (typeof w.rating === 'number' && isFinite(w.rating));

const b = {
  kind: 'restaurant', rank: RANK, name: w.name, area: w.area, cuisine: w.cuisine, signature: w.signature,
  priceRange: w.priceRange || undefined,
  igPost: cleanIg(w.igPost) || undefined,
  fbPage: cleanFb(w.fbPage) || undefined,
  descHtml: w.descHtml,
  mustOrder: (Array.isArray(w.mustOrder) && w.mustOrder.length) ? w.mustOrder : undefined,
  tags: (Array.isArray(w.tags) && w.tags.length) ? w.tags : undefined,
  mapHref,
  stayHref: old.stayHref || r1.stayHref,
  stayLabel: old.stayLabel || r1.stayLabel,
  bestFor: w.bestFor || undefined, zone: w.zone || undefined, foodType: w.foodType || undefined,
  rating: hasRating ? w.rating : undefined,
  ratingCount: (hasRating && typeof w.ratingCount === 'number' && isFinite(w.ratingCount)) ? Math.round(w.ratingCount) : undefined,
  ratingSrc: hasRating ? ((w.ratingSrc && w.ratingSrc.trim()) || 'Google') : undefined,
  hours: w.hours || undefined, priceUsd: w.priceUsd || undefined, spice: w.spice || undefined,
  halal: w.halal === true || undefined, veg: w.veg === true || undefined, englishMenu: w.englishMenu === true || undefined,
  lat: (typeof w.lat === 'number' && isFinite(w.lat)) ? w.lat : undefined,
  lng: (typeof w.lng === 'number' && isFinite(w.lng)) ? w.lng : undefined,
};
Object.keys(b).forEach(k => b[k] === undefined && delete b[k]);
blocks[idx] = b;
fs.writeFileSync(ART, JSON.stringify(a, null, 2) + '\n');
console.log(`[splice] ${CITY} #${RANK} → ${b.name} | rating=${hasRating ? b.rating + ' ' + b.ratingSrc + (b.ratingCount ? '/' + b.ratingCount : '') : '(none — keys dropped)'} | ig=${b.igPost || '-'} fb=${b.fbPage || '-'} | stay=${b.stayHref}`);
console.log(`  → next: node _internal/wf/finalize-resto.mjs ${CITY} && node _internal/wf/verify-resto.mjs ${CITY}`);
