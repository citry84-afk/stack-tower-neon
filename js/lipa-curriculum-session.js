/**
 * Modo curso escolar en juegos (?curriculum=1&course&subject&unit&activity)
 * Barra contextual + panel al completar (mín. 60 % aciertos).
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function minAccuracyLabel() {
    var min = (global.LipaCurriculum && LipaCurriculum.CURRICULUM_MIN_ACCURACY) || 0.6;
    return Math.round(min * 100) + '%';
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
      '<span class="lipa-curriculum-bar__goal">Meta: ' + minAccuracyLabel() + ' aciertos</span>' +
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

  function injectCompletePanel(meta, result) {
    var next = LipaCurriculum.getContinueTarget(meta.ctx.courseId);
    var nextHtml = '';
    if (result.passed && next && next.type === 'activity' && next.href.indexOf(meta.ctx.activityId) < 0) {
      nextHtml =
        '<a href="' + esc(next.href) + '" class="lipa-btn lipa-btn--primary lipa-curriculum-complete__next">' +
        'Siguiente: ' + esc(next.label) + ' →</a>';
    }

    var pct = result.accuracy != null ? Math.round(result.accuracy * 100) : '—';
    var title = result.firstTime
      ? '✅ ¡Actividad completada en tu curso!'
      : '✅ ¡Otra vez bien! Sigue sumando en el curso';

    injectPanel(
      meta,
      '<p class="lipa-curriculum-complete__title">' + title + '</p>' +
      '<p class="lipa-curriculum-complete__sub">' + esc(meta.courseLabel) + ' · ' + esc(meta.title) +
      ' · Precisión ' + pct + '%</p>' +
      '<div class="lipa-curriculum-complete__actions">' +
      nextHtml +
      '<a href="' + esc(unitUrl(meta.ctx)) + '" class="lipa-btn lipa-btn--secondary">Volver a la unidad</a>' +
      '<a href="/curso.html?c=' + encodeURIComponent(meta.ctx.courseId) + '" class="lipa-btn lipa-btn--ghost">Ver curso</a>' +
      '</div>',
      'lipa-curriculum-complete--ok'
    );

    lipiSay(result.firstTime
      ? '¡Misión del curso cumplida! Puedes seguir con la siguiente actividad.'
      : '¡Buen entreno! Tu progreso sigue sumando.');
  }

  function injectRetryPanel(meta, result) {
    var pct = result.accuracy != null ? Math.round(result.accuracy * 100) : '—';
    var min = Math.round((result.minAccuracy || 0.6) * 100);

    injectPanel(
      meta,
      '<p class="lipa-curriculum-complete__title lipa-curriculum-complete__title--retry">' +
      '💪 Casi — necesitas ' + min + '% de aciertos</p>' +
      '<p class="lipa-curriculum-complete__sub">Tu precisión fue <strong>' + pct + '%</strong>. ' +
      'Tu XP y nivel Brain sí se guardaron. ¡Inténtalo otra vez!</p>' +
      '<div class="lipa-curriculum-complete__actions">' +
      '<button type="button" class="lipa-btn lipa-btn--primary" id="lipa-curriculum-retry">Repetir actividad</button>' +
      '<a href="' + esc(unitUrl(meta.ctx)) + '" class="lipa-btn lipa-btn--secondary">Volver a la unidad</a>' +
      '</div>',
      'lipa-curriculum-complete--retry'
    );

    var retry = document.getElementById('lipa-curriculum-retry');
    if (retry) {
      retry.addEventListener('click', function () {
        global.location.reload();
      });
    }

    lipiSay('No pasa nada. Lee la pista de Lipi y prueba otra ronda — ¡tú puedes!');
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
