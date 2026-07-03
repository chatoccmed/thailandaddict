import fs from 'fs';
const B = '/images/food/central-ladprao/';
const HERO = { file: 'central-ladprao-hero.jpg',
  th: 'ภาพ: ตึกช้าง (Elephant Building) ตึกระฟ้ารูปช้างริมถนนพหลโยธิน · Yu tptw / Wikimedia (CC BY-SA 4.0)',
  en: 'Photo: The Elephant Building, the elephant-shaped skyscraper on Phahonyothin Road · Yu tptw / Wikimedia (CC BY-SA 4.0)',
  href: 'https://commons.wikimedia.org/wiki/File:Elephant_Building_20240702.jpg' };
const IMG = {
  2: { file: 'liabduan-danneramit-night-market.jpg',
    th: 'ภาพ: บรรยากาศสตรีทฟู้ดตลาดกลางคืนย่านกรุงเทพฯ (ภาพประกอบ) · Pauloleong2002 / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: Street-food scene at a Bangkok night market (illustrative) · Pauloleong2002 / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Fresh_vegetables_with_noodles.jpg' },
  4: { file: 'the-avenue-ratchayothin.jpg',
    th: 'ภาพ: ศูนย์การค้าย่านรัชโยธิน (ภาพประกอบ) · Khemkhaeng / Wikimedia (CC BY-SA 3.0)',
    en: 'Photo: A shopping mall at the Ratchayothin junction (illustrative) · Khemkhaeng / Wikimedia (CC BY-SA 3.0)',
    href: 'https://commons.wikimedia.org/wiki/File:New_Facade_CentralPlaza_Ladprao.jpg' },
  6: { file: 'elephant-building-phahon-yothin.jpg',
    th: 'ภาพ: ตึกช้างริมถนนพหลโยธินกับรถไฟฟ้า BTS · กสิณธร ราชโอรส / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: The Elephant Building on Phahonyothin Road with the BTS Skytrain · Kasidit Rachaoros / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:%E0%B8%95%E0%B8%B6%E0%B8%81%E0%B8%8A%E0%B9%89%E0%B8%B2%E0%B8%87_%E0%B9%81%E0%B8%A5%E0%B8%B0_%E0%B8%A3%E0%B8%96%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A3%E0%B8%B1%E0%B8%8A%E0%B9%82%E0%B8%A2%E0%B8%98%E0%B8%B4%E0%B8%99_(Elephant_Building_and_BTS_Skytrain).jpg' },
  8: { file: 'suan-somdet-ya-84-park.jpg',
    th: 'ภาพ: ซุ้มไม้ร่มรื่นในสวนสมเด็จย่า กรุงเทพฯ (ภาพประกอบ) · Hdamm / Wikimedia (CC BY-SA 3.0)',
    en: 'Photo: A shaded pergola in Suan Somdet Ya, Bangkok (illustrative) · Hdamm / Wikimedia (CC BY-SA 3.0)',
    href: 'https://commons.wikimedia.org/wiki/File:BKK_Suan_Somdet_Ya.jpg' },
};
for (const [path, isEn] of [
  ['astro/src/content/articles/top10-attractions-central-ladprao.json', false],
  ['astro/src/content/articles-en/top10-attractions-central-ladprao.json', true],
]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (not found)'); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file;
  a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) {
    if (b.kind === 'restaurant' && IMG[b.rank]) {
      b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++;
    }
  }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero + ' + n + ' cards');
}
