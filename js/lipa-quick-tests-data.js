/**
 * Banco de preguntas para retos rápidos
 */
(function (global) {
  'use strict';

  function q(id, type, prompt, opts, correctIndex, explanation, skillTag, difficulty) {
    var item = {
      id: id,
      type: type,
      prompt: prompt,
      explanation: explanation || '¡Buen trabajo!',
      skillTag: skillTag || 'general',
      difficulty: difficulty || 1,
      estimatedSeconds: type === 'tf' ? 15 : 25
    };
    if (type === 'mcq') {
      item.options = opts;
      item.correctIndex = correctIndex;
    } else {
      item.correct = correctIndex === 1 || correctIndex === true;
    }
    return item;
  }

  var BY_CATEGORY = {
    logica: [
      q('lg1', 'mcq', '¿Qué número sigue? 2, 4, 6, 8, …', ['9', '10', '12', '14'], 1, 'Es una serie de números pares: cada vez sumas 2.', 'series-pares', 1),
      q('lg2', 'mcq', 'Si ▲ ● ▲ ● ▲ … ¿qué figura va después?', ['▲', '●', '■', '★'], 1, 'El patrón alterna triángulo y círculo.', 'patrones', 1),
      q('lg3', 'tf', 'Un cuadrado tiene 4 lados iguales.', null, true, 'Correcto: todos los lados de un cuadrado miden lo mismo.', 'formas', 1),
      q('lg4', 'mcq', '¿Qué pieza completa la serie? 1, 3, 5, 7, …', ['8', '9', '10', '11'], 1, 'Son números impares en orden.', 'series-impares', 2),
      q('lg5', 'mcq', 'Manzana es a fruta como perro es a…', ['hueso', 'animal', 'planta', 'coche'], 1, 'La relación es «pertenece a la categoría».', 'analogias', 2),
      q('lg6', 'tf', 'Si hoy es martes, dentro de 2 días será jueves.', null, true, 'Martes + 2 días = jueves.', 'tiempo-logico', 2),
      q('lg7', 'mcq', '¿Cuántos triángulos hay en un pentágono si lo divides desde un vértice?', ['2', '3', '4', '5'], 1, 'Desde un vértice puedes trazar 3 triángulos en un pentágono.', 'geometria-logica', 3),
      q('lg8', 'mcq', 'Serie: A, C, E, G, … ¿letra siguiente?', ['H', 'I', 'J', 'K'], 1, 'Saltas una letra cada vez (A→C→E→G→I).', 'series-letras', 2),
      q('lg9', 'tf', 'Todos los rectángulos son cuadrados.', null, false, 'No: un rectángulo puede tener lados distintos; el cuadrado es un caso especial.', 'formas', 2),
      q('lg10', 'mcq', '3, 6, 12, 24, … ¿siguiente?', ['30', '36', '48', '72'], 2, 'Cada número se multiplica por 2.', 'series-x2', 3),
      q('lg11', 'mcq', '¿Qué opción no encaja? Rosa, Tulipán, Mesa, Lirio', ['Rosa', 'Tulipán', 'Mesa', 'Lirio'], 2, 'Mesa no es una flor.', 'clasificar', 1),
      q('lg12', 'tf', 'Si A > B y B > C, entonces A > C.', null, true, 'Es una regla de orden lógico.', 'orden', 3)
    ],
    ortografia: [
      q('or1', 'mcq', 'Elige la palabra bien escrita:', ['baca', 'vaca', 'bacca', 'vakka'], 1, 'Vaca se escribe con V.', 'b-v', 1),
      q('or2', 'mcq', '¿Cuál lleva tilde?', ['arbol', 'árbol', 'arbol', 'arból'], 1, 'Árbol lleva tilde en la a.', 'tildes', 2),
      q('or3', 'tf', '«Había» se escribe con H.', null, true, 'El verbo haber en imperfecto lleva hache.', 'h', 2),
      q('or4', 'mcq', 'Completa: «Fui al ___ a comprar pan.»', ['billar', 'villar', 'pueblo', 'boliche'], 2, 'La frase habitual es «fui al pueblo»; ojo con b/v en otras palabras.', 'b-v-contexto', 2),
      q('or5', 'mcq', '¿Cómo se escribe la acción de ver algo?', ['beo', 'veo', 'veo', 'béo'], 1, 'Del verbo ver: yo veo (con v).', 'b-v', 1),
      q('or6', 'mcq', 'El plural de «lápiz» es:', ['lápices', 'lápizes', 'lápizs', 'lápiz'], 0, 'Las palabras en -z forman plural en -ces: lápices.', 'plurales', 2),
      q('or7', 'tf', '«Gente» se escribe con G.', null, true, 'Siempre con g: gente.', 'g-j', 1),
      q('or8', 'mcq', '¿Cuál es correcta?', ['jirafa', 'girafa', 'jirafa', 'yirafa'], 0, 'Jirafa se escribe con J.', 'g-j', 1),
      q('or9', 'mcq', '«___ había mucha gente.»', ['Aya', 'Haya', 'Halla', 'Allá'], 1, 'Del verbo haber: haya (presente subjuntivo) o en muchos textos «había» = ya estaba.', 'h', 3),
      q('or10', 'mcq', 'Signos en una pregunta:', ['¿Cómo te llamas?', 'Cómo te llamas?', '¿Cómo te llamas', 'Cómo te llamas'], 0, 'En español: ¿ al inicio y ? al final.', 'signos', 2),
      q('or11', 'tf', '«Voy a ber el mar» está bien escrito.', null, false, 'Debe ser «ver» con v, no «ber».', 'b-v', 1),
      q('or12', 'mcq', 'Mayúscula correcta:', ['madrid es bonita', 'Madrid es bonita', 'madrid Es bonita', 'MADRID es bonita'], 1, 'Los nombres propios (Madrid) llevan mayúscula.', 'mayusculas', 1)
    ],
    'cultura-general': [
      q('cg1', 'mcq', '¿De qué color es Marte visto desde la Tierra?', ['Azul', 'Rojo', 'Verde', 'Amarillo'], 1, 'Marte es el «planeta rojo» por el óxido de hierro en su superficie.', 'planetas', 1),
      q('cg2', 'tf', 'Las ballenas son peces.', null, false, 'Las ballenas son mamíferos; respiran aire.', 'animales', 1),
      q('cg3', 'mcq', '¿Cuál es la capital de España?', ['Barcelona', 'Madrid', 'Valencia', 'Sevilla'], 1, 'Madrid es la capital del Estado.', 'geografia', 1),
      q('cg4', 'mcq', '¿Qué gas necesitan las plantas para hacer la fotosíntesis?', ['Nitrógeno', 'Dióxido de carbono', 'Helio', 'Oro'], 1, 'Absorben CO₂ y con luz producen oxígeno y alimento.', 'ciencias', 2),
      q('cg5', 'tf', 'El agua hierve a 100 °C a nivel del mar.', null, true, 'A presión normal, el punto de ebullición del agua es 100 °C.', 'ciencias', 2),
      q('cg6', 'mcq', '¿Qué inventó la bombilla eléctrica práctica (versión famosa)?', ['Newton', 'Edison', 'Curie', 'Galileo'], 1, 'Thomas Edison popularizó una lámpara duradera.', 'historia', 2),
      q('cg7', 'mcq', '¿Cuántos continentes se enseñan habitualmente en primaria en España?', ['5', '6', '7', '8'], 2, 'Suelen contarse 7: África, América, Antártida, Asia, Europa, Oceanía.', 'geografia', 2),
      q('cg8', 'mcq', 'El corazón humano bombea…', ['solo aire', 'sangre', 'agua del mar', 'luz'], 1, 'El corazón impulsa la sangre por el cuerpo.', 'cuerpo', 1),
      q('cg9', 'tf', 'Los dinosaurios convivieron con los humanos modernos.', null, false, 'Los dinosaurios se extinguieron hace millones de años antes de los humanos.', 'historia', 2),
      q('cg10', 'mcq', '¿Qué reciclamos en el contenedor amarillo?', ['Resto', 'Envases ligeros', 'Vidrio', 'Orgánico'], 1, 'El amarillo es para envases (plástico, latas, bricks).', 'medioambiente', 2),
      q('cg11', 'mcq', '¿Qué animal es el más grande del mundo?', ['Elefante africano', 'Ballena azul', 'Jirafa', 'Oso polar'], 1, 'La ballena azul supera en tamaño a cualquier otro animal.', 'animales', 2),
      q('cg12', 'tf', 'La Luna brilla porque produce su propia luz.', null, false, 'La Luna refleja la luz del Sol.', 'espacio', 1)
    ],
    digital: [
      q('dg1', 'mcq', 'Una contraseña segura suele tener…', ['solo letras', 'letras, números y símbolos', 'tu nombre', '1234'], 1, 'Mezclar tipos de caracteres la hace más difícil de adivinar.', 'seguridad-online', 1),
      q('dg2', 'tf', 'Está bien compartir tu contraseña con un amigo de confianza.', null, false, 'Las contraseñas son personales; compartirlas aumenta el riesgo.', 'privacidad', 1),
      q('dg3', 'mcq', 'Si un desconocido te pide datos en un juego online, lo mejor es…', ['dar el DNI', 'no compartir y avisar a un adulto', 'enviar foto', 'decir dónde vives'], 1, 'Nunca compartas datos personales con desconocidos.', 'privacidad', 2),
      q('dg4', 'mcq', '¿Qué es un phishing?', ['un deporte', 'un engaño para robar datos', 'un virus de papel', 'una red social'], 1, 'Phishing: mensajes falsos que imitan empresas reales.', 'phishing', 3),
      q('dg5', 'tf', 'Descargar apps solo de tiendas oficiales suele ser más seguro.', null, true, 'Google Play y App Store revisan apps, aunque siempre conviene leer permisos.', 'apps', 2),
      q('dg6', 'mcq', 'Antes de publicar una foto tuya en internet conviene…', ['publicar sin pensar', 'pensar si quieres que la vea todo el mundo', 'poner tu dirección', 'etiquetar a desconocidos'], 1, 'En internet la imagen puede copiarse y difundirse.', 'huella-digital', 2),
      q('dg7', 'mcq', 'Si recibes un mensaje de premio que pide tu clave bancaria…', ['es seguro', 'es sospechoso: no lo compartas', 'hay que responder rápido', 'es obligatorio'], 1, 'Los premios reales no piden contraseñas por mensaje.', 'estafas', 2),
      q('dg8', 'tf', 'Actualizar el sistema del móvil ayuda a corregir fallos de seguridad.', null, true, 'Las actualizaciones incluyen parches de seguridad.', 'actualizaciones', 2),
      q('dg9', 'mcq', '¿Qué hace un bloqueador de pantalla con PIN?', ['gasta batería', 'protege si pierdes el dispositivo', 'borra fotos', 'acelera internet'], 1, 'Evita que otros usen tu móvil o tablet sin permiso.', 'dispositivos', 1),
      q('dg10', 'mcq', 'Cyberacoso es…', ['jugar online', 'insultar o molestar repetidamente por internet', 'hacer deberes', 'ver vídeos'], 1, 'Hay que pedir ayuda a adultos de confianza si ocurre.', 'cyberacoso', 3),
      q('dg11', 'tf', 'Todo lo que lees en internet es verdad.', null, false, 'Comprueba fuentes fiables y pregunta a un adulto si dudas.', 'critica', 2),
      q('dg12', 'mcq', 'Si algo online te hace sentir mal, lo mejor es…', ['seguir solo', 'hablar con un adulto de confianza', 'guardar silencio', 'responder con insultos'], 1, 'Pedir ayuda es señal de madurez, no de debilidad.', 'bienestar', 1)
    ],
    finanzas: [
      q('fn1', 'mcq', 'La paga o mesada sirve para…', ['gastar todo el primer día', 'aprender a ahorrar y planificar', 'tirarla', 'prestarla a desconocidos'], 1, 'Es una oportunidad para practicar decisiones con dinero.', 'paga', 1),
      q('fn2', 'tf', 'Ahorrar es guardar una parte del dinero para el futuro.', null, true, 'Ahorrar te ayuda a conseguir metas (libro, juego, excursión).', 'ahorro', 1),
      q('fn3', 'mcq', '¿Necesidad o deseo? Agua cuando tienes sed.', ['deseo', 'necesidad', 'capricho', 'regalo'], 1, 'Cubrir necesidades básicas va primero.', 'necesidad-deseo', 1),
      q('fn4', 'mcq', 'Tienes 5 € de paga. ¿Qué es más responsable?', ['gastar los 5 en chuches hoy', 'guardar 2 € y gastar 3 con plan', 'perderlos', 'prestarlos sin acuerdo'], 1, 'Separar ahorro y gasto planificado es hábito sano.', 'decisiones', 2),
      q('fn5', 'tf', 'Comparar precios antes de comprar puede ahorrarte dinero.', null, true, 'Misma cosa, distinto precio: merece la pena mirar.', 'compras', 2),
      q('fn6', 'mcq', 'Un presupuesto simple es…', ['gastar sin límite', 'un plan de cuánto gastar y ahorrar', 'pedir siempre más', 'esconder monedas'], 1, 'Planificar evita quedarte sin dinero a mitad de mes.', 'presupuesto', 2),
      q('fn7', 'mcq', '¿Qué es el interés (idea básica)?', ['un impuesto de risa', 'dinero extra que ganas o pagas por usar dinero ahorrado o prestado', 'una moneda', 'un juego'], 1, 'El banco puede pagarte interés por ahorrar; un préstamo puede costarte interés.', 'interes', 3),
      q('fn8', 'tf', 'Pedir prestado sin devolver puede dañar la confianza.', null, true, 'La confianza con familia y amigos también es un valor.', 'prestamos', 2),
      q('fn9', 'mcq', '¿Para qué sirve una hucha?', ['decorar', 'separar monedas para ahorrar', 'tirar dinero', 'medir temperatura'], 1, 'Ver el ahorro crecer motiva a seguir.', 'ahorro', 1),
      q('fn10', 'mcq', 'Si un anuncio dice «gana dinero fácil en 1 clic»…', ['es seguro', 'desconfía: puede ser estafa', 'dale tu tarjeta', 'invita a todos'], 1, 'Lo demasiado bueno para ser verdad suele ser trampa.', 'estafas', 3),
      q('fn11', 'tf', 'Gastar en experiencias (museo, deporte) también puede ser buena inversión.', null, true, 'No todo el valor está en objetos; también en aprender y disfrutar.', 'valores', 2),
      q('fn12', 'mcq', 'Antes de comprar un capricho caro conviene…', ['comprar sin pensar', 'esperar un día y valorar si lo necesitas', 'pedir prestado a extraños', 'gastar el ahorro de otros'], 1, 'La regla de las 24 horas ayuda a evitar compras impulsivas.', 'impulsos', 2)
    ]
  };

  global.LipaQuickTestsData = {
    BY_CATEGORY: BY_CATEGORY
  };
})(typeof window !== 'undefined' ? window : global);
