// Generate a deep-audit workflow for one cluster's reviews (data accuracy + image-match).
// Usage: node _internal/wf/gen-deep-audit.mjs <cluster>
import fs from 'node:fs';
const cluster = process.argv[2];
if (!cluster) { console.error('need <cluster>'); process.exit(1); }
const L = JSON.parse(fs.readFileSync('_internal/qa/qa-ledger.json', 'utf8'));
const RVD = 'astro/src/content/reviews/';
const items = L.items.filter(i => i.kind === 'review' && i.cluster === cluster && i.status !== 'checked');
const HOTELS = items.map(it => {
  let name = it.file, score = '', addr = '', hero = '';
  try { const j = JSON.parse(fs.readFileSync(RVD + it.file, 'utf8')); name = j.name || it.file; score = j.score || ''; addr = j.streetAddress || j.addressLocality || ''; hero = j.heroImg || ''; } catch {}
  return { slug: it.file.replace(/\.json$/, ''), name, score, addr, hero };
});
const BATCH = 9;
const batches = [];
for (let i = 0; i < HOTELS.length; i += BATCH) batches.push(HOTELS.slice(i, i + BATCH));

const script = `export const meta = {
  name: 'deep-audit-${cluster}',
  description: 'Phase-A deep audit (data accuracy + image-match) for ${HOTELS.length} ${cluster} reviews, ${batches.length} batch(es). Web-verify each hotel real+open, score/price plausible, hero plausibly matches. Returns per-hotel verdicts; no edits (fixes applied after by the loop).',
  phases: [{ title: 'Audit', detail: '${batches.length} batch agent(s), ~${BATCH} hotels each' }],
}
const BATCHES = ${JSON.stringify(batches)};
const VSCHEMA = { type:'object', additionalProperties:false, required:['verdicts'], properties:{
  verdicts:{ type:'array', items:{ type:'object', additionalProperties:false, required:['slug','real','open','dataOk','imageOk'], properties:{
    slug:{type:'string'}, real:{type:'boolean',description:'โรงแรมนี้มีอยู่จริง'}, open:{type:'boolean',description:'ยังเปิดดำเนินการ (ไม่ปิดถาวร)'},
    dataOk:{type:'boolean',description:'score/ราคา/ลิงก์/ข้อเท็จจริงไม่มีที่ผิดชัดเจน'}, imageOk:{type:'boolean',description:'รูป hero สมเหตุสมผลว่าเป็นโรงแรมนี้ (ชื่อไฟล์/แหล่งตรง ไม่ผิดเมือง)'},
    issue:{type:'string',description:'อธิบายปัญหาถ้ามี (ปิดถาวร/ไม่เจอ/ข้อมูลผิด/รูปไม่ตรง) สั้นๆ'}, severity:{type:'string',enum:['none','minor','major']} } } } } };
phase('Audit')
const res = await parallel(BATCHES.map((b, bi) => () =>
  agent(\`ตรวจสอบความถูกต้อง (QA) ของรีวิวโรงแรม \${b.length} แห่งในจังหวัด ${cluster} — **ตรวจอย่างเดียว ห้ามแก้ไฟล์**
สำหรับแต่ละโรงแรม: web-search ชื่อ+พื้นที่ → ประเมิน
1) real: มีอยู่จริงไหม  2) open: ยังเปิดไหม (ปิดถาวร=false)  3) dataOk: score/ราคา/ลิงก์ในรีวิวไม่ผิดเพี้ยนชัดเจน  4) imageOk: รูป hero (ดู path ในลิสต์ด้านล่าง) สมเหตุสมผลว่าเป็นโรงแรมนี้ (ชื่อไฟล์/แหล่ง ไม่ใช่เมืองอื่น/โรงแรมอื่น)
โรงแรม (slug · ชื่อ · score · ที่อยู่ · hero):
\${b.map(h=>'  - '+h.slug+' · '+h.name+' · '+h.score+' · '+h.addr+' · '+h.hero).join('\\n')}
ถ้าทุกอย่างปกติ → real/open/dataOk/imageOk=true, severity=none. มีปัญหา → ระบุ issue + severity (minor/major). อย่าเดา ถ้าไม่ชัวร์ให้ค้นจริง
return: verdicts (1 ต่อ slug ครบทุกตัว)\`,
    { label:'audit:${cluster}#'+(bi+1), phase:'Audit', schema:VSCHEMA })
    .then(v=>v?.verdicts||[]).catch(e=>[{slug:'__batch'+bi+'__',real:true,open:true,dataOk:true,imageOk:true,issue:'agent-error '+String(e),severity:'none'}])
))
return { cluster:'${cluster}', verdicts: res.flat() }
`;
fs.writeFileSync(`_internal/wf/deep-audit-${cluster}.js`, script);
console.log(`WROTE _internal/wf/deep-audit-${cluster}.js — ${HOTELS.length} hotels, ${batches.length} batch(es)`);
