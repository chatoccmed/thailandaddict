export const meta = {
  name: 'ploenchit-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Ploenchit / Wireless Rd (เพลินจิต-วิทยุ) — Central Embassy / embassies / Nai Lert. 4 NEW hotels (embassy-luxury zone, thin). REUSE Shama Sukhumvit. Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Ploenchit hotel' }],
}
// ⚠️ REUSE (exists, do NOT re-review): Shama Sukhumvit Bangkok (review-shama-sukhumvit-bangkok). Only 4 NEW below.
const HOTELS = [
  { name: 'Hotel Indigo Bangkok Wireless Road by IHG (โฮเทล อินดิโก้ วิทยุ)', slug: 'review-hotel-indigo-wireless-ploenchit-bangkok', star: 5, area: 'ถ.วิทยุ (Wireless) ติด Central Embassy · ~400 ม. BTS เพลินจิต · บูทีค 5★ สระ infinity ดาดฟ้า วิวย่านสถานทูต · คะแนน ~9.0', dim: 'hotels' },
  { name: 'Oriental Residence Bangkok (โอเรียนทัล เรสซิเดนซ์)', slug: 'review-oriental-residence-ploenchit-bangkok', star: 5, area: '110 ถ.วิทยุ (แถวสถานทูต/สวนนายเลิศ) · เดิน ~5 นาที BTS เพลินจิต · ออลสวีทลักชัวรีเรสซิเดนซ์ · คะแนน ~9.1', dim: 'hotels' },
  { name: 'Radisson Hotel Chateau de Bangkok (เรดิสสัน ชาโต เดอ แบงค็อก)', slug: 'review-radisson-chateau-ploenchit-bangkok', star: 4, area: 'ซ.ร่วมฤดี 1 (Ruamrudee) หลังถนนเพลินจิต · เดิน ~7 นาที BTS เพลินจิต · 4★ รีแบรนด์ใหม่ ห้องสไตล์เรสซิเดนซ์', dim: 'hotels' },
  { name: 'The Quarter Ploenchit by UHG (เดอะ ควอเตอร์ เพลินจิต)', slug: 'review-the-quarter-ploenchit-bangkok', star: 4, area: 'ย่านเพลินจิต-ร่วมฤดี · เดิน ~5-7 นาที BTS เพลินจิต · 4★ คะแนน ~8.5 รีวิว ~3,103 (คนละที่กับ Quart Ruamrudee)', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงโซนเพลินจิต-วิทยุ-ร่วมฤดี
- ⚠️ มุมขายของย่าน = BTS เพลินจิต · Central Embassy (ห้างหรู) · ถนนวิทยุ/ร่วมฤดี ย่านสถานทูต · สวนนายเลิศ · เดินเชื่อม Chidlom/ชิดลม-ราชประสงค์ · ย่านผู้ดี เงียบหรู ใกล้ธุรกิจ — เขียนให้สื่อความหรู-เงียบ-สะดวกช้อป Central Embassy
- ⛔ ห้ามหยิบทาวเวอร์ที่เป็นของหน้า Chidlom แล้ว: Park Hyatt, Waldorf Astoria, The Athenee, Okura Prestige, Conrad, Sindhorn Kempinski, Grande Centre Point Ploenchit, Sindhorn Midtown, Hansar, Mövenpick BDMS, Quart Ruamrudee, Golden House Chidlom, Nantra Ploenchit, Bangkok City Inn, Wish Inn Chidlom · และ Ratchaprasong (InterContinental/Grand Hyatt Erawan/Amari/Anantara Siam) — ถ้าซ้ำให้ทักใน note
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top5-hotels-ploenchit-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top5-hotels-ploenchit-bangkok" (EN /en/) · crumbCityName="ย่านเพลินจิต"(EN "Ploenchit") · crumbCityHref="area-bangkok-ploenchit.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
- ⚠️ ย่านนี้เป็นโซนหรู แทบไม่มี 2-3★ — ถ้าโรงแรมไม่มีจริง/ปิด/ยืนยันไม่ได้ ให้เลือกที่พักโซนเพลินจิต-ร่วมฤดีที่จองได้จริงแทน + บอกใน note
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านเพลินจิต-วิทยุ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "top5-hotels-ploenchit-bangkok (5 โรงแรมยอดนิยมย่านเพลินจิต-วิทยุ)"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
const ok=reviewed.filter(x=>x&&x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed }
