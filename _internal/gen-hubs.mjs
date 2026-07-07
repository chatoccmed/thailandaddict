// Generate region + province hub pages — self-contained chrome (wherebest-ported,
// Direction-C teal/coral + Fraunces + iOS Thai font + slogan). Province pages use a
// hero image + sticky 5-tab layout (ที่พัก/ที่เที่ยว/ที่กิน/แผนเที่ยว/เตรียมตัว) with real
// hotel-review cards and article cards. Matches astro/public/index.html.
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES, LOCALE_CODES, LOCALE_MAP, prefix, outSub } from './i18n/locales.mjs';

const ROOT = path.resolve(import.meta.dirname, '..'); // repo root (resolves wherever cloned)
const PUB = path.join(ROOT, 'astro/public');
const DATA = path.join(ROOT, '_internal/province-data');
const I18N = path.join(ROOT, '_internal/i18n');
// UI chrome dictionaries, keyed by the English string (the EN call-site arg is the lookup key).
// UI[loc]['English text'] -> 'localized text'. Missing key or missing file => graceful fallback to EN.
const rdJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; } };
const UI    = Object.fromEntries(LOCALE_CODES.map(c => [c, rdJson(path.join(I18N, `ui.${c}.json`))]));
// Localized place names: NAMES[loc][slug] -> localized city/province name (falls back to EN then slug).
const NAMES = Object.fromEntries(LOCALE_CODES.map(c => [c, rdJson(path.join(I18N, `names.${c}.json`))]));
const PVCOORDS = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/province-coords.json'), 'utf8')); } catch { return {}; } })();
// verified Wikidata QID + Wikipedia sameAs per province (sidecar from _internal/fetch-wikidata.mjs)
const WIKIDATA = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/province-wikidata.json'), 'utf8')); } catch { return {}; } })();

// GA4 scaffold for the 77 city/region hubs (Wave-0). Set GA_ID to the real "G-XXXXXXXXXX"
// (same value as astro/src/components/Analytics.astro) — emits nothing until configured.
const GA_ID = 'G-XXXXXXXXXX';
const GA_HEAD = (/^G-[A-Z0-9]{8,}$/.test(GA_ID) && !GA_ID.includes('XXXX'))
  ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});</script>`
  : '';

const REGION = {
  n:  { slug:'north',   th:'ภาคเหนือ',      en:'Northern Thailand',  emoji:'⛰️', intro:'ดอย หมอก เมืองเก่า คาเฟ่ และอาหารเหนือ — เสน่ห์ช้า ๆ ที่ชวนให้อยู่ยาว', intro_en:'Mountains, mist, old towns, cafés and northern food — a slow charm that makes you want to linger.' },
  ne: { slug:'isan',    th:'ภาคอีสาน',      en:'Isan (Northeast)',   emoji:'🌾', intro:'ที่ราบสูง วัฒนธรรมสนุก อาหารรสจัด และธรรมชาติริมโขงที่คนยังไปไม่ทั่ว', intro_en:'A high plateau with lively culture, bold flavours and Mekong-side nature still off the beaten path.' },
  c:  { slug:'central', th:'ภาคกลาง',       en:'Central Thailand',   emoji:'🏙️', intro:'กรุงเทพและเมืองรอบ ๆ ประวัติศาสตร์อยุธยา ตลาดน้ำ และที่พักติดรถไฟฟ้า', intro_en:'Bangkok and its surrounds — Ayutthaya history, floating markets and stays right by the BTS/MRT.' },
  e:  { slug:'east',    th:'ภาคตะวันออก',   en:'Eastern Thailand',   emoji:'🏝️', intro:'ทะเลตะวันออก เกาะช้าง เกาะเสม็ด ผลไม้ และเมืองริมทะเลใกล้กรุง', intro_en:'The eastern seaboard — Koh Chang, Koh Samet, fruit orchards and seaside towns close to Bangkok.' },
  w:  { slug:'west',    th:'ภาคตะวันตก',    en:'Western Thailand',   emoji:'🌅', intro:'หัวหิน ปราณบุรี กาญจน์ — น้ำตก ธรรมชาติ และทะเลที่ขับรถจากกรุงเทพไม่ไกล', intro_en:'Hua Hin, Pranburi and Kanchanaburi — waterfalls, nature and a coast within an easy drive of Bangkok.' },
  s:  { slug:'south',   th:'ภาคใต้',        en:'Southern Thailand',  emoji:'🌊', intro:'อันดามันและอ่าวไทย หาดทรายขาว เกาะสวย และอาหารใต้รสจัดจ้าน', intro_en:'The Andaman and the Gulf — white-sand beaches, beautiful islands and fiery southern food.' },
};
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
];
// Sub-destinations (islands / tourism towns) — get their own city-<slug>.html hub
// (same layout as provinces) but DO NOT count toward "77 จังหวัด" or appear in region
// province-lists. Each entry: [slug, thai-name, parent-region].
const DESTINATIONS = [
  ['koh-phangan','เกาะพะงัน','s'],['hat-yai','หาดใหญ่','s'],['samui','เกาะสมุย','s'],
  ['pai','ปาย','n'],['pattaya','พัทยา','e'],['huahin','หัวหิน','w'],['khao-yai','เขาใหญ่','ne'],
  ['koh-chang','เกาะช้าง','e'],['koh-lipe','เกาะหลีเป๊ะ','s'],['koh-kood','เกาะกูด','e'],
  ['koh-mak','เกาะหมาก','e'],['koh-larn','เกาะล้าน','e'],
];
// National prep/persona guides — shared by planHub + countryHub (de-orphan). [slug,emoji,th,en,thDesc,enDesc,(ctaTh),(ctaEn)]
const NAT_GUIDES = [
    ['thailand-visa-guide','🛂','วีซ่า & การเข้าเมือง','Visa & entry','ใครได้ยกเว้นวีซ่า อยู่ได้กี่วัน + บัตร TDAC','Who’s visa-free, how long + the TDAC card'],
    ['thailand-esim-internet','📶','ซิม & อินเทอร์เน็ต','eSIM & internet','eSIM กับซิมสนามบิน แบบไหนคุ้ม','eSIM vs airport SIM — which wins'],
    ['getting-around-thailand','🚌','การเดินทางในไทย','Getting around','เครื่องบิน รถไฟ เรือ BTS Grab มอเตอร์ไซค์','Flights, trains, ferries, BTS, Grab, bikes'],
    ['best-time-to-visit-thailand','🗓️','ช่วงเวลา & อากาศ','Best time & weather','อากาศรายเดือน + อ่าวไทย vs อันดามัน','Month-by-month + Gulf vs Andaman'],
    ['thailand-travel-budget','💰','งบเที่ยวต่อวัน','Daily budget','แบ็คแพ็ค กลาง หรู ใช้วันละเท่าไหร่','Backpacker, mid-range, luxury per day'],
    ['trip-budget','🧮','คำนวณงบทริป','Budget calculator','เลือกจำนวนวัน คน สไตล์ → งบต่อทริปทันที','Pick days, travelers & style → instant trip cost','คำนวณงบ →','Calculate →'],
    ['thailand-safety-scams','🛡️','ความปลอดภัย & สแกม','Safety & scams','กลโกงยอดฮิต + เบอร์ฉุกเฉิน','Common scams + emergency numbers'],
    ['thailand-money-atm-tipping','🏧','เงิน ATM & ทิป','Money, ATM & tipping','บัตร เงินสด ค่าธรรมเนียมตู้ ทิป','Cards, cash, ATM fees, tipping'],
    ['thailand-travel-insurance','🩺','ประกันเดินทาง','Travel insurance','ทำไมควรมี + ครอบคลุมมอเตอร์ไซค์','Why you need it + motorbike cover'],
    ['thailand-packing-list','🎒','ลิสต์ของที่ต้องเอาไป','Packing list','เข้าวัด ปลั๊กไฟ หน้าฝน ยา','Temple wear, plugs, rain, meds'],
    ['thai-phrases-for-travelers','🗣️','ประโยคภาษาไทยน่ารู้','Thai phrases','ทักทาย ขอบคุณ ตัวเลข สั่งอาหาร','Greetings, thanks, numbers, food'],
    ['thailand-etiquette-culture','🙏','มารยาท & วัฒนธรรม','Etiquette & culture','ไหว้ เข้าวัด หัว-เท้า สถาบัน','The wai, temples, head/feet, respect'],
    ['thailand-festival-calendar','🎉','เทศกาลไทยทั้งปี','Festival calendar','สงกรานต์ ลอยกระทง ยี่เป็ง กินเจ เดือนไหนมีงาน','Songkran, Loy Krathong, Yi Peng, vegetarian fest'],
    ['lgbtq-thailand-guide','🏳️‍🌈','เที่ยวไทยสำหรับ LGBTQ+','LGBTQ+ Thailand','เมืองที่เป็นมิตร งานไพรด์ สมรสเท่าเทียม','Friendly cities, Pride, marriage equality'],
    ['solo-female-travel-thailand','🎒','ผู้หญิงเที่ยวคนเดียว','Solo female travel','ปลอดภัยไหม เดินทาง ที่พัก สแกม','Safety, transport, stays, scams'],
    ['accessible-travel-thailand','♿','เที่ยวแบบเข้าถึงได้','Accessible travel','รถเข็น ผู้สูงอายุ ลิฟต์ วัด','Wheelchair, seniors, lifts, temples'],
    ['family-travel-thailand','👨‍👩‍👧‍👦','เที่ยวกับเด็ก & ครอบครัว','Family travel','ชายหาดปลอดภัย กิจกรรมเด็ก ที่พัก','Safe beaches, kids activities, stays'],
    ['vegan-vegetarian-thailand','🥬','วีแกน & มังสวิรัติ','Vegan & vegetarian','เจ vs มังสวิรัติ ประโยคสั่งอาหาร','Jay vs vegetarian, ordering phrases'],
    ['digital-nomad-thailand','💻','Digital Nomad','Digital nomad','วีซ่า DTV เมือง เน็ต ค่าครองชีพ','DTV visa, cities, wifi, cost'],
    ['health-medical-thailand','🏥','สุขภาพ & การแพทย์','Health & medical','โรงพยาบาล น้ำดื่ม ยุง ร้านยา วัคซีน','Hospitals, water, mosquitoes, pharmacies'],
    ['halal-travel-thailand','🕌','เที่ยวสายฮาลาล','Halal travel','อาหารฮาลาล มัสยิด ห้องละหมาด','Halal food, mosques, prayer rooms'],
    ['senior-travel-thailand','🧓','เที่ยววัยเก๋า','Senior travel','จุดหมายสบาย จังหวะไม่เร่ง สุขภาพ','Easy destinations, relaxed pace, health'],
    ['thailand-cooking-classes','🍳','เรียนทำอาหารไทย','Cooking classes','คลาสที่ไหนดี ราคา จองยังไง','Where, prices & how to book','ดูคลาส →','See classes →'],
    ['thailand-diving','🤿','ดำน้ำในไทย','Diving & scuba','เรียน-เที่ยวที่ไหนดี ฤดูกาล ราคา','Where to learn + dive, seasons, cost','ดูคอร์ส →','See courses →'],
    ['thailand-elephant-sanctuary','🐘','ปางช้างเชิงอนุรักษ์','Elephant sanctuaries','ไม่ขี่ช้าง ที่ไหนดี ราคา','No-riding sanctuaries, where & prices','ดูปาง →','See sanctuaries →'],
    ['thailand-island-hopping','🏝️','เที่ยวเกาะ Island Hopping','Island hopping','พีพี เจมส์บอนด์ ทัวร์ไหนดี','Phi Phi, James Bond — best tours','ดูทัวร์ →','See tours →'],
    ['muay-thai-thailand','🥊','ดู & เรียนมวยไทย','Muay Thai','สนามไหนดี ตั๋ว เรียนที่ไหน','Stadiums, tickets & training','ดูตั๋ว →','See tickets →'],
    ['bangkok-temples-grand-palace','🛕','วัด & พระบรมมหาราชวัง','Temples & Grand Palace','ทัวร์ ตั๋ว ค่าเข้า การแต่งกาย','Tours, tickets, dress code','ดูทัวร์ →','See tours →'],
    ['thailand-floating-markets','🛶','ตลาดน้ำใกล้กรุงเทพ','Floating markets','ดำเนินสะดวก อัมพวา แม่กลอง','Damnoen, Amphawa, Maeklong','ดูทัวร์ →','See tours →'],
    ['bangkok-dinner-cruise','🛳️','ล่องเรือดินเนอร์เจ้าพระยา','Dinner cruise','เรือไหนดี ราคา ท่าขึ้นเรือ','Best boats, price, piers','ดูเรือ →','See cruises →'],
    ['thailand-thai-massage-spa','💆','นวดไทย & สปา','Thai massage & spa','นวดแบบไหนดี ราคา ร้านแนะนำ','Types, prices, top spas','ดูสปา →','See spas →'],
    ['thailand-zipline-adventure','🌿','ซิปไลน์ & ผจญภัย','Zipline adventure','เชียงใหม่ที่ไหนดี ปลอดภัยไหม','Chiang Mai — where & safety','ดูที่เล่น →','See parks →'],
    ['bangkok-attractions-tickets','🎢','ที่เที่ยวกรุงเทพ ตั๋วล่วงหน้า','Bangkok attractions','SEA LIFE, Safari World, จุดชมวิว','SEA LIFE, Safari World, views','ดูตั๋ว →','See tickets →'],
    ['bangkok-food-tour','🍢','ฟู้ดทัวร์กรุงเทพ','Bangkok food tour','ทัวร์กินตุ๊กตุ๊กเยาวราช','Tuk-tuk street-food tours','ดูทัวร์ →','See tours →'],
    ['pattaya-attractions-tickets','🏛️','ที่เที่ยวพัทยา ตั๋วล่วงหน้า','Pattaya attractions','ปราสาทสัจธรรม นงนุช เกาะล้าน','Sanctuary, Nong Nooch, Koh Larn','ดูตั๋ว →','See tickets →'],
    ['phuket-attractions-tickets','🏖️','ที่เที่ยวภูเก็ต ตั๋ว/ทัวร์','Phuket attractions','พระใหญ่ เมืองเก่า ทัวร์เกาะ โชว์','Big Buddha, islands, shows','ดูตั๋ว →','See tickets →'],
    ['chiang-mai-attractions-tickets','⛰️','ที่เที่ยวเชียงใหม่ ตั๋ว/ทัวร์','Chiang Mai attractions','ดอยสุเทพ ดอยอินทนนท์ เชียงราย','Doi Suthep, Inthanon, Chiang Rai','ดูทัวร์ →','See tours →'],
    ['krabi-attractions-tickets','🧗','ที่เที่ยวกระบี่ ตั๋ว/ทัวร์','Krabi attractions','4 เกาะ ไร่เลย์ สระมรกต','4 Islands, Railay, Emerald Pool','ดูทัวร์ →','See tours →'],
    ['koh-samui-attractions-tickets','🏝️','ที่เที่ยวเกาะสมุย ตั๋ว/ทัวร์','Koh Samui attractions','อ่างทอง เกาะเต๋า พระใหญ่','Ang Thong, Koh Tao, Big Buddha','ดูทัวร์ →','See tours →'],
];
const TH = Object.fromEntries([...PROVINCES, ...DESTINATIONS].map(([s,th])=>[s,th]));
// curated "เมืองท่องเที่ยว" — top tourism cities (cross-cut, may repeat across regions e.g. ภูเก็ต).
// Cards auto-fill hero images as each province's content lands (gen-hubs re-runs per finalize).
const TOPDEST = ['bangkok','chiang-mai','phuket','krabi','chiang-rai','chonburi','surat-thani','prachuap-khiri-khan','kanchanaburi','ayutthaya','rayong','trat','phang-nga','nan','mae-hong-son','sukhothai','nakhon-ratchasima','phetchabun'];

// ── i18n: English city names + locale helpers ──
const EN_NAME = {
  'amnat-charoen':'Amnat Charoen','ang-thong':'Ang Thong','ayutthaya':'Ayutthaya','bangkok':'Bangkok','bueng-kan':'Bueng Kan','buriram':'Buriram','chachoengsao':'Chachoengsao','chai-nat':'Chai Nat','chaiyaphum':'Chaiyaphum','chanthaburi':'Chanthaburi','chiang-mai':'Chiang Mai','chiang-rai':'Chiang Rai','chonburi':'Chonburi','chumphon':'Chumphon','hat-yai':'Hat Yai','huahin':'Hua Hin','kalasin':'Kalasin','kamphaeng-phet':'Kamphaeng Phet','kanchanaburi':'Kanchanaburi','khao-yai':'Khao Yai','khon-kaen':'Khon Kaen','koh-chang':'Koh Chang','koh-kood':'Koh Kood','koh-larn':'Koh Larn','koh-lipe':'Koh Lipe','koh-mak':'Koh Mak','koh-phangan':'Koh Phangan','krabi':'Krabi','lampang':'Lampang','lamphun':'Lamphun','loei':'Loei','lopburi':'Lopburi','mae-hong-son':'Mae Hong Son','maha-sarakham':'Maha Sarakham','mukdahan':'Mukdahan','nakhon-nayok':'Nakhon Nayok','nakhon-pathom':'Nakhon Pathom','nakhon-phanom':'Nakhon Phanom','nakhon-ratchasima':'Nakhon Ratchasima','nakhon-sawan':'Nakhon Sawan','nakhon-si-thammarat':'Nakhon Si Thammarat','nan':'Nan','narathiwat':'Narathiwat','nong-bua-lamphu':'Nong Bua Lamphu','nong-khai':'Nong Khai','nonthaburi':'Nonthaburi','pai':'Pai','pathum-thani':'Pathum Thani','pattani':'Pattani','pattaya':'Pattaya','phang-nga':'Phang Nga','phatthalung':'Phatthalung','phayao':'Phayao','phetchabun':'Phetchabun','phetchaburi':'Phetchaburi','phichit':'Phichit','phitsanulok':'Phitsanulok','phrae':'Phrae','phuket':'Phuket','prachinburi':'Prachinburi','prachuap-khiri-khan':'Prachuap Khiri Khan','ranong':'Ranong','ratchaburi':'Ratchaburi','rayong':'Rayong','roi-et':'Roi Et','sa-kaeo':'Sa Kaeo','sakon-nakhon':'Sakon Nakhon','samui':'Koh Samui','samut-prakan':'Samut Prakan','samut-sakhon':'Samut Sakhon','samut-songkhram':'Samut Songkhram','saraburi':'Saraburi','satun':'Satun','sing-buri':'Sing Buri','sisaket':'Sisaket','songkhla':'Songkhla','sukhothai':'Sukhothai','suphan-buri':'Suphan Buri','surat-thani':'Surat Thani','surin':'Surin','tak':'Tak','trang':'Trang','trat':'Trat','ubon-ratchathani':'Ubon Ratchathani','udon-thani':'Udon Thani','uthai-thani':'Uthai Thani','uttaradit':'Uttaradit','yala':'Yala','yasothon':'Yasothon',
};
let LOC = 'th';                                  // current locale being generated
const enTitle = slug => slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
// Pick a UI string. th/en are inline (source); other locales look up the EN string as key,
// falling back to EN when a translation is missing so no page breaks.
const tx = (th, en) => {
  if (LOC === 'th') return th;
  if (LOC === 'en') return en;
  const d = UI[LOC];
  return (d && d[en] != null) ? d[en] : en;
};
// Interpolated UI string. `enTpl` carries {tokens} and IS the dictionary key (stable across the
// varying city/region name), so translators localize the template once. th = pre-built Thai string.
const txf = (th, enTpl, vars = {}) => {
  if (LOC === 'th') return th;
  const d = UI[LOC];
  const s = (LOC !== 'en' && d && d[enTpl] != null) ? d[enTpl] : enTpl;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] != null ? vars[k] : '');
};
// Localized place name: th=Thai map, en=EN map, other=names.<loc>.json (fallback EN → titlecased slug).
const NAME = slug => {
  if (LOC === 'th') return TH[slug] || slug;
  const en = EN_NAME[slug] || enTitle(slug);
  if (LOC === 'en') return en;
  const d = NAMES[LOC];
  return (d && d[slug]) || en;
};
// Region name/intro flow through the UI dictionary (EN string = key) so all locales resolve.
const RNAME = r => tx(REGION[r].th, REGION[r].en);
const RINTRO = r => tx(REGION[r].intro, REGION[r].intro_en);
const PFX = (loc = LOC) => prefix(loc);          // home href for a locale ('/' for th, '/<loc>/' else)

const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// Hub content images (cm/ + hotels/) are served from R2 — same bucket the layouts use — because those dirs are
// excluded from the Cloudflare static bundle (.assetsignore) to stay under the 20k-file limit. heroes/ + cities/
// stay in the bundle, so heroSrc / neighbor cards keep plain /images/ paths. Override via PUBLIC_IMG_BASE env.
const IMG_BASE = process.env.PUBLIC_IMG_BASE || 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev';
const imgUrl = s => !s ? '' : (/^https?:/.test(s) ? s : IMG_BASE + (s.startsWith('/') ? s : '/'+s));
const stripTags = s => String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
// real hero photo for a guide/route card (from its article's heroImg, locale-aware) — '' if none.
function guideImg(slug){
  if(slug==='trip-budget') return imgUrl('/images/heroes/bangkok.jpg'); // tool page (no article) — give the card a real photo
  const idx=IDX[LOC]&&IDX[LOC].ARTS; if(!idx) return '';
  for(const cl in idx){ const a=idx[cl].find(x=>x.slug===slug); if(a&&a.heroImg) return a.heroImg; }
  return '';
}

// ── content indexes ──
const ROUNDDIR = path.join(ROOT,'astro/src/content/roundups');
const hasRoundup = slug => fs.existsSync(path.join(ROUNDDIR, `top10-hotels-${slug}.json`));
// Build {ARTS,REVS} indexes for a locale (th = root collections, en = -en collections).
function buildIndex(loc){
  const suf = loc==='en' ? '-en' : '';
  const ARTDIR = path.join(ROOT,'astro/src/content/articles'+suf);
  const REVDIR = path.join(ROOT,'astro/src/content/reviews'+suf);
  const ARTS={}, REVS={};
  if(fs.existsSync(ARTDIR)) for(const f of fs.readdirSync(ARTDIR).filter(x=>x.endsWith('.json'))){
    try{ const a=JSON.parse(fs.readFileSync(path.join(ARTDIR,f),'utf8'));
      const _blurb=String(a.intro||a.metaDesc||'').replace(/<[^>]+>/g,'').trim();
      const _nItems=Array.isArray(a.blocks)?a.blocks.filter(b=>b&&b.kind==='restaurant').length:0;
      (ARTS[a.cluster] ||= []).push({slug:a.slug,type:a.type,title:(a.h1||a.title||a.slug),heroImg:imgUrl(a.heroImg||''),eyebrow:a.eyebrow||'',blurb:_blurb.length>140?_blurb.slice(0,138)+'…':_blurb,readTime:a.readTime||'',nItems:_nItems,heroEmoji:a.heroEmoji||'🎟️'}); }catch{}
  }
  if(fs.existsSync(REVDIR)) for(const f of fs.readdirSync(REVDIR).filter(x=>x.endsWith('.json'))){
    try{ const r=JSON.parse(fs.readFileSync(path.join(REVDIR,f),'utf8')); const c=r.cluster||(f.match(/-([a-z-]+)\.json$/)||[])[1]||''; if(!c)continue;
      (REVS[c] ||= []).push({slug:r.slug,name:r.name||r.slug,score:+(r.score||0),star:+(r.starRating||0),type:r.typeFull||r.type||'',price:r.priceRange||r.qiPrice||'',loc:r.hiLoc||r.badgeLoc||r.qiCol5Value||r.addressLocality||'',img:imgUrl(r.heroImg||r.image||''),agoda:r.bookingAgoda||'',booking:r.bookingBooking||'',trip:r.bookingTrip||''}); }catch{}
  }
  return {ARTS,REVS};
}
const IDX = { th: buildIndex('th'), en: buildIndex('en') };
// LOC-aware accessors (used throughout builders)
const ARTS = new Proxy({}, { get:(_,k)=> IDX[LOC].ARTS[k] });
const REVS = new Proxy({}, { get:(_,k)=> IDX[LOC].REVS[k] });
// roundups collection (hotel Top-N) → indexed by province slug via slug suffix match, locale-aware.
// Used to surface "ranked" articles first in the city-hub stay tab. label = clean short title from h1.
const PSLUGS = Object.keys(TH);
function buildRnd(loc){
  const dir = path.join(ROOT,'astro/src/content/roundups'+(loc==='en'?'-en':''));
  const out = {};
  if(fs.existsSync(dir)) for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.json'))){
    try{
      const a=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
      const base=a.slug||f.replace('.json','');
      const hit=PSLUGS.filter(s=>base.endsWith('-'+s)).sort((x,y)=>y.length-x.length)[0];
      if(!hit) continue;
      let t=stripTags(String(a.h1||a.title||base)).replace(/\s+/g,' ').trim();
      let label = t.includes('?') ? t.split('?')[0]+'?' : t.replace(/\s*[|—].*/,'').trim();
      if(label.length>64) label=label.slice(0,62)+'…';
      (out[hit] ||= []).push({slug:base,label,heroImg:imgUrl(a.heroImg||a.image||'')});
    }catch{}
  }
  return out;
}
const RNDIDX = { th: buildRnd('th'), en: buildRnd('en') };
const RNDS = new Proxy({}, { get:(_,k)=> RNDIDX[LOC][k] });
// Phase-1 "hotels near <anchor>" overlays (medical/MICE/airport). Locale-agnostic source records (carry TH+EN
// fields) — used by nearGuides() on the city hub and the per-ย่าน cross-link in hoodHub(). Articles themselves
// are generated by _internal/gen-overlay.mjs and already live in ARTS (type:prep, cluster:bangkok).
const goB=(u,sid)=>u&&String(u).includes('booking.com')?`/go/b?u=${encodeURIComponent(u)}&sid=${sid}`:u;
const OVERLAYDIR = path.join(ROOT, '_internal/overlay-data');
const OVERLAYS = (fs.existsSync(OVERLAYDIR) ? fs.readdirSync(OVERLAYDIR).filter(f=>f.endsWith('.json')&&!f.startsWith('_')) : [])
  .map(f=>{ try{ return JSON.parse(fs.readFileSync(path.join(OVERLAYDIR,f),'utf8')); }catch{ return null; } }).filter(Boolean);
const GROUP_EMOJI = { medical:'🏥', mice:'🎪', airport:'✈️' };

// ── shared CSS (design system, matches index.html) ──
const CSS = `<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Noto Sans Thai','Sarabun',sans-serif;background:#f6fafb;color:#0F172A;-webkit-font-smoothing:antialiased;line-height:1.6;overflow-x:hidden;background-image:radial-gradient(circle at 10% 6%,rgba(6,182,212,.1),transparent 40%),radial-gradient(circle at 92% 3%,rgba(251,113,133,.1),transparent 38%)}
:root{--bl:#06B6D4;--bl-dk:#0891b2;--bl-lt:#ecfeff;--or:#FB7185;--or-dk:#f43f5e;--or-lt:#fff1f3;--go:#FBBF24;--ink:#0F172A;--sub:#64748b;--mut:#9aa7b8;--bdr:#e6eef2;--r:20px;--r2:13px;--sh:0 6px 22px rgba(15,40,70,.07);--sh2:0 14px 44px rgba(15,40,70,.15)}
a{text-decoration:none;color:inherit}img{display:block;max-width:100%;object-fit:cover}button{cursor:pointer;font-family:inherit}
.inner{max-width:1120px;margin:0 auto}
/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:999;height:66px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:rgba(255,255,255,.96);backdrop-filter:blur(16px);box-shadow:0 1px 0 var(--bdr)}
@media(max-width:560px){.nav{padding:0 18px}}
.logo{font-family:'Fraunces',serif;font-size:25px;font-weight:500;color:var(--ink);letter-spacing:-.5px}.logo em{font-style:normal;font-weight:400;color:var(--bl)}
.nav-mid{display:flex;gap:26px}@media(max-width:860px){.nav-mid{display:none}}
.nav-mid a{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:13.5px;font-weight:600;color:var(--sub)}.nav-mid a:hover{color:var(--bl)}
.nav-mid .has-drop{position:relative}.nav-mid .has-drop>a::after{content:' ▾';font-size:9px;opacity:.55}
.nav-mid .drop{position:absolute;top:calc(100% + 8px);left:-14px;min-width:240px;background:#fff;border:1px solid var(--bdr);border-radius:14px;padding:12px;box-shadow:0 16px 40px rgba(15,40,70,.18);opacity:0;visibility:hidden;transform:translateY(-4px);transition:.18s;z-index:1200}
.nav-mid .has-drop:hover .drop{opacity:1;visibility:visible;transform:translateY(0)}
.nav-mid .drop a{display:block;font-size:13.5px;color:var(--ink);padding:9px 12px;border-radius:8px;font-weight:500}.nav-mid .drop a:hover{background:var(--bl-lt);color:var(--bl-dk)}
.nav-mid .drop .h{display:block;font-family:'Outfit',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--mut);padding:8px 12px 3px}
.nav-r{display:flex;align-items:center;gap:10px}
.search-box{position:relative}@media(max-width:760px){.search-box{display:none}}
.search-input{font-family:inherit;font-size:13.5px;width:200px;padding:9px 14px 9px 34px;border-radius:30px;border:1px solid var(--bdr);background:#fff;color:var(--ink);outline:none;transition:.2s}
.search-input:focus{width:260px;border-color:var(--bl)}
.search-box::before{content:'🔍';position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:12px;opacity:.7}
.search-drop{position:absolute;top:calc(100% + 8px);right:0;width:320px;max-height:380px;overflow-y:auto;background:#fff;border:1px solid var(--bdr);border-radius:14px;box-shadow:0 16px 40px rgba(15,40,70,.18);z-index:1300;display:none}
.search-drop.show{display:block}.search-drop a{display:block;padding:11px 14px;border-bottom:1px solid var(--bdr)}.search-drop a:hover{background:var(--bl-lt)}
.search-drop .t{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:14px;font-weight:600}.search-drop .c{font-size:11.5px;color:var(--mut)}.search-drop .empty{padding:18px;text-align:center;color:var(--mut);font-size:13px}
.lang-wrap{display:flex;gap:1px}.lb{background:transparent;border:none;font-family:'Outfit',sans-serif;font-size:11px;font-weight:600;color:var(--mut);padding:5px 8px;border-radius:6px}.lb.active{color:var(--bl);background:var(--bl-lt)}
.nav-cta{background:linear-gradient(135deg,var(--or),var(--go));color:#fff;border:none;font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;padding:10px 20px;border-radius:30px;box-shadow:0 6px 18px rgba(251,113,133,.5)}@media(max-width:860px){.nav-cta{display:none}}
.hb{display:none;background:none;border:none;color:var(--ink);font-size:24px}@media(max-width:860px){.hb{display:block}}
.mm{position:fixed;inset:0;z-index:1000;background:#fff;transform:translateX(100%);transition:transform .3s;display:flex;flex-direction:column;padding:24px;overflow-y:auto}.mm.open{transform:translateX(0)}
.mm-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.mm-x{background:none;border:none;font-size:28px;color:var(--ink)}
.mm a{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:18px;font-weight:600;padding:14px 0;border-bottom:1px solid var(--bdr)}
.mm-cta{margin-top:22px;background:linear-gradient(135deg,var(--or),var(--go));color:#fff;border:none;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;padding:15px;border-radius:30px}
/* breadcrumb */
.crumb{max-width:1120px;margin:0 auto;padding:84px 28px 0;font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12.5px;color:var(--sub)}
.crumb a:hover{color:var(--bl)}
/* PROVINCE HERO */
.phero{position:relative;max-width:1120px;margin:14px auto 0;border-radius:28px;overflow:hidden;min-height:360px;display:flex;align-items:flex-end;box-shadow:0 22px 52px rgba(15,40,70,.22);background:linear-gradient(135deg,#0891b2,#22d3ee 50%,#FB7185)}
.phero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.phero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,30,55,.34) 28%,rgba(8,30,55,.7) 100%),linear-gradient(125deg,rgba(6,182,212,.36),rgba(251,113,133,.3) 60%,rgba(251,191,36,.24));z-index:1}
.pherobody{position:relative;z-index:2;padding:38px 40px;color:#fff;width:100%}@media(max-width:600px){.pherobody{padding:24px}.phero{min-height:300px}}
.pheye{display:inline-flex;align-items:center;gap:8px;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:12px;letter-spacing:.5px;background:rgba(255,255,255,.2);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.3);padding:6px 15px;border-radius:30px}
.phero h1{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:clamp(34px,6vw,56px);line-height:1.05;letter-spacing:-1px;margin-top:14px;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.phero h1 em{font-style:normal;color:#FFE15D}
.phlead{max-width:640px;font-size:15.5px;color:rgba(255,255,255,.95);margin-top:10px;text-shadow:0 1px 10px rgba(0,0,0,.3)}
.phchips{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.phchip{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:12.5px;color:#fff;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.28);padding:8px 15px;border-radius:30px}
/* STICKY TABS */
.tabwrap{position:sticky;top:64px;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--bdr);margin-top:20px}
.tabbar{max-width:1120px;margin:0 auto;display:flex;gap:7px;padding:11px 28px;overflow-x:auto;scrollbar-width:none}.tabbar::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:14px;color:var(--sub);padding:11px 19px;border-radius:30px;cursor:pointer;border:2px solid transparent;white-space:nowrap;display:flex;align-items:center;gap:8px;transition:.2s;user-select:none}
.tab:hover{color:var(--bl-dk);background:var(--bl-lt)}
.tab.active{color:#fff;background:linear-gradient(135deg,var(--bl),var(--or));box-shadow:0 8px 18px rgba(6,182,212,.32)}
.tab .tc{font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;background:rgba(15,23,42,.08);color:var(--sub);padding:1px 8px;border-radius:30px}.tab.active .tc{background:rgba(255,255,255,.3);color:#fff}
.panel{display:none}.panel.active{display:block;animation:pf .35s ease}@keyframes pf{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.cwrap{max-width:1120px;margin:0 auto;padding:30px 28px 14px}
.pintro{font-size:15px;color:var(--sub);max-width:760px;margin:4px 0 22px}
.pnhead{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-size:26px;font-weight:500;letter-spacing:-.3px;margin:30px 0 6px}.pnhead:first-child{margin-top:4px}
.pnhead em{font-style:normal;background:linear-gradient(120deg,var(--bl) 10%,var(--or-dk) 95%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
/* CALLOUT */
.callout{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;background:linear-gradient(120deg,#ecfeff,#fff5f7);border:2px solid #cffafe;border-radius:24px;padding:24px 28px;margin-bottom:26px}
.callout h3{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:22px}.callout p{font-size:13.5px;color:var(--sub);margin-top:3px}
.callout a{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:13.5px;background:linear-gradient(135deg,var(--or),var(--go));color:#fff;padding:13px 24px;border-radius:30px;box-shadow:0 10px 22px rgba(251,113,133,.32);white-space:nowrap}
/* HOTEL CARDS */
.hgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}@media(max-width:900px){.hgrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.hgrid{grid-template-columns:1fr}}
.hcard{background:#fff;border:1px solid rgba(6,182,212,.08);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);transition:.22s;display:flex;flex-direction:column}
.hcard:hover{transform:translateY(-6px);box-shadow:0 24px 54px rgba(251,113,133,.32)}
.hc-img{position:relative;height:180px;overflow:hidden;background:linear-gradient(135deg,#0891b2,#22d3ee 55%,#FB7185)}
.hc-img img{width:100%;height:100%;transition:transform .55s}.hcard:hover .hc-img img{transform:scale(1.07)}
.hc-score{position:absolute;top:12px;left:12px;background:linear-gradient(135deg,var(--go),#f59e0b);color:#fff;font-family:'Outfit',sans-serif;font-size:14px;font-weight:800;padding:5px 11px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.hc-body{padding:15px 18px 18px;display:flex;flex-direction:column;flex:1}
.hc-name{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:18px;line-height:1.2}
.hc-stars{color:var(--go);font-size:12px;letter-spacing:1px;margin:5px 0 2px}
.hc-type{font-size:12.5px;color:var(--sub)}.hc-loc{font-size:12px;color:var(--sub);margin-top:6px}
.hc-price{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:13px;color:var(--sub);margin:10px 0 12px}.hc-price b{color:var(--or-dk);font-size:16px;font-weight:800}
.hview{display:block;text-align:center;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:12.5px;color:var(--bl-dk);background:var(--bl-lt);padding:10px;border-radius:12px;margin-top:auto}.hview:hover{background:#cffafe}
.hbtns{display:flex;gap:7px;margin-top:8px}.hbtn{flex:1;text-align:center;font-family:'Outfit',sans-serif;font-weight:800;font-size:12px;padding:9px 4px;border-radius:11px;color:#fff}
.bk1{background:linear-gradient(135deg,var(--or),var(--or-dk))}.bk2{background:var(--bl)}.bk3{background:var(--ink)}
/* ARTICLE CARDS */
.dgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}@media(max-width:760px){.dgrid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.dgrid{grid-template-columns:1fr}}
.dcard{background:#fff;border:1px solid rgba(6,182,212,.08);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);transition:.22s;display:block}
.dcard:hover{transform:translateY(-6px);box-shadow:0 22px 48px rgba(6,182,212,.28)}
.dphoto{height:160px;position:relative;background:linear-gradient(150deg,#06B6D4,#22d3ee 55%,#FBBF24)}.dphoto>img{position:absolute;inset:0;width:100%;height:100%;transition:transform .5s}.dcard:hover .dphoto>img{transform:scale(1.07)}
/* neighbourhood photo-cards (reference-style: emoji + name + descriptor overlaid on the photo) */
.hccg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:8px}
@media(max-width:880px){.hccg{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.hccg{grid-template-columns:1fr}}
.hcc{position:relative;display:block;border-radius:18px;overflow:hidden;aspect-ratio:4/3;background:linear-gradient(150deg,#0891b2,#22d3ee 55%,#FB7185);box-shadow:0 6px 20px rgba(8,40,60,.10)}
.hcc>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .55s}
.hcc:hover>img{transform:scale(1.08)}
.hcc::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(4,20,30,.82),rgba(4,20,30,.12) 54%,rgba(4,20,30,0))}
.hcc-cap{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:13px 14px;color:#fff}
.hcc-e{font-size:18px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}
.hcc-cap b{display:block;margin-top:5px;font-size:16px;font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.hcc-cap i{display:block;margin-top:3px;font-size:12px;font-style:normal;font-weight:600;opacity:.93;text-shadow:0 1px 2px rgba(0,0,0,.45)}
.hccmore{margin-top:16px}
.hccmore>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:#0891b2;background:#ecfeff;border:1.5px solid #a5f0fb;border-radius:999px;padding:10px 22px;transition:background .2s}
.hccmore>summary::-webkit-details-marker{display:none}
.hccmore>summary:hover{background:#d6f7fd}
.hccmore[open]>summary{margin-bottom:16px}
/* per-area neighbourhood hub: quick-answer box + compact hotel list */
.quickbox{background:#f1fbfd;border:1px solid #cdeef5;border-left:4px solid #06B6D4;border-radius:14px;padding:14px 18px;font-size:15px;line-height:1.6;color:#0f172a;margin-top:6px}
.quickbox b{color:#0891b2}
.hl-list{display:flex;flex-direction:column;gap:14px;margin-top:18px}
.hl-row{display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid #e6eef2;border-radius:16px;padding:16px 18px;box-shadow:0 4px 14px rgba(8,40,60,.05)}
.hl-rank{flex:none;width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#0891b2,#22d3ee);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:15px}
.hl-main{flex:1;min-width:0}
.hl-top{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.hl-top h3{font-size:17px;font-weight:800;color:#0f172a}
.hl-star{color:#f59e0b;font-size:13px;letter-spacing:1px}
.hl-bf{font-size:12.5px;font-weight:700;color:#0891b2;margin-top:2px}
.hl-main>p{font-size:14px;line-height:1.55;color:#475569;margin-top:5px}
.hl-side{flex:none;text-align:right;display:flex;flex-direction:column;gap:7px;align-items:flex-end}
.hl-price{font-weight:800;color:#0f172a;font-size:16px;white-space:nowrap}.hl-price small{display:block;font-size:11px;color:#94a3b8;font-weight:600}
.hl-book{background:linear-gradient(135deg,#FB7185,#f43f5e);color:#fff;font-weight:800;font-size:12.5px;padding:8px 13px;border-radius:10px;white-space:nowrap}
@media(max-width:560px){.hl-row{flex-wrap:wrap}.hl-side{flex-direction:row;width:100%;justify-content:space-between;align-items:center;text-align:left;margin-top:4px}.hl-price small{display:inline}}
.dbody{padding:15px 17px 17px}.dbody h3{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:17px;line-height:1.3}.dbody .go{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12.5px;font-weight:800;color:var(--bl);margin-top:10px;display:inline-block}.dcard:hover .dbody .go{color:var(--or-dk)}
/* HIGHLIGHT / FOOD / INFO / NEIGHBOR */
.hl{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:8px}@media(max-width:760px){.hl{grid-template-columns:1fr}}
.hlc{position:relative;background:#fff;border:1px solid var(--bdr);border-radius:18px;padding:20px 20px 20px 24px;box-shadow:var(--sh);overflow:hidden;transition:transform .15s,box-shadow .2s}
.hlc:hover{transform:translateY(-3px);box-shadow:0 16px 34px rgba(8,145,178,.15)}
.hlc::before{content:'';position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(180deg,#06b6d4,#0891b2)}
.hlc:nth-child(3n+2)::before{background:linear-gradient(180deg,#FB7185,#f43f5e)}
.hlc:nth-child(3n)::before{background:linear-gradient(180deg,#FBBF24,#f59e0b)}
.hlc h3{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:16.5px;color:var(--ink);margin-bottom:6px}.hlc p{font-size:13.5px;line-height:1.65;color:#475569}
.foodgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:8px}@media(max-width:760px){.foodgrid{grid-template-columns:1fr 1fr}}
.fc{background:#fff;border:1px solid var(--bdr);border-radius:16px;padding:16px;box-shadow:var(--sh)}.fc h4{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:14px}.fc p{font-size:12.5px;color:var(--sub);margin-top:3px}
.eeat{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}@media(max-width:760px){.eeat{grid-template-columns:1fr 1fr}}
.ecard{background:#fff;border:1px solid var(--bdr);border-radius:var(--r);padding:22px 20px;box-shadow:var(--sh);transition:.2s}.ecard:hover{transform:translateY(-4px);box-shadow:0 20px 44px rgba(6,182,212,.2)}.ecard .ic{font-size:28px;margin-bottom:10px}.ecard h3{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:15px;margin-bottom:6px}.ecard p{font-size:13px;color:var(--sub)}
.ncards{display:flex;gap:12px;flex-wrap:wrap}.nc{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:13.5px;background:#fff;border:1px solid var(--bdr);border-radius:30px;padding:10px 18px}.nc:hover{border-color:var(--bl);color:var(--bl-dk)}
/* CTA BAND */
.cta-sec{padding:10px 28px 56px}
.ctaband{max-width:1120px;margin:0 auto;background:linear-gradient(135deg,#06B6D4 0%,#0aa2c0 32%,#f15a86 78%,#FB7185 100%);border-radius:26px;padding:46px;text-align:center;color:#fff;position:relative;overflow:hidden;box-shadow:0 22px 48px rgba(6,182,212,.3)}
.ctaband::after{content:'';position:absolute;top:-70px;right:-50px;width:240px;height:240px;background:radial-gradient(circle,rgba(251,191,36,.4),transparent 65%)}
.ctaband h2{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:30px;position:relative}.ctaband p{color:rgba(255,255,255,.92);margin:8px 0 22px;position:relative}
.ctaband a{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:14px;background:#fff;color:var(--bl-dk);padding:14px 30px;border-radius:30px;display:inline-block;position:relative;box-shadow:0 10px 24px rgba(8,30,55,.2)}
/* TEXT HERO (region/country) */
.thero{position:relative;overflow:hidden;background:linear-gradient(135deg,#06B6D4 0%,#0aa2c0 34%,#f15a86 82%,#FB7185 100%);padding:108px 28px 60px;text-align:center;color:#fff}
.thero::before{content:'';position:absolute;top:-90px;right:-60px;width:340px;height:340px;background:radial-gradient(circle,rgba(251,191,36,.4),transparent 64%)}
.thero .eyebrow{display:inline-block;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:12.5px;letter-spacing:.5px;background:rgba(255,255,255,.2);padding:7px 16px;border-radius:30px;position:relative}
.thero h1{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:clamp(32px,5.5vw,52px);line-height:1.06;margin-top:14px;position:relative;text-shadow:0 2px 20px rgba(0,0,0,.2)}
.thero h1 em{font-style:normal;color:#FFE15D}
.thero .lead{max-width:600px;margin:12px auto 0;font-size:15.5px;color:rgba(255,255,255,.95);position:relative}
.thero .chips{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px;position:relative}
.thero .chip{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:12.5px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);padding:8px 15px;border-radius:30px}.thero .chip b{color:#FFE15D}
.sec{padding:50px 28px}.regsec{padding:34px 0;border-bottom:1px solid var(--bdr)}
.shead{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:10px}
.shead h2{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:28px}.shead h2 .em{background:linear-gradient(120deg,var(--bl),var(--or-dk));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.shead a{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:13px;font-weight:800;color:var(--or-dk);background:#fff1f3;padding:8px 16px;border-radius:30px}
.tagn{position:absolute;left:12px;top:12px;font-family:'Outfit',sans-serif;font-size:18px;z-index:2}
/* FOOTER */
.footer{background:var(--ink);padding:52px 28px 100px;margin-top:10px}
.ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;max-width:1120px;margin:0 auto 30px}@media(max-width:680px){.ft-grid{grid-template-columns:1fr 1fr;gap:28px}}
.ft-logo{font-family:'Fraunces',serif;font-size:25px;font-weight:400;color:#fff;margin-bottom:6px}.ft-logo em{font-style:normal;color:var(--bl)}
.ft-tag{font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--go);margin-bottom:12px}
.ft-desc{font-size:13px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:16px;max-width:250px}
.ft-col h4{font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:13px}
.ft-col a{display:block;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:9px}.ft-col a:hover{color:#fff}
.ft-bottom{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-top:24px;border-top:1px solid rgba(255,255,255,.08);max-width:1120px;margin:0 auto;font-family:'Outfit',sans-serif;font-size:12px;color:rgba(255,255,255,.4)}
.ft-aff{font-size:11.5px;color:rgba(255,255,255,.35);text-align:center;padding-top:14px;max-width:1120px;margin:0 auto;line-height:1.65}
.mbar{position:fixed;bottom:0;left:0;right:0;z-index:900;background:#fff;box-shadow:0 -4px 20px rgba(15,40,70,.12);display:none;gap:10px;padding:10px 14px}@media(max-width:860px){.mbar{display:flex}}
.mbar a{flex:1;text-align:center;font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:13px;font-weight:800;padding:13px;border-radius:14px}.mbar .m1{background:linear-gradient(135deg,var(--or),var(--go));color:#fff}.mbar .m2{background:var(--bl-lt);color:var(--bl-dk)}
/* CITY STATS (overlap hero) */
.cstats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:860px;margin:-44px auto 0;position:relative;z-index:5;padding:0 28px}@media(max-width:560px){.cstats{grid-template-columns:repeat(2,1fr)}}
.cstat{background:#fff;border:1px solid #eafaff;border-radius:14px;box-shadow:0 12px 30px rgba(6,182,212,.15);padding:18px 12px;text-align:center;position:relative;overflow:hidden}
.cstat::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--bl),var(--or),var(--go))}
.cstat .n{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:30px;line-height:1;background-image:linear-gradient(120deg,var(--bl),var(--or-dk));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.cstat .l{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--mut);margin-top:6px}
.updatepill{max-width:1120px;margin:16px auto 0;padding:0 28px}.updatepill span{display:inline-flex;align-items:center;gap:7px;background:var(--bl-lt);color:var(--bl-dk);font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12px;font-weight:600;padding:6px 14px;border-radius:30px}
/* INTRO */
.section{max-width:1120px;margin:0 auto;padding:46px 28px 8px}
.sh{text-align:center;margin-bottom:26px}.sh .slbl{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--or-dk);margin-bottom:6px}.sh h2{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:clamp(24px,4vw,32px)}.sh h2 em{font-style:normal;background:linear-gradient(120deg,var(--bl),var(--or-dk));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.sh p{font-size:14px;color:var(--sub);margin-top:8px;max-width:660px;margin-left:auto;margin-right:auto}
.introgrid{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center}@media(max-width:740px){.introgrid{grid-template-columns:1fr;gap:26px}}
.introgrid .slbl{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--or-dk);margin-bottom:8px}
.introgrid h2{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:clamp(23px,3.4vw,31px);line-height:1.18}.introgrid h2 em{font-style:normal;background:linear-gradient(120deg,var(--bl),var(--or-dk));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.introgrid .ssub{font-size:14.5px;color:var(--sub);margin-top:10px;line-height:1.75}
.introbtn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--bl),var(--or));color:#fff;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:14px;padding:13px 24px;border-radius:30px;box-shadow:0 8px 20px rgba(6,182,212,.32);margin-top:18px}
.icards{display:grid;grid-template-columns:1fr 1fr;gap:12px}.icard{border-radius:16px;padding:22px 18px}.icard .ie{font-size:28px;margin-bottom:8px}.icard h4{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:14px;margin-bottom:4px}.icard p{font-size:12.5px;color:var(--sub)}
.ic0{background:var(--bl-lt)}.ic1{background:var(--or-lt)}.ic2{background:#E9F7EF}.ic3{background:#F3E8FF}
/* EDITOR PICKS */
.ep-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}@media(max-width:1080px){.ep-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:680px){.ep-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:440px){.ep-grid{grid-template-columns:1fr}}
.ep-card{background:#fff;border:1px solid rgba(6,182,212,.08);border-radius:16px;overflow:hidden;transition:.22s;position:relative;display:flex;flex-direction:column}.ep-card:hover{transform:translateY(-5px);box-shadow:0 16px 34px rgba(251,113,133,.22)}
.ep-rank{position:absolute;top:10px;left:10px;background:linear-gradient(135deg,var(--or),var(--go));color:#fff;font-family:'Fraunces',serif;font-size:17px;font-weight:600;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(251,113,133,.45);z-index:2}
.ep-img{height:140px;overflow:hidden;background:linear-gradient(150deg,#06B6D4,#22d3ee 55%,#FBBF24)}.ep-img img{width:100%;height:100%;object-fit:cover;transition:transform .55s}.ep-card:hover .ep-img img{transform:scale(1.08)}
.ep-body{padding:13px 14px 14px;flex:1;display:flex;flex-direction:column}.ep-title{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:15px;line-height:1.3;margin-bottom:5px}.ep-why{font-size:11.5px;color:var(--sub);line-height:1.5;margin-bottom:8px;flex:1}.ep-tag{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:10.5px;font-weight:700;color:var(--bl-dk);background:var(--bl-lt);padding:3px 9px;border-radius:20px;align-self:flex-start}
/* HOODS */
.hoodgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}@media(max-width:880px){.hoodgrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.hoodgrid{grid-template-columns:1fr}}
.hood{border-radius:18px;padding:22px 20px;color:#fff;min-height:128px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden;box-shadow:0 10px 26px rgba(15,40,70,.1)}
.hood::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 82% 8%,rgba(255,255,255,.2),transparent 60%)}
.hood h4{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:18px;position:relative;z-index:1}.hood p{font-size:12.5px;color:rgba(255,255,255,.93);margin-top:4px;position:relative;z-index:1}
.hg0{background:linear-gradient(150deg,#0891b2,#06d6e0)}.hg1{background:linear-gradient(150deg,#f15a86,#FB7185)}.hg2{background:linear-gradient(150deg,#0aa2c0,#22d3ee)}.hg3{background:linear-gradient(150deg,#fb923c,#FBBF24)}.hg4{background:linear-gradient(150deg,#0891b2,#FB7185)}.hg5{background:linear-gradient(150deg,#f43f5e,#fb923c)}
/* AFFILIATE */
.affgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}@media(max-width:760px){.affgrid{grid-template-columns:1fr}}
.affcard{background:#fff;border:1px solid var(--bdr);border-radius:18px;padding:24px 22px;text-align:center;box-shadow:var(--sh)}.affcard .adot{width:16px;height:16px;border-radius:50%;display:inline-block;margin-right:7px;vertical-align:-2px}.affcard .an{font-family:'Outfit',sans-serif;font-weight:800;font-size:16px;margin-bottom:6px}.affcard p{font-size:12.5px;color:var(--sub);margin-bottom:14px}.affcard a{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--ink);color:#fff;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:13px;padding:11px 22px;border-radius:30px;transition:transform .15s,box-shadow .2s}
.affcard a:hover{transform:translateY(-2px)}
.affcard a.b-agoda{background:#FF2938;box-shadow:0 6px 16px rgba(255,41,56,.32)}.affcard a.b-booking{background:#003580;box-shadow:0 6px 16px rgba(0,53,128,.32)}.affcard a.b-trip{background:#287DFA;box-shadow:0 6px 16px rgba(40,125,250,.3)}
.affcard a .bkm{width:19px;height:19px;display:inline-flex;align-items:center;justify-content:center;background:#fff;font-family:'Outfit',sans-serif;font-weight:800;font-size:10.5px;line-height:1;flex-shrink:0}.affcard a .bkm.r{border-radius:50%}.affcard a .bkm.sq{border-radius:5px}
.affcard a.b-agoda .bkm{color:#FF2938}.affcard a.b-booking .bkm{color:#003580}.affcard a.b-trip .bkm{color:#287DFA}
/* SEO */
.seo{max-width:1120px;margin:0 auto;padding:8px 28px 40px}.seobox{background:var(--bl-lt);border-radius:20px;padding:28px 30px}.seobox h2{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:22px;margin-bottom:12px}.seobox p{font-size:14px;color:#334155;line-height:1.85;margin-bottom:10px}.seobox b{color:var(--ink)}
/* EXPERT-HUB ADDITIONS */
.qabox{max-width:1120px;margin:18px auto 0;padding:0 28px;display:flex;flex-wrap:wrap;gap:12px;align-items:stretch}
.qabox .qa{flex:1 1 150px;display:flex;gap:10px;align-items:center;background:#fff;border:1px solid var(--bdr);border-radius:16px;padding:12px 16px;box-shadow:var(--sh)}
.qabox .qa-e{font-size:22px;flex-shrink:0}.qabox .qa b{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:11px;color:var(--mut);font-weight:700;display:block;text-transform:uppercase;letter-spacing:.3px}.qabox .qa p{font-size:13.5px;font-weight:600;color:var(--ink);margin-top:2px;line-height:1.35}
.qabox .qa-cta{flex:1 1 240px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:3px;background:linear-gradient(135deg,var(--bl),var(--or));color:#fff;font-family:'Outfit','Noto Sans Thai',sans-serif;border-radius:16px;padding:13px 20px;box-shadow:0 8px 20px rgba(6,182,212,.3)}
.qabox .qa-cta b{font-weight:800;font-size:15px;line-height:1.2}.qabox .qa-cta span{font-weight:500;font-size:11px;opacity:.92;line-height:1.35}
.seasgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}@media(max-width:640px){.seasgrid{grid-template-columns:1fr}}
.seascard{background:#fff;border:1px solid var(--bdr);border-radius:16px;padding:16px 18px;box-shadow:var(--sh)}.seascard .seas-mo{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:14px;color:var(--bl-dk)}.seascard .seas-nm{font-weight:700;font-size:13px;color:var(--ink);margin:4px 0 6px}.seascard p{font-size:12.5px;color:var(--sub);line-height:1.6}
.seas-warn{margin-top:14px;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:14px 18px;font-size:13.5px;color:#9a3412;line-height:1.7}
.budgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}@media(max-width:640px){.budgrid{grid-template-columns:1fr}}
.budcard{background:var(--bl-lt);border-radius:16px;padding:18px;text-align:center}.budcard .bud-e{font-size:24px}.budcard .bud-nm{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:13px;color:var(--sub);margin:6px 0 4px}.budcard .bud-amt{font-family:'Outfit',sans-serif;font-weight:800;font-size:18px;color:var(--ink)}
.budnote{font-size:12px;color:var(--mut);margin-top:10px}
.cmap{width:100%;height:360px;border:1px solid var(--bdr);border-radius:20px;box-shadow:var(--sh)}@media(max-width:640px){.cmap{height:280px}}
.maplink{display:inline-block;margin-top:12px;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:13px;color:var(--bl-dk)}
.klook{display:flex;align-items:center;justify-content:space-between;gap:22px;background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa;border-radius:22px;padding:24px 28px;box-shadow:0 10px 28px rgba(255,91,0,.12);margin-top:18px}@media(max-width:640px){.klook{flex-direction:column;text-align:center;padding:24px 20px}}
.klook .kl-t{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:900;font-size:18px;color:#9a3412}.klook p{font-size:13.5px;color:#9a3412;opacity:.82;margin-top:5px;line-height:1.55}
.klook .kl-b{flex-shrink:0;display:inline-flex;align-items:center;gap:11px;background:linear-gradient(135deg,#ff7e1d,#ff5b00);color:#fff;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:16px;padding:16px 28px;border-radius:16px;white-space:nowrap;box-shadow:0 9px 22px rgba(255,91,0,.36);transition:transform .14s,box-shadow .14s}
.klook .kl-b:hover{transform:translateY(-2px);box-shadow:0 13px 30px rgba(255,91,0,.48)}
.klook .kl-b .kbadge{background:#fff;color:#ff5b00;font-weight:900;font-size:15px;letter-spacing:-.5px;border-radius:7px;padding:4px 10px;line-height:1}
.faqsec{max-width:900px;margin:0 auto;padding:46px 28px 8px}
.faqlist{display:flex;flex-direction:column;gap:10px}
.faqit{background:#fff;border:1px solid var(--bdr);border-radius:14px;box-shadow:var(--sh);overflow:hidden}
.faqit summary{cursor:pointer;list-style:none;padding:16px 20px;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:15px;color:var(--ink);display:flex;justify-content:space-between;align-items:center;gap:12px}
.faqit summary::-webkit-details-marker{display:none}.faqit summary::after{content:'+';font-size:20px;color:var(--bl);font-weight:400;flex-shrink:0}.faqit[open] summary::after{content:'–'}
.faqit p{padding:0 20px 18px;font-size:14px;color:var(--sub);line-height:1.8}
</style>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">`;

function navHtml(slug){
  const lbTH = `<button class="lb${LOC==='th'?' active':''}"${LOC==='th'?'':` onclick="location.href='/${slug}.html'"`}>TH</button>`;
  const lbEN = `<button class="lb${LOC==='en'?' active':''}"${LOC==='en'?'':` onclick="location.href='/en/${slug}.html'"`}>EN</button>`;
  return `<nav class="nav">
  <a href="${PFX()}" class="logo">Thailand<em>Addict</em></a>
  <div class="nav-mid">
    <div class="has-drop"><a href="country-thailand.html">${tx('จุดหมาย','Destinations')}</a><div class="drop"><span class="h">${tx('✨ ยอดนิยม','✨ Popular')}</span><a href="tourist-cities.html">${tx('🔥 เมืองท่องเที่ยว','🔥 Top Cities')}</a><span class="h">${tx('🇹🇭 6 ภาค','🇹🇭 6 Regions')}</span><a href="region-north.html">${tx('⛰️ ภาคเหนือ','⛰️ North')}</a><a href="region-isan.html">${tx('🌾 ภาคอีสาน','🌾 Isan')}</a><a href="region-central.html">${tx('🏙️ ภาคกลาง','🏙️ Central')}</a><a href="region-east.html">${tx('🏝️ ภาคตะวันออก','🏝️ East')}</a><a href="region-west.html">${tx('🌅 ภาคตะวันตก','🌅 West')}</a><a href="region-south.html">${tx('🌊 ภาคใต้','🌊 South')}</a><a href="country-thailand.html" style="font-weight:700;color:var(--bl-dk)">${tx('→ ดูทั้ง 77 จังหวัด','→ All 77 provinces')}</a></div></div>
    <div class="has-drop"><a href="top10-hotels-chiang-mai.html">${tx('โรงแรม','Hotels')}</a><div class="drop"><span class="h">${tx('จัดอันดับยอดนิยม','Top Rankings')}</span><a href="top10-hotels-chiang-mai.html">Top 10 ${tx('เชียงใหม่','Chiang Mai')}</a><a href="top10-hotels-bangkok.html">Top 10 ${tx('กรุงเทพ','Bangkok')}</a><a href="top10-hotels-phuket.html">Top 10 ${tx('ภูเก็ต','Phuket')}</a><a href="top10-hotels-krabi.html">Top 10 ${tx('กระบี่','Krabi')}</a><a href="top10-hotels-chonburi.html">Top 10 ${tx('พัทยา','Pattaya')}</a><a href="country-thailand.html" style="font-weight:700;color:var(--bl-dk)">${tx('→ โรงแรมทุกจังหวัด','→ Hotels in all provinces')}</a></div></div>
    <div class="has-drop"><a href="city-chiang-mai.html#see">${tx('ที่เที่ยว','Things to Do')}</a><div class="drop"><span class="h">${tx('ที่เที่ยวยอดนิยม','Top Sights')}</span><a href="city-chiang-mai.html#see">${tx('เชียงใหม่','Chiang Mai')}</a><a href="city-bangkok.html#see">${tx('กรุงเทพ','Bangkok')}</a><a href="city-phuket.html#see">${tx('ภูเก็ต','Phuket')}</a><a href="city-krabi.html#see">${tx('กระบี่','Krabi')}</a><span class="h">${tx('คู่มือเที่ยว','Guides')}</span><a href="best-day-trips-from-bangkok.html">${tx('เที่ยวรอบกรุงเทพ 1 วัน','Day trips from Bangkok')}</a><a href="best-islands-snorkeling-thailand.html">${tx('เกาะดำน้ำน้ำใส','Best snorkeling islands')}</a><a href="best-temple-destinations-thailand.html">${tx('ไหว้พระ–วัดสวย','Best temples')}</a><a href="tourist-cities.html" style="font-weight:700;color:var(--bl-dk)">${tx('→ เมืองท่องเที่ยวทั้งหมด','→ All top cities')}</a></div></div>
    <div class="has-drop"><a href="city-chiang-mai.html#eat">${tx('ของกิน','Food')}</a><div class="drop"><span class="h">${tx('ของกินเด็ด','Best Eats')}</span><a href="city-chiang-mai.html#eat">${tx('เชียงใหม่','Chiang Mai')}</a><a href="city-bangkok.html#eat">${tx('กรุงเทพ','Bangkok')}</a><a href="city-phuket.html#eat">${tx('ภูเก็ต','Phuket')}</a><a href="city-krabi.html#eat">${tx('กระบี่','Krabi')}</a><span class="h">${tx('คู่มือกิน','Food Guides')}</span><a href="best-cafe-hopping-thailand.html">${tx('คาเฟ่ฮอปปิ้ง','Café hopping')}</a><a href="cooking-classes-bangkok.html">${tx('เรียนทำอาหารไทย','Thai cooking classes')}</a></div></div>
    <a href="/trip" style="font-weight:700">${tx('วางแผนทริป AI','AI Trip Planner')}</a>
    <a href="plan-your-trip.html">${tx('เตรียมตัว','Plan Trip')}</a>
    <a href="about.html">${tx('เกี่ยวกับเรา','About')}</a>
  </div>
  <div class="nav-r">
    <div class="lang-wrap">${lbTH}${lbEN}</div>
    <div class="search-box"><input type="text" id="navsearch" class="search-input" placeholder="${tx('ค้นหาจังหวัด...','Search provinces...')}" autocomplete="off"><div class="search-drop" id="navdrop"></div></div>
    <button class="nav-cta" onclick="window.open('https://www.agoda.com/?cid=1965862','_blank')">${tx('ค้นหาที่พัก','Find Hotels')}</button>
    <button class="hb" id="hb">☰</button>
  </div>
</nav>
<div class="mm" id="mm"><div class="mm-top"><span class="logo">Thailand<em>Addict</em></span><button class="mm-x" id="mmx">✕</button></div>
  <a href="country-thailand.html" style="font-weight:700;color:var(--bl)">${tx('🇹🇭 จุดหมาย · 77 จังหวัด','🇹🇭 Destinations · 77 provinces')}</a><a href="tourist-cities.html">${tx('🔥 เมืองท่องเที่ยว','🔥 Top Cities')}</a><a href="region-north.html">${tx('⛰️ ภาคเหนือ','⛰️ North')}</a><a href="region-central.html">${tx('🏙️ ภาคกลาง','🏙️ Central')}</a><a href="region-south.html">${tx('🌊 ภาคใต้','🌊 South')}</a><a href="top10-hotels-chiang-mai.html" style="font-weight:700;color:var(--bl)">${tx('🏨 โรงแรม · จัดอันดับ','🏨 Hotels · Rankings')}</a><a href="city-chiang-mai.html#see" style="font-weight:700;color:var(--bl)">${tx('🏖️ ที่เที่ยว','🏖️ Things to Do')}</a><a href="city-chiang-mai.html#eat" style="font-weight:700;color:var(--bl)">${tx('🍜 ของกิน','🍜 Food')}</a><a href="/trip" style="font-weight:700;color:var(--bl)">${tx('🤖 วางแผนทริป AI','🤖 AI Trip Planner')}</a><a href="plan-your-trip.html">${tx('🧭 เตรียมตัวเที่ยว','🧭 Plan Your Trip')}</a><a href="about.html">${tx('เกี่ยวกับเรา','About')}</a><a href="contact.html">${tx('ติดต่อ','Contact')}</a>
  <button class="mm-cta" onclick="window.open('https://www.agoda.com/?cid=1965862','_blank')">${tx('ค้นหาโรงแรม','Find Hotels')}</button>
</div>`;
}

function footerHtml(){ return `<footer class="footer"><div class="ft-grid">
  <div><div class="ft-logo">Thailand<em>Addict</em></div><div class="ft-tag">Explore Thailand Like a Local</div><p class="ft-desc">${tx('ชีวิตติดเที่ยว — ที่สุดของที่พัก ที่กิน ที่เที่ยว ทั่วไทย คัดจากเสียงรีวิวจริง','Life on the road — the best stays, food and sights across Thailand, picked from real reviews.')}</p></div>
  <div class="ft-col"><h4>${tx('จุดหมาย','Destinations')}</h4><a href="country-thailand.html">${tx('🇹🇭 เที่ยวไทย','🇹🇭 Thailand')}</a><a href="city-chiang-mai.html">${tx('เชียงใหม่','Chiang Mai')}</a><a href="city-bangkok.html">${tx('กรุงเทพ','Bangkok')}</a><a href="city-phuket.html">${tx('ภูเก็ต','Phuket')}</a><a href="city-krabi.html">${tx('กระบี่','Krabi')}</a></div>
  <div class="ft-col"><h4>${tx('คอนเทนต์','Content')}</h4><a href="city-chiang-mai.html#stay">${tx('โรงแรมเชียงใหม่','Chiang Mai hotels')}</a><a href="city-bangkok.html#eat">${tx('ของกินกรุงเทพ','Bangkok food')}</a><a href="country-thailand.html">${tx('คู่มือเที่ยวไทย','Thailand guide')}</a><a href="plan-your-trip.html">${tx('เตรียมตัวเที่ยว','Plan Your Trip')}</a></div>
  <div class="ft-col"><h4>${tx('เกี่ยวกับ','About')}</h4><a href="about.html">${tx('เกี่ยวกับเรา','About us')}</a><a href="editorial-policy.html">${tx('นโยบายบรรณาธิการ','Editorial Policy')}</a><a href="contact.html">${tx('ติดต่อ','Contact')}</a><a href="privacy.html">${tx('ความเป็นส่วนตัว','Privacy')}</a></div>
  </div>
  <div class="ft-bottom"><span>© 2026 thailandaddict.com${tx(' — ชีวิตติดเที่ยว','')}</span><span>Privacy · Editorial Policy</span></div>
  <div class="ft-aff">${tx('⚡ ThailandAddict เป็น affiliate partner ของ Agoda, Booking.com และ Trip.com — เราอาจได้รับค่าคอมมิชชั่นเมื่อคุณจองผ่านลิงก์ในเว็บ โดยไม่มีค่าใช้จ่ายเพิ่มสำหรับคุณ','⚡ ThailandAddict is an affiliate partner of Agoda, Booking.com and Trip.com — we may earn a commission when you book through links on this site, at no extra cost to you.')}</div>
</footer>
<div class="mbar"><a class="m1" href="country-thailand.html">${tx('🇹🇭 เลือกจังหวัด','🇹🇭 Pick a province')}</a><a class="m2" onclick="window.open('https://www.agoda.com/?cid=1965862','_blank')">${tx('🏨 ค้นหาที่พัก','🏨 Find Hotels')}</a></div>`;
}

function commonJs(){
  const SP_JSON = JSON.stringify([...PROVINCES, ...DESTINATIONS].map(([s,th])=>[s, LOC==='en'?(EN_NAME[s]||th):th]));
  const verb = tx('เที่ยว','Explore '), empty = tx('ไม่พบจังหวัด','No provinces found'), all = tx('🔎 ค้นหาทั้งเว็บ','🔎 Search the whole site');
  return `<script>
var __SP=${SP_JSON};
(function(){var hb=document.getElementById('hb'),mm=document.getElementById('mm'),mmx=document.getElementById('mmx');if(hb){hb.onclick=function(){mm.classList.add('open')};mmx.onclick=function(){mm.classList.remove('open')};}
var ns=document.getElementById('navsearch'),nd=document.getElementById('navdrop');
if(ns){function full(){var v=ns.value.trim();return '<a href="search.html?q='+encodeURIComponent(v)+'" style="display:block;padding:10px 12px;font-family:Outfit,Noto Sans Thai,sans-serif;font-weight:700;color:var(--bl-dk);border-top:1px solid var(--bdr)">${all} &rarr;</a>';}
ns.addEventListener('input',function(){var q=ns.value.trim().toLowerCase();if(!q){nd.classList.remove('show');return;}var r=__SP.filter(function(p){return p[1].toLowerCase().indexOf(q)>-1||p[0].indexOf(q)>-1;}).slice(0,6);nd.innerHTML=(r.length?r.map(function(p){return '<a href="city-'+p[0]+'.html"><div class="t">${verb}'+p[1]+'</div><div class="c">city-'+p[0]+'</div></a>';}).join(''):'')+full();nd.classList.add('show');});
ns.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=ns.value.trim();location.href='search.html'+(v?'?q='+encodeURIComponent(v):'');}});
document.addEventListener('click',function(e){if(!e.target.closest('.search-box'))nd.classList.remove('show');});}})();
</script>`;
}

function page({ title, desc, slug, jsonld, body, extraJS, image, noEn }) {
  const canon = `https://thailandaddict.com${PFX()}${slug}`;
  const altTH = `https://thailandaddict.com/${slug}`;
  const altEN = `https://thailandaddict.com/en/${slug}`;
  const ogImg = image ? (/^https?:/.test(image) ? image : 'https://thailandaddict.com' + image) : 'https://thailandaddict.com/images/heroes/krabi.jpg';
  return `<!doctype html>
<html lang="${LOC}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">${GA_HEAD}
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canon}">
<link rel="alternate" hreflang="th" href="${altTH}">${noEn?"":`<link rel="alternate" hreflang="en" href="${altEN}">`}<link rel="alternate" hreflang="x-default" href="${altTH}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%2306B6D4'/%3E%3Ctext x='50' y='70' font-family='Georgia,serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E">
<meta property="og:site_name" content="ThailandAddict"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}"><meta property="og:type" content="website">
<meta property="og:image" content="${ogImg}"><meta property="og:locale" content="${LOCALE_MAP[LOC].ogLocale}"><meta name="theme-color" content="#06B6D4">
${FONTS}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
${CSS}
<link rel="stylesheet" href="/css/premium.css">
</head><body>
${navHtml(slug)}
${body}
${footerHtml()}
${commonJs()}${extraJS||''}
<script src="/js/currency.js" defer></script>
<script src="/js/premium-motion.js" defer></script>
</body></html>`;
}

function crumb(parts){
  return `<div class="crumb">`+parts.map((p,i)=> i<parts.length-1 ? `<a href="${p.href}">${esc(p.t)}</a> › ` : `<span>${esc(p.t)}</span>`).join('')+`</div>`;
}
function artCards(cluster, types, excludeRe){
  let list=(ARTS[cluster]||[]).filter(a=>types.includes(a.type));
  if(excludeRe) list=list.filter(a=>!excludeRe.test(a.slug));
  if(!list.length) return '';
  return `<div class="dgrid">`+list.map(a=>{const img=resolveImg(a.heroImg);return `<a class="dcard" href="${a.slug}.html"><div class="dphoto">${img?`<img src="${img}" alt="${esc(stripTags(a.title))}" loading="lazy" onerror="this.style.opacity=0">`:''}</div><div class="dbody"><h3>${esc(stripTags(a.title))}</h3><span class="go">${tx('อ่านบทความ →','Read article →')}</span></div></a>`;}).join('')+`</div>`;
}
// Curated Bangkok neighbourhood cards: [order, emoji, nameTH, nameEN, captionTH, captionEN].
// Order sets the display sequence; the first 12 show on the hub, the rest behind a "see all" toggle.
const HOOD_CARDS = {
  'where-to-stay-bangkok-sukhumvit':[1,'🍸','สุขุมวิท','Sukhumvit','อโศก-นานา · ไนต์ไลฟ์ · BTS-MRT','Asok–Nana · nightlife · BTS-MRT'],
  'where-to-stay-bangkok-silom-sathorn':[2,'🌆','สีลม-สาทร','Silom–Sathorn','ย่านธุรกิจ · รูฟท็อปบาร์','CBD · rooftop bars'],
  'where-to-stay-bangkok-khao-san':[3,'🎒','ข้าวสาร-เมืองเก่า','Khao San–Old City','สายแบกเป้ · วัด·วัง','Backpacker · temples & palace'],
  'where-to-stay-bangkok-riverside':[4,'⛵','ริมเจ้าพระยา','Riverside','วิวแม่น้ำ · โรงแรมหรู','River views · grand hotels'],
  'where-to-stay-bangkok-chinatown':[5,'🏮','เยาวราช','Chinatown (Yaowarat)','สตรีทฟู้ดในตำนาน','Legendary street food'],
  'where-to-stay-bangkok-siam-pratunam':[6,'🛍️','สยาม-ประตูน้ำ','Siam–Pratunam','ใจกลางช้อปปิ้ง · BTS','Shopping core · BTS hub'],
  'where-to-stay-bangkok-thong-lo':[7,'☕','ทองหล่อ-เอกมัย','Thonglo–Ekkamai','คาเฟ่ฮิป · นั่งชิล','Hip cafés · trendy'],
  'where-to-stay-bangkok-ari':[8,'🌿','อารีย์','Ari','คาเฟ่ · ชิล · โลคอลคูล','Cafés · chill · local cool'],
  'where-to-stay-bangkok-mochit-chatuchak':[9,'🛒','หมอชิต-จตุจักร','Mo Chit–Chatuchak','ตลาดนัดสุดสัปดาห์','Weekend market'],
  'where-to-stay-bangkok-ratchada':[10,'🌃','รัชดา-ห้วยขวาง','Ratchada','ตลาดกลางคืน · MRT','Night markets · MRT'],
  'where-to-stay-bangkok-phrom-phong':[11,'🍱','พร้อมพงษ์','Phrom Phong','เอ็มดิสทริค · ญี่ปุ่น · หรู','EmDistrict · Japanese · upscale'],
  'where-to-stay-bangkok-charoen-krung':[12,'🎨','เจริญกรุง-ตลาดน้อย','Charoen Krung','ครีเอทีฟ · ริมน้ำ','Creative · riverside'],
  'where-to-stay-bangkok-on-nut':[13,'🏙️','อ่อนนุช-พระโขนง','On Nut–Phra Khanong','โลคอลคูล · คอนโด · BTS','Local cool · condos · BTS'],
  'where-to-stay-bangkok-chidlom':[14,'💎','ชิดลม-ราชประสงค์','Chidlom–Ratchaprasong','ห้างหรู · ใจกลางเมือง','Luxury malls · central'],
  'where-to-stay-bangkok-samyan':[15,'🎓','สามย่าน-จุฬา','Sam Yan–Chula','วัยเรียน · คุ้ม · MRT','Student · value · MRT'],
  'where-to-stay-bangkok-victory-monument':[16,'🍜','อนุสาวรีย์ชัยฯ','Victory Monument','ก๋วยเตี๋ยวเรือ · ฮับรถ','Boat noodles · transit hub'],
  'where-to-stay-bangkok-rama9':[17,'🏢','พระราม 9-รัชดา','Rama 9','CBD ใหม่ · ออฟฟิศ','New CBD · business'],
  'where-to-stay-bangkok-ladprao':[18,'🍲','ลาดพร้าว','Lat Phrao','ของกินโลคอล · MRT','Local eats · MRT'],
  'where-to-stay-bangkok-central-ladprao':[19,'🏬','เซ็นทรัลลาดพร้าว','Central Ladprao','ห้าแยกลาดพร้าว · ห้าง · BTS','Mall hub · BTS'],
  'where-to-stay-bangkok-kaset':[20,'🎓','เกษตร-นวมินทร์','Kaset','ม.เกษตร · คุ้ม · โลคอล','University · value'],
  'where-to-stay-bangkok-ramkhamhaeng':[21,'🏟️','รามคำแหง-หัวหมาก','Ramkhamhaeng','ม.รามฯ · สเตเดียม','Campus · stadium'],
  'where-to-stay-bangkok-bangna':[22,'🌳','บางนา','Bang Na','BITEC · เอ็กซ์โป · ห้าง','BITEC · expo · malls'],
  'where-to-stay-bangkok-pinklao':[23,'🛶','ปิ่นเกล้า-ฝั่งธน','Pinklao','ฝั่งธนฯ · ใกล้เมืองเก่า','Thonburi · near Old City'],
  'where-to-stay-bangkok-chaeng-watthana':[24,'🏛️','แจ้งวัฒนะ-หลักสี่','Chaeng Watthana','ศูนย์ราชการ · MICE','Govt complex · MICE'],
  'where-to-stay-bangkok-bang-khen':[25,'🚉','วัดพระศรีฯ-บางเขน','Bang Khen','ปลายสายสีเขียว · มหา\'ลัย','North Green-line · campuses'],
  'where-to-stay-bangkok-ratchathewi':[26,'🚉','ราชเทวี-พญาไท','Ratchathewi–Phaya Thai','ติด ARL · ใกล้สยาม','Near Airport Link & Siam'],
  'where-to-stay-bangkok-ploenchit':[27,'🌳','เพลินจิต-หลังสวน','Phloen Chit','สถานทูต · ใกล้สวนลุม','Embassies · near Lumpini'],
  'where-to-stay-bangkok-bang-sue':[28,'🚄','บางซื่อ-ประดิพัทธ์','Bang Sue','สถานีกลาง · ฮับรถไฟ','Central Station · rail hub'],
  'where-to-stay-bangkok-srinakarin':[29,'🦐','ศรีนครินทร์-สวนหลวง','Srinakarin','ซีคอน · ของกิน · ตะวันออก','Seacon · food · east'],
  'where-to-stay-bangkok-bangkapi':[30,'🛍️','บางกะปิ','Bangkapi','เดอะมอลล์ · ฝั่งตะวันออก','The Mall · east BKK'],
  'where-to-stay-bangkok-talat-phlu':[31,'🍢','ตลาดพลู-วงเวียนใหญ่','Talat Phlu','สตรีทฟู้ดฝั่งธน · BTS','Thonburi street food · BTS'],
  'where-to-stay-bangkok-sai-tai':[32,'🚌','สายใต้ใหม่-ตลิ่งชัน','Sai Tai–Taling Chan','บขส.สายใต้ · ตลาดน้ำ · ฝั่งธน','Southern bus hub · floating markets'],
  'where-to-stay-bangkok-saphan-taksin':[33,'⛴️','สะพานตากสิน-สาทร','Saphan Taksin–Sathorn','ท่าเรือ · ริมน้ำ · BTS','Pier · riverfront · BTS'],
};
// per-area "where to stay" guides → reference-style photo grid (emoji + name + descriptor overlaid on the photo),
// ordered by HOOD_CARDS, first 12 visible + the rest behind a <details> "see all" toggle. Image = article heroImg (R2).
function hoodGuides(cluster){
  const pre=`where-to-stay-${cluster}-`;
  let list=(ARTS[cluster]||[]).filter(a=>a.slug.startsWith(pre));
  if(!list.length) return '';
  const en=LOC!=='th';
  const meta=(a)=>{ const c=HOOD_CARDS[a.slug]; if(c) return {o:c[0],e:c[1],nm:en?c[3]:c[2],cap:en?c[5]:c[4]};
    const t=stripTags(String(a.title).replace(/<br\s*\/?>/gi,' ')).replace(/^(พักย่าน|Where to Stay in)\s*/i,'').trim();
    return {o:99,e:'📍',nm:t,cap:''}; };
  const rows=list.map(a=>({a,m:meta(a)})).sort((x,y)=>x.m.o-y.m.o||x.a.slug.localeCompare(y.a.slug));
  // Many neighborhood guides reuse the generic province hero (/images/heroes/<slug>.jpg) → all cards look
  // identical. Substitute a distinct real photo (hotel reviews, then attractions) so each area differs.
  const pool=imgPool(cluster,false);
  const card=({a,m},i)=>{const href=cluster==='bangkok'?a.slug.replace(/^where-to-stay-/,'area-')+'.html':`${a.slug}.html`;
    let img=a.heroImg; if((!img||img.includes('/images/heroes/'))&&pool.length) img=pool[i%pool.length];
    return `<a class="hcc" href="${href}">${img?`<img src="${img}" alt="${esc(m.nm)}" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="hcc-cap"><span class="hcc-e">${m.e}</span><b>${esc(m.nm)}</b>${m.cap?`<i>${esc(m.cap)}</i>`:''}</span></a>`;};
  const cards=rows.map((r,i)=>card(r,i));
  const N=12, head=cards.slice(0,N).join(''), rest=cards.slice(N);
  let out=`<div class="hccg">${head}</div>`;
  if(rest.length) out+=`<details class="hccmore"><summary>${tx(`ดูย่านทั้งหมด (${rows.length}) →`,`See all ${rows.length} areas →`)}</summary><div class="hccg">${rest.join('')}</div></details>`;
  return out;
}
// "hotels near <anchor>" overlays → same reference-style photo-card grid as hoodGuides, but keyed on the
// anchor (group emoji + short anchor name + zone). Grouped hospitals → MICE → airports. Card image = the
// overlay article's heroImg (already R2-prefixed in ARTS). Only renders for a cluster that has overlays.
function nearGuides(cluster){
  const list=OVERLAYS.filter(o=>o.city===cluster);
  if(!list.length) return '';
  const en=LOC!=='th', order={medical:0,mice:1,airport:2};
  const arts=ARTS[cluster]||[];
  const rows=list.map(o=>({o,art:arts.find(a=>a.slug===o.slug)})).sort((a,b)=>(order[a.o.group]??9)-(order[b.o.group]??9)||a.o.slug.localeCompare(b.o.slug));
  const card=({o,art})=>{const img=(art&&art.heroImg)||'';const nm=en?o.anchorShortEn:o.anchorShortTh;const cap=en?o.zoneEn:o.zoneTh;return `<a class="hcc" href="${o.slug}.html">${img?`<img src="${img}" alt="${esc(nm)}" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="hcc-cap"><span class="hcc-e">${GROUP_EMOJI[o.group]||'📍'}</span><b>${esc(nm)}</b>${cap?`<i>${esc(cap)}</i>`:''}</span></a>`;};
  const N=12, head=rows.slice(0,N).map(card).join(''), rest=rows.slice(N);
  let out=`<div class="hccg">${head}</div>`;
  if(rest.length) out+=`<details class="hccmore"><summary>${tx(`ดูทั้งหมด (${rows.length}) →`,`See all ${rows.length} →`)}</summary><div class="hccg">${rest.map(card).join('')}</div></details>`;
  return out;
}
// distinct real-image pool for a city (all on R2). preferAttr → attraction scenery first (for itinerary/see
// cards), else hotel photos first (for where-to-stay cards).
function imgPool(cluster, preferAttr){
  const hotels=[], atts=[];
  for(const h of ((REVS[cluster]||[]).slice().sort((a,b)=>b.score-a.score))) if(h.img) hotels.push(h.img);
  for(const a of (ARTS[cluster]||[])) if(a.type==='attraction' && a.heroImg) atts.push(a.heroImg);
  const order = preferAttr ? [...atts,...hotels] : [...hotels,...atts];
  const out=[]; for(const x of order) if(x && !out.includes(x)) out.push(x);
  return out;
}
// Page-scoped image de-dup: many articles share a hero (e.g. itineraries all use the same monk photo).
// resolveImg keeps an article's own image when it's real and unused, else pulls a distinct one from the pool.
// Reset PAGE_USED/POOL/PI at the start of each hub page (see provinceHub).
let PAGE_USED = new Set(), PAGE_POOL = [], PAGE_PI = 0;
function resolveImg(src){
  const generic = !src || src.includes('/images/heroes/');
  if(!generic && !PAGE_USED.has(src)){ PAGE_USED.add(src); return src; }
  while(PAGE_PI < PAGE_POOL.length){ const c=PAGE_POOL[PAGE_PI++]; if(!PAGE_USED.has(c)){ PAGE_USED.add(c); return c; } }
  return generic ? '' : src;   // pool exhausted: blank for generic, allow the (duplicate) real image otherwise
}
// "ranked" badge + article-style card (used for roundups and individual articles in city-hub tabs)
const rbadge = () => `<span style="display:inline-block;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;font-size:10px;font-weight:800;letter-spacing:.4px;padding:2px 8px;border-radius:999px;margin-bottom:7px">★ ${tx('จัดอันดับ','RANKED')}</span>`;
function dcardA(a,ranked){
  const go=ranked?tx('ดูอันดับ →','See ranking →'):tx('อ่านบทความ →','Read article →');
  const img=resolveImg(a.heroImg);
  return `<a class="dcard" href="${a.slug}.html"><div class="dphoto">${img?`<img src="${img}" alt="${esc(stripTags(a.title))}" loading="lazy" onerror="this.style.opacity=0">`:''}</div><div class="dbody">${ranked?rbadge():''}<h3>${esc(stripTags(a.title))}</h3><span class="go">${go}</span></div></a>`;
}
function rndCard(r){
  const img=resolveImg(r.heroImg);
  return `<a class="dcard" href="${r.slug}.html"><div class="dphoto">${img?`<img src="${img}" alt="${esc(r.label)}" loading="lazy" onerror="this.style.opacity=0">`:''}</div><div class="dbody">${rbadge()}<h3>${esc(r.label)}</h3><span class="go">${tx('ดูอันดับ →','See ranking →')}</span></div></a>`;
}
const moreSummary = (n,label) => `<details class="moretoggle" style="margin-top:16px"><summary style="cursor:pointer;list-style:none;display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--bl-dk);padding:10px 20px;border:1.5px solid var(--bl);border-radius:999px;background:var(--bl-lt)">${label||tx(`ดูเพิ่มเติม (${n}) →`,`Show ${n} more →`)}</summary>`;
// render an ordered list of article-card HTML strings: first 6 visible, the rest behind a "show more" toggle.
function more6(cards){
  if(!cards.length) return '';
  const head=cards.slice(0,6), rest=cards.slice(6);
  let out=`<div class="dgrid">${head.join('')}</div>`;
  if(rest.length) out+=moreSummary(rest.length)+`<div class="dgrid" style="margin-top:16px">${rest.join('')}</div></details>`;
  return out;
}
function hotelCardArr(slug){
  const list=(REVS[slug]||[]).slice().sort((a,b)=>b.score-a.score);
  return list.map(h=>{
    const stars=h.star?`<div class="hc-stars">${'★'.repeat(h.star)}</div>`:'';
    const sc=h.score?`<span class="hc-score">${h.score.toFixed(1)}</span>`:'';
    const price=h.price?`<div class="hc-price">${tx('เริ่มประมาณ','From approx.')} <b>${esc(h.price)}</b></div>`:'';
    const bk=(h.agoda?`<a class="hbtn bk1" href="${goB(h.agoda,`city-${slug}`)}" target="_blank" rel="nofollow noopener">Agoda</a>`:'')+(h.booking?`<a class="hbtn bk2" href="${goB(h.booking,`city-${slug}`)}" target="_blank" rel="nofollow noopener">Booking</a>`:'')+(h.trip?`<a class="hbtn bk3" href="${goB(h.trip,`city-${slug}`)}" target="_blank" rel="nofollow noopener">Trip</a>`:'');
    return `<div class="hcard"><div class="hc-img">${h.img?`<img src="${h.img}" alt="${esc(h.name)}" loading="lazy" onerror="this.style.opacity=0">`:''}${sc}</div><div class="hc-body"><div class="hc-name">${esc(h.name)}</div>${stars}<div class="hc-type">${esc(h.type)}</div>${h.loc?`<div class="hc-loc">📍 ${esc(h.loc)}</div>`:''}${price}<a class="hview" href="${h.slug}.html">${tx('ดูรีวิวเต็ม →','Read full review →')}</a>${bk?`<div class="hbtns">${bk}</div>`:''}</div></div>`;
  });
}
function hotelCards(slug){
  const arr=hotelCardArr(slug);
  if(!arr.length) return `<p class="pintro">${tx('รีวิวโรงแรมกำลังจัดทำ — เร็ว ๆ นี้','Hotel reviews coming soon')}</p>`;
  return `<div class="hgrid">`+arr.join('')+`</div>`;
}

// ── province hub (5-tab) ──
function provinceHub(slug, th, r, d){
  const R = REGION[r];
  const nm = NAME(slug);
  const tagline = d.tagline || txf(`เที่ยว${th}`,'Explore {name}',{name:nm});
  const best = d.bestTime || tx('เที่ยวได้ตลอดปี','Good year-round');
  const emoji = d.heroEmoji || R.emoji;
  const heroSrc = fs.existsSync(path.join(PUB,'images/heroes',slug+'.jpg')) ? `/images/heroes/${slug}.jpg`
    : (fs.existsSync(path.join(PUB,'images/cities',slug+'.jpg')) ? `/images/cities/${slug}.jpg` : '');
  const arts = ARTS[slug]||[];
  const wtsArt = arts.find(a=>a.slug==='where-to-stay-'+slug);   // "where to stay" neighborhood guide, if it exists
  const cSee=arts.filter(a=>a.type==='attraction').length, cEat=arts.filter(a=>['food','eat-ranking'].includes(a.type)).length, cPlan=arts.filter(a=>a.type==='itinerary').length, cStay=(REVS[slug]||[]).length;
  const hi=(d.highlights||[]).map(h=>`<div class="hlc"><h3>${esc(h.name)}</h3><p>${esc(h.blurb)}</p></div>`).join('');
  const food=(d.foodScene||[]).map(f=>`<div class="fc"><h4>${esc(f.name)}</h4><p>${esc(f.note)}</p></div>`).join('');
  const arrow=tx(' →',' →');
  const nbrs=(d.neighbors||[]).filter(n=>TH[n]).map(n=>`<a class="nc" href="city-${n}.html">${NAME(n)}${arrow}</a>`).join('');
  const tipsArt=arts.find(a=>/travel-tips$/.test(a.slug)), moveArt=arts.find(a=>/getting-around$/.test(a.slug));
  const J = p => `https://thailandaddict.com${PFX()}${p}`;
  // expert-hub data (FAQ / season / budget) — derived from real data; north = seasonal-haze advisory
  const isNorth = R.slug==='north';
  const bestShort = stripTags(best);
  const dayRec = cPlan>=3 ? tx('2–4 วัน','2–4 days') : tx('2–3 วัน','2–3 days');
  const faqs=[
    {q:txf(`เที่ยว${th}กี่วันดี?`,'How many days do you need in {name}?',{name:nm}),
     a:tx(`ส่วนใหญ่ ${dayRec} กำลังพอดีสำหรับไฮไลต์หลัก ถ้ามีเวลาเพิ่มค่อยต่อไปจังหวัดข้างเคียง`,`Usually ${dayRec} covers the main highlights; with more time, continue to nearby provinces.`)},
    {q:tx(`ไป${th}ช่วงไหนดีที่สุด?`,`When is the best time to visit ${nm}?`),
     a:tx(`${bestShort}${isNorth?' โดยช่วง ก.พ.–เม.ย. อาจมีหมอกควันและฝุ่น PM2.5 สูง ควรเช็กค่าฝุ่นก่อนเดินทาง':''}`,`${bestShort}${isNorth?' Note: Feb–Apr can bring seasonal haze (high PM2.5) — check air quality before you go.':''}`)},
    {q:txf(`เที่ยว${th}ใช้งบเท่าไหร่ต่อวัน?`,'How much does a day in {name} cost?',{name:nm}),
     a:tx('โดยประมาณต่อคน/วัน — สายประหยัด ฿800–1,500 · กลาง ฿1,800–3,500 · สบาย ฿4,500 ขึ้นไป (รวมที่พัก อาหาร และค่าเที่ยว)','Roughly per person/day — budget ฿800–1,500 · mid ฿1,800–3,500 · comfort ฿4,500+ (stay, food and activities).')},
    {q:tx(`พักย่านไหนดีใน${th}?`,`Where should I stay in ${nm}?`),
     a: wtsArt?tx('เรามีคู่มือเลือกย่านที่พักแยกเฉพาะ — เลือกย่านที่ตรงสไตล์ แล้วดูโรงแรมจริงในย่านนั้นได้เลย','We have a dedicated neighborhood guide — pick the area that fits your style, then see real stays there.'):tx('เลือกตามสไตล์การเที่ยว แล้วดูที่พักจัดอันดับและรีวิวจริงได้ในแท็บ "ที่พัก"','Pick by your travel style, then browse ranked stays and real reviews in the "Stays" tab.')},
    {q:tx(`ไป${th}เดินทางยังไง?`,`How do I get to ${nm}?`),
     a: moveArt?tx('ไปได้ทั้งรถทัวร์/รถตู้และรถยนต์ส่วนตัว บางจังหวัดมีสนามบินหรือรถไฟ — อ่านวิธีเดินทางละเอียดในแท็บเตรียมตัว','By intercity bus/van or private car; some provinces also have an airport or train — see the Prep tab for details.'):tx('ไปได้ทั้งรถทัวร์/รถตู้จากกรุงเทพฯ และรถยนต์ส่วนตัว — ดูรายละเอียดในแท็บเตรียมตัว','By intercity bus/van from Bangkok or private car — see the Prep tab.')},
  ];
  const _faq={"@type":"FAQPage","mainEntity":faqs.map(f=>({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))};
  const _org={"@type":"Organization","@id":"https://thailandaddict.com/#org","name":"ThailandAddict","url":"https://thailandaddict.com/","description":tx('เว็บไซต์คู่มือเที่ยวไทย — ที่พัก ที่กิน ที่เที่ยว คัดจากรีวิวจริง','Thailand travel guide — stays, food and sights picked from real reviews.')};
  const _page={"@type":"WebPage","@id":J(`city-${slug}`)+"#webpage","url":J(`city-${slug}`),"name":nm,"about":{"@id":J(`city-${slug}`)+"#place"},"publisher":{"@id":"https://thailandaddict.com/#org"},"inLanguage":LOCALE_MAP[LOC].bcp47,"isAccessibleForFree":true};
  const _bc={"@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},
    {"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')},
    {"@type":"ListItem","position":3,"name":RNAME(r),"item":J(`region-${R.slug}`)},
    {"@type":"ListItem","position":4,"name":nm,"item":J(`city-${slug}`)}]};
  // Place schema (entity for AI answer-engines + Google knowledge graph) — derived from existing data, nothing fabricated.
  const _co=PVCOORDS[slug];
  const _wd=WIKIDATA[slug];
  // containsPlace: this province's notable attractions (individual TouristAttraction articles in this locale; excludes list/roundup slugs) — locale-aware URLs, all real pages.
  const _att=arts.filter(a=>a.type==='attraction'&&!/-attractions$/.test(a.slug)&&a.heroImg).slice(0,6);
  const _place={"@type":["TouristDestination","Place"],"@id":J(`city-${slug}`)+"#place","name":nm,"description":stripTags(tagline),
    "touristType":tx(['นักท่องเที่ยวทั่วไป','สายธรรมชาติ','ครอบครัว','คู่รัก'],['Leisure','Nature','Family','Couples']),
    ...(heroSrc?{"image":"https://thailandaddict.com"+heroSrc}:{}),
    ...(_co?{"geo":{"@type":"GeoCoordinates","latitude":_co.lat,"longitude":_co.lng}}:{}),
    "address":{"@type":"PostalAddress","addressRegion":nm,"addressCountry":"TH"},
    ...(_wd?{"sameAs":_wd.sameAs}:{}),
    ...(_att.length?{"containsPlace":_att.map(a=>({"@type":"TouristAttraction","name":stripTags(a.title),"url":J(a.slug)}))}:{}),
    "url":J(`city-${slug}`),"isPartOf":{"@type":"Place","name":RNAME(r)}};
  const jsonld={"@context":"https://schema.org","@graph":[_org,_page,_bc,_place,_faq]};
  // stats
  const avg = (REVS[slug]||[]).length ? ((REVS[slug].reduce((s,h)=>s+(h.score||0),0))/(REVS[slug].length)).toFixed(1) : '–';
  const prices = (REVS[slug]||[]).map(h=>{const m=String(h.price).match(/[\d,]+/);return m?+m[0].replace(/,/g,''):0;}).filter(Boolean);
  const minP = prices.length ? '฿'+Math.min(...prices).toLocaleString() : '–';
  const hls=d.highlights||[], atts=d.attractions||[], foods=d.foodScene||[];
  const intro=stripTags(d.introHtml)||tx(`คู่มือเที่ยว${th} — ที่พัก ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริงในพื้นที่`,`A ${nm} travel guide — stays, sights, food and itineraries, picked from the real thing on the ground.`);
  const chips=(hls.slice(0,5).map(h=>`<span class="phchip">📍 ${esc(h.name)}</span>`).join(''))||`<span class="phchip">🗓️ ${esc(best.split(' ').slice(0,5).join(' '))}</span>`;
  // intro 4 cards
  const ic=[];
  if(foods[0])ic.push(['ic0','🍜',tx('ของกินเด่น','Signature food'),foods[0].name+' — '+stripTags(foods[0].note).slice(0,46)]);
  if(hls[0])ic.push(['ic1','⭐',tx('ไฮไลต์ห้ามพลาด','Must-see highlight'),hls[0].name+' — '+stripTags(hls[0].blurb).slice(0,46)]);
  const natt=atts.find(a=>a.kind==='nature')||hls[1]; if(natt)ic.push(['ic2','🏞️',tx('ธรรมชาติ/วิวสวย','Nature &amp; views'),natt.name+' — '+stripTags(natt.blurb).slice(0,42)]);
  ic.push(['ic3','✅',tx('เที่ยวง่าย ครบจบ','Easy, all-in-one'),tx('ที่พัก ที่เที่ยว ของกิน แผนเที่ยว รวบไว้ในหน้าเดียว','Stays, sights, food and itineraries — all on one page')]);
  const introCards=ic.map(x=>`<div class="icard ${x[0]}"><div class="ie">${x[1]}</div><h4>${esc(x[2])}</h4><p>${esc(x[3])}</p></div>`).join('');
  // editor picks (top attractions ↔ attraction articles)
  const attArts=arts.filter(a=>a.type==='attraction'&&!/-attractions$/.test(a.slug)&&a.heroImg);
  const kindL=tx({nature:'ธรรมชาติ',city:'เมือง',culture:'วัฒนธรรม'},{nature:'Nature',city:'City',culture:'Culture'});
  const epSrc = atts.length ? atts.slice(0,5) : attArts.slice(0,5).map(a=>({name:stripTags(a.title),blurb:'',kind:'city'}));
  const ep=epSrc.map((a,i)=>{const art=attArts[i]||{};const href=art.slug?`${art.slug}.html`:`city-${slug}.html#see`;const img=art.heroImg||'';const why=a.blurb?`<div class="ep-why">${esc(stripTags(a.blurb).slice(0,80))}</div>`:'';return `<a class="ep-card" href="${href}"><div class="ep-rank">${i+1}</div><div class="ep-img">${img?`<img src="${img}" alt="${esc(a.name)}" loading="lazy" onerror="this.style.opacity=0">`:''}</div><div class="ep-body"><div class="ep-title">${esc(a.name)}</div>${why}<span class="ep-tag">${kindL[a.kind]||tx('ที่เที่ยวแนะนำ','Recommended')}</span></div></a>`;}).join('');
  // hoods
  const hoods=hls.map((h,i)=>`<div class="hood hg${i%6}"><h4>${esc(h.name)}</h4><p>${esc(stripTags(h.blurb).slice(0,64))}</p></div>`).join('');
  // neighbors cards
  const nbCards=(d.neighbors||[]).filter(n=>TH[n]).map(n=>{const nd=readData(n);return provCard(n,NAME(n),(nd&&nd.heroEmoji)||'📍',(nd&&nd.tagline)||txf(`เที่ยว${TH[n]}`,'Explore {name}',{name:NAME(n)}))}).join('');
  const aff=`<div class="affgrid"><div class="affcard"><div class="an"><span class="adot" style="background:#FF2938"></span>Agoda</div><p>${tx('คนไทยใช้เยอะที่สุด · cashback บ่อย · จ่ายเงินไทยได้','Most popular in Thailand · frequent cashback · pay in THB')}</p><a class="b-agoda" href="https://www.agoda.com/?cid=1965862" target="_blank" rel="sponsored nofollow noopener"><span class="bkm r">a</span>${tx('ค้นหาบน Agoda →','Search on Agoda →')}</a></div><div class="affcard"><div class="an"><span class="adot" style="background:#003580"></span>Booking.com</div><p>${tx('ห้องเยอะที่สุด · ยกเลิกได้ส่วนใหญ่ · UI สะอาด','Largest inventory · mostly free cancellation · clean UI')}</p><a class="b-booking" href="/go/b?sid=city-${slug}" target="_blank" rel="sponsored nofollow noopener"><span class="bkm sq">B.</span>${tx('ค้นหาบน Booking →','Search on Booking →')}</a></div><div class="affcard"><div class="an"><span class="adot" style="background:#287DFA"></span>Trip.com</div><p>${tx('ราคาคุ้มในเอเชีย · ดีลบ่อย · สะสมแต้มได้','Great value in Asia · frequent deals · earn points')}</p><a class="b-trip" href="https://www.trip.com/?Allianceid=6861268&SID=312919111" target="_blank" rel="sponsored nofollow noopener"><span class="bkm sq">t</span>${tx('ค้นหาบน Trip.com →','Search on Trip.com →')}</a></div></div>`;
  const tab=(id,emo,label,count)=>`<div class="tab${id==='stay'?' active':''}" data-tab="${id}">${emo} ${label}${count?`<span class="tc">${count}</span>`:''}</div>`;
  // ── expert-hub UI blocks (quick-answer, season, budget, map, klook, FAQ) ──
  const quickAns=`<div class="qabox">
    <div class="qa"><span class="qa-e">🗓️</span><div><b>${tx('ไปเดือนไหนดี','Best months')}</b><p>${esc(bestShort.slice(0,52))}</p></div></div>
    <div class="qa"><span class="qa-e">⏱️</span><div><b>${tx('เที่ยวกี่วัน','How long')}</b><p>${dayRec}</p></div></div>
    <div class="qa"><span class="qa-e">💰</span><div><b>${tx('งบต่อวัน','Budget/day')}</b><p>฿800–4,500+</p></div></div>
    <a class="qa-cta" href="/trip?provinces=${slug}"><b>✨ ${tx('ออกแบบทริปเฉพาะคุณ','Design your trip')}</b><span>${tx('คัดเส้นทางโดยทีม ThailandAddict · เลือกตามความต้องการของคุณ','Curated by the ThailandAddict team · tailored to you')}</span></a></div>`;
  const _seas=[
    [tx('พ.ย.–ก.พ.','Nov–Feb'),'✅',tx('หนาว/แห้ง','Cool & dry'),tx('ช่วงเที่ยวดีที่สุด อากาศเย็น ฟ้าใส','Best season — cool and clear')],
    [tx('มี.ค.–พ.ค.','Mar–May'),'🔆',tx('ร้อน','Hot'),tx('แดดแรง ร้อนช่วงกลางวัน','Hot, strong midday sun')],
    [tx('มิ.ย.–ต.ค.','Jun–Oct'),'🌧️',tx('ฝน','Rainy'),tx('ฝนเป็นช่วง สีเขียวสวย นักท่องเที่ยวน้อย','Lush and green, fewer crowds, passing rain')],
  ];
  const seasonTable=`<div class="seasgrid">`+_seas.map(s=>`<div class="seascard"><div class="seas-mo">${s[1]} ${s[0]}</div><div class="seas-nm">${s[2]}</div><p>${s[3]}</p></div>`).join('')+`</div>`+(isNorth?`<div class="seas-warn">⚠️ ${tx(`${th}อยู่ภาคเหนือ — ช่วง ก.พ.–เม.ย. อาจมีหมอกควันและฝุ่น PM2.5 สูง ควรเช็กค่าฝุ่นก่อนเดินทางและเลี่ยงกิจกรรมกลางแจ้งหนัก ๆ`,`${nm} is in the North — Feb–Apr can bring seasonal haze (high PM2.5). Check air quality before you go and ease up on strenuous outdoor activities.`)}</div>`:'');
  const _bud=[['🎒',tx('สายประหยัด','Budget'),'฿800–1,500'],['🏨',tx('กลาง ๆ','Mid-range'),'฿1,800–3,500'],['✨',tx('สบายกระเป๋า','Comfort'),'฿4,500+']];
  const budgetBox=`<div class="budgrid">`+_bud.map(b=>`<div class="budcard"><div class="bud-e">${b[0]}</div><div class="bud-nm">${b[1]}</div><div class="bud-amt">${b[2]}</div></div>`).join('')+`</div><p class="budnote">${tx('* ประมาณการต่อคน/วัน รวมที่พัก อาหาร และค่าเที่ยว','* Rough estimate per person/day — stay, food and activities')}</p>`;
  const mapBox=_co?`<iframe class="cmap" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=${(_co.lng-0.28).toFixed(3)}%2C${(_co.lat-0.22).toFixed(3)}%2C${(_co.lng+0.28).toFixed(3)}%2C${(_co.lat+0.22).toFixed(3)}&layer=mapnik&marker=${_co.lat}%2C${_co.lng}" title="${esc(nm)} map"></iframe><a class="maplink" href="https://www.google.com/maps/search/?api=1&query=${_co.lat}%2C${_co.lng}" target="_blank" rel="noopener">${tx('เปิดใน Google Maps →','Open in Google Maps →')}</a>`:'';
  const klook=`<a class="klook" href="https://www.klook.com/th/search/?query=${encodeURIComponent(nm)}&aid=121442" target="_blank" rel="nofollow noopener sponsored"><div class="kl-l"><div class="kl-t">${tx(`กิจกรรม ทัวร์ และบัตรเข้าชมใน${th}`,`Activities, tours & tickets in ${nm}`)}</div><p>${tx('ทัวร์รายวัน คุกกิ้งคลาส บัตรเข้าสถานที่ และกิจกรรมกลางแจ้ง — จองล่วงหน้าได้ราคาดีกว่า','Day tours, cooking classes, attraction tickets and outdoor activities — book ahead for better prices')}</p></div><span class="kl-b"><span class="kbadge">klook</span><span>${tx('ดูกิจกรรมทั้งหมด →','Browse all →')}</span></span></a>`;
  // link to our curated activity-roundup guide when it exists (discoverability + internal linking)
  const actArt=(ARTS[slug]||[]).find(a=>a.type==='activity-ranking');
  const actCallout=actArt?`<div class="callout" style="margin-bottom:16px"><div><h3>${tx(`คู่มือกิจกรรมน่าทำใน${th}`,`Best things to do in ${nm}`)}</h3><p>${tx('จัดอันดับ เปรียบเทียบ และรีวิวกิจกรรม/ทัวร์ คัดจากรีวิวจริง พร้อมจุดเด่น-ข้อสังเกตและช่องทางจอง','Ranked, compared and reviewed activities & tours from real reviews — pros, cons and where to book')}</p></div><a href="activities-${slug}.html">${tx('ดูคู่มือกิจกรรม →','See the guide →')}</a></div>`:'';
  // list the actual activity articles (ranking + compares + featured reviews) as cards so visitors can read them
  const _actOrd={'activity-ranking':0,'activity-compare':1,'activity':2};
  const actList=(ARTS[slug]||[]).filter(a=>/^activity/.test(a.type)).sort((a,b)=>(_actOrd[a.type]??9)-(_actOrd[b.type]??9)||a.slug.localeCompare(b.slug));
  const actCards=actList.map(a=>dcardA(a,a.type==='activity-ranking'));
  const _actN=actList.length;
  const actSeeAll=_actN?`<div style="display:flex;justify-content:center;margin:24px 0 0"><a href="activities-${slug}.html" style="display:inline-flex;align-items:center;gap:8px;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:15px;color:#fff;text-decoration:none;padding:14px 30px;border-radius:999px;background:linear-gradient(135deg,var(--bl),var(--bl-dk));box-shadow:0 10px 24px rgba(6,182,212,.32)">${tx(`ดูคู่มือกิจกรรมทั้งหมดใน${th}`,`See all ${nm} activity guides`)} <span style="opacity:.82">(${_actN})</span> →</a></div>`:'';
  const actSection=actCards.length?`<div class="dgrid">${actCards.slice(0,6).join('')}</div>${actSeeAll}${klook}`:`${actCallout}${klook}`;
  const faqHtml=`<div class="faqsec"><div class="sh"><div class="slbl">❓ FAQ</div><h2>${tx(`คำถามที่พบบ่อย — <em>เที่ยว${th}</em>`,`Frequently asked — <em>${nm}</em>`)}</h2></div><div class="faqlist">`+faqs.map(f=>`<details class="faqit"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')+`</div></div>`;
  // ── tab content: show 6 cards (ranked roundups first, then individual articles/reviews) + "show more" ──
  // reset page-scoped image de-dup (attraction scenery preferred for the fallback pool)
  PAGE_USED=new Set(); PAGE_POOL=imgPool(slug,true); PAGE_PI=0;
  // STAY: roundups (Top-N from the roundups collection) first; fill to 6 with individual hotel reviews.
  const _rnd=(RNDS[slug]||[]).map(rndCard);
  const _hot=hotelCardArr(slug);
  const _fill=Math.max(0,6-Math.min(_rnd.length,6));
  const _visRnd=_rnd.slice(0,6), _visHot=_hot.slice(0,_fill);
  const _restRnd=_rnd.slice(6), _restHot=_hot.slice(_fill);
  const _restCount=_restRnd.length+_restHot.length;
  let stayContent = (_visRnd.length?`<div class="dgrid">${_visRnd.join('')}</div>`:'')
    + (_visHot.length?`<div class="hgrid"${_visRnd.length?' style="margin-top:16px"':''}>${_visHot.join('')}</div>`:'');
  if(!_visRnd.length && !_visHot.length) stayContent=`<p class="pintro">${tx('รีวิวโรงแรมกำลังจัดทำ — เร็ว ๆ นี้','Hotel reviews coming soon')}</p>`;
  else if(_restCount) stayContent+=moreSummary(_restCount,tx(`ดูที่พักเพิ่มเติม (${_restCount}) →`,`Show ${_restCount} more stays →`))
    +(_restRnd.length?`<div class="dgrid" style="margin-top:16px">${_restRnd.join('')}</div>`:'')
    +(_restHot.length?`<div class="hgrid" style="margin-top:16px">${_restHot.join('')}</div>`:'')+`</details>`;
  // SEE: attraction roundups (slug has "attractions") first, then individual attraction articles.
  const _seeAll=(ARTS[slug]||[]).filter(a=>a.type==='attraction');
  const _seeRnd=_seeAll.filter(a=>a.slug.includes('attractions')||/^top\d/.test(a.slug));
  const _seeInd=_seeAll.filter(a=>!_seeRnd.includes(a));
  const seeContent=more6([..._seeRnd.map(a=>dcardA(a,true)),..._seeInd.map(a=>dcardA(a,false))])||`<p class="pintro">${tx('บทความที่เที่ยวกำลังจัดทำ','Attraction articles coming soon')}</p>`;
  // EAT: food roundups (type eat-ranking) first, then individual food articles.
  const _eatAll=(ARTS[slug]||[]).filter(a=>['food','eat-ranking'].includes(a.type));
  const _eatRnd=_eatAll.filter(a=>a.type==='eat-ranking'||/^top\d/.test(a.slug));
  const _eatInd=_eatAll.filter(a=>!_eatRnd.includes(a));
  const eatContent=more6([..._eatRnd.map(a=>dcardA(a,true)),..._eatInd.map(a=>dcardA(a,false))])||`<p class="pintro">${tx('บทความที่กินกำลังจัดทำ','Food articles coming soon')}</p>`;
  const body=`
${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:RNAME(r),href:`region-${R.slug}.html`},{t:nm}])}
<div class="phero">${heroSrc?`<img src="${heroSrc}" alt="${esc(nm)}" loading="eager" onerror="this.style.opacity=0">`:''}
  <div class="pherobody"><span class="pheye">${emoji} ${RNAME(r)}</span><h1>${txf(`เที่ยว<em>${th}</em>`,'Explore <em>{name}</em>',{name:nm})}</h1><p class="phlead">${esc(tagline)}</p>
  <div class="phchips">${chips}</div></div>
</div>
<div class="cstats"><div class="cstat"><div class="n">${cStay}</div><div class="l">${tx('รีวิวที่พัก','Stays reviewed')}</div></div><div class="cstat"><div class="n">${arts.length}</div><div class="l">${tx('บทความเที่ยว','Travel articles')}</div></div><div class="cstat"><div class="n">${avg}</div><div class="l">${tx('คะแนนเฉลี่ย','Avg score')}</div></div><div class="cstat"><div class="n">${minP}</div><div class="l">${tx('ราคาเริ่มต้น/คืน','From /night')}</div></div></div>
<div class="updatepill"><span>${tx(`📅 อัปเดต 2026 · เรียบเรียงโดยทีม ThailandAddict · ${cStay} รีวิวจริง · ไม่มีโฆษณาแฝง`,`📅 Updated 2026 · curated by the ThailandAddict team · ${cStay} real reviews · no hidden ads`)}</span></div>
${quickAns}
<div class="section"><div class="introgrid"><div><div class="slbl">${txf(`ทำไมต้องไป${th}`,'Why visit {name}',{name:nm})}</div><h2>${txf(`เที่ยว${th} <em>ให้ครบในที่เดียว</em>`,'{name} <em>— all in one place</em>',{name:nm})}</h2><p class="ssub">${esc(intro.slice(0,280))}</p><a class="introbtn" href="top10-hotels-${slug}.html">${tx('เริ่มจากที่พัก →','Start with stays →')}</a></div><div class="icards">${introCards}</div></div></div>
${ep?`<div class="section"><div class="sh"><div class="slbl">⭐ Editor's Picks</div><h2>${tx('แนะนำที่เที่ยว<em>ที่น่าสนใจ</em>','Standout <em>things to do</em>')}</h2><p>${tx(`ประสบการณ์เด่นของ${th} — มาทริปแรกห้ามพลาด`,`The best of ${nm} — don't miss these on a first trip`)}</p></div><div class="ep-grid">${ep}</div></div>`:''}
${hoodGuides(slug)?`<div class="section"><div class="sh"><div class="slbl">🏘️ ${tx('พักย่านไหน','Where to stay by area')}</div><h2>${tx(`ย่านน่าพักใน<em>${th}</em>`,`<em>${nm}</em> <em>by neighborhood</em>`)}</h2><p>${tx('แต่ละย่านมีหน้าโรงแรมแนะนำแยกเฉพาะ — เลือกย่านที่ใช่ แล้วดูที่พักจริงในย่านนั้น','Each area has its own hotel guide — pick the area that fits, then see real stays there')}</p></div>${hoodGuides(slug)}</div>`:''}${nearGuides(slug)?`<div class="section"><div class="sh"><div class="slbl">🏥 ${tx('โรงแรมใกล้โรงพยาบาล/แลนด์มาร์ก','Hotels near hospitals & landmarks')}</div><h2>${tx(`พักใกล้<em>จุดหมายเฉพาะใน${th}</em>`,`Stay near a <em>specific landmark</em>`)}</h2><p>${tx('โรงแรมใกล้โรงพยาบาล ศูนย์ประชุม และสนามบิน — แต่ละการ์ดบอกระยะเดิน-รถถึงจุดหมายจริง เหมาะกับญาติผู้ป่วย คนมาประชุม และคนต่อเครื่อง','Hotels by the big hospitals, convention centres and airports — each card shows the real distance to the landmark, made for patient families, event-goers and travellers with early flights')}</p></div>${nearGuides(slug)}</div>`:''}
<div class="section" style="padding-bottom:0"><div class="sh"><div class="slbl">${tx('บทความที่เราเขียน','Our articles')}</div><h2>${tx('เลือกอ่าน<em>สิ่งที่คุณสนใจ</em>','Read <em>what interests you</em>')}</h2><p>${tx('เลือกแท็บเพื่อดูที่พัก ที่เที่ยว ที่กิน แผนเที่ยว และการเตรียมตัว','Pick a tab for stays, sights, food, itineraries and prep')}</p></div></div>
<div class="tabwrap"><div class="tabbar">
  ${tab('stay','🏨',tx('ที่พัก','Stays'),cStay)}${tab('see','📍',tx('ที่เที่ยว','See'),cSee)}${tab('eat','🍜',tx('ที่กิน','Eat'),cEat)}${tab('plan','🗺️',tx('แผนเที่ยว','Plan'),cPlan)}${tab('prep','🎒',tx('เตรียมตัว','Prep'),0)}
</div></div>
<div class="cwrap">
<section class="panel active" id="p-stay">
  <p class="pintro">${tx(`รีวิวที่พัก${th} คัดจากเสียงรีวิวจริง — บอกตรงทั้งข้อดีข้อเสีย พร้อมช่วงราคาและลิงก์จอง`,`${nm} stays picked from real reviews — honest about the good and the bad, with price ranges and booking links`)}</p>
  ${stayContent}
  <div class="callout" style="margin-top:38px"><div><h3>${tx(`Top 10 โรงแรม${th}`,`Top 10 ${nm} Hotels`)}${hasRoundup(slug)?'':` <span style="font-size:12px;color:#c2410c">${tx('· กำลังจัดทำ','· coming soon')}</span>`}</h3><p>${tx('รีวิวรวมจัดอันดับ + รีวิวแยกรายโรงแรม เทียบราคา Agoda · Booking · Trip.com','A ranked roundup plus per-hotel reviews, with prices compared across Agoda · Booking · Trip.com')}</p></div><a href="top10-hotels-${slug}.html">${tx('ดูอันดับที่พัก →','See the ranking →')}</a></div>
  ${wtsArt?`<div class="callout" style="background:linear-gradient(135deg,#fff5f7,#ecfeff)"><div><h3>${tx(`พักย่านไหนดีใน${th}?`,`Where to stay in ${nm}?`)}</h3><p>${tx('เทียบย่านที่พักยอดนิยม เลือกตามสไตล์ ก่อนจองโรงแรม','Compare the top neighborhoods and pick by your travel style before you book')}</p></div><a href="${wtsArt.slug}.html">${tx('ดูย่านที่พัก →','See the areas →')}</a></div>`:''}
</section>
<section class="panel" id="p-see"><h2 class="pnhead">${tx(`ที่เที่ยว<em> ${th}</em>`,`Things to do<em> in ${nm}</em>`)}</h2><p class="pintro">${tx(`ไฮไลต์และที่เที่ยว${th} ทั้งสายธรรมชาติ เมือง และวัฒนธรรม`,`Highlights and sights around ${nm} — nature, city and culture`)}</p>${seeContent}${hi?`<h2 class="pnhead" style="margin-top:38px">${tx('ไฮไลต์<em>ที่ต้องไป</em>','<em>Top highlights</em>')}</h2><div class="hl">${hi}</div>`:''}</section>
<section class="panel" id="p-eat"><h2 class="pnhead">${tx(`ที่กิน<em> ${th}</em>`,`Where to eat<em> in ${nm}</em>`)}</h2><p class="pintro">${tx(`ของกินเด่นของ${th} — รวมและจัดอันดับร้านจริงที่คนพื้นที่ไป`,`${nm}'s signature food — real local spots, rounded up and ranked`)}</p>${eatContent}${food?`<h2 class="pnhead" style="margin-top:38px">${tx('<em>ของกินเด่น</em>ประจำเมือง','<em>Signature dishes</em>')}</h2><div class="foodgrid">${food}</div>`:''}</section>
<section class="panel" id="p-plan"><h2 class="pnhead">${tx(`แผน<em>เที่ยว ${th}</em>`,`<em>${nm}</em> itineraries`)}</h2><p class="pintro">${tx('แผนเที่ยวคัดมาให้ ตั้งแต่ไปเช้าเย็นกลับ 2-3 วัน ถึงแผนข้ามจังหวัดข้างเคียง','Ready-made plans — from a day trip to 2–3 days, plus routes to neighbouring provinces')}</p>${artCards(slug,['itinerary'])||`<p class="pintro">${tx('แผนเที่ยวกำลังจัดทำ','Itineraries coming soon')}</p>`}</section>
<section class="panel" id="p-prep"><h2 class="pnhead">${tx(`เตรียมตัว<em>เที่ยว ${th}</em>`,`Planning <em>your ${nm} trip</em>`)}</h2><p class="pintro">${tx(`ช่วงเวลาที่เหมาะ การเดินทาง และสิ่งที่ควรรู้ก่อนไป${th}`,`Best time to go, getting around, and what to know before visiting ${nm}`)}</p>
  <div class="eeat"><div class="ecard"><div class="ic">🗓️</div><h3>${tx('ช่วงเวลาแนะนำ','Best time')}</h3><p>${esc(best)}</p></div><div class="ecard"><div class="ic">🚗</div><h3>${tx('การเดินทาง','Getting around')}</h3><p>${moveArt?tx(`อ่านวิธีเดินทางใน${th}แบบละเอียด · <a href="${moveArt.slug}.html" style="color:var(--bl-dk);font-weight:700">เปิดคู่มือ →</a>`,`A detailed guide to getting around ${nm} · <a href="${moveArt.slug}.html" style="color:var(--bl-dk);font-weight:700">Open guide →</a>`):tx(`วิธีไป${th}และเดินทางในจังหวัด`,`How to reach ${nm} and get around`)}</p></div><div class="ecard"><div class="ic">📍</div><h3>${tx('ภาค','Region')}</h3><p>${RNAME(r)} · <a href="region-${R.slug}.html" style="color:var(--bl-dk);font-weight:700">${tx(`เที่ยว${R.th} →`,`Explore ${RNAME(r)} →`)}</a></p></div><div class="ecard"><div class="ic">🎒</div><h3>${tx('เตรียมตัว','Prep')}</h3><p>${tipsArt?tx(`เช็กลิสต์เตรียมตัว · <a href="${tipsArt.slug}.html" style="color:var(--bl-dk);font-weight:700">อ่านทิป →</a>`,`A prep checklist · <a href="${tipsArt.slug}.html" style="color:var(--bl-dk);font-weight:700">Read tips →</a>`):tx(`สิ่งที่ควรเตรียมไป${th}`,`What to pack for ${nm}`)}</p></div></div>
  <h2 class="pnhead" style="margin-top:34px">${tx('ช่วงเวลา<em>ที่เหมาะ</em>','Best <em>time to go</em>')}</h2>${seasonTable}
  <h2 class="pnhead" style="margin-top:34px">${tx('งบ<em>ต่อวันโดยประมาณ</em>','<em>Daily budget</em>')}</h2>${budgetBox}
  ${artCards(slug,['prep','guide'],/^(where-to-stay|hotels-near)-/)?`<h2 class="pnhead" style="margin-top:34px">${tx('คู่มือ<em>เตรียมตัว</em>','Prep <em>guides</em>')}</h2>${artCards(slug,['prep','guide'],/^(where-to-stay|hotels-near)-/)}`:''}</section>
</div>
${mapBox?`<div class="section"><div class="sh"><div class="slbl">🗺️ ${tx('แผนที่','Map')}</div><h2>${tx(`<em>${th}</em> อยู่ตรงไหน`,`Where is <em>${nm}</em>`)}</h2><p>${tx('ดูทำเลคร่าว ๆ ก่อนวางแผนเส้นทาง','Get your bearings before planning routes')}</p></div>${mapBox}</div>`:''}
<div class="section"><div class="sh"><div class="slbl">🎟️ ${tx('กิจกรรม & ทัวร์','Activities & tours')}</div><h2>${tx(`ทำอะไรดีใน<em>${th}</em>`,`Things to <em>do in ${nm}</em>`)}</h2></div>${actSection}</div>
${hoods?`<div class="section"><div class="sh"><div class="slbl">${tx('ไฮไลต์ยอดนิยม','Top highlights')}</div><h2>${tx(`ที่ต้องไปให้ครบใน<em>${th}</em>`,`Don't-miss spots in <em>${nm}</em>`)}</h2></div><div class="hoodgrid">${hoods}</div></div>`:''}
<div class="section"><div class="sh"><div class="slbl">${tx('🔎 ค้นหาเอง','🔎 Search yourself')}</div><h2>${tx('ไม่เห็นที่ใช่? <em>ค้นเองได้ทั้ง 3 เว็บ</em>','Nothing quite right? <em>Search all 3 sites</em>')}</h2><p>${tx(`เทียบราคาที่พัก${th}เองทั้ง Agoda · Booking · Trip.com`,`Compare ${nm} stays yourself across Agoda · Booking · Trip.com`)}</p></div>${aff}</div>
${nbCards?`<div class="section"><div class="sh"><div class="slbl">${tx('📍 เที่ยวต่อ','📍 Keep exploring')}</div><h2>${tx(`ถ้าชอบ${th} <em>ลองจังหวัดข้างเคียง</em>`,`If you like ${nm}, <em>try a nearby province</em>`)}</h2></div><div class="dgrid">${nbCards}</div></div>`:''}
${faqHtml}
<div class="seo"><div class="seobox"><h2>${tx(`เกี่ยวกับ — เที่ยว${th}`,`About — ${nm}`)}</h2>${d.introHtml||tx(`<p>คู่มือเที่ยว${th} ครบทั้งที่พัก ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริงในพื้นที่</p>`,`<p>A complete ${nm} guide — stays, sights, food and itineraries, picked from the real thing on the ground.</p>`)}<p><b>${tx('ช่วงเวลาแนะนำ:','Best time:')}</b> ${esc(best)}</p></div></div>
<div class="cta-sec"><div class="ctaband"><h2>${tx(`วางแผนเที่ยว${th}`,`Plan your ${nm} trip`)}</h2><p>${tx('ที่พัก ที่เที่ยว ของกิน และแผนเดินทาง — รวบไว้ให้แล้ว','Stays, sights, food and routes — all gathered for you')}</p><a href="top10-hotels-${slug}.html">${tx('เริ่มจากที่พัก →','Start with stays →')}</a></div></div>`;
  const extraJS=`<script>(function(){var tabs=[].slice.call(document.querySelectorAll('.tab')),panels=[].slice.call(document.querySelectorAll('.panel'));function act(id,scroll){tabs.forEach(function(t){t.classList.toggle('active',t.dataset.tab===id)});panels.forEach(function(p){p.classList.toggle('active',p.id==='p-'+id)});if(scroll){var w=document.querySelector('.tabwrap');if(w)window.scrollTo({top:w.offsetTop-64,behavior:'smooth'})}}tabs.forEach(function(t){t.addEventListener('click',function(){act(t.dataset.tab,false);history.replaceState(null,'','#'+t.dataset.tab)})});var m={hotels:'stay',stay:'stay',see:'see',eat:'eat',plan:'plan',prep:'prep'},h=(location.hash||'').replace('#','');if(m[h])act(m[h],true);})();</script>`;
  return page({title:tx(`เที่ยว${th} — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict ชีวิตติดเที่ยว`,`${nm} Travel Guide — Hotels, Things to Do, Food & Itineraries | ThailandAddict`),desc:tx(`คู่มือเที่ยว${th} — รีวิวที่พักจัดอันดับ ที่กิน ที่เที่ยว และแผนเที่ยว คัดจากของจริงในพื้นที่ พร้อมเทียบราคาที่พัก`,`A ${nm} travel guide — ranked hotel reviews, food, things to do and itineraries, picked from the real thing, with prices compared.`),slug:`city-${slug}`,jsonld,body,extraJS,image:heroSrc});
}

// ── per-ย่าน standalone hub: a city-hub-style page scoped to one Bangkok neighbourhood ──
// Stay tab = the researched hotels (Agoda search per hotel) + link to the full where-to-stay guide;
// Eat/See tabs are placeholders ready to fill with per-area food/attraction content later.
const HOODDATA = path.join(ROOT, '_internal/neighborhood-data');
const HOODEXTRA = path.join(ROOT, '_internal/hood-extra');  // researched highlights[] + food[] per ย่าน
function bkkHoodList(){ try{ return fs.readdirSync(HOODDATA).filter(f=>/^bangkok__.+\.json$/.test(f)).map(f=>f.slice('bangkok__'.length,-5)); }catch{ return []; } }
function hoodHub(hood){
  const wts=`where-to-stay-bangkok-${hood}`;
  let d; try{ d=JSON.parse(fs.readFileSync(path.join(HOODDATA,`bangkok__${hood}.json`),'utf8')); }catch{ return null; }
  const en=LOC!=='th';
  const c=HOOD_CARDS[wts]||[99,'📍',d.hoodTh||hood,d.hoodEn||hood,'',''];
  const nm=(en?c[3]:c[2])||d.hoodEn||d.hoodTh||hood, cap=(en?c[5]:c[4])||'', emoji=c[1]||'📍';
  const art=(ARTS['bangkok']||[]).find(a=>a.slug===wts);
  const heroSrc=(art&&art.heroImg)||imgUrl('/images/heroes/bangkok.jpg');
  const intro=(en?d.introEn:d.introTh)||'', quick=(en?d.quickEn:d.quickTh)||'';
  const hotels=Array.isArray(d.hotels)?d.hotels:[];
  let ex={}; try{ ex=JSON.parse(fs.readFileSync(path.join(HOODEXTRA,`bangkok__${hood}.json`),'utf8')); }catch{}
  const highlights=Array.isArray(ex.highlights)?ex.highlights:[], foods=Array.isArray(ex.food)?ex.food:[];
  const prices=hotels.map(h=>{const m=String(h.priceFromTHB||'').match(/[\d,]+/);return m?+m[0].replace(/,/g,''):0;}).filter(Boolean);
  const minP=prices.length?'฿'+Math.min(...prices).toLocaleString():'–';
  const agoda=(name)=>`https://www.agoda.com/search?cid=1965862&q=${encodeURIComponent(name+' Bangkok')}`;
  const J=p=>`https://thailandaddict.com${PFX()}${p}`;
  const _bc={"@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},
    {"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')},
    {"@type":"ListItem","position":3,"name":tx('กรุงเทพมหานคร','Bangkok'),"item":J('city-bangkok')},
    {"@type":"ListItem","position":4,"name":nm,"item":J(`area-bangkok-${hood}`)}]};
  const _place={"@type":"Place","@id":J(`area-bangkok-${hood}`)+"#place","name":`${nm}, Bangkok`,"description":stripTags(intro||cap),
    ...(heroSrc?{"image":/^https?:/.test(heroSrc)?heroSrc:'https://thailandaddict.com'+heroSrc}:{}),
    "address":{"@type":"PostalAddress","addressLocality":"Bangkok","addressCountry":"TH"},
    "url":J(`area-bangkok-${hood}`),"isPartOf":{"@type":"Place","name":tx('กรุงเทพมหานคร','Bangkok')}};
  const jsonld={"@context":"https://schema.org","@graph":[_bc,_place]};
  const stars=(n)=>'★'.repeat(Math.max(0,Math.min(5,Math.round(+n||0))));
  const hotelList=hotels.map((h,i)=>{const bf=en?h.bestForEn:h.bestForTh, why=(en?h.whyEn:h.whyTh)||'';
    return `<div class="hl-row"><div class="hl-rank">${i+1}</div><div class="hl-main"><div class="hl-top"><h3>${esc(h.name)}</h3><span class="hl-star">${stars(h.star)}</span></div>${bf?`<div class="hl-bf">${esc(bf)}</div>`:''}<p>${esc(why)}</p></div><div class="hl-side">${h.priceFromTHB?`<div class="hl-price"><small>${tx('เริ่มต้น','from')}</small>฿${esc(String(h.priceFromTHB))}</div>`:''}<a class="hl-book" href="${agoda(h.name)}" target="_blank" rel="sponsored nofollow noopener">${tx('เช็คราคา →','Check price →')}</a></div></div>`;}).join('');
  const tab=(id,emo,label,count,active)=>`<div class="tab${active?' active':''}" data-tab="${id}">${emo} ${label}${count?`<span class="tc">${count}</span>`:''}</div>`;
  const qa=quick?stripTags(quick).replace(/^[^:：]*[:：]\s*/,''):'';
  // intro icards (4) — mirror the city hub
  const f0=foods[0], h0=highlights[0];
  const ic=[
    ['ic0','🍜',tx('ของกินเด่น','Signature food'), f0?((en?f0.nameEn:f0.nameTh)+' — '+stripTags(en?f0.noteEn:f0.noteTh).slice(0,40)):tx('ร้านเด็ดประจำย่าน — กำลังเพิ่ม','local eats — coming soon')],
    ['ic1','⭐',tx('ไฮไลต์ห้ามพลาด','Must-see highlight'), h0?((en?h0.nameEn:h0.nameTh)+' — '+stripTags(en?h0.blurbEn:h0.blurbTh).slice(0,40)):tx('จุดเด่นประจำย่าน — กำลังเพิ่ม','area highlights — coming soon')],
    ['ic2','🏨',tx('ที่พักทุกงบ','Stays for every budget'), hotels.length?tx(`${hotels.length} ที่พัก เริ่ม ${minP}/คืน`,`${hotels.length} stays from ${minP}/night`):tx('กำลังคัดที่พัก — รีวิวตามมา','curating stays — reviews soon')],
    ['ic3','✅',tx('เที่ยวง่าย ครบจบ','Easy, all-in-one'), tx('ที่พัก ที่เที่ยว ของกิน รวบไว้ในหน้าเดียว','Stays, sights and food — all on one page')],
  ];
  const introCards=ic.map(x=>`<div class="icard ${x[0]}"><div class="ie">${x[1]}</div><h4>${esc(x[2])}</h4><p>${esc(x[3])}</p></div>`).join('');
  const ep=highlights.slice(0,6).map((h,i)=>`<a class="ep-card" href="#p-see"><div class="ep-rank">${i+1}</div><div class="ep-img"></div><div class="ep-body"><div class="ep-title">${esc(en?h.nameEn:h.nameTh)}</div><div class="ep-why">${esc(stripTags(en?h.blurbEn:h.blurbTh).slice(0,80))}</div><span class="ep-tag">${tx('ไฮไลต์','Highlight')}</span></div></a>`).join('');
  const hgHl=highlights.map((h,i)=>`<div class="hood hg${i%6}"><h4>${esc(en?h.nameEn:h.nameTh)}</h4><p>${esc(en?h.blurbEn:h.blurbTh)}</p></div>`).join('');
  const fgFood=foods.map(f=>`<div class="fc"><h4>${esc(en?f.nameEn:f.nameTh)}</h4><p>${esc(en?f.noteEn:f.noteTh)}</p></div>`).join('');
  const aff=`<div class="affgrid"><div class="affcard"><div class="an"><span class="adot" style="background:#FF2938"></span>Agoda</div><p>${tx('คนไทยใช้เยอะ · จ่ายเงินบาทได้','Popular in Thailand · pay in THB')}</p><a class="b-agoda" href="${agoda(nm)}" target="_blank" rel="sponsored nofollow noopener"><span class="bkm r">a</span>${tx('ค้นบน Agoda →','Search Agoda →')}</a></div><div class="affcard"><div class="an"><span class="adot" style="background:#003580"></span>Booking.com</div><p>${tx('ห้องเยอะ · ยกเลิกได้บ่อย','Huge inventory · free cancel')}</p><a class="b-booking" href="/go/b?u=${encodeURIComponent('https://www.booking.com/searchresults.html?ss='+encodeURIComponent(nm+' Bangkok'))}&sid=area-${hood}" target="_blank" rel="sponsored nofollow noopener"><span class="bkm sq">B.</span>${tx('ค้นบน Booking →','Search Booking →')}</a></div><div class="affcard"><div class="an"><span class="adot" style="background:#287DFA"></span>Trip.com</div><p>${tx('ราคาดีในเอเชีย · ดีลบ่อย','Great Asia rates · frequent deals')}</p><a class="b-trip" href="https://www.trip.com/?Allianceid=6861268&SID=312919111" target="_blank" rel="sponsored nofollow noopener"><span class="bkm sq">t</span>${tx('ค้นบน Trip →','Search Trip →')}</a></div></div>`;
  // Phase-1 cross-link: "hotels near <anchor>" overlays whose zone is THIS ย่าน (e.g. Sukhumvit → Bumrungrad/MedPark/QSNCC).
  const nearList=OVERLAYS.filter(o=>o.zoneSlug===hood);
  const nearHere=nearList.map(o=>{const a=(ARTS['bangkok']||[]).find(x=>x.slug===o.slug);const img=(a&&a.heroImg)||'';const anm=en?o.anchorShortEn:o.anchorShortTh;const sub=en?o.anchorEn:o.anchorTh;return `<a class="hcc" href="${o.slug}.html">${img?`<img src="${img}" alt="${esc(anm)}" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="hcc-cap"><span class="hcc-e">${GROUP_EMOJI[o.group]||'📍'}</span><b>${esc(anm)}</b><i>${esc(sub)}</i></span></a>`;}).join('');
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:tx('กรุงเทพฯ','Bangkok'),href:'city-bangkok.html'},{t:nm}])}
<div class="phero">${heroSrc?`<img src="${heroSrc}" alt="${esc(nm)}" loading="eager" onerror="this.style.opacity=0">`:''}
  <div class="pherobody"><span class="pheye">${emoji} ${tx('ย่านในกรุงเทพฯ','A Bangkok neighbourhood')}</span><h1>${tx(`พักย่าน<em>${nm}</em>`,`Stay in <em>${nm}</em>`)}</h1><p class="phlead">${esc(cap||intro.slice(0,120))}</p>
  <div class="phchips">${highlights.slice(0,5).map(h=>`<span class="phchip">📍 ${esc(en?h.nameEn:h.nameTh)}</span>`).join('')||`<span class="phchip">📍 ${tx('กรุงเทพฯ','Bangkok')}</span>`}</div></div>
</div>
<div class="cstats"><div class="cstat"><div class="n">${hotels.length}</div><div class="l">${tx('ที่พักแนะนำ','stays')}</div></div><div class="cstat"><div class="n">${highlights.length}</div><div class="l">${tx('ไฮไลท์','highlights')}</div></div><div class="cstat"><div class="n">${foods.length}</div><div class="l">${tx('ของกินเด่น','signature eats')}</div></div><div class="cstat"><div class="n">${minP}</div><div class="l">${tx('เริ่มต้น/คืน','from /night')}</div></div></div>
<div class="updatepill"><span>${tx('📅 อัปเดต 2026 · เรียบเรียงโดยทีม ThailandAddict · ของจริงทั้งหมด · ไม่มีโฆษณาแฝง','📅 Updated 2026 · curated by the ThailandAddict team · all real · no hidden ads')}</span></div>
${qa?`<div class="section" style="padding-bottom:0"><div class="quickbox"><b>${tx('สั้น ๆ','In short')}:</b> ${esc(qa)}</div></div>`:''}
<div class="section"><div class="introgrid"><div><div class="slbl">${tx(`ทำไมต้องมาย่าน${nm}`,`Why ${nm}`)}</div><h2>${tx(`พัก·กิน·เที่ยว ย่าน${nm} <em>ให้ครบในที่เดียว</em>`,`${nm} <em>— all in one place</em>`)}</h2><p class="ssub">${esc(intro.slice(0,280))}</p><a class="introbtn" href="${wts}.html">${tx('เริ่มจากที่พัก →','Start with stays →')}</a></div><div class="icards">${introCards}</div></div></div>
${ep?`<div class="section"><div class="sh"><div class="slbl">⭐ ${tx('ไฮไลต์ห้ามพลาด','Top picks')}</div><h2>${tx(`ห้ามพลาดใน<em>ย่าน${nm}</em>`,`Top spots in <em>${nm}</em>`)}</h2><p>${tx('จุดที่นักท่องเที่ยวไทยและต่างชาตินิยมมาย่านนี้','The spots Thai and international visitors love here')}</p></div><div class="ep-grid">${ep}</div></div>`:''}
<div class="section" style="padding-bottom:0"><div class="sh"><div class="slbl">${tx('คู่มือย่าน','Area guide')}</div><h2>${tx('เลือกอ่าน<em>สิ่งที่คุณสนใจ</em>','Read <em>what interests you</em>')}</h2><p>${tx('เลือกแท็บดู ที่พัก · ที่เที่ยว · ที่กิน · แผนเที่ยว · การเดินทาง','Pick a tab for stays, sights, food, plans and getting around')}</p></div></div>
<div class="tabwrap"><div class="tabbar">${tab('stay','🏨',tx('ที่พัก','Stays'),hotels.length,true)}${tab('see','📍',tx('ที่เที่ยว','See'),highlights.length,false)}${tab('eat','🍜',tx('ที่กิน','Eat'),foods.length,false)}${tab('plan','🗺️',tx('แผนเที่ยว','Plan'),0,false)}${tab('prep','🎒',tx('เดินทาง','Around'),0,false)}</div></div>
<div class="cwrap">
<section class="panel active" id="p-stay"><h2 class="pnhead">${tx(`ที่พักย่าน<em>${nm}</em>`,`Where to stay in <em>${nm}</em>`)}</h2>
  ${hotels.length?`<div class="callout"><div><h3>${tx(`คู่มือที่พักย่าน${nm} ฉบับเต็ม`,`Full ${nm} hotel guide`)}</h3><p>${tx('รีวิวแยกรายโรงแรม เทียบราคา และ FAQ','Per-hotel detail, price comparison and FAQ')}</p></div><a href="${wts}.html">${tx('อ่านฉบับเต็ม →','Read the full guide →')}</a></div><div class="hl-list">${hotelList}</div>`:`<p class="pintro">${tx('กำลังคัดที่พักย่านนี้ — รีวิวจะตามมาเรื่อย ๆ','Curating stays for this area — reviews coming soon')}</p><div class="callout"><div><h3>${tx('ระหว่างนี้','Meanwhile')}</h3><p>${tx('ดูที่พักทั่วกรุงเทพ','Browse stays across Bangkok')}</p></div><a href="city-bangkok.html">${tx('ที่พักกรุงเทพ →','Bangkok stays →')}</a></div>`}
</section>
<section class="panel" id="p-see"><h2 class="pnhead">${tx(`ที่เที่ยวย่าน<em>${nm}</em>`,`Things to do in <em>${nm}</em>`)}</h2><p class="pintro">${tx('ไฮไลต์ แลนด์มาร์ก และจุดเด่นที่นักท่องเที่ยวนิยมในย่านนี้','Highlights and spots visitors love in this area')}</p>${hgHl?`<div class="hoodgrid">${hgHl}</div>`:`<p class="pintro">${tx('ที่เที่ยวย่านนี้กำลังเพิ่ม','Sights coming soon')}</p>`}</section>
<section class="panel" id="p-eat"><h2 class="pnhead">${tx(`ที่กินย่าน<em>${nm}</em>`,`Where to eat in <em>${nm}</em>`)}</h2><p class="pintro">${tx('ร้านเด็ดและของกินที่ย่านนี้ขึ้นชื่อ','The dishes and spots this area is known for')}</p>${fgFood?`<div class="foodgrid">${fgFood}</div>`:`<p class="pintro">${tx('ที่กินย่านนี้กำลังเพิ่ม','Food picks coming soon')}</p>`}</section>
<section class="panel" id="p-plan"><h2 class="pnhead">${tx(`แผนเที่ยวย่าน<em>${nm}</em>`,`<em>${nm}</em> itineraries`)}</h2><p class="pintro">${tx('แผนเดินเที่ยวย่านนี้แบบครึ่งวัน-เต็มวัน กำลังจัดทำ — รีวิวจะตามมา','Half-day and full-day routes for this area are in the works — coming soon')}</p><div class="callout"><div><h3>${tx('ระหว่างนี้','Meanwhile')}</h3><p>${tx('ดูแผนเที่ยวกรุงเทพ','See Bangkok itineraries')}</p></div><a href="city-bangkok.html">${tx('แผนเที่ยวกรุงเทพ →','Bangkok plans →')}</a></div></section>
<section class="panel" id="p-prep"><h2 class="pnhead">${tx(`เดินทาง<em>ย่าน${nm}</em>`,`Getting around <em>${nm}</em>`)}</h2><p class="pintro">${esc(cap||tx('การเดินทางและสิ่งที่ควรรู้ของย่านนี้','How to get around this area'))}</p><div class="eeat"><div class="ecard"><div class="ic">🚇</div><h3>${tx('การเดินทาง','Getting around')}</h3><p>${tx('วิธีเดินทางในกรุงเทพแบบละเอียด','A full guide to getting around Bangkok')} · <a href="getting-around-thailand.html" style="color:var(--bl-dk);font-weight:700">${tx('เปิดคู่มือ →','Open →')}</a></p></div><div class="ecard"><div class="ic">📍</div><h3>${tx('ทำเล','Location')}</h3><p>${tx('ย่านในกรุงเทพมหานคร','A Bangkok neighbourhood')} · <a href="city-bangkok.html" style="color:var(--bl-dk);font-weight:700">${tx('เที่ยวกรุงเทพ →','Explore Bangkok →')}</a></p></div></div></section>
</div>${nearHere?`<div class="section" style="padding-top:0"><div class="sh"><div class="slbl">${GROUP_EMOJI[nearList[0].group]||'🏥'} ${tx('ใกล้แลนด์มาร์กในย่านนี้','Near a landmark here')}</div><h2>${tx('โรงแรม<em>ใกล้จุดหมายเฉพาะ</em>','Hotels <em>near a specific spot</em>')}</h2><p>${tx('มาเพราะโรงพยาบาล ศูนย์ประชุม หรือสนามบินแถวนี้? ดูโรงแรมที่บอกระยะถึงจุดหมายตรง ๆ','Here for a hospital, convention centre or airport nearby? These guides show the real distance to each')}</p></div><div class="hccg">${nearHere}</div></div>`:''}
<div class="section"><div class="sh"><div class="slbl">🔎 ${tx('ค้นเอง','Search yourself')}</div><h2>${tx(`เทียบราคาที่พัก<em>ย่าน${nm}</em>`,`Compare <em>${nm}</em> stays`)}</h2><p>${tx('เทียบ 3 เว็บจองดังก่อนตัดสินใจ','Compare the 3 big booking sites before you decide')}</p></div>${aff}</div>
<div class="section" style="padding-top:0"><div class="sh"><div class="slbl">🏘️ ${tx('ย่านอื่น','More areas')}</div><h2>${tx('เลือก<em>ย่านอื่นในกรุงเทพ</em>','Explore <em>other Bangkok areas</em>')}</h2><p>${tx('กรุงเทพมีให้เลือกพักหลายย่าน แต่ละย่านคนละสไตล์','Bangkok has many areas to stay — each a different vibe')}</p></div><a class="introbtn" href="city-bangkok.html">${tx('ดูย่านทั้งหมดในกรุงเทพ →','See all Bangkok areas →')}</a></div>
<div class="cta-sec"><div class="ctaband"><h2>${tx(`จองที่พักย่าน${nm}`,`Book a stay in ${nm}`)}</h2><p>${tx('เทียบราคาที่พักในย่านนี้ก่อนจอง','Compare stays in this area before you book')}</p><a href="${wts}.html">${tx('ดูที่พักแนะนำ →','See recommended stays →')}</a></div></div>`;
  const extraJS=`<script>(function(){var t=[].slice.call(document.querySelectorAll('.tab')),p=[].slice.call(document.querySelectorAll('.panel'));function a(id){t.forEach(function(x){x.classList.toggle('active',x.dataset.tab===id)});p.forEach(function(x){x.classList.toggle('active',x.id==='p-'+id)})}t.forEach(function(x){x.addEventListener('click',function(){a(x.dataset.tab);history.replaceState(null,'','#'+x.dataset.tab)})});var h=(location.hash||'').replace('#','').replace('p-','');if(['stay','see','eat','plan','prep'].indexOf(h)>-1)a(h);})();</script>`;
  return page({title:tx(`พักย่าน${nm} กรุงเทพฯ — ที่พัก·ของกินเด่น·ไฮไลท์ห้ามพลาด | ThailandAddict`,`${nm}, Bangkok — Where to Stay, Eat & Top Highlights | ThailandAddict`),desc:tx(`ย่าน${nm} กรุงเทพฯ: คัด ${hotels.length} ที่พักทุกงบ + ของกินเด่น ${foods.length} อย่าง + ไฮไลท์ห้ามพลาด ${highlights.length} จุด`,`${nm}, Bangkok — ${hotels.length} hotels for every budget, ${foods.length} signature eats and ${highlights.length} must-see highlights.`),slug:`area-bangkok-${hood}`,jsonld,body,extraJS,image:heroSrc});
}
function provCard(s,th,em,tg){
  const img=fs.existsSync(path.join(PUB,'images/heroes',s+'.jpg'))?`/images/heroes/${s}.jpg`:(fs.existsSync(path.join(PUB,'images/cities',s+'.jpg'))?`/images/cities/${s}.jpg`:'');
  return `<a class="dcard" href="city-${s}.html"><div class="dphoto">${img?`<img src="${img}" alt="${esc(th)}" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="tagn">${em}</span></div><div class="dbody"><h3>${th}</h3><p style="font-size:13px;color:var(--sub);margin-top:3px">${esc(tg)}</p><span class="go">${tx('เที่ยว'+th+' →','Explore '+th+' →')}</span></div></a>`;
}
function regionPage(r){
  const R=REGION[r];const provs=PROVINCES.filter(([,,rr])=>rr===r);const rn=RNAME(r);
  const J = p => `https://thailandaddict.com${PFX()}${p}`;
  const cards=provs.map(([s,th])=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||R.emoji,(d&&d.tagline)||txf(`เที่ยว${th}`,'Explore {name}',{name:NAME(s)}))}).join('');
  const jsonld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},{"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')},{"@type":"ListItem","position":3,"name":rn,"item":J(`region-${R.slug}`)}]};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:rn}])}
<div class="thero"><div class="eyebrow">${R.emoji} ${tx('ภาคของไทย','A region of Thailand')}</div><h1>${tx(`เที่ยว<em>${R.th}</em>`,`Explore <em>${rn}</em>`)}</h1><p class="lead">${RINTRO(r)}</p><div class="chips"><span class="chip">📍 ${provs.length} ${tx('จังหวัด','provinces')}</span><span class="chip">${tx('✅ คัดจากของจริง','✅ picked from the real thing')}</span></div></div>
<section class="sec"><div class="inner"><div class="shead"><h2>${tx(`จังหวัดใน<span class="em">${R.th}</span>`,`Provinces in <span class="em">${rn}</span>`)}</h2><a href="country-thailand.html">${tx('ทุกภาค →','All regions →')}</a></div><div class="dgrid">${cards}</div></div></section>
<div class="cta-sec"><div class="ctaband"><h2>${tx('เลือกจังหวัดที่อยากไป','Pick a province to explore')}</h2><p>${tx('แต่ละจังหวัดมีที่พัก ที่เที่ยว ของกิน และแผนเที่ยวครบ','Every province has stays, sights, food and itineraries')}</p><a href="country-thailand.html">${tx('ดูทั้งประเทศ →','See the whole country →')}</a></div></div>`;
  return page({title:tx(`เที่ยว${R.th} — จังหวัดน่าเที่ยว ที่พัก ที่เที่ยว ของกิน | ThailandAddict`,`${rn} — Provinces, Hotels, Things to Do & Food | ThailandAddict`),desc:tx(`คู่มือเที่ยว${R.th} — รวมจังหวัดน่าเที่ยวพร้อมที่พัก ที่เที่ยว ของกิน และแผนเดินทาง`,`A guide to ${rn} — the best provinces to visit, with stays, sights, food and itineraries.`),slug:`region-${R.slug}`,jsonld,body,image:'/images/heroes/'+({n:'chiang-mai',ne:'nakhon-ratchasima',c:'ayutthaya',e:'trat',w:'kanchanaburi',s:'krabi'}[r]||'krabi')+'.jpg'});
}
function countryHub(){
  const J = p => `https://thailandaddict.com${PFX()}${p}`;
  const blocks=Object.keys(REGION).map(r=>{const R=REGION[r];const provs=PROVINCES.filter(([,,rr])=>rr===r);const rn=RNAME(r);
    const cards=provs.map(([s,th])=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||R.emoji,(d&&d.tagline)||txf(`เที่ยว${th}`,'Explore {name}',{name:NAME(s)}))}).join('');
    return `<section class="regsec"><div class="inner"><div class="shead"><h2>${R.emoji} <span class="em">${rn}</span></h2><a href="region-${R.slug}.html">${tx(`ดู${R.th} →`,`See ${rn} →`)}</a></div><div class="dgrid">${cards}</div></div></section>`;}).join('');
  const jsonld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},{"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')}]};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand')}])}
<div class="thero"><div class="eyebrow">${tx('🇹🇭 ชีวิตติดเที่ยว','🇹🇭 Explore Thailand Like a Local')}</div><h1>${tx('เที่ยว<em>ประเทศไทย</em> ครบ 77 จังหวัด','Explore <em>Thailand</em> — all 77 provinces')}</h1><p class="lead">${tx('เลือกภาคและจังหวัดที่อยากไป — แต่ละจังหวัดมีที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริง','Pick a region and province — each one has ranked stays, things to do, food and itineraries, picked from the real thing.')}</p><div class="chips"><span class="chip">🗺️ <b>77</b> ${tx('จังหวัด','provinces')}</span><span class="chip">🧭 <b>6</b> ${tx('ภาค','regions')}</span><span class="chip">✅ <b>100%</b> ${tx('รีวิวจริง','real reviews')}</span></div></div>
<div style="max-width:1120px;margin:0 auto;padding:34px 28px 0">${blocks}
<section class="regsec"><div class="inner"><div class="shead"><h2>🧭 <span class="em">${tx('เตรียมตัวเที่ยวไทย','Plan your trip')}</span></h2><a href="plan-your-trip.html">${tx('คู่มือทั้งหมด →','All guides →')}</a></div><div class="dgrid">${NAT_GUIDES.map(([s,emo,gth,gen,bth,ben,cth,cen])=>{const im=guideImg(s);return `<a class="dcard" href="${s}.html"><div class="dphoto">${im?`<img src="${im}" alt="" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="tagn">${emo}</span></div><div class="dbody"><h3>${tx(gth,gen)}</h3><p style="font-size:12.5px;color:var(--sub);margin-top:3px;line-height:1.55">${esc(tx(bth,ben))}</p><span class="go">${tx(cth||'อ่านคู่มือ →',cen||'Read the guide →')}</span></div></a>`;}).join('')}</div></div></section></div>
<div class="cta-sec"><div class="ctaband"><h2>${tx('เริ่มวางแผนทริปไทย','Start planning your Thailand trip')}</h2><p>${tx('เลือกจังหวัด แล้วลุยที่พัก ที่เที่ยว ของกิน ได้เลย','Pick a province, then dive into stays, sights and food')}</p><a href="region-north.html">${tx('เริ่มที่ภาคเหนือ →','Start in the North →')}</a></div></div>`;
  return page({title:tx(`เที่ยวไทย 77 จังหวัด — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict ชีวิตติดเที่ยว`,`Explore Thailand — All 77 Provinces, Hotels, Things to Do & Food | ThailandAddict`),desc:tx(`คู่มือเที่ยวไทยครบ 77 จังหวัด 6 ภาค — รีวิวที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเดินทาง คัดจากของจริง`,`A complete Thailand guide — all 77 provinces across 6 regions, with ranked hotel reviews, things to do, food and itineraries.`),slug:`country-thailand`,jsonld,body,image:'/images/heroes/bangkok.jpg'});
}
function destinationsHub(){
  const J = p => `https://thailandaddict.com${PFX()}${p}`;
  const cards = TOPDEST.filter(s=>TH[s]).map(s=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||'📍',(d&&d.tagline)||txf(`เที่ยว${TH[s]}`,'Explore {name}',{name:NAME(s)}))}).join('');
  const dst = DESTINATIONS.filter(([s])=>readData(s));
  const dstCards = dst.map(([s,th])=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||'🏝️',(d&&d.tagline)||txf(`เที่ยว${th}`,'Explore {name}',{name:NAME(s)}))}).join('');
  const regCards = Object.keys(REGION).map(r=>{const R=REGION[r];const n=PROVINCES.filter(([,,rr])=>rr===r).length;const rn=RNAME(r);
    return `<a class="dcard" href="region-${R.slug}.html"><div class="dphoto" style="display:flex;align-items:center;justify-content:center;font-size:46px">${R.emoji}</div><div class="dbody"><h3>${rn}</h3><p style="font-size:12.5px;color:var(--sub);margin-top:3px;line-height:1.55">${esc(RINTRO(r)).slice(0,66)}…</p><span class="go">${tx(`เที่ยว${R.th} · ${n} จังหวัด →`,`${rn} · ${n} provinces →`)}</span></div></a>`;}).join('');
  const CMP = [
    ['phuket-vs-krabi','ภูเก็ต vs กระบี่','Phuket vs Krabi'],['koh-samui-vs-koh-phangan','เกาะสมุย vs เกาะพะงัน','Koh Samui vs Koh Phangan'],
    ['phuket-vs-koh-samui','ภูเก็ต vs เกาะสมุย','Phuket vs Koh Samui'],['krabi-vs-koh-samui','กระบี่ vs เกาะสมุย','Krabi vs Koh Samui'],
    ['chiang-mai-vs-chiang-rai','เชียงใหม่ vs เชียงราย','Chiang Mai vs Chiang Rai'],['bangkok-vs-chiang-mai','กรุงเทพ vs เชียงใหม่','Bangkok vs Chiang Mai'],
    ['pattaya-vs-hua-hin','พัทยา vs หัวหิน','Pattaya vs Hua Hin'],['phuket-vs-pattaya','ภูเก็ต vs พัทยา','Phuket vs Pattaya'],
    ['koh-chang-vs-koh-kood','เกาะช้าง vs เกาะกูด','Koh Chang vs Koh Kood'],['pai-vs-khao-yai','ปาย vs เขาใหญ่','Pai vs Khao Yai'],
    ['chiang-mai-vs-phuket','เชียงใหม่ vs ภูเก็ต','Chiang Mai vs Phuket'],['sukhothai-vs-ayutthaya','สุโขทัย vs อยุธยา','Sukhothai vs Ayutthaya'],
    ['kanchanaburi-vs-khao-yai','กาญจนบุรี vs เขาใหญ่','Kanchanaburi vs Khao Yai'],['bangkok-vs-pattaya','กรุงเทพ vs พัทยา','Bangkok vs Pattaya'],
    ['pai-vs-chiang-rai','ปาย vs เชียงราย','Pai vs Chiang Rai'],['phuket-vs-koh-lipe','ภูเก็ต vs เกาะหลีเป๊ะ','Phuket vs Koh Lipe'],
    ['koh-lipe-vs-koh-kood','เกาะหลีเป๊ะ vs เกาะกูด','Koh Lipe vs Koh Kood'],['hua-hin-vs-khao-yai','หัวหิน vs เขาใหญ่','Hua Hin vs Khao Yai'],
    ['chiang-mai-vs-pai','เชียงใหม่ vs ปาย','Chiang Mai vs Pai'],
  ];
  const cmpCards = CMP.map(([s,th,en])=>`<a class="dcard" href="${s}.html"><div class="dphoto" style="display:flex;align-items:center;justify-content:center;font-size:40px">⚖️</div><div class="dbody"><h3>${tx(th,en)}</h3><span class="go">${tx('เทียบให้ตรง ๆ →','Honest comparison →')}</span></div></a>`).join('');
  const BESTOF = [
    ['best-islands-snorkeling-thailand','เกาะน้ำใสดำน้ำสวย','Best islands for snorkeling','🤿'],
    ['best-family-beaches-thailand','ทะเลเหมาะครอบครัว','Best family beaches','👨‍👩‍👧'],
    ['best-cool-season-mountains-thailand','เที่ยวหน้าหนาวภูเขา','Cool-season mountains','🏔️'],
    ['best-honeymoon-escapes-thailand','ฮันนีมูนเงียบ ๆ','Honeymoon escapes','💛'],
    ['best-nightlife-thailand','สายปาร์ตี้-ไนต์ไลฟ์','Nightlife & parties','🎉'],
    ['best-rainy-season-thailand','หน้าฝนเที่ยวไหนดี','Rainy-season trips','🌧️'],
    ['best-day-trips-from-bangkok','เดย์ทริปใกล้กรุงเทพ','Day trips from Bangkok','🚆'],
    ['best-temple-destinations-thailand','สายวัด-สายมู','Temple destinations','🛕'],
    ['best-cafe-hopping-thailand','สายคาเฟ่','Café-hopping','☕'],
    ['best-waterfalls-nature-thailand','น้ำตก-ธรรมชาติ','Waterfalls & nature','💦'],
    ['best-budget-backpacker-thailand','แบ็คแพ็คงบน้อย','Budget backpacking','🎒'],
    ['best-solo-travel-thailand','เที่ยวคนเดียว','Solo travel','🧳'],
    ['best-river-mekong-thailand','เที่ยวริมโขง','Mekong river towns','🛶'],
    ['best-quiet-islands-thailand','เกาะเงียบหนีคน','Quiet islands','🏝️'],
    ['best-historic-old-towns-thailand','เมืองเก่า','Historic old towns','🏛️'],
  ];
  const bestCards = BESTOF.map(([s,th,en,em])=>`<a class="dcard" href="${s}.html"><div class="dphoto" style="display:flex;align-items:center;justify-content:center;font-size:40px">${em}</div><div class="dbody"><h3>${tx(th,en)}</h3><span class="go">${tx('ดูอันดับ →','See the picks →')}</span></div></a>`).join('');
  const jsonld={"@context":"https://schema.org","@type":"ItemList","name":tx("เมืองท่องเที่ยวยอดนิยมในไทย","Top tourist cities in Thailand"),"itemListElement":TOPDEST.filter(s=>TH[s]).map((s,i)=>({"@type":"ListItem","position":i+1,"name":NAME(s),"url":J(`city-${s}`)}))};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:tx('เมืองท่องเที่ยว','Top Cities')}])}
<div class="thero"><div class="eyebrow">${tx('🔥 ยอดนิยม','🔥 Popular')}</div><h1>${tx('เมือง<em>ท่องเที่ยว</em>ยอดนิยม','Top <em>tourist cities</em>')}</h1><p class="lead">${tx('รวมเมืองที่คนไปเที่ยวมากที่สุดทั่วไทย — ทะเล เกาะ ภูเขา เมืองเก่า คาเฟ่ ครบทุกสาย แต่ละเมืองคัดที่พัก ที่เที่ยว ของกิน และแผนเที่ยวให้พร้อมลุย','The cities people travel to most across Thailand — beaches, islands, mountains, old towns and cafés. Each one comes with hand-picked stays, sights, food and itineraries.')}</p><div class="chips"><span class="chip">🔥 <b>${TOPDEST.length}</b> ${tx('เมืองยอดนิยม','top cities')}</span><span class="chip">🧭 <b>6</b> ${tx('ภาค','regions')}</span><span class="chip">${tx('✅ คัดจากของจริง','✅ picked from the real thing')}</span></div></div>
<section class="sec"><div class="inner"><div class="shead"><h2>${tx('เมือง<span class="em">ท่องเที่ยวยอดนิยม</span>','Top <span class="em">tourist cities</span>')}</h2><a href="country-thailand.html">${tx('ดูทั้ง 77 จังหวัด →','All 77 provinces →')}</a></div><div class="dgrid">${cards}</div></div></section>
${dst.length?`<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('เกาะ &amp; <span class="em">จุดหมายเฉพาะทาง</span>','Islands &amp; <span class="em">special destinations</span>')}</h2><span style="font-size:13px;color:var(--sub)">${dst.length} ${tx('จุดหมาย','destinations')}</span></div><div class="dgrid">${dstCards}</div></div></section>`:''}
<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('หรือเลือก<span class="em">ตามภาค</span>','Or browse <span class="em">by region</span>')}</h2><a href="country-thailand.html">${tx('ทุกภาค →','All regions →')}</a></div><div class="dgrid">${regCards}</div></div></section>
<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('เลือกตาม<span class="em">สไตล์เที่ยว</span>','Pick by <span class="em">travel style</span>')}</h2><a href="plan-your-trip.html">${tx('เตรียมตัวเที่ยว →','Plan your trip →')}</a></div><div class="dgrid">${bestCards}</div></div></section>
<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('ตัดสินใจไม่ได้? <span class="em">เทียบเมือง</span>','Can’t decide? <span class="em">Compare</span>')}</h2><a href="plan-your-trip.html">${tx('เตรียมตัวเที่ยว →','Plan your trip →')}</a></div><div class="dgrid">${cmpCards}</div></div></section>
<div class="cta-sec"><div class="ctaband"><h2>${tx('เลือกเมืองที่อยากไป','Pick a city to explore')}</h2><p>${tx('แต่ละเมืองมีที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเที่ยวครบ คัดจากเสียงรีวิวจริง','Every city has ranked stays, things to do, food and itineraries, picked from real reviews')}</p><a href="country-thailand.html">${tx('ดูทั้งประเทศ →','See the whole country →')}</a></div></div>`;
  return page({title:tx(`เมืองท่องเที่ยวยอดนิยมในไทย — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict ชีวิตติดเที่ยว`,`Top Tourist Cities in Thailand — Hotels, Things to Do & Food | ThailandAddict`),desc:tx(`รวมเมืองท่องเที่ยวยอดนิยมทั่วไทย — กรุงเทพ เชียงใหม่ ภูเก็ต กระบี่ พัทยา หัวหิน และอีกมาก พร้อมที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเดินทาง`,`Thailand's most popular tourist cities — Bangkok, Chiang Mai, Phuket, Krabi, Pattaya, Hua Hin and more, with ranked stays, things to do, food and itineraries.`),slug:`tourist-cities`,jsonld,body,image:'/images/heroes/phuket.jpg'});
}
// ── Plan Your Trip hub (Essential guides cluster) ──
function planHub(){
  const J = p => `https://thailandaddict.com${PFX()}${p}`;
  const G = NAT_GUIDES;
  const R = [
    ['bangkok-to-chiang-mai','🚆','กรุงเทพ → เชียงใหม่','Bangkok → Chiang Mai'],
    ['bangkok-to-phuket','✈️','กรุงเทพ → ภูเก็ต','Bangkok → Phuket'],
    ['bangkok-to-krabi','✈️','กรุงเทพ → กระบี่','Bangkok → Krabi'],
    ['bangkok-to-pattaya','🚐','กรุงเทพ → พัทยา','Bangkok → Pattaya'],
    ['bangkok-to-ayutthaya','🚆','กรุงเทพ → อยุธยา','Bangkok → Ayutthaya'],
    ['bangkok-to-koh-samui','🏝️','กรุงเทพ → เกาะสมุย','Bangkok → Koh Samui'],
    ['phuket-to-phi-phi','⛴️','ภูเก็ต → เกาะพีพี','Phuket → Phi Phi'],
    ['krabi-to-phuket','🚐','กระบี่ → ภูเก็ต','Krabi → Phuket'],
    ['surat-thani-to-koh-samui','⛴️','สุราษฎร์ → เกาะอ่าวไทย','Surat Thani → Gulf islands'],
    ['suvarnabhumi-airport-to-bangkok','✈️','สนามบินสุวรรณภูมิ → ในเมือง','Suvarnabhumi → city'],
    ['bangkok-bts-mrt-guide','🚇','รถไฟฟ้า BTS & MRT กรุงเทพ','Bangkok BTS & MRT'],
    ['chiang-mai-to-pai','🚐','เชียงใหม่ → ปาย','Chiang Mai → Pai'],
  ];
  const cards = G.map(([s,emo,th,en,bth,ben,cth,cen])=>{const im=guideImg(s);return `<a class="dcard" href="${s}.html"><div class="dphoto">${im?`<img src="${im}" alt="" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="tagn">${emo}</span></div><div class="dbody"><h3>${tx(th,en)}</h3><p style="font-size:12.5px;color:var(--sub);margin-top:3px;line-height:1.55">${esc(tx(bth,ben))}</p><span class="go">${tx(cth||'อ่านคู่มือ →',cen||'Read the guide →')}</span></div></a>`;}).join('');
  const routeCards = R.map(([s,emo,th,en])=>{const im=guideImg(s);return `<a class="dcard" href="${s}.html"><div class="dphoto">${im?`<img src="${im}" alt="" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="tagn">${emo}</span></div><div class="dbody"><h3>${tx(th,en)}</h3><span class="go">${tx('ไปยังไงดี →','How to get there →')}</span></div></a>`;}).join('');
  const jsonld={"@context":"https://schema.org","@type":"ItemList","name":tx("คู่มือเตรียมตัวเที่ยวไทย","Plan your Thailand trip"),"itemListElement":[...G,...R].map((g,i)=>({"@type":"ListItem","position":i+1,"name":tx(g[2],g[3]),"url":J(g[0])}))};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:tx('เตรียมตัวเที่ยวไทย','Plan Your Trip')}])}
<div class="thero"><div class="eyebrow">${tx('🧭 เตรียมตัวเที่ยวไทย','🧭 Plan Your Trip')}</div><h1>${tx('คู่มือ<em>เตรียมตัว</em>เที่ยวไทย','Plan your <em>Thailand</em> trip')}</h1><p class="lead">${tx('ทุกอย่างที่ควรรู้ก่อนออกเดินทาง — วีซ่า ซิม การเดินทาง งบ ความปลอดภัย และมารยาท รวบไว้ให้อ่านจบในที่เดียว','Everything to sort before you go — visa, SIM, transport, budget, safety and etiquette, all in one place.')}</p><div class="chips"><span class="chip">🧭 <b>${G.length}</b> ${tx('คู่มือ','guides')}</span><span class="chip">🚌 <b>${R.length}</b> ${tx('เส้นทางเดินทาง','routes')}</span><span class="chip">${tx('✅ อัปเดต 2026','✅ Updated 2026')}</span></div></div>
<section class="sec"><div class="inner"><div class="shead"><h2>${tx('คู่มือ<span class="em">เตรียมตัว</span>','Essential <span class="em">guides</span>')}</h2><a href="country-thailand.html">${tx('เลือกจังหวัด →','Pick a province →')}</a></div><div class="dgrid">${cards}</div></div></section>
<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('ไปยังไงดี — <span class="em">เส้นทางยอดฮิต</span>','Getting around — <span class="em">popular routes</span>')}</h2><a href="getting-around-thailand.html">${tx('คู่มือเดินทางทั่วไทย →','Full transport guide →')}</a></div><div class="dgrid">${routeCards}</div></div></section>
<div class="cta-sec"><div class="ctaband"><h2>${tx('พร้อมแล้ว เลือกจุดหมาย','Ready? Pick a destination')}</h2><p>${tx('อ่านคู่มือเตรียมตัวจบแล้ว ไปต่อที่เมืองและจังหวัดที่อยากเที่ยวได้เลย','Once the basics are planned, dive into the city or province you want to explore')}</p><a href="tourist-cities.html">${tx('ดูเมืองท่องเที่ยว →','See top cities →')}</a></div></div>`;
  return page({title:tx(`เตรียมตัวเที่ยวไทย — วีซ่า ซิม การเดินทาง งบ ความปลอดภัย | ThailandAddict ชีวิตติดเที่ยว`,`Plan Your Thailand Trip — Visa, eSIM, Transport, Budget & Safety | ThailandAddict`),desc:tx(`รวมคู่มือเตรียมตัวก่อนเที่ยวไทย วีซ่าและการเข้าเมือง ซิม/eSIM การเดินทาง งบต่อวัน ความปลอดภัย ประกัน และมารยาทไทย`,`Everything to plan before visiting Thailand — visa & entry, eSIM, getting around, daily budget, safety, insurance and Thai etiquette.`),slug:`plan-your-trip`,jsonld,body,image:'/images/heroes/bangkok.jpg'});
}
// ── per-province activity hub: lists all activity content (roundup + compare + hero) with a role filter ──
function activityHub(slug, th, r){
  const acts=(ARTS[slug]||[]).filter(a=>/^activity/.test(a.type));
  if(!acts.length) return null;
  const R=REGION[r], nm=NAME(slug);
  const J=p=>`https://thailandaddict.com${PFX()}${p}`;
  const roleOf=a=> a.type==='activity-ranking'?'rank' : a.type==='activity-compare'?'compare' : 'hero';
  const roleLbl={rank:tx('จัดอันดับรวม','Roundup'),compare:tx('เปรียบเทียบ','Compare'),hero:tx('รายกิจกรรม','Single')};
  const ord={rank:0,compare:1,hero:2};
  const sorted=acts.slice().sort((a,b)=>ord[roleOf(a)]-ord[roleOf(b)]||a.slug.localeCompare(b.slug));
  const card=a=>{const role=roleOf(a);
    const meta=[];
    if(role==='rank'&&a.nItems)meta.push(`<span>🎟️ ${a.nItems} ${tx('กิจกรรม','activities')}</span>`);
    else if(role==='compare'&&a.nItems)meta.push(`<span>⚖️ ${tx(`เทียบ ${a.nItems} ตัวเลือก`,`${a.nItems} compared`)}</span>`);
    if(a.readTime)meta.push(`<span>⏱ ${esc(a.readTime)}</span>`);
    return `<a class="ahub-card" data-role="${role}" href="${a.slug}.html"><div class="ahub-ph">${a.heroImg?`<img src="${a.heroImg}" alt="${esc(stripTags(a.title))}" loading="lazy" onerror="this.closest('.ahub-ph').style.background='linear-gradient(135deg,var(--bl),var(--or))'">`:''}<span class="ahub-tag r-${role}">${roleLbl[role]}</span></div><div class="ahub-bd"><h3>${esc(stripTags(a.title))}</h3>${a.blurb?`<p class="ahub-blurb">${esc(a.blurb)}</p>`:''}${meta.length?`<div class="ahub-meta">${meta.join('')}</div>`:''}<span class="ahub-go">${tx('อ่านรีวิว & ราคา','Read review & price')} →</span></div></a>`;};
  const cards=sorted.map(card).join('');
  const fbtn=(f,l,on)=>`<button class="afb${on?' on':''}" type="button" data-f="${f}" style="font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:13px;padding:8px 18px;border-radius:999px;border:1.5px solid var(--bdr);background:${on?'linear-gradient(135deg,var(--bl),var(--or));color:#fff':'#fff;color:var(--ink)'};cursor:pointer">${l}</button>`;
  const counts={rank:0,compare:0,hero:0}; sorted.forEach(a=>counts[roleOf(a)]++);
  const filter=`<div class="afilter" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:26px">${fbtn('all',tx('ทั้งหมด','All'),true)}${counts.rank?fbtn('rank',roleLbl.rank,false):''}${counts.compare?fbtn('compare',roleLbl.compare,false):''}${counts.hero?fbtn('hero',roleLbl.hero,false):''}</div>`;
  const jsonld={"@context":"https://schema.org","@type":"ItemList","name":tx(`กิจกรรมน่าทำใน${th}`,`Things to do in ${nm}`),"itemListElement":sorted.map((a,i)=>({"@type":"ListItem","position":i+1,"name":stripTags(a.title),"url":J(a.slug)}))};
  const heroImg=(sorted.find(a=>a.heroImg)||{}).heroImg||'';
  const klk=`https://www.klook.com/${LOC==='th'?'th':'en-US'}/search/?query=${encodeURIComponent(nm)}&aid=121442`;
  const hotels=(REVS[slug]||[]).slice().sort((a,b)=>b.score-a.score).slice(0,3);
  const hcard=h=>`<a class="ahub-hotel" href="${h.slug}.html">${h.img?`<img src="${h.img}" alt="${esc(h.name)}" loading="lazy" onerror="this.style.display='none'">`:''}<span class="ahh-bd"><b>${esc(h.name)}</b><span class="ahh-l2">${h.score?`<span class="ahh-sc">★ ${h.score.toFixed(1)}</span>`:''}${h.loc?`<i>📍 ${esc(h.loc)}</i>`:''}</span></span></a>`;
  const style=`<style>
.ahub-hero{position:relative;border-radius:26px;overflow:hidden;margin:14px 0 28px;padding:clamp(38px,6vw,58px) clamp(22px,4vw,38px);background:#0891b2 center/cover no-repeat;color:#fff}
.ahub-hero::after{content:'';position:absolute;inset:0;background:linear-gradient(125deg,rgba(8,145,178,.93),rgba(244,63,94,.82))}
.ahub-hero>*{position:relative;z-index:1}
.ahub-hero .eyebrow{color:#fff;opacity:.96;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:13px;letter-spacing:.4px;margin-bottom:8px}
.ahub-hero h1{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:900;font-size:clamp(27px,5vw,45px);line-height:1.1;margin:0 0 10px}
.ahub-hero h1 em{font-style:normal;color:#fde68a}
.ahub-hero .lead{font-size:16px;line-height:1.6;max-width:640px;opacity:.97;margin:0 0 18px}
.ahub-hchips{display:flex;flex-wrap:wrap;gap:10px}
.ahub-hchips span{background:rgba(255,255,255,.17);border:1px solid rgba(255,255,255,.32);border-radius:999px;padding:7px 15px;font-size:13px;font-weight:600}
.ahub-hchips b{font-weight:900}
.ahub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(288px,1fr));gap:20px}
.ahub-card{display:flex;flex-direction:column;background:#fff;border:1px solid var(--bdr);border-radius:20px;overflow:hidden;text-decoration:none;transition:transform .16s,box-shadow .16s}
.ahub-card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(8,145,178,.16)}
.ahub-ph{position:relative;aspect-ratio:16/10;background:linear-gradient(135deg,#e0f7fa,#fff1f2);overflow:hidden}
.ahub-ph img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
.ahub-card:hover .ahub-ph img{transform:scale(1.05)}
.ahub-tag{position:absolute;top:12px;left:12px;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:11.5px;color:#fff;border-radius:999px;padding:5px 12px;box-shadow:0 3px 8px rgba(0,0,0,.18)}
.ahub-tag.r-rank{background:linear-gradient(135deg,#f59e0b,#f43f5e)}.ahub-tag.r-compare{background:linear-gradient(135deg,#0891b2,#06b6d4)}.ahub-tag.r-hero{background:linear-gradient(135deg,#7c3aed,#06b6d4)}
.ahub-bd{display:flex;flex-direction:column;gap:8px;padding:16px 18px 18px;flex:1}
.ahub-bd h3{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:17px;line-height:1.3;color:var(--ink);margin:0}
.ahub-blurb{font-size:13.5px;line-height:1.6;color:var(--sub);margin:0;flex:1}
.ahub-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:12.5px;color:var(--sub);font-weight:600}
.ahub-go{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:13.5px;color:var(--bl-dk);margin-top:2px}
.ahub-sell{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:36px 0 6px}@media(max-width:760px){.ahub-sell{grid-template-columns:1fr}}
.ahub-band{border-radius:22px;padding:24px 24px 26px;display:flex;flex-direction:column}
.ahub-band h3{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:900;font-size:20px;margin:0 0 4px}
.ahub-band>p{font-size:13.5px;line-height:1.6;margin:0 0 16px}
.ahub-klk{background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fed7aa}
.ahub-klk h3{color:#9a3412}.ahub-klk>p{color:#9a3412;opacity:.85}
.ahub-klkbtn{display:inline-flex;align-items:center;gap:11px;background:linear-gradient(135deg,#ff7e1d,#ff5b00);color:#fff;text-decoration:none;border-radius:14px;padding:14px 20px;font-family:'Outfit',sans-serif;font-weight:800;font-size:15px;box-shadow:0 8px 20px rgba(255,91,0,.32);transition:transform .14s,box-shadow .14s;margin-top:auto}
.ahub-klkbtn:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(255,91,0,.44)}
.ahub-klkbtn .kb{background:#fff;color:#ff5b00;font-weight:900;font-size:16px;letter-spacing:-.5px;border-radius:8px;padding:4px 10px;line-height:1;flex-shrink:0}
.ahub-htl{background:linear-gradient(135deg,#ecfeff,#f0fdfa);border:1px solid #a5f3fc}
.ahub-htl h3{color:#0e7490}.ahub-htl>p{color:#0e7490;opacity:.85}
.ahub-hotels{display:flex;flex-direction:column;gap:9px;margin-bottom:14px}
.ahub-hotel{display:flex;align-items:center;gap:11px;background:#fff;border:1px solid #cffafe;border-radius:13px;padding:8px 10px;text-decoration:none;transition:.14s}
.ahub-hotel:hover{border-color:#22d3ee;box-shadow:0 6px 16px rgba(6,182,212,.14)}
.ahub-hotel img{width:54px;height:54px;border-radius:10px;object-fit:cover;flex-shrink:0}
.ahh-bd{display:flex;flex-direction:column;min-width:0;gap:2px}
.ahh-bd b{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:700;font-size:14px;color:var(--ink);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ahh-l2{display:flex;gap:9px;align-items:center}.ahh-sc{font-size:12.5px;color:#b45309;font-weight:800}.ahh-bd i{font-size:12.5px;color:var(--sub);font-style:normal}
.ahub-htlbtn{display:inline-block;background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;text-decoration:none;border-radius:12px;padding:12px 18px;font-family:'Outfit',sans-serif;font-weight:800;font-size:14px;text-align:center;margin-top:auto}
.ahub-htlbtn:hover{filter:brightness(1.05)}
</style>`;
  const body=`${style}${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:nm,href:`city-${slug}.html`},{t:tx('กิจกรรม','Activities')}])}
<section class="sec"><div class="inner">
<div class="ahub-hero"${heroImg?` style="background-image:url('${heroImg}')"`:''}><div class="eyebrow">${tx('🎟️ กิจกรรม & ทัวร์','🎟️ Activities & tours')}</div><h1>${tx(`กิจกรรมน่าทำใน<em>${th}</em>`,`Things to do in <em>${nm}</em>`)}</h1><p class="lead">${tx('จัดอันดับ เปรียบเทียบ และรีวิวกิจกรรม ทัวร์ และตั๋ว คัดจากรีวิวจริง พร้อมจุดเด่น ข้อสังเกต และช่องทางจอง','Ranked, compared and reviewed activities, tours and tickets — from real reviews, with pros, cons and where to book')}</p><div class="ahub-hchips"><span>🎟️ <b>${sorted.length}</b> ${tx('บทความ','guides')}</span><span>${tx('✅ คัดจากรีวิวจริง','✅ From real reviews')}</span><span>${tx('📅 อัปเดต 2026','📅 Updated 2026')}</span></div></div>
${filter}
<div class="dgrid ahub-grid">${cards}</div>
<div class="ahub-sell">
<div class="ahub-band ahub-klk"><h3>${tx('🎟️ จองกิจกรรม & ตั๋ว','🎟️ Book activities & tickets')}</h3><p>${tx('กิจกรรมยอดนิยมคิวเต็มไว จองออนไลน์ล่วงหน้าได้ราคาดีกว่าและยืนยันที่นั่งทันที','Popular activities sell out fast — book online ahead for better prices and instant confirmation')}</p><a class="ahub-klkbtn" href="${klk}" target="_blank" rel="nofollow noopener sponsored"><span class="kb">klook</span><span>${tx(`ดูกิจกรรมทั้งหมดใน${th}`,`See all activities in ${nm}`)} →</span></a></div>
<div class="ahub-band ahub-htl"><h3>${tx(`🏨 ที่พักใน${th}`,`🏨 Where to stay in ${nm}`)}</h3><p>${tx('เลือกที่พักทำเลดีใกล้จุดเที่ยว เทียบราคา 3 เว็บก่อนจอง','Pick a well-located stay near the action — compare 3 sites before booking')}</p>${hotels.length?`<div class="ahub-hotels">${hotels.map(hcard).join('')}</div>`:''}<a class="ahub-htlbtn" href="top10-hotels-${slug}.html">${tx(`ดูที่พักทั้งหมดใน${th}`,`See all stays in ${nm}`)} →</a></div>
</div>
</div></section>`;
  const extraJS=`<script>(function(){var b=[].slice.call(document.querySelectorAll('.afb')),c=[].slice.call(document.querySelectorAll('.ahub-grid .ahub-card'));b.forEach(function(x){x.addEventListener('click',function(){b.forEach(function(y){var on=y===x;y.classList.toggle('on',on);y.style.background=on?'linear-gradient(135deg,var(--bl),var(--or))':'#fff';y.style.color=on?'#fff':'var(--ink)'});var f=x.dataset.f;c.forEach(function(card){card.style.display=(f==='all'||card.dataset.role===f)?'':'none'})})})})();</script>`;
  return page({title:tx(`กิจกรรมน่าทำใน${th} — จัดอันดับ เปรียบเทียบ ทัวร์ & ตั๋ว | ThailandAddict`,`Things to Do in ${nm} — Ranked & Compared Tours & Tickets | ThailandAddict`),desc:tx(`รวมกิจกรรม ทัวร์ และตั๋วใน${th} — จัดอันดับและเปรียบเทียบจากรีวิวจริง พร้อมช่องทางจอง`,`Activities, tours and tickets in ${nm} — ranked and compared from real reviews, with where to book.`),slug:`activities-${slug}`,jsonld,body,extraJS,image:acts[0]&&acts[0].heroImg||''});
}
// ── site-wide search page (client-side, reads /search-index.json) ──
function searchPage(){
  const J = p => `https://thailandaddict.com${PFX()}${p}`;
  const idxUrl = PFX()+'search-index.json';
  const cats = [['all',tx('ทั้งหมด','All')],['stay',tx('🏨 ที่พัก','🏨 Stays')],['rank',tx('🏆 จัดอันดับ','🏆 Rankings')],['see',tx('📍 ที่เที่ยว','📍 See')],['eat',tx('🍜 ที่กิน','🍜 Eat')],['plan',tx('🗺️ แผนเที่ยว','🗺️ Plans')],['guide',tx('🧭 คู่มือ','🧭 Guides')],['city',tx('🏙️ เมือง/จังหวัด','🏙️ Places')]];
  const chips = cats.map((c,i)=>`<button class="schip${i===0?' on':''}" data-cat="${c[0]}">${c[1]}</button>`).join('');
  const badge = JSON.stringify({stay:tx('ที่พัก','Stay'),rank:tx('จัดอันดับ','Ranking'),see:tx('ที่เที่ยว','See'),eat:tx('ที่กิน','Eat'),plan:tx('แผน','Plan'),guide:tx('คู่มือ','Guide'),city:tx('เมือง','Place')});
  const STR = JSON.stringify({ph:tx('พิมพ์ชื่อที่พัก เมือง ที่เที่ยว หรือคู่มือ…','Search hotels, cities, sights or guides…'),none:tx('ไม่พบผลลัพธ์ ลองคำอื่น','No results — try another word'),found:tx('พบ','Found'),results:tx('ผลลัพธ์','results'),more:tx('ผลลัพธ์ · แสดง 100 แรก','results · showing first 100'),start:tx('เริ่มพิมพ์เพื่อค้นหาทั้งเว็บ','Start typing to search the whole site')});
  const body=`<style>
.swrap{max-width:760px;margin:0 auto;padding:26px 22px 60px}
.sbig{width:100%;font-family:inherit;font-size:18px;padding:16px 18px;border:2px solid var(--bdr);border-radius:16px;outline:none;transition:border-color .15s}
.sbig:focus{border-color:var(--bl)}
.schips{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 6px}
.schip{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:13px;font-weight:600;color:var(--sub);background:#fff;border:1.5px solid var(--bdr);border-radius:30px;padding:7px 14px;cursor:pointer;transition:.15s}
.schip:hover{border-color:var(--bl);color:var(--bl-dk)}.schip.on{background:linear-gradient(135deg,var(--bl),var(--bl-dk));border-color:transparent;color:#fff}
.scount{font-size:13px;color:var(--sub);margin:10px 2px 14px}
.sres{display:flex;flex-direction:column;gap:8px}
.srow{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--bdr);border-radius:14px;padding:12px 15px;transition:.15s}
.srow:hover{border-color:var(--bl);box-shadow:0 8px 22px rgba(6,182,212,.12);transform:translateY(-1px)}
.sbadge{flex-shrink:0;font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.3px;border-radius:20px;padding:4px 9px;min-width:62px;text-align:center}
.sbadge.stay{color:#0e7490;background:#cffafe}.sbadge.rank{color:#b45309;background:#fef3c7}.sbadge.see{color:#7c3aed;background:#f3e8ff}.sbadge.eat{color:#be123c;background:#ffe4e6}.sbadge.plan{color:#0891b2;background:#e0f7fa}.sbadge.guide{color:#15803d;background:#dcfce7}.sbadge.city{color:#475569;background:#f1f5f9}
.sinfo{min-width:0}.stitle{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:600;font-size:15px;line-height:1.3;color:var(--ink)}
.splace{font-size:12.5px;color:var(--sub);margin-top:2px}
</style>
${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ค้นหา','Search')}])}
<div class="thero" style="padding-bottom:14px"><div class="eyebrow">🔎 ${tx('ค้นหาทั้งเว็บ','Search the whole site')}</div><h1>${tx('ค้นหา<em>ที่พัก ที่เที่ยว คู่มือ</em>','Search <em>stays, sights & guides</em>')}</h1></div>
<div class="swrap">
  <input type="text" id="sq" class="sbig" placeholder="" autocomplete="off" autofocus>
  <div class="schips" id="schips">${chips}</div>
  <div class="scount" id="scount"></div>
  <div class="sres" id="sres"></div>
</div>`;
  const extraJS=`<script>
(function(){var IDX=${JSON.stringify(idxUrl)},B=${badge},S=${STR},data=[],q='',cat='all';
var inp=document.getElementById('sq'),res=document.getElementById('sres'),cnt=document.getElementById('scount'),chips=document.getElementById('schips');
inp.placeholder=S.ph;var p=new URLSearchParams(location.search),q0=p.get('q')||'';if(q0){inp.value=q0;q=q0.trim().toLowerCase();}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function render(){if(!data.length){return;}if(!q){cnt.textContent='';res.innerHTML='<div class="scount">'+S.start+'</div>';return;}
var out=[];for(var i=0;i<data.length;i++){var e=data[i];if(cat!=='all'&&e[2]!==cat)continue;if((e[0]+' '+e[3]).toLowerCase().indexOf(q)===-1)continue;out.push(e);}
out.sort(function(a,b){return (a[0].toLowerCase().indexOf(q)===0?0:1)-(b[0].toLowerCase().indexOf(q)===0?0:1);});
var total=out.length;cnt.textContent=total?(S.found+' '+total+' '+(total>100?S.more:S.results)):'';
if(!total){res.innerHTML='<div class="scount">'+S.none+'</div>';return;}
res.innerHTML=out.slice(0,100).map(function(e){return '<a class="srow" href="'+e[1]+'"><span class="sbadge '+e[2]+'">'+(B[e[2]]||'')+'</span><span class="sinfo"><span class="stitle">'+esc(e[0])+'</span>'+(e[3]?'<span class="splace">📍 '+esc(e[3])+'</span>':'')+'</span></a>';}).join('');}
var t;inp.addEventListener('input',function(){q=inp.value.trim().toLowerCase();clearTimeout(t);t=setTimeout(render,110);});
chips.addEventListener('click',function(e){var b=e.target.closest('.schip');if(!b)return;cat=b.getAttribute('data-cat');chips.querySelectorAll('.schip').forEach(function(x){x.classList.remove('on');});b.classList.add('on');render();});
fetch(IDX).then(function(r){return r.json();}).then(function(j){data=j;render();}).catch(function(){cnt.textContent='';});})();
</script>`;
  const jsonld={"@context":"https://schema.org","@type":"WebSite","name":"ThailandAddict","url":"https://thailandaddict.com/","potentialAction":{"@type":"SearchAction","target":J('search.html')+"?q={query}","query-input":"required name=query"}};
  return page({title:tx('ค้นหา — ที่พัก ที่เที่ยว คู่มือเที่ยวไทย | ThailandAddict','Search — Hotels, Sights & Thailand Travel Guides | ThailandAddict'),desc:tx('ค้นหาที่พัก ที่เที่ยว ของกิน แผนเที่ยว และคู่มือเตรียมตัวทั่วไทยในที่เดียว','Search hotels, things to do, food, itineraries and travel guides across Thailand in one place.'),slug:'search',jsonld,body,extraJS,image:'/images/heroes/bangkok.jpg'});
}
function readData(slug){
  const dirs = LOC==='en' ? [DATA+'-en', DATA] : [DATA];   // EN prefers province-data-en, falls back to TH
  for(const dir of dirs){ const f=path.join(dir,slug+'.json'); if(fs.existsSync(f)){ try{return JSON.parse(fs.readFileSync(f,'utf8'))}catch{} } }
  return null;
}

// ── generate (per locale) ──
function genAll(loc, outDir){
  LOC = loc;                                  // set current locale for all builders
  fs.mkdirSync(outDir, { recursive: true });
  let nP=0,nMiss=[];
  for(const [slug,th,r] of PROVINCES){const d=readData(slug);if(!d)nMiss.push(slug);fs.writeFileSync(path.join(outDir,`city-${slug}.html`),provinceHub(slug,th,r,d||{}));nP++;}
  let nAct=0;for(const [slug,th,r] of [...PROVINCES,...DESTINATIONS]){const html=activityHub(slug,th,r);if(html){fs.writeFileSync(path.join(outDir,`activities-${slug}.html`),html);nAct++;}}
  let nD=0;for(const [slug,th,r] of DESTINATIONS){const d=readData(slug);if(!d){nMiss.push(slug);continue;}fs.writeFileSync(path.join(outDir,`city-${slug}.html`),provinceHub(slug,th,r,d));nD++;}
  let nH=0;for(const hood of bkkHoodList()){const html=hoodHub(hood);if(html){fs.writeFileSync(path.join(outDir,`area-bangkok-${hood}.html`),html);nH++;}}
  let nR=0;for(const r of Object.keys(REGION)){fs.writeFileSync(path.join(outDir,`region-${REGION[r].slug}.html`),regionPage(r));nR++;}
  fs.writeFileSync(path.join(outDir,'country-thailand.html'),countryHub());
  fs.writeFileSync(path.join(outDir,'tourist-cities.html'),destinationsHub());
  fs.writeFileSync(path.join(outDir,'plan-your-trip.html'),planHub());
  fs.writeFileSync(path.join(outDir,'search.html'),searchPage());
  console.log(`[${loc}] → ${path.relative(ROOT,outDir)} · provinces:${nP} destinations:${nD}/${DESTINATIONS.length} area-hubs:${nH} regions:${nR} country:1 destinations-page:1 plan:1 search:1`);
  if(nMiss.length) console.log(`   [${loc}] missing data (fallback): ${nMiss.length} → ${nMiss.join(',')}`);
}
// which locales to build: args, default both
const want = process.argv.slice(2).filter(a=>['th','en'].includes(a));
const BUILD_LOCALES = want.length ? want : ['th','en'];
const OUT_BASE = process.env.HUBS_OUT || PUB;      // override output root for test builds
for(const loc of BUILD_LOCALES) genAll(loc, loc==='en' ? path.join(OUT_BASE,'en') : OUT_BASE);
