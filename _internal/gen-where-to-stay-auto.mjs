// Nationwide "where to stay in <City>" coverage — data-driven, NO fabrication.
// For every city that has a hub + a top10-hotels roundup (TH+EN) and is NOT one of the
// hand-written guides in gen-stay-compare.mjs, build a where-to-stay guide from REAL data:
//   - the city's actual top-reviewed hotels (name · price · best-for) straight from the roundup
//   - province-data tagline (TH) for context
//   - a Klook/GetYourGuide experiences block (monetize tours)
// type=prep, cluster=<slug> → auto-surfaces on the city hub (Stay-tab callout + Prep tab).
// Run after gen-stay-compare. Usage: node _internal/gen-where-to-stay-auto.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const R_TH = path.join(ROOT, 'astro/src/content/roundups');
const R_EN = path.join(ROOT, 'astro/src/content/roundups-en');
const PD = path.join(ROOT, '_internal/province-data');
const PUB = path.join(ROOT, 'astro/public');
const DATE = '2026-06-21';
const AGODA = 'https://www.agoda.com/?cid=1965862';
const klookU = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent(q)}&aid=121442`;
const gygU = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=__GYG_PARTNER_ID__`;
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);

// Cities already covered by hand-written guides in gen-stay-compare.mjs — skip these.
const HANDWRITTEN = new Set(['bangkok','chiang-mai','phuket','krabi','pattaya','samui','huahin','koh-phangan','chiang-rai','ayutthaya','koh-chang','koh-lipe','khao-yai','pai','kanchanaburi','sukhothai','hat-yai','nan','koh-kood','rayong',
  // Tier A hand-written upgrades
  'phang-nga','surat-thani','trang','nakhon-ratchasima','udon-thani','khon-kaen','ubon-ratchathani','nong-khai','lampang','mae-hong-son','loei','phetchaburi','prachuap-khiri-khan','lopburi','buriram',
  // Tier B hand-written upgrades (≥3 genuinely distinct geographic stay-zones each)
  'nakhon-si-thammarat','satun','chumphon','chanthaburi','trat','chonburi','ratchaburi','koh-larn','koh-mak','nakhon-phanom',
  // Tier C hand-written upgrades (the few remaining provinces with ≥3 real distinct stay-zones)
  'tak','phetchabun','samut-songkhram','ranong',
  // NEXT-EXPANSION re-verify upgrade: phitsanulok now has a hand-written HOODS guide
  // (3 real stay zones: Nan-riverside city · Route 12 Kaeng Song/Wang Thong Khek-river resorts · Phu Hin Rong Kla/Nakhon Thai mountain)
  'phitsanulok']);
// Re-verified 2026-06 with district-level WebSearch. Intentionally KEPT data-driven — no ≥3 distinct
// tourist STAY zones to write honestly (day-trip attractions far from any lodging cluster don't count;
// fabricating areas is forbidden):
//   phrae (old-town = downtown, one small town; Wat Cho Hae/Phae Muang Phi are day-trips; lodging weak) ·
//   phayao (2 zones only: Kwan Phayao lakeside-city + Chiang Kham — below the 3-zone bar) ·
//   sakon-nakhon (city hugs Nong Han lake = one zone; Phu Phan NP is a ~25km day-trip) ·
//   mukdahan (compact Mekong/Indochina riverside core; Phu Pha Thoep is a day-trip) ·
//   surin (in-town one zone; Ban Ta Klang elephant village is a ~58km day-base, scant lodging) ·
//   sisaket (2 zones only: city + Kantharalak for Khao Phra Wihan/Pha Mo I Daeng — below the bar) ·
//   nakhon-pathom (compact city around Phra Pathom Chedi, day-trip from BKK; Sampran is ~26km).

// English city names (province-data has Thai only) — copied from gen-hubs.mjs.
const EN_NAME = {
  'amnat-charoen':'Amnat Charoen','ang-thong':'Ang Thong','ayutthaya':'Ayutthaya','bangkok':'Bangkok','bueng-kan':'Bueng Kan','buriram':'Buriram','chachoengsao':'Chachoengsao','chai-nat':'Chai Nat','chaiyaphum':'Chaiyaphum','chanthaburi':'Chanthaburi','chiang-mai':'Chiang Mai','chiang-rai':'Chiang Rai','chonburi':'Chonburi','chumphon':'Chumphon','hat-yai':'Hat Yai','huahin':'Hua Hin','kalasin':'Kalasin','kamphaeng-phet':'Kamphaeng Phet','kanchanaburi':'Kanchanaburi','khao-yai':'Khao Yai','khon-kaen':'Khon Kaen','koh-chang':'Koh Chang','koh-kood':'Koh Kood','koh-larn':'Koh Larn','koh-lipe':'Koh Lipe','koh-mak':'Koh Mak','koh-phangan':'Koh Phangan','krabi':'Krabi','lampang':'Lampang','lamphun':'Lamphun','loei':'Loei','lopburi':'Lopburi','mae-hong-son':'Mae Hong Son','maha-sarakham':'Maha Sarakham','mukdahan':'Mukdahan','nakhon-nayok':'Nakhon Nayok','nakhon-pathom':'Nakhon Pathom','nakhon-phanom':'Nakhon Phanom','nakhon-ratchasima':'Nakhon Ratchasima','nakhon-sawan':'Nakhon Sawan','nakhon-si-thammarat':'Nakhon Si Thammarat','nan':'Nan','narathiwat':'Narathiwat','nong-bua-lamphu':'Nong Bua Lamphu','nong-khai':'Nong Khai','nonthaburi':'Nonthaburi','pai':'Pai','pathum-thani':'Pathum Thani','pattani':'Pattani','pattaya':'Pattaya','phang-nga':'Phang Nga','phatthalung':'Phatthalung','phayao':'Phayao','phetchabun':'Phetchabun','phetchaburi':'Phetchaburi','phichit':'Phichit','phitsanulok':'Phitsanulok','phrae':'Phrae','phuket':'Phuket','prachinburi':'Prachinburi','prachuap-khiri-khan':'Prachuap Khiri Khan','ranong':'Ranong','ratchaburi':'Ratchaburi','rayong':'Rayong','roi-et':'Roi Et','sa-kaeo':'Sa Kaeo','sakon-nakhon':'Sakon Nakhon','samui':'Koh Samui','samut-prakan':'Samut Prakan','samut-sakhon':'Samut Sakhon','samut-songkhram':'Samut Songkhram','saraburi':'Saraburi','satun':'Satun','sing-buri':'Sing Buri','sisaket':'Sisaket','songkhla':'Songkhla','sukhothai':'Sukhothai','suphan-buri':'Suphan Buri','surat-thani':'Surat Thani','surin':'Surin','tak':'Tak','trang':'Trang','trat':'Trat','ubon-ratchathani':'Ubon Ratchathani','udon-thani':'Udon Thani','uthai-thani':'Uthai Thani','uttaradit':'Uttaradit','yala':'Yala','yasothon':'Yasothon',
};
const titlecase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

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

// Build the article for one locale from that locale's roundup (real hotels) + city names.
function build(slug, loc, rd, nameTh, nameEn) {
  const en = loc === 'en';
  const name = en ? nameEn : nameTh;
  const entries = (rd.entries || []).slice(0, 7);
  const rows = entries.map((e) => {
    const price = strip(e.priceBig) || strip(e.priceSub) || (en ? 'see list' : 'ดูในอันดับ');
    const tag = strip((e.tags || [])[0]) || (e.score ? `⭐ ${e.score}` : '');
    return [strip(e.name), price, tag.length > 64 ? tag.slice(0, 62) + '…' : tag];
  });
  const roundup = `top10-hotels-${slug}.html`, hub = `city-${slug}.html`;
  const blocks = [
    { kind: 'p', html: en
      ? `<strong>Short answer:</strong> In ${nameEn}, most travelers base around the town center and the main sights, where transport and food are easiest. Below are the best-reviewed places to stay — pick by budget and style, then compare live prices in our ranked list.`
      : `<strong>คำตอบสั้น ๆ:</strong> ที่พักส่วนใหญ่ใน${nameTh}อยู่ในเขตเมืองและใกล้แหล่งเที่ยวหลัก ซึ่งเดินทางและหาของกินสะดวกสุด ด้านล่างคือที่พักที่รีวิวดีที่สุด เลือกตามงบและสไตล์ แล้วเทียบราคาสด ๆ ได้ในหน้าจัดอันดับ` },
    { kind: 'h2', text: en ? `Top-rated places to stay in ${nameEn}` : `ที่พักรีวิวดีใน${nameTh}`, id: 'top-stays' },
    { kind: 'table',
      caption: en ? `Best-reviewed ${nameEn} stays (from our ranked roundup)` : `ที่พัก${nameTh}รีวิวดี (จากหน้าจัดอันดับของเรา)`,
      headers: en ? ['Stay', 'From', 'Known for'] : ['ที่พัก', 'เริ่มต้น', 'เด่นเรื่อง'],
      rows },
    { kind: 'h2', text: en ? 'How to choose where to stay' : 'เลือกที่พักยังไงดี', id: 'how-to-choose' },
    { kind: 'list', items: en ? [
      'For a first visit or without a car, stay near the town center and transport',
      'Compare the same hotel across Agoda · Booking · Trip.com in our ranked list before booking',
      'Book ahead in high season and on long weekends — good rooms sell out fast',
      'Pick a stay closest to what you most want to do, to save travel time',
    ] : [
      'มาครั้งแรกหรือไม่มีรถ เลือกพักใกล้ตัวเมืองและจุดขนส่ง',
      'เทียบราคาที่พักเดียวกันทั้ง Agoda · Booking · Trip.com ในหน้าจัดอันดับก่อนจอง',
      'จองล่วงหน้าช่วงไฮซีซั่นและวันหยุดยาว ห้องดี ๆ เต็มเร็ว',
      'เลือกที่พักใกล้สิ่งที่อยากทำที่สุด จะประหยัดเวลาเดินทาง',
    ] },
    expCity(nameTh, nameEn, loc),
    { kind: 'staycta',
      title: en ? `Compare every ${nameEn} hotel & price` : `เทียบโรงแรม${nameTh}ทุกที่ทุกราคา`,
      text: en ? `See the full ranked roundup with prices compared across Agoda, Booking and Trip.com, then book the one that fits.` : `ดูหน้าจัดอันดับฉบับเต็ม เทียบราคา Agoda · Booking · Trip.com แล้วจองที่ที่ใช่`,
      links: [
        { label: en ? `🏨 Top hotels in ${nameEn}` : `🏨 Top โรงแรม${nameTh}`, href: roundup, note: en ? 'Ranked + price compare' : 'จัดอันดับ + เทียบราคา' },
        { label: en ? `🗺️ ${nameEn} travel guide` : `🗺️ คู่มือเที่ยว${nameTh}`, href: hub, note: en ? 'Stays, food, things to do' : 'ที่พัก ที่กิน ที่เที่ยว' },
      ],
      ctaLabel: en ? 'Search hotels on Agoda' : 'ค้นหาโรงแรมบน Agoda', ctaHref: AGODA },
  ];
  const rel = en
    ? [{ href: hub, title: `🗺️ Explore ${nameEn}` }, { href: roundup, title: `🏨 Top hotels in ${nameEn}` },
       { href: 'getting-around-thailand.html', title: '🚌 Getting around Thailand' }, { href: 'plan-your-trip.html', title: '🧭 Plan Your Trip hub' }]
    : [{ href: hub, title: `🗺️ เที่ยว${nameTh}` }, { href: roundup, title: `🏨 Top โรงแรม${nameTh}` },
       { href: 'getting-around-thailand.html', title: '🚌 คู่มือการเดินทางทั่วไทย' }, { href: 'plan-your-trip.html', title: '🧭 ศูนย์รวมคู่มือเตรียมตัว' }];
  const hero = fs.existsSync(path.join(PUB, 'images/heroes', slug + '.jpg')) ? `/images/heroes/${slug}.jpg` : '';
  return {
    slug: `where-to-stay-${slug}`, type: 'prep', cluster: slug,
    title: en ? `Where to Stay in ${nameEn} 2026 — Best-Reviewed Areas & Hotels | ThailandAddict`
             : `พักที่ไหนดีใน${nameTh} 2026 — ย่าน & โรงแรมรีวิวดี | ThailandAddict`,
    metaDesc: en ? `Where to stay in ${nameEn}: the best-reviewed places to stay, what each is known for, how to choose by budget and style, and where to compare prices.`
                 : `พักที่ไหนดีใน${nameTh} รวมที่พักรีวิวดี เด่นเรื่องอะไร เลือกตามงบและสไตล์ยังไง พร้อมที่เทียบราคาก่อนจอง`,
    ogTitle: en ? `Where to Stay in ${nameEn}` : `พักที่ไหนดีใน${nameTh}`,
    ogDesc: en ? `The best-reviewed places to stay in ${nameEn}.` : `ที่พักรีวิวดีใน${nameTh} เลือกตามงบและสไตล์`,
    ...(hero ? { image: hero, heroImg: hero } : {}),
    crumbCity: name, crumbCityHref: hub,
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: en ? `Where to stay · ${nameEn}` : `พักที่ไหนดี · ${nameTh}`,
    h1: en ? `Where to stay in<br>${nameEn}` : `พักที่ไหนดี<br>ใน${nameTh}`,
    heroEmoji: '🏨',
    intro: en ? `Not sure where to base yourself in ${nameEn}? Here are the best-reviewed places to stay and how to choose the right one for your budget and plans.`
              : `ไม่แน่ใจว่าจะพักตรงไหนดีใน${nameTh}? นี่คือที่พักรีวิวดีที่สุดและวิธีเลือกให้เหมาะกับงบและแผนเที่ยวของคุณ`,
    chips: en ? ['Best-reviewed', 'By budget', 'Compare prices'] : ['รีวิวดี', 'เลือกตามงบ', 'เทียบราคา'],
    readTime: en ? '4 min read' : '4 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: en ? [
      { q: `Where is the best area to stay in ${nameEn}?`, a: `For a first visit, base near the town center and main transport — it is the most convenient for food and getting around. See our ranked roundup above for the best-reviewed hotels and their locations.` },
      { q: `How much does a hotel in ${nameEn} cost?`, a: `Prices range widely by season and style. The quickest way to find the current rate is our ranked roundup, which compares the same hotel across Agoda, Booking and Trip.com.` },
      { q: `How do I get around ${nameEn}?`, a: `It depends on the area — see our Thailand getting-around guide for the options, and pick a stay close to what you plan to do to save time.` },
    ] : [
      { q: `พักย่านไหนดีใน${nameTh}?`, a: `มาครั้งแรกแนะนำพักใกล้ตัวเมืองและจุดขนส่งหลัก สะดวกทั้งหาของกินและเดินทาง ดูที่พักรีวิวดีและทำเลได้ในหน้าจัดอันดับด้านบน` },
      { q: `โรงแรมใน${nameTh}ราคาประมาณเท่าไหร่?`, a: `ราคาขึ้นกับฤดูกาลและระดับที่พัก วิธีเช็กราคาล่าสุดเร็วสุดคือดูหน้าจัดอันดับของเรา ที่เทียบราคาที่พักเดียวกันทั้ง Agoda · Booking · Trip.com` },
      { q: `เดินทางใน${nameTh}ยังไง?`, a: `ขึ้นกับย่านที่พัก ดูตัวเลือกได้ในคู่มือการเดินทางทั่วไทยของเรา และเลือกที่พักใกล้สิ่งที่อยากทำเพื่อประหยัดเวลา` },
    ],
    related: rel,
  };
}

let n = 0, skipped = 0; const leaks = [], misaligned = [];
const slugs = fs.readdirSync(R_TH).filter((f) => /^top10-hotels-[a-z-]+\.json$/.test(f)).map((f) => f.slice('top10-hotels-'.length, -5));
for (const slug of slugs) {
  if (HANDWRITTEN.has(slug)) { skipped++; continue; }
  if (!fs.existsSync(path.join(PUB, `city-${slug}.html`))) { skipped++; continue; }   // needs a hub
  const rdTh = readJson(path.join(R_TH, `top10-hotels-${slug}.json`));
  const rdEn = readJson(path.join(R_EN, `top10-hotels-${slug}.json`));
  if (!rdTh || !rdEn) { skipped++; continue; }                                        // needs both locales
  const pd = readJson(path.join(PD, `${slug}.json`));
  const nameTh = (pd && pd.th) || slug;
  const nameEn = EN_NAME[slug] || titlecase(slug);
  if (hasThai(nameEn)) { skipped++; continue; }
  const th = build(slug, 'th', rdTh, nameTh, nameEn);
  const en = build(slug, 'en', rdEn, nameTh, nameEn);
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) { misaligned.push(slug); continue; }
  if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) { misaligned.push(slug + ':keys'); continue; }
  if (hasThai(JSON.stringify(en))) { leaks.push(slug); continue; }
  fs.writeFileSync(path.join(A_TH, `where-to-stay-${slug}.json`), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, `where-to-stay-${slug}.json`), JSON.stringify(en, null, 2) + '\n');
  n++;
}
console.log(JSON.stringify({ written: n, skipped, enThaiLeaks: leaks, misaligned }, null, 2));
