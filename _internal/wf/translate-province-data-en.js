export const meta = {
  name: 'translate-province-data-en',
  description: 'Translate curated province-data (taglines/highlights/food/attractions/intros) Thai→English for EN city hubs',
  phases: [{ title: 'Translate', detail: 'one agent per province → _internal/province-data-en/<slug>.json' }],
}

const RULES = `
งาน: แปลไฟล์ข้อมูลจังหวัด (curated) ไทย→อังกฤษเนทีฟ สำหรับใช้สร้างหน้า hub เมืองภาษาอังกฤษ

อ่าน _internal/province-data/<slug>.json แล้วเขียน _internal/province-data-en/<slug>.json (mkdir -p ก่อน) — JSON valid · คีย์/ลำดับ/จำนวนสมาชิก array เหมือนต้นฉบับเป๊ะ

⛔ คงเดิมห้ามแก้: slug, neighbors (เป็น slug อังกฤษอยู่แล้ว — คงไว้), heroEmoji, attractions[].kind (nature/city/culture — คงค่าเดิม)
✅ แปลเป็นอังกฤษเนทีฟ (โทนเพื่อนเล่าให้เพื่อน honest กระชับ สำหรับการ์ด/hero):
- th: ใส่ชื่อจังหวัด/เมืองภาษาอังกฤษทางการ (เช่น "น่าน"→"Nan", "เชียงใหม่"→"Chiang Mai", "เกาะหมาก"→"Koh Mak")
- tagline: ประโยคสั้นโปรยใต้ hero (เช่น "เมืองเก่าในหุบเขา…"→"An old town in a valley with…")
- introHtml: คงแท็ก HTML (<p> ฯลฯ) แปลข้อความข้างใน
- bestTime: ช่วงเวลาแนะนำ (แปลเดือน/คำ คงข้อมูล เช่น "พฤศจิกายน-กุมภาพันธ์ อากาศเย็น"→"November–February, cool and clear")
- highlights[].name + .blurb  (ชื่อสถานที่ไทย→ทับศัพท์อังกฤษที่ใช้จริง เช่น "วัดภูมินทร์"→"Wat Phumin")
- foodScene[].name + .note  (ชื่ออาหารไทย→ทับศัพท์ + คำอธิบายสั้น เช่น "ข้าวซอย"→"khao soi")
- attractions[].name + .blurb  (คง .kind)
- itineraryIdeas[] (สตริง เช่น "น่าน 2 วัน 1 คืน เที่ยววัด…"→"Nan 2D1N — temples and old town")

มาตรฐาน: ทับศัพท์ชื่อไทยแบบที่นักท่องเที่ยวใช้จริง (Wat …, Doi …, Khao …) · ห้ามแต่งสถานที่/ข้อมูลเพิ่ม แปลเฉพาะที่มี · ห้ามคำคลีเช่ AI (world-class/nestled/hidden gem/breathtaking เกร่อ) · ห้ามมีอักษรไทยเหลือ (ยกเว้น ฿)

ก่อนจบ: node -e "const a=require('fs').readFileSync('_internal/province-data-en/<slug>.json','utf8'); if(/[\\u0E01-\\u0E5B]/.test(a.replace(/\\u0E3F/g,''))) throw new Error('THAI LEFT'); JSON.parse(a)" ต้องผ่าน
`

let pa = args; if (typeof args === 'string') { try { pa = JSON.parse(args) } catch {} }
const slugs = (pa && pa.slugs) ? pa.slugs.slice() : []
log(`Translating ${slugs.length} province-data → EN`)
phase('Translate')
const res = await parallel(slugs.map(slug => () =>
  agent(
`แปลข้อมูลจังหวัดนี้เป็นอังกฤษ: slug=${slug}
${RULES}`,
    { label: `pd:${slug}`, phase: 'Translate', model: 'opus' }
  ).then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`province-data EN written: ${ok}/${slugs.length}`)
return { total: slugs.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
