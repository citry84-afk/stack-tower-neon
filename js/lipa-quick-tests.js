/**
 * API retos rápidos — sesiones, progreso y rutina diaria
 */
(function (global) {
  'use strict';

  var META = global.LipaQuickTestsMeta || {};
  var DATA = global.LipaQuickTestsData || {};
  var PROGRESS_KEY = 'lipa-quick-tests-v1';

  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getCategories() {
    return (META.CATEGORIES || []).slice();
  }

  function getCategory(id) {
    return getCategories().filter(function (c) { return c.id === id; })[0] || null;
  }

  function categoryMatchesAge(cat, ageBand) {
    if (!ageBand || !cat.ageBands || !cat.ageBands.length) return true;
    return cat.ageBands.indexOf(ageBand) >= 0;
  }

  function listForAgeBand(ageBand) {
    return getCategories().filter(function (c) {
      return categoryMatchesAge(c, ageBand);
    });
  }

  function getQuestions(categoryId) {
    var bank = DATA.BY_CATEGORY || {};
    return (bank[categoryId] || []).slice();
  }

  function shuffle(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor((rng || Math.random)() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function pickSession(categoryId, count, seed) {
    var cat = getCategory(categoryId);
    if (!cat) return null;
    var pool = getQuestions(categoryId);
    var n = count || cat.questionCount || 10;
    var rng = global.LipaDaily && global.LipaDaily.mulberry32 && seed != null
      ? global.LipaDaily.mulberry32(global.LipaDaily.seedFromString(String(seed)))
      : Math.random;
    var picked = shuffle(pool, rng).slice(0, Math.min(n, pool.length));
    return {
      category: cat,
      questions: picked,
      total: picked.length
    };
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    } catch (e) { /* ignore */ }
  }

  function recordResult(categoryId, payload) {
    var p = loadProgress();
    if (!p[categoryId]) p[categoryId] = { attempts: 0, bestPercent: 0, lastPlayed: null };
    var entry = p[categoryId];
    entry.attempts += 1;
    entry.lastPlayed = new Date().toISOString().split('T')[0];
    if (payload.percent > entry.bestPercent) entry.bestPercent = payload.percent;
    entry.lastScore = payload.correct + '/' + payload.total;
    if (payload.wrongSkills && payload.wrongSkills.length) {
      entry.lastWrongSkills = payload.wrongSkills.slice(0, 8);
    }
    saveProgress(p);

    var cat = getCategory(categoryId);
    var xpEach = (cat && cat.xpPerCorrect) || 7;
    var xp = (payload.correct || 0) * xpEach;
    if (payload.percent >= 90) xp += 15;
    else if (payload.percent >= 70) xp += 8;

    if (global.LipaBrain && typeof LipaBrain.addXp === 'function' && xp > 0) {
      LipaBrain.addXp(xp);
    }
    if (global.LipaBrain && typeof LipaBrain.bumpStreak === 'function') {
      LipaBrain.bumpStreak();
    }

    return { xp: xp, entry: entry };
  }

  function pickCategoryForRoutine(profile, rng) {
    var ageBand = profile && profile.ageBand;
    if (!ageBand && profile && profile.courseId && global.LipaCurriculum) {
      ageBand = LipaCurriculum.courseToAgeBand(profile.courseId);
    }
    var seed = (global.LipaDaily && global.LipaDaily.getDailySeed)
      ? global.LipaDaily.getDailySeed('quicktest-' + (profile && profile.courseId || 'all'))
      : new Date().toISOString().split('T')[0];
    var r = rng || (global.LipaDaily && global.LipaDaily.mulberry32
      ? global.LipaDaily.mulberry32(global.LipaDaily.seedFromString(String(seed)))
      : Math.random);

    var rotation = ['logica', 'ortografia', 'cultura-general', 'digital', 'finanzas'];
    var pool = [];
    rotation.forEach(function (id) {
      var cat = getCategory(id);
      if (cat && categoryMatchesAge(cat, ageBand)) pool.push(cat);
    });
    if (!pool.length) pool = listForAgeBand(ageBand);
    if (!pool.length) pool = getCategories();
    if (!pool.length) return null;

    var dayNum = 0;
    try {
      dayNum = parseInt(String(seed).replace(/\D/g, '').slice(-4), 10) || 0;
    } catch (e) { /* ignore */ }
    var idx = (dayNum + Math.floor(r() * pool.length)) % pool.length;
    return pool[idx];
  }

  function buildRoutineQuickStep(profile, order, rng) {
    var cat = pickCategoryForRoutine(profile, rng);
    if (!cat) return null;
    var url = '/reto-rapido.html?id=' + encodeURIComponent(cat.id) + '&routine=1';
    if (profile && profile.courseId) {
      url += '&c=' + encodeURIComponent(profile.courseId);
    }
    return {
      order: order,
      gameId: null,
      activityId: 'quicktest-' + cat.id,
      name: 'Reto rápido: ' + cat.shortLabel,
      short: cat.emoji,
      emoji: cat.emoji,
      url: url,
      desc: cat.desc,
      minutes: 1,
      level: 1,
      tip: '10 preguntas · sin presión · ' + cat.shortLabel,
      quickTestId: cat.id,
      subjectId: 'reto-rapido',
      subjectLabel: cat.shortLabel
    };
  }

  function renderCardsHtml(options) {
    options = options || {};
    var ageBand = options.ageBand;
    var courseId = options.courseId;
    var list = ageBand ? listForAgeBand(ageBand) : getCategories();
    if (!list.length) return '';

    return '<div class="lipa-quick-grid">' + list.map(function (cat) {
      var href = '/reto-rapido.html?id=' + encodeURIComponent(cat.id);
      if (courseId) href += '&c=' + encodeURIComponent(courseId);
      return (
        '<a href="' + href + '" class="lipa-quick-card lipa-quick-card--' + esc(cat.theme) + '">' +
        '<span class="lipa-quick-card__emoji">' + cat.emoji + '</span>' +
        '<span class="lipa-quick-card__body"><strong>' + esc(cat.shortLabel) + '</strong>' +
        '<span>' + esc(cat.desc) + '</span></span>' +
        '<span class="lipa-quick-card__meta">~' + (cat.questionCount || 10) + ' preg · 3–5 min</span>' +
        '<span class="lipa-quick-card__go" aria-hidden="true">→</span></a>'
      );
    }).join('') + '</div>';
  }

  function getProgressSummary() {
    return loadProgress();
  }

  global.LipaQuickTests = {
    esc: esc,
    getProgressSummary: getProgressSummary,
    getCategories: getCategories,
    getCategory: getCategory,
    listForAgeBand: listForAgeBand,
    getQuestions: getQuestions,
    pickSession: pickSession,
    recordResult: recordResult,
    pickCategoryForRoutine: pickCategoryForRoutine,
    buildRoutineQuickStep: buildRoutineQuickStep,
    renderCardsHtml: renderCardsHtml
  };
})(typeof window !== 'undefined' ? window : global);
