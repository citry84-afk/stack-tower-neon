/**
 * UI retos rápidos — listado y sesión de preguntas
 */
(function (global) {
  'use strict';

  var QT = global.LipaQuickTests;

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function sanitize(html) {
    return html
      .replace(/<motion\b([^>]*)>/gi, '<div$1>')
      .replace(/<\/motion>/gi, '</div>');
  }

  function renderHub(root) {
    if (!QT) {
      root.innerHTML = '<p class="curriculum-wrap">Retos rápidos no disponibles.</p>';
      return;
    }
    var courseId = qs('c');
    var ageBand = null;
    if (courseId && global.LipaCurriculum) {
      LipaCurriculum.init();
      ageBand = LipaCurriculum.courseToAgeBand(courseId);
    }
    var html =
      '<div id="lipi-mascot-mount"></div>' +
      '<header class="curriculum-hero curriculum-hero--picker">' +
      '<p class="brain-eyebrow">LIPA Brain Gym · retos rápidos</p>' +
      '<h1>Retos en 3–5 minutos</h1>' +
      '<p>Sin presión: 10 preguntas, feedback al momento y XP. Lógica, ortografía, cultura, digital y finanzas.</p>' +
      '</header><div class="curriculum-wrap">' +
      QT.renderCardsHtml({ ageBand: ageBand, courseId: courseId }) +
      '<p class="lipa-course-picker__foot"><a href="/cursos.html">← Cursos</a> · <a href="/">Inicio</a></p></div>';

    root.innerHTML = sanitize(html);
    document.title = 'Retos rápidos | LIPA Brain Gym';
    if (global.LipaMascot) LipaMascot.render(document.getElementById('lipi-mascot-mount'), 'welcome');
  }

  function renderRunner(root) {
    if (!QT) {
      root.innerHTML = '<p class="curriculum-wrap">Retos no disponibles.</p>';
      return;
    }
    var catId = qs('id');
    var cat = QT.getCategory(catId);
    if (!cat) {
      root.innerHTML = '<p class="curriculum-wrap">Reto no encontrado. <a href="/retos-rapidos.html">Ver todos</a></p>';
      return;
    }

    var seed = (global.LipaDaily && LipaDaily.getDailySeed)
      ? LipaDaily.getDailySeed('qt-run-' + catId)
      : catId + '-' + new Date().toISOString().split('T')[0];
    var session = QT.pickSession(catId, cat.questionCount, seed);
    if (!session || !session.questions.length) {
      root.innerHTML = '<p class="curriculum-wrap">Sin preguntas aún. <a href="/retos-rapidos.html">Volver</a></p>';
      return;
    }

    var routine = qs('routine') === '1';
    var courseId = qs('c');
    var state = {
      index: 0,
      correct: 0,
      questions: session.questions,
      answered: false,
      wrongSkills: []
    };

    function starsFor(percent) {
      if (percent >= 90) return '⭐⭐⭐';
      if (percent >= 70) return '⭐⭐';
      return '⭐';
    }

    function renderQuestion() {
      var q = state.questions[state.index];
      var n = state.index + 1;
      var total = state.questions.length;
      var pct = Math.round((state.index / total) * 100);
      var optionsHtml = '';
      if (q.type === 'mcq') {
        optionsHtml = '<div class="qt-options" role="group">' +
          q.options.map(function (opt, i) {
            return '<button type="button" class="qt-option" data-idx="' + i + '">' + QT.esc(opt) + '</button>';
          }).join('') + '</div>';
      } else {
        optionsHtml =
          '<div class="qt-options qt-options--tf" role="group">' +
          '<button type="button" class="qt-option" data-tf="1">Verdadero</button>' +
          '<button type="button" class="qt-option" data-tf="0">Falso</button></div>';
      }

      root.innerHTML = sanitize(
        '<div class="curriculum-wrap qt-runner">' +
        '<p class="brain-eyebrow">' + cat.emoji + ' ' + QT.esc(cat.label) + ' · ' + n + '/' + total + '</p>' +
        '<div class="curriculum-bar" role="progressbar" aria-valuenow="' + pct + '"><div class="curriculum-bar__fill" style="width:' + pct + '%"></div></div>' +
        '<h1 class="qt-prompt">' + QT.esc(q.prompt) + '</h1>' +
        optionsHtml +
        '<p class="qt-feedback" id="qt-feedback" hidden></p>' +
        '<div class="qt-actions" id="qt-actions" hidden>' +
        '<button type="button" class="lipa-btn lipa-btn--primary" id="qt-next">Siguiente</button></div></div>'
      );

      root.querySelectorAll('.qt-option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (state.answered) return;
          state.answered = true;
          var ok = false;
          if (q.type === 'mcq') {
            ok = parseInt(btn.getAttribute('data-idx'), 10) === q.correctIndex;
          } else {
            ok = (btn.getAttribute('data-tf') === '1') === !!q.correct;
          }
          if (ok) state.correct++;
          else if (q.skillTag && state.wrongSkills.indexOf(q.skillTag) < 0) {
            state.wrongSkills.push(q.skillTag);
          }
          root.querySelectorAll('.qt-option').forEach(function (b) {
            b.disabled = true;
            if (q.type === 'mcq') {
              if (parseInt(b.getAttribute('data-idx'), 10) === q.correctIndex) b.classList.add('qt-option--ok');
              else if (b === btn && !ok) b.classList.add('qt-option--bad');
            } else {
              var pickTrue = btn.getAttribute('data-tf') === '1';
              if (pickTrue === !!q.correct) b.classList.add('qt-option--ok');
              else if (b === btn) b.classList.add('qt-option--bad');
            }
          });
          var fb = document.getElementById('qt-feedback');
          fb.hidden = false;
          fb.className = 'qt-feedback ' + (ok ? 'qt-feedback--ok' : 'qt-feedback--hint');
          fb.textContent = (ok ? '¡Correcto! ' : 'Casi. ') + q.explanation;
          document.getElementById('qt-actions').hidden = false;
        });
      });

      document.getElementById('qt-next').addEventListener('click', function () {
        state.index++;
        state.answered = false;
        if (state.index >= state.questions.length) renderResult();
        else renderQuestion();
      });
    }

    function renderResult() {
      var total = state.questions.length;
      var percent = total ? Math.round((state.correct / total) * 100) : 0;
      var rec = QT.recordResult(catId, {
        correct: state.correct,
        total: total,
        percent: percent,
        wrongSkills: state.wrongSkills
      });
      var skills = {};
      state.questions.forEach(function (q) {
        skills[q.skillTag] = (skills[q.skillTag] || 0) + 1;
      });
      var skillLine = Object.keys(skills).slice(0, 3).join(', ') || cat.shortLabel;

      var nextUrl = '/retos-rapidos.html';
      if (courseId) nextUrl += '?c=' + encodeURIComponent(courseId);
      var routineBtn = '';
      if (routine && global.LipaRoutineFlow && LipaRoutineFlow.goNext) {
        routineBtn = '<button type="button" class="lipa-btn lipa-btn--primary" id="qt-routine-next">Seguir rutina →</button>';
      }

      root.innerHTML = sanitize(
        '<div class="curriculum-wrap qt-result">' +
        '<p class="brain-eyebrow">¡Sesión terminada!</p>' +
        '<h1>' + starsFor(percent) + ' ' + percent + '%</h1>' +
        '<p class="qt-result__lead">Hoy has practicado <strong>' + QT.esc(skillLine) + '</strong>. ' +
        state.correct + ' de ' + total + ' aciertos · +' + (rec.xp || 0) + ' XP</p>' +
        '<div class="qt-result__actions">' +
        routineBtn +
        '<a href="' + nextUrl + '" class="lipa-btn lipa-btn--secondary">Más retos</a>' +
        '<a href="/" class="lipa-btn lipa-btn--ghost">Inicio</a></div></div>'
      );

      var rn = document.getElementById('qt-routine-next');
      if (rn) {
        rn.addEventListener('click', function () {
          LipaRoutineFlow.goNext(false);
        });
      }

      if (global.LipaMascot) {
        LipaMascot.render(document.createElement('div'), percent >= 70 ? 'success' : 'encourage');
      }
    }

    document.title = cat.shortLabel + ' | Reto rápido | LIPA Brain Gym';
    renderQuestion();
  }

  function boot() {
    var root = document.getElementById('quick-test-app');
    if (!root || !QT) return;
    var page = document.body.getAttribute('data-quick-page');
    if (page === 'hub') renderHub(root);
    else if (page === 'run') renderRunner(root);
  }

  document.addEventListener('DOMContentLoaded', boot);
  global.LipaQuickTestPage = { boot: boot };
})(typeof window !== 'undefined' ? window : global);
