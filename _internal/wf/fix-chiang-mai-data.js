export const meta = {
  name: 'fix-chiang-mai-data',
  description: 'QA fixes (chiang-mai): re-fetch real hero+gallery for iWualai (current=man selfie) and Sala Lanna (current=N.American ranch porch); fix Si Phum Heritage B&B discontinued-breakfast claim. Real Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never selfie/stock.',
  phases: [{ title: 'Fix', detail: '2 image re-fetch + 1 prose data fix' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','done'], properties:{ slug:{type:'string'}, done:{type:'boolean'}, note:{type:'string'} } };
const IWUALAI = [1,2,3,4].map(i=>`astro/public/images/hotels/chiang-mai-wualai-${i}.jpg`);
const SALA = [1,2,3,4].map(i=>`astro/public/images/hotels/chiang-mai-salalanna-${i}.jpg`);
phase('Fix')
const res = await parallel([
  () => agent(`ดึงรูป **โรงแรมจริง** "iWualai Hotel" (ถนนวัวลาย อ.เมือง เชียงใหม่ — บูทีคย่านวัวลาย เครือเดียวกับ iSilver) — รูปเดิมผิด (chiang-mai-wualai-1.jpg เป็นรูปเซลฟี่ผู้ชายใส่แว่นกันแดด ไม่ใช่โรงแรม) เขียนทับด้วยรูปอาคาร/ห้อง/สระ/ล็อบบี้จริง
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/selfie/stock
web-search "iWualai Hotel Chiang Mai" → ดึง 4 รูปจริง → curl เขียนทับ (รูปแรก=hero):
${IWUALAI.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${IWUALAI.join(' ')} · ตรวจด้วยตาว่าเป็นโรงแรมจริง · return slug="review-iwualai-hotel-chiang-mai", done, note`,
    { label:'fix:iwualai', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'iwualai',done:false,note:String(e)})),
  () => agent(`ดึงรูป **โรงแรมจริง** "Sala Lanna Chiang Mai" (49 ถ.เจริญราษฎร์ วัดเกต ริมแม่น้ำปิง — บูทีคริมน้ำ มี Sky Bar, อยู่ใน Michelin Guide, Trip ID 712145) — รูปเดิมผิด (chiang-mai-salalanna-1.jpg เป็นเฉลียงบ้าน ranch อเมริกาเหนือใบไม้ร่วง ไม่ใช่โรงแรมนี้) เขียนทับด้วยรูปอาคาร/ห้อง/ริมน้ำปิง/rooftop จริง
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/stock
web-search "Sala Lanna Chiang Mai riverside" → ดึง 4 รูปจริง → curl เขียนทับ (รูปแรก=hero):
${SALA.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${SALA.join(' ')} · ตรวจด้วยตา · return slug="review-sala-lanna-chiang-mai", done, note`,
    { label:'fix:salalanna', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'salalanna',done:false,note:String(e)})),
  () => agent(`แก้ข้อมูลที่ล้าสมัยของ "Si Phum Heritage Boutique B&B" เชียงใหม่
ไฟล์: astro/src/content/reviews/review-si-phum-heritage-boutique-bed-and-breakfast-chiang-mai.json
ปัญหา: รีวิวชูจุดเด่น "อาหารเช้า + เครื่องดื่มฟรีทั้งวัน" เป็นไฮไลต์หลัก แต่ปัจจุบัน (ปลายปี 2025) ที่พักเลิกเสิร์ฟอาหารเช้าแล้ว (แม้ยังใช้ชื่อ B&B)
แก้: ลด/ปรับถ้อยคำที่เคลม 'อาหารเช้าฟรี/เครื่องดื่มฟรีทั้งวัน' ทุกจุด (metaDesc, ogDesc, intro, highlights, body, faq) ให้สะท้อนความจริง — เขียนกลางๆ ว่าจุดเด่นคือบรรยากาศวินเทจ/ทำเลเมืองเก่า ไม่การันตีอาหารเช้า (เช่น 'ควรเช็กกับที่พักเรื่องอาหารเช้าก่อนจอง') โทนเพื่อนเล่า ไม่มีคำต้องห้าม · คง score/ที่อยู่/ลิงก์เดิม
JSON valid · return slug="review-si-phum-heritage-boutique-bed-and-breakfast-chiang-mai", done, note`,
    { label:'fix:siphum', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'siphum',done:false,note:String(e)})),
])
return { fixes: res }
