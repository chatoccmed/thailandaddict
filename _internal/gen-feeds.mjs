// Generate machine-readable data feeds at build time → astro/public/feeds/*.json
// The "moat": clean, AI-ingestible Thailand data nobody else publishes. Referenced from llms.txt.
// TH feeds (root URLs) + EN feeds (/en/ URLs) so English-context AI crawlers cite the right pages.
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
const FAQ_TYPES = new Set(['prep', 'guide', 'itinerary']); // planning/destination knowledge; place-specific FAQs stay on-page

// Build one language's feeds. suffix = '' (TH) | '-en' (EN); urlBase = '' | '/en'.
// COORDS sidecar is keyed by the canonical (root) URL, and EN twins share the TH slug → look up by canon().
function collect(suffix, urlBase) {
  const U = slug => `${SITE}${urlBase}/${slug}`;       // emitted page URL for this language
  const canon = slug => `${SITE}/${slug}`;             // root URL (COORDS sidecar key)

  // 1) hotels — from single-hotel reviews
  const hotels = C('reviews' + suffix).map(f => { try { const r = read('reviews' + suffix, f); const tags = mergeTags(r.tags, deriveHotelTags({ type: r.qiType || r.typeFull, price: r.priceRange, name: r.name })); return { name: strip(r.name), city: r.cluster, score: r.score ? Number(r.score) : undefined, stars: r.starRating ? Number(r.starRating) : undefined, price: r.priceRange || undefined, type: strip(r.qiType || r.typeFull) || undefined, loc: strip(r.badgeLoc || r.addressLocality) || undefined, img: asset(r.heroImg) || undefined, agoda: r.bookingAgoda || undefined, tags: tags.length ? tags : undefined, lat: typeof r.lat === 'number' ? r.lat : undefined, lng: typeof r.lng === 'number' ? r.lng : undefined, url: U(r.slug) }; } catch { return null; } }).filter(Boolean);

  // 2) restaurants — from eat-ranking articles (restaurant blocks)
  const restaurants = [];
  for (const f of C('articles' + suffix)) { try { const a = read('articles' + suffix, f); if (a.type !== 'eat-ranking') continue; if (a.slug && a.slug.startsWith('top10-attractions-')) continue; /* attraction rankings mistyped eat-ranking — exclude from restaurants feed (source untouched) */ for (const b of (a.blocks || [])) { if (b.kind !== 'restaurant') continue; const rtags = deriveRestaurantTags({ foodType: b.foodType, halal: b.halal, veg: b.veg, englishMenu: b.englishMenu, priceRange: b.priceRange, name: b.name }); restaurants.push({ name: strip(b.name), province: a.crumbCity, foodType: b.foodType, rating: typeof b.rating === 'number' ? b.rating : undefined, ratingCount: typeof b.ratingCount === 'number' ? b.ratingCount : undefined, price: b.priceRange || undefined, hours: b.hours || undefined, img: asset(b.libImg || b.img || '') || undefined, tags: rtags.length ? rtags : undefined, lat: typeof b.lat === 'number' ? b.lat : undefined, lng: typeof b.lng === 'number' ? b.lng : undefined, url: `${U(a.slug)}#r${b.rank}`, listUrl: U(a.slug) }); } } catch {} }

  // 3) attractions + 4) guides — from articles by type
  const attractions = [], guides = [];
  for (const f of C('articles' + suffix)) { try { const a = read('articles' + suffix, f); const nm = strip(a.h1 || a.title); const row = { name: nm, city: a.crumbCity, type: a.type, img: asset(a.heroImg) || undefined, url: U(a.slug) }; if (a.type === 'attraction') { const tags = mergeTags(a.tags, deriveAttractionTags(nm)); if (tags.length) row.tags = tags; if (typeof a.lat === 'number') row.lat = a.lat; if (typeof a.lng === 'number') row.lng = a.lng; const sc = COORDS[canon(a.slug)]; if (row.lat == null && sc) { row.lat = sc.lat; row.lng = sc.lng; } attractions.push(row); } else if (a.type === 'prep' || a.type === 'itinerary' || a.type === 'guide') guides.push(row); } catch {} }

  // 5) faqs — aggregate destination/guide Q&A (roundups + prep/guide/itinerary articles) for AI Q&A ingestion.
  // Per-hotel review FAQs stay on-page (FAQPage schema already makes them citable) — keeps this feed a lean corpus.
  const faqs = [];
  for (const coll of ['roundups' + suffix, 'articles' + suffix]) {
    for (const f of C(coll)) { try { const r = read(coll, f); if (coll.startsWith('articles') && !FAQ_TYPES.has(r.type)) continue; if (!Array.isArray(r.faq)) continue; const u = U(r.slug); for (const qa of r.faq) { if (qa && qa.q && qa.a) { const a = strip(qa.a); faqs.push({ q: strip(qa.q), a: a.length > 320 ? a.slice(0, 317) + '…' : a, url: u }); } } } catch {} }
  }

  return { hotels, restaurants, attractions, guides, faqs };
}

const LIC = 'Attribution: ThailandAddict (thailandaddict.com)';
const meta = (type, lang, count) => ({ site: SITE, type, lang, updated: UPDATED, license: LIC, count });

// --- TH (canonical: full structured data on every kind) ---
const th = collect('', '');
write('hotels.json', { ...meta('hotels', 'th', th.hotels.length), items: th.hotels });
write('restaurants.json', { ...meta('restaurants', 'th', th.restaurants.length), items: th.restaurants });
write('attractions.json', { ...meta('attractions', 'th', th.attractions.length), items: th.attractions });
write('guides.json', { ...meta('guides', 'th', th.guides.length), items: th.guides });
write('faqs.json', { ...meta('faqs', 'th', th.faqs.length), items: th.faqs });

// --- EN (/en/ pages) — every kind now carries full structured data (the eat-ranking
// twins were translated with their restaurant blocks intact), so EN mirrors all 5 feeds. ---
const en = collect('-en', '/en');
write('hotels-en.json', { ...meta('hotels', 'en', en.hotels.length), items: en.hotels });
write('restaurants-en.json', { ...meta('restaurants', 'en', en.restaurants.length), items: en.restaurants });
write('attractions-en.json', { ...meta('attractions', 'en', en.attractions.length), items: en.attractions });
write('guides-en.json', { ...meta('guides', 'en', en.guides.length), items: en.guides });
write('faqs-en.json', { ...meta('faqs', 'en', en.faqs.length), items: en.faqs });

// --- Michelin Guide Thailand 2026 feed (485 restaurants, all tiers) — regenerated each build. ---
let michelinCount = 0;
try {
  const D = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/michelin-2026/michelin-2026.json'), 'utf8'));
  const U = slug => `${SITE}/${slug}`;   // root (TH) review URL
  const norm = s => String(s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9฀-๿]/g, '');
  // map normalized name -> single article {slug, img, price}
  const singleBy = new Map();
  for (const f of C('articles')) { if (!/^michelin-/.test(f)) continue; try { const a = read('articles', f); const rc = (a.blocks || []).find(b => b.kind === 'restaurant'); if (!rc) continue; const put = k => { if (k && k.length >= 3 && !singleBy.has(k)) singleBy.set(k, { slug: a.slug, img: asset(a.heroImg) || undefined, price: rc.priceRange || undefined, credit: a.heroCredit || undefined }); }; put(norm(rc.name)); put(norm(a.h1)); } catch {} }
  const M = [];
  for (const [arr, tier] of [['threeStar', '3-star'], ['twoStar', '2-star'], ['oneStar', '1-star'], ['bibGourmand', 'bib'], ['selected', 'selected']]) {
    for (const r of (D[arr] || [])) { const hit = singleBy.get(norm(r.name)) || singleBy.get(norm(r.nameThai)); M.push({ name: strip(r.name), nameThai: r.nameThai || undefined, tier, province: r.province || r.city || undefined, cuisine: r.cuisine || undefined, greenStar: r.greenStar || undefined, review: hit ? U(hit.slug) : undefined, img: hit && hit.img, price: hit && hit.price, michelin: r.url || undefined }); }
  }
  michelinCount = M.length;
  write('michelin.json', { ...meta('michelin', 'th', michelinCount), edition: D.edition || 'Thailand 2026', announced: D.announced || undefined, counts: { threeStar: (D.threeStar || []).length, twoStar: (D.twoStar || []).length, oneStar: (D.oneStar || []).length, bib: (D.bibGourmand || []).length, greenStar: (D.greenStar || []).length, selected: (D.selected || []).length }, items: M });
  console.log(`feed michelin: ${michelinCount} restaurants (${M.filter(x => x.review).length} with reviews)`);
} catch (e) { console.log('feed michelin: skipped (' + (e && e.message) + ')'); }

write('index.json', {
  site: SITE, name: 'ThailandAddict data feeds', updated: UPDATED,
  note: 'Machine-readable Thailand travel data. Free to use with attribution + a link to the source page. Each feed and item carries a lang (th/en) and a url to its source page.',
  feeds: [
    { type: 'hotels', lang: 'th', url: `${SITE}/feeds/hotels.json`, count: th.hotels.length },
    { type: 'restaurants', lang: 'th', url: `${SITE}/feeds/restaurants.json`, count: th.restaurants.length },
    { type: 'attractions', lang: 'th', url: `${SITE}/feeds/attractions.json`, count: th.attractions.length },
    { type: 'guides', lang: 'th', url: `${SITE}/feeds/guides.json`, count: th.guides.length },
    { type: 'faqs', lang: 'th', url: `${SITE}/feeds/faqs.json`, count: th.faqs.length },
    { type: 'hotels', lang: 'en', url: `${SITE}/feeds/hotels-en.json`, count: en.hotels.length },
    { type: 'restaurants', lang: 'en', url: `${SITE}/feeds/restaurants-en.json`, count: en.restaurants.length },
    { type: 'attractions', lang: 'en', url: `${SITE}/feeds/attractions-en.json`, count: en.attractions.length },
    { type: 'guides', lang: 'en', url: `${SITE}/feeds/guides-en.json`, count: en.guides.length },
    { type: 'faqs', lang: 'en', url: `${SITE}/feeds/faqs-en.json`, count: en.faqs.length },
    { type: 'michelin', lang: 'th', url: `${SITE}/feeds/michelin.json`, count: michelinCount },
  ],
});
console.log(`feeds TH: hotels ${th.hotels.length} · restaurants ${th.restaurants.length} · attractions ${th.attractions.length} · guides ${th.guides.length} · faqs ${th.faqs.length}`);
console.log(`feeds EN: hotels ${en.hotels.length} · restaurants ${en.restaurants.length} · attractions ${en.attractions.length} · guides ${en.guides.length} · faqs ${en.faqs.length}`);
