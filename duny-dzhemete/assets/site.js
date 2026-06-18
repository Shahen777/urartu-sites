/* Дюны Джемете — interactions 2026 */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- year ---- */
  var y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mmenu');
  var mclose = document.getElementById('mclose');
  function closeMenu(){ if(mmenu){ mmenu.classList.remove('open'); document.body.style.overflow=''; } }
  function openMenu(){ if(mmenu){ mmenu.classList.add('open'); document.body.style.overflow='hidden'; } }
  if(burger) burger.addEventListener('click', openMenu);
  if(mclose) mclose.addEventListener('click', closeMenu);
  if(mmenu) mmenu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });

  /* ---- header: scrolled + hide on scroll-down ---- */
  var hdr = document.getElementById('hdr');
  var lastY = 0;
  function onScroll(){
    var sy = window.scrollY;
    if(hdr){
      hdr.classList.toggle('scrolled', sy > 30);
      if(sy > 600 && sy > lastY + 4){ hdr.classList.add('hide'); }
      else if(sy < lastY - 4 || sy < 200){ hdr.classList.remove('hide'); }
    }
    lastY = sy;
    /* hero parallax */
    if(heroImg && !reduce){
      var off = sy * 0.28;
      heroImg.style.transform = 'translate3d(0,'+off+'px,0)';
    }
    if(cta && !reduce){
      var r = cta.getBoundingClientRect();
      var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      cta.style.transform = 'translate3d(0,'+((p-0.5)*-40)+'px,0) scale(1.12)';
    }
  }
  var heroImg = document.querySelector('[data-parallax="hero"]');
  var cta = document.querySelector('[data-parallax="cta"]');
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- hero loaded (text mask reveal) ---- */
  var hero = document.querySelector('.hero');
  if(hero){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ hero.classList.add('loaded'); }); }); }

  /* ---- reveal observer ---- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.14, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal, .reveal-clip').forEach(function(el){ io.observe(el); });

  /* ---- count-up ---- */
  function countUp(el){
    var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec||'0',10), dur=1600, t0=performance.now();
    function step(now){
      var p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
      el.textContent = (to*e).toFixed(dec);
      if(p<1) requestAnimationFrame(step); else el.textContent = to.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        if(reduce){ e.target.textContent = parseFloat(e.target.dataset.to).toFixed(parseInt(e.target.dataset.dec||'0',10)); }
        else countUp(e.target);
        cio.unobserve(e.target);
      }
    });
  }, {threshold:0.6});
  document.querySelectorAll('.countup').forEach(function(el){ cio.observe(el); });

  /* ---- custom cursor + magnetic (desktop, motion ok) ---- */
  if(fine && !reduce){
    var dot = document.createElement('div'); dot.className='cursor-dot';
    var ring = document.createElement('div'); ring.className='cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
    window.addEventListener('mousemove', function(e){
      mx=e.clientX; my=e.clientY;
      dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
    });
    (function loop(){
      rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
      ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .gitem, .roomcard, .bento .cell, input, select, textarea').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('grow'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('grow'); });
    });

    /* magnetic buttons */
    document.querySelectorAll('.magnetic').forEach(function(m){
      var strength = 0.32;
      m.addEventListener('mousemove', function(e){
        var r = m.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width/2);
        var yy = e.clientY - (r.top + r.height/2);
        m.style.transform = 'translate('+(x*strength)+'px,'+(yy*strength)+'px)';
      });
      m.addEventListener('mouseleave', function(){ m.style.transform=''; });
    });
  }

  /* ---- gallery lightbox ---- */
  var grid = document.getElementById('grid');
  if(grid){
    var imgs = [].slice.call(grid.querySelectorAll('img'));
    var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg');
    var idx = 0;
    function show(i){ idx=(i+imgs.length)%imgs.length; lbImg.src = imgs[idx].dataset.full || imgs[idx].src; lb.classList.add('open'); document.body.style.overflow='hidden'; }
    function hide(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    imgs.forEach(function(im,i){ im.parentElement.addEventListener('click', function(){ show(i); }); });
    var c=document.getElementById('lbClose'), n=document.getElementById('lbNext'), p=document.getElementById('lbPrev');
    if(c) c.addEventListener('click', hide);
    if(n) n.addEventListener('click', function(e){ e.stopPropagation(); show(idx+1); });
    if(p) p.addEventListener('click', function(e){ e.stopPropagation(); show(idx-1); });
    if(lb) lb.addEventListener('click', function(e){ if(e.target===lb) hide(); });
    document.addEventListener('keydown', function(e){
      if(!lb || !lb.classList.contains('open')) return;
      if(e.key==='Escape') hide();
      if(e.key==='ArrowRight') show(idx+1);
      if(e.key==='ArrowLeft') show(idx-1);
    });
  }

  /* ---- booking form ---- */
  var form = document.getElementById('bookForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ph = document.getElementById('phone');
      var echo = document.getElementById('echoPhone');
      if(echo) echo.textContent = (ph && ph.value) || 'указанному телефону';
      form.classList.add('hidden'); form.style.display='none';
      var ok = document.getElementById('success'); if(ok) ok.style.display='block';
      var f = document.getElementById('form'); if(f) f.scrollIntoView({behavior:'smooth', block:'center'});
    });
    var cin = document.getElementById('cin'), cout = document.getElementById('cout');
    if(cin && cout){
      var today = new Date().toISOString().split('T')[0];
      cin.min = today; cout.min = today;
      cin.addEventListener('change', function(){ cout.min = cin.value; if(cout.value && cout.value < cin.value) cout.value = cin.value; });
    }
  }
})();
