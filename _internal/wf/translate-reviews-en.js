export const meta = {
  name: 'translate-reviews-en',
  description: 'Translate Thai hotel review JSON → English (reviews-en/) at native travel-copy quality, structure/links/numbers/images preserved',
  phases: [
    { title: 'Translate', detail: 'one agent per review → astro/src/content/reviews-en/<slug>.json' },
  ],
}

// args.slugs = explicit list of review slugs to translate (orchestrator passes them)

const RULES = `
บทบาท: คุณคือ Web Developer + นักแปลไทย→อังกฤษระดับเนทีฟสายท่องเที่ยว งานนี้แปลไฟล์เนื้อหา JSON ของ "รีวิวโรงแรม" (reviewSchema) — Astro ใช้ layout เดียว render ทั้ง TH/EN → โครงสร้าง HTML/รูป/เลย์เอาต์เหมือนกัน 100% อัตโนมัติ

OUTPUT: เขียนไฟล์เดียวด้วย Write ที่ astro/src/content/reviews-en/<slug>.json — ต้องเป็น JSON valid · top-level keys + ลำดับ + จำนวนสมาชิก array ทุกชุด เหมือนไฟล์ไทยเป๊ะ (schema เดียวกัน)

⛔ คงไว้เป๊ะ ๆ ห้ามแก้ (โครงสร้าง/ข้อมูล/ลิงก์/รูป/ตัวเลข):
- slug, cluster, type, typeEn, typeFull, qiType, name (ชื่อโรงแรม/แบรนด์), parentShort ที่เป็นชื่อแบรนด์, prevName, nextName, addressLocality, streetAddress (เป็นอังกฤษ/ชื่อเฉพาะอยู่แล้ว), badgeMid ถ้าเป็นอังกฤษอยู่แล้ว
- score, starRating, ratingCount, priceRange(ตัวเลข), ratingBars[].value/width, booking/agoda.score — ตัวเลขคงเดิมทุกตัว
- รูปทุก path: image, heroImg, heroSub1, heroSub2, mapImg, gallery[], related[].img (ขึ้นต้น images/ หรือ .jpg/.webp/.png) — คงเดิมห้ามแตะ
- URL/ลิงก์ทุกอัน: bookingAgoda, bookingBooking, bookingTrip, agoda(affiliate url), heroSub2Href, และ relative .html ทุกอัน (parentHref, countryHref, crumbCityHref, prevHref, nextHref, related[].href) — คง URL เดิม (ระบบ /en/ เติม prefix ให้เอง)
- icon/emoji (🏛️🌿📍🇹🇭🌅 ฯลฯ), color hex (#c8a951), rankColor, badgeColor — คงเดิม
- ‼️ ข้อยกเว้นเดียวที่ต้องแก้ลิงก์: **parentCrumbUrl** เป็น absolute URL → แทรก "/en/" หลังโดเมน เช่น https://thailandaddict.com/top10-hotels-chiang-mai → https://thailandaddict.com/en/top10-hotels-chiang-mai

✅ แปลเป็นอังกฤษเนทีฟ (สำนวนเพื่อนเล่าให้เพื่อน honest ไม่ใช่แปลตรงตัวเครื่อง) ทุก field ที่ผู้อ่านเห็น:
- title (≤~60 char มีชื่อโรงแรม+เมือง+Thailand), metaDesc(≤~160), keywords, ogTitle, ogDesc, twDesc, schemaDesc, h1(คงแท็ก <em>/HTML)
- navReviewLabel("รีวิวโรงแรม"→"Hotel Review"), parentName, parentCrumbName, crumbCityName(ชื่อเมืองอังกฤษทางการ), countryLabel("🇹🇭 ไทย"→"🇹🇭 Thailand"), countryGuideLabel, relatedTitle, faqTitle, prevLabel("← ก่อนหน้า"→"← Previous"), nextLabel("ถัดไป →"→"Next →")
- badgeLoc, hiLoc, hiTag, qiRooms("30 ห้องสวีท"→"30 suites"), qiPrice(ตัวเลขคง), qiPriceUnit("/คืน"→"/night"), qiCol5Label/Value/Small, heroSub2 ถ้าเป็นข้อความ (ถ้าเป็น path คงเดิม)
- intro, body[] (p.html คงแท็ก HTML แปลข้อความ · ทุก kind เช่น p/h2/list), highlights[].title/text, ratingBars[].label, rooms[].name(คงถ้าเป็นชื่อห้องเฉพาะ)/full(แปลคำ คงตัวเลข), booking.pros[]/cons[], agoda.pros[]/cons[], honestSummary(คงแท็ก), honestChecks[](คงแท็ก), tips[].title/body, info[].k/v (ค่า v แปลคำคงข้อมูล), nearby[].n/d, related[].name/loc/price, faq[].q/a(คงแท็ก), galleryAlts[]

หน่วย/คำที่ต้องแปลง (ตัวเลขคงเดิมเสมอ):
- เงิน: ฿ → THB (เช่น ฿18,000 → THB 18,000) · /คืน → /night · เริ่ม → from
- พื้นที่: ตร.ม. → sqm · ระยะ: กม. → km
- เวลานับ: นาที → min · ชั่วโมง → hr
- เวลานาฬิกา: "15:00 น." → "3:00 PM" · "12:00 น." → "12:00 PM" (24h→12h)
- การเดินทาง: "~10 นาทีรถ" → "~10 min drive" · "~3 นาทีเดิน" → "~3 min walk"
- "ฟรีทุกห้อง" → "Free in all rooms" · "ค.ศ. 1880" → "1880"

มาตรฐานสูง (สำคัญ):
- โทน honest/EEAT คงครบ — pros/cons, honestChecks, เตือนอากาศ/ความปลอดภัย/ราคาผันผวน/ทำเล แปลเป็นอังกฤษให้ตรงความหมายเดิม ห้ามตัดเสียงเตือนทิ้ง
- ⛔ ห้ามแต่งข้อมูลเพิ่ม: ห้ามคิดสถานที่/ราคา/ตัวเลข/จุดเด่นที่ไม่มีในไฟล์ไทย แปลเฉพาะที่มี
- ชื่อเฉพาะไทย→ทับศัพท์อังกฤษที่ใช้จริง (วัดเกต→Wat Gate, น้ำปิง→Ping River) · ชื่อโรงแรม/ห้อง/แบรนด์คงเดิม
- ห้ามคำคลีเช่ AI: world-class, nestled, boasts, a testament to, hidden gem, must-visit(เกร่อ), in the heart of(เกร่อ), unparalleled, breathtaking(เกร่อ)

ก่อนจบ: node -e "JSON.parse(require('fs').readFileSync('astro/src/content/reviews-en/<slug>.json','utf8'))" parse ผ่าน + เช็ก keys เท่าไฟล์ไทย. เขียนเฉพาะไฟล์ reviews-en/<slug>.json เท่านั้น ห้ามแตะไฟล์ไทย
`

log('args typeof=' + (typeof args) + ' value=' + JSON.stringify(args).slice(0, 200))
let parsedArgs = args
if (typeof args === 'string') { try { parsedArgs = JSON.parse(args) } catch {} }
let slugs = (parsedArgs && parsedArgs.slugs) ? parsedArgs.slugs.slice() : []
const existing = new Set(parsedArgs && parsedArgs.existingEn ? parsedArgs.existingEn : [])
slugs = slugs.filter(s => !existing.has(s))
log(`Translating ${slugs.length} hotel reviews → EN`)

phase('Translate')
const res = await parallel(slugs.map(slug => () =>
  agent(
`แปลรีวิวโรงแรมนี้เป็นภาษาอังกฤษ: อ่าน astro/src/content/reviews/${slug}.json (ต้นฉบับไทย) แล้วสร้าง astro/src/content/reviews-en/${slug}.json
${RULES}
slug=${slug} (คง slug/cluster/type เดิมจากไฟล์ไทย). รายงานสั้น ๆ: จำนวน body blocks + JSON valid ไหม + parentCrumbUrl แก้ /en/ แล้วหรือยัง`,
    { label: `rev-en:${slug}`, phase: 'Translate', model: 'opus' }
  ).then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`EN reviews written: ${ok}/${slugs.length}`)
return { total: slugs.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
