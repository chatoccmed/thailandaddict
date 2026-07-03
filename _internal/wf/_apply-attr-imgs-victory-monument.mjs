import fs from 'fs';
const B = '/images/food/victory-monument/';
const HERO = { file: 'victory-monument-hero.jpg',
  th: 'ภาพ: อนุสาวรีย์ชัยสมรภูมิยามเย็น กรุงเทพฯ · samfotograf / Wikimedia (CC BY-SA 4.0)',
  en: 'Photo: Victory Monument in the evening, Bangkok · samfotograf / Wikimedia (CC BY-SA 4.0)',
  href: 'https://commons.wikimedia.org/wiki/File:Victory_Monument_in_the_Evening.jpg' };
const IMG = {
  1: { file: 'rangnam-road-street-food.jpg',
    th: 'ภาพ: ย่านคิงเพาเวอร์ รางน้ำ ถนนรางน้ำ กรุงเทพฯ · Vanjpadilla / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: King Power Rangnam area on Rang Nam Road, Bangkok · Vanjpadilla / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:ESEAP_Strategy_Summit_Day_0_-_Meetup_at_King_Power_Rangnam_1.jpg' },
  5: { file: 'victory-mall-victory-monument.jpg',
    th: 'ภาพ: อาคารคิงเพาเวอร์ คอมเพล็กซ์ รางน้ำ ใกล้อนุสาวรีย์ชัยฯ · Tris T7 / Wikimedia (CC BY 3.0)',
    en: 'Photo: King Power Rangnam complex near Victory Monument · Tris T7 / Wikimedia (CC BY 3.0)',
    href: 'https://commons.wikimedia.org/wiki/File:%E0%B8%84%E0%B8%A3%E0%B8%B8%E0%B8%91_%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2_%E0%B8%84%E0%B8%B4%E0%B8%87_%E0%B9%80%E0%B8%9E%E0%B8%B2%E0%B9%80%E0%B8%A7%E0%B8%AD%E0%B8%A3%E0%B9%8C_%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%9E%E0%B8%A5%E0%B9%87%E0%B8%81%E0%B8%8B%E0%B9%8C_%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%99%E0%B9%89%E0%B8%B3_Garuda_front_King_Power_Rangnam_Photographed_by_Trisorn_Triboon-6.jpg' },
  6: { file: 'ratchawat-market.jpg',
    th: 'ภาพ: แผงผลไม้ในตลาดสดกรุงเทพฯ (ภาพแทน ตลาดยิ่งเจริญ) · UT (Panoramio) / Wikimedia (CC BY-SA 3.0)',
    en: 'Photo: Fruit stall at a Bangkok fresh market (stand-in, Ying-Charoen Market) · UT (Panoramio) / Wikimedia (CC BY-SA 3.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Fruit_stall@Ying-Charoen_Market_,_%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B8%9C%E0%B8%A5%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%A2%E0%B8%B7%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D_-_panoramio.jpg' },
  10: { file: 'victory-monument-bus-hub.jpg',
    th: 'ภาพ: รถเมล์รอบอนุสาวรีย์ชัยสมรภูมิ กรุงเทพฯ · Khxwklong / Wikimedia (CC0)',
    en: 'Photo: Buses at Victory Monument roundabout, Bangkok · Khxwklong / Wikimedia (CC0)',
    href: 'https://commons.wikimedia.org/wiki/File:Bangkok_Busses_At_Victory_Monument.jpg' },
};
for (const [path, isEn] of [
  ['astro/src/content/articles/top10-attractions-victory-monument.json', false],
  ['astro/src/content/articles-en/top10-attractions-victory-monument.json', true],
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
