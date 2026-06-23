// Phase-1 Bangkok overlays: "hotels near <anchor>" proximity guides (medical tourism / MICE / airport).
// Reads researched, WebSearch-verified data from _internal/overlay-data/<slug>.json and emits TH+EN
// ArticleLayout articles (type=prep, cluster=bangkok) using the `ranked` block. The differentiator vs the
// ย่าน guides: every hotel card shows the REAL distance/time TO THE ANCHOR. Honest: real hotels only;
// approx prices labelled; per-hotel Agoda search (sponsored nofollow noopener); staycta links the zone's
// area hub + where-to-stay guide. EN mirrors TH, zero-Thai. Surfaces on city-bangkok via gen-hubs nearGuides().
// Run after research (validate first), before gen-hubs. Usage: node _internal/gen-overlay.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const DATA = path.join(ROOT, '_internal/overlay-data');
const PUB = path.join(ROOT, 'astro/public');
const DATE = '2026-06-23';
const AGODA = 'https://www.agoda.com/?cid=1965862';
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);
const klookU = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent(q)}&aid=121442`;
const gygU = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=__GYG_PARTNER_ID__`;
const agodaSearch = (name, cityEn) => `https://www.agoda.com/search?cid=1965862&q=${encodeURIComponent(`${name} ${cityEn}`)}`;

// records first (we need every overlay slug to count as a valid internal-link target before any file is written)
const files = fs.readdirSync(DATA).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
const records = files.map((f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')));
const overlaySlugs = new Set(records.map((r) => r.slug));
const byGroup = {};
for (const r of records) (byGroup[r.group] = byGroup[r.group] || []).push(r);

// valid internal-link targets (existing article slug OR roundup OR public hub OR an overlay we're writing this run).
// Roundups render to flat <slug>.html via Astro (format:'file') and audit-freshness treats them as valid targets.
const slugSet = new Set(fs.readdirSync(A_TH).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
const roundSet = new Set(fs.readdirSync(path.join(ROOT, 'astro/src/content/roundups')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
const hubSet = new Set(fs.readdirSync(PUB).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
const valid = (href) => { const b = String(href).replace(/\.html$/, ''); return slugSet.has(b) || roundSet.has(b) || hubSet.has(b) || overlaySlugs.has(b); };

// Distinct per-anchor hero images, remapped to EXISTING library photos (cm/ → served from R2 in prod, already
// uploaded — no new upload needed). Fallback = bangkok hero. All targets verified on disk by heroFor().
const HERO = {
  'hotels-near-bumrungrad': '/images/cm/bangkok-first-timer-guide.jpg',
  'hotels-near-bangkok-hospital': '/images/cm/bangkok-photo-spots-plan.jpg',
  'hotels-near-medpark': '/images/cm/bangkok-nature-green-plan.jpg',
  'hotels-near-samitivej-sukhumvit': '/images/cm/bangkok-dessert-bakery.jpg',
  'hotels-near-bnh': '/images/cm/bangkok-michelin-fine-dining.jpg',
  'hotels-near-vejthani': '/images/cm/bangkok-night-market-food.jpg',
  'hotels-near-siriraj': '/images/cm/bangkok-old-town-temples-plan.jpg',
  'hotels-near-chulalongkorn-hospital': '/images/cm/bangkok-attractions.jpg',
  'hotels-near-ramathibodi': '/images/cm/bangkok-cafe-guide.jpg',
  'hotels-near-qsncc': '/images/cm/bangkok-shopping-plan.jpg',
  'hotels-near-impact': '/images/cm/bangkok-3d2n-itinerary.jpg',
  'hotels-near-bitec': '/images/cm/bangkok-2d1n-itinerary.jpg',
  'hotels-near-suvarnabhumi': '/images/cm/bangkok-getting-around.jpg',
  'hotels-near-don-muang': '/images/cm/bangkok-travel-tips.jpg',
};
const heroFor = (r) => {
  const m = HERO[r.slug];
  if (m && fs.existsSync(path.join(PUB, m.replace(/^\//, '')))) return m;
  return `/images/heroes/${r.hero || 'bangkok'}.jpg`;
};

// group-aware framing (emoji, eyebrow, audience, chips, sibling-section label)
const GROUP = {
  medical: { emoji: '🏥',
    eyebrowTh: 'ที่พักใกล้โรงพยาบาล · กรุงเทพ', eyebrowEn: 'Hotels near the hospital · Bangkok',
    audienceTh: 'ญาติผู้ป่วยและคนมารักษาตัว', audienceEn: 'patients and their families',
    chipTh: ['เดิน/รถถึงโรงพยาบาล', 'เหมาะกับญาติผู้ป่วย', 'ราคาเริ่มต้น'], chipEn: ['Walk/short ride to the hospital', 'For patient families', 'Starting prices'],
    sibTh: '🏥 โรงแรมใกล้โรงพยาบาลอื่น', sibEn: '🏥 Hotels near other hospitals' },
  mice: { emoji: '🎪',
    eyebrowTh: 'ที่พักใกล้ศูนย์ประชุม/อีเวนต์ · กรุงเทพ', eyebrowEn: 'Hotels near the venue · Bangkok',
    audienceTh: 'คนมางานประชุม เอ็กซ์โป และคอนเสิร์ต', audienceEn: 'expo, conference and concert-goers',
    chipTh: ['เดิน/รถถึงงาน', 'เหมาะกับคนมาประชุม', 'ราคาเริ่มต้น'], chipEn: ['Walk/short ride to the venue', 'For event-goers', 'Starting prices'],
    sibTh: '🎪 โรงแรมใกล้ศูนย์ประชุม/อีเวนต์อื่น', sibEn: '🎪 Hotels near other venues' },
  airport: { emoji: '✈️',
    eyebrowTh: 'ที่พักใกล้สนามบิน · กรุงเทพ', eyebrowEn: 'Hotels near the airport · Bangkok',
    audienceTh: 'คนต่อเครื่อง ไฟลต์เช้า และมาถึงดึก', audienceEn: 'layover, early-flight and late-arrival travellers',
    chipTh: ['มีรถรับส่งสนามบิน', 'เหมาะกับไฟลต์เช้า/ดึก', 'ราคาเริ่มต้น'], chipEn: ['Airport shuttle', 'For early/late flights', 'Starting prices'],
    sibTh: '✈️ โรงแรมใกล้สนามบิน/แลนด์มาร์กอื่น', sibEn: '✈️ Hotels near other landmarks' },
};

function expCity(cityTh, cityEn, loc) {
  const en = loc === 'en';
  return { kind: 'experiences',
    title: en ? `Things to do in ${cityEn} — book tours & tickets` : `เที่ยว ${cityTh} ให้สนุก — จองทัวร์ & กิจกรรม`,
    text: en ? `Booking online ahead on Klook or GetYourGuide is usually cheaper than the gate and skips the queue.` : `จองออนไลน์ล่วงหน้าผ่าน Klook หรือ GetYourGuide มักได้ราคาดีกว่าหน้างานและไม่ต้องต่อคิว`,
    items: [
      { emoji: '🎟️', provider: 'Klook', label: en ? `Top tours in ${cityEn}` : `ทัวร์ยอดนิยม ${cityTh}`, note: en ? 'Highlights, guided' : 'ไฮไลต์ มีไกด์พาไป', href: klookU(`${cityEn} tour`) },
      { emoji: '🎟️', provider: 'Klook', label: en ? `${cityEn} attractions & tickets` : `ตั๋ว & ที่เที่ยว ${cityTh}`, note: en ? 'Skip-the-line tickets' : 'ตั๋วเข้าชม ไม่ต้องต่อคิว', href: klookU(`${cityEn} attractions ticket`) },
      { emoji: '🚐', provider: 'Klook', label: en ? `Day trips from ${cityEn}` : `เดย์ทริปจาก ${cityTh}`, note: en ? 'Out and back in a day' : 'ไปเช้า-เย็นกลับ', href: klookU(`${cityEn} day trip`) },
      { emoji: '🌎', provider: 'GetYourGuide', label: en ? `${cityEn} activities (GetYourGuide)` : `กิจกรรม ${cityTh} (GetYourGuide)`, note: en ? 'Compare another marketplace' : 'อีกเจ้าให้เทียบราคา', href: gygU(cityEn) },
    ],
    ctaLabel: en ? `🎟️ See all ${cityEn} tours & activities (Klook)` : `🎟️ ดูทัวร์ & กิจกรรม ${cityTh} ทั้งหมด (Klook)`, ctaHref: klookU(cityEn) };
}

function bookLink(loc, name, cityEn) {
  const a = agodaSearch(name, cityEn);
  return loc === 'en'
    ? `<a href="${a}" target="_blank" rel="sponsored nofollow noopener">🔎 Find a deal on Agoda</a>`
    : `<a href="${a}" target="_blank" rel="sponsored nofollow noopener">🔎 หาดีลบน Agoda</a>`;
}

function buildArticle(r, loc) {
  const en = loc === 'en';
  const cityTh = r.cityTh, cityEn = r.cityEn;
  const aTh = r.anchorTh, aEn = r.anchorEn, asTh = r.anchorShortTh, asEn = r.anchorShortEn;
  const zoneTh = r.zoneTh, zoneEn = r.zoneEn, zone = r.zoneSlug;
  const G = GROUP[r.group] || GROUP.medical;
  const n = r.hotels.length;
  // ranked block — distance TO THE ANCHOR leads every card (the whole point of an overlay page)
  const ranked = {
    kind: 'ranked',
    items: r.hotels.map((h, i) => ({
      rank: i + 1, name: h.name,
      meta: en
        ? `📍 ${h.distEn} to ${asEn} · ★ ${h.star}-star · Best for: ${h.bestForEn} · ${bookLink('en', h.name, cityEn)}`
        : `📍 ${h.distTh}ถึง${asTh} · ★ ${h.star} ดาว · เหมาะ: ${h.bestForTh} · ${bookLink('th', h.name, cityEn)}`,
      blurb: en ? h.whyEn : h.whyTh,
      price: en ? `from ~฿${h.priceFromTHB} (approx)` : `จาก ~฿${h.priceFromTHB} (โดยประมาณ)`,
      tags: [],
    })),
  };
  // staycta → the zone's area hub + its where-to-stay guide (both guarded)
  const ctaLinks = [];
  if (valid(`area-bangkok-${zone}.html`)) ctaLinks.push({ label: en ? `🏘️ Stay in ${zoneEn} (whole area)` : `🏘️ พักย่าน${zoneTh} (ดูทั้งย่าน)`, href: `area-bangkok-${zone}.html`, note: en ? 'Area hub: stays, food, sights' : 'ฮับย่าน: ที่พัก ที่กิน ที่เที่ยว' });
  if (valid(`where-to-stay-bangkok-${zone}.html`)) ctaLinks.push({ label: en ? `🏨 ${zoneEn} hotel guide` : `🏨 คู่มือที่พักย่าน${zoneTh}`, href: `where-to-stay-bangkok-${zone}.html`, note: en ? 'Every budget, by micro-area' : 'ทุกงบ ทำเลรายย่าน' });
  if (valid(`top10-hotels-bangkok.html`)) ctaLinks.push({ label: en ? `⭐ Top Bangkok hotels (reviews)` : `⭐ Top โรงแรมกรุงเทพ (รีวิวจริง)`, href: `top10-hotels-bangkok.html`, note: en ? 'Ranked + price compare' : 'จัดอันดับ + เทียบราคา' });
  const blocks = [
    { kind: 'p', html: en ? r.quickEn : r.quickTh },
    { kind: 'h2', text: en ? `Hotels near ${asEn}, by distance & budget` : `โรงแรมใกล้${asTh} เรียงตามระยะและงบ`, id: 'hotels' },
    ranked,
    expCity(cityTh, cityEn, loc),
    { kind: 'staycta',
      title: en ? `Compare ${zoneEn} hotels & prices` : `เทียบราคาที่พักย่าน${zoneTh}`,
      text: en ? `${asEn} sits in the ${zoneEn} area. See every stay nearby with prices compared across Agoda, Booking and Trip.com, then book the one that's closest and fits your budget.` : `${asTh}อยู่ย่าน${zoneTh} — ดูที่พักทั้งย่านนี้ เทียบราคา Agoda · Booking · Trip.com แล้วจองที่ที่ใกล้และเข้างบที่สุด`,
      links: ctaLinks,
      ctaLabel: en ? 'Search hotels on Agoda' : 'ค้นหาโรงแรมบน Agoda', ctaHref: AGODA },
  ];
  // related: zone hub + zone guide + city + top10 + sibling overlays (same group first) + getting-around + plan
  const rel = [];
  const pushIf = (href, title) => { if (valid(href) && !rel.some((x) => x.href === href)) rel.push({ href, title }); };
  pushIf(`area-bangkok-${zone}.html`, en ? `🏘️ Stay in ${zoneEn}` : `🏘️ พักย่าน${zoneTh}`);
  pushIf(`where-to-stay-bangkok-${zone}.html`, en ? `🏨 ${zoneEn} hotel guide` : `🏨 คู่มือที่พักย่าน${zoneTh}`);
  pushIf(`city-bangkok.html`, en ? `🗺️ Explore Bangkok` : `🗺️ เที่ยวกรุงเทพ`);
  // siblings: same group first, then others — up to 3 total
  const sibs = [...(byGroup[r.group] || []), ...records.filter((x) => x.group !== r.group)];
  for (const s of sibs) {
    if (s.slug === r.slug) continue;
    if (rel.filter((x) => x.href.startsWith('hotels-near-')).length >= 3) break;
    pushIf(`${s.slug}.html`, en ? `${G.emoji} Hotels near ${s.anchorShortEn}` : `${G.emoji} โรงแรมใกล้${s.anchorShortTh}`);
  }
  pushIf('where-to-stay-bangkok.html', en ? `🏨 Where to stay in Bangkok (overview)` : `🏨 พักย่านไหนในกรุงเทพ (ภาพรวม)`);
  pushIf('getting-around-thailand.html', en ? '🚌 Getting around Thailand' : '🚌 คู่มือการเดินทางทั่วไทย');
  pushIf('plan-your-trip.html', en ? '🧭 Plan Your Trip hub' : '🧭 ศูนย์รวมคู่มือเตรียมตัว');
  return {
    slug: r.slug, type: 'prep', cluster: 'bangkok',
    title: en ? `Hotels Near ${aEn}, ${cityEn} 2026 — ${n} Closest Stays + Booking Links | ThailandAddict`
             : `โรงแรมใกล้${aTh} ${cityTh} 2026 — ${n} ที่พักใกล้สุด พร้อมระยะทางและลิงก์จอง | ThailandAddict`,
    metaDesc: en ? `The ${n} closest hotels to ${aEn} in ${cityEn} — each with the real walking or driving distance to ${asEn}, what it's best for, approximate starting prices and booking links. Made for ${G.audienceEn}.`
                 : `รวม ${n} โรงแรมและที่พักที่อยู่ใกล้${aTh}จริง บอกระยะเดิน-รถถึง${asTh}ทุกที่ พร้อมจุดเด่น ราคาเริ่มต้นโดยประมาณ และลิงก์จอง — ทำมาเพื่อ${G.audienceTh}`,
    ogTitle: en ? `Hotels near ${aEn}` : `โรงแรมใกล้${aTh}`,
    ogDesc: en ? `The ${n} closest stays to ${asEn}, with real distances and prices.` : `${n} ที่พักใกล้${asTh}ที่สุด พร้อมระยะทางจริงและราคา`,
    image: heroFor(r), heroImg: heroFor(r),
    crumbCity: cityEn === 'Bangkok' && !en ? cityTh : cityEn, crumbCityHref: `city-bangkok.html`,
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: en ? G.eyebrowEn : G.eyebrowTh,
    h1: en ? `Hotels near<br>${asEn}` : `โรงแรมใกล้<br>${asTh}`,
    heroEmoji: G.emoji,
    intro: en ? r.introEn : r.introTh,
    chips: en ? G.chipEn : G.chipTh,
    readTime: en ? '5 min read' : '5 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: r.faq.map((f) => ({ q: en ? f.qEn : f.qTh, a: en ? f.aEn : f.aTh })),
    related: rel,
  };
}

let nWrote = 0; const leaks = [], misaligned = [];
for (const r of records) {
  const th = buildArticle(r, 'th'), en = buildArticle(r, 'en');
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) { misaligned.push(r.slug + ':blocks'); continue; }
  if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) { misaligned.push(r.slug + ':keys'); continue; }
  if (th.related.length !== en.related.length || th.faq.length !== en.faq.length) { misaligned.push(r.slug + ':rel/faq'); continue; }
  if (hasThai(JSON.stringify(en).replace(/฿/g, ''))) { leaks.push(r.slug); continue; }
  fs.writeFileSync(path.join(A_TH, th.slug + '.json'), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, en.slug + '.json'), JSON.stringify(en, null, 2) + '\n');
  nWrote++;
}
console.log(JSON.stringify({ written: nWrote, records: records.length, slugs: records.map((r) => r.slug), enThaiLeaks: leaks, misaligned }, null, 2));
if (leaks.length || misaligned.length) process.exit(1);
