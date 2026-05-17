/**
 * Registro PWA — preparado para instalación web / Capacitor
 */
(function () {
  'use strict';

  var SW_PURGE_KEY = 'lipa_sw_brain_v2_purged';

  function purgeLegacyCaches() {
    if (localStorage.getItem(SW_PURGE_KEY) === '1') return Promise.resolve();
    localStorage.setItem(SW_PURGE_KEY, '1');
    return Promise.all([
      'caches' in window
        ? caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) { return caches.delete(k); }));
          })
        : Promise.resolve(),
      'serviceWorker' in navigator
        ? navigator.serviceWorker.getRegistrations().then(function (regs) {
            return Promise.all(regs.map(function (r) { return r.unregister(); }));
          })
        : Promise.resolve()
    ]);
  }

  function activateWaiting(reg) {
    if (reg && reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  if (!('serviceWorker' in navigator)) return;

  purgeLegacyCaches().finally(function () {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/sw.js?v=2.0.0')
        .then(function (reg) {
          reg.update();
          activateWaiting(reg);
          reg.addEventListener('updatefound', function () {
            var installing = reg.installing;
            if (!installing) return;
            installing.addEventListener('statechange', function () {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                activateWaiting(reg);
              }
            });
          });
        })
        .catch(function () { /* offline ok */ });
    });
  });

  var deferredPrompt;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    document.querySelectorAll('[data-pwa-install]').forEach(function (btn) {
      btn.hidden = false;
    });
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pwa-install]');
    if (!btn || !deferredPrompt) return;
    e.preventDefault();
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      btn.hidden = true;
    });
  });

  window.LipaPwa = {
    canInstall: function () { return !!deferredPrompt; }
  };
})();
