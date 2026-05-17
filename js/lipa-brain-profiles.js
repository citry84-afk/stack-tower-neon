/**
 * Perfiles locales — varios hermanos en el mismo dispositivo
 */
(function (global) {
  'use strict';

  var INDEX_KEY = 'lipa_brain_profiles_index_v1';
  var ACTIVE_KEY = 'lipa_brain_active_profile_v1';
  var MIGRATED_KEY = 'lipa_brain_profiles_migrated_v1';

  var STORAGE_SUFFIX = {
    profile: 'lipa_brain_profile',
    global: 'lipa_brain_global_v1',
    levels: 'lipa_brain_levels_v1',
    history: 'lipa_brain_history_v1',
    curriculum: 'lipa_curriculum_progress_v1'
  };

  var EMOJIS = ['🦊', '🐼', '🦁', '🐸', '🦄', '🐯', '🐨', '🐰', '🐱', '🐶'];

  function uuid() {
    return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function readIndex() {
    try {
      var list = JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function writeIndex(list) {
    localStorage.setItem(INDEX_KEY, JSON.stringify(list));
  }

  function getActiveId() {
    try {
      var id = localStorage.getItem(ACTIVE_KEY);
      if (id) return id;
    } catch (e) { /* ignore */ }
    var list = readIndex();
    if (list.length) return list[0].id;
    return null;
  }

  function setActiveId(id) {
    localStorage.setItem(ACTIVE_KEY, id);
    global.dispatchEvent(new CustomEvent('lipa-profile-changed', { detail: { id: id } }));
  }

  function storageKey(suffix) {
    var id = getActiveId();
    if (!id) return STORAGE_SUFFIX[suffix] || suffix;
    return 'lipa_prof_' + id + '_' + (STORAGE_SUFFIX[suffix] || suffix);
  }

  function pickEmoji(used) {
    used = used || [];
    for (var i = 0; i < EMOJIS.length; i++) {
      if (used.indexOf(EMOJIS[i]) < 0) return EMOJIS[i];
    }
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  }

  function migrateLegacy() {
    if (localStorage.getItem(MIGRATED_KEY)) return;
    var list = readIndex();
    if (list.length) {
      localStorage.setItem(MIGRATED_KEY, '1');
      return;
    }

    var id = 'p-default';
    var legacyProfile = null;
    try {
      legacyProfile = JSON.parse(localStorage.getItem('lipa_brain_profile') || 'null');
    } catch (e) { /* ignore */ }

    var name = (legacyProfile && legacyProfile.displayName) || 'Jugador 1';
    list = [{
      id: id,
      name: name,
      emoji: '🧠',
      courseId: legacyProfile && legacyProfile.courseId ? legacyProfile.courseId : null,
      createdAt: new Date().toISOString()
    }];
    writeIndex(list);
    setActiveId(id);

    var pairs = [
      ['profile', 'lipa_brain_profile'],
      ['global', 'lipa_brain_global_v1'],
      ['levels', 'lipa_brain_levels_v1'],
      ['history', 'lipa_brain_history_v1'],
      ['curriculum', 'lipa_curriculum_progress_v1']
    ];
    pairs.forEach(function (pair) {
      var legacy = localStorage.getItem(pair[1]);
      if (legacy) {
        localStorage.setItem(storageKey(pair[0]), legacy);
      }
    });

    if (legacyProfile) {
      legacyProfile.profileId = id;
      legacyProfile.displayName = name;
      localStorage.setItem(storageKey('profile'), JSON.stringify(legacyProfile));
    }

    localStorage.setItem(MIGRATED_KEY, '1');
  }

  function getMeta(id) {
    id = id || getActiveId();
    return readIndex().find(function (p) { return p.id === id; }) || null;
  }

  function listProfiles() {
    return readIndex().slice();
  }

  function createProfile(opts) {
    opts = opts || {};
    var list = readIndex();
    var used = list.map(function (p) { return p.emoji; });
    var id = uuid();
    var entry = {
      id: id,
      name: String(opts.name || 'Hermano/a ' + (list.length + 1)).trim().slice(0, 20) || 'Nuevo',
      emoji: opts.emoji || pickEmoji(used),
      courseId: opts.courseId || null,
      createdAt: new Date().toISOString()
    };
    list.push(entry);
    writeIndex(list);
    setActiveId(id);

    if (opts.courseId && global.LipaBrain && LipaBrain.saveProfile) {
      var band = global.LipaCurriculum ? LipaCurriculum.courseToAgeBand(opts.courseId) : '10-12';
      LipaBrain.saveProfile({
        profileId: id,
        displayName: entry.name,
        courseId: opts.courseId,
        ageBand: band,
        minutes: opts.minutes || 5,
        focus: opts.focus || 'all',
        routineSubjects: opts.routineSubjects || null,
        goal: opts.goal || 'fun'
      });
    }

    return entry;
  }

  function updateProfileMeta(id, patch) {
    var list = readIndex();
    var i = list.findIndex(function (p) { return p.id === id; });
    if (i < 0) return null;
    if (patch.name != null) list[i].name = String(patch.name).trim().slice(0, 20) || list[i].name;
    if (patch.emoji != null) list[i].emoji = patch.emoji;
    if (patch.courseId != null) list[i].courseId = patch.courseId;
    writeIndex(list);

    if (id === getActiveId()) {
      try {
        var key = storageKey('profile');
        var raw = JSON.parse(localStorage.getItem(key) || 'null');
        if (raw) {
          if (patch.name != null) raw.displayName = list[i].name;
          if (patch.courseId != null) raw.courseId = patch.courseId;
          localStorage.setItem(key, JSON.stringify(raw));
        }
      } catch (e) { /* ignore */ }
    }
    return list[i];
  }

  function removeProfile(id) {
    var list = readIndex();
    if (list.length <= 1) return false;
    list = list.filter(function (p) { return p.id !== id; });
    writeIndex(list);
    Object.keys(STORAGE_SUFFIX).forEach(function (suffix) {
      try {
        localStorage.removeItem('lipa_prof_' + id + '_' + STORAGE_SUFFIX[suffix]);
      } catch (e) { /* ignore */ }
    });
    if (getActiveId() === id) setActiveId(list[0].id);
    return true;
  }

  function switchProfile(id) {
    if (!getMeta(id)) return false;
    setActiveId(id);
    var meta = getMeta(id);
    if (meta && global.LipaBrain) {
      var p = LipaBrain.getProfile();
      if (p) {
        p.displayName = meta.name;
        p.profileId = id;
        if (meta.courseId) p.courseId = meta.courseId;
        LipaBrain.saveProfile(p);
      }
    }
    return true;
  }

  function syncActiveNameToProfile() {
    var meta = getMeta();
    if (!meta || !global.LipaBrain) return;
    var p = LipaBrain.getProfile();
    if (!p) return;
    p.displayName = meta.name;
    p.profileId = meta.id;
    LipaBrain.saveProfile(p);
  }

  function init() {
    migrateLegacy();
    var id = getActiveId();
    if (!id) {
      createProfile({ name: 'Jugador 1' });
    }
    syncActiveNameToProfile();
  }

  global.LipaBrainProfiles = {
    init: init,
    storageKey: storageKey,
    listProfiles: listProfiles,
    getActiveId: getActiveId,
    getActiveMeta: function () { return getMeta(getActiveId()); },
    getMeta: getMeta,
    createProfile: createProfile,
    updateProfileMeta: updateProfileMeta,
    removeProfile: removeProfile,
    switchProfile: switchProfile,
    setActiveId: setActiveId,
    EMOJIS: EMOJIS
  };

  init();
})(typeof window !== 'undefined' ? window : global);
