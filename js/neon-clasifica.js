/**
 * Neon Clasifica — agrupar figuras, seres vivos u objetos (30 s)
 * data-clasifica-mode: figuras | vivir | emociones
 */
(function () {
  'use strict';

  var DURATION = 30;
  var mode = 'figuras';
  var activityId = 'neon-clasifica';
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

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl;

  var DECKS = {
    figuras: [
      { id: 'circulo', label: 'Círculo', items: ['🔴', '⚽', '🌕', '🍩'] },
      { id: 'cuadrado', label: 'Cuadrado', items: ['🟦', '📦', '🧇', '📘'] },
      { id: 'triangulo', label: 'Triángulo', items: ['🔺', '⛺', '🏔️', '📐'] }
    ],
    vivir: [
      { id: 'vivo', label: 'Ser vivo', items: ['🐱', '🐶', '🌳', '🌻', '🐸'] },
      { id: 'objeto', label: 'Objeto', items: ['🚗', '📚', '⚽', '🏠', '✏️'] }
    ],
    emociones: [
      { id: 'feliz', label: 'Feliz', items: ['😊', '😄', '🥳', '😁'] },
      { id: 'triste', label: 'Triste', items: ['😢', '😞', '😿', '☹️'] }
    ]
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function buildRound() {
    var deck = DECKS[mode] || DECKS.figuras;
    var shuffled = deck.slice().sort(function () { return Math.random() - 0.5; });
    var a = shuffled[0];
    var b = shuffled[1];
    var correctCat = pick([a, b]);
    var item = pick(correctCat.items);
    return { item: item, a: a, b: b, answerId: correctCat.id };
  }

  function markCorrect(pts) {
    correct++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    score += pts + Math.min(combo * 2, 18);
    updateHud();
    try { if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(workEl || arenaEl); } catch (fbErr) { /* ignore */ }
  }

  function markWrong() {
    wrong++;
    combo = 0;
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
    if (promptEl) promptEl.textContent = '¿Dónde va «' + round.item + '»?';
    if (!workEl) return;
    workEl.innerHTML =
      '<p class="clasifica-item" aria-hidden="true">' + round.item + '</p>' +
      '<div class="clasifica-bins">' +
      '<button type="button" class="math-choice clasifica-bin" data-cat="' + round.a.id + '">' + round.a.label + '</button>' +
      '<button type="button" class="math-choice clasifica-bin" data-cat="' + round.b.id + '">' + round.b.label + '</button>' +
      '</div>';
    workEl.querySelectorAll('.clasifica-bin').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running) return;
        var cat = btn.getAttribute('data-cat');
        if (cat === round.answerId) {
          markCorrect(14);
          btn.classList.add('math-choice--ok');
          setTimeout(function () { if (running) showRound(); }, 280);
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.clasifica-bin').forEach(function (b) {
            if (b.getAttribute('data-cat') === round.answerId) b.classList.add('math-choice--ok');
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
    if (overlay) overlay.hidden = false;
    var total = correct + wrong;
    var fs = document.getElementById('clasifica-final-score');
    var fa = document.getElementById('clasifica-final-acc');
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = (total ? Math.round((correct / total) * 100) : 100) + '%';
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult(activityId, {
        score: score,
        correct: correct,
        wrong: wrong,
        accuracy: total ? correct / total : 1
      });
    }
  }

  function startGame() {
    running = true;
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
    mode = document.body.getAttribute('data-clasifica-mode') || 'figuras';
    activityId = document.body.getAttribute('data-clasifica-activity') || 'neon-clasifica';
    timerEl = document.getElementById('clasifica-timer');
    scoreEl = document.getElementById('clasifica-score');
    accEl = document.getElementById('clasifica-accuracy');
    comboEl = document.getElementById('clasifica-combo');
    overlay = document.getElementById('clasifica-overlay');
    btnStart = document.getElementById('clasifica-start');
    arenaEl = document.getElementById('clasifica-arena');
    promptEl = document.getElementById('clasifica-prompt');
    workEl = document.getElementById('clasifica-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    var blEl = document.getElementById('clasifica-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
