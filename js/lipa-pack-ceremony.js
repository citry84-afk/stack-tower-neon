/**
 * Ceremonia épica de apertura de sobres — compartida (álbum + entreno completo).
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function sfx(name) {
    if (global.LipaBrainPlay && LipaBrainPlay[name]) {
      try { LipaBrainPlay[name](); } catch (e) { /* ignore */ }
    }
  }

  function vibrate(ms) {
    if (global.navigator && global.navigator.vibrate) {
      try { global.navigator.vibrate(ms); } catch (e) { /* ignore */ }
    }
  }

  function legendaryFanfare() {
    if (!global.LipaBrainPlay || !LipaBrainPlay.chimePowerUp) return;
    try {
      LipaBrainPlay.chimePowerUp();
      setTimeout(function () { LipaBrainPlay.chimeCorrect(); }, 320);
    } catch (e) { /* ignore */ }
  }

  function burstAt(container, cx, cy, big) {
    if (prefersReducedMotion()) return;
    var icons = ['✨', '⭐', '💫', '🌟', '🎉', '💎', '🃏'];
    var n = big ? 18 : 10;
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('span');
      sp.className = 'pack-ceremony__burst';
      sp.textContent = icons[i % icons.length];
      sp.style.left = cx + 'px';
      sp.style.top = cy + 'px';
      var ang = (Math.PI * 2 * i) / n;
      var dist = big ? 90 + Math.random() * 80 : 70 + Math.random() * 60;
      sp.style.setProperty('--bx', Math.round(Math.cos(ang) * dist) + 'px');
      sp.style.setProperty('--by', Math.round(Math.sin(ang) * dist) + 'px');
      container.appendChild(sp);
      setTimeout(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 950, sp);
    }
  }

  function closeOverlay(overlay, onDone) {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    document.body.style.overflow = '';
    if (onDone) onDone();
  }

  function revealCards(overlay, result, onDone) {
    var hasLegendary = result.cards.some(function (r) { return r.card.rarity === 'legendaria'; });
    if (hasLegendary) overlay.classList.add('pack-ceremony--legendary-bg');

    overlay.classList.add('pack-ceremony--flash');
    sfx('chimeStart');
    vibrate([20, 40, 20]);

    overlay.innerHTML =
      '<p class="pack-ceremony__title">¡Toca cada carta para girarla!</p>' +
      '<div class="pack-ceremony__cards" id="ceremony-cards"></div>' +
      '<button type="button" class="lipa-btn lipa-btn--primary pack-ceremony__done" id="ceremony-done" hidden>Continuar</button>';

    var zone = overlay.querySelector('#ceremony-cards');
    var doneBtn = overlay.querySelector('#ceremony-done');
    var flipped = 0;
    var total = result.cards.length;

    result.cards.forEach(function (r, i) {
      var wrap = document.createElement('div');
      wrap.className = 'ceremony-card';
      if (r.card.rarity === 'legendaria') wrap.classList.add('ceremony-card--legendary-reveal');

      var back = document.createElement('div');
      back.className = 'ceremony-card__back';
      back.innerHTML = '<span aria-hidden="true">🧠</span>LIPA';

      var front = document.createElement('div');
      front.className = 'ceremony-card__front';
      front.appendChild(global.LipaCards.cardNode(r.card, { owned: true, count: r.count, isNew: r.isNew }));

      wrap.appendChild(back);
      wrap.appendChild(front);
      zone.appendChild(wrap);

      wrap.addEventListener('click', function onFlip() {
        if (wrap.classList.contains('is-flipped')) return;
        wrap.classList.add('is-flipped');
        flipped++;
        vibrate(15);
        if (r.card.rarity === 'legendaria') {
          legendaryFanfare();
          var rect = wrap.getBoundingClientRect();
          burstAt(overlay, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
          if (global.LipaGameFeedback && LipaGameFeedback.confettiLite) {
            try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
          }
        } else if (r.card.rarity === 'epica') {
          sfx('chimePowerUp');
        } else {
          sfx('chimeCorrect');
        }
        if (flipped >= total) {
          doneBtn.hidden = false;
          var news = result.cards.filter(function (c) { return c.isNew; }).length;
          if (global.LipaMascot) {
            var msg = news > 0
              ? '¡' + news + (news === 1 ? ' carta nueva' : ' cartas nuevas') + ' para tu álbum!'
              : 'Cartas repetidas… ¡la próxima seguro que cae una épica!';
            var t = document.createElement('p');
            t.className = 'pack-ceremony__hint';
            t.textContent = 'Lipi: ' + msg;
            overlay.insertBefore(t, doneBtn);
          }
        }
      });

      if (prefersReducedMotion()) {
        setTimeout(function () { wrap.click(); }, 150 * (i + 1));
      }
    });

    doneBtn.addEventListener('click', function () {
      closeOverlay(overlay, onDone);
    });
  }

  function start(packId, opts) {
    opts = opts || {};
    if (!global.LipaCards) return false;

    var result = LipaCards.openPack(packId);
    if (!result) return false;

    var overlay = document.createElement('div');
    overlay.className = 'pack-ceremony';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Apertura de sobre');
    overlay.innerHTML =
      '<p class="pack-ceremony__title">' + result.packDef.emoji + ' ' + esc(result.packDef.name) + '</p>' +
      '<button type="button" class="pack-ceremony__pack" id="ceremony-pack" aria-label="Tocar para abrir el sobre">🎁</button>' +
      '<p class="pack-ceremony__hint">Toca el sobre 3 veces para abrirlo</p>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    var taps = 0;
    var packBtn = overlay.querySelector('#ceremony-pack');
    packBtn.addEventListener('click', function () {
      taps++;
      sfx('chimeTap');
      vibrate(20);
      packBtn.classList.remove('pack-ceremony__pack--shaking');
      void packBtn.offsetWidth;
      packBtn.classList.add('pack-ceremony__pack--shaking');
      var rect = packBtn.getBoundingClientRect();
      burstAt(overlay, rect.left + rect.width / 2, rect.top + rect.height / 2, taps >= 2);

      if (taps >= 3 || prefersReducedMotion()) {
        packBtn.classList.add('pack-ceremony__pack--explode');
        setTimeout(function () {
          revealCards(overlay, result, opts.onDone);
        }, prefersReducedMotion() ? 0 : 450);
      } else {
        overlay.querySelector('.pack-ceremony__hint').textContent =
          taps === 1 ? '¡Otra vez! Se está rompiendo…' : '¡Un toque más!';
      }
    });

    return true;
  }

  function startNextPending(opts) {
    if (!global.LipaCards) return false;
    var packs = LipaCards.pendingPacks();
    if (!packs.length) return false;
    return start(packs[0].id, opts);
  }

  global.LipaPackCeremony = {
    start: start,
    startNextPending: startNextPending
  };
})(typeof window !== 'undefined' ? window : global);
