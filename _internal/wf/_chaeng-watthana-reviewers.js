export const meta = {
  name: 'chaeng-watthana-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Chaeng Watthana (แจ้งวัฒนะ) — 9 NEW in-corridor hotels (Government Complex + Central Chaengwattana + Lak Si-Pak Kret, MRT Pink Line). Main top-9 so value-5 ⊆ main. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Chaeng Watthana hotel' }],
}

// All NEW — no existing Chaeng Watthana reviews. Main top-9; value-5 is a subset (dim=value).
const HOTELS = [
  { name: 'Centara Life Government Complex Hotel & Convention Centre Chaeng Watthana (เซ็นทารา ไลฟ์ ศูนย์ราชการ แจ้งวัฒนะ)', slug: 'review-centara-life-govt-complex-chaeng-watthana-bangkok', star: 4, area: 'ในศูนย์ราชการเฉลิมพระเกียรติ แจ้งวัฒนะ · โรงแรมประชุม/สัมมนาใหญ่ในศูนย์ราชการ · คะแนน ~8.6-8.8', dim: 'hotels' },
  { name: 'Best Western Plus Wanda Grand Hotel (เบสท์ เวสเทิร์น พลัส วันดา แกรนด์)', slug: 'review-best-western-plus-wanda-grand-chaeng-watthana-bangkok', star: 4, area: 'ติดเซ็นทรัลแจ้งวัฒนะ · เดิน ~2 นาทีถึง MRT สายสีชมพู · 4★ คะแนนสูง ~9.1 รีวิว ~970', dim: 'hotels' },
  { name: 'KOO Hotel Bangkok (คู โฮเทล กรุงเทพ)', slug: 'review-koo-hotel-chaeng-watthana-bangkok', star: 3, area: 'ปากเกร็ด-ศรีรัช ใกล้แจ้งวัฒนะ · 3★ คุ้มสุดของย่าน คะแนน ~9.2 รีวิว ~477', dim: 'value' },
  { name: 'The Journey Hotel Laksi (เดอะ เจอร์นีย์ โฮเทล หลักสี่)', slug: 'review-the-journey-hotel-laksi-bangkok', star: 3, area: 'หลักสี่ ใกล้แจ้งวัฒนะ · 3★ คะแนน ~8.8-9.1 รีวิว ~380 คุ้มเงิน', dim: 'value' },
  { name: 'TK Palace Hotel & Convention (ทีเค พาเลซ โฮเทล แอนด์ คอนเวนชั่น)', slug: 'review-tk-palace-hotel-chaeng-watthana-bangkok', star: 4, area: 'แจ้งวัฒนะ ซอย 15 · 4★ 280 ห้อง มีสระว่ายน้ำ คะแนน ~8.7 รีวิว ~701', dim: 'hotels' },
  { name: 'Hop Inn Bangkok Chaengwattana (ฮ็อป อินน์ แจ้งวัฒนะ)', slug: 'review-hop-inn-chaengwattana-bangkok', star: 2, area: 'ถ.แจ้งวัฒนะ · 2★ บัดเจ็ตแบรนด์ (ในเครือ Erawan) คะแนน ~9.1 คุ้มเงิน สะอาด', dim: 'value' },
  { name: 'Narra Hotel Chaengwattana (โรงแรมนารา แจ้งวัฒนะ)', slug: 'review-narra-hotel-chaengwattana-bangkok', star: 4, area: 'แจ้งวัฒนะ ซอย 13 · 4★ คะแนน ~8.0 รีวิว ~520', dim: 'hotels' },
  { name: 'The Willing Hotel and Residence (เดอะ วิลลิ่ง โฮเทล แอนด์ เรสซิเดนซ์)', slug: 'review-the-willing-hotel-chaeng-watthana-bangkok', star: 3, area: 'แจ้งวัฒนะ ซอย 15 · 3★ เซอร์วิสอพาร์ตเมนต์/โรงแรม คะแนน ~8.0 รีวิว ~270', dim: 'value' },
  { name: 'U431 Chaengwattana (ยู431 แจ้งวัฒนะ)', slug: 'review-u431-chaengwattana-bangkok', star: 3, area: 'ปากเกร็ด ใกล้แจ้งวัฒนะ · 2-3★ โรงแรมเล็ก/บูทีค รีวิว ~84-130 คุ้มเงิน', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านแจ้งวัฒนะ/ศูนย์ราชการ/เซ็นทรัลแจ้งวัฒนะ/หลักสี่/ปากเกร็ด
- ⚠️ ย่านนี้เป็นย่านราชการ+ที่อยู่อาศัย โรงแรม 3-4★ ประชุม/บูทีค/บัดเจ็ตเป็นหลัก · จุดขาย = "ใกล้ศูนย์ราชการแจ้งวัฒนะ + เซ็นทรัลแจ้งวัฒนะ + MRT สายสีชมพู + สนามบินดอนเมืองไม่ไกล" · เขียนตรงไปตรงมา
- ⛔ ห้ามหยิบโรงแรมเมืองทองธานี/IMPACT (Novotel IMPACT, ibis IMPACT, My Cocoon — มี roundup เมืองทอง/IMPACT แยกแล้ว) · ห้ามโรงแรมดอนเมือง · วิภาวดี (Asawin/Miracle Grand) · นนทบุรีลึก (Regent/iCheck) · บางเขน · หลักสี่ที่เป็นของย่านบางเขนแล้ว
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top9-hotels-chaeng-watthana-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top9-hotels-chaeng-watthana-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านแจ้งวัฒนะ"(EN "Chaeng Watthana") · crumbCityHref="area-bangkok-chaeng-watthana.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): แจ้งวัฒนะ = ศูนย์ราชการเฉลิมพระเกียรติ (ศาลปกครอง/กระทรวง/กงสุล), เซ็นทรัลแจ้งวัฒนะ, การบินไทยสำนักงานใหญ่, IT/เมืองทองใกล้ (แต่ไม่เอาโรงแรมเมืองทอง), MRT สายสีชมพู (แจ้งวัฒนะ-ปากเกร็ด), สนามบินดอนเมืองไม่ไกล, ปากเกร็ด-เกาะเกร็ด, ย่านคุ้มเงินโซนเหนือ-ราชการ — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · ถ้าโหลดรูปจริงไม่ได้ อย่าใช้รูปโรงแรมอื่นแทน — บอกใน note
- related: ลิงก์ไปรีวิวจริงย่านแจ้งวัฒนะในชุดนี้เท่านั้น — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงย่านแจ้งวัฒนะ (ระดับดาวเดียวกัน) มาแทน + บอกใน return · value-dim ต้อง 2-3★ จริง
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านแจ้งวัฒนะ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-chaeng-watthana-bangkok (โรงแรมราคาประหยัด 2-3★)':'top9-hotels-chaeng-watthana-bangkok (9 โรงแรมยอดนิยมย่านแจ้งวัฒนะ)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่าง
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:
${slugList}
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })), failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
