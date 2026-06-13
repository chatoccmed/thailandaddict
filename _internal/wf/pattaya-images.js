export const meta = {
  name: 'pattaya-images',
  description: 'Download real licensed images for Pattaya: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Pattaya city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Pattaya article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ปราสาทสัจธรรม สวนนงนุช เขาชีจรรย์ หาดจอมเทียน วอล์กกิ้งสตรีท เกาะล้าน อ่าวพัทยา) หรือ **Unsplash / Pexels** (ทะเล หาด ซีฟู้ด คาเฟ่ รูฟท็อปบาร์ สวนน้ำ บรรยากาศเมืองชายทะเล) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับพัทยา/ทะเลภาคตะวันออก/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของพัทยา — เลือกแลนด์มาร์กเด่น: อ่าวพัทยาวิวเมืองริมทะเล หรือ ปราสาทสัจธรรม หรือ หาดจอมเทียน (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/pattaya.jpg และ astro/public/images/heroes/pattaya.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:pattaya', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'pattaya-food-guide','pattaya-seafood','pattaya-cafe-guide','pattaya-rooftop-bars','pattaya-night-market',
  'pattaya-street-food','pattaya-buffet-restaurants','pattaya-vegan-healthy','pattaya-korean-japanese-food',
  'pattaya-local-thai-food','pattaya-dessert-cafe',
  'pattaya-attractions','pattaya-jomtien-beach','pattaya-sanctuary-of-truth','pattaya-nong-nooch-garden',
  'pattaya-khao-chi-chan','pattaya-big-buddha','pattaya-pratamnak-viewpoint','pattaya-walking-street',
  'pattaya-art-in-paradise','pattaya-tiffany-cabaret-show','pattaya-water-parks','pattaya-temples-culture',
  'pattaya-1-day-itinerary','pattaya-2d1n-itinerary','pattaya-3d2n-itinerary','pattaya-bangkok-plan',
  'pattaya-koh-larn-day-trip','pattaya-family-plan','pattaya-couple-plan','pattaya-nightlife-plan',
  'pattaya-budget-plan','pattaya-photo-spots-plan','pattaya-first-timer-guide','pattaya-rainy-day-plan',
  'pattaya-travel-tips','pattaya-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นพัทยา/ทะเลภาคตะวันออก"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ปราสาทสัจธรรม/สวนนงนุช/เขาชีจรรย์/หาดจอมเทียน/วอล์กกิ้งสตรีท/เกาะล้าน/พระใหญ่เขาพระตำหนัก) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นซีฟู้ด/คาเฟ่/รูฟท็อป/สวนน้ำ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเล/หาด/อาหารทะเล/คาเฟ่ที่เหมาะกับพัทยา
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
