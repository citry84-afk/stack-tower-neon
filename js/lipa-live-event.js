/**
 * Evento Lipi en vivo — sábados 11:00 y martes 18:00 (hora España).
 * Reto relámpago de 5 preguntas → sobre épico + XP.
 */
(function (global) {
  'use strict';

  var EVENTS = [
    { day: 6, hour: 11, minute: 0, durationMin: 60, name: 'Sábado Neon' },
    { day: 2, hour: 18, minute: 0, durationMin: 60, name: 'Martes Lipi Live' }
  ];

  var CHALLENGES = [
    { q: '12 × 5 = ?', choices: ['50', '60', '55', '65'], a: 1 },
    { q: '¿Capital de Francia?', choices: ['Lyon', 'París', 'Marsella', 'Niza'], a: 1 },
    { q: 'She ___ happy.', choices: ['is', 'are', 'am', 'be'], a: 0 },
    { q: '¿Cuántos lados tiene un triángulo?', choices: ['2', '3', '4', '5'], a: 1 },
    { q: '¿Planeta rojo?', choices: ['Venus', 'Marte', 'Júpiter', 'Saturno'], a: 1 },
    { q: '100 − 28 = ?', choices: ['62', '72', '82', '68'], a: 1 },
    { q: '¿Sinónimo de «feliz»?', choices: ['Triste', 'Contento', 'Lento', 'Frío'], a: 1 },
    { q: 'Dog en español es…', choices: ['Gato', 'Perro', 'Pájaro', 'Pez'], a: 1 },
    { q: '¿Órgano que bombea sangre?', choices: ['Pulmón', 'Corazón', 'Hígado', 'Cerebro'], a: 1 },
    { q: '7 × 8 = ?', choices: ['54', '56', '58', '64'], a: 1 }
  ];

  function weekKey() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    var day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var w = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return d.getFullYear() + '-W' + w;
  }

  function madridNow() {
    try {
      return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    } catch (e) {
      return new Date();
    }
  }

  function eventWindows(from) {
    var windows = [];
    for (var offset = -1; offset < 14; offset++) {
      var d = new Date(from);
      d.setDate(d.getDate() + offset);
      var dow = d.getDay();
      EVENTS.forEach(function (ev) {
        if (ev.day !== dow) return;
        var start = new Date(d);
        start.setHours(ev.hour, ev.minute, 0, 0);
        var end = new Date(start.getTime() + ev.durationMin * 60000);
        windows.push({ ev: ev, start: start, end: end });
      });
    }
    windows.sort(function (a, b) { return a.start - b.start; });
    return windows;
  }

  function getLiveEvent() {
    try {
      if (global.location.search.indexOf('evento=test') >= 0 || global.location.search.indexOf('evento=live') >= 0) {
        return {
          ev: { name: 'Modo prueba Lipi Live', day: 0, hour: 0, minute: 0, durationMin: 999 },
          start: new Date(Date.now() - 60000),
          end: new Date(Date.now() + 3600000)
        };
      }
    } catch (e) { /* ignore */ }
    var now = madridNow();
    var wins = eventWindows(now);
    for (var i = 0; i < wins.length; i++) {
      if (now >= wins[i].start && now < wins[i].end) return wins[i];
    }
    return null;
  }

  function nextEvent(from) {
    var now = from || madridNow();
    var wins = eventWindows(now);
    for (var j = 0; j < wins.length; j++) {
      if (wins[j].start > now) return wins[j];
    }
    var later = new Date(now);
    later.setDate(later.getDate() + 7);
    return eventWindows(later)[0] || null;
  }

  function isLive() {
    return !!getLiveEvent();
  }

  function formatCountdown(ms) {
    if (ms <= 0) return '00:00:00';
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    s -= h * 3600;
    var m = Math.floor(s / 60);
    s -= m * 60;
    return [h, m, s].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function alreadyWonThisWeek() {
    if (!global.LipaCards) return false;
    var st = LipaCards.getState();
    return !!(st.grants && st.grants['live-' + weekKey()]);
  }

  function grantReward() {
    if (global.LipaCards) {
      LipaCards.grantPack('epico', 'live-' + weekKey());
    }
    if (global.LipaBrain && LipaBrain.addXp) {
      LipaBrain.addXp(50);
    }
    if (global.LipaGlobalTower && LipaGlobalTower.addBlocks) {
      LipaGlobalTower.addBlocks(5);
    }
  }

  function mountBanner(root) {
    if (!root) return;
    var live = getLiveEvent();
    var now = madridNow();
    var n = nextEvent(now);
    if (!n) {
      root.innerHTML = '';
      root.hidden = true;
      return;
    }
    var msToStart = n.start - now;
    var showSoon = msToStart > 0 && msToStart < 86400000;

    if (!live && !showSoon) {
      root.innerHTML = '';
      root.hidden = true;
      return;
    }

    root.hidden = false;
    if (live) {
      root.className = 'lipa-live-banner lipa-live-banner--live';
      root.innerHTML =
        '<div class="lipa-live-banner__inner">' +
        '<div><span class="lipa-live-banner__badge lipa-live-banner__badge--on">En directo</span>' +
        '<p class="lipa-live-banner__title">' + esc(live.ev.name) + ' · Lipi te reta</p>' +
        '<p class="lipa-live-banner__sub">5 preguntas relámpago · Sobre épico para quien termine</p></div>' +
        '<a href="/evento-neon.html" class="lipa-live-banner__cta">🔴 Entrar ahora</a></div>';
      return;
    }

    root.className = 'lipa-live-banner';
    root.innerHTML =
      '<div class="lipa-live-banner__inner">' +
      '<div><span class="lipa-live-banner__badge">Próximo evento</span>' +
      '<p class="lipa-live-banner__title">' + esc(n.ev.name) + '</p>' +
      '<p class="lipa-live-banner__sub">Empieza en <span class="lipa-live-banner__countdown" id="live-countdown">' + formatCountdown(msToStart) + '</span></p></div>' +
      '<a href="/evento-neon.html" class="lipa-live-banner__cta">Ver evento</a></div>';

    var cdEl = root.querySelector('#live-countdown');
    if (cdEl) {
      var tick = setInterval(function () {
        var t = n.start - madridNow();
        if (t <= 0) {
          clearInterval(tick);
          mountBanner(root);
          return;
        }
        cdEl.textContent = formatCountdown(t);
      }, 1000);
    }
  }

  function pickQuestions() {
    var pool = CHALLENGES.slice();
    var out = [];
    while (out.length < 5 && pool.length) {
      var i = Math.floor(Math.random() * pool.length);
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }

  function runEventPage(root) {
    var live = getLiveEvent();
    var won = alreadyWonThisWeek();

    if (!live) {
      var n = nextEvent(madridNow());
      root.innerHTML =
        '<div class="evento-main">' +
        '<h1>Evento Lipi en vivo</h1>' +
        '<p style="color:#9fb0d8;line-height:1.6;">Los eventos son <strong>sábados 11:00</strong> y <strong>martes 18:00</strong> (hora España).</p>' +
        '<p class="lipa-live-banner__countdown" style="margin:1rem 0;">Próximo: ' + esc(n.ev.name) + ' en ' + formatCountdown(n.start - madridNow()) + '</p>' +
        (won ? '<p>✅ Ya completaste el reto de esta semana. ¡Vuelve al próximo!</p>' : '') +
        '<a href="/" class="lipa-live-banner__cta" style="display:inline-block;margin-top:1rem;">Volver al inicio</a></div>';
      return;
    }

    if (won) {
      root.innerHTML =
        '<div class="evento-main">' +
        '<span class="evento-live-dot">🔴 EN DIRECTO</span>' +
        '<h1>¡Ya lo lograste esta semana!</h1>' +
        '<p style="color:#9fb0d8;">Tu sobre épico te espera en el álbum. El próximo evento trae otra oportunidad.</p>' +
        '<a href="/coleccion.html" class="lipa-live-banner__cta" style="display:inline-block;margin-top:1rem;">🃏 Abrir sobres</a></div>';
      return;
    }

    var questions = pickQuestions();
    var idx = 0;
    var correct = 0;
    var timeLeft = 45;

    function renderQ() {
      var q = questions[idx];
      var pct = Math.round((idx / questions.length) * 100);
      root.innerHTML =
        '<div class="evento-main">' +
        '<span class="evento-live-dot">🔴 EN DIRECTO · ' + esc(live.ev.name) + '</span>' +
        '<div class="evento-timer" id="evento-timer" aria-live="polite">' + timeLeft + 's</div>' +
        '<div class="evento-arena">' +
        '<div class="evento-progress"><div class="evento-progress__fill" style="width:' + pct + '%"></div></div>' +
        '<p style="text-align:center;font-weight:800;margin:0 0 1rem;">Pregunta ' + (idx + 1) + ' / ' + questions.length + '</p>' +
        '<p style="font-size:1.15rem;font-weight:800;text-align:center;margin:0 0 1rem;">' + esc(q.q) + '</p>' +
        '<div class="jefe-choices">' +
        q.choices.map(function (c, i) {
          return '<button type="button" class="jefe-choice" data-i="' + i + '">' + esc(c) + '</button>';
        }).join('') +
        '</div></div></div>';

      root.querySelectorAll('.jefe-choice').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var picked = parseInt(btn.getAttribute('data-i'), 10);
          if (picked === q.a) correct++;
          idx++;
          if (idx >= questions.length) {
            finishEvent(correct >= 3);
          } else {
            renderQ();
          }
        });
      });
    }

    function finishEvent(wonGame) {
      clearInterval(timerId);
      if (wonGame) {
        grantReward();
        if (global.LipaGameFeedback && LipaGameFeedback.confettiLite) {
          try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
        }
        root.innerHTML =
          '<div class="evento-main">' +
          '<h1>🏆 ¡Evento completado!</h1>' +
          '<p style="color:#2ed3a6;font-weight:800;">+' + correct + '/' + questions.length + ' aciertos · +50 XP · Sobre épico</p>' +
          '<a href="/coleccion.html" class="lipa-live-banner__cta" style="display:inline-block;margin:1rem 0;">🎁 Abrir sobre ahora</a>' +
          '<br><a href="/" style="color:#9fb0d8;">Inicio</a></div>';
        if (global.LipaPackCeremony && global.LipaCards && LipaCards.pendingPacks().length) {
          setTimeout(function () {
            LipaPackCeremony.startNextPending();
          }, 800);
        }
      } else {
        root.innerHTML =
          '<div class="evento-main">' +
          '<h1>Casi…</h1>' +
          '<p style="color:#9fb0d8;">Necesitabas 3 aciertos. Lipi te espera en el próximo evento.</p>' +
          '<a href="/" class="lipa-live-banner__cta" style="display:inline-block;margin-top:1rem;">Seguir entrenando</a></div>';
      }
    }

    var timerId = setInterval(function () {
      timeLeft--;
      var el = document.getElementById('evento-timer');
      if (el) el.textContent = timeLeft + 's';
      if (timeLeft <= 0) finishEvent(correct >= 3);
    }, 1000);

    renderQ();
  }

  global.LipaLiveEvent = {
    isLive: isLive,
    getLiveEvent: getLiveEvent,
    nextEvent: nextEvent,
    mountBanner: mountBanner,
    runEventPage: runEventPage,
    grantReward: grantReward
  };

  document.addEventListener('DOMContentLoaded', function () {
    mountBanner(document.getElementById('lipa-live-banner'));
    var app = document.getElementById('evento-app');
    if (app) runEventPage(app);
  });
})(typeof window !== 'undefined' ? window : global);
