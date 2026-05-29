/**
 * Neon Peques — juegos visuales Infantil (30 s)
 * data-peques-mode: elige | color | cuenta
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var mode = 'elige';
  var activityId = 'neon-peques';
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var correct = 0;
  var wrong = 0;
  var combo = 0;
  var maxCombo = 0;
  var tickTimer = null;
  var brainLevel = 1;
  var lastKey = '';
  var board = null;
  var round = null;

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl, streakEl, streakNEl;

  function getBoard() {
    if (board) return board;
    if (window.LipaDaily && typeof LipaDaily.DailyBoard === 'function') {
      board = new LipaDaily.DailyBoard(activityId);
    } else {
      board = { submit: function () {}, getTop: function () { return []; } };
    }
    return board;
  }

  function refreshBrainLevel() {
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    try {
      var params = new URLSearchParams(window.location.search);
      var fromUrl = parseInt(params.get('brainLevel'), 10);
      if (fromUrl >= 1 && fromUrl <= 12) brainLevel = fromUrl;
    } catch (e) { /* ignore */ }
    var bl = document.getElementById('peques-brain-level');
    if (bl) bl.textContent = 'Nivel Brain ' + brainLevel;
  }

  function updateHud() {
    if (timerEl) timerEl.textContent = timeLeft + ' s';
    if (scoreEl) scoreEl.textContent = score;
    var total = correct + wrong;
    if (accEl) accEl.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (comboEl) comboEl.textContent = combo;
    if (streakEl && streakNEl) {
      if (combo >= 2) {
        streakEl.hidden = false;
        streakNEl.textContent = combo;
      } else {
        streakEl.hidden = true;
      }
    }
  }

  function markCorrect(pts) {
    correct++;
    combo++;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(combo);
    if (combo > maxCombo) maxCombo = combo;
    score += pts + Math.min(combo * 2, 16);
    updateHud();
    try { if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(workEl || arenaEl); } catch (fbErr) { /* ignore */ }
  }

  function markWrong() {
    wrong++;
    combo = 0;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(0);
    updateHud();
    try { if (window.LipaGameFeedback) LipaGameFeedback.onWrong(workEl || arenaEl); } catch (fbErr) { /* ignore */ }
  }

  function nextRound(delay) {
    setTimeout(function () {
      if (running) showRound();
    }, delay || 220);
  }

  function bindIdxChoices() {
    if (!workEl) return;
    workEl.querySelectorAll('.peques-choice, .math-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running) return;
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx === round.answer) {
          markCorrect(12);
          btn.classList.add('peques-choice--ok');
          nextRound(250);
        } else {
          markWrong();
          btn.classList.add('peques-choice--bad');
          workEl.querySelectorAll('[data-idx]').forEach(function (b) {
            if (parseInt(b.getAttribute('data-idx'), 10) === round.answer) {
              b.classList.add('peques-choice--ok');
            }
          });
          nextRound(500);
        }
      });
    });
  }

  function showRound() {
    if (!running || !window.LipaPequesBank) return;
    lastKey = round && round.key ? round.key : lastKey;

    if (mode === 'color') {
      round = LipaPequesBank.buildColorRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) {
        promptEl.innerHTML = '<span class="peques-hero">' + round.emoji + '</span>' + round.question;
      }
      if (workEl) {
        workEl.innerHTML =
          '<div class="peques-choices peques-choices--big">' +
          round.labels.map(function (label, i) {
            return '<button type="button" class="peques-choice" data-idx="' + i + '">' + label + '</button>';
          }).join('') +
          '</div>';
        bindIdxChoices();
      }
      return;
    }

    if (mode === 'cuenta') {
      round = LipaPequesBank.buildCuentaRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = round.question;
      if (workEl) {
        workEl.innerHTML =
          '<p class="peques-count-icons" aria-hidden="true">' + round.icons + '</p>' +
          '<div class="peques-choices peques-choices--nums">' +
          round.choices.map(function (n, i) {
            return '<button type="button" class="peques-choice peques-choice--num" data-idx="' + i + '">' + n + '</button>';
          }).join('') +
          '</div>';
        bindIdxChoices();
      }
      return;
    }

    round = LipaPequesBank.buildEligeRound(brainLevel, lastKey);
    lastKey = round.key;
    if (promptEl) {
      promptEl.innerHTML = '<span class="peques-hero">' + round.emoji + '</span>' + round.question;
    }
    if (workEl) {
      workEl.innerHTML =
        '<div class="peques-choices">' +
        round.choices.map(function (c, i) {
          return '<button type="button" class="peques-choice" data-idx="' + i + '">' + c + '</button>';
        }).join('') +
        '</div>';
      bindIdxChoices();
    }
  }

  function renderBoard() {
    var lb = document.getElementById('peques-leaderboard');
    if (!lb) return;
    var top = getBoard().getTop(5);
    if (!top.length) {
      lb.innerHTML = '<p style="color:var(--lipa-text-secondary);font-size:14px;">Sé el primero hoy.</p>';
      return;
    }
    lb.innerHTML = '<ol class="lb-list">' + top.map(function (e, i) {
      return '<li><span>' + (i + 1) + '</span> ' + e.name + ' <strong>' + e.score + '</strong></li>';
    }).join('') + '</ol>';
  }

  function endGame() {
    running = false;
    clearInterval(tickTimer);
    tickTimer = null;
    if (arenaEl) arenaEl.classList.remove('peques-arena--live');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('peques-final-score');
    var fa = document.getElementById('peques-final-acc');
    var fc = document.getElementById('peques-final-combo');
    var total = correct + wrong;
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('peques-name');
    var name = (nameInput && nameInput.value.trim()) || 'Peque';
    getBoard().submit(name.substring(0, 15), score, { correct: correct, wrong: wrong, brainLevel: brainLevel });
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult(activityId, {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1,
        durationSec: DURATION,
        sessionComplete: true
      });
    }
    refreshBrainLevel();
    renderBoard();
  }

  function startGame() {
    if (running) return;
    if (window.LipaAnalytics && LipaAnalytics.trackGameStart) {
      LipaAnalytics.trackGameStart(activityId);
    }
    score = 0;
    correct = 0;
    wrong = 0;
    combo = 0;
    maxCombo = 0;
    if (window.LipaBrainPlay && LipaBrainPlay.syncRoundDuration) {
      DURATION = LipaBrainPlay.syncRoundDuration();
    }
    timeLeft = DURATION;
    lastKey = '';
    running = true;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    if (arenaEl) arenaEl.classList.add('peques-arena--live');
    updateHud();
    showRound();
    tickTimer = setInterval(function () {
      timeLeft--;
      updateHud();
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function init() {
    var body = document.body;
    mode = (body && body.getAttribute('data-peques-mode')) || 'elige';
    activityId = (body && body.getAttribute('data-peques-activity')) || 'neon-peques';

    timerEl = document.getElementById('peques-timer');
    scoreEl = document.getElementById('peques-score');
    accEl = document.getElementById('peques-accuracy');
    comboEl = document.getElementById('peques-combo');
    overlay = document.getElementById('peques-overlay');
    btnStart = document.getElementById('peques-start');
    arenaEl = document.getElementById('peques-arena');
    promptEl = document.getElementById('peques-prompt');
    workEl = document.getElementById('peques-work');
    streakEl = document.getElementById('peques-streak');
    streakNEl = document.getElementById('peques-streak-n');

    refreshBrainLevel();
    renderBoard();
    if (btnStart) btnStart.addEventListener('click', startGame);
    var share = document.getElementById('peques-share');
    if (share) {
      share.addEventListener('click', function () {
        var t = '¡' + score + ' pts en Neon Peques! · LIPA Brain Gym';
        if (navigator.share) navigator.share({ title: 'Neon Peques', text: t, url: location.href });
        else navigator.clipboard.writeText(t + ' ' + location.href);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
