import { getCollection } from 'astro:content';

// Generic version: build a map slug -> extra locales (beyond th/en) that have a translated twin,
// given the 7 new-locale collection names for a content type (articles/reviews/roundups).
async function extraLocalesFor(cols: Array<[string, string]>): Promise<Record<string, string[]>> {
  const m: Record<string, string[]> = {};
  for (const [loc, col] of cols) {
    let entries: Array<{ data: { slug: string } }> = [];
    try {
      entries = (await getCollection(col as any)) as any;
    } catch {
      entries = [];
    }
    for (const e of entries) {
      (m[e.data.slug] ||= []).push(loc);
    }
  }
  return m;
}

// Build a map: article slug -> array of extra locales (beyond th/en) that have a translated twin.
// Used by the routes to tell ArticleLayout which language-switcher options a page should show,
// so a page only offers locales that actually exist (no dead switcher links).
export async function extraLocalesBySlug(): Promise<Record<string, string[]>> {
  return extraLocalesFor([
    ['zh', 'articlesZh'], ['ru', 'articlesRu'], ['ko', 'articlesKo'],
    ['ja', 'articlesJa'], ['hi', 'articlesHi'], ['he', 'articlesHe'], ['ar', 'articlesAr'],
  ]);
}

// Same idea for the 30 tourism-city hotel roundups + their linked individual reviews
// (booking-funnel i18n — not translated site-wide, only for these curated slugs).
export async function extraReviewLocalesBySlug(): Promise<Record<string, string[]>> {
  return extraLocalesFor([
    ['zh', 'reviewsZh'], ['ru', 'reviewsRu'], ['ko', 'reviewsKo'],
    ['ja', 'reviewsJa'], ['hi', 'reviewsHi'], ['he', 'reviewsHe'], ['ar', 'reviewsAr'],
  ]);
}
export async function extraRoundupLocalesBySlug(): Promise<Record<string, string[]>> {
  return extraLocalesFor([
    ['zh', 'roundupsZh'], ['ru', 'roundupsRu'], ['ko', 'roundupsKo'],
    ['ja', 'roundupsJa'], ['hi', 'roundupsHi'], ['he', 'roundupsHe'], ['ar', 'roundupsAr'],
  ]);
}
