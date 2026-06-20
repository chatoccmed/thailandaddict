export const meta = {
  name: 'restaurants-roundup',
  description: 'Build a "10 popular restaurants in <province>" article (eat-ranking): research each from Google/Wongnai/FB/YouTube, ≥200 Thai words each, credited real photo, roundup-style restaurant cards + hotel-booking conversion. Returns the full article JSON for the main loop to write + verify.',
  phases: [
    { title: 'Plan', detail: 'research & pick the 10 most popular real restaurants + image source each' },
    { title: 'Write', detail: 'per-restaurant deep research, ≥200w, fetch credited photo, return card fields' },
    { title: 'Frame', detail: 'write province framing prose (intro/chips/faq/tip/cta/staycta text)' },
    { title: 'Assemble', detail: 'deterministically build the article object (restaurant + staycta blocks) and return it' },
  ],
}

// ───────────────────────── Province config (via args) ─────────────────────────
// Required: prov (ไทย), city (slug), slug, today ("YYYY-MM-DD").
// region:      { label, href }                       e.g. {label:'ภาคเหนือ', href:'region-north.html'}
// stayDefault: { href, label }                       fallback hotel-roundup link for every card
// stayMap:     [ { match:[คำในย่าน...], href, label } ]   area-keyword → specific hotel roundup
// stayCta:     { links:[{label,href,note}], ctaLabel, ctaHref }  (verified real roundups + Agoda url)
// related:     [ { href, title } ]   (optional; falls back to stayCta links + city hub)
const PROV = (args && args.prov) || 'เชียงใหม่';
const CITY = (args && args.city) || 'chiang-mai';
const SLUG = (args && args.slug) || `top10-popular-restaurants-${CITY}`;
const TODAY = (args && args.today) || '2026-06-20';
// Natural "in <place>" phrasing. Default "จังหวัด<X>"; for Bangkok pass display="กรุงเทพฯ".
const DISPLAY = (args && args.display) || `จังหวัด${PROV}`;
// Highlighted place name inside h1's <span class="hi">. Default = PROV; Bangkok pass hi="กรุงเทพฯ".
const HILITE = (args && args.hi) || PROV;
const IMGDIR = `images/food/${CITY}`;
const REGION = (args && args.region) || { label: '', href: '' };
const STAY_DEFAULT = (args && args.stayDefault) || { href: `top10-popular-hotels-${CITY}.html`, label: `ที่พักทำเลดีใน${PROV}` };
const STAY_MAP = (args && args.stayMap) || [];
const STAY_CTA = (args && args.stayCta) || null;
const RELATED_IN = (args && args.related) || null;

const RULES = `กฎคุณภาพ (LOCKED):
- โทน v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน
- **ร้านต้องมีจริง เปิดจริงปัจจุบัน** — วิจัยจาก Google Maps/รีวิว, Wongnai, เพจ Facebook ร้าน, YouTube รีวิว · อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปกินเอง
- **ห้ามแต่งตัวเลข/เมนู/ราคา/ที่อยู่** — ใช้เท่าที่ยืนยันได้จริง ถ้าไม่ชัดให้พูดกว้าง ๆ ไม่ระบุเท็จ
- **รูป:** ใช้รูปจริงของร้านจาก **เว็บทางการ/เพจ Facebook ร้าน** (หรือ Wongnai/Google/บล็อกอาหารของร้านนั้นจริง) · ห้ามรูปผิดร้าน/stock/โลโก้ · ห้าม Trip.com · **ต้องให้เครดิตภาพ** (ชื่อแหล่ง+ลิงก์)`;

const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['restaurants'], properties:{ restaurants:{ type:'array', minItems:10, maxItems:10, items:{
  type:'object', additionalProperties:false, required:['name','slug','area','signature','cuisine','whyPopular'], properties:{
    name:{type:'string'}, slug:{type:'string',description:'kebab อังกฤษ สั้น เฉพาะ a-z0-9- เช่น huen-phen'}, area:{type:'string',description:'ย่าน/อำเภอ (ใช้ map ที่พัก ระบุย่านให้ชัด)'},
    signature:{type:'string',description:'เมนูเด่น สั้น'}, cuisine:{type:'string',description:'ประเภท เช่น ข้าวซอย/อาหารเหนือ, คาเฟ่กาแฟ, ซีฟู้ด'},
    whyPopular:{type:'string',description:'ทำไมดัง อ้างแหล่ง'}, sources:{type:'string',description:'แหล่งที่เจอ'} } } } } };

const WRITE_SCHEMA = { type:'object', additionalProperties:false, required:['slug','descHtml','alt','imgOk'], properties:{
  slug:{type:'string'},
  descHtml:{type:'string',description:'คำบรรยายไทย ≥200 คำ (HTML: ใช้ <p>...</p> 3-4 ย่อหน้า, มี <strong> เน้นได้) ครอบคลุม: ร้านคืออะไร+ใครเหมาะ/เมนูเด่น/รสชาติจากรีวิวจริง/บรรยากาศ/ราคาโดยประมาณ/ทำเล-เวลาเปิด/ทำไมยอดนิยม/ข้อควรรู้ก่อนไป'},
  imgOk:{type:'boolean',description:'โหลดรูปจริงของร้านนี้สำเร็จไหม (JPEG จริง >15KB เป็นรูปร้านนี้)'},
  alt:{type:'string',description:'alt บรรยายรูปจริง'}, credit:{type:'string',description:'เครดิตภาพ เช่น "เพจเฟซบุ๊ก ร้าน X" / "Wongnai" / "เว็บไซต์ทางการ ร้าน X"'}, creditHref:{type:'string',description:'ลิงก์แหล่งรูป'},
  priceRange:{type:'string',description:'ช่วงราคาแบบสั้น เช่น "฿60–80/ชาม" หรือ "฿150–300/คน"'},
  score:{type:'string',description:'คะแนนถ้ามีจริง เช่น "Wongnai 4.1" / "Tripadvisor 4.3" — ถ้าไม่มีให้เว้นว่าง ""'},
  mustOrder:{type:'array',items:{type:'string'},description:'เมนูต้องลอง 2-4 อย่าง'},
  tags:{type:'array',items:{type:'string'},description:'แท็กสั้น 1-3 เช่น "ในตำนาน","มิชลินไกด์","เปิดมา 40 ปี"'},
  cuisine:{type:'string',description:'ประเภทอาหารที่ปรับให้ชัด'}, area:{type:'string',description:'ย่านที่ปรับให้ชัด'},
  // ชั้นข้อมูลนักท่องเที่ยวต่างชาติ (ใส่เท่าที่ยืนยันได้จริง — ห้ามเดา)
  hours:{type:'string',description:'เวลาเปิดแบบสั้น เช่น "09:30–16:30 ทุกวัน" หรือ "จ–ส 8:00–16:00 ปิดอาทิตย์" (ตามจริง)'},
  priceUsd:{type:'string',description:'ราคาโดยประมาณเป็น USD เช่น "$2–3" หรือ "$5–9/คน" (แปลงจาก THB ~36/USD)'},
  spice:{type:'string',description:'ระดับความเผ็ดถ้าระบุได้ เช่น "เผ็ดน้อย-ปานกลาง", "เผ็ดจัด (สั่งเผ็ดน้อยได้)" — ไม่ใช่ก็เว้น'},
  halal:{type:'boolean',description:'true เฉพาะร้านที่ฮาลาล/ฮาลาล-เฟรนด์ลีจริง (ยืนยันได้) ไม่งั้น false'},
  veg:{type:'boolean',description:'true ถ้ามีเมนูเจ/มังสวิรัติให้เลือกจริง ไม่งั้น false'},
  englishMenu:{type:'boolean',description:'true ถ้ามีเมนูภาษาอังกฤษ/รูปภาพ หรือสั่งง่ายสำหรับต่างชาติ ไม่งั้น false'},
  lat:{type:'number',description:'ละติจูดของร้านจาก Google Maps (ทศนิยม 5-6 ตำแหน่ง) — ใส่เฉพาะที่หาพิกัดจริงได้'},
  lng:{type:'number',description:'ลองจิจูดของร้านจาก Google Maps — ใส่เฉพาะที่หาพิกัดจริงได้'} } };

const FRAME_SCHEMA = { type:'object', additionalProperties:false,
  required:['title','h1','eyebrow','intro','leadHtml','chips','metaDesc','keywords','ogTitle','ogDesc','tipTitle','tipHtml','ctaText','ctaLabel','faq','stayTitle','stayText','foodTitle','foodText'], properties:{
  title:{type:'string',description:'<title> เต็ม ลงท้าย " | ThailandAddict"'},
  h1:{type:'string',description:`h1 รูปแบบ "10 ร้านอาหารยอดนิยม<br>ใน..." โดยครอบชื่อ "${HILITE}" ด้วย <span class="hi">${HILITE}</span> (ใช้ <br> ได้)`},
  eyebrow:{type:'string',description:`eyebrow สั้น เช่น "ที่กิน${PROV} · ร้านยอดนิยม"`},
  intro:{type:'string',description:'อินโทรใต้ hero 2-3 ประโยค (HTML, มี <strong> ได้) สไตล์เพื่อนเล่าให้ฟัง'},
  leadHtml:{type:'string',description:'ย่อหน้าเปิดก้อนแรกในเนื้อหา ปูบริบทว่าลิสต์นี้คัดยังไง อ้างรีวิวจริง (HTML)'},
  chips:{type:'array',items:{type:'string'},minItems:3,maxItems:5,description:'ชิป 3-5 อันมีอีโมจินำ'},
  metaDesc:{type:'string'}, keywords:{type:'string',description:'คีย์เวิร์ดคั่นด้วย , '}, ogTitle:{type:'string'}, ogDesc:{type:'string'},
  tipTitle:{type:'string'}, tipHtml:{type:'string',description:'ทิปวางแผนกินให้คุ้มทริป อ้างร้านในลิสต์จริง'},
  ctaText:{type:'string',description:'ข้อความปุ่มปิดท้าย ชวนจองที่พัก'}, ctaLabel:{type:'string',description:'ป้ายปุ่ม เช่น "ดูที่พัก'+PROV+'ทั้งหมด →"'},
  faq:{type:'array',minItems:5,maxItems:5,items:{type:'object',additionalProperties:false,required:['q','a'],properties:{q:{type:'string'},a:{type:'string'}}}},
  stayTitle:{type:'string',description:'หัวข้อโมดูลจองที่พัก province-flavored มีอีโมจิ 🛏️'},
  stayText:{type:'string',description:'ย่อหน้าโมดูลจองที่พัก ชวนเลือกทำเลใกล้ร้านเด็ด'},
  foodTitle:{type:'string',description:'หัวข้อโมดูลฟู้ดทัวร์/คลาสทำอาหาร เช่น "อยากกินให้ลึกกว่าเดิม? ลองฟู้ดทัวร์-คลาสทำอาหาร'+PROV+'"'},
  foodText:{type:'string',description:'ย่อหน้าชวนจองฟู้ดทัวร์/คลาสทำอาหารผ่าน Klook — ชิมหลายร้านมีไกด์พาไป/ลงมือทำเอง เหมาะกับนักท่องเที่ยว'} } };

// ───────────────────────── helpers (deterministic) ─────────────────────────
const mapHref = (name, area) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area} ${PROV}`)}`;
const resolveStay = (area) => {
  const a = String(area || '');
  for (const m of STAY_MAP) { if ((m.match || []).some(k => a.includes(k))) return { href: m.href, label: m.label }; }
  return { href: STAY_DEFAULT.href, label: STAY_DEFAULT.label };
};

// ───────────────────────── Plan ─────────────────────────
phase('Plan')
const plan = await agent(`วิจัยและคัดเลือก **10 ร้านอาหารยอดนิยมที่สุดในจังหวัด${PROV}** (ร้านที่คนพูดถึงจริง รีวิวเยอะ เปิดอยู่ปัจจุบัน — ผสมหลากหลาย: อาหารพื้นเมือง/ของกินขึ้นชื่อ/ร้านในตำนาน/คาเฟ่-ร้านดัง)
ค้นจาก: Google Maps + รีวิว, Wongnai (อันดับ/คะแนน), เพจ Facebook ร้าน, YouTube รีวิวอาหาร${PROV}
สำหรับแต่ละร้าน: ชื่อจริง, slug (kebab อังกฤษ a-z0-9- เท่านั้น ไม่ซ้ำกัน), ย่าน (ระบุให้ชัดเพื่อ map ที่พัก), เมนูเด่น, ประเภทอาหาร, ทำไมดัง (อ้างแหล่ง), แหล่งที่เจอ
${RULES}
คืนตาม schema (restaurants 10 ร้าน เรียงจากดัง/ไอคอนิกสุดลงไป)`,
  { label:'plan:restaurants', phase:'Plan', schema:PLAN_SCHEMA })

const rests = (plan && plan.restaurants) || []
log(`Planned ${rests.length} restaurants for ${PROV}`)
if (rests.length < 10) { return { ok:false, error:`plan returned only ${rests.length} restaurants`, slug:SLUG } }

// ───────────────────────── Write (parallel) ─────────────────────────
phase('Write')
const written = await parallel(rests.map((r, i) => () =>
  agent(`เขียนรีวิวเชิงลึกร้านอาหาร "${r.name}" (ย่าน ${r.area}, จังหวัด${PROV}) — ลำดับที่ ${i+1} จาก 10
วิจัยลึกจาก Google/รีวิว Google Maps + Wongnai + เพจ Facebook ร้าน + YouTube รีวิว — ดึงข้อมูลจริง: เมนูเด่น "${r.signature}", รสชาติ/จุดที่คนชม-ติ, ช่วงราคา, คะแนนรีวิว (ถ้ามี), ทำเล/เวลาเปิด, ความนิยม
เขียน **descHtml ภาษาไทย ≥200 คำ** (ขั้นต่ำ ~700 ตัวอักษรไทย, สไตล์เพื่อนเล่าให้ฟัง, อ้างเสียงรีวิวจริง, บอกข้อสังเกตตามจริง) เป็น HTML 3-4 ย่อหน้า <p>...</p> ครอบคลุม: ร้านคืออะไร+ใครเหมาะ / เมนูเด่นที่ต้องสั่ง / รสชาติ-คุณภาพจากรีวิว / บรรยากาศ / ช่วงราคา / ทำเล+เวลาเปิด / ทำไมยอดนิยม / ข้อควรรู้ก่อนไป
ส่งกลับด้วย: priceRange (สั้น), score (ถ้ามีจริงเท่านั้น), mustOrder (2-4 เมนู), tags (1-3 แท็กสั้น), cuisine, area
**ข้อมูลสำหรับนักท่องเที่ยวต่างชาติ (ใส่เท่าที่ยืนยันได้จริง ห้ามเดา):** hours (เวลาเปิดสั้น), priceUsd (ราคา ~USD), spice (ระดับเผ็ด ถ้ามี), halal/veg/englishMenu (true เฉพาะที่จริง), และ **lat/lng พิกัด Google Maps ของร้าน** (สำคัญ — ใช้ปักหมุดแผนที่ หาจากหน้า Google Maps ของร้าน)
**รูป:** หา URL รูปจริงของร้านนี้จาก **เว็บทางการ/เพจ Facebook ร้าน** (หรือ Wongnai/Google/บล็อกอาหารของร้านนี้จริง · ห้าม Trip.com/stock/โลโก้/รูปผิดร้าน) แล้ว:
  mkdir -p astro/public/${IMGDIR} ; curl -m 60 -L -A "Mozilla/5.0" "<url>" -o astro/public/${IMGDIR}/${r.slug}.jpg
  (ใช้ Bash dangerouslyDisableSandbox:true) · ยืนยันด้วย: file/oเช็คว่าเป็น JPEG จริง >15KB เป็นรูปร้านนี้ · ตั้ง imgOk=true + credit + creditHref · ถ้าหารูปจริงไม่ได้ imgOk=false (อย่าใส่รูปปลอม)
${RULES}
คืนตาม schema (slug="${r.slug}")`,
    { label:`rest:${r.slug}`, phase:'Write', schema:WRITE_SCHEMA })
    .then(w => ({ ...w, slug: r.slug, _ok: true }))
    .catch(e => ({ slug: r.slug, _ok: false, e: String(e).slice(0, 120) }))
))
// keep plan order; merge plan + write data
const cards = rests.map((r, i) => {
  const w = written.find(x => x && x.slug === r.slug) || {};
  return {
    rank: i + 1,
    name: r.name, slug: r.slug,
    area: (w.area && w.area.trim()) || r.area,
    cuisine: (w.cuisine && w.cuisine.trim()) || r.cuisine,
    signature: r.signature,
    priceRange: w.priceRange || '',
    score: w.score || '',
    descHtml: w.descHtml || '',
    imgOk: !!w.imgOk,
    alt: w.alt || `${r.name} ${PROV}`,
    credit: w.credit || '',
    creditHref: w.creditHref || '',
    mustOrder: Array.isArray(w.mustOrder) ? w.mustOrder : [],
    tags: Array.isArray(w.tags) ? w.tags : [],
    hours: (w.hours || '').trim(),
    priceUsd: (w.priceUsd || '').trim(),
    spice: (w.spice || '').trim(),
    halal: w.halal === true,
    veg: w.veg === true,
    englishMenu: w.englishMenu === true,
    lat: (typeof w.lat === 'number' && isFinite(w.lat)) ? w.lat : null,
    lng: (typeof w.lng === 'number' && isFinite(w.lng)) ? w.lng : null,
  };
});
const okCards = cards.filter(c => c.descHtml && c.descHtml.length > 50);
log(`Reviews written: ${okCards.length}/${rests.length} · images ok: ${cards.filter(c=>c.imgOk).length}`)

// ───────────────────────── Frame (province prose) ─────────────────────────
phase('Frame')
const frameInput = JSON.stringify(cards.map(c => ({ rank:c.rank, name:c.name, area:c.area, cuisine:c.cuisine, signature:c.signature, priceRange:c.priceRange, score:c.score })))
const frame = await agent(`เขียน "ส่วนกรอบบทความ" (ไม่ใช่เนื้อแต่ละร้าน) สำหรับบทความ **"10 ร้านอาหารยอดนิยมใน${DISPLAY}"**
นี่คือร้าน 10 ร้านในบทความ (ใช้เพื่อเขียนอินโทร/ทิป/FAQ ให้ตรงกับร้านจริง): ${frameInput}
เขียนทุก field ตาม schema เป็นภาษาไทย โทน v2-clean เพื่อนเล่าให้เพื่อนฟัง:
- title = "10 ร้านอาหารยอดนิยมใน${DISPLAY} ${TODAY.slice(0,4)} — ..." ลงท้าย " | ThailandAddict"
- h1 = "10 ร้านอาหารยอดนิยม<br>ใน..." ครอบชื่อ "${HILITE}" ด้วย <span class="hi"> · eyebrow สั้น · intro 2-3 ประโยค · leadHtml ปูบริบทว่าคัดจากเสียงรีวิวจริง ไม่ได้ไปกินเองทุกร้าน
- chips 3-5 อันมีอีโมจิ (เช่น ของขึ้นชื่อจังหวัด/มีร้านในตำนาน/ช่วงราคา) · metaDesc/keywords/ogTitle/ogDesc
- tipTitle+tipHtml วางแผนกินให้คุ้มทริป (อ้างร้านจริงในลิสต์) · ctaText+ctaLabel ชวนจองที่พัก
- faq 5 ข้อ (ร้านไหนดังสุด / ของกินขึ้นชื่อ${PROV} / ราคาประมาณ / ต้องจองไหม / ร้านไหนเปิดเย็น-กลางคืน) ตอบอ้างร้านจริง
- stayTitle (🛏️ ...) + stayText สำหรับโมดูลจองที่พัก
- foodTitle + foodText สำหรับโมดูลฟู้ดทัวร์/คลาสทำอาหาร (ชวนนักท่องเที่ยวจองประสบการณ์กินผ่าน Klook — ชิมหลายร้านมีไกด์ หรือลงมือทำอาหารไทยเอง)
${RULES}
คืนตาม schema`, { label:`frame:${SLUG}`, phase:'Frame', schema:FRAME_SCHEMA })

// ───────────────────────── Assemble (deterministic JS) ─────────────────────────
phase('Assemble')
const heroSlug = cards[0].slug
const heroImg = `/${IMGDIR}/${heroSlug}.jpg`

const restoBlock = (c) => {
  const stay = resolveStay(c.area)
  const b = {
    kind: 'restaurant', rank: c.rank, name: c.name,
    area: c.area, cuisine: c.cuisine, signature: c.signature,
    priceRange: c.priceRange || undefined,
    img: `/${IMGDIR}/${c.slug}.jpg`, alt: c.alt,
    credit: c.credit || undefined, creditHref: c.creditHref || undefined,
    descHtml: c.descHtml,
    mustOrder: c.mustOrder.length ? c.mustOrder : undefined,
    tags: c.tags.length ? c.tags : undefined,
    mapHref: mapHref(c.name, c.area),
    stayHref: stay.href, stayLabel: stay.label,
    hours: c.hours || undefined,
    priceUsd: c.priceUsd || undefined,
    spice: c.spice || undefined,
    halal: c.halal || undefined,
    veg: c.veg || undefined,
    englishMenu: c.englishMenu || undefined,
    lat: (c.lat != null) ? c.lat : undefined,
    lng: (c.lng != null) ? c.lng : undefined,
  }
  if (c.score && c.score.trim()) b.score = c.score.trim()
  // strip undefined for clean JSON
  Object.keys(b).forEach(k => b[k] === undefined && delete b[k])
  return b
}

// Food-experience monetization module (Klook food tours / cooking classes). City-derived, affiliate-tagged.
const cityEn = CITY.replace(/-/g, ' ')
const klook = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent((cityEn + ' ' + q).trim())}&aid=121442`
const foodexpBlock = {
  kind: 'foodexp',
  title: frame.foodTitle,
  text: frame.foodText,
  items: [
    { emoji:'🍜', label:`ฟู้ดทัวร์ชิมสตรีทฟู้ด${PROV}`, note:'ไกด์พาเดินชิมหลายร้านในทริปเดียว', href: klook('food tour'), provider:'Klook' },
    { emoji:'👩‍🍳', label:'คลาสเรียนทำอาหารไทย', note:'เดินตลาดสด + ลงมือทำเอง', href: klook('cooking class'), provider:'Klook' },
    { emoji:'🌃', label:'ทัวร์ตลาดกลางคืน & ของกิน', note:'ชิมของกินยามค่ำแบบมีคนพาไป', href: klook('night market food'), provider:'Klook' },
    { emoji:'🛵', label:'ทริปตามกินของอร่อยแบบคนท้องถิ่น', note:'ลุยร้านเด็ดนอกสายตานักท่องเที่ยว', href: klook('street food'), provider:'Klook' },
  ],
  ctaLabel: `🍢 ดูฟู้ดทัวร์ & คลาสทำอาหาร${PROV}ทั้งหมด (Klook)`,
  ctaHref: klook('food'),
}

const blocks = []
blocks.push({ kind:'p', html: frame.leadHtml })
cards.forEach((c, i) => {
  blocks.push(restoBlock(c))
  if (i === 4 && STAY_CTA) {
    blocks.push({
      kind: 'staycta',
      title: frame.stayTitle,
      text: frame.stayText,
      links: STAY_CTA.links,
      ctaLabel: STAY_CTA.ctaLabel,
      ctaHref: STAY_CTA.ctaHref,
    })
  }
})
blocks.push(foodexpBlock)
blocks.push({ kind:'tip', title: frame.tipTitle, html: frame.tipHtml })
blocks.push({ kind:'cta', text: frame.ctaText, href: STAY_DEFAULT.href, label: frame.ctaLabel })

const related = RELATED_IN || (
  STAY_CTA && STAY_CTA.links
    ? [{ href:`city-${CITY}.html`, title:`🧭 เที่ยว${PROV} — ที่พัก ที่กิน ที่เที่ยว` }, ...STAY_CTA.links.slice(0,3).map(l => ({ href:l.href, title:l.label }))]
    : [{ href:`city-${CITY}.html`, title:`🧭 เที่ยว${PROV}` }, { href:STAY_DEFAULT.href, title:STAY_DEFAULT.label }]
)

const article = {
  slug: SLUG, type:'eat-ranking', cluster: CITY,
  title: frame.title, metaDesc: frame.metaDesc, keywords: frame.keywords,
  ogTitle: frame.ogTitle, ogDesc: frame.ogDesc, image: heroImg,
  crumbCity: PROV, crumbCityHref: `city-${CITY}.html`,
  regionLabel: REGION.label || undefined, regionHref: REGION.href || undefined,
  eyebrow: frame.eyebrow, h1: frame.h1, heroEmoji:'🍜', heroImg,
  intro: frame.intro, chips: frame.chips, readTime:'12 นาที',
  publishedDate: TODAY, modifiedDate: TODAY,
  blocks, faq: frame.faq, related,
}
Object.keys(article).forEach(k => article[k] === undefined && delete article[k])

const missingImages = cards.filter(c => !c.imgOk).map(c => c.slug)
log(`Assembled article: ${blocks.filter(b=>b.kind==='restaurant').length} restaurants, ${missingImages.length} missing images`)

return {
  ok: true, slug: SLUG, city: CITY, prov: PROV,
  restaurantCount: blocks.filter(b => b.kind === 'restaurant').length,
  missingImages,
  imgReport: cards.map(c => ({ slug:c.slug, imgOk:c.imgOk })),
  shortDesc: cards.filter(c => (c.descHtml.replace(/<[^>]+>/g,'').match(/[฀-๿]/g)||[]).length < 700).map(c => c.slug),
  article,
}
