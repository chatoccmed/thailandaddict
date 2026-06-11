export const meta = {
  name: 'kalasin-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Kalasin: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Kalasin city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Kalasin article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พิพิธภัณฑ์สิรินธร ไดโนเสาร์ภูกุ้มข้าว เขื่อนลำปาว พระพรหมภูมิปาโล ผาเสวยภูพาน ผ้าไหมแพรวา) หรือ **Unsplash / Pexels** (อาหารอีสาน/ปลา/คาเฟ่/ผ้าไหม/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับกาฬสินธุ์/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดกาฬสินธุ์ — เลือกแลนด์มาร์กเด่น: ไดโนเสาร์/พิพิธภัณฑ์สิรินธร หรือ พระพรหมภูมิปาโลกลางน้ำ หรือ เขื่อนลำปาว หรือ ผ้าไหมแพรวา (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/kalasin.jpg และ astro/public/images/heroes/kalasin.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:kalasin', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'kalasin-isan-food','kalasin-lampao-fish','kalasin-cafe-guide','kalasin-mookata','kalasin-sai-krok-mam',
  'kalasin-phu-thai-food','kalasin-street-food','kalasin-local-breakfast','kalasin-plara-jaewbong','kalasin-souvenir-food','kalasin-local-dessert',
  'kalasin-attractions','sirindhorn-museum','phu-kum-khao','lampao-dam','kaeng-ka-am-waterfall',
  'phu-sing-pha-sawoei','phu-thai-khok-kong','praewa-silk-ban-phon','phra-phrom-phumipalo','kalasin-phu-phan-nature',
  'kalasin-dinosaur-trail','kalasin-phu-thai-culture',
  'kalasin-1-day-itinerary','kalasin-2d1n-itinerary','kalasin-3d2n-itinerary','kalasin-dinosaur-plan','kalasin-nature-plan',
  'kalasin-praewa-culture-plan','kalasin-photo-spots-plan','kalasin-khon-kaen-plan','kalasin-sakon-nakhon-plan',
  'kalasin-family-plan','kalasin-lampao-chill-plan','kalasin-first-timer-guide',
  'kalasin-travel-tips','kalasin-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นกาฬสินธุ์/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พิพิธภัณฑ์สิรินธร/ไดโนเสาร์ภูกุ้มข้าว/เขื่อนลำปาว/พระพรหมภูมิปาโล/ผาเสวย/แก้งกะอาม/ผ้าไหมแพรวา) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ปลา/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ปลา/คาเฟ่/ผ้าไหมที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
