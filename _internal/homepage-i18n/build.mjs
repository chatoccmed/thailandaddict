#!/usr/bin/env node
// Homepage i18n generator.
// ONE English template (astro/public/en/index.html) -> N localized homepages.
// Golden rule: identical layout across every language; only visible TEXT + reading
// direction change. CSS/JS skeleton stays byte-identical; every translatable string
// comes from a per-language dictionary in _internal/homepage-i18n/<lang>.json.
//
// Usage:
//   node build.mjs --extract-en      write en.json (base dict, English values) from source
//   node build.mjs --check           generate 'en' from en.json, diff static body vs source
//   node build.mjs zh ru ko ja hi he ar   generate those homepages into astro/public/<lang>/index.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SRC = path.join(ROOT, 'astro', 'public', 'en', 'index.html');
const OUTDIR = (lang) => path.join(ROOT, 'astro', 'public', lang);

const RTL = new Set(['he', 'ar']);
const OG_LOCALE = { th: 'th_TH', en: 'en_US', zh: 'zh_CN', ru: 'ru_RU', ko: 'ko_KR', ja: 'ja_JP', hi: 'hi_IN', he: 'he_IL', ar: 'ar_AR' };
// label shown in the language dropdown for each locale (native name)
const LANG_LABEL = { th: 'ไทย', en: 'English', zh: '中文', ru: 'Русский', ko: '한국어', ja: '日本語', hi: 'हिन्दी', he: 'עברית', ar: 'العربية' };
const LANG_FLAG = { th: '🇹🇭', en: '🇬🇧', zh: '🇨🇳', ru: '🇷🇺', ko: '🇰🇷', ja: '🇯🇵', hi: '🇮🇳', he: '🇮🇱', ar: '🇸🇦' };
const ALL = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

// ── Static-body translatable strings ─────────────────────────────────────────
// [key, englishExactSubstring, {all?:true}]  — englishExactSubstring must appear
// in the source; by default it must appear EXACTLY once (safety). {all:true} for
// phrases that legitimately repeat (nav + mobile menu, "See all →", etc.).
const CHROME = [
  // nav
  ['nav_destinations', '<a href="country-thailand.html">Destinations</a>'],
  ['nav_pop', '<span class="h">✨ Popular</span>'],
  ['nav_topdest', '>🔥 Top destinations</a>', { all: true }],
  ['nav_6regions', '<span class="h">🇹🇭 6 regions</span>'],
  ['nav_north', '>⛰️ North</a>', { all: true }],
  ['nav_isan', '>🌾 Isan</a>'],
  ['nav_central', '>🏙️ Central</a>', { all: true }],
  ['nav_east', '>🏝️ East</a>'],
  ['nav_west', '>🌅 West</a>'],
  ['nav_south', '>🌊 South</a>', { all: true }],
  ['nav_seeall77', '→ See all 77 provinces</a>'],
  ['nav_hotels', '<a href="city-chiang-mai.html#stay">Hotels</a>'],
  ['nav_poprank', '<span class="h">Popular rankings</span>'],
  ['nav_t10cm', '>Top 10 Chiang Mai</a>'],
  ['nav_t10bkk', '>Top 10 Bangkok</a>'],
  ['nav_t10hkt', '>Top 10 Phuket</a>'],
  ['nav_t10kbi', '>Top 10 Krabi</a>'],
  ['nav_t10pty', '>Top 10 Pattaya</a>'],
  ['nav_eat', '<a href="city-chiang-mai.html#eat">Eat & Explore</a>'],
  ['nav_foodtodo', '<span class="h">Food · things to do</span>'],
  ['nav_cmfood', '>Chiang Mai food</a>'],
  ['nav_bkkattr', '>Bangkok attractions</a>'],
  ['nav_hktattr', '>Phuket attractions</a>'],
  ['nav_kbiattr', '>Krabi attractions</a>'],
  ['nav_nearme', '>📍 Near Me</a>'],
  ['nav_plantrip', '<a href="plan-your-trip.html">Plan Trip</a>'],
  ['nav_about', '<a href="about.html">About</a>', { all: true }],
  ['nav_search_ph', 'placeholder="Search provinces, hotels..."'],
  ['nav_cta', '>Find a stay</button>'],
  // mobile menu
  ['mm_dest', '>🇹🇭 Destinations · 77 provinces</a>'],
  ['mm_hotels', '>🏨 Hotels · rankings</a>'],
  ['mm_eat', '>🍜 Eat & Explore</a>'],
  ['mm_contact', '<a href="contact.html">Contact</a>', { all: true }],
  ['mm_cta', '>Find a hotel</button>'],
  // hero
  ['hero_eye', 'ThailandAddict · Explore Thailand Like a Local · real reviews on every page'],
  ['hero_h1', 'Explore Thailand <em>like a local</em>'],
  ['hero_sub', 'The best stays, food and places across Thailand — real info, real prices, three sites compared before you book. No hidden ads.'],
  ['hero_search_ph', 'placeholder="Search a province, hotel or place to go..."'],
  ['hero_search_btn', '>Search</button>'],
  ['tag_beaches', '>🏖️ Beaches</a>'],
  ['tag_islands', '>🏝️ Islands</a>'],
  ['tag_city', '>🏙️ City</a>'],
  ['tag_food', '>🍜 Food</a>'],
  ['tag_mountains', '>⛰️ Mountains</a>'],
  ['tag_heritage', '>🏛️ World heritage</a>'],
  ['tag_cafes', '>☕ Cafes</a>'],
  ['tag_michelin', '>🏅 Michelin 2026</a>'],
  ['tag_bestof', '>🇹🇭 Best of Thailand 2026</a>'],
  // stats
  ['stat_provinces', '<div class="l">Provinces ready</div>'],
  ['stat_reviews', '<div class="l">Hotel reviews</div>'],
  ['stat_articles', '<div class="l">Travel articles</div>'],
  ['stat_real', '<div class="l">Real reviews</div>'],
  // partners
  ['partners_lbl', '>Official partners</span>'],
  // michelin section
  ['mich_lbl', '<div class="slbl">New</div>'],
  ['mich_tit', 'Eat & drink the <em>best</em> of Thailand'],
  ['mich_c1t', 'All 485 restaurants'],
  ['mich_c1s', 'Stars · Bib · Selected'],
  ['mich_c2t', 'Find & filter'],
  ['mich_c2s', 'By star, province, cuisine'],
  ['mich_c3t', 'Starred nationwide'],
  ['mich_c3s', '43 starred spots'],
  ['mich_c4t', 'Bib Gourmand'],
  ['mich_c4s', '137 great-value picks'],
  ['mich_c5t', 'Provinces ranked'],
  ['mich_c5s', 'Best province to eat'],
  ['mich_c6t', 'How to book'],
  ['mich_c6s', 'Sorn · Sühring · Jay Fai'],
  ['mich_c7t', "Bangkok's 50 Best Bars"],
  ['mich_c7s', 'Bar Us · Dry Wave · Vesper'],
  // dest section
  ['dest_lbl', '<div class="slbl">Explore by destination</div>'],
  ['dest_tit', 'Where to <em>go next?</em>'],
  // topn section
  ['topn_lbl', '<div class="slbl">Start here</div>'],
  ['topn_tit', 'Hotel <em>rankings</em> by province'],
  ['topn_seeall', '>All provinces →</a>'],
  // hotels section
  ['hot_lbl', '<div class="slbl">Featured hotels</div>'],
  ['hot_tit', "Stays we've <em>reviewed</em>"],
  ['hot_sub', 'Picked from real guest reviews, prices compared across Agoda · Booking · Trip.com'],
  ['aff_lbl', '<div class="ab-lbl">◆ Affiliate Partner</div>'],
  ['aff_h', 'Book via Agoda · Booking · Trip and save more'],
  ['aff_s', 'Best prices · free cancellation · compare 3 sites before you book, no extra cost'],
  ['aff_b1', '>🔴 Book Agoda now</a>'],
  ['aff_b2', '>🔵 Booking.com</a>'],
  ['hot_seeall', '>See hotels in every province →</a>'],
  // arts section
  ['arts_lbl', '<div class="slbl">Featured reads</div>'],
  ['arts_tit', 'Read before <em>you go</em>'],
  // map section
  ['map_lbl', '<div class="slbl">Every destination on the map</div>'],
  ['map_tit', 'Popular provinces <em>ready to go</em>'],
  ['map_sub', "Tap a pin to open that province's travel guide"],
  ['leg_north', '<i style="background:#06B6D4"></i>North'],
  ['leg_isan', '<i style="background:#FBBF24"></i>Isan'],
  ['leg_central', '<i style="background:#FB7185"></i>Central'],
  ['leg_east', '<i style="background:#10B981"></i>East'],
  ['leg_west', '<i style="background:#A78BFA"></i>West'],
  ['leg_south', '<i style="background:#F97316"></i>South'],
  // why section
  ['why_lbl', '<div class="slbl">Why ThailandAddict</div>'],
  ['why_tit', 'Travel Thailand <em>like you know it</em>'],
  ['why_t1', '<div class="why-t">From real reviews</div>'],
  ['why_b1', 'Summed up from hundreds of real guest reviews — no over-hyping'],
  ['why_t2', '<div class="why-t">3 sites compared</div>'],
  ['why_b2', 'Agoda · Booking · Trip.com, direct booking links, no hidden ads'],
  ['why_t3', "<div class=\"why-t\">Checked it's open</div>"],
  ['why_b3', "We verify the hotel or shop is still open and hasn't changed names"],
  ['why_t4', '<div class="why-t">The good and the bad</div>'],
  ['why_b4', 'Every review has a "skip it if..." section so you can pick what fits'],
  // newsletter
  ['nl_h', 'Get hotel deals first 📭'],
  ['nl_sub', "Join the list — the best stays, new eats and provinces we just added, and we'll let you know first"],
  ['nl_ph', 'placeholder="Your email..."'],
  ['nl_btn', '>Join the list</button>'],
  ['nl_note', '📩 No spam · unsubscribe anytime · only things genuinely worth it'],
  // footer
  ['ft_tag', '<div class="ft-tag">Explore Thailand Like a Local</div>'],
  ['ft_desc', 'Explore Thailand like a local — the best stays, food and places across Thailand, picked from real reviews'],
  ['ft_h_dest', '<h4>Destinations</h4>'],
  ['ft_thai', '>🇹🇭 Thailand travel</a>'],
  ['ft_h_content', '<h4>Content</h4>'],
  ['ft_cmhotels', '>Chiang Mai hotels</a>'],
  ['ft_bkkfood', '>Bangkok food</a>'],
  ['ft_guide', '>Thailand travel guide</a>'],
  ['ft_plan', '>Plan Your Trip</a>'],
  ['ft_h_about', '<h4>About</h4>'],
  ['ft_aboutus', '>About us</a>'],
  ['ft_edpol', '>Editorial policy</a>'],
  ['ft_privacy', '>Privacy</a>'],
  ['ft_copy', '© 2026 thailandaddict.com — Thailand travel, done right'],
  ['ft_bottomright', '<span>Privacy · Editorial Policy</span>'],
  ['ft_aff', '⚡ ThailandAddict is an affiliate partner of Agoda, Booking.com and Trip.com — we may earn a commission when you book through links on the site, at no extra cost to you.'],
  // mbar
  ['mbar_pick', '>🇹🇭 Pick a province</a>'],
  ['mbar_stay', '>🏨 Find a stay</a>'],
];

// runtime (JS-built) strings; {name} placeholders where word order matters
const UI_KEYS = {
  bestHotelsIn: '10 best hotels in {name}',
  rankedRoundup: 'ranked roundup + individual hotel reviews',
  seeAll10: 'See all 10 →',
  fromAbout: 'from about',
  seeRankings: 'See rankings →',
  visit: 'Visit {name}',
  top10Hotels: 'Top 10 {name} hotels',
  hotelRankings: 'hotel rankings',
  noResults: 'No results found',
  openGuide: 'Open guide →',
  nlSending: 'Sending…',
  nlOk: 'Thanks! ✓',
  nlFail: 'Something went wrong — try again',
};

// ── extract English data arrays from source ─────────────────────────────────
function grab(src, startMark, endMark) {
  const a = src.indexOf(startMark);
  const b = src.indexOf(endMark, a);
  return src.slice(a, b);
}
function extractArrays(src) {
  const provBlock = grab(src, 'var PROV=[', '];\n/*GEN:PROV-END*/');
  const PROV = eval('(' + provBlock.replace('var PROV=', '') + '])');
  const topnLine = src.match(/var TOPN=(\[[^\n]*\]);/)[1];
  const TOPN = eval('(' + topnLine + ')');
  const hotelsBlock = grab(src, 'var HOTELS=[', '];\nvar ARTS');
  const HOTELS = eval('(' + hotelsBlock.replace('var HOTELS=', '') + '])');
  const artsBlock = grab(src, 'var ARTS=[', '];\nfunction imgErr');
  const ARTS = eval('(' + artsBlock.replace('var ARTS=', '') + '])');
  return { PROV, TOPN, HOTELS, ARTS };
}

// region english->key so per-lang region label is consistent
const REGION_KEY = { North: 'North', Isan: 'Isan', Central: 'Central', East: 'East', West: 'West', South: 'South' };

function buildEnDict(src) {
  const { PROV, TOPN, HOTELS, ARTS } = extractArrays(src);
  const d = { head: {}, chrome: {}, ui: {}, regions: {}, prov: {}, topn: {}, hotels: {}, arts: {} };
  d.head = {
    title: 'ThailandAddict — Explore Thailand Like a Local · the best stays, food & places across Thailand',
    desc: 'ThailandAddict — Explore Thailand Like a Local · a Thailand travel guide from people who actually go. Real reviews on every page, real prices, compare Agoda · Booking · Trip.com before you book. No hidden ads.',
    ogTitle: 'ThailandAddict · Explore Thailand Like a Local',
    ogDesc: 'The best stays, food and places across Thailand — real reviews on every page, real prices, direct booking links, no hidden ads.',
    jsonldDesc: 'A Thailand travel guide from people who actually go — hotel, food and attraction reviews plus trip plans across Thailand',
  };
  for (const [k, en] of CHROME) d.chrome[k] = en;
  for (const [k, en] of Object.entries(UI_KEYS)) d.ui[k] = en;
  for (const r of Object.keys(REGION_KEY)) d.regions[r] = r;
  for (const p of PROV) d.prov[p.s] = { n: p.n, t: p.t };
  for (const t of TOPN) d.topn[t[0]] = t[1];
  for (const h of HOTELS) d.hotels[h.h] = { n: h.n, loc: h.loc };
  for (const a of ARTS) d.arts[a.h] = { l: a.l, ti: a.ti, bd: a.bd };
  return d;
}

// ── head block (rebuilt per language) ───────────────────────────────────────
function headBlock(lang, d) {
  const canon = lang === 'th' ? 'https://thailandaddict.com/' : `https://thailandaddict.com/${lang}/`;
  const hreflangs = ALL.map((l) => {
    const href = l === 'th' ? 'https://thailandaddict.com/' : `https://thailandaddict.com/${l}/`;
    return `<link rel="alternate" hreflang="${l}" href="${href}">`;
  }).join('\n');
  return `<title>${d.head.title}</title>
<meta name="description" content="${d.head.desc}">
<link rel="canonical" href="${canon}">
${hreflangs}
<link rel="alternate" hreflang="x-default" href="https://thailandaddict.com/">
<meta property="og:site_name" content="ThailandAddict">
<meta property="og:title" content="${d.head.ogTitle}">
<meta property="og:description" content="${d.head.ogDesc}">
<meta property="og:url" content="${canon}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://thailandaddict.com/images/heroes/krabi.jpg">
<meta property="og:locale" content="${OG_LOCALE[lang]}">`;
}

// ── language flag-bar (row of circular flags; active one is enlarged) ────────
// Real SVG flags (self-hosted, inlined as base64 data-URIs) — emoji flags do NOT
// render on Windows, so graphic flags keep the switcher consistent everywhere.
function flagCSS() {
  const dir = path.join(ROOT, 'astro', 'public', 'images', 'flags');
  const rules = ALL.map((l) => {
    const b64 = fs.readFileSync(path.join(dir, `${l}.svg`)).toString('base64');
    return `.flg-${l}{background-image:url("data:image/svg+xml;base64,${b64}")}`;
  }).join('\n');
  return `
/* language flag-bar */
.flagbar{display:flex;align-items:center;gap:3px;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.3);border-radius:30px;padding:4px 6px}
.nav.solid .flagbar{background:#f4f1ea;border-color:#ece6da}
.flagbar a{display:block;width:25px;height:25px;border-radius:50%;overflow:hidden;opacity:.72;transition:transform .16s,opacity .16s;flex:0 0 auto;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
.flagbar a:hover{opacity:1;transform:scale(1.12)}
.flagbar a.on{opacity:1;transform:scale(1.22);box-shadow:0 0 0 2px #fff,0 3px 9px rgba(0,0,0,.28);position:relative;z-index:1}
.nav.solid .flagbar a.on{box-shadow:0 0 0 2px #fff,0 3px 10px rgba(15,40,70,.25)}
.flg{width:100%;height:100%;background-size:cover;background-position:center;display:block}
${rules}
@media(max-width:860px){.flagbar{gap:2px;padding:3px 5px}.flagbar a{width:23px;height:23px}}
@media(max-width:600px){.nav .flagbar{display:none}}
.mm .flagbar{display:flex;flex-wrap:wrap;margin-top:20px;background:#f4f1ea;border-color:#ece6da;align-self:flex-start;padding:6px 8px}
.mm .flagbar a{width:30px;height:30px}
html[dir="rtl"] .flagbar{flex-direction:row-reverse}`;
}
function flagbar(active, extraClass = '') {
  const items = ALL.map((l) => {
    const href = l === 'th' ? '/' : `/${l}/`;
    const on = l === active ? ' class="on"' : '';
    return `<a href="${href}"${on} title="${LANG_LABEL[l]}" aria-label="${LANG_LABEL[l]}"><span class="flg flg-${l}"></span></a>`;
  }).join('');
  return `<div class="flagbar${extraClass ? ' ' + extraClass : ''}" role="navigation" aria-label="Language">${items}</div>`;
}

// ── localized trailing data+logic script ────────────────────────────────────
function dataScript(lang, d) {
  const { PROV, TOPN, HOTELS, ARTS } = extractArrays(fs.readFileSync(SRC, 'utf8'));
  const prov = PROV.map((p) => ({
    s: p.s, n: (d.prov[p.s] && d.prov[p.s].n) || p.n, r: d.regions[REGION_KEY[p.r]] || p.r,
    t: (d.prov[p.s] && d.prov[p.s].t) || p.t, lat: p.lat, lng: p.lng, c: p.c,
  }));
  const topn = TOPN.map((t) => [t[0], d.topn[t[0]] || t[1]]);
  const hotels = HOTELS.map((h) => ({ h: h.h, img: h.img, n: (d.hotels[h.h] && d.hotels[h.h].n) || h.n, loc: (d.hotels[h.h] && d.hotels[h.h].loc) || h.loc, sc: h.sc, pr: h.pr }));
  const arts = ARTS.map((a) => ({ big: a.big, h: a.h, img: a.img, l: (d.arts[a.h] && d.arts[a.h].l) || a.l, ti: (d.arts[a.h] && d.arts[a.h].ti) || a.ti, bd: (d.arts[a.h] && d.arts[a.h].bd) || a.bd }));
  const L = { ...UI_KEYS, ...d.ui };
  return `<script>
var PROV=${JSON.stringify(prov)};
var TOPN=${JSON.stringify(topn)};
var HOTELS=${JSON.stringify(hotels)};
var ARTS=${JSON.stringify(arts)};
var LBL=${JSON.stringify(L)};
function imgErr(e){e.onerror=null;e.style.opacity=0;}
document.getElementById('destscroll').innerHTML=PROV.map(function(p){return '<a class="dest" href="city-'+p.s+'.html"><img src="/images/heroes/'+p.s+'.jpg" alt="'+p.n+'" loading="lazy" onerror="this.style.opacity=0"><div class="dest-ov"></div><div class="dest-info"><div class="dest-flag">📍</div><div class="dest-name">'+p.n+'</div><div class="dest-cnt">'+p.r+' · '+p.t+'</div></div></a>';}).join('');
document.getElementById('topnscroll').innerHTML=TOPN.map(function(t){return '<a class="tcard" href="top10-hotels-'+t[0]+'.html"><div class="tcard-img"><span class="tcard-badge">TOP 10</span><img src="/images/heroes/'+t[0]+'.jpg" alt="'+t[1]+'" loading="lazy" onerror="this.style.opacity=0"></div><div class="tcard-body"><div class="tcard-name">'+LBL.bestHotelsIn.replace('{name}',t[1])+'</div><div class="tcard-tag">'+LBL.rankedRoundup+'</div><div class="tcard-cta">'+LBL.seeAll10+'</div></div></a>';}).join('');
document.getElementById('hotelgrid').innerHTML=HOTELS.map(function(h){return '<a class="hcard" href="'+h.h+'.html"><div class="hc-img"><span class="hc-score">'+h.sc+'</span><span class="hc-flag">'+h.loc+'</span><img src="'+h.img+'" alt="'+h.n+'" loading="lazy" onerror="this.style.opacity=0"></div><div class="hc-body"><div class="hc-name">'+h.n+'</div><div class="hc-loc">'+LBL.rankedRoundup+'</div><div class="hc-foot"><div class="hc-price"><span class="from">'+LBL.fromAbout+'</span>'+h.pr+'</div><span class="hc-link">'+LBL.seeRankings+'</span></div></div></a>';}).join('');
document.getElementById('artgrid').innerHTML='<a class="acard big" href="'+ARTS[0].h+'.html"><div class="acard-img"><span class="acard-badge">'+ARTS[0].bd+'</span><img src="'+ARTS[0].img+'" alt="'+ARTS[0].ti+'" loading="lazy" onerror="this.style.opacity=0"></div><div class="acard-body"><div class="acard-lbl">'+ARTS[0].l+'</div><div class="acard-title">'+ARTS[0].ti+'</div></div></a><div class="art-right">'+ARTS.slice(1).map(function(a){return '<a class="acard sm" href="'+a.h+'.html"><div class="acard-img"><img src="'+a.img+'" alt="'+a.ti+'" loading="lazy" onerror="this.style.opacity=0"></div><div class="acard-body"><div class="acard-lbl">'+a.l+'</div><div class="acard-title">'+a.ti+'</div></div></a>';}).join('')+'</div>';
var nav=document.getElementById('nav');function onScroll(){nav.classList.toggle('solid',window.scrollY>40);}window.addEventListener('scroll',onScroll);onScroll();
var hb=document.getElementById('hb'),mm=document.getElementById('mm'),mmx=document.getElementById('mmx');
if(hb){hb.onclick=function(){mm.classList.add('open')};mmx.onclick=function(){mm.classList.remove('open')};}
var IDX=PROV.map(function(p){return {t:LBL.visit.replace('{name}',p.n),c:p.r+' · '+p.t,u:'city-'+p.s+'.html'};})
 .concat(TOPN.map(function(t){return {t:LBL.top10Hotels.replace('{name}',t[1]),c:LBL.hotelRankings,u:'top10-hotels-'+t[0]+'.html'};}));
function runSearch(q,box){q=q.trim().toLowerCase();if(!q){box.classList.remove('show');return;}var r=IDX.filter(function(i){return (i.t+i.c).toLowerCase().indexOf(q)>-1;}).slice(0,8);box.innerHTML=r.length?r.map(function(i){return '<a href="'+i.u+'"><div class="t">'+i.t+'</div><div class="c">'+i.c+'</div></a>';}).join(''):'<div class="empty">'+LBL.noResults+'</div>';box.classList.add('show');}
var si=document.getElementById('si'),sidrop=document.getElementById('sidrop');
if(si){si.addEventListener('input',function(){runSearch(si.value,sidrop);});si.addEventListener('keydown',function(e){if(e.key==='Enter')goSearch();});}
var ns=document.getElementById('navsearch'),nd=document.getElementById('navdrop');
if(ns){ns.addEventListener('input',function(){runSearch(ns.value,nd);});ns.addEventListener('keydown',function(e){if(e.key==='Enter'){var v=ns.value.trim();location.href='search.html'+(v?'?q='+encodeURIComponent(v):'');}});}
document.addEventListener('click',function(e){if(si&&!e.target.closest('.sc-field')){sidrop.classList.remove('show');}if(ns&&!e.target.closest('.search-box')){nd.classList.remove('show');}});
function goSearch(){var v=(si.value||'').trim();location.href='search.html'+(v?'?q='+encodeURIComponent(v):'');}
try{var map=L.map('map',{scrollWheelZoom:false}).setView([13.2,101],5.4);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap © CartoDB',maxZoom:18}).addTo(map);
function mpin(c){return L.divIcon({className:'',html:'<span class="mpin" style="background:'+c+'"></span>',iconSize:[16,16],iconAnchor:[8,8]});}
var grp=(typeof L.markerClusterGroup==='function')?L.markerClusterGroup({maxClusterRadius:26,showCoverageOnHover:false,spiderfyDistanceMultiplier:1.4,disableClusteringAtZoom:8,iconCreateFunction:function(cl){return L.divIcon({html:'<span class="mclu">'+cl.getChildCount()+'</span>',className:'',iconSize:[40,40]});}}):L.layerGroup();
PROV.forEach(function(p){L.marker([p.lat,p.lng],{icon:mpin(p.c||'#06B6D4'),title:p.n}).bindPopup('<div class="lp"><div class="lp-name">'+p.n+'</div><div class="lp-loc">'+p.r+' · '+p.t+'</div><a class="lp-btn" href="city-'+p.s+'.html">'+LBL.openGuide+'</a></div>').addTo(grp);});
map.addLayer(grp);
try{map.fitBounds(grp.getBounds().pad(0.06));}catch(e){}
}catch(e){}
try{var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.08});document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});}catch(e){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in');});}
</script>`;
}

// ── main render ─────────────────────────────────────────────────────────────
function render(lang, d) {
  let html = fs.readFileSync(SRC, 'utf8');

  // 1) replace <head> inner (title..og:locale) — from <title> to the theme-color line
  const headStart = html.indexOf('<title>');
  const themeIdx = html.indexOf('<meta name="theme-color"');
  html = html.slice(0, headStart) + headBlock(lang, d) + '\n' + html.slice(themeIdx);

  // 2) <html lang dir>
  html = html.replace('<html lang="en">', `<html lang="${lang}"${RTL.has(lang) ? ' dir="rtl"' : ''}>`);

  // 3) JSON-LD description + inLanguage
  html = html.replace('"description":"A Thailand travel guide from people who actually go — hotel, food and attraction reviews plus trip plans across Thailand","inLanguage":"en"',
    `"description":${JSON.stringify(d.head.jsonldDesc)},"inLanguage":"${lang}"`);

  // 4) logo hrefs -> localized homepage root
  const root = lang === 'th' ? '/' : `/${lang}/`;
  html = html.replace('<a href="/en/" class="logo">', `<a href="${root}" class="logo">`);

  // 5) language flag-bar: replace nav dropdown, add one to the mobile menu, inject CSS
  html = html.replace(/<details class="langsel">[\s\S]*?<\/details>/, flagbar(lang));
  html = html.replace('<button class="mm-cta"', flagbar(lang) + '\n  <button class="mm-cta"');
  html = html.replace('</style>', flagCSS() + '\n</style>');

  // 6) chrome string replacements
  for (const [k, en, opt] of CHROME) {
    const tr = d.chrome[k];
    if (tr == null) throw new Error(`missing chrome translation: ${k} (${lang})`);
    const count = html.split(en).length - 1;
    if (count === 0) throw new Error(`anchor not found: ${k} :: ${en}`);
    if (count > 1 && !(opt && opt.all)) throw new Error(`anchor not unique (${count}x): ${k} :: ${en}`);
    // translated value keeps the same surrounding markup: english anchors include
    // the markup, so translators translate the whole substring (markup preserved).
    html = html.split(en).join(tr);
  }

  // 7) newsletter: localize call + inline msgs + source tag
  html = html.replace("onsubmit=\"return taSubmitNewsletter(this,'en')\"", `onsubmit="return taSubmitNewsletter(this,'${lang}')"`);
  const L = { ...UI_KEYS, ...d.ui };
  html = html.replace(
    "var msgs=lang==='en'?{sending:'Sending…',ok:'Thanks! ✓',fail:'Something went wrong — try again'}:{sending:'กำลังส่ง…',ok:'ขอบคุณ! ✓',fail:'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง'};",
    `var msgs=${JSON.stringify({ sending: L.nlSending, ok: L.nlOk, fail: L.nlFail })};`);
  html = html.replace("source:'homepage-newsletter-en'", `source:'homepage-newsletter-${lang}'`);

  // 8) trailing data+logic script -> localized
  const dsStart = html.indexOf('<script>\n/*GEN:PROV*/');
  const dsEnd = html.indexOf('</script>', dsStart) + '</script>'.length;
  if (dsStart < 0) throw new Error('trailing data script marker not found');
  html = html.slice(0, dsStart) + dataScript(lang, d) + html.slice(dsEnd);

  return html;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const src = fs.readFileSync(SRC, 'utf8');

if (args[0] === '--extract-en') {
  const d = buildEnDict(src);
  fs.writeFileSync(path.join(HERE, 'en.json'), JSON.stringify(d, null, 2));
  console.log('wrote en.json:', Object.keys(d.chrome).length, 'chrome +', Object.keys(d.prov).length, 'provinces');
} else if (args[0] === '--check') {
  const d = JSON.parse(fs.readFileSync(path.join(HERE, 'en.json'), 'utf8'));
  const out = render('en', d);
  fs.writeFileSync(path.join(HERE, '_check-en.html'), out);
  console.log('wrote _check-en.html (', out.length, 'bytes ) — diff its static body vs source to validate anchors');
} else if (args[0] === '--flags-th-en') {
  // patch the two hand-authored homepages (th at public/index.html, en at public/en/index.html)
  for (const [lang, file] of [['th', path.join(ROOT, 'astro', 'public', 'index.html')], ['en', SRC]]) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<details class="langsel">[\s\S]*?<\/details>/, flagbar(lang));
    if (!html.includes('class="flagbar')) throw new Error(`langsel not found in ${file}`);
    if (!/<div class="flagbar[^"]*"[^>]*>[\s\S]*?<\/div>\s*\n\s*<button class="mm-cta"/.test(html))
      html = html.replace('<button class="mm-cta"', flagbar(lang) + '\n  <button class="mm-cta"');
    if (!html.includes('.flagbar{')) html = html.replace('</style>', flagCSS() + '\n</style>');
    fs.writeFileSync(file, html);
    console.log('patched', file);
  }
} else if (args.length) {
  for (const lang of args) {
    const dictPath = path.join(HERE, `${lang}.json`);
    if (!fs.existsSync(dictPath)) { console.error('MISSING dict:', dictPath); process.exit(1); }
    const d = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    const out = render(lang, d);
    fs.mkdirSync(OUTDIR(lang), { recursive: true });
    fs.writeFileSync(path.join(OUTDIR(lang), 'index.html'), out);
    console.log('generated', `astro/public/${lang}/index.html`, `(${out.length} bytes)`);
  }
} else {
  console.log('usage: build.mjs --extract-en | --check | <lang...>');
}
