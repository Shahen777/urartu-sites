/* Гостевой дом «Альянс» — site.js (2026 bespoke)
   cursor · magnetic · reveal+kinetic+clip · count-up · parallax · header · menu · lightbox · form */
(function () {
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- sticky header ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function closeMenu() { if (menu) { menu.classList.remove('open'); document.body.style.overflow = ''; } }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a, [data-close]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- count-up ---------- */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function startCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suf = el.getAttribute('data-suffix') || '';
    var pre = el.getAttribute('data-prefix') || '';
    if (reduce) { el.innerHTML = pre + target.toFixed(dec) + suf; return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.innerHTML = pre + (target * easeOut(p)).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = pre + target.toFixed(dec) + suf;
    }
    requestAnimationFrame(step);
  }

  /* ---------- reveal / kinetic / clip via IntersectionObserver ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      // auto-stagger siblings
      if (el.classList.contains('reveal') && !el.style.getPropertyValue('--rd')) {
        var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
          return c.classList && c.classList.contains('reveal');
        });
        var i = sibs.indexOf(el);
        if (i > 0) el.style.setProperty('--rd', Math.min(i, 6) * 0.08 + 's');
      }
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(startCount);
      if (el.hasAttribute('data-count')) startCount(el);
      io.unobserve(el);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });
  document.querySelectorAll('.reveal, .clip, .kin').forEach(function (el) { io.observe(el); });

  // standalone count-up not wrapped in reveal
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { startCount(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    if (!el.closest('.reveal')) cio.observe(el);
  });

  /* ---------- hero zoom + parallax ---------- */
  var heroImg = document.querySelector('.hero__img');
  if (heroImg && !reduce) {
    requestAnimationFrame(function () { requestAnimationFrame(function () { heroImg.classList.add('zoomed'); }); });
  }
  var pEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (pEls.length && !reduce) {
    var ticking = false;
    function apply() {
      var y = window.scrollY || 0;
      pEls.forEach(function (el) {
        var sp = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        el.style.transform = 'translate3d(0,' + (y * sp).toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (window.scrollY < window.innerHeight * 1.6 && !ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
  }

  /* ---------- custom cursor ---------- */
  if (fine && !reduce) {
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add('has-cursor');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, shown = false;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      if (!shown) { shown = true; dot.style.opacity = ring.style.opacity = 1; }
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, .g-tile, .card, .magnetic')) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, .g-tile, .card, .magnetic')) ring.classList.remove('hover');
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) {
    document.querySelectorAll('.magnetic').forEach(function (m) {
      var strength = 0.32;
      m.addEventListener('mousemove', function (e) {
        var r = m.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        m.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      m.addEventListener('mouseleave', function () { m.style.transform = ''; });
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- lightbox ---------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-lb]'));
  if (tiles.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
      '<span class="lb-close" aria-label="Закрыть">&times;</span>' +
      '<span class="lb-nav lb-prev" aria-label="Назад">&#8249;</span>' +
      '<img alt="Фото гостевого дома Альянс">' +
      '<span class="lb-nav lb-next" aria-label="Вперёд">&#8250;</span>';
    document.body.appendChild(lb);
    var img = lb.querySelector('img'), idx = 0;
    var srcs = tiles.map(function (t) { return t.getAttribute('data-lb'); });
    function show(i) { idx = (i + srcs.length) % srcs.length; img.src = srcs[idx]; }
    tiles.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; });
    });
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- booking form ---------- */
  var form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = document.getElementById('formThanks');
      form.style.display = 'none';
      if (ok) { ok.style.display = 'block'; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }
})();
