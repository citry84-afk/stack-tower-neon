/**
 * Neon Cálculo — cálculo mental relámpago (30 s)
 */
(function () {
  'use strict';

  var DURATION = 30;
  var board = null;
  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, btnShare, lbEl;
  var questionEl, choicesEl, levelBtns, arenaEl, streakEl, streakNEl;
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var correct = 0;
  var wrong = 0;
  var combo = 0;
  var maxCombo = 0;
  var tickTimer = null;
  var level = 'facil';
  var brainLevel = 1;
  var calcConfig = { max: 12, mul: false };
  var lockChoice = false;

  function refreshBrainLevel() {
    if (window.LipaBrain) {
      brainLevel = LipaBrain.getActivityLevel('neon-calculo');
      calcConfig = LipaBrain.getCalcConfig(brainLevel);
    }
  }

  function getBoard() {
    if (board) return board;
    if (window.LipaDaily && typeof LipaDaily.DailyBoard === 'function') {
      board = new LipaDaily.DailyBoard('neon-calculo');
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
    refreshBrainLevel();
    var cfg = calcConfig;
    if (level === 'duro' && Math.random() < 0.35) {
      var a = randInt(3, 12);
      var b = randInt(2, 9);
      return { text: a + ' × ' + b, answer: a * b };
    }
    if (cfg.mul && Math.random() < 0.3) {
      var ma = randInt(2, cfg.mulMax || 9);
      var mb = randInt(2, cfg.mulMax || 9);
      return { text: ma + ' × ' + mb, answer: ma * mb };
    }
    var max = level === 'facil' ? (cfg.max || 12) : level === 'medio' ? Math.max(cfg.max, 25) : Math.max(cfg.max, 60);
    var op = Math.random() < 0.55 ? '+' : '-';
    var x = randInt(1, max);
    var y = randInt(1, max);
    if (op === '-' && y > x) {
      var t = x;
      x = y;
      y = t;
    }
    return {
      text: x + ' ' + op + ' ' + y,
      answer: op === '+' ? x + y : x - y
    };
  }

  function makeChoices(answer) {
    var opts = [answer];
    var seen = {};
    seen[answer] = true;
    while (opts.length < 4) {
      var delta = randInt(-15, 15);
      if (delta === 0) delta = randInt(1, 9);
      var w = answer + delta;
      if (w < 0) w = answer + randInt(1, 12);
      if (!seen[w]) {
        seen[w] = true;
        opts.push(w);
      }
    }
    return shuffle(opts);
  }

  function init() {
    timerEl = document.getElementById('calc-timer');
    scoreEl = document.getElementById('calc-score');
    accEl = document.getElementById('calc-accuracy');
    comboEl = document.getElementById('calc-combo');
    overlay = document.getElementById('calc-overlay');
    btnStart = document.getElementById('calc-start');
    btnShare = document.getElementById('calc-share');
    lbEl = document.getElementById('calc-leaderboard');
    questionEl = document.getElementById('calc-question');
    choicesEl = document.getElementById('calc-choices');
    arenaEl = document.getElementById('calc-arena');
    streakEl = document.getElementById('calc-streak');
    streakNEl = document.getElementById('calc-streak-n');
    levelBtns = document.querySelectorAll('[data-calc-level]');

    if (btnStart) btnStart.addEventListener('click', startGame);
    if (btnShare) btnShare.addEventListener('click', share);

    levelBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (running) return;
        level = btn.getAttribute('data-calc-level') || 'facil';
        levelBtns.forEach(function (b) {
          b.classList.toggle('calc-level--active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
      });
    });

    var saved = localStorage.getItem('lipa_calc_level');
    if (saved) {
      level = saved;
      levelBtns.forEach(function (b) {
        var on = b.getAttribute('data-calc-level') === level;
        b.classList.toggle('calc-level--active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    refreshBrainLevel();
    var bl = document.getElementById('calc-brain-level');
    if (bl) bl.textContent = 'Nivel Brain ' + brainLevel;

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
      if (typeof window !== 'undefined') window.__lipaCombo = combo;
      if (combo > maxCombo) maxCombo = combo;
      var pts = 10 + Math.min(combo * 3, 24);
      if (level === 'medio') pts += 2;
      if (level === 'duro') pts += 5;
      score += pts;
      btn.classList.add('math-choice--ok');
      try { if (window.LipaGameFeedback && arenaEl) LipaGameFeedback.onCorrect(arenaEl); } catch (fbErr) { /* ignore */ }
    } else {
      wrong++;
      combo = 0;
      if (typeof window !== 'undefined') window.__lipaCombo = 0;
      btn.classList.add('math-choice--bad');
      try { if (window.LipaGameFeedback && arenaEl) LipaGameFeedback.onWrong(arenaEl); } catch (fbErr) { /* ignore */ }
      choicesEl.querySelectorAll('.math-choice').forEach(function (b) {
        if (parseInt(b.getAttribute('data-val'), 10) === ans) b.classList.add('math-choice--ok');
      });
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
    try {
      localStorage.setItem('lipa_calc_level', level);
    } catch (e) { /* ignore */ }
    if (arenaEl) arenaEl.classList.remove('math-arena--live');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('calc-final-score');
    var fa = document.getElementById('calc-final-acc');
    var fc = document.getElementById('calc-final-combo');
    if (fs) fs.textContent = score;
    var total = correct + wrong;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('calc-name');
    var name = (nameInput && nameInput.value.trim()) || 'Jugador';
    getBoard().submit(name.substring(0, 15), score, { correct: correct, wrong: wrong, level: level, brainLevel: brainLevel });
    var total = correct + wrong;
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('neon-calculo', {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1,
        durationSec: DURATION,
        sessionComplete: true
      });
    } else if (window.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession('neon-calculo', { score: score });
    }
    refreshBrainLevel();
    var bl = document.getElementById('calc-brain-level');
    if (bl) bl.textContent = 'Nivel Brain ' + brainLevel;
    renderBoard();
  }

  function startGame() {
    if (running) return;
    if (window.LipaAnalytics && LipaAnalytics.trackGameStart) {
      LipaAnalytics.trackGameStart('neon-calculo');
    }
    score = 0;
    correct = 0;
    wrong = 0;
    combo = 0;
    maxCombo = 0;
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
      text: '🧠 ' + score + ' pts en Neon Cálculo (LIPA Brain Gym). ¿Me superas?',
      url: 'https://lipastudios.com/neon-calculo.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
