/* =============================================================================
   KILL SWITCH — LAYER 2.  Blueprint §4.10, "sw-kill.js as a one-file swap".

   Layer 1 lives inside sw.js: on activate it polls /_proto/sw-kill.txt and
   /sw-kill.txt and tears itself down if either says "kill". Layer 1 depends on
   sw.js still working.

   Layer 2 does not. If sw.js is what is broken, publish THIS file's contents
   over /_proto/sw.js (one file, one deploy, ~30 seconds). Every device that
   already has the prototype worker installed fetches the new /_proto/sw.js on
   its next update check, installs this instead, and this worker's only job is
   to delete every prototype cache, unregister itself and put the reader back
   on the live network.

   It never calls addEventListener('fetch'), so from the moment it activates
   there is no interception at all — not even a pass-through.
   ========================================================================== */

'use strict';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.indexOf('ta-proto') === 0).map(n => caches.delete(n)));
    try { await self.registration.unregister(); } catch (e) { }
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const c of clients) {
      try { c.navigate(c.url); } catch (e) { try { c.postMessage({ type: 'ta-sw-killed' }); } catch (e2) { } }
    }
  })());
});
