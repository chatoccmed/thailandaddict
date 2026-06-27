import fs from 'fs';
const B = '/images/food/talat-phlu/';
const HERO = { file: 'talat-phlu-hero.jpg', th: 'ภาพ: พระพุทธธรรมกายเทพมงคล (พระใหญ่) วัดปากน้ำ ภาษีเจริญ ฝั่งธนบุรี · Don Ramey Logan / Wikimedia (CC BY-SA 4.0)', en: 'Photo: The Big Buddha (Phra Buddha Dhammakaya Thepmongkhon), Wat Paknam Phasi Charoen, Thonburi · Don Ramey Logan / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Big_Buddha_at_Wat_Pak_Nam_Phasi_Charoen_Bangkok_Thailand_by_Don_Ramey_Logan.jpg' };
const IMG = {
  9: { file: 'wat-intharam.jpg', th: 'ภาพ: วัดอินทารามวรวิหาร (วัดบางยี่เรือนอก) ริมคลองบางกอกใหญ่ ฝั่งธนบุรี · Xiengyod / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Wat Intharam Worawihan (Wat Bang Yi Ruea Nok) by Khlong Bangkok Yai, Thonburi · Xiengyod / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Wat_Intharam_(Wat_Bang_Yi_Ruea_Nok)_-_Khlong_Bangkok_Yai_(2).JPG' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-talat-phlu.json', false], ['astro/src/content/articles-en/top10-attractions-talat-phlu.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 9)');
}
