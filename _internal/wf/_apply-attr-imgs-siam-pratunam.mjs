import fs from 'fs';
const B = '/images/food/siam-pratunam/';
const HERO = { file: 'siam-pratunam-hero.jpg', th: 'ภาพ: เซ็นทรัลเวิลด์ ย่านราชประสงค์ ยามค่ำ · Imtaiki / Wikimedia (CC BY-SA 3.0)', en: 'Photo: CentralWorld, Ratchaprasong at night · Imtaiki / Wikimedia (CC BY-SA 3.0)', href: 'https://commons.wikimedia.org/wiki/File:CentralWorld-NIGHT_2012.jpg' };
const IMG = {
  3: { file: 'erawan-shrine.jpg', th: 'ภาพ: ศาลท้าวมหาพรหมเอราวัณ (คณะรำแก้บนถวาย) · Ninara / Wikimedia (CC BY 2.0)', en: 'Photo: Erawan Shrine (offering dance) · Ninara / Wikimedia (CC BY 2.0)', href: 'https://commons.wikimedia.org/wiki/File:Dance_offering_at_Erawan_Shrine,_Bangkok_(32844253793).jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-siam-pratunam.json', false], ['astro/src/content/articles-en/top10-attractions-siam-pratunam.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 3)');
}
