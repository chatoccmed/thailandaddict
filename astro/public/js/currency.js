/* ThailandAddict — client-side currency helper (roundups + hubs).
   Non-destructive: keeps the ฿ price and APPENDS "≈ $X" in the chosen currency.
   Indicative rates only (mid-2026), labelled as approximate. localStorage-persisted.
   No dependencies, no network, fails silent. */
(function () {
  'use strict';
  try {
    var KEY = 'ta-cur';
    // 1 THB → foreign. Indicative, refreshed manually (mid-2026). For guidance only.
    var RATES = { THB: 1, USD: 0.029, EUR: 0.0266, CNY: 0.208 };
    var SYM = { THB: '฿', USD: '$', EUR: '€', CNY: '¥' };
    var ORDER = ['THB', 'USD', 'EUR', 'CNY'];
    // Price containers across roundup pages + city/destination hubs.
    var SEL = '.hc-price, .price-big, .price-sub, .room-price, .toc-p, .compare-top td, .compare-section td, .cv-price, .pw-price, .pw-opt-pr, .pw-from, .resto-price';
    var isEn = (document.documentElement.getAttribute('lang') || 'th').toLowerCase().indexOf('en') === 0;
    var NOTE = isEn ? 'Indicative rates (mid-2026) · for guidance only' : 'อัตราโดยประมาณ (กลางปี 2026) · ใช้อ้างอิงเท่านั้น';

    function get() { try { var v = localStorage.getItem(KEY); return RATES[v] ? v : 'THB'; } catch (e) { return 'THB'; } }
    function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

    function fmt(n) {
      var v = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
      return v.toLocaleString('en-US');
    }

    // Wrap every "฿1,234" occurrence in the matched price elements so we can re-render on toggle.
    var found = 0;
    function tag() {
      var els = document.querySelectorAll(SEL);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.getAttribute('data-cv')) continue;
        if (el.innerHTML.indexOf('฿') === -1) { el.setAttribute('data-cv', '1'); continue; }
        el.innerHTML = el.innerHTML.replace(/฿\s?([\d,]+(?:\.\d+)?)/g, function (m, num) {
          var thb = parseFloat(num.replace(/,/g, ''));
          if (!isFinite(thb)) return m;
          found++;
          return '<span class="cvp" data-thb="' + thb + '">' + m + '<span class="cvx"></span></span>';
        });
        el.setAttribute('data-cv', '1');
      }
    }

    function render(cur) {
      var rate = RATES[cur], sym = SYM[cur];
      var spans = document.querySelectorAll('.cvp .cvx');
      for (var i = 0; i < spans.length; i++) {
        var p = spans[i].parentNode, thb = parseFloat(p.getAttribute('data-thb'));
        spans[i].textContent = (cur === 'THB' || !isFinite(thb)) ? '' : ' ≈ ' + sym + fmt(thb * rate);
      }
      var box = document.getElementById('cv-bar');
      if (box) {
        var btns = box.querySelectorAll('button[data-cur]');
        for (var j = 0; j < btns.length; j++) btns[j].className = (btns[j].getAttribute('data-cur') === cur) ? 'on' : '';
      }
    }

    function buildBar() {
      if (document.getElementById('cv-bar')) return;
      var rvBar = !!document.querySelector('.rvbar');               // review pages have a taller fixed booking bar (~110px)
      var liftMobile = rvBar || !!document.querySelector('.mbar, .mbarx');   // roundup/review pages have a mobile booking bar to clear
      var hasFab = !!document.querySelector('#taTripFab, .ta-tripfab'); // trip FAB sits bottom-right → put currency bottom-left to avoid overlap
      var sidePos = hasFab ? 'left:14px' : 'right:14px';
      var css = '#cv-bar{position:fixed;' + sidePos + ';bottom:16px;z-index:120;display:inline-flex;align-items:center;gap:2px;'
        + 'background:#fff;border:1.5px solid #06B6D4;border-radius:999px;padding:3px;box-shadow:0 8px 24px rgba(6,182,212,.22);'
        + "font-family:'Outfit','Noto Sans Thai',sans-serif;font-size:12px;font-weight:700}"
        + '#cv-bar .cv-ico{padding:0 5px 0 8px;color:#0891b2;font-size:13px}'
        + '#cv-bar button{border:0;background:none;color:#0891b2;padding:5px 9px;border-radius:999px;cursor:pointer;font:inherit;line-height:1.4}'
        + '#cv-bar button:hover{background:rgba(6,182,212,.10)}'
        + '#cv-bar button.on{background:#06B6D4;color:#fff}'
        + (liftMobile ? '@media(max-width:760px){#cv-bar{bottom:' + (rvBar ? '124px' : '72px') + '}}' : '');
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      var bar = document.createElement('div');
      bar.id = 'cv-bar'; bar.setAttribute('title', NOTE);
      bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', isEn ? 'Currency' : 'สกุลเงิน');
      var html = '<span class="cv-ico" aria-hidden="true">💱</span>';
      for (var i = 0; i < ORDER.length; i++) html += '<button type="button" data-cur="' + ORDER[i] + '">' + ORDER[i] + '</button>';
      bar.innerHTML = html;
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-cur]'); if (!b) return;
        var cur = b.getAttribute('data-cur'); set(cur); render(cur);
      });
      document.body.appendChild(bar);
    }

    function init() {
      tag();
      if (!found) return;            // no prices on this page → no toggle
      buildBar();
      render(get());
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  } catch (e) { /* fail silent — prices stay in ฿ */ }
})();
