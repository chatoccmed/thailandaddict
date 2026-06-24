// Prep specs for the Workflow that builds the remaining overlay roundups.
// Reads each anchor's _internal/overlay-data/<key>.json (real hotels + verified distances), generates a clean
// review slug per hotel, fuzzy-checks whether a review already exists (reuse), and emits anchor specs JSON.
// Output → _internal/overlay-batch-specs.json (also printed). Usage: node _internal/overlay-batch-prep.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const OD = path.join(ROOT, '_internal/overlay-data');
const REV = path.join(ROOT, 'astro/src/content/reviews');

// 14 remaining anchors: key (overlay-data filename) · roundupSlug · titleTh · anchorTh · anchorEn · context (for reviewers).
const ANCHORS = [
  ['ramathibodi', 'ramathibodi-hospital', 'โรงพยาบาลรามาธิบดี', 'Ramathibodi Hospital', 'Ramathibodi Hospital (Mahidol University), Rama VI Rd / Phaya Thai, near BTS Phaya Thai + ARL Phaya Thai and Victory Monument. Audience: patients + families.'],
  ['rajavithi', 'rajavithi-hospital', 'โรงพยาบาลราชวิถี', 'Rajavithi Hospital', "Rajavithi Hospital (public) + the Children's Hospital next door, Ratchawithi Rd, by BTS Victory Monument / Phaya Thai. Audience: patients + families."],
  ['police-hospital', 'police-hospital', 'โรงพยาบาลตำรวจ', 'Police General Hospital', 'Police General Hospital at the Ratchaprasong junction (Rama I / Ratchadamri), next to CentralWorld and the Erawan Shrine, by BTS Chit Lom / Siam. Very central. Audience: patients + families.'],
  ['praram9', 'praram9-hospital', 'โรงพยาบาลพระรามเก้า', 'Praram 9 Hospital', 'Praram 9 Hospital, Rama IX Rd, near MRT Phra Ram 9 and the Rama 9–Ratchada CBD (Central Rama 9). Audience: patients + families.'],
  ['phyathai2', 'phyathai2-hospital', 'โรงพยาบาลพญาไท 2', 'Phyathai 2 Hospital', 'Phyathai 2 Hospital (private, popular with international patients), Phahonyothin Rd, right at BTS Sanam Pao near Victory Monument. Audience: patients + families.'],
  ['samitivej-srinakarin', 'samitivej-srinakarin-hospital', 'โรงพยาบาลสมิติเวช ศรีนครินทร์', 'Samitivej Srinakarin Hospital', 'Samitivej Srinakarin Hospital, Srinakarin Rd, Suan Luang (east Bangkok), near Seacon Square. Suburban. Audience: patients + families.'],
  ['yanhee', 'yanhee-hospital', 'โรงพยาบาลยันฮี', 'Yanhee International Hospital', 'Yanhee International Hospital — world-famous for cosmetic & gender-affirming surgery (long recovery stays), Charan Sanitwong Rd, Bang Phlat (Thonburi west bank), by MRT Bang Phlat. Audience: post-surgery recovery patients + families.'],
  ['qsncc', 'qsncc', 'ศูนย์การประชุมแห่งชาติสิริกิติ์', 'Queen Sirikit National Convention Center', "QSNCC — Bangkok's biggest convention/exhibition center, Ratchadaphisek Rd, Khlong Toei, directly above MRT Queen Sirikit National Convention Centre. Audience: expo/conference/concert-goers who want to walk or take one MRT stop."],
  ['impact', 'impact-arena', 'อิมแพ็ค เมืองทองธานี', 'IMPACT Muang Thong Thani', 'IMPACT Muang Thong Thani (Arena + Challenger + Exhibition halls), Pak Kret, Nonthaburi (north). The Pink Line MRT spur into Muang Thong Thani opened 2025 (IMPACT station + skywalk). Audience: concert/expo-goers who want to walk back after a late show.'],
  ['bitec', 'bitec', 'ไบเทค บางนา', 'BITEC Bang Na', 'BITEC (Bangkok International Trade & Exhibition Centre) at BTS Bang Na (skywalk), east Bangkok. Audience: expo/trade-show-goers who want to walk or take one BTS stop.'],
  ['rajamangala', 'rajamangala-stadium', 'ราชมังคลากีฬาสถาน', 'Rajamangala National Stadium', "Rajamangala National Stadium — Thailand's biggest stadium (huge international concerts), Hua Mak Sports Complex, Ramkhamhaeng Rd, served by ARL Hua Mak + MRT Yellow Line. Audience: concert-goers who want to walk back / grab a cab after a late show."],
  ['suvarnabhumi', 'suvarnabhumi-airport', 'สนามบินสุวรรณภูมิ', 'Suvarnabhumi Airport', 'Suvarnabhumi Airport (BKK), Lat Krabang / Racha Thewa. Audience: layover / early-flight / late-arrival travellers who want a free airport shuttle; the in-terminal hotel is the Hyatt Regency (formerly Novotel). State each hotel\'s shuttle (free vs paid, hours) honestly.'],
  ['don-muang', 'don-muang-airport', 'สนามบินดอนเมือง', 'Don Mueang Airport', 'Don Mueang International Airport (DMK), the low-cost-carrier hub, Song Prapha (north). Audience: early/late budget flights; Amari Don Muang connects via skywalk; others use shuttles. State each hotel\'s shuttle (free vs paid, hours) honestly.'],
  ['sai-tai', 'sai-tai-bus-terminal', 'สถานีขนส่งสายใต้ใหม่', 'Southern Bus Terminal (Sai Tai Mai)', "Southern Bus Terminal — 'Sai Tai Mai', Borommaratchachonnani Rd, Taling Chan (Thonburi west) — the main terminal for buses to the south & west (Hua Hin, Krabi, Phuket, Kanchanaburi). Audience: travellers with an early/late long-distance bus who want to sleep close to the terminal."],
];

const existingSet = new Set(fs.readdirSync(REV).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
const kebab = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
// clean review slug for a hotel name (strip any embedded "bangkok", cap length)
const slugFor = (name) => 'review-' + kebab(name).replace(/(^|-)bangkok($|-)/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 55).replace(/-+$/, '') + '-bangkok';
// hotels whose existing review slug differs from slugFor() or lives in another cluster (verified by hand)
const OVERRIDE = {
  'The Sukosol': 'review-the-sukosol-hotel-bangkok',
  'Carlton Hotel Bangkok Sukhumvit': 'review-carlton-sukhumvit-bangkok',
  'DoubleTree by Hilton Sukhumvit Bangkok': 'review-doubletree-sukhumvit-bangkok',
  'ibis Bangkok IMPACT': 'review-ibis-bangkok-impact-nonthaburi',
  'Novotel Bangkok IMPACT': 'review-novotel-bangkok-impact-nonthaburi',
  'Hyatt Regency Bangkok Suvarnabhumi Airport': 'review-hyatt-regency-bangkok-suvarnabhumi-airport-samut-prakan',
};
function findExisting(name) {
  if (OVERRIDE[name] && existingSet.has(OVERRIDE[name])) return OVERRIDE[name];
  const s = slugFor(name);
  return existingSet.has(s) ? s : null;
}

const specs = [];
const summary = [];
for (const [key, slugSuffix, titleTh, anchorTh, anchorEn, context] of ANCHORS) {
  const p = path.join(OD, `hotels-near-${key}.json`);
  if (!fs.existsSync(p)) { summary.push(`✗ MISSING overlay-data: ${key}`); continue; }
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const hotels = d.hotels.map((h) => {
    const reused = findExisting(h.name);
    const slug = reused || slugFor(h.name);
    return { name: h.name, slug, star: h.star, priceFromTHB: h.priceFromTHB, distTh: h.distTh, distEn: h.distEn, bestForTh: h.bestForTh, isNew: !reused };
  });
  const n = hotels.length;
  const roundupSlug = `top${n}-${slugSuffix}-hotels-bangkok`;
  specs.push({ key, roundupSlug, titleTh: `${n} ${titleTh === 'Southern Bus Terminal (Sai Tai Mai)' ? '' : 'ที่พักใกล้' + titleTh}`.trim(), anchorTh, anchorEn, context, zoneSlug: d.zoneSlug, hotels });
  summary.push(`${key} → ${roundupSlug} · ${n} hotels (${hotels.filter(h => h.isNew).length} new, ${hotels.filter(h => !h.isNew).length} reuse: ${hotels.filter(h => !h.isNew).map(h => h.slug).join(',') || '-'})`);
}
fs.writeFileSync(path.join(OD, '_overlay-batch-specs.json'), JSON.stringify(specs, null, 2));
console.log(summary.join('\n'));
console.log(`\n${specs.length} anchors · ${specs.reduce((s, a) => s + a.hotels.filter(h => h.isNew).length, 0)} new reviews to create · specs → _internal/overlay-data/_overlay-batch-specs.json`);
