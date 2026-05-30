/**
 * Neon Empareja — une imagen y palabra (tap-tap matching, 20–30 s)
 * data-empareja-mode: figuras | palabras | emociones | entorno
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var mode = 'palabras';
  var activityId = 'neon-empareja';
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
  var selectedLeft = null;

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl;

  var DECKS = {
    figuras: [
      { left: '🔴', label: 'Círculo' },
      { left: '🟦', label: 'Cuadrado' },
      { left: '🔺', label: 'Triángulo' },
      { left: '⭐', label: 'Estrella' }
    ],
    palabras: [
      { left: '🐱', label: 'Gato' },
      { left: '🐶', label: 'Perro' },
      { left: '🏠', label: 'Casa' },
      { left: '🌳', label: 'Árbol' },
      { left: '🚗', label: 'Coche' },
      { left: '📚', label: 'Libro' }
    ],
    emociones: [
      { left: '😊', label: 'Feliz' },
      { left: '😢', label: 'Triste' },
      { left: '😠', label: 'Enfadado' },
      { left: '😴', label: 'Cansado' }
    ],
    entorno: [
      { left: '👩‍⚕️', label: 'Médica' },
      { left: '👨‍🚒', label: 'Bombero' },
      { left: '👩‍🏫', label: 'Maestra' },
      { left: '🏫', label: 'Colegio' },
      { left: '🚌', label: 'Autobús' }
    ]
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = b[i];
      b[i] = b[j];
      b[j] = t;
    }
    return b;
  }

  function buildRound() {
    var deck = DECKS[mode] || DECKS.palabras;
    var count = Math.min(3 + Math.floor(brainLevel / 4), 4);
    var pairs = shuffle(deck).slice(0, count);
    var labels = shuffle(pairs.map(function (p) { return p.label; }));
    return { pairs: pairs, labels: labels };
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
    selectedLeft = null;
    round = buildRound();
    if (promptEl) promptEl.textContent = 'Toca un dibujo y luego su palabra';
    if (!workEl) return;
    var leftHtml = round.pairs.map(function (p, i) {
      return '<button type="button" class="empareja-left math-choice" data-idx="' + i + '" data-label="' + p.label + '">' + p.left + '</button>';
    }).join('');
    var rightHtml = round.labels.map(function (lab) {
      return '<button type="button" class="empareja-right math-choice" data-label="' + lab + '">' + lab + '</button>';
    }).join('');
    workEl.innerHTML =
      '<div class="empareja-row empareja-row--left">' + leftHtml + '</div>' +
      '<div class="empareja-row empareja-row--right">' + rightHtml + '</div>';

    workEl.querySelectorAll('.empareja-left').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || btn.disabled) return;
        workEl.querySelectorAll('.empareja-left').forEach(function (b) { b.classList.remove('empareja-pick'); });
        btn.classList.add('empareja-pick');
        selectedLeft = btn.getAttribute('data-label');
      });
    });

    workEl.querySelectorAll('.empareja-right').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || btn.disabled || !selectedLeft) return;
        var label = btn.getAttribute('data-label');
        if (label === selectedLeft) {
          markCorrect(14);
          btn.classList.add('math-choice--ok');
          workEl.querySelectorAll('.empareja-left').forEach(function (b) {
            if (b.getAttribute('data-label') === selectedLeft) {
              b.classList.add('math-choice--ok');
              b.disabled = true;
            }
          });
          btn.disabled = true;
          var leftActive = workEl.querySelectorAll('.empareja-left:not([disabled])');
          if (!leftActive.length) {
            setTimeout(function () { if (running) showRound(); }, 400);
          } else {
            selectedLeft = null;
          }
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.empareja-right').forEach(function (b) {
            if (b.getAttribute('data-label') === selectedLeft) b.classList.add('math-choice--ok');
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
    var fs = document.getElementById('empareja-final-score');
    var fa = document.getElementById('empareja-final-acc');
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
    mode = document.body.getAttribute('data-empareja-mode') || 'palabras';
    activityId = document.body.getAttribute('data-empareja-activity') || 'neon-empareja';
    timerEl = document.getElementById('empareja-timer');
    scoreEl = document.getElementById('empareja-score');
    accEl = document.getElementById('empareja-accuracy');
    comboEl = document.getElementById('empareja-combo');
    overlay = document.getElementById('empareja-overlay');
    btnStart = document.getElementById('empareja-start');
    arenaEl = document.getElementById('empareja-arena');
    promptEl = document.getElementById('empareja-prompt');
    workEl = document.getElementById('empareja-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    var blEl = document.getElementById('empareja-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
