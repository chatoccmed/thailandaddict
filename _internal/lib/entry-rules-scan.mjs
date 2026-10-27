// Find visa-free stay claims that disagree with astro/src/data/entry-rules.json.
// Used by the build gate (_internal/qa/check-entry-rules.mjs, on content JSON) and the live check
// (_internal/audit/check-entry-rules-live.mjs, on production HTML), so both judge with the same rule.
//
// The rule: around every visa-free / visa-exemption phrase (any of the 9 site languages), a number
// of days must be one of allowedVisaFreeDays. Thai and Japanese have no sentence spaces to split on,
// so this looks at a fixed window around the phrase instead of a sentence.

// "visa-free" in the site's nine languages, plus the common English and Thai variants.
const EXEMPT = /visa[- ]free|visa[- ]exempt(?:ion)?|without (?:a )?visa|ยกเว้นวีซ่า|ยกเว้นการตรวจลงตรา|ฟรีวีซ่า|免签|免簽|без\s?виз|безвиз|무비자|비자\s?면제|ビザ免除|ビザなし|वीज़ा[- ]मुक्त|वीजा[- ]मुक्त|वीज़ा छूट|वीजा छूट|ללא ויזה|פטור מו?ויזה|بدون تأشيرة|(?:ال)?إعفاء من التأشيرة/giu;
// A number of days, optionally a range ("30–60"), in the nine languages.
const DAYS = /(\d{1,3})(?:\s*[–-]\s*(\d{1,3}))?\s*(?:-?\s*days?\b|วัน|天|дн(?:ей|я|и)\b|일|日|दिन|ימים|יום|يومًا|يوما|يوم|أيام)/gu;
// Stays that are allowed to be other numbers: the 60-day tourist visa (TR), DTV, Thai nationals abroad.
const OTHER_VISA = /tourist visa|\bTR\b|DTV|วีซ่าท่องเที่ยว|Thai (?:nationals|citizens|passport)|คนไทย|ผู้ถือพาสปอร์ตไทย/iu;
const WINDOW = 110;

export const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ');

// Every string in a JSON value, in document order, joined so a table row reads as one line.
export const flatten = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(flatten).join(' | ') :
  v && typeof v === 'object' ? Object.values(v).map(flatten).join(' | ') : '';

// → [{ days, snippet }] for each disallowed number of days near a visa-free phrase in `text`.
export function staleClaims(text, allowed) {
  const t = strip(text), out = [], seen = new Set();
  for (const m of t.matchAll(EXEMPT)) {
    const from = Math.max(0, m.index - WINDOW), win = t.slice(from, m.index + m[0].length + WINDOW);
    for (const d of win.matchAll(DAYS)) {
      const ctx = win.slice(Math.max(0, d.index - 40), d.index);
      if (OTHER_VISA.test(ctx)) continue;
      for (const n of [d[1], d[2]].filter(Boolean).map(Number)) {
        // Below 20 is a trip length or a date ("10日間のモデルコース", "1日US$40"), not a visa stay —
        // the stale stays this exists to catch were 45 and 60.
        if (n < 20 || allowed.includes(n)) continue;
        const key = from + d.index + ':' + n;
        if (seen.has(key)) continue; seen.add(key);
        out.push({ days: n, snippet: win.trim().slice(0, 220) });
      }
    }
  }
  return out;
}
