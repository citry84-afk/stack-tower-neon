/**
 * Home Brain Gym — CTA rutina diaria y onboarding automático
 */
(function () {
  'use strict';

  function startRoutine(e) {
    if (e) e.preventDefault();
    if (!window.LipaBrainPlan) {
      window.location.href = '/entrenador-cerebro.html';
      return;
    }
    if (!LipaBrainPlan.hasProfile()) {
      if (window.LipaBrainOnboarding) {
        LipaBrainOnboarding.open();
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
    var btn = document.getElementById('hero-start-routine');
    if (btn) btn.addEventListener('click', startRoutine);

    if (
      document.body.getAttribute('data-brain-onboard-auto') === '1' &&
      window.LipaBrainOnboarding
    ) {
      LipaBrainOnboarding.autoOpenIfNeeded();
    }
  });
})();
