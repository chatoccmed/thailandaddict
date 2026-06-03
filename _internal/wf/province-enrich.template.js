export const meta = {
  name: 'province-enrich-77',
  description: 'Compile hub data (intro, highlights, food, attractions, itineraries) for all 77 Thai provinces — fresh v2-clean Thai, written to JSON files',
  phases: [{ title: 'Enrich', detail: 'one agent per province → _internal/province-data/<slug>.json' }],
}

const REGION = { n:'ภาคเหนือ', ne:'ภาคอีสาน', c:'ภาคกลาง', e:'ภาคตะวันออก', w:'ภาคตะวันตก', s:'ภาคใต้' }

const PROVINCES = [
  ['chiang-mai','เชียงใหม่','n'],['chiang-rai','เชียงราย','n'],['lamphun','ลำพูน','n'],['lampang','ลำปาง','n'],
  ['mae-hong-son','แม่ฮ่องสอน','n'],['phayao','พะเยา','n'],['phrae','แพร่','n'],['nan','น่าน','n'],['uttaradit','อุตรดิตถ์','n'],
  ['sukhothai','สุโขทัย','n'],['phitsanulok','พิษณุโลก','n'],['phetchabun','เพชรบูรณ์','n'],['tak','ตาก','n'],
  ['kamphaeng-phet','กำแพงเพชร','n'],['phichit','พิจิตร','n'],['nakhon-sawan','นครสวรรค์','n'],['uthai-thani','อุทัยธานี','n'],
  ['nakhon-ratchasima','นครราชสีมา','ne'],['buriram','บุรีรัมย์','ne'],['surin','สุรินทร์','ne'],['sisaket','ศรีสะเกษ','ne'],
  ['ubon-ratchathani','อุบลราชธานี','ne'],['yasothon','ยโสธร','ne'],['chaiyaphum','ชัยภูมิ','ne'],['amnat-charoen','อำนาจเจริญ','ne'],
  ['nong-bua-lamphu','หนองบัวลำภู','ne'],['khon-kaen','ขอนแก่น','ne'],['udon-thani','อุดรธานี','ne'],['loei','เลย','ne'],
  ['nong-khai','หนองคาย','ne'],['maha-sarakham','มหาสารคาม','ne'],['roi-et','ร้อยเอ็ด','ne'],['kalasin','กาฬสินธุ์','ne'],
  ['sakon-nakhon','สกลนคร','ne'],['nakhon-phanom','นครพนม','ne'],['mukdahan','มุกดาหาร','ne'],['bueng-kan','บึงกาฬ','ne'],
  ['bangkok','กรุงเทพมหานคร','c'],['nonthaburi','นนทบุรี','c'],['pathum-thani','ปทุมธานี','c'],['samut-prakan','สมุทรปราการ','c'],
  ['samut-sakhon','สมุทรสาคร','c'],['samut-songkhram','สมุทรสงคราม','c'],['nakhon-pathom','นครปฐม','c'],['ayutthaya','พระนครศรีอยุธยา','c'],
  ['ang-thong','อ่างทอง','c'],['lopburi','ลพบุรี','c'],['sing-buri','สิงห์บุรี','c'],['chai-nat','ชัยนาท','c'],
  ['saraburi','สระบุรี','c'],['suphan-buri','สุพรรณบุรี','c'],['nakhon-nayok','นครนายก','c'],
  ['chonburi','ชลบุรี','e'],['rayong','ระยอง','e'],['chanthaburi','จันทบุรี','e'],['trat','ตราด','e'],
  ['chachoengsao','ฉะเชิงเทรา','e'],['prachinburi','ปราจีนบุรี','e'],['sa-kaeo','สระแก้ว','e'],
  ['kanchanaburi','กาญจนบุรี','w'],['ratchaburi','ราชบุรี','w'],['phetchaburi','เพชรบุรี','w'],['prachuap-khiri-khan','ประจวบคีรีขันธ์','w'],
  ['chumphon','ชุมพร','s'],['ranong','ระนอง','s'],['surat-thani','สุราษฎร์ธานี','s'],['nakhon-si-thammarat','นครศรีธรรมราช','s'],
  ['krabi','กระบี่','s'],['phang-nga','พังงา','s'],['phuket','ภูเก็ต','s'],['phatthalung','พัทลุง','s'],
  ['trang','ตรัง','s'],['satun','สตูล','s'],['songkhla','สงขลา','s'],['pattani','ปัตตานี','s'],['yala','ยะลา','s'],['narathiwat','นราธิวาส','s'],
]

const SCHEMA = {
  type:'object', additionalProperties:false,
  required:['slug','th','tagline','introHtml','bestTime','highlights','foodScene','attractions','itineraryIdeas','neighbors','heroEmoji'],
  properties:{
    slug:{type:'string'}, th:{type:'string'},
    tagline:{type:'string', description:'วลีสั้น ๆ บอกคาแรกเตอร์จังหวัด'},
    introHtml:{type:'string', description:'เกริ่น 2-3 ประโยค โทน v2-clean'},
    bestTime:{type:'string', description:'ช่วงเวลาเที่ยวดีสุด สั้น ๆ'},
    highlights:{type:'array', minItems:5, maxItems:6, items:{type:'object', additionalProperties:false, required:['name','blurb'], properties:{name:{type:'string'}, blurb:{type:'string'}}}},
    foodScene:{type:'array', minItems:6, maxItems:8, items:{type:'object', additionalProperties:false, required:['name','note'], properties:{name:{type:'string'}, note:{type:'string'}}}},
    attractions:{type:'array', minItems:6, maxItems:8, items:{type:'object', additionalProperties:false, required:['name','kind','blurb'], properties:{name:{type:'string'}, kind:{type:'string', enum:['nature','city','culture']}, blurb:{type:'string'}}}},
    itineraryIdeas:{type:'array', minItems:4, maxItems:6, items:{type:'string'}},
    neighbors:{type:'array', minItems:2, maxItems:4, items:{type:'string'}, description:'slug จังหวัดข้างเคียง สำหรับแผนข้ามจังหวัด'},
    heroEmoji:{type:'string'},
  }
}

log(`Enriching ${PROVINCES.length} provinces…`)

const results = await parallel(PROVINCES.map(([slug, th, r]) => () =>
  agent(
`คุณเป็นบรรณาธิการเว็บท่องเที่ยวไทย thailandaddict.com เขียน "ข้อมูล hub" ของจังหวัด ${th} (${REGION[r]}) สำหรับหน้ารวมของจังหวัด

โทน v2-clean (บังคับ): เพื่อนเล่าให้เพื่อนฟัง อ่านลื่น · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำโฆษณา/AI เช่น ตอบโจทย์ โดดเด่น ครบครัน ระดับโลก สุดยอด อันซีน · เขียนจริงจากที่จังหวัดนี้มีจริง (สถานที่/อาหารที่มีอยู่จริง) ไม่แต่ง

ต้องสะท้อนคาแรกเตอร์จริงของ ${th}:
- highlights = จุด/ย่าน/ของเด่นที่คนนึกถึงเวลาพูดถึงจังหวัดนี้ (5-6)
- foodScene = ของกินเด่น/ประเภทอาหารที่นิยมในพื้นที่ (6-8) — รวมหมวดที่จังหวัดนี้เด่นจริง เช่น อาหารเหนือ/อีสาน/ทะเล/หมูกระทะ/คาเฟ่/มัทฉะ/สตรีทฟู้ด ตามบริบทจังหวัด
- attractions = ที่เที่ยวจริง (6-8) คละ nature/city/culture ตามที่จังหวัดมี
- itineraryIdeas = ชื่อแผนเที่ยว 4-6 แบบที่เหมาะกับจังหวัดนี้ (เช่น "${th} 2 วัน 1 คืน", "${th} สายคาเฟ่", "${th} สายธรรมชาติ", แผนข้ามจังหวัดกับจังหวัดข้างเคียง)
- neighbors = slug จังหวัดข้างเคียง 2-4 จังหวัด (อังกฤษ kebab เช่น chiang-rai)
- heroEmoji = อีโมจิ 1 ตัวสื่อจังหวัด

เขียนไฟล์ JSON เดียวด้วย Write tool ที่ path: C:\\Users\\Imac\\Thailandaddict\\_internal\\province-data\\${slug}.json
โดยมี field: slug="${slug}", th="${th}", tagline, introHtml, bestTime, highlights[], foodScene[], attractions[], itineraryIdeas[], neighbors[], heroEmoji — ตรงตาม schema เป๊ะ แล้ว return object เดียวกันนั้น`,
    { label:`enrich:${slug}`, phase:'Enrich', schema: SCHEMA }
  ).then(d => ({ slug, ok:!!d })).catch(() => ({ slug, ok:false }))
))

const done = results.filter(Boolean)
const okCount = done.filter(x=>x.ok).length
log(`Done: ${okCount}/${PROVINCES.length} provinces enriched`)
return { total: PROVINCES.length, ok: okCount, failed: done.filter(x=>!x.ok).map(x=>x.slug) }
