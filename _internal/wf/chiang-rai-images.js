export const meta = {
  name: 'chiang-rai-images',
  description: 'Download real licensed images for Chiang Rai: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น วัดร่องขุ่น วัดร่องเสือเต้น ดอยตุง ไร่ชาฉุยฟง สามเหลี่ยมทองคำ บ้านดำ) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับเชียงราย/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m)
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของเชียงราย (วัดร่องขุ่น หรือ ไร่ชา/ดอย/ทะเลหมอก) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/chiang-rai.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:chiang-rai', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'chiang-rai-food-guide','chiang-rai-northern-cuisine','chiang-rai-khao-soi','chiang-rai-cafe-guide',
  'chiang-rai-tea-farm-cafe','chiang-rai-beef-noodles','chiang-rai-ethnic-food','chiang-rai-local-breakfast',
  'chiang-rai-night-market-food','chiang-rai-mookata-buffet','chiang-rai-dessert-souvenir','chiang-rai-local-restaurants',
  'chiang-rai-attractions','wat-rong-khun-guide','wat-rong-suea-ten-guide','doi-tung-guide',
  'golden-triangle-guide','phu-chi-fa-guide','choui-fong-tea-guide','wat-huay-pla-kang-guide',
  'baan-dam-museum-guide','chiang-rai-clock-tower-city','doi-chang-coffee-hills','mae-sai-border-guide',
  'chiang-rai-1-day-itinerary','chiang-rai-2d1n-itinerary','chiang-rai-3d2n-itinerary','chiang-rai-cafe-tea-plan',
  'chiang-rai-nature-plan','chiang-rai-temples-art-plan','chiang-rai-photo-spots-plan','chiang-rai-golden-triangle-plan',
  'chiang-rai-chiang-mai-plan','chiang-rai-phayao-plan','chiang-rai-family-plan','chiang-rai-first-timer-guide',
  'chiang-rai-travel-tips','chiang-rai-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นเชียงราย"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (วัดร่องขุ่น/ร่องเสือเต้น/ดอยตุง/ฉุยฟง/สามเหลี่ยมทองคำ/ภูชี้ฟ้า/บ้านดำ/ห้วยปลากั้ง) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศเหนือ-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
