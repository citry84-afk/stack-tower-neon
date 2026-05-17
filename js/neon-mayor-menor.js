/**
 * Neon Mayor/Menor — comparar números (30 s)
 */
(function () {
  'use strict';

  var DURATION = 30;
  var activityId = 'neon-mayor-menor';
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
  var askGreater = true;

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl;

  function buildRound() {
    var max = 15 + brainLevel * 5;
    var a = 1 + Math.floor(Math.random() * max);
    var b = 1 + Math.floor(Math.random() * max);
    while (b === a) b = 1 + Math.floor(Math.random() * max);
    askGreater = Math.random() > 0.5;
    return { a: a, b: b, answer: askGreater ? Math.max(a, b) : Math.min(a, b) };
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
    if (promptEl) {
      promptEl.textContent = askGreater ? '¿Cuál es el número mayor?' : '¿Cuál es el número menor?';
    }
    if (!workEl) return;
    workEl.innerHTML =
      '<div class="mayor-duo">' +
      '<button type="button" class="math-choice mayor-choice" data-val="' + round.a + '">' + round.a + '</button>' +
      '<span class="mayor-vs">vs</span>' +
      '<button type="button" class="math-choice mayor-choice" data-val="' + round.b + '">' + round.b + '</button>' +
      '</div>';
    workEl.querySelectorAll('.mayor-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running) return;
        var val = parseInt(btn.getAttribute('data-val'), 10);
        if (val === round.answer) {
          markCorrect(14);
          btn.classList.add('math-choice--ok');
          setTimeout(function () { if (running) showRound(); }, 280);
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.mayor-choice').forEach(function (b) {
            if (parseInt(b.getAttribute('data-val'), 10) === round.answer) {
              b.classList.add('math-choice--ok');
            }
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
    var acc = total ? Math.round((correct / total) * 100) : 100;
    var fs = document.getElementById('mayor-final-score');
    var fa = document.getElementById('mayor-final-acc');
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = acc + '%';
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
    activityId = document.body.getAttribute('data-mayor-activity') || 'neon-mayor-menor';
    timerEl = document.getElementById('mayor-timer');
    scoreEl = document.getElementById('mayor-score');
    accEl = document.getElementById('mayor-accuracy');
    comboEl = document.getElementById('mayor-combo');
    overlay = document.getElementById('mayor-overlay');
    btnStart = document.getElementById('mayor-start');
    arenaEl = document.getElementById('mayor-arena');
    promptEl = document.getElementById('mayor-prompt');
    workEl = document.getElementById('mayor-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    try {
      var p = new URLSearchParams(window.location.search);
      var bl = parseInt(p.get('brainLevel'), 10);
      if (bl >= 1 && bl <= 12) brainLevel = bl;
    } catch (e) { /* ignore */ }
    var blEl = document.getElementById('mayor-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
