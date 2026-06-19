export const meta = {
  name: 'fix-krabi-data',
  description: 'QA data fixes (krabi): (1) Nomads Ao Nang fabricated score 9.6/3342 → real 8.4/957 (Booking.com) everywhere; (2) Sleeper Hostel Trip.com link missing hotel ID 6488980. Edit review JSON + the roundup that features them. Keep JSON valid + roundup alignment.',
  phases: [{ title: 'Fix', detail: 'correct fabricated score + broken link, review + roundup' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','done'], properties:{ slug:{type:'string'}, done:{type:'boolean'}, note:{type:'string'} } };
phase('Fix')
const res = await parallel([
  () => agent(`แก้ข้อมูลคะแนนที่ปั่นเกินจริงของ "Nomads Ao Nang" (krabi) ให้ตรงความจริง
ไฟล์รีวิว: astro/src/content/reviews/review-nomads-ao-nang-krabi.json
ปัญหา: score=9.6, ratingCount=3342 (อ้าง Trip.com) — ไม่ตรงแหล่งใดเลย. ค่าจริง: Booking.com 8.4 (957 รีวิว) [ใช้ค่านี้ เพราะรีวิวเยอะสุด น่าเชื่อสุด], Trip.com 8.6 (19), Hostelworld 7.5 (294)
สิ่งที่ต้องทำ:
1) ในไฟล์รีวิว: set score=8.4, ratingCount=957 · แก้ข้อความ body/ทุกที่ที่อ้าง "9.6" หรือ "3,342"/"3342" หรือชื่อแหล่ง ให้เป็น 8.4 จาก Booking.com (957 รีวิว) อย่างสอดคล้อง เป็นธรรมชาติ (โทนเพื่อนเล่าให้ฟัง) · ห้ามคำต้องห้าม (ตอบโจทย์ ฯลฯ)
2) ในไฟล์ roundup: astro/src/content/roundups/top10-hotels-krabi.json — หา entry/compareRows ของ nomads แล้วแก้คะแนนที่แสดง 9.6→8.4 ให้ตรง · **อย่าเปลี่ยนลำดับ/จำนวน entries** (คง entries===toc===compareRows) แค่แก้ตัวเลขคะแนนให้ถูก
JSON ต้อง valid ทั้ง 2 ไฟล์. return slug="review-nomads-ao-nang-krabi", done, note`,
    { label:'fix:nomads', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'nomads',done:false,note:String(e)})),
  () => agent(`แก้ลิงก์ Trip.com ที่เสียของ "Sleeper Hostel" (krabi)
ไฟล์รีวิว: astro/src/content/reviews/review-sleeper-hostel-krabi.json
ปัญหา: bookingTrip = "https://www.trip.com/hotels/krabi-hotel-detail/sleeper-hostel/?Allianceid=6861268&SID=312919111" — ขาด hotel ID ทำให้ไม่ชี้หน้าโรงแรม
แก้เป็นรูปแบบที่ถูก: "https://www.trip.com/hotels/krabi-hotel-detail-6488980/?Allianceid=6861268&SID=312919111" (hotel ID จริง = 6488980)
แก้ทั้งในไฟล์รีวิว (field bookingTrip + ถ้ามีในลิงก์ heroSub/อื่น) และถ้า roundup top10-hotels-krabi.json มีลิงก์ trip ของ sleeper ที่ผิดแบบเดียวกันก็แก้ด้วย. JSON valid. return slug="review-sleeper-hostel-krabi", done, note`,
    { label:'fix:sleeper', phase:'Fix', schema:VERDICT }).then(v=>v).catch(e=>({slug:'sleeper',done:false,note:String(e)})),
])
return { fixes: res }
