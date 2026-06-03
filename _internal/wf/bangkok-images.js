export const meta = {
  name: 'bangkok-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Bangkok: city hero + 38 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero banner' },
    { title: 'Articles', detail: 'one hero image per Bangkok article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น วัดพระแก้ว วัดอรุณ วัดโพธิ์ จตุจักร) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับกรุงเทพ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่นจนได้
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของกรุงเทพ (สกายไลน์ริมเจ้าพระยา หรือ วัดอรุณ/เมืองเก่า) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/bangkok.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:bangkok', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'bangkok-food-guide','bangkok-street-food-yaowarat','bangkok-cafe-guide','bangkok-boat-noodles',
  'bangkok-michelin-fine-dining','bangkok-rooftop-bars','bangkok-mookata-buffet','bangkok-khao-gaeng',
  'bangkok-dessert-bakery','bangkok-seafood','bangkok-local-breakfast','bangkok-night-market-food',
  'bangkok-attractions','grand-palace-wat-phra-kaew-guide','wat-arun-guide','wat-pho-guide',
  'rattanakosin-old-town','chatuchak-market-guide','chao-phraya-river-guide','charoenkrung-talat-noi',
  'siam-ratchaprasong-shopping','lumpini-park-guide','bang-krachao-guide','bangkok-floating-markets',
  'bangkok-1-day-itinerary','bangkok-2d1n-itinerary','bangkok-3d2n-itinerary','bangkok-cafe-hopping-plan',
  'bangkok-old-town-temples-plan','bangkok-shopping-plan','bangkok-photo-spots-plan','bangkok-nature-green-plan',
  'bangkok-ayutthaya-day-trip','bangkok-samut-songkhram-plan','bangkok-family-plan','bangkok-first-timer-guide',
  'bangkok-travel-tips','bangkok-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นกรุงเทพ"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดพระแก้ว/วัดอรุณ/วัดโพธิ์/จตุจักร/สวนลุม/บางกระเจ้า/เจริญกรุง) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศกรุงเทพ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
