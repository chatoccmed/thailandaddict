export const meta = {
  name: 'trat-images',
  description: 'Download real licensed images for Trat: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น เกาะช้าง เกาะกูด เกาะหมาก น้ำตกคลองพลู เมืองเก่าตราด) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับตราด/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m) · ถ้า upload.wikimedia.org ตอบ 429 ใช้ endpoint Special:FilePath/<file>?width=1600 พร้อม -A "Mozilla/5.0" แทน
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของตราด (เกาะช้าง/เกาะกูด หาดทรายขาวน้ำใส หรือ สะพานไม้ตะเคียนทองเกาะกูด) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/trat.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:trat', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'trat-food-guide','trat-seafood','trat-kapi-dried-seafood','koh-chang-restaurants',
  'trat-cafe-guide','trat-town-food','trat-fruit-orchards','koh-kood-restaurants',
  'trat-beach-bbq-seafood','trat-mookata-buffet','trat-local-breakfast','trat-dessert-souvenir',
  'trat-attractions','koh-chang-guide','koh-kood-guide','koh-mak-guide',
  'klong-plu-waterfall','trat-old-town-bang-phra','wat-buppharam-trat','ban-hat-lek-border',
  'koh-chang-naval-memorial','koh-chang-beaches','koh-kood-waterfalls-beaches','trat-snorkeling-islands',
  'trat-1-day-itinerary','trat-2d1n-itinerary','trat-3d2n-itinerary','koh-chang-plan',
  'koh-kood-koh-mak-plan','trat-nature-plan','trat-old-town-cafe-plan','trat-photo-spots-plan',
  'chanthaburi-trat-plan','trat-food-souvenir-plan','trat-family-plan','trat-first-timer-guide',
  'trat-travel-tips','trat-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นตราด"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (เกาะช้าง/เกาะกูด/เกาะหมาก/น้ำตกคลองพลู/เมืองเก่าตราด/สะพานไม้ตะเคียนทอง) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศทะเลตะวันออก-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
