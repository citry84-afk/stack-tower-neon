/**
 * Neon Flash Tap — toca el círculo antes de que desaparezca (30 s)
 */
(function () {
  'use strict';

  var DURATION = 30;
  var SPAWN_RETRIES = 24;
  var board = null;
  var arena, timerEl, scoreEl, accEl, comboEl, overlay, btnStart, btnShare, lbEl;
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var hits = 0;
  var misses = 0;
  var combo = 0;
  var maxCombo = 0;
  var tickTimer = null;
  var activeTarget = null;
  var targetTimeout = null;
  var spawnAttempts = 0;

  function getBoard() {
    if (board) return board;
    if (window.LipaDaily && typeof LipaDaily.DailyBoard === 'function') {
      board = new LipaDaily.DailyBoard('flash-tap');
    } else {
      board = {
        submit: function () {},
        getTop: function () { return []; }
      };
    }
    return board;
  }

  function init() {
    arena = document.getElementById('flash-arena');
    timerEl = document.getElementById('flash-timer');
    scoreEl = document.getElementById('flash-score');
    accEl = document.getElementById('flash-accuracy');
    comboEl = document.getElementById('flash-combo');
    overlay = document.getElementById('flash-overlay');
    btnStart = document.getElementById('flash-start');
    btnShare = document.getElementById('flash-share');
    lbEl = document.getElementById('flash-leaderboard');
    if (btnStart) btnStart.addEventListener('click', startGame);
    if (btnShare) btnShare.addEventListener('click', share);
    if (arena) {
      arena.addEventListener('click', onArenaMiss);
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () {
          if (running && !activeTarget) spawnTarget();
        });
        ro.observe(arena);
      }
    }
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
    var total = hits + misses;
    if (accEl) accEl.textContent = (total ? Math.round((hits / total) * 100) : 100) + '%';
  }

  function clearTarget() {
    if (targetTimeout) {
      clearTimeout(targetTimeout);
      targetTimeout = null;
    }
    if (activeTarget && activeTarget.parentNode) activeTarget.remove();
    activeTarget = null;
  }

  function arenaSize() {
    if (!arena) return { w: 0, h: 0 };
    var rect = arena.getBoundingClientRect();
    var w = rect.width || arena.clientWidth || 0;
    var h = rect.height || arena.clientHeight || 0;
    return { w: w, h: h };
  }

  function spawnTarget() {
    if (!running || !arena) return;
    clearTarget();
    var pad = 28;
    var sizeBox = arenaSize();
    var w = sizeBox.w - pad * 2;
    var h = sizeBox.h - pad * 2;
    if (w < 48 || h < 48) {
      spawnAttempts++;
      if (spawnAttempts < SPAWN_RETRIES) {
        requestAnimationFrame(function () {
          if (running) spawnTarget();
        });
      } else if (arena) {
        arena.setAttribute('data-flash-wait', '1');
      }
      return;
    }
    spawnAttempts = 0;
    if (arena) arena.removeAttribute('data-flash-wait');

    var size = Math.max(44, Math.min(64, 56 - Math.floor(score / 50)));
    var x = pad + Math.random() * Math.max(0, w - size);
    var y = pad + Math.random() * Math.max(0, h - size);
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'flash-target';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.setAttribute('aria-label', 'Toca');
    (function (target) {
      var tapped = false;
      function tap(e) {
        if (tapped) return;
        tapped = true;
        e.preventDefault();
        e.stopPropagation();
        onHit(target);
        setTimeout(function () { tapped = false; }, 200);
      }
      target.addEventListener('click', tap);
      target.addEventListener('touchend', tap, { passive: false });
    })(el);
    arena.appendChild(el);
    activeTarget = el;
    var ttl = Math.max(500, 1000 - score * 4);
    targetTimeout = setTimeout(function () {
      if (activeTarget === el) {
        misses++;
        combo = 0;
        el.classList.add('flash-target--miss');
        setTimeout(function () { if (el.parentNode) el.remove(); }, 120);
        activeTarget = null;
        updateHud();
        if (running) spawnTarget();
      }
    }, ttl);
  }

  function onHit(el) {
    if (!running || activeTarget !== el) return;
    clearTarget();
    hits++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    var pts = 8 + Math.min(combo * 2, 20);
    score += pts;
    updateHud();
    spawnTarget();
  }

  function onArenaMiss(e) {
    if (!running) return;
    if (e.target !== arena) return;
    misses++;
    combo = 0;
    updateHud();
  }

  function endGame() {
    running = false;
    clearTarget();
    clearInterval(tickTimer);
    tickTimer = null;
    if (arena) arena.removeAttribute('data-flash-wait');
    if (overlay) overlay.hidden = false;
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = 'Otra ronda (30 s)';
    }
    var fs = document.getElementById('flash-final-score');
    var fa = document.getElementById('flash-final-acc');
    var fc = document.getElementById('flash-final-combo');
    if (fs) fs.textContent = score;
    var total = hits + misses;
    if (fa) fa.textContent = (total ? Math.round((hits / total) * 100) : 100) + '%';
    if (fc) fc.textContent = maxCombo;
    var nameInput = document.getElementById('flash-name');
    var name = (nameInput && nameInput.value.trim()) || 'Jugador';
    getBoard().submit(name.substring(0, 15), score, { hits: hits, misses: misses });
    var total = hits + misses;
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('flash-tap', {
        score: score,
        correct: hits,
        wrong: misses,
        accuracy: total ? hits / total : 1,
        durationSec: DURATION
      });
    } else if (window.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession('flash-tap', { score: score });
    }
    var best = parseInt(localStorage.getItem('lipa_flash_tap_best') || '0', 10);
    if (score > best) localStorage.setItem('lipa_flash_tap_best', String(score));
    renderBoard();
  }

  function startGame() {
    if (running) return;
    score = 0;
    hits = 0;
    misses = 0;
    combo = 0;
    maxCombo = 0;
    timeLeft = DURATION;
    spawnAttempts = 0;
    running = true;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    updateHud();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (running) spawnTarget();
      });
    });
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
      text: '⚡ ' + score + ' pts en Neon Flash Tap. ¿Me superas?',
      url: 'https://lipastudios.com/toque-flash-neon.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
