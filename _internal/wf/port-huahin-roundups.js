export const meta = {
  name: 'port-huahin-roundups',
  description: 'Build the 6 Hua Hin roundups from the 39 already-written reviews (the prior workflow died before its Roundup phase).',
  phases: [ { title: 'Roundup', detail: 'build 6 roundups, map each hotel to its existing review file' } ],
}

const PROV='ประจวบคีรีขันธ์', CLUSTER='huahin', CRUMB='หัวหิน', CRUMBHREF='city-huahin.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + roundupSchema (astro/src/content.config.ts) + .claude/agents/tourlogy-roundup-builder.md`;

const ROUNDS = [
  { newSlug:'top10-luxury-5star-hotels-huahin', old:'top10-5star-hotels-hua-hin', title:'10 โรงแรมหรู 5 ดาว ริมหาดหัวหิน-ชะอำ', n:10 },
  { newSlug:'top15-popular-hotels-huahin', old:'top-15-huahin-hotels', title:'15 ที่พักยอดนิยม ทำเลดี ใกล้หาดหัวหิน', n:15 },
  { newSlug:'top10-khao-takiab-beach-hotels-huahin', old:'top10-khao-takiab-beach-huahin-hotel', title:'10 ที่พักริมหาดเขาตะเกียบ หัวหิน', n:10 },
  { newSlug:'top10-night-market-hotels-huahin', old:'top10-night-market-huahin-hotels', title:'10 ที่พักใกล้ตลาดกลางคืน ใจกลางหัวหิน', n:10 },
  { newSlug:'top8-budget-hotels-huahin', old:'top10-prachuap-khiri-khan-hotels', title:'8 ที่พักหลักร้อยในหัวหิน', n:8 },
  { newSlug:'top5-hostels-huahin', old:'5-hostel-huahin', title:'5 Hostel ยอดนิยมในหัวหิน', n:5 },
];

phase('Roundup')
const rounds = await parallel(ROUNDS.map(R => () =>
  agent(`สร้าง roundup ใหม่ "${R.title}" (พอร์ตจาก ${R.old}) — รีวิวโรงแรมหัวหินเขียนเสร็จแล้วบนดิสก์ (39 ไฟล์) งานคือสร้างหน้า roundup ที่ลิงก์ไปไฟล์รีวิวที่มีอยู่
ขั้นตอน:
1) Read _internal/migration/oldposts/${R.old}.txt → ดูรายชื่อโรงแรม+ลำดับ+จำนวน (เลขในชื่อ=${R.n})
2) ls astro/src/content/reviews/ | grep huahin → จับคู่โรงแรมแต่ละแห่งกับไฟล์รีวิวที่มีอยู่ (อ่านไฟล์เพื่อดึง name/score/price/rooms/agoda/booking/trip/heroImg/ทำเล) · ถ้าโรงแรมไหนไม่มีไฟล์รีวิวตรง ให้เลือกโรงแรมหัวหินที่มีไฟล์รีวิวแล้วและเข้าธีมแทน (อย่าอ้างไฟล์ที่ไม่มี)
3) ${GOLD}
OUTPUT: astro/src/content/roundups/${R.newSlug}.json (ไทย) ครบ roundupSchema · slug="${R.newSlug}" · cluster="${CLUSTER}" · crumbCity "${CRUMB}" · breadcrumb→${CRUMBHREF}
- **entries/toc/compareRows = ${R.n} เท่ากัน เรียงตรงตำแหน่ง** · id=h1..h${R.n} · rank/toc.n=1..${R.n} ต่อเนื่อง · reviewUrl=<slug>.html ชี้ไฟล์รีวิวที่มีจริง
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** สไตล์เพื่อนเล่า · score/priceBig/rooms/agodaUrl/bookingUrl/tripUrl/img = ตามไฟล์รีวิว
- เลขในชื่อ/h1/heroStats = ${R.n} · introHtml/mrtHtml/advice/faq ครบแบบเทมเพลต
${STYLE}
⚠️ ก่อนเสร็จ: node -e ตรวจ JSON.parse + entries.length===toc.length===compareRows.length===${R.n} + reviewUrl ทุกอันชี้ไฟล์ที่มีจริง + ค้นคำต้องห้าม=0 · return: ok`,
    { label:`rnd:${R.newSlug}`, phase:'Roundup' })
    .then(()=>({slug:R.newSlug,ok:true})).catch(e=>({slug:R.newSlug,ok:false,e:String(e).slice(0,80)}))
))
return { built: rounds.filter(x=>x&&x.ok).map(x=>x.slug), failed: rounds.filter(x=>x&&!x.ok) }
