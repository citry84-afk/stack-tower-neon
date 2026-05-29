/**
 * Pantalla de cierre del entreno diario (5 misiones) + Recreo Neon.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function loadSummary() {
    try {
      var raw = sessionStorage.getItem('lipa-routine-summary');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function isRecreoUnlocked() {
    try {
      var day = new Date().toISOString().split('T')[0];
      return localStorage.getItem('lipa_recreo_unlock') === day;
    } catch (e) {
      return true;
    }
  }

  function headline(summary, streak) {
    if (streak >= 7) return '¡Semana de campeón!';
    if (streak >= 3) return '¡Racha en marcha!';
    return '¡Entreno de hoy completado!';
  }

  function leadCopy(summary, steps) {
    var course = summary && summary.courseLabel;
    var base = course
      ? 'Has terminado las misiones de ' + course + '. Tu cerebro ha entrenado bien.'
      : 'Has terminado tus misiones del cole. Tu cerebro ha entrenado bien.';
    if (steps >= 5) return base + ' Cinco misiones en el bolsillo.';
    if (steps >= 3) return base + ' Buen ritmo: sigue así mañana.';
    return base;
  }

  function renderMissions(missions) {
    if (!missions || !missions.length) return '';
    return (
      '<ul class="entreno-completo__missions">' +
      missions
        .map(function (m) {
          return (
            '<li><span class="entreno-completo__mission-n">' +
            esc(m.tag || '') +
            '</span> ' +
            esc((m.emoji ? m.emoji + ' ' : '') + (m.name || m.subject || '')) +
            '</li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function celebrate() {
    if (global.LipaGameFeedback && LipaGameFeedback.confettiLite) {
      try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
    }
    if (global.LipaMascot) {
      LipaMascot.say('complete', '¡Has cerrado el entreno del cole! Mañana Lipi te espera con nuevas misiones.');
    }
  }

  function render(root) {
    var summary = loadSummary();
    var stats = global.LipaBrain ? LipaBrain.getStats() : {};
    var streak = (summary && summary.streak) || stats.streak || 0;
    var xp = (summary && summary.xp) || stats.xp || 0;
    var rank = stats.rank || {};
    var practiced = (summary && summary.practiced) || 'varias materias';
    var subjects = (summary && summary.subjects) || [];
    var steps = (summary && summary.steps) || 0;
    var unlocked = isRecreoUnlocked();
    var xpBonus = summary && summary.xpBonus ? summary.xpBonus : steps * 12;

    root.innerHTML =
      '<div class="entreno-completo">' +
      '<p class="entreno-completo__stars" aria-hidden="true">⭐ ✨ ⭐</p>' +
      '<h1>' + esc(headline(summary, streak)) + '</h1>' +
      '<p class="entreno-completo__lead">' + esc(leadCopy(summary, steps)) + '</p>' +
      (summary && summary.courseLabel
        ? '<p class="entreno-completo__course">Curso: <strong>' + esc(summary.courseLabel) + '</strong></p>'
        : '') +
      '<div class="entreno-completo__stats">' +
      '<div><strong>' +
      esc(String(streak)) +
      '</strong><span>días de racha</span></div>' +
      '<div><strong>' +
      esc(String(xp)) +
      '</strong><span>XP total</span></div>' +
      '<div><strong>' +
      esc((rank.emoji || '⭐') + ' ' + (rank.name || summary.rankName || 'Novato')) +
      '</strong><span>nivel</span></div>' +
      '</div>' +
      (xpBonus
        ? '<p class="entreno-completo__xp-bonus">Hoy sumaste aprox. <strong>+' + esc(String(xpBonus)) + ' XP</strong> con el entreno.</p>'
        : '') +
      (subjects.length
        ? '<p class="entreno-completo__practiced">Hoy has practicado: <strong>' + esc(practiced) + '</strong></p>'
        : '') +
      renderMissions(summary && summary.missions) +
      (unlocked
        ? '<div class="entreno-completo__reward">' +
          '<p class="entreno-completo__reward-label">🎁 Recompensa desbloqueada</p>' +
          '<h2>Recreo Neon</h2>' +
          '<p>Primero el cole, después el arcade. Juega Stack Tower, reflejos y más sin presión.</p>' +
          '<a href="/recreo-neon.html" class="lipa-btn lipa-btn--primary entreno-completo__recreo">▶ Ir al Recreo Neon</a>' +
          '</div>'
        : '') +
      '<div class="entreno-completo__actions">' +
      '<a href="/" class="lipa-btn lipa-btn--secondary">Inicio</a>' +
      '<a href="/mi-evolucion.html" class="lipa-btn lipa-btn--secondary">Mi evolución</a>' +
      '<a href="/para-padres.html" class="lipa-btn lipa-btn--ghost">Informe para padres</a>' +
      '</div>' +
      '<p class="entreno-completo__foot">Vuelve mañana: un poco cada día gana al estudio de última hora.</p>' +
      '</div>';

    celebrate();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('entreno-completo-app');
    if (!root) return;
    if (!loadSummary()) {
      root.innerHTML =
        '<div class="entreno-completo">' +
        '<h1>Entreno de hoy</h1>' +
        '<p>Aún no hay un entreno recién terminado. Empieza tu rutina desde el inicio.</p>' +
        '<a href="/" class="lipa-btn lipa-btn--primary lipa-btn--brain">▶ Empezar entrenamiento</a>' +
        '</div>';
      return;
    }
    render(root);
    try {
      sessionStorage.removeItem('lipa-routine-summary');
    } catch (e) { /* ignore */ }
  });
})(typeof window !== 'undefined' ? window : global);
