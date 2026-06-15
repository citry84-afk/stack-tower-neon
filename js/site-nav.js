(function () {
  var btn = document.getElementById("nav-toggle");
  var panel = document.getElementById("primary-nav");
  var backdrop = document.getElementById("nav-backdrop");
  var navEl = document.querySelector(".site-nav");
  if (!btn || !panel || !backdrop || !navEl) return;

  function navOffsetPx() {
    return Math.round(navEl.getBoundingClientRect().height);
  }

  function applyNavOffset() {
    if (window.matchMedia("(max-width: 900px)").matches) {
      navEl.style.setProperty("--nav-offset", navOffsetPx() + "px");
    } else {
      navEl.style.removeProperty("--nav-offset");
    }
  }

  function setOpen(open) {
    if (!window.matchMedia("(max-width: 900px)").matches) {
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.classList.remove("nav-drawer-open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menú de navegación");
      backdrop.setAttribute("aria-hidden", "true");
      return;
    }
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute(
      "aria-label",
      open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
    panel.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("nav-drawer-open", open);
    if (open) applyNavOffset();
  }

  btn.addEventListener("click", function () {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });
  backdrop.addEventListener("click", function () {
    setOpen(false);
  });
  panel.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      setOpen(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("is-open")) setOpen(false);
  });
  window.addEventListener("resize", function () {
    applyNavOffset();
    if (!window.matchMedia("(max-width: 900px)").matches) {
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.classList.remove("nav-drawer-open");
      btn.setAttribute("aria-expanded", "false");
      backdrop.setAttribute("aria-hidden", "true");
    }
  });
  applyNavOffset();
  window.addEventListener("load", applyNavOffset);

  function highlightCurrentNavLink() {
    var path = location.pathname.replace(/\/$/, "") || "/";
    panel.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      try {
        var u = new URL(href, location.origin);
        var p = u.pathname.replace(/\/$/, "") || "/";
        if (p === path) a.setAttribute("aria-current", "page");
      } catch (e) {}
    });
  }
  highlightCurrentNavLink();

  if (!window.LipaBrainPlay) {
    var sfx = document.createElement('script');
    sfx.src = '/js/lipa-brain-play.js?v=2';
    sfx.defer = true;
    document.head.appendChild(sfx);
  }
})();
