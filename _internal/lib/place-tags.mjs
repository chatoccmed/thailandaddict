// Place data-layer — the controlled tag vocabulary + auto-derivation used by gen-feeds.mjs.
// Human-facing spec for the content team: _internal/PLACE-TAGS-SPEC.md
// Rule: tags are stable English slugs (machine keys). Manual tags (added by writers in the JSON `tags` field)
// are MERGED with auto-derived ones; manual wins on conflict. Derivation is best-effort from name + structured fields.

// ── Controlled vocabulary (v1). Add new tags here, never invent ad-hoc ones in content. ──
export const TAG_VOCAB = {
  theme: ['nature', 'waterfall', 'mountain', 'viewpoint', 'cave', 'park', 'lake', 'hotspring', 'beach', 'island',
    'temple', 'museum', 'history', 'culture', 'palace', 'shrine', 'art',
    'oldtown', 'market', 'walkingstreet', 'citywalk',
    'cafe', 'restaurant', 'streetfood', 'localfood', 'michelin',
    'shopping', 'mall', 'nightlife', 'bar', 'rooftop',
    'adventure', 'trekking', 'water-activity', 'cycling', 'wellness', 'spa',
    'animal', 'elephant', 'zoo', 'aquarium', 'farm',
    'landmark', 'iconic', 'instagram', 'bridge', 'skywalk',
    'resort', 'villa', 'pool', 'boutique', 'hostel', 'beachfront', 'city', 'apartment', 'luxury', 'budget', 'garden'],
  audience: ['family', 'kids', 'elderly-friendly', 'romantic', 'solo', 'group', 'pet-friendly'],
  practical: ['free-entry', 'paid-entry', 'indoor', 'outdoor', 'ev-charging', 'parking', 'wheelchair', 'halal', 'vegetarian', 'english-ok', 'reservation', 'cash-only'],
  tripfit: ['rest-stop', 'quick-visit', 'half-day', 'full-day'],
  vibe: ['sunrise', 'sunset', 'night', 'hidden-gem', 'seasonal'],
};
const ALL = new Set(Object.values(TAG_VOCAB).flat());

export function mergeTags(manual, derived) {
  const out = [];
  for (const t of [...(Array.isArray(manual) ? manual : []), ...(derived || [])]) {
    const s = String(t || '').trim();
    if (s && ALL.has(s) && !out.includes(s)) out.push(s);   // keep only valid-vocab tags, dedup
  }
  return out;
}

const num = s => { const m = String(s || '').replace(/,/g, '').match(/\d{3,7}/); return m ? +m[0] : 0; };

// attraction / article — name-keyword based (we only have the name reliably)
const ATTR_RULES = [
  [/น้ำตก/, ['nature', 'waterfall', 'outdoor']],
  [/ดอย|ยอดดอย|ภูเขา|เขาสูง/, ['nature', 'mountain', 'viewpoint', 'outdoor']],
  [/อุทยาน|ป่า\b|ทุ่ง|สวนพฤกษ|สวนสาธารณะ/, ['nature', 'park', 'outdoor']],
  [/ถ้ำ/, ['nature', 'cave']],
  [/ทะเลสาบ|หนองน้ำ|บึง|เขื่อน|อ่างเก็บน้ำ/, ['nature', 'lake', 'outdoor']],
  [/น้ำพุร้อน|บ่อน้ำร้อน|ออนเซน|onsen/i, ['nature', 'hotspring', 'wellness']],
  [/ทะเล|หาด|อ่าว|แหลม|ชายหาด/, ['sea', 'beach', 'outdoor']],
  [/เกาะ/, ['island', 'sea']],
  [/วัด|พระธาตุ|เจดีย์|วิหาร|พระบรมธาตุ|พุทธ/, ['temple', 'culture']],
  [/พิพิธภัณฑ์|มิวเซียม/, ['museum', 'culture', 'indoor']],
  [/พระราชวัง|พระตำหนัก|คุ้ม\b|วังเก่า/, ['palace', 'culture', 'history']],
  [/ศาลเจ้า|ศาลหลักเมือง/, ['shrine', 'culture']],
  [/ประวัติศาสตร์|โบราณสถาน|เมืองเก่า|ย่านเก่า/, ['history', 'culture', 'oldtown']],
  [/ตลาด|กาด|ถนนคนเดิน/, ['market', 'localfood']],
  [/คาเฟ่|ไร่ชา|ไร่กาแฟ/, ['cafe']],
  [/ช้าง|ปางช้าง/, ['animal', 'elephant']],
  [/สวนสัตว์|อควาเรียม|ฟาร์ม|พิพิธภัณฑ์สัตว์น้ำ/, ['animal']],
  [/จุดชมวิว/, ['viewpoint']],
  [/สะพาน/, ['landmark', 'bridge']],
  [/สกายวอล์ค|skywalk/i, ['landmark', 'skywalk', 'viewpoint']],
  [/ล่องแก่ง|ดำน้ำ|ปีนเขา|ซิปไลน์|ผจญภัย/, ['adventure', 'outdoor']],
];
export function deriveAttractionTags(name) {
  const n = String(name || ''), out = [];
  for (const [re, tags] of ATTR_RULES) if (re.test(n)) out.push(...tags);
  return [...new Set(out)];
}

// hotel review — from qiType/typeFull + price
export function deriveHotelTags({ type = '', price = '', name = '' } = {}) {
  const t = (type + ' ' + name).toLowerCase(), out = [];
  if (/resort|รีสอร์ต|รีสอร์ท/.test(t)) out.push('resort');
  if (/villa|วิลล่า|พูลวิลล่า|pool villa/.test(t)) out.push('villa', 'pool', 'romantic');
  if (/pool|สระว่ายน้ำ/.test(t)) out.push('pool');
  if (/boutique|บูทีค/.test(t)) out.push('boutique');
  if (/hostel|โฮสเทล|แบ็คแพ็ค/.test(t)) out.push('hostel', 'budget', 'solo');
  if (/beach|ติดหาด|ริมหาด|หาด|beachfront/.test(t)) out.push('beachfront', 'sea');
  if (/city|ในเมือง|กลางเมือง/.test(t)) out.push('city');
  if (/service|อพาร์ต|apartment|เซอร์วิส/.test(t)) out.push('apartment', 'family');
  if (/luxury|หรู|ลักชัวรี|5 ดาว|5★/.test(t)) out.push('luxury', 'romantic');
  if (/บังกะโล|สวน|garden/.test(t)) out.push('garden', 'nature');
  const p = num(price);
  if (p && p < 1000) out.push('budget');
  if (p && p >= 8000) out.push('luxury');
  return [...new Set(out)];
}

// restaurant block — from foodType + structured flags
export function deriveRestaurantTags({ foodType = '', halal, veg, englishMenu, priceRange = '', name = '' } = {}) {
  const t = (foodType + ' ' + name).toLowerCase(), out = ['restaurant'];
  if (/คาเฟ่|กาแฟ|cafe|coffee|ของหวาน|เบเกอรี/.test(t)) out.push('cafe');
  if (/สตรีท|street|ริมทาง|รถเข็น/.test(t)) out.push('streetfood');
  if (/มิชลิน|michelin/.test(t)) out.push('michelin');
  if (halal) out.push('halal');
  if (veg) out.push('vegetarian');
  if (englishMenu) out.push('english-ok');
  const p = num(priceRange);
  if (p && p < 150) out.push('budget');
  return [...new Set(out)];
}
