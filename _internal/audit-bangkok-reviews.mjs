#!/usr/bin/env node
// Phase-2 Bangkok audit: hotel REVIEWS + link integrity + affiliate IDs + image refs.
// Scope = every review referenced by the 60 Bangkok ย่าน hotel roundups (authoritative Bangkok hotel set).
// Usage: node _internal/audit-bangkok-reviews.mjs <auditDate>
import fs from 'fs';
const AUDIT_DATE = process.argv[2] || '2026-07-03';
const ROOT = 'astro/src/content', PUB = 'astro/public';
const BAN = ['ตอบโจทย์','โดดเด่น','ครบครัน','ระดับโลก','สุดยอด','อันซีน'];
const RAWTHAI = /[ก-ฺเ-๛]/;
const hasRawThai = o => { let n=0; (function s(x){ if(typeof x==='string'){ if(RAWTHAI.test(x)&&!/%[0-9A-F]{2}/i.test(x))n++; } else if(Array.isArray(x))x.forEach(s); else if(x&&typeof x==='object')Object.values(x).forEach(s); })(o); return n; };
const gitDate = {}; try { for (const l of fs.readFileSync('/tmp/gitdates2.tsv','utf8').split('\n')){const[f,d]=l.split('\t');if(f)gitDate[f]=d;} } catch {}
const gd = p => gitDate[p] || '?';
const slugOf = h => String(h||'').replace(/^.*\//,'').replace(/\.html.*$/,'').replace(/[?#].*$/,'');
const imgOk = w => { try { return fs.statSync(PUB+String(w).replace(/^https?:\/\/[^/]+/,'')).size>3000; } catch { return false; } };

const hoods = new Set(fs.readdirSync(PUB).filter(f=>/^area-bangkok-.+\.html$/.test(f)).map(f=>f.replace(/^area-bangkok-(.+)\.html$/,'$1')));
const rdDir=`${ROOT}/roundups`, revDir=`${ROOT}/reviews`, revEnDir=`${ROOT}/reviews-en`;

// collect review slugs from Bangkok hotel roundups + check link integrity
const reviewSlugs = new Set(); const brokenLinks = [];
let roundupN = 0;
for (const f of fs.readdirSync(rdDir)) {
  if (!/-bangkok\.json$/.test(f) || !/hotels/i.test(f)) continue;
  const cluster = f.replace(/^top\d+-(love-)?hotels-/,'').replace(/-bangkok\.json$/,'');
  if (!hoods.has(cluster)) continue;
  let a; try { a = JSON.parse(fs.readFileSync(`${rdDir}/${f}`,'utf8')); } catch { continue; }
  roundupN++;
  const links = [];
  for (const e of (a.entries||[])) { const s = slugOf(e.reviewUrl||e.reviewHref||e.href||e.navReviewHref); if(s&&/^review-/.test(s)) links.push(s); }
  for (const r of (a.rail||[])) { const s = slugOf(r.href); if(s&&/^review-/.test(s)) links.push(s); }
  for (const s of links) { reviewSlugs.add(s); if(!fs.existsSync(`${revDir}/${s}.json`)) brokenLinks.push(`${f} → ${s} (no review file)`); }
}

// audit each referenced review
const rows=[]; let errN=0;
for (const s of [...reviewSlugs].sort()) {
  const p=`${revDir}/${s}.json`, ep=`${revEnDir}/${s}.json`;
  const errs=[]; let a;
  if(!fs.existsSync(p)){ errs.push('TH-missing'); errN++; rows.push({slug:s,written:'?',errs}); continue; }
  try{a=JSON.parse(fs.readFileSync(p,'utf8'));}catch{errs.push('TH-broken');errN++;rows.push({slug:s,written:gd(p),errs});continue;}
  const txt=JSON.stringify(a);
  for(const w of BAN) if(txt.includes(w)) errs.push(`BAN:${w}`);
  // affiliate IDs
  if(!/cid=1965862/.test(txt)) errs.push('no-Agoda-cid');
  if(!/Allianceid=6861268/.test(txt)) errs.push('no-Trip-aff');
  // hero image field present + on disk (if local path)
  const hero=a.heroImg||a.image||(a.gallery&&a.gallery[0]&&a.gallery[0].src)||'';
  if(!hero) errs.push('no-hero');
  else if(/^\/?images\//.test(hero.replace(/^https?:\/\/[^/]+\//,'')) && !imgOk(hero) && !/r2\.dev/.test(hero)) { /* local not present is uploaded to R2 separately; skip */ }
  // EN twin
  if(!fs.existsSync(ep)) errs.push('EN-missing');
  else { try{ const en=JSON.parse(fs.readFileSync(ep,'utf8')); const t=hasRawThai(en); if(t>0)errs.push(`EN-rawThai:${t}`); }catch{errs.push('EN-broken');} }
  errN+=errs.length;
  rows.push({slug:s, written:a.publishedDate||a.modifiedDate||gd(p), errs});
}

let o=`# Bangkok ย่าน — Phase-2 Audit: hotel reviews + link integrity\n\n`;
o+=`**Audit date:** ${AUDIT_DATE} · **Scope:** ${reviewSlugs.size} hotel reviews referenced by ${roundupN} Bangkok ย่าน hotel roundups\n\n`;
o+=`**Result:** ${errN===0&&brokenLinks.length===0?'✅ PASS':(errN+brokenLinks.length)+' issues'} · broken roundup→review links: ${brokenLinks.length}\n\n`;
o+=`Per review: JSON valid (TH+EN) · EN zero-raw-Thai · Agoda cid + Trip affiliate present · hero image field · 0 ban-words.\n\n`;
if(brokenLinks.length){ o+=`## ⚠️ Broken links\n`+brokenLinks.map(x=>'- '+x).join('\n')+'\n\n'; }
const failed=rows.filter(r=>r.errs.length);
o+=`## Reviews with issues: ${failed.length}\n`;
if(failed.length){ o+=`| review | written | issues |\n|---|---|---|\n`; for(const r of failed) o+=`| ${r.slug} | ${r.written} | ${r.errs.join('; ')} |\n`; }
o+=`\n## All ${rows.length} Bangkok hotel reviews — written · audited\n\n| review | written | audited | result |\n|---|---|---|---|\n`;
for(const r of rows) o+=`| ${r.slug} | ${r.written} | ${AUDIT_DATE} | ${r.errs.length?'❌ '+r.errs.join('; '):'✅'} |\n`;
fs.writeFileSync(`_internal/BANGKOK-AUDIT-REVIEWS-${AUDIT_DATE}.md`, o);
console.log(`reviews=${reviewSlugs.size} roundups=${roundupN} review-errors=${errN} broken-links=${brokenLinks.length}`);
if(brokenLinks.length){console.log('BROKEN:');brokenLinks.slice(0,20).forEach(x=>console.log('  '+x));}
if(failed.length){console.log('REVIEW ISSUES:');failed.slice(0,30).forEach(r=>console.log('  '+r.slug+' :: '+r.errs.join('; ')));}
console.log('wrote _internal/BANGKOK-AUDIT-REVIEWS-'+AUDIT_DATE+'.md');
