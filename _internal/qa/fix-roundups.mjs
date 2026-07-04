#!/usr/bin/env node
// Fix roundup integrity issues (TH+EN twins): sync entry.score→review.score, entry.img→review.heroImg,
// swap ban-words, add missing affiliate IDs (Agoda cid, Trip Allianceid/SID). Idempotent.
// Usage: node _internal/qa/fix-roundups.mjs
import fs from 'node:fs';
const ROOT = 'astro/src/content';
const dirs = [`${ROOT}/roundups`, `${ROOT}/roundups-en`];
const revDir = `${ROOT}/reviews`, revEnDir = `${ROOT}/reviews-en`;
const SWAP = { 'ตอบโจทย์': 'ลงตัว', 'โดดเด่น': 'เป็นเอกลักษณ์', 'ครบครัน': 'ครบ', 'ระดับโลก': 'ชั้นนำ', 'สุดยอด': 'ยอดเยี่ยม', 'อันซีน': 'ที่หลายคนยังไม่รู้จัก' };
const slugOf = h => String(h || '').replace(/^.*\//, '').replace(/\.html.*$/, '').replace(/[?#].*$/, '');
const num = s => { const m = String(s).match(/[0-9]+(\.[0-9]+)?/); return m ? parseFloat(m[0]) : null; };
const AGODA = 'cid=1965862', TRIP_A = 'Allianceid=6861268', TRIP_S = 'SID=312919111';
const addAff = (url, isTrip) => {
  if (!url || !/^https?:/.test(url)) return url;
  // domain-aware: cid only on agoda.com; Allianceid only on trip.com/traveloka. Never touch booking.com or other domains.
  if (isTrip) { if (/(trip\.com|traveloka)/.test(url) && !/Allianceid=/.test(url)) url += (url.includes('?') ? '&' : '?') + `${TRIP_A}&${TRIP_S}`; }
  else { if (/agoda\.com/.test(url) && !/cid=/.test(url)) url += (url.includes('?') ? '&' : '?') + AGODA; }
  return url;
};

let scoreFix = 0, imgFix = 0, banFix = 0, affFix = 0, filesChanged = 0;
for (const dir of dirs) {
  const isEn = dir.endsWith('-en');
  const rdir = isEn ? revEnDir : revDir;
  const rev = slug => { try { return JSON.parse(fs.readFileSync(`${rdir}/${slug}.json`, 'utf8')); } catch { return null; } };
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    let raw = fs.readFileSync(`${dir}/${f}`, 'utf8');
    let a; try { a = JSON.parse(raw); } catch { continue; }
    let changed = false;
    // ban-word swap (whole doc)
    for (const [bad, good] of Object.entries(SWAP)) { if (raw.includes(bad)) { const c = raw.split(bad).length - 1; banFix += c; } }
    // entry-level sync + affiliate
    for (const e of (a.entries || [])) {
      const slug = slugOf(e.reviewUrl || e.reviewHref || e.href);
      const r = /^review-/.test(slug) ? rev(slug) : null;
      if (r) {
        const es = num(e.score), rs = num(r.score);
        if (es != null && rs != null && Math.abs(es - rs) > 0.3) { e.score = String(r.score); scoreFix++; changed = true; }
        const eh = String(e.img || '').replace(/^https?:\/\/[^/]+\//, ''), rh = String(r.heroImg || '').replace(/^https?:\/\/[^/]+\//, '');
        if (eh && rh && eh !== rh) { e.img = r.heroImg; imgFix++; changed = true; }
      }
      if (e.agodaUrl) { const n = addAff(e.agodaUrl, false); if (n !== e.agodaUrl) { e.agodaUrl = n; affFix++; changed = true; } }
      if (e.tripUrl) { const n = addAff(e.tripUrl, true); if (n !== e.tripUrl) { e.tripUrl = n; affFix++; changed = true; } }
    }
    let out = changed ? JSON.stringify(a, null, 2) + '\n' : raw;
    // ban-swap on the serialized text (catches prose + entry fields)
    for (const [bad, good] of Object.entries(SWAP)) out = out.split(bad).join(good);
    if (out !== raw) { JSON.parse(out); fs.writeFileSync(`${dir}/${f}`, out); filesChanged++; }
  }
}
console.log(`fix-roundups: files changed ${filesChanged} · score-sync ${scoreFix} · img-sync ${imgFix} · ban-swaps ${banFix} · affiliate-added ${affFix}`);
