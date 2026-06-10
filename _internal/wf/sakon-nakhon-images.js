export const meta = {
  name: 'sakon-nakhon-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Sakon Nakhon: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Sakon Nakhon city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Sakon Nakhon article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พระธาตุเชิงชุม หนองหารสกลนคร อุทยานภูพาน วัดถ้ำผาแด่น พิพิธภัณฑ์หลวงปู่มั่น ผ้าคราม น้ำตกคำหอม) หรือ **Unsplash / Pexels** (อาหารอีสาน/เนื้อย่าง/ปลาน้ำจืด/คาเฟ่/ผ้าทอ/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับสกลนคร/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

// slug-uniqueness guard: existing image slugs + city flag injected via args
const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดสกลนคร — เลือกแลนด์มาร์กเด่น: วัดพระธาตุเชิงชุม หรือ วัดถ้ำผาแด่น หรือ หนองหาร หรือ ผ้าครามสกล (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/sakon-nakhon.jpg และ astro/public/images/heroes/sakon-nakhon.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:sakon-nakhon', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'sakon-nakhon-isan-food','phon-yang-kham-beef','nong-han-freshwater-fish','sakon-nakhon-vietnamese-food','sakon-nakhon-cafe-guide',
  'sakon-nakhon-local-breakfast','sakon-nakhon-mookata','sakon-nakhon-street-food','sakon-nakhon-local-dessert','sakon-nakhon-souvenir-food','sakon-nakhon-night-market',
  'sakon-nakhon-attractions','wat-phra-that-choeng-chum','nong-han-lake','phu-phan-national-park','ajahn-mun-museum',
  'phu-phan-rajanivet-palace','ban-tha-wat-indigo','kham-hom-waterfall','wat-tham-pha-daen','sakon-indigo-craft',
  'sakon-wax-castle-festival','wat-pa-udom-somphon',
  'sakon-nakhon-1-day-itinerary','sakon-nakhon-2d1n-itinerary','sakon-nakhon-3d2n-itinerary','sakon-indigo-craft-plan','sakon-nakhon-nature-plan',
  'sakon-forest-temple-plan','sakon-lake-city-plan','sakon-nakhon-photo-spots-plan','sakon-nakhon-phanom-plan','sakon-udon-plan',
  'sakon-kalasin-plan','sakon-nakhon-first-timer-guide',
  'sakon-nakhon-travel-tips','sakon-nakhon-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นสกลนคร/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระธาตุเชิงชุม/หนองหาร/ภูพาน/วัดถ้ำผาแด่น/พิพิธภัณฑ์หลวงปู่มั่น/วัดป่าอุดมสมพร/น้ำตกคำหอม/ผ้าคราม/พระตำหนักภูพาน) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/เนื้อย่างโคขุน/ปลาน้ำจืด/เวียดนาม/คาเฟ่/ผ้าทอ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/เนื้อย่าง/ปลา/คาเฟ่/ผ้าครามที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
