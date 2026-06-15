/**
 * Feedback visual amable en minijuegos (acierto, error, XP, confeti)
 */
(function (global) {
  'use strict';

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function floatXp(amount) {
    if (prefersReducedMotion()) return;
    var el = document.createElement('div');
    el.className = 'brain-xp-float';
    el.textContent = '+' + (amount || 5) + ' XP';
    el.style.left = '50%';
    el.style.top = '42%';
    el.style.transform = 'translateX(-50%)';
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 700);
  }

  function shake(el) {
    if (!el || prefersReducedMotion()) return;
    el.classList.remove('brain-feedback--shake');
    void el.offsetWidth;
    el.classList.add('brain-feedback--shake');
  }

  function pop(el) {
    if (!el || prefersReducedMotion()) return;
    el.classList.add('brain-feedback--pop');
    setTimeout(function () {
      el.classList.remove('brain-feedback--pop');
    }, 500);
  }

  function confettiLite() {
    if (prefersReducedMotion()) return;
    var div = document.createElement('div');
    div.className = 'brain-confetti-lite';
    var icons = ['⭐', '✨', '🎉', '💫', '🌟'];
    for (var j = 0; j < 18; j++) {
      var sp = document.createElement('span');
      sp.textContent = icons[j % icons.length];
      sp.style.left = Math.random() * 100 + '%';
      sp.style.animationDelay = Math.random() * 0.4 + 's';
      div.appendChild(sp);
    }
    document.body.appendChild(div);
    setTimeout(function () {
      if (div.parentNode) div.parentNode.removeChild(div);
    }, 1400);
  }

  function onCorrect(workEl, xp) {
    pop(resolveArena(workEl));
    floatXp(xp || 8);
    if (global.LipaBrainPlay && LipaBrainPlay.chimeCorrect) {
      try { LipaBrainPlay.chimeCorrect(); } catch (e) { /* ignore */ }
    }
    var m = document.getElementById('lipi-game-hint');
    if (m && global.LipaMascot) {
      var msg = null;
      if (global.__lipaCombo && global.__lipaCombo >= 3) {
        msg = global.__lipaCombo >= 5
          ? '¡Combo x' + global.__lipaCombo + '! Vas como un experto.'
          : '¡Racha de ' + global.__lipaCombo + '! Sigue así.';
      }
      LipaMascot.render(m, 'correct', msg);
    }
  }

  function resolveArena(el) {
    if (el) return el;
    return document.querySelector(
      '.math-arena, .lengua-arena, .naturales-arena, .sociales-arena, .peques-arena, #calc-work, #lengua-work, #peques-work, .game-work'
    );
  }

  function onWrong(workEl) {
    shake(resolveArena(workEl));
    if (global.LipaBrainPlay && LipaBrainPlay.chimeWrong) {
      try { LipaBrainPlay.chimeWrong(); } catch (e) { /* ignore */ }
    }
    var m = document.getElementById('lipi-game-hint');
    if (m && global.LipaMascot) LipaMascot.render(m, 'wrong');
  }

  function onActivityComplete(xp) {
    confettiLite();
    if (xp) floatXp(xp);
    if (global.LipaBrainPlay && LipaBrainPlay.chimePowerUp) {
      try { LipaBrainPlay.chimePowerUp(); } catch (e) { /* ignore */ }
    }
    if (global.LipaMascot) LipaMascot.say('complete');
  }

  function setCombo(n) {
    global.__lipaCombo = typeof n === 'number' ? n : 0;
  }

  global.LipaGameFeedback = {
    floatXp: floatXp,
    shake: shake,
    pop: pop,
    confettiLite: confettiLite,
    resolveArena: resolveArena,
    onCorrect: onCorrect,
    onWrong: onWrong,
    onActivityComplete: onActivityComplete,
    setCombo: setCombo
  };
})(typeof window !== 'undefined' ? window : global);
