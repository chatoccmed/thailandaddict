export const meta = {
  name: 'yala-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Yala: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Yala city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Yala article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น สกายวอล์กอัยเยอร์เวง ทะเลหมอกเบตง ตู้ไปรษณีย์เบตง เขื่อนบางลาง อุโมงค์ปิยะมิต วัดคูหาภิมุข ผังเมืองยะลา) หรือ **Unsplash / Pexels** (ไก่เบตง/อาหารจีน/เฉาก๊วย/ทะเลหมอก/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับยะลา/เบตง/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดยะลา — เลือกแลนด์มาร์กเด่น: ทะเลหมอกอัยเยอร์เวง/สกายวอล์ก หรือ ตู้ไปรษณีย์เบตง หรือ เขื่อนบางลาง (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/yala.jpg และ astro/public/images/heroes/yala.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:yala', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'yala-betong-chicken','betong-hokkien-food','yala-cafe-guide','betong-tilapia','yala-southern-food',
  'betong-chao-kuai','yala-malay-food','yala-pla-som','yala-local-breakfast','yala-chinese-dessert','yala-souvenir-food',
  'yala-attractions','aiyerweng-skywalk','betong-town','underground-tunnel-piyamit','betong-hot-spring',
  'southernmost-thailand-betong','bang-lang-dam','yala-city-plan','wat-khuha-phimuk','betong-street-art',
  'yala-betong-nature','yala-culture',
  'yala-1-day-itinerary','yala-betong-2d1n-itinerary','yala-betong-3d2n-itinerary','betong-mist-nature-plan','yala-dam-lake-plan',
  'yala-food-plan','betong-photo-spots-plan','yala-pattani-plan','yala-songkhla-plan',
  'yala-family-plan','betong-first-timer-guide','yala-city-walk-plan',
  'yala-travel-tips','yala-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นยะลา/เบตง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (สกายวอล์กอัยเยอร์เวง/ทะเลหมอก/ตู้ไปรษณีย์เบตง/เขื่อนบางลาง/อุโมงค์ปิยะมิต/วัดคูหาภิมุข/ผังเมืองยะลา) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นไก่เบตง/อาหารจีน/เฉาก๊วย/อาหารใต้/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารจีน-ใต้/ทะเลหมอก/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
