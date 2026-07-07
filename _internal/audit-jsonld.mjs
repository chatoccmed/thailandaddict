// JSON-LD audit — extracts every <script type="application/ld+json"> from the built site,
// JSON.parses it, and validates required/recommended fields per Google's structured-data rules
// for each @type (Article/BreadcrumbList/FAQPage/Restaurant/Hotel/Review/ItemList/WebSite/...).
// Content pages render to ~/ta-build-temp/dist (run build-test.sh first); hub pages live in
// astro/public. Scans both (TH + /en). Reports errors grouped by type+rule with sample files.
//
// Usage:  node _internal/audit-jsonld.mjs            (scan everything)
//         node _internal/audit-jsonld.mjs --sample   (scan ~120 representative pages, fast)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(os.homedir(), 'ta-build-temp', 'dist');     // rendered article/review/roundup pages
const PUB = path.join(ROOT, 'astro', 'public');                    // pre-generated hub pages
const SAMPLE = process.argv.includes('--sample');
const SITE = 'https://thailandaddict.com';

const isAbs = (u) => typeof u === 'string' && /^https?:\/\//.test(u);
const isBadStr = (u) => typeof u === 'string' && /\b(undefined|null|NaN)\b/.test(u);
const urlOf = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? (v.url || v['@id']) : undefined);
const nonEmpty = (s) => typeof s === 'string' ? s.trim().length > 0 : (s != null && s !== '');
const arr = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);

// ---- collect target HTML files ----
function listHtml(dir, recurseEn) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f.endsWith('.html')) out.push(p);
    else if (recurseEn && f === 'en' && fs.statSync(p).isDirectory())
      for (const g of fs.readdirSync(p)) if (g.endsWith('.html')) out.push(path.join(p, g));
  }
  return out;
}
let files = [];
if (SAMPLE) {
  // one representative of every page kind
  const pick = [
    // article types (food / attraction / itinerary / prep / guide / where-to-stay / comparison)
    'chiang-mai-street-food.html', 'wat-arun.html', 'bangkok-3-days.html', 'thailand-visa-guide.html',
    'where-to-stay-bangkok.html', 'where-to-stay-phang-nga.html', 'where-to-stay-phrae.html',
    'phuket-vs-krabi.html', 'getting-around-thailand.html',
    // review + roundup
    'top10-hotels-bangkok.html', 'top10-hotels-chiang-mai.html',
  ].map((f) => path.join(DIST, f)).filter(fs.existsSync);
  const reviews = listHtml(DIST).filter((p) => /\/(the-|hotel-|resort-)/.test(p)).slice(0, 3);
  const hubs = ['index.html', 'country-thailand.html', 'city-bangkok.html', 'city-phang-nga.html',
    'region-north.html', 'tourist-cities.html', 'plan-your-trip.html', 'search.html']
    .map((f) => path.join(PUB, f)).filter(fs.existsSync);
  files = [...pick, ...reviews, ...hubs, ...hubs.map((p) => p.replace(PUB, path.join(PUB, 'en'))).filter(fs.existsSync)];
} else {
  files = [...listHtml(DIST, true), ...listHtml(PUB, true)];
}

// ---- per-type validators. push(rule, severity) on failure ----
const RX = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
const groups = new Map();   // key "TYPE :: rule [sev]" -> { sev, count, samples:Set }
function flag(type, rule, sev, file) {
  const key = `${type} :: ${rule}`;
  let g = groups.get(key);
  if (!g) groups.set(key, (g = { sev, count: 0, samples: new Set() }));
  g.count++;
  if (g.samples.size < 4) g.samples.add(path.basename(file));
}

function checkUrlField(node, field, type, file, { abs = true } = {}) {
  if (!(field in node)) return;
  const v = node[field];
  const u = urlOf(v);
  if (u == null || u === '') { flag(type, `${field}: empty`, 'ERROR', file); return; }
  if (isBadStr(u)) { flag(type, `${field}: contains undefined/null`, 'ERROR', file); return; }
  if (abs && !isAbs(u)) flag(type, `${field}: not absolute (${u.slice(0, 40)})`, 'ERROR', file);
}

function validateNode(node, file) {
  if (!node || typeof node !== 'object') return;
  const types = arr(node['@type']);
  for (const T of types) {
    switch (T) {
      case 'Article': case 'BlogPosting': case 'NewsArticle': {
        if (!nonEmpty(node.headline)) flag(T, 'missing headline', 'ERROR', file);
        const a = node.author; if (!a || !nonEmpty(a.name)) flag(T, 'missing author.name', 'ERROR', file);
        const pub = node.publisher;
        if (!pub || !nonEmpty(pub.name)) flag(T, 'missing publisher.name', 'ERROR', file);
        else if (!pub.logo || !urlOf(pub.logo)) flag(T, 'missing publisher.logo (recommended)', 'WARN', file);
        if (!node.image || !urlOf(node.image)) flag(T, 'missing image (recommended)', 'WARN', file);
        else checkUrlField(node, 'image', T, file);
        if (!nonEmpty(node.datePublished)) flag(T, 'missing datePublished (recommended)', 'WARN', file);
        if (!nonEmpty(node.dateModified)) flag(T, 'missing dateModified (recommended)', 'WARN', file);
        break;
      }
      case 'BreadcrumbList': {
        const items = arr(node.itemListElement);
        if (!items.length) { flag(T, 'empty itemListElement', 'ERROR', file); break; }
        const last = items.length - 1;
        items.forEach((li, i) => {
          if (typeof li.position !== 'number') flag(T, 'ListItem missing numeric position', 'ERROR', file);
          if (!nonEmpty(li.name)) flag(T, 'ListItem missing name', 'ERROR', file);
          const it = urlOf(li.item);
          if (it == null) { if (i !== last) flag(T, 'ListItem missing item (non-last)', 'ERROR', file); }
          else if (isBadStr(it)) flag(T, 'item contains undefined/null', 'ERROR', file);
          else if (!isAbs(it)) flag(T, 'item not absolute URL', 'ERROR', file);
        });
        break;
      }
      case 'FAQPage': {
        const qs = arr(node.mainEntity);
        if (!qs.length) { flag(T, 'empty mainEntity', 'ERROR', file); break; }
        qs.forEach((q) => {
          if (!nonEmpty(q.name)) flag(T, 'Question missing name', 'ERROR', file);
          const ans = q.acceptedAnswer;
          if (!ans || !nonEmpty(ans.text)) flag(T, 'acceptedAnswer.text empty', 'ERROR', file);
        });
        break;
      }
      case 'ItemList': {
        const items = arr(node.itemListElement);
        if (!items.length) { flag(T, 'empty itemListElement', 'ERROR', file); break; }
        const pos = [];
        items.forEach((li) => {
          if (typeof li.position !== 'number') flag(T, 'ListItem missing numeric position', 'ERROR', file);
          else pos.push(li.position);
        });
        if (new Set(pos).size !== pos.length) flag(T, 'duplicate positions', 'ERROR', file);
        break;
      }
      case 'Restaurant': case 'Hotel': case 'LodgingBusiness': case 'LocalBusiness': case 'TouristAttraction': {
        if (!nonEmpty(node.name)) flag(T, 'missing name', 'ERROR', file);
        if (node.image != null) checkUrlField(node, 'image', T, file);
        const ar = node.aggregateRating;
        if (ar) {
          if (!nonEmpty(ar.ratingValue) || isBadStr(String(ar.ratingValue)))
            flag(T, 'aggregateRating missing/invalid ratingValue', 'ERROR', file);
          const cnt = ar.ratingCount ?? ar.reviewCount;
          if (cnt == null || !nonEmpty(String(cnt)) || isBadStr(String(cnt)) || Number(cnt) <= 0)
            flag(T, 'aggregateRating missing ratingCount/reviewCount', 'ERROR', file);
        }
        break;
      }
      case 'Review': {
        if (!node.itemReviewed) flag(T, 'missing itemReviewed', 'ERROR', file);
        const rr = node.reviewRating;
        if (!rr || !nonEmpty(rr.ratingValue)) flag(T, 'missing reviewRating.ratingValue', 'ERROR', file);
        const a = node.author; if (!a || !nonEmpty(a.name)) flag(T, 'missing author.name', 'ERROR', file);
        break;
      }
      case 'WebSite': {
        if (!nonEmpty(node.name)) flag(T, 'missing name', 'ERROR', file);
        checkUrlField(node, 'url', T, file);
        break;
      }
      case 'WebPage': { checkUrlField(node, 'url', T, file); break; }
    }
  }
  // recurse into nested item nodes (e.g. ItemList → ListItem.item → Restaurant)
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (k === 'item' && v && typeof v === 'object') validateNode(v, file);
    if (Array.isArray(v)) v.forEach((x) => (x && typeof x === 'object' ? validateNode(x, file) : 0));
  }
}

// ---- scan ----
let scanned = 0, blocks = 0, parseErrors = 0;
for (const file of files) {
  let html; try { html = fs.readFileSync(file, 'utf8'); } catch { continue; }
  scanned++;
  let m;
  RX.lastIndex = 0;
  while ((m = RX.exec(html))) {
    blocks++;
    let json;
    try { json = JSON.parse(m[1]); }
    catch (e) { parseErrors++; flag('(parse)', `JSON.parse failed: ${String(e.message).slice(0, 50)}`, 'ERROR', file); continue; }
    const nodes = json['@graph'] ? arr(json['@graph']) : arr(json);
    nodes.forEach((n) => validateNode(n, file));
  }
}

// ---- report ----
const rows = [...groups.entries()].sort((a, b) => (a[1].sev === b[1].sev ? b[1].count - a[1].count : a[1].sev < b[1].sev ? -1 : 1));
const errs = rows.filter((r) => r[1].sev === 'ERROR');
const warns = rows.filter((r) => r[1].sev === 'WARN');
console.log(`\nJSON-LD AUDIT ${SAMPLE ? '(sample)' : '(full)'} — scanned ${scanned} files, ${blocks} ld+json blocks, ${parseErrors} parse errors\n`);
const dump = (label, list) => {
  console.log(`=== ${label} (${list.length} rule-groups) ===`);
  if (!list.length) console.log('  (none)');
  for (const [key, g] of list) console.log(`  [${g.count}] ${key}\n        e.g. ${[...g.samples].join(', ')}`);
  console.log('');
};
dump('ERRORS', errs);
dump('WARNINGS (recommended fields)', warns);
const totalErr = errs.reduce((s, [, g]) => s + g.count, 0);
console.log(`SUMMARY: ${totalErr} error instances across ${errs.length} rule-groups; ${warns.reduce((s, [, g]) => s + g.count, 0)} warning instances.`);
process.exit(errs.length ? 1 : 0);
