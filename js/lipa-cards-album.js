/**
 * Álbum de Cartas Neon — grid por rareza + ceremonia de apertura de sobres.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ——— Render del álbum ——— */

  function renderProgress() {
    var el = document.getElementById('album-progress');
    if (!el) return;
    var got = LipaCards.uniqueOwned();
    var total = LipaCards.totalCards();
    var pct = Math.round((got / total) * 100);
    el.innerHTML =
      '<div class="album-progress__bar"><span style="width:' + pct + '%"></span></div>' +
      '<p class="album-progress__label">' + got + ' / ' + total + ' cartas · ' + pct + '% completado</p>';
  }

  function renderPacks() {
    var el = document.getElementById('album-packs');
    if (!el) return;
    var packs = LipaCards.pendingPacks();
    if (!packs.length) {
      el.innerHTML = '';
      var hint = document.getElementById('album-packs-hint');
      if (hint) hint.hidden = false;
      return;
    }
    var hintEl = document.getElementById('album-packs-hint');
    if (hintEl) hintEl.hidden = true;
    el.innerHTML = packs
      .map(function (p) {
        var def = LipaCards.PACK_TYPES[p.type] || LipaCards.PACK_TYPES.normal;
        return (
          '<button type="button" class="album-pack-btn' +
          (p.type === 'epico' ? ' album-pack-btn--epico' : '') +
          '" data-pack-id="' + esc(p.id) + '">' +
          def.emoji + ' Abrir ' + esc(def.name) +
          '</button>'
        );
      })
      .join('');
  }

  function renderGrid() {
    var root = document.getElementById('album-grid-root');
    if (!root) return;
    var st = LipaCards.getState();
    root.innerHTML = '';

    var order = ['legendaria', 'epica', 'rara', 'comun'];
    order.forEach(function (rarity) {
      var info = LipaCards.RARITIES[rarity];
      var cards = LipaCards.CARDS.filter(function (c) { return c.rarity === rarity; });
      var ownedCount = cards.filter(function (c) { return st.owned[c.id] > 0; }).length;

      var title = document.createElement('h2');
      title.className = 'album-section-title';
      title.textContent = info.emoji + ' ' + info.name + 's · ' + ownedCount + '/' + cards.length;
      root.appendChild(title);

      var grid = document.createElement('div');
      grid.className = 'album-grid';
      cards.forEach(function (c) {
        var owned = st.owned[c.id] > 0;
        grid.appendChild(LipaCards.cardNode(c, { owned: owned, count: st.owned[c.id] || 0 }));
      });
      root.appendChild(grid);
    });
  }

  function renderAll() {
    renderProgress();
    renderPacks();
    renderGrid();
  }

  /* ——— Ceremonia de apertura ——— */

  function sfx(name) {
    if (global.LipaBrainPlay && LipaBrainPlay[name]) {
      try { LipaBrainPlay[name](); } catch (e) { /* ignore */ }
    }
  }

  function legendaryFanfare() {
    if (!global.LipaBrainPlay || !LipaBrainPlay.chimePowerUp) return;
    try {
      LipaBrainPlay.chimePowerUp();
      setTimeout(function () { LipaBrainPlay.chimeCorrect(); }, 320);
    } catch (e) { /* ignore */ }
  }

  function burstAt(container, cx, cy) {
    if (prefersReducedMotion()) return;
    var icons = ['✨', '⭐', '💫', '🌟', '🎉'];
    for (var i = 0; i < 10; i++) {
      var sp = document.createElement('span');
      sp.className = 'pack-ceremony__burst';
      sp.textContent = icons[i % icons.length];
      sp.style.left = cx + 'px';
      sp.style.top = cy + 'px';
      var ang = (Math.PI * 2 * i) / 10;
      sp.style.setProperty('--bx', Math.round(Math.cos(ang) * (70 + Math.random() * 60)) + 'px');
      sp.style.setProperty('--by', Math.round(Math.sin(ang) * (70 + Math.random() * 60)) + 'px');
      container.appendChild(sp);
      setTimeout(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      }, 950, sp);
    }
  }

  function startCeremony(packId) {
    if (global.LipaPackCeremony) {
      LipaPackCeremony.start(packId, { onDone: renderAll });
      return;
    }
    /* fallback legacy — no debería ejecutarse */
  }

  /* ——— Init ——— */

  document.addEventListener('DOMContentLoaded', function () {
    if (!global.LipaCards) return;

    /* Regalo de bienvenida: primer sobre gratis al descubrir el álbum */
    LipaCards.grantWelcomePack();

    /* Hitos de racha pendientes de canjear */
    if (global.LipaBrain && LipaBrain.getStats) {
      var stats = LipaBrain.getStats();
      LipaCards.grantStreakPacks(stats.streak || 0);
    }

    renderAll();

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-pack-id]');
      if (!btn) return;
      startCeremony(btn.getAttribute('data-pack-id'));
    });

    global.addEventListener('lipa-profile-changed', renderAll);
  });
})(typeof window !== 'undefined' ? window : global);
