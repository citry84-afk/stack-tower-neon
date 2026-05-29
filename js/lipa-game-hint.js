/**
 * Monta el hint de Lipi en páginas de juego Brain Gym
 */
(function (global) {
  'use strict';

  var DEFAULT_HINT = 'Lee la consigna con calma. Si fallas, prueba otra vez — ¡tú puedes!';

  function isBrainGamePage() {
    var body = document.body;
    return body.classList.contains('game-page--brain') ||
      (body.classList.contains('game-page') && body.classList.contains('lipa-brain-soft'));
  }

  function ensureMount() {
    if (!isBrainGamePage()) return null;
    var existing = document.getElementById('lipi-game-hint');
    if (existing) return existing;

    var main = document.querySelector('main.wrap, main.lipa-main, main');
    if (!main) return null;

    var mount = document.createElement('div');
    mount.id = 'lipi-game-hint';
    mount.className = 'lipi-game-hint-wrap';

    var lead = main.querySelector('.lead, .game-lead');
    var h1 = main.querySelector('h1');
    if (lead && lead.parentNode) {
      lead.parentNode.insertBefore(mount, lead.nextSibling);
    } else if (h1 && h1.parentNode) {
      h1.parentNode.insertBefore(mount, h1.nextSibling);
    } else {
      main.insertBefore(mount, main.firstChild);
    }
    return mount;
  }

  function hintFromCurriculum() {
    if (!global.LipaCurriculum || !global.location) return null;
    try {
      var p = new URLSearchParams(global.location.search);
      if (p.get('curriculum') !== '1' || !p.get('activity')) return null;
      LipaCurriculum.init();
      var actCtx = LipaCurriculum.getActivity(
        p.get('course') || '',
        p.get('subject') || '',
        p.get('unit') || '',
        p.get('activity') || ''
      );
      if (!actCtx) return null;
      var tip = actCtx.activity.tip || '';
      var title = actCtx.activity.title || 'Misión';
      var min = LipaCurriculum.getMinAccuracy(p.get('course') || '');
      var sec = (global.LipaBrainPlay && LipaBrainPlay.roundDurationSec)
        ? LipaBrainPlay.roundDurationSec()
        : 30;
      return (
        'Misión «' + title + '». ' +
        (tip ? tip + '. ' : '') +
        'Ronda de ' + sec + ' s · meta ' + Math.round(min * 100) + '% aciertos.'
      );
    } catch (e) {
      return null;
    }
  }

  function hintFromPage() {
    var cur = hintFromCurriculum();
    if (cur) return cur;
    var body = document.body;
    var mode = body.getAttribute('data-lengua-mode') ||
      body.getAttribute('data-naturales-mode') ||
      body.getAttribute('data-sociales-mode') ||
      body.getAttribute('data-peques-mode');
    if (mode === 'silabas') return 'Ordena las sílabas para formar la palabra.';
    if (mode === 'completa') return 'Elige la sílaba que falta.';
    if (mode === 'lectura') return 'Lee el texto y responde con calma.';
    if (mode === 'frase') return 'Toca las palabras en el orden correcto.';
    if (mode === 'color') return 'Mira el dibujo y elige el color.';
    if (mode === 'cuenta') return 'Cuenta los iconos y elige el número.';
    if (mode === 'clasifica') return '¿Es animal, planta u otra cosa?';
    if (mode === 'verdad') return '¿Verdadero o falso? Piensa antes de tocar.';
    if (mode === 'mapa') return 'Ubica el lugar en el mapa.';
    if (mode === 'ordena') return 'Ordena las frases en el tiempo correcto.';
    if (document.body.getAttribute('data-ordenar-mode') === 'numeros') {
      return 'Toca los números de menor a mayor.';
    }
    if (document.body.getAttribute('data-mayor-activity')) {
      return 'Lee si pide mayor o menor y elige el número correcto.';
    }
    if (document.body.getAttribute('data-clasifica-mode') === 'figuras') {
      return 'Mira el dibujo y elige el grupo (círculo, cuadrado…).';
    }
    if (document.body.getAttribute('data-clasifica-mode') === 'vivir') {
      return '¿Es un ser vivo o un objeto?';
    }
    if (document.body.getAttribute('data-clasifica-mode') === 'emociones') {
      return '¿Carita feliz o triste?';
    }
    if (document.body.getAttribute('data-ordenar-mode') === 'palabras') {
      return 'Ordena las palabras para formar la frase.';
    }
    if (location.pathname.indexOf('neon-calculo') >= 0) {
      return 'Resuelve antes de que acabe el tiempo. ¡Cada acierto suma combo!';
    }
    if (location.pathname.indexOf('tablas-relampago') >= 0) {
      return 'Multiplica rápido. Si dudas, repasa la tabla en voz alta.';
    }
    if (location.pathname.indexOf('neon-palabras') >= 0) {
      return 'Une la palabra en español con su traducción en inglés.';
    }
    if (location.pathname.indexOf('test-reflejos') >= 0) {
      return 'Espera al verde. Si pulsas antes, no cuenta.';
    }
    if (location.pathname.indexOf('toque-flash') >= 0 || location.pathname.indexOf('flash') >= 0) {
      return 'Toca cada círculo antes de que desaparezca. ¡Mira el centro de la pantalla!';
    }
    if (location.pathname.indexOf('elige') >= 0 || document.body.getAttribute('data-peques-mode') === 'elige') {
      return 'Lee la pregunta y elige la imagen correcta.';
    }
    return DEFAULT_HINT;
  }

  function mount() {
    var el = ensureMount();
    if (!el || !global.LipaMascot) return;
    LipaMascot.render(el, 'routine', hintFromPage());
  }

  document.addEventListener('DOMContentLoaded', mount);
  global.LipaGameHint = { mount: mount, ensureMount: ensureMount };
})(typeof window !== 'undefined' ? window : global);
