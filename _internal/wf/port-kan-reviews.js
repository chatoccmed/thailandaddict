export const meta = {
  name: 'port-kan-reviews',
  description: 'Write 2 kanchanaburi reviews: pung-waan (sai-yok roundup ref, socket-fail) + kg-house (single feature).',
  phases: [ { title: 'Review', detail: '2 reviews >=2000w' } ],
}
const PROV='กาญจนบุรี', CLUSTER='kanchanaburi', CRUMB='กาญจนบุรี', CRUMBHREF='city-kanchanaburi.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`reviewSchema (astro/src/content.config.ts) + .claude/agents/tourlogy-hotel-reviewer.md + รีวิว kanchanaburi ที่มีเป็นโครง`;
const REVS = [
  { slug:'review-pung-waan-resort-kanchanaburi', name:'Pung Waan Resort & Spa', area:'ริมแม่น้ำแคว ไทรโยค', old:'top10-kanchanaburi-hotels', short:'pungwaan' },
  { slug:'review-kg-house-kanchanaburi', name:'KG House', area:'ริมน้ำ เมืองกาญจนบุรี (รีสอร์ตธีมสวิส/ฮัลล์สตัทท์)', old:'kg-house-kanchanaburi-switzerland-hallstatt-austria', short:'kghouse' },
];
phase('Review')
await parallel(REVS.map(R => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${R.name}" (${R.area}) ${PROV} — **body ภาษาไทย ≥6,800 อักษรไทย (≈2000 คำ)**
อ่าน _internal/migration/oldposts/${R.old}.txt (หา ${R.name}) + ${GOLD}
ก่อนเขียน: ถ้ามีไฟล์ astro/src/content/reviews/${R.slug}.json อยู่แล้ว body ≥6800 → return exists
OUTPUT: astro/src/content/reviews/${R.slug}.json (ไทย) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥6800 อักษรไทย: ภาพรวม/ทำเล/ห้อง/สิ่งอำนวยฯ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา/ข้อควรรู้/สรุป
- affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href Trip/Agoda
- รูป: curl -m 60 -A "Mozilla/5.0" รูปจริง(Ostrovok/Tripadvisor ไม่เอา Trip.com) → astro/public/images/hotels/kanchanaburi-${R.short}-1..4.jpg แล้ว node _internal/optimize-images.mjs <paths>; หาไม่ได้ปล่อย onerror
${STYLE}
⚠️ JSON valid · อักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้`,
    { label:`rev:${R.slug}`, phase:'Review' }).then(()=>({ok:1})).catch(()=>({ok:0}))
))
return { done:true }
