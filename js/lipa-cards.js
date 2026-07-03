/**
 * Cartas Neon — colección de 48 cromos digitales.
 * Sobres al completar el entreno, jefes y rachas. Todo local, por perfil.
 */
(function (global) {
  'use strict';

  var RARITIES = {
    comun: { id: 'comun', name: 'Común', emoji: '🟢', order: 1, color: '#2ed3a6' },
    rara: { id: 'rara', name: 'Rara', emoji: '🔵', order: 2, color: '#4f8cff' },
    epica: { id: 'epica', name: 'Épica', emoji: '🟣', order: 3, color: '#9b7ede' },
    legendaria: { id: 'legendaria', name: 'Legendaria', emoji: '🌟', order: 4, color: '#ffd166' }
  };

  /* 48 cartas: 24 comunes · 14 raras · 7 épicas · 3 legendarias */
  var CARDS = [
    /* —— Comunes (mundo LIPA del día a día) —— */
    { id: 'lapiz-veloz', n: 1, name: 'Lápiz Veloz', emoji: '✏️', rarity: 'comun', desc: 'Escribe más rápido que tu sombra.' },
    { id: 'goma-rebota', n: 2, name: 'Goma Rebota', emoji: '🩹', rarity: 'comun', desc: 'Borra errores y los convierte en pistas.' },
    { id: 'regla-laser', n: 3, name: 'Regla Láser', emoji: '📏', rarity: 'comun', desc: 'Mide hasta las ganas de aprender.' },
    { id: 'mochila-turbo', n: 4, name: 'Mochila Turbo', emoji: '🎒', rarity: 'comun', desc: 'Lleva 7 minutos de energía extra.' },
    { id: 'cuaderno-neon', n: 5, name: 'Cuaderno Neon', emoji: '📓', rarity: 'comun', desc: 'Sus hojas brillan cuando aciertas.' },
    { id: 'tiza-magica', n: 6, name: 'Tiza Mágica', emoji: '🖍️', rarity: 'comun', desc: 'Dibuja soluciones en el aire.' },
    { id: 'brocoli-sabio', n: 7, name: 'Brócoli Sabio', emoji: '🥦', rarity: 'comun', desc: 'Verdura oficial del cerebro fuerte.' },
    { id: 'gato-tablas', n: 8, name: 'Gato de las Tablas', emoji: '🐱', rarity: 'comun', desc: 'Ronronea en múltiplos de 7.' },
    { id: 'perro-silabas', n: 9, name: 'Perro Sílabas', emoji: '🐶', rarity: 'comun', desc: 'Ladra pa-la-bras se-pa-ra-das.' },
    { id: 'pez-burbuja', n: 10, name: 'Pez Burbuja', emoji: '🐠', rarity: 'comun', desc: 'Sopla burbujas con vocales dentro.' },
    { id: 'tortuga-zen', n: 11, name: 'Tortuga Zen', emoji: '🐢', rarity: 'comun', desc: 'Despacio pero sin fallar ni una.' },
    { id: 'abeja-suma', n: 12, name: 'Abeja Suma', emoji: '🐝', rarity: 'comun', desc: 'Zumba sumando de flor en flor.' },
    { id: 'seta-powerup', n: 13, name: 'Seta Power-Up', emoji: '🍄', rarity: 'comun', desc: '+1 vida para tu racha.' },
    { id: 'balon-mundial', n: 14, name: 'Balón Mundial', emoji: '⚽', rarity: 'comun', desc: 'Marca goles de cultura general.' },
    { id: 'cubo-saber', n: 15, name: 'Cubo de Saber', emoji: '🧱', rarity: 'comun', desc: 'Craftea conocimiento bloque a bloque.' },
    { id: 'micro-estrella', n: 16, name: 'Micro Estrella', emoji: '🎤', rarity: 'comun', desc: 'Canta las tablas a ritmo pop.' },
    { id: 'cohete-papel', n: 17, name: 'Cohete de Papel', emoji: '📄', rarity: 'comun', desc: 'Vuela directo a la respuesta.' },
    { id: 'reloj-recreo', n: 18, name: 'Reloj del Recreo', emoji: '⏰', rarity: 'comun', desc: 'Siempre sabe cuándo toca jugar.' },
    { id: 'manzana-profe', n: 19, name: 'Manzana Profe', emoji: '🍎', rarity: 'comun', desc: 'Da clase de vitaminas.' },
    { id: 'lupa-detective', n: 20, name: 'Lupa Detective', emoji: '🔍', rarity: 'comun', desc: 'Encuentra la sílaba escondida.' },
    { id: 'mapa-bolsillo', n: 21, name: 'Mapa de Bolsillo', emoji: '🗺️', rarity: 'comun', desc: 'Cabe un planeta entero doblado.' },
    { id: 'globo-ingles', n: 22, name: 'Globo Inglés', emoji: '🎈', rarity: 'comun', desc: 'Flota diciendo hello, hello.' },
    { id: 'estrella-mar', n: 23, name: 'Estrella de Mar', emoji: '⭐', rarity: 'comun', desc: 'Cinco puntas, cinco aciertos.' },
    { id: 'caracol-wifi', n: 24, name: 'Caracol Wifi', emoji: '🐌', rarity: 'comun', desc: 'Lento pero con buena conexión.' },

    /* —— Raras (héroes de materia y arcade) —— */
    { id: 'sumatron', n: 25, name: 'Sumatrón 3000', emoji: '🤖', rarity: 'rara', desc: 'Robot que suma antes de que parpadees.' },
    { id: 'capitana-coma', n: 26, name: 'Capitana Coma', emoji: '🦸', rarity: 'rara', desc: 'Salva frases de morir sin pausas.' },
    { id: 'mister-verb', n: 27, name: 'Mister Verb', emoji: '🕵️', rarity: 'rara', desc: 'Agente secreto de los verbos en inglés.' },
    { id: 'doctora-celula', n: 28, name: 'Doctora Célula', emoji: '🔬', rarity: 'rara', desc: 'Ve la vida donde nadie mira.' },
    { id: 'atlas-junior', n: 29, name: 'Atlas Junior', emoji: '🌍', rarity: 'rara', desc: 'Sujeta el mundo con una mano.' },
    { id: 'torre-neon', n: 30, name: 'Torre Neon', emoji: '🗼', rarity: 'rara', desc: 'Cada bloque perfecto la hace brillar.' },
    { id: 'rayo-reflejo', n: 31, name: 'Rayo Reflejo', emoji: '⚡', rarity: 'rara', desc: 'Reacciona en menos de 200 ms.' },
    { id: 'diana-laser', n: 32, name: 'Diana Láser', emoji: '🎯', rarity: 'rara', desc: 'Ni un tiro fuera del centro.' },
    { id: 'buho-nocturno', n: 33, name: 'Búho Empollón', emoji: '🦉', rarity: 'rara', desc: 'Se sabe hasta las preguntas de mañana.' },
    { id: 'pulpo-multitarea', n: 34, name: 'Pulpo Multitarea', emoji: '🐙', rarity: 'rara', desc: 'Ocho brazos, ocho ejercicios a la vez.' },
    { id: 'zorro-astuto', n: 35, name: 'Zorro Astuto', emoji: '🦊', rarity: 'rara', desc: 'Siempre encuentra el atajo correcto.' },
    { id: 'dado-suerte', n: 36, name: 'Dado de la Suerte', emoji: '🎲', rarity: 'rara', desc: 'Saca un 6 y un 7 a la vez: six-seven.' },
    { id: 'trofeo-racha', n: 37, name: 'Trofeo Racha', emoji: '🏆', rarity: 'rara', desc: 'Se pule solo cada día que entrenas.' },
    { id: 'cometa-veloz', n: 38, name: 'Cometa Veloz', emoji: '☄️', rarity: 'rara', desc: 'Cruza el cielo del álbum una vez al mes.' },

    /* —— Épicas (guardianes del Brain Gym) —— */
    { id: 'dragon-calculo', n: 39, name: 'Dragón del Cálculo', emoji: '🐲', rarity: 'epica', desc: 'Escupe multiplicaciones en llamas.' },
    { id: 'fenix-ortografia', n: 40, name: 'Fénix de la Ortografía', emoji: '🦅', rarity: 'epica', desc: 'Renace de cada falta corregida.' },
    { id: 'unicornio-neon', n: 41, name: 'Unicornio Neon', emoji: '🦄', rarity: 'epica', desc: 'Su cuerno señala la respuesta correcta.' },
    { id: 'titan-memoria', n: 42, name: 'Titán de la Memoria', emoji: '🗿', rarity: 'epica', desc: 'No olvida nada desde la prehistoria.' },
    { id: 'ninja-mental', n: 43, name: 'Ninja Mental', emoji: '🥷', rarity: 'epica', desc: 'Resuelve problemas sin hacer ruido.' },
    { id: 'ballena-cosmica', n: 44, name: 'Ballena Cósmica', emoji: '🐋', rarity: 'epica', desc: 'Nada entre planetas repasando Naturales.' },
    { id: 'mago-fracciones', n: 45, name: 'Mago de las Fracciones', emoji: '🧙', rarity: 'epica', desc: 'Parte pizzas en trozos exactos con magia.' },

    /* —— Legendarias (formas de Lipi) —— */
    { id: 'lipi-dorado', n: 46, name: 'Lipi Dorado', emoji: '🧠', rarity: 'legendaria', desc: 'La forma que alcanza Lipi con rango Oro. Brilla de orgullo.' },
    { id: 'lipi-cosmico', n: 47, name: 'Lipi Cósmico', emoji: '🌌', rarity: 'legendaria', desc: 'Dicen que aparece cuando llevas 30 días de racha.' },
    { id: 'lipi-arcoiris', n: 48, name: 'Lipi Arcoíris', emoji: '🌈', rarity: 'legendaria', desc: 'La carta más buscada del universo LIPA.' }
  ];

  var CARDS_BY_ID = {};
  CARDS.forEach(function (c) { CARDS_BY_ID[c.id] = c; });

  var PACK_TYPES = {
    normal: {
      id: 'normal',
      name: 'Sobre Neon',
      emoji: '🎁',
      cards: 3,
      odds: { comun: 0.70, rara: 0.225, epica: 0.06, legendaria: 0.015 },
      pity: 'rara'
    },
    epico: {
      id: 'epico',
      name: 'Sobre Épico',
      emoji: '💎',
      cards: 3,
      odds: { comun: 0.42, rara: 0.36, epica: 0.17, legendaria: 0.05 },
      pity: 'epica'
    }
  };

  function key(suffix) {
    return global.LipaBrainProfiles && LipaBrainProfiles.storageKey
      ? LipaBrainProfiles.storageKey(suffix)
      : suffix;
  }

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function readJson(k, fallback) {
    try {
      var raw = localStorage.getItem(k);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return fallback;
  }

  function writeJson(k, value) {
    try {
      localStorage.setItem(k, JSON.stringify(value));
    } catch (e) { /* ignore */ }
  }

  function getState() {
    var st = readJson(key('lipa_cards_v1'), null);
    if (!st || typeof st !== 'object') st = {};
    if (!st.owned) st.owned = {};      /* cardId -> cantidad */
    if (!st.packs) st.packs = [];      /* sobres sin abrir */
    if (!st.grants) st.grants = {};    /* sourceKey -> fecha */
    if (!st.opened) st.opened = 0;
    return st;
  }

  function saveState(st) {
    writeJson(key('lipa_cards_v1'), st);
  }

  function uniqueOwned(st) {
    st = st || getState();
    return Object.keys(st.owned).filter(function (id) { return st.owned[id] > 0; }).length;
  }

  function totalCards() {
    return CARDS.length;
  }

  function pendingPacks(st) {
    st = st || getState();
    return st.packs.slice();
  }

  /** Concede un sobre. sourceKey único evita duplicar la misma recompensa. */
  function grantPack(type, sourceKey) {
    var st = getState();
    if (sourceKey && st.grants[sourceKey]) return null;
    var pack = {
      id: 'pk-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
      type: PACK_TYPES[type] ? type : 'normal',
      source: sourceKey || null,
      at: new Date().toISOString()
    };
    st.packs.push(pack);
    if (sourceKey) st.grants[sourceKey] = today();
    saveState(st);
    try {
      global.dispatchEvent(new CustomEvent('lipa-cards-changed'));
    } catch (e) { /* ignore */ }
    return pack;
  }

  /** Sobre diario por completar el entreno (una vez al día). */
  function grantDailyPack() {
    return grantPack('normal', 'daily-' + today());
  }

  /** Sobres extra por hitos de racha (una vez por hito). */
  function grantStreakPacks(streak) {
    var granted = [];
    [3, 7, 14, 30].forEach(function (m) {
      if (streak >= m) {
        var p = grantPack('normal', 'streak-' + m);
        if (p) granted.push(m);
      }
    });
    return granted;
  }

  /** Sobre de bienvenida al visitar el álbum por primera vez. */
  function grantWelcomePack() {
    return grantPack('normal', 'welcome');
  }

  function rollRarity(odds) {
    var r = Math.random();
    var acc = 0;
    var order = ['legendaria', 'epica', 'rara', 'comun'];
    for (var i = 0; i < order.length; i++) {
      acc += odds[order[i]] || 0;
      if (r < acc) return order[i];
    }
    return 'comun';
  }

  function pickCardOfRarity(rarity, st) {
    var pool = CARDS.filter(function (c) { return c.rarity === rarity; });
    if (!pool.length) pool = CARDS;
    /* Favorecer cartas que aún no tienes (sin garantizarlo) */
    var missing = pool.filter(function (c) { return !(st.owned[c.id] > 0); });
    var from = missing.length && Math.random() < 0.7 ? missing : pool;
    return from[Math.floor(Math.random() * from.length)];
  }

  var RARITY_ORDER = { comun: 1, rara: 2, epica: 3, legendaria: 4 };

  /** Abre un sobre pendiente y devuelve las cartas obtenidas. */
  function openPack(packId) {
    var st = getState();
    var idx = st.packs.findIndex(function (p) { return p.id === packId; });
    if (idx < 0) return null;
    var pack = st.packs[idx];
    var def = PACK_TYPES[pack.type] || PACK_TYPES.normal;

    var results = [];
    var bestOrder = 0;
    for (var i = 0; i < def.cards; i++) {
      var rarity = rollRarity(def.odds);
      if (RARITY_ORDER[rarity] > bestOrder) bestOrder = RARITY_ORDER[rarity];
      results.push(rarity);
    }
    /* Pity: garantiza al menos una carta del mínimo del sobre */
    if (def.pity && bestOrder < RARITY_ORDER[def.pity]) {
      results[def.cards - 1] = def.pity;
    }

    var cards = results.map(function (rarity) {
      var card = pickCardOfRarity(rarity, st);
      var wasNew = !(st.owned[card.id] > 0);
      st.owned[card.id] = (st.owned[card.id] || 0) + 1;
      return { card: card, isNew: wasNew, count: st.owned[card.id] };
    });

    /* Ordenar revelación: mejor carta al final para el hype */
    cards.sort(function (a, b) {
      return RARITY_ORDER[a.card.rarity] - RARITY_ORDER[b.card.rarity];
    });

    st.packs.splice(idx, 1);
    st.opened += 1;
    saveState(st);
    try {
      global.dispatchEvent(new CustomEvent('lipa-cards-changed'));
    } catch (e) { /* ignore */ }
    return { pack: pack, packDef: def, cards: cards };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  /** Nodo DOM de una carta (para álbum y apertura). */
  function cardNode(card, opts) {
    opts = opts || {};
    var owned = opts.owned == null ? true : !!opts.owned;
    var el = document.createElement('div');
    el.className = 'neon-card neon-card--' + card.rarity + (owned ? '' : ' neon-card--locked');
    el.setAttribute('data-card-id', card.id);
    var num = String(card.n).padStart(2, '0');
    if (owned) {
      el.innerHTML =
        '<span class="neon-card__shine" aria-hidden="true"></span>' +
        '<span class="neon-card__num">#' + num + '</span>' +
        '<span class="neon-card__rarity">' + RARITIES[card.rarity].emoji + ' ' + RARITIES[card.rarity].name + '</span>' +
        '<span class="neon-card__emoji" aria-hidden="true">' + card.emoji + '</span>' +
        '<span class="neon-card__name">' + esc(card.name) + '</span>' +
        '<span class="neon-card__desc">' + esc(card.desc) + '</span>' +
        (opts.count > 1 ? '<span class="neon-card__count">x' + opts.count + '</span>' : '') +
        (opts.isNew ? '<span class="neon-card__new">¡NUEVA!</span>' : '');
    } else {
      el.innerHTML =
        '<span class="neon-card__num">#' + num + '</span>' +
        '<span class="neon-card__emoji neon-card__emoji--mystery" aria-hidden="true">❓</span>' +
        '<span class="neon-card__name neon-card__name--mystery">¿ ? ?</span>' +
        '<span class="neon-card__desc">' + RARITIES[card.rarity].emoji + ' Carta ' + RARITIES[card.rarity].name.toLowerCase() + ' por descubrir</span>';
    }
    return el;
  }

  /** Teaser en la home: progreso + sobres pendientes. */
  function mountHomeTeaser(el) {
    if (!el) return;
    var st = getState();
    var got = uniqueOwned(st);
    var total = totalCards();
    var packs = st.packs.length;
    var pct = Math.round((got / total) * 100);

    if (!packs && got === 0) {
      el.innerHTML = '';
      return;
    }

    el.innerHTML =
      '<div class="cards-teaser">' +
      '<div class="cards-teaser__fan" aria-hidden="true">' +
      '<span class="cards-teaser__mini cards-teaser__mini--1">🐲</span>' +
      '<span class="cards-teaser__mini cards-teaser__mini--2">🦄</span>' +
      '<span class="cards-teaser__mini cards-teaser__mini--3">🌈</span>' +
      '</div>' +
      '<div class="cards-teaser__info">' +
      '<p class="cards-teaser__title">Colección de Cartas Neon</p>' +
      '<p class="cards-teaser__sub">' + got + ' de ' + total + ' cartas · ' + pct + '% del álbum</p>' +
      '<div class="cards-teaser__bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
      '</div>' +
      '<a href="/coleccion.html" class="lipa-btn lipa-btn--primary cards-teaser__cta">' +
      (packs > 0
        ? '🎁 Abrir ' + (packs === 1 ? 'tu sobre' : packs + ' sobres')
        : 'Ver mi álbum') +
      '</a>' +
      (packs > 0 ? '<span class="cards-teaser__badge" aria-hidden="true">' + packs + '</span>' : '') +
      '</div>';
  }

  global.LipaCards = {
    CARDS: CARDS,
    CARDS_BY_ID: CARDS_BY_ID,
    RARITIES: RARITIES,
    PACK_TYPES: PACK_TYPES,
    getState: getState,
    uniqueOwned: uniqueOwned,
    totalCards: totalCards,
    pendingPacks: pendingPacks,
    grantPack: grantPack,
    grantDailyPack: grantDailyPack,
    grantStreakPacks: grantStreakPacks,
    grantWelcomePack: grantWelcomePack,
    openPack: openPack,
    cardNode: cardNode,
    mountHomeTeaser: mountHomeTeaser
  };

  document.addEventListener('DOMContentLoaded', function () {
    var teaser = document.getElementById('lipa-cards-teaser');
    if (teaser) mountHomeTeaser(teaser);
  });
  global.addEventListener('lipa-cards-changed', function () {
    var teaser = document.getElementById('lipa-cards-teaser');
    if (teaser) mountHomeTeaser(teaser);
  });
  global.addEventListener('lipa-profile-changed', function () {
    var teaser = document.getElementById('lipa-cards-teaser');
    if (teaser) mountHomeTeaser(teaser);
  });
})(typeof window !== 'undefined' ? window : global);
