export const meta = {
  name: 'nakhon-nayok-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Nakhon Nayok: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Nakhon Nayok article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น น้ำตกนางรอง น้ำตกสาริกา เขื่อนขุนด่าน อุทยานพระพิฆเนศ) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/น้ำตก/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ดาวน์โหลด Wikimedia ใช้ commons.wikimedia.org/wiki/Special:FilePath/<filename>?width=1600 พร้อม curl -A "ta-bot/1.0" จะเสถียรกว่า upload.wikimedia.org ตรง ๆ
- ต้องเป็นรูปที่ "เกี่ยวกับนครนายก/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -A "ta-bot/1.0" -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดนครนายก (น้ำตกนางรอง/สาริกา หรือเขื่อนขุนด่านปราการชล/อุทยานพระพิฆเนศ) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/nakhon-nayok.jpg และ astro/public/images/heroes/nakhon-nayok.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:nakhon-nayok', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'nakhon-nayok-food-guide','nakhon-nayok-somtam','waterfall-riverside-restaurants','nakhon-nayok-cafe-guide','nakhon-nayok-marian-plum-fruit',
  'nakhon-nayok-banana-souvenir','nakhon-nayok-isan-food','nakhon-nayok-mookata-buffet','nakhon-nayok-local-breakfast',
  'nakhon-nayok-attractions','nang-rong-waterfall','sarika-waterfall','khun-dan-prakan-chon-dam','wang-takrai',
  'ganesha-park-nakhon-nayok','nakhon-nayok-rafting','wat-khao-nang-buat','khao-yai-nakhon-nayok-side','nakhon-nayok-camping',
  'nakhon-nayok-adventure-activities','nakhon-nayok-city-market',
  'nakhon-nayok-1-day-itinerary','nakhon-nayok-2d1n-itinerary','nakhon-nayok-3d2n-itinerary','nakhon-nayok-waterfall-plan',
  'nakhon-nayok-adventure-rafting-plan','nakhon-nayok-cafe-mountain-plan','nakhon-nayok-camping-plan','bangkok-nakhon-nayok-day-trip',
  'nakhon-nayok-khao-yai-plan','nakhon-nayok-prachinburi-plan','nakhon-nayok-saraburi-plan','nakhon-nayok-family-plan',
  'nakhon-nayok-budget-plan','nakhon-nayok-first-timer-guide','nakhon-nayok-travel-tips','nakhon-nayok-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นนครนายก"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (น้ำตกนางรอง/สาริกา/เขื่อนขุนด่าน/วังตะไคร้/อุทยานพระพิฆเนศ/วัดเขานางบวช) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว/กิจกรรม ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศน้ำตก-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
