/**
 * Intro cinematográfica Lipi — una vez al día en la home.
 */
(function (global) {
  'use strict';

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isHome() {
    var p = global.location.pathname.replace(/\/$/, '') || '/';
    return p === '' || p === '/' || p === '/index.html';
  }

  function alreadyShown() {
    try {
      return localStorage.getItem('lipa_wow_intro_' + today()) === '1';
    } catch (e) {
      return false;
    }
  }

  function markShown() {
    try {
      localStorage.setItem('lipa_wow_intro_' + today(), '1');
    } catch (e) { /* ignore */ }
  }

  function onboardingOpen() {
    var el = document.getElementById('lipa-brain-onboarding');
    return el && !el.hidden && el.offsetParent !== null;
  }

  function buildCopy() {
    var streak = 0;
    var name = '';
    if (global.LipaBrain) {
      var stats = LipaBrain.getStats();
      streak = stats.streak || 0;
      var profile = LipaBrain.getProfile();
      if (profile && profile.displayName) name = profile.displayName.split(' ')[0];
    }
    var title = name
      ? '¡' + name + ', misión del día lista!'
      : '¡Bienvenido al Neonverso!';
    var sub = streak >= 3
      ? 'Llevas ' + streak + ' días de racha. Hoy sumas otro bloque a tu torre cerebral.'
      : '7 minutos. Un boss. Un sobre de cartas. Cero deberes aburridos.';
    return { title: title, sub: sub, streak: streak };
  }

  function vibrate(ms) {
    if (global.navigator && global.navigator.vibrate) {
      try { global.navigator.vibrate(ms || 40); } catch (e) { /* ignore */ }
    }
  }

  function dismiss(overlay) {
    overlay.classList.add('is-exiting');
    markShown();
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = '';
    }, 480);
  }

  function show() {
    if (!isHome() || alreadyShown()) return;
    if (global.location.search.indexOf('skip-intro=1') >= 0) return;

    var copy = buildCopy();
    var overlay = document.createElement('div');
    overlay.className = 'lipa-wow-intro';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Bienvenida LIPA Brain Gym');

    if (prefersReducedMotion()) {
      overlay.innerHTML =
        '<div class="lipa-wow-intro__content">' +
        '<span class="lipa-wow-intro__lipi" aria-hidden="true">🧠</span>' +
        '<h2 class="lipa-wow-intro__title">' + copy.title + '</h2>' +
        '<p class="lipa-wow-intro__sub">' + copy.sub + '</p>' +
        '<div class="lipa-wow-intro__actions">' +
        '<button type="button" class="lipa-wow-intro__cta" id="wow-intro-go">▶ Empezar</button>' +
        '</div></div>';
    } else {
      overlay.innerHTML =
        '<div class="lipa-wow-intro__stars" aria-hidden="true"></div>' +
        '<div class="lipa-wow-intro__content">' +
        '<span class="lipa-wow-intro__lipi" aria-hidden="true">🧠</span>' +
        '<h2 class="lipa-wow-intro__title">' + copy.title + '</h2>' +
        '<p class="lipa-wow-intro__sub">' + copy.sub + '</p>' +
        (copy.streak >= 3
          ? '<p class="lipa-wow-intro__streak">🔥 Racha ' + copy.streak + ' días</p>'
          : '') +
        '<div class="lipa-wow-intro__actions">' +
        '<button type="button" class="lipa-wow-intro__cta" id="wow-intro-go">▶ Empezar misión</button>' +
        '<button type="button" class="lipa-wow-intro__skip" id="wow-intro-skip">Saltar intro</button>' +
        '</div></div>';
    }

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    if (global.LipaBrainPlay && LipaBrainPlay.chimeStart) {
      setTimeout(function () {
        try { LipaBrainPlay.chimeStart(); } catch (e) { /* ignore */ }
      }, 500);
    }
    vibrate(30);

    if (copy.streak >= 5 && global.LipaGameFeedback && LipaGameFeedback.confettiLite) {
      setTimeout(function () {
        try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
      }, 900);
    }

    var goBtn = overlay.querySelector('#wow-intro-go');
    var skipBtn = overlay.querySelector('#wow-intro-skip');
    if (goBtn) {
      goBtn.addEventListener('click', function () {
        dismiss(overlay);
        var target = document.getElementById('entreno-hoy') || document.getElementById('hero-start-routine');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var start = document.getElementById('hero-start-routine');
        if (start) setTimeout(function () { start.focus(); }, 600);
      });
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', function () { dismiss(overlay); });
    }

    if (!prefersReducedMotion()) {
      setTimeout(function () {
        if (overlay.parentNode) dismiss(overlay);
      }, 6500);
    }
  }

  function tryShow() {
    if (onboardingOpen()) {
      setTimeout(tryShow, 1200);
      return;
    }
    show();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(tryShow, 600);
  });

  global.LipaWowIntro = { show: show, tryShow: tryShow };
})(typeof window !== 'undefined' ? window : global);
