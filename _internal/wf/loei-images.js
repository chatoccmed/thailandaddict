export const meta = {
  name: 'loei-images',
  description: 'Download real licensed images (Wikimedia/Unsplash/Pexels) for Loei: city hero + 37 article heroes',
  phases: [
    { title: 'City', detail: 'Loei city hero + city card' },
    { title: 'Articles', detail: 'one hero image per Loei article' },
  ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่/แลนด์มาร์กจริง เช่น ภูกระดึง เชียงคาน ภูเรือ แก่งคุดคู้ พระธาตุศรีสองรัก สวนหินผางาม ผีตาโขน) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับเลย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
`

phase('City')
await agent(`ดาวน์โหลดรูปจริงของจังหวัดเลย — เลือกแลนด์มาร์กเด่น: ภูกระดึง หรือ เชียงคาน (ริมโขง) หรือ ภูเรือทะเลหมอก (รูปแนวนอนกว้าง สวย เหมาะเป็น hero)
บันทึก 2 ที่ (ก๊อปไฟล์เดียวกันได้): astro/public/images/cities/loei.jpg และ astro/public/images/heroes/loei.jpg
${DLRULES}
สร้างโฟลเดอร์ด้วย mkdir -p ก่อน · รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดเท่าไร`,
  { label:'city:loei', phase:'City' }).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Articles')
const ARTICLES = [
  'loei-isan-food','chiang-khan-cafe-guide','chiang-khan-khai-kratha-breakfast','loei-mookata-buffet','loei-mekong-fish-restaurants',
  'chiang-khan-street-food','loei-souvenir-food','loei-dessert-cafe','loei-noodle-shops','loei-local-breakfast','phu-ruea-restaurant-view',
  'loei-attractions','phu-kradueng-national-park-guide','chiang-khan-walking-street','phu-ruea-national-park','phra-that-si-song-rak',
  'kaeng-khut-khu','phu-thok-chiang-khan','wat-neramit-wipassana','suan-hin-pha-ngam','phi-ta-khon-festival',
  'chiang-khan-skywalk','phu-pa-po-loei',
  'loei-1-day-itinerary','loei-2d1n-itinerary','loei-3d2n-itinerary','chiang-khan-2d1n-plan','phu-kradueng-trek-plan',
  'phu-ruea-phu-thok-nature-plan','chiang-khan-cafe-plan','loei-dan-sai-culture-plan','loei-phetchabun-mountain-plan','loei-udon-thani-mekong-plan',
  'loei-family-plan','loei-first-timer-guide',
  'loei-travel-tips','loei-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเลย/เชียงคาน/ภูเขา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ภูกระดึง/เชียงคาน/ภูเรือ/แก่งคุดคู้/ภูทอก/พระธาตุศรีสองรัก/วัดเนรมิต/สวนหินผางาม/ผีตาโขน/สกายวอล์คเชียงคาน/ภูป่าเปาะ) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นอาหาร/คาเฟ่/แผนเที่ยว/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหารอีสาน/คาเฟ่/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
