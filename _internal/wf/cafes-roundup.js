export const meta = {
  name: 'cafes-roundup',
  description: 'Build a "10 popular restaurants in <province>" article (eat-ranking, v3): per-restaurant deep review (≥200 Thai words) + Google rating/count + best-for + zone + foodType + dietary/geo info + 4 credited photos; province prose + local-tips; deterministic assemble of restaurant/staycta/foodexp/localtips blocks + sticky hotel rail + map. Returns the full article JSON for the main loop to write + verify.',
  phases: [
    { title: 'Plan', detail: 'research & pick the 10 most popular real restaurants' },
    { title: 'Write', detail: 'per-restaurant: ≥200w review, rating/count, best-for, zone, foodType, info, verify IG post + FB page' },
    { title: 'Frame', detail: 'province prose (intro/chips/faq/tip/cta/staycta/foodexp/localtips)' },
    { title: 'Assemble', detail: 'deterministically build the article object + return it' },
  ],
}

// ───────────────────────── Province config (via args, from build-resto-args.mjs) ─────────────────────────
// Required: prov, city, slug, today.  display/hi for special naming (Bangkok).
// region {label,href} · stayDefault {href,label} · stayMap [{match[],href,label}] (zone→hotel roundup)
// stayCta {links[{label,href,note}],ctaLabel,ctaHref} · rail [{title,href,note,img}] (sticky hotel cards w/ heroImg)
// related? [{href,title}]
// Normalize args: the harness may deliver it as a parsed object OR a JSON string — handle both.
const A = (typeof args === 'string') ? (function () { try { return JSON.parse(args); } catch (e) { return {}; } })() : (args || {});
const PROV = (A && A.prov) || 'เชียงใหม่';
const CITY = (A && A.city) || 'chiang-mai';
const SLUG = (A && A.slug) || `top10-popular-restaurants-${CITY}`;
const TODAY = (A && A.today) || '2026-06-20';
const DISPLAY = (A && A.display) || `จังหวัด${PROV}`;
const HILITE = (A && A.hi) || PROV;
const IMGDIR = `images/food/${CITY}`;
const REGION = (A && A.region) || { label: '', href: '' };
const STAY_DEFAULT = (A && A.stayDefault) || { href: `top10-popular-hotels-${CITY}.html`, label: `ที่พักทำเลดีใน${PROV}` };
const STAY_MAP = (A && A.stayMap) || [];
const STAY_CTA = (A && A.stayCta) || null;
const RAIL = (A && A.rail) || null;
const RELATED_IN = (A && A.related) || null;
log(`cfg: city=${CITY} · prov=${PROV} · display=${DISPLAY} · rail=${RAIL ? RAIL.length : 0} · stayCta=${STAY_CTA ? (STAY_CTA.links || []).length : 0}`);

const RULES = `กฎคุณภาพ (LOCKED):
- โทน v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน
- **ร้านต้องมีจริง เปิดจริงปัจจุบัน** — วิจัยจาก Google Maps/รีวิว, Wongnai, เพจ Facebook ร้าน, YouTube รีวิว (ใช้หาข้อมูลเบื้องหลัง — ไม่ต้องพูดถึงแหล่งในเนื้อหา) · บรรยายร้านอย่าง "มั่นใจและชวนมาลอง" ไม่กุว่าไปกินเอง และ **ห้ามเขียน disclaimer ลดเครดิตตัวเอง**
- **ห้ามแต่งตัวเลข/เมนู/ราคา/ที่อยู่/คะแนน/จำนวนรีวิว** — ใช้เท่าที่ยืนยันได้จริง ถ้าไม่ชัดให้พูดกว้าง ๆ ไม่ระบุเท็จ
- **รูป (embed-first, ลำดับความสำคัญ — owner 2026-06-23):** Instagram สำคัญสุด > Facebook > คลังภาพ CC · แผนที่มีเสมอ. ทำ tier ที่ดีที่สุดต่อร้าน: (1) igPost + fbPage + แผนที่ (2) igPost + แผนที่ (3) fbPage + แผนที่ (4) libImg(CC ผ่าน matchFoodImage) + แผนที่. ใส่เฉพาะ social ที่ **WebFetch-verify แล้ว** (ตรงร้าน เป็นสาธารณะ embed ขึ้นจริง — IG: instagram.com/p/<code>/embed/, igPost=shortcode ล้วน; FB: เพจ vanity-handle เท่านั้น เลขล้วน profile.php/p ไม่เรนเดอร์). ไม่มี social ที่ verify → libImg. ห้ามกุ/รูปผิดร้าน/ลายน้ำเว็บอื่น/Trip.com`;

const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['restaurants'], properties:{ restaurants:{ type:'array', minItems:10, maxItems:10, items:{
  type:'object', additionalProperties:false, required:['name','slug','area','signature','cuisine','whyPopular'], properties:{
    name:{type:'string'}, slug:{type:'string',description:'kebab อังกฤษ a-z0-9- ไม่ซ้ำ เช่น huen-phen'}, area:{type:'string',description:'ย่าน/อำเภอ (ระบุชัดเพื่อ map ที่พัก)'},
    signature:{type:'string',description:'เมนูเด่น สั้น'}, cuisine:{type:'string',description:'ประเภท เช่น ข้าวซอย/อาหารเหนือ, คาเฟ่, ซีฟู้ด'},
    whyPopular:{type:'string',description:'ทำไมดัง อ้างแหล่ง'}, sources:{type:'string',description:'แหล่งที่เจอ'} } } } } };

const WRITE_SCHEMA = { type:'object', additionalProperties:false, required:['slug','descHtml'], properties:{
  slug:{type:'string'},
  descHtml:{type:'string',description:'คำบรรยายไทย ≥200 คำ (~700 ตัวอักษรไทย) HTML 3-4 ย่อหน้า <p> ครอบคลุม: ร้านคืออะไร+ใครเหมาะ/เมนูเด่น/รสชาติจากรีวิวจริง/บรรยากาศ/ราคา/ทำเล-เวลาเปิด/ทำไมยอดนิยม/ข้อควรรู้'},
  igPost:{type:'string',description:'shortcode โพสต์ Instagram สาธารณะของร้านนี้ (เฉพาะส่วนหลัง /p/ เช่น DBksr1fvKvx) ที่ WebFetch https://www.instagram.com/p/<code>/embed/ แล้วเห็นโพสต์จริงของร้านนี้ (caption/รูป ไม่ใช่ login wall) — verify แล้วเท่านั้น · ยืนยันไม่ได้ให้เว้นว่าง (ห้ามเดา)'},
  fbPage:{type:'string',description:'URL เพจ Facebook ทางการแบบ vanity-handle https://www.facebook.com/<handle>/ ที่ยืนยันว่าตรงร้านนี้+เป็นสาธารณะ · ห้ามเพจเลขล้วน profile.php?id= หรือ /p/<name>-<id>/ (ไม่เรนเดอร์ใน plugin) · ยืนยันไม่ได้ให้เว้นว่าง (ห้ามเดา)'},
  priceRange:{type:'string',description:'ช่วงราคาสั้น เช่น "฿60–80/ชาม"'},
  rating:{type:'number',description:'คะแนน Google Maps ทศนิยม 1 ตำแหน่ง (เช่น 4.4) — ของจริงเท่านั้น'},
  ratingCount:{type:'number',description:'จำนวนรีวิว Google จริง (เช่น 3665) — หาเป๊ะไม่ได้ให้เว้น'},
  ratingSrc:{type:'string',description:'แหล่งคะแนน "Google" หรือ "Wongnai"'},
  bestFor:{type:'string',description:'วลีไทยสั้น "เหมาะสุดสำหรับ..." เช่น "มื้อแรกในจังหวัด", "สายคาเฟ่", "งบประหยัด", "มากันเป็นกลุ่ม", "มื้อค่ำ-ดึก"'},
  zone:{type:'string',description:'ย่านสั้นเพื่อจัดกลุ่ม/กรอง เช่น "เมืองเก่า","นิมมาน" — สั้น สม่ำเสมอ'},
  foodType:{type:'string',description:'หมวดอาหารสั้นเพื่อกรอง เช่น "ข้าวซอย","อาหารเหนือ","คาเฟ่","สตรีทฟู้ด","ซีฟู้ด","อีสาน"'},
  mustOrder:{type:'array',items:{type:'string'},description:'เมนูต้องลอง 2-4'},
  tags:{type:'array',items:{type:'string'},description:'แท็กสั้น 1-3'},
  cuisine:{type:'string'}, area:{type:'string'},
  hours:{type:'string',description:'เวลาเปิดสั้น เช่น "09:30–16:30 ทุกวัน"'}, priceUsd:{type:'string',description:'ราคา ~USD เช่น "$2–3" (THB~36/USD)'},
  spice:{type:'string',description:'ระดับเผ็ดถ้าระบุได้'}, halal:{type:'boolean'}, veg:{type:'boolean'}, englishMenu:{type:'boolean'},
  lat:{type:'number',description:'ละติจูด Google Maps'}, lng:{type:'number',description:'ลองจิจูด Google Maps'} } };

const FRAME_SCHEMA = { type:'object', additionalProperties:false,
  required:['title','h1','eyebrow','intro','leadHtml','chips','metaDesc','keywords','ogTitle','ogDesc','tipTitle','tipHtml','ctaText','ctaLabel','faq','stayTitle','stayText','foodTitle','foodText','localtips'], properties:{
  title:{type:'string',description:'<title> เต็ม ลงท้าย " | ThailandAddict"'},
  h1:{type:'string',description:`h1 "10 ร้านอาหารยอดนิยม<br>ใน..." ครอบ "${HILITE}" ด้วย <span class="hi">${HILITE}</span>`},
  eyebrow:{type:'string',description:'eyebrow สั้น เช่น "กินตามคน'+HILITE+' · อัปเดต '+TODAY.slice(0,4)+'"'}, intro:{type:'string',description:'อินโทรใต้ hero 2-3 ประโยค เล่าเสน่ห์อาหาร+ชวนมาลอง (HTML) — ห้ามลิสต์แหล่งรีวิว (Google Maps/Wongnai/คลิป) หรือเขียน disclaimer'}, leadHtml:{type:'string',description:'ย่อหน้าเล่าเรื่อง 2 ย่อหน้า เชิญชวนให้มากิน (HTML ตามคำสั่งใน prompt) — ห้าม disclaimer/ห้ามลิสต์แหล่งรีวิว'},
  chips:{type:'array',items:{type:'string'},minItems:3,maxItems:5}, metaDesc:{type:'string'}, keywords:{type:'string'}, ogTitle:{type:'string'}, ogDesc:{type:'string'},
  tipTitle:{type:'string'}, tipHtml:{type:'string',description:'ทิปวางแผนกิน อ้างร้านจริง'}, ctaText:{type:'string'}, ctaLabel:{type:'string'},
  faq:{type:'array',minItems:5,maxItems:5,items:{type:'object',additionalProperties:false,required:['q','a'],properties:{q:{type:'string'},a:{type:'string'}}}},
  stayTitle:{type:'string',description:'หัวข้อโมดูลที่พัก มี 🛏️'}, stayText:{type:'string'},
  foodTitle:{type:'string',description:'หัวข้อโมดูลฟู้ดทัวร์/คลาส'}, foodText:{type:'string',description:'ย่อหน้าชวนจองฟู้ดทัวร์/คลาส (Klook/GetYourGuide)'},
  localtips:{type:'array',minItems:4,maxItems:6,description:'กล่อง "รู้ก่อนไปกิน" สำหรับนักท่องเที่ยวต่างชาติ',items:{type:'object',additionalProperties:false,required:['icon','title','text'],properties:{icon:{type:'string',description:'อีโมจิ 1 ตัว'},title:{type:'string'},text:{type:'string',description:'1-2 ประโยค'}}}} } };

// ───────────────────────── helpers (deterministic) ─────────────────────────
const mapHref = (name, area) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${area} ${PROV}`)}`;
const resolveStay = (zone, area) => {
  const hay = `${zone || ''} ${area || ''}`;
  for (const m of STAY_MAP) { if ((m.match || []).some(k => hay.includes(k))) return { href: m.href, label: m.label }; }
  return { href: STAY_DEFAULT.href, label: STAY_DEFAULT.label };
};

// ───────────────────────── Plan ─────────────────────────
phase('Plan')
const plan = await agent(`วิจัยและคัดเลือก **10 คาเฟ่ยอดนิยมที่สุดใน${PROV}** (คนพูดถึงจริง รีวิวเยอะ เปิดอยู่ปัจจุบัน — ผสมหลากหลาย: คาเฟ่กาแฟ specialty/คาเฟ่บรันช์-ออลเดย์/คาเฟ่ของหวาน-เบเกอรี/คาเฟ่บรรยากาศดี-ถ่ายรูป/คาเฟ่ในตำนาน)
ค้นจาก: Google Maps + รีวิว, Wongnai, เพจ FB ร้าน, YouTube รีวิวคาเฟ่${PROV}
แต่ละคาเฟ่: ชื่อจริง, slug (kebab a-z0-9- ไม่ซ้ำ), ย่าน (ชัด), เมนูเด่น, ประเภท, ทำไมดัง (อ้างแหล่ง), แหล่ง
${RULES}
คืนตาม schema (10 คาเฟ่ เรียงดัง/ไอคอนิกสุดลงไป)`,
  { label:'plan:restaurants', phase:'Plan', schema:PLAN_SCHEMA })

const rests = (plan && plan.restaurants) || []
log(`Planned ${rests.length} restaurants for ${PROV}`)
if (rests.length < 10) { return { ok:false, error:`plan returned only ${rests.length} restaurants`, slug:SLUG } }

// ───────────────────────── Write (parallel) ─────────────────────────
phase('Write')
const written = await parallel(rests.map((r, i) => () =>
  agent(`เขียนรีวิวเชิงลึก + เก็บข้อมูลร้าน "${r.name}" (ย่าน ${r.area}, ${PROV}) — ลำดับ ${i+1}/10
วิจัยลึกจาก Google Maps/รีวิว + Wongnai + เพจ FB + YouTube: เมนูเด่น "${r.signature}", รสชาติ/ชม-ติ, ราคา, ทำเล/เวลาเปิด, ความนิยม
1) **descHtml ไทย ≥200 คำ** (~700 ตัวอักษรไทย, เพื่อนเล่าให้ฟัง, อ้างรีวิวจริง, บอกข้อสังเกต) HTML 3-4 <p> ครอบคลุม: ร้านคืออะไร+ใครเหมาะ/เมนูต้องสั่ง/รสชาติจากรีวิว/บรรยากาศ/ราคา/ทำเล+เวลาเปิด/ทำไมยอดนิยม/ข้อควรรู้
2) **คะแนนจริง:** rating (Google Maps ทศนิยม 1) + ratingCount (จำนวนรีวิวจริง) + ratingSrc="Google" — **ห้ามแต่งตัวเลข** หาเป๊ะไม่ได้ให้เว้น ratingCount
3) **bestFor** (เหมาะสุดสำหรับใคร/ตอนไหน), **zone** (ย่านสั้นจัดกลุ่ม), **foodType** (หมวดอาหารสั้น), priceRange, mustOrder(2-4), tags(1-3), cuisine, area
4) **ข้อมูลต่างชาติ (จริงเท่านั้น):** hours, priceUsd, spice, halal/veg/englishMenu (true เฉพาะจริง), **lat/lng พิกัด Google Maps** (สำคัญ-ปักหมุด)
5) **รูป embed (ลำดับความสำคัญ Instagram > Facebook · ไม่ต้องโหลด/curl รูปใด ๆ):**
   - **igPost (สำคัญสุด):** ค้นโพสต์ Instagram สาธารณะของร้านนี้ (จาก WebSearch: "<ชื่อร้าน> ${PROV} instagram", site:instagram.com, บล็อก/เพจที่ฝังโพสต์ร้านนี้) แล้ว **WebFetch \`https://www.instagram.com/p/<code>/embed/\`** ต้องเห็นโพสต์จริงของร้านนี้ (caption/รูป/แท็กสถานที่ตรงร้าน ไม่ใช่ login wall/error) → ใส่ igPost = shortcode ล้วน (ส่วนระหว่าง /p/ กับ / เท่านั้น) · ยืนยันไม่ได้ให้เว้น
   - **fbPage (รองลงมา):** ค้นเพจ Facebook ทางการของร้าน แบบ vanity-handle (facebook.com/<handle>/) ยืนยันว่าตรงร้านนี้+เป็นสาธารณะ → ใส่ fbPage = URL เต็ม · เพจเลขล้วน (profile.php?id=, /p/<name>-<id>/) เรนเดอร์ไม่ได้ ให้เว้น
   - **ห้ามเดา/ใส่มั่ว — เว้นดีกว่าผิด** (ระบบจะใช้คลังรูป CC + แผนที่แทนอัตโนมัติ) · แผนที่ Google มีให้ทุกร้านอยู่แล้ว ไม่ต้องทำ
${RULES}
คืนตาม schema (slug="${r.slug}")`,
    { label:`rest:${r.slug}`, phase:'Write', schema:WRITE_SCHEMA })
    .then(w => ({ ...w, slug: r.slug, _ok: true }))
    .catch(e => ({ slug: r.slug, _ok: false, e: String(e).slice(0, 120) }))
))
const cleanIg = (s) => { const v = String(s || '').trim().replace(/^.*\/p\//, '').replace(/\/.*$/, ''); return /^[A-Za-z0-9_-]{5,}$/.test(v) ? v : null; };
const cleanFb = (s) => { const v = String(s || '').trim().replace(/\?.*$/, ''); return (/^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+\/?$/.test(v) && !/profile\.php/.test(v) && !/\/p\//.test(v)) ? v : null; };
const cards = rests.map((r, i) => {
  const w = written.find(x => x && x.slug === r.slug) || {};
  return {
    rank: i + 1, name: r.name, slug: r.slug,
    area: (w.area && w.area.trim()) || r.area,
    cuisine: (w.cuisine && w.cuisine.trim()) || r.cuisine,
    foodType: (w.foodType && w.foodType.trim()) || '',
    zone: (w.zone && w.zone.trim()) || '',
    bestFor: (w.bestFor && w.bestFor.trim()) || '',
    signature: r.signature, priceRange: w.priceRange || '',
    rating: (typeof w.rating === 'number' && isFinite(w.rating)) ? w.rating : null,
    ratingCount: (typeof w.ratingCount === 'number' && isFinite(w.ratingCount)) ? Math.round(w.ratingCount) : null,
    ratingSrc: (w.ratingSrc && w.ratingSrc.trim()) || 'Google',
    descHtml: w.descHtml || '',
    igPost: cleanIg(w.igPost), fbPage: cleanFb(w.fbPage),
    mustOrder: Array.isArray(w.mustOrder) ? w.mustOrder : [],
    tags: Array.isArray(w.tags) ? w.tags : [],
    hours: (w.hours || '').trim(), priceUsd: (w.priceUsd || '').trim(), spice: (w.spice || '').trim(),
    halal: w.halal === true, veg: w.veg === true, englishMenu: w.englishMenu === true,
    lat: (typeof w.lat === 'number' && isFinite(w.lat)) ? w.lat : null,
    lng: (typeof w.lng === 'number' && isFinite(w.lng)) ? w.lng : null,
  };
});
const okCards = cards.filter(c => c.descHtml && c.descHtml.length > 50);
log(`Reviews: ${okCards.length}/${rests.length} · IG: ${cards.filter(c=>c.igPost).length} · FB: ${cards.filter(c=>c.fbPage).length} · ratings: ${cards.filter(c=>c.rating).length}`)

// ───────────────────────── Frame (province prose) ─────────────────────────
phase('Frame')
const frameInput = JSON.stringify(cards.map(c => ({ rank:c.rank, name:c.name, area:c.area, foodType:c.foodType, zone:c.zone, signature:c.signature, priceRange:c.priceRange, rating:c.rating })))
const frame = await agent(`เขียน "ส่วนกรอบบทความ" (ไม่ใช่เนื้อแต่ละร้าน) สำหรับ **"10 คาเฟ่ยอดนิยมใน${DISPLAY}"**
คาเฟ่ 10 ร้าน (อ้างให้ตรงจริง): ${frameInput}
เขียนทุก field ตาม schema เป็นภาษาไทย โทน v2-clean เพื่อนเล่าให้เพื่อนฟัง:
- title "10 คาเฟ่ยอดนิยมใน${DISPLAY} ${TODAY.slice(0,4)} — ..." ลงท้าย " | ThailandAddict" · h1 ครอบ "${HILITE}" ด้วย <span class="hi"> · eyebrow · intro 2-3 ประโยค
- leadHtml = ย่อหน้านำ "เล่าเรื่อง" 2 ย่อหน้า (<p>…</p><p>…</p>) สไตล์เพื่อนเล่าให้เพื่อน: ย่อหน้าแรกเล่าเสน่ห์/วัฒนธรรมคาเฟ่ของ${PROV} (ย่าน·บรรยากาศ·แนวอาหารเด่น) ชวนให้อยากมาลอง · ย่อหน้าสองเล่าตำนาน/จุดเด่นของร้านในลิสต์ (ประวัติ·รางวัล·ของขึ้นชื่อที่ยืนยันได้) แล้วชวนมากิน — **ห้ามเขียน disclaimer ลดเครดิตตัวเอง** (ห้ามวลี "ไม่ได้ไปกินเอง / รวบรวมจากรีวิว / ไม่เดาให้ / พูดกว้าง ๆ") และห้ามกุว่าไปกินเอง — บรรยายอย่างมั่นใจจากชื่อเสียงและข้อมูลที่ยืนยันได้
- chips 3-5 (อีโมจินำ) · metaDesc/keywords/ogTitle/ogDesc · tipTitle+tipHtml (วางแผนกิน อ้างร้านจริง) · ctaText+ctaLabel (ชวนจองที่พัก)
- faq 5 ข้อ (คาเฟ่ไหนดังสุด/เมนูเด็ด${PROV}/ราคา/ที่จอดรถ-คิว/เปิดกี่โมง) ตอบอ้างร้านจริง
- stayTitle (🛏️)+stayText (โมดูลจองที่พัก) · foodTitle+foodText (ฟู้ดทัวร์/คลาสทำอาหารผ่าน Klook/GetYourGuide — ชิมหลายร้านมีไกด์/ลงมือทำเอง)
- **localtips 4-6 ข้อ "รู้ก่อนไปคาเฟ่ที่${PROV}"** สำหรับต่างชาติ {icon,title,text}: การเดินทาง (Grab/รถ/เดิน), จ่ายเงิน (สตรีท=เงินสด), ช่วงเวลา-เลี่ยงคิว, ทิป, ภาษา/เมนูอังกฤษ
${RULES}
คืนตาม schema`, { label:`frame:${SLUG}`, phase:'Frame', schema:FRAME_SCHEMA })

// ───────────────────────── Assemble (deterministic JS) ─────────────────────────
phase('Assemble')
const heroImg = '/images/food/_lib/street-food.jpg'  // CC default (valid on R2); finalize-resto.mjs refines to a better-matched CC hero + credit

const restoBlock = (c) => {
  const stay = resolveStay(c.zone, c.area)
  const b = {
    kind: 'restaurant', rank: c.rank, name: c.name,
    area: c.area, cuisine: c.cuisine, signature: c.signature,
    priceRange: c.priceRange || undefined,
    igPost: c.igPost || undefined, fbPage: c.fbPage || undefined,
    descHtml: c.descHtml,
    mustOrder: c.mustOrder.length ? c.mustOrder : undefined,
    tags: c.tags.length ? c.tags : undefined,
    mapHref: mapHref(c.name, c.area),
    stayHref: stay.href, stayLabel: stay.label,
    bestFor: c.bestFor || undefined, zone: c.zone || undefined, foodType: c.foodType || undefined,
    rating: (c.rating != null) ? c.rating : undefined,
    ratingCount: (c.ratingCount != null) ? c.ratingCount : undefined,
    ratingSrc: (c.rating != null) ? c.ratingSrc : undefined,
    hours: c.hours || undefined, priceUsd: c.priceUsd || undefined, spice: c.spice || undefined,
    halal: c.halal || undefined, veg: c.veg || undefined, englishMenu: c.englishMenu || undefined,
    lat: (c.lat != null) ? c.lat : undefined, lng: (c.lng != null) ? c.lng : undefined,
  }
  Object.keys(b).forEach(k => b[k] === undefined && delete b[k])
  return b
}

// Food-experience monetization module (Klook + GetYourGuide). City-derived, affiliate-tagged.
const cityEn = CITY.replace(/-/g, ' ')
const klook = (q) => `https://www.klook.com/en-US/search/?query=${encodeURIComponent((cityEn + ' ' + q).trim())}&aid=121442`
const gyg = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent((cityEn + ' ' + q).trim())}`
const foodexpBlock = {
  kind: 'foodexp', title: frame.foodTitle, text: frame.foodText,
  items: [
    { emoji:'🍜', label:`ฟู้ดทัวร์ชิมสตรีทฟู้ด${PROV}`, note:'ไกด์พาเดินชิมหลายร้านในทริปเดียว', href: klook('food tour'), provider:'Klook' },
    { emoji:'👩‍🍳', label:'คลาสเรียนทำอาหารไทย', note:'เดินตลาดสด + ลงมือทำเอง', href: klook('cooking class'), provider:'Klook' },
    { emoji:'🌃', label:'ทัวร์ตลาดกลางคืน & ของกิน', note:'ชิมของกินยามค่ำแบบมีคนพาไป', href: klook('night market food'), provider:'Klook' },
    { emoji:'🛵', label:'ทริปตามกินของอร่อยแบบคนท้องถิ่น', note:'ลุยร้านเด็ดนอกสายตานักท่องเที่ยว', href: gyg('food tour'), provider:'GetYourGuide' },
  ],
  ctaLabel: `🍢 ดูฟู้ดทัวร์ & คลาสทำอาหาร${PROV}ทั้งหมด`, ctaHref: klook('food'),
}

const blocks = []
blocks.push({ kind:'p', html: frame.leadHtml })
cards.forEach((c, i) => {
  blocks.push(restoBlock(c))
  if (i === 4 && STAY_CTA) {
    blocks.push({ kind:'staycta', title: frame.stayTitle, text: frame.stayText, links: STAY_CTA.links, ctaLabel: STAY_CTA.ctaLabel, ctaHref: STAY_CTA.ctaHref })
  }
})
blocks.push(foodexpBlock)
if (frame.localtips && frame.localtips.length) blocks.push({ kind:'localtips', title:`รู้ก่อนไปคาเฟ่ที่${PROV}`, items: frame.localtips })
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
  eyebrow: frame.eyebrow, h1: frame.h1, heroEmoji:'☕', heroImg,
  intro: frame.intro, chips: frame.chips, readTime:'12 นาที',
  publishedDate: TODAY, modifiedDate: TODAY,
  blocks, faq: frame.faq, related,
  rail: (RAIL && RAIL.length) ? RAIL : undefined,
}
Object.keys(article).forEach(k => article[k] === undefined && delete article[k])

const shortDesc = cards.filter(c => (c.descHtml.replace(/<[^>]+>/g,'').match(/[฀-๿]/g)||[]).length < 700).map(c => c.slug)
const noSocial = cards.filter(c => !c.igPost && !c.fbPage).map(c => c.slug)
log(`Assembled: ${blocks.filter(b=>b.kind==='restaurant').length} restos · IG:${cards.filter(c=>c.igPost).length} · FB:${cards.filter(c=>c.fbPage).length} · noSocial(→CC):${noSocial.length} · noRating:${cards.filter(c=>!c.rating).length} · short:${shortDesc.length}`)

return {
  ok: true, slug: SLUG, city: CITY, prov: PROV,
  restaurantCount: blocks.filter(b => b.kind === 'restaurant').length,
  shortDesc, noSocial,
  ratingsOk: cards.filter(c => c.rating && c.ratingCount).length,
  igCount: cards.filter(c => c.igPost).length, fbCount: cards.filter(c => c.fbPage).length,
  mediaReport: cards.map(c => ({ slug:c.slug, igPost:c.igPost||null, fbPage:c.fbPage||null, tier: (c.igPost&&c.fbPage)?1:c.igPost?2:c.fbPage?3:4, rating:c.rating, zone:c.zone, foodType:c.foodType })),
  needsFinalize: true,
  article,
}
