/**
 * Banco de contenidos Lenguaje — sílabas, palabras y lectura (1º–3º Primaria)
 */
(function (global) {
  'use strict';

  var TIERS = [
    {
      label: '1º Primaria',
      syllableWords: [
        { word: 'GATO', syllables: ['GA', 'TO'], emoji: '🐱' },
        { word: 'SOL', syllables: ['SOL'], emoji: '☀️' },
        { word: 'PATO', syllables: ['PA', 'TO'], emoji: '🦆' },
        { word: 'MESA', syllables: ['ME', 'SA'], emoji: '🪑' },
        { word: 'LUNA', syllables: ['LU', 'NA'], emoji: '🌙' },
        { word: 'SALA', syllables: ['SA', 'LA'], emoji: '🛋️' },
        { word: 'MOTO', syllables: ['MO', 'TO'], emoji: '🏍️' },
        { word: 'PELO', syllables: ['PE', 'LO'], emoji: '💇' },
        { word: 'BOLA', syllables: ['BO', 'LA'], emoji: '⚽' },
        { word: 'RANA', syllables: ['RA', 'NA'], emoji: '🐸' },
        { word: 'MAMÁ', syllables: ['MA', 'MÁ'], emoji: '👩' },
        { word: 'PAPÁ', syllables: ['PA', 'PÁ'], emoji: '👨' },
        { word: 'CAMA', syllables: ['CA', 'MA'], emoji: '🛏️' },
        { word: 'VASO', syllables: ['VA', 'SO'], emoji: '🥤' },
        { word: 'FOCA', syllables: ['FO', 'CA'], emoji: '🦭' },
        { word: 'NUBE', syllables: ['NU', 'BE'], emoji: '☁️' },
        { word: 'ROSA', syllables: ['RO', 'SA'], emoji: '🌹' },
        { word: 'TREN', syllables: ['TREN'], emoji: '🚂' },
        { word: 'PIES', syllables: ['PIES'], emoji: '🦶' },
        { word: 'LORO', syllables: ['LO', 'RO'], emoji: '🦜' }
      ],
      fillWords: [
        { word: 'GATO', parts: ['GA', 'TO'], missing: 1, options: ['TO', 'TA', 'TE', 'TI'] },
        { word: 'MESA', parts: ['ME', 'SA'], missing: 0, options: ['ME', 'MA', 'MI', 'MO'] },
        { word: 'LUNA', parts: ['LU', 'NA'], missing: 1, options: ['NA', 'NE', 'NI', 'NO'] },
        { word: 'PATO', parts: ['PA', 'TO'], missing: 0, options: ['PA', 'PE', 'PI', 'PO'] },
        { word: 'BOLA', parts: ['BO', 'LA'], missing: 1, options: ['LA', 'LE', 'LI', 'LO'] },
        { word: 'RANA', parts: ['RA', 'NA'], missing: 0, options: ['RA', 'RE', 'RI', 'RO'] },
        { word: 'CAMA', parts: ['CA', 'MA'], missing: 1, options: ['MA', 'ME', 'MI', 'MO'] },
        { word: 'FOCA', parts: ['FO', 'CA'], missing: 0, options: ['FO', 'FA', 'FI', 'FU'] },
        { word: 'MOTO', parts: ['MO', 'TO'], missing: 1, options: ['TO', 'TA', 'TE', 'TI'] },
        { word: 'ROSA', parts: ['RO', 'SA'], missing: 0, options: ['RO', 'RA', 'RE', 'RI'] },
        { word: 'NUBE', parts: ['NU', 'BE'], missing: 1, options: ['BE', 'BA', 'BI', 'BO'] },
        { word: 'LORO', parts: ['LO', 'RO'], missing: 0, options: ['LO', 'LA', 'LE', 'LI'] }
      ],
      readings: [
        {
          text: 'Ana tiene un gato rojo.',
          question: '¿De qué color es el gato?',
          choices: ['Rojo', 'Azul', 'Verde'],
          answer: 0
        },
        {
          text: 'Luis come una manzana.',
          question: '¿Qué come Luis?',
          choices: ['Una manzana', 'Un helado', 'Un pez'],
          answer: 0
        },
        {
          text: 'El sol brilla en el cielo.',
          question: '¿Dónde brilla el sol?',
          choices: ['En el cielo', 'En la mesa', 'En el agua'],
          answer: 0
        },
        {
          text: 'Mi mamá lee un cuento.',
          question: '¿Qué hace mamá?',
          choices: ['Lee un cuento', 'Cocina pizza', 'Corre rápido'],
          answer: 0
        },
        {
          text: 'El pato nada en el lago.',
          question: '¿Dónde nada el pato?',
          choices: ['En el lago', 'En la cama', 'En la escuela'],
          answer: 0
        },
        {
          text: 'Hay tres flores en la mesa.',
          question: '¿Cuántas flores hay?',
          choices: ['Tres', 'Dos', 'Cinco'],
          answer: 0
        },
        {
          text: 'Pedro tiene un perro grande.',
          question: '¿Qué animal tiene Pedro?',
          choices: ['Un perro', 'Un gato', 'Un pez'],
          answer: 0
        },
        {
          text: 'La luna sale de noche.',
          question: '¿Cuándo sale la luna?',
          choices: ['De noche', 'A mediodía', 'Por la mañana'],
          answer: 0
        }
      ],
      sentences: [
        { words: ['Ana', 'lee', 'un', 'libro.'] },
        { words: ['El', 'gato', 'duerme.'] },
        { words: ['Mamá', 'cocina', 'sopa.'] },
        { words: ['Voy', 'al', 'cole.'] },
        { words: ['El', 'sol', 'calienta.'] },
        { words: ['Tengo', 'un', 'perro.'] },
        { words: ['La', 'rana', 'salta.'] },
        { words: ['Papi', 'lee', 'hoy.'] }
      ]
    },
    {
      label: '2º Primaria',
      syllableWords: [
        { word: 'LIBRO', syllables: ['LI', 'BRO'], emoji: '📖' },
        { word: 'FLOR', syllables: ['FLOR'], emoji: '🌸' },
        { word: 'CLASE', syllables: ['CLA', 'SE'], emoji: '🏫' },
        { word: 'VERDE', syllables: ['VER', 'DE'], emoji: '🟢' },
        { word: 'CAMPO', syllables: ['CAM', 'PO'], emoji: '🌾' },
        { word: 'PLATO', syllables: ['PLA', 'TO'], emoji: '🍽️' },
        { word: 'FRESA', syllables: ['FRE', 'SA'], emoji: '🍓' },
        { word: 'PUENTE', syllables: ['PUEN', 'TE'], emoji: '🌉' }
      ],
      fillWords: [
        { word: 'LIBRO', parts: ['LI', 'BRO'], missing: 0, options: ['LI', 'LE', 'LA', 'LO'] },
        { word: 'CLASE', parts: ['CLA', 'SE'], missing: 1, options: ['SE', 'SA', 'SI', 'SO'] },
        { word: 'VERDE', parts: ['VER', 'DE'], missing: 0, options: ['VER', 'VAR', 'VIR', 'VOR'] }
      ],
      readings: [
        {
          text: 'María encontró una flor amarilla en el parque.',
          question: '¿Dónde encontró la flor?',
          choices: ['En el parque', 'En la cocina', 'En el mar'],
          answer: 0
        },
        {
          text: 'Los niños juegan en el recreo después de comer.',
          question: '¿Cuándo juegan?',
          choices: ['En el recreo', 'Por la noche', 'Antes de nacer'],
          answer: 0
        },
        {
          text: 'El tren llega a las tres de la tarde.',
          question: '¿A qué hora llega el tren?',
          choices: ['A las tres', 'A las ocho', 'Al mediodía'],
          answer: 0
        },
        {
          text: 'La biblioteca tiene muchos libros nuevos.',
          question: '¿Qué hay en la biblioteca?',
          choices: ['Libros nuevos', 'Peces', 'Zapatos'],
          answer: 0
        },
        {
          text: 'En invierno hace frío y a veces nieva.',
          question: '¿Qué estación describe el texto?',
          choices: ['Invierno', 'Verano', 'Primavera'],
          answer: 0
        },
        {
          text: 'Carlos cuida su planta regándola cada día.',
          question: '¿Qué hace Carlos con la planta?',
          choices: ['La riega', 'La come', 'La tira'],
          answer: 0
        },
        {
          text: 'La abuela prepara una sopa de verduras.',
          question: '¿Qué cocina la abuela?',
          choices: ['Sopa de verduras', 'Helado', 'Pizza dulce'],
          answer: 0
        },
        {
          text: 'Los pájaros construyen el nido en el árbol.',
          question: '¿Dónde construyen el nido?',
          choices: ['En el árbol', 'En el mar', 'En la nevera'],
          answer: 0
        }
      ],
      sentences: [
        { words: ['María', 'lee', 'un', 'cuento', 'largo.'] },
        { words: ['El', 'perro', 'corre', 'rápido.'] }
      ]
    },
    {
      label: '3º Primaria',
      syllableWords: [
        { word: 'BIBLIOTECA', syllables: ['BI', 'BLIO', 'TE', 'CA'], emoji: '📚' },
        { word: 'MONTAÑA', syllables: ['MON', 'TA', 'ÑA'], emoji: '⛰️' }
      ],
      fillWords: [
        { word: 'HISTORIA', parts: ['HIS', 'TO', 'RIA'], missing: 1, options: ['TO', 'TA', 'TE', 'TI'] }
      ],
      readings: [
        {
          text: 'El equipo ganó el partido porque entrenó mucho.',
          question: '¿Por qué ganó el equipo?',
          choices: ['Porque entrenó mucho', 'Porque llovió', 'Porque no jugó'],
          answer: 0
        },
        {
          text: 'La Tierra gira alrededor del Sol en un año.',
          question: '¿Alrededor de qué gira la Tierra?',
          choices: ['Del Sol', 'De la Luna', 'De Marte'],
          answer: 0
        },
        {
          text: 'Los mamíferos respiran con pulmones.',
          question: '¿Cómo respiran los mamíferos?',
          choices: ['Con pulmones', 'Con branquias', 'Con hojas'],
          answer: 0
        },
        {
          text: 'El río desemboca en el mar después de muchos kilómetros.',
          question: '¿Dónde desemboca el río?',
          choices: ['En el mar', 'En la montaña', 'En el desierto'],
          answer: 0
        },
        {
          text: 'Para reciclar el plástico hay que llevarlo al contenedor amarillo.',
          question: '¿Dónde reciclamos el plástico?',
          choices: ['Contenedor amarillo', 'Contenedor azul', 'Contenedor negro'],
          answer: 0
        },
        {
          text: 'La planta necesita luz, agua y aire para crecer.',
          question: '¿Qué necesita la planta?',
          choices: ['Luz, agua y aire', 'Solo hielo', 'Solo arena'],
          answer: 0
        },
        {
          text: 'En la Edad Media se construyeron muchos castillos.',
          question: '¿Qué se construyó en la Edad Media?',
          choices: ['Castillos', 'Cohetes', 'Rascacielos'],
          answer: 0
        },
        {
          text: 'El volcán expulsa lava cuando entra en erupción.',
          question: '¿Qué expulsa el volcán?',
          choices: ['Lava', 'Agua dulce', 'Nieve'],
          answer: 0
        }
      ],
      sentences: [
        { words: ['Los', 'alumnos', 'estudian', 'para', 'el', 'examen.'] }
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
    if (!pool || !pool.length) return null;
    var tries = 0;
    while (tries < 30) {
      var item = pool[Math.floor(Math.random() * pool.length)];
      var key = item.word || item.text || JSON.stringify(item.words);
      if (!excludeKey || key !== excludeKey) return item;
      tries++;
    }
    return pool[0];
  }

  function buildSyllableRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.syllableWords, lastKey);
    var key = item.word;
    return {
      key: key,
      emoji: item.emoji,
      syllables: item.syllables.slice(),
      shuffled: shuffle(item.syllables)
    };
  }

  function buildFillRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.fillWords, lastKey);
    var display = item.parts.map(function (p, i) {
      return i === item.missing ? '___' : p;
    }).join(' ');
    return {
      key: item.word,
      emoji: '',
      display: display,
      answer: item.parts[item.missing],
      options: shuffle(item.options)
    };
  }

  function buildReadingRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var pool = tier.readings || [];
    if (!pool.length) pool = TIERS[0].readings || [];
    var item = pickRandom(pool, lastKey);
    if (!item) item = pool[0];
    return {
      key: item.text,
      text: item.text,
      question: item.question,
      choices: item.choices.slice(),
      answer: item.answer
    };
  }

  function buildFraseRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.sentences, lastKey);
    var key = item.words.join(' ');
    return {
      key: key,
      words: item.words.slice(),
      shuffled: shuffle(item.words)
    };
  }

  global.LipaLenguaBank = {
    TIERS: TIERS,
    getTier: getTier,
    tierIndex: tierIndex,
    shuffle: shuffle,
    buildSyllableRound: buildSyllableRound,
    buildFillRound: buildFillRound,
    buildReadingRound: buildReadingRound,
    buildFraseRound: buildFraseRound
  };
})(typeof window !== 'undefined' ? window : global);
