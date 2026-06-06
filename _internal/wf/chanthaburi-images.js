export const meta = {
  name: 'chanthaburi-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Chanthaburi: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Chanthaburi article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น อาสนวิหารพระนางมารีอา ชุมชนริมน้ำจันทบูร น้ำตกพลิ้ว เขาคิชฌกูฏ ทุ่งโปรงทอง) หรือ **Unsplash / Pexels** (สำหรับอาหาร/ทุเรียน/คาเฟ่/ทะเล/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ดาวน์โหลด Wikimedia ใช้ commons.wikimedia.org/wiki/Special:FilePath/<filename>?width=1600 พร้อม curl -A "ta-bot/1.0" จะเสถียรกว่า upload.wikimedia.org ตรง ๆ
- ต้องเป็นรูปที่ "เกี่ยวกับจันทบุรี/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -A "ta-bot/1.0" -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดจันทบุรี (อาสนวิหารพระนางมารีอา/ชุมชนริมน้ำจันทบูร หรือน้ำตกพลิ้ว/ทุ่งโปรงทอง) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/chanthaburi.jpg และ astro/public/images/heroes/chanthaburi.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:chanthaburi', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'chanthaburi-food-guide','sen-chan-pad-poo','chanthaburi-seafood','chanthaburi-durian-fruit','riverside-community-snacks',
  'chanthaburi-local-dishes','chanthaburi-old-town-cafe','chanthaburi-pepper-souvenir','chanthaburi-local-breakfast',
  'chanthaburi-attractions','chanthaburi-riverside-community','cathedral-immaculate-conception','chanthaburi-gem-market','khao-khitchakut',
  'nam-tok-phlio','chao-lao-laem-sing-beach','khuk-khi-kai-tuek-daeng','king-taksin-shipyard','chanthaburi-fruit-orchards',
  'tung-prong-thong','wat-khao-sukim',
  'chanthaburi-1-day-itinerary','chanthaburi-2d1n-itinerary','chanthaburi-3d2n-itinerary','chanthaburi-cafe-old-town-plan',
  'chanthaburi-nature-plan','chanthaburi-beach-plan','chanthaburi-fruit-season-plan','chanthaburi-photo-spots-plan',
  'chanthaburi-trat-plan','chanthaburi-rayong-plan','chanthaburi-chonburi-plan','chanthaburi-family-plan',
  'chanthaburi-budget-plan','chanthaburi-first-timer-guide','chanthaburi-travel-tips','chanthaburi-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นจันทบุรี"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (อาสนวิหาร/ชุมชนริมน้ำจันทบูร/น้ำตกพลิ้ว/เขาคิชฌกูฏ/ทุ่งโปรงทอง/แหลมสิงห์/ตึกแดง) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/ทุเรียน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
