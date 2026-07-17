// Embed contextual affiliate "experiences" (Klook + GetYourGuide) into existing articles.
// งาน 1 — monetize existing traffic. Idempotent · TH+EN mirrored · honest (search links, real Klook aid,
// GetYourGuide left as placeholder __GYG_PARTNER_ID__). No fabricated tour URLs.
//
//   attraction | itinerary  ->  `experiences` block (tours / tickets / day trips)
//   eat-ranking | food      ->  `foodexp` block (food tours / cooking classes)
//
// Klook search endpoint + aid match the existing committed example (top10-popular-restaurants-chiang-mai).
// Usage:  node _internal/embed-experiences.mjs [LIMIT]   (LIMIT optional, for a dry small run via env CHECK=1)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const KLOOK = 'aid=121442';
const GYG = 'partner_id=__GYG_PARTNER_ID__';
const klook = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent(q)}&${KLOOK}`;
const gyg = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&${GYG}`;
const LIMIT = process.argv[2] ? parseInt(process.argv[2], 10) : Infinity;
const CHECK = process.env.CHECK === '1';

// English city names (fallback when EN crumbCity is unusable) — copied from gen-hubs.mjs.
const EN_NAME = {
  'amnat-charoen':'Amnat Charoen','ang-thong':'Ang Thong','ayutthaya':'Ayutthaya','bangkok':'Bangkok','bueng-kan':'Bueng Kan','buriram':'Buriram','chachoengsao':'Chachoengsao','chai-nat':'Chai Nat','chaiyaphum':'Chaiyaphum','chanthaburi':'Chanthaburi','chiang-mai':'Chiang Mai','chiang-rai':'Chiang Rai','chonburi':'Chonburi','chumphon':'Chumphon','hat-yai':'Hat Yai','huahin':'Hua Hin','kalasin':'Kalasin','kamphaeng-phet':'Kamphaeng Phet','kanchanaburi':'Kanchanaburi','khao-yai':'Khao Yai','khon-kaen':'Khon Kaen','koh-chang':'Koh Chang','koh-kood':'Koh Kood','koh-larn':'Koh Larn','koh-lipe':'Koh Lipe','koh-mak':'Koh Mak','koh-phangan':'Koh Phangan','krabi':'Krabi','lampang':'Lampang','lamphun':'Lamphun','loei':'Loei','lopburi':'Lopburi','mae-hong-son':'Mae Hong Son','maha-sarakham':'Maha Sarakham','mukdahan':'Mukdahan','nakhon-nayok':'Nakhon Nayok','nakhon-pathom':'Nakhon Pathom','nakhon-phanom':'Nakhon Phanom','nakhon-ratchasima':'Nakhon Ratchasima','nakhon-sawan':'Nakhon Sawan','nakhon-si-thammarat':'Nakhon Si Thammarat','nan':'Nan','narathiwat':'Narathiwat','nong-bua-lamphu':'Nong Bua Lamphu','nong-khai':'Nong Khai','nonthaburi':'Nonthaburi','pai':'Pai','pathum-thani':'Pathum Thani','pattani':'Pattani','pattaya':'Pattaya','phang-nga':'Phang Nga','phatthalung':'Phatthalung','phayao':'Phayao','phetchabun':'Phetchabun','phetchaburi':'Phetchaburi','phichit':'Phichit','phitsanulok':'Phitsanulok','phrae':'Phrae','phuket':'Phuket','prachinburi':'Prachinburi','prachuap-khiri-khan':'Prachuap Khiri Khan','ranong':'Ranong','ratchaburi':'Ratchaburi','rayong':'Rayong','roi-et':'Roi Et','sa-kaeo':'Sa Kaeo','sakon-nakhon':'Sakon Nakhon','samui':'Koh Samui','samut-prakan':'Samut Prakan','samut-sakhon':'Samut Sakhon','samut-songkhram':'Samut Songkhram','saraburi':'Saraburi','satun':'Satun','sing-buri':'Sing Buri','sisaket':'Sisaket','songkhla':'Songkhla','sukhothai':'Sukhothai','suphan-buri':'Suphan Buri','surat-thani':'Surat Thani','surin':'Surin','tak':'Tak','trang':'Trang','trat':'Trat','ubon-ratchathani':'Ubon Ratchathani','udon-thani':'Udon Thani','uthai-thani':'Uthai Thani','uttaradit':'Uttaradit','yala':'Yala','yasothon':'Yasothon',
};
const titlecase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const clean = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu, '').trim();
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);

// Topic detection on slug+title -> a specific contextual experience (English query for Klook search).
// Order matters: most specific first. Falls back to null (-> generic city tours).
const TOPICS = [
  [/phi-phi|phiphi|maya/, '🏝️', 'ทัวร์เกาะพีพี & อ่าวมาหยา', 'Phi Phi & Maya Bay tour', 'Phi Phi Islands tour'],
  [/james-bond|phang-nga-bay|phangnga-bay/, '⛰️', 'ทัวร์อ่าวพังงา เจมส์บอนด์', 'Phang Nga Bay tour', 'Phang Nga Bay James Bond tour'],
  [/similan/, '🐠', 'ทัวร์หมู่เกาะสิมิลัน', 'Similan Islands tour', 'Similan Islands tour'],
  [/surin-island|koh-surin/, '🐠', 'ทัวร์หมู่เกาะสุรินทร์', 'Surin Islands tour', 'Surin Islands snorkeling'],
  [/four-island|4-island|krabi-island/, '🚤', 'ทัวร์ 4 เกาะกระบี่', '4 Islands Krabi tour', 'Krabi 4 islands tour'],
  [/hong-island|koh-hong/, '🚤', 'ทัวร์เกาะห้อง', 'Hong Island tour', 'Hong Island tour'],
  [/island-hop|island-hopping/, '🚤', 'ทัวร์ไอแลนด์ฮอปปิ้ง', 'Island hopping tour', 'island hopping tour'],
  [/snorkel|snorkeling/, '🤿', 'ทริปดำน้ำตื้นดูปะการัง', 'Snorkeling trip', 'snorkeling tour'],
  [/scuba|diving|dive\b|padi/, '🤿', 'คอร์ส & ทริปดำน้ำลึก', 'Scuba diving trip', 'scuba diving'],
  [/elephant/, '🐘', 'ปางช้าง & ที่อนุรักษ์ช้าง', 'Ethical elephant sanctuary', 'elephant sanctuary'],
  [/cooking|cook-class|cookery/, '👩‍🍳', 'คลาสเรียนทำอาหารไทย', 'Thai cooking class', 'cooking class'],
  [/rafting|white-water/, '🚣', 'ล่องแก่ง & ราฟติ้ง', 'White-water rafting', 'white water rafting'],
  [/zipline|zip-line|tree-top|jungle-flight/, '🌳', 'ซิปไลน์ผจญภัยบนยอดไม้', 'Zipline adventure', 'zipline'],
  [/atv|buggy/, '🏍️', 'ขับ ATV ลุยธรรมชาติ', 'ATV adventure', 'ATV tour'],
  [/waterfall/, '💦', 'ทัวร์น้ำตก & ธรรมชาติ', 'Waterfall day tour', 'waterfall tour'],
  [/floating-market/, '🛶', 'ทัวร์ตลาดน้ำ', 'Floating market tour', 'floating market tour'],
  [/muay-thai|boxing/, '🥊', 'ดูมวยไทย & คลาสมวย', 'Muay Thai match & class', 'Muay Thai'],
  [/temple|wat-|grand-palace/, '🛕', 'ทัวร์วัด & สถานที่สำคัญ', 'Temple & culture tour', 'temple tour'],
  [/national-park|khao-yai-park|doi-/, '🏞️', 'ทัวร์อุทยาน & เดินป่า', 'National park day tour', 'national park tour'],
  [/zoo|safari|aquarium|sea-life|oceanarium/, '🦁', 'ตั๋วสวนสัตว์ & อควาเรียม', 'Zoo & aquarium tickets', 'zoo aquarium ticket'],
  [/cabaret|alcazar|tiffany|simon/, '🎭', 'ตั๋วโชว์คาบาเรต์', 'Cabaret show ticket', 'cabaret show'],
  [/cruise|dinner-cruise|sunset/, '🛳️', 'ล่องเรือชมวิว & ดินเนอร์', 'Sunset / dinner cruise', 'dinner cruise'],
];
function detectTopic(slug, title) {
  const s = (slug + ' ' + title).toLowerCase();
  for (const [re, emoji, th, en, q] of TOPICS) if (re.test(s)) return { emoji, th, en, q };
  return null;
}

// Build the localized experiences/foodexp block. cityTh/cityEn already cleaned. enMode -> English copy.
function buildExperiences({ cityTh, cityEn, slug, titleTh, isItinerary, enMode }) {
  const topic = detectTopic(slug, titleTh);
  const items = [];
  if (topic) {
    items.push({ emoji: topic.emoji, provider: 'Klook',
      label: enMode ? topic.en : topic.th,
      note: enMode ? 'Popular · book in minutes' : 'ยอดนิยม จองง่ายในไม่กี่นาที',
      href: klook(topic.q + ' ' + cityEn) });
  } else {
    items.push({ emoji: '🎟️', provider: 'Klook',
      label: enMode ? `Top tours in ${cityEn}` : `ทัวร์ยอดนิยม ${cityTh}`,
      note: enMode ? 'Highlights, guided' : 'ไฮไลต์ มีไกด์พาไป',
      href: klook(`${cityEn} tour`) });
  }
  items.push({ emoji: '🎟️', provider: 'Klook',
    label: enMode ? `${cityEn} attractions & tickets` : `ตั๋ว & ที่เที่ยว ${cityTh}`,
    note: enMode ? 'Skip-the-line entry tickets' : 'ตั๋วเข้าชม ไม่ต้องต่อคิว',
    href: klook(`${cityEn} attractions ticket`) });
  items.push({ emoji: '🚐', provider: 'Klook',
    label: enMode ? `Day trips from ${cityEn}` : `เดย์ทริปจาก ${cityTh}`,
    note: enMode ? 'Out and back in a day' : 'ไปเช้า-เย็นกลับ มีรถรับส่ง',
    href: klook(`${cityEn} day trip`) });
  items.push({ emoji: '🌎', provider: 'GetYourGuide',
    label: enMode ? `${cityEn} activities (GetYourGuide)` : `กิจกรรม ${cityTh} (GetYourGuide)`,
    note: enMode ? 'Global tour marketplace' : 'อีกหนึ่งเจ้าชั้นนำ เทียบราคาได้',
    href: gyg(`${cityEn}`) });

  const title = isItinerary
    ? (enMode ? `Book the activities in your ${cityEn} trip ahead` : `จองกิจกรรมในแผนเที่ยว ${cityTh} ล่วงหน้า`)
    : (enMode ? `Want more out of ${cityEn}? Book tours & activities` : `อยากเที่ยว ${cityTh} ให้สนุกขึ้น? จองทัวร์ & กิจกรรม`);
  const text = enMode
    ? `Booking online ahead on Klook or GetYourGuide is usually cheaper than the gate and skips the queue. Pick only the experiences you actually want — prices and availability are shown live on each site.`
    : `จองออนไลน์ล่วงหน้าผ่าน Klook หรือ GetYourGuide มักได้ราคาดีกว่าหน้างานและไม่ต้องต่อคิว เลือกเฉพาะกิจกรรมที่อยากทำจริง ๆ ราคาและที่ว่างดูสด ๆ ได้ในแต่ละเว็บ`;
  return { kind: 'experiences', title, text, items,
    ctaLabel: enMode ? `🎟️ See all ${cityEn} tours & activities (Klook)` : `🎟️ ดูทัวร์ & กิจกรรม ${cityTh} ทั้งหมด (Klook)`,
    ctaHref: klook(`${cityEn}`) };
}

function buildFoodexp({ cityTh, cityEn, enMode }) {
  const items = [
    { emoji: '🍜', provider: 'Klook', label: enMode ? `${cityEn} street-food tour` : `ฟู้ดทัวร์ชิมของเด็ด ${cityTh}`,
      note: enMode ? 'A local guides you, many stops' : 'มีคนท้องถิ่นพาตะลุยหลายร้าน', href: klook(`${cityEn} food tour`) },
    { emoji: '👩‍🍳', provider: 'Klook', label: enMode ? 'Thai cooking class' : 'คลาสเรียนทำอาหารไทย',
      note: enMode ? 'Market walk + hands-on' : 'เดินตลาดสด + ลงมือทำเอง', href: klook(`${cityEn} cooking class`) },
    { emoji: '🌃', provider: 'Klook', label: enMode ? 'Market & night-eats walk' : 'ทัวร์ตลาด & ของกินยามค่ำ',
      note: enMode ? 'Street food after dark' : 'ชิมของกินกลางคืนแบบมีคนพา', href: klook(`${cityEn} night market food`) },
    { emoji: '🍢', provider: 'GetYourGuide', label: enMode ? `Food experiences (GetYourGuide)` : `ประสบการณ์อาหาร (GetYourGuide)`,
      note: enMode ? 'Compare another marketplace' : 'อีกหนึ่งเจ้าให้เทียบราคา', href: gyg(`${cityEn} food`) },
  ];
  return { kind: 'foodexp',
    title: enMode ? `Want to taste deeper? Try a ${cityEn} food tour or cooking class` : `อยากกินให้ลึกกว่าเดิม? ลองฟู้ดทัวร์ & คลาสทำอาหาร ${cityTh}`,
    text: enMode
      ? `Half a day with a local who knows the lanes — or cooking a dish yourself — teaches you more than just eating. Book ahead on Klook or GetYourGuide.`
      : `ครึ่งวันกับคนท้องถิ่นที่รู้จักร้านลับ หรือได้ลงมือทำอาหารเองสักมื้อ สนุกและรู้จักของกินลึกกว่าการนั่งกินเฉย ๆ จองล่วงหน้าผ่าน Klook หรือ GetYourGuide ได้เลย`,
    items, ctaLabel: enMode ? `🍢 See all ${cityEn} food tours & classes (Klook)` : `🍢 ดูฟู้ดทัวร์ & คลาสทำอาหาร ${cityTh} ทั้งหมด (Klook)`,
    ctaHref: klook(`${cityEn} food`) };
}

// Insertion point: before the 2nd h2 (mid-content); else before a trailing cta; else append.
function insertIdx(blocks) {
  const h2s = blocks.map((b, i) => (b.kind === 'h2' ? i : -1)).filter((i) => i >= 0);
  if (h2s.length >= 2) return h2s[1];
  if (blocks.length && blocks[blocks.length - 1].kind === 'cta') return blocks.length - 1;
  return blocks.length;
}

const TYPES_EXP = new Set(['attraction', 'itinerary']);
const TYPES_FOOD = new Set(['eat-ranking', 'food']);
let nExp = 0, nFood = 0, nSkip = 0, nMiss = 0, nBad = 0, processed = 0;
const samples = [];

const files = fs.readdirSync(A_TH).filter((f) => f.endsWith('.json'));
for (const f of files) {
  if (processed >= LIMIT) break;
  const thPath = path.join(A_TH, f), enPath = path.join(A_EN, f);
  let th, en;
  try { th = JSON.parse(fs.readFileSync(thPath, 'utf8')); } catch { nBad++; continue; }
  const isExp = TYPES_EXP.has(th.type), isFood = TYPES_FOOD.has(th.type);
  if (!isExp && !isFood) continue;
  if (!fs.existsSync(enPath)) { nMiss++; continue; }
  try { en = JSON.parse(fs.readFileSync(enPath, 'utf8')); } catch { nBad++; continue; }

  const blockKind = isExp ? 'experiences' : 'foodexp';
  // idempotent — skip if the target monetization block already exists
  if ((th.blocks || []).some((b) => b.kind === blockKind) || (en.blocks || []).some((b) => b.kind === blockKind)) { nSkip++; continue; }
  // safety: TH/EN block structure must already be aligned, else don't risk misalignment
  if ((th.blocks || []).map((b) => b.kind).join() !== (en.blocks || []).map((b) => b.kind).join()) { nBad++; continue; }

  const cityTh = clean(th.crumbCity) || EN_NAME[th.cluster] || titlecase(th.cluster);
  let cityEn = clean(en.crumbCity);
  if (!cityEn || hasThai(cityEn)) cityEn = EN_NAME[th.cluster] || titlecase(th.cluster);

  let thBlock, enBlock;
  if (isExp) {
    const opts = { cityTh, cityEn, slug: th.slug, titleTh: th.title || th.h1 || '', isItinerary: th.type === 'itinerary' };
    thBlock = buildExperiences({ ...opts, enMode: false });
    enBlock = buildExperiences({ ...opts, enMode: true });
  } else {
    thBlock = buildFoodexp({ cityTh, cityEn, enMode: false });
    enBlock = buildFoodexp({ cityTh, cityEn, enMode: true });
  }

  const idx = insertIdx(th.blocks || []);
  th.blocks.splice(idx, 0, thBlock);
  en.blocks.splice(idx, 0, enBlock);

  if (hasThai(JSON.stringify(enBlock))) { nBad++; continue; } // guard: EN block must be zero-Thai

  if (!CHECK) {
    fs.writeFileSync(thPath, JSON.stringify(th, null, 2) + '\n');
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
  }
  if (isExp) nExp++; else nFood++;
  processed++;
  if (samples.length < 3) samples.push({ f, type: th.type, idx, cityEn, label: thBlock.items[0].label, href0: thBlock.items[0].href });
}

console.log(JSON.stringify({ mode: CHECK ? 'CHECK(no write)' : 'WRITE', nExp, nFood, nSkip, nMiss, nBad, samples }, null, 2));
