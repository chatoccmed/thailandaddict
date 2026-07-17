// One-off: give the generated hub pages (gen-hubs.mjs) the circular flag-bar.
// Hubs exist in th + en only, so the bar shows exactly 2 flags (no 404 links).
// Flag CSS is inline per hub page, so include ONLY th+en data-URIs (not all 9).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const GEN = path.join(ROOT, '_internal', 'gen-hubs.mjs');
const flagDir = path.join(ROOT, 'astro', 'public', 'images', 'flags');
const b64 = (l) => fs.readFileSync(path.join(flagDir, `${l}.svg`)).toString('base64');

let s = fs.readFileSync(GEN, 'utf8');
const must = (c, m) => { if (!c) { console.error('FAIL:', m); process.exit(1); } };

// 1) swap the .lang-wrap/.lb CSS for the flag-bar CSS (+ th/en data-URIs)
const oldCss = ".lang-wrap{display:flex;gap:1px}.lb{background:transparent;border:none;font-family:'Outfit',sans-serif;font-size:11px;font-weight:600;color:var(--mut);padding:5px 8px;border-radius:6px}.lb.active{color:var(--bl);background:var(--bl-lt)}";
must(s.includes(oldCss), '.lang-wrap CSS not found');
const newCss = `.flagbar{display:inline-flex;align-items:center;gap:3px;background:var(--bl-lt);border:1px solid var(--bdr);border-radius:30px;padding:4px 6px}
.flagbar a{display:block;width:24px;height:24px;border-radius:50%;overflow:hidden;opacity:.72;transition:transform .16s,opacity .16s;flex:0 0 auto;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
.flagbar a:hover{opacity:1;transform:scale(1.12)}
.flagbar a.on{opacity:1;transform:scale(1.2);box-shadow:0 0 0 2px #fff,0 3px 9px rgba(15,40,70,.22);position:relative;z-index:1}
.flg{width:100%;height:100%;background-size:cover;background-position:center;display:block}
.flg-th{background-image:url("data:image/svg+xml;base64,${b64('th')}")}.flg-en{background-image:url("data:image/svg+xml;base64,${b64('en')}")}`;
s = s.replace(oldCss, newCss);

// 2) swap the switcher markup: 2-button TH/EN -> 2-flag bar
const oldMarkup = '<div class="lang-wrap">${lbTH}${lbEN}</div>';
must(s.includes(oldMarkup), 'lang-wrap markup not found');
const newMarkup = '<div class="flagbar" role="navigation" aria-label="Language"><a href="/${slug}.html"${LOC===\'th\'?\' class="on"\':\'\'} title="ไทย" aria-label="ไทย"><span class="flg flg-th"></span></a><a href="/en/${slug}.html"${LOC===\'en\'?\' class="on"\':\'\'} title="English" aria-label="English"><span class="flg flg-en"></span></a></div>';
s = s.replace(oldMarkup, newMarkup);

fs.writeFileSync(GEN, s);
console.log('patched gen-hubs.mjs (flag-bar switcher, th/en).');
