export const meta = {
  name: 'koh-kood-images',
  description: 'Download real licensed images for Koh Kood: city hero + 20 article heroes',
  phases: [
    { title: 'City', detail: 'Koh Kood city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Koh Kood article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น เกาะกูด น้ำตกคลองเจ้า หาดอ่าวตะเภา) หรือ **Unsplash / Pexels** (ทะเลใส หาดทรายขาว น้ำตก ดำน้ำ เรือประมง อาหารทะเล คาเฟ่ ป่าเกาะ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเกาะกูด/ทะเลตราด/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเกาะกูด — เลือกแลนด์มาร์กเด่น: หาดอ่าวตะเภาเกาะกูดทรายขาวน้ำใส หรือ น้ำตกคลองเจ้า หรือ ทะเลใสเกาะกูด (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/koh-kood.jpg และ astro/public/images/heroes/koh-kood.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:koh-kood', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'koh-kood-food-guide','koh-kood-seafood','koh-kood-beach-bars','koh-kood-cafe-guide','koh-kood-local-food',
  'koh-kood-attractions','koh-kood-klong-chao-waterfall','koh-kood-klong-yai-kee-waterfall','koh-kood-ao-tapao-beach',
  'koh-kood-ao-phrao-beach','koh-kood-bang-bao-beach','koh-kood-giant-makha-tree','koh-kood-fishing-villages',
  'koh-kood-snorkeling',
  'koh-kood-2d1n-itinerary','koh-kood-3d2n-itinerary','koh-kood-couple-plan','koh-kood-first-timer-guide',
  'koh-kood-travel-tips','koh-kood-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเกาะกูด/ทะเลตราด"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (น้ำตกคลองเจ้า/คลองยายกี่/อ่าวตะเภา/อ่าวพร้าว/ต้นมะค่ายักษ์/อ่าวสลัด) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นอาหารทะเล/คาเฟ่/บาร์/ดำน้ำ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเลใส/หาดทรายขาว/น้ำตก/ดำน้ำ/อาหารทะเลที่เหมาะกับเกาะกูด
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
