/**
 * Generadores de unidades y actividades curriculares
 */
(function (global) {
  'use strict';

  function liveGame(id, title, gameId, difficulty, brainLevel, tip, saberIds) {
    var a = {
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
    if (saberIds) a.saberIds = Array.isArray(saberIds) ? saberIds : [saberIds];
    return a;
  }

  function liveReflex(id, title, gameId, difficulty) {
    return liveGame(id, title, gameId, difficulty, null, 'Reflejos y atención');
  }

  function liveLengua(id, title, gameId, difficulty, tip, brainLevel, saberIds) {
    var a = {
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
    if (saberIds) a.saberIds = Array.isArray(saberIds) ? saberIds : [saberIds];
    return a;
  }

  function liveNaturales(id, title, gameId, difficulty, tip, brainLevel, saberIds) {
    var a = liveLengua(id, title, gameId, difficulty, tip, brainLevel, saberIds);
    a.tip = tip || 'Naturales';
    return a;
  }

  function liveSociales(id, title, gameId, difficulty, tip, brainLevel, saberIds) {
    var a = liveLengua(id, title, gameId, difficulty, tip, brainLevel, saberIds);
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

  function tagSaber(act, saberIds) {
    if (!act || !saberIds) return act;
    var ids = Array.isArray(saberIds) ? saberIds : [saberIds];
    act.saberIds = (act.saberIds || []).concat(ids);
    return act;
  }

  function infantilSaberPrefix(tier) {
    return tier === 0 ? 'i3' : tier === 1 ? 'i4' : 'i5';
  }

  function liveMates(id, title, slot, difficulty, brainLevel, tip, saberIds) {
    return liveGame(id, title, rot(ROT_MATES, slot), difficulty, brainLevel, tip, saberIds);
  }

  function liveIngles(id, title, slot, difficulty, brainLevel, tip, saberIds) {
    return liveGame(id, title, rot(ROT_INGLES, slot), difficulty, brainLevel, tip || 'Inglés', saberIds);
  }

  function rot(pool, slot) {
    return pool[((slot % pool.length) + pool.length) % pool.length];
  }

  function liveInfantil(id, title, slot, difficulty, tip, brainLevel) {
    return livePeques(id, title, rot(ROT_INFANTIL, slot), difficulty, tip, brainLevel);
  }

  function wrapInfantil(id, title, slot, difficulty, tip, brainLevel, saberIds) {
    return tagSaber(liveInfantil(id, title, slot, difficulty, tip, brainLevel), saberIds);
  }

  function liveLenguaRot(id, title, slot, difficulty, tip, brainLevel, saberIds) {
    return liveLengua(id, title, rot(ROT_LENGUA, slot), difficulty, tip, brainLevel, saberIds);
  }

  function liveNaturalesRot(id, title, slot, difficulty, tip, brainLevel, saberIds) {
    return liveNaturales(id, title, rot(ROT_NATURALES, slot), difficulty, tip, brainLevel, saberIds);
  }

  function liveSocialesRot(id, title, slot, difficulty, tip, brainLevel, saberIds) {
    return liveSociales(id, title, rot(ROT_SOCIALES, slot), difficulty, tip, brainLevel, saberIds);
  }

  function mapDailyFromP1(prefix, brainBonus) {
    brainBonus = brainBonus || 1;
    return primaria1Daily().map(function (u) {
      var unitSkills = (u.skills || []).map(function (sid) {
        return sid.replace(/^p1-/, prefix + '-');
      });
      return unit(
        u.id.replace(/^p1-/, prefix + '-'),
        u.title,
        u.description,
        u.activities.map(function (a) {
          var copy = {};
          for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
          copy.id = a.id.replace(/^p1-/, prefix + '-');
          if (copy.brainLevel) copy.brainLevel = Math.min(12, copy.brainLevel + brainBonus);
          if (copy.saberIds) {
            copy.saberIds = copy.saberIds.map(function (sid) {
              return sid.replace(/^p1-/, prefix + '-');
            });
          }
          return copy;
        }),
        { saberIds: unitSkills }
      );
    });
  }

  function infSid(tier, subLetter, num) {
    var n = num < 10 ? '0' + num : String(num);
    return infantilSaberPrefix(tier) + '-' + subLetter + '-' + n;
  }

  function infantilSubjects(id, tier) {
    tier = tier == null ? 1 : tier;
    var bl = tier === 0 ? 1 : tier === 1 ? 3 : 5;
    var extraLive = tier >= 1;
    var countTip = tier === 0 ? 'hasta 3' : tier === 1 ? 'hasta 5' : 'hasta 10';
    return [
      subject('matematicas', [
        unit(id + '-m-colores', 'Cantidad, color y forma', 'LOMLOE · dimensión lógico-matemática.', [
          wrapInfantil(id + '-m-c1', '¿Qué color?', 0, 1, 'Toca el color', bl, infSid(tier, 'm', 2)),
          wrapInfantil(id + '-m-c2', '¿Cuántos hay?', 1, 1, 'Cuenta ' + countTip, bl, infSid(tier, 'm', 1)),
          extraLive ? wrapInfantil(id + '-m-c3', 'Toca rápido', 3, 2, 'Atención', bl, infSid(tier, 'l', 3)) : soon(id + '-m-c3', 'Grande o pequeño', 'multiple-choice', 2),
          soon(id + '-m-c4', 'Formas', 'matching', 2),
          soon(id + '-m-c5', 'Reto visual', 'quiz', 3)
        ], { saberIds: [infSid(tier, 'm', 1), infSid(tier, 'm', 2), infSid(tier, 'm', 3)] }),
        unit(id + '-m-formas', 'Clasificar y reconocer', 'Agrupar por color, forma o tamaño.', [
          wrapInfantil(id + '-m-f1', '¿Qué forma es?', 0, 1, 'Círculo, cuadrado…', bl, infSid(tier, 'm', 3)),
          tagSaber(wrapInfantil(id + '-m-f2', 'Colores mix', 0, 2, 'Repaso', bl, infSid(tier, 'm', 2)), infSid(tier, 'm', 4)),
          extraLive ? wrapInfantil(id + '-m-f3', 'Cuenta y toca', 1, 2, 'Números', bl, infSid(tier, 'm', 1)) : soon(id + '-m-f3', 'Igual o diferente', 'matching', 2),
          soon(id + '-m-f4', 'Seriaciones', 'ordering', 3),
          soon(id + '-m-f5', 'Misión formas', 'quiz', 4)
        ], { saberIds: [infSid(tier, 'm', 3), infSid(tier, 'm', 4)] })
      ], 'live'),
      subject('lenguaje', [
        unit(id + '-l-vocab', 'Vocabulario y comprensión', 'LOMLOE · comunicación y representación.', [
          wrapInfantil(id + '-l-v1', 'Nombres', 0, 1, 'Toca la palabra', bl, infSid(tier, 'l', 1)),
          wrapInfantil(id + '-l-v2', '¿Qué es esto?', 1, 2, 'Imagen y palabra', bl, infSid(tier, 'l', 1)),
          extraLive ? tagSaber(wrapInfantil(id + '-l-v3', 'Colores y palabras', 0, 2, 'Repaso', bl, infSid(tier, 'l', 1)), infSid(tier, 'l', 2)) : soon(id + '-l-v3', 'Rimas', 'listening', 2),
          soon(id + '-l-v4', 'Sonidos iniciales', 'matching', 3),
          soon(id + '-l-v5', 'Cuento corto', 'reading', 4)
        ], { saberIds: [infSid(tier, 'l', 1), infSid(tier, 'l', 2)] }),
        unit(id + '-l-sonidos', 'Atención y lenguaje', 'Discriminación visual y auditiva suave.', [
          wrapInfantil(id + '-l-s1', 'Palabras', 2, 1, 'Escucha con los ojos', bl, infSid(tier, 'l', 3)),
          extraLive ? wrapInfantil(id + '-l-s2', 'Cuenta sonidos', 1, 2, 'Atención', bl, infSid(tier, 'l', 3)) : soon(id + '-l-s2', 'Sílabas con palmas', 'listening', 2),
          soon(id + '-l-s3', 'Empieza por…', 'multiple-choice', 2),
          soon(id + '-l-s4', 'Canción', 'listening', 3),
          soon(id + '-l-s5', 'Reto sonidos', 'quiz', 4)
        ], { saberIds: [infSid(tier, 'l', 3)] })
      ], 'live'),
      subject('ingles', [
        unit(id + '-i-hola', 'Hello — primeras palabras', 'Comprensión oral inicial de vocabulario.', [
          wrapInfantil(id + '-i-h1', 'Animals EN', 0, 1, 'Dog, cat…', bl, infSid(tier, 'i', 1)),
          wrapInfantil(id + '-i-h2', 'Colours EN', 1, 2, 'Red, blue…', bl, infSid(tier, 'i', 1)),
          extraLive ? tagSaber(liveReflex(id + '-i-h3', 'Point and tap', 'flash-tap', 2), infSid(tier, 'i', 2)) : soon(id + '-i-h3', 'Hello song', 'listening', 2),
          soon(id + '-i-h4', 'Point and say', 'mini-game', 3),
          soon(id + '-i-h5', 'Mini quiz', 'quiz', 4)
        ], { saberIds: [infSid(tier, 'i', 1), infSid(tier, 'i', 2)] }),
        unit(id + '-i-play', 'Body and actions', 'Órdenes sencillas en inglés con apoyo visual.', [
          wrapInfantil(id + '-i-p1', 'Body EN', 2, 1, 'Head, hand…', bl, infSid(tier, 'i', 1)),
          wrapInfantil(id + '-i-p2', 'Actions EN', 0, 2, 'Jump, clap…', bl, infSid(tier, 'i', 2)),
          extraLive ? wrapInfantil(id + '-i-p3', 'Listen & tap', 1, 2, 'Inglés oral', bl, infSid(tier, 'i', 2)) : soon(id + '-i-p3', 'I like…', 'typing', 2),
          soon(id + '-i-p4', 'Picture match', 'matching', 3),
          soon(id + '-i-p5', 'English mission', 'quiz', 4)
        ], { saberIds: [infSid(tier, 'i', 1), infSid(tier, 'i', 2)] })
      ], 'live'),
      subject('naturales', [
        unit(id + '-n-animales', 'Seres vivos', 'Explorar plantas, animales y el entorno.', [
          wrapInfantil(id + '-n-a1', 'Animal o cosa', 0, 1, 'Seres vivos', bl, infSid(tier, 'n', 1)),
          wrapInfantil(id + '-n-a2', 'Colores naturaleza', 1, 2, 'Planta, sol…', bl, infSid(tier, 'n', 3)),
          extraLive ? wrapInfantil(id + '-n-a3', '¿Cuántos?', 2, 2, 'Contar', bl, infSid(tier, 'n', 1)) : soon(id + '-n-a3', 'Partes de la planta', 'matching', 2),
          soon(id + '-n-a4', 'Estaciones', 'ordering', 3),
          soon(id + '-n-a5', 'Reto naturaleza', 'quiz', 4)
        ], { saberIds: [infSid(tier, 'n', 1), infSid(tier, 'n', 3)] }),
        unit(id + '-n-cuerpo', 'Cuerpo y clima', 'Cuerpo, sentidos y fenómenos simples.', [
          wrapInfantil(id + '-n-c1', 'Partes del cuerpo', 0, 1, 'Cabeza, pies…', bl, infSid(tier, 'n', 2)),
          wrapInfantil(id + '-n-c2', 'Sol y lluvia', 1, 2, 'Clima', bl, infSid(tier, 'n', 3)),
          extraLive ? wrapInfantil(id + '-n-c3', 'Fruta sana', 2, 2, 'Alimentación', bl, infSid(tier, 'n', 2)) : soon(id + '-n-c3', 'Día y noche', 'ordering', 2),
          soon(id + '-n-c4', 'Animales del bosque', 'matching', 3),
          soon(id + '-n-c5', 'Misión naturaleza', 'quiz', 4)
        ], { saberIds: [infSid(tier, 'n', 2), infSid(tier, 'n', 3)] })
      ], 'live'),
      subject('sociales', [
        unit(id + '-s-emos', 'Emociones y convivencia', 'Familia, emociones y normas del aula.', [
          wrapInfantil(id + '-s-e1', 'Familia', 0, 1, 'Mamá, papá…', bl, infSid(tier, 's', 1)),
          wrapInfantil(id + '-s-e2', 'En el cole', 1, 2, 'Colegio, amigos', bl, infSid(tier, 's', 2)),
          extraLive ? wrapInfantil(id + '-s-e3', 'Turnos y colores', 2, 2, 'Convivencia', bl, infSid(tier, 's', 2)) : soon(id + '-s-e3', 'Caras felices', 'matching', 2),
          soon(id + '-s-e4', 'Turnos', 'ordering', 2),
          soon(id + '-s-e5', 'Misión emociones', 'quiz', 4)
        ], { saberIds: [infSid(tier, 's', 1), infSid(tier, 's', 2)] }),
        unit(id + '-s-cole', 'Mi entorno', 'Cole, calle y lugares cercanos.', [
          wrapInfantil(id + '-s-c1', 'Mi clase', 0, 1, 'Mesa, patio…', bl, infSid(tier, 's', 3)),
          wrapInfantil(id + '-s-c2', 'Señales', 1, 2, 'Pare, ceda…', bl, infSid(tier, 's', 3)),
          extraLive ? wrapInfantil(id + '-s-c3', 'Ayudar al compi', 2, 2, 'Convivencia', bl, infSid(tier, 's', 2)) : soon(id + '-s-c3', 'Ordena el día', 'ordering', 2),
          soon(id + '-s-c4', 'Profesiones', 'matching', 3),
          soon(id + '-s-c5', 'Misión ciudadana', 'quiz', 4)
        ], { saberIds: [infSid(tier, 's', 2), infSid(tier, 's', 3)] })
      ], 'live'),
      subject('brain-gym-diario', [
        unit(id + '-d1', 'Atención visual', 'Rutina corta: mates, idiomas y reflejos.', [
          tagSaber(liveReflex(id + '-d-f', 'Flash tap suave', 'flash-tap', 1), infSid(tier, 'd', 1)),
          wrapInfantil(id + '-d-p', 'Neon Peques', 0, 1, 'Calentamiento', bl, infSid(tier, 'd', 1)),
          wrapInfantil(id + '-d-n', 'Cuenta rápido', 2, 1, '1 min', bl, infSid(tier, 'm', 1)),
          tagSaber(liveReflex(id + '-d-r', 'Test reflejos', 'reaction-test', 2), infSid(tier, 'd', 1)),
          wrapInfantil(id + '-d-c', 'Colores mix', 1, 2, 'Repaso', bl, infSid(tier, 'm', 2))
        ], { saberIds: [infSid(tier, 'd', 1)] })
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

  function unit(id, title, description, activities, opts) {
    opts = opts || {};
    return {
      id: id,
      title: title,
      description: description,
      skills: opts.saberIds || opts.skills || [],
      lomloe: opts.lomloe || true,
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

  /** —— 1º Primaria (LOMLOE RD 157/2022) —— */
  function primaria1Math() {
    return [
      unit(
        'p1-m-numeros',
        'Números del 0 al 99',
        'LOMLOE · sentido numérico: contar, comparar y ordenar.',
        [
          liveMates('p1-m-n1-w', 'Conteo relámpago', 0, 1, 1, 'Sumas pequeñas', 'p1-m-a1'),
          liveMates('p1-m-n1-t', 'Entrenamiento 0–20', 1, 2, 1, 'Sin llevadas', 'p1-m-a1'),
          liveMates('p1-m-n1-r', 'Reto de cifras', 2, 3, 2, 'Más velocidad', 'p1-m-a4'),
          liveGame('p1-m-n1-o', 'Ordenar números', 'neon-ordenar', 2, 2, 'De menor a mayor', 'p1-m-a4'),
          liveGame('p1-m-n1-m', 'Mayor y menor', 'neon-mayor-menor', 3, 2, 'Compara bien', 'p1-m-a4')
        ],
        { saberIds: ['p1-m-a1', 'p1-m-a4'] }
      ),
      unit(
        'p1-m-sumas',
        'Suma y resta sin llevadas',
        'LOMLOE · composición del 10 y operaciones hasta 20.',
        [
          liveMates('p1-m-s1-w', 'Sumas fáciles', 0, 1, 1, null, 'p1-m-a2'),
          liveMates('p1-m-s2-t', 'Mix suma y resta', 1, 2, 2, null, 'p1-m-a3'),
          liveMates('p1-m-s3-r', 'Combo sin parar', 2, 3, 2, null, 'p1-m-a3'),
          soon('p1-m-s4-p', 'Problemas con dibujos', 'multiple-choice', 2),
          soon('p1-m-s5-m', 'Misión de la tienda', 'mini-game', 5)
        ],
        { saberIds: ['p1-m-a2', 'p1-m-a3'] }
      ),
      unit(
        'p1-m-problemas',
        'Problemas de una operación',
        'LOMLOE · resolver problemas en un paso.',
        [
          liveMates('p1-m-p1-w', 'Calentamiento mental', 0, 1, 1, null, 'p1-m-a3'),
          liveMates('p1-m-p2-t', 'Problemas numéricos', 1, 2, 2, null, 'p1-m-a5'),
          soon('p1-m-p3-h', 'Historias cortas', 'reading', 2),
          soon('p1-m-p4-d', 'Elige la operación', 'multiple-choice', 3),
          soon('p1-m-p5-m', 'Mini test del mercado', 'quiz', 5)
        ],
        { saberIds: ['p1-m-a5'] }
      ),
      unit(
        'p1-m-medida',
        'Medida y tiempo',
        'LOMLOE · magnitudes y secuencia temporal.',
        [
          soon('p1-m-e1-c', 'Días de la semana', 'matching', 1),
          soon('p1-m-e2-r', 'Reloj en punto', 'mini-game', 2),
          liveGame('p1-m-e3-n', 'Números del calendario', 'neon-calculo', 2, 2, null, 'p1-m-b1'),
          soon('p1-m-e4-l', 'Largo y corto', 'drag-drop', 2),
          soon('p1-m-e5-m', 'Misión del calendario', 'quiz', 4)
        ],
        { saberIds: ['p1-m-b1'] }
      ),
      unit(
        'p1-m-figuras',
        'Figuras planas',
        'LOMLOE · sentido espacial: figuras básicas.',
        [
          liveGame('p1-m-f1-f', 'Nombre la figura', 'neon-clasifica', 1, 1, 'Elige el grupo', 'p1-m-c1'),
          soon('p1-m-f2-c', 'Cuenta lados', 'multiple-choice', 2),
          tagSaber(liveGame('p1-m-f3-a', 'Atención visual', 'flash-tap', 2, null), 'p1-m-c1'),
          soon('p1-m-f4-p', 'Patrones con formas', 'ordering', 3),
          soon('p1-m-f5-m', 'Reto geométrico', 'quiz', 4)
        ],
        { saberIds: ['p1-m-c1'] }
      )
    ];
  }

  function primaria1Lengua() {
    return [
      unit('p1-l-silabas', 'Sílabas y palabras', 'LOMLOE · grafema-fonema y sílabas directas.', [
        liveLengua('p1-l-s3', 'Ordena sílabas', 'neon-silabas', 1, 'Forma la palabra', 1, 'p1-l-c1'),
        liveLengua('p1-l-s2', 'Completa la palabra', 'neon-palabra', 2, 'Elige la sílaba', 1, 'p1-l-c1'),
        liveLengua('p1-l-s4', 'Lectura guiada', 'neon-lectura', 3, 'Comprensión literal', 1, 'p1-l-c2'),
        soon('p1-l-s1', 'Une sílaba e imagen', 'matching', 1),
        soon('p1-l-s5', 'Mini dictado', 'listening', 4)
      ], { saberIds: ['p1-l-c1', 'p1-l-c2'] }),
      unit('p1-l-frases', 'Frases simples', 'LOMLOE · comprensión y frases con mayúscula y punto.', [
        liveLengua('p1-l-f1', 'Ordena la frase', 'neon-frase', 1, 'Toca las palabras en orden', 1, 'p1-l-c3'),
        liveLengua('p1-l-f2', '¿Qué pasó?', 'neon-lectura', 2, 'Lee y responde', 1, 'p1-l-c2'),
        soon('p1-l-f3', 'Pon el punto', 'multiple-choice', 2),
        soon('p1-l-f4', 'Escribe tu frase', 'typing', 3),
        soon('p1-l-f5', 'Misión del cuento', 'quiz', 5)
      ], { saberIds: ['p1-l-c2', 'p1-l-c3'] }),
      unit('p1-l-vocab', 'Vocabulario cotidiano', 'LOMLOE · léxico de casa, colegio y familia.', [
        soon('p1-l-v1', 'Imagen y palabra', 'matching', 1),
        soon('p1-l-v2', 'Clasifica palabras', 'drag-drop', 2),
        soon('p1-l-v3', 'Sinónimos sencillos', 'multiple-choice', 3),
        soon('p1-l-v4', 'Escucha y elige', 'listening', 2),
        soon('p1-l-v5', 'Reto del diccionario', 'quiz', 4)
      ], { saberIds: ['p1-l-c4'] })
    ];
  }

  function primaria1Ingles() {
    return [
      unit('p1-i-hola', 'Hello y presentaciones', 'LOMLOE · saludos y presentaciones básicas.', [
        liveIngles('p1-i-h1', 'Hello / goodbye', 0, 1, 1, 'Vocabulario básico', 'p1-i-e1'),
        liveIngles('p1-i-h2', 'My name is…', 1, 2, 1, null, 'p1-i-e1'),
        soon('p1-i-h3', 'Escucha y repite', 'listening', 1),
        soon('p1-i-h4', 'Roleplay mini', 'roleplay', 3),
        soon('p1-i-h5', 'Misión del saludo', 'quiz', 4)
      ], { saberIds: ['p1-i-e1'] }),
      unit('p1-i-numbers', 'Numbers 1–20', 'LOMLOE · numbers and colours in context.', [
        liveIngles('p1-i-n1', 'Numbers 1–10', 0, 1, 1, null, 'p1-i-e2'),
        liveIngles('p1-i-n2', 'Numbers 11–20', 1, 2, 2, null, 'p1-i-e2'),
        soon('p1-i-n3', 'Ordena números', 'ordering', 2),
        soon('p1-i-n4', 'Listening numbers', 'listening', 3),
        soon('p1-i-n5', 'Number challenge', 'quiz', 4)
      ], { saberIds: ['p1-i-e2'] }),
      unit('p1-i-colours', 'Colours y animals', 'LOMLOE · classroom objects, colours and animals.', [
        liveIngles('p1-i-c1', 'Colours', 0, 1, 1, null, 'p1-i-e2'),
        liveIngles('p1-i-c2', 'Animals', 1, 2, 2, null, 'p1-i-e3'),
        soon('p1-i-c3', 'I like…', 'typing', 2),
        soon('p1-i-c4', 'This is a…', 'multiple-choice', 3),
        soon('p1-i-c5', 'Animal memory', 'memory', 4)
      ], { saberIds: ['p1-i-e2', 'p1-i-e3'] })
    ];
  }

  function primaria1Naturales() {
    return [
      unit('p1-n-vida', 'Seres vivos', 'LOMLOE · animales, plantas y necesidades básicas.', [
        liveNaturales('p1-n-v1', 'Animal o planta', 'neon-vida', 1, 'Clasifica', 1, 'p1-n-b1'),
        liveNaturales('p1-n-v2', '¿Verdad o mentira?', 'neon-planeta', 2, 'Ciencia divertida', 1, 'p1-n-b1'),
        liveNaturales('p1-n-v3', 'Partes de la planta', 'neon-vida', 2, 'Clasifica', 2, 'p1-n-b1'),
        liveNaturales('p1-n-v4', 'Cadena alimenticia', 'neon-cuerpo', 2, 'Lee y responde', 2, 'p1-n-b1'),
        liveNaturales('p1-n-v5', 'Reto de la huerta', 'neon-planeta', 3, 'Verdadero o falso', 2, 'p1-n-b1')
      ], { saberIds: ['p1-n-b1'] }),
      unit('p1-n-cuerpo', 'Cuerpo y salud', 'LOMLOE · sentidos, higiene y hábitos sanos.', [
        liveNaturales('p1-n-c1', 'Cuerpo y sentidos', 'neon-cuerpo', 1, 'Elige la respuesta', 1, 'p1-n-b2'),
        liveNaturales('p1-n-c2', 'Clasifica seres vivos', 'neon-vida', 2, 'Animales y plantas', 1, 'p1-n-b1'),
        liveNaturales('p1-n-c3', 'Alimentos saludables', 'neon-cuerpo', 2, 'Elige bien', 2, 'p1-n-b2'),
        liveNaturales('p1-n-c4', 'Rutina del día', 'neon-planeta', 2, 'Ciencia', 2, 'p1-n-b2'),
        liveNaturales('p1-n-c5', 'Misión salud', 'neon-vida', 3, 'Clasifica', 2, 'p1-n-b2')
      ], { saberIds: ['p1-n-b2'] }),
      unit('p1-n-materia', 'Materia y energía', 'LOMLOE · agua, aire, luz y cuidado del entorno.', [
        liveNaturales('p1-n-m1', 'Verdadero o falso', 'neon-planeta', 1, 'La Tierra y el cielo', 1, 'p1-n-b3'),
        liveNaturales('p1-n-m2', 'Preguntas de ciencia', 'neon-cuerpo', 2, 'Lee y responde', 1, 'p1-n-b3'),
        liveNaturales('p1-n-m3', 'Estados del agua', 'neon-planeta', 2, 'V o F', 2, 'p1-n-b3'),
        liveNaturales('p1-n-m4', 'Recicla', 'neon-vida', 3, 'Medio ambiente', 2, 'p1-n-b3'),
        liveNaturales('p1-n-m5', 'Reto ecológico', 'neon-cuerpo', 3, 'Preguntas', 2, 'p1-n-b3')
      ], { saberIds: ['p1-n-b3'] })
    ];
  }

  function primaria1Sociales() {
    return [
      unit('p1-s-entorno', 'Mi entorno', 'LOMLOE · familia, colegio y normas de convivencia.', [
        liveSociales('p1-s-e1', 'Familia y cole', 'neon-entorno', 1, 'Convivencia', 1, 'p1-s-b1'),
        liveSociales('p1-s-e2', 'Normas del aula', 'neon-historia', 2, 'Ordena frases', 1, 'p1-s-b1'),
        liveSociales('p1-s-e3', 'Emociones', 'neon-mapa', 2, 'Lugares del barrio', 1, 'p1-s-b1'),
        liveSociales('p1-s-e4', 'Ayudar en casa', 'neon-historia', 2, 'Ordena', 2, 'p1-s-b1'),
        liveSociales('p1-s-e5', 'Misión del barrio', 'neon-entorno', 3, 'Lee', 2, 'p1-s-b1')
      ], { saberIds: ['p1-s-b1'] }),
      unit('p1-s-mapas', 'Mapas y paisaje', 'LOMLOE · orientación y lugares cercanos.', [
        liveSociales('p1-s-m1', '¿Dónde estamos?', 'neon-mapa', 1, 'Mapas y lugares', 1, 'p1-s-b2'),
        liveSociales('p1-s-m2', 'Capital y país', 'neon-entorno', 2, 'Geografía sencilla', 1, 'p1-s-b2'),
        liveSociales('p1-s-m3', 'Símbolos del mapa', 'neon-historia', 2, 'Ordena conceptos', 1, 'p1-s-b2'),
        liveSociales('p1-s-m4', 'Mi ruta al cole', 'neon-mapa', 3, 'Geografía', 2, 'p1-s-b2'),
        liveSociales('p1-s-m5', 'Reto del explorador', 'neon-entorno', 3, 'Capitales', 2, 'p1-s-b2')
      ], { saberIds: ['p1-s-b2'] }),
      unit('p1-s-historia', 'Historia cercana', 'LOMLOE · fiestas, tiempo y cambios cotidianos.', [
        liveSociales('p1-s-h1', 'Ordena el tiempo', 'neon-historia', 1, 'Frases en orden', 1, 'p1-s-b3'),
        liveSociales('p1-s-h2', 'Fiestas y tradiciones', 'neon-entorno', 2, 'Cultura cercana', 1, 'p1-s-b3'),
        liveSociales('p1-s-h3', 'Antes y ahora', 'neon-mapa', 2, 'Lugares y tiempo', 1, 'p1-s-b3'),
        liveSociales('p1-s-h4', 'Línea del tiempo', 'neon-historia', 3, 'Ordena', 2, 'p1-s-b3'),
        liveSociales('p1-s-h5', 'Misión histórica', 'neon-entorno', 3, 'Tradiciones', 2, 'p1-s-b3')
      ], { saberIds: ['p1-s-b3'] })
    ];
  }

  function primaria1Daily() {
    return [
      unit('p1-d-rutina', 'Brain Gym de hoy', 'LOMLOE · rutina equilibrada en 7 min.', [
        liveGame('p1-d1', 'Cálculo express', 'neon-calculo', 1, 1, '3 preguntas rápidas', 'p1-m-a3'),
        liveLengua('p1-d2', 'Mini lectura', 'neon-lectura', 2, 'Comprensión', 1, 'p1-l-c2'),
        liveGame('p1-d3', 'Palabras EN', 'neon-palabras', 1, 1, 'Vocabulario', 'p1-i-e1'),
        liveNaturales('p1-d4', 'Ciencia corta', 'neon-cuerpo', 1, '1 pregunta', 1, 'p1-n-b2'),
        tagSaber(liveReflex('p1-d5', 'Reflejos finales', 'flash-tap', 2), 'p1-d-01')
      ], { saberIds: ['p1-d-01'] })
    ];
  }

  /** —— 2º Primaria (LOMLOE RD 157/2022) —— */
  function primaria2Math() {
    return [
      unit('p2-m-numeros', 'Números hasta 999', 'LOMLOE · centenas, comparación y ordenación.', [
        liveMates('p2-m-n1', 'Sumas hasta 50', 0, 1, 2, null, 'p2-m-a1'),
        liveMates('p2-m-n2', 'Restas con ayuda', 1, 2, 2, null, 'p2-m-a1'),
        liveMates('p2-m-n3', 'Reto 0–99', 2, 3, 3, null, 'p2-m-a1'),
        soon('p2-m-n4', 'Ordena centenas', 'ordering', 3),
        soon('p2-m-n5', 'Misión numérica', 'quiz', 4)
      ], { saberIds: ['p2-m-a1'] }),
      unit('p2-m-llevadas', 'Sumas y restas con llevadas', 'LOMLOE · cálculo mental con llevadas.', [
        liveMates('p2-m-l1', 'Calentamiento', 0, 1, 2, null, 'p2-m-a2'),
        liveMates('p2-m-l2', 'Operaciones mixtas', 1, 2, 3, null, 'p2-m-a2'),
        liveMates('p2-m-l3', 'Combo 60 s', 2, 3, 3, null, 'p2-m-a2'),
        soon('p2-m-l4', 'Problemas dos pasos', 'multiple-choice', 3),
        soon('p2-m-l5', 'Misión del banco', 'quiz', 5)
      ], { saberIds: ['p2-m-a2'] }),
      unit('p2-m-tablas', 'Tablas del 2, 5 y 10', 'LOMLOE · multiplicación como suma repetida.', [
        liveGame('p2-m-t1', 'Tablas del 2', 'tablas-relampago', 1, 2, null, 'p2-m-a3'),
        liveMates('p2-m-t2', 'Mental × tablas', 1, 2, 2, null, 'p2-m-a3'),
        liveGame('p2-m-t3', 'Tablas del 10', 'tablas-relampago', 3, 3, null, 'p2-m-a3'),
        soon('p2-m-t4', 'Problemas de grupos', 'multiple-choice', 3),
        soon('p2-m-t5', 'Carrera de tablas', 'mini-game', 5)
      ], { saberIds: ['p2-m-a3'] }),
      unit('p2-m-dinero', 'Dinero y tiempo', 'LOMLOE · monedas, euros y media hora.', [
        soon('p2-m-d1', 'Monedas y billetes', 'matching', 2),
        soon('p2-m-d2', 'La caja registradora', 'mini-game', 3),
        liveGame('p2-m-d3', 'Cálculo con euros', 'neon-calculo', 2, 3, null, 'p2-m-b1'),
        soon('p2-m-d4', 'Media hora', 'mini-game', 3),
        soon('p2-m-d5', 'Misión del reloj', 'quiz', 4)
      ], { saberIds: ['p2-m-b1'] }),
      unit('p2-m-figuras', 'Polígonos sencillos', 'LOMLOE · lados, vértices y simetría básica.', [
        soon('p2-m-f1', 'Polígonos', 'matching', 2),
        tagSaber(liveReflex('p2-m-f2', 'Atención geométrica', 'flash-tap', 2), 'p2-m-c1'),
        soon('p2-m-f3', 'Simetría', 'drag-drop', 3),
        soon('p2-m-f4', 'Perímetro con cuadrícula', 'mini-game', 4),
        soon('p2-m-f5', 'Reto figuras', 'quiz', 4)
      ], { saberIds: ['p2-m-c1'] })
    ];
  }

  function primaria2Lengua() {
    return [
      unit('p2-l-lectura', 'Textos breves', 'LOMLOE · comprensión literal e idea principal.', [
        liveLengua('p2-l-r1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión literal', 4, 'p2-l-c1'),
        liveLengua('p2-l-r2', 'Ordena sílabas', 'neon-silabas', 2, 'Palabras del cole', 4, 'p2-l-c1'),
        soon('p2-l-r3', 'Idea principal', 'multiple-choice', 3),
        soon('p2-l-r4', 'Escribe un final', 'typing', 3),
        soon('p2-l-r5', 'Misión lectora', 'quiz', 5)
      ], { saberIds: ['p2-l-c1'] }),
      unit('p2-l-ortografia', 'Ortografía básica', 'LOMLOE · ca/co/cu, que/qui, m antes de p/b.', [
        liveLengua('p2-l-o1', 'Completa la palabra', 'neon-palabra', 2, 'Elige la sílaba correcta', 4, 'p2-l-c2'),
        soon('p2-l-o2', 'Completa con m o n', 'typing', 3),
        soon('p2-l-o3', 'Detecta el error', 'quiz', 3),
        soon('p2-l-o4', 'Dictado corto', 'listening', 4),
        soon('p2-l-o5', 'Reto ortográfico', 'quiz', 5)
      ], { saberIds: ['p2-l-c2'] }),
      unit('p2-l-gramatica', 'Nombre, verbo y adjetivo', 'LOMLOE · primeras categorías gramaticales.', [
        soon('p2-l-g1', '¿Qué es?', 'matching', 2),
        soon('p2-l-g2', 'Sinónimos y antónimos', 'multiple-choice', 2),
        liveLengua('p2-l-g3', 'Ordena la frase', 'neon-frase', 2, 'Orden sintáctico', 4, 'p2-l-c3'),
        soon('p2-l-g4', 'Subraya el verbo', 'drag-drop', 3),
        soon('p2-l-g5', 'Misión gramatical', 'quiz', 4)
      ], { saberIds: ['p2-l-c3'] })
    ];
  }

  function primaria2Ingles() {
    return [
      unit('p2-i-family', 'Family y body', 'LOMLOE · vocabulario de familia y cuerpo.', [
        liveIngles('p2-i-f1', 'Family words', 0, 1, 2, null, 'p2-i-e1'),
        liveIngles('p2-i-f2', 'Body parts', 1, 2, 2, null, 'p2-i-e1'),
        soon('p2-i-f3', 'I have got…', 'typing', 2),
        soon('p2-i-f4', 'Listening family', 'listening', 3),
        soon('p2-i-f5', 'Family quiz', 'quiz', 4)
      ], { saberIds: ['p2-i-e1'] }),
      unit('p2-i-food', 'Food y actions', 'LOMLOE · comida y verbos de acción.', [
        liveIngles('p2-i-o1', 'Food', 0, 1, 2, null, 'p2-i-e2'),
        liveIngles('p2-i-o2', 'Actions', 1, 2, 3, null, 'p2-i-e2'),
        soon('p2-i-o3', 'I like / don\'t like', 'multiple-choice', 2),
        soon('p2-i-o4', 'Mini diálogo', 'roleplay', 3),
        soon('p2-i-o5', 'Food mission', 'quiz', 4)
      ], { saberIds: ['p2-i-e2'] }),
      unit('p2-i-numbers', 'Numbers 1–50', 'LOMLOE · contar y comparar en inglés.', [
        liveIngles('p2-i-n1', 'Numbers 1–20', 0, 1, 2, null, 'p2-i-e3'),
        liveIngles('p2-i-n2', 'Numbers 21–50', 1, 2, 3, null, 'p2-i-e3'),
        soon('p2-i-n3', 'Comparatives easy', 'multiple-choice', 3),
        soon('p2-i-n4', 'Listen and write', 'listening', 3),
        soon('p2-i-n5', 'Number boss', 'quiz', 5)
      ], { saberIds: ['p2-i-e3'] })
    ];
  }

  function primaria2Naturales() {
    return [
      unit('p2-n-vida', 'Seres vivos', 'LOMLOE · vertebrados, invertebrados y hábitats.', [
        liveNaturales('p2-n-v1', 'Vertebrado o invertebrado', 'neon-vida', 2, 'Clasifica', 4, 'p2-n-b1'),
        liveNaturales('p2-n-v2', 'Preguntas de ciencia', 'neon-cuerpo', 2, 'Lee y responde', 4, 'p2-n-b1'),
        liveNaturales('p2-n-v3', 'Hábitats', 'neon-vida', 3, 'Clasifica', 4, 'p2-n-b1'),
        liveNaturales('p2-n-v4', 'Cuidar el bosque', 'neon-planeta', 3, 'V o F', 4, 'p2-n-b1'),
        liveNaturales('p2-n-v5', 'Reto ecológico', 'neon-cuerpo', 3, 'Ciencia', 4, 'p2-n-b1')
      ], { saberIds: ['p2-n-b1'] }),
      unit('p2-n-cuerpo', 'Cuerpo y salud', 'LOMLOE · alimentación y hábitos saludables.', [
        liveNaturales('p2-n-c1', 'Cuerpo y salud', 'neon-cuerpo', 1, 'Elige bien', 4, 'p2-n-b2'),
        liveNaturales('p2-n-c2', 'Verdadero o falso', 'neon-planeta', 2, 'Ciencia', 4, 'p2-n-b2'),
        liveNaturales('p2-n-c3', 'Plato saludable', 'neon-cuerpo', 2, 'Salud', 4, 'p2-n-b2'),
        liveNaturales('p2-n-c4', 'Ejercicio', 'neon-planeta', 3, 'Cuerpo', 4, 'p2-n-b2'),
        liveNaturales('p2-n-c5', 'Misión salud', 'neon-vida', 3, 'Hábitos', 4, 'p2-n-b2')
      ], { saberIds: ['p2-n-b2'] }),
      unit('p2-n-materia', 'Materia y energía', 'LOMLOE · agua, reciclaje e imanes.', [
        liveNaturales('p2-n-m1', 'Clasifica materiales', 'neon-vida', 2, 'Imanes y objetos', 4, 'p2-n-b3'),
        liveNaturales('p2-n-m2', 'Ciclo del agua', 'neon-cuerpo', 3, 'Comprensión', 4, 'p2-n-b3'),
        liveNaturales('p2-n-m3', 'Reciclar', 'neon-vida', 2, 'Materiales', 4, 'p2-n-b3'),
        liveNaturales('p2-n-m4', 'Experimento virtual', 'neon-planeta', 3, 'Agua', 4, 'p2-n-b3'),
        liveNaturales('p2-n-m5', 'Reto científico', 'neon-cuerpo', 4, 'Lee', 4, 'p2-n-b3')
      ], { saberIds: ['p2-n-b3'] })
    ];
  }

  function primaria2Sociales() {
    return [
      unit('p2-s-entorno', 'Mi entorno', 'LOMLOE · normas, ayuntamiento y convivencia.', [
        liveSociales('p2-s-e1', 'Normas de convivencia', 'neon-entorno', 2, 'Elige', 4, 'p2-s-b1'),
        liveSociales('p2-s-e2', 'Ordena la historia', 'neon-historia', 2, 'Tiempo', 4, 'p2-s-b1'),
        liveSociales('p2-s-e3', 'Profesiones', 'neon-mapa', 2, 'Lugares y servicios', 4, 'p2-s-b1'),
        liveSociales('p2-s-e4', 'Carta al ayuntamiento', 'neon-entorno', 3, 'Lee', 5, 'p2-s-b1'),
        liveSociales('p2-s-e5', 'Misión ciudadana', 'neon-historia', 3, 'Ordena', 5, 'p2-s-b1')
      ], { saberIds: ['p2-s-b1'] }),
      unit('p2-s-mapas', 'Mapas y paisaje', 'LOMLOE · Europa, España y relieve.', [
        liveSociales('p2-s-m1', 'Europa y España', 'neon-mapa', 2, 'Mapas', 4, 'p2-s-b2'),
        liveSociales('p2-s-m2', 'Ríos y montañas', 'neon-entorno', 3, 'Lee y responde', 4, 'p2-s-b2'),
        liveSociales('p2-s-m3', 'Brújula', 'neon-historia', 2, 'Ordena', 4, 'p2-s-b2'),
        liveSociales('p2-s-m4', 'Dibuja tu mapa', 'neon-mapa', 3, 'España', 5, 'p2-s-b2'),
        liveSociales('p2-s-m5', 'Reto mapas', 'neon-entorno', 4, 'Geografía', 5, 'p2-s-b2')
      ], { saberIds: ['p2-s-b2'] }),
      unit('p2-s-historia', 'Historia cercana', 'LOMLOE · prehistoria y pueblos antiguos.', [
        liveSociales('p2-s-h1', 'Ordena el relato', 'neon-historia', 2, 'Fenicios', 4, 'p2-s-b3'),
        liveSociales('p2-s-h2', 'Preguntas históricas', 'neon-entorno', 2, 'Lee', 4, 'p2-s-b3'),
        liveSociales('p2-s-h3', 'Prehistoria', 'neon-mapa', 3, 'Civilizaciones', 4, 'p2-s-b3'),
        liveSociales('p2-s-h4', 'Línea del tiempo', 'neon-historia', 3, 'Historia', 5, 'p2-s-b3'),
        liveSociales('p2-s-h5', 'Misión histórica', 'neon-entorno', 4, 'Preguntas', 5, 'p2-s-b3')
      ], { saberIds: ['p2-s-b3'] })
    ];
  }

  function primaria2Daily() {
    return mapDailyFromP1('p2', 1);
  }

  /** —— 3º Primaria (LOMLOE RD 157/2022) —— */
  function primaria3Math() {
    return [
      unit('p3-m-mult', 'Multiplicación', 'LOMLOE · tablas y productos con fluidez.', [
        liveGame('p3-m-m1', 'Tablas 2–5', 'tablas-relampago', 1, 3, null, 'p3-m-a1'),
        liveMates('p3-m-m2', 'Mental × tablas', 1, 2, 4, null, 'p3-m-a1'),
        liveGame('p3-m-m3', 'Mix tablas', 'tablas-relampago', 3, 4, null, 'p3-m-a1'),
        liveMates('p3-m-m4', 'Cálculo avanzado', 3, 3, 4, null, 'p3-m-a1'),
        soon('p3-m-m5', 'Problemas de grupos', 'quiz', 5)
      ], { saberIds: ['p3-m-a1'] }),
      unit('p3-m-div', 'División sencilla', 'LOMLOE · repartir y agrupar.', [
        liveGame('p3-m-d1', 'Tablas para dividir', 'tablas-relampago', 1, 3, null, 'p3-m-a2'),
        liveMates('p3-m-d2', 'Reparto mental', 2, 2, 3, null, 'p3-m-a2'),
        liveMates('p3-m-d3', 'Operaciones mixtas', 0, 3, 4, null, 'p3-m-a2'),
        soon('p3-m-d4', 'Problemas dos pasos', 'multiple-choice', 4),
        soon('p3-m-d5', 'Misión división', 'quiz', 5)
      ], { saberIds: ['p3-m-a2'] }),
      unit('p3-m-frac', 'Fracciones básicas', 'LOMLOE · medios, tercios y cuartos (repaso numérico).', [
        soon('p3-m-f1', 'Mitad y doble', 'matching', 2),
        soon('p3-m-f2', 'Colorea la fracción', 'drag-drop', 2),
        liveGame('p3-m-f3', 'Cálculo numérico', 'neon-calculo', 2, 4, null, 'p3-m-a3'),
        soon('p3-m-f4', 'Compara fracciones', 'multiple-choice', 3),
        soon('p3-m-f5', 'Reto pizza', 'mini-game', 5)
      ], { saberIds: ['p3-m-a3'] }),
      unit('p3-m-medidas', 'Medidas y perímetro', 'LOMLOE · longitud y contorno.', [
        soon('p3-m-e1', 'Centímetros', 'mini-game', 2),
        liveGame('p3-m-e2', 'Cálculo de medidas', 'neon-calculo', 2, 4, null, 'p3-m-b1'),
        soon('p3-m-e3', 'Perímetro en cuadrícula', 'drag-drop', 3),
        soon('p3-m-e4', 'Conversión simple', 'multiple-choice', 4),
        soon('p3-m-e5', 'Misión metro', 'quiz', 5)
      ], { saberIds: ['p3-m-b1'] }),
      unit('p3-m-problemas', 'Problemas de dos pasos', 'LOMLOE · planificar antes de calcular.', [
        liveMates('p3-m-p1', 'Calentamiento', 0, 1, 3, null, 'p3-m-a2'),
        liveMates('p3-m-p2', 'Dos operaciones', 1, 3, 4, null, 'p3-m-a4'),
        liveGame('p3-m-p3', 'Tablas en problemas', 'tablas-relampago', 2, 4, null, 'p3-m-a4'),
        soon('p3-m-p4', 'Elige el plan', 'multiple-choice', 4),
        soon('p3-m-p5', 'Misión detective', 'quiz', 5)
      ], { saberIds: ['p3-m-a4'] })
    ];
  }

  function primaria3Lengua() {
    return [
      unit('p3-l-textos', 'Narrativos e informativos', 'LOMLOE · comprender y resumir textos.', [
        liveLengua('p3-l-t1', 'Cuento o noticia', 'neon-lectura', 2, 'Comprensión', 8, 'p3-l-c1'),
        liveLengua('p3-l-t2', 'Ordena la frase', 'neon-frase', 3, 'Sintaxis', 8, 'p3-l-c1'),
        soon('p3-l-t3', 'Descripción', 'typing', 3),
        soon('p3-l-t4', 'Carta corta', 'typing', 3),
        soon('p3-l-t5', 'Misión redactor', 'quiz', 5)
      ], { saberIds: ['p3-l-c1'] }),
      unit('p3-l-ortografia', 'b/v, g/j, r/rr', 'LOMLOE · ortografía frecuente en 3º.', [
        liveLenguaRot('p3-l-o1', 'Completa la palabra', 2, 2, 'Sílabas trabadas', 8, 'p3-l-c2'),
        liveLenguaRot('p3-l-o2', 'Ordena sílabas', 1, 3, 'Palabras largas', 8, 'p3-l-c2'),
        liveLenguaRot('p3-l-o3', 'Lee y corrige', 0, 3, 'Comprensión', 8, 'p3-l-c2'),
        soon('p3-l-o4', 'Dictado', 'listening', 4),
        soon('p3-l-o5', 'Reto ortografía', 'quiz', 5)
      ], { saberIds: ['p3-l-c2'] }),
      unit('p3-l-literatura', 'Cuento, poesía y fábula', 'LOMLOE · géneros literarios básicos.', [
        soon('p3-l-i1', '¿Qué género es?', 'matching', 2),
        soon('p3-l-i2', 'Rima en poesía', 'listening', 2),
        liveLengua('p3-l-i3', 'Moral de la fábula', 'neon-lectura', 3, 'Lee y responde', 8, 'p3-l-c3'),
        soon('p3-l-i4', 'Ordena el cuento', 'ordering', 3),
        soon('p3-l-i5', 'Misión literaria', 'quiz', 4)
      ], { saberIds: ['p3-l-c3'] })
    ];
  }

  function primaria3Ingles() {
    return [
      unit('p3-i-present', 'Present simple', 'LOMLOE · rutinas y hechos cotidianos.', [
        liveIngles('p3-i-p1', 'Daily routines', 0, 1, 3, null, 'p3-i-e1'),
        liveIngles('p3-i-p2', 'School words', 1, 2, 3, null, 'p3-i-e1'),
        soon('p3-i-p3', 'Fill the gap', 'typing', 3),
        soon('p3-i-p4', 'Listening routines', 'listening', 3),
        soon('p3-i-p5', 'Grammar quiz', 'quiz', 5)
      ], { saberIds: ['p3-i-e1'] }),
      unit('p3-i-can', "Can / can't · there is/are", 'LOMLOE · habilidad y descripción.', [
        liveIngles('p3-i-c1', 'Places vocab', 0, 2, 3, null, 'p3-i-e2'),
        liveIngles('p3-i-c2', 'Listen & tap', 1, 2, 3, null, 'p3-i-e2'),
        soon('p3-i-c3', 'There is / are', 'multiple-choice', 3),
        soon('p3-i-c4', 'Describe a room', 'typing', 3),
        soon('p3-i-c5', 'City mission', 'quiz', 4)
      ], { saberIds: ['p3-i-e2'] }),
      unit('p3-i-listen', 'Listening e instrucciones', 'LOMLOE · seguir órdenes en inglés.', [
        tagSaber(liveReflex('p3-i-l1', 'Listen & tap', 'flash-tap', 1), 'p3-i-e3'),
        liveIngles('p3-i-l2', 'School objects', 0, 2, 3, null, 'p3-i-e3'),
        soon('p3-i-l3', 'Follow directions', 'listening', 3),
        soon('p3-i-l4', 'Classroom game', 'mini-game', 3),
        soon('p3-i-l5', 'Listening test', 'quiz', 5)
      ], { saberIds: ['p3-i-e3'] })
    ];
  }

  function primaria3Naturales() {
    return [
      unit('p3-n-vida', 'Seres vivos', 'LOMLOE · ecosistemas y cadenas alimenticias.', [
        liveNaturalesRot('p3-n-v1', 'Ecosistema', 1, 2, 'Comprensión', 8, 'p3-n-b1'),
        liveNaturalesRot('p3-n-v2', 'Clasifica', 0, 3, 'Seres vivos', 8, 'p3-n-b1'),
        liveNaturalesRot('p3-n-v3', 'Cadena alimenticia', 0, 3, 'Clasifica', 8, 'p3-n-b1'),
        liveNaturalesRot('p3-n-v4', 'Adaptaciones', 2, 3, 'Verdadero o falso', 8, 'p3-n-b1'),
        liveNaturalesRot('p3-n-v5', 'Reto biología', 2, 4, 'Ciencia', 9, 'p3-n-b1')
      ], { saberIds: ['p3-n-b1'] }),
      unit('p3-n-cuerpo', 'Cuerpo y salud', 'LOMLOE · sistemas del cuerpo humano.', [
        liveNaturalesRot('p3-n-c1', 'Cuerpo humano', 1, 2, 'Preguntas', 8, 'p3-n-b2'),
        liveNaturalesRot('p3-n-c2', 'Verdadero o falso', 2, 2, 'Ciencia', 8, 'p3-n-b2'),
        liveNaturalesRot('p3-n-c3', 'Sistema digestivo', 1, 3, 'Cuerpo', 8, 'p3-n-b2'),
        liveNaturalesRot('p3-n-c4', 'Hábitos sanos', 2, 2, 'Salud', 8, 'p3-n-b2'),
        liveNaturalesRot('p3-n-c5', 'Misión salud', 0, 4, 'Clasifica', 9, 'p3-n-b2')
      ], { saberIds: ['p3-n-b2'] }),
      unit('p3-n-materia', 'Materia y energía', 'LOMLOE · estados, electricidad y recursos.', [
        liveNaturalesRot('p3-n-m1', 'Estados del agua', 2, 2, 'V o F', 8, 'p3-n-b3'),
        liveNaturalesRot('p3-n-m2', 'Plantas y oxígeno', 1, 3, 'Lee', 8, 'p3-n-b3'),
        liveNaturalesRot('p3-n-m3', 'Materia y energía', 0, 3, 'Clasifica', 8, 'p3-n-b3'),
        liveNaturalesRot('p3-n-m4', 'Energías', 2, 3, 'Verdadero o falso', 8, 'p3-n-b3'),
        liveNaturalesRot('p3-n-m5', 'Reto física', 1, 4, 'Ciencia', 9, 'p3-n-b3')
      ], { saberIds: ['p3-n-b3'] })
    ];
  }

  function primaria3Sociales() {
    return [
      unit('p3-s-entorno', 'Mi entorno', 'LOMLOE · Constitución, derechos y convivencia.', [
        liveSocialesRot('p3-s-e1', 'Constitución', 1, 2, 'Lee', 8, 'p3-s-b1'),
        liveSocialesRot('p3-s-e2', 'Ordena el texto', 2, 2, 'Historia', 8, 'p3-s-b1'),
        liveSocialesRot('p3-s-e3', 'Derechos', 0, 3, 'Mapas y leyes', 8, 'p3-s-b1'),
        liveSocialesRot('p3-s-e4', 'Debate corto', 1, 3, 'Convivencia', 8, 'p3-s-b1'),
        liveSocialesRot('p3-s-e5', 'Misión ciudadana', 2, 4, 'Ordena', 9, 'p3-s-b1')
      ], { saberIds: ['p3-s-b1'] }),
      unit('p3-s-mapas', 'Mapas y paisaje', 'LOMLOE · península, clima y relieve.', [
        liveSocialesRot('p3-s-m1', 'Península Ibérica', 0, 2, 'Mapas', 8, 'p3-s-b2'),
        liveSocialesRot('p3-s-m2', 'Clima y relieve', 1, 3, 'Lee y responde', 8, 'p3-s-b2'),
        liveSocialesRot('p3-s-m3', 'Climas de España', 2, 3, 'Ordena', 8, 'p3-s-b2'),
        liveSocialesRot('p3-s-m4', 'Escala del mapa', 0, 4, 'Geografía', 9, 'p3-s-b2'),
        liveSocialesRot('p3-s-m5', 'Reto mapas', 1, 4, 'España', 9, 'p3-s-b2')
      ], { saberIds: ['p3-s-b2'] }),
      unit('p3-s-historia', 'Historia cercana', 'LOMLOE · Edad Antigua y Media.', [
        liveSocialesRot('p3-s-h1', 'Ordena: Roma', 2, 2, 'Palabras', 8, 'p3-s-b3'),
        liveSocialesRot('p3-s-h2', 'Edad Media', 1, 3, 'Preguntas', 8, 'p3-s-b3'),
        liveSocialesRot('p3-s-h3', 'Castillos', 0, 3, 'Mapas', 8, 'p3-s-b3'),
        liveSocialesRot('p3-s-h4', 'Línea del tiempo', 2, 4, 'Ordena', 9, 'p3-s-b3'),
        liveSocialesRot('p3-s-h5', 'Misión histórica', 1, 4, 'Historia', 9, 'p3-s-b3')
      ], { saberIds: ['p3-s-b3'] })
    ];
  }

  function primaria3Daily() {
    return mapDailyFromP1('p3', 2);
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

  /** —— 4º Primaria (LOMLOE RD 157/2022) —— */
  function primaria4Math() {
    return [
      unit('p4-m-num', 'Números hasta 10.000', 'LOMLOE · valor posicional y comparación.', [
        liveGame('p4-m-num1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-a1'),
        liveMates('p4-m-num2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-a1'),
        liveGame('p4-m-num3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-a1'),
        liveMates('p4-m-num4', 'Dos pasos', 2, 3, 6, null, 'p4-m-a1'),
        soon('p4-m-num5', 'Misión Números hasta 10.000', 'quiz', 5)
      ], { saberIds: ['p4-m-a1'] }),
      unit('p4-m-ops', 'Multiplicación y división', 'LOMLOE · productos y repartos con números mayores.', [
        liveGame('p4-m-ops1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-a2'),
        liveMates('p4-m-ops2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-a2'),
        liveGame('p4-m-ops3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-a2'),
        liveMates('p4-m-ops4', 'Dos pasos', 2, 3, 6, null, 'p4-m-a2'),
        soon('p4-m-ops5', 'Misión Multiplicación y división', 'quiz', 5)
      ], { saberIds: ['p4-m-a2'] }),
      unit('p4-m-frac', 'Fracciones equivalentes', 'LOMLOE · comparar y simplificar fracciones.', [
        liveGame('p4-m-frac1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-a3'),
        liveMates('p4-m-frac2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-a3'),
        liveGame('p4-m-frac3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-a3'),
        liveMates('p4-m-frac4', 'Dos pasos', 2, 3, 6, null, 'p4-m-a3'),
        soon('p4-m-frac5', 'Misión Fracciones equivalentes', 'quiz', 5)
      ], { saberIds: ['p4-m-a3'] }),
      unit('p4-m-dec', 'Decimales', 'LOMLOE · décimas, centésimas y cálculo.', [
        liveGame('p4-m-dec1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-b1'),
        liveMates('p4-m-dec2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-b1'),
        liveGame('p4-m-dec3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-b1'),
        liveMates('p4-m-dec4', 'Dos pasos', 2, 3, 6, null, 'p4-m-b1'),
        soon('p4-m-dec5', 'Misión Decimales', 'quiz', 5)
      ], { saberIds: ['p4-m-b1'] }),
      unit('p4-m-prob', 'Problemas multiplicativos', 'LOMLOE · planificar operaciones combinadas.', [
        liveGame('p4-m-prob1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-a4'),
        liveMates('p4-m-prob2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-a4'),
        liveGame('p4-m-prob3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-a4'),
        liveMates('p4-m-prob4', 'Dos pasos', 2, 3, 6, null, 'p4-m-a4'),
        soon('p4-m-prob5', 'Misión Problemas multiplicativos', 'quiz', 5)
      ], { saberIds: ['p4-m-a4'] }),
    ];
  }

  function primaria4Lengua() {
    return [
      unit('p4-l-textos', 'Comprensión lectora', 'LOMLOE · textos para 4º.', [
        liveLengua('p4-l-textos1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 9, 'p4-l-c1'),
        liveLenguaRot('p4-l-textos2', 'Ordena la frase', 2, 2, 'Sintaxis', 9, 'p4-l-c1'),
        liveLenguaRot('p4-l-textos3', 'Completa', 1, 3, 'Ortografía', 9, 'p4-l-c1'),
        soon('p4-l-textos4', 'Dictado', 'listening', 4),
        soon('p4-l-textos5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p4-l-c1'] }),
      unit('p4-l-orto', 'Ortografía', 'LOMLOE · reglas ortográficas de 4º.', [
        liveLengua('p4-l-orto1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 9, 'p4-l-c2'),
        liveLenguaRot('p4-l-orto2', 'Ordena la frase', 2, 2, 'Sintaxis', 9, 'p4-l-c2'),
        liveLenguaRot('p4-l-orto3', 'Completa', 1, 3, 'Ortografía', 9, 'p4-l-c2'),
        soon('p4-l-orto4', 'Dictado', 'listening', 4),
        soon('p4-l-orto5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p4-l-c2'] }),
      unit('p4-l-gram', 'Sintaxis y literatura', 'LOMLOE · gramática y géneros literarios.', [
        liveLengua('p4-l-gram1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 9, 'p4-l-c3'),
        liveLenguaRot('p4-l-gram2', 'Ordena la frase', 2, 2, 'Sintaxis', 9, 'p4-l-c3'),
        liveLenguaRot('p4-l-gram3', 'Completa', 1, 3, 'Ortografía', 9, 'p4-l-c3'),
        soon('p4-l-gram4', 'Dictado', 'listening', 4),
        soon('p4-l-gram5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p4-l-c3'] }),
    ];
  }

  function primaria4Ingles() {
    return [
      unit('p4-i-past', 'Past simple', 'LOMLOE · acciones pasadas.', [
        liveIngles('p4-i-past1', 'Vocab drill', 0, 1, 4, null, 'p4-i-e1'),
        liveIngles('p4-i-past2', 'Listen & tap', 1, 2, 4, null, 'p4-i-e1'),
        soon('p4-i-past3', 'Fill the gap', 'typing', 3),
        soon('p4-i-past4', 'Grammar quiz', 'quiz', 4),
        soon('p4-i-past5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p4-i-e1'] }),
      unit('p4-i-comp', 'Comparatives', 'LOMLOE · comparar en inglés.', [
        liveIngles('p4-i-comp1', 'Vocab drill', 0, 1, 4, null, 'p4-i-e2'),
        liveIngles('p4-i-comp2', 'Listen & tap', 1, 2, 4, null, 'p4-i-e2'),
        soon('p4-i-comp3', 'Fill the gap', 'typing', 3),
        soon('p4-i-comp4', 'Grammar quiz', 'quiz', 4),
        soon('p4-i-comp5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p4-i-e2'] }),
      unit('p4-i-read', 'Reading comprehension', 'LOMLOE · leer y responder.', [
        liveIngles('p4-i-read1', 'Vocab drill', 0, 1, 4, null, 'p4-i-e3'),
        liveIngles('p4-i-read2', 'Listen & tap', 1, 2, 4, null, 'p4-i-e3'),
        soon('p4-i-read3', 'Fill the gap', 'typing', 3),
        soon('p4-i-read4', 'Grammar quiz', 'quiz', 4),
        soon('p4-i-read5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p4-i-e3'] }),
    ];
  }

  function primaria4Naturales() {
    return [
      unit('p4-n-cel', 'Célula y clasificación', 'LOMLOE · seres vivos y funciones vitales.', [
        liveNaturalesRot('p4-n-cel1', 'Preguntas', 1, 2, 'Ciencia', 9, 'p4-n-b1'),
        liveNaturalesRot('p4-n-cel2', 'Verdadero o falso', 2, 2, 'Lee', 9, 'p4-n-b1'),
        liveNaturalesRot('p4-n-cel3', 'Clasifica', 0, 3, 'Naturales', 9, 'p4-n-b1'),
        liveNaturalesRot('p4-n-cel4', 'Experimento virtual', 1, 3, 'Comprensión', 10, 'p4-n-b1'),
        liveNaturalesRot('p4-n-cel5', 'Reto científico', 2, 4, 'Misión', 10, 'p4-n-b1')
      ], { saberIds: ['p4-n-b1'] }),
      unit('p4-n-sal', 'Salud y consumo', 'LOMLOE · hábitos y alimentación.', [
        liveNaturalesRot('p4-n-sal1', 'Preguntas', 1, 2, 'Ciencia', 9, 'p4-n-b2'),
        liveNaturalesRot('p4-n-sal2', 'Verdadero o falso', 2, 2, 'Lee', 9, 'p4-n-b2'),
        liveNaturalesRot('p4-n-sal3', 'Clasifica', 0, 3, 'Naturales', 9, 'p4-n-b2'),
        liveNaturalesRot('p4-n-sal4', 'Experimento virtual', 1, 3, 'Comprensión', 10, 'p4-n-b2'),
        liveNaturalesRot('p4-n-sal5', 'Reto científico', 2, 4, 'Misión', 10, 'p4-n-b2')
      ], { saberIds: ['p4-n-b2'] }),
      unit('p4-n-fuer', 'Fuerzas y máquinas', 'LOMLOE · movimiento y energía mecánica.', [
        liveNaturalesRot('p4-n-fuer1', 'Preguntas', 1, 2, 'Ciencia', 9, 'p4-n-b3'),
        liveNaturalesRot('p4-n-fuer2', 'Verdadero o falso', 2, 2, 'Lee', 9, 'p4-n-b3'),
        liveNaturalesRot('p4-n-fuer3', 'Clasifica', 0, 3, 'Naturales', 9, 'p4-n-b3'),
        liveNaturalesRot('p4-n-fuer4', 'Experimento virtual', 1, 3, 'Comprensión', 10, 'p4-n-b3'),
        liveNaturalesRot('p4-n-fuer5', 'Reto científico', 2, 4, 'Misión', 10, 'p4-n-b3')
      ], { saberIds: ['p4-n-b3'] }),
    ];
  }

  function primaria4Sociales() {
    return [
      unit('p4-s-der', 'Derechos y participación', 'LOMLOE · democracia local.', [
        liveSocialesRot('p4-s-der1', 'Lee y responde', 1, 2, 'Historia', 9, 'p4-s-b1'),
        liveSocialesRot('p4-s-der2', 'Mapas', 0, 2, 'Geografía', 9, 'p4-s-b1'),
        liveSocialesRot('p4-s-der3', 'Ordena', 2, 3, 'Convivencia', 9, 'p4-s-b1'),
        liveSocialesRot('p4-s-der4', 'Debate corto', 1, 3, 'Ciudadanía', 10, 'p4-s-b1'),
        liveSocialesRot('p4-s-der5', 'Misión social', 2, 4, 'Reto', 10, 'p4-s-b1')
      ], { saberIds: ['p4-s-b1'] }),
      unit('p4-s-auto', 'Autonomías y economía', 'LOMLOE · territorio y recursos.', [
        liveSocialesRot('p4-s-auto1', 'Lee y responde', 1, 2, 'Historia', 9, 'p4-s-b2'),
        liveSocialesRot('p4-s-auto2', 'Mapas', 0, 2, 'Geografía', 9, 'p4-s-b2'),
        liveSocialesRot('p4-s-auto3', 'Ordena', 2, 3, 'Convivencia', 9, 'p4-s-b2'),
        liveSocialesRot('p4-s-auto4', 'Debate corto', 1, 3, 'Ciudadanía', 10, 'p4-s-b2'),
        liveSocialesRot('p4-s-auto5', 'Misión social', 2, 4, 'Reto', 10, 'p4-s-b2')
      ], { saberIds: ['p4-s-b2'] }),
      unit('p4-s-mod', 'Edad Moderna temprana', 'LOMLOE · descubrimientos.', [
        liveSocialesRot('p4-s-mod1', 'Lee y responde', 1, 2, 'Historia', 9, 'p4-s-b3'),
        liveSocialesRot('p4-s-mod2', 'Mapas', 0, 2, 'Geografía', 9, 'p4-s-b3'),
        liveSocialesRot('p4-s-mod3', 'Ordena', 2, 3, 'Convivencia', 9, 'p4-s-b3'),
        liveSocialesRot('p4-s-mod4', 'Debate corto', 1, 3, 'Ciudadanía', 10, 'p4-s-b3'),
        liveSocialesRot('p4-s-mod5', 'Misión social', 2, 4, 'Reto', 10, 'p4-s-b3')
      ], { saberIds: ['p4-s-b3'] }),
    ];
  }

  function primaria4Daily() {
    return mapDailyFromP1('p4', 3);
  }

  /** —— 5º Primaria (LOMLOE RD 157/2022) —— */
  function primaria5Math() {
    return [
      unit('p5-m-dec', 'Operaciones con decimales', 'LOMLOE · sumar, restar y multiplicar decimales.', [
        liveGame('p5-m-dec1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-a1'),
        liveMates('p5-m-dec2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-a1'),
        liveGame('p5-m-dec3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-a1'),
        liveMates('p5-m-dec4', 'Dos pasos', 2, 3, 7, null, 'p5-m-a1'),
        soon('p5-m-dec5', 'Misión Operaciones con decimales', 'quiz', 5)
      ], { saberIds: ['p5-m-a1'] }),
      unit('p5-m-frac', 'Fracciones y decimales', 'LOMLOE · equivalencias y comparación.', [
        liveGame('p5-m-frac1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-a2'),
        liveMates('p5-m-frac2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-a2'),
        liveGame('p5-m-frac3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-a2'),
        liveMates('p5-m-frac4', 'Dos pasos', 2, 3, 7, null, 'p5-m-a2'),
        soon('p5-m-frac5', 'Misión Fracciones y decimales', 'quiz', 5)
      ], { saberIds: ['p5-m-a2'] }),
      unit('p5-m-pct', 'Porcentajes básicos', 'LOMLOE · descuentos y partes de un todo.', [
        liveGame('p5-m-pct1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-a3'),
        liveMates('p5-m-pct2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-a3'),
        liveGame('p5-m-pct3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-a3'),
        liveMates('p5-m-pct4', 'Dos pasos', 2, 3, 7, null, 'p5-m-a3'),
        soon('p5-m-pct5', 'Misión Porcentajes básicos', 'quiz', 5)
      ], { saberIds: ['p5-m-a3'] }),
      unit('p5-m-med', 'Área y volumen', 'LOMLOE · medidas, perímetro y volumen.', [
        liveGame('p5-m-med1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-b1'),
        liveMates('p5-m-med2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-b1'),
        liveGame('p5-m-med3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-b1'),
        liveMates('p5-m-med4', 'Dos pasos', 2, 3, 7, null, 'p5-m-b1'),
        soon('p5-m-med5', 'Misión Área y volumen', 'quiz', 5)
      ], { saberIds: ['p5-m-b1'] }),
      unit('p5-m-prop', 'Problemas de proporción', 'LOMLOE · escalas y repartos proporcionales.', [
        liveGame('p5-m-prop1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-a4'),
        liveMates('p5-m-prop2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-a4'),
        liveGame('p5-m-prop3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-a4'),
        liveMates('p5-m-prop4', 'Dos pasos', 2, 3, 7, null, 'p5-m-a4'),
        soon('p5-m-prop5', 'Misión Problemas de proporción', 'quiz', 5)
      ], { saberIds: ['p5-m-a4'] }),
    ];
  }

  function primaria5Lengua() {
    return [
      unit('p5-l-arg', 'Textos argumentativos', 'LOMLOE · opinión y causa-consecuencia.', [
        liveLengua('p5-l-arg1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 10, 'p5-l-c1'),
        liveLenguaRot('p5-l-arg2', 'Ordena la frase', 2, 2, 'Sintaxis', 10, 'p5-l-c1'),
        liveLenguaRot('p5-l-arg3', 'Completa', 1, 3, 'Ortografía', 10, 'p5-l-c1'),
        soon('p5-l-arg4', 'Dictado', 'listening', 4),
        soon('p5-l-arg5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p5-l-c1'] }),
      unit('p5-l-orto', 'Ortografía', 'LOMLOE · reglas ortográficas de 5º.', [
        liveLengua('p5-l-orto1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 10, 'p5-l-c2'),
        liveLenguaRot('p5-l-orto2', 'Ordena la frase', 2, 2, 'Sintaxis', 10, 'p5-l-c2'),
        liveLenguaRot('p5-l-orto3', 'Completa', 1, 3, 'Ortografía', 10, 'p5-l-c2'),
        soon('p5-l-orto4', 'Dictado', 'listening', 4),
        soon('p5-l-orto5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p5-l-c2'] }),
      unit('p5-l-gram', 'Gramática avanzada', 'LOMLOE · oración compuesta.', [
        liveLengua('p5-l-gram1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 10, 'p5-l-c3'),
        liveLenguaRot('p5-l-gram2', 'Ordena la frase', 2, 2, 'Sintaxis', 10, 'p5-l-c3'),
        liveLenguaRot('p5-l-gram3', 'Completa', 1, 3, 'Ortografía', 10, 'p5-l-c3'),
        soon('p5-l-gram4', 'Dictado', 'listening', 4),
        soon('p5-l-gram5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p5-l-c3'] }),
    ];
  }

  function primaria5Ingles() {
    return [
      unit('p5-i-perf', 'Present perfect', 'LOMLOE · experiencias recientes.', [
        liveIngles('p5-i-perf1', 'Vocab drill', 0, 1, 5, null, 'p5-i-e1'),
        liveIngles('p5-i-perf2', 'Listen & tap', 1, 2, 5, null, 'p5-i-e1'),
        soon('p5-i-perf3', 'Fill the gap', 'typing', 3),
        soon('p5-i-perf4', 'Grammar quiz', 'quiz', 4),
        soon('p5-i-perf5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p5-i-e1'] }),
      unit('p5-i-fut', 'Future forms', 'LOMLOE · will y going to.', [
        liveIngles('p5-i-fut1', 'Vocab drill', 0, 1, 5, null, 'p5-i-e2'),
        liveIngles('p5-i-fut2', 'Listen & tap', 1, 2, 5, null, 'p5-i-e2'),
        soon('p5-i-fut3', 'Fill the gap', 'typing', 3),
        soon('p5-i-fut4', 'Grammar quiz', 'quiz', 4),
        soon('p5-i-fut5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p5-i-e2'] }),
      unit('p5-i-oral', 'Oral presentations', 'LOMLOE · exponer ideas.', [
        liveIngles('p5-i-oral1', 'Vocab drill', 0, 1, 5, null, 'p5-i-e3'),
        liveIngles('p5-i-oral2', 'Listen & tap', 1, 2, 5, null, 'p5-i-e3'),
        soon('p5-i-oral3', 'Fill the gap', 'typing', 3),
        soon('p5-i-oral4', 'Grammar quiz', 'quiz', 4),
        soon('p5-i-oral5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p5-i-e3'] }),
    ];
  }

  function primaria5Naturales() {
    return [
      unit('p5-n-rep', 'Reproducción y herencia', 'LOMLOE · ciclos vitales.', [
        liveNaturalesRot('p5-n-rep1', 'Preguntas', 1, 2, 'Ciencia', 10, 'p5-n-b1'),
        liveNaturalesRot('p5-n-rep2', 'Verdadero o falso', 2, 2, 'Lee', 10, 'p5-n-b1'),
        liveNaturalesRot('p5-n-rep3', 'Clasifica', 0, 3, 'Naturales', 10, 'p5-n-b1'),
        liveNaturalesRot('p5-n-rep4', 'Experimento virtual', 1, 3, 'Comprensión', 11, 'p5-n-b1'),
        liveNaturalesRot('p5-n-rep5', 'Reto científico', 2, 4, 'Misión', 11, 'p5-n-b1')
      ], { saberIds: ['p5-n-b1'] }),
      unit('p5-n-eco', 'Ecosistemas', 'LOMLOE · medio ambiente y sostenibilidad.', [
        liveNaturalesRot('p5-n-eco1', 'Preguntas', 1, 2, 'Ciencia', 10, 'p5-n-b2'),
        liveNaturalesRot('p5-n-eco2', 'Verdadero o falso', 2, 2, 'Lee', 10, 'p5-n-b2'),
        liveNaturalesRot('p5-n-eco3', 'Clasifica', 0, 3, 'Naturales', 10, 'p5-n-b2'),
        liveNaturalesRot('p5-n-eco4', 'Experimento virtual', 1, 3, 'Comprensión', 11, 'p5-n-b2'),
        liveNaturalesRot('p5-n-eco5', 'Reto científico', 2, 4, 'Misión', 11, 'p5-n-b2')
      ], { saberIds: ['p5-n-b2'] }),
      unit('p5-n-luz', 'Luz, sonido y electricidad', 'LOMLOE · ondas y circuitos.', [
        liveNaturalesRot('p5-n-luz1', 'Preguntas', 1, 2, 'Ciencia', 10, 'p5-n-b3'),
        liveNaturalesRot('p5-n-luz2', 'Verdadero o falso', 2, 2, 'Lee', 10, 'p5-n-b3'),
        liveNaturalesRot('p5-n-luz3', 'Clasifica', 0, 3, 'Naturales', 10, 'p5-n-b3'),
        liveNaturalesRot('p5-n-luz4', 'Experimento virtual', 1, 3, 'Comprensión', 11, 'p5-n-b3'),
        liveNaturalesRot('p5-n-luz5', 'Reto científico', 2, 4, 'Misión', 11, 'p5-n-b3')
      ], { saberIds: ['p5-n-b3'] }),
    ];
  }

  function primaria5Sociales() {
    return [
      unit('p5-s-gob', 'Gobierno y democracia', 'LOMLOE · instituciones.', [
        liveSocialesRot('p5-s-gob1', 'Lee y responde', 1, 2, 'Historia', 10, 'p5-s-b1'),
        liveSocialesRot('p5-s-gob2', 'Mapas', 0, 2, 'Geografía', 10, 'p5-s-b1'),
        liveSocialesRot('p5-s-gob3', 'Ordena', 2, 3, 'Convivencia', 10, 'p5-s-b1'),
        liveSocialesRot('p5-s-gob4', 'Debate corto', 1, 3, 'Ciudadanía', 11, 'p5-s-b1'),
        liveSocialesRot('p5-s-gob5', 'Misión social', 2, 4, 'Reto', 11, 'p5-s-b1')
      ], { saberIds: ['p5-s-b1'] }),
      unit('p5-s-geo', 'Recursos y población', 'LOMLOE · geografía humana.', [
        liveSocialesRot('p5-s-geo1', 'Lee y responde', 1, 2, 'Historia', 10, 'p5-s-b2'),
        liveSocialesRot('p5-s-geo2', 'Mapas', 0, 2, 'Geografía', 10, 'p5-s-b2'),
        liveSocialesRot('p5-s-geo3', 'Ordena', 2, 3, 'Convivencia', 10, 'p5-s-b2'),
        liveSocialesRot('p5-s-geo4', 'Debate corto', 1, 3, 'Ciudadanía', 11, 'p5-s-b2'),
        liveSocialesRot('p5-s-geo5', 'Misión social', 2, 4, 'Reto', 11, 'p5-s-b2')
      ], { saberIds: ['p5-s-b2'] }),
      unit('p5-s-cont', 'Edad Moderna y Contemporánea', 'LOMLOE · revoluciones.', [
        liveSocialesRot('p5-s-cont1', 'Lee y responde', 1, 2, 'Historia', 10, 'p5-s-b3'),
        liveSocialesRot('p5-s-cont2', 'Mapas', 0, 2, 'Geografía', 10, 'p5-s-b3'),
        liveSocialesRot('p5-s-cont3', 'Ordena', 2, 3, 'Convivencia', 10, 'p5-s-b3'),
        liveSocialesRot('p5-s-cont4', 'Debate corto', 1, 3, 'Ciudadanía', 11, 'p5-s-b3'),
        liveSocialesRot('p5-s-cont5', 'Misión social', 2, 4, 'Reto', 11, 'p5-s-b3')
      ], { saberIds: ['p5-s-b3'] }),
    ];
  }

  function primaria5Daily() {
    return mapDailyFromP1('p5', 4);
  }

  /** —— 6º Primaria (LOMLOE RD 157/2022) —— */
  function primaria6Math() {
    return [
      unit('p6-m-prop', 'Proporcionalidad', 'LOMLOE · regla de tres y magnitudes.', [
        liveGame('p6-m-prop1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-a1'),
        liveMates('p6-m-prop2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-a1'),
        liveGame('p6-m-prop3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-a1'),
        liveMates('p6-m-prop4', 'Dos pasos', 2, 3, 8, null, 'p6-m-a1'),
        soon('p6-m-prop5', 'Misión Proporcionalidad', 'quiz', 5)
      ], { saberIds: ['p6-m-a1'] }),
      unit('p6-m-int', 'Números enteros', 'LOMLOE · positivos, negativos y recta numérica.', [
        liveGame('p6-m-int1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-a2'),
        liveMates('p6-m-int2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-a2'),
        liveGame('p6-m-int3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-a2'),
        liveMates('p6-m-int4', 'Dos pasos', 2, 3, 8, null, 'p6-m-a2'),
        soon('p6-m-int5', 'Misión Números enteros', 'quiz', 5)
      ], { saberIds: ['p6-m-a2'] }),
      unit('p6-m-frac', 'Fracciones avanzadas', 'LOMLOE · operaciones combinadas.', [
        liveGame('p6-m-frac1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-a3'),
        liveMates('p6-m-frac2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-a3'),
        liveGame('p6-m-frac3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-a3'),
        liveMates('p6-m-frac4', 'Dos pasos', 2, 3, 8, null, 'p6-m-a3'),
        soon('p6-m-frac5', 'Misión Fracciones avanzadas', 'quiz', 5)
      ], { saberIds: ['p6-m-a3'] }),
      unit('p6-m-stat', 'Estadística básica', 'LOMLOE · media, moda y gráficos.', [
        liveGame('p6-m-stat1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-b1'),
        liveMates('p6-m-stat2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-b1'),
        liveGame('p6-m-stat3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-b1'),
        liveMates('p6-m-stat4', 'Dos pasos', 2, 3, 8, null, 'p6-m-b1'),
        soon('p6-m-stat5', 'Misión Estadística básica', 'quiz', 5)
      ], { saberIds: ['p6-m-b1'] }),
      unit('p6-m-alg', 'Álgebra inicial', 'LOMLOE · incógnitas y problemas complejos.', [
        liveGame('p6-m-alg1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-a4'),
        liveMates('p6-m-alg2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-a4'),
        liveGame('p6-m-alg3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-a4'),
        liveMates('p6-m-alg4', 'Dos pasos', 2, 3, 8, null, 'p6-m-a4'),
        soon('p6-m-alg5', 'Misión Álgebra inicial', 'quiz', 5)
      ], { saberIds: ['p6-m-a4'] }),
    ];
  }

  function primaria6Lengua() {
    return [
      unit('p6-l-anal', 'Análisis de textos', 'LOMLOE · ideas y argumentos.', [
        liveLengua('p6-l-anal1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 11, 'p6-l-c1'),
        liveLenguaRot('p6-l-anal2', 'Ordena la frase', 2, 2, 'Sintaxis', 11, 'p6-l-c1'),
        liveLenguaRot('p6-l-anal3', 'Completa', 1, 3, 'Ortografía', 11, 'p6-l-c1'),
        soon('p6-l-anal4', 'Dictado', 'listening', 4),
        soon('p6-l-anal5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p6-l-c1'] }),
      unit('p6-l-red', 'Ortografía y redacción', 'LOMLOE · textos formales.', [
        liveLengua('p6-l-red1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 11, 'p6-l-c2'),
        liveLenguaRot('p6-l-red2', 'Ordena la frase', 2, 2, 'Sintaxis', 11, 'p6-l-c2'),
        liveLenguaRot('p6-l-red3', 'Completa', 1, 3, 'Ortografía', 11, 'p6-l-c2'),
        soon('p6-l-red4', 'Dictado', 'listening', 4),
        soon('p6-l-red5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p6-l-c2'] }),
      unit('p6-l-lit', 'Literatura española', 'LOMLOE · autores y géneros.', [
        liveLengua('p6-l-lit1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 11, 'p6-l-c3'),
        liveLenguaRot('p6-l-lit2', 'Ordena la frase', 2, 2, 'Sintaxis', 11, 'p6-l-c3'),
        liveLenguaRot('p6-l-lit3', 'Completa', 1, 3, 'Ortografía', 11, 'p6-l-c3'),
        soon('p6-l-lit4', 'Dictado', 'listening', 4),
        soon('p6-l-lit5', 'Misión lengua', 'quiz', 5)
      ], { saberIds: ['p6-l-c3'] }),
    ];
  }

  function primaria6Ingles() {
    return [
      unit('p6-i-cond', 'Conditionals and modals', 'LOMLOE · hipótesis y obligación.', [
        liveIngles('p6-i-cond1', 'Vocab drill', 0, 1, 6, null, 'p6-i-e1'),
        liveIngles('p6-i-cond2', 'Listen & tap', 1, 2, 6, null, 'p6-i-e1'),
        soon('p6-i-cond3', 'Fill the gap', 'typing', 3),
        soon('p6-i-cond4', 'Grammar quiz', 'quiz', 4),
        soon('p6-i-cond5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p6-i-e1'] }),
      unit('p6-i-pass', 'Passive voice', 'LOMLOE · transformaciones.', [
        liveIngles('p6-i-pass1', 'Vocab drill', 0, 1, 6, null, 'p6-i-e2'),
        liveIngles('p6-i-pass2', 'Listen & tap', 1, 2, 6, null, 'p6-i-e2'),
        soon('p6-i-pass3', 'Fill the gap', 'typing', 3),
        soon('p6-i-pass4', 'Grammar quiz', 'quiz', 4),
        soon('p6-i-pass5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p6-i-e2'] }),
      unit('p6-i-proj', 'Project language', 'LOMLOE · vocabulario académico.', [
        liveIngles('p6-i-proj1', 'Vocab drill', 0, 1, 6, null, 'p6-i-e3'),
        liveIngles('p6-i-proj2', 'Listen & tap', 1, 2, 6, null, 'p6-i-e3'),
        soon('p6-i-proj3', 'Fill the gap', 'typing', 3),
        soon('p6-i-proj4', 'Grammar quiz', 'quiz', 4),
        soon('p6-i-proj5', 'English mission', 'quiz', 5)
      ], { saberIds: ['p6-i-e3'] }),
    ];
  }

  function primaria6Naturales() {
    return [
      unit('p6-n-evo', 'Evolución y biodiversidad', 'LOMLOE · adaptación y conservación.', [
        liveNaturalesRot('p6-n-evo1', 'Preguntas', 1, 2, 'Ciencia', 11, 'p6-n-b1'),
        liveNaturalesRot('p6-n-evo2', 'Verdadero o falso', 2, 2, 'Lee', 11, 'p6-n-b1'),
        liveNaturalesRot('p6-n-evo3', 'Clasifica', 0, 3, 'Naturales', 11, 'p6-n-b1'),
        liveNaturalesRot('p6-n-evo4', 'Experimento virtual', 1, 3, 'Comprensión', 12, 'p6-n-b1'),
        liveNaturalesRot('p6-n-evo5', 'Reto científico', 2, 4, 'Misión', 12, 'p6-n-b1')
      ], { saberIds: ['p6-n-b1'] }),
      unit('p6-n-cuer', 'Cuerpo humano avanzado', 'LOMLOE · sistemas y salud.', [
        liveNaturalesRot('p6-n-cuer1', 'Preguntas', 1, 2, 'Ciencia', 11, 'p6-n-b2'),
        liveNaturalesRot('p6-n-cuer2', 'Verdadero o falso', 2, 2, 'Lee', 11, 'p6-n-b2'),
        liveNaturalesRot('p6-n-cuer3', 'Clasifica', 0, 3, 'Naturales', 11, 'p6-n-b2'),
        liveNaturalesRot('p6-n-cuer4', 'Experimento virtual', 1, 3, 'Comprensión', 12, 'p6-n-b2'),
        liveNaturalesRot('p6-n-cuer5', 'Reto científico', 2, 4, 'Misión', 12, 'p6-n-b2')
      ], { saberIds: ['p6-n-b2'] }),
      unit('p6-n-ene', 'Energía y sostenibilidad', 'LOMLOE · recursos y clima.', [
        liveNaturalesRot('p6-n-ene1', 'Preguntas', 1, 2, 'Ciencia', 11, 'p6-n-b3'),
        liveNaturalesRot('p6-n-ene2', 'Verdadero o falso', 2, 2, 'Lee', 11, 'p6-n-b3'),
        liveNaturalesRot('p6-n-ene3', 'Clasifica', 0, 3, 'Naturales', 11, 'p6-n-b3'),
        liveNaturalesRot('p6-n-ene4', 'Experimento virtual', 1, 3, 'Comprensión', 12, 'p6-n-b3'),
        liveNaturalesRot('p6-n-ene5', 'Reto científico', 2, 4, 'Misión', 12, 'p6-n-b3')
      ], { saberIds: ['p6-n-b3'] }),
    ];
  }

  function primaria6Sociales() {
    return [
      unit('p6-s-ue', 'Constitución y UE', 'LOMLOE · ciudadanía europea.', [
        liveSocialesRot('p6-s-ue1', 'Lee y responde', 1, 2, 'Historia', 11, 'p6-s-b1'),
        liveSocialesRot('p6-s-ue2', 'Mapas', 0, 2, 'Geografía', 11, 'p6-s-b1'),
        liveSocialesRot('p6-s-ue3', 'Ordena', 2, 3, 'Convivencia', 11, 'p6-s-b1'),
        liveSocialesRot('p6-s-ue4', 'Debate corto', 1, 3, 'Ciudadanía', 12, 'p6-s-b1'),
        liveSocialesRot('p6-s-ue5', 'Misión social', 2, 4, 'Reto', 12, 'p6-s-b1')
      ], { saberIds: ['p6-s-b1'] }),
      unit('p6-s-mund', 'Geografía mundial', 'LOMLOE · continentes y globalización.', [
        liveSocialesRot('p6-s-mund1', 'Lee y responde', 1, 2, 'Historia', 11, 'p6-s-b2'),
        liveSocialesRot('p6-s-mund2', 'Mapas', 0, 2, 'Geografía', 11, 'p6-s-b2'),
        liveSocialesRot('p6-s-mund3', 'Ordena', 2, 3, 'Convivencia', 11, 'p6-s-b2'),
        liveSocialesRot('p6-s-mund4', 'Debate corto', 1, 3, 'Ciudadanía', 12, 'p6-s-b2'),
        liveSocialesRot('p6-s-mund5', 'Misión social', 2, 4, 'Reto', 12, 'p6-s-b2')
      ], { saberIds: ['p6-s-b2'] }),
      unit('p6-s-sig', 'Historia contemporánea', 'LOMLOE · siglo XX.', [
        liveSocialesRot('p6-s-sig1', 'Lee y responde', 1, 2, 'Historia', 11, 'p6-s-b3'),
        liveSocialesRot('p6-s-sig2', 'Mapas', 0, 2, 'Geografía', 11, 'p6-s-b3'),
        liveSocialesRot('p6-s-sig3', 'Ordena', 2, 3, 'Convivencia', 11, 'p6-s-b3'),
        liveSocialesRot('p6-s-sig4', 'Debate corto', 1, 3, 'Ciudadanía', 12, 'p6-s-b3'),
        liveSocialesRot('p6-s-sig5', 'Misión social', 2, 4, 'Reto', 12, 'p6-s-b3')
      ], { saberIds: ['p6-s-b3'] }),
    ];
  }

  function primaria6Daily() {
    return mapDailyFromP1('p6', 5);
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

  function missionTipFor(subjectId, gameId, title) {
    var byGame = {
      'neon-calculo': 'Resuelve antes de que acabe el tiempo. Las rachas de aciertos suman más puntos.',
      'tablas-relampago': 'Si dudas, repite la tabla en voz alta y vuelve a intentarlo.',
      'neon-lectura': 'Lee la consigna entera antes de elegir la respuesta.',
      'neon-frase': 'Ordena las palabras como en un cuento del cole.',
      'neon-palabra': 'Fíjate en las sílabas y elige la que encaja.',
      'neon-palabras': 'Une la palabra en español con su pareja en inglés.',
      'neon-peques': 'Mira la imagen y toca la respuesta correcta.',
      'neon-colores': 'Observa el color o la forma y responde sin prisa.',
      'neon-vida': 'Clasifica con calma: ¿es un ser vivo o no?',
      'neon-cuerpo': 'Piensa en lo que has visto en ciencias del cole.',
      'neon-planeta': 'Recuerda lo que el profesor explicó en clase.',
      'neon-mapa': 'Ubica el lugar en el mapa con paciencia.',
      'neon-entorno': 'Normas y convivencia: elige la opción más respetuosa.',
      'neon-historia': 'Ordena los hechos como una línea del tiempo.',
      'neon-ordenar': 'Toca en el orden correcto (números, palabras o frases).',
      'neon-clasifica': 'Agrupa en la categoría que pide la consigna.',
      'neon-mayor-menor': 'Lee si pide el número mayor o el menor.',
      'flash-tap': 'Toca cada objetivo antes de que desaparezca.',
      'reaction-test': 'Espera al verde. Si pulsas antes, no cuenta.',
      'aim-trainer': 'Precisión y calma: cada diana suma.',
      'grid-reflex': 'Memoriza la cuadrícula y repite el patrón.',
      'stack-tower': 'Apila con ritmo; la precisión importa más que la velocidad.'
    };
    if (byGame[gameId]) return byGame[gameId];
    var bySubject = {
      matematicas: 'Cada acierto te acerca a completar la misión de mates.',
      lenguaje: 'Lengua del cole: lee bien y no tengas miedo a equivocarte.',
      ingles: 'Practica vocabulario en inglés como en clase.',
      naturales: 'Ciencias con imágenes: piensa y elige.',
      sociales: 'Historia y mapas: ordena ideas con calma.',
      'brain-gym-diario': 'Calentamiento rápido: reflejos y atención.'
    };
    return bySubject[subjectId] || ('Misión: ' + (title || 'practica') + '. Termina la ronda para guardar progreso.');
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
            act.tip = missionTipFor(block.subjectId, gameId, act.title);
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
