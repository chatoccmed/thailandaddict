export const meta = {
  name: 'charoen-krung-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Charoen Krung (เจริญกรุง Creative District) — 6 NEW boutique/hostel hotels (Oriental Heritage flagship + creative-district hostels). REUSE existing Loftel 22. Honest top-7; hotels thin (creative district is the star). Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Charoen Krung hotel' }],
}
// ⚠️ REUSE (exists, do NOT re-review — reference in roundup): Loftel 22 (review-loftel-22-hostel-bangkok, chinatown roundup). Only 6 NEW below.
const HOTELS = [
  { name: 'Oriental Heritage Residence (โอเรียนทัล เฮอริเทจ เรสซิเดนซ์)', slug: 'review-oriental-heritage-residence-charoen-krung-bangkok', star: 3, area: '1180 ถ.เจริญกรุง บางรัก (ย่านเครื่องประดับ) · เดิน ~10 นาที BTS สะพานตากสิน · 3★ แองเคอร์ย่าน คะแนน ~8.9 รีวิว ~1,318', dim: 'hotels' },
  { name: 'Unplugged at Bangrak Design Hostel (อันปลั๊ก แอท บางรัก)', slug: 'review-unplugged-bangrak-charoen-krung-bangkok', star: 3, area: '15 ซ.เจริญกรุง 50 บางรัก · ใกล้ Warehouse 30/TCDC · โฮสเทลดีไซน์ คะแนน ~8.9 รีวิว ~272', dim: 'value' },
  { name: 'Glad Bangkok Hostel Bar and Restaurant (แกลด แบงค็อก)', slug: 'review-glad-bangkok-charoen-krung-bangkok', star: 3, area: '45 ซ.เจริญกรุง 50 บางรัก · โฮสเทล+บาร์+ร้านอาหาร ย่าน creative district', dim: 'value' },
  { name: 'A Sleep Bangkok Charoenkrung (อะ สลีป เจริญกรุง)', slug: 'review-a-sleep-charoenkrung-bangkok', star: 3, area: 'ถ.เจริญกรุง บางรัก ใกล้แม่น้ำ/creative district · โฮสเทล/บูทีคราคาประหยัด', dim: 'value' },
  { name: 'Bangkok Hub Hostel (แบงค็อก ฮับ โฮสเทล)', slug: 'review-bangkok-hub-hostel-charoen-krung-bangkok', star: 2, area: 'ถ.เจริญกรุง บางรัก · โฮสเทลบัดเจ็ต ใกล้ creative district/BTS สะพานตากสิน', dim: 'value' },
  { name: 'Charoenkrung Place (เจริญกรุง เพลส)', slug: 'review-charoenkrung-place-bangkok', star: 3, area: 'ถ.เจริญกรุง (ปลายเหนือ ใกล้โรงมหรสพเฉลิมกรุง) · โรงแรมราคาประหยัด · คะแนนไม่สูง (~6.1) เขียนตรงไปตรงมา', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านเจริญกรุง-บางรัก (Creative District)
- ⚠️ ย่านนี้จุดขายคือ Creative District (TCDC/Warehouse 30) ไม่ใช่โรงแรมหรู · โรงแรมเป็นบูทีค/เฮอริเทจ/โฮสเทลราคาประหยัดเป็นหลัก · เขียนตรงไปตรงมา จุดขาย = "อยู่กลาง Creative District เดินง่าย เจริญกรุง-บางรัก ใกล้ BTS สะพานตากสิน + แม่น้ำ"
- ⛔ ห้ามหยิบทาวเวอร์ริมเจ้าพระยา (Mandarin Oriental/Shangri-La/Peninsula/Millennium Hilton/Royal Orchid Sheraton — ของ riverside) · ห้ามชุดสีลม-สาทร (Eastin/W/COMO/Sukhothai — ของ silom) · ห้ามที่พักที่อยู่หน้า saphan-taksin (Centre Point Plus Silom/Marriott Surawongse/Furama/Jasaen ฯลฯ) — ยึดแกนเจริญกรุง-บางรัก creative district
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ครบทุก field
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — ใช้ URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top7-hotels-charoen-krung-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top7-hotels-charoen-krung-bangkok" (EN /en/) · crumbCityName="ย่านเจริญกรุง"(EN "Charoen Krung") · crumbCityHref="area-bangkok-charoen-krung.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน: เจริญกรุง = Creative District, TCDC (ศูนย์สร้างสรรค์งานออกแบบ), Warehouse 30, ถนนสายแรกของไทย, ย่านเครื่องประดับบางรัก, So Heng Tai, อัสสัมชัญ, ริมเจ้าพระยา, BTS สะพานตากสิน + เรือด่วน — เขียนรีวิวให้สื่อเสน่ห์เมืองเก่า-อาร์ตติซาน
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมไม่มีจริง/ปิด/ยืนยันไม่ได้ ให้เลือกบูทีค/โฮสเทลเจริญกรุงที่จองได้จริงแทน + บอกใน note · value ต้อง 2-3★ จริง
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านเจริญกรุง กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-charoen-krung-bangkok (โรงแรมราคาประหยัด 2-3★)':'top7-hotels-charoen-krung-bangkok (7 โรงแรมยอดนิยมย่านเจริญกรุง)'}"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
const ok=reviewed.filter(x=>x&&x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed }
