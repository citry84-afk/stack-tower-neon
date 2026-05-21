/**
 * SEO por curso: títulos, descripciones y URLs canónicas amigables.
 */
(function (global) {
  'use strict';

  var ORIGIN = 'https://lipastudios.com';

  var BY_ID = {
    'infantil-3': {
      path: '/infantil/3-anos',
      title: 'Brain Gym 1º Infantil (3 años) · 7 min al día | LIPA',
      description:
        'Juegos de refuerzo para 1º Infantil: números, lectura y entorno. Rutina guiada de 7 minutos, gratis en el navegador.'
    },
    'infantil-4': {
      path: '/infantil/4-anos',
      title: 'Brain Gym 2º Infantil (4 años) · 7 min al día | LIPA',
      description:
        'Actividades cortas para 2º Infantil: lenguaje, mates y descubrimiento. Sin registro — empieza en un clic.'
    },
    'infantil-5': {
      path: '/infantil/5-anos',
      title: 'Brain Gym 3º Infantil (5 años) · 7 min al día | LIPA',
      description:
        'Prepara la Primaria con 7 min diarios: lectura, cálculo y naturaleza adaptados a 5 años.'
    },
    'primaria-1': {
      path: '/primaria/1-primaria',
      title: 'Refuerzo 1º Primaria · mates y lengua en 7 min | LIPA Brain Gym',
      description:
        'Mates, lengua, inglés, naturales y sociales para 1º de Primaria. Rutina guiada LOMLOE, sin descargas.'
    },
    'primaria-2': {
      path: '/primaria/2-primaria',
      title: 'Refuerzo 2º Primaria · Brain Gym 7 min | LIPA',
      description:
        'Refuerza el cole de 2º con micro-sesiones: ortografía, tablas, inglés y ciencias. Progreso en el dispositivo.'
    },
    'primaria-3': {
      path: '/primaria/3-primaria',
      title: 'Refuerzo 3º Primaria · Brain Gym 7 min | LIPA',
      description:
        '3º Primaria: rutina diaria de mates, lengua e inglés más retos rápidos. Ideal antes de exámenes.'
    },
    'primaria-4': {
      path: '/primaria/4-primaria',
      title: 'Refuerzo 4º Primaria · Brain Gym 7 min | LIPA',
      description:
        '4º Primaria con contenido ampliado: mates, lengua, naturales y sociales en sesiones de 7 minutos.'
    },
    'primaria-5': {
      path: '/primaria/5-primaria',
      title: 'Refuerzo 5º Primaria · Brain Gym 7 min | LIPA',
      description:
        '5º Primaria: refuerzo del currículo español con juegos cortos y informe para familias en el mismo móvil.'
    },
    'primaria-6': {
      path: '/primaria/6-primaria',
      title: 'Refuerzo 6º Primaria · Brain Gym 7 min | LIPA',
      description:
        '6º Primaria: repasa mates, lengua e inglés antes de la ESO. Rutina guiada y Recreo Neon como recompensa.'
    },
    'eso-1': {
      path: '/eso/1-eso',
      title: 'Refuerzo 1º ESO · Brain Gym 7 min | LIPA',
      description:
        '1º ESO: mates, lengua, inglés y sociales en micro-entrenos. Sin cuenta — progreso local.'
    },
    'eso-2': {
      path: '/eso/2-eso',
      title: 'Refuerzo 2º ESO · Brain Gym 7 min | LIPA',
      description:
        '2º ESO: sesiones cortas alineadas al cole. Un botón y Lipi guía misión a misión.'
    }
  };

  function setMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setCanonical(href) {
    var el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  }

  function setOg(prop, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + prop + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function injectJsonLd(course, meta) {
    var old = document.getElementById('lipa-course-jsonld');
    if (old) old.remove();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'lipa-course-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.label,
      description: meta.description,
      provider: { '@type': 'Organization', name: 'LIPA Studios', url: ORIGIN },
      url: ORIGIN + meta.path,
      educationalLevel: course.stage || 'Primaria',
      inLanguage: 'es',
      isAccessibleForFree: true
    });
    document.head.appendChild(script);
  }

  function applyForCourse(course) {
    if (!course) return null;
    var meta = BY_ID[course.id];
    if (!meta) {
      document.title = course.label + ' · Brain Gym en 7 min | LIPA';
      setMeta(
        'description',
        'Mates, lengua, inglés y más para ' + course.label + '. Rutina guiada de 7 minutos al día.'
      );
      return null;
    }
    document.title = meta.title;
    setMeta('description', meta.description);
    var canonical = ORIGIN + meta.path;
    setCanonical(canonical);
    setOg('og:title', meta.title);
    setOg('og:description', meta.description);
    setOg('og:url', canonical);
    injectJsonLd(course, meta);
    return meta;
  }

  var SUBJECT_SLUG = {
    matematicas: 'mates',
    lenguaje: 'lengua',
    ingles: 'ingles',
    naturales: 'naturales',
    sociales: 'sociales'
  };

  var SUBJECT_BLURB = {
    matematicas: 'Números, operaciones y problemas del cole.',
    lenguaje: 'Lectura, ortografía y comprensión.',
    ingles: 'Vocabulario y frases en inglés.',
    naturales: 'Cuerpo, seres vivos y ciencias.',
    sociales: 'Mapas, historia y convivencia.'
  };

  function seoPathForCourseId(courseId) {
    var meta = BY_ID[courseId];
    return meta ? meta.path : null;
  }

  function seoPathForSubject(courseId, subjectId) {
    var coursePath = seoPathForCourseId(courseId);
    var slug = SUBJECT_SLUG[subjectId];
    if (!coursePath || !slug) return null;
    return coursePath + '/' + slug;
  }

  function applyForSubject(course, subject) {
    if (!course || !subject) return null;
    var path = seoPathForSubject(course.id, subject.subjectId);
    if (!path) {
      document.title = subject.label + ' · ' + course.label + ' | LIPA Brain Gym';
      return null;
    }
    var title =
      subject.label + ' ' + course.label + ' · refuerzo 7 min | LIPA Brain Gym';
    var description =
      subject.label +
      ' para ' +
      course.label +
      ': ' +
      (SUBJECT_BLURB[subject.subjectId] || subject.desc || 'Juegos cortos del cole.') +
      ' Rutina guiada gratis.';
    document.title = title;
    setMeta('description', description);
    var canonical = ORIGIN + path;
    setCanonical(canonical);
    setOg('og:title', title);
    setOg('og:description', description);
    setOg('og:url', canonical);
    return { path: path, title: title, description: description };
  }

  global.LipaCourseSeo = {
    BY_ID: BY_ID,
    SUBJECT_SLUG: SUBJECT_SLUG,
    applyForCourse: applyForCourse,
    applyForSubject: applyForSubject,
    seoPathForCourseId: seoPathForCourseId,
    seoPathForSubject: seoPathForSubject
  };
})(typeof window !== 'undefined' ? window : global);
