import fs from 'node:fs';
import path from 'node:path';
const ROOT=path.resolve(import.meta.dirname,'../..');
const THAI=/[฀-๿]/;
const TOKEN=/[฀-๿ऀ-ॿঀ-৿]+/g;
const counts=new Map();
for(const coll of ['reviews-hi','roundups-hi']){
  const dir=path.join(ROOT,'astro/src/content',coll);
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort()){
    const txt=fs.readFileSync(path.join(dir,f),'utf8');
    for(const m of txt.matchAll(TOKEN)){const t=m[0]; if(t==='฿')continue; if(!THAI.test(t))continue; counts.set(t,(counts.get(t)||0)+1);}
  }
}
const tokens=[...counts.keys()];
const VALUES=[
/*0*/ "Chonburi","Son","Chonburi","Lamung","Ayutthaya","Chonburi","Pattaya","Chonburi","Pattaya","Jomtien",
/*10*/"Bangsaen","Chonburi","Chonburi","Chonburi","Pattaya","Na Jomtien","Amat","Bangsaen।","Chonburi","Pattaya",
/*20*/"Chonburi","Chonburi","songthaew","Bangsaen","Jomtien","Bangsaen","Saen Suk","Bangsaen","Chonburi","Pattaya",
/*30*/"Pattaya","Chonburi","Songkhla","Kanchanaburi","Khao Yai","Koh","Chang","Koh","Larn","Hong",
/*40*/"Son","Pai","Son","Wat","Pai","Pai","Pai","Korat","Phimai","Lam Takhong",
/*50*/"Lam Takhong।","Phimai","Korat","Nan","Phetchabun","Rayong","Sukhumvit","Sukhothai"
];
if(tokens.length!==VALUES.length){console.error('LENGTH MISMATCH',tokens.length,VALUES.length);process.exit(1);}
const map={};
for(let i=0;i<tokens.length;i++){
  const k=tokens[i], v=VALUES[i];
  if(!THAI.test(k)){console.error('GUARD: key has no Thai char',JSON.stringify(k));process.exit(1);}
  if(v.includes('"')||v.includes(String.fromCharCode(92))){console.error('GUARD: value not JSON-safe',JSON.stringify(v));process.exit(1);}
  map[k]=v;
}
fs.writeFileSync(path.join(ROOT,'_internal/hub-i18n/hi-leak-map.json'), JSON.stringify(map,null,2));
console.log('Wrote',Object.keys(map).length,'entries');
