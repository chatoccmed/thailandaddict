(function(){
  "use strict";
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. scroll-progress bar ---------- */
  function initProgress(){
    if (REDUCE) return;
    var bar = document.createElement('div');
    bar.id = 'ta-progress';
    (document.body || document.documentElement).appendChild(bar);
    var ticking = false;
    function update(){
      var d = document.documentElement;
      var h = (d.scrollHeight - d.clientHeight) || 1;
      var p = Math.min(100, Math.max(0, (window.scrollY || d.scrollTop || 0) / h * 100));
      bar.style.width = p + '%';
      ticking = false;
    }
    function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});
    update();
  }

  /* ---------- 1. hero headline mask-reveal ---------- */
  function initHero(){
    var h1 = document.querySelector('.hero-h1');
    if (!h1 || h1.dataset.taSplit) return;
    h1.dataset.taSplit = '1';

    if (REDUCE) return; // leave markup untouched; CSS shows it statically anyway

    // Wrap each top-level node (text token OR <em>) in .ta-mask > .ta-word,
    // preserving the <em> element (and its accent styling) intact.
    var nodes = Array.prototype.slice.call(h1.childNodes);
    var frag = document.createDocumentFragment();
    var idx = 0;
    nodes.forEach(function(node){
      var isText = node.nodeType === 3;
      if (isText && !node.textContent.trim()) { frag.appendChild(node); return; }
      var mask = document.createElement('span'); mask.className = 'ta-mask';
      var word = document.createElement('span'); word.className = 'ta-word';
      word.style.setProperty('--d', (idx * 90) + 'ms');
      word.appendChild(node.cloneNode(true)); // keeps <em> + its children
      mask.appendChild(word);
      frag.appendChild(mask);
      idx++;
    });
    h1.textContent = '';
    h1.appendChild(frag);

    // trigger on next frame so the initial translateY(110%) is painted first
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ h1.classList.add('ta-h1-ready'); });
    });
  }

  /* ---------- 2. scroll-reveal (sections, heads, cards) ---------- */
  var RV_SEL = '.sec, .s-head, .rgcard, .tcard, .hcard, .grescard, .pcard, .stat';
  var GRID_SEL = '.hgrid, .rggrid, .gres, .hscroll, .stats, .art-grid, .why-grid';
  var rvObserver = null;

  function markStagger(el){
    // give cards a per-grid index for a light stagger
    var grid = el.closest && el.closest(GRID_SEL);
    if (grid){
      var sibs = grid.querySelectorAll('.rgcard, .tcard, .hcard, .grescard, .pcard, .stat');
      for (var i=0;i<sibs.length;i++){ if(sibs[i]===el){ el.style.setProperty('--i', i % 8); break; } }
    }
  }

  function observe(el){
    if (!el || el.dataset.taRv) return;
    el.dataset.taRv = '1';
    el.classList.add('ta-rv');
    if (REDUCE){ el.classList.add('ta-in'); return; }
    markStagger(el);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92){
      // already in view on load → reveal without waiting for a scroll
      el.classList.add('ta-in');
      return;
    }
    rvObserver.observe(el);
  }

  function scan(root){
    (root || document).querySelectorAll(RV_SEL).forEach(observe);
  }

  function initReveal(){
    if (REDUCE){ scan(document); return; }
    rvObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('ta-in');
          rvObserver.unobserve(en.target);
        }
      });
    }, {threshold:0.14, rootMargin:'0px 0px -8% 0px'});

    scan(document);

    // .tcard (and other cards) are JS-generated AFTER load — watch for them.
    var containers = ['#topnscroll','#destscroll','#hotelgrid','#artgrid',
                      '#tier1','#tier2','#onerail','.hscroll','.rggrid','.gres','main','body'];
    var watched = [];
    containers.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(c){ if(watched.indexOf(c)<0) watched.push(c); });
    });
    if (watched.length){
      var mo = new MutationObserver(function(muts){
        for (var i=0;i<muts.length;i++){
          var added = muts[i].addedNodes;
          for (var j=0;j<added.length;j++){
            var n = added[j];
            if (n.nodeType !== 1) continue;
            if (n.matches && n.matches(RV_SEL)) observe(n);
            if (n.querySelectorAll) scan(n);
          }
        }
      });
      watched.forEach(function(c){ mo.observe(c,{childList:true,subtree:true}); });
    }
    // belt-and-suspenders re-sweeps for late generators
    setTimeout(function(){ scan(document); }, 400);
    setTimeout(function(){ scan(document); }, 1400);
  }

  /* ---------- 3. count-up on .stat .n ---------- */
  function parseStat(txt){
    var m = txt.match(/^(\D*)([\d.,]+)(\D*)$/);
    if (!m) return null;
    var num = parseFloat(m[2].replace(/,/g,''));
    if (isNaN(num)) return null;
    var hasComma = /,/.test(m[2]);
    var decimals = (m[2].split('.')[1] || '').length;
    return {prefix:m[1], suffix:m[3], target:num, hasComma:hasComma, decimals:decimals};
  }
  function fmt(v, info){
    var s = info.decimals ? v.toFixed(info.decimals) : String(Math.round(v));
    if (info.hasComma){
      var parts = s.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      s = parts.join('.');
    }
    return info.prefix + s + info.suffix;
  }
  function runCount(el){
    if (el.dataset.taCount) return;
    el.dataset.taCount = '1';
    var info = parseStat(el.textContent.trim());
    if (!info){ return; }
    if (REDUCE){ el.textContent = fmt(info.target, info); return; }
    var dur = 1300, start = null;
    function step(ts){
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = fmt(info.target * eased, info);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = fmt(info.target, info);
    }
    requestAnimationFrame(step);
  }
  function initCount(){
    var nums = document.querySelectorAll('.stat .n');
    if (!nums.length) return;
    if (REDUCE || !('IntersectionObserver' in window)){
      nums.forEach(runCount); return;
    }
    var band = (nums[0].closest && nums[0].closest('.stats')) || null;
    var target = band || null;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          nums.forEach(runCount);
          io.disconnect();
        }
      });
    }, {threshold:0.3});
    if (target) io.observe(target);
    else nums.forEach(function(n){ io.observe(n); });
  }

  /* ---------- boot ---------- */
  function boot(){
    initProgress();
    initHero();
    initReveal();
    initCount();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();