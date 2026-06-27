export const meta = {
  name: 'on-nut-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน #15 On Nut–Phra Khanong — 7 new hotel-dim + 4 new value-dim (verify 2-3★) reviews (TH+EN JSON + self-hosted hero/gallery). Returns a compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW On Nut hotel → TH+EN review JSON + images' }],
}

// NEW hotels (reuse not included: avani-sukhumvit-bangkok 5★, innside-by-melia-sukhumvit-bangkok 3★, somerset-sukhumvit-71-bangkok 4★, hop-inn-onnut-bangkok 2★)
const HOTELS = [
  // hotel-dim (top10-hotels-on-nut-bangkok)
  { name: 'Cross Vibe Bangkok Sukhumvit', slug: 'review-cross-vibe-bangkok-sukhumvit', star: 4, area: 'สุขุมวิท ใกล้ BTS อ่อนนุช · ไลฟ์สไตล์โฮเทล', dim: 'hotels' },
  { name: 'Hotel Amber Sukhumvit 85', slug: 'review-hotel-amber-sukhumvit-85-bangkok', star: 4, area: 'สุขุมวิท 85 · เดิน 5 นาทีถึง BTS อ่อนนุช', dim: 'hotels' },
  { name: 'Aspira Skye Sukhumvit', slug: 'review-aspira-skye-sukhumvit-bangkok', star: 4, area: 'สุขุมวิท ย่านอ่อนนุช-พระโขนง', dim: 'hotels' },
  { name: 'Citadines On Nut Bangkok', slug: 'review-citadines-on-nut-bangkok', star: 4, area: 'สุขุมวิท ใกล้ BTS อ่อนนุช · เซอร์วิสอพาร์ตเมนต์', dim: 'hotels' },
  { name: 'Blu Monkey Hub and Hotel Bangkok', slug: 'review-blu-monkey-hub-hotel-bangkok', star: 4, area: 'พระโขนง · ใกล้ BTS อ่อนนุช/พระโขนง', dim: 'hotels' },
  { name: 'Qiu Hotel Sukhumvit', slug: 'review-qiu-hotel-sukhumvit-on-nut-bangkok', star: 3, area: 'สุขุมวิท 79 · เดิน 3 นาทีถึง BTS อ่อนนุช', dim: 'hotels' },
  { name: 'Kokotel Bangkok Sukhumvit 50', slug: 'review-kokotel-bangkok-sukhumvit-50', star: 3, area: 'สุขุมวิท 50 · เดิน 5 นาทีถึง BTS อ่อนนุช', dim: 'hotels' },
  // value-dim (top5-love-hotels-on-nut-bangkok) — MUST verify 2-3★
  { name: 'ibis Styles Bangkok Sukhumvit Phra Khanong', slug: 'review-ibis-styles-sukhumvit-phra-khanong-bangkok', star: 3, area: 'พระโขนง · ติด BTS พระโขนง', dim: 'value' },
  { name: 'Aspira Hotel Sukhumvit 71', slug: 'review-aspira-sukhumvit-71-bangkok', star: 3, area: 'สุขุมวิท 71 · ย่านพระโขนง-อ่อนนุช', dim: 'value' },
  { name: 'Hotel 92 Sukhumvit', slug: 'review-hotel-92-sukhumvit-bangkok', star: 3, area: 'สุขุมวิท ย่านอ่อนนุช · บัดเจ็ตบูทีค', dim: 'value' },
  { name: 'The Bedrooms Boutique Hotel Sukhumvit', slug: 'review-the-bedrooms-sukhumvit-on-nut-bangkok', star: 3, area: 'สุขุมวิท ย่านอ่อนนุช-พระโขนง · บัดเจ็ต', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านอ่อนนุช/พระโขนง/สุขุมวิทตอนปลาย
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-on-nut-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-on-nut-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านอ่อนนุช"(EN "On Nut") · crumbCityHref="area-bangkok-on-nut.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): อ่อนนุช-พระโขนง = ย่าน Sukhumvit ตอนปลายที่คนรุ่นใหม่+ชาวต่างชาติชอบ, BTS อ่อนนุช/พระโขนง, W District ลานสตรีทฟู้ด-บาร์, Habito Mall, Summer Hill, Big C อ่อนนุช, ราคาที่พักคุ้มกว่าสุขุมวิทตอนต้น เดินทางเข้าเมืองสะดวก — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** (images/hotels มีรูปจังหวัด/ย่านอื่นปน) · โหลดผิด curl ทับชื่อเดิม
- related/prev/next: ใช้ "เฉพาะ slug รีวิวจริงในชุดนี้" (รายชื่อด้านล่าง) — **ห้ามเดา/แต่งชื่อไฟล์รูปของการ์ด related** (ใช้ heroImg จริงของรีวิวเป้าหมายเท่านั้น ถ้าไม่รู้ให้เว้น img)
- ⚠️ ก่อนบันทึก: ค้นไฟล์ตัวเองหาคำต้องห้าม แก้เป็นคำธรรมชาติก่อนบันทึก · ใส่ JSON ถูก escape (\\" ใน text · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอบน Agoda/Booking/Trip" ให้เลือกโรงแรมที่ป๊อปสุดในย่านอ่อนนุช/พระโขนง (ระดับดาวเดียวกับที่ขอ) มาแทน แล้วใช้ slug review-<ชื่อ-kebab>-bangkok + บอกใน return ว่าใช้ตัวไหน · value-dim ต้อง 2-3★ จริงเท่านั้น (4★ ให้บอกใน note เพื่อย้ายไป hotels)
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'},
  priceFrom:{type:'string'}, note:{type:'string', description:'สั้น ๆ ถ้าเปลี่ยนโรงแรม/จริง ๆ 4 ดาว/ปัญหา'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (อ่อนนุช-พระโขนง สุขุมวิท กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-on-nut-bangkok (โรงแรมราคาประหยัด 2-3★)':'top10-hotels-on-nut-bangkok (10 โรงแรมยอดนิยม)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่างให้ยึด override
${OVERRIDES}
โรงแรมอื่นในชุดนี้ (related/prev/next ได้ เฉพาะรีวิวจริง):
${slugList}
(reuse ที่มีอยู่แล้ว ลิงก์ถึงได้: review-avani-sukhumvit-bangkok, review-innside-by-melia-sukhumvit-bangkok, review-somerset-sukhumvit-71-bangkok, review-hop-inn-onnut-bangkok)
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
