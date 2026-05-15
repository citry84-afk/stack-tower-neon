/**
 * Stack Tower Neon — reto diario (semilla por fecha + ranking local)
 */
(function () {
  'use strict';

  var board = new LipaDaily.DailyBoard('stack-tower');
  var dailyMode = false;
  var seed = LipaDaily.getDailySeed('stack-tower');
  var rng = LipaDaily.mulberry32(seed);

  function getModifiers() {
    var speedMul = 1 + (seed % 6) * 0.08;
    var levelStep = 15 + (seed % 10);
    return {
      speedMul: speedMul,
      levelStep: levelStep,
      label: '#' + (seed % 10000)
    };
  }

  var mods = getModifiers();

  function renderMenuPanel() {
    var panel = document.getElementById('daily-challenge-panel');
    if (!panel) return;
    var best = board.getBest(true);
    var top = board.getTop(3, true);
    var topHtml = top.length
      ? top.map(function (r, i) {
          return '<li>#' + (i + 1) + ' ' + escapeHtml(r.name) + ' — <strong>' + r.score + ' pts</strong></li>';
        }).join('')
      : '<li class="daily-muted">Aún no hay puntuaciones hoy</li>';
    panel.innerHTML =
      '<p class="daily-title">🔥 Reto diario <span class="daily-tag">' + mods.label + '</span></p>' +
      '<p class="daily-desc">Misma dificultad para todos hoy (velocidad +' + Math.round((mods.speedMul - 1) * 100) + '%). Tu mejor: <strong>' +
      (best ? best.score + ' pts' : '—') + '</strong></p>' +
      '<ol class="daily-top">' + topHtml + '</ol>' +
      '<button type="button" class="btn daily-btn" id="btn-daily-play">Jugar reto de hoy</button>';
    var btn = document.getElementById('btn-daily-play');
    if (btn) {
      btn.addEventListener('click', function () {
        setDailyMode(true);
        if (typeof window.startGame === 'function') window.startGame(true);
      });
    }
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function applyBlockSpeed(baseSpeed) {
    return dailyMode ? baseSpeed * mods.speedMul : baseSpeed;
  }

  function onGameOver(score) {
    if (!dailyMode || score <= 0) {
      dailyMode = false;
      return;
    }
    var name = localStorage.getItem('lipa_player_name') || '';
    if (!name) {
      name = prompt('Nombre para el ranking diario (máx. 15):', 'Jugador') || 'Jugador';
      localStorage.setItem('lipa_player_name', name.substring(0, 15));
    }
    board.submit(name, score, { seed: seed });
    board._save();
    LipaDaily.bumpStreak('lipa_stack_daily_streak');
    dailyMode = false;
    renderMenuPanel();
    var dailyMsg = document.getElementById('daily-gameover-msg');
    if (dailyMsg) {
      dailyMsg.hidden = false;
      dailyMsg.textContent = '🏆 Puntuación enviada al reto diario: ' + score + ' pts';
    }
  }

  function isDailyMode() {
    return dailyMode;
  }

  function setDailyMode(on) {
    dailyMode = !!on;
  }

  function getLevelStep() {
    return dailyMode ? mods.levelStep : 20;
  }

  function seededColorIndex() {
    if (!dailyMode) return null;
    return Math.floor(rng() * 6);
  }

  window.StackTowerDaily = {
    renderMenuPanel: renderMenuPanel,
    applyBlockSpeed: applyBlockSpeed,
    onGameOver: onGameOver,
    isDailyMode: isDailyMode,
    setDailyMode: setDailyMode,
    getLevelStep: getLevelStep,
    seededColorIndex: seededColorIndex,
    getModifiers: getModifiers
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMenuPanel);
  } else {
    renderMenuPanel();
  }
})();
