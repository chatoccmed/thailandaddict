export const meta = {
  name: 'fix-phurua-img',
  description: 'QA fix: re-fetch REAL photos for Phurua Resort (Phu Rua, Loei) — current images are stock European A-frame cabins (deep-audit flagged). Get the actual Thai bungalow resort. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never stock.',
  phases: [{ title: 'Fetch', detail: 're-fetch correct resort photos' }],
}
const PATHS = [1,2,3,4].map(i => `astro/public/images/hotels/loei-phurua-${i}.jpg`);
const VERDICT = { type:'object', additionalProperties:false, required:['got'], properties:{ got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };
phase('Fetch')
const r = await agent(`ดึงรูป **รีสอร์ตจริง** "Phurua Resort" (ภูเรือ รีสอร์ท, อ.ภูเรือ จ.เลย — รีสอร์ตบังกะโลไทยบนภูเรือ ที่อยู่ 163 หมู่ 2 ต.หนองบัว) — รูปเดิมผิด (เป็นภาพ stock กระท่อมไม้ A-frame หลังคาจั่วชันสไตล์ยุโรป/อัลไพน์ ไม่ใช่รีสอร์ตจริง) ต้องเขียนทับด้วยรูปตัวรีสอร์ต/บังกะโล/ห้องพัก/วิวจริงของที่นี่
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บ-เพจทางการ — **ห้าม Trip.com, Agoda, ห้ามภาพ stock/กระท่อมยุโรป/ไม่เกี่ยว**
web-search "Phurua Resort ภูเรือ เลย" → ยืนยันรีสอร์ตจริงในภูเรือ → ดึง 4 รูป (บังกะโล/ห้อง/สวน/วิวภูเขา) → curl -m 60 -A "Mozilla/5.0" เขียนทับ (รูปแรก=hero):
${PATHS.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${PATHS.join(' ')}
ต้องเป็นรูปรีสอร์ตจริงในไทย (ไม่ใช่กระท่อมยุโรป stock!) · ตรวจด้วยตา · JPEG จริง >10KB · หาไม่ได้จริงๆ ลบไฟล์ stock ที่ผิด (rm) return got=0
return: got=<จำนวนรูปจริง>, source, note`,
  { label:'img:phurua', phase:'Fetch', schema:VERDICT }).catch(e=>({got:0,note:'err '+String(e)}));
return { fixed: r }
