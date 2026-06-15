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

  var ROT_MATES = ['neon-calculo', 'neon-ordenar', 'neon-mayor-menor', 'neon-clasifica', 'neon-fracciones'];
  var ROT_INGLES = ['neon-palabras', 'neon-dictado'];
  var ROT_INFANTIL = ['neon-peques', 'neon-colores', 'neon-numeros'];
  var ROT_INFANTIL_EN = ['neon-peques', 'neon-palabras', 'neon-colores'];
  var ROT_NATURALES = ['neon-vida', 'neon-cuerpo', 'neon-planeta'];
  var ROT_SOCIALES = ['neon-mapa', 'neon-entorno', 'neon-historia'];
  var ROT_LENGUA = ['neon-lectura', 'neon-silabas', 'neon-palabra', 'neon-frase', 'neon-dictado', 'neon-arrastra'];

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

  function wrapInfGame(id, title, gameId, difficulty, tip, brainLevel, saberIds) {
    return tagSaber(liveGame(id, title, gameId, difficulty, brainLevel, tip || 'Infantil', saberIds), saberIds);
  }

  function infD(tier) {
    return tier === 0 ? 1 : 2;
  }

  function infRx(tier) {
    return tier === 0 ? 1 : 2;
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
    var countTip = tier === 0 ? 'hasta 3' : tier === 1 ? 'hasta 5' : 'hasta 10';
    var d = infD(tier);
    var rx = infRx(tier);
    return [
      subject('matematicas', [
        unit(id + '-m-colores', 'Cantidad, color y forma', 'LOMLOE · dimensión lógico-matemática.', [
          wrapInfantil(id + '-m-c1', '¿Qué color?', 0, 1, 'Toca el color', bl, infSid(tier, 'm', 2)),
          wrapInfantil(id + '-m-c2', '¿Cuántos hay?', 1, 1, 'Cuenta ' + countTip, bl, infSid(tier, 'm', 1)),
          wrapInfantil(id + '-m-c3', tier >= 1 ? 'Toca rápido' : 'Grande o pequeño', 3, d, tier >= 1 ? 'Atención' : 'Elige', bl, infSid(tier, 'l', 3)),
          wrapInfGame(id + '-m-c4', 'Formas', 'neon-empareja', d, 'Igual o diferente', bl, infSid(tier, 'm', 3)),
          tagSaber(liveReflex(id + '-m-c5', 'Reto visual', 'flash-tap', rx), infSid(tier, 'm', 4))
        ], { saberIds: [infSid(tier, 'm', 1), infSid(tier, 'm', 2), infSid(tier, 'm', 3)] }),
        unit(id + '-m-formas', 'Clasificar y reconocer', 'Agrupar por color, forma o tamaño.', [
          wrapInfantil(id + '-m-f1', '¿Qué forma es?', 0, 1, 'Círculo, cuadrado…', bl, infSid(tier, 'm', 3)),
          tagSaber(wrapInfantil(id + '-m-f2', 'Colores mix', 0, 2, 'Repaso', bl, infSid(tier, 'm', 2)), infSid(tier, 'm', 4)),
          wrapInfantil(id + '-m-f3', tier >= 1 ? 'Cuenta y toca' : 'Igual o diferente', 1, d, 'Números', bl, infSid(tier, 'm', 1)),
          wrapInfGame(id + '-m-f4', 'Seriaciones', 'neon-arrastra', d, 'Arrastra', bl, infSid(tier, 'm', 4)),
          tagSaber(liveReflex(id + '-m-f5', 'Misión formas', 'flash-tap', rx + 1), infSid(tier, 'm', 4))
        ], { saberIds: [infSid(tier, 'm', 3), infSid(tier, 'm', 4)] })
      ], 'live'),
      subject('lenguaje', [
        unit(id + '-l-vocab', 'Vocabulario y comprensión', 'LOMLOE · comunicación y representación.', [
          wrapInfantil(id + '-l-v1', 'Nombres', 0, 1, 'Toca la palabra', bl, infSid(tier, 'l', 1)),
          wrapInfantil(id + '-l-v2', '¿Qué es esto?', 1, 2, 'Imagen y palabra', bl, infSid(tier, 'l', 1)),
          tier === 0
            ? wrapInfantil(id + '-l-v3', 'Sigue la consigna', 0, 1, 'Toca lo que pide', bl, infSid(tier, 'l', 2))
            : tagSaber(wrapInfantil(id + '-l-v3', 'Colores y palabras', 0, 2, 'Repaso', bl, infSid(tier, 'l', 1)), infSid(tier, 'l', 2)),
          wrapInfGame(id + '-l-v4', 'Sonidos iniciales', 'neon-empareja', d, 'Primera letra', bl, infSid(tier, 'l', 2)),
          wrapInfGame(id + '-l-v5', 'Cuento corto', 'neon-dictado', d, 'Escucha', bl, infSid(tier, 'l', 1))
        ], { saberIds: [infSid(tier, 'l', 1), infSid(tier, 'l', 2)] }),
        unit(id + '-l-sonidos', 'Atención y lenguaje', 'Discriminación visual y auditiva suave.', [
          wrapInfantil(id + '-l-s1', 'Palabras', 2, 1, 'Escucha con los ojos', bl, infSid(tier, 'l', 3)),
          wrapInfGame(id + '-l-s2', 'Sílabas con palmas', 'neon-dictado', d, 'Escucha', bl, infSid(tier, 'l', 3)),
          wrapInfGame(id + '-l-s3', 'Empieza por…', 'neon-dictado', d, 'Sonidos', bl, infSid(tier, 'l', 3)),
          wrapInfGame(id + '-l-s4', 'Canción', 'neon-dictado', d, 'Ritmo', bl, infSid(tier, 'l', 3)),
          wrapInfGame(id + '-l-s5', 'Reto sonidos', 'neon-dictado', d + 1, 'Palabras', bl, infSid(tier, 'l', 3))
        ], { saberIds: [infSid(tier, 'l', 3)] })
      ], 'live'),
      subject('ingles', [
        unit(id + '-i-hola', 'Hello — primeras palabras', 'Comprensión oral inicial de vocabulario.', [
          wrapInfantil(id + '-i-h1', 'Animals EN', 0, 1, 'Dog, cat…', bl, infSid(tier, 'i', 1)),
          wrapInfantil(id + '-i-h2', 'Colours EN', 1, 2, 'Red, blue…', bl, infSid(tier, 'i', 1)),
          tagSaber(liveGame(id + '-i-h3', 'Hello song', 'neon-dictado', d, bl, 'Listening EN', infSid(tier, 'i', 2)), infSid(tier, 'i', 2)),
          tagSaber(liveReflex(id + '-i-h4', 'Point and say', 'flash-tap', rx), infSid(tier, 'i', 2)),
          tagSaber(liveReflex(id + '-i-h5', 'Mini quiz', 'flash-tap', rx), infSid(tier, 'i', 2))
        ], { saberIds: [infSid(tier, 'i', 1), infSid(tier, 'i', 2)] }),
        unit(id + '-i-play', 'Body and actions', 'Órdenes sencillas en inglés con apoyo visual.', [
          wrapInfantil(id + '-i-p1', 'Body EN', 2, 1, 'Head, hand…', bl, infSid(tier, 'i', 1)),
          wrapInfantil(id + '-i-p2', 'Actions EN', 0, 2, 'Jump, clap…', bl, infSid(tier, 'i', 2)),
          wrapInfantil(id + '-i-p3', 'Listen & tap', 1, d, 'Inglés oral', bl, infSid(tier, 'i', 2)),
          wrapInfGame(id + '-i-p4', 'Picture match', 'neon-empareja', d, 'Empareja', bl, infSid(tier, 'i', 1)),
          tagSaber(liveReflex(id + '-i-p5', 'English mission', 'flash-tap', rx), infSid(tier, 'i', 2))
        ], { saberIds: [infSid(tier, 'i', 1), infSid(tier, 'i', 2)] })
      ], 'live'),
      subject('naturales', [
        unit(id + '-n-animales', 'Seres vivos', 'Explorar plantas, animales y el entorno.', [
          wrapInfantil(id + '-n-a1', 'Animal o cosa', 0, 1, 'Seres vivos', bl, infSid(tier, 'n', 1)),
          wrapInfantil(id + '-n-a2', 'Colores naturaleza', 1, 2, 'Planta, sol…', bl, infSid(tier, 'n', 3)),
          wrapInfantil(id + '-n-a3', tier >= 1 ? '¿Cuántos?' : 'Partes de la planta', 2, d, tier >= 1 ? 'Contar' : 'Nombra', bl, infSid(tier, 'n', 1)),
          wrapInfGame(id + '-n-a4', 'Estaciones', 'neon-ordenar', d, 'Ordena', bl, infSid(tier, 'n', 3)),
          wrapInfGame(id + '-n-a5', 'Reto naturaleza', 'neon-clasifica', d, 'Clasifica', bl, infSid(tier, 'n', 3))
        ], { saberIds: [infSid(tier, 'n', 1), infSid(tier, 'n', 3)] }),
        unit(id + '-n-cuerpo', 'Cuerpo y clima', 'Cuerpo, sentidos y fenómenos simples.', [
          wrapInfantil(id + '-n-c1', 'Partes del cuerpo', 0, 1, 'Cabeza, pies…', bl, infSid(tier, 'n', 2)),
          wrapInfantil(id + '-n-c2', 'Sol y lluvia', 1, 2, 'Clima', bl, infSid(tier, 'n', 3)),
          tier >= 1
            ? wrapInfantil(id + '-n-c3', 'Fruta sana', 2, d, 'Alimentación', bl, infSid(tier, 'n', 2))
            : wrapInfGame(id + '-n-c3', 'Día y noche', 'neon-ordenar', d, 'Ordena', bl, infSid(tier, 'n', 2)),
          wrapInfGame(id + '-n-c4', 'Animales del bosque', 'neon-empareja', d, 'Nombres', bl, infSid(tier, 'n', 1)),
          wrapInfGame(id + '-n-c5', 'Misión naturaleza', 'neon-clasifica', d, 'Seres vivos', bl, infSid(tier, 'n', 2))
        ], { saberIds: [infSid(tier, 'n', 2), infSid(tier, 'n', 3)] })
      ], 'live'),
      subject('sociales', [
        unit(id + '-s-emos', 'Emociones y convivencia', 'Familia, emociones y normas del aula.', [
          wrapInfantil(id + '-s-e1', 'Familia', 0, 1, 'Mamá, papá…', bl, infSid(tier, 's', 1)),
          wrapInfantil(id + '-s-e2', 'En el cole', 1, 2, 'Colegio, amigos', bl, infSid(tier, 's', 2)),
          wrapInfantil(id + '-s-e3', tier >= 1 ? 'Turnos y colores' : 'Caras felices', 2, d, 'Convivencia', bl, infSid(tier, 's', 2)),
          wrapInfGame(id + '-s-e4', 'Turnos', 'neon-ordenar', d, 'Espera tu turno', bl, infSid(tier, 's', 2)),
          wrapInfGame(id + '-s-e5', 'Misión emociones', 'neon-clasifica', d, 'Emociones', bl, infSid(tier, 's', 2))
        ], { saberIds: [infSid(tier, 's', 1), infSid(tier, 's', 2)] }),
        unit(id + '-s-cole', 'Mi entorno', 'Cole, calle y lugares cercanos.', [
          wrapInfantil(id + '-s-c1', 'Mi clase', 0, 1, 'Mesa, patio…', bl, infSid(tier, 's', 3)),
          wrapInfantil(id + '-s-c2', 'Señales', 1, 2, 'Pare, ceda…', bl, infSid(tier, 's', 3)),
          tier >= 1
            ? wrapInfantil(id + '-s-c3', 'Ayudar al compi', 2, d, 'Convivencia', bl, infSid(tier, 's', 2))
            : wrapInfGame(id + '-s-c3', 'Ordena el día', 'neon-ordenar', d, 'Rutina', bl, infSid(tier, 's', 2)),
          wrapInfGame(id + '-s-c4', 'Profesiones', 'neon-empareja', d, 'Quién es', bl, infSid(tier, 's', 3)),
          wrapInfGame(id + '-s-c5', 'Misión ciudadana', 'neon-empareja', d + 1, 'Entorno', bl, infSid(tier, 's', 3))
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
          liveGame('p1-m-s4-p', 'Problemas con números', 'neon-calculo', 2, 2, null, 'p1-m-a3'),
          tagSaber(liveReflex('p1-m-s5-m', 'Misión de la tienda', 'flash-tap', 2), 'p1-m-a3')
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
          liveLengua('p1-m-p3-h', 'Historias cortas', 'neon-lectura', 2, 'Lee el problema', 2, 'p1-m-a5'),
          liveGame('p1-m-p4-d', 'Elige la operación', 'neon-mayor-menor', 2, 2, null, 'p1-m-a5'),
          liveMates('p1-m-p5-m', 'Mini test del mercado', 4, 4, 3, 'Repaso final', 'p1-m-a5')
        ],
        { saberIds: ['p1-m-a5'] }
      ),
      unit(
        'p1-m-medida',
        'Medida y tiempo',
        'LOMLOE · magnitudes y secuencia temporal.',
        [
          liveGame('p1-m-e1-c', 'Ordena la semana', 'neon-ordenar', 1, 1, 'Secuencia', 'p1-m-b1'),
          tagSaber(liveReflex('p1-m-e2-r', 'Reloj en punto', 'flash-tap', 2), 'p1-m-b1'),
          liveGame('p1-m-e3-n', 'Números del calendario', 'neon-calculo', 2, 2, null, 'p1-m-b1'),
          liveGame('p1-m-e4-l', 'Compara longitudes', 'neon-mayor-menor', 2, 2, null, 'p1-m-b1'),
          tagSaber(liveReflex('p1-m-e5-m', 'Misión del calendario', 'flash-tap', 3), 'p1-m-b1')
        ],
        { saberIds: ['p1-m-b1'] }
      ),
      unit(
        'p1-m-figuras',
        'Figuras planas',
        'LOMLOE · sentido espacial: figuras básicas.',
        [
          liveGame('p1-m-f1-f', 'Nombre la figura', 'neon-clasifica', 1, 1, 'Elige el grupo', 'p1-m-c1'),
          liveGame('p1-m-f2-c', 'Clasifica formas', 'neon-clasifica', 2, 2, null, 'p1-m-c1'),
          tagSaber(liveGame('p1-m-f3-a', 'Atención visual', 'flash-tap', 2, null), 'p1-m-c1'),
          liveGame('p1-m-f4-p', 'Ordena patrones', 'neon-ordenar', 3, 2, null, 'p1-m-c1'),
          liveGame('p1-m-f5-m', 'Reto geométrico', 'neon-clasifica', 4, 3, 'Formas', 'p1-m-c1')
        ],
        { saberIds: ['p1-m-c1'] }
      )
    ];
  }

  function primaria1Lengua() {
    return [
      unit('p1-l-silabas', 'Sílabas y palabras', 'LOMLOE · grafema-fonema y sílabas directas.', [
        liveLengua('p1-l-s3', 'Ordena sílabas', 'neon-arrastra', 1, 'Arrastra', 1, 'p1-l-c1'),
        liveLengua('p1-l-s2', 'Completa la palabra', 'neon-palabra', 2, 'Elige la sílaba', 1, 'p1-l-c1'),
        liveLengua('p1-l-s4', 'Lectura guiada', 'neon-lectura', 3, 'Comprensión literal', 1, 'p1-l-c2'),
        liveLengua('p1-l-s1', 'Une sílaba e imagen', 'neon-silabas', 1, 'Forma palabras', 1, 'p1-l-c1'),
        liveLengua('p1-l-s5', 'Mini dictado', 'neon-silabas', 4, 'Forma palabras', 2, 'p1-l-c1')
      ], { saberIds: ['p1-l-c1', 'p1-l-c2'] }),
      unit('p1-l-frases', 'Frases simples', 'LOMLOE · comprensión y frases con mayúscula y punto.', [
        liveLengua('p1-l-f1', 'Ordena la frase', 'neon-frase', 1, 'Toca las palabras en orden', 1, 'p1-l-c3'),
        liveLengua('p1-l-f2', '¿Qué pasó?', 'neon-lectura', 2, 'Lee y responde', 1, 'p1-l-c2'),
        liveLengua('p1-l-f3', 'Ordena la oración', 'neon-frase', 2, 'Mayúscula y punto', 1, 'p1-l-c3'),
        liveLengua('p1-l-f4', 'Completa la frase', 'neon-palabra', 3, 'Escribe', 2, 'p1-l-c3'),
        liveLenguaRot('p1-l-f5', 'Misión del cuento', 3, 4, 'Reto final', 2, 'p1-l-c3')
      ], { saberIds: ['p1-l-c2', 'p1-l-c3'] }),
      unit('p1-l-vocab', 'Vocabulario cotidiano', 'LOMLOE · léxico de casa, colegio y familia.', [
        liveLengua('p1-l-v1', 'Palabras de casa', 'neon-palabra', 1, 'Forma la palabra', 1, 'p1-l-c4'),
        liveLengua('p1-l-v2', 'Lee y elige', 'neon-lectura', 2, 'Vocabulario', 1, 'p1-l-c4'),
        liveLengua('p1-l-v3', 'Sinónimos sencillos', 'neon-lectura', 3, 'Elige', 2, 'p1-l-c4'),
        liveIngles('p1-l-v4', 'Escucha y elige', 'neon-palabras', 2, 'Vocabulario EN', 1, 'p1-l-c4'),
        liveLengua('p1-l-v5', 'Reto del diccionario', 'neon-lectura', 4, 'Vocabulario', 2, 'p1-l-c4')
      ], { saberIds: ['p1-l-c4'] })
    ];
  }

  function primaria1Ingles() {
    return [
      unit('p1-i-hola', 'Hello y presentaciones', 'LOMLOE · saludos y presentaciones básicas.', [
        liveIngles('p1-i-h1', 'Hello / goodbye', 0, 1, 1, 'Vocabulario básico', 'p1-i-e1'),
        liveIngles('p1-i-h2', 'My name is…', 1, 2, 1, null, 'p1-i-e1'),
        liveIngles('p1-i-h3', 'Escucha y repite', 2, 1, 1, 'Listening', 'p1-i-e1'),
        liveIngles('p1-i-h4', 'Roleplay mini', 3, 2, 2, 'Diálogo', 'p1-i-e1'),
        tagSaber(liveReflex('p1-i-h5', 'Misión del saludo', 'flash-tap', 2), 'p1-i-e1')
      ], { saberIds: ['p1-i-e1'] }),
      unit('p1-i-numbers', 'Numbers 1–20', 'LOMLOE · numbers and colours in context.', [
        liveIngles('p1-i-n1', 'Numbers 1–10', 0, 1, 1, null, 'p1-i-e2'),
        liveIngles('p1-i-n2', 'Numbers 11–20', 1, 2, 2, null, 'p1-i-e2'),
        liveGame('p1-i-n3', 'Ordena números', 'neon-ordenar', 2, 2, '1–20', 'p1-i-e2'),
        liveIngles('p1-i-n4', 'Listening numbers', 2, 2, 2, 'Escucha', 'p1-i-e2'),
        liveIngles('p1-i-n5', 'Number challenge', 3, 3, 2, 'Boss round', 'p1-i-e2')
      ], { saberIds: ['p1-i-e2'] }),
      unit('p1-i-colours', 'Colours y animals', 'LOMLOE · classroom objects, colours and animals.', [
        liveIngles('p1-i-c1', 'Colours', 0, 1, 1, null, 'p1-i-e2'),
        liveIngles('p1-i-c2', 'Animals', 1, 2, 2, null, 'p1-i-e3'),
        liveIngles('p1-i-c3', 'I like…', 2, 2, 2, 'Frases', 'p1-i-e3'),
        liveGame('p1-i-c4', 'This is a…', 'neon-clasifica', 3, 2, 'Elige', 'p1-i-e3'),
        tagSaber(liveReflex('p1-i-c5', 'Animal memory', 'flash-tap', 2), 'p1-i-e3')
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
        liveGame('p2-m-n4', 'Ordena centenas', 'neon-ordenar', 3, 2, null, 'p2-m-a1'),
        liveMates('p2-m-n5', 'Misión numérica', 4, 4, 3, 'Repaso final', 'p2-m-a1')
      ], { saberIds: ['p2-m-a1'] }),
      unit('p2-m-llevadas', 'Sumas y restas con llevadas', 'LOMLOE · cálculo mental con llevadas.', [
        liveMates('p2-m-l1', 'Calentamiento', 0, 1, 2, null, 'p2-m-a2'),
        liveMates('p2-m-l2', 'Operaciones mixtas', 1, 2, 3, null, 'p2-m-a2'),
        liveMates('p2-m-l3', 'Combo 60 s', 2, 3, 3, null, 'p2-m-a2'),
        liveGame('p2-m-l4', 'Problemas dos pasos', 'neon-calculo', 3, 3, null, 'p2-m-a2'),
        liveMates('p2-m-l5', 'Misión del banco', 4, 4, 3, 'Repaso final', 'p2-m-a2')
      ], { saberIds: ['p2-m-a2'] }),
      unit('p2-m-tablas', 'Tablas del 2, 5 y 10', 'LOMLOE · multiplicación como suma repetida.', [
        liveGame('p2-m-t1', 'Tablas del 2', 'tablas-relampago', 1, 2, null, 'p2-m-a3'),
        liveMates('p2-m-t2', 'Mental × tablas', 1, 2, 2, null, 'p2-m-a3'),
        liveGame('p2-m-t3', 'Tablas del 10', 'tablas-relampago', 3, 3, null, 'p2-m-a3'),
        liveGame('p2-m-t4', 'Problemas de grupos', 'neon-calculo', 3, 3, null, 'p2-m-a3'),
        tagSaber(liveGame('p2-m-t5', 'Carrera de tablas', 'tablas-relampago', 3, 3, 'Velocidad', 'p2-m-a3'), 'p2-m-a3')
      ], { saberIds: ['p2-m-a3'] }),
      unit('p2-m-dinero', 'Dinero y tiempo', 'LOMLOE · monedas, euros y media hora.', [
        liveGame('p2-m-d1', 'Monedas y billetes', 'neon-clasifica', 2, 2, 'Agrupa', 'p2-m-b1'),
        liveGame('p2-m-d2', 'La caja registradora', 'neon-calculo', 3, 3, 'Suma euros', 'p2-m-b1'),
        liveGame('p2-m-d3', 'Cálculo con euros', 'neon-calculo', 2, 3, null, 'p2-m-b1'),
        liveGame('p2-m-d4', 'Media hora', 'neon-ordenar', 3, 2, 'Ordena horas', 'p2-m-b1'),
        liveGame('p2-m-d5', 'Misión del reloj', 'neon-ordenar', 4, 3, 'Tiempo', 'p2-m-b1')
      ], { saberIds: ['p2-m-b1'] }),
      unit('p2-m-figuras', 'Polígonos sencillos', 'LOMLOE · lados, vértices y simetría básica.', [
        liveGame('p2-m-f1', 'Polígonos', 'neon-clasifica', 2, 2, 'Formas', 'p2-m-c1'),
        tagSaber(liveReflex('p2-m-f2', 'Atención geométrica', 'flash-tap', 2), 'p2-m-c1'),
        liveGame('p2-m-f3', 'Simetría', 'neon-arrastra', 3, 2, 'Arrastra', 'p2-m-c1'),
        liveGame('p2-m-f4', 'Perímetro con cuadrícula', 'neon-calculo', 4, 3, 'Suma lados', 'p2-m-c1'),
        liveGame('p2-m-f5', 'Reto figuras', 'neon-clasifica', 4, 3, 'Geometría', 'p2-m-c1')
      ], { saberIds: ['p2-m-c1'] })
    ];
  }

  function primaria2Lengua() {
    return [
      unit('p2-l-lectura', 'Textos breves', 'LOMLOE · comprensión literal e idea principal.', [
        liveLengua('p2-l-r1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión literal', 4, 'p2-l-c1'),
        liveLengua('p2-l-r2', 'Ordena sílabas', 'neon-silabas', 2, 'Palabras del cole', 4, 'p2-l-c1'),
        liveLengua('p2-l-r3', 'Idea principal', 'neon-lectura', 3, 'Comprensión', 4, 'p2-l-c1'),
        liveLengua('p2-l-r4', 'Escribe un final', 'neon-frase', 3, 'Ordena palabras', 4, 'p2-l-c1'),
        liveLenguaRot('p2-l-r5', 'Misión lectora', 0, 4, 'Reto final', 4, 'p2-l-c1')
      ], { saberIds: ['p2-l-c1'] }),
      unit('p2-l-ortografia', 'Ortografía básica', 'LOMLOE · ca/co/cu, que/qui, m antes de p/b.', [
        liveLengua('p2-l-o1', 'Completa la palabra', 'neon-palabra', 2, 'Elige la sílaba correcta', 4, 'p2-l-c2'),
        liveLengua('p2-l-o2', 'Completa con m o n', 'neon-palabra', 3, 'Ortografía', 4, 'p2-l-c2'),
        liveLengua('p2-l-o3', 'Detecta el error', 'neon-lectura', 3, 'Lee con atención', 4, 'p2-l-c2'),
        liveLengua('p2-l-o4', 'Dictado corto', 'neon-dictado', 4, 'Escucha', 4, 'p2-l-c2'),
        liveLenguaRot('p2-l-o5', 'Reto ortográfico', 1, 4, 'Reto final', 4, 'p2-l-c2')
      ], { saberIds: ['p2-l-c2'] }),
      unit('p2-l-gramatica', 'Nombre, verbo y adjetivo', 'LOMLOE · primeras categorías gramaticales.', [
        liveLengua('p2-l-g1', '¿Qué es?', 'neon-lectura', 2, 'Categorías', 4, 'p2-l-c3'),
        liveLengua('p2-l-g2', 'Sinónimos y antónimos', 'neon-lectura', 2, 'Elige', 4, 'p2-l-c3'),
        liveLengua('p2-l-g3', 'Ordena la frase', 'neon-frase', 2, 'Orden sintáctico', 4, 'p2-l-c3'),
        liveLengua('p2-l-g4', 'Subraya el verbo', 'neon-frase', 3, 'Identifica', 4, 'p2-l-c3'),
        liveLenguaRot('p2-l-g5', 'Misión gramatical', 2, 4, 'Reto final', 4, 'p2-l-c3')
      ], { saberIds: ['p2-l-c3'] })
    ];
  }

  function primaria2Ingles() {
    return [
      unit('p2-i-family', 'Family y body', 'LOMLOE · vocabulario de familia y cuerpo.', [
        liveIngles('p2-i-f1', 'Family words', 0, 1, 2, null, 'p2-i-e1'),
        liveIngles('p2-i-f2', 'Body parts', 1, 2, 2, null, 'p2-i-e1'),
        liveIngles('p2-i-f3', 'I have got…', 2, 2, 2, 'Frases', 'p2-i-e1'),
        liveIngles('p2-i-f4', 'Listening family', 3, 2, 2, 'Escucha', 'p2-i-e1'),
        liveIngles('p2-i-f5', 'Family quiz', 3, 3, 3, 'Boss round', 'p2-i-e1')
      ], { saberIds: ['p2-i-e1'] }),
      unit('p2-i-food', 'Food y actions', 'LOMLOE · comida y verbos de acción.', [
        liveIngles('p2-i-o1', 'Food', 0, 1, 2, null, 'p2-i-e2'),
        liveIngles('p2-i-o2', 'Actions', 1, 2, 3, null, 'p2-i-e2'),
        liveIngles('p2-i-o3', 'I like / don\'t like', 2, 2, 2, 'Elige', 'p2-i-e2'),
        liveIngles('p2-i-o4', 'Mini diálogo', 3, 2, 3, 'Roleplay', 'p2-i-e2'),
        tagSaber(liveReflex('p2-i-o5', 'Food mission', 'flash-tap', 3), 'p2-i-e2')
      ], { saberIds: ['p2-i-e2'] }),
      unit('p2-i-numbers', 'Numbers 1–50', 'LOMLOE · contar y comparar en inglés.', [
        liveIngles('p2-i-n1', 'Numbers 1–20', 0, 1, 2, null, 'p2-i-e3'),
        liveIngles('p2-i-n2', 'Numbers 21–50', 1, 2, 3, null, 'p2-i-e3'),
        liveIngles('p2-i-n3', 'Comparatives easy', 2, 3, 3, 'Compare', 'p2-i-e3'),
        liveIngles('p2-i-n4', 'Listen and write', 3, 3, 3, 'Numbers', 'p2-i-e3'),
        liveIngles('p2-i-n5', 'Number boss', 3, 4, 3, 'Boss round', 'p2-i-e3')
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
        liveGame('p3-m-m5', 'Problemas de grupos', 'neon-calculo', 3, 4, null, 'p3-m-a1')
      ], { saberIds: ['p3-m-a1'] }),
      unit('p3-m-div', 'División sencilla', 'LOMLOE · repartir y agrupar.', [
        liveGame('p3-m-d1', 'Tablas para dividir', 'tablas-relampago', 1, 3, null, 'p3-m-a2'),
        liveMates('p3-m-d2', 'Reparto mental', 2, 2, 3, null, 'p3-m-a2'),
        liveMates('p3-m-d3', 'Operaciones mixtas', 0, 3, 4, null, 'p3-m-a2'),
        liveGame('p3-m-d4', 'Problemas dos pasos', 'neon-calculo', 4, 4, null, 'p3-m-a2'),
        liveMates('p3-m-d5', 'Misión división', 4, 4, 4, 'Repaso final', 'p3-m-a2')
      ], { saberIds: ['p3-m-a2'] }),
      unit('p3-m-frac', 'Fracciones básicas', 'LOMLOE · medios, tercios y cuartos con barra visual.', [
        liveGame('p3-m-f1', 'Pizza: medios y cuartos', 'neon-fracciones', 1, 3, '¿Qué fracción es?', 'p3-m-a3'),
        liveGame('p3-m-f2', 'Tercios y cuartos', 'neon-fracciones', 2, 3, 'Compara visual', 'p3-m-a3'),
        liveGame('p3-m-f3', 'Mix fracciones', 'neon-fracciones', 2, 4, 'Velocidad', 'p3-m-a3'),
        liveGame('p3-m-f4', 'Compara fracciones', 'neon-fracciones', 3, 4, '¿Cuál es mayor?', 'p3-m-a3'),
        liveGame('p3-m-f5', 'Reto pizza', 'neon-fracciones', 4, 4, 'Velocidad', 'p3-m-a3')
      ], { saberIds: ['p3-m-a3'] }),
      unit('p3-m-medidas', 'Medidas y perímetro', 'LOMLOE · longitud y contorno.', [
        liveGame('p3-m-e1', 'Centímetros', 'neon-mayor-menor', 2, 3, 'Compara', 'p3-m-b1'),
        liveGame('p3-m-e2', 'Cálculo de medidas', 'neon-calculo', 2, 4, null, 'p3-m-b1'),
        liveGame('p3-m-e3', 'Perímetro en cuadrícula', 'neon-calculo', 3, 4, 'Suma lados', 'p3-m-b1'),
        liveGame('p3-m-e4', 'Conversión simple', 'neon-mayor-menor', 4, 4, 'm y cm', 'p3-m-b1'),
        liveGame('p3-m-e5', 'Misión metro', 'neon-calculo', 4, 4, 'Medidas', 'p3-m-b1')
      ], { saberIds: ['p3-m-b1'] }),
      unit('p3-m-problemas', 'Problemas de dos pasos', 'LOMLOE · planificar antes de calcular.', [
        liveMates('p3-m-p1', 'Calentamiento', 0, 1, 3, null, 'p3-m-a2'),
        liveMates('p3-m-p2', 'Dos operaciones', 1, 3, 4, null, 'p3-m-a4'),
        liveGame('p3-m-p3', 'Tablas en problemas', 'tablas-relampago', 2, 4, null, 'p3-m-a4'),
        liveGame('p3-m-p4', 'Elige el plan', 'neon-lectura', 4, 4, 'Lee el problema', 'p3-m-a4'),
        liveMates('p3-m-p5', 'Misión detective', 4, 4, 4, 'Repaso final', 'p3-m-a4')
      ], { saberIds: ['p3-m-a4'] })
    ];
  }

  function primaria3Lengua() {
    return [
      unit('p3-l-textos', 'Narrativos e informativos', 'LOMLOE · comprender y resumir textos.', [
        liveLengua('p3-l-t1', 'Cuento o noticia', 'neon-lectura', 2, 'Comprensión', 8, 'p3-l-c1'),
        liveLengua('p3-l-t2', 'Ordena la frase', 'neon-frase', 3, 'Sintaxis', 8, 'p3-l-c1'),
        liveLengua('p3-l-t3', 'Descripción', 'neon-palabra', 3, 'Completa', 8, 'p3-l-c1'),
        liveLengua('p3-l-t4', 'Carta corta', 'neon-frase', 3, 'Ordena', 8, 'p3-l-c1'),
        liveLenguaRot('p3-l-t5', 'Misión redactor', 0, 4, 'Reto final', 8, 'p3-l-c1')
      ], { saberIds: ['p3-l-c1'] }),
      unit('p3-l-ortografia', 'b/v, g/j, r/rr', 'LOMLOE · ortografía frecuente en 3º.', [
        liveLenguaRot('p3-l-o1', 'Completa la palabra', 2, 2, 'Sílabas trabadas', 8, 'p3-l-c2'),
        liveLenguaRot('p3-l-o2', 'Ordena sílabas', 1, 3, 'Palabras largas', 8, 'p3-l-c2'),
        liveLenguaRot('p3-l-o3', 'Lee y corrige', 0, 3, 'Comprensión', 8, 'p3-l-c2'),
        liveLengua('p3-l-o4', 'Dictado', 'neon-dictado', 4, 'Escucha', 8, 'p3-l-c2'),
        liveLenguaRot('p3-l-o5', 'Reto ortografía', 1, 4, 'Reto final', 8, 'p3-l-c2')
      ], { saberIds: ['p3-l-c2'] }),
      unit('p3-l-literatura', 'Cuento, poesía y fábula', 'LOMLOE · géneros literarios básicos.', [
        liveGame('p3-l-i1', '¿Qué género es?', 'neon-clasifica', 2, 3, 'Clasifica', 'p3-l-c3'),
        liveLengua('p3-l-i2', 'Rima en poesía', 'neon-palabras', 2, 'Escucha y elige', 8, 'p3-l-c3'),
        liveLengua('p3-l-i3', 'Moral de la fábula', 'neon-lectura', 3, 'Lee y responde', 8, 'p3-l-c3'),
        liveLengua('p3-l-i4', 'Ordena el cuento', 'neon-arrastra', 3, 'Arrastra', 8, 'p3-l-c3'),
        liveLengua('p3-l-i5', 'Misión literaria', 'neon-lectura', 4, 'Literatura', 8, 'p3-l-c3')
      ], { saberIds: ['p3-l-c3'] })
    ];
  }

  function primaria3Ingles() {
    return [
      unit('p3-i-present', 'Present simple', 'LOMLOE · rutinas y hechos cotidianos.', [
        liveIngles('p3-i-p1', 'Daily routines', 0, 1, 3, null, 'p3-i-e1'),
        liveIngles('p3-i-p2', 'School words', 1, 2, 3, null, 'p3-i-e1'),
        liveIngles('p3-i-p3', 'Fill the gap', 2, 3, 3, 'Grammar', 'p3-i-e1'),
        liveIngles('p3-i-p4', 'Listening routines', 3, 3, 3, 'Escucha', 'p3-i-e1'),
        liveIngles('p3-i-p5', 'Grammar quiz', 3, 4, 3, 'Grammar', 'p3-i-e1')
      ], { saberIds: ['p3-i-e1'] }),
      unit('p3-i-can', "Can / can't · there is/are", 'LOMLOE · habilidad y descripción.', [
        liveIngles('p3-i-c1', 'Places vocab', 0, 2, 3, null, 'p3-i-e2'),
        liveIngles('p3-i-c2', 'Listen & tap', 1, 2, 3, null, 'p3-i-e2'),
        liveIngles('p3-i-c3', 'There is / are', 2, 3, 3, 'Elige', 'p3-i-e2'),
        liveIngles('p3-i-c4', 'Describe a room', 3, 3, 3, 'Vocabulario', 'p3-i-e2'),
        tagSaber(liveReflex('p3-i-c5', 'City mission', 'flash-tap', 3), 'p3-i-e2')
      ], { saberIds: ['p3-i-e2'] }),
      unit('p3-i-listen', 'Listening e instrucciones', 'LOMLOE · seguir órdenes en inglés.', [
        tagSaber(liveReflex('p3-i-l1', 'Listen & tap', 'flash-tap', 1), 'p3-i-e3'),
        liveIngles('p3-i-l2', 'School objects', 0, 2, 3, null, 'p3-i-e3'),
        liveIngles('p3-i-l3', 'Follow directions', 1, 3, 3, 'Listening', 'p3-i-e3'),
        tagSaber(liveReflex('p3-i-l4', 'Classroom game', 'flash-tap', 2), 'p3-i-e3'),
        liveIngles('p3-i-l5', 'Listening test', 3, 4, 3, 'Listening', 'p3-i-e3')
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

  /** —— 1º ESO (LOMLOE RD 243/2022) —— */
  function eso1Math() {
    return [
      unit('eso1-m-rac', 'Números racionales', 'LOMLOE · fracciones, decimales y operaciones.', [
        liveGame('eso1-m-rac1', 'Fracciones racionales', 'neon-fracciones', 3, 8, 'Equivalencias', 'eso1-m-a1'),
        liveGame('eso1-m-rac2', 'Compara racionales', 'neon-fracciones', 3, 9, 'Comparación', 'eso1-m-a1'),
        liveGame('eso1-m-rac3', 'Cálculo express', 'neon-calculo', 3, 8, null, 'eso1-m-a1'),
        liveMates('eso1-m-rac4', 'Problemas', 3, 4, 9, null, 'eso1-m-a1'),
        liveGame('eso1-m-rac5', 'Misión Números racionales', 'neon-fracciones', 4, 9, 'Reto final', 'eso1-m-a1')
      ], { saberIds: ['eso1-m-a1'] }),
      unit('eso1-m-pot', 'Potencias y raíces', 'LOMLOE · potencias y raíz cuadrada.', [
        liveGame('eso1-m-pot1', 'Cálculo express', 'neon-calculo', 3, 8, null, 'eso1-m-a2'),
        liveGame('eso1-m-pot2', 'Tablas flash', 'tablas-relampago', 2, 8, null, 'eso1-m-a2'),
        liveMates('eso1-m-pot3', 'Álgebra mental', 2, 3, 9, null, 'eso1-m-a2'),
        liveMates('eso1-m-pot4', 'Problemas', 3, 4, 9, null, 'eso1-m-a2'),
        liveMates('eso1-m-pot5', 'Misión Potencias y raíces', 4, 4, 9, 'Repaso final', 'eso1-m-a2')
      ], { saberIds: ['eso1-m-a2'] }),
      unit('eso1-m-ecu', 'Ecuaciones de 1º grado', 'LOMLOE · incógnitas y álgebra básica.', [
        liveGame('eso1-m-ecu1', 'Cálculo express', 'neon-calculo', 3, 8, null, 'eso1-m-a3'),
        liveGame('eso1-m-ecu2', 'Tablas flash', 'tablas-relampago', 2, 8, null, 'eso1-m-a3'),
        liveMates('eso1-m-ecu3', 'Álgebra mental', 2, 3, 9, null, 'eso1-m-a3'),
        liveMates('eso1-m-ecu4', 'Problemas', 3, 4, 9, null, 'eso1-m-a3'),
        liveMates('eso1-m-ecu5', 'Misión Ecuaciones de 1º grado', 4, 4, 9, 'Repaso final', 'eso1-m-a3')
      ], { saberIds: ['eso1-m-a3'] }),
      unit('eso1-m-prop', 'Proporcionalidad', 'LOMLOE · porcentajes y regla de tres.', [
        liveGame('eso1-m-prop1', 'Cálculo express', 'neon-calculo', 3, 8, null, 'eso1-m-b1'),
        liveGame('eso1-m-prop2', 'Tablas flash', 'tablas-relampago', 2, 8, null, 'eso1-m-b1'),
        liveMates('eso1-m-prop3', 'Álgebra mental', 2, 3, 9, null, 'eso1-m-b1'),
        liveMates('eso1-m-prop4', 'Problemas', 3, 4, 9, null, 'eso1-m-b1'),
        liveMates('eso1-m-prop5', 'Misión Proporcionalidad', 4, 4, 9, 'Repaso final', 'eso1-m-b1')
      ], { saberIds: ['eso1-m-b1'] }),
      unit('eso1-m-stat', 'Estadística', 'LOMLOE · frecuencias, media y gráficos.', [
        liveGame('eso1-m-stat1', 'Cálculo express', 'neon-calculo', 3, 8, null, 'eso1-m-a4'),
        liveGame('eso1-m-stat2', 'Tablas flash', 'tablas-relampago', 2, 8, null, 'eso1-m-a4'),
        liveMates('eso1-m-stat3', 'Álgebra mental', 2, 3, 9, null, 'eso1-m-a4'),
        liveMates('eso1-m-stat4', 'Problemas', 3, 4, 9, null, 'eso1-m-a4'),
        liveMates('eso1-m-stat5', 'Misión Estadística', 4, 4, 9, 'Repaso final', 'eso1-m-a4')
      ], { saberIds: ['eso1-m-a4'] }),
      unit('eso1-m-geo', 'Geometría plana', 'LOMLOE · triángulos, ángulos y construcciones.', [
        liveGame('eso1-m-geo1', 'Clasifica figuras', 'neon-clasifica', 3, 9, 'Formas', 'eso1-m-c1'),
        liveGame('eso1-m-geo2', 'Ángulos y lados', 'neon-clasifica', 3, 9, 'Geometría', 'eso1-m-c1'),
        liveGame('eso1-m-geo3', 'Teorema visual', 'neon-clasifica', 4, 9, 'Triángulos', 'eso1-m-c1'),
        liveGame('eso1-m-geo4', 'Construcciones', 'neon-arrastra', 4, 9, 'Arrastra', 'eso1-m-c1'),
        liveGame('eso1-m-geo5', 'Misión geometría', 'neon-clasifica', 4, 9, 'Reto final', 'eso1-m-c1')
      ], { saberIds: ['eso1-m-c1'] }),
    ];
  }

  function eso1Lengua() {
    return [
      unit('eso1-l-lit', 'Análisis literario', 'LOMLOE · géneros, figuras y comprensión.', [
        liveLengua('eso1-l-lit1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', 10, 'eso1-l-c1'),
        liveLenguaRot('eso1-l-lit2', 'Ordena y corrige', 2, 3, 'Sintaxis', 10, 'eso1-l-c1'),
        liveLenguaRot('eso1-l-lit3', 'Completa', 1, 4, 'Ortografía', 11, 'eso1-l-c1'),
        liveLenguaRot('eso1-l-lit4', 'Redacción', 3, 4, 'Escribe', 11, 'eso1-l-c1'),
        liveLenguaRot('eso1-l-lit5', 'Misión lengua', 0, 4, 'Reto final', 11, 'eso1-l-c1')
      ], { saberIds: ['eso1-l-c1'] }),
      unit('eso1-l-gram', 'Gramática y sintaxis', 'LOMLOE · morfología y ortografía.', [
        liveLengua('eso1-l-gram1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', 10, 'eso1-l-c2'),
        liveLenguaRot('eso1-l-gram2', 'Ordena y corrige', 2, 3, 'Sintaxis', 10, 'eso1-l-c2'),
        liveLenguaRot('eso1-l-gram3', 'Completa', 1, 4, 'Ortografía', 11, 'eso1-l-c2'),
        liveLenguaRot('eso1-l-gram4', 'Redacción', 3, 4, 'Escribe', 11, 'eso1-l-c2'),
        liveLenguaRot('eso1-l-gram5', 'Misión lengua', 0, 4, 'Reto final', 11, 'eso1-l-c2')
      ], { saberIds: ['eso1-l-c2'] }),
      unit('eso1-l-esc', 'Expresión escrita', 'LOMLOE · textos argumentativos.', [
        liveLengua('eso1-l-esc1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', 10, 'eso1-l-c3'),
        liveLenguaRot('eso1-l-esc2', 'Ordena y corrige', 2, 3, 'Sintaxis', 10, 'eso1-l-c3'),
        liveLenguaRot('eso1-l-esc3', 'Completa', 1, 4, 'Ortografía', 11, 'eso1-l-c3'),
        liveLenguaRot('eso1-l-esc4', 'Redacción', 3, 4, 'Escribe', 11, 'eso1-l-c3'),
        liveLenguaRot('eso1-l-esc5', 'Misión lengua', 0, 4, 'Reto final', 11, 'eso1-l-c3')
      ], { saberIds: ['eso1-l-c3'] }),
    ];
  }

  function eso1Ingles() {
    return [
      unit('eso1-i-past', 'Past tenses', 'LOMLOE · pasado simple y continuo.', [
        liveIngles('eso1-i-past1', 'Vocab drill', 0, 2, 8, null, 'eso1-i-e1'),
        liveIngles('eso1-i-past2', 'Listen & tap', 1, 3, 8, null, 'eso1-i-e1'),
        liveIngles('eso1-i-past3', 'Fill the gap', 2, 3, 8, 'Past tense', 'eso1-i-e1'),
        liveIngles('eso1-i-past4', 'Grammar quiz', 3, 3, 8, 'Grammar', 'eso1-i-e1'),
        tagSaber(liveReflex('eso1-i-past5', 'English mission', 'flash-tap', 3), 'eso1-i-e1')
      ], { saberIds: ['eso1-i-e1'] }),
      unit('eso1-i-desc', 'Descriptions', 'LOMLOE · comparativos y superlativos.', [
        liveIngles('eso1-i-desc1', 'Vocab drill', 0, 2, 8, null, 'eso1-i-e2'),
        liveIngles('eso1-i-desc2', 'Listen & tap', 1, 3, 8, null, 'eso1-i-e2'),
        liveIngles('eso1-i-desc3', 'Fill the gap', 2, 3, 8, 'Comparatives', 'eso1-i-e2'),
        liveIngles('eso1-i-desc4', 'Grammar quiz', 3, 3, 8, 'Grammar', 'eso1-i-e2'),
        tagSaber(liveReflex('eso1-i-desc5', 'English mission', 'flash-tap', 3), 'eso1-i-e2')
      ], { saberIds: ['eso1-i-e2'] }),
      unit('eso1-i-oral', 'Oral interaction', 'LOMLOE · diálogos y listening.', [
        liveIngles('eso1-i-oral1', 'Vocab drill', 0, 2, 8, null, 'eso1-i-e3'),
        liveIngles('eso1-i-oral2', 'Listen & tap', 1, 3, 8, null, 'eso1-i-e3'),
        liveIngles('eso1-i-oral3', 'Fill the gap', 2, 3, 8, 'Dialogue', 'eso1-i-e3'),
        liveIngles('eso1-i-oral4', 'Grammar quiz', 3, 3, 8, 'Grammar', 'eso1-i-e3'),
        tagSaber(liveReflex('eso1-i-oral5', 'English mission', 'flash-tap', 3), 'eso1-i-e3')
      ], { saberIds: ['eso1-i-e3'] }),
    ];
  }

  function eso1Naturales() {
    return [
      unit('eso1-n-cel', 'La célula y seres vivos', 'LOMLOE · biología: estructura celular.', [
        liveNaturalesRot('eso1-n-cel1', 'Preguntas', 1, 3, 'Ciencia', 10, 'eso1-n-b1'),
        liveNaturalesRot('eso1-n-cel2', 'Verdadero o falso', 2, 3, 'Lee', 10, 'eso1-n-b1'),
        liveNaturalesRot('eso1-n-cel3', 'Clasifica', 0, 4, 'Naturales', 10, 'eso1-n-b1'),
        liveNaturalesRot('eso1-n-cel4', 'Experimento virtual', 1, 4, 'Comprensión', 11, 'eso1-n-b1'),
        liveNaturalesRot('eso1-n-cel5', 'Reto científico', 2, 5, 'Misión', 11, 'eso1-n-b1')
      ], { saberIds: ['eso1-n-b1'] }),
      unit('eso1-n-mat', 'Materia y reacciones', 'LOMLOE · física y química básica.', [
        liveNaturalesRot('eso1-n-mat1', 'Preguntas', 1, 3, 'Ciencia', 10, 'eso1-n-b2'),
        liveNaturalesRot('eso1-n-mat2', 'Verdadero o falso', 2, 3, 'Lee', 10, 'eso1-n-b2'),
        liveNaturalesRot('eso1-n-mat3', 'Clasifica', 0, 4, 'Naturales', 10, 'eso1-n-b2'),
        liveNaturalesRot('eso1-n-mat4', 'Experimento virtual', 1, 4, 'Comprensión', 11, 'eso1-n-b2'),
        liveNaturalesRot('eso1-n-mat5', 'Reto científico', 2, 5, 'Misión', 11, 'eso1-n-b2')
      ], { saberIds: ['eso1-n-b2'] }),
      unit('eso1-n-tie', 'La Tierra y el universo', 'LOMLOE · geología y astronomía.', [
        liveNaturalesRot('eso1-n-tie1', 'Preguntas', 1, 3, 'Ciencia', 10, 'eso1-n-b3'),
        liveNaturalesRot('eso1-n-tie2', 'Verdadero o falso', 2, 3, 'Lee', 10, 'eso1-n-b3'),
        liveNaturalesRot('eso1-n-tie3', 'Clasifica', 0, 4, 'Naturales', 10, 'eso1-n-b3'),
        liveNaturalesRot('eso1-n-tie4', 'Experimento virtual', 1, 4, 'Comprensión', 11, 'eso1-n-b3'),
        liveNaturalesRot('eso1-n-tie5', 'Reto científico', 2, 5, 'Misión', 11, 'eso1-n-b3')
      ], { saberIds: ['eso1-n-b3'] }),
    ];
  }

  function eso1Sociales() {
    return [
      unit('eso1-s-geo', 'Geografía de España', 'LOMLOE · relieve, clima y paisaje.', [
        liveSocialesRot('eso1-s-geo1', 'Lee y responde', 1, 3, 'Historia', 10, 'eso1-s-b1'),
        liveSocialesRot('eso1-s-geo2', 'Mapas', 0, 3, 'Geografía', 10, 'eso1-s-b1'),
        liveSocialesRot('eso1-s-geo3', 'Ordena', 2, 4, 'Convivencia', 10, 'eso1-s-b1'),
        liveSocialesRot('eso1-s-geo4', 'Debate corto', 1, 4, 'Ciudadanía', 11, 'eso1-s-b1'),
        liveSocialesRot('eso1-s-geo5', 'Misión social', 2, 5, 'Reto', 11, 'eso1-s-b1')
      ], { saberIds: ['eso1-s-b1'] }),
      unit('eso1-s-hist', 'Sociedades preindustriales', 'LOMLOE · Edad Antigua y Media.', [
        liveSocialesRot('eso1-s-hist1', 'Lee y responde', 1, 3, 'Historia', 10, 'eso1-s-b2'),
        liveSocialesRot('eso1-s-hist2', 'Mapas', 0, 3, 'Geografía', 10, 'eso1-s-b2'),
        liveSocialesRot('eso1-s-hist3', 'Ordena', 2, 4, 'Convivencia', 10, 'eso1-s-b2'),
        liveSocialesRot('eso1-s-hist4', 'Debate corto', 1, 4, 'Ciudadanía', 11, 'eso1-s-b2'),
        liveSocialesRot('eso1-s-hist5', 'Misión social', 2, 5, 'Reto', 11, 'eso1-s-b2')
      ], { saberIds: ['eso1-s-b2'] }),
      unit('eso1-s-ciu', 'Ciudadanía y derechos', 'LOMLOE · Constitución y convivencia.', [
        liveSocialesRot('eso1-s-ciu1', 'Lee y responde', 1, 3, 'Historia', 10, 'eso1-s-b3'),
        liveSocialesRot('eso1-s-ciu2', 'Mapas', 0, 3, 'Geografía', 10, 'eso1-s-b3'),
        liveSocialesRot('eso1-s-ciu3', 'Ordena', 2, 4, 'Convivencia', 10, 'eso1-s-b3'),
        liveSocialesRot('eso1-s-ciu4', 'Debate corto', 1, 4, 'Ciudadanía', 11, 'eso1-s-b3'),
        liveSocialesRot('eso1-s-ciu5', 'Misión social', 2, 5, 'Reto', 11, 'eso1-s-b3')
      ], { saberIds: ['eso1-s-b3'] }),
    ];
  }

  function eso1Daily() {
    return [
      unit('eso1-d-rutina', 'Brain Gym diario', 'LOMLOE · mates, idiomas y reflejos para ESO.', [
        liveGame('eso1-d1', 'Cálculo express', 'neon-calculo', 3, 8, null, 'eso1-m-a3'),
        liveGame('eso1-d2', 'Tablas flash', 'tablas-relampago', 2, 8, null, 'eso1-m-a3'),
        liveGame('eso1-d3', 'English drill', 'neon-palabras', 2, 8, null, 'eso1-i-e1'),
        liveLengua('eso1-d4', 'Mini lectura', 'neon-lectura', 2, 'Comprensión', 9, 'eso1-l-c1'),
        tagSaber(liveReflex('eso1-d5', 'Reflejos finales', 'reaction-test', 2), 'eso1-d-01')
      ], { saberIds: ['eso1-d-01'] })
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
        liveMates('p4-m-num5', 'Misión Números hasta 10.000', 4, 4, 6, 'Repaso final', 'p4-m-a1')
      ], { saberIds: ['p4-m-a1'] }),
      unit('p4-m-ops', 'Multiplicación y división', 'LOMLOE · productos y repartos con números mayores.', [
        liveGame('p4-m-ops1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-a2'),
        liveMates('p4-m-ops2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-a2'),
        liveGame('p4-m-ops3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-a2'),
        liveMates('p4-m-ops4', 'Dos pasos', 2, 3, 6, null, 'p4-m-a2'),
        liveMates('p4-m-ops5', 'Misión Multiplicación y división', 4, 4, 6, 'Repaso final', 'p4-m-a2')
      ], { saberIds: ['p4-m-a2'] }),
      unit('p4-m-frac', 'Fracciones equivalentes', 'LOMLOE · comparar y simplificar fracciones.', [
        liveGame('p4-m-frac1', 'Fracciones equivalentes', 'neon-fracciones', 2, 5, 'Equivalencias', 'p4-m-a3'),
        liveGame('p4-m-frac2', 'Compara barras', 'neon-fracciones', 2, 5, 'Mayor o menor', 'p4-m-a3'),
        liveGame('p4-m-frac3', 'Mix fracciones', 'neon-fracciones', 3, 6, 'Velocidad', 'p4-m-a3'),
        liveMates('p4-m-frac4', 'Cálculo apoyo', 1, 2, 5, null, 'p4-m-a3'),
        liveGame('p4-m-frac5', 'Misión Fracciones equivalentes', 'neon-fracciones', 4, 6, 'Velocidad', 'p4-m-a3')
      ], { saberIds: ['p4-m-a3'] }),
      unit('p4-m-dec', 'Decimales', 'LOMLOE · décimas, centésimas y cálculo.', [
        liveGame('p4-m-dec1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-b1'),
        liveMates('p4-m-dec2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-b1'),
        liveGame('p4-m-dec3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-b1'),
        liveMates('p4-m-dec4', 'Dos pasos', 2, 3, 6, null, 'p4-m-b1'),
        liveMates('p4-m-dec5', 'Misión Decimales', 4, 4, 6, 'Repaso final', 'p4-m-b1')
      ], { saberIds: ['p4-m-b1'] }),
      unit('p4-m-prob', 'Problemas multiplicativos', 'LOMLOE · planificar operaciones combinadas.', [
        liveGame('p4-m-prob1', 'Tablas express', 'tablas-relampago', 2, 4, null, 'p4-m-a4'),
        liveMates('p4-m-prob2', 'Cálculo mental', 1, 2, 5, null, 'p4-m-a4'),
        liveGame('p4-m-prob3', 'Mix operaciones', 'neon-calculo', 3, 5, null, 'p4-m-a4'),
        liveMates('p4-m-prob4', 'Dos pasos', 2, 3, 6, null, 'p4-m-a4'),
        liveMates('p4-m-prob5', 'Misión Problemas multiplicativos', 4, 4, 6, 'Repaso final', 'p4-m-a4')
      ], { saberIds: ['p4-m-a4'] }),
      unit('p4-m-geo', 'Ángulos y simetría', 'LOMLOE · figuras, ángulos y ejes de simetría.', [
        liveGame('p4-m-geo1', 'Clasifica figuras', 'neon-clasifica', 2, 5, 'Formas', 'p4-m-c1'),
        liveGame('p4-m-geo2', 'Simetría visual', 'neon-clasifica', 3, 5, 'Geometría', 'p4-m-c1'),
        liveGame('p4-m-geo3', 'Medir ángulos', 'neon-mayor-menor', 4, 5, 'Compara', 'p4-m-c1'),
        liveGame('p4-m-geo4', 'Eje de simetría', 'neon-clasifica', 4, 5, 'Parejas', 'p4-m-c1'),
        liveGame('p4-m-geo5', 'Misión geometría', 'neon-clasifica', 4, 5, 'Reto final', 'p4-m-c1')
      ], { saberIds: ['p4-m-c1'] }),
    ];
  }

  function primaria4Lengua() {
    return [
      unit('p4-l-textos', 'Comprensión lectora', 'LOMLOE · textos para 4º.', [
        liveLengua('p4-l-textos1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 9, 'p4-l-c1'),
        liveLenguaRot('p4-l-textos2', 'Ordena la frase', 2, 2, 'Sintaxis', 9, 'p4-l-c1'),
        liveLenguaRot('p4-l-textos3', 'Completa', 1, 3, 'Ortografía', 9, 'p4-l-c1'),
        liveLengua('p4-l-textos4', 'Dictado', 'neon-dictado', 4, 'Escucha', 9, 'p4-l-c1'),
        liveLenguaRot('p4-l-textos5', 'Misión lengua', 0, 4, 'Reto final', 9, 'p4-l-c1')
      ], { saberIds: ['p4-l-c1'] }),
      unit('p4-l-orto', 'Ortografía', 'LOMLOE · reglas ortográficas de 4º.', [
        liveLengua('p4-l-orto1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 9, 'p4-l-c2'),
        liveLenguaRot('p4-l-orto2', 'Ordena la frase', 2, 2, 'Sintaxis', 9, 'p4-l-c2'),
        liveLenguaRot('p4-l-orto3', 'Completa', 1, 3, 'Ortografía', 9, 'p4-l-c2'),
        liveLengua('p4-l-orto4', 'Dictado', 'neon-dictado', 4, 'Escucha', 9, 'p4-l-c2'),
        liveLenguaRot('p4-l-orto5', 'Misión lengua', 0, 4, 'Reto final', 9, 'p4-l-c2')
      ], { saberIds: ['p4-l-c2'] }),
      unit('p4-l-gram', 'Sintaxis y literatura', 'LOMLOE · gramática y géneros literarios.', [
        liveLengua('p4-l-gram1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 9, 'p4-l-c3'),
        liveLenguaRot('p4-l-gram2', 'Ordena la frase', 2, 2, 'Sintaxis', 9, 'p4-l-c3'),
        liveLenguaRot('p4-l-gram3', 'Completa', 1, 3, 'Ortografía', 9, 'p4-l-c3'),
        liveLengua('p4-l-gram4', 'Dictado', 'neon-dictado', 4, 'Escucha', 9, 'p4-l-c3'),
        liveLenguaRot('p4-l-gram5', 'Misión lengua', 0, 4, 'Reto final', 9, 'p4-l-c3')
      ], { saberIds: ['p4-l-c3'] }),
    ];
  }

  function primaria4Ingles() {
    return [
      unit('p4-i-past', 'Past simple', 'LOMLOE · acciones pasadas.', [
        liveIngles('p4-i-past1', 'Vocab drill', 0, 1, 4, null, 'p4-i-e1'),
        liveIngles('p4-i-past2', 'Listen & tap', 1, 2, 4, null, 'p4-i-e1'),
        liveIngles('p4-i-past3', 'Fill the gap', 2, 3, 4, 'Grammar', 'p4-i-e1'),
        liveIngles('p4-i-past4', 'Grammar quiz', 3, 3, 4, 'Grammar', 'p4-i-e1'),
        tagSaber(liveReflex('p4-i-past5', 'English mission', 'flash-tap', 3), 'p4-i-e1')
      ], { saberIds: ['p4-i-e1'] }),
      unit('p4-i-comp', 'Comparatives', 'LOMLOE · comparar en inglés.', [
        liveIngles('p4-i-comp1', 'Vocab drill', 0, 1, 4, null, 'p4-i-e2'),
        liveIngles('p4-i-comp2', 'Listen & tap', 1, 2, 4, null, 'p4-i-e2'),
        liveIngles('p4-i-comp3', 'Fill the gap', 2, 3, 4, 'Compare', 'p4-i-e2'),
        liveIngles('p4-i-comp4', 'Grammar quiz', 3, 3, 4, 'Grammar', 'p4-i-e2'),
        tagSaber(liveReflex('p4-i-comp5', 'English mission', 'flash-tap', 3), 'p4-i-e2')
      ], { saberIds: ['p4-i-e2'] }),
      unit('p4-i-read', 'Reading comprehension', 'LOMLOE · leer y responder.', [
        liveIngles('p4-i-read1', 'Vocab drill', 0, 1, 4, null, 'p4-i-e3'),
        liveIngles('p4-i-read2', 'Listen & tap', 1, 2, 4, null, 'p4-i-e3'),
        liveIngles('p4-i-read3', 'Fill the gap', 2, 3, 4, 'Reading', 'p4-i-e3'),
        liveIngles('p4-i-read4', 'Grammar quiz', 3, 3, 4, 'Grammar', 'p4-i-e3'),
        tagSaber(liveReflex('p4-i-read5', 'English mission', 'flash-tap', 3), 'p4-i-e3')
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
        liveMates('p5-m-dec5', 'Misión Operaciones con decimales', 4, 4, 7, 'Repaso final', 'p5-m-a1')
      ], { saberIds: ['p5-m-a1'] }),
      unit('p5-m-frac', 'Fracciones y decimales', 'LOMLOE · equivalencias y comparación.', [
        liveGame('p5-m-frac1', 'Equivalencias', 'neon-fracciones', 2, 6, 'Fracciones iguales', 'p5-m-a2'),
        liveGame('p5-m-frac2', 'Compara fracciones', 'neon-fracciones', 3, 6, 'Mayor o menor', 'p5-m-a2'),
        liveGame('p5-m-frac3', 'Mix visual', 'neon-fracciones', 3, 7, 'Velocidad', 'p5-m-a2'),
        liveGame('p5-m-frac4', 'Cálculo apoyo', 'neon-calculo', 2, 6, null, 'p5-m-a2'),
        liveGame('p5-m-frac5', 'Misión Fracciones y decimales', 'neon-fracciones', 4, 7, 'Velocidad', 'p5-m-a2')
      ], { saberIds: ['p5-m-a2'] }),
      unit('p5-m-pct', 'Porcentajes básicos', 'LOMLOE · descuentos y partes de un todo.', [
        liveGame('p5-m-pct1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-a3'),
        liveMates('p5-m-pct2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-a3'),
        liveGame('p5-m-pct3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-a3'),
        liveMates('p5-m-pct4', 'Dos pasos', 2, 3, 7, null, 'p5-m-a3'),
        liveMates('p5-m-pct5', 'Misión Porcentajes básicos', 4, 4, 7, 'Repaso final', 'p5-m-a3')
      ], { saberIds: ['p5-m-a3'] }),
      unit('p5-m-med', 'Área y volumen', 'LOMLOE · medidas, perímetro y volumen.', [
        liveGame('p5-m-med1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-b1'),
        liveMates('p5-m-med2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-b1'),
        liveGame('p5-m-med3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-b1'),
        liveMates('p5-m-med4', 'Dos pasos', 2, 3, 7, null, 'p5-m-b1'),
        liveGame('p5-m-med5', 'Misión Área y volumen', 'neon-calculo', 4, 7, 'Geometría', 'p5-m-b1')
      ], { saberIds: ['p5-m-b1'] }),
      unit('p5-m-prop', 'Problemas de proporción', 'LOMLOE · escalas y repartos proporcionales.', [
        liveGame('p5-m-prop1', 'Tablas express', 'tablas-relampago', 2, 5, null, 'p5-m-a4'),
        liveMates('p5-m-prop2', 'Cálculo mental', 1, 2, 6, null, 'p5-m-a4'),
        liveGame('p5-m-prop3', 'Mix operaciones', 'neon-calculo', 3, 6, null, 'p5-m-a4'),
        liveMates('p5-m-prop4', 'Dos pasos', 2, 3, 7, null, 'p5-m-a4'),
        liveMates('p5-m-prop5', 'Misión Problemas de proporción', 4, 4, 7, 'Repaso final', 'p5-m-a4')
      ], { saberIds: ['p5-m-a4'] }),
      unit('p5-m-geo', 'Coordenadas y figuras', 'LOMLOE · plano cartesiano y transformaciones.', [
        liveGame('p5-m-geo1', 'Clasifica figuras', 'neon-clasifica', 2, 6, 'Formas', 'p5-m-c1'),
        liveGame('p5-m-geo2', 'Figuras en el plano', 'neon-clasifica', 3, 6, 'Geometría', 'p5-m-c1'),
        liveGame('p5-m-geo3', 'Coordenadas', 'neon-ordenar', 4, 6, 'Posición', 'p5-m-c1'),
        liveGame('p5-m-geo4', 'Simetría y giro', 'neon-clasifica', 4, 6, 'Transforma', 'p5-m-c1'),
        liveGame('p5-m-geo5', 'Misión geometría', 'neon-clasifica', 4, 6, 'Reto final', 'p5-m-c1')
      ], { saberIds: ['p5-m-c1'] }),
    ];
  }

  function primaria5Lengua() {
    return [
      unit('p5-l-arg', 'Textos argumentativos', 'LOMLOE · opinión y causa-consecuencia.', [
        liveLengua('p5-l-arg1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 10, 'p5-l-c1'),
        liveLenguaRot('p5-l-arg2', 'Ordena la frase', 2, 2, 'Sintaxis', 10, 'p5-l-c1'),
        liveLenguaRot('p5-l-arg3', 'Completa', 1, 3, 'Ortografía', 10, 'p5-l-c1'),
        liveLengua('p5-l-arg4', 'Dictado', 'neon-dictado', 4, 'Escucha', 10, 'p5-l-c1'),
        liveLenguaRot('p5-l-arg5', 'Misión lengua', 0, 4, 'Reto final', 10, 'p5-l-c1')
      ], { saberIds: ['p5-l-c1'] }),
      unit('p5-l-orto', 'Ortografía', 'LOMLOE · reglas ortográficas de 5º.', [
        liveLengua('p5-l-orto1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 10, 'p5-l-c2'),
        liveLenguaRot('p5-l-orto2', 'Ordena la frase', 2, 2, 'Sintaxis', 10, 'p5-l-c2'),
        liveLenguaRot('p5-l-orto3', 'Completa', 1, 3, 'Ortografía', 10, 'p5-l-c2'),
        liveLengua('p5-l-orto4', 'Dictado', 'neon-dictado', 4, 'Escucha', 10, 'p5-l-c2'),
        liveLenguaRot('p5-l-orto5', 'Misión lengua', 0, 4, 'Reto final', 10, 'p5-l-c2')
      ], { saberIds: ['p5-l-c2'] }),
      unit('p5-l-gram', 'Gramática avanzada', 'LOMLOE · oración compuesta.', [
        liveLengua('p5-l-gram1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 10, 'p5-l-c3'),
        liveLenguaRot('p5-l-gram2', 'Ordena la frase', 2, 2, 'Sintaxis', 10, 'p5-l-c3'),
        liveLenguaRot('p5-l-gram3', 'Completa', 1, 3, 'Ortografía', 10, 'p5-l-c3'),
        liveLengua('p5-l-gram4', 'Dictado', 'neon-dictado', 4, 'Escucha', 10, 'p5-l-c3'),
        liveLenguaRot('p5-l-gram5', 'Misión lengua', 0, 4, 'Reto final', 10, 'p5-l-c3')
      ], { saberIds: ['p5-l-c3'] }),
    ];
  }

  function primaria5Ingles() {
    return [
      unit('p5-i-perf', 'Present perfect', 'LOMLOE · experiencias recientes.', [
        liveIngles('p5-i-perf1', 'Vocab drill', 0, 1, 5, null, 'p5-i-e1'),
        liveIngles('p5-i-perf2', 'Listen & tap', 1, 2, 5, null, 'p5-i-e1'),
        liveIngles('p5-i-perf3', 'Fill the gap', 2, 3, 5, 'Grammar', 'p5-i-e1'),
        liveIngles('p5-i-perf4', 'Grammar quiz', 3, 3, 5, 'Grammar', 'p5-i-e1'),
        tagSaber(liveReflex('p5-i-perf5', 'English mission', 'flash-tap', 3), 'p5-i-e1')
      ], { saberIds: ['p5-i-e1'] }),
      unit('p5-i-fut', 'Future forms', 'LOMLOE · will y going to.', [
        liveIngles('p5-i-fut1', 'Vocab drill', 0, 1, 5, null, 'p5-i-e2'),
        liveIngles('p5-i-fut2', 'Listen & tap', 1, 2, 5, null, 'p5-i-e2'),
        liveIngles('p5-i-fut3', 'Fill the gap', 2, 3, 5, 'Future', 'p5-i-e2'),
        liveIngles('p5-i-fut4', 'Grammar quiz', 3, 3, 5, 'Grammar', 'p5-i-e2'),
        tagSaber(liveReflex('p5-i-fut5', 'English mission', 'flash-tap', 3), 'p5-i-e2')
      ], { saberIds: ['p5-i-e2'] }),
      unit('p5-i-oral', 'Oral presentations', 'LOMLOE · exponer ideas.', [
        liveIngles('p5-i-oral1', 'Vocab drill', 0, 1, 5, null, 'p5-i-e3'),
        liveIngles('p5-i-oral2', 'Listen & tap', 1, 2, 5, null, 'p5-i-e3'),
        liveIngles('p5-i-oral3', 'Fill the gap', 2, 3, 5, 'Speaking', 'p5-i-e3'),
        liveIngles('p5-i-oral4', 'Grammar quiz', 3, 3, 5, 'Grammar', 'p5-i-e3'),
        tagSaber(liveReflex('p5-i-oral5', 'English mission', 'flash-tap', 3), 'p5-i-e3')
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
        liveMates('p6-m-prop5', 'Misión Proporcionalidad', 4, 4, 8, 'Repaso final', 'p6-m-a1')
      ], { saberIds: ['p6-m-a1'] }),
      unit('p6-m-int', 'Números enteros', 'LOMLOE · positivos, negativos y recta numérica.', [
        liveGame('p6-m-int1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-a2'),
        liveMates('p6-m-int2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-a2'),
        liveGame('p6-m-int3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-a2'),
        liveMates('p6-m-int4', 'Dos pasos', 2, 3, 8, null, 'p6-m-a2'),
        liveMates('p6-m-int5', 'Misión Números enteros', 4, 4, 8, 'Repaso final', 'p6-m-a2')
      ], { saberIds: ['p6-m-a2'] }),
      unit('p6-m-frac', 'Fracciones avanzadas', 'LOMLOE · operaciones combinadas.', [
        liveGame('p6-m-frac1', 'Equivalencias avanzadas', 'neon-fracciones', 3, 7, 'Simplificar', 'p6-m-a3'),
        liveGame('p6-m-frac2', 'Compara y ordena', 'neon-fracciones', 3, 7, 'Comparación', 'p6-m-a3'),
        liveGame('p6-m-frac3', 'Mix fracciones', 'neon-fracciones', 3, 8, 'Velocidad', 'p6-m-a3'),
        liveGame('p6-m-frac4', 'Cálculo apoyo', 'neon-calculo', 2, 7, null, 'p6-m-a3'),
        liveGame('p6-m-frac5', 'Misión Fracciones avanzadas', 'neon-fracciones', 4, 8, 'Reto final', 'p6-m-a3')
      ], { saberIds: ['p6-m-a3'] }),
      unit('p6-m-stat', 'Estadística básica', 'LOMLOE · media, moda y gráficos.', [
        liveGame('p6-m-stat1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-b1'),
        liveMates('p6-m-stat2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-b1'),
        liveGame('p6-m-stat3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-b1'),
        liveMates('p6-m-stat4', 'Dos pasos', 2, 3, 8, null, 'p6-m-b1'),
        liveMates('p6-m-stat5', 'Misión Estadística básica', 4, 4, 8, 'Repaso final', 'p6-m-b1')
      ], { saberIds: ['p6-m-b1'] }),
      unit('p6-m-alg', 'Álgebra inicial', 'LOMLOE · incógnitas y problemas complejos.', [
        liveGame('p6-m-alg1', 'Tablas express', 'tablas-relampago', 2, 6, null, 'p6-m-a4'),
        liveMates('p6-m-alg2', 'Cálculo mental', 1, 2, 7, null, 'p6-m-a4'),
        liveGame('p6-m-alg3', 'Mix operaciones', 'neon-calculo', 3, 7, null, 'p6-m-a4'),
        liveMates('p6-m-alg4', 'Dos pasos', 2, 3, 8, null, 'p6-m-a4'),
        liveMates('p6-m-alg5', 'Misión Álgebra inicial', 4, 4, 8, 'Repaso final', 'p6-m-a4')
      ], { saberIds: ['p6-m-a4'] }),
      unit('p6-m-geo', 'Geometría avanzada', 'LOMLOE · circunferencia, área y volumen.', [
        liveGame('p6-m-geo1', 'Clasifica figuras', 'neon-clasifica', 2, 7, 'Formas', 'p6-m-c1'),
        liveGame('p6-m-geo2', 'Área y perímetro', 'neon-clasifica', 3, 7, 'Geometría', 'p6-m-c1'),
        liveGame('p6-m-geo3', 'Circunferencia', 'neon-calculo', 4, 7, 'π y radio', 'p6-m-c1'),
        liveGame('p6-m-geo4', 'Volumen', 'neon-calculo', 4, 7, 'Prismas', 'p6-m-c1'),
        liveGame('p6-m-geo5', 'Misión geometría', 'neon-calculo', 4, 7, 'Reto final', 'p6-m-c1')
      ], { saberIds: ['p6-m-c1'] }),
    ];
  }

  function primaria6Lengua() {
    return [
      unit('p6-l-anal', 'Análisis de textos', 'LOMLOE · ideas y argumentos.', [
        liveLengua('p6-l-anal1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 11, 'p6-l-c1'),
        liveLenguaRot('p6-l-anal2', 'Ordena la frase', 2, 2, 'Sintaxis', 11, 'p6-l-c1'),
        liveLenguaRot('p6-l-anal3', 'Completa', 1, 3, 'Ortografía', 11, 'p6-l-c1'),
        liveLengua('p6-l-anal4', 'Dictado', 'neon-dictado', 4, 'Escucha', 11, 'p6-l-c1'),
        liveLenguaRot('p6-l-anal5', 'Misión lengua', 0, 4, 'Reto final', 11, 'p6-l-c1')
      ], { saberIds: ['p6-l-c1'] }),
      unit('p6-l-red', 'Ortografía y redacción', 'LOMLOE · textos formales.', [
        liveLengua('p6-l-red1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 11, 'p6-l-c2'),
        liveLenguaRot('p6-l-red2', 'Ordena la frase', 2, 2, 'Sintaxis', 11, 'p6-l-c2'),
        liveLenguaRot('p6-l-red3', 'Completa', 1, 3, 'Ortografía', 11, 'p6-l-c2'),
        liveLengua('p6-l-red4', 'Dictado', 'neon-dictado', 4, 'Escucha', 11, 'p6-l-c2'),
        liveLenguaRot('p6-l-red5', 'Misión lengua', 0, 4, 'Reto final', 11, 'p6-l-c2')
      ], { saberIds: ['p6-l-c2'] }),
      unit('p6-l-lit', 'Literatura española', 'LOMLOE · autores y géneros.', [
        liveLengua('p6-l-lit1', 'Lee y responde', 'neon-lectura', 2, 'Comprensión', 11, 'p6-l-c3'),
        liveLenguaRot('p6-l-lit2', 'Ordena la frase', 2, 2, 'Sintaxis', 11, 'p6-l-c3'),
        liveLenguaRot('p6-l-lit3', 'Completa', 1, 3, 'Ortografía', 11, 'p6-l-c3'),
        liveLengua('p6-l-lit4', 'Dictado', 'neon-dictado', 4, 'Escucha', 11, 'p6-l-c3'),
        liveLenguaRot('p6-l-lit5', 'Misión lengua', 0, 4, 'Reto final', 11, 'p6-l-c3')
      ], { saberIds: ['p6-l-c3'] }),
    ];
  }

  function primaria6Ingles() {
    return [
      unit('p6-i-cond', 'Conditionals and modals', 'LOMLOE · hipótesis y obligación.', [
        liveIngles('p6-i-cond1', 'Vocab drill', 0, 1, 6, null, 'p6-i-e1'),
        liveIngles('p6-i-cond2', 'Listen & tap', 1, 2, 6, null, 'p6-i-e1'),
        liveIngles('p6-i-cond3', 'Fill the gap', 2, 3, 6, 'Modals', 'p6-i-e1'),
        liveIngles('p6-i-cond4', 'Grammar quiz', 3, 3, 6, 'Grammar', 'p6-i-e1'),
        tagSaber(liveReflex('p6-i-cond5', 'English mission', 'flash-tap', 3), 'p6-i-e1')
      ], { saberIds: ['p6-i-e1'] }),
      unit('p6-i-pass', 'Passive voice', 'LOMLOE · transformaciones.', [
        liveIngles('p6-i-pass1', 'Vocab drill', 0, 1, 6, null, 'p6-i-e2'),
        liveIngles('p6-i-pass2', 'Listen & tap', 1, 2, 6, null, 'p6-i-e2'),
        liveIngles('p6-i-pass3', 'Fill the gap', 2, 3, 6, 'Passive', 'p6-i-e2'),
        liveIngles('p6-i-pass4', 'Grammar quiz', 3, 3, 6, 'Grammar', 'p6-i-e2'),
        tagSaber(liveReflex('p6-i-pass5', 'English mission', 'flash-tap', 3), 'p6-i-e2')
      ], { saberIds: ['p6-i-e2'] }),
      unit('p6-i-proj', 'Project language', 'LOMLOE · vocabulario académico.', [
        liveIngles('p6-i-proj1', 'Vocab drill', 0, 1, 6, null, 'p6-i-e3'),
        liveIngles('p6-i-proj2', 'Listen & tap', 1, 2, 6, null, 'p6-i-e3'),
        liveIngles('p6-i-proj3', 'Fill the gap', 2, 3, 6, 'Academic', 'p6-i-e3'),
        liveIngles('p6-i-proj4', 'Grammar quiz', 3, 3, 6, 'Grammar', 'p6-i-e3'),
        tagSaber(liveReflex('p6-i-proj5', 'English mission', 'flash-tap', 3), 'p6-i-e3')
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
  /** —— 2º ESO (LOMLOE RD 243/2022) —— */
  function eso2Math() {
    return [
      unit('eso2-m-lin', 'Funciones lineales', 'LOMLOE · pendiente, intercepto y gráficas.', [
        liveGame('eso2-m-lin1', 'Cálculo express', 'neon-calculo', 3, 9, null, 'eso2-m-a1'),
        liveGame('eso2-m-lin2', 'Tablas flash', 'tablas-relampago', 2, 9, null, 'eso2-m-a1'),
        liveMates('eso2-m-lin3', 'Álgebra mental', 2, 3, 10, null, 'eso2-m-a1'),
        liveMates('eso2-m-lin4', 'Problemas', 3, 4, 10, null, 'eso2-m-a1'),
        liveMates('eso2-m-lin5', 'Misión Funciones lineales', 4, 4, 10, 'Repaso final', 'eso2-m-a1')
      ], { saberIds: ['eso2-m-a1'] }),
      unit('eso2-m-sis', 'Sistemas de ecuaciones', 'LOMLOE · resolución algebraica y gráfica.', [
        liveGame('eso2-m-sis1', 'Cálculo express', 'neon-calculo', 3, 9, null, 'eso2-m-a2'),
        liveGame('eso2-m-sis2', 'Tablas flash', 'tablas-relampago', 2, 9, null, 'eso2-m-a2'),
        liveMates('eso2-m-sis3', 'Álgebra mental', 2, 3, 10, null, 'eso2-m-a2'),
        liveMates('eso2-m-sis4', 'Problemas', 3, 4, 10, null, 'eso2-m-a2'),
        liveMates('eso2-m-sis5', 'Misión Sistemas de ecuaciones', 4, 4, 10, 'Repaso final', 'eso2-m-a2')
      ], { saberIds: ['eso2-m-a2'] }),
      unit('eso2-m-pit', 'Teorema de Pitágoras', 'LOMLOE · triángulos rectángulos.', [
        liveGame('eso2-m-pit1', 'Cálculo express', 'neon-calculo', 3, 9, null, 'eso2-m-a3'),
        liveGame('eso2-m-pit2', 'Tablas flash', 'tablas-relampago', 2, 9, null, 'eso2-m-a3'),
        liveMates('eso2-m-pit3', 'Álgebra mental', 2, 3, 10, null, 'eso2-m-a3'),
        liveMates('eso2-m-pit4', 'Problemas', 3, 4, 10, null, 'eso2-m-a3'),
        liveGame('eso2-m-pit5', 'Misión Teorema de Pitágoras', 'neon-calculo', 4, 10, 'Reto final', 'eso2-m-a3')
      ], { saberIds: ['eso2-m-a3'] }),
      unit('eso2-m-prob', 'Probabilidad', 'LOMLOE · experimentos aleatorios.', [
        liveGame('eso2-m-prob1', 'Cálculo express', 'neon-calculo', 3, 9, null, 'eso2-m-b1'),
        liveGame('eso2-m-prob2', 'Tablas flash', 'tablas-relampago', 2, 9, null, 'eso2-m-b1'),
        liveMates('eso2-m-prob3', 'Álgebra mental', 2, 3, 10, null, 'eso2-m-b1'),
        liveMates('eso2-m-prob4', 'Problemas', 3, 4, 10, null, 'eso2-m-b1'),
        liveMates('eso2-m-prob5', 'Misión Probabilidad', 4, 4, 10, 'Repaso final', 'eso2-m-b1')
      ], { saberIds: ['eso2-m-b1'] }),
      unit('eso2-m-real', 'Números reales', 'LOMLOE · irracionales y recta real.', [
        liveGame('eso2-m-real1', 'Cálculo express', 'neon-calculo', 3, 9, null, 'eso2-m-a4'),
        liveGame('eso2-m-real2', 'Tablas flash', 'tablas-relampago', 2, 9, null, 'eso2-m-a4'),
        liveMates('eso2-m-real3', 'Álgebra mental', 2, 3, 10, null, 'eso2-m-a4'),
        liveMates('eso2-m-real4', 'Problemas', 3, 4, 10, null, 'eso2-m-a4'),
        liveMates('eso2-m-real5', 'Misión Números reales', 4, 4, 10, 'Repaso final', 'eso2-m-a4')
      ], { saberIds: ['eso2-m-a4'] }),
      unit('eso2-m-geo', 'Geometría en el espacio', 'LOMLOE · prismas, pirámides y volumen.', [
        liveGame('eso2-m-geo1', 'Clasifica sólidos', 'neon-clasifica', 3, 10, 'Formas', 'eso2-m-c1'),
        liveGame('eso2-m-geo2', 'Volumen visual', 'neon-clasifica', 3, 10, 'Geometría', 'eso2-m-c1'),
        liveGame('eso2-m-geo3', 'Prismas y pirámides', 'neon-clasifica', 4, 10, 'Sólidos', 'eso2-m-c1'),
        liveGame('eso2-m-geo4', 'Cuerpos en 3D', 'neon-arrastra', 4, 10, 'Arrastra', 'eso2-m-c1'),
        liveGame('eso2-m-geo5', 'Misión geometría', 'neon-clasifica', 4, 10, 'Reto final', 'eso2-m-c1')
      ], { saberIds: ['eso2-m-c1'] }),
    ];
  }

  function eso2Lengua() {
    return [
      unit('eso2-l-mov', 'Movimientos literarios', 'LOMLOE · romanticismo y realismo.', [
        liveLengua('eso2-l-mov1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', 11, 'eso2-l-c1'),
        liveLenguaRot('eso2-l-mov2', 'Ordena y corrige', 2, 3, 'Sintaxis', 11, 'eso2-l-c1'),
        liveLenguaRot('eso2-l-mov3', 'Completa', 1, 4, 'Ortografía', 12, 'eso2-l-c1'),
        liveLenguaRot('eso2-l-mov4', 'Redacción', 3, 4, 'Escribe', 12, 'eso2-l-c1'),
        liveLenguaRot('eso2-l-mov5', 'Misión lengua', 0, 4, 'Reto final', 12, 'eso2-l-c1')
      ], { saberIds: ['eso2-l-c1'] }),
      unit('eso2-l-sin', 'Análisis sintáctico', 'LOMLOE · oraciones compuestas.', [
        liveLengua('eso2-l-sin1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', 11, 'eso2-l-c2'),
        liveLenguaRot('eso2-l-sin2', 'Ordena y corrige', 2, 3, 'Sintaxis', 11, 'eso2-l-c2'),
        liveLenguaRot('eso2-l-sin3', 'Completa', 1, 4, 'Ortografía', 12, 'eso2-l-c2'),
        liveLenguaRot('eso2-l-sin4', 'Redacción', 3, 4, 'Escribe', 12, 'eso2-l-c2'),
        liveLenguaRot('eso2-l-sin5', 'Misión lengua', 0, 4, 'Reto final', 12, 'eso2-l-c2')
      ], { saberIds: ['eso2-l-c2'] }),
      unit('eso2-l-av', 'Comunicación audiovisual', 'LOMLOE · medios y opinión.', [
        liveLengua('eso2-l-av1', 'Lee y analiza', 'neon-lectura', 3, 'Comprensión', 11, 'eso2-l-c3'),
        liveLenguaRot('eso2-l-av2', 'Ordena y corrige', 2, 3, 'Sintaxis', 11, 'eso2-l-c3'),
        liveLenguaRot('eso2-l-av3', 'Completa', 1, 4, 'Ortografía', 12, 'eso2-l-c3'),
        liveLenguaRot('eso2-l-av4', 'Redacción', 3, 4, 'Escribe', 12, 'eso2-l-c3'),
        liveLenguaRot('eso2-l-av5', 'Misión lengua', 0, 4, 'Reto final', 12, 'eso2-l-c3')
      ], { saberIds: ['eso2-l-c3'] }),
    ];
  }

  function eso2Ingles() {
    return [
      unit('eso2-i-rep', 'Reported speech', 'LOMLOE · estilo indirecto.', [
        liveIngles('eso2-i-rep1', 'Vocab drill', 0, 2, 9, null, 'eso2-i-e1'),
        liveIngles('eso2-i-rep2', 'Listen & tap', 1, 3, 9, null, 'eso2-i-e1'),
        liveIngles('eso2-i-rep3', 'Fill the gap', 2, 3, 9, 'Reported', 'eso2-i-e1'),
        liveIngles('eso2-i-rep4', 'Grammar quiz', 3, 3, 9, 'Grammar', 'eso2-i-e1'),
        tagSaber(liveReflex('eso2-i-rep5', 'English mission', 'flash-tap', 3), 'eso2-i-e1')
      ], { saberIds: ['eso2-i-e1'] }),
      unit('eso2-i-rel', 'Relative clauses', 'LOMLOE · oraciones de relativo.', [
        liveIngles('eso2-i-rel1', 'Vocab drill', 0, 2, 9, null, 'eso2-i-e2'),
        liveIngles('eso2-i-rel2', 'Listen & tap', 1, 3, 9, null, 'eso2-i-e2'),
        liveIngles('eso2-i-rel3', 'Fill the gap', 2, 3, 9, 'Relatives', 'eso2-i-e2'),
        liveIngles('eso2-i-rel4', 'Grammar quiz', 3, 3, 9, 'Grammar', 'eso2-i-e2'),
        tagSaber(liveReflex('eso2-i-rel5', 'English mission', 'flash-tap', 3), 'eso2-i-e2')
      ], { saberIds: ['eso2-i-e2'] }),
      unit('eso2-i-deb', 'Debate and opinion', 'LOMLOE · argumentar en inglés.', [
        liveIngles('eso2-i-deb1', 'Vocab drill', 0, 2, 9, null, 'eso2-i-e3'),
        liveIngles('eso2-i-deb2', 'Listen & tap', 1, 3, 9, null, 'eso2-i-e3'),
        liveIngles('eso2-i-deb3', 'Fill the gap', 2, 3, 9, 'Debate', 'eso2-i-e3'),
        liveIngles('eso2-i-deb4', 'Grammar quiz', 3, 3, 9, 'Grammar', 'eso2-i-e3'),
        tagSaber(liveReflex('eso2-i-deb5', 'English mission', 'flash-tap', 3), 'eso2-i-e3')
      ], { saberIds: ['eso2-i-e3'] }),
    ];
  }

  function eso2Naturales() {
    return [
      unit('eso2-n-gen', 'Genética y herencia', 'LOMLOE · ADN y variabilidad.', [
        liveNaturalesRot('eso2-n-gen1', 'Preguntas', 1, 3, 'Ciencia', 11, 'eso2-n-b1'),
        liveNaturalesRot('eso2-n-gen2', 'Verdadero o falso', 2, 3, 'Lee', 11, 'eso2-n-b1'),
        liveNaturalesRot('eso2-n-gen3', 'Clasifica', 0, 4, 'Naturales', 11, 'eso2-n-b1'),
        liveNaturalesRot('eso2-n-gen4', 'Experimento virtual', 1, 4, 'Comprensión', 12, 'eso2-n-b1'),
        liveNaturalesRot('eso2-n-gen5', 'Reto científico', 2, 5, 'Misión', 12, 'eso2-n-b1')
      ], { saberIds: ['eso2-n-b1'] }),
      unit('eso2-n-fue', 'Fuerzas y energía', 'LOMLOE · movimiento y electricidad.', [
        liveNaturalesRot('eso2-n-fue1', 'Preguntas', 1, 3, 'Ciencia', 11, 'eso2-n-b2'),
        liveNaturalesRot('eso2-n-fue2', 'Verdadero o falso', 2, 3, 'Lee', 11, 'eso2-n-b2'),
        liveNaturalesRot('eso2-n-fue3', 'Clasifica', 0, 4, 'Naturales', 11, 'eso2-n-b2'),
        liveNaturalesRot('eso2-n-fue4', 'Experimento virtual', 1, 4, 'Comprensión', 12, 'eso2-n-b2'),
        liveNaturalesRot('eso2-n-fue5', 'Reto científico', 2, 5, 'Misión', 12, 'eso2-n-b2')
      ], { saberIds: ['eso2-n-b2'] }),
      unit('eso2-n-sal', 'Salud y hábitos', 'LOMLOE · prevención adolescente.', [
        liveNaturalesRot('eso2-n-sal1', 'Preguntas', 1, 3, 'Ciencia', 11, 'eso2-n-b3'),
        liveNaturalesRot('eso2-n-sal2', 'Verdadero o falso', 2, 3, 'Lee', 11, 'eso2-n-b3'),
        liveNaturalesRot('eso2-n-sal3', 'Clasifica', 0, 4, 'Naturales', 11, 'eso2-n-b3'),
        liveNaturalesRot('eso2-n-sal4', 'Experimento virtual', 1, 4, 'Comprensión', 12, 'eso2-n-b3'),
        liveNaturalesRot('eso2-n-sal5', 'Reto científico', 2, 5, 'Misión', 12, 'eso2-n-b3')
      ], { saberIds: ['eso2-n-b3'] }),
    ];
  }

  function eso2Sociales() {
    return [
      unit('eso2-s-hum', 'Geografía humana', 'LOMLOE · población y globalización.', [
        liveSocialesRot('eso2-s-hum1', 'Lee y responde', 1, 3, 'Historia', 11, 'eso2-s-b1'),
        liveSocialesRot('eso2-s-hum2', 'Mapas', 0, 3, 'Geografía', 11, 'eso2-s-b1'),
        liveSocialesRot('eso2-s-hum3', 'Ordena', 2, 4, 'Convivencia', 11, 'eso2-s-b1'),
        liveSocialesRot('eso2-s-hum4', 'Debate corto', 1, 4, 'Ciudadanía', 12, 'eso2-s-b1'),
        liveSocialesRot('eso2-s-hum5', 'Misión social', 2, 5, 'Reto', 12, 'eso2-s-b1')
      ], { saberIds: ['eso2-s-b1'] }),
      unit('eso2-s-cont', 'Edad Contemporánea', 'LOMLOE · revoluciones s. XIX-XX.', [
        liveSocialesRot('eso2-s-cont1', 'Lee y responde', 1, 3, 'Historia', 11, 'eso2-s-b2'),
        liveSocialesRot('eso2-s-cont2', 'Mapas', 0, 3, 'Geografía', 11, 'eso2-s-b2'),
        liveSocialesRot('eso2-s-cont3', 'Ordena', 2, 4, 'Convivencia', 11, 'eso2-s-b2'),
        liveSocialesRot('eso2-s-cont4', 'Debate corto', 1, 4, 'Ciudadanía', 12, 'eso2-s-b2'),
        liveSocialesRot('eso2-s-cont5', 'Misión social', 2, 5, 'Reto', 12, 'eso2-s-b2')
      ], { saberIds: ['eso2-s-b2'] }),
      unit('eso2-s-eco', 'Economía y consumo', 'LOMLOE · mercado y oferta.', [
        liveSocialesRot('eso2-s-eco1', 'Lee y responde', 1, 3, 'Historia', 11, 'eso2-s-b3'),
        liveSocialesRot('eso2-s-eco2', 'Mapas', 0, 3, 'Geografía', 11, 'eso2-s-b3'),
        liveSocialesRot('eso2-s-eco3', 'Ordena', 2, 4, 'Convivencia', 11, 'eso2-s-b3'),
        liveSocialesRot('eso2-s-eco4', 'Debate corto', 1, 4, 'Ciudadanía', 12, 'eso2-s-b3'),
        liveSocialesRot('eso2-s-eco5', 'Misión social', 2, 5, 'Reto', 12, 'eso2-s-b3')
      ], { saberIds: ['eso2-s-b3'] }),
    ];
  }

  function eso2Daily() {
    return [
      unit('eso2-d-rutina', 'Brain Gym diario', 'LOMLOE · mates, idiomas y reflejos para ESO.', [
        liveGame('eso2-d1', 'Cálculo express', 'neon-calculo', 3, 9, null, 'eso2-m-a2'),
        liveGame('eso2-d2', 'Tablas flash', 'tablas-relampago', 2, 9, null, 'eso2-m-a2'),
        liveGame('eso2-d3', 'English drill', 'neon-palabras', 2, 9, null, 'eso2-i-e1'),
        liveLengua('eso2-d4', 'Mini lectura', 'neon-lectura', 2, 'Comprensión', 10, 'eso2-l-c1'),
        tagSaber(liveReflex('eso2-d5', 'Reflejos finales', 'reaction-test', 2), 'eso2-d-01')
      ], { saberIds: ['eso2-d-01'] })
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
      matching: subjectId === 'matematicas' ? 'neon-fracciones' : (subjectId === 'naturales' || subjectId === 'sociales'
        ? 'neon-clasifica'
        : (infantil ? 'neon-peques' : 'neon-silabas')),
      'multiple-choice': subjectId === 'matematicas' ? 'neon-mayor-menor' : (infantil ? 'neon-peques' : 'neon-lectura'),
      quiz: infantil ? 'neon-numeros' : (subjectId === 'ingles' ? 'neon-palabras' : 'neon-calculo'),
      listening: 'neon-palabras',
      'drag-drop': 'neon-arrastra',
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
      extras = ROT_INGLES.slice();
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
      'neon-fracciones': 'Mira la barra coloreada y elige la fracción correcta.',
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
