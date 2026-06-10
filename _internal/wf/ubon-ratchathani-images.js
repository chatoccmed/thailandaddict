export const meta = {
  name: 'ubon-ratchathani-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Ubon Ratchathani: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Ubon city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Ubon article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ผาแต้ม สามพันโบก งานแห่เทียนอุบล วัดสิรินธรภูพร้าว วัดทุ่งศรีเมือง น้ำตกแสงจันทร์ เสาเฉลียง แก่งสะพือ) หรือ **Unsplash / Pexels** (อาหารอีสาน/เวียดนาม/เฝอ/คาเฟ่/แม่น้ำโขง/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับอุบล/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดอุบลราชธานี — เลือกแลนด์มาร์กเด่น: สามพันโบก หรือ ผาแต้มริมโขง หรือ วัดสิรินธรวรารามภูพร้าว (วัดเรืองแสง) หรือ งานแห่เทียนพรรษา (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/ubon-ratchathani.jpg และ astro/public/images/heroes/ubon-ratchathani.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:ubon-ratchathani', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'ubon-isan-food','ubon-vietnamese-food','ubon-kuay-jab-yuan','ubon-mooyor','ubon-cafe-guide',
  'ubon-local-breakfast','ubon-khanom-jeen','ubon-night-market','ubon-mookata','ubon-dessert-cafe','ubon-souvenir-food',
  'ubon-attractions','pha-taem-national-park','sam-phan-bok','ubon-candle-festival','pha-chana-dai',
  'wat-sirindhorn-phu-prao','wat-thung-si-mueang','thung-si-mueang-park','saeng-chan-waterfall','sao-chaliang',
  'ubon-national-museum','kaeng-saphue',
  'ubon-1-day-itinerary','ubon-2d1n-itinerary','ubon-3d2n-itinerary','ubon-nature-plan','ubon-cafe-food-plan',
  'ubon-temple-plan','ubon-candle-festival-plan','ubon-sunrise-pha-chana-dai-plan','ubon-sisaket-plan','ubon-yasothon-plan',
  'ubon-amnat-charoen-plan','ubon-first-timer-guide',
  'ubon-travel-tips','ubon-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นอุบล/อีสานริมโขง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ผาแต้ม/สามพันโบก/งานแห่เทียน/ผาชะนะได/วัดเรืองแสงภูพร้าว/วัดทุ่งศรีเมือง/น้ำตกแสงจันทร์/เสาเฉลียง/แก่งสะพือ) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/เวียดนาม/เฝอ/หมูยอ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/เวียดนาม/คาเฟ่/แม่น้ำโขง/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
