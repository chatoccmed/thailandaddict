export const meta = {
  name: 'nakhon-si-thammarat-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Nakhon Si Thammarat: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Nakhon Si Thammarat city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Nakhon Si Thammarat article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น วัดพระมหาธาตุนคร พระบรมธาตุเจดีย์ ขนอม คีรีวง น้ำตกกรุงชิง เขาหลวง หนังตะลุง) หรือ **Unsplash / Pexels** (อาหารใต้/คาเฟ่/ทะเล/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับนครศรีธรรมราช/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดนครศรีธรรมราช — เลือกแลนด์มาร์กเด่น: วัดพระมหาธาตุวรมหาวิหาร (พระบรมธาตุเจดีย์) หรือ บ้านคีรีวง หรือ ทะเลขนอม (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/nakhon-si-thammarat.jpg และ astro/public/images/heroes/nakhon-si-thammarat.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:nakhon-si-thammarat', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'nakhon-khanom-jeen','nakhon-southern-curry-rice','nakhon-southern-dishes','nakhon-cafe-guide','khanom-seafood-restaurants',
  'nakhon-roti-cha-chak','nakhon-street-food','nakhon-souvenir-food','nakhon-local-breakfast','nakhon-dessert-cafe','khiriwong-fruit-cafe',
  'nakhon-si-thammarat-attractions','wat-phra-mahathat-woramahawihan','wat-chedi-ai-khai','khanom-pink-dolphins','ban-khiriwong',
  'krung-ching-waterfall','nakhon-old-town-cultural-street','suchart-shadow-puppet-house','laem-talumphuk-pak-phanang','khao-luang-national-park',
  'phrom-lok-waterfall','nakhon-beaches-sichon-thasala',
  'nakhon-1-day-itinerary','nakhon-2d1n-itinerary','nakhon-3d2n-itinerary','nakhon-ai-khai-pilgrimage-plan','nakhon-khiriwong-nature-plan',
  'nakhon-khanom-sea-plan','nakhon-cafe-old-town-plan','nakhon-photo-spots-plan','nakhon-surat-thani-plan','nakhon-krabi-plan',
  'nakhon-family-plan','nakhon-first-timer-guide',
  'nakhon-travel-tips','nakhon-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นนครศรีธรรมราช/เมืองคอน/ทะเล/ภูเขา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดพระมหาธาตุ/ไอ้ไข่วัดเจดีย์/ขนอม/โลมาสีชมพู/คีรีวง/น้ำตกกรุงชิง/เขาหลวง/หนังตะลุง/ปากพนัง/พรหมโลก) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารใต้/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้/ขนมจีน/คาเฟ่/ทะเล/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
