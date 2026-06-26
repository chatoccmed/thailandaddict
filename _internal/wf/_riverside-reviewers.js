export const meta = {
  name: 'riverside-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน #12 Riverside (Chao Phraya riverfront) — 8 new luxury hotel-dim + 5 new value-dim (verify 2-3★) reviews (TH+EN JSON + self-hosted hero/gallery). Returns a compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Riverside hotel → TH+EN review JSON + images' }],
}

// NEW hotels (reuse not included: mandarin-oriental-bangkok 5★, the-peninsula-bangkok 5★)
const HOTELS = [
  // hotel-dim (top10-hotels-riverside-bangkok) — luxury riverfront
  { name: 'Shangri-La Bangkok', slug: 'review-shangri-la-bangkok', star: 5, area: 'ริมเจ้าพระยา · บางรัก · ติด BTS สะพานตากสิน', dim: 'hotels' },
  { name: 'Millennium Hilton Bangkok', slug: 'review-millennium-hilton-bangkok', star: 5, area: 'ริมเจ้าพระยา ฝั่งคลองสาน · ติด ICONSIAM', dim: 'hotels' },
  { name: 'AVANI+ Riverside Bangkok Hotel', slug: 'review-avani-plus-riverside-bangkok', star: 5, area: 'ริมเจ้าพระยา ฝั่งธนฯ · รูฟท็อปบาร์ Attitude วิวแม่น้ำ', dim: 'hotels' },
  { name: 'Chatrium Hotel Riverside Bangkok', slug: 'review-chatrium-riverside-bangkok', star: 5, area: 'ริมเจ้าพระยา เจริญกรุง · เจริญนคร', dim: 'hotels' },
  { name: 'Royal Orchid Sheraton Hotel & Towers', slug: 'review-royal-orchid-sheraton-bangkok', star: 5, area: 'ริมเจ้าพระยา สี่พระยา · ใกล้ ICONSIAM/ท่าเรือ', dim: 'hotels' },
  { name: 'Anantara Riverside Bangkok Resort', slug: 'review-anantara-riverside-bangkok', star: 5, area: 'ริมเจ้าพระยา ฝั่งธนฯ · รีสอร์ตในเมือง สวนริมน้ำ', dim: 'hotels' },
  { name: 'Four Seasons Hotel Bangkok at Chao Phraya River', slug: 'review-four-seasons-chao-phraya-bangkok', star: 5, area: 'ริมเจ้าพระยา เจริญกรุง · ลักชัวรีริมน้ำ', dim: 'hotels' },
  { name: 'Ramada Plaza by Wyndham Bangkok Menam Riverside', slug: 'review-ramada-plaza-menam-riverside-bangkok', star: 4, area: 'ริมเจ้าพระยา เจริญกรุง · เรือรับส่ง BTS สะพานตากสิน', dim: 'hotels' },
  // value-dim (top5-love-hotels-riverside-bangkok) — MUST verify 2-3★
  { name: 'ibis Bangkok Riverside', slug: 'review-ibis-bangkok-riverside', star: 3, area: 'ริมเจ้าพระยา ฝั่งธนฯ ใต้สะพานตากสิน · สระริมน้ำ', dim: 'value' },
  { name: 'ibis Bangkok Sathorn', slug: 'review-ibis-bangkok-sathorn', star: 3, area: 'เจริญกรุง-สาทร · เดินถึงท่าเรือ/BTS สะพานตากสิน', dim: 'value' },
  { name: 'Aurum The River Place', slug: 'review-aurum-the-river-place-bangkok', star: 3, area: 'ท่าเตียน ริมเจ้าพระยา · วิววัดอรุณ', dim: 'value' },
  { name: 'Baan Wanglang Riverside', slug: 'review-baan-wanglang-riverside-bangkok', star: 3, area: 'วังหลัง ฝั่งธนฯ ริมเจ้าพระยา', dim: 'value' },
  { name: 'Loften Hotel Bangkok', slug: 'review-loften-hotel-bangkok', star: 3, area: 'เจริญกรุง · ใกล้แม่น้ำเจ้าพระยา', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงริมเจ้าพระยา/เจริญกรุง/สาทร/ฝั่งธนฯ
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-riverside-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-riverside-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านริมเจ้าพระยา"(EN "Riverside") · crumbCityHref="area-bangkok-riverside.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): ริมเจ้าพระยา = วิวแม่น้ำ, เรือโรงแรม/เรือด่วน/เรือรับส่ง BTS สะพานตากสิน, ICONSIAM, Asiatique, วัดอรุณ-วัดโพธิ์, รูฟท็อปบาร์ริมน้ำ, ซันเซ็ตริมเจ้าพระยา, ย่านเจริญกรุงเก่า — เขียนรีวิวให้สื่อเสน่ห์ริมน้ำนี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** (images/hotels มีรูปจังหวัด/ย่านอื่นปน) · โหลดผิด curl ทับชื่อเดิม
- related/prev/next: ใช้ "เฉพาะ slug รีวิวจริงในชุดนี้" (รายชื่อด้านล่าง) — **ห้ามเดา/แต่งชื่อไฟล์รูปของการ์ด related** (ใช้ heroImg จริงของรีวิวเป้าหมายเท่านั้น ถ้าไม่รู้ให้เว้น img)
- ⚠️ ก่อนบันทึก: ค้นไฟล์ตัวเองหาคำต้องห้าม แก้เป็นคำธรรมชาติก่อนบันทึก · ใส่ JSON ถูก escape (\\" ใน text · ห้าม " ลอย)
- ⚠️ value-dim: ยืนยัน starRating จริง (ต้อง 2 หรือ 3 ดาวเท่านั้น). ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/จริง ๆ 4 ดาว" ให้เลือกโรงแรม 2-3★ ริมเจ้าพระยา/เจริญกรุง/สาทร ที่ป๊อปสุดบน Agoda/Booking/Trip มาแทน แล้วใช้ slug review-<ชื่อ-kebab>-bangkok + บอกใน return ว่าใช้ตัวไหน
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'},
  priceFrom:{type:'string'}, note:{type:'string', description:'สั้น ๆ ถ้ามีปัญหา/เปลี่ยนโรงแรม/จริง ๆ 4 ดาว'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ริมเจ้าพระยา กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-riverside-bangkok (โรงแรมราคาประหยัด 2-3★ ริมน้ำ)':'top10-hotels-riverside-bangkok (10 โรงแรมริมเจ้าพระยายอดนิยม)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่างให้ยึด override
${OVERRIDES}
โรงแรมอื่นในชุดนี้ (related/prev/next ได้ เฉพาะรีวิวจริง):
${slugList}
(reuse ที่มีอยู่แล้ว ลิงก์ถึงได้: review-mandarin-oriental-bangkok, review-the-peninsula-bangkok)
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
