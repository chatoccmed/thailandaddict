/* TA PREMIUM SURGICAL (proto3) motion — mask-reveal หัวข้อ + count-up ตัวเลข
   (ที่เหลือ hover/gloss เป็น CSS ล้วน) · เคารพ prefers-reduced-motion */
(function(){
  var d=document, root=d.documentElement;
  var RM=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('mjs');   /* บอก CSS ว่า JS พร้อม (กันหัวข้อหายถ้า JS ล่ม) */

  /* 1) HERO HEADLINE mask-reveal — แยกเป็น 2 คำไทย ("ชีวิต" + <em>ติดเที่ยว</em>) */
  (function(){
    var h1=d.querySelector('.hero-h1'); if(!h1) return;
    var toks=[];
    Array.prototype.forEach.call(h1.childNodes,function(n){
      if(n.nodeType===3){ var t=n.textContent; if(t && t.trim()) toks.push(t); }
      else if(n.nodeType===1){ toks.push(n.outerHTML); }
    });
    if(!toks.length) return;
    h1.innerHTML=toks.map(function(x){
      return '<span class="word-mask"><span class="word">'+x+'</span></span>';
    }).join('');
    if(RM){ h1.classList.add('mrdy'); return; }
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      h1.classList.add('mrdy');
    });});
    /* failsafe: rAF ถูก throttle/pause ตอน tab พื้นหลัง → ประกันว่าหัวข้อโผล่แน่ */
    setTimeout(function(){ h1.classList.add('mrdy'); }, 140);
  })();

  /* 2) COUNT-UP ตัวเลขสถิติ (77 / 2,200+ / 4,000+ ; "100%" ไม่มี data-stat = คงที่) */
  (function(){
    var nodes=d.querySelectorAll('.stat .n[data-stat]'); if(!nodes.length) return;
    Array.prototype.forEach.call(nodes,function(el){
      var raw=el.textContent.trim(), m=raw.match(/([\d,]+)/); if(!m) return;
      var end=parseInt(m[1].replace(/,/g,''),10); if(isNaN(end)) return;
      var suf=raw.slice(m.index+m[1].length);
      if(RM) return;
      var ran=false, run=function(){
        if(ran) return; ran=true;
        var dur=1200, t0=performance.now();
        (function tick(t){
          var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
          el.textContent=Math.round(end*e).toLocaleString('en-US')+suf;
          if(p<1) requestAnimationFrame(tick);
        })(t0);
      };
      if('IntersectionObserver' in window){
        var io=new IntersectionObserver(function(es,o){
          es.forEach(function(e){ if(e.isIntersecting){ o.disconnect(); run(); } });
        },{threshold:.5});
        io.observe(el);
      } else run();
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
