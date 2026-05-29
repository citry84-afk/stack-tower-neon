/**
 * Neon Ordenar — ordenar números o palabras (30 s)
 * data-ordenar-mode: numeros | palabras
 */
(function () {
  'use strict';

  var DURATION = 30;
  var mode = 'numeros';
  var activityId = 'neon-ordenar';
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
  var nextSlot = 0;

  var timerEl, scoreEl, accEl, comboEl, overlay, btnStart, arenaEl, promptEl, workEl;

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

  function buildNumberRound() {
    var max = 10 + brainLevel * 4;
    var count = Math.min(4 + Math.floor(brainLevel / 3), 6);
    var nums = [];
    while (nums.length < count) {
      var n = 1 + Math.floor(Math.random() * max);
      if (nums.indexOf(n) < 0) nums.push(n);
    }
    nums.sort(function (a, b) { return a - b; });
    return { items: nums, answer: nums.slice(), shuffled: shuffle(nums) };
  }

  function buildWordRound() {
    var words = ['SOL', 'LUNA', 'CASA', 'GATO', 'MESA', 'FLOR', 'RIO', 'PAN'];
    var w = pick(words);
    var syls = w.length <= 3 ? w.split('') : [w.slice(0, 2), w.slice(2)];
    if (syls.length < 2) syls = w.split('');
    return { items: syls, answer: syls.slice(), shuffled: shuffle(syls), label: w };
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

  function nextRound(delay) {
    setTimeout(function () {
      if (running) showRound();
    }, delay || 280);
  }

  function showRound() {
    nextSlot = 0;
    round = mode === 'palabras' ? buildWordRound() : buildNumberRound();
    if (promptEl) {
      promptEl.textContent = mode === 'palabras'
        ? 'Toca las sílabas en orden: ' + (round.label || '')
        : 'Toca los números de menor a mayor';
    }
    if (!workEl) return;
    var slots = round.answer.map(function (_, i) {
      return '<span class="lengua-slot ordenar-slot" data-slot="' + i + '"></span>';
    }).join('');
    var chips = round.shuffled.map(function (item, i) {
      return '<button type="button" class="lengua-chip ordenar-chip" data-idx="' + i + '" data-val="' + item + '">' + item + '</button>';
    }).join('');
    workEl.innerHTML =
      '<div class="lengua-slots">' + slots + '</div>' +
      '<div class="lengua-chips ordenar-chips">' + chips + '</div>';
    bindRound();
  }

  function bindRound() {
    if (!workEl) return;
    workEl.querySelectorAll('.ordenar-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running || btn.disabled) return;
        var val = btn.getAttribute('data-val');
        if (val !== String(round.answer[nextSlot])) {
          markWrong();
          btn.classList.add('math-choice--bad');
          nextRound(500);
          return;
        }
        markCorrect(12);
        btn.disabled = true;
        btn.classList.add('math-choice--ok');
        var slot = workEl.querySelector('.ordenar-slot[data-slot="' + nextSlot + '"]');
        if (slot) slot.textContent = val;
        nextSlot++;
        if (nextSlot >= round.answer.length) nextRound(300);
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
    var fs = document.getElementById('ordenar-final-score');
    var fa = document.getElementById('ordenar-final-acc');
    if (fs) fs.textContent = score;
    if (fa) fa.textContent = acc + '%';
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
    timeLeft = DURATION;
    score = 0;
    correct = 0;
    wrong = 0;
    combo = 0;
    maxCombo = 0;
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
    var body = document.body;
    mode = body.getAttribute('data-ordenar-mode') || 'numeros';
    activityId = body.getAttribute('data-ordenar-activity') || 'neon-ordenar';
    timerEl = document.getElementById('ordenar-timer');
    scoreEl = document.getElementById('ordenar-score');
    accEl = document.getElementById('ordenar-accuracy');
    comboEl = document.getElementById('ordenar-combo');
    overlay = document.getElementById('ordenar-overlay');
    btnStart = document.getElementById('ordenar-start');
    arenaEl = document.getElementById('ordenar-arena');
    promptEl = document.getElementById('ordenar-prompt');
    workEl = document.getElementById('ordenar-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    try {
      var p = new URLSearchParams(window.location.search);
      var bl = parseInt(p.get('brainLevel'), 10);
      if (bl >= 1 && bl <= 12) brainLevel = bl;
    } catch (e) { /* ignore */ }
    var blEl = document.getElementById('ordenar-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
