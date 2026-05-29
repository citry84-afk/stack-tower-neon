/**
 * Ajustes de partida Brain Gym: duración por curso, sonidos suaves, copy de misión.
 */
(function (global) {
  'use strict';

  var audioCtx = null;
  var soundEnabled = null;

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
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  function tone(freq, durationMs, volume) {
    var ctx = getAudioCtx();
    if (!ctx) return;
    try {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = volume || 0.08;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) { /* ignore */ }
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

  function chimeCorrect() {
    tone(523, 90, 0.07);
    setTimeout(function () { tone(659, 110, 0.06); }, 70);
  }

  function chimeWrong() {
    tone(220, 140, 0.05);
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

  global.LipaBrainPlay = {
    roundDurationSec: roundDurationSec,
    syncRoundDuration: syncRoundDuration,
    missionCardLine: missionCardLine,
    chimeCorrect: chimeCorrect,
    chimeWrong: chimeWrong,
    setSoundEnabled: setSoundEnabled,
    soundPreference: soundPreference
  };
})(typeof window !== 'undefined' ? window : global);
