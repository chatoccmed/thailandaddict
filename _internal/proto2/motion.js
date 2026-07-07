(function(){
  var d=document, root=d.documentElement;
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Signal JS is live so the CSS "start hidden" states apply.
     Without this class (JS off / error before this line) everything is visible. */
  root.classList.add('mjs');
  (function(){var nav=d.querySelector('.nav'); if(nav) nav.classList.add('solid');})();

  /* ── SCROLL-PROGRESS BAR ── */
  if(!RM){
    var bar=d.createElement('div'); bar.className='m-prog'; d.body.appendChild(bar);
    var raf=0;
    var onScroll=function(){
      if(raf) return;
      raf=requestAnimationFrame(function(){
        raf=0;
        var h=d.documentElement, max=h.scrollHeight-h.clientHeight;
        var p=max>0 ? (h.scrollTop||window.pageYOffset)/max : 0;
        bar.style.transform='scaleX('+Math.min(1,Math.max(0,p))+')';
      });
    };
    addEventListener('scroll',onScroll,{passive:true});
    addEventListener('resize',onScroll,{passive:true}); onScroll();
  }

  /* ── HERO HEADLINE MASK-REVEAL (split into its two Thai tokens) ──
     Markup: <h1 class="hero-h1">ชีวิต<em>ติดเที่ยว</em></h1>
     Build:  <span class="word-mask"><span class="word">ชีวิต</span></span>
             <span class="word-mask"><span class="word"><em>ติดเที่ยว</em></span></span>
     Ready class (mrdy) goes ON .hero-h1 → CSS targets .hero-h1.mrdy .word */
  (function(){
    var h1=d.querySelector('.hero-h1'); if(!h1) return;
    var tokens=[];
    Array.prototype.forEach.call(h1.childNodes,function(n){
      if(n.nodeType===3){ var t=n.textContent; if(t && t.trim()) tokens.push(t); }
      else if(n.nodeType===1){ tokens.push(n.outerHTML); }
    });
    if(!tokens.length) return;
    h1.innerHTML=tokens.map(function(html){
      return '<span class="word-mask"><span class="word">'+html+'</span></span>';
    }).join('');
    if(RM){ h1.classList.add('mrdy'); return; }
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      h1.classList.add('mrdy');
    });});
  })();

  /* ── STAT COUNT-UP — parse "2,200+", "4,000+", "77"; "100%" has no data-stat → static ── */
  (function(){
    var nodes=d.querySelectorAll('.stat .n[data-stat]');
    if(!nodes.length) return;
    Array.prototype.forEach.call(nodes,function(el){
      var raw=el.textContent.trim();
      var m=raw.match(/([\d,]+)/); if(!m) return;
      var end=parseInt(m[1].replace(/,/g,''),10); if(isNaN(end)) return;
      var suffix=raw.slice(m.index+m[1].length);
      if(RM){ return; }
      var done=false;
      var run=function(){
        if(done) return; done=true;
        var dur=1150, t0=performance.now();
        var tick=function(t){
          var p=Math.min(1,(t-t0)/dur);
          var eased=1-Math.pow(1-p,3);
          el.textContent=Math.round(end*eased).toLocaleString('en-US')+suffix;
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      if('IntersectionObserver' in window){
        var io=new IntersectionObserver(function(es,o){
          es.forEach(function(e){ if(e.isIntersecting){ o.disconnect(); run(); } });
        },{threshold:.6});
        io.observe(el);
      } else run();
    });
  })();

  /* ── SCROLL-REVEAL for cards (+ one-time shine on glass cards) ──
     Section wrappers/.s-head already fade via the site's .rv system; we reveal
     the individual cards with a light stagger, and rescan for late .tcard/.dest. */
  (function(){
    if(RM){ return; }
    var SEL='.stat,.rgcard,.tcard,.hcard,.acard,.grescard,.dest,.why';
    var revObs, shineSet=new WeakSet();

    var reveal=function(el,i){
      el.classList.add('m-in');
      var delay=(i||0)*70; if(delay) el.style.transitionDelay=delay+'ms';
      if(el.classList.contains('stat') && !shineSet.has(el)){
        shineSet.add(el);
        el.classList.add('m-shine');
        setTimeout(function(){ el.classList.add('m-swept'); }, 520+delay);
      }
    };

    if('IntersectionObserver' in window){
      revObs=new IntersectionObserver(function(es,o){
        var hit=[]; es.forEach(function(e){ if(e.isIntersecting){ hit.push(e.target); o.unobserve(e.target); } });
        hit.forEach(function(t,i){ reveal(t,i); });
      },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    }

    var scan=function(ctx){
      var list=(ctx||d).querySelectorAll(SEL);
      Array.prototype.forEach.call(list,function(el){
        if(el.classList.contains('m-rv')) return;
        el.classList.add('m-rv');
        if(revObs){
          var r=el.getBoundingClientRect();
          if(r.top<innerHeight && r.bottom>0) reveal(el,0);
          else revObs.observe(el);
        } else reveal(el,0);
      });
    };
    scan(d);

    var sc=d.querySelector('.search-card');
    if(sc){ sc.classList.add('m-shine'); setTimeout(function(){ sc.classList.add('m-swept'); }, 1100); }

    if('MutationObserver' in window){
      var mo=new MutationObserver(function(muts){
        for(var i=0;i<muts.length;i++){
          if(muts[i].addedNodes && muts[i].addedNodes.length){ scan(d); break; }
        }
      });
      ['onerail','destscroll'].forEach(function(id){ var n=d.getElementById(id); if(n) mo.observe(n,{childList:true,subtree:true}); });
    }
  })();

  /* safety net: if IntersectionObserver never fires, un-hide after 1.6s */
  setTimeout(function(){
    Array.prototype.forEach.call(d.querySelectorAll('.m-rv:not(.m-in)'),function(el){ el.classList.add('m-in'); });
  },1600);
})();