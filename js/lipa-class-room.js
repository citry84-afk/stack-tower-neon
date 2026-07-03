/**
 * Sala de clase — código de 4 letras, racha grupal en el dispositivo (hermanos/tablet compartida).
 * Enlace viral: lipastudios.com/?sala=ABCD
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'lipa_class_room_v1';
  var CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  function weekKey() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    var day = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - day);
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var w = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return d.getFullYear() + '-W' + w;
  }

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      global.dispatchEvent(new CustomEvent('lipa-class-changed'));
    } catch (e) { /* ignore */ }
  }

  function normalizeCode(code) {
    return String(code || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4);
  }

  function generateCode() {
    var code = '';
    for (var i = 0; i < 4; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
  }

  function getRoom() {
    var r = read();
    if (!r || !r.code) return null;
    if (r.weekKey !== weekKey()) {
      r.weekKey = weekKey();
      r.weekTrainings = 0;
      save(r);
    }
    return r;
  }

  function createRoom(label) {
    var room = {
      code: generateCode(),
      label: label || 'Mi clase',
      joinedAt: today(),
      weekKey: weekKey(),
      weekTrainings: 0,
      totalTrainings: 0,
      streakDays: []
    };
    save(room);
    return room;
  }

  function joinRoom(code, label) {
    code = normalizeCode(code);
    if (code.length < 4) return null;
    var existing = read();
    var room = {
      code: code,
      label: label || existing && existing.label || 'Clase ' + code,
      joinedAt: existing && existing.code === code ? existing.joinedAt : today(),
      weekKey: weekKey(),
      weekTrainings: existing && existing.code === code ? existing.weekTrainings || 0 : 0,
      totalTrainings: existing && existing.code === code ? existing.totalTrainings || 0 : 0,
      streakDays: existing && existing.code === code ? existing.streakDays || [] : []
    };
    save(room);
    return room;
  }

  function leaveRoom() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      global.dispatchEvent(new CustomEvent('lipa-class-changed'));
    } catch (e) { /* ignore */ }
  }

  /** Llamar al completar entreno diario. */
  function recordTraining() {
    var room = getRoom();
    if (!room) return;
    var day = today();
    if (room.weekKey !== weekKey()) {
      room.weekKey = weekKey();
      room.weekTrainings = 0;
    }
    room.weekTrainings = (room.weekTrainings || 0) + 1;
    room.totalTrainings = (room.totalTrainings || 0) + 1;
    if (!room.streakDays) room.streakDays = [];
    if (room.streakDays.indexOf(day) < 0) room.streakDays.push(day);
    if (room.streakDays.length > 14) room.streakDays = room.streakDays.slice(-14);
    save(room);
  }

  function shareUrl(code) {
    var origin = global.location.origin || 'https://lipastudios.com';
    return origin + '/?sala=' + encodeURIComponent(code);
  }

  function shareWhatsApp(room) {
    var text =
      '🏫 *Únete a nuestra sala LIPA Brain Gym*\n' +
      'Código: *' + room.code + '*\n' +
      'Entrenad 7 min al día y sumad puntos en clase.\n' +
      shareUrl(room.code);
    global.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }

  function joinFromUrl() {
    try {
      var p = new URLSearchParams(global.location.search);
      var sala = p.get('sala');
      if (!sala) return null;
      var room = joinRoom(sala);
      if (room && global.history && global.history.replaceState) {
        global.history.replaceState({}, '', global.location.pathname);
      }
      return room;
    } catch (e) {
      return null;
    }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function mount(root) {
    if (!root) return;
    var room = getRoom();

    function paint() {
      room = getRoom();
      if (!room) {
        root.innerHTML =
          '<div class="class-room">' +
          '<p class="brain-eyebrow" style="margin:0;color:#7c3aed;">🏫 Sala de clase</p>' +
          '<p style="margin:0.35rem 0 0.5rem;font-weight:800;font-size:1.05rem;">Compite con tu clase (misma tablet o invita con código)</p>' +
          '<div class="class-room__join">' +
          '<input type="text" class="class-room__input" id="class-join-input" maxlength="4" placeholder="ABCD" aria-label="Código de sala">' +
          '<button type="button" class="class-room__btn class-room__btn--primary" id="class-join-btn">Unirme</button>' +
          '</div>' +
          '<p class="class-room__hint">¿Sois la primera? <button type="button" class="class-room__btn class-room__btn--ghost" id="class-create-btn" style="margin-top:0.5rem;">Crear sala nueva</button></p>' +
          '</div>';

        root.querySelector('#class-join-btn').addEventListener('click', function () {
          var code = root.querySelector('#class-join-input').value;
          if (joinRoom(code)) paint();
        });
        root.querySelector('#class-create-btn').addEventListener('click', function () {
          createRoom('Mi clase');
          paint();
          if (global.LipaGameFeedback && LipaGameFeedback.confettiLite) {
            try { LipaGameFeedback.confettiLite(); } catch (e) { /* ignore */ }
          }
        });
        return;
      }

      var weekDays = (room.streakDays || []).length;
      root.innerHTML =
        '<div class="class-room">' +
        '<p class="brain-eyebrow" style="margin:0;color:#7c3aed;">🏫 Sala · ' + esc(room.label) + '</p>' +
        '<p class="class-room__code" aria-label="Código de sala">' + esc(room.code) + '</p>' +
        '<div class="class-room__stats">' +
        '<div class="class-room__stat"><strong>' + (room.weekTrainings || 0) + '</strong>entrenos esta semana</div>' +
        '<div class="class-room__stat"><strong>' + (room.totalTrainings || 0) + '</strong>total en sala</div>' +
        '<div class="class-room__stat"><strong>' + weekDays + '</strong>días activos (14d)</div>' +
        '</div>' +
        '<p class="class-room__hint">Cada entreno suma en esta tablet. Invita a tu clase con el código — ideal para hermanos o el aula con varios perfiles.</p>' +
        '<div class="class-room__actions">' +
        '<button type="button" class="class-room__btn class-room__btn--primary" id="class-share-wa">📲 Invitar por WhatsApp</button>' +
        '<button type="button" class="class-room__btn class-room__btn--ghost" id="class-copy-link">Copiar enlace</button>' +
        '<button type="button" class="class-room__btn class-room__btn--ghost" id="class-leave">Salir de sala</button>' +
        '</div></div>';

      root.querySelector('#class-share-wa').addEventListener('click', function () {
        shareWhatsApp(room);
      });
      root.querySelector('#class-copy-link').addEventListener('click', function () {
        var url = shareUrl(room.code);
        if (global.navigator.clipboard && global.navigator.clipboard.writeText) {
          global.navigator.clipboard.writeText(url).then(function () {
            root.querySelector('#class-copy-link').textContent = '¡Copiado!';
            setTimeout(function () {
              var b = root.querySelector('#class-copy-link');
              if (b) b.textContent = 'Copiar enlace';
            }, 2000);
          });
        } else {
          global.prompt('Comparte este enlace:', url);
        }
      });
      root.querySelector('#class-leave').addEventListener('click', function () {
        if (global.confirm('¿Salir de la sala ' + room.code + '?')) {
          leaveRoom();
          paint();
        }
      });
    }

    paint();
    global.addEventListener('lipa-class-changed', paint);
  }

  global.LipaClassRoom = {
    getRoom: getRoom,
    createRoom: createRoom,
    joinRoom: joinRoom,
    leaveRoom: leaveRoom,
    recordTraining: recordTraining,
    joinFromUrl: joinFromUrl,
    shareUrl: shareUrl,
    mount: mount
  };

  document.addEventListener('DOMContentLoaded', function () {
    joinFromUrl();
    var el = document.getElementById('lipa-class-room-mount');
    if (el) mount(el);
  });
})(typeof window !== 'undefined' ? window : global);
