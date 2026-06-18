export const meta = {
  name: 'fix-loei-roundup',
  description: 'Build the missing loei roundup top10-chiang-khan-hotels-loei from the 10 new Chiang Khan reviews already on disk (porter plan used a different slug → no membership match → roundup skipped). Reviews exist; just build the roundup.',
  phases: [{ title: 'Roundup', detail: 'build top10-chiang-khan-hotels-loei from 10 reviews' }],
}

const CLUSTER='loei', PROV='เลย', CRUMB='เลย', CRUMBHREF='city-loei.html';
const NEWSLUG='top10-chiang-khan-hotels-loei';
const TITLE='10 ที่พักริมโขงบรรยากาศชิลที่เชียงคาน เลย';
// 10 new long Chiang Khan reviews (>=6800 Thai chars), flagship first
const MEMBERS=[
  'review-the-old-chiangkhan-boutique-hotel-loei','review-chic-chiangkhan-hotel-loei',
  'review-chandra-varin-riverfront-loei','review-suneta-hostel-chiangkhan-loei',
  'review-baan-suan-la-moon-loei','review-norn-nab-dao-rimkhong-loei',
  'review-inbox-living-rimkhong-loei','review-muiphang-guesthouse-chiangkhan-loei',
  'review-friends-house-chiangkhan-loei','review-with-a-view-hotel-at-chiangkhan-loei',
];
const STYLE='สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน';
const GOLD='เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + schema astro/src/content.config.ts';

phase('Roundup')
await agent(`สร้าง roundup ใหม่ "${TITLE}" (cluster=${CLUSTER}, จังหวัด${PROV}) เขียนใหม่สไตล์เพื่อนเล่าให้ฟัง
อ่าน ${GOLD} + อ่านไฟล์รีวิวของโรงแรมในชุดนี้ทุกไฟล์ (ดึง score/price/rooms/agoda/booking/trip/heroImg/ทำเล)
OUTPUT: astro/src/content/roundups/${NEWSLUG}.json (ไทย) ครบ roundupSchema · slug="${NEWSLUG}" · cluster="${CLUSTER}" · breadcrumb→${CRUMBHREF}
- โรงแรมในชุด (เรียงตามนี้ — เรียงใหม่ได้ตามคุณภาพ/ความน่าสนใจถ้าเหมาะกว่า แต่ต้องครบ 10 ตัวนี้): ${MEMBERS.map(s=>s+'.json').join(', ')}
- **entries.length === toc.length === compareRows.length === 10** เรียงตรงกัน · id=h1..h10 · rank/toc.n ต่อเนื่อง 1..10 · reviewUrl=<slug>.html
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** สไตล์เพื่อนเล่า · เลขในชื่อ/หัวข้อ = 10 · introHtml/mrtHtml(การเดินทางสู่เชียงคาน เลย)/advice/faq ครบ
${STYLE}
⚠️ JSON valid + entries===toc===compareRows===10 + reviewUrl ตรงไฟล์จริง + คำต้องห้าม=0`,
  { label:'rnd:'+NEWSLUG, phase:'Roundup' })
return { built: NEWSLUG }
