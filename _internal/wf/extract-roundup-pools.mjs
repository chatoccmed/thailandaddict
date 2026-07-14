// Extract verified hotel pools for Phase-5 roundups.
// Buckets existing reviews by zone, dedups, picks top-N by score, and bakes in
// the VERIFIED booking data (agodaUrl/bookingUrl/tripUrl/reviewUrl/img/score/rooms)
// so the writing agents only add prose — zero risk of hallucinated affiliate links.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('astro/src/content/reviews');
const OUT = path.resolve('_internal/wf/roundup-pools');
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.json'));
const reviews = [];
for (const f of files) {
  try { const r = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); r.__file = f; reviews.push(r); }
  catch (e) { /* skip */ }
}
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
const priceNum = r => { const p = String(r.qiPrice || r.priceRange || '').replace(/[^0-9]/g, ''); return p ? parseInt(p, 10) : 999999; };
const stars = r => { const n = parseInt(r.starRating, 10); return n >= 1 && n <= 5 ? '⭐'.repeat(n) : ''; };

function skeleton(r) {
  return {
    reviewSlug: r.slug,
    reviewUrl: r.slug + '.html',
    name: r.name,
    score: r.score,
    stars: stars(r),
    starRating: r.starRating || '',
    ratingCount: r.ratingCount || '',
    img: r.image || r.heroImg || '',
    priceBig: r.qiPrice || (r.priceRange ? r.priceRange : ''),
    priceNum: priceNum(r),
    rooms: r.rooms || [],
    agodaUrl: r.bookingAgoda || '',
    bookingUrl: r.bookingBooking || '',
    tripUrl: r.bookingTrip || '',
    addr: r.streetAddress || r.addressLocality || '',
    type: r.type || r.qiType || '',
    zoneHint: [r.hiLoc, r.loc, r.badgeLoc].filter(Boolean).join(' · '),
    introSnippet: String(r.intro || '').replace(/<[^>]+>/g, '').slice(0, 400),
  };
}

// city filter uses the review filename (slugs end with -<city>)
function pool(citySub) { return reviews.filter(r => (r.__file || '').includes(citySub)); }
function matchZone(r, kws) {
  const hay = norm([r.name, r.hiLoc, r.loc, r.badgeLoc, r.addr, r.streetAddress, r.addressLocality, r.qiType, r.type, r.intro].filter(Boolean).join(' '));
  return kws.some(k => hay.includes(norm(k)));
}
function dedup(list) {
  const seen = new Set(), out = [];
  for (const r of list) { const k = norm(r.name).replace(/\(.*?\)/g, '').trim(); if (seen.has(k)) continue; seen.add(k); out.push(r); }
  return out;
}

// Ordered zone assignment for Chiang Mai so a hotel lands in exactly one of my 3 CM roundups.
const CM = pool('chiang-mai');
const cmZones = {
  nimman: ['นิมมาน', 'nimman'],
  oldcity: ['เมืองเก่า', 'คูเมือง', 'old city', 'ประตูท่าแพ', 'ท่าแพ', 'ราชดำเนิน', 'พระสิงห์', 'ในเมืองเก่า'],
  nightbazaar: ['ไนท์บาซาร์', 'ช้างคลาน', 'night bazaar', 'chang klan', 'ริมปิง', 'ริมแม่น้ำ', 'วัดเกต', 'ping river', 'riverside'],
};
const cmAssigned = { nimman: [], oldcity: [], nightbazaar: [] };
for (const r of CM) {
  for (const [z, kws] of Object.entries(cmZones)) { if (matchZone(r, kws)) { cmAssigned[z].push(r); break; } }
}

const nameHas = (r, sub) => norm(r.name).includes(norm(sub));

const specs = [
  { slug: 'top10-nimman-hotels-chiang-mai', n: 10, list: cmAssigned.nimman },
  // Old City: drop Wualai-zone hotels (they belong to the existing wualai-walking-street roundup) to avoid cannibalization
  { slug: 'top10-old-city-hotels-chiang-mai', n: 10, list: cmAssigned.oldcity.filter(r => !matchZone(r, ['วัวลาย', 'wualai'])) },
  // Night Bazaar/Riverside: drop the Le Méridien review (same hotel as Chiang Mai Marriott after 2022 rebrand)
  { slug: 'top10-night-bazaar-hotels-chiang-mai', n: 10, list: cmAssigned.nightbazaar.filter(r => !nameHas(r, 'ridien')) },
  // Wongamat/Naklua: quality floor 8.0 → clean top 6 (drops the 7.5 outlier)
  { slug: 'top6-wongamat-naklua-hotels-pattaya', n: 6, list: pool('pattaya').filter(r => matchZone(r, ['นาเกลือ', 'วงศ์อมาตย์', 'naklua', 'wongamat']) && (parseFloat(r.score) || 0) >= 8.0) },
  { slug: 'top10-khao-lak-hotels-phang-nga', n: 10, list: pool('phang-nga').filter(r => matchZone(r, ['เขาหลัก', 'khao lak', 'khaolak', 'บางเนียง', 'นางทอง', 'ลำแก่น', 'takua pa', 'ตะกั่วป่า'])) },
  { slug: 'top8-budget-hotels-nakhon-nayok', n: 8, list: pool('nakhon-nayok').filter(r => priceNum(r) <= 2200) },
  // Koh Lipe ISLAND resorts only — match the island in the name (excludes mainland Pak Bara pier stays); Idyllic is on Lipe's Sunrise Beach
  { slug: 'top5-koh-lipe-hotels-satun', n: 5, list: pool('satun').filter(r => nameHas(r, 'lipe') || nameHas(r, 'idyllic')) },
];

const summary = [];
for (const s of specs) {
  const ranked = dedup(s.list).sort((a, b) => (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0)).slice(0, s.n);
  const skels = ranked.map(skeleton);
  fs.writeFileSync(path.join(OUT, s.slug + '.json'), JSON.stringify({ slug: s.slug, count: skels.length, hotels: skels }, null, 2));
  summary.push({ slug: s.slug, want: s.n, got: skels.length, names: skels.map(h => `${h.name} (${h.score}·${h.priceBig})`) });
}

for (const x of summary) {
  console.log(`\n### ${x.slug}  [${x.got}/${x.want}]`);
  x.names.forEach((n, i) => console.log(`  ${i + 1}. ${n}`));
}
console.log('\nPools written to ' + OUT);
