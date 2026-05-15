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

  global.LipaDaily = {
    today: today,
    seedFromString: seedFromString,
    getDailySeed: getDailySeed,
    mulberry32: mulberry32,
    getStreak: getStreak,
    bumpStreak: bumpStreak,
    shareResult: shareResult,
    DailyBoard: DailyBoard
  };
})(typeof window !== 'undefined' ? window : global);
