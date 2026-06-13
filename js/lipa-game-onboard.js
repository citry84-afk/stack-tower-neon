/**
 * Onboarding de curso en juegos sueltos (Neon Palabra, Sílabas…)
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function needsCourse() {
    if (!global.LipaBrain) return false;
    var p = LipaBrain.getProfile();
    return !p || !p.courseId;
  }

  function openCoursePicker(onComplete) {
    if (global.LipaBrainOnboarding && LipaBrainOnboarding.openGameCourse) {
      LipaBrainOnboarding.openGameCourse({ onComplete: onComplete });
    } else if (global.LipaBrainOnboarding) {
      LipaBrainOnboarding.open({ onComplete: onComplete });
    } else {
      global.location.href = '/cursos.html?empezar=1';
    }
  }

  function injectStyles() {
    if (document.getElementById('lipa-game-onboard-css')) return;
    var s = document.createElement('style');
    s.id = 'lipa-game-onboard-css';
    s.textContent =
      '.lipa-game-course-banner{margin:0.65rem 0 1rem;padding:0.65rem 0.85rem;border-radius:12px;' +
      'font-size:14px;line-height:1.5;text-align:center;background:rgba(255,138,91,0.12);' +
      'border:1px solid rgba(255,138,91,0.35);color:#5c5346}' +
      '.lipa-game-course-banner button{margin-left:0.35rem;padding:0.25rem 0.65rem;border-radius:8px;' +
      'border:1px solid rgba(124,58,237,0.35);background:#fff;font-weight:700;font-size:13px;' +
      'cursor:pointer;color:#5b21b6}';
    document.head.appendChild(s);
  }

  function mountBanner() {
    if (!document.body.classList.contains('game-page--lengua')) return;
    var levelEl = document.getElementById('lengua-brain-level');
    if (!levelEl || document.getElementById('lipa-game-course-banner')) return;
    injectStyles();
    var banner = document.createElement('p');
    banner.id = 'lipa-game-course-banner';
    banner.className = 'lipa-game-course-banner';
    banner.setAttribute('role', 'status');
    levelEl.parentNode.insertBefore(banner, levelEl.nextSibling);
    refreshBanner();
  }

  function refreshBanner() {
    var banner = document.getElementById('lipa-game-course-banner');
    if (!banner || !global.LipaBrain) return;
    if (!needsCourse()) {
      var p = LipaBrain.getProfile();
      var label = p.courseLabel || '';
      if (!label && p.courseId && global.LipaCurriculum) {
        LipaCurriculum.init();
        var c = LipaCurriculum.getCourse(p.courseId);
        if (c) label = c.label;
      }
      banner.innerHTML = '📚 Curso: <strong>' + esc(label || p.courseId) + '</strong> · ' +
        '<button type="button" class="lipa-game-course-banner__change">Cambiar</button>';
      var ch = banner.querySelector('.lipa-game-course-banner__change');
      if (ch) ch.addEventListener('click', function () { openCoursePicker(refreshBanner); });
      return;
    }
    banner.innerHTML = '👋 <strong>Primera vez:</strong> elige tu curso para palabras a tu medida. ' +
      '<button type="button" class="lipa-game-course-banner__pick">Elegir curso</button>';
    var pk = banner.querySelector('.lipa-game-course-banner__pick');
    if (pk) pk.addEventListener('click', function () { openCoursePicker(refreshBanner); });
  }

  function autoOpenIfNeeded() {
    if (document.body.getAttribute('data-brain-onboard-auto') !== '1') return;
    if (!needsCourse()) return;
    setTimeout(function () {
      openCoursePicker(refreshBanner);
    }, 550);
  }

  global.LipaGameOnboard = {
    needsCourse: needsCourse,
    openCoursePicker: openCoursePicker,
    refreshBanner: refreshBanner
  };

  document.addEventListener('DOMContentLoaded', function () {
    mountBanner();
    autoOpenIfNeeded();
  });
  global.addEventListener('lipa-profile-changed', refreshBanner);
})(typeof window !== 'undefined' ? window : global);
