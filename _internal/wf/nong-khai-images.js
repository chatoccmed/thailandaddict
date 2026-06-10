export const meta = {
  name: 'nong-khai-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Nong Khai: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Nong Khai city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Nong Khai article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ศาลาแก้วกู่ วัดโพธิ์ชัยหลวงพ่อพระใส สะพานมิตรภาพไทยลาว ริมโขงหนองคาย วัดผาตากเสื้อสกายวอล์ก พระธาตุบังพวน) หรือ **Unsplash / Pexels** (อาหารเวียดนาม/แหนมเนือง/ปลาแม่น้ำ/อีสาน/คาเฟ่/แม่น้ำโขง/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับหนองคาย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดหนองคาย — เลือกแลนด์มาร์กเด่น: ศาลาแก้วกู่ หรือ ริมโขงลานพญานาคหนองคาย หรือ สะพานมิตรภาพไทย-ลาว (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/nong-khai.jpg และ astro/public/images/heroes/nong-khai.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:nong-khai', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'nong-khai-vietnamese-food','nong-khai-mekong-fish','nong-khai-isan-food','nong-khai-kuay-jab-yuan','nong-khai-riverside-cafe',
  'nong-khai-local-breakfast','nong-khai-mookata','nong-khai-walking-street-food','nong-khai-dessert-cafe','nong-khai-souvenir-food','tha-sadet-market-food',
  'nong-khai-attractions','mekong-promenade-naga','sala-kaew-ku','wat-pho-chai','tha-sadet-market',
  'thai-lao-friendship-bridge','naga-fireballs','wat-pha-tak-suea','wat-hin-mak-peng','phon-phisai',
  'phra-that-bang-phuan','than-thong-waterfall',
  'nong-khai-1-day-itinerary','nong-khai-2d1n-itinerary','nong-khai-3d2n-itinerary','nong-khai-riverside-plan','nong-khai-nature-plan',
  'nong-khai-temple-faith-plan','nong-khai-vientiane-crossing-plan','nong-khai-naga-fireballs-plan','nong-khai-udon-plan','nong-khai-bueng-kan-plan',
  'nong-khai-loei-plan','nong-khai-first-timer-guide',
  'nong-khai-travel-tips','nong-khai-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นหนองคาย/อีสานริมโขง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ศาลาแก้วกู่/วัดโพธิ์ชัย/สะพานมิตรภาพ/ริมโขงหนองคาย/วัดผาตากเสื้อ/วัดหินหมากเป้ง/พระธาตุบังพวน/ตลาดท่าเสด็จ/บั้งไฟพญานาค/น้ำตกธารทอง) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารเวียดนาม/แหนมเนือง/ปลาแม่น้ำ/อีสาน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารเวียดนาม/ปลาแม่น้ำ/อีสาน/คาเฟ่/แม่น้ำโขงที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
