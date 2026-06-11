export const meta = {
  name: 'chaiyaphum-images-recover',
  description: 'Recover the 7 missing Chaiyaphum article hero images',
  phases: [ { title: 'Articles', detail: 'fetch the missing hero images' } ],
}

const DLRULES = `
กติกาเลือกรูป (สำคัญมาก):
- ใช้เฉพาะแหล่งลิขสิทธิ์ฟรี/เปิดให้ใช้และ self-host ได้: **Wikimedia Commons** (สถานที่จริง เช่น ไทรทอง ผาแดง น้ำตก) หรือ **Unsplash / Pexels** (อาหารอีสาน/ครอบครัวเที่ยว/แผนที่/บรรยากาศทั่วไป) — ห้ามดึงจากเว็บสุ่มที่ไม่ทราบสิทธิ์
- ต้องเป็นรูปที่ "เกี่ยวกับชัยภูมิ/อีสาน/หัวข้อนั้นจริง" แนวนอน คุณภาพดี
- วิธี: WebSearch หา → WebFetch หา URL ไฟล์รูปตรง (upload.wikimedia.org/... , images.unsplash.com/... , images.pexels.com/...) → ดาวน์โหลดด้วย Bash **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o <path> <url>** เสมอ (ห้าม curl ที่ไม่มี -m · Wikimedia ต้องใส่ -A) · ถ้า WebFetch หน้าไหนค้าง ให้ข้าม
- บันทึกเป็น .jpg แม้ต้นฉบับ webp/png
- ตรวจไฟล์สำเร็จจริง: ขนาด > 15KB (ls -l) ถ้าเล็ก/พังลองแหล่งอื่น **รวมไม่เกิน 3 แหล่ง** ถ้ายังไม่ได้ให้หยุดและรายงาน SKIPPED (ห้าม retry วน)
- ⚠️ ห้ามใช้ rm หรือลบไฟล์ใด ๆ · curl -o ตรงไปยัง path ปลายทางเท่านั้น
`

phase('Articles')
const ARTICLES = [
  'sai-thong-national-park','chaiyaphum-nakhon-ratchasima-plan','chaiyaphum-phetchabun-plan',
  'chaiyaphum-family-plan','chaiyaphum-first-timer-guide','chaiyaphum-travel-tips','chaiyaphum-getting-around',
]
const res = await parallel(ARTICLES.map(slug => () =>
  agent(`อ่านไฟล์ astro/src/content/articles/${slug}.json (ดู h1/title เพื่อเข้าใจหัวข้อ) แล้วหารูปจริงที่ "ตรงหัวข้อและเป็นชัยภูมิ/อีสาน"
ดาวน์โหลด 1 รูป บันทึกที่ astro/public/images/cm/${slug}.jpg (mkdir -p astro/public/images/cm ก่อน)
แนวทาง: ถ้าหัวข้อเป็นสถานที่เฉพาะ (ไทรทอง/ผาแดง/น้ำตก) ใช้ Wikimedia Commons ของจริง · ถ้าเป็นแผนเที่ยว/เตรียมตัว/ครอบครัว/ข้ามจังหวัด ใช้ Unsplash/Pexels รูปทิวเขา/ถนน/อาหารอีสาน/บรรยากาศชัยภูมิที่เหมาะ
${DLRULES}
รายงานสั้น ๆ: หัวข้อ, แหล่งรูป, ขนาดไฟล์`,
    { label:`img:${slug}`, phase:'Articles' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recover article images: ${ok}/${ARTICLES.length}`)
return { articles: ARTICLES.length, articlesOk: ok }
