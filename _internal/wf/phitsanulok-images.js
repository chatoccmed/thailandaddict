export const meta = {
  name: 'phitsanulok-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phitsanulok: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Phitsanulok article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น พระพุทธชินราช วัดใหญ่ ภูหินร่องกล้า ทุ่งแสลงหลวง พระราชวังจันทน์) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับพิษณุโลก/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดพิษณุโลก (พระพุทธชินราช วัดใหญ่ หรือริมแม่น้ำน่าน/ภูหินร่องกล้า) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/phitsanulok.jpg และ astro/public/images/heroes/phitsanulok.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:phitsanulok', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'phitsanulok-food-guide','kuaytiao-hoi-kha-phitsanulok','phak-bung-loi-fa','phitsanulok-cafe-guide','phitsanulok-banana-souvenir',
  'phitsanulok-northern-food','phitsanulok-riverside-night-market','phitsanulok-mookata-buffet','phitsanulok-local-breakfast',
  'phitsanulok-attractions','wat-yai-phra-buddha-chinnarat','phitsanulok-nan-riverside','phu-hin-rong-kla-phitsanulok','thung-salaeng-luang',
  'kaeng-sopha-waterfall','chan-palace','sergeant-major-thawee-folk-museum','khao-samo-khaeng','nakhon-thai-mountains',
  'phitsanulok-city-temples','wat-chula-mani',
  'phitsanulok-1-day-itinerary','phitsanulok-2d1n-itinerary','phitsanulok-3d2n-itinerary','phitsanulok-cafe-riverside-plan',
  'phitsanulok-nature-mountains-plan','phitsanulok-culture-temples-plan','phitsanulok-photo-spots-plan','phitsanulok-merit-temple-plan',
  'phitsanulok-sukhothai-plan','phitsanulok-phetchabun-plan','phitsanulok-uttaradit-plan','phitsanulok-family-plan',
  'phitsanulok-budget-plan','phitsanulok-first-timer-guide','phitsanulok-travel-tips','phitsanulok-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นพิษณุโลก"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระพุทธชินราช/วัดใหญ่/ภูหินร่องกล้า/ทุ่งแสลงหลวง/น้ำตกแก่งโสภา/พระราชวังจันทน์/เขาสมอแคลง/วัดจุฬามณี) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
