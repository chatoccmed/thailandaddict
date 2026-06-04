export const meta = {
  name: 'krabi-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Krabi: city hero + 38 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero banner' },
    { title: 'Articles', detail: 'one hero image per Krabi article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น เรลเลย์ อ่าวนาง เกาะพีพี วัดถ้ำเสือ สระมรกต เขาขนาบน้ำ) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับกระบี่/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจว่าไฟล์ > 15KB (ls -l). ถ้าเล็ก/พัง ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน ห้ามรอ curl ไม่มี timeout)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของกระบี่ (เขาหินปูนกลางทะเล/เรลเลย์/อ่าวนาง/ทะเลแหวก) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/krabi.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:krabi', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'krabi-food-guide','krabi-seafood','krabi-southern-food','krabi-khanom-jeen',
  'krabi-roti-tea','krabi-cafe-guide','krabi-aonang-dining','krabi-local-breakfast',
  'krabi-mookata-buffet','krabi-khao-gaeng-tai','krabi-street-food-markets','krabi-dessert-cafe',
  'krabi-attractions','ao-nang-beach-guide','railay-beach-guide','four-islands-tour',
  'krabi-phi-phi-tour','koh-lanta-guide','wat-tham-suea-guide','emerald-pool-hot-spring',
  'khao-khanab-nam','krabi-rock-climbing','krabi-town-guide','krabi-island-snorkel-tours',
  'krabi-1-day-itinerary','krabi-2d1n-itinerary','krabi-3d2n-itinerary','krabi-nature-plan',
  'krabi-island-plan','krabi-aonang-railay-plan','krabi-cafe-town-plan','krabi-photo-spots-plan',
  'krabi-phuket-plan','krabi-trang-plan','krabi-family-plan','krabi-first-timer-guide',
  'krabi-travel-tips','krabi-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นกระบี่"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (เรลเลย์/อ่าวนาง/เกาะพีพี/เกาะลันตา/วัดถ้ำเสือ/สระมรกต/เขาขนาบน้ำ/ทะเลแหวก) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศกระบี่-ทะเลไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (ถ้าหาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
