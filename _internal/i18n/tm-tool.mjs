// Translation-memory chunker/merger for the mass rollout. Resumable: only untranslated strings
// are chunked, and merging folds completed chunks back into tm.<loc>.json.
//
//   node tm-tool.mjs split  <loc> [chunkSize=1200]   → writes chunks/<loc>/NNN.json (arrays of EN strings still needing translation)
//   node tm-tool.mjs merge  <loc>                     → folds chunks/<loc>/NNN.done.json into tm.<loc>.json
//   node tm-tool.mjs status <loc>                     → prints coverage + chunk progress
import fs from 'node:fs';
import path from 'node:path';
const I18N = path.resolve(import.meta.dirname);
const rd = f => { try { return JSON.parse(fs.readFileSync(f,'utf8')); } catch { return null; } };
const strings = rd(path.join(I18N,'strings.json')) || [];

const [cmd, loc, arg] = process.argv.slice(2);
if(!cmd || !loc){ console.error('usage: tm-tool.mjs split|merge|status <loc> [chunkSize]'); process.exit(1); }
const tmPath = path.join(I18N,`tm.${loc}.json`);
const chunkDir = path.join(I18N,'chunks',loc);

if(cmd==='split'){
  const tm = rd(tmPath) || {};
  const remaining = strings.filter(s => tm[s]==null);
  fs.mkdirSync(chunkDir,{recursive:true});
  // clear stale source chunks (keep .done.json)
  for(const f of fs.existsSync(chunkDir)?fs.readdirSync(chunkDir):[]) if(/^\d+\.json$/.test(f)) fs.rmSync(path.join(chunkDir,f));
  const size = Math.max(1, parseInt(arg||'1200',10));
  let n=0;
  for(let i=0;i<remaining.length;i+=size){
    const id = String(n).padStart(3,'0');
    fs.writeFileSync(path.join(chunkDir,`${id}.json`), JSON.stringify(remaining.slice(i,i+size),null,1));
    n++;
  }
  console.log(`[${loc}] remaining ${remaining.length}/${strings.length} → ${n} chunks of ${size} in chunks/${loc}/`);
}
else if(cmd==='merge'){
  const tm = rd(tmPath) || {};
  let added=0, files=0;
  for(const f of fs.existsSync(chunkDir)?fs.readdirSync(chunkDir):[]){
    if(!/\.done\.json$/.test(f)) continue;
    const obj = rd(path.join(chunkDir,f)); if(!obj) continue;
    files++;
    for(const k of Object.keys(obj)){ if(tm[k]==null && obj[k]!=null){ tm[k]=obj[k]; added++; } }
  }
  // stable sorted output
  const sorted = Object.fromEntries(Object.keys(tm).sort((a,b)=>a.localeCompare(b)).map(k=>[k,tm[k]]));
  fs.writeFileSync(tmPath, JSON.stringify(sorted,null,0));
  const cov = strings.filter(s=>sorted[s]!=null).length;
  console.log(`[${loc}] merged ${files} done-chunks (+${added} strings) → tm.${loc}.json now ${Object.keys(sorted).length} keys · coverage ${cov}/${strings.length}`);
}
else if(cmd==='status'){
  const tm = rd(tmPath) || {};
  const cov = strings.filter(s=>tm[s]!=null).length;
  const src = fs.existsSync(chunkDir)?fs.readdirSync(chunkDir).filter(f=>/^\d+\.json$/.test(f)).length:0;
  const done = fs.existsSync(chunkDir)?fs.readdirSync(chunkDir).filter(f=>/\.done\.json$/.test(f)).length:0;
  console.log(`[${loc}] coverage ${cov}/${strings.length} (${(cov/strings.length*100).toFixed(1)}%) · chunks: ${done}/${src} done`);
}
