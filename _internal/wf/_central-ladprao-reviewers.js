export const meta = {
  name: 'central-ladprao-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Central Ladprao / Ha Yaek Lat Phrao (เซ็นทรัลลาดพร้าว-ห้าแยกลาดพร้าว) interchange. 5 NEW hotels, all 2-3★ value (flagships taken by Mochit/Ladprao). Returns per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Ha Yaek Ladprao hotel' }],
}
const HOTELS = [
  { name: 'Apartelle Jatujak Hotel (อพาร์เทล จตุจักร)', slug: 'review-apartelle-jatujak-central-ladprao-bangkok', star: 3, area: 'ลาดพร้าว ซ.1 ที่ THE LINE พหลโยธิน พาร์ค · ติดห้าแยกลาดพร้าว/BTS-MRT พหลโยธิน · 3★ คะแนน ~9.4 · ทำเลอินเตอร์เชนจ์เป๊ะสุด', dim: 'value' },
  { name: 'The Plimplace Hotel (เดอะ พลิมเพลส)', slug: 'review-plimplace-central-ladprao-bangkok', star: 3, area: '3338 ถ.พหลโยธิน (พหลฯ ตอนบน) · เดิน ~5 นาที BTS ห้าแยกลาดพร้าว (พหลโยธิน 24) · 3★ คะแนน ~8.7 รีวิว ~367', dim: 'value' },
  { name: 'TD Bangkok Hotel (ทีดี แบงค็อก)', slug: 'review-td-bangkok-central-ladprao-bangkok', star: 2, area: 'ลาดพร้าว ซ.1 (ใกล้ห้าแยก) · ~0.7 กม. MRT พหลโยธิน · 2★ บัดเจ็ต คะแนน ~8.7 รีวิว ~483 · คุ้มเงิน', dim: 'value' },
  { name: 'The Lux Ladprao 10 (เดอะ ลักซ์ ลาดพร้าว 10)', slug: 'review-the-lux-ladprao-10-central-bangkok', star: 3, area: 'ซ.ลาดพร้าว 10 · ~0.96 กม. BTS ห้าแยกลาดพร้าว/MRT พหลโยธิน · 3★ คะแนน ~8.8 (รีวิวยังน้อย ~40)', dim: 'value' },
  { name: 'Grandview Ladprao Hotel (แกรนด์วิว ลาดพร้าว)', slug: 'review-grandview-ladprao-central-bangkok', star: 3, area: 'ซ.ลาดพร้าว 15 (ฝั่งเซ็นทรัลลาดพร้าว/อินเตอร์เชนจ์) · เดิน ~13-15 นาที เซ็นทรัลลาดพร้าว · 3★ คะแนน ~7.0 รีวิว ~195', dim: 'value' },
]
const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงโซนห้าแยกลาดพร้าว/พหลโยธินตอนบน
- ⚠️ มุมขายของย่าน = ห้าแยกลาดพร้าว (จุดตัด BTS ห้าแยกลาดพร้าว + MRT พหลโยธิน) · เซ็นทรัลลาดพร้าว · ยูเนี่ยนมอลล์ · พหลโยธินตอนบน · เชื่อมจตุจักร/หมอชิต — เขียนให้สื่อทำเลอินเตอร์เชนจ์รถไฟฟ้า+ห้างเซ็นทรัลลาดพร้าว เดินทางสะดวก ราคาคุ้ม
- ⛔ ห้ามหยิบโรงแรมที่เป็นของหน้า Mochit-Chatuchak/Ladprao แล้ว: Centara Grand at Central Plaza Ladprao, Best Western Chatuchak, Josh Hotel, Bed To Bangkok, Baan Nueng, Tobacco One, Jatujak Studio, C U Inn, G9, The Quarter Ladprao, President Chokchai 4, Livotel Lat Phrao, 48 Metro, Bangkok Cha Cha Suite, Synsiri Ladprao 130, Kiatthada, T3 Residence, Fullrich, Grandview Condominia — ถ้าซ้ำให้ทักใน note
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json
- เขียน 2 ไฟล์: reviews/<slug>.json (ไทย) + reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL — URL จริงเท่านั้น
- breadcrumb/parent: parentHref="top5-hotels-central-ladprao-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top5-hotels-central-ladprao-bangkok" (EN /en/) · crumbCityName="ย่านเซ็นทรัลลาดพร้าว"(EN "Central Ladprao") · crumbCityHref="area-bangkok-central-ladprao.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง
- รูป hero+แกลเลอรี: โหลดจริง ≥3 รูปไป astro/public/images/hotels/bangkok-<short>.jpg · ⚠️ ถ้าเว็บ/curl ถูกบล็อก รายงาน "WEB BLOCKED" + ok:false — ห้ามใช้รูปโรงแรมอื่น/กุ
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อน · JSON escape ถูก (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมไม่มีจริง/ปิด/ยืนยันไม่ได้ ให้เลือกที่พักโซนห้าแยกลาดพร้าวที่จองได้จริงแทน + บอกใน note · ทุกตัว 2-3★ จริง
`
const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, imagesDownloaded:{type:'number'}, note:{type:'string'} } }
phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านเซ็นทรัลลาดพร้าว-ห้าแยกลาดพร้าว กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "top5-hotels-central-ladprao-bangkok (5 ที่พักยอดนิยม/ราคาประหยัดย่านห้าแยกลาดพร้าว)"
อ่าน .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำครบทุกขั้นตอน (วิจัยเว็บจริง → schema → TH+EN → โหลดรูป)
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:\n${slugList}
คืน { slug, ok, starRating, score, priceFrom, imagesDownloaded, note } (imagesDownloaded ≥3, ok=false ถ้าเว็บบล็อก)`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,90) }))
))
const ok=reviewed.filter(x=>x&&x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed }
