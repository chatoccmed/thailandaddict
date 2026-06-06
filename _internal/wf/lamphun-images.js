export const meta = {
  name: 'lamphun-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Lamphun: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Lamphun article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น วัดพระธาตุหริภุญชัย วัดจามเทวี พิพิธภัณฑ์หริภุญไชย ดอยขุนตาล) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/ลำไย/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับลำพูน/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดลำพูน (วัดพระธาตุหริภุญชัย พระธาตุทรงระฆังสีทอง หรือวัดจามเทวี/เมืองเก่า) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/lamphun.jpg และ astro/public/images/heroes/lamphun.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:lamphun', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'lamphun-food-guide','lamphun-northern-cuisine','lamphun-cafe-guide','lamphun-longan-products','lamphun-khanom-jeen-nam-ngiao',
  'lamphun-old-noodles','lamphun-morning-market-food','lamphun-local-snacks','lamphun-local-breakfast',
  'lamphun-attractions','wat-phra-that-hariphunchai','wat-chamthewi-ku-kut','hariphunchai-national-museum','chamthewi-monument',
  'ku-chang-ku-ma','nong-chang-khuen-weaving-village','doi-khun-tan-national-park','lamphun-old-town-walk','pa-sang-old-town',
  'lamphun-longan-orchards','lamphun-best-temples',
  'lamphun-1-day-itinerary','lamphun-2d1n-itinerary','lamphun-3d2n-itinerary','lamphun-cafe-rice-field-plan',
  'lamphun-weaving-souvenir-plan','lamphun-culture-temples-plan','lamphun-photo-spots-plan','lamphun-doi-khun-tan-plan',
  'chiang-mai-lamphun-day-trip','lamphun-lampang-plan','lamphun-tak-plan','lamphun-family-plan','lamphun-budget-plan',
  'lamphun-first-timer-guide','lamphun-travel-tips','lamphun-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นลำพูน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (วัดพระธาตุหริภุญชัย/วัดจามเทวี/พิพิธภัณฑ์หริภุญไชย/ดอยขุนตาล/กู่ช้างกู่ม้า/ป่าซาง) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/ลำไย/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศเหนือ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
