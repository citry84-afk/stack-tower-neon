#!/usr/bin/env node
/**
 * Audita rutina diaria y dificultad por curso y materia.
 * Exit 1 si hay fallos críticos.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadSandbox(extraFiles) {
  const sandbox = {
    window: {},
    global: {},
    localStorage: { _data: {} },
    location: { search: '' },
    dispatchEvent: () => {},
    CustomEvent: function CustomEvent() {}
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.localStorage.getItem = (k) => sandbox.localStorage._data[k] || null;
  sandbox.localStorage.setItem = (k, v) => { sandbox.localStorage._data[k] = v; };
  sandbox.document = { body: { classList: { add: () => {} } } };

  const files = extraFiles || [
    'js/lipa-curriculum-meta.js',
    'js/lipa-curriculum-build.js',
    'js/lipa-curriculum-data.js',
    'js/lipa-brain-catalog.js',
    'js/lipa-brain-profiles.js',
    'js/lipa-brain-core.js',
    'js/lipa-curriculum.js'
  ];
  for (const f of files) {
    const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
    vm.runInNewContext(code, sandbox, { filename: f });
  }
  return sandbox;
}

function htmlExists(urlPath) {
  if (!urlPath) return false;
  const clean = urlPath.split('?')[0];
  if (!clean.startsWith('/')) return false;
  return fs.existsSync(path.join(ROOT, clean.replace(/^\//, '')));
}

function minBrainLevelForCourse(courseId) {
  if (courseId.indexOf('eso-2') === 0) return 8;
  if (courseId.indexOf('eso-') === 0) return 6;
  if (/^primaria-6$/.test(courseId)) return 5;
  if (/^primaria-5$/.test(courseId)) return 4;
  if (/^primaria-[34]$/.test(courseId)) return 3;
  if (/^primaria-[12]$/.test(courseId)) return 1;
  if (/^infantil-5$/.test(courseId)) return 1;
  if (/^infantil-/.test(courseId)) return 1;
  return 1;
}

function parseBrainLevel(url) {
  const m = (url || '').match(/brainLevel=(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function uniqueSubjects(steps) {
  const s = new Set();
  (steps || []).forEach((st) => { if (st.subjectId) s.add(st.subjectId); });
  return s;
}

function main() {
  const ctx = loadSandbox();
  ctx.LipaCurriculum.init();
  const courses = ctx.LipaCurriculumData.courses.filter((c) => c.status === 'live');
  const critical = [];
  const warnings = [];
  const summary = [];

  for (const course of courses) {
    const liveSubs = ctx.LipaCurriculum.listLiveSubjects(course);
    const liveIds = liveSubs.map((s) => s.subjectId);

    const routine = ctx.LipaCurriculum.buildRoutineFromCourse({
      courseId: course.id,
      minutes: 7,
      focus: 'all'
    });

    if (!routine || !routine.steps || !routine.steps.length) {
      critical.push({ type: 'NO_ROUTINE', course: course.id, liveSubjects: liveIds.length });
      continue;
    }

    const subjInRoutine = uniqueSubjects(routine.steps);
    const expectMinSubjects = Math.min(liveIds.length, 2);
    if (subjInRoutine.size < expectMinSubjects) {
      critical.push({
        type: 'ROUTINE_SINGLE_SUBJECT',
        course: course.id,
        got: [...subjInRoutine],
        expectedAtLeast: expectMinSubjects,
        live: liveIds
      });
    }

    routine.steps.forEach((step, i) => {
      if (!step.url) {
        critical.push({ type: 'STEP_NO_URL', course: course.id, step: i + 1, name: step.name });
        return;
      }
      if (!htmlExists(step.url)) {
        critical.push({ type: 'STEP_MISSING_HTML', course: course.id, step: step.name, url: step.url.split('?')[0] });
      }
      const bl = parseBrainLevel(step.url);
      const floor = minBrainLevelForCourse(course.id);
      if (bl != null && bl < floor && step.gameId && ['neon-calculo', 'tablas-relampago', 'neon-palabras'].indexOf(step.gameId) >= 0) {
        warnings.push({
          type: 'LOW_BRAIN_LEVEL',
          course: course.id,
          step: step.name,
          brainLevel: bl,
          floor
        });
      }
    });

    for (const sub of liveSubs) {
      const subRoutine = ctx.LipaCurriculum.buildRoutineForSubject(course.id, sub.subjectId, 5);
      if (!subRoutine || !subRoutine.steps || !subRoutine.steps.length) {
        critical.push({ type: 'NO_SUBJECT_ROUTINE', course: course.id, subject: sub.subjectId, label: sub.label });
        continue;
      }
      const allSameSubject = subRoutine.steps.every((st) =>
        st.subjectId === sub.subjectId || st.subjectId === 'reto-rapido'
      );
      if (!allSameSubject) {
        warnings.push({
          type: 'SUBJECT_ROUTINE_MIXED',
          course: course.id,
          subject: sub.subjectId,
          got: [...uniqueSubjects(subRoutine.steps)]
        });
      }
      subRoutine.steps.forEach((step) => {
        if (step.url && !htmlExists(step.url)) {
          critical.push({
            type: 'SUBJECT_STEP_MISSING_HTML',
            course: course.id,
            subject: sub.subjectId,
            step: step.name,
            url: step.url.split('?')[0]
          });
        }
      });
    }

    summary.push({
      course: course.id,
      label: course.label,
      liveSubjects: liveIds.length,
      routineSteps: routine.steps.length,
      routineSubjects: [...subjInRoutine],
      subjectsOk: liveSubs.every((s) => {
        const r = ctx.LipaCurriculum.buildRoutineForSubject(course.id, s.subjectId, 5);
        return r && r.steps && r.steps.length > 0;
      })
    });
  }

  console.log('=== Rutina por curso (focus: all, 7 min) ===');
  summary.forEach((s) => {
    const flag = s.routineSubjects.length >= Math.min(s.liveSubjects, 2) ? 'OK' : 'FAIL';
    console.log(
      flag,
      s.course.padEnd(12),
      '| materias:',
      s.liveSubjects,
      '| rutina:',
      s.routineSteps,
      'pasos',
      s.routineSubjects.join(', ')
    );
  });

  console.log('\n=== Materias individuales ===');
  summary.forEach((s) => {
    console.log(s.subjectsOk ? 'OK' : 'FAIL', s.course, 'todas las materias generan rutina');
  });

  if (warnings.length) {
    console.log('\nWarnings:', warnings.length);
    warnings.slice(0, 20).forEach((w) => console.log(JSON.stringify(w)));
  }

  if (critical.length) {
    console.error('\nCRITICAL FAILURES:', critical.length);
    critical.forEach((c) => console.error(JSON.stringify(c)));
    process.exit(1);
  }

  console.log('\nAll', courses.length, 'courses passed routine matrix audit.');
}

main();
