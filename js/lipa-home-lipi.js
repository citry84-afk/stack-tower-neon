/**
 * Lipi en la home — mensajes rotativos y contexto del perfil
 */
(function (global) {
  'use strict';

  var ROTATE_MS = 9000;
  var timer = null;
  var tipIndex = 0;

  function buildTips() {
    var tips = [
      '¡Hola! Soy Lipi. ¿Hacemos la rutina de hoy?',
      'Un ratito al día entrena tu cerebro como el gym del cuerpo.',
      'Elige tu curso y juega las actividades del cole — ¡sin registro!',
      'Elige materias abajo: inglés, naturales, mates… sin ir a Cursos cada vez.',
      'Si fallas una actividad del curso, repite hasta el 60 % de aciertos.'
    ];

    if (global.LipaBrain) {
      var stats = LipaBrain.getStats();
      var streak = stats.streak || 0;
      var profile = LipaBrain.getProfile();
      if (streak >= 3) {
        tips.push('Llevas ' + streak + ' días de racha. ¡Increíble constancia!');
      }
      if (profile && profile.displayName) {
        var name = profile.displayName.split(' ')[0];
        tips.push('¡' + name + ', tu rutina personal está lista abajo!');
      }
      if (profile && profile.courseId && global.LipaCurriculum) {
        var course = LipaCurriculum.getCourse(profile.courseId);
        if (course) {
          tips.push('Tu curso: ' + course.emoji + ' ' + course.label + '. ¿Seguimos?');
        }
        var cont = LipaCurriculum.getContinueTarget(profile.courseId);
        if (cont && cont.type === 'activity') {
          tips.push('Siguiente reto: «' + cont.label + '». ¡Vamos!');
        }
      }
    }

    return tips;
  }

  function mount() {
    var root = document.getElementById('lipi-mascot-mount');
    if (!root || !global.LipaMascot) return;
    if (!document.body.classList.contains('lipa-brain-soft')) return;

    var tips = buildTips();

    function show() {
      var text = tips[tipIndex % tips.length];
      tipIndex++;
      LipaMascot.render(root, 'welcome', text);
      var lipi = root.querySelector('.lipi-mascot');
      if (lipi) {
        lipi.classList.add('lipi-mascot--hero');
      }
    }

    show();
    if (timer) clearInterval(timer);
    if (tips.length > 1 && !global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(show, ROTATE_MS);
    }
  }

  document.addEventListener('DOMContentLoaded', mount);
  global.addEventListener('lipa-profile-changed', mount);

  global.LipaHomeLipi = { mount: mount };
})(typeof window !== 'undefined' ? window : global);
