export const meta = {
  name: 'port-final-articles',
  description: 'Write the 2 final NEW articles (owner: rewrite, not redirect): thailand-best-temples (national, 20 temples) + nakhon-si-thammarat-food-guide. Full articleSchema, real hero images. Completes the 195/195 migration.',
  phases: [{ title: 'Articles', detail: 'one agent per article: research, write JSON, fetch hero img' }],
}

const STYLE = 'สไตล์ thailandaddict (v2-clean): "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ เข้าใจง่าย · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน';
const SCHEMA = 'articleSchema (astro/src/content.config.ts): required slug,type,cluster,title,metaDesc,crumbCity,crumbCityHref,eyebrow,h1,intro,blocks[] · optional keywords,heroImg,chips,readTime,faq[],related[] · block.kind ∈ {h2{text},p{html},list{items[]},tip{title?,html},ranked{items[{rank,name,blurb,meta?,price?,tags?[]}]},cards{items[{name,blurb,tag?}]},day{label,items[]},cta{text,href,label?}}';

const ARTICLES = [
  { slug:'thailand-best-temples', cluster:'thailand', type:'attraction',
    crumbCity:'ประเทศไทย', crumbCityHref:'country-thailand.html',
    h1:'20 วัดสวยทั่วไทย ที่ควรไปสักครั้งในชีวิต', emoji:'🛕',
    brief:'พอร์ตจากโพสต์เก่า top-20-temple-in-thailand-by-traveloka — ลิสต์ "20 วัดสวยทั่วไทย" ระดับประเทศ. ref โครงสร้าง: astro/src/content/articles/chiang-rai-attractions.json (type attraction, ใช้ ranked block). คัด 20 วัดดังจริงกระจายทุกภาค (เช่น วัดพระแก้ว/วัดอรุณ/วัดโพธิ์ กทม., วัดร่องขุ่น เชียงราย, วัดพระธาตุดอยสุเทพ เชียงใหม่, วัดพระมหาธาตุ นครศรีฯ, วัดพระธาตุพนม นครพนม, วัดมหาธาตุ อยุธยา/สุโขทัย ฯลฯ) ใส่ ranked 20 รายการ (name+blurb+meta จังหวัด) + intro + h2 แบ่งภาค + tip การแต่งกาย/มารยาท + faq' },
  { slug:'nakhon-si-thammarat-food-guide', cluster:'nakhon-si-thammarat', type:'food',
    crumbCity:'นครศรีธรรมราช', crumbCityHref:'city-nakhon-si-thammarat.html',
    h1:'กินอะไรดีที่นครศรีธรรมราช? รวมร้านเด็ดและของกินห้ามพลาด', emoji:'🍜',
    brief:'พอร์ตจากโพสต์เก่า topten-restaurants-cafes-nakhonsithammarat — ไกด์ร้านอาหาร+คาเฟ่เมืองคอน. ref โครงสร้าง: บทความ type food ที่มี เช่น astro/src/content/articles/chiang-rai-food-guide.json. คัดร้าน/เมนูเด่นจริงของนครศรีฯ (ขนมจีนเมืองคอน, ข้าวยำ, แกงใต้, กาแฟโบราณ, คาเฟ่) ใส่ ranked ร้านเด่น + cards เมนูต้องลอง + tip + faq' },
];

phase('Articles')
const res = await parallel(ARTICLES.map(A => () =>
  agent(`เขียนบทความใหม่ (พอร์ต 1:1 สไตล์เรา) ลง astro/src/content/articles/${A.slug}.json ครบ ${SCHEMA}
${A.brief}
ค่าบังคับ: slug="${A.slug}" · type="${A.type}" · cluster="${A.cluster}" · crumbCity="${A.crumbCity}" · crumbCityHref="${A.crumbCityHref}" · h1="${A.h1}" · heroEmoji="${A.emoji}" · eyebrow สั้นๆ · metaDesc ≤160 ตัวอักษร · keywords (คอมมาคั่น) · intro 2-3 ประโยค · chips 4-6 อัน · faq 4-6 ข้อ · related 3 อัน (ลิงก์ .html ที่เกี่ยวข้องจริงในเว็บ)
เนื้อหา blocks: ผสม p/h2/ranked/tip/list ให้ยาวมีสาระ (อย่างน้อย ~12 blocks) · ข้อมูลจริง วิจัยเว็บ · ranked ใส่ครบตามจำนวนในหัวข้อ
รูป hero: หา URL รูปจริงที่เกี่ยวข้อง (Wikimedia Commons / Tripadvisor — ห้าม Trip.com/Agoda/stock มั่ว) → curl -m 60 -A "Mozilla/5.0" → astro/public/images/cm/${A.slug}.jpg → node _internal/optimize-images.mjs astro/public/images/cm/${A.slug}.jpg → set heroImg="/images/cm/${A.slug}.jpg" (หาไม่ได้ ใช้ heroEmoji อย่างเดียว ไม่ใส่ heroImg มั่ว)
${STYLE}
⚠️ JSON valid ตรง articleSchema เป๊ะ (โดยเฉพาะ blocks discriminated union) · มี keywords · คำต้องห้าม=0 · return: slug, จำนวน blocks, มี heroImg ไหม`,
    { label:`art:${A.slug}`, phase:'Articles' })
    .then(()=>({slug:A.slug, ok:true})).catch(e=>({slug:A.slug, ok:false, e:String(e)}))
))
return { articles: res }
