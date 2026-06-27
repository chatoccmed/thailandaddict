export const meta = {
  name: 'bangna-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน #25 Bang Na — 5 NEW hotels (Avana/Lasalle Suites/Brighton/Shade House BITEC/56 Hotel) to pair with 5 existing Bangna reviews for a proper top-10. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Bang Na hotel' }],
}

// NEW (reuse not included: thomson-hotels-and-residences-bangna 4★9.0 / cubic-bangna 3★9.2 / takka-hotel-bangna 3★8.9 / romance-hotel-sukhumvit-97 3★8.5 / hop-inn-bangna 2★9.2)
const HOTELS = [
  { name: 'Avana Bangkok Hotel & Convention Centre', slug: 'review-avana-bangkok-hotel-convention-centre', star: 4, area: 'บางนา · ใกล้ BITEC + Mega Bangna · สระว่ายน้ำ ศูนย์ประชุม', dim: 'hotels' },
  { name: 'Lasalle Suites Hotel & Residence', slug: 'review-lasalle-suites-hotel-residence-bangna', star: 4, area: 'สุขุมวิท 105 (ลาซาล) บางนา · เซอร์วิสสวีท สระว่ายน้ำ สนามบาส', dim: 'hotels' },
  { name: 'Brighton Hotel Bangkok', slug: 'review-brighton-hotel-bangna-bangkok', star: 3, area: 'บางนา · เดิน ~10 นาทีถึง BITEC · ห้องสว่างโมเดิร์น', dim: 'hotels' },
  { name: 'Shade House BITEC Bangna', slug: 'review-shade-house-bitec-bangna', star: 3, area: 'บางนา · เดิน ~8 นาทีถึง BITEC · บูทีคบัดเจ็ต', dim: 'hotels' },
  { name: '56 Hotel Bangna', slug: 'review-56-hotel-bangna', star: 3, area: 'บางนา · บัดเจ็ตยอดนิยม ใกล้ BITEC/BTS บางนา', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านบางนา/สุขุมวิทตอนปลาย/ลาซาล
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top10-hotels-bangna-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-bangna-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านบางนา"(EN "Bang Na") · crumbCityHref="area-bangkok-bangna.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): บางนา = BITEC (ศูนย์ประชุม/งานแฟร์ใหญ่), Mega Bangna + IKEA, Central Bangna, Bangkok Mall (เปิดใหม่ใหญ่สุดอาเซียน), BTS บางนา/อุดมสุข + สายสีเหลือง, ประตูสู่สุวรรณภูมิ/บางพลี/ชลบุรี, ย่านคนทำงาน-ครอบครัว — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · โหลดผิด curl ทับชื่อเดิม
- related: ลิงก์ไปรีวิวจริงย่านบางนา (review-thomson-hotels-and-residences-bangna-bangkok, review-cubic-bangna-bangkok, review-takka-hotel-bangna-bangkok, review-hop-inn-bangna-bangkok + hotel ใหม่ในชุดนี้) — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ" ให้เลือกโรงแรมที่ป๊อปสุดในย่านบางนา (ระดับดาวเดียวกัน) มาแทน + บอกใน return ว่าใช้ตัวไหน · value-dim ต้อง 2-3★ จริง
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (บางนา กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-bangna-bangkok (โรงแรมราคาประหยัด 2-3★)':'top10-hotels-bangna-bangkok (10 โรงแรมยอดนิยม)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่าง
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:
${slugList}
(reuse: review-thomson-hotels-and-residences-bangna-bangkok, review-cubic-bangna-bangkok, review-takka-hotel-bangna-bangkok, review-romance-hotel-sukhumvit-97-bangkok, review-hop-inn-bangna-bangkok)
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })), failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }
