export const meta = {
  name: 'port-prachuap-cleanup',
  description: 'Recover prachuap socket-fail gaps: write 1 missing review (theatre-villa) + rebuild 3 missing roundups (scenic, sam-roi-yot, bang-saphan) from existing reviews.',
  phases: [
    { title: 'Review', detail: '1 missing review (theatre-villa) >=2000w' },
    { title: 'Roundup', detail: 'rebuild 3 missing roundups from existing review files' },
  ],
}

const PROV='ประจวบคีรีขันธ์', CLUSTER='prachuap-khiri-khan', CRUMB='ประจวบคีรีขันธ์', CRUMBHREF='city-prachuap-khiri-khan.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + รีวิว review-u-nimman-chiang-mai.json + schema astro/src/content.config.ts + .claude/agents/tourlogy-hotel-reviewer.md + tourlogy-roundup-builder.md`;

phase('Review')
await agent(`เขียนรีวิวโรงแรมเชิงลึก "The Theatre Villa" (ย่านบางสะพาน ${PROV}) — **body ภาษาไทย ≥2,000 คำ (≥6,800 อักษรไทย)** (รีวิวนี้ตกหล่นจาก socket error ตอนรันชุด bang-saphan)
อ่าน ${GOLD} + ดูรีวิว prachuap ที่มีเป็นโครง
OUTPUT: astro/src/content/reviews/review-the-theatre-villa-prachuap-khiri-khan.json (ไทย) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥6800 อักษรไทย หัวข้อ: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง/ห้อง/สิ่งอำนวยฯ-สระ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้/สรุป
- วิจัยเว็บจริง · affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · ที่พักเล็กไม่มี OTA: ช่องทางจองจริง อย่าแต่งตัวเลข
- รูป: curl -m 60 -A "Mozilla/5.0" รูปจริง → astro/public/images/hotels/prachuap-theatrevilla-1..4.jpg แล้ว node _internal/optimize-images.mjs <paths>; ไม่ได้ปล่อย onerror
${STYLE}
⚠️ อักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้ · JSON valid`,
  { label:'rev:theatre-villa', phase:'Review' }).catch(e=>({e:String(e).slice(0,80)}))

phase('Roundup')
const ROUNDS = [
  { newSlug:'top10-prachuap-city-scenic-hotels', old:'top10-prachuap-khiri-khan-hotel', title:'10 ที่พักบรรยากาศดีในเมืองประจวบคีรีขันธ์', n:10 },
  { newSlug:'top10-sam-roi-yot-hotels-prachuap-khiri-khan', old:'top10-hotels-sam-roi-yot-prachuap-khiri-khan', title:'10 ที่พักบรรยากาศสวยในสามร้อยยอด ประจวบคีรีขันธ์', n:10 },
  { newSlug:'top6-bang-saphan-hotels-prachuap-khiri-khan', old:'top6-bang-saphan-prachuap-khiri-khan-hotels', title:'6 ที่พักบรรยากาศดี ย่านบางสะพาน ประจวบคีรีขันธ์', n:6 },
];
const rounds = await parallel(ROUNDS.map(R => () =>
  agent(`สร้าง roundup ใหม่ "${R.title}" (พอร์ตจาก ${R.old}) — รีวิวโรงแรมเขียนเสร็จแล้วบนดิสก์ งานคือสร้างหน้า roundup
1) Read _internal/migration/oldposts/${R.old}.txt → รายชื่อโรงแรม+ลำดับ+จำนวน (=${R.n})
2) ls astro/src/content/reviews/ | grep prachuap → จับคู่โรงแรมกับไฟล์รีวิวที่มี (อ่านไฟล์ดึง name/score/price/rooms/agoda/booking/trip/heroImg/ทำเล) · โรงแรมที่ไม่มีไฟล์รีวิวตรง → เลือกโรงแรม prachuap ที่มีไฟล์รีวิวแล้วและเข้าธีม/ย่านเดียวกันแทน (อย่าอ้างไฟล์ที่ไม่มี)
3) ${GOLD}
OUTPUT: astro/src/content/roundups/${R.newSlug}.json (ไทย) ครบ roundupSchema · slug="${R.newSlug}" · cluster="${CLUSTER}" · crumbCity "${CRUMB}" · breadcrumb→${CRUMBHREF}
- **entries/toc/compareRows = ${R.n} เท่ากัน เรียงตรง** · id=h1..h${R.n} · rank/toc.n=1..${R.n} · reviewUrl=<slug>.html ชี้ไฟล์ที่มีจริง
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** · score/priceBig/rooms/agoda/booking/trip/img ตามไฟล์รีวิว · เลขในชื่อ/h1/heroStats=${R.n} · introHtml/mrtHtml/advice/faq ครบ
${STYLE}
⚠️ JSON.parse + entries.length===toc.length===compareRows.length===${R.n} + reviewUrl ทุกอันมีจริง + คำต้องห้าม=0`,
    { label:`rnd:${R.newSlug}`, phase:'Roundup' })
    .then(()=>({slug:R.newSlug,ok:true})).catch(e=>({slug:R.newSlug,ok:false,e:String(e).slice(0,80)}))
))
return { built: rounds.filter(x=>x&&x.ok).map(x=>x.slug), failed: rounds.filter(x=>x&&!x.ok) }
