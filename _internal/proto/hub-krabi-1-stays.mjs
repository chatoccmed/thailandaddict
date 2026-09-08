import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/Imac/Thailandaddict/thailandaddict';
const R = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const num = s => { const m = String(s ?? '').match(/[\d,]+/); return m ? +m[0].replace(/,/g, '') : 0; };

function pool(dir) {
  const out = [];
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    let r; try { r = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); } catch { continue; }
    if (r.cluster !== 'krabi') continue;
    out.push(r);
  }
  return out;
}

const th = pool('astro/src/content/reviews');
const en = pool('astro/src/content/reviews-en');
const enBySlug = Object.fromEntries(en.map(r => [r.slug, r]));

// zone rules run in order against the THAI loc string (authoritative)
const ZONES = [
  { id: 'railay',     th: 'ไร่เลย์',            en: 'Railay',              re: /ไร่เลย์/ },
  { id: 'phiphi',     th: 'เกาะพีพี',           en: 'Koh Phi Phi',         re: /พีพี/ },
  { id: 'lanta',      th: 'เกาะลันตา',          en: 'Koh Lanta',           re: /ลันตา/ },
  { id: 'klongmuang', th: 'คลองม่วง–ทับแขก',    en: 'Klong Muang–Tubkaak', re: /คลองม่วง|ทับแขก|หนองทะเล/ },
  { id: 'aonang',     th: 'อ่าวนาง',            en: 'Ao Nang',             re: /อ่าวนาง|นพรัตน์ธารา|ไผ่ปล้อง/ },
  { id: 'airport',    th: 'ใกล้สนามบิน',        en: 'Near the airport',    re: /สนามบิน|กระบี่น้อย|เหนือคลอง/ },
  { id: 'town',       th: 'ตัวเมืองกระบี่',      en: 'Krabi Town',          re: /ตัวเมืองกระบี่|ปากน้ำ|ริมแม่น้ำกระบี่|มหาราช|อุตรกิจ/ },
];

const BANDS = [
  { id: 'b1', max: 999,    th: 'หลักร้อย (ไม่เกิน ฿999)', en: 'Under ฿1,000' },
  { id: 'b2', max: 2999,   th: '฿1,000–2,999',            en: '฿1,000–2,999' },
  { id: 'b3', max: 6999,   th: '฿3,000–6,999',            en: '฿3,000–6,999' },
  { id: 'b4', max: 1e9,    th: '฿7,000 ขึ้นไป',            en: '฿7,000 and up' },
];

const rows = th.map(r => {
  const e = enBySlug[r.slug] || {};
  const locTh = (r.hiLoc || r.badgeLoc || r.addressLocality || '').replace(/^🇹🇭\s*/, '');
  const locEn = (e.hiLoc || e.badgeLoc || e.addressLocality || '').replace(/^🇹🇭\s*/, '');
  const z = ZONES.find(z => z.re.test(locTh)) || { id: 'other', th: 'อื่น ๆ', en: 'Elsewhere' };
  const price = num(r.priceRange || r.qiPrice);
  const band = BANDS.find(b => price <= b.max);
  return {
    slug: r.slug,
    nameTh: r.name, nameEn: e.name || r.name,
    typeTh: r.typeFull || r.type || '', typeEn: e.typeFull || e.type || '',
    locTh, locEn,
    zone: z.id, zoneTh: z.th, zoneEn: z.en,
    price, band: band.id,
    star: +(r.starRating || 0),
    ourScore: +(r.score || 0),
    booking: parseFloat((r.booking || {}).score) || null,
    agoda: parseFloat((r.agoda || {}).score) || null,
    revCount: +(r.ratingCount || 0),
    img: r.heroImg || r.image || '',
    modifiedDate: r.modifiedDate || '',
    agodaUrl: r.bookingAgoda || '', bookingUrl: r.bookingBooking || '', tripUrl: r.bookingTrip || '',
    roomsTh: r.qiRooms || '', roomsEn: e.qiRooms || '',
  };
});

// quantiles
const prices = rows.map(r => r.price).filter(Boolean).sort((a, b) => a - b);
const q = x => { const i = (prices.length - 1) * x, lo = Math.floor(i), hi = Math.ceil(i); return prices[lo] + (prices[hi] - prices[lo]) * (i - lo); };

const stats = {
  n: rows.length,
  nPriced: prices.length,
  min: prices[0], max: prices[prices.length - 1],
  p10: Math.round(q(.10)), p25: Math.round(q(.25)), p50: Math.round(q(.50)),
  p75: Math.round(q(.75)), p90: Math.round(q(.90)),
  minName: rows.find(r => r.price === prices[0]).nameTh,
  maxName: rows.find(r => r.price === prices[prices.length - 1]).nameTh,
  booking9: rows.filter(r => r.booking && r.booking >= 9).length,
  withBooking: rows.filter(r => r.booking).length,
  withAgoda: rows.filter(r => r.agoda).length,
  withDate: rows.filter(r => r.modifiedDate).length,
  withImg: rows.filter(r => r.img).length,
};

const byZone = {};
for (const r of rows) byZone[r.zone] = (byZone[r.zone] || 0) + 1;
const byBand = {};
for (const r of rows) byBand[r.band] = (byBand[r.band] || 0) + 1;
const byStar = {};
for (const r of rows) byStar[r.star] = (byStar[r.star] || 0) + 1;

console.log('STATS', JSON.stringify(stats, null, 1));
console.log('ZONES', JSON.stringify(byZone));
console.log('BANDS', JSON.stringify(byBand));
console.log('STARS', JSON.stringify(byStar));
console.log('OTHER-ZONE ROWS:', rows.filter(r => r.zone === 'other').map(r => r.nameTh + ' :: ' + r.locTh));
console.log('NO IMG:', rows.filter(r => !r.img).map(r => r.nameTh));
console.log('NO PRICE:', rows.filter(r => !r.price).map(r => r.nameTh));

fs.writeFileSync(process.argv[2] || 'krabi-rows.json', JSON.stringify({ rows, stats, byZone, byBand, byStar, ZONES, BANDS }, null, 1));
