export const meta = {
  name: 'port-roundups-cb1',
  description: 'Chonburi chunk 1 — 5 mainland-area hotel roundups (Bangsaen, Laem Chabang, Ang Sila, Chonburi city, Koh Sichang) + per-hotel reviews >=2000w TH',
  phases: [
    { title: 'Plan', detail: 'read old post from disk, extract hotels, dedup-check, verify open' },
    { title: 'Write', detail: 'per-hotel reviews >=2000w (reuse existing where found)' },
    { title: 'Roundup', detail: 'build each roundup linking hotels' },
  ],
}

const PROV = 'ชลบุรี';
// All chunk-1 roundups use cluster 'chonburi' (mainland areas). area = sub-district for context.
const POSTS = [
  { id:3012, old:'top9-bangsaen-chon-buri', newSlug:'top9-bangsaen-hotels-chonburi', cluster:'chonburi', area:'บางแสน', title:'9 ที่พักริมหาดบางแสน ชลบุรี' },
  { id:3015, old:'top5-laemchabang-hotels-chonburi', newSlug:'top5-laem-chabang-hotels-chonburi', cluster:'chonburi', area:'แหลมฉบัง', title:'5 ที่พักยอดนิยมแหลมฉบัง ชลบุรี' },
  { id:3019, old:'top5-ang-sila-chonburi', newSlug:'top5-ang-sila-hotels-chonburi', cluster:'chonburi', area:'อ่างศิลา', title:'5 ที่พักยอดนิยมอ่างศิลา ชลบุรี' },
  { id:3010, old:'top9-hotels-chonburi-province', newSlug:'top10-chonburi-city-budget-hotels', cluster:'chonburi', area:'อำเภอเมืองชลบุรี', title:'10 ที่พักราคาดีในอำเภอเมืองชลบุรี' },
  { id:3025, old:'top-9-koh-sichang-chonburi-hotel', newSlug:'top9-koh-sichang-hotels-chonburi', cluster:'chonburi', area:'เกาะสีชัง', title:'9 ที่พักยอดนิยมบนเกาะสีชัง ชลบุรี' },
];

const STYLE=`สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · ข้อมูลอัปเดตปัจจุบัน`;
const GOLD=`เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json (roundup) + รีวิว astro/src/content/reviews/review-u-nimman-chiang-mai.json (≥2000w) + schema astro/src/content.config.ts + .claude/agents/tourlogy-hotel-reviewer.md + .claude/agents/tourlogy-roundup-builder.md`;

const PLAN_SCHEMA={type:'object',additionalProperties:false,required:['hotels'],properties:{hotels:{type:'array',items:{type:'object',additionalProperties:false,required:['name','reviewSlug','area','tier','star','open'],properties:{
  name:{type:'string'},reviewSlug:{type:'string',description:'review-<hotel-kebab>-chonburi'},area:{type:'string'},tier:{type:'string'},star:{type:'number'},open:{type:'boolean'},note:{type:'string'}}}}}};

phase('Plan')
const plans = await parallel(POSTS.map(P => () =>
  agent(`สกัดรายชื่อโรงแรมจากโพสต์เดิม (เนื้อหาอยู่บนดิสก์ — อย่าใช้ WebFetch ไปดึงโพสต์เดิม):
1) Read _internal/migration/oldposts/${P.old}.txt (เนื้อหาโพสต์เดิมเต็ม)
2) ดูรีวิว chonburi ที่มีอยู่: ls astro/src/content/reviews/ | grep chonburi (เผื่อ reuse — ย่าน${P.area})
สกัดโรงแรมทุกแห่งในโพสต์ "${P.title}" (${PROV} ย่าน${P.area}) → แต่ละแห่ง: ชื่อจริง, ย่าน, tier(luxury/boutique/midrange/budget/hostel/resort)+ดาว, **เปิดจริงไหม (web-search ชื่อ+ชลบุรี; ปิดถาวร→open=false + note ตัวแทนเปิดจริงย่าน/ระดับเดียวกัน)**
- reviewSlug = review-<ชื่อ-kebab อังกฤษ>-chonburi · ถ้ามีไฟล์รีวิวชื่อตรงอยู่แล้ว ใช้ slug เดิม (reuse)
- คืนโรงแรมตามจำนวนจริง (เลขในชื่อ = จำนวน)`,
    { label:`plan:${P.old}`, phase:'Plan', schema:PLAN_SCHEMA })
    .then(r=>({P, hotels:((r&&r.hotels)||[])})).catch(()=>({P,hotels:[]}))
))

const needSet = new Map();
for (const {hotels} of plans) for (const h of hotels) if (!needSet.has(h.reviewSlug)) needSet.set(h.reviewSlug, h);
const uniqueHotels = [...needSet.values()];
log(`Planned ${POSTS.length} roundups · ${uniqueHotels.length} unique hotels`)

phase('Write')
const written = await parallel(uniqueHotels.map(h => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${h.name}" จังหวัด${PROV} (ย่าน ${h.area}) ลง thailandaddict.com — **body ภาษาไทย ≥2,000 คำ (≥6,800 อักษรไทย)**
ก่อนเขียน: ถ้ามี astro/src/content/reviews/${h.reviewSlug}.json อยู่แล้วและ body ≥6800 อักษรไทย → ข้าม (return exists) · ถ้าสั้นกว่า → เขียนทับให้ ≥6800
อ่าน ${GOLD} + ดูรีวิว chonburi ที่มีเป็นโครง
OUTPUT: astro/src/content/reviews/${h.reviewSlug}.json (ไทยอย่างเดียว) ครบ reviewSchema ทุก field · cluster="${h.cluster||'chonburi'}" · crumbCityName="${PROV}" · crumbCityHref="city-chonburi.html" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥2000 คำ หัวข้อ: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง/ห้อง-ตกแต่ง/สิ่งอำนวยฯ-สระ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้ก่อนจอง/สรุป
- วิจัยเว็บจริง · affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href = Trip/Agoda
- **ที่พักเล็ก/รีสอร์ตที่ไม่มีบน OTA**: อย่าแต่งลิงก์/ตัวเลขปลอม — ใส่ช่องทางจองจริง (FB/เว็บ/โทร) · score เท่าที่หาได้จริง
- รูป hero: curl -m 60 -A "Mozilla/5.0" รูปจริง → astro/public/images/hotels/chonburi-<short>.jpg (hero+gallery 3) แล้ว node _internal/optimize-images.mjs <paths>; ไม่ได้ปล่อย path (onerror)
${STYLE}
⚠️ นับอักษรไทย body ≥6800 · ค้นคำต้องห้ามแก้ · JSON valid · return: อักษรไทย body, เปิดจริงไหม`,
    { label:`rev:${h.reviewSlug}`, phase:'Write' })
    .then(()=>({slug:h.reviewSlug,ok:true})).catch(()=>({slug:h.reviewSlug,ok:false}))
))
log(`Reviews: ${written.filter(x=>x&&x.ok).length}/${uniqueHotels.length}`)

phase('Roundup')
const rounds = await parallel(plans.filter(p=>p.hotels.length).map(({P,hotels}) => () =>
  agent(`สร้าง roundup ใหม่ "${P.title}" (พอร์ตจาก ${P.old}) เขียนใหม่สไตล์เรา
อ่าน ${GOLD} + ไฟล์รีวิวของโรงแรมในชุดนี้
OUTPUT: astro/src/content/roundups/${P.newSlug}.json (ไทย) ครบ roundupSchema · slug="${P.newSlug}" · cluster="${P.cluster}" · breadcrumb→city-chonburi.html
- โรงแรมในชุด (อ่านไฟล์รีวิวเพื่อดึง score/price/rooms/agoda/booking/trip/heroImg/ทำเล): ${hotels.map(h=>h.reviewSlug).join(', ')}
- **entries/toc/compareRows จำนวนเท่ากัน เรียงตรงตำแหน่ง** · id=h1.. · rank/toc.n ต่อเนื่อง · reviewUrl=<slug>.html
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** สไตล์เพื่อนเล่า · เลขในชื่อ=จำนวนจริง · introHtml/mrtHtml/advice/faq ครบแบบเทมเพลต
${STYLE}
⚠️ JSON valid + entries.length===toc.length===compareRows.length + ค้นคำต้องห้าม=0`,
    { label:`rnd:${P.newSlug}`, phase:'Roundup' })
    .then(()=>({slug:P.newSlug,ok:true})).catch(()=>({slug:P.newSlug,ok:false}))
))
return { roundups: rounds.filter(x=>x&&x.ok).map(x=>x.slug), reviews: written.filter(x=>x&&x.ok).length, uniqueHotels: uniqueHotels.length,
  plans: plans.map(p=>({old:p.P.old, newSlug:p.P.newSlug, cluster:p.P.cluster, hotels:p.hotels.map(h=>({name:h.name,slug:h.reviewSlug,open:h.open}))})) }
