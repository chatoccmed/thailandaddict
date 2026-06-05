export const meta = {
  name: 'ayutthaya-images',
  description: 'Download real licensed images for Ayutthaya: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น วัดมหาธาตุ วัดไชยวัฒนาราม วัดพระศรีสรรเพชญ์ วัดใหญ่ชัยมงคล บางปะอิน) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับอยุธยา/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m) · ถ้า upload.wikimedia.org ตอบ 429 ใช้ endpoint Special:FilePath/<file>?width=1600 พร้อม -A "Mozilla/5.0" แทน
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของอยุธยา (วัดไชยวัฒนาราม หรือ วัดมหาธาตุเศียรพระ/วัดพระศรีสรรเพชญ์) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/ayutthaya.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:ayutthaya', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'ayutthaya-food-guide','ayutthaya-boat-noodles','ayutthaya-river-prawn','roti-sai-mai-guide',
  'ayutthaya-thai-desserts','ayutthaya-beef-noodles','ayutthaya-cafe-guide','ayutthaya-floating-market-food',
  'ayutthaya-riverside-restaurants','ayutthaya-mookata-buffet','ayutthaya-local-breakfast','ayutthaya-street-food',
  'ayutthaya-attractions','wat-mahathat-guide','wat-chaiwatthanaram-guide','wat-phra-si-sanphet-guide',
  'wat-yai-chai-mongkhon-guide','wat-lokayasutharam-guide','wat-phutthaisawan-guide','bang-pa-in-palace-guide',
  'ayothaya-floating-market','ayutthaya-river-cruise','ayutthaya-night-temples','ayutthaya-bike-costume-guide',
  'ayutthaya-1-day-itinerary','ayutthaya-2d1n-itinerary','ayutthaya-3d2n-itinerary','ayutthaya-bike-temple-plan',
  'ayutthaya-cafe-food-plan','ayutthaya-river-temple-plan','ayutthaya-photo-spots-plan','ayutthaya-temples-history-plan',
  'ayutthaya-bangkok-day-trip','ayutthaya-ang-thong-plan','ayutthaya-family-plan','ayutthaya-first-timer-guide',
  'ayutthaya-travel-tips','ayutthaya-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นอยุธยา"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (วัดมหาธาตุ/ไชยวัฒนาราม/พระศรีสรรเพชญ์/ใหญ่ชัยมงคล/โลกยสุธาราม/บางปะอิน) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปอาหาร/บรรยากาศไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
