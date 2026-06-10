export const meta = {
  name: 'mukdahan-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Mukdahan: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Mukdahan city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Mukdahan article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น หอแก้วมุกดาหาร ภูผาเทิบ วัดภูมโนรมย์พญานาค สะพานมิตรภาพ2 แก่งกะเบา ตลาดอินโดจีน ริมโขงมุกดาหาร) หรือ **Unsplash / Pexels** (อาหารอีสาน/ปลาแม่น้ำ/ผู้ไทย/เวียดนาม/คาเฟ่/แม่น้ำโขง/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับมุกดาหาร/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดมุกดาหาร — เลือกแลนด์มาร์กเด่น: หอแก้วมุกดาหาร หรือ ภูผาเทิบ หรือ วัดภูมโนรมย์ (พญานาค) (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/mukdahan.jpg และ astro/public/images/heroes/mukdahan.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:mukdahan', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'mukdahan-isan-food','mukdahan-mekong-fish','mukdahan-phu-tai-food','mukdahan-vietnamese-food','mukdahan-cafe-guide',
  'mukdahan-local-breakfast','mukdahan-mookata','mukdahan-indochina-market-food','mukdahan-dessert-cafe','mukdahan-souvenir-food','mukdahan-night-market',
  'mukdahan-attractions','ho-kaeo-mukdahan','indochina-market','phu-pha-thoep-national-park','wat-phu-manorom',
  'thai-lao-friendship-bridge-2','kaeng-kabao','nong-sung-phu-tai','mukdahan-mekong-promenade','wat-si-mongkhon-tai',
  'wat-roi-phra-phutthabat-phu-manorom','savannakhet-day-trip',
  'mukdahan-1-day-itinerary','mukdahan-2d1n-itinerary','mukdahan-3d2n-itinerary','mukdahan-nature-plan','mukdahan-riverside-plan',
  'mukdahan-savannakhet-crossing-plan','mukdahan-phu-tai-culture-plan','mukdahan-photo-spots-plan','mukdahan-nakhon-phanom-plan','mukdahan-yasothon-plan',
  'mukdahan-kalasin-plan','mukdahan-first-timer-guide',
  'mukdahan-travel-tips','mukdahan-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นมุกดาหาร/อีสานริมโขง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หอแก้วมุกดาหาร/ภูผาเทิบ/วัดภูมโนรมย์/สะพานมิตรภาพ2/แก่งกะเบา/ตลาดอินโดจีน/ริมโขงมุกดาหาร/หนองสูงผู้ไทย) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ปลาแม่น้ำ/ผู้ไทย/เวียดนาม/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ปลาแม่น้ำ/คาเฟ่/แม่น้ำโขงที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
