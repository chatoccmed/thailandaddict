(function () {
  'use strict';
  var W = window;
  var D = document;
  var TA = W.TA || (W.TA = {});
  var K_SAVES = 'ta.saves.v3';
  var K_TRIP = 'ta.trip.v1';
  var K_THEME = 'ta.theme';
  var K_RAIL = 'ta.rail';
  var K_LEGACY_TRIP = 'ta.trip.v3';   /* read-tolerant: blueprint §6.1.2 name */
  var K_LEGACY_WISH = 'ta_wishlist';  /* read-tolerant: the v1 bare array     */
  var isTH = (D.documentElement.lang || 'th').slice(0, 2) === 'th';
  function t(th, en) { return isTH ? th : en; }
  var pending = [];
  function prerendering() { return D.prerendering === true; }
  function whenActive(fn) {
    if (!prerendering()) { fn(); return; }
    pending.push(fn);
    if (pending.length === 1) {
      D.addEventListener('prerenderingchange', function () {
        var q = pending.slice(); pending.length = 0;
        for (var i = 0; i < q.length; i++) { try { q[i](); } catch (e) { /* keep going */ } }
      }, { once: true });
    }
  }
  TA.whenActive = whenActive;
  TA.prerendering = prerendering;
  TA.wasPrerendered = function () {
    var n = performance.getEntriesByType('navigation')[0];
    return !!(n && n.activationStart > 0);
  };
  var storageBroken = false;
  function read(key, fallback) {
    try {
      var raw = W.localStorage.getItem(key);
      if (raw === null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    if (prerendering()) { whenActive(function () { write(key, value); }); return false; }
    try {
      W.localStorage.setItem(key, JSON.stringify(value));
      if (storageBroken) { storageBroken = false; }
      return true;
    } catch (e) {
      if (!storageBroken) {
        storageBroken = true;
        TA.toast(t(
          'บันทึกไม่สำเร็จ — เบราว์เซอร์นี้ไม่อนุญาตให้เก็บข้อมูล (เช่น โหมดส่วนตัว) รายการจะหายเมื่อปิดหน้านี้',
          'Could not save — this browser is blocking storage (private mode?). Your list will be lost when you close this page.'
        ), { ms: 6000 });
      }
      emit('storage-error', { key: key, error: String(e) });
      return false;
    }
  }
  var subs = Object.create(null);
  function emit(evt, detail) {
    var list = subs[evt];
    if (list) {
      for (var i = 0; i < list.length; i++) {
        try { list[i](detail); } catch (e) { /* one bad subscriber must not stop the rest */ }
      }
    }
    try { D.dispatchEvent(new CustomEvent('ta:' + evt, { detail: detail })); } catch (e) { }
  }
  TA.on = function (evt, fn) {
    (subs[evt] || (subs[evt] = [])).push(fn);
    return function off() {
      var l = subs[evt]; if (!l) return;
      var i = l.indexOf(fn); if (i > -1) l.splice(i, 1);
    };
  };
  function normalise(item) {
    if (!item) return null;
    var id = item.id || item.poiId;
    if (!id) return null;
    return {
      id: String(id),
      kind: item.kind || 'stay',
      name: item.name || '',
      url: item.url || '',
      img: item.img || '',
      province: item.province || '',
      poiId: item.poiId || String(id),
      score: (item.score === 0 || item.score) ? Number(item.score) : null,
      priceFrom: (item.priceFrom === 0 || item.priceFrom) ? Number(item.priceFrom) : null,
      addedAt: item.addedAt || new Date().toISOString()
    };
  }
  var savesCache = null;
  function loadSaves() {
    if (savesCache) return savesCache;
    var raw = read(K_SAVES, null);
    if (Array.isArray(raw)) {
      savesCache = raw.map(normalise).filter(Boolean);
    } else {
      savesCache = migrateLegacySaves();
    }
    return savesCache;
  }
  function migrateLegacySaves() {
    var out = [];
    var old = read(K_LEGACY_WISH, null);
    if (Array.isArray(old)) {
      for (var i = 0; i < old.length; i++) {
        var o = old[i];
        if (!o) continue;
        if (typeof o === 'string') { out.push(normalise({ id: o, name: o, url: o })); continue; }
        out.push(normalise({
          id: o.id || o.poiId || o.slug || o.url || o.href,
          kind: o.type === 'กิน' ? 'eat' : o.type === 'เที่ยว' ? 'see' : (o.kind || 'stay'),
          name: o.name || o.title || '',
          url: o.url || o.href || '',
          img: o.img || o.image || '',
          province: o.province || '',
          score: o.score, priceFrom: o.priceFrom,
          addedAt: o.addedAt || o.savedAt
        }));
      }
      out = out.filter(Boolean);
    }
    return out;
  }
  function persistSaves() {
    write(K_SAVES, savesCache || []);
    emit('change', { source: 'saves', count: TA.saves.count() });
    emit('saves', { count: TA.saves.count() });
  }
  TA.saves = {
    list: function () { return loadSaves().slice(); },
    has: function (id) {
      if (!id) return false;
      var l = loadSaves();
      for (var i = 0; i < l.length; i++) if (l[i].id === String(id)) return true;
      return false;
    },
    get: function (id) {
      var l = loadSaves();
      for (var i = 0; i < l.length; i++) if (l[i].id === String(id)) return l[i];
      return null;
    },
    count: function () { return loadSaves().length; },
    add: function (item) {
      var n = normalise(item); if (!n) return false;
      if (TA.saves.has(n.id)) return false;
      loadSaves().push(n);
      persistSaves();
      return true;
    },
    remove: function (id) {
      var l = loadSaves();
      for (var i = 0; i < l.length; i++) {
        if (l[i].id === String(id)) { l.splice(i, 1); persistSaves(); return true; }
      }
      return false;
    },
    toggle: function (item) {
      var n = normalise(item); if (!n) return false;
      if (TA.saves.has(n.id)) { TA.saves.remove(n.id); return false; }
      TA.saves.add(n); return true;
    },
    clear: function () { savesCache = []; persistSaves(); },
    on: function (fn) { return TA.on('saves', fn); }
  };
  TA.save = function (poiId, opts) { return TA.saves.add(Object.assign({ id: poiId, poiId: poiId }, opts || {})); };
  TA.unsave = function (poiId) { return TA.saves.remove(poiId); };
  TA.has = function (poiId) { return TA.saves.has(poiId) || TA.trip.hasPoi(poiId); };
  var poiCache = Object.create(null);
  TA.poi = {
    put: function (item) { if (item && item.id) poiCache[item.id] = item; return item; },
    putAll: function (list) { (list || []).forEach(TA.poi.put); return list; },
    get: function (id) {
      if (!id) return null;
      if (poiCache[id]) return poiCache[id];
      var s = TA.saves.get(id);
      return s ? { id: s.id, name: s.name, url: s.url, img: s.img, kind: s.kind, province: s.province } : null;
    },
    all: function () { return Object.keys(poiCache).map(function (k) { return poiCache[k]; }); }
  };
  function nowISO() { return new Date().toISOString(); }
  function uid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  }
  function blankTrip() {
    return {
      v: 3,
      id: 'local',
      rev: 0,
      title: '',
      startDate: null,                     /* nullable and first-class (§6.1.2 invariant 2) */
      pax: { adults: 2, kids: 0 },
      currency: 'THB',
      prefs: {
        provinces: [], days: 0, pace: null, interests: [],
        transport: null, kids: false, elderly: false,
        lang: (D.documentElement.lang || 'th').slice(0, 2)
      },
      lists: [
        { id: 'inbox', name: t('ที่บันทึกไว้', 'Saved'), color: 'sand' },
        { id: 'eat', name: t('อยากกิน', 'Want to eat'), color: 'coral' },
        { id: 'stay', name: t('ที่พัก', 'Stays'), color: 'mango' }
      ],
      saves: [],
      days: [],
      unscheduled: [],
      _orphans: [],
      budgetCap: null,
      updatedAt: nowISO()
    };
  }
  var tripCache = null;
  function loadTrip() {
    if (tripCache) return tripCache;
    var raw = read(K_TRIP, null);
    if (!raw || typeof raw !== 'object') raw = read(K_LEGACY_TRIP, null);
    if (!raw || typeof raw !== 'object') { tripCache = blankTrip(); return tripCache; }
    var base = blankTrip();
    tripCache = Object.assign(base, raw);
    tripCache.days = Array.isArray(raw.days) ? raw.days : [];
    tripCache.saves = Array.isArray(raw.saves) ? raw.saves : [];
    tripCache.unscheduled = Array.isArray(raw.unscheduled) ? raw.unscheduled : [];
    tripCache._orphans = Array.isArray(raw._orphans) ? raw._orphans : [];
    tripCache.lists = Array.isArray(raw.lists) && raw.lists.length ? raw.lists : base.lists;
    return tripCache;
  }
  function persistTrip() {
    var tr = loadTrip();
    tr.rev = (tr.rev || 0) + 1;
    tr.updatedAt = nowISO();
    write(K_TRIP, tr);
    emit('change', { source: 'trip', rev: tr.rev, count: TA.trip.count() });
    emit('trip', { rev: tr.rev, count: TA.trip.count() });
  }
  function findDay(dayId) {
    var d = loadTrip().days;
    for (var i = 0; i < d.length; i++) if (d[i].id === dayId) return d[i];
    return null;
  }
  function findItem(itemId) {
    var days = loadTrip().days;
    for (var i = 0; i < days.length; i++) {
      var items = days[i].items || [];
      for (var j = 0; j < items.length; j++) {
        if (items[j].id === itemId) return { day: days[i], item: items[j], index: j };
      }
    }
    return null;
  }
  TA.trip = {
    get: function () { return loadTrip(); },
    rev: function () { return loadTrip().rev || 0; },
    count: function () {
      var tr = loadTrip(), n = 0;
      for (var i = 0; i < tr.days.length; i++) n += (tr.days[i].items || []).length;
      return n + tr.saves.length + tr.unscheduled.length;
    },
    hasPoi: function (poiId) {
      if (!poiId) return false;
      var tr = loadTrip(), i, j;
      for (i = 0; i < tr.saves.length; i++) if (tr.saves[i].poiId === poiId) return true;
      for (i = 0; i < tr.days.length; i++) {
        var it = tr.days[i].items || [];
        for (j = 0; j < it.length; j++) if (it[j].poiId === poiId) return true;
      }
      return false;
    },
    setTitle: function (title) { loadTrip().title = String(title || ''); persistTrip(); },
    setStartDate: function (iso) { loadTrip().startDate = iso || null; persistTrip(); },
    addDay: function (label, zone) {
      var tr = loadTrip();
      var day = {
        id: 'd' + (tr.days.length + 1) + '-' + uid(''),
        date: null,
        label: label || (t('วันที่ ', 'Day ') + (tr.days.length + 1)),
        zone: zone || null,
        stayPoiId: null,
        note: '',
        items: []
      };
      tr.days.push(day);
      persistTrip();
      return day;
    },
    removeDay: function (dayId) {
      var tr = loadTrip();
      for (var i = 0; i < tr.days.length; i++) {
        if (tr.days[i].id === dayId) {
          tr.unscheduled = tr.unscheduled.concat(tr.days[i].items || []);
          tr.days.splice(i, 1);
          persistTrip();
          return true;
        }
      }
      return false;
    },
    addToDay: function (poiId, dayId, opts) {
      if (!poiId) return null;
      var tr = loadTrip();
      if (!tr.days.length) TA.trip.addDay();
      var day = dayId ? findDay(dayId) : tr.days[0];
      if (!day) day = tr.days[0];
      opts = opts || {};
      var poi = TA.poi.get(poiId) || {};
      var item = {
        id: uid('i'),
        poiId: poiId,
        kind: opts.kind || poi.kind || 'see',
        start: opts.start || null,
        durMin: (opts.durMin === 0 || opts.durMin) ? opts.durMin : (poi.durMin || null),
        pinned: !!opts.pinned,
        cost: opts.cost || null,
        source: opts.source || 'manual',
        note: opts.note || ''
      };
      day.items = day.items || [];
      if (typeof opts.index === 'number') day.items.splice(opts.index, 0, item);
      else day.items.push(item);
      tr.saves = tr.saves.filter(function (s) { return s.poiId !== poiId; });
      persistTrip();
      return item;
    },
    addToList: function (poiId, listId, note) {
      if (!poiId) return null;
      var tr = loadTrip();
      for (var i = 0; i < tr.saves.length; i++) if (tr.saves[i].poiId === poiId) return tr.saves[i];
      var s = { poiId: poiId, listId: listId || 'inbox', note: note || '', savedAt: nowISO() };
      tr.saves.push(s);
      persistTrip();
      return s;
    },
    move: function (itemId, dayId, index) {
      var found = findItem(itemId);
      if (!found) return false;
      var target = findDay(dayId);
      if (!target) return false;
      found.day.items.splice(found.index, 1);
      target.items = target.items || [];
      if (typeof index === 'number' && index >= 0 && index <= target.items.length) {
        target.items.splice(index, 0, found.item);
      } else {
        target.items.push(found.item);
      }
      persistTrip();
      return true;
    },
    reorder: function (dayId, fromIndex, toIndex) {
      var day = findDay(dayId);
      if (!day || !day.items) return false;
      var n = day.items.length;
      if (fromIndex < 0 || fromIndex >= n) return false;
      if (toIndex < 0) toIndex = 0;
      if (toIndex >= n) toIndex = n - 1;
      if (fromIndex === toIndex) return false;
      var it = day.items.splice(fromIndex, 1)[0];
      day.items.splice(toIndex, 0, it);
      persistTrip();
      return true;
    },
    nudge: function (itemId, dir) {
      var f = findItem(itemId);
      if (!f) return false;
      return TA.trip.reorder(f.day.id, f.index, f.index + (dir === 'up' ? -1 : 1));
    },
    remove: function (itemId) {
      var f = findItem(itemId);
      if (!f) return false;
      f.day.items.splice(f.index, 1);
      TA.trip.addToList(f.item.poiId, 'inbox', f.item.note);
      persistTrip();
      return true;
    },
    drop: function (poiId) {
      var tr = loadTrip();
      tr.saves = tr.saves.filter(function (s) { return s.poiId !== poiId; });
      tr.unscheduled = tr.unscheduled.filter(function (s) { return s.poiId !== poiId; });
      for (var i = 0; i < tr.days.length; i++) {
        tr.days[i].items = (tr.days[i].items || []).filter(function (it) { return it.poiId !== poiId; });
      }
      persistTrip();
      return true;
    },
    reset: function () { tripCache = blankTrip(); persistTrip(); },
    export: function () { return JSON.stringify(loadTrip(), null, 2); },
    import: function (json) {
      var data;
      try { data = typeof json === 'string' ? JSON.parse(json) : json; }
      catch (e) { return { ok: false, error: t('ไฟล์ไม่ถูกต้อง', 'Not a valid file') }; }
      if (!data || typeof data !== 'object' || !Array.isArray(data.days)) {
        return { ok: false, error: t('ไฟล์นี้ไม่ใช่ไฟล์ทริป', 'This is not a trip file') };
      }
      tripCache = Object.assign(blankTrip(), data);
      persistTrip();
      return { ok: true };
    },
    on: function (fn) { return TA.on('trip', fn); },
    legs: function (dayId) {
      var day = findDay(dayId);
      if (!day) return [];
      var items = day.items || [];
      var out = [];
      for (var i = 0; i < items.length - 1; i++) {
        out.push(leg(items[i], items[i + 1], day));
      }
      return out;
    }
  };
  var ROAD_FACTOR = { bangkok: 1.9, 'default': 1.35 };
  var SPEED_KMH = { walk: 4.5, bangkok: 18, 'default': 42 };
  function haversineKm(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad;
    var dLng = (b.lng - a.lng) * rad;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }
  function leg(fromItem, toItem, day) {
    var a = TA.poi.get(fromItem.poiId);
    var b = TA.poi.get(toItem.poiId);
    var base = { fromItemId: fromItem.id, toItemId: toItem.id };
    if (!a || !b || typeof a.lat !== 'number' || typeof b.lat !== 'number' ||
      typeof a.lng !== 'number' || typeof b.lng !== 'number') {
      return Object.assign(base, {
        method: 'unknown', km: null, minMin: null, minMax: null, mode: null,
        label: t('ยังไม่ทราบระยะทาง', 'Distance not known')
      });
    }
    var prov = (a.province || b.province || (day && day.zone) || '').toLowerCase();
    var factor = ROAD_FACTOR[prov] || ROAD_FACTOR['default'];
    var straight = haversineKm(a, b);
    var km = straight * factor;
    var walk = km <= 1.2;
    var speed = walk ? SPEED_KMH.walk : (SPEED_KMH[prov] || SPEED_KMH['default']);
    var mid = (km / speed) * 60;
    var lo = Math.max(2, Math.round(mid * 0.8 / 5) * 5);
    var hi = Math.max(lo + 5, Math.round(mid * 1.25 / 5) * 5);
    return Object.assign(base, {
      method: 'straight-line',
      km: Math.round(km * 10) / 10,
      minMin: lo,
      minMax: hi,
      mode: walk ? 'walk' : 'drive',
      label: t('ประมาณ (เส้นตรง)', 'estimate (straight-line)')
    });
  }
  TA.trip.leg = leg;
  var THEMES = ['system', 'light', 'dark'];
  TA.theme = {
    get: function () {
      var v = null;
      try { v = W.localStorage.getItem(K_THEME); } catch (e) { }
      return THEMES.indexOf(v) > -1 ? v : 'system';
    },
    resolved: function () {
      var v = TA.theme.get();
      if (v !== 'system') return v;
      return W.matchMedia && W.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    set: function (v) {
      if (THEMES.indexOf(v) < 0) v = 'system';
      if (v === 'system') D.documentElement.removeAttribute('data-theme');
      else D.documentElement.setAttribute('data-theme', v);
      try { W.localStorage.setItem(K_THEME, v); } catch (e) { }
      syncThemeColor();
      emit('theme', { theme: v, resolved: TA.theme.resolved() });
      return v;
    },
    cycle: function () {
      var i = THEMES.indexOf(TA.theme.get());
      return TA.theme.set(THEMES[(i + 1) % THEMES.length]);
    },
    apply: function () {
      var v = TA.theme.get();
      if (v === 'system') D.documentElement.removeAttribute('data-theme');
      else D.documentElement.setAttribute('data-theme', v);
      syncThemeColor();
    }
  };
  function syncThemeColor() {
    var choice = TA.theme.get();
    var metas = D.querySelectorAll('meta[name="theme-color"][data-shell]');
    if (!metas.length) return;
    for (var i = 0; i < metas.length; i++) {
      metas[i].removeAttribute('content');
      metas[i].setAttribute('content', metas[i].getAttribute('data-color') || '#FBFAF7');
    }
    if (choice === 'system') return;
    var want = choice === 'dark' ? '#081113' : '#FBFAF7';
    for (var j = 0; j < metas.length; j++) metas[j].setAttribute('content', want);
  }
  var toastEl = null, toastTimer = 0;
  function toastHost() {
    if (toastEl && D.body.contains(toastEl)) return toastEl;
    toastEl = D.querySelector('.ta-toast[data-shell-toast]');
    if (!toastEl) {
      toastEl = D.createElement('div');
      toastEl.className = 'ta-toast';
      toastEl.setAttribute('data-shell-toast', '');
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.setAttribute('aria-atomic', 'true');
      D.body.appendChild(toastEl);
    }
    return toastEl;
  }
  TA.toast = function (msg, opts) {
    opts = opts || {};
    var el = toastHost();
    el.textContent = '';
    var span = D.createElement('span');
    span.textContent = String(msg == null ? '' : msg);
    el.appendChild(span);
    if (opts.href) {
      var a = D.createElement('a');
      a.href = opts.href;
      a.textContent = opts.linkText || t('ดูทริป', 'View trip');
      el.appendChild(a);
    }
    el.setAttribute('data-open', '');
    W.clearTimeout(toastTimer);
    toastTimer = W.setTimeout(function () { el.removeAttribute('data-open'); }, opts.ms || 3500);
    return el;
  };
  TA.nav = {
    syncBadge: function () {
      var n = TA.saves.count() + TA.trip.count();
      var els = D.querySelectorAll('.ta-badge, [data-trip-count]');
      for (var i = 0; i < els.length; i++) {
        els[i].textContent = String(n);
        els[i].setAttribute('data-count', String(n));
      }
      var labels = D.querySelectorAll('[data-trip-count-label]');
      for (var j = 0; j < labels.length; j++) {
        labels[j].textContent = t('ในทริปของคุณ ' + n + ' รายการ', n + ' items in your trip');
      }
      return n;
    },
    syncSaves: function (root) {
      var els = (root || D).querySelectorAll('[data-save]');
      for (var i = 0; i < els.length; i++) {
        var id = els[i].getAttribute('data-id') || els[i].getAttribute('data-poi-id');
        var on = !!id && (TA.saves.has(id) || TA.trip.hasPoi(id));
        els[i].setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    },
    syncCurrent: function () {
      var bar = D.querySelector('.ta-tabbar');
      var desk = D.querySelector('.ta-nav-desk');
      [bar, desk].forEach(function (scope) {
        if (!scope) return;
        if (scope.querySelector('[aria-current]')) return;
        var here = location.pathname.replace(/\/index\.html$/, '/');
        var links = scope.querySelectorAll('a[href]');
        var best = null, bestLen = -1;
        for (var i = 0; i < links.length; i++) {
          var p;
          try { p = new URL(links[i].href, location.href).pathname; } catch (e) { continue; }
          if (p === here || (p !== '/' && here.indexOf(p) === 0)) {
            if (p.length > bestLen) { best = links[i]; bestLen = p.length; }
          }
        }
        if (best) best.setAttribute('aria-current', 'page');
      });
    },
    installCondense: function () {
      var bar = D.querySelector('.ta-topbar');
      if (!bar) return;
      var supported = W.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()');
      if (supported) return;
      var sentinel = D.querySelector('.ta-topbar-sentinel');
      if (!sentinel) {
        sentinel = D.createElement('div');
        sentinel.className = 'ta-topbar-sentinel';
        D.body.insertBefore(sentinel, D.body.firstChild);
      }
      if (!('IntersectionObserver' in W)) return;
      new IntersectionObserver(function (entries) {
        bar.classList.toggle('is-condensed', !entries[0].isIntersecting);
      }, { rootMargin: '-180px 0px 0px 0px', threshold: 0 }).observe(sentinel);
    },
    installCta: function () {
      var cta = D.querySelector('.ta-cta[data-autohide]');
      if (!cta) return;
      var last = W.scrollY, ticking = false;
      W.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        W.requestAnimationFrame(function () {
          var y = W.scrollY;
          var h = D.documentElement.scrollHeight - W.innerHeight;
          var depth = h > 0 ? y / h : 0;
          if (depth > 0.6 || y < 80) cta.removeAttribute('data-hidden');
          else if (y > last + 8) cta.setAttribute('data-hidden', '');
          else if (y < last - 8) cta.removeAttribute('data-hidden');
          last = y; ticking = false;
        });
      }, { passive: true });
    }
  };
  function attrs(el) {
    return {
      id: el.getAttribute('data-id') || el.getAttribute('data-poi-id') || '',
      poiId: el.getAttribute('data-poi-id') || el.getAttribute('data-id') || '',
      kind: el.getAttribute('data-kind') || '',
      name: el.getAttribute('data-name') || '',
      url: el.getAttribute('data-url') || '',
      img: el.getAttribute('data-img') || '',
      province: el.getAttribute('data-province') || '',
      score: el.getAttribute('data-score'),
      priceFrom: el.getAttribute('data-price-from')
    };
  }
  D.addEventListener('click', function (ev) {
    var el;
    el = ev.target.closest && ev.target.closest('[data-save]');
    if (el) {
      ev.preventDefault();
      var a = attrs(el);
      if (!a.id) return;
      TA.poi.put({
        id: a.poiId, name: a.name, url: a.url, img: a.img,
        kind: a.kind, province: a.province,
        lat: parseFloat(el.getAttribute('data-lat')),
        lng: parseFloat(el.getAttribute('data-lng'))
      });
      var on = TA.saves.toggle(a);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
      TA.nav.syncBadge();
      TA.nav.syncSaves();
      var total = TA.saves.count() + TA.trip.count();
      if (on) {
        TA.toast(
          t('บันทึก ' + (a.name || '') + ' แล้ว · ' + total + ' รายการในทริป',
            'Saved ' + (a.name || '') + ' · ' + total + ' in your trip'),
          { href: el.getAttribute('data-trip-href') || '/trip' }
        );
      } else {
        TA.toast(t('เอา ' + (a.name || '') + ' ออกแล้ว', 'Removed ' + (a.name || '')));
      }
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-sheet]');
    if (el) {
      var sheetId = el.getAttribute('data-sheet');
      var dlg = D.getElementById(sheetId);
      if (dlg && TA.sheet) {
        ev.preventDefault();
        TA.sheet.open(dlg, el);
      }
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-sheet-close]');
    if (el) {
      ev.preventDefault();
      var host = el.closest('dialog');
      if (host && TA.sheet) TA.sheet.close(host);
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-add-day]');
    if (el) {
      ev.preventDefault();
      var dayId = el.getAttribute('data-add-day');
      var ad = attrs(el);
      if (!ad.poiId) return;
      TA.poi.put({
        id: ad.poiId, name: ad.name, url: ad.url, img: ad.img,
        kind: ad.kind, province: ad.province,
        lat: parseFloat(el.getAttribute('data-lat')),
        lng: parseFloat(el.getAttribute('data-lng'))
      });
      var where;
      if (dayId === 'inbox' || dayId === '') {
        TA.trip.addToList(ad.poiId, el.getAttribute('data-list') || 'inbox');
        where = t('ที่บันทึกไว้', 'your saved list');
      } else {
        var item = TA.trip.addToDay(ad.poiId, dayId, {
          kind: ad.kind || undefined,
          durMin: el.getAttribute('data-dur') ? parseInt(el.getAttribute('data-dur'), 10) : undefined,
          source: el.getAttribute('data-source') || 'manual'
        });
        var placed = item ? findItem(item.id) : null;
        where = (placed && placed.day.label) || t('ทริปของคุณ', 'your trip');
      }
      TA.nav.syncBadge();
      TA.nav.syncSaves();
      emit('render', { reason: 'add' });
      TA.toast(
        t('เพิ่ม ' + (ad.name || '') + ' ใน ' + where + ' แล้ว',
          'Added ' + (ad.name || '') + ' to ' + where),
        { href: el.getAttribute('data-trip-href') || '/trip' }
      );
      var sheetHost = el.closest('dialog');
      if (sheetHost && TA.sheet) TA.sheet.close(sheetHost);
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-move]');
    if (el) {
      ev.preventDefault();
      var how = el.getAttribute('data-move');
      var itemId = el.getAttribute('data-item');
      if (!itemId) return;
      if (how === 'up' || how === 'down') {
        TA.trip.nudge(itemId, how);
      } else if (how === 'day') {
        var toDay = el.getAttribute('data-to-day');
        var toIdxRaw = el.getAttribute('data-to-index');
        TA.trip.move(itemId, toDay, toIdxRaw === null ? undefined : parseInt(toIdxRaw, 10));
      } else if (how === 'remove') {
        TA.trip.remove(itemId);
      }
      TA.nav.syncBadge();
      emit('render', { reason: 'move' });
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-palette]');
    if (el) {
      var p = el.getAttribute('data-palette');
      if (!p || p === 'a') D.documentElement.removeAttribute('data-palette');
      else D.documentElement.setAttribute('data-palette', p);
      var group = el.closest('[data-palette-group]');
      if (group) {
        var btns = group.querySelectorAll('[data-palette]');
        for (var pi = 0; pi < btns.length; pi++) {
          btns[pi].setAttribute('aria-pressed', btns[pi] === el ? 'true' : 'false');
        }
      }
      emit('palette', { palette: p || 'a' });
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-theme-set]');
    if (el) {
      ev.preventDefault();
      var want = el.getAttribute('data-theme-set');
      TA.theme.set(want === 'cycle' ? nextTheme() : want);
      reflectTheme();
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-rail-toggle]');
    if (el) {
      ev.preventDefault();
      var rail = D.querySelector('.ta-rail');
      if (!rail) return;
      var open = rail.hasAttribute('data-open');
      if (open) rail.removeAttribute('data-open'); else rail.setAttribute('data-open', '');
      el.setAttribute('aria-expanded', open ? 'false' : 'true');
      try { W.localStorage.setItem(K_RAIL, open ? 'closed' : 'open'); } catch (e) { }
      return;
    }
    el = ev.target.closest && ev.target.closest('[data-install]');
    if (el && installEvent) {
      ev.preventDefault();
      installEvent.prompt();
      installEvent.userChoice.then(function () {
        installEvent = null;
        var host = D.querySelector('[data-install]');
        if (host) host.hidden = true;
      });
      return;
    }
  });
  function nextTheme() {
    var i = THEMES.indexOf(TA.theme.get());
    return THEMES[(i + 1) % THEMES.length];
  }
  function reflectTheme() {
    var cur = TA.theme.get();
    var els = D.querySelectorAll('[data-theme-set]');
    for (var i = 0; i < els.length; i++) {
      var v = els[i].getAttribute('data-theme-set');
      if (v === 'cycle') {
        els[i].setAttribute('data-theme-state', cur);
        var lbl = els[i].querySelector('[data-theme-label]');
        if (lbl) {
          lbl.textContent = cur === 'dark' ? t('มืด', 'Dark')
            : cur === 'light' ? t('สว่าง', 'Light')
              : t('ตามระบบ', 'System');
        }
      } else {
        els[i].setAttribute('aria-pressed', v === cur ? 'true' : 'false');
      }
    }
  }
  var installEvent = null;
  W.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installEvent = e;
    var host = D.querySelector('[data-install]');
    if (host) host.hidden = false;
    emit('installable', {});
  });
  W.addEventListener('appinstalled', function () {
    installEvent = null;
    var host = D.querySelector('[data-install]');
    if (host) host.hidden = true;
  });
  W.addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;
    try {
      var a = D.activeElement && D.activeElement.closest && D.activeElement.closest('a[data-vt-hero]');
      if (a) {
        var img = a.querySelector('img');
        if (img) img.style.setProperty('view-transition-name', 'ta-hero');
      }
      sessionStorage.setItem('ta.vt.dir', 'forwards');
    } catch (err) { }
  });
  D.addEventListener('error', function (ev) {
    var el = ev.target;
    if (!el || el.tagName !== 'IMG' || el.dataset.taFailed) return;
    el.dataset.taFailed = '1';
    var ph = D.createElement('div');
    ph.className = 'ta-img-fail';
    ph.textContent = el.getAttribute('alt') || t('ไม่มีรูป', 'No image');
    if (el.parentNode) el.parentNode.replaceChild(ph, el);
  }, true);
  var RE_THAI = /[ก-฾เ-๛]/;
  var LTR_CORE = "0-9A-Za-z฿$€£";
  var LTR_START = LTR_CORE + "#(";
  var LTR_INNER = LTR_CORE + " .,:;/#%&'’()·•–—+-";
  var LTR_END = LTR_CORE + "%)";
  var RE_LTR_RUN = new RegExp(
    "[" + LTR_START + "][" + LTR_INNER + "]*[" + LTR_END + "]|[" + LTR_CORE + "]", "g");
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1, KBD: 1, SAMP: 1, TEMPLATE: 1 };
  function ownText(el) {
    var s = '';
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3) s += c.nodeValue;
    return s;
  }
  function markThai(root) {
    var scope = root || D.body;
    if (!scope) return 0;
    var hits = 0;
    var SEL = 'h1,h2,h3,h4,h5,h6,p,li,dd,dt,td,th,figcaption,blockquote,summary,label,button,a,span,strong,em,small,b,i,legend,option';
    var els = [].slice.call(scope.querySelectorAll(SEL));
    if (scope.nodeType === 1 && scope.matches && scope.matches(SEL)) els.unshift(scope);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (SKIP_TAGS[el.tagName]) continue;
      if (el.hasAttribute('data-th')) continue;
      if (!RE_THAI.test(ownText(el))) continue;
      el.setAttribute('data-th', '');
      hits++;
    }
    return hits;
  }
  function bidiGuard(root) {
    if (D.documentElement.getAttribute('dir') !== 'rtl') return 0;
    var scope = root || D.body;
    if (!scope) return 0;
    var walker = D.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode;
        if (!p || SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.nodeName === 'BDI') return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.length < 2) return NodeFilter.FILTER_REJECT;
        RE_LTR_RUN.lastIndex = 0;
        return RE_LTR_RUN.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var todo = [], node;
    while ((node = walker.nextNode())) todo.push(node);
    var wrapped = 0;
    for (var i = 0; i < todo.length; i++) {
      var t = todo[i], v = t.nodeValue, frag = D.createDocumentFragment(), last = 0, m;
      RE_LTR_RUN.lastIndex = 0;
      while ((m = RE_LTR_RUN.exec(v)) !== null) {
        if (m.index > last) frag.appendChild(D.createTextNode(v.slice(last, m.index)));
        var b = D.createElement('bdi');
        b.setAttribute('dir', 'ltr');
        b.textContent = m[0];
        frag.appendChild(b);
        last = m.index + m[0].length;
        wrapped++;
      }
      if (!wrapped) continue;
      if (last < v.length) frag.appendChild(D.createTextNode(v.slice(last)));
      t.parentNode.replaceChild(frag, t);
    }
    return wrapped;
  }
  var guardBusy = false;
  var guardQueue = [];
  var guardScheduled = false;
  function runGuards(nodes) {
    guardBusy = true;
    try {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (!n.isConnected) continue;
        try { bidiGuard(n); } catch (e) { }
        try { markThai(n); } catch (e) { }
      }
    } finally { guardBusy = false; }
  }
  function watchGuards() {
    if (!W.MutationObserver || !D.body) return;
    var mo = new W.MutationObserver(function (records) {
      if (guardBusy) return;
      for (var i = 0; i < records.length; i++) {
        var rec = records[i];
        if (rec.type === "characterData") {
          if (rec.target.parentElement) guardQueue.push(rec.target.parentElement);
          continue;
        }
        var added = rec.addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType === 3) { if (n.parentElement) guardQueue.push(n.parentElement); continue; }
          if (n.nodeType !== 1) continue;
          if (n.nodeName === "BDI") continue;
          guardQueue.push(n);
        }
      }
      if (!guardQueue.length || guardScheduled) return;
      guardScheduled = true;
      W.setTimeout(function () {
        guardScheduled = false;
        var batch = guardQueue;
        guardQueue = [];
        runGuards(batch);
      }, 0);
    });
    mo.observe(D.body, { childList: true, subtree: true, characterData: true });
    var dirWatch = new W.MutationObserver(function () {
      if (guardBusy) return;
      if (D.documentElement.getAttribute("dir") !== "rtl") return;
      runGuards([D.body]);
    });
    dirWatch.observe(D.documentElement, { attributes: true, attributeFilter: ["dir", "lang"] });
    return mo;
  }
  TA.script = { mark: markThai, bidiGuard: bidiGuard, isThai: function (s) { return RE_THAI.test(s || ''); } };
  function boot() {
    TA.theme.apply();
    reflectTheme();
    runGuards([D.body]);
    try { watchGuards(); } catch (e) { }
    TA.nav.syncCurrent();
    TA.nav.installCondense();
    TA.nav.installCta();
    whenActive(function () {
      TA.nav.syncBadge();
      TA.nav.syncSaves();
    });
    try {
      if (W.localStorage.getItem(K_RAIL) === 'open') {
        var rail = D.querySelector('.ta-rail');
        if (rail) rail.setAttribute('data-open', '');
      }
    } catch (e) { }
    TA.on('change', function () { TA.nav.syncBadge(); TA.nav.syncSaves(); });
    W.addEventListener('storage', function (e) {
      if (e.key === K_SAVES) { savesCache = null; TA.nav.syncBadge(); TA.nav.syncSaves(); }
      if (e.key === K_TRIP) { tripCache = null; TA.nav.syncBadge(); emit('render', { reason: 'storage' }); }
    });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
;
(function () {
  'use strict';
  var W = window;
  var D = document;
  var TA = W.TA || (W.TA = {});
  var HAS_CLOSE_WATCHER = typeof W.CloseWatcher === 'function';
  var HAS_NAV_INTERCEPT = !!(W.navigation && typeof W.navigation.addEventListener === 'function');
  var stack = [];
  var meta = new WeakMap();
  var unwinding = false;
  function token() { return 'ta-sheet-' + Math.random().toString(36).slice(2, 9); }
  function top() { return stack.length ? stack[stack.length - 1] : null; }
  function focusable(dlg) {
    return dlg.querySelector(
      '[autofocus], button:not([disabled]), [href], input:not([type="hidden"]):not([disabled]),' +
      ' select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }
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
      if (TA.toast) TA.toast('Sheet could not open');
      return null;
    }
    if (HAS_CLOSE_WATCHER && !modal) {
      try {
        info.watcher = new W.CloseWatcher();
        info.watcher.onclose = function () { close(dlg, 'closewatcher'); };
      } catch (e) { info.watcher = null; }
    }
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
  D.addEventListener('cancel', function (ev) {
    var dlg = ev.target;
    if (!dlg || !dlg.matches || !dlg.matches('dialog')) return;
    ev.preventDefault();
    close(dlg, 'cancel');
  }, true);
  D.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || ev.defaultPrevented) return;
    var dlg = top();
    if (!dlg || !dlg.open) return;
    close(dlg, 'escape');
  });
  D.addEventListener('click', function (ev) {
    var dlg = ev.target;
    if (!dlg || dlg.tagName !== 'DIALOG' || !dlg.open) return;
    if (dlg.hasAttribute('data-no-light-dismiss')) return;
    var r = dlg.getBoundingClientRect();
    var inside = ev.clientY >= r.top && ev.clientY <= r.bottom &&
      ev.clientX >= r.left && ev.clientX <= r.right;
    if (!inside) close(dlg, 'backdrop');
  });
  if (!HAS_CLOSE_WATCHER && HAS_NAV_INTERCEPT) {
    W.navigation.addEventListener('navigate', function (ev) {
      var dlg = top();
      if (!dlg) return;
      if (ev.navigationType !== 'traverse') return;
      if (!ev.canIntercept || ev.hashChange || ev.downloadRequest !== null) return;
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
  W.addEventListener('popstate', function () {
    var dlg = top();
    if (!dlg) return;
    var info = meta.get(dlg);
    if (!info || !info.token) return;
    var st = history.state;
    if (st && st.taSheet === info.token) return;   /* still on our entry */
    close(dlg, 'popstate');
  });
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
;
const taSegmentThai = function (str) {
const s = String(str == null ? '' : str).trim();
if (!s) return [];
if (!/[฀-๿]/.test(s) || typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
return s.split(/\s+/).filter(Boolean);            /* graceful fallback */
}
try {
return [...new Intl.Segmenter('th', { granularity: 'word' }).segment(s)]
.filter(x => x.isWordLike).map(x => x.segment.trim()).filter(Boolean);
} catch (e) {
return s.split(/\s+/).filter(Boolean);
}
};
const taSegmentQuery = function (str) {
const words = taSegmentThai(str).join(' ');
return words ? words + ' ' + String(str) : String(str);
};
if (typeof globalThis !== 'undefined') {
const g = (globalThis.TA = globalThis.TA || {});
g.segmentThai = taSegmentThai;
g.segmentQuery = taSegmentQuery;
}