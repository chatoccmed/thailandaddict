// Fix residual Thai-script leaks in AR Wave-2 twins.
// Raw-string longest-key-first substring replace (preserves 2-space formatting).
// Each 'from' key is built from exact codepoints and MUST contain a Thai char.
import fs from 'fs';
import path from 'path';

const cp = (...c) => String.fromCodePoint(...c);

// [fromCodepoints, toString]
const RULES = [
  // Erawan waterfall (half-converted "Erawan" -> إيراوان)
  [[0x625,0x64a,0x631,0x627,0x0e27,0x0e31,0x0e19,0x22,0x2c], 'إيراوان",'], // إيراوัن",  (A)
  [[0x625,0x64a,0x0e23,0x0e32,0x0e27,0x0e31,0x0e19,0x22,0x2c], 'إيراوان",'], // إي+ราวัن", (C)
  [[0x625,0x631,0x627,0x0e27,0x0e31,0x0e19,0x22,0x2c], 'إيراوان",'],        // إراوัن",
  [[0x28,0x625,0x64a,0x631,0x627,0x0e27,0x0e31,0x646], '(إيراوان'],          // (إيراوัن (B, arabic ن)
  [[0x625,0x64a,0x631,0x627,0x0e27,0x0e31,0x646], 'إيراوان'],                // إيراوัن (B, arabic ن)
  [[0x625,0x64a,0x631,0x627,0x0e27,0x0e31,0x0e19], 'إيراوان'],               // إيراوัن (A)
  [[0x625,0x631,0x627,0x0e27,0x0e31,0x0e19], 'إيراوان'],                     // إراوัن
  // Baht word (บาท -> بات); also fixes الบาท -> البات
  [[0x0e1a,0x0e32,0x0e17], 'بات'],
  // Uthayan (national park) أوتي+ยาน -> أوتيان
  [[0x623,0x648,0x62a,0x64a,0x0e22,0x0e32,0x0e19], 'أوتيان'],
  // Pranburi برانب+ุรี -> برانبوري
  [[0x628,0x631,0x627,0x646,0x628,0x0e38,0x0e23,0x0e35], 'برانبوري'],
  // Kathu كاث+ู -> كاتو
  [[0x643,0x627,0x62b,0x0e39], 'كاتو'],
  // Prachuap Khiri Khan parts
  [[0x62e,0x0e35,0x0e23,0x0e35], 'خيري'], // خีรี -> خيري
  [[0x62e,0x0e31,0x0e19], 'خان'],          // خัน -> خان
  // Samui سام+ุي -> ساموي
  [[0x633,0x627,0x645,0x0e38,0x64a], 'ساموي'],
];

const THAI = c => { const p = c.codePointAt(0); return p >= 0x0e00 && p <= 0x0e7f && p !== 0x0e3f; };
const map = RULES.map(([codes, to]) => [codes.map(c => cp(c)).join(''), to]);
// sanity: every from must contain a Thai char
for (const [from] of map) {
  if (![...from].some(THAI)) throw new Error('from lacks Thai char: ' + JSON.stringify(from));
}
// longest-first
map.sort((a, b) => b[0].length - a[0].length);

const FILES = `reviews-ar/review-banphe-hostel-rayong.json
reviews-ar/review-comsaed-river-kwai-resort-kanchanaburi.json
reviews-ar/review-hotel-indigo-phuket-patong-phuket.json
reviews-ar/review-intercontinental-huahin.json
reviews-ar/review-little-white-bird-hostel-koh-kood.json
reviews-ar/review-river-kwai-hotel-kanchanaburi.json
reviews-ar/review-the-float-house-river-kwai-kanchanaburi.json
reviews-ar/review-the-jolly-frog-kanchanaburi.json
reviews-ar/review-u-inchantree-kanchanaburi.json
roundups-ar/top10-hotels-huahin.json
roundups-ar/top10-hotels-nakhon-ratchasima.json
roundups-ar/top10-hotels-prachuap-khiri-khan.json
roundups-ar/top10-hotels-rayong.json
roundups-ar/top10-hotels-samui.json`.split('\n');

const BASE = 'astro/src/content';
let totalRepls = 0;
for (const rel of FILES) {
  const fp = path.join(BASE, rel);
  let txt = fs.readFileSync(fp, 'utf8');
  let n = 0;
  for (const [from, to] of map) {
    if (txt.includes(from)) {
      const before = txt.length;
      txt = txt.split(from).join(to);
      n++;
    }
  }
  fs.writeFileSync(fp, txt);
  if (n) { console.log('patched', rel, '(' + n + ' rule types)'); totalRepls += n; }
}
console.log('done. rule-type hits:', totalRepls);
