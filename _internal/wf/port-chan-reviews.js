export const meta = {
  name: 'port-chan-reviews',
  description: 'Write 2 missing chanthaburi reviews: akantuka-homestay (soi-dao roundup ref, failed on 500) + baan-rim-ao (single feature).',
  phases: [ { title: 'Review', detail: '2 reviews >=2000w' } ],
}
const PROV='จันทบุรี', CLUSTER='chanthaburi', CRUMB='จันทบุรี', CRUMBHREF='city-chanthaburi.html';
const STYLE=`สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD=`อ่าน reviewSchema (astro/src/content.config.ts) + .claude/agents/tourlogy-hotel-reviewer.md + รีวิว chanthaburi ที่มีเป็นโครง`;

const REVS = [
  { slug:'review-akantuka-homestay-chanthaburi', name:'Akantuka Homestay', area:'สอยดาว/ใกล้เขาคิชฌกูฏ', old:'top9-hostels-chanthaburi', short:'akantuka' },
  { slug:'review-baan-rim-ao-chanthaburi', name:'บ้านริมอ่าว (Baan Rim Ao)', area:'ริมอ่าว จันทบุรี', old:'baan-rim-ao-chanthaburi', short:'baanrimao' },
];

phase('Review')
const done = await parallel(REVS.map(R => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${R.name}" จังหวัด${PROV} (ย่าน ${R.area}) — **body ภาษาไทย ≥2,000 คำ (≥6,800 อักษรไทย)**
อ่านบริบทเดิม _internal/migration/oldposts/${R.old}.txt (หาเนื้อหาของ ${R.name}) + ${GOLD}
ก่อนเขียน: ถ้ามี astro/src/content/reviews/${R.slug}.json อยู่แล้วและ body ≥6800 → return exists
OUTPUT: astro/src/content/reviews/${R.slug}.json (ไทย) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥6800 อักษรไทย: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง/ห้อง/สิ่งอำนวยฯ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้/สรุป
- วิจัยเว็บจริง · affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · ที่พักเล็กไม่มี OTA: ช่องทางจองจริง อย่าแต่งตัวเลข
- รูป hero: curl -m 60 -A "Mozilla/5.0" รูปจริง → astro/public/images/hotels/chanthaburi-${R.short}-1..4.jpg แล้ว node _internal/optimize-images.mjs <paths>; ไม่ได้ปล่อย onerror
${STYLE}
⚠️ อักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้ · JSON valid · return: อักษรไทย body`,
    { label:`rev:${R.slug}`, phase:'Review' })
    .then(()=>({slug:R.slug,ok:true})).catch(e=>({slug:R.slug,ok:false,e:String(e).slice(0,80)}))
))
return { written: done.filter(x=>x&&x.ok).map(x=>x.slug), failed: done.filter(x=>x&&!x.ok) }
