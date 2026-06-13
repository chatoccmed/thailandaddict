export const meta = {
  name: 'port-roundups',
  description: 'Port old hotel-roundup posts → new roundups (>=200w/hotel) + per-hotel reviews (>=2000w TH), dedup vs existing reviews, replace closed hotels',
  phases: [
    { title: 'Plan', detail: 'fetch each old post, extract hotels, dedup-check, verify open' },
    { title: 'Write', detail: 'create missing per-hotel reviews (>=2000w)' },
    { title: 'Roundup', detail: 'build each new roundup linking all hotels' },
  ],
}

// Chiang Mai hotel-roundup batch (oldSlug → new roundup). cluster=chiang-mai
const POSTS = [
  { id:4889, old:'top5-nature-chiang-mai-hotel', newSlug:'top5-nature-hotels-chiang-mai', title:'5 ที่พักสัมผัสธรรมชาติ เชียงใหม่' },
  { id:4665, old:'top5-hotel-chiang-mai-we-travel-together', newSlug:'top5-popular-hotels-chiang-mai', title:'5 โรงแรมยอดนิยม เชียงใหม่' },
  { id:2426, old:'topten-hotels-chiangmai', newSlug:'top10-wualai-walking-street-hotels-chiang-mai', title:'10 ที่พักย่านถนนคนเดินวัวลาย เชียงใหม่' },
  { id:2428, old:'top-ten-chiang-mai-hotels', newSlug:'top10-popular-hotels-chiang-mai', title:'10 โรงแรมยอดนิยม เมืองเชียงใหม่' },
  { id:2430, old:'top-ten-hotels-chiang-mai', newSlug:'top10-luxury-hotels-chiang-mai', title:'10 โรงแรมสุดหรู เชียงใหม่' },
  { id:2432, old:'topten-chiang-mai-hotels', newSlug:'top10-nimman-budget-hotels-chiang-mai', title:'10 โรงแรมราคาดีย่านนิมมาน เชียงใหม่' },
  { id:2434, old:'topten-hotels-chiang-mai', newSlug:'top10-nature-view-hotels-chiang-mai', title:'10 โรงแรมใกล้ธรรมชาติ ทำเลสวย เชียงใหม่' },
  { id:2436, old:'tipten-chiang-mai-boutique-hotels', newSlug:'top10-boutique-hotels-chiang-mai', title:'10 โรงแรมบูติก เชียงใหม่' },
];
// single-hotel features → one review each (no roundup)
const SINGLE = [
  { id:4529, old:'the-empress-premier-chiang-mai', name:'The Empress Premier Chiang Mai' },
  { id:4396, old:'chiang-mai-chala-number-6', name:'Chala Number 6' },
];
const CITY='chiang-mai', TH='เชียงใหม่';

const STYLE=`สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · ข้อมูลอัปเดตปัจจุบัน`;
const norm = s => s.toLowerCase().replace(/[^a-z0-9ก-๙]/g,'');

const PLAN_SCHEMA={type:'object',additionalProperties:false,required:['hotels'],properties:{hotels:{type:'array',items:{type:'object',additionalProperties:false,required:['name','reviewSlug','area','tier','star','open'],properties:{
  name:{type:'string'},reviewSlug:{type:'string',description:'review-<hotel-kebab>-chiang-mai'},area:{type:'string'},tier:{type:'string'},star:{type:'number'},open:{type:'boolean',description:'ยังเปิดจริงไหม'},note:{type:'string'}}}}}};

phase('Plan')
const plans = await parallel(POSTS.map(P => () =>
  agent(`ดึงเนื้อหาโพสต์เดิมจาก WP REST API แล้วสกัดรายชื่อโรงแรม:
WebFetch: https://thailandaddict.com/wp-json/wp/v2/posts?slug=${P.old}&_fields=title,content (ถ้าค้างให้ข้าม)
งาน: สกัดโรงแรมทุกแห่งในโพสต์ "${P.title}" (จังหวัด${TH}) → สำหรับแต่ละโรงแรม: ชื่อจริง, ย่าน/area, ระดับ tier (luxury/boutique/midrange/budget/hostel) + ดาว, **เช็คว่ายังเปิดจริงไหม (web-search; ถ้าปิดถาวร open=false + note ชื่อโรงแรมตัวแทนที่เปิดจริงในย่าน/ระดับเดียวกัน)**
- reviewSlug = review-<ชื่อโรงแรม-kebab อังกฤษ>-chiang-mai (สำหรับโรงแรมปิด ให้ใช้ชื่อตัวแทนทำ slug)
- ถ้าโพสต์มี ~5-12 โรงแรม คืนตามจริง
คืนตาม schema (array hotels)`,
    { label:`plan:${P.old}`, phase:'Plan', schema:PLAN_SCHEMA })
    .then(r=>({P, hotels:((r&&r.hotels)||[])})).catch(()=>({P,hotels:[]}))
))

// aggregate unique reviews to create (dedup across batch + vs disk)
const needSet = new Map(); // slug -> {name,area,tier,star}
for (const {hotels} of plans) for (const h of hotels) {
  const slug = h.reviewSlug;
  if (!needSet.has(slug)) needSet.set(slug, h);
}
const uniqueHotels = [...needSet.values()];
const sibs = uniqueHotels.map(h=>h.reviewSlug).join(', ');
log(`Planned ${POSTS.length} roundups · ${uniqueHotels.length} unique hotels (+${SINGLE.length} single features)`)

phase('Write')
const writeList = [...uniqueHotels.map(h=>({name:h.name,slug:h.reviewSlug,area:h.area,tier:h.tier,star:h.star})),
  ...SINGLE.map(s=>({name:s.name,slug:'review-'+norm(s.name).replace(/[ก-๙]/g,'')+'-chiang-mai',area:'',tier:'',star:5,single:true}))];
const written = await parallel(writeList.map(t => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${t.name}" จังหวัด${TH} ลง thailandaddict.com — **body ภาษาไทย ≥2,000 คำ** (สไตล์ https://www.wherebest.com/review-cho-hotel-taipei)
ก่อนเขียน: ถ้ามีไฟล์ astro/src/content/reviews/${t.slug}.json อยู่แล้ว และ body ยาว ≥2000 คำ → ข้าม (return exists) · ถ้ายาวไม่ถึง → เขียนทับให้ ≥2000 คำ
อ่าน .claude/agents/tourlogy-hotel-reviewer.md + reviewSchema (astro/src/content.config.ts) + _internal/templates/review.sample.json + ดูรีวิว chiang-mai ที่มีอยู่เป็นโครง
OUTPUT: astro/src/content/reviews/${t.slug}.json (ไทยอย่างเดียว — EN ทำทีหลัง) ครบ reviewSchema ทุก field · cluster="${CITY}" · crumbCityName="${TH}", crumbCityHref="city-${CITY}.html" · countryHref="country-thailand.html" · addressCountry="TH"
- body ≥2000 คำ แบ่งหัวข้อ: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง/ห้อง-ตกแต่ง/สิ่งอำนวยฯ-สระ-สปา/อาหาร-บาร์/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้ก่อนจอง/สรุป
- วิจัยเว็บจริงอัปเดต · affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href = Trip/Agoda มี ID
- รูป hero: curl -m 60 -A "Mozilla/5.0" รูปจริงไป astro/public/images/hotels/${CITY}-<short>.jpg (hero + gallery 3); ถ้าไม่ได้ปล่อย path (onerror)
${STYLE}
⚠️ นับคำ body ≥2000 · ค้นคำต้องห้ามแล้วแก้ · ยืนยัน ls -l + JSON valid · return: คำ body, เปิดจริงไหม`,
    { label:`rev:${t.slug}`, phase:'Write' })
    .then(()=>({slug:t.slug,ok:true})).catch(()=>({slug:t.slug,ok:false}))
))
log(`Reviews written/verified: ${written.filter(x=>x&&x.ok).length}/${writeList.length}`)

phase('Roundup')
const rounds = await parallel(plans.filter(p=>p.hotels.length).map(({P,hotels}) => () =>
  agent(`สร้าง roundup ใหม่ "${P.title}" (พอร์ตจากโพสต์เดิม ${P.old}) เขียนใหม่สไตล์เรา
อ่าน .claude/agents/tourlogy-roundup-builder.md + roundupSchema + ดู roundup chiang-mai ที่มีอยู่เป็นโครง
OUTPUT: astro/src/content/roundups/${P.newSlug}.json (ไทยอย่างเดียว) ครบ roundupSchema · slug="${P.newSlug}" · cluster=${CITY}
- โรงแรมในชุดนี้ (อ่านไฟล์รีวิวที่มี): ${hotels.map(h=>h.reviewSlug).join(', ')}
- **entries/toc/compareRows จำนวนเท่ากัน เรียงตรงตำแหน่ง** · rank/id(h1..)/toc.n ต่อเนื่อง · reviewUrl=<slug>.html · score/price/agoda/booking/trip ตามไฟล์รีวิว
- **storyHtml แต่ละ entry ≥200 คำ** สไตล์เพื่อนเล่า · เลขในชื่อ=จำนวนจริง
${STYLE}
ยืนยัน JSON valid + entries.length===toc.length===compareRows.length`,
    { label:`rnd:${P.newSlug}`, phase:'Roundup' })
    .then(()=>({slug:P.newSlug,ok:true})).catch(()=>({slug:P.newSlug,ok:false}))
))
return { roundups: rounds.filter(x=>x&&x.ok).length, reviews: written.filter(x=>x&&x.ok).length, uniqueHotels: uniqueHotels.length,
  plans: plans.map(p=>({old:p.P.old, newSlug:p.P.newSlug, hotels:p.hotels.map(h=>({name:h.name,slug:h.reviewSlug,open:h.open}))})) }
