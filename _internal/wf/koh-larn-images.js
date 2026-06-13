export const meta = {
  name: 'koh-larn-images',
  description: 'Download real licensed images for Koh Larn: city hero + 18 article heroes',
  phases: [
    { title: 'City', detail: 'Koh Larn city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Koh Larn article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น เกาะล้าน หาดตาแหวน หาดแสม) หรือ **Unsplash / Pexels** (ทะเลใส หาดทรายขาว กีฬาทางน้ำ ดำน้ำ เรือ อาหารทะเล บรรยากาศเกาะ) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเกาะล้าน/ทะเลพัทยา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

const haveImg = new Set(args && args.existingImages ? args.existingImages : [])
const cityDone = !!(args && args.cityDone)

if (!cityDone) {
phase('City')
await agent(`ดาวน์โหลดรูปจริงของเกาะล้าน — เลือกแลนด์มาร์กเด่น: หาดตาแหวนเกาะล้านทรายขาวน้ำใส หรือ วิวเกาะล้านจากจุดชมวิว หรือ ทะเลใสหน้าพัทยา (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/koh-larn.jpg และ astro/public/images/heroes/koh-larn.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:koh-larn', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))
} else { log('City image already exists — skip') }

phase('Articles')
const ALL_ARTICLES = [
  'koh-larn-food-guide','koh-larn-seafood','koh-larn-beach-restaurants','koh-larn-cafe-guide',
  'koh-larn-attractions','koh-larn-tawaen-beach','koh-larn-samae-beach','koh-larn-nual-beach','koh-larn-tien-beach',
  'koh-larn-viewpoint','koh-larn-water-sports','koh-larn-snorkeling',
  'koh-larn-day-trip-plan','koh-larn-2d1n-itinerary','koh-larn-pattaya-plan','koh-larn-first-timer-guide',
  'koh-larn-travel-tips','koh-larn-getting-around',
]
const ARTICLES = ALL_ARTICLES.filter(s => !haveImg.has(s))
log(`Article images to fetch: ${ARTICLES.length} (skipped ${ALL_ARTICLES.length-ARTICLES.length} existing)`)
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเกาะล้าน/ทะเลพัทยา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (หาดตาแหวน/หาดแสม/หาดนวล/หาดเทียน/จุดชมวิวเกาะล้าน) ใช้ Wikimedia Commons ของจริงถ้ามี · ถ้าเป็นอาหารทะเล/คาเฟ่/กีฬาทางน้ำ/ดำน้ำ/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปทะเลใส/หาดทรายขาว/กีฬาทางน้ำ/ดำน้ำ/อาหารทะเลที่เหมาะกับเกาะล้าน
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
