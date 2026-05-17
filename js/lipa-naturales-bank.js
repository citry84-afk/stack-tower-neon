/**
 * Banco Naturales — clasificar, preguntas y verdadero/falso (1º–3º Primaria)
 */
(function (global) {
  'use strict';

  var TIERS = [
    {
      label: '1º Primaria',
      classify: [
        { name: 'Gato', emoji: '🐱', answer: 0, labels: ['Animal', 'Planta'] },
        { name: 'Árbol', emoji: '🌳', answer: 1, labels: ['Animal', 'Planta'] },
        { name: 'Perro', emoji: '🐶', answer: 0, labels: ['Animal', 'Planta'] },
        { name: 'Rosa', emoji: '🌹', answer: 1, labels: ['Animal', 'Planta'] },
        { name: 'Pez', emoji: '🐟', answer: 0, labels: ['Animal', 'Planta'] },
        { name: 'Manzana en árbol', emoji: '🍎', answer: 1, labels: ['Animal', 'Planta'] },
        { name: 'Mariposa', emoji: '🦋', answer: 0, labels: ['Animal', 'Planta'] },
        { name: 'Cactus', emoji: '🌵', answer: 1, labels: ['Animal', 'Planta'] },
        { name: 'Pájaro', emoji: '🐦', answer: 0, labels: ['Animal', 'Planta'] },
        { name: 'Hierba', emoji: '🌿', answer: 1, labels: ['Animal', 'Planta'] }
      ],
      quiz: [
        {
          text: 'Los seres vivos necesitan agua para vivir.',
          question: '¿Es verdad?',
          choices: ['Sí, es verdad', 'No, es falso'],
          answer: 0
        },
        {
          text: 'Las plantas hacen su comida con la luz del sol.',
          question: '¿Qué hacen las plantas?',
          choices: ['Comen con la luz', 'Solo duermen de día'],
          answer: 0
        },
        {
          text: 'El corazón bombea sangre por el cuerpo.',
          question: '¿Para qué sirve el corazón?',
          choices: ['Bombear sangre', 'Oler flores'],
          answer: 0
        },
        {
          text: 'Con los ojos vemos y con los oídos oímos.',
          question: '¿Qué sentido usamos para oír?',
          choices: ['El oído', 'El tacto'],
          answer: 0
        },
        {
          text: 'Lavarse las manos ayuda a no enfermar.',
          question: '¿Por qué es importante?',
          choices: ['Quita gérmenes', 'Porque aburre'],
          answer: 0
        }
      ],
      verdad: [
        { statement: 'Los peces respiran bajo el agua.', answer: true },
        { statement: 'El sol es un planeta.', answer: false },
        { statement: 'En invierno algunos árboles pierden las hojas.', answer: true },
        { statement: 'Las rocas son seres vivos.', answer: false },
        { statement: 'Beber agua es bueno para la salud.', answer: true },
        { statement: 'La Luna brilla con luz propia como el Sol.', answer: false }
      ]
    },
    {
      label: '2º Primaria',
      classify: [
        { name: 'Rana', emoji: '🐸', answer: 0, labels: ['Vertebrado', 'Invertebrado'] },
        { name: 'Mariposa', emoji: '🦋', answer: 1, labels: ['Vertebrado', 'Invertebrado'] },
        { name: 'Serpiente', emoji: '🐍', answer: 0, labels: ['Vertebrado', 'Invertebrado'] },
        { name: 'Caracol', emoji: '🐌', answer: 1, labels: ['Vertebrado', 'Invertebrado'] },
        { name: 'Delfín', emoji: '🐬', answer: 0, labels: ['Vertebrado', 'Invertebrado'] },
        { name: 'Hormiga', emoji: '🐜', answer: 1, labels: ['Vertebrado', 'Invertebrado'] }
      ],
      quiz: [
        {
          text: 'Los mamíferos tienen pelo o vello y amamantan a sus crías.',
          question: '¿Cuál es un mamífero?',
          choices: ['La ballena', 'El pez'],
          answer: 0
        },
        {
          text: 'El ciclo del agua: el sol evapora el agua y luego cae como lluvia.',
          question: '¿Cómo vuelve el agua a la tierra?',
          choices: ['Con la lluvia', 'Con el viento solo'],
          answer: 0
        },
        {
          text: 'Reciclar papel y plástico cuida el planeta.',
          question: '¿Qué hacemos al reciclar?',
          choices: ['Reutilizar materiales', 'Tirar todo al mar'],
          answer: 0
        }
      ],
      verdad: [
        { statement: 'Las aves tienen plumas.', answer: true },
        { statement: 'Los hongos son plantas.', answer: false },
        { statement: 'La Tierra gira alrededor del Sol.', answer: true },
        { statement: 'El hielo es agua en estado sólido.', answer: true }
      ]
    },
    {
      label: '3º Primaria',
      classify: [
        { name: 'Imán', emoji: '🧲', answer: 0, labels: ['Atrae el hierro', 'No atrae metales'] },
        { name: 'Madera', emoji: '🪵', answer: 1, labels: ['Atrae el hierro', 'No atrae metales'] },
        { name: 'Clavo de hierro', emoji: '🔩', answer: 0, labels: ['Atrae el hierro', 'No atrae metales'] },
        { name: 'Plástico', emoji: '🥤', answer: 1, labels: ['Atrae el hierro', 'No atrae metales'] }
      ],
      quiz: [
        {
          text: 'Las plantas producen oxígeno que respiramos.',
          question: '¿Qué gas nos dan las plantas?',
          choices: ['Oxígeno', 'Arena'],
          answer: 0
        },
        {
          text: 'Un ecosistema tiene seres vivos y el lugar donde viven.',
          question: '¿Qué es un ecosistema?',
          choices: ['Seres vivos y su entorno', 'Solo las rocas'],
          answer: 0
        }
      ],
      verdad: [
        { statement: 'La electricidad puede ser peligrosa si no se usa con cuidado.', answer: true },
        { statement: 'Los fósiles son restos de seres vivos muy antiguos.', answer: true },
        { statement: 'El agua hierve a 100 °C a nivel del mar.', answer: true },
        { statement: 'Los dinosaurios viven hoy en las ciudades.', answer: false }
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
      var key = item.name || item.statement || item.text;
      if (!excludeKey || key !== excludeKey) return item;
      tries++;
    }
    return pool[0];
  }

  function buildClassifyRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.classify, lastKey);
    return {
      key: item.name,
      name: item.name,
      emoji: item.emoji,
      labels: item.labels.slice(),
      answer: item.answer
    };
  }

  function buildQuizRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.quiz, lastKey);
    return {
      key: item.text,
      text: item.text,
      question: item.question,
      choices: item.choices.slice(),
      answer: item.answer
    };
  }

  function buildVerdadRound(brainLevel, lastKey) {
    var tier = getTier(brainLevel);
    var item = pickRandom(tier.verdad, lastKey);
    return {
      key: item.statement,
      statement: item.statement,
      answer: item.answer
    };
  }

  global.LipaNaturalesBank = {
    TIERS: TIERS,
    getTier: getTier,
    shuffle: shuffle,
    buildClassifyRound: buildClassifyRound,
    buildQuizRound: buildQuizRound,
    buildVerdadRound: buildVerdadRound
  };
})(typeof window !== 'undefined' ? window : global);
