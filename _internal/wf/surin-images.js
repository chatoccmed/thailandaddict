export const meta = {
  name: 'surin-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Surin: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Surin city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Surin article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ปราสาทศีขรภูมิ ปราสาทตาเมือนธม หมู่บ้านช้างสุรินทร์ ผ้าไหมสุรินทร์ พนมสวาย) หรือ **Unsplash / Pexels** (อาหารอีสาน/ส้มตำ/ขนมจีน/ช้าง/ผ้าไหมทอมือ/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับสุรินทร์/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

// slug-uniqueness guard: existing image slugs + city flag injected via args
const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสุรินทร์ — เลือกแลนด์มาร์กเด่น: ปราสาทศีขรภูมิ หรือ ช้างสุรินทร์ หรือ ผ้าไหมสุรินทร์ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/surin.jpg และ astro/public/images/heroes/surin.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:surin', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'surin-isan-food','surin-khanom-jeen-nam-ya','surin-mookata','surin-cafe-guide','surin-guay-jab-yuan',
  'surin-street-food','surin-local-breakfast','surin-jasmine-rice','surin-garlic-souvenir','surin-souvenir-food','surin-local-dessert',
  'surin-attractions','ban-ta-klang-elephant-village','surin-elephant-festival','prasat-sikhoraphum','prasat-ta-muen-thom',
  'ban-tha-sawang-silk','phanom-sawai-forest-park','huai-saneng-reservoir','chong-chom-border-market','phaya-surin-monument',
  'surin-silk-villages','surin-khmer-temple-trail',
  'surin-1-day-itinerary','surin-2d1n-itinerary','surin-3d2n-itinerary','surin-elephant-culture-plan','surin-khmer-temple-plan',
  'surin-silk-craft-plan','surin-nature-plan','surin-elephant-festival-plan','surin-buriram-temple-plan','surin-sisaket-plan',
  'surin-photo-spots-plan','surin-first-timer-guide',
  'surin-travel-tips','surin-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสุรินทร์/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ปราสาทศีขรภูมิ/ตาเมือนธม/หมู่บ้านช้างบ้านตากลาง/ผ้าไหมบ้านท่าสว่าง/พนมสวาย/ห้วยเสนง/ช่องจอม) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ส้มตำ/ขนมจีน/ช้าง/ผ้าไหม/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ช้าง/ผ้าไหมทอมือ/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
