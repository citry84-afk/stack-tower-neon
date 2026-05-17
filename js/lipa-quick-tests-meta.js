/**
 * Retos rápidos — categorías (PDF fase 2: Lógica, Ortografía, Cultura general)
 */
(function (global) {
  'use strict';

  var CATEGORIES = [
    {
      id: 'logica',
      label: 'Lógica y razonamiento',
      shortLabel: 'Lógica',
      emoji: '🧩',
      theme: 'logic',
      primary: '#7C6CF0',
      soft: '#F0EDFF',
      desc: 'Patrones, series y memoria visual en 3–5 minutos.',
      ageBands: ['6-9', '10-12', '13-17'],
      questionCount: 10,
      xpPerCorrect: 8
    },
    {
      id: 'ortografia',
      label: 'Ortografía rápida',
      shortLabel: 'Ortografía',
      emoji: '✏️',
      theme: 'spelling',
      primary: '#FF8A5B',
      soft: '#FFF0E8',
      desc: 'B/V, tildes y signos con feedback al momento.',
      ageBands: ['10-12', '13-17'],
      questionCount: 10,
      xpPerCorrect: 8
    },
    {
      id: 'cultura-general',
      label: 'Cultura general',
      shortLabel: 'Cultura',
      emoji: '🌍',
      theme: 'culture',
      primary: '#2ED3A6',
      soft: '#E9FFF7',
      desc: 'Curiosidades de ciencia, geografía y naturaleza.',
      ageBands: ['6-9', '10-12', '13-17'],
      questionCount: 10,
      xpPerCorrect: 7
    },
    {
      id: 'digital',
      label: 'Competencia digital',
      shortLabel: 'Digital',
      emoji: '🔐',
      theme: 'digital',
      primary: '#4F8CFF',
      soft: '#EAF2FF',
      desc: 'Contraseñas, privacidad y uso seguro de internet.',
      ageBands: ['10-12', '13-17'],
      questionCount: 10,
      xpPerCorrect: 8
    },
    {
      id: 'finanzas',
      label: 'Finanzas básicas',
      shortLabel: 'Finanzas',
      emoji: '💰',
      theme: 'finance',
      primary: '#FFD166',
      soft: '#FFF7D6',
      desc: 'Ahorro, paga y decisiones responsables con el dinero.',
      ageBands: ['10-12', '13-17'],
      questionCount: 10,
      xpPerCorrect: 8
    }
  ];

  global.LipaQuickTestsMeta = {
    CATEGORIES: CATEGORIES
  };
})(typeof window !== 'undefined' ? window : global);
