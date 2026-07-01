// Central locale registry for thailandaddict.com — shared by all generators.
// Golden rule (CLAUDE.md / I18N plan): structure/layout/design identical across locales;
// only displayed text + reading direction (LTR/RTL) change.
//
// font = extra Google-Fonts family to load for this script (null = base stack covers it).
// The base stack (Noto Sans Thai / Sarabun / Outfit / Fraunces) is always loaded; per-locale
// fonts are appended only on that locale's pages so no page carries every script.
export const LOCALES = [
  { code: 'th', dir: 'ltr', label: 'ไทย',      htmlLang: 'th',      bcp47: 'th-TH', ogLocale: 'th_TH', font: null },
  { code: 'en', dir: 'ltr', label: 'English',  htmlLang: 'en',      bcp47: 'en-US', ogLocale: 'en_US', font: null },
  { code: 'zh', dir: 'ltr', label: '中文',      htmlLang: 'zh-Hans', bcp47: 'zh-CN', ogLocale: 'zh_CN', font: 'Noto+Sans+SC:wght@400;500;700;900' },
  { code: 'ru', dir: 'ltr', label: 'Русский',  htmlLang: 'ru',      bcp47: 'ru-RU', ogLocale: 'ru_RU', font: 'Noto+Sans:wght@400;500;700;800' },
  { code: 'ko', dir: 'ltr', label: '한국어',    htmlLang: 'ko',      bcp47: 'ko-KR', ogLocale: 'ko_KR', font: 'Noto+Sans+KR:wght@400;500;700;900' },
  { code: 'ja', dir: 'ltr', label: '日本語',    htmlLang: 'ja',      bcp47: 'ja-JP', ogLocale: 'ja_JP', font: 'Noto+Sans+JP:wght@400;500;700;900' },
  { code: 'he', dir: 'rtl', label: 'עברית',     htmlLang: 'he',      bcp47: 'he-IL', ogLocale: 'he_IL', font: 'Noto+Sans+Hebrew:wght@400;500;700;900' },
  { code: 'ar', dir: 'rtl', label: 'العربية',   htmlLang: 'ar',      bcp47: 'ar-SA', ogLocale: 'ar_AR', font: 'Noto+Sans+Arabic:wght@400;500;700;900' },
  { code: 'hi', dir: 'ltr', label: 'हिन्दी',      htmlLang: 'hi',      bcp47: 'hi-IN', ogLocale: 'hi_IN', font: 'Noto+Sans+Devanagari:wght@400;500;700;900' },
];

export const LOCALE_CODES = LOCALES.map(l => l.code);
export const LOCALE_MAP = Object.fromEntries(LOCALES.map(l => [l.code, l]));

// URL prefix for a locale: th at root, everyone else under /<code>/
export const prefix = code => code === 'th' ? '/' : '/' + code + '/';
// Output subdir for a locale under astro/public
export const outSub = code => code === 'th' ? '' : code;
