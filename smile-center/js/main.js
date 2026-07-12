/* СМАЙЛ ЦЕНТР — Apple-style интерактив: reveal, nav/burger, отзывы,
   FAQ-аккордеон, форма записи (152-ФЗ), cookie-баннер, режим #shot.
   Анимации сдержанные (fade/rise) — без параллакса и кастом-курсора. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- режим скриншота для QA: …/index.html#shot --- */
  if (location.hash === '#shot') {
    const st = document.createElement('style');
    st.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}
      .rv,.rv-img{opacity:1!important;transform:none!important}
      .cookie{display:none!important}`;
    document.head.appendChild(st);
    document.querySelectorAll('.rv,.rv-img').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.review').forEach((r, i) => r.classList.toggle('is-on', i === 0));
    document.querySelectorAll('.review-dots button').forEach((d, i) => d.classList.toggle('is-on', i === 0));
  }

  /* --- бургер / мобильное меню --- */
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__menu a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* --- reveal на IntersectionObserver (fade + rise) --- */
  if (!reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv, .rv-img').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.rv, .rv-img').forEach(el => el.classList.add('is-in'));
  }

  /* --- отзывы: спокойная смена цитат --- */
  const reviews = [...document.querySelectorAll('.review')];
  const dots = [...document.querySelectorAll('.review-dots button')];
  if (reviews.length) {
    let i = 0, timer;
    const show = n => {
      i = (n + reviews.length) % reviews.length;
      reviews.forEach((r, k) => r.classList.toggle('is-on', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
    };
    const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(i + 1), 6000); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
  }

  /* --- FAQ-аккордеон --- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item.is-open').forEach(o => {
        o.classList.remove('is-open');
        o.querySelector('.faq__a').style.maxHeight = null;
        o.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
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
      setTimeout(() => cookie.classList.add('show'), 800);
    }
    cookie.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
      localStorage.setItem('sc_cookie', btn.dataset.act || 'accepted');
      cookie.classList.remove('show');
    }));
  }
})();
