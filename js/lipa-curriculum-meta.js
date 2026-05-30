/**
 * Metadatos de materias, etapas y niveles de dificultad — Brain Gym curricular
 */
(function (global) {
  'use strict';

  var DIFFICULTY_LABELS = {
    1: { name: 'Calentamiento', short: 'Calent.' },
    2: { name: 'Entrenamiento', short: 'Entreno' },
    3: { name: 'Reto', short: 'Reto' },
    4: { name: 'Súper reto', short: 'Súper' },
    5: { name: 'Misión final', short: 'Misión' }
  };

  var STAGES = [
    { id: 'infantil', label: 'Infantil', emoji: '🐣', desc: '3, 4 y 5 años · juegos visuales' },
    { id: 'primaria', label: 'Primaria', emoji: '📚', desc: '1º a 6º · todas las materias con juegos' },
    { id: 'eso', label: 'ESO', emoji: '🎓', desc: '1º y 2º ESO · mates, idiomas y ciencias' }
  ];

  var SUBJECTS = {
    matematicas: {
      id: 'matematicas',
      label: 'Matemáticas',
      emoji: '➕',
      theme: 'math',
      primary: '#4F8CFF',
      soft: '#EAF2FF',
      desc: 'Números, operaciones y problemas'
    },
    lenguaje: {
      id: 'lenguaje',
      label: 'Lenguaje',
      emoji: '📖',
      theme: 'language-es',
      primary: '#FF8A5B',
      soft: '#FFF0E8',
      desc: 'Lectura, escritura y comprensión'
    },
    ingles: {
      id: 'ingles',
      label: 'Inglés',
      emoji: '🇬🇧',
      theme: 'english',
      primary: '#9B7EDE',
      soft: '#F3EDFF',
      desc: 'Vocabulario y frases básicas'
    },
    naturales: {
      id: 'naturales',
      label: 'Naturales',
      emoji: '🔬',
      theme: 'science',
      primary: '#2ED3A6',
      soft: '#E9FFF7',
      desc: 'Cuerpo, seres vivos y materia'
    },
    sociales: {
      id: 'sociales',
      label: 'Sociales',
      emoji: '🌍',
      theme: 'social',
      primary: '#FFD166',
      soft: '#FFF7D6',
      desc: 'Mapas, historia y convivencia'
    },
    'brain-gym-diario': {
      id: 'brain-gym-diario',
      label: 'Brain Gym diario',
      emoji: '🧠',
      theme: 'daily',
      primary: '#FF6B6B',
      soft: '#FFECEC',
      desc: 'Rutina corta: mates, idiomas y reflejos'
    }
  };

  var SUBJECT_ORDER = [
    'matematicas',
    'lenguaje',
    'ingles',
    'naturales',
    'sociales',
    'brain-gym-diario'
  ];

  /** Cursos con más contenido curado (MVP PDF fase 1). */
  var MVP_COURSE_IDS = [
    'primaria-1', 'primaria-2', 'primaria-3',
    'primaria-4', 'primaria-5', 'primaria-6',
    'eso-1', 'eso-2'
  ];

  /** Materias del cole (sin Brain Gym diario ni retos rápidos). */
  var SCHOOL_SUBJECT_IDS = ['matematicas', 'lenguaje', 'ingles', 'naturales', 'sociales'];

  /** Minutos recomendados para Brain Gym diario. */
  var RECOMMENDED_DAILY_MINUTES = 7;

  global.LipaCurriculumMeta = {
    DIFFICULTY_LABELS: DIFFICULTY_LABELS,
    STAGES: STAGES,
    SUBJECTS: SUBJECTS,
    SUBJECT_ORDER: SUBJECT_ORDER,
    MVP_COURSE_IDS: MVP_COURSE_IDS,
    SCHOOL_SUBJECT_IDS: SCHOOL_SUBJECT_IDS,
    RECOMMENDED_DAILY_MINUTES: RECOMMENDED_DAILY_MINUTES
  };
})(typeof window !== 'undefined' ? window : global);
