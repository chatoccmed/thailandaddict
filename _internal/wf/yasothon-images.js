export const meta = {
  name: 'yasothon-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Yasothon: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Yasothon city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Yasothon article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พระธาตุก่องข้าวน้อย บ้านสิงห์ท่า วัดมหาธาตุยโสธร สวนพญาแถน ภูถ้ำพระ งานบั้งไฟ) หรือ **Unsplash / Pexels** (อาหารอีสาน/ปลาส้ม/คาเฟ่/ตึกเก่า/ทุ่งนา/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับยโสธร/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดยโสธร — เลือกแลนด์มาร์กเด่น: งานบุญบั้งไฟ หรือ พระธาตุก่องข้าวน้อย หรือ ย่านเมืองเก่าบ้านสิงห์ท่า (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/yasothon.jpg และ astro/public/images/heroes/yasothon.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:yasothon', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'yasothon-isan-food','pla-som-mahachanachai','yasothon-cafe-guide','yasothon-mookata','luk-niang',
  'yasothon-jasmine-rice','yasothon-street-food','yasothon-local-breakfast','yasothon-forest-mushroom','yasothon-souvenir-food','yasothon-local-dessert',
  'yasothon-attractions','phra-that-kong-khao-noi','ban-singha-tha','wat-maha-that-yasothon','phaya-thaen-park',
  'wat-phra-phutthabat-yasothon','phu-tham-phra','ban-na-samai-mon-khit','bun-bang-fai-festival','yasothon-mud-dyed-cloth',
  'yasothon-rice-fields-nature','yasothon-temples-culture',
  'yasothon-1-day-itinerary','yasothon-2d1n-itinerary','yasothon-3d2n-itinerary','yasothon-old-town-cafe-plan','yasothon-bang-fai-plan',
  'yasothon-nature-plan','yasothon-photo-spots-plan','yasothon-ubon-plan','yasothon-roi-et-plan',
  'yasothon-family-plan','yasothon-culture-craft-plan','yasothon-first-timer-guide',
  'yasothon-travel-tips','yasothon-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นยโสธร/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระธาตุก่องข้าวน้อย/บ้านสิงห์ท่า/วัดมหาธาตุ/สวนพญาแถน/ภูถ้ำพระ/บั้งไฟ/หมอนขิด) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ปลาส้ม/คาเฟ่/ตึกเก่า/ทุ่งนา/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ตึกเก่า/ทุ่งนา/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
