export const meta = {
  name: 'sisaket-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Sisaket: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Sisaket city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Sisaket article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ปราสาทสระกำแพงใหญ่ ผามออีแดง วัดล้านขวด วัดพระธาตุเรืองรอง เขาพระวิหาร) หรือ **Unsplash / Pexels** (ทุเรียน/อาหารอีสาน/หอมแดง/ขนมจีน/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับศรีสะเกษ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดศรีสะเกษ — เลือกแลนด์มาร์กเด่น: ปราสาทสระกำแพงใหญ่ หรือ วัดล้านขวด หรือ ผามออีแดง หรือ ทุเรียนภูเขาไฟ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/sisaket.jpg และ astro/public/images/heroes/sisaket.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:sisaket', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'sisaket-isan-food','sisaket-volcanic-durian','sisaket-khanom-jeen','sisaket-mookata','sisaket-cafe-guide',
  'sisaket-shallot-garlic','sisaket-street-food','sisaket-local-breakfast','sisaket-jasmine-rice','sisaket-souvenir-food','sisaket-local-dessert',
  'sisaket-attractions','pha-mo-e-daeng','khao-phra-wihan-national-park','prasat-sa-kamphaeng-yai','prasat-ban-prasat-sisaket',
  'wat-lan-khuat','wat-phra-that-rueang-rong','volcanic-durian-orchard','huai-nam-kham-island','sisaket-khmer-temple-trail',
  'kantharalak-durian-route','sisaket-four-tribes-culture',
  'sisaket-1-day-itinerary','sisaket-2d1n-itinerary','sisaket-3d2n-itinerary','sisaket-khmer-temple-plan','sisaket-nature-plan',
  'sisaket-durian-season-plan','sisaket-culture-plan','sisaket-photo-spots-plan','sisaket-ubon-plan','sisaket-surin-plan',
  'sisaket-family-plan','sisaket-first-timer-guide',
  'sisaket-travel-tips','sisaket-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นศรีสะเกษ/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ปราสาทสระกำแพงใหญ่/ผามออีแดง/วัดล้านขวด/วัดพระธาตุเรืองรอง/เขาพระวิหาร/บ้านปราสาท) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นทุเรียนภูเขาไฟ/อาหารอีสาน/หอมแดง/ขนมจีน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทุเรียน/อาหารอีสาน/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
