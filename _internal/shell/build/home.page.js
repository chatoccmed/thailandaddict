/* Page script. One delegated listener, no inline on* handlers anywhere — that
   is what fixes INP and what moves the site toward a strict script-src CSP.
   shell.js is still the ONLY writer of localStorage: everything below goes
   through the public TA.* API and never touches a storage key. */
document.addEventListener('DOMContentLoaded', function () {
  var TA = window.TA, H = window.TA_HOME;
  if (!TA || !H) return;
  var D = document, C = H.copy;
  var R2 = 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/';
  var fmt = function (s, map) {
    return String(s).replace(/%[a-z]+/g, function (k) { return (k in map) ? map[k] : k; });
  };
  /* A saved record's img may already be a fully-qualified URL (every data-img
     this page writes is, so the thumbnail survives on /trip in production where
     images/hotels|food|cm|gallery are R2-only). Pass those through untouched;
     only bare keys get the R2 prefix. */
  var img = function (p) {
    if (!p) return '';
    p = String(p);
    return /^(?:https?:)?\/\//.test(p) ? p : (R2 + p.replace(/^\//, ''));
  };
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || D).querySelectorAll(s)); };

  /* Read live, not once: the OS preference can flip mid-session and a cached
     boolean would keep animating for someone who just turned motion off. */
  var reduceMotion = function () {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  /* ── seed the POI cache from this page's own markup ─────────────────────
     so anything saved here resolves to a real name, photo and coordinates on
     /trip and /saved too — not an orphan id. */
  TA.poi.putAll($$('[data-save]').map(function (b) {
    var lat = parseFloat(b.getAttribute('data-lat')), lng = parseFloat(b.getAttribute('data-lng'));
    return {
      id: b.getAttribute('data-poi-id') || b.getAttribute('data-id'),
      name: b.getAttribute('data-name') || '',
      url: b.getAttribute('data-url') || '',
      img: b.getAttribute('data-img') || '',
      kind: b.getAttribute('data-kind') || '',
      province: b.getAttribute('data-province') || '',
      durMin: parseInt(b.getAttribute('data-dur'), 10) || null,
      lat: isNaN(lat) ? null : lat, lng: isNaN(lng) ? null : lng
    };
  }));

  /* ══════════════════════ 1 · THE DECK ═════════════════════════════════ */
  var deckTabs = $$('[data-deck-tab]');
  var planSel = $('[data-plan-dest]');

  /* ── the fold showcase follows the destination ───────────────────────────
     The default panel's rows are already in the HTML (so the block is whole
     with scripting off); this swaps in another panel's rows from TA_HOME.fold,
     which was rendered at build time from the same content files. No fetch, no
     second set of facts, and nothing here writes storage. */
  var showLead = null, showRail = $('[data-show-rail]'), showLabel = $('[data-show-label]');
  var showBox = $('[data-foldshow]');
  if (showBox) showLead = $('.ta-fshow-lead', showBox);

  function renderShow(slug) {
    var f = H.fold && H.fold[slug];
    if (!f || !showBox || !showRail) return;
    if (showLead) {
      showLead.outerHTML = f.lead;
      showLead = $('.ta-fshow-lead', showBox);
    }
    showRail.innerHTML = f.rail;
    if (showLabel && C.showLabel) showLabel.textContent = fmt(C.showLabel, { '%p': f.name });
    showRail.scrollLeft = 0;
  }

  function selectPanel(slug, push) {
    var found = false;
    deckTabs.forEach(function (a) {
      var on = a.getAttribute('data-deck-tab') === slug;
      if (on) found = true;
      a.setAttribute('aria-selected', on ? 'true' : 'false');
      var p = D.getElementById('deck-' + a.getAttribute('data-deck-tab'));
      if (p) p.hidden = !on;
    });
    if (!found) return;
    /* The one place the two halves of the page are wired together. */
    if (planSel) {
      var opt = $$('option[data-hub="' + slug + '"]', planSel)[0];
      if (opt) { planSel.value = opt.value; refreshSubmit(); }
    }
    renderShow(slug);
    if (push && history.replaceState) history.replaceState(null, '', '#deck-' + slug);
    syncAddControls();
  }

  /* The reverse wiring: picking a destination in the planner moves the deck
     and the showcase to it when that destination has a panel. Without this the
     select could say เชียงใหม่ while the photograph below it was still กระบี่. */
  function syncFromSelect() {
    var opt = currentOpt();
    if (!opt) return;
    var hub = opt.getAttribute('data-hub');
    if (hub && H.fold && H.fold[hub] && D.getElementById('deck-' + hub)) selectPanel(hub, false);
  }

  /* ══════════════════════ 2 · ONE ADD MECHANIC, DAY-SCOPED ═════════════
     shell.js checks [data-save] BEFORE [data-add-day] and returns, so a button
     carrying both would silently never add to a day. Instead there is exactly
     one control per card and this swaps which hook it carries. */
  var addTarget = 'saves';

  function tripDays() { return (TA.trip.get().days || []); }

  function renderDayStrip() {
    var strip = $('[data-day-strip]');
    if (!strip) return;
    var days = tripDays();
    var html = '';
    for (var i = 0; i < days.length; i++) {
      html += '<button role="tab" type="button" aria-selected="false" data-add-target="' + days[i].id + '">'
        + (days[i].label || fmt(C.dayN, { '%n': i + 1 })) + '</button>';
    }
    html += '<button role="tab" type="button" aria-selected="false" data-add-target="saves">' + C.savedList + '</button>';
    strip.innerHTML = html;
    if (!days.length) addTarget = 'saves';
    if (addTarget !== 'saves' && !days.some(function (d) { return d.id === addTarget; })) addTarget = 'saves';
    if (addTarget === 'saves' && days.length) addTarget = days[0].id;
    $$('[data-add-target]', strip).forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-add-target') === addTarget ? 'true' : 'false');
    });
    var lbl = $('.ta-deck-strip-label');
    if (lbl) {
      var cur = days.filter(function (d) { return d.id === addTarget; })[0];
      lbl.textContent = lbl.getAttribute('data-base') || lbl.textContent;
      if (!lbl.getAttribute('data-base')) lbl.setAttribute('data-base', lbl.textContent);
    }
  }

  function syncAddControls() {
    var toDay = addTarget !== 'saves';
    var days = tripDays();
    var idx = 0;
    for (var i = 0; i < days.length; i++) if (days[i].id === addTarget) idx = i + 1;
    $$('.ta-save').forEach(function (b) {
      var id = b.getAttribute('data-poi-id') || b.getAttribute('data-id');
      var off = $('.ta-save-off', b);
      if (toDay) {
        b.removeAttribute('data-save');
        b.setAttribute('data-add-day', addTarget);
        if (off) off.textContent = fmt(C.addDay, { '%n': idx });
        b.setAttribute('aria-pressed', TA.trip.hasPoi(id) ? 'true' : 'false');
      } else {
        b.removeAttribute('data-add-day');
        b.setAttribute('data-save', '');
        if (off) off.textContent = C.saveOff;
        b.setAttribute('aria-pressed', TA.saves.has(id) || TA.trip.hasPoi(id) ? 'true' : 'false');
      }
    });
    if (!toDay && TA.nav && TA.nav.syncSaves) TA.nav.syncSaves();
  }

  /* ══════════════════════ 3 · THE PLANNER ══════════════════════════════ */
  function currentTier() {
    var r = $('[data-plan-nights] input:checked');
    return r ? r.getAttribute('data-tier') : '3d2n';
  }
  function currentOpt() {
    if (!planSel || !planSel.value) return null;
    return planSel.options[planSel.selectedIndex] || null;
  }
  function tierHref(opt, tier) {
    if (!opt) return null;
    if (tier === '1-day') return opt.getAttribute('data-p1');
    if (tier === '2d1n') return opt.getAttribute('data-p2');
    return opt.getAttribute('data-p3');
  }
  function refreshSubmit() {
    var btn = $('[data-plan-submit]'), miss = $('[data-plan-miss]');
    if (!btn) return;
    var opt = currentOpt(), tier = currentTier();
    if (!opt) { btn.textContent = C.submit; if (miss) miss.hidden = true; return; }
    var name = opt.textContent;
    var has = tierHref(opt, tier);
    if (tier === '4plus' || !has) {
      /* Never silently lie about a length we do not have. Say which lengths
         exist, and relabel the button to what it will actually do. */
      var got = [];
      if (opt.getAttribute('data-p1')) got.push(C.tier['1-day']);
      if (opt.getAttribute('data-p2')) got.push(C.tier['2d1n']);
      got.push(C.tier['3d2n']);
      if (miss) { miss.hidden = false; miss.textContent = fmt(C.missTier, { '%h': got.join(' · ') }); }
      btn.textContent = C.missBtn;
    } else {
      if (miss) miss.hidden = true;
      btn.textContent = fmt(C.submitFor, { '%d': name, '%t': C.tier[tier] });
    }
  }

  /* ── the in-place answer ─────────────────────────────────────────────── */
  var deckBox = $('[data-plan-deck]');
  var current = null;

  function minutes(hhmm) {
    var m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || ''));
    return m ? (+m[1] * 60 + +m[2]) : null;
  }
  function gapText(a, b) {
    var x = minutes(a), y = minutes(b);
    if (x === null || y === null || y <= x) return null;
    var g = y - x, h = Math.floor(g / 60), mm = g % 60;
    return (h ? h + C.hr + (mm ? ' ' : '') : '') + (mm ? mm + C.min : '');
  }

  function renderPlan(key, destName) {
    var plan = H.plans[key];
    if (!plan || !deckBox) return false;
    current = { key: key, plan: plan, dest: destName };

    var html = '<div class="ta-plan-deck-head">'
      + '<h3>' + esc(plan.title) + '</h3>'
      + '<button class="ta-btn ta-btn-ghost" type="button" data-plan-clear>' + esc(C.restart) + '</button>'
      + '</div>';

    for (var d = 0; d < plan.days.length; d++) {
      var day = plan.days[d], items = day.items || [];
      var first = items.length ? items[0].t : '', last = items.length ? items[items.length - 1].t : '';
      html += '<section class="ta-day"><header class="ta-day-head">'
        + '<h4 class="ta-day-title">' + esc(day.label) + '</h4>'
        + (day.title ? '<span class="ta-chip">' + esc(day.title) + '</span>' : '')
        + '<p class="ta-day-roll">' + esc(fmt(C.roll, { '%n': items.length, '%a': first, '%b': last })) + '</p>'
        + '</header><ul class="ta-day-list">';

      for (var i = 0; i < items.length; i++) {
        html += '<li><div class="ta-poi">'
          + '<span class="ta-poi-thumb"><b class="ta-num">' + esc(items[i].t) + '</b></span>'
          + '<span class="ta-poi-main"><span class="ta-poi-name ta-clamp-2">' + esc(items[i].a) + '</span></span>'
          + '</div></li>';
        var g = i < items.length - 1 ? gapText(items[i].t, items[i + 1].t) : null;
        if (g) {
          html += '<li class="ta-leg"><span>' + esc(fmt(C.legGap, { '%a': items[i].t, '%b': items[i + 1].t, '%g': g }))
            + '</span> <span class="ta-leg-method">' + esc(C.legMethod) + '</span></li>';
        }
      }
      /* One stay row per night, from the verified roundup for this province,
         with the real OTA link that carries our affiliate id. */
      if (plan.stay && d < plan.days.length - 1) {
        html += '<li><div class="ta-poi">'
          + (plan.stay.img ? '<span class="ta-poi-thumb"><img src="' + esc(img(plan.stay.img)) + '" alt="" width="56" height="56" loading="lazy" decoding="async"></span>' : '<span class="ta-poi-thumb"></span>')
          + '<span class="ta-poi-main">'
          + '<span class="ta-poi-name ta-clamp-1"><a href="' + esc(plan.stay.url) + '">' + esc(plan.stay.name) + '</a></span>'
          + '<span class="ta-poi-sub ta-clamp-2">' + esc(C.stayRow) + ' · ' + esc(plan.stay.rev || '') + '</span>'
          + ota(plan.stay)
          + '</span>'
          + '</div></li>';
      }
      html += '</ul></section>';
    }

    html += '<p class="ta-fine ta-plan-deck-src"><a href="' + esc(plan.href) + '">'
      + esc(fmt(C.prov, { '%s': plan.src })) + '</a></p>'
      + '<div class="ta-plan-deck-foot">'
      + '<button class="ta-btn ta-btn-primary" type="button" data-plan-open>' + esc(C.openTrip) + '</button>'
      + '<a class="ta-btn ta-btn-quiet" href="' + esc(plan.href) + '">' + esc(C.readFull) + '</a>'
      + '</div>';

    deckBox.innerHTML = html;
    deckBox.hidden = false;
    return true;
  }

  /* The stay row's booking links. All three OTAs, named, because "no site is
     cheapest every time" is the site's own editorial line and a single button
     quietly contradicts it. rel="sponsored noopener nofollow" + .no-prerender
     on every one: a speculation-rules prerender would fire a click the reader
     never made and corrupt attribution on cid=1965862 and the CJ feed. */
  function otaBtn(href, label) {
    if (!href) return '';
    return '<a class="ta-btn ta-btn-quiet no-prerender" rel="sponsored noopener nofollow"'
      + ' target="_blank" href="' + esc(href) + '">' + esc(label) + '</a>';
  }
  function ota(stay) {
    return '<span class="ta-poi-ota">'
      + otaBtn(stay.agoda, 'Agoda') + otaBtn(stay.booking, 'Booking') + otaBtn(stay.trip, 'Trip.com')
      + '</span>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* Slug + tier → a plan we have inlined, else the real published article.
     The enhancement never renders an error: its failure mode is the link. */
  function answer(itSlug, tier, destName, fallbackHref) {
    var btn = $('[data-plan-submit]');
    if (btn) { btn.setAttribute('aria-busy', 'true'); btn.textContent = C.loading; }
    var key = itSlug + '|' + tier;
    var ok = renderPlan(key, destName);
    if (!ok && H.plans[itSlug + '|3d2n']) ok = renderPlan(itSlug + '|3d2n', destName);
    if (btn) { btn.removeAttribute('aria-busy'); refreshSubmit(); }
    if (!ok) { location.href = fallbackHref; return; }
    if (history.replaceState) {
      /* Tier-3 session state only: never emitted as an <a href>, never in the
         sitemap, and the canonical stays the bare homepage. */
      history.replaceState(null, '', '?d=' + encodeURIComponent(itSlug) + '&n=' + encodeURIComponent(tier) + '#taPlanDeck');
    }
    if (window.matchMedia && !window.matchMedia('(min-width: 1024px)').matches) {
      /* scroll-behavior:auto from the reduced-motion block in shell.css does
         NOT override an explicit behavior option — the argument wins — so the
         preference has to be read here or the page still animates a ~900 px
         scroll for someone who asked it not to. */
      deckBox.scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
  }

  /* ══════════════════════ 4 · HAND-OFF TO /trip ════════════════════════
     Page code never touches localStorage — every line here is public TA API. */
  var pending = null;

  function materialise(plan, destName, merge) {
    if (!merge) TA.trip.reset();
    TA.trip.setTitle(destName + ' · ' + plan.title);
    var pois = [];
    for (var d = 0; d < plan.days.length; d++) {
      var day = TA.trip.addDay(plan.days[d].label, plan.days[d].title || null);
      var items = plan.days[d].items || [];
      for (var i = 0; i < items.length; i++) {
        var id = 'g:' + plan.slug + '--' + d + '-' + i;
        pois.push({ id: id, name: items[i].a, url: plan.href, kind: 'see', province: plan.slug, durMin: null });
        TA.poi.putAll(pois.slice(-1));
        /* Legs are never written: /trip derives them with TA.trip.legs(dayId),
           and a POI with no coordinates renders "distance unknown" there
           rather than a guessed number. */
        TA.trip.addToDay(id, day.id, { kind: 'see', source: 'guide', note: items[i].t });
      }
      if (plan.stay && d < plan.days.length - 1) {
        var sid = 's:' + String(plan.stay.url).replace(/^\/review-/, '');
        TA.poi.putAll([{ id: sid, name: plan.stay.name, url: plan.stay.url, img: plan.stay.img, kind: 'stay', province: plan.slug }]);
        TA.trip.addToDay(sid, day.id, { kind: 'stay', source: 'guide' });
      }
    }
    TA.nav.syncBadge();
    location.href = 'trip';
  }

  /* ══════════════════════ 5 · THE THREE PLANNER STATES ═════════════════ */
  var slot = $('#taPlanSlot');
  var DISMISS = 'ta.proto.home.resumeHidden';
  function hidden() { try { return sessionStorage.getItem(DISMISS) === '1'; } catch (e) { return false; } }

  function thumbs(list, host) {
    if (!host) return;
    var html = '', n = Math.min(3, list.length);
    for (var i = 0; i < n; i++) {
      var p = list[i];
      html += '<li>' + (p && p.img ? '<img src="' + esc(img(p.img)) + '" alt="" width="56" height="56" loading="lazy" decoding="async">' : '') + '</li>';
    }
    if (list.length > n) html += '<li class="ta-plan-more">+' + (list.length - n) + '</li>';
    host.innerHTML = html;
  }

  function renderStates() {
    var tr = TA.trip.get();
    var saves = TA.saves.list();
    var days = tr.days || [];
    var scheduled = 0;
    for (var i = 0; i < days.length; i++) scheduled += (days[i].items || []).length;
    var loose = saves.length + (tr.saves || []).length + (tr.unscheduled || []).length;

    var root = D.documentElement;
    var state = scheduled > 0 ? 'has' : (loose > 0 ? 'saves' : 'none');
    root.setAttribute('data-trip', state);
    if (slot) slot.classList.toggle('is-dismissed', state === 'has' && hidden());

    /* State A */
    if (state === 'has') {
      var pois = [];
      for (i = 0; i < days.length; i++) {
        var its = days[i].items || [];
        for (var j = 0; j < its.length; j++) { var p = TA.poi.get(its[j].poiId); if (p) pois.push(p); }
      }
      var title = $('[data-trip-title]');
      if (title) title.textContent = tr.title || C.noTitle;
      var meta = $('[data-trip-meta]');
      if (meta) {
        var ed = tr.updatedAt || tr.savedAt || 0;
        var dd = ed ? Math.max(0, Math.round((Date.now() - new Date(ed).getTime()) / 86400000)) : 0;
        var ago = dd === 0 ? C.ago0 : dd === 1 ? C.ago1 : fmt(C.agoN, { '%n': dd });
        meta.textContent = fmt(C.tripMeta, { '%p': scheduled, '%d': days.length, '%e': ago });
      }
      thumbs(pois, $('[data-trip-thumbs]'));
    }

    /* State B */
    if (state === 'saves') {
      var list = saves.slice();
      for (i = 0; i < (tr.saves || []).length; i++) { var q = TA.poi.get(tr.saves[i].poiId); if (q) list.push(q); }
      var provs = {}, names = [];
      for (i = 0; i < list.length; i++) if (list[i].province && !provs[list[i].province]) { provs[list[i].province] = 1; names.push(list[i].province); }
      var pname = '';
      for (i = 0; i < H.panels.length; i++) if (H.panels[i].slug === names[0]) pname = H.panels[i].name;
      var lead = $('[data-saves-lead]');
      if (lead) lead.textContent = fmt(C.savedNoDays, {
        '%n': list.length,
        '%p': names.length === 1 && pname ? fmt(C.inProv, { '%p': pname }) : ''
      });
      thumbs(list, $('[data-saves-thumbs]'));
      /* the province of the saves preselects the planner */
      if (planSel && names[0]) {
        var o = $('option[data-hub="' + names[0] + '"]', planSel)[0];
        if (o) { planSel.value = o.value; syncFromSelect(); }
      }
    }

    /* Plan dock — appears at the first save, never before. */
    var dock = $('[data-plandock]');
    if (dock) {
      var all = TA.saves.list();
      dock.hidden = (all.length + scheduled) === 0;
      var dl = $('[data-dock-list]', dock);
      if (dl && !dock.hidden) {
        var rows = '';
        var pool = all.slice(-4).reverse();
        for (i = 0; i < pool.length; i++) {
          rows += '<li><div class="ta-poi">'
            + (pool[i].img ? '<span class="ta-poi-thumb"><img src="' + esc(img(pool[i].img)) + '" alt="" width="56" height="56" loading="lazy" decoding="async"></span>' : '<span class="ta-poi-thumb"></span>')
            + '<span class="ta-poi-main"><span class="ta-poi-name ta-clamp-1">' + esc(pool[i].name || '') + '</span></span>'
            + '</div></li>';
        }
        dl.innerHTML = rows;
      }
    }

    /* Rail */
    var railEmpty = $('[data-rail-empty]');
    var total = TA.saves.count() + TA.trip.count();
    var cl = $('[data-trip-count-label]');
    if (cl) cl.textContent = fmt(C.railCount, { '%n': total });
    if (railEmpty) railEmpty.hidden = total > 0;

    renderDayStrip();
    syncAddControls();
  }

  /* ══════════════════════ 6 · THE DESTINATION SHEET ════════════════════
     The region list inside it is CLONED from the crawlable region block, so
     the link set is authored exactly once and the page can be an app and a
     landing page with no trade. */
  var sheetBuilt = false;
  function buildSheet() {
    if (sheetBuilt) return;
    var host = $('[data-dest-regions]'), src = $('#taRegions');
    if (!host || !src) return;
    var cards = $$('.ta-card', src);
    var html = '';
    for (var i = 0; i < cards.length; i++) {
      var h3 = $('.ta-card-title', cards[i]);
      var links = $$('.ta-region-links a', cards[i]);
      var lis = '';
      for (var j = 0; j < links.length; j++) {
        var slug = links[j].getAttribute('href').replace('/city-', '');
        var opt = planSel && $$('option[data-hub="' + slug + '"]', planSel)[0];
        if (!opt) continue;               /* no plan on disk → not offered here */
        lis += '<li><a href="#" data-pick-dest="' + esc(opt.value) + '">' + esc(links[j].textContent) + '</a></li>';
      }
      if (!lis) continue;
      html += '<details class="ta-region-list" open><summary>'
        + '<svg class="ta-ic ta-ic-16 i-chevron" aria-hidden="true"><use href="#i-chevron"></use></svg> '
        + esc(h3 ? h3.textContent : '') + '</summary>'
        + '<ul class="ta-region-links">' + lis + '</ul></details>';
    }
    host.innerHTML = html;
    sheetBuilt = true;
  }

  function filterSheet(q) {
    buildSheet();
    var norm = q.trim().toLowerCase();
    var seg = norm;
    try { if (TA.segmentQuery) seg = TA.segmentQuery(norm); } catch (e) {}
    var any = false;
    $$('[data-dest-regions] li').forEach(function (li) {
      var txt = li.textContent.toLowerCase();
      var on = !norm || txt.indexOf(norm) > -1 || (seg && seg !== norm && txt.indexOf(seg.split(' ')[0]) > -1);
      li.hidden = !on;
      if (on) any = true;
    });
    $$('[data-dest-regions] details').forEach(function (d) {
      var vis = $$('li', d).some(function (li) { return !li.hidden; });
      d.hidden = !vis;
      if (vis && norm) d.open = true;
    });
    var pop = $('[data-dest-pop]'), popH = $('[data-dest-pop-head]');
    if (pop) pop.hidden = !!norm;
    if (popH) popH.hidden = !!norm;
    var empty = $('[data-dest-empty]');
    if (empty) empty.hidden = any;
  }

  /* ══════════════════════ 7 · ONE DELEGATED LISTENER ═══════════════════ */
  D.addEventListener('click', function (ev) {
    var el;

    el = ev.target.closest && ev.target.closest('[data-deck-tab]');
    if (el) { ev.preventDefault(); selectPanel(el.getAttribute('data-deck-tab'), true); return; }

    el = ev.target.closest && ev.target.closest('[data-add-target]');
    if (el) {
      ev.preventDefault();
      addTarget = el.getAttribute('data-add-target');
      $$('[data-day-strip] [data-add-target]').forEach(function (b) {
        b.setAttribute('aria-selected', b === el ? 'true' : 'false');
      });
      syncAddControls();
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-plan-submit]');
    if (el) {
      ev.preventDefault();
      var opt = currentOpt();
      if (!opt) { openDestSheet(); return; }
      var tier = currentTier();
      var href = tierHref(opt, tier) || opt.getAttribute('data-p3');
      var use = tierHref(opt, tier) ? tier : '3d2n';
      answer(opt.value, use, opt.textContent, href);
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-plan-chip]');
    if (el) {
      var slug = el.getAttribute('data-plan-chip'), tr2 = el.getAttribute('data-plan-tier');
      if (H.plans[slug + '|' + tr2]) {
        ev.preventDefault();
        var o2 = planSel && $('option[value="' + slug + '"]', planSel)[0];
        if (o2) { planSel.value = slug; syncFromSelect(); }
        var rr = $('[data-plan-nights] input[data-tier="' + tr2 + '"]');
        if (rr) rr.checked = true;
        answer(slug, tr2, o2 ? o2.textContent : slug, el.getAttribute('href'));
      }
      return; /* no inlined plan → the anchor navigates to the real article */
    }

    el = ev.target.closest && ev.target.closest('[data-plan-adopt]');
    if (el) {
      ev.preventDefault();
      var s3 = el.getAttribute('data-plan-adopt'), t3 = el.getAttribute('data-plan-tier');
      var key = s3 + '|' + t3;
      if (!H.plans[key]) { location.href = '/' + s3 + '-' + t3 + '-itinerary'; return; }
      var o3 = planSel && $$('option[value="' + s3 + '"]', planSel)[0];
      askAndMaterialise(H.plans[key], o3 ? o3.textContent : H.plans[key].dest);
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-plan-open]');
    if (el && current) { ev.preventDefault(); askAndMaterialise(current.plan, current.dest); return; }

    el = ev.target.closest && ev.target.closest('[data-plan-clear]');
    if (el) {
      ev.preventDefault();
      deckBox.hidden = true; deckBox.innerHTML = ''; current = null;
      if (history.replaceState) history.replaceState(null, '', location.pathname);
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-conflict]');
    if (el) {
      ev.preventDefault();
      var dlg = D.getElementById('taTripConflict');
      if (dlg && TA.sheet) TA.sheet.close(dlg);
      if (pending) materialise(pending.plan, pending.dest, el.getAttribute('data-conflict') === 'merge');
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-pick-dest]');
    if (el) {
      ev.preventDefault();
      if (planSel) { planSel.value = el.getAttribute('data-pick-dest'); refreshSubmit(); syncFromSelect(); }
      var dl2 = D.getElementById('taDest');
      if (dl2 && TA.sheet) TA.sheet.close(dl2);
      var opt4 = currentOpt();
      if (opt4) {
        var tier4 = currentTier();
        var h4 = tierHref(opt4, tier4) || opt4.getAttribute('data-p3');
        answer(opt4.value, tierHref(opt4, tier4) ? tier4 : '3d2n', opt4.textContent, h4);
      }
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-trip-hide]');
    if (el) {
      ev.preventDefault();
      try { sessionStorage.setItem(DISMISS, '1'); } catch (e) {}
      if (slot) slot.classList.add('is-dismissed');
      return;
    }

    el = ev.target.closest && ev.target.closest('[data-trip-reset]');
    if (el) {
      ev.preventDefault();
      TA.trip.reset();
      TA.nav.syncBadge();
      renderStates();
      if (slot) slot.classList.remove('is-dismissed');
      try { sessionStorage.removeItem(DISMISS); } catch (e) {}
      return;
    }

    /* State B, the highest-value returning path on the site, in one tap:
       take what is already saved and lay it out day by day. */
    el = ev.target.closest && ev.target.closest('[data-make-days]');
    if (el) {
      ev.preventDefault();
      var list = TA.saves.list();
      if (!list.length) return;
      var per = 4, dayN = 0, day = null;
      for (var k = 0; k < list.length; k++) {
        if (k % per === 0) { dayN++; day = TA.trip.addDay(fmt(C.dayN, { '%n': dayN })); }
        TA.trip.addToDay(list[k].id, day.id, { kind: list[k].kind || 'see', source: 'saves' });
      }
      TA.nav.syncBadge();
      location.href = 'trip';
      return;
    }
  });

  function openDestSheet() {
    var dlg = D.getElementById('taDest');
    if (!dlg || !TA.sheet) return;
    buildSheet();
    TA.sheet.open(dlg, planSel);
    var q = $('[data-dest-search]');
    if (q) { q.value = ''; filterSheet(''); }
  }

  function askAndMaterialise(plan, destName) {
    pending = { plan: plan, dest: destName };
    if (TA.trip.count() > 0) {
      var dlg = D.getElementById('taTripConflict');
      var nm = $('[data-conflict-name]');
      if (nm) nm.textContent = fmt(C.conflictName, { '%t': TA.trip.get().title || C.noTitle });
      if (dlg && TA.sheet) { TA.sheet.open(dlg); return; }
    }
    materialise(plan, destName, false);
  }

  /* ── the select: on a phone it opens the sheet instead of the native menu,
       because a 77-row native picker with no search is a worse experience than
       the same 77 links with one. ────────────────────────────────────────── */
  if (planSel) {
    planSel.addEventListener('change', function () { refreshSubmit(); syncFromSelect(); });
    planSel.addEventListener('mousedown', function (ev) {
      if (window.matchMedia && window.matchMedia('(min-width: 1024px)').matches) return;
      ev.preventDefault();
      planSel.blur();
      openDestSheet();
    });
    planSel.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        if (window.matchMedia && window.matchMedia('(min-width: 1024px)').matches) return;
        ev.preventDefault(); openDestSheet();
      }
    });
  }
  $$('[data-plan-nights] input').forEach(function (r) { r.addEventListener('change', refreshSubmit); });
  var dq = $('[data-dest-search]');
  if (dq) dq.addEventListener('input', function () { filterSheet(dq.value); });

  /* Browsing never writes storage. State only changes on an explicit
     ownership action — a 🔖 tap, "use this plan", or "open in the planner" —
     so idly poking the demo can never clobber somebody's real trip. */
  TA.on('change', renderStates);

  /* deep link: #deck-<slug> restores the tab; ?d=&n= restores the answer. */
  (function boot() {
    var h = location.hash.replace('#deck-', '');
    if (h && D.getElementById('deck-' + h)) selectPanel(h, false);
    var m = /[?&]d=([^&#]+)/.exec(location.search), n = /[?&]n=([^&#]+)/.exec(location.search);
    if (m) {
      var slug = decodeURIComponent(m[1]), tier = n ? decodeURIComponent(n[1]) : '3d2n';
      var o = planSel && $$('option[value="' + slug + '"]', planSel)[0];
      if (o) {
        planSel.value = slug;
        syncFromSelect();
        var rr = $('[data-plan-nights] input[data-tier="' + tier + '"]');
        if (rr) rr.checked = true;
        renderPlan(slug + '|' + tier, o.textContent) || renderPlan(slug + '|3d2n', o.textContent);
      }
    }
    renderStates();
    refreshSubmit();
  })();
});
