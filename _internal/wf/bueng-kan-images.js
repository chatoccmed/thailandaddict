export const meta = {
  name: 'bueng-kan-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Bueng Kan: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Bueng Kan city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Bueng Kan article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ภูทอก หินสามวาฬ ถ้ำนาคา บึงโขงหลง น้ำตกเจ็ดสีภูวัว วัดอาฮงศิลาวาส ภูลังกา ริมโขงบึงกาฬ) หรือ **Unsplash / Pexels** (อาหารอีสาน/ปลาแม่น้ำ/เวียดนาม/คาเฟ่/สวนยาง/แม่น้ำโขง/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับบึงกาฬ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดบึงกาฬ — เลือกแลนด์มาร์กเด่น: หินสามวาฬ หรือ ภูทอก หรือ ถ้ำนาคา (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/bueng-kan.jpg และ astro/public/images/heroes/bueng-kan.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:bueng-kan', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'bueng-kan-isan-food','bueng-kan-mekong-fish','bueng-kan-vietnamese-food','bueng-kan-kuay-jab-yuan','bueng-kan-cafe-guide',
  'bueng-kan-local-breakfast','bueng-kan-mookata','bueng-kan-riverside-food','bueng-kan-dessert-cafe','bueng-kan-souvenir-food','bueng-kan-night-market',
  'bueng-kan-attractions','phu-thok','three-whale-rock','naka-cave','bueng-kan-mekong-promenade',
  'bueng-khong-long','chet-si-waterfall','tham-phra-waterfall-phu-wua','wat-ahong-silawat','phu-langka',
  'rubber-plantation-scenery','phu-wua-wildlife-sanctuary',
  'bueng-kan-1-day-itinerary','bueng-kan-2d1n-itinerary','bueng-kan-3d2n-itinerary','bueng-kan-nature-plan','bueng-kan-rock-mountain-plan',
  'bueng-kan-riverside-plan','bueng-kan-naka-cave-plan','bueng-kan-photo-spots-plan','bueng-kan-nong-khai-plan','bueng-kan-nakhon-phanom-plan',
  'bueng-kan-sakon-nakhon-plan','bueng-kan-first-timer-guide',
  'bueng-kan-travel-tips','bueng-kan-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นบึงกาฬ/อีสานริมโขง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ภูทอก/หินสามวาฬ/ถ้ำนาคา/บึงโขงหลง/น้ำตกเจ็ดสี/น้ำตกถ้ำพระภูวัว/วัดอาฮงศิลาวาส/ภูลังกา/ริมโขงบึงกาฬ) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ปลาแม่น้ำ/เวียดนาม/คาเฟ่/สวนยาง/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ปลาแม่น้ำ/คาเฟ่/สวนยาง/แม่น้ำโขงที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
