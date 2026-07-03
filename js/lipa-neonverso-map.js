/**
 * Neonverso — mapa 2D de islas con progreso iluminado por materia.
 */
(function (global) {
  'use strict';

  var ISLANDS = [
    { id: 'matematicas', cls: 'math', emoji: '🔢', name: 'Mates', subjectId: 'matematicas' },
    { id: 'lenguaje', cls: 'lang', emoji: '📖', name: 'Lengua', subjectId: 'lenguaje' },
    { id: 'ingles', cls: 'en', emoji: '🇬🇧', name: 'Inglés', subjectId: 'ingles' },
    { id: 'naturales', cls: 'sci', emoji: '🌿', name: 'Naturales', subjectId: 'naturales' },
    { id: 'sociales', cls: 'soc', emoji: '🗺️', name: 'Sociales', subjectId: 'sociales' },
    { id: 'boss', cls: 'boss', emoji: '🐲', name: 'Boss', special: 'boss' },
    { id: 'cards', cls: 'cards', emoji: '🃏', name: 'Cartas', special: 'cards' },
    { id: 'recreo', cls: 'recreo', emoji: '🎮', name: 'Recreo', special: 'recreo' }
  ];

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function getCourseId() {
    if (!global.LipaBrain) return 'primaria-3';
    var p = LipaBrain.getProfile();
    return (p && p.courseId) || 'primaria-3';
  }

  function islandHref(island) {
    if (island.special === 'boss') return '/jefe-neon.html?practice=1';
    if (island.special === 'cards') return '/coleccion.html';
    if (island.special === 'recreo') return '/recreo-neon.html';
    var courseId = getCourseId();
    if (global.LipaCourseSeo && LipaCourseSeo.seoPathForSubject) {
      var path = LipaCourseSeo.seoPathForSubject(courseId, island.subjectId);
      if (path) return path;
    }
    return '/cursos.html';
  }

  function subjectProgress(courseId, subjectId) {
    if (!global.LipaCurriculum) return 0;
    LipaCurriculum.init();
    var course = LipaCurriculum.getCourse(courseId);
    if (!course) return 0;
    var block = null;
    course.subjects.forEach(function (s) {
      if (s.subjectId === subjectId) block = s;
    });
    if (!block) return 0;
    var sub = LipaCurriculum.enrichSubject ? LipaCurriculum.enrichSubject(course, block) : block;
    if (!sub || !sub.units) return 0;
    var done = 0;
    var total = 0;
    var prog = LipaCurriculum.getProgress ? LipaCurriculum.getProgress() : {};
    sub.units.forEach(function (u) {
      (u.activities || []).forEach(function (a) {
        if (a.status !== 'live') return;
        total++;
        if (prog[a.id]) done++;
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  }

  function islandLit(island, pct) {
    if (island.special === 'boss') {
      try {
        return localStorage.getItem('lipa_boss_done_' + today()) === '1';
      } catch (e) {
        return false;
      }
    }
    if (island.special === 'cards') {
      if (!global.LipaCards) return false;
      return LipaCards.uniqueOwned() > 3;
    }
    if (island.special === 'recreo') {
      try {
        return localStorage.getItem('lipa_recreo_unlock') === today();
      } catch (e) {
        return false;
      }
    }
    return pct >= 8;
  }

  function towerBlocks(streak) {
    var n = Math.min(12, Math.max(1, streak || 1));
    var html = '';
    for (var i = 0; i < n; i++) {
      html += '<span class="neonverso-tower__block" style="animation-delay:' + i * 60 + 'ms;width:' + (28 + (i % 3) * 4) + 'px"></span>';
    }
    return html;
  }

  function render(root) {
    if (!root) return;
    var courseId = getCourseId();
    var streak = global.LipaBrain ? (LipaBrain.getStats().streak || 0) : 0;
    var courseLabel = '';
    if (global.LipaCurriculum) {
      LipaCurriculum.init();
      var c = LipaCurriculum.getCourse(courseId);
      if (c) courseLabel = c.label;
    }

    var islandsHtml = ISLANDS.map(function (island) {
      var pct = island.subjectId ? subjectProgress(courseId, island.subjectId) : 0;
      var lit = islandLit(island, pct);
      var locked = island.special === 'recreo' && !lit;
      return (
        '<a href="' + esc(islandHref(island)) + '" class="neonverso-island neonverso-island--' + island.cls +
        (lit ? ' neonverso-island--lit' : '') +
        (locked ? ' neonverso-island--locked' : '') +
        '" title="' + esc(island.name) + '">' +
        '<span class="neonverso-island__body">' +
        '<span class="neonverso-island__emoji" aria-hidden="true">' + island.emoji + '</span>' +
        '<span class="neonverso-island__name">' + esc(island.name) + '</span>' +
        (island.subjectId ? '<span class="neonverso-island__pct">' + pct + '%</span>' : '') +
        '</span></a>'
      );
    }).join('');

    root.innerHTML =
      '<div class="neonverso-map" role="img" aria-label="Mapa del Neonverso: islas de materias">' +
      '<div class="neonverso-map__sky" aria-hidden="true"></div>' +
      '<span class="neonverso-map__cloud neonverso-map__cloud--1" aria-hidden="true">☁️</span>' +
      '<span class="neonverso-map__cloud neonverso-map__cloud--2" aria-hidden="true">☁️</span>' +
      '<div class="neonverso-tower" aria-hidden="true">' +
      towerBlocks(streak) +
      '<span class="neonverso-tower__label">🔥 ' + streak + ' días</span>' +
      '</div>' +
      islandsHtml +
      '</div>' +
      (courseLabel
        ? '<p class="neonverso-head" style="margin-top:0.65rem;font-size:13px;color:var(--brain-text-muted,#667085);">Explorando: <strong>' + esc(courseLabel) + '</strong> · <a href="/cursos.html">cambiar curso</a></p>'
        : '');

    root.querySelectorAll('.neonverso-island').forEach(function (el) {
      el.addEventListener('click', function () {
        if (global.LipaBrainPlay && LipaBrainPlay.chimeTap) {
          try { LipaBrainPlay.chimeTap(); } catch (e) { /* ignore */ }
        }
      });
    });
  }

  function mount(mapEl) {
    if (!mapEl) return;
    render(mapEl);
    global.addEventListener('lipa-profile-changed', function () { render(mapEl); });
    global.addEventListener('lipa-cards-changed', function () { render(mapEl); });
  }

  global.LipaNeonversoMap = { mount: mount, render: render };

  document.addEventListener('DOMContentLoaded', function () {
    mount(document.getElementById('lipa-neonverso-mount'));
  });
})(typeof window !== 'undefined' ? window : global);
