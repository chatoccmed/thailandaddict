export const meta = {
  name: 'satun-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Satun: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Satun city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Satun article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น เกาะหลีเป๊ะ ตะรุเตา ปราสาทหินพันยอด ถ้ำเลสเตโกดอน น้ำตกวังสายทอง คฤหาสน์กูเด็น มัสยิดมำบัง เกาะหินงาม) หรือ **Unsplash / Pexels** (อาหาร/โรตี/คาเฟ่/ทะเลอันดามัน/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับสตูล/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสตูล — เลือกแลนด์มาร์กเด่น: เกาะหลีเป๊ะ หรือ ปราสาทหินพันยอด หรือ ตะรุเตา (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/satun.jpg และ astro/public/images/heroes/satun.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:satun', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'satun-seafood','satun-southern-food','satun-roti-cha-chak','satun-muslim-malay-food','satun-khao-yam',
  'satun-khanom-jeen','satun-cafe-guide','lipe-food-walking-street','satun-local-breakfast','satun-street-food','satun-dessert-cafe',
  'satun-attractions','koh-lipe','tarutao-national-park','satun-unesco-geopark','la-stegodon-cave',
  'prasat-hin-phan-yot','wang-sai-thong-waterfall','kuden-mansion','mambang-mosque','koh-hin-ngam-koh-adang',
  'pak-bara-pier','koh-khai-stone-arch',
  'satun-1-day-itinerary','satun-2d1n-itinerary','satun-3d2n-itinerary','lipe-island-plan','tarutao-pakbara-plan',
  'satun-geopark-nature-plan','satun-city-culture-plan','satun-photo-spots-plan','satun-trang-plan','satun-songkhla-plan',
  'satun-family-plan','satun-first-timer-guide',
  'satun-travel-tips','satun-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสตูล/ทะเลอันดามัน/ธรณีโลก/เมืองมุสลิม"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (เกาะหลีเป๊ะ/ตะรุเตา/ปราสาทหินพันยอด/ถ้ำเลสเตโกดอน/น้ำตกวังสายทอง/คฤหาสน์กูเด็น/มัสยิดมำบัง/เกาะหินงาม/ปากบารา/เกาะไข่) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหาร/โรตี/ข้าวยำ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้-มุสลิม/โรตี/คาเฟ่/ทะเล/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
