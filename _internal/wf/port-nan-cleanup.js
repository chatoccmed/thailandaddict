export const meta = {
  name: 'port-nan-cleanup',
  description: 'Rebuild 2 nan roundups (nature, city) that failed on stream-timeout, from existing review files.',
  phases: [ { title: 'Roundup', detail: 'rebuild 2 roundups from existing reviews' } ],
}
const PROV='น่าน', CLUSTER='nan', CRUMB='น่าน', CRUMBHREF='city-nan.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`เทมเพลตทอง: roundups/top5-luxury-5-star-hotels-chiang-mai.json + roundupSchema (astro/src/content.config.ts) + .claude/agents/tourlogy-roundup-builder.md`;
const ROUNDS = [
  { newSlug:'top10-nature-hotels-nan', old:'top10-nan-nature-hotels', title:'10 ที่พักอิงธรรมชาติ สูดโอโซน จังหวัดน่าน', n:10 },
  { newSlug:'top10-nan-city-hotels', old:'top10-nan-hotel', title:'10 โรงแรมในอำเภอเมืองน่าน', n:10 },
];
phase('Roundup')
await parallel(ROUNDS.map(R => () =>
  agent(`สร้าง roundup ใหม่ "${R.title}" (พอร์ตจาก ${R.old}) — รีวิวโรงแรมน่านเขียนเสร็จแล้วบนดิสก์ งานคือสร้างหน้า roundup
1) Read _internal/migration/oldposts/${R.old}.txt → รายชื่อโรงแรม+ลำดับ+จำนวน(${R.n})
2) ls astro/src/content/reviews/ | grep nan → จับคู่โรงแรมกับไฟล์รีวิวที่มี (อ่านดึง name/score/price/rooms/agoda/booking/trip/heroImg/ทำเล) · โรงแรมไม่มีไฟล์รีวิว→เลือกโรงแรม nan ที่มีรีวิวแล้วแทน (อย่าอ้างไฟล์ที่ไม่มี)
3) ${GOLD}
OUTPUT: astro/src/content/roundups/${R.newSlug}.json (ไทย) ครบ roundupSchema · slug="${R.newSlug}" · cluster="${CLUSTER}" · crumbCity "${CRUMB}" · breadcrumb→${CRUMBHREF}
- **entries/toc/compareRows = ${R.n} เท่ากัน เรียงตรง** · id=h1..h${R.n} · rank/toc.n=1..${R.n} · reviewUrl=<slug>.html ชี้ไฟล์ที่มีจริง
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** · เลขในชื่อ/h1=${R.n} · introHtml/mrtHtml/advice/faq ครบ
${STYLE}
⚠️ JSON.parse + entries.length===toc.length===compareRows.length===${R.n} + reviewUrl ทุกอันมีจริง + คำต้องห้าม=0`,
    { label:`rnd:${R.newSlug}`, phase:'Roundup' }).then(()=>({ok:1})).catch(()=>({ok:0}))
))
return { done:true }
