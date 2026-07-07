// Assemble a top10-activities-<cluster>.json A1 article from scratchpad cards + a wrapper config.
// Usage: node _internal/wf/assemble-a1.mjs <wrapper.json>
// The A1 workflow agents write ONE restaurant-block card each to scratchpad/<prefix>-NN.json.
// This script: collects them, un-escapes HTML entities, strips invalid ratings, sorts by rank,
// derives the hero image from card #1, and wraps everything with the authored wrapper blocks.
import fs from 'fs';

const SP = 'C:\\Users\\Imac\\AppData\\Local\\Temp\\claude\\C--Users-Imac-Thailandaddict\\1bb3cb4f-ad84-442c-9763-4b413b84d50b\\scratchpad\\';
const ART = 'C:\\Users\\Imac\\Thailandaddict\\astro\\src\\content\\articles\\';

const wpath = process.argv[2];
if (!wpath) { console.error('need wrapper config path'); process.exit(1); }
const W = JSON.parse(fs.readFileSync(wpath, 'utf8'));

const unesc = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'")
  .replace(/&amp;/g, '&');
function walk(o) {
  if (typeof o === 'string') return unesc(o);
  if (Array.isArray(o)) return o.map(walk);
  if (o && typeof o === 'object') { const r = {}; for (const k in o) r[k] = walk(o[k]); return r; }
  return o;
}

const rx = new RegExp('^' + W.prefix + '-\\d+\\.json$');
const files = fs.readdirSync(SP).filter(f => rx.test(f)).sort();
let cards = [];
for (const f of files) {
  let raw = fs.readFileSync(SP + f, 'utf8').trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  let obj;
  try { obj = JSON.parse(raw); } catch (e) { console.error('PARSE FAIL', f, e.message); continue; }
  let card = obj;
  if (card && card.blocks) card = card.blocks.find(b => b.kind === 'restaurant') || card;
  if (Array.isArray(card)) card = card.find(b => b && b.kind === 'restaurant') || card[0];
  if (card && card.card) card = card.card;
  if (!card || card.kind !== 'restaurant') { console.error('NOT A CARD', f, 'kind=', card && card.kind); continue; }
  card = walk(card);
  const r = card.rating;
  const ok = (typeof r === 'number' && r > 0 && r <= 5 && card.ratingSrc && String(card.ratingSrc).trim());
  if (!ok) { delete card.rating; delete card.ratingSrc; }
  card.stayHref = card.stayHref || W.stayHref;
  card.stayLabel = card.stayLabel || W.stayLabel;
  card.bookProvider = card.bookProvider || 'Klook';
  cards.push({ f, card });
}
cards.sort((a, b) => parseInt(a.card.rank || '99') - parseInt(b.card.rank || '99'));
cards.forEach((c, i) => c.card.rank = String(i + 1));
const N = cards.length;
if (!N) { console.error('NO CARDS for prefix', W.prefix); process.exit(1); }
console.log('cards:', N);
cards.forEach(c => console.log('  ', c.card.rank, (c.card.name || '').slice(0, 40), c.card.rating ? ('★' + c.card.rating) : '(no rating)'));

const first = cards[0].card;
const heroImg = W.heroImg || first.img;
const heroCredit = W.heroCredit || first.credit;
const heroCreditHref = W.heroCreditHref || first.creditHref;

const blocks = [
  { kind: 'p', html: W.introHtml },
  ...cards.map(c => c.card),
  W.staycta, W.experiences, W.localtips, W.tip, W.cta
].filter(Boolean);

const art = {
  slug: 'top10-activities-' + W.cluster,
  type: 'activity-ranking',
  cluster: W.cluster,
  title: W.title,
  metaDesc: W.metaDesc,
  ogTitle: W.ogTitle,
  ogDesc: W.ogDesc,
  image: heroImg, heroImg, heroCredit, heroCreditHref,
  crumbCity: W.crumbCity, crumbCityHref: W.crumbCityHref,
  regionLabel: W.regionLabel, regionHref: W.regionHref,
  eyebrow: W.eyebrow || 'คัดจากรีวิวจริง · อัปเดต 2026',
  h1: W.h1,
  heroEmoji: W.heroEmoji || '🗺️',
  intro: W.intro,          // article-level STRING (required by schema)
  chips: W.chips,
  readTime: W.readTime || '10 นาที',
  publishedDate: '2026-07-01', modifiedDate: '2026-07-02',
  blocks,
  faq: W.faq, related: W.related, rail: W.rail
};
if (!art.intro || typeof art.intro !== 'string') { console.error('!!! MISSING intro string'); process.exit(1); }
fs.writeFileSync(ART + 'top10-activities-' + W.cluster + '.json', JSON.stringify(art, null, 1));
console.log('WROTE top10-activities-' + W.cluster + '.json | blocks', blocks.length, '| intro len', art.intro.length, '| hero', heroImg.slice(0, 55));
