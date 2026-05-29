/**
 * Neon Esquiva — 3 carriles, esquiva obstáculos que caen (30 s)
 */
(function () {
  'use strict';

  var DURATION = 30;
  var board = new LipaDaily.DailyBoard('esquiva-neon');
  var canvas, ctx, W, H, laneW;
  var running = false;
  var timeLeft = DURATION;
  var score = 0;
  var dodged = 0;
  var playerLane = 1;
  var obstacles = [];
  var spawnCD = 0;
  var tickTimer = null;
  var rafId = null;
  var lastTs = 0;

  var timerEl, scoreEl, dodgedEl, overlay, btnStart, btnShare, lbEl;

  function $(id) {
    return document.getElementById(id);
  }

  function init() {
    canvas = $('esquiva-canvas');
    timerEl = $('esquiva-timer');
    scoreEl = $('esquiva-score');
    dodgedEl = $('esquiva-dodged');
    overlay = $('esquiva-overlay');
    btnStart = $('esquiva-start');
    btnShare = $('esquiva-share');
    lbEl = $('esquiva-leaderboard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (btnStart) btnStart.addEventListener('click', startGame);
    if (btnShare) btnShare.addEventListener('click', share);
    $('esquiva-left').addEventListener('click', function () { moveLane(-1); });
    $('esquiva-right').addEventListener('click', function () { moveLane(1); });
    canvas.addEventListener('click', onCanvasTap);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', resize);
    renderBoard();
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
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

  function resize() {
    var box = canvas.parentElement;
    var rect = box.getBoundingClientRect();
    W = canvas.width = Math.max(300, Math.floor(rect.width));
    H = canvas.height = Math.max(320, Math.floor(rect.height));
    laneW = W / 3;
  }

  function moveLane(dir) {
    if (!running) return;
    playerLane = Math.max(0, Math.min(2, playerLane + dir));
  }

  function onCanvasTap(e) {
    if (!running) return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x < rect.width / 2) moveLane(-1);
    else moveLane(1);
  }

  function onKey(e) {
    if (!running) return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      moveLane(-1);
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      moveLane(1);
    }
  }

  function spawnObstacle() {
    var lane = Math.floor(Math.random() * 3);
    obstacles.push({
      lane: lane,
      y: -40,
      w: laneW * 0.55,
      h: 28 + Math.random() * 16
    });
  }

  function laneCenter(lane) {
    return lane * laneW + laneW / 2;
  }

  function update(dt) {
    timeLeft -= dt / 1000;
    score += Math.floor(dt * 0.04);
    spawnCD -= dt;
    if (spawnCD <= 0) {
      spawnObstacle();
      spawnCD = Math.max(500, 1100 - score * 2);
    }

    var playerX = laneCenter(playerLane);
    var playerY = H - 52;
    var pw = laneW * 0.4;
    var ph = 36;

    obstacles.forEach(function (o) {
      o.y += 4 + score * 0.008;
    });

    obstacles = obstacles.filter(function (o) {
      if (o.y > H + 20) {
        dodged++;
        return false;
      }
      var ox = laneCenter(o.lane) - o.w / 2;
      var oy = o.y;
      if (
        playerX - pw / 2 < ox + o.w &&
        playerX + pw / 2 > ox &&
        playerY < oy + o.h &&
        playerY + ph > oy
      ) {
        endGame();
        return false;
      }
      return true;
    });

    if (timerEl) timerEl.textContent = Math.max(0, Math.ceil(timeLeft)) + ' s';
    if (scoreEl) scoreEl.textContent = score;
    if (dodgedEl) dodgedEl.textContent = dodged;
    if (timeLeft <= 0) endGame();
  }

  function draw() {
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (var i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * laneW, 0);
      ctx.lineTo(i * laneW, H);
      ctx.stroke();
    }

    obstacles.forEach(function (o) {
      var x = laneCenter(o.lane) - o.w / 2;
      ctx.fillStyle = '#ff375f';
      ctx.fillRect(x, o.y, o.w, o.h);
    });

    var px = laneCenter(playerLane);
    var py = H - 52;
    var g = ctx.createLinearGradient(px - 20, py, px + 20, py + 36);
    g.addColorStop(0, '#00d4ff');
    g.addColorStop(1, '#30d158');
    ctx.fillStyle = g;
    ctx.fillRect(px - laneW * 0.2, py, laneW * 0.4, 36);
  }

  function loop(ts) {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    var dt = Math.min(32, ts - lastTs);
    lastTs = ts;
    update(dt);
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function endGame() {
    if (!running) return;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    clearInterval(tickTimer);
    score += dodged * 5;
    if (overlay) overlay.hidden = false;
    if (btnStart) btnStart.hidden = false;
    $('esquiva-final-score').textContent = score;
    $('esquiva-final-dodged').textContent = dodged;
    var name = window.prompt('Nombre para el ranking (opcional):', '') || 'Jugador';
    board.submit(name, score, { dodged: dodged });
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('esquiva-neon', {
        score: score,
        correct: dodged,
        wrong: 0,
        accuracy: 0.8,
        sessionComplete: true
      });
    } else if (window.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession('esquiva-neon', { score: score });
    }
    var best = parseInt(localStorage.getItem('lipa_esquiva_best') || '0', 10);
    if (score > best) localStorage.setItem('lipa_esquiva_best', String(score));
    renderBoard();
  }

  function startGame() {
    running = true;
    timeLeft = DURATION;
    score = 0;
    dodged = 0;
    playerLane = 1;
    obstacles = [];
    spawnCD = 300;
    lastTs = 0;
    if (overlay) overlay.hidden = true;
    if (btnStart) btnStart.hidden = true;
    resize();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function share() {
    LipaDaily.shareResult({
      text: '🔀 ' + score + ' pts en Neon Esquiva. ¿Me superas?',
      url: 'https://lipastudios.com/esquiva-neon.html'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
