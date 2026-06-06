export const meta = {
  name: 'sukhothai-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Sukhothai: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Sukhothai article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น วัดมหาธาตุ วัดศรีชุม วัดสระศรี ศรีสัชนาลัย อุทยานประวัติศาสตร์) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับสุโขทัย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสุโขทัย (วัดมหาธาตุ/วัดศรีชุม/เจดีย์กลางทุ่งในอุทยานประวัติศาสตร์ พระอาทิตย์ตก) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/sukhothai.jpg และ astro/public/images/heroes/sukhothai.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:sukhothai', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'sukhothai-food-guide','top-sukhothai-noodles','sukhothai-khao-poep','sukhothai-cafe-guide','sukhothai-northern-food',
  'sukhothai-morning-market-food','sukhothai-mookata-buffet','sukhothai-local-breakfast','sukhothai-souvenir-sangkhalok',
  'sukhothai-attractions','sukhothai-historical-park-guide','wat-mahathat-sukhothai','wat-si-chum-guide','wat-sa-si-guide',
  'si-satchanalai-historical-park','ramkhamhaeng-national-park','sangkhalok-kilns-museum','sukhothai-old-city-cycling',
  'sukhothai-loy-krathong-festival','sukhothai-best-temples','sukhothai-new-city-guide',
  'sukhothai-1-day-itinerary','sukhothai-2d1n-itinerary','sukhothai-3d2n-itinerary','sukhothai-cycling-plan',
  'sukhothai-nature-plan','sukhothai-culture-history-plan','sukhothai-photo-spots-plan','sukhothai-si-satchanalai-plan',
  'sukhothai-lampang-plan','sukhothai-phrae-plan','sukhothai-tak-plan','sukhothai-family-plan','sukhothai-budget-plan',
  'sukhothai-first-timer-guide','sukhothai-travel-tips','sukhothai-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสุโขทัย"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดมหาธาตุ/วัดศรีชุม/วัดสระศรี/ศรีสัชนาลัย/รามคำแหง/อุทยานประวัติศาสตร์) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศสุโขทัย-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
