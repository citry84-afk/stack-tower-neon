/**
 * Lipi — mascota Brain Gym (mensajes amables, sin castigo)
 */
(function (global) {
  'use strict';

  var MESSAGES = {
    welcome: [
      '¡Hola! Soy Lipi. ¿Entrenamos un ratito?',
      '¡Buen día! Tu cerebro está listo para aprender.',
      'Vamos paso a paso. Tú puedes.'
    ],
    correct: [
      '¡Muy bien!',
      '¡Genial! Sigue así.',
      '¡Lo tienes! Tu cerebro sube de nivel.'
    ],
    wrong: [
      'Casi lo tienes. Prueba otra vez.',
      'Fíjate en la pista. Vamos juntos.',
      'No pasa nada. Inténtalo otra vez.'
    ],
    complete: [
      '¡Entrenamiento completado! Hoy has entrenado como un campeón.',
      '¡Tu cerebro acaba de hacer ejercicio! Muy bien.',
      '¡Misión cumplida! Vuelve mañana para tu racha.'
    ],
    routine: [
      'Tu rutina de hoy está lista. ¿Empezamos?',
      'Un ejercicio tras otro. ¡Tú puedes!'
    ]
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function lipiAvatarNode() {
    var avatar = document.createElement('div');
    avatar.className = 'lipi-mascot__avatar';
    avatar.setAttribute('aria-hidden', 'true');
    var img = document.createElement('img');
    img.src = '/assets/lipi.svg';
    img.alt = '';
    img.width = 48;
    img.height = 48;
    img.decoding = 'async';
    img.onerror = function () {
      avatar.textContent = '🧠';
      if (img.parentNode) img.parentNode.removeChild(img);
    };
    avatar.appendChild(img);
    return avatar;
  }

  function render(target, type, customText) {
    if (!target) return;
    var text = customText || pick(MESSAGES[type] || MESSAGES.welcome);
    var root = document.createElement('div');
    root.className = 'lipi-mascot';
    root.setAttribute('role', 'status');
    var avatar = lipiAvatarNode();
    var bubble = document.createElement('div');
    bubble.className = 'lipi-mascot__bubble';
    bubble.innerHTML = '<strong>Lipi</strong>' + esc(text);
    root.appendChild(avatar);
    root.appendChild(bubble);
    target.innerHTML = '';
    target.appendChild(root);
  }

  function say(type, customText) {
    var el = document.getElementById('lipi-mascot-mount');
    if (el) render(el, type, customText);
  }

  global.LipaMascot = {
    say: say,
    render: render,
    pick: pick,
    MESSAGES: MESSAGES
  };

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;
    if (
      body.classList.contains('curriculum-page') ||
      body.classList.contains('game-page--brain') ||
      body.classList.contains('lipa-brain-soft') ||
      body.getAttribute('data-brain-onboard-auto') != null
    ) {
      body.classList.add('lipa-brain-soft');
    }
    var mount = document.getElementById('lipi-mascot-mount');
    if (mount && !mount.innerHTML.trim() && !global.LipaHomeLipi) {
      render(mount, 'welcome');
    }
  });
})(typeof window !== 'undefined' ? window : global);
