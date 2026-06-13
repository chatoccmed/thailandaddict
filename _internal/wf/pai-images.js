export const meta = {
  name: 'pai-images',
  description: 'Download real licensed images for Pai: city hero + 30 article heroes',
  phases: [
    { title: 'City', detail: 'Pai city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Pai article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ปายแคนยอน สะพานประวัติศาสตร์ปาย หมู่บ้านสันติชล พระธาตุแม่เย็น น้ำพุร้อนท่าปาย น้ำตกหมอแปง) หรือ **Unsplash / Pexels** (ทะเลหมอก ภูเขา นาขั้นบันได คาเฟ่ กาแฟ อาหารเหนือ มอเตอร์ไซค์เที่ยว บรรยากาศเมืองเหนือ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับปาย/ภาคเหนือ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของปาย — เลือกแลนด์มาร์กเด่น: ปายแคนยอน หรือ ทะเลหมอกหุบเขาปาย หรือ สะพานประวัติศาสตร์ปาย (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/pai.jpg และ astro/public/images/heroes/pai.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:pai', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'pai-food-guide','pai-cafe-scene','pai-walking-street','pai-northern-food','pai-breakfast-brunch',
  'pai-vegan-healthy','pai-bars-live-music','pai-local-restaurants',
  'pai-attractions','pai-canyon','pai-memorial-bridge','pai-hot-springs','pai-pam-bok-waterfall',
  'pai-mo-paeng-waterfall','pai-land-split','pai-yun-lai-viewpoint','pai-santichon-village',
  'pai-bamboo-bridge','pai-white-buddha',
  'pai-1-day-itinerary','pai-2d1n-itinerary','pai-3d2n-itinerary','pai-chiang-mai-plan','pai-mae-hong-son-loop-plan',
  'pai-slow-life-plan','pai-photo-spots-plan','pai-budget-backpacker-plan','pai-first-timer-guide',
  'pai-travel-tips','pai-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นปาย/ภาคเหนือ"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ปายแคนยอน/สะพานประวัติศาสตร์/สันติชล/พระธาตุแม่เย็น/น้ำพุร้อนท่าปาย/น้ำตกหมอแปง/ปำบก) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นคาเฟ่/อาหารเหนือ/ทะเลหมอก/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเลหมอก/ภูเขา/นา/คาเฟ่/อาหารเหนือที่เหมาะกับปาย
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
