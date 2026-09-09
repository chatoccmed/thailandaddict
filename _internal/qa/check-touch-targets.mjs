#!/usr/bin/env node
/* =============================================================================
   check-touch-targets.mjs — the three mobile acceptance gates, measured
   Blueprint §3.6 · §4.3 · Phase 1 acceptance · Phase 2 build gates · EXIT CODE 5

   WHY THIS EXISTS
   ---------------
   Most of this site's traffic is a phone, and all of its revenue is one tap on
   a booking CTA. Three failures cost money and none of them raise an error:

     1. HORIZONTAL SCROLL — one element wider than the viewport and the whole
        page slides. Nothing throws; the page just feels broken.
     2. TARGETS UNDER 44 px — Apple's floor is 44 pt, Android's 48 dp, WCAG 2.2
        AA's is 24 px. A 32 px chip is tappable in a screenshot and a coin-flip
        with a thumb.
     3. AN OCCLUDED BOOKING CTA — the live audit found five fixed elements
        fighting for the bottom edge, with .ta-tripfab (z 9000) sitting on top
        of the Trip.com button. Trip.com is one third of "compare 3 sites", and
        it was untappable for anyone who had ever saved anything. That bug
        survived for months because no test ever asked a browser where a pixel
        actually lands. This gate asks.

   It renders 6 real pages — one review, one roundup, one article, one hub, the
   homepage and the planner — at 360, 390 and 430 CSS px, in headless Chrome
   driven over CDP with no dependencies (no puppeteer, no Chromium download:
   this repo has 199 files of headroom against Cloudflare's 20,000 asset cap
   and a build that already needs 12 GB of heap).

   WHAT IT MEASURES, AND WHAT IT DELIBERATELY DOES NOT
   ---------------------------------------------------
   · Hit area includes an absolutely-positioned ::before/::after with negative
     insets, because that is exactly how the shell extends a small icon button
     (.ta-icon-btn::after{inset:-10px}) without changing layout. Measuring the
     element rect alone would report false failures on correct code.
   · Inline links inside prose are exempt. WCAG 2.5.5/2.5.8 exempt them, and a
     44 px floor inside a paragraph would mean double-spaced body text.
   · Occlusion is tested with elementFromPoint at three points across the CTA,
     not by comparing rectangles — a rectangle overlap says nothing about
     pointer-events, and pointer-events is how half of these bugs are dodged.

   Usage:
     node _internal/qa/check-touch-targets.mjs [docRoot]
       docRoot            default astro/dist, else astro/public
       TA_QA_DOCROOT      same, via env
       TA_QA_CHROME       explicit path to chrome/msedge
       TA_QA_REQUIRE_BROWSER=1  fail instead of skipping when no browser is found
       --keep             leave the static server running for manual poking
     exit 0 = OK (or skipped, see above) · exit 5 = a gate failed
   ========================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const EXIT = 5;

const WIDTHS = [360, 390, 430];
const VIEWPORT_HEIGHT = 780;
const MIN_TARGET = 44;              /* §3.6 working floor */
const SETTLE_MS = 900;              /* after load: webfonts, lazy chrome, sticky bars */

/* RATCHET (see also check-i18n-keys.mjs).
   Phase 2 ships layouts first, then hubs, then the ~24 standalone pages, so on
   any given day some of these six are on the shell and some are not. A gate
   that fails on the unmigrated ones would be red for weeks and would be turned
   off, so counts are pinned per page-kind and width and only GROWTH fails.
   Shrink the file as each page moves onto the shell; the target is all zeroes.

   ONE EXCEPTION, deliberately not ratcheted: an occluded booking CTA is never
   acceptable at any count. It is zero everywhere today and it stays zero. */
const BASELINE_FILE = path.join(HERE, 'touch-targets-baseline.json');
const OCCLUSION_MUST_BE_ZERO = true;

/* Interactive things a thumb is expected to hit. */
const INTERACTIVE = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role="button"],[role="tab"],[role="link"],[role="switch"],[tabindex]:not([tabindex="-1"])';

/* A booking CTA is identified by where it GOES, not by what it is called:
   href survives every markup migration, class names do not. These four are the
   whole affiliate surface — Agoda cid=1965862, Trip.com Allianceid=6861268,
   Klook aid=121442, and Booking through the /go/b worker route to CJ. */
const CTA_HREF = ['/go/b?', 'agoda.com', 'trip.com', 'klook.com', 'booking.com'];

/* --------------------------------------------------------------------------
   1. pick the six pages — by content-collection slug, so the choice stays
   correct as the site grows and never silently degrades to "some html file"
   ----------------------------------------------------------------------- */
function firstExisting(docRoot, candidates) {
  for (const c of candidates) if (c && fs.existsSync(path.join(docRoot, c))) return c;
  return null;
}
function slugsFrom(collection) {
  const d = path.join(ROOT, 'astro', 'src', 'content', collection);
  try { return fs.readdirSync(d).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort(); }
  catch { return []; }
}
function pickPages(docRoot) {
  const pick = (kind, preferred, collection) => {
    const fromPreferred = firstExisting(docRoot, preferred.map(s => s + '.html'));
    if (fromPreferred) return { kind, file: fromPreferred };
    for (const s of slugsFrom(collection)) {
      if (fs.existsSync(path.join(docRoot, s + '.html'))) return { kind, file: s + '.html' };
    }
    return { kind, file: null };
  };
  return [
    /* preferred slugs are just "a well-populated example of this kind" — if one
       is renamed the collection scan below still finds a valid stand-in */
    pick('review', ['review-137-pillars-house-chiang-mai', 'review-the-siam-bangkok'], 'reviews'),
    pick('roundup', ['top10-hotels-chiang-mai', 'top10-hotels-bangkok'], 'roundups'),
    pick('article', ['thailand-7-day-itinerary', 'first-time-thailand'], 'articles'),
    { kind: 'hub', file: firstExisting(docRoot, ['city-krabi.html', 'city-chiang-mai.html', 'city-bangkok.html']) },
    { kind: 'homepage', file: firstExisting(docRoot, ['index.html']) },
    { kind: 'planner', file: firstExisting(docRoot, ['trip.html']) },
  ];
}

/* --------------------------------------------------------------------------
   2. static server — file:// would break every absolute /css/… path
   ----------------------------------------------------------------------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml',
};
function freePort() {
  return new Promise((res, rej) => {
    const s = net.createServer();
    s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); });
    s.on('error', rej);
  });
}
async function serve(docRoot) {
  const port = await freePort();
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';
    let abs = path.join(docRoot, rel);
    /* the site serves clean URLs through worker.js; dist is flat .html */
    if (!fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      if (fs.existsSync(abs + '.html')) abs += '.html';
      else if (fs.existsSync(path.join(abs, 'index.html'))) abs = path.join(abs, 'index.html');
    }
    if (!abs.startsWith(docRoot) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
      res.writeHead(404); res.end('not found'); return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(abs).pipe(res);
  });
  await new Promise(r => server.listen(port, '127.0.0.1', r));
  return { server, base: `http://127.0.0.1:${port}` };
}

/* --------------------------------------------------------------------------
   3. Chrome over CDP, dependency-free
   ----------------------------------------------------------------------- */
function findBrowser() {
  if (process.env.TA_QA_CHROME) return process.env.TA_QA_CHROME;
  const pf = process.env['ProgramFiles'] || 'C:\\Program Files';
  const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
  const local = process.env.LOCALAPPDATA || '';
  const candidates = [
    path.join(pf, 'Google/Chrome/Application/chrome.exe'),
    path.join(pf86, 'Google/Chrome/Application/chrome.exe'),
    local && path.join(local, 'Google/Chrome/Application/chrome.exe'),
    path.join(pf, 'Microsoft/Edge/Application/msedge.exe'),
    path.join(pf86, 'Microsoft/Edge/Application/msedge.exe'),
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);
  return candidates.find(c => { try { return fs.existsSync(c); } catch { return false; } }) || null;
}

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map(); }
  static async attach(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error('websocket open timed out')), 15000);
      ws.addEventListener('open', () => { clearTimeout(t); res(); }, { once: true });
      ws.addEventListener('error', e => { clearTimeout(t); rej(new Error('websocket error')); }, { once: true });
    });
    const c = new CDP(ws);
    ws.addEventListener('message', ev => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.id && c.pending.has(m.id)) {
        const { res, rej } = c.pending.get(m.id); c.pending.delete(m.id);
        m.error ? rej(new Error(m.error.message || JSON.stringify(m.error))) : res(m.result);
      } else if (m.method) {
        for (const h of (c.handlers.get(m.method) || [])) h(m.params, m.sessionId);
      }
    });
    return c;
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); rej(new Error(method + ' timed out')); } }, 40000);
    });
  }
  on(method, fn) { if (!this.handlers.has(method)) this.handlers.set(method, []); this.handlers.get(method).push(fn); return () => {
    this.handlers.set(method, this.handlers.get(method).filter(f => f !== fn)); }; }
  close() { try { this.ws.close(); } catch { } }
}

async function launchChrome(bin) {
  const port = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-qa-chrome-'));
  const child = spawn(bin, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--disable-background-networking', '--disable-sync', '--disable-gpu',
    '--hide-scrollbars',            /* a 15px OS scrollbar is not a layout bug */
    '--force-device-scale-factor=1',
    '--mute-audio', '--no-sandbox', 'about:blank',
  ], { stdio: 'ignore', detached: false });

  const deadline = Date.now() + 30000;
  let version = null;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) { version = await r.json(); break; }
    } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 200));
  }
  if (!version) { try { child.kill(); } catch { } throw new Error(`Chrome did not open a debugging port within 30 s (${bin})`); }
  return { child, profile, version };
}

/* --------------------------------------------------------------------------
   4. the in-page probe — one function, serialised into the page
   ----------------------------------------------------------------------- */
function probeSource(minTarget, interactiveSel, ctaHrefs) {
  return `(() => {
  const MIN = ${minTarget};
  const CTA_HREF = ${JSON.stringify(ctaHrefs)};
  const label = el => {
    const id = el.id ? '#' + el.id : '';
    const cls = (el.getAttribute && el.getAttribute('class') || '').trim().split(/\\s+/).filter(Boolean).slice(0,3).map(c=>'.'+c).join('');
    const txt = (el.innerText || el.value || el.getAttribute?.('aria-label') || '').trim().replace(/\\s+/g,' ').slice(0,42);
    return el.tagName.toLowerCase() + id + cls + (txt ? ' «' + txt + '»' : '');
  };
  const visible = el => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
    if (s.pointerEvents === 'none') return false;
    return true;
  };
  /* effective hit area = element rect grown by any absolutely-positioned
     pseudo-element with negative insets (the .ta-icon-btn::after pattern) */
  const hitRect = el => {
    const r = el.getBoundingClientRect();
    let top = r.top, right = r.right, bottom = r.bottom, left = r.left;
    for (const pe of ['::before','::after']) {
      const s = getComputedStyle(el, pe);
      if (!s || s.content === 'none' || s.position !== 'absolute') continue;
      if (s.pointerEvents === 'none') continue;
      const px = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
      if (s.top !== 'auto') top = Math.min(top, r.top + px(s.top));
      if (s.bottom !== 'auto') bottom = Math.max(bottom, r.bottom - px(s.bottom));
      if (s.left !== 'auto') left = Math.min(left, r.left + px(s.left));
      if (s.right !== 'auto') right = Math.max(right, r.right - px(s.right));
    }
    return { top, right, bottom, left, width: right - left, height: bottom - top };
  };
  const PROSE = 'p,li,dd,dt,blockquote,figcaption,td,th,.ta-prose,.prose,.rv-prose,.art-body';
  const isInlineProseLink = el => {
    if (el.tagName !== 'A') return false;
    const d = getComputedStyle(el).display;
    if (d !== 'inline' && d !== 'inline-block') return false;
    return !!el.closest(PROSE);
  };

  /* 1 — horizontal scroll */
  const vw = document.documentElement.clientWidth;
  const scrollW = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const overflow = [];
  if (scrollW > vw + 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        const s = getComputedStyle(el);
        if (s.position === 'fixed') continue;
        overflow.push({ sel: label(el), right: Math.round(r.right), left: Math.round(r.left), w: Math.round(r.width), ov: s.overflowX });
      }
    }
    overflow.sort((a,b) => b.right - a.right);
  }

  /* 2 — target size */
  const small = [];
  const seen = new Set();
  for (const el of document.querySelectorAll(${JSON.stringify(interactiveSel)})) {
    if (!visible(el) || isInlineProseLink(el)) continue;
    const h = hitRect(el);
    if (Math.min(h.width, h.height) >= MIN - 0.5) continue;
    const k = label(el) + '|' + Math.round(h.width) + 'x' + Math.round(h.height);
    if (seen.has(k)) continue;
    seen.add(k);
    small.push({ sel: label(el), w: Math.round(h.width * 10) / 10, h: Math.round(h.height * 10) / 10,
                 top: Math.round(h.top), inViewport: h.top < innerHeight && h.bottom > 0 });
  }

  /* 3 — booking CTA occlusion */
  const ctas = [...document.querySelectorAll('a[href]')].filter(a => {
    const href = a.getAttribute('href') || '';
    return CTA_HREF.some(p => href.includes(p));
  }).filter(visible);
  const occluded = [];
  for (const a of ctas) {
    const r = a.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) continue;         /* off-screen: scrolled past */
    const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
    const xs = [r.left + r.width * 0.5, r.left + r.width * 0.25, r.left + r.width * 0.75]
      .map(x => Math.min(Math.max(x, 1), vw - 1));
    for (const x of xs) {
      const hit = document.elementFromPoint(x, y);
      if (!hit) continue;
      if (hit === a || a.contains(hit) || hit.contains(a)) continue;
      occluded.push({ cta: label(a), href: (a.getAttribute('href')||'').slice(0,90),
                      at: [Math.round(x), Math.round(y)], blockedBy: label(hit),
                      blockerZ: getComputedStyle(hit).zIndex, blockerPos: getComputedStyle(hit).position });
      break;
    }
  }

  return { vw, scrollW, overflow: overflow.slice(0, 6), small, ctaCount: ctas.length, occluded };
})()`;
}

/* --------------------------------------------------------------------------
   5. run
   ----------------------------------------------------------------------- */
const argRoot = process.argv.slice(2).find(a => !a.startsWith('--'));
const docRoot = path.resolve(argRoot || process.env.TA_QA_DOCROOT
  || (fs.existsSync(path.join(ROOT, 'astro', 'dist', 'index.html'))
    ? path.join(ROOT, 'astro', 'dist')
    : path.join(ROOT, 'astro', 'public')));

console.log('check-touch-targets — no h-scroll · every control ≥ 44px · booking CTA reachable');
console.log(`  doc root: ${path.relative(ROOT, docRoot) || docRoot}`);

if (!fs.existsSync(docRoot)) {
  console.error(`FAIL: doc root does not exist: ${docRoot}`);
  console.error('  Pass one explicitly:  node _internal/qa/check-touch-targets.mjs <dir>');
  process.exit(EXIT);
}

const browser = findBrowser();
if (!browser) {
  const msg = [
    'no Chrome or Edge found — the three mobile gates were NOT measured',
    '  Looked in the standard install locations for chrome.exe / msedge.exe /',
    '  google-chrome / chromium. Set TA_QA_CHROME=<path> to point at one.',
    '  This gate is the only thing that checks horizontal scroll, 44px targets',
    '  and CTA occlusion, so a run without it proves nothing about any of them.',
    '  Set TA_QA_REQUIRE_BROWSER=1 to make this a hard failure (do that in CI).',
  ];
  if (process.env.TA_QA_REQUIRE_BROWSER === '1') {
    console.error('FAIL: ' + msg[0]);
    for (const l of msg.slice(1)) console.error(l);
    process.exit(EXIT);
  }
  console.log('');
  console.log('  NOTE: ' + msg[0]);
  for (const l of msg.slice(1)) console.log('  ' + l);
  console.log('check-touch-targets: SKIPPED (no browser)');
  process.exit(0);
}

const pages = pickPages(docRoot);
const missing = pages.filter(p => !p.file);
if (missing.length) {
  console.error(`FAIL: ${missing.length} of the 6 representative page kinds are absent from ${path.relative(ROOT, docRoot)}`);
  for (const m of missing) console.error(`  ${m.kind}: no candidate file found`);
  console.error('  The gate refuses to report a pass on a subset — a missing page kind is');
  console.error('  an unmeasured page kind. Build first, or point at a doc root that has');
  console.error('  them:  node _internal/qa/check-touch-targets.mjs astro/dist');
  process.exit(EXIT);
}
for (const p of pages) console.log(`  · ${p.kind.padEnd(9)} ${p.file}`);

/* ---- ratchet baseline ---------------------------------------------------- */
const UPDATE_BASELINE = process.argv.includes('--update-baseline');
const ALLOW_GROWTH = process.argv.includes('--allow-growth');
let baseline = {};
if (fs.existsSync(BASELINE_FILE)) {
  try { baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')).pages || {}; }
  catch (e) {
    console.error(`FAIL: ${path.relative(ROOT, BASELINE_FILE)} is not valid JSON — ${e.message}`);
    console.error('  Without it this gate cannot tell a regression from known debt, so it');
    console.error('  refuses to guess. Restore the file from git.');
    process.exit(EXIT);
  }
} else if (!UPDATE_BASELINE) {
  console.log('');
  console.log(`  NOTE: no baseline at ${path.relative(ROOT, BASELINE_FILE)} — every count is`);
  console.log('  being compared against zero. Seed it once with:');
  console.log('    node _internal/qa/check-touch-targets.mjs --update-baseline --allow-growth');
}
const measured = {};

const { server, base } = await serve(docRoot);
let chrome = null, cdp = null;
const failures = [];
const summary = [];

try {
  chrome = await launchChrome(browser);
  console.log(`  · ${chrome.version.Browser} (headless)`);
  cdp = await CDP.attach(chrome.version.webSocketDebuggerUrl);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);

  for (const page of pages) {
    for (const width of WIDTHS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width, height: VIEWPORT_HEIGHT, deviceScaleFactor: 1, mobile: true,
      }, sessionId);
      await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sessionId);

      const loaded = new Promise(res => {
        const off = cdp.on('Page.loadEventFired', (_p, sid) => { if (sid === sessionId) { off(); res(); } });
        setTimeout(() => { off(); res(); }, 25000);
      });
      await cdp.send('Page.navigate', { url: `${base}/${page.file}` }, sessionId);
      await loaded;
      await new Promise(r => setTimeout(r, SETTLE_MS));

      const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
        expression: probeSource(MIN_TARGET, INTERACTIVE, CTA_HREF),
        returnByValue: true, awaitPromise: false,
      }, sessionId);
      if (exceptionDetails) throw new Error(`probe threw on ${page.file} @${width}: ${exceptionDetails.text}`);
      const r = result.value;
      const where = `${page.kind} (${page.file}) @ ${width}px`;
      const key = `${page.kind}@${width}`;
      const bl = baseline[key] || { small: 0, overflow: 0, occluded: 0 };
      measured[key] = { small: r.small.length, overflow: Math.max(0, r.scrollW - r.vw), occluded: r.occluded.length };

      if (r.scrollW > r.vw + 1 && measured[key].overflow > bl.overflow) {
        failures.push({
          gate: 'horizontal scroll', where,
          detail: [
            `  baseline for this page/width allows ${bl.overflow}px; measured ${measured[key].overflow}px.`,
            `  the document is ${r.scrollW}px wide in a ${r.vw}px viewport (${r.scrollW - r.vw}px over).`,
            '  The widest elements sticking out:',
            ...r.overflow.map(o => `    ${o.sel}   right:${o.right}px  width:${o.w}px  overflow-x:${o.ov}`),
            '',
            '  WHAT TO DO: the offender is almost always one of four things —',
            '   · a fixed px width or min-width on a container → use max-inline-size:100%',
            '   · a wide table / <pre> / diagram → wrap it in overflow-x:auto',
            '   · a long unbroken string (a URL, a slug) → overflow-wrap:anywhere',
            '   · a negative margin used to bleed a section full-width → use',
            '     margin-inline:calc(50% - 50vw) with the parent overflow-x:clip',
          ],
        });
      }
      if (r.small.length > bl.small) {
        failures.push({
          gate: `target smaller than ${MIN_TARGET}px`, where,
          detail: [
            `  baseline for this page/width allows ${bl.small}; measured ${r.small.length}.`,
            `  ${r.small.length} interactive control(s) are under ${MIN_TARGET}px on the short side.`,
            '  (Inline links inside prose are exempt and not counted. Hit area',
            '   already includes an absolutely-positioned ::before/::after.)',
            '',
            ...r.small.slice(0, 15).map(s => `    ${s.w}×${s.h}px   ${s.sel}${s.inViewport ? '' : '   [below the fold]'}`),
            ...(r.small.length > 15 ? [`    … and ${r.small.length - 15} more`] : []),
            '',
            '  WHAT TO DO (§3.6): min-block-size:44px + min-inline-size:44px +',
            '  display:inline-flex + align-items:center — NEVER a fixed height,',
            '  which clips Thai and Arabic ascenders. For an icon-only button keep',
            '  the visual size and extend the hit area instead:',
            '    .ta-icon-btn{position:relative}',
            '    .ta-icon-btn::after{content:"";position:absolute;inset:-10px}',
          ],
        });
      }
      if (r.occluded.length > (OCCLUSION_MUST_BE_ZERO ? 0 : bl.occluded)) {
        failures.push({
          gate: 'booking CTA occluded', where,
          detail: [
            '  NOT RATCHETED: an occluded booking CTA is a hard zero, always.',
            `  ${r.occluded.length} of ${r.ctaCount} booking CTA(s) do not receive the tap at their own centre.`,
            '  This is revenue: the tap lands on whatever is listed as blocked-by.',
            '',
            ...r.occluded.slice(0, 8).flatMap(o => [
              `    CTA      ${o.cta}`,
              `    href     ${o.href}`,
              `    at       (${o.at[0]}, ${o.at[1]})  →  hits  ${o.blockedBy}`,
              `    blocker  position:${o.blockerPos}  z-index:${o.blockerZ}`,
              '',
            ]),
            '  WHAT TO DO (§4.3 bottom-edge contract): one fixed element owns the',
            '  bottom edge per page. Give the blocker its budgeted layer instead of',
            '  inventing a bigger z-index —',
            '    --z-tabbar:70 · --z-cta:60 · --z-toast:80 · --z-header:700 · --z-popover:900',
            '  On review pages .ta-cta owns the edge and .ta-tabbar/.ta-tripfab are',
            '  display:none. If the blocker is a decorative overlay, the fix is',
            '  pointer-events:none, not a z-index war.',
          ],
        });
      }
      summary.push({ key, where, ctas: r.ctaCount, small: r.small.length, ov: r.scrollW - r.vw, occ: r.occluded.length });
    }
    process.stdout.write(`  ✓ measured ${page.kind}\n`);
  }
} catch (e) {
  failures.push({ gate: 'harness', where: 'driver', detail: [`  ${e.message}`,
    '  The gate could not complete, so it proves nothing. Re-run; if it keeps',
    '  failing, set TA_QA_CHROME to a known-good Chrome and try again.'] });
} finally {
  try { cdp && cdp.close(); } catch { }
  try { chrome && chrome.child.kill(); } catch { }
  if (!process.argv.includes('--keep')) server.close();
  try { chrome && fs.rmSync(chrome.profile, { recursive: true, force: true }); } catch { }
}

console.log('');
console.log('  page                                                    CTAs  <44px  h-ovf  occluded  vs baseline');
for (const s of summary) {
  const b = baseline[s.key] || { small: 0, overflow: 0, occluded: 0 };
  const d = s.small - b.small;
  const trend = d === 0 ? '=' : (d > 0 ? `+${d} WORSE` : `${d} better`);
  console.log(`  ${s.where.padEnd(54)}${String(s.ctas).padStart(5)}${String(s.small).padStart(7)}${String(s.ov > 0 ? s.ov : 0).padStart(7)}${String(s.occ).padStart(10)}  ${trend}`);
}

/* improvements are worth saying out loud: an un-tightened baseline is how a
   gate quietly stops guarding the ground it already won */
const improved = summary.filter(s => {
  const b = baseline[s.key]; return b && (s.small < b.small || (s.ov > 0 ? s.ov : 0) < b.overflow);
});
if (improved.length && !UPDATE_BASELINE) {
  console.log('');
  console.log(`  NOTE: ${improved.length} page/width combination(s) are now BETTER than the baseline.`);
  console.log('  Lock the improvement in, or the next regression back to the old number');
  console.log('  will pass unnoticed:');
  console.log('    node _internal/qa/check-touch-targets.mjs --update-baseline');
}

if (UPDATE_BASELINE) {
  const grew = Object.entries(measured).filter(([k, m]) => {
    const b = baseline[k]; return b && (m.small > b.small || m.overflow > b.overflow || m.occluded > b.occluded);
  });
  if (grew.length && !ALLOW_GROWTH) {
    console.error('');
    console.error(`REFUSING to write the baseline: ${grew.length} entr${grew.length === 1 ? 'y' : 'ies'} would GROW.`);
    for (const [k, m] of grew) console.error(`  ${k}: small ${baseline[k].small}→${m.small}  ovf ${baseline[k].overflow}→${m.overflow}  occ ${baseline[k].occluded}→${m.occluded}`);
    console.error('Recording a regression as "expected" is the one thing this file must never');
    console.error('be used for. Fix the page, or re-run with --allow-growth and say why in');
    console.error('the commit message.');
    process.exit(EXIT);
  }
  fs.writeFileSync(BASELINE_FILE, JSON.stringify({
    _comment: [
      'Ratchet baseline for check-touch-targets.mjs.',
      'Per page-kind and viewport width: how many interactive controls are under 44px,',
      'how many px of horizontal overflow, how many occluded booking CTAs. The gate',
      'fails when a number GROWS. Occlusion is not really ratcheted — it is a hard zero',
      'in the gate regardless of what is written here.',
      'These numbers describe the site as it is mid-rollout, not as it should be. The',
      'correct end state is all zeroes. Shrink after each page moves onto the shell:',
      '  node _internal/qa/check-touch-targets.mjs --update-baseline',
    ],
    generated: new Date().toISOString().slice(0, 10),
    docRoot: path.relative(ROOT, docRoot).replace(/\\/g, '/'),
    widths: WIDTHS,
    pages: measured,
  }, null, 2) + '\n');
  console.log(`  → wrote ${path.relative(ROOT, BASELINE_FILE)} (${Object.keys(measured).length} page/width entries)`);
}

if (failures.length) {
  console.error('');
  console.error('─'.repeat(78));
  for (const f of failures) {
    console.error(`FAIL [${f.gate}] — ${f.where}`);
    for (const l of f.detail) console.error(l);
    console.error('');
  }
  console.error('─'.repeat(78));
  console.error(`check-touch-targets: ${failures.length} FAILURE(S) across ${pages.length} pages × ${WIDTHS.join('/')}px.`);
  process.exit(EXIT);
}
console.log('check-touch-targets: ALL PASS');
