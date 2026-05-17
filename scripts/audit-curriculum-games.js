#!/usr/bin/env node
/**
 * Audita actividades live del currículo: HTML existe, gameId en catálogo, duplicados.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function loadGlobalScripts() {
  const sandbox = { window: {}, global: {}, localStorage: { _data: {} } };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  sandbox.localStorage.getItem = (k) => sandbox.localStorage._data[k] || null;
  sandbox.localStorage.setItem = (k, v) => { sandbox.localStorage._data[k] = v; };
  sandbox.document = { body: { classList: { add: () => {} } } };

  const files = [
    'js/lipa-curriculum-meta.js',
    'js/lipa-curriculum-build.js',
    'js/lipa-curriculum-data.js',
    'js/lipa-brain-catalog.js',
    'js/lipa-curriculum.js'
  ];
  for (const f of files) {
    const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
    vm.runInNewContext(code, sandbox, { filename: f });
  }
  return sandbox;
}

function htmlExists(urlPath) {
  if (!urlPath || !urlPath.startsWith('/')) return false;
  const clean = urlPath.split('?')[0];
  return fs.existsSync(path.join(ROOT, clean.replace(/^\//, '')));
}

function main() {
  const ctx = loadGlobalScripts();
  ctx.LipaCurriculum.init();
  const courses = ctx.LipaCurriculumData.courses;
  const games = ctx.LipaBrainCatalog.GAMES;

  const issues = [];
  const seen = new Map();
  let liveCount = 0;

  for (const course of courses) {
    for (const block of course.subjects) {
      const subId = block.subjectId;
      for (const unit of block.units || []) {
        for (const act of unit.activities || []) {
          if (act.status !== 'live' || !act.gameId) continue;
          liveCount++;

          const url = ctx.LipaCurriculum.activityUrl(course.id, subId, unit.id, act);
          const base = act.url || (games[act.gameId] && games[act.gameId].url);

          if (!games[act.gameId]) {
            issues.push({ type: 'NO_CATALOG', course: course.id, sub: subId, unit: unit.id, act: act.id, gameId: act.gameId, title: act.title });
          }
          if (!url) {
            issues.push({ type: 'NO_URL', course: course.id, sub: subId, unit: unit.id, act: act.id, gameId: act.gameId, title: act.title });
          } else if (!htmlExists(url)) {
            issues.push({ type: 'MISSING_HTML', course: course.id, sub: subId, unit: unit.id, act: act.id, gameId: act.gameId, title: act.title, url: url.split('?')[0] });
          }

          const dupKey = course.id + '|' + subId + '|' + unit.id + '|' + act.gameId;
          if (!seen.has(dupKey)) seen.set(dupKey, []);
          seen.get(dupKey).push(act.title);

          const gameCat = games[act.gameId];
          if (gameCat) {
            const cat = gameCat.cat;
            const expected = { matematicas: 'math', lenguaje: 'lengua', ingles: 'language', naturales: 'naturales', sociales: 'sociales', 'brain-gym-diario': 'reflex' };
            const exp = expected[subId];
            if (exp && cat && cat !== exp && subId !== 'brain-gym-diario') {
              if (!(subId === 'matematicas' && cat === 'math') && !(subId === 'lenguaje' && (cat === 'lengua' || cat === 'language-es'))) {
                issues.push({ type: 'SUBJECT_MISMATCH', course: course.id, sub: subId, act: act.id, gameId: act.gameId, title: act.title, cat });
              }
            }
          }
        }
      }
    }
  }

  const duplicates = [];
  for (const [key, titles] of seen) {
    if (titles.length > 1) duplicates.push({ key, titles, count: titles.length });
  }

  console.log('Live activities:', liveCount);
  console.log('Issues:', issues.length);
  const byType = {};
  issues.forEach((i) => { byType[i.type] = (byType[i.type] || 0) + 1; });
  console.log('By type:', byType);
  issues.slice(0, 40).forEach((i) => console.log(JSON.stringify(i)));
  if (issues.length > 40) console.log('...');

  console.log('\nDuplicate gameId in same unit:', duplicates.length);
  duplicates.sort((a, b) => b.count - a.count).slice(0, 30).forEach((d) => console.log(d.count, d.key, d.titles.slice(0, 3).join(' | ')));
}

main();
