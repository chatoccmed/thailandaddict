export const meta = {
  name: 'bang-khen-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Bang Khen (บางเขน) far-north — 5 NEW budget hotels (Gems Park/Petchsiri/Leelawadee/54 Place/5 Chang Palace). Thin far-north district → honest top-5 (all 2-3★, no 4★ anchor). Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Bang Khen hotel' }],
}

// All NEW — no existing Bang Khen reviews. Honest top-5 (area genuinely thin, budget-only).
const HOTELS = [
  { name: 'Gems Park (เจมส์ พาร์ค)', slug: 'review-gems-park-bang-khen-bangkok', star: 3, area: 'ซอยพหลโยธิน 59 อนุสาวรีย์ บางเขน · ~140 ม.จาก BTS พหลโยธิน 59 · ~1 กม. BTS วัดพระศรีมหาธาตุ · เดินทางสะดวกสุดของย่าน', dim: 'hotels' },
  { name: 'Petchsiri Boutique Hotel (เพชรศิริ บูทีค)', slug: 'review-petchsiri-boutique-bang-khen-bangkok', star: 2, area: 'ซอยรามอินทรา 19 อนุสาวรีย์ บางเขน · บูทีคบัดเจ็ตยอดนิยมสุดของย่าน รีวิวเยอะ ~500', dim: 'value' },
  { name: 'Leelawadee Resotel Raminthra 23 (ลีลาวดี รีโซเทล รามอินทรา)', slug: 'review-leelawadee-resotel-raminthra-bangkok', star: 3, area: 'ซอยรามอินทรา 23 แยก 8 อนุสาวรีย์ บางเขน · รีสอร์ตในเมืองสไตล์บัดเจ็ต', dim: 'hotels' },
  { name: '54 Place Saphan Mai (54 เพลส สะพานใหม่)', slug: 'review-54-place-saphan-mai-bangkok', star: 2, area: 'พหลโยธิน 54 คลองถนน สายไหม · ใกล้ BTS สะพานใหม่ · เกสต์เฮาส์/โรงแรมบัดเจ็ต (Trip 3★ / TripAdvisor 2★ — ใช้ 2★)', dim: 'value' },
  { name: '5 Chang Palace Hotel (ห้าช้าง พาเลซ)', slug: 'review-5-chang-palace-bang-khen-bangkok', star: 2, area: 'ซอยรามอินทรา 5 แยก 9 อนุสาวรีย์ บางเขน · บัดเจ็ต 18 ห้อง (OYO)', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านบางเขน/อนุสาวรีย์พิทักษ์รัฐธรรมนูญ/วัดพระศรีมหาธาตุ/สะพานใหม่/รามอินทรา (ฝั่งตะวันตก)
- ⚠️ ย่านนี้เป็นย่านเหนือสุด/ที่อยู่อาศัย โรงแรมส่วนใหญ่เป็นบูทีค/บัดเจ็ต/เกสต์เฮาส์ ไม่มี 4★ — เขียนตรงไปตรงมา จุดขายคือ "คุ้มเงิน ใกล้ BTS สายสีเขียวเหนือ เข้าเมือง/ดอนเมืองสะดวก" ไม่ปั้นให้หรู · ห้ามหยิบโรงแรมฝั่งเกษตร-นวมินทร์ (คนละย่าน) หรือ ดอนเมือง airport (มี roundup แยกแล้ว)
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top5-hotels-bang-khen-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top5-hotels-bang-khen-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านบางเขน"(EN "Bang Khen") · crumbCityHref="area-bangkok-bang-khen.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): บางเขน = อนุสาวรีย์พิทักษ์รัฐธรรมนูญ (วงเวียนหลักสี่), วัดพระศรีมหาธาตุ (พระธาตุเจดีย์), BTS สายสีเขียวเหนือ (วัดพระศรีมหาธาตุ/สะพานใหม่) เข้าเมืองตรง, ใกล้สนามบินดอนเมือง, กองทัพอากาศ, ม.เกริก/ศรีปทุม, ตลาดยิ่งเจริญสะพานใหม่ (ตลาดใหญ่), ย่านที่พักคุ้มเงินโซนเหนือ — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · ถ้าโหลดรูปจริงไม่ได้ อย่าใช้รูปโรงแรมอื่นมาแทน — บอกใน note ว่ารูปไม่พอ
- related: ลิงก์ไปรีวิวจริงย่านบางเขนในชุดนี้เท่านั้น — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงย่านบางเขน/อนุสาวรีย์ (ระดับดาวเดียวกัน) มาแทน + บอกใน return ว่าใช้ตัวไหน · value-dim ต้อง 2-3★ จริง
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านบางเขน กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-bang-khen-bangkok (โรงแรมราคาประหยัด 2-3★)':'top5-hotels-bang-khen-bangkok (5 โรงแรมยอดนิยมย่านบางเขน)'}"
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
