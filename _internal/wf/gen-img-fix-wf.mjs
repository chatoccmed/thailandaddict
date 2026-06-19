// Generate a fetch workflow for all review items with missing images (from _img-missing-reviews.json).
import fs from 'node:fs';
const items = JSON.parse(fs.readFileSync('_internal/qa/_img-missing-reviews.json', 'utf8'));
const HOTELS = items.map(o => ({ name: o.name, cluster: o.cluster, miss: o.miss }));
const script = `export const meta = {
  name: 'fetch-qa-images',
  description: 'Phase-A image fix: fetch real photos for ${HOTELS.length} reviews with missing hero/gallery files. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never fake. Optimize each.',
  phases: [{ title: 'Fetch', detail: 'one agent per hotel: find real photos, curl missing paths, optimize' }],
}
const HOTELS = ${JSON.stringify(HOTELS)};
const VERDICT = { type:'object', additionalProperties:false, required:['name','got'], properties:{
  name:{type:'string'}, got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };
phase('Fetch')
const res = await parallel(HOTELS.map(h => () =>
  agent(\`ดึงรูปจริงของที่พัก "\${h.name}" (จังหวัด/พื้นที่ cluster=\${h.cluster}) — รูปถ่ายที่พักจริงเท่านั้น
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บ-เพจทางการ — **ห้าม Trip.com, Agoda, รูป stock/ไม่เกี่ยว**
web-search หา gallery จริงของที่พักนี้ → ดึงรูปจริง \${h.miss.length} รูป → curl -m 60 -A "Mozilla/5.0" ลงไฟล์ตามนี้ (path แรก=hero ถ้ามี):
\${h.miss.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\\n')}
แล้ว node _internal/optimize-images.mjs \${h.miss.join(' ')} (เฉพาะที่ดึงได้)
ระวัง: ตรวจชื่อ+พื้นที่ให้ตรงที่พักจริง (อย่าหยิบโรงแรมชื่อคล้ายคนละที่) · JPEG จริง >10KB ไม่ใช่ HTML · หาไม่ครบดึงเท่าที่ได้จริง อย่าใส่รูปปลอม (ขาด→onerror)
return: name="\${h.name}", got=<จำนวนรูปจริงที่ดึงได้>, source, note\`,
    { label:'img:'+h.miss[0].split('/').pop(), phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({name:h.name, got:0, note:'err '+String(e)}))
))
return { fetched: res, totalHotels: HOTELS.length }
`;
fs.writeFileSync('_internal/wf/fetch-qa-images.js', script);
console.log('WROTE _internal/wf/fetch-qa-images.js for', HOTELS.length, 'hotels,', HOTELS.reduce((a,b)=>a+b.miss.length,0), 'images');
