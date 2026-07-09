// Apply precise, verified fixes for the specific garbled tokens the adversarial verify found in reviews-ja.
// Idempotent: each replacement only fires if the bad token is present. Reports before/after.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname, '..', '..', 'astro/src/content/reviews-ja');
const FIXES = [
  { file: 'review-hilton-pattaya.json', from: '270度の湾景色が楽しめるロビジタルの34階ホライズン', to: '270度の湾景色が楽しめる34階のホライズン', why: 'hallucinated ロビジタル token in visible body' },
  { file: 'review-aiyapura-koh-chang.json', from: 'シービュール付き', to: 'シービュー付き', why: 'extra ル (should be シービュー付き)' },
  { file: 'review-reverie-siam-resort-pai.json', from: 'Silhouest', to: 'Silhouette', why: 'misspelled restaurant proper name', all: true },
  { file: 'review-intercontinental-khao-yai-resort-nakhon-ratchasima.json', from: 'パクチーン', to: 'パクチョン', why: 'wrong katakana for Pak Chong (rest of file uses パクチョン)', all: true },
];

let applied = 0;
for (const fx of FIXES) {
  const p = path.join(DIR, fx.file);
  let txt = fs.readFileSync(p, 'utf8');
  const count = txt.split(fx.from).length - 1;
  if (count === 0) { console.log(`SKIP  ${fx.file} — token "${fx.from}" not present (already fixed?)`); continue; }
  const n = fx.all ? count : 1;
  txt = fx.all ? txt.split(fx.from).join(fx.to) : txt.replace(fx.from, fx.to);
  JSON.parse(txt); // fail loudly if the edit broke JSON
  fs.writeFileSync(p, txt);
  applied++;
  console.log(`FIX   ${fx.file} — replaced ${n}/${count} "${fx.from}"→"${fx.to}" (${fx.why})`);
}
console.log(`\n${applied}/${FIXES.length} fixes applied.`);
