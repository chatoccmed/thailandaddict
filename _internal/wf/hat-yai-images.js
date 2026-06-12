export const meta = {
  name: 'hat-yai-images',
  description: 'Download real licensed images for Hat Yai: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Hat Yai city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Hat Yai article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น สวนสาธารณะหาดใหญ่/เจ้าแม่กวนอิม ตลาดกิมหยง ตลาดน้ำคลองแห วัดหาดใหญ่ใน น้ำตกโตนงาช้าง เมืองเก่าสงขลา หาดสมิหลา) หรือ **Unsplash / Pexels** (อาหารไก่ทอด/ติ่มซำ/ซีฟู้ด/ตลาดกลางคืน/คาเฟ่/ช้อปปิ้ง/บรรยากาศเมือง) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับหาดใหญ่/สงขลา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของหาดใหญ่ — เลือกแลนด์มาร์กเด่น: เจ้าแม่กวนอิม/พระพุทธมงคลมหาราชสวนสาธารณะหาดใหญ่ หรือ เคเบิลคาร์หาดใหญ่ หรือ เมืองหาดใหญ่ยามค่ำ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/hat-yai.jpg และ astro/public/images/heroes/hat-yai.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:hat-yai', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'hat-yai-fried-chicken','hat-yai-dim-sum','hat-yai-chicken-rice','hat-yai-southern-food','hat-yai-chinese-food',
  'hat-yai-cafe-guide','hat-yai-night-market-food','hat-yai-seafood','hat-yai-local-breakfast','hat-yai-souvenir-food','hat-yai-dessert-sweets',
  'hat-yai-attractions','hat-yai-municipal-park-cable-car','kim-yong-market','khlong-hae-floating-market','wat-hat-yai-nai',
  'ton-nga-chang-waterfall','hat-yai-asean-night-bazaar','hat-yai-shopping-guide','hat-yai-shrines-mu','hat-yai-street-art-museums',
  'songkhla-old-town-trip','samila-beach-trip',
  'hat-yai-1-day-itinerary','hat-yai-2d1n-itinerary','hat-yai-3d2n-itinerary','hat-yai-food-crawl-plan','hat-yai-shopping-plan',
  'hat-yai-mu-temple-plan','hat-yai-songkhla-plan','hat-yai-nature-waterfall-plan','hat-yai-family-plan',
  'hat-yai-malaysia-shopper-plan','hat-yai-nightlife-plan','hat-yai-first-timer-guide',
  'hat-yai-travel-tips','hat-yai-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นหาดใหญ่/สงขลา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (สวนสาธารณะหาดใหญ่/เจ้าแม่กวนอิม/ตลาดกิมหยง/คลองแห/วัดหาดใหญ่ใน/โตนงาช้าง/เมืองเก่าสงขลา/หาดสมิหลา) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นไก่ทอด/ติ่มซำ/ซีฟู้ด/ตลาดกลางคืน/คาเฟ่/ช้อป/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/ตลาด/เมือง/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
