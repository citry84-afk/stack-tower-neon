/**
 * Home Brain Gym — CTA rutina diaria y onboarding automático
 */
(function () {
  'use strict';

  function canStartWork() {
    if (!window.LipaBrain || !LipaBrain.getProfile) return false;
    var p = LipaBrain.getProfile();
    return !!(p && p.courseId);
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
    var extra = document.getElementById('home-entreno-extra');
    if (extra && !extra.open) extra.open = false;
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
      document.getElementById('home-start-work') ||
      document.querySelector('#brain-home-continue [data-guided-routine]') ||
      document.querySelector('#lipa-brain-plan-mount [data-start-guided-routine]')
    );
  }

  function highlightWorkButton() {
    var btn = getWorkButton();
    if (!btn) return;
    btn.classList.add('home-start-work--pulse');
    btn.setAttribute('id', 'home-start-work');
  }

  function scrollToWork(focus) {
    var section = document.getElementById('entreno-hoy');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (!focus) return;
    setTimeout(function () {
      var btn = getWorkButton();
      if (btn) {
        btn.focus({ preventScroll: true });
        highlightWorkButton();
      }
    }, 450);
  }

  function launchWork(e) {
    if (e) e.preventDefault();

    if (!canStartWork()) {
      if (window.LipaBrainOnboarding) {
        LipaBrainOnboarding.open({ fast: true, autoStart: true });
      } else {
        window.location.href = '/cursos.html?empezar=1';
      }
      return;
    }

    if (window.LipaBrain && LipaBrain.refreshProfileRoutine) {
      LipaBrain.refreshProfileRoutine();
    }

    var profile = window.LipaBrain ? LipaBrain.getProfile() : null;
    var routine = profile && profile.routine;
    if (!routine || !routine.steps || !routine.steps.length) {
      window.alert('Falta elegir el curso. Te llevamos al mapa de cursos.');
      window.location.href = '/cursos.html?empezar=1';
      return;
    }

    var btn = e && e.target ? e.target.closest('button, a') : null;
    if (btn) {
      btn.setAttribute('aria-busy', 'true');
      if (btn.tagName === 'BUTTON') btn.disabled = true;
      var prev = btn.textContent;
      if (prev && prev.indexOf('…') < 0) {
        btn.textContent = 'Abriendo primera misión…';
        setTimeout(function () {
          if (!btn.isConnected) return;
          btn.removeAttribute('aria-busy');
          if (btn.tagName === 'BUTTON') btn.disabled = false;
          btn.textContent = prev;
        }, 8000);
      }
    }

    if (window.LipaRoutineFlow && LipaRoutineFlow.beginFromProfile) {
      LipaRoutineFlow.beginFromProfile({ restart: true });
      return;
    }

    if (routine.firstUrl) {
      window.location.href = routine.firstUrl;
      return;
    }

    window.location.href = '/cursos.html?empezar=1';
  }

  function startRoutine(e) {
    if (e) e.preventDefault();

    if (canStartWork()) {
      launchWork(e);
      return;
    }

    if (window.LipaGuidedPath && LipaGuidedPath.startOnboarding) {
      LipaGuidedPath.startOnboarding(e);
      return;
    }
    if (window.LipaBrainOnboarding) {
      LipaBrainOnboarding.open({ fast: true, autoStart: true });
      return;
    }
    window.location.href = '/cursos.html?empezar=1';
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

    var heroBtn = document.getElementById('hero-start-routine');
    if (heroBtn) heroBtn.addEventListener('click', startRoutine);

    if (
      document.body.getAttribute('data-brain-onboard-auto') === '1' &&
      window.LipaBrainOnboarding
    ) {
      LipaBrainOnboarding.autoOpenIfNeeded();
    }

    setTimeout(refreshHomeMode, 0);
  });

  window.addEventListener('load', refreshHomeMode);
  window.addEventListener('lipa-profile-changed', refreshHomeMode);
  window.addEventListener('lipa-routine-subjects-changed', function () {
    setTimeout(highlightWorkButton, 50);
  });

  window.LipaHomeBrain = {
    canStartWork: canStartWork,
    launchWork: launchWork,
    refreshHomeMode: refreshHomeMode
  };
})();
