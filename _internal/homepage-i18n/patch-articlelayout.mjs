// One-off: convert the ArticleLayout language switcher from text pills to the
// circular flag-bar (same as the homepage). Flag data-URIs go into the scoped
// <style> → Astro bundles them into the shared /_astro CSS (downloaded once
// across all article pages, not per page). Idempotent-ish: asserts each anchor.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LAYOUT = path.join(ROOT, 'astro', 'src', 'layouts', 'ArticleLayout.astro');
const flagRules = fs.readFileSync(path.join(ROOT, 'astro', 'src', '_flag-rules.tmp.css'), 'utf8').trim();

let s = fs.readFileSync(LAYOUT, 'utf8');
const must = (cond, msg) => { if (!cond) { console.error('FAIL:', msg); process.exit(1); } };

// 1) add native-name label map right after the LOCLBL line
const loclblLine = "const LOCLBL: Record<string, string> = { th: 'ไทย', en: 'EN', zh: '中文', ru: 'Рус', ko: '한국', ja: '日本', hi: 'हिं', he: 'עב', ar: 'ع' };";
must(s.includes(loclblLine), 'LOCLBL line not found');
const langname = "const LANGNAME: Record<string, string> = { th: 'ไทย', en: 'English', zh: '中文', ru: 'Русский', ko: '한국어', ja: '日本語', hi: 'हिन्दी', he: 'עברית', ar: 'العربية' };";
if (!s.includes('LANGNAME')) s = s.replace(loclblLine, loclblLine + '\n' + langname);

// 2) swap the switcher markup: <span class="lang">…</span> -> flag-bar
const oldMarkup = `    <span class="lang">{LOCS.map((l) => <a href={locHref(l)} class={l === lang ? 'on' : ''}>{LOCLBL[l] || l.toUpperCase()}</a>)}</span>`;
must(s.includes(oldMarkup), 'switcher markup not found');
const newMarkup = `    <div class="flagbar" role="navigation" aria-label="Language">{LOCS.map((l) => <a href={locHref(l)} class={l === lang ? 'on' : ''} title={LANGNAME[l] || l} aria-label={LANGNAME[l] || l}><span class={\`flg flg-\${l}\`}></span></a>)}</div>`;
s = s.replace(oldMarkup, newMarkup);

// 3) swap the .lang CSS rule -> .flagbar + flag data-URI rules + RTL mirror
const oldCss = ".lang{font-family:'Outfit';font-size:11.5px;font-weight:700;background:var(--soft);border-radius:14px;display:inline-flex;flex-wrap:wrap;gap:1px;padding:2px;max-width:230px}";
must(s.includes(oldCss), '.lang CSS rule not found');
const newCss = `/* language flag-bar (circular SVG flags; active enlarged) — shows only the locales this page exists in */
.flagbar{display:inline-flex;align-items:center;flex-wrap:wrap;gap:3px;background:var(--soft);border:1px solid var(--bdr);border-radius:30px;padding:4px 6px;max-width:272px}
.flagbar a{display:block;width:24px;height:24px;border-radius:50%;overflow:hidden;opacity:.7;transition:transform .16s,opacity .16s;flex:0 0 auto;box-shadow:0 0 0 1px rgba(0,0,0,.06)}
.flagbar a:hover{opacity:1;transform:scale(1.12)}
.flagbar a.on{opacity:1;transform:scale(1.2);box-shadow:0 0 0 2px #fff,0 3px 9px rgba(15,40,70,.22);position:relative;z-index:1}
.flg{width:100%;height:100%;background-size:cover;background-position:center;display:block}
${flagRules}
@media(max-width:600px){.flagbar{max-width:134px;gap:2px}.flagbar a{width:22px;height:22px}}
html[dir="rtl"] .flagbar{flex-direction:row-reverse}`;
s = s.replace(oldCss, newCss);

fs.writeFileSync(LAYOUT, s);
console.log('patched ArticleLayout.astro (flag-bar switcher).');
