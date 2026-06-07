export const meta = {
  name: 'phayao-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phayao: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Phayao article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น กว๊านพะเยา วัดติโลกอาราม วัดศรีโคมคำ วัดอนาลโย ดอยภูลังกา วัดนันตาราม) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ดาวน์โหลด Wikimedia ใช้ commons.wikimedia.org/wiki/Special:FilePath/<filename>?width=1600 พร้อม curl -A "ta-bot/1.0" จะเสถียรกว่า upload.wikimedia.org ตรง ๆ
- ต้องเป็นรูปที่ "เกี่ยวกับพะเยา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -A "ta-bot/1.0" -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดพะเยา (กว๊านพะเยายามพระอาทิตย์ตก หรือวัดติโลกอารามกลางน้ำ/วัดศรีโคมคำ) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/phayao.jpg และ astro/public/images/heroes/phayao.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:phayao', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'phayao-food-guide','phayao-northern-cuisine','kwan-phayao-lakeside-cafe','kwan-phayao-freshwater-fish','phayao-khanom-jeen-nam-ngiao',
  'phayao-tai-lue-food','phayao-sai-ua-khaep-mu','phayao-mookata-buffet','phayao-local-breakfast',
  'phayao-attractions','kwan-phayao','wat-tilok-aram','wat-sri-khom-kham','wat-analayo',
  'doi-phu-langka','phu-sang-national-park','wat-nantaram','phayao-old-town','chiang-kham-tai-lue-village',
  'phayao-sunset-cycling','phayao-best-temples',
  'phayao-1-day-itinerary','phayao-2d1n-itinerary','phayao-3d2n-itinerary','phayao-cafe-lakeside-plan',
  'phayao-nature-plan','phayao-culture-temples-plan','phayao-photo-spots-plan','phayao-sunset-plan',
  'phayao-chiang-rai-plan','phayao-lampang-plan','phayao-nan-plan','phayao-family-plan',
  'phayao-budget-plan','phayao-first-timer-guide','phayao-travel-tips','phayao-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นพะเยา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (กว๊านพะเยา/วัดติโลกอาราม/วัดศรีโคมคำ/วัดอนาลโย/ดอยภูลังกา/ภูซาง/วัดนันตาราม) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศเหนือ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
