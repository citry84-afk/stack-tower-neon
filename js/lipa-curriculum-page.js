/**
 * Renderizado de páginas curriculares (cursos, curso, materia, unidad)
 */
(function (global) {
  'use strict';

  var C = global.LipaCurriculum;

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function breadcrumb(items) {
    return '<nav class="curriculum-breadcrumb" aria-label="Ruta">' +
      items.map(function (item, i) {
        if (i === items.length - 1) {
          return '<span aria-current="page">' + C.esc(item.label) + '</span>';
        }
        return '<a href="' + C.esc(item.href) + '">' + C.esc(item.label) + '</a><span aria-hidden="true">›</span>';
      }).join('') +
      '</nav>';
  }

  function progressBar(percent, label) {
    var bar =
      '<div class="curriculum-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100">' +
      '<div class="curriculum-bar__fill" style="width:' + percent + '%"></div></div>';
    if (!label) return bar;
    return bar +
      '<div class="curriculum-meta-row"><span>' + C.esc(label) + '</span><span>' + percent + '%</span></div>';
  }

  function defaultPickerStage() {
    try {
      if (global.LipaBrainPlan && typeof LipaBrainPlan.loadProfile === 'function') {
        var p = LipaBrainPlan.loadProfile();
        if (p && p.courseId) {
          var c = C.getCourse(p.courseId);
          if (c && c.stage) return c.stage;
        }
      }
    } catch (e) { /* ignore */ }
    return 'primaria';
  }

  function buildCoursePickerHtml(options) {
    options = options || {};
    var mode = options.mode || 'link';
    var selectedId = options.selectedId || '';
    var defaultStage = options.defaultStage || 'primaria';
    C.init();
    var stages = C.listStages();
    var tabs = '';
    var panels = '';

    stages.forEach(function (stage) {
      var active = stage.id === defaultStage;
      tabs +=
        '<button type="button" class="lipa-course-picker__tab lipa-course-picker__tab--' + stage.id +
        (active ? ' is-active' : '') + '" role="tab" aria-selected="' + (active ? 'true' : 'false') +
        '" data-stage="' + stage.id + '" id="picker-tab-' + stage.id + '">' +
        '<span class="lipa-course-picker__tab-emoji" aria-hidden="true">' + stage.emoji + '</span>' +
        '<span class="lipa-course-picker__tab-label">' + C.esc(stage.label) + '</span></button>';

      var list = '';
      stage.courses.forEach(function (course) {
        if (course.status === 'soon' && mode === 'link') return;
        var games = C.courseGamesLabel(course);
        var picked = selectedId === course.id;
        var disabled = course.status === 'soon';
        var pickClass =
          'lipa-course-pick lipa-course-pick--' + stage.id +
          (picked ? ' is-picked' : '') +
          (disabled ? ' is-disabled' : '');

        if (mode === 'onboard') {
          list +=
            '<li><button type="button" class="' + pickClass + '" data-field="courseId" data-value="' +
            C.esc(course.id) + '"' + (disabled ? ' disabled' : '') + '>' +
            '<span class="lipa-course-pick__orb">' + C.esc(course.shortLabel) + '</span>' +
            '<span class="lipa-course-pick__body"><strong>' + C.esc(course.label) +
            (C.isFeaturedCourse(course.id) ? ' <span class="lipa-course-pick__mvp">Más contenido</span>' : '') +
            '</strong><span>' + C.esc(course.ageRange) + ' · ' + C.esc(games) + '</span></span>' +
            '<span class="lipa-course-pick__go" aria-hidden="true">' + (picked ? '✓' : '→') + '</span></button></li>';
        } else {
          var seoPath =
            !options.guidedLinks &&
            global.LipaCourseSeo &&
            LipaCourseSeo.seoPathForCourseId
              ? LipaCourseSeo.seoPathForCourseId(course.id)
              : null;
          var courseHref = seoPath
            ? seoPath
            : '/curso.html?c=' + encodeURIComponent(course.id) +
              (options.guidedLinks ? '&empezar=1' : '');
          list +=
            '<li><a href="' + courseHref + '" class="' + pickClass + '" data-course-id="' + C.esc(course.id) + '">' +
            '<span class="lipa-course-pick__orb">' + C.esc(course.shortLabel) + '</span>' +
            '<span class="lipa-course-pick__body"><strong>' + C.esc(course.label) +
            (C.isFeaturedCourse(course.id) ? ' <span class="lipa-course-pick__mvp">Más contenido</span>' : '') +
            '</strong><span>' + C.esc(course.ageRange) + ' · ' + C.esc(games) + '</span></span>' +
            '<span class="lipa-course-pick__go" aria-hidden="true">→</span></a></li>';
        }
      });

      if (mode === 'onboard') {
        panels +=
          '<div class="lipa-course-picker__panel lipa-course-picker__panel--' + stage.id +
          (active ? ' is-active' : '') + '" role="tabpanel" data-stage-panel="' +
          stage.id + '" id="picker-panel-' + stage.id + '"' + (active ? '' : ' hidden') + '>' +
          '<p class="lipa-course-picker__stage-desc lipa-course-picker__stage-desc--onboard">' +
          C.esc(stage.desc) + '</p>' +
          '<ul class="lipa-course-picker__list">' + list + '</ul></div>';
      } else {
        panels +=
          '<div class="lipa-course-picker__panel lipa-course-picker__panel--' + stage.id +
          (active ? ' is-active' : '') + '" role="tabpanel" data-stage-panel="' +
          stage.id + '" id="picker-panel-' + stage.id + '"' + (active ? '' : ' hidden') + '>' +
          '<header class="lipa-course-picker__panel-head">' +
          '<span class="lipa-course-picker__panel-emoji" aria-hidden="true">' + stage.emoji + '</span>' +
          '<div><h2 class="lipa-course-picker__panel-title">' + C.esc(stage.label) + '</h2>' +
          '<p class="lipa-course-picker__stage-desc">' + C.esc(stage.desc) + '</p></div></header>' +
          '<ul class="lipa-course-picker__list">' + list + '</ul></div>';
      }
    });

    var pickerRootClass =
      'lipa-course-picker lipa-course-picker--playful' + (mode === 'onboard' ? ' lipa-course-picker--onboard' : '');

    return (
      '<div class="' + pickerRootClass + '">' +
      '<div class="lipa-course-picker__deco" aria-hidden="true">' +
      '<span class="lipa-course-picker__blob lipa-course-picker__blob--a"></span>' +
      '<span class="lipa-course-picker__blob lipa-course-picker__blob--b"></span></div>' +
      '<div class="lipa-course-picker__tabs" role="tablist" aria-label="Etapa escolar">' + tabs + '</div>' +
      '<div class="lipa-course-picker__panels">' + panels + '</div></div>'
    );
  }

  function wireCoursePicker(root) {
    if (!root) return;
    var picker = root.querySelector('.lipa-course-picker');
    if (!picker) return;
    var tabs = picker.querySelectorAll('.lipa-course-picker__tab');
    var panels = picker.querySelectorAll('.lipa-course-picker__panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-stage');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          var on = p.getAttribute('data-stage-panel') === id;
          p.classList.toggle('is-active', on);
          if (on) p.removeAttribute('hidden');
          else p.setAttribute('hidden', '');
        });
      });
    });

    picker.querySelectorAll('a.lipa-course-pick[data-course-id]').forEach(function (link) {
      link.addEventListener('click', function () {
        var id = link.getAttribute('data-course-id');
        if (global.LipaGuidedPath && LipaGuidedPath.hasProfile && LipaGuidedPath.hasProfile()) {
          LipaGuidedPath.saveCourseId(id);
        }
      });
    });
  }

  function renderCoursesPage(root) {
    C.init();
    var hasProf = global.LipaGuidedPath && LipaGuidedPath.hasProfile();
    var html =
      '<div class="curriculum-picker-page">' +
      '<div id="lipi-mascot-mount" class="curriculum-picker-page__mascot"></div>' +
      '<div id="lipa-guided-mount" class="curriculum-guided-mount"></div>' +
      '<header class="curriculum-hero curriculum-hero--picker curriculum-hero--playful">' +
      '<p class="brain-eyebrow">LIPA Brain Gym</p>' +
      '<h1>' + (hasProf ? 'Tu curso y tu trabajo' : '¿En qué curso estás?') + '</h1>' +
      '<p class="curriculum-hero__lead">' +
      (hasProf
        ? 'Pulsa el botón de arriba para entrenar hoy. Si cambias de curso, elige una tarjeta abajo.'
        : 'Elige curso una vez; después Lipi te guía misión a misión sin menús.') +
      '</p>' +
      '<p class="curriculum-hero__chips"><span>🎯 Sin pensar</span><span>⚡ 7 min al día</span></p>' +
      '</header><div class="curriculum-wrap curriculum-wrap--picker">';

    html += buildCoursePickerHtml({
      mode: 'link',
      defaultStage: defaultPickerStage(),
      guidedLinks: !!(global.LipaGuidedPath && LipaGuidedPath.hasProfile())
    });
    html +=
      '<div class="lipa-course-picker__promo">' +
      '<a href="/retos-rapidos.html" class="lipa-course-picker__promo-card">' +
      '<span class="lipa-course-picker__promo-emoji" aria-hidden="true">⚡</span>' +
      '<span class="lipa-course-picker__promo-text"><strong>Retos rápidos</strong>' +
      '<span>Lógica, ortografía y cultura en 5 min</span></span>' +
      '<span class="lipa-course-picker__promo-go" aria-hidden="true">→</span></a></div>' +
      '<p class="lipa-course-picker__foot">¿Ya tienes rutina? <a href="/mi-rutina-cerebro.html">Ver mi plan</a> · <a href="/">Inicio</a></p></div></div>';

    root.innerHTML = sanitizeMotion(html);
    wireCoursePicker(root);
    document.title = 'Cursos escolares | LIPA Brain Gym';
    if (global.LipaMascot) LipaMascot.render(document.getElementById('lipi-mascot-mount'), 'welcome');
    mountGuidedStrip({ page: 'courses' });
  }

  function sanitizeMotion(html) {
    return html
      .replace(/<motion\b([^>]*)>/gi, '<div$1>')
      .replace(/<\/motion>/gi, '</div>');
  }

  function mountGuidedStrip(ctx) {
    var mount = document.getElementById('lipa-guided-mount');
    if (!mount || !global.LipaGuidedPath) return;
    LipaGuidedPath.mountStrip(mount, ctx);
    LipaGuidedPath.wireStrip(mount);
    LipaGuidedPath.tryAutoStart(ctx);
  }

  function renderCoursePage(root) {
    var courseId = qs('c');
    var course = C.getCourse(courseId);
    if (!course) {
      root.innerHTML = '<p class="curriculum-wrap">Curso no encontrado. <a href="/cursos.html">Ver todos los cursos</a></p>';
      return;
    }

    if (course.stage) {
      document.body.setAttribute('data-brain-stage', course.stage);
    }

    var prog = C.courseProgress(course);
    var html = breadcrumb([
      { href: '/cursos.html', label: 'Cursos' },
      { label: course.label }
    ]);

    html += '<div class="curriculum-wrap">' +
      '<div id="lipa-guided-mount" class="curriculum-guided-mount"></div>' +
      '<header class="curriculum-course-header">' +
      '<div><p class="brain-eyebrow">' + C.esc(course.ageRange) + (prog.total ? ' · ' + prog.total + ' juegos' : '') + '</p>' +
      '<h1>' + C.esc(course.label) + '</h1>' +
      '<p>Tu trabajo de hoy está arriba: un botón y Lipi te pasa de misión en misión.</p></div>' +
      '<div class="curriculum-progress-ring"><strong>' + prog.percent + '%</strong><span>completado</span></div>' +
      '</header>' +
      progressBar(prog.percent, prog.done + ' de ' + prog.total + ' actividades');

    var schoolIds = C.schoolSubjectIds();
    var schoolBlocks = course.subjects.filter(function (b) { return schoolIds.indexOf(b.subjectId) >= 0; });
    var dailyBlock = course.subjects.filter(function (b) { return b.subjectId === 'brain-gym-diario'; })[0];
    var nextAct = C.findNextActivity(course.id);

    function subjectCard(block) {
      var sub = C.enrichSubject(course, block);
      var sp = C.subjectProgress(sub);
      var themeClass = 'curriculum-subject-card--' + (sub.theme || 'default');
      var isNext = nextAct && nextAct.subjectId === sub.subjectId;
      var seoMateria =
        !isNext &&
        global.LipaCourseSeo &&
        LipaCourseSeo.seoPathForSubject
          ? LipaCourseSeo.seoPathForSubject(course.id, sub.subjectId)
          : null;
      var materiaHref = seoMateria
        ? seoMateria
        : '/materia.html?c=' + encodeURIComponent(course.id) + '&m=' + encodeURIComponent(sub.subjectId) +
          (isNext ? '&empezar=1' : '');
      return '<a href="' + materiaHref + '" class="curriculum-subject-card ' + themeClass +
        (isNext ? ' curriculum-subject-card--next' : '') + '">' +
        '<div class="curriculum-subject-card__top"><span class="curriculum-subject-card__emoji">' + sub.emoji + '</span><h2>' + C.esc(sub.label) + '</h2></div>' +
        '<p>' + C.esc(sub.desc) + '</p>' +
        progressBar(sp.percent, sp.done + '/' + sp.total + ' actividades') +
        '<div class="curriculum-meta-row"><span>' + sub.units.length + ' unidades</span><span class="curriculum-meta-row__cta">' +
        (isNext ? 'Siguiente · ' : '') + C.esc(C.subjectFooterLabel(sub, sp)) + ' →</span></div>';
    }

    html += '<h2 class="curriculum-zone-title">Materias del cole</h2>' +
      (C.isFeaturedCourse(course.id) ? '<p class="curriculum-zone-hint">Curso con contenido ampliado · ideal para empezar</p>' : '') +
      '<div class="curriculum-subject-grid">';

    schoolBlocks.forEach(function (block) { html += subjectCard(block); });
    html += '</div>';

    if (dailyBlock) {
      html += '<h2 class="curriculum-zone-title">Brain Gym diario</h2><div class="curriculum-subject-grid curriculum-subject-grid--single">';
      html += subjectCard(dailyBlock);
      html += '</div>';
    }

    if (global.LipaQuickTests) {
      var ageBand = course.ageBand || C.courseToAgeBand(course.id);
      html += '<h2 class="curriculum-zone-title">Retos rápidos</h2>' +
        '<p class="curriculum-zone-hint">3–5 min · sin presión · suma variedad al entreno</p>' +
        LipaQuickTests.renderCardsHtml({ ageBand: ageBand, courseId: course.id }) +
        '<p class="curriculum-zone-more"><a href="/retos-rapidos.html?c=' + encodeURIComponent(course.id) + '">Ver todos los retos</a></p>';
    }

    html += '<div class="curriculum-callout">' +
      '<a href="/mi-rutina-cerebro.html">Personalizar mi rutina</a> · ' +
      '<a href="/entrenador-cerebro.html">Entrenador 7 min</a></div></div>';

    root.innerHTML = sanitizeMotion(html);
    if (global.LipaCourseSeo && LipaCourseSeo.applyForCourse) {
      LipaCourseSeo.applyForCourse(course);
    } else {
      document.title = course.label + ' | LIPA Brain Gym';
    }
    mountGuidedStrip({ page: 'course', courseId: course.id });
  }

  function renderSubjectPage(root) {
    var courseId = qs('c');
    var subjectId = qs('m');
    var ctx = C.getSubject(courseId, subjectId);
    if (!ctx) {
      root.innerHTML = '<p class="curriculum-wrap">Materia no encontrada.</p>';
      return;
    }

    var course = ctx.course;
    var sub = ctx.subject;
    var sp = C.subjectProgress(sub);

    var html = breadcrumb([
      { href: '/cursos.html', label: 'Cursos' },
      { href: '/curso.html?c=' + encodeURIComponent(course.id), label: course.shortLabel },
      { label: sub.label }
    ]);

    var liveN = C.countLiveActivitiesForSubject(course.id, sub.subjectId);
    var routineBox = '';
    if (liveN > 0 && !global.LipaGuidedPath) {
      routineBox =
        '<div class="curriculum-subject-routine curriculum-subject-routine--' + esc(sub.theme || 'default') + '">' +
        '<p class="curriculum-subject-routine__lead">Entrena solo <strong>' + esc(sub.label) + '</strong> sin buscar en el menú.</p>' +
        '<div class="curriculum-subject-routine__actions">' +
        '<button type="button" class="lipa-btn lipa-btn--primary" data-start-subject-routine data-course-id="' + esc(course.id) +
        '" data-subject-id="' + esc(sub.subjectId) + '" data-minutes="5">' +
        '⚡ Rutina 5 min · solo ' + esc(sub.label) + '</button>' +
        (liveN >= 4
          ? '<button type="button" class="lipa-btn lipa-btn--secondary" data-start-subject-routine data-course-id="' + esc(course.id) +
            '" data-subject-id="' + esc(sub.subjectId) + '" data-minutes="10">10 min</button>'
          : '') +
        '</div>' +
        '<p class="curriculum-subject-routine__meta">' + liveN + ' actividades disponibles · se guarda en tu rutina</p>' +
        '</div>';
    } else if (liveN <= 0) {
      routineBox =
        '<p class="curriculum-subject-routine curriculum-subject-routine--empty">Próximamente más juegos en esta materia. Mientras tanto, explora las unidades.</p>';
    }

    html += '<div class="curriculum-wrap"><div id="lipa-guided-mount" class="curriculum-guided-mount"></div><div id="lipi-mascot-mount"></div><header class="curriculum-hero" style="text-align:left;padding-left:0">' +
      '<p class="brain-eyebrow">' + sub.emoji + ' ' + C.esc(course.label) + '</p>' +
      '<h1 style="text-align:left">' + C.esc(sub.label) + '</h1>' +
      '<p style="text-align:left;margin:0">' + C.esc(sub.desc) + '</p></header>' +
      routineBox +
      progressBar(sp.percent, 'Progreso en ' + sub.label) +
      '<ol class="curriculum-unit-list" style="margin-top:1.25rem">';

    var nextInSubject = C.findNextActivity(course.id, { subjectId: sub.subjectId });
    var nextUnitId = nextInSubject && nextInSubject.unit ? nextInSubject.unit.id : null;

    sub.units.forEach(function (unit, idx) {
      var up = C.unitProgress(unit);
      var isNextUnit = nextUnitId && unit.id === nextUnitId;
      var unitHref =
        '/unidad.html?c=' + encodeURIComponent(course.id) + '&m=' + encodeURIComponent(sub.subjectId) +
        '&u=' + encodeURIComponent(unit.id) + (isNextUnit ? '&empezar=1' : '');
      html += '<li><a href="' + unitHref + '" class="curriculum-unit-card' + (isNextUnit ? ' curriculum-unit-card--next' : '') + '">' +
        '<h3>Unidad ' + (idx + 1) + ': ' + C.esc(unit.title) + '</h3>' +
        '<p>' + C.esc(unit.description) + '</p>' +
        progressBar(up.percent, up.hasLive ? up.done + '/' + up.total + ' completadas' : 'Próximamente') +
        '</a></li>';
    });

    html += '</ol></div>';
    root.innerHTML = sanitizeMotion(html);
    if (global.LipaCourseSeo && LipaCourseSeo.applyForSubject) {
      LipaCourseSeo.applyForSubject(course, sub);
    } else {
      document.title = sub.label + ' · ' + course.label + ' | LIPA Brain Gym';
    }
    if (global.LipaMascot) {
      LipaMascot.render(
        document.getElementById('lipi-mascot-mount'),
        'routine',
        global.LipaGuidedPath
          ? 'Pulsa el botón morado: Lipi te lleva a la siguiente misión.'
          : 'Pulsa «Rutina 5 min» para entrenar solo ' + sub.label + ' — ¡rápido y sin vueltas!'
      );
    }
    mountGuidedStrip({ page: 'subject', subjectId: sub.subjectId, subjectLabel: sub.label });
  }

  function renderUnitPage(root) {
    var courseId = qs('c');
    var subjectId = qs('m');
    var unitId = qs('u');
    var ctx = C.getUnit(courseId, subjectId, unitId);
    if (!ctx) {
      root.innerHTML = '<p class="curriculum-wrap">Unidad no encontrada.</p>';
      return;
    }

    var diffLabels = (global.LipaCurriculumMeta && global.LipaCurriculumMeta.DIFFICULTY_LABELS) || {};
    var html = breadcrumb([
      { href: '/cursos.html', label: 'Cursos' },
      { href: '/curso.html?c=' + encodeURIComponent(ctx.course.id), label: ctx.course.shortLabel },
      { href: '/materia.html?c=' + encodeURIComponent(ctx.course.id) + '&m=' + encodeURIComponent(ctx.subject.subjectId), label: ctx.subject.label },
      { label: ctx.unit.title }
    ]);

    var nextInUnit = C.findNextActivity(courseId, { subjectId: subjectId, unitId: unitId });
    var nextActId = nextInUnit && nextInUnit.activity ? nextInUnit.activity.id : null;
    var minPct = Math.round((C.getMinAccuracy ? C.getMinAccuracy(courseId) : 0.6) * 100);

    html += '<div class="curriculum-wrap"><div id="lipa-guided-mount" class="curriculum-guided-mount"></div><div id="lipi-mascot-mount"></div><header class="curriculum-hero" style="text-align:left;padding:0 0 1rem">' +
      '<h1 style="text-align:left;font-size:1.5rem">' + C.esc(ctx.unit.title) + '</h1>' +
      '<p style="text-align:left">' + C.esc(ctx.unit.description) + '</p></header>' +
      '<div class="curriculum-activity-grid">';

    var catalogGames = (global.LipaBrainCatalog && global.LipaBrainCatalog.GAMES) || {};

    ctx.unit.activities.forEach(function (act) {
      var diff = diffLabels[act.difficulty] || { name: 'Nivel ' + act.difficulty };
      var done = C.isActivityComplete(act.id);
      var url = C.activityUrl(courseId, subjectId, unitId, act);
      var isLive = act.status === 'live' && url;
      var isNext = isLive && nextActId && act.id === nextActId && !done;
      var cls = 'curriculum-activity-card' + (isLive ? ' curriculum-activity-card--live' : ' curriculum-activity-card--soon') + (done ? ' curriculum-activity-card--done' : '') + (isNext ? ' curriculum-activity-card--next' : '');
      var gameMeta = act.gameId && catalogGames[act.gameId];
      var gameLabel = gameMeta ? (gameMeta.short || gameMeta.name) : '';

      if (isLive) {
        var hook = (global.LipaBrainPlay && LipaBrainPlay.missionCardLine)
          ? LipaBrainPlay.missionCardLine(act)
          : (act.tip || '');
        var hookHtml = hook
          ? '<em class="curriculum-activity-card__hook">' + C.esc(hook) + '</em>'
          : '';
        html += '<a href="' + C.esc(url) + '" class="' + cls + '">' +
          '<span class="curriculum-activity-card__level">' + act.difficulty + '</span>' +
          '<span class="curriculum-activity-card__body"><strong>' + C.esc(act.title) + '</strong>' +
          hookHtml +
          '<span>' + (gameLabel ? C.esc(gameLabel) + ' · ' : '') + C.esc(diff.name) + ' · ~' + act.estimatedMinutes + ' min · meta ' + minPct + '% · +' + act.rewardXp + ' XP' + (done ? ' · ✓ hecho' : '') + '</span></span>' +
          '<span class="curriculum-activity-card__cta">' + (isNext ? 'Siguiente →' : done ? 'Repetir' : 'Jugar') + ' →</span></a>';
      } else {
        html += '<div class="' + cls + '">' +
          '<span class="curriculum-activity-card__level">' + act.difficulty + '</span>' +
          '<span class="curriculum-activity-card__body"><strong>' + C.esc(act.title) + '</strong>' +
          '<span>' + C.esc(diff.name) + ' · más pronto</span></span>' +
          '<span class="curriculum-activity-card__tag">Próximamente</span></div>';
      }
    });

    html += '</div><p style="margin-top:1.5rem;text-align:center">' +
      '<a href="/materia.html?c=' + encodeURIComponent(courseId) + '&m=' + encodeURIComponent(subjectId) + '">← Volver a ' + C.esc(ctx.subject.label) + '</a></p></div>';

    root.innerHTML = sanitizeMotion(html);
    document.title = ctx.unit.title + ' | LIPA Brain Gym';
    if (global.LipaMascot) {
      LipaMascot.render(
        document.getElementById('lipi-mascot-mount'),
        'routine',
        nextActId
          ? 'La misión resaltada es la que toca ahora. Pulsa el botón morado o la tarjeta.'
          : 'Elige una misión. Termina la ronda con al menos ' + minPct + '% de aciertos (o completa la sesión con esfuerzo).'
      );
    }
    mountGuidedStrip({
      page: 'unit',
      subjectId: ctx.subject.subjectId,
      unitId: ctx.unit.id,
      subjectLabel: ctx.subject.label
    });
  }

  function boot() {
    if (!global.LipaCurriculum) return;
    C.init();
    var root = document.getElementById('curriculum-app');
    if (!root) return;
    var page = document.body.getAttribute('data-curriculum-page');
    if (page === 'courses') renderCoursesPage(root);
    else if (page === 'course') renderCoursePage(root);
    else if (page === 'subject') renderSubjectPage(root);
    else if (page === 'unit') renderUnitPage(root);
  }

  document.addEventListener('DOMContentLoaded', boot);

  global.LipaCurriculumPage = { boot: boot, sanitizeMotion: sanitizeMotion, buildCoursePickerHtml: buildCoursePickerHtml, wireCoursePicker: wireCoursePicker, defaultPickerStage: defaultPickerStage };
})(typeof window !== 'undefined' ? window : global);
