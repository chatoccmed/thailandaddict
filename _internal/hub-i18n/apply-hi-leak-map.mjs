import fs from 'node:fs';
import path from 'node:path';
const ROOT=path.resolve(import.meta.dirname,'../..');
const THAI=/[฀-๿]/;
const map=JSON.parse(fs.readFileSync(path.join(ROOT,'_internal/hub-i18n/hi-leak-map.json'),'utf8'));
// guard: every from-key must contain a Thai char
for(const k of Object.keys(map)){ if(!THAI.test(k)){console.error('ABORT: key without Thai char',JSON.stringify(k));process.exit(1);} }
// longest key first
const keys=Object.keys(map).sort((a,b)=>b.length-a.length);
let totalFiles=0, totalHits=0;
for(const coll of ['reviews-hi','roundups-hi']){
  const dir=path.join(ROOT,'astro/src/content',coll);
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
    const p=path.join(dir,f);
    let txt=fs.readFileSync(p,'utf8'), hits=0;
    for(const k of keys){
      if(txt.includes(k)){ const n=txt.split(k).length-1; hits+=n; txt=txt.split(k).join(map[k]); }
    }
    if(hits>0){ fs.writeFileSync(p,txt); totalFiles++; totalHits+=hits; console.log(`${coll}/${f}: ${hits} replacements`); }
  }
}
console.log(`\nTotal: ${totalHits} replacements across ${totalFiles} files`);
