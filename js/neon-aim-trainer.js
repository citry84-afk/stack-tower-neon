/**
 * Neon Aim Trainer — 30 s, precisión y puntuación
 */
(function () {
  'use strict';

  var DURATION = 30;
  var board = new LipaDaily.DailyBoard('aim-trainer');
  var arena, timerEl, scoreEl, accEl, comboEl, overlay, btnStart, btnShare, lbEl;
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var hits = 0;
  var misses = 0;
  var combo = 0;
  var maxCombo = 0;
  var spawnTimer = null;
  var tickTimer = null;
  var activeTarget = null;

  function init() {
    arena = document.getElementById('aim-arena');
    timerEl = document.getElementById('aim-timer');
    scoreEl = document.getElementById('aim-score');
    accEl = document.getElementById('aim-accuracy');
    comboEl = document.getElementById('aim-combo');
    overlay = document.getElementById('aim-overlay');
    btnStart = document.getElementById('aim-start');
    btnShare = document.getElementById('aim-share');
    lbEl = document.getElementById('aim-leaderboard');
    if (btnStart) btnStart.addEventListener('click', startGame);
    if (btnShare) btnShare.addEventListener('click', share);
    if (arena) {
      arena.addEventListener('pointerdown', onArenaMiss);
    }
    renderBoard();
  }

  function renderBoard() {
    if (!lbEl) return;
    var top = board.getTop(5, true);
    lbEl.innerHTML = top.length
      ? top.map(function (r, i) {
          return '<div class="lb-row"><span>#' + (i + 1) + ' ' + esc(r.name) + '</span><strong>' + r.score + ' pts</strong></div>';
        }).join('')
      : '<p class="muted">Sé el primero en el ranking de hoy.</p>';
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function updateHud() {
    if (timerEl) timerEl.textContent = Math.ceil(timeLeft) + ' s';
    if (scoreEl) scoreEl.textContent = score;
    if (comboEl) comboEl.textContent = combo;
    var total = hits + misses;
    var acc = total ? Math.round((hits / total) * 100) : 100;
    if (accEl) accEl.textContent = acc + '%';
  }

  function clearTarget() {
    if (activeTarget && activeTarget.parentNode) {
      activeTarget.parentNode.removeChild(activeTarget);
    }
    activeTarget = null;
  }

  function spawnTarget() {
    if (!running || !arena) return;
    clearTarget();
    var pad = 36;
    var w = arena.clientWidth - pad * 2;
    var h = arena.clientHeight - pad * 2;
    if (w < 40 || h < 40) return;
    var size = Math.max(28, 48 - Math.floor(score / 80));
    var x = pad + Math.random() * (w - size);
    var y = pad + Math.random() * (h - size);
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'aim-target';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.setAttribute('aria-label', 'Diana');
    el.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
      onHit(el);
    });
    arena.appendChild(el);
    activeTarget = el;
    var ttl = Math.max(500, 1100 - score * 3);
    setTimeout(function () {
      if (activeTarget === el) {
        misses++;
        combo = 0;
        el.classList.add('aim-target--miss');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 150);
        activeTarget = null;
        updateHud();
      }
    }, ttl);
  }

  function onHit(el) {
    if (!running) return;
    hits++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    score += 10 + combo * 2;
    el.classList.add('aim-target--hit');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 100);
    if (activeTarget === el) activeTarget = null;
    updateHud();
  }

  function onArenaMiss(e) {
    if (!running || e.target !== arena) return;
    misses++;
    combo = 0;
    updateHud();
  }

  function endGame() {
    running = false;
    clearInterval(tickTimer);
    clearInterval(spawnTimer);
    clearTarget();
    var total = hits + misses;
    var acc = total ? Math.round((hits / total) * 100) : 0;
    if (overlay) {
      overlay.hidden = false;
      document.getElementById('aim-final-score').textContent = score;
      document.getElementById('aim-final-acc').textContent = acc + '%';
      document.getElementById('aim-final-combo').textContent = maxCombo;
    }
    if (btnStart) btnStart.textContent = '▶ Jugar otra vez';
    var name = localStorage.getItem('lipa_player_name') || '';
    if (!name) {
      name = prompt('Nombre para el ranking (máx. 15):', 'Jugador') || 'Jugador';
      localStorage.setItem('lipa_player_name', name.substring(0, 15));
    }
    board.submit(name, score, { accuracy: acc, hits: hits, maxCombo: maxCombo });
    board._save();
    LipaDaily.bumpStreak('lipa_aim_streak');
    if (LipaDaily.recordSession) LipaDaily.recordSession('aim-trainer', { score: score });
    renderBoard();
  }

  function startGame() {
    if (overlay) overlay.hidden = true;
    running = true;
    timeLeft = DURATION;
    score = 0;
    hits = 0;
    misses = 0;
    combo = 0;
    maxCombo = 0;
    if (arena) arena.innerHTML = '';
    updateHud();
    spawnTarget();
    spawnTimer = setInterval(spawnTarget, 750);
    tickTimer = setInterval(function () {
      timeLeft -= 0.1;
      if (timeLeft <= 0) {
        timeLeft = 0;
        updateHud();
        endGame();
        return;
      }
      updateHud();
    }, 100);
  }

  function share() {
    LipaDaily.shareResult({
      text: '🎯 Aim Trainer Neon: ' + score + ' pts de precisión. ¿Me superas?',
      url: 'https://lipastudios.com/aim-trainer-neon.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
