export const meta = {
  name: 'port-bkk-reviews',
  description: 'Write 2 missing bangkok reviews (viva-garden, chateau-de-sukhumvit) referenced by bang-chak roundup (socket-fail).',
  phases: [ { title: 'Review', detail: '2 reviews >=2000w' } ],
}
const PROV='กรุงเทพ', CLUSTER='bangkok', CRUMB='กรุงเทพ', CRUMBHREF='city-bangkok.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`reviewSchema (astro/src/content.config.ts) + .claude/agents/tourlogy-hotel-reviewer.md + รีวิว bangkok ที่มีเป็นโครง`;
const REVS = [
  { slug:'review-viva-garden-serviced-residence-bangkok', name:'Viva Garden Serviced Residence', area:'ใกล้ BTS บางจาก สุขุมวิท', short:'vivagarden' },
  { slug:'review-chateau-de-sukhumvit-bangkok', name:'Chateau de Sukhumvit', area:'ใกล้ BTS บางจาก สุขุมวิท', short:'chateausukhumvit' },
];
phase('Review')
await parallel(REVS.map(R => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${R.name}" (${R.area}) ${PROV} — **body ภาษาไทย ≥6,800 อักษรไทย (≈2000 คำ)**
อ่าน _internal/migration/oldposts/topfive-hotels-bangchak-bts.txt (หา ${R.name}) + ${GOLD}
ก่อนเขียน: ถ้ามีไฟล์ astro/src/content/reviews/${R.slug}.json body ≥6800 → return exists
OUTPUT: astro/src/content/reviews/${R.slug}.json (ไทย) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥6800 อักษรไทย: ภาพรวม/ทำเล-BTS/ห้อง/สิ่งอำนวยฯ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา/ข้อควรรู้/สรุป
- affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href Trip/Agoda
- รูป: curl -m 60 -A "Mozilla/5.0" รูปจริง(Ostrovok/Tripadvisor ไม่เอา Trip.com) → astro/public/images/hotels/bangkok-${R.short}-1..4.jpg แล้ว node _internal/optimize-images.mjs <paths>; หาไม่ได้ปล่อย onerror
${STYLE}
⚠️ JSON valid · อักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้`,
    { label:`rev:${R.slug}`, phase:'Review' }).then(()=>({ok:1})).catch(()=>({ok:0}))
))
return { done:true }
