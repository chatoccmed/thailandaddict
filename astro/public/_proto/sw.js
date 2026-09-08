/* =============================================================================
   Thailandaddict — PROTOTYPE service worker.  Blueprint §4.10.
   Scope: /_proto/ ONLY.  It lives at /_proto/sw.js, so the browser refuses it
   any wider scope, and every navigation to the other ~18,000 pages of the site
   is never even offered to this worker.
   -----------------------------------------------------------------------------
   Design rules this file is required to keep:
     · NetworkFirst for HTML with a 3 s timeout — never serve stale HTML by
       default across an 18k-page site.
     · CacheFirst for the shell (one hashed CSS + one hashed JS) and images.
     · Image cache capped at 400 entries — a traveller browsing 300 hotels must
       not silently fill their phone.
     · /api/*, /go/* and every cross-origin request: never touched.
     · Cache names versioned atomically from shell-manifest.v, so a mismatched
       CSS/JS pair is impossible.
     · Kill switch, BOTH layers, shipped day one (see §KILL below).
   Delete /_proto/ and this worker is gone with it — but a worker already
   installed on a device outlives the files, which is exactly why the kill
   switch is layer one and not an afterthought.
   ========================================================================== */

'use strict';

/* --- version ------------------------------------------------------------- */
/* astro/src/data/shell-manifest.json → "v". Bump the shell, bump every cache
   in one step; a half-updated CSS/JS pair cannot exist. */
const SHELL_V = '2d6a944e';
const NS = 'ta-proto';
const C_SHELL = NS + '-shell-' + SHELL_V;
const C_PAGES = NS + '-pages-' + SHELL_V;
const C_IMGS = NS + '-img-' + SHELL_V;
const MINE = [C_SHELL, C_PAGES, C_IMGS];

const SCOPE_PATH = new URL(self.registration.scope).pathname;   /* '/_proto/'  */
const HTML_TIMEOUT_MS = 3000;
const IMG_CAP = 400;
const PAGE_CAP = 60;

const OFFLINE_URL = SCOPE_PATH + 'offline';

/* The shell is two hashed files plus the prototype's own icons. Document paths
   are absolute because the worker's base URL is /_proto/, not the page's. */
const PRECACHE = [
  '/css/shell.1207a1be.css',
  '/js/shell.2029c422.js',
  SCOPE_PATH + 'offline',
  SCOPE_PATH + 'index',
  SCOPE_PATH + 'manifest.webmanifest',
  SCOPE_PATH + 'icons/icon-192.png',
  SCOPE_PATH + 'icons/icon.svg'
];

/* --- KILL SWITCH, layer 1 -------------------------------------------------
   Both files are polled with cache:'no-store'. Either one answering with the
   word "kill" tears the worker down completely: every cache deleted, the
   registration unregistered, every open client renavigated to live network.
   /_proto/sw-kill.txt  ships with the prototype and dies with it.
   /sw-kill.txt         is the site-wide switch named in blueprint §4.10, so
                        one file at the root can stop every TA worker at once.
   A 404, an offline device or any non-"kill" body means: keep running. The
   switch can only ever turn the worker OFF, never on.
   Layer 2 is the file swap: publish /_proto/sw-kill.js over /_proto/sw.js
   (or register it) and the next update installs a worker whose only job is to
   delete itself. Layer 2 works even if this file's logic is what is broken.
   -------------------------------------------------------------------------- */
const KILL_URLS = [SCOPE_PATH + 'sw-kill.txt', '/sw-kill.txt'];

async function killRequested() {
  for (const u of KILL_URLS) {
    try {
      const r = await fetch(u, { cache: 'no-store', credentials: 'omit' });
      if (!r || !r.ok) continue;
      const t = (await r.text()).trim().toLowerCase();
      if (t === 'kill') return true;
    } catch (e) { /* offline or absent → not a kill */ }
  }
  return false;
}

async function selfDestruct() {
  const names = await caches.keys();
  await Promise.all(names.filter(n => n.startsWith(NS)).map(n => caches.delete(n)));
  try { await self.registration.unregister(); } catch (e) { }
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const c of clients) {
    try { c.navigate(c.url); } catch (e) { try { c.postMessage({ type: 'ta-sw-killed' }); } catch (e2) { } }
  }
}

/* --- install --------------------------------------------------------------- */
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(C_SHELL);
    /* addAll is all-or-nothing; one 404 would leave the prototype with no
       offline shell at all, so each entry is allowed to fail on its own. */
    await Promise.all(PRECACHE.map(async u => {
      try {
        const res = await fetch(u, { cache: 'reload', credentials: 'same-origin' });
        if (res && res.ok) await cache.put(u, res);
      } catch (e) { }
    }));
    await self.skipWaiting();
  })());
});

/* --- activate -------------------------------------------------------------- */
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (await killRequested()) { await selfDestruct(); return; }

    /* navigationPreload recovers 50–200 ms of worker boot on every navigation.
       Feature-checked: Safari has no such thing. */
    try {
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    } catch (e) { }

    const names = await caches.keys();
    await Promise.all(
      names.filter(n => n.startsWith(NS) && MINE.indexOf(n) === -1).map(n => caches.delete(n))
    );
    await self.clients.claim();
  })());
});

/* --- messages -------------------------------------------------------------- */
self.addEventListener('message', event => {
  const d = event.data || {};
  if (d.type === 'ta-sw-check-kill') {
    event.waitUntil((async () => { if (await killRequested()) await selfDestruct(); })());
  }
  if (d.type === 'ta-sw-kill-now') {
    event.waitUntil(selfDestruct());
  }
  if (d.type === 'ta-sw-clear') {
    event.waitUntil((async () => {
      const names = await caches.keys();
      await Promise.all(names.filter(n => n.startsWith(NS)).map(n => caches.delete(n)));
    })());
  }
});

/* --- helpers --------------------------------------------------------------- */
async function trim(cacheName, cap) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  /* Cache keys come back in insertion order, so the front of the list is the
     oldest entry — a FIFO trim, not an LRU. Honest about what it is. */
  for (let i = 0; i < keys.length - cap; i++) await cache.delete(keys[i]);
}

function isShellAsset(url) {
  return /^\/(css|js)\/shell\.[0-9a-f]{8}\.(css|js)$/.test(url.pathname)
    || /^\/fonts\//.test(url.pathname)
    || url.pathname.indexOf(SCOPE_PATH + 'icons/') === 0;
}

function isImage(req, url) {
  return req.destination === 'image'
    || /\.(?:avif|webp|jpe?g|png|gif|svg)$/i.test(url.pathname);
}

/* NetworkFirst with a hard 3 s ceiling. The race is against a timer, not
   against the cache, so a slow-but-alive network still wins if it answers in
   time and the reader never sees stale HTML on a good connection. */
async function htmlNetworkFirst(event) {
  const req = event.request;
  const cache = await caches.open(C_PAGES);

  const preload = event.preloadResponse ? await event.preloadResponse.catch(() => null) : null;
  if (preload) {
    try { await cache.put(req, preload.clone()); await trim(C_PAGES, PAGE_CAP); } catch (e) { }
    return preload;
  }

  let timer;
  const timeout = new Promise(res => { timer = setTimeout(() => res(null), HTML_TIMEOUT_MS); });

  const network = fetch(req).then(res => {
    if (res && res.ok && res.type === 'basic') {
      cache.put(req, res.clone()).then(() => trim(C_PAGES, PAGE_CAP)).catch(() => { });
    }
    return res;
  }).catch(() => null);

  const first = await Promise.race([network, timeout]);
  clearTimeout(timer);
  if (first) return first;

  const cached = await cache.match(req, { ignoreSearch: true });
  if (cached) return cached;

  /* No cached copy either. Give the network a short grace period — but a
     BOUNDED one. Awaiting the original promise here would hang forever on a
     connection that accepts and never answers (captive portal, dead cell),
     which is the exact failure the 3 s ceiling exists to prevent. */
  let graceTimer;
  const grace = new Promise(res => { graceTimer = setTimeout(() => res(null), 1500); });
  const late = await Promise.race([network, grace]);
  clearTimeout(graceTimer);
  if (late) return late;

  const shell = await caches.open(C_SHELL);
  return (await shell.match(OFFLINE_URL)) || new Response(
    '<!doctype html><meta charset="utf-8"><title>ออฟไลน์</title><p>ออฟไลน์ — ลองใหม่อีกครั้ง',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

async function cacheFirst(req, cacheName, cap) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  /* Only same-origin, genuinely-OK responses are stored. An opaque
     cross-origin response costs ~7 MB of quota padding and can never be
     inspected, so it is passed through and forgotten. */
  if (res && res.ok && res.type === 'basic') {
    cache.put(req, res.clone()).then(() => { if (cap) trim(cacheName, cap); }).catch(() => { });
  }
  return res;
}

/* --- fetch ----------------------------------------------------------------- */
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  /* Cross-origin (R2 photos, fonts on another host): never touched. */
  if (url.origin !== self.location.origin) return;

  /* Never touched, ever: worker routes and affiliate redirects. Caching a
     /go/ redirect would break click attribution and cost real revenue. */
  if (url.pathname.indexOf('/api/') === 0 || url.pathname.indexOf('/go/') === 0) return;

  /* The kill files must always be read live. */
  if (/(^|\/)sw-kill\.(txt|js)$/.test(url.pathname)) return;

  const isNav = req.mode === 'navigate';

  /* HARD SCOPE GUARD. The browser already refuses to route out-of-scope
     navigations here, but a prototype worker that could ever answer for a live
     page is not a risk worth relying on a browser rule to prevent. */
  if (isNav && url.pathname.indexOf(SCOPE_PATH) !== 0) return;

  if (isNav || (req.destination === 'document')) {
    event.respondWith(htmlNetworkFirst(event));
    return;
  }

  if (isShellAsset(url)) {
    event.respondWith(cacheFirst(req, C_SHELL, 0).catch(() => caches.match(req)));
    return;
  }

  if (isImage(req, url)) {
    event.respondWith(cacheFirst(req, C_IMGS, IMG_CAP).catch(() => caches.match(req)));
    return;
  }

  /* Everything else same-origin (JSON, manifest): stale-while-revalidate is
     tempting and wrong here — this prototype has no data endpoints worth the
     staleness risk, so it just goes to the network. */
});
