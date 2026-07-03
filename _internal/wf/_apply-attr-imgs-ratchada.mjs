import fs from 'fs';
const B = '/images/food/ratchada/';
const HERO = {
  file: 'ratchada-hero.jpg',
  th: 'ภาพ: เทวาลัยพระพิฆเนศ สี่แยกห้วยขวาง ริมถนนรัชดาภิเษก · Chainwit. / Wikimedia (CC BY-SA 4.0)',
  en: 'Photo: Ganesh Shrine at the Huai Khwang intersection on Ratchadaphisek Rd · Chainwit. / Wikimedia (CC BY-SA 4.0)',
  href: 'https://commons.wikimedia.org/wiki/File:Ganesh_Shrine_at_Huai_Khwang,_Bangkok_%E0%B8%A8%E0%B8%B2%E0%B8%A5%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%9E%E0%B8%B4%E0%B8%86%E0%B9%80%E0%B8%99%E0%B8%A8_%E0%B8%AA%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AB%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%82%E0%B8%A7%E0%B8%B2%E0%B8%87_(April2021)_05.jpg',
};
const IMG = {
  1: { file: 'ganesh-shrine-huai-khwang.jpg',
    th: 'ภาพ: องค์พระพิฆเนศทองคำสี่กร ศาลพระพิฆเนศห้วยขวาง · Chainwit. / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: The golden four-armed Ganesha at the Huai Khwang shrine · Chainwit. / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Ganesh_Shrine_at_Huai_Khwang,_Bangkok_%E0%B8%A8%E0%B8%B2%E0%B8%A5%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%9E%E0%B8%B4%E0%B8%86%E0%B9%80%E0%B8%99%E0%B8%A8_%E0%B8%AA%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%A2%E0%B8%81%E0%B8%AB%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%82%E0%B8%A7%E0%B8%B2%E0%B8%87_(April2021)_02.jpg' },
  2: { file: 'new-chinatown-prachdrat-bamphen.jpg',
    th: 'ภาพ: ถนนเยาวราช ไชนาทาวน์กรุงเทพยามค่ำคืน (ภาพแทนบรรยากาศย่านจีนใหม่ประชาราษฎร์บำเพ็ญ) · yeowatzup / Wikimedia (CC BY 2.0)',
    en: 'Photo: Yaowarat Rd, Bangkok Chinatown at night (stand-in for the New Chinatown scene on Pracharat Bamphen Rd) · yeowatzup / Wikimedia (CC BY 2.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Thanon_Yaowarat,_Bangkok,_Thailand_(4245968169).jpg' },
  3: { file: 'huai-khwang-market.jpg',
    th: 'ภาพ: ตลาดห้วยขวาง กรุงเทพฯ · mohigan / Wikimedia (CC BY-SA 3.0)',
    en: 'Photo: Huai Khwang market, Bangkok · mohigan / Wikimedia (CC BY-SA 3.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Huai_Khwang,_Bangkok_10310,_Thailand_-_panoramio.jpg' },
  10: { file: 'suan-phannaphirom.jpg',
    th: 'ภาพ: สวนป่าเบญจกิติ พื้นที่สีเขียวสาธารณะกลางกรุงเทพฯ (ภาพแทนสวนสาธารณะย่านรัชดา) · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    en: 'Photo: Benjakitti Forest Park, a public green space in central Bangkok (stand-in for a Ratchada-area park) · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Benjakitti_Forest_Park_(I).jpg' },
};

for (const [path, isEn] of [
  ['astro/src/content/articles/top10-attractions-ratchada.json', false],
  ['astro/src/content/articles-en/top10-attractions-ratchada.json', true],
]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (not found)'); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file;
  a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) {
    if (b.kind === 'restaurant' && IMG[b.rank]) {
      b.libImg = B + IMG[b.rank].file;
      b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th;
      b.libCreditHref = IMG[b.rank].href;
      n++;
    }
  }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards');
}
