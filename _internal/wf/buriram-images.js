export const meta = {
  name: 'buriram-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Buriram: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Buriram city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Buriram article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ปราสาทพนมรุ้ง ปราสาทเมืองต่ำ ช้างอารีนา เขากระโดง วัดเขาอังคาร) หรือ **Unsplash / Pexels** (อาหารอีสาน/ส้มตำ/หมูกระทะ/กุ้ง/คาเฟ่/สนามฟุตบอล/สนามแข่งรถ/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับบุรีรัมย์/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

// slug-uniqueness guard: existing image slugs + city flag injected via args
const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดบุรีรัมย์ — เลือกแลนด์มาร์กเด่น: ปราสาทพนมรุ้ง หรือ ปราสาทเมืองต่ำ หรือ ช้างอารีนา (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/buriram.jpg และ astro/public/images/heroes/buriram.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:buriram', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'buriram-isan-food','prakhon-chai-kung-jom','buriram-mookata','buriram-cafe-guide','buriram-noodle-shops',
  'buriram-street-food','buriram-local-breakfast','buriram-local-dessert','prakhon-chai-khanom-jeen','buriram-souvenir-food','buriram-stadium-eats',
  'buriram-attractions','phanom-rung-historical-park','prasat-muang-tam','chang-arena-buriram','chang-international-circuit',
  'khao-kradong-volcano','play-la-ploen-buriram','huai-chorakhe-mak-reservoir','wat-khao-angkhan','phanom-rung-sun-alignment',
  'buriram-old-town-walk','buriram-volcano-trail',
  'buriram-1-day-itinerary','buriram-2d1n-itinerary','buriram-3d2n-itinerary','buriram-temple-circuit-plan','buriram-football-weekend-plan',
  'buriram-nature-plan','buriram-photo-spots-plan','buriram-korat-temple-plan','buriram-surin-plan','buriram-khon-kaen-plan',
  'buriram-family-plan','buriram-first-timer-guide',
  'buriram-travel-tips','buriram-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นบุรีรัมย์/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พนมรุ้ง/เมืองต่ำ/ช้างอารีนา/สนามช้างเซอร์กิต/เขากระโดง/วัดเขาอังคาร/เพลาเพลิน/ห้วยจระเข้มาก) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ส้มตำ/หมูกระทะ/กุ้งจ่อม/ขนมจีน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/คาเฟ่/สนามกีฬาที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
