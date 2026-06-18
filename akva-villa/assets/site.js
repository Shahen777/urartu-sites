/* ===========================================================================
   Аква вилла — shared motion & interaction layer · Urartu AI Studio 2026
   transform/opacity only · respects prefers-reduced-motion · no-JS safe
   =========================================================================== */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- year ---- */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu){
    burger.addEventListener('click', function(){ menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ menu.classList.remove('open'); }); });
  }

  /* ---- sticky header: shrink + hide on scroll down ---- */
  var header = document.getElementById('siteHeader');
  if (header){
    var last = 0;
    var hdr = function(){
      var sy = window.pageYOffset;
      header.classList.toggle('scrolled', sy > 16);
      if (sy > 260 && sy > last + 4){ header.classList.add('hide'); }
      else if (sy < last - 4 || sy < 120){ header.classList.remove('hide'); }
      last = sy;
    };
    hdr(); window.addEventListener('scroll', hdr, {passive:true});
  }

  /* ---- reveal + stagger via IntersectionObserver ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-stagger]'));
  if (!reduce && 'IntersectionObserver' in window){
    // stagger siblings sharing a parent for plain .reveal
    var groups = new Map();
    document.querySelectorAll('.reveal').forEach(function(el){
      if (el.hasAttribute('data-stagger')) return;
      var p = el.parentElement;
      var i = groups.get(p) || 0; groups.set(p, i+1);
      el.style.transitionDelay = (Math.min(i,6) * 80) + 'ms';
    });
    document.querySelectorAll('[data-stagger]').forEach(function(c){
      Array.prototype.slice.call(c.children).forEach(function(ch,i){ ch.style.transitionDelay = (i*90)+'ms'; });
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -7% 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }
  // failsafe
  setTimeout(function(){ revealEls.forEach(function(el){ if(!el.classList.contains('in')) el.classList.add('in'); }); }, 2600);

  /* ---- count-up ---- */
  var easeOut = function(t){ return 1 - Math.pow(1-t,3); };
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var suffix = el.getAttribute('data-suffix')||'';
    if (reduce){ el.textContent = target.toFixed(dec)+suffix; return; }
    var dur = 1500, start = performance.now();
    (function step(now){
      var p = Math.min((now-start)/dur,1);
      el.textContent = (target*easeOut(p)).toFixed(dec)+suffix;
      if (p<1) requestAnimationFrame(step);
    })(start);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
    }, {threshold:0.6});
    counters.forEach(function(c){ cio.observe(c); });
  } else {
    counters.forEach(countUp);
  }

  /* ---- hero parallax (subtle) ---- */
  var heroImg = document.getElementById('heroImg');
  if (heroImg && !reduce){
    var t = false;
    window.addEventListener('scroll', function(){
      if (t) return; t = true;
      requestAnimationFrame(function(){
        var sy = Math.min(window.pageYOffset, 800);
        heroImg.style.transform = 'translate3d(0,'+(sy*0.16)+'px,0) scale(1.16)';
        t = false;
      });
    }, {passive:true});
  }

  /* ---- generic [data-parallax] layers ---- */
  var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (pEls.length && !reduce){
    var pt = false;
    var run = function(){
      if (pt) return; pt = true;
      requestAnimationFrame(function(){
        var vh = window.innerHeight;
        pEls.forEach(function(el){
          var r = el.getBoundingClientRect();
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          var off = (r.top + r.height/2 - vh/2) * -speed;
          el.style.transform = 'translate3d(0,'+off.toFixed(1)+'px,0)';
        });
        pt = false;
      });
    };
    run(); window.addEventListener('scroll', run, {passive:true});
  }

  /* ---- custom cursor (desktop only) ---- */
  var dot = document.getElementById('cDot');
  var ring = document.getElementById('cRing');
  if (dot && ring && fine && !reduce){
    var mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
    window.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; });
    (function loop(){
      rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
      ring.style.transform = 'translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, [data-cursor]').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('is-hover'); });
    });
    document.addEventListener('mouseleave', function(){ dot.style.opacity='0'; ring.style.opacity='0'; });
    document.addEventListener('mouseenter', function(){ dot.style.opacity='1'; ring.style.opacity='1'; });
  } else if (dot && ring){
    dot.style.display='none'; ring.style.display='none';
  }

  /* ---- magnetic buttons ---- */
  if (fine && !reduce){
    document.querySelectorAll('.magnetic').forEach(function(el){
      var strength = 0.32;
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width/2) * strength;
        var yy = (e.clientY - r.top - r.height/2) * strength;
        el.style.transform = 'translate('+x+'px,'+yy+'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  /* ---- gallery lightbox (gallery.html) ---- */
  var lb = document.getElementById('lightbox');
  if (lb){
    var lbImg = lb.querySelector('img');
    var lbCap = document.getElementById('lbCaption');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gitem'));
    var cur = 0;
    function open(i){
      cur = (i+items.length)%items.length;
      var el = items[cur];
      lbImg.src = el.getAttribute('data-full') || el.querySelector('img').src;
      lbCap.textContent = el.getAttribute('data-caption') || '';
      lb.classList.add('open'); document.body.style.overflow='hidden';
    }
    function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    items.forEach(function(el,i){ el.addEventListener('click', function(){ open(i); }); });
    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function(e){ e.stopPropagation(); open(cur-1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function(e){ e.stopPropagation(); open(cur+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb || e.target.tagName==='FIGURE') close(); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key==='Escape') close();
      if (e.key==='ArrowLeft') open(cur-1);
      if (e.key==='ArrowRight') open(cur+1);
    });
  }

  /* ---- booking form (contacts.html) ---- */
  var form = document.getElementById('bookingForm');
  if (form){
    var success = document.getElementById('bookingSuccess');
    var ci = form.querySelector('[name="checkin"]'), co = form.querySelector('[name="checkout"]');
    var today = new Date().toISOString().split('T')[0];
    if (ci) ci.min = today; if (co) co.min = today;
    if (ci && co) ci.addEventListener('change', function(){ co.min = ci.value || today; });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.checkValidity()){ form.reportValidity(); return; }
      form.style.display='none';
      success.style.display='block';
      success.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }
})();
