/**
 * Banco Sociales — preguntas y ordenar eventos (1º–3º Primaria)
 */
(function (global) {
  'use strict';

  var TIERS = [
    {
      label: '1º Primaria',
      quiz: [
        {
          text: 'En el colegio aprendemos y compartimos con compañeros.',
          question: '¿Para qué vamos al cole?',
          choices: ['Para aprender', 'Para dormir todo el día'],
          answer: 0
        },
        {
          text: 'La familia nos cuida y nos quiere.',
          question: '¿Quién forma parte de la familia?',
          choices: ['Mamá, papá o abuelos', 'Solo los coches'],
          answer: 0
        },
        {
          text: 'En el parque jugamos y respetamos las normas.',
          question: '¿Qué hacemos en el parque?',
          choices: ['Jugar y respetar', 'Romper los columpios'],
          answer: 0
        },
        {
          text: 'La bandera de España tiene rojo y amarillo.',
          question: '¿Qué colores tiene la bandera de España?',
          choices: ['Rojo y amarillo', 'Solo verde'],
          answer: 0
        },
        {
          text: 'El carnaval es una fiesta donde mucha gente se disfraza.',
          question: '¿Qué es el carnaval?',
          choices: ['Una fiesta con disfraces', 'Un tipo de árbol'],
          answer: 0
        }
      ],
      mapa: [
        {
          text: 'Madrid es la capital de España.',
          question: '¿Cuál es la capital de España?',
          choices: ['Madrid', 'Barcelona', 'Valencia'],
          answer: 0
        },
        {
          text: 'En el mapa el norte suele estar arriba.',
          question: '¿Dónde está el norte en un mapa?',
          choices: ['Arriba', 'Abajo'],
          answer: 0
        },
        {
          text: 'El barrio es la zona donde vivimos cerca del cole.',
          question: '¿Qué es el barrio?',
          choices: ['La zona donde vivimos', 'Un planeta lejano'],
          answer: 0
        }
      ],
      ordena: [
        { words: ['Me', 'levanto.', 'Desayuno.', 'Voy', 'al', 'cole.'], key: 'mañana' },
        { words: ['Es', 'invierno.', 'Hace', 'frío.', 'Abrigo', 'bufanda.'], key: 'invierno' },
        { words: ['Sembramos', 'semillas.', 'Regamos.', 'Crecen', 'plantas.'], key: 'huerto' }
      ]
    },
    {
      label: '2º Primaria',
      quiz: [
        {
          text: 'Las normas de convivencia ayudan a respetarnos en clase.',
          question: '¿Para qué sirven las normas?',
          choices: ['Para convivir bien', 'Para no hablar nunca'],
          answer: 0
        },
        {
          text: 'Un ayuntamiento gobierna un municipio.',
          question: '¿Quién gobierna tu pueblo o ciudad?',
          choices: ['El ayuntamiento', 'Los superhéroes'],
          answer: 0
        }
      ],
      mapa: [
        {
          text: 'España está en el continente de Europa.',
          question: '¿En qué continente está España?',
          choices: ['Europa', 'África', 'Oceanía'],
          answer: 0
        },
        {
          text: 'El río lleva agua de la montaña al mar.',
          question: '¿Hacia dónde va un río?',
          choices: ['Hacia el mar', 'Hacia el cielo'],
          answer: 0
        }
      ],
      ordena: [
        { words: ['Los', 'fenicios', 'comerciaban', 'por', 'mar.'], key: 'fenicios' },
        { words: ['Hace', 'años', 'no', 'había', 'móviles.'], key: 'tecnologia' }
      ]
    },
    {
      label: '3º Primaria',
      quiz: [
        {
          text: 'La Constitución española es la ley más importante del país.',
          question: '¿Qué es la Constitución?',
          choices: ['La ley principal', 'Un cuento de piratas'],
          answer: 0
        },
        {
          text: 'La Edad Media fue un periodo histórico largo en Europa.',
          question: '¿Qué fue la Edad Media?',
          choices: ['Un periodo de la historia', 'Un deporte nuevo'],
          answer: 0
        }
      ],
      mapa: [
        {
          text: 'La península Ibérica es donde están España y Portugal.',
          question: '¿Dónde está la península Ibérica?',
          choices: ['En el suroeste de Europa', 'En la Luna'],
          answer: 0
        }
      ],
      ordena: [
        { words: ['Los', 'romanos', 'construyeron', 'acueductos.'], key: 'romanos' },
        { words: ['Primero', 'explorar.', 'Después', 'colonizar.', 'Al', 'final', 'independencia.'], key: 'colonias' }
      ]
    }
  ];

  function tierIndex(brainLevel) {
    var lv = parseInt(brainLevel, 10) || 1;
    if (lv <= 3) return 0;
    if (lv <= 7) return 1;
    return 2;
  }

  function getTier(brainLevel) {
    return TIERS[tierIndex(brainLevel)] || TIERS[0];
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function pickRandom(pool, excludeKey) {
    if (!pool || !pool.length) return pool[0];
    var tries = 0;
    while (tries < 30) {
      var item = pool[Math.floor(Math.random() * pool.length)];
      var key = item.text || item.key || (item.words && item.words.join(' '));
      if (!excludeKey || key !== excludeKey) return item;
      tries++;
    }
    return pool[0];
  }

  function buildQuizRound(brainLevel, lastKey, poolName) {
    var tier = getTier(brainLevel);
    var pool = poolName === 'mapa' ? tier.mapa : tier.quiz;
    var item = pickRandom(pool, lastKey);
    return {
      key: item.text,
      text: item.text,
      question: item.question,
      choices: item.choices.slice(),
      answer: item.answer
    };
  }

  function buildOrdenaRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.ordena, lastKey);
    var key = item.key || item.words.join(' ');
    return {
      key: key,
      words: item.words.slice(),
      shuffled: shuffle(item.words)
    };
  }

  global.LipaSocialesBank = {
    TIERS: TIERS,
    getTier: getTier,
    shuffle: shuffle,
    buildQuizRound: buildQuizRound,
    buildOrdenaRound: buildOrdenaRound
  };
})(typeof window !== 'undefined' ? window : global);
