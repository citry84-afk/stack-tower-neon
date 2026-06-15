/**
 * Home Brain Gym — CTA rutina diaria y onboarding automático
 */
(function () {
  'use strict';

  function hasProfile() {
    return window.LipaBrainPlan && LipaBrainPlan.hasProfile();
  }

  function updateHeroCta() {
    var btn = document.getElementById('hero-start-routine');
    if (!btn) return;
    btn.textContent = hasProfile()
      ? '▶ Empezar mi trabajo de hoy'
      : '▶ Empezar en 2 pasos';
  }

  function applyFirstVisit() {
    if (hasProfile()) return;
    document.body.classList.add('home--first-visit');
    var lead = document.querySelector('.landing-hero__lead');
    if (lead) {
      lead.innerHTML =
        '<strong>Elige curso y juega ~7 min al día.</strong> Lipi te dice qué toca. Sin instalar ni registrarte.';
    }
    var steps = document.querySelector('.landing-hero__steps');
    if (steps) steps.textContent = 'Curso → Juego → XP';
    updateHeroCta();
  }

  function clearFirstVisit() {
    document.body.classList.remove('home--first-visit');
    updateHeroCta();
  }

  function startRoutine(e) {
    if (e) e.preventDefault();
    if (window.LipaGuidedPath && LipaGuidedPath.startRoutine) {
      LipaGuidedPath.startRoutine(e);
      return;
    }
    if (!window.LipaBrainPlan) {
      window.location.href = '/entrenador-cerebro.html';
      return;
    }
    if (!hasProfile()) {
      if (window.LipaBrainOnboarding) {
        LipaBrainOnboarding.open({ fast: true, autoStart: true });
      } else {
        window.location.href = '/cursos.html';
      }
      return;
    }
    if (window.LipaBrain && LipaBrain.refreshProfileRoutine) {
      LipaBrain.refreshProfileRoutine();
    }
    if (window.LipaRoutineFlow && LipaRoutineFlow.beginFromProfile) {
      LipaRoutineFlow.beginFromProfile();
      return;
    }
    var p = LipaBrainPlan.getProfile();
    if (p && p.routine && p.routine.firstUrl) {
      window.location.href = p.routine.firstUrl;
    } else {
      window.location.href = '/entrenador-cerebro.html';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyFirstVisit();

    var btn = document.getElementById('hero-start-routine');
    if (btn) btn.addEventListener('click', startRoutine);

    if (
      document.body.getAttribute('data-brain-onboard-auto') === '1' &&
      window.LipaBrainOnboarding
    ) {
      LipaBrainOnboarding.autoOpenIfNeeded();
    }
  });

  window.addEventListener('lipa-profile-changed', function () {
    if (hasProfile()) clearFirstVisit();
    else applyFirstVisit();
  });
})();
