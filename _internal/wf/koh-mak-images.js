export const meta = {
  name: 'koh-mak-images',
  description: 'Download real licensed images for Koh Mak: city hero + 18 article heroes',
  phases: [
    { title: 'City', detail: 'Koh Mak city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Koh Mak article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น เกาะหมาก หาดอ่าวเก๋า เกาะขาม) หรือ **Unsplash / Pexels** (ทะเลใส หาดทรายขาว จักรยานริมทะเล ดำน้ำ เรือ อาหารทะเล คาเฟ่ สวนมะพร้าว) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเกาะหมาก/ทะเลตราด/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเกาะหมาก — เลือกแลนด์มาร์กเด่น: หาดอ่าวเก๋าเกาะหมากทรายขาวน้ำใส หรือ ทะเลใสเกาะหมาก หรือ จักรยานริมหาด (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/koh-mak.jpg และ astro/public/images/heroes/koh-mak.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:koh-mak', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'koh-mak-food-guide','koh-mak-seafood','koh-mak-beach-bars','koh-mak-cafe-guide','koh-mak-local-food',
  'koh-mak-attractions','koh-mak-ao-kao-beach','koh-mak-ao-suan-yai-beach','koh-mak-snorkeling','koh-mak-cycling',
  'koh-mak-koh-kham','koh-mak-viewpoints',
  'koh-mak-2d1n-itinerary','koh-mak-3d2n-itinerary','koh-mak-couple-plan','koh-mak-first-timer-guide',
  'koh-mak-travel-tips','koh-mak-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเกาะหมาก/ทะเลตราด"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หาดอ่าวเก๋า/อ่าวสวนใหญ่/เกาะขาม) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นอาหารทะเล/คาเฟ่/บาร์/ดำน้ำ/ปั่นจักรยาน/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเลใส/หาดทรายขาว/จักรยานริมทะเล/ดำน้ำ/อาหารทะเลที่เหมาะกับเกาะหมาก
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
