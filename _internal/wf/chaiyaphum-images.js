export const meta = {
  name: 'chaiyaphum-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Chaiyaphum: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Chaiyaphum city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Chaiyaphum article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น มอหินขาว ป่าหินงาม ทุ่งดอกกระเจียว น้ำตกตาดโตน ผาแดงไทรทอง อนุสาวรีย์เจ้าพ่อพญาแล ปรางค์กู่ เขื่อนจุฬาภรณ์) หรือ **Unsplash / Pexels** (อาหารอีสาน/ผ้าไหม/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับชัยภูมิ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดชัยภูมิ — เลือกแลนด์มาร์กเด่น: มอหินขาว หรือ ทุ่งดอกกระเจียวป่าหินงาม หรือ น้ำตกตาดโตน หรือ ผาแดงไทรทอง (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/chaiyaphum.jpg และ astro/public/images/heroes/chaiyaphum.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:chaiyaphum', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'chaiyaphum-isan-food','chaiyaphum-cafe-guide','chaiyaphum-mookata','chaiyaphum-noodles','chaiyaphum-riverside-fish',
  'chaiyaphum-street-food','chaiyaphum-local-breakfast','chaiyaphum-khao-mao','chaiyaphum-forest-veggies','chaiyaphum-souvenir-food','chaiyaphum-local-dessert',
  'chaiyaphum-attractions','pa-hin-ngam-national-park','krachiao-flower-fields','mo-hin-khao','tat-ton-national-park',
  'sai-thong-national-park','chao-pho-phaya-lae-monument','ban-khwao-silk','prang-ku-chaiyaphum','chulabhorn-dam',
  'chaiyaphum-waterfalls','chaiyaphum-viewpoints',
  'chaiyaphum-1-day-itinerary','chaiyaphum-2d1n-itinerary','chaiyaphum-3d2n-itinerary','chaiyaphum-krachiao-season-plan','chaiyaphum-nature-plan',
  'chaiyaphum-culture-plan','chaiyaphum-photo-spots-plan','chaiyaphum-nakhon-ratchasima-plan','chaiyaphum-phetchabun-plan',
  'chaiyaphum-family-plan','chaiyaphum-waterfall-cool-plan','chaiyaphum-first-timer-guide',
  'chaiyaphum-travel-tips','chaiyaphum-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นชัยภูมิ/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (มอหินขาว/ป่าหินงาม/ทุ่งกระเจียว/น้ำตกตาดโตน/ไทรทอง/อนุสาวรีย์เจ้าพ่อพญาแล/ปรางค์กู่/เขื่อนจุฬาภรณ์) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นผ้าไหม/อาหารอีสาน/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปผ้าไหม/อาหารอีสาน/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
