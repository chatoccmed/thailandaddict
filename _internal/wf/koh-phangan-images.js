export const meta = {
  name: 'koh-phangan-images',
  description: 'Download real licensed images for Koh Phangan: city hero + 30 article heroes',
  phases: [
    { title: 'City', detail: 'Koh Phangan city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Koh Phangan article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น หาดริ้น น้ำตกธารเสด็จ หาดขวด เกาะม้า ท้องศาลา) หรือ **Unsplash / Pexels** (ทะเล/หาด/ดำน้ำ/อาหารทะเล/คาเฟ่/โยคะ/ปาร์ตี้บีช/บรรยากาศเกาะ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเกาะพะงัน/ทะเลอ่าวไทย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเกาะพะงัน — เลือกแลนด์มาร์กเด่น: หาดริ้น หรือ หาดทรายขาวน้ำใสของเกาะพะงัน หรือ เกาะม้าแม่หาด (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/koh-phangan.jpg และ astro/public/images/heroes/koh-phangan.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:koh-phangan', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'koh-phangan-seafood','koh-phangan-cafe-guide','koh-phangan-vegan-health','koh-phangan-beach-bars','koh-phangan-thong-sala-market',
  'koh-phangan-southern-food','koh-phangan-international-food','koh-phangan-coffee-roasters','koh-phangan-local-dessert',
  'koh-phangan-attractions','haad-rin-beach','than-sadet-waterfall','bottle-beach-haad-khuat','koh-ma-mae-haad',
  'phaeng-waterfall-viewpoint','koh-phangan-west-beaches','koh-phangan-snorkeling-diving','koh-phangan-viewpoints','koh-phangan-waterfalls',
  'koh-phangan-full-moon-guide','koh-phangan-3d2n-itinerary','koh-phangan-4d3n-itinerary','koh-phangan-wellness-yoga-plan','koh-phangan-quiet-north-plan',
  'koh-phangan-island-hopping-plan','koh-phangan-couple-plan','koh-phangan-budget-backpacker-plan','koh-phangan-first-timer-guide',
  'koh-phangan-travel-tips','koh-phangan-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเกาะพะงัน/ทะเลอ่าวไทย"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หาดริ้น/ธารเสด็จ/หาดขวด/เกาะม้า/น้ำตกแพง) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นอาหารทะเล/คาเฟ่/วีแกน/ดำน้ำ/ปาร์ตี้บีช/โยคะ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเล/หาด/อาหารทะเล/คาเฟ่/ดำน้ำที่เหมาะกับเกาะอ่าวไทย
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
