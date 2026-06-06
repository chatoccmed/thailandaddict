export const meta = {
  name: 'phetchabun-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phetchabun: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Phetchabun article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น วัดพระธาตุผาซ่อนแก้ว ภูทับเบิก เมืองโบราณศรีเทพ ภูหินร่องกล้า) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเพชรบูรณ์/เขาค้อ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดเพชรบูรณ์ (วัดพระธาตุผาซ่อนแก้ว หรือทะเลหมอกเขาค้อ/ภูทับเบิก ไร่กะหล่ำปลีไล่ไหล่เขา) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/phetchabun.jpg และ astro/public/images/heroes/phetchabun.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:phetchabun', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'phetchabun-food-guide','khao-kho-cafe-guide','phetchabun-tamarind-souvenir','khao-kho-grilled-pork',
  'phu-thap-boek-hmong-food','phetchabun-isan-food','phetchabun-city-noodles','phetchabun-mookata-buffet',
  'phetchabun-local-breakfast',
  'phetchabun-attractions','khao-kho-guide','phu-thap-boek-guide','wat-pha-sorn-kaew','si-thep-ancient-city',
  'phu-hin-rong-kla','khao-kho-viewpoints','khao-kho-flower-fields','khao-kho-memorial','phetchabun-waterfalls',
  'mueang-rat-pho-khun-pha-mueang','phetchabun-city-guide',
  'phetchabun-1-day-itinerary','phetchabun-2d1n-itinerary','phetchabun-3d2n-itinerary','khao-kho-cafe-hopping-plan',
  'phetchabun-sea-of-mist-plan','phetchabun-history-si-thep-plan','phetchabun-photo-spots-plan','khao-kho-weekend-plan',
  'phetchabun-phitsanulok-plan','phetchabun-loei-plan','phetchabun-lopburi-plan','phetchabun-family-plan',
  'phetchabun-budget-plan','phetchabun-first-timer-guide','phetchabun-travel-tips','phetchabun-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเพชรบูรณ์/เขาค้อ"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดผาซ่อนแก้ว/ภูทับเบิก/เขาค้อ/ศรีเทพ/ภูหินร่องกล้า) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศภูเขา-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
