import fs from 'fs';
const B = '/images/food/sai-tai/';
const HERO = { file: 'sai-tai-hero.jpg', th: 'ภาพ: ตลาดน้ำตลิ่งชัน (ย่านสายใต้-ตลิ่งชัน) · Globe-trotter / Wikimedia (CC BY-SA 3.0)', en: 'Photo: Taling Chan Floating Market (Sai Tai–Taling Chan) · Globe-trotter / Wikimedia (CC BY-SA 3.0)', href: 'https://commons.wikimedia.org/wiki/File:Taling_Chan_Floating_Market_in_Taling_Chan_District,_Bangkok,_Thailand.jpg' };
const IMG = {};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-sai-tai.json', false], ['astro/src/content/articles-en/top10-attractions-sai-tai.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (hero-only)');
}
