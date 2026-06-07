import fs from 'node:fs'; import path from 'node:path';
const ROOT=process.cwd(); const pub=path.join(ROOT,'astro/public');
const dirs=['astro/src/content/reviews','astro/src/content/reviews-en','astro/src/content/roundups','astro/src/content/roundups-en'];
const re=/(?:\/)?images\/[A-Za-z0-9._\/-]+\.(?:jpg|jpeg|png|webp)/gi;
// map each image ref to the set of review slugs that use it (to know hotel name/area)
const refToFiles=new Map();
for(const d of dirs){const abs=path.join(ROOT,d); if(!fs.existsSync(abs))continue;
  for(const f of fs.readdirSync(abs).filter(x=>x.endsWith('.json'))){
    const txt=fs.readFileSync(path.join(abs,f),'utf8'); const m=txt.match(re)||[];
    for(let p of m){p=p.replace(/^\//,''); if(!refToFiles.has(p))refToFiles.set(p,new Set()); refToFiles.get(p).add(d+'/'+f);}
  }}
const missing=[];
for(const [p,srcs] of refToFiles){ if(!fs.existsSync(path.join(pub,p))) missing.push({img:p,srcs:[...srcs]}); }
// find hotel name+area from the TH review that references it
function hotelInfo(srcs){
  const rev=srcs.find(s=>s.includes('/reviews/'))||srcs[0];
  try{const j=JSON.parse(fs.readFileSync(path.join(ROOT,rev),'utf8'));
    return {slug:j.slug||'', name:j.hotelName||j.name||'', area:j.area||j.addressLocality||j.crumbCityName||''};
  }catch{return {slug:'',name:'',area:''};}
}
// group by hotel base key (strip trailing -N before ext)
const groups=new Map();
for(const m of missing){
  const base=m.img.replace(/-\d+(\.\w+)$/,'$1').replace(/\.(jpg|jpeg|png|webp)$/,'');
  const info=hotelInfo(m.srcs);
  const key=info.slug||base;
  if(!groups.has(key))groups.set(key,{...info,imgs:[]});
  groups.get(key).imgs.push(m.img);
}
const out=[...groups.values()].map(g=>({slug:g.slug,name:g.name,area:g.area,imgs:g.imgs}));
fs.writeFileSync(path.join(ROOT,'_internal/missing-hotel-imgs.json'),JSON.stringify(out,null,2));
console.log('missing files:',missing.length,'· hotels affected:',out.length);
for(const g of out)console.log(`  [${g.imgs.length}] ${g.name||g.slug} (${g.area}) -> ${g.imgs.map(i=>i.split('/').pop()).join(', ')}`);
