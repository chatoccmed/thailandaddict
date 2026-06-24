import fs from 'fs';
const B = '/images/food/sukhumvit/';
const IMG = {
  6: { file: 'soi-cowboy.jpg', th: 'ภาพ: ซอยคาวบอย · Adam Jones / Wikimedia (CC BY-SA 2.0)', en: 'Photo: Soi Cowboy · Adam Jones / Wikimedia (CC BY-SA 2.0)', href: 'https://commons.wikimedia.org/wiki/File:Soi_Cowboy_Scene_-_Sukhumvit_District_-_Bangkok_-_Thailand_(34735950835).jpg' },
  8: { file: 'benjasiri-park.jpg', th: 'ภาพ: สวนเบญจสิริ · Y23 / Wikimedia (CC BY-SA 3.0)', en: 'Photo: Benjasiri Park · Y23 / Wikimedia (CC BY-SA 3.0)', href: 'https://commons.wikimedia.org/wiki/File:Sculpture,_Benjasiri_Park,_Bangkok.jpg' },
  9: { file: 'nana-plaza.jpg', th: 'ภาพ: ย่านนานา (BTS นานา) · calflier001 / Wikimedia (CC BY-SA 2.0)', en: 'Photo: Nana area (BTS Nana) · calflier001 / Wikimedia (CC BY-SA 2.0)', href: 'https://commons.wikimedia.org/wiki/File:NANA_SKYTRAIN_STATION_ON_SUKHUMVIT_ROAD_BANGKOK_THAILAND_FEB_2012_(6843467820).jpg' },
};
const HERO = { file: 'sukhumvit-cityscape.jpg', th: 'ภาพ: BTS อโศก สุขุมวิท · David McKelvey / Wikimedia (CC BY 2.0)', en: 'Photo: BTS Asok, Sukhumvit · David McKelvey / Wikimedia (CC BY 2.0)', href: 'https://commons.wikimedia.org/wiki/File:BTS_Skytrain_Asok_Station,_Bangkok,_Thailand_(6906994988).jpg' };
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-sukhumvit.json', false], ['astro/src/content/articles-en/top10-attractions-sukhumvit.json', true]]) {
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (ranks 6/8/9)');
}
