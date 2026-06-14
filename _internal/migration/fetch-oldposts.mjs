#!/usr/bin/env node
// Pre-fetch old WP posts → disk (raw JSON + cleaned text) so port-roundups agents
// read content from disk instead of an unreliable in-agent WebFetch.
// Usage: node _internal/migration/fetch-oldposts.mjs <slug> [<slug> ...]
// Network: run via Bash with dangerouslyDisableSandbox:true (curl is sandboxed otherwise).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'oldposts');
mkdirSync(OUT, { recursive: true });

const slugs = process.argv.slice(2);
if (!slugs.length) { console.error('no slugs given'); process.exit(1); }

const stripHtml = (h) => h
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8220;|&#8221;/g, '"')
  .replace(/&#8217;|&#8216;/g, "'").replace(/&#8211;|&#8212;/g, '-')
  .replace(/&hellip;/g, '...').replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

const results = [];
for (const slug of slugs) {
  const url = `https://thailandaddict.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=title,content,slug,link`;
  let json;
  try {
    const raw = execFileSync('curl', ['-s', '-m', '90', '-A', 'Mozilla/5.0', url], { maxBuffer: 64 * 1024 * 1024 }).toString();
    json = JSON.parse(raw);
  } catch (e) {
    results.push({ slug, ok: false, err: String(e).slice(0, 120) });
    continue;
  }
  if (!Array.isArray(json) || !json.length) { results.push({ slug, ok: false, err: 'no post' }); continue; }
  const post = json[0];
  const title = post.title?.rendered || '';
  const text = stripHtml(post.content?.rendered || '');
  const words = text.replace(/[^฀-๿a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify(post, null, 2));
  writeFileSync(join(OUT, `${slug}.txt`), `TITLE: ${title}\nSOURCE: ${post.link || ''}\n\n${text}`);
  results.push({ slug, ok: true, chars: text.length, words });
}
console.log(JSON.stringify(results, null, 2));
