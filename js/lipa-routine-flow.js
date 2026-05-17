/**
 * Rutina guiada Brain Gym — ?rutina=1&paso=N&total=T
 * Encadena minijuegos; el progreso vive en sessionStorage.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'lipa_routine_flow_v1';

  var DEFAULT_ROUTINE = {
    title: 'Rutina cerebro · 5 min',
    subtitle: 'Cálculo + reflejos',
    minutes: 5,
    steps: [
      { order: 1, gameId: 'neon-calculo', name: 'Neon Cálculo', emoji: '🧮', url: '/neon-calculo.html', tip: 'Suma y resta' },
      { order: 2, gameId: 'tablas-relampago', name: 'Tablas Relámpago', emoji: '✖️', url: '/tablas-relampago.html', tip: 'Multiplicar' },
      { order: 3, gameId: 'reaction-test', name: 'Test reflejos', emoji: '⚡', url: '/test-reflejos.html', tip: 'Tiempo en ms' },
      { order: 4, gameId: 'flash-tap', name: 'Flash Tap', emoji: '👆', url: '/toque-flash-neon.html', tip: 'Atención visual' },
      { order: 5, gameId: 'grid-reflex', name: 'Grid 4×4', emoji: '🎯', url: '/grid-reflejos-neon.html', tip: 'Precisión' }
    ]
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function getParams() {
    try {
      return new URLSearchParams(global.location.search);
    } catch (e) {
      return null;
    }
  }

  function isActive() {
    var p = getParams();
    return p && p.get('rutina') === '1';
  }

  function getPasoFromUrl() {
    var p = getParams();
    if (!p) return 1;
    var n = parseInt(p.get('paso'), 10);
    return n >= 1 ? n : 1;
  }

  function getTotalFromUrl() {
    var p = getParams();
    if (!p) return 0;
    return parseInt(p.get('total'), 10) || 0;
  }

  function guidedUrl(baseUrl, paso, total) {
    if (!baseUrl) return '/gym-cerebro.html';
    var sep = baseUrl.indexOf('?') >= 0 ? '&' : '?';
    return baseUrl + sep + 'rutina=1&paso=' + paso + '&total=' + total;
  }

  function normalizeRoutine(routine) {
    if (!routine || !routine.steps || !routine.steps.length) return null;
    var steps = routine.steps.map(function (s, i) {
      return {
        order: s.order || i + 1,
        gameId: s.gameId,
        activityId: s.activityId,
        name: s.name,
        emoji: s.emoji || '✨',
        url: s.url,
        tip: s.tip || '',
        minutes: s.minutes || 1,
        level: s.level || 1
      };
    });
    var total = steps.length;
    steps.forEach(function (s, i) {
      s.guidedUrl = guidedUrl(s.url, i + 1, total);
    });
    return {
      title: routine.title || 'Tu rutina',
      subtitle: routine.subtitle || '',
      minutes: routine.minutes || steps.length,
      date: routine.date || today(),
      courseId: routine.courseId || null,
      steps: steps
    };
  }

  function saveState(state) {
    try {
      global.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function loadState() {
    try {
      var raw = global.sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function clearState() {
    try {
      global.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }
  }

  function createState(routine) {
    var norm = normalizeRoutine(routine);
    if (!norm) return null;
    return {
      version: 1,
      title: norm.title,
      subtitle: norm.subtitle,
      minutes: norm.minutes,
      date: norm.date,
      courseId: norm.courseId,
      steps: norm.steps,
      currentStep: 0,
      completedSteps: [],
      startedAt: new Date().toISOString()
    };
  }

  function stateFromProfile() {
    if (!global.LipaBrain) return null;
    if (global.LipaBrain.refreshProfileRoutine) {
      global.LipaBrain.refreshProfileRoutine();
    }
    var p = global.LipaBrain.getProfile();
    if (!p || !p.routine) return null;
    var st = createState(p.routine);
    if (st) st.currentStep = Math.max(0, getPasoFromUrl() - 1);
    return st;
  }

  function syncStateFromUrl(state) {
    if (!state) return state;
    var paso = getPasoFromUrl();
    var max = state.steps.length;
    state.currentStep = Math.min(max - 1, Math.max(0, paso - 1));
    return state;
  }

  function getBar() {
    return document.getElementById('lipa-routine-bar');
  }

  function renderBar(state, opts) {
    opts = opts || {};
    if (!state || !state.steps.length) return;

    var bar = getBar();
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'lipa-routine-bar';
      bar.className = 'lipa-routine-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Rutina guiada');
      document.body.appendChild(bar);
    }

    var idx = state.currentStep;
    var step = state.steps[idx];
    var total = state.steps.length;
    var done = (state.completedSteps || []).length;
    var pct = Math.round(((idx + (opts.justFinished ? 1 : 0)) / total) * 100);
    if (opts.justFinished && idx >= total - 1) pct = 100;

    var missionLine = step.missionTag
      ? step.missionTag + ' · ' + (step.missionSubject || '') + (step.missionDur ? ' · ' + step.missionDur : '')
      : 'Paso ' + (idx + 1) + ' / ' + total;

    var nextLabel = 'Siguiente misión';
    if (opts.justFinished && idx >= total - 1) {
      nextLabel = 'Ver mi recompensa';
    } else if (opts.justFinished && idx < total - 1) {
      var next = state.steps[idx + 1];
      nextLabel = 'Siguiente: ' + (next.emoji ? next.emoji + ' ' : '') + next.name;
    }

    bar.innerHTML =
      '<div class="lipa-routine-bar__inner">' +
      '<div class="lipa-routine-bar__top">' +
      '<span class="lipa-routine-bar__eyebrow">Entreno de hoy</span>' +
      '<span class="lipa-routine-bar__step">' + esc(missionLine) + '</span>' +
      '</div>' +
      '<div class="lipa-routine-bar__track" aria-hidden="true"><span class="lipa-routine-bar__fill" style="width:' + pct + '%"></span></div>' +
      '<p class="lipa-routine-bar__title">' + esc(step.emoji + ' ' + step.name) + '</p>' +
      '<p class="lipa-routine-bar__sub">' + esc(state.title) + (done ? ' · ' + done + ' completados' : '') + '</p>' +
      '<div class="lipa-routine-bar__actions">' +
      '<button type="button" class="lipa-routine-bar__next' + (opts.justFinished ? ' lipa-routine-bar__next--pulse' : '') + '" id="lipa-routine-next"' +
      (opts.justFinished ? '' : ' hidden') + '>' + esc(nextLabel) + ' →</button>' +
      '<button type="button" class="lipa-routine-bar__skip" id="lipa-routine-skip">Saltar paso</button>' +
      '<a href="/mi-rutina-cerebro.html" class="lipa-routine-bar__quit">Salir</a>' +
      '</div></div>';

    var nextBtn = document.getElementById('lipa-routine-next');
    var skipBtn = document.getElementById('lipa-routine-skip');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goNext();
      });
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        goNext(true);
      });
    }

    document.body.classList.add('lipa-routine-active');
  }

  function showNextReady() {
    var state = loadState();
    if (!state) state = stateFromProfile();
    if (!state) return;
    syncStateFromUrl(state);
    saveState(state);
    renderBar(state, { justFinished: true });
  }

  function routineSummaryLine(state) {
    if (!state || !state.steps || !state.steps.length) return '';
    var labels = [];
    var seen = {};
    state.steps.forEach(function (step) {
      var key = step.subjectId || step.quickTestId || step.name;
      if (seen[key]) return;
      seen[key] = true;
      if (step.subjectLabel) labels.push(step.subjectLabel);
      else if (step.quickTestId && step.name) labels.push(step.name.replace(/^Reto rápido: /, ''));
      else if (step.name) labels.push(step.name);
    });
    if (!labels.length) return '';
    if (labels.length <= 3) return labels.join(', ');
    return labels.slice(0, 3).join(', ') + ' y más';
  }

  function missionSubjectsList(state) {
    if (!state || !state.steps) return [];
    var out = [];
    var seen = {};
    state.steps.forEach(function (step) {
      var label = step.missionSubject || step.subjectLabel;
      if (!label || seen[label]) return;
      seen[label] = true;
      out.push(label);
    });
    return out;
  }

  function markDailyComplete(state) {
    var day = today();
    try {
      localStorage.setItem('lipa_daily_done_' + day, '1');
      localStorage.setItem('lipa_recreo_unlock', day);
    } catch (e) { /* ignore */ }
    if (global.LipaBrain && LipaBrain.bumpStreak) {
      LipaBrain.bumpStreak();
    }
    if (global.LipaBrain && LipaBrain.addXp) {
      LipaBrain.addXp(15 + (state && state.steps ? state.steps.length * 3 : 0));
    }
  }

  function saveRoutineSummary(state) {
    try {
      var stats = global.LipaBrain && LipaBrain.getStats ? LipaBrain.getStats() : {};
      var rank = stats.rank || {};
      var courseLabel = '';
      if (state.courseId && global.LipaCurriculum) {
        var c = LipaCurriculum.getCourse(state.courseId);
        if (c) courseLabel = c.label;
      }
      sessionStorage.setItem(
        'lipa-routine-summary',
        JSON.stringify({
          practiced: routineSummaryLine(state),
          subjects: missionSubjectsList(state),
          missions: (state.steps || []).map(function (s) {
            return {
              tag: s.missionTag,
              subject: s.missionSubject || s.subjectLabel,
              name: s.name,
              emoji: s.emoji
            };
          }),
          minutes: state.minutes,
          steps: state.steps.length,
          xp: stats.xp || 0,
          streak: stats.streak || 0,
          rankName: rank.name,
          rankEmoji: rank.emoji,
          courseLabel: courseLabel,
          date: today()
        })
      );
    } catch (e) { /* ignore */ }
  }

  function finishRoutine(state) {
    markDailyComplete(state);
    saveRoutineSummary(state);
    clearState();
    document.body.classList.remove('lipa-routine-active');
    var bar = getBar();
    if (bar) bar.remove();
    if (global.LipaAnalytics && global.LipaAnalytics.trackEvent) {
      global.LipaAnalytics.trackEvent('lipa_routine_complete', {
        steps: state && state.steps ? state.steps.length : 0,
        courseId: state && state.courseId
      });
    }
    if (global.gtag) {
      global.gtag('event', 'lipa_routine_complete', {
        steps: state && state.steps ? state.steps.length : 0
      });
    }
    global.location.href = '/entreno-completo.html';
  }

  function goNext(skipped) {
    var state = loadState();
    if (!state) state = stateFromProfile();
    if (!state) {
      global.location.href = '/mi-rutina-cerebro.html';
      return;
    }
    syncStateFromUrl(state);

    var idx = state.currentStep;
    if (state.completedSteps.indexOf(idx) < 0 && !skipped) {
      state.completedSteps.push(idx);
    }

    var nextIdx = idx + 1;
    if (nextIdx >= state.steps.length) {
      finishRoutine(state);
      return;
    }

    state.currentStep = nextIdx;
    saveState(state);
    var step = state.steps[nextIdx];
    global.location.href = step.guidedUrl || guidedUrl(step.url, nextIdx + 1, state.steps.length);
  }

  function begin(routine) {
    var state = createState(routine || DEFAULT_ROUTINE);
    if (!state) return;
    saveState(state);
    global.location.href = state.steps[0].guidedUrl;
  }

  function beginFromProfile() {
    var state = stateFromProfile();
    if (state) {
      saveState(state);
      global.location.href = state.steps[state.currentStep].guidedUrl;
      return;
    }
    begin(DEFAULT_ROUTINE);
  }

  function beginSubjectRoutine(courseId, subjectId, minutes, opts) {
    opts = opts || {};
    if (!global.LipaCurriculum || !courseId || !subjectId) return false;

    var routine = LipaCurriculum.buildRoutineForSubject(courseId, subjectId, minutes || 5);
    if (!routine || !routine.steps || !routine.steps.length) return false;

    if (opts.syncProfile !== false && global.LipaRoutineSubjects) {
      LipaRoutineSubjects.applySelection([subjectId], { rebuild: false });
    }
    if (opts.syncProfile !== false && global.LipaBrain && LipaBrain.getProfile) {
      var p = LipaBrain.getProfile();
      if (p) {
        p.courseId = courseId;
        p.routineSubjects = [subjectId];
        p.focus = 'custom';
        p.minutes = routine.minutes;
        p.routine = routine;
        LipaBrain.saveProfile(p);
      }
    }

    begin(routine);
    return true;
  }

  function onStepRecorded(activityId) {
    if (!isActive()) return;
    var state = loadState();
    if (!state) state = stateFromProfile();
    if (!state) return;
    syncStateFromUrl(state);

    if (state.completedSteps.indexOf(state.currentStep) < 0) {
      state.completedSteps.push(state.currentStep);
    }
    saveState(state);
    showNextReady();
  }

  function bindDelegatedStarts() {
    document.addEventListener('click', function (e) {
      var guided = e.target.closest('[data-start-guided-routine]');
      if (guided) {
        e.preventDefault();
        beginFromProfile();
        return;
      }
      var fixed = e.target.closest('[data-start-fixed-routine]');
      if (fixed) {
        e.preventDefault();
        begin(DEFAULT_ROUTINE);
        return;
      }
      var subRoutine = e.target.closest('[data-start-subject-routine]');
      if (subRoutine) {
        e.preventDefault();
        var ok = beginSubjectRoutine(
          subRoutine.getAttribute('data-course-id'),
          subRoutine.getAttribute('data-subject-id'),
          parseInt(subRoutine.getAttribute('data-minutes'), 10) || 5
        );
        if (!ok) {
          window.alert('Aún no hay juegos listos en esta materia. Prueba otra unidad o vuelve pronto.');
        }
      }
    });
  }

  function initPage() {
    if (!isActive()) return;

    var state = loadState();
    if (!state) state = stateFromProfile();
    if (!state) {
      begin(DEFAULT_ROUTINE);
      return;
    }
    syncStateFromUrl(state);
    saveState(state);

    var totalUrl = getTotalFromUrl();
    if (totalUrl && totalUrl !== state.steps.length) {
      /* URL desactualizada: regenerar guidedUrl */
      state = createState({
        title: state.title,
        subtitle: state.subtitle,
        minutes: state.minutes,
        date: state.date,
        courseId: state.courseId,
        steps: state.steps
      });
      state.currentStep = Math.min(state.steps.length - 1, getPasoFromUrl() - 1);
      state.completedSteps = loadState() ? loadState().completedSteps || [] : [];
      saveState(state);
    }

    renderBar(state, { justFinished: false });
  }

  function showCompletionTeaser(container) {
    if (!container) return;
    var p = getParams();
    if (!p || p.get('rutina-completa') !== '1') return;
    var summary = null;
    try {
      var raw = sessionStorage.getItem('lipa-routine-summary');
      if (raw) summary = JSON.parse(raw);
      sessionStorage.removeItem('lipa-routine-summary');
    } catch (e) { /* ignore */ }
    var detail = '';
    if (summary && summary.practiced) {
      detail =
        '<p class="lipa-routine-done__detail">Hoy has practicado: <strong>' +
        summary.practiced +
        '</strong>. ' +
        (summary.streak ? 'Racha: <strong>' + summary.streak + ' días</strong> · ' : '') +
        (summary.xp ? 'XP total: <strong>' + summary.xp + '</strong>' : '') +
        '</p>';
    }
    var el = document.createElement('div');
    el.className = 'lipa-routine-done';
    el.innerHTML =
      '<p><strong>¡Entrenamiento completado!</strong> Tu cerebro ha entrenado hoy.</p>' +
      detail +
      '<p><a href="/entreno-completo.html">Ver resumen y Recreo Neon</a> · ' +
      '<a href="/mi-evolucion.html">Mi evolución</a> · <a href="/para-padres.html">Para padres</a></p>';
    container.insertBefore(el, container.firstChild);
    if (global.history && global.history.replaceState) {
      global.history.replaceState({}, '', global.location.pathname);
    }
  }

  global.LipaRoutineFlow = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_ROUTINE: DEFAULT_ROUTINE,
    isActive: isActive,
    begin: begin,
    beginFromProfile: beginFromProfile,
    beginSubjectRoutine: beginSubjectRoutine,
    beginDefault: function () { begin(DEFAULT_ROUTINE); },
    goNext: goNext,
    onStepRecorded: onStepRecorded,
    guidedUrl: guidedUrl,
    showCompletionTeaser: showCompletionTeaser
  };

  bindDelegatedStarts();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initPage();
      showCompletionTeaser(document.getElementById('lipa-brain-plan-mount'));
    });
  } else {
    initPage();
    showCompletionTeaser(document.getElementById('lipa-brain-plan-mount'));
  }
})(typeof window !== 'undefined' ? window : global);
