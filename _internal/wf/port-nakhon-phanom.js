export const meta = {
  name: 'port-nakhon-phanom',
  description: 'Single-planner porter for นครพนม (cluster=nakhon-phanom): one agent plans all 1 roundup(s) together -> unique hotels -> reviews >=2000w -> roundups. Reuses existing nakhon-phanom reviews.',
  phases: [
    { title: 'Plan', detail: 'one agent reads all old posts + existing reviews -> unified hotel list + membership' },
    { title: 'Write', detail: 'per-hotel reviews >=2000w (unique, skip if already long)' },
    { title: 'Roundup', detail: 'build each roundup from its membership' },
  ],
}

const CLUSTER = "nakhon-phanom", PROV = "นครพนม", CRUMB = "นครพนม", CRUMBHREF = "city-nakhon-phanom.html";
const POSTS = [{"old":"top10-nakhon-phanom-hotels","newSlug":"top10-nakhon-phanom-riverside-hotels","title":"10 โรงแรมริมแม่น้ำโขงบรรยากาศดีในนครพนม","n":10}];

const STYLE = 'สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · ข้อมูลอัปเดตปัจจุบัน';
const GOLD = 'เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + รีวิว astro/src/content/reviews/review-u-nimman-chiang-mai.json (>=2000w) + schema astro/src/content.config.ts';

const PLAN_SCHEMA = {"type":"object","additionalProperties":false,"required":["hotels","roundups"],"properties":{"hotels":{"type":"array","description":"โรงแรม unique ทั้งหมด (1 slug ต่อ 1 โรงแรมจริง ใช้ซ้ำข้าม roundup ได้)","items":{"type":"object","additionalProperties":false,"required":["name","reviewSlug","area","tier","star","open"],"properties":{"name":{"type":"string"},"reviewSlug":{"type":"string","description":"review-<hotel-kebab-en>-nakhon-phanom"},"area":{"type":"string"},"tier":{"type":"string"},"star":{"type":"number"},"open":{"type":"boolean"},"note":{"type":"string"}}}},"roundups":{"type":"array","description":"membership ต่อ roundup","items":{"type":"object","additionalProperties":false,"required":["newSlug","reviewSlugs"],"properties":{"newSlug":{"type":"string"},"reviewSlugs":{"type":"array","items":{"type":"string"},"description":"reviewSlug เรียงตามอันดับ"}}}}}};

phase('Plan')
const plan = await agent(`วางแผนพอร์ต ${POSTS.length} roundup ของจังหวัด${PROV} (cluster=${CLUSTER}) พร้อมกัน — เพื่อ **ไม่ให้โรงแรมเดียวกันได้ slug ซ้ำซ้อน** ข้าม list
อ่านโพสต์เดิมทั้งหมดจากดิสก์ (อย่าใช้ WebFetch):
${POSTS.map(p=>'  - '+p.newSlug+' <- _internal/migration/oldposts/'+p.old+'.txt  ("'+p.title+'")').join('\n')}
ดูรีวิว ${CLUSTER} ที่มีอยู่: ls astro/src/content/reviews/ | grep -- -${CLUSTER}.json (reuse reviewSlug เดิมถ้าโรงแรมตรงกัน — อย่าตั้ง slug ใหม่ให้โรงแรมที่มีรีวิวแล้ว)
งาน:
1) รวมโรงแรมจากทุก list -> ทำ **บัญชี hotels unique** (โรงแรมที่โผล่หลาย list ให้มี reviewSlug เดียว ใช้ซ้ำ) · reviewSlug = review-<ชื่อ-kebab อังกฤษ>-${CLUSTER} · เช็คเปิดจริง (web-search; ปิดถาวร open=false + note โรงแรมตัวแทนที่เปิดจริงในย่านเดียวกัน)
2) ทำ **roundups membership**: แต่ละ newSlug -> reviewSlugs เรียงตามอันดับ (จำนวน = เลข n ในชื่อ; โรงแรมปิด->ใช้ตัวแทน) ให้ครบ n ของแต่ละ roundup
สำคัญ: โรงแรมเดียวกันต้องได้ reviewSlug **เดียวกันเป๊ะ** ทุกที่ที่อ้างถึง`,
  { label:'plan:'+CLUSTER, phase:'Plan', schema:PLAN_SCHEMA })

const needSet = new Map();
for (const h of (plan?.hotels||[])) if (!needSet.has(h.reviewSlug)) needSet.set(h.reviewSlug, h);
const uniqueHotels = [...needSet.values()];
const memberOf = new Map((plan?.roundups||[]).map(r=>[r.newSlug, r.reviewSlugs]));
log('Planned '+POSTS.length+' roundups · '+uniqueHotels.length+' unique hotels')

phase('Write')
const written = await parallel(uniqueHotels.map(h => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${h.name}" ${CRUMB} ${PROV} (ย่าน ${h.area}) — **body ภาษาไทย >=2,000 คำ (>=6,800 อักษรไทย)**
ก่อนเขียน: ถ้ามี astro/src/content/reviews/${h.reviewSlug}.json อยู่แล้วและ body >=6800 อักษรไทย -> ข้าม (return exists) · สั้นกว่า -> เขียนทับให้ยาวครบ (คง field เดิม โดยเฉพาะ keywords)
อ่าน ${GOLD} + ดูรีวิว ${CLUSTER} ที่มีเป็นโครงสร้าง field
OUTPUT: astro/src/content/reviews/${h.reviewSlug}.json (ไทยอย่างเดียว) ครบ reviewSchema · cluster="${CLUSTER}" · crumbCityName="${CRUMB}" · crumbCityHref="${CRUMBHREF}" · countryHref="country-thailand.html" · addressCountry="TH" · **ต้องมี field keywords** (เช่น ชื่อโรงแรม+', ที่พัก${PROV}, รีวิว '+ชื่อ)
- body >=2000 คำ หัวข้อ: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง/ห้อง/สิ่งอำนวยฯ-สระ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้/สรุป
- วิจัยเว็บจริง · affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href=Trip/Agoda
- ที่พักเล็กไม่มีบน OTA: อย่าแต่งลิงก์/ตัวเลขปลอม — ช่องทางจองจริง · score เท่าที่หาได้จริง
- รูป hero: curl -m 60 -A "Mozilla/5.0" รูปจริง -> astro/public/images/hotels/${CLUSTER}-<short>.jpg (hero+gallery 3) แล้ว node _internal/optimize-images.mjs <paths>; หาไม่ได้ปล่อย path (onerror) อย่าใส่รูปมั่ว
${STYLE}
⚠️ อักษรไทย body >=6800 · มี keywords · ค้นคำต้องห้ามแก้ · JSON valid · return: อักษรไทย, เปิดจริงไหม`,
    { label:'rev:'+h.reviewSlug, phase:'Write' })
    .then(()=>({slug:h.reviewSlug,ok:true})).catch(()=>({slug:h.reviewSlug,ok:false}))
))
log('Reviews: '+written.filter(x=>x&&x.ok).length+'/'+uniqueHotels.length)

phase('Roundup')
const rounds = await parallel(POSTS.map(P => () => {
  const revs = memberOf.get(P.newSlug) || [];
  if (!revs.length) return Promise.resolve({slug:P.newSlug, ok:false, e:'no membership'});
  return agent(`สร้าง roundup ใหม่ "${P.title}" (พอร์ตจาก ${P.old}, cluster=${CLUSTER}, จังหวัด${PROV}) เขียนใหม่สไตล์เพื่อนเล่าให้ฟัง
อ่าน ${GOLD} + อ่านไฟล์รีวิวของโรงแรมในชุดนี้ทุกไฟล์ (ดึง score/price/rooms/agoda/booking/trip/heroImg/ทำเล)
OUTPUT: astro/src/content/roundups/${P.newSlug}.json (ไทย) ครบ roundupSchema · slug="${P.newSlug}" · cluster="${CLUSTER}" · breadcrumb->${CRUMBHREF}
- โรงแรมในชุด (เรียงตามนี้เป๊ะ): ${revs.map(s=>s+'.json').join(', ')}
- **entries.length === toc.length === compareRows.length === ${revs.length}** เรียงตรงกัน · id=h1..h${revs.length} · rank/toc.n ต่อเนื่อง 1..${revs.length} · reviewUrl=<slug>.html
- **storyHtml แต่ละ entry >=220 คำไทย (>=900 อักษรไทย)** สไตล์เพื่อนเล่า · เลขในชื่อ/หัวข้อ = ${revs.length} · introHtml/mrtHtml(การเดินทางสู่${CRUMB})/advice/faq ครบ
${STYLE}
⚠️ JSON valid + entries.length===toc.length===compareRows.length===${revs.length} + reviewUrl ตรงไฟล์จริง + คำต้องห้าม=0`,
    { label:'rnd:'+P.newSlug, phase:'Roundup' })
    .then(()=>({slug:P.newSlug,ok:true})).catch(()=>({slug:P.newSlug,ok:false}));
}))
return { roundups: rounds.filter(x=>x&&x.ok).map(x=>x.slug), roundFail: rounds.filter(x=>x&&!x.ok),
  reviews: written.filter(x=>x&&x.ok).length, uniqueHotels: uniqueHotels.length,
  membership: [...memberOf.entries()].map(([k,v])=>({newSlug:k,count:v.length})) }
