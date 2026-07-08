import { getCollection } from 'astro:content';

// Build a map: article slug -> array of extra locales (beyond th/en) that have a translated twin.
// Used by the routes to tell ArticleLayout which language-switcher options a page should show,
// so a page only offers locales that actually exist (no dead switcher links).
export async function extraLocalesBySlug(): Promise<Record<string, string[]>> {
  const cols: Array<[string, string]> = [
    ['zh', 'articlesZh'],
    ['ru', 'articlesRu'],
    ['ko', 'articlesKo'],
    ['ja', 'articlesJa'],
    ['hi', 'articlesHi'],
  ];
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
