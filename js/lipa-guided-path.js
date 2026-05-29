/**
 * Ruta guiada — un CTA claro hasta el trabajo (rutina o siguiente misión).
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function getProfile() {
    if (global.LipaBrain && typeof LipaBrain.getProfile === 'function') {
      return LipaBrain.getProfile();
    }
    return null;
  }

  function hasProfile() {
    var p = getProfile();
    return !!(p && p.courseId);
  }

  function routineMinutes() {
    var p = getProfile();
    var def = (global.LipaCurriculumMeta && global.LipaCurriculumMeta.RECOMMENDED_DAILY_MINUTES) || 7;
    return Math.max(5, Math.min(15, parseInt(p && p.minutes, 10) || def));
  }

  function buildRoutine() {
    var p = getProfile();
    if (!p || !global.LipaCurriculum) return null;
    LipaCurriculum.init();
    return LipaCurriculum.buildRoutineFromCourse(p);
  }

  function startOnboarding(e) {
    if (e) e.preventDefault();
    if (global.LipaBrainOnboarding) {
      LipaBrainOnboarding.open();
    } else {
      global.location.href = '/cursos.html';
    }
  }

  function startRoutine(e) {
    if (e) e.preventDefault();
    if (!hasProfile()) {
      startOnboarding(e);
      return;
    }
    var btn = e && e.target ? e.target.closest('[data-guided-routine]') : null;
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      var prev = btn.textContent;
      btn.textContent = 'Abriendo primera misión…';
      setTimeout(function () {
        if (btn.isConnected) {
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
          btn.textContent = prev;
        }
      }, 8000);
    }
    if (global.LipaBrain && LipaBrain.refreshProfileRoutine) {
      LipaBrain.refreshProfileRoutine();
    }
    if (global.LipaRoutineFlow && LipaRoutineFlow.beginFromProfile) {
      LipaRoutineFlow.beginFromProfile({ restart: true });
      return;
    }
    var r = buildRoutine();
    if (r && r.firstUrl) {
      global.location.href = r.firstUrl;
    } else {
      global.location.href = '/entrenador-cerebro.html';
    }
  }

  function getPlan(ctx) {
    ctx = ctx || {};
    var page = ctx.page || 'home';

    if (!hasProfile()) {
      return {
        mode: 'onboard',
        eyebrow: 'Empieza en 30 segundos',
        title: 'Te configuramos el curso y el trabajo de hoy',
        lead: 'Sin menús: eliges curso una vez y Lipi te lleva misión a misión.',
        primary: { label: 'Configurar mi curso', action: 'onboard' },
        secondary: { label: 'Ver cursos', href: '/cursos.html', action: 'link' },
        steps: ['Curso', 'Trabajo', 'Progreso']
      };
    }

    var p = getProfile();
    LipaCurriculum.init();
    var course = LipaCurriculum.getCourse(p.courseId);
    if (!course) {
      return {
        mode: 'onboard',
        eyebrow: 'Un momento',
        title: 'Actualiza tu curso',
        lead: 'Vuelve a elegir el curso del cole.',
        primary: { label: 'Elegir curso', action: 'onboard' },
        secondary: null,
        steps: ['Curso', 'Trabajo', 'Progreso']
      };
    }

    var mins = routineMinutes();
    var routine = buildRoutine();
    var cont = LipaCurriculum.getContinueTarget(course.id);
    var nextInCtx = null;

    if (page === 'subject' && ctx.subjectId) {
      nextInCtx = LipaCurriculum.findNextActivity(course.id, { subjectId: ctx.subjectId });
    } else if (page === 'unit' && ctx.subjectId && ctx.unitId) {
      nextInCtx = LipaCurriculum.findNextActivity(course.id, {
        subjectId: ctx.subjectId,
        unitId: ctx.unitId
      });
    }

    var primary = {
      label: '▶ Empezar mi trabajo (' + mins + ' min)',
      sublabel: routine && routine.subtitle
        ? routine.subtitle + ' · Lipi te pasa de juego en juego'
        : 'Rutina guiada · sin elegir en menús',
      action: 'routine'
    };

    var secondary = null;
    if (nextInCtx && nextInCtx.url) {
      secondary = {
        label: 'Solo esta misión: ' + nextInCtx.activity.title,
        href: nextInCtx.url,
        sublabel: nextInCtx.subject.label + ' · ' + nextInCtx.unit.title,
        action: 'link'
      };
    } else if (cont && cont.type === 'activity' && cont.href) {
      secondary = {
        label: 'Ir a: ' + cont.label,
        href: cont.href,
        sublabel: cont.sublabel || '',
        action: 'link'
      };
    }

    if (page === 'subject' && nextInCtx) {
      primary = {
        label: '▶ Siguiente: ' + nextInCtx.activity.title,
        sublabel: nextInCtx.unit.title + ' · ~' + (nextInCtx.activity.estimatedMinutes || 2) + ' min',
        href: nextInCtx.url,
        action: 'link'
      };
      secondary = {
        label: 'Rutina guiada · ' + nextInCtx.subject.label + ' (' + Math.min(mins, 10) + ' min)',
        action: 'subject-routine',
        courseId: course.id,
        subjectId: ctx.subjectId,
        minutes: Math.min(mins, 10)
      };
    }

    if (page === 'unit' && nextInCtx) {
      primary = {
        label: '▶ Jugar: ' + nextInCtx.activity.title,
        sublabel: 'Misión recomendada en esta unidad',
        href: nextInCtx.url,
        action: 'link'
      };
      secondary = {
        label: 'Rutina 5 min · ' + nextInCtx.subject.label,
        action: 'subject-routine',
        courseId: course.id,
        subjectId: ctx.subjectId,
        minutes: 5
      };
    }

    var stepLabels = ['Curso ✓', 'Trabajo', 'XP'];
    if (page === 'courses') stepLabels = [course.shortLabel + ' ✓', 'Trabajo', 'Listo'];
    if (page === 'course') stepLabels = [course.shortLabel + ' ✓', 'Trabajo', 'Misiones'];
    if (page === 'subject') {
      stepLabels = [course.shortLabel, ctx.subjectLabel || 'Materia', 'Misión'];
    }
    if (page === 'unit') {
      stepLabels = [course.shortLabel, ctx.subjectLabel || '', 'Jugar'];
    }

    return {
      mode: 'work',
      course: course,
      eyebrow: page === 'home' ? 'Tu plan de hoy' : 'Siguiente paso',
      title: page === 'home'
        ? 'Un botón y empiezas el cole'
        : page === 'course'
          ? course.label + ' — trabajo de hoy'
          : 'Te llevamos al juego',
      lead: page === 'course'
        ? 'La rutina mezcla materias. También puedes elegir una asignatura abajo.'
        : 'Pulsa y juegas. Meta: 60 % de aciertos por misión.',
      primary: primary,
      secondary: secondary,
      continue: cont,
      next: nextInCtx,
      steps: stepLabels,
      minutes: mins
    };
  }

  function renderStripHtml(plan, options) {
    if (!plan) return '';
    options = options || {};
    var compact = !!options.compact;

    var stepsHtml = plan.steps.map(function (label, i) {
      var cls = 'lipa-guided-strip__step';
      if (i === 0 && plan.mode === 'work') cls += ' lipa-guided-strip__step--done';
      if ((plan.mode === 'work' && i === 1) || (plan.mode === 'onboard' && i === 0)) {
        cls += ' lipa-guided-strip__step--current';
      }
      return '<span class="' + cls + '">' + esc(label) + '</span>';
    }).join('<span class="lipa-guided-strip__sep" aria-hidden="true">→</span>');

    var sec = '';
    if (plan.secondary) {
      if (plan.secondary.action === 'link') {
        sec =
          '<a href="' + esc(plan.secondary.href) + '" class="lipa-btn lipa-btn--secondary lipa-guided-strip__btn-secondary">' +
          esc(plan.secondary.label) + '</a>';
      } else if (plan.secondary.action === 'subject-routine') {
        sec =
          '<button type="button" class="lipa-btn lipa-btn--secondary lipa-guided-strip__btn-secondary" ' +
          'data-start-subject-routine data-course-id="' + esc(plan.secondary.courseId) + '" ' +
          'data-subject-id="' + esc(plan.secondary.subjectId) + '" data-minutes="' + esc(plan.secondary.minutes) + '">' +
          esc(plan.secondary.label) + '</button>';
      }
    }

    var primaryBtn;
    if (plan.primary.action === 'link') {
      primaryBtn =
        '<a href="' + esc(plan.primary.href) + '" class="lipa-btn lipa-btn--primary lipa-btn--brain lipa-guided-strip__btn-primary">' +
        esc(plan.primary.label) + '</a>';
    } else if (plan.primary.action === 'onboard') {
      primaryBtn =
        '<button type="button" class="lipa-btn lipa-btn--primary lipa-btn--brain lipa-guided-strip__btn-primary" data-guided-onboard">' +
        esc(plan.primary.label) + '</button>';
    } else {
      primaryBtn =
        '<button type="button" class="lipa-btn lipa-btn--primary lipa-btn--brain lipa-guided-strip__btn-primary" data-guided-routine">' +
        esc(plan.primary.label) + '</button>';
    }

    var sub = plan.primary.sublabel
      ? '<p class="lipa-guided-strip__sub">' + esc(plan.primary.sublabel) + '</p>'
      : (plan.lead ? '<p class="lipa-guided-strip__sub">' + esc(plan.lead) + '</p>' : '');

    return (
      '<aside class="lipa-guided-strip' + (compact ? ' lipa-guided-strip--compact' : '') + '" role="region" aria-label="Ruta guiada">' +
      '<div class="lipa-guided-strip__steps" aria-hidden="true">' + stepsHtml + '</div>' +
      '<div class="lipa-guided-strip__body">' +
      '<p class="lipa-guided-strip__eyebrow">' + esc(plan.eyebrow) + '</p>' +
      (compact ? '' : '<h2 class="lipa-guided-strip__title">' + esc(plan.title) + '</h2>') +
      sub +
      '<div class="lipa-guided-strip__actions">' + primaryBtn + sec + '</div>' +
      '</div></aside>'
    );
  }

  function mountStrip(container, ctx, options) {
    if (!container || !global.LipaCurriculum) return null;
    var plan = getPlan(ctx);
    container.innerHTML = renderStripHtml(plan, options);
    return plan;
  }

  function wireStrip(root) {
    if (!root) return;
    var onboard = root.querySelector('[data-guided-onboard]');
    if (onboard) onboard.addEventListener('click', startOnboarding);
    var routine = root.querySelector('[data-guided-routine]');
    if (routine) routine.addEventListener('click', startRoutine);
  }

  function courseWorkUrl(courseId) {
    return '/curso.html?c=' + encodeURIComponent(courseId) + '&empezar=1';
  }

  function resumeWorkUrl() {
    if (!hasProfile()) return '/cursos.html?empezar=1';
    var p = getProfile();
    LipaCurriculum.init();
    var next = LipaCurriculum.findNextActivity(p.courseId);
    if (next && next.url) return next.url;
    return courseWorkUrl(p.courseId);
  }

  function saveCourseId(courseId) {
    if (!courseId || !global.LipaBrain || !LipaBrain.getProfile) return;
    var p = LipaBrain.getProfile();
    if (!p) return;
    if (p.courseId === courseId) return;
    var next = Object.assign({}, p, { courseId: courseId });
    if (LipaBrain.saveProfile) LipaBrain.saveProfile(next);
    if (LipaBrain.refreshProfileRoutine) LipaBrain.refreshProfileRoutine();
    try {
      global.dispatchEvent(new CustomEvent('lipa-profile-changed'));
    } catch (e) { /* ignore */ }
  }

  function mountNavWorkLink() {
    var panel = document.getElementById('primary-nav');
    if (!panel) return;
    var link = document.getElementById('nav-mi-trabajo');
    if (!hasProfile()) {
      if (link) link.hidden = true;
      return;
    }
    if (!link) {
      link = document.createElement('a');
      link.id = 'nav-mi-trabajo';
      link.className = 'site-nav__work';
      link.textContent = 'Mi trabajo';
      var anchor = panel.querySelector('a[href="/cursos.html"]') || panel.querySelector('a[href="/"]');
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(link, anchor.nextSibling);
      } else {
        panel.appendChild(link);
      }
    }
    link.href = resumeWorkUrl();
    link.hidden = false;
  }

  function tryAutoStart(ctx) {
    var params;
    try {
      params = new URLSearchParams(global.location.search);
    } catch (e) {
      return;
    }
    if (params.get('empezar') !== '1' && params.get('trabajo') !== '1') return;
    if (!hasProfile()) {
      startOnboarding();
      return;
    }
    if (ctx && ctx.page === 'subject' && ctx.subjectId && global.LipaRoutineFlow) {
      var ok = LipaRoutineFlow.beginSubjectRoutine(
        getProfile().courseId,
        ctx.subjectId,
        routineMinutes()
      );
      if (ok) return;
    }
    startRoutine();
  }

  function mountOrphanGuidedStrip() {
    var mount = document.getElementById('lipa-guided-mount');
    if (!mount || mount.getAttribute('data-guided-mounted') === '1') return;
    if (document.getElementById('curriculum-app')) return;
    var ctx = { page: 'home' };
    if (global.location && global.location.pathname.indexOf('mi-rutina') >= 0) {
      ctx.page = 'home';
    }
    mountStrip(mount, ctx, { compact: true });
    wireStrip(mount);
    mount.setAttribute('data-guided-mounted', '1');
  }

  document.addEventListener('DOMContentLoaded', function () {
    mountNavWorkLink();
    mountOrphanGuidedStrip();
  });
  global.addEventListener('lipa-profile-changed', function () {
    mountNavWorkLink();
    var mount = document.getElementById('lipa-guided-mount');
    if (mount) mount.removeAttribute('data-guided-mounted');
    mountOrphanGuidedStrip();
  });

  global.LipaGuidedPath = {
    hasProfile: hasProfile,
    getPlan: getPlan,
    renderStripHtml: renderStripHtml,
    mountStrip: mountStrip,
    wireStrip: wireStrip,
    startRoutine: startRoutine,
    startOnboarding: startOnboarding,
    tryAutoStart: tryAutoStart,
    courseWorkUrl: courseWorkUrl,
    resumeWorkUrl: resumeWorkUrl,
    saveCourseId: saveCourseId,
    mountNavWorkLink: mountNavWorkLink
  };
})(typeof window !== 'undefined' ? window : global);
