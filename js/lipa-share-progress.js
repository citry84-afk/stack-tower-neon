/**
 * Compartir progreso — imagen + WhatsApp para padres.
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function gatherStats(opts) {
    opts = opts || {};
    var stats = global.LipaBrain ? LipaBrain.getStats() : {};
    var profile = global.LipaBrain ? LipaBrain.getProfile() : null;
    var summary = null;
    try {
      var raw = sessionStorage.getItem('lipa-routine-summary');
      if (raw) summary = JSON.parse(raw);
    } catch (e) { /* ignore */ }

    var name = opts.name || (profile && profile.displayName ? profile.displayName.split(' ')[0] : 'Mi peque');
    var streak = opts.streak != null ? opts.streak : (summary && summary.streak) || stats.streak || 0;
    var xp = opts.xp != null ? opts.xp : (summary && summary.xp) || stats.xp || 0;
    var rank = stats.rank || {};
    var rankLabel = (rank.emoji || '⭐') + ' ' + (rank.name || (summary && summary.rankName) || 'Aprendiz');
    var practiced = (summary && summary.practiced) || opts.practiced || 'Brain Gym';
    var course = (summary && summary.courseLabel) || opts.course || '';

    return {
      name: name,
      streak: streak,
      xp: xp,
      rankLabel: rankLabel,
      practiced: practiced,
      course: course,
      date: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
    };
  }

  function drawCard(canvas, data) {
    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, '#1a1035');
    grd.addColorStop(0.45, '#2d1b69');
    grd.addColorStop(1, '#0d4f4a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(46, 211, 166, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.fillStyle = '#2ed3a6';
    ctx.font = 'bold 22px Nunito, system-ui, sans-serif';
    ctx.fillText('LIPA Brain Gym', 36, 56);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Nunito, system-ui, sans-serif';
    ctx.fillText(data.name + ' entrena hoy', 36, 110);

    ctx.fillStyle = '#b8c4e8';
    ctx.font = '16px Nunito, system-ui, sans-serif';
    ctx.fillText(data.date, 36, 142);

    if (data.course) {
      ctx.fillStyle = '#ffd166';
      ctx.font = '600 18px Nunito, system-ui, sans-serif';
      ctx.fillText('📚 ' + data.course, 36, 178);
    }

    var boxY = 200;
    var boxes = [
      { label: 'Racha', value: data.streak + ' días', emoji: '🔥' },
      { label: 'XP total', value: String(data.xp), emoji: '⚡' },
      { label: 'Rango', value: data.rankLabel.replace(/^[^\s]+ /, ''), emoji: '🏆' }
    ];

    boxes.forEach(function (b, i) {
      var bx = 36 + (i % 2) * 260;
      var by = boxY + Math.floor(i / 2) * 90;
      if (i === 2) bx = 36;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(bx, by, i === 2 ? w - 72 : 220, 72, 14);
      } else {
        ctx.rect(bx, by, i === 2 ? w - 72 : 220, 72);
      }
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Nunito, system-ui, sans-serif';
      ctx.fillText(b.emoji + ' ' + b.value, bx + 16, by + 44);
      ctx.fillStyle = '#9fb0d8';
      ctx.font = '13px Nunito, system-ui, sans-serif';
      ctx.fillText(b.label, bx + 16, by + 62);
    });

    ctx.fillStyle = '#e7ecff';
    ctx.font = '600 17px Nunito, system-ui, sans-serif';
    var practLine = 'Hoy: ' + data.practiced;
    wrapText(ctx, practLine, 36, 400, w - 72, 24);

    ctx.fillStyle = '#2ed3a6';
    ctx.font = 'bold 20px Nunito, system-ui, sans-serif';
    ctx.fillText('lipastudios.com', 36, h - 48);

    ctx.font = '48px serif';
    ctx.fillText('🧠', w - 80, h - 40);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
      var test = line + words[n] + ' ';
      if (ctx.measureText(test).width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
  }

  function createCanvas(data) {
    var canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 480;
    drawCard(canvas, data);
    return canvas;
  }

  function canvasToBlob(canvas) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) { resolve(blob); }, 'image/png');
    });
  }

  function whatsAppText(data) {
    return (
      '🧠 *LIPA Brain Gym* — informe de ' + data.name + '\n' +
      '🔥 Racha: ' + data.streak + ' días\n' +
      '⚡ XP: ' + data.xp + '\n' +
      '📚 ' + (data.practiced || 'Entreno completado') + '\n' +
      '👉 https://lipastudios.com/para-padres.html'
    );
  }

  function shareWhatsApp(data) {
    var url = 'https://wa.me/?text=' + encodeURIComponent(whatsAppText(data));
    global.open(url, '_blank', 'noopener');
  }

  async function downloadImage(canvas, filename) {
    var blob = await canvasToBlob(canvas);
    if (!blob) return;
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'lipa-progreso.png';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }

  async function nativeShare(canvas, data) {
    var blob = await canvasToBlob(canvas);
    if (!blob || !global.navigator.share) return false;
    try {
      var file = new File([blob], 'lipa-progreso.png', { type: 'image/png' });
      await global.navigator.share({
        title: 'Progreso LIPA Brain Gym',
        text: whatsAppText(data),
        files: [file]
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function mountShareZone(container, opts) {
    if (!container) return;
    opts = opts || {};
    var data = gatherStats(opts);

    container.innerHTML =
      '<div class="lipa-share-zone">' +
      '<p class="lipa-share-zone__title">📲 Compartir con la familia</p>' +
      '<p class="lipa-share-zone__sub">Envía el progreso de hoy por WhatsApp o guarda una imagen.</p>' +
      '<div class="lipa-share-btns">' +
      '<button type="button" class="lipa-share-btn lipa-share-btn--wa" id="lipa-share-wa">WhatsApp</button>' +
      '<button type="button" class="lipa-share-btn lipa-share-btn--img" id="lipa-share-img">Descargar imagen</button>' +
      (global.navigator && global.navigator.share
        ? '<button type="button" class="lipa-share-btn lipa-share-btn--img" id="lipa-share-native">Compartir…</button>'
        : '') +
      '</div>' +
      '<canvas class="lipa-share-preview" id="lipa-share-preview" width="600" height="480" aria-hidden="true"></canvas>' +
      '</div>';

    var canvas = container.querySelector('#lipa-share-preview');
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      drawCard(canvas, data);
    }

    var wa = container.querySelector('#lipa-share-wa');
    var img = container.querySelector('#lipa-share-img');
    var nat = container.querySelector('#lipa-share-native');

    if (wa) wa.addEventListener('click', function () { shareWhatsApp(data); });
    if (img) img.addEventListener('click', function () { downloadImage(canvas || createCanvas(data)); });
    if (nat) {
      nat.addEventListener('click', async function () {
        var ok = await nativeShare(canvas || createCanvas(data), data);
        if (!ok) shareWhatsApp(data);
      });
    }
  }

  global.LipaShareProgress = {
    gatherStats: gatherStats,
    drawCard: drawCard,
    createCanvas: createCanvas,
    shareWhatsApp: shareWhatsApp,
    mountShareZone: mountShareZone
  };
})(typeof window !== 'undefined' ? window : global);
