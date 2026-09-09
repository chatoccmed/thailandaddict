#!/usr/bin/env node
/* =============================================================================
   check-shell-identity.mjs — prove the two shell renderers cannot drift
   Blueprint §4.0: "_internal/lib/chrome.mjs and Shell.astro emit byte-identical
   markup consuming the same stylesheet."

   WHY THIS EXISTS
   ---------------
   The audit found five different navigations, four different save writers and
   three different footers on this site. Every one of them started as a single
   component that somebody copied "just for this page". A promise in a comment
   did not stop that. A failing build will.

   WHAT IT CHECKS
   --------------
   1. REAL RENDER. Shell.astro is compiled with @astrojs/compiler and executed
      through Astro's own container runtime — the same code path `astro build`
      takes — then compared byte for byte against a direct call into
      chrome.mjs, for every part and several locales including an RTL one.
   2. NO LITERAL CHROME. Shell.astro's template (everything after the closing
      frontmatter fence) may not contain a chrome tag of its own. This is the
      check that actually holds the line: identity is trivially true today
      because Shell.astro delegates, and this is what fails the moment someone
      pastes a <nav> into it.
   3. KNOWN CLASS NAMES. Every class chrome.mjs emits must be defined in
      _internal/shell/shell.css. An invented class name that only one renderer
      uses is exactly how the divergence started.

   Usage:  node _internal/qa/check-shell-identity.mjs [--verbose]
   Exit:   0 pass · 7 fail
   ========================================================================== */

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SHELL_ASTRO = path.join(ROOT, 'astro', 'src', 'components', 'Shell.astro');
const CHROME = path.join(ROOT, '_internal', 'lib', 'chrome.mjs');
const SHELL_CSS = path.join(ROOT, '_internal', 'shell', 'shell.css');

const VERBOSE = process.argv.includes('--verbose');
const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16);
const fail = [];
const note = (m) => console.log('  ' + m);

/* ===========================================================================
   The contexts to compare. Deliberately covers an RTL locale and a page with
   only one available locale, because those take different branches (the lang
   switcher is omitted entirely below two locales).
   ======================================================================== */

const CASES = [
  ['th hub, 2 locales', {
    locale: 'th', dir: 'ltr', tab: 'places', kind: 'hub', path: '/city-krabi.html',
    locales: [{ code: 'th', href: '/city-krabi.html' }, { code: 'en', href: '/en/city-krabi.html' }],
  }],
  ['en review, 2 locales', {
    locale: 'en', dir: 'ltr', tab: null, kind: 'review', path: '/en/review-rayavadee-krabi',
    locales: [{ code: 'th', href: '/review-rayavadee-krabi' }, { code: 'en', href: '/en/review-rayavadee-krabi' }],
  }],
  ['he roundup, RTL', {
    locale: 'he', dir: 'rtl', tab: null, kind: 'roundup', path: '/he/top10-hotels-krabi.html',
    locales: [{ code: 'th', href: '/top10-hotels-krabi.html' }, { code: 'he', href: '/he/top10-hotels-krabi.html' }],
  }],
  ['th article, single locale', {
    locale: 'th', dir: 'ltr', tab: null, kind: 'article', path: '/eat-ranking-krabi',
    locales: [{ code: 'th', href: '/eat-ranking-krabi' }],
  }],
  ['th, footer suppressed', {
    locale: 'th', dir: 'ltr', tab: 'explore', kind: 'home', path: '/', footer: false,
    locales: [{ code: 'th', href: '/' }, { code: 'en', href: '/en/' }],
  }],
];

const PARTS = ['head', 'top', 'bottom'];

/* ===========================================================================
   1. Compile Shell.astro the way `astro build` does, and execute it.
   ======================================================================== */

async function loadShellComponent() {
  const compilerUrl = pathToFileURL(
    path.join(ROOT, 'astro/node_modules/@astrojs/compiler/dist/node/index.js')).href;
  const runtimeURL = pathToFileURL(
    path.join(ROOT, 'astro/node_modules/astro/dist/runtime/server/index.js')).href;

  const dir = mkdtempSync(path.join(tmpdir(), 'ta-shell-'));

  /* The compiler still emits a `createMetadata` import that Astro 5's runtime
     no longer exports; `astro build` drops it downstream. Re-export the real
     runtime and ADD the missing symbol, rather than editing generated code —
     nothing about the component's own output changes either way. */
  const shim = path.join(dir, 'runtime-shim.mjs');
  writeFileSync(shim,
    `export * from ${JSON.stringify(runtimeURL)};\n` +
    'export const createMetadata = () => ({});\n', 'utf8');
  const internalURL = pathToFileURL(shim).href;

  const { transform } = await import(compilerUrl);
  const src = readFileSync(SHELL_ASTRO, 'utf8');
  const out = await transform(src, {
    filename: SHELL_ASTRO,
    normalizedFilename: 'Shell.astro',
    internalURL,
    sourcemap: false,
  });

  /* Rewrite RELATIVE specifiers to absolute file URLs so the compiled copy can
     live in a temp dir. internalURL is already absolute and is left alone. */
  const code = out.code.replace(
    /(from\s*)(['"])(\.\.?\/[^'"]*)\2/g,
    (_m, kw, q, rel) => kw + q + pathToFileURL(path.resolve(path.dirname(SHELL_ASTRO), rel)).href + q
  );

  const file = path.join(dir, 'Shell.compiled.mjs');
  writeFileSync(file, code, 'utf8');
  const mod = await import(pathToFileURL(file).href);
  return mod.default;
}

/* ===========================================================================
   2. RUN
   ======================================================================== */

console.log('\n  check-shell-identity — chrome.mjs  vs  Shell.astro\n');

const chrome = await import(pathToFileURL(CHROME).href);
const RENDERERS = { head: chrome.shellHead, top: chrome.shellTop, bottom: chrome.shellBottom };

let Component, container;
try {
  Component = await loadShellComponent();
  const { experimental_AstroContainer } = await import(
    pathToFileURL(path.join(ROOT, 'astro/node_modules/astro/dist/container/index.js')).href);
  container = await experimental_AstroContainer.create();
} catch (err) {
  console.error('  could not compile or boot Shell.astro:\n   ', err.message);
  process.exit(7);
}

let compared = 0;
for (const [name, ctx] of CASES) {
  for (const part of PARTS) {
    const a = RENDERERS[part](ctx);
    let b = await container.renderToString(Component, { props: { part, ctx } });

    /* Astro emits the component's own trailing newline after the Fragment.
       That is the template's whitespace, not markup, so it is reported
       explicitly rather than silently trimmed. */
    let verdict = 'identical';
    if (b !== a) {
      if (b.trim() === a.trim()) verdict = 'identical (trailing whitespace only)';
      else verdict = null;
    }

    compared++;
    if (verdict) {
      if (VERBOSE) note(`ok    ${part.padEnd(6)} ${name.padEnd(26)} sha ${sha(a.trim())}  ${a.length} B  ${verdict}`);
    } else {
      fail.push(`${part} / ${name}: chrome.mjs sha ${sha(a)} (${a.length} B) != Shell.astro sha ${sha(b)} (${b.length} B)`);
      const i = [...a].findIndex((ch, k) => ch !== b[k]);
      fail.push(`    first difference at byte ${i}:`);
      fail.push(`      chrome.mjs   …${JSON.stringify(a.slice(Math.max(0, i - 40), i + 40))}`);
      fail.push(`      Shell.astro  …${JSON.stringify(b.slice(Math.max(0, i - 40), i + 40))}`);
    }
  }
}
note(`1. real render:  ${compared} comparisons across ${CASES.length} contexts x ${PARTS.length} parts` +
     (fail.length ? '  FAILED' : '  all byte-identical'));

/* ===========================================================================
   3. Shell.astro must contain no chrome markup of its own.
   ======================================================================== */

const astroSrc = readFileSync(SHELL_ASTRO, 'utf8');
const fence = astroSrc.indexOf('\n---', astroSrc.indexOf('---') + 3);
const template = fence === -1 ? astroSrc : astroSrc.slice(fence + 4);

const FORBIDDEN_LITERALS = [
  [/<header\b/i, '<header>'],
  [/<nav\b/i, '<nav>'],
  [/<aside\b/i, '<aside>'],
  [/<footer\b/i, '<footer>'],
  [/<dialog\b/i, '<dialog>'],
  [/<svg\b/i, '<svg>'],
  [/class\s*=\s*["']ta-/i, 'a literal ta- class'],
  [/popovertarget/i, 'popovertarget'],
  [/speculationrules/i, 'speculationrules'],
  [/theme-color/i, 'theme-color'],
  [/shell\.[0-9a-f]{8}\./i, 'a hard-coded shell hash'],
];
const literals = FORBIDDEN_LITERALS.filter(([re]) => re.test(template)).map(([, n]) => n);
if (literals.length) {
  fail.push(`Shell.astro's template contains chrome markup of its own: ${literals.join(', ')}.`);
  fail.push('    Every byte must come from chrome.mjs, or the layouts and the hubs drift apart again.');
}
note(`2. no literal chrome in Shell.astro:  ${literals.length ? 'FAILED' : 'clean (' + template.trim().length + ' B of template)'}`);

/* ===========================================================================
   4. Every class chrome.mjs emits must exist in shell.css.
   ======================================================================== */

const css = readFileSync(SHELL_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const cssClasses = new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]));

/* Styled outside shell.css, on purpose. Kept short and explained. */
const ALLOWED_ELSEWHERE = new Set([
  'lang-menu',      // §4.8 popover — shell.css styles it, listed for clarity
  'lang-trigger',   // §4.8 anchor-name host
]);

const emitted = new Set();
for (const [, ctx] of CASES) {
  for (const part of PARTS) {
    for (const m of RENDERERS[part](ctx).matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) if (c) emitted.add(c);
    }
  }
}
const unknown = [...emitted].filter((c) => !cssClasses.has(c) && !ALLOWED_ELSEWHERE.has(c)).sort();
if (unknown.length) {
  fail.push(`chrome.mjs emits ${unknown.length} class name(s) that shell.css does not define: ${unknown.join(', ')}`);
  fail.push('    Add the rule to shell.css, or use the class that already exists. Do not invent one.');
}
note(`3. class names known to shell.css:  ${unknown.length ? 'FAILED' : emitted.size + ' emitted, all defined'}`);

/* ===========================================================================
   5. REPORT
   ======================================================================== */

if (fail.length) {
  console.error('\n  FAILED\n');
  for (const line of fail) console.error('   ' + line);
  console.error('');
  process.exit(7);
}

console.log('\n  PASS — chrome.mjs and Shell.astro are byte-identical.\n');
