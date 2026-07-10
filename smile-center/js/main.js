/* СМАЙЛ ЦЕНТР — интерактив: курсор, reveal, parallax, счётчики, отзывы,
   FAQ-аккордеон, форма записи (152-ФЗ), cookie-баннер, nav/burger, режим #shot */
(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- режим скриншота для QA: …/index.html#shot --- */
  if (location.hash === '#shot') {
    const st = document.createElement('style');
    st.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}
      .rv,.rv-img,.rv-mask{opacity:1!important;transform:none!important;clip-path:none!important}
      .rv-img img{transform:none!important}
      .hero{height:780px!important;min-height:0!important;max-height:none!important}
      .cookie{display:none!important}`;
    document.head.appendChild(st);
    document.querySelectorAll('.rv,.rv-img,.rv-mask').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.review').forEach((r, i) => { if (i === 0) r.classList.add('is-on'); });
  }

  /* --- кастомный курсор --- */
  const cur = document.querySelector('.cursor');
  if (cur && matchMedia('(hover:hover)').matches) {
    addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    }, { passive: true });
    document.querySelectorAll('img, .svc, .doc, a.btn, .faq__q').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-photo'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-photo'));
    });
  }

  /* --- sticky-навигация + бургер --- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
  const burger = document.querySelector('.nav__burger');
  if (burger && nav) burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  if (nav) nav.querySelectorAll('.nav__grp a').forEach(a => a.addEventListener('click', () => {
    burger && burger.classList.remove('is-open');
    nav.classList.remove('is-open');
  }));

  /* --- reveal на IntersectionObserver --- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv, .rv-img, .rv-mask').forEach(el => io.observe(el));

  /* --- rAF-parallax картинок --- */
  if (!mq) {
    const phs = [...document.querySelectorAll('.split__media img')];
    const heroImg = document.querySelector('.hero__media img');
    let ticking = false;
    const par = () => {
      phs.forEach(img => {
        const box = img.closest('.split__media');
        const r = box.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${p * -22}px)`;
      });
      if (heroImg && scrollY < innerHeight) {
        heroImg.style.transform = `translateY(${scrollY * 0.18}px) scale(1.05)`;
      }
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(par); ticking = true; } }, { passive: true });
    par();
  }

  /* --- счётчики data-count --- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const b = e.target, end = parseFloat(b.dataset.count), dec = b.dataset.count.includes('.') ? 1 : 0;
    const pre = b.dataset.prefix || '', suf = b.dataset.suffix || '';
    const t0 = performance.now(), dur = 1700;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
      b.innerHTML = pre + v.toFixed(dec) + '<em>' + suf + '</em>';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* --- слайдер отзывов --- */
  const reviews = [...document.querySelectorAll('.review')];
  const dots = [...document.querySelectorAll('.review-dots button')];
  if (reviews.length) {
    let i = 0, timer;
    const show = n => {
      i = (n + reviews.length) % reviews.length;
      reviews.forEach((r, k) => r.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 5500); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
  }

  /* --- FAQ-аккордеон --- */
  document.querySelectorAll('.faq__i').forEach(item => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq__i.is-open').forEach(o => {
        o.classList.remove('is-open'); o.querySelector('.faq__a').style.maxHeight = null;
      });
      if (!open) { item.classList.add('is-open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* --- ФОРМА ЗАПИСИ (152-ФЗ) ---
     ВАЖНО: форма демонстрационная. Данные НИКУДА не отправляются и нигде не
     сохраняются — нет ни fetch/XHR, ни action, ни localStorage персональных данных.
     Это делает сайт корректным по 152-ФЗ при размещении на GitHub Pages:
     персональные данные посетителя не собираются и не обрабатываются сервером. */
  document.querySelectorAll('form[data-book]').forEach(form => {
    const consent = form.querySelector('input[name="consent"]');
    const submit = form.querySelector('button[type="submit"]');
    const ok = form.parentElement.querySelector('.form-ok');
    // кнопка заблокирована, пока не проставлено согласие
    const sync = () => { submit.disabled = !consent.checked; };
    consent.addEventListener('change', sync); sync();

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!consent.checked) return;
      // никаких сетевых запросов — просто подтверждение записи
      form.style.display = 'none';
      if (ok) ok.classList.add('show');
    });
  });

  /* --- cookie-баннер --- */
  const cookie = document.querySelector('.cookie');
  if (cookie && location.hash !== '#shot') {
    if (!localStorage.getItem('sc_cookie')) {
      setTimeout(() => cookie.classList.add('show'), 900);
    }
    cookie.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      localStorage.setItem('sc_cookie', btn.dataset.act || 'accepted');
      cookie.classList.remove('show');
    }));
  }
})();
