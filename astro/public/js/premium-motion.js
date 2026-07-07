/* ============================================================
   TA PREMIUM SURGICAL — SITE-WIDE motion  (premium-motion.js)
   Mask-reveal hero heading + count-up numeric displays for the
   HOTEL / ROUNDUP / ARTICLE / HUB page types. Dependency-free IIFE.
   The rest (hover / gloss / shine) is pure CSS in premium.css.
   Respects prefers-reduced-motion. Safe if any target is absent.
   ============================================================ */
(function(){
  var d=document, root=d.documentElement;
  var RM=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('mjs');   /* tell CSS the JS is live (prevents a hidden heading if JS dies) */

  /* ---------- 1) HERO HEADING mask-reveal ----------
     Accept a PRIORITIZED list of candidate heading selectors; split the
     FIRST one found. Some candidates (hotel .hi-name, and a fallback H1)
     are DIVs / shared elements, so we tag them with a host class the CSS
     keys off (.mrdy-host) instead of assuming a fixed element class. */
  (function(){
    var CANDIDATES=[
      '.rhero h1',            /* ARTICLE resto/activity immersive hero */
      '.rl-page .hero h1',    /* ROUNDUP hero (scoped to .rl-page) */
      '.phero h1',            /* HUB province / bangkok-area image hero */
      '.thero h1',            /* HUB region / country / tourist-cities text hero */
      '.ahub-hero h1',        /* HUB activities hero */
      '.hero > .wrap > h1',   /* ARTICLE light hero */
      '.hero-info .hi-name',  /* HOTEL big visual headline (a DIV, not the h1) */
      'main .fade-up .sec-title' /* HOTEL true H1 fallback (first section-title = the h1) */
    ];
    var h=null, i;
    for(i=0;i<CANDIDATES.length;i++){
      h=d.querySelector(CANDIDATES[i]);
      if(h) break;
    }
    if(!h) return;

    /* elements that are DIVs / shared-class need an explicit host hook for CSS */
    if(!h.matches('.rhero h1, .rl-page .hero h1, .phero h1, .thero h1, .ahub-hero h1')){
      h.classList.add(h.tagName==='H1' ? 'page-h1' : 'hi-name');
      h.classList.add('mrdy-host');
    }

    /* split into whitespace/element tokens, wrap each in .word-mask>.word */
    var toks=[];
    Array.prototype.forEach.call(h.childNodes,function(n){
      if(n.nodeType===3){ /* text node → split into words so each reveals */
        var parts=n.textContent.split(/(\s+)/);
        parts.forEach(function(p){ if(p && p.trim()) toks.push(escapeText(p)); });
      } else if(n.nodeType===1){ toks.push(n.outerHTML); }
    });
    if(!toks.length) return;
    h.innerHTML=toks.map(function(x){
      return '<span class="word-mask"><span class="word">'+x+'</span></span>';
    }).join(' ');

    if(RM){ h.classList.add('mrdy'); return; }
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      h.classList.add('mrdy');
    });});
    /* failsafe: rAF is throttled/paused for a backgrounded tab → guarantee reveal */
    setTimeout(function(){ h.classList.add('mrdy'); }, 140);

    function escapeText(s){
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
  })();

  /* ---------- 2) COUNT-UP numeric displays ----------
     Target rating/score/price number nodes across all page types.
     Rules:
       - only nodes whose text is PURELY numeric (digits, commas, one dot,
         a leading currency/symbol prefix, a trailing non-letter suffix like
         "/10" or "+"). Skip anything containing letters (a–z / ก–๙) so we
         never mangle "★ 4.8 · 1,234 รีวิว" style mixed strings.
       - guard NaN.
       - SKIP nodes already animated by a layout's own observer
         (hotel .r-num and .rbar-fill) — never double-animate. */
  (function(){
    var SEL=[
      /* HOTEL */
      '.qi-val','.pw-price','.pr-sc',
      /* ROUNDUP */
      '.price-big','.stat-pill strong',
      /* HUB */
      '.cstat .n',
      /* ARTICLE */
      '.resto-price .pv'
    ].join(',');

    var nodes=d.querySelectorAll(SEL);
    if(!nodes.length) return;

    // letters we must NOT tween across (latin + thai + common CJK/greek)
    var LETTER=/[A-Za-z฀-๿-一-鿿]/;

    Array.prototype.forEach.call(nodes,function(el){
      if(RM) return;
      // never touch nodes owned by another animation
      if(el.closest && el.closest('.r-num, .rbar-fill')) return;
      if(el.classList && (el.classList.contains('r-num')||el.classList.contains('rbar-fill'))) return;

      var raw=el.textContent.trim();
      if(!raw) return;
      // reject any node that contains letters — must be a clean numeric display
      if(LETTER.test(raw)) return;

      // capture: [prefix non-digit][number w/ commas + optional decimal][suffix]
      var m=raw.match(/^(\D*?)([\d,]+(?:\.\d+)?)(\D*)$/);
      if(!m) return;
      var pre=m[1], numStr=m[2], suf=m[3];
      var hasDot=numStr.indexOf('.')!==-1;
      var end=parseFloat(numStr.replace(/,/g,''));
      if(isNaN(end)) return;
      // decimals count (e.g. score 9.1 → 1 place) so we don't lose ".1"
      var dp=hasDot ? (numStr.split('.')[1]||'').length : 0;
      // preserve thousands-grouping only if the original had a comma
      var grouped=numStr.indexOf(',')!==-1;

      var run=function(){
        var dur=1200, t0=performance.now();
        (function tick(t){
          var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
          var cur=end*e;
          var out= dp>0
            ? cur.toFixed(dp)
            : (grouped ? Math.round(cur).toLocaleString('en-US') : String(Math.round(cur)));
          el.textContent=pre+out+suf;
          if(p<1) requestAnimationFrame(tick);
        })(t0);
      };

      var ran=false, once=function(){ if(ran) return; ran=true; run(); };
      if('IntersectionObserver' in window){
        var io=new IntersectionObserver(function(es,o){
          es.forEach(function(en){ if(en.isIntersecting){ o.disconnect(); once(); } });
        },{threshold:.5});
        io.observe(el);
      } else once();
    });
  })();

  /* reading progress bar */
  if(!RM){
    var pbar=d.createElement("div"); pbar.className="ta-progress"; (d.body||root).appendChild(pbar);
    var pt=false;
    addEventListener("scroll",function(){ if(pt)return; pt=true; requestAnimationFrame(function(){pt=false;
      var hh=root.scrollHeight-root.clientHeight; pbar.style.width=(hh>0?(root.scrollTop||window.pageYOffset)/hh*100:0)+"%";});},{passive:true});
  }


  /* back-to-top (skip pages that already have a sticky bottom bar) */
  if(!d.querySelector(".rvbar")){
    var toTop=d.createElement("button"); toTop.className="ta-top"; toTop.type="button";
    toTop.setAttribute("aria-label","กลับขึ้นบนสุด"); toTop.innerHTML="↑";
    (d.body||root).appendChild(toTop);
    var tt=false;
    addEventListener("scroll",function(){ if(tt)return; tt=true; requestAnimationFrame(function(){tt=false;
      toTop.classList.toggle("show",(root.scrollTop||window.pageYOffset)>600);});},{passive:true});
    toTop.addEventListener("click",function(){ try{scrollTo({top:0,behavior:RM?"auto":"smooth"});}catch(e){scrollTo(0,0);} });
  }

})();