#!/usr/bin/env node
// Audit the michelin-* single-restaurant articles (TH+EN) AND map each to its best-fit Bangkok ย่าน by lat/lng.
// Usage: node _internal/audit-michelin.mjs <auditDate>
import fs from 'fs';
const AUDIT_DATE = process.argv[2] || '2026-07-04';
const ROOT='astro/src/content', PUB='astro/public';
const BAN=['ตอบโจทย์','โดดเด่น','ครบครัน','ระดับโลก','สุดยอด','อันซีน'];
const RAWTHAI=/[ก-ฺเ-๛]/;
const hasRawThai=o=>{let n=0;(function s(x){if(typeof x==='string'){if(RAWTHAI.test(x)&&!/%[0-9A-F]{2}/i.test(x))n++;}else if(Array.isArray(x))x.forEach(s);else if(x&&typeof x==='object')Object.values(x).forEach(s);})(o);return n;};
const hav=(a,b,c,d)=>{const R=6371,r=Math.PI/180,dLa=(c-a)*r,dLo=(d-b)*r,x=Math.sin(dLa/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x));};

const hoods=[...fs.readdirSync(PUB).filter(f=>/^area-bangkok-.+\.html$/.test(f)).map(f=>f.replace(/^area-bangkok-(.+)\.html$/,'$1'))];
const artDir=`${ROOT}/articles`, artEnDir=`${ROOT}/articles-en`;

// hood point clouds from eat-ranking venue coords
const cloud={}; // hood -> [[lat,lng],...]
for(const f of fs.readdirSync(artDir)){
  if(!f.endsWith('.json'))continue;let a;try{a=JSON.parse(fs.readFileSync(`${artDir}/${f}`,'utf8'));}catch{continue;}
  if(a.type!=='eat-ranking'||!hoods.includes(a.cluster))continue;
  for(const b of (a.blocks||[])){if(b.kind==='restaurant'&&typeof b.lat==='number'&&typeof b.lng==='number'){(cloud[a.cluster]=cloud[a.cluster]||[]).push([b.lat,b.lng]);}}
}
const nearestHood=(la,ln)=>{let best=null,bd=1e9;for(const h of hoods){for(const [x,y] of (cloud[h]||[])){const d=hav(la,ln,x,y);if(d<bd){bd=d;best=h;}}}return {hood:best,km:bd};};

// audit + map michelin articles
const rows=[]; const perHood={}; let errN=0;
for(const f of fs.readdirSync(artDir)){
  if(!/^michelin-/.test(f))continue; const a=JSON.parse(fs.readFileSync(`${artDir}/${f}`,'utf8'));
  const errs=[]; const txt=JSON.stringify(a);
  for(const w of BAN)if(txt.includes(w))errs.push(`BAN:${w}`);
  const enp=`${artEnDir}/${f}`; if(!fs.existsSync(enp))errs.push('EN-missing'); else{try{const en=JSON.parse(fs.readFileSync(enp,'utf8'));const t=hasRawThai(en);if(t>0)errs.push(`EN-rawThai:${t}`);}catch{errs.push('EN-broken');}}
  for(const r of (a.related||[])){const h=String(r.href||'').replace(/[?#].*/,'');if(/\.html$/.test(h)&&!fs.existsSync(`${PUB}/${h}`)&&!fs.existsSync(`${ROOT}/articles/${h.replace('.html','.json')}`)&&!fs.existsSync(`${ROOT}/roundups/${h.replace('.html','.json')}`)){/* many related are hub pages; skip strict */}}
  errN+=errs.length;
  const m=txt.match(/"lat":\s*(-?[0-9.]+)\s*,\s*"lng":\s*(-?[0-9.]+)/);
  let hood=null,km=null;
  if(m){const r=nearestHood(parseFloat(m[1]),parseFloat(m[2]));if(r.km<=0.9){hood=r.hood;km=+r.km.toFixed(2);}}
  const award=/บิบ กูร์มองด์|Bib Gourmand/i.test(txt)?'Bib':/(หนึ่งดาว|สองดาว|สามดาว|Michelin star|⭐)/i.test(txt)?'Star':'Plate/Sel';
  const name=(a.h1||a.title||f).replace(/<[^>]+>/g,'').split('—')[0].split('|')[0].trim().slice(0,42);
  rows.push({file:f, slug:a.slug, name, award, hood, km, written:a.publishedDate||'?', errs});
  if(hood)(perHood[hood]=perHood[hood]||[]).push({slug:a.slug,name,award,km});
}

let o=`# Michelin 2026 reviews — audit + ย่าน mapping\n\n`;
o+=`**Audit date:** ${AUDIT_DATE} · **Scope:** ${rows.length} michelin-* single-restaurant articles (TH+EN)\n\n`;
o+=`**Audit result:** ${errN===0?'✅ 0 errors':'❌ '+errN+' errors'} (JSON+EN parity · zero-raw-Thai · 0 ban-words)\n`;
o+=`**Mapped into our ย่าน:** ${rows.filter(r=>r.hood).length}/${rows.length} (within 0.9 km of a hood's venues) · unmapped: ${rows.filter(r=>!r.hood).length}\n\n`;
o+=`## Michelin restaurants per ย่าน (to surface on hood pages)\n\n`;
for(const h of hoods.filter(h=>perHood[h]).sort((a,b)=>perHood[b].length-perHood[a].length)){
  o+=`### ${h} (${perHood[h].length})\n`+perHood[h].sort((a,b)=>a.km-b.km).map(r=>`- ${r.award==='Star'?'⭐':r.award==='Bib'?'🍜Bib':'▪'} ${r.name} — ${r.slug} (${r.km} km)`).join('\n')+'\n\n';
}
o+=`## All michelin articles — written · audited · hood · result\n\n| restaurant | award | ย่าน | km | written | result |\n|---|---|---|---|---|---|\n`;
for(const r of rows.sort((a,b)=>(a.hood||'zz').localeCompare(b.hood||'zz')||a.name.localeCompare(b.name)))
  o+=`| ${r.name} | ${r.award} | ${r.hood||'—'} | ${r.km??''} | ${r.written} | ${r.errs.length?'❌ '+r.errs.join(';'):'✅'} |\n`;
fs.writeFileSync(`_internal/MICHELIN-AUDIT-${AUDIT_DATE}.md`,o);
const mapped=rows.filter(r=>r.hood).length;
console.log(`michelin=${rows.length} errors=${errN} mapped-to-hood=${mapped} unmapped=${rows.length-mapped}`);
console.log('per-hood counts:',Object.entries(perHood).map(([h,a])=>`${h}:${a.length}`).sort().join(' '));
const failed=rows.filter(r=>r.errs.length);if(failed.length){console.log('ISSUES:');failed.slice(0,20).forEach(r=>console.log('  '+r.slug+' :: '+r.errs.join(';')));}
console.log('wrote _internal/MICHELIN-AUDIT-'+AUDIT_DATE+'.md');
