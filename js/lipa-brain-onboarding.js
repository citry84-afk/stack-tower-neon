/**
 * Wizard onboarding → rutina personalizada Brain Gym
 */
(function () {
  'use strict';

  var STEPS = ['welcome', 'course', 'time', 'subjects', 'goal', 'result'];
  var FAST_STEPS = ['map', 'course'];
  var state = {
    step: 0,
    displayName: '',
    courseId: null,
    ageBand: null,
    minutes: null,
    focus: 'all',
    routineSubjects: null,
    goal: null
  };

  var root, panel, onComplete;
  var gameQuick = false;
  var fastMode = false;
  var autoStart = false;

  var GAME_QUICK_META = {
    kicker: 'Primera vez aquí',
    title: '¿En qué curso estás?',
    lead: 'Así ajustamos las palabras a tu edad. Un toque y a jugar — sin registro.'
  };

  var FAST_COURSE_META = {
    kicker: 'Paso 2 de 2',
    title: '¿Qué curso vas?',
    lead: 'Toca el tuyo del cole. Lipi ajusta los juegos y abrimos el primero.'
  };

  var STEP_META = {
    map: {
      kicker: 'Primera vez',
      title: 'Así funciona LIPA',
      lead: 'Tres pasos. Sin cuenta. Sin perderte en menús.'
    },
    welcome: {
      kicker: 'LIPA Brain Gym',
      title: 'Tu rutina cerebral a medida',
      lead: 'Elige tu curso y te proponemos un plan de mates, idiomas y reflejos para hoy. Sin registro.'
    },
    course: {
      kicker: 'Paso 1 de 4',
      title: '¿En qué curso estás?',
      lead: 'Toca tu etapa arriba y elige tu curso. Verás un ✓ cuando lo tengas.'
    },
    time: {
      kicker: 'Paso 2 de 4',
      title: '¿Cuánto tiempo tienes?',
      lead: 'Un minuto por ejercicio en tu rutina.'
    },
    subjects: {
      kicker: 'Paso 3 de 4',
      title: '¿Qué materias entrenamos hoy?',
      lead: 'Marca todas las que quieras. Por defecto: todo el curso (mates, inglés, naturales…).'
    },
    goal: {
      kicker: 'Paso 4 de 4',
      title: '¿Para qué lo quieres?',
      lead: 'Solo para afinar tu plan (opcional rápido).'
    },
    result: {
      kicker: '¡Listo!',
      title: 'Tu plan de entrenamiento',
      lead: ''
    }
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function currentSteps() {
    if (gameQuick) return ['course'];
    if (fastMode) return FAST_STEPS;
    return STEPS;
  }

  function stepKey() {
    var steps = currentSteps();
    return steps[state.step] || steps[steps.length - 1];
  }

  function saveProfileFromState() {
    ensureSubjectSelection();
    if (!state.courseId || !window.LipaBrainPlan) return null;
    var profile = {
      displayName: state.displayName || (window.LipaBrainProfiles && LipaBrainProfiles.getActiveMeta()
        ? LipaBrainProfiles.getActiveMeta().name
        : 'Explorador'),
      courseId: state.courseId,
      ageBand: window.LipaCurriculum
        ? LipaCurriculum.courseToAgeBand(state.courseId)
        : state.ageBand,
      minutes: parseInt(state.minutes, 10) || 7,
      focus: state.focus || 'all',
      routineSubjects: state.routineSubjects,
      goal: state.goal || 'study'
    };
    var allSubs = LipaCurriculum.listLiveSubjects(LipaCurriculum.getCourse(state.courseId));
    if (profile.routineSubjects && profile.routineSubjects.length >= allSubs.length) {
      profile.focus = 'all';
    } else if (profile.routineSubjects && profile.routineSubjects.length) {
      profile.focus = 'custom';
    }
    var routine = LipaBrainPlan.buildRoutine(profile);
    profile.routine = routine;
    LipaBrainPlan.saveProfile(profile);
    try {
      window.dispatchEvent(new Event('lipa-profile-changed'));
    } catch (e) { /* ignore */ }
    return profile;
  }

  function finishGameQuick() {
    var profile = saveProfileFromState();
    if (!profile) return;
    if (window.LipaBrainPlay && LipaBrainPlay.chimeCorrect) {
      try { LipaBrainPlay.chimeCorrect(); } catch (e) { /* ignore */ }
    }
    close();
    if (onComplete) onComplete(profile);
  }

  function finishFastStart() {
    state.minutes = 7;
    state.goal = state.goal || 'fun';
    if (!state.displayName && window.LipaBrainProfiles) {
      var meta = LipaBrainProfiles.getActiveMeta();
      state.displayName = meta ? meta.name : 'Explorador';
    }
    var profile = saveProfileFromState();
    if (!profile) return;
    if (window.LipaBrainPlay && LipaBrainPlay.chimeCorrect) {
      try { LipaBrainPlay.chimeCorrect(); } catch (e) { /* ignore */ }
    }
    close();
    if (onComplete) {
      onComplete(profile);
    } else if (autoStart && window.LipaRoutineFlow && LipaRoutineFlow.beginFromProfile) {
      LipaRoutineFlow.beginFromProfile({ restart: true });
    }
  }

  function ensureRoot() {
    if (root) return root;
    root = document.getElementById('lipa-brain-onboarding');
    if (root) return root;

    root = document.createElement('div');
    root.id = 'lipa-brain-onboarding';
    root.className = 'brain-onboard';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'brain-onboard-title');
    root.hidden = true;
    root.innerHTML =
      '<div class="brain-onboard__backdrop" data-close></div>' +
      '<div class="brain-onboard__panel"></div>';
    document.body.appendChild(root);

    root.querySelector('[data-close]').addEventListener('click', close);
    panel = root.querySelector('.brain-onboard__panel');
    return root;
  }

  function open(opts) {
    opts = opts || {};
    ensureRoot();
    gameQuick = !!opts.gameQuick;
    fastMode = !gameQuick && opts.full !== true;
    if (opts.fast === false) fastMode = false;
    autoStart = !!opts.autoStart;
    state.step = 0;
    state.displayName = opts.displayName || state.displayName || '';
    state.courseId = opts.courseId || null;
    state.ageBand = null;
    state.minutes = opts.minutes || null;
    state.focus = 'all';
    state.routineSubjects = null;
    state.goal = opts.goal || null;
    onComplete = opts.onComplete;
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    if (window.LipaAnalytics && LipaAnalytics.trackGameStart) {
      LipaAnalytics.trackGameStart(
        gameQuick ? 'brain-onboarding-game' : (fastMode ? 'brain-onboarding-fast' : 'brain-onboarding')
      );
    }
  }

  function close() {
    if (root) root.hidden = true;
    document.body.style.overflow = '';
    gameQuick = false;
    fastMode = false;
    autoStart = false;
  }

  function renderMapStep() {
    return (
      '<div class="brain-onboard__map" role="list">' +
      '<div class="brain-onboard__map-row" role="listitem"><span class="brain-onboard__map-n">1</span>' +
      '<div><strong>Eliges curso</strong><span>El de verdad del cole — una sola vez.</span></div></div>' +
      '<div class="brain-onboard__map-row" role="listitem"><span class="brain-onboard__map-n">2</span>' +
      '<div><strong>Lipi te manda un juego</strong><span>Unos 7 min: mates, lengua o inglés.</span></div></div>' +
      '<div class="brain-onboard__map-row" role="listitem"><span class="brain-onboard__map-n">3</span>' +
      '<div><strong>Ganas XP</strong><span>Racha y nivel. Después, Recreo arcade si quieres 🎮</span></div></div>' +
      '</div>' +
      '<div class="brain-onboard__actions">' +
      '<button type="button" class="brain-onboard__btn brain-onboard__btn--primary" data-next>¡Vamos!</button>' +
      '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-advanced>Personalizar (padres)</button>' +
      '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-skip>Ahora no</button>' +
      '</div>'
    );
  }

  function render() {
    var key = stepKey();
    var meta = STEP_META[key];
    if (gameQuick && key === 'course') meta = GAME_QUICK_META;
    if (fastMode && key === 'course') meta = FAST_COURSE_META;
    var steps = currentSteps();
    var dots = '';
    if (!gameQuick && key !== 'result') {
      var dotSteps = fastMode ? FAST_STEPS : STEPS.slice(0, -1);
      dots = dotSteps.map(function (_, i) {
        return '<span class="brain-onboard__dot' + (i === state.step ? ' brain-onboard__dot--on' : '') + '"></span>';
      }).join('');
    } else if (gameQuick && key === 'course') {
      dots = '<span class="brain-onboard__dot brain-onboard__dot--on"></span>';
    }

    var body = '';
    if (key === 'map') {
      body = renderMapStep();
    } else if (key === 'welcome') {
      body =
        '<label class="brain-onboard__name-label" for="brain-onboard-name">¿Cómo te llamas?</label>' +
        '<input type="text" id="brain-onboard-name" class="brain-onboard__name-input" maxlength="20" placeholder="Ej: Ana" value="' + esc(state.displayName || '') + '">' +
        '<p class="brain-onboard__hint">¿Varios en casa? Crea un perfil por hermano/a con el botón + Hermano/a.</p>' +
        '<div class="brain-onboard__actions">' +
        '<button type="button" class="brain-onboard__btn brain-onboard__btn--primary" data-next>Empezar</button>' +
        '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-skip>Ahora no</button>' +
        '</div>';
    } else if (key === 'result') {
      body = renderResult();
    } else if (key === 'course' && (gameQuick || fastMode)) {
      body = renderCourseOptions() +
        '<p class="brain-onboard__hint">' + (fastMode
          ? 'Al tocar tu curso guardamos la edad y abrimos el primer juego. Cambia en <a href="/cursos.html">Cursos</a>.'
          : 'Al elegir curso guardamos tu edad en este dispositivo. Cambia en <a href="/cursos.html">Cursos</a>.') +
        '</p>' +
        '<div class="brain-onboard__actions">' +
        (fastMode ? '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-back>Atrás</button>' : '') +
        '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-skip">' +
        (fastMode ? 'Elegir después' : 'Nivel fácil sin elegir') +
        '</button></div>';
    } else {
      body = renderOptions(key) +
        '<div class="brain-onboard__actions">' +
        '<button type="button" class="brain-onboard__btn brain-onboard__btn--primary" data-next disabled id="brain-onboard-next">Continuar</button>' +
        (state.step > 0 ? '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-back>Atrás</button>' : '') +
        '</div>';
    }

    if (root) {
      root.classList.toggle('brain-onboard--step-course', key === 'course');
      root.classList.toggle('brain-onboard--step-welcome', key === 'welcome');
      root.classList.toggle('brain-onboard--step-map', key === 'map');
    }

    panel.innerHTML =
      (key !== 'result' ? '<div class="brain-onboard__progress">' + dots + '</div>' : '') +
      '<p class="brain-onboard__kicker">' + esc(meta.kicker) + '</p>' +
      '<h2 id="brain-onboard-title" class="brain-onboard__title">' + esc(meta.title) + '</h2>' +
      (meta.lead ? '<p class="brain-onboard__lead">' + esc(meta.lead) + '</p>' : '') +
      body;

    bindPanel();
    if (window.LipaCurriculumPage && LipaCurriculumPage.wireCoursePicker) {
      LipaCurriculumPage.wireCoursePicker(panel);
    }
  }

  function renderOptions(key) {
    var opts = [];
    if (key === 'course') {
      return renderCourseOptions();
    }
    if (key === 'time') {
      opts = [
        { v: '7', emoji: '⭐', label: '7 minutos', sub: 'Recomendado · Brain Gym diario' },
        { v: '5', emoji: '⏱️', label: '5 minutos', sub: 'Rutina express' },
        { v: '10', emoji: '⏰', label: '10 minutos', sub: 'Equilibrada' },
        { v: '15', emoji: '🏋️', label: '15 minutos', sub: 'Sesión completa' }
      ];
      return optionsHtml(opts, 'minutes', true);
    }
    if (key === 'subjects') {
      return renderSubjectsStep();
    }
    if (key === 'goal') {
      opts = [
        { v: 'study', emoji: '📖', label: 'Estudiar', sub: 'Más cálculo mental' },
        { v: 'gaming', emoji: '🎮', label: 'Gaming', sub: 'Más reflejos y aim' },
        { v: 'sport', emoji: '⚽', label: 'Deporte', sub: 'Reacción y coordinación' },
        { v: 'fun', emoji: '✨', label: 'Divertirme', sub: 'Mix equilibrado' }
      ];
      return optionsHtml(opts, 'goal');
    }
    return '';
  }

  function optionsHtml(opts, field, isNum) {
    return '<div class="brain-onboard__options" role="listbox">' +
      opts.map(function (o) {
        var val = state[field];
        var picked = (isNum ? String(val) === o.v : val === o.v);
        var dis = o.disabled ? ' disabled class="brain-onboard__opt brain-onboard__opt--soon"' : ' class="brain-onboard__opt' + (picked ? ' brain-onboard__opt--picked' : '') + '"';
        if (o.disabled) {
          return '<button type="button"' + dis + ' data-field="' + field + '" data-value="' + esc(o.v) + '" title="Próximamente">' +
            '<span class="brain-onboard__opt-emoji">' + o.emoji + '</span>' +
            '<span class="brain-onboard__opt-text"><strong>' + esc(o.label) + '</strong><span>' + esc(o.sub) + '</span></span>' +
            '</button>';
        }
        return '<button type="button" class="brain-onboard__opt' + (picked ? ' brain-onboard__opt--picked' : '') + '" data-field="' + field + '" data-value="' + esc(o.v) + '">' +
          '<span class="brain-onboard__opt-emoji">' + o.emoji + '</span>' +
          '<span class="brain-onboard__opt-text"><strong>' + esc(o.label) + '</strong><span>' + esc(o.sub) + '</span></span>' +
          '</button>';
      }).join('') +
      '</div>';
  }

  function ensureSubjectSelection() {
    if (!window.LipaCurriculum || !state.courseId) return;
    LipaCurriculum.init();
    var subs = LipaCurriculum.listLiveSubjects(LipaCurriculum.getCourse(state.courseId));
    if (!state.routineSubjects || !state.routineSubjects.length) {
      state.routineSubjects = subs.map(function (s) { return s.subjectId; });
    }
  }

  function renderSubjectsStep() {
    ensureSubjectSelection();
    if (!window.LipaCurriculum || !state.courseId) {
      return '<p class="brain-onboard__lead">Elige un curso en el paso anterior.</p>';
    }
    var subjects = LipaCurriculum.listLiveSubjects(LipaCurriculum.getCourse(state.courseId));
    var presets = [
      { key: 'all', label: '🌈 Todo' },
      { key: 'math', label: '➕ Mates' },
      { key: 'languages', label: '🗣️ Idiomas' },
      { key: 'science', label: '🔬 Naturales' },
      { key: 'social', label: '🌍 Sociales' },
      { key: 'reflex', label: '⚡ Reflejos' }
    ];
    var presetsHtml = presets.map(function (pr) {
      return '<button type="button" class="brain-onboard__subject-preset" data-subject-preset="' + esc(pr.key) + '">' + esc(pr.label) + '</button>';
    }).join('');

    var chips = subjects.map(function (sub) {
      var on = state.routineSubjects.indexOf(sub.subjectId) >= 0;
      return '<button type="button" class="brain-onboard__subject-chip' + (on ? ' brain-onboard__subject-chip--on' : '') +
        '" data-subject-id="' + esc(sub.subjectId) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        esc(sub.emoji + ' ' + sub.label) + '</button>';
    }).join('');

    return '<div class="brain-onboard__subject-presets">' + presetsHtml + '</div>' +
      '<div class="brain-onboard__subject-chips" role="group">' + chips + '</div>' +
      '<p class="brain-onboard__hint">Mínimo una materia. Puedes cambiarlo luego en Mi rutina.</p>' +
      '<div class="brain-onboard__actions">' +
      '<button type="button" class="brain-onboard__btn brain-onboard__btn--ghost" data-back>Atrás</button>' +
      '<button type="button" class="brain-onboard__btn brain-onboard__btn--primary" id="brain-onboard-next" data-next>Continuar</button>' +
      '</div>';
  }

  function renderCourseOptions() {
    if (!window.LipaCurriculum) {
      return '<p class="brain-onboard__lead">Cargando cursos… <a href="/cursos.html">Elegir en la web</a></p>';
    }
    LipaCurriculum.init();
    var defaultStage = 'primaria';
    if (state.courseId && LipaCurriculum.getCourse(state.courseId)) {
      defaultStage = LipaCurriculum.getCourse(state.courseId).stage || defaultStage;
    }
    var pickerHtml = '';
    if (window.LipaCurriculumPage && LipaCurriculumPage.buildCoursePickerHtml) {
      pickerHtml = LipaCurriculumPage.buildCoursePickerHtml({
        mode: 'onboard',
        selectedId: state.courseId,
        defaultStage: defaultStage
      });
    }
    return (
      '<div class="brain-onboard__course-picker">' + pickerHtml +
      '<p class="brain-onboard__course-foot"><a href="/cursos.html">Ver todos los cursos</a></p></div>'
    );
  }

  function renderResult() {
    state.minutes = state.minutes || 7;
    state.goal = state.goal || 'study';
    var profile = saveProfileFromState();
    if (!profile || !profile.routine) {
      return '<p class="brain-onboard__lead">Elige un curso para continuar.</p>';
    }
    var routine = profile.routine;

    var list = routine.steps.map(function (s) {
      return '<li class="brain-onboard__result-step">' +
        '<span class="brain-onboard__result-n">' + s.order + '</span>' +
        '<div class="brain-onboard__result-body"><strong>' + esc(s.emoji + ' ' + s.name) + '</strong><span>1 min · ' + esc(s.tip) + '</span></div>' +
        '</li>';
    }).join('');

    return '<p class="brain-onboard__lead">' + esc(routine.subtitle) + '</p>' +
      '<ul class="brain-onboard__result-steps">' + list + '</ul>' +
      '<div class="brain-onboard__actions">' +
      '<a href="#" class="brain-onboard__btn brain-onboard__btn--primary" style="text-align:center;text-decoration:none;line-height:48px;" data-start-guided-routine data-finish>Empezar rutina guiada</a>' +
      '<a href="/mi-rutina-cerebro.html" class="brain-onboard__btn brain-onboard__btn--ghost" style="text-align:center;text-decoration:none;line-height:48px;" data-finish>Ver mi plan</a>' +
      '</div>';
  }

  function bindPanel() {
    panel.querySelectorAll('[data-field]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var field = btn.getAttribute('data-field');
        var val = btn.getAttribute('data-value');
        if (field === 'minutes') state.minutes = parseInt(val, 10);
        if (field === 'courseId') {
          state.courseId = val;
          state.routineSubjects = null;
          if (gameQuick) {
            finishGameQuick();
            return;
          }
          if (fastMode) {
            finishFastStart();
            return;
          }
        } else state[field] = val;
        panel.querySelectorAll('[data-field="' + field + '"]').forEach(function (b) {
          b.classList.toggle('brain-onboard__opt--picked', b === btn);
          b.classList.toggle('is-picked', b === btn);
          if (field === 'courseId') {
            var go = b.querySelector('.lipa-course-pick__go');
            if (go) go.textContent = b === btn ? '✓' : '→';
          }
        });
        if (field === 'courseId' && btn.classList.contains('lipa-course-pick')) {
          btn.classList.add('lipa-course-pick--pop');
          setTimeout(function () {
            btn.classList.remove('lipa-course-pick--pop');
          }, 420);
          if (window.LipaBrainPlay && LipaBrainPlay.chimeCorrect) {
            try { LipaBrainPlay.chimeCorrect(); } catch (e) { /* ignore */ }
          }
        }
        var next = document.getElementById('brain-onboard-next');
        if (next) {
          next.disabled = false;
          next.classList.add('brain-onboard__btn--ready');
          setTimeout(function () {
            next.classList.remove('brain-onboard__btn--ready');
          }, 600);
        }
      });
    });

    var nextBtn = panel.querySelector('[data-next]');
    var nameInput = panel.querySelector('#brain-onboard-name');
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        state.displayName = nameInput.value.trim();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var key = stepKey();
        if (key === 'welcome') {
          if (nameInput) state.displayName = nameInput.value.trim();
          if (!state.displayName && window.LipaBrainProfiles) {
            var meta = LipaBrainProfiles.getActiveMeta();
            state.displayName = meta ? meta.name : '';
          }
        } else if (key !== 'map' && !canContinue()) return;
        state.step++;
        var nextKey = stepKey();
        if (nextKey === 'result') finishAndShow();
        else render();
      });
    }

    var advanced = panel.querySelector('[data-advanced]');
    if (advanced) {
      advanced.addEventListener('click', function () {
        fastMode = false;
        state.step = 0;
        render();
      });
    }

    var back = panel.querySelector('[data-back]');
    if (back) {
      back.addEventListener('click', function () {
        state.step = Math.max(0, state.step - 1);
        render();
      });
    }

    var skip = panel.querySelector('[data-skip]');
    if (skip) skip.addEventListener('click', close);

    panel.querySelectorAll('[data-subject-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-subject-id');
        var i = state.routineSubjects.indexOf(id);
        if (i >= 0) {
          if (state.routineSubjects.length > 1) state.routineSubjects.splice(i, 1);
        } else {
          state.routineSubjects.push(id);
        }
        render();
      });
    });

    panel.querySelectorAll('[data-subject-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-subject-preset');
        ensureSubjectSelection();
        var subs = LipaCurriculum.listLiveSubjects(LipaCurriculum.getCourse(state.courseId));
        var allIds = subs.map(function (s) { return s.subjectId; });
        if (key === 'all') {
          state.routineSubjects = allIds.slice();
        } else if (window.LipaRoutineSubjects && LipaRoutineSubjects.PRESETS[key]) {
          var preset = LipaRoutineSubjects.PRESETS[key];
          state.routineSubjects = (preset.ids || []).filter(function (id) {
            return allIds.indexOf(id) >= 0;
          });
          if (!state.routineSubjects.length) state.routineSubjects = allIds.slice();
        }
        state.focus = state.routineSubjects.length >= allIds.length ? 'all' : 'custom';
        render();
      });
    });

    panel.querySelectorAll('[data-finish]').forEach(function (el) {
      el.addEventListener('click', function () {
        if (window.gtag) {
          gtag('event', 'lipa_onboarding_complete', { minutes: state.minutes, focus: state.focus });
        }
        close();
        if (onComplete) onComplete(LipaBrainPlan.getProfile());
      });
    });
  }

  function canContinue() {
    var key = stepKey();
    if (key === 'course') return !!state.courseId;
    if (key === 'time') return !!state.minutes;
    if (key === 'subjects') {
      ensureSubjectSelection();
      return state.routineSubjects && state.routineSubjects.length > 0;
    }
    if (key === 'goal') return !!state.goal;
    return true;
  }

  function finishAndShow() {
    render();
  }

  function renderPlanCard(container) {
    if (!container || !window.LipaBrainPlan) return;
    if (window.LipaBrain && LipaBrain.refreshProfileRoutine) LipaBrain.refreshProfileRoutine();
    var p = LipaBrainPlan.getProfile();
    if (!p || !p.routine) {
      container.innerHTML =
        '<div class="brain-plan-teaser">' +
        '<p><strong>¿Primera vez?</strong> Dos pasos: ves cómo va y eliges curso. Lipi abre el primer juego.</p>' +
        '<button type="button" class="lipa-btn lipa-btn--primary lipa-btn--brain" data-open-onboarding>Empezar ahora</button>' +
        '<button type="button" class="lipa-btn lipa-btn--secondary" data-open-onboarding-full>Personalizar (padres)</button>' +
        '</div>';
      var btn = container.querySelector('[data-open-onboarding]');
      if (btn) {
        btn.addEventListener('click', function () {
          open({ fast: true, autoStart: true, onComplete: function () { renderPlanCard(container); } });
        });
      }
      var btnFull = container.querySelector('[data-open-onboarding-full]');
      if (btnFull) {
        btnFull.addEventListener('click', function () {
          open({ full: true, onComplete: function () { renderPlanCard(container); } });
        });
      }
      return;
    }

    var r = p.routine;
    var progressHtml = '';
    if (p.courseId && window.LipaCurriculum) {
      var course = LipaCurriculum.getCourse(p.courseId);
      if (course) {
        var cp = LipaCurriculum.courseProgress(course);
        var cont = LipaCurriculum.getContinueTarget(p.courseId);
        progressHtml =
          '<div class="brain-plan-progress" role="status">' +
          '<div class="curriculum-bar" style="margin-bottom:8px"><div class="curriculum-bar__fill" style="width:' +
          cp.percent + '%"></div></div>' +
          '<p class="brain-plan-progress__meta">' + cp.done + ' / ' + cp.total +
          ' actividades · ' + cp.percent + '% del curso</p>';
        if (cont && cont.type === 'activity') {
          progressHtml +=
            '<a href="' + esc(cont.href) + '" class="lipa-btn lipa-btn--secondary brain-plan-progress__next">' +
            'Continuar: ' + esc(cont.label) + ' →</a>';
        }
        progressHtml += '</div>';
      }
    }

    var steps = r.steps.map(function (s) {
      return '<li class="brain-plan-step">' +
        '<a href="' + esc(s.url) + '">' +
        '<span class="brain-plan-step__n">' + s.order + '</span>' +
        '<span class="brain-plan-step__emoji">' + s.emoji + '</span>' +
        '<span class="brain-plan-step__info"><strong>' + esc(s.name) + '</strong><span>' + esc(s.tip) + '</span></span>' +
        '</a></li>';
    }).join('');

    container.innerHTML =
      '<div class="brain-plan-card">' +
      '<div class="brain-plan-card__head">' +
      '<p class="brain-eyebrow">Tu plan personal</p>' +
      '<h2 class="brain-plan-card__title">' + esc(r.title) + '</h2>' +
      '<p class="brain-plan-card__sub">' + esc(r.subtitle) + '</p>' +
      progressHtml +
      '</div>' +
      '<ol class="brain-plan-steps">' + steps + '</ol>' +
      '<div class="brain-plan-card__actions">' +
      '<a href="#" id="home-start-work" class="lipa-btn lipa-btn--primary lipa-btn--brain" data-start-guided-routine>Empezar rutina guiada</a>' +
      '<a href="/mi-evolucion.html" class="lipa-btn lipa-btn--secondary">Mi evolución</a>' +
      '<button type="button" class="lipa-btn lipa-btn--secondary" data-redo-plan>Cambiar respuestas</button>' +
      '</div></div>';

    var redo = container.querySelector('[data-redo-plan]');
    if (redo) {
      redo.addEventListener('click', function () {
        open({ full: true, onComplete: function () { renderPlanCard(container); } });
      });
    }
    if (window.LipaHomeBrain && LipaHomeBrain.refreshHomeMode) {
      LipaHomeBrain.refreshHomeMode();
    }
  }

  function autoOpenIfNeeded() {
    if (!window.LipaBrainPlan || !LipaBrainPlan.shouldShowOnboarding()) return;
    setTimeout(function () { open({ fast: true, autoStart: true }); }, 450);
  }

  window.LipaBrainOnboarding = {
    open: open,
    openGameCourse: function (opts) {
      open(Object.assign({ gameQuick: true }, opts || {}));
    },
    close: close,
    renderPlanCard: renderPlanCard,
    autoOpenIfNeeded: autoOpenIfNeeded
  };

  function mountRoutineSubjectsPicker() {
    if (!window.LipaRoutineSubjects) return;
    document.querySelectorAll('[data-lipa-routine-subjects]').forEach(function (el) {
      LipaRoutineSubjects.mount(el, {
        compact: el.getAttribute('data-lipa-routine-subjects') === 'compact'
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('lipa-brain-plan-mount');
    mountRoutineSubjectsPicker();
    if (mount) renderPlanCard(mount);
    if (document.body.getAttribute('data-brain-onboard-auto') === '1') {
      autoOpenIfNeeded();
    }
  });

  window.addEventListener('lipa-profile-changed', function () {
    mountRoutineSubjectsPicker();
    var mount = document.getElementById('lipa-brain-plan-mount');
    if (mount) renderPlanCard(mount);
  });

  window.addEventListener('lipa-routine-subjects-changed', function () {
    var mount = document.getElementById('lipa-brain-plan-mount');
    if (mount) renderPlanCard(mount);
  });
})();
