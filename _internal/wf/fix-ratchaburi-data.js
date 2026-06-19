export const meta = {
  name: 'fix-ratchaburi-data',
  description: 'QA fixes (ratchaburi): (1) Swiss Valley Hip Resort hero is an iF Design Award LOGO (wrong) → re-fetch real resort photos; (2) Bibury Resort wrong tambon (สวนผึ้ง→ตะนาวศรี) + stale TripAdvisor ranking claim. Never fake.',
  phases: [{ title: 'Fix', detail: 'image re-fetch + data correction' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','done'], properties:{ slug:{type:'string'}, done:{type:'boolean'}, note:{type:'string'} } };
const SWISS = [1,2,3,4].map(i => `astro/public/images/hotels/ratchaburi-swissvalley${i===1?'':'-'+i}.jpg`);
phase('Fix')
const res = await parallel([
  () => agent(`ดึงรูป **รีสอร์ตจริง** "Swiss Valley Hip Resort" (สวนผึ้ง ราชบุรี — รีสอร์ตสไตล์สวิส/แอลป์) — รูปเดิมผิด (เป็นโลโก้ 'iF DESIGN AWARD 2026' พื้นแดง ไม่ใช่รีสอร์ต) ต้องเขียนทับด้วยรูปตัวรีสอร์ต/ห้องพัก/วิวภูเขาจริง
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บ-เพจทางการ — **ห้าม Trip.com, Agoda, ห้ามโลโก้/กราฟิก/stock**
web-search "Swiss Valley Hip Resort Suan Phung" → ยืนยันรีสอร์ตจริงในสวนผึ้ง → ดึง 4 รูป (อาคาร/ห้อง/วิว/บรรยากาศ) → curl -m 60 -A "Mozilla/5.0" เขียนทับ (รูปแรก=hero):
${SWISS.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${SWISS.join(' ')}
ต้องเป็นรูปรีสอร์ตจริง (ไม่ใช่โลโก้!) · ตรวจด้วยตา · JPEG จริง >10KB · หาไม่ได้จริงๆ ลบไฟล์โลโก้ที่ผิด (rm) return done=true note ว่าปล่อย onerror
return slug="review-swiss-valley-hip-resort-ratchaburi", done, note`,
    { label:'fix:swissvalley', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'swissvalley',done:false,note:String(e)})),
  () => agent(`แก้ข้อมูลที่คลาดเคลื่อนของ "Bibury Resort" (สวนผึ้ง ราชบุรี)
ไฟล์: astro/src/content/reviews/review-bibury-resort-ratchaburi.json
แก้ 2 จุด:
1) ที่อยู่ผิดตำบล: streetAddress ปัจจุบัน "298 หมู่ 2 ตำบลสวนผึ้ง อำเภอสวนผึ้ง" → ที่ถูกคือ **ตำบลตะนาวศรี** (อำเภอสวนผึ้ง ถูกแล้ว) → แก้เป็น "298 หมู่ 2 ตำบลตะนาวศรี อำเภอสวนผึ้ง" · แก้ทุกที่ในไฟล์ที่เขียน "ตำบลสวนผึ้ง" ของโรงแรมนี้ (ระวัง: "อำเภอสวนผึ้ง" ห้ามแก้)
2) เคลม TripAdvisor เก่า: รีวิวเขียน "4.7/5 อันดับ 2 จาก 35" ซึ่ง stale (ปัจจุบัน ~4.0/5 ราวอันดับ 6) → แก้ให้ตรงปัจจุบันหรือเลี่ยงการอ้างอันดับเฉพาะเจาะจง (เขียนเชิงทั่วไป เช่น "รีวิวดีบน TripAdvisor" โดยไม่ระบุอันดับที่เปลี่ยนตามเวลา) ให้เป็นธรรมชาติ โทนเพื่อนเล่า ไม่มีคำต้องห้าม
JSON valid. return slug="review-bibury-resort-ratchaburi", done, note`,
    { label:'fix:bibury', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'bibury',done:false,note:String(e)})),
])
return { fixes: res }
