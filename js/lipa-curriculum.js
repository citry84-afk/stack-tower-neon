/**
 * API curricular — consultas, URLs, rutinas y progreso por curso
 */
(function (global) {
  'use strict';

  var PROGRESS_KEY = 'lipa_curriculum_progress_v1';
  var CURRICULUM_MIN_ACCURACY = 0.6;
  var COURSES = [];
  var META = {};

  function init() {
    META = global.LipaCurriculumMeta || {};
    var data = global.LipaCurriculumData;
    COURSES = (data && data.courses) ? data.courses : [];
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function getCourse(courseId) {
    return COURSES.find(function (c) { return c.id === courseId; }) || null;
  }

  function getCoursesByStage(stageId) {
    return COURSES.filter(function (c) { return c.stage === stageId; });
  }

  function listStages() {
    return (META.STAGES || []).map(function (s) {
      var list = getCoursesByStage(s.id);
      var liveCount = list.filter(function (c) { return c.status === 'live'; }).length;
      return {
        id: s.id,
        label: s.label,
        emoji: s.emoji,
        desc: s.desc,
        courses: list,
        liveCount: liveCount
      };
    });
  }

  function enrichSubject(course, block) {
    var meta = (META.SUBJECTS || {})[block.subjectId] || {};
    return {
      subjectId: block.subjectId,
      label: meta.label || block.subjectId,
      emoji: meta.emoji || '📘',
      theme: meta.theme || 'default',
      desc: meta.desc || '',
      status: block.status || 'soon',
      units: block.units || []
    };
  }

  function getSubject(courseId, subjectId) {
    var course = getCourse(courseId);
    if (!course) return null;
    var block = course.subjects.find(function (s) { return s.subjectId === subjectId; });
    if (!block) return null;
    var sub = enrichSubject(course, block);
    return { course: course, subject: sub };
  }

  function getUnit(courseId, subjectId, unitId) {
    var ctx = getSubject(courseId, subjectId);
    if (!ctx) return null;
    var unit = ctx.subject.units.find(function (u) { return u.id === unitId; });
    if (!unit) return null;
    return { course: ctx.course, subject: ctx.subject, unit: unit };
  }

  function getActivity(courseId, subjectId, unitId, activityId) {
    var ctx = getUnit(courseId, subjectId, unitId);
    if (!ctx) return null;
    var act = ctx.unit.activities.find(function (a) { return a.id === activityId; });
    if (!act) return null;
    return {
      course: ctx.course,
      subject: ctx.subject,
      unit: ctx.unit,
      activity: act
    };
  }

  function progressKey() {
    return global.LipaBrainProfiles && LipaBrainProfiles.storageKey
      ? LipaBrainProfiles.storageKey('curriculum')
      : PROGRESS_KEY;
  }

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(progressKey()) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(progressKey(), JSON.stringify(p));
    } catch (e) { /* ignore */ }
  }

  function resolveAccuracy(payload) {
    payload = payload || {};
    var acc = payload.accuracy;
    if (acc == null && payload.correct != null && payload.wrong != null) {
      var tot = payload.correct + payload.wrong;
      acc = tot ? payload.correct / tot : null;
    }
    if (acc == null && payload.sessionComplete) return 1;
    return acc;
  }

  function markActivityComplete(activityId, payload) {
    var p = getProgress();
    var firstTime = !(p[activityId] && p[activityId].count > 0);
    if (!p[activityId]) p[activityId] = { count: 0, firstAt: null, lastAt: null };
    p[activityId].count = (p[activityId].count || 0) + 1;
    p[activityId].lastAt = new Date().toISOString();
    if (!p[activityId].firstAt) p[activityId].firstAt = p[activityId].lastAt;
    if (payload && payload.score != null) {
      p[activityId].bestScore = Math.max(p[activityId].bestScore || 0, payload.score);
    }
    if (payload && payload.accuracy != null) {
      p[activityId].lastAccuracy = payload.accuracy;
    }
    saveProgress(p);
    return { firstTime: firstTime };
  }

  /** Marca actividad del curso solo si accuracy >= 60 % (o sesión válida sin fallos). */
  function tryCompleteFromGame(activityId, payload) {
    var acc = resolveAccuracy(payload);
    var min = CURRICULUM_MIN_ACCURACY;
    if (acc == null) {
      return {
        passed: false,
        marked: false,
        accuracy: null,
        minAccuracy: min,
        firstTime: false,
        reason: 'no-data'
      };
    }
    if (acc < min) {
      return {
        passed: false,
        marked: false,
        accuracy: acc,
        minAccuracy: min,
        firstTime: false,
        reason: 'below-threshold'
      };
    }
    var mark = markActivityComplete(activityId, Object.assign({}, payload, { accuracy: acc }));
    return {
      passed: true,
      marked: true,
      accuracy: acc,
      minAccuracy: min,
      firstTime: mark.firstTime,
      reason: 'ok'
    };
  }

  function isActivityComplete(activityId) {
    var p = getProgress();
    return !!(p[activityId] && p[activityId].count > 0);
  }

  function unitProgress(unit) {
    var live = unit.activities.filter(function (a) { return a.status === 'live'; });
    if (!live.length) return { done: 0, total: 0, percent: 0, hasLive: false };
    var done = live.filter(function (a) { return isActivityComplete(a.id); }).length;
    return {
      done: done,
      total: live.length,
      percent: Math.round((done / live.length) * 100),
      hasLive: true
    };
  }

  function subjectProgress(subject) {
    var totals = { done: 0, total: 0 };
    subject.units.forEach(function (u) {
      var p = unitProgress(u);
      totals.done += p.done;
      totals.total += p.total;
    });
    return {
      done: totals.done,
      total: totals.total,
      percent: totals.total ? Math.round((totals.done / totals.total) * 100) : 0
    };
  }

  function courseProgress(course) {
    var totals = { done: 0, total: 0 };
    course.subjects.forEach(function (block) {
      var sub = enrichSubject(course, block);
      var p = subjectProgress(sub);
      totals.done += p.done;
      totals.total += p.total;
    });
    return {
      done: totals.done,
      total: totals.total,
      percent: totals.total ? Math.round((totals.done / totals.total) * 100) : 0
    };
  }

  function activityUrl(courseId, subjectId, unitId, activity) {
    if (activity.status !== 'live') return null;
    var games = (global.LipaBrainCatalog && global.LipaBrainCatalog.GAMES) || {};
    var base = null;
    if (activity.gameId && games[activity.gameId] && games[activity.gameId].url) {
      base = games[activity.gameId].url;
    }
    if (!base) base = activity.url;
    if (!base) return null;
    var q = [];
    q.push('curriculum=1');
    q.push('course=' + encodeURIComponent(courseId));
    q.push('subject=' + encodeURIComponent(subjectId));
    q.push('unit=' + encodeURIComponent(unitId));
    q.push('activity=' + encodeURIComponent(activity.id));
    if (activity.brainLevel) q.push('brainLevel=' + activity.brainLevel);
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + q.join('&');
  }

  function focusToSubjectIds(focus) {
    if (!focus || focus === 'all' || focus === 'both' || focus === 'balanced' || focus === 'custom') {
      return null;
    }
    if (focus === 'math') return ['matematicas'];
    if (focus === 'language') return ['lenguaje', 'ingles'];
    if (focus === 'lengua') return ['lenguaje'];
    if (focus === 'reflex') return ['brain-gym-diario'];
    if (focus === 'science') return ['naturales'];
    if (focus === 'social') return ['sociales'];
    return null;
  }

  function listLiveSubjects(course) {
    if (!course) return [];
    var meta = META.SUBJECTS || {};
    var order = META.SUBJECT_ORDER || [];
    var out = [];
    course.subjects.forEach(function (block) {
      var sub = enrichSubject(course, block);
      var liveCount = 0;
      sub.units.forEach(function (u) {
        u.activities.forEach(function (a) {
          if (a.status === 'live' && a.gameId) liveCount++;
        });
      });
      if (liveCount > 0) {
        var m = meta[block.subjectId] || {};
        out.push({
          subjectId: block.subjectId,
          label: sub.label,
          emoji: sub.emoji || m.emoji || '📘',
          theme: sub.theme,
          liveCount: liveCount
        });
      }
    });
    out.sort(function (a, b) {
      var ia = order.indexOf(a.subjectId);
      var ib = order.indexOf(b.subjectId);
      if (ia < 0) ia = 99;
      if (ib < 0) ib = 99;
      return ia - ib;
    });
    return out;
  }

  function getRoutineSubjectIds(profile, course) {
    if (!profile) return null;
    if (profile.routineSubjects && profile.routineSubjects.length) {
      return profile.routineSubjects.slice();
    }
    return focusToSubjectIds(profile.focus);
  }

  function subjectsLabel(subjectIds, course) {
    var live = listLiveSubjects(course);
    if (!subjectIds || !subjectIds.length || subjectIds.length >= live.length) {
      return 'Todas las materias';
    }
    var map = {};
    live.forEach(function (s) { map[s.subjectId] = s; });
    var names = subjectIds.map(function (id) {
      var s = map[id];
      return s ? (s.emoji + ' ' + s.label) : id;
    });
    if (names.length <= 2) return names.join(' + ');
    return names.length + ' materias';
  }

  function collectLiveActivities(course, focus, subjectIds) {
    var list = [];
    var allowed = null;
    if (subjectIds && subjectIds.length) {
      allowed = {};
      subjectIds.forEach(function (id) { allowed[id] = true; });
    }

    course.subjects.forEach(function (block) {
      if (allowed) {
        if (!allowed[block.subjectId]) return;
      } else {
        if (focus === 'math' && block.subjectId !== 'matematicas') return;
        if (focus === 'language' && block.subjectId !== 'lenguaje' && block.subjectId !== 'ingles') return;
        if (focus === 'lengua' && block.subjectId !== 'lenguaje') return;
        if (focus === 'reflex' && block.subjectId !== 'brain-gym-diario') return;
        if (focus === 'science' && block.subjectId !== 'naturales') return;
        if (focus === 'social' && block.subjectId !== 'sociales') return;
      }

      var sub = enrichSubject(course, block);
      sub.units.forEach(function (unit) {
        unit.activities.forEach(function (act) {
          if (act.status !== 'live' || !act.gameId) return;
          list.push({
            activity: act,
            unit: unit,
            subject: sub,
            course: course,
            url: activityUrl(course.id, sub.subjectId, unit.id, act)
          });
        });
      });
    });
    return list;
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function pickOneFromSubject(pool, subjectId, gameIdHint, rng) {
    var items = pool.filter(function (p) {
      return p.subject.subjectId === subjectId;
    });
    if (gameIdHint) {
      var hinted = items.filter(function (p) {
        return p.activity.gameId === gameIdHint;
      });
      if (hinted.length) items = hinted;
    }
    if (!items.length) return null;
    return shuffle(items, rng)[0];
  }

  function activityToRoutineStep(item, order, course, diffLabels) {
    var act = item.activity;
    var g = (global.LipaBrainCatalog && global.LipaBrainCatalog.GAMES)[act.gameId] || {};
    var diff = diffLabels[act.difficulty] || { short: 'Nivel ' + act.difficulty };
    return {
      order: order,
      gameId: act.gameId,
      activityId: act.id,
      name: act.title,
      short: g.short || item.subject.emoji,
      emoji: item.subject.emoji,
      url: item.url || g.url,
      desc: item.unit.title + ' · ' + item.subject.label,
      subjectId: item.subject.subjectId,
      subjectLabel: item.subject.label,
      minutes: act.estimatedMinutes || 1,
      level: act.brainLevel || 1,
      tip: act.tip || diff.short + ' · ' + course.shortLabel
    };
  }

  function annotateDailyMissions(steps) {
    var roleLabels = ['Matemáticas', 'Lenguaje', 'Inglés', 'Naturales / Sociales', 'Reto rápido'];
    var roleDur = ['~2 min', '~2 min', '~1 min', '~1 min', '~1 min'];
    steps.forEach(function (s, i) {
      s.missionIndex = i + 1;
      s.missionTag = 'Misión ' + (i + 1);
      s.missionSubject = s.subjectLabel || roleLabels[i] || s.name;
      s.missionDur = roleDur[i] || '~1 min';
    });
    return steps;
  }

  /** Brain Gym diario: 5 misiones (mates, lengua, inglés, ciencias, reto) ~7 min. */
  function buildStructuredSevenMinSteps(profile, course, pool, rng, diffLabels) {
    var math = pickOneFromSubject(pool, 'matematicas', 'neon-calculo', rng);
    var lang = pickOneFromSubject(pool, 'lenguaje', 'neon-lectura', rng) ||
      pickOneFromSubject(pool, 'lenguaje', null, rng);
    var eng = pickOneFromSubject(pool, 'ingles', 'neon-palabras', rng) ||
      pickOneFromSubject(pool, 'ingles', null, rng);
    var sci = pickOneFromSubject(pool, 'naturales', null, rng) ||
      pickOneFromSubject(pool, 'sociales', null, rng);

    var picked = [];
    if (math) picked.push(math);
    if (lang) picked.push(lang);
    if (eng) picked.push(eng);
    if (sci) picked.push(sci);

    if (picked.length < 3) return null;

    var steps = picked.map(function (item, i) {
      return activityToRoutineStep(item, i + 1, course, diffLabels);
    });

    if (global.LipaQuickTests && LipaQuickTests.buildRoutineQuickStep) {
      var qt = LipaQuickTests.buildRoutineQuickStep(profile, steps.length + 1, rng);
      if (qt) {
        qt.order = steps.length + 1;
        qt.subjectId = 'reto-rapido';
        qt.subjectLabel = 'Reto rápido';
        steps.push(qt);
      }
    }

    return annotateDailyMissions(steps);
  }

  function pickBalancedAcrossSubjects(pool, count, rng) {
    var bySubject = {};
    pool.forEach(function (item) {
      var sid = item.subject.subjectId;
      if (!bySubject[sid]) bySubject[sid] = [];
      bySubject[sid].push(item);
    });
    Object.keys(bySubject).forEach(function (sid) {
      bySubject[sid] = shuffle(bySubject[sid], rng);
    });

    var order = (META.SUBJECT_ORDER || []).filter(function (sid) {
      return bySubject[sid] && bySubject[sid].length;
    });
    Object.keys(bySubject).forEach(function (sid) {
      if (order.indexOf(sid) < 0) order.push(sid);
    });

    var picked = [];
    var round = 0;
    while (picked.length < count && round < 24) {
      var added = false;
      order.forEach(function (sid) {
        if (picked.length >= count) return;
        var bucket = bySubject[sid];
        if (bucket && bucket[round]) {
          picked.push(bucket[round]);
          added = true;
        }
      });
      if (!added) break;
      round++;
    }

    if (picked.length < count) {
      var used = {};
      picked.forEach(function (p) { used[p.activity.id] = true; });
      var rest = shuffle(pool.filter(function (p) { return !used[p.activity.id]; }), rng);
      picked = picked.concat(rest.slice(0, count - picked.length));
    }
    return picked.slice(0, count);
  }

  function buildRoutineFromCourse(profile) {
    init();
    var course = getCourse(profile.courseId);
    if (!course) return null;

    var defaultMin = (META.RECOMMENDED_DAILY_MINUTES != null) ? META.RECOMMENDED_DAILY_MINUTES : 7;
    var minutes = Math.max(5, Math.min(15, parseInt(profile.minutes, 10) || defaultMin));
    var focus = profile.focus || 'all';
    var subjectIds = getRoutineSubjectIds(profile, course);
    var liveSubjects = listLiveSubjects(course);
    var pool = collectLiveActivities(course, focus, subjectIds);
    if (!pool.length) return null;

    var seed = (global.LipaDaily && global.LipaDaily.getDailySeed)
      ? global.LipaDaily.getDailySeed('curriculum-' + course.id + '-' + (subjectIds || []).join(','))
      : new Date().toISOString().split('T')[0];
    var rng = global.LipaDaily && global.LipaDaily.mulberry32
      ? global.LipaDaily.mulberry32(global.LipaDaily.seedFromString(String(seed)))
      : function () { return Math.random(); };

    var diffLabels = META.DIFFICULTY_LABELS || {};
    var broadFocus =
      !subjectIds ||
      subjectIds.length >= 3 ||
      focus === 'all' ||
      focus === 'both' ||
      focus === 'balanced' ||
      !focus;

    var useStructured = minutes >= 5 && broadFocus && pool.length >= 3;

    var steps = useStructured
      ? buildStructuredSevenMinSteps(profile, course, pool, rng, diffLabels)
      : null;

    if (!steps || !steps.length) {
      var stepCount = Math.max(3, Math.min(8, Math.round(minutes / 2) || 3));
      var useBalanced = !subjectIds || subjectIds.length >= 2 ||
        focus === 'all' || focus === 'both' || focus === 'balanced';
      var picked = useBalanced
        ? pickBalancedAcrossSubjects(pool, Math.min(stepCount, pool.length), rng)
        : shuffle(pool, rng).slice(0, Math.min(stepCount, pool.length));

      steps = picked.map(function (item, i) {
        return activityToRoutineStep(item, i + 1, course, diffLabels);
      });

      if (minutes >= 7 && global.LipaQuickTests && LipaQuickTests.buildRoutineQuickStep) {
        var qtExtra = LipaQuickTests.buildRoutineQuickStep(profile, steps.length + 1, rng);
        if (qtExtra) {
          qtExtra.order = steps.length + 1;
          qtExtra.subjectId = 'reto-rapido';
          qtExtra.subjectLabel = 'Reto rápido';
          steps.push(qtExtra);
        }
      }
    }

    var subLine = subjectsLabel(subjectIds, course);

    var missionHint = steps.length >= 5 ? ' · 5 misiones guiadas' : '';

    return {
      title: course.shortLabel + ' · Entreno de hoy · ' + minutes + ' min',
      subtitle: subLine + missionHint + ' · ' + course.label,
      minutes: minutes,
      steps: steps,
      firstUrl: steps[0] ? steps[0].url : '/cursos.html',
      date: new Date().toISOString().split('T')[0],
      courseId: course.id,
      routineSubjects: subjectIds || liveSubjects.map(function (s) { return s.subjectId; })
    };
  }

  function countLiveActivitiesForSubject(courseId, subjectId) {
    var course = getCourse(courseId);
    if (!course) return 0;
    return collectLiveActivities(course, 'all', [subjectId]).length;
  }

  /** Rutina guiada solo de una materia (p. ej. 5 min de inglés). */
  function buildRoutineForSubject(courseId, subjectId, minutes) {
    init();
    var ctx = getSubject(courseId, subjectId);
    var meta = (META.SUBJECTS || {})[subjectId] || {};
    var mins = Math.max(5, Math.min(15, parseInt(minutes, 10) || 5));
    var routine = buildRoutineFromCourse({
      courseId: courseId,
      routineSubjects: [subjectId],
      focus: 'custom',
      minutes: mins
    });
    if (!routine || !routine.steps.length) return null;

    var label = ctx ? ctx.subject.label : meta.label || subjectId;
    var emoji = ctx ? ctx.subject.emoji : meta.emoji || '📘';
    routine.title = emoji + ' ' + label + ' · ' + mins + ' min';
    routine.subtitle = 'Solo ' + label + ' · ' + routine.steps.length + ' ejercicios seguidos';
    routine.subjectId = subjectId;
    return routine;
  }

  function courseToAgeBand(courseId) {
    var c = getCourse(courseId);
    return (c && c.ageBand) ? c.ageBand : '10-12';
  }

  function defaultCourseForAgeBand(ageBand) {
    var map = {
      '3-5': 'infantil-4',
      '6-9': 'primaria-2',
      '10-12': 'primaria-5',
      '13-17': 'eso-1',
      '18+': 'eso-2'
    };
    return map[ageBand] || 'primaria-3';
  }

  function statusLabel(status) {
    if (status === 'live') return 'Disponible';
    if (status === 'partial') return 'En construcción';
    return 'Próximamente';
  }

  /** Texto positivo para tarjetas (evita «en construcción» si hay juegos). */
  function isFeaturedCourse(courseId) {
    var ids = (META.MVP_COURSE_IDS || []);
    return ids.indexOf(courseId) >= 0;
  }

  function schoolSubjectIds() {
    return (META.SCHOOL_SUBJECT_IDS || []).slice();
  }

  function courseGamesLabel(course) {
    var p = courseProgress(course);
    if (course.status === 'soon') return 'Próximamente';
    if (!p.total) return 'Explorar';
    return p.total + ' juegos';
  }

  function subjectFooterLabel(sub, sp) {
    if (sp.total > 0) {
      return sp.total === 1 ? '1 juego listo' : sp.total + ' juegos listos';
    }
    if (sub.status === 'live' || sub.status === 'partial') return 'Empezar';
    return 'Próximamente';
  }

  /**
   * Primera actividad live sin completar (opcional: materia, unidad, después de activityId).
   */
  function findNextActivity(courseId, opts) {
    opts = opts || {};
    var course = getCourse(courseId);
    if (!course) return null;

    var found = null;
    var pastAnchor = !opts.afterActivityId;

    course.subjects.forEach(function (block) {
      if (found) return;
      if (opts.subjectId && block.subjectId !== opts.subjectId) return;
      var sub = enrichSubject(course, block);
      if (sub.status === 'soon') return;
      sub.units.forEach(function (unit) {
        if (found) return;
        if (opts.unitId && unit.id !== opts.unitId) return;
        unit.activities.forEach(function (act) {
          if (found) return;
          if (opts.afterActivityId && act.id === opts.afterActivityId) {
            pastAnchor = true;
            return;
          }
          if (!pastAnchor && opts.afterActivityId) return;
          if (act.status !== 'live') return;
          if (isActivityComplete(act.id)) return;
          var url = activityUrl(course.id, sub.subjectId, unit.id, act);
          if (!url) return;
          found = {
            courseId: course.id,
            subjectId: sub.subjectId,
            unitId: unit.id,
            activityId: act.id,
            url: url,
            href: url,
            label: act.title || unit.title,
            sublabel: sub.label + ' · ' + unit.title,
            type: 'activity',
            activity: act,
            unit: unit,
            subject: sub,
            course: course
          };
        });
      });
    });

    return found;
  }

  /** Siguiente actividad live sin completar; si no hay, enlace al curso. */
  function getContinueTarget(courseId) {
    var found = findNextActivity(courseId);
    if (found) {
      return {
        href: found.href,
        label: found.label,
        sublabel: found.sublabel,
        type: 'activity'
      };
    }

    var course = getCourse(courseId);
    if (!course) return null;

    var cp = courseProgress(course);
    return {
      href: '/curso.html?c=' + encodeURIComponent(course.id),
      label: (course.emoji ? course.emoji + ' ' : '') + course.label,
      sublabel: cp.total
        ? (cp.done >= cp.total ? 'Curso completado — repasar' : 'Ver materias del curso')
        : 'Explorar el curso',
      type: 'course'
    };
  }

  init();

  global.LipaCurriculum = {
    init: init,
    getCourse: getCourse,
    getCoursesByStage: getCoursesByStage,
    listStages: listStages,
    getSubject: getSubject,
    getUnit: getUnit,
    getActivity: getActivity,
    enrichSubject: enrichSubject,
    activityUrl: activityUrl,
    getProgress: getProgress,
    markActivityComplete: markActivityComplete,
    tryCompleteFromGame: tryCompleteFromGame,
    resolveAccuracy: resolveAccuracy,
    CURRICULUM_MIN_ACCURACY: CURRICULUM_MIN_ACCURACY,
    isActivityComplete: isActivityComplete,
    unitProgress: unitProgress,
    subjectProgress: subjectProgress,
    courseProgress: courseProgress,
    buildRoutineFromCourse: buildRoutineFromCourse,
    buildRoutineForSubject: buildRoutineForSubject,
    countLiveActivitiesForSubject: countLiveActivitiesForSubject,
    collectLiveActivities: collectLiveActivities,
    listLiveSubjects: listLiveSubjects,
    getRoutineSubjectIds: getRoutineSubjectIds,
    subjectsLabel: subjectsLabel,
    focusToSubjectIds: focusToSubjectIds,
    pickBalancedAcrossSubjects: pickBalancedAcrossSubjects,
    courseToAgeBand: courseToAgeBand,
    defaultCourseForAgeBand: defaultCourseForAgeBand,
    statusLabel: statusLabel,
    isFeaturedCourse: isFeaturedCourse,
    schoolSubjectIds: schoolSubjectIds,
    courseGamesLabel: courseGamesLabel,
    subjectFooterLabel: subjectFooterLabel,
    getContinueTarget: getContinueTarget,
    findNextActivity: findNextActivity,
    esc: esc,
    COURSES: COURSES
  };
})(typeof window !== 'undefined' ? window : global);
