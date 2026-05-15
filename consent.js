(function(){
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };

  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  const CHOICE_KEY = 'lipa_consent_v3';
  const ADSENSE_CLIENT = 'ca-pub-4837743291717475';
  const saved = (function(){ try { return JSON.parse(localStorage.getItem(CHOICE_KEY)||'null'); } catch(e){ return null; } })();

  function fillAdSlots() {
    try {
      var slots = document.querySelectorAll('ins.adsbygoogle');
      for (var i = 0; i < slots.length; i++) {
        if (slots[i].getAttribute('data-adsbygoogle-status')) continue;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) { /* ignore */ }
  }

  function loadAdSense() {
    if (document.querySelector('script[src*="adsbygoogle"]')) {
      fillAdSlots();
      return;
    }
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT + '&crossorigin=anonymous';
    document.head.appendChild(s);
    s.onload = function () { fillAdSlots(); };
  }

  function apply(status){
    var granted = status === 'granted';
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });
    if (granted) loadAdSense();
  }

  function store(status){ try { localStorage.setItem(CHOICE_KEY, JSON.stringify({ status, ts: Date.now() })); } catch(e){} }

  if (saved && saved.status) {
    apply(saved.status);
    return;
  }

  var bar = document.createElement('div');
  bar.id = 'lipa-cookie-banner';
  bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:100000;background:linear-gradient(135deg,rgba(5,5,20,.98) 0%,rgba(26,10,26,.98) 100%);border-top:2px solid #00ffff;box-shadow:0 -4px 30px rgba(0,255,255,.2);color:#e8f6ff;padding:16px 20px;font-family:Orbitron,system-ui,sans-serif;';
  bar.innerHTML = '<div style="max-width:900px;margin:0 auto;">' +
    '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;">' +
    '<div style="flex:1;min-width:260px;">' +
    '<p style="margin:0 0 8px;font-size:0.95rem;color:#00ffff;font-weight:700;">🍪 Cookies y privacidad</p>' +
    '<p style="margin:0;font-size:0.85rem;line-height:1.5;opacity:.95;">Usamos cookies propias y de Google (Analytics, AdSense) para mejorar tu experiencia. Puedes aceptar todas, solo las esenciales o ver más información.</p>' +
    '<a href="/privacy.html" style="color:#39FF14;font-size:0.8rem;margin-top:6px;display:inline-block;">Más información en Política de Privacidad</a>' +
    '</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">' +
    '<button id="lipa-accept" style="background:linear-gradient(135deg,#00ffff,#00cccc);color:#000;padding:10px 18px;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 0 15px rgba(0,255,255,.4);transition:all .3s;">✓ Aceptar todas</button>' +
    '<button id="lipa-reject" style="background:rgba(80,80,80,.8);color:#e8f6ff;padding:10px 18px;border:1px solid #555;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .3s;">Solo esenciales</button>' +
    '<a href="/privacy.html#cookies" id="lipa-more" style="background:transparent;color:#00ffee;padding:10px 18px;border:1px solid #00ffff;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;text-decoration:none;font-size:0.9rem;">Más información</a>' +
    '</div>' +
    '</div></div>';

  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(bar);
    bar.querySelector('#lipa-accept').addEventListener('click', function(){ choose('granted'); });
    bar.querySelector('#lipa-reject').addEventListener('click', function(){ choose('denied'); });
  });

  function choose(status){
    apply(status);
    store(status);
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
  }

  document.addEventListener('DOMContentLoaded', function(){
    try {
      var mini = document.createElement('div');
      mini.className = 'site-mini-footer';
      mini.style.cssText = 'position:fixed;bottom:6px;right:8px;background:rgba(0,0,0,.6);border:1px solid #00ffff;border-radius:8px;padding:6px 10px;font:12px/1.2 system-ui,sans-serif;z-index:9999';
      mini.innerHTML = '<span style="color:#00ffff">Contacto:</span> <a href="mailto:lipastudios4@gmail.com" style="color:#ffff00;text-decoration:none">lipastudios4@gmail.com</a>';
      if (!document.querySelector('.site-mini-footer')) document.body.appendChild(mini);
    } catch(e) {}
  });
})();
