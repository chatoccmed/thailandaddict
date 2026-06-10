export const meta = {
  name: 'ranong-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Ranong: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Ranong city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Ranong article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น บ่อน้ำร้อนรักษะวาริน เกาะพะยาม น้ำตกหงาว ภูเขาหญ้า ตึกเก่าระนอง จวนเจ้าเมืองระนอง ปากน้ำระนอง) หรือ **Unsplash / Pexels** (อาหารทะเล/หอยนางรม/ติ่มซำ/กาแฟ/น้ำพุร้อน/ทะเล/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับระนอง/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดระนอง — เลือกแลนด์มาร์กเด่น: บ่อน้ำร้อนรักษะวาริน หรือ เกาะพะยาม หรือ ภูเขาหญ้า (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/ranong.jpg และ astro/public/images/heroes/ranong.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:ranong', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'ranong-seafood','ranong-oysters','ranong-southern-food','ranong-dim-sum','ranong-cafe-guide',
  'ranong-local-breakfast','ranong-street-food','ranong-burmese-food','ranong-cashew-nuts','ranong-souvenir-food','ranong-fish-market-food',
  'ranong-attractions','raksawarin-hot-springs','koh-phayam','koh-chang-ranong','ngao-waterfall',
  'ranong-old-town','ranong-governor-mansion','rattanarangsan-palace','phukao-ya-grass-hill','khao-fachi-viewpoint',
  'pak-nam-ranong-border','ranong-mineral-spa',
  'ranong-1-day-itinerary','ranong-2d1n-itinerary','ranong-3d2n-itinerary','koh-phayam-island-plan','ranong-hot-spring-relax-plan',
  'ranong-nature-plan','ranong-old-town-plan','ranong-chumphon-plan','ranong-phang-nga-plan','ranong-surat-plan',
  'ranong-photo-spots-plan','ranong-first-timer-guide',
  'ranong-travel-tips','ranong-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นระนอง/อันดามัน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (บ่อน้ำร้อนรักษะวาริน/เกาะพะยาม/เกาะช้างระนอง/น้ำตกหงาว/ภูเขาหญ้า/เขาฝาชี/ตึกเก่าระนอง/จวนเจ้าเมือง/พระราชวังรัตนรังสรรค์/ปากน้ำระนอง) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารทะเล/หอยนางรม/ติ่มซำ/กาแฟ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารทะเล/หอยนางรม/ติ่มซำ/กาแฟ/น้ำพุร้อน/ทะเลที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
