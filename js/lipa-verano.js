/**
 * Desafío Verano Neon — misión del día + sellos semanales (localStorage)
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'lipa_verano_2026';
  var WEEK_GOAL = 3;

  var MISSIONS = [
    { id: 'tablas', emoji: '⚡', title: 'Rayo de tablas', tag: 'Mates', href: '/tablas-relampago.html', lipi: '¡Vence al temporizador! Cada acierto suma un rayo en tu colección.' },
    { id: 'calculo', emoji: '➕', title: 'Cálculo express', tag: 'Mates', href: '/neon-calculo.html', lipi: 'Sumas y restas relámpago. ¿Puedes batir tu racha de ayer?' },
    { id: 'lectura', emoji: '📖', title: 'Mini lectura', tag: 'Lengua', href: '/neon-lectura.html', lipi: 'Lee la frase y acierta la pregunta. Como un cómic, pero en 2 minutos.' },
    { id: 'dictado', emoji: '🔊', title: 'Oído fino', tag: 'Lengua', href: '/neon-dictado.html', lipi: 'Escucha la palabra y elige la correcta. Oreja → pantalla, sin cuaderno.' },
    { id: 'palabras', emoji: '🗣️', title: 'Duelo ES ↔ EN', tag: 'Inglés', href: '/neon-palabras.html', lipi: 'Palabras en 30 segundos. Di una en voz alta en la cena después.' },
    { id: 'silabas', emoji: '🧩', title: 'Sílabas ninja', tag: 'Lengua', href: '/neon-silabas.html', lipi: 'Para peques y 1º–2º: une sílabas como piezas de puzzle.' },
    { id: 'peques', emoji: '🐣', title: 'Misión Neon Peques', tag: 'Infantil', href: '/neon-peques.html', lipi: 'Colores, formas y contar. Lipi guía con pictogramas.' },
    { id: 'fracciones', emoji: '🍕', title: 'Pizza de fracciones', tag: 'Mates', href: '/neon-fracciones.html', lipi: 'Fracciones visuales. ¿Qué parte de la pizza queda?' },
    { id: 'curso', emoji: '🎯', title: 'Misión del curso', tag: 'Mix', href: '/cursos.html?empezar=1', lipi: 'El Brain Gym elige la actividad de tu curso real. Pulsa Empezar.' },
    { id: 'reto', emoji: '🧠', title: 'Reto sorpresa', tag: 'Extra', href: '/retos-rapidos.html', lipi: 'Lógica u ortografía en 3 min. Opcional si ya hiciste mates o lengua.' }
  ];

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function weekId(d) {
    d = d || new Date();
    var th = new Date(d);
    th.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return th.toISOString().split('T')[0];
  }

  function seedFromString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function loadData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function getTodayMission() {
    var dow = new Date().getDay();
    var pool = MISSIONS.slice();
    if (dow === 2) pool = pool.filter(function (m) { return m.tag === 'Mates' || m.id === 'curso'; });
    else if (dow === 4) pool = pool.filter(function (m) { return m.tag === 'Lengua' || m.id === 'curso'; });
    else if (dow === 6) pool = pool.filter(function (m) { return m.tag === 'Inglés' || m.tag === 'Mix' || m.id === 'curso'; });
    if (!pool.length) pool = MISSIONS;
    var idx = seedFromString('verano:' + today()) % pool.length;
    return pool[idx];
  }

  function getWeekProgress() {
    var data = loadData();
    var wk = weekId();
    if (!data.weeks) data.weeks = {};
    if (!data.weeks[wk]) data.weeks[wk] = { stamps: [], total: 0 };
    return { week: wk, data: data.weeks[wk], all: data };
  }

  function markTodayDone() {
    var t = today();
    var prog = getWeekProgress();
    var wkData = prog.data;
    if (wkData.stamps.indexOf(t) >= 0) return wkData.stamps.length;
    wkData.stamps.push(t);
    wkData.total = (wkData.total || 0) + 1;
    var all = prog.all;
    all.weeks[prog.week] = wkData;
    all.lastMission = t;
    saveData(all);
    return wkData.stamps.length;
  }

  function isTodayDone() {
    var wkData = getWeekProgress().data;
    return wkData.stamps.indexOf(today()) >= 0;
  }

  function render(root) {
    if (!root) return;
    var mission = getTodayMission();
    var prog = getWeekProgress();
    var count = prog.data.stamps.length;
    var done = isTodayDone();
    var goalMet = count >= WEEK_GOAL;

    var stampHtml = '';
    for (var i = 0; i < WEEK_GOAL; i++) {
      stampHtml += '<span class="verano-stamp' + (i < count ? ' verano-stamp--on' : '') + '" aria-hidden="true">' + (i < count ? '⭐' : '○') + '</span>';
    }

    root.innerHTML =
      '<div class="verano-card verano-card--mission">' +
        '<p class="verano-card__eyebrow">Misión de hoy · ' + escapeHtml(mission.tag) + '</p>' +
        '<p class="verano-card__emoji" aria-hidden="true">' + mission.emoji + '</p>' +
        '<h2 class="verano-card__title">' + escapeHtml(mission.title) + '</h2>' +
        '<p class="verano-card__lipi">Lipi dice: «' + escapeHtml(mission.lipi) + '»</p>' +
        '<p class="verano-card__time">⏱️ Unos 7 minutos · sin deberes largos</p>' +
        '<a class="verano-btn verano-btn--play" href="' + escapeHtml(mission.href) + '">▶ Jugar ahora</a>' +
        '<button type="button" class="verano-btn verano-btn--done' + (done ? ' verano-btn--done-yes' : '') + '" id="verano-mark-done">' +
          (done ? '✓ ¡Sellado hoy!' : '⭐ Marcar como hecho') +
        '</button>' +
      '</div>' +
      '<div class="verano-card verano-card--week">' +
        '<h3>Tu semana veraniega</h3>' +
        '<p class="verano-week__goal">Meta: <strong>3 sellos</strong> esta semana (4 días libres sin culpa)</p>' +
        '<div class="verano-stamps" role="img" aria-label="' + count + ' de ' + WEEK_GOAL + ' sellos">' + stampHtml + '</div>' +
        (goalMet ? '<p class="verano-week__win">🏆 ¡Semana conseguida! Premio opcional: <a href="/recreo-neon.html">Recreo Neon</a> 5 min.</p>' : '') +
        '<p class="verano-week__count">' + count + ' / ' + WEEK_GOAL + ' sellos · semana del ' + formatDate(prog.week) + '</p>' +
      '</div>';

    var btn = root.querySelector('#verano-mark-done');
    if (btn && !done) {
      btn.addEventListener('click', function () {
        markTodayDone();
        render(root);
      });
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    try {
      var p = iso.split('-');
      return p[2] + '/' + p[1];
    } catch (e) {
      return iso;
    }
  }

  global.LipaVerano = {
    render: render,
    getTodayMission: getTodayMission,
    markTodayDone: markTodayDone,
    getWeekProgress: getWeekProgress
  };

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('verano-challenge-mount');
    if (mount) render(mount);
  });
})(typeof window !== 'undefined' ? window : this);
