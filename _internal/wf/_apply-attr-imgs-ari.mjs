import fs from 'fs';
const B = '/images/food/ari/';
const HERO = { file: 'ari-cityscape.jpg', th: 'ภาพ: ถนนพหลโยธิน (ภาพแทนบรรยากาศย่านอารีย์-พหลโยธิน) · trungydang / Wikimedia (CC BY 3.0)', en: 'Photo: Phahonyothin Road (representative Ari/Phahonyothin streetscape) · trungydang / Wikimedia (CC BY 3.0)', href: 'https://commons.wikimedia.org/wiki/File:Phahonyothin_Road,_Chatuchak,_Bangkok_thailand_-_panoramio.jpg' };
const IMG = {
  2: { file: 'la-villa-ari.jpg', th: 'ภาพ: สถานี BTS อารีย์ ถนนพหลโยธิน (ภาพแทนบรรยากาศหน้าย่าน ไม่ใช่ตัวมอลล์โดยตรง) · Crcolas / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Ari BTS Station on Phahonyothin Road (representative streetfront, not the mall itself) · Crcolas / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Ari_BTS_Station.jpg' },
  7: { file: 'soi-ari.jpg', th: 'ภาพ: อาคารบ้านยศวดี ในซอยอารีย์ (พหลโยธิน 7) · ภาพแทนบรรยากาศซอยอารีย์ร่มรื่น · Phoebus 28 / Wikimedia (CC0)', en: 'Photo: Baan Yoswadi in Soi Ari (Soi Phahonyothin 7) · representative leafy Ari soi scene · Phoebus 28 / Wikimedia (CC0)', href: 'https://commons.wikimedia.org/wiki/File:Baan_Yoswadi.jpg' },
  9: { file: 'bangkok-street-art.jpg', th: 'ภาพ: สตรีทอาร์ตย่านตลาดน้อย กรุงเทพฯ (ภาพแทนบรรยากาศสตรีทอาร์ต ไม่ใช่พหลโยธินเพลสโดยตรง) · Phoebus 28 / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Street art in Talat Noi, Bangkok (representative street-art scene, not Phaholyothin Place itself) · Phoebus 28 / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Talat_Noi_Street_Art.jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-ari.json', false], ['astro/src/content/articles-en/top10-attractions-ari.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (ranks 2/7/9)');
}
