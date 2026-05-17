/**
 * Muestra rutinas Brain Gym en páginas de entrenador
 */
(function () {
  'use strict';

  var FIXED = [
    { url: '/neon-calculo.html', name: 'Neon Cálculo', tip: 'Suma y resta rápida', id: 'neon-calculo' },
    { url: '/tablas-relampago.html', name: 'Tablas Relámpago', tip: 'Multiplicar', id: 'tablas-relampago' },
    { url: '/test-reflejos.html', name: 'Test reflejos', tip: 'Tiempo en ms', id: 'reaction-test' },
    { url: '/toque-flash-neon.html', name: 'Flash Tap', tip: 'Atención visual', id: 'flash-tap' },
    { url: '/grid-reflejos-neon.html', name: 'Grid 4×4', tip: 'Precisión', id: 'grid-reflex' }
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function levelTag(id) {
    if (!window.LipaBrain) return '';
    var lv = LipaBrain.getActivityLevel(id);
    return ' <span class="brain-routine-lvl">Nv ' + lv + '</span>';
  }

  function renderFixed(el) {
    el.innerHTML = FIXED.map(function (s, i) {
      return '<li><strong>1 min</strong> — <a href="' + esc(s.url) + '">' + esc(s.name) + '</a>' +
        levelTag(s.id) + ' (' + esc(s.tip) + ').</li>';
    }).join('');
  }

  function renderPersonal(el) {
    if (!window.LipaBrain) return;
    LipaBrain.refreshProfileRoutine();
    var p = LipaBrain.getProfile();
    if (!p || !p.routine) {
      el.innerHTML = '<li>Crea <a href="/mi-rutina-cerebro.html">tu rutina personalizada</a> en 4 preguntas.</li>';
      return;
    }
    el.innerHTML = p.routine.steps.map(function (s) {
      return '<li><strong>1 min</strong> — <a href="' + esc(s.url) + '">' + esc(s.name) + '</a>' +
        ' <span class="brain-routine-lvl">Nv ' + s.level + '</span> (' + esc(s.tip) + ').</li>';
    }).join('') +
      '<li class="brain-routine-guided-hint"><a href="#" data-start-guided-routine>Iniciar toda la rutina guiada →</a></li>';
  }

  function init() {
    document.querySelectorAll('[data-brain-routine]').forEach(function (el) {
      var mode = el.getAttribute('data-brain-routine');
      if (mode === 'fixed') renderFixed(el);
      else if (mode === 'personal') renderPersonal(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
