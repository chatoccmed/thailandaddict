export const meta = {
  name: 'samui-images',
  description: 'Download real licensed images for Koh Samui: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Koh Samui city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Koh Samui article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พระใหญ่สมุย หินตาหินยาย หาดเฉวง หาดละไม วัดคุณาราม บ่อผุด อ่างทอง) หรือ **Unsplash / Pexels** (ทะเล/หาด/ดำน้ำ/อาหารทะเล/คาเฟ่/บีชคลับ/มะพร้าว/บรรยากาศเกาะ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเกาะสมุย/ทะเลอ่าวไทย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเกาะสมุย — เลือกแลนด์มาร์กเด่น: พระใหญ่สมุย หรือ หาดเฉวงทรายขาวน้ำใส หรือ หินตาหินยาย (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/samui.jpg และ astro/public/images/heroes/samui.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:samui', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'samui-seafood','samui-beach-clubs','samui-cafe-guide','samui-southern-food','samui-night-market',
  'samui-international-food','samui-vegan-health','samui-fisherman-village-food','samui-local-breakfast','samui-coconut-dessert','samui-souvenir-food',
  'samui-attractions','chaweng-beach','lamai-beach','big-buddha-wat-phra-yai','hin-ta-hin-yai',
  'wat-khunaram-mummified-monk','na-muang-waterfall','bophut-fishermans-village','ang-thong-marine-park','samui-viewpoints',
  'samui-snorkeling-diving','samui-temples-culture',
  'samui-1-day-itinerary','samui-3d2n-itinerary','samui-4d3n-itinerary','samui-sea-island-plan','samui-family-plan',
  'samui-couple-honeymoon-plan','samui-photo-spots-plan','samui-koh-phangan-plan','samui-beach-hopping-plan',
  'samui-nightlife-plan','samui-budget-plan','samui-first-timer-guide',
  'samui-travel-tips','samui-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเกาะสมุย/ทะเลอ่าวไทย"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระใหญ่/หินตาหินยาย/หาดเฉวง/หาดละไม/วัดคุณาราม/บ่อผุด/อ่างทอง/น้ำตกหน้าเมือง) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นอาหารทะเล/คาเฟ่/บีชคลับ/ดำน้ำ/มะพร้าว/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเล/หาด/อาหารทะเล/คาเฟ่/ดำน้ำที่เหมาะกับเกาะอ่าวไทย
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
