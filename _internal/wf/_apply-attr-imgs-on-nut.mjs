import fs from 'fs';
const B = '/images/food/on-nut/';
const HERO = { file: 'on-nut-hero.jpg', th: 'ภาพ: วัดมหาบุศย์ (วัดแม่นาคพระโขนง) ย่านอ่อนนุช-พระโขนง กรุงเทพฯ · กสิณธร ราชโอรส / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Wat Mahabut (the Mae Nak Phra Khanong temple), On Nut–Phra Khanong, Bangkok · Kasinthorn Ratchaoros / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:วัดมหาบุศย์_เขตสวนหลวง_กรุงเทพมหานคร.jpg' };
const IMG = {};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-on-nut.json', false], ['astro/src/content/articles-en/top10-attractions-on-nut.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged');
}
