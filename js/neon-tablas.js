/**
 * Tablas Relámpago — tablas de multiplicar (30 s)
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var board = null;
  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, btnShare, lbEl;
  var questionEl, choicesEl, arenaEl, streakEl, streakNEl;
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var correct = 0;
  var wrong = 0;
  var combo = 0;
  var maxCombo = 0;
  var tickTimer = null;
  var lockChoice = false;
  var tableMin = 2;
  var tableMax = 12;
  var brainLevel = 1;

  function refreshBrainLevel() {
    if (window.LipaBrain && LipaBrain.resolveBrainLevel) {
      brainLevel = LipaBrain.resolveBrainLevel({ gameId: 'tablas-relampago' });
    } else if (window.LipaBrain) {
      brainLevel = LipaBrain.getActivityLevel('tablas-relampago');
    }
    if (window.LipaBrain) {
      var range = LipaBrain.getTablasRange(brainLevel);
      tableMin = range.min;
      tableMax = range.max;
      var rangeSel = document.getElementById('tablas-range');
      if (rangeSel && !rangeSel.dataset.manual) {
        rangeSel.value = tableMin + '-' + tableMax;
      }
    }
    var bl = document.getElementById('tablas-brain-level');
    if (bl) bl.textContent = 'Nivel Brain ' + brainLevel + ' · tablas ' + tableMin + '–' + tableMax;
  }

  function getBoard() {
    if (board) return board;
    if (window.LipaDaily && typeof LipaDaily.DailyBoard === 'function') {
      board = new LipaDaily.DailyBoard('tablas-relampago');
    } else {
      board = { submit: function () {}, getTop: function () { return []; } };
    }
    return board;
  }

  function randInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function makeQuestion() {
    var a = randInt(tableMin, tableMax);
    var b = randInt(2, 12);
    return { text: a + ' × ' + b, answer: a * b };
  }

  function makeChoices(answer) {
    var opts = [answer];
    var seen = {};
    seen[answer] = true;
    while (opts.length < 4) {
      var w = answer + randInt(-20, 20);
      if (w <= 0 || seen[w]) {
        w = randInt(4, 144);
      }
      if (!seen[w]) {
        seen[w] = true;
        opts.push(w);
      }
    }
    return shuffle(opts);
  }

  function init() {
    timerEl = document.getElementById('tablas-timer');
    scoreEl = document.getElementById('tablas-score');
    accEl = document.getElementById('tablas-accuracy');
    comboEl = document.getElementById('tablas-combo');
    overlay = document.getElementById('tablas-overlay');
    btnStart = document.getElementById('tablas-start');
    btnShare = document.getElementById('tablas-share');
    lbEl = document.getElementById('tablas-leaderboard');
    questionEl = document.getElementById('tablas-question');
    choicesEl = document.getElementById('tablas-choices');
    arenaEl = document.getElementById('tablas-arena');
    streakEl = document.getElementById('tablas-streak');
    streakNEl = document.getElementById('tablas-streak-n');

    var rangeSel = document.getElementById('tablas-range');
    if (rangeSel) {
      rangeSel.addEventListener('change', function () {
        if (running) return;
        rangeSel.dataset.manual = '1';
        var v = rangeSel.value;
        if (v === '2-6') {
          tableMin = 2;
          tableMax = 6;
        } else if (v === '7-9') {
          tableMin = 7;
          tableMax = 9;
        } else {
          tableMin = 2;
          tableMax = 12;
        }
      });
    }

    if (btnStart) btnStart.addEventListener('click', startGame);
    if (btnShare) btnShare.addEventListener('click', share);
    refreshBrainLevel();
    getBoard();
    renderBoard();
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderBoard() {
    if (!lbEl) return;
    var top = getBoard().getTop(5, true);
    lbEl.innerHTML = top.length
      ? top.map(function (r, i) {
          return '<div class="lb-row"><span>#' + (i + 1) + ' ' + esc(r.name) + '</span><strong>' + r.score + ' pts</strong></div>';
        }).join('')
      : '<p class="muted">Sé el primero en el ranking de hoy.</p>';
  }

  function updateHud() {
    if (timerEl) timerEl.textContent = Math.ceil(timeLeft) + ' s';
    if (scoreEl) scoreEl.textContent = score;
    if (comboEl) comboEl.textContent = combo;
    if (streakEl && streakNEl) {
      if (combo >= 2) {
        streakEl.hidden = false;
        streakNEl.textContent = combo;
      } else {
        streakEl.hidden = true;
      }
    }
    var total = correct + wrong;
    if (accEl) accEl.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
  }

  function showRound() {
    if (!running || !questionEl || !choicesEl) return;
    lockChoice = false;
    var q = makeQuestion();
    questionEl.textContent = q.text + ' = ?';
    questionEl.classList.remove('math-question--pop');
    void questionEl.offsetWidth;
    questionEl.classList.add('math-question--pop');
    questionEl.setAttribute('data-answer', String(q.answer));
    var opts = makeChoices(q.answer);
    choicesEl.innerHTML = opts.map(function (n) {
      return '<button type="button" class="math-choice" data-val="' + n + '">' + n + '</button>';
    }).join('');
    choicesEl.querySelectorAll('.math-choice').forEach(function (btn) {
      btn.addEventListener('click', onChoice);
    });
  }

  function onChoice(e) {
    if (!running || lockChoice) return;
    var btn = e.currentTarget;
    var val = parseInt(btn.getAttribute('data-val'), 10);
    var ans = parseInt(questionEl.getAttribute('data-answer'), 10);
    lockChoice = true;
    if (val === ans) {
      correct++;
      combo++;
      if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(combo);
      if (combo > maxCombo) maxCombo = combo;
      score += 10 + Math.min(combo * 3, 21);
      btn.classList.add('math-choice--ok');
      try { if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(arenaEl || choicesEl); } catch (fbErr) { /* ignore */ }
    } else {
      wrong++;
      combo = 0;
      if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(0);
      btn.classList.add('math-choice--bad');
      choicesEl.querySelectorAll('.math-choice').forEach(function (b) {
        if (parseInt(b.getAttribute('data-val'), 10) === ans) b.classList.add('math-choice--ok');
      });
      try { if (window.LipaGameFeedback) LipaGameFeedback.onWrong(arenaEl || choicesEl); } catch (fbErr) { /* ignore */ }
    }
    updateHud();
    setTimeout(function () {
      if (running) showRound();
    }, val === ans ? 180 : 420);
  }

  function endGame() {
    running = false;
    clearInterval(tickTimer);
    tickTimer = null;
    if (arenaEl) arenaEl.classList.remove('math-arena--live');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('tablas-final-score');
    var fa = document.getElementById('tablas-final-acc');
    var fc = document.getElementById('tablas-final-combo');
    if (fs) fs.textContent = score;
    var total = correct + wrong;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('tablas-name');
    var name = (nameInput && nameInput.value.trim()) || 'Jugador';
    getBoard().submit(name.substring(0, 15), score, { correct: correct, wrong: wrong, brainLevel: brainLevel });
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('tablas-relampago', {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1,
        durationSec: DURATION,
        sessionComplete: true
      });
    } else if (window.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession('tablas-relampago', { score: score });
    }
    refreshBrainLevel();
    renderBoard();
  }

  function startGame() {
    if (running) return;
    if (window.LipaAnalytics && LipaAnalytics.trackGameStart) {
      LipaAnalytics.trackGameStart('tablas-relampago');
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
    running = true;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    if (arenaEl) arenaEl.classList.add('math-arena--live');
    updateHud();
    showRound();
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = setInterval(function () {
      timeLeft -= 0.1;
      updateHud();
      if (timeLeft <= 0) endGame();
    }, 100);
  }

  function share() {
    if (!window.LipaDaily || !LipaDaily.shareResult) return;
    LipaDaily.shareResult({
      text: '✖️ ' + score + ' pts en Tablas Relámpago. ¿Me superas?',
      url: 'https://lipastudios.com/tablas-relampago.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
