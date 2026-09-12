// HTML localizer — turn a built English page into any locale, keeping structure/images/URLs.
// "Same layout, translate text only": walks the parsed DOM, swaps visible text + a few attributes
// via a translation memory (tm.<loc>.json, keyed by the trimmed English string), rewrites <html
// lang/dir>, hreflang, canonical/og, and re-points the language switcher at the current locale.
//
// Usage:
//   node _internal/i18n/localize.mjs --collect  [file ...]     → dump unique EN strings to strings.json (worklist)
//   node _internal/i18n/localize.mjs zh ar      [file ...]     → build those locales (default: all /en pages)
//   (files are paths under astro/public/en, or bare slugs; omit to process the whole /en tree)
//
// ── THE APP SHELL (2026-09) ────────────────────────────────────────────────────
// gen-hubs.mjs now renders its chrome from _internal/lib/chrome.mjs — header,
// tab bar, trip rail, More sheet, language popover. That chrome arrives here
// inside the /en/ source page, so a localized hub inherits it for free. Three
// things had to change for it to arrive CORRECTLY, and one whole pile of code
// had to go:
//
//   1. Chrome words come from chrome.mjs, not from the translation memory.
//      shellLabelsFor('en') paired with shellLabelsFor(loc) is the exact
//      English→locale map chrome.mjs itself would have emitted, so /zh/city-krabi
//      (written by gen-hubs) and /zh/activities-krabi (written here) cannot
//      disagree about the word for "Destinations". The hub dictionary that
//      gen-hubs::tx() reads is consulted next, for the footer, before the tm.
//
//   2. The language popover is DATA, not prose. Its entries are the nine
//      language NAMES — translating "English" into 英语 there would be exactly
//      wrong. That subtree is excluded from translation entirely; only
//      aria-current moves, onto the locale being written.
//
//   3. `/en/` on its own (the brand link, the Explore tab) now resolves to
//      `/<loc>/`. It used to fall through every branch and stay on /en/.
//
// Deleted, not ported: a 13-rule RTL stylesheet whose selectors (.mm,
// .nav-mid .drop, .search-box, .search-drop, .lang-menu) belonged to the nav
// this replaced — shell.css is written in logical properties and mirrors by
// itself, and one of those rules would have fought the shell's own .lang-menu;
// a hand-rolled .lsw-item switcher plus its CSS and its dropdown script, which
// hung off a .lang-wrap that survives on 2 of 226 pages; and the Google Fonts
// link, because the shell subsets by unicode-range and hands CJK/Arabic/Hebrew/
// Devanagari to the system font — which is what the 210 locale hubs gen-hubs
// already ships do, and it saves those readers a render-blocking request.
// All of it still applies to the 9 pages that are not on the shell yet.
import fs from 'node:fs';
import path from 'node:path';
import { parse, parseFragment, serialize } from '../../astro/node_modules/parse5/dist/index.js';
import { LOCALES, LOCALE_MAP, LOCALE_CODES, prefix } from './locales.mjs';
import { shellLabelsFor, runtimeStrings } from '../lib/chrome.mjs';

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
// `skip` prunes a whole subtree — used to keep the language popover, whose text
// IS the nine language names, out of the translator.
function* walk(node, skip){
  if(skip && node.tagName && skip(node)) return;
  yield node;
  for(const c of (node.childNodes||[])) yield* walk(c, skip);
}
const find = (root, pred) => { for(const n of walk(root)) if(n.tagName && pred(n)) return n; return null; };
const findAll = (root, pred) => { const out=[]; for(const n of walk(root)) if(n.tagName && pred(n)) out.push(n); return out; };
const el = (root, tag) => find(root, n=>n.tagName===tag);

// collect/translate every visible string in a document; `tr` maps EN→localized (identity in collect mode)
function processStrings(doc, tr, collector, skip){
  for(const n of walk(doc, skip)){
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
function rewriteUrls(doc, loc, avail, skip){
  const pfx = prefix(loc);
  for(const n of walk(doc, skip)){
    if(!n.tagName) continue;
    for(const a of (n.attrs||[])){
      if((a.name==='href'||a.name==='src'||a.name==='action') && a.value){
        const v = a.value;
        // /en/<slug> → /<loc>/<slug>, but ONLY when that slug really has a localized page. The EN hub
        // pages link to plenty of EN-only content (e.g. /en/thailand-travel-budget); rewriting those blindly
        // produced /<loc>/thailand-travel-budget → 404. avail covers hub + localized content, so an
        // unknown slug correctly stays on /en/.
        // "/en/" by itself is the EN home — the shell's brand link and Explore
        // tab both point at it. It matched none of the branches below (slug ===
        // '' is never in `avail`), so every localized hub kept a header that
        // walked the reader back to English.
        if(v === '/en/' || v === '/en'){ a.value = pfx; }
        else if(v.startsWith('/en/')){
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

// RTL — PRE-SHELL pages only (the ~9 hand-written ones still on the old nav).
// Flips direction, then mirrors the physically-positioned rules in the old
// shared CSS: dropdowns, drawer, search icon, corner badges, callout border,
// decorative blobs.
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

// RTL — SHELL pages. Six selectors, all of them the page's own CONTENT.
// The chrome is gone from this list because shell.css is written in logical
// properties and mirrors by itself; `html[dir="rtl"]{direction:rtl}` and
// `body{text-align:right}` are gone because the dir attribute already does
// both, and unlayered they would outrank every rule in @layer shell. The
// .lang-menu rule in particular had to go: the shell's popover now owns that
// class name and positions itself with inset-inline.
//
// These ARE physical properties, deliberately: they mirror physical properties
// in the hub's own inline <style>, which gen-hubs has not moved to logical
// ones yet. They come back out the day it does. check-rtl.mjs does not gate
// this file for exactly that reason — see its LEGACY_UNGATED note.
const RTL_CONTENT_CSS = `<style id="rtl-content">
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

// Full hreflang set for a slug across all built locales, plus x-default.
//
// Both values here are chosen to MATCH gen-hubs.mjs::page(), which writes the
// th and en members of this same cluster: the bare locale code (not the
// script-qualified "zh-Hans"), and the Thai root as x-default (meta.json
// defaultLocale). An hreflang cluster only works if every member agrees; when
// they disagree Google picks one and discards the rest silently.
function hreflangSet(slug, builtCodes){
  const codes = ['th','en',...builtCodes.filter(c=>c!=='th'&&c!=='en')];
  const uniq = [...new Set(codes)];
  const links = uniq.map(c=>`<link rel="alternate" hreflang="${c}" href="${SITE}${prefix(c)}${slug}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE}/${slug}">`);
  return links.join('');
}

// A page is "on the shell" once chrome.mjs rendered its header. Everything the
// shell owns keys off this one fact, so there is no list to keep in step as the
// remaining hand-written pages migrate — they simply start taking the other
// branch on the day gen-hubs (or a layout) starts emitting a .ta-topbar.
const isShellPage = doc => !!find(doc, n => n.tagName==='header' && hasClass(n,'ta-topbar'));
const isLangMenu  = n => getAttr(n,'id')==='taLang';

// Two things in the shell chrome are about WHICH locale this is, so no
// dictionary can produce them — they have to be re-pointed by hand.
function retargetShellChrome(doc, loc, L){
  // 1. The popover lists all nine languages. Exactly one of them is current.
  const menu = find(doc, isLangMenu);
  if(menu){
    for(const a of findAll(menu, n=>n.tagName==='a')){
      a.attrs = (a.attrs||[]).filter(x=>x.name!=='aria-current');
      const hl = getAttr(a,'hreflang');
      if(hl===loc || hl===LOCALE_MAP[loc].htmlLang) setAttr(a,'aria-current','true');
    }
  }
  // 2. The header button shows the CURRENT language's own name — "中文", not
  //    the translation of the word "English".
  const btn = find(doc, n => n.tagName==='button' && hasClass(n,'lang-trigger'));
  if(btn){
    setAttr(btn,'aria-label', `${L.language} / Language`);
    const span = find(btn, n=>n.tagName==='span');
    if(span){
      for(const c of (span.childNodes||[])) c.parentNode = null;
      span.childNodes = [{ nodeName:'#text', value: LOCALE_MAP[loc].label, parentNode: span }];
    }
  }
}

function localizeDoc(html, loc, cleanSlug, fileSlug, builtCodes, tr, avail){
  const doc = parse(html);
  const shell = isShellPage(doc);
  const htmlEl = el(doc,'html');
  // Bare code, not the script-qualified tag: gen-hubs writes lang="zh" on the
  // /en/ and / twins of this very page, and a cluster that calls itself zh from
  // one member and zh-Hans from another is one Google reconciles by guessing.
  setAttr(htmlEl,'lang', loc);
  setAttr(htmlEl,'dir', LOCALE_MAP[loc].dir);
  // The language popover is exempt from BOTH passes. Its text is the nine
  // language names, and its nine hrefs are already absolute and per-locale —
  // "/en/city-krabi" there is the link to the English page, not a link that
  // needs moving to this locale. Rewriting it pointed English at /zh/.
  processStrings(doc, tr, null, shell ? isLangMenu : null);
  rewriteUrls(doc, loc, avail, shell ? isLangMenu : null);
  if(shell) retargetShellChrome(doc, loc, shellLabelsFor(loc));
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
  const rtl = LOCALE_MAP[loc].dir==='rtl';
  if(shell){
    // The shell brought its own switcher, its own stylesheet and its own font
    // strategy. Two things it could NOT bring, because the /en/ page it came
    // from is English: the content-level RTL mirrors, and the runtime-strings
    // blob — chrome.mjs emits that only for locales that are not th or en, so
    // there was none on the source page to inherit. Without it shell.js falls
    // back to English for the theme label, the toasts and the trip count.
    if(rtl) appendToHead(doc, RTL_CONTENT_CSS);
    const strings = runtimeStrings({ locale: loc });
    if(strings){
      const body = el(doc,'body');
      const toast = find(doc, n => getAttr(n,'data-shell-toast') !== undefined);
      const frag = parseFragment(strings);
      const host = (toast && toast.parentNode) || body;
      if(host){
        const at = toast && toast.parentNode ? host.childNodes.indexOf(toast) + 1 : host.childNodes.length;
        for(const c of frag.childNodes) c.parentNode = host;
        host.childNodes.splice(at, 0, ...frag.childNodes);
      }
    }
  } else {
    // Pre-shell page: unchanged behaviour, down to the byte.
    replaceSwitcher(doc, loc, fileSlug);
    appendToHead(doc, fontLink(loc) + SWITCHER_CSS + (rtl ? RTL_CSS : ''));
    const body = el(doc,'body');
    if(body){ const frag=parseFragment(SWITCHER_JS); for(const c of frag.childNodes){c.parentNode=body; body.childNodes.push(c);} }
  }
  return { html: serialize(doc), shell };
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

/* THE LOOKUP CHAIN, highest authority first.
 *
 * The translation memory used to be the only source, and for prose it still is
 * — 22k entries per locale, collected off these very pages and QA'd through the
 * i18n pipeline. What it is NOT good for is chrome, because the same English
 * word can be translated one way here and another way by gen-hubs, and the
 * reader sees both on the same page: /zh/city-krabi comes from gen-hubs,
 * /zh/activities-krabi comes from this script, and they are one click apart.
 *
 *   1. shell   chrome.mjs's own label set — what gen-hubs renders for the
 *              header, tab bar, rail and More sheet in this locale.
 *   2. hub     _internal/hub-i18n/<loc>.json — the dictionary gen-hubs::tx()
 *              reads. Owns the footer and the hub interface copy.
 *   3. ui      astro/src/i18n/ui.en.json paired with ui.<loc>.json by key path.
 *   4. tm      everything else: the page's prose.
 *
 * A miss returns English, as it always did. The per-source counts are printed
 * so a regression shows up as a number, not as someone noticing by eye. */
function buildChain(loc){
  const enL = shellLabelsFor('en'), locL = shellLabelsFor(loc);
  const shell = {};
  for(const k of Object.keys(enL)){
    if(enL[k] && locL[k] && locL[k] !== enL[k]) shell[enL[k]] = locL[k];
  }
  const hub = rdJson(path.join(ROOT,'_internal/hub-i18n',`${loc}.json`));
  const ui = {};
  (function pair(a,b){
    for(const k of Object.keys(a||{})){
      const va = a[k], vb = (b||{})[k];
      if(typeof va === 'string'){ if(typeof vb === 'string' && vb && vb !== va) ui[va] = vb; }
      else if(va && typeof va === 'object') pair(va, vb);
    }
  })(rdJson(path.join(ROOT,'astro/src/i18n','ui.en.json')), rdJson(path.join(ROOT,'astro/src/i18n',`ui.${loc}.json`)));
  const tm = rdJson(path.join(I18N,`tm.${loc}.json`));
  return { shell, hub, ui, tm };
}

for(const loc of locs){
  const D = buildChain(loc);
  const n = { shell:0, hub:0, ui:0, tm:0, miss:0 };
  const tr = s => {
    for(const src of ['shell','hub','ui','tm']){
      const v = D[src][s];
      if(v != null){ n[src]++; return v; }
    }
    n.miss++; return s;
  };
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
  /* HANDS OFF the pages gen-hubs renders in this locale.
   *
   * A tourism-city hub with a _internal/province-data-<loc>/<city>.json is
   * generated straight from TRANSLATED DATA — the words live in the data file,
   * so regenerating can never lose them. What this script would write instead
   * is the ENGLISH page run through a translation memory: strictly worse, and
   * silently so. gen-hubs happens to run first today (it is in prebuild, this
   * is manual), which is the only reason 210 good pages have survived. That is
   * an accident of ordering, not a rule, so here is the rule.
   *
   * Same predicate as gen-hubs.mjs::pageLocales. */
  const OWNED = new Set(files.filter(f => {
    const m = /^city-(.+)\.html$/.exec(f);
    return m && fs.existsSync(path.join(ROOT, '_internal', `province-data-${loc}`, `${m[1]}.json`));
  }));

  /* ...and the homepage, for a different reason.
   *
   * Since 2026-09-12 / and /en/ are the planner-first page, generated whole by
   * _internal/shell/build/gen-proto-home.mjs. Translating the EN one here gives
   * 40.4% coverage (measured), because 513 of its 683 unique strings are not UI
   * copy at all — they are opening hours, admission prices and review counts
   * lifted out of content data:
   *
   *     "08:00–16:00 (closed 3rd Wed–Thu of the month)"
   *     "฿200 for foreigners · free for Thais"
   *     "1,099 reviews · riverside, Khlong San side"
   *
   * No translation memory should ever hold those. They belong to the locale's
   * own content files, which is where gen-proto-home reads them from — its `L`
   * table already maps a locale to articles-<loc>/roundups-<loc>, exactly as
   * gen-hubs does for the 30 city hubs it owns.
   *
   * So the seven locale homepages stay on the previous page until
   * gen-proto-home learns their copy table, rather than being replaced with a
   * 60%-English one. Removing this line before that happens is the regression. */
  const HOME_OWNED = files.includes('index.html');
  if (HOME_OWNED) OWNED.add('index.html');

  let onShell = 0;
  for(const f of files){
    if(OWNED.has(f)) continue;
    const fileSlug  = f==='index.html' ? '' : f;
    const cleanSlug = f==='index.html' ? '' : f.replace(/\.html$/,'');
    const html = fs.readFileSync(path.join(ENDIR,f),'utf8');
    const out = localizeDoc(html, loc, cleanSlug, fileSlug, locs, tr, avail);
    if(out.shell) onShell++;
    fs.writeFileSync(path.join(outDir,f), out.html);
  }
  const hits = n.shell + n.hub + n.ui + n.tm;
  const pct = hits + n.miss ? ((hits / (hits + n.miss)) * 100).toFixed(1) : '0.0';
  const wrote = files.length - OWNED.size;
  const owners = `${OWNED.size - (HOME_OWNED ? 1 : 0)} left to gen-hubs` + (HOME_OWNED ? ', 1 to gen-proto-home' : '');
  console.log(`[${loc}] ${wrote} pages → astro/public/${loc}/ · ${onShell} on the shell, ${wrote - onShell} not · ${owners}`);
  console.log(`      ${pct}% translated — shell:${n.shell} hub:${n.hub} ui:${n.ui} tm:${n.tm} · miss(→en):${n.miss}`);
}
