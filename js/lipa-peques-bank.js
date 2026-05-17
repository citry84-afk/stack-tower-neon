/**
 * Banco Infantil (3–5 años) — pictogramas, colores y conteo
 */
(function (global) {
  'use strict';

  var TIERS = [
    {
      label: '3 años',
      elige: [
        { emoji: '🐶', name: 'Perro', choices: ['Perro', 'Casa', 'Sol'], answer: 0 },
        { emoji: '🐱', name: 'Gato', choices: ['Gato', 'Coche', 'Lluvia'], answer: 0 },
        { emoji: '☀️', name: 'Sol', choices: ['Sol', 'Zapato', 'Mesa'], answer: 0 },
        { emoji: '🍎', name: 'Manzana', choices: ['Manzana', 'Silla', 'Luna'], answer: 0 },
        { emoji: '🚗', name: 'Coche', choices: ['Coche', 'Pez', 'Flor'], answer: 0 }
      ],
      colores: [
        { emoji: '🍎', name: 'manzana', answer: 0, labels: ['Rojo', 'Azul', 'Verde'] },
        { emoji: '🌿', name: 'hoja', answer: 2, labels: ['Rojo', 'Azul', 'Verde'] },
        { emoji: '🫐', name: 'arándano', answer: 1, labels: ['Rojo', 'Azul', 'Verde'] },
        { emoji: '🍋', name: 'limón', answer: 2, labels: ['Rojo', 'Azul', 'Amarillo'] },
        { emoji: '🌞', name: 'sol', answer: 2, labels: ['Rosa', 'Marrón', 'Amarillo'] }
      ],
      cuenta: [
        { emoji: '⭐', count: 1, choices: [1, 2, 3], answer: 0 },
        { emoji: '🐸', count: 2, choices: [1, 2, 4], answer: 1 },
        { emoji: '🎈', count: 3, choices: [2, 3, 5], answer: 1 },
        { emoji: '🍪', count: 2, choices: [1, 2, 3], answer: 1 }
      ]
    },
    {
      label: '4 años',
      elige: [
        { emoji: '🦋', name: 'Mariposa', choices: ['Mariposa', 'Mesa', 'Pan'], answer: 0 },
        { emoji: '🏠', name: 'Casa', choices: ['Casa', 'Pez', 'Zapato'], answer: 0 },
        { emoji: '🌧️', name: 'Lluvia', choices: ['Lluvia', 'Gato', 'Pelota'], answer: 0 },
        { emoji: '👩', name: 'Mamá', choices: ['Mamá', 'Coche', 'Árbol'], answer: 0 }
      ],
      colores: [
        { emoji: '🟦', name: 'cielo', answer: 1, labels: ['Rojo', 'Azul', 'Verde'] },
        { emoji: '🌹', name: 'rosa', answer: 0, labels: ['Rojo', 'Azul', 'Verde'] },
        { emoji: '🎃', name: 'calabaza', answer: 2, labels: ['Azul', 'Rosa', 'Naranja'] }
      ],
      cuenta: [
        { emoji: '🐞', count: 3, choices: [2, 3, 4], answer: 1 },
        { emoji: '🌸', count: 4, choices: [3, 4, 5], answer: 1 },
        { emoji: '🐠', count: 3, choices: [1, 3, 5], answer: 1 }
      ]
    },
    {
      label: '5 años',
      elige: [
        { emoji: '🏫', name: 'Colegio', choices: ['Colegio', 'Helado', 'Luna'], answer: 0 },
        { emoji: '🧸', name: 'Osito', choices: ['Osito', 'Agua', 'Árbol'], answer: 0 },
        { emoji: '🌙', name: 'Luna', choices: ['Luna', 'Pan', 'Coche'], answer: 0 },
        { emoji: '⚽', name: 'Pelota', choices: ['Pelota', 'Silla', 'Pez'], answer: 0 }
      ],
      colores: [
        { emoji: '🍊', name: 'naranja', answer: 2, labels: ['Verde', 'Azul', 'Naranja'] },
        { emoji: '🍇', name: 'uvas', answer: 1, labels: ['Rojo', 'Morado', 'Amarillo'] },
        { emoji: '🌳', name: 'árbol', answer: 0, labels: ['Verde', 'Rosa', 'Gris'] }
      ],
      cuenta: [
        { emoji: '🐚', count: 4, choices: [3, 4, 5], answer: 1 },
        { emoji: '🍓', count: 5, choices: [4, 5, 6], answer: 1 },
        { emoji: '🚗', count: 4, choices: [2, 4, 5], answer: 1 }
      ]
    }
  ];

  function tierIndex(brainLevel) {
    var lv = parseInt(brainLevel, 10) || 1;
    if (lv <= 2) return 0;
    if (lv <= 4) return 1;
    return 2;
  }

  function getTier(brainLevel) {
    return TIERS[tierIndex(brainLevel)] || TIERS[0];
  }

  function pickRandom(pool, excludeKey) {
    if (!pool || !pool.length) return pool[0];
    var tries = 0;
    while (tries < 25) {
      var item = pool[Math.floor(Math.random() * pool.length)];
      var key = item.name || String(item.count) + item.emoji;
      if (!excludeKey || key !== excludeKey) return item;
      tries++;
    }
    return pool[0];
  }

  function buildEligeRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.elige, lastKey);
    return {
      key: item.name,
      emoji: item.emoji,
      question: '¿Qué es?',
      choices: item.choices.slice(),
      answer: item.answer
    };
  }

  function buildColorRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.colores, lastKey);
    return {
      key: item.name,
      emoji: item.emoji,
      question: '¿De qué color es?',
      labels: item.labels.slice(),
      answer: item.answer
    };
  }

  function buildCuentaRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.cuenta, lastKey);
    var key = String(item.count) + item.emoji;
    var icons = '';
    for (var i = 0; i < item.count; i++) icons += item.emoji;
    return {
      key: key,
      icons: icons,
      question: '¿Cuántos hay?',
      choices: item.choices.slice(),
      answer: item.answer
    };
  }

  global.LipaPequesBank = {
    TIERS: TIERS,
    getTier: getTier,
    buildEligeRound: buildEligeRound,
    buildColorRound: buildColorRound,
    buildCuentaRound: buildCuentaRound
  };
})(typeof window !== 'undefined' ? window : global);
