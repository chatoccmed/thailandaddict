// One-off recovery: re-translate the formulaic image-credit lead segments that an
// earlier resync wrongly forced back to Thai. Only touches credit-caption fields
// (libCredit / credit / heroCredit); replaces the lead segment (text before " · ").
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const ENDIR = path.join(ROOT, 'astro/src/content/articles-en');
const THAI = /[฀-๿]/;
const CREDIT_KEYS = new Set(['libCredit', 'credit', 'heroCredit']);
const M = {
  'ภาพประกอบ: ก๋วยเตี๋ยว': 'Illustrative image: noodles',
  'ภาพประกอบ: คาเฟ่': 'Illustrative image: café',
  'ภาพประกอบ: สตรีทฟู้ด': 'Illustrative image: street food',
  'ภาพประกอบ: อาหารทะเล': 'Illustrative image: seafood',
  'ภาพประกอบ: ลาบ': 'Illustrative image: larb',
  'ภาพประกอบ: ต้มยำ': 'Illustrative image: tom yum',
  'ภาพประกอบ: ส้มตำ': 'Illustrative image: som tam',
  'ภาพประกอบ: แกง': 'Illustrative image: curry',
  'ภาพประกอบ: ขนม': 'Illustrative image: dessert',
  'ภาพประกอบ: ข้าวขาหมู': 'Illustrative image: pork leg rice',
  'ภาพประกอบ: ข้าวซอย': 'Illustrative image: khao soi',
  'ภาพประกอบ: อาหารเหนือ': 'Illustrative image: northern Thai food',
  'ภาพประกอบ: โจ๊ก': 'Illustrative image: rice porridge',
  'ภาพประกอบ: ข้าวมันไก่': 'Illustrative image: chicken rice',
  'ภาพประกอบ: ติ่มซำ': 'Illustrative image: dim sum',
  'ภาพประกอบ: ไก่ย่าง': 'Illustrative image: grilled chicken',
  'ภาพประกอบ: ผัดไทย': 'Illustrative image: pad thai',
  'ภาพประกอบ: ไส้อั่ว': 'Illustrative image: sai ua (northern sausage)',
  'ภาพ: สวนลุมพินี (วิวทะเลสาบ-เส้นขอบฟ้าสีลม-สาทร)': 'Photo: Lumphini Park (lake view — Silom–Sathon skyline)',
  'ภาพ: บ้าน ม.ร.ว.คึกฤทธิ์ ปราโมช': 'Photo: M.R. Kukrit Pramoj Heritage Home',
  'ภาพ: ซอยคาวบอย': 'Photo: Soi Cowboy',
  'ภาพ: สวนเบญจสิริ': 'Photo: Benjasiri Park',
  'ภาพ: ย่านนานา (BTS นานา)': 'Photo: Nana area (BTS Nana)',
  'ภาพ: แผงสตรีทฟู้ดริมถนนสุขุมวิท (ภาพแทนบรรยากาศ ไม่ใช่ซอย 38 โดยตรง)': 'Photo: street food stalls along Sukhumvit Road (illustrative — not Soi 38 specifically)',
};

const files = fs.readdirSync(ENDIR).filter(f => f.endsWith('.json'));
let changed = 0; const unmapped = new Set();
function fixVal(v) {
  if (typeof v !== 'string' || !THAI.test(v)) return v;
  const idx = v.indexOf(' · ');
  const lead = idx === -1 ? v : v.slice(0, idx);
  if (M[lead]) return M[lead] + (idx === -1 ? '' : v.slice(idx));
  unmapped.add(lead);
  return v;
}
function walk(o) {
  if (Array.isArray(o)) { o.forEach((v, i) => { if (v && typeof v === 'object') walk(v); }); return; }
  if (o && typeof o === 'object') for (const k of Object.keys(o)) {
    if (CREDIT_KEYS.has(k)) o[k] = fixVal(o[k]);
    else if (o[k] && typeof o[k] === 'object') walk(o[k]);
  }
}
for (const f of files) {
  let a; try { a = JSON.parse(fs.readFileSync(path.join(ENDIR, f), 'utf8')); } catch { continue; }
  const before = JSON.stringify(a);
  walk(a);
  const after = JSON.stringify(a);
  if (before !== after) { fs.writeFileSync(path.join(ENDIR, f), after); changed++; }
}
console.log(`fixed credit captions in ${changed} file(s)`);
if (unmapped.size) { console.log('UNMAPPED Thai credit leads (add to map):'); for (const u of unmapped) console.log('   ' + u); }
