/**
 * Jefe del día — batalla final de 5 preguntas tras el entreno.
 */
(function (global) {
  'use strict';

  var HP_PER_HIT = 20;
  var QUESTIONS_NEEDED = 5;

  var WEEKLY_BOSSES = [
    {
      id: 'dragon-calculo',
      name: 'Dragón del Cálculo',
      emoji: '🐲',
      taunt: '¡Solo los que dominan las tablas me vencen!',
      questions: [
        { q: '6 × 7 = ?', choices: ['42', '48', '36', '49'], a: 0 },
        { q: '144 ÷ 12 = ?', choices: ['11', '12', '14', '10'], a: 1 },
        { q: '8 × 9 = ?', choices: ['72', '81', '64', '63'], a: 0 },
        { q: '15 + 27 = ?', choices: ['41', '42', '43', '44'], a: 1 },
        { q: '100 − 37 = ?', choices: ['53', '63', '73', '67'], a: 1 },
        { q: '5 × 12 = ?', choices: ['50', '60', '55', '65'], a: 1 }
      ]
    },
    {
      id: 'fenix-ortografia',
      name: 'Fénix de la Ortografía',
      emoji: '🦅',
      taunt: '¿Sabes escribir sin trampas?',
      questions: [
        { q: '¿Cuál está bien escrita?', choices: ['vaca', 'baca', 'vaka', 'baka'], a: 0 },
        { q: 'Elige la palabra con tilde correcta:', choices: ['camion', 'camión', 'camíon', 'camioón'], a: 1 },
        { q: '¿Cuál lleva H?', choices: ['aora', 'ahora', 'agora', 'aora'], a: 1 },
        { q: 'Completa: cien…', choices: ['to', 'do', 'po', 'mo'], a: 0 },
        { q: '¿Cuál es correcta?', choices: ['jirafa', 'girafa', 'jarifa', 'girafa'], a: 0 },
        { q: 'Elige la forma correcta:', choices: ['también', 'tanbien', 'tambien', 'tanvien'], a: 0 }
      ]
    },
    {
      id: 'mister-verb',
      name: 'Mister Verb',
      emoji: '🕵️',
      taunt: 'Your English must be perfect!',
      questions: [
        { q: 'I ___ to school every day.', choices: ['go', 'goes', 'going', 'went'], a: 0 },
        { q: 'She ___ a book now.', choices: ['read', 'reads', 'is reading', 'reading'], a: 2 },
        { q: 'We ___ pizza yesterday.', choices: ['eat', 'eats', 'ate', 'eating'], a: 2 },
        { q: 'They ___ football on Sundays.', choices: ['play', 'plays', 'playing', 'played'], a: 0 },
        { q: 'He ___ not like broccoli.', choices: ['do', 'does', 'is', 'are'], a: 1 },
        { q: 'The cat is ___ the table.', choices: ['in', 'on', 'at', 'under'], a: 1 }
      ]
    },
    {
      id: 'doctora-celula',
      name: 'Doctora Célula',
      emoji: '🔬',
      taunt: '¡La naturaleza no perdona!',
      questions: [
        { q: '¿Qué necesitan las plantas para hacer fotosíntesis?', choices: ['Luz solar', 'Hielo', 'Sal', 'Petróleo'], a: 0 },
        { q: '¿Cuántos planetas hay en el Sistema Solar?', choices: ['7', '8', '9', '10'], a: 1 },
        { q: 'El agua en estado sólido se llama…', choices: ['Vapor', 'Hielo', 'Lluvia', 'Niebla'], a: 1 },
        { q: '¿Qué animal es un mamífero?', choices: ['Pez', 'Delfín', 'Serpiente', 'Araña'], a: 1 },
        { q: 'La Tierra gira alrededor del…', choices: ['Sol', 'Marte', 'Júpiter', 'Saturno'], a: 0 },
        { q: '¿Qué órgano bombea la sangre?', choices: ['Pulmón', 'Corazón', 'Hígado', 'Riñón'], a: 1 }
      ]
    },
    {
      id: 'atlas-junior',
      name: 'Atlas Junior',
      emoji: '🌍',
      taunt: '¿Conoces tu planeta?',
      questions: [
        { q: '¿Capital de España?', choices: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'], a: 1 },
        { q: '¿En qué continente está Egipto?', choices: ['Europa', 'África', 'Asia', 'América'], a: 1 },
        { q: 'El río más largo de España es el…', choices: ['Tajo', 'Duero', 'Guadalquivir', 'Ebro'], a: 0 },
        { q: '¿Qué océano está al oeste de Europa?', choices: ['Índico', 'Atlántico', 'Ártico', 'Pacífico'], a: 1 },
        { q: '¿Bandera de Francia?', choices: ['🔴🟡🔵', '🔵⚪🔴', '⚫🔴🟡', '🟢⚪🔴'], a: 1 },
        { q: '¿En qué comunidad está Barcelona?', choices: ['Madrid', 'Cataluña', 'Galicia', 'Andalucía'], a: 1 }
      ]
    },
    {
      id: 'ninja-mental',
      name: 'Ninja Mental',
      emoji: '🥷',
      taunt: 'Velocidad y lógica. ¿Estás listo?',
      questions: [
        { q: 'Si 2, 4, 6, 8… ¿siguiente?', choices: ['9', '10', '11', '12'], a: 1 },
        { q: '¿Cuántos lados tiene un hexágono?', choices: ['5', '6', '7', '8'], a: 1 },
        { q: 'La mitad de 50 es…', choices: ['20', '25', '30', '15'], a: 1 },
        { q: '3 × 3 × 3 = ?', choices: ['9', '18', '27', '33'], a: 2 },
        { q: '¿Qué número es par?', choices: ['13', '17', '22', '31'], a: 2 },
        { q: 'Un cuarto de 100 es…', choices: ['20', '25', '30', '40'], a: 1 }
      ]
    },
    {
      id: 'unicornio-neon',
      name: 'Unicornio Neon',
      emoji: '🦄',
      taunt: '¡El boss del fin de semana es legendario!',
      questions: [
        { q: '9 × 8 = ?', choices: ['72', '81', '64', '56'], a: 0 },
        { q: '¿Sinónimo de «grande»?', choices: ['Pequeño', 'Enorme', 'Lento', 'Frío'], a: 1 },
        { q: 'How do you say «gato» in English?', choices: ['Dog', 'Cat', 'Bird', 'Fish'], a: 1 },
        { q: '¿Cuántos minutos hay en una hora?', choices: ['30', '45', '60', '100'], a: 2 },
        { q: '¿Planeta más cercano al Sol?', choices: ['Venus', 'Mercurio', 'Marte', 'Tierra'], a: 1 },
        { q: '¿Continente de Brasil?', choices: ['Europa', 'África', 'América', 'Asia'], a: 2 }
      ]
    }
  ];

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function getBoss() {
    var day = new Date().getDay();
    return WEEKLY_BOSSES[day] || WEEKLY_BOSSES[0];
  }

  function pickQuestions(boss) {
    var pool = boss.questions.slice();
    var out = [];
    while (out.length < QUESTIONS_NEEDED && pool.length) {
      var i = Math.floor(Math.random() * pool.length);
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }

  function isPending() {
    try {
      return sessionStorage.getItem('lipa_boss_pending') === '1';
    } catch (e) {
      return false;
    }
  }

  function markDone(won) {
    try {
      localStorage.setItem('lipa_boss_done_' + today(), won ? '1' : 'skip');
      sessionStorage.removeItem('lipa_boss_pending');
    } catch (e) { /* ignore */ }
  }

  function goToComplete() {
    global.location.href = '/entreno-completo.html' + (arguments[0] ? '?boss=1' : '');
  }

  function renderEmpty(root) {
    root.innerHTML =
      '<div class="jefe-empty">' +
      '<p class="jefe-hero__eyebrow">Boss del día</p>' +
      '<h1>El jefe espera al final del entreno</h1>' +
      '<p>Completa tu rutina diaria y Lipi te llevará a la batalla final. 5 aciertos = sobre épico.</p>' +
      '<a href="/" class="lipa-btn lipa-btn--primary lipa-btn--brain" style="margin-top:1rem;display:inline-block;">▶ Empezar entreno</a>' +
      '<p style="margin-top:1rem;font-size:14px;color:#9fb0d8;">¿Ya entrenaste? <a href="/entreno-completo.html">Ver resumen</a></p>' +
      '</div>';
  }

  function renderVictory(root, boss) {
    markDone(true);
    if (global.LipaCards) {
      LipaCards.grantPack('epico', 'boss-' + today());
    }
    if (global.LipaBrain && LipaBrain.addXp) {
      LipaBrain.addXp(35);
    }

    root.innerHTML =
      '<div class="jefe-victory">' +
      '<span class="jefe-victory__emoji" aria-hidden="true">🏆</span>' +
      '<h2>¡' + esc(boss.name) + ' derrotado!</h2>' +
      '<p>Has ganado un <strong>Sobre Épico</strong> con cartas especiales.</p>' +
      '<button type="button" class="lipa-btn lipa-btn--primary lipa-btn--brain" id="jefe-continue">Ver recompensas →</button>' +
      '</div>';

    if (global.LipaGameFeedback && LipaGameFeedback.confettiLite) {
      try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
    }
    if (global.LipaMascot) {
      LipaMascot.say('complete', '¡Victory royale del estudio! Boss derrotado. A abrir el sobre.');
    }

    document.getElementById('jefe-continue').addEventListener('click', function () {
      goToComplete(true);
    });

    setTimeout(function () { goToComplete(true); }, 4000);
  }

  function renderBattle(root) {
    var boss = getBoss();
    var questions = pickQuestions(boss);
    var hp = 100;
    var qIndex = 0;
    var hits = 0;

    function updateUI() {
      var q = questions[qIndex];
      root.innerHTML =
        '<div class="jefe-arena" id="jefe-arena">' +
        '<div class="jefe-boss">' +
        '<span class="jefe-boss__emoji" id="jefe-emoji" aria-hidden="true">' + boss.emoji + '</span>' +
        '<p class="jefe-boss__name">' + esc(boss.name) + '</p>' +
        '<div class="jefe-hp">' +
        '<div class="jefe-hp__label"><span>HP del jefe</span><span id="jefe-hp-text">' + hp + '%</span></div>' +
        '<div class="jefe-hp__track"><div class="jefe-hp__fill" id="jefe-hp-fill" style="width:' + hp + '%"></div></div>' +
        '</div>' +
        '<p class="jefe-hero p" style="font-size:13px;font-style:italic;margin:0;">«' + esc(boss.taunt) + '»</p>' +
        '</div>' +
        '<div class="jefe-question">' +
        '<p class="jefe-question__text">' + esc(q.q) + '</p>' +
        '<div class="jefe-choices" id="jefe-choices">' +
        q.choices.map(function (c, i) {
          return '<button type="button" class="jefe-choice" data-i="' + i + '">' + esc(c) + '</button>';
        }).join('') +
        '</div>' +
        '<p class="jefe-feedback" id="jefe-feedback" aria-live="polite"></p>' +
        '</div>' +
        '<div class="jefe-actions">' +
        '<button type="button" class="jefe-skip" id="jefe-skip">Lipi me salva (saltar boss)</button>' +
        '</div></div>';

      var choices = root.querySelectorAll('.jefe-choice');
      var feedback = root.querySelector('#jefe-feedback');
      var arena = root.querySelector('#jefe-arena');
      var emoji = root.querySelector('#jefe-emoji');

      choices.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          var picked = parseInt(btn.getAttribute('data-i'), 10);
          var correct = picked === q.a;
          choices.forEach(function (b) { b.disabled = true; });

          if (correct) {
            btn.classList.add('jefe-choice--correct');
            hits++;
            hp = Math.max(0, hp - HP_PER_HIT);
            feedback.textContent = '¡Golpe crítico! −' + HP_PER_HIT + ' HP';
            feedback.className = 'jefe-feedback jefe-feedback--ok';
            emoji.classList.add('jefe-boss__emoji--hit');
            if (global.LipaBrainPlay && LipaBrainPlay.chimeCorrect) {
              try { LipaBrainPlay.chimeCorrect(); } catch (e) { /* ignore */ }
            }
            root.querySelector('#jefe-hp-fill').style.width = hp + '%';
            root.querySelector('#jefe-hp-text').textContent = hp + '%';

            setTimeout(function () {
              if (hits >= QUESTIONS_NEEDED || hp <= 0) {
                renderVictory(root, boss);
              } else {
                qIndex++;
                updateUI();
              }
            }, 900);
          } else {
            btn.classList.add('jefe-choice--wrong');
            choices[q.a].classList.add('jefe-choice--correct');
            feedback.textContent = '¡El jefe contraataca! Inténtalo otra vez.';
            feedback.className = 'jefe-feedback jefe-feedback--bad';
            emoji.classList.add('jefe-boss__emoji--attack');
            if (arena) arena.classList.add('jefe-screen-shake');
            if (global.LipaBrainPlay && LipaBrainPlay.chimeWrong) {
              try { LipaBrainPlay.chimeWrong(); } catch (e) { /* ignore */ }
            }
            setTimeout(function () {
              if (arena) arena.classList.remove('jefe-screen-shake');
              choices.forEach(function (b) {
                b.disabled = false;
                b.classList.remove('jefe-choice--wrong', 'jefe-choice--correct');
              });
              feedback.textContent = '';
            }, 1200);
          }
        });
      });

      root.querySelector('#jefe-skip').addEventListener('click', function () {
        markDone(false);
        goToComplete(false);
      });
    }

    updateUI();
  }

  function init() {
    var root = document.getElementById('jefe-app');
    if (!root) return;

    var practice = global.location.search.indexOf('practice=1') >= 0;
    if (!isPending() && !practice) {
      try {
        if (localStorage.getItem('lipa_boss_done_' + today()) === '1') {
          goToComplete(true);
          return;
        }
      } catch (e) { /* ignore */ }
      renderEmpty(root);
      return;
    }

    renderBattle(root);
  }

  document.addEventListener('DOMContentLoaded', init);

  global.LipaDailyBoss = {
    getBoss: getBoss,
    isPending: isPending,
    markDone: markDone
  };
})(typeof window !== 'undefined' ? window : global);
