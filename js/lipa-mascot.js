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
      '¡Lo tienes! Tu cerebro sube de nivel.',
      '¡Bien pensado! Ese es el camino.',
      '¡Correcto! Cada acierto suma XP.'
    ],
    wrong: [
      'Casi lo tienes. Prueba otra vez.',
      'Fíjate en la pista. Vamos juntos.',
      'No pasa nada. Inténtalo otra vez.',
      'Los errores también enseñan. ¡Otra vez!',
      'Respira, lee bien y toca otra vez.'
    ],
    complete: [
      '¡Entrenamiento completado! Hoy has entrenado como un campeón.',
      '¡Tu cerebro acaba de hacer ejercicio! Muy bien.',
      '¡Misión cumplida! Vuelve mañana para tu racha.',
      '¡Lo has logrado! El cole puede esperar — tú ya entrenaste.',
      '¡Gran sesión! Mañana sumas otro día a tu racha.'
    ],
    routine: [
      'Tu rutina de hoy está lista. ¿Empezamos?',
      'Un ejercicio tras otro. ¡Tú puedes!',
      'Solo unos minutos. Tu yo del futuro te lo agradece.',
      'Elige empezar: Lipi te lleva paso a paso.'
    ]
  };

  var KID_QUIPS = {
    welcome: [
      '¡Modo aventura! Misión de hoy: un ratito de mates.',
      '¿Listo para un speedrun de 7 min? (sin prisa de verdad).',
      'Tu cerebro pide un power-up. ¿Empezamos?',
      'Patrulla de refuerzo en marcha. Lipi al mando.',
      'Hoy toca craftear conocimiento cubito a cubito. ¡Vamos!',
      '¡Entrenamiento estilo estadio! Tú eres la estrella.'
    ],
    correct: [
      '¡GOL! De aciertos, no de fútbol… bueno, también vale.',
      '¡+1 vida! Sigue el combo.',
      '¡Six-seven de estilo! (6 de actitud, 7 de crack).',
      '¡Más rápido que un erizo con chanclas nuevas!',
      '¡Combo perfecto! Tu familia aplaude en la grada.',
      '¡Power-up desbloqueado! Siguiente pregunta.'
    ],
    wrong: [
      'Game over… mentira. Reintento gratis.',
      'El bloque no encajó. Prueba otra pieza.',
      'Casi. Hasta los cracks fallan el primer salto.',
      'Pause menu: respira y otra vez.'
    ],
    complete: [
      '¡Misión cleared! Bonus: orgullo.',
      '¡Nivel superado! Progreso guardado.',
      '¡Fan meeting con el éxito! Autógrafos después.',
      '¡Victory royale del estudio! (sin eliminaciones).'
    ],
    routine: [
      'Playlist del día: mates, lengua y a bailar datos.',
      'Boss de la semana: la racha. Tú puedes.'
    ]
  };

  var FLAIR_STICKERS = ['🍄', '⚽', '🧱', '🐾', '🎤', '⭐', '💨', '🎮', '🏆'];

  Object.keys(KID_QUIPS).forEach(function (key) {
    if (MESSAGES[key]) MESSAGES[key] = MESSAGES[key].concat(KID_QUIPS[key]);
  });

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
    if (Math.random() < 0.38) root.classList.add('lipi-mascot--fun');
    root.setAttribute('role', 'status');
    var avatar = lipiAvatarNode();
    if (Math.random() < 0.42) {
      var sticker = document.createElement('span');
      sticker.className = 'lipi-mascot__sticker';
      sticker.setAttribute('aria-hidden', 'true');
      sticker.textContent = pick(FLAIR_STICKERS);
      avatar.appendChild(sticker);
    }
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
    MESSAGES: MESSAGES,
    homeTips: [
      '¿Fan del modo creativo? Aquí crafteas mates sin picos.',
      'Mundial del saber: hoy juegas tú de titular.',
      '¿K-pop de tablas? 1, 2, 3… ¡a multiplicar!',
      'Los cachorros de la patrulla ya entrenaron. ¿Y tú?',
      'Speedrun permitido: 7 min y pausa para helado.'
    ]
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
    body.classList.add('lipa-kid-vibes');
    var mount = document.getElementById('lipi-mascot-mount');
    if (mount && !mount.innerHTML.trim() && !global.LipaHomeLipi) {
      render(mount, 'welcome');
    }
  });
})(typeof window !== 'undefined' ? window : global);
