#!/usr/bin/env node
/**
 * Cobertura LOMLOE: saberes oficiales vs actividades live etiquetadas.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadSandbox() {
  const sandbox = {
    window: {},
    global: {},
    localStorage: { _data: {} },
    dispatchEvent: () => {},
    CustomEvent: function CustomEvent() {}
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.localStorage.getItem = (k) => sandbox.localStorage._data[k] || null;
  sandbox.localStorage.setItem = (k, v) => { sandbox.localStorage._data[k] = v; };
  sandbox.document = { body: { classList: { add: () => {} } } };

  [
    'js/lipa-lomloe-ref.js',
    'js/lipa-curriculum-meta.js',
    'js/lipa-curriculum-build.js',
    'js/lipa-curriculum-data.js',
    'js/lipa-brain-catalog.js',
    'js/lipa-curriculum.js'
  ].forEach((f) => {
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
  });
  return sandbox;
}

function collectLiveActs(course) {
  const out = [];
  course.subjects.forEach((block) => {
    (block.units || []).forEach((unit) => {
      (unit.activities || []).forEach((act) => {
        if (act.status === 'live' && act.gameId) {
          out.push(Object.assign({ subjectId: block.subjectId, unitId: unit.id }, act));
        }
      });
    });
  });
  return out;
}

function main() {
  const ctx = loadSandbox();
  ctx.LipaCurriculum.init();
  const ref = ctx.LipaLomloeRef;
  const courses = ctx.LipaCurriculumData.courses.filter((c) => ref.BY_COURSE[c.id]);
  let failed = false;

  console.log('=== Cobertura LOMLOE (cursos con matriz oficial) ===\n');

  courses.forEach((course) => {
    const live = collectLiveActs(course);
    const report = ref.coverageForCourse(course.id, live);
    const ok = report.percent >= 80;
    if (!ok) failed = true;

    console.log(
      (ok ? 'OK' : 'FAIL'),
      course.id.padEnd(12),
      '| saberes:',
      report.covered + '/' + report.expected,
      '(' + report.percent + '%)',
      '| avisos juego:',
      report.mismatches.length
    );

    if (report.missing.length) {
      report.missing.forEach((s) => {
        console.log('  · sin actividad live:', s.id, '—', s.title);
      });
    }
    if (report.mismatches.length) {
      report.mismatches.slice(0, 5).forEach((m) => {
        console.log('  · juego no encaja:', m.activityId, m.gameId, '→', m.saberId);
      });
    }
  });

  if (failed) {
    console.error('\nRevisar saberes sin cubrir o actividades mal etiquetadas.');
    process.exit(1);
  }
  console.log('\nTodos los cursos con matriz LOMLOE alcanzan ≥80% de saberes cubiertos.');
}

main();
