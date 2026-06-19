export const meta = {
  name: 'fix-rayong-data',
  description: 'QA fixes (rayong): separate shared Banyan Residence/Banyan Resort images; re-fetch Pimpimarn (was tour-group photo); fix Ao Cho Grandview inflated review count. Real Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never group-photo/stock.',
  phases: [{ title: 'Fix', detail: '3 image re-fetch + 1 number fix' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','done'], properties:{ slug:{type:'string'}, done:{type:'boolean'}, note:{type:'string'} } };
const BANRES = [1,2,3,4].map(i=>`astro/public/images/hotels/rayong-banyanresidence-${i}.jpg`);
const BANRESORT = [1,2,3,4].map(i=>`astro/public/images/hotels/rayong-banyan-${i}.jpg`);
const PIM = [1,2,3,4].map(i=>`astro/public/images/hotels/rayong-pimpimarn-${i}.jpg`);
phase('Fix')
const res = await parallel([
  () => agent(`ดึงรูป **โรงแรมจริง** "Banyan Residence" ระยอง (เซอร์วิสอพาร์ตเมนต์ในเมือง ย่านเนินพระ — Trip.com id 3065958) แล้วบันทึก **ไฟล์ชุดใหม่** (เลิกใช้รูปปนกับ Banyan Resort ริมหาด):
${BANRES.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/stock · ดึง 4 รูป → curl → node _internal/optimize-images.mjs ${BANRES.join(' ')}
จากนั้นแก้ astro/src/content/reviews/review-banyan-residence-rayong.json: heroImg + gallery + image/heroSub ที่ชี้ rayong-banyan-* → เปลี่ยนเป็น rayong-banyanresidence-1..4.jpg (JSON valid)
ตรวจด้วยตา = อพาร์ตเมนต์ในเมือง · return slug="review-banyan-residence-rayong", done, note`,
    { label:'fix:banyan-res', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'banyan-res',done:false,note:String(e)})),
  () => agent(`ดึงรูป **โรงแรมจริง** "Banyan Resort" ระยอง (รีสอร์ตบังกะโลริมหาดสวนสน บ้านเพ — Trip.com id 21425272) ให้ตรงโรงแรมนี้ เขียนทับชุด rayong-banyan-* (เก็บชื่อไฟล์เดิมไว้ให้ Resort):
${BANRESORT.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ/FB — ห้าม Trip.com/Agoda/stock · ดึง 4 รูป → curl เขียนทับ → node _internal/optimize-images.mjs ${BANRESORT.join(' ')}
ตรวจด้วยตา = บังกะโลริมหาดสวนสน · return slug="review-banyan-resort-rayong", done, note`,
    { label:'fix:banyan-resort', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'banyan-resort',done:false,note:String(e)})),
  () => agent(`ดึงรูป **โรงแรมจริง** "Pimpimarn Beach Hotel/Resort" ระยอง (ริมหาด แม่รำพึง/บ้านเพ) — รูปเดิม rayong-pimpimarn-1.jpg เป็นรูปกรุ๊ปทัวร์ยืนข้างป้ายหิน 'เกาะทะลุ' ไม่ใช่โรงแรม เขียนทับด้วยรูปตัวโรงแรม/ห้อง/สระ/หาดของรีสอร์ตจริง:
${PIM.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แหล่ง: Tripadvisor/Ostrovok/เว็บทางการ — ห้าม Trip.com/Agoda/รูปกรุ๊ปทัวร์/stock · ดึง 4 รูป → curl เขียนทับ → node _internal/optimize-images.mjs ${PIM.join(' ')}
ตรวจด้วยตา = ตัวโรงแรม/รีสอร์ต · return slug="review-pimpimarn-beach-hotel-rayong", done, note`,
    { label:'fix:pimpimarn', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'pimpimarn',done:false,note:String(e)})),
  () => agent(`แก้จำนวนรีวิวเกินจริงของ "Ao Cho Grandview Hideaway Resort" (เกาะเสม็ด ระยอง)
ไฟล์: astro/src/content/reviews/review-ao-cho-grandview-hideaway-resort-rayong.json
ปัญหา: ratingCount=2991 อ้างว่าเป็น Trip.com แต่ไม่ตรงแหล่งใด (จริง Trip.com ~65, Booking 657). คะแนน 8.1 ถูกต้องแล้ว
แก้: set ratingCount=657 · แก้ทุกข้อความที่อ้าง "2,991"/"2991" + แหล่ง ให้เป็น "657 รีวิวจาก Booking.com" (meta/intro/body/สรุป) โทนเพื่อนเล่า ไม่มีคำต้องห้าม · คง score 8.1/ที่อยู่/ลิงก์
JSON valid · return slug="review-ao-cho-grandview-hideaway-resort-rayong", done, note`,
    { label:'fix:ao-cho', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'ao-cho',done:false,note:String(e)})),
])
return { fixes: res }
