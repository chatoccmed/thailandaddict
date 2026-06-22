// Activity / tour / wellness / cooking / golf guides — the site's first NON-hotel roundups.
// Reads WebSearch-verified data from _internal/activity-data/<slug>.json → emits TH+EN ArticleLayout
// articles using the `ranked` block + a Klook `experiences` module. Klook aid=121442 live (search links,
// sponsored nofollow); GYG placeholder. Internal-links the city's real attraction articles (SEO).
// type=attraction (tours/activities) → See tab · type=guide (themed) → Prep tab. cluster=<city>.
// Run before gen-hubs. Usage: node _internal/gen-activities.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const DATA = path.join(ROOT, '_internal/activity-data');
const PUB = path.join(ROOT, 'astro/public');
const DATE = '2026-06-22';
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const klookU = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent(q)}&aid=121442`;
const gygU = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=__GYG_PARTNER_ID__`;

const slugSet = new Set(fs.readdirSync(A_TH).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
const hubSet = new Set(fs.readdirSync(PUB).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
const valid = (href) => { const b = String(href).replace(/\.html$/, ''); return slugSet.has(b) || hubSet.has(b); };

// Distinct hero per activity page (avoid every card reusing the city skyline on the hub). Fallback = city hero.
const HERO_ACT = {
  'tours-activities-bangkok': '/images/cm/bangkok-attractions.jpg',
  'cooking-classes-bangkok': '/images/cm/bangkok-food-guide.jpg',
};
const heroFor = (r) => { const m = HERO_ACT[r.slug]; return (m && fs.existsSync(path.join(PUB, m.replace(/^\//, '')))) ? m : `/images/heroes/${r.hero}.jpg`; };

// city → its real attraction articles (internal-link density). Returns locale-correct display names
// (reads the EN mirror too, so EN related-links never leak Thai). Uses the attraction name, not its tagline.
const firstLine = (s) => strip(String(s || '').split(/<br\s*\/?>/i)[0]);
function cityAttractions(city) {
  const out = [];
  for (const f of fs.readdirSync(A_TH)) {
    if (!f.endsWith('.json')) continue;
    let o; try { o = JSON.parse(fs.readFileSync(path.join(A_TH, f), 'utf8')); } catch { continue; }
    if (o.cluster !== city || o.type !== 'attraction') continue;
    let en = null; try { en = JSON.parse(fs.readFileSync(path.join(A_EN, f), 'utf8')); } catch {}
    out.push({ slug: o.slug, th: firstLine(o.h1 || o.title).slice(0, 40), en: firstLine((en && (en.h1 || en.title)) || o.slug).slice(0, 40) });
  }
  return out;
}

function expCity(cityTh, cityEn, loc) {
  const en = loc === 'en';
  return { kind: 'experiences',
    title: en ? `Book ${cityEn} tours & tickets` : `จองทัวร์ & ตั๋ว ${cityTh}`,
    text: en ? `Booking ahead on Klook or GetYourGuide is usually cheaper than the gate and skips the queue.` : `จองล่วงหน้าผ่าน Klook หรือ GetYourGuide มักได้ราคาดีกว่าหน้างานและไม่ต้องต่อคิว`,
    items: [
      { emoji: '🎟️', provider: 'Klook', label: en ? `Top tours in ${cityEn}` : `ทัวร์ยอดนิยม ${cityTh}`, note: en ? 'Highlights, guided' : 'ไฮไลต์ มีไกด์พาไป', href: klookU(`${cityEn} tour`) },
      { emoji: '🎫', provider: 'Klook', label: en ? `${cityEn} attraction tickets` : `ตั๋วเข้าชม ${cityTh}`, note: en ? 'Skip-the-line' : 'ไม่ต้องต่อคิว', href: klookU(`${cityEn} attractions ticket`) },
      { emoji: '🚐', provider: 'Klook', label: en ? `Day trips from ${cityEn}` : `เดย์ทริปจาก ${cityTh}`, note: en ? 'Out and back in a day' : 'ไปเช้า-เย็นกลับ', href: klookU(`${cityEn} day trip`) },
      { emoji: '🌎', provider: 'GetYourGuide', label: en ? `${cityEn} activities (GetYourGuide)` : `กิจกรรม ${cityTh} (GetYourGuide)`, note: en ? 'Compare another marketplace' : 'อีกเจ้าให้เทียบราคา', href: gygU(cityEn) },
    ],
    ctaLabel: en ? `🎟️ See all ${cityEn} tours & activities (Klook)` : `🎟️ ดูทัวร์ & กิจกรรม ${cityTh} ทั้งหมด (Klook)`, ctaHref: klookU(cityEn) };
}

function bookLink(loc, q) {
  const u = klookU(q);
  return loc === 'en'
    ? `<a href="${u}" target="_blank" rel="sponsored nofollow noopener">🎟️ Book on Klook</a>`
    : `<a href="${u}" target="_blank" rel="sponsored nofollow noopener">🎟️ จองบน Klook</a>`;
}

function buildArticle(r, loc) {
  const en = loc === 'en';
  const cityTh = r.cityTh, cityEn = r.cityEn, cityName = en ? cityEn : cityTh;
  const ranked = {
    kind: 'ranked',
    items: r.items.map((it, i) => ({
      rank: i + 1, name: en ? it.nameEn : it.nameTh,
      meta: bookLink(loc, it.klookQ),
      blurb: en ? it.blurbEn : it.blurbTh,
      tags: (en ? it.tagsEn : it.tagsTh) || [],
    })),
  };
  const blocks = [
    { kind: 'p', html: en ? r.quickEn : r.quickTh },
    { kind: 'h2', text: en ? (r.type === 'attraction' ? `Top picks in ${cityEn}` : `The picks`) : (r.type === 'attraction' ? `ตัวเลือกเด่นใน${cityTh}` : `ตัวเลือกเด่น`), id: 'picks' },
    ranked,
    expCity(cityTh, cityEn, loc),
    { kind: 'cta', text: en ? `Not sure yet? Compare destinations and plan your trip in the Plan hub.` : `ยังเลือกไม่ได้? เทียบจุดหมายและวางแผนต่อในศูนย์รวมคู่มือเที่ยว`, href: 'plan-your-trip.html', label: en ? '🧭 Plan your trip' : '🧭 วางแผนเที่ยว' },
  ];
  // related: city hub + a few real attraction articles (internal-link density) + plan + destinations
  const rel = [];
  const pushIf = (href, title) => { if (valid(href) && !rel.some((x) => x.href === href)) rel.push({ href, title }); };
  pushIf(`city-${r.city}.html`, en ? `🗺️ Explore ${cityEn}` : `🗺️ เที่ยว${cityTh}`);
  for (const a of cityAttractions(r.city)) {
    if (rel.length >= 6) break;
    pushIf(`${a.slug}.html`, `📍 ${en ? a.en : a.th}`);
  }
  pushIf('plan-your-trip.html', en ? '🧭 Plan Your Trip hub' : '🧭 ศูนย์รวมคู่มือเตรียมตัว');
  pushIf('destinations.html', en ? '🗺️ All top destinations' : '🗺️ เมืองท่องเที่ยวทั้งหมด');
  return {
    slug: r.slug, type: r.type, cluster: r.city,
    title: en ? r.titleEn : r.titleTh, metaDesc: en ? r.metaDescEn : r.metaDescTh,
    ogTitle: (en ? r.titleEn : r.titleTh).split(' | ')[0], ogDesc: en ? r.introEn : r.introTh,
    image: heroFor(r), heroImg: heroFor(r),
    crumbCity: cityName, crumbCityHref: `city-${r.city}.html`,
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: en ? r.eyebrowEn : r.eyebrowTh,
    h1: en ? r.h1En : r.h1Th,
    heroEmoji: r.emoji,
    intro: en ? r.introEn : r.introTh,
    chips: en ? ['Ranked picks', 'Book on Klook', 'Real & verified'] : ['คัดมาให้', 'จองผ่าน Klook', 'ของจริงทั้งหมด'],
    readTime: en ? '5 min read' : '5 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: r.faq.map((f) => ({ q: en ? f.qEn : f.qTh, a: en ? f.aEn : f.aTh })),
    related: rel,
  };
}

let n = 0; const leaks = [], misaligned = [], slugs = [];
for (const f of fs.readdirSync(DATA).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
  const th = buildArticle(r, 'th'), en = buildArticle(r, 'en');
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) { misaligned.push(r.slug); continue; }
  if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) { misaligned.push(r.slug + ':keys'); continue; }
  if (hasThai(JSON.stringify(en).replace(/฿/g, ''))) { leaks.push(r.slug); continue; }
  fs.writeFileSync(path.join(A_TH, r.slug + '.json'), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, r.slug + '.json'), JSON.stringify(en, null, 2) + '\n');
  n++; slugs.push(r.slug);
}
console.log(JSON.stringify({ written: n, slugs, enThaiLeaks: leaks, misaligned }, null, 2));
