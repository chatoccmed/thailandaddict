// Fetch a verified Wikidata QID + Wikipedia sitelinks for each of the 77 provinces,
// to add schema.org `sameAs` entity links to the city hubs. Picks the PROVINCE entity
// (not the city) by scoring candidate descriptions. Factual lookup — never invents.
// Usage: node _internal/fetch-wikidata.mjs [slug1 slug2 ...]   (no args = all 77)
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const COORDS = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/province-coords.json'), 'utf8'));
const SRC = fs.readFileSync(path.join(ROOT, '_internal/gen-hubs.mjs'), 'utf8');
const EN_NAME = (() => { const m = SRC.match(/const EN_NAME\s*=\s*(\{[\s\S]*?\});/); return m ? eval('(' + m[1] + ')') : {}; })();
const titlecase = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const UA = 'ThailandAddict-hub-enrichment/1.0 (https://thailandaddict.com; chatmaliwan@gmail.com)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const api = async u => { const r = await fetch(u, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); };

// tourist-destination slugs (islands/cities/towns/parks) — scored as a place, not a province
const DEST = new Set(['hat-yai', 'huahin', 'khao-yai', 'koh-chang', 'koh-kood', 'koh-larn', 'koh-lipe', 'koh-mak', 'koh-phangan', 'pai', 'pattaya', 'samui']);
// disambiguating search terms for slugs whose bare name is ambiguous on Wikidata
const SEARCH_OVERRIDE = { 'khao-yai': 'Khao Yai National Park', 'pai': 'Pai District Mae Hong Son' };
async function resolve(slug) {
  const name = EN_NAME[slug] || titlecase(slug);
  const search = encodeURIComponent(SEARCH_OVERRIDE[slug] || name);
  const sj = await api(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${search}&language=en&format=json&limit=10`);
  const cands = sj.search || [];
  let best = null, bestScore = 0;
  const isDest = DEST.has(slug);
  for (const c of cands) {
    const d = (c.description || '').toLowerCase();
    let score = 0;
    if (isDest) {
      if (/thailand/.test(d)) score += 3;
      if (/\b(island|city|town|district|national park|nature reserve|protected area|wildlife sanctuary|resort|beach|municipality|tambon|subdistrict|amphoe|archipelago)\b/.test(d)) score += 3;
      if (/\b(film|movie|song|album|band|company|person|footballer|software|video game|given name|surname|genus|species)\b/.test(d)) score -= 8;
      if ((c.label || '').toLowerCase() === name.toLowerCase()) score += 1;
    } else {
      if (/^province\b/.test(d)) score += 5;          // description IS a province ("province in/of …")
      else { if (/province/.test(d)) score += 2; if (/\b(town|city|district|municipality|village|island|tambon|subdistrict|amphoe)\b/.test(d)) score -= 3; } // penalize sub-entities only when not itself a province
      if (/thailand/.test(d)) score += 2;
      if (slug === 'bangkok' && /(capital|special administrative)/.test(d)) score += 5;
      if ((c.label || '').toLowerCase() === name.toLowerCase()) score += 1;
    }
    if (score > bestScore) { bestScore = score; best = c; }
  }
  if (!best || bestScore < 6) return { slug, name, ok: false, candidates: cands.slice(0, 4).map(c => `${c.id}:${c.description || ''}`) };
  const qid = best.id;
  const ej = await api(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=sitelinks&format=json&sitefilter=enwiki|thwiki`);
  const sl = (ej.entities && ej.entities[qid] && ej.entities[qid].sitelinks) || {};
  const sameAs = [`https://www.wikidata.org/wiki/${qid}`];
  if (sl.enwiki) sameAs.push('https://en.wikipedia.org/wiki/' + encodeURIComponent(sl.enwiki.title.replace(/ /g, '_')));
  if (sl.thwiki) sameAs.push('https://th.wikipedia.org/wiki/' + encodeURIComponent(sl.thwiki.title.replace(/ /g, '_')));
  return { slug, name, ok: true, qid, label: best.label, description: best.description, sameAs };
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(COORDS);
const out = {}; const unresolved = [];
for (const slug of slugs) {
  try {
    const r = await resolve(slug);
    if (r.ok) { out[slug] = { qid: r.qid, label: r.label, description: r.description, sameAs: r.sameAs }; console.log(`OK  ${slug.padEnd(22)} ${r.qid.padEnd(9)} ${r.description}`); }
    else { unresolved.push(slug); console.log(`??  ${slug.padEnd(22)} unresolved — cands: ${r.candidates.join(' | ')}`); }
  } catch (e) { unresolved.push(slug); console.log(`ERR ${slug}: ${e.message}`); }
  await sleep(120);
}
const dest = path.join(ROOT, '_internal/province-wikidata.json');
// merge into existing (so partial test runs don't clobber a full run)
let prev = {}; try { prev = JSON.parse(fs.readFileSync(dest, 'utf8')); } catch {}
fs.writeFileSync(dest, JSON.stringify({ ...prev, ...out }, null, 1));
console.log(`\nresolved ${Object.keys(out).length}/${slugs.length}; unresolved: ${unresolved.join(', ') || 'none'}`);
