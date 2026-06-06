export const meta = {
  name: 'rayong-images',
  description: 'Download real licensed images for Rayong: city hero + 38 article heroes',
  phases: [ { title: 'Cities', detail: 'city hero' }, { title: 'Articles', detail: 'one hero per article' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น เกาะเสม็ด หาดแม่รำพึง ทุ่งโปรงทอง เรือรบประแส ยมจินดา) หรือ **Unsplash / Pexels** (อาหาร/คาเฟ่/บรรยากาศ) — ห้ามเว็บสุ่มไม่ทราบสิทธิ์
- รูปต้อง "เกี่ยวกับระยอง/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch → WebFetch หา URL ไฟล์ตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลด **curl -m 60 --connect-timeout 20 -L -o <path> <url>** (ห้าม curl ไม่มี -m) · ถ้า upload.wikimedia.org ตอบ 429 ใช้ endpoint Special:FilePath/<file>?width=1600 พร้อม -A "Mozilla/5.0" แทน
- บันทึก .jpg แม้ต้นฉบับ webp/png · ตรวจ > 15KB (ls -l) · ถ้าเล็ก/พัง ลองแหล่งอื่น **ไม่เกิน 3 แหล่ง** แล้วรายงาน SKIPPED (ห้าม retry วน)
`

phase('Cities')
await agent(`ดาวน์โหลดรูป hero จริงของระยอง (เกาะเสม็ดหาดทรายแก้ว หรือ หาดแม่รำพึง/ทุ่งโปรงทอง) 1 รูป แนวนอนกว้างสวย
บันทึกที่ astro/public/images/heroes/rayong.jpg (mkdir -p astro/public/images/heroes ก่อน)
${DLRULES}
รายงานสั้น ๆ ว่าได้รูปจากแหล่งไหน ขนาดไฟล์เท่าไร`,
  { label:'hero:rayong', phase:'Cities' })

phase('Articles')
const ARTICLES = [
  'rayong-food-guide','rayong-seafood','ban-phe-dried-seafood','koh-samet-restaurants',
  'rayong-noodles-local','rayong-cafe-guide','rayong-fruit-orchards','mae-ramphueng-beach-eats',
  'rayong-mookata-buffet','rayong-dessert-souvenir','rayong-local-breakfast','rayong-street-food',
  'rayong-attractions','koh-samet-guide','mae-ramphueng-beach-guide','ban-phe-guide',
  'yom-chinda-old-street','tung-prong-thong','htms-prasae-warship','sunthorn-phu-monument',
  'khao-laem-ya-national-park','rayong-aquarium','koh-samet-beaches','paknam-prasae-community',
  'rayong-1-day-itinerary','rayong-2d1n-itinerary','rayong-3d2n-itinerary','koh-samet-plan',
  'rayong-sea-beach-plan','rayong-food-trip-plan','rayong-old-town-cafe-plan','rayong-photo-spots-plan',
  'rayong-fruit-orchard-plan','rayong-chanthaburi-eastern-plan','rayong-family-plan','rayong-first-timer-guide',
  'rayong-travel-tips','rayong-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นระยอง"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: สถานที่เฉพาะ (เกาะเสม็ด/หาดแม่รำพึง/ทุ่งโปรงทอง/เรือรบประแส/ยมจินดา/ปากน้ำประแส) ใช้ Wikimedia Commons ของจริง · อาหาร/คาเฟ่/แผน/เตรียมตัว ใช้ Unsplash/Pexels รูปบรรยากาศทะเลตะวันออก-ไทยที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์ (หาไม่ได้ บอก SKIPPED)`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
