/**
 * Neon Sociales — preguntas y ordenar eventos (30 s)
 * data-sociales-mode: elige | mapa | ordena
 */
(function () {
  'use strict';

  var DURATION = 30;
  var mode = 'elige';
  var activityId = 'neon-entorno';
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
  var pickedWords = 0;
  var choiceLocked = false;

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
    var bl = document.getElementById('sociales-brain-level');
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
    if (combo > maxCombo) maxCombo = combo;
    score += pts + Math.min(combo * 2, 20);
    updateHud();
    if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(workEl || arenaEl);
  }

  function markWrong() {
    wrong++;
    combo = 0;
    updateHud();
    if (window.LipaGameFeedback) LipaGameFeedback.onWrong(workEl || arenaEl);
  }

  function nextRound(delay) {
    setTimeout(function () {
      if (running) showRound();
    }, delay || 200);
  }

  function bindChoices(isCorrectFn) {
    if (!workEl) return;
    workEl.querySelectorAll('.math-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || choiceLocked) return;
        choiceLocked = true;
        var val = btn.getAttribute('data-idx');
        var ok = isCorrectFn(val);
        if (ok) {
          markCorrect(10);
          btn.classList.add('math-choice--ok');
          nextRound(220);
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.math-choice').forEach(function (b) {
            if (isCorrectFn(b.getAttribute('data-idx'))) b.classList.add('math-choice--ok');
          });
          nextRound(500);
        }
      });
    });
  }

  function showRound() {
    if (!running || !window.LipaSocialesBank) return;
    choiceLocked = false;
    pickedWords = 0;
    lastKey = round && round.key ? round.key : lastKey;

    if (mode === 'ordena') {
      round = LipaSocialesBank.buildOrdenaRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = 'Ordena las palabras';
      var slotHtml = round.words.map(function (_, i) {
        return '<span class="sociales-slot" data-slot="' + i + '"></span>';
      }).join('');
      if (workEl) {
        workEl.innerHTML =
          '<div class="sociales-slots">' + slotHtml + '</div>' +
          '<div class="sociales-chips">' +
          round.shuffled.map(function (w) {
            return '<button type="button" class="sociales-chip" data-word="' + w + '">' + w + '</button>';
          }).join('') +
          '</div>';
        workEl.querySelectorAll('.sociales-chip').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!running || btn.disabled) return;
            var w = btn.getAttribute('data-word');
            if (w !== round.words[pickedWords]) {
              markWrong();
              btn.classList.add('sociales-chip--bad');
              setTimeout(function () { btn.classList.remove('sociales-chip--bad'); }, 400);
              return;
            }
            var slot = workEl.querySelector('.sociales-slot[data-slot="' + pickedWords + '"]');
            if (slot) {
              slot.textContent = w;
              slot.classList.add('sociales-slot--filled');
            }
            btn.disabled = true;
            pickedWords++;
            if (pickedWords >= round.words.length) {
              markCorrect(14);
              nextRound(300);
            }
          });
        });
      }
      return;
    }

    var poolName = mode === 'mapa' ? 'mapa' : 'quiz';
    round = LipaSocialesBank.buildQuizRound(brainLevel, lastKey, poolName);
    lastKey = round.key;
    if (promptEl) promptEl.textContent = mode === 'mapa' ? 'Mapas y lugares' : 'Lee y responde';
    if (workEl) {
      workEl.innerHTML =
        '<p class="sociales-read-text">' + round.text + '</p>' +
        '<p class="sociales-read-q"><strong>' + round.question + '</strong></p>' +
        '<div class="math-choices sociales-choices">' +
        round.choices.map(function (c, i) {
          return '<button type="button" class="math-choice" data-idx="' + i + '">' + c + '</button>';
        }).join('') +
        '</div>';
      bindChoices(function (val) {
        return parseInt(val, 10) === round.answer;
      });
    }
  }

  function renderBoard() {
    var lb = document.getElementById('sociales-leaderboard');
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
    if (arenaEl) arenaEl.classList.remove('sociales-arena--live');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('sociales-final-score');
    var fa = document.getElementById('sociales-final-acc');
    var fc = document.getElementById('sociales-final-combo');
    var total = correct + wrong;
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('sociales-name');
    var name = (nameInput && nameInput.value.trim()) || 'Jugador';
    getBoard().submit(name.substring(0, 15), score, { correct: correct, wrong: wrong, brainLevel: brainLevel });
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult(activityId, {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1,
        durationSec: DURATION
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
    timeLeft = DURATION;
    lastKey = '';
    running = true;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    if (arenaEl) arenaEl.classList.add('sociales-arena--live');
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
    mode = (body && body.getAttribute('data-sociales-mode')) || 'elige';
    activityId = (body && body.getAttribute('data-sociales-activity')) || 'neon-entorno';

    timerEl = document.getElementById('sociales-timer');
    scoreEl = document.getElementById('sociales-score');
    accEl = document.getElementById('sociales-accuracy');
    comboEl = document.getElementById('sociales-combo');
    overlay = document.getElementById('sociales-overlay');
    btnStart = document.getElementById('sociales-start');
    arenaEl = document.getElementById('sociales-arena');
    promptEl = document.getElementById('sociales-prompt');
    workEl = document.getElementById('sociales-work');
    streakEl = document.getElementById('sociales-streak');
    streakNEl = document.getElementById('sociales-streak-n');

    refreshBrainLevel();
    renderBoard();
    if (btnStart) btnStart.addEventListener('click', startGame);
    var share = document.getElementById('sociales-share');
    if (share) {
      share.addEventListener('click', function () {
        var t = '¡' + score + ' pts en Neon Sociales! · LIPA Brain Gym';
        if (navigator.share) navigator.share({ title: 'Neon Sociales', text: t, url: location.href });
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
