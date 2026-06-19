/* === Бутик-отель «Флорентина» · bespoke 2026 interactions === */
(function(){
  "use strict";
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* year */
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* sticky header */
  var header = document.querySelector('.site-header');
  function onScroll(){ if(header){ header.classList.toggle('scrolled', window.scrollY > 24); } }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* mobile menu */
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');
  if(burger && menu){
    burger.addEventListener('click', function(){ menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ menu.classList.remove('open'); }); });
  }

  /* stagger reveals within shared parent */
  document.querySelectorAll('.reveal,.reveal-clip').forEach(function(el){
    var p = el.parentElement; (p.__rev || (p.__rev=[])).push(el);
  });
  document.querySelectorAll('.reveal,.reveal-clip').forEach(function(el){
    var arr = el.parentElement.__rev;
    if(arr && arr.length > 1){ el.style.setProperty('--rd', Math.min(arr.indexOf(el),7)*85 + 'ms'); }
  });

  /* reveal on scroll */
  var reveals = document.querySelectorAll('.reveal,.reveal-clip');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.14, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(r){ io.observe(r); });
    /* Safety: reveal anything already within (or above) the first viewport on load,
       so a non-scrolling render (crawler/screenshot) never shows hidden/clipped blocks. */
    requestAnimationFrame(function(){
      var vh = window.innerHeight;
      reveals.forEach(function(r){
        var t = r.getBoundingClientRect().top;
        if(t < vh * 0.92){ r.classList.add('in'); io.unobserve(r); }
      });
    });
  } else { reveals.forEach(function(r){ r.classList.add('in'); }); }

  /* count-up */
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals')||'0',10);
    var suffix = el.getAttribute('data-suffix')||'';
    if(isNaN(target)) return;
    if(reduce){ el.textContent = target.toFixed(dec)+suffix; return; }
    var dur=1200, start=null;
    function step(ts){
      if(start===null) start=ts;
      var p=Math.min((ts-start)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=(target*e).toFixed(dec)+suffix;
      if(p<1) requestAnimationFrame(step); else el.textContent=target.toFixed(dec)+suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
    }, {threshold:.6});
    counters.forEach(function(c){ cio.observe(c); });
  } else { counters.forEach(animateCount); }

  /* hero parallax (transform only) */
  var heroImg = document.querySelector('.hero[data-parallax] .hero-img');
  var heroInner = document.querySelector('.hero[data-parallax] .hero-inner');
  if((heroImg||heroInner) && !reduce){
    var tick=false;
    window.addEventListener('scroll', function(){
      if(tick) return; tick=true;
      requestAnimationFrame(function(){
        var y=window.scrollY, vh=window.innerHeight;
        if(y<vh){
          if(heroImg) heroImg.style.transform='translateY('+(y*0.16)+'px)';
          if(heroInner){ heroInner.style.transform='translateY('+(y*-0.06)+'px)'; heroInner.style.opacity=String(Math.max(0,1-y/(vh*0.85))); }
        }
        tick=false;
      });
    }, {passive:true});
  }

  /* generic layer parallax via data-speed */
  var layers = document.querySelectorAll('[data-speed]');
  if(layers.length && !reduce){
    var lt=false;
    window.addEventListener('scroll', function(){
      if(lt) return; lt=true;
      requestAnimationFrame(function(){
        var vh=window.innerHeight;
        layers.forEach(function(el){
          var r=el.getBoundingClientRect(), c=r.top+r.height/2-vh/2;
          el.style.transform='translateY('+(c*parseFloat(el.getAttribute('data-speed')))+'px)';
        });
        lt=false;
      });
    }, {passive:true});
  }

  /* marquee: duplicate content for seamless loop */
  document.querySelectorAll('.marquee-track').forEach(function(track){
    track.innerHTML += track.innerHTML;
  });

  /* magnetic buttons */
  if(canHover && !reduce){
    document.querySelectorAll('.magnetic').forEach(function(el){
      var strength = parseFloat(el.getAttribute('data-mag')||'0.3');
      el.addEventListener('mousemove', function(e){
        var r=el.getBoundingClientRect();
        var x=(e.clientX-r.left-r.width/2)*strength;
        var y=(e.clientY-r.top-r.height/2)*strength;
        el.style.transform='translate('+x+'px,'+y+'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  /* custom cursor */
  if(canHover && !reduce){
    var dot=document.createElement('div'); dot.className='cursor-dot';
    var ring=document.createElement('div'); ring.className='cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('cursor-on');
    var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    window.addEventListener('mousemove', function(e){
      mx=e.clientX; my=e.clientY;
      dot.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
    });
    (function loop(){
      rx+=(mx-rx)*0.16; ry+=(my-ry)*0.16;
      ring.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.masonry img,[data-lightbox],input,select').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('hover'); });
    });
    document.addEventListener('mouseleave', function(){ document.body.style.setProperty('--c','0'); ring.style.opacity='0'; dot.style.opacity='0'; });
    document.addEventListener('mouseenter', function(){ ring.style.opacity=''; dot.style.opacity=''; });
  }

  /* lightbox */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if(items.length){
    var lb=document.createElement('div'); lb.className='lightbox';
    lb.innerHTML='<span class="lb-close" aria-label="Закрыть">&times;</span><span class="lb-nav lb-prev" aria-label="Назад">&#8249;</span><img alt="Фото бутик-отеля Флорентина"><span class="lb-nav lb-next" aria-label="Вперёд">&#8250;</span>';
    document.body.appendChild(lb);
    var lbImg=lb.querySelector('img'), cur=0;
    function show(i){ cur=(i+items.length)%items.length; lbImg.src=items[cur].getAttribute('data-lightbox')||items[cur].src; }
    function open(i){ show(i); lb.classList.add('open'); }
    function close(){ lb.classList.remove('open'); }
    items.forEach(function(it,i){ it.addEventListener('click', function(){ open(i); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); show(cur-1); });
    lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); show(cur+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close(); if(e.key==='ArrowLeft') show(cur-1); if(e.key==='ArrowRight') show(cur+1);
    });
  }

  /* booking form */
  var form=document.querySelector('[data-booking-form]');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok=document.querySelector('[data-booking-success]');
      form.style.display='none';
      if(ok){ ok.style.display='block'; ok.scrollIntoView({behavior:'smooth',block:'center'}); }
    });
  }
})();
