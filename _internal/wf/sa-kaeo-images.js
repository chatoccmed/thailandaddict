export const meta = {
  name: 'sa-kaeo-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Sa Kaeo: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Sa Kaeo city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Sa Kaeo article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ปราสาทสด๊กก๊อกธม เขาฉกรรจ์ ปางสีดา ละลุ ตลาดโรงเกลือ ปราสาทเขาน้อยสีชมพู) หรือ **Unsplash / Pexels** (อาหารอีสาน/เมล่อน/ตลาด/น้ำตก/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับสระแก้ว/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสระแก้ว — เลือกแลนด์มาร์กเด่น: ปราสาทสด๊กก๊อกธม หรือ ละลุ หรือ เขาฉกรรจ์ หรือ ตลาดโรงเกลือ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/sa-kaeo.jpg และ astro/public/images/heroes/sa-kaeo.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:sa-kaeo', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'sa-kaeo-isan-food','aranyaprathet-street-food','sa-kaeo-cafe-guide','sa-kaeo-mookata','sa-kaeo-cambodian-food',
  'wang-nam-yen-melon','sa-kaeo-street-food','sa-kaeo-local-breakfast','sa-kaeo-freshwater-fish','sa-kaeo-souvenir-food','sa-kaeo-local-dessert',
  'sa-kaeo-attractions','rong-kluea-market','sdok-kok-thom','prasat-khao-noi-si-chomphu','pang-sida-national-park',
  'khao-chakan','lalu','ta-phraya-national-park','khlong-luek-poipet-border','sa-kaeo-sa-khwan',
  'sa-kaeo-khmer-temple-trail','sa-kaeo-nature',
  'sa-kaeo-1-day-itinerary','sa-kaeo-2d1n-itinerary','sa-kaeo-3d2n-itinerary','sa-kaeo-border-shopping-plan','sa-kaeo-nature-plan',
  'sa-kaeo-khmer-history-plan','sa-kaeo-photo-spots-plan','sa-kaeo-prachinburi-plan','bangkok-sa-kaeo-siem-reap',
  'sa-kaeo-family-plan','sa-kaeo-pang-sida-butterfly-plan','sa-kaeo-first-timer-guide',
  'sa-kaeo-travel-tips','sa-kaeo-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสระแก้ว"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ปราสาทสด๊กก๊อกธม/เขาฉกรรจ์/ปางสีดา/ละลุ/ตลาดโรงเกลือ/เขาน้อยสีชมพู/ตาพระยา) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/เมล่อน/ตลาด/น้ำตก/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/เมล่อน/ตลาด/น้ำตก/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
