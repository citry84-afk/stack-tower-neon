/**
 * Informe para padres — progreso semanal, materias y recomendaciones (PDF fase 3)
 */
(function (global) {
  'use strict';

  var SKILL_LABELS = {
    'b-v': 'Ortografía B/V',
    'tildes': 'Tildes',
    'h': 'Hache',
    'g-j': 'G/J',
    'signos': 'Signos de puntuación',
    'series-pares': 'Series y patrones',
    'patrones': 'Patrones',
    'analogias': 'Analogías',
    'geografia': 'Geografía',
    'ciencias': 'Ciencias',
    'animales': 'Naturaleza',
    'medioambiente': 'Medio ambiente',
    'planetas': 'Espacio',
    general: 'General',
    'seguridad-online': 'Seguridad online',
    privacidad: 'Privacidad digital',
    phishing: 'Phishing',
    estafas: 'Estafas online',
    'huella-digital': 'Huella digital',
    cyberacoso: 'Cyberacoso',
    paga: 'Paga y mesada',
    ahorro: 'Ahorro',
    'necesidad-deseo': 'Necesidad vs deseo',
    presupuesto: 'Presupuesto',
    interes: 'Interés básico'
  };

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function skillLabel(tag) {
    return SKILL_LABELS[tag] || tag.replace(/-/g, ' ');
  }

  function last7DayKeys() {
    var keys = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      keys.push(d.toISOString().split('T')[0]);
    }
    return keys;
  }

  function countDaysTrained(byDay, keys) {
    var n = 0;
    keys.forEach(function (k) {
      if (byDay[k] && byDay[k] > 0) n++;
    });
    return n;
  }

  function getCurriculumSubjects(courseId) {
    if (!global.LipaCurriculum || !courseId) return [];
    LipaCurriculum.init();
    var course = LipaCurriculum.getCourse(courseId);
    if (!course) return [];

    var schoolIds = LipaCurriculum.schoolSubjectIds();
    var rows = [];

    course.subjects.forEach(function (block) {
      if (schoolIds.indexOf(block.subjectId) < 0) return;
      var sub = LipaCurriculum.enrichSubject(course, block);
      var sp = LipaCurriculum.subjectProgress(sub);
      if (!sp.total) return;
      rows.push({
        subjectId: block.subjectId,
        label: sub.label,
        emoji: sub.emoji,
        done: sp.done,
        total: sp.total,
        percent: sp.percent
      });
    });

    rows.sort(function (a, b) { return a.percent - b.percent; });
    return rows;
  }

  function getQuickTestSummary() {
    if (!global.LipaQuickTests) return { played: [], weakSkills: [] };
    var played = [];
    var weak = {};
    try {
      var raw = localStorage.getItem('lipa-quick-tests-v1');
      var p = raw ? JSON.parse(raw) : {};
      LipaQuickTests.getCategories().forEach(function (cat) {
        var e = p[cat.id];
        if (!e || !e.attempts) return;
        played.push({
          id: cat.id,
          label: cat.shortLabel,
          emoji: cat.emoji,
          bestPercent: e.bestPercent || 0,
          lastScore: e.lastScore || '—',
          lastPlayed: e.lastPlayed
        });
        (e.lastWrongSkills || []).forEach(function (tag) {
          weak[tag] = (weak[tag] || 0) + 1;
        });
      });
    } catch (err) { /* ignore */ }

    var weakSkills = Object.keys(weak)
      .map(function (tag) { return { tag: tag, count: weak[tag], label: skillLabel(tag) }; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 5);

    return { played: played, weakSkills: weakSkills };
  }

  function buildRecommendations(ctx) {
    var tips = [];
    if (!ctx.hasProfile) {
      tips.push({
        emoji: '🎯',
        text: 'Configura el curso del niño/a en la rutina (5 minutos) para ver un informe más preciso.',
        href: '/mi-rutina-cerebro.html',
        cta: 'Configurar rutina'
      });
      return tips;
    }
    if (ctx.daysTrainedWeek === 0) {
      tips.push({
        emoji: '☀️',
        text: 'Esta semana aún no hay entrenos registrados. Los 7 minutos diarios marcan la mayor diferencia.',
        href: '/',
        cta: 'Empezar hoy'
      });
    } else if (ctx.daysTrainedWeek < 3) {
      tips.push({
        emoji: '📅',
        text: 'Lleva ' + ctx.daysTrainedWeek + ' día' + (ctx.daysTrainedWeek === 1 ? '' : 's') + ' de entreno esta semana. Objetivo amable: 3–5 días.',
        href: '/mi-rutina-cerebro.html',
        cta: 'Ver rutina'
      });
    }
    if (ctx.weakestSubject && ctx.weakestSubject.percent < 60) {
      tips.push({
        emoji: ctx.weakestSubject.emoji,
        text: 'Reforzar ' + ctx.weakestSubject.label + ': ' + ctx.weakestSubject.done + ' de ' + ctx.weakestSubject.total + ' actividades del curso.',
        href: ctx.weakestSubject.href,
        cta: 'Practicar ' + ctx.weakestSubject.label
      });
    }
    if (ctx.quickTests.played.length === 0) {
      tips.push({
        emoji: '🧩',
        text: 'Probar un reto rápido (lógica u ortografía) añade variedad sin presión — 3 a 5 minutos.',
        href: '/retos-rapidos.html',
        cta: 'Retos rápidos'
      });
    }
    if (ctx.quickTests.weakSkills.length) {
      var w = ctx.quickTests.weakSkills[0];
      tips.push({
        emoji: '✏️',
        text: 'En el último reto rápido conviene repasar: ' + w.label + '.',
        href: '/retos-rapidos.html',
        cta: 'Repasar'
      });
    }
    if (!tips.length) {
      tips.push({
        emoji: '🌟',
        text: '¡Buen ritmo! Sigue con la rutina de ' + (ctx.routineMinutes || 7) + ' min y repasa lo del cole antes de exámenes.',
        href: '/cursos.html',
        cta: 'Ver curso'
      });
    }
    return tips.slice(0, 4);
  }

  function buildReport() {
    var profile = global.LipaBrain && LipaBrain.getProfile ? LipaBrain.getProfile() : null;
    var stats = global.LipaBrain && LipaBrain.getStats ? LipaBrain.getStats() : { byDay: {}, weekSessions: 0, streak: 0, xp: 0 };
    var weekKeys = last7DayKeys();
    var daysTrainedWeek = countDaysTrained(stats.byDay || {}, weekKeys);
    var courseId = profile && profile.courseId;
    var subjects = getCurriculumSubjects(courseId);
    var courseProg = null;
    var courseLabel = null;

    if (courseId && global.LipaCurriculum) {
      LipaCurriculum.init();
      var course = LipaCurriculum.getCourse(courseId);
      if (course) {
        courseLabel = course.label;
        courseProg = LipaCurriculum.courseProgress(course);
      }
    }

    var weakest = null;
    if (subjects.length) {
      weakest = subjects[0];
      weakest.href = '/materia.html?c=' + encodeURIComponent(courseId) + '&m=' + encodeURIComponent(weakest.subjectId);
    }

    var quickTests = getQuickTestSummary();
    var childName = (profile && profile.displayName) ? profile.displayName.split(' ')[0] : 'Tu hijo/a';
    if (global.LipaBrainProfiles) {
      var meta = LipaBrainProfiles.getActiveMeta();
      if (meta && meta.name && !profile) childName = meta.name.split(' ')[0];
    }

    var ctx = {
      hasProfile: !!profile,
      childName: childName,
      courseLabel: courseLabel,
      courseId: courseId,
      coursePercent: courseProg ? courseProg.percent : 0,
      courseDone: courseProg ? courseProg.done : 0,
      courseTotal: courseProg ? courseProg.total : 0,
      routineMinutes: profile ? profile.minutes : 7,
      subjects: subjects,
      weakestSubject: weakest,
      daysTrainedWeek: daysTrainedWeek,
      weekSessions: stats.weekSessions || 0,
      streak: stats.streak || 0,
      xp: stats.xp || 0,
      weekKeys: weekKeys,
      byDay: stats.byDay || {},
      quickTests: quickTests
    };

    ctx.recommendations = buildRecommendations(ctx);
    return ctx;
  }

  function render(root) {
    if (!root) return;
    var r = buildReport();

    if (!r.hasProfile && !r.weekSessions) {
      root.innerHTML =
        '<div class="parent-dash-empty">' +
        '<p>Aún no hay datos de entrenamiento en este dispositivo.</p>' +
        '<p>Cuando el niño o la niña use Brain Gym, aquí verás días entrenados, materias y consejos.</p>' +
        '<a href="/" class="lipa-btn lipa-btn--primary">Empezar Brain Gym</a></div>';
      return;
    }

    var weekBars = r.weekKeys.map(function (key) {
      var count = r.byDay[key] || 0;
      var max = 1;
      r.weekKeys.forEach(function (k) {
        if ((r.byDay[k] || 0) > max) max = r.byDay[k] || 0;
      });
      var h = Math.round((count / Math.max(max, 1)) * 48) + 6;
      var d = new Date(key + 'T12:00:00');
      var label = d.toLocaleDateString('es-ES', { weekday: 'short' });
      var trained = count > 0;
      return (
        '<div class="parent-dash-day' + (trained ? ' parent-dash-day--on' : '') + '" title="' + esc(key) + '">' +
        '<div class="parent-dash-day__bar" style="height:' + h + 'px"></div>' +
        '<span class="parent-dash-day__lbl">' + esc(label) + '</span></div>'
      );
    }).join('');

    var subjectRows = r.subjects.length
      ? r.subjects.map(function (s) {
          return (
            '<li class="parent-dash-subject">' +
            '<span class="parent-dash-subject__emoji">' + s.emoji + '</span>' +
            '<span class="parent-dash-subject__body"><strong>' + esc(s.label) + '</strong>' +
            '<span>' + s.done + '/' + s.total + ' actividades</span></span>' +
            '<span class="parent-dash-subject__pct">' + s.percent + '%</span></li>'
          );
        }).join('')
      : '<li class="parent-dash-muted">Configura un curso en la rutina para ver progreso por materia.</li>';

    var qtRows = r.quickTests.played.length
      ? r.quickTests.played.map(function (q) {
          return (
            '<li><span>' + q.emoji + ' ' + esc(q.label) + '</span>' +
            '<span>Mejor ' + q.bestPercent + '% · ' + esc(q.lastScore) + '</span></li>'
          );
        }).join('')
      : '<li class="parent-dash-muted">Aún no ha hecho retos rápidos (lógica, ortografía, cultura).</li>';

    var recHtml = r.recommendations.map(function (tip) {
      return (
        '<div class="parent-dash-tip">' +
        '<span class="parent-dash-tip__emoji">' + tip.emoji + '</span>' +
        '<p>' + esc(tip.text) + '</p>' +
        (tip.href ? '<a href="' + esc(tip.href) + '" class="parent-dash-tip__cta">' + esc(tip.cta) + ' →</a>' : '') +
        '</div>'
      );
    }).join('');

    var courseLine = r.courseLabel
      ? '<p class="parent-dash-course">' + esc(r.courseLabel) + ' · ' + r.coursePercent + '% del curso (' + r.courseDone + '/' + r.courseTotal + ')</p>'
      : '';

    root.innerHTML =
      '<div class="parent-dash-summary">' +
      '<p class="parent-dash-greet">Informe de <strong>' + esc(r.childName) + '</strong></p>' +
      courseLine +
      '<div class="parent-dash-kpis">' +
      '<div class="parent-dash-kpi"><strong>' + r.daysTrainedWeek + '/7</strong><span>días con entreno</span></div>' +
      '<div class="parent-dash-kpi"><strong>' + r.weekSessions + '</strong><span>sesiones semana</span></div>' +
      '<div class="parent-dash-kpi"><strong>' + r.streak + '</strong><span>racha (días)</span></div>' +
      '<div class="parent-dash-kpi"><strong>' + r.xp + '</strong><span>XP total</span></div>' +
      '</div></div>' +

      '<section class="parent-dash-section"><h2>Esta semana</h2>' +
      '<div class="parent-dash-chart" role="img" aria-label="Días entrenados">' + weekBars + '</div></section>' +

      '<section class="parent-dash-section"><h2>Materias del cole</h2>' +
      '<ul class="parent-dash-list">' + subjectRows + '</ul></section>' +

      '<section class="parent-dash-section"><h2>Retos rápidos</h2>' +
      '<ul class="parent-dash-list parent-dash-list--compact">' + qtRows + '</ul></section>' +

      '<section class="parent-dash-section"><h2>Recomendaciones</h2>' +
      '<div class="parent-dash-tips">' + recHtml + '</div></section>' +

      '<p class="parent-dash-foot">Datos guardados solo en este dispositivo · sin cuenta. ' +
      '<a href="/mi-evolucion.html">Vista del niño/a</a></p>';
  }

  global.LipaParentDashboard = {
    buildReport: buildReport,
    render: render,
    skillLabel: skillLabel
  };
})(typeof window !== 'undefined' ? window : global);
