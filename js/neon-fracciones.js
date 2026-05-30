/**
 * Neon Fracciones — medios, tercios y cuartos con barra visual (30 s)
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var activityId = 'neon-fracciones';
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

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function denominatorsForLevel() {
    var base = [2, 3, 4];
    if (brainLevel >= 5) base.push(6);
    return base;
  }

  function fracLabel(n, d) {
    return n + '/' + d;
  }

  function renderBar(num, den) {
    var html = '<div class="frac-bar" role="img" aria-label="' + num + ' de ' + den + ' partes">';
    for (var i = 0; i < den; i++) {
      html += '<div class="frac-part' + (i < num ? ' is-filled' : '') + '"></div>';
    }
    return html + '</div>';
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

  function wrongFractions(num, den) {
    var out = [];
    var tries = 0;
    while (out.length < 2 && tries < 20) {
      tries++;
      var d2 = pick(denominatorsForLevel());
      var n2 = 1 + Math.floor(Math.random() * (d2 - 1));
      var label = fracLabel(n2, d2);
      if (n2 !== num || d2 !== den) {
        if (out.indexOf(label) < 0) out.push(label);
      }
    }
    while (out.length < 2) {
      var fallback = fracLabel(1, den === 2 ? 4 : 2);
      if (out.indexOf(fallback) < 0) out.push(fallback);
      else out.push(fracLabel(2, 3));
    }
    return out;
  }

  function buildEquivalentRound() {
    var pairs = [[1, 2, 2, 4], [1, 3, 2, 6], [2, 3, 4, 6], [1, 4, 2, 8], [2, 4, 1, 2]];
    var p = pick(pairs);
    var showNum = p[0];
    var showDen = p[1];
    var eqNum = p[2];
    var eqDen = p[3];
    var correctLabel = fracLabel(eqNum, eqDen);
    var wrong = wrongFractions(eqNum, eqDen).filter(function (w) {
      return w !== correctLabel && w !== fracLabel(showNum, showDen);
    });
    while (wrong.length < 2) wrong.push(fracLabel(1, showDen + 1));
    return {
      prompt: 'Esta barra es ' + fracLabel(showNum, showDen) + '. ¿Qué fracción es igual?',
      answer: correctLabel,
      choices: shuffle([correctLabel].concat(wrong.slice(0, 2))),
      visual: renderBar(showNum, showDen)
    };
  }

  function buildCompareRound() {
    var d1 = pick(denominatorsForLevel());
    var n1 = 1 + Math.floor(Math.random() * (d1 - 1));
    var d2 = pick(denominatorsForLevel());
    var n2 = 1 + Math.floor(Math.random() * (d2 - 1));
    var v1 = n1 / d1;
    var v2 = n2 / d2;
    var tries = 0;
    while (Math.abs(v1 - v2) < 0.05 && tries < 12) {
      d2 = pick(denominatorsForLevel());
      n2 = 1 + Math.floor(Math.random() * (d2 - 1));
      v2 = n2 / d2;
      tries++;
    }
    var answer = v1 >= v2 ? 'A' : 'B';
    return {
      prompt: '¿Qué barra tiene MÁS partes coloreadas?',
      answer: answer,
      choices: shuffle(['A', 'B']),
      visual:
        '<div class="frac-compare">' +
        '<div class="frac-compare__col"><p class="frac-compare__label">A · ' + fracLabel(n1, d1) + '</p>' + renderBar(n1, d1) + '</div>' +
        '<div class="frac-compare__col"><p class="frac-compare__label">B · ' + fracLabel(n2, d2) + '</p>' + renderBar(n2, d2) + '</div>' +
        '</div>'
    };
  }

  function modesForLevel() {
    var modes = ['identify', 'parts'];
    if (brainLevel >= 3) modes.push('equivalent');
    if (brainLevel >= 4) modes.push('compare');
    return modes;
  }

  function buildRound() {
    var mode = pick(modesForLevel());
    if (mode === 'equivalent') return buildEquivalentRound();
    if (mode === 'compare') return buildCompareRound();

    var den = pick(denominatorsForLevel());
    var num = 1 + Math.floor(Math.random() * (den - 1));
    var correctLabel = fracLabel(num, den);

    if (mode === 'parts') {
      return {
        prompt: '¿Cuántas partes iguales tiene la barra?',
        answer: String(den),
        choices: shuffle([String(den), String(Math.max(2, den - 1)), String(den + 1)]),
        visual: renderBar(num, den)
      };
    }

    return {
      prompt: '¿Qué fracción está coloreada?',
      answer: correctLabel,
      choices: shuffle([correctLabel].concat(wrongFractions(num, den))),
      visual: renderBar(num, den)
    };
  }

  function markCorrect(pts) {
    correct++;
    combo++;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(combo);
    if (combo > maxCombo) maxCombo = combo;
    score += pts + Math.min(combo * 2, 18);
    updateHud();
    try { if (window.LipaGameFeedback) LipaGameFeedback.onCorrect(workEl || arenaEl); } catch (e) { /* ignore */ }
  }

  function markWrong() {
    wrong++;
    combo = 0;
    if (window.LipaGameFeedback && LipaGameFeedback.setCombo) LipaGameFeedback.setCombo(0);
    updateHud();
    try { if (window.LipaGameFeedback) LipaGameFeedback.onWrong(workEl || arenaEl); } catch (e) { /* ignore */ }
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
    if (promptEl) promptEl.textContent = round.prompt;
    if (!workEl) return;
    workEl.innerHTML =
      round.visual +
      '<div class="frac-choices">' +
      round.choices.map(function (c) {
        return '<button type="button" class="math-choice frac-choice" data-val="' + c + '">' + c + '</button>';
      }).join('') +
      '</div>';
    workEl.querySelectorAll('.frac-choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!running) return;
        var val = btn.getAttribute('data-val');
        if (val === round.answer) {
          markCorrect(14);
          btn.classList.add('math-choice--ok');
          setTimeout(function () { if (running) showRound(); }, 280);
        } else {
          markWrong();
          btn.classList.add('math-choice--bad');
          workEl.querySelectorAll('.frac-choice').forEach(function (b) {
            if (b.getAttribute('data-val') === round.answer) b.classList.add('math-choice--ok');
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
    var fs = document.getElementById('fracciones-final-score');
    var fa = document.getElementById('fracciones-final-acc');
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
    activityId = document.body.getAttribute('data-fracciones-activity') || 'neon-fracciones';
    timerEl = document.getElementById('fracciones-timer');
    scoreEl = document.getElementById('fracciones-score');
    accEl = document.getElementById('fracciones-accuracy');
    comboEl = document.getElementById('fracciones-combo');
    overlay = document.getElementById('fracciones-overlay');
    btnStart = document.getElementById('fracciones-start');
    arenaEl = document.getElementById('fracciones-arena');
    promptEl = document.getElementById('fracciones-prompt');
    workEl = document.getElementById('fracciones-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    var blEl = document.getElementById('fracciones-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
