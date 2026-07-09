/* АЗИЯ РЯДОМ (ASIA) — интерактив: курсор, reveal, parallax, drag, счётчики, отзывы, fab, лайтбокс */
(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* режим скриншота для QA: …/index.html#shot */
  if (location.hash === '#shot') {
    const st = document.createElement('style');
    st.textContent = `*,*::before,*::after{animation:none!important;transition:none!important}
      body::after{display:none!important}
      .hero{height:860px!important;min-height:0!important}
      .rv,.rv-img{opacity:1!important;transform:none!important}
      .rv-img img{transform:none!important}`;
    document.head.appendChild(st);
    document.querySelectorAll('.rv,.rv-img').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.review').forEach((r, i) => { if (i === 0) r.classList.add('is-on'); });
  }

  /* --- курсор: красная точка --- */
  const cur = document.querySelector('.cursor');
  if (cur && matchMedia('(hover:hover)').matches) {
    addEventListener('mousemove', e => {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    }, { passive: true });
    document.querySelectorAll('img, .dish, .gal a').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-photo'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-photo'));
    });
  }

  /* --- навигация --- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => nav && nav.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger) burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    links.classList.toggle('is-open');
  });
  if (links) links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger && burger.classList.remove('is-open');
    links.classList.remove('is-open');
  }));

  /* --- reveal --- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: .16, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv, .rv-img').forEach(el => io.observe(el));

  /* --- parallax картинок --- */
  if (!mq) {
    const phs = [...document.querySelectorAll('.split__ph img, .mosaic figure img, .imgfeat__ph img')];
    let ticking = false;
    const par = () => {
      phs.forEach(img => {
        const r = img.closest('figure, .split__ph, .imgfeat__ph').getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translateY(${p * -26}px) scale(1.08)`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(par); ticking = true; } }, { passive: true });
    par();
  }

  /* --- drag-скролл лент --- */
  document.querySelectorAll('.drag').forEach(el => {
    let down = false, sx = 0, sl = 0;
    el.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sl = el.scrollLeft; el.classList.add('is-down'); });
    addEventListener('pointerup', () => { down = false; el.classList.remove('is-down'); });
    el.addEventListener('pointermove', e => { if (down) el.scrollLeft = sl - (e.clientX - sx); });
  });

  /* --- счётчики --- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const b = e.target, end = parseFloat(b.dataset.count), dec = b.dataset.count.includes('.') ? 1 : 0;
    const t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3));
      b.textContent = v.toFixed(dec) + (b.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

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
    const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 5200); };
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
    show(0); auto();
  }

  /* --- fab-бронь --- */
  const fab = document.querySelector('.fab');
  if (fab) {
    fab.querySelector('.fab__btn').addEventListener('click', () => fab.classList.toggle('is-open'));
    document.addEventListener('click', e => { if (!fab.contains(e.target)) fab.classList.remove('is-open'); });
  }

  /* --- лайтбокс --- */
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const im = lb.querySelector('img');
    document.querySelectorAll('.gal a').forEach(a => a.addEventListener('click', e => {
      e.preventDefault(); im.src = a.href; lb.classList.add('is-open');
    }));
    lb.addEventListener('click', () => lb.classList.remove('is-open'));
    addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-open'); });
  }
})();
