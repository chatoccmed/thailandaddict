export const meta = {
  name: 'samut-songkhram-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Samut Songkhram: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Samut Songkhram article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น ตลาดร่มหุบ ตลาดน้ำอัมพวา ค่ายบางกุ้ง ดอนหอยหลอด) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/หิ่งห้อย/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ดาวน์โหลด Wikimedia ใช้ commons.wikimedia.org/wiki/Special:FilePath/<filename>?width=1600 พร้อม curl -A "ta-bot/1.0" จะเสถียรกว่า upload.wikimedia.org ตรง ๆ
- ต้องเป็นรูปที่ "เกี่ยวกับสมุทรสงคราม/แม่กลอง/อัมพวา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -A "ta-bot/1.0" -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสมุทรสงคราม (ตลาดร่มหุบรถไฟ หรือตลาดน้ำอัมพวา/ค่ายบางกุ้งโบสถ์ปรกโพธิ์) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/samut-songkhram.jpg และ astro/public/images/heroes/samut-songkhram.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:samut-songkhram', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'samut-songkhram-food-guide','don-hoi-lot-seafood','amphawa-floating-market-food','mae-klong-mackerel','amphawa-riverside-cafe',
  'mae-klong-coconut-sugar-sweets','mae-klong-pomelo-lychee','samut-songkhram-souvenir','mae-klong-market-eats',
  'samut-songkhram-attractions','maeklong-railway-market','amphawa-floating-market','king-rama-2-memorial-park','wat-bang-kung',
  'don-hoi-lot','amphawa-firefly-boat','tha-kha-floating-market','mae-klong-coconut-sugar-farm','wat-bang-khae-noi',
  'mae-klong-riverside-temples','mae-klong-salt-fields',
  'samut-songkhram-1-day-itinerary','samut-songkhram-2d1n-itinerary','samut-songkhram-3d2n-itinerary','amphawa-cafe-plan',
  'samut-songkhram-nature-plan','samut-songkhram-culture-plan','samut-songkhram-photo-spots-plan','amphawa-weekend-plan',
  'samut-songkhram-ratchaburi-plan','samut-songkhram-phetchaburi-plan','samut-songkhram-samut-sakhon-plan','samut-songkhram-family-plan',
  'samut-songkhram-budget-plan','samut-songkhram-first-timer-guide','samut-songkhram-travel-tips','samut-songkhram-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสมุทรสงคราม/แม่กลอง/อัมพวา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ตลาดร่มหุบ/ตลาดน้ำอัมพวา/ค่ายบางกุ้ง/ดอนหอยหลอด/อุทยาน ร.2/นาเกลือ) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/หิ่งห้อย/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
