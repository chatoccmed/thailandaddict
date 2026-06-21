// Enforce zero-Thai on the 43 EN food articles that leaked Thai (tags / restaurant names / a few
// embedded FB-page & place names). Pre-existing migrated content — fixing the files is durable.
// Policy = comply with the LOCKED "EN ZERO Thai" rule: translate Thai tags, romanize/keep the
// English restaurant name, drop redundant Thai name-parens. Idempotent. Verifies 0 Thai after.
//   WHOLE = exact whole-string value → English (tags + Thai-first names)
//   SUB   = substring → English (embedded Thai in quotes / before an English paren)
//   then  = strip any remaining "(…ไทย…)" parenthetical (the 95 "English (ไทย)" names, (อย.) etc.)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'astro/src/content/articles-en');
const TH = /[ก-฾เ-๛]/;

// ---- 110 pure-Thai tags → English ----
const TAG = {
  'ลาบ':'Larb','ก้อย':'Koi','ร้านตำนาน':'Legendary spot','นั่งยาว':'Lingering-friendly','ลาบเป็ด':'Duck larb',
  'ซอยจุ๊':'Soi ju (raw beef)','ร้านดัง':'Popular spot','ส้มตำ':'Som tam','ในเมือง':'In town','ไก่ย่าง':'Grilled chicken',
  'สวนอาหาร':'Garden restaurant','ลาบเนื้อ':'Beef larb','ราคาประหยัด':'Budget','ตลาด':'Market','กุ้งเผา':'Grilled prawns',
  'ปลาร้าบอง':'Pla ra bong','ของฝาก':'Souvenirs','แจ่วบอง':'Jaew bong','ของฝากรวม':'Mixed souvenirs','ปลาร้า':'Pla ra',
  'ปลาส้ม':'Pla som','ตลาดสด':'Fresh market','หม่ำ':'Mam sausage','ไส้กรอกอีสาน':'Isan sausage','แหนม':'Naem',
  'น้ำปลาร้า':'Pla ra sauce','ชุมชน':'Community','ตลาดโต้รุ่ง':'Night market','ของกิน':'Street eats','ข้าวยำ':'Khao yam',
  'เจ้าเก่า':'Long-running','ต้องลอง':'Must-try','นาซิดาแฆ':'Nasi dagang','ไปก่อนหมด':'Go before it sells out',
  'รวมเมนูเช้า':'Breakfast spots','ครอบครัว':'Family','บรรยากาศดี':'Nice atmosphere','นั่งสบาย':'Comfy seating',
  'ผักเยอะ':'Lots of veggies','โรตี':'Roti','ชาชัก':'Pulled tea','บรรยากาศเมืองเก่า':'Old-town vibe','ไก่กอและ':'Kai kolae',
  'สตรีทฟู้ด':'Street food','ตลาดนัด':'Market fair','เดินชิม':'Food walk','ซีฟู้ด':'Seafood','ราคาท้องถิ่น':'Local prices',
  'คนพื้นที่ไป':'Local favorite','วิวทะเล':'Sea view','มาเป็นกลุ่ม':'Good for groups','ริมหาด':'Beachfront','บุฟเฟต์':'Buffet',
  'งบคุ้ม':'Great value','วัดหลวง':'Royal temple','พระแก้วมรกต':'Emerald Buddha','ห้ามพลาด':"Don't miss",'พระนอน':'Reclining Buddha',
  'นวดแผนไทย':'Thai massage','พระปรางค์':'Prang tower','ริมเจ้าพระยา':'Chao Phraya-side','ถ่ายรูป':'Photo spot',
  'สถาปัตยกรรม':'Architecture','มรดกโลก':'World Heritage','เศียรพระในรากไม้':'Buddha head in tree roots','พระธาตุล้านนา':'Lanna stupa',
  'วิวเมือง':'City view','วัดศิลปะ':'Art temple','สีขาว':'White temple','สีน้ำเงิน':'Blue temple','วัดล้านนา':'Lanna temple',
  'ในเมืองเก่า':'In the old town','ล้านนา':'Lanna','รางวัลยูเนสโก':'UNESCO-listed','พระธาตุริมโขง':'Mekong-side stupa',
  'พระธาตุปีวอก':'Year-of-the-Monkey stupa','พระธาตุล้านช้าง':'Lan Xang stupa','วัดคู่เมือง':'City landmark temple',
  'เจดีย์ใหญ่':'Great chedi','วิวเขา':'Mountain view','หลวงพ่อคูณ':'Luang Pho Khun','วิหารศิลป์':'Ornate viharn',
  'หอไตรกลางน้ำ':'Scripture hall on the water','งานช่างไม้':'Woodcraft','พระธาตุลังกา':'Lanka-style stupa','เก่าแก่':'Historic',
  'วัดบนเขา':'Hilltop temple','เจดีย์ทรงดอกบัวตูม':'Lotus-bud chedi','ถ่ายรูปชุดไทย':'Thai-costume photos',
  'เงาพระธาตุหัวกลับ':'Inverted stupa reflection','ธรรมชาติ':'Nature','ริมโขง':'Mekong-side','ต้องไป':'Must-visit',
  'หน้าแล้ง':'Dry season','วัฒนธรรม':'Culture','ถ่ายรูปกลางคืน':'Night photography','เช็กอิน':'Check-in spot',
  'พระอาทิตย์ขึ้น':'Sunrise','ทะเลหมอก':'Sea of mist','น้ำตก':'Waterfall','มุมลับ':'Hidden corner','หินรูปทรง':'Rock formations',
  'แวะสั้น':'Quick stop','ฟรี':'Free','เมือง':'In town','สวนสาธารณะ':'Public park','ความรู้':'Educational',
  'ริมแม่น้ำ':'Riverside','แวะกินข้าว':'Meal stop','วิวน้ำ':'Water view',
};

// ---- Thai-first / mixed restaurant names (whole value) → English ----
const NAME = [
  ['ไร่ภูนับดาว (Phu Nub Dao Cafe & Farm)', 'Phu Nub Dao Cafe & Farm'],
  ['จิตตัง (Jittang Permaculture Cafe)', 'Jittang Permaculture Cafe'],
  ['กระชัง เขาหลัก (Krachang Khao Lak)', 'Krachang Khao Lak'],
  ['ตะโกลา (Takola)', 'Takola'],
  ['นายเมือง (Nai Mueang)', 'Nai Mueang'],
  ['บ้านเขาหลักซีฟู้ด (Baan Khao Lak Seafood)', 'Baan Khao Lak Seafood'],
  ['สมอเรือ (Samo Ruea)', 'Samo Ruea'],
  ['ท่าศาลาซีฟู้ด (Tha Sala Seafood)', 'Tha Sala Seafood'],
  ['หรอยเล เขาหลัก (Roilay Khao Lak)', 'Roilay Khao Lak'],
  ['ทะเลทอง (Talay Thong)', 'Talay Thong'],
  ['ริมเลซีฟู้ด อ่าวพังงา (Rim Le Seafood)', 'Rim Le Seafood'],
  ["เลอกองเก่า cafe' de phraeris", 'Le Gong Kao Cafe de Phraeris'],
  ['Lin Fish Ball Noodles — Luk Chin Pla Nang Fa (หลิน ก๋วยเตี๋ยวปลา)', 'Lin Fish Ball Noodles — Luk Chin Pla Nang Fa'],
  ['Thai-Danish Dairy Farm (DPO Farm / อ.ส.ค.)', 'Thai-Danish Dairy Farm (DPO Farm)'],
  ['Dear Phangan (ถึงพะงัน) — Southern home-cook under the coconut grove', 'Dear Phangan — Southern home cooking under the coconut grove'],
];
const WHOLE = new Map([...Object.entries(TAG), ...NAME]);

// ---- embedded Thai (substring) → English ----
const SUB = [
  ['"ถนนคนเดิน เสมา ๑๐๐๐ ปี อำนาจเจริญ"', '"Sema 1000 Years Walking Street"'],
  ["the Facebook page 'อุทยานแห่งชาติภูลังกา' (Phu Langka National Park)", 'the Facebook page for Phu Langka National Park'],
  ['Cross River / ข้ามฟาก', 'Cross River'],
  ['"อุทยานแห่งชาติแม่วงก์ Mae Wong National Park."', '"Mae Wong National Park."'],
  ['น้ำตกมวกเหล็ก (Muak Lek Waterfall)', 'Muak Lek Waterfall'],
  ['Pam Bok / น้ำตกปำบก', 'Pam Bok Waterfall'],
  ['#ทุ่งทานตะวันสระบุรี', '#SaraburiSunflowers'],
  ['"ทุ่งทานตะวันสระบุรี" (Saraburi Sunflower)', '"Saraburi Sunflower"'],
];

const stripThaiParens = (s) => s.replace(/\s*\([^)]*[ก-฾เ-๛][^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();

function fixStr(s) {
  if (!TH.test(s)) return s;
  if (WHOLE.has(s)) return WHOLE.get(s);
  for (const [from, to] of SUB) if (s.includes(from)) s = s.split(from).join(to);
  if (TH.test(s)) s = stripThaiParens(s);
  return s;
}

let changed = 0; const unmapped = new Set();
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.json')) continue;
  const p = path.join(DIR, f);
  let raw = fs.readFileSync(p, 'utf8');
  if (!TH.test(raw)) continue;
  const d = JSON.parse(raw);
  let touched = false;
  (function walk(o) {
    if (Array.isArray(o)) { o.forEach((v, i) => { if (typeof v === 'string') { const n = fixStr(v); if (n !== v) { o[i] = n; touched = true; } } else walk(v); }); return; }
    if (o && typeof o === 'object') for (const k of Object.keys(o)) { const v = o[k]; if (typeof v === 'string') { const n = fixStr(v); if (n !== v) { o[k] = n; touched = true; } } else walk(v); }
  })(d);
  // collect anything still Thai
  (function w2(o) { if (Array.isArray(o)) o.forEach(w2); else if (o && typeof o === 'object') for (const k in o) w2(o[k]); else if (typeof o === 'string' && TH.test(o)) unmapped.add(o.slice(0, 90)); })(d);
  if (touched) { fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n'); changed++; }
}
console.log('files changed:', changed);
console.log('STILL-THAI (unmapped):', unmapped.size);
if (unmapped.size) [...unmapped].forEach((s) => console.log('  • ' + s));
