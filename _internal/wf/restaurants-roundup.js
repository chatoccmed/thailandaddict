export const meta = {
  name: 'restaurants-roundup',
  description: 'Build a "10 popular restaurants in <province>" article: research each from Google/Wongnai/FB/YouTube, ≥200 Thai words each, credited image from official site/FB. Demo: Chiang Mai.',
  phases: [
    { title: 'Plan', detail: 'research & pick the 10 most popular real restaurants + image source each' },
    { title: 'Write', detail: 'per-restaurant deep research, ≥200w, fetch credited image' },
    { title: 'Assemble', detail: 'build the article JSON (articleSchema + image blocks) + verify' },
  ],
}

// Province config (args overrides for reuse). Demo = Chiang Mai.
const PROV = (args && args.prov) || 'เชียงใหม่';
const CITY = (args && args.city) || 'chiang-mai';
const SLUG = (args && args.slug) || 'top10-popular-restaurants-chiang-mai';
const IMGDIR = `images/food/${CITY}`;

const RULES = `กฎคุณภาพ (LOCKED):
- โทน v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน
- **ร้านต้องมีจริง เปิดจริงปัจจุบัน** — วิจัยจาก Google Maps/รีวิว, Wongnai, เพจ Facebook ร้าน, YouTube รีวิว · อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปกินเอง
- **ห้ามแต่งตัวเลข/เมนู/ราคา/ที่อยู่** — ใช้เท่าที่ยืนยันได้จริง ถ้าไม่ชัดให้พูดกว้าง ๆ ไม่ระบุเท็จ
- **รูป:** ใช้รูปจริงของร้านจาก **เว็บทางการ/เพจ Facebook ร้าน** (หรือ Wongnai/Google ของร้านนั้นจริง) · ห้ามรูปผิดร้าน/stock · **ต้องให้เครดิตภาพ** (ชื่อแหล่ง+ลิงก์)`;

const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['restaurants'], properties:{ restaurants:{ type:'array', minItems:10, maxItems:10, items:{
  type:'object', additionalProperties:false, required:['name','slug','area','signature','whyPopular'], properties:{
    name:{type:'string'}, slug:{type:'string',description:'kebab อังกฤษ สั้น เช่น huen-phen'}, area:{type:'string',description:'ย่าน/อำเภอ'},
    signature:{type:'string',description:'เมนูเด่น'}, cuisine:{type:'string'}, whyPopular:{type:'string',description:'ทำไมดัง อ้างแหล่ง'},
    sources:{type:'string',description:'แหล่งที่เจอ (Wongnai/Google/FB/YouTube)'} } } } } };

const WRITE_SCHEMA = { type:'object', additionalProperties:false, required:['slug','h2','descHtml','alt','credit'], properties:{
  slug:{type:'string'}, h2:{type:'string',description:'หัวข้อร้าน เช่น "1. ร้าน X — เมนูเด่น"'},
  descHtml:{type:'string',description:'คำบรรยายไทย ≥200 คำ (อาจมี <strong>) ครอบคลุม: ร้านคืออะไร/เมนูเด่น/รสชาติจากรีวิวจริง/บรรยากาศ/ราคาโดยประมาณ/ทำเล-เวลาเปิด/ทำไมคนชอบ/ข้อสังเกตตามจริง'},
  imgOk:{type:'boolean',description:'โหลดรูปจริงสำเร็จไหม'}, alt:{type:'string'}, credit:{type:'string',description:'เครดิตภาพ เช่น "เพจเฟซบุ๊ก ร้าน X" / "เว็บไซต์ทางการ ร้าน X" / "Wongnai"'}, creditHref:{type:'string'} } };

phase('Plan')
const plan = await agent(`วิจัยและคัดเลือก **10 ร้านอาหารยอดนิยมที่สุดในจังหวัด${PROV}** (ร้านที่คนพูดถึงจริง รีวิวเยอะ เปิดอยู่ปัจจุบัน — ผสมหลากหลาย: อาหารพื้นเมือง/ของกินขึ้นชื่อ/ร้านในตำนาน/คาเฟ่-ร้านดัง)
ค้นจาก: Google Maps + รีวิว, Wongnai (อันดับ/คะแนน), เพจ Facebook ร้าน, YouTube รีวิวอาหาร${PROV}
สำหรับแต่ละร้าน: ชื่อจริง, slug (kebab อังกฤษ), ย่าน, เมนูเด่น, ประเภทอาหาร, ทำไมดัง (อ้างแหล่ง), แหล่งที่เจอ
${RULES}
คืนตาม schema (restaurants 10 ร้าน เรียงจากดัง/ไอคอนิกสุด)`,
  { label:'plan:restaurants', phase:'Plan', schema:PLAN_SCHEMA })

const rests = (plan && plan.restaurants) || []
log(`Planned ${rests.length} restaurants for ${PROV}`)

phase('Write')
const written = await parallel(rests.map((r, i) => () =>
  agent(`เขียนรีวิวเชิงลึกร้านอาหาร "${r.name}" (ย่าน ${r.area}, จังหวัด${PROV}) — ลำดับที่ ${i+1}
วิจัยลึกจาก Google/รีวิว Google Maps + Wongnai + เพจ Facebook ร้าน + YouTube รีวิว — ดึงข้อมูลจริง: เมนูเด่น "${r.signature}", รสชาติ/จุดที่คนชม-ติ, ช่วงราคา, ทำเล/เวลาเปิด, ความนิยม
เขียน **descHtml ภาษาไทย ≥200 คำ** (สไตล์เพื่อนเล่าให้ฟัง, อ้างเสียงรีวิวจริง, บอกข้อสังเกตตามจริง) ครอบคลุม: ร้านคืออะไร+ใครเหมาะ / เมนูเด่นที่ต้องสั่ง / รสชาติ-คุณภาพจากรีวิว / บรรยากาศ / ช่วงราคา / ทำเล+เวลาเปิด / ทำไมยอดนิยม / ข้อควรรู้ก่อนไป
**รูป:** หา URL รูปจริงของร้านนี้จาก **เว็บทางการหรือเพจ Facebook ร้าน** (หรือ Wongnai/Google ของร้านนี้จริง) แล้ว curl -m 60 -A "Mozilla/5.0" <url> -o astro/public/${IMGDIR}/${r.slug}.jpg (Bash dangerouslyDisableSandbox:true; mkdir -p ก่อน) · ยืนยัน file เป็น JPEG จริง >15KB เป็นรูปร้านนี้จริง (ไม่ใช่รูปผิดร้าน/โลโก้/stock) · บันทึก credit = แหล่ง + creditHref = ลิงก์แหล่ง · ถ้าหารูปจริงไม่ได้ imgOk=false (อย่าใส่รูปปลอม)
h2 = "${i+1}. ${r.name}" (อาจเติม em-dash เมนูเด่น)
${RULES}
คืนตาม schema`,
    { label:`rest:${r.slug}`, phase:'Write', schema:WRITE_SCHEMA })
    .then(w=>({...w, _ok:true})).catch(e=>({slug:r.slug, _ok:false, e:String(e).slice(0,80)}))
))
const okWrites = written.filter(w=>w&&w._ok&&w.descHtml)
log(`Reviews written: ${okWrites.length}/${rests.length}`)

phase('Assemble')
const payload = JSON.stringify(okWrites.map((w,i)=>({order:i+1, slug:w.slug, h2:w.h2, descHtml:w.descHtml, imgOk:w.imgOk, alt:w.alt, credit:w.credit, creditHref:w.creditHref})))
await agent(`ประกอบไฟล์บทความ "10 ร้านอาหารยอดนิยมในจังหวัด${PROV}" ตาม articleSchema (astro/src/content.config.ts)
OUTPUT: astro/src/content/articles/${SLUG}.json (ไทยอย่างเดียว) ครบ articleSchema:
- slug="${SLUG}" · type="eat-ranking" · cluster="${CITY}" · crumbCity="${PROV}" · crumbCityHref="city-${CITY}.html" · regionLabel/regionHref ตามภาคของจังหวัด · eyebrow · heroEmoji="🍜"
- h1 (มี <span class="hi"> ได้) · intro (เกริ่นนำสไตล์เรา ~2-3 ประโยค) · chips (3-5) · readTime · keywords/metaDesc/ogTitle/ogDesc/image
- heroImg = "/${IMGDIR}/<slug ร้านอันดับ1>.jpg" (ถ้า imgOk) ไม่งั้นเว้น
- **blocks**: เริ่มด้วย p เกริ่น 1 ก้อน, แล้ว**ต่อแต่ละร้าน 10 ร้าน**ตามลำดับ ใช้ 3 บล็อก: {kind:"h2",text:<h2>} แล้ว {kind:"image",src:"/${IMGDIR}/<slug>.jpg",alt:<alt>,credit:<credit>,creditHref:<creditHref>} (ใส่เฉพาะร้านที่ imgOk=true; ถ้า false ข้าม image block) แล้ว {kind:"p",html:<descHtml>} · ปิดท้ายด้วย tip 1 + cta 1
- faq: 5 ข้อ (ร้านไหนดังสุด/ของกินขึ้นชื่อ${PROV}/ราคาประมาณ/จองไหม/ฯลฯ) · related: 4 ลิงก์ไปบทความ/รีวิว ${CITY} ที่มีจริง (ตรวจ ls astro/src/content/articles|reviews|roundups ก่อนลิงก์)
ข้อมูลร้าน (ใช้ descHtml/h2/credit ตามนี้เป๊ะ ห้ามแก้เนื้อหา): ${payload}
${RULES}
⚠️ ก่อนเสร็จ: node -e ตรวจ JSON.parse ได้ + มี h2/p ครบทุกร้าน + image block ชี้ไฟล์ที่มีจริงเท่านั้น (ls astro/public/${IMGDIR}/) + ค้นคำต้องห้าม=0 · return: ok, จำนวนร้าน, จำนวน image block`,
  { label:`assemble:${SLUG}`, phase:'Assemble' })

return { slug: SLUG, planned: rests.length, written: okWrites.length,
  restaurants: rests.map(r=>r.name), writeFails: written.filter(w=>w&&!w._ok).map(w=>w.slug) }
