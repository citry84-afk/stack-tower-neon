/**
 * Neon Lenguaje — sílabas, completar palabra, lectura, ordenar frase (30 s)
 * data-lengua-mode en <body>: silabas | completa | lectura | frase
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var mode = 'silabas';
  var activityId = 'neon-silabas';

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

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl, streakEl, streakNEl;

  var round = null;
  var filledSlots = 0;
  var pickedWords = 0;
  var choiceLocked = false;
  var roundIndex = 0;

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
    if (window.LipaBrain) {
      if (LipaBrain.resolveBrainLevel) {
        brainLevel = LipaBrain.resolveBrainLevel({ gameId: activityId, activityId: activityId });
      } else {
        brainLevel = LipaBrain.getActivityLevel(activityId);
      }
    }
    try {
      var params = new URLSearchParams(window.location.search);
      var fromUrl = parseInt(params.get('brainLevel'), 10);
      if (fromUrl >= 1 && fromUrl <= 12) brainLevel = fromUrl;
    } catch (e) { /* ignore */ }
    var bl = document.getElementById('lengua-brain-level');
    if (bl) {
      var courseTxt = '';
      if (window.LipaBrain) {
        var p = LipaBrain.getProfile();
        if (p && p.courseId && window.LipaCurriculum) {
          LipaCurriculum.init();
          var c = LipaCurriculum.getCourse(p.courseId);
          if (c) courseTxt = ' · ' + c.label;
        }
      }
      bl.textContent = 'Nivel Brain ' + brainLevel + courseTxt;
    }
    if (window.LipaGameOnboard && LipaGameOnboard.refreshBanner) {
      LipaGameOnboard.refreshBanner();
    }
  }

  function ensureCourseBeforePlay(thenStart) {
    if (!window.LipaGameOnboard || !LipaGameOnboard.needsCourse()) {
      thenStart();
      return;
    }
    if (window.LipaBrainOnboarding) {
      LipaBrainOnboarding.openGameCourse({
        onComplete: function () {
          refreshBrainLevel();
          thenStart();
        }
      });
    } else {
      window.location.href = '/cursos.html?empezar=1';
    }
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

  function safeFeedback(kind) {
    try {
      if (!window.LipaGameFeedback) return;
      var el = workEl || arenaEl;
      if (kind === 'ok') LipaGameFeedback.onCorrect(el);
      else LipaGameFeedback.onWrong(el);
    } catch (err) { /* no bloquear la siguiente pregunta */ }
  }

  function markCorrect(pts) {
    correct++;
    combo++;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(combo);
    if (combo > maxCombo) maxCombo = combo;
    score += pts + Math.min(combo * 2, 20);
    updateHud();
    safeFeedback('ok');
  }

  function markWrong() {
    wrong++;
    combo = 0;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(0);
    updateHud();
    safeFeedback('bad');
  }

  function nextRound(delay) {
    var wait = delay || 200;
    setTimeout(function () {
      if (!running) return;
      choiceLocked = false;
      try {
        showRound();
      } catch (err) {
        choiceLocked = false;
      }
    }, wait);
  }

  function escAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function lockWorkButtons() {
    choiceLocked = true;
    if (!workEl) return;
    workEl.querySelectorAll('button').forEach(function (btn) {
      btn.disabled = true;
    });
  }

  function showRound() {
    if (!running || !window.LipaLenguaBank) return;
    choiceLocked = false;
    filledSlots = 0;
    pickedWords = 0;
    roundIndex++;
    lastKey = round && round.key ? round.key : lastKey;

    if (mode === 'silabas') {
      round = LipaLenguaBank.buildSyllableRound(brainLevel, lastKey);
      while (round.syllables.length < 2) {
        round = LipaLenguaBank.buildSyllableRound(brainLevel, lastKey);
      }
      lastKey = round.key;
      if (promptEl) {
        promptEl.innerHTML = '<span class="lengua-emoji">' + round.emoji + '</span> Ordena las sílabas';
      }
      var slots = round.syllables.map(function (_, i) {
        return '<span class="lengua-slot" data-slot="' + i + '"></span>';
      }).join('');
      if (workEl) {
        workEl.innerHTML =
          '<div class="lengua-slots">' + slots + '</div>' +
          '<p class="lengua-hint-word">' + round.key + '</p>' +
          '<div class="lengua-chips">' +
          round.shuffled.map(function (s) {
            return '<button type="button" class="lengua-chip" data-syl="' + s + '">' + s + '</button>';
          }).join('') +
          '</div>';
        bindSilabas();
      }
      return;
    }

    if (mode === 'completa') {
      round = LipaLenguaBank.buildFillRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = '¿Qué sílaba falta?';
      if (workEl) {
        workEl.innerHTML =
          '<p class="lengua-big-word">' + round.display + '</p>' +
          '<div class="math-choices lengua-choices">' +
          round.options.map(function (o) {
            return '<button type="button" class="math-choice" data-val="' + escAttr(o) + '">' + o + '</button>';
          }).join('') +
          '</div>';
        bindChoices(function (val) {
          return String(val) === String(round.answer);
        });
      }
      return;
    }

    if (mode === 'lectura') {
      round = LipaLenguaBank.buildReadingRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = 'Lee y responde · Pregunta ' + roundIndex;
      if (workEl) {
        workEl.innerHTML =
          '<p class="lengua-read-text">' + round.text + '</p>' +
          '<p class="lengua-read-q"><strong>' + round.question + '</strong></p>' +
          '<div class="math-choices lengua-choices">' +
          round.choices.map(function (c, i) {
            return '<button type="button" class="math-choice" data-idx="' + i + '">' + c + '</button>';
          }).join('') +
          '</div>';
        bindChoices(function (val) {
          return Number(val) === Number(round.answer);
        }, true);
      }
      return;
    }

    if (mode === 'frase') {
      round = LipaLenguaBank.buildFraseRound(brainLevel, lastKey);
      lastKey = round.key;
      if (promptEl) promptEl.textContent = 'Ordena la frase (toca en orden)';
      var slotHtml = round.words.map(function (_, i) {
        return '<span class="lengua-slot lengua-slot--wide" data-slot="' + i + '"></span>';
      }).join('');
      if (workEl) {
        workEl.innerHTML =
          '<div class="lengua-slots lengua-slots--frase">' + slotHtml + '</div>' +
          '<div class="lengua-chips lengua-chips--frase">' +
          round.shuffled.map(function (w) {
            return '<button type="button" class="lengua-chip lengua-chip--word" data-word="' + w + '">' + w + '</button>';
          }).join('') +
          '</div>';
        bindFrase();
      }
    }
  }

  function bindSilabas() {
    if (!workEl) return;
    workEl.querySelectorAll('.lengua-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || choiceLocked || btn.disabled) return;
        var syl = btn.getAttribute('data-syl');
        var target = round.syllables[filledSlots];
        if (syl !== target) {
          lockWorkButtons();
          markWrong();
          btn.classList.add('lengua-chip--bad');
          workEl.querySelectorAll('.lengua-chip').forEach(function (b) {
            if (b.getAttribute('data-syl') === target) b.classList.add('lengua-chip--ok');
          });
          nextRound(480);
          return;
        }
        var slot = workEl.querySelector('.lengua-slot[data-slot="' + filledSlots + '"]');
        if (slot) {
          slot.textContent = syl;
          slot.classList.add('lengua-slot--filled');
        }
        btn.disabled = true;
        filledSlots++;
        if (filledSlots >= round.syllables.length) {
          lockWorkButtons();
          markCorrect(12);
          nextRound(280);
        }
      });
    });
  }

  function bindFrase() {
    if (!workEl) return;
    workEl.querySelectorAll('.lengua-chip--word').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || choiceLocked || btn.disabled) return;
        var w = btn.getAttribute('data-word');
        var target = round.words[pickedWords];
        if (w !== target) {
          lockWorkButtons();
          markWrong();
          btn.classList.add('lengua-chip--bad');
          workEl.querySelectorAll('.lengua-chip--word').forEach(function (b) {
            if (b.getAttribute('data-word') === target) b.classList.add('lengua-chip--ok');
          });
          nextRound(480);
          return;
        }
        var slot = workEl.querySelector('.lengua-slot[data-slot="' + pickedWords + '"]');
        if (slot) {
          slot.textContent = w;
          slot.classList.add('lengua-slot--filled');
        }
        btn.disabled = true;
        pickedWords++;
        if (pickedWords >= round.words.length) {
          lockWorkButtons();
          markCorrect(14);
          nextRound(300);
        }
      });
    });
  }

  function bindChoices(isCorrectFn, useIdx) {
    if (!workEl) return;
    workEl.querySelectorAll('.math-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || choiceLocked) return;
        var val = useIdx ? btn.getAttribute('data-idx') : btn.getAttribute('data-val');
        var ok = isCorrectFn(val);
        lockWorkButtons();
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
          nextRound(480);
        }
      });
    });
  }

  function renderBoard() {
    var lb = document.getElementById('lengua-leaderboard');
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
    if (arenaEl) arenaEl.classList.remove('lengua-arena--live');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('lengua-final-score');
    var fa = document.getElementById('lengua-final-acc');
    var fc = document.getElementById('lengua-final-combo');
    var total = correct + wrong;
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('lengua-name');
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
    ensureCourseBeforePlay(startGameNow);
  }

  function startGameNow() {
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
    roundIndex = 0;
    running = true;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    if (arenaEl) arenaEl.classList.add('lengua-arena--live');
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
    mode = (body && body.getAttribute('data-lengua-mode')) || 'silabas';
    activityId = (body && body.getAttribute('data-lengua-activity')) || 'neon-silabas';

    timerEl = document.getElementById('lengua-timer');
    scoreEl = document.getElementById('lengua-score');
    accEl = document.getElementById('lengua-accuracy');
    comboEl = document.getElementById('lengua-combo');
    overlay = document.getElementById('lengua-overlay');
    btnStart = document.getElementById('lengua-start');
    arenaEl = document.getElementById('lengua-arena');
    promptEl = document.getElementById('lengua-prompt');
    workEl = document.getElementById('lengua-work');
    streakEl = document.getElementById('lengua-streak');
    streakNEl = document.getElementById('lengua-streak-n');

    refreshBrainLevel();
    renderBoard();

    if (btnStart) btnStart.addEventListener('click', startGame);
    window.addEventListener('lipa-profile-changed', refreshBrainLevel);
    var share = document.getElementById('lengua-share');
    if (share) {
      share.addEventListener('click', function () {
        var t = '¡' + score + ' pts en Neon Lenguaje! · LIPA Brain Gym';
        if (navigator.share) navigator.share({ title: 'Neon Lenguaje', text: t, url: location.href });
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
