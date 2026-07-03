#!/usr/bin/env node
// Bulk-fix Bangkok hotel reviews: ban-word swap (TH) + report. Scoped to reviews referenced by Bangkok ย่าน roundups.
import fs from 'fs';
const ROOT='astro/src/content', PUB='astro/public';
const SWAP={'ตอบโจทย์':'ลงตัว','โดดเด่น':'เป็นเอกลักษณ์','ครบครัน':'ครบ','ระดับโลก':'ชั้นนำ','สุดยอด':'ยอดเยี่ยม','อันซีน':'ที่หลายคนยังไม่รู้จัก'};
const hoods=new Set(fs.readdirSync(PUB).filter(f=>/^area-bangkok-.+\.html$/.test(f)).map(f=>f.replace(/^area-bangkok-(.+)\.html$/,'$1')));
const slugOf=h=>String(h||'').replace(/^.*\//,'').replace(/\.html.*$/,'').replace(/[?#].*$/,'');
const rdDir=`${ROOT}/roundups`, revDir=`${ROOT}/reviews`;
const set=new Set();
for(const f of fs.readdirSync(rdDir)){
  if(!/-bangkok\.json$/.test(f)||!/hotels/i.test(f))continue;
  const cl=f.replace(/^top\d+-(love-)?hotels-/,'').replace(/-bangkok\.json$/,''); if(!hoods.has(cl))continue;
  let a;try{a=JSON.parse(fs.readFileSync(`${rdDir}/${f}`,'utf8'));}catch{continue;}
  for(const e of (a.entries||[])){const s=slugOf(e.reviewUrl||e.reviewHref||e.href||e.navReviewHref);if(/^review-/.test(s))set.add(s);}
  for(const r of (a.rail||[])){const s=slugOf(r.href);if(/^review-/.test(s))set.add(s);}
}
let files=0, swaps=0; const changed=[];
for(const s of set){
  const p=`${revDir}/${s}.json`; if(!fs.existsSync(p))continue;
  let raw=fs.readFileSync(p,'utf8'); let n=0;
  for(const [bad,good] of Object.entries(SWAP)){ const c=raw.split(bad).length-1; if(c){ raw=raw.split(bad).join(good); n+=c; } }
  if(n){ JSON.parse(raw); fs.writeFileSync(p,raw); files++; swaps+=n; changed.push(`${s} (${n})`); }
}
console.log(`ban-swap: ${files} review files · ${swaps} swaps`);
changed.slice(0,50).forEach(x=>console.log('  '+x));
