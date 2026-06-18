export const meta = {
  name: 'port-cr-finish',
  description: 'Finish the interrupted Chiang Rai chunk: expand the one short review (The Legend) to >=2000w, then build the 2 missing roundups (nature + city) from existing review files. Reviews already on disk are reused, not rewritten.',
  phases: [
    { title: 'Expand', detail: 'rewrite The Legend review >=2000w (only short one)' },
    { title: 'Roundup', detail: 'build nature(10) + city(10) roundups from membership' },
  ],
}

const CLUSTER = 'chiang-rai', PROV = 'เชียงราย', CRUMB = 'เชียงราย', CRUMBHREF = 'city-chiang-rai.html';
const rev = s => `review-${s}-chiang-rai`;

// Membership reverse-engineered from old posts + which reviews the dead workflow already expanded.
// All slugs below exist on disk with cluster=chiang-rai, keywords present, hero images present.
const NATURE = ['katiliya-mountain-resort-spa','a-star-phulare-valley','kaeo-fa-sai-resort','phufa-waree-chiangrai-resort','phu-chaisai-mountain-resort','ban-naam-resort','doitung-lodge','hongfu-boutique-resort-doi-maesalong','phumektawan-resort','baan-ruam-cha'].map(rev);
const CITY = ['le-meridien-chiang-rai-resort','nak-nakara-hotel','le-patta-hotel','the-riverie-by-katathani','homey-dormy-chiangrai','na-rak-o-resort','the-rama-hotel','baanmalai-guest-house','pimanninn','the-legend-chiang-rai-boutique-river-resort-spa'].map(rev);

const ROUNDUPS = [
  { newSlug:'top10-nature-hotels-chiang-rai', title:'10 ที่พักอิงธรรมชาติในจังหวัดเชียงราย', members:NATURE },
  { newSlug:'top10-chiang-rai-city-hotels',  title:'10 โรงแรมยอดนิยมในอำเภอเมืองเชียงราย', members:CITY },
];

const STYLE = `สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · ข้อมูลอัปเดตปัจจุบัน`;
const GOLD = `เทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json + รีวิว astro/src/content/reviews/review-u-nimman-chiang-mai.json (≥2000w) + schema astro/src/content.config.ts`;

// ---- Phase 1: expand the single short review (The Legend) ----
phase('Expand')
const legendSlug = rev('the-legend-chiang-rai-boutique-river-resort-spa');
await agent(`เขียนรีวิวเชิงลึกใหม่ทับของเดิม: "The Legend Chiang Rai Boutique River Resort & Spa" (รีสอร์ทริมแม่น้ำกก ในเมืองเชียงราย) — **body ภาษาไทย ≥2,000 คำ (≥6,800 อักษรไทย)**
ไฟล์เป้าหมาย (มีอยู่แล้ว แต่ body สั้นไป ~2,300 อักษร ต้องเขียน body ใหม่ให้ยาว): astro/src/content/reviews/${legendSlug}.json
อ่าน ${GOLD} + ใช้ astro/src/content/reviews/review-nak-nakara-hotel-chiang-rai.json เป็นโครงสร้าง field/รูปทรง body (รีวิวเมืองเชียงรายที่ยาวครบแล้ว)
สำคัญ:
- คง field เดิมไว้ทั้งหมด (slug, cluster="${CLUSTER}", crumbCityName="${CRUMB}", crumbCityHref="${CRUMBHREF}", heroImg, score, keywords ฯลฯ) — **ห้ามลบ field ที่จำเป็นโดยเฉพาะ keywords** — เปลี่ยนแค่ทำให้ body ยาวขึ้นและเนื้อหาแน่นขึ้น
- body ≥2000 คำ หัวข้อ: ภาพรวม-ใครเหมาะ/ทำเล-เดินทาง(ริมน้ำกก ใกล้เมือง)/ห้อง/สิ่งอำนวยฯ-สระ/อาหาร/บริการ/เสียงรีวิวจริง(ชม-ติ)/เทียบราคา-ความคุ้ม/ข้อควรรู้/สรุป
- เช็คว่าโรงแรมยังเปิดจริง (web-search) — ถ้าปิดถาวรให้บอกใน return
- affiliate Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain
${STYLE}
⚠️ อักษรไทยใน body ≥6800 · keywords ต้องยังอยู่ · JSON valid · return: จำนวนอักษรไทย body, เปิดจริงไหม`,
  { label:`rev:the-legend`, phase:'Expand' })

// ---- Phase 2: build both roundups ----
phase('Roundup')
const rounds = await parallel(ROUNDUPS.map(R => () =>
  agent(`สร้าง roundup ใหม่ "${R.title}" (cluster=${CLUSTER}, จังหวัด${PROV}) สไตล์เพื่อนเล่าให้ฟัง
อ่าน ${GOLD} + อ่านไฟล์รีวิวของโรงแรมในชุดนี้ทุกไฟล์เพื่อดึง score/price/rooms/agoda/booking/trip/heroImg/ทำเล
OUTPUT: astro/src/content/roundups/${R.newSlug}.json (ไทย) ครบ roundupSchema · slug="${R.newSlug}" · cluster="${CLUSTER}" · breadcrumb→${CRUMBHREF}
- โรงแรมในชุด (เรียงตามนี้เป๊ะ): ${R.members.map(s=>s+'.json').join(', ')}
- **entries.length === toc.length === compareRows.length === ${R.members.length}** เรียงตรงกัน · id=h1..h${R.members.length} · rank/toc.n ต่อเนื่อง 1..${R.members.length} · reviewUrl=<slug>.html (เช่น ${R.members[0]}.html)
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** สไตล์เพื่อนเล่า บอกจุดเด่น-ใครเหมาะ-ราคาคร่าว
- introHtml/mrtHtml(การเดินทางสู่เชียงราย)/advice/faq ครบ · เลขในหัวข้อ/ชื่อเรื่อง = ${R.members.length}
${STYLE}
⚠️ JSON valid · entries===toc===compareRows===${R.members.length} · reviewUrl ทุกตัวต้องตรงไฟล์รีวิวที่มีจริง · คำต้องห้าม=0`,
    { label:`rnd:${R.newSlug}`, phase:'Roundup' })
    .then(()=>({slug:R.newSlug, ok:true})).catch(e=>({slug:R.newSlug, ok:false, e:String(e)}))
))

return { built: rounds.filter(x=>x&&x.ok).map(x=>x.slug), failed: rounds.filter(x=>x&&!x.ok) }
