/**
 * Bloque «Retos rápidos» en la home
 */
(function (global) {
  'use strict';

  function mount() {
    var root = document.getElementById('home-quick-tests-mount');
    if (!root || !global.LipaQuickTests) return;

    var ageBand = null;
    if (global.LipaBrain && LipaBrain.getProfile) {
      var p = LipaBrain.getProfile();
      if (p && p.courseId && global.LipaCurriculum) {
        LipaCurriculum.init();
        ageBand = LipaCurriculum.courseToAgeBand(p.courseId);
      } else if (p && p.ageBand) {
        ageBand = p.ageBand;
      }
    }

    root.innerHTML = LipaQuickTests.renderCardsHtml({ ageBand: ageBand });
  }

  document.addEventListener('DOMContentLoaded', mount);
  global.addEventListener('lipa-profile-changed', mount);
})(typeof window !== 'undefined' ? window : global);
