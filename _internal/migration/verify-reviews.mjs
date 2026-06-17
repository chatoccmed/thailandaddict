#!/usr/bin/env node
// Validate review/roundup JSON files: JSON validity, body word count, forbidden words,
// and roundup structural alignment (entries===toc===compareRows). No agents — pure checks.
// Usage: node _internal/migration/verify-reviews.mjs <file-or-glob-dir> ...
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BAN = ['ตอบโจทย์','โดดเด่น','ครบครัน','ระดับโลก','สุดยอด','อันซีน'];
// Slang particles only count at a clause boundary (followed by space/punct/tag/quote/end),
// so legitimate words like ปะปน / ประปา / ละเอียด don't trip the check.
// Slang particles only at a clause boundary; ปะ excludes ศิลปะ (art) via negative lookbehind.
const SLANG = [['อ่ะ',''],['ปะ','(?<!ศิล)'],['แหละ',''],['ล่ะ','']].map(([w,lb]) => new RegExp(lb + w + '(?=[\\s<"\'.,!?)\\]]|$)'));

const stripTags = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
// Thai-aware word proxy: count Thai char runs + latin words. The workflow's "2000 words"
// for Thai ≈ ~ this token count (calibrated vs pilot below).
function wordCount(text) {
  const t = stripTags(text);
  const thai = (t.match(/[฀-๿]+/g) || []).join('');
  const thaiChars = thai.length;
  const latin = (t.match(/[A-Za-z0-9]+/g) || []).length;
  // Thai: ~ avg 4 chars/word → thaiChars/4 as word estimate
  return { thaiChars, thaiWordEst: Math.round(thaiChars / 4), latin };
}

function checkReview(path, obj) {
  const issues = [];
  const bodyText = (obj.body || []).map(b => b.html || '').join('\n');
  const wc = wordCount(bodyText);
  // Calibrated to approved pilots: their bodies = 7031–7450 Thai chars = "2000 words".
  // Pass bar = 6800 Thai chars (slightly below pilot floor for tolerance).
  if (wc.thaiChars < 6800) issues.push(`SHORT body ${wc.thaiChars} thaiChars (<6800 ≈ pilot floor)`);
  // forbidden words across whole file
  const all = JSON.stringify(obj);
  for (const b of BAN) if (all.includes(b)) issues.push(`BAN:${b}`);
  for (const re of SLANG) { const m = all.match(re); if (m) issues.push(`SLANG:${m[0]}`); }
  // length constraints from schema
  if (!Array.isArray(obj.gallery) || obj.gallery.length !== 3) issues.push('gallery!=3');
  if (!Array.isArray(obj.highlights) || obj.highlights.length !== 3) issues.push('highlights!=3');
  if (!Array.isArray(obj.ratingBars) || obj.ratingBars.length !== 6) issues.push('ratingBars!=6');
  if (!Array.isArray(obj.honestChecks) || obj.honestChecks.length !== 3) issues.push('honestChecks!=3');
  if (!Array.isArray(obj.tips) || obj.tips.length !== 4) issues.push('tips!=4');
  return { wc, issues };
}

function checkRoundup(path, obj) {
  const issues = [];
  const e = (obj.entries || []).length, t = (obj.toc || []).length, c = (obj.compareRows || []).length;
  if (!(e === t && t === c)) issues.push(`MISALIGN entries=${e} toc=${t} compareRows=${c}`);
  // each entry storyHtml >=200 words (Thai est)
  for (const en of (obj.entries || [])) {
    const wc = wordCount(en.storyHtml || '');
    // ≥200 words Thai ≈ ≥800 thaiChars (pilot entries run 1138–1365).
    if (wc.thaiChars < 800) issues.push(`entry ${en.id || en.name}: story ${wc.thaiChars}c <800 (~200w)`);
  }
  const all = JSON.stringify(obj);
  for (const b of BAN) if (all.includes(b)) issues.push(`BAN:${b}`);
  return { entries: e, issues };
}

const args = process.argv.slice(2);
const files = [];
for (const a of args) {
  let st; try { st = statSync(a); } catch { continue; }
  if (st.isDirectory()) for (const f of readdirSync(a)) { if (f.endsWith('.json')) files.push(join(a, f)); }
  else files.push(a);
}

let okCount = 0, badCount = 0;
const bad = [];
for (const f of files) {
  let obj;
  try { obj = JSON.parse(readFileSync(f, 'utf8')); }
  catch (e) { bad.push(`${f}\n  JSON-INVALID: ${String(e).slice(0,80)}`); badCount++; continue; }
  const isRoundup = f.includes('/roundups/') || f.includes('\\roundups\\') || Array.isArray(obj.entries);
  const r = isRoundup ? checkRoundup(f, obj) : checkReview(f, obj);
  if (r.issues.length) { bad.push(`${f}\n  ${isRoundup ? '['+r.entries+' entries] ' : '[~'+r.wc.thaiWordEst+'w] '}${r.issues.join(' | ')}`); badCount++; }
  else okCount++;
}
console.log(`\nOK: ${okCount}  ISSUES: ${badCount}  TOTAL: ${files.length}\n`);
if (bad.length) console.log('--- FILES WITH ISSUES ---\n' + bad.join('\n'));
