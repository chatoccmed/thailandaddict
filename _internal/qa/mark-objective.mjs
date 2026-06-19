#!/usr/bin/env node
// Phase-A objective marker: for every ledger item, run deterministic checks and set
// dims.template (schema/alignment/required/keywords) + dims.writing (no ban words) +
// dims.image (hero+gallery files EXIST — the "match real hotel" part still needs an agent, left null→'exists').
// data dim stays null (agent-only). Writes results back into the ledger.
// Usage: node _internal/qa/mark-objective.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const LEDGER = path.join(ROOT, '_internal/qa/qa-ledger.json');
const RVD = path.join(ROOT, 'astro/src/content/reviews');
const RD = path.join(ROOT, 'astro/src/content/roundups');
const AD = path.join(ROOT, 'astro/src/content/articles');
const PUB = path.join(ROOT, 'astro/public');
const dirOf = k => k === 'review' ? RVD : k === 'roundup' ? RD : AD;
const BAN = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'สุดยอด', 'อันซีน'];
const ALLOW = ['สุดยอดเนื้อตุ๋น'];
const imgExists = p => { if (!p) return true; let f = String(p).replace(/^\//, ''); return fs.existsSync(path.join(PUB, f)); };

const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
let tpass = 0, tfail = 0, wfail = 0, ifail = 0;
const today = '2026-06-19';
for (const it of L.items) {
  if (it.status === 'checked') continue; // already fully verified/accepted — never re-check (owner: don't re-check checked)
  const fp = path.join(dirOf(it.kind), it.file);
  let j; try { j = JSON.parse(fs.readFileSync(fp, 'utf8')); } catch (e) { it.dims.template = false; it.status = 'issue'; it.notes = 'BAD JSON: ' + e.message; tfail++; continue; }
  const issues = [];
  // template
  if (it.kind === 'roundup') {
    const e = (j.entries || []).length, t = (j.toc || []).length, c = (j.compareRows || []).length;
    if (!(e === t && t === c && e > 0)) issues.push(`misaligned ${e}/${t}/${c}`);
    (j.entries || []).forEach((en, i) => { const s = String(en.reviewUrl || '').replace(/\.html$/, ''); if (!s) issues.push(`entry[${i}] no reviewUrl`); else if (!fs.existsSync(path.join(RVD, s + '.json'))) issues.push(`dead reviewUrl ${s}`); });
  } else if (it.kind === 'review') {
    if (!j.keywords) issues.push('no keywords');
    for (const k of ['slug', 'cluster', 'name', 'body']) if (j[k] === undefined) issues.push('missing ' + k);
  } else { // article
    if (!j.keywords) issues.push('no keywords');
    for (const k of ['slug', 'type', 'cluster', 'title', 'h1', 'blocks']) if (j[k] === undefined) issues.push('missing ' + k);
  }
  it.dims.template = issues.length === 0;
  if (issues.length) { tfail++; } else tpass++;
  // writing (ban words)
  let blob = JSON.stringify(j); for (const a of ALLOW) blob = blob.split(a).join('');
  const bans = BAN.filter(b => blob.includes(b));
  it.dims.writing = bans.length === 0;
  if (bans.length) { issues.push('ban:' + bans.join(',')); wfail++; }
  // image exists (hero + gallery)
  const imgs = [j.heroImg, ...((j.gallery || []).map(g => typeof g === 'string' ? g : (g && (g.src || g.img))))].filter(Boolean);
  const missImgs = imgs.filter(p => !imgExists(p));
  it.dims.image = missImgs.length === 0 ? 'exists' : false; // 'exists'=files present (match still needs agent); false=missing files
  if (missImgs.length) { issues.push('img-missing:' + missImgs.length); ifail++; }
  // status: objective dims done; data + image-match still pending agent → keep 'checked-objective' marker
  it.notes = issues.join(' | ');
  it.status = issues.length ? 'issue' : 'checked-objective';
  it.date = today;
}
fs.writeFileSync(LEDGER, JSON.stringify(L, null, 0));
const c = {}; for (const it of L.items) c[it.status] = (c[it.status] || 0) + 1;
console.log('objective pass done.');
console.log('template: pass', tpass, 'fail', tfail, '| writing fails', wfail, '| image-missing items', ifail);
console.log('status now:', JSON.stringify(c));
