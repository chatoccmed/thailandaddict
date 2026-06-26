export const meta = {
  name: 'phrom-phong-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน #11 Phrom Phong (Emporium/EmQuartier) — 8 new hotel-dim + 4 new value-dim reviews (TH+EN JSON + self-hosted hero/gallery). Returns a compact per-hotel summary (slug/star/score) for ranking.',
  phases: [
    { title: 'Review', detail: 'one hotel-reviewer agent per NEW Phrom Phong hotel → TH+EN review JSON + images' },
  ],
}

// 12 NEW hotels (reuse-not-included: doubletree-sukhumvit / marriott-marquis-queens-park / s33-compact-sukhumvit)
const HOTELS = [
  // hotel-dim (top10-hotels-phrom-phong-bangkok) — 4-5★
  { name: 'SKYVIEW Hotel Bangkok', slug: 'review-skyview-hotel-bangkok', star: 5, area: 'สุขุมวิทซอย 24 · พร้อมพงษ์ (ติด Emporium/EmQuartier)', dim: 'hotels' },
  { name: 'Emporium Suites by Chatrium', slug: 'review-emporium-suites-by-chatrium-bangkok', star: 5, area: 'บนห้าง Emporium · ติด BTS พร้อมพงษ์ วิว Benjasiri Park', dim: 'hotels' },
  { name: 'Oakwood Suites Bangkok', slug: 'review-oakwood-suites-bangkok', star: 5, area: 'สุขุมวิทซอย 24 · เซอร์วิสอพาร์ตเมนต์ (infinity pool)', dim: 'hotels' },
  { name: 'Maitria Hotel Sukhumvit 18 Bangkok – A Chatrium Collection', slug: 'review-maitria-sukhumvit-18-bangkok', star: 4, area: 'สุขุมวิทซอย 18 · เดินถึง BTS อโศก/พร้อมพงษ์', dim: 'hotels' },
  { name: 'Holiday Inn Bangkok Sukhumvit', slug: 'review-holiday-inn-bangkok-sukhumvit-22', star: 4, area: 'สุขุมวิทซอย 22 · ใกล้พร้อมพงษ์ + Emporium', dim: 'hotels' },
  { name: 'The Davis Bangkok', slug: 'review-the-davis-bangkok', star: 4, area: 'สุขุมวิทซอย 24 · บูทีคใกล้พร้อมพงษ์', dim: 'hotels' },
  { name: 'Park Plaza Bangkok Soi 18', slug: 'review-park-plaza-bangkok-soi-18', star: 4, area: 'สุขุมวิทซอย 18 · ใกล้ BTS อโศก/พร้อมพงษ์', dim: 'hotels' },
  { name: 'Marriott Executive Apartments Sukhumvit Park Bangkok', slug: 'review-marriott-executive-apartments-sukhumvit-park-bangkok', star: 5, area: 'สุขุมวิทซอย 24 · เซอร์วิสอพาร์ตเมนต์ ติด Benjasiri Park', dim: 'hotels' },
  // value-dim (top5-love-hotels-phrom-phong-bangkok) — MUST verify 2-3★
  { name: 'ibis Bangkok Sukhumvit 24', slug: 'review-ibis-bangkok-sukhumvit-24', star: 3, area: 'สุขุมวิทซอย 24 · งบประหยัด เดินถึง Emporium/พร้อมพงษ์', dim: 'value' },
  { name: 'S Box Sukhumvit Hotel', slug: 'review-s-box-sukhumvit-hotel', star: 3, area: 'สุขุมวิทซอย 26 · บัดเจ็ตใกล้พร้อมพงษ์', dim: 'value' },
  { name: 'Best Western Sukhumvit 20', slug: 'review-best-western-sukhumvit-20-bangkok', star: 3, area: 'สุขุมวิทซอย 20 · 3 ดาวคุ้มราคา', dim: 'value' },
  { name: 'Hotel Icon Bangkok', slug: 'review-hotel-icon-bangkok-sukhumvit-22', star: 3, area: 'สุขุมวิทซอย 22 · บัดเจ็ต-บูทีคใกล้พร้อมพงษ์', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงในโซนพร้อมพงษ์/สุขุมวิทตอนกลาง
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-phrom-phong-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-phrom-phong-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านพร้อมพงษ์"(EN "Phrom Phong") · crumbCityHref="area-bangkok-phrom-phong.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): พร้อมพงษ์ = ย่าน EM District (Emporium/EmQuartier/EmSphere), Benjasiri Park, ย่านคนญี่ปุ่น (Japanese town สุขุมวิท 24-39), BTS พร้อมพงษ์, ช้อปปิ้ง-คาเฟ่-อาหารญี่ปุ่น — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** (images/hotels มีรูปจังหวัด/ย่านอื่นปน) · โหลดผิด curl ทับชื่อเดิม
- related/prev/next: ใช้ "เฉพาะ slug รีวิวจริงในชุดนี้" (รายชื่อด้านล่าง) — **ห้ามเดา/แต่งชื่อไฟล์รูปของการ์ด related** (ใช้ heroImg จริงของรีวิวเป้าหมายเท่านั้น ถ้าไม่รู้ให้เว้น img)
- ⚠️ ก่อนบันทึก: ค้นไฟล์ตัวเองหาคำต้องห้าม (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) แก้เป็นคำธรรมชาติก่อนบันทึก · ใส่ JSON ถูก escape (\\" ใน text · ห้าม " ลอย)
- ⚠️ value-dim: ยืนยัน starRating จริง (ต้อง 2 หรือ 3 ดาวเท่านั้น) — ถ้าพบว่าจริง ๆ 4 ดาว ให้ใส่ starRating ที่ถูกต้องและบอกใน return (เราจะคัดออกจาก value list)
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')

const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number', description:'ดาวจริงที่ verify ได้'},
  score:{type:'number', description:'คะแนนรีวิวจริง เช่น 8.7'}, priceFrom:{type:'string', description:'ราคาเริ่มประมาณ เช่น "฿1,800"'},
  note:{type:'string', description:'สั้น ๆ ถ้ามีปัญหา (เช่น ปิดถาวร/เปลี่ยนชื่อ/จริง ๆ 4 ดาว)'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (พร้อมพงษ์/สุขุมวิท) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-phrom-phong-bangkok (โรงแรมราคาประหยัด 2-3★)':'top10-hotels-phrom-phong-bangkok (10 โรงแรมยอดนิยม)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้นจุดที่ override ด้านล่างให้ยึด override
${OVERRIDES}
โรงแรมอื่นในชุดนี้ (ใช้ทำ related/prev/next ได้ เฉพาะที่เป็นรีวิวจริง):
${slugList}
(reuse ที่มีอยู่แล้วในเว็บ ลิงก์ถึงได้: review-doubletree-sukhumvit-bangkok, review-marriott-marquis-queens-park-bangkok, review-s33-compact-sukhumvit-bangkok)
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return {
  total: HOTELS.length, okCount: ok.length,
  results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })),
  failed: reviewed.filter(x => !x || !x.ok).map(x => x && x.slug),
}
