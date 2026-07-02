export const meta = {
  name: 'saphan-taksin-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Saphan Taksin (สะพานตากสิน / ท่าสาทร / โรบินสันบางรัก / สาทร) — 7 NEW hotels. REUSE existing Prince Theatre. Honest top-8; value-5 ⊆ main. Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Saphan Taksin hotel' }],
}
// ⚠️ REUSE (exists, do NOT re-review — reference in roundup): Prince Theatre Heritage Stay (review-prince-theatre-heritage-stay-bangkok, chinatown roundup). Only 7 NEW below.
const HOTELS = [
  { name: 'Centre Point Plus Hotel Silom (เซ็นเตอร์ พอยต์ พลัส สีลม)', slug: 'review-centre-point-plus-silom-saphan-taksin-bangkok', star: 4, area: '1522/2 ซ.เจริญกรุง 50 บางรัก (บนอาคารเซ็นทรัล/โรบินสันบางรัก) · เดิน ~120 ม. ท่าเรือสาทร/Central Pier + BTS สะพานตากสิน · 4★ flagship ย่าน คะแนน ~8.7', dim: 'hotels' },
  { name: 'Bangkok Marriott Hotel The Surawongse (แบงค็อก แมริออท เดอะ สุรวงศ์)', slug: 'review-marriott-surawongse-saphan-taksin-bangkok', star: 5, area: '262 ถ.สุรวงศ์ สี่พระยา บางรัก · ~600 ม. BTS สะพานตากสิน/สุรศักดิ์ · เดินถึงท่าสาทร+ตลาดบางรัก · 5★ คะแนน ~9.1', dim: 'hotels' },
  { name: 'Furama Silom Bangkok (ฟูรามา สีลม)', slug: 'review-furama-silom-saphan-taksin-bangkok', star: 4, area: '533 ถ.สีลม บางรัก (ปลายสีลมฝั่งเจริญกรุง) · ~350 ม. BTS สะพานตากสิน · เดินถึงตลาดบางรัก/โรบินสัน · 4★', dim: 'hotels' },
  { name: 'Jasaen Stylish Boutique Hotel (จษเสน สไตลิช บูทีค)', slug: 'review-jasaen-boutique-saphan-taksin-bangkok', star: 3, area: 'ซ.เจริญกรุง บางรัก · บูทีคจากตึกแถวเก่า 7 คูหา · ใกล้ BTS สะพานตากสิน · 3★ คะแนน ~8.8 รีวิว ~2,124', dim: 'value' },
  { name: 'Sathorn Terrace Apartment (สาทร เทอเรส อพาร์ตเมนต์)', slug: 'review-sathorn-terrace-saphan-taksin-bangkok', star: 3, area: 'ซ.สวนพลู สาทร · เซอร์วิสอพาร์ตเมนต์ราคาประหยัด เดิน ~230 ม. BTS (โซนสาทร-สะพานตากสิน) · 3★ คะแนน ~7.8 รีวิว ~220', dim: 'value' },
  { name: 'P & R Residence Hotel (พี แอนด์ อาร์ เรสซิเดนซ์)', slug: 'review-pr-residence-saphan-taksin-bangkok', star: 3, area: 'ย่านบางรัก (ใกล้ใจกลางบางรัก ~0.5 กม.) · ห้องพักราคาประหยัด · เดินถึงตลาดบางรัก/โรบินสัน + BTS สะพานตากสิน · 3★', dim: 'value' },
  { name: 'New Road Guest House (นิวโรด เกสต์เฮาส์)', slug: 'review-new-road-guesthouse-saphan-taksin-bangkok', star: 3, area: '1216/1 ถ.เจริญกรุง บางรัก · เกสต์เฮาส์บูทีค ~35 ห้อง มีร้านอาหาร/บาร์ · เดินถึงตลาดบางรัก/อัสสัมชัญ + BTS สะพานตากสิน · เริ่ม ~฿935', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงโซนสะพานตากสิน/ท่าสาทร/บางรัก/สาทร
- ⚠️ จุดขาย = "ติด BTS สะพานตากสิน + ท่าเรือสาทร (Central Pier) ต่อเรือด่วนเจ้าพระยา + โรบินสันบางรัก + เข้าสีลม/สาทรง่าย" · โรงแรมมีทั้ง 4-5★ ริมสาทรและบูทีค/เกสต์เฮาส์บางรัก
- ⛔ ห้ามหยิบทาวเวอร์ริมเจ้าพระยาของ riverside (Mandarin Oriental/Shangri-La/Peninsula/Millennium Hilton/Royal Orchid Sheraton/Chatrium Riverside/AVANI+) · ห้ามชุดสีลม-สาทรที่อยู่หน้า silom-sathorn แล้ว (Eastin Grand Sathorn/W/COMO/Sukhothai/Pullman Hotel G/Crowne Plaza Lumpini/Urbana Sathorn ฯลฯ — **ถ้าโรงแรมที่ระบุซ้ำกับหน้า silom-sathorn ให้ทักใน note**) · ห้ามที่พักที่อยู่หน้า charoen-krung (Oriental Heritage/Unplugged/Loftel/Glad/A Sleep/Bangkok Hub)
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ครบทุก field
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — ใช้ URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top8-hotels-saphan-taksin-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top8-hotels-saphan-taksin-bangkok" (EN /en/) · crumbCityName="ย่านสะพานตากสิน"(EN "Saphan Taksin") · crumbCityHref="area-bangkok-saphan-taksin.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน: สะพานตากสิน = BTS สะพานตากสิน, ท่าเรือสาทร/Central Pier (เรือด่วน+เรือข้ามฟาก), โรบินสันบางรัก, ตลาดบางรัก, อัสสัมชัญ, ชุมชนฮารูณ, สาทร-สีลม, ริมเจ้าพระยา — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมไม่มีจริง/ปิด/ยืนยันไม่ได้ ให้เลือกที่พักโซนสะพานตากสิน/บางรักที่จองได้จริงแทน + บอกใน note · value ต้อง 2-3★ จริง
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านสะพานตากสิน กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-saphan-taksin-bangkok (โรงแรมราคาประหยัด 2-3★)':'top8-hotels-saphan-taksin-bangkok (8 โรงแรมยอดนิยมย่านสะพานตากสิน)'}"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
const ok=reviewed.filter(x=>x&&x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed }
