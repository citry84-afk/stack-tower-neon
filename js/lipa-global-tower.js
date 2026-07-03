/**
 * Torre Neon Global — bloques comunitarios (estimación del día) + tus bloques.
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'lipa_global_tower_v1';

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { myBlocks: 0, myToday: 0, lastDay: null };
  }

  function save(st) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
      global.dispatchEvent(new CustomEvent('lipa-tower-changed'));
    } catch (e) { /* ignore */ }
  }

  /** Estimación comunitaria determinista (misma para todos hoy). */
  function communityBlocksToday() {
    var d = new Date();
    var dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    var hour = d.getHours();
    var base = 4200 + (dayOfYear * 137) % 3800;
    var hourBoost = hour * 41 + (d.getDay() === 6 ? 800 : 0);
    return base + hourBoost;
  }

  function addBlocks(count) {
    var n = Math.max(1, Math.min(8, count || 1));
    var st = read();
    var day = today();
    if (st.lastDay !== day) {
      st.myToday = 0;
      st.lastDay = day;
    }
    st.myBlocks = (st.myBlocks || 0) + n;
    st.myToday = (st.myToday || 0) + n;
    save(st);
    return st;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function renderGrid(mine, community, maxShow) {
    maxShow = maxShow || 120;
    var html = '';
    var mineShow = Math.min(mine, maxShow);
    var commShow = Math.min(Math.max(0, maxShow - mineShow), 80);
    for (var i = 0; i < mineShow; i++) {
      html += '<span class="global-tower__block global-tower__block--mine" aria-hidden="true"></span>';
    }
    for (var j = 0; j < commShow; j++) {
      html += '<span class="global-tower__block global-tower__block--community" aria-hidden="true"></span>';
    }
    return html;
  }

  function mount(root) {
    if (!root) return;
    var st = read();
    var community = communityBlocksToday();
    var mine = st.myBlocks || 0;
    var todayMine = st.myToday || 0;

    root.innerHTML =
      '<div class="global-tower">' +
      '<div class="global-tower__head">' +
      '<h3>🗼 Torre Neon Global</h3>' +
      '<p class="global-tower__stats">Comunidad hoy: <strong>' + community.toLocaleString('es-ES') + '</strong> bloques</p>' +
      '</div>' +
      '<div class="global-tower__grid" role="img" aria-label="Torre de bloques">' +
      renderGrid(todayMine || Math.min(mine, 20), community) +
      '</div>' +
      '<p class="global-tower__foot">' +
      (todayMine
        ? 'Tú sumaste <strong>' + todayMine + '</strong> bloque' + (todayMine === 1 ? '' : 's') + ' hoy. '
        : 'Completa tu entreno para añadir bloques verdes a la torre. ') +
      'Cada acierto en LIPA construye el Neonverso.</p>' +
      '</div>';

    global.addEventListener('lipa-tower-changed', function () {
      mount(root);
    });
  }

  global.LipaGlobalTower = {
    addBlocks: addBlocks,
    communityBlocksToday: communityBlocksToday,
    mount: mount,
    getState: read
  };

  document.addEventListener('DOMContentLoaded', function () {
    mount(document.getElementById('lipa-global-tower-mount'));
  });
})(typeof window !== 'undefined' ? window : global);
