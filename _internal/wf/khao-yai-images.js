export const meta = {
  name: 'khao-yai-images',
  description: 'Download real licensed images for Khao Yai: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Khao Yai city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Khao Yai article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น อุทยานเขาใหญ่ น้ำตกเหวนรก น้ำตกเหวสุวัต ไร่องุ่นกรานมอนเต้ ปาลิโอ ฟาร์มโชคชัย) หรือ **Unsplash / Pexels** (ภูเขา ป่า น้ำตก ไร่องุ่น คาเฟ่ สเต๊ก ฟาร์มแกะ ทะเลหมอก แคมป์ปิ้ง) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเขาใหญ่/ภูเขา-ป่า/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเขาใหญ่ — เลือกแลนด์มาร์กเด่น: วิวภูเขาเขาใหญ่/ทะเลหมอก หรือ ไร่องุ่นเขาใหญ่ หรือ น้ำตกในอุทยาน (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/khao-yai.jpg และ astro/public/images/heroes/khao-yai.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:khao-yai', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'khaoyai-food-guide','khaoyai-steak-grill','khaoyai-cafe-tour','khaoyai-winery-dining','khaoyai-farm-cafe',
  'khaoyai-italian-european','khaoyai-local-thai-food','khaoyai-night-market','khaoyai-vegan-healthy',
  'khaoyai-dessert-bakery','khaoyai-souvenir-food',
  'khaoyai-attractions','khaoyai-national-park','khaoyai-haew-narok-waterfall','khaoyai-haew-suwat-waterfall',
  'khaoyai-wineries','khaoyai-palio-village','khaoyai-primo-piazza','khaoyai-farm-chokchai','khaoyai-sheep-land',
  'khaoyai-the-bloom-garden','khaoyai-scenical-world','khaoyai-viewpoints','khaoyai-camping',
  'khaoyai-1-day-itinerary','khaoyai-2d1n-itinerary','khaoyai-3d2n-itinerary','khaoyai-bangkok-plan',
  'khaoyai-nature-trip','khaoyai-cafe-winery-tour','khaoyai-family-plan','khaoyai-couple-plan',
  'khaoyai-camping-plan','khaoyai-photo-spots-plan','khaoyai-first-timer-guide',
  'khaoyai-travel-tips','khaoyai-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเขาใหญ่/ภูเขา-ป่า"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (อุทยานเขาใหญ่/น้ำตกเหวนรก/เหวสุวัต/ไร่องุ่นกรานมอนเต้/ปาลิโอ/ฟาร์มโชคชัย/ฟาร์มแกะ) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นสเต๊ก/คาเฟ่/ไร่องุ่น/แคมป์ปิ้ง/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปภูเขา/ป่า/น้ำตก/ไร่องุ่น/คาเฟ่/สเต๊กที่เหมาะกับเขาใหญ่
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
