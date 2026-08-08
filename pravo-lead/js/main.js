// Демо-концепт: форма ничего не отправляет, но ведёт себя как настоящая —
// в том числе не пропускает отправку без согласия на обработку данных.
// Это часть демонстрации: именно этого чекбокса не хватает на сайтах,
// с которыми мы приходим к клиенту.

(function () {
  "use strict";

  // Появление блоков при скролле.
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("on");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("on"); });
  }

  // Cookie-уведомление: показываем один раз.
  var cookie = document.getElementById("cookie");
  var okBtn = document.getElementById("cookie-ok");
  var KEY = "pd-cookie-ok";
  try {
    if (cookie && !localStorage.getItem(KEY)) {
      setTimeout(function () { cookie.hidden = false; }, 900);
    }
  } catch (e) {
    // localStorage может быть недоступен (приватный режим) — тогда просто
    // показываем баннер каждый раз, это лучше, чем упасть.
    if (cookie) cookie.hidden = false;
  }
  if (okBtn) {
    okBtn.addEventListener("click", function () {
      cookie.hidden = true;
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
    });
  }

  // Форма.
  var form = document.getElementById("lead-form");
  var note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var name = form.querySelector("#f-name");
    var phone = form.querySelector("#f-phone");
    var consent = form.querySelector("#f-consent");

    function fail(msg, el) {
      note.hidden = false;
      note.style.color = "#e0a0a0";
      note.textContent = msg;
      if (el) el.focus();
    }

    if (!name.value.trim()) return fail("Напишите, как к вам обращаться.", name);
    if (phone.value.replace(/\D/g, "").length < 10) return fail("Проверьте номер телефона.", phone);
    if (!consent.checked) return fail("Без согласия на обработку данных заявку принять нельзя.", consent);

    note.hidden = false;
    note.style.color = "#c8a464";
    note.textContent = "Это демо — заявка никуда не ушла. На рабочем сайте здесь письмо юристу и запись в CRM.";
    form.reset();
  });
})();
