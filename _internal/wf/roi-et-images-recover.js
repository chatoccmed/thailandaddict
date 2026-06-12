export const meta = {
  name: 'roi-et-images-recover',
  description: 'Recover the 10 missing Roi Et itinerary/prep hero images',
  phases: [ { title: 'Articles', detail: 'fetch the 10 missing hero images' } ],
}

const DLRULES = `
กติกาเลือกรูป:
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี self-host ได้: Wikimedia Commons (สถานที่ร้อยเอ็ด/อีสานจริง) หรือ Unsplash/Pexels (ทุ่งนาข้าว/อาหารอีสาน/วัด/คาเฟ่/บรรยากาศเที่ยวที่เหมาะ) — ห้ามเว็บสุ่มที่ไม่ทราบสิทธิ์ · รูปแนวนอน คุณภาพดี
- WebSearch → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/.../images.unsplash.com/.../images.pexels.com/...) → ดาวน์โหลด Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ไม่มี -m) · ถ้า WebFetch ค้างให้ข้ามทันที
- บันทึก .jpg · ตรวจ > 15KB (ls -l) · ลองไม่เกิน 3 แหล่ง ถ้าไม่ได้รายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้าม rm/ลบไฟล์ · curl -o ตรงไป path ปลายทางเท่านั้น
`

phase('Articles')
const ARTICLES = [
  'roi-et-nature-plan','roi-et-city-walk-plan','roi-et-photo-spots-plan','roi-et-khon-kaen-plan','roi-et-maha-sarakham-plan',
  'roi-et-family-plan','roi-et-bun-phawet-plan','roi-et-first-timer-guide','roi-et-travel-tips','roi-et-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นร้อยเอ็ด/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
หัวข้อพวกนี้เป็นแผนเที่ยว/เตรียมตัว/งานบุญ → ใช้ Unsplash/Pexels รูปทุ่งนาข้าวอีสาน/วัด/คาเฟ่/อาหารอีสาน/บรรยากาศเที่ยวเมืองที่เหมาะ (หรือ Wikimedia ของร้อยเอ็ดถ้ามี)
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
log(`Recovered: ${res.filter(x=>x&&x.ok).length}/${ARTICLES.length}`)
return { articles: ARTICLES.length, ok: res.filter(x=>x&&x.ok).length }
