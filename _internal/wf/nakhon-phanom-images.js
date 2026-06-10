export const meta = {
  name: 'nakhon-phanom-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Nakhon Phanom: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Nakhon Phanom city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Nakhon Phanom article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น พระธาตุพนม พญาศรีสัตตนาคราช ริมโขงนครพนม หอนาฬิกาเวียดนาม พระธาตุเรณูนคร พระธาตุท่าอุเทน สะพานมิตรภาพ 3 ไหลเรือไฟ) หรือ **Unsplash / Pexels** (อาหารเวียดนาม/แหนมเนือง/ปลาแม่น้ำ/อีสาน/คาเฟ่/แม่น้ำโขง/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับนครพนม/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดนครพนม — เลือกแลนด์มาร์กเด่น: พระธาตุพนม หรือ พญาศรีสัตตนาคราชริมโขง หรือ ริมโขงนครพนมวิวภูเขาลาว (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/nakhon-phanom.jpg และ astro/public/images/heroes/nakhon-phanom.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:nakhon-phanom', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'nakhon-phanom-vietnamese-food','nakhon-phanom-isan-food','nakhon-phanom-mekong-fish','nakhon-phanom-kuay-jab-yuan','nakhon-phanom-riverside-cafe',
  'nakhon-phanom-local-breakfast','nakhon-phanom-mookata','nakhon-phanom-walking-street-food','nakhon-phanom-dessert-cafe','nakhon-phanom-souvenir-food','nakhon-phanom-night-market',
  'nakhon-phanom-attractions','phra-that-phanom','nakhon-phanom-mekong-promenade','phaya-sri-sattanakharat','ho-chi-minh-village',
  'vietnam-clock-tower','phra-that-renu-nakhon','phra-that-tha-uthen','thai-lao-friendship-bridge-3','nakhon-phanom-fire-boat-festival',
  'nakhon-phanom-birthday-stupas','renu-nakhon-phu-tai',
  'nakhon-phanom-1-day-itinerary','nakhon-phanom-2d1n-itinerary','nakhon-phanom-3d2n-itinerary','nakhon-phanom-stupa-pilgrimage-plan','nakhon-phanom-riverside-plan',
  'nakhon-phanom-vietnamese-food-plan','nakhon-phanom-sunrise-plan','nakhon-phanom-photo-spots-plan','nakhon-phanom-mukdahan-plan','nakhon-phanom-sakon-nakhon-plan',
  'nakhon-phanom-bueng-kan-plan','nakhon-phanom-first-timer-guide',
  'nakhon-phanom-travel-tips','nakhon-phanom-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นนครพนม/อีสานริมโขง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระธาตุพนม/พญาศรีสัตตนาคราช/ริมโขงนครพนม/หอนาฬิกาเวียดนาม/พระธาตุเรณู/พระธาตุท่าอุเทน/สะพานมิตรภาพ3/บ้านลุงโฮ/ไหลเรือไฟ) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารเวียดนาม/แหนมเนือง/ปลาแม่น้ำ/อีสาน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารเวียดนาม/ปลาแม่น้ำ/อีสาน/คาเฟ่/แม่น้ำโขงที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
