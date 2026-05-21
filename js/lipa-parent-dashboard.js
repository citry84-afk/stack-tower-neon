/**
 * Informe para padres — progreso semanal, materias y recomendaciones (PDF fase 3)
 */
(function (global) {
  'use strict';

  var SKILL_LABELS = {
    'b-v': 'Ortografía B/V',
    tildes: 'Tildes',
    h: 'Hache',
    'g-j': 'G/J',
    signos: 'Signos de puntuación',
    'series-pares': 'Series y patrones',
    patrones: 'Patrones',
    analogias: 'Analogías',
    geografia: 'Geografía',
    ciencias: 'Ciencias',
    animales: 'Naturaleza',
    medioambiente: 'Medio ambiente',
    planetas: 'Espacio',
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

  var PILLAR_META = {
    math: { label: 'Matemáticas', emoji: '🔢', subjectId: 'mates' },
    'language-es': { label: 'Lengua', emoji: '📝', subjectId: 'lenguaje' },
    language: { label: 'Inglés', emoji: '🇬🇧', subjectId: 'ingles' },
    science: { label: 'Naturales', emoji: '🌿', subjectId: 'naturales' },
    social: { label: 'Sociales', emoji: '🌍', subjectId: 'sociales' },
    infantil: { label: 'Actividades peques', emoji: '🧒', subjectId: 'peques' }
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

  function getGamePillar(activityId) {
    if (!global.LipaBrainCatalog || !LipaBrainCatalog.GAMES) return null;
    var g = LipaBrainCatalog.GAMES[activityId];
    return g ? g.pillar : null;
  }

  function analyzeWeekHistory(history, sinceKey) {
    var since = new Date(sinceKey + 'T00:00:00').getTime();
    var pillarHits = {};
    var minutes = 0;
    var sessions = 0;

    (history || []).forEach(function (h) {
      var day = h.date || (h.at ? h.at.split('T')[0] : '');
      if (!day) return;
      var t = new Date(day + 'T12:00:00').getTime();
      if (t < since) return;
      sessions += 1;
      minutes += (h.durationSec || 30) / 60;
      var pillar = getGamePillar(h.activityId);
      if (!pillar) return;
      pillarHits[pillar] = (pillarHits[pillar] || 0) + 1;
    });

    return {
      sessions: sessions,
      minutes: Math.round(minutes),
      pillarHits: pillarHits
    };
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
        percent: sp.percent,
        href: '/materia.html?c=' + encodeURIComponent(courseId) + '&m=' + encodeURIComponent(block.subjectId)
      });
    });

    rows.sort(function (a, b) { return a.percent - b.percent; });
    return rows;
  }

  function mergeWeekSubjectRows(courseId, sinceKey, subjects) {
    var weekRows = global.LipaCurriculum && courseId && LipaCurriculum.weekCompletionsBySubject
      ? LipaCurriculum.weekCompletionsBySubject(courseId, sinceKey)
      : [];
    var byId = {};
    subjects.forEach(function (s) {
      byId[s.subjectId] = Object.assign({}, s, { weekCount: 0 });
    });
    weekRows.forEach(function (w) {
      if (!byId[w.subjectId]) {
        byId[w.subjectId] = {
          subjectId: w.subjectId,
          label: w.label,
          emoji: w.emoji,
          done: 0,
          total: 0,
          percent: 0,
          weekCount: w.weekCount,
          href: '/materia.html?c=' + encodeURIComponent(courseId) + '&m=' + encodeURIComponent(w.subjectId)
        };
      } else {
        byId[w.subjectId].weekCount = w.weekCount;
      }
    });
    return Object.keys(byId)
      .map(function (id) { return byId[id]; })
      .sort(function (a, b) { return (b.weekCount || 0) - (a.weekCount || 0); });
  }

  function deriveStrengthsWeaknesses(subjects, weekAnalysis) {
    var strengths = [];
    var weaknesses = [];

    subjects.forEach(function (s) {
      if (s.percent >= 75 || (s.weekCount && s.weekCount >= 3)) {
        strengths.push(s);
      }
      if (s.percent < 45 || (s.total > 0 && !s.weekCount && s.percent < 80)) {
        weaknesses.push(s);
      }
    });

    if (!strengths.length && subjects.length) {
      var best = subjects.slice().sort(function (a, b) { return b.percent - a.percent; })[0];
      if (best && best.percent > 0) strengths.push(best);
    }
    if (!weaknesses.length && subjects.length) {
      weaknesses.push(subjects[0]);
    }

    Object.keys(weekAnalysis.pillarHits || {}).forEach(function (pillar) {
      var meta = PILLAR_META[pillar];
      if (!meta) return;
      var hit = weekAnalysis.pillarHits[pillar];
      if (hit >= 4) {
        var exists = strengths.some(function (s) { return s.subjectId === meta.subjectId; });
        if (!exists) {
          strengths.push({
            subjectId: meta.subjectId,
            label: meta.label,
            emoji: meta.emoji,
            percent: null,
            weekCount: hit,
            href: null,
            fromPillar: true
          });
        }
      }
    });

    strengths = strengths.slice(0, 3);
    weaknesses = weaknesses
      .filter(function (w) {
        return !strengths.some(function (s) { return s.subjectId === w.subjectId; });
      })
      .slice(0, 3);
    return { strengths: strengths, weaknesses: weaknesses };
  }

  function buildWeeklyNarrative(ctx) {
    if (!ctx.hasProfile && !ctx.weekSessions) {
      return 'Cuando empiece la rutina de 7 minutos al día, aquí verás un resumen claro de la semana.';
    }
    var parts = [];
    parts.push(
      'Esta semana <strong>' +
        esc(ctx.childName) +
        '</strong> entrenó <strong>' +
        ctx.daysTrainedWeek +
        ' de 7</strong> días'
    );
    if (ctx.weekMinutes > 0) {
      parts.push(' (~<strong>' + ctx.weekMinutes + ' min</strong> en total)');
    }
    parts.push('.');

    var practiced = ctx.subjects.filter(function (s) { return s.weekCount > 0; });
    if (practiced.length) {
      var list = practiced
        .map(function (s) {
          return s.emoji + ' ' + s.label + ' (' + s.weekCount + ' actividad' + (s.weekCount === 1 ? '' : 'es') + ')';
        })
        .join(', ');
      parts.push(' Ha practicado: ' + list + '.');
    } else if (ctx.weekSessions > 0) {
      parts.push(' Hay sesiones de Brain Gym; aún no hay actividades del curso marcadas esta semana.');
    } else {
      parts.push(' Aún no hay entrenos registrados en los últimos 7 días.');
    }

    if (ctx.strengths.length) {
      var s0 = ctx.strengths[0];
      parts.push(
        ' <span class="parent-dash-narrative__good">Destaca en ' +
          esc(s0.label) +
          (s0.percent != null ? ' (' + s0.percent + '% del curso)' : '') +
          '.</span>'
      );
    }
    if (ctx.weaknesses.length) {
      var w0 = ctx.weaknesses[0];
      parts.push(
        ' <span class="parent-dash-narrative__focus">Conviene reforzar ' +
          esc(w0.label) +
          (w0.href ? '' : '') +
          '.</span>'
      );
    }
    return parts.join('');
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
        text: 'Configura el curso del niño/a en la rutina (5–7 minutos) para ver un informe más preciso.',
        href: '/mi-rutina-cerebro.html',
        cta: 'Configurar rutina'
      });
      return tips;
    }

    if (ctx.weaknesses.length && ctx.daysTrainedWeek > 0) {
      var w = ctx.weaknesses[0];
      tips.push({
        emoji: w.emoji,
        text:
          'Plan sugerido: 3 sesiones de ' +
          (ctx.routineMinutes || 7) +
          ' min esta semana centradas en ' +
          w.label +
          ', más 1 reto rápido de mates o lógica.',
        href: w.href || '/',
        cta: 'Empezar trabajo guiado'
      });
    }

    if (ctx.daysTrainedWeek === 0) {
      tips.push({
        emoji: '☀️',
        text: 'Esta semana aún no hay entrenos registrados. Los 7 minutos diarios marcan la mayor diferencia.',
        href: '/',
        cta: 'Empezar hoy'
      });
    } else if (ctx.daysTrainedWeek < 4) {
      tips.push({
        emoji: '📅',
        text:
          'Lleva ' +
          ctx.daysTrainedWeek +
          ' día' +
          (ctx.daysTrainedWeek === 1 ? '' : 's') +
          ' de entreno. Objetivo amable del PDF: 4–5 días por semana.',
        href: '/mi-rutina-cerebro.html',
        cta: 'Ver rutina'
      });
    }

    if (ctx.weakestSubject && ctx.weakestSubject.percent < 60) {
      tips.push({
        emoji: ctx.weakestSubject.emoji,
        text:
          'Reforzar ' +
          ctx.weakestSubject.label +
          ': ' +
          ctx.weakestSubject.done +
          ' de ' +
          ctx.weakestSubject.total +
          ' actividades del curso en total.',
        href: ctx.weakestSubject.href,
        cta: 'Practicar ' + ctx.weakestSubject.label
      });
    }

    if (ctx.quickTests.played.length === 0) {
      tips.push({
        emoji: '🧩',
        text: 'Un reto rápido (lógica u ortografía) añade variedad sin presión — 3 a 5 minutos.',
        href: '/retos-rapidos.html',
        cta: 'Retos rápidos'
      });
    }

    if (ctx.quickTests.weakSkills.length) {
      var sk = ctx.quickTests.weakSkills[0];
      tips.push({
        emoji: '✏️',
        text: 'En el último reto rápido conviene repasar: ' + sk.label + '.',
        href: '/retos-rapidos.html',
        cta: 'Repasar'
      });
    }

    if (!tips.length) {
      tips.push({
        emoji: '🌟',
        text:
          '¡Buen ritmo! Sigue con la rutina de ' +
          (ctx.routineMinutes || 7) +
          ' min y repasa lo del cole antes de exámenes.',
        href: '/cursos.html',
        cta: 'Ver curso'
      });
    }
    return tips.slice(0, 4);
  }

  function buildReport() {
    var profile = global.LipaBrain && LipaBrain.getProfile ? LipaBrain.getProfile() : null;
    var stats =
      global.LipaBrain && LipaBrain.getStats
        ? LipaBrain.getStats()
        : { byDay: {}, weekSessions: 0, streak: 0, xp: 0, history: [] };
    var weekKeys = last7DayKeys();
    var sinceKey = weekKeys[0];
    var daysTrainedWeek = countDaysTrained(stats.byDay || {}, weekKeys);
    var weekAnalysis = analyzeWeekHistory(stats.history || [], sinceKey);
    var courseId = profile && profile.courseId;
    var baseSubjects = getCurriculumSubjects(courseId);
    var subjects = mergeWeekSubjectRows(courseId, sinceKey, baseSubjects);
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

    var weakest = baseSubjects.length ? baseSubjects[0] : null;

    var quickTests = getQuickTestSummary();
    var childName =
      profile && profile.displayName ? profile.displayName.split(' ')[0] : 'Tu hijo/a';
    if (global.LipaBrainProfiles) {
      var meta = LipaBrainProfiles.getActiveMeta();
      if (meta && meta.name && !profile) childName = meta.name.split(' ')[0];
    }

    var sw = deriveStrengthsWeaknesses(subjects, weekAnalysis);

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
      strengths: sw.strengths,
      weaknesses: sw.weaknesses,
      daysTrainedWeek: daysTrainedWeek,
      weekSessions: stats.weekSessions || weekAnalysis.sessions,
      weekMinutes: weekAnalysis.minutes,
      streak: stats.streak || 0,
      xp: stats.xp || 0,
      weekKeys: weekKeys,
      byDay: stats.byDay || {},
      quickTests: quickTests
    };

    ctx.narrative = buildWeeklyNarrative(ctx);
    ctx.recommendations = buildRecommendations(ctx);
    return ctx;
  }

  function renderStrengthList(items, emptyMsg) {
    if (!items.length) {
      return '<li class="parent-dash-muted">' + esc(emptyMsg) + '</li>';
    }
    return items
      .map(function (s) {
        var detail =
          s.weekCount && !s.percent
            ? s.weekCount + ' sesiones esta semana'
            : s.percent != null
              ? s.percent + '% del curso'
              : '';
        var inner =
          '<span class="parent-dash-pill__emoji">' +
          s.emoji +
          '</span><span><strong>' +
          esc(s.label) +
          '</strong>' +
          (detail ? '<br><small>' + esc(detail) + '</small>' : '') +
          '</span>';
        if (s.href) {
          return (
            '<li><a href="' +
            esc(s.href) +
            '" class="parent-dash-pill parent-dash-pill--link">' +
            inner +
            ' →</a></li>'
          );
        }
        return '<li class="parent-dash-pill">' + inner + '</li>';
      })
      .join('');
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

    var weekBars = r.weekKeys
      .map(function (key) {
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
          '<div class="parent-dash-day' +
          (trained ? ' parent-dash-day--on' : '') +
          '" title="' +
          esc(key) +
          '">' +
          '<div class="parent-dash-day__bar" style="height:' +
          h +
          'px"></div>' +
          '<span class="parent-dash-day__lbl">' +
          esc(label) +
          '</span></div>'
        );
      })
      .join('');

    var subjectRows = r.subjects.length
      ? r.subjects
          .map(function (s) {
            var weekLine = s.weekCount
              ? s.weekCount + ' esta semana'
              : 'sin actividad esta semana';
            var totalLine =
              s.total > 0 ? s.done + '/' + s.total + ' en el curso' : 'explorar unidad';
            return (
              '<li class="parent-dash-subject">' +
              '<span class="parent-dash-subject__emoji">' +
              s.emoji +
              '</span>' +
              '<span class="parent-dash-subject__body"><strong>' +
              esc(s.label) +
              '</strong>' +
              '<span>' +
              esc(weekLine) +
              ' · ' +
              esc(totalLine) +
              '</span></span>' +
              '<span class="parent-dash-subject__pct">' +
              (s.percent != null ? s.percent + '%' : '—') +
              '</span></li>'
            );
          })
          .join('')
      : '<li class="parent-dash-muted">Configura un curso en la rutina para ver progreso por materia.</li>';

    var qtRows = r.quickTests.played.length
      ? r.quickTests.played
          .map(function (q) {
            return (
              '<li><span>' +
              q.emoji +
              ' ' +
              esc(q.label) +
              '</span>' +
              '<span>Mejor ' +
              q.bestPercent +
              '% · ' +
              esc(q.lastScore) +
              '</span></li>'
            );
          })
          .join('')
      : '<li class="parent-dash-muted">Aún no ha hecho retos rápidos (lógica, ortografía, cultura).</li>';

    var recHtml = r.recommendations
      .map(function (tip) {
        return (
          '<div class="parent-dash-tip">' +
          '<span class="parent-dash-tip__emoji">' +
          tip.emoji +
          '</span>' +
          '<p>' +
          esc(tip.text) +
          '</p>' +
          (tip.href
            ? '<a href="' +
              esc(tip.href) +
              '" class="parent-dash-tip__cta">' +
              esc(tip.cta) +
              ' →</a>'
            : '') +
          '</div>'
        );
      })
      .join('');

    var courseLine = r.courseLabel
      ? '<p class="parent-dash-course">' +
        esc(r.courseLabel) +
        ' · ' +
        r.coursePercent +
        '% del curso (' +
        r.courseDone +
        '/' +
        r.courseTotal +
        ')</p>'
      : '';

    root.innerHTML =
      '<div class="parent-dash-narrative" role="status">' +
      '<p class="parent-dash-narrative__lead">' +
      r.narrative +
      '</p></div>' +

      '<div class="parent-dash-summary">' +
      '<p class="parent-dash-greet">Informe semanal de <strong>' +
      esc(r.childName) +
      '</strong></p>' +
      courseLine +
      '<div class="parent-dash-kpis">' +
      '<div class="parent-dash-kpi"><strong>' +
      r.daysTrainedWeek +
      '/7</strong><span>días con entreno</span></div>' +
      '<div class="parent-dash-kpi"><strong>' +
      (r.weekMinutes || '—') +
      '</strong><span>minutos (7 días)</span></div>' +
      '<div class="parent-dash-kpi"><strong>' +
      r.weekSessions +
      '</strong><span>sesiones</span></div>' +
      '<div class="parent-dash-kpi"><strong>' +
      r.streak +
      '</strong><span>racha</span></div>' +
      '</div></div>' +

      '<section class="parent-dash-section"><h2>Esta semana</h2>' +
      '<div class="parent-dash-chart" role="img" aria-label="Días entrenados">' +
      weekBars +
      '</div></section>' +

      '<section class="parent-dash-section parent-dash-section--split">' +
      '<div><h2>Fortalezas</h2><ul class="parent-dash-pills">' +
      renderStrengthList(r.strengths, 'Practica unos días para ver fortalezas.') +
      '</ul></div>' +
      '<div><h2>A reforzar</h2><ul class="parent-dash-pills parent-dash-pills--weak">' +
      renderStrengthList(r.weaknesses, 'Todo equilibrado — sigue la rutina.') +
      '</ul></div></section>' +

      '<section class="parent-dash-section"><h2>Materias del cole</h2>' +
      '<ul class="parent-dash-list">' +
      subjectRows +
      '</ul></section>' +

      '<section class="parent-dash-section"><h2>Retos rápidos</h2>' +
      '<ul class="parent-dash-list parent-dash-list--compact">' +
      qtRows +
      '</ul></section>' +

      '<section class="parent-dash-section"><h2>Recomendaciones</h2>' +
      '<div class="parent-dash-tips">' +
      recHtml +
      '</div></section>' +

      '<p class="parent-dash-foot">Datos guardados solo en este dispositivo · sin cuenta obligatoria. ' +
      '<a href="/mi-evolucion.html">Vista del niño/a</a> · <a href="/privacy.html">Privacidad</a></p>';
  }

  global.LipaParentDashboard = {
    buildReport: buildReport,
    render: render,
    skillLabel: skillLabel
  };
})(typeof window !== 'undefined' ? window : global);
