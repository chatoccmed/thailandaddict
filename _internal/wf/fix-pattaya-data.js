export const meta = {
  name: 'fix-pattaya-data',
  description: 'QA fixes (pattaya): separate shared Holiday Inn / Holiday Inn Express images; re-fetch nonze hostel (was french-fries photo); fix The Wind inflated ratingCount/claims. Real Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never food/stock.',
  phases: [{ title: 'Fix', detail: '3 image re-fetch + 1 number/prose fix' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','done'], properties:{ slug:{type:'string'}, done:{type:'boolean'}, note:{type:'string'} } };
const HIP = [1,2,3,4].map(i=>`astro/public/images/hotels/pattaya-holidayinn-${i}.jpg`);
const HIEX = [1,2,3,4].map(i=>`astro/public/images/hotels/pattaya-holidayinnexpress-${i}.jpg`);
const NONZE = [1,2,3,4].map(i=>`astro/public/images/hotels/pattaya-nonze-${i}.jpg`);
phase('Fix')
const res = await parallel([
  () => agent(`ดึงรูป **โรงแรมจริง** "Holiday Inn Pattaya" (เครือ IHG ริมหาดพัทยา Beach Rd) ให้ตรงโรงแรมนี้ — ปัจจุบันชุดรูป pattaya-holidayinn-* ถูกใช้ปนกับ Holiday Inn Express (คนละโรงแรม) ต้องทำให้ pattaya-holidayinn-* เป็นรูป Holiday Inn Pattaya (ตึกใหญ่ริมหาด Executive Tower) จริง
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ IHG — ห้าม Trip.com/Agoda/stock · ดึง 4 รูป → curl เขียนทับ:
${HIP.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${HIP.join(' ')} · ตรวจด้วยตา = Holiday Inn Pattaya จริง · return slug="review-holiday-inn-pattaya", done, note`,
    { label:'fix:hi-pattaya', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'hi-pattaya',done:false,note:String(e)})),
  () => agent(`ดึงรูป **โรงแรมจริง** "Holiday Inn Express Pattaya Central" (เครือ IHG กลางพัทยา ใกล้ Central Festival — คนละแห่งกับ Holiday Inn Pattaya) แล้วบันทึกเป็น **ไฟล์ชุดใหม่** (เพื่อไม่ใช้รูปปนกัน):
${HIEX.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/stock · ดึง 4 รูป → curl → node _internal/optimize-images.mjs ${HIEX.join(' ')}
จากนั้น **แก้ไฟล์รีวิว** astro/src/content/reviews/review-holiday-inn-express-central-pattaya.json: เปลี่ยน heroImg → "images/hotels/pattaya-holidayinnexpress-1.jpg" และ gallery → pattaya-holidayinnexpress-2/3/4.jpg (JSON valid)
ตรวจด้วยตา = Holiday Inn Express จริง · return slug="review-holiday-inn-express-central-pattaya", done, note`,
    { label:'fix:hi-express', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'hi-express',done:false,note:String(e)})),
  () => agent(`ดึงรูป **ตัวโฮสเทลจริง** "Nonze Hostel" (พัทยา — capsule hostel) — รูปเดิม pattaya-nonze-1.jpg เป็นจานเฟรนช์ฟรายส์ ไม่ใช่ที่พัก เขียนทับด้วยรูปภายนอก/แคปซูล/ห้องพัก/common area จริง
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/รูปอาหาร/stock · ดึง 4 รูป → curl เขียนทับ:
${NONZE.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${NONZE.join(' ')} · ตรวจด้วยตา = ตัวโฮสเทล · return slug="review-nonze-hostel-pattaya", done, note`,
    { label:'fix:nonze', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'nonze',done:false,note:String(e)})),
  () => agent(`แก้ตัวเลขรีวิวเกินจริงของ "The Wind Hotel" (บางเสร่/สัตหีบ พัทยา)
ไฟล์: astro/src/content/reviews/review-the-wind-hotel-pattaya.json
ปัญหา: ratingCount=2703 เกินจริงมาก (จริง Trip.com ~255, Booking ~218) และข้อความ intro/metaDesc/สรุป เคลม "ผู้เข้าพักหลายพันคน"
แก้: set ratingCount=255 · แก้ทุกข้อความที่บอก "หลายพันคน"/"พันคน"/"2,703"/"2703" ให้เป็นจริง (เช่น "หลายร้อยรีวิวจริง" หรือ "กว่า 250 รีวิว") โทนเพื่อนเล่า ไม่มีคำต้องห้าม · คง score 7.8/ที่อยู่/ลิงก์เดิม
JSON valid · return slug="review-the-wind-hotel-pattaya", done, note`,
    { label:'fix:the-wind', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'the-wind',done:false,note:String(e)})),
])
return { fixes: res }
