/**
 * Brain Gym — FX retro (Web Audio, sin samples de terceros).
 * Inspiración arcade 8-bit; sonidos generados en el dispositivo.
 */
(function (global) {
  'use strict';

  if (global.LipaBrainPlay) return;

  var audioCtx = null;
  var soundEnabled = null;
  var uiWired = false;
  var lastTapAt = 0;

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function soundPreference() {
    if (soundEnabled != null) return soundEnabled;
    try {
      var v = localStorage.getItem('lipa_sound_fx');
      soundEnabled = v !== '0';
    } catch (e) {
      soundEnabled = true;
    }
    return soundEnabled;
  }

  function getAudioCtx() {
    if (prefersReducedMotion() || !soundPreference()) return null;
    try {
      if (!audioCtx) {
        var Ctx = global.AudioContext || global.webkitAudioContext;
        if (!Ctx) return null;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function unlockAudio() {
    getAudioCtx();
  }

  /**
   * @param {number} freq Hz
   * @param {number} durationMs
   * @param {{ type?: string, volume?: number, delay?: number, freqEnd?: number }} opts
   */
  function playChip(freq, durationMs, opts) {
    opts = opts || {};
    var ctx = getAudioCtx();
    if (!ctx) return;

    var delay = opts.delay || 0;
    var t0 = ctx.currentTime + delay / 1000;
    var dur = Math.max(0.02, durationMs / 1000);
    var vol = opts.volume != null ? opts.volume : 0.085;

    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = opts.type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      if (opts.freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freqEnd), t0 + dur);
      }
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(vol, t0 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    } catch (e) { /* ignore */ }
  }

  function playSequence(notes) {
    notes.forEach(function (n) {
      playChip(n.freq, n.dur, {
        type: n.type || 'square',
        volume: n.vol != null ? n.vol : 0.08,
        delay: n.delay || 0,
        freqEnd: n.freqEnd
      });
    });
  }

  function chimeTap() {
    var now = Date.now();
    if (now - lastTapAt < 55) return;
    lastTapAt = now;
    playChip(523, 42, { type: 'square', volume: 0.045 });
  }

  /** Moneda / acierto */
  function chimeCorrect() {
    playSequence([
      { freq: 988, dur: 70, vol: 0.07, delay: 0 },
      { freq: 1319, dur: 70, vol: 0.065, delay: 65 },
      { freq: 1568, dur: 95, vol: 0.06, delay: 125 }
    ]);
  }

  /** Golpe suave / fallo */
  function chimeWrong() {
    playSequence([
      { freq: 185, dur: 120, vol: 0.07, type: 'square', delay: 0, freqEnd: 120 },
      { freq: 98, dur: 160, vol: 0.055, type: 'triangle', delay: 90 }
    ]);
  }

  /** Empezar misión / power-up */
  function chimeStart() {
    playSequence([
      { freq: 392, dur: 55, vol: 0.055, delay: 0 },
      { freq: 523, dur: 55, vol: 0.06, delay: 48 },
      { freq: 659, dur: 55, vol: 0.06, delay: 96 },
      { freq: 784, dur: 90, vol: 0.065, delay: 144 }
    ]);
  }

  /** Misión completada / nivel */
  function chimePowerUp() {
    playSequence([
      { freq: 523, dur: 60, vol: 0.06, delay: 0 },
      { freq: 659, dur: 60, vol: 0.06, delay: 55 },
      { freq: 784, dur: 60, vol: 0.06, delay: 110 },
      { freq: 1047, dur: 60, vol: 0.06, delay: 165 },
      { freq: 1319, dur: 140, vol: 0.07, delay: 220 }
    ]);
  }

  function courseIdFromContext() {
    try {
      var p = new URLSearchParams(global.location.search);
      if (p.get('course')) return p.get('course');
    } catch (e) { /* ignore */ }
    if (global.LipaBrain && LipaBrain.getProfile) {
      var prof = LipaBrain.getProfile();
      if (prof && prof.courseId) return prof.courseId;
    }
    return '';
  }

  function roundDurationSec() {
    var id = courseIdFromContext();
    if (id.indexOf('infantil-') === 0) return 20;
    if (id.indexOf('eso-') === 0) return 35;
    return 30;
  }

  function missionCardLine(act) {
    if (!act || !act.tip) return '';
    var t = String(act.tip).trim();
    if (t.length > 90) t = t.slice(0, 87) + '…';
    return t;
  }

  function setSoundEnabled(on) {
    soundEnabled = !!on;
    try {
      localStorage.setItem('lipa_sound_fx', on ? '1' : '0');
    } catch (e) { /* ignore */ }
  }

  function syncRoundDuration() {
    return roundDurationSec();
  }

  var TAP_SELECTOR =
    'button:not(:disabled), .lipa-btn, .lipa-course-pick, .brain-onboard__btn, ' +
    '.brain-onboard__opt, .brain-onboard__subject-chip, .brain-onboard__subject-preset, ' +
    '.math-choice:not(:disabled), .lengua-choice:not(:disabled), .lengua-chip:not(:disabled), ' +
    '.peques-choice:not(:disabled), .naturales-choice:not(:disabled), .sociales-choice:not(:disabled), ' +
    '.sociales-chip:not(:disabled), .dictado-choice:not(:disabled), .arrastra-chip, ' +
    '.clasifica-bin, .empareja-left, .empareja-right, .mayor-choice, [data-sfx-tap]';

  function shouldSkipTap(target) {
    if (!target) return true;
    if (target.closest('[data-no-sfx], input, textarea, select, label')) return true;
    if (target.closest('a[href]') && !target.closest('.lipa-btn, .lipa-course-pick')) return true;
    return false;
  }

  function wireUiTaps() {
    if (uiWired) return;
    uiWired = true;

    global.addEventListener(
      'pointerdown',
      function (e) {
        if (e.button !== 0) return;
        if (shouldSkipTap(e.target)) return;
        var el = e.target.closest(TAP_SELECTOR);
        if (!el) return;
        unlockAudio();
        chimeTap();
      },
      { passive: true }
    );

    global.addEventListener(
      'keydown',
      function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var el = e.target.closest(TAP_SELECTOR);
        if (!el || shouldSkipTap(e.target)) return;
        unlockAudio();
        chimeTap();
      },
      true
    );
  }

  function wireStartButtons() {
    global.addEventListener('click', function (e) {
      var start = e.target.closest(
        '[id$="-start"], #calc-start, #tablas-start, #lengua-start, #peques-start, ' +
        '#flash-start, #rt-start, [data-sfx-start]'
      );
      if (!start || start.disabled) return;
      unlockAudio();
      chimeStart();
    });
  }

  global.LipaBrainPlay = {
    roundDurationSec: roundDurationSec,
    syncRoundDuration: syncRoundDuration,
    missionCardLine: missionCardLine,
    chimeTap: chimeTap,
    chimeCorrect: chimeCorrect,
    chimeWrong: chimeWrong,
    chimeStart: chimeStart,
    chimePowerUp: chimePowerUp,
    setSoundEnabled: setSoundEnabled,
    soundPreference: soundPreference,
    unlockAudio: unlockAudio
  };

  wireUiTaps();
  wireStartButtons();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', unlockAudio);
  }
})(typeof window !== 'undefined' ? window : global);
