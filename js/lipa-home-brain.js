/**
 * Home Brain Gym — CTA rutina diaria y onboarding automático
 */
(function () {
  'use strict';

  function canStartWork() {
    if (window.LipaRoutineFlow && LipaRoutineFlow.canStartWork) {
      return LipaRoutineFlow.canStartWork();
    }
    if (!window.LipaBrain || !LipaBrain.getProfile) return false;
    var p = LipaBrain.getProfile();
    return !!(p && p.courseId);
  }

  function launchWork(e) {
    if (window.LipaRoutineFlow && LipaRoutineFlow.startWork) {
      LipaRoutineFlow.startWork(e);
      return;
    }
    if (e && e.preventDefault) e.preventDefault();
    window.location.href = '/cursos.html?empezar=1';
  }

  function updateHeroCta() {
    var btn = document.getElementById('hero-start-routine');
    if (!btn) return;
    if (canStartWork()) {
      btn.textContent = '▶ Empezar mi trabajo de hoy';
      btn.setAttribute('aria-describedby', 'entreno-hoy-title');
    } else {
      btn.textContent = '▶ Empezar en 2 pasos';
      btn.removeAttribute('aria-describedby');
    }
  }

  function applyReturning() {
    if (!canStartWork()) {
      document.body.classList.remove('home--returning');
      return;
    }
    document.body.classList.add('home--returning');
    document.body.classList.remove('home--first-visit');
    var steps = document.querySelector('.landing-hero__steps');
    if (steps) {
      steps.textContent = 'Tu botón morado está en «Tu entreno de hoy» — un toque y juegas';
    }
    var lead = document.querySelector('.landing-hero__lead');
    if (lead && !lead.getAttribute('data-home-lead-saved')) {
      lead.setAttribute('data-home-lead-saved', '1');
      lead.innerHTML =
        '<strong>¡Hola de nuevo!</strong> Baja un poco: el botón grande morado abre tu misión de ~7 min.';
    }
    updateHeroCta();
    highlightWorkButton();
    var heroBtn = document.getElementById('hero-start-routine');
    if (heroBtn) heroBtn.hidden = true;
    var missions = document.getElementById('home-today-missions');
    if (missions) missions.hidden = true;
  }

  function applyFirstVisit() {
    if (canStartWork()) {
      applyReturning();
      return;
    }
    document.body.classList.add('home--first-visit');
    document.body.classList.remove('home--returning');
    var heroBtn = document.getElementById('hero-start-routine');
    if (heroBtn) heroBtn.hidden = false;
    var lead = document.querySelector('.landing-hero__lead');
    if (lead) {
      lead.innerHTML =
        '<strong>Elige curso y juega ~7 min al día.</strong> Lipi te dice qué toca. Sin instalar ni registrarte.';
    }
    var steps = document.querySelector('.landing-hero__steps');
    if (steps) steps.textContent = 'Curso → Juego → XP';
    updateHeroCta();
  }

  function refreshHomeMode() {
    if (canStartWork()) applyReturning();
    else applyFirstVisit();
  }

  function getWorkButton() {
    return (
      document.querySelector('#brain-home-continue [data-guided-routine]') ||
      document.getElementById('home-start-work') ||
      document.querySelector('#lipa-brain-plan-mount [data-start-guided-routine]')
    );
  }

  function highlightWorkButton() {
    var btn = getWorkButton();
    if (!btn) return;
    btn.classList.add('home-start-work--pulse');
    if (!btn.id) btn.id = 'home-start-work';
  }

  function startRoutine(e) {
    if (window.LipaRoutineFlow && LipaRoutineFlow.startWork) {
      LipaRoutineFlow.startWork(e);
      return;
    }
    if (e) e.preventDefault();
    if (window.LipaBrainOnboarding) {
      LipaBrainOnboarding.open({ fast: true, autoStart: true });
    } else {
      window.location.href = '/cursos.html?empezar=1';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    refreshHomeMode();

    var fold = document.getElementById('home-neonverso-fold');
    if (fold && canStartWork()) {
      var open = false;
      if (window.LipaCards && LipaCards.pendingPacks().length) open = true;
      if (window.LipaBrain && (LipaBrain.getStats().streak || 0) >= 7) open = true;
      if (open) fold.open = true;
    }

    setTimeout(refreshHomeMode, 0);
    setTimeout(highlightWorkButton, 100);
  });

  window.addEventListener('load', function () {
    refreshHomeMode();
    highlightWorkButton();
  });
  window.addEventListener('lipa-profile-changed', function () {
    refreshHomeMode();
    setTimeout(highlightWorkButton, 50);
  });
  window.addEventListener('lipa-routine-subjects-changed', function () {
    setTimeout(highlightWorkButton, 50);
  });

  window.LipaHomeBrain = {
    canStartWork: canStartWork,
    launchWork: launchWork,
    refreshHomeMode: refreshHomeMode
  };
})();
