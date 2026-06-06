export const meta = {
  name: 'trang-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Trang: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Trang city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Trang article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ถ้ำมรกตเกาะมุก เกาะกระดาน เกาะลิบง พะยูน สถานีรถไฟกันตัง หาดเจ้าไหม หาดปากเมง) หรือ **Unsplash / Pexels** (อาหาร/ติ่มซำ/คาเฟ่/ทะเลอันดามัน/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับตรัง/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดตรัง — เลือกแลนด์มาร์กเด่น: ถ้ำมรกตเกาะมุก หรือ เกาะกระดาน หรือ สถานีรถไฟกันตัง (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/trang.jpg และ astro/public/images/heroes/trang.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:trang', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'trang-moo-yang','trang-dim-sum-tea-house','trang-seafood','trang-southern-food','trang-khanom-jeen',
  'trang-cafe-guide','trang-cake','trang-street-food','trang-local-breakfast','trang-souvenir-food','trang-dessert-cafe',
  'trang-attractions','emerald-cave-koh-mook','koh-kradan','koh-cheuk','koh-libong-dugong',
  'le-khao-kop-cave','trang-old-town-kantang','pak-meng-chang-lang-beach','banthat-mountains-waterfalls','koh-sukorn',
  'chao-mai-national-park','trang-island-hopping',
  'trang-1-day-itinerary','trang-2d1n-itinerary','trang-3d2n-itinerary','trang-island-hopping-plan','trang-food-plan',
  'trang-nature-plan','trang-old-town-cafe-plan','trang-photo-spots-plan','trang-krabi-plan','trang-nakhon-si-thammarat-plan',
  'trang-family-plan','trang-first-timer-guide',
  'trang-travel-tips','trang-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นตรัง/ทะเลอันดามัน/เมืองเก่า"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ถ้ำมรกตเกาะมุก/เกาะกระดาน/เกาะเชือก/เกาะลิบง/ถ้ำเลเขากอบ/สถานีรถไฟกันตัง/หาดปากเมง/หาดเจ้าไหม/เกาะสุกร) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหาร/ติ่มซำ/หมูย่าง/เค้ก/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้/ติ่มซำ/คาเฟ่/ทะเล/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
