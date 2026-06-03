export const meta = {
  name: 'chiang-mai-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Chiang Mai: city hero + 6 featured-city cards + 38 article heroes',
  phases: [
    { title: 'Cities', detail: 'city hero + featured city cards' },
    { title: 'Articles', detail: 'one hero image per CM article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งที่ลิขสิทธิ์ฟรี/เปิดให้ใช้ได้และ self-host ได้เท่านั้น: **Wikimedia Commons** (สำหรับสถานที่/แลนด์มาร์กจริง เช่น ดอยสุเทพ ดอยอินทนนท์ วัด) หรือ **Unsplash / Pexels** (สำหรับอาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเชียงใหม่/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → เปิดหน้า (WebFetch) เพื่อหา URL ไฟล์รูปตรง (เช่น upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash curl
- บันทึกเป็นไฟล์ตาม path ที่กำหนดเป๊ะ (นามสกุล .jpg) แม้ต้นฉบับเป็น webp/png ก็บันทึกชื่อ .jpg ได้ (เบราว์เซอร์ render ได้)
- ตรวจว่าไฟล์ดาวน์โหลดสำเร็จจริง: ขนาด > 15KB (ใช้ ls -l). ถ้าเล็กเกิน/พัง ให้ลองแหล่งอื่นจนได้
- โหลดให้ครบทุกไฟล์ที่ระบุ
`

phase('Cities')
const CITY = [
  ['chiang-mai','เชียงใหม่ (วัดพระธาตุดอยสุเทพ หรือเมืองเก่า/ดอย)'],
  ['krabi','กระบี่ (ทะเลอันดามัน เกาะ หน้าผาหินปูน)'],
  ['phuket','ภูเก็ต (หาด/ทะเลภูเก็ต)'],
  ['bangkok','กรุงเทพ (สกายไลน์/วัด/เมือง)'],
  ['chiang-rai','เชียงราย (วัดร่องขุ่น หรือไร่ชา/ดอย)'],
  ['kanchanaburi','กาญจนบุรี (สะพานข้ามแม่น้ำแคว/น้ำตก)'],
]
await parallel(CITY.map(([slug,desc]) => () =>
  agent(`ดาวน์โหลดรูปจริงของจังหวัด ${desc} 1 รูป
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/${slug}.jpg ${slug==='chiang-mai' ? 'และ astro/public/images/heroes/chiang-mai.jpg (รูป hero แนวนอนกว้าง)' : ''}
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อนถ้ายังไม่มี · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
    { label:`city:${slug}`, phase:'Cities' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))

phase('Articles')
const ARTICLES = [
  'top-khao-soi-chiang-mai','chiang-mai-cafe-guide','chiang-mai-northern-cuisine','chiang-mai-mookata-buffet',
  'chiang-mai-street-food','chiang-mai-dessert-bakery','chiang-mai-coffee-roasters','chiang-mai-vegetarian-vegan',
  'chiang-mai-riverside-restaurants','chiang-mai-local-breakfast','chiang-mai-fine-dining','chiang-mai-food-guide',
  'chiang-mai-attractions','doi-suthep-guide','doi-inthanon-guide','chiang-mai-old-city-temples','nimman-area-guide',
  'mon-jam-mae-rim','chiang-mai-sunday-walking-street','chiang-mai-elephant-sanctuary','chiang-mai-waterfalls-nature',
  'chiang-mai-viewpoints','chiang-mai-night-markets','chiang-mai-craft-villages',
  'chiang-mai-1-day-itinerary','chiang-mai-2d1n-itinerary','chiang-mai-3d2n-itinerary','chiang-mai-cafe-hopping-plan',
  'chiang-mai-nature-doi-plan','chiang-mai-photo-spots-plan','chiang-mai-temples-culture-plan','chiang-mai-chiang-rai-4d3n',
  'chiang-mai-pai-loop-plan','chiang-mai-family-plan','chiang-mai-budget-plan','chiang-mai-first-timer-guide',
  'chiang-mai-travel-tips','chiang-mai-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเชียงใหม่"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ดอยสุเทพ/ดอยอินทนนท์/นิมมาน/ม่อนแจ่ม/วัด/ถนนคนเดิน) ใช้ Wikimedia Commons ของที่จริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศเชียงใหม่-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { cities: CITY.length, articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
