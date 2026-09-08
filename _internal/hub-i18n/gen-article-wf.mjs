// Generate a concrete translate-articles workflow script with lang + slugs baked in as literals.
// (The Workflow tool's `args` param has a known gotcha — it sometimes arrives undefined inside the
// script even when passed as a real object — so we inline the values instead. See [[workflow-pipeline-gotchas]].)
// Usage: node _internal/hub-i18n/gen-article-wf.mjs <lang> <slugsJsonFile> <outName>
//   <slugsJsonFile> = a JSON file containing an array of slug strings.
//   Writes _internal/hub-i18n/wf-articles-<outName>.mjs
import fs from 'node:fs';
import path from 'node:path';

const [, , lang, slugsFile, outName] = process.argv;
if (!lang || !slugsFile || !outName) {
  console.error('usage: node gen-article-wf.mjs <lang> <slugsJsonFile> <outName>');
  process.exit(2);
}
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const tpl = fs.readFileSync(path.join(ROOT, '_internal/hub-i18n/wf-translate-articles.mjs'), 'utf8');
const slugs = JSON.parse(fs.readFileSync(slugsFile, 'utf8'));
const out = tpl
  .replace('const lang = args.lang;', `const lang = ${JSON.stringify(lang)};`)
  .replace('const slugs = args.slugs;', `const slugs = ${JSON.stringify(slugs)};`);
const outPath = path.join(ROOT, `_internal/hub-i18n/wf-articles-${outName}.mjs`);
fs.writeFileSync(outPath, out);
console.log(`wrote ${outPath} — lang=${lang}, slugs=${slugs.length}`);
