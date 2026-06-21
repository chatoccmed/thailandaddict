// Reusable matcher for the CC-licensed food-image library (_internal/food-image-lib.json).
// Use in the eat-ranking engine/assembler: when a restaurant has NO real IG/FB embed,
// match its foodType/cuisine/signature against the library and use the result as a
// representative photo (libImg/libCredit/libCreditHref → renders as the "🍜 รูป" tab).
//
//   import { matchFoodImage } from './lib-match.mjs';
//   const pic = matchFoodImage(r.foodType, r.cuisine, r.signature, r.name);
//   if (!r.igPost && !r.fbPage && pic) Object.assign(r, pic);
import fs from 'node:fs';
import path from 'node:path';

const LIB = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../food-image-lib.json'), 'utf8')).images;

// extra aliases → library key (for terms the manifest keywords don't cover)
const ALIAS = [
  { kw: ['หมูกระทะ', 'mookata', 'ปิ้งย่าง', 'บุฟเฟ่ต์', 'buffet', 'bbq'], key: 'grilled-chicken' },
  { kw: ['ก๋วยเตี๋ยวเรือ'], key: 'boat-noodle' },
  { kw: ['ขนมจีน', 'น้ำเงี้ยว'], key: 'noodle' },
];

export function matchFoodImage(...texts) {
  const hay = texts.filter(Boolean).join(' ').toLowerCase();
  let best = null, bestScore = 0;
  for (const e of LIB) {
    const score = e.keywords.reduce((n, k) => hay.includes(String(k).toLowerCase()) ? n + 1 : n, 0);
    if (score > bestScore) { bestScore = score; best = e; }
  }
  if (!best) {
    for (const a of ALIAS) if (a.kw.some(k => hay.includes(k.toLowerCase()))) { best = LIB.find(e => e.key === a.key); break; }
  }
  const e = best || LIB.find(x => x.key === 'street-food') || LIB[0];
  return e ? { libImg: e.img, libCredit: e.credit, libCreditHref: e.creditHref } : null;
}
