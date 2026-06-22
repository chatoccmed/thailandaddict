// Per-neighborhood "best hotels in <area>" guides (decision-stage, high booking intent).
// Reads researched, WebSearch-verified hotel data from _internal/neighborhood-data/<city>__<hood>.json
// and emits TH+EN ArticleLayout articles (type=prep, cluster=<city>) using the `ranked` block.
// Honest: real hotels only; approx prices labelled; per-hotel Agoda search (sponsored nofollow) in meta;
// page CTA links the REAL top10-hotels roundup. EN mirrors TH, zero-Thai. Surfaces on city hub Prep tab.
// Run after research, before gen-hubs. Usage: node _internal/gen-neighborhood-hotels.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const DATA = path.join(ROOT, '_internal/neighborhood-data');
const PUB = path.join(ROOT, 'astro/public');
const DATE = '2026-06-22';
const AGODA = 'https://www.agoda.com/?cid=1965862';
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);
const klookU = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent(q)}&aid=121442`;
const gygU = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=__GYG_PARTNER_ID__`;
const agodaSearch = (name, cityEn) => `https://www.agoda.com/search?cid=1965862&q=${encodeURIComponent(`${name} ${cityEn}`)}`;

// valid internal-link targets (article slug OR public hub) — guards related/staycta so audit-freshness stays 0.
const slugSet = new Set(fs.readdirSync(A_TH).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
const hubSet = new Set(fs.readdirSync(PUB).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
const valid = (href) => { const b = String(href).replace(/\.html$/, ''); return slugSet.has(b) || hubSet.has(b); };

// Distinct per-area hero images (remap to existing library photos so the city hub's Prep tab
// isn't 14 identical skylines). Key = `<city>-<hood>`; fallback = the city hero. All targets verified on disk.
const HERO = {
  'bangkok-sukhumvit': '/images/cm/bangkok-rooftop-bars.jpg',
  'bangkok-thong-lo': '/images/cm/bangkok-cafe-hopping-plan.jpg',
  'bangkok-silom-sathorn': '/images/cm/bangkok-michelin-fine-dining.jpg',
  'bangkok-khao-san': '/images/cm/bangkok-old-town-temples-plan.jpg',
  'bangkok-riverside': '/images/hotels/bangkok-peninsula-1.jpg',
  'bangkok-chinatown': '/images/cm/bangkok-street-food-yaowarat.jpg',
  'bangkok-siam-pratunam': '/images/cm/bangkok-shopping-plan.jpg',
  'bangkok-ari': '/images/cm/bangkok-cafe-guide.jpg',
  'bangkok-ratchada': '/images/cm/bangkok-night-market-food.jpg',
  'bangkok-on-nut': '/images/cm/bangkok-mookata-buffet.jpg',
  'bangkok-phrom-phong': '/images/cm/bangkok-dessert-bakery.jpg',
  'bangkok-chidlom': '/images/cm/bangkok-1-day-itinerary.jpg',
  'bangkok-samyan': '/images/cm/bangkok-first-timer-guide.jpg',
  'bangkok-victory-monument': '/images/cm/bangkok-boat-noodles.jpg',
  'bangkok-rama9': '/images/cm/bangkok-photo-spots-plan.jpg',
  'bangkok-ladprao': '/images/cm/bangkok-khao-gaeng.jpg',
  'bangkok-mochit-chatuchak': '/images/cm/chatuchak-market-guide.jpg',
  'bangkok-central-ladprao': '/images/cm/bangkok-family-plan.jpg',
  'bangkok-kaset': '/images/cm/bangkok-local-breakfast.jpg',
  'bangkok-ramkhamhaeng': '/images/cm/bangkok-getting-around.jpg',
  'bangkok-bangna': '/images/cm/bangkok-nature-green-plan.jpg',
  'bangkok-pinklao': '/images/cm/bangkok-floating-markets.jpg',
  'bangkok-chaeng-watthana': '/images/cm/bangkok-travel-tips.jpg',
  'bangkok-bang-khen': '/images/cm/bangkok-ayutthaya-day-trip.jpg',
  'bangkok-charoen-krung': '/images/cm/charoenkrung-talat-noi.jpg',
  'bangkok-ratchathewi': '/images/hotels/bangkok-siamatsiam-1.jpg',
  'bangkok-ploenchit': '/images/cm/bangkok-2d1n-itinerary.jpg',
  'bangkok-bang-sue': '/images/cm/bangkok-3d2n-itinerary.jpg',
  'bangkok-srinakarin': '/images/cm/bangkok-seafood.jpg',
  'bangkok-bangkapi': '/images/cm/bangkok-family-plan.jpg',
  'bangkok-talat-phlu': '/images/cm/bangkok-khao-gaeng.jpg',
};
const heroFor = (r) => {
  const m = HERO[`${r.city}-${r.hood}`];
  if (m && fs.existsSync(path.join(PUB, m.replace(/^\//, '')))) return m;
  return `/images/heroes/${r.hero}.jpg`;
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

// group records by city → for sibling cross-links
const files = fs.readdirSync(DATA).filter((f) => f.endsWith('.json'));
const records = files.map((f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')));
const byCity = {};
for (const r of records) (byCity[r.city] = byCity[r.city] || []).push(r);

function bookLink(loc, name, cityEn) {
  const a = agodaSearch(name, cityEn);
  return loc === 'en'
    ? `<a href="${a}" target="_blank" rel="sponsored nofollow noopener">🔎 Find a deal on Agoda</a>`
    : `<a href="${a}" target="_blank" rel="sponsored nofollow noopener">🔎 หาดีลบน Agoda</a>`;
}

function buildArticle(r, loc) {
  const en = loc === 'en';
  const cityTh = r.cityTh, cityEn = r.cityEn, hoodTh = r.hoodTh, hoodEn = r.hoodEn;
  const hoodName = en ? hoodEn : hoodTh, cityName = en ? cityEn : cityTh;
  const slug = `where-to-stay-${r.city}-${r.hood}`;
  const ranked = {
    kind: 'ranked',
    items: r.hotels.map((h, i) => ({
      rank: i + 1, name: h.name,
      meta: en
        ? `★ ${h.star}-star · Best for: ${h.bestForEn} · ${bookLink('en', h.name, cityEn)}`
        : `★ ${h.star} ดาว · เหมาะ: ${h.bestForTh} · ${bookLink('th', h.name, cityEn)}`,
      blurb: en ? h.whyEn : h.whyTh,
      price: en ? `from ~฿${h.priceFromTHB} (approx)` : `จาก ~฿${h.priceFromTHB} (โดยประมาณ)`,
      tags: [],
    })),
  };
  // staycta links — only include targets that resolve
  const ctaLinks = [];
  if (valid(`top10-hotels-${r.city}.html`)) ctaLinks.push({ label: en ? `⭐ Top ${cityEn} hotels (real reviews)` : `⭐ Top โรงแรม${cityTh} (รีวิวจริง)`, href: `top10-hotels-${r.city}.html`, note: en ? 'Ranked + price compare' : 'จัดอันดับ + เทียบราคา' });
  if (valid(`city-${r.city}.html`)) ctaLinks.push({ label: en ? `🗺️ ${cityEn} travel guide` : `🗺️ คู่มือเที่ยว${cityTh}`, href: `city-${r.city}.html`, note: en ? 'Stays, food, things to do' : 'ที่พัก ที่กิน ที่เที่ยว' });
  const blocks = [
    { kind: 'p', html: en ? r.quickEn : r.quickTh },
    { kind: 'h2', text: en ? `Recommended hotels in ${hoodEn}` : `โรงแรมแนะนำย่าน${hoodTh}`, id: 'hotels' },
    ranked,
    expCity(cityTh, cityEn, loc),
    { kind: 'staycta',
      title: en ? `Compare every ${cityEn} hotel & price` : `เทียบราคาโรงแรม${cityTh}ทุกที่`,
      text: en ? `See our ranked ${cityEn} hotels with prices compared across Agoda, Booking and Trip.com, then book the one that fits your area and budget.` : `ดูรีวิวโรงแรม${cityTh}จัดอันดับ เทียบราคา Agoda · Booking · Trip.com แล้วจองที่ที่ใช่ในย่านและงบของคุณ`,
      links: ctaLinks,
      ctaLabel: en ? 'Search hotels on Agoda' : 'ค้นหาโรงแรมบน Agoda', ctaHref: AGODA },
  ];
  // related: overview where-to-stay + city hub + top10 + siblings + plan/getting-around (validated)
  const rel = [];
  const pushIf = (href, title) => { if (valid(href)) rel.push({ href, title }); };
  pushIf(`where-to-stay-${r.city}.html`, en ? `🏨 Where to stay in ${cityEn} (overview)` : `🏨 พักย่านไหนใน${cityTh} (ภาพรวม)`);
  pushIf(`city-${r.city}.html`, en ? `🗺️ Explore ${cityEn}` : `🗺️ เที่ยว${cityTh}`);
  pushIf(`top10-hotels-${r.city}.html`, en ? `⭐ Top ${cityEn} hotels` : `⭐ Top โรงแรม${cityTh}`);
  for (const s of (byCity[r.city] || [])) {       // up to 3 sibling neighborhoods
    if (s.hood === r.hood) continue;
    if (rel.filter((x) => x.href.startsWith(`where-to-stay-${r.city}-`)).length >= 3) break;
    pushIf(`where-to-stay-${r.city}-${s.hood}.html`, en ? `🏘️ Hotels in ${s.hoodEn}` : `🏘️ โรงแรมย่าน${s.hoodTh}`);
  }
  pushIf('getting-around-thailand.html', en ? '🚌 Getting around Thailand' : '🚌 คู่มือการเดินทางทั่วไทย');
  pushIf('plan-your-trip.html', en ? '🧭 Plan Your Trip hub' : '🧭 ศูนย์รวมคู่มือเตรียมตัว');
  return {
    slug, type: 'prep', cluster: r.city,
    title: en ? `Where to Stay in ${hoodEn}, ${cityEn} 2026 — Best Hotels by Budget | ThailandAddict`
             : `พักย่าน${hoodTh} ${cityTh} 2026 — โรงแรมแนะนำทุกงบ พร้อมลิงก์จอง | ThailandAddict`,
    metaDesc: en ? `The best hotels in ${hoodEn}, ${cityEn} for every budget — from cheap to luxury — with what each is good for, the location, approximate starting prices and booking links.`
                 : `โรงแรมน่าพักย่าน${hoodTh} ${cityTh} คัดมาทุกงบตั้งแต่ประหยัดถึงหรู พร้อมจุดเด่น ทำเล ราคาเริ่มต้นโดยประมาณ และลิงก์จอง`,
    ogTitle: en ? `Where to Stay in ${hoodEn}, ${cityEn}` : `พักย่าน${hoodTh} ${cityTh}`,
    ogDesc: en ? `The best hotels in ${hoodEn} by budget.` : `โรงแรมน่าพักย่าน${hoodTh} เลือกตามงบ`,
    image: heroFor(r), heroImg: heroFor(r),
    crumbCity: cityName, crumbCityHref: `city-${r.city}.html`,
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: en ? `Hotels by area · ${cityEn}` : `โรงแรมรายย่าน · ${cityTh}`,
    h1: en ? `Where to stay in<br>${hoodEn}` : `พักย่าน<br>${hoodTh}`,
    heroEmoji: '🏨',
    intro: en ? r.introEn : r.introTh,
    chips: en ? ['Every budget', 'By micro-area', 'Booking links'] : ['ทุกงบ', 'ทำเลรายย่าน', 'ลิงก์จอง'],
    readTime: en ? '5 min read' : '5 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: r.faq.map((f) => ({ q: en ? f.qEn : f.qTh, a: en ? f.aEn : f.aTh })),
    related: rel,
  };
}

let n = 0; const leaks = [], misaligned = [];
for (const r of records) {
  const th = buildArticle(r, 'th'), en = buildArticle(r, 'en');
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) { misaligned.push(r.hood); continue; }
  if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) { misaligned.push(r.hood + ':keys'); continue; }
  if (hasThai(JSON.stringify(en).replace(/฿/g, ''))) { leaks.push(`${r.city}-${r.hood}`); continue; }
  fs.writeFileSync(path.join(A_TH, th.slug + '.json'), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, en.slug + '.json'), JSON.stringify(en, null, 2) + '\n');
  n++;
}
console.log(JSON.stringify({ written: n, records: records.length, slugs: records.map((r) => `where-to-stay-${r.city}-${r.hood}`), enThaiLeaks: leaks, misaligned }, null, 2));
