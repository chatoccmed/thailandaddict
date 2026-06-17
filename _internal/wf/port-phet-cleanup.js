export const meta = {
  name: 'port-phet-cleanup',
  description: 'Recover phetchabun socket-fail: write 2 missing city reviews + rebuild city roundup from existing reviews.',
  phases: [ { title: 'Review', detail: '2 missing city reviews' }, { title: 'Roundup', detail: 'rebuild city roundup' } ],
}
const PROV='เพชรบูรณ์', CLUSTER='phetchabun', CRUMB='เพชรบูรณ์', CRUMBHREF='city-phetchabun.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`เทมเพลตทอง: roundups/top5-luxury-5-star-hotels-chiang-mai.json + รีวิว review-u-nimman-chiang-mai.json + schema astro/src/content.config.ts + .claude/agents/tourlogy-hotel-reviewer.md + tourlogy-roundup-builder.md`;

const REVS = [
  { slug:'review-dusita-residence-phetchabun', name:'Dusita Residence', short:'dusita' },
  { slug:'review-the-de-hotel-by-257-group-phetchabun', name:'The De Hotel by 257 Group', short:'thede' },
];
phase('Review')
await parallel(REVS.map(R => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${R.name}" อำเภอเมือง${PROV} — **body ภาษาไทย ≥6,800 อักษรไทย (≈2000 คำ)** (รีวิวตกหล่นจาก socket error)
อ่าน _internal/migration/oldposts/top10-phetchabun-hotels.txt (หา ${R.name}) + ${GOLD} + ดูรีวิว phetchabun ที่มี
OUTPUT: astro/src/content/reviews/${R.slug}.json (ไทย) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥6800 อักษรไทย: ภาพรวม/ทำเล/ห้อง/สิ่งอำนวยฯ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา/ข้อควรรู้/สรุป
- affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href Trip/Agoda
- รูป: curl -m 60 -A "Mozilla/5.0" รูปจริง(Ostrovok/Tripadvisor ไม่เอา Trip.com) → astro/public/images/hotels/phetchabun-${R.short}-1..4.jpg แล้ว node _internal/optimize-images.mjs <paths>; หาไม่ได้ปล่อย onerror
${STYLE}
⚠️ JSON valid · อักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้`,
    { label:`rev:${R.slug}`, phase:'Review' }).then(()=>({ok:1})).catch(()=>({ok:0}))
))
phase('Roundup')
await agent(`สร้าง roundup ใหม่ "10 โรงแรมบรรยากาศดีใจกลางเมืองเพชรบูรณ์" (พอร์ตจาก top10-phetchabun-hotels) — รีวิวโรงแรมเขียนเสร็จแล้วบนดิสก์
1) Read _internal/migration/oldposts/top10-phetchabun-hotels.txt → รายชื่อ 10 โรงแรม+ลำดับ
2) ls astro/src/content/reviews/ | grep phetchabun → จับคู่กับไฟล์รีวิวที่มี (อ่านไฟล์ดึง name/score/price/rooms/agoda/booking/trip/heroImg/ทำเล) · โรงแรมไม่มีไฟล์รีวิว→เลือกโรงแรม phetchabun เมืองที่มีรีวิวแล้วแทน
3) ${GOLD}
OUTPUT: astro/src/content/roundups/top10-phetchabun-city-hotels.json (ไทย) ครบ roundupSchema · slug="top10-phetchabun-city-hotels" · cluster="${CLUSTER}" · crumbCity "${CRUMB}" · breadcrumb→${CRUMBHREF}
- **entries/toc/compareRows = 10 เท่ากัน เรียงตรง** · id=h1..h10 · rank/toc.n=1..10 · reviewUrl=<slug>.html ชี้ไฟล์ที่มีจริง
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** · เลขในชื่อ/h1=10 · introHtml/mrtHtml/advice/faq ครบ
${STYLE}
⚠️ JSON.parse + entries.length===toc.length===compareRows.length===10 + reviewUrl ทุกอันมีจริง + คำต้องห้าม=0`,
  { label:'rnd:phet-city', phase:'Roundup' }).catch(e=>({e:String(e).slice(0,80)}))
return { done:true }
