/**
 * Desafío Verano Neon — misión, sellos, XP, insignias y celebraciones
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'lipa_verano_2026';
  var WEEK_GOAL = 3;
  var XP_MISSION = 25;
  var XP_WEEK = 50;
  var XP_STREAK_BONUS = 10;

  var LEVELS = [
    { min: 0, title: 'Explorador de la piscina', emoji: '🏊' },
    { min: 50, title: 'Rayo veraniego', emoji: '⚡' },
    { min: 120, title: 'Detective de tablas', emoji: '🔍' },
    { min: 220, title: 'Capitán helado', emoji: '🍦' },
    { min: 350, title: 'Ninja de la sombra', emoji: '🌴' },
    { min: 500, title: 'Campeón agosto', emoji: '🏆' },
    { min: 700, title: 'Leyenda Lipi', emoji: '👑' }
  ];

  var BADGES = [
    { id: 'first', emoji: '🌟', name: 'Primer sello', need: function (d) { return d.totalMissions >= 1; } },
    { id: 'three', emoji: '🔥', name: '3 misiones', need: function (d) { return d.totalMissions >= 3; } },
    { id: 'week1', emoji: '📅', name: 'Semana ganada', need: function (d) { return d.weeksWon >= 1; } },
    { id: 'streak3', emoji: '💪', name: 'Racha 3 días', need: function (d) { return d.bestStreak >= 3; } },
    { id: 'streak7', emoji: '🚀', name: 'Racha 7 días', need: function (d) { return d.bestStreak >= 7; } },
    { id: 'xp100', emoji: '💎', name: '100 XP verano', need: function (d) { return d.xp >= 100; } },
    { id: 'xp300', emoji: '🎯', name: '300 XP verano', need: function (d) { return d.xp >= 300; } },
    { id: 'ten', emoji: '🎖️', name: '10 misiones', need: function (d) { return d.totalMissions >= 10; } },
    { id: 'weeks3', emoji: '🏅', name: '3 semanas', need: function (d) { return d.weeksWon >= 3; } },
    { id: 'allgames', emoji: '🎮', name: '5 juegos distintos', need: function (d) { return (d.gamesPlayed || []).length >= 5; } }
  ];

  var CHEERS = [
    '¡BOOM! Otro sello en el pasaporte veraniego.',
    '¡Genial! Tu cerebro sigue en forma de campeón.',
    '¡Misión cumplida! Lipi está orgulloso.',
    '¡Sííí! Mañana habrá otra sorpresa.',
    '¡Lo petaste! +XP veraniega desbloqueada.',
    '¡Campeón! El cole no se olvida solo.',
    '¡Estrella! ¿Helado después del premio?',
    '¡Brutal! Sigue así y subes de rango.'
  ];

  var LIPI_TIPS = [
    '¡Hola! Soy Lipi. Hoy hay misión sorpresa — ¿la aceptas?',
    'Tres sellos por semana y premio arcade. ¡Tú puedes!',
    'No hace falma todos los días. Cuatro libres sin culpa.',
    'Cada misión suma XP veraniega. ¿A qué nivel llegarás?',
    'Desbloquea insignias coleccionando sellos.',
    '¿Semana completa? Ticket para Recreo Neon 🎮'
  ];

  var MISSIONS = [
    { id: 'tablas', emoji: '⚡', title: 'Rayo de tablas', tag: 'Mates', href: '/tablas-relampago.html', lipi: '¡Vence al temporizador! Cada acierto suma un rayo en tu colección.' },
    { id: 'calculo', emoji: '➕', title: 'Cálculo express', tag: 'Mates', href: '/neon-calculo.html', lipi: 'Sumas y restas relámpago. ¿Puedes batir tu racha de ayer?' },
    { id: 'lectura', emoji: '📖', title: 'Mini lectura', tag: 'Lengua', href: '/neon-lectura.html', lipi: 'Lee la frase y acierta la pregunta. Como un cómic, pero en 2 minutos.' },
    { id: 'dictado', emoji: '🔊', title: 'Oído fino', tag: 'Lengua', href: '/neon-dictado.html', lipi: 'Escucha la palabra y elige la correcta. Oreja → pantalla, sin cuaderno.' },
    { id: 'palabras', emoji: '🗣️', title: 'Duelo ES ↔ EN', tag: 'Inglés', href: '/neon-palabras.html', lipi: 'Palabras en 30 segundos. Di una en voz alta en la cena después.' },
    { id: 'silabas', emoji: '🧩', title: 'Sílabas ninja', tag: 'Lengua', href: '/neon-silabas.html', lipi: 'Para peques y 1º–2º: une sílabas como piezas de puzzle.' },
    { id: 'peques', emoji: '🐣', title: 'Misión Neon Peques', tag: 'Infantil', href: '/neon-peques.html', lipi: 'Colores, formas y contar. Lipi guía con pictogramas.' },
    { id: 'fracciones', emoji: '🍕', title: 'Pizza de fracciones', tag: 'Mates', href: '/neon-fracciones.html', lipi: 'Fracciones visuales. ¿Qué parte de la pizza queda?' },
    { id: 'frase', emoji: '✍️', title: 'Frase completa', tag: 'Lengua', href: '/neon-frase.html', lipi: 'Ordena la frase como un puzzle. Ideal para comprensión lectora.' },
    { id: 'curso', emoji: '🎯', title: 'Misión del curso', tag: 'Mix', href: '/cursos.html?empezar=1', lipi: 'El Brain Gym elige la actividad de tu curso real. Pulsa Empezar.' },
    { id: 'reto', emoji: '🧠', title: 'Reto sorpresa', tag: 'Extra', href: '/retos-rapidos.html', lipi: 'Lógica u ortografía en 3 min. Opcional si ya hiciste mates o lengua.' }
  ];

  var DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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
      var d = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (!d.weeks) d.weeks = {};
      if (!d.badges) d.badges = [];
      if (!d.gamesPlayed) d.gamesPlayed = [];
      if (typeof d.xp !== 'number') d.xp = 0;
      if (typeof d.totalMissions !== 'number') d.totalMissions = 0;
      if (typeof d.weeksWon !== 'number') d.weeksWon = 0;
      if (typeof d.bestStreak !== 'number') d.bestStreak = 0;
      if (!d.allStamps) d.allStamps = [];
      return d;
    } catch (e) {
      return { weeks: {}, badges: [], gamesPlayed: [], xp: 0, totalMissions: 0, weeksWon: 0, bestStreak: 0, allStamps: [] };
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function getLevel(xp) {
    var lvl = LEVELS[0];
    for (var i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].min) {
        lvl = LEVELS[i];
        break;
      }
    }
    var next = null;
    for (var j = 0; j < LEVELS.length; j++) {
      if (LEVELS[j].min > xp) {
        next = LEVELS[j];
        break;
      }
    }
    var progress = 100;
    if (next) {
      var span = next.min - lvl.min;
      progress = Math.min(100, Math.round(((xp - lvl.min) / span) * 100));
    }
    return { current: lvl, next: next, progress: progress };
  }

  function computeStreak(allStamps) {
    if (!allStamps || !allStamps.length) return 0;
    var set = {};
    allStamps.forEach(function (s) { set[s] = true; });
    var streak = 0;
    var check = new Date();
    check.setHours(12, 0, 0, 0);
    if (!set[check.toISOString().split('T')[0]]) {
      check.setDate(check.getDate() - 1);
    }
    while (set[check.toISOString().split('T')[0]]) {
      streak++;
      check.setDate(check.getDate() - 1);
    }
    return streak;
  }

  function getTodayMission() {
    var dow = new Date().getDay();
    var courseId = getCourseId();
    var pool = getMissionPool(courseId);
    if (dow === 2) pool = pool.filter(function (m) { return m.tag === 'Mates' || m.id === 'curso'; });
    else if (dow === 4) pool = pool.filter(function (m) { return m.tag === 'Lengua' || m.id === 'curso'; });
    else if (dow === 6) pool = pool.filter(function (m) { return m.tag === 'Inglés' || m.tag === 'Mix' || m.id === 'curso'; });
    if (!pool.length) pool = getMissionPool(courseId);
    if (!pool.length) pool = MISSIONS;
    var idx = seedFromString('verano:' + today() + ':' + (courseId || 'any')) % pool.length;
    return pool[idx];
  }

  function getWeekProgress() {
    var data = loadData();
    var wk = weekId();
    if (!data.weeks[wk]) data.weeks[wk] = { stamps: [], total: 0, won: false };
    return { week: wk, data: data.weeks[wk], all: data };
  }

  function weekCalendarDays(weekStartIso) {
    var days = [];
    var start = new Date(weekStartIso + 'T12:00:00');
    for (var i = 0; i < 7; i++) {
      var d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        iso: d.toISOString().split('T')[0],
        name: DAY_NAMES[d.getDay()],
        isToday: d.toISOString().split('T')[0] === today()
      });
    }
    return days;
  }

  function checkBadges(data) {
    var newly = [];
    BADGES.forEach(function (b) {
      if (data.badges.indexOf(b.id) >= 0) return;
      if (b.need(data)) {
        data.badges.push(b.id);
        newly.push(b);
      }
    });
    return newly;
  }

  function markTodayDone(missionId) {
    var t = today();
    var prog = getWeekProgress();
    var wkData = prog.data;
    if (wkData.stamps.indexOf(t) >= 0) return { already: true, count: wkData.stamps.length };

    wkData.stamps.push(t);
    wkData.total = (wkData.total || 0) + 1;

    var all = prog.all;
    if (all.allStamps.indexOf(t) < 0) all.allStamps.push(t);
    all.totalMissions = (all.totalMissions || 0) + 1;
    all.lastMission = t;
    all.lastMissionId = missionId || getTodayMission().id;

    if (missionId && all.gamesPlayed.indexOf(missionId) < 0) {
      all.gamesPlayed.push(missionId);
    }

    var xpGain = XP_MISSION;
    var streak = computeStreak(all.allStamps);
    if (streak >= 2) xpGain += XP_STREAK_BONUS;
    all.xp = (all.xp || 0) + xpGain;

    var weekJustWon = false;
    if (!wkData.won && wkData.stamps.length >= WEEK_GOAL) {
      wkData.won = true;
      all.weeksWon = (all.weeksWon || 0) + 1;
      all.xp += XP_WEEK;
      xpGain += XP_WEEK;
      weekJustWon = true;
    }

    if (streak > (all.bestStreak || 0)) all.bestStreak = streak;

    all.weeks[prog.week] = wkData;
    var newBadges = checkBadges(all);
    saveData(all);

    return {
      already: false,
      count: wkData.stamps.length,
      xpGain: xpGain,
      streak: streak,
      weekJustWon: weekJustWon,
      newBadges: newBadges,
      level: getLevel(all.xp)
    };
  }

  function isTodayDone() {
    return getWeekProgress().data.stamps.indexOf(today()) >= 0;
  }

  function getKidName() {
    if (!global.LipaBrain) return null;
    var p = LipaBrain.getProfile();
    if (p && p.displayName) {
      var n = String(p.displayName).trim().split(/\s+/)[0];
      if (n && n.length >= 2) return n;
    }
    return null;
  }

  function getCourseId() {
    if (global.LipaBrain && LipaBrain.getProfile) {
      var p = LipaBrain.getProfile();
      if (p && p.courseId) return p.courseId;
    }
    if (global.LipaBrainProfiles && LipaBrainProfiles.getActiveMeta) {
      var meta = LipaBrainProfiles.getActiveMeta();
      if (meta && meta.courseId) return meta.courseId;
    }
    return null;
  }

  function getCourseLabel() {
    if (global.LipaBrain && LipaBrain.getProfile) {
      var prof = LipaBrain.getProfile();
      if (prof && prof.courseLabel) return prof.courseLabel;
    }
    return null;
  }

  function isInfantilCourse(courseId) {
    return courseId && courseId.indexOf('infantil-') === 0;
  }

  function isPrimariaLow(courseId) {
    return courseId === 'primaria-1' || courseId === 'primaria-2';
  }

  function missionForCourse(base, courseId) {
    if (base.id !== 'curso') return base;
    return {
      id: 'curso',
      emoji: base.emoji,
      title: base.title,
      tag: base.tag,
      href: courseId
        ? '/curso.html?c=' + encodeURIComponent(courseId) + '&empezar=1'
        : base.href,
      lipi: courseId
        ? 'Misión de tu curso (' + (getCourseLabel() || courseId) + '). Lipi elige la actividad pendiente.'
        : base.lipi
    };
  }

  function getMissionPool(courseId) {
    return MISSIONS.filter(function (m) {
      if (isInfantilCourse(courseId)) {
        return m.id === 'peques' || m.id === 'silabas' || m.id === 'curso';
      }
      if (isPrimariaLow(courseId)) {
        return m.id !== 'fracciones' && m.id !== 'peques' && m.id !== 'frase';
      }
      if (courseId) {
        return m.id !== 'peques' && m.id !== 'silabas';
      }
      return true;
    }).map(function (m) {
      return missionForCourse(m, courseId);
    });
  }

  function personalize(msg) {
    var name = getKidName();
    if (!name) return msg;
    return '¡' + name + '! ' + msg;
  }

  function celebrate(result, stampEl) {
    if (global.LipaGameFeedback) {
      LipaGameFeedback.confettiLite();
      LipaGameFeedback.floatXp(result.xpGain);
      if (stampEl) LipaGameFeedback.pop(stampEl);
    }
    if (global.LipaMascot) {
      var msg = personalize(CHEERS[seedFromString(today() + 'cheer') % CHEERS.length]);
      if (result.weekJustWon) msg = personalize('¡SEMANA COMPLETA! Ticket Recreo Neon desbloqueado 🎮');
      else if (result.newBadges.length) msg = personalize('Nueva insignia: ' + result.newBadges[0].emoji + ' ' + result.newBadges[0].name);
      LipaMascot.say('complete', msg);
    }
    if (result.newBadges.length) {
      result.newBadges.forEach(function (b, i) {
        setTimeout(function () {
          showToast(b.emoji + ' Insignia: ' + b.name);
        }, 400 + i * 600);
      });
    } else if (result.weekJustWon) {
      showToast('🏆 ¡Semana ganada! +50 XP y ticket arcade');
    }
  }

  function showToast(text) {
    var el = document.getElementById('verano-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'verano-toast';
      el.className = 'verano-toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('verano-toast--show');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () {
      el.classList.remove('verano-toast--show');
    }, 3200);
  }

  function mountLipi() {
    var root = document.getElementById('lipi-mascot-mount');
    if (!root || !global.LipaMascot) return;
    var data = loadData();
    var lvl = getLevel(data.xp || 0);
    var tip = LIPI_TIPS[seedFromString(today() + 'tip') % LIPI_TIPS.length];
    var name = getKidName();
    if (name) tip = '¡Hola, ' + name + '! ' + tip;
    if (data.totalMissions > 0) {
      tip = lvl.current.emoji + ' Eres «' + lvl.current.title + '». ' + tip;
    }
    LipaMascot.render(root, 'welcome', tip);
    var lipi = root.querySelector('.lipi-mascot');
    if (lipi) lipi.classList.add('lipi-mascot--hero');
  }

  function renderBadges(data) {
    return BADGES.map(function (b) {
      var on = data.badges.indexOf(b.id) >= 0;
      return '<div class="verano-badge' + (on ? ' verano-badge--unlocked' : '') + '" title="' + escapeHtml(b.name) + '">' +
        '<span class="verano-badge__icon">' + b.emoji + '</span>' + escapeHtml(b.name) + '</div>';
    }).join('');
  }

  function renderStickerWall(data) {
    if (!data.gamesPlayed || !data.gamesPlayed.length) {
      return '<p style="font-size:0.85rem;color:#a8a29e;text-align:center;margin:0;">Juega misiones para llenar tu álbum 🎨</p>';
    }
    return data.gamesPlayed.map(function (id) {
      var m = MISSIONS.filter(function (x) { return x.id === id; })[0];
      return '<span class="verano-sticker" title="' + escapeHtml(m ? m.title : id) + '">' + (m ? m.emoji : '⭐') + '</span>';
    }).join('');
  }

  function renderCalendar(weekStart, stamps) {
    return weekCalendarDays(weekStart).map(function (day) {
      var done = stamps.indexOf(day.iso) >= 0;
      var cls = 'verano-cal-day' + (day.isToday ? ' verano-cal-day--today' : '') + (done ? ' verano-cal-day--done' : '');
      return '<div class="' + cls + '"><span class="verano-cal-day__emoji">' + (done ? '⭐' : (day.isToday ? '☀️' : '·')) + '</span>' + day.name + '</div>';
    }).join('');
  }

  function render(root) {
    if (!root) return;
    var mission = getTodayMission();
    var prog = getWeekProgress();
    var data = prog.all;
    var count = prog.data.stamps.length;
    var done = isTodayDone();
    var goalMet = count >= WEEK_GOAL || prog.data.won;
    var lvl = getLevel(data.xp || 0);
    var streak = computeStreak(data.allStamps || []);
    var courseLabel = getCourseLabel();

    var stampHtml = '';
    for (var i = 0; i < WEEK_GOAL; i++) {
      stampHtml += '<span class="verano-stamp' + (i < count ? ' verano-stamp--on' : '') + '" aria-hidden="true">' + (i < count ? '⭐' : '○') + '</span>';
    }

    root.innerHTML =
      '<div class="verano-level-bar">' +
        '<div class="verano-level-bar__head">' +
          '<span class="verano-level-bar__rank">' + lvl.current.emoji + ' ' + escapeHtml(lvl.current.title) + '</span>' +
          '<span class="verano-level-bar__xp">' + (data.xp || 0) + ' XP verano' + (lvl.next ? ' · falta ' + (lvl.next.min - (data.xp || 0)) + ' para ' + lvl.next.emoji : ' · ¡MAX!') + '</span>' +
        '</div>' +
        '<div class="verano-level-bar__track" role="progressbar" aria-valuenow="' + lvl.progress + '" aria-valuemin="0" aria-valuemax="100">' +
          '<div class="verano-level-bar__fill" style="width:' + lvl.progress + '%"></div>' +
        '</div>' +
      '</div>' +
      '<div class="verano-stats">' +
        '<div class="verano-stat"><span class="verano-stat__val">' + (data.totalMissions || 0) + '</span><span class="verano-stat__lbl">Misiones</span></div>' +
        '<div class="verano-stat"><span class="verano-stat__val">' + streak + '</span><span class="verano-stat__lbl">Racha días</span></div>' +
        '<div class="verano-stat"><span class="verano-stat__val">' + (data.badges ? data.badges.length : 0) + '/' + BADGES.length + '</span><span class="verano-stat__lbl">Insignias</span></div>' +
      '</div>' +
      '<div class="verano-card verano-card--mission">' +
        '<p class="verano-card__eyebrow">Misión de hoy · ' + escapeHtml(mission.tag) +
          (courseLabel ? ' · ' + escapeHtml(courseLabel) : '') + '</p>' +
        '<p class="verano-card__emoji" aria-hidden="true">' + mission.emoji + '</p>' +
        '<h2 class="verano-card__title">' + escapeHtml(mission.title) + '</h2>' +
        '<p class="verano-card__lipi">Lipi dice: «' + escapeHtml(mission.lipi) + '»</p>' +
        '<p class="verano-card__time">⏱️ ~7 min · +' + XP_MISSION + ' XP al sellar' + (streak >= 1 ? ' (+ bonus racha)' : '') + '</p>' +
        '<a class="verano-btn verano-btn--play" href="' + escapeHtml(mission.href) + '">▶ Jugar ahora</a>' +
        '<button type="button" class="verano-btn verano-btn--done' + (done ? ' verano-btn--done-yes' : '') + '" id="verano-mark-done">' +
          (done ? '✓ ¡Sellado hoy! (+' + XP_MISSION + ' XP)' : '⭐ Marcar como hecho (+' + XP_MISSION + ' XP)') +
        '</button>' +
      '</div>' +
      '<div class="verano-card verano-card--week">' +
        '<h3>Tu semana veraniega</h3>' +
        '<p class="verano-week__goal">Meta: <strong>3 sellos</strong> = +50 XP y ticket arcade</p>' +
        '<div class="verano-calendar" aria-label="Calendario semanal">' + renderCalendar(prog.week, prog.data.stamps) + '</div>' +
        '<div class="verano-stamps" role="img" aria-label="' + count + ' de ' + WEEK_GOAL + ' sellos">' + stampHtml + '</div>' +
        (goalMet ?
          '<div class="verano-ticket">' +
            '<p class="verano-ticket__label">🎟️ Ticket desbloqueado</p>' +
            '<p>¡Semana conseguida! Premio: <strong>5 min de Recreo Neon</strong> (Stack Tower, reflejos…).</p>' +
            '<a href="/recreo-neon.html">🎮 Canjear en Recreo Neon</a>' +
          '</div>' :
          '<p class="verano-week__count">' + count + ' / ' + WEEK_GOAL + ' sellos · faltan ' + Math.max(0, WEEK_GOAL - count) + ' para el ticket</p>') +
      '</div>' +
      '<div class="verano-card verano-card--badges">' +
        '<h3>🏅 Insignias veraniegas</h3>' +
        '<p style="font-size:0.85rem;color:#78716c;text-align:center;margin:0 0 0.5rem;">Desbloquea coleccionando misiones y rachas</p>' +
        '<div class="verano-badges">' + renderBadges(data) + '</div>' +
        '<h3 style="margin-top:1.25rem;text-align:center;">🎨 Álbum de stickers</h3>' +
        '<div class="verano-sticker-wall">' + renderStickerWall(data) + '</div>' +
      '</div>';

    var btn = root.querySelector('#verano-mark-done');
    if (btn && !done) {
      btn.addEventListener('click', function () {
        var result = markTodayDone(mission.id);
        if (result.already) return;
        render(root);
        var stamps = root.querySelectorAll('.verano-stamp--on');
        var lastStamp = stamps[stamps.length - 1];
        if (lastStamp) lastStamp.classList.add('verano-stamp--pop');
        celebrate(result, lastStamp);
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
    getWeekProgress: getWeekProgress,
    getLevel: getLevel,
    LEVELS: LEVELS,
    BADGES: BADGES
  };

  document.addEventListener('DOMContentLoaded', function () {
    mountLipi();
    var mount = document.getElementById('verano-challenge-mount');
    if (mount) render(mount);
  });

  document.addEventListener('lipa-profile-changed', function () {
    mountLipi();
    var mount = document.getElementById('verano-challenge-mount');
    if (mount) render(mount);
  });
})(typeof window !== 'undefined' ? window : this);
