export const meta = {
  name: 'phetchaburi-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Phetchaburi: city hero + 37 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Phetchaburi article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น พระนครคีรีเขาวัง วัดมหาธาตุ วังบ้านปืน ถ้ำเขาหลวง แก่งกระจาน) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/ทะเล/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเพชรบุรี/ชะอำ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl โดย **ต้องใส่ timeout เสมอ: curl -m 60 --connect-timeout 20 -L -o <path> <url>** เพื่อไม่ให้ค้าง (ห้ามรัน curl ที่ไม่มี -m)
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่น **แต่ลองรวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดเพชรบุรี (พระนครคีรี/เขาวัง บนยอดเขากลางเมือง หรือวัดมหาธาตุวรวิหาร / หาดชะอำ) 1 รูป แนวนอนกว้างสวย
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/phetchaburi.jpg และ astro/public/images/heroes/phetchaburi.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'city:phetchaburi', phase:'Cities' }).catch(()=>{})

phase('Articles')
const ARTICLES = [
  'phetchaburi-food-guide','phetchaburi-thai-desserts','phetchaburi-khao-chae','cha-am-seafood','phetchaburi-old-town-cafe',
  'phetchaburi-old-town-eats','ban-laem-seafood-souvenir','phetchaburi-tanod-palm-sugar','phetchaburi-local-breakfast',
  'phetchaburi-attractions','phra-nakhon-khiri-khao-wang','wat-yai-suwannaram','wat-mahathat-phetchaburi',
  'tham-khao-luang-phetchaburi','cha-am-beach-guide','kaeng-krachan-national-park','phanoen-thung-guide','laem-phak-bia',
  'ram-ratchaniwet-ban-puen-palace','phetchaburi-craft-temples','phetchaburi-old-town-walk',
  'phetchaburi-1-day-itinerary','phetchaburi-2d1n-itinerary','phetchaburi-3d2n-itinerary','phetchaburi-cafe-old-town-plan',
  'kaeng-krachan-nature-plan','phetchaburi-culture-temples-plan','phetchaburi-photo-spots-plan','cha-am-beach-weekend-plan',
  'phetchaburi-prachuap-plan','phetchaburi-ratchaburi-plan','phetchaburi-samut-songkhram-plan','phetchaburi-family-plan',
  'phetchaburi-budget-plan','phetchaburi-first-timer-guide','phetchaburi-travel-tips','phetchaburi-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเพชรบุรี/ชะอำ"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (เขาวัง/วัดมหาธาตุ/วัดใหญ่/วังบ้านปืน/ถ้ำเขาหลวง/แก่งกระจาน/พะเนินทุ่ง/แหลมผักเบี้ย/ชะอำ) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/ขนม/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
