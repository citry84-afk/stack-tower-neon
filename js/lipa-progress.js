/**
 * Panel de progreso + reto semanal en /jugar y banner compacto
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function flashBtn(btn, okText) {
    if (!btn) return;
    var prev = btn.textContent;
    btn.textContent = okText;
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = prev;
      btn.disabled = false;
    }, 2000);
  }

  function renderChallengeInvite() {
    if (!window.LipaDaily) return;
    var invite = LipaDaily.parseChallengeFromUrl();
    if (!invite) return;

    var host = document.getElementById('lipa-challenge-invite');
    if (!host) {
      host = document.createElement('section');
      host.id = 'lipa-challenge-invite';
      host.className = 'challenge-invite';
      host.setAttribute('aria-live', 'polite');
      var weekly = document.getElementById('lipa-weekly-panel');
      if (weekly && weekly.parentNode) {
        weekly.parentNode.insertBefore(host, weekly);
      } else {
        document.body.insertBefore(host, document.body.firstChild);
      }
    }

    var d = invite.def;
    var w = LipaDaily.getWeeklyChallenge();
    var myScore = null;
    if (invite.isCurrentWeek) {
      if (d.type === 'play_count') myScore = w.state.plays.length;
      else myScore = w.state.values[d.game] || null;
    }

    var headline = invite.from
      ? '👊 ' + esc(invite.from) + ' te reta'
      : '👊 Te han retado al desafío semanal';
    var vsLine = invite.vs != null ? LipaDaily.formatVsLabel(d, invite.vs) : '';
    var beat = invite.vs != null && myScore != null && LipaDaily.didBeatChallengeScore(d, myScore, invite.vs);
    var weekNote = invite.isCurrentWeek
      ? ''
      : '<p class="challenge-invite__note">Reto de la semana ' + esc(invite.weekId) + ' (ahora es ' + esc(w.weekId) + ').</p>';

    host.innerHTML =
      '<div class="challenge-invite__inner">' +
      '<p class="challenge-invite__kicker">' + headline + '</p>' +
      '<h2 class="challenge-invite__title">' + esc(d.title) + '</h2>' +
      '<p class="challenge-invite__desc">' + esc(d.desc) + '</p>' +
      (vsLine ? '<p class="challenge-invite__vs">' + esc(vsLine) + '</p>' : '') +
      weekNote +
      (beat ? '<p class="challenge-invite__win">✅ Ya superaste esta marca en tu cuenta.</p>' : '') +
      '<a class="challenge-invite__cta" href="' + esc(d.url) + '">Aceptar reto →</a>' +
      '</div>';
  }

  function formatWeeklyGames(plays) {
    var names = {
      'reaction-test': 'Test',
      'aim-trainer': 'Aim',
      'grid-reflex': 'Grid',
      'stack-tower': 'Stack',
      'flash-tap': 'Flash',
      'esquiva-neon': 'Esquiva'
    };
    if (!plays || !plays.length) return 'Aún no has jugado esta semana';
    return plays.map(function (id) { return names[id] || id; }).join(' · ');
  }

  function renderProgress(el) {
    if (!el || !window.LipaDaily) return;
    var r = LipaDaily.getAllRecords();
    var weekly = LipaDaily.getWeeklyChallenge();
    var played = (weekly.state && weekly.state.plays) || [];
    var rows = [
      { icon: '⚡', label: 'Test reflejos', value: r.reactionMs ? r.reactionMs + ' ms' : '—', href: '/test-reflejos.html' },
      { icon: '🎯', label: 'Aim Trainer', value: r.aim ? r.aim + ' pts' : '—', href: '/aim-trainer-neon.html' },
      { icon: '🔲', label: 'Grid 4×4', value: r.grid ? r.grid + ' aciertos' : '—', href: '/grid-reflejos-neon.html' },
      { icon: '🎮', label: 'Stack Tower', value: r.stack ? r.stack + ' pts' : '—', href: '/' },
      { icon: '⚡', label: 'Flash Tap', value: r.flashTap ? r.flashTap + ' pts' : '—', href: '/toque-flash-neon.html' },
      { icon: '🔀', label: 'Neon Esquiva', value: r.esquiva ? r.esquiva + ' pts' : '—', href: '/esquiva-neon.html' }
    ];
    el.innerHTML =
      '<div class="progress-head">' +
      '<div class="progress-stat"><span>Racha global</span><strong>' + r.streak + ' días</strong></div>' +
      '<div class="progress-stat"><span>Días entrenados</span><strong>' + (r.totalDays || 0) + '</strong></div>' +
      '<div class="progress-stat"><span>Esta semana</span><strong>' + played.length + ' juegos</strong></div>' +
      '</div>' +
      '<p class="progress-weekly-games">' + esc(formatWeeklyGames(played)) + '</p>' +
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

    var myVs = null;
    if (d.game !== 'any') {
      if (d.type === 'play_count') myVs = w.state.plays.length || null;
      else myVs = w.state.values[d.game] || null;
    }

    el.className = 'weekly-panel' + (done ? ' weekly-panel--done' : '') + (compact ? ' weekly-panel--compact' : '');
    el.innerHTML =
      '<div class="weekly-inner">' +
      '<p class="weekly-kicker">' + (done ? '✅ Reto completado' : '🏆 Reto de la semana') + ' · ' + esc(w.weekId) + '</p>' +
      '<h2 class="weekly-title">' + esc(d.title) + '</h2>' +
      '<p class="weekly-desc">' + esc(d.desc) + '</p>' +
      '<div class="weekly-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
      '<p class="weekly-progress">' + esc(w.label) + '</p>' +
      (done ? '' : '<a class="weekly-cta" href="' + d.url + '">' + esc(d.cta) + ' →</a>') +
      (!compact
        ? '<div class="weekly-actions">' +
          '<button type="button" class="weekly-share" id="weekly-copy-btn">Copiar enlace de desafío</button>' +
          '<button type="button" class="weekly-share weekly-share--ghost" id="weekly-share-btn">Compartir reto</button>' +
          '</div>'
        : '<button type="button" class="weekly-share weekly-share--inline" id="weekly-copy-compact">Retar con enlace</button>') +
      '</div>';

    var copyBtn = el.querySelector('#weekly-copy-btn') || el.querySelector('#weekly-copy-compact');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var from = window.prompt('Tu nombre en el reto (opcional):', '') || '';
        var url = LipaDaily.buildMyChallengeUrl(from.trim() || null);
        LipaDaily.copyToClipboard(url).then(function () {
          flashBtn(copyBtn, '¡Enlace copiado!');
        }).catch(function () {
          flashBtn(copyBtn, 'Copia manual: listo');
          window.prompt('Copia este enlace:', url);
        });
      });
    }

    var shareBtn = el.querySelector('#weekly-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var url = LipaDaily.buildMyChallengeUrl();
        var vsBit = myVs != null && d.game !== 'any' ? ' — ' + LipaDaily.formatVsLabel(d, myVs) : '';
        var msg = done
          ? '✅ Completé el reto semanal de LIPA: ' + d.title + vsBit
          : '🏆 ¿Me ganas esta semana? Reto LIPA: ' + d.title + vsBit;
        LipaDaily.shareResult({ text: msg, url: url });
      });
    }
  }

  function init() {
    renderChallengeInvite();
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
