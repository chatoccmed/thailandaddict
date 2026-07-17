// Regenerate pages/{zh,ru,ko,ja,hi,he,ar}/[slug].astro to dispatch review/roundup/article
// (was articles-only). Idempotent — overwrites with the current template.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

const LANGS = [
  { code: 'zh', Cap: 'Zh' }, { code: 'ru', Cap: 'Ru' }, { code: 'ko', Cap: 'Ko' },
  { code: 'ja', Cap: 'Ja' }, { code: 'hi', Cap: 'Hi' }, { code: 'he', Cap: 'He' }, { code: 'ar', Cap: 'Ar' },
];

const tpl = (code, Cap) => `---
import { getCollection } from 'astro:content';
import ReviewLayout from '../../layouts/ReviewLayout.astro';
import RoundupLayout from '../../layouts/RoundupLayout.astro';
import ArticleLayout from '../../layouts/ArticleLayout.astro';
import { extraLocalesBySlug, extraReviewLocalesBySlug, extraRoundupLocalesBySlug } from '../../lib/locales';

export async function getStaticPaths() {
  let reviews = [], roundups = [];
  try { reviews = await getCollection('reviews${Cap}'); } catch {}
  try { roundups = await getCollection('roundups${Cap}'); } catch {}
  const articles = await getCollection('articles${Cap}');
  const extra = await extraLocalesBySlug();
  const extraRv = await extraReviewLocalesBySlug();
  const extraRd = await extraRoundupLocalesBySlug();
  return [
    ...reviews.map((r) => ({
      params: { slug: r.data.slug },
      props: { kind: 'review' as const, data: r.data, availableLocales: ['th', 'en', ...(extraRv[r.data.slug] || [])] },
    })),
    ...roundups.map((r) => ({
      params: { slug: r.data.slug },
      props: { kind: 'roundup' as const, data: r.data, availableLocales: ['th', 'en', ...(extraRd[r.data.slug] || [])] },
    })),
    ...articles.map((r) => ({
      params: { slug: r.data.slug },
      props: { kind: 'article' as const, data: r.data, availableLocales: ['th', 'en', ...(extra[r.data.slug] || [])] },
    })),
  ];
}

const { kind, data, availableLocales } = Astro.props;
---
{kind === 'review'
  ? <ReviewLayout data={data} lang="${code}" availableLocales={availableLocales} />
  : kind === 'roundup'
  ? <RoundupLayout data={data} lang="${code}" availableLocales={availableLocales} />
  : <ArticleLayout data={data} lang="${code}" hasEn={true} availableLocales={availableLocales} />}
`;

for (const { code, Cap } of LANGS) {
  const file = path.join(ROOT, 'astro', 'src', 'pages', code, '[slug].astro');
  fs.writeFileSync(file, tpl(code, Cap));
  console.log('wrote', path.relative(ROOT, file));
}
