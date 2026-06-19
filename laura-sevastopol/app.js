/* ===== Лаура — bespoke motion (no deps) ===== */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- header scroll state ---------- */
  var hdr = document.getElementById("hdr");
  if (hdr && !hdr.classList.contains("solid")) {
    var onScroll = function () {
      if (window.scrollY > 40) hdr.classList.add("scrolled");
      else hdr.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", menu.classList.contains("open"));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  /* ---------- reveal (IO) ---------- */
  var ioR = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); ioR.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal,.reveal-lines,.clip-img").forEach(function (el) { ioR.observe(el); });

  /* hero line reveal fires on load */
  document.querySelectorAll(".reveal-lines.hero-fire").forEach(function (el) {
    requestAnimationFrame(function () { setTimeout(function () { el.classList.add("in"); }, 120); });
  });

  /* ---------- count-up ---------- */
  var fmt = function (n, dec) {
    return dec ? n.toFixed(dec).replace(".", ",") : Math.round(n).toLocaleString("ru-RU");
  };
  var countUp = function (el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || "0", 10);
    var suf = el.dataset.suffix || "";
    var pre = el.dataset.prefix || "";
    if (reduce) { el.textContent = pre + fmt(target, dec) + suf; return; }
    var dur = 1500, t0 = performance.now();
    var tick = function (now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(target * e, dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  var ioC = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); ioC.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll(".stat").forEach(function (el) { ioC.observe(el); });

  /* ---------- parallax (transform only, rAF) ---------- */
  if (!reduce) {
    var pLayers = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    var heroImgs = Array.prototype.slice.call(document.querySelectorAll(".hero-media img,.banner-media img"));
    var ticking = false;
    var run = function () {
      var sy = window.scrollY;
      heroImgs.forEach(function (img) {
        var sec = img.closest("section");
        var top = sec ? sec.getBoundingClientRect().top + sy : 0;
        var rel = sy - top;
        if (rel > -window.innerHeight && rel < window.innerHeight) {
          img.style.transform = "scale(1.14) translateY(" + (rel * 0.12) + "px)";
        }
      });
      pLayers.forEach(function (el) {
        var sp = parseFloat(el.dataset.parallax) || 0.1;
        var r = el.getBoundingClientRect();
        var c = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = "translateY(" + (-c * sp) + "px)";
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    run();
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".magnetic").forEach(function (wrap) {
      var btn = wrap.querySelector(".btn") || wrap.firstElementChild;
      if (!btn) return;
      var str = 0.32;
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var yy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + x * str + "px," + yy * str + "px)";
      });
      wrap.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------- custom cursor ---------- */
  if (fine && !reduce) {
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    document.body.classList.add("has-cursor");
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      // detect dark sections under cursor
      var el = document.elementFromPoint(mx, my);
      var dark = el && el.closest(".bg-ink,.hero,.banner,.bg-olive,.trust,#lightbox,.footer");
      dot.classList.toggle("is-dark", !!dark);
      ring.classList.toggle("is-dark", !!dark);
      var hov = el && el.closest("a,button,.gitem,.field,select,input");
      ring.classList.toggle("is-hover", !!hov);
    });
    var loop = function () {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener("mouseleave", function () { dot.style.opacity = 0; ring.style.opacity = 0; });
    document.addEventListener("mouseenter", function () { dot.style.opacity = 1; ring.style.opacity = 1; });
  }

  /* ---------- lightbox (gallery) ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var imgs = Array.prototype.slice.call(document.querySelectorAll(".gitem img"));
    var lbImg = document.getElementById("lbImg");
    var idx = 0;
    var show = function (i) { idx = (i + imgs.length) % imgs.length; lbImg.src = imgs[idx].dataset.full || imgs[idx].src; lbImg.alt = imgs[idx].alt; };
    var open = function (i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; };
    var close = function () { lb.classList.remove("open"); document.body.style.overflow = ""; };
    imgs.forEach(function (im, i) { im.addEventListener("click", function () { open(i); }); });
    var q = function (id) { return document.getElementById(id); };
    if (q("lbClose")) q("lbClose").addEventListener("click", close);
    if (q("lbNext")) q("lbNext").addEventListener("click", function () { show(idx + 1); });
    if (q("lbPrev")) q("lbPrev").addEventListener("click", function () { show(idx - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---------- booking form ---------- */
  var form = document.getElementById("bookForm");
  if (form) {
    var thanks = document.getElementById("thanks");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      if (thanks) { thanks.style.display = "block"; thanks.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
    // sensible date defaults
    var ci = document.getElementById("checkin"), co = document.getElementById("checkout");
    if (ci && co) {
      var t = new Date(), tm = new Date(Date.now() + 864e5);
      var iso = function (d) { return d.toISOString().slice(0, 10); };
      ci.min = iso(t); co.min = iso(tm);
    }
  }
})();
