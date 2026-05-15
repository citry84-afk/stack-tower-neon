/**
 * LIPA Studios — utilidades compartidas: reto diario, racha, ranking local
 */
(function (global) {
  'use strict';

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function seedFromString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }

  function getDailySeed(siteKey) {
    return seedFromString((siteKey || 'lipa') + ':' + today());
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getStreak(storageKey) {
    try {
      var data = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (data.lastDate === today()) return data.count || 0;
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var y = yesterday.toISOString().split('T')[0];
      if (data.lastDate === y) return data.count || 0;
      return 0;
    } catch (e) {
      return 0;
    }
  }

  function bumpStreak(storageKey) {
    var data;
    try {
      data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (e) {
      data = {};
    }
    var t = today();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var y = yesterday.toISOString().split('T')[0];
    var count = 1;
    if (data.lastDate === t) count = (data.count || 0) + 1;
    else if (data.lastDate === y) count = (data.count || 0) + 1;
    data = { lastDate: t, count: count };
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) { /* ignore */ }
    return count;
  }

  function shareResult(opts) {
    var text = opts.text || '';
    var url = opts.url || global.location.href;
    if (global.navigator && global.navigator.share) {
      return global.navigator.share({ title: opts.title || 'LIPA Studios', text: text, url: url });
    }
    var q = encodeURIComponent(text + ' ' + url);
    global.open('https://twitter.com/intent/tweet?text=' + q, '_blank', 'noopener');
    return Promise.resolve();
  }

  function DailyBoard(gameId) {
    this.gameId = gameId;
    this.key = 'lipa_daily_' + gameId;
    this.day = today();
    this.data = this._load();
  }

  DailyBoard.prototype._load = function () {
    try {
      var raw = JSON.parse(localStorage.getItem(this.key) || '{}');
      if (raw.date !== this.day) return { date: this.day, scores: [] };
      return raw;
    } catch (e) {
      return { date: this.day, scores: [] };
    }
  };

  DailyBoard.prototype._save = function () {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) { /* ignore */ }
  };

  DailyBoard.prototype.submit = function (name, score, extra) {
    name = (name || 'Jugador').trim().substring(0, 15);
    this.data.scores.push({
      name: name,
      score: score,
      extra: extra || null,
      at: new Date().toISOString()
    });
  };

  DailyBoard.prototype.getTop = function (limit, higherIsBetter) {
    var list = this.data.scores.slice();
    list.sort(function (a, b) {
      return higherIsBetter === false ? a.score - b.score : b.score - a.score;
    });
    return list.slice(0, limit || 5);
  };

  DailyBoard.prototype.getBest = function (higherIsBetter) {
    var top = this.getTop(1, higherIsBetter);
    return top[0] || null;
  };

  var GLOBAL_TRAIN_KEY = 'lipa_global_train';
  var WEEKLY_KEY = 'lipa_weekly_challenge';
  var BEST_KEYS = {
    'reaction-test': 'lipa_reaction_best_ms',
    'aim-trainer': 'lipa_aim_best',
    'grid-reflex': 'lipa_grid_best',
    'stack-tower': 'stackTowerHighScore',
    'flash-tap': 'lipa_flash_tap_best',
    'esquiva-neon': 'lipa_esquiva_best'
  };

  var WEEKLY_POOL = [
    {
      id: 'grid-18',
      game: 'grid-reflex',
      type: 'min_score',
      target: 18,
      title: 'Grid 4×4 — 18 aciertos',
      desc: 'Consigue al menos 18 aciertos seguidos en una partida.',
      url: '/grid-reflejos-neon.html',
      cta: 'Jugar Grid'
    },
    {
      id: 'aim-400',
      game: 'aim-trainer',
      type: 'min_score',
      target: 400,
      title: 'Aim Trainer — 400 pts',
      desc: 'Suma 400 puntos o más en una ronda de 30 segundos.',
      url: '/aim-trainer-neon.html',
      cta: 'Entrenar aim'
    },
    {
      id: 'react-240',
      game: 'reaction-test',
      type: 'max_ms',
      target: 240,
      title: 'Reflejos — media bajo 240 ms',
      desc: 'Completa el test de 5 intentos con media inferior a 240 ms.',
      url: '/test-reflejos.html',
      cta: 'Hacer test'
    },
    {
      id: 'stack-60',
      game: 'stack-tower',
      type: 'min_score',
      target: 60,
      title: 'Stack Tower — 60 puntos',
      desc: 'Apila bloques hasta 60 puntos en una partida.',
      url: '/',
      cta: 'Jugar Stack'
    },
    {
      id: 'flash-180',
      game: 'flash-tap',
      type: 'min_score',
      target: 180,
      title: 'Flash Tap — 180 pts',
      desc: 'Toca los círculos a tiempo y suma 180 puntos o más en 30 s.',
      url: '/toque-flash-neon.html',
      cta: 'Jugar Flash Tap'
    },
    {
      id: 'esquiva-120',
      game: 'esquiva-neon',
      type: 'min_score',
      target: 120,
      title: 'Neon Esquiva — 120 pts',
      desc: 'Esquiva bloques y supera 120 puntos en una ronda.',
      url: '/esquiva-neon.html',
      cta: 'Jugar Esquiva'
    },
    {
      id: 'explorer',
      game: 'any',
      type: 'play_count',
      target: 4,
      title: 'Explorador LIPA',
      desc: 'Juega a 4 minijuegos distintos esta semana (cualquiera del arcade).',
      url: '/jugar.html',
      cta: 'Ver arcade'
    }
  ];

  function getWeekId() {
    var d = new Date();
    var day = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var thu = day.getUTCDay() || 7;
    day.setUTCDate(day.getUTCDate() + 4 - thu);
    var year = day.getUTCFullYear();
    var jan1 = new Date(Date.UTC(year, 0, 1));
    var week = Math.ceil((((day - jan1) / 86400000) + 1) / 7);
    return year + '-W' + (week < 10 ? '0' : '') + week;
  }

  function getGlobalTrain() {
    try {
      return JSON.parse(localStorage.getItem(GLOBAL_TRAIN_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function bumpGlobalTrain() {
    var data = getGlobalTrain();
    var t = today();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var y = yesterday.toISOString().split('T')[0];
    var streak = 1;
    if (data.lastDate === t) {
      return data.streak || 1;
    }
    if (data.lastDate === y) streak = (data.streak || 0) + 1;
    data = {
      lastDate: t,
      streak: streak,
      totalDays: (data.totalDays || 0) + 1
    };
    try {
      localStorage.setItem(GLOBAL_TRAIN_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
    return streak;
  }

  function getGlobalStreak() {
    var data = getGlobalTrain();
    var t = today();
    if (data.lastDate === t) return data.streak || 1;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (data.lastDate === yesterday.toISOString().split('T')[0]) return data.streak || 0;
    return 0;
  }

  function getWeeklyState() {
    var weekId = getWeekId();
    try {
      var raw = JSON.parse(localStorage.getItem(WEEKLY_KEY) || '{}');
      if (raw.weekId !== weekId) {
        return {
          weekId: weekId,
          challengeId: null,
          plays: [],
          values: {},
          completed: false
        };
      }
      return raw;
    } catch (e) {
      return { weekId: weekId, plays: [], values: {}, completed: false };
    }
  }

  function saveWeeklyState(state) {
    try {
      localStorage.setItem(WEEKLY_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function getWeeklyChallengeDefForWeek(weekId) {
    var idx = seedFromString(weekId || getWeekId()) % WEEKLY_POOL.length;
    return WEEKLY_POOL[idx];
  }

  function getWeeklyChallengeDef() {
    return getWeeklyChallengeDefForWeek(getWeekId());
  }

  function buildChallengeUrl(opts) {
    opts = opts || {};
    var weekId = opts.weekId || getWeekId();
    var def = getWeeklyChallengeDefForWeek(weekId);
    var origin = 'https://lipastudios.com';
    if (typeof location !== 'undefined' && location.origin && location.origin.indexOf('http') === 0) {
      origin = location.origin;
    }
    var parts = ['reto=' + encodeURIComponent(weekId)];
    if (opts.vs != null && def.game !== 'any') {
      parts.push('vs=' + encodeURIComponent(opts.vs));
    }
    if (opts.from) {
      parts.push('from=' + encodeURIComponent(String(opts.from).substring(0, 20)));
    }
    return origin + '/jugar.html?' + parts.join('&');
  }

  function parseChallengeFromUrl(search) {
    var qs = search;
    if (qs == null && typeof location !== 'undefined') qs = location.search;
    if (!qs) return null;
    var params = new URLSearchParams(qs.charAt(0) === '?' ? qs : '?' + qs);
    var weekId = params.get('reto') || params.get('desafio');
    if (!weekId) return null;
    var vsRaw = params.get('vs');
    var from = params.get('from');
    var def = getWeeklyChallengeDefForWeek(weekId);
    return {
      weekId: weekId,
      vs: vsRaw != null && vsRaw !== '' ? parseFloat(vsRaw) : null,
      from: from ? decodeURIComponent(from) : null,
      def: def,
      isCurrentWeek: weekId === getWeekId()
    };
  }

  function formatVsLabel(def, vs) {
    if (vs == null || isNaN(vs)) return '';
    if (def.type === 'max_ms') return 'Supera una media de ' + vs + ' ms';
    if (def.type === 'play_count') return 'Juega a ' + Math.ceil(vs) + ' minijuegos distintos';
    return 'Supera ' + vs + ' puntos';
  }

  function didBeatChallengeScore(def, myScore, vs) {
    if (vs == null || isNaN(vs) || myScore == null) return false;
    if (def.type === 'max_ms') return myScore <= vs;
    if (def.type === 'play_count') return myScore >= vs;
    return myScore >= vs;
  }

  function buildMyChallengeUrl(fromName) {
    var w = getWeeklyChallenge();
    var vs = null;
    if (w.def.game !== 'any') {
      if (w.def.type === 'play_count') vs = w.state.plays.length || null;
      else vs = w.state.values[w.def.game] || null;
    }
    return buildChallengeUrl({
      weekId: w.weekId,
      vs: vs,
      from: fromName || null
    });
  }

  function copyToClipboard(text) {
    if (global.navigator && global.navigator.clipboard && global.navigator.clipboard.writeText) {
      return global.navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = global.document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        global.document.body.appendChild(ta);
        ta.select();
        global.document.execCommand('copy');
        global.document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function getWeeklyChallenge() {
    var def = getWeeklyChallengeDef();
    var state = getWeeklyState();
    if (!state.challengeId) {
      state.challengeId = def.id;
      saveWeeklyState(state);
    }
    var progress = 0;
    var label = '';
    if (def.type === 'play_count') {
      progress = state.plays.length;
      label = progress + ' / ' + def.target + ' juegos';
    } else if (def.type === 'max_ms') {
      var v = state.values[def.game];
      progress = v ? v : 9999;
      label = v ? v + ' ms (objetivo ≤ ' + def.target + ')' : 'Sin intento aún';
    } else {
      var s = state.values[def.game] || 0;
      progress = s;
      label = s + ' / ' + def.target;
    }
    var completed = state.completed;
    if (!completed) {
      if (def.type === 'play_count') completed = state.plays.length >= def.target;
      else if (def.type === 'max_ms') completed = state.values[def.game] && state.values[def.game] <= def.target;
      else completed = (state.values[def.game] || 0) >= def.target;
    }
    if (completed && !state.completed) {
      state.completed = true;
      saveWeeklyState(state);
    }
    return {
      def: def,
      state: state,
      progress: progress,
      label: label,
      completed: completed,
      weekId: getWeekId()
    };
  }

  function updateBest(gameId, value, higherIsBetter) {
    var key = BEST_KEYS[gameId];
    if (!key || value == null) return;
    var prev = parseInt(localStorage.getItem(key) || (higherIsBetter === false ? '99999' : '0'), 10);
    var better = higherIsBetter === false ? value < prev : value > prev;
    if (better || (higherIsBetter === false && prev >= 99999)) {
      try {
        localStorage.setItem(key, String(value));
      } catch (e) { /* ignore */ }
    }
  }

  function recordSession(gameId, payload) {
    payload = payload || {};
    if (global.LipaAnalytics && LipaAnalytics.trackGameComplete) {
      LipaAnalytics.trackGameComplete(gameId, payload);
    }
    bumpGlobalTrain();
    var state = getWeeklyState();
    if (state.plays.indexOf(gameId) === -1) state.plays.push(gameId);
    if (payload.score != null) {
      var higher = payload.higherIsBetter !== false;
      if (gameId === 'reaction-test') higher = false;
      var cur = state.values[gameId];
      if (cur == null) state.values[gameId] = payload.score;
      else if (higher && payload.score > cur) state.values[gameId] = payload.score;
      else if (!higher && payload.score < cur) state.values[gameId] = payload.score;
      updateBest(gameId, payload.score, higher);
    }
    saveWeeklyState(state);
    getWeeklyChallenge();
    return state;
  }

  function getAllRecords() {
    return {
      reactionMs: parseInt(localStorage.getItem(BEST_KEYS['reaction-test']) || '0', 10) || null,
      aim: parseInt(localStorage.getItem(BEST_KEYS['aim-trainer']) || '0', 10) || null,
      grid: parseInt(localStorage.getItem(BEST_KEYS['grid-reflex']) || '0', 10) || null,
      stack: parseInt(localStorage.getItem(BEST_KEYS['stack-tower']) || '0', 10) || null,
      flashTap: parseInt(localStorage.getItem(BEST_KEYS['flash-tap']) || '0', 10) || null,
      esquiva: parseInt(localStorage.getItem(BEST_KEYS['esquiva-neon']) || '0', 10) || null,
      streak: getGlobalStreak(),
      totalDays: getGlobalTrain().totalDays || 0,
      gamesToday: getWeeklyState().plays.length
    };
  }

  global.LipaDaily = {
    today: today,
    seedFromString: seedFromString,
    getDailySeed: getDailySeed,
    mulberry32: mulberry32,
    getStreak: getStreak,
    bumpStreak: bumpStreak,
    shareResult: shareResult,
    DailyBoard: DailyBoard,
    getWeekId: getWeekId,
    bumpGlobalTrain: bumpGlobalTrain,
    getGlobalStreak: getGlobalStreak,
    getWeeklyChallenge: getWeeklyChallenge,
    getWeeklyChallengeDefForWeek: getWeeklyChallengeDefForWeek,
    buildChallengeUrl: buildChallengeUrl,
    buildMyChallengeUrl: buildMyChallengeUrl,
    parseChallengeFromUrl: parseChallengeFromUrl,
    formatVsLabel: formatVsLabel,
    didBeatChallengeScore: didBeatChallengeScore,
    copyToClipboard: copyToClipboard,
    recordSession: recordSession,
    getAllRecords: getAllRecords,
    updateBest: updateBest
  };
})(typeof window !== 'undefined' ? window : global);
