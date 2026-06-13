export const meta = {
  name: 'koh-chang-images',
  description: 'Download real licensed images for Koh Chang: city hero + 26 article heroes',
  phases: [
    { title: 'City', detail: 'Koh Chang city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Koh Chang article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น หาดทรายขาวเกาะช้าง น้ำตกคลองพลู บางเบ้า หาดไก่แบ้) หรือ **Unsplash / Pexels** (ทะเล หาด ดำน้ำ อาหารทะเล คาเฟ่ น้ำตก เรือประมง บรรยากาศเกาะ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเกาะช้าง/ทะเลตราด/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเกาะช้าง — เลือกแลนด์มาร์กเด่น: หาดทรายขาวเกาะช้าง หรือ หมู่บ้านประมงบางเบ้า หรือ วิวเกาะช้างจากจุดชมวิว (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/koh-chang.jpg และ astro/public/images/heroes/koh-chang.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:koh-chang', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'koh-chang-food-guide','koh-chang-seafood','koh-chang-beach-bars','koh-chang-cafe-guide','koh-chang-bang-bao-food',
  'koh-chang-night-market','koh-chang-local-thai-food',
  'koh-chang-attractions','koh-chang-white-sand-beach','koh-chang-klong-prao-beach','koh-chang-kai-bae-beach',
  'koh-chang-lonely-beach','koh-chang-bang-bao-village','koh-chang-klong-plu-waterfall','koh-chang-than-mayom-waterfall',
  'koh-chang-snorkeling-islands','koh-chang-viewpoints',
  'koh-chang-2d1n-itinerary','koh-chang-3d2n-itinerary','koh-chang-island-hopping-plan','koh-chang-bangkok-plan',
  'koh-chang-family-plan','koh-chang-couple-plan','koh-chang-first-timer-guide',
  'koh-chang-travel-tips','koh-chang-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเกาะช้าง/ทะเลตราด"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หาดทรายขาว/คลองพร้าว/ไก่แบ้/โลนลีบีช/บางเบ้า/น้ำตกคลองพลู/ธารมะยม) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นอาหารทะเล/คาเฟ่/บาร์/ดำน้ำ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเล/หาด/อาหารทะเล/คาเฟ่/ดำน้ำที่เหมาะกับเกาะช้าง
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
