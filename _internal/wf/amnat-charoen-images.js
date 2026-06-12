export const meta = {
  name: 'amnat-charoen-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Amnat Charoen: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Amnat Charoen city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Amnat Charoen article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น พระมงคลมิ่งเมือง วัดถ้ำแสงเพชร ภูสิงห์ เขื่อนลำเซบาย วัดพระเหลาเทพนิมิต) หรือ **Unsplash / Pexels** (อาหารอีสาน/ปลาเผา/ผ้าทอ/ทุ่งนา/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับอำนาจเจริญ/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดอำนาจเจริญ — เลือกแลนด์มาร์กเด่น: พระมงคลมิ่งเมือง หรือ วัดถ้ำแสงเพชร หรือ ภูสิงห์-ภูผาผึ้ง (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/amnat-charoen.jpg และ astro/public/images/heroes/amnat-charoen.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:amnat-charoen', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'amnat-charoen-isan-food','amnat-charoen-river-fish','amnat-charoen-cafe-guide','amnat-charoen-mookata','amnat-charoen-fermented',
  'amnat-charoen-khao-jee','amnat-charoen-street-food','amnat-charoen-local-breakfast','amnat-charoen-forest-mushroom','amnat-charoen-souvenir-food','amnat-charoen-local-dessert',
  'amnat-charoen-attractions','phra-mongkhon-ming-muang','wat-tham-saeng-phet','phu-sing-phu-pha-phueng','lam-sebai-dam',
  'wat-phra-lao-thep-nimit','khao-dan-phra-bat-na-maet','amnat-charoen-weaving-village','amnat-charoen-old-town','amnat-charoen-temples-culture',
  'amnat-charoen-nature','amnat-charoen-rice-fields',
  'amnat-charoen-1-day-itinerary','amnat-charoen-2d1n-itinerary','amnat-charoen-3d2n-itinerary','amnat-charoen-temple-merit-plan','amnat-charoen-nature-plan',
  'amnat-charoen-craft-plan','amnat-charoen-photo-spots-plan','amnat-charoen-ubon-plan','amnat-charoen-mukdahan-plan',
  'amnat-charoen-family-plan','amnat-charoen-stopover-plan','amnat-charoen-first-timer-guide',
  'amnat-charoen-travel-tips','amnat-charoen-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นอำนาจเจริญ/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (พระมงคลมิ่งเมือง/วัดถ้ำแสงเพชร/ภูสิงห์/เขื่อนลำเซบาย/วัดพระเหลาเทพนิมิต/ลานหินนาแมต) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหารอีสาน/ปลาเผา/ผ้าทอ/ทุ่งนา/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/ผ้าทอ/ทุ่งนา/คาเฟ่ที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
