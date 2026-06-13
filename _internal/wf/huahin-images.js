export const meta = {
  name: 'huahin-images',
  description: 'Download real licensed images for Hua Hin: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Hua Hin city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Hua Hin article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น สถานีรถไฟหัวหิน เขาตะเกียบ วัดห้วยมงคล เขาสามร้อยยอด ถ้ำพระยานคร ไร่องุ่นมอนซูน หาดหัวหิน) หรือ **Unsplash / Pexels** (ทะเล หาด ซีฟู้ด คาเฟ่ ไร่องุ่น สวนน้ำ บรรยากาศเมืองตากอากาศ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับหัวหิน/ทะเลอ่าวไทย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของหัวหิน — เลือกแลนด์มาร์กเด่น: สถานีรถไฟหัวหิน หรือ หาดหัวหินริมทะเล หรือ เขาตะเกียบ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/huahin.jpg และ astro/public/images/heroes/huahin.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:huahin', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'huahin-food-guide','huahin-seafood','huahin-cafe-guide','huahin-night-market','huahin-cicada-market',
  'huahin-rooftop-bars','huahin-street-food','huahin-vegan-healthy','huahin-international-food',
  'huahin-local-thai-food','huahin-dessert-cafe',
  'huahin-attractions','huahin-beach','huahin-railway-station','huahin-khao-takiab','huahin-plearn-wan',
  'huahin-santorini-park','huahin-vana-nava-waterpark','huahin-swiss-sheep-farm','huahin-monsoon-valley-vineyard',
  'huahin-wat-huay-mongkol','huahin-khao-sam-roi-yot','huahin-pa-la-u-waterfall','huahin-viewpoint',
  'huahin-1-day-itinerary','huahin-2d1n-itinerary','huahin-3d2n-itinerary','huahin-bangkok-plan',
  'huahin-sam-roi-yot-plan','huahin-family-plan','huahin-couple-plan','huahin-cafe-tour-plan',
  'huahin-budget-plan','huahin-photo-spots-plan','huahin-first-timer-guide',
  'huahin-travel-tips','huahin-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นหัวหิน/ทะเลอ่าวไทย"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (สถานีรถไฟหัวหิน/เขาตะเกียบ/วัดห้วยมงคล/เขาสามร้อยยอด/ถ้ำพระยานคร/ไร่องุ่นมอนซูน/น้ำตกป่าละอู/เพลินวาน/ซานโตรินี) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นซีฟู้ด/คาเฟ่/รูฟท็อป/สวนน้ำ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเล/หาด/อาหารทะเล/คาเฟ่/ไร่องุ่นที่เหมาะกับหัวหิน
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
