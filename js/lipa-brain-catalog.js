/**
 * Catálogo de actividades Brain Gym — pilares, edades, niveles
 */
(function (global) {
  'use strict';

  var GAMES = {
    'neon-calculo': {
      id: 'neon-calculo',
      name: 'Neon Cálculo',
      short: 'Cálculo',
      emoji: '➕',
      url: '/neon-calculo.html',
      pillar: 'math',
      cat: 'math',
      desc: 'Suma y resta rápida',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-ordenar': {
      id: 'neon-ordenar',
      name: 'Neon Ordenar',
      short: 'Ordenar',
      emoji: '🔢',
      url: '/neon-ordenar.html',
      pillar: 'math',
      cat: 'math',
      desc: 'Ordena números de menor a mayor',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-clasifica': {
      id: 'neon-clasifica',
      name: 'Neon Clasifica',
      short: 'Clasifica',
      emoji: '🧩',
      url: '/neon-clasifica.html',
      pillar: 'math',
      cat: 'math',
      desc: 'Agrupa figuras, seres vivos y emociones',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 5
    },
    'neon-fracciones': {
      id: 'neon-fracciones',
      name: 'Neon Fracciones',
      short: 'Fracciones',
      emoji: '🍕',
      url: '/neon-fracciones.html',
      pillar: 'math',
      cat: 'math',
      desc: 'Medios, tercios y cuartos con barra visual',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 8
    },
    'neon-mayor-menor': {
      id: 'neon-mayor-menor',
      name: 'Mayor o menor',
      short: 'Comparar',
      emoji: '⚖️',
      url: '/neon-mayor-menor.html',
      pillar: 'math',
      cat: 'math',
      desc: 'Elige el número mayor o menor',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'tablas-relampago': {
      id: 'tablas-relampago',
      name: 'Tablas Relámpago',
      short: 'Tablas',
      emoji: '✖️',
      url: '/tablas-relampago.html',
      pillar: 'math',
      cat: 'math',
      desc: 'Multiplicar al instante',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'reaction-test': {
      id: 'reaction-test',
      name: 'Test reflejos',
      short: 'Test',
      emoji: '⚡',
      url: '/test-reflejos.html',
      pillar: 'reflex',
      cat: 'reflex',
      desc: 'Tiempo de reacción (ms)',
      higherIsBetter: false,
      metricLabel: 'ms',
      ageMin: 6
    },
    'aim-trainer': {
      id: 'aim-trainer',
      name: 'Aim Trainer',
      short: 'Aim',
      emoji: '🎯',
      url: '/aim-trainer-neon.html',
      pillar: 'reflex',
      cat: 'reflex',
      desc: 'Precisión estilo FPS',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 10
    },
    'grid-reflex': {
      id: 'grid-reflex',
      name: 'Grid 4×4',
      short: 'Grid',
      emoji: '🔲',
      url: '/grid-reflejos-neon.html',
      pillar: 'reflex',
      cat: 'reflex',
      desc: 'Reflejos bajo presión',
      higherIsBetter: true,
      metricLabel: 'aciertos',
      ageMin: 6
    },
    'flash-tap': {
      id: 'flash-tap',
      name: 'Flash Tap',
      short: 'Flash',
      emoji: '👆',
      url: '/toque-flash-neon.html',
      pillar: 'reflex',
      cat: 'reflex',
      desc: 'Atención visual',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'stack-tower': {
      id: 'stack-tower',
      name: 'Stack Tower',
      short: 'Stack',
      emoji: '🎮',
      url: '/stack-tower.html',
      pillar: 'reflex',
      cat: 'reflex',
      desc: 'Timing y precisión',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 8
    },
    'esquiva-neon': {
      id: 'esquiva-neon',
      name: 'Neon Esquiva',
      short: 'Esquiva',
      emoji: '🔀',
      url: '/esquiva-neon.html',
      pillar: 'reflex',
      cat: 'reflex',
      desc: 'Coordinación rápida',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 8
    },
    'neon-palabras': {
      id: 'neon-palabras',
      name: 'Neon Palabras',
      short: 'Palabras',
      emoji: '🗣️',
      url: '/neon-palabras.html',
      pillar: 'language',
      cat: 'language',
      desc: 'Vocabulario ES ↔ EN',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-silabas': {
      id: 'neon-silabas',
      name: 'Neon Sílabas',
      short: 'Sílabas',
      emoji: '📖',
      url: '/neon-silabas.html',
      pillar: 'language-es',
      cat: 'lengua',
      desc: 'Ordena sílabas y forma palabras',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-palabra': {
      id: 'neon-palabra',
      name: 'Neon Palabra',
      short: 'Palabra',
      emoji: '✏️',
      url: '/neon-palabra.html',
      pillar: 'language-es',
      cat: 'lengua',
      desc: 'Completa la sílaba que falta',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-lectura': {
      id: 'neon-lectura',
      name: 'Neon Lectura',
      short: 'Lectura',
      emoji: '📕',
      url: '/neon-lectura.html',
      pillar: 'language-es',
      cat: 'lengua',
      desc: 'Comprensión lectora corta',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-frase': {
      id: 'neon-frase',
      name: 'Neon Frase',
      short: 'Frase',
      emoji: '📝',
      url: '/neon-frase.html',
      pillar: 'language-es',
      cat: 'lengua',
      desc: 'Ordena palabras en la frase',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-vida': {
      id: 'neon-vida',
      name: 'Neon Vida',
      short: 'Vida',
      emoji: '🌿',
      url: '/neon-vida.html',
      pillar: 'science',
      cat: 'naturales',
      desc: 'Clasifica seres vivos',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-cuerpo': {
      id: 'neon-cuerpo',
      name: 'Neon Cuerpo',
      short: 'Cuerpo',
      emoji: '🫀',
      url: '/neon-cuerpo.html',
      pillar: 'science',
      cat: 'naturales',
      desc: 'Cuerpo, sentidos y salud',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-planeta': {
      id: 'neon-planeta',
      name: 'Neon Planeta',
      short: 'Planeta',
      emoji: '🌍',
      url: '/neon-planeta.html',
      pillar: 'science',
      cat: 'naturales',
      desc: 'Verdadero o falso científico',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-entorno': {
      id: 'neon-entorno',
      name: 'Neon Entorno',
      short: 'Entorno',
      emoji: '🏠',
      url: '/neon-entorno.html',
      pillar: 'social',
      cat: 'sociales',
      desc: 'Familia, cole y convivencia',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-mapa': {
      id: 'neon-mapa',
      name: 'Neon Mapa',
      short: 'Mapa',
      emoji: '🗺️',
      url: '/neon-mapa.html',
      pillar: 'social',
      cat: 'sociales',
      desc: 'Mapas y lugares',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-historia': {
      id: 'neon-historia',
      name: 'Neon Historia',
      short: 'Historia',
      emoji: '🏛️',
      url: '/neon-historia.html',
      pillar: 'social',
      cat: 'sociales',
      desc: 'Ordena frases de historia',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 6
    },
    'neon-peques': {
      id: 'neon-peques',
      name: 'Neon Peques',
      short: 'Peques',
      emoji: '🐣',
      url: '/neon-peques.html',
      pillar: 'infantil',
      cat: 'peques',
      desc: 'Vocabulario visual para 3–5 años',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 3
    },
    'neon-colores': {
      id: 'neon-colores',
      name: 'Neon Colores',
      short: 'Colores',
      emoji: '🎨',
      url: '/neon-colores.html',
      pillar: 'infantil',
      cat: 'peques',
      desc: 'Aprende colores con pictogramas',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 3
    },
    'neon-numeros': {
      id: 'neon-numeros',
      name: 'Neon Números',
      short: 'Números',
      emoji: '🔢',
      url: '/neon-numeros.html',
      pillar: 'infantil',
      cat: 'peques',
      desc: 'Contar del 1 al 5',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 3
    },
    'neon-dictado': {
      id: 'neon-dictado',
      name: 'Neon Dictado',
      short: 'Dictado',
      emoji: '🔊',
      url: '/neon-dictado.html',
      pillar: 'language',
      cat: 'lengua',
      desc: 'Escucha y elige la palabra',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 3
    },
    'neon-empareja': {
      id: 'neon-empareja',
      name: 'Neon Empareja',
      short: 'Empareja',
      emoji: '🧩',
      url: '/neon-empareja.html',
      pillar: 'infantil',
      cat: 'peques',
      desc: 'Une dibujo y palabra',
      higherIsBetter: true,
      metricLabel: 'pts',
      ageMin: 3
    }
  };

  var AGE_POOLS = {
    '3-5': { math: [], reflex: ['flash-tap'], language: [] },
    '6-9': {
      math: ['neon-calculo', 'tablas-relampago'],
      reflex: ['reaction-test', 'flash-tap', 'grid-reflex'],
      language: ['neon-palabras']
    },
    '10-12': {
      math: ['neon-calculo', 'tablas-relampago'],
      reflex: ['reaction-test', 'flash-tap', 'grid-reflex', 'stack-tower'],
      language: ['neon-palabras']
    },
    '13-17': {
      math: ['neon-calculo', 'tablas-relampago'],
      reflex: ['reaction-test', 'aim-trainer', 'flash-tap', 'grid-reflex', 'stack-tower'],
      language: ['neon-palabras']
    },
    '18+': {
      math: ['neon-calculo', 'tablas-relampago'],
      reflex: ['reaction-test', 'aim-trainer', 'flash-tap', 'grid-reflex', 'stack-tower', 'esquiva-neon'],
      language: ['neon-palabras']
    }
  };

  var AGE_BAND_ALIAS = {
    '6-9': '6-9',
    '10-12': '10-12',
    '13-17': '13-17',
    '18+': '18+'
  };

  /** Nivel 1–12 → parámetros Neon Cálculo */
  var CALC_LEVELS = [
    { max: 8, mul: false },
    { max: 10, mul: false },
    { max: 12, mul: false },
    { max: 15, mul: false },
    { max: 20, mul: false },
    { max: 25, mul: false },
    { max: 30, mul: false },
    { max: 40, mul: true, mulMax: 5 },
    { max: 50, mul: true, mulMax: 6 },
    { max: 60, mul: true, mulMax: 8 },
    { max: 70, mul: true, mulMax: 9 },
    { max: 99, mul: true, mulMax: 12 }
  ];

  /** Nivel 1–12 → rango tablas */
  var TABLAS_LEVELS = [
    { min: 2, max: 5 },
    { min: 2, max: 5 },
    { min: 2, max: 6 },
    { min: 2, max: 6 },
    { min: 2, max: 7 },
    { min: 2, max: 8 },
    { min: 2, max: 9 },
    { min: 2, max: 10 },
    { min: 2, max: 11 },
    { min: 2, max: 12 },
    { min: 2, max: 12 },
    { min: 2, max: 12 }
  ];

  var RANKS = [
    { id: 'bronze', name: 'Bronce', emoji: '🥉', minXp: 0 },
    { id: 'silver', name: 'Plata', emoji: '🥈', minXp: 120 },
    { id: 'gold', name: 'Oro', emoji: '🥇', minXp: 350 },
    { id: 'neon', name: 'Neon', emoji: '⭐', minXp: 700 }
  ];

  var ACHIEVEMENTS = [
    { id: 'first_session', title: 'Primer entreno', desc: 'Completaste tu primera actividad', check: function (s) { return s.totalSessions >= 1; } },
    { id: 'streak_3', title: 'Racha 3 días', desc: 'Tres días seguidos entrenando', check: function (s) { return s.streak >= 3; } },
    { id: 'streak_7', title: 'Racha 7 días', desc: 'Una semana de constancia', check: function (s) { return s.streak >= 7; } },
    { id: 'sessions_10', title: '10 sesiones', desc: 'Diez entrenamientos registrados', check: function (s) { return s.totalSessions >= 10; } },
    { id: 'math_master', title: 'Mente matemática', desc: '50 aciertos en mates', check: function (s) { return s.mathCorrect >= 50; } },
    { id: 'reflex_fast', title: 'Reflejos de neon', desc: 'Media de reacción bajo 280 ms', check: function (s) { return s.bestReactionMs && s.bestReactionMs <= 280; } },
    { id: 'wordsmith', title: 'Políglota neon', desc: '30 aciertos de vocabulario', check: function (s) { return s.langCorrect >= 30; } },
    { id: 'lector_neon', title: 'Lector neon', desc: '40 aciertos en lenguaje', check: function (s) { return (s.lenguaCorrect || 0) >= 40; } },
    { id: 'cientifico_neon', title: 'Científico neon', desc: '35 aciertos en naturales', check: function (s) { return (s.naturalesCorrect || 0) >= 35; } },
    { id: 'explorador_neon', title: 'Explorador neon', desc: '35 aciertos en sociales', check: function (s) { return (s.socialesCorrect || 0) >= 35; } },
    { id: 'peques_neon', title: 'Estrella peques', desc: '25 aciertos en Infantil', check: function (s) { return (s.pequesCorrect || 0) >= 25; } }
  ];

  global.LipaBrainCatalog = {
    GAMES: GAMES,
    AGE_POOLS: AGE_POOLS,
    AGE_BAND_ALIAS: AGE_BAND_ALIAS,
    CALC_LEVELS: CALC_LEVELS,
    TABLAS_LEVELS: TABLAS_LEVELS,
    RANKS: RANKS,
    ACHIEVEMENTS: ACHIEVEMENTS
  };
})(typeof window !== 'undefined' ? window : global);
