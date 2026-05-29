/**
 * Neon Aim Trainer — 30 s, precisión y puntuación
 */
(function () {
  'use strict';

  var DURATION = (window.LipaBrainPlay && LipaBrainPlay.roundDurationSec) ? LipaBrainPlay.roundDurationSec() : 30;
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
  var spawnTimer = null;
  var tickTimer = null;
  var activeTarget = null;
  var targetTimeout = null;
  var spawnAttempts = 0;

  function getBoard() {
    if (board) return board;
    if (window.LipaDaily && typeof LipaDaily.DailyBoard === 'function') {
      board = new LipaDaily.DailyBoard('aim-trainer');
    } else {
      board = {
        submit: function () {},
        getTop: function () { return []; },
        _save: function () {}
      };
    }
    return board;
  }

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
    var acc = total ? Math.round((hits / total) * 100) : 100;
    if (accEl) accEl.textContent = acc + '%';
  }

  function clearTarget() {
    if (targetTimeout) {
      clearTimeout(targetTimeout);
      targetTimeout = null;
    }
    if (arena) {
      var nodes = arena.querySelectorAll('.aim-target');
      for (var i = 0; i < nodes.length; i++) nodes[i].remove();
    }
    activeTarget = null;
  }

  function arenaSize() {
    if (!arena) return { w: 0, h: 0 };
    return {
      w: arena.clientWidth || arena.offsetWidth || 0,
      h: arena.clientHeight || arena.offsetHeight || 0
    };
  }

  function applyTargetStyle(el, x, y, size) {
    el.style.cssText =
      'position:absolute;' +
      'left:' + x + 'px;' +
      'top:' + y + 'px;' +
      'width:' + size + 'px;' +
      'height:' + size + 'px;' +
      'z-index:2;' +
      'margin:0;' +
      'padding:0;' +
      'border:2px solid #fff;' +
      'border-radius:50%;' +
      'box-sizing:border-box;' +
      'cursor:pointer;' +
      'touch-action:manipulation;' +
      '-webkit-appearance:none;' +
      'appearance:none;' +
      'background:radial-gradient(circle at 30% 30%, #ff6b9d, #ff0080);' +
      'box-shadow:0 0 18px rgba(255, 0, 128, 0.55);';
  }

  function bindTap(target) {
    var locked = false;
    function hit(e) {
      if (locked) return;
      if (e.type === 'click' && e.pointerType !== 'mouse') return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      locked = true;
      e.preventDefault();
      e.stopPropagation();
      onHit(target);
    }
    target.addEventListener('pointerdown', hit);
    target.addEventListener('click', hit);
  }

  function spawnTarget() {
    if (!running || !arena) return;
    clearTarget();
    var pad = 16;
    var box = arenaSize();
    var w = box.w - pad * 2;
    var h = box.h - pad * 2;
    if (w < 48 || h < 48) {
      spawnAttempts++;
      if (spawnAttempts < SPAWN_RETRIES) {
        requestAnimationFrame(function () {
          if (running) spawnTarget();
        });
      } else {
        arena.setAttribute('data-aim-wait', '1');
      }
      return;
    }
    spawnAttempts = 0;
    arena.removeAttribute('data-aim-wait');

    var size = Math.max(44, Math.min(56, 52 - Math.floor(score / 80)));
    var x = pad + Math.random() * Math.max(0, w - size);
    var y = pad + Math.random() * Math.max(0, h - size);
    var el = document.createElement('div');
    el.className = 'aim-target';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Diana');
    applyTargetStyle(el, x, y, size);
    bindTap(el);
    arena.appendChild(el);
    activeTarget = el;

    var ttl = Math.max(550, 1200 - score * 3);
    targetTimeout = setTimeout(function () {
      if (activeTarget === el) {
        misses++;
        combo = 0;
        el.classList.add('aim-target--miss');
        activeTarget = null;
        updateHud();
        setTimeout(function () {
          if (el.parentNode) el.remove();
          if (running) spawnTarget();
        }, 120);
      }
    }, ttl);
  }

  function onHit(el) {
    if (!running || activeTarget !== el) return;
    if (targetTimeout) {
      clearTimeout(targetTimeout);
      targetTimeout = null;
    }
    hits++;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    score += 10 + combo * 2;
    el.classList.add('aim-target--hit');
    activeTarget = null;
    updateHud();
    setTimeout(function () {
      if (el.parentNode) el.remove();
      if (running) spawnTarget();
    }, 80);
  }

  function onArenaMiss(e) {
    if (!running || e.target !== arena) return;
    if (e.target.closest && e.target.closest('.aim-target')) return;
    misses++;
    combo = 0;
    updateHud();
  }

  function endGame() {
    running = false;
    clearInterval(tickTimer);
    clearInterval(spawnTimer);
    tickTimer = null;
    spawnTimer = null;
    clearTarget();
    if (arena) arena.removeAttribute('data-aim-wait');
    var total = hits + misses;
    var acc = total ? Math.round((hits / total) * 100) : 0;
    if (overlay) {
      overlay.hidden = false;
      var fs = document.getElementById('aim-final-score');
      var fa = document.getElementById('aim-final-acc');
      var fc = document.getElementById('aim-final-combo');
      if (fs) fs.textContent = score;
      if (fa) fa.textContent = acc + '%';
      if (fc) fc.textContent = maxCombo;
    }
    if (btnStart) {
      btnStart.hidden = false;
      btnStart.textContent = '▶ Otra ronda (30 s)';
    }
    var nameInput = document.getElementById('aim-name');
    var name = (nameInput && nameInput.value.trim()) || localStorage.getItem('lipa_player_name') || 'Jugador';
    name = name.substring(0, 15);
    localStorage.setItem('lipa_player_name', name);
    getBoard().submit(name, score, { accuracy: acc, hits: hits, maxCombo: maxCombo });
    if (getBoard()._save) getBoard()._save();
    if (window.LipaDaily && LipaDaily.bumpStreak) LipaDaily.bumpStreak('lipa_aim_streak');
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('aim-trainer', {
        score: score,
        correct: hits,
        wrong: misses,
        accuracy: hits / Math.max(1, hits + misses),
        sessionComplete: true
      });
    } else if (window.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession('aim-trainer', { score: score });
    }
    var best = parseInt(localStorage.getItem('lipa_aim_best') || '0', 10);
    if (score > best) localStorage.setItem('lipa_aim_best', String(score));
    renderBoard();
  }

  function startGame() {
    if (running) return;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    running = true;
        if (window.LipaBrainPlay && LipaBrainPlay.syncRoundDuration) {
      DURATION = LipaBrainPlay.syncRoundDuration();
    }
timeLeft = DURATION;
    score = 0;
    hits = 0;
    misses = 0;
    combo = 0;
    maxCombo = 0;
    spawnAttempts = 0;
    if (arena) arena.innerHTML = '';
    updateHud();
    function trySpawn(attempt) {
      if (!running) return;
      var box = arenaSize();
      if (box.w >= 80 && box.h >= 80) {
        spawnTarget();
        return;
      }
      if (attempt < 30) {
        requestAnimationFrame(function () { trySpawn(attempt + 1); });
      } else {
        spawnTarget();
      }
    }
    trySpawn(0);
    if (tickTimer) clearInterval(tickTimer);
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
    if (!window.LipaDaily || !LipaDaily.shareResult) return;
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
