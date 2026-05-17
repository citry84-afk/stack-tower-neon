/**
 * UI Mi evolución — historial, rango, logros
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function xpProgress(xp, rank) {
    var ranks = (window.LipaBrainCatalog && LipaBrainCatalog.RANKS) || [];
    var next = null;
    for (var i = 0; i < ranks.length; i++) {
      if (ranks[i].id === rank.id && ranks[i + 1]) next = ranks[i + 1];
    }
    if (!next) return { pct: 100, label: 'Rango máximo' };
    var span = next.minXp - rank.minXp;
    var cur = xp - rank.minXp;
    var pct = span ? Math.min(100, Math.round((cur / span) * 100)) : 100;
    return { pct: pct, label: (next.minXp - xp) + ' XP para ' + next.name };
  }

  function last7Days(byDay) {
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var key = d.toISOString().split('T')[0];
      days.push({ key: key, count: byDay[key] || 0 });
    }
    var max = 1;
    days.forEach(function (d) { if (d.count > max) max = d.count; });
    return { days: days, max: max };
  }

  function render() {
    var root = document.getElementById('brain-evo-root');
    if (!root || !window.LipaBrain) return;

    var stats = LipaBrain.getStats();
    var summaries = LipaBrain.getActivitySummaries();
    var earned = LipaBrain.getAchievements();
    var allAch = (window.LipaBrainCatalog && LipaBrainCatalog.ACHIEVEMENTS) || [];
    var prog = xpProgress(stats.xp, stats.rank);
    var week = last7Days(stats.byDay);
    var code = LipaBrain.shortDeviceCode();

    if (!stats.totalSessions && !summaries.length) {
      root.innerHTML =
        '<div class="brain-evo-empty">' +
        '<p>Aún no hay entrenamientos guardados en este dispositivo.</p>' +
        '<p>Juega una ronda de <strong>Neon Cálculo</strong> o tu rutina personalizada.</p>' +
        '<a href="/gym-cerebro.html" class="lipa-btn lipa-btn--primary lipa-btn--brain">Ir al Brain Gym</a>' +
        '</div>';
      return;
    }

    var chartBars = week.days.map(function (d) {
      var h = Math.round((d.count / week.max) * 56) + 4;
      return '<div class="brain-evo-chart__bar" style="height:' + h + 'px" title="' + esc(d.key) + ': ' + d.count + '"></div>';
    }).join('');

    var acts = summaries.length
      ? summaries.map(function (a) {
          return '<li><a class="brain-evo-act" href="' + esc(a.game.url) + '">' +
            '<span class="brain-evo-act__emoji">' + a.game.emoji + '</span>' +
            '<span class="brain-evo-act__info"><strong>' + esc(a.game.name) + '</strong>' +
            '<span>' + a.plays + ' sesiones' +
            (a.best != null ? ' · mejor ' + a.best + ' ' + esc(a.game.metricLabel) : '') +
            '</span></span>' +
            '<span class="brain-evo-act__lvl">Nv ' + a.level + '</span>' +
            '</a></li>';
        }).join('')
      : '<li class="brain-evo-empty" style="padding:16px;">Completa un juego para ver actividades aquí.</li>';

    var earnedIds = {};
    earned.forEach(function (a) { earnedIds[a.id] = true; });

    var badges = allAch.map(function (a) {
      var on = earnedIds[a.id];
      return '<span class="brain-evo-badge' + (on ? '' : ' brain-evo-badge--locked') + '">' +
        (on ? '✓' : '○') + ' ' + esc(a.title) + '</span>';
    }).join('');

    root.innerHTML =
      '<div class="brain-evo-parent-banner">' +
      '<p>¿Eres padre, madre o tutor? <strong>Informe semanal</strong> con materias, días de entreno y qué reforzar.</p>' +
      '<a href="/para-padres.html" class="lipa-btn lipa-btn--secondary">Ver resumen para familias →</a></div>' +
      '<div class="brain-evo-grid brain-evo-grid--stats">' +
      '<div class="brain-evo-stat brain-evo-stat--wide">' +
      '<p class="brain-evo-stat__label">Tu rango cerebral</p>' +
      '<div class="brain-evo-rank">' +
      '<span class="brain-evo-rank__emoji">' + stats.rank.emoji + '</span>' +
      '<div><p class="brain-evo-stat__value" style="font-size:1.35rem;">' + esc(stats.rank.name) + '</p>' +
      '<p class="brain-evo-stat__sub">' + stats.xp + ' XP · código ' + esc(code) + '</p>' +
      '<div class="brain-evo-xp-bar"><div class="brain-evo-xp-bar__fill" style="width:' + prog.pct + '%"></div></div>' +
      '<p class="brain-evo-stat__sub">' + esc(prog.label) + '</p></div></div></div>' +
      '<div class="brain-evo-stat"><p class="brain-evo-stat__label">Racha</p>' +
      '<p class="brain-evo-stat__value">' + (stats.streak || 0) + ' días</p></div>' +
      '<div class="brain-evo-stat"><p class="brain-evo-stat__label">Esta semana</p>' +
      '<p class="brain-evo-stat__value">' + stats.weekSessions + '</p>' +
      '<p class="brain-evo-stat__sub">sesiones</p></div>' +
      '<div class="brain-evo-stat"><p class="brain-evo-stat__label">Total</p>' +
      '<p class="brain-evo-stat__value">' + stats.totalSessions + '</p>' +
      '<p class="brain-evo-stat__sub">entrenamientos</p></div>' +
      '</div>' +

      '<section class="brain-evo-section" aria-labelledby="evo-week-title">' +
      '<h2 id="evo-week-title">Últimos 7 días</h2>' +
      '<div class="brain-evo-chart" role="img" aria-label="Gráfico de sesiones por día">' + chartBars + '</div>' +
      '</section>' +

      '<section class="brain-evo-section" aria-labelledby="evo-act-title">' +
      '<h2 id="evo-act-title">Tus actividades</h2>' +
      '<ul class="brain-evo-activities">' + acts + '</ul>' +
      '</section>' +

      '<section class="brain-evo-section" aria-labelledby="evo-ach-title">' +
      '<h2 id="evo-ach-title">Logros</h2>' +
      '<div class="brain-evo-badges">' + badges + '</div>' +
      '</section>' +

      '<section class="brain-evo-section" aria-labelledby="evo-backup-title">' +
      '<h2 id="evo-backup-title">Copia y dispositivo</h2>' +
      '<p class="brain-evo-backup">Sin cuenta: datos en este navegador. Código: <code>' + esc(code) + '</code>. ' +
      'Exporta antes de cambiar de móvil; en Android/iOS usaremos el mismo código para sincronizar.</p>' +
      '<div class="brain-evo-backup-actions">' +
      '<button type="button" class="lipa-btn lipa-btn--secondary" data-export-backup>Descargar copia</button>' +
      '<label class="lipa-btn lipa-btn--ghost brain-evo-import-label">Restaurar copia<input type="file" accept="application/json,.json" data-import-backup hidden></label>' +
      '</div>' +
      '<p id="brain-evo-backup-msg" class="brain-evo-backup-msg" hidden role="status"></p>' +
      '</section>';

    bindBackup(root);
  }

  function bindBackup(root) {
    var msg = root.querySelector('#brain-evo-backup-msg');
    function showMsg(text, ok) {
      if (!msg) return;
      msg.hidden = false;
      msg.textContent = text;
      msg.className = 'brain-evo-backup-msg' + (ok ? ' brain-evo-backup-msg--ok' : ' brain-evo-backup-msg--err');
    }

    var exportBtn = root.querySelector('[data-export-backup]');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        var data = LipaBrain.exportBackup();
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'lipa-brain-' + data.code + '.json';
        a.click();
        URL.revokeObjectURL(a.href);
        showMsg('Copia descargada. Guárdala en un lugar seguro.', true);
      });
    }

    var importInp = root.querySelector('[data-import-backup]');
    if (importInp) {
      importInp.addEventListener('change', function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = JSON.parse(reader.result);
            var res = LipaBrain.importBackup(data);
            if (res.ok) {
              showMsg('Restaurado. Código: ' + res.code, true);
              setTimeout(function () { render(); }, 800);
            } else {
              showMsg(res.error || 'Error al restaurar', false);
            }
          } catch (err) {
            showMsg('Archivo JSON no válido', false);
          }
          importInp.value = '';
        };
        reader.readAsText(file);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
