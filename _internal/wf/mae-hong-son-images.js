export const meta = {
  name: 'mae-hong-son-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Mae Hong Son: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Mae Hong Son article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น ปางอุ๋ง ถ้ำลอด วัดจองคำ พระธาตุดอยกองมู บ้านรักไทย) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับแม่ฮ่องสอน/ปาย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดแม่ฮ่องสอน (ปางอุ๋ง หมอกเหนือทะเลสาบป่าสน หรือวัดจองคำริมหนองจองคำ / ตัวเมืองในหุบเขา) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/mae-hong-son.jpg และ astro/public/images/heroes/mae-hong-son.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:mae-hong-son', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'mae-hong-son-food-guide','top-khao-soi-nam-ngiao-mae-hong-son','mae-hong-son-tai-yai-cuisine','pai-cafe-guide',
  'ban-rak-thai-yunnan-food','ja-bo-noodles-viewpoint','mae-hong-son-morning-market-food','pai-walking-street-food',
  'mae-hong-son-local-breakfast','mae-hong-son-souvenir-food',
  'mae-hong-son-attractions','pai-guide','pang-ung-guide','bua-tong-fields-khun-yuam','tham-lod-cave-guide',
  'ban-rak-thai-guide','wat-chong-kham-chong-klang','phra-that-doi-kong-mu','ban-ja-bo-guide','pai-canyon-viewpoints',
  'mae-hong-son-waterfalls-hot-springs','mae-hong-son-sea-of-mist',
  'mae-hong-son-1-day-itinerary','mae-hong-son-2d1n-itinerary','mae-hong-son-3d2n-itinerary','pai-cafe-hopping-plan',
  'mae-hong-son-nature-plan','mae-hong-son-tai-yai-culture-plan','mae-hong-son-photo-spots-plan','chiang-mai-mae-hong-son-loop',
  'mae-hong-son-chiang-rai-plan','mae-hong-son-lamphun-plan','mae-hong-son-family-plan','mae-hong-son-budget-plan',
  'mae-hong-son-first-timer-guide','mae-hong-son-travel-tips','mae-hong-son-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นแม่ฮ่องสอน/ปาย"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ปางอุ๋ง/ถ้ำลอด/ทุ่งบัวตอง/วัดจองคำ/พระธาตุดอยกองมู/บ้านรักไทย/ปายแคนยอน/บ้านจ่าโบ่) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศแม่ฮ่องสอน-เหนือ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
