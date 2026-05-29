/**
 * Neon Reaction Test — medición de tiempo de reacción (ms)
 */
(function () {
  'use strict';

  var ROUNDS = 5;
  var STORAGE_BEST = 'lipa_reaction_best_ms';
  var STORAGE_STREAK = 'lipa_reaction_streak';
  var board = new LipaDaily.DailyBoard('reaction-test');

  var state = 'idle';
  var round = 0;
  var results = [];
  var greenAt = 0;
  var waitTimer = null;

  var el = {
    wait: document.getElementById('rt-wait'),
    go: document.getElementById('rt-go'),
    tooSoon: document.getElementById('rt-too-soon'),
    result: document.getElementById('rt-result'),
    round: document.getElementById('rt-round'),
    ms: document.getElementById('rt-ms'),
    summary: document.getElementById('rt-summary'),
    best: document.getElementById('rt-best'),
    avg: document.getElementById('rt-avg'),
    streak: document.getElementById('rt-streak'),
    board: document.getElementById('rt-leaderboard'),
    tap: document.getElementById('rt-tap-zone')
  };

  function show(panel) {
    ['wait', 'go', 'tooSoon', 'result', 'summary'].forEach(function (id) {
      var node = el[id];
      if (node) node.hidden = panel !== id;
    });
  }

  function renderBoard() {
    if (!el.board) return;
    var top = board.getTop(5, false);
    if (!top.length) {
      el.board.innerHTML = '<p class="rt-muted">Sé el primero en el ranking de hoy.</p>';
      return;
    }
    el.board.innerHTML = top.map(function (row, i) {
      return '<div class="rt-lb-row"><span>#' + (i + 1) + ' ' + escapeHtml(row.name) + '</span><strong>' + row.score + ' ms</strong></div>';
    }).join('');
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function updateStats() {
    var bestStored = parseInt(localStorage.getItem(STORAGE_BEST) || '9999', 10);
    if (el.best) {
      el.best.textContent = bestStored < 9999 ? bestStored + ' ms' : '—';
    }
    if (el.streak) {
      el.streak.textContent = LipaDaily.getStreak(STORAGE_STREAK) + ' días';
    }
    renderBoard();
  }

  function clearWait() {
    if (waitTimer) {
      clearTimeout(waitTimer);
      waitTimer = null;
    }
  }

  function startRound() {
    clearWait();
    state = 'waiting';
    round++;
    if (el.round) el.round.textContent = 'Intento ' + round + ' / ' + ROUNDS;
    show('wait');
    var delay = 1500 + Math.random() * 2500;
    waitTimer = setTimeout(function () {
      state = 'go';
      greenAt = performance.now();
      show('go');
    }, delay);
  }

  function finishSession() {
    state = 'done';
    show('summary');
    var sum = results.reduce(function (a, b) { return a + b; }, 0);
    var avg = Math.round(sum / results.length);
    var best = Math.min.apply(null, results);
    if (el.avg) el.avg.textContent = avg + ' ms';
    if (el.summary) {
      el.summary.querySelector('[data-best-round]').textContent = best + ' ms';
    }
    var prevBest = parseInt(localStorage.getItem(STORAGE_BEST) || '9999', 10);
    if (best < prevBest) localStorage.setItem(STORAGE_BEST, String(best));
    LipaDaily.bumpStreak(STORAGE_STREAK);
    if (window.LipaBrain && LipaBrain.recordActivityResult) {
      LipaBrain.recordActivityResult('reaction-test', {
        score: avg,
        higherIsBetter: false,
        correct: results.length,
        wrong: 0,
        accuracy: 1,
        sessionComplete: true,
        extra: { best: best }
      });
    } else if (window.LipaDaily.recordSession) {
      LipaDaily.recordSession('reaction-test', { score: avg, higherIsBetter: false });
    }
    var name = localStorage.getItem('lipa_player_name') || '';
    if (!name) {
      name = prompt('Nombre para el ranking de hoy (máx. 15):', 'Jugador') || 'Jugador';
      localStorage.setItem('lipa_player_name', name.substring(0, 15));
    }
    board.submit(name, avg, { best: best, rounds: results });
    board._save();
    updateStats();
  }

  function onTap() {
    if (state === 'idle' || state === 'done') {
      results = [];
      round = 0;
      if (window.LipaAnalytics && LipaAnalytics.trackGameStart) {
        LipaAnalytics.trackGameStart('reaction-test');
      }
      startRound();
      return;
    }
    if (state === 'waiting') {
      clearWait();
      state = 'idle';
      show('tooSoon');
      setTimeout(function () {
        if (round < ROUNDS) startRound();
        else finishSession();
      }, 1200);
      return;
    }
    if (state === 'go') {
      var ms = Math.round(performance.now() - greenAt);
      results.push(ms);
      if (el.ms) el.ms.textContent = ms;
      show('result');
      state = 'idle';
      setTimeout(function () {
        if (round < ROUNDS) startRound();
        else finishSession();
      }, 900);
    }
  }

  function share() {
    var avg = el.avg ? el.avg.textContent : '';
    LipaDaily.shareResult({
      title: 'Neon Reaction Test',
      text: '⚡ Mi tiempo de reacción medio hoy: ' + avg + ' — ¿me superas?',
      url: 'https://lipastudios.com/test-reflejos.html'
    });
  }

  if (el.tap) {
    el.tap.addEventListener('click', onTap);
    el.tap.addEventListener('touchstart', function (e) {
      e.preventDefault();
      onTap();
    }, { passive: false });
  }

  var btnShare = document.getElementById('rt-share');
  var btnAgain = document.getElementById('rt-again');
  if (btnShare) btnShare.addEventListener('click', share);
  if (btnAgain) btnAgain.addEventListener('click', function () {
    state = 'idle';
    results = [];
    round = 0;
    show('wait');
    if (el.round) el.round.textContent = 'Pulsa para empezar';
    if (el.ms) el.ms.textContent = '—';
  });

  show('wait');
  if (el.round) el.round.textContent = 'Pulsa la zona para empezar (5 intentos)';
  updateStats();
})();
