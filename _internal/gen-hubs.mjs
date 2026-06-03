// Generate region + province hub pages from _internal/province-data/*.json, reusing
// the Direction-C design system/chrome extracted from astro/public/index.html.
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
.crumb{max-width:1080px;margin:0 auto;padding:18px 28px 0;font-family:'Outfit',sans-serif;font-size:12.5px;color:var(--sub)}
.crumb a{color:var(--sub)}.crumb a:hover{color:var(--teal)}
.secintro{font-size:15px;color:var(--sub);max-width:760px;margin:-10px 0 22px}
.hl{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}@media(max-width:760px){.hl{grid-template-columns:1fr}}
.hlc{background:#fff;border:1px solid var(--bdr);border-radius:18px;padding:20px;box-shadow:0 8px 22px rgba(15,23,42,.05)}
.hlc h3{font-family:'Outfit',sans-serif;font-weight:800;font-size:16px;margin-bottom:5px}.hlc p{font-size:13.5px;color:var(--sub)}
.kbadge{display:inline-block;font-family:'Outfit',sans-serif;font-size:10.5px;font-weight:800;padding:3px 9px;border-radius:999px;margin-bottom:8px}
.k-nature{background:#dcfce7;color:#15803d}.k-city{background:#cffafe;color:#0891b2}.k-culture{background:#fef3c7;color:#b45309}
.plist{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}@media(max-width:680px){.plist{grid-template-columns:1fr}}
.pitem{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid var(--bdr);border-radius:16px;padding:14px 16px;box-shadow:0 6px 18px rgba(15,23,42,.04)}
.pitem .pn{flex-shrink:0;width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg,var(--teal),var(--teal-dk));color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-weight:800;font-size:14px}
.pitem span{font-family:'Outfit',sans-serif;font-weight:600;font-size:14px}
.soon{display:inline-block;font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;background:#fff7ed;color:#c2410c;padding:4px 10px;border-radius:999px;margin-left:8px;vertical-align:middle}
.callout{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;background:var(--soft);border:2px solid #cffafe;border-radius:22px;padding:24px 26px}
.callout h3{font-family:'Outfit',sans-serif;font-weight:800;font-size:20px}.callout p{font-size:13.5px;color:var(--sub);margin-top:3px}
.callout a{font-family:'Outfit',sans-serif;font-weight:800;font-size:13.5px;background:linear-gradient(135deg,var(--coral),var(--coral-dk));color:#fff;padding:12px 22px;border-radius:999px;box-shadow:0 10px 22px rgba(244,63,94,.3)}
.foodgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}@media(max-width:760px){.foodgrid{grid-template-columns:repeat(2,1fr)}}
.fc{background:#fff;border:1px solid var(--bdr);border-radius:16px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,.04)}
.fc h4{font-family:'Outfit',sans-serif;font-weight:800;font-size:14px}.fc p{font-size:12.5px;color:var(--sub);margin-top:3px}
.ncards{display:flex;gap:12px;flex-wrap:wrap}
.nc{font-family:'Outfit',sans-serif;font-weight:700;font-size:13.5px;background:#fff;border:1px solid var(--bdr);border-radius:999px;padding:9px 18px}
.nc:hover{border-color:var(--teal);color:var(--teal-dk)}
.regsec{padding:34px 0;border-bottom:1px solid var(--bdr)}
.cityhero{display:block;width:calc(100% - 56px);max-width:1080px;margin:20px auto 0;border-radius:24px;aspect-ratio:21/9;object-fit:cover;box-shadow:0 18px 44px rgba(15,23,42,.16)}
</style>`;

const DG = ['d1','d2','d3','d4','d5','d6'];
const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

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

// ---------- province hub ----------
function provinceHub(slug, th, r, d){
  const R = REGION[r];
  const hi = (d.highlights||[]).map(h=>`<div class="hlc"><h3>${esc(h.name)}</h3><p>${esc(h.blurb)}</p></div>`).join('');
  const food = (d.foodScene||[]).map(f=>`<div class="fc"><h4>${esc(f.name)}</h4><p>${esc(f.note)}</p></div>`).join('');
  const kindTh={nature:'ธรรมชาติ',city:'เมือง',culture:'วัฒนธรรม'};
  const see = (d.attractions||[]).map((a,i)=>`<a class="dcard" href="#"><div class="dphoto ${DG[i%6]}"><span class="tagn">${kindTh[a.kind]||'เที่ยว'}</span></div><div class="dbody"><span class="kbadge k-${a.kind||'city'}">${kindTh[a.kind]||''}</span><h3>${esc(a.name)}</h3><p>${esc(a.blurb)}</p></div></a>`).join('');
  const plans = (d.itineraryIdeas||[]).map((p,i)=>`<div class="pitem"><div class="pn">${i+1}</div><span>${esc(p)}</span></div>`).join('');
  const nbrs = (d.neighbors||[]).filter(n=>TH[n]).map(n=>`<a class="nc" href="city-${n}.html">${TH[n]} →</a>`).join('');
  const tagline = d.tagline || `เที่ยว${th}`;
  const intro = d.introHtml || `คู่มือเที่ยว${th} — ที่พัก ที่เที่ยว ของกิน และแผนเที่ยว คัดจากของจริงในพื้นที่`;
  const best = d.bestTime || 'เที่ยวได้ตลอดปี';
  const emoji = d.heroEmoji || R.emoji;
  const heroBanner = fs.existsSync(path.join(PUB,'images/heroes',slug+'.jpg')) ? `<img class="cityhero" src="/images/heroes/${slug}.jpg" alt="${esc(th)}" loading="eager" onerror="this.remove()">` : '';

  const jsonld = {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"หน้าแรก","item":"https://thailandaddict.com/"},
    {"@type":"ListItem","position":2,"name":"ประเทศไทย","item":"https://thailandaddict.com/country-thailand"},
    {"@type":"ListItem","position":3,"name":R.th,"item":`https://thailandaddict.com/region-${R.slug}`},
    {"@type":"ListItem","position":4,"name":th,"item":`https://thailandaddict.com/city-${slug}`}]};

  const body = `
${crumb([{t:'หน้าแรก',href:'/'},{t:'ประเทศไทย',href:'country-thailand.html'},{t:R.th,href:`region-${R.slug}.html`},{t:th}])}
<section class="hero"><div class="wrap">
  <div class="eyebrow">${emoji} ${R.th}</div>
  <h1>เที่ยว<em>${th}</em></h1>
  <p class="lead">${esc(intro)}</p>
  <div class="chips"><span class="chip">📍 ${R.th}</span><span class="chip">🗓️ ${esc(best)}</span><span class="chip">✅ คัดจากของจริง</span></div>
</div></section>
${heroBanner}
<section class="sec"><div class="wrap">
  <div class="shead"><h2>ไฮไลต์<span class="em"> ${th}</span></h2></div>
  <p class="secintro">${esc(tagline)}</p>
  <div class="hl">${hi}</div>
</div></section>

<section class="sec" id="hotels" style="background:var(--soft)"><div class="wrap">
  <div class="shead"><h2>ที่พัก & <span class="em">โรงแรม</span></h2></div>
  <p class="secintro">รีวิวที่พัก${th} — จัดอันดับรวมกว่า 10 ที่ พร้อมรีวิวแยกทุกโรงแรม คัดจากเสียงรีวิวจริง เทียบราคา Agoda · Booking · Trip.com</p>
  <div class="callout"><div><h3>Top 10 โรงแรม${th} ${hasRoundup(slug)?'':'<span class="soon">กำลังจัดทำ</span>'}</h3><p>รีวิวรวมจัดอันดับ + รีวิวแยกรายโรงแรม</p></div><a href="top10-hotels-${slug}.html">ดูอันดับที่พัก →</a></div>
</div></section>

<section class="sec" id="eat"><div class="wrap">
  <div class="shead"><h2>ที่กิน<span class="em"> ${th}</span></h2></div>
  <p class="secintro">ของกินเด่นของ${th} — รวมและจัดอันดับแยกตามประเภทที่นิยมในพื้นที่</p>
  <div class="foodgrid">${food}</div>
  ${artLinks(slug,['food','eat-ranking'],'บทความที่กิน '+th)}
</div></section>

<section class="sec" id="see" style="background:var(--soft)"><div class="wrap">
  <div class="shead"><h2>ที่เที่ยว<span class="em"> ${th}</span></h2></div>
  <p class="secintro">ที่เที่ยว${th} ทั้งสายธรรมชาติและสายเมือง</p>
  <div class="dgrid">${see}</div>
  ${artLinks(slug,['attraction'],'บทความที่เที่ยว '+th)}
</div></section>

<section class="sec"><div class="wrap">
  <div class="shead"><h2>แผน<span class="em">เที่ยว ${th}</span></h2></div>
  <p class="secintro">แผนเที่ยวคัดมาให้ ตั้งแต่เช้าเย็นกลับ ไป 2-3 วัน ถึงแผนข้ามจังหวัดข้างเคียง</p>
  <div class="plist">${plans}</div>
  ${artLinks(slug,['itinerary'],'แผนเที่ยว '+th+' แบบละเอียด')}
  ${nbrs?`<p class="secintro" style="margin:22px 0 10px">เที่ยวต่อจังหวัดข้างเคียง</p><div class="ncards">${nbrs}</div>`:''}
</div></section>

<section class="sec" id="prep" style="background:var(--soft)"><div class="wrap">
  <div class="shead"><h2>เตรียมตัว<span class="em">เที่ยว ${th}</span></h2></div>
  <div class="eeat">
    <div class="ecard"><div class="ic">🗓️</div><h3>ช่วงเวลาแนะนำ</h3><p>${esc(best)}</p></div>
    <div class="ecard"><div class="ic">🚗</div><h3>การเดินทาง</h3><p>วิธีไป${th} และการเดินทางในจังหวัด — กำลังจัดทำ</p></div>
    <div class="ecard"><div class="ic">💸</div><h3>งบประมาณ</h3><p>ประเมินค่าใช้จ่ายต่อทริป — กำลังจัดทำ</p></div>
    <div class="ecard"><div class="ic">🎒</div><h3>เตรียมของ</h3><p>สิ่งที่ควรเตรียมไป${th} ตามฤดูและกิจกรรม</p></div>
  </div>
  ${artLinks(slug,['prep','guide'],'คู่มือเตรียมตัว '+th)}
</div></section>

<section class="sec" style="padding-top:0"><div class="wrap">
  <div class="ctaband"><h2>วางแผนเที่ยว${th}</h2><p>ที่พัก ที่เที่ยว ของกิน และแผนเดินทาง — รวบไว้ให้แล้ว</p><a href="top10-hotels-${slug}.html">เริ่มจากที่พัก →</a></div>
</div></section>`;

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
    return `<a class="dcard" href="city-${s}.html"><div class="dphoto ${DG[i%6]}"><span class="tagn">${em}</span></div><div class="dbody"><h3>${th}</h3><p>${esc(tg)}</p><span class="go">เที่ยว${th} →</span></div></a>`;
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
      return `<a class="dcard" href="city-${s}.html"><div class="dphoto ${DG[i%6]}"><span class="tagn">${em}</span></div><div class="dbody"><h3>${th}</h3><p>${esc(tg)}</p><span class="go">เที่ยว →</span></div></a>`;
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

// ---- articles index (auto-link province articles into the hub) ----
const ARTDIR = path.join(ROOT,'astro/src/content/articles');
const ROUNDDIR = path.join(ROOT,'astro/src/content/roundups');
const ARTS = {};
if(fs.existsSync(ARTDIR)) for(const f of fs.readdirSync(ARTDIR).filter(x=>x.endsWith('.json'))){
  try{ const a=JSON.parse(fs.readFileSync(path.join(ARTDIR,f),'utf8')); (ARTS[a.cluster] ||= []).push({slug:a.slug, type:a.type, title:(a.h1||a.title||a.slug), heroImg:a.heroImg||''}); }catch{}
}
const stripTags = s => String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const hasRoundup = slug => fs.existsSync(path.join(ROUNDDIR, `top10-hotels-${slug}.json`));
function artLinks(cluster, types, label){
  const list=(ARTS[cluster]||[]).filter(a=>types.includes(a.type));
  if(!list.length) return '';
  return `<p class="secintro" style="margin:22px 0 12px"><strong>${label}</strong> · ${list.length} บทความ</p><div class="dgrid">`+
    list.map((a,i)=>`<a class="dcard" href="${a.slug}.html"><div class="dphoto ${DG[i%6]}">${a.heroImg?`<img src="${a.heroImg}" alt="${esc(stripTags(a.title))}" loading="lazy" onerror="this.remove()">`:''}</div><div class="dbody"><h3>${esc(stripTags(a.title))}</h3><span class="go">อ่านบทความ →</span></div></a>`).join('')+`</div>`;
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
