export const meta = {
  name: 'fix-sakon-orphan',
  description: 'QA fix: rebuild top10-hotels-sakon-nakhon (the hub roundup) — it had 5 dead reviewUrls. Rebuild from 10 REAL existing sakon-nakhon reviews so all links resolve. Reversible (git).',
  phases: [{ title: 'Rebuild', detail: 'build top10-hotels-sakon-nakhon from 10 real reviews' }],
}
const CLUSTER='sakon-nakhon', PROV='สกลนคร', CRUMBHREF='city-sakon-nakhon.html';
const NEWSLUG='top10-hotels-sakon-nakhon';
const TITLE='นอนที่ไหนดีในสกลนคร? 10 โรงแรมยอดนิยมที่รีวิวจริง';
// keep the 5 that were valid + add 5 real reviews to replace the 5 dead ones
const MEMBERS=[
  'review-dusit-hotel-sakon-nakhon','review-imperial-sakon-hotel-sakon-nakhon',
  'review-sakol-grand-palace-hotel-sakon-nakhon','review-the-majestic-sakon-nakhon',
  'review-chokdee-place-sakon-nakhon','review-the-room-boutique-hotel-sakon-nakhon',
  'review-at-sakon-hotel-sakon-nakhon','review-hop-inn-sakon-nakhon',
  'review-phu-sakon-ville-hotel-sakon-nakhon','review-hug-sakonnakhon-sakon-nakhon',
];
const STYLE='สไตล์ thailandaddict (v2-clean): เพื่อนเล่าให้ฟัง จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน';
const GOLD='เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + schema astro/src/content.config.ts';
phase('Rebuild')
await agent(`สร้าง/เขียนทับ roundup "${TITLE}" (cluster=${CLUSTER}, ${PROV}) สไตล์เพื่อนเล่าให้ฟัง — ของเดิมมีลิงก์เสีย 5 อัน ต้อง rebuild ให้ลิงก์ครบจริง
อ่าน ${GOLD} + อ่านไฟล์รีวิวของโรงแรมในชุดนี้ทุกไฟล์ (ดึง score/price/rooms/agoda/booking/trip/heroImg/ทำเล)
OUTPUT: astro/src/content/roundups/${NEWSLUG}.json (ไทย) ครบ roundupSchema · slug="${NEWSLUG}" · breadcrumb→${CRUMBHREF}
- โรงแรมในชุด (เรียงตามคุณภาพ/ความน่าสนใจ ครบ 10 ตัวนี้ — ทุกตัวมีรีวิวจริงบนดิสก์): ${MEMBERS.map(s=>s+'.json').join(', ')}
- **entries.length===toc.length===compareRows.length===10** เรียงตรงกัน · id=h1..h10 · rank/toc.n 1..10 · reviewUrl=<slug>.html (ต้องตรงไฟล์รีวิวจริงทุกตัว)
- **storyHtml แต่ละ entry ≥220 คำไทย** · introHtml/mrtHtml(เดินทางสู่สกลนคร)/advice/faq ครบ · เลขในชื่อ=10
${STYLE}
⚠️ JSON valid + ลิงก์ทุกตัว resolve + คำต้องห้าม=0`,
  { label:'rnd:'+NEWSLUG, phase:'Rebuild' })
return { rebuilt: NEWSLUG }
