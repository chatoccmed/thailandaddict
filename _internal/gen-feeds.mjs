// Generate machine-readable data feeds at build time → astro/public/feeds/*.json
// The "moat": clean, AI-ingestible Thailand data nobody else publishes. Referenced from llms.txt.
// Run via prebuild (astro/prebuild.mjs) or: node _internal/gen-feeds.mjs
import fs from 'node:fs';
import path from 'node:path';
import { deriveAttractionTags, deriveHotelTags, deriveRestaurantTags, mergeTags } from './lib/place-tags.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = 'https://thailandaddict.com';
const C = d => { const p = path.join(ROOT, 'astro/src/content', d); return fs.existsSync(p) ? fs.readdirSync(p).filter(f => f.endsWith('.json')) : []; };
const read = (d, f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/content', d, f), 'utf8'));
const strip = s => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const IMG_BASE = 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev';
const asset = p => !p ? '' : (/^(https?:)?\/\//.test(p) ? p : IMG_BASE + (p.startsWith('/') ? p : '/' + p));
const OUT = path.join(ROOT, 'astro/public/feeds');
fs.mkdirSync(OUT, { recursive: true });
const write = (name, obj) => fs.writeFileSync(path.join(OUT, name), JSON.stringify(obj));
const UPDATED = new Date().toISOString().slice(0, 10); // freshness signal for AI crawlers (build date)
// auto-geocoded coords (sidecar from _internal/geocode-places.mjs) — merged when the content has no lat/lng
const COORDS = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/place-coords.json'), 'utf8')); } catch { return {}; } })();

// 1) hotels — from single-hotel reviews
const hotels = C('reviews').map(f => { try { const r = read('reviews', f); const tags = mergeTags(r.tags, deriveHotelTags({ type: r.qiType || r.typeFull, price: r.priceRange, name: r.name })); return { name: strip(r.name), city: r.cluster, score: r.score ? Number(r.score) : undefined, stars: r.starRating ? Number(r.starRating) : undefined, price: r.priceRange || undefined, type: strip(r.qiType || r.typeFull) || undefined, loc: strip(r.badgeLoc || r.addressLocality) || undefined, img: asset(r.heroImg) || undefined, agoda: r.bookingAgoda || undefined, tags: tags.length ? tags : undefined, lat: typeof r.lat === 'number' ? r.lat : undefined, lng: typeof r.lng === 'number' ? r.lng : undefined, url: `${SITE}/${r.slug}` }; } catch { return null; } }).filter(Boolean);

// 2) restaurants — from eat-ranking articles (restaurant blocks)
const restaurants = [];
for (const f of C('articles')) { try { const a = read('articles', f); if (a.type !== 'eat-ranking') continue; if (a.slug && a.slug.startsWith('top10-attractions-')) continue; /* attraction rankings mistyped eat-ranking — exclude from restaurants feed (source untouched) */ for (const b of (a.blocks || [])) { if (b.kind !== 'restaurant') continue; const rtags = deriveRestaurantTags({ foodType: b.foodType, halal: b.halal, veg: b.veg, englishMenu: b.englishMenu, priceRange: b.priceRange, name: b.name }); restaurants.push({ name: strip(b.name), province: a.crumbCity, foodType: b.foodType, rating: typeof b.rating === 'number' ? b.rating : undefined, ratingCount: typeof b.ratingCount === 'number' ? b.ratingCount : undefined, price: b.priceRange || undefined, hours: b.hours || undefined, img: asset(b.libImg || b.img || '') || undefined, tags: rtags.length ? rtags : undefined, lat: typeof b.lat === 'number' ? b.lat : undefined, lng: typeof b.lng === 'number' ? b.lng : undefined, url: `${SITE}/${a.slug}#r${b.rank}`, listUrl: `${SITE}/${a.slug}` }); } } catch {} }

// 3) attractions + 4) guides — from articles by type
const attractions = [], guides = [];
for (const f of C('articles')) { try { const a = read('articles', f); const nm = strip(a.h1 || a.title); const row = { name: nm, city: a.crumbCity, type: a.type, img: asset(a.heroImg) || undefined, url: `${SITE}/${a.slug}` }; if (a.type === 'attraction') { const tags = mergeTags(a.tags, deriveAttractionTags(nm)); if (tags.length) row.tags = tags; if (typeof a.lat === 'number') row.lat = a.lat; if (typeof a.lng === 'number') row.lng = a.lng; const sc = COORDS[row.url]; if (row.lat == null && sc) { row.lat = sc.lat; row.lng = sc.lng; } attractions.push(row); } else if (a.type === 'prep' || a.type === 'itinerary' || a.type === 'guide') guides.push(row); } catch {} }

// 5) faqs — aggregate every page's FAQ (reviews + roundups + articles) for AI Q&A ingestion
// editorial destination/guide Q&A (articles + roundups). Per-hotel review FAQs stay on-page
// (FAQPage schema already makes them citable) — keeps this feed a lean general-knowledge corpus.
const faqs = [];
const FAQ_TYPES = new Set(['prep', 'guide', 'itinerary']); // planning/destination knowledge; place-specific FAQs stay on-page
for (const coll of ['roundups', 'articles']) {
  for (const f of C(coll)) { try { const r = read(coll, f); if (coll === 'articles' && !FAQ_TYPES.has(r.type)) continue; if (!Array.isArray(r.faq)) continue; const u = `${SITE}/${r.slug}`; for (const qa of r.faq) { if (qa && qa.q && qa.a) { const a = strip(qa.a); faqs.push({ q: strip(qa.q), a: a.length > 320 ? a.slice(0, 317) + '…' : a, url: u }); } } } catch {} }
}

const LIC = 'Attribution: ThailandAddict (thailandaddict.com)';
write('hotels.json', { site: SITE, type: 'hotels', updated: UPDATED, license: LIC, count: hotels.length, items: hotels });
write('restaurants.json', { site: SITE, type: 'restaurants', updated: UPDATED, license: LIC, count: restaurants.length, items: restaurants });
write('attractions.json', { site: SITE, type: 'attractions', updated: UPDATED, license: LIC, count: attractions.length, items: attractions });
write('guides.json', { site: SITE, type: 'guides', updated: UPDATED, license: LIC, count: guides.length, items: guides });
write('faqs.json', { site: SITE, type: 'faqs', updated: UPDATED, license: LIC, count: faqs.length, items: faqs });
write('index.json', {
  site: SITE, name: 'ThailandAddict data feeds', updated: UPDATED,
  note: 'Machine-readable Thailand travel data. Free to use with attribution + a link to the source page.',
  feeds: [
    { type: 'hotels', url: `${SITE}/feeds/hotels.json`, count: hotels.length },
    { type: 'restaurants', url: `${SITE}/feeds/restaurants.json`, count: restaurants.length },
    { type: 'attractions', url: `${SITE}/feeds/attractions.json`, count: attractions.length },
    { type: 'guides', url: `${SITE}/feeds/guides.json`, count: guides.length },
    { type: 'faqs', url: `${SITE}/feeds/faqs.json`, count: faqs.length },
  ],
});
console.log(`feeds: hotels ${hotels.length} · restaurants ${restaurants.length} · attractions ${attractions.length} · guides ${guides.length} · faqs ${faqs.length}`);
