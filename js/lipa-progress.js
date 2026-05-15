/**
 * Panel de progreso + reto semanal en /jugar y banner compacto
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function renderProgress(el) {
    if (!el || !window.LipaDaily) return;
    var r = LipaDaily.getAllRecords();
    var rows = [
      { icon: '⚡', label: 'Test reflejos', value: r.reactionMs ? r.reactionMs + ' ms' : '—', href: '/test-reflejos.html' },
      { icon: '🎯', label: 'Aim Trainer', value: r.aim ? r.aim + ' pts' : '—', href: '/aim-trainer-neon.html' },
      { icon: '🔲', label: 'Grid 4×4', value: r.grid ? r.grid + ' aciertos' : '—', href: '/grid-reflejos-neon.html' },
      { icon: '🎮', label: 'Stack Tower', value: r.stack ? r.stack + ' pts' : '—', href: '/' },
      { icon: '🎵', label: 'Neon Beat', value: r.beat ? r.beat + ' pts' : '—', href: '/neon-beat.html' }
    ];
    el.innerHTML =
      '<div class="progress-head">' +
      '<div class="progress-stat"><span>Racha global</span><strong>' + r.streak + ' días</strong></div>' +
      '<div class="progress-stat"><span>Días entrenados</span><strong>' + (r.totalDays || 0) + '</strong></div>' +
      '<div class="progress-stat"><span>Esta semana</span><strong>' + r.gamesToday + ' juegos</strong></div>' +
      '</div>' +
      '<ul class="progress-records">' +
      rows.map(function (row) {
        return '<li><a href="' + row.href + '"><span>' + row.icon + ' ' + esc(row.label) + '</span><strong>' + esc(row.value) + '</strong></a></li>';
      }).join('') +
      '</ul>';
  }

  function renderWeekly(el, compact) {
    if (!el || !window.LipaDaily) return;
    var w = LipaDaily.getWeeklyChallenge();
    var d = w.def;
    var done = w.completed;
    var pct = 0;
    if (d.type === 'play_count') pct = Math.min(100, Math.round((w.progress / d.target) * 100));
    else if (d.type === 'max_ms' && w.state.values[d.game]) {
      pct = w.state.values[d.game] <= d.target ? 100 : Math.max(5, Math.round((d.target / w.state.values[d.game]) * 100));
    } else if (d.type === 'min_score') pct = Math.min(100, Math.round(((w.state.values[d.game] || 0) / d.target) * 100));
    el.className = 'weekly-panel' + (done ? ' weekly-panel--done' : '') + (compact ? ' weekly-panel--compact' : '');
    el.innerHTML =
      '<div class="weekly-inner">' +
      '<p class="weekly-kicker">' + (done ? '✅ Reto completado' : '🏆 Reto de la semana') + ' · ' + esc(w.weekId) + '</p>' +
      '<h2 class="weekly-title">' + esc(d.title) + '</h2>' +
      '<p class="weekly-desc">' + esc(d.desc) + '</p>' +
      '<div class="weekly-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
      '<p class="weekly-progress">' + esc(w.label) + '</p>' +
      (done ? '' : '<a class="weekly-cta" href="' + d.url + '">' + esc(d.cta) + ' →</a>') +
      (!compact ? '<button type="button" class="weekly-share" id="weekly-share-btn">Compartir reto</button>' : '') +
      '</div>';
    var shareBtn = el.querySelector('#weekly-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var msg = done
          ? '✅ Completé el reto semanal de LIPA Studios: ' + d.title
          : '🏆 Mi reto esta semana en LIPA: ' + d.title + ' (' + w.label + ')';
        LipaDaily.shareResult({ text: msg, url: 'https://lipastudios.com/jugar.html' });
      });
    }
  }

  function init() {
    renderProgress(document.getElementById('lipa-progress-panel'));
    renderWeekly(document.getElementById('lipa-weekly-panel'), false);
    renderWeekly(document.getElementById('lipa-weekly-compact'), true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
