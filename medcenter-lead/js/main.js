/* МЕДЦЕНТР «ЗДОРОВЬЕ» · MERCURY — интерактив
   reveal · бургер · sticky-nav (frosted) · отзывы · FAQ · форма-согласие · cookie · #shot */
(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* режим скриншота для QA: …/index.html#shot — гасит анимации, раскрывает reveal */
  if (location.hash === '#shot') {
    const st = document.createElement('style');
    st.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}
      .hero{height:860px!important;min-height:0!important}
      .rv,.rv-img{opacity:1!important;transform:none!important}
      .rv-img img{transform:none!important}`;
    document.head.appendChild(st);
    document.querySelectorAll('.rv,.rv-img').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.review').forEach((r, i) => { if (i === 0) r.classList.add('is-on'); });
  }

  /* --- навигация: прозрачная → frosted-glass на скролле --- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();

  /* --- бургер (<860) --- */
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger) burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (links) links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger && burger.classList.remove('is-open');
    links.classList.remove('is-open');
    burger && burger.setAttribute('aria-expanded', 'false');
  }));

  /* --- reveal --- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv, .rv-img').forEach(el => io.observe(el));

  /* --- отзывы-слайдер --- */
  const reviews = [...document.querySelectorAll('.review')];
  const dots = [...document.querySelectorAll('.review-dots button')];
  if (reviews.length) {
    let i = 0, timer;
    const show = n => {
      i = (n + reviews.length) % reviews.length;
      reviews.forEach((r, k) => r.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    const auto = () => { if (mq) return; clearInterval(timer); timer = setInterval(() => show(i + 1), 5200); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
  }

  /* --- FAQ-аккордеон --- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    q.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
    });
  });

  /* --- форма записи (152-ФЗ): submit заблокирован без согласия --- */
  /* ДЕМО-форма: без бэкенда. Реальная отправка подключается на сервере
     (например POST /api/lead) — здесь только клиентская валидация + фидбэк. */
  const form = document.querySelector('#booking-form');
  if (form) {
    const consent = form.querySelector('#consent');
    const submit = form.querySelector('#booking-submit');
    const ok = form.querySelector('.form-ok');
    const sync = () => { submit.disabled = !consent.checked; };
    consent.addEventListener('change', sync); sync();
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!consent.checked) return;
      form.querySelectorAll('.field, .consent, .btn--wide, .form-note').forEach(el => el.style.display = 'none');
      if (ok) ok.classList.add('is-on');
    });
  }

  /* --- cookie-баннер (localStorage) --- */
  const cookie = document.querySelector('#cookie');
  if (cookie && !localStorage.getItem('zdorovie_cookie')) {
    cookie.classList.add('is-on');
    cookie.querySelectorAll('[data-cookie]').forEach(b => b.addEventListener('click', () => {
      localStorage.setItem('zdorovie_cookie', b.dataset.cookie);
      cookie.classList.remove('is-on');
    }));
  }
})();
