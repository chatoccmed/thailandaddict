export const meta = {
  name: 'victory-monument-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Victory Monument (อนุสาวรีย์ชัยสมรภูมิ) — the MEDICAL & TRANSPORT hub. 7 NEW hotels near the hospital cluster. REUSE 6 existing (Pullman/Fyn/Hi Sotel/Abloom/VIX/Yello). Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Victory Monument hotel' }],
}
// ⚠️ REUSE (exist, do NOT re-review — reference in roundup): Pullman Bangkok King Power (review-pullman-king-power-bangkok) · Fyn Hotel (review-fyn-hotel-bangkok) · Hi Sotel Victory Monument (review-hi-sotel-victory-monument-bangkok) · Abloom Exclusive Serviced Apartments (review-abloom-exclusive-serviced-apartments-bangkok) · VIX Bangkok at Victory Monument (review-vix-victory-monument-bangkok) · Yello Rooms Hotel (review-yello-rooms-hotel-victory-monument-bangkok). Only 7 NEW below.
const HOTELS = [
  { name: 'Century Park Hotel (เซ็นจูรี่ พาร์ค)', slug: 'review-century-park-victory-monument-bangkok', star: 4, area: '9 ถ.ราชปรารภ (ใกล้อนุสาวรีย์ชัยฯ ~0.6 กม.) · เดิน รพ.พญาไท 2 ~8 นาที · รพ.ราชวิถี ~12 นาที · โรงแรม 4★ full-service มีสระ/ห้องอาหาร ห้องกว้าง เหมาะญาติผู้ป่วยพักหลายคืน', dim: 'hotels' },
  { name: 'De Prime Rangnam Hotel (เดอ ไพร์ม รางน้ำ)', slug: 'review-de-prime-rangnam-victory-monument-bangkok', star: 4, area: 'ถ.รางน้ำ (~500 ม. อนุสาวรีย์ชัยฯ) · บูทีค 4★ ห้องกว้าง สระดาดฟ้า · เดิน รพ.ราชวิถี/สงฆ์ ~10-12 นาที · เงียบ สะอาด เหมาะพักระหว่างรักษาตัว', dim: 'hotels' },
  { name: 'Hotel Holm Bangkok (โฮเทล โฮล์ม — เดิม VDA Residence)', slug: 'review-hotel-holm-victory-monument-bangkok', star: 3, area: 'ถ.ราชวิถี (แถวโรงพยาบาล) · เรสซิเดนซ์ 3★ ห้องกว้างสไตล์อพาร์ตเมนต์ · เดิน รพ.ราชวิถี/รพ.เด็ก สั้น ๆ · ~0.79 กม. อนุสาวรีย์ชัยฯ · เหมาะพักยาวหลายคืน', dim: 'hotels' },
  { name: 'SHIN Hotel Victory Monument (ชิน โฮเทล)', slug: 'review-shin-hotel-victory-monument-bangkok', star: 3, area: 'ถ.ราชวิถี (บนถนนสายโรงพยาบาลพอดี) · โรงแรมใหม่ คะแนนสูง ~8.9/693 · เดิน รพ.ราชวิถี/รพ.เด็ก ~5-8 นาที · ราค่ากลาง ๆ เดินไปหาหมอทุกวันสะดวก', dim: 'value' },
  { name: 'College Haus Rangnam (คอลเลจ เฮาส์ รางน้ำ)', slug: 'review-college-haus-rangnam-victory-monument-bangkok', star: 3, area: 'ถ.รางน้ำ · ห้องสไตล์อพาร์ตเมนต์ มีครัวเล็ก ตู้เย็น เครื่องซักผ้า + สระ · เดิน รพ.ราชวิถี ~0.42 กม./5-6 นาที · เหมาะพักยาวทำอาหารเองระหว่างเฝ้าไข้', dim: 'value' },
  { name: 'True Siam Rangnam Hotel (ทรู สยาม รางน้ำ)', slug: 'review-true-siam-rangnam-victory-monument-bangkok', star: 3, area: '39 ถ.รางน้ำ (คนละที่กับ True Siam Phayathai) · 3★ ห้องกว้างสะอาด รีวิว ~2,578 · มีรถตุ๊กตุ๊กฟรีรับส่งอนุสาวรีย์ชัยฯ/King Power · เดิน รพ.ราชวิถี/สงฆ์ ~8-10 นาที', dim: 'value' },
  { name: 'Victory Park Hostel (วิคตอรี พาร์ค ฮอสเทล)', slug: 'review-victory-park-hostel-victory-monument-bangkok', star: 1, area: 'ซ.ราชวิถี 3 (ลานข้างสวน) · โฮสเทลถูกสุดที่เดินถึง มีห้องส่วนตัว/ห้องครอบครัว ไม่ใช่แค่ดอร์ม · เดิน รพ.ราชวิถี/รพ.เด็ก/พระมงกุฎ สั้น ๆ · 5 นาที BTS อนุสาวรีย์ชัยฯ', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงโซนอนุสาวรีย์ชัยฯ/ราชวิถี/รางน้ำ/สนามเป้า
- ⚠️⚠️ มุมขายหลักของย่านนี้ = **ศูนย์กลางการเดินทางทั่วกรุงเทพ (รถตู้/รถเมล์ไปทุกจังหวัด + BTS interchange) และ "ย่านโรงพยาบาล" — กลุ่มลูกค้าจริงคือคนต่างจังหวัดที่มาหาหมอ + ญาติผู้ป่วยที่ต้องพักหลายคืนใกล้โรงพยาบาล** (รพ.ราชวิถี · รพ.รามาธิบดี · สถาบันสุขภาพเด็กฯ "รพ.เด็ก" · รพ.พระมงกุฎเกล้า · รพ.พญาไท 2 · รพ.สงฆ์ · เลิดสิน). เขียนรีวิวให้เจาะกลุ่มนี้: เน้นระยะเดินถึงโรงพยาบาลไหน กี่นาที, ห้องเงียบพักผ่อนได้จริงหลังเฝ้าไข้, เหมาะพักยาว/รายสัปดาห์, มีครัว/ตู้เย็น/เครื่องซักผ้าไหม, ราคาคุ้มสำหรับพักหลายคืน, เดินทางต่อไปจังหวัด/ส่วนอื่นของกรุงเทพจากอนุสาวรีย์ชัยฯ ง่าย
- ⛔ ห้ามหยิบโรงแรมที่เป็น anchor ของหน้าอื่นแล้ว: ratchathewi (VIE MGallery/Asia Hotel/Siam Swana/Bangkok City Hotel/Evergreen Place/Vic3), phaya-thai (The Sukosol/Eastin Grand Phayathai/True Siam Phayathai/Anajak/Top High), ari (The Quarter Ari), siam/pratunam (Baiyoke/Amari/Pathumwan Princess) — ถ้าที่ระบุซ้ำให้ทักใน note
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ครบทุก field
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — ใช้ URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top10-hotels-victory-monument-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-victory-monument-bangkok" (EN /en/) · crumbCityName="ย่านอนุสาวรีย์ชัยฯ"(EN "Victory Monument") · crumbCityHref="area-bangkok-victory-monument.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมไม่มีจริง/ปิด/ยืนยันไม่ได้ ให้เลือกที่พักโซนอนุสาวรีย์ชัยฯ/ราชวิถีที่จองได้จริงแทน + บอกใน note · value ต้อง 1-3★ จริง
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านอนุสาวรีย์ชัยสมรภูมิ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-victory-monument-bangkok (ที่พักราคาประหยัด 1-3★ ใกล้โรงพยาบาล เหมาะญาติผู้ป่วย)':'top10-hotels-victory-monument-bangkok (10 โรงแรมยอดนิยมย่านอนุสาวรีย์ชัยฯ — ศูนย์กลางเดินทาง+ย่านโรงพยาบาล)'}"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
const ok=reviewed.filter(x=>x&&x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed }
