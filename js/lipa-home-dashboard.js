/**
 * Panel home Brain Gym — racha, XP, nivel (estilo PDF Soft Playful)
 */
(function (global) {
  'use strict';

  function dashItem(value, label) {
    var el = document.createElement('div');
    el.className = 'brain-home-dash__item';
    var strong = document.createElement('strong');
    strong.textContent = value;
    var span = document.createElement('span');
    span.textContent = label;
    el.appendChild(strong);
    el.appendChild(span);
    return el;
  }

  function mountContinue() {
    var continueEl = document.getElementById('brain-home-continue');
    if (!continueEl || !global.LipaBrain) return;

    var profile = LipaBrain.getProfile();
    if (!profile || !profile.courseId || !global.LipaCurriculum) {
      continueEl.hidden = true;
      return;
    }

    var target = LipaCurriculum.getContinueTarget(profile.courseId);
    if (!target) {
      continueEl.hidden = true;
      return;
    }

    var label = document.createElement('p');
    label.className = 'brain-home-continue__label';
    label.textContent = target.type === 'activity' ? 'Seguir donde lo dejaste' : 'Tu curso';

    var link = document.createElement('a');
    link.className = 'lipa-btn lipa-btn--primary';
    link.href = target.href;
    link.textContent = target.label;

    continueEl.innerHTML = '';
    continueEl.appendChild(label);
    continueEl.appendChild(link);
    if (target.sublabel) {
      var sub = document.createElement('p');
      sub.className = 'brain-home-continue__sub';
      sub.textContent = target.sublabel;
      continueEl.appendChild(sub);
    }
    continueEl.hidden = false;
  }

  function mount() {
    var root = document.getElementById('brain-home-dash');
    if (!root || !global.LipaBrain) return;

    var stats = LipaBrain.getStats();
    var profile = LipaBrain.getProfile();
    var streak = stats.streak || 0;
    var xp = stats.xp || 0;
    var rank = stats.rank || {};
    var name = (profile && profile.displayName) ? profile.displayName.split(' ')[0] : 'Explorador';

    var greet = document.getElementById('brain-home-greet');
    if (greet) {
      var h = new Date().getHours();
      var saludo = h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
      greet.textContent = saludo + ', ' + name + ' 👋';
    }

    var dash = document.createElement('div');
    dash.className = 'brain-home-dash';
    dash.appendChild(dashItem(String(streak), 'días de racha'));
    dash.appendChild(dashItem(String(xp), 'XP total'));
    dash.appendChild(dashItem((rank.emoji || '⭐') + ' ' + (rank.name || 'Novato'), 'nivel cerebral'));
    root.innerHTML = '';
    root.appendChild(dash);

    mountContinue();
  }

  document.addEventListener('DOMContentLoaded', mount);
  global.addEventListener('lipa-profile-changed', mount);
  global.LipaHomeDashboard = { mount: mount };
})(typeof window !== 'undefined' ? window : global);
