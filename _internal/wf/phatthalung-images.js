export const meta = {
  name: 'phatthalung-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phatthalung: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Phatthalung city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Phatthalung article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ทะเลน้อยบัวแดง เขาอกทะลุ หาดลำปำ เขาปู่เขาย่า วัดเขียนบางแก้ว สะพานเอกชัย) หรือ **Unsplash / Pexels** (อาหารใต้/ข้าวยำ/ขนมจีน/นาข้าว/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับพัทลุง/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดพัทลุง — เลือกแลนด์มาร์กเด่น: ทะเลน้อยบัวแดง หรือ เขาอกทะลุ หรือ หาดลำปำ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/phatthalung.jpg และ astro/public/images/heroes/phatthalung.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:phatthalung', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'phatthalung-southern-food','phatthalung-khao-yam','phatthalung-cafe-guide','phatthalung-kaeng-tai-pla','phatthalung-khanom-jeen',
  'phatthalung-lake-seafood','phatthalung-sangyod-rice','phatthalung-roti-cha-chak','phatthalung-local-breakfast','phatthalung-souvenir-food','phatthalung-local-dessert',
  'phatthalung-attractions','thale-noi','khao-ok-thalu','lampam-beach','khao-pu-khao-ya',
  'phairo-waterfall','wang-chao-mueang-phatthalung','wat-khian-bang-kaeo','ekkachai-bridge','nang-talung-manora',
  'phatthalung-old-town','phatthalung-rice-fields-buffalo',
  'phatthalung-1-day-itinerary','phatthalung-2d1n-itinerary','phatthalung-3d2n-itinerary','phatthalung-nature-plan','phatthalung-cafe-rice-field-plan',
  'phatthalung-culture-plan','phatthalung-photo-spots-plan','phatthalung-songkhla-plan','phatthalung-trang-plan',
  'phatthalung-family-plan','phatthalung-thale-noi-sunrise-plan','phatthalung-first-timer-guide',
  'phatthalung-travel-tips','phatthalung-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นพัทลุง/ภาคใต้"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ทะเลน้อย/เขาอกทะลุ/หาดลำปำ/เขาปู่เขาย่า/น้ำตกไพรวัลย์/วัดเขียนบางแก้ว/สะพานเอกชัย) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารใต้/ข้าวยำ/ขนมจีน/นาข้าว/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้/นาข้าว/คาเฟ่/ทะเลสาบที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
