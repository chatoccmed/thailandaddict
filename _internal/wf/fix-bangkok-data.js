export const meta = {
  name: 'fix-bangkok-data',
  description: 'QA fixes (bangkok images): bangkok-city-hotel hero=iF-Design-Award logo; jatujak-studio borrows C U Inn images (give own); viva-garden hero=Terminal21/Asoke signage. Re-fetch real photos. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never logo/mall/wrong-hotel.',
  phases: [{ title: 'Fix', detail: '3 image re-fetch' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','done'], properties:{ slug:{type:'string'}, done:{type:'boolean'}, got:{type:'number'}, note:{type:'string'} } };
const CITY = [1,2,3,4].map(i=>`astro/public/images/hotels/bangkok-citytel-${i}.jpg`);
const VIVA = [1,2,3,4].map(i=>`astro/public/images/hotels/bangkok-vivagarden-${i}.jpg`);
const JTK = [1,2,3,4].map(i=>`astro/public/images/hotels/bangkok-jatujak-${i}.jpg`);
phase('Fix')
const res = await parallel([
  () => agent(`ดึงรูป **โรงแรมจริง** "Bangkok City Hotel" (3 ดาว ถนนเพชรบุรี ใกล้ BTS ราชเทวี ~252 ห้อง) — รูปเดิม bangkok-citytel-1.jpg เป็นโลโก้ 'iF DESIGN AWARD 2026' (พื้นแดง) ไม่ใช่โรงแรม เขียนทับด้วยรูปอาคาร/ห้อง/ล็อบบี้จริง:
${CITY.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/โลโก้/stock · curl เขียนทับ → node _internal/optimize-images.mjs ${CITY.join(' ')} · ตรวจด้วยตา · return slug="review-bangkok-city-hotel-bangkok", done, got, note`,
    { label:'fix:citytel', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'citytel',done:false,note:String(e)})),
  () => agent(`ดึงรูป **โรงแรมจริง** "Viva Garden Serviced Residence" (กรุงเทพ ย่านสุขุมวิท พระโขนง/บางจาก) — รูปเดิม bangkok-vivagarden-1.jpg เป็นภาพล็อบบี้ที่มีป้าย 'ASOKE'/'TERMINAL 21' (คนละที่) เขียนทับด้วยรูปตัว Viva Garden จริง (อาคาร/ห้อง/สระ):
${VIVA.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/ห้างTerminal21/stock · curl เขียนทับ → node _internal/optimize-images.mjs ${VIVA.join(' ')} · ตรวจด้วยตา · return slug="review-viva-garden-serviced-residence-bangkok", done, got, note`,
    { label:'fix:viva', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'viva',done:false,note:String(e)})),
  () => agent(`"Jatujak Studio" กรุงเทพ (ย่านจตุจักร) — ปัจจุบันรีวิวยืมรูปของ "C U Inn Bangkok" (ไฟล์ bangkok-cuinn-*.jpg คนละโรงแรม) มาใช้ ต้องให้ Jatujak มีรูปของตัวเอง
1) web-search "Jatujak Studio Bangkok" → ถ้าเจอรูปจริง: ดึง 4 รูป (จาก Tripadvisor/Ostrovok/official — ห้าม Trip.com/Agoda/stock) → curl ลงไฟล์ใหม่:
${JTK.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
   → node _internal/optimize-images.mjs ${JTK.join(' ')} → แก้ astro/src/content/reviews/review-jatujak-studio-in-bangkok.json: heroImg/gallery/image/heroSub/mapImg ที่ชี้ bangkok-cuinn-* → เปลี่ยนเป็น bangkok-jatujak-1..4.jpg (JSON valid) · return done=true, got=<n>
2) ถ้าหารูปจริงไม่ได้เลย (โรงแรมอาจปิด/ไม่ active — listing เก่าปี 2019): **อย่ายืมรูป C U Inn ต่อ** → แก้ review ให้ heroImg/gallery/image/heroSub/mapImg ชี้ bangkok-jatujak-1.jpg (ปล่อย onerror, ไม่ใส่รูปปลอม) · return done=true, got=0, note="no authentic images, possibly inactive — flag owner"
return slug="review-jatujak-studio-in-bangkok", done, got, note`,
    { label:'fix:jatujak', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'jatujak',done:false,note:String(e)})),
])
return { fixes: res }
