/* =============================================================================
   sheet.js — the ONE sheet controller
   Blueprint §4.5

   Opens and closes <dialog class="ta-sheet">. The dialog element already
   gives us the browser top layer, ::backdrop, a focus trap and Esc for free,
   so this file exists for exactly one reason:

       THE CLOSE-REQUEST CHAIN.  CloseWatcher -> navigation.intercept ->
       history.pushState/popstate.

   On Android an open filter sheet must swallow the back gesture, not
   navigate the user off the page. Three tiers, best first:

     1. CloseWatcher            Chromium 120+. Modal <dialog> is already wired
                                into the platform close-request machinery, so
                                Esc and the back gesture both arrive as a
                                `cancel` event and we must NOT also push a
                                history entry — that would need two backs.
     2. navigation.intercept    Navigation API without CloseWatcher: push a
                                sheet entry, then intercept the traverse back
                                to it so the sheet closes without a real
                                document navigation.
     3. history.pushState       Everyone else, including Safari and Firefox.
                                Push on open, popstate closes, and closing by
                                any other means unwinds the entry.

   Focus is restored to the element that opened the sheet, always.
   ========================================================================== */

(function () {
  'use strict';

  var W = window;
  var D = document;
  var TA = W.TA || (W.TA = {});

  var HAS_CLOSE_WATCHER = typeof W.CloseWatcher === 'function';
  var HAS_NAV_INTERCEPT = !!(W.navigation && typeof W.navigation.addEventListener === 'function');

  /* Open sheets, innermost last. */
  var stack = [];
  /* dialog -> { opener, token, watcher, modal } */
  var meta = new WeakMap();
  /* Set while we are unwinding our own history entry, so popstate does not
     re-enter close() and start a loop. */
  var unwinding = false;

  function token() { return 'ta-sheet-' + Math.random().toString(36).slice(2, 9); }

  function top() { return stack.length ? stack[stack.length - 1] : null; }

  function focusable(dlg) {
    return dlg.querySelector(
      '[autofocus], button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]),' +
      ' select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  /* ------------------------------------------------------------------------
     OPEN
     opts: { modal:true }  — the planner map sheet passes modal:false so the
     map behind it stays interactive (§6.2 S2).
     --------------------------------------------------------------------- */
  function open(dlg, opener, opts) {
    if (typeof dlg === 'string') dlg = D.getElementById(dlg);
    if (!dlg || dlg.open) return null;
    opts = opts || {};
    var modal = opts.modal !== false;

    var info = {
      opener: opener || (D.activeElement instanceof HTMLElement ? D.activeElement : null),
      token: null,
      watcher: null,
      modal: modal
    };

    try {
      if (modal && typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.show();
    } catch (e) {
      /* Already open in another tree, or not a <dialog>. Fail visibly, not
         silently — a sheet that never appears is worse than an error. */
      if (TA.toast) TA.toast('Sheet could not open');
      return null;
    }

    /* --- Tier 1: CloseWatcher ------------------------------------------- */
    if (HAS_CLOSE_WATCHER && !modal) {
      /* A non-modal dialog is NOT wired into the platform close-request
         machinery, so it needs its own watcher to catch Esc and back. */
      try {
        info.watcher = new W.CloseWatcher();
        info.watcher.onclose = function () { close(dlg, 'closewatcher'); };
      } catch (e) { info.watcher = null; }
    }

    /* --- Tiers 2 and 3: a history entry to spend on the back gesture ----- */
    if (!HAS_CLOSE_WATCHER) {
      info.token = token();
      try {
        history.pushState({ taSheet: info.token }, '', location.href);
      } catch (e) { info.token = null; }
    }

    meta.set(dlg, info);
    stack.push(dlg);
    D.documentElement.setAttribute('data-sheet-open', '');

    var f = focusable(dlg);
    if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }

    dlg.dispatchEvent(new CustomEvent('ta:sheet-open', { bubbles: true }));
    return dlg;
  }

  /* ------------------------------------------------------------------------
     CLOSE
     reason: 'button' | 'backdrop' | 'cancel' | 'popstate' | 'closewatcher'
     --------------------------------------------------------------------- */
  function close(dlg, reason) {
    if (typeof dlg === 'string') dlg = D.getElementById(dlg);
    if (!dlg) dlg = top();
    if (!dlg || !dlg.open) return false;

    var info = meta.get(dlg) || {};
    meta.delete(dlg);

    var i = stack.indexOf(dlg);
    if (i > -1) stack.splice(i, 1);
    if (!stack.length) D.documentElement.removeAttribute('data-sheet-open');

    if (info.watcher) { try { info.watcher.destroy(); } catch (e) { } }

    try { dlg.close(); } catch (e) { }

    /* Spend the history entry we pushed, unless the pop is what closed us. */
    if (info.token && reason !== 'popstate' && !unwinding) {
      var st = history.state;
      if (st && st.taSheet === info.token) {
        unwinding = true;
        try { history.back(); } catch (e) { unwinding = false; }
        W.setTimeout(function () { unwinding = false; }, 400);
      }
    }

    if (info.opener && D.contains(info.opener)) {
      try { info.opener.focus({ preventScroll: true }); } catch (e) { info.opener.focus(); }
    }

    dlg.dispatchEvent(new CustomEvent('ta:sheet-close', { bubbles: true, detail: { reason: reason || 'api' } }));
    return true;
  }

  function toggle(dlg, opener, opts) {
    if (typeof dlg === 'string') dlg = D.getElementById(dlg);
    if (!dlg) return null;
    return dlg.open ? (close(dlg, 'toggle'), null) : open(dlg, opener, opts);
  }

  /* ------------------------------------------------------------------------
     PLATFORM WIRING
     --------------------------------------------------------------------- */

  /* Esc on a modal <dialog> fires `cancel`. Route it through close() so the
     history entry unwinds and focus is restored the same way every time. */
  D.addEventListener('cancel', function (ev) {
    var dlg = ev.target;
    if (!dlg || !dlg.matches || !dlg.matches('dialog')) return;
    ev.preventDefault();
    close(dlg, 'cancel');
  }, true);

  /* Escape fallback — tier 0, because the platform is not guaranteed here.
     A modal <dialog> normally turns Esc into a `cancel` event, and a
     CloseWatcher does the same for a non-modal one. Neither is guaranteed:
       - a non-modal sheet in a browser without CloseWatcher gets nothing;
       - the close request was measured NOT firing at all in one environment,
         with a trusted Escape keydown reaching the document and no `cancel`
         following it, leaving the sheet stuck open with the page scroll
         locked behind it.
     close() is idempotent — it returns early once the dialog is closed — so
     this can never double-fire against the UA's own handling, whichever
     lands first. We do not preventDefault: if the UA still wants to run its
     close request afterwards, it is welcome to. */
  D.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || ev.defaultPrevented) return;
    var dlg = top();
    if (!dlg || !dlg.open) return;
    close(dlg, 'escape');
  });

  /* Light dismiss: a click that lands on the dialog box itself is a click on
     the backdrop, because the sheet's own content fills its padding box. */
  D.addEventListener('click', function (ev) {
    var dlg = ev.target;
    if (!dlg || dlg.tagName !== 'DIALOG' || !dlg.open) return;
    if (dlg.hasAttribute('data-no-light-dismiss')) return;
    var r = dlg.getBoundingClientRect();
    var inside = ev.clientY >= r.top && ev.clientY <= r.bottom &&
      ev.clientX >= r.left && ev.clientX <= r.right;
    if (!inside) close(dlg, 'backdrop');
  });

  /* --- Tier 2: Navigation API ------------------------------------------- */
  if (!HAS_CLOSE_WATCHER && HAS_NAV_INTERCEPT) {
    W.navigation.addEventListener('navigate', function (ev) {
      var dlg = top();
      if (!dlg) return;
      if (ev.navigationType !== 'traverse') return;
      if (!ev.canIntercept || ev.hashChange || ev.downloadRequest !== null) return;
      /* The user pressed back with a sheet open: consume it by closing the
         sheet instead of leaving the page. */
      ev.intercept({
        handler: function () {
          unwinding = true;
          close(dlg, 'popstate');
          unwinding = false;
          return Promise.resolve();
        }
      });
    });
  }

  /* --- Tier 3: popstate -------------------------------------------------- */
  W.addEventListener('popstate', function () {
    var dlg = top();
    if (!dlg) return;
    var info = meta.get(dlg);
    if (!info || !info.token) return;
    var st = history.state;
    if (st && st.taSheet === info.token) return;   /* still on our entry */
    close(dlg, 'popstate');
  });

  /* ------------------------------------------------------------------------
     PUBLIC API — shell.js delegates [data-sheet] and [data-sheet-close] here
     --------------------------------------------------------------------- */
  TA.sheet = {
    open: open,
    close: close,
    toggle: toggle,
    current: top,
    isOpen: function (dlg) {
      if (typeof dlg === 'string') dlg = D.getElementById(dlg);
      return !!(dlg && dlg.open);
    }
  };

})();
