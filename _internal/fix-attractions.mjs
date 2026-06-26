// Deterministic cleanup of formulaic Thai left in attraction twins:
//  - ฿<number> → "<number> THB" (the ฿ baht glyph is in the Thai Unicode block)
//  - "ฟรี" → "Free"
//  - attraction foodType category words → English
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const ENDIR = path.join(ROOT, 'astro/src/content/articles-en');
const FOODTYPE = {
  'แลนด์มาร์ก': 'Landmark', 'วัด': 'Temple', 'แลนด์มาร์ก/ศูนย์อนุรักษ์': 'Landmark / conservation center',
  'ห้าง': 'Mall', 'สวนสาธารณะ': 'Public park', 'อุทยานแห่งชาติ': 'National park',
  'แลนด์มาร์ก/ศาลเจ้า': 'Landmark / shrine', 'ทุ่งดอกไม้': 'Flower field', 'ภูเขา/วัด': 'Mountain / temple',
  'โบราณสถาน': 'Heritage site', 'ตลาด': 'Market', 'ศาลเจ้า': 'Shrine', 'น้ำตก': 'Waterfall',
  'ชายหาด': 'Beach', 'ทะเล': 'Sea', 'จุดชมวิว': 'Viewpoint', 'พิพิธภัณฑ์': 'Museum', 'ตลาดน้ำ': 'Floating market',
};
const bahtFix = s => s.replace(/฿\s?([\d,]+(?:\s?[–\-]\s?[\d,]+)?)/g, '$1 THB').replace(/฿/g, 'THB');
function fixStr(v, key) {
  if (typeof v !== 'string') return v;
  if (key === 'foodType' && FOODTYPE[v.trim()]) return FOODTYPE[v.trim()];
  let out = v;
  if (out.includes('ฟรี')) out = out.replace(/ฟรี/g, 'Free');
  if (out.includes('฿')) out = bahtFix(out);
  return out;
}
function walk(o) {
  if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) o[i] = (o[i] && typeof o[i] === 'object') ? (walk(o[i]), o[i]) : fixStr(o[i], ''); return; }
  if (o && typeof o === 'object') for (const k of Object.keys(o)) { if (o[k] && typeof o[k] === 'object') walk(o[k]); else o[k] = fixStr(o[k], k); }
}
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(ENDIR).filter(f => f.startsWith('top10-attractions-') && f.endsWith('.json'));
let changed = 0;
for (const f of files) {
  const p = path.join(ENDIR, f);
  let a; try { a = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
  const before = JSON.stringify(a); walk(a); const after = JSON.stringify(a);
  if (before !== after) { fs.writeFileSync(p, after); changed++; }
}
console.log(`fix-attractions: updated ${changed} file(s)`);
