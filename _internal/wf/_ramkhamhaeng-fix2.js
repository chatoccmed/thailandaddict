export const meta = {
  name: 'ramkhamhaeng-fix2',
  description: 'Re-review 2 ramkhamhaeng hotels that failed during the classifier outage: Witz (had dup images) + Anda by St James (missing images + unverified data). Download real images + verify data.',
  phases: [{ title: 'Review', detail: 're-review witz + anda with real images' }],
}
const HOTELS = [
  { name: 'Witz Bangkok Hotel Ramkhamhaeng (วิทซ์ แบงค็อก รามคำแหง)', slug: 'review-witz-bangkok-ramkhamhaeng-bangkok', star: 3, area: '8 ซ.รามคำแหง 35 หัวหมาก บางกะปิ · ตรงข้าม ม.รามคำแหง · 3★ 256 ห้อง มีสระ 2 สระ+ยิม รีโนเวต 2020 · คะแนน ~8.0 (~400 รีวิว รวม Trip 8.2)', dim: 'value' },
  { name: 'Anda Ramkhamhaeng By St James (อันดา รามคำแหง บาย เซนต์เจมส์)', slug: 'review-anda-ramkhamhaeng-st-james-bangkok', star: 3, area: 'รามคำแหง หัวหมาก บางกะปิ · 3★ · ⚠️ ยืนยันที่อยู่ซอย/พิกัด/คะแนน/จำนวนรีวิว/URL จองให้เป๊ะจากเว็บจริง (รอบก่อนยืนยันไม่ได้)', dim: 'hotels' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงรามคำแหง-หัวหมาก
- ⚠️⚠️ **ต้องโหลดรูปจริงของโรงแรมนี้ 4 รูปให้ได้** (hero+แกลเลอรี) ไป astro/public/images/hotels/bangkok-<short>.jpg — รอบก่อน tool เว็บถูกบล็อกทำให้รูปพัง (witz ใช้รูป Pillow B ผิด · anda ไม่มีรูป) · **ถ้า WebFetch/WebSearch/curl ใช้ไม่ได้ ให้รายงานชัดใน note ว่า "WEB BLOCKED" แล้ว ok:false — ห้ามใช้รูปโรงแรมอื่นแทน ห้ามกุ URL จอง/คะแนน**
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ครบทุก field
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — **ใช้ URL จริงที่ยืนยันได้เท่านั้น**
- breadcrumb/parent: parentHref="top10-hotels-ramkhamhaeng-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-ramkhamhaeng-bangkok" (EN /en/) · crumbCityName="ย่านรามคำแหง-หัวหมาก"(EN "Ramkhamhaeng") · crumbCityHref="area-bangkok-ramkhamhaeng.html" · countryHref="country-thailand.html" · addressCountry="TH"
- มุมขาย: ม.รามคำแหง/ABAC หัวหมาก, เดอะมอลล์รามคำแหง, MRT สายสีเหลือง, ARL หัวหมาก, ราชมังคลากีฬาสถาน
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านรามคำแหง-หัวหมาก กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด "top10-hotels-ramkhamhaeng-bangkok". นี่คือการรีวิว "ซ้ำเพื่อแก้" — ไฟล์เดิมมีรูป/ข้อมูลพัง ต้องเขียนทับให้สมบูรณ์ + โหลดรูปจริง
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน ทำครบทุกขั้นตอน · verify เว็บจริง
${OVERRIDES}
โรงแรมอื่นในชุด (สำหรับ related): ${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } — imagesDownloaded = จำนวนรูปจริงที่โหลดสำเร็จ (ต้อง ≥3), ok=false ถ้าเว็บถูกบล็อก`,
    { label:`fix:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,100) }))
))
return { results: reviewed }
