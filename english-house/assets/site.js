/* English House — bespoke interactions (2026). All transform/opacity. */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* mobile menu */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");
  if (burger && menu){
    burger.addEventListener("click", function(){ menu.classList.toggle("open"); });
    menu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ menu.classList.remove("open"); });
    });
  }

  /* sticky header state + hide-on-down */
  var header = document.getElementById("site-header");
  var lastY = 0, ticking = false;
  var heroImg = document.querySelector(".hero-media img");
  function onScroll(){
    var sy = window.pageYOffset || document.documentElement.scrollTop;
    if (header){
      if (sy > 24) header.classList.add("scrolled"); else header.classList.remove("scrolled");
      if (sy > 520 && sy > lastY) header.style.transform = "translateY(-100%)";
      else header.style.transform = "translateY(0)";
    }
    if (heroImg && !reduce && sy < window.innerHeight){
      heroImg.style.transform = "translateY(" + (sy * 0.22) + "px)";
    }
    lastY = sy; ticking = false;
  }
  window.addEventListener("scroll", function(){
    if (!ticking){ requestAnimationFrame(onScroll); ticking = true; }
  }, { passive:true });

  /* count up */
  function countUp(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduce || isNaN(target)){ el.textContent = target.toFixed(dec); return; }
    var dur = 1300, start = performance.now();
    function step(now){
      var p = Math.min((now - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* reveal + clip + kinetic + counts */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){
        en.target.classList.add("in");
        en.target.querySelectorAll("[data-count]").forEach(countUp);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal,.clip-reveal,.kin").forEach(function(el){ io.observe(el); });

  /* standalone counts already visible (hero badge) */
  var nio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ countUp(en.target); nio.unobserve(en.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(function(el){
    if (!el.closest(".reveal,.clip-reveal,.kin")) nio.observe(el);
  });

  /* custom cursor */
  if (fine && !reduce){
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
    document.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
    });
    (function loop(){
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
    var hoverSel = "a,button,.g-item,.rcard,.bento .cell,input,select,textarea";
    document.querySelectorAll(hoverSel).forEach(function(el){
      el.addEventListener("mouseenter", function(){ ring.classList.add("grow"); });
      el.addEventListener("mouseleave", function(){ ring.classList.remove("grow"); });
    });
  }

  /* magnetic buttons */
  if (fine && !reduce){
    document.querySelectorAll(".magnetic").forEach(function(btn){
      var strength = 0.28;
      btn.addEventListener("mousemove", function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var yy = e.clientY - r.top - r.height/2;
        btn.style.transform = "translate(" + (x*strength) + "px," + (yy*strength) + "px)";
      });
      btn.addEventListener("mouseleave", function(){ btn.style.transform = "translate(0,0)"; });
    });
  }

  /* tilt photos */
  if (fine && !reduce){
    document.querySelectorAll("[data-tilt]").forEach(function(el){
      el.addEventListener("mousemove", function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - 0.5;
        var py = (e.clientY - r.top)/r.height - 0.5;
        el.style.transform = "perspective(900px) rotateY(" + (px*5) + "deg) rotateX(" + (-py*5) + "deg)";
      });
      el.addEventListener("mouseleave", function(){
        el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
      });
    });
  }

  /* booking form */
  var form = document.getElementById("booking-form");
  if (form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if (!form.checkValidity()){ form.reportValidity(); return; }
      form.style.display = "none";
      var t = document.getElementById("thanks");
      if (t){ t.style.display = "block"; t.scrollIntoView({behavior:"smooth", block:"center"}); }
    });
  }

  /* lightbox */
  var items = [].slice.call(document.querySelectorAll(".g-item"));
  if (items.length){
    var sources = items.map(function(i){ return i.getAttribute("data-full"); });
    var lb = document.getElementById("lightbox");
    var lbImg = lb ? lb.querySelector("img") : null;
    var idx = 0;
    function show(n){ idx = (n + sources.length) % sources.length; lbImg.src = sources[idx]; }
    function open(i){ idx = i; lbImg.src = sources[idx]; lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close(){ lb.classList.remove("open"); document.body.style.overflow = ""; }
    items.forEach(function(it, i){ it.addEventListener("click", function(){ open(i); }); });
    if (lb){
      lb.querySelector(".lb-close").addEventListener("click", close);
      lb.querySelector(".lb-prev").addEventListener("click", function(e){ e.stopPropagation(); show(idx-1); });
      lb.querySelector(".lb-next").addEventListener("click", function(e){ e.stopPropagation(); show(idx+1); });
      lb.addEventListener("click", function(e){ if (e.target === lb) close(); });
      document.addEventListener("keydown", function(e){
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(idx-1);
        if (e.key === "ArrowRight") show(idx+1);
      });
    }
  }
})();
