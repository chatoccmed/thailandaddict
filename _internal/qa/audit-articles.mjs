#!/usr/bin/env node
// Article integrity audit (script, no web) across all articles.
// Checks: valid JSON · no ban-words · heroImg present · EN twin (exists, zero raw-Thai, block-count parity)
//         · related[] href resolves (article/roundup/review/public hub) · crumbCityHref resolves.
// Usage: node _internal/qa/audit-articles.mjs
import fs from 'node:fs';
const ROOT = 'astro/src/content', PUB = 'astro/public';
const artDir = `${ROOT}/articles`, artEnDir = `${ROOT}/articles-en`;
const BAN = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'สุดยอด', 'อันซีน'];
const RAWTHAI = /[ก-ฺเ-๛]/;
const hasRawThai = o => { let n = 0; (function s(x){ if (typeof x === 'string') { if (RAWTHAI.test(x.replace(/฿/g, '')) && !/%[0-9A-F]{2}/i.test(x)) n++; } else if (Array.isArray(x)) x.forEach(s); else if (x && typeof x === 'object') Object.values(x).forEach(s); })(o); return n; };
// build resolvable-slug sets
const artSlugs = new Set(fs.readdirSync(artDir).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')));
const rdSlugs = new Set(fs.existsSync(`${ROOT}/roundups`) ? fs.readdirSync(`${ROOT}/roundups`).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')) : []);
const revSlugs = new Set(fs.existsSync(`${ROOT}/reviews`) ? fs.readdirSync(`${ROOT}/reviews`).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')) : []);
const pubHtml = new Set(fs.readdirSync(PUB).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, '')));
const slugOf = h => String(h || '').replace(/^.*\//, '').replace(/\.html.*$/, '').replace(/[?#].*$/, '').replace(/^\//, '');
const resolves = href => { const s = slugOf(href); if (!s) return true; if (/^https?:/.test(href) && !/thailandaddict/.test(href)) return true; return artSlugs.has(s) || rdSlugs.has(s) || revSlugs.has(s) || pubHtml.has(s); };

let n = 0; const issues = [];
for (const f of fs.readdirSync(artDir)) {
  if (!f.endsWith('.json')) continue;
  n++;
  let a; try { a = JSON.parse(fs.readFileSync(`${artDir}/${f}`, 'utf8')); } catch { issues.push(`${f} :: BROKEN JSON`); continue; }
  const txt = JSON.stringify(a);
  for (const w of BAN) if (txt.includes(w)) issues.push(`${f} :: BAN:${w}`);
  if (!a.heroImg && !a.image) issues.push(`${f} :: no hero`);
  for (const r of (a.related || [])) { const h = r.href || r.url || r; if (!resolves(h)) issues.push(`${f} :: related BROKEN → ${slugOf(h)}`); }
  if (a.crumbCityHref && !resolves(a.crumbCityHref)) issues.push(`${f} :: crumbCityHref BROKEN → ${slugOf(a.crumbCityHref)}`);
  // EN twin
  const ep = `${artEnDir}/${f}`;
  if (!fs.existsSync(ep)) issues.push(`${f} :: EN twin MISSING`);
  else { try { const en = JSON.parse(fs.readFileSync(ep, 'utf8')); const t = hasRawThai(en); if (t > 0) issues.push(`${f} :: EN raw-Thai leaks: ${t}`); if ((en.blocks || []).length !== (a.blocks || []).length) issues.push(`${f} :: EN blocks(${(en.blocks||[]).length})!=TH(${(a.blocks||[]).length})`); } catch { issues.push(`${f} :: EN BROKEN JSON`); } }
}
const groups = {};
for (const i of issues) { const k = i.split('::')[1].trim().split(/[ :]/)[0]; groups[k] = (groups[k] || 0) + 1; }
console.log(`articles: ${n} · issues: ${issues.length}`);
console.log('by type:', JSON.stringify(groups));
fs.writeFileSync('_internal/qa/ARTICLE-AUDIT.txt', issues.join('\n') + '\n');
if (issues.length) { console.log('\nfirst 40:'); issues.slice(0, 40).forEach(i => console.log('  ' + i)); }
console.log('\nwrote _internal/qa/ARTICLE-AUDIT.txt');
