export const meta = {
  name: 'ratchaburi-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Ratchaburi: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Ratchaburi article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น ตลาดน้ำดำเนินสะดวก โอ่งมังกร ถ้ำเขางู เขาแก่นจันทน์ สวนผึ้ง) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/ผลไม้/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ดาวน์โหลด Wikimedia ใช้ commons.wikimedia.org/wiki/Special:FilePath/<filename>?width=1600 พร้อม curl -A "ta-bot/1.0" จะเสถียรกว่า upload.wikimedia.org ตรง ๆ
- ต้องเป็นรูปที่ "เกี่ยวกับราชบุรี/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -A "ta-bot/1.0" -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดราชบุรี (ตลาดน้ำดำเนินสะดวก หรือโอ่งมังกร/สวนผึ้งวิวเขา) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/ratchaburi.jpg และ astro/public/images/heroes/ratchaburi.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:ratchaburi', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'ratchaburi-food-guide','damnoen-saduak-boat-noodles','ratchaburi-old-town-cafe','thai-song-dam-food','damnoen-fruit-orchards-food',
  'ratchaburi-coconut-sweets','suan-phueng-riverside-restaurants','ratchaburi-souvenir','ratchaburi-local-breakfast',
  'ratchaburi-attractions','damnoen-saduak-floating-market','dragon-jar-pottery','suan-phueng','tham-khao-ngu',
  'khao-kaen-chan','ratchaburi-national-museum','ban-khu-bua-weaving','nine-falls-bo-khlueng-hot-spring','ratchaburi-old-town-walk',
  'suan-phueng-sheep-farms','ratchaburi-best-temples',
  'ratchaburi-1-day-itinerary','ratchaburi-2d1n-itinerary','ratchaburi-3d2n-itinerary','ratchaburi-cafe-old-town-plan',
  'suan-phueng-nature-plan','ratchaburi-culture-plan','ratchaburi-photo-spots-plan','damnoen-floating-market-plan',
  'ratchaburi-samut-songkhram-plan','ratchaburi-phetchaburi-plan','ratchaburi-kanchanaburi-plan','ratchaburi-family-plan',
  'ratchaburi-budget-plan','ratchaburi-first-timer-guide','ratchaburi-travel-tips','ratchaburi-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นราชบุรี"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ตลาดน้ำดำเนินสะดวก/โอ่งมังกร/สวนผึ้ง/ถ้ำเขางู/เขาแก่นจันทน์/คูบัว/ฟาร์มแกะ) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/ผลไม้/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
