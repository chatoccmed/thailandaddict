export const meta = {
  name: 'phrae-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phrae: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Phrae article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น วัดพระธาตุช่อแฮ คุ้มเจ้าหลวง บ้านวงศ์บุรี แพะเมืองผี วัดจอมสวรรค์) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/ผ้าย้อมคราม/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ดาวน์โหลด Wikimedia ใช้ commons.wikimedia.org/wiki/Special:FilePath/<filename>?width=1600 พร้อม curl -A "ta-bot/1.0" จะเสถียรกว่า upload.wikimedia.org ตรง ๆ
- ต้องเป็นรูปที่ "เกี่ยวกับแพร่/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -A "ta-bot/1.0" -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดแพร่ (วัดพระธาตุช่อแฮ หรือคุ้มเจ้าหลวง/บ้านวงศ์บุรีสีชมพู/แพะเมืองผี) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/phrae.jpg และ astro/public/images/heroes/phrae.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:phrae', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'phrae-food-guide','phrae-northern-cuisine','phrae-old-town-cafe','phrae-khanom-jeen-nam-ngiao','phrae-khao-khaep-souvenir',
  'phrae-sai-ua-khaep-mu','phrae-city-noodles','phrae-mookata-buffet','phrae-local-breakfast',
  'phrae-attractions','wat-phra-that-cho-hae','khum-chao-luang-phrae','ban-wongburi','ban-prathapjai',
  'phae-mueang-phi','phrae-old-town-walk','wat-chom-sawan','wiang-kosai-mae-koeng-waterfall','ban-thung-hong-indigo',
  'phrae-teak-houses','phrae-best-temples',
  'phrae-1-day-itinerary','phrae-2d1n-itinerary','phrae-3d2n-itinerary','phrae-cafe-old-town-plan',
  'phrae-teak-indigo-plan','phrae-culture-temples-plan','phrae-photo-spots-plan','phrae-nature-plan',
  'phrae-nan-plan','phrae-lampang-plan','phrae-phayao-plan','phrae-family-plan',
  'phrae-budget-plan','phrae-first-timer-guide','phrae-travel-tips','phrae-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นแพร่"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดพระธาตุช่อแฮ/คุ้มเจ้าหลวง/บ้านวงศ์บุรี/แพะเมืองผี/วัดจอมสวรรค์/เวียงโกศัย/ทุ่งโฮ้ง) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/ผ้าหม้อห้อม/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศเหนือ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
