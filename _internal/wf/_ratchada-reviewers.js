export const meta = {
  name: 'ratchada-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Ratchada / Huai Khwang (รัชดา-ห้วยขวาง) — MRT Cultural Centre / Huai Khwang / Esplanade / The Street Ratchada. 7 NEW hotels. All NEW (rama9 neighbor hotels excluded). Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Ratchada/Huai Khwang hotel' }],
}
const HOTELS = [
  { name: 'Amanta Hotel & Residence Ratchada (อมันตา รัชดา)', slug: 'review-amanta-ratchada-bangkok', star: 4, area: 'ถ.รัชดาภิเษก ฝั่งดินแดง/ศูนย์วัฒนธรรม (ใกล้ Esplanade) · เดิน MRT ศูนย์วัฒนธรรมฯ ~5 นาที · เซอร์วิสอพาร์ตเมนต์ 4★ ห้องกว้าง มีครัว รีวิวเยอะมาก', dim: 'hotels' },
  { name: 'Amaranta Hotel (อมรันตา)', slug: 'review-amaranta-huai-khwang-bangkok', star: 4, area: 'ย่านห้วยขวาง (ประชาราษฎร์บำเพ็ญ) ใกล้ MRT ห้วยขวาง + ถนนมาลา/นิวไชน่าทาวน์ห้วยขวาง · 4★ คะแนน ~8.9', dim: 'hotels' },
  { name: 'Prom Ratchada Thailand Cultural Centre Hotel (พรหม รัชดา)', slug: 'review-prom-ratchada-bangkok', star: 4, area: '~440 ม. MRT ศูนย์วัฒนธรรมฯ · 100 ม. The Street รัชดา + Esplanade · 4★ คะแนน ~8.5 · ทำเลศูนย์วัฒนธรรมเป๊ะ', dim: 'hotels' },
  { name: 'Ratchada Boutique Hotel (รัชดา บูทีค)', slug: 'review-ratchada-boutique-huai-khwang-bangkok', star: 4, area: 'ห้วยขวาง เดิน ~10 นาที MRT ห้วยขวาง ใกล้ The Street/Big C รัชดา · บูทีคเล็ก 4★ คะแนน ~8.7 รีวิว ~1,004', dim: 'hotels' },
  { name: 'S Ratchada Leisure Hotel (เอส รัชดา เลเชอร์)', slug: 'review-s-ratchada-leisure-bangkok', star: 3, area: 'ถ.เทียมร่วมมิตร ห้วยขวาง ใกล้ MRT ห้วยขวาง + ย่านกลางคืนรัชดา · 3★ คะแนน ~7.5 รีวิว ~934 · ราคาประหยัด', dim: 'value' },
  { name: 'Rest@Ratchada Hotel (เรสท์ แอท รัชดา)', slug: 'review-rest-at-ratchada-bangkok', star: 2, area: '252/3 ถ.รัชดาภิเษก ห้วยขวาง (ระหว่าง MRT ห้วยขวาง-สุทธิสาร) · 2★ บัดเจ็ต คะแนน ~8.4 · คุ้มเงิน', dim: 'value' },
  { name: 'P9 Ratchada Hotel (พี 9 รัชดา)', slug: 'review-p9-ratchada-bangkok', star: 3, area: 'ซอยรัชดา ห้วยขวาง เดินสั้น ๆ MRT ห้วยขวาง · โรงแรมใหม่ 3★ คะแนน ~8.9 รีวิว ~423 · บัดเจ็ตทำเลดี', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงโซนรัชดา-ห้วยขวาง
- ⚠️ มุมขายของย่าน = MRT ห้วยขวาง + MRT ศูนย์วัฒนธรรมแห่งประเทศไทย · Esplanade รัชดา · The Street รัชดา (24 ชม.) · ย่านกลางคืน/ร้านอาหารรัชดา · ถนนมาลา-นิวไชน่าทาวน์ห้วยขวาง (หม่าล่า/อาหารจีน) · สถานทูตจีน · เดินทาง MRT เข้าเมือง/สุขุมวิทง่าย — เขียนรีวิวให้สื่อทำเลศูนย์วัฒนธรรม/ห้วยขวางและไลฟ์สไตล์กิน-เที่ยวกลางคืน
- ⛔ ห้ามหยิบโรงแรมที่เป็นของหน้า Rama 9 แล้ว: Jubilee Prestige/Swissôtel Ratchada, Avani Ratchada, The Emerald Ratchada, ZAZZ Urban, Somerset Rama 9, Golden Tulip Sovereign, Maitria Rama 9, Cassia Rama 9, Grand Mercure Atrium, Lancaster, ibis Styles Ratchada, Calmly Stay Ratchada, Best Western Ratchada, Praso Ratchada, Chiva — ถ้าซ้ำให้ทักใน note
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top7-hotels-ratchada-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top7-hotels-ratchada-bangkok" (EN /en/) · crumbCityName="ย่านรัชดา-ห้วยขวาง"(EN "Ratchada") · crumbCityHref="area-bangkok-ratchada.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมไม่มีจริง/ปิด/ยืนยันไม่ได้ ให้เลือกที่พักโซนรัชดา-ห้วยขวางที่จองได้จริงแทน + บอกใน note · value ต้อง 2-3★ จริง
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านรัชดา-ห้วยขวาง กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-ratchada-bangkok (ที่พักราคาประหยัด 2-3★)':'top7-hotels-ratchada-bangkok (7 โรงแรมยอดนิยมย่านรัชดา-ห้วยขวาง)'}"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
const ok=reviewed.filter(x=>x&&x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed }
