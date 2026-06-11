export const meta = {
  name: 'maha-sarakham-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Maha Sarakham: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Maha Sarakham city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Maha Sarakham article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พระธาตุนาดูน กู่สันตรัตน์ กู่บ้านเขวา แก่งเลิงจาน บ้านหม้อ มหาวิทยาลัยมหาสารคาม) หรือ **Unsplash / Pexels** (อาหารอีสาน/คาเฟ่/ปลาร้า/เครื่องปั้นดินเผา/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับมหาสารคาม/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดมหาสารคาม — เลือกแลนด์มาร์กเด่น: พระธาตุนาดูน หรือ กู่สันตรัตน์ หรือ แก่งเลิงจาน หรือ เครื่องปั้นดินเผาบ้านหม้อ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/maha-sarakham.jpg และ astro/public/images/heroes/maha-sarakham.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:maha-sarakham', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'maha-sarakham-isan-food','maha-sarakham-university-food','maha-sarakham-cafe-guide','maha-sarakham-mookata','maha-sarakham-sai-krok-mam',
  'maha-sarakham-kaeng-loeng-chan-food','maha-sarakham-street-food','maha-sarakham-local-breakfast','maha-sarakham-plara-fermented','maha-sarakham-souvenir-food','maha-sarakham-local-dessert',
  'maha-sarakham-attractions','phra-that-na-dun','ku-santarat','ku-ban-khwao','kaeng-loeng-chan',
  'don-pu-ta-monkey','ban-mo-pottery','mahasarakham-university','wat-mahachai','maha-sarakham-khmer-ku-trail',
  'maha-sarakham-dvaravati-history','maha-sarakham-nature',
  'maha-sarakham-1-day-itinerary','maha-sarakham-2d1n-itinerary','maha-sarakham-3d2n-itinerary','maha-sarakham-cafe-student-plan','maha-sarakham-archaeology-plan',
  'maha-sarakham-nature-plan','maha-sarakham-photo-spots-plan','maha-sarakham-khon-kaen-plan','maha-sarakham-roi-et-plan',
  'maha-sarakham-family-plan','maha-sarakham-budget-plan','maha-sarakham-first-timer-guide',
  'maha-sarakham-travel-tips','maha-sarakham-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นมหาสารคาม/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระธาตุนาดูน/กู่สันตรัตน์/กู่บ้านเขวา/แก่งเลิงจาน/บ้านหม้อ/มหาวิทยาลัยมหาสารคาม/วัดมหาชัย) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/คาเฟ่/ปลาร้า/เครื่องปั้น/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/คาเฟ่/เครื่องปั้นดินเผาที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
