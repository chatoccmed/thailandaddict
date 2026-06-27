import fs from 'fs';
const B = '/images/food/rama9/';
const HERO = { file: 'rama9-hero.jpg', th: 'ภาพ: ตลาดรถไฟรัชดา (หลังคาเต็นท์สีรุ้ง) · aotaro / Wikimedia (CC BY 2.0)', en: 'Photo: Train Night Market Ratchada (rainbow tent roofs) · aotaro / Wikimedia (CC BY 2.0)', href: 'https://commons.wikimedia.org/wiki/File:Train_Night_Market_Ratchada_(34079339800).jpg' };
const IMG = {
  4: { file: 'rca.jpg', th: 'ภาพ: RCA Plaza (Royal City Avenue) · Globe-trotter / Wikimedia (CC BY-SA 3.0)', en: 'Photo: RCA Plaza (Royal City Avenue) · Globe-trotter / Wikimedia (CC BY-SA 3.0)', href: 'https://commons.wikimedia.org/wiki/File:RCA_Plaza_in_Huai_Khwang_District,_Bangkok,_Thailand.jpg' },
  10: { file: 'investory.jpg', th: 'ภาพ: อาคารตลาดหลักทรัพย์แห่งประเทศไทย (ที่ตั้ง INVESTORY) · Sry85 / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Stock Exchange of Thailand building (home of INVESTORY) · Sry85 / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:An_office_building_of_Stock_Exchange_of_Thailand.jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-rama9.json', false], ['astro/src/content/articles-en/top10-attractions-rama9.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (ranks 4/10)');
}
