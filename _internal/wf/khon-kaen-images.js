export const meta = {
  name: 'khon-kaen-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Khon Kaen: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Khon Kaen city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Khon Kaen article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น บึงแก่นนคร วัดหนองแวง พระมหาธาตุแก่นนคร พิพิธภัณฑ์ไดโนเสาร์ภูเวียง เขื่อนอุบลรัตน์ พระธาตุขามแก่น) หรือ **Unsplash / Pexels** (อาหารอีสาน/ส้มตำ/ไก่ย่าง/หมูกระทะ/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับขอนแก่น/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดขอนแก่น — เลือกแลนด์มาร์กเด่น: วัดหนองแวง พระมหาธาตุแก่นนคร หรือ บึงแก่นนคร หรือ พิพิธภัณฑ์ไดโนเสาร์ภูเวียง (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/khon-kaen.jpg และ astro/public/images/heroes/khon-kaen.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:khon-kaen', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'khon-kaen-isan-food','khon-kaen-grilled-chicken-somtam','khon-kaen-mookata-jimjum','khon-kaen-cafe-guide','khao-niao-road-street-food',
  'khon-kaen-local-breakfast','khon-kaen-noodle-shops','khon-kaen-dessert-cafe','khon-kaen-mum-sausage','khon-kaen-souvenir-food','khon-kaen-night-market',
  'khon-kaen-attractions','bueng-kaen-nakhon','phu-wiang-dinosaur-museum','wat-nong-waeng','ubolratana-dam',
  'phu-kao-phu-phan-kham-national-park','cobra-village-khok-sa-nga','phra-that-kham-kaen','khon-kaen-old-town','khon-kaen-silk-village',
  'khon-kaen-national-museum','wat-thung-setthi',
  'khon-kaen-1-day-itinerary','khon-kaen-2d1n-itinerary','khon-kaen-3d2n-itinerary','khon-kaen-cafe-plan','khon-kaen-nature-plan',
  'khon-kaen-culture-silk-plan','khon-kaen-family-plan','khon-kaen-udon-plan','khon-kaen-korat-plan','khon-kaen-chaiyaphum-plan',
  'khon-kaen-maha-sarakham-plan','khon-kaen-first-timer-guide',
  'khon-kaen-travel-tips','khon-kaen-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นขอนแก่น/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (บึงแก่นนคร/วัดหนองแวง/พระมหาธาตุแก่นนคร/ไดโนเสาร์ภูเวียง/เขื่อนอุบลรัตน์/ภูพานคำ/พระธาตุขามแก่น/หมู่บ้านงูโคกสง่า/ผ้าไหมมัดหมี่) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ส้มตำ/ไก่ย่าง/หมูกระทะ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ส้มตำ/ไก่ย่าง/คาเฟ่/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
