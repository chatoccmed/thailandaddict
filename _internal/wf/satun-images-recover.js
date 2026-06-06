export const meta = {
  name: 'satun-images-recover',
  description: 'Recover missing Satun images: city/hero + satun-getting-around article hero',
  phases: [ { title: 'Recover', detail: 'city hero + 1 article image' } ],
}

const DLRULES = `
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี: **Wikimedia Commons** (สถานที่จริงสตูล เกาะหลีเป๊ะ ตะรุเตา ปราสาทหินพันยอด) หรือ **Unsplash / Pexels** (ทะเลอันดามัน/บรรยากาศ/การเดินทาง) — ห้ามเว็บสุ่ม
- แนวนอน คุณภาพดี · ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -o <path> <url>** เสมอ · ถ้า WebFetch ค้างให้ข้าม
- บันทึก .jpg · ตรวจขนาด > 15KB · ลองไม่เกิน 3 แหล่ง ถ้าไม่ได้รายงาน SKIPPED
`

phase('Recover')
await parallel([
  () => agent(`ดาวน์โหลดรูปจริงของจังหวัดสตูล (เกาะหลีเป๊ะ/ปราสาทหินพันยอด/ตะรุเตา รูปแนวนอนกว้างสวย เหมาะเป็น hero)
บันทึก 2 ที่: astro/public/images/cities/satun.jpg และ astro/public/images/heroes/satun.jpg (mkdir -p ก่อน)
${DLRULES}`, { label:'city:satun', phase:'Recover' }).then(()=>1).catch(()=>0),
  () => agent(`อ่าน astro/src/content/articles/satun-getting-around.json (หัวข้อ = การเดินทางในสตูล) หารูปจริงที่เหมาะ (ท่าเรือปากบารา/เรือออกเกาะ/ทะเลอันดามันสตูล หรือบรรยากาศการเดินทางไทยที่เหมาะ)
ดาวน์โหลด 1 รูป บันทึก astro/public/images/cm/satun-getting-around.jpg (mkdir -p astro/public/images/cm ก่อน)
${DLRULES}`, { label:'img:satun-getting-around', phase:'Recover' }).then(()=>1).catch(()=>0),
])
return { done: true }
