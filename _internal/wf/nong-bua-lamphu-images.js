export const meta = {
  name: 'nong-bua-lamphu-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Nong Bua Lamphu: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Nong Bua Lamphu city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Nong Bua Lamphu article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น วัดถ้ำกลองเพล ภูเก้า-ภูพานคำ อ่างเก็บน้ำอุบลรัตน์ ศาลสมเด็จพระนเรศวร ภาพเขียนสีภูผายา) หรือ **Unsplash / Pexels** (อาหารอีสาน/ปลาเผา/ผ้าทอ/อ่างเก็บน้ำ/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับหนองบัวลำภู/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดหนองบัวลำภู — เลือกแลนด์มาร์กเด่น: วัดถ้ำกลองเพล หรือ อ่างเก็บน้ำอุบลรัตน์ฝั่งภูพานคำ หรือ ภูเก้า-ภูพานคำ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/nong-bua-lamphu.jpg และ astro/public/images/heroes/nong-bua-lamphu.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:nong-bua-lamphu', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'nong-bua-lamphu-isan-food','nong-bua-lamphu-riverside-fish','nong-bua-lamphu-cafe-guide','nong-bua-lamphu-mookata','nong-bua-lamphu-noodles',
  'nong-bua-lamphu-khao-jee','nong-bua-lamphu-street-food','nong-bua-lamphu-local-breakfast','nong-bua-lamphu-forest-veggies','nong-bua-lamphu-souvenir-food','nong-bua-lamphu-local-dessert',
  'nong-bua-lamphu-attractions','wat-tham-klong-phen','phu-kao-phu-phan-kham-park','ubolratana-phu-phan-kham','san-somdet-phra-naresuan',
  'nong-bua-lake','thao-to-waterfall','luang-pu-khao-museum','phu-pha-ya-rock-art','nong-bua-lamphu-weaving',
  'nong-bua-lamphu-temples-culture','nong-bua-lamphu-nature',
  'nong-bua-lamphu-1-day-itinerary','nong-bua-lamphu-2d1n-itinerary','nong-bua-lamphu-3d2n-itinerary','nong-bua-lamphu-temple-plan','nong-bua-lamphu-nature-plan',
  'nong-bua-lamphu-lake-chill-plan','nong-bua-lamphu-photo-spots-plan','nong-bua-lamphu-udon-plan','nong-bua-lamphu-loei-plan',
  'nong-bua-lamphu-khon-kaen-plan','nong-bua-lamphu-family-plan','nong-bua-lamphu-first-timer-guide',
  'nong-bua-lamphu-travel-tips','nong-bua-lamphu-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นหนองบัวลำภู/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดถ้ำกลองเพล/ภูเก้า-ภูพานคำ/อ่างเก็บน้ำอุบลรัตน์/ศาลสมเด็จพระนเรศวร/ภาพเขียนสีภูผายา/น้ำตกเฒ่าโต้) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ปลาเผา/ผ้าทอ/อ่างเก็บน้ำ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ผ้าทอ/อ่างเก็บน้ำ/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
