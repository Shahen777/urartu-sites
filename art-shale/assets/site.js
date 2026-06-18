/* ===========================================================================
   АРТ ШАЛЕ — shared interactions
   Custom cursor · magnetic buttons · reveal · count-up · parallax · nav
   All effects are progressive: content is fully visible without JS.
   =========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function () {

    /* ---- footer year ------------------------------------------------- */
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    /* ---- mobile menu ------------------------------------------------- */
    var burger = document.querySelector('.burger');
    var mnav = document.querySelector('.mnav');
    if (burger && mnav) {
      var close = mnav.querySelector('.mnav__close');
      var open = function(){ mnav.classList.add('is-open'); document.body.style.overflow='hidden'; };
      var shut = function(){ mnav.classList.remove('is-open'); document.body.style.overflow=''; };
      burger.addEventListener('click', open);
      if (close) close.addEventListener('click', shut);
      mnav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', shut); });
      document.addEventListener('keydown', function(e){ if(e.key==='Escape') shut(); });
    }

    /* ---- sticky header ----------------------------------------------- */
    var hdr = document.querySelector('.hdr');
    if (hdr && !hdr.classList.contains('hdr--light')) {
      var onScroll = function(){ hdr.classList.toggle('is-stuck', window.scrollY > 48); };
      window.addEventListener('scroll', onScroll, {passive:true});
      onScroll();
    } else if (hdr) {
      // inner pages: already light; add subtle shadow shift on scroll
      var onScroll2 = function(){ hdr.classList.toggle('is-stuck', window.scrollY > 48); };
      window.addEventListener('scroll', onScroll2, {passive:true});
      onScroll2();
    }

    /* ---- count-up ---------------------------------------------------- */
    function runCount(el){
      var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec||'0',10),
          suf = el.dataset.suf||'', pre = el.dataset.pre||'';
      if (reduce){ el.textContent = pre + (dec?to.toFixed(dec):to) + suf; return; }
      var dur = 1300, t0 = performance.now();
      (function step(now){
        var p = Math.min((now-t0)/dur, 1), e = 1-Math.pow(1-p,3), v = to*e;
        el.textContent = pre + (dec?v.toFixed(dec):Math.round(v)) + suf;
        if (p<1) requestAnimationFrame(step);
      })(performance.now());
    }

    /* ---- reveal + clip + kinetic + count (IntersectionObserver) ------ */
    var animated = document.querySelectorAll('.reveal,.clip-reveal,.kin');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          e.target.querySelectorAll('.count').forEach(runCount);
          io.unobserve(e.target);
        });
      }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
      animated.forEach(function(el){ io.observe(el); });

      // standalone counts not wrapped in an animated element
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ runCount(e.target); cio.unobserve(e.target);} });
      }, {threshold:.5});
      document.querySelectorAll('.count').forEach(function(el){
        if (!el.closest('.reveal,.clip-reveal,.kin')) cio.observe(el);
      });
    } else {
      // no-JS-style fallback: everything visible, counts set to final
      animated.forEach(function(el){ el.classList.add('in'); });
      document.querySelectorAll('.count').forEach(runCount);
    }
    // safety net: nothing stays hidden if observer never fires
    setTimeout(function(){
      document.querySelectorAll('.reveal:not(.in),.clip-reveal:not(.in),.kin:not(.in)')
        .forEach(function(el){ el.classList.add('in'); el.querySelectorAll('.count').forEach(runCount); });
    }, 2600);

    /* ---- parallax layers (transform only) ---------------------------- */
    var pxEls = [].slice.call(document.querySelectorAll('[data-px]'));
    if (pxEls.length && !reduce) {
      var ticking = false;
      var update = function(){
        var vh = window.innerHeight;
        pxEls.forEach(function(el){
          var r = el.getBoundingClientRect();
          var speed = parseFloat(el.dataset.px) || .12;
          var offset = (r.top + r.height/2 - vh/2) * -speed;
          el.style.transform = 'translate3d(0,'+offset.toFixed(1)+'px,0)';
        });
        ticking = false;
      };
      window.addEventListener('scroll', function(){
        if(!ticking){ ticking=true; requestAnimationFrame(update); }
      }, {passive:true});
      window.addEventListener('resize', update, {passive:true});
      update();
    }

    if (!fine || reduce) return; // cursor + magnet + tilt only on fine pointers

    /* ---- custom cursor (dot + inertial ring) ------------------------- */
    var dot = document.createElement('div'); dot.className='cursor-dot';
    var ring = document.createElement('div'); ring.className='cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my, shown=false;
    window.addEventListener('mousemove', function(e){
      mx=e.clientX; my=e.clientY;
      dot.style.left=mx+'px'; dot.style.top=my+'px';
      if(!shown){ document.documentElement.classList.add('cursor-on'); shown=true; }
    });
    (function loop(){
      rx += (mx-rx)*.16; ry += (my-ry)*.16;
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
      requestAnimationFrame(loop);
    })();
    var hotSel = 'a,button,.gitem,.tile,.room-card,.roomrow,input,select';
    document.querySelectorAll(hotSel).forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('is-hot'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('is-hot'); });
    });
    document.addEventListener('mouseleave', function(){ document.documentElement.classList.remove('cursor-on'); shown=false; });

    /* ---- magnetic buttons -------------------------------------------- */
    document.querySelectorAll('[data-magnet]').forEach(function(btn){
      var inner = btn.querySelector('.btn__mag') || btn;
      var strength = parseFloat(btn.dataset.magnet) || .35;
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2);
        var yy = (e.clientY - r.top - r.height/2);
        btn.style.transform = 'translate('+(x*strength)+'px,'+(yy*strength)+'px)';
        inner.style.transform = 'translate('+(x*strength*.4)+'px,'+(yy*strength*.4)+'px)';
      });
      btn.addEventListener('mouseleave', function(){
        btn.style.transform=''; inner.style.transform='';
      });
    });

    /* ---- tilt on photos ---------------------------------------------- */
    document.querySelectorAll('[data-tilt]').forEach(function(el){
      el.style.transformStyle='preserve-3d';
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX-r.left)/r.width-.5;
        var py = (e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(900px) rotateX('+(-py*5)+'deg) rotateY('+(px*5)+'deg)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  });
})();
