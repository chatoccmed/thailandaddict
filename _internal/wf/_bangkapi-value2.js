export const meta = {
  name: 'bangkapi-value2',
  description: 'Review 2 more budget value hotels for Bangkapi (@81 Hotel + Grand Mandarin Latphrao 130) to complete a proper 2-3★ value-5. Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: '2 Bangkapi value hotels' }],
}
const HOTELS = [
  { name: '@81 Hotel (แอท 81 โฮเทล)', slug: 'review-at-81-hotel-bangkapi-bangkok', star: 3, area: '9 ซ.รามคำแหง 81 (เชื่อมลาดพร้าว 130) คลองจั่น บางกะปิ · ~3 นาที(รถ)ถึงเดอะมอลล์บางกะปิ · โรงแรมราคาประหยัด ~80 ห้อง', dim: 'value' },
  { name: 'Grand Mandarin Latphrao 130 (แกรนด์ แมนดาริน ลาดพร้าว 130)', slug: 'review-grand-mandarin-latphrao-130-bangkapi-bangkok', star: 2, area: '152 ลาดพร้าว 130 แยก 2 คลองจั่น บางกะปิ · โรงแรม/เกสต์เฮาส์ประหยัด ~50 ห้อง · ใกล้เดอะมอลล์บางกะปิ', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านบางกะปิ/คลองจั่น/เดอะมอลล์บางกะปิ
- โรงแรมราคาประหยัด 2-3★ · จุดขาย "ใกล้เดอะมอลล์บางกะปิ + แยกลำสาลี MRT สายสีเหลือง + คุ้มเงิน"
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ครบทุก field
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top5-love-hotels-bangkapi-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top5-love-hotels-bangkapi-bangkok" (EN /en/) · crumbCityName="ย่านบางกะปิ"(EN "Bangkapi") · crumbCityHref="area-bangkok-bangkapi.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขาย: เดอะมอลล์ ไลฟ์สโตร์ บางกะปิ, แยกลำสาลี MRT สายสีเหลือง, คลองจั่น, เข้าเมือง/สนามบินสะดวก
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย) · ถ้าโรงแรมยืนยันไม่ได้ เลือกโรงแรมประหยัดบางกะปิที่จองได้จริงแทน + บอกใน note
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, value)`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านบางกะปิ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "top5-love-hotels-bangkapi-bangkok (โรงแรมราคาประหยัด 2-3★)" + main "top10-hotels-bangkapi-bangkok"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
return { results: reviewed }
