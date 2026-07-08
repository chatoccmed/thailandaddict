// Make gen-hubs.mjs locale-aware for 9 languages.
// Design: th/en generate everything (unchanged output). The 7 new locales
// generate ONLY tourism-city hubs that have a translated province-data-<loc>
// file; cross-links to pages not present in the locale fall back to /en/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const F = path.join(ROOT, '_internal', 'gen-hubs.mjs');
let s = fs.readFileSync(F, 'utf8');
const rep = (a, b, label) => { if (!s.includes(a)) { console.error('MISS:', label); process.exit(1); } s = s.split(a).join(b); };

// E1 — locale infrastructure constants, inserted just before `let LOC = 'th';`
const infra = `// ── 9-language locale infrastructure ──
const NEW_LOCS = ['zh','ru','ko','ja','hi','he','ar'];
const RTL_LOCS = new Set(['he','ar']);
const OG_LOCALE = {th:'th_TH',en:'en_US',zh:'zh_CN',ru:'ru_RU',ko:'ko_KR',ja:'ja_JP',hi:'hi_IN',he:'he_IL',ar:'ar_AR'};
const LANG_LABEL = {th:'ไทย',en:'English',zh:'中文',ru:'Русский',ko:'한국어',ja:'日本語',hi:'हिन्दी',he:'עברית',ar:'العربية'};
const PILLAR_SLUGS = ['first-time-thailand','thailand-7-day-itinerary','thailand-10-day-itinerary','thailand-2-week-itinerary','thailand-3-week-itinerary','thailand-1-month-itinerary','northern-thailand-itinerary','southern-thailand-itinerary','thailand-with-kids-itinerary','thailand-honeymoon-itinerary','songkran-guide','yi-peng-lantern-festival'];
const TOURISM = [...new Set([...TOPDEST, ...DESTINATIONS.map(d=>d[0])])];
const REGION_OF = Object.fromEntries([...PROVINCES, ...DESTINATIONS].map(([sl,,r])=>[sl,r]));
const CHROME = {};
for(const l of NEW_LOCS){ try{ CHROME[l]=JSON.parse(fs.readFileSync(path.join(ROOT,'_internal/hub-i18n',l+'.json'),'utf8')); }catch{ CHROME[l]=null; } }
const CITY_NAME = {};
for(const l of NEW_LOCS){ CITY_NAME[l]={}; try{ const h=JSON.parse(fs.readFileSync(path.join(ROOT,'_internal/homepage-i18n',l+'.json'),'utf8')); for(const [sl,o] of Object.entries(h.prov||{})) if(o&&o.n) CITY_NAME[l][sl]=o.n; }catch{} }
const FLAG_B64 = {};
for(const l of ['th','en',...NEW_LOCS]){ try{ FLAG_B64[l]=fs.readFileSync(path.join(ROOT,'astro/public/images/flags',l+'.svg')).toString('base64'); }catch{} }
let AVAIL = null;   // set per genAll: page-slugs that exist in the current (new) locale
// which locales a PAGE slug exists in (tourism-city hubs vary by translated data; everything else = th/en)
function pageLocales(slug){
  const m = /^city-(.+)$/.exec(slug);
  if(m && TOURISM.includes(m[1])){ const locs=['th','en']; for(const l of NEW_LOCS){ try{ if(fs.existsSync(path.join(DATA+'-'+l, m[1]+'.json'))) locs.push(l); }catch{} } return locs; }
  return ['th','en'];
}
`;
rep("let LOC = 'th';                                  // current locale being generated",
    infra + "let LOC = 'th';                                  // current locale being generated", 'E1 infra');

// E2 — tx() 9-way
rep("const tx = (th, en) => LOC === 'en' ? en : th;   // pick locale string",
    "const tx = (th, en) => LOC==='th' ? th : LOC==='en' ? en : (CHROME[LOC] && (en in CHROME[LOC]) ? CHROME[LOC][en] : en);", 'E2 tx');

// E3 — NAME() 9-way
rep("const NAME = slug => LOC === 'en' ? (EN_NAME[slug] || slug.replace(/-/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase())) : (TH[slug] || slug);",
    "const NAME = slug => LOC==='th' ? (TH[slug] || slug) : LOC==='en' ? (EN_NAME[slug] || slug.replace(/-/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase())) : ((CITY_NAME[LOC] && CITY_NAME[LOC][slug]) || EN_NAME[slug] || slug.replace(/-/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase()));", 'E3 NAME');

// E4 — RNAME / RINTRO (en fallback for new locales)
rep("const RNAME = r => LOC === 'en' ? REGION[r].en : REGION[r].th;",
    "const RNAME = r => LOC==='th' ? REGION[r].th : REGION[r].en;", 'E4 RNAME');
rep("const RINTRO = r => LOC === 'en' ? REGION[r].intro_en : REGION[r].intro;",
    "const RINTRO = r => LOC==='th' ? REGION[r].intro : REGION[r].intro_en;", 'E4 RINTRO');

// E5 — PFX()
rep("const PFX = () => LOC === 'en' ? '/en/' : '/';    // home href for current locale",
    "const PFX = () => LOC==='th' ? '/' : '/'+LOC+'/';    // home href for current locale", 'E5 PFX');

// E6 — cjB sid prefix
rep("((LOC==='en'?'en-':'')+String(sid||'hub'))", "((LOC==='th'?'':LOC+'-')+String(sid||'hub'))", 'E6 cjB');

// E7 — readData locale dirs
rep("const dirs = LOC==='en' ? [DATA+'-en', DATA] : [DATA];   // EN prefers province-data-en, falls back to TH",
    "const dirs = LOC==='th' ? [DATA] : LOC==='en' ? [DATA+'-en', DATA] : [DATA+'-'+LOC, DATA+'-en', DATA];", 'E7 readData');

// E8 — cleanLinks locale-aware (whole body)
rep(`  return html
    .replace(/href="(?!https?:|\\/\\/)(\\/?[a-zA-Z0-9][a-zA-Z0-9/_-]*)\\.html((?:#[^"]*)?)"/g, 'href="$1$2"')
    .replace(/location\\.href='(?!https?:|\\/\\/)(\\/?[a-zA-Z0-9][^']*?)\\.html((?:\\?[^']*)?)'/g, "location.href='$1$2'");`,
`  const isNew = LOC!=='th' && LOC!=='en';
  const fix = (p, hash) => { if(!isNew) return p+hash; const sl = p.replace(/^\\//,''); return (AVAIL && AVAIL.has(sl)) ? '/'+LOC+'/'+sl+hash : '/en/'+sl+hash; };
  return html
    .replace(/href="(?!https?:|\\/\\/)(\\/?[a-zA-Z0-9][a-zA-Z0-9/_-]*)\\.html((?:#[^"]*)?)"/g, (m,p,h)=>\`href="\${fix(p,h)}"\`)
    .replace(/location\\.href='(?!https?:|\\/\\/)(\\/?[a-zA-Z0-9][^']*?)\\.html((?:\\?[^']*)?)'/g, (m,p,h)=>\`location.href='\${fix(p,h)}'\`);`, 'E8 cleanLinks');

// E9 — page() head: canon, html lang/dir, hreflang, og:locale
rep("const canon = `https://thailandaddict.com/${LOC==='en'?'en/':''}${slug}`;",
    "const canon = `https://thailandaddict.com/${LOC==='th'?'':LOC+'/'}${slug}`;", 'E9 canon');
rep('<html lang="${LOC}"><head>', '<html lang="${LOC}"${RTL_LOCS.has(LOC)?\' dir="rtl"\':\'\'}><head>', 'E9 htmldir');
rep('<link rel="alternate" hreflang="th" href="${altTH}"><link rel="alternate" hreflang="en" href="${altEN}"><link rel="alternate" hreflang="x-default" href="${altTH}">',
    '${pageLocales(slug).map(l=>`<link rel="alternate" hreflang="${l}" href="https://thailandaddict.com/${l===\'th\'?\'\':l+\'/\'}${slug}">`).join(\'\')}<link rel="alternate" hreflang="x-default" href="${altTH}">', 'E9 hreflang');
rep('<meta property="og:locale" content="${LOC===\'en\'?\'en_US\':\'th_TH\'}">',
    '<meta property="og:locale" content="${OG_LOCALE[LOC]||\'th_TH\'}">', 'E9 oglocale');

// E10 — navHtml: dynamic flag-bar + per-page new-locale flag CSS
rep("function navHtml(slug){\n  const lbTH",
`function navHtml(slug){
  const _locs = pageLocales(slug);
  const _extra = _locs.filter(l=>l!=='th'&&l!=='en');
  const _flagcss = _extra.length ? '<style>'+_extra.map(l=>\`.flg-\${l}{background-image:url("data:image/svg+xml;base64,\${FLAG_B64[l]}")}\`).join('')+'</style>' : '';
  const _bar = '<div class="flagbar" role="navigation" aria-label="Language">'+_locs.map(l=>\`<a href="/\${l==='th'?'':l+'/'}\${slug}"\${l===LOC?' class="on"':''} title="\${LANG_LABEL[l]}" aria-label="\${LANG_LABEL[l]}"><span class="flg flg-\${l}"></span></a>\`).join('')+'</div>';
  const lbTH`, 'E10 navHtml consts');
rep("  return `<nav class=\"nav\">", "  return `${_flagcss}<nav class=\"nav\">", 'E10 navHtml return');
// replace the old 2-flag bar markup with ${_bar}
rep('<div class="flagbar" role="navigation" aria-label="Language"><a href="/${slug}.html"${LOC===\'th\'?\' class="on"\':\'\'} title="ไทย" aria-label="ไทย"><span class="flg flg-th"></span></a><a href="/en/${slug}.html"${LOC===\'en\'?\' class="on"\':\'\'} title="English" aria-label="English"><span class="flg flg-en"></span></a></div>',
    '${_bar}', 'E10 flagbar markup');

// E11 — base CSS: RTL flag-bar mirror (added after the .flg rule)
rep(".flg{width:100%;height:100%;background-size:cover;background-position:center;display:block}",
    ".flg{width:100%;height:100%;background-size:cover;background-position:center;display:block}\nhtml[dir=\"rtl\"] .flagbar{flex-direction:row-reverse}", 'E11 RTL flagbar');

// E12 — genAll: new-locale branch (tourism cities only)
rep("  LOC = loc;                                  // set current locale for all builders\n  fs.mkdirSync(outDir, { recursive: true });",
`  LOC = loc;                                  // set current locale for all builders
  fs.mkdirSync(outDir, { recursive: true });
  if(loc!=='th' && loc!=='en'){
    const cities = TOURISM.filter(sl => fs.existsSync(path.join(DATA+'-'+loc, sl+'.json')));
    AVAIL = new Set([...cities.map(sl=>'city-'+sl), ...PILLAR_SLUGS]);
    let n=0;
    for(const sl of cities){ const d=readData(sl); if(!d) continue; fs.writeFileSync(path.join(outDir,\`city-\${sl}.html\`), provinceHub(sl, TH[sl]||sl, REGION_OF[sl], d)); n++; }
    console.log(\`[\${loc}] → \${path.relative(ROOT,outDir)} · tourism-cities:\${n}\`);
    return;
  }
  AVAIL = null;`, 'E12 genAll branch');

// E13 — LOCALES loop over 9 + per-locale outDir
rep("const want = process.argv.slice(2).filter(a=>['th','en'].includes(a));",
    "const want = process.argv.slice(2).filter(a=>['th','en',...NEW_LOCS].includes(a));", 'E13 want');
rep("const LOCALES = want.length ? want : ['th','en'];",
    "const LOCALES = want.length ? want : ['th','en',...NEW_LOCS];", 'E13 LOCALES');
rep("for(const loc of LOCALES) genAll(loc, loc==='en' ? path.join(PUB,'en') : PUB);",
    "for(const loc of LOCALES) genAll(loc, loc==='th' ? PUB : path.join(PUB, loc));", 'E13 loop');

fs.writeFileSync(F, s);
console.log('patched gen-hubs.mjs — locale-aware for 9 languages.');
