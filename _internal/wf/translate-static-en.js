export const meta = {
  name: 'translate-static-en',
  description: 'Translate hand-maintained static hub pages (about/contact/policy/404) Thai→English into astro/public/en/',
  phases: [{ title: 'Translate', detail: 'one agent per page → astro/public/en/<name>.html' }],
}

const RULES = `
งาน: สร้างเวอร์ชันภาษาอังกฤษของหน้า static ของ thailandaddict.com

อ่าน astro/public/<name>.html แล้วสร้าง astro/public/en/<name>.html (mkdir -p astro/public/en ก่อน) — เวอร์ชันอังกฤษ

⛔ คงไว้เป๊ะ ห้ามแตะ (โครงสร้าง/ดีไซน์/ภาพเหมือนเดิม 100%):
- โครงสร้าง HTML ทุก tag/class/ลำดับ · <style> block (CSS) ทั้งหมดเหมือนเดิมทุกตัวอักษร · <script> logic เดิม (แปลเฉพาะ string ที่ผู้ใช้เห็น)
- รูปทุกอัน (src/background-image) path เดิม · ลิงก์ affiliate (agoda cid=1965862 ฯลฯ) เดิม · emoji/สี/ตัวเลข เดิม

✅ แปลเป็นอังกฤษเนทีฟ (โทนเพื่อนเล่าให้เพื่อน · ห้ามคำคลีเช่ AI) ทุกข้อความที่ผู้ใช้เห็น:
- <title>, meta description, og:title/description · nav (จุดหมาย→Destinations, โรงแรม→Hotels, กิน-เที่ยว→Eat & Explore, เกี่ยวกับเรา→About), search placeholder, mobile menu, mobile bar
- เนื้อหาหน้า: หัวข้อ, ย่อหน้า, รายการ, ปุ่ม, ฟอร์ม label/placeholder, footer ทั้งหมด (คอลัมน์/ลิงก์/disclaimer/copyright)
- ชื่อจังหวัด/ภาคไทย→อังกฤษทางการ · ⚠️ ห้ามมีอักษรไทยเหลือเลย (ยกเว้น ฿)

🔧 ปรับสำหรับ EN (อยู่ใต้ /en/):
- <html lang="th"> → <html lang="en">
- canonical → https://thailandaddict.com/en/<name>  ·  og:url เช่นกัน  ·  og:locale → en_US
- เพิ่ม hreflang หลัง canonical: <link rel="alternate" hreflang="th" href="https://thailandaddict.com/<name>"><link rel="alternate" hreflang="en" href="https://thailandaddict.com/en/<name>"><link rel="alternate" hreflang="x-default" href="https://thailandaddict.com/<name>">
  (สำหรับหน้า 404 ใช้ noindex แทน canonical ถ้าต้นฉบับมี — ไม่งั้นใส่ canonical /en/404 ตามปกติ)
- โลโก้ href="/" → href="/en/"
- ปุ่มสลับภาษา: ทำ EN เป็น active (class="lb active"), ปุ่ม TH ไม่ active + onclick="location.href='/<name>.html'" (เวอร์ชันไทยของหน้าเดียวกัน)
- ลิงก์ internal relative (about.html, contact.html, country-thailand.html, city-*.html ฯลฯ) — คงเป็น relative เดิม (resolve ใต้ /en/ อัตโนมัติ) ห้ามเติม / หรือ /en/ นำหน้า

วิธีทำให้ชัวร์: คัดลอกทั้งไฟล์มาก่อน แล้วแก้เฉพาะข้อความ + head/lang/toggle — อย่าเขียนใหม่จากศูนย์
ก่อนจบ: node -e "const h=require('fs').readFileSync('astro/public/en/<name>.html','utf8'); if(/[ก-๛]/.test(h.replace(/฿/g,''))) throw new Error('THAI LEFT'); console.log('OK '+h.length)" ต้องผ่าน + เช็ก <img>/class= count ใกล้เคียงต้นฉบับ
`

let pa = args; if (typeof args === 'string') { try { pa = JSON.parse(args) } catch {} }
const pages = (pa && pa.pages) ? pa.pages.slice() : []
log(`Translating ${pages.length} static pages → EN`)
phase('Translate')
const res = await parallel(pages.map(name => () =>
  agent(
`สร้างเวอร์ชันอังกฤษของหน้า static: name=${name}
${RULES.replace(/<name>/g, name)}`,
    { label: `static:${name}`, phase: 'Translate', model: 'opus' }
  ).then(()=>({name, ok:true})).catch(()=>({name, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`EN static pages written: ${ok}/${pages.length}`)
return { total: pages.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.name) }
