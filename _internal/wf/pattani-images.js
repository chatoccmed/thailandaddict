export const meta = {
  name: 'pattani-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Pattani: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Pattani city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Pattani article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น มัสยิดกรือเซะ มัสยิดกลางปัตตานี เมืองเก่าอาเนาะรู ศาลเจ้าเล่งจูเกียง หาดตะโละกาโปร์ น้ำตกทรายขาว เรือกอและ) หรือ **Unsplash / Pexels** (อาหารมลายู/ข้าวยำ/โรตี/ทะเล/ตึกเก่า/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับปัตตานี/ชายแดนใต้/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดปัตตานี — เลือกแลนด์มาร์กเด่น: มัสยิดกรือเซะ หรือ มัสยิดกลางปัตตานี หรือ เรือกอและหาดตะโละกาโปร์ (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/pattani.jpg และ astro/public/images/heroes/pattani.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:pattani', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'pattani-southern-malay-food','pattani-khao-yam','nasi-dagae','pattani-kai-kolae','pattani-cafe-guide',
  'pattani-seafood','pattani-roti-tea','pattani-budu','pattani-malay-dessert','pattani-local-breakfast','pattani-souvenir-food',
  'pattani-attractions','krue-se-mosque','pattani-central-mosque','anoru-old-town','leng-chu-kiang-shrine',
  'talo-kapo-beach','laem-tachi','sai-khao-waterfall','ao-manao-skywalk','kolae-boats',
  'pattani-culture','pattani-beaches-nature',
  'pattani-1-day-itinerary','pattani-2d1n-itinerary','pattani-3d2n-itinerary','pattani-old-town-culture-plan','pattani-nature-plan',
  'pattani-food-plan','pattani-photo-spots-plan','pattani-yala-plan','pattani-narathiwat-plan',
  'pattani-family-plan','pattani-mosque-heritage-plan','pattani-first-timer-guide',
  'pattani-travel-tips','pattani-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นปัตตานี/ชายแดนใต้"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (มัสยิดกรือเซะ/มัสยิดกลางปัตตานี/อาเนาะรู/เล่งจูเกียง/หาดตะโละกาโปร์/แหลมตาชี/น้ำตกทรายขาว/เรือกอและ) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารมลายู/ข้าวยำ/โรตี/ทะเล/ตึกเก่า/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารใต้-มลายู/ทะเล/มัสยิด/ตึกเก่าที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
