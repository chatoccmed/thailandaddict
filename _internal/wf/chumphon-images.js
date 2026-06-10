export const meta = {
  name: 'chumphon-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Chumphon: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Chumphon city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Chumphon article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น หาดทรายรี ศาลกรมหลวงชุมพร เรือรบหลวงชุมพร หมู่เกาะชุมพร หาดทุ่งวัวแล่น อุโมงค์ต้นไม้ปะทิว) หรือ **Unsplash / Pexels** (อาหารทะเล/อาหารใต้/กาแฟ/คาเฟ่/ทะเล/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับชุมพร/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดชุมพร — เลือกแลนด์มาร์กเด่น: หาดทรายรีกับเรือรบหลวงชุมพร หรือ หมู่เกาะชุมพร หรือ อุโมงค์ต้นไม้ปะทิว (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/chumphon.jpg และ astro/public/images/heroes/chumphon.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:chumphon', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'chumphon-seafood','chumphon-southern-food','chumphon-khanom-jeen','chumphon-robusta-coffee','chumphon-cafe-guide',
  'chumphon-local-breakfast','chumphon-street-food','chumphon-pla-tu','chumphon-dessert-cafe','chumphon-souvenir-food','chumphon-fruit-durian',
  'chumphon-attractions','sai-ree-beach','kromluang-chumphon-shrine','chumphon-islands-diving','mu-ko-chumphon-national-park',
  'pak-nam-chumphon','thung-wua-laen-beach','arunothai-beach','pathio-tree-tunnel','khao-dinso-viewpoint',
  'wat-khao-chedi','chumphon-robusta-farm',
  'chumphon-1-day-itinerary','chumphon-2d1n-itinerary','chumphon-3d2n-itinerary','chumphon-beach-island-plan','chumphon-cafe-coffee-plan',
  'chumphon-koh-tao-gateway-plan','chumphon-ranong-plan','chumphon-prachuap-coastal-plan','chumphon-surat-plan','chumphon-photo-spots-plan',
  'chumphon-family-plan','chumphon-first-timer-guide',
  'chumphon-travel-tips','chumphon-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นชุมพร/ทะเลใต้"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หาดทรายรี/ศาลกรมหลวง/เรือรบหลวงชุมพร/หมู่เกาะชุมพร/หาดทุ่งวัวแล่น/อุโมงค์ต้นไม้ปะทิว/เขาดินสอ/ปากน้ำชุมพร/วัดเขาเจดีย์) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารทะเล/อาหารใต้/กาแฟ/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารทะเล/อาหารใต้/กาแฟ/คาเฟ่/ทะเล/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
