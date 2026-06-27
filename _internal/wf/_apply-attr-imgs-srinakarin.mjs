import fs from 'fs';
const B = '/images/food/srinakarin/';
const HERO = { file: 'srinakarin-hero.jpg', th: 'ภาพ: สวนหลวง ร.9 — อาคารชัยพฤกษ์ริมสวนดอกไม้และทะเลสาบ สวนสาธารณะใหญ่ใจกลางย่านศรีนครินทร์ · Rachasak Ragkamnerd / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Suan Luang Rama IX — Chai Chon building beside the flower garden and lake, the big public park in the Srinakarin area · Rachasak Ragkamnerd / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Suan_Luang_Rama_IX_-_Chai_Chon_building_with_the_flower_garden_and_the_lake.jpg' };
const IMG = {};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-srinakarin.json', false], ['astro/src/content/articles-en/top10-attractions-srinakarin.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged');
}
