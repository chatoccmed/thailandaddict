#!/usr/bin/env node
// Surface Michelin restaurants (that map into our ย่าน) onto each hood's restaurants eat-ranking page,
// as related-cards linking to the michelin-<slug> review. Idempotent (dedup by href). TH + EN.
// Usage: node _internal/surface-michelin.mjs [--apply]
import fs from 'fs';
const APPLY = process.argv.includes('--apply');
const ROOT='astro/src/content', PUB='astro/public';
const artDir=`${ROOT}/articles`, artEnDir=`${ROOT}/articles-en`;
const hav=(a,b,c,d)=>{const R=6371,r=Math.PI/180,dLa=(c-a)*r,dLo=(d-b)*r,x=Math.sin(dLa/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x));};
const hoods=[...fs.readdirSync(PUB).filter(f=>/^area-bangkok-.+\.html$/.test(f)).map(f=>f.replace(/^area-bangkok-(.+)\.html$/,'$1'))];
const stripThai=s=>s.replace(/ ?\((?=[^)]*[ก-๛])[^)]*\)/g,'').replace(/[ก-๛]/g,'').replace(/\s+/g,' ').trim();

// hood clouds
const cloud={};
for(const f of fs.readdirSync(artDir)){if(!f.endsWith('.json'))continue;let a;try{a=JSON.parse(fs.readFileSync(`${artDir}/${f}`,'utf8'));}catch{continue;}
  if(a.type!=='eat-ranking'||!hoods.includes(a.cluster))continue;
  for(const b of (a.blocks||[]))if(b.kind==='restaurant'&&typeof b.lat==='number'&&typeof b.lng==='number')(cloud[a.cluster]=cloud[a.cluster]||[]).push([b.lat,b.lng]);}
const nearest=(la,ln)=>{let best=null,bd=1e9;for(const h of hoods)for(const[x,y]of(cloud[h]||[])){const d=hav(la,ln,x,y);if(d<bd){bd=d;best=h;}}return{hood:best,km:bd};};

// gather michelin per hood with clean names/awards
const perHood={};
for(const f of fs.readdirSync(artDir)){
  if(!/^michelin-/.test(f))continue; const a=JSON.parse(fs.readFileSync(`${artDir}/${f}`,'utf8'));
  const m=JSON.stringify(a).match(/"lat":\s*(-?[0-9.]+)\s*,\s*"lng":\s*(-?[0-9.]+)/); if(!m)continue;
  const r=nearest(parseFloat(m[1]),parseFloat(m[2])); if(r.km>0.9||!r.hood)continue;
  const thName=(a.title||'').split(' — ')[0].trim();
  const en=fs.existsSync(`${artEnDir}/${f}`)?JSON.parse(fs.readFileSync(`${artEnDir}/${f}`,'utf8')):null;
  const enName=stripThai((en?.title||thName).split(' — ')[0]).trim();
  const award=/สองดาว/.test(JSON.stringify(a))?'2★':/สามดาว/.test(JSON.stringify(a))?'3★':/หนึ่งดาว/.test(JSON.stringify(a))?'⭐':'🍜';
  (perHood[r.hood]=perHood[r.hood]||[]).push({slug:a.slug, thName, enName, award, km:r.km});
}

// find each hood's restaurants eat-ranking article
const restArt={};
for(const f of fs.readdirSync(artDir)){if(!f.endsWith('.json'))continue;let a;try{a=JSON.parse(fs.readFileSync(`${artDir}/${f}`,'utf8'));}catch{continue;}
  if(a.type==='eat-ranking'&&hoods.includes(a.cluster)&&/restaurants/.test(a.slug))restArt[a.cluster]=f;}

let changed=0, added=0, report=[];
for(const h of Object.keys(perHood)){
  const f=restArt[h]; if(!f){report.push(`⚠ ${h}: no restaurants article`);continue;}
  const items=perHood[h].sort((a,b)=>a.km-b.km);
  for(const [dir,isEn] of [[artDir,false],[artEnDir,true]]){
    const p=`${dir}/${f}`; if(!fs.existsSync(p)){report.push(`⚠ ${h}: ${isEn?'EN':'TH'} missing`);continue;}
    const a=JSON.parse(fs.readFileSync(p,'utf8'));
    a.related=a.related||[];
    const have=new Set(a.related.map(r=>String(r.href).replace(/^\/en\//,'').replace(/\.html.*/,'')));
    let n=0;
    for(const it of items){
      const key=`michelin-${it.slug.replace(/^michelin-/,'')}`; // slug already michelin-*
      const bare=it.slug; if(have.has(bare))continue;
      const href=`${it.slug}.html`;
      const title=isEn?`${it.award} ${it.enName} — MICHELIN Guide 2026`:`${it.award} ${it.thName} — มิชลินไกด์ 2026`;
      a.related.push({href,title}); have.add(bare); n++;
    }
    if(n){ if(APPLY){fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n');JSON.parse(fs.readFileSync(p,'utf8'));} changed++; added+=n; if(!isEn)report.push(`${h}: +${n} michelin → ${f}`); }
  }
}
console.log(`hoods with michelin: ${Object.keys(perHood).length} · files ${APPLY?'updated':'to-update'}: ${changed} · related-cards added: ${added}`);
report.forEach(r=>console.log('  '+r));
if(!APPLY)console.log('\n(dry-run — re-run with --apply to write)');
