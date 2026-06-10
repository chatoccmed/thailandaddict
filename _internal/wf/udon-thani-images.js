export const meta = {
  name: 'udon-thani-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Udon Thani: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Udon Thani city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Udon Thani article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ทะเลบัวแดงหนองหาน บ้านเชียง คำชะโนด หนองประจักษ์ ภูพระบาท วัดป่าภูก้อน ศาลเจ้าปู่ย่าอุดร) หรือ **Unsplash / Pexels** (อาหารเวียดนาม/แหนมเนือง/อาหารอีสาน/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับอุดรธานี/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดอุดรธานี — เลือกแลนด์มาร์กเด่น: ทะเลบัวแดงหนองหานกุมภวาปี หรือ ศาลเจ้าปู่-ย่าอุดร หรือ หนองประจักษ์ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/udon-thani.jpg และ astro/public/images/heroes/udon-thani.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:udon-thani', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'udon-vietnamese-food','udon-kuay-jab-yuan','udon-isan-food','udon-cafe-guide','udon-mookata',
  'udon-local-breakfast','udon-nong-prajak-street-food','udon-nong-han-fish','udon-dessert-cafe','udon-souvenir-food','udon-night-market',
  'udon-attractions','red-lotus-sea','ban-chiang','kham-chanot','nong-prajak-park',
  'wat-pa-ban-tat','phu-foi-lom','phu-phra-bat-historical-park','than-ngam-waterfall','chao-pu-ya-shrine',
  'wat-pa-phu-kon','udonthani-museum',
  'udon-1-day-itinerary','udon-2d1n-itinerary','udon-3d2n-itinerary','udon-cafe-food-plan','udon-history-plan',
  'udon-nature-plan','udon-faith-plan','udon-family-plan','udon-nong-khai-plan','udon-loei-plan',
  'udon-khon-kaen-plan','udon-first-timer-guide',
  'udon-travel-tips','udon-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นอุดรธานี/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ทะเลบัวแดงหนองหาน/บ้านเชียง/คำชะโนด/หนองประจักษ์/วัดป่าบ้านตาด/ภูฝอยลม/ภูพระบาท/น้ำตกธารงาม/ศาลเจ้าปู่ย่า/วัดป่าภูก้อน) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารเวียดนาม/แหนมเนือง/ก๋วยจั๊บญวน/อาหารอีสาน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารเวียดนาม/อาหารอีสาน/คาเฟ่/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
