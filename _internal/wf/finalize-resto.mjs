#!/usr/bin/env node
// Post-process an eat-ranking article AFTER the engine writes it (the engine/Workflow sandbox cannot import).
// Applies the owner's image-tier policy (2026-06-23): card media priority IG > FB > CC; Map always.
//   - CC food-library image (libImg) is attached ONLY to restaurants with NO verified igPost/fbPage (tier 4).
//   - Restaurants with IG and/or FB keep social + map only (no generic CC tab).
//   - Hero = one CC dish image (always), credited.
//   - Ban-word safety sweep (AI words → neutral synonyms; flags self-undermining disclaimers — fix those by hand).
// Usage: node _internal/wf/finalize-resto.mjs <city-slug>
import fs from 'fs';
import { matchFoodImage } from './lib-match.mjs';

const CITY = process.argv[2];
if (!CITY) { console.error('need <city-slug>'); process.exit(1); }
const P = `astro/src/content/articles/${process.argv[3] || ('top10-popular-restaurants-' + CITY)}.json`;
if (!fs.existsSync(P)) { console.error('NO article:', P); process.exit(2); }
const a = JSON.parse(fs.readFileSync(P, 'utf8'));

const restos = (a.blocks || []).filter(b => b.kind === 'restaurant');
let cc = 0, social = 0;
for (const b of restos) {
  const hasSocial = !!(b.igPost || b.fbPage);
  // scrub any stale scraped-image fields the engine no longer emits
  delete b.img; delete b.alt; delete b.credit; delete b.creditHref; delete b.gallery;
  if (hasSocial) {
    delete b.libImg; delete b.libCredit; delete b.libCreditHref;  // tier 1-3: no generic CC tab
    social++;
  } else {
    const m = matchFoodImage(b.foodType || '', b.cuisine || '', b.signature || '', b.name || '') || {};
    if (m.libImg) { b.libImg = m.libImg; b.libCredit = m.libCredit; b.libCreditHref = m.libCreditHref; cc++; }
  }
}

// hero = one CC dish image (rank-1 foodType, else a sane default), always credited
const r1 = restos.find(b => b.rank === 1) || restos[0] || {};
const hero = matchFoodImage(r1.foodType || '', r1.cuisine || '', r1.signature || '', r1.name || '')
  || matchFoodImage('สตรีทฟู้ด', '', '', '') || {};
if (hero.libImg) { a.heroImg = hero.libImg; a.image = hero.libImg; a.heroCredit = hero.libCredit; a.heroCreditHref = hero.libCreditHref; }

// ban-word safety sweep
const SWAP = { 'ตอบโจทย์': 'ลงตัว', 'โดดเด่น': 'เป็นเอกลักษณ์', 'ครบครัน': 'ครบ', 'ระดับโลก': 'ชั้นนำ', 'สุดยอด': 'ยอดเยี่ยม', 'อันซีน': 'ที่หลายคนยังไม่รู้จัก' };
let raw = JSON.stringify(a); let swaps = 0;
for (const [bad, good] of Object.entries(SWAP)) { const n = raw.split(bad).length - 1; if (n) { raw = raw.split(bad).join(good); swaps += n; } }
const after = JSON.parse(raw);
const DISC = ['ไม่ได้ไปกิน', 'ไม่ได้ไปนั่ง', 'ไม่เดาให้', 'รวบรวมจากเสียง', 'พูดกว้าง ๆ'];
const flagged = DISC.filter(w => raw.includes(w));

fs.writeFileSync(P, JSON.stringify(after, null, 2) + '\n');
console.log(`[finalize] ${CITY}: ${social} social (IG/FB) · ${cc} CC-only · hero=${(a.heroImg || '').split('/').pop()} · ban-swaps=${swaps}`);
restos.forEach(b => { const tier = (b.igPost && b.fbPage) ? 1 : b.igPost ? 2 : b.fbPage ? 3 : 4; const tabs = [b.igPost && '📷IG', b.fbPage && '📘FB', b.libImg && '🍜CC', '🗺️Map'].filter(Boolean); console.log(`  #${b.rank} ${String(b.name).split('(')[0].trim().slice(0, 18).padEnd(19)} tier${tier} → ${tabs.join(' ')}`); });
if (flagged.length) console.log(`  ⚠ DISCLAIMER PHRASES STILL PRESENT (fix by hand): ${flagged.join(', ')}`);
