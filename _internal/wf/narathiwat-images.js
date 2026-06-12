export const meta = {
  name: 'narathiwat-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Narathiwat: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Narathiwat city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Narathiwat article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พระตำหนักทักษิณ หาดนราทัศน์ มัสยิด 300 ปี ป่าพรุโต๊ะแดง น้ำตกปาโจ เรือกอและ) หรือ **Unsplash / Pexels** (อาหารมลายู/ข้าวยำ/โรตี/ทะเล/ป่าพรุ/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับนราธิวาส/ชายแดนใต้/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดนราธิวาส — เลือกแลนด์มาร์กเด่น: มัสยิด 300 ปี หรือ หาดนราทัศน์เรือกอและ หรือ พระตำหนักทักษิณราชนิเวศน์ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/narathiwat.jpg และ astro/public/images/heroes/narathiwat.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:narathiwat', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'narathiwat-southern-malay-food','narathiwat-khao-yam','narathiwat-nasi-dagae','narathiwat-kai-kolae','narathiwat-cafe-guide',
  'narathiwat-seafood','narathiwat-roti-tea','narathiwat-budu','narathiwat-malay-dessert','narathiwat-local-breakfast','narathiwat-souvenir-food',
  'narathiwat-attractions','taksin-ratchaniwet-palace','narathat-beach','wadi-al-husen-mosque','toh-daeng-peat-swamp',
  'sungai-kolok-border','budo-sungai-padi-pacho-waterfall','ao-manao-khao-tanyong','yakang-market','narathiwat-kolae-boats',
  'narathiwat-malay-culture','narathiwat-beaches-nature',
  'narathiwat-1-day-itinerary','narathiwat-2d1n-itinerary','narathiwat-3d2n-itinerary','narathiwat-nature-plan','narathiwat-food-plan',
  'narathiwat-border-plan','narathiwat-photo-spots-plan','narathiwat-pattani-plan','narathiwat-yala-plan',
  'narathiwat-family-plan','narathiwat-culture-mosque-plan','narathiwat-first-timer-guide',
  'narathiwat-travel-tips','narathiwat-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นนราธิวาส/ชายแดนใต้"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระตำหนักทักษิณ/หาดนราทัศน์/มัสยิด300ปี/ป่าพรุโต๊ะแดง/น้ำตกปาโจ/อ่าวมะนาวเขาตันหยง/เรือกอและ) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารมลายู/ข้าวยำ/โรตี/ทะเล/ป่าพรุ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้-มลายู/ทะเล/มัสยิด/ป่าพรุที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
