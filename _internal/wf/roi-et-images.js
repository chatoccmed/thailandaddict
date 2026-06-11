export const meta = {
  name: 'roi-et-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Roi Et: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Roi Et city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Roi Et article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น หอโหวด 101 บึงพลาญชัย พระมหาเจดีย์ชัยมงคล วัดบูรพาภิราม กู่กาสิงห์ บึงเกลือ ทุ่งกุลาร้องไห้) หรือ **Unsplash / Pexels** (อาหารอีสาน/ข้าวหอมมะลิ/ทุ่งนา/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับร้อยเอ็ด/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดร้อยเอ็ด — เลือกแลนด์มาร์กเด่น: หอโหวด 101 หรือ บึงพลาญชัย หรือ พระมหาเจดีย์ชัยมงคล (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/roi-et.jpg และ astro/public/images/heroes/roi-et.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:roi-et', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'roi-et-isan-food','roi-et-jasmine-rice','roi-et-cafe-guide','roi-et-mookata','roi-et-khao-jee',
  'roi-et-koi-pla','roi-et-street-food','roi-et-local-breakfast','roi-et-forest-mushroom','roi-et-souvenir-food','roi-et-local-dessert',
  'roi-et-attractions','ho-wot-101','bueng-phlan-chai','phra-maha-chedi-chai-mongkhon','wat-burapha-phiram',
  'roi-et-national-museum','ku-ka-sing','bueng-kluea','thung-kula-rong-hai','bun-phawet-festival',
  'roi-et-city-temples','roi-et-nature',
  'roi-et-1-day-itinerary','roi-et-2d1n-itinerary','roi-et-3d2n-itinerary','roi-et-temple-merit-plan','roi-et-nature-plan',
  'roi-et-city-walk-plan','roi-et-photo-spots-plan','roi-et-khon-kaen-plan','roi-et-maha-sarakham-plan',
  'roi-et-family-plan','roi-et-bun-phawet-plan','roi-et-first-timer-guide',
  'roi-et-travel-tips','roi-et-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นร้อยเอ็ด/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หอโหวด101/บึงพลาญชัย/พระมหาเจดีย์ชัยมงคล/วัดบูรพาภิราม/กู่กาสิงห์/บึงเกลือ/ทุ่งกุลา) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ข้าวหอมมะลิ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ข้าว/ทุ่งนา/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
