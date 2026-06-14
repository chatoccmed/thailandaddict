export const meta = {
  name: 'port-roundups-pattaya-b',
  description: 'Single-planner roundup porter — one agent plans ALL chunk posts together (consistent slugs, no dup hotels across overlapping lists), then reviews >=2000w + roundups. For high-overlap clusters (Pattaya).',
  phases: [
    { title: 'Plan', detail: 'ONE agent reads all old posts → unified hotel list + per-roundup membership' },
    { title: 'Write', detail: 'per-hotel reviews >=2000w (unique hotels only)' },
    { title: 'Roundup', detail: 'build each roundup from its membership' },
  ],
}

// === Pattaya-B chunk (cluster=pattaya): hostel, apartment, jomtien, bang-saray ===
const PROV = 'ชลบุรี', CLUSTER = 'pattaya', CRUMB = 'พัทยา', CRUMBHREF = 'city-pattaya.html';
const POSTS = [
  { id:3037, old:'top7-hostel-tattaya-chonburi', newSlug:'top7-hostels-pattaya', title:'7 ที่พักสไตล์ Hostel ในพัทยา ชลบุรี', n:7 },
  { id:3043, old:'top10-apartment-chonburi-pattaya', newSlug:'top10-apartment-hotels-pattaya', title:'10 ที่พักแนว Apartment ในพัทยา ชลบุรี', n:10 },
  { id:3035, old:'top-ten-hotels-pattaya', newSlug:'top10-jomtien-beach-hotels-pattaya', title:'10 ที่พักริมหาดจอมเทียน พัทยา', n:10 },
  { id:3031, old:'top9-hotels-bang-saray-pattaya', newSlug:'top9-bang-saray-hotels-pattaya', title:'9 ที่พักริมหาดบางเสร่ ใกล้พัทยา', n:9 },
];

const STYLE=`สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · ข้อมูลอัปเดตปัจจุบัน`;
const GOLD=`เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + รีวิว astro/src/content/reviews/review-u-nimman-chiang-mai.json (≥2000w) + schema astro/src/content.config.ts + .claude/agents/tourlogy-hotel-reviewer.md + .claude/agents/tourlogy-roundup-builder.md`;

// Single-planner schema: global unique hotels + per-roundup ordered membership.
const PLAN_SCHEMA={type:'object',additionalProperties:false,required:['hotels','roundups'],properties:{
  hotels:{type:'array',description:'โรงแรม unique ทั้งหมด (1 slug ต่อ 1 โรงแรมจริง ใช้ซ้ำข้าม roundup ได้)',items:{type:'object',additionalProperties:false,required:['name','reviewSlug','area','tier','star','open'],properties:{
    name:{type:'string'},reviewSlug:{type:'string',description:'review-<hotel-kebab>-pattaya'},area:{type:'string'},tier:{type:'string'},star:{type:'number'},open:{type:'boolean'},note:{type:'string'}}}},
  roundups:{type:'array',description:'membership ต่อ roundup',items:{type:'object',additionalProperties:false,required:['newSlug','reviewSlugs'],properties:{
    newSlug:{type:'string'},reviewSlugs:{type:'array',items:{type:'string'},description:'reviewSlug เรียงตามอันดับใน roundup นี้'}}}}}};

phase('Plan')
const plan = await agent(`วางแผนพอร์ต ${POSTS.length} roundup ของพัทยา (${PROV}) พร้อมกัน — เพื่อ **ไม่ให้โรงแรมเดียวกันได้ slug ซ้ำซ้อน** ข้าม list
อ่านโพสต์เดิมทั้งหมดจากดิสก์ (อย่าใช้ WebFetch):
${POSTS.map(p=>`  - ${p.newSlug} ⟵ _internal/migration/oldposts/${p.old}.txt  ("${p.title}")`).join('\n')}
ดูรีวิว pattaya ที่มีอยู่: ls astro/src/content/reviews/ | grep pattaya (reuse slug เดิมถ้าโรงแรมตรงกัน)
งาน:
1) รวมโรงแรมจากทุก list → ทำ **บัญชี hotels unique** (โรงแรมที่โผล่หลาย list ให้มี reviewSlug เดียว ใช้ซ้ำ) · reviewSlug=review-<ชื่อ-kebab อังกฤษ>-pattaya · เช็คเปิดจริง (web-search; ปิดถาวร open=false + note ตัวแทน)
2) ทำ **roundups membership**: แต่ละ newSlug → reviewSlugs เรียงตามอันดับ (จำนวน = เลขในชื่อ; โรงแรมปิด→ใช้ตัวแทน)
สำคัญ: โรงแรมเดียวกันต้องได้ reviewSlug **เดียวกันเป๊ะ** ทุกที่ที่อ้างถึง`,
  { label:'plan:pattaya-b', phase:'Plan', schema:PLAN_SCHEMA })

const needSet = new Map();
for (const h of (plan?.hotels||[])) if (!needSet.has(h.reviewSlug)) needSet.set(h.reviewSlug, h);
const uniqueHotels = [...needSet.values()];
const memberOf = new Map((plan?.roundups||[]).map(r=>[r.newSlug, r.reviewSlugs]));
log(`Planned ${POSTS.length} roundups · ${uniqueHotels.length} unique hotels`)

phase('Write')
const written = await parallel(uniqueHotels.map(h => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${h.name}" ${CRUMB} ${PROV} (ย่าน ${h.area}) — **body ภาษาไทย ≥2,000 คำ (≥6,800 อักษรไทย)**
ก่อนเขียน: ถ้ามี astro/src/content/reviews/${h.reviewSlug}.json อยู่แล้วและ body ≥6800 อักษรไทย → ข้าม (return exists) · สั้นกว่า → เขียนทับ
อ่าน ${GOLD} + ดูรีวิว pattaya ที่มีเป็นโครง
OUTPUT: astro/src/content/reviews/${h.reviewSlug}.json (ไทยอย่างเดียว) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥2000 คำ หัวข้อ: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง/ห้อง/สิ่งอำนวยฯ-สระ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้/สรุป
- วิจัยเว็บจริง · affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href=Trip/Agoda
- ที่พักเล็กไม่มีบน OTA: อย่าแต่งลิงก์/ตัวเลขปลอม — ช่องทางจองจริง · score เท่าที่หาได้จริง
- รูป hero: curl -m 60 -A "Mozilla/5.0" รูปจริง → astro/public/images/hotels/pattaya-<short>.jpg (hero+gallery 3) แล้ว node _internal/optimize-images.mjs <paths>; ไม่ได้ปล่อย path (onerror)
${STYLE}
⚠️ อักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้ · JSON valid · return: อักษรไทย, เปิดจริงไหม`,
    { label:`rev:${h.reviewSlug}`, phase:'Write' })
    .then(()=>({slug:h.reviewSlug,ok:true})).catch(()=>({slug:h.reviewSlug,ok:false}))
))
log(`Reviews: ${written.filter(x=>x&&x.ok).length}/${uniqueHotels.length}`)

phase('Roundup')
const rounds = await parallel(POSTS.map(P => () => {
  const revs = memberOf.get(P.newSlug) || [];
  if (!revs.length) return Promise.resolve({slug:P.newSlug, ok:false, e:'no membership'});
  return agent(`สร้าง roundup ใหม่ "${P.title}" (พอร์ตจาก ${P.old}) เขียนใหม่สไตล์เรา
อ่าน ${GOLD} + ไฟล์รีวิวของโรงแรมในชุดนี้
OUTPUT: astro/src/content/roundups/${P.newSlug}.json (ไทย) ครบ roundupSchema · slug="${P.newSlug}" · cluster="${CLUSTER}" · breadcrumb→${CRUMBHREF}
- โรงแรมในชุด (เรียงตามนี้ อ่านไฟล์รีวิวเพื่อดึง score/price/rooms/agoda/booking/trip/heroImg/ทำเล): ${revs.map(s=>s+'.json').join(', ')}
- **entries/toc/compareRows = ${revs.length} เท่ากัน เรียงตรง** · id=h1..h${revs.length} · rank/toc.n ต่อเนื่อง · reviewUrl=<slug>.html
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** สไตล์เพื่อนเล่า · เลขในชื่อ=${revs.length} · introHtml/mrtHtml/advice/faq ครบ
${STYLE}
⚠️ JSON valid + entries.length===toc.length===compareRows.length===${revs.length} + คำต้องห้าม=0`,
    { label:`rnd:${P.newSlug}`, phase:'Roundup' })
    .then(()=>({slug:P.newSlug,ok:true})).catch(()=>({slug:P.newSlug,ok:false}));
}))
return { roundups: rounds.filter(x=>x&&x.ok).map(x=>x.slug), roundFail: rounds.filter(x=>x&&!x.ok),
  reviews: written.filter(x=>x&&x.ok).length, uniqueHotels: uniqueHotels.length,
  membership: [...memberOf.entries()].map(([k,v])=>({newSlug:k,count:v.length})) }
