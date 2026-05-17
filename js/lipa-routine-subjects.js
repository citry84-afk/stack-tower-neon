/**
 * Selector de materias para la rutina diaria — sin fricción
 */
(function (global) {
  'use strict';

  var PRESETS = {
    all: { label: 'Todo el curso', emoji: '🌈' },
    math: { label: 'Mates', emoji: '➕', ids: ['matematicas'] },
    languages: { label: 'Idiomas', emoji: '🗣️', ids: ['lenguaje', 'ingles'] },
    science: { label: 'Naturales', emoji: '🔬', ids: ['naturales'] },
    social: { label: 'Sociales', emoji: '🌍', ids: ['sociales'] },
    reflex: { label: 'Reflejos', emoji: '⚡', ids: ['brain-gym-diario'] }
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function getCourseId(profile) {
    profile = profile || (global.LipaBrain && LipaBrain.getProfile());
    return profile && profile.courseId;
  }

  function listSubjects(courseId) {
    if (!global.LipaCurriculum || !courseId) return [];
    LipaCurriculum.init();
    var course = LipaCurriculum.getCourse(courseId);
    return LipaCurriculum.listLiveSubjects(course);
  }

  function getSelected(profile) {
    profile = profile || (global.LipaBrain && LipaBrain.getProfile());
    if (!profile) return [];
    var courseId = profile.courseId;
    if (!courseId) return [];
    var all = listSubjects(courseId).map(function (s) { return s.subjectId; });
    var ids = LipaCurriculum.getRoutineSubjectIds(profile, LipaCurriculum.getCourse(courseId));
    if (!ids || !ids.length) return all;
    return ids.filter(function (id) { return all.indexOf(id) >= 0; });
  }

  function applySelection(subjectIds, opts) {
    opts = opts || {};
    if (!global.LipaBrain) return null;
    var p = LipaBrain.getProfile();
    if (!p) return null;

    var courseId = p.courseId;
    var all = listSubjects(courseId).map(function (s) { return s.subjectId; });
    var picked = (subjectIds || []).filter(function (id) { return all.indexOf(id) >= 0; });
    if (!picked.length) picked = all.slice();

    p.routineSubjects = picked;
    p.focus = picked.length >= all.length ? 'all' : 'custom';
    if (opts.rebuild !== false) {
      p.routine = LipaBrain.buildRoutine(p);
    }
    LipaBrain.saveProfile(p);
    global.dispatchEvent(new CustomEvent('lipa-routine-subjects-changed', {
      detail: { subjectIds: picked }
    }));
    return p;
  }

  function toggleSubject(subjectId) {
    var selected = getSelected();
    var i = selected.indexOf(subjectId);
    if (i >= 0) {
      if (selected.length <= 1) return selected;
      selected.splice(i, 1);
    } else {
      selected.push(subjectId);
    }
    return applySelection(selected);
  }

  function applyPreset(key) {
    var preset = PRESETS[key];
    if (!preset) return null;
    var p = global.LipaBrain && LipaBrain.getProfile();
    if (!p || !p.courseId) return null;
    if (key === 'all') {
      return applySelection(listSubjects(p.courseId).map(function (s) { return s.subjectId; }));
    }
    var all = listSubjects(p.courseId).map(function (s) { return s.subjectId; });
    var ids = (preset.ids || []).filter(function (id) { return all.indexOf(id) >= 0; });
    if (!ids.length) return null;
    return applySelection(ids);
  }

  function mount(container, opts) {
    opts = opts || {};
    if (!container) return;

    var profile = global.LipaBrain && LipaBrain.getProfile();
    if (!profile || !profile.courseId) {
      container.innerHTML =
        '<div class="brain-routine-subjects brain-routine-subjects--empty">' +
        '<p>Elige tu <a href="/cursos.html">curso escolar</a> para personalizar la rutina por materias.</p>' +
        '</div>';
      return;
    }

    LipaCurriculum.init();
    var subjects = listSubjects(profile.courseId);
    if (!subjects.length) {
      container.innerHTML = '<p class="brain-routine-subjects--empty">Aún no hay actividades en este curso.</p>';
      return;
    }

    var selected = getSelected(profile);
    var allIds = subjects.map(function (s) { return s.subjectId; });
    var allOn = selected.length >= allIds.length;

    var presetsHtml = Object.keys(PRESETS).map(function (key) {
      var pr = PRESETS[key];
      var active = false;
      if (key === 'all') active = allOn;
      else if (pr.ids) {
        active = pr.ids.length === selected.length &&
          pr.ids.every(function (id) { return selected.indexOf(id) >= 0; });
      }
      return '<button type="button" class="brain-routine-subjects__preset' +
        (active ? ' brain-routine-subjects__preset--on' : '') +
        '" data-preset="' + esc(key) + '">' + esc(pr.emoji + ' ' + pr.label) + '</button>';
    }).join('');

    var chipsHtml = subjects.map(function (sub) {
      var on = selected.indexOf(sub.subjectId) >= 0;
      return '<button type="button" class="brain-routine-subjects__chip brain-routine-subjects__chip--' +
        esc(sub.theme || 'default') + (on ? ' brain-routine-subjects__chip--on' : '') +
        '" data-subject="' + esc(sub.subjectId) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        '<span class="brain-routine-subjects__chip-emoji">' + esc(sub.emoji) + '</span>' +
        '<span>' + esc(sub.label) + '</span>' +
        '<span class="brain-routine-subjects__chip-n">' + sub.liveCount + '</span>' +
        '</button>';
    }).join('');

    container.innerHTML =
      '<section class="brain-routine-subjects' + (opts.compact ? ' brain-routine-subjects--compact' : '') + '" aria-labelledby="brain-routine-subjects-title">' +
      '<div class="brain-routine-subjects__head">' +
      '<h2 id="brain-routine-subjects-title" class="brain-routine-subjects__title">Materias de hoy</h2>' +
      '<p class="brain-routine-subjects__lead">Toca para incluir o quitar. La rutina mezcla las que elijas.</p>' +
      '</div>' +
      '<div class="brain-routine-subjects__presets" role="group" aria-label="Atajos">' + presetsHtml + '</div>' +
      '<div class="brain-routine-subjects__chips" role="group" aria-label="Materias">' + chipsHtml + '</div>' +
      '<p class="brain-routine-subjects__summary">' + esc(LipaCurriculum.subjectsLabel(selected, LipaCurriculum.getCourse(profile.courseId))) +
      ' · <button type="button" class="brain-routine-subjects__refresh" data-refresh-routine>Actualizar rutina de hoy</button></p>' +
      '</section>';

    container.querySelectorAll('[data-subject]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleSubject(btn.getAttribute('data-subject'));
        mount(container, opts);
        if (global.LipaBrainOnboarding && LipaBrainOnboarding.renderPlanCard) {
          var plan = document.getElementById('lipa-brain-plan-mount');
          if (plan) LipaBrainOnboarding.renderPlanCard(plan);
        }
      });
    });

    container.querySelectorAll('[data-preset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPreset(btn.getAttribute('data-preset'));
        mount(container, opts);
        if (global.LipaBrainOnboarding && LipaBrainOnboarding.renderPlanCard) {
          var plan = document.getElementById('lipa-brain-plan-mount');
          if (plan) LipaBrainOnboarding.renderPlanCard(plan);
        }
      });
    });

    var refresh = container.querySelector('[data-refresh-routine]');
    if (refresh) {
      refresh.addEventListener('click', function () {
        applySelection(getSelected(), { rebuild: true });
        if (global.LipaBrainOnboarding && LipaBrainOnboarding.renderPlanCard) {
          var plan = document.getElementById('lipa-brain-plan-mount');
          if (plan) LipaBrainOnboarding.renderPlanCard(plan);
        }
      });
    }
  }

  function boot() {
    document.querySelectorAll('[data-lipa-routine-subjects]').forEach(function (el) {
      mount(el, { compact: el.getAttribute('data-lipa-routine-subjects') === 'compact' });
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
  global.addEventListener('lipa-profile-changed', boot);
  global.addEventListener('lipa-routine-subjects-changed', boot);

  global.LipaRoutineSubjects = {
    mount: mount,
    getSelected: getSelected,
    applySelection: applySelection,
    applyPreset: applyPreset,
    toggleSubject: toggleSubject,
    PRESETS: PRESETS
  };
})(typeof window !== 'undefined' ? window : global);
