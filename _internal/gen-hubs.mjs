// Generate region + province hub pages — self-contained chrome (wherebest-ported,
// Direction-C teal/coral + Fraunces + iOS Thai font + slogan). Province pages use a
// hero image + sticky 5-tab layout (ที่พัก/ที่เที่ยว/ที่กิน/แผนเที่ยว/เตรียมตัว) with real
// hotel-review cards and article cards. Matches astro/public/index.html.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..'); // repo root (resolves wherever cloned)
const PUB = path.join(ROOT, 'astro/public');
const DATA = path.join(ROOT, '_internal/province-data');

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
const TH = Object.fromEntries([...PROVINCES, ...DESTINATIONS].map(([s,th])=>[s,th]));
// curated "เมืองท่องเที่ยว" — top tourism cities (cross-cut, may repeat across regions e.g. ภูเก็ต).
// Cards auto-fill hero images as each province's content lands (gen-hubs re-runs per finalize).
const TOPDEST = ['bangkok','chiang-mai','phuket','krabi','chiang-rai','chonburi','surat-thani','prachuap-khiri-khan','kanchanaburi','ayutthaya','rayong','trat','phang-nga','nan','mae-hong-son','sukhothai','nakhon-ratchasima','phetchabun'];

// ── i18n: English city names + locale helpers ──
const EN_NAME = {
  'amnat-charoen':'Amnat Charoen','ang-thong':'Ang Thong','ayutthaya':'Ayutthaya','bangkok':'Bangkok','bueng-kan':'Bueng Kan','buriram':'Buriram','chachoengsao':'Chachoengsao','chai-nat':'Chai Nat','chaiyaphum':'Chaiyaphum','chanthaburi':'Chanthaburi','chiang-mai':'Chiang Mai','chiang-rai':'Chiang Rai','chonburi':'Chonburi','chumphon':'Chumphon','hat-yai':'Hat Yai','huahin':'Hua Hin','kalasin':'Kalasin','kamphaeng-phet':'Kamphaeng Phet','kanchanaburi':'Kanchanaburi','khao-yai':'Khao Yai','khon-kaen':'Khon Kaen','koh-chang':'Koh Chang','koh-kood':'Koh Kood','koh-larn':'Koh Larn','koh-lipe':'Koh Lipe','koh-mak':'Koh Mak','koh-phangan':'Koh Phangan','krabi':'Krabi','lampang':'Lampang','lamphun':'Lamphun','loei':'Loei','lopburi':'Lopburi','mae-hong-son':'Mae Hong Son','maha-sarakham':'Maha Sarakham','mukdahan':'Mukdahan','nakhon-nayok':'Nakhon Nayok','nakhon-pathom':'Nakhon Pathom','nakhon-phanom':'Nakhon Phanom','nakhon-ratchasima':'Nakhon Ratchasima','nakhon-sawan':'Nakhon Sawan','nakhon-si-thammarat':'Nakhon Si Thammarat','nan':'Nan','narathiwat':'Narathiwat','nong-bua-lamphu':'Nong Bua Lamphu','nong-khai':'Nong Khai','nonthaburi':'Nonthaburi','pai':'Pai','pathum-thani':'Pathum Thani','pattani':'Pattani','pattaya':'Pattaya','phang-nga':'Phang Nga','phatthalung':'Phatthalung','phayao':'Phayao','phetchabun':'Phetchabun','phetchaburi':'Phetchaburi','phichit':'Phichit','phitsanulok':'Phitsanulok','phrae':'Phrae','phuket':'Phuket','prachinburi':'Prachinburi','prachuap-khiri-khan':'Prachuap Khiri Khan','ranong':'Ranong','ratchaburi':'Ratchaburi','rayong':'Rayong','roi-et':'Roi Et','sa-kaeo':'Sa Kaeo','sakon-nakhon':'Sakon Nakhon','samui':'Koh Samui','samut-prakan':'Samut Prakan','samut-sakhon':'Samut Sakhon','samut-songkhram':'Samut Songkhram','saraburi':'Saraburi','satun':'Satun','sing-buri':'Sing Buri','sisaket':'Sisaket','songkhla':'Songkhla','sukhothai':'Sukhothai','suphan-buri':'Suphan Buri','surat-thani':'Surat Thani','surin':'Surin','tak':'Tak','trang':'Trang','trat':'Trat','ubon-ratchathani':'Ubon Ratchathani','udon-thani':'Udon Thani','uthai-thani':'Uthai Thani','uttaradit':'Uttaradit','yala':'Yala','yasothon':'Yasothon',
};
let LOC = 'th';                                  // current locale being generated
const tx = (th, en) => LOC === 'en' ? en : th;   // pick locale string
const NAME = slug => LOC === 'en' ? (EN_NAME[slug] || slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())) : (TH[slug] || slug);
const RNAME = r => LOC === 'en' ? REGION[r].en : REGION[r].th;
const RINTRO = r => LOC === 'en' ? REGION[r].intro_en : REGION[r].intro;
const PFX = () => LOC === 'en' ? '/en/' : '/';    // home href for current locale
const ALT = slug => LOC === 'en' ? '/'+slug+'.html' : '/en/'+slug+'.html'; // other-locale URL of this page

const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const imgUrl = s => !s ? '' : (/^(https?:|\/)/.test(s) ? s : '/'+s);
const stripTags = s => String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

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
    try{ const a=JSON.parse(fs.readFileSync(path.join(ARTDIR,f),'utf8')); (ARTS[a.cluster] ||= []).push({slug:a.slug,type:a.type,title:(a.h1||a.title||a.slug),heroImg:imgUrl(a.heroImg||'')}); }catch{}
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
.dbody{padding:15px 17px 17px}.dbody h3{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:17px;line-height:1.3}.dbody .go{font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12.5px;font-weight:800;color:var(--bl);margin-top:10px;display:inline-block}.dcard:hover .dbody .go{color:var(--or-dk)}
/* HIGHLIGHT / FOOD / INFO / NEIGHBOR */
.hl{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:8px}@media(max-width:760px){.hl{grid-template-columns:1fr}}
.hlc{background:#fff;border:1px solid var(--bdr);border-radius:18px;padding:20px;box-shadow:var(--sh)}.hlc h3{font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:16px;margin-bottom:5px}.hlc p{font-size:13.5px;color:var(--sub)}
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
.affcard{background:#fff;border:1px solid var(--bdr);border-radius:18px;padding:24px 22px;text-align:center;box-shadow:var(--sh)}.affcard .adot{width:16px;height:16px;border-radius:50%;display:inline-block;margin-right:7px;vertical-align:-2px}.affcard .an{font-family:'Outfit',sans-serif;font-weight:800;font-size:16px;margin-bottom:6px}.affcard p{font-size:12.5px;color:var(--sub);margin-bottom:14px}.affcard a{display:inline-block;background:var(--ink);color:#fff;font-family:'Outfit','Noto Sans Thai',sans-serif;font-weight:800;font-size:13px;padding:11px 22px;border-radius:30px}
/* SEO */
.seo{max-width:1120px;margin:0 auto;padding:8px 28px 40px}.seobox{background:var(--bl-lt);border-radius:20px;padding:28px 30px}.seobox h2{font-family:'Fraunces',-apple-system,'Noto Sans Thai',serif;font-weight:500;font-size:22px;margin-bottom:12px}.seobox p{font-size:14px;color:#334155;line-height:1.85;margin-bottom:10px}.seobox b{color:var(--ink)}
</style>`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">`;

function navHtml(slug){
  const lbTH = `<button class="lb${LOC==='th'?' active':''}"${LOC==='th'?'':` onclick="location.href='/${slug}.html'"`}>TH</button>`;
  const lbEN = `<button class="lb${LOC==='en'?' active':''}"${LOC==='en'?'':` onclick="location.href='/en/${slug}.html'"`}>EN</button>`;
  return `<nav class="nav">
  <a href="${PFX()}" class="logo">Thailand<em>Addict</em></a>
  <div class="nav-mid">
    <div class="has-drop"><a href="country-thailand.html">${tx('จุดหมาย','Destinations')}</a><div class="drop"><span class="h">${tx('✨ ยอดนิยม','✨ Popular')}</span><a href="destinations.html">${tx('🔥 เมืองท่องเที่ยว','🔥 Top Cities')}</a><span class="h">${tx('🇹🇭 6 ภาค','🇹🇭 6 Regions')}</span><a href="region-north.html">${tx('⛰️ ภาคเหนือ','⛰️ North')}</a><a href="region-isan.html">${tx('🌾 ภาคอีสาน','🌾 Isan')}</a><a href="region-central.html">${tx('🏙️ ภาคกลาง','🏙️ Central')}</a><a href="region-east.html">${tx('🏝️ ภาคตะวันออก','🏝️ East')}</a><a href="region-west.html">${tx('🌅 ภาคตะวันตก','🌅 West')}</a><a href="region-south.html">${tx('🌊 ภาคใต้','🌊 South')}</a><a href="country-thailand.html" style="font-weight:700;color:var(--bl-dk)">${tx('→ ดูทั้ง 77 จังหวัด','→ All 77 provinces')}</a></div></div>
    <div class="has-drop"><a href="top10-hotels-chiang-mai.html">${tx('โรงแรม','Hotels')}</a><div class="drop"><span class="h">${tx('จัดอันดับยอดนิยม','Top Rankings')}</span><a href="top10-hotels-chiang-mai.html">Top 10 ${tx('เชียงใหม่','Chiang Mai')}</a><a href="top10-hotels-bangkok.html">Top 10 ${tx('กรุงเทพ','Bangkok')}</a><a href="top10-hotels-phuket.html">Top 10 ${tx('ภูเก็ต','Phuket')}</a><a href="top10-hotels-krabi.html">Top 10 ${tx('กระบี่','Krabi')}</a></div></div>
    <a href="country-thailand.html">${tx('กิน-เที่ยว','Eat &amp; Explore')}</a>
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
  <a href="country-thailand.html" style="font-weight:700;color:var(--bl)">${tx('🇹🇭 จุดหมาย · 77 จังหวัด','🇹🇭 Destinations · 77 provinces')}</a><a href="destinations.html">${tx('🔥 เมืองท่องเที่ยว','🔥 Top Cities')}</a><a href="region-north.html">${tx('⛰️ ภาคเหนือ','⛰️ North')}</a><a href="region-central.html">${tx('🏙️ ภาคกลาง','🏙️ Central')}</a><a href="region-south.html">${tx('🌊 ภาคใต้','🌊 South')}</a><a href="top10-hotels-chiang-mai.html" style="font-weight:700;color:var(--bl)">${tx('🏨 โรงแรม · จัดอันดับ','🏨 Hotels · Rankings')}</a><a href="plan-your-trip.html">${tx('🧭 เตรียมตัวเที่ยว','🧭 Plan Your Trip')}</a><a href="about.html">${tx('เกี่ยวกับเรา','About')}</a><a href="contact.html">${tx('ติดต่อ','Contact')}</a>
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
  const verb = tx('เที่ยว','Explore '), empty = tx('ไม่พบจังหวัด','No provinces found');
  return `<script>
var __SP=${SP_JSON};
(function(){var hb=document.getElementById('hb'),mm=document.getElementById('mm'),mmx=document.getElementById('mmx');if(hb){hb.onclick=function(){mm.classList.add('open')};mmx.onclick=function(){mm.classList.remove('open')};}
var ns=document.getElementById('navsearch'),nd=document.getElementById('navdrop');
if(ns){ns.addEventListener('input',function(){var q=ns.value.trim().toLowerCase();if(!q){nd.classList.remove('show');return;}var r=__SP.filter(function(p){return p[1].toLowerCase().indexOf(q)>-1||p[0].indexOf(q)>-1;}).slice(0,8);nd.innerHTML=r.length?r.map(function(p){return '<a href="city-'+p[0]+'.html"><div class="t">${verb}'+p[1]+'</div><div class="c">city-'+p[0]+'</div></a>';}).join(''):'<div class="empty">${empty}</div>';nd.classList.add('show');});
document.addEventListener('click',function(e){if(!e.target.closest('.search-box'))nd.classList.remove('show');});}})();
</script>`;
}

function page({ title, desc, slug, jsonld, body, extraJS, image }) {
  const canon = `https://thailandaddict.com/${LOC==='en'?'en/':''}${slug}`;
  const altTH = `https://thailandaddict.com/${slug}`;
  const altEN = `https://thailandaddict.com/en/${slug}`;
  const ogImg = image ? (/^https?:/.test(image) ? image : 'https://thailandaddict.com' + image) : 'https://thailandaddict.com/images/heroes/krabi.jpg';
  return `<!doctype html>
<html lang="${LOC}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canon}">
<link rel="alternate" hreflang="th" href="${altTH}"><link rel="alternate" hreflang="en" href="${altEN}"><link rel="alternate" hreflang="x-default" href="${altTH}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%2306B6D4'/%3E%3Ctext x='50' y='70' font-family='Georgia,serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E">
<meta property="og:site_name" content="ThailandAddict"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}"><meta property="og:type" content="website">
<meta property="og:image" content="${ogImg}"><meta property="og:locale" content="${LOC==='en'?'en_US':'th_TH'}"><meta name="theme-color" content="#06B6D4">
${FONTS}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
${CSS}
</head><body>
${navHtml(slug)}
${body}
${footerHtml()}
${commonJs()}${extraJS||''}
</body></html>`;
}

function crumb(parts){
  return `<div class="crumb">`+parts.map((p,i)=> i<parts.length-1 ? `<a href="${p.href}">${esc(p.t)}</a> › ` : `<span>${esc(p.t)}</span>`).join('')+`</div>`;
}
function artCards(cluster, types){
  const list=(ARTS[cluster]||[]).filter(a=>types.includes(a.type));
  if(!list.length) return '';
  return `<div class="dgrid">`+list.map(a=>`<a class="dcard" href="${a.slug}.html"><div class="dphoto">${a.heroImg?`<img src="${a.heroImg}" alt="${esc(stripTags(a.title))}" loading="lazy" onerror="this.style.opacity=0">`:''}</div><div class="dbody"><h3>${esc(stripTags(a.title))}</h3><span class="go">${tx('อ่านบทความ →','Read article →')}</span></div></a>`).join('')+`</div>`;
}
function hotelCards(slug){
  const list=(REVS[slug]||[]).slice().sort((a,b)=>b.score-a.score);
  if(!list.length) return `<p class="pintro">${tx('รีวิวโรงแรมกำลังจัดทำ — เร็ว ๆ นี้','Hotel reviews coming soon')}</p>`;
  return `<div class="hgrid">`+list.map(h=>{
    const stars=h.star?`<div class="hc-stars">${'★'.repeat(h.star)}</div>`:'';
    const sc=h.score?`<span class="hc-score">${h.score.toFixed(1)}</span>`:'';
    const price=h.price?`<div class="hc-price">${tx('เริ่มประมาณ','From approx.')} <b>${esc(h.price)}</b></div>`:'';
    const bk=(h.agoda?`<a class="hbtn bk1" href="${h.agoda}" target="_blank" rel="nofollow noopener">Agoda</a>`:'')+(h.booking?`<a class="hbtn bk2" href="${h.booking}" target="_blank" rel="nofollow noopener">Booking</a>`:'')+(h.trip?`<a class="hbtn bk3" href="${h.trip}" target="_blank" rel="nofollow noopener">Trip</a>`:'');
    return `<div class="hcard"><div class="hc-img">${h.img?`<img src="${h.img}" alt="${esc(h.name)}" loading="lazy" onerror="this.style.opacity=0">`:''}${sc}</div><div class="hc-body"><div class="hc-name">${esc(h.name)}</div>${stars}<div class="hc-type">${esc(h.type)}</div>${h.loc?`<div class="hc-loc">📍 ${esc(h.loc)}</div>`:''}${price}<a class="hview" href="${h.slug}.html">${tx('ดูรีวิวเต็ม →','Read full review →')}</a>${bk?`<div class="hbtns">${bk}</div>`:''}</div></div>`;
  }).join('')+`</div>`;
}

// ── province hub (5-tab) ──
function provinceHub(slug, th, r, d){
  const R = REGION[r];
  const nm = NAME(slug);
  const tagline = d.tagline || tx(`เที่ยว${th}`,`Explore ${nm}`);
  const best = d.bestTime || tx('เที่ยวได้ตลอดปี','Good year-round');
  const emoji = d.heroEmoji || R.emoji;
  const heroSrc = fs.existsSync(path.join(PUB,'images/heroes',slug+'.jpg')) ? `/images/heroes/${slug}.jpg`
    : (fs.existsSync(path.join(PUB,'images/cities',slug+'.jpg')) ? `/images/cities/${slug}.jpg` : '');
  const arts = ARTS[slug]||[];
  const cSee=arts.filter(a=>a.type==='attraction').length, cEat=arts.filter(a=>['food','eat-ranking'].includes(a.type)).length, cPlan=arts.filter(a=>a.type==='itinerary').length, cStay=(REVS[slug]||[]).length;
  const hi=(d.highlights||[]).map(h=>`<div class="hlc"><h3>${esc(h.name)}</h3><p>${esc(h.blurb)}</p></div>`).join('');
  const food=(d.foodScene||[]).map(f=>`<div class="fc"><h4>${esc(f.name)}</h4><p>${esc(f.note)}</p></div>`).join('');
  const arrow=tx(' →',' →');
  const nbrs=(d.neighbors||[]).filter(n=>TH[n]).map(n=>`<a class="nc" href="city-${n}.html">${NAME(n)}${arrow}</a>`).join('');
  const tipsArt=arts.find(a=>/travel-tips$/.test(a.slug)), moveArt=arts.find(a=>/getting-around$/.test(a.slug));
  const J = p => `https://thailandaddict.com/${LOC==='en'?'en/':''}${p}`;
  const jsonld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},
    {"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')},
    {"@type":"ListItem","position":3,"name":RNAME(r),"item":J(`region-${R.slug}`)},
    {"@type":"ListItem","position":4,"name":nm,"item":J(`city-${slug}`)}]};
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
  const nbCards=(d.neighbors||[]).filter(n=>TH[n]).map(n=>{const nd=readData(n);return provCard(n,NAME(n),(nd&&nd.heroEmoji)||'📍',(nd&&nd.tagline)||tx(`เที่ยว${TH[n]}`,`Explore ${NAME(n)}`))}).join('');
  const aff=`<div class="affgrid"><div class="affcard"><div class="an"><span class="adot" style="background:#ff5a1f"></span>Agoda</div><p>${tx('คนไทยใช้เยอะที่สุด · cashback บ่อย · จ่ายเงินไทยได้','Most popular in Thailand · frequent cashback · pay in THB')}</p><a href="https://www.agoda.com/?cid=1965862" target="_blank" rel="nofollow noopener">${tx('ค้นหาบน Agoda →','Search on Agoda →')}</a></div><div class="affcard"><div class="an"><span class="adot" style="background:#003580"></span>Booking.com</div><p>${tx('ห้องเยอะที่สุด · ยกเลิกได้ส่วนใหญ่ · UI สะอาด','Largest inventory · mostly free cancellation · clean UI')}</p><a href="https://www.booking.com/" target="_blank" rel="nofollow noopener">${tx('ค้นหาบน Booking →','Search on Booking →')}</a></div><div class="affcard"><div class="an"><span class="adot" style="background:#2577e3"></span>Trip.com</div><p>${tx('ราคาคุ้มในเอเชีย · ดีลบ่อย · สะสมแต้มได้','Great value in Asia · frequent deals · earn points')}</p><a href="https://www.trip.com/?Allianceid=6861268&SID=312919111" target="_blank" rel="nofollow noopener">${tx('ค้นหาบน Trip.com →','Search on Trip.com →')}</a></div></div>`;
  const tab=(id,emo,label,count)=>`<div class="tab${id==='stay'?' active':''}" data-tab="${id}">${emo} ${label}${count?`<span class="tc">${count}</span>`:''}</div>`;
  const body=`
${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:RNAME(r),href:`region-${R.slug}.html`},{t:nm}])}
<div class="phero">${heroSrc?`<img src="${heroSrc}" alt="${esc(nm)}" loading="eager" onerror="this.style.opacity=0">`:''}
  <div class="pherobody"><span class="pheye">${emoji} ${RNAME(r)}</span><h1>${tx(`เที่ยว<em>${th}</em>`,`Explore <em>${nm}</em>`)}</h1><p class="phlead">${esc(tagline)}</p>
  <div class="phchips">${chips}</div></div>
</div>
<div class="cstats"><div class="cstat"><div class="n">${cStay}</div><div class="l">${tx('รีวิวที่พัก','Stays reviewed')}</div></div><div class="cstat"><div class="n">${arts.length}</div><div class="l">${tx('บทความเที่ยว','Travel articles')}</div></div><div class="cstat"><div class="n">${avg}</div><div class="l">${tx('คะแนนเฉลี่ย','Avg score')}</div></div><div class="cstat"><div class="n">${minP}</div><div class="l">${tx('ราคาเริ่มต้น/คืน','From /night')}</div></div></div>
<div class="updatepill"><span>${tx(`📅 อัปเดต 2026 · เรียบเรียงโดยทีม ThailandAddict · ${cStay} รีวิวจริง · ไม่มีโฆษณาแฝง`,`📅 Updated 2026 · curated by the ThailandAddict team · ${cStay} real reviews · no hidden ads`)}</span></div>
<div class="section"><div class="introgrid"><div><div class="slbl">${tx(`ทำไมต้องไป${th}`,`Why visit ${nm}`)}</div><h2>${tx(`เที่ยว${th} <em>ให้ครบในที่เดียว</em>`,`${nm} <em>— all in one place</em>`)}</h2><p class="ssub">${esc(intro.slice(0,280))}</p><a class="introbtn" href="top10-hotels-${slug}.html">${tx('เริ่มจากที่พัก →','Start with stays →')}</a></div><div class="icards">${introCards}</div></div></div>
${ep?`<div class="section"><div class="sh"><div class="slbl">⭐ Editor's Picks</div><h2>${tx('แนะนำที่เที่ยว<em>ที่น่าสนใจ</em>','Standout <em>things to do</em>')}</h2><p>${tx(`ประสบการณ์เด่นของ${th} — มาทริปแรกห้ามพลาด`,`The best of ${nm} — don't miss these on a first trip`)}</p></div><div class="ep-grid">${ep}</div></div>`:''}
<div class="section" style="padding-bottom:0"><div class="sh"><div class="slbl">${tx('บทความที่เราเขียน','Our articles')}</div><h2>${tx('เลือกอ่าน<em>สิ่งที่คุณสนใจ</em>','Read <em>what interests you</em>')}</h2><p>${tx('เลือกแท็บเพื่อดูที่พัก ที่เที่ยว ที่กิน แผนเที่ยว และการเตรียมตัว','Pick a tab for stays, sights, food, itineraries and prep')}</p></div></div>
<div class="tabwrap"><div class="tabbar">
  ${tab('stay','🏨',tx('ที่พัก','Stays'),cStay)}${tab('see','📍',tx('ที่เที่ยว','See'),cSee)}${tab('eat','🍜',tx('ที่กิน','Eat'),cEat)}${tab('plan','🗺️',tx('แผนเที่ยว','Plan'),cPlan)}${tab('prep','🎒',tx('เตรียมตัว','Prep'),0)}
</div></div>
<div class="cwrap">
<section class="panel active" id="p-stay">
  <div class="callout"><div><h3>${tx(`Top 10 โรงแรม${th}`,`Top 10 ${nm} Hotels`)}${hasRoundup(slug)?'':` <span style="font-size:12px;color:#c2410c">${tx('· กำลังจัดทำ','· coming soon')}</span>`}</h3><p>${tx('รีวิวรวมจัดอันดับ + รีวิวแยกรายโรงแรม เทียบราคา Agoda · Booking · Trip.com','A ranked roundup plus per-hotel reviews, with prices compared across Agoda · Booking · Trip.com')}</p></div><a href="top10-hotels-${slug}.html">${tx('ดูอันดับที่พัก →','See the ranking →')}</a></div>
  <p class="pintro">${tx(`รีวิวที่พัก${th} คัดจากเสียงรีวิวจริง — บอกตรงทั้งข้อดีข้อเสีย พร้อมช่วงราคาและลิงก์จอง`,`${nm} stays picked from real reviews — honest about the good and the bad, with price ranges and booking links`)}</p>
  ${hotelCards(slug)}
</section>
<section class="panel" id="p-see"><h2 class="pnhead">${tx(`ที่เที่ยว<em> ${th}</em>`,`Things to do<em> in ${nm}</em>`)}</h2><p class="pintro">${tx(`ไฮไลต์และที่เที่ยว${th} ทั้งสายธรรมชาติ เมือง และวัฒนธรรม`,`Highlights and sights around ${nm} — nature, city and culture`)}</p>${hi?`<div class="hl">${hi}</div>`:''}${artCards(slug,['attraction'])||`<p class="pintro">${tx('บทความที่เที่ยวกำลังจัดทำ','Attraction articles coming soon')}</p>`}</section>
<section class="panel" id="p-eat"><h2 class="pnhead">${tx(`ที่กิน<em> ${th}</em>`,`Where to eat<em> in ${nm}</em>`)}</h2><p class="pintro">${tx(`ของกินเด่นของ${th} — รวมและจัดอันดับร้านจริงที่คนพื้นที่ไป`,`${nm}'s signature food — real local spots, rounded up and ranked`)}</p>${food?`<div class="foodgrid">${food}</div>`:''}${artCards(slug,['food','eat-ranking'])||`<p class="pintro">${tx('บทความที่กินกำลังจัดทำ','Food articles coming soon')}</p>`}</section>
<section class="panel" id="p-plan"><h2 class="pnhead">${tx(`แผน<em>เที่ยว ${th}</em>`,`<em>${nm}</em> itineraries`)}</h2><p class="pintro">${tx('แผนเที่ยวคัดมาให้ ตั้งแต่ไปเช้าเย็นกลับ 2-3 วัน ถึงแผนข้ามจังหวัดข้างเคียง','Ready-made plans — from a day trip to 2–3 days, plus routes to neighbouring provinces')}</p>${artCards(slug,['itinerary'])||`<p class="pintro">${tx('แผนเที่ยวกำลังจัดทำ','Itineraries coming soon')}</p>`}${nbrs?`<h2 class="pnhead">${tx('เที่ยวต่อ<em>จังหวัดข้างเคียง</em>','Continue to <em>nearby provinces</em>')}</h2><div class="ncards">${nbrs}</div>`:''}</section>
<section class="panel" id="p-prep"><h2 class="pnhead">${tx(`เตรียมตัว<em>เที่ยว ${th}</em>`,`Planning <em>your ${nm} trip</em>`)}</h2><p class="pintro">${tx(`ช่วงเวลาที่เหมาะ การเดินทาง และสิ่งที่ควรรู้ก่อนไป${th}`,`Best time to go, getting around, and what to know before visiting ${nm}`)}</p>
  <div class="eeat"><div class="ecard"><div class="ic">🗓️</div><h3>${tx('ช่วงเวลาแนะนำ','Best time')}</h3><p>${esc(best)}</p></div><div class="ecard"><div class="ic">🚗</div><h3>${tx('การเดินทาง','Getting around')}</h3><p>${moveArt?tx(`อ่านวิธีเดินทางใน${th}แบบละเอียด · <a href="${moveArt.slug}.html" style="color:var(--bl-dk);font-weight:700">เปิดคู่มือ →</a>`,`A detailed guide to getting around ${nm} · <a href="${moveArt.slug}.html" style="color:var(--bl-dk);font-weight:700">Open guide →</a>`):tx(`วิธีไป${th}และเดินทางในจังหวัด`,`How to reach ${nm} and get around`)}</p></div><div class="ecard"><div class="ic">📍</div><h3>${tx('ภาค','Region')}</h3><p>${RNAME(r)} · <a href="region-${R.slug}.html" style="color:var(--bl-dk);font-weight:700">${tx(`เที่ยว${R.th} →`,`Explore ${RNAME(r)} →`)}</a></p></div><div class="ecard"><div class="ic">🎒</div><h3>${tx('เตรียมตัว','Prep')}</h3><p>${tipsArt?tx(`เช็กลิสต์เตรียมตัว · <a href="${tipsArt.slug}.html" style="color:var(--bl-dk);font-weight:700">อ่านทิป →</a>`,`A prep checklist · <a href="${tipsArt.slug}.html" style="color:var(--bl-dk);font-weight:700">Read tips →</a>`):tx(`สิ่งที่ควรเตรียมไป${th}`,`What to pack for ${nm}`)}</p></div></div>
  ${artCards(slug,['prep','guide'])?`<h2 class="pnhead">${tx('คู่มือ<em>เตรียมตัว</em>','Prep <em>guides</em>')}</h2>${artCards(slug,['prep','guide'])}`:''}</section>
</div>
${hoods?`<div class="section"><div class="sh"><div class="slbl">${tx('ไฮไลต์ยอดนิยม','Top highlights')}</div><h2>${tx(`ที่ต้องไปให้ครบใน<em>${th}</em>`,`Don't-miss spots in <em>${nm}</em>`)}</h2></div><div class="hoodgrid">${hoods}</div></div>`:''}
<div class="section"><div class="sh"><div class="slbl">${tx('🔎 ค้นหาเอง','🔎 Search yourself')}</div><h2>${tx('ไม่เห็นที่ใช่? <em>ค้นเองได้ทั้ง 3 เว็บ</em>','Nothing quite right? <em>Search all 3 sites</em>')}</h2><p>${tx(`เทียบราคาที่พัก${th}เองทั้ง Agoda · Booking · Trip.com`,`Compare ${nm} stays yourself across Agoda · Booking · Trip.com`)}</p></div>${aff}</div>
${nbCards?`<div class="section"><div class="sh"><div class="slbl">${tx('📍 เที่ยวต่อ','📍 Keep exploring')}</div><h2>${tx(`ถ้าชอบ${th} <em>ลองจังหวัดข้างเคียง</em>`,`If you like ${nm}, <em>try a nearby province</em>`)}</h2></div><div class="dgrid">${nbCards}</div></div>`:''}
<div class="seo"><div class="seobox"><h2>${tx(`เกี่ยวกับ — เที่ยว${th}`,`About — ${nm}`)}</h2>${d.introHtml||tx(`<p>คู่มือเที่ยว${th} ครบทั้งที่พัก ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริงในพื้นที่</p>`,`<p>A complete ${nm} guide — stays, sights, food and itineraries, picked from the real thing on the ground.</p>`)}<p><b>${tx('ช่วงเวลาแนะนำ:','Best time:')}</b> ${esc(best)}</p></div></div>
<div class="cta-sec"><div class="ctaband"><h2>${tx(`วางแผนเที่ยว${th}`,`Plan your ${nm} trip`)}</h2><p>${tx('ที่พัก ที่เที่ยว ของกิน และแผนเดินทาง — รวบไว้ให้แล้ว','Stays, sights, food and routes — all gathered for you')}</p><a href="top10-hotels-${slug}.html">${tx('เริ่มจากที่พัก →','Start with stays →')}</a></div></div>`;
  const extraJS=`<script>(function(){var tabs=[].slice.call(document.querySelectorAll('.tab')),panels=[].slice.call(document.querySelectorAll('.panel'));function act(id,scroll){tabs.forEach(function(t){t.classList.toggle('active',t.dataset.tab===id)});panels.forEach(function(p){p.classList.toggle('active',p.id==='p-'+id)});if(scroll){var w=document.querySelector('.tabwrap');if(w)window.scrollTo({top:w.offsetTop-64,behavior:'smooth'})}}tabs.forEach(function(t){t.addEventListener('click',function(){act(t.dataset.tab,false);history.replaceState(null,'','#'+t.dataset.tab)})});var m={hotels:'stay',stay:'stay',see:'see',eat:'eat',plan:'plan',prep:'prep'},h=(location.hash||'').replace('#','');if(m[h])act(m[h],true);})();</script>`;
  return page({title:tx(`เที่ยว${th} — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict ชีวิตติดเที่ยว`,`${nm} Travel Guide — Hotels, Things to Do, Food & Itineraries | ThailandAddict`),desc:tx(`คู่มือเที่ยว${th} — รีวิวที่พักจัดอันดับ ที่กิน ที่เที่ยว และแผนเที่ยว คัดจากของจริงในพื้นที่ พร้อมเทียบราคาที่พัก`,`A ${nm} travel guide — ranked hotel reviews, food, things to do and itineraries, picked from the real thing, with prices compared.`),slug:`city-${slug}`,jsonld,body,extraJS,image:heroSrc});
}

function provCard(s,th,em,tg){
  const img=fs.existsSync(path.join(PUB,'images/heroes',s+'.jpg'))?`/images/heroes/${s}.jpg`:(fs.existsSync(path.join(PUB,'images/cities',s+'.jpg'))?`/images/cities/${s}.jpg`:'');
  return `<a class="dcard" href="city-${s}.html"><div class="dphoto">${img?`<img src="${img}" alt="${esc(th)}" loading="lazy" onerror="this.style.opacity=0">`:''}<span class="tagn">${em}</span></div><div class="dbody"><h3>${th}</h3><p style="font-size:13px;color:var(--sub);margin-top:3px">${esc(tg)}</p><span class="go">${tx('เที่ยว'+th+' →','Explore '+th+' →')}</span></div></a>`;
}
function regionPage(r){
  const R=REGION[r];const provs=PROVINCES.filter(([,,rr])=>rr===r);const rn=RNAME(r);
  const J = p => `https://thailandaddict.com/${LOC==='en'?'en/':''}${p}`;
  const cards=provs.map(([s,th])=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||R.emoji,(d&&d.tagline)||tx(`เที่ยว${th}`,`Explore ${NAME(s)}`))}).join('');
  const jsonld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},{"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')},{"@type":"ListItem","position":3,"name":rn,"item":J(`region-${R.slug}`)}]};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:rn}])}
<div class="thero"><div class="eyebrow">${R.emoji} ${tx('ภาคของไทย','A region of Thailand')}</div><h1>${tx(`เที่ยว<em>${R.th}</em>`,`Explore <em>${rn}</em>`)}</h1><p class="lead">${RINTRO(r)}</p><div class="chips"><span class="chip">📍 ${provs.length} ${tx('จังหวัด','provinces')}</span><span class="chip">${tx('✅ คัดจากของจริง','✅ picked from the real thing')}</span></div></div>
<section class="sec"><div class="inner"><div class="shead"><h2>${tx(`จังหวัดใน<span class="em">${R.th}</span>`,`Provinces in <span class="em">${rn}</span>`)}</h2><a href="country-thailand.html">${tx('ทุกภาค →','All regions →')}</a></div><div class="dgrid">${cards}</div></div></section>
<div class="cta-sec"><div class="ctaband"><h2>${tx('เลือกจังหวัดที่อยากไป','Pick a province to explore')}</h2><p>${tx('แต่ละจังหวัดมีที่พัก ที่เที่ยว ของกิน และแผนเที่ยวครบ','Every province has stays, sights, food and itineraries')}</p><a href="country-thailand.html">${tx('ดูทั้งประเทศ →','See the whole country →')}</a></div></div>`;
  return page({title:tx(`เที่ยว${R.th} — จังหวัดน่าเที่ยว ที่พัก ที่เที่ยว ของกิน | ThailandAddict`,`${rn} — Provinces, Hotels, Things to Do & Food | ThailandAddict`),desc:tx(`คู่มือเที่ยว${R.th} — รวมจังหวัดน่าเที่ยวพร้อมที่พัก ที่เที่ยว ของกิน และแผนเดินทาง`,`A guide to ${rn} — the best provinces to visit, with stays, sights, food and itineraries.`),slug:`region-${R.slug}`,jsonld,body,image:'/images/heroes/'+({n:'chiang-mai',ne:'nakhon-ratchasima',c:'ayutthaya',e:'trat',w:'kanchanaburi',s:'krabi'}[r]||'krabi')+'.jpg'});
}
function countryHub(){
  const J = p => `https://thailandaddict.com/${LOC==='en'?'en/':''}${p}`;
  const blocks=Object.keys(REGION).map(r=>{const R=REGION[r];const provs=PROVINCES.filter(([,,rr])=>rr===r);const rn=RNAME(r);
    const cards=provs.map(([s,th])=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||R.emoji,(d&&d.tagline)||tx(`เที่ยว${th}`,`Explore ${NAME(s)}`))}).join('');
    return `<section class="regsec"><div class="inner"><div class="shead"><h2>${R.emoji} <span class="em">${rn}</span></h2><a href="region-${R.slug}.html">${tx(`ดู${R.th} →`,`See ${rn} →`)}</a></div><div class="dgrid">${cards}</div></div></section>`;}).join('');
  const jsonld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":tx('หน้าแรก','Home'),"item":J('')},{"@type":"ListItem","position":2,"name":tx('ประเทศไทย','Thailand'),"item":J('country-thailand')}]};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand')}])}
<div class="thero"><div class="eyebrow">${tx('🇹🇭 ชีวิตติดเที่ยว','🇹🇭 Explore Thailand Like a Local')}</div><h1>${tx('เที่ยว<em>ประเทศไทย</em> ครบ 77 จังหวัด','Explore <em>Thailand</em> — all 77 provinces')}</h1><p class="lead">${tx('เลือกภาคและจังหวัดที่อยากไป — แต่ละจังหวัดมีที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริง','Pick a region and province — each one has ranked stays, things to do, food and itineraries, picked from the real thing.')}</p><div class="chips"><span class="chip">🗺️ <b>77</b> ${tx('จังหวัด','provinces')}</span><span class="chip">🧭 <b>6</b> ${tx('ภาค','regions')}</span><span class="chip">✅ <b>100%</b> ${tx('รีวิวจริง','real reviews')}</span></div></div>
<div style="max-width:1120px;margin:0 auto;padding:34px 28px 0">${blocks}</div>
<div class="cta-sec"><div class="ctaband"><h2>${tx('เริ่มวางแผนทริปไทย','Start planning your Thailand trip')}</h2><p>${tx('เลือกจังหวัด แล้วลุยที่พัก ที่เที่ยว ของกิน ได้เลย','Pick a province, then dive into stays, sights and food')}</p><a href="region-north.html">${tx('เริ่มที่ภาคเหนือ →','Start in the North →')}</a></div></div>`;
  return page({title:tx(`เที่ยวไทย 77 จังหวัด — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict ชีวิตติดเที่ยว`,`Explore Thailand — All 77 Provinces, Hotels, Things to Do & Food | ThailandAddict`),desc:tx(`คู่มือเที่ยวไทยครบ 77 จังหวัด 6 ภาค — รีวิวที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเดินทาง คัดจากของจริง`,`A complete Thailand guide — all 77 provinces across 6 regions, with ranked hotel reviews, things to do, food and itineraries.`),slug:`country-thailand`,jsonld,body,image:'/images/heroes/bangkok.jpg'});
}
function destinationsHub(){
  const J = p => `https://thailandaddict.com/${LOC==='en'?'en/':''}${p}`;
  const cards = TOPDEST.filter(s=>TH[s]).map(s=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||'📍',(d&&d.tagline)||tx(`เที่ยว${TH[s]}`,`Explore ${NAME(s)}`))}).join('');
  const dst = DESTINATIONS.filter(([s])=>readData(s));
  const dstCards = dst.map(([s,th])=>{const d=readData(s);return provCard(s,NAME(s),(d&&d.heroEmoji)||'🏝️',(d&&d.tagline)||tx(`เที่ยว${th}`,`Explore ${NAME(s)}`))}).join('');
  const regCards = Object.keys(REGION).map(r=>{const R=REGION[r];const n=PROVINCES.filter(([,,rr])=>rr===r).length;const rn=RNAME(r);
    return `<a class="dcard" href="region-${R.slug}.html"><div class="dphoto" style="display:flex;align-items:center;justify-content:center;font-size:46px">${R.emoji}</div><div class="dbody"><h3>${rn}</h3><p style="font-size:12.5px;color:var(--sub);margin-top:3px;line-height:1.55">${esc(RINTRO(r)).slice(0,66)}…</p><span class="go">${tx(`เที่ยว${R.th} · ${n} จังหวัด →`,`${rn} · ${n} provinces →`)}</span></div></a>`;}).join('');
  const jsonld={"@context":"https://schema.org","@type":"ItemList","name":tx("เมืองท่องเที่ยวยอดนิยมในไทย","Top tourist cities in Thailand"),"itemListElement":TOPDEST.filter(s=>TH[s]).map((s,i)=>({"@type":"ListItem","position":i+1,"name":NAME(s),"url":J(`city-${s}`)}))};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:tx('เมืองท่องเที่ยว','Top Cities')}])}
<div class="thero"><div class="eyebrow">${tx('🔥 ยอดนิยม','🔥 Popular')}</div><h1>${tx('เมือง<em>ท่องเที่ยว</em>ยอดนิยม','Top <em>tourist cities</em>')}</h1><p class="lead">${tx('รวมเมืองที่คนไปเที่ยวมากที่สุดทั่วไทย — ทะเล เกาะ ภูเขา เมืองเก่า คาเฟ่ ครบทุกสาย แต่ละเมืองคัดที่พัก ที่เที่ยว ของกิน และแผนเที่ยวให้พร้อมลุย','The cities people travel to most across Thailand — beaches, islands, mountains, old towns and cafés. Each one comes with hand-picked stays, sights, food and itineraries.')}</p><div class="chips"><span class="chip">🔥 <b>${TOPDEST.length}</b> ${tx('เมืองยอดนิยม','top cities')}</span><span class="chip">🧭 <b>6</b> ${tx('ภาค','regions')}</span><span class="chip">${tx('✅ คัดจากของจริง','✅ picked from the real thing')}</span></div></div>
<section class="sec"><div class="inner"><div class="shead"><h2>${tx('เมือง<span class="em">ท่องเที่ยวยอดนิยม</span>','Top <span class="em">tourist cities</span>')}</h2><a href="country-thailand.html">${tx('ดูทั้ง 77 จังหวัด →','All 77 provinces →')}</a></div><div class="dgrid">${cards}</div></div></section>
${dst.length?`<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('เกาะ &amp; <span class="em">จุดหมายเฉพาะทาง</span>','Islands &amp; <span class="em">special destinations</span>')}</h2><span style="font-size:13px;color:var(--sub)">${dst.length} ${tx('จุดหมาย','destinations')}</span></div><div class="dgrid">${dstCards}</div></div></section>`:''}
<section class="sec" style="padding-top:0"><div class="inner"><div class="shead"><h2>${tx('หรือเลือก<span class="em">ตามภาค</span>','Or browse <span class="em">by region</span>')}</h2><a href="country-thailand.html">${tx('ทุกภาค →','All regions →')}</a></div><div class="dgrid">${regCards}</div></div></section>
<div class="cta-sec"><div class="ctaband"><h2>${tx('เลือกเมืองที่อยากไป','Pick a city to explore')}</h2><p>${tx('แต่ละเมืองมีที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเที่ยวครบ คัดจากเสียงรีวิวจริง','Every city has ranked stays, things to do, food and itineraries, picked from real reviews')}</p><a href="country-thailand.html">${tx('ดูทั้งประเทศ →','See the whole country →')}</a></div></div>`;
  return page({title:tx(`เมืองท่องเที่ยวยอดนิยมในไทย — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict ชีวิตติดเที่ยว`,`Top Tourist Cities in Thailand — Hotels, Things to Do & Food | ThailandAddict`),desc:tx(`รวมเมืองท่องเที่ยวยอดนิยมทั่วไทย — กรุงเทพ เชียงใหม่ ภูเก็ต กระบี่ พัทยา หัวหิน และอีกมาก พร้อมที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเดินทาง`,`Thailand's most popular tourist cities — Bangkok, Chiang Mai, Phuket, Krabi, Pattaya, Hua Hin and more, with ranked stays, things to do, food and itineraries.`),slug:`destinations`,jsonld,body,image:'/images/heroes/phuket.jpg'});
}
// ── Plan Your Trip hub (Essential guides cluster) ──
function planHub(){
  const J = p => `https://thailandaddict.com/${LOC==='en'?'en/':''}${p}`;
  const G = [
    ['thailand-visa-guide','🛂','วีซ่า & การเข้าเมือง','Visa & entry','ใครได้ยกเว้นวีซ่า อยู่ได้กี่วัน + บัตร TDAC','Who’s visa-free, how long + the TDAC card'],
    ['thailand-esim-internet','📶','ซิม & อินเทอร์เน็ต','eSIM & internet','eSIM กับซิมสนามบิน แบบไหนคุ้ม','eSIM vs airport SIM — which wins'],
    ['getting-around-thailand','🚌','การเดินทางในไทย','Getting around','เครื่องบิน รถไฟ เรือ BTS Grab มอเตอร์ไซค์','Flights, trains, ferries, BTS, Grab, bikes'],
    ['best-time-to-visit-thailand','🗓️','ช่วงเวลา & อากาศ','Best time & weather','อากาศรายเดือน + อ่าวไทย vs อันดามัน','Month-by-month + Gulf vs Andaman'],
    ['thailand-travel-budget','💰','งบเที่ยวต่อวัน','Daily budget','แบ็คแพ็ค กลาง หรู ใช้วันละเท่าไหร่','Backpacker, mid-range, luxury per day'],
    ['thailand-safety-scams','🛡️','ความปลอดภัย & สแกม','Safety & scams','กลโกงยอดฮิต + เบอร์ฉุกเฉิน','Common scams + emergency numbers'],
    ['thailand-money-atm-tipping','🏧','เงิน ATM & ทิป','Money, ATM & tipping','บัตร เงินสด ค่าธรรมเนียมตู้ ทิป','Cards, cash, ATM fees, tipping'],
    ['thailand-travel-insurance','🩺','ประกันเดินทาง','Travel insurance','ทำไมควรมี + ครอบคลุมมอเตอร์ไซค์','Why you need it + motorbike cover'],
    ['thailand-packing-list','🎒','ลิสต์ของที่ต้องเอาไป','Packing list','เข้าวัด ปลั๊กไฟ หน้าฝน ยา','Temple wear, plugs, rain, meds'],
    ['thai-phrases-for-travelers','🗣️','ประโยคภาษาไทยน่ารู้','Thai phrases','ทักทาย ขอบคุณ ตัวเลข สั่งอาหาร','Greetings, thanks, numbers, food'],
    ['thailand-etiquette-culture','🙏','มารยาท & วัฒนธรรม','Etiquette & culture','ไหว้ เข้าวัด หัว-เท้า สถาบัน','The wai, temples, head/feet, respect'],
  ];
  const cards = G.map(([s,emo,th,en,bth,ben])=>`<a class="dcard" href="${s}.html"><div class="dphoto" style="display:flex;align-items:center;justify-content:center;font-size:46px">${emo}</div><div class="dbody"><h3>${tx(th,en)}</h3><p style="font-size:12.5px;color:var(--sub);margin-top:3px;line-height:1.55">${esc(tx(bth,ben))}</p><span class="go">${tx('อ่านคู่มือ →','Read the guide →')}</span></div></a>`).join('');
  const jsonld={"@context":"https://schema.org","@type":"ItemList","name":tx("คู่มือเตรียมตัวเที่ยวไทย","Plan your Thailand trip"),"itemListElement":G.map((g,i)=>({"@type":"ListItem","position":i+1,"name":tx(g[2],g[3]),"url":J(g[0])}))};
  const body=`${crumb([{t:tx('หน้าแรก','Home'),href:PFX()},{t:tx('ประเทศไทย','Thailand'),href:'country-thailand.html'},{t:tx('เตรียมตัวเที่ยวไทย','Plan Your Trip')}])}
<div class="thero"><div class="eyebrow">${tx('🧭 เตรียมตัวเที่ยวไทย','🧭 Plan Your Trip')}</div><h1>${tx('คู่มือ<em>เตรียมตัว</em>เที่ยวไทย','Plan your <em>Thailand</em> trip')}</h1><p class="lead">${tx('ทุกอย่างที่ควรรู้ก่อนออกเดินทาง — วีซ่า ซิม การเดินทาง งบ ความปลอดภัย และมารยาท รวบไว้ให้อ่านจบในที่เดียว','Everything to sort before you go — visa, SIM, transport, budget, safety and etiquette, all in one place.')}</p><div class="chips"><span class="chip">🧭 <b>${G.length}</b> ${tx('คู่มือ','guides')}</span><span class="chip">${tx('✅ อัปเดต 2026','✅ Updated 2026')}</span><span class="chip">${tx('🆓 อ่านฟรี','🆓 Free to read')}</span></div></div>
<section class="sec"><div class="inner"><div class="shead"><h2>${tx('คู่มือ<span class="em">เตรียมตัว</span>','Essential <span class="em">guides</span>')}</h2><a href="country-thailand.html">${tx('เลือกจังหวัด →','Pick a province →')}</a></div><div class="dgrid">${cards}</div></div></section>
<div class="cta-sec"><div class="ctaband"><h2>${tx('พร้อมแล้ว เลือกจุดหมาย','Ready? Pick a destination')}</h2><p>${tx('อ่านคู่มือเตรียมตัวจบแล้ว ไปต่อที่เมืองและจังหวัดที่อยากเที่ยวได้เลย','Once the basics are planned, dive into the city or province you want to explore')}</p><a href="destinations.html">${tx('ดูเมืองท่องเที่ยว →','See top cities →')}</a></div></div>`;
  return page({title:tx(`เตรียมตัวเที่ยวไทย — วีซ่า ซิม การเดินทาง งบ ความปลอดภัย | ThailandAddict ชีวิตติดเที่ยว`,`Plan Your Thailand Trip — Visa, eSIM, Transport, Budget & Safety | ThailandAddict`),desc:tx(`รวมคู่มือเตรียมตัวก่อนเที่ยวไทย วีซ่าและการเข้าเมือง ซิม/eSIM การเดินทาง งบต่อวัน ความปลอดภัย ประกัน และมารยาทไทย`,`Everything to plan before visiting Thailand — visa & entry, eSIM, getting around, daily budget, safety, insurance and Thai etiquette.`),slug:`plan-your-trip`,jsonld,body,image:'/images/heroes/bangkok.jpg'});
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
  let nD=0;for(const [slug,th,r] of DESTINATIONS){const d=readData(slug);if(!d){nMiss.push(slug);continue;}fs.writeFileSync(path.join(outDir,`city-${slug}.html`),provinceHub(slug,th,r,d));nD++;}
  let nR=0;for(const r of Object.keys(REGION)){fs.writeFileSync(path.join(outDir,`region-${REGION[r].slug}.html`),regionPage(r));nR++;}
  fs.writeFileSync(path.join(outDir,'country-thailand.html'),countryHub());
  fs.writeFileSync(path.join(outDir,'destinations.html'),destinationsHub());
  fs.writeFileSync(path.join(outDir,'plan-your-trip.html'),planHub());
  console.log(`[${loc}] → ${path.relative(ROOT,outDir)} · provinces:${nP} destinations:${nD}/${DESTINATIONS.length} regions:${nR} country:1 destinations-page:1 plan:1`);
  if(nMiss.length) console.log(`   [${loc}] missing data (fallback): ${nMiss.length} → ${nMiss.join(',')}`);
}
// which locales to build: args, default both
const want = process.argv.slice(2).filter(a=>['th','en'].includes(a));
const LOCALES = want.length ? want : ['th','en'];
for(const loc of LOCALES) genAll(loc, loc==='en' ? path.join(PUB,'en') : PUB);
