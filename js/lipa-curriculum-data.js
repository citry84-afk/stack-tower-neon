/**
 * Catálogo curricular LIPA Brain Gym — cursos, materias, unidades, actividades
 */
(function (global) {
  'use strict';

  var COURSES = global.LipaCurriculumBuild.buildAllCourses();

  global.LipaCurriculumData = {
    version: 1,
    courses: COURSES
  };
})(typeof window !== 'undefined' ? window : global);
