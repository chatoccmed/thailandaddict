// HTML localizer — turn a built English page into any locale, keeping structure/images/URLs.
// "Same layout, translate text only": walks the parsed DOM, swaps visible text + a few attributes
// via a translation memory (tm.<loc>.json, keyed by the trimmed English string), rewrites <html
// lang/dir>, hreflang, canonical/og, injects the per-script font + RTL stylesheet, and rebuilds the
// language switcher so every locale links to the SAME page under its own /prefix/.
//
// Usage:
//   node _internal/i18n/localize.mjs --collect  [file ...]     → dump unique EN strings to strings.json (worklist)
//   node _internal/i18n/localize.mjs zh ar      [file ...]     → build those locales (default: all /en pages)
//   (files are paths under astro/public/en, or bare slugs; omit to process the whole /en tree)
import fs from 'node:fs';
import path from 'node:path';
import { parse, parseFragment, serialize } from '../../astro/node_modules/parse5/dist/index.js';
import { LOCALES, LOCALE_MAP, LOCALE_CODES, prefix } from './locales.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PUB  = path.join(ROOT, 'astro/public');
const ENDIR = path.join(PUB, 'en');
const I18N = path.resolve(import.meta.dirname);
const SITE = 'https://thailandaddict.com';

// ── what to translate ──
const SKIP_TAGS = new Set(['script','style','noscript','template','svg','code','pre']);
const TEXT_ATTRS = new Set(['alt','title','placeholder','aria-label']);
const META_NAME  = new Set(['description','twitter:title','twitter:description']);
const META_PROP  = new Set(['og:title','og:description']);
const hasLetter = s => /[\p{L}]/u.test(s);          // skip pure punctuation / arrows / emoji
const rdJson = f => { try { return JSON.parse(fs.readFileSync(f,'utf8')); } catch { return {}; } };

// ── tiny DOM helpers over parse5 tree ──
const attr = (node, name) => (node.attrs||[]).find(a=>a.name===name);
const getAttr = (node, name) => { const a=attr(node,name); return a?a.value:undefined; };
const setAttr = (node, name, val) => { const a=attr(node,name); if(a) a.value=val; else (node.attrs=node.attrs||[]).push({name,value:val}); };
const hasClass = (node, cls) => (getAttr(node,'class')||'').split(/\s+/).includes(cls);
function* walk(node){ yield node; for(const c of (node.childNodes||[])) yield* walk(c); }
const find = (root, pred) => { for(const n of walk(root)) if(n.tagName && pred(n)) return n; return null; };
const findAll = (root, pred) => { const out=[]; for(const n of walk(root)) if(n.tagName && pred(n)) out.push(n); return out; };
const el = (root, tag) => find(root, n=>n.tagName===tag);

// collect/translate every visible string in a document; `tr` maps EN→localized (identity in collect mode)
function processStrings(doc, tr, collector){
  for(const n of walk(doc)){
    // text nodes
    if(n.nodeName==='#text'){
      const parentTag = n.parentNode && n.parentNode.tagName;
      if(parentTag && SKIP_TAGS.has(parentTag)) continue;
      const raw = n.value; const core = raw.trim();
      if(!core || !hasLetter(core)) continue;
      const lead = raw.slice(0, raw.indexOf(core[0]));
      const tail = raw.slice(lead.length + core.length);
      if(collector) collector.add(core);
      n.value = lead + tr(core) + tail;
      continue;
    }
    if(!n.tagName) continue;
    // translatable attributes
    for(const a of (n.attrs||[])){
      if(TEXT_ATTRS.has(a.name) && a.value && hasLetter(a.value)){
        if(collector) collector.add(a.value.trim());
        a.value = tr(a.value.trim());
      }
    }
    // meta content (description / og / twitter)
    if(n.tagName==='meta'){
      const nm=getAttr(n,'name'), pr=getAttr(n,'property'), c=getAttr(n,'content');
      if(c && hasLetter(c) && ((nm&&META_NAME.has(nm)) || (pr&&META_PROP.has(pr)))){
        if(collector) collector.add(c.trim());
        setAttr(n,'content', tr(c.trim()));
      }
    }
  }
}

// rewrite absolute /en/… links to /<loc>/… ; leave shared root assets (/images, /js, /data…) alone.
// Also fix BARE relative page links (href="foo" / "foo.html" / "foo#x"): the EN source uses them because
// they resolve same-dir (/en/foo works on an /en/ page), but copied verbatim into /<loc>/ they resolve to
// /<loc>/foo and 404 when no localized version exists. Point them at the localized page if it exists, else
// the /en/ version, else the TH root — mirroring gen-hubs' cleanLinks(). `avail` = slugs present in /<loc>/.
const BARE_LINK = /^[a-z0-9][\w-]*(?:\.html)?(?:[#?].*)?$/i;   // e.g. near-me, top10-hotels-krabi.html, city-phuket#see
function rewriteUrls(doc, loc, avail){
  const pfx = prefix(loc);
  for(const n of walk(doc)){
    if(!n.tagName) continue;
    for(const a of (n.attrs||[])){
      if((a.name==='href'||a.name==='src'||a.name==='action') && a.value){
        const v = a.value;
        // /en/<slug> → /<loc>/<slug>, but ONLY when that slug really has a localized page. The EN hub
        // pages link to plenty of EN-only content (e.g. /en/thailand-travel-budget); rewriting those blindly
        // produced /<loc>/thailand-travel-budget → 404. avail covers hub + localized content, so an
        // unknown slug correctly stays on /en/.
        if(v.startsWith('/en/')){
          if(a.name === 'href' && avail){
            const rest = v.slice(4);
            const slug = rest.split(/[#?]/)[0].replace(/\.html$/,'');
            a.value = avail.has(slug) ? (pfx + rest) : v;
          } else a.value = pfx + v.slice(4);
        }
        else if(v===`${SITE}/en/`) a.value = `${SITE}${pfx}`;
        else if(v.startsWith(`${SITE}/en/`)) a.value = `${SITE}${pfx}` + v.slice((SITE+'/en/').length);
        else if(a.name==='href' && avail && BARE_LINK.test(v)){
          // A bare link on the EN source already resolves to /en/<slug> (that's why it works on the EN page),
          // so /en/<slug> is the known-good target. Upgrade to the in-locale page only when one exists.
          // (prefix() already ends in '/', so no extra slash.) Genuinely-dead-on-EN targets stay dead but
          // consistent with EN — that's a separate content gap, not a localize bug.
          const base = v.split(/[#?]/)[0];              // strip #hash / ?query
          const tail = v.slice(base.length);
          const slug = base.replace(/\.html$/,'');
          a.value = avail.has(slug) ? `${pfx}${slug}${tail}` : `/en/${slug}${tail}`;
        }
      }
    }
  }
}

// language switcher: replace the .lang-wrap contents with a 9-locale dropdown (active = loc)
function buildSwitcher(loc, fileSlug){
  const cur = LOCALE_MAP[loc];
  const items = LOCALES.map(l=>{
    const href = (l.code===loc) ? null : prefix(l.code)+fileSlug;
    const on = l.code===loc ? ' aria-current="true"' : '';
    return `<a class="lsw-item${l.code===loc?' active':''}" hreflang="${l.htmlLang}" ${href?`href="${href}"`:'aria-disabled="true"'}${on}><span class="lsw-code">${l.code.toUpperCase()}</span><span class="lsw-label">${l.label}</span></a>`;
  }).join('');
  return `<div class="lang-switch" dir="ltr"><button class="lang-btn" type="button" aria-haspopup="true" aria-expanded="false"><span>${cur.code.toUpperCase()}</span> <span class="lang-caret">▾</span></button><div class="lang-menu">${items}</div></div>`;
}
function replaceSwitcher(doc, loc, fileSlug){
  const wrap = find(doc, n=>hasClass(n,'lang-wrap'));
  if(!wrap) return false;
  const frag = parseFragment(buildSwitcher(loc, fileSlug));
  for(const c of frag.childNodes) c.parentNode = wrap;
  wrap.childNodes = frag.childNodes;
  return true;
}

// small runtime for the dropdown + shared switcher CSS (injected once per page)
const SWITCHER_CSS = `<style id="lsw-css">
.lang-switch{position:relative;font-family:Outfit,'Noto Sans Thai',sans-serif}
.lang-btn{display:inline-flex;align-items:center;gap:4px;font:inherit;font-weight:700;font-size:13px;color:var(--ink,#0F172A);background:var(--bl-lt,#f1fbfd);border:1.5px solid var(--bdr,#e6eef2);border-radius:999px;padding:6px 12px;cursor:pointer}
.lang-caret{font-size:10px}
.lang-menu{position:absolute;top:calc(100% + 6px);inset-inline-end:0;min-width:150px;background:#fff;border:1px solid var(--bdr,#e6eef2);border-radius:14px;box-shadow:0 12px 30px rgba(15,23,42,.14);padding:6px;display:none;z-index:120;max-height:60vh;overflow:auto}
.lang-switch.open .lang-menu{display:block}
.lsw-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:9px;color:var(--ink,#0F172A);text-decoration:none;font-size:13.5px}
.lsw-item:hover{background:var(--bl-lt,#f1fbfd)}
.lsw-item.active{background:linear-gradient(135deg,var(--bl,#06B6D4),var(--or,#FB7185));color:#fff}
.lsw-item[aria-disabled]{pointer-events:none}
.lsw-code{font-weight:800;font-size:11px;min-width:22px;color:var(--sub,#64748b)}
.lsw-item.active .lsw-code{color:#fff}
</style>`;
const SWITCHER_JS = `<script>(function(){var s=document.querySelector('.lang-switch');if(!s)return;var b=s.querySelector('.lang-btn');b.addEventListener('click',function(e){e.stopPropagation();s.classList.toggle('open');b.setAttribute('aria-expanded',s.classList.contains('open'))});document.addEventListener('click',function(){s.classList.remove('open');b.setAttribute('aria-expanded','false')})})();</script>`;

// RTL: flip direction, then mirror the handful of physically-positioned rules in the shared CSS
// (dropdowns, drawer, search icon, corner badges, callout border, decorative blobs).
const RTL_CSS = `<style id="rtl-css">
html[dir="rtl"]{direction:rtl}
html[dir="rtl"] body{text-align:right}
html[dir="rtl"] .mm{transform:translateX(-100%)}
html[dir="rtl"] .mm.open{transform:translateX(0)}
html[dir="rtl"] .nav-mid .drop{left:auto;right:-14px}
html[dir="rtl"] .search-box::before{left:auto;right:12px}
html[dir="rtl"] .search-drop{right:auto;left:0}
html[dir="rtl"] .lang-menu{inset-inline-end:0;inset-inline-start:auto}
html[dir="rtl"] .hc-score,html[dir="rtl"] .ahub-tag,html[dir="rtl"] .tagn{left:auto;right:12px}
html[dir="rtl"] .quickbox{border-left:0;border-right:4px solid #06B6D4}
html[dir="rtl"] .ctaband::after{right:auto;left:-50px}
html[dir="rtl"] .thero::before{right:auto;left:-60px}
</style>`;

function fontLink(loc){
  const f = LOCALE_MAP[loc].font;
  return f ? `<link href="https://fonts.googleapis.com/css2?family=${f}&display=swap" rel="stylesheet">` : '';
}

function appendToHead(doc, html){
  const head = el(doc,'head'); if(!head) return;
  const frag = parseFragment(html);
  for(const c of frag.childNodes){ c.parentNode=head; head.childNodes.push(c); }
}

// full hreflang set for a slug across all built locales (+ x-default → en)
function hreflangSet(slug, builtCodes){
  const codes = ['th','en',...builtCodes.filter(c=>c!=='th'&&c!=='en')];
  const uniq = [...new Set(codes)];
  const links = uniq.map(c=>`<link rel="alternate" hreflang="${LOCALE_MAP[c].htmlLang}" href="${SITE}${prefix(c)}${slug}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE}/en/${slug}">`);
  return links.join('');
}

function localizeDoc(html, loc, cleanSlug, fileSlug, builtCodes, tr, avail){
  const doc = parse(html);
  const htmlEl = el(doc,'html');
  setAttr(htmlEl,'lang', LOCALE_MAP[loc].htmlLang);
  setAttr(htmlEl,'dir', LOCALE_MAP[loc].dir);
  processStrings(doc, tr, null);
  rewriteUrls(doc, loc, avail);
  // head meta rewrites (canonical/og:url use the clean, extension-less URL)
  const canon = find(doc, n=>n.tagName==='link' && getAttr(n,'rel')==='canonical');
  if(canon) setAttr(canon,'href', `${SITE}${prefix(loc)}${cleanSlug}`);
  const ogUrl = find(doc, n=>n.tagName==='meta' && getAttr(n,'property')==='og:url');
  if(ogUrl) setAttr(ogUrl,'content', `${SITE}${prefix(loc)}${cleanSlug}`);
  const ogLoc = find(doc, n=>n.tagName==='meta' && getAttr(n,'property')==='og:locale');
  if(ogLoc) setAttr(ogLoc,'content', LOCALE_MAP[loc].ogLocale);
  // replace hreflang alternates
  const alts = findAll(doc, n=>n.tagName==='link' && getAttr(n,'rel')==='alternate' && getAttr(n,'hreflang'));
  for(const a of alts){ const p=a.parentNode; p.childNodes = p.childNodes.filter(c=>c!==a); }
  appendToHead(doc, hreflangSet(cleanSlug, builtCodes));
  // switcher + fonts + css + (rtl)
  replaceSwitcher(doc, loc, fileSlug);
  appendToHead(doc, fontLink(loc) + SWITCHER_CSS + (LOCALE_MAP[loc].dir==='rtl' ? RTL_CSS : ''));
  // switcher JS before </body>
  const body = el(doc,'body');
  if(body){ const frag=parseFragment(SWITCHER_JS); for(const c of frag.childNodes){c.parentNode=body; body.childNodes.push(c);} }
  return serialize(doc);
}

// ── driver ──
const args = process.argv.slice(2);
const collect = args.includes('--collect');
const locs = args.filter(a=>LOCALE_CODES.includes(a) && a!=='th' && a!=='en');
let files = args.filter(a=>!a.startsWith('--') && !LOCALE_CODES.includes(a));
if(!files.length){
  files = fs.readdirSync(ENDIR).filter(f=>f.endsWith('.html'));
} else {
  files = files.map(f=>f.endsWith('.html')?path.basename(f):f+'.html');
}

if(collect){
  const set = new Set();
  for(const f of files){
    const html = fs.readFileSync(path.join(ENDIR,f),'utf8');
    processStrings(parse(html), x=>x, set);
  }
  const list = [...set].sort((a,b)=>a.localeCompare(b));
  fs.writeFileSync(path.join(I18N,'strings.json'), JSON.stringify(list,null,1));
  console.log(`[collect] ${files.length} pages → ${list.length} unique strings → _internal/i18n/strings.json`);
  process.exit(0);
}

if(!locs.length){ console.error('no target locales given (e.g. zh ar)'); process.exit(1); }
for(const loc of locs){
  const tm = rdJson(path.join(I18N,`tm.${loc}.json`));
  let hit=0, miss=0;
  const tr = s => { if(tm[s]!=null){hit++; return tm[s];} miss++; return s; };
  const outDir = path.join(PUB, loc);
  fs.mkdirSync(outDir,{recursive:true});
  // avail = slugs that have a page in /<loc>/ → the pages this run localizes PLUS whatever gen-hubs already
  // wrote there (the 30 tourism-city pages). Bare relative links resolve against this to stay in-locale when
  // a localized version exists, and fall back to /en/ otherwise.
  const avail = new Set([
    ...files.map(f => f.replace(/\.html$/,'')),
    ...(fs.existsSync(outDir) ? fs.readdirSync(outDir).filter(x=>x.endsWith('.html')).map(x=>x.replace(/\.html$/,'')) : []),
    // ...plus localized CONTENT (reviews/roundups/articles-<loc>) — Astro renders those to /<loc>/<slug>
    // too. Without them avail is hub-only, and an /en/ link to a translated review would be left on /en/.
    ...['reviews','roundups','articles'].flatMap(k => {
      const d = path.join(ROOT, 'astro/src/content', `${k}-${loc}`);
      return fs.existsSync(d) ? fs.readdirSync(d).filter(x=>x.endsWith('.json')).map(x=>x.replace(/\.json$/,'')) : [];
    }),
  ]);
  for(const f of files){
    const fileSlug  = f==='index.html' ? '' : f;
    const cleanSlug = f==='index.html' ? '' : f.replace(/\.html$/,'');
    const html = fs.readFileSync(path.join(ENDIR,f),'utf8');
    const out = localizeDoc(html, loc, cleanSlug, fileSlug, locs, tr, avail);
    fs.writeFileSync(path.join(outDir,f), out);
  }
  console.log(`[${loc}] ${files.length} pages → astro/public/${loc}/ · tm hits:${hit} misses(→en):${miss}`);
}
