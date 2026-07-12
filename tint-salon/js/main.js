/* TINT — интерактив: reveal, parallax, счётчики, отзывы, форма-152ФЗ, cookie, бургер, лайтбокс */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- режим скриншота для QA: …/index.html#shot ---------- */
  if (location.hash === '#shot') {
    const st = document.createElement('style');
    st.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}
      .hero{min-height:0!important}
      .rv,.rv-img,.rv-line{opacity:1!important;transform:none!important;clip-path:none!important}
      .rv-img img{transform:none!important}
      .cookie{transform:none!important}`;
    document.head.appendChild(st);
    document.querySelectorAll('.rv,.rv-img,.rv-line').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.q').forEach((r, i) => { if (i === 0) r.classList.add('is-on'); });
  }

  /* ---------- навигация: sticky + бургер ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      links.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('is-open');
      links.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: .14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv, .rv-img, .rv-line').forEach(el => io.observe(el));

  /* ---------- мягкий параллакс фото ---------- */
  if (!reduce) {
    const phs = [...document.querySelectorAll('.split__ph img, .mood figure img')];
    let ticking = false;
    const par = () => {
      phs.forEach(img => {
        const box = img.closest('figure, .split__ph');
        const r = box.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${p * -18}px) scale(1.05)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(par); ticking = true; } }, { passive: true });
    par();
  }

  /* ---------- счётчики ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const b = e.target, end = parseFloat(b.dataset.count), dec = b.dataset.count.includes('.') ? 1 : 0;
    const sup = b.dataset.suffix || '';
    const t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
      b.innerHTML = v.toFixed(dec) + (sup ? `<sup>${sup}</sup>` : '');
      if (p < 1) requestAnimationFrame(step);
    };
    if (reduce) { b.innerHTML = end.toFixed(dec) + (sup ? `<sup>${sup}</sup>` : ''); }
    else requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---------- слайдер отзывов ---------- */
  const quotes = [...document.querySelectorAll('.q')];
  const dots = [...document.querySelectorAll('.q-dots button')];
  if (quotes.length) {
    let i = 0, timer;
    const show = n => {
      i = (n + quotes.length) % quotes.length;
      quotes.forEach((q, k) => q.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(i + 1), 5600); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
  }

  /* ---------- форма записи (152-ФЗ) — демо без бэкенда ---------- */
  const form = document.querySelector('.form');
  if (form) {
    const consent = form.querySelector('#consent');
    const submit = form.querySelector('.btn[type="submit"]');
    // кнопка «Записаться» разблокируется только при согласии на обработку ПДн
    const sync = () => { submit.disabled = !consent.checked; };
    consent.addEventListener('change', sync); sync();

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!consent.checked) return;
      // ДЕМО: данные никуда не отправляются (бэкенда нет).
      // Для боевого режима — заменить на fetch('/api/booking', {method:'POST', body:new FormData(form)})
      form.classList.add('is-sent');
      form.querySelector('.form__submit').style.display = 'none';
    });
  }

  /* ---------- cookie-баннер (152-ФЗ) ---------- */
  const cookie = document.querySelector('.cookie');
  if (cookie) {
    const KEY = 'tint_cookie_consent';
    if (!localStorage.getItem(KEY)) {
      setTimeout(() => cookie.classList.add('is-in'), 900);
    }
    cookie.querySelectorAll('[data-cookie]').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem(KEY, btn.dataset.cookie);
        cookie.classList.remove('is-in');
      });
    });
  }

  /* ---------- лайтбокс ---------- */
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const im = lb.querySelector('img');
    document.querySelectorAll('[data-lb]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      im.src = a.getAttribute('href') || a.dataset.lb;
      im.alt = a.dataset.alt || '';
      lb.classList.add('is-open');
    }));
    const close = () => lb.classList.remove('is-open');
    lb.addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
})();
