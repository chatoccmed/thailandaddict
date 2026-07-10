// Nationwide hotel-roundup coverage & revenue audit.
// Counts everything from disk (stateless, re-runnable): maps all roundups to their province/destination,
// classifies by segment type, cross-refs review inventory + link integrity + surfacing, and computes
// the gap vs a tiered build-matrix (adapted from .claude/skills/tourlogy-city-roundup-checklist).
// Usage: node _internal/audit-roundup-coverage.mjs [--json <outfile>]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const RDIR = path.join(ROOT, 'astro/src/content/roundups');
const REVDIR = path.join(ROOT, 'astro/src/content/reviews');
const ADIR = path.join(ROOT, 'astro/src/content/articles');
const HOODDATA = path.join(ROOT, '_internal/neighborhood-data');

const DESTINATIONS = ['koh-phangan','hat-yai','samui','pai','pattaya','huahin','khao-yai','koh-chang','koh-lipe','koh-kood','koh-mak','koh-larn'];
// City tiers (adapted): S = top revenue destinations; A = rest of the curated tourism set; B = ≥12 reviews; C = rest.
const TIER_S = ['bangkok','phuket','chiang-mai','pattaya','samui','krabi','huahin'];
const TOPDEST = ['bangkok','chiang-mai','phuket','krabi','chiang-rai','chonburi','surat-thani','prachuap-khiri-khan','kanchanaburi','ayutthaya','rayong','trat','phang-nga','nan','mae-hong-son','sukhothai','nakhon-ratchasima','phetchabun'];
const TOURISM = [...new Set([...TOPDEST, ...DESTINATIONS])];

// ---- load city list from disk (89 = 77 provinces + 12 destinations) ----
const cityFiles = fs.readdirSync(PUB).filter(f => /^city-[a-z-]+\.html$/.test(f)).map(f => f.slice(5, -5));
const provinces = cityFiles.filter(c => !DESTINATIONS.includes(c));
const allCities = [...provinces, ...DESTINATIONS];

// ---- districts ----
const districts = fs.readdirSync(HOODDATA).filter(f => f.endsWith('.json')).map(f => { const [city, hood] = f.slice(0, -5).split('__'); return { city, hood }; });

// ---- reviews: per-cluster inventory ----
const reviewFiles = fs.readdirSync(REVDIR).filter(f => f.endsWith('.json'));
const reviewSet = new Set(reviewFiles.map(f => f.slice(0, -5)));
const revByCluster = {};
const parentRefs = {}; // roundup html slug -> count of reviews whose parentHref points to it
for (const f of reviewFiles) {
  let o; try { o = JSON.parse(fs.readFileSync(path.join(REVDIR, f), 'utf8')); } catch { continue; }
  const c = o.cluster || '?';
  (revByCluster[c] ||= []).push(f.slice(0, -5));
  const p = String(o.parentHref || '').replace(/\.html$/, '');
  if (p) parentRefs[p] = (parentRefs[p] || 0) + 1;
}

// ---- surfacing: links from static hub pages (TH) + articles ----
const hubLinkCount = {}; // roundup slug -> # hub pages linking it
for (const f of fs.readdirSync(PUB).filter(f => f.endsWith('.html'))) {
  const txt = fs.readFileSync(path.join(PUB, f), 'utf8');
  for (const m of txt.matchAll(/href="(top[0-9]+-[a-z0-9-]+)(?:\.html)?"/g)) {
    hubLinkCount[m[1]] = (hubLinkCount[m[1]] || 0) + 1;
  }
}
const artLinkCount = {};
for (const f of fs.readdirSync(ADIR).filter(f => f.endsWith('.json'))) {
  const txt = fs.readFileSync(path.join(ADIR, f), 'utf8');
  // match hrefs with or without .html (clean-URL convention) inside JSON string values
  for (const m of txt.matchAll(/(top[0-9]+-[a-z0-9-]+)(?:\.html)?["\\/#?]/g)) {
    artLinkCount[m[1]] = (artLinkCount[m[1]] || 0) + 1;
  }
}

// ---- roundups: map to city, classify, check integrity ----
const SEG_RULES = [
  ['budget', /budget|hostel/], ['luxury', /luxury|5-?star/], ['couples', /love|couple|honeymoon/],
  ['family', /family|kids/], ['boutique', /boutique|design/], ['nature', /nature|view|mountain/],
  ['apartment', /apartment|serviced|long-stay/], ['beach', /beach|beachfront|seafront/],
  ['landmark', /hospital|airport|station|university|impact|bitec|near-/],
];
const bkkHoods = new Set(districts.filter(d => d.city === 'bangkok').map(d => d.hood));
const roundups = [];
for (const f of fs.readdirSync(RDIR).filter(f => f.endsWith('.json'))) {
  const slug = f.slice(0, -5);
  let o; try { o = JSON.parse(fs.readFileSync(path.join(RDIR, f), 'utf8')); } catch { roundups.push({ slug, city: '?', parseError: true }); continue; }
  // map to city: prefer the LONGEST city slug appearing as a hyphen-delimited token run.
  // ALIASES: shorthand slugs used in some roundup names → canonical city.
  const ALIAS = { 'korat': 'nakhon-ratchasima', 'prachuap': 'prachuap-khiri-khan', 'koh-samet': 'rayong' };
  let city = null;
  const cands = allCities.filter(c => slug === `top10-hotels-${c}` || slug.includes(`-${c}-`) || slug.endsWith(`-${c}`) || slug.includes(`-${c}.`) || slug.startsWith(`top10-${c}-`) || slug.startsWith(`top5-${c}-`) || slug.startsWith(`top8-${c}-`) || slug.startsWith(`top9-${c}-`) || slug.startsWith(`top7-${c}-`) || slug.startsWith(`top6-${c}-`));
  if (cands.length) city = cands.sort((a, b) => b.length - a.length)[0];
  if (!city) for (const [al, canon] of Object.entries(ALIAS)) if (slug.includes(al)) { city = canon; break; }
  // bangkok district?
  let district = null;
  const mBkk = slug.match(/-([a-z0-9-]+)-bangkok$/);
  if (mBkk) { const h = [...bkkHoods].find(h => mBkk[1].endsWith(h)); if (h) { district = h; city = 'bangkok'; } }
  const isAnchor = /^top10-hotels-[a-z-]+$/.test(slug) && allCities.includes(slug.replace('top10-hotels-', ''));
  const segs = SEG_RULES.filter(([, re]) => re.test(slug)).map(([k]) => k);
  if (!segs.length && !isAnchor) segs.push('area'); // named-area/other roundup (e.g. jomtien, nimman, chiang-khan, city-center)
  const entries = Array.isArray(o.entries) ? o.entries : [];
  const withReview = entries.filter(e => e.reviewUrl && reviewSet.has(String(e.reviewUrl).replace(/\.html$/, ''))).length;
  const withBooking = entries.filter(e => e.agodaUrl || e.bookingUrl || e.tripUrl).length;
  roundups.push({
    slug, city: city || '?', district, isAnchor, segs,
    entries: entries.length, withReview, withBooking,
    hubLinks: hubLinkCount[slug] || 0, artLinks: artLinkCount[slug] || 0, parentRefs: parentRefs[slug] || 0,
  });
}

// ---- per-city rollup + tier + gap ----
function tierOf(city) {
  if (TIER_S.includes(city)) return 'S';
  if (TOURISM.includes(city)) return 'A';
  if ((revByCluster[city] || []).length >= 12) return 'B';
  return 'C';
}
// build-matrix targets per tier (adapted for the Thai market):
// S: anchor + budget + luxury + ≥2 area/beach + 1 audience (couples|family) → ≥6 distinct
// A: anchor + budget + 1 more (luxury|area|audience) → ≥3
// B: anchor + budget → ≥2 · C: anchor → ≥1
const matrix = {};
for (const c of allCities) matrix[c] = { tier: tierOf(c), reviews: (revByCluster[c] || []).length, anchor: 0, budget: 0, luxury: 0, beachArea: 0, audience: 0, other: 0, total: 0, roundups: [] };
for (const r of roundups) {
  if (!matrix[r.city]) continue;
  const m = matrix[r.city];
  m.total++; m.roundups.push(r.slug);
  if (r.isAnchor) m.anchor++;
  else if (r.segs.includes('budget')) m.budget++;
  else if (r.segs.includes('luxury')) m.luxury++;
  else if (r.segs.includes('beach') || r.segs.includes('area')) m.beachArea++;
  else if (r.segs.includes('couples') || r.segs.includes('family')) m.audience++;
  else m.other++;
}
function gapOf(c) {
  const m = matrix[c], t = m.tier, need = [];
  if (!m.anchor) need.push('anchor');
  if (t === 'S') { if (!m.budget) need.push('budget'); if (!m.luxury) need.push('luxury'); if (m.beachArea < 2) need.push(`beach/area×${2 - m.beachArea}`); if (!m.audience) need.push('audience'); }
  else if (t === 'A') { if (!m.budget) need.push('budget'); if (m.total < 3) need.push('+1 segment'); }
  else if (t === 'B') { if (!m.budget) need.push('budget'); }
  return need;
}

// ---- output ----
const unmapped = roundups.filter(r => r.city === '?');
const orphans = roundups.filter(r => r.hubLinks === 0 && r.artLinks === 0);
const weakReview = roundups.filter(r => r.entries > 0 && r.withReview / r.entries < 0.5);
const noBooking = roundups.filter(r => r.entries > 0 && r.withBooking < r.entries);

console.log(`\n══════ NATIONWIDE ROUNDUP AUDIT ══════`);
console.log(`cities: ${allCities.length} (${provinces.length} provinces + ${DESTINATIONS.length} destinations) · districts: ${districts.length} · roundups: ${roundups.length} · reviews: ${reviewFiles.length}`);
console.log(`\n── integrity ──`);
console.log(`unmapped roundups (couldn't assign a city): ${unmapped.length}${unmapped.length ? '\n  ' + unmapped.map(r => r.slug).join('\n  ') : ''}`);
console.log(`orphan roundups (0 links from any hub page or article): ${orphans.length}${orphans.length ? '\n  ' + orphans.map(r => `${r.slug} (parentRefs=${r.parentRefs})`).join('\n  ') : ''}`);
console.log(`roundups where <50% of entries link a real review page: ${weakReview.length}`);
console.log(`roundups with entries missing ALL booking URLs: ${noBooking.filter(r=>r.withBooking===0).length} · partial-missing: ${noBooking.filter(r=>r.withBooking>0).length}`);

console.log(`\n── tier S/A coverage (the revenue core) ──`);
console.log('city'.padEnd(22) + 'tier rev anchor budget luxury beach/area audience other total  GAP');
for (const c of allCities.filter(c => ['S', 'A'].includes(matrix[c].tier)).sort((a, b) => matrix[a].tier.localeCompare(matrix[b].tier) || matrix[b].reviews - matrix[a].reviews)) {
  const m = matrix[c];
  console.log(c.padEnd(22) + `${m.tier}    ${String(m.reviews).padEnd(4)}${String(m.anchor).padEnd(7)}${String(m.budget).padEnd(7)}${String(m.luxury).padEnd(7)}${String(m.beachArea).padEnd(11)}${String(m.audience).padEnd(9)}${String(m.other).padEnd(6)}${String(m.total).padEnd(6)} ${gapOf(c).join(', ') || '—'}`);
}
console.log(`\n── tier B/C summary ──`);
const bGap = allCities.filter(c => matrix[c].tier === 'B' && gapOf(c).length);
const cGap = allCities.filter(c => matrix[c].tier === 'C' && gapOf(c).length);
console.log(`B cities: ${allCities.filter(c => matrix[c].tier === 'B').length} · with gaps: ${bGap.length}${bGap.length ? ' → ' + bGap.map(c => `${c}(${gapOf(c).join('+')})`).join(' · ') : ''}`);
console.log(`C cities: ${allCities.filter(c => matrix[c].tier === 'C').length} · missing anchor: ${cGap.length}${cGap.length ? ' → ' + cGap.join(', ') : ''}`);

console.log(`\n── district coverage (ย่าน) ──`);
const distByCity = {};
for (const d of districts) (distByCity[d.city] ||= []).push(d.hood);
for (const [city, hoods] of Object.entries(distByCity)) {
  const withRoundup = hoods.filter(h => roundups.some(r => r.city === city && (r.district === h || r.slug.includes(`-${h}-`) || r.slug.includes(`${h}-hotels`) || r.slug.includes(`hotels-${h}`))));
  console.log(`${city.padEnd(14)} ${hoods.length} districts · with own hotel roundup: ${withRoundup.length} · missing: ${hoods.filter(h => !withRoundup.includes(h)).join(', ') || '—'}`);
}

// untapped: cities whose review count could power segments not yet built
console.log(`\n── untapped review inventory (reviews sitting unused by any segment) ──`);
for (const c of allCities.filter(c => ['S', 'A'].includes(matrix[c].tier))) {
  const m = matrix[c];
  const used = new Set();
  for (const r of roundups.filter(r => r.city === c)) {
    let o; try { o = JSON.parse(fs.readFileSync(path.join(RDIR, r.slug + '.json'), 'utf8')); } catch { continue; }
    for (const e of (o.entries || [])) if (e.reviewUrl) used.add(String(e.reviewUrl).replace(/\.html$/, ''));
  }
  const unused = (revByCluster[c] || []).filter(s => !used.has(s));
  if (unused.length) console.log(`${c.padEnd(22)} ${m.reviews} reviews · ${unused.length} NOT in any roundup`);
}

const jsonIdx = process.argv.indexOf('--json');
if (jsonIdx > -1 && process.argv[jsonIdx + 1]) {
  fs.writeFileSync(process.argv[jsonIdx + 1], JSON.stringify({ matrix, roundups, unmapped: unmapped.map(r => r.slug), orphans: orphans.map(r => r.slug), districts: distByCity, gaps: Object.fromEntries(allCities.map(c => [c, gapOf(c)])) }, null, 1));
  console.log(`\nJSON written → ${process.argv[jsonIdx + 1]}`);
}
