/* =====================================================================
   Гостевой дом «Валерия» — site interactions (vanilla, no deps)
   transform/opacity-only · respects prefers-reduced-motion & touch
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- Footer year ---- */
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    /* ---- Hero video ---- */
    var heroVid = document.querySelector('.hero-video');
    if (heroVid) {
      if (reduceMotion) {
        try { heroVid.removeAttribute('autoplay'); heroVid.pause(); } catch (e) {}
      } else {
        // hide static fallback once video can paint; nudge autoplay on mobile
        var hideFallback = function () { heroVid.classList.add('is-playing'); };
        heroVid.addEventListener('loadeddata', hideFallback);
        heroVid.addEventListener('playing', hideFallback);
        var p = heroVid.play();
        if (p && p.catch) p.catch(function () {});
      }
    }

    /* ---- Mobile menu ---- */
    var burger = document.getElementById('burger');
    var mobileNav = document.getElementById('mobileNav');
    if (burger && mobileNav) {
      burger.addEventListener('click', function () {
        var open = mobileNav.classList.toggle('open');
        burger.classList.toggle('is-active', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', open);
      });
      mobileNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          mobileNav.classList.remove('open');
          burger.classList.remove('is-active');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('no-scroll');
        });
      });
    }

    /* ---- Sticky header transform ---- */
    var header = document.getElementById('siteHeader');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('scrolled', window.scrollY > 24);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Reveal + kinetic on scroll ---- */
    var revealEls = document.querySelectorAll('.reveal, .kinetic, .clip-reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---- Smooth anchor scroll ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var id = a.getAttribute('href');
        if (id.length > 1) {
          var t = document.querySelector(id);
          if (t) { ev.preventDefault(); t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
        }
      });
    });

    /* ---- Count-up numbers ---- */
    var counters = document.querySelectorAll('.countup');
    if (counters.length) {
      var runCount = function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';
        if (isNaN(target)) return;
        if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
        var dur = 1300, start = null;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals) + suffix;
        };
        requestAnimationFrame(step);
      };
      if ('IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { cio.observe(el); });
      } else { counters.forEach(runCount); }
    }

    /* ---- Parallax layers (rAF, transform-only) ---- */
    var pEls = document.querySelectorAll('[data-parallax]');
    if (pEls.length && !reduceMotion && canHover) {
      var ticking = false;
      var apply = function () {
        var vh = window.innerHeight;
        pEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
          var r = el.getBoundingClientRect();
          var center = r.top + r.height / 2;
          var offset = (center - vh / 2) * speed * -1;
          el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
        });
        ticking = false;
      };
      var onP = function () { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
      window.addEventListener('scroll', onP, { passive: true });
      window.addEventListener('resize', onP, { passive: true });
      apply();
    }

    /* ---- Hero image subtle parallax ---- */
    var heroImg = document.querySelector('.hero-media img');
    if (heroImg && !reduceMotion && canHover) {
      var hticking = false;
      var hParallax = function () {
        if (hticking) return; hticking = true;
        requestAnimationFrame(function () {
          var yv = window.scrollY || 0;
          heroImg.style.transform = 'translate3d(0,' + (yv * 0.14).toFixed(1) + 'px,0) scale(1.08)';
          hticking = false;
        });
      };
      window.addEventListener('scroll', hParallax, { passive: true });
    }

    /* ---- Magnetic buttons ---- */
    if (!reduceMotion && canHover) {
      document.querySelectorAll('.magnetic, .btn').forEach(function (el) {
        var strength = 0.3;
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var mx = e.clientX - (r.left + r.width / 2);
          var my = e.clientY - (r.top + r.height / 2);
          el.style.transform = 'translate(' + (mx * strength) + 'px,' + (my * strength - 3) + 'px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
    }

    /* ---- Custom cursor (dot + inertial ring) ---- */
    if (!reduceMotion && canHover) {
      var dot = document.createElement('div'); dot.className = 'cursor-dot';
      var ring = document.createElement('div'); ring.className = 'cursor-ring';
      document.body.appendChild(dot); document.body.appendChild(ring);
      document.body.classList.add('cursor-ready');
      var mx = window.innerWidth / 2, my = window.innerHeight / 2;
      var rx = mx, ry = my, visible = false;
      window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        if (!visible) { visible = true; dot.style.opacity = '1'; ring.style.opacity = '1'; }
        dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      });
      window.addEventListener('mouseout', function (e) {
        if (!e.relatedTarget) { dot.style.opacity = '0'; ring.style.opacity = '0'; visible = false; }
      });
      var loop = function () {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      document.querySelectorAll('a, button, .card, .btn, .masonry img, .bento-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
      });
    }

    /* ---- Lightbox (gallery) ---- */
    var lb = document.getElementById('lightbox');
    if (lb) {
      var lbImg = lb.querySelector('img');
      var lbCap = lb.querySelector('.lb-cap');
      var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
      var current = -1;
      function show(i) {
        if (i < 0) i = triggers.length - 1;
        if (i >= triggers.length) i = 0;
        current = i;
        var el = triggers[i];
        lbImg.setAttribute('src', el.getAttribute('data-full') || el.getAttribute('src'));
        lbCap.textContent = el.getAttribute('data-cap') || '';
      }
      function open(i) { show(i); lb.classList.add('open'); document.body.classList.add('no-scroll'); }
      function close() { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); }
      triggers.forEach(function (el, i) { el.addEventListener('click', function () { open(i); }); });
      lb.querySelector('.lb-close').addEventListener('click', close);
      lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
      lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
      });
    }

    /* ---- Booking form (no backend) ---- */
    var form = document.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.classList.add('hidden');
        var ok = document.getElementById('bookingThanks');
        if (ok) { ok.classList.remove('hidden'); ok.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); }
      });
    }
  });
})();
