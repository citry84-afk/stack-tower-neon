/**
 * Referencia LOMLOE (marco estatal) — saberes básicos por curso y materia.
 * Fuentes: RD 95/2022 (Infantil), RD 157/2022 (Primaria).
 * Uso: trazabilidad editorial, cobertura curricular y auditoría.
 */
(function (global) {
  'use strict';

  var FRAMEWORK = {
    infantil: { decree: 'RD 95/2022', label: 'Educación Infantil' },
    primaria: { decree: 'RD 157/2022', label: 'Educación Primaria' }
  };

  /** Qué tipo de saber puede cubrir cada minijuego (honestidad editorial). */
  var GAME_AFFORDANCES = {
    'neon-peques': ['visual', 'vocabulario', 'conteo-pequeno', 'colores', 'formas', 'atencion', 'naturales-seres-vivos', 'naturales-cuerpo', 'naturales-materia', 'sociales-convivencia', 'sociales-geografia', 'ingles-vocabulario', 'ingles-oral', 'operaciones'],
    'neon-colores': ['colores', 'conteo-pequeno', 'visual', 'clasificacion', 'naturales-materia', 'vocabulario', 'ingles-vocabulario'],
    'neon-numeros': ['conteo-pequeno', 'numeros', 'visual', 'formas'],
    'flash-tap': ['atencion', 'reflejos', 'ingles-oral', 'clasificacion'],
    'neon-calculo': ['numeros', 'operaciones', 'conteo', 'problemas-numericos'],
    'neon-ordenar': ['numeros', 'ordenacion', 'conteo', 'operaciones'],
    'neon-mayor-menor': ['numeros', 'comparacion', 'ordenacion'],
    'neon-clasifica': ['clasificacion', 'formas', 'visual'],
    'neon-silabas': ['lectura', 'silabas', 'ortografia'],
    'neon-palabra': ['lectura', 'silabas', 'ortografia'],
    'neon-lectura': ['lectura', 'comprension'],
    'neon-frase': ['lectura', 'escritura', 'comprension'],
    'neon-palabras': ['ingles-vocabulario', 'ingles-oral'],
    'neon-vida': ['naturales-seres-vivos', 'naturales-clasificacion'],
    'neon-cuerpo': ['naturales-cuerpo', 'naturales-salud'],
    'neon-planeta': ['naturales-materia', 'naturales-planeta'],
    'neon-mapa': ['sociales-geografia', 'sociales-orientacion'],
    'neon-entorno': ['sociales-convivencia', 'sociales-geografia'],
    'neon-historia': ['sociales-historia', 'sociales-tiempo'],
    'tablas-relampago': ['multiplicacion', 'operaciones'],
    'reaction-test': ['reflejos', 'atencion'],
    'aim-trainer': ['reflejos', 'atencion']
  };

  /** Saberes por curso → materia → lista */
  var BY_COURSE = {
    'infantil-3': {
      matematicas: [
        { id: 'i3-m-01', tags: ['conteo-pequeno'], title: 'Cantidad y número hasta 3', desc: 'Reconocer cantidades pequeñas y comparar (más/menos).' },
        { id: 'i3-m-02', tags: ['colores'], title: 'Colores básicos', desc: 'Identificar y nombrar colores del entorno.' },
        { id: 'i3-m-03', tags: ['formas'], title: 'Formas en el entorno', desc: 'Reconocer círculo, cuadrado y triángulo en objetos cotidianos.' },
        { id: 'i3-m-04', tags: ['clasificacion'], title: 'Clasificar por un atributo', desc: 'Agrupar objetos por color, forma o tamaño.' }
      ],
      lenguaje: [
        { id: 'i3-l-01', tags: ['vocabulario'], title: 'Vocabulario del entorno', desc: 'Nombrar objetos, personas y acciones de la vida diaria.' },
        { id: 'i3-l-02', tags: ['comprension'], title: 'Comprensión de consignas', desc: 'Seguir instrucciones sencillas con apoyo visual.' },
        { id: 'i3-l-03', tags: ['atencion'], title: 'Atención y discriminación auditiva/visual', desc: 'Diferenciar sonidos e imágenes parecidas.' }
      ],
      ingles: [
        { id: 'i3-i-01', tags: ['ingles-vocabulario'], title: 'Primeras palabras en inglés', desc: 'Comprender vocabulario básico (animals, colours).' },
        { id: 'i3-i-02', tags: ['ingles-oral'], title: 'Respuesta a órdenes sencillas', desc: 'Point, tap, listen — comprensión oral inicial.' }
      ],
      naturales: [
        { id: 'i3-n-01', tags: ['naturales-seres-vivos'], title: 'Seres vivos y objetos', desc: 'Distinguir lo vivo de lo no vivo con ejemplos cercanos.' },
        { id: 'i3-n-02', tags: ['naturales-cuerpo'], title: 'Partes del cuerpo', desc: 'Nombrar cabeza, manos, pies y cuidados básicos.' },
        { id: 'i3-n-03', tags: ['naturales-materia'], title: 'El entorno natural', desc: 'Observar plantas, animales y fenómenos simples (sol, lluvia).' }
      ],
      sociales: [
        { id: 'i3-s-01', tags: ['sociales-convivencia'], title: 'Familia y emociones', desc: 'Reconocer emociones propias y de los demás.' },
        { id: 'i3-s-02', tags: ['sociales-convivencia'], title: 'Normas del aula', desc: 'Turnos, saludar y convivir en el cole.' },
        { id: 'i3-s-03', tags: ['sociales-geografia'], title: 'Lugares cercanos', desc: 'Casa, cole y espacios del barrio.' }
      ],
      'brain-gym-diario': [
        { id: 'i3-d-01', tags: ['atencion', 'reflejos'], title: 'Atención y coordinación', desc: 'Calentamiento visual y reflejos suaves (3 años).' }
      ]
    },
    'infantil-4': {
      matematicas: [
        { id: 'i4-m-01', tags: ['conteo-pequeno'], title: 'Conteo hasta 5', desc: 'Contar objetos con correspondencia uno a uno.' },
        { id: 'i4-m-02', tags: ['colores', 'clasificacion'], title: 'Clasificar y contar', desc: 'Agrupar por atributos y comparar cantidades.' },
        { id: 'i4-m-03', tags: ['formas'], title: 'Formas y seriaciones', desc: 'Completar patrones simples con formas y colores.' },
        { id: 'i4-m-04', tags: ['clasificacion'], title: 'Clasificar por atributo', desc: 'Agrupar por color, forma o tamaño.' }
      ],
      lenguaje: [
        { id: 'i4-l-01', tags: ['vocabulario'], title: 'Ampliación léxica', desc: 'Vocabulario de familia, colegio y juegos.' },
        { id: 'i4-l-02', tags: ['comprension'], title: 'Comprensión de consignas', desc: 'Seguir instrucciones con apoyo visual.' },
        { id: 'i4-l-03', tags: ['atencion'], title: 'Atención y discriminación', desc: 'Diferenciar estímulos visuales y auditivos.' }
      ],
      ingles: [
        { id: 'i4-i-01', tags: ['ingles-vocabulario'], title: 'Vocabulario temático', desc: 'Body, actions, colours en contexto.' },
        { id: 'i4-i-02', tags: ['ingles-oral'], title: 'Listen and respond', desc: 'Comprensión oral con apoyo visual.' }
      ],
      naturales: [
        { id: 'i4-n-01', tags: ['naturales-seres-vivos'], title: 'Animales y plantas', desc: 'Necesidades básicas de los seres vivos.' },
        { id: 'i4-n-02', tags: ['naturales-cuerpo'], title: 'Cuerpo y sentidos', desc: 'Identificar sentidos y hábitos de higiene.' },
        { id: 'i4-n-03', tags: ['naturales-materia'], title: 'El entorno natural', desc: 'Sol, lluvia y elementos cercanos.' }
      ],
      sociales: [
        { id: 'i4-s-01', tags: ['sociales-convivencia'], title: 'Convivencia y emociones', desc: 'Normas, turnos y expresión de sentimientos.' },
        { id: 'i4-s-02', tags: ['sociales-convivencia'], title: 'Normas del aula', desc: 'Turnos y convivencia en el cole.' },
        { id: 'i4-s-03', tags: ['sociales-geografia'], title: 'Mi entorno', desc: 'Familia, profesiones y lugares del barrio.' }
      ],
      'brain-gym-diario': [
        { id: 'i4-d-01', tags: ['atencion'], title: 'Rutina de atención', desc: 'Mezcla breve mates, idiomas y reflejos (4 años).' }
      ]
    },
    'infantil-5': {
      matematicas: [
        { id: 'i5-m-01', tags: ['conteo-pequeno', 'numeros'], title: 'Conteo hasta 10', desc: 'Preparación numérica para Primaria.' },
        { id: 'i5-m-02', tags: ['operaciones'], title: 'Sumas sin llevadas muy simples', desc: 'Introducción al cálculo con cantidades pequeñas.' },
        { id: 'i5-m-03', tags: ['formas', 'clasificacion'], title: 'Formas y clasificación', desc: 'Repaso visual antes de 1º Primaria.' },
        { id: 'i5-m-04', tags: ['clasificacion'], title: 'Clasificar y comparar', desc: 'Agrupar y ordenar antes de Primaria.' }
      ],
      lenguaje: [
        { id: 'i5-l-01', tags: ['vocabulario'], title: 'Vocabulario ampliado', desc: 'Palabras del entorno y del cole.' },
        { id: 'i5-l-02', tags: ['comprension'], title: 'Comprensión de consignas', desc: 'Instrucciones sencillas con apoyo visual.' },
        { id: 'i5-l-03', tags: ['lectura'], title: 'Primeras sílabas', desc: 'Relacionar sonido e imagen; lectura emergente.' }
      ],
      ingles: [
        { id: 'i5-i-01', tags: ['ingles-vocabulario'], title: 'Frases muy cortas', desc: 'Hello, colours, numbers 1–10.' },
        { id: 'i5-i-02', tags: ['ingles-oral'], title: 'Instrucciones en inglés', desc: 'Point, clap, listen — comprensión activa.' }
      ],
      naturales: [
        { id: 'i5-n-01', tags: ['naturales-seres-vivos'], title: 'Seres vivos y estaciones', desc: 'Ciclos básicos de la naturaleza.' },
        { id: 'i5-n-02', tags: ['naturales-salud'], title: 'Alimentación y salud', desc: 'Alimentos saludables y cuidado del cuerpo.' },
        { id: 'i5-n-03', tags: ['naturales-materia'], title: 'El entorno natural', desc: 'Observar fenómenos y seres vivos cercanos.' }
      ],
      sociales: [
        { id: 'i5-s-01', tags: ['sociales-convivencia'], title: 'Ciudadanía escolar', desc: 'Normas, señales y ayuda al compañero.' },
        { id: 'i5-s-02', tags: ['sociales-convivencia'], title: 'Convivencia en el aula', desc: 'Turnos y emociones en el cole.' },
        { id: 'i5-s-03', tags: ['sociales-geografia'], title: 'Mapas sencillos', desc: 'Orientación en espacios conocidos.' }
      ],
      'brain-gym-diario': [
        { id: 'i5-d-01', tags: ['atencion'], title: 'Preparación Primaria', desc: 'Rutina variada antes del salto a 1º (5 años).' }
      ]
    },
    'primaria-1': {
      matematicas: [
        { id: 'p1-m-a1', tags: ['numeros', 'conteo'], title: 'Conteo y números hasta 99', desc: 'Contar, leer y escribir números; comparar cantidades.' },
        { id: 'p1-m-a2', tags: ['operaciones'], title: 'Composición y descomposición del 10', desc: 'Base del cálculo mental en 1º.' },
        { id: 'p1-m-a3', tags: ['operaciones'], title: 'Suma y resta sin llevadas', desc: 'Operaciones hasta 20 con significado.' },
        { id: 'p1-m-a4', tags: ['comparacion', 'ordenacion'], title: 'Comparación y ordenación', desc: 'Comparar y ordenar cantidades y números.' },
        { id: 'p1-m-a5', tags: ['problemas-numericos'], title: 'Problemas de una operación', desc: 'Leer, entender y resolver en un paso.' },
        { id: 'p1-m-b1', tags: ['ordenacion'], title: 'Medida y tiempo', desc: 'Días de la semana, meses y magnitudes no convencionales.' },
        { id: 'p1-m-c1', tags: ['formas'], title: 'Figuras planas', desc: 'Identificar círculo, cuadrado, triángulo y rectángulo.' }
      ],
      lenguaje: [
        { id: 'p1-l-c1', tags: ['silabas', 'lectura'], title: 'Grafema–fonema y sílabas directas', desc: 'Lectura de sílabas y palabras cortas.' },
        { id: 'p1-l-c2', tags: ['lectura', 'comprension'], title: 'Comprensión literal', desc: 'Textos breves con preguntas directas.' },
        { id: 'p1-l-c3', tags: ['escritura'], title: 'Frases simples', desc: 'Mayúscula, punto y orden de palabras.' },
        { id: 'p1-l-c4', tags: ['vocabulario'], title: 'Vocabulario cotidiano', desc: 'Léxico de casa, colegio y familia.' }
      ],
      ingles: [
        { id: 'p1-i-e1', tags: ['ingles-vocabulario'], title: 'Saludos y presentaciones', desc: 'Hello, goodbye, my name is…' },
        { id: 'p1-i-e2', tags: ['ingles-vocabulario'], title: 'Numbers and colours', desc: 'Numbers 1–20, colours and classroom objects.' },
        { id: 'p1-i-e3', tags: ['ingles-vocabulario'], title: 'Animals and likes', desc: 'Animals, this is a…, I like…' }
      ],
      naturales: [
        { id: 'p1-n-b1', tags: ['naturales-seres-vivos'], title: 'Seres vivos', desc: 'Animales, plantas y necesidades básicas.' },
        { id: 'p1-n-b2', tags: ['naturales-cuerpo', 'naturales-salud'], title: 'Cuerpo y salud', desc: 'Sentidos, higiene y hábitos saludables.' },
        { id: 'p1-n-b3', tags: ['naturales-materia'], title: 'Materia y energía', desc: 'Agua, aire, luz y cuidado del entorno.' }
      ],
      sociales: [
        { id: 'p1-s-b1', tags: ['sociales-convivencia'], title: 'Mi entorno y convivencia', desc: 'Familia, colegio y normas.' },
        { id: 'p1-s-b2', tags: ['sociales-geografia'], title: 'Mapas y paisaje', desc: 'Orientación y lugares cercanos.' },
        { id: 'p1-s-b3', tags: ['sociales-historia'], title: 'Historia cercana', desc: 'Fiestas, tiempo y cambios en la vida cotidiana.' }
      ],
      'brain-gym-diario': [
        { id: 'p1-d-01', tags: ['atencion'], title: 'Rutina diaria equilibrada', desc: 'Mates, lengua, inglés y reflejos en 7 min.' }
      ]
    },
    'primaria-2': {
      matematicas: [
        { id: 'p2-m-a1', tags: ['numeros', 'comparacion'], title: 'Números hasta 999', desc: 'Centenas, comparación y ordenación.' },
        { id: 'p2-m-a2', tags: ['operaciones'], title: 'Sumas y restas con llevadas', desc: 'Cálculo mental con un paso más.' },
        { id: 'p2-m-a3', tags: ['multiplicacion'], title: 'Tablas del 2, 5 y 10', desc: 'Multiplicar como suma repetida.' },
        { id: 'p2-m-b1', tags: ['operaciones', 'ordenacion'], title: 'Dinero y tiempo', desc: 'Monedas, euros y media hora.' },
        { id: 'p2-m-c1', tags: ['formas'], title: 'Polígonos y geometría', desc: 'Lados, vértices y simetría básica.' }
      ],
      lenguaje: [
        { id: 'p2-l-c1', tags: ['lectura', 'comprension'], title: 'Comprensión de textos breves', desc: 'Personajes, lugar e idea principal.' },
        { id: 'p2-l-c2', tags: ['ortografia', 'silabas'], title: 'Ortografía básica', desc: 'ca/co/cu, que/qui, m antes de p/b.' },
        { id: 'p2-l-c3', tags: ['escritura'], title: 'Nombre, verbo y adjetivo', desc: 'Primeras categorías gramaticales.' }
      ],
      ingles: [
        { id: 'p2-i-e1', tags: ['ingles-vocabulario'], title: 'Family and body', desc: 'Vocabulario de familia y partes del cuerpo.' },
        { id: 'p2-i-e2', tags: ['ingles-vocabulario'], title: 'Food and actions', desc: 'Comida y verbos de acción.' },
        { id: 'p2-i-e3', tags: ['ingles-vocabulario'], title: 'Numbers 1–50', desc: 'Contar y comparar en inglés.' }
      ],
      naturales: [
        { id: 'p2-n-b1', tags: ['naturales-seres-vivos'], title: 'Seres vivos y hábitats', desc: 'Vertebrados, invertebrados y entorno.' },
        { id: 'p2-n-b2', tags: ['naturales-cuerpo', 'naturales-salud'], title: 'Cuerpo y salud', desc: 'Alimentación y hábitos saludables.' },
        { id: 'p2-n-b3', tags: ['naturales-materia'], title: 'Materia y energía', desc: 'Agua, reciclaje e imanes.' }
      ],
      sociales: [
        { id: 'p2-s-b1', tags: ['sociales-convivencia'], title: 'Convivencia y entorno', desc: 'Normas, ayuntamiento y ciudadanía.' },
        { id: 'p2-s-b2', tags: ['sociales-geografia'], title: 'Mapas y relieve', desc: 'Europa, España, ríos y montañas.' },
        { id: 'p2-s-b3', tags: ['sociales-historia'], title: 'Prehistoria y pueblos antiguos', desc: 'Primeras civilizaciones cercanas.' }
      ],
      'brain-gym-diario': [
        { id: 'p2-d-01', tags: ['atencion'], title: 'Rutina diaria equilibrada', desc: 'Mates, lengua, inglés y reflejos en 7 min.' }
      ]
    },
    'primaria-3': {
      matematicas: [
        { id: 'p3-m-a1', tags: ['multiplicacion'], title: 'Multiplicación', desc: 'Tablas y productos con fluidez.' },
        { id: 'p3-m-a2', tags: ['operaciones'], title: 'División sencilla', desc: 'Repartir y agrupar.' },
        { id: 'p3-m-a3', tags: ['operaciones'], title: 'Fracciones básicas', desc: 'Medios, tercios y cuartos.' },
        { id: 'p3-m-b1', tags: ['operaciones'], title: 'Medidas y perímetro', desc: 'Longitud y contorno.' },
        { id: 'p3-m-a4', tags: ['problemas-numericos'], title: 'Problemas de dos pasos', desc: 'Planificar antes de calcular.' }
      ],
      lenguaje: [
        { id: 'p3-l-c1', tags: ['lectura', 'comprension'], title: 'Textos narrativos e informativos', desc: 'Comprender y resumir.' },
        { id: 'p3-l-c2', tags: ['ortografia', 'silabas'], title: 'Ortografía b/v, g/j, r/rr', desc: 'Reglas frecuentes en 3º.' },
        { id: 'p3-l-c3', tags: ['lectura', 'comprension'], title: 'Géneros literarios', desc: 'Cuento, poesía y fábula.' }
      ],
      ingles: [
        { id: 'p3-i-e1', tags: ['ingles-vocabulario'], title: 'Present simple', desc: 'Rutinas y hechos cotidianos.' },
        { id: 'p3-i-e2', tags: ['ingles-vocabulario'], title: "Can / can't · there is/are", desc: 'Habilidad y descripción.' },
        { id: 'p3-i-e3', tags: ['ingles-oral'], title: 'Listening e instrucciones', desc: 'Seguir órdenes en inglés.' }
      ],
      naturales: [
        { id: 'p3-n-b1', tags: ['naturales-seres-vivos'], title: 'Ecosistemas y cadenas', desc: 'Seres vivos y relaciones.' },
        { id: 'p3-n-b2', tags: ['naturales-cuerpo', 'naturales-salud'], title: 'Cuerpo humano', desc: 'Sistemas del cuerpo y salud.' },
        { id: 'p3-n-b3', tags: ['naturales-materia'], title: 'Materia y energía', desc: 'Estados, electricidad y recursos.' }
      ],
      sociales: [
        { id: 'p3-s-b1', tags: ['sociales-convivencia'], title: 'Constitución y derechos', desc: 'Convivencia y ciudadanía.' },
        { id: 'p3-s-b2', tags: ['sociales-geografia'], title: 'Península y clima', desc: 'Mapas, relieve y climas de España.' },
        { id: 'p3-s-b3', tags: ['sociales-historia'], title: 'Edad Antigua y Media', desc: 'Roma, castillos y línea del tiempo.' }
      ],
      'brain-gym-diario': [
        { id: 'p3-d-01', tags: ['atencion'], title: 'Rutina diaria equilibrada', desc: 'Mates, lengua, inglés y reflejos en 7 min.' }
      ]
    }
  };

  var SABER_INDEX = {};
  Object.keys(BY_COURSE).forEach(function (courseId) {
    Object.keys(BY_COURSE[courseId]).forEach(function (subjectId) {
      BY_COURSE[courseId][subjectId].forEach(function (s) {
        SABER_INDEX[s.id] = Object.assign({ courseId: courseId, subjectId: subjectId }, s);
      });
    });
  });

  function getSaberes(courseId, subjectId) {
    var course = BY_COURSE[courseId];
    if (!course) return [];
    if (subjectId) return (course[subjectId] || []).slice();
    var all = [];
    Object.keys(course).forEach(function (sid) {
      all = all.concat(course[sid]);
    });
    return all;
  }

  function getSaber(saberId) {
    return SABER_INDEX[saberId] || null;
  }

  function saberLabels(saberIds) {
    return (saberIds || []).map(function (id) {
      var s = SABER_INDEX[id];
      return s ? s.title : id;
    });
  }

  function gameCanCover(gameId, saberId) {
    var saber = SABER_INDEX[saberId];
    if (!saber) return true;
    var afford = GAME_AFFORDANCES[gameId];
    if (!afford) return true;
    if (!saber.tags || !saber.tags.length) return true;
    return saber.tags.some(function (t) { return afford.indexOf(t) >= 0; });
  }

  function coverageForCourse(courseId, liveActivities) {
    var expected = getSaberes(courseId);
    var covered = {};
    var mismatches = [];

    (liveActivities || []).forEach(function (act) {
      (act.saberIds || []).forEach(function (sid) {
        covered[sid] = (covered[sid] || 0) + 1;
        if (act.gameId && !gameCanCover(act.gameId, sid)) {
          mismatches.push({
            activityId: act.id,
            gameId: act.gameId,
            saberId: sid,
            title: act.title
          });
        }
      });
    });

    var missing = expected.filter(function (s) { return !covered[s.id]; });
    var pct = expected.length
      ? Math.round(((expected.length - missing.length) / expected.length) * 100)
      : 100;

    return {
      courseId: courseId,
      expected: expected.length,
      covered: expected.length - missing.length,
      percent: pct,
      missing: missing,
      mismatches: mismatches
    };
  }

  global.LipaLomloeRef = {
    FRAMEWORK: FRAMEWORK,
    GAME_AFFORDANCES: GAME_AFFORDANCES,
    BY_COURSE: BY_COURSE,
    getSaberes: getSaberes,
    getSaber: getSaber,
    saberLabels: saberLabels,
    gameCanCover: gameCanCover,
    coverageForCourse: coverageForCourse
  };
})(typeof window !== 'undefined' ? window : global);
