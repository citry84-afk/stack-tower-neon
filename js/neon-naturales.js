/**
 * Neon Naturales — clasificar, ciencia y verdadero/falso (30 s)
 * data-naturales-mode: clasifica | ciencia | verdad
 */
(function () {
  'use strict';

  var DURATION = 30;
  var mode = 'clasifica';
  var activityId = 'neon-vida';
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
    var bl = document.getElementById('naturales-brain-level');
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
    score += pts + Math.min(combo * 2, 20);
    updateHud();
    if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(workEl || arenaEl);
  }

  function markWrong() {
    wrong++;
    combo = 0;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(0);
    updateHud();
    if (window.LipaGameFeedback) LipaGameFeedback.onWrong(workEl || arenaEl);
  }

  function nextRound(delay) {
    setTimeout(function () {
      if (running) showRound();
    }, delay || 200);
  }

  function bindChoices(isCorrectFn, useIdx) {
    if (!workEl) return;
    workEl.querySelectorAll('.math-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || choiceLocked) return;
        choiceLocked = true;
        var val = useIdx ? btn.getAttribute('data-idx') : btn.getAttribute('data-val');
        var ok = isCorrectFn(val);
        if (ok) {
          markCorrect(10);
          btn.classList.add('math-choice--ok');
          nextRound(220);
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.math-choice').forEach(function (b) {
            var v = useIdx ? b.getAttribute('data-idx') : b.getAttribute('data-val');
            if (isCorrectFn(v)) b.classList.add('math-choice--ok');
          });
          nextRound(500);
        }
      });
    });
  }

  function showRound() {
    if (!running || !window.LipaNaturalesBank) return;
    choiceLocked = false;
    lastKey = round && round.key ? round.key : lastKey;

    if (mode === 'clasifica') {
      round = LipaNaturalesBank.buildClassifyRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) {
        promptEl.innerHTML = '<span class="naturales-emoji">' + round.emoji + '</span> ¿Qué es?';
      }
      if (workEl) {
        workEl.innerHTML =
          '<p class="naturales-name">' + round.name + '</p>' +
          '<div class="naturales-choices">' +
          round.labels.map(function (label, i) {
            return '<button type="button" class="naturales-choice" data-idx="' + i + '">' + label + '</button>';
          }).join('') +
          '</div>';
        workEl.querySelectorAll('.naturales-choice').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!running) return;
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (idx === round.answer) {
              markCorrect(12);
              btn.classList.add('naturales-choice--ok');
              nextRound(250);
            } else {
              markWrong();
              btn.classList.add('naturales-choice--bad');
              workEl.querySelectorAll('.naturales-choice').forEach(function (b) {
                if (parseInt(b.getAttribute('data-idx'), 10) === round.answer) {
                  b.classList.add('naturales-choice--ok');
                }
              });
              nextRound(500);
            }
          });
        });
      }
      return;
    }

    if (mode === 'ciencia') {
      round = LipaNaturalesBank.buildQuizRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = 'Lee y responde';
      if (workEl) {
        workEl.innerHTML =
          '<p class="naturales-read-text">' + round.text + '</p>' +
          '<p class="naturales-read-q"><strong>' + round.question + '</strong></p>' +
          '<div class="math-choices naturales-choices">' +
          round.choices.map(function (c, i) {
            return '<button type="button" class="math-choice" data-idx="' + i + '">' + c + '</button>';
          }).join('') +
          '</div>';
        bindChoices(function (val) {
          return parseInt(val, 10) === round.answer;
        }, true);
      }
      return;
    }

    if (mode === 'verdad') {
      round = LipaNaturalesBank.buildVerdadRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = '¿Verdadero o falso?';
      if (workEl) {
        workEl.innerHTML =
          '<p class="naturales-statement">' + round.statement + '</p>' +
          '<div class="naturales-choices naturales-choices--vf">' +
          '<button type="button" class="naturales-choice" data-vf="1">✅ Verdadero</button>' +
          '<button type="button" class="naturales-choice" data-vf="0">❌ Falso</button>' +
          '</div>';
        workEl.querySelectorAll('.naturales-choice').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!running) return;
            var pick = btn.getAttribute('data-vf') === '1';
            if (pick === round.answer) {
              markCorrect(12);
              btn.classList.add('naturales-choice--ok');
              nextRound(250);
            } else {
              markWrong();
              btn.classList.add('naturales-choice--bad');
              nextRound(500);
            }
          });
        });
      }
    }
  }

  function renderBoard() {
    var lb = document.getElementById('naturales-leaderboard');
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
    if (arenaEl) arenaEl.classList.remove('naturales-arena--live');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('naturales-final-score');
    var fa = document.getElementById('naturales-final-acc');
    var fc = document.getElementById('naturales-final-combo');
    var total = correct + wrong;
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('naturales-name');
    var name = (nameInput && nameInput.value.trim()) || 'Jugador';
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
    timeLeft = DURATION;
    lastKey = '';
    running = true;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    if (arenaEl) arenaEl.classList.add('naturales-arena--live');
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
    mode = (body && body.getAttribute('data-naturales-mode')) || 'clasifica';
    activityId = (body && body.getAttribute('data-naturales-activity')) || 'neon-vida';

    timerEl = document.getElementById('naturales-timer');
    scoreEl = document.getElementById('naturales-score');
    accEl = document.getElementById('naturales-accuracy');
    comboEl = document.getElementById('naturales-combo');
    overlay = document.getElementById('naturales-overlay');
    btnStart = document.getElementById('naturales-start');
    arenaEl = document.getElementById('naturales-arena');
    promptEl = document.getElementById('naturales-prompt');
    workEl = document.getElementById('naturales-work');
    streakEl = document.getElementById('naturales-streak');
    streakNEl = document.getElementById('naturales-streak-n');

    refreshBrainLevel();
    renderBoard();
    if (btnStart) btnStart.addEventListener('click', startGame);
    var share = document.getElementById('naturales-share');
    if (share) {
      share.addEventListener('click', function () {
        var t = '¡' + score + ' pts en Neon Naturales! · LIPA Brain Gym';
        if (navigator.share) navigator.share({ title: 'Neon Naturales', text: t, url: location.href });
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
