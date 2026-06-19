/* Отель «Отдых у Александра» — vanilla JS · Urartu AI Studio */
(function(){
  'use strict';

  /* —— Видео-герой: гарантируем autoplay, fallback на фото при ошибке —— */
  (function(){
    var hv = document.querySelector('.hero-video');
    if(!hv) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ hv.removeAttribute('autoplay'); if(hv.pause) hv.pause(); return; }
    var p = hv.play && hv.play();
    if(p && p.catch){ p.catch(function(){ /* остаётся poster/fallback */ }); }
    hv.addEventListener('error', function(){ hv.style.display='none'; });
    hv.addEventListener('stalled', function(){ var r=hv.play&&hv.play(); if(r&&r.catch)r.catch(function(){}); });
  })();

  /* —— Sticky-шапка: смена фона при скролле —— */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 30) header.classList.add('solid');
    else header.classList.remove('solid');
  }
  // Если страница не имеет тёмного героя — шапка всегда solid
  if(header && header.dataset.solid === 'always'){
    header.classList.add('solid');
  } else {
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* —— Мобильное меню —— */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    burger.addEventListener('click', function(){
      var open = mobileMenu.classList.toggle('open');
      mobileMenu.style.maxHeight = open ? mobileMenu.scrollHeight + 'px' : '0px';
      burger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobileMenu.classList.remove('open');
        mobileMenu.style.maxHeight = '0px';
      });
    });
  }

  /* —— Год в футере —— */
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* —— Count-up чисел при появлении —— */
  function countUp(el){
    if(el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    if(isNaN(target)){ return; }
    if(reduceMotion){ el.textContent = target.toFixed(decimals); return; }
    var dur = 1100, start = null;
    function frame(ts){
      if(start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if(p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  /* —— Появление при скролле + count-up —— */
  var reveals = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  function revealAll(){
    reveals.forEach(function(el){ el.classList.add('in'); });
    counters.forEach(countUp);
  }
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    reveals.forEach(function(el){ io.observe(el); });

    var co = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ countUp(e.target); co.unobserve(e.target); }
      });
    }, {threshold:.4});
    counters.forEach(function(el){ co.observe(el); });

    /* Подстраховка: если что-то не сработало за 2.5с — показать всё */
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }

  /* —— Лёгкий параллакс героя (контейнер-обёртка, чтобы не мешать Ken-Burns зуму) —— */
  var heroSection = document.querySelector('[data-parallax]');
  if(heroSection && !reduceMotion){
    var pTicking = false;
    window.addEventListener('scroll', function(){
      if(pTicking) return;
      pTicking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        if(y < 900){ heroSection.style.setProperty('--py', (y*0.15)+'px'); }
        pTicking = false;
      });
    }, {passive:true});
  }

  /* —— Lightbox для галереи —— */
  var lbItems = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if(lbItems.length){
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Закрыть">&times;</button>'+
      '<button class="lb-nav prev" aria-label="Назад">&#8249;</button>'+
      '<img alt="">'+
      '<button class="lb-nav next" aria-label="Вперёд">&#8250;</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var idx = 0;
    function show(i){
      idx = (i + lbItems.length) % lbItems.length;
      var src = lbItems[idx].getAttribute('data-full') || lbItems[idx].querySelector('img').src;
      lbImg.src = src;
    }
    function open(i){ show(i); lb.classList.add('open'); document.body.style.overflow='hidden'; }
    function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    lbItems.forEach(function(el,i){
      el.style.cursor='zoom-in';
      el.addEventListener('click', function(){ open(i); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.next').addEventListener('click', function(){ show(idx+1); });
    lb.querySelector('.prev').addEventListener('click', function(){ show(idx-1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close();
      if(e.key==='ArrowRight') show(idx+1);
      if(e.key==='ArrowLeft') show(idx-1);
    });
  }

  /* ================================================================
     ★★★ AWARD-TIER 2026 INTERACTIONS ★★★
     ================================================================ */

  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* —— Кинетические заголовки: оборачиваем слова, всплытие со stagger —— */
  document.querySelectorAll('.kinetic').forEach(function(el){
    if(el.dataset.split) return;
    el.dataset.split = '1';
    var html = el.innerHTML;
    // защищаем <br> и существующие inline-теги: разбиваем по словам внутри текстовых узлов
    var frag = document.createDocumentFragment();
    var wi = 0;
    function wrapText(text){
      text.split(/(\s+)/).forEach(function(tok){
        if(tok.trim()===''){ frag.appendChild(document.createTextNode(tok)); return; }
        var w = document.createElement('span'); w.className='word';
        var inner = document.createElement('span');
        inner.textContent = tok;
        inner.style.setProperty('--wd', (wi*70)+'ms'); wi++;
        w.appendChild(inner); frag.appendChild(w);
      });
    }
    Array.prototype.slice.call(el.childNodes).forEach(function(node){
      if(node.nodeType===3){ wrapText(node.textContent); }
      else if(node.nodeName==='BR'){ frag.appendChild(document.createElement('br')); }
      else {
        // inline-элемент (например <span class="text-gold italic">…</span>) — оборачиваем его текст, сохраняя класс/стиль
        var clone = node.cloneNode(false);
        var t = node.textContent;
        t.split(/(\s+)/).forEach(function(tok){
          if(tok.trim()===''){ clone.appendChild(document.createTextNode(tok)); return; }
          var w=document.createElement('span'); w.className='word';
          var inner=document.createElement('span'); inner.textContent=tok;
          inner.style.setProperty('--wd',(wi*70)+'ms'); wi++;
          w.appendChild(inner); clone.appendChild(w);
        });
        frag.appendChild(clone);
      }
    });
    el.innerHTML=''; el.appendChild(frag);
    if(reduceMotion){ el.classList.add('in'); }
  });
  // активируем кинетику при появлении
  if('IntersectionObserver' in window && !reduceMotion){
    var ko = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); ko.unobserve(e.target);} });
    }, {threshold:.2});
    document.querySelectorAll('.kinetic').forEach(function(el){ ko.observe(el); });
    // герой — активировать сразу
    var heroK = document.querySelector('.hero-cine .kinetic');
    if(heroK){ requestAnimationFrame(function(){ heroK.classList.add('in'); }); }
  } else {
    document.querySelectorAll('.kinetic').forEach(function(el){ el.classList.add('in'); });
  }

  /* —— Clip-path раскрытие фото —— */
  if('IntersectionObserver' in window){
    var clo = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); clo.unobserve(e.target);} });
    }, {threshold:.2});
    document.querySelectorAll('.clip-reveal').forEach(function(el){ clo.observe(el); });
  } else {
    document.querySelectorAll('.clip-reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* —— Кастомный курсор (точка + следящее кольцо с инерцией) —— */
  if(fine && !reduceMotion){
    var dot = document.createElement('div'); dot.className='cursor-dot';
    var ring = document.createElement('div'); ring.className='cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.documentElement.classList.add('cursor-on');
    var mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my, dx=mx, dy=my;
    window.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; }, {passive:true});
    (function loop(){
      dx += (mx-dx)*0.35; dy += (my-dy)*0.35;
      rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
      dot.style.transform='translate3d('+dx+'px,'+dy+'px,0)';
      ring.style.transform='translate3d('+rx+'px,'+ry+'px,0)';
      requestAnimationFrame(loop);
    })();
    var hoverSel = 'a,button,[data-lightbox],.card,.bento .cell,input,select,textarea,.tilt';
    document.querySelectorAll(hoverSel).forEach(function(el){
      el.addEventListener('mouseenter', function(){ document.documentElement.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function(){ document.documentElement.classList.remove('cursor-hover'); });
    });
  }

  /* —— Магнитные кнопки —— */
  if(fine && !reduceMotion){
    document.querySelectorAll('.magnetic').forEach(function(el){
      var str = parseFloat(el.getAttribute('data-mag') || '0.3');
      el.addEventListener('mousemove', function(e){
        var r=el.getBoundingClientRect();
        var x=(e.clientX-(r.left+r.width/2))*str;
        var y=(e.clientY-(r.top+r.height/2))*str;
        el.style.transform='translate3d('+x+'px,'+y+'px,0)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  /* —— Tilt при наведении —— */
  if(fine && !reduceMotion){
    document.querySelectorAll('.tilt').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r=el.getBoundingClientRect();
        var px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
        el.style.transform='perspective(900px) rotateX('+(-py*6)+'deg) rotateY('+(px*6)+'deg) translateZ(0)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform=''; });
    });
  }

  /* —— Прожектор за курсором в .spotlight секциях —— */
  if(fine && !reduceMotion){
    document.querySelectorAll('.spotlight').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r=el.getBoundingClientRect();
        el.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
        el.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
      });
    });
  }

  /* —— Параллакс слоёв по data-speed (с «физикой» через rAF-сглаживание) —— */
  if(!reduceMotion){
    var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
    if(pEls.length){
      var ticking=false;
      function applyParallax(){
        var vh=window.innerHeight;
        pEls.forEach(function(el){
          var r=el.getBoundingClientRect();
          var center=r.top+r.height/2;
          var off=(center-vh/2);
          var sp=parseFloat(el.getAttribute('data-speed'))||0;
          el.style.transform='translate3d(0,'+(-off*sp)+'px,0)';
        });
        ticking=false;
      }
      window.addEventListener('scroll', function(){ if(!ticking){ticking=true;requestAnimationFrame(applyParallax);} }, {passive:true});
      window.addEventListener('resize', applyParallax, {passive:true});
      applyParallax();
    }
  }

  /* —— Дублируем содержимое маркуи для бесшовного цикла —— */
  document.querySelectorAll('.marquee-track').forEach(function(tr){
    tr.innerHTML += tr.innerHTML;
  });

  /* —— Форма бронирования —— */
  var bookForm = document.getElementById('bookForm');
  if(bookForm){
    // минимальная дата — сегодня
    var today = new Date().toISOString().split('T')[0];
    bookForm.querySelectorAll('input[type=date]').forEach(function(d){ d.min = today; });
    bookForm.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = document.getElementById('bookThanks');
      bookForm.style.display='none';
      if(ok){ ok.style.display='block'; ok.scrollIntoView({behavior:'smooth',block:'center'}); }
    });
  }
})();
