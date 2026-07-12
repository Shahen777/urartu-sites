/* AL CAPONE BARBERSHOP — интерактив: reveal, sticky-nav, бургер, слайдер отзывов,
   лайтбокс, форма записи (152-ФЗ), cookie-баннер, #shot, prefers-reduced-motion.
   Курсор-точки нет намеренно (стиль Perk — плоско, без декора). */
(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- режим скриншота для QA: …/index.html#shot --- */
  if (location.hash === '#shot') {
    const st = document.createElement('style');
    st.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}
      .rv,.rv-img{opacity:1!important;transform:none!important;clip-path:none!important}
      .rv-img img{transform:none!important}
      .cookie{display:none!important}`;
    document.head.appendChild(st);
    document.querySelectorAll('.rv,.rv-img').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.review').forEach((r, i) => { if (i === 0) r.classList.add('is-on'); });
  }

  /* --- sticky-навигация --- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();

  /* --- бургер (<860px) --- */
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger) burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (links) links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger && burger.classList.remove('is-open');
    burger && burger.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
  }));

  /* --- reveal .rv / .rv-img --- */
  if (!mq) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv, .rv-img').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.rv, .rv-img').forEach(el => el.classList.add('is-in'));
  }

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
    const auto = () => { if (mq) return; clearInterval(timer); timer = setInterval(() => show(i + 1), 5200); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
  }

  /* --- лайтбокс (галерея-фото) --- */
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const im = lb.querySelector('img');
    document.querySelectorAll('[data-lb]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      im.src = a.getAttribute('href') || a.dataset.lb;
      im.alt = a.dataset.alt || '';
      lb.classList.add('is-open');
    }));
    lb.addEventListener('click', () => lb.classList.remove('is-open'));
    addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-open'); });
  }

  /* --- форма записи (152-ФЗ): чекбокс согласия разблокирует submit --- */
  const form = document.querySelector('.book-form');
  if (form) {
    const consent = form.querySelector('#consent');
    const submit = form.querySelector('button[type="submit"]');
    const sync = () => { if (submit) submit.disabled = !(consent && consent.checked); };
    if (consent) consent.addEventListener('change', sync);
    sync();
    form.addEventListener('submit', e => {
      e.preventDefault();
      // ДЕМО-форма: бэкенда нет. В боевой версии здесь fetch()/отправка на CRM/почту барбершопа.
      const ok = form.querySelector('.book-form__ok');
      if (ok) ok.hidden = false;
      form.querySelectorAll('input,select,button').forEach(el => { el.disabled = true; });
    });
  }

  /* --- cookie-баннер (localStorage) --- */
  const cookie = document.querySelector('.cookie');
  if (cookie) {
    if (!localStorage.getItem('ac_cookie')) cookie.hidden = false;
    cookie.querySelectorAll('[data-cookie]').forEach(b => b.addEventListener('click', () => {
      localStorage.setItem('ac_cookie', b.dataset.cookie);
      cookie.hidden = true;
    }));
  }
})();
