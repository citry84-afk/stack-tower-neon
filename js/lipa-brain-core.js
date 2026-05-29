/**
 * LIPA Brain Gym — núcleo: dispositivo, historial, niveles, rutinas, evolución
 */
(function (global) {
  'use strict';

  var PROFILE_KEY = 'lipa_brain_profile';
  var PROFILE_VERSION = 3;
  var DEVICE_KEY = 'lipa_device_id';
  var HISTORY_KEY = 'lipa_brain_history_v1';
  var LEVELS_KEY = 'lipa_brain_levels_v1';
  var GLOBAL_KEY = 'lipa_brain_global_v1';
  var MAX_HISTORY = 200;

  var GAMES, AGE_POOLS, CALC_LEVELS, TABLAS_LEVELS, RANKS, ACHIEVEMENTS;

  function loadCatalog() {
    var c = global.LipaBrainCatalog || {};
    GAMES = c.GAMES || {};
    AGE_POOLS = c.AGE_POOLS || {};
    CALC_LEVELS = c.CALC_LEVELS || [];
    TABLAS_LEVELS = c.TABLAS_LEVELS || [];
    RANKS = c.RANKS || [];
    ACHIEVEMENTS = c.ACHIEVEMENTS || [];
  }

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getDeviceId() {
    try {
      var id = localStorage.getItem(DEVICE_KEY);
      if (!id) {
        id = uuid();
        localStorage.setItem(DEVICE_KEY, id);
      }
      return id;
    } catch (e) {
      return 'local';
    }
  }

  function shortDeviceCode() {
    var id = getDeviceId();
    return id.replace(/-/g, '').substring(0, 8).toUpperCase();
  }

  function sk(suffix) {
    return global.LipaBrainProfiles && LipaBrainProfiles.storageKey
      ? LipaBrainProfiles.storageKey(suffix)
      : ({
        profile: PROFILE_KEY,
        global: GLOBAL_KEY,
        levels: LEVELS_KEY,
        history: HISTORY_KEY,
        curriculum: 'lipa_curriculum_progress_v1'
      })[suffix] || suffix;
  }

  function getGlobal() {
    try {
      return JSON.parse(localStorage.getItem(sk('global')) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveGlobal(g) {
    try {
      localStorage.setItem(sk('global'), JSON.stringify(g));
    } catch (e) { /* ignore */ }
  }

  function getLevels() {
    try {
      return JSON.parse(localStorage.getItem(sk('levels')) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveLevels(levels) {
    try {
      localStorage.setItem(sk('levels'), JSON.stringify(levels));
    } catch (e) { /* ignore */ }
  }

  function getActivityLevel(activityId) {
    var levels = getLevels();
    var entry = levels[activityId];
    if (!entry) {
      var profile = getProfile();
      var start = 1;
      if (profile && profile.courseId) {
        if (profile.courseId.indexOf('eso-2') === 0) start = 8;
        else if (profile.courseId.indexOf('eso-') === 0) start = 6;
        else if (/^primaria-[56]$/.test(profile.courseId)) start = 4;
        else if (/^primaria-[34]$/.test(profile.courseId)) start = 3;
      } else if (profile && profile.ageBand === '6-9') start = 1;
      else if (profile && profile.ageBand === '10-12') start = 2;
      else if (profile && profile.ageBand === '13-17') start = 6;
      else if (profile) start = 3;
      entry = { level: start, plays: 0, best: null };
      levels[activityId] = entry;
      saveLevels(levels);
    }
    return entry.level || 1;
  }

  /** Nivel efectivo en juego: URL ?brainLevel=, actividad curriculum, suelo por curso. */
  function resolveBrainLevel(opts) {
    opts = opts || {};
    var gameId = opts.gameId || opts.activityId || 'neon-calculo';
    var level = getActivityLevel(gameId);
    try {
      var params = new URLSearchParams(global.location.search);
      var fromUrl = parseInt(params.get('brainLevel'), 10);
      if (fromUrl >= 1 && fromUrl <= 12) level = fromUrl;
      var courseId = params.get('course') || '';
      if (!courseId) {
        var prof = getProfile();
        if (prof && prof.courseId) courseId = prof.courseId;
      }
      if (courseId.indexOf('eso-2') === 0) level = Math.max(level, 8);
      else if (courseId.indexOf('eso-') === 0) level = Math.max(level, 6);
      else if (/^primaria-6$/.test(courseId)) level = Math.max(level, 5);
      else if (/^primaria-5$/.test(courseId)) level = Math.max(level, 4);
    } catch (e) { /* ignore */ }
    return Math.max(1, Math.min(12, level));
  }

  function setActivityLevel(activityId, level) {
    var levels = getLevels();
    if (!levels[activityId]) levels[activityId] = { level: 1, plays: 0 };
    levels[activityId].level = Math.max(1, Math.min(12, level));
    saveLevels(levels);
  }

  function getHistory() {
    try {
      var list = JSON.parse(localStorage.getItem(sk('history')) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(list) {
    try {
      localStorage.setItem(sk('history'), JSON.stringify(list.slice(-MAX_HISTORY)));
    } catch (e) { /* ignore */ }
  }

  function getProfile() {
    try {
      var raw = JSON.parse(localStorage.getItem(sk('profile')) || 'null');
      if (!raw || raw.version < 1) return null;
      if (global.LipaBrainProfiles) {
        var meta = LipaBrainProfiles.getActiveMeta();
        if (meta) {
          raw.displayName = meta.name;
          raw.profileId = meta.id;
          if (meta.courseId && !raw.courseId) raw.courseId = meta.courseId;
        }
      }
      return raw;
    } catch (e) {
      return null;
    }
  }

  function syncProfileCourse(data) {
    if (data.courseId && global.LipaCurriculum) {
      data.ageBand = LipaCurriculum.courseToAgeBand(data.courseId);
      var course = LipaCurriculum.getCourse(data.courseId);
      if (course) data.courseLabel = course.label;
    } else if (!data.ageBand) {
      data.ageBand = '10-12';
    }
    return data;
  }

  function saveProfile(data) {
    data.version = PROFILE_VERSION;
    data.updatedAt = new Date().toISOString();
    if (!data.createdAt) data.createdAt = data.updatedAt;
    syncProfileCourse(data);
    if (!data.routine) data.routine = buildRoutine(data);
    if (global.LipaBrainProfiles) {
      data.profileId = LipaBrainProfiles.getActiveId();
      var metaPatch = {};
      if (data.displayName) metaPatch.name = data.displayName;
      if (data.courseId) metaPatch.courseId = data.courseId;
      if (metaPatch.name || metaPatch.courseId) {
        LipaBrainProfiles.updateProfileMeta(LipaBrainProfiles.getActiveId(), metaPatch);
      }
    }
    try {
      localStorage.setItem(sk('profile'), JSON.stringify(data));
    } catch (e) { /* ignore */ }
    return data;
  }

  function hasProfile() {
    return !!getProfile();
  }

  function shouldShowOnboarding() {
    if (global.location && global.location.search.indexOf('onboarding=1') >= 0) return true;
    return !hasProfile();
  }

  function clearProfile() {
    try {
      localStorage.removeItem(sk('profile'));
    } catch (e) { /* ignore */ }
  }

  function addXp(amount) {
    var g = getGlobal();
    g.xp = (g.xp || 0) + amount;
    g.totalSessions = (g.totalSessions || 0) + 1;
    saveGlobal(g);
    return g.xp;
  }

  function getRank(xp) {
    xp = xp != null ? xp : (getGlobal().xp || 0);
    var rank = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].minXp) rank = RANKS[i];
    }
    return rank;
  }

  function bumpStreak() {
    var g = getGlobal();
    var t = today();
    var y = new Date();
    y.setDate(y.getDate() - 1);
    var ys = y.toISOString().split('T')[0];
    if (g.lastDate === t) return g.streak || 1;
    var streak = 1;
    if (g.lastDate === ys) streak = (g.streak || 0) + 1;
    g.lastDate = t;
    g.streak = streak;
    g.totalDays = (g.totalDays || 0) + (g._bumpedToday ? 0 : 1);
    g._bumpedToday = true;
    saveGlobal(g);
    return streak;
  }

  function recordActivityResult(activityId, payload) {
    loadCatalog();
    payload = payload || {};
    var game = GAMES[activityId];
    if (!game) return null;

    if (global.LipaDaily && LipaDaily.recordSession) {
      LipaDaily.recordSession(activityId, {
        score: payload.score,
        higherIsBetter: payload.higherIsBetter != null ? payload.higherIsBetter : game.higherIsBetter
      });
    }

    var levels = getLevels();
    if (!levels[activityId]) levels[activityId] = { level: getActivityLevel(activityId), plays: 0 };
    var lv = levels[activityId].level || 1;
    var acc = payload.accuracy;
    if (acc == null && payload.correct != null && payload.wrong != null) {
      var tot = payload.correct + payload.wrong;
      acc = tot ? payload.correct / tot : 1;
    }
    if (acc != null) {
      if (acc >= 0.85 && lv < 12) lv++;
      else if (acc < 0.55 && lv > 1) lv--;
      levels[activityId].level = lv;
    }
    levels[activityId].plays = (levels[activityId].plays || 0) + 1;
    if (payload.score != null) {
      var better = game.higherIsBetter
        ? payload.score > (levels[activityId].best || 0)
        : payload.score < (levels[activityId].best || 99999);
      if (levels[activityId].best == null || better) levels[activityId].best = payload.score;
    }
    saveLevels(levels);

    var entry = {
      id: uuid(),
      date: today(),
      at: new Date().toISOString(),
      activityId: activityId,
      score: payload.score,
      accuracy: acc,
      level: lv,
      correct: payload.correct,
      wrong: payload.wrong,
      durationSec: payload.durationSec || 30,
      extra: payload.extra || null
    };

    var hist = getHistory();
    hist.push(entry);
    saveHistory(hist);

    var xpGain = 8 + Math.floor((payload.score || 0) / 25);
    if (acc >= 0.9) xpGain += 5;

    var curriculumResult = null;
    var curriculumPayload = payload;
    if (global.LipaCurriculum && global.location) {
      try {
        var params = new URLSearchParams(global.location.search);
        if (params.get('curriculum') === '1' && params.get('activity')) {
          var sessionComplete = true;
          if (acc == null) {
            var attempts = (payload.correct || 0) + (payload.wrong || 0);
            if (attempts > 0) {
              acc = payload.correct / attempts;
            } else if (payload.score != null) {
              acc = Math.min(0.92, 0.5 + Math.min(payload.score, 200) / 400);
            } else {
              acc = 0.75;
            }
          }
          curriculumPayload = Object.assign({}, payload, { sessionComplete: sessionComplete, accuracy: acc });
          var courseId = params.get('course') || '';
          var subjectId = params.get('subject') || '';
          var unitId = params.get('unit') || '';
          var activityIdCur = params.get('activity') || '';
          var actCtx = LipaCurriculum.getActivity(courseId, subjectId, unitId, activityIdCur);
          if (actCtx && actCtx.activity && actCtx.activity.rewardXp) {
            xpGain = actCtx.activity.rewardXp;
            if (acc >= 0.9) xpGain += 5;
            else if (acc >= 0.75) xpGain += 3;
          }
          curriculumResult = LipaCurriculum.tryCompleteFromGame(
            activityIdCur,
            {
              score: curriculumPayload.score,
              accuracy: acc,
              correct: curriculumPayload.correct,
              wrong: curriculumPayload.wrong,
              gameId: activityId,
              sessionComplete: sessionComplete
            },
            courseId
          );
          if (curriculumResult) curriculumResult.xpGain = xpGain;
        }
      } catch (e) { /* ignore */ }
    }
    addXp(xpGain);
    bumpStreak();
    entry.xpGain = xpGain;
    entry.curriculumResult = curriculumResult;

    if (global.LipaRoutineFlow && LipaRoutineFlow.onStepRecorded) {
      try {
        LipaRoutineFlow.onStepRecorded(activityId);
      } catch (e) { /* ignore */ }
    }

    if (global.LipaGameFeedback) {
      try {
        var celebrate = false;
        if (global.location) {
          var q = new URLSearchParams(global.location.search);
          celebrate = q.get('curriculum') === '1' || q.get('rutina') === '1';
        }
        if (celebrate && (!curriculumResult || curriculumResult.passed)) {
          LipaGameFeedback.onActivityComplete(curriculumResult && curriculumResult.xpGain);
        }
      } catch (e) { /* ignore */ }
    }

    if (global.LipaCurriculumSession && global.LipaCurriculumSession.onGameRecorded) {
      try {
        LipaCurriculumSession.onGameRecorded(activityId, payload, curriculumResult);
      } catch (e) { /* ignore */ }
    }

    return entry;
  }

  function daysSincePlayed(activityId) {
    var hist = getHistory();
    for (var i = hist.length - 1; i >= 0; i--) {
      if (hist[i].activityId === activityId) {
        var d = new Date(hist[i].date);
        var now = new Date(today());
        return Math.floor((now - d) / 86400000);
      }
    }
    return 99;
  }

  var GOAL_BOOST = {
    study: { math: 0.12, reflex: -0.05, language: 0.1 },
    gaming: { math: -0.1, reflex: 0.15, language: -0.05 },
    sport: { math: -0.05, reflex: 0.1, language: 0 },
    fun: { math: 0, reflex: 0, language: 0 }
  };

  function expandPool(arr, n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(arr[i % arr.length]);
    return out;
  }

  function mergeSteps(mathIds, reflexIds, total, focus) {
    var ids = [];
    var mi = 0;
    var ri = 0;
    var guard = 0;
    while (ids.length < total && guard < total * 4) {
      guard++;
      var takeMath;
      if (focus === 'math') takeMath = mi < mathIds.length || ri >= reflexIds.length;
      else if (focus === 'reflex') takeMath = ri >= reflexIds.length && mi < mathIds.length;
      else takeMath = ids.length % 2 === 0;
      if (takeMath && mi < mathIds.length) ids.push(mathIds[mi++]);
      else if (ri < reflexIds.length) ids.push(reflexIds[ri++]);
      else if (mi < mathIds.length) ids.push(mathIds[mi++]);
      else { mi = 0; ri = 0; }
    }
    return ids;
  }

  function prioritizeIds(ids) {
    return ids.slice().sort(function (a, b) {
      return daysSincePlayed(b) - daysSincePlayed(a);
    });
  }

  function buildRoutine(profile) {
    loadCatalog();
    profile = profile || getProfile() || {};
    syncProfileCourse(profile);

    if (profile.courseId && global.LipaCurriculum) {
      var fromCourse = LipaCurriculum.buildRoutineFromCourse(profile);
      if (fromCourse && fromCourse.steps && fromCourse.steps.length) return fromCourse;
    }

    var minutes = parseInt(profile.minutes, 10) || 5;
    minutes = Math.max(5, Math.min(15, minutes));

    var ageBand = profile.ageBand || '10-12';
    var pool = AGE_POOLS[ageBand] || AGE_POOLS['10-12'];
    var focus = profile.focus || 'both';
    var goal = profile.goal || 'fun';

    var langPool = pool.language || [];
    var hasLang = langPool.length > 0;
    var mathSlots = 1;
    var reflexSlots = 1;
    var langSlots = 0;

    if (focus === 'language' && hasLang) {
      langSlots = Math.max(2, Math.ceil(minutes * 0.55));
      mathSlots = Math.max(0, Math.min(2, Math.floor(minutes * 0.2)));
      reflexSlots = Math.max(1, minutes - langSlots - mathSlots);
    } else if (focus === 'math') {
      mathSlots = Math.max(2, Math.ceil(minutes * 0.65));
      reflexSlots = Math.max(1, minutes - mathSlots);
    } else if (focus === 'reflex') {
      reflexSlots = Math.max(2, Math.ceil(minutes * 0.65));
      mathSlots = Math.max(1, minutes - reflexSlots);
    } else {
      if (minutes === 5) {
        mathSlots = 2;
        reflexSlots = 3;
      } else if (minutes === 10) {
        mathSlots = 3;
        langSlots = hasLang ? 1 : 0;
        reflexSlots = 10 - mathSlots - langSlots;
      } else {
        mathSlots = 4;
        langSlots = hasLang ? 2 : 0;
        reflexSlots = minutes - mathSlots - langSlots;
      }
    }

    var boost = GOAL_BOOST[goal] || GOAL_BOOST.fun;
    if (hasLang && focus === 'both' && boost.language > 0 && langSlots < 1 && minutes >= 10) {
      langSlots = 1;
      reflexSlots = Math.max(1, reflexSlots - 1);
    }

    var mathGames = prioritizeIds(expandPool(pool.math || [], mathSlots + 2)).slice(0, mathSlots);
    var reflexGames = prioritizeIds(expandPool(pool.reflex || [], reflexSlots + 2)).slice(0, reflexSlots);
    var langGames = hasLang
      ? prioritizeIds(expandPool(langPool, langSlots + 1)).slice(0, langSlots)
      : [];

    var seed = (global.LipaDaily && LipaDaily.getDailySeed)
      ? LipaDaily.getDailySeed('brain-routine')
      : today();
    var rng = global.LipaDaily && LipaDaily.mulberry32
      ? LipaDaily.mulberry32(global.LipaDaily.seedFromString(String(seed)))
      : function () { return Math.random(); };

    var ids = mathGames.concat(langGames).concat(reflexGames);
    var shuffled = ids.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = t;
    }

    var steps = shuffled.map(function (id, i) {
      var g = GAMES[id];
      var lv = getActivityLevel(id);
      return {
        order: i + 1,
        gameId: id,
        name: g.name,
        short: g.short,
        emoji: g.emoji,
        url: g.url,
        desc: g.desc,
        minutes: 1,
        level: lv,
        tip: tipForStep(id, ageBand, lv)
      };
    });

    var titles = {
      math: 'Rutina mates · ' + minutes + ' min',
      reflex: 'Rutina reflejos · ' + minutes + ' min',
      language: 'Rutina idiomas · ' + minutes + ' min',
      both: 'Tu gym cerebral · ' + minutes + ' min'
    };

    return {
      title: titles[focus] || titles.both,
      subtitle: subtitleFor(profile),
      minutes: minutes,
      steps: steps,
      firstUrl: steps[0] ? steps[0].url : '/gym-cerebro.html',
      date: today()
    };
  }

  function tipForStep(gameId, ageBand, lv) {
    if (gameId === 'neon-calculo') {
      return 'Nivel Brain ' + lv + ' · suma/resta';
    }
    if (gameId === 'tablas-relampago') {
      var t = TABLAS_LEVELS[Math.min(11, lv - 1)] || TABLAS_LEVELS[0];
      return 'Tablas ' + t.min + '–' + t.max + ' · nivel ' + lv;
    }
    if (gameId === 'reaction-test') return '5 intentos · media en ms';
    if (gameId === 'neon-palabras') {
      var tier = global.LipaVocabBank ? LipaVocabBank.tierForLevel(lv) + 1 : 1;
      return 'ES ↔ EN · vocab nivel ' + tier;
    }
    return 'Nivel ' + lv + ' · 1 min';
  }

  function subtitleFor(profile) {
    var ageLabels = {
      '3-5': 'Peques (3–5 años)',
      '6-9': 'Primaria (6–9 años)',
      '10-12': 'Primaria (10–12 años)',
      '13-17': 'ESO / Bachillerato',
      '18+': 'Adultos'
    };
    var focusLabels = {
      math: 'Cálculo mental',
      reflex: 'Reflejos',
      language: 'Idiomas',
      both: 'Mates + reflejos + idiomas'
    };
    return (ageLabels[profile.ageBand] || '') + ' · ' + (focusLabels[profile.focus] || focusLabels.both);
  }

  function getCalcConfig(level) {
    loadCatalog();
    var idx = Math.max(0, Math.min(11, (level || 1) - 1));
    return CALC_LEVELS[idx] || CALC_LEVELS[0];
  }

  function getTablasRange(level) {
    loadCatalog();
    var idx = Math.max(0, Math.min(11, (level || 1) - 1));
    return TABLAS_LEVELS[idx] || TABLAS_LEVELS[0];
  }

  function getStats() {
    loadCatalog();
    var hist = getHistory();
    var g = getGlobal();
    var levels = getLevels();
    var mathCorrect = 0;
    var langCorrect = 0;
    var lenguaCorrect = 0;
    var naturalesCorrect = 0;
    var socialesCorrect = 0;
    var pequesCorrect = 0;
    var bestReactionMs = null;

    hist.forEach(function (h) {
      if (GAMES[h.activityId] && GAMES[h.activityId].pillar === 'math' && h.correct) {
        mathCorrect += h.correct;
      }
      if (GAMES[h.activityId] && GAMES[h.activityId].pillar === 'language' && h.correct) {
        langCorrect += h.correct;
      }
      if (GAMES[h.activityId] && GAMES[h.activityId].pillar === 'language-es' && h.correct) {
        lenguaCorrect += h.correct;
      }
      if (GAMES[h.activityId] && GAMES[h.activityId].pillar === 'science' && h.correct) {
        naturalesCorrect += h.correct;
      }
      if (GAMES[h.activityId] && GAMES[h.activityId].pillar === 'social' && h.correct) {
        socialesCorrect += h.correct;
      }
      if (GAMES[h.activityId] && GAMES[h.activityId].pillar === 'infantil' && h.correct) {
        pequesCorrect += h.correct;
      }
      if (h.activityId === 'reaction-test' && h.score != null) {
        if (bestReactionMs == null || h.score < bestReactionMs) bestReactionMs = h.score;
      }
    });

    var weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    var weekSessions = hist.filter(function (h) {
      return new Date(h.date) >= weekAgo;
    }).length;

    var byDay = {};
    hist.forEach(function (h) {
      byDay[h.date] = (byDay[h.date] || 0) + 1;
    });

    return {
      totalSessions: g.totalSessions || hist.length,
      streak: g.streak || (global.LipaDaily && LipaDaily.getGlobalStreak ? LipaDaily.getGlobalStreak() : 0),
      xp: g.xp || 0,
      rank: getRank(g.xp || 0),
      weekSessions: weekSessions,
      mathCorrect: mathCorrect,
      langCorrect: langCorrect,
      lenguaCorrect: lenguaCorrect,
      naturalesCorrect: naturalesCorrect,
      socialesCorrect: socialesCorrect,
      pequesCorrect: pequesCorrect,
      bestReactionMs: bestReactionMs,
      levels: levels,
      byDay: byDay,
      history: hist
    };
  }

  function getAchievements() {
    var stats = getStats();
    return ACHIEVEMENTS.filter(function (a) {
      return a.check(stats);
    });
  }

  function getActivitySummaries() {
    loadCatalog();
    var hist = getHistory();
    var levels = getLevels();
    var out = [];
    Object.keys(GAMES).forEach(function (id) {
      var g = GAMES[id];
      var plays = hist.filter(function (h) { return h.activityId === id; });
      var recent = plays.slice(-14);
      out.push({
        id: id,
        game: g,
        level: (levels[id] && levels[id].level) || 1,
        best: levels[id] && levels[id].best,
        plays: plays.length,
        recentScores: recent.map(function (h) { return h.score; }),
        lastPlayed: plays.length ? plays[plays.length - 1].date : null
      });
    });
    return out.filter(function (a) { return a.plays > 0 || a.best != null; })
      .sort(function (a, b) { return b.plays - a.plays; });
  }

  function exportBackup() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      deviceId: getDeviceId(),
      code: shortDeviceCode(),
      profile: getProfile(),
      global: getGlobal(),
      levels: getLevels(),
      history: getHistory()
    };
  }

  function importBackup(data, opts) {
    opts = opts || {};
    if (!data || typeof data !== 'object') {
      return { ok: false, error: 'Datos no válidos' };
    }
    try {
      if (data.deviceId) localStorage.setItem(DEVICE_KEY, data.deviceId);
      if (data.profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
      if (data.global) localStorage.setItem(GLOBAL_KEY, JSON.stringify(data.global));
      if (data.levels) localStorage.setItem(LEVELS_KEY, JSON.stringify(data.levels));
      if (data.history && Array.isArray(data.history)) saveHistory(data.history);
      if (opts.rebuildRoutine !== false) {
        var p = getProfile();
        if (p) {
          p.routine = buildRoutine(p);
          saveProfile(p);
        }
      }
      return { ok: true, code: shortDeviceCode() };
    } catch (e) {
      return { ok: false, error: 'No se pudo restaurar' };
    }
  }

  function refreshProfileRoutine() {
    var p = getProfile();
    if (!p) return null;
    var t = today();
    var need = !p.routine || p.routine.date !== t || p.routine.courseId !== p.courseId;
    if (!need && p.routine) {
      var a = (p.routineSubjects || []).slice().sort().join(',');
      var b = (p.routine.routineSubjects || []).slice().sort().join(',');
      if (a !== b) need = true;
    }
    if (need) {
      p.routine = buildRoutine(p);
      saveProfile(p);
    }
    return p;
  }

  global.LipaBrain = {
    PROFILE_KEY: PROFILE_KEY,
    getDeviceId: getDeviceId,
    shortDeviceCode: shortDeviceCode,
    getProfile: getProfile,
    saveProfile: saveProfile,
    hasProfile: hasProfile,
    shouldShowOnboarding: shouldShowOnboarding,
    clearProfile: clearProfile,
    buildRoutine: buildRoutine,
    recordActivityResult: recordActivityResult,
    getActivityLevel: getActivityLevel,
    resolveBrainLevel: resolveBrainLevel,
    setActivityLevel: setActivityLevel,
    getCalcConfig: getCalcConfig,
    getTablasRange: getTablasRange,
    getStats: getStats,
    getAchievements: getAchievements,
    getActivitySummaries: getActivitySummaries,
    getHistory: getHistory,
    getRank: getRank,
    exportBackup: exportBackup,
    importBackup: importBackup,
    refreshProfileRoutine: refreshProfileRoutine,
    addXp: addXp,
    bumpStreak: bumpStreak,
    GAMES: function () { loadCatalog(); return GAMES; }
  };

  global.LipaBrainPlan = {
    PROFILE_KEY: PROFILE_KEY,
    GAMES: function () { loadCatalog(); return GAMES; },
    buildRoutine: buildRoutine,
    getProfile: getProfile,
    saveProfile: saveProfile,
    clearProfile: clearProfile,
    hasProfile: hasProfile,
    shouldShowOnboarding: shouldShowOnboarding
  };

  loadCatalog();
})(typeof window !== 'undefined' ? window : global);
