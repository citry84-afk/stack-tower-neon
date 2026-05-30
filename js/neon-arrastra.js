/**
 * Neon Arrastra — arrastra sílabas, figuras o números a su sitio (20–35 s)
 * data-arrastra-mode: silabas | figuras | numeros
 * Tap-tap fallback: selecciona ficha → toca zona
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
  var mode = 'silabas';
  var activityId = 'neon-arrastra';
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
  var selectedChip = null;
  var filled = 0;

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

  function buildSilabasRound() {
    var words = ['GATO', 'CASA', 'SOL', 'FLOR', 'MESA', 'LUNA', 'PAN', 'RIO'];
    if (brainLevel >= 4) words = ['LIBRO', 'PERRO', 'VERDE', 'CAMPO', 'MARIPOSA'];
    var w = pick(words);
    var syls;
    if (w.length <= 3) {
      syls = w.split('');
    } else if (w.length <= 5) {
      syls = [w.slice(0, 2), w.slice(2)];
    } else {
      syls = [w.slice(0, 3), w.slice(3, 5), w.slice(5)];
    }
    var pool = shuffle(syls.map(function (s, i) {
      return { text: s, slotIndex: i };
    }));
    return { kind: 'silabas', label: w, items: syls, pool: pool };
  }

  function buildFigurasRound() {
    var pairs = [
      { item: '🔴', bins: [{ id: 'circulo', label: 'Círculo' }, { id: 'cuadrado', label: 'Cuadrado' }], answer: 'circulo' },
      { item: '🟦', bins: [{ id: 'circulo', label: 'Círculo' }, { id: 'cuadrado', label: 'Cuadrado' }], answer: 'cuadrado' },
      { item: '🔺', bins: [{ id: 'triangulo', label: 'Triángulo' }, { id: 'cuadrado', label: 'Cuadrado' }], answer: 'triangulo' },
      { item: '🐱', bins: [{ id: 'vivo', label: 'Vivo' }, { id: 'objeto', label: 'Objeto' }], answer: 'vivo' },
      { item: '🚗', bins: [{ id: 'vivo', label: 'Vivo' }, { id: 'objeto', label: 'Objeto' }], answer: 'objeto' }
    ];
    var p = pick(pairs);
    return { kind: 'figuras', item: p.item, bins: p.bins, answer: p.answer };
  }

  function buildNumerosRound() {
    var max = 8 + brainLevel * 2;
    var count = Math.min(3 + Math.floor(brainLevel / 3), 4);
    var nums = [];
    while (nums.length < count) {
      var n = 1 + Math.floor(Math.random() * max);
      if (nums.indexOf(n) < 0) nums.push(n);
    }
    nums.sort(function (a, b) { return a - b; });
    return {
      kind: 'numeros',
      answer: nums,
      pool: shuffle(nums.map(function (n, i) { return { id: 'n' + n, text: String(n), value: n }; }))
    };
  }

  function buildRound() {
    if (mode === 'figuras') return buildFigurasRound();
    if (mode === 'numeros') return buildNumerosRound();
    return buildSilabasRound();
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
    }, delay || 320);
  }

  function clearSelect() {
    selectedChip = null;
    if (!workEl) return;
    workEl.querySelectorAll('.arrastra-chip').forEach(function (c) {
      c.classList.remove('arrastra-chip--pick');
    });
    workEl.querySelectorAll('.arrastra-zone').forEach(function (z) {
      z.classList.remove('arrastra-zone--hot');
    });
  }

  function zoneFilled(zone) {
    return zone.getAttribute('data-filled') === '1';
  }

  function tryDrop(chip, zone) {
    if (!running || !chip || !zone || zoneFilled(zone)) return;
    var ok = false;
    if (round.kind === 'silabas') {
      var expectIdx = parseInt(zone.getAttribute('data-idx'), 10);
      ok = parseInt(chip.getAttribute('data-idx'), 10) === expectIdx;
    } else if (round.kind === 'figuras') {
      ok = zone.getAttribute('data-bin') === round.answer;
    } else if (round.kind === 'numeros') {
      var idx = parseInt(zone.getAttribute('data-idx'), 10);
      ok = parseInt(chip.getAttribute('data-value'), 10) === round.answer[idx];
    }
    if (ok) {
      zone.setAttribute('data-filled', '1');
      zone.textContent = chip.getAttribute('data-text') || chip.textContent;
      zone.classList.add('arrastra-zone--ok');
      chip.remove();
      clearSelect();
      if (round.kind === 'figuras') {
        markCorrect(16);
        nextRound(300);
        return;
      }
      filled++;
      var need = round.kind === 'silabas' ? round.items.length : round.answer.length;
      if (filled >= need) {
        markCorrect(16);
        nextRound(300);
      }
    } else {
      markWrong();
      clearSelect();
      if (round.kind === 'figuras') nextRound(520);
    }
  }

  function bindChip(chip) {
    chip.addEventListener('click', function () {
      if (!running || chip.parentElement.classList.contains('arrastra-zone')) return;
      if (selectedChip === chip) {
        clearSelect();
        return;
      }
      clearSelect();
      selectedChip = chip;
      chip.classList.add('arrastra-chip--pick');
      workEl.querySelectorAll('.arrastra-zone:not([data-filled="1"])').forEach(function (z) {
        z.classList.add('arrastra-zone--hot');
      });
    });

    chip.addEventListener('pointerdown', function (e) {
      if (!running) return;
      e.preventDefault();
      var startX = e.clientX;
      var startY = e.clientY;
      var moved = false;
      var ghost = chip.cloneNode(true);
      ghost.classList.add('arrastra-ghost');
      document.body.appendChild(ghost);
      var rect = chip.getBoundingClientRect();
      ghost.style.width = rect.width + 'px';
      ghost.style.height = rect.height + 'px';

      function moveGhost(ev) {
        if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 8) moved = true;
        ghost.style.left = (ev.clientX - rect.width / 2) + 'px';
        ghost.style.top = (ev.clientY - rect.height / 2) + 'px';
        workEl.querySelectorAll('.arrastra-zone:not([data-filled="1"])').forEach(function (z) {
          var zr = z.getBoundingClientRect();
          var hit = ev.clientX >= zr.left && ev.clientX <= zr.right && ev.clientY >= zr.top && ev.clientY <= zr.bottom;
          z.classList.toggle('arrastra-zone--hot', hit);
        });
      }

      function endDrag(ev) {
        document.removeEventListener('pointermove', moveGhost);
        document.removeEventListener('pointerup', endDrag);
        document.removeEventListener('pointercancel', endDrag);
        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
        workEl.querySelectorAll('.arrastra-zone').forEach(function (z) { z.classList.remove('arrastra-zone--hot'); });
        if (!moved) return;
        var target = null;
        workEl.querySelectorAll('.arrastra-zone:not([data-filled="1"])').forEach(function (z) {
          var zr = z.getBoundingClientRect();
          if (ev.clientX >= zr.left && ev.clientX <= zr.right && ev.clientY >= zr.top && ev.clientY <= zr.bottom) {
            target = z;
          }
        });
        if (target) tryDrop(chip, target);
      }

      ghost.style.left = rect.left + 'px';
      ghost.style.top = rect.top + 'px';
      document.addEventListener('pointermove', moveGhost);
      document.addEventListener('pointerup', endDrag);
      document.addEventListener('pointercancel', endDrag);
    });
  }

  function bindZone(zone) {
    zone.addEventListener('click', function () {
      if (!running || !selectedChip || zoneFilled(zone)) return;
      tryDrop(selectedChip, zone);
    });
  }

  function renderSilabas() {
    var slots = round.items.map(function (s, i) {
      return '<div class="arrastra-zone arrastra-slot" data-idx="' + i + '" data-filled="0"></div>';
    }).join('');
    var chips = round.pool.map(function (c, i) {
      return '<button type="button" class="arrastra-chip" data-text="' + c.text + '" data-idx="' + c.slotIndex + '" data-key="c' + i + '">' + c.text + '</button>';
    }).join('');
    workEl.innerHTML =
      '<p class="arrastra-word-hint">' + round.label + '</p>' +
      '<div class="arrastra-slots">' + slots + '</div>' +
      '<div class="arrastra-pool">' + chips + '</div>';
  }

  function renderFiguras() {
    var bins = round.bins.map(function (b) {
      return '<div class="arrastra-zone arrastra-bin" data-bin="' + b.id + '" data-filled="0">' + b.label + '</div>';
    }).join('');
    workEl.innerHTML =
      '<p class="arrastra-drag-item" aria-hidden="true">' + round.item + '</p>' +
      '<div class="arrastra-pool arrastra-pool--solo">' +
      '<button type="button" class="arrastra-chip arrastra-chip--emoji" data-text="' + round.item + '">' + round.item + '</button>' +
      '</div>' +
      '<div class="arrastra-bins">' + bins + '</div>';
  }

  function renderNumeros() {
    var slots = round.answer.map(function (_, i) {
      return '<div class="arrastra-zone arrastra-slot" data-idx="' + i + '" data-filled="0"><span class="arrastra-slot-n">' + (i + 1) + 'º</span></div>';
    }).join('');
    var chips = round.pool.map(function (c) {
      return '<button type="button" class="arrastra-chip" data-text="' + c.text + '" data-value="' + c.value + '">' + c.text + '</button>';
    }).join('');
    workEl.innerHTML =
      '<div class="arrastra-slots arrastra-slots--nums">' + slots + '</div>' +
      '<div class="arrastra-pool">' + chips + '</div>';
  }

  function showRound() {
    selectedChip = null;
    filled = 0;
    round = buildRound();
    if (promptEl) {
      if (round.kind === 'figuras') promptEl.textContent = 'Arrastra el dibujo al grupo correcto';
      else if (round.kind === 'numeros') promptEl.textContent = 'Arrastra los números de menor a mayor';
      else promptEl.textContent = 'Arrastra las sílabas para formar la palabra';
    }
    if (!workEl) return;
    if (round.kind === 'figuras') renderFiguras();
    else if (round.kind === 'numeros') renderNumeros();
    else renderSilabas();
    workEl.querySelectorAll('.arrastra-chip').forEach(bindChip);
    workEl.querySelectorAll('.arrastra-zone').forEach(bindZone);
  }

  function endGame() {
    running = false;
    clearInterval(tickTimer);
    tickTimer = null;
    clearSelect();
    if (overlay) overlay.hidden = false;
    var total = correct + wrong;
    var fs = document.getElementById('arrastra-final-score');
    var fa = document.getElementById('arrastra-final-acc');
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
    mode = document.body.getAttribute('data-arrastra-mode') || 'silabas';
    activityId = document.body.getAttribute('data-arrastra-activity') || 'neon-arrastra';
    timerEl = document.getElementById('arrastra-timer');
    scoreEl = document.getElementById('arrastra-score');
    accEl = document.getElementById('arrastra-accuracy');
    comboEl = document.getElementById('arrastra-combo');
    overlay = document.getElementById('arrastra-overlay');
    btnStart = document.getElementById('arrastra-start');
    arenaEl = document.getElementById('arrastra-arena');
    promptEl = document.getElementById('arrastra-prompt');
    workEl = document.getElementById('arrastra-work');
    if (window.LipaBrain) brainLevel = LipaBrain.getActivityLevel(activityId);
    var blEl = document.getElementById('arrastra-brain-level');
    if (blEl) blEl.textContent = 'Nivel Brain ' + brainLevel;
    if (btnStart) btnStart.addEventListener('click', startGame);
  });
})();
