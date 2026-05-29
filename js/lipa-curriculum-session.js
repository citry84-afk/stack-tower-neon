/**
 * Modo curso escolar en juegos (?curriculum=1&course&subject&unit&activity)
 * Barra contextual + panel al completar (mín. 60 % aciertos).
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function minAccuracyLabel(courseId) {
    var min = (global.LipaCurriculum && LipaCurriculum.getMinAccuracy)
      ? LipaCurriculum.getMinAccuracy(courseId || '')
      : 0.6;
    return Math.round(min * 100) + '%';
  }

  function starsHtml(accuracy, minAccuracy) {
    if (accuracy == null) return '';
    var pct = accuracy;
    var stars = 1;
    if (pct >= 0.85) stars = 3;
    else if (pct >= Math.max(minAccuracy || 0.55, 0.7)) stars = 2;
    var filled = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return '<p class="lipa-curriculum-complete__stars" aria-label="' + stars + ' de 3 estrellas">' +
      esc(filled) + '</p>';
  }

  function progressBlock(meta) {
    if (!global.LipaCurriculum) return '';
    var actCtx = LipaCurriculum.getActivity(
      meta.ctx.courseId,
      meta.ctx.subjectId,
      meta.ctx.unitId,
      meta.ctx.activityId
    );
    if (!actCtx) return '';
    var up = LipaCurriculum.unitProgress(actCtx.unit);
    var cp = LipaCurriculum.courseProgress(actCtx.course);
    if (!up.hasLive && !cp.total) return '';
    return (
      '<div class="lipa-curriculum-complete__progress">' +
      '<p><strong>Unidad:</strong> ' + up.done + ' / ' + up.total + ' misiones</p>' +
      '<div class="lipa-curriculum-complete__bar" role="progressbar" aria-valuenow="' + up.percent + '" aria-valuemin="0" aria-valuemax="100">' +
      '<span style="width:' + up.percent + '%"></span></div>' +
      (cp.total
        ? '<p class="lipa-curriculum-complete__course-pct">Curso completo al <strong>' + cp.percent + '%</strong></p>'
        : '') +
      '</div>'
    );
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
    return !!(p && p.get('curriculum') === '1' && p.get('activity'));
  }

  function getContext() {
    var p = getParams();
    if (!p || p.get('curriculum') !== '1') return null;
    return {
      courseId: p.get('course') || '',
      subjectId: p.get('subject') || '',
      unitId: p.get('unit') || '',
      activityId: p.get('activity') || ''
    };
  }

  function unitUrl(ctx) {
    return '/unidad.html?c=' + encodeURIComponent(ctx.courseId) +
      '&m=' + encodeURIComponent(ctx.subjectId) +
      '&u=' + encodeURIComponent(ctx.unitId);
  }

  function resolveMeta(ctx) {
    if (!global.LipaCurriculum || !ctx.courseId) return null;
    LipaCurriculum.init();
    var actCtx = LipaCurriculum.getActivity(
      ctx.courseId,
      ctx.subjectId,
      ctx.unitId,
      ctx.activityId
    );
    if (!actCtx) return null;
    return {
      ctx: ctx,
      title: actCtx.activity.title || 'Actividad',
      unitTitle: actCtx.unit.title,
      subjectLabel: actCtx.subject.label,
      subjectEmoji: actCtx.subject.emoji,
      courseLabel: actCtx.course.label
    };
  }

  function mountBar() {
    if (!isActive()) return;
    var meta = resolveMeta(getContext());
    if (!meta) return;

    var bar = document.getElementById('lipa-curriculum-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'lipa-curriculum-bar';
      bar.className = 'lipa-curriculum-bar';
      bar.setAttribute('role', 'navigation');
      bar.setAttribute('aria-label', 'Contexto del curso');
      var nav = document.querySelector('.site-nav');
      if (nav && nav.parentNode) {
        nav.parentNode.insertBefore(bar, nav.nextSibling);
      } else {
        document.body.insertBefore(bar, document.body.firstChild);
      }
    }

    bar.innerHTML =
      '<div class="lipa-curriculum-bar__inner">' +
      '<a class="lipa-curriculum-bar__back" href="' + esc(unitUrl(meta.ctx)) + '">← ' +
      esc(meta.unitTitle) + '</a>' +
      '<span class="lipa-curriculum-bar__meta">' + esc(meta.subjectEmoji + ' ' + meta.subjectLabel) +
      ' · <strong>' + esc(meta.title) + '</strong></span>' +
      '<span class="lipa-curriculum-bar__goal">Meta: ' + minAccuracyLabel(meta.ctx.courseId) + ' aciertos</span>' +
      '</div>';

    document.body.classList.add('lipa-curriculum-active');
  }

  function findOverlay() {
    return document.querySelector(
      '.game-overlay:not([hidden]), #calc-overlay:not([hidden]), #flash-overlay:not([hidden]), ' +
      '#tablas-overlay:not([hidden]), #rt-summary:not([hidden])'
    );
  }

  function injectPanel(meta, html, className) {
    var host = findOverlay() ||
      document.querySelector('.game-overlay, #calc-overlay, #flash-overlay') ||
      document.querySelector('main.wrap, main');

    if (!host) return;

    var existing = document.getElementById('lipa-curriculum-complete');
    if (existing) existing.parentNode.removeChild(existing);

    var panel = document.createElement('div');
    panel.id = 'lipa-curriculum-complete';
    panel.className = 'lipa-curriculum-complete ' + (className || '');
    panel.setAttribute('role', 'status');
    panel.innerHTML = html;

    if (host.classList && host.classList.contains('game-overlay')) {
      host.insertBefore(panel, host.firstChild);
    } else if (host.id === 'rt-summary') {
      host.appendChild(panel);
    } else {
      host.insertBefore(panel, host.firstChild);
    }

    setTimeout(function () {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }

  function routineActive() {
    return !!(global.LipaRoutineFlow && LipaRoutineFlow.isActive && LipaRoutineFlow.isActive());
  }

  function activityChoiceHtml(meta) {
    var inRoutine = routineActive();
    var upcoming = inRoutine && global.LipaRoutineFlow && LipaRoutineFlow.peekNextStep
      ? LipaRoutineFlow.peekNextStep()
      : null;
    var nextCur = !inRoutine && global.LipaCurriculum
      ? LipaCurriculum.getContinueTarget(meta.ctx.courseId)
      : null;

    var nextLabel = 'Siguiente ejercicio →';
    if (upcoming) {
      nextLabel = 'Siguiente: ' + (upcoming.emoji ? upcoming.emoji + ' ' : '') + upcoming.name + ' →';
    } else if (inRoutine) {
      nextLabel = 'Ver mi recompensa →';
    } else if (nextCur && nextCur.type === 'activity' && nextCur.href.indexOf(meta.ctx.activityId) < 0) {
      nextLabel = 'Siguiente: ' + nextCur.label + ' →';
    }

    return (
      '<p class="lipa-curriculum-complete__prompt">¿Quieres repetir o pasar al siguiente?</p>' +
      '<div class="lipa-curriculum-complete__actions lipa-curriculum-complete__actions--choice">' +
      '<button type="button" class="lipa-btn lipa-btn--primary" id="lipa-activity-next">' + esc(nextLabel) + '</button>' +
      '<button type="button" class="lipa-btn lipa-btn--secondary" id="lipa-activity-repeat">Repetir actividad</button>' +
      '</div>'
    );
  }

  function wireActivityChoiceHandlers(meta) {
    var repeat = document.getElementById('lipa-activity-repeat');
    var nextBtn = document.getElementById('lipa-activity-next');
    if (repeat) {
      repeat.addEventListener('click', function () {
        global.location.reload();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (routineActive() && global.LipaRoutineFlow && LipaRoutineFlow.goNext) {
          LipaRoutineFlow.goNext(false);
          return;
        }
        var next = global.LipaCurriculum
          ? LipaCurriculum.getContinueTarget(meta.ctx.courseId)
          : null;
        if (next && next.href) {
          global.location.href = next.href;
        }
      });
    }
  }

  function injectCompletePanel(meta, result) {
    var inRoutine = routineActive();
    var showChoice = inRoutine || isActive();
    var choiceHtml = showChoice ? activityChoiceHtml(meta) : '';
    var next = LipaCurriculum.getContinueTarget(meta.ctx.courseId);
    var nextHtml = '';

    if (!showChoice && result.passed && next && next.type === 'activity' && next.href.indexOf(meta.ctx.activityId) < 0) {
      nextHtml =
        '<a href="' + esc(next.href) + '" class="lipa-btn lipa-btn--primary lipa-curriculum-complete__next">' +
        '▶ Siguiente misión: ' + esc(next.label) + ' →</a>';
    }

    var pct = result.accuracy != null ? Math.round(result.accuracy * 100) : '—';
    var title = result.firstTime
      ? '¡Misión completada!'
      : '¡Otra vez genial!';
    if (result.effortPass) {
      title = '¡Lo has terminado! Sigue practicando';
    }
    var xpLine = result.xpGain
      ? '<p class="lipa-curriculum-complete__xp">+' + esc(String(result.xpGain)) + ' XP · racha activa</p>'
      : '';

    var footerActions = showChoice
      ? choiceHtml
      : '<div class="lipa-curriculum-complete__actions">' +
        nextHtml +
        '<a href="' + esc(unitUrl(meta.ctx)) + '" class="lipa-btn lipa-btn--secondary">Ver unidad</a>' +
        '<a href="/curso.html?c=' + encodeURIComponent(meta.ctx.courseId) + '&empezar=1" class="lipa-btn lipa-btn--ghost">Rutina de hoy</a>' +
        '</div>';

    injectPanel(
      meta,
      '<p class="lipa-curriculum-complete__title">' + esc(title) + '</p>' +
      starsHtml(result.accuracy, result.minAccuracy) +
      '<p class="lipa-curriculum-complete__sub">' + esc(meta.subjectEmoji + ' ' + meta.subjectLabel) +
      ' · ' + esc(meta.title) + ' · ' + pct + '% aciertos</p>' +
      xpLine +
      (showChoice ? '' : progressBlock(meta)) +
      footerActions,
      'lipa-curriculum-complete--ok' + (showChoice ? ' lipa-curriculum-complete--choice' : '')
    );

    if (showChoice) wireActivityChoiceHandlers(meta);

    if (global.LipaGameFeedback) {
      try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
    }

    if (showChoice) {
      lipiSay('¿Otra ronda para subir estrellas o pasamos al siguiente ejercicio? Tú eliges.');
    } else if (result.effortPass) {
      lipiSay('Has terminado la ronda. Repite cuando quieras subir estrellas — ¡cada intento cuenta!');
    } else if (result.firstTime) {
      lipiSay('¡Misión nueva desbloqueada en tu curso! La siguiente te espera cuando quieras.');
    } else {
      lipiSay('¡Así se entrena el cerebro! Tu XP y tu curso siguen avanzando.');
    }
  }

  function injectRetryPanel(meta, result) {
    var pct = result.accuracy != null ? Math.round(result.accuracy * 100) : '—';
    var min = Math.round((result.minAccuracy || 0.6) * 100);
    var soft = Math.round(
      ((global.LipaCurriculum && LipaCurriculum.getSoftMinAccuracy)
        ? LipaCurriculum.getSoftMinAccuracy(meta.ctx.courseId)
        : 0.45) * 100
    );
    var inRoutine = routineActive();
    var actionsHtml = inRoutine
      ? activityChoiceHtml(meta)
      : '<div class="lipa-curriculum-complete__actions">' +
        '<button type="button" class="lipa-btn lipa-btn--primary" id="lipa-curriculum-retry">Repetir actividad</button>' +
        '<a href="' + esc(unitUrl(meta.ctx)) + '" class="lipa-btn lipa-btn--secondary">Volver a la unidad</a>' +
        '</div>';

    injectPanel(
      meta,
      '<p class="lipa-curriculum-complete__title lipa-curriculum-complete__title--retry">' +
      '💪 Casi — apunta a ' + min + '% (o ' + soft + '% si completas la ronda)</p>' +
      '<p class="lipa-curriculum-complete__sub">Tu precisión fue <strong>' + pct + '%</strong>. ' +
      'Tu XP de Brain Gym sí se guardó. Una ronda más y lo tienes.</p>' +
      actionsHtml,
      'lipa-curriculum-complete--retry' + (inRoutine ? ' lipa-curriculum-complete--choice' : '')
    );

    if (inRoutine) {
      wireActivityChoiceHandlers(meta);
    } else {
      var retry = document.getElementById('lipa-curriculum-retry');
      if (retry) {
        retry.addEventListener('click', function () {
          global.location.reload();
        });
      }
    }

    lipiSay(inRoutine
      ? '¿Repites para mejorar o pasamos al siguiente ejercicio?'
      : 'No pasa nada. Lee la pista de Lipi y prueba otra ronda — ¡tú puedes!');
  }

  function lipiSay(text) {
    var hint = document.getElementById('lipi-game-hint');
    if (hint && global.LipaMascot) {
      LipaMascot.render(hint, 'wrong', text);
    } else if (global.LipaMascot) {
      LipaMascot.say('wrong', text);
    }
  }

  function onGameRecorded(gameId, payload, curriculumResult) {
    if (!isActive() || !curriculumResult) return;
    var ctx = getContext();
    var meta = resolveMeta(ctx);
    if (!meta) return;

    if (curriculumResult.passed) {
      injectCompletePanel(meta, curriculumResult);
    } else {
      injectRetryPanel(meta, curriculumResult);
    }
  }

  function boot() {
    if (!isActive()) return;
    if (global.LipaCurriculum) LipaCurriculum.init();
    mountBar();
  }

  document.addEventListener('DOMContentLoaded', boot);
  global.addEventListener('lipa-profile-changed', boot);

  global.LipaCurriculumSession = {
    isActive: isActive,
    getContext: getContext,
    boot: boot,
    onGameRecorded: onGameRecorded,
    minAccuracyLabel: minAccuracyLabel
  };
})(typeof window !== 'undefined' ? window : global);
