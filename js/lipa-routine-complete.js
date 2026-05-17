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

  function render(root) {
    var summary = loadSummary();
    var stats = global.LipaBrain ? LipaBrain.getStats() : {};
    var streak = (summary && summary.streak) || stats.streak || 0;
    var xp = (summary && summary.xp) || stats.xp || 0;
    var rank = stats.rank || {};
    var practiced = (summary && summary.practiced) || 'varias materias';
    var subjects = (summary && summary.subjects) || [];
    var unlocked = isRecreoUnlocked();

    root.innerHTML =
      '<div class="entreno-completo">' +
      '<p class="entreno-completo__stars" aria-hidden="true">⭐ ✨ ⭐</p>' +
      '<h1>¡Entreno de hoy completado!</h1>' +
      '<p class="entreno-completo__lead">Has terminado tus misiones del cole. Tu cerebro ha entrenado bien.</p>' +
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
      '<p class="entreno-completo__foot">Mañana tendrás nuevas misiones en tu curso.</p>' +
      '</div>';

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
