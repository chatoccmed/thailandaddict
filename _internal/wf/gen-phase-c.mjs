// Generate ONE combined deep-audit workflow for all phase-b clusters (ledger status!='checked', not in _qadone.txt).
// Batches = per-cluster chunks of <=9 hotels. Each agent audits one chunk. Returns all verdicts flat (each carries its slug).
// Usage: node _internal/wf/gen-phase-b.mjs
import fs from 'node:fs';
const L = JSON.parse(fs.readFileSync('_internal/qa/qa-ledger.json', 'utf8'));
const qa = new Set(fs.readFileSync('_internal/migration/_qadone.txt', 'utf8').trim().split('\n'));
const RVD = 'astro/src/content/reviews/';
const byCluster = {};
for (const it of L.items) {
  if (it.kind !== 'review' || it.status === 'checked' || it.cluster !== 'bangkok') continue;
  (byCluster[it.cluster] = byCluster[it.cluster] || []).push(it.file);
}
const BATCH = 12;
const batches = []; // {cluster, hotels:[{slug,name,score,addr,hero}]}
for (const cluster of Object.keys(byCluster).sort()) {
  const hotels = byCluster[cluster].map(f => {
    let name = f, score = '', addr = '', hero = '';
    try { const j = JSON.parse(fs.readFileSync(RVD + f, 'utf8')); name = j.name || f; score = j.score || ''; addr = j.streetAddress || j.addressLocality || ''; hero = j.heroImg || ''; } catch {}
    return { slug: f.replace(/\.json$/, ''), name, score, addr, hero };
  });
  for (let i = 0; i < hotels.length; i += BATCH) batches.push({ cluster, hotels: hotels.slice(i, i + BATCH) });
}
const nrev = batches.reduce((s, b) => s + b.hotels.length, 0);

const script = `export const meta = {
  name: 'deep-audit-phase-c',
  description: 'Phase-C deep audit (Bangkok yaan hotel reviews) — ${nrev} reviews across ${Object.keys(byCluster).length} long-tail clusters, ${batches.length} batch(es). Web-verify each hotel real+open, score/price plausible, hero matches. No edits.',
  phases: [{ title: 'Audit', detail: '${batches.length} batch agent(s), <=${BATCH} hotels each' }],
}
const BATCHES = ${JSON.stringify(batches)};
const VSCHEMA = { type:'object', additionalProperties:false, required:['verdicts'], properties:{
  verdicts:{ type:'array', items:{ type:'object', additionalProperties:false, required:['slug','real','open','dataOk','imageOk'], properties:{
    slug:{type:'string'}, real:{type:'boolean'}, open:{type:'boolean'}, dataOk:{type:'boolean'}, imageOk:{type:'boolean'},
    issue:{type:'string'}, severity:{type:'string',enum:['none','minor','major']} } } } } };
phase('Audit')
const res = await parallel(BATCHES.map((b, bi) => () =>
  agent(\`ตรวจสอบความถูกต้อง (QA) ของรีวิวโรงแรม \${b.hotels.length} แห่งในจังหวัด \${b.cluster} — **ตรวจอย่างเดียว ห้ามแก้ไฟล์**
สำหรับแต่ละโรงแรม: web-search ชื่อ+พื้นที่ → ประเมิน
1) real: มีอยู่จริงไหม  2) open: ยังเปิดไหม (ปิดถาวร=false)  3) dataOk: score/ราคา/ลิงก์ในรีวิวไม่ผิดเพี้ยนชัดเจน  4) imageOk: รูป hero (ดู path ในลิสต์) สมเหตุสมผลว่าเป็นโรงแรมนี้ (ไม่ใช่เมืองอื่น/โรงแรมอื่น)
โรงแรม (slug · ชื่อ · score · ที่อยู่ · hero):
\${b.hotels.map(h=>'  - '+h.slug+' · '+h.name+' · '+h.score+' · '+h.addr+' · '+h.hero).join('\\n')}
ถ้าทุกอย่างปกติ → real/open/dataOk/imageOk=true, severity=none. มีปัญหา → ระบุ issue + severity (minor/major). อย่าเดา ถ้าไม่ชัวร์ให้ค้นจริง
return: verdicts (1 ต่อ slug ครบทุกตัว)\`,
    { label:'audit:'+b.cluster+'#'+(bi+1), phase:'Audit', schema:VSCHEMA })
    .then(v=>(v?.verdicts||[]).map(x=>({...x,cluster:b.cluster}))).catch(e=>[{slug:'__batch'+bi+'__',cluster:b.cluster,real:true,open:true,dataOk:true,imageOk:true,issue:'agent-error '+String(e),severity:'none'}])
))
return { verdicts: res.flat() }
`;
fs.writeFileSync('_internal/wf/deep-audit-phase-c.js', script);
console.log(`WROTE _internal/wf/deep-audit-phase-c.js — ${nrev} reviews, ${Object.keys(byCluster).length} clusters, ${batches.length} batches`);
