/**
 * Banco de vocabulario ES ↔ EN por niveles Brain
 */
(function (global) {
  'use strict';

  var TIERS = [
    [
      { es: 'hola', en: 'hello' },
      { es: 'adiós', en: 'goodbye' },
      { es: 'sí', en: 'yes' },
      { es: 'no', en: 'no' },
      { es: 'gracias', en: 'thank you' },
      { es: 'por favor', en: 'please' },
      { es: 'casa', en: 'house' },
      { es: 'agua', en: 'water' },
      { es: 'sol', en: 'sun' },
      { es: 'luna', en: 'moon' },
      { es: 'perro', en: 'dog' },
      { es: 'gato', en: 'cat' },
      { es: 'rojo', en: 'red' },
      { es: 'azul', en: 'blue' },
      { es: 'uno', en: 'one' },
      { es: 'dos', en: 'two' },
      { es: 'tres', en: 'three' },
      { es: 'mamá', en: 'mom' },
      { es: 'papá', en: 'dad' },
      { es: 'amigo', en: 'friend' }
    ],
    [
      { es: 'escuela', en: 'school' },
      { es: 'libro', en: 'book' },
      { es: 'lápiz', en: 'pencil' },
      { es: 'mesa', en: 'table' },
      { es: 'silla', en: 'chair' },
      { es: 'puerta', en: 'door' },
      { es: 'ventana', en: 'window' },
      { es: 'ciudad', en: 'city' },
      { es: 'país', en: 'country' },
      { es: 'familia', en: 'family' },
      { es: 'hermano', en: 'brother' },
      { es: 'hermana', en: 'sister' },
      { es: 'comer', en: 'to eat' },
      { es: 'beber', en: 'to drink' },
      { es: 'dormir', en: 'to sleep' },
      { es: 'correr', en: 'to run' },
      { es: 'grande', en: 'big' },
      { es: 'pequeño', en: 'small' },
      { es: 'rápido', en: 'fast' },
      { es: 'lento', en: 'slow' }
    ],
    [
      { es: 'viaje', en: 'trip' },
      { es: 'montaña', en: 'mountain' },
      { es: 'río', en: 'river' },
      { es: 'mar', en: 'sea' },
      { es: 'bosque', en: 'forest' },
      { es: 'cielo', en: 'sky' },
      { es: 'estrella', en: 'star' },
      { es: 'tiempo', en: 'time' },
      { es: 'dinero', en: 'money' },
      { es: 'trabajo', en: 'work' },
      { es: 'pregunta', en: 'question' },
      { es: 'respuesta', en: 'answer' },
      { es: 'importante', en: 'important' },
      { es: 'difícil', en: 'difficult' },
      { es: 'fácil', en: 'easy' },
      { es: 'aprender', en: 'to learn' },
      { es: 'enseñar', en: 'to teach' },
      { es: 'recordar', en: 'to remember' },
      { es: 'olvidar', en: 'to forget' },
      { es: 'entender', en: 'to understand' }
    ],
    [
      { es: 'libertad', en: 'freedom' },
      { es: 'justicia', en: 'justice' },
      { es: 'sociedad', en: 'society' },
      { es: 'cultura', en: 'culture' },
      { es: 'historia', en: 'history' },
      { es: 'ciencia', en: 'science' },
      { es: 'tecnología', en: 'technology' },
      { es: 'medio ambiente', en: 'environment' },
      { es: 'oportunidad', en: 'opportunity' },
      { es: 'experiencia', en: 'experience' },
      { es: 'consecuencia', en: 'consequence' },
      { es: 'desarrollo', en: 'development' },
      { es: 'comunicación', en: 'communication' },
      { es: 'imaginación', en: 'imagination' },
      { es: 'curiosidad', en: 'curiosity' },
      { es: 'responsabilidad', en: 'responsibility' },
      { es: 'independencia', en: 'independence' },
      { es: 'conocimiento', en: 'knowledge' },
      { es: 'creatividad', en: 'creativity' },
      { es: 'perseverancia', en: 'perseverance' }
    ]
  ];

  function tierForLevel(level) {
    level = level || 1;
    if (level <= 3) return 0;
    if (level <= 6) return 1;
    if (level <= 9) return 2;
    return 3;
  }

  function getPool(level, maxTier) {
    maxTier = maxTier != null ? maxTier : tierForLevel(level);
    var pool = [];
    for (var t = 0; t <= maxTier && t < TIERS.length; t++) {
      pool = pool.concat(TIERS[t]);
    }
    return pool;
  }

  function pickWord(pool, exclude) {
    exclude = exclude || {};
    if (!pool || !pool.length) return { es: 'hola', en: 'hello' };
    var available = pool.filter(function (w) {
      return !exclude[w.es + '|' + w.en];
    });
    if (!available.length) available = pool.slice();
    return available[Math.floor(Math.random() * available.length)];
  }

  function buildDeck(pool, recentKeys) {
    if (!pool || !pool.length) return [];
    recentKeys = recentKeys || [];
    var fresh = pool.filter(function (w) {
      return recentKeys.indexOf(w.es + '|' + w.en) < 0;
    });
    var src = fresh.length >= 4 ? fresh : pool.slice();
    var deck = src.slice();
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = deck[i];
      deck[i] = deck[j];
      deck[j] = t;
    }
    return deck;
  }

  global.LipaVocabBank = {
    TIERS: TIERS,
    tierForLevel: tierForLevel,
    getPool: getPool,
    pickWord: pickWord,
    buildDeck: buildDeck
  };
})(typeof window !== 'undefined' ? window : global);
