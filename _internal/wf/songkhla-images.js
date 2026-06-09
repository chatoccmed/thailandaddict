export const meta = {
  name: 'songkhla-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Songkhla: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Songkhla city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Songkhla article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น หาดสมิหลา นางเงือกสงขลา เมืองเก่าสงขลา เขาตังกวน เกาะยอ สะพานติณสูลานนท์ น้ำตกโตนงาช้าง เคเบิลคาร์หาดใหญ่) หรือ **Unsplash / Pexels** (อาหาร/ติ่มซำ/คาเฟ่/ทะเล/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับสงขลา-หาดใหญ่/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสงขลา — เลือกแลนด์มาร์กเด่น: รูปปั้นนางเงือกหาดสมิหลา หรือ ย่านเมืองเก่าสงขลา หรือ เกาะยอ/สะพานติณสูลานนท์ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/songkhla.jpg และ astro/public/images/heroes/songkhla.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:songkhla', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'hatyai-dim-sum','songkhla-seafood','songkhla-southern-food','hatyai-fried-chicken','songkhla-tao-kua',
  'songkhla-old-town-cafe','songkhla-khao-stew','hatyai-night-market-food','songkhla-local-breakfast','songkhla-souvenir-food','songkhla-dessert-cafe',
  'songkhla-attractions','samila-beach','songkhla-old-town-nang-ngam','khao-tang-kuan','koh-yor-tinsulanon-bridge',
  'songkhla-lake','hatyai-city-kimyong-market','ton-nga-chang-waterfall','songkhla-national-museum','khlong-hae-floating-market',
  'hatyai-municipal-park-cable-car','wat-khao-rup-chang',
  'songkhla-1-day-itinerary','songkhla-2d1n-itinerary','songkhla-3d2n-itinerary','songkhla-old-town-cafe-plan','hatyai-food-shopping-plan',
  'songkhla-sea-lake-plan','songkhla-photo-spots-plan','songkhla-culture-temple-plan','songkhla-phatthalung-plan','songkhla-satun-plan',
  'songkhla-family-plan','songkhla-first-timer-guide',
  'songkhla-travel-tips','songkhla-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสงขลา-หาดใหญ่/ทะเล/เมืองเก่า"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หาดสมิหลา/นางเงือก/เมืองเก่าสงขลา/เขาตังกวน/เกาะยอ/สะพานติณ/ทะเลสาบสงขลา/น้ำตกโตนงาช้าง/เคเบิลคาร์หาดใหญ่/ตลาดน้ำคลองแห/พิพิธภัณฑ์สงขลา) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหาร/ติ่มซำ/ไก่ทอด/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้/ติ่มซำ/คาเฟ่/ทะเล/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
