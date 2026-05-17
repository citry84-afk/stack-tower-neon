/**
 * GA4 events for LIPA arcade — game starts, completes, hub views.
 */
(function (global) {
  'use strict';

  var GA_ID = 'G-5XL1W8RNTP';

  var START_BUTTONS = {
    'flash-start': 'flash-tap',
    'aim-start': 'aim-trainer',
    'esquiva-start': 'esquiva-neon',
    'grid-start': 'grid-reflex',
    'btn-test-start': 'reaction-test',
    'reaction-start': 'reaction-test',
    'calc-start': 'neon-calculo',
    'tablas-start': 'tablas-relampago',
    'palabras-start': 'neon-palabras'
  };

  var GAME_LABELS = {
    'reaction-test': 'Test reflejos',
    'aim-trainer': 'Aim Trainer',
    'grid-reflex': 'Grid 4×4',
    'stack-tower': 'Stack Tower',
    'flash-tap': 'Flash Tap',
    'esquiva-neon': 'Neon Esquiva',
    'neon-calculo': 'Neon Cálculo',
    'tablas-relampago': 'Tablas Relámpago',
    'neon-palabras': 'Neon Palabras',
    'gym-cerebro-hub': 'Brain Gym'
  };

  function gtagEvent(name, params) {
    if (typeof global.gtag !== 'function') return;
    var p = params || {};
    p.page_path = p.page_path || (global.location && global.location.pathname) || '';
    global.gtag('event', name, p);
  }

  function trackGameStart(gameId) {
    gtagEvent('lipa_game_start', {
      game_id: gameId,
      game_name: GAME_LABELS[gameId] || gameId
    });
  }

  function trackGameComplete(gameId, payload) {
    payload = payload || {};
    gtagEvent('lipa_game_complete', {
      game_id: gameId,
      game_name: GAME_LABELS[gameId] || gameId,
      score: payload.score != null ? payload.score : undefined,
      value: payload.score != null ? payload.score : 0
    });
  }

  function trackArcadeView() {
    gtagEvent('lipa_arcade_view', { page_title: 'Arcade LIPA' });
  }

  function bindStartButtons() {
    global.document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if (!btn || !btn.id) return;
      var gameId = START_BUTTONS[btn.id];
      if (gameId) trackGameStart(gameId);
    });
  }

  function initHubPage() {
    var path = global.location && global.location.pathname;
    if (path && /jugar\.html$/.test(path)) trackArcadeView();
  }

  global.LipaAnalytics = {
    trackGameStart: trackGameStart,
    trackGameComplete: trackGameComplete,
    trackArcadeView: trackArcadeView,
    GA_ID: GA_ID
  };

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', function () {
      bindStartButtons();
      initHubPage();
    });
  } else {
    bindStartButtons();
    initHubPage();
  }
})(typeof window !== 'undefined' ? window : this);
