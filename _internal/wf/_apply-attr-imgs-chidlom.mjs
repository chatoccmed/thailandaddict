import fs from 'fs';
const B = '/images/food/chidlom/';
const HERO = { file: 'chidlom-hero.jpg', th: 'ภาพ: เซ็นทรัลเวิลด์ (CentralWorld) ย่านราชประสงค์-ชิดลม · Bcow / Wikimedia (CC BY-SA 2.0)', en: 'Photo: CentralWorld (Ratchaprasong-Chidlom) · Bcow / Wikimedia (CC BY-SA 2.0)', href: 'https://commons.wikimedia.org/wiki/File:CentralWorld_Bangkok_Thailand.jpg' };
const IMG = {
  8: { file: 'trimurti-shrine.jpg', th: 'ภาพ: ศาลพระตรีมูรติ หน้าเซ็นทรัลเวิลด์ · Chainwit. / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Trimurti Shrine at CentralWorld · Chainwit. / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Trimurti_Shrine_Isetan_Central_World_Bangkok.jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-chidlom.json', false], ['astro/src/content/articles-en/top10-attractions-chidlom.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 8)');
}
