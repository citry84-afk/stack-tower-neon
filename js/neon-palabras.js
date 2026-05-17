/**
 * Neon Palabras — vocabulario ES ↔ EN (30 s)
 */
(function () {
  'use strict';

  var DURATION = 30;
  var board = null;
  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, btnShare, lbEl;
  var promptEl, choicesEl, arenaEl, streakEl, streakNEl, dirEl;
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var correct = 0;
  var wrong = 0;
  var combo = 0;
  var maxCombo = 0;
  var tickTimer = null;
  var lockChoice = false;
  var brainLevel = 1;
  var wordPool = [];
  var mode = 'es-en';
  var lastKey = '';

  function getBoard() {
    if (board) return board;
    if (window.LipaDaily && typeof LipaDaily.DailyBoard === 'function') {
      board = new LipaDaily.DailyBoard('neon-palabras');
    } else {
      board = { submit: function () {}, getTop: function () { return []; } };
    }
    return board;
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

  function refreshBrainLevel() {
    if (window.LipaBrain) {
      brainLevel = LipaBrain.getActivityLevel('neon-palabras');
    }
    if (window.LipaVocabBank) {
      wordPool = LipaVocabBank.getPool(brainLevel);
    }
    var bl = document.getElementById('palabras-brain-level');
    if (bl) {
      var tier = LipaVocabBank ? LipaVocabBank.tierForLevel(brainLevel) + 1 : 1;
      bl.textContent = 'Nivel Brain ' + brainLevel + ' · vocabulario nivel ' + tier;
    }
  }

  function pickMode() {
    var sel = document.getElementById('palabras-mode');
    mode = (sel && sel.value) || 'es-en';
    if (mode === 'mix') {
      mode = Math.random() < 0.5 ? 'es-en' : 'en-es';
    }
  }

  function makeRound() {
    pickMode();
    var ex = {};
    if (lastKey) ex[lastKey] = true;
    var w = LipaVocabBank.pickWord(wordPool, ex);
    lastKey = w.es + '|' + w.en;
    var askEs = mode === 'es-en';
    return {
      prompt: askEs ? w.es : w.en,
      answer: askEs ? w.en : w.es,
      hint: askEs ? '¿Cómo se dice en inglés?' : '¿Cómo se dice en español?',
      word: w
    };
  }

  function makeChoices(answer, word) {
    var opts = [answer];
    var seen = {};
    seen[answer.toLowerCase()] = true;
    var pool = wordPool.slice();
    shuffle(pool);
    var i = 0;
    while (opts.length < 4 && i < pool.length * 2) {
      var cand = pool[i % pool.length];
      i++;
      var wrongText = mode === 'es-en' ? cand.en : cand.es;
      if (wrongText === answer) continue;
      var k = wrongText.toLowerCase();
      if (!seen[k]) {
        seen[k] = true;
        opts.push(wrongText);
      }
    }
    while (opts.length < 4) {
      opts.push(answer + (opts.length % 2 ? 's' : ''));
    }
    return shuffle(opts);
  }

  function init() {
    timerEl = document.getElementById('palabras-timer');
    scoreEl = document.getElementById('palabras-score');
    accEl = document.getElementById('palabras-accuracy');
    comboEl = document.getElementById('palabras-combo');
    overlay = document.getElementById('palabras-overlay');
    btnStart = document.getElementById('palabras-start');
    btnShare = document.getElementById('palabras-share');
    lbEl = document.getElementById('palabras-leaderboard');
    promptEl = document.getElementById('palabras-prompt');
    dirEl = document.getElementById('palabras-direction');
    choicesEl = document.getElementById('palabras-choices');
    arenaEl = document.getElementById('palabras-arena');
    streakEl = document.getElementById('palabras-streak');
    streakNEl = document.getElementById('palabras-streak-n');

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
    if (!running || !promptEl || !choicesEl) return;
    lockChoice = false;
    var q = makeRound();
    if (dirEl) dirEl.textContent = q.hint;
    promptEl.textContent = q.prompt;
    promptEl.classList.remove('math-question--pop');
    void promptEl.offsetWidth;
    promptEl.classList.add('math-question--pop');
    promptEl.setAttribute('data-answer', q.answer);
    var opts = makeChoices(q.answer, q.word);
    choicesEl.innerHTML = opts.map(function (n) {
      return '<button type="button" class="math-choice" data-val="' + esc(n) + '">' + esc(n) + '</button>';
    }).join('');
    choicesEl.querySelectorAll('.math-choice').forEach(function (btn) {
      btn.addEventListener('click', onChoice);
    });
  }

  function onChoice(e) {
    if (!running || lockChoice) return;
    var btn = e.currentTarget;
    var val = btn.getAttribute('data-val');
    var ans = promptEl.getAttribute('data-answer');
    lockChoice = true;
    if (val === ans) {
      correct++;
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      score += 10 + Math.min(combo * 3, 24);
      btn.classList.add('math-choice--ok');
      try { if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(arenaEl || choicesEl); } catch (fbErr) { /* ignore */ }
    } else {
      wrong++;
      combo = 0;
      btn.classList.add('math-choice--bad');
      choicesEl.querySelectorAll('.math-choice').forEach(function (b) {
        if (b.getAttribute('data-val') === ans) b.classList.add('math-choice--ok');
      });
      try { if (window.LipaGameFeedback) LipaGameFeedback.onWrong(arenaEl || choicesEl); } catch (fbErr) { /* ignore */ }
    }
    updateHud();
    setTimeout(function () {
      if (running) showRound();
    }, val === ans ? 200 : 450);
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
    var fs = document.getElementById('palabras-final-score');
    var fa = document.getElementById('palabras-final-acc');
    var fc = document.getElementById('palabras-final-combo');
    if (fs) fs.textContent = score;
    var total = correct + wrong;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('palabras-name');
    var name = (nameInput && nameInput.value.trim()) || 'Jugador';
    getBoard().submit(name.substring(0, 15), score, { correct: correct, wrong: wrong, brainLevel: brainLevel });
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('neon-palabras', {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1,
        durationSec: DURATION
      });
    } else if (window.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession('neon-palabras', { score: score });
    }
    refreshBrainLevel();
    renderBoard();
  }

  function startGame() {
    if (running) return;
    if (window.LipaAnalytics && LipaAnalytics.trackGameStart) {
      LipaAnalytics.trackGameStart('neon-palabras');
    }
    refreshBrainLevel();
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
      text: '🗣️ ' + score + ' pts en Neon Palabras (LIPA Brain Gym). ¿Me superas?',
      url: 'https://lipastudios.com/neon-palabras.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
