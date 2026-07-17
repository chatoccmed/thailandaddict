// Fix residual Thai-script leaks in Hebrew Wave-2 twins (reviews-he + roundups-he ONLY).
// Two passes: (1) whole pure-Thai proper-noun/currency words -> Hebrew transliteration,
// longest-first; (2) per-character map for the Thai letters left embedded inside
// otherwise-Hebrew words. Raw string replace preserves 2-space formatting exactly.
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('astro/src/content');
const DIRS = ['reviews-he', 'roundups-he'];

// Pass 1 — whole Thai words (all chars Thai, or Thai+one stray Hebrew like בาח).
// Sorted longest-first at apply time.
const WORDS = {
  'ทองล่อ': 'תונג לו',      // Thong Lo / Thonglor
  'พร้อมพงษ์': 'פרום פונג',   // Phrom Phong (matches clean)
  'สุขุมวิท': 'סוקומוית',     // Sukhumvit (matches clean, 45x)
  'ท่าประดู่': 'טה פרדו',     // Tha Pradu
  'ทนบุรี': 'תונבורי',       // Thonburi
  'สาทร': 'סאתורן',         // Sathorn (matches clean)
  'อโศก': 'אסוק',           // Asok (matches clean)
  'คุณ': 'קון',             // Khun
  'บาท': 'באט',             // baht
  'บาต': 'באט',             // baht (variant)
  'บาช': 'באט',             // baht (variant, defensive)
  'บาח': 'באט',             // baht (Thai บา + stray Hebrew ח)
  'บאת': 'באט',             // baht (Thai บ + stray Hebrew את)
  'บาต': 'באט',             // baht (Thai บ + า + Thai ต) — covered above, kept explicit
  'ทอง': 'תונג',            // Thong (Wat Traphang Thong) — after ทองล่อ (longest-first)
};

// Pass 2 — Thai letters left embedded in Hebrew words (Kood, Sawankhalok, Kradat,
// Takua, mixed Sathorn, Pai). Applied only after pure words are gone.
const CHARS = {
  'ู': 'ו', // ู sara uu  -> ו   (Kood)
  'ด': 'ד', // ด do dek   -> ד   (Kood)
  'า': 'א', // า sara aa  -> א   (Sawankhalok/Kradat/Takua)
  'ล': 'ל', // ล lo ling  -> ל   (Sawankhalok)
  'ก': 'ק', // ก ko kai   -> ק   (Sawankhalok/Takua)
  'ร': 'ר', // ร ro rua   -> ר   (Kradat/Sathorn)
  'ท': 'ת', // ท to thahan-> ת   (Sathorn)
  'อ': 'ו', // อ o ang    -> ו   (Sathorn)
  'น': 'ן', // น no nu    -> ן   (Sathorn, word-final)
  'ย': 'י', // ย yo yak   -> י   (Pai)
  '์': '',       // ์ thanthakhat (silent) -> delete
};

const wordKeys = Object.keys(WORDS).sort((a, b) => b.length - a.length);
// sanity: every 'from' key holds >=1 Thai char so we never rewrite correct text
for (const k of wordKeys) {
  if (!/[฀-๿]/.test(k)) throw new Error('word key lacks Thai: ' + k);
}

function fix(text) {
  let out = text;
  for (const k of wordKeys) out = out.split(k).join(WORDS[k]);
  for (const [k, v] of Object.entries(CHARS)) out = out.split(k).join(v);
  return out;
}

let changed = 0;
for (const d of DIRS) {
  const dir = path.join(ROOT, d);
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    const out = fix(src);
    if (out !== src) {
      fs.writeFileSync(p, out);
      changed++;
      console.log('fixed', d + '/' + f);
    }
  }
}
console.log('files changed:', changed);
