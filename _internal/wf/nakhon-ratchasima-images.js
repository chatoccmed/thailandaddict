export const meta = {
  name: 'nakhon-ratchasima-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Nakhon Ratchasima: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Korat city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Korat article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น เขาใหญ่ ปราสาทหินพิมาย อนุสาวรีย์ย่าโม ฟาร์มโชคชัย ลำตะคอง) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/ไวน์/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับโคราช/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดนครราชสีมา (โคราช) — เลือกแลนด์มาร์กเด่น: ปราสาทหินพิมาย หรือ อุทยานแห่งชาติเขาใหญ่ หรือ อนุสาวรีย์ย่าโม (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/nakhon-ratchasima.jpg และ astro/public/images/heroes/nakhon-ratchasima.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:nakhon-ratchasima', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'top-pad-mee-korat','korat-isan-food','khao-yai-cafe-guide','khao-yai-winery-guide','korat-mookata-buffet',
  'korat-street-food','korat-dessert-cafe','korat-local-breakfast','korat-noodle-shops','korat-souvenir-food','khao-yai-restaurant-view',
  'korat-attractions','khao-yai-national-park-guide','phimai-historical-park','thao-suranari-monument','pak-chong-khao-yai-farms',
  'khao-yai-waterfalls','petrified-wood-museum','wat-ban-rai-korat','lam-takhong-dam','khao-yai-viewpoints-camping',
  'korat-old-town-walk','pak-thong-chai-silk',
  'korat-1-day-itinerary','korat-2d1n-itinerary','korat-3d2n-itinerary','khao-yai-2d1n-plan','khao-yai-cafe-winery-plan',
  'khao-yai-nature-plan','korat-culture-plan','korat-photo-spots-plan','korat-buriram-temple-plan','korat-khao-yai-family-plan',
  'bangkok-khao-yai-weekend','korat-first-timer-guide',
  'korat-travel-tips','korat-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นโคราช/เขาใหญ่"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (เขาใหญ่/น้ำตกเหวสุวัต/ปราสาทหินพิมาย/ย่าโม/ฟาร์มโชคชัย/ลำตะคอง/ไม้กลายเป็นหิน/วัดบ้านไร่) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหาร/คาเฟ่/ไวน์/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/คาเฟ่/ไร่องุ่น/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
