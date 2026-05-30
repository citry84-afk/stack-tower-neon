/**
 * Neon Dictado — escucha y elige la palabra (20–30 s)
 * data-dictado-mode: infantil | primaria | ingles
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var mode = 'primaria';
  var activityId = 'neon-dictado';
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var correct = 0;
  var wrong = 0;
  var combo = 0;
  var maxCombo = 0;
  var tickTimer = null;
  var brainLevel = 1;
  var round = null;
  var spoke = false;

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl;

  var POOLS = {
    infantil: [
      { text: 'sol', display: 'SOL', emoji: '☀️' },
      { text: 'luna', display: 'LUNA', emoji: '🌙' },
      { text: 'gato', display: 'GATO', emoji: '🐱' },
      { text: 'casa', display: 'CASA', emoji: '🏠' },
      { text: 'flor', display: 'FLOR', emoji: '🌸' },
      { text: 'mesa', display: 'MESA', emoji: '🪑' },
      { text: 'pan', display: 'PAN', emoji: '🍞' },
      { text: 'rio', display: 'RÍO', emoji: '🌊' }
    ],
    primaria: [
      { text: 'perro', display: 'PERRO', emoji: '🐶' },
      { text: 'libro', display: 'LIBRO', emoji: '📚' },
      { text: 'árbol', display: 'ÁRBOL', emoji: '🌳' },
      { text: 'nube', display: 'NUBE', emoji: '☁️' },
      { text: 'pluma', display: 'PLUMA', emoji: '✏️' },
      { text: 'verde', display: 'VERDE', emoji: '🟢' },
      { text: 'campo', display: 'CAMPO', emoji: '🌾' },
      { text: 'piano', display: 'PIANO', emoji: '🎹' },
      { text: 'mariposa', display: 'MARIPOSA', emoji: '🦋' },
      { text: 'colegio', display: 'COLEGIO', emoji: '🏫' }
    ],
    ingles: [
      { text: 'cat', display: 'CAT', emoji: '🐱', lang: 'en-GB' },
      { text: 'dog', display: 'DOG', emoji: '🐶', lang: 'en-GB' },
      { text: 'red', display: 'RED', emoji: '🔴', lang: 'en-GB' },
      { text: 'blue', display: 'BLUE', emoji: '🔵', lang: 'en-GB' },
      { text: 'hello', display: 'HELLO', emoji: '👋', lang: 'en-GB' },
      { text: 'book', display: 'BOOK', emoji: '📘', lang: 'en-GB' }
    ]
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pool() {
    return POOLS[mode] || POOLS.primaria;
  }

  function speakWord(item) {
    if (!window.speechSynthesis || !item) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(item.text);
      u.lang = item.lang || 'es-ES';
      u.rate = mode === 'infantil' ? 0.75 : 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  function buildRound() {
    var items = pool().slice();
    var answer = pick(items);
    var opts = [answer];
    while (opts.length < 4 && items.length > 1) {
      var c = pick(items);
      if (opts.indexOf(c) < 0) opts.push(c);
    }
    while (opts.length < 4) {
      opts.push(answer);
    }
    opts.sort(function () { return Math.random() - 0.5; });
    return { answer: answer, options: opts };
  }

  function markCorrect(pts) {
    correct++;
    combo++;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(combo);
    if (combo > maxCombo) maxCombo = combo;
    score += pts + Math.min(combo * 2, 18);
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

  function updateHud() {
    if (timerEl) timerEl.textContent = timeLeft + ' s';
    if (scoreEl) scoreEl.textContent = score;
    var total = correct + wrong;
    if (accEl) accEl.textContent = total ? Math.round((correct / total) * 100) + '%' : '100%';
    if (comboEl) comboEl.textContent = combo;
  }

  function showRound() {
    round = buildRound();
    spoke = false;
    if (promptEl) {
      promptEl.textContent = mode === 'ingles' ? 'Listen and choose' : 'Escucha y elige la palabra';
    }
    if (!workEl) return;
    var hero = round.answer.emoji
      ? '<span class="dictado-hero" aria-hidden="true">' + round.answer.emoji + '</span>'
      : '';
    workEl.innerHTML =
      hero +
      '<button type="button" class="btn btn--ghost dictado-play" id="dictado-replay">🔊 Escuchar</button>' +
      '<div class="dictado-choices">' +
      round.options.map(function (opt) {
        return '<button type="button" class="math-choice dictado-choice" data-word="' + opt.display + '">' + opt.display + '</button>';
      }).join('') +
      '</div>';
    var replay = document.getElementById('dictado-replay');
    if (replay) {
      replay.addEventListener('click', function () {
        speakWord(round.answer);
        spoke = true;
      });
    }
    speakWord(round.answer);
    spoke = true;
    workEl.querySelectorAll('.dictado-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running) return;
        var word = btn.getAttribute('data-word');
        if (word === round.answer.display) {
          markCorrect(14);
          btn.classList.add('math-choice--ok');
          setTimeout(function () { if (running) showRound(); }, 300);
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.dictado-choice').forEach(function (b) {
            if (b.getAttribute('data-word') === round.answer.display) b.classList.add('math-choice--ok');
          });
          setTimeout(function () { if (running) showRound(); }, 520);
        }
      });
    });
  }

  function endGame() {
    running = false;
    clearInterval(tickTimer);
    tickTimer = null;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (overlay) overlay.hidden = false;
    var total = correct + wrong;
    var fs = document.getElementById('dictado-final-score');
    var fa = document.getElementById('dictado-final-acc');
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult(activityId, {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1,
        sessionComplete: true
      });
    }
  }

  function startGame() {
    running = true;
    if (window.LipaBrainPlay && LipaBrainPlay.syncRoundDuration) {
      DURATION = LipaBrainPlay.syncRoundDuration();
    }
    timeLeft = DURATION;
    score = 0;
    correct = 0;
    wrong = 0;
    combo = 0;
    if (overlay) overlay.hidden = true;
    if (arenaEl) arenaEl.classList.add('math-arena--live');
    updateHud();
    showRound();
    tickTimer = setInterval(function () {
      timeLeft--;
      updateHud();
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    mode = document.body.getAttribute('data-dictado-mode') || 'primaria';
    activityId = document.body.getAttribute('data-dictado-activity') || 'neon-dictado';
    timerEl = document.getElementById('dictado-timer');
    scoreEl = document.getElementById('dictado-score');
    accEl = document.getElementById('dictado-accuracy');
    comboEl = document.getElementById('dictado-combo');
    overlay = document.getElementById('dictado-overlay');
    btnStart = document.getElementById('dictado-start');
    arenaEl = document.getElementById('dictado-arena');
    promptEl = document.getElementById('dictado-prompt');
    workEl = document.getElementById('dictado-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    var blEl = document.getElementById('dictado-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
