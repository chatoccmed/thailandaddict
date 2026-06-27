export const meta = {
  name: 'mochit-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน #19 Mochit-Chatuchak — 3 NEW premium hotels (Centara Grand Ladprao 5★ / Josh 4★ / Best Western Chatuchak) to upgrade the budget-heavy existing roundup to a proper top-10. Reuses 8 existing จตุจักร/หมอชิต reviews. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW premium Mochit-Chatuchak hotel' }],
}

// NEW premium hotels (reuse not included: boutique-poo-yai-ma 3★9.1 / baan-nueng 3★8.7 / tobacco-one 3★8.6 / jatujak-studio 3★8.6 / cu-inn 3★8.3 / bed-to-bangkok 2★8.4 / g9 2★7.8 / baan-ti-luck 2★7.0)
const HOTELS = [
  { name: 'Centara Grand at Central Plaza Ladprao Bangkok', slug: 'review-centara-grand-central-plaza-ladprao-bangkok', star: 5, area: 'จตุจักร · ติด Central Plaza Ladprao · ใกล้ MRT พหลโยธิน/BTS หมอชิต · เดินถึงสวนจตุจักร', dim: 'hotels' },
  { name: 'Josh Hotel', slug: 'review-josh-hotel-bangkok', star: 4, area: 'สะพานควาย · พหลโยธินซอย 7 · ไลฟ์สไตล์โฮเทล สระว่ายน้ำ retro · ใกล้ BTS สะพานควาย/อารีย์', dim: 'hotels' },
  { name: 'Best Western Chatuchak', slug: 'review-best-western-chatuchak-bangkok', star: 3, area: 'จตุจักร · เดินไม่กี่นาทีถึงตลาดนัดจตุจักร + BTS หมอชิต/MRT กำแพงเพชร', dim: 'hotels' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านหมอชิต/จตุจักร/สะพานควาย/ลาดพร้าวตอนต้น
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ในฟิลด์ bookingBooking)
- breadcrumb/parent: parentHref="top10-hotels-mochit-chatuchak-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-mochit-chatuchak-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านหมอชิต-จตุจักร"(EN "Mochit-Chatuchak") · crumbCityHref="area-bangkok-mochit-chatuchak.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): หมอชิต-จตุจักร = ตลาดนัดจตุจักร (JJ Weekend Market) ใหญ่สุดในไทย, JJ Green/Mixt Chatuchak, อ.ต.ก. ตลาดของสด, สวนจตุจักร-สวนรถไฟปั่นจักรยาน, Union Mall, จุดเชื่อม BTS หมอชิต+MRT สวนจตุจักร/กำแพงเพชร, หมอชิตคือประตูสู่ภาคเหนือ/อีสาน (สถานีขนส่งหมอชิต 2) — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** (images/hotels มีรูปจังหวัด/ย่านอื่นปน) · โหลดผิด curl ทับชื่อเดิม
- related/prev/next: ลิงก์ไปรีวิวจริงในย่านนี้ (เช่น review-boutique-poo-yai-ma-bp-place-bangkok, review-tobacco-one-bangkok, review-jatujak-studio-in-bangkok, review-baan-nueng-service-apartment-bangkok, review-cu-inn-bangkok + อีก 2 hotel ใหม่ในชุดนี้) — **ห้ามเดา/แต่งชื่อไฟล์รูปการ์ด related** (ใช้ heroImg จริง ถ้าไม่รู้เว้น img)
- ⚠️ ก่อนบันทึก: ค้นไฟล์ตัวเองหาคำต้องห้าม แก้เป็นคำธรรมชาติก่อนบันทึก · JSON ถูก escape (\\" ใน text · ห้าม " ลอย)
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★)`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (หมอชิต-จตุจักร กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "top10-hotels-mochit-chatuchak-bangkok (10 โรงแรมยอดนิยมย่านหมอชิต-จตุจักร)"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่างให้ยึด override
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:
${slugList}
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })), failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
