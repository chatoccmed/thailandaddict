// Generate region + province hub pages from _internal/province-data/*.json, reusing
// the Direction-C design system/chrome extracted from astro/public/index.html.
// Province pages use a 5-tab layout (ที่พัก / ที่เที่ยว / ที่กิน / แผนเที่ยว / เตรียมตัว)
// with a hero image, real hotel-review cards and real article cards.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/Imac/Thailandaddict';
const PUB = path.join(ROOT, 'astro/public');
const DATA = path.join(ROOT, '_internal/province-data');

const REGION = {
  n:  { slug:'north',   th:'ภาคเหนือ',      emoji:'⛰️', intro:'ดอย หมอก เมืองเก่า คาเฟ่ และอาหารเหนือ — เสน่ห์ช้า ๆ ที่ชวนให้อยู่ยาว' },
  ne: { slug:'isan',    th:'ภาคอีสาน',      emoji:'🌾', intro:'ที่ราบสูง วัฒนธรรมสนุก อาหารรสจัด และธรรมชาติริมโขงที่คนยังไปไม่ทั่ว' },
  c:  { slug:'central', th:'ภาคกลาง',       emoji:'🏙️', intro:'กรุงเทพและเมืองรอบ ๆ ประวัติศาสตร์อยุธยา ตลาดน้ำ และที่พักติดรถไฟฟ้า' },
  e:  { slug:'east',    th:'ภาคตะวันออก',   emoji:'🏝️', intro:'ทะเลตะวันออก เกาะช้าง เกาะเสม็ด ผลไม้ และเมืองริมทะเลใกล้กรุง' },
  w:  { slug:'west',    th:'ภาคตะวันตก',    emoji:'🌅', intro:'หัวหิน ปราณบุรี กาญจน์ — น้ำตก ธรรมชาติ และทะเลที่ขับรถจากกรุงเทพไม่ไกล' },
  s:  { slug:'south',   th:'ภาคใต้',        emoji:'🌊', intro:'อันดามันและอ่าวไทย หาดทรายขาว เกาะสวย และอาหารใต้รสจัดจ้าน' },
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
const TH = Object.fromEntries(PROVINCES.map(([s,th])=>[s,th]));

// ---- extract Direction-C chrome from index.html ----
const idx = fs.readFileSync(path.join(PUB,'index.html'),'utf8');
const styleBlock = idx.match(/<style>[\s\S]*?<\/style>/)[0];
const fontsLink = idx.match(/<link href="https:\/\/fonts[^>]*>/)[0];
const navChrome = idx.slice(idx.indexOf('<body>')+6, idx.indexOf('<section class="hero">')).trim();
const footerChrome = idx.slice(idx.indexOf('<footer class="ft">'));  // footer + script + </body></html>

const EXTRA = `<style>
.crumb{max-width:1080px;margin:0 auto;padding:16px 28px 0;font-family:'Outfit',sans-serif;font-size:12.5px;color:var(--sub)}
.crumb a{color:var(--sub)}.crumb a:hover{color:var(--teal)}
/* province hero */
.phero{position:relative;max-width:1080px;margin:16px auto 0;border-radius:28px;overflow:hidden;min-height:360px;display:flex;align-items:flex-end;box-shadow:0 22px 52px rgba(15,23,42,.22);background:linear-gradient(150deg,#0891b2,#22d3ee 55%,#FB7185)}
.phero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.phero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,42,.04) 30%,rgba(15,23,42,.42) 62%,rgba(15,23,42,.82));z-index:1}
.pherobody{position:relative;z-index:2;padding:38px 40px;color:#fff;width:100%}
@media(max-width:600px){.pherobody{padding:24px}.phero{min-height:300px}}
.pheye{display:inline-block;font-family:'Outfit',sans-serif;font-weight:800;font-size:12.5px;letter-spacing:.5px;background:rgba(255,255,255,.22);backdrop-filter:blur(6px);padding:6px 15px;border-radius:999px}
.phero h1{font-family:'Outfit',sans-serif;font-weight:900;font-size:clamp(34px,6vw,58px);line-height:1.04;letter-spacing:-1.5px;margin-top:14px;text-shadow:0 2px 18px rgba(0,0,0,.3)}
.phero h1 em{font-style:normal;color:var(--mango)}
.phlead{max-width:640px;font-family:'Sarabun',sans-serif;font-weight:500;font-size:15.5px;color:rgba(255,255,255,.94);margin-top:10px;text-shadow:0 1px 10px rgba(0,0,0,.3)}
.phchips{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.phchip{font-family:'Outfit',sans-serif;font-weight:700;font-size:12.5px;color:#fff;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.25);padding:8px 15px;border-radius:999px}
/* sticky tab bar */
.tabwrap{position:sticky;top:64px;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--bdr);margin-top:20px}
.tabbar{max-width:1080px;margin:0 auto;display:flex;gap:7px;padding:11px 28px;overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none}
.tabbar::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;font-family:'Outfit',sans-serif;font-weight:800;font-size:14px;color:var(--sub);padding:11px 19px;border-radius:999px;cursor:pointer;border:2px solid transparent;white-space:nowrap;display:flex;align-items:center;gap:8px;transition:.2s;user-select:none}
.tab:hover{color:var(--teal-dk);background:var(--soft)}
.tab.active{color:#fff;background:linear-gradient(135deg,var(--teal),var(--teal-dk));box-shadow:0 8px 18px rgba(6,182,212,.32)}
.tab .tc{font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;background:rgba(15,23,42,.08);color:var(--sub);padding:1px 8px;border-radius:999px}
.tab.active .tc{background:rgba(255,255,255,.28);color:#fff}
.panel{display:none}.panel.active{display:block;animation:pf .35s ease}
@keyframes pf{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pintro{font-family:'Sarabun',sans-serif;font-size:15px;color:var(--sub);max-width:760px;margin:4px 0 22px}
.pnhead{font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;letter-spacing:-.5px;margin:30px 0 4px}
.pnhead .em{color:var(--teal)}
.pnhead:first-child{margin-top:6px}
/* hotel cards */
.hgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}@media(max-width:900px){.hgrid{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.hgrid{grid-template-columns:1fr}}
.hcard{background:#fff;border:1px solid var(--bdr);border-radius:22px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,.05);transition:transform .25s,box-shadow .25s;display:flex;flex-direction:column}
.hcard:hover{transform:translateY(-6px);box-shadow:0 22px 44px rgba(6,182,212,.2)}
.hphoto{position:relative;height:172px;background:linear-gradient(150deg,#0891b2,#22d3ee 55%,#FB7185)}
.hphoto>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hscore{position:absolute;right:12px;top:12px;font-family:'Outfit',sans-serif;font-weight:900;font-size:14px;color:#fff;background:linear-gradient(135deg,var(--mango),#f59e0b);padding:5px 12px;border-radius:999px;z-index:2;box-shadow:0 6px 16px rgba(15,23,42,.25)}
.hbody{padding:15px 18px 18px;display:flex;flex-direction:column;flex:1}
.hbody h3{font-family:'Outfit',sans-serif;font-weight:800;font-size:17px;line-height:1.25}
.hstars{color:var(--mango);font-size:12px;letter-spacing:1px;margin:5px 0 2px}
.htype{font-size:12.5px;color:var(--sub)}
.hloc{font-size:12px;color:var(--sub);margin-top:6px}
.hprice{font-family:'Outfit',sans-serif;font-size:13px;color:var(--sub);margin:10px 0 12px}.hprice b{color:var(--coral-dk);font-size:16px}
.hview{display:block;text-align:center;font-family:'Outfit',sans-serif;font-weight:800;font-size:12.5px;color:var(--teal-dk);background:var(--soft);padding:10px;border-radius:12px;margin-top:auto}
.hview:hover{background:#cffafe}
.hbtns{display:flex;gap:7px;margin-top:8px}
.hbtn{flex:1;text-align:center;font-family:'Outfit',sans-serif;font-weight:800;font-size:12px;padding:9px 4px;border-radius:11px;color:#fff}
.bk1{background:linear-gradient(135deg,var(--coral),var(--coral-dk))}.bk2{background:var(--teal)}.bk3{background:var(--ink)}
/* featured roundup callout */
.callout{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;background:linear-gradient(120deg,#ecfeff,#fff5f7);border:2px solid #cffafe;border-radius:24px;padding:24px 28px;margin-bottom:26px}
.callout h3{font-family:'Outfit',sans-serif;font-weight:800;font-size:21px}.callout p{font-size:13.5px;color:var(--sub);margin-top:3px}
.callout a{font-family:'Outfit',sans-serif;font-weight:800;font-size:13.5px;background:linear-gradient(135deg,var(--coral),var(--coral-dk));color:#fff;padding:13px 24px;border-radius:999px;box-shadow:0 10px 22px rgba(244,63,94,.3);white-space:nowrap}
/* highlight + food + info cards */
.hl{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:8px}@media(max-width:760px){.hl{grid-template-columns:1fr}}
.hlc{background:#fff;border:1px solid var(--bdr);border-radius:18px;padding:20px;box-shadow:0 8px 22px rgba(15,23,42,.05)}
.hlc h3{font-family:'Outfit',sans-serif;font-weight:800;font-size:16px;margin-bottom:5px}.hlc p{font-size:13.5px;color:var(--sub)}
.foodgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:8px}@media(max-width:760px){.foodgrid{grid-template-columns:repeat(2,1fr)}}
.fc{background:#fff;border:1px solid var(--bdr);border-radius:16px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,.04)}
.fc h4{font-family:'Outfit',sans-serif;font-weight:800;font-size:14px}.fc p{font-size:12.5px;color:var(--sub);margin-top:3px}
.ncards{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.nc{font-family:'Outfit',sans-serif;font-weight:700;font-size:13.5px;background:#fff;border:1px solid var(--bdr);border-radius:999px;padding:10px 18px}
.nc:hover{border-color:var(--teal);color:var(--teal-dk)}
.dbody h3{font-size:18px}
.regsec{padding:34px 0;border-bottom:1px solid var(--bdr)}
.cityhero{display:block;width:calc(100% - 56px);max-width:1080px;margin:20px auto 0;border-radius:24px;aspect-ratio:21/9;object-fit:cover;box-shadow:0 18px 44px rgba(15,23,42,.16)}
.secintro{font-size:15px;color:var(--sub);max-width:760px;margin:-10px 0 22px}
.kbadge{display:inline-block;font-family:'Outfit',sans-serif;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:999px;margin-bottom:8px}
.k-nature{background:#dcfce7;color:#15803d}.k-city{background:#cffafe;color:#0891b2}.k-culture{background:#fef3c7;color:#b45309}
</style>`;

const DG = ['d1','d2','d3','d4','d5','d6'];
const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const imgUrl = s => !s ? '' : (/^(https?:|\/)/.test(s) ? s : '/'+s);

function page({ title, desc, slug, jsonld, body }) {
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="https://thailandaddict.com/${slug}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%2306B6D4'/%3E%3Ctext x='50' y='68' font-family='Outfit,sans-serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E">
<meta property="og:site_name" content="ThailandAddict">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="https://thailandaddict.com/${slug}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://thailandaddict.com/images/heroes/thailand.jpg">
<meta property="og:locale" content="th_TH">
<meta name="theme-color" content="#06B6D4">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontsLink}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
${styleBlock}
${EXTRA}
</head>
<body>
${navChrome}
${body}
${footerChrome}`;
}

function crumb(parts){
  return `<div class="crumb">`+parts.map((p,i)=> i<parts.length-1 ? `<a href="${p.href}">${p.t}</a> › ` : `<span>${p.t}</span>`).join('')+`</div>`;
}

// ---- content indexes ----
const ARTDIR = path.join(ROOT,'astro/src/content/articles');
const REVDIR = path.join(ROOT,'astro/src/content/reviews');
const ROUNDDIR = path.join(ROOT,'astro/src/content/roundups');
const stripTags = s => String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const hasRoundup = slug => fs.existsSync(path.join(ROUNDDIR, `top10-hotels-${slug}.json`));

const ARTS = {};
if(fs.existsSync(ARTDIR)) for(const f of fs.readdirSync(ARTDIR).filter(x=>x.endsWith('.json'))){
  try{ const a=JSON.parse(fs.readFileSync(path.join(ARTDIR,f),'utf8')); (ARTS[a.cluster] ||= []).push({slug:a.slug, type:a.type, title:(a.h1||a.title||a.slug), heroImg:imgUrl(a.heroImg||'')}); }catch{}
}
const REVS = {};
if(fs.existsSync(REVDIR)) for(const f of fs.readdirSync(REVDIR).filter(x=>x.endsWith('.json'))){
  try{
    const r=JSON.parse(fs.readFileSync(path.join(REVDIR,f),'utf8'));
    const c = r.cluster || (f.match(/-([a-z-]+)\.json$/)||[])[1] || '';
    if(!c) continue;
    (REVS[c] ||= []).push({
      slug:r.slug, name:r.name||r.slug, score:+(r.score||0), star:+(r.starRating||0),
      type:r.typeFull||r.type||'', price:r.priceRange||r.qiPrice||'',
      loc:r.hiLoc||r.badgeLoc||r.qiCol5Value||r.addressLocality||'',
      img:imgUrl(r.heroImg||r.image||''),
      agoda:r.bookingAgoda||'', booking:r.bookingBooking||'', trip:r.bookingTrip||''
    });
  }catch{}
}

function artCards(cluster, types){
  const list=(ARTS[cluster]||[]).filter(a=>types.includes(a.type));
  if(!list.length) return '';
  return `<div class="dgrid">`+list.map((a,i)=>`<a class="dcard" href="${a.slug}.html"><div class="dphoto ${DG[i%6]}">${a.heroImg?`<img src="${a.heroImg}" alt="${esc(stripTags(a.title))}" loading="lazy" onerror="this.remove()">`:''}</div><div class="dbody"><h3>${esc(stripTags(a.title))}</h3><span class="go">อ่านบทความ →</span></div></a>`).join('')+`</div>`;
}
function hotelCards(slug){
  const list=(REVS[slug]||[]).slice().sort((a,b)=>b.score-a.score);
  if(!list.length) return `<p class="pintro">รีวิวโรงแรมกำลังจัดทำ — เร็ว ๆ นี้</p>`;
  return `<div class="hgrid">`+list.map(h=>{
    const stars = h.star? `<div class="hstars">${'★'.repeat(h.star)}</div>`:'';
    const sc = h.score? `<span class="hscore">${h.score.toFixed(1)}</span>`:'';
    const price = h.price? `<div class="hprice">เริ่มประมาณ <b>${esc(h.price)}</b></div>`:'';
    const bk = (h.agoda?`<a class="hbtn bk1" href="${h.agoda}" target="_blank" rel="nofollow noopener">Agoda</a>`:'')
             +(h.booking?`<a class="hbtn bk2" href="${h.booking}" target="_blank" rel="nofollow noopener">Booking</a>`:'')
             +(h.trip?`<a class="hbtn bk3" href="${h.trip}" target="_blank" rel="nofollow noopener">Trip</a>`:'');
    return `<div class="hcard"><div class="hphoto">${h.img?`<img src="${h.img}" alt="${esc(h.name)}" loading="lazy" onerror="this.remove()">`:''}${sc}</div><div class="hbody"><h3>${esc(h.name)}</h3>${stars}<div class="htype">${esc(h.type)}</div>${h.loc?`<div class="hloc">📍 ${esc(h.loc)}</div>`:''}${price}<a class="hview" href="${h.slug}.html">ดูรีวิวเต็ม →</a>${bk?`<div class="hbtns">${bk}</div>`:''}</div></div>`;
  }).join('')+`</div>`;
}

// ---------- province hub (5-tab) ----------
function provinceHub(slug, th, r, d){
  const R = REGION[r];
  const kindTh={nature:'ธรรมชาติ',city:'เมือง',culture:'วัฒนธรรม'};
  const tagline = d.tagline || `เที่ยว${th}`;
  const intro = stripTags(d.introHtml) || `คู่มือเที่ยว${th} — ที่พัก ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริงในพื้นที่`;
  const best = d.bestTime || 'เที่ยวได้ตลอดปี';
  const emoji = d.heroEmoji || R.emoji;
  const heroSrc = fs.existsSync(path.join(PUB,'images/heroes',slug+'.jpg')) ? `/images/heroes/${slug}.jpg`
    : (fs.existsSync(path.join(PUB,'images/cities',slug+'.jpg')) ? `/images/cities/${slug}.jpg` : '');

  const arts = ARTS[slug]||[];
  const cSee = arts.filter(a=>a.type==='attraction').length;
  const cEat = arts.filter(a=>['food','eat-ranking'].includes(a.type)).length;
  const cPlan = arts.filter(a=>a.type==='itinerary').length;
  const cStay = (REVS[slug]||[]).length;

  const hi = (d.highlights||[]).map(h=>`<div class="hlc"><h3>${esc(h.name)}</h3><p>${esc(h.blurb)}</p></div>`).join('');
  const food = (d.foodScene||[]).map(f=>`<div class="fc"><h4>${esc(f.name)}</h4><p>${esc(f.note)}</p></div>`).join('');
  const nbrs = (d.neighbors||[]).filter(n=>TH[n]).map(n=>`<a class="nc" href="city-${n}.html">${TH[n]} →</a>`).join('');
  const tipsArt = arts.find(a=>/travel-tips$/.test(a.slug));
  const moveArt = arts.find(a=>/getting-around$/.test(a.slug));

  const jsonld = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"หน้าแรก","item":"https://thailandaddict.com/"},
    {"@type":"ListItem","position":2,"name":"ประเทศไทย","item":"https://thailandaddict.com/country-thailand"},
    {"@type":"ListItem","position":3,"name":R.th,"item":`https://thailandaddict.com/region-${R.slug}`},
    {"@type":"ListItem","position":4,"name":th,"item":`https://thailandaddict.com/city-${slug}`}]};

  const tab = (id,emo,label,count)=>`<div class="tab${id==='stay'?' active':''}" data-tab="${id}">${emo} ${label}${count?`<span class="tc">${count}</span>`:''}</div>`;

  const body = `
${crumb([{t:'หน้าแรก',href:'/'},{t:'ประเทศไทย',href:'country-thailand.html'},{t:R.th,href:`region-${R.slug}.html`},{t:th}])}
<div class="phero">${heroSrc?`<img src="${heroSrc}" alt="${esc(th)}" loading="eager" onerror="this.remove()">`:''}
  <div class="pherobody">
    <span class="pheye">${emoji} ${R.th}</span>
    <h1>เที่ยว<em>${th}</em></h1>
    <p class="phlead">${esc(tagline)}</p>
    <div class="phchips"><span class="phchip">🗓️ ${esc(best.split(' ').slice(0,6).join(' '))}</span><span class="phchip">🏨 ${cStay} รีวิวที่พัก</span><span class="phchip">📚 ${arts.length} บทความ</span></div>
  </div>
</div>
<div class="tabwrap"><div class="tabbar">
  ${tab('stay','🏨','ที่พัก',cStay)}
  ${tab('see','📍','ที่เที่ยว',cSee)}
  ${tab('eat','🍜','ที่กิน',cEat)}
  ${tab('plan','🗺️','แผนเที่ยว',cPlan)}
  ${tab('prep','🎒','เตรียมตัว',0)}
</div></div>

<div class="wrap" style="padding-top:30px;padding-bottom:20px">

<section class="panel active" id="p-stay">
  <div class="callout"><div><h3>Top 10 โรงแรม${th} ${hasRoundup(slug)?'':'<span style="font-size:12px;color:#c2410c">· กำลังจัดทำ</span>'}</h3><p>รีวิวรวมจัดอันดับ + รีวิวแยกรายโรงแรม เทียบราคา Agoda · Booking · Trip.com</p></div><a href="top10-hotels-${slug}.html">ดูอันดับที่พัก →</a></div>
  <p class="pintro">รีวิวที่พัก${th} คัดจากเสียงรีวิวจริง — บอกตรงทั้งข้อดีข้อเสีย พร้อมช่วงราคาและลิงก์จอง</p>
  ${hotelCards(slug)}
</section>

<section class="panel" id="p-see">
  <h2 class="pnhead">ที่เที่ยว<span class="em"> ${th}</span></h2>
  <p class="pintro">ไฮไลต์และที่เที่ยว${th} ทั้งสายธรรมชาติ เมือง และวัฒนธรรม</p>
  ${hi?`<div class="hl">${hi}</div>`:''}
  ${artCards(slug,['attraction'])||'<p class="pintro">บทความที่เที่ยวกำลังจัดทำ</p>'}
</section>

<section class="panel" id="p-eat">
  <h2 class="pnhead">ที่กิน<span class="em"> ${th}</span></h2>
  <p class="pintro">ของกินเด่นของ${th} — รวมและจัดอันดับร้านจริงที่คนพื้นที่ไป</p>
  ${food?`<div class="foodgrid">${food}</div>`:''}
  ${artCards(slug,['food','eat-ranking'])||'<p class="pintro">บทความที่กินกำลังจัดทำ</p>'}
</section>

<section class="panel" id="p-plan">
  <h2 class="pnhead">แผน<span class="em">เที่ยว ${th}</span></h2>
  <p class="pintro">แผนเที่ยวคัดมาให้ ตั้งแต่ไปเช้าเย็นกลับ 2-3 วัน ถึงแผนข้ามจังหวัดข้างเคียง</p>
  ${artCards(slug,['itinerary'])||'<p class="pintro">แผนเที่ยวกำลังจัดทำ</p>'}
  ${nbrs?`<h2 class="pnhead">เที่ยวต่อ<span class="em">จังหวัดข้างเคียง</span></h2><div class="ncards">${nbrs}</div>`:''}
</section>

<section class="panel" id="p-prep">
  <h2 class="pnhead">เตรียมตัว<span class="em">เที่ยว ${th}</span></h2>
  <p class="pintro">ช่วงเวลาที่เหมาะ การเดินทาง และสิ่งที่ควรรู้ก่อนไป${th}</p>
  <div class="eeat">
    <div class="ecard"><div class="ic">🗓️</div><h3>ช่วงเวลาแนะนำ</h3><p>${esc(best)}</p></div>
    <div class="ecard"><div class="ic">🚗</div><h3>การเดินทาง</h3><p>${moveArt?`อ่านวิธีเดินทางใน${th}แบบละเอียด`:`วิธีไป${th}และเดินทางในจังหวัด`}${moveArt?` · <a href="${moveArt.slug}.html" style="color:var(--teal-dk);font-weight:700">เปิดคู่มือ →</a>`:''}</p></div>
    <div class="ecard"><div class="ic">📍</div><h3>ภาค</h3><p>${R.th} · <a href="region-${R.slug}.html" style="color:var(--teal-dk);font-weight:700">เที่ยว${R.th} →</a></p></div>
    <div class="ecard"><div class="ic">🎒</div><h3>เตรียมตัว</h3><p>${tipsArt?`เช็กลิสต์เตรียมตัวเที่ยว${th}`:`สิ่งที่ควรเตรียมไป${th}`}${tipsArt?` · <a href="${tipsArt.slug}.html" style="color:var(--teal-dk);font-weight:700">อ่านทิป →</a>`:''}</p></div>
  </div>
  ${artCards(slug,['prep','guide'])?`<h2 class="pnhead">คู่มือ<span class="em">เตรียมตัว</span></h2>${artCards(slug,['prep','guide'])}`:''}
</section>

</div>

<section class="sec" style="padding-top:6px"><div class="wrap">
  <div class="ctaband"><h2>วางแผนเที่ยว${th}</h2><p>ที่พัก ที่เที่ยว ของกิน และแผนเดินทาง — รวบไว้ให้แล้ว</p><a href="top10-hotels-${slug}.html">เริ่มจากที่พัก →</a></div>
</div></section>
<script>
(function(){
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  var panels=[].slice.call(document.querySelectorAll('.panel'));
  function act(id,scroll){
    tabs.forEach(function(t){t.classList.toggle('active',t.dataset.tab===id)});
    panels.forEach(function(p){p.classList.toggle('active',p.id==='p-'+id)});
    if(scroll){var w=document.querySelector('.tabwrap');if(w)window.scrollTo({top:w.offsetTop-64,behavior:'smooth'});}
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){act(t.dataset.tab,false);history.replaceState(null,'','#'+t.dataset.tab);})});
  var map={hotels:'stay',stay:'stay',see:'see',eat:'eat',plan:'plan',prep:'prep'};
  var h=(location.hash||'').replace('#','');
  if(map[h]) act(map[h],true);
})();
</script>`;

  return page({
    title: `เที่ยว${th} — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict`,
    desc: `คู่มือเที่ยว${th} — รีวิวที่พักจัดอันดับ ที่กิน ที่เที่ยว และแผนเที่ยว คัดจากของจริงในพื้นที่ พร้อมเทียบราคาที่พัก`,
    slug: `city-${slug}`, jsonld, body,
  });
}

// ---------- region page ----------
function regionPage(r){
  const R = REGION[r];
  const provs = PROVINCES.filter(([,,rr])=>rr===r);
  const cards = provs.map(([s,th],i)=>{
    const d = readData(s);
    const tg = (d&&d.tagline) || `เที่ยว${th}`;
    const em = (d&&d.heroEmoji) || R.emoji;
    const img = fs.existsSync(path.join(PUB,'images/cities',s+'.jpg')) ? `/images/cities/${s}.jpg` : (fs.existsSync(path.join(PUB,'images/heroes',s+'.jpg'))?`/images/heroes/${s}.jpg`:'');
    return `<a class="dcard" href="city-${s}.html"><div class="dphoto ${DG[i%6]}">${img?`<img src="${img}" alt="${esc(th)}" loading="lazy" onerror="this.remove()">`:''}<span class="tagn">${em}</span></div><div class="dbody"><h3>${th}</h3><p>${esc(tg)}</p><span class="go">เที่ยว${th} →</span></div></a>`;
  }).join('');
  const jsonld = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"หน้าแรก","item":"https://thailandaddict.com/"},
    {"@type":"ListItem","position":2,"name":"ประเทศไทย","item":"https://thailandaddict.com/country-thailand"},
    {"@type":"ListItem","position":3,"name":R.th,"item":`https://thailandaddict.com/region-${R.slug}`}]};
  const body = `
${crumb([{t:'หน้าแรก',href:'/'},{t:'ประเทศไทย',href:'country-thailand.html'},{t:R.th}])}
<section class="hero"><div class="wrap">
  <div class="eyebrow">${R.emoji} ภาคของไทย</div>
  <h1>เที่ยว<em>${R.th}</em></h1>
  <p class="lead">${R.intro}</p>
  <div class="chips"><span class="chip">📍 ${provs.length} จังหวัด</span><span class="chip">✅ คัดจากของจริง</span></div>
</div></section>
<section class="sec"><div class="wrap">
  <div class="shead"><h2>จังหวัดใน<span class="em">${R.th}</span></h2><a href="country-thailand.html">ทุกภาค →</a></div>
  <div class="dgrid">${cards}</div>
</div></section>
<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="ctaband"><h2>เลือกจังหวัดที่อยากไป</h2><p>แต่ละจังหวัดมีที่พัก ที่เที่ยว ของกิน และแผนเที่ยวครบ</p><a href="country-thailand.html">ดูทั้งประเทศ →</a></div>
</div></section>`;
  return page({
    title: `เที่ยว${R.th} — จังหวัดน่าเที่ยว ที่พัก ที่เที่ยว ของกิน | ThailandAddict`,
    desc: `คู่มือเที่ยว${R.th} — รวมจังหวัดน่าเที่ยวใน${R.th} พร้อมที่พัก ที่เที่ยว ของกิน และแผนเดินทาง`,
    slug: `region-${R.slug}`, jsonld, body,
  });
}

// ---------- main hub (country-thailand) ----------
function countryHub(){
  const blocks = Object.keys(REGION).map(r=>{
    const R=REGION[r];
    const provs=PROVINCES.filter(([,,rr])=>rr===r);
    const cards=provs.map(([s,th],i)=>{
      const d=readData(s); const tg=(d&&d.tagline)||`เที่ยว${th}`; const em=(d&&d.heroEmoji)||R.emoji;
      const img = fs.existsSync(path.join(PUB,'images/cities',s+'.jpg')) ? `/images/cities/${s}.jpg` : (fs.existsSync(path.join(PUB,'images/heroes',s+'.jpg'))?`/images/heroes/${s}.jpg`:'');
      return `<a class="dcard" href="city-${s}.html"><div class="dphoto ${DG[i%6]}">${img?`<img src="${img}" alt="${esc(th)}" loading="lazy" onerror="this.remove()">`:''}<span class="tagn">${em}</span></div><div class="dbody"><h3>${th}</h3><p>${esc(tg)}</p><span class="go">เที่ยว →</span></div></a>`;
    }).join('');
    return `<section class="regsec"><div class="wrap">
  <div class="shead"><h2>${R.emoji} <span class="em">${R.th}</span></h2><a href="region-${R.slug}.html">ดู${R.th} →</a></div>
  <div class="dgrid">${cards}</div>
</div></section>`;
  }).join('\n');
  const jsonld={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"หน้าแรก","item":"https://thailandaddict.com/"},
    {"@type":"ListItem","position":2,"name":"ประเทศไทย","item":"https://thailandaddict.com/country-thailand"}]};
  const body=`
${crumb([{t:'หน้าแรก',href:'/'},{t:'ประเทศไทย'}])}
<section class="hero"><div class="wrap">
  <div class="eyebrow">🇹🇭 เที่ยวไทยแบบรู้จริง</div>
  <h1>เที่ยว<em>ประเทศไทย</em><br>ครบ 77 จังหวัด</h1>
  <p class="lead">เลือกภาคและจังหวัดที่อยากไป — แต่ละจังหวัดมีที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริง</p>
  <div class="chips"><span class="chip">🗺️ <b>77</b> จังหวัด</span><span class="chip">🧭 <b>6</b> ภาค</span><span class="chip">✅ <b>100%</b> รีวิวจริง</span></div>
</div></section>
${blocks}
<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="ctaband"><h2>เริ่มวางแผนทริปไทย</h2><p>เลือกจังหวัด แล้วลุยที่พัก ที่เที่ยว ของกิน ได้เลย</p><a href="region-north.html">เริ่มที่ภาคเหนือ →</a></div>
</div></section>`;
  return page({
    title:`เที่ยวไทย 77 จังหวัด — ที่พัก ที่เที่ยว ของกิน แผนเที่ยว | ThailandAddict`,
    desc:`คู่มือเที่ยวไทยครบ 77 จังหวัด 6 ภาค — รีวิวที่พักจัดอันดับ ที่เที่ยว ของกิน และแผนเดินทาง คัดจากของจริง`,
    slug:`country-thailand`, jsonld, body,
  });
}

function readData(slug){
  const f=path.join(DATA, slug+'.json');
  if(!fs.existsSync(f)) return null;
  try { return JSON.parse(fs.readFileSync(f,'utf8')); } catch { return null; }
}

// ---- generate ----
let nP=0, nMiss=[];
for(const [slug, th, r] of PROVINCES){
  const d = readData(slug);
  if(!d) nMiss.push(slug);
  fs.writeFileSync(path.join(PUB, `city-${slug}.html`), provinceHub(slug, th, r, d||{}));
  nP++;
}
let nR=0;
for(const r of Object.keys(REGION)){ fs.writeFileSync(path.join(PUB, `region-${REGION[r].slug}.html`), regionPage(r)); nR++; }
fs.writeFileSync(path.join(PUB,'country-thailand.html'), countryHub());

console.log(`provinces: ${nP} · regions: ${nR} · country-thailand: 1`);
console.log(`missing data (fallback used): ${nMiss.length}${nMiss.length?' → '+nMiss.join(','):''}`);
