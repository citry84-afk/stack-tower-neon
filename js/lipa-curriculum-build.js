/**
 * Generadores de unidades y actividades curriculares
 */
(function (global) {
  'use strict';

  function liveGame(id, title, gameId, difficulty, brainLevel, tip) {
    return {
      id: id,
      title: title,
      type: 'mini-game',
      gameId: gameId,
      brainLevel: brainLevel || 1,
      difficulty: difficulty || 1,
      estimatedMinutes: difficulty <= 2 ? 2 : 3,
      rewardXp: 10 + (difficulty || 1) * 8,
      status: 'live',
      tip: tip || ''
    };
  }

  function liveReflex(id, title, gameId, difficulty) {
    return liveGame(id, title, gameId, difficulty, null, 'Reflejos y atención');
  }

  function liveLengua(id, title, gameId, difficulty, tip, brainLevel) {
    return {
      id: id,
      title: title,
      type: 'mini-game',
      gameId: gameId,
      brainLevel: brainLevel || 1,
      difficulty: difficulty || 1,
      estimatedMinutes: 2,
      rewardXp: 10 + (difficulty || 1) * 8,
      status: 'live',
      tip: tip || 'Lenguaje'
    };
  }

  function liveNaturales(id, title, gameId, difficulty, tip, brainLevel) {
    var a = liveLengua(id, title, gameId, difficulty, tip, brainLevel);
    a.tip = tip || 'Naturales';
    return a;
  }

  function liveSociales(id, title, gameId, difficulty, tip, brainLevel) {
    var a = liveLengua(id, title, gameId, difficulty, tip, brainLevel);
    a.tip = tip || 'Sociales';
    return a;
  }

  function livePeques(id, title, gameId, difficulty, tip, brainLevel) {
    var a = liveLengua(id, title, gameId, difficulty, tip, brainLevel || 1);
    a.tip = tip || 'Infantil';
    return a;
  }

  var ROT_MATES = ['neon-calculo', 'neon-ordenar', 'neon-mayor-menor', 'neon-clasifica'];
  var ROT_INGLES = ['neon-palabras', 'flash-tap'];
  var ROT_INFANTIL = ['neon-peques', 'neon-colores', 'neon-numeros', 'flash-tap'];
  var ROT_INFANTIL_EN = ['neon-peques', 'neon-colores', 'flash-tap'];
  var ROT_NATURALES = ['neon-vida', 'neon-cuerpo', 'neon-planeta'];
  var ROT_SOCIALES = ['neon-mapa', 'neon-entorno', 'neon-historia'];
  var ROT_LENGUA = ['neon-lectura', 'neon-silabas', 'neon-palabra', 'neon-frase'];

  function rot(pool, slot) {
    return pool[((slot % pool.length) + pool.length) % pool.length];
  }

  function liveMates(id, title, slot, difficulty, brainLevel, tip) {
    return liveGame(id, title, rot(ROT_MATES, slot), difficulty, brainLevel, tip);
  }

  function liveIngles(id, title, slot, difficulty, brainLevel, tip) {
    return liveGame(id, title, rot(ROT_INGLES, slot), difficulty, brainLevel, tip || 'Inglés');
  }

  function liveInfantil(id, title, slot, difficulty, tip, brainLevel) {
    var a = livePeques(id, title, rot(ROT_INFANTIL, slot), difficulty, tip, brainLevel);
    return a;
  }

  function liveLenguaRot(id, title, slot, difficulty, tip, brainLevel) {
    return liveLengua(id, title, rot(ROT_LENGUA, slot), difficulty, tip, brainLevel);
  }

  function liveNaturalesRot(id, title, slot, difficulty, tip, brainLevel) {
    return liveNaturales(id, title, rot(ROT_NATURALES, slot), difficulty, tip, brainLevel);
  }

  function liveSocialesRot(id, title, slot, difficulty, tip, brainLevel) {
    return liveSociales(id, title, rot(ROT_SOCIALES, slot), difficulty, tip, brainLevel);
  }

  function primaria4Naturales() {
    return primaria3Naturales().map(function (u, i) {
      return unit(
        'p4-n-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p3-/, 'p4-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  function primaria4Sociales() {
    return primaria3Sociales().map(function (u, i) {
      return unit(
        'p4-s-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p3-/, 'p4-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  function primaria5Naturales() {
    return primaria4Naturales().map(function (u, i) {
      return unit(
        'p5-n-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p4-/, 'p5-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  function primaria5Sociales() {
    return primaria4Sociales().map(function (u, i) {
      return unit(
        'p5-s-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p4-/, 'p5-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  function primaria6Naturales() {
    return primaria5Naturales().map(function (u, i) {
      return unit(
        'p6-n-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p5-/, 'p6-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  function primaria6Sociales() {
    return primaria5Sociales().map(function (u, i) {
      return unit(
        'p6-s-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p5-/, 'p6-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  function infantilSubjects(id, tier) {
    var bl = tier === 0 ? 1 : tier === 1 ? 3 : 5;
    var extraLive = tier >= 1;
    return [
      subject('matematicas', [
        unit(id + '-m-colores', 'Colores y números', 'Juegos grandes con pictogramas.', [
          liveInfantil(id + '-m-c1', '¿Qué color?', 0, 1, 'Toca el color', bl),
          liveInfantil(id + '-m-c2', '¿Cuántos hay?', 1, 1, 'Cuenta hasta 5', bl),
          extraLive ? liveInfantil(id + '-m-c3', 'Toca rápido', 3, 2, 'Atención', bl) : soon(id + '-m-c3', 'Grande o pequeño', 'multiple-choice', 2),
          soon(id + '-m-c4', 'Formas', 'matching', 2),
          soon(id + '-m-c5', 'Reto visual', 'quiz', 3)
        ]),
        unit(id + '-m-formas', 'Formas y clasificar', 'Agrupar y reconocer.', [
          liveInfantil(id + '-m-f1', '¿Qué es?', 2, 1, 'Vocabulario visual', bl),
          liveInfantil(id + '-m-f2', 'Colores mix', 0, 2, 'Repaso', bl),
          extraLive ? liveInfantil(id + '-m-f3', 'Cuenta y toca', 1, 2, 'Números', bl) : soon(id + '-m-f3', 'Igual o diferente', 'matching', 2),
          soon(id + '-m-f4', 'Seriaciones', 'ordering', 3),
          soon(id + '-m-f5', 'Misión formas', 'quiz', 4)
        ])
      ], 'live'),
      subject('lenguaje', [
        unit(id + '-l-vocab', 'Vocabulario', 'Palabras del día a día con dibujos.', [
          liveInfantil(id + '-l-v1', 'Nombres', 0, 1, 'Toca la palabra', bl),
          liveInfantil(id + '-l-v2', '¿Qué es esto?', 1, 2, 'Imagen y palabra', bl),
          extraLive ? liveInfantil(id + '-l-v3', 'Colores y palabras', 0, 2, 'Repaso', bl) : soon(id + '-l-v3', 'Rimas', 'listening', 2),
          soon(id + '-l-v4', 'Sonidos iniciales', 'matching', 3),
          soon(id + '-l-v5', 'Cuento corto', 'reading', 4)
        ]),
        unit(id + '-l-sonidos', 'Sonidos', 'Conciencia fonológica suave.', [
          liveInfantil(id + '-l-s1', 'Palabras', 2, 1, 'Escucha con los ojos', bl),
          extraLive ? liveInfantil(id + '-l-s2', 'Cuenta sonidos', 1, 2, 'Números', bl) : soon(id + '-l-s2', 'Sílabas con palmas', 'listening', 2),
          soon(id + '-l-s3', 'Empieza por…', 'multiple-choice', 2),
          soon(id + '-l-s4', 'Canción', 'listening', 3),
          soon(id + '-l-s5', 'Reto sonidos', 'quiz', 4)
        ])
      ], 'live'),
      subject('ingles', [
        unit(id + '-i-hola', 'Hello', 'Primeras palabras en inglés.', [
          liveInfantil(id + '-i-h1', 'Animals EN', 0, 1, 'Dog, cat…', bl),
          liveInfantil(id + '-i-h2', 'Colours EN', 1, 2, 'Red, blue…', bl),
          extraLive ? liveReflex(id + '-i-h3', 'Point and tap', 'flash-tap', 2) : soon(id + '-i-h3', 'Hello song', 'listening', 2),
          soon(id + '-i-h4', 'Point and say', 'mini-game', 3),
          soon(id + '-i-h5', 'Mini quiz', 'quiz', 4)
        ]),
        unit(id + '-i-play', 'Play & body', 'Acciones y partes del cuerpo en inglés.', [
          liveInfantil(id + '-i-p1', 'Body EN', 2, 1, 'Head, hand…', bl),
          liveInfantil(id + '-i-p2', 'Actions EN', 0, 2, 'Jump, clap…', bl),
          extraLive ? liveInfantil(id + '-i-p3', 'Listen & tap', 1, 2, 'Inglés oral', bl) : soon(id + '-i-p3', 'I like…', 'typing', 2),
          soon(id + '-i-p4', 'Picture match', 'matching', 3),
          soon(id + '-i-p5', 'English mission', 'quiz', 4)
        ])
      ], 'live'),
      subject('naturales', [
        unit(id + '-n-animales', 'Animales y plantas', 'Explorar el entorno.', [
          liveInfantil(id + '-n-a1', 'Animal o cosa', 0, 1, 'Seres vivos', bl),
          liveInfantil(id + '-n-a2', 'Colores naturaleza', 1, 2, 'Planta, sol…', bl),
          extraLive ? liveInfantil(id + '-n-a3', '¿Cuántos?', 2, 2, 'Contar', bl) : soon(id + '-n-a3', 'Partes de la planta', 'matching', 2),
          soon(id + '-n-a4', 'Estaciones', 'ordering', 3),
          soon(id + '-n-a5', 'Reto naturaleza', 'quiz', 4)
        ]),
        unit(id + '-n-cuerpo', 'Cuerpo y clima', 'Salud y tiempo atmosférico.', [
          liveInfantil(id + '-n-c1', 'Partes del cuerpo', 0, 1, 'Cabeza, pies…', bl),
          liveInfantil(id + '-n-c2', 'Sol y lluvia', 1, 2, 'Clima', bl),
          extraLive ? liveInfantil(id + '-n-c3', 'Fruta sana', 2, 2, 'Alimentación', bl) : soon(id + '-n-c3', 'Día y noche', 'ordering', 2),
          soon(id + '-n-c4', 'Animales del bosque', 'matching', 3),
          soon(id + '-n-c5', 'Misión naturaleza', 'quiz', 4)
        ])
      ], 'live'),
      subject('sociales', [
        unit(id + '-s-emos', 'Emociones y normas', 'Convivir en el aula.', [
          liveInfantil(id + '-s-e1', 'Familia', 0, 1, 'Mamá, papá…', bl),
          liveInfantil(id + '-s-e2', 'En el cole', 1, 2, 'Colegio, amigos', bl),
          extraLive ? liveInfantil(id + '-s-e3', 'Turnos y colores', 2, 2, 'Convivencia', bl) : soon(id + '-s-e3', 'Caras felices', 'matching', 2),
          soon(id + '-s-e4', 'Turnos', 'ordering', 2),
          soon(id + '-s-e5', 'Misión emociones', 'quiz', 4)
        ]),
        unit(id + '-s-cole', 'El cole y la calle', 'Normas y lugares del barrio.', [
          liveInfantil(id + '-s-c1', 'Mi clase', 0, 1, 'Mesa, patio…', bl),
          liveInfantil(id + '-s-c2', 'Señales', 1, 2, 'Pare, ceda…', bl),
          extraLive ? liveInfantil(id + '-s-c3', 'Ayudar al compi', 2, 2, 'Convivencia', bl) : soon(id + '-s-c3', 'Ordena el día', 'ordering', 2),
          soon(id + '-s-c4', 'Profesiones', 'matching', 3),
          soon(id + '-s-c5', 'Misión ciudadana', 'quiz', 4)
        ])
      ], 'live'),
      subject('brain-gym-diario', [
        unit(id + '-d1', 'Atención visual', 'Juegos cortos para peques.', [
          liveReflex(id + '-d-f', 'Flash tap suave', 'flash-tap', 1),
          liveInfantil(id + '-d-p', 'Neon Peques', 0, 1, 'Calentamiento', bl),
          liveInfantil(id + '-d-n', 'Cuenta rápido', 2, 1, '1 min', bl),
          liveReflex(id + '-d-r', 'Test reflejos', 'reaction-test', 2),
          liveInfantil(id + '-d-c', 'Colores mix', 1, 2, 'Repaso', bl)
        ])
      ], 'live')
    ];
  }

  function soon(id, title, type, difficulty) {
    return {
      id: id,
      title: title,
      type: type || 'quiz',
      difficulty: difficulty || 1,
      estimatedMinutes: 3,
      rewardXp: 15,
      status: 'soon'
    };
  }

  function unit(id, title, description, activities) {
    return {
      id: id,
      title: title,
      description: description,
      skills: [],
      activities: activities
    };
  }

  function subject(subjectId, units, status) {
    return {
      subjectId: subjectId,
      status: status || 'live',
      units: units
    };
  }

  /** —— 1º Primaria —— */
  function primaria1Math() {
    return [
      unit(
        'p1-m-numeros',
        'Números del 0 al 99',
        'Contar, comparar y ordenar números de dos cifras.',
        [
          liveMates('p1-m-n1-w', 'Conteo relámpago', 0, 1, 1, 'Sumas pequeñas'),
          liveMates('p1-m-n1-t', 'Entrenamiento 0–20', 1, 2, 1, 'Sin llevadas'),
          liveMates('p1-m-n1-r', 'Reto de cifras', 2, 3, 2, 'Más velocidad'),
          liveGame('p1-m-n1-o', 'Ordenar números', 'neon-ordenar', 2, 2, 'De menor a mayor'),
          liveGame('p1-m-n1-m', 'Mayor y menor', 'neon-mayor-menor', 3, 2, 'Compara bien')
        ]
      ),
      unit(
        'p1-m-sumas',
        'Suma y resta sin llevadas',
        'Operaciones con números pequeños, base del cálculo mental.',
        [
          liveMates('p1-m-s1-w', 'Sumas fáciles', 0, 1, 1),
          liveMates('p1-m-s2-t', 'Mix suma y resta', 1, 2, 2),
          liveMates('p1-m-s3-r', 'Combo sin parar', 2, 3, 2),
          soon('p1-m-s4-p', 'Problemas con dibujos', 'multiple-choice', 2),
          soon('p1-m-s5-m', 'Misión de la tienda', 'mini-game', 5)
        ]
      ),
      unit(
        'p1-m-problemas',
        'Problemas de una operación',
        'Leer, entender y resolver en un paso.',
        [
          liveMates('p1-m-p1-w', 'Calentamiento mental', 0, 1, 1),
          liveMates('p1-m-p2-t', 'Problemas numéricos', 1, 2, 2),
          soon('p1-m-p3-h', 'Historias cortas', 'reading', 2),
          soon('p1-m-p4-d', 'Elige la operación', 'multiple-choice', 3),
          soon('p1-m-p5-m', 'Mini test del mercado', 'quiz', 5)
        ]
      ),
      unit(
        'p1-m-medida',
        'Medida y tiempo',
        'Días, meses y reloj en punto.',
        [
          soon('p1-m-e1-c', 'Días de la semana', 'matching', 1),
          soon('p1-m-e2-r', 'Reloj en punto', 'mini-game', 2),
          liveGame('p1-m-e3-n', 'Números del calendario', 'neon-calculo', 2, 2),
          soon('p1-m-e4-l', 'Largo y corto', 'drag-drop', 2),
          soon('p1-m-e5-m', 'Misión del calendario', 'quiz', 4)
        ]
      ),
      unit(
        'p1-m-figuras',
        'Figuras planas',
        'Círculo, cuadrado, triángulo y rectángulo.',
        [
          liveGame('p1-m-f1-f', 'Nombre la figura', 'neon-clasifica', 1, 1, 'Elige el grupo'),
          soon('p1-m-f2-c', 'Cuenta lados', 'multiple-choice', 2),
          liveGame('p1-m-f3-a', 'Atención visual', 'flash-tap', 2, null),
          soon('p1-m-f4-p', 'Patrones con formas', 'ordering', 3),
          soon('p1-m-f5-m', 'Reto geométrico', 'quiz', 4)
        ]
      )
    ];
  }

  function primaria1Lengua() {
    return [
      unit('p1-l-silabas', 'Sílabas y palabras', 'Leer sílabas directas y palabras cortas.', [
        liveLengua('p1-l-s3', 'Ordena sílabas', 'neon-silabas', 1, 'Forma la palabra'),
        liveLengua('p1-l-s2', 'Completa la palabra', 'neon-palabra', 2, 'Elige la sílaba'),
        liveLengua('p1-l-s4', 'Lectura guiada', 'neon-lectura', 3, 'Comprensión literal'),
        soon('p1-l-s1', 'Une sílaba e imagen', 'matching', 1),
        soon('p1-l-s5', 'Mini dictado', 'listening', 4)
      ]),
      unit('p1-l-frases', 'Frases simples', 'Mayúscula, punto y comprensión literal.', [
        liveLengua('p1-l-f1', 'Ordena la frase', 'neon-frase', 1, 'Toca las palabras en orden'),
        liveLengua('p1-l-f2', '¿Qué pasó?', 'neon-lectura', 2, 'Lee y responde'),
        soon('p1-l-f3', 'Pon el punto', 'multiple-choice', 2),
        soon('p1-l-f4', 'Escribe tu frase', 'typing', 3),
        soon('p1-l-f5', 'Misión del cuento', 'quiz', 5)
      ]),
      unit('p1-l-vocab', 'Vocabulario cotidiano', 'Casa, colegio, familia y emociones.', [
        soon('p1-l-v1', 'Imagen y palabra', 'matching', 1),
        soon('p1-l-v2', 'Clasifica palabras', 'drag-drop', 2),
        soon('p1-l-v3', 'Sinónimos sencillos', 'multiple-choice', 3),
        soon('p1-l-v4', 'Escucha y elige', 'listening', 2),
        soon('p1-l-v5', 'Reto del diccionario', 'quiz', 4)
      ])
    ];
  }

  function primaria1Ingles() {
    return [
      unit('p1-i-hola', 'Hello y presentaciones', 'Saludar y decir tu nombre.', [
        liveIngles('p1-i-h1', 'Hello / goodbye', 0, 1, 1, 'Vocabulario básico'),
        liveIngles('p1-i-h2', 'My name is…', 1, 2, 1),
        soon('p1-i-h3', 'Escucha y repite', 'listening', 1),
        soon('p1-i-h4', 'Roleplay mini', 'roleplay', 3),
        soon('p1-i-h5', 'Misión del saludo', 'quiz', 4)
      ]),
      unit('p1-i-numbers', 'Numbers 1–20', 'Contar en inglés con imágenes.', [
        liveIngles('p1-i-n1', 'Numbers 1–10', 0, 1, 1),
        liveIngles('p1-i-n2', 'Numbers 11–20', 1, 2, 2),
        soon('p1-i-n3', 'Ordena números', 'ordering', 2),
        soon('p1-i-n4', 'Listening numbers', 'listening', 3),
        soon('p1-i-n5', 'Number challenge', 'quiz', 4)
      ]),
      unit('p1-i-colours', 'Colours y animals', 'Colores y animales frecuentes.', [
        liveIngles('p1-i-c1', 'Colours', 0, 1, 1),
        liveIngles('p1-i-c2', 'Animals', 1, 2, 2),
        soon('p1-i-c3', 'I like…', 'typing', 2),
        soon('p1-i-c4', 'This is a…', 'multiple-choice', 3),
        soon('p1-i-c5', 'Animal memory', 'memory', 4)
      ])
    ];
  }

  function primaria1Naturales() {
    return [
      unit('p1-n-vida', 'Seres vivos', 'Animales, plantas y lo que necesitan para vivir.', [
        liveNaturales('p1-n-v1', 'Animal o planta', 'neon-vida', 1, 'Clasifica', 1),
        liveNaturales('p1-n-v2', '¿Verdad o mentira?', 'neon-planeta', 2, 'Ciencia divertida', 1),
        liveNaturales('p1-n-v3', 'Partes de la planta', 'neon-vida', 2, 'Clasifica', 2, 'Partes de la planta', 'matching', 2),
        liveNaturales('p1-n-v4', 'Cadena alimenticia', 'neon-cuerpo', 2, 'Lee y responde', 2, 'Cadena alimenticia', 'ordering', 3),
        liveNaturales('p1-n-v5', 'Reto de la huerta', 'neon-planeta', 3, 'Verdadero o falso', 2, 'Reto de la huerta', 'quiz', 4)
      ]),
      unit('p1-n-cuerpo', 'Cuerpo y salud', 'Sentidos, higiene y hábitos sanos.', [
        liveNaturales('p1-n-c1', 'Cuerpo y sentidos', 'neon-cuerpo', 1, 'Elige la respuesta', 1),
        liveNaturales('p1-n-c2', 'Clasifica seres vivos', 'neon-vida', 2, 'Animales y plantas', 1),
        liveNaturales('p1-n-c3', 'Alimentos saludables', 'neon-cuerpo', 2, 'Elige bien', 2, 'Alimentos saludables', 'drag-drop', 2),
        liveNaturales('p1-n-c4', 'Rutina del día', 'neon-planeta', 2, 'Ciencia', 2, 'Rutina del día', 'ordering', 2),
        liveNaturales('p1-n-c5', 'Misión salud', 'neon-vida', 3, 'Clasifica', 2, 'Misión salud', 'quiz', 4)
      ]),
      unit('p1-n-materia', 'Materia y energía', 'Agua, aire, luz y cuidar el planeta.', [
        liveNaturales('p1-n-m1', 'Verdadero o falso', 'neon-planeta', 1, 'La Tierra y el cielo', 1),
        liveNaturales('p1-n-m2', 'Preguntas de ciencia', 'neon-cuerpo', 2, 'Lee y responde', 1),
        liveNaturales('p1-n-m3', 'Estados del agua', 'neon-planeta', 2, 'V o F', 2, 'Estados del agua', 'matching', 2),
        liveNaturales('p1-n-m4', 'Recicla', 'neon-vida', 3, 'Medio ambiente', 2, 'Recicla', 'drag-drop', 3),
        liveNaturales('p1-n-m5', 'Reto ecológico', 'neon-cuerpo', 3, 'Preguntas', 2, 'Reto ecológico', 'quiz', 5)
      ])
    ];
  }

  function primaria1Sociales() {
    return [
      unit('p1-s-entorno', 'Mi entorno', 'Familia, colegio y normas de convivencia.', [
        liveSociales('p1-s-e1', 'Familia y cole', 'neon-entorno', 1, 'Convivencia', 1),
        liveSociales('p1-s-e2', 'Normas del aula', 'neon-historia', 2, 'Ordena frases', 1),
        liveSociales('p1-s-e3', 'Emociones', 'neon-mapa', 2, 'Lugares del barrio', 1),
        liveSociales('p1-s-e4', 'Ayudar en casa', 'neon-historia', 2, 'Ordena', 2),
        liveSociales('p1-s-e5', 'Misión del barrio', 'neon-entorno', 3, 'Lee', 2)
      ]),
      unit('p1-s-mapas', 'Mapas y paisaje', 'Orientación y lugares cercanos.', [
        liveSociales('p1-s-m1', '¿Dónde estamos?', 'neon-mapa', 1, 'Mapas y lugares', 1),
        liveSociales('p1-s-m2', 'Capital y país', 'neon-entorno', 2, 'Geografía sencilla', 1),
        liveSociales('p1-s-m3', 'Símbolos del mapa', 'neon-historia', 2, 'Ordena conceptos', 1),
        liveSociales('p1-s-m4', 'Mi ruta al cole', 'neon-mapa', 3, 'Geografía', 2),
        liveSociales('p1-s-m5', 'Reto del explorador', 'neon-entorno', 3, 'Capitales', 2)
      ]),
      unit('p1-s-historia', 'Historia cercana', 'Fiestas, tiempo y cambios.', [
        liveSociales('p1-s-h1', 'Ordena el tiempo', 'neon-historia', 1, 'Frases en orden', 1),
        liveSociales('p1-s-h2', 'Fiestas y tradiciones', 'neon-entorno', 2, 'Cultura cercana', 1),
        liveSociales('p1-s-h3', 'Antes y ahora', 'neon-mapa', 2, 'Lugares y tiempo', 1),
        liveSociales('p1-s-h4', 'Línea del tiempo', 'neon-historia', 3, 'Ordena', 2),
        liveSociales('p1-s-h5', 'Misión histórica', 'neon-entorno', 3, 'Tradiciones', 2)
      ])
    ];
  }

  function primaria1Daily() {
    return [
      unit('p1-d-rutina', 'Brain Gym de hoy', 'Mates, lenguaje, inglés y un reto rápido (PDF 7 min).', [
        liveGame('p1-d1', 'Cálculo express', 'neon-calculo', 1, 1, '3 preguntas rápidas'),
        liveLengua('p1-d2', 'Mini lectura', 'neon-lectura', 2, 'Comprensión', 1),
        liveGame('p1-d3', 'Palabras EN', 'neon-palabras', 1, 1, 'Vocabulario'),
        liveNaturales('p1-d4', 'Ciencia corta', 'neon-cuerpo', 1, '1 pregunta', 1),
        liveReflex('p1-d5', 'Reflejos finales', 'flash-tap', 2)
      ])
    ];
  }

  /** —— 2º Primaria —— */
  function primaria2Math() {
    return [
      unit('p2-m-numeros', 'Números hasta 999', 'Centenas y comparación.', [
        liveMates('p2-m-n1', 'Sumas hasta 50', 0, 1, 2),
        liveMates('p2-m-n2', 'Restas con ayuda', 1, 2, 2),
        liveMates('p2-m-n3', 'Reto 0–99', 2, 3, 3),
        soon('p2-m-n4', 'Ordena centenas', 'ordering', 3),
        soon('p2-m-n5', 'Misión numérica', 'quiz', 4)
      ]),
      unit('p2-m-llevadas', 'Sumas y restas con llevadas', 'Un paso más en cálculo mental.', [
        liveMates('p2-m-l1', 'Calentamiento', 0, 1, 2),
        liveMates('p2-m-l2', 'Operaciones mixtas', 1, 2, 3),
        liveMates('p2-m-l3', 'Combo 60 s', 2, 3, 3),
        soon('p2-m-l4', 'Problemas dos pasos', 'multiple-choice', 3),
        soon('p2-m-l5', 'Misión del banco', 'quiz', 5)
      ]),
      unit('p2-m-tablas', 'Tablas del 2, 5 y 10', 'Multiplicar como suma repetida.', [
        liveGame('p2-m-t1', 'Tablas del 2', 'tablas-relampago', 1, 2),
        liveMates('p2-m-t2', 'Mental × tablas', 1, 2, 2),
        liveGame('p2-m-t3', 'Tablas del 10', 'tablas-relampago', 3, 3),
        soon('p2-m-t4', 'Problemas de grupos', 'multiple-choice', 3),
        soon('p2-m-t5', 'Carrera de tablas', 'mini-game', 5)
      ]),
      unit('p2-m-dinero', 'Dinero y tiempo', 'Monedas y media hora.', [
        soon('p2-m-d1', 'Monedas y billetes', 'matching', 2),
        soon('p2-m-d2', 'La caja registradora', 'mini-game', 3),
        liveGame('p2-m-d3', 'Cálculo con euros', 'neon-calculo', 2, 3),
        soon('p2-m-d4', 'Media hora', 'mini-game', 3),
        soon('p2-m-d5', 'Misión del reloj', 'quiz', 4)
      ]),
      unit('p2-m-figuras', 'Polígonos sencillos', 'Lados, vértices y simetría básica.', [
        soon('p2-m-f1', 'Polígonos', 'matching', 2),
        liveReflex('p2-m-f2', 'Atención geométrica', 'flash-tap', 2),
        soon('p2-m-f3', 'Simetría', 'drag-drop', 3),
        soon('p2-m-f4', 'Perímetro con cuadrícula', 'mini-game', 4),
        soon('p2-m-f5', 'Reto figuras', 'quiz', 4)
      ])
    ];
  }

  function primaria2Lengua() {
    return [
      unit('p2-l-lectura', 'Textos breves', 'Personajes, lugar e idea principal.', [
        liveLengua('p2-l-r1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión literal', 4),
        liveLengua('p2-l-r2', 'Ordena sílabas', 'neon-silabas', 2, 'Palabras del cole', 4),
        soon('p2-l-r3', 'Idea principal', 'multiple-choice', 3),
        soon('p2-l-r4', 'Escribe un final', 'typing', 3),
        soon('p2-l-r5', 'Misión lectora', 'quiz', 5)
      ]),
      unit('p2-l-ortografia', 'Ortografía básica', 'ca/co/cu, que/qui, m antes de p/b.', [
        liveLengua('p2-l-o1', 'Completa la palabra', 'neon-palabra', 2, 'Elige la sílaba correcta', 4),
        soon('p2-l-o2', 'Completa con m o n', 'typing', 3),
        soon('p2-l-o3', 'Detecta el error', 'quiz', 3),
        soon('p2-l-o4', 'Dictado corto', 'listening', 4),
        soon('p2-l-o5', 'Reto ortográfico', 'quiz', 5)
      ]),
      unit('p2-l-gramatica', 'Nombre, verbo y adjetivo', 'Primeras categorías gramaticales.', [
        soon('p2-l-g1', '¿Qué es?', 'matching', 2),
        soon('p2-l-g2', 'Sinónimos y antónimos', 'multiple-choice', 2),
        liveLengua('p2-l-g3', 'Ordena la frase', 'neon-frase', 2, 'Orden sintáctico', 4),
        soon('p2-l-g4', 'Subraya el verbo', 'drag-drop', 3),
        soon('p2-l-g5', 'Misión gramatical', 'quiz', 4)
      ])
    ];
  }

  function primaria2Ingles() {
    return [
      unit('p2-i-family', 'Family y body', 'Vocabulario del cuerpo y la familia.', [
        liveIngles('p2-i-f1', 'Family words', 0, 1, 2),
        liveIngles('p2-i-f2', 'Body parts', 1, 2, 2),
        soon('p2-i-f3', 'I have got…', 'typing', 2),
        soon('p2-i-f4', 'Listening family', 'listening', 3),
        soon('p2-i-f5', 'Family quiz', 'quiz', 4)
      ]),
      unit('p2-i-food', 'Food y actions', 'Comida y verbos de acción.', [
        liveIngles('p2-i-o1', 'Food', 0, 1, 2),
        liveIngles('p2-i-o2', 'Actions', 1, 2, 3),
        soon('p2-i-o3', 'I like / don\'t like', 'multiple-choice', 2),
        soon('p2-i-o4', 'Mini diálogo', 'roleplay', 3),
        soon('p2-i-o5', 'Food mission', 'quiz', 4)
      ]),
      unit('p2-i-numbers', 'Numbers 1–50', 'Contar y comparar en inglés.', [
        liveIngles('p2-i-n1', 'Numbers 1–20', 0, 1, 2),
        liveIngles('p2-i-n2', 'Numbers 21–50', 1, 2, 3),
        soon('p2-i-n3', 'Comparatives easy', 'multiple-choice', 3),
        soon('p2-i-n4', 'Listen and write', 'listening', 3),
        soon('p2-i-n5', 'Number boss', 'quiz', 5)
      ])
    ];
  }

  function primaria2Naturales() {
    return [
      unit('p2-n-vida', 'Seres vivos', 'Vertebrados, invertebrados y cuidado del entorno.', [
        liveNaturales('p2-n-v1', 'Vertebrado o invertebrado', 'neon-vida', 2, 'Clasifica', 4),
        liveNaturales('p2-n-v2', 'Preguntas de ciencia', 'neon-cuerpo', 2, 'Lee y responde', 4),
        liveNaturales('p2-n-v3', 'Hábitats', 'neon-vida', 3, 'Clasifica', 4, 'Hábitats', 'matching', 3),
        liveNaturales('p2-n-v4', 'Cuidar el bosque', 'neon-planeta', 3, 'V o F', 4, 'Cuidar el bosque', 'ordering', 3),
        liveNaturales('p2-n-v5', 'Reto ecológico', 'neon-cuerpo', 3, 'Ciencia', 4, 'Reto ecológico', 'quiz', 5)
      ]),
      unit('p2-n-cuerpo', 'Cuerpo y salud', 'Alimentación y hábitos.', [
        liveNaturales('p2-n-c1', 'Cuerpo y salud', 'neon-cuerpo', 1, 'Elige bien', 4),
        liveNaturales('p2-n-c2', 'Verdadero o falso', 'neon-planeta', 2, 'Ciencia', 4),
        liveNaturales('p2-n-c3', 'Plato saludable', 'neon-cuerpo', 2, 'Salud', 4, 'Plato saludable', 'drag-drop', 2),
        liveNaturales('p2-n-c4', 'Ejercicio', 'neon-planeta', 3, 'Cuerpo', 4, 'Ejercicio', 'multiple-choice', 3),
        liveNaturales('p2-n-c5', 'Misión salud', 'neon-vida', 3, 'Hábitos', 4, 'Misión salud', 'quiz', 4)
      ]),
      unit('p2-n-materia', 'Materia y energía', 'Agua, reciclaje y imanes.', [
        liveNaturales('p2-n-m1', 'Clasifica materiales', 'neon-vida', 2, 'Imanes y objetos', 4),
        liveNaturales('p2-n-m2', 'Ciclo del agua', 'neon-cuerpo', 3, 'Comprensión', 4),
        liveNaturales('p2-n-m3', 'Reciclar', 'neon-vida', 2, 'Materiales', 4, 'Reciclar', 'drag-drop', 2),
        liveNaturales('p2-n-m4', 'Experimento virtual', 'neon-planeta', 3, 'Agua', 4, 'Experimento virtual', 'mini-game', 4),
        liveNaturales('p2-n-m5', 'Reto científico', 'neon-cuerpo', 4, 'Lee', 4, 'Reto científico', 'quiz', 5)
      ])
    ];
  }

  function primaria2Sociales() {
    return [
      unit('p2-s-entorno', 'Mi entorno', 'Normas y ayuntamiento.', [
        liveSociales('p2-s-e1', 'Normas de convivencia', 'neon-entorno', 2, 'Elige', 4),
        liveSociales('p2-s-e2', 'Ordena la historia', 'neon-historia', 2, 'Tiempo', 4),
        liveSociales('p2-s-e3', 'Profesiones', 'neon-mapa', 2, 'Lugares y servicios', 4),
        liveSociales('p2-s-e4', 'Carta al ayuntamiento', 'neon-entorno', 3, 'Lee', 5),
        liveSociales('p2-s-e5', 'Misión ciudadana', 'neon-historia', 3, 'Ordena', 5)
      ]),
      unit('p2-s-mapas', 'Mapas y paisaje', 'Europa y relieve.', [
        liveSociales('p2-s-m1', 'Europa y España', 'neon-mapa', 2, 'Mapas', 4),
        liveSociales('p2-s-m2', 'Ríos y montañas', 'neon-entorno', 3, 'Lee y responde', 4),
        liveSociales('p2-s-m3', 'Brújula', 'neon-historia', 2, 'Ordena', 4),
        liveSociales('p2-s-m4', 'Dibuja tu mapa', 'neon-mapa', 3, 'España', 5),
        liveSociales('p2-s-m5', 'Reto mapas', 'neon-entorno', 4, 'Geografía', 5)
      ]),
      unit('p2-s-historia', 'Historia cercana', 'Prehistoria y pueblos antiguos.', [
        liveSociales('p2-s-h1', 'Ordena el relato', 'neon-historia', 2, 'Fenicios', 4),
        liveSociales('p2-s-h2', 'Preguntas históricas', 'neon-entorno', 2, 'Lee', 4),
        liveSociales('p2-s-h3', 'Prehistoria', 'neon-mapa', 3, 'Civilizaciones', 4),
        liveSociales('p2-s-h4', 'Línea del tiempo', 'neon-historia', 3, 'Historia', 5),
        liveSociales('p2-s-h5', 'Misión histórica', 'neon-entorno', 4, 'Preguntas', 5)
      ])
    ];
  }

  function primaria2Daily() {
    return primaria1Daily().map(function (u) {
      return unit(
        u.id.replace('p1-', 'p2-'),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = a.id.replace('p1-', 'p2-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 1);
          return copy;
        })
      );
    });
  }

  /** —— 3º Primaria —— */
  function primaria3Math() {
    return [
      unit('p3-m-mult', 'Multiplicación con llevadas', 'Tablas y productos.', [
        liveGame('p3-m-m1', 'Tablas 2–5', 'tablas-relampago', 1, 3),
        liveMates('p3-m-m2', 'Mental × tablas', 1, 2, 4),
        liveGame('p3-m-m3', 'Mix tablas', 'tablas-relampago', 3, 4),
        liveMates('p3-m-m4', 'Cálculo avanzado', 3, 3, 4),
        soon('p3-m-m5', 'Problemas de grupos', 'quiz', 5)
      ]),
      unit('p3-m-div', 'División sencilla', 'Repartir y agrupar.', [
        liveGame('p3-m-d1', 'Tablas para dividir', 'tablas-relampago', 1, 3),
        liveMates('p3-m-d2', 'Reparto mental', 2, 2, 3),
        liveMates('p3-m-d3', 'Operaciones mixtas', 0, 3, 4),
        soon('p3-m-d4', 'Problemas dos pasos', 'multiple-choice', 4),
        soon('p3-m-d5', 'Misión división', 'quiz', 5)
      ]),
      unit('p3-m-frac', 'Fracciones básicas', 'Medios, tercios y cuartos.', [
        soon('p3-m-f1', 'Mitad y doble', 'matching', 2),
        soon('p3-m-f2', 'Colorea la fracción', 'drag-drop', 2),
        liveGame('p3-m-f3', 'Cálculo con fracciones', 'neon-calculo', 2, 4),
        soon('p3-m-f4', 'Compara fracciones', 'multiple-choice', 3),
        soon('p3-m-f5', 'Reto pizza', 'mini-game', 5)
      ]),
      unit('p3-m-medidas', 'Medidas y perímetro', 'Longitud y contorno.', [
        soon('p3-m-e1', 'Centímetros', 'mini-game', 2),
        liveGame('p3-m-e2', 'Cálculo de medidas', 'neon-calculo', 2, 4),
        soon('p3-m-e3', 'Perímetro en cuadrícula', 'drag-drop', 3),
        soon('p3-m-e4', 'Conversión simple', 'multiple-choice', 4),
        soon('p3-m-e5', 'Misión metro', 'quiz', 5)
      ]),
      unit('p3-m-problemas', 'Problemas de dos pasos', 'Planificar antes de calcular.', [
        liveMates('p3-m-p1', 'Calentamiento', 0, 1, 3),
        liveMates('p3-m-p2', 'Dos operaciones', 1, 3, 4),
        liveGame('p3-m-p3', 'Tablas en problemas', 'tablas-relampago', 2, 4),
        soon('p3-m-p4', 'Elige el plan', 'multiple-choice', 4),
        soon('p3-m-p5', 'Misión detective', 'quiz', 5)
      ])
    ];
  }

  function primaria3Lengua() {
    return [
      unit('p3-l-textos', 'Narrativos e informativos', 'Comprender y resumir.', [
        liveLengua('p3-l-t1', 'Cuento o noticia', 'neon-lectura', 2, 'Comprensión', 8),
        liveLengua('p3-l-t2', 'Ordena la frase', 'neon-frase', 3, 'Sintaxis', 8),
        soon('p3-l-t3', 'Descripción', 'typing', 3),
        soon('p3-l-t4', 'Carta corta', 'typing', 3),
        soon('p3-l-t5', 'Misión redactor', 'quiz', 5)
      ]),
      unit('p3-l-ortografia', 'b/v, g/j, r/rr', 'Reglas frecuentes en 3º.', [
        liveLenguaRot('p3-l-o1', 'Completa la palabra', 2, 2, 'Sílabas trabadas', 8),
        liveLenguaRot('p3-l-o2', 'Ordena sílabas', 1, 3, 'Palabras largas', 8),
        liveLenguaRot('p3-l-o3', 'Lee y corrige', 0, 3, 'Comprensión', 8),
        soon('p3-l-o4', 'Dictado', 'listening', 4),
        soon('p3-l-o5', 'Reto ortografía', 'quiz', 5)
      ]),
      unit('p3-l-literatura', 'Cuento, poesía y fábula', 'Géneros literarios básicos.', [
        soon('p3-l-i1', '¿Qué género es?', 'matching', 2),
        soon('p3-l-i2', 'Rima en poesía', 'listening', 2),
        liveLengua('p3-l-i3', 'Moral de la fábula', 'neon-lectura', 3, 'Lee y responde', 8),
        soon('p3-l-i4', 'Ordena el cuento', 'ordering', 3),
        soon('p3-l-i5', 'Misión literaria', 'quiz', 4)
      ])
    ];
  }

  function primaria3Ingles() {
    return [
      unit('p3-i-present', 'Present simple', 'Rutinas y hechos.', [
        liveIngles('p3-i-p1', 'Daily routines', 0, 1, 3),
        liveIngles('p3-i-p2', 'School words', 1, 2, 3),
        soon('p3-i-p3', 'Fill the gap', 'typing', 3),
        soon('p3-i-p4', 'Listening routines', 'listening', 3),
        soon('p3-i-p5', 'Grammar quiz', 'quiz', 5)
      ]),
      unit('p3-i-can', 'Can / can\'t y there is/are', 'Habilidad y descripción.', [
        liveIngles('p3-i-c1', 'Places vocab', 0, 2, 3),
        liveIngles('p3-i-c2', 'Listen & tap', 1, 2, 3),
        soon('p3-i-c3', 'There is / are', 'multiple-choice', 3),
        soon('p3-i-c4', 'Describe a room', 'typing', 3),
        soon('p3-i-c5', 'City mission', 'quiz', 4)
      ]),
      unit('p3-i-listen', 'Listening instrucciones', 'Seguir órdenes en inglés.', [
        liveReflex('p3-i-l1', 'Listen & tap', 'flash-tap', 1),
        liveIngles('p3-i-l2', 'School objects', 0, 2, 3),
        soon('p3-i-l3', 'Follow directions', 'listening', 3),
        soon('p3-i-l4', 'Classroom game', 'mini-game', 3),
        soon('p3-i-l5', 'Listening test', 'quiz', 5)
      ])
    ];
  }

  function primaria3Naturales() {
    return [
      unit('p3-n-vida', 'Seres vivos', 'Ecosistemas y cadenas alimenticias.', [
        liveNaturalesRot('p3-n-v1', 'Ecosistema', 1, 2, 'Comprensión', 8),
        liveNaturalesRot('p3-n-v2', 'Clasifica', 0, 3, 'Seres vivos', 8),
        liveNaturalesRot('p3-n-v3', 'Cadena alimenticia', 0, 3, 'Clasifica', 8),
        liveNaturalesRot('p3-n-v4', 'Adaptaciones', 2, 3, 'Verdadero o falso', 8),
        liveNaturalesRot('p3-n-v5', 'Reto biología', 2, 4, 'Ciencia', 9)
      ]),
      unit('p3-n-cuerpo', 'Cuerpo y salud', 'Sistemas del cuerpo humano.', [
        liveNaturalesRot('p3-n-c1', 'Cuerpo humano', 1, 2, 'Preguntas', 8),
        liveNaturalesRot('p3-n-c2', 'Verdadero o falso', 2, 2, 'Ciencia', 8),
        liveNaturalesRot('p3-n-c3', 'Sistema digestivo', 1, 3, 'Cuerpo', 8),
        liveNaturalesRot('p3-n-c4', 'Hábitos sanos', 2, 2, 'Salud', 8),
        liveNaturalesRot('p3-n-c5', 'Misión salud', 0, 4, 'Clasifica', 9)
      ]),
      unit('p3-n-materia', 'Materia y energía', 'Estados, electricidad y fósiles.', [
        liveNaturalesRot('p3-n-m1', 'Estados del agua', 2, 2, 'V o F', 8),
        liveNaturalesRot('p3-n-m2', 'Plantas y oxígeno', 1, 3, 'Lee', 8),
        liveNaturalesRot('p3-n-m3', 'Materia y energía', 0, 3, 'Clasifica', 8),
        liveNaturalesRot('p3-n-m4', 'Energías', 2, 3, 'Verdadero o falso', 8),
        liveNaturalesRot('p3-n-m5', 'Reto física', 1, 4, 'Ciencia', 9)
      ])
    ];
  }

  function primaria3Sociales() {
    return [
      unit('p3-s-entorno', 'Mi entorno', 'Constitución y derechos.', [
        liveSocialesRot('p3-s-e1', 'Constitución', 1, 2, 'Lee', 8),
        liveSocialesRot('p3-s-e2', 'Ordena el texto', 2, 2, 'Historia', 8),
        liveSocialesRot('p3-s-e3', 'Derechos', 0, 3, 'Mapas y leyes', 8),
        liveSocialesRot('p3-s-e4', 'Debate corto', 1, 3, 'Convivencia', 8),
        liveSocialesRot('p3-s-e5', 'Misión ciudadana', 2, 4, 'Ordena', 9)
      ]),
      unit('p3-s-mapas', 'Mapas y paisaje', 'Península y clima.', [
        liveSocialesRot('p3-s-m1', 'Península Ibérica', 0, 2, 'Mapas', 8),
        liveSocialesRot('p3-s-m2', 'Clima y relieve', 1, 3, 'Lee y responde', 8),
        liveSocialesRot('p3-s-m3', 'Climas de España', 2, 3, 'Ordena', 8),
        liveSocialesRot('p3-s-m4', 'Escala del mapa', 0, 4, 'Geografía', 9),
        liveSocialesRot('p3-s-m5', 'Reto mapas', 1, 4, 'España', 9)
      ]),
      unit('p3-s-historia', 'Historia cercana', 'Edad Media y Roma.', [
        liveSocialesRot('p3-s-h1', 'Ordena: Roma', 2, 2, 'Palabras', 8),
        liveSocialesRot('p3-s-h2', 'Edad Media', 1, 3, 'Preguntas', 8),
        liveSocialesRot('p3-s-h3', 'Castillos', 0, 3, 'Mapas', 8),
        liveSocialesRot('p3-s-h4', 'Línea del tiempo', 2, 4, 'Ordena', 9),
        liveSocialesRot('p3-s-h5', 'Misión histórica', 1, 4, 'Historia', 9)
      ])
    ];
  }

  function primaria3Daily() {
    return primaria1Daily().map(function (u) {
      return unit(
        u.id.replace('p1-', 'p3-'),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = a.id.replace('p1-', 'p3-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 2);
          return copy;
        })
      );
    });
  }

  function stubUnits(subjectId, titles) {
    return titles.map(function (t, i) {
      return unit(
        subjectId + '-u' + (i + 1),
        t.title,
        t.desc,
        [1, 2, 3, 4, 5].map(function (d) {
          return soon(subjectId + '-u' + (i + 1) + '-a' + d, t.title + ' · actividad ' + d, 'quiz', d);
        })
      );
    });
  }

  function course(id, label, shortLabel, ageRange, stage, ageBand, status, subjectBlocks) {
    return {
      id: id,
      label: label,
      shortLabel: shortLabel,
      ageRange: ageRange,
      stage: stage,
      ageBand: ageBand,
      status: status,
      subjects: subjectBlocks
    };
  }

  function primariaCourse(n, ageRange, ageBand, mathFn, lenguaFn, inglesFn, dailyFn, courseStatus, naturalesFn, socialesFn) {
    var sid = 'primaria-' + n;
    var subStatus = courseStatus === 'live' ? 'live' : 'partial';
    return course(
      sid,
      n + 'º Primaria',
      n + 'º',
      ageRange,
      'primaria',
      ageBand,
      courseStatus || 'live',
      [
        subject('matematicas', mathFn(), subStatus),
        subject('lenguaje', lenguaFn(), subStatus),
        subject('ingles', inglesFn(), subStatus),
        subject(
          'naturales',
          naturalesFn
            ? naturalesFn()
            : stubUnits(sid + '-n', [
                { title: 'Seres vivos', desc: 'Animales y plantas cercanos.' },
                { title: 'Cuerpo y salud', desc: 'Hábitos y sentidos.' },
                { title: 'Materia y energía', desc: 'Introducción a experimentos.' }
              ]),
          subStatus
        ),
        subject(
          'sociales',
          socialesFn
            ? socialesFn()
            : stubUnits(sid + '-s', [
                { title: 'Mi entorno', desc: 'Familia, colegio y localidad.' },
                { title: 'Mapas y paisaje', desc: 'Orientación espacial.' },
                { title: 'Historia cercana', desc: 'Tiempo y cambios.' }
              ]),
          subStatus
        ),
        subject('brain-gym-diario', dailyFn(), subStatus)
      ]
    );
  }

  function infantilCourse(years, label, ageRange, tier, courseStatus) {
    var id = 'infantil-' + years;
    return course(
      id,
      label,
      years + ' años',
      ageRange,
      'infantil',
      '3-5',
      courseStatus || 'live',
      infantilSubjects(id, tier == null ? 1 : tier)
    );
  }

  function eso1Math() {
    return remapUnits(primaria6Math(), 'eso1-m', 'p6-m-', 'eso1-m-', 1);
  }

  function eso1Ingles() {
    return remapUnits(primaria6Ingles(), 'eso1-i', 'p6-i-', 'eso1-i-', 1);
  }

  function eso1Lengua() {
    return remapUnits(primaria6Lengua(), 'eso1-l', 'p6-l-', 'eso1-l-', 1);
  }

  function eso1Naturales() {
    return primaria3Naturales().map(function (u, i) {
      return unit(
        'eso1-n-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p3-/, 'eso1-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 2);
          return copy;
        })
      );
    });
  }

  function eso1Sociales() {
    return primaria3Sociales().map(function (u, i) {
      return unit(
        'eso1-s-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = (a.id || '').replace(/^p3-/, 'eso1-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + 2);
          return copy;
        })
      );
    });
  }

  function eso1Daily() {
    return [
      unit('eso1-d-rutina', 'Brain Gym diario', 'Mates, idiomas y reflejos para ESO.', [
        liveGame('eso1-d1', 'Cálculo express', 'neon-calculo', 2, 9),
        liveGame('eso1-d2', 'Tablas flash', 'tablas-relampago', 2, 9),
        liveGame('eso1-d3', 'English drill', 'neon-palabras', 2, 9),
        liveReflex('eso1-d4', 'Test reflejos', 'reaction-test', 2),
        liveReflex('eso1-d5', 'Aim trainer', 'aim-trainer', 3)
      ])
    ];
  }

  function remapUnits(units, unitIdPrefix, actFrom, actTo, brainBonus) {
    return units.map(function (u, i) {
      return unit(
        unitIdPrefix + '-u' + (i + 1),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          var k;
          for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          if (copy.id && actFrom && actTo) {
            copy.id = copy.id.replace(new RegExp('^' + actFrom), actTo);
          }
          if (copy.brainLevel && brainBonus) {
            copy.brainLevel = Math.min(12, copy.brainLevel + brainBonus);
          }
          return copy;
        })
      );
    });
  }

  function primaria4Lengua() {
    return remapUnits(primaria3Lengua(), 'p4-l', 'p3-', 'p4-', 1);
  }

  function primaria5Lengua() {
    return remapUnits(primaria3Lengua(), 'p5-l', 'p3-', 'p5-', 2);
  }

  function primaria6Lengua() {
    return remapUnits(primaria3Lengua(), 'p6-l', 'p3-', 'p6-', 3);
  }

  function primaria4Ingles() {
    return remapUnits(primaria3Ingles(), 'p4-i', 'p3-', 'p4-', 1);
  }

  function primaria5Ingles() {
    return remapUnits(primaria3Ingles(), 'p5-i', 'p3-', 'p5-', 2);
  }

  function primaria6Ingles() {
    return remapUnits(primaria3Ingles(), 'p6-i', 'p3-', 'p6-', 3);
  }

  function primaria4Math() {
    return remapUnits(primaria3Math(), 'p4-m', 'p3-', 'p4-', 1);
  }

  function primaria5Math() {
    return remapUnits(primaria3Math(), 'p5-m', 'p3-', 'p5-', 2);
  }

  function primaria6Math() {
    return remapUnits(primaria3Math(), 'p6-m', 'p3-', 'p6-', 3);
  }

  function primaria4Daily() {
    return remapUnits(primaria3Daily(), 'p4-d', 'p3-', 'p4-', 1);
  }

  function primaria5Daily() {
    return remapUnits(primaria3Daily(), 'p5-d', 'p3-', 'p5-', 2);
  }

  function primaria6Daily() {
    return remapUnits(primaria3Daily(), 'p6-d', 'p3-', 'p6-', 3);
  }

  function eso2Math() {
    return remapUnits(primaria6Math(), 'eso2-m', 'p6-m-', 'eso2-m-', 2);
  }

  function eso2Ingles() {
    return remapUnits(primaria6Ingles(), 'eso2-i', 'p6-i-', 'eso2-i-', 2);
  }

  function eso2Lengua() {
    return remapUnits(primaria6Lengua(), 'eso2-l', 'p6-l-', 'eso2-l-', 2);
  }

  function eso2Naturales() {
    return remapUnits(eso1Naturales(), 'eso2-n', 'eso1-', 'eso2-', 1);
  }

  function eso2Sociales() {
    return remapUnits(eso1Sociales(), 'eso2-s', 'eso1-', 'eso2-', 1);
  }

  function eso2Daily() {
    return [
      unit('eso2-d-rutina', 'Brain Gym diario', 'Rutina ESO 2º.', [
        liveGame('eso2-d1', 'Cálculo', 'neon-calculo', 3, 10),
        liveGame('eso2-d2', 'Tablas', 'tablas-relampago', 3, 10),
        liveGame('eso2-d3', 'English', 'neon-palabras', 3, 10),
        liveReflex('eso2-d4', 'Aim trainer', 'aim-trainer', 2),
        liveReflex('eso2-d5', 'Esquiva neon', 'esquiva-neon', 3)
      ])
    ];
  }

  function esoCourse(n, label, ageRange, mathFn, lenguaFn, inglesFn, dailyFn, naturalesFn, socialesFn, courseStatus) {
    var id = 'eso-' + n;
    var subStatus = courseStatus === 'live' ? 'live' : 'partial';
    return course(
      id,
      label,
      n + 'º',
      ageRange,
      'eso',
      '13-17',
      courseStatus || 'live',
      [
        subject('matematicas', mathFn(), subStatus),
        subject('lenguaje', lenguaFn(), subStatus),
        subject('ingles', inglesFn(), subStatus),
        subject('naturales', naturalesFn ? naturalesFn() : stubUnits(id + '-n', [{ title: 'Ciencias', desc: 'Biología y geología.' }]), subStatus),
        subject('sociales', socialesFn ? socialesFn() : stubUnits(id + '-s', [{ title: 'Historia', desc: 'Civilizaciones.' }]), subStatus),
        subject('brain-gym-diario', dailyFn(), subStatus)
      ]
    );
  }

  function gameForSoonBase(subjectId, type, course) {
    var infantil = course.stage === 'infantil';
    var byType = {
      ordering: subjectId === 'matematicas' ? 'neon-ordenar' : (infantil ? 'neon-peques' : 'neon-frase'),
      matching: subjectId === 'matematicas' || subjectId === 'naturales' || subjectId === 'sociales'
        ? 'neon-clasifica'
        : (infantil ? 'neon-peques' : 'neon-silabas'),
      'multiple-choice': subjectId === 'matematicas' ? 'neon-mayor-menor' : (infantil ? 'neon-peques' : 'neon-lectura'),
      quiz: infantil ? 'neon-numeros' : (subjectId === 'ingles' ? 'neon-palabras' : 'neon-calculo'),
      listening: 'neon-palabras',
      'drag-drop': infantil ? 'neon-colores' : 'neon-vida',
      'mini-game': 'flash-tap',
      reading: infantil ? 'neon-peques' : 'neon-lectura',
      typing: infantil ? 'neon-peques' : 'neon-palabra',
      memory: 'neon-palabras',
      roleplay: 'neon-palabras',
      drawing: 'neon-mapa'
    };
    var bySubject = {
      matematicas: 'neon-calculo',
      lenguaje: infantil ? 'neon-peques' : 'neon-lectura',
      ingles: 'neon-palabras',
      naturales: infantil ? 'neon-colores' : 'neon-vida',
      sociales: infantil ? 'neon-peques' : 'neon-entorno',
      'brain-gym-diario': 'flash-tap'
    };
    return byType[type] || bySubject[subjectId] || 'neon-calculo';
  }

  function gamesPoolFor(subjectId, type, course) {
    if (type === 'mini-game') return ['flash-tap'];
    var infantil = course.stage === 'infantil';
    var base = gameForSoonBase(subjectId, type, course);
    var extras = [];
    if (infantil) {
      extras = subjectId === 'ingles' ? ROT_INFANTIL_EN : ROT_INFANTIL;
    } else if (subjectId === 'naturales') {
      extras = ROT_NATURALES;
    } else if (subjectId === 'sociales') {
      extras = ROT_SOCIALES;
    } else if (subjectId === 'matematicas') {
      extras = ROT_MATES;
    } else if (subjectId === 'lenguaje') {
      extras = ROT_LENGUA;
    } else if (subjectId === 'ingles') {
      extras = ROT_INGLES.concat(['neon-ordenar']);
    } else if (subjectId === 'brain-gym-diario') {
      extras = ['flash-tap', 'reaction-test', 'grid-reflex'];
    }
    var pool = [base];
    extras.forEach(function (g) {
      if (pool.indexOf(g) < 0) pool.push(g);
    });
    return pool;
  }

  function gameForSoon(subjectId, type, course, slotIndex) {
    if (type === 'mini-game') return 'flash-tap';
    var base = gameForSoonBase(subjectId, type, course);
    var pool = gamesPoolFor(subjectId, type, course);
    var alts = pool.filter(function (g) {
      return g !== base;
    });
    var i = typeof slotIndex === 'number' ? slotIndex : 0;
    if (i === 0 || !alts.length) return base;
    return alts[(i - 1) % alts.length];
  }

  function promoteSoonActivities(courses) {
    courses.forEach(function (course) {
            var full = course.stage === 'infantil' || /^primaria-[1-6]$/.test(course.id) || /^eso-[12]$/.test(course.id);
      course.subjects.forEach(function (block) {
        block.units.forEach(function (unit) {
          var soonIdx = 0;
          unit.activities.forEach(function (act) {
            if (act.status !== 'soon') return;
            var cap = full ? 99 : (course.stage === 'eso' ? 2 : 4);
            var limited = soonIdx >= cap;
            if (limited) return;
            var gameId = gameForSoon(block.subjectId, act.type, course, soonIdx);
            soonIdx++;
            var diff = act.difficulty || 1;
            act.status = 'live';
            act.type = 'mini-game';
            act.gameId = gameId;
            delete act.url;
            act.brainLevel = Math.min(12, diff + (course.stage === 'eso' ? 6 : course.stage === 'primaria' ? 1 : 0));
            act.estimatedMinutes = diff <= 2 ? 2 : 3;
            act.rewardXp = 10 + diff * 8;
            if (!act.tip) act.tip = 'Practica con el juego «' + act.title + '»';
          });
        });
      });
    });
    return courses;
  }

  function buildAllCourses() {
    return promoteSoonActivities([
      infantilCourse(3, '1º Infantil', '3 años', 0, 'live'),
      infantilCourse(4, '2º Infantil', '4 años', 1, 'live'),
      infantilCourse(5, '3º Infantil', '5 años', 2, 'live'),
      primariaCourse(1, '6 años', '6-9', primaria1Math, primaria1Lengua, primaria1Ingles, primaria1Daily, 'live', primaria1Naturales, primaria1Sociales),
      primariaCourse(2, '7 años', '6-9', primaria2Math, primaria2Lengua, primaria2Ingles, primaria2Daily, 'live', primaria2Naturales, primaria2Sociales),
      primariaCourse(3, '8 años', '6-9', primaria3Math, primaria3Lengua, primaria3Ingles, primaria3Daily, 'live', primaria3Naturales, primaria3Sociales),
      primariaCourse(4, '9 años', '10-12', primaria4Math, primaria4Lengua, primaria4Ingles, primaria4Daily, 'live', primaria4Naturales, primaria4Sociales),
      primariaCourse(5, '10 años', '10-12', primaria5Math, primaria5Lengua, primaria5Ingles, primaria5Daily, 'live', primaria5Naturales, primaria5Sociales),
      primariaCourse(6, '11 años', '10-12', primaria6Math, primaria6Lengua, primaria6Ingles, primaria6Daily, 'live', primaria6Naturales, primaria6Sociales),
      esoCourse(1, '1º ESO', '12 años', eso1Math, eso1Lengua, eso1Ingles, eso1Daily, eso1Naturales, eso1Sociales, 'live'),
      esoCourse(2, '2º ESO', '13 años', eso2Math, eso2Lengua, eso2Ingles, eso2Daily, eso2Naturales, eso2Sociales, 'live'),
    ]);
  }

  global.LipaCurriculumBuild = {
    buildAllCourses: buildAllCourses,
    liveGame: liveGame,
    soon: soon,
    unit: unit
  };
})(typeof window !== 'undefined' ? window : global);
