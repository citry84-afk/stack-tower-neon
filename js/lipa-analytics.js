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
    'palabras-start': 'neon-palabras',
    'fracciones-start': 'neon-fracciones',
    'clasifica-start': 'neon-clasifica',
    'dictado-start': 'neon-dictado',
    'empareja-start': 'neon-empareja',
    'arrastra-start': 'neon-arrastra',
    'ordenar-start': 'neon-ordenar',
    'mayor-start': 'neon-mayor-menor',
    'peques-start': 'neon-peques',
    'lengua-start': 'neon-lengua',
    'naturales-start': 'neon-naturales',
    'sociales-start': 'neon-sociales'
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
    'neon-fracciones': 'Neon Fracciones',
    'neon-clasifica': 'Neon Clasifica',
    'neon-dictado': 'Neon Dictado',
    'neon-empareja': 'Neon Empareja',
    'neon-arrastra': 'Neon Arrastra',
    'neon-ordenar': 'Neon Ordenar',
    'neon-mayor-menor': 'Mayor o menor',
    'neon-peques': 'Neon Peques',
    'neon-lengua': 'Neon Lengua',
    'neon-lectura': 'Neon Lectura',
    'neon-frase': 'Neon Frase',
    'neon-palabra': 'Neon Palabra',
    'neon-silabas': 'Neon Sílabas',
    'neon-naturales': 'Neon Naturales',
    'neon-vida': 'Neon Vida',
    'neon-cuerpo': 'Neon Cuerpo',
    'neon-planeta': 'Neon Planeta',
    'neon-sociales': 'Neon Sociales',
    'neon-mapa': 'Neon Mapa',
    'neon-entorno': 'Neon Entorno',
    'neon-historia': 'Neon Historia',
    'gym-cerebro-hub': 'Brain Gym'
  };

  function gtagEvent(name, params) {
    if (typeof global.gtag !== 'function') return;
    var p = params || {};
    p.page_path = p.page_path || (global.location && global.location.pathname) || '';
    global.gtag('event', name, p);
  }

  function gameIdFromButton(btnId) {
    var mapped = START_BUTTONS[btnId];
    if (mapped) return refineGameId(mapped);
    return null;
  }

  function refineGameId(gameId) {
    var path = (global.location && global.location.pathname) || '';
    if (gameId === 'neon-lengua') {
      if (/neon-frase/.test(path)) return 'neon-frase';
      if (/neon-silabas/.test(path)) return 'neon-silabas';
      if (/neon-palabra/.test(path)) return 'neon-palabra';
      if (/neon-lectura/.test(path)) return 'neon-lectura';
    }
    if (gameId === 'neon-naturales') {
      if (/neon-vida/.test(path)) return 'neon-vida';
      if (/neon-cuerpo/.test(path)) return 'neon-cuerpo';
      if (/neon-planeta/.test(path)) return 'neon-planeta';
    }
    if (gameId === 'neon-sociales') {
      if (/neon-mapa/.test(path)) return 'neon-mapa';
      if (/neon-entorno/.test(path)) return 'neon-entorno';
      if (/neon-historia/.test(path)) return 'neon-historia';
    }
    if (gameId === 'neon-peques') {
      if (/neon-colores/.test(path)) return 'neon-colores';
      if (/neon-numeros/.test(path)) return 'neon-numeros';
    }
    return gameId;
  }

  function trackGameStart(gameId) {
    gameId = refineGameId(gameId);
    gtagEvent('lipa_game_start', {
      game_id: gameId,
      game_name: GAME_LABELS[gameId] || gameId
    });
  }

  function trackGameComplete(gameId, payload) {
    gameId = refineGameId(gameId);
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

  function trackPageViews() {
    var path = (global.location && global.location.pathname) || '';
    if (/recreo-neon\.html$/.test(path)) trackArcadeView();
    if (/cursos\.html$/.test(path)) {
      gtagEvent('lipa_curriculum_view', { page_type: 'catalog' });
    }
    if (/curso\.html$/.test(path)) {
      gtagEvent('lipa_curriculum_view', { page_type: 'course' });
    }
    if (/materia\.html$/.test(path)) {
      gtagEvent('lipa_curriculum_view', { page_type: 'subject' });
    }
    if (/unidad\.html$/.test(path)) {
      gtagEvent('lipa_curriculum_view', { page_type: 'unit' });
    }
    if (/gym-cerebro\.html$/.test(path)) {
      gtagEvent('lipa_brain_hub_view', { hub: 'gym-cerebro' });
    }
    if (/para-padres\.html$/.test(path)) {
      gtagEvent('lipa_parents_view', {});
    }
    if (/entrenador-cerebro\.html$/.test(path)) {
      gtagEvent('lipa_brain_hub_view', { hub: 'entrenador' });
    }
  }

  function bindStartButtons() {
    global.document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if (!btn || !btn.id) return;
      var gameId = gameIdFromButton(btn.id);
      if (gameId) trackGameStart(gameId);
    });
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
      trackPageViews();
    });
  } else {
    bindStartButtons();
    trackPageViews();
  }
})(typeof window !== 'undefined' ? window : this);
