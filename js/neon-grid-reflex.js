/**
 * Neon Grid 4×4 — reflejos y combo (un fallo = fin)
 */
(function () {
  'use strict';

  var board = new LipaDaily.DailyBoard('grid-reflex');
  var gridEl, scoreEl, comboEl, timerEl, overlay, btnStart, btnShare, lbEl;
  var cells = [];
  var running = false;
  var score = 0;
  var combo = 0;
  var activeIdx = -1;
  var timeoutId = null;
  var limitMs = 900;

  function init() {
    gridEl = document.getElementById('grid-board');
    scoreEl = document.getElementById('grid-score');
    comboEl = document.getElementById('grid-combo');
    timerEl = document.getElementById('grid-timer');
    overlay = document.getElementById('grid-overlay');
    btnStart = document.getElementById('grid-start');
    btnShare = document.getElementById('grid-share');
    lbEl = document.getElementById('grid-leaderboard');
    buildGrid();
    if (btnStart) btnStart.addEventListener('click', startGame);
    if (btnShare) btnShare.addEventListener('click', share);
    renderBoard();
  }

  function buildGrid() {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    cells = [];
    for (var i = 0; i < 16; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'grid-cell';
      btn.dataset.idx = String(i);
      btn.setAttribute('aria-label', 'Celda ' + (i + 1));
      btn.addEventListener('pointerdown', function () {
        onTap(parseInt(this.dataset.idx, 10));
      });
      gridEl.appendChild(btn);
      cells.push(btn);
    }
  }

  function renderBoard() {
    if (!lbEl) return;
    var top = board.getTop(5, true);
    lbEl.innerHTML = top.length
      ? top.map(function (r, i) {
          return '<div class="lb-row"><span>#' + (i + 1) + ' ' + esc(r.name) + '</span><strong>' + r.score + '</strong></div>';
        }).join('')
      : '<p class="muted">Sé el primero hoy.</p>';
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function clearActive() {
    cells.forEach(function (c) {
      c.classList.remove('grid-cell--active');
    });
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    activeIdx = -1;
  }

  function updateHud() {
    if (scoreEl) scoreEl.textContent = score;
    if (comboEl) comboEl.textContent = combo;
    if (timerEl) timerEl.textContent = limitMs + ' ms';
  }

  function nextRound() {
    if (!running) return;
    clearActive();
    var idx;
    do {
      idx = Math.floor(Math.random() * 16);
    } while (idx === activeIdx && score > 0);
    activeIdx = idx;
    cells[idx].classList.add('grid-cell--active');
    timeoutId = setTimeout(function () {
      gameOver(false);
    }, limitMs);
  }

  function onTap(idx) {
    if (!running) return;
    if (idx === activeIdx) {
      score++;
      combo++;
      limitMs = Math.max(350, limitMs - 25);
      updateHud();
      clearActive();
      nextRound();
    } else if (activeIdx >= 0) {
      gameOver(true);
    }
  }

  function gameOver(wasWrongTap) {
    running = false;
    clearActive();
    if (overlay) {
      overlay.hidden = false;
      document.getElementById('grid-final-score').textContent = score;
      document.getElementById('grid-final-combo').textContent = combo;
      document.getElementById('grid-final-reason').textContent = wasWrongTap
        ? 'Tocaste la celda incorrecta'
        : 'Se agotó el tiempo';
    }
    if (btnStart) btnStart.textContent = '▶ Reintentar';
    var name = localStorage.getItem('lipa_player_name') || '';
    if (!name) {
      name = prompt('Nombre para el ranking (máx. 15):', 'Jugador') || 'Jugador';
      localStorage.setItem('lipa_player_name', name.substring(0, 15));
    }
    board.submit(name, score, { combo: combo });
    board._save();
    LipaDaily.bumpStreak('lipa_grid_streak');
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('grid-reflex', { score: score, correct: score, wrong: 0 });
    } else if (LipaDaily.recordSession) {
      LipaDaily.recordSession('grid-reflex', { score: score });
    }
    renderBoard();
  }

  function startGame() {
    if (overlay) overlay.hidden = true;
    running = true;
    score = 0;
    combo = 0;
    limitMs = 900;
    updateHud();
    nextRound();
  }

  function share() {
    LipaDaily.shareResult({
      text: '🔲 Neon Grid: ' + score + ' aciertos seguidos. ¿Me ganas?',
      url: 'https://lipastudios.com/grid-reflejos-neon.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
