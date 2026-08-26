// One-off: merge the 13 new "A Half-Day in X" title translations into each locale's tm.<loc>.json.
// These were the only genuinely-new strings introduced by the last 13 Bangkok area hub pages
// (99.6% of the page content already existed in the TM from the earlier 20-area + i18n batch).
import fs from 'node:fs';
import path from 'node:path';
const I18N = path.resolve(import.meta.dirname);

const NEW = {
  zh: {
    'A Half-Day in Bang Khen': 'Bang Khen半日游',
    'A Half-Day in Central Ladprao': '中央拉抛半日游',
    'A Half-Day in Chaeng Watthana': '陈瓦他那半日游',
    'A Half-Day in Charoen Krung': 'Charoen Krung半日游',
    'A Half-Day in Chinatown': '唐人街半日游',
    'A Half-Day in Kaset-Nawamin': 'Kaset-Nawamin半日游',
    'A Half-Day in Khao San & Old Town': '考山与老城半日游',
    'A Half-Day in Pinklao & Wang Lang': 'Pinklao与Wang Lang半日游',
    'A Half-Day in Ratchada–Huai Khwang': 'Ratchada–Huai Khwang半日游',
    'A Half-Day in Siam-Pratunam': 'Siam-Pratunam半日游',
    'A Half-Day in Srinakarin': '室利那卡林半日游',
    'A Half-Day in Taling Chan': '塔灵禅半日游',
    'A Half-Day on the Chao Phraya Riverside': '湄南河畔半日游',
  },
  ru: {
    'A Half-Day in Bang Khen': 'Полдня в Банг Кхен',
    'A Half-Day in Central Ladprao': 'Полдня в центре Ладпрао',
    'A Half-Day in Chaeng Watthana': 'Полдня в Чэнгваттана',
    'A Half-Day in Charoen Krung': 'Полдня в Чароен Крунг',
    'A Half-Day in Chinatown': 'Полдня в Чайнатауне',
    'A Half-Day in Kaset-Nawamin': 'Полдня в Касет-Навамин',
    'A Half-Day in Khao San & Old Town': 'Полдня в Кхао Сан и старом городе',
    'A Half-Day in Pinklao & Wang Lang': 'Полдня в Пинклао и Ванг Ланг',
    'A Half-Day in Ratchada–Huai Khwang': 'Полдня в Ратчада–Хуайкхванг',
    'A Half-Day in Siam-Pratunam': 'Полдня в Сиам-Пратунам',
    'A Half-Day in Srinakarin': 'Полдня в Сринакарин',
    'A Half-Day in Taling Chan': 'Полдня в Тхалинг Чан',
    'A Half-Day on the Chao Phraya Riverside': 'Полдня на набережной Чао Прайя',
  },
  ko: {
    'A Half-Day in Bang Khen': '방켄 반나절 코스',
    'A Half-Day in Central Ladprao': '센트럴 랏프라오 반나절 코스',
    'A Half-Day in Chaeng Watthana': '챙왓타나 반나절 코스',
    'A Half-Day in Charoen Krung': '짜런끄룽 반나절 코스',
    'A Half-Day in Chinatown': '차이나타운 반나절 코스',
    'A Half-Day in Kaset-Nawamin': '까셋-나와민 반나절 코스',
    'A Half-Day in Khao San & Old Town': '카오산 & 올드타운 반나절 코스',
    'A Half-Day in Pinklao & Wang Lang': '삔끌라오 & 왕랑 반나절 코스',
    'A Half-Day in Ratchada–Huai Khwang': '랏차다–후아이쾅 반나절 코스',
    'A Half-Day in Siam-Pratunam': '싸얌-쁘라뚜남 반나절 코스',
    'A Half-Day in Srinakarin': '스리나카린 반나절 코스',
    'A Half-Day in Taling Chan': '딸링찬 반나절 코스',
    'A Half-Day on the Chao Phraya Riverside': '짜오프라야 강변 반나절 코스',
  },
  ja: {
    'A Half-Day in Bang Khen': 'バンケンで過ごす半日',
    'A Half-Day in Central Ladprao': 'セントラル・ラープラーオで過ごす半日',
    'A Half-Day in Chaeng Watthana': 'チェンワッタナーで過ごす半日',
    'A Half-Day in Charoen Krung': 'チャルンクルンで過ごす半日',
    'A Half-Day in Chinatown': 'チャイナタウンで過ごす半日',
    'A Half-Day in Kaset-Nawamin': 'カセート・ナワミンで過ごす半日',
    'A Half-Day in Khao San & Old Town': 'カオサン&旧市街で過ごす半日',
    'A Half-Day in Pinklao & Wang Lang': 'ピンクラオ&ワンランで過ごす半日',
    'A Half-Day in Ratchada–Huai Khwang': 'ラチャダー〜フアイクワンで過ごす半日',
    'A Half-Day in Siam-Pratunam': 'サイアム・プラトゥーナームで過ごす半日',
    'A Half-Day in Srinakarin': 'シーナカリンで過ごす半日',
    'A Half-Day in Taling Chan': 'タリンチャンで過ごす半日',
    'A Half-Day on the Chao Phraya Riverside': 'チャオプラヤー川沿いで過ごす半日',
  },
  hi: {
    'A Half-Day in Bang Khen': 'बं खें में आधा दिन',
    'A Half-Day in Central Ladprao': 'सेंट्रल लद्प्रओ में आधा दिन',
    'A Half-Day in Chaeng Watthana': 'चेंगवत्थना में आधा दिन',
    'A Half-Day in Charoen Krung': 'चरोएं क्रुं में आधा दिन',
    'A Half-Day in Chinatown': 'चाइनाटाउन में आधा दिन',
    'A Half-Day in Kaset-Nawamin': 'कासेत-नवमिन में आधा दिन',
    'A Half-Day in Khao San & Old Town': 'खाओ सान और ओल्ड टाउन में आधा दिन',
    'A Half-Day in Pinklao & Wang Lang': 'पिंक्लओ और वं लं में आधा दिन',
    'A Half-Day in Ratchada–Huai Khwang': 'रत्चद–हुऐ ख्वं में आधा दिन',
    'A Half-Day in Siam-Pratunam': 'सिअं-प्रतुनं में आधा दिन',
    'A Half-Day in Srinakarin': 'सीनाखरिन में आधा दिन',
    'A Half-Day in Taling Chan': 'तलिंग चान में आधा दिन',
    'A Half-Day on the Chao Phraya Riverside': 'चओ फ्रय नदी किनारे में आधा दिन',
  },
  he: {
    'A Half-Day in Bang Khen': "חצי יום בבאנג קן",
    'A Half-Day in Central Ladprao': "חצי יום במרכז לדפראו",
    'A Half-Day in Chaeng Watthana': "חצי יום בצ'אנגואטתאנה",
    'A Half-Day in Charoen Krung': "חצי יום בצ'רואן קרונג",
    'A Half-Day in Chinatown': "חצי יום בצ'יינה טאון",
    'A Half-Day in Kaset-Nawamin': "חצי יום בקאסאט-נאווהמין",
    'A Half-Day in Khao San & Old Town': "חצי יום בקאו סאן ובעיר העתיקה",
    'A Half-Day in Pinklao & Wang Lang': "חצי יום בפינקלאו ובוואנג לאנג",
    'A Half-Day in Ratchada–Huai Khwang': "חצי יום בראצ'דה–הואי קוואנג",
    'A Half-Day in Siam-Pratunam': "חצי יום בסיאם-פראטונאם",
    'A Half-Day in Srinakarin': "חצי יום בסרינקרין",
    'A Half-Day in Taling Chan': "חצי יום בטאלינג צ'אן",
    'A Half-Day on the Chao Phraya Riverside': "חצי יום על גדת נהר צ'או פראיה",
  },
  ar: {
    'A Half-Day in Bang Khen': 'نصف يوم في بانغ خين',
    'A Half-Day in Central Ladprao': 'نصف يوم في وسط لاتفراو',
    'A Half-Day in Chaeng Watthana': 'نصف يوم في تشايانغواتانا',
    'A Half-Day in Charoen Krung': 'نصف يوم في تشارون كرونغ',
    'A Half-Day in Chinatown': 'نصف يوم في الحي الصيني',
    'A Half-Day in Kaset-Nawamin': 'نصف يوم في كاسيت-نافامين',
    'A Half-Day in Khao San & Old Town': 'نصف يوم في خاو سان والبلدة القديمة',
    'A Half-Day in Pinklao & Wang Lang': 'نصف يوم في بينكلاو ووانغ لانغ',
    'A Half-Day in Ratchada–Huai Khwang': 'نصف يوم في راتشادا–هواي خوانغ',
    'A Half-Day in Siam-Pratunam': 'نصف يوم في سيام-براتونام',
    'A Half-Day in Srinakarin': 'نصف يوم في سريناكارين',
    'A Half-Day in Taling Chan': 'نصف يوم في تالينغ تشان',
    'A Half-Day on the Chao Phraya Riverside': 'نصف يوم على ضفاف نهر تشاو فرايا',
  },
};

let totalAdded = 0;
for (const [loc, entries] of Object.entries(NEW)) {
  const tmPath = path.join(I18N, `tm.${loc}.json`);
  const tm = JSON.parse(fs.readFileSync(tmPath, 'utf8'));
  let added = 0;
  for (const [en, tr] of Object.entries(entries)) {
    if (tm[en] == null) { tm[en] = tr; added++; }
  }
  fs.writeFileSync(tmPath, JSON.stringify(tm, null, 2) + '\n');
  console.log(`[${loc}] added ${added} entries`);
  totalAdded += added;
}
console.log('total added:', totalAdded);
