/* Анапский Бриз — bespoke motion · Urartu AI Studio 2026 */
(function(){
  'use strict';
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* year */
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* mobile menu */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      burger.textContent = open ? '×' : '☰';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menu.classList.remove('open'); burger.textContent='☰'; document.body.style.overflow='';
      });
    });
  }

  /* sticky header transform */
  var header = document.querySelector('.site-header');
  if(header){
    var onScroll = function(){ header.classList.toggle('scrolled', window.scrollY > 30); };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* reveal w/ stagger */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal,.clip-reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal,.clip-reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* count-up */
  function fmt(n,dec){ return n.toLocaleString('ru-RU',{minimumFractionDigits:dec,maximumFractionDigits:dec}); }
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count')); if(isNaN(target)) return;
    var dec = parseInt(el.getAttribute('data-decimals')||'0',10);
    var suf = el.getAttribute('data-suffix')||'';
    if(reduce){ el.textContent = fmt(target,dec)+suf; return; }
    var dur=1300, start=null;
    function step(ts){ if(!start)start=ts; var p=Math.min((ts-start)/dur,1); var e=1-Math.pow(1-p,3);
      el.textContent = fmt(target*e,dec)+suf; if(p<1)requestAnimationFrame(step); else el.textContent=fmt(target,dec)+suf; }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } }); }, {threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });
  }

  /* hero + layer parallax (transform only) */
  if(!reduce){
    var pars = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    var heroBg = document.querySelector('.hero-bg');
    var ticking=false;
    window.addEventListener('scroll', function(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        if(heroBg && y < window.innerHeight*1.2){ heroBg.style.transform = 'translateY('+(y*0.18)+'px)'; }
        pars.forEach(function(el){
          var sp = parseFloat(el.getAttribute('data-parallax'))||0.12;
          var r = el.getBoundingClientRect();
          var off = (r.top + r.height/2 - window.innerHeight/2);
          el.style.transform = 'translateY('+(-off*sp)+'px)';
        });
        ticking=false;
      });
    }, {passive:true});
  }

  /* custom cursor + inertia */
  if(fine && !reduce){
    document.body.classList.add('cursor-on');
    var dot=document.createElement('div'); dot.className='cursor-dot';
    var ring=document.createElement('div'); ring.className='cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx=innerWidth/2,my=innerHeight/2, rx=mx,ry=my;
    window.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY;
      dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; });
    (function loop(){ rx+=(mx-rx)*0.16; ry+=(my-ry)*0.16;
      ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
    document.querySelectorAll('a,button,.gal-item,.room-card,.cell,.cc,[data-lb]').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('is-hot'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('is-hot'); });
    });
  }

  /* magnetic buttons */
  if(fine && !reduce){
    document.querySelectorAll('[data-magnetic]').forEach(function(btn){
      var str = 0.3;
      btn.addEventListener('mousemove', function(e){
        var r=btn.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*str, y=(e.clientY-r.top-r.height/2)*str;
        btn.style.transform='translate('+x+'px,'+y+'px)';
      });
      btn.addEventListener('mouseleave', function(){ btn.style.transform=''; });
    });
  }

  /* lightbox */
  var lb = document.getElementById('lightbox');
  if(lb){
    var lbImg=lb.querySelector('img');
    var items=Array.prototype.slice.call(document.querySelectorAll('[data-lb]'));
    var idx=0;
    function show(i){ idx=(i+items.length)%items.length; lbImg.src=items[idx].getAttribute('data-lb'); }
    items.forEach(function(it,i){ it.addEventListener('click', function(){ lb.classList.add('open'); show(i); }); });
    lb.querySelector('.lb-close').addEventListener('click', function(){ lb.classList.remove('open'); });
    lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); show(idx-1); });
    lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); show(idx+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') lb.classList.remove('open');
      if(e.key==='ArrowLeft') show(idx-1);
      if(e.key==='ArrowRight') show(idx+1);
    });
  }

  /* booking form */
  var form = document.getElementById('bookForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok=document.getElementById('formOk');
      form.style.display='none'; if(ok) ok.style.display='block';
    });
  }
})();
