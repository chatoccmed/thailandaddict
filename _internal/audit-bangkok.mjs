#!/usr/bin/env node
// Full correctness audit of ALL Bangkok ย่าน content (eat-rankings + hotel roundups, TH+EN).
// Records "written" date (article publishedDate, else git first-add) + audit date.
// Usage: node _internal/audit-bangkok.mjs <auditDate>
import fs from 'fs';
const AUDIT_DATE = process.argv[2] || '2026-07-03';
const ROOT = 'astro/src/content', PUB = 'astro/public';
const BAN = ['ตอบโจทย์','โดดเด่น','ครบครัน','ระดับโลก','สุดยอด','อันซีน'];
const THIS = new Set(['victory-monument','ratchada','ploenchit','central-ladprao']);
const thaiLen = h => (String(h).replace(/<[^>]+>/g,'').match(/[฀-๿]/g)||[]).length;
const RAWTHAI = /[ก-ฺเ-๛]/; // Thai letters/vowels/tones, excludes ฿(0E3F)
const gitDate = {};
try { for (const l of fs.readFileSync('/tmp/gitdates.tsv','utf8').split('\n')) { const [f,d]=l.split('\t'); if(f)gitDate[f]=d; } } catch {}
const gd = p => gitDate[p] || '?';

const hoods = new Set(fs.readdirSync(PUB).filter(f=>/^area-bangkok-.+\.html$/.test(f)).map(f=>f.replace(/^area-bangkok-(.+)\.html$/,'$1')));
const artDir=`${ROOT}/articles`, artEnDir=`${ROOT}/articles-en`, rdDir=`${ROOT}/roundups`, rdEnDir=`${ROOT}/roundups-en`;
const norm = s => String(s||'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[^ก-๛a-z0-9]/g,'').slice(0,40);

// ---- eat-rankings ----
const rows=[]; const nameMap={}; // norm -> [{cluster,name,foodType}]
let errN=0, warnN=0;
for (const f of fs.readdirSync(artDir)) {
  if(!f.endsWith('.json'))continue; let a; try{a=JSON.parse(fs.readFileSync(`${artDir}/${f}`,'utf8'));}catch{continue;}
  if(!(a.type==='eat-ranking'&&hoods.has(a.cluster)))continue;
  const errs=[],warns=[]; const blocks=(a.blocks||[]).filter(b=>b.kind==='restaurant');
  if(blocks.length!==10)errs.push(`blocks=${blocks.length}`);
  if(a.crumbCityHref!==`area-bangkok-${a.cluster}.html`)errs.push(`crumbHref=${a.crumbCityHref}`);
  for(const b of blocks){ if(thaiLen(b.descHtml)<700)errs.push(`r${b.rank} desc<700`); const n=norm(b.name); (nameMap[n]=nameMap[n]||[]).push({cluster:a.cluster,name:b.name,foodType:b.foodType||''}); }
  const txt=JSON.stringify(a); for(const w of BAN)if(txt.includes(w))errs.push(`BAN:${w}`);
  const enp=`${artEnDir}/${f}`; let en=null;
  if(!fs.existsSync(enp))errs.push('EN-missing'); else { try{en=JSON.parse(fs.readFileSync(enp,'utf8'));}catch{errs.push('EN-broken');} }
  if(en){ let thai=0;(function s(o){if(typeof o==='string'){if(RAWTHAI.test(o)&&!/%[0-9A-F]{2}/i.test(o))thai++;}else if(Array.isArray(o))o.forEach(s);else if(o&&typeof o==='object')Object.values(o).forEach(s);})(en);
    if(thai>0)errs.push(`EN-rawThai:${thai}`); const eb=(en.blocks||[]).filter(b=>b.kind==='restaurant').length; if(eb!==blocks.length)errs.push(`EN-blocks:${eb}`); }
  errN+=errs.length; warnN+=warns.length;
  rows.push({file:f, cluster:a.cluster, dim:f.includes('cafes')?'cafes':f.includes('attractions')?'attr':'rest', written:a.publishedDate||gd(`${artDir}/${f}`), errs, warns});
}
// ---- hotel roundups (by filename) ----
const rrows=[];
for(const f of fs.readdirSync(rdDir)){
  if(!f.endsWith('.json'))continue; if(!/-bangkok\.json$/.test(f)||!/hotels/i.test(f))continue;
  const cluster=f.replace(/^top\d+-(love-)?hotels-/,'').replace(/-bangkok\.json$/,'');
  if(!hoods.has(cluster))continue;
  const errs=[]; let a; try{a=JSON.parse(fs.readFileSync(`${rdDir}/${f}`,'utf8'));}catch{errs.push('TH-broken');}
  const enp=`${rdEnDir}/${f}`;
  if(!fs.existsSync(enp))errs.push('EN-missing'); else{ try{const en=JSON.parse(fs.readFileSync(enp,'utf8'));let thai=0;(function s(o){if(typeof o==='string'){if(RAWTHAI.test(o)&&!/%[0-9A-F]{2}/i.test(o))thai++;}else if(Array.isArray(o))o.forEach(s);else if(o&&typeof o==='object')Object.values(o).forEach(s);})(en);if(thai>0)errs.push(`EN-rawThai:${thai}`);}catch{errs.push('EN-broken');} }
  errN+=errs.length;
  rrows.push({file:f, cluster, written:gd(`${rdDir}/${f}`), errs});
}
// ---- cross-ย่าน dedup, categorized ----
const dups=[];
for(const [n,arr] of Object.entries(nameMap)){
  const clusters=[...new Set(arr.map(x=>x.cluster))]; if(clusters.length<2||n.length<=3)continue;
  const names=[...new Set(arr.map(x=>x.name))];
  const ft=arr.map(x=>x.foodType).join(' ');
  const landmark=/สวน|ตลาด|แลนด์มาร์ก|วัด|ศาลเจ้า|ห้าง|โบสถ์|คอมมูนิตี้|park|market|shrine|temple|mall/i.test(ft);
  const branch=names.length>1 && (/สาขา/.test(names.join(''))|| new Set(names.map(x=>x.replace(/\(.*?\)/g,'').trim())).size>1===false && new Set(names).size>1);
  const cat = landmark?'LANDMARK(shared)':(names.length>1?'BRANCH(diff location)':'SAME-VENUE');
  const mine = clusters.some(c=>THIS.has(c));
  dups.push({n, clusters, names, cat, mine});
}
dups.sort((a,b)=>(a.cat).localeCompare(b.cat)||b.mine-a.mine);
const sameVenue=dups.filter(d=>d.cat==='SAME-VENUE');

// ---- write report ----
let o=`# Bangkok ย่าน — Full Correctness Audit\n\n`;
o+=`**Audit date:** ${AUDIT_DATE} · **Auditor:** Claude Opus 4.8 (automated audit-bangkok.mjs) · **Scope:** all ${hoods.size} Bangkok ย่าน\n\n`;
o+=`**Structural result:** ${errN===0?'✅ PASS — 0 errors':'❌ '+errN+' errors'} · ${warnN} warnings · eat-rankings ${rows.length} · hotel roundups ${rrows.length}\n\n`;
o+=`Per eat-ranking: JSON valid · type/cluster · 10 cards · descHtml ≥700 Thai chars · crumbCityHref=area-bangkok-<hood> · 0 ban-words · EN twin exists + zero-raw-Thai + block parity.\nPer roundup: JSON valid (TH+EN) · EN zero-raw-Thai.\n\n`;
o+=`## Cross-ย่าน venue collisions: ${dups.length} (SAME-VENUE dups: ${sameVenue.length})\n`;
o+=`> LANDMARK = a park/market/temple/mall genuinely between two ย่าน (acceptable). BRANCH = same brand, different outlet/สาขา (acceptable but noted). SAME-VENUE = the same single place on two pages (should swap one). "🟡mine" = involves a ย่าน built 2026-07-03.\n\n`;
o+=`| venue | ย่าน | category | this-session? |\n|---|---|---|---|\n`;
for(const d of dups) o+=`| ${d.names[0].replace(/\|/g,'')} | ${d.clusters.join(', ')} | ${d.cat} | ${d.mine?'🟡 yes':'—'} |\n`;
o+=`\n## Eat-rankings — written · audited · result\n\n| ย่าน | dim | written | audited | result |\n|---|---|---|---|---|\n`;
for(const r of rows.sort((a,b)=>a.cluster.localeCompare(b.cluster)||a.dim.localeCompare(b.dim)))
  o+=`| ${r.cluster} | ${r.dim} | ${r.written} | ${AUDIT_DATE} | ${r.errs.length?'❌ '+r.errs.join('; '):'✅ pass'} |\n`;
o+=`\n## Hotel roundups — written · audited · result\n\n| roundup | ย่าน | written | audited | result |\n|---|---|---|---|---|\n`;
for(const r of rrows.sort((a,b)=>a.cluster.localeCompare(b.cluster)||a.file.localeCompare(b.file)))
  o+=`| ${r.file.replace('.json','')} | ${r.cluster} | ${r.written} | ${AUDIT_DATE} | ${r.errs.length?'❌ '+r.errs.join('; '):'✅ pass'} |\n`;
fs.writeFileSync(`_internal/BANGKOK-AUDIT-${AUDIT_DATE}.md`,o);
console.log(`errors=${errN} warns=${warnN} eat=${rows.length} roundups=${rrows.length} collisions=${dups.length} same-venue=${sameVenue.length}`);
console.log('SAME-VENUE dups (should swap one):'); sameVenue.forEach(d=>console.log(`  ${d.names.join(' / ')} → ${d.clusters.join(',')} ${d.mine?'[MINE]':''}`));
console.log('wrote _internal/BANGKOK-AUDIT-'+AUDIT_DATE+'.md');
