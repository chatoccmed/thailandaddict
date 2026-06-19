export const meta = {
  name: 'translate-roundups-en',
  description: 'Translate Thai "Top N hotels" roundup JSON → English (roundups-en/), structure/links/numbers/images preserved',
  phases: [
    { title: 'Translate', detail: 'one agent per roundup → astro/src/content/roundups-en/<slug>.json' },
  ],
}

// args.slugs = explicit list of roundup slugs to translate

const RULES = `
บทบาท: นักแปลไทย→อังกฤษระดับเนทีฟสายท่องเที่ยว แปลไฟล์ JSON ของหน้า "จัดอันดับโรงแรม Top N" (roundupSchema) — Astro layout เดียว render ทั้ง TH/EN → โครงสร้าง/รูป/เลย์เอาต์เหมือนกัน 100% อัตโนมัติ

OUTPUT: เขียนไฟล์เดียวด้วย Write ที่ astro/src/content/roundups-en/<slug>.json — JSON valid · top-level keys + ลำดับ + จำนวนสมาชิก array (toc/entries/compareRows/advice/faq/heroStats/breadcrumb) เหมือนไฟล์ไทยเป๊ะ

⛔ คงไว้เป๊ะ ห้ามแก้:
- slug, image, heroImg (รูป) · navReviewHref และ .html hrefs ทุกอันใน breadcrumb (country-thailand.html, city-<x>.html) คงเดิม
- entries[].id/rank/rankColor/score/stars/badgeColor, toc[].n/color, compareRows[].rank/rankColor/badgeStyle — คงเดิม (id/สี/อันดับ/คะแนน/ดาว)
- ราคา/ตัวเลขทุกตัว (฿400, 8,500, คะแนน 9.3, จำนวนรีวิว, ระยะเมตร/กม.) — คงเดิม
- ‼️ ลิงก์ที่ต้องแก้ (เติม /en/):
  • breadcrumb[0].href: "/" → "/en/"  (เฉพาะตัวแรก ThailandAddict home · ตัวอื่นใน breadcrumb คงเดิม)
  • breadcrumbSchema[].item: absolute URL ทุกตัว แทรก /en/ หลังโดเมน (https://thailandaddict.com/ → https://thailandaddict.com/en/ , .../country-thailand → .../en/country-thailand , .../city-x → .../en/city-x , .../top10-hotels-x → .../en/top10-hotels-x)

✅ แปลเป็นอังกฤษเนทีฟ ทุก field ที่ผู้อ่านเห็น:
- title(≤~60 char + เมือง+Thailand+ปี), metaDesc, ogTitle, ogDesc, h1(คงแท็ก <br>/<span class>), heroEyebrow, heroSub, heroStats[](คงแท็ก <strong>/emoji แปลข้อความ · ราคา ฿ คงเดิม)
- breadcrumb[].name (🇹🇭 ไทย→🇹🇭 Thailand · ชื่อจังหวัดไทย→อังกฤษทางการ · "10 โรงแรม<เมือง>ยอดนิยม"→"Top 10 <City> Hotels")
- breadcrumbSchema[].name เช่นกัน
- navReviewLabel, introH2, introHtml(คงแท็ก HTML), mrtHtml, secLabel, toc[].name(ชื่อโรงแรมคงเดิม · เฉพาะถ้ามีคำไทยปนแปล)
- entries[].type(ประเภทโรงแรม เช่น "บูทีคหรู 5 ดาว ริมแม่น้ำ"→"Luxury Riverside Boutique 5-Star"), .revCount("105 รีวิว"→"105 reviews"), .badge, และทุก field ข้อความใน entry (blurb/pros/cons/desc/เนื้อหา — ชื่อโรงแรม/แบรนด์คงเดิม)
- compareCols[]("ชื่อที่พัก"→"Stay","ดาว"→"Stars","คะแนน"→"Score","ราคา/คืน"→"Price/night","ทำเล"→"Area","จุดเด่น"→"Highlight")
- compareRows[].name(ชื่อคง)/type/access(📍 คง emoji)/badge
- compareTitle, adviceTitle, advice[].head/bodyHtml(คงแท็ก), noteHtml, faqTitle, faq[].q/a(คงแท็ก)

หน่วย/คำ (ตัวเลขคงเดิม): /คืน → /night · ฿ คงเป็น ฿ (สัญลักษณ์เงิน ใช้ได้ในอังกฤษ) · นาที → min · เดิน→walk · รถ→drive · กม.→km · เมตร/ม.→m

มาตรฐาน:
- honest/EEAT: "เสียงจากรีวิวจริง"→"honest take from real reviews" ฯลฯ คงโทนซื่อตรง ห้ามโม้
- ⛔ ห้ามแต่งโรงแรม/ราคา/ตัวเลขเพิ่ม แปลเฉพาะที่มีในไฟล์ไทย
- ชื่อเฉพาะไทย→ทับศัพท์อังกฤษจริง · ชื่อโรงแรม/แบรนด์คงเดิม
- ห้ามคำคลีเช่ AI: world-class, nestled, boasts, hidden gem, must-visit(เกร่อ), in the heart of, breathtaking(เกร่อ)

ก่อนจบ: node -e "JSON.parse(require('fs').readFileSync('astro/src/content/roundups-en/<slug>.json','utf8'))" parse ผ่าน + keys เท่าไฟล์ไทย + breadcrumb[0].href=="/en/" + breadcrumbSchema items มี /en/. เขียนเฉพาะ roundups-en/<slug>.json ห้ามแตะไฟล์ไทย
`

log('args typeof=' + (typeof args) + ' value=' + JSON.stringify(args).slice(0, 200))
let parsedArgs = args
if (typeof args === 'string') { try { parsedArgs = JSON.parse(args) } catch {} }
let slugs = (parsedArgs && parsedArgs.slugs) ? parsedArgs.slugs.slice() : []
const existing = new Set(parsedArgs && parsedArgs.existingEn ? parsedArgs.existingEn : [])
slugs = slugs.filter(s => !existing.has(s))
log(`Translating ${slugs.length} roundups → EN`)

phase('Translate')
const res = await parallel(slugs.map(slug => () =>
  agent(
`แปลหน้าจัดอันดับโรงแรมนี้เป็นภาษาอังกฤษ: อ่าน astro/src/content/roundups/${slug}.json (ต้นฉบับไทย) แล้วสร้าง astro/src/content/roundups-en/${slug}.json
${RULES}
slug=${slug}. รายงานสั้น ๆ: จำนวน entries + JSON valid ไหม + breadcrumb /en/ แก้แล้วหรือยัง`,
    { label: `ro-en:${slug}`, phase: 'Translate', model: 'opus' }
  ).then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`EN roundups written: ${ok}/${slugs.length}`)
return { total: slugs.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
